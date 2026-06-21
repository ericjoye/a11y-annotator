# a11y-annotator — Chrome Web Store Listing

## Extension Name

**a11y-annotator — Accessibility Issue Annotator**

## Short Description (132 chars max)

Scan any page for accessibility issues, pin and annotate them visually, and export shareable reports. No account required.

## Long Description

a11y-annotator is a privacy-first Chrome extension that scans any webpage for accessibility issues, lets you pin and annotate them with visual markers, and export shareable reports — all from your browser, with no account required.

**SCAN & PIN ISSUES**
Click the extension icon to run 20+ automated accessibility checks on the active page. The scanner detects missing alt text, low contrast ratios, missing form labels, empty links, heading hierarchy breaks, missing lang attributes, missing page titles, and small touch targets. Color-coded pins (red for errors, yellow for warnings, blue for info) appear directly on the problematic elements so your team can see exactly where issues are.

**ANNOTATE & SHARE**
Click any pin to add a text note explaining the fix or assigning it to a teammate. Notes persist for the page session. The Issue Dashboard panel lists all detected issues grouped by type, with severity badges and WCAG Success Criterion references (e.g., "1.1.1 Non-text Content"). When you're done, export a Markdown report with page URL, scan timestamp, issue list with severity, WCAG references, element selectors, and your annotation notes. You can also capture a screenshot with annotations overlaid and download it as a PNG.

**PRIVACY-FIRST, NO ACCOUNTS**
a11y-annotator runs entirely in your browser. The battle-tested axe-core engine is bundled locally — no data is sent to external servers, no accounts needed, no tracking. Perfect for teams working on pre-launch products, NDA-covered projects, or anyone who wants full control over their accessibility workflow.

## Key Features

- **20+ automated accessibility checks** — missing alt text, contrast, form labels, heading hierarchy, touch targets, and more
- **Visual pin overlay** — color-coded pins positioned on problematic elements (red/yellow/blue)
- **Pin & annotate** — click any pin to add notes; notes persist for the session
- **Issue Dashboard panel** — side panel with issues grouped by type, severity badges, and WCAG SC references
- **Markdown export** — one-click report with URL, timestamp, issues, annotations, and selectors
- **Screenshot capture** — download viewport with annotation overlays as PNG
- **Keyboard shortcut** — Alt+A toggles the overlay on/off
- **Zero dependencies, zero accounts** — all processing is local with bundled axe-core
- **WCAG reference links** — every issue includes the relevant WCAG Success Criterion

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `a11y-annotator/` folder
5. The a11y-annotator icon appears in your toolbar

## Requirements

- Chrome 88+ (Manifest V3 support)
- No additional dependencies

## Support

- **Contact:** eric@ericjoye.com
- **GitHub Issues:** https://github.com/ericjoye/a11y-annotator/issues
- **Documentation:** See README.md in the extension folder

## Developer

- **Developer:** Eric Joye
- **Email:** eric@ericjoye.com
- **License:** MIT
