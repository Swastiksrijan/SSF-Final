// SSF Social Publisher — HTTP API.
// Admin (token-protected): dashboard, plan, publish, channel connect, settings.
// Public: published posts as JSON + the generated SVG image.
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { SocialChannel, SocialPost, SocialConfig } = require('../models/social');
const content = require('../services/social/content');
const { planDue, planExtra, runPending, publishPost, enabledPlatforms, getConfig, setConfig } = require('../services/social/publisher');
const { postSvg } = require('../services/social/image');

const ADMIN_TOKEN = process.env.ADMIN_PORTAL_TOKEN || 'ssf-admin-portal-token';
const requireAuth = (req, r, next) => {
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

async function dashboard() {
  const [channels, recent, times, autoApprove, seq] = await Promise.all([
    SocialChannel.findAll(),
    SocialPost.findAll({ order: [['postDate', 'DESC'], ['id', 'DESC']], limit: 60 }),
    getConfig('times', { morning: '08:00', evening: '18:00' }),
    getConfig('auto_approve', true),
    getConfig('post_seq', 0),
  ]);
  const byPlatform = {};
  for (const c of channels) byPlatform[c.platform] = c;
  const startups = PLATFORM_META.map((m) => ({
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
  return {
    times, autoApprove, postSeq: seq,
    channels: startups,
    scheduledPerDay: 2,
    stats: { total: all.length, published, partial, draft, failed },
    recent: all.slice(0, 40).map((row) => {
      const p = content.mergePost(row);
      return {
        id: p.id, postRef: p.postRef, postDate: p.postDate, slot: p.slot, status: p.status,
        titleEn: p.titleEn, titleHi: p.titleHi, kind: p.kind, category: p.category, imageUrl: p.imageUrl,
        subtitleEn: p.subtitleEn, subtitleHi: p.subtitleHi,
        exampleEn: p.exampleEn, exampleHi: p.exampleHi,
        takeawayEn: p.takeawayEn, takeawayHi: p.takeawayHi,
        ctaEn: p.ctaEn, ctaHi: p.ctaHi,
        bodyEn: p.bodyEn, bodyHi: p.bodyHi, hashtags: p.hashtags,
        publishedAt: p.publishedAt, results: p.platformResults,
      };
    }),
    calendar: content.AWARENESS_DAYS,
  };
}

// ---- admin -----------------------------------------------------------------
router.get('/social/dashboard', requireAuth, wrap(async (_req, r) => r.json(await dashboard())));
router.get('/social/config', requireAuth, wrap(async (_req, r) => r.json({
  times: await getConfig('times', { morning: '08:00', evening: '18:00' }),
  autoApprove: await getConfig('auto_approve', true),
})));

router.post('/social/config', requireAuth, wrap(async (req, r) => {
  const { times, autoApprove } = req.body || {};
  if (times) await setConfig('times', times);
  if (typeof autoApprove === 'boolean') await setConfig('auto_approve', autoApprove);
  r.json({ ok: true, times: await getConfig('times'), autoApprove: await getConfig('auto_approve') });
}));

// Generate (or rebuild) today's drafts without publishing.
router.post('/social/plan', requireAuth, wrap(async (req, r) => {
  const rebuild = !!(req.body && req.body.rebuild);
  const created = await planDue({ rebuild });
  r.json({ ok: true, created: created.length });
}));

// Publish pending/all drafts now.
router.post('/social/run', requireAuth, wrap(async (req, r) => {
  const force = !!(req.body && (req.body.force || req.body.now));
  r.json({ ok: true, ...(await runPending({ force })) });
}));

// Create + publish one extra post immediately.
router.post('/social/post-now', requireAuth, wrap(async (req, r) => {
  const post = await planExtra({});
  const platforms = await enabledPlatforms();
  const out = await publishPost(post, platforms);
  r.json({ ok: true, ...out });
}));

// Edit a post before publishing.
router.patch('/social/posts/:id', requireAuth, wrap(async (req, r) => {
  const post = await SocialPost.findByPk(req.params.id);
  if (!post) return r.status(404).json({ message: 'Post not found' });
  const columns = ['titleEn', 'titleHi', 'bodyEn', 'bodyHi', 'hashtags', 'imageUrl', 'status'];
  const dataFields = ['headingEn', 'headingHi', 'subtitleEn', 'subtitleHi', 'exampleEn', 'exampleHi',
    'takeawayEn', 'takeawayHi', 'ctaEn', 'ctaHi'];
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
  const { postPng } = require('../services/social/image');
  if (String(req.query.format).toLowerCase() === 'png') {
    const png = await postPng(post);
    if (png) {
      r.set('Content-Type', 'image/png');
      r.set('Cache-Control', 'public, max-age=3600');
      return r.send(png);
    }
  }
  r.set('Content-Type', 'image/svg+xml');
  r.set('Cache-Control', 'public, max-age=3600');
  r.send(postSvg(post));
}));

// Scheduler entry point. Render free sleeps; a GitHub Actions cron hits this.
// Protected by a shared secret (SCHEDULER_SECRET) so it is safe to expose.
router.get('/social/cron', async (req, r) => {
  const secret = process.env.SCHEDULER_SECRET || ADMIN_TOKEN;
  const key = req.query.key || '';
  if (key !== secret) return r.status(401).json({ message: 'Unauthorized' });
  try {
    const force = req.query.force === '1';
    const out = await runPending({ force });
    r.json({ ok: true, ...out });
  } catch (e) { r.status(500).json({ ok: false, message: e.message }); }
});

module.exports = router;
