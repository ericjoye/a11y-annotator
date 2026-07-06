# Fulfillment SOP — a11y-annotator Pro ($4.99 one-time)

Operator: Eric only (the signing key is offline-only, on this machine). Target: payment to delivered key in under 10 minutes.

> **STATUS 2026-07-02: the license chain is FIXED and drill-verified (6/6 — see DRILL-REPORT.md).**
> Signer and verifier now share one scheme: ECDSA P-256 offline keys in the format
> `A11Y-PRO.<payload>.<signature>` (long, case-sensitive — always send the whole line).
> The earlier HMAC/ECDSA mismatch warning is resolved; task `t_880c50f9` completed.
> **Safety rule stands:** before your FIRST real sale, run `node scripts/license-drill.js`
> once (exit 0 = 6/6 pass) and do one TEST-variant dry run below. If the drill ever fails,
> stop LIVE fulfillment and reopen a [RN] fix task.

## LIVE — real sale

1. **Confirm payment.** Log into the Stripe dashboard → Payments. Find the charge for $4.99 matching the buyer.
2. **Copy the payment intent id** (`pi_...`) and the buyer's email from the Stripe payment detail page.
3. **Issue the key:**
   ```bash
   cd ~/businesses/a11y-annotator
   node scripts/sign-license-key.js <pi_id> "<buyer email>"
   ```
   This prints the key (`A11Y-PRO-XXXX-XXXX-XXXX-XXXX`) and appends a record to `keys/issued.json` (key, signature, payment id, buyer note, timestamp).
4. **Send the email.** Copy `keys/EMAIL-TEMPLATE.md`, fill `{{KEY}}`, `{{BUYER_EMAIL}}`, `{{PAYMENT_ID}}`, send from [SUPPORT-EMAIL-PENDING — Eric to supply before public launch].
5. **Mark fulfilled.** Append one line to `keys/FULFILLED.log`:
   ```
   2026-07-02 | pi_xxx | buyer@example.com | A11Y-PRO-XXXX-XXXX-XXXX-XXXX
   ```
   (Create the file with that header format if it doesn't exist yet.)

Whole loop: dashboard check (~2 min) → sign (~1 min) → email (~2 min) → log (~1 min) = well under 10 minutes once the license drill passes.

## TEST — dry run (use this until the license drill passes)

Use a fake payment id, never touch `keys/issued.json`'s real buyer records, never email anyone.

1. Run the sign script against a throwaway id:
   ```bash
   cd ~/businesses/a11y-annotator
   node scripts/sign-license-key.js pi_test_dryrun001 "TEST — dry run, not a real buyer"
   ```
2. Load the unpacked extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked → this folder), open the popup, paste the printed key into the license field, click **Unlock**.
3. **Record the result** (does not currently pass — see warning above): if Unlock succeeds, the drill passes. If it shows a signature-mismatch error, that confirms the gap; fix `license.js`/signing before any LIVE run.
4. Delete the test entry from `keys/issued.json` afterward so it doesn't get confused with real sales, and do **not** write to `keys/FULFILLED.log` for a TEST run.

## After the license drill passes

Once a sign-script key verifies cleanly in a loaded extension, the LIVE steps above are safe to run as written. No changes to this SOP should be needed — only to the underlying scripts.
