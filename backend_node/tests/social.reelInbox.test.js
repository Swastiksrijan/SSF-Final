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

// Minimal stand-in for fetch: a release document plus downloadable assets.
function fakeFetch({ release, files = {}, status = 200 } = {}) {
  const calls = [];
  const impl = async (url) => {
    calls.push(url);
    if (String(url).includes('/releases/tags/')) {
      if (status !== 200) return { ok: false, status };
      return { ok: true, status: 200, json: async () => release };
    }
    const name = String(url).split('/').pop();
    const body = files[name];
    if (!body) return { ok: false, status: 404 };
    return {
      ok: true, status: 200,
      arrayBuffer: async () => body.buffer.slice(body.byteOffset, body.byteOffset + body.length),
    };
  };
  impl.calls = calls;
  return impl;
}

const releaseDoc = (postId) => ({
  tag_name: 'reel-inbox',
  assets: [
    { name: 'reel.mp4', size: 2048, browser_download_url: 'https://example.test/assets/reel.mp4' },
    { name: 'inbox.json', size: 64, browser_download_url: 'https://example.test/assets/inbox.json' },
  ],
  body: '',
  postId,
});

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

  const manifest = (postId) => Buffer.from(JSON.stringify({ postId, ref: `SOCIAL-${postId}` }));
  const video = Buffer.from('fake-mp4-bytes');

  const before = new Set(fs.existsSync(REEL_DIR) ? fs.readdirSync(REEL_DIR) : []);
  const cleanup = () => {
    for (const f of fs.existsSync(REEL_DIR) ? fs.readdirSync(REEL_DIR) : []) {
      if (!before.has(f)) fs.unlinkSync(path.join(REEL_DIR, f));
    }
  };
  process.on('exit', cleanup);

  console.log('reel inbox');

  // Nothing published yet.
  ok('no release -> no inbox', (await tick({ fetchImpl: fakeFetch({ status: 404 }) })).skipped === 'no-inbox');

  // GitHub failing must not throw into the timer.
  const broken = await tick({ fetchImpl: fakeFetch({ status: 500 }) });
  ok('github error is swallowed', broken.skipped === 'github-error', JSON.stringify(broken));

  // A release without a manifest is ignored.
  const noManifest = await tick({ fetchImpl: fakeFetch({ release: { assets: [{ name: 'reel.mp4' }] } }) });
  ok('missing inbox.json -> no-manifest', noManifest.skipped === 'no-manifest', JSON.stringify(noManifest));

  // Happy path.
  const post = await makePost();
  const published = [];
  const fetch1 = fakeFetch({ release: releaseDoc(post.id), files: { 'inbox.json': manifest(post.id), 'reel.mp4': video } });
  const out1 = await tick({
    fetchImpl: fetch1,
    publish: async ({ post: p, videoUrl }) => {
      published.push([p.id, videoUrl]);
      await p.update({ data: { ...(p.data || {}), reel: { videoUrl, publishedAt: new Date().toISOString() } } });
      return { skipped: false, published: true, results: [{ platform: 'instagram', ok: true }] };
    },
  });
  ok('publishes the reel', out1.published === true, JSON.stringify(out1));
  ok('writes the file under uploads/reels', published.length === 1 && published[0][1].startsWith('/uploads/reels/'), JSON.stringify(published));
  ok('downloads both assets', fetch1.calls.length === 3, fetch1.calls.join(','));
  const saved = fs.readdirSync(REEL_DIR).filter((f) => f.endsWith('.mp4') && !before.has(f));
  ok('reel file exists on disk', saved.length >= 1, saved.join(','));
  ok('state marked done', (await getConfig(STATE_KEY, {})).status === 'done');

  // Second tick for the same post is a no-op (no double publish).
  const fetch2 = fakeFetch({ release: releaseDoc(post.id), files: { 'inbox.json': manifest(post.id), 'reel.mp4': video } });
  const out2 = await tick({ fetchImpl: fetch2, publish: async () => { throw new Error('must not publish twice'); } });
  ok('same post is not published twice', out2.skipped === 'already-handled', JSON.stringify(out2));
  ok('second tick reads the manifest only', fetch2.calls.length === 2 && !fetch2.calls.some((u) => u.endsWith('reel.mp4')), fetch2.calls.join(','));

  // A post that already carries a reel is skipped even if state is stale.
  const reeled = await makePost({ reel: { videoUrl: '/uploads/reels/old.mp4', publishedAt: '2026-11-20T10:00:00.000Z' } });
  await setConfig(STATE_KEY, { postId: 0, status: 'done', attempts: 0 });
  const out3 = await tick({ fetchImpl: fakeFetch({ release: releaseDoc(reeled.id), files: { 'inbox.json': manifest(reeled.id), 'reel.mp4': video } }) });
  ok('post with a reel is skipped', out3.skipped === 'already-published', JSON.stringify(out3));

  // A publish failure is retried, then given up on.
  const failing = await makePost();
  await setConfig(STATE_KEY, { postId: 0, status: 'done', attempts: 0 });
  const failingFetch = () => fakeFetch({ release: releaseDoc(failing.id), files: { 'inbox.json': manifest(failing.id), 'reel.mp4': video } });
  const failPublish = async () => { throw new Error('no reel channel connected'); };
  const first = await tick({ fetchImpl: failingFetch(), publish: failPublish });
  ok('failure records an attempt', first.attempts === 1 && first.error === 'no reel channel connected', JSON.stringify(first));
  let last;
  for (let i = 0; i < MAX_ATTEMPTS; i += 1) last = await tick({ fetchImpl: failingFetch(), publish: failPublish });
  ok('stops after MAX_ATTEMPTS', last.skipped === 'already-handled', JSON.stringify(last));

  // A targeted retry: the manifest carries the warm CDN url, the platform list
  // and force, and all three reach the publisher.
  const retry = await makePost({ reel: { videoUrl: '/uploads/reels/old.mp4', publishedAt: '2026-11-20T10:00:00.000Z' } });
  await setConfig(STATE_KEY, { postId: 0, status: 'done', attempts: 0 });
  const seen = {};
  const out5 = await tick({
    fetchImpl: fakeFetch({
      release: releaseDoc(retry.id),
      files: {
        'inbox.json': Buffer.from(JSON.stringify({
          postId: retry.id,
          assetUrl: 'https://github.com/o/r/releases/download/reel-inbox/reel.mp4',
          platforms: ['instagram'],
          force: true,
        })),
        'reel.mp4': video,
      },
    }),
    publish: async (args) => { Object.assign(seen, args); return { skipped: false, published: true }; },
  });
  ok('force retry publishes', out5.published === true, JSON.stringify(out5));
  ok('manifest assetUrl becomes the video url', seen.videoUrl === 'https://github.com/o/r/releases/download/reel-inbox/reel.mp4', String(seen.videoUrl));
  ok('platforms and force are forwarded', JSON.stringify(seen.platforms) === '["instagram"]' && seen.force === true, JSON.stringify(seen.platforms));

  // The same workflow run must never be handled twice, even when forced...
  const sameRun = () => fakeFetch({
    release: releaseDoc(retry.id),
    files: {
      'inbox.json': Buffer.from(JSON.stringify({ postId: retry.id, renderedAt: '2026-11-21T12:00:00Z', platforms: ['instagram'], force: true })),
      'reel.mp4': video,
    },
  });
  const out6a = await tick({ fetchImpl: sameRun(), publish: async () => ({ skipped: false, published: true }) });
  ok('a forced run is processed', out6a.published === true, JSON.stringify(out6a));
  const out6 = await tick({ fetchImpl: sameRun(), publish: async () => { throw new Error('must not run twice'); } });
  ok('same request is handled once', out6.skipped === 'already-handled', JSON.stringify(out6));

  // ...but the next run (a new renderedAt) is a fresh request.
  const seen7 = {};
  const out7 = await tick({
    fetchImpl: fakeFetch({
      release: releaseDoc(retry.id),
      files: {
        'inbox.json': Buffer.from(JSON.stringify({ postId: retry.id, renderedAt: '2026-11-21T12:30:00Z', platforms: ['instagram'], force: true })),
        'reel.mp4': video,
      },
    }),
    publish: async (args) => { Object.assign(seen7, args); return { skipped: false, published: true }; },
  });
  ok('a later run for the same post is processed', out7.published === true, JSON.stringify(out7));
  ok('later run keeps the targeted platform', JSON.stringify(seen7.platforms) === '["instagram"]');

  // Manifest without a postId is ignored.
  const bad = await tick({ fetchImpl: fakeFetch({ release: releaseDoc(0), files: { 'inbox.json': Buffer.from('{"ref":"x"}') } }) });
  ok('manifest without postId -> bad-manifest', bad.skipped === 'bad-manifest', JSON.stringify(bad));

  // Unknown post id is dropped instead of retried forever.
  await setConfig(STATE_KEY, { postId: 0, status: 'done', attempts: 0 });
  const ghost = await tick({ fetchImpl: fakeFetch({ release: releaseDoc(999999), files: { 'inbox.json': manifest(999999), 'reel.mp4': video } }) });
  ok('unknown post -> no-post', ghost.skipped === 'no-post', JSON.stringify(ghost));

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
