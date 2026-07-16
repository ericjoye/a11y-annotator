// license.js — offline license verification for a11y-annotator Pro.
//
// Scheme: ECDSA P-256 / SHA-256, public-key verification only.
// The extension embeds ONLY the public key; keys are signed offline with
// keys/license-private.pem via scripts/sign-license-key.js. Keys cannot be
// forged without the private key, and verification needs no network.
//
// Key format (case-sensitive):
//   A11Y-PRO.<payload_b64url>.<signature_b64url>
// payload = JSON {product, tier, pi, iat, nonce}
// signature = ECDSA-P256-SHA256 over the ASCII bytes of <payload_b64url>,
//             IEEE P1363 (raw 64-byte r||s), base64url.

(() => {
  'use strict';

  const PRODUCT_SLUG = 'a11y-annotator';
  const TIER = 'pro';
  const KEY_PREFIX = 'A11Y-PRO';

  // Public half of keys/license-private.pem (P-256). Safe to ship.
  const PUBLIC_KEY_JWK = {
    kty: 'EC',
    crv: 'P-256',
    x: 'nbzp2LDj1HxPKDgUsPoff5yFOB-bLVHfks-yKfHRL2o',
    y: 'oziGwH5Ocf8XaommzjKE0w40eLPomd1gqriFvTRU6Tw',
  };

  const subtle = (typeof crypto !== 'undefined' && crypto.subtle) ? crypto.subtle : null;

  function b64urlToBytes(s) {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  let cachedKey = null;
  async function getPublicKey() {
    if (!cachedKey) {
      cachedKey = await subtle.importKey(
        'jwk', PUBLIC_KEY_JWK,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false, ['verify']
      );
    }
    return cachedKey;
  }

  /**
   * Verify a license key string.
   * @param {string} key
   * @returns {Promise<{ok:boolean, reason?:string, meta?:{pi:string,iat:string,tier:string}}>}
   */
  async function verifyLicense(key) {
    try {
      if (!subtle) return { ok: false, reason: 'WebCrypto unavailable in this context.' };
      const trimmed = (key || '').trim();
      if (!trimmed) return { ok: false, reason: 'Empty key.' };

      const parts = trimmed.split('.');
      if (parts.length !== 3 || parts[0] !== KEY_PREFIX) {
        return { ok: false, reason: 'Invalid key format. Expected: A11Y-PRO.<payload>.<signature> — paste the full key from your email.' };
      }
      const [, payloadB64, sigB64] = parts;
      if (payloadB64.length > 2048 || sigB64.length > 512) {
        return { ok: false, reason: 'Key too long.' };
      }

      let payload;
      try {
        payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadB64)));
      } catch (e) {
        return { ok: false, reason: 'Corrupted key payload. Re-copy the full key from your email.' };
      }
      if (payload.product !== PRODUCT_SLUG) return { ok: false, reason: 'Key is for a different product.' };
      if (payload.tier !== TIER) return { ok: false, reason: 'Unsupported tier: ' + String(payload.tier) };

      const pubKey = await getPublicKey();
      const valid = await subtle.verify(
        { name: 'ECDSA', hash: 'SHA-256' },
        pubKey,
        b64urlToBytes(sigB64),
        new TextEncoder().encode(payloadB64)
      );
      if (!valid) return { ok: false, reason: 'Invalid signature. This key was not issued by us — contact support for a reissue.' };

      return { ok: true, meta: { pi: payload.pi, iat: payload.iat, tier: payload.tier } };
    } catch (e) {
      return { ok: false, reason: 'Verification error: ' + e.message };
    }
  }

  function storageAvailable() {
    return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
  }

  /**
   * Verify then persist. The ONLY sanctioned way to set pro:true.
   * @param {string} key
   */
  async function activateLicense(key) {
    const result = await verifyLicense(key);
    if (!result.ok) return result;
    if (storageAvailable()) {
      await new Promise((resolve) => {
        chrome.storage.local.set(
          { pro: true, licenseKey: key.trim(), licenseMeta: result.meta },
          resolve
        );
      });
    }
    return result;
  }

  /**
   * True only if a stored key exists AND still verifies.
   * Self-heals stale/fraudulent pro flags (pro:true without a valid key).
   * @returns {Promise<boolean>}
   */
  async function isProUnlocked() {
    if (!storageAvailable()) return false;
    const stored = await new Promise((resolve) => {
      chrome.storage.local.get(['pro', 'licenseKey'], resolve);
    });
    if (!stored.pro || !stored.licenseKey) return false;
    const result = await verifyLicense(stored.licenseKey);
    if (!result.ok) {
      await new Promise((resolve) => {
        chrome.storage.local.set({ pro: false, licenseMeta: null }, resolve);
      });
      return false;
    }
    return true;
  }

  async function deactivateLicense() {
    if (storageAvailable()) {
      await new Promise((resolve) => {
        chrome.storage.local.set({ pro: false, licenseKey: null, licenseMeta: null }, resolve);
      });
    }
    return { success: true };
  }

  const API = Object.freeze({
    verifyLicense,
    activateLicense,
    isProUnlocked,
    deactivateLicense,
    KEY_PREFIX,
    VERSION: '4.0.0-ecdsa',
  });

  if (typeof window !== 'undefined') window.A11YLicense = API;
  if (typeof globalThis !== 'undefined') globalThis.A11YLicense = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})();
