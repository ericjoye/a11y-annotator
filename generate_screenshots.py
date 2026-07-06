#!/usr/bin/env python3
"""Generate professional Chrome Web Store screenshots for a11y-annotator using Pillow."""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

OUT = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(OUT, exist_ok=True)

# ── Color Palette ──
BG_DARK      = (24, 24, 27)       # #18181b
BG_CARD      = (39, 39, 42)       # #27272a
WHITE        = (255, 255, 255)
TEXT_PRIMARY = (250, 250, 250)    # #fafafa
TEXT_MUTED   = (161, 161, 170)    # #a1a1aa
PRIMARY      = (74, 144, 217)     # #4A90D9
ERROR        = (239, 68, 68)      # #ef4444
WARNING      = (245, 158, 11)     # #f59e0b
INFO         = (13, 110, 253)     # #0d6efd
SUCCESS      = (34, 197, 94)      # #22c55e
BORDER       = (63, 63, 70)       # #3f3f46

def font(size, bold=False):
    """Try to load a nice system font, fall back to default."""
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/TTF/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()

def rounded_rect(draw, xy, radius, fill, outline=None, outline_width=1):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill,
                           outline=outline or fill, width=outline_width)

def center_text(draw, y, text, fnt, color, W):
    """Draw horizontally centered text."""
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, y), text, font=fnt, fill=color)

def draw_browser_chrome(draw, y, W, url="example.com"):
    """Draw a browser top bar."""
    h = 40
    rounded_rect(draw, [0, y, W, y+h], 0, fill=(30, 30, 34))
    # Traffic lights
    colors = [(239, 68, 68), (245, 158, 11), (34, 197, 94)]
    for i, c in enumerate(colors):
        draw.ellipse([16 + i*20, y+14, 28 + i*20, y+26], fill=c)
    # URL bar
    url_x = 90
    rounded_rect(draw, [url_x, y+10, W-20, y+30], 6, fill=(50, 50, 55))
    draw.text((url_x+12, y+15), f"🔒 {url}", font=font(12), fill=TEXT_MUTED)
    return y + h

def draw_pin(draw, x, y, number, severity, size=24):
    """Draw a circular annotation pin."""
    color = {"error": ERROR, "warning": WARNING, "info": INFO}[severity]
    draw.ellipse([x-size//2, y-size//2, x+size//2, y+size//2], fill=color, outline=WHITE, width=2)
    fnt = font(11, bold=True)
    text = str(number)
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text((x - tw//2, y - th//2), text, font=fnt, fill=WHITE)

# ══════════════════════════════════════════════════════════════
# Screenshot 1: Extension Popup Showing Scan Results
# ══════════════════════════════════════════════════════════════
def make_screenshot_1():
    W, H = 400, 520
    img = Image.new("RGBA", (W, H), BG_DARK)
    draw = ImageDraw.Draw(img)

    # Header gradient area
    for y in range(80):
        r = int(102 + (118-102) * y / 80)
        g = int(126 + (75-126) * y / 80)
        b = int(234 + (162-234) * y / 80)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Header text
    draw.text((W//2 - 55, 18), "🔍 a11y-annotator", font=font(16, bold=True), fill=WHITE)
    draw.text((W//2 - 60, 42), "Scan any page for accessibility issues", font=font(10), fill=(255,255,255,180))

    y = 95
    # Status card
    rounded_rect(draw, [20, y, W-20, y+80], 10, fill=BG_CARD, outline=BORDER)
    draw.text((35, y+10), "Scan Results", font=font(13, bold=True), fill=TEXT_PRIMARY)
    # Error/warning/info badges
    badges = [("5 Errors", ERROR), ("3 Warnings", WARNING), ("2 Info", INFO)]
    bx = 35
    for label, color in badges:
        rounded_rect(draw, [bx, y+38, bx+95, y+70], 8, fill=color + (40,))
        draw.text((bx+12, y+46), label, font=font(10, bold=True), fill=color)
        bx += 105

    y = 190
    # Scan button (green)
    rounded_rect(draw, [20, y, W-20, y+48], 10, fill=SUCCESS)
    center_text(draw, y+14, "✕  Clear Overlay", font(13, bold=True), WHITE, W)

    y += 60
    # Side panel button
    rounded_rect(draw, [20, y, W-20, y+44], 10, fill=(32, 201, 151))
    center_text(draw, y+12, "📋  Open Issue Panel", font(13, bold=True), WHITE, W)

    y += 56
    # Divider
    draw.line([(20, y), (W-20, y)], fill=BORDER, width=1)

    y += 12
    # Export button
    rounded_rect(draw, [20, y, W-20, y+44], 10, fill=PRIMARY)
    center_text(draw, y+12, "📄  Export Markdown Report", font(13, bold=True), WHITE, W)

    y += 56
    # Screenshot button
    rounded_rect(draw, [20, y, W-20, y+44], 10, fill=(111, 66, 193))
    center_text(draw, y+12, "📸  Capture Screenshot", font(13, bold=True), WHITE, W)

    # Footer
    center_text(draw, H-30, "Press  Alt+A  to toggle overlay", font(10), TEXT_MUTED, W)

    path = os.path.join(OUT, "screenshot-1-popup.png")
    img.save(path)
    print(f"✅ Saved: {path}")

# ══════════════════════════════════════════════════════════════
# Screenshot 2: Side Panel with Issue Dashboard
# ══════════════════════════════════════════════════════════════
def make_screenshot_2():
    W, H = 420, 640
    img = Image.new("RGBA", (W, H), BG_DARK)
    draw = ImageDraw.Draw(img)

    # Header gradient
    for y in range(70):
        r = int(102 + (118-102) * y / 70)
        g = int(126 + (75-126) * y / 70)
        b = int(234 + (162-234) * y / 70)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    draw.text((W//2 - 55, 14), "🔍 a11y-annotator", font=font(14, bold=True), fill=WHITE)
    draw.text((W//2 - 50, 38), "example.com/checkout", font=font(10), fill=(255,255,255,160))

    # Summary bar
    y = 75
    bar_h = 56
    rounded_rect(draw, [12, y, W-12, y+bar_h], 8, fill=BG_CARD, outline=BORDER)
    items = [("7", "Errors", ERROR), ("4", "Warnings", WARNING), ("2", "Info", INFO)]
    bw = (W - 24) // 3
    for i, (count, label, color) in enumerate(items):
        x0 = 12 + i*bw + bw//2
        draw.text((x0 - 8, y+10), count, font=font(18, bold=True), fill=color)
        draw.text((x0 - 20, y+32), label, font=font(9), fill=TEXT_MUTED)

    # Toolbar
    y = y + bar_h + 10
    btns = [("🔍 Scan", SUCCESS), ("📄 Export", PRIMARY), ("✕ Clear", ERROR)]
    bw = (W - 36) // 3
    for i, (label, color) in enumerate(btns):
        bx = 12 + i*(bw+6)
        rounded_rect(draw, [bx, y, bx+bw, y+32], 6, fill=color)
        center_text(draw, y+9, label, font(10, bold=True), WHITE, bx+bw)
        # Hack: reposition
    # Redraw properly
    y_btn = y
    for i, (label, color) in enumerate(btns):
        bx = 12 + i*(bw+6)
        rounded_rect(draw, [bx, y_btn, bx+bw, y_btn+32], 6, fill=color)
        bbox = draw.textbbox((0,0), label, font=font(10, bold=True))
        tw = bbox[2]-bbox[0]
        draw.text((bx + (bw-tw)//2, y_btn+9), label, font=font(10, bold=True), fill=WHITE)

    # Filter bar
    y = y_btn + 40
    filters = [("All", True), ("🔴 Errors", False), ("🟡 Warnings", False), ("🔵 Info", False)]
    fw = (W - 36) // 4
    for i, (label, active) in enumerate(filters):
        bx = 12 + i*(fw+4)
        color = PRIMARY if active else BG_CARD
        border = PRIMARY if active else BORDER
        rounded_rect(draw, [bx, y, bx+fw, y+26], 12, fill=color, outline=border)
        bbox = draw.textbbox((0,0), label, font=font(9))
        tw = bbox[2]-bbox[0]
        draw.text((bx + (fw-tw)//2, y+7), label, font=font(9), fill=WHITE if active else TEXT_MUTED)

    # Search bar
    y += 34
    rounded_rect(draw, [12, y, W-12, y+28], 8, fill=BG_CARD, outline=BORDER)
    draw.text((22, y+7), "Filter issues by keyword...", font=font(10), fill=TEXT_MUTED)

    # Issue cards
    y += 38
    issues = [
        ("error", "1", "Image missing alt text", "WCAG 1.1.1 (A) — Non-text Content", "<img>"),
        ("error", "2", "Form field missing label", "WCAG 1.3.1 (A) — Info & Relationships", "<input>"),
        ("error", "3", "Link has no accessible text", "WCAG 2.4.4 (A) — Link Purpose", "<a>"),
        ("warning", "4", "Low contrast: 3.2:1 (needs 4.5:1)", "WCAG 1.4.3 (AA) — Contrast", "<p>"),
        ("info", "5", "No skip navigation link found", "WCAG 2.4.1 (A) — Bypass Blocks", "<body>"),
    ]

    for sev, num, msg, wcag, tag in issues:
        color = {"error": ERROR, "warning": WARNING, "info": INFO}[sev]
        card_h = 72
        if y + card_h > H - 20:
            break
        rounded_rect(draw, [12, y, W-12, y+card_h], 8, fill=BG_CARD, outline=BORDER)
        # Severity pin
        draw_pin(draw, 30, y+20, int(num), sev, 18)
        # Message
        draw.text((52, y+10), msg[:42], font=font(10, bold=True), fill=TEXT_PRIMARY)
        draw.text((52, y+28), wcag[:50], font=font(9), fill=color)
        draw.text((52, y+44), f"<{tag}>", font=font(9, bold=True), fill=TEXT_MUTED)
        y += card_h + 6

    # Footer
    rounded_rect(draw, [0, H-26, W, H], 0, fill=BG_CARD, outline=BORDER)
    center_text(draw, H-18, "13 issues", font(9), TEXT_MUTED, W)

    path = os.path.join(OUT, "screenshot-2-dashboard.png")
    img.save(path)
    print(f"✅ Saved: {path}")

# ══════════════════════════════════════════════════════════════
# Screenshot 3: Annotation Pins on a Webpage
# ══════════════════════════════════════════════════════════════
def make_screenshot_3():
    W, H = 1280, 720
    img = Image.new("RGBA", (W, H), (245, 245, 250))
    draw = ImageDraw.Draw(img)

    # Browser chrome
    y = draw_browser_chrome(draw, 0, W, "example.com/products")

    # Fake webpage content
    # Nav bar
    rounded_rect(draw, [0, y, W, y+60], 0, fill=WHITE, outline=(228, 228, 231))
    draw.text((40, y+20), "ExampleStore", font=font(16, bold=True), fill=(24, 24, 27))
    nav_items = ["Products", "About", "Contact"]
    nx = 300
    for item in nav_items:
        draw.text((nx, y+22), item, font=font(12), fill=TEXT_MUTED)
        nx += 80
    # Cart icon area
    draw.text((W-120, y+22), "🛒 Cart (2)", font=font(12), fill=TEXT_MUTED)

    # Hero section
    y += 60
    rounded_rect(draw, [0, y, W, y+200], 0, fill=(240, 240, 245))
    draw.text((80, y+40), "Our Best Products", font=font(28, bold=True), fill=(24, 24, 27))
    draw.text((80, y+85), "Discover amazing items at great prices.", font=font(14), fill=TEXT_MUTED)

    # Product cards row
    y += 200
    card_w = 260
    gap = 24
    cx = 80
    product_names = ["Wireless Headphones", "Smart Watch Pro", "Laptop Stand", "USB-C Hub"]
    prices = ["$79.99", "$299.00", "$45.00", "$34.99"]
    for pi, (name, price) in enumerate(zip(product_names, prices)):
        if cx + card_w > W - 80:
            break
        # Card background
        rounded_rect(draw, [cx, y, cx+card_w, y+240], 12, fill=WHITE, outline=(228, 228, 231))
        # Product image placeholder
        rounded_rect(draw, [cx+12, y+12, cx+card_w-12, y+130], 8, fill=(230, 230, 235))
        draw.text((cx+40, y+55), "📷 No alt text", font=font(11), fill=TEXT_MUTED)
        # Product name
        draw.text((cx+16, y+142), name, font=font(13, bold=True), fill=(24, 24, 27))
        # Price
        draw.text((cx+16, y+165), price, font=font(14, bold=True), fill=ERROR)
        # Fake buy button
        rounded_rect(draw, [cx+12, y+196, cx+card_w-12, y+228], 8, fill=(200, 200, 210))
        bbox = draw.textbbox((0,0), "Add to Cart", font=font(12, bold=True))
        tw = bbox[2]-bbox[0]
        draw.text((cx + (card_w-tw)//2, y+204), "Add to Cart", font=font(12, bold=True), fill=(24, 24, 27))

        # Draw annotation pins on problematic areas
        if pi == 0:
            # Pin 1: Missing alt text on image
            draw_pin(draw, cx+card_w//2, y+20, 1, "error", 28)
        elif pi == 1:
            # Pin 2: Missing alt text
            draw_pin(draw, cx+card_w//2, y+20, 2, "error", 28)
        elif pi == 2:
            # Pin 3: Low contrast price text
            draw_pin(draw, cx+40, y+172, 3, "warning", 28)

        cx += card_w + gap

    # Lower section with form
    y = y + 260
    rounded_rect(draw, [80, y, W-80, y+120], 12, fill=WHITE, outline=(228, 228, 231))
    draw.text((100, y+16), "Newsletter Signup", font=font(16, bold=True), fill=(24, 24, 27))
    draw.text((100, y+44), "Stay updated with our latest products", font=font(12), fill=TEXT_MUTED)
    # Input field (no label - accessibility issue)
    rounded_rect(draw, [100, y+68, W-300, y+100], 8, fill=(255,255,255), outline=(200, 200, 210))
    draw.text((116, y+76), "Enter your email...", font=font(12), fill=TEXT_MUTED)
    # Submit button
    rounded_rect(draw, [W-290, y+68, W-100, y+100], 8, fill=PRIMARY)
    center_text(draw, y+76, "Subscribe", font(12, bold=True), WHITE, 190)

    # Pin 4: Missing form label
    draw_pin(draw, W-310, y+84, 4, "error", 28)

    # Overlay label
    rounded_rect(draw, [W-340, H-46, W-20, H-16], 8, fill=(0,0,0,160))
    draw.text((W-330, H-37), "🔍 5 issues found  •  Click pins to annotate", font=font(11), fill=WHITE)

    path = os.path.join(OUT, "screenshot-3-annotations.png")
    img.save(path)
    print(f"✅ Saved: {path}")

# ══════════════════════════════════════════════════════════════
# Screenshot 4: Export Report Format
# ══════════════════════════════════════════════════════════════
def make_screenshot_4():
    W, H = 700, 800
    img = Image.new("RGBA", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    y = 30
    # Title
    draw.text((30, y), "# Accessibility Report", font=font(22, bold=True), fill=(24, 24, 27))
    y += 40
    draw.text((30, y), "**URL:** https://example.com/checkout", font=font(11), fill=(80, 80, 90))
    y += 22
    draw.text((30, y), "**Title:** Checkout — Example Store", font=font(11), fill=(80, 80, 90))
    y += 22
    draw.text((30, y), "**Scanned:** 2026-01-15T14:32:00Z  |  **Issues found:** 8", font=font(11), fill=(80, 80, 90))
    y += 30
    draw.line([(30, y), (W-30, y)], fill=(228, 228, 231), width=1)
    y += 20

    # Summary
    draw.text((30, y), "## Summary", font=font(14, bold=True), fill=(24, 24, 27))
    y += 26
    for icon, count, label, color in [("🔴", "5", "Errors", ERROR), ("🟡", "2", "Warnings", WARNING), ("🔵", "1", "Info", INFO)]:
        draw.text((40, y), f"{icon} {count} {label}", font=font(11), fill=color)
        y += 20

    y += 16
    draw.line([(30, y), (W-30, y)], fill=(228, 228, 231), width=1)
    y += 20

    # Errors section
    draw.text((30, y), "## Errors", font=font(14, bold=True), fill=ERROR)
    y += 26

    errors = [
        ("1. Image missing alt text",
         "WCAG 1.1.1 (A) — Non-text Content",
         "<img>  |  Selector: `div.hero > img`",
         "Fix: Add descriptive alt text describing the product image."),
        ("2. Form field missing label",
         "WCAG 1.3.1 (A) — Info & Relationships",
         "<input>  |  Selector: `input[type=\"email\"]`",
         "Fix: Add a `<label>` element or `aria-label` attribute."),
        ("3. Link has no accessible text",
         "WCAG 2.4.4 (A) — Link Purpose (In Context)",
         "<a>  |  Selector: `a.btn-icon`",
         "Note: This is the social media icon link — add aria-label."),
    ]

    for title, wcag, elem, note in errors:
        if y > H - 80:
            break
        draw.text((40, y), title, font=font(11, bold=True), fill=(24, 24, 27))
        y += 20
        draw.text((55, y), wcag, font=font(10), fill=ERROR)
        y += 18
        draw.text((55, y), elem, font=font(10), fill=(150, 150, 160))
        y += 18
        # Note highlight
        rounded_rect(draw, [55, y, W-35, y+22], 4, fill=(255, 249, 230), outline=WARNING)
        draw.text((62, y+4), note[:75], font=font(10), fill=(102, 77, 3))
        y += 34

    # Export note
    y += 10
    rounded_rect(draw, [30, y, W-30, y+50], 8, fill=(240, 240, 245), outline=(228, 228, 231))
    bbox = draw.textbbox((0,0), "📄 This report was generated by a11y-annotator", font=font(11, bold=True))
    tw = bbox[2]-bbox[0]
    draw.text(((W-tw)//2, y+8), "📄 This report was generated by a11y-annotator", font=font(11, bold=True), fill=(24, 24, 27))
    draw.text(((W-180)//2, y+28), "Free Chrome Extension — ericjoye.com/a11y-annotator", font=font(9), fill=TEXT_MUTED)

    path = os.path.join(OUT, "screenshot-4-report.png")
    img.save(path)
    print(f"✅ Saved: {path}")

# ══════════════════════════════════════════════════════════════
# Screenshot 5: Extension Icon in Chrome Toolbar
# ══════════════════════════════════════════════════════════════
def make_screenshot_5():
    W, H = 320, 200
    img = Image.new("RGBA", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Fake browser toolbar
    rounded_rect(draw, [0, 0, W, 52], 0, fill=(230, 230, 235), outline=(200, 200, 210))

    # Back/forward/refresh icons
    icons = ["←", "→", "↻"]
    ix = 16
    for icon in icons:
        draw.text((ix, 18), icon, font=font(14), fill=(80, 80, 90))
        ix += 30

    # URL bar
    rounded_rect(draw, [ix+4, 12, W-120, 40], 16, fill=WHITE, outline=(200, 200, 210))
    draw.text((ix+16, 22), "🔒 https://example.com", font=font(11), fill=(80, 80, 90))

    # Toolbar extension area
    tx = W - 110
    # Other extension icons (generic)
    draw.ellipse([tx, 14, tx+24, 38], fill=(180, 180, 190))
    draw.text((tx+6, 20), "⚙", font=font(12), fill=WHITE)
    tx -= 34
    draw.ellipse([tx, 14, tx+24, 38], fill=(180, 180, 190))
    draw.text((tx+6, 20), "🔑", font=font(12), fill=WHITE)
    tx -= 34

    # THE a11y-annotator icon (highlighted with tooltip)
    # Blue rounded square with eye
    icon_size = 26
    ix0 = tx
    rounded_rect(draw, [ix0, 14, ix0+icon_size, 14+icon_size], 6, fill=PRIMARY)
    # Eye on icon
    draw.ellipse([ix0+6, 18, ix0+20, 30], fill=WHITE)
    draw.ellipse([ix0+9, 21, ix0+17, 27], fill=PRIMARY)
    draw.ellipse([ix0+11, 23, ix0+15, 25], fill=WHITE)

    # Tooltip / badge
    tooltip = "🔍 a11y-annotator — Click to scan"
    rounded_rect(draw, [ix0-60, 48, ix0+90, 72], 6, fill=(24, 24, 27))
    bbox = draw.textbbox((0,0), tooltip, font=font(9))
    tw = bbox[2]-bbox[0]
    draw.text((ix0 + (150-tw)//2 - 52, 54), tooltip, font=font(9), fill=WHITE)

    # Tooltip arrow
    draw.polygon([(ix0+10, 48), (ix0+16, 42), (ix0+22, 48)], fill=(24, 24, 27))

    # Page content below
    y = 70
    rounded_rect(draw, [20, y, W-20, y+100], 8, fill=(245, 245, 250), outline=(228, 228, 231))
    draw.text((40, y+16), "Product Page", font=font(14, bold=True), fill=(24, 24, 27))
    draw.text((40, y+40), "Click the extension icon to scan this", font=font(11), fill=TEXT_MUTED)
    draw.text((40, y+58), "page for accessibility issues.", font=font(11), fill=TEXT_MUTED)

    # Label at bottom
    center_text(draw, H-20, "Extension icon in Chrome toolbar", font(10, bold=True), (150, 150, 160), W)

    path = os.path.join(OUT, "screenshot-5-toolbar.png")
    img.save(path)
    print(f"✅ Saved: {path}")


if __name__ == "__main__":
    print("🎨 Generating Chrome Web Store screenshots...\n")
    make_screenshot_1()
    make_screenshot_2()
    make_screenshot_3()
    make_screenshot_4()
    make_screenshot_5()
    print(f"\n✅ All 5 screenshots saved to: {OUT}/")
