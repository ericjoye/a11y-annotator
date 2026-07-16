# Fulfillment SOP — a11y-annotator Pro ($4.99 one-time)

## Current fulfillment (automated)
The product is a Chrome extension delivered as a digital download (a11y-annotator.zip).

When a customer buys:
1. **Stripe** processes payment (automated)
2. **fulfillment_poll** detects the charge, matches price_id `price_1TlKMRIFomlmzi58G0O8680Z`
3. **sendmail.py** emails the buyer the zip file attached
4. **interactions.jsonl** logs: event=purchase, product=a11y-annotator, outcome=delivered

Full loop time: < 5 minutes from purchase to delivery.

## Manual license key (future)
The extension includes a license.js that validates Pro keys via ECDSA P-256.
The signing key is offline. For automated license key fulfillment, the key flow
needs to be wired into fulfillment_poll instead of requiring manual node execution.
Until then, the digital-download fulfillment provides the full extension including
the license validator.

## Quality metrics (via interactions.jsonl)
- Fulfillment latency: purchase ts → delivery ts
- Fulfillment success rate: delivered / attempted
- Support rate: support events / purchases

Tracked by Curator each cycle.
