# BUILD-REPORT: a11y-annotator Landing Page

## Fix: GitHub Pages → Vercel Deployment

**Root Cause:** The GitHub repository `ericjoye/a11y-annotator` is PRIVATE. GitHub Pages does NOT serve from private repos unless on an Enterprise plan. All landing URLs at `https://ericjoye.github.io/a11y-annotator/` returned 404.

**Fix Applied:** Deployed static landing page to Vercel at a clean, stable URL.

## Deployment URL

**Landing:** https://a11y-annotator-vercel.vercel.app/

## Pages Verified (all return HTTP 200)

| Page | URL | Status |
|------|-----|--------|
| Landing (index) | https://a11y-annotator-vercel.vercel.app/ | ✅ 200 text/html |
| Privacy Policy | https://a11y-annotator-vercel.vercel.app/privacy.html | ✅ 200 text/html |
| Refund Policy | https://a11y-annotator-vercel.vercel.app/refunds.html | ✅ 200 text/html |
| License | https://a11y-annotator-vercel.vercel.app/LICENSE.html | ✅ 200 text/html |
| Blog Index | https://a11y-annotator-vercel.vercel.app/blog/ | ✅ 200 text/html |
| Blog: WCAG 2.2 Checklist | https://a11y-annotator-vercel.vercel.app/blog/wcag-22-checklist-web-audit.html | ✅ 200 text/html |
| Blog: 5-min Audit | https://a11y-annotator-vercel.vercel.app/blog/accessibility-audit-5-minutes.html | ✅ 200 text/html |
| Blog: Automated Testing | https://a11y-annotator-vercel.vercel.app/blog/automated-wcag-testing-freelance.html | ✅ 200 text/html |
| Blog: Client Reports | https://a11y-annotator-vercel.vercel.app/blog/documenting-accessibility-issues-client-reports.html | ✅ 200 text/html |
| Blog: Practical WCAG Guide | https://a11y-annotator-vercel.vercel.app/blog/wcag-accessibility-guide.html | ✅ 200 text/html |

## External Services (unchanged, still live)

- **Chrome Web Store:** https://chromewebstore.google.com/detail/a11y-annotator/pffjjfbhnlgpnlooepdlhijbhfamijbo (✅ 200, live)
- **Stripe Checkout (Pro $4.99):** https://buy.stripe.com/7sY4gAcPm9J7fOe8qcbAs0e (✅ 200, live)

## Changes Made

1. **New page: `refunds.html`** — Proper HTML version of the refund policy (was only markdown)
2. **New page: `LICENSE.html`** — Proper HTML license page (was just the raw text file)
3. **Fixed footer links** in `index.html`: changed `PRIVACY.md` → `privacy.html`, `REFUNDS.md` → `refunds.html`, `LICENSE` → `LICENSE.html`
4. **Deployed to Vercel** at `a11y-annotator-vercel` project (team: ricks-projects-039b2c3c)

## Known Issues

- The old GitHub Pages URL (`https://ericjoye.github.io/a11y-annotator/`) still serves stale content from the `gh-pages` branch — the footer there still links to `.md` files. This URL is no longer canonical; the new landing is at `https://a11y-annotator-vercel.vercel.app/`.
- The Chrome Web Store listing may still link to the old GitHub Pages URL. Seller needs to update the CWS listing's homepage URL to `https://a11y-annotator-vercel.vercel.app/`.
- Vercel project is linked to the root of the repo, so all files including source code (background.js, content.js etc.) are technically deployable. Only static pages are served. The `.gitignore` should be set to exclude source files if needed.

## Vercel Project Details

- **Project name:** a11y-annotator-vercel
- **Team:** ricks-projects-039b2c3c
- **Deployment URL:** https://a11y-annotator-vercel.vercel.app
- **Root directory:** `.` (full repo root)
- **Framework:** Other (static files)
