// Acceptance tests for the SSF Social Awareness Publisher improvements.
// Runs against an in-memory Postgres (pg-mem) so the real models/publisher
// code paths are exercised — the logic under test is not mocked.
//
//   node backend_node/tests/social.test.js
process.env.NODE_ENV = 'test';

const path = require('path');
const { newDb } = require('pg-mem');

// Build an in-memory Postgres and expose it as the `pg` module BEFORE sequelize
// resolves it, so Sequelize's postgres dialect talks to pg-mem.
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
  const { sequelize, SocialPost, SocialEvent, SocialRunLog } = require('../models/social');
  await sequelize.sync({ force: true });

  const publisher = require('../services/social/publisher');
  const content = require('../services/social/content');
  const { seedSocialEvents, GREETINGS } = require('../services/social/calendarSeed');

  console.log('\nCalendar seed:');
  const seeded = await seedSocialEvents();
  ok('seeds calendar entries', seeded.created > 30, `created=${seeded.created}`);
  const seeded2 = await seedSocialEvents();
  ok('seed is idempotent', seeded2.created === 0, `created=${seeded2.created}`);
  const uncertain = await SocialEvent.count({ where: { uncertain: true } });
  ok('lunar/Islamic dates flagged uncertain', uncertain >= 3, `uncertain=${uncertain}`);
  const traditions = new Set((await SocialEvent.findAll()).map((e) => e.tradition));
  ok('multiple traditions covered', traditions.size >= 8, `traditions=${traditions.size}`);

  console.log('\nContent engine (daily freshness):');
  const d1 = new Date(2026, 4, 20); // 20 May 2026 — no seeded event
  const m = content.planLibraryPost(d1, 'morning');
  const e = content.planLibraryPost(d1, 'evening');
  ok('morning/evening differ in topic', m.topicKey !== e.topicKey, `${m.topicKey} vs ${e.topicKey}`);
  ok('morning/evening differ in title', m.titleEn !== e.titleEn);
  ok('bilingual body present', m.bodyEn.length > 100 && m.bodyHi.length > 100);
  ok('morning body opens with morning greeting', /Good morning/.test(m.bodyEn), m.bodyEn.slice(0, 20));
  ok('evening body opens with evening greeting', /Good evening/.test(e.bodyEn), e.bodyEn.slice(0, 20));
  ok('library posts labelled library (not AI)', m.contentSource === 'library');
  const next = content.planLibraryPost(new Date(2026, 4, 21), 'morning');
  ok('adjacent days differ', next.topicKey !== m.topicKey || next.titleEn !== m.titleEn);
  const topics = new Set();
  for (let i = 0; i < 20; i += 1) topics.add(content.planLibraryPost(new Date(2026, 0, 1 + i), 'morning').category);
  ok('covers many distinct topics over 20 days', topics.size >= 15, `topics=${topics.size}`);

  console.log('\nFestival posts (verified, per-tradition):');
  const asDay = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));
  const holi = await SocialEvent.findOne({ where: { key: 'holi-2026' } });
  ok('Holi 2026 on 2026-03-04', holi && asDay(holi.date) === '2026-03-04', holi && asDay(holi.date));
  const fp = content.planEventPost(holi, 'morning', new Date(2026, 2, 4));
  ok('festival post kind = festival', fp.kind === 'festival');
  ok('Holi has its own greeting', /Holi/i.test(fp.titleEn), fp.titleEn);
  const eid = await SocialEvent.findOne({ where: { key: 'eid-fitr-2026' } });
  ok('Eid al-Fitr flagged uncertain', eid && eid.uncertain === true);
  ok('Eid greeting is its own salutation', /Eid Mubarak/.test(eid.greetingEn), eid.greetingEn);
  ok('Sikh greeting is its own salutation', /Sat Sri Akal/.test((GREETINGS['guru-nanak-jayanti'] || {}).greetingEn || ''));
  ok('Buddhist greeting is its own salutation', /Buddha Purnima/.test((GREETINGS['buddha-purnima'] || {}).greetingEn || ''));
  // No single generic greeting reused across religions.
  const greetSet = new Set(['christmas', 'eid-fitr', 'holi', 'guru-nanak-jayanti', 'buddha-purnima', 'mahavir-jayanti'].map((k) => (GREETINGS[k] || {}).greetingEn));
  ok('each religion has a distinct greeting', greetSet.size === 6, `distinct=${greetSet.size}`);

  console.log('\nVerified vs uncertain gating:');
  await SocialEvent.create({ key: 'test-uncertain', date: '2026-07-01', titleEn: 'Uncertain Test', titleHi: 'अनिश्चित', tradition: 'other', region: 'India', calendarSystem: 'lunar', eventType: 'observance', verified: true, uncertain: true, status: 'active' });
  ok('uncertain events excluded from auto-greeting', (await publisher.eventsForDate('2026-07-01')).length === 0);
  await SocialEvent.create({ key: 'test-verified', date: '2026-07-02', titleEn: 'Verified Test', titleHi: 'सत्यापित', tradition: 'other', region: 'India', calendarSystem: 'gregorian', eventType: 'observance', greetingEn: 'Happy Verified Test!', greetingHi: 'शुभ!', verified: true, uncertain: false, status: 'active' });
  ok('verified event included', (await publisher.eventsForDate('2026-07-02')).length === 1);
  await SocialEvent.create({ key: 'test-second', date: '2026-07-02', titleEn: 'Second Event', titleHi: 'दूसरा', tradition: 'other', region: 'India', calendarSystem: 'gregorian', eventType: 'awareness', greetingEn: 'Hi', greetingHi: 'नमस्ते', verified: true, uncertain: false, status: 'active' });
  const sameDay = await publisher.eventsForDate('2026-07-02');
  ok('both same-day events returned (no silent erase)', sameDay.length === 2);

  console.log('\nEvent prioritisation:')
  await SocialEvent.create({ key: 'test-fest-big', date: '2026-08-01', titleEn: 'Big Festival', titleHi: 'बड़ा', tradition: 'hindu', region: 'India', calendarSystem: 'gregorian', eventType: 'religious', greetingEn: 'Shubh!', greetingHi: 'शुभ!', verified: true, uncertain: false, status: 'active', priority: 10 });
  await SocialEvent.create({ key: 'test-awareness', date: '2026-08-01', titleEn: 'UN Awareness Day', titleHi: 'जागरूकता', tradition: 'un', region: 'Global', calendarSystem: 'gregorian', eventType: 'awareness', greetingEn: 'Hello', greetingHi: 'नमस्ते', verified: true, uncertain: false, status: 'active', priority: 5 });
  const ordered = await publisher.eventsForDate('2026-08-01');
  ok('higher-priority event listed first', ordered[0] && ordered[0].titleEn === 'Big Festival', ordered[0] && ordered[0].titleEn);

  console.log('\nSeed backfill is non-destructive:')
  // Simulate a legacy seeded row with a null greeting and an admin-set palette.
  await SocialEvent.update({ greetingEn: null, priority: 0, palette: 'admin-custom' }, { where: { key: 'diwali-2026' } });
  const seed2 = await seedSocialEvents();
  ok('idempotent re-run creates nothing new', seed2.created === 0, `created=${seed2.created}`);
  const legacy = await SocialEvent.findOne({ where: { key: 'diwali-2026' } });
  ok('null greeting backfilled', !!legacy.greetingEn, String(legacy.greetingEn));
  ok('null priority backfilled', legacy.priority > 0, String(legacy.priority));
  ok('admin palette NOT overwritten', legacy.palette === 'admin-custom', legacy.palette);

  console.log('\nConfig / timezone (DST-safe):');
  await publisher.setConfig('times', { morning: '08:00', evening: '18:00' });
  ok('times stored', JSON.stringify(await publisher.getConfig('times')) === JSON.stringify({ morning: '08:00', evening: '18:00' }));
  await publisher.setConfig('timezone', 'America/New_York');
  ok('timezone configurable (IANA)', (await publisher.timezone()) === 'America/New_York');
  await publisher.setConfig('timezone', 'Asia/Kolkata');
  ok('local parts respect tz (IST 08:00)', publisher.localParts(new Date('2026-03-04T02:30:00Z'), 'Asia/Kolkata').hhmm === '08:00');

  console.log('\nDedup / idempotency / published history:');
  await SocialPost.destroy({ where: {} });
  await publisher.setConfig('post_seq', 0);
  const made1 = await publisher.planDue({ date: new Date(2026, 6, 20), rebuild: false });
  const made2 = await publisher.planDue({ date: new Date(2026, 6, 20), rebuild: false });
  ok('first planDue creates 2 posts', made1.length === 2, `got=${made1.length}`);
  ok('second planDue creates 0 (idempotent)', made2.length === 0, `got=${made2.length}`);
  const draftRow = await SocialPost.findOne({ where: { postDate: '2026-07-20', slot: 'morning' } });
  ok('scheduledFor preserves slot time (08:00)', String(draftRow.scheduledFor).includes('08:00'), String(draftRow.scheduledFor));
  await draftRow.update({ status: 'published', titleEn: 'ORIGINAL', publishedAt: new Date() });
  await publisher.planDue({ date: new Date(2026, 6, 20), rebuild: true });
  const afterRebuild = await SocialPost.findByPk(draftRow.id);
  ok('published post NOT reverted to draft', afterRebuild.status === 'published', afterRebuild.status);
  ok('published post content unchanged after rebuild', afterRebuild.titleEn === 'ORIGINAL', afterRebuild.titleEn);

  console.log('\nScheduler heartbeat / logging:');
  await SocialRunLog.destroy({ where: {} });
  const out = await publisher.runPending({ force: false, source: 'test-run' });
  ok('runPending returns postDate', !!out.postDate);
  const logs = await SocialRunLog.findAll();
  ok('run is logged', logs.length >= 1);
  ok('run log records source', logs[0].source === 'test-run');

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  await sequelize.close();
  if (fail) process.exit(1);
}

main().catch((e) => { console.error('TEST ERROR', e); process.exit(1); });
