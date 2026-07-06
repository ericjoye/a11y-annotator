#!/usr/bin/env node
/**
 * generate_license_key_artifacts.py
 *
 * Generates:
 *   - keys/license-private.pem          (ECDSA P-256; OFFLINE-ONLY)
 *   - keys-pub/verify.pem               (ECDSAPublicKey; embedded in extension source)
 *   - FULL_PAYLOAD_B64 in a comment      (human-readable canonical payload)
 *   - builds license.js artifacts block
 *
 * This script should be run ONLY by Eric, on a local secure machine.
 * The private key MUST be kept offline; PUBLIC key alone ships in license.js.
 */

import subprocess
import os
import base64
import json
from datetime import datetime, timezone

KEYS_DIR = os.path.join(os.path.dirname(__file__), '..', 'keys')
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), '..', 'keys-pub')
PRIVATE_PATH = os.path.join(KEYS_DIR, 'license-private.pem')
PUBLIC_PATH = os.path.join(PUBLIC_DIR, 'verify.pem')

PRODUCT_SLUG = 'a11y-annotator'
TIER = 'pro'
SEPARATOR = 'A1Y-SEP'

def build_payload(payment_id_tail='00000000', issued_at=None, expires='never'):
    issued_at = issued_at or datetime.now(timezone.utc).isoformat()
    return f"{PRODUCT_SLUG}{SEPARATOR}{TIER}{SEPARATOR}{payment_id_tail}{SEPARATOR}{issued_at}{SEPARATOR}{expires}"

def b64url(s: str) -> str:
    return base64.urlsafe_b64encode(s.encode('utf-8')).decode('utf-8').rstrip('=')

def b64_pem(pem_text: str) -> str:
    lines = [l for l in pem_text.splitlines() if l and '---' not in l]
    return ''.join(lines)

if __name__ == '__main__':
    # 1) Generate keypair if not exists
    os.makedirs(KEYS_DIR, exist_ok=True)
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    if not os.path.exists(PRIVATE_PATH):
        subprocess.run([
            'openssl', 'ecparam', '-name', 'prime256v1', '-genkey', '-noout', '-out', PRIVATE_PATH
        ], check=True)
        print(f"Generated private key: {PRIVATE_PATH}")
    else:
        print(f"Reusing existing private key: {PRIVATE_PATH}")

    subprocess.run([
        'openssl', 'ec', '-in', PRIVATE_PATH, '-pubout', '-out', PUBLIC_PATH
    ], check=True)

    with open(PRIVATE_PATH) as f:
        private_pem = f.read()
    with open(PUBLIC_PATH) as f:
        public_pem = f.read()

    # 2) Extract raw SPKI bytes for framework-compatible format (spki / raw)
    der_bytes = subprocess.check_output([
        'openssl', 'ec', '-in', PRIVATE_PATH, '-pubout', '-outform', 'DER'
    ])
    pub_b64 = base64.b64encode(der_bytes).decode('utf-8')
    pub_b64url = base64.urlsafe_b64encode(der_bytes).decode('utf-8').rstrip('=')

    # 3) Build canonical payload and base64url-encode it
    payload = build_payload()
    payload_b64 = b64url(payload)

    # 4) Sign a test payload for verification
    test_payload = f"{PRODUCT_SLUG}{SEPARATOR}{TIER}{SEPARATOR}test00000000{SEPARATOR}2026-07-01T00:00:00+00:00{SEPARATOR}never"
    sig_path = '/tmp/a11y-license-test.sig'
    with open(sig_path, 'wb') as f:
        subprocess.run(['openssl', 'dgst', '-sha256', '-sign', PRIVATE_PATH],
                       input=test_payload.encode(), stdout=f, check=True)
    verify = subprocess.run([
        'openssl', 'dgst', '-sha256', '-verify', PUBLIC_PATH,
        '-signature', sig_path
    ], input=test_payload.encode(), capture_output=True, text=True)
    print(f"Test verify: {verify.stderr.strip()}")

    print("\n--- License Key Artifacts ---")
    print(f"PAYLOAD_B64 = \"{payload_b64}\"")
    print(f"PUBLIC_KEY_PEM (lines 2..-2):\n{b64_pem(public_pem)}")
    print(f"PUBLIC_KEY_SPKI_BASE64 =\"{pub_b64}\"")
    print(f"PUBLIC_KEY_SPKI_BASE64URL =\"{pub_b64url}\"")
    print(f"PRODUCT_SLUG = \"{PRODUCT_SLUG}\"")
    print(f"TIER = \"{TIER}\"")
    print(f"Private key (OFFLINE ONLY): {PRIVATE_PATH}")
    print(f"Public key (embedded): {PUBLIC_PATH}")
