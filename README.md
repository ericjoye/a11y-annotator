# a11y-annotator

**Scan any page for accessibility issues, pin annotations, and export reports.**

A privacy-first Chrome extension that runs 16 thorough accessibility checks directly in your browser — no accounts, no external network calls, no dependencies.

## Features

- **16 Accessibility Checks** — Missing alt text, low contrast, missing labels, empty links, heading hierarchy, missing lang, missing title, small touch targets, duplicate IDs, missing skip links, table headers, iframe titles, image buttons, empty headings, video captions, focus indicators
- **Visual Pin Overlay** — Color-coded pins (red=error, yellow=warning, blue=info) positioned on problematic elements
- **Annotations** — Click any pin to add notes; notes persist for the session
- **Side Panel Issue List** — Grouped by severity with WCAG references (SC number, level, name)
- **Markdown Export** — Full report with URL, timestamp, issues, WCAG refs, and annotations
- **Screenshot Capture** — Save the current page as PNG
- **Keyboard Shortcut** — Press `Alt+A` to toggle the overlay
- **Zero Dependencies** — Everything runs locally, no external libraries needed
- **Privacy-First** — No network calls during scanning, no data leaves the browser

## Installation

### Load as Unpacked Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `a11y-annotator/` folder
5. The extension icon will appear in your toolbar

### Usage

1. Navigate to any webpage
2. Click the extension icon to open the popup
3. Click **"Scan Page"** to run accessibility checks
4. View results:
   - **Pins** appear on the page over problematic elements
   - **Popup** shows error/warning/info counts
   - **Side Panel** shows the full issue list grouped by severity
5. Click any pin to add an annotation note
6. Use **"Export Markdown Report"** to copy or download a full report
7. Use **"Capture Screenshot"** to save the page as PNG
8. Press `Alt+A` to toggle the overlay on/off

## File Structure

```
a11y-annotator/
├── manifest.json        # Chrome extension manifest (MV3)
├── background.js        # Service worker (message routing, keyboard shortcuts)
├── content.js           # Accessibility scanner + annotation engine (536 lines)
├── content.css          # Overlay pin and popup styles
├── popup.html           # Extension popup UI
├── popup.js             # Popup logic (scan, export, screenshot, side panel)
├── sidepanel.html       # Side panel UI
├── sidepanel.css        # Side panel styles
├── sidepanel.js         # Side panel logic (issue list, filtering, annotations)
├── icons/
│   ├── icon16.png       # 16x16 icon
│   ├── icon48.png       # 48x48 icon
│   └── icon128.png      # 128x128 icon
└── README.md            # This file
```

## WCAG Coverage

| Check | WCAG SC | Level | Name |
|-------|---------|-------|------|
| Missing alt text | 1.1.1 | A | Non-text Content |
| Low contrast | 1.4.3 | AA | Contrast (Minimum) |
| Missing labels | 1.3.1 | A | Info and Relationships |
| Empty links | 2.4.4 | A | Link Purpose (In Context) |
| Heading hierarchy | 1.3.1 | A | Info and Relationships |
| Missing lang | 3.1.1 | A | Language of Page |
| Missing title | 2.4.2 | A | Page Titled |
| Small touch targets | 2.5.8 | AA | Target Size |
| Duplicate IDs | 4.1.1 | A | Parsing |
| Missing skip link | 2.4.1 | A | Bypass Blocks |
| Table headers | 1.3.1 | A | Info and Relationships |
| iframe titles | 4.1.2 | A | Name, Role, Value |
| Image buttons | 1.1.1 | A | Non-text Content |
| Empty headings | 1.3.1 | A | Info and Relationships |
| Video captions | 1.2.2 | A | Captions (Prerecorded) |
| Focus indicators | 2.4.7 | AA | Focus Visible |

## Permissions

- `activeTab` — Access the current tab for scanning
- `sidePanel` — Show the issue list side panel
- `storage` — Persist annotations during session
- `scripting` — Inject content script on demand
- `<all_urls>` — Scan any webpage

## Development

All JavaScript files pass `node --check` syntax validation. The extension has zero external dependencies — all scanning logic is implemented natively in `content.js`.

### Running Tests

```bash
# Syntax check all JS files
node --check content.js
node --check background.js
node --check popup.js
node --check sidepanel.js
```

## License

MIT
