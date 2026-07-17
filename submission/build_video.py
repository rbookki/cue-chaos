from __future__ import annotations

import io
import math
import struct
import sys
import wave
from dataclasses import dataclass
from pathlib import Path

from PIL import Image


WIDTH = 1280
HEIGHT = 720
FPS = 10
EXTRA_SECONDS = 2.0


@dataclass(frozen=True)
class Segment:
    filename: str
    weight: float


SEGMENTS = [
    Segment("00-title.png", 6),
    Segment("01-home.png", 10),
    Segment("02-how-to-play.png", 7),
    Segment("03-role-deal.png", 5),
    Segment("04-saboteur.png", 10),
    Segment("05-investigator.png", 6),
    Segment("06-mission.png", 10),
    Segment("07-ballot.png", 7),
    Segment("08-consequence.png", 11),
    Segment("09-causal-round.png", 9),
    Segment("10-finale.png", 11),
    Segment("11-codex.png", 15),
    Segment("12-zero-api.png", 9),
    Segment("13-end.png", 5),
]


def riff_chunk(chunk_id: bytes, payload: bytes) -> bytes:
    padding = b"\0" if len(payload) % 2 else b""
    return chunk_id + struct.pack("<I", len(payload)) + payload + padding


def riff_list(list_type: bytes, payload: bytes) -> bytes:
    return riff_chunk(b"LIST", list_type + payload)


def encode_jpeg(path: Path) -> bytes:
    with Image.open(path) as source:
        image = source.convert("RGB")
        if image.size != (WIDTH, HEIGHT):
            canvas = Image.new("RGB", (WIDTH, HEIGHT), "black")
            image.thumbnail((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
            canvas.paste(image, ((WIDTH - image.width) // 2, (HEIGHT - image.height) // 2))
            image = canvas
        stream = io.BytesIO()
        image.save(stream, format="JPEG", quality=86, optimize=True, progressive=False)
        return stream.getvalue()


def build_headers(
    total_frames: int,
    max_jpeg_size: int,
    audio_frames: int,
    sample_rate: int,
    channels: int,
    sample_width: int,
) -> bytes:
    block_align = channels * sample_width
    audio_bytes_per_second = sample_rate * block_align
    microseconds_per_frame = round(1_000_000 / FPS)
    max_bytes_per_second = max_jpeg_size * FPS + audio_bytes_per_second
    main_header = struct.pack(
        "<IIIIIIIIII4I",
        microseconds_per_frame,
        max_bytes_per_second,
        0,
        0x10 | 0x100,
        total_frames,
        0,
        2,
        max(max_jpeg_size, math.ceil(audio_bytes_per_second / FPS)),
        WIDTH,
        HEIGHT,
        0,
        0,
        0,
        0,
    )

    video_stream_header = struct.pack(
        "<4s4sIHHIIIIIIIIhhhh",
        b"vids",
        b"MJPG",
        0,
        0,
        0,
        0,
        1,
        FPS,
        0,
        total_frames,
        max_jpeg_size,
        8_600,
        0,
        0,
        0,
        WIDTH,
        HEIGHT,
    )
    video_format = struct.pack(
        "<IiiHH4sIiiII",
        40,
        WIDTH,
        HEIGHT,
        1,
        24,
        b"MJPG",
        WIDTH * HEIGHT * 3,
        0,
        0,
        0,
        0,
    )
    video_list = riff_list(
        b"strl",
        riff_chunk(b"strh", video_stream_header) + riff_chunk(b"strf", video_format),
    )

    audio_stream_header = struct.pack(
        "<4s4sIHHIIIIIIIIhhhh",
        b"auds",
        b"\0\0\0\0",
        0,
        0,
        0,
        0,
        block_align,
        audio_bytes_per_second,
        0,
        audio_frames,
        math.ceil(audio_bytes_per_second / FPS),
        0xFFFFFFFF,
        block_align,
        0,
        0,
        0,
        0,
    )
    audio_format = struct.pack(
        "<HHIIHH",
        1,
        channels,
        sample_rate,
        audio_bytes_per_second,
        block_align,
        sample_width * 8,
    )
    audio_list = riff_list(
        b"strl",
        riff_chunk(b"strh", audio_stream_header) + riff_chunk(b"strf", audio_format),
    )

    return riff_list(b"hdrl", riff_chunk(b"avih", main_header) + video_list + audio_list)


def frame_schedule(total_frames: int) -> list[bytes]:
    total_weight = sum(segment.weight for segment in SEGMENTS)
    schedule: list[bytes] = []
    used = 0
    for index, segment in enumerate(SEGMENTS):
        if index == len(SEGMENTS) - 1:
            count = total_frames - used
        else:
            count = round(total_frames * segment.weight / total_weight)
        schedule.extend([segment.filename.encode()] * count)
        used += count
    if len(schedule) != total_frames:
        raise RuntimeError("Frame schedule does not match the requested duration.")
    return schedule


def write_avi(media_dir: Path, narration_path: Path, output_path: Path) -> None:
    jpeg_frames = {segment.filename: encode_jpeg(media_dir / segment.filename) for segment in SEGMENTS}
    max_jpeg_size = max(len(frame) for frame in jpeg_frames.values())

    with wave.open(str(narration_path), "rb") as audio:
        channels = audio.getnchannels()
        sample_width = audio.getsampwidth()
        sample_rate = audio.getframerate()
        narration_frame_count = audio.getnframes()
        audio_data = audio.readframes(narration_frame_count)

    if channels != 1 or sample_width != 2:
        raise RuntimeError("Narration must be mono 16-bit PCM WAV.")

    narration_seconds = narration_frame_count / sample_rate
    total_frames = math.ceil((narration_seconds + EXTRA_SECONDS) * FPS)
    total_audio_frames = math.floor(total_frames * sample_rate / FPS)
    expected_audio_bytes = total_audio_frames * channels * sample_width
    audio_data = audio_data.ljust(expected_audio_bytes, b"\0")[:expected_audio_bytes]

    headers = build_headers(
        total_frames,
        max_jpeg_size,
        total_audio_frames,
        sample_rate,
        channels,
        sample_width,
    )
    schedule = frame_schedule(total_frames)
    index_entries: list[bytes] = []

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("wb") as output:
        output.write(b"RIFF")
        riff_size_position = output.tell()
        output.write(struct.pack("<I", 0))
        output.write(b"AVI ")
        output.write(headers)

        output.write(b"LIST")
        movi_size_position = output.tell()
        output.write(struct.pack("<I", 0))
        movi_type_position = output.tell()
        output.write(b"movi")

        block_align = channels * sample_width
        for frame_index, encoded_name in enumerate(schedule):
            filename = encoded_name.decode()
            jpeg = jpeg_frames[filename]
            video_chunk_position = output.tell()
            output.write(riff_chunk(b"00dc", jpeg))
            index_entries.append(
                struct.pack(
                    "<4sIII",
                    b"00dc",
                    0x10,
                    video_chunk_position - movi_type_position,
                    len(jpeg),
                )
            )

            start_audio_frame = math.floor(frame_index * sample_rate / FPS)
            end_audio_frame = math.floor((frame_index + 1) * sample_rate / FPS)
            start_byte = start_audio_frame * block_align
            end_byte = end_audio_frame * block_align
            audio_chunk = audio_data[start_byte:end_byte]
            audio_chunk_position = output.tell()
            output.write(riff_chunk(b"01wb", audio_chunk))
            index_entries.append(
                struct.pack(
                    "<4sIII",
                    b"01wb",
                    0,
                    audio_chunk_position - movi_type_position,
                    len(audio_chunk),
                )
            )

        movi_end = output.tell()
        output.write(riff_chunk(b"idx1", b"".join(index_entries)))
        file_end = output.tell()

        output.seek(movi_size_position)
        output.write(struct.pack("<I", movi_end - movi_type_position))
        output.seek(riff_size_position)
        output.write(struct.pack("<I", file_end - 8))

    print(f"Narration: {narration_seconds:.1f} seconds")
    print(f"Video: {total_frames / FPS:.1f} seconds at {FPS} fps")
    print(f"Built {output_path} ({output_path.stat().st_size / 1024 / 1024:.1f} MiB)")


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("Usage: build_video.py <media-dir> <narration.wav> <output.avi>")
    write_avi(Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]))


if __name__ == "__main__":
    main()
