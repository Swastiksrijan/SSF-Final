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
const API = `https://api.github.com/repos/${REPO}/releases/tags/${TAG}`;
const REEL_DIR = path.join(__dirname, '..', '..', 'uploads', 'reels');
const STATE_KEY = 'reel_inbox_state';
const MAX_BYTES = 120 * 1024 * 1024;
const MAX_ATTEMPTS = 5;
const KEEP_REELS = 10;

const headers = { 'User-Agent': 'ssf-reel-inbox', Accept: 'application/vnd.github+json' };

async function fetchRelease(fetchImpl) {
  const res = await fetchImpl(API, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`github ${res.status}`);
  return res.json();
}

async function fetchAsset(asset, fetchImpl) {
  const res = await fetchImpl(asset.browser_download_url, { headers: { 'User-Agent': headers['User-Agent'] } });
  if (!res.ok) throw new Error(`asset ${asset.name} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length) throw new Error(`asset ${asset.name} is empty`);
  if (buf.length > MAX_BYTES) throw new Error(`asset ${asset.name} is too large`);
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

async function tick({ fetchImpl = globalThis.fetch, publish = publishReel, force = false } = {}) {
  if (typeof fetchImpl !== 'function') return { skipped: 'no-fetch' };

  let release;
  try {
    release = await fetchRelease(fetchImpl);
  } catch (e) {
    return { skipped: 'github-error', error: e.message };
  }
  if (!release) return { skipped: 'no-inbox' };

  const assets = release.assets || [];
  const manifestAsset = assets.find((a) => a.name === 'inbox.json');
  if (!manifestAsset) return { skipped: 'no-manifest' };

  let manifest;
  try {
    manifest = JSON.parse((await fetchAsset(manifestAsset, fetchImpl)).toString('utf8'));
  } catch (e) {
    return { skipped: 'bad-manifest', error: e.message };
  }

  const postId = Number(manifest.postId);
  if (!postId) return { skipped: 'bad-manifest', error: 'postId missing' };

  const wantForce = force === true || manifest.force === true;
  const state = (await getConfig(STATE_KEY, null)) || {};
  if (state.postId === postId && (state.status === 'done' || (state.attempts || 0) >= MAX_ATTEMPTS)) {
    return { skipped: 'already-handled', postId };
  }

  const post = await SocialPost.findByPk(postId);
  if (!post) {
    await setConfig(STATE_KEY, { postId, status: 'done', attempts: 0, error: 'post not found' });
    return { skipped: 'no-post', postId };
  }
  if (!wantForce && post.data && post.data.reel && post.data.reel.publishedAt) {
    await setConfig(STATE_KEY, { postId, status: 'done', attempts: 0 });
    return { skipped: 'already-published', postId };
  }

  const attempts = (state.postId === postId ? Number(state.attempts) || 0 : 0) + 1;
  const remember = (status, error = null) => setConfig(STATE_KEY, {
    postId, status, attempts, error, at: new Date().toISOString(),
  });

  try {
    const video = assets.find((a) => a.name === 'reel.mp4');
    if (!video) throw new Error('reel.mp4 missing from the inbox');
    const buf = await fetchAsset(video, fetchImpl);

    fs.mkdirSync(REEL_DIR, { recursive: true });
    const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.mp4`;
    fs.writeFileSync(path.join(REEL_DIR, name), buf);

    // Instagram and Facebook download the file themselves. Our own /uploads URL
    // sits on a host that may be asleep, and a slow first byte makes Instagram
    // fail the container with a bare "Fatal", so prefer the release asset URL
    // (a warm CDN) when the manifest carries one.
    const videoUrl = typeof manifest.assetUrl === 'string' && /^https:\/\//.test(manifest.assetUrl)
      ? manifest.assetUrl
      : `/uploads/reels/${name}`;
    const out = await publish({
      post,
      videoUrl,
      platforms: Array.isArray(manifest.platforms) ? manifest.platforms : undefined,
      force: wantForce,
    });
    const done = Boolean(out && (out.published || out.skipped));
    await remember(done ? 'done' : 'failed', done ? null : 'no channel accepted the reel');
    if (done) pruneReels();
    return { postId, attempts, ...out };
  } catch (e) {
    await remember(attempts >= MAX_ATTEMPTS ? 'done' : 'failed', e.message);
    return { postId, attempts, error: e.message };
  }
}

module.exports = { tick, STATE_KEY, MAX_ATTEMPTS };
