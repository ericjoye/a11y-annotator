# a11y-annotator — Launch Posting Guide

Product status: **LIVE on CWS, FREE + $4.99 Pro**
URLs:
- Landing: https://ericjoye.github.io/a11y-annotator/
- CWS: https://chromewebstore.google.com/detail/a11y-annotator/pffjjfbhnlgpnlooepdlhijbhfamijbo
- Stripe: https://buy.stripe.com/7sY4gAcPm9J7fOe8qcbAs0e
- Blog: https://ericjoye.github.io/a11y-annotator/blog/

---

## 1. Product Hunt Launch (do FIRST)

URL: https://www.producthunt.com/posts/new

**Name:** a11y-annotator — Accessibility Scanner & WCAG Checker
**Tagline:** Pin accessibility issues directly on the page
**Description:**
a11y-annotator is a privacy-first Chrome extension that scans any webpage for WCAG accessibility issues and lets you annotate them visually — right on the page.

Instead of just listing problems in a panel, a11y-annotator pins color-coded markers onto the actual elements that need fixing. Click any pin to add a note, then export a Markdown report or annotated screenshot for your team.

Unlike auditing tools that require accounts and upload your page data, all scanning and annotation happens locally in your browser — making it safe for pre-launch and NDA-covered projects.

**URL:** https://chromewebstore.google.com/detail/a11y-annotator/pffjjfbhnlgpnlooepdlhijbhfamijbo

**Topics:** Developer Tools, Accessibility, Chrome Extensions, Productivity, Frontend

**Images to upload (saved at):**
- /home/ericjoye/businesses/a11y-annotator/marketing-assets/screenshot-dashboard.jpg
- /home/ericjoye/businesses/a11y-annotator/marketing-assets/comparison-graphic.jpg
- /home/ericjoye/businesses/a11y-annotator/marketing-assets/social-square.jpg

**Maker comment (post after launch):**
"I built this because tools like WAVE and axe tell you what's wrong, but the workflow after that is painful: screenshots, spreadsheets, Jira tickets, and hoping the dev understands the context. a11y-annotator is for the 'show my team exactly what's wrong' workflow.

Everything runs locally. No accounts, no tracking, no data leaves the browser. That was important because many teams I know can't use cloud tools on pre-launch or NDA-covered products.

Live landing page: https://ericjoye.github.io/a11y-annotator/"

---

## 2. Hacker News — Show HN (same day or next day)

URL: https://news.ycombinator.com/submit

**Title:** Show HN: a11y-annotator — Pin accessibility issues directly on the page

**Body:**
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

Landing page: https://ericjoye.github.io/a11y-annotator/

Would love feedback from anyone working on accessibility.

**Be ready for:** Critical comments about duplicate tooling. Strongest defense = pin-to-element workflow + privacy-first/local processing angle.

**Updates:** Keep factual and limited. Don't post again within 24h if it doesn't take off.

---

## 3. Reddit (post 24-48h after PH/HN)

### r/webdev
**Title:** I made a free Chrome extension that pins accessibility issues onto the actual elements

**Body:**
Hey r/webdev,

I built a11y-annotator — a Chrome extension that scans any page for WCAG issues and then pins colored markers directly onto the elements that need fixing.

For me, the audit workflow was the annoying part:
- WAVE/axe finds issues.
- I'd screenshot the page.
- Paste into a ticket or doc.
- Hope the dev understands which instance I meant.

This tries to skip the middle steps.

What it can do:
- run automated checks
- show pin annotations on elements
- let you add notes per pin
- export a Markdown report
- capture an annotated screenshot

It runs locally in the browser. No accounts, no telemetry, no tracking. Works fine for pre-launch or NDA pages because nothing leaves the client.

Free tier: all core features.
Pro: $4.99 one-time for CSV/JSON export and batch scanning.

Link: https://ericjoye.github.io/a11y-annotator/

Would rather hear from people doing audits regularly: is the workflow useful, or am I solving a problem that doesn't exist?

### r/accessibility
**Title:** A small Chrome extension for annotating WCAG issues directly on pages

**Body:**
Hi r/accessibility,

I've been working on a11y-annotator, a Chrome extension for more actionable accessibility reviews.

Instead of only exporting a list of issues, it places color-coded markers on the page and lets you add a note to each marker. Then you can export a report with the issue, WC reference, and your annotation.

I did this because auditors and devs often need the same thing: a clear "this one, here" picture without a long ticket thread.

Main checks include:
- missing alt text
- contrast ratios
- missing form labels
- empty links
- heading hierarchy
- missing lang/title metadata
- small touch targets

Local browser processing only. No accounts, no upstream data upload. Free core features, one $4.99 Pro upgrade for CSV/JSON export and batch scanning.

Link: https://ericjoye.github.io/a11y-annotator/

Feedback from accessibility consultants is especially welcome since I'm still deciding what counts as genuinely useful versus overengineered.

---

## 4. X/Twitter (post 1 immediately, space out 2-4 by 24-48h)

### Post 1: Launch announcement (with screenshot-dashboard.jpg)
I built a Chrome extension that pins WCAG accessibility issues directly on the page. Red/yellow/blue markers on the actual elements, annotation notes, Markdown export. Privacy-first — nothing leaves your browser. Free to install, $4.99 one-time Pro unlock.
https://ericjoye.github.io/a11y-annotator/

### Post 2: Problem-focused (24h later)
Every a11y audit tool tells you what's wrong. None of them let you show your team where. a11y-annotator pins issues visually on the page → annotate → export a shareable report. No accounts, no server uploads.
https://chromewebstore.google.com/detail/a11y-annotator/pffjjfbhnlgpnlooepdlhijbhfamijbo

### Post 3: Pro/value hook (24h after post 2)
$4.99 one-time for CSV/JSON export + batch scan. Or use the free version forever. Either way — no accounts, no tracking, everything local. Built for devs who need to hand off a11y reports without the spreadsheet overhead.
https://ericjoye.github.io/a11y-annotator/

### Post 4: Dev angle (24h after post 3)
Alt+A to toggle. Works on localhost. 20+ WCAG 2.1 AA checks. Pins on elements, not in a panel. a11y-annotator is free to install on CWS right now — Pro is $4.99 one-time.
https://chromewebstore.google.com/detail/a11y-annotator/pffjjfbhnlgpnlooepdlhijbhfamijbo

**To post:** Use xurl CLI (`xurl post "text"`) or post manually at x.com.

---

## 5. Directory submissions (after launch)

- **AlternativeTo:** https://alternativeto.net/
- **SaaSHub:** https://www.saashub.com/
- **G2:** https://www.g2.com/
- **Capterra:** https://www.capterra.com/

Create an account on each and submit. Category: Accessibility / Developer Tools.

---

## Execution order (recommended)

1. Post to Product Hunt (PH) ← highest impact, do this first
2. Same day: Post Show HN
3. Next day: Post to r/webdev and r/accessibility
4. Same day: X/Twitter Post 1
5. +24h: X/Twitter Post 2
6. +24h: X/Twitter Post 3
7. +24h: X/Twitter Post 4
8. Within 1 week: Directory submissions (AlternativeTo, SaaSHub, G2, Capterra)
