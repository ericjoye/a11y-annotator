# a11y-annotator — Reddit Launch Drafts
STATUS: DRAFT ONLY — do not publish until Chrome Web Store approval lands.

## Channel selection
Primary recommendation: r/webdev
Secondary option: r/accessibility

## Self-promo / rules summary
- Always read the current sidebar rules and pinned mod posts before posting.
- Many subs require original contribution, not just link drops.
- If the sub discourages self-promo, post as a maker post with transparent intent and participate in comments.
- Do not repost the same copy across subs.

## r/webdev draft

### Title
Built a Chrome extension that pins WCAG accessibility issues directly on the page

### Body
I kept auditing the same pages over and over, and I wanted something faster than Lighthouse reports + manual notes.

So I made a11y-annotator: it runs 20+ automated WCAG checks in-browser and draws red/yellow/blue pins on the elements that need attention. Click a pin to annotate, review everything in a side dashboard with WCAG references, then export Markdown or an annotated screenshot.

Free tier covers scanning, pins, annotations, dashboard review, Markdown export, and screenshot capture. Pro is $4.99 one-time for CSV/JSON export and batch scan.

Key points I tried to keep simple:
- no account, no telemetry
- works on localhost, staging, and production
- Alt+A toggles the overlay

Landing page: https://ericjoye.github.io/a11y-annotator/
Source: https://github.com/ericjoye/a11y-annotator
Support: support@ericjoye.com

I’m specifically looking for feedback from people who do frontend QA or a11y audits: what checks would actually save you time day to day?

## r/accessibility draft

### Title
Maker post: free Chrome WCAG scanner with visual annotations and local-only processing

### Body
I’m sharing a tool I built that tries to make initial accessibility audits faster without adding another cloud service or signup flow.

a11y-annotator is a Chrome extension that scans pages for common WCAG 2.1 Level AA issues and marks them visually on the page. You can annotate those marks, group issues in a dashboard, and export a report or screenshot.

Free includes scans, visual pins, annotations, dashboard review, Markdown export, and screenshot capture. Pro is $4.99 one-time and adds CSV/JSON export and batch scan.

What I tried to preserve:
- local processing only; no external requests
- no account required
- minimal UI / not a full audit platform

Landing page: https://ericjoye.github.io/a11y-annotator/
Source: https://github.com/ericjoye/a11y-annotator
Support: support@ericjoye.com

If you’re used to running audits, I’d especially like to know which checks are missing or misleading in practice.

## Notes
- Prefer r/webdev first if only posting one place.
- Add a brief maker disclosure and respond in-thread; link-only posts are often removed.
- If the sub requires flair, prepare a “Tool” or “Show and Tell” flair label if available.
