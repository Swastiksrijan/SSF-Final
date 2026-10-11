// SSF Social Publisher — orchestrator.
// planDue()   : make sure today's morning/evening drafts exist.
// runPending(): publish every draft whose time has arrived (or everything when
//               `force` is set), then record per-channel results.
// Idempotent by (postDate, slot): re-runs never duplicate a post.

const crypto = require('crypto');
const { Op } = require('sequelize');
const { SocialChannel, SocialPost, SocialConfig, SocialEvent, SocialRunLog } = require('../../models/social');
const { planPost, planLibraryPost, planEventPost, splitPlan } = require('./content');
const { ADAPTERS } = require('./channels');

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

/**
 * Pick the plan for a slot on a date:
 *  - if verified events exist, the main post IS the top event (date-sensitive
 *    greeting published on the correct local day);
 *  - otherwise a rotating library awareness post.
 * A second verified event on the same day is kept as an `extra` post by the
 * caller rather than being silently erased.
 */
async function choosePlan(date, slot) {
  const dateStr = ymd(date);
  const events = await eventsForDate(dateStr);
  if (events.length) return { plan: planEventPost(events[0], slot, date), eventId: events[0].id, extraEvents: events.slice(1) };
  return { plan: planLibraryPost(date, slot), eventId: null, extraEvents: [] };
}
function ymd(d) { const pad = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

// Ensure today's two posts exist. Returns the list of created rows.
async function planDue({ date = new Date(), rebuild = false } = {}) {
  const tz = await timezone();
  const { y, m, d } = localParts(date, tz);
  const day = new Date(y, m - 1, d); // local calendar day (date strings only)
  const slots = ['morning', 'evening'];
  const created = [];
  let seq = Number((await getConfig('post_seq', 0)) || 0);

  for (const slot of slots) {
    const postDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const existing = await SocialPost.findOne({ where: { postDate, slot } });
    // Never overwrite a published post during regeneration — that would turn a
    // live post back into a draft. Only drafts are rebuilt.
    if (existing && (!rebuild || existing.status === 'published' || existing.status === 'partial')) continue;
    const { plan, eventId } = await choosePlan(day, slot);
    const enriched = { ...plan, ...(eventId ? { eventId } : {}), contentHash: contentHash(plan) };
    const { row, extra } = splitPlan(enriched);
    seq += 1;
    if (existing && rebuild) {
      await existing.update({ ...row, data: { ...(existing.data || {}), ...extra }, status: 'draft', platformResults: [] });
      created.push(existing);
    } else {
      const row2 = await SocialPost.create({
        ...row, data: extra, postRef: nextRef(seq), status: 'draft',
        // Preserve the intended slot time, not the moment generation ran.
        scheduledFor: slotDate(postDate, slot, await getConfig('times', { morning: '08:00', evening: '18:00' })),
        createdBy: 'scheduler', createdByName: 'Social Scheduler',
      });
      created.push(row2);
    }
  }
  await setConfig('post_seq', seq);
  return created;
}

// Intended scheduled timestamp for a slot: the local date + configured HH:MM.
function slotDate(postDate, slot, times) {
  const [hh, mm] = String((times || {})[slot] || '00:00').split(':');
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
    const times = (await getConfig('times', { morning: '08:00', evening: '18:00' }));
    const autoApprove = await getConfig('auto_approve', POWER_AUTOMATE);
    const { y, m, d } = localParts(date, tz);
    const postDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hhmm = localParts(new Date(), tz).hhmm;

    // Also create extra posts for a SECOND verified event on the same day, so a
    // coinciding festival is not silently erased.
    const events = await eventsForDate(postDate);
    if (events.length > 1) {
      const seen = await SocialPost.findAll({ where: { postDate }, attributes: ['topicKey'] });
      const have = new Set(seen.map((r) => r.topicKey));
      for (const ev of events.slice(1)) {
        const key = `evt-${ev.key}`;
        if (have.has(key)) continue;
        const plan = { ...planEventPost(ev, 'extra', new Date(y, m - 1, d)) };
        const { row, extra } = splitPlan({ ...plan, contentHash: contentHash(plan) });
        const seq = Number((await getConfig('post_seq', 0)) || 0) + 1;
        await setConfig('post_seq', seq);
        await SocialPost.create({ ...row, data: extra, postDate, status: 'draft', slot: 'extra', scheduledFor: slotDate(postDate, 'morning', times), createdBy: 'scheduler', createdByName: 'Social Scheduler' });
      }
    }

    const drafts = await SocialPost.findAll({ where: { postDate, status: 'draft' }, order: [['slot', 'ASC']] });
    const platforms = await enabledPlatforms();
    const published = [];
    for (const p of drafts) {
      // force = publish now; otherwise only auto-publish when the feature is ON
      // and the slot's scheduled time has passed. autoApprove OFF = manual only.
      const due = force || (autoApprove && hhmm >= (times[p.slot] || times.morning || '00:00'));
      if (!due) continue;
      published.push(await publishPost(p, platforms));
    }
    const failed = published.filter((x) => x.status === 'failed').length;
    await log.update({ finishedAt: new Date(), ok: failed === 0, published: published.length, detail: { postDate, hhmm, platforms, publishedCount: published.length, failed } });
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

module.exports = {
  planDue, planExtra, runPending, publishPost, enabledPlatforms, getConfig, setConfig,
  DEFAULT_PLATFORMS, istParts, localParts, timezone, eventsForDate, allEvents, contentHash,
  DEFAULT_TZ, SocialEvent, SocialRunLog,
};
