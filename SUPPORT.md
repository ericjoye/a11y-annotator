# Support — a11y-annotator

## How to reach us

Email **support@ericjoye.com**. This is a one-person product — there's no ticket system, no chat widget, just a real inbox. Response time: **24-48 hours**, usually faster.

When you write in, include:
- What you were trying to do
- The Chrome version you're on (`chrome://version`)
- Your license key or Stripe payment ID, if it's a Pro/billing question

## Lost or missing key

If you paid and never got a key, or lost the email:
1. Email support@ericjoye.com with your Stripe payment confirmation (receipt email or the last 4 of the card, plus approximate date/time of purchase).
2. We look up the payment intent id in the Stripe dashboard, then check `keys/issued.json` for a matching record.
3. If found: we resend the existing key — no new charge.
4. If not found (first-time lookup): we re-run `node scripts/sign-license-key.js <payment_intent_id> "<email>"` to issue a fresh key tied to that same payment, log it, and send it.

Reissue turnaround: same as general support, 24-48 hours.

## Refunds

**14 days, no questions asked.** Request a refund via the Stripe receipt link in your confirmation email, or email support@ericjoye.com and we'll refund from the Stripe dashboard directly. See `REFUNDS.md` for the full policy text.

## Known limitations (read before buying if this matters to you)

- **Automated checks catch roughly 40-50% of WCAG issues.** This is true of every automated accessibility scanner, not just this one — things like meaningful alt text, logical reading order, and keyboard-trap edge cases need a human. a11y-annotator finds what's programmatically detectable (missing attributes, contrast ratios, structural issues) and gives you a fast way to document and hand off the rest. It is not a substitute for a manual audit.
- **Chrome and Chromium-based browsers only** (Edge, Brave, etc. work; Firefox and Safari do not — it's a Manifest V3 extension).
- **Annotations are session-only** on the free tier — they clear when the browser session ends. Export your Markdown report before closing the tab if you need to keep it.
- **No cloud sync, no team accounts.** Everything is local to the machine and browser profile you activated on.

## What we don't do

No phone support, no live chat, no SLA. If that's a dealbreaker for your team, this probably isn't the right tool.
