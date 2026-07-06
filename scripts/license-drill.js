#!/usr/bin/env node
// license-drill.js — end-to-end fulfillment truth gate.
//
// Usage: node scripts/license-drill.js
//
// Issues a real key with the real signer, then verifies with the REAL
// license.js the extension ships. Exit 0 = every gate passed. Any failure
// exits 1. Run this from a clean checkout before ever claiming "sellable".

'use strict';
const { execFileSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const license = require(path.join(ROOT, 'license.js'));

async function main() {
  const results = [];
  const check = (name, pass, detail) => {
    results.push({ name, pass, detail });
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
  };

  // 1. Issue a key with the real signer
  const out = execFileSync('node', [path.join(__dirname, 'sign-license-key.js'), 'pi_DRILL_' + Date.now(), 'TEST DRILL'], { encoding: 'utf8' });
  const key = (out.match(/A11Y-PRO\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/) || [])[0];
  check('signer issues a key', Boolean(key), key ? key.slice(0, 40) + '…' : 'no key in signer output');
  if (!key) return finish(results);

  // 2. The issued key must verify
  const good = await license.verifyLicense(key);
  check('issued key verifies', good.ok === true, JSON.stringify(good));

  // 3. Tampered payload must reject
  const parts = key.split('.');
  const tamperedPayload = [parts[0], parts[1].slice(0, -2) + 'xx', parts[2]].join('.');
  const bad1 = await license.verifyLicense(tamperedPayload);
  check('tampered payload rejects', bad1.ok === false, bad1.reason);

  // 4. Tampered signature must reject
  const tamperedSig = [parts[0], parts[1], parts[2].slice(0, -2) + 'xx'].join('.');
  const bad2 = await license.verifyLicense(tamperedSig);
  check('tampered signature rejects', bad2.ok === false, bad2.reason);

  // 5. Garbage / legacy formats must reject
  const bad3 = await license.verifyLicense('A11Y-PRO-DEAD-BEEF-DEAD-BEEF');
  check('legacy/garbage format rejects', bad3.ok === false, bad3.reason);

  // 6. Verified meta must carry the payment tail
  check('meta carries payment id tail', good.ok && typeof good.meta.pi === 'string' && good.meta.pi.length === 8, good.ok ? good.meta.pi : 'n/a');

  finish(results);
}

function finish(results) {
  const failed = results.filter((r) => !r.pass);
  console.log('');
  console.log(failed.length === 0
    ? `DRILL PASSED (${results.length}/${results.length}) — fulfillment chain is real.`
    : `DRILL FAILED — ${failed.length} gate(s) down. NOT sellable.`);
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((e) => { console.error('DRILL ERROR:', e.message); process.exit(1); });
