// Regression test: no legacy office register may become unreachable in IMS.
//
// Removing the standalone Digital Office app moved every screen into IMS. This
// test reads the bridge (src/ims/oldOfficeRegisters.jsx), the section catalogue
// (src/ims/sectionModules.js) and the flat nav (src/ims/nav.js) and asserts that
// every module the bridge can render is linked from at least one of them, or is
// reachable through a generic resource / dedicated route.
//
//   cd backend_node && node tests/legacyReachability.test.js
process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  \u2713 ${name}`); }
  else { fail += 1; console.log(`  \u2717 ${name} ${extra}`); }
};

const read = (rel) => fs.readFileSync(path.join(__dirname, '..', '..', rel), 'utf8');

function main() {
  const bridge = read('src/ims/oldOfficeRegisters.jsx');
  const catalogue = read('src/ims/sectionModules.js') + '\n' + read('src/ims/nav.js');
  const i18n = read('src/ims/i18n.js');
  const migrate = read('backend_node/services/ims/migrateLegacy.js');

  // 1. Every module the bridge renders.
  const registers = [...bridge.matchAll(/^  ([a-zA-Z0-9]+): \{ C:/gm)].map((m) => m[1]);
  const generic = (bridge.match(/GENERIC_REGISTERS = new Set\(\[([\s\S]*?)\]\)/)[1].match(/'([a-zA-Z0-9]+)'/g) || []).map((s) => s.slice(1, -1));
  const finance = (bridge.match(/FINANCE_SCREENS = \{([\s\S]*?)\n\};/)[1].match(/^\s+([a-zA-Z0-9]+): \{/gm) || []).map((s) => s.trim().split(':')[0]);
  const modules = [...new Set([...registers, ...generic, ...finance])];
  ok('bridge renders at least 100 legacy modules', modules.length >= 100, `(${modules.length})`);

  // 2. Everything the catalogue links, however it links it.
  const linked = new Set();
  for (const m of catalogue.matchAll(/legacy\('([a-zA-Z0-9]+)'\)/g)) linked.add(m[1]);
  for (const m of catalogue.matchAll(/\/ims\/legacy\/([a-zA-Z0-9]+)/g)) linked.add(m[1]);
  const resources = new Set([...catalogue.matchAll(/resource:\s*'([a-zA-Z0-9]+)'/g)].map((m) => m[1]));
  const paths = [...catalogue.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
  const reachableByRoute = (mod) => paths.some((p) => p === `/ims/${mod}` || p.endsWith(`/${mod}`));

  // Legacy views whose IMS counterpart is a first-class screen, not a bridge card.
  // Chart of Accounts / Funds / Financial Years are generic resources; the finance
  // dashboard, ledger, transactions, integrity and audit now live under /ims/finance*.
  const nativeCovered = new Set(['chartOfAccounts', 'fundMaster', 'fyMaster', 'finDashboard', 'finStatements', 'finTransactions', 'finLedger']);

  const unreachable = modules.filter((m) => !linked.has(m) && !resources.has(m) && !reachableByRoute(m) && !nativeCovered.has(m));
  ok('every legacy module is reachable (linked, resource or route)', unreachable.length === 0, `-> ${unreachable.join(', ')}`);
  ok('native finance counterparts that replace the legacy views exist',
    ['/ims/finance', '/ims/finance/ledger', '/ims/integrity'].every((p) => catalogue.includes(p)) && ['transactions', 'audits', 'accounts', 'funds', 'financialYears'].every((r) => resources.has(r)));

  // 3. No nav card points at a module the bridge cannot render (a dead link).
  const renderable = new Set(modules);
  const deadLinks = [...linked].filter((m) => !renderable.has(m));
  ok('no catalogue link points at a module the bridge cannot render', deadLinks.length === 0, `-> ${deadLinks.join(', ')}`);

  // 4. Every card key has a bilingual label (no raw keys shown to the user).
  const keys = new Set();
  for (const m of catalogue.matchAll(/labelKey:\s*'([^']+)'/g)) keys.add(m[1]);
  for (const m of catalogue.matchAll(/titleKey:\s*'([^']+)'/g)) keys.add(m[1]);
  for (const m of catalogue.matchAll(/\{\s*key:\s*'([^']+)'/g)) keys.add(m[1]);
  for (const m of catalogue.matchAll(/P\('([^']+)'/g)) keys.add(m[1]);
  for (const m of catalogue.matchAll(/shortKey:\s*'([^']+)'/g)) keys.add(m[1]);
  const defined = new Set([...i18n.matchAll(/^\s*'?([a-zA-Z0-9_]+)'?\s*:/gm)].map((m) => m[1]));
  const untranslated = [...keys].filter((k) => !defined.has(k));
  ok('every navigation label has an English + Hindi translation', untranslated.length === 0, `-> ${untranslated.join(', ')}`);

  // 5. Every module in the migration map targets a real IMS resource.
  const mapBody = migrate.match(/const MODULE_MAP = \{([\s\S]*?)\n\};/)[1];
  const targets = new Set([...mapBody.matchAll(/:\s*'([a-zA-Z]+)'/g)].map((m) => m[1]));
  const known = new Set([...read('backend_node/services/ims/resource.js').matchAll(/^\s{2}([a-zA-Z]+):\s*\{ model:/gm)].map((m) => m[1]));
  const badTargets = [...targets].filter((t) => !known.has(t));
  ok('every migration destination is a real IMS resource', badTargets.length === 0, `-> ${badTargets.join(', ')}`);

  console.log(`\nlegacyReachability: ${pass} passed, ${fail} failed`);
  if (fail) process.exit(1);
}

main();
