# Hacker News — Show HN draft
> Status: draft only — do NOT publish until CWS approval is confirmed

## Title
Show HN: a11y-annotator — Pin accessibility issues directly on the page

## Body
I built a Chrome extension that scans any webpage for WCAG accessibility issues and lets you pin visual annotations directly onto the problematic elements — no account required.

What it does:
- Runs 20+ automated accessibility checks
- Overlays color-coded pins on the page: red for errors, yellow for warnings, blue for info
- Click any pin to add a text note for your team
- Export a Markdown report with all issues, WCAG references, and your annotations
- Screenshot capture with annotations overlaid

Why I built it:
Tools like WAVE and axe tell you what's wrong, but the workflow after that is painful. You end up taking screenshots, pasting into Jira, manually describing issues. a11y-annotator is for the "I need to show my team what's wrong" workflow.

Privacy:
Everything runs locally in the browser. No accounts, no tracking, no data sent to any server. Safe for NDA-covered projects.

Tech:
Manifest V3 Chrome extension, vanilla JS, accessibility engine bundled locally.

Free tier includes all core features.
Pro is $4.99 one-time for persistent annotations, CSV/JSON export, and batch scans.

Landing page:
https://ericjoye.github.io/a11y-annotator/

Would love feedback from anyone working on accessibility.

## HN notes
- Keep updates factual and limited.
- Avoid posting again within 24 hours if the first one doesn't launch.
- Be ready for critical comments about duplicate tooling; the strongest defense is the pin-to-element workflow and privacy-first/local angle.
