from __future__ import annotations

import argparse
from pathlib import Path

from kokoro_mlx import KokoroTTS


def main() -> None:
    parser = argparse.ArgumentParser(description="Render the CueChaos demo narration with Kokoro-82M.")
    parser.add_argument("text", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--voice", default="af_bella")
    parser.add_argument("--speed", type=float, default=1.03)
    args = parser.parse_args()

    narration = args.text.read_text(encoding="utf-8").strip()
    args.output.parent.mkdir(parents=True, exist_ok=True)

    with KokoroTTS.from_pretrained() as model:
        result = model.save(
            narration,
            str(args.output),
            voice=args.voice,
            speed=args.speed,
            sample_rate=24_000,
        )

    print(f"Voice: {result.voice}")
    print(f"Duration: {result.duration:.1f} seconds")
    print(f"Saved: {args.output}")


if __name__ == "__main__":
    main()
