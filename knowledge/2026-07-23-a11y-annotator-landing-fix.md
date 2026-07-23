# Landing Fix: a11y-annotator (gh-pages private repo → Vercel)

## Problem
`ericjoye/a11y-annotator` was PRIVATE, so GitHub Pages returned 404.
All landing pages, blog, and privacy were dead. CWS links were broken.

## Solution
Deployed the gh-pages branch content to a **dedicated Vercel project** (NOT the shared "landing" project):

- **URL:** https://a11y-annotator-vercel.vercel.app
- **Vercel project:** `a11y-annotator-vercel` under team `ricks-projects-039b2c3c`
- **Source:** gh-pages branch content (index.html, privacy.html, blog/, REFUNDS.md, PRIVACY.md, LICENSE)

## Gotchas
1. **Vercel team SSO**: The team "Rick's projects" (ricks-projects-039b2c3c) has SSO. On first deploy, the project got SSO-protected and showed Vercel login page to visitors. Had to delete and re-deploy to get a non-SSO project.
2. **CWS cannot be updated programmatically**: The Chrome Web Store homepage URL and privacy URL must be updated manually at https://chrome.google.com/webstore/devconsole/
3. **URLs in blog articles**: 5 blog articles had hardcoded `github.io` URLs. Updated to `a11y-annotator-vercel.vercel.app`.

## Needs seller
CWS listing homepage URL still points to dead GitHub Pages URL. Seller needs to update:
- Homepage URL → https://a11y-annotator-vercel.vercel.app/
- Privacy URL → https://a11y-annotator-vercel.vercel.app/privacy.html
