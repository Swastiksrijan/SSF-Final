// Pull-based reel intake.
//
// The GitHub runner that renders the reel is not given the backend's scheduler
// secret. Instead it drops the finished MP4 into a public release on the repo
// ("reel-inbox"), and this module — driven by the 5-minute social timer — picks
// it up and publishes it through the same path as /api/social/reel.
//
// Why pull: one less secret to keep in sync between GitHub and the deployment,
// and a rotated key cannot silently stop the reels.
//
// Trust: only repo collaborators can publish a release asset, so the inbox is as
// private as the repository. The work is still bounded — mp4 only, size capped,
// a post that already has a reel is never published twice, and a failing
// publish is retried at most MAX_ATTEMPTS times.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { SocialPost } = require('../../models/social');
const { getConfig, setConfig } = require('./publisher');
const { publishReel } = require('./reel');

const REPO = process.env.REEL_INBOX_REPO || 'Swastiksrijan/SSF-Final';
const TAG = process.env.REEL_INBOX_TAG || 'reel-inbox';
// Straight to the release assets, not through api.github.com: the anonymous API
// budget is 60 calls per hour *per IP*, and a shared host burns through it, after
// which every check fails with a 403 and a queued reel waits forever. A release
// download URL has no such limit.
const BASE = (process.env.REEL_INBOX_URL || `https://github.com/${REPO}/releases/download/${TAG}`).replace(/\/$/, '');
const MANIFEST_URL = `${BASE}/inbox.json`;
const VIDEO_URL = `${BASE}/reel.mp4`;
// One release per content series. A single shared inbox loses reels whenever the
// instance is asleep and the next workflow run overwrites the manifest, so each
// series gets its own tag and its own state.
const TAGS = (process.env.REEL_INBOX_TAGS || 'reel-inbox,seva-inbox')
  .split(',').map((t) => t.trim()).filter(Boolean);
const REEL_DIR = path.join(__dirname, '..', '..', 'uploads', 'reels');
const STATE_KEY = 'reel_inbox_state';
const MAX_BYTES = 120 * 1024 * 1024;
const MAX_ATTEMPTS = 5;
const KEEP_REELS = 10;

const headers = { 'User-Agent': 'ssf-reel-inbox', Accept: 'application/vnd.github+json' };

// The social timer ticks every minute (a request kick, then the interval), and
// each check costs two unauthenticated GitHub calls. Without a floor that is
// enough to trip the 60/hour anonymous limit, after which every check fails and
// a queued reel sits there forever. Keyed by the fetch implementation so tests
// (which pass their own) are never throttled.
const CHECK_EVERY_MS = 5 * 60 * 1000;
const lastCheck = new WeakMap();

// Returns null when the inbox has never been created (404).
async function download(url, fetchImpl) {
  const res = await fetchImpl(url, { headers: { 'User-Agent': headers['User-Agent'] } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${url.split('/').pop()} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length) throw new Error(`${url.split('/').pop()} is empty`);
  if (buf.length > MAX_BYTES) throw new Error(`${url.split('/').pop()} is too large`);
  return buf;
}

function pruneReels() {
  try {
    const files = fs.readdirSync(REEL_DIR)
      .map((f) => ({ f, t: fs.statSync(path.join(REEL_DIR, f)).mtimeMs }))
      .sort((a, b) => b.t - a.t)
      .slice(KEEP_REELS);
    for (const { f } of files) fs.unlinkSync(path.join(REEL_DIR, f));
  } catch { /* pruning must never break publishing */ }
}

// A failed publish leaves no trace on the post (only a successful one stores a
// reel), so a silent "Instagram: Fatal" would be invisible to the admin. Keep the
// last attempt next to the post instead.
async function noteAttempt(post, attempt) {
  try {
    await post.update({ data: { ...(post.data || {}), reelLastAttempt: attempt } });
  } catch { /* never let bookkeeping break the publish path */ }
}

// The inbox is invisible from outside: a skipped or failing check looks exactly
// like "nothing was queued". Remember the last outcome so it can be inspected.
let lastResult = null;

function record(out) {
  lastResult = { at: new Date().toISOString(), ...out };
  return out;
}

async function tick(opts = {}) {
  try {
    return record(await check(opts));
  } catch (e) {
    return record({ skipped: 'error', error: e.message });
  }
}

async function check(opts = {}) {
  const { fetchImpl = globalThis.fetch } = opts;
  if (typeof fetchImpl !== 'function') return { skipped: 'no-fetch' };

  const previous = lastCheck.get(fetchImpl);
  if (previous && Date.now() - previous < CHECK_EVERY_MS) return { skipped: 'throttled' };
  lastCheck.set(fetchImpl, Date.now());

  const results = [];
  for (const tag of TAGS) results.push(await checkTag(tag, opts));
  // Report the first inbox that had something to say; "no-inbox" means idle.
  return results.find((r) => r.skipped !== 'no-inbox') || { skipped: 'no-inbox' };
}

// A seva reel has no post yet: the series is not tied to an awareness post, so
// the inbox creates the record it will attach the publish results to.
async function ensureSevaPost(seva) {
  const date = String(seva.date || new Date().toISOString().slice(0, 10));
  const index = Number(seva.index) || 0;
  const postRef = `SEVA-${date}-${index}`;
  const existing = await SocialPost.findOne({ where: { postRef } });
  if (existing) return existing;
  try {
    return await SocialPost.create({
      postRef,
      postDate: date,
      slot: 'seva',
      topicKey: 'seva-ideas',
      category: 'seva',
      kind: 'seva',
      titleEn: seva.titleEn || '',
      titleHi: seva.titleHi || '',
      bodyEn: seva.bodyEn || '',
      bodyHi: seva.bodyHi || '',
      hashtags: seva.hashtags || '',
      status: 'published',
      publishedAt: new Date(),
      createdBy: 'reel-inbox',
      data: { seva },
    });
  } catch (e) {
    // postRef is unique: a concurrent tick may have created it first.
    const row = await SocialPost.findOne({ where: { postRef } });
    if (row) return row;
    throw e;
  }
}

async function checkTag(tag, { fetchImpl = globalThis.fetch, publish = publishReel, force = false } = {}) {
  const base = `https://github.com/${REPO}/releases/download/${tag}`;
  const manifestUrl = `${base}/inbox.json`;

  let raw;
  try {
    raw = await download(manifestUrl, fetchImpl);
  } catch (e) {
    return { tag, skipped: 'github-error', error: e.message };
  }
  if (!raw) return { tag, skipped: 'no-inbox' };

  let manifest;
  try {
    manifest = JSON.parse(raw.toString('utf8'));
  } catch (e) {
    return { tag, skipped: 'bad-manifest', error: e.message };
  }

  const postId = Number(manifest.postId);
  if (!postId && !manifest.seva) return { tag, skipped: 'bad-manifest', error: 'postId or seva missing' };

  const post = postId ? await SocialPost.findByPk(postId) : await ensureSevaPost(manifest.seva);
  if (!post) {
    return { tag, skipped: 'no-post', postId };
  }

  // One workflow run = one request. A later run (a forced retry, say) carries a
  // new renderedAt and must be handled even when the previous one succeeded.
  const ref = postId || post.postRef;
  const requestId = `${ref}:${manifest.renderedAt || ''}`;
  const wantForce = force === true || manifest.force === true;
  const stateKey = `${STATE_KEY}:${tag}`;
  const state = (await getConfig(stateKey, null)) || {};
  if (state.requestId === requestId && (state.status === 'done' || (state.attempts || 0) >= MAX_ATTEMPTS)) {
    return { tag, skipped: 'already-handled', postId: post.id };
  }
  if (!wantForce && post.data && post.data.reel && post.data.reel.publishedAt) {
    await setConfig(stateKey, { requestId, postId: post.id, status: 'done', attempts: 0 });
    return { tag, skipped: 'already-published', postId: post.id };
  }

  const attempts = (state.requestId === requestId ? Number(state.attempts) || 0 : 0) + 1;
  const remember = (status, error = null) => setConfig(stateKey, {
    requestId, postId: post.id, status, attempts, error, at: new Date().toISOString(),
  });

  try {
    const buf = await download(manifest.assetUrl || `${base}/reel.mp4`, fetchImpl);
    if (!buf) throw new Error('reel.mp4 missing from the inbox');

    fs.mkdirSync(REEL_DIR, { recursive: true });
    const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.mp4`;
    fs.writeFileSync(path.join(REEL_DIR, name), buf);

    // The platforms download the file themselves. Our own copy is served straight
    // from disk by the process that is already awake, while the release asset URL
    // answers with a 302 to a signed host — Instagram refuses that with a bare
    // "Fatal" (Facebook accepts it). So try the local copy first and give the
    // asset URL a second chance for Instagram only.
    const localUrl = `/uploads/reels/${name}`;
    const cdnUrl = typeof manifest.assetUrl === 'string' && /^https:\/\//.test(manifest.assetUrl)
      ? manifest.assetUrl
      : null;
    const platforms = Array.isArray(manifest.platforms) ? manifest.platforms : undefined;
    let out = await publish({ post, videoUrl: localUrl, platforms, force: wantForce });
    if (cdnUrl && failed(out, 'instagram')) {
      const retry = await publish({ post, videoUrl: cdnUrl, platforms: ['instagram'], force: true });
      out = merge(out, retry);
    }
    const done = Boolean(out && (out.published || out.skipped));
    await remember(done ? 'done' : 'failed', done ? null : 'no channel accepted the reel');
    if (done) pruneReels();
    if (!done) await noteAttempt(post, { at: new Date().toISOString(), results: out && out.results });
    return { tag, postId: post.id, attempts, ...out };
  } catch (e) {
    await remember(attempts >= MAX_ATTEMPTS ? 'done' : 'failed', e.message);
    await noteAttempt(post, { at: new Date().toISOString(), error: e.message });
    return { tag, postId: post.id, attempts, error: e.message };
  }
}

const failed = (out, platform) => Boolean(out && Array.isArray(out.results)
  && out.results.some((r) => r.platform === platform && !r.ok));

// Keep the first run's per-platform results, replacing only what was retried.
function merge(out, retry) {
  const retried = (retry && retry.results) || [];
  const results = [...(out.results || []).filter((r) => !retried.some((n) => n.platform === r.platform)), ...retried];
  return {
    ...out,
    ...retry,
    results,
    published: Boolean(out.published || (retry && retry.published)),
    skipped: Boolean(out.skipped || (retry && retry.skipped)),
  };
}

// Public read-only view of the last check: no secrets, just what happened.
function status() {
  return { last: lastResult, inbox: MANIFEST_URL, maxAttempts: MAX_ATTEMPTS };
}

module.exports = { tick, status, STATE_KEY, MAX_ATTEMPTS, TAGS };
