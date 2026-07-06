#!/usr/bin/env node
// generate-license-key-artifacts.mjs
// ESM — generates keypair, public-key token block, and base64url payload token.
// Intended to migrate from TokenTally-style hex-HMAC to ECDSA P-256.
//
// Outputs:
//   keys/license-private.pem       — OFFLINE ONLY; never shipped
//   keys-pub/verify.pem            — ECDSA public key PEM
//   keys-pub/LICENSE-KEY-TOKENS    — extension-ready artifacts block
//   sample: A11Y-PRO-<sig16hex>

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const KEYS_DIR = path.join(process.cwd(), 'keys');
const PUBLIC_DIR = path.join(process.cwd(), 'keys-pub');
const PRIVATE_PATH = path.join(KEYS_DIR, 'license-private.pem');
const PUBLIC_PATH = path.join(PUBLIC_DIR, 'verify.pem');

const PRODUCT_SLUG = 'a11y-annotator';
const TIER = 'pro';
const SEPARATOR = 'A1Y-SEP';

// ------------------------------------------------------------------
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFileIfMissing(file, content) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content, 'utf-8');
    return true;
  }
  return false;
}

// ------------------------------------------------------------------
// 1. Keypair (one-time)
ensureDir(KEYS_DIR);
ensureDir(PUBLIC_DIR);

if (!fs.existsSync(PRIVATE_PATH)) {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  fs.writeFileSync(PRIVATE_PATH, privateKey, 'utf-8');
  fs.writeFileSync(PUBLIC_PATH, publicKey, 'utf-8');
  console.error(`Generated keypair:\n  private=${PRIVATE_PATH} (OFFLINE ONLY)\n  public=${PUBLIC_PATH} (embeddable)`);
} else {
  console.error(`Reusing existing keypair:\n  private=${PRIVATE_PATH}\n  public=${PUBLIC_PATH}`);
}

// ------------------------------------------------------------------
// 2. Build canonical payload + base64url encode it
function makePayload(paymentId, issuedAtISO) {
  return `${PRODUCT_SLUG}${SEPARATOR}${TIER}${SEPARATOR}${paymentId}${SEPARATOR}${issuedAtISO}`;
}

function toBase64Url(str) {
  return Buffer.from(str, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

const samplePaymentId = 'pi_test_00000000';
const sampleIssuedAt = new Date().toISOString();
const testPayload = makePayload(samplePaymentId, sampleIssuedAt);
const PAYLOAD_B64 = toBase64Url(testPayload);

// ------------------------------------------------------------------
// 3. Read and compress public key to bare base64
const pubPem = fs.readFileSync(PUBLIC_PATH, 'utf-8');
const pubB64 = pubPem.replace(/-----BEGIN PUBLIC KEY-----/g, '')
                     .replace(/-----END PUBLIC KEY-----/g, '')
                     .replace(/\s/g, '');

// ------------------------------------------------------------------
// 4. Write tokens file
const tokensPath = path.join(PUBLIC_DIR, 'LICENSE-KEY-TOKENS');
const tokens = `// === AUTO-GENERATED — run: node scripts/generate-license-key-artifacts.mjs ===
// DO NOT CHANGE while any license key is outstanding.
export const LICENSE_TOKENS = Object.freeze({
  PRODUCT_SLUG: "${PRODUCT_SLUG}",
  TIER: "${TIER}",
  SEPARATOR: "${SEPARATOR}",
  PAYLOAD_B64: "${PAYLOAD_B64}",
  PUBLIC_KEY_PEM_B64: "${pubB64}",
});
`;

writeFileIfMissing(tokensPath, tokens);

console.log('\n--- A11Y-PRO License Key Artifacts ---');
console.log(`PRODUCT_SLUG: ${PRODUCT_SLUG}`);
console.log(`TIER: ${TIER}`);
console.log(`SEPARATOR: ${SEPARATOR}`);
console.log(`PAYLOAD_B64: ${PAYLOAD_B64}`);
console.log(`PUBLIC_KEY_PEM_B64: ${pubB64.slice(0, 20)}...${pubB64.slice(-20)}`);
console.log(`Tokens written: ${tokensPath}`);
console.log(`\nSample key format: A11Y-PRO-${crypto.createHmac('sha256', Buffer.from(testPayload)).update(testPayload).digest('hex').slice(0,16).toUpperCase().match(/.{1,4}/g).join('-')}`);
console.log(`\nNext step: import`);
