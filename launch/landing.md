# a11y-annotator — Landing Page Copy

> **DRAFT — license-key unlock not yet wired.** This copy is structurally complete but
> references a paid tier that does not yet function. Publish only after the unlock is built
> and the Offer's "what the buyer gets" is no longer 🔴.

---

## Headline

**Find accessibility issues, pin them on the page, hand your team a report — in ten minutes, nothing leaves your browser.**

## Subheadline

A Chrome extension that runs 16 WCAG checks locally, drops color-coded pins on broken elements, lets you annotate each one, and exports a Markdown report. No account. No server. $4.99 one-time.

---

## Benefit Bullets

1. **Skip the screenshot tax.** Pins land on the actual elements — your team sees *where* and *what* without you spending an afternoon in a spreadsheet. (From the Language Bank: "I just need to show the dev *where* on the page it's broken.")

2. **Nothing leaves your browser.** All 16 checks run locally on your machine. Pre-launch pages, NDA work, staging environments — no data goes anywhere. (From the Language Bank: "Does this send my page to a server?" → No. Make it the headline.)

3. **One report, ready to paste.** Export Markdown with page URL, WCAG SC references, element selectors, and your annotation notes. Drop it into the ticket. Done. (From the Language Bank: "pin it, annotate it, ship the report.")

---

## CTA

**Get a11y-annotator — $4.99 one-time**

[Buy on the Chrome Web Store] *(link pending — see LAUNCH-REPORT)*

Free to install. Scans and shows issues immediately. License key unlocks CSV/JSON export, batch scan, and annotation templates.

---

## Pricing

| Plan | Price | What you get |
|------|-------|-------------|
| Free-to-install | $0 | Scan, pin, annotate, Markdown export. No account. |
| Pro (one-time) | $4.99 | + CSV/JSON export, batch scan (same-origin crawl, up to 50 URLs), annotation templates. |
| Lifetime | $19.99 | Same as Pro, framed for the "never think about it again" buyer. |
| Bundle with TabForge | $7.99 | Pro + TabForge. |

No subscription. No account. Pay once, use forever.

---

## FAQ

**Q: Does this send my page to a server?**
No. All 16 checks run entirely in your browser. No network calls during scanning. Your page data never leaves your machine.

**Q: How is this different from axe or WAVE, which are free?**
axe and WAVE *score*. a11y-annotator *documents and hands off*. They give you a list of problems. This drops pins on the elements, lets you annotate them, and exports a report your team can actually use.

**Q: Does it work on a page behind login / staging?**
Yes. It runs in your browser on whatever you can see. No server round-trip — it works on localhost, staging, password-protected pages.

**Q: One-time or subscription?**
One-time. $4.99 for Pro. $19.99 for Lifetime. No recurring charges, ever.

**Q: Can I export to Jira / CSV?**
Markdown export is available free. CSV and JSON export are Pro features (license key required).

**Q: What if I need a refund?**
One-time price + "runs entirely local, uninstall and your data was never anywhere" — that's the risk reversal. If it doesn't work for you, email support@a11y-annotator.dev for a refund. No questions.

**Q: Will it work on any site?**
Any HTTPS page. WordPress blog, React SaaS dashboard, static HTML, internal staging — if you can load it in Chrome, it works.

**Q: Is the free version useful or crippled?**
The free install scans, pins, annotates, and exports Markdown. It's a complete tool. Pro adds batch scan, CSV/JSON, and annotation templates — the time-savers for people doing this daily.

---

## Competitive frame

| Tool | What it does | a11y-annotator |
|------|-------------|-----------------|
| AAArdvark ($99/mo) | Annotate + share, requires account + server | Same annotate job, no account, no server, 20× cheaper |
| axe / WAVE (free) | Detect + score | We document + hand off — different job |
| A11yInspect (free) | Screenshots only | We add annotation dashboard + structured export |

---

## What to do next (for Eric)

This copy is DRAFT until the license-key unlock is wired. To go from DRAFT to live:

1. Define the exact free-vs-paid line (what gates behind the key).
2. Wire the key check in the extension.
3. Run `python3 ~/hermes_ops/scripts/stripe_setup.py a11y-annotator --name Pro --price 4.99` to create the Stripe Product + Payment Link.
4. Drop the Payment Link URL into the CTA button above.
5. Then this copy is ready to submit.
