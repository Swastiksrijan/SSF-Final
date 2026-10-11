// Integration test: mount socialRoutes on express with an in-memory Postgres and
// exercise the real HTTP endpoints (dashboard, events CRUD, cron guard). This
// catches wiring bugs (e.g. an un-awaited async call) that unit tests miss.
//
//   node backend_node/tests/social.http.test.js
process.env.NODE_ENV = 'test';
process.env.ADMIN_PORTAL_TOKEN = 'test-token';

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
  const express = require('express');
  const { sequelize } = require('../models/social');
  await sequelize.sync({ force: true });
  const { seedSocialEvents } = require('../services/social/calendarSeed');
  await seedSocialEvents();

  const router = require('../routes/socialRoutes');
  const app = express();
  app.use(express.json());
  app.use('/api', router);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const auth = { Authorization: 'Bearer test-token' };
  const get = (p, h = {}) => fetch(base + p, { headers: h }).then(async (r) => ({ status: r.status, body: await r.json() }));
  const send = (p, method, body, h = {}) => fetch(base + p, { method, headers: { ...auth, 'Content-Type': 'application/json', ...h }, body: body ? JSON.stringify(body) : undefined }).then(async (r) => ({ status: r.status, body: await r.json() }));

  try {
    console.log('\nAuth:');
    ok('dashboard without token = 401', (await get('/api/social/dashboard')).status === 401);
    ok('dashboard wrong token = 401', (await get('/api/social/dashboard', { Authorization: 'Bearer nope' })).status === 401);

    console.log('\nDashboard (the endpoint the UI calls):');
    const dash = await get('/api/social/dashboard', auth);
    ok('dashboard 200', dash.status === 200, JSON.stringify(dash.body).slice(0, 120));
    ok('dashboard has stats', dash.body.stats && typeof dash.body.stats.published === 'number');
    ok('dashboard has heartbeat object', !!dash.body.heartbeat);
    ok('dashboard has calendar array', Array.isArray(dash.body.calendar) && dash.body.calendar.length > 30, `len=${dash.body.calendar && dash.body.calendar.length}`);
    ok('dashboard has todayEvents array', Array.isArray(dash.body.todayEvents));
    ok('dashboard has upcomingSevenDays array', Array.isArray(dash.body.upcomingSevenDays));
    ok('dashboard exposes timezone + nextScheduledAt', !!dash.body.timezone && !!dash.body.nextScheduledAt);
    ok('dashboard lists 20 topic keys', Array.isArray(dash.body.topics) && dash.body.topics.length === 20, `n=${dash.body.topics && dash.body.topics.length}`);
    ok('dashboard exposes uncertain calendar warnings', dash.body.calendarWarnings && typeof dash.body.calendarWarnings.uncertainCount === 'number');

    console.log('\nPlan / publish draft lifecycle:');
    const plan = await send('/api/social/plan', 'POST', {});
    ok('plan creates drafts', plan.body.created >= 1, JSON.stringify(plan.body));
    const dash2 = await get('/api/social/dashboard', auth);
    ok('drafts now visible as awaiting approval', dash2.body.draftsAwaitingApproval.length >= 1);

    console.log('\nCalendar admin CRUD:');
    const created = await send('/api/social/events', 'POST', { date: '2026-12-24', titleEn: 'Test Fest', titleHi: 'परीक्षण', tradition: 'other', greetingEn: 'Happy Test Fest!', greetingHi: 'शुभ!' });
    ok('event created', created.status === 200 && created.body.event.id, JSON.stringify(created.body).slice(0, 120));
    const id = created.body.event.id;
    const patched = await send(`/api/social/events/${id}`, 'PATCH', { uncertain: true });
    ok('event patched', patched.body.event.uncertain === true);
    const excluded = await send(`/api/social/events/${id}`, 'DELETE', null);
    ok('event soft-excluded (not deleted)', excluded.status === 200);
    const list = await get('/api/social/events', auth);
    const stillThere = list.body.events.find((e) => e.id === id);
    ok('excluded event still listed (history kept)', !!stillThere && stillThere.status === 'excluded');

    console.log('\nPreview (no persistence):');
    const preview = await get('/api/social/preview?date=2026-12-24&slot=morning', auth);
    ok('preview 200 and returns a post', preview.status === 200 && !!preview.body.post.titleEn, JSON.stringify(preview.body).slice(0, 120));
    ok('preview is flagged preview', preview.body.post.preview === true);

    console.log('\nCron guard:');
    ok('cron without key = 401', (await get('/api/social/cron')).status === 401);
    ok('cron with key = 200', (await get('/api/social/cron?key=test-token')).status === 200);
  } finally {
    server.close();
    await sequelize.close();
  }

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  if (fail) process.exit(1);
}

main().catch((e) => { console.error('TEST ERROR', e); process.exit(1); });
