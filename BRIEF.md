# a11y-annotator

## One-liner
A privacy-first Chrome extension that scans any page for accessibility issues, lets you pin and annotate them visually, and exports shareable reports — no account required.

## Target user
- **Primary:** Frontend developers and QA engineers who need to quickly document and share accessibility issues with their team
- **Secondary:** Accessibility consultants who audit client sites and need to deliver actionable reports
- **Tertiary:** Content editors and product managers who spot accessibility problems but lack technical tools to document them

## Problem
Finding accessibility issues is easy — tools like WAVE and axe do that for free. But the *workflow after finding them* is painful:

1. **"I found an issue, now what?"** — Existing tools show you problems but don't help you document, annotate, and share them with teammates.
2. **Screenshots + spreadsheets are tedious** — QA engineers waste time taking screenshots, pasting into Jira/Google Sheets, and manually describing what's wrong.
3. **Context gets lost** — A list of "missing alt text, contrast ratio 2.1:1" doesn't tell a developer *where* on the page the problem is without a screenshot.
4. **Privacy concerns** — Tools like AAArdvark require accounts and send page data to their servers. Developers working on unpublished products (NDA, pre-launch) can't use them.
5. **Expensive for what you get** — AAArdvark starts at $99/mo. Axe DevTools' Jira integration is $40+/mo. Overkill for small teams who just need to annotate and share.

## MVP scope (buildable in < 1 hour, zero paid dependencies)

### Features
1. **Page scanner** — Content script runs 20+ automated accessibility checks on the active page (missing alt text, low contrast, missing form labels, empty links, heading hierarchy breaks, missing lang attribute, missing page title, small touch targets < 24×24px)
2. **Visual overlay** — Color-coded pins (red=error, yellow=warning, blue=info) positioned on problematic elements. Toggle overlay on/off via popup or keyboard shortcut (Alt+A)
3. **Pin & annotate** — Click any pin to add a text note. Notes persist for the page session. Delete or edit notes
4. **Issue dashboard panel** — Side panel (or popup tab) listing all detected issues grouped by type, with severity badges and WCAG SC references (e.g., "1.1.1 Non-text Content")
5. **Export report** — One-click export to Markdown containing: page URL, scan timestamp, issue list with severity + WCAG reference + element selector + annotation notes. Copy to clipboard or download as .md file
6. **Screenshot capture** — Capture the current viewport with annotations overlaid, download as PNG

### Tech approach
- **Manifest V3 Chrome extension** — Pure client-side, no backend
- **Vanilla JS + CSS** — No frameworks, zero dependencies
- **axe-core (open source, MPL-2.0)** — Drop-in accessibility engine, 300+ rules, battle-tested by Deque/Deque Systems. Included as a bundled JS file (no CDN, no external calls). This is free and open source
- **html2canvas (MIT license)** — For screenshot capture with annotations
- **Chrome Side Panel API** — For the issue dashboard (available since Chrome 114)
- **chrome.storage.session** — For per-session annotation state (no persistent storage needed)

### Monetization
- **Free tier:** All core features (scan, annotate, export Markdown). No account needed
- **Pro tier ($5/mo or $48/yr):**
  - Export to CSV and structured JSON
  - Batch scan (crawl all same-origin links on a page, up to 50 URLs)
  - Custom annotation templates
  - Priority support
- **Team tier ($15/mo per seat):**
  - Shared annotation sessions (share a link to view someone's annotated page)
  - Slack webhook integration for reports
- **Alternative:** One-time "lifetime deal" on AppSumo/Gumroad for early traction ($29 one-time for Pro)

### Risks
1. **axe-core is heavy (~300KB minified)** — Mitigation: lazy-load it only when user triggers a scan, not on every page load
2. **AAArdvark and A11yInspect already exist** — Differentiation: a11y-annotator is privacy-first (no account, no server), free core features, and focused specifically on annotation/export rather than being a full audit platform. AAArdvark is a paid SaaS; A11yInspect is free but minimal (just screenshots, no annotation dashboard)
3. **Chrome DevTools Lighthouse already gives accessibility scores** — DevTools doesn't let you annotate, pin, or export. a11y-annotator is for the "I need to show my team what's wrong" workflow, not the "give me a score" workflow
4. **Low willingness to pay for developer tools** — Mitigation: Free tier must be genuinely useful (not crippled). Monetize the "nice to have" batch export and team features
5. **axe-core licensing (MPL-2.0)** — MPL-2.0 is permissive but requires disclosing modifications to axe-core itself. Mitigation: use axe-core unmodified and include license file

## Definition of done for the MVP

- [ ] Extension installs and loads on any HTTPS page
- [ ] Clicking the extension icon triggers a scan and displays visual pins on problematic elements
- [ ] Side panel shows issue list grouped by type with severity + WCAG reference
- [ ] Clicking a pin opens an annotation input; notes are stored for the session
- [ ] Export button generates a Markdown report (page URL, timestamp, all issues with annotations) and copies to clipboard
- [ ] Screenshot button captures viewport with pins/annotations and downloads as PNG
- [ ] Toggle overlay visibility without re-scanning
- [ ] Tested on: a blog post (WordPress), a SaaS dashboard (React), and a news site
- [ ] No external network calls during scanning (axe-core runs locally)
- [ ] README.md with install instructions, screenshots, and feature overview
