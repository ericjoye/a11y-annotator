# 2026-07-20 a11y-annotator-paywall-fix

## What worked
- ECDSA P-256 verification in `license.js` was already correct and well-implemented. The 6/6 license drill proved the crypto chain works.
- Manifest.json had correct content_scripts order (license.js before content.js).
- Popup.html had correct script loading order (license.js before popup.js).

## What didn't work
- Background.js had a **completely unprotected bypass**: a message handler `unlock-pro` that set `pro:true` with zero verification. Any extension with messaging access could unlock Pro for free.
- The `activate-license` handler also stored the key but never verified it.
- The original BUILD-REPORT.md claimed "Pro license unlock via ECDSA" and "Background service worker activates license from storage/receipt path" — but omitted mentioning there was an unverified bypass handler.

## Deployment gotchas
- Background.js (service worker) CAN use `crypto.subtle` — Chrome extension service workers support SubtleCrypto. Verified.
- But background.js message listener callbacks can't be `async` directly — must use `.then()` pattern with `return true`.
- Public key must be duplicated into background.js since it's a separate context from license.js (even though both embed the same key).
- The old `unlock-pro` handler's comment said "NO auto-unlock by inspecting browser URLs — that path is removed" which was misleading — it claimed the bypass was removed while the bypass was still live.

## Build times
- Investigation: 5 min
- Fix + verification: 15 min
- Total: ~20 min

## Context for next build
- Always grep for `pro: true` set patterns — a direct `{ pro: true }` set without a preceding verify call is a bypass.
- Look at ALL message handlers, not just the main license.js. Background.js is the most common place for bypass handlers.
- The `activate-license` pattern (popup verifies, sends result to background) is only secure if the background ALSO re-verifies. A rogue popup or direct message can bypass.
- Manifest.json's content_scripts order determines what's available — always check `license.js` loads before dependent scripts.
