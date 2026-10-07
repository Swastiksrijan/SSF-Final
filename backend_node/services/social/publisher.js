// SSF Social Publisher — orchestrator.
// planDue()   : make sure today's morning/evening drafts exist.
// runPending(): publish every draft whose time has arrived (or everything when
//               `force` is set), then record per-channel results.
// Idempotent by (postDate, slot): re-runs never duplicate a post.

const { Op } = require('sequelize');
const { SocialChannel, SocialPost, SocialConfig } = require('../../models/social');
const { planPost, splitPlan } = require('./content');
const { ADAPTERS } = require('./channels');

const DEFAULT_PLATFORMS = ['website', 'facebook', 'instagram', 'telegram', 'linkedin', 'whatsapp', 'x', 'youtube'];
const POWER_AUTOMATE = Number(process.env.SOCIAL_AUTO == null ? 1 : process.env.SOCIAL_AUTO) !== 0;

async function getConfig(key, fallback = null) {
  const row = await SocialConfig.findOne({ where: { key } });
  return row ? row.value : fallback;
}
async function setConfig(key, value) {
  const [row] = await SocialConfig.findOrCreate({ where: { key }, defaults: { value } });
  row.value = value; await row.save();
  return value;
}

// Local-time helper: interpret "HH:MM" against Asia/Kolkata.
function istParts(date = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', hour12: false });
  const p = {};
  for (const { type, value } of fmt.formatToParts(date)) p[type] = value;
  return { hhmm: `${p.hour}:${p.minute}`, y: Number(p.year), m: Number(p.month), d: Number(p.day) };
}
function istDateParts(date = new Date()) { return istParts(date); }

function nextRef(seq) {
  const y = istDateParts().y;
  return `SOCIAL-${y}-${String(seq).padStart(4, '0')}`;
}

// Ensure today's two posts exist. Returns the list of created rows.
async function planDue({ date = new Date(), rebuild = false } = {}) {
  const { y, m, d } = istDateParts(date);
  const day = new Date(y, m - 1, d); // local calendar day (date strings only)
  const slots = ['morning', 'evening'];
  const created = [];
  let seq = Number((await getConfig('post_seq', 0)) || 0);

  for (const slot of slots) {
    const postDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const existing = await SocialPost.findOne({ where: { postDate, slot } });
    if (existing && !rebuild) continue;
    const plan = planPost(day, slot);
    const { row, extra } = splitPlan(plan);
    seq += 1;
    if (existing && rebuild) {
      await existing.update({ ...row, data: { ...(existing.data || {}), ...extra }, status: 'draft', platformResults: [] });
      created.push(existing);
    } else {
      const row2 = await SocialPost.create({
        ...row, data: extra, postRef: nextRef(seq), status: 'draft', scheduledFor: new Date(),
        createdBy: 'scheduler', createdByName: 'Social Scheduler',
      });
      created.push(row2);
    }
  }
  await setConfig('post_seq', seq);
  return created;
}

// Create one extra, on-demand post (admin "Post now").
async function planExtra({ date = new Date(), seed = Math.floor(Math.random() * 1000) } = {}) {
  const { y, m, d } = istDateParts(date);
  const day = new Date(y, m - 1, d);
  const plan = planPost(day, 'extra', seed % 14);
  const { row, extra } = splitPlan(plan);
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

// Publish one post across the requested platforms and store results.
async function publishPost(post, platforms) {
  const rows = await SocialChannel.findAll();
  const credsBy = {};
  for (const r of rows) credsBy[r.platform] = r.credentials || {};

  const results = [];
  for (const platform of platforms) {
    const adapter = ADAPTERS[platform];
    if (!adapter) { results.push({ platform, ok: false, error: 'unknown_platform' }); continue; }
    try {
      const out = await adapter(post, credsBy[platform] || {});
      results.push({ platform, ...out });
    } catch (e) {
      results.push({ platform, ok: false, error: e.message });
    }
  }
  const real = results.filter((r) => r.platform !== 'website');
  const anyOk = results.some((r) => r.ok);
  const status = !anyOk ? 'failed' : real.every((r) => r.ok) ? 'published' : 'partial';
  await post.update({ platformResults: results, status, publishedAt: new Date() });

  // Stamp channels for the admin "last published" indicator.
  for (const r of results) {
    const ch = rows.find((x) => x.platform === r.platform);
    if (!ch) continue;
    await ch.update({ lastPublishedAt: r.ok ? new Date() : ch.lastPublishedAt, lastError: r.ok ? null : r.error });
  }
  return { post: post.toJSON(), results, status };
}

// Publish drafts whose time has come. With `force`, publish today's drafts too.
async function runPending({ force = false, date = new Date() } = {}) {
  await planDue({ date });
  const times = (await getConfig('times', { morning: '08:00', evening: '18:00' }));
  const autoApprove = await getConfig('auto_approve', POWER_AUTOMATE);
  const { y, m, d } = istDateParts();
  const postDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const hhmm = istParts().hhmm;

  const drafts = await SocialPost.findAll({ where: { postDate, status: 'draft' }, order: [['slot', 'ASC']] });
  const platforms = await enabledPlatforms();
  const published = [];
  for (const p of drafts) {
    // force = publish now; otherwise only auto-publish when the feature is ON
    // and the slot's scheduled time has passed. autoApprove OFF = manual only.
    const due = force || (autoApprove && hhmm >= (times[p.slot] || '00:00'));
    if (!due) continue;
    published.push(await publishPost(p, platforms));
  }
  return { postDate, hhmm, platforms, published };
}

module.exports = { planDue, planExtra, runPending, publishPost, enabledPlatforms, getConfig, setConfig, DEFAULT_PLATFORMS, istParts };
