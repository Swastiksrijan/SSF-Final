// SSF Social Publisher — HTTP API.
// Admin (token-protected): dashboard, plan, publish, channel connect, settings.
// Public: published posts as JSON + the generated SVG image.
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { SocialChannel, SocialPost, SocialConfig, SocialEvent, SocialRunLog } = require('../models/social');
const content = require('../services/social/content');
const {
  planDue, planExtra, runPending, publishPost, enabledPlatforms, getConfig, setConfig,
  allEvents, eventsForDate, timezone, localParts, istParts, DEFAULT_TZ,
} = require('../services/social/publisher');
const { postSvg } = require('../services/social/image');

// Secrets must come from the environment. We no longer fall back to a hard-coded
// token — if ADMIN_PORTAL_TOKEN is missing, admin routes fail closed (503) rather
// than accepting a well-known default. Tokens are never logged.
const ADMIN_TOKEN = process.env.ADMIN_PORTAL_TOKEN || '';
const requireAuth = (req, r, next) => {
  if (!ADMIN_TOKEN) return r.status(503).json({ message: 'Admin token not configured (ADMIN_PORTAL_TOKEN).' });
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token || token !== ADMIN_TOKEN) return r.status(401).json({ message: 'Unauthorized' });
  next();
};
const wrap = (fn) => (req, r) => fn(req, r).catch((e) => r.status(e.status || 500).json({ message: e.message }));

const PLATFORM_META = [
  { platform: 'website', en: 'Website / Blog', hi: 'वेबसाइट / ब्लॉग', always: true, fields: [] },
  { platform: 'facebook', en: 'Facebook Page', hi: 'फेसबुक पेज', fields: ['pageId', 'accessToken'] },
  { platform: 'instagram', en: 'Instagram (Business)', hi: 'इंस्टाग्राम (बिज़नेस)', fields: ['igUserId', 'accessToken'] },
  { platform: 'telegram', en: 'Telegram', hi: 'टेलीग्राम', fields: ['botToken', 'chatId'] },
  { platform: 'linkedin', en: 'LinkedIn', hi: 'लिंक्डइन', fields: ['authorUrn', 'accessToken'] },
  { platform: 'whatsapp', en: 'WhatsApp (Cloud API)', hi: 'व्हाट्सएप (क्लाउड API)', fields: ['phoneNumberId', 'accessToken', 'to'] },
  { platform: 'x', en: 'X (Twitter)', hi: 'एक्स (ट्विटर)', fields: ['consumerKey', 'consumerSecret', 'accessToken', 'accessTokenSecret'] },
  { platform: 'youtube', en: 'YouTube', hi: 'यूट्यूब', fields: ['accessToken'] },
];

const last = (arr) => (arr.length ? arr[arr.length - 1] : null);

// Shared shape for a post row returned to the dashboard / public feed.
function postView(row) {
  const p = content.mergePost(row);
  return {
    id: p.id, postRef: p.postRef, postDate: p.postDate, slot: p.slot, status: p.status,
    titleEn: p.titleEn, titleHi: p.titleHi, kind: p.kind, category: p.category, imageUrl: p.imageUrl,
    subtitleEn: p.subtitleEn, subtitleHi: p.subtitleHi,
    exampleEn: p.exampleEn, exampleHi: p.exampleHi,
    takeawayEn: p.takeawayEn, takeawayHi: p.takeawayHi,
    ctaEn: p.ctaEn, ctaHi: p.ctaHi,
    bodyEn: p.bodyEn, bodyHi: p.bodyHi, hashtags: p.hashtags,
    contentSource: p.contentSource, contentVerified: p.contentVerified,
    tradition: p.tradition, solemn: p.solemn, palette: p.palette,
    scheduledFor: p.scheduledFor, publishedAt: p.publishedAt, results: p.platformResults,
  };
}

function dayView(e) {
  return {
    id: e.id, key: e.key, date: e.date, month: e.month, day: e.day,
    titleEn: e.titleEn, titleHi: e.titleHi, altNames: e.altNames,
    tradition: e.tradition, region: e.region, calendarSystem: e.calendarSystem, eventType: e.eventType,
    greetingEn: e.greetingEn, greetingHi: e.greetingHi,
    significanceEn: e.significanceEn, significanceHi: e.significanceHi,
    palette: e.palette, solemn: e.solemn, source: e.source,
    verified: e.verified, uncertain: e.uncertain, status: e.status, priority: e.priority, notes: e.notes,
  };
}

async function dashboard() {
  const tz = await timezone();
  const local = localParts(new Date(), tz);
  const today = `${local.y}-${String(local.m).padStart(2, '0')}-${String(local.d).padStart(2, '0')}`;
  const [channels, recent, times, autoApprove, seq, events, runs] = await Promise.all([
    SocialChannel.findAll(),
    SocialPost.findAll({ order: [['postDate', 'DESC'], ['id', 'DESC']], limit: 120 }),
    getConfig('times', { morning: '08:00', evening: '18:00' }),
    getConfig('auto_approve', true),
    getConfig('post_seq', 0),
    allEvents(),
    SocialRunLog.findAll({ order: [['id', 'DESC']], limit: 20 }),
  ]);
  const byPlatform = {};
  for (const c of channels) byPlatform[c.platform] = c;
  const startupChannels = PLATFORM_META.map((m) => ({
    ...m,
    enabled: m.always ? true : !!(byPlatform[m.platform] && byPlatform[m.platform].enabled),
    status: m.always ? 'connected' : (byPlatform[m.platform] ? byPlatform[m.platform].status : 'not_connected'),
    lastPublishedAt: byPlatform[m.platform] ? byPlatform[m.platform].lastPublishedAt : null,
    lastError: byPlatform[m.platform] ? byPlatform[m.platform].lastError : null,
    configured: m.always ? true : !!(byPlatform[m.platform] && byPlatform[m.platform].credentials && Object.keys(byPlatform[m.platform].credentials).length),
  }));

  const all = recent;
  const published = all.filter((p) => p.status === 'published').length;
  const partial = all.filter((p) => p.status === 'partial').length;
  const draft = all.filter((p) => p.status === 'draft').length;
  const failed = all.filter((p) => p.status === 'failed').length;

  // Today's slots, events and the next seven days of the calendar.
  const todaysPosts = all.filter((p) => p.postDate === today).map(postView);
  const todayEvents = eventsForDate(today).map(dayView);
  const uncertainEvents = events.filter((e) => e.uncertain && e.status === 'active');
  const horizon = new Date(local.y, local.m - 1, local.d + 7);
  const upcoming = events.filter((e) => e.status === 'active' && e.date && e.date >= today && e.date <= `${horizon.getFullYear()}-${String(horizon.getMonth() + 1).padStart(2, '0')}-${String(horizon.getDate()).padStart(2, '0')}`).map(dayView);

  // Scheduler heartbeat: the most recent run and the last successful one.
  const lastRun = runs[0] || null;
  const lastOk = runs.find((x) => x.ok) || null;
  const heartbeat = {
    lastRunAt: lastRun ? lastRun.startedAt : null,
    lastRunOk: lastRun ? !!lastRun.ok : null,
    lastRunError: lastRun ? lastRun.error : null,
    lastRunSource: lastRun ? lastRun.source : null,
    lastSuccessAt: lastOk ? lastOk.startedAt : null,
    lastSuccessPublished: lastOk ? lastOk.published : null,
    runsLast24h: runs.filter((x) => new Date(x.startedAt) > new Date(Date.now() - 86400000)).length,
    failing: lastRun ? !lastRun.ok : false,
  };

  // Next scheduled slot time (local).
  const slots = ['morning', 'evening'];
  let nextAt = null;
  for (const s of slots) {
    if (local.hhmm < times[s]) { nextAt = `${today}T${times[s]}`; break; }
  }
  if (!nextAt) { const nd = new Date(local.y, local.m - 1, local.d + 1); nextAt = `${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}T${times.morning || '08:00'}`; }

  // Content freshness: a warning when recent posts reuse the same topic.
  const topicCounts = {};
  for (const p of all.slice(0, 14)) if (p.topicKey) topicCounts[p.topicKey] = (topicCounts[p.topicKey] || 0) + 1;
  const repeats = Object.entries(topicCounts).filter(([, n]) => n > 1).map(([k, n]) => ({ topicKey: k, count: n }));

  const failedPosts = all.filter((p) => p.status === 'failed' || p.status === 'partial').slice(0, 10).map((row) => {
    const p = postView(row);
    return { ...p, failures: (p.results || []).filter((x) => !x.ok) };
  });

  return {
    times, autoApprove, postSeq: seq, timezone: tz,
    today, todayLocalTime: local.hhmm, nextScheduledAt: nextAt,
    channels: startupChannels,
    scheduledPerDay: 2,
    stats: { total: all.length, published, partial, draft, failed },
    heartbeat,
    todayPosts: todaysPosts,
    todayEvents,
    upcomingSevenDays: upcoming,
    draftsAwaitingApproval: all.filter((p) => p.status === 'draft').slice(0, 20).map(postView),
    failedPosts,
    freshness: { repeats, warning: repeats.length > 0 },
    calendarWarnings: {
      uncertainCount: uncertainEvents.length,
      uncertain: uncertainEvents.slice(0, 20).map(dayView),
      sources: ['UN observances', 'India festival calendars (drikpanchang / timeanddate)', 'Hijri (moon-sighting, flagged uncertain)'],
    },
    recent: all.slice(0, 60).map(postView),
    calendar: events.map(dayView),
    topics: content.TOPIC_ORDER.map((k) => ({ key: k, label: content.TOPIC_LABELS[k] })),
  };
}

// ---- admin -----------------------------------------------------------------
router.get('/social/dashboard', requireAuth, wrap(async (_req, r) => r.json(await dashboard())));
router.get('/social/config', requireAuth, wrap(async (_req, r) => r.json({
  times: await getConfig('times', { morning: '08:00', evening: '18:00' }),
  autoApprove: await getConfig('auto_approve', true),
})));

router.post('/social/config', requireAuth, wrap(async (req, r) => {
  const { times, autoApprove, timezone: tz } = req.body || {};
  if (times) await setConfig('times', times);
  if (typeof autoApprove === 'boolean') await setConfig('auto_approve', autoApprove);
  if (tz) {
    try { new Intl.DateTimeFormat('en-GB', { timeZone: String(tz) }).format(new Date()); } catch { return r.status(400).json({ ok: false, message: 'Invalid IANA timezone.' }); }
    await setConfig('timezone', String(tz));
  }
  r.json({ ok: true, times: await getConfig('times'), autoApprove: await getConfig('auto_approve'), timezone: await getConfig('timezone', DEFAULT_TZ) });
}));

// ---- automation controls (distinct verbs, never conflated) -----------------
// Generate content: create/rebuild today's DRAFTS (never publishes).
router.post('/social/plan', requireAuth, wrap(async (req, r) => {
  const rebuild = !!(req.body && req.body.rebuild);
  const created = await planDue({ rebuild });
  r.json({ ok: true, created: created.length });
}));

// Run scheduler: publish only drafts whose slot time has arrived.
router.post('/social/run', requireAuth, wrap(async (req, r) => {
  const force = !!(req.body && (req.body.force || req.body.now));
  const source = force ? 'manual-force' : 'manual-run';
  r.json({ ok: true, ...(await runPending({ force, source })) });
}));

// Pause / resume automation (auto_approve gate).
router.post('/social/pause', requireAuth, wrap(async (_req, r) => {
  await setConfig('auto_approve', false);
  r.json({ ok: true, autoApprove: false });
}));
router.post('/social/resume', requireAuth, wrap(async (_req, r) => {
  await setConfig('auto_approve', true);
  r.json({ ok: true, autoApprove: true });
}));

// Create one extra DRAFT from the library (does NOT publish).
router.post('/social/post-now', requireAuth, wrap(async (req, r) => {
  const post = await planExtra({});
  if (req.body && req.body.publish) {
    const platforms = await enabledPlatforms();
    const out = await publishPost(post, platforms);
    return r.json({ ok: true, ...out });
  }
  r.json({ ok: true, post: postView(post) });
}));

// Preview a post for a date/slot WITHOUT saving (so the admin can eyeball it).
router.get('/social/preview', requireAuth, wrap(async (req, r) => {
  const [y, m, d] = String(req.query.date || new Date().toISOString().slice(0, 10)).split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const slot = String(req.query.slot || 'morning');
  const events = await eventsForDate(String(req.query.date || ''));
  const plan = events.length ? content.planEventPost(events[0], slot, date) : content.planLibraryPost(date, slot);
  const view = postView({ ...plan, data: {} });
  view.preview = true;
  view.event = events.length ? dayView(events[0]) : null;
  r.json({ ok: true, post: view });
}));

// ---- calendar CRUD (admin-editable, no code change needed) -----------------
router.get('/social/events', requireAuth, wrap(async (_req, r) => r.json({ events: (await allEvents()).map(dayView) })));

router.post('/social/events', requireAuth, wrap(async (req, r) => {
  const b = req.body || {};
  if (!b.titleEn || !b.date) return r.status(400).json({ message: 'titleEn and date are required' });
  const key = b.key || `evt-${String(b.date).replace(/-/g, '')}-${String(b.titleEn).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;
  const [row] = await SocialEvent.findOrCreate({ where: { key }, defaults: { key } });
  await row.update({
    date: b.date, titleEn: b.titleEn, titleHi: b.titleHi || b.titleEn,
    altNames: b.altNames || null, tradition: b.tradition || 'other', region: b.region || 'India',
    calendarSystem: b.calendarSystem || 'gregorian', eventType: b.eventType || 'observance',
    greetingEn: b.greetingEn || null, greetingHi: b.greetingHi || null,
    significanceEn: b.significanceEn || null, significanceHi: b.significanceHi || null,
    palette: b.palette || null, solemn: !!b.solemn, source: b.source || 'admin', 
    verified: b.verified !== false, uncertain: !!b.uncertain, status: b.status || 'active',
    priority: Number(b.priority || 0), notes: b.notes || null,
  });
  r.json({ ok: true, event: dayView(row) });
}));

router.patch('/social/events/:id', requireAuth, wrap(async (req, r) => {
  const row = await SocialEvent.findByPk(req.params.id);
  if (!row) return r.status(404).json({ message: 'Event not found' });
  const patch = {};
  for (const k of ['date', 'titleEn', 'titleHi', 'altNames', 'tradition', 'region', 'calendarSystem', 'eventType', 'greetingEn', 'greetingHi', 'significanceEn', 'significanceHi', 'palette', 'source', 'status', 'notes']) {
    if (req.body && req.body[k] != null) patch[k] = req.body[k];
  }
  for (const k of ['solemn', 'verified', 'uncertain']) if (req.body && req.body[k] != null) patch[k] = !!req.body[k];
  if (req.body && req.body.priority != null) patch.priority = Number(req.body.priority);
  await row.update(patch);
  r.json({ ok: true, event: dayView(row) });
}));

router.delete('/social/events/:id', requireAuth, wrap(async (req, r) => {
  const row = await SocialEvent.findByPk(req.params.id);
  if (row) await row.update({ status: 'excluded' }); // soft-exclude, keep history
  r.json({ ok: true });
}));

// Edit a post before publishing.
router.patch('/social/posts/:id', requireAuth, wrap(async (req, r) => {
  const post = await SocialPost.findByPk(req.params.id);
  if (!post) return r.status(404).json({ message: 'Post not found' });
  const columns = ['titleEn', 'titleHi', 'bodyEn', 'bodyHi', 'hashtags', 'imageUrl', 'status'];
  const dataFields = ['headingEn', 'headingHi', 'subtitleEn', 'subtitleHi', 'exampleEn', 'exampleHi',
    'takeawayEn', 'takeawayHi', 'ctaEn', 'ctaHi', 'contentSource', 'tradition', 'palette'];
  const patch = {};
  const dataPatch = { ...(post.data || {}) };
  for (const k of columns) if (req.body && req.body[k] != null) patch[k] = req.body[k];
  for (const k of dataFields) if (req.body && req.body[k] != null) dataPatch[k] = req.body[k];
  patch.data = dataPatch;
  await post.update(patch);
  r.json({ ok: true, post: content.mergePost(post) });
}));

// Publish one specific post.
router.post('/social/posts/:id/publish', requireAuth, wrap(async (req, r) => {
  const post = await SocialPost.findByPk(req.params.id);
  if (!post) return r.status(404).json({ message: 'Post not found' });
  const platforms = await enabledPlatforms();
  r.json({ ok: true, ...(await publishPost(post, platforms)) });
}));

// Connect / update a channel. Accepts only the fields that platform expects.
router.post('/social/channels/:platform', requireAuth, wrap(async (req, r) => {
  const meta = PLATFORM_META.find((m) => m.platform === req.params.platform);
  if (!meta) return r.status(404).json({ message: 'Unknown platform' });
  const creds = {};
  for (const f of meta.fields) if (req.body && req.body[f]) creds[f] = String(req.body[f]).trim();
  const enabled = req.body && req.body.enabled != null ? !!req.body.enabled : Object.keys(creds).length > 0;
  const [row] = await SocialChannel.findOrCreate({ where: { platform: meta.platform }, defaults: { platform: meta.platform } });
  const merged = { ...(row.credentials || {}), ...creds };
  await row.update({
    credentials: merged,
    enabled: meta.always ? true : enabled,
    status: meta.always ? 'connected' : (Object.keys(merged).length ? 'connected' : 'not_connected'),
    lastError: null,
  });
  r.json({ ok: true, platform: meta.platform, status: row.status, enabled: row.enabled, fields: Object.keys(merged) });
}));

router.delete('/social/channels/:platform', requireAuth, wrap(async (req, r) => {
  const row = await SocialChannel.findOne({ where: { platform: req.params.platform } });
  if (row) await row.update({ enabled: false, status: 'not_connected', credentials: {} });
  r.json({ ok: true });
}));

// Exchange a short-lived Facebook user token for a NON-EXPIRING Page token.
// Admin pastes App ID + App Secret + a short-lived token once; we save the
// resulting Page token so scheduled posts keep working instead of 401-ing later.
router.post('/social/facebook/exchange', requireAuth, wrap(async (req, r) => {
  const { appId, appSecret, shortToken, pageId } = req.body || {};
  const { exchangeFacebookToken } = require('../services/social/channels');
  const out = await exchangeFacebookToken({ appId, appSecret, shortToken });
  if (!out.ok) return r.status(400).json(out);
  // Prefer the page the admin named; otherwise the first Page the token manages.
  const chosen = (pageId && out.pages.find((p) => String(p.id) === String(pageId))) || out.pages[0];
  const [row] = await SocialChannel.findOrCreate({ where: { platform: 'facebook' }, defaults: { platform: 'facebook' } });
  await row.update({
    enabled: true, status: 'connected',
    credentials: { pageId: chosen.id, accessToken: chosen.accessToken },
    lastError: null,
  });
  return r.json({ ok: true, pageId: chosen.id, pageName: chosen.name, expiresAt: out.expiresAt || 0, pages: out.pages.map((p) => ({ id: p.id, name: p.name })) });
}));

// Instagram: fill igUserId automatically from the linked Facebook Page, so the
// admin never has to hunt for the numeric id. Reuses the saved Facebook token
// (or one pasted in the form).
router.post('/social/instagram/resolve', requireAuth, wrap(async (req, r) => {
  const { resolveInstagramAccount } = require('../services/social/channels');
  const fbRow = await SocialChannel.findOne({ where: { platform: 'facebook' } });
  const fbCreds = (fbRow && fbRow.credentials) || {};
  const pageId = (req.body && req.body.pageId) || fbCreds.pageId;
  const accessToken = (req.body && req.body.accessToken) || fbCreds.accessToken;
  const out = await resolveInstagramAccount({ pageId, accessToken });
  if (!out.ok) return r.status(400).json(out);
  const [row] = await SocialChannel.findOrCreate({ where: { platform: 'instagram' }, defaults: { platform: 'instagram' } });
  const merged = { ...(row.credentials || {}), igUserId: out.igUserId, accessToken };
  await row.update({ credentials: merged, enabled: true, status: 'connected', lastError: null });
  return r.json({ ok: true, igUserId: out.igUserId, username: out.username, fields: Object.keys(merged) });
}));

// Send a live test message using the SAVED credentials (no publish needed).
router.post('/social/channels/:platform/test', requireAuth, wrap(async (req, r) => {
  const row = await SocialChannel.findOne({ where: { platform: req.params.platform } });
  if (!row || !row.credentials || !Object.keys(row.credentials).length) {
    return r.status(400).json({ ok: false, error: 'not_connected', message: 'Connect the channel first.' });
  }
  const { testChannel } = require('../services/social/channels');
  const out = await testChannel(req.params.platform, row.credentials);
  await row.update({ lastError: out.ok ? null : (out.error || 'test failed') });
  r.json(out);
}));

// ---- public ----------------------------------------------------------------
router.get('/social/posts', wrap(async (req, r) => {
  const limit = Math.min(Number(req.query.limit || 20), 50);
  const rows = await SocialPost.findAll({ where: { status: { [Op.in]: ['published', 'partial'] } }, order: [['publishedAt', 'DESC']], limit });
  r.json({ posts: rows.map((row) => { const p = content.mergePost(row); return {
    id: p.id, ref: p.postRef, date: p.postDate, slot: p.slot, category: p.category, kind: p.kind,
    titleEn: p.titleEn, titleHi: p.titleHi, bodyEn: p.bodyEn, bodyHi: p.bodyHi, hashtags: p.hashtags,
    subtitleEn: p.subtitleEn, subtitleHi: p.subtitleHi, exampleEn: p.exampleEn, exampleHi: p.exampleHi,
    takeawayEn: p.takeawayEn, takeawayHi: p.takeawayHi, ctaEn: p.ctaEn, ctaHi: p.ctaHi,
    contentSource: p.contentSource, tradition: p.tradition, solemn: p.solemn,
    image: p.imageUrl, publishedAt: p.publishedAt,
  }; }) });
}));

// Generated SVG image for a date/slot (or a saved post id).
router.get('/social/image/daily', wrap(async (req, r) => {
  let post = null;
  if (req.query.postId) {
    const row = await SocialPost.findByPk(req.query.postId);
    if (row) post = row.toJSON();
  }
  if (!post) {
    const date = req.query.date ? new Date(req.query.date + 'T06:00:00') : new Date();
    post = content.planPost(date, req.query.slot || 'morning');
  }
  const { postPng, postJpeg } = require('../services/social/image');
  const fmt = String(req.query.format).toLowerCase();
  if (fmt === 'png' || fmt === 'jpeg' || fmt === 'jpg') {
    const buf = fmt === 'png' ? await postPng(post) : await postJpeg(post);
    if (buf) {
      r.set('Content-Type', fmt === 'png' ? 'image/png' : 'image/jpeg');
      r.set('Cache-Control', 'public, max-age=3600');
      return r.send(buf);
    }
  }
  r.set('Content-Type', 'image/svg+xml');
  r.set('Cache-Control', 'public, max-age=3600');
  r.send(postSvg(post));
}));

// Scheduler entry point. Render free sleeps; a GitHub Actions cron hits this.
// Protected by a shared secret (SCHEDULER_SECRET) so it is safe to expose.
router.get('/social/cron', async (req, r) => {
  // Prefer a dedicated scheduler secret; otherwise require the admin token. No
  // hard-coded default — if neither is configured, refuse (fail safe).
  const secret = process.env.SCHEDULER_SECRET || ADMIN_TOKEN;
  if (!secret) return r.status(503).json({ message: 'Scheduler secret not configured.' });
  const key = req.query.key || '';
  if (key !== secret) return r.status(401).json({ message: 'Unauthorized' });
  try {
    const force = req.query.force === '1';
    const out = await runPending({ force, source: 'github-cron' });
    r.json({ ok: true, ...out });
  } catch (e) { r.status(500).json({ ok: false, message: e.message }); }
});

module.exports = router;
