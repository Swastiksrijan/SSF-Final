// Regression test: a database outage must be reported honestly, not disguised
// as a generic "Server Error". Runs against an in-memory Postgres (pg-mem) so
// the live probe exercises the real Sequelize connection.
//
//   node backend_node/tests/dbHealth.test.js
process.env.NODE_ENV = 'test';

const { newDb } = require('pg-mem');
const mem = newDb();
const pgAdapter = mem.adapters.createPg();
const realPgPath = require.resolve('pg');
require(realPgPath);
require.cache[realPgPath].exports = { ...require.cache[realPgPath].exports, Client: pgAdapter.Client, Pool: pgAdapter.Pool };

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  \u2713 ${name}`); }
  else { fail += 1; console.log(`  \u2717 ${name} ${extra}`); }
};

async function main() {
  const { isDatabaseDown, isQuotaError, databaseUnavailableResponse, databaseStatus } = require('../services/dbHealth');

  console.log('\nClassify database failures:');
  ok('Neon quota message is a database outage', isDatabaseDown(new Error('Your account or project has exceeded the quota. Upgrade your plan to increase limits.')));
  ok('quota detected specifically', isQuotaError(new Error('Your account or project has exceeded the quota. Upgrade your plan to increase limits.')));
  ok('ECONNREFUSED is a database outage', isDatabaseDown(Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:5432'), { code: 'ECONNREFUSED' })));
  ok('SQLSTATE 57P01 is a database outage', isDatabaseDown(Object.assign(new Error('terminating connection due to administrator command'), { code: '57P01' })));
  ok('too many connections is a database outage', isDatabaseDown(new Error('sorry, too many clients already')));
  ok('nested parent message is inspected', isDatabaseDown({ message: 'wrap', parent: { message: 'connect ETIMEDOUT 10.0.0.1:5432', code: 'ETIMEDOUT' } }));

  console.log('\nOrdinary errors are NOT treated as outages:');
  ok('validation error stays an application error', !isDatabaseDown(new Error('Email and password are required')));
  ok('unique-constraint error is not an outage', !isDatabaseDown(Object.assign(new Error('Validation error'), { name: 'SequelizeUniqueConstraintError', code: '23505' })));
  ok('null is not an outage', !isDatabaseDown(null));

  console.log('\nResponse helper:');
  const makeRes = () => {
    const res = { statusCode: null, body: null };
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (body) => { res.body = body; return res; };
    return res;
  };
  const outageRes = makeRes();
  const handled = databaseUnavailableResponse(outageRes, new Error('Your account or project has exceeded the quota. Upgrade your plan to increase limits.'));
  ok('outage is handled (returns true)', handled === true);
  ok('outage answers 503', outageRes.statusCode === 503, String(outageRes.statusCode));
  ok('outage carries a machine-readable code', outageRes.body?.code === 'DATABASE_UNAVAILABLE');
  ok('outage message never leaks the raw driver text', !/quota|Neon|plan/i.test(outageRes.body?.message || ''));

  const normalRes = makeRes();
  ok('ordinary error is left to the caller', databaseUnavailableResponse(normalRes, new Error('Email and password are required')) === false);
  ok('ordinary error did not send a response', normalRes.statusCode === null);

  console.log('\nLive probe against a reachable database:');
  const status = await databaseStatus();
  ok('reachable database reports ok', status.ok === true, JSON.stringify(status));
  ok('reachable database reports reachable', status.reachable === true);

  console.log('\nSafety-net middleware (no route may leak a raw driver message):');
  const { databaseUnavailableMiddleware } = require('../services/dbHealth');
  const runMiddleware = (body) => {
    const res = { statusCode: 200, body: null };
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (b) => { res.body = b; return res; };
    databaseUnavailableMiddleware({}, res, () => {});
    res.json(body);
    return res;
  };
  const leaked = runMiddleware({ message: 'Your account or project has exceeded the quota. Upgrade your plan to increase limits.' });
  ok('raw quota message is rewritten to 503', leaked.statusCode === 503, String(leaked.statusCode));
  ok('rewritten body carries DATABASE_UNAVAILABLE', leaked.body?.code === 'DATABASE_UNAVAILABLE');
  ok('rewritten body hides the driver text', !/quota|Neon|plan/i.test(leaked.body?.message || ''));
  const kept = runMiddleware({ message: 'Please enter your email address.' });
  ok('ordinary message is passed through untouched', kept.statusCode === 200 && kept.body.message === 'Please enter your email address.');
  const alreadyHonest = runMiddleware({ code: 'DATABASE_UNAVAILABLE', message: 'quota' });
  ok('an already-shaped 503 body is left alone', alreadyHonest.body.code === 'DATABASE_UNAVAILABLE' && alreadyHonest.body.message === 'quota');

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((error) => { console.error(error); process.exit(1); });
