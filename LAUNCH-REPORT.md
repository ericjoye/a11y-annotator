# LAUNCH-REPORT — a11y-annotator

> **Status: DRAFT** — copy is structurally complete but references a paid tier that
> does not yet function (license-key unlock not wired). Not ready to publish.

---

## What I created

1. **landing.md** — Complete landing page copy at `~/businesses/a11y-annotator/launch/landing.md`
2. **store-listing.md** — Chrome Web Store listing at `~/businesses/a11y-annotator/launch/store-listing.md`

---

## Voice & Language Gate — PASS

### Brand-Voice rules followed

| Rule | How it's applied |
|------|-----------------|
| Plain > clever | No "revolutionize," "supercharge," "seamless," "unlock" anywhere in the copy |
| Specific > vague | "16 WCAG checks," "$4.99 one-time," "ten minutes" — not "powerful insights" |
| Show the mechanism | Explains: scan → pins land → annotate → export Markdown |
| Honest about scope | "A Chrome extension" — not "a platform," not "a suite" |
| Lead with painful job-to-be-done | Headline starts with the workflow pain (find → pin → hand off) |
| Privacy as identity | "Nothing leaves your browser" is the subheadline, not a footnote |
| No banned buzzwords | Zero instances of: revolutionize, supercharge, seamless, game-changer, cutting-edge, leverage, unlock, empower, elevate, robust, next-gen |
| No fake proof | No "trusted by N teams," no invented numbers, no testimonials |
| No emoji-spray | Zero emoji in the copy |
| Paid-only charter | Free-to-install-but-inert framing is correct; no "free tier" language |

### Language-Bank phrases reused (🟢 REAL)

| Phrase | Source | Where used |
|--------|--------|-----------|
| "nothing leaves your browser" | Language Bank | Subheadline, FAQ, competitive frame |
| "axe finds the problems. This one helps you hand them off" | Language Bank | Detailed Description opening |
| "pin it, annotate it, ship the report" | Language Bank | Benefit bullet 3 |
| "I just need to show the dev *where* on the page it's broken" | Language Bank | Benefit bullet 1 |
| "Does this send my page to a server?" | Language Bank | FAQ |
| "ten minutes, nothing left their machine" | Language Bank (Avatar) | Subheadline |

### FULFILLMENT GATE — FAIL (expected)

The Offer's "what the buyer gets" is 🔴 ASSUMPTION — license-key unlock is NOT built.
Today a buyer can pay but receives nothing different. Per SOUL, the copy ships as DRAFT.
This is flagged in the landing page and noted here. **Do not publish until the unlock is wired.**

---

## Asset checklist

| Asset | Status | Path |
|-------|--------|------|
| landing.md (regenerated) | DRAFT | `~/businesses/a11y-annotator/launch/landing.md` |
| store-listing.md (regenerated) | DRAFT | `~/businesses/a11y-annotator/launch/store-listing.md` |
| pricing.md | See landing.md (pricing table inline) | — |
| TEST-REPORT | ❌ MISSING | No TEST-REPORT found |
| BUILD-REPORT | ❌ MISSING | No BUILD-REPORT found |
| LICENSE | ❌ MISSING | — |
| PRIVACY.md | ❌ MISSING | — |
| TERMS.md | ❌ MISSING | — |
| REFUND.md | ❌ MISSING | — |
| Icons (16/48/128 PNG) | ✅ Present | `~/businesses/a11y-annotator/icons/` |
| Packaged .zip | ❌ MISSING | — |
| README | ✅ Present | `~/businesses/a11y-annotator/README.md` |
| Stripe checkout | ❌ NOT CREATED | Needs `stripe_setup.py` run |

---

## Remaining human actions for Eric

1. **Wire the license-key unlock.** Define the exact free-vs-paid line (candidate: CSV/JSON export, batch scan, annotation templates gated). Wire the key check in the extension.
2. **Run Stripe setup:** `python3 ~/hermes_ops/scripts/stripe_setup.py a11y-annotator --name Pro --price 4.99`
3. **Drop the Stripe Payment Link URL** into the CTA button in landing.md.
4. **Run `finish_product.py`** to generate LICENSE, PRIVACY.md, TERMS.md, REFUND.md, and packaged .zip.
5. **Curate the Context Pack** — the Language Bank is still mostly 🟡 PROVISIONAL. Harvest real quotes from CWS reviews of AAArdvark / axe / WAVE, Reddit r/webdev, r/accessibility. Promote to the vault once validated.

---

## Risks / blockers

- **License unlock not built** — the single biggest blocker. Copy is DRAFT until resolved.
- **No TEST-REPORT** — per SOUL, a product without QA sign-off is not launch-ready. This should be run before any publish decision.
- **Language Bank is thin** — mostly 🟡 PROVISIONAL placeholders. Copy works today but will improve significantly once real buyer quotes are harvested.
