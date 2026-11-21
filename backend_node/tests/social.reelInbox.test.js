// Tests for the pull-based reel inbox: a rendered reel is read from the repo's
// public release and published through the normal reel path.
//
//   node backend_node/tests/social.reelInbox.test.js
process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');

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

const REEL_DIR = path.join(__dirname, '..', 'uploads', 'reels');
const VIDEO = Buffer.from('fake-mp4-bytes');

// Stand-in for fetch: serves the two release assets by URL suffix, the same way
// github.com/releases/download/<tag>/<asset> does.
function fakeFetch({ manifest, video = VIDEO, status = 200, skipVideo = false } = {}) {
  const calls = [];
  const impl = async (url) => {
    calls.push(url);
    const name = String(url).split('/').pop();
    if (status !== 200) return { ok: false, status };
    const body = name === 'inbox.json' ? manifest
      : (name === 'reel.mp4' && !skipVideo ? video : null);
    if (!body) return { ok: false, status: 404 };
    const buf = Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
    return { ok: true, status: 200, arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length) };
  };
  impl.calls = calls;
  return impl;
}

const manifestFor = (postId, extra = {}) => ({ postId, ref: `SOCIAL-${postId}`, renderedAt: '2026-11-21T10:00:00Z', ...extra });

async function main() {
  const { sequelize, SocialPost } = require('../models/social');
  await sequelize.sync({ force: true });
  const { tick, STATE_KEY, MAX_ATTEMPTS } = require('../services/social/reelInbox');
  const { getConfig, setConfig } = require('../services/social/publisher');

  const makePost = (data = {}) => SocialPost.create({
    postRef: `SOCIAL-INBOX-${Math.floor(Math.random() * 90000) + 1000}`,
    postDate: '2026-11-21',
    slot: 'daily',
    titleEn: 'Keep the neighbourhood clean',
    titleHi: 'मोहल्ला साफ रखें',
    bodyEn: 'English body',
    bodyHi: 'हिंदी सामग्री',
    status: 'published',
    data,
  });

  const before = new Set(fs.existsSync(REEL_DIR) ? fs.readdirSync(REEL_DIR) : []);
  process.on('exit', () => {
    for (const f of fs.existsSync(REEL_DIR) ? fs.readdirSync(REEL_DIR) : []) {
      if (!before.has(f)) fs.unlinkSync(path.join(REEL_DIR, f));
    }
  });

  console.log('reel inbox');

  // Nothing has ever been dropped.
  ok('no manifest -> no inbox', (await tick({ fetchImpl: fakeFetch({ status: 404 }) })).skipped === 'no-inbox');

  // A release-host failure must not throw into the timer.
  const broken = await tick({ fetchImpl: fakeFetch({ status: 500 }) });
  ok('download error is swallowed', broken.skipped === 'github-error', JSON.stringify(broken));

  // Broken JSON is ignored.
  const bad = await tick({ fetchImpl: fakeFetch({ manifest: 'not json' }) });
  ok('unparsable manifest -> bad-manifest', bad.skipped === 'bad-manifest', JSON.stringify(bad));

  // A manifest without a post id is ignored.
  const noId = await tick({ fetchImpl: fakeFetch({ manifest: { ref: 'x' } }) });
  ok('manifest without postId -> bad-manifest', noId.skipped === 'bad-manifest', JSON.stringify(noId));

  // Happy path.
  const post = await makePost();
  const published = [];
  const fetch1 = fakeFetch({ manifest: manifestFor(post.id) });
  const out1 = await tick({
    fetchImpl: fetch1,
    publish: async ({ post: p, videoUrl }) => {
      published.push([p.id, videoUrl]);
      await p.update({ data: { ...(p.data || {}), reel: { videoUrl, publishedAt: new Date().toISOString() } } });
      return { skipped: false, published: true, results: [{ platform: 'instagram', ok: true }] };
    },
  });
  ok('publishes the reel', out1.published === true, JSON.stringify(out1));
  ok('stores the video under uploads/reels', published.length === 1 && published[0][1].startsWith('/uploads/reels/'), JSON.stringify(published));
  ok('downloads manifest and video', fetch1.calls.length === 2, fetch1.calls.join(','));
  ok('reel file exists on disk', fs.readdirSync(REEL_DIR).some((f) => f.endsWith('.mp4') && !before.has(f)));
  ok('state marked done', (await getConfig(STATE_KEY, {})).status === 'done');

  // A new run for a post that already has a reel is skipped.
  const fetch2 = fakeFetch({ manifest: manifestFor(post.id, { renderedAt: '2026-11-21T11:00:00Z' }) });
  const out2 = await tick({ fetchImpl: fetch2, publish: async () => { throw new Error('must not publish'); } });
  ok('post with a reel is skipped', out2.skipped === 'already-published', JSON.stringify(out2));
  ok('skipped run downloads the manifest only', fetch2.calls.length === 1, fetch2.calls.join(','));

  // The same run seen twice must not publish twice, even when forced.
  const retry = await makePost({ reel: { videoUrl: '/uploads/reels/old.mp4', publishedAt: '2026-11-20T10:00:00.000Z' } });
  await setConfig(STATE_KEY, { requestId: '', status: 'done', attempts: 0 });
  const forced = () => fakeFetch({ manifest: manifestFor(retry.id, { renderedAt: '2026-11-21T12:00:00Z', platforms: ['instagram'], force: true }) });
  const out3a = await tick({ fetchImpl: forced(), publish: async () => ({ skipped: false, published: true }) });
  ok('a forced run is processed', out3a.published === true, JSON.stringify(out3a));
  const out3b = await tick({ fetchImpl: forced(), publish: async () => { throw new Error('must not run twice'); } });
  ok('same request is handled once', out3b.skipped === 'already-handled', JSON.stringify(out3b));

  // The next run is a fresh request, and keeps the targeted platform list.
  const seen = {};
  const out4 = await tick({
    fetchImpl: fakeFetch({ manifest: manifestFor(retry.id, { renderedAt: '2026-11-21T12:30:00Z', platforms: ['instagram'], force: true }) }),
    publish: async (args) => { Object.assign(seen, args); return { skipped: false, published: true }; },
  });
  ok('a later run for the same post is processed', out4.published === true, JSON.stringify(out4));
  ok('platforms and force are forwarded', JSON.stringify(seen.platforms) === '["instagram"]' && seen.force === true, JSON.stringify(seen.platforms));

  // A manifest assetUrl (the warm CDN) is what the platforms download.
  const cdnPost = await makePost({ reel: { videoUrl: '/uploads/reels/old.mp4', publishedAt: '2026-11-20T10:00:00.000Z' } });
  await setConfig(STATE_KEY, { requestId: '', status: 'done', attempts: 0 });
  const seenCdn = {};
  await tick({
    fetchImpl: fakeFetch({
      manifest: manifestFor(cdnPost.id, {
        renderedAt: '2026-11-21T13:00:00Z', force: true,
        assetUrl: 'https://github.com/o/r/releases/download/reel-inbox/reel.mp4',
      }),
    }),
    publish: async (args) => { Object.assign(seenCdn, args); return { skipped: false, published: true }; },
  });
  ok('the local copy is tried first',
    /^\/uploads\/reels\/.+\.mp4$/.test(String(seenCdn.videoUrl)), String(seenCdn.videoUrl));

  // Instagram refuses the release asset URL (302 to a signed host), so a failure
  // there gets one more try against the asset URL, and only for Instagram.
  const retried = [];
  await setConfig(STATE_KEY, { requestId: '', status: 'done', attempts: 0 });
  const fallbackPost = await makePost();
  await tick({
    fetchImpl: fakeFetch({
      manifest: manifestFor(fallbackPost.id, {
        renderedAt: '2026-11-21T16:00:00Z',
        assetUrl: 'https://github.com/o/r/releases/download/reel-inbox/reel.mp4',
      }),
    }),
    publish: async (args) => {
      retried.push(args);
      if (args.videoUrl.startsWith('/uploads/')) {
        return { skipped: false, published: false, results: [{ platform: 'instagram', ok: false, error: 'Fatal' }] };
      }
      return { skipped: false, published: true, results: [{ platform: 'instagram', ok: true }] };
    },
  });
  ok('a failed instagram publish retries the asset url',
    retried.length === 2
      && retried[1].videoUrl === 'https://github.com/o/r/releases/download/reel-inbox/reel.mp4'
      && JSON.stringify(retried[1].platforms) === '["instagram"]',
    JSON.stringify(retried.map((r) => [r.videoUrl, r.platforms])));

  // A publish failure is retried, then given up on — and stays visible.
  const failing = await makePost();
  await setConfig(STATE_KEY, { requestId: '', status: 'done', attempts: 0 });
  const failManifest = () => fakeFetch({ manifest: manifestFor(failing.id, { renderedAt: '2026-11-21T14:00:00Z' }) });
  const failPublish = async () => { throw new Error('no reel channel connected'); };
  const first = await tick({ fetchImpl: failManifest(), publish: failPublish });
  ok('failure records an attempt', first.attempts === 1 && first.error === 'no reel channel connected', JSON.stringify(first));
  await failing.reload();
  ok('failure is visible on the post',
    failing.data.reelLastAttempt && failing.data.reelLastAttempt.error === 'no reel channel connected',
    JSON.stringify(failing.data.reelLastAttempt));
  let last;
  for (let i = 0; i < MAX_ATTEMPTS; i += 1) last = await tick({ fetchImpl: failManifest(), publish: failPublish });
  ok('stops after MAX_ATTEMPTS', last.skipped === 'already-handled', JSON.stringify(last));

  // A manifest pointing at a missing video fails without publishing.
  const noVideo = await makePost();
  await setConfig(STATE_KEY, { requestId: '', status: 'done', attempts: 0 });
  const out5 = await tick({
    fetchImpl: fakeFetch({ manifest: manifestFor(noVideo.id, { renderedAt: '2026-11-21T15:00:00Z' }), skipVideo: true }),
    publish: async () => { throw new Error('must not publish'); },
  });
  ok('missing video is an error, not a publish', out5.error === 'reel.mp4 missing from the inbox', JSON.stringify(out5));

  // Unknown post ids are dropped instead of retried forever.
  await setConfig(STATE_KEY, { requestId: '', status: 'done', attempts: 0 });
  const ghost = await tick({ fetchImpl: fakeFetch({ manifest: manifestFor(999999, { renderedAt: '2026-11-21T16:00:00Z' }) }) });
  ok('unknown post -> no-post', ghost.skipped === 'no-post', JSON.stringify(ghost));

  // The tick runs every minute; two checks must not hammer the release host.
  const oneFetch = fakeFetch({ manifest: manifestFor(999999, { renderedAt: '2026-11-21T17:00:00Z' }) });
  await tick({ fetchImpl: oneFetch });
  const throttled = await tick({ fetchImpl: oneFetch });
  ok('checks are throttled per fetch impl', throttled.skipped === 'throttled', JSON.stringify(throttled));
  ok('throttled tick makes no extra call', oneFetch.calls.length === 1, oneFetch.calls.join(','));

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  await sequelize.close();
  if (fail) process.exit(1);
}

main().catch((e) => { console.error('TEST ERROR', e); process.exit(1); });
