// Integration test: the admin surface must fail CLOSED.
//
// Every admin route used to fall back to the literal 'ssf-admin-portal-token'
// and the portal login used to fall back to admin/admin123, so a deployment
// that never set a secret was open to anyone. This test drives the REAL routers
// (contactRoutes, volunteerRoutes) and asserts that, with no ADMIN_PORTAL_TOKEN
// configured, the built-in defaults are rejected — and that with a configured
// secret only that secret is accepted. No database is needed: the guard runs
// before any query.
//
//   node backend_node/tests/adminAuth.test.js
process.env.NODE_ENV = 'test';

const express = require('express');

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  \u2713 ${name}`); }
  else { fail += 1; console.log(`  \u2717 ${name} ${extra}`); }
};

const clearEnv = () => { delete process.env.ADMIN_PORTAL_TOKEN; delete process.env.ADMIN_USERNAME; delete process.env.ADMIN_PASSWORD; };

async function main() {
  const app = express();
  app.use(express.json());
  app.use('/api', require('../routes/contactRoutes'));
  app.use('/api', require('../routes/volunteerRoutes'));
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = (p, h = {}) => fetch(base + p, { headers: h }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  const post = (p, body) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));

  try {
    console.log('\nWith NO ADMIN_PORTAL_TOKEN configured (must fail closed):');
    clearEnv();
    const loginDefault = await post('/api/admin/login', { username: 'admin', password: 'admin123' });
    ok('the default admin/admin123 login is refused', loginDefault.status === 503 && !loginDefault.body.token, JSON.stringify(loginDefault.body));
    const legacy = await get('/api/admin/contacts', { Authorization: 'Bearer ssf-admin-portal-token' });
    ok('the old literal token no longer unlocks admin routes', legacy.status === 401, String(legacy.status));
    const anything = await get('/api/admin/contacts', { Authorization: 'Bearer anything-else' });
    ok('an arbitrary token is rejected', anything.status === 401, String(anything.status));
    const noAuth = await get('/api/admin/contacts');
    ok('a request with no token is rejected', noAuth.status === 401, String(noAuth.status));

    console.log('\nWith ADMIN_PORTAL_TOKEN + ADMIN_USERNAME/PASSWORD configured:');
    process.env.ADMIN_PORTAL_TOKEN = 'secret-xyz-123';
    process.env.ADMIN_USERNAME = 'chief';
    process.env.ADMIN_PASSWORD = 'S3cret!pass';
    const legacyNow = await get('/api/admin/contacts', { Authorization: 'Bearer ssf-admin-portal-token' });
    ok('the old literal token is still rejected once a real secret is set', legacyNow.status === 401, String(legacyNow.status));
    const configured = await get('/api/admin/contacts', { Authorization: 'Bearer secret-xyz-123' });
    ok('the configured token passes the admin guard', configured.status !== 401, String(configured.status));
    const badLogin = await post('/api/admin/login', { username: 'admin', password: 'admin123' });
    ok('admin/admin123 is refused when real credentials exist', badLogin.status === 401, JSON.stringify(badLogin.body));
    const wrongPass = await post('/api/admin/login', { username: 'chief', password: 'nope' });
    ok('a wrong password is refused', wrongPass.status === 401, String(wrongPass.status));
    const goodLogin = await post('/api/admin/login', { username: 'chief', password: 'S3cret!pass' });
    ok('the configured credentials log in', goodLogin.status === 200 && goodLogin.body.token === 'secret-xyz-123', JSON.stringify(goodLogin.body));

    console.log('\nMissing only the admin secret (credentials present) still fails closed:');
    delete process.env.ADMIN_PORTAL_TOKEN;
    const noSecret = await post('/api/admin/login', { username: 'chief', password: 'S3cret!pass' });
    ok('login is refused when ADMIN_PORTAL_TOKEN is not set', noSecret.status === 503 && !noSecret.body.token, JSON.stringify(noSecret.body));
  } catch (error) {
    fail += 1;
    console.error('\n  \u2717 unexpected failure:', error);
  } finally {
    server.close();
    console.log(`\n${fail === 0 ? '\u2705' : '\u274c'} ${pass} passed, ${fail} failed\n`);
    process.exit(fail === 0 ? 0 : 1);
  }
}

main();
