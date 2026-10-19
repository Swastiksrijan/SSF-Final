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
  const m = content.planLibraryPost(d1, 'daily');
  ok('daily post is bilingual', m.bodyEn.length > 100 && m.bodyHi.length > 100);
  ok('opener is not time-based (no "Good morning/evening")', !/Good morning|Good evening/i.test(m.bodyEn), m.bodyEn.slice(0, 30));
  ok('library posts labelled library (not AI)', m.contentSource === 'library');
  // Adjacent days must differ, and a recent-topic set must be respected.
  const next = content.planLibraryPost(new Date(2026, 4, 21), 'daily');
  ok('adjacent days differ', next.topicKey !== m.topicKey || next.titleEn !== m.titleEn);
  const used = new Set([m.topicKey]);
  const avoided = content.planLibraryPost(d1, 'daily', used);
  ok('used topic is not chosen again', avoided.topicKey !== m.topicKey, `${avoided.topicKey} vs ${m.topicKey}`);
  const topics = new Set();
  for (let i = 0; i < 20; i += 1) topics.add(content.planLibraryPost(new Date(2026, 0, 1 + i), 'daily').category);
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
  ok('first planDue creates 1 post (one per day)', made1.length === 1, `got=${made1.length}`);
  ok('second planDue creates 0 (idempotent)', made2.length === 0, `got=${made2.length}`);
  const dayPosts = await SocialPost.findAll({ where: { postDate: '2026-07-20' } });
  ok('exactly one post for the day', dayPosts.length === 1, `got=${dayPosts.length}`);
  const draftRow = await SocialPost.findOne({ where: { postDate: '2026-07-20', slot: 'daily' } });
  ok('post uses the single daily slot', !!draftRow);
  ok('scheduledFor preserves the daily time (08:00)', String(draftRow.scheduledFor).includes('08:00'), String(draftRow.scheduledFor));
  await draftRow.update({ status: 'published', titleEn: 'ORIGINAL', publishedAt: new Date() });
  await publisher.planDue({ date: new Date(2026, 6, 20), rebuild: true });
  const afterRebuild = await SocialPost.findByPk(draftRow.id);
  ok('published post NOT reverted to draft', afterRebuild.status === 'published', afterRebuild.status);
  ok('published post content unchanged after rebuild', afterRebuild.titleEn === 'ORIGINAL', afterRebuild.titleEn);
  // A second day must not reuse the first day's topic (no duplicate content).
  const made3 = await publisher.planDue({ date: new Date(2026, 6, 21), rebuild: false });
  ok('next day creates a fresh post', made3.length === 1, `got=${made3.length}`);
  ok('next day topic differs from previous day', made3[0].topicKey !== draftRow.topicKey, `${made3[0].topicKey} vs ${draftRow.topicKey}`);

  console.log('\nDaily course series (5 chapters/day, in order):');
  const { SocialCourseProgress } = require('../models/social');
  await SocialCourseProgress.destroy({ where: {} });
  await SocialPost.destroy({ where: { kind: 'course' } });
  const cday1 = new Date(2026, 7, 1); // 1 Aug 2026
  const cs1 = await publisher.planCourseSeries(cday1);
  ok('five course posts created per day', cs1.length === 5, `got=${cs1.length}`);
  // Regression: repeated ticks must NOT create duplicates.
  const csAgain = await publisher.planCourseSeries(cday1);
  const csAgain2 = await publisher.planCourseSeries(cday1);
  ok('repeated ticks create no duplicates', csAgain.length === 0 && csAgain2.length === 0, `got=${csAgain.length},${csAgain2.length}`);
  const totalCourseRows = await SocialPost.count({ where: { kind: 'course' } });
  ok('still exactly 5 course rows after 3 ticks', totalCourseRows === 5, `rows=${totalCourseRows}`);
  ok('all are course kind', cs1.every((p) => p.kind === 'course'));
  ok('first chapters are 1..5', cs1.every((p) => p.data.chapterNo === 1));
  ok('every course gets its own slot', new Set(cs1.map((p) => p.slot)).size === 5);
  ok('each has a next-chapter pointer in its body', cs1.every((p) => /Next chapter: Chapter 2/.test(p.bodyEn)));
  ok('bilingual bodies', cs1.every((p) => p.bodyEn.length > 100 && p.bodyHi.length > 100));

  // Publishing advances each course pointer by exactly one — no skip, no repeat.
  const platforms0 = await publisher.enabledPlatforms();
  for (const p of cs1) await publisher.publishPost(p, platforms0);
  const prog1 = await SocialCourseProgress.findAll();
  ok('all five course pointers advanced to 1', prog1.length === 5 && prog1.every((r) => Number(r.lastChapter) === 1));

  const cs2 = await publisher.planCourseSeries(new Date(2026, 7, 2));
  ok('day 2 releases chapter 2 of each course', cs2.length === 5 && cs2.every((p) => p.data.chapterNo === 2));
  ok('day 2 posts point to chapter 3', cs2.every((p) => /Next chapter: Chapter 3/.test(p.bodyEn)));
  ok('no chapter number repeats across days', cs1[0].data.chapterNo !== cs2[0].data.chapterNo);
  for (const p of cs2) await publisher.publishPost(p, platforms0);

  // A finished course stops; the others keep going.
  const cyber = publisher.COURSES.find((c) => c.key === 'cyber-safety');
  await SocialCourseProgress.update({ lastChapter: cyber.chapters.length }, { where: { courseKey: 'cyber-safety' } });
  const cs3 = await publisher.planCourseSeries(new Date(2026, 7, 3));
  ok('finished course is not posted again', !cs3.some((p) => p.data.courseKey === 'cyber-safety'), `keys=${cs3.map((p) => p.data.courseKey)}`);
  ok('remaining courses still continue', cs3.length === 4 && cs3.every((p) => p.data.chapterNo === 3));

  // Repair: simulate the old duplicate-flood bug, then heal it.
  console.log('\nCourse series repair:');
  const floodDay = '2026-08-01';
  await SocialPost.destroy({ where: { postDate: floodDay, kind: 'course' } });
  for (let extra = 1; extra <= 2; extra += 1) {
    await SocialPost.create({
      postDate: floodDay, slot: 'course-cyber-safety', postRef: `DUP-${extra}`,
      kind: 'course', status: 'published', data: { courseKey: 'cyber-safety', chapterNo: 1 + extra, chapterTotal: 20 },
      titleEn: 'x', titleHi: 'x',
    });
  }
  const beforeRepair = await SocialPost.count({ where: { postDate: floodDay, slot: 'course-cyber-safety' } });
  const rep = await publisher.repairCourseSeries();
  const afterRepair = await SocialPost.count({ where: { postDate: floodDay, slot: 'course-cyber-safety' } });
  const cprog = await SocialCourseProgress.findOne({ where: { courseKey: 'cyber-safety' } });
  ok('repair removed the duplicates', beforeRepair === 2 && afterRepair === 1, `before=${beforeRepair} after=${afterRepair}`);
  ok('repair rebuilt the pointer to the highest kept chapter', Number(cprog.lastChapter) === 2, `last=${cprog.lastChapter}`);
  const rep2 = await publisher.repairCourseSeries();
  ok('repair is idempotent', rep2.removed === 0, `second run removed=${rep2.removed}`);

  console.log('\nScheduler heartbeat / logging:');
  await SocialRunLog.destroy({ where: {} });
  const out = await publisher.runPending({ force: false, source: 'test-run' });
  ok('runPending returns postDate', !!out.postDate);
  const logs = await SocialRunLog.findAll();
  ok('run is logged', logs.length >= 1);
  ok('run log records source', logs[0].source === 'test-run');

  console.log('\nDaily awareness series (Samvidhan / Yojana / Charak / GK / English / Prerna / Join):');
  const { SERIES } = publisher;
  const { buildSeriesPost } = require('../services/social/seriesEngine');
  ok('seven awareness series registered', SERIES.length === 7, `n=${SERIES.length}`);
  for (const s of SERIES) {
    const p = buildSeriesPost(s, 1, new Date(2026, 9, 12), `series-${s.key}`);
    ok(`series ${s.key} builds a bilingual chapter`, p.bodyEn.length > 200 && p.bodyHi.length > 200 && p.kind === 'series' && p.seriesKey === s.key && p.chapterNo === 1);
    ok(`series ${s.key} cites its next chapter`, /Next:/.test(p.bodyEn) || s.items.length === 1, s.items.length);
  }
  const samvidhan = SERIES.find((s) => s.key === 'samvidhan');
  ok('Samvidhan covers Fundamental Duties (51A)', samvidhan.items.some((it) => /51A|Fundamental Duties/.test(it.title.en)));
  ok('Samvidhan covers Fundamental Rights (Art 14/19/21)', samvidhan.items.some((it) => /Article 21/.test(it.title.en)) && samvidhan.items.some((it) => /Article 14/.test(it.title.en)));
  const health = SERIES.find((s) => s.key === 'swasthya');
  ok('health series carries a doctor disclaimer', /consult a qualified doctor/i.test(health.note.en));

  // Labh (benefit) boxes: the "how to actually get the benefit" block that turns
  // awareness into action. Optional, so must render only when present, and must
  // carry the concrete who / documents / where details.
  const schemeSeries = SERIES.find((s) => s.key === 'yojana');
  const medScheme = schemeSeries.items.find((it) => /Ayushman/i.test(it.title.en));
  const schemePost = buildSeriesPost(schemeSeries, schemeSeries.items.indexOf(medScheme) + 1, new Date(2026, 9, 12), 'series-yojana');
  ok('labh box renders benefit/eligibility/documents/where', /लाभ/.test(schemePost.bodyHi) && /कौन पात्र/.test(schemePost.bodyHi) && /कागज़ात/.test(schemePost.bodyHi) && /कहाँ आवेदन/.test(schemePost.bodyHi));
  ok('labh box carries a real official portal', /gov\.in/.test(schemePost.bodyHi + schemePost.bodyEn), schemePost.bodyEn.slice(0, 40));
  const constSeries = SERIES.find((s) => s.key === 'samvidhan');
  const art32 = constSeries.items.find((it) => /Article 32/.test(it.title.en));
  const constPost = buildSeriesPost(constSeries, constSeries.items.indexOf(art32) + 1, new Date(2026, 9, 12), 'series-samvidhan');
  ok('constitution labh box points to free legal aid (15100)', /15100/.test(constPost.bodyHi + constPost.bodyEn));
  ok('health labh box carries a real helpline (14416/108/104)', /14416|108|104/.test(buildSeriesPost(health, health.items.findIndex((it) => /Manas|First aid|cleanliness/i.test(it.title.en)) + 1, new Date(2026, 9, 12), 'series-swasthya').bodyHi));
  const gkSeries = SERIES.find((s) => s.key === 'gk');
  ok('a chapter that omits the labh box renders exactly as before (no stray heading)', !/कौन पात्र/.test(buildSeriesPost(gkSeries, 1, new Date(2026, 9, 12), 'series-gk').bodyHi) || !!gkSeries.items[0].extra);

  // The Join stream (seventh) invites participation and must carry the real
  // Join link + a per-post button label, and cover every registered objective.
  const join = SERIES.find((s) => s.key === 'join');
  ok('Join series registered as the seventh stream', !!join && join.items.length === 17, `items=${join && join.items.length}`);
  ok('Join series carries the official Join link', /^https:\/\/swastiksrijan\.in\/JoinUs$/.test(join.ctaUrl || ''), join.ctaUrl);
  const joinPost = buildSeriesPost(join, 1, new Date(2026, 9, 12), 'series-join');
  ok('Join post exposes ctaUrl + bilingual button label', joinPost.ctaUrl === join.ctaUrl && joinPost.ctaLabelEn === 'Join SSF' && joinPost.ctaLabelHi === 'SSF से जुड़ें', JSON.stringify(joinPost.ctaLabelEn));
  ok('Join caption prints the link line in both languages', joinPost.bodyEn.includes(join.ctaUrl) && joinPost.bodyHi.includes(join.ctaUrl));
  ok('Join caption renders the anti-fraud note (not [object Object])', /SSF never asks for money/i.test(joinPost.bodyEn) && /पैसा नहीं माँगता/.test(joinPost.bodyHi));
  // The paid membership chapter must not label its "where to apply" box as free.
  const memberPost = buildSeriesPost(join, join.items.findIndex((it) => /Membership —/.test(it.title.en)) + 1, new Date(2026, 9, 12), 'series-join');
  ok('paid membership box drops the "(free)" qualifier', !/\(free\)/i.test(memberPost.bodyEn) && !/निःशुल्क/.test(memberPost.bodyHi));
  ok('free chapters keep the "(free)" qualifier', (() => { const freeIdx = join.items.findIndex((it) => it.extra && !it.extra.fee); return freeIdx >= 0 && /\(free\)/i.test(buildSeriesPost(join, freeIdx + 1, new Date(2026, 9, 12), 'series-join').bodyEn); })());
  const objectiveRe = [/Education/, /Skill Development/, /Women & Child/, /Health/, /Environment/, /Agriculture/, /Social Justice/, /Disability/, /Animal Protection/, /Religious & Cultural/];
  ok('Join series covers all ten registered objectives', objectiveRe.every((re) => join.items.some((it) => re.test(it.title.en))));
  // Every series' note now resolves to text in both languages, never "[object Object]".
  for (const s of SERIES) {
    const p = buildSeriesPost(s, 1, new Date(2026, 9, 12), `series-${s.key}`);
    ok(`series ${s.key} renders its note as text, not [object Object]`, !/\[object Object\]/.test(p.bodyEn + p.bodyHi));
  }

  // Series planning is idempotent and advances one chapter per day on publish.
  {
    // Slot helpers: a series time is 'HH:MM' or an array; counts add up.
    const { slotList, seriesSlotsPerDay, DEFAULT_SERIES_TIMES, DEFAULT_SERIES_ENABLED } = require('../services/social/publisher');
    ok('slotList normalises a single time to a 1-array', JSON.stringify(slotList('16:00')) === JSON.stringify(['16:00']));
    ok('slotList keeps both times of an array', JSON.stringify(slotList(['16:00', '21:00'])) === JSON.stringify(['16:00', '21:00']));
    ok('slotList drops malformed values', JSON.stringify(slotList(['16:00', 'bad', '21:00'])) === JSON.stringify(['16:00', '21:00']));
    ok('seriesSlotsPerDay = 3 single + 2 join = 5 by default', seriesSlotsPerDay(DEFAULT_SERIES_TIMES, DEFAULT_SERIES_ENABLED) === 5, `got=${seriesSlotsPerDay(DEFAULT_SERIES_TIMES, DEFAULT_SERIES_ENABLED)}`);
  }
  const { SocialSeriesProgress } = require('../models/social');
  await SocialSeriesProgress.destroy({ where: {} });
  await SocialPost.destroy({ where: { kind: 'series' } });
  // Safe default: 3 awareness series (1 slot each) + Join SSF (2 slots) = 5 posts.
  await publisher.setConfig('seriesEnabled', null);
  const dflt = await publisher.planAwarenessSeries(new Date(2026, 7, 1));
  ok('fresh install plans the default set (3 series + Join twice a day = 5)', dflt.length === 5, `got=${dflt.length}`);
  ok('Join SSF ships enabled by default', new Set(dflt.map((p) => p.data.seriesKey)).size === 4 && dflt.some((p) => p.data.seriesKey === 'join'), `keys=${[...new Set(dflt.map((p) => p.data.seriesKey))]}`);
  ok('Join SSF drafts two slots a day (same chapter)', dflt.filter((p) => p.data.seriesKey === 'join').length === 2 && dflt.filter((p) => p.data.seriesKey === 'join').every((p) => p.data.chapterNo === 1));
  {
    const joinDrafts = dflt.filter((p) => p.data.seriesKey === 'join').sort((a, b) => a.scheduledFor - b.scheduledFor);
    const hhmm = (d) => `${String(new Date(d).getHours()).padStart(2, '0')}:${String(new Date(d).getMinutes()).padStart(2, '0')}`;
    ok('Join SSF slots land at the two configured times (07:00 and 19:00)', hhmm(joinDrafts[0].scheduledFor) === '07:00' && hhmm(joinDrafts[1].scheduledFor) === '19:00', joinDrafts.map((p) => hhmm(p.scheduledFor)).join(','));
  }
  await SocialSeriesProgress.destroy({ where: {} });
  await SocialPost.destroy({ where: { kind: 'series' } });
  // Enable all seven for the ordering/idempotency flow below.
  await publisher.setConfig('seriesEnabled', { samvidhan: true, yojana: true, swasthya: true, gk: true, 'english-word': true, prerna: true, join: true });
  const sday1 = new Date(2026, 8, 1);
  const sp1 = await publisher.planAwarenessSeries(sday1);
  ok('all seven series planned (Join twice) = 8 posts a day', sp1.length === 8, `got=${sp1.length}`);
  const spAgain = await publisher.planAwarenessSeries(sday1);
  ok('repeated series ticks create no duplicates', spAgain.length === 0, `got=${spAgain.length}`);
  ok('every series slot is distinct', new Set(sp1.map((p) => p.slot)).size === 8);
  ok('all are series kind with chapter 1', sp1.every((p) => p.kind === 'series' && p.data.chapterNo === 1));
  const platforms1 = await publisher.enabledPlatforms();
  for (const p of sp1) await publisher.publishPost(p, platforms1);
  const sprog = await SocialSeriesProgress.findAll();
  ok('all seven series pointers advanced to 1', sprog.length === 7 && sprog.every((x) => Number(x.lastChapter) === 1));
  {
    // Join's two slots both published, but its pointer advanced only ONCE — the
    // second slot must never burn a second chapter.
    const jp = sp1.filter((p) => p.data.seriesKey === 'join');
    const jPublished = await SocialPost.findAll({ where: { id: jp.map((p) => p.id) } });
    const jProg = sprog.find((x) => x.seriesKey === 'join');
    ok('both Join slots published the same chapter', jPublished.length === 2 && jPublished.every((p) => p.status === 'published' && p.data.chapterNo === 1));
    ok('Join pointer advanced once despite two slots', jProg && Number(jProg.lastChapter) === 1, `lastChapter=${jProg && jProg.lastChapter}`);
  }
  const sp2 = await publisher.planAwarenessSeries(new Date(2026, 8, 2));
  ok('day 2 releases chapter 2 of each series', sp2.length === 8 && sp2.every((p) => p.data.chapterNo === 2));
  // A disabled series is skipped without touching the others.
  await publisher.setConfig('seriesEnabled', { gk: false });
  await SocialPost.destroy({ where: { postDate: '2026-09-03', kind: 'series' } });
  const sp3 = await publisher.planAwarenessSeries(new Date(2026, 8, 3));
  ok('disabled series is skipped', !sp3.some((p) => p.data.seriesKey === 'gk'), `keys=${sp3.map((p) => p.data.seriesKey)}`);
  ok('other series still run', sp3.length === 7, `got=${sp3.length}`);
  await publisher.setConfig('seriesEnabled', {});

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  await sequelize.close();
  if (fail) process.exit(1);
}

main().catch((e) => { console.error('TEST ERROR', e); process.exit(1); });
