# a11y-annotator — Hacker News "Show HN" Draft
STATUS: DRAFT ONLY — do not publish until Chrome Web Store approval lands.

## Title
Show HN: a11y-annotator – WCAG accessibility scanner that pins issues directly in Chrome

## Post body
I built a Chrome extension that scans pages for WCAG accessibility issues and draws colored annotation pins directly on the elements that fail.

Instead of running Lighthouse and wading through a console report, you can click once, see the issues visually, annotate them, and export a Markdown report or annotated screenshot.

It covers 20+ checks including:
- missing alt text
- contrast ratios
- missing form labels
- empty links
- heading hierarchy
- touch target size
- lang attribute
- page title

Each issue includes the relevant WCAG Success Criterion reference.

What I focused on:
- privacy-first / no accounts
- zero external requests / no telemetry
- works on localhost, staging, and production
- keyboard shortcut: Alt+A

Free tier includes scans, pins, annotations, dashboard review, Markdown export, and screenshot capture. Pro is $4.99 one-time and adds CSV/JSON export and batch scan.

Landing page: https://ericjoye.github.io/a11y-annotator/
Chrome Web Store listing: pending approval

Source / issues: https://github.com/ericjoye/a11y-annotator

I’m most interested in feedback on what additional checks would actually help people auditing real sites, so I’d rather hear from people who regularly do a11y QA than generic feature requests.

## Notes
- Keep it maker-first and specific
- Avoid marketing speak; HN prefers concrete problem/solution framing
- If asked, mention manifest v3, local-first rationale, and why this isn’t just another Lighthouse wrapper
- Do not post until CWS approval is confirmed
