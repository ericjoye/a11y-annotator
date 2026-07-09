# Reddit launch drafts
> Status: draft only — do NOT publish until CWS approval is confirmed

## Self-promo rule summary as of draft date
Based on common Reddit behavior, avoid treating Reddit as a first launch channel unless the post is framed as a genuine problem-sharing or tools post, not a 'buy my extension' ad. The safest approach is to lead with the workflow/pain point, disclose ownership plainly, and invite feedback. If moderators remove a post, do not argue publicly; move on quietly.

Ready-to-post notes may still be rejected by moderators at their discretion. If that happens, treat Reddit as a secondary channel, not primary.

## r/webdev draft

### Title
I made a free Chrome extension that pins accessibility issues onto the actual elements

### Body
Hey r/webdev,

I built **a11y-annotator** — a Chrome extension that scans any page for WCAG issues and then pins colored markers directly onto the elements that need fixing.

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

## r/accessibility draft

### Title
A small Chrome extension for annotating WCAG issues directly on pages

### Body
Hi r/accessibility,

I've been working on **a11y-annotator**, a Chrome extension for more actionable accessibility reviews.

Instead of only exporting a list of issues, it places color-coded markers on the page and lets you add a note to each marker. Then you can export a report with the issue, WC reference, and your annotation.

I did this because auditors and devs often need the same thing: a clear "this one, here" picture without a long ticket thread.

Main checks include:
- missing alt text
- contrast ratios
- missing form labels
- empty links
- heading hierarchy
- missing lang/ title metadata
- small touch targets

Local browser processing only. No accounts, no upstream data upload. Free core features, one $4.99 Pro upgrade for CSV/JSON export and batch scanning.

Link: https://ericjoye.github.io/a11y-annotator/

Feedback from accessibility consultants is especially welcome since I'm still deciding what counts as genuinely useful versus overengineered.

## Recommendation
Do NOT lead a first CWS post-launch sprint with Reddit. Use Product Hunt / Show HN first. Reddit is a useful secondary channel only if the framing stays genuinely helpful and ownership is disclosed plainly.
