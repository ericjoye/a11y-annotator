#!/usr/bin/env python3
"""Generate professional a11y-annotator icons at 16x16, 48x48, and 128x128."""

from PIL import Image, ImageDraw, ImageFont
import os
import math

BRAND_BLUE = (74, 144, 217)       # #4A90D9
BRAND_BLUE_DARK = (52, 112, 178)  # #3470B2
WHITE = (255, 255, 255)
CHECK_GREEN = (46, 204, 113)      # #2ECC71

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "icons")


def draw_icon(size: int) -> Image.Image:
    """Draw a professional accessibility icon: eye with checkmark."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Scale factor relative to 128px canvas
    s = size / 128.0

    # Background rounded rectangle
    padding = max(1, int(4 * s))
    radius = max(2, int(20 * s))
    draw.rounded_rectangle(
        [padding, padding, size - padding, size - padding],
        radius=radius,
        fill=BRAND_BLUE,
    )

    # Inner subtle border
    border_w = max(1, int(1.5 * s))
    draw.rounded_rectangle(
        [padding + border_w, padding + border_w,
         size - padding - border_w, size - padding - border_w],
        radius=radius - border_w,
        outline=(255, 255, 255, 40),
        width=border_w,
    )

    # Eye shape — centered
    cx, cy = size // 2, size // 2
    eye_w = int(44 * s)
    eye_h = int(26 * s)

    # Eye outline (almond shape) using ellipse
    eye_bbox = [cx - eye_w, cy - eye_h, cx + eye_w, cy + eye_h]
    draw.ellipse(eye_bbox, fill=WHITE, outline=WHITE)

    # Iris (smaller circle inside eye)
    iris_r = int(12 * s)
    iris_bbox = [cx - iris_r, cy - iris_r, cx + iris_r, cy + iris_r]
    draw.ellipse(iris_bbox, fill=BRAND_BLUE_DARK)

    # Pupil
    pupil_r = int(6 * s)
    pupil_bbox = [cx - pupil_r, cy - pupil_r, cx + pupil_r, cy + pupil_r]
    draw.ellipse(pupil_bbox, fill=WHITE)

    # Highlight dot on pupil
    hl_r = max(1, int(2.5 * s))
    hl_x = cx + int(2.5 * s)
    hl_y = cy - int(2.5 * s)
    draw.ellipse(
        [hl_x - hl_r, hl_y - hl_r, hl_x + hl_r, hl_y + hl_r],
        fill=(255, 255, 255, 200),
    )

    # Checkmark at bottom-right corner of icon
    check_cx = size - int(22 * s)
    check_cy = size - int(22 * s)
    check_r = int(10 * s)

    # Checkmark circle
    check_bbox = [
        check_cx - check_r, check_cy - check_r,
        check_cx + check_r, check_cy + check_r,
    ]
    draw.ellipse(check_bbox, fill=CHECK_GREEN)

    # Checkmark stroke
    stroke_w = max(1, int(2.5 * s))
    # Short stroke (top-left to center)
    x1 = check_cx - int(4 * s)
    y1 = check_cy
    x2 = check_cx - int(1 * s)
    y2 = check_cy + int(3 * s)
    draw.line([(x1, y1), (x2, y2)], fill=WHITE, width=stroke_w)
    # Long stroke (center to bottom-right)
    x3 = check_cx + int(5 * s)
    y3 = check_cy - int(3 * s)
    draw.line([(x2, y2), (x3, y3)], fill=WHITE, width=stroke_w)

    return img


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    sizes = [16, 48, 128]

    for size in sizes:
        icon = draw_icon(size)
        path = os.path.join(OUTPUT_DIR, f"icon{size}.png")
        icon.save(path, "PNG", optimize=True)
        print(f"Generated {path} ({size}x{size})")

    print("Done.")


if __name__ == "__main__":
    main()
