---
title: A11Y-PRO License Key Specification
status: active
created: 2026-07-01
tags: [license, fulfillment, a11y-annotator]
---

# A11Y-PRO License Key Specification

## Format

```
A11Y-PRO-XXXX-XXXX-XXXX-XXXX
```

All fields are uppercase hexadecimal, dash-separated:

| Token | Meaning |
|-------|---------|
| `A11Y-PRO` | Product + tier constant |
| `XXXX-XXXX-XXXX-XXXX` | 16-char HMAC-encoded identity token |

## Issuance (Eric-only)

Run the offline Node CLI:

```bash
cd ~/businesses/a11y-annotator
node scripts/sign-license-key.js <stripe-payment-intent-id> "buyer@example.com — alice"
```

Output:

```text
A11Y-PRO-3F2A-91C4-7E01-B5D8
```

Send the key to the buyer. Issuance is logged to `keys/issued.json`.

## Verification (extension)

The extension verifies the key using Web Crypto API (`ECDSA P-256`):

1. Reads key pattern `A11Y-PRO-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}`
2. Extracts the 16-char identity token
3. Verifies the token is a valid ECDSA signature of the attested payload

The **public verification key** is the embedded PEM in `license.js`:

```
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEIrcfnvbvHRITxKMBRC0rm1FWEndu
DB9ZUW2/5Hi4j3XQvfhmkD7E8x9eEeJjeH7TvT6EIdLcDuZxtOKKRZojng==
-----END PUBLIC KEY-----
```

## Security Model

| Property | Value |
|----------|-------|
| Algorithm | ECDSA P-256 + SHA-256 |
| Private key location | `keys/license-private.pem` (OFFLINE ONLY; never shipped) |
| Public key location | Embedded as string literal in `license.js` |
| Backdoor removed | Auto-unlock via `checkout.stripe.com` URL inspection **removed** |
| Client-side only | No license check calls a server — fully offline |
| Revocation | Not implemented; Eric reissues at discretion |

## What Buyers Need to Do

1. Pay at the Stripe checkout link.
2. Receive license key via email/DM from Eric.
3. Enter key in the extension popup.

## First-Dollar Gap Closed By This

- Buyer pays → Eric issues key → extension verifies key cryptographically → unlocks Pro.
- No free tier; no honor-system regex; no URL-based auto-unlock.

> **2026-07-02 IMPLEMENTATION NOTE:** the shipped scheme is ECDSA P-256 offline keys
> in format `A11Y-PRO.<payload_b64url>.<sig_b64url>` (see license.js v4.0.0-ecdsa and
> DRILL-REPORT.md). Where this spec differs from that, the code + drill report win.
