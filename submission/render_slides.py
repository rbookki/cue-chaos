from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "media"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1280, 720
BG = "#0b0a12"
PANEL = "#171521"
INK = "#f6f1e8"
MUTED = "#aba7b5"
PINK = "#ff5477"
LIME = "#c9ff59"
BLUE = "#82c7ff"

BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
MONO = "/System/Library/Fonts/SFNSMono.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def base():
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, W, 9), fill=PINK)
    draw.ellipse((1120, -130, 1420, 170), fill="#25192b")
    draw.ellipse((-180, 560, 160, 900), fill="#17231d")
    draw.text((64, 42), "CUECHAOS", font=font(BOLD, 22), fill=PINK)
    draw.text((1130, 45), "BUILD WEEK", font=font(MONO, 17), fill=MUTED)
    return image, draw


def lines(draw, text, xy, max_chars, size, fill=INK, spacing=10, family=REG):
    x, y = xy
    for line in wrap(text, width=max_chars):
        draw.text((x, y), line, font=font(family, size), fill=fill)
        y += size + spacing
    return y


def title_slide():
    image, draw = base()
    draw.text((64, 158), "INSIDE", font=font(BOLD, 92), fill=INK)
    draw.text((64, 250), "SABOTEUR", font=font(BOLD, 92), fill=PINK)
    draw.text((70, 382), "Trust the team. Suspect everyone.", font=font(REG, 35), fill=INK)
    draw.rounded_rectangle((70, 470, 615, 548), radius=18, fill=PANEL, outline="#3c3748", width=2)
    draw.text((96, 492), "3–6 PLAYERS  •  8–12 MINUTES  •  ZERO API", font=font(BOLD, 20), fill=LIME)
    draw.text((70, 625), "A causal, pass-the-phone social deduction game", font=font(REG, 22), fill=MUTED)
    image.save(OUT / "00-title.png")


def codex_slide():
    image, draw = base()
    draw.text((64, 105), "GPT-5.6 IN CODEX", font=font(BOLD, 54), fill=INK)
    draw.text((66, 172), "A controlled case room, not runtime improvisation", font=font(REG, 27), fill=MUTED)

    draw.rounded_rectangle((64, 235, 576, 628), radius=22, fill=PANEL, outline="#3c3748", width=2)
    draw.text((94, 267), "STORY ROOM CONSTRAINTS", font=font(BOLD, 18), fill=PINK)
    constraints = [
        "One mission and hard deadline",
        "Credible Saboteur motive",
        "Measurable progress and risk",
        "Clues that survive into later phases",
        "Phases fail if reordered",
    ]
    y = 318
    for item in constraints:
        draw.ellipse((96, y + 8, 108, y + 20), fill=LIME)
        y = lines(draw, item, (122, y), 34, 24, INK, 4) + 18

    draw.rounded_rectangle((616, 235, 1216, 628), radius=22, fill="#111019", outline="#3c3748", width=2)
    draw.text((648, 267), "app/sabotage-director.ts", font=font(MONO, 17), fill=BLUE)
    code = [
        "const replyAll: CaseDefinition = {",
        "  goal: 'Prove the forecast was falsified',",
        "  deadline: 'before the 5 PM board vote',",
        "  phases: [trace, secure, prove],",
        "  winRules: { catchSaboteur: true },",
        "};",
        "",
        "✓ typed case data",
        "✓ bilingual UI",
        "✓ automated game-rule tests",
    ]
    y = 314
    for index, line in enumerate(code):
        color = LIME if line.startswith("✓") else (PINK if "goal:" in line or "deadline:" in line else INK)
        draw.text((648, y), line, font=font(MONO, 18), fill=color)
        y += 30
    image.save(OUT / "11-codex.png")


def zero_api_slide():
    image, draw = base()
    draw.text((64, 115), "ZERO API CALLS", font=font(BOLD, 62), fill=INK)
    draw.text((67, 188), "WHILE PLAYING", font=font(BOLD, 62), fill=LIME)
    draw.rounded_rectangle((66, 315, 1214, 550), radius=24, fill=PANEL, outline="#3c3748", width=2)
    items = [
        ("NO API KEY", "Judges can open the live build and play immediately."),
        ("NO VISITOR COST", "A stranger cannot spend the creator's model credits."),
        ("REVIEWED CONTENT", "GPT-5.6 output ships as typed, tested local data."),
    ]
    x = 96
    for heading, body in items:
        draw.text((x, 350), heading, font=font(BOLD, 21), fill=PINK)
        lines(draw, body, (x, 396), 27, 22, INK, 7)
        x += 370
    image.save(OUT / "12-zero-api.png")


def end_slide():
    image, draw = base()
    draw.text((64, 170), "FOLLOW THE", font=font(BOLD, 76), fill=INK)
    draw.text((64, 250), "EVIDENCE.", font=font(BOLD, 76), fill=PINK)
    draw.text((68, 387), "Play CueChaos — Inside Saboteur", font=font(REG, 32), fill=INK)
    draw.rounded_rectangle((68, 466, 1100, 535), radius=18, fill=PANEL, outline="#3c3748", width=2)
    draw.text((92, 487), "cue-chaos-party-56.rbookki.chatgpt.site", font=font(MONO, 23), fill=LIME)
    draw.text((68, 620), "Built with GPT-5.6 in Codex", font=font(BOLD, 21), fill=MUTED)
    image.save(OUT / "13-end.png")


if __name__ == "__main__":
    title_slide()
    codex_slide()
    zero_api_slide()
    end_slide()
    print("Rendered submission title cards.")
