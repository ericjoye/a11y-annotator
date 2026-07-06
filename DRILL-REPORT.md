# DRILL-REPORT — a11y-annotator license fulfillment

**Date:** 2026-07-02 · **Operator:** Claude (senior operator) · **Verdict: PASS 6/6**
**Rerun anytime:** `node scripts/license-drill.js` (exit 0 = pass)

## What was broken (found 2026-07-02 morning)
- `license.js` v3.0.0-hmac embedded a placeholder `PAYLOAD_B64` (decoded to lorem-style
  gibberish); its own issued keys returned `ok:false "Invalid license payload"`.
- Signer (HMAC, 16-hex short key) and verifier schemes were mismatched; `keys/license-private.pem`
  (EC P-256) was unused.
- `popup.js` set `pro: true` for ANY string matching the key pattern — no verification at all.
- `popup.html` never loaded `license.js`; nothing called its API.
- The packaged zip (2026-06-22) predated all license code entirely.
- A task claimed this "TEST done / launch ready." That claim was false.

## What was rebuilt (2026-07-02)
- **Scheme (decision):** ECDSA P-256 / SHA-256 offline verification. Extension embeds only the
  public key; keys signed locally with `keys/license-private.pem`. Unforgeable without the
  private key; zero network; works in all Chrome WebCrypto.
- **Key format:** `A11Y-PRO.<payload_b64url>.<sig_b64url>` — payload carries product, tier,
  Stripe payment-intent tail, issue date, nonce.
- `license.js` v4.0.0-ecdsa: full rewrite; `activateLicense()` is the only path to `pro:true`;
  `isProUnlocked()` re-verifies the stored key and self-heals fraudulent flags.
- `scripts/sign-license-key.js`: full rewrite (ieee-p1363 signatures); logs every issuance to
  `keys/issued.json`.
- `popup.js`: activate handler now verifies before unlocking; status check re-verifies.
- `popup.html`: loads `license.js`; placeholder updated to new key format.
- `a11y-annotator.zip` repackaged (13 files, includes license.js; old zip kept as
  `a11y-annotator.zip.bak-20260622`).
- `scripts/license-drill.js` created — the permanent truth gate.

## Drill transcript (verbatim, 2026-07-02)
```
PASS  signer issues a key — A11Y-PRO.eyJwcm9kdWN0IjoiYTExeS1hbm5vdGF…
PASS  issued key verifies — {"ok":true,"meta":{"pi":"94886387","iat":"2026-07-02","tier":"pro"}}
PASS  tampered payload rejects — Corrupted key payload. Re-copy the full key from your email.
PASS  tampered signature rejects — Invalid signature. This key was not issued by us — contact support for a reissue.
PASS  legacy/garbage format rejects — Invalid key format. Expected: A11Y-PRO.<payload>.<signature> — paste the full key from your email.
PASS  meta carries payment id tail — 94886387

DRILL PASSED (6/6) — fulfillment chain is real.
```
Syntax gates: `node --check popup.js` ✓ · `node --check license.js` ✓

## Remaining gates before READY-TO-SELL (not code)
1. Manual UI spot-check: load unpacked extension, paste an issued key, confirm Pro buttons
   (CSV/JSON export, batch scan) visibly unlock. (Part of Eric's launch packet dry-run.)
2. Landing page publicly hosted with the Stripe link.
3. CWS listing published ($5 account — human).
4. One full fulfillment dry-run per FULFILLMENT-SOP.md TEST variant.
