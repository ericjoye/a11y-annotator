#!/usr/bin/env node
// sign-license-key.js — issue an a11y-annotator Pro license key.
//
// Usage: node scripts/sign-license-key.js <stripe-payment-intent-id> [note]
//   payment-intent-id: the pi_xxx from the completed Stripe charge
//   note: optional (buyer email, "TEST DRILL", etc.)
//
// Signs with keys/license-private.pem (ECDSA P-256). The extension verifies
// with the embedded public key (license.js) — offline, unforgeable.
// Every issuance is appended to keys/issued.json.

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const PRIVATE_KEY_PATH = path.join(ROOT, 'keys', 'license-private.pem');
const ISSUED_LOG = path.join(ROOT, 'keys', 'issued.json');

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function main() {
  const [pi, note] = process.argv.slice(2);
  if (!pi) {
    console.error('Usage: node sign-license-key.js <stripe-payment-intent-id> [note]');
    console.error('  payment-intent-id: the pi_xxx from the completed charge');
    console.error('  note: optional human-readable note (buyer email, TEST DRILL, etc.)');
    process.exit(1);
  }

  const privateKey = crypto.createPrivateKey(fs.readFileSync(PRIVATE_KEY_PATH));
  if (privateKey.asymmetricKeyType !== 'ec') {
    console.error(`keys/license-private.pem is ${privateKey.asymmetricKeyType}, expected ec (P-256).`);
    process.exit(1);
  }

  const payload = {
    product: 'a11y-annotator',
    tier: 'pro',
    pi: pi.slice(-8),
    iat: new Date().toISOString().slice(0, 10),
    nonce: crypto.randomBytes(4).toString('hex'),
  };

  const payloadB64 = b64url(JSON.stringify(payload));
  const signature = crypto.sign('sha256', Buffer.from(payloadB64, 'ascii'), {
    key: privateKey,
    dsaEncoding: 'ieee-p1363', // raw r||s — what WebCrypto ECDSA verify expects
  });
  const key = `A11Y-PRO.${payloadB64}.${b64url(signature)}`;

  // Append to issuance log
  let log = [];
  try { log = JSON.parse(fs.readFileSync(ISSUED_LOG, 'utf8')); } catch (e) { /* first issuance */ }
  if (!Array.isArray(log)) log = [];
  log.push({ issuedAt: new Date().toISOString(), paymentIntent: pi, note: note || null, key });
  fs.writeFileSync(ISSUED_LOG, JSON.stringify(log, null, 2) + '\n');

  console.log('License key (send the WHOLE line, it is case-sensitive):');
  console.log('');
  console.log(`  ${key}`);
  console.log('');
  console.log(`Issuance recorded in: ${path.relative(process.cwd(), ISSUED_LOG)}`);
  console.log('Delivery: use keys/EMAIL-TEMPLATE.md');
}

main();
