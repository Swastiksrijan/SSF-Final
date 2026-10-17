// SSF Social Publisher — orchestrator.
// planDue()   : make sure today's morning/evening drafts exist.
// runPending(): publish every draft whose time has arrived (or everything when
//               `force` is set), then record per-channel results.
// Idempotent by (postDate, slot): re-runs never duplicate a post.

const crypto = require('crypto');
const { Op } = require('sequelize');
const { SocialChannel, SocialPost, SocialConfig, SocialEvent, SocialRunLog, SocialCourseProgress, SocialSeriesProgress } = require('../../models/social');
const { planPost, planLibraryPost, planEventPost, planCoursePost, splitPlan, COURSES, COURSE_TIMES } = require('./content');
const { ADAPTERS } = require('./channels');
const { SERIES, seriesByKey, DEFAULT_SERIES_TIMES, DEFAULT_SERIES_ENABLED } = require('./series');
const { buildSeriesPost, advanceSeriesProgress } = require('./seriesEngine');

const DEFAULT_PLATFORMS = ['website', 'facebook', 'instagram', 'telegram', 'linkedin', 'whatsapp', 'x', 'youtube'];
const POWER_AUTOMATE = Number(process.env.SOCIAL_AUTO == null ? 1 : process.env.SOCIAL_AUTO) !== 0;
const DEFAULT_TZ = process.env.SOCIAL_TZ || 'Asia/Kolkata';

async function getConfig(key, fallback = null) {
  const row = await SocialConfig.findOne({ where: { key } });
  return row ? row.value : fallback;
}
async function setConfig(key, value) {
  const row = await SocialConfig.findOne({ where: { key } });
  if (row) { row.value = value; await row.save(); }
  else await SocialConfig.create({ key, value });
  return value;
}

// Timezone-aware local parts. The default is Asia/Kolkata, but an admin can set
// `timezone` in config (or SOCIAL_TZ) so publishing works internationally and
// follows daylight-saving automatically via the IANA zone.
async function timezone() { return (await getConfig('timezone', DEFAULT_TZ)) || DEFAULT_TZ; }

function localParts(date, tz) {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', hour12: false });
  const p = {};
  for (const { type, value } of fmt.formatToParts(date)) p[type] = value;
  return { hhmm: `${p.hour}:${p.minute}`, y: Number(p.year), m: Number(p.month), d: Number(p.day) };
}
// Backwards-compatible IST helpers (used elsewhere / by tests).
function istParts(date = new Date()) { return localParts(date, 'Asia/Kolkata'); }
function istDateParts(date = new Date()) { return istParts(date); }

// A stable fingerprint of the content, so a regenerated post that would repeat
// an earlier title/topic can be detected and avoided.
function contentHash(p) {
  return crypto.createHash('sha1')
    .update(`${p.topicKey || ''}|${p.titleEn || ''}|${String(p.bodyEn || '').slice(0, 160)}`)
    .digest('hex').slice(0, 16);
}

function nextRef(seq) {
  const y = istDateParts().y;
  return `SOCIAL-${y}-${String(seq).padStart(4, '0')}`;
}

/**
 * Verified events on a given local date. Only `active`, `verified` events that
 * are NOT flagged uncertain are returned — an unverified lunar date must never
 * be greeted automatically. Admins approve dates from the calendar screen.
 */
async function eventsForDate(dateStr) {
  const rows = await SocialEvent.findAll({ where: { date: dateStr, status: 'active' } });
  return rows.filter((r) => r.verified && !r.uncertain)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0) || (a.id - b.id));
}

// All events (incl. uncertain/unverified) for the admin calendar view.
async function allEvents() {
  return SocialEvent.findAll({ order: [['date', 'ASC'], ['priority', 'DESC']] });
}

// Titles already used in the last N days, so regeneration avoids repetition.
async function recentTitles(days = 30) {
  const since = new Date(Date.now() - days * 86400000);
  const rows = await SocialPost.findAll({ attributes: ['titleEn', 'topicKey', 'postDate'], limit: 400, order: [['id', 'DESC']] });
  const set = new Set();
  for (const r of rows) if (r.titleEn) set.add(r.titleEn);
  return set;
}

// Topic keys already used in the last N days. The single daily post must never
// repeat one of these, so each day is genuinely new content.
async function recentTopicKeys(days = 60) {
  const since = new Date(Date.now() - days * 86400000);
  const pad = (n) => String(n).padStart(2, '0');
  const sinceStr = `${since.getFullYear()}-${pad(since.getMonth() + 1)}-${pad(since.getDate())}`;
  const rows = await SocialPost.findAll({ where: { postDate: { [Op.gte]: sinceStr } }, attributes: ['topicKey'] });
  const set = new Set();
  for (const r of rows) if (r.topicKey) set.add(r.topicKey);
  return set;
}

// How many recent days of topic keys are treated as "already used". With one
// post a day this keeps roughly a two-month no-repeat window (the library is
// finite, so eventually a topic is reused — that is intended).
const RECENT_TOPIC_DAYS = 60;

// The daily post time (local HH:MM). There is ONE post per day; it is created
// and published at this time. Kept as a single value so there is no morning/
// evening slot to get out of step.
async function dailyTime() {
  const cfg = await getConfig('dailyTime', null);
  if (cfg) return String(cfg);
  const t = await getConfig('times', { morning: '08:00', evening: '18:00' });
  return (t && t.morning) || '08:00';
}

/**
 * Pick the plan for the day:
 *  - if verified events exist, the post IS the top event (a date-sensitive
 *    greeting published on the correct local day);
 *  - otherwise a rotating library awareness post, chosen so its topic has not
 *    been used in the recent window (no repeats).
 */
async function chooseDailyPlan(date, usedKeys) {
  const dateStr = ymd(date);
  const events = await eventsForDate(dateStr);
  // Prefer the highest-priority event whose greeting has not already been used
  // recently (a multi-day festival seeded as one row is greeted once, not daily).
  for (const ev of events) {
    if (!usedKeys || !usedKeys.has(`evt-${ev.key}`)) return { plan: planEventPost(ev, 'daily', date), eventId: ev.id };
  }
  return { plan: planLibraryPost(date, 'daily', usedKeys), eventId: null };
}
function ymd(d) { const pad = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

// ---- daily awareness series (Samvidhan / Yojana / Charak / GK / English …) --
// One chapter per series per day, each in its own slot. Fully additive: a series
// that is disabled in config (`seriesEnabled`) or has finished is simply skipped,
// and nothing here changes the awareness/festival or course streams.
async function seriesTimes() {
  const cfg = await getConfig('seriesTimes', null);
  return (cfg && typeof cfg === 'object') ? cfg : DEFAULT_SERIES_TIMES;
}
async function seriesEnabled() {
  const cfg = await getConfig('seriesEnabled', null);
  // No explicit config -> the safe 3-on default (see series.js). An explicit
  // object from config always wins, so the admin stays in full control.
  return (cfg && typeof cfg === 'object') ? cfg : { ...DEFAULT_SERIES_ENABLED };
}

async function planAwarenessSeries(date) {
  const times = await seriesTimes();
  const enabled = await seriesEnabled();
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const postDate = ymd(day);
  const created = [];
  let seq = Number((await getConfig('post_seq', 0)) || 0);

  for (const series of SERIES) {
    const slot = `series-${series.key}`;
    // Idempotent per (day, series): if today's chapter already exists (draft OR
    // published), never create a second one — repeated ticks must not flood the
    // channels. A disabled series (config `seriesEnabled[key] === false`) is skipped.
    if (enabled[series.key] === false) continue;
    const already = await SocialPost.findOne({ where: { postDate, slot } });
    if (already) continue;
    const total = (series.items || []).length;
    const prog = await SocialSeriesProgress.findOne({ where: { seriesKey: series.key } });
    const lastChapter = prog ? Number(prog.lastChapter || 0) : 0;
    if (lastChapter >= total) continue; // series finished — nothing left
    const chapterNo = lastChapter + 1;
    const plan = buildSeriesPost(series, chapterNo, day, slot);
    const enriched = { ...plan, contentHash: contentHash(plan) };
    const { row, extra } = splitPlan(enriched);
    seq += 1;
    const row2 = await SocialPost.create({
      ...row, data: extra, postRef: nextRef(seq), status: 'draft',
      scheduledFor: slotDate(postDate, series.key, times),
      createdBy: 'scheduler', createdByName: 'Series Scheduler',
    });
    created.push(row2);
  }
  await setConfig('post_seq', seq);
  return created;
}

// ---- daily course series --------------------------------------------------
// One chapter per course per day = five posts a day, each in its own slot. The
// chapter released is always lastChapter + 1 (never skips, never repeats), and
// `courseTimes` (config key `courseTimes`) sets the slot clock. Set the config
// to [] to pause the series without touching the awareness/festival posts.
async function courseTimes() {
  const cfg = await getConfig('courseTimes', null);
  if (Array.isArray(cfg)) return cfg;
  return COURSE_TIMES;
}

async function planCourseSeries(date) {
  const times = await courseTimes();
  if (!times.length) return [];
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const postDate = ymd(day);
  const created = [];
  let seq = Number((await getConfig('post_seq', 0)) || 0);

  for (let i = 0; i < COURSES.length && i < times.length; i += 1) {
    const course = COURSES[i];
    const slot = `course-${course.key}`;
    const total = course.chapters.length;
    // Idempotent per (day, course): if today's post for this course already
    // exists (draft OR published), never create a second one. Without this a
    // 5-minute tick would mint a fresh chapter draft every time and publish it
    // (the chapter pointer only advances on publish), flooding the channels.
    const already = await SocialPost.findOne({ where: { postDate, slot } });
    if (already) continue;
    const prog = await SocialCourseProgress.findOne({ where: { courseKey: course.key } });
    const lastChapter = prog ? Number(prog.lastChapter || 0) : 0;
    if (lastChapter >= total) continue; // course finished — nothing left to post
    const chapterNo = lastChapter + 1;
    const next = chapterNo < total
      ? { no: chapterNo + 1, title: course.chapters[chapterNo].title }
      : null;
    const plan = planCoursePost(course.key, chapterNo, day, slot, next);
    const enriched = { ...plan, contentHash: contentHash(plan) };
    const { row, extra } = splitPlan(enriched);
    seq += 1;
    const row2 = await SocialPost.create({
      ...row, data: extra, postRef: nextRef(seq), status: 'draft',
      scheduledFor: slotDate(postDate, i, times),
      createdBy: 'scheduler', createdByName: 'Course Scheduler',
    });
    created.push(row2);
  }
  await setConfig('post_seq', seq);
  return created;
}

// Advance a course's pointer once its chapter has actually been published.
async function advanceCourseProgress(post) {
  const data = post.data || {};
  if (!data.courseKey || !data.chapterNo) return;
  let prog = await SocialCourseProgress.findOne({ where: { courseKey: data.courseKey } });
  if (!prog) {
    try {
      prog = await SocialCourseProgress.create({ courseKey: data.courseKey, lastChapter: 0 });
    } catch {
      prog = await SocialCourseProgress.findOne({ where: { courseKey: data.courseKey } });
    }
  }
  if (prog && Number(data.chapterNo) > Number(prog.lastChapter || 0)) {
    const total = Number(data.chapterTotal || 0);
    await prog.update({
      lastChapter: Number(data.chapterNo),
      lastPostDate: post.postDate,
      completedAt: total && Number(data.chapterNo) >= total ? new Date() : prog.completedAt,
    });
  }
}

// Ensure today's single post exists. Returns the list of created rows.
async function planDue({ date = new Date(), rebuild = false } = {}) {
  // The daily awareness/festival post is a separate stream from the course
  // series. It can be switched off (config `daily_awareness` = false) so the
  // day carries exactly the five course chapters, without touching any code.
  if ((await getConfig('daily_awareness', true)) === false) return [];
  const tz = await timezone();
  const { y, m, d } = localParts(date, tz);
  const day = new Date(y, m - 1, d); // local calendar day (date strings only)
  const postDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const created = [];
  let seq = Number((await getConfig('post_seq', 0)) || 0);

  // Any existing NON-additive post for the date (whatever slot it was created
  // under — e.g. the legacy morning/evening rows) is treated as "the day's
  // awareness post", so the switch to one-post-a-day never adds a duplicate on
  // the transition day. The course and awareness series are separate, additive
  // streams (their own plan functions), so they must not be mistaken for the
  // day's daily post — otherwise their presence suppresses it entirely.
  const existing = await SocialPost.findOne({ where: { postDate, kind: { [Op.notIn]: ['course', 'series'] } } });
  // Never overwrite a published post during regeneration — that would turn a
  // live post back into a draft. Only drafts are rebuilt.
  if (existing && (!rebuild || existing.status === 'published' || existing.status === 'partial')) return created;

  // Topic keys already used in the recent window, so the daily post never
  // repeats a recent topic and regeneration cannot duplicate today's.
  const used = new Set();
  for (const r of await recentTopicKeys(RECENT_TOPIC_DAYS)) used.add(r);

  const { plan, eventId } = await chooseDailyPlan(day, used);
  const enriched = { ...plan, ...(eventId ? { eventId } : {}), contentHash: contentHash(plan) };
  const { row, extra } = splitPlan(enriched);
  seq += 1;
  const times = { daily: await dailyTime() };
  if (existing && rebuild) {
    await existing.update({ ...row, data: { ...(existing.data || {}), ...extra }, status: 'draft', platformResults: [] });
    created.push(existing);
  } else {
    const row2 = await SocialPost.create({
      ...row, data: extra, postRef: nextRef(seq), status: 'draft',
      // Preserve the intended post time, not the moment generation ran.
      scheduledFor: slotDate(postDate, 'daily', times),
      createdBy: 'scheduler', createdByName: 'Social Scheduler',
    });
    created.push(row2);
  }
  await setConfig('post_seq', seq);
  return created;
}

// Intended scheduled timestamp for a slot: the local date + configured HH:MM.
// `slot` may be a key into an object of times, or an index into an array.
function slotDate(postDate, slot, times) {
  const t = Array.isArray(times) ? times[slot] : (times || {})[slot];
  const [hh, mm] = String(t || '00:00').split(':');
  const dt = new Date(`${postDate}T${String(hh).padStart(2, '0')}:${String(mm || '00').padStart(2, '0')}:00`);
  return dt;
}

// Create one extra, on-demand post (admin "Post now") from the library.
async function planExtra({ date = new Date(), slot = 'extra' } = {}) {
  const tz = await timezone();
  const { y, m, d } = localParts(date, tz);
  const day = new Date(y, m - 1, d);
  const plan = planLibraryPost(day, slot);
  const enriched = { ...plan, contentHash: contentHash(plan) };
  const { row, extra } = splitPlan(enriched);
  const seq = Number((await getConfig('post_seq', 0)) || 0) + 1;
  await setConfig('post_seq', seq);
  const postDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  return SocialPost.create({ ...row, data: extra, postDate, status: 'draft', scheduledFor: new Date(), createdBy: 'manual', createdByName: 'Admin' });
}

async function enabledPlatforms() {
  const rows = await SocialChannel.findAll();
  const enabled = rows.filter((r) => r.enabled).map((r) => r.platform);
  // The website is always on; every other platform only if connected + enabled.
  const list = ['website', ...enabled.filter((p) => p !== 'website')];
  return list.length ? list : ['website'];
}

// Authentication / permission failures are permanent — retrying only wastes
// time and risks lockouts. Transient errors (network, 5xx, rate limit) retry.
function isPermanentError(err) {
  const m = String(err || '').toLowerCase();
  return /401|403|unauthorized|forbidden|invalid oauth|invalid access token|session has expired|permission|access token|not_connected|credentials missing/.test(m);
}

async function callAdapter(adapter, post, creds) {
  const backoffs = [0, 1500, 5000]; // bounded retry, then give up and report
  let lastErr = null;
  for (let i = 0; i < backoffs.length; i += 1) {
    if (backoffs[i]) await new Promise((res) => setTimeout(res, backoffs[i]));
    try {
      const out = await adapter(post, creds);
      // A returned {ok:false, error} is a real failure; only retry transient ones.
      if (out && out.ok === false && !isPermanentError(out.error)) { lastErr = out.error; continue; }
      return out;
    } catch (e) {
      lastErr = e.message;
      if (isPermanentError(e.message)) break;
    }
  }
  return { ok: false, error: lastErr || 'publish_failed' };
}

// Publish one post across the requested platforms and store results.
async function publishPost(post, platforms) {
  const rows = await SocialChannel.findAll();
  const credsBy = {};
  for (const r of rows) credsBy[r.platform] = r.credentials || {};

  const prevStatus = post.status;
  const results = [];
  for (const platform of platforms) {
    const adapter = ADAPTERS[platform];
    if (!adapter) { results.push({ platform, ok: false, error: 'unknown_platform' }); continue; }
    const out = await callAdapter(adapter, post, credsBy[platform] || {});
    results.push({ platform, ...out });
  }
  const real = results.filter((r) => r.platform !== 'website');
  const anyOk = results.some((r) => r.ok);
  const status = !anyOk ? 'failed' : real.every((r) => r.ok) ? 'published' : 'partial';
  await post.update({ platformResults: results, status, publishedAt: anyOk ? new Date() : post.publishedAt });

  // A course chapter that actually went out advances the series pointer, so
  // tomorrow's post is the next chapter (never a repeat, never a skip).
  if (anyOk && post.kind === 'course') await advanceCourseProgress(post).catch(() => {});
  // The same for an awareness series (Samvidhan / Yojana / …).
  if (anyOk && post.kind === 'series') await advanceSeriesProgress({ SocialSeriesProgress }, post).catch(() => {});

  // Stamp channels for the admin "last published" indicator.
  for (const r of results) {
    const ch = rows.find((x) => x.platform === r.platform);
    if (!ch) continue;
    await ch.update({ lastPublishedAt: r.ok ? new Date() : ch.lastPublishedAt, lastError: r.ok ? null : r.error });
  }
  return { post: post.toJSON(), results, status, prevStatus };
}

// Publish drafts whose time has come. With `force`, publish today's drafts too.
// Each run is recorded so the dashboard can show a real heartbeat and a failed
// run is visible rather than silently green.
async function runPendingInner({ force = false, date = new Date(), source = 'internal-timer' } = {}) {
  const startedAt = new Date();
  const log = await SocialRunLog.create({ startedAt, source, ok: true });
  try {
    const tz = await timezone();
    await planDue({ date });
    await planCourseSeries(date);
    await planAwarenessSeries(date);
    const autoApprove = await getConfig('auto_approve', POWER_AUTOMATE);
    const { y, m, d } = localParts(date, tz);
    const postDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hhmm = localParts(new Date(), tz).hhmm;
    const time = await dailyTime();
    const cTimes = await courseTimes();
    const sTimes = await seriesTimes();

    // The single daily awareness post publishes as soon as it is created.
    // force = publish now regardless; autoApprove OFF = manual only.
    // Course posts and awareness-series posts are always scheduled (each at its
    // own slot time); force releases any that are still pending.
    const drafts = await SocialPost.findAll({ where: { postDate, status: 'draft' }, order: [['id', 'ASC']] });
    const platforms = await enabledPlatforms();
    const published = [];
    for (const p of drafts) {
      let due;
      if (p.kind === 'course') {
        const idx = Math.max(0, COURSES.findIndex((c) => c.key === p.data?.courseKey));
        const at = String(cTimes[idx] || '23:59');
        due = force || hhmm >= at;
      } else if (p.kind === 'series') {
        const key = p.data?.seriesKey;
        const at = String((sTimes && sTimes[key]) || '23:59');
        due = force || hhmm >= at;
      } else {
        due = force || (autoApprove && hhmm >= time);
      }
      if (!due) continue;
      published.push(await publishPost(p, platforms));
    }
    const failed = published.filter((x) => x.status === 'failed').length;
    await log.update({ finishedAt: new Date(), ok: failed === 0, published: published.length, detail: { postDate, hhmm, time, courseTimes: cTimes, platforms, publishedCount: published.length, failed } });
    return { postDate, hhmm, tz, platforms, published };
  } catch (e) {
    await log.update({ finishedAt: new Date(), ok: false, error: e.message });
    throw e;
  }
}

// Serialize runPending so the hourly GitHub cron, the in-process timer and a
// manual "Run now" can never publish the same draft twice at the same instant.
let runChain = Promise.resolve();
function runPending(args) {
  const next = runChain.then(() => runPendingInner(args), () => runPendingInner(args));
  runChain = next.catch(() => {});
  return next;
}

// One-time repair: drop duplicate course posts (an earlier bug minted a fresh
// chapter draft every 5-minute tick) and rebuild each course pointer from the
// surviving published chapters. Idempotent — safe to run again.
async function repairCourseSeries() {
  const rows = await SocialPost.findAll({ where: { kind: 'course' }, order: [['id', 'ASC']] });
  const groups = new Map();
  for (const p of rows) {
    const k = `${p.postDate}|${p.slot}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }
  const keep = new Set();
  const removed = [];
  for (const list of groups.values()) {
    // Keep the earliest chapter for the day (restores the 1-chapter-a-day
    // sequence); drop the flood duplicates.
    const sorted = [...list].sort((a, b) => (Number(a.data?.chapterNo) || 0) - (Number(b.data?.chapterNo) || 0) || a.id - b.id);
    keep.add(sorted[0].id);
    for (const p of sorted.slice(1)) { removed.push(p.postRef || p.id); await p.destroy(); }
  }
  for (const c of COURSES) {
    const mine = rows.filter((p) => keep.has(p.id) && p.data && p.data.courseKey === c.key && p.status === 'published');
    const maxCh = mine.reduce((mx, p) => Math.max(mx, Number(p.data.chapterNo) || 0), 0);
    let prog = await SocialCourseProgress.findOne({ where: { courseKey: c.key } });
    if (!prog) prog = await SocialCourseProgress.create({ courseKey: c.key, lastChapter: 0 });
    await prog.update({ lastChapter: maxCh });
  }
  return { removed: removed.length, removedRefs: removed };
}

module.exports = {
  planDue, planExtra, runPending, publishPost, enabledPlatforms, getConfig, setConfig,
  DEFAULT_PLATFORMS, istParts, localParts, timezone, eventsForDate, allEvents, contentHash,
  DEFAULT_TZ, SocialEvent, SocialRunLog, dailyTime, recentTopicKeys, RECENT_TOPIC_DAYS,
  planCourseSeries, courseTimes, COURSES, COURSE_TIMES, SocialCourseProgress, repairCourseSeries,
  planAwarenessSeries, seriesTimes, seriesEnabled, SERIES, DEFAULT_SERIES_TIMES, SocialSeriesProgress,
};
