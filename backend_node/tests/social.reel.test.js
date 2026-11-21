// Tests for reel (video) publishing: channel selection, idempotency and the
// "nothing connected" guard. Runs against in-memory Postgres (pg-mem) with the
// real models; only the platform adapters are injected, so no network is used.
//
//   node backend_node/tests/social.reel.test.js
process.env.NODE_ENV = 'test';

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

async function main() {
  const { sequelize, SocialPost, SocialChannel } = require('../models/social');
  await sequelize.sync({ force: true });

  const { publishReel } = require('../services/social/reel');

  const makePost = (data = {}) => SocialPost.create({
    postRef: `SOCIAL-2026-${Math.floor(Math.random() * 9000) + 1000}`,
    postDate: '2026-11-21',
    slot: 'daily',
    titleEn: 'Keep the neighbourhood clean',
    titleHi: 'मोहल्ला साफ रखें',
    bodyEn: 'English body',
    bodyHi: 'हिंदी सामग्री',
    imageUrl: '/api/social/image/daily?postId=1',
    status: 'published',
    data,
  });

  const calls = [];
  const fakeAdapters = {
    instagram: async (post, creds, videoUrl) => { calls.push(['instagram', creds.igUserId, videoUrl]); return { ok: true, url: 'https://instagram.com/reel/abc' }; },
    facebook: async () => { calls.push(['facebook']); return { ok: false, error: 'not_connected' }; },
  };

  console.log('\nReel publishing:');

  // 1) Nothing connected yet -> a clear 409 instead of a silent no-op, so the
  //    workflow reports "connect a channel" and the retry run can still succeed.
  const p1 = await makePost();
  let status = 0;
  try { await publishReel({ post: p1, videoUrl: '/uploads/reels/a.mp4', adapters: fakeAdapters }); }
  catch (e) { status = e.status; }
  ok('no connected channel -> 409', status === 409, `status=${status}`);
  ok('nothing stored when no channel is connected', !(p1.data && p1.data.reel));

  // 2) A connected Instagram account publishes the reel and records it.
  await SocialChannel.create({ platform: 'instagram', accountName: 'ssf', enabled: true, credentials: { igUserId: '1789', accessToken: 'tok' }, status: 'connected' });
  const p2 = await makePost();
  const out = await publishReel({ post: p2, videoUrl: '/uploads/reels/b.mp4', adapters: fakeAdapters });
  await p2.reload();
  ok('reel published', out.published === true && out.reel.publishedAt != null);
  ok('adapter received the video url', calls.some((c) => c[0] === 'instagram' && c[2] === '/uploads/reels/b.mp4'));
  ok('result stored on the post', p2.data.reel && p2.data.reel.videoUrl === '/uploads/reels/b.mp4');
  ok('per-platform results kept', Array.isArray(p2.data.reel.results) && p2.data.reel.results.length >= 1);

  // 3) A second run is a no-op: the workflow retry can never double-post.
  const before = calls.length;
  const again = await publishReel({ post: p2, videoUrl: '/uploads/reels/b.mp4', adapters: fakeAdapters });
  ok('second run is skipped', again.skipped === true && calls.length === before);

  // 4) ...unless the admin explicitly forces it.
  const forced = await publishReel({ post: p2, videoUrl: '/uploads/reels/c.mp4', force: true, adapters: fakeAdapters });
  await p2.reload();
  ok('force re-publishes', forced.published === true && calls.length > before);
  ok('forced run replaces the stored url', p2.data.reel.videoUrl === '/uploads/reels/c.mp4');

  // 5) A channel that cannot take video is not attempted (LinkedIn has no reel
  //    adapter), so asking for it alone reports "not connected for video".
  const p3 = await makePost();
  let s3 = 0;
  try { await publishReel({ post: p3, videoUrl: '/uploads/reels/d.mp4', platforms: ['linkedin'], adapters: fakeAdapters }); }
  catch (e) { s3 = e.status; }
  ok('non-video platform is rejected', s3 === 409, `status=${s3}`);

  // 6) Every adapter failing must NOT mark the post as having a reel, otherwise
  //    the retry cron would skip a post that never actually went out.
  const p4 = await makePost();
  const allFail = { instagram: async () => ({ ok: false, error: 'boom' }) };
  const failed = await publishReel({ post: p4, videoUrl: '/uploads/reels/e.mp4', adapters: allFail });
  await p4.reload();
  ok('all-failed run reports published:false', failed.published === false);
  ok('all-failed run stores no reel', !(p4.data && p4.data.reel));

  // 7) A targeted retry (one platform, force) keeps the platforms that already
  //    succeeded — retrying Instagram must not erase the Facebook link.
  await SocialChannel.create({ platform: 'facebook', accountName: 'ssf page', enabled: true, credentials: { pageId: '1474', accessToken: 'tok' }, status: 'connected' });
  const p5 = await makePost();
  const both = {
    instagram: async () => ({ ok: true, url: 'https://instagram.com/reel/1' }),
    facebook: async () => ({ ok: true, url: 'https://facebook.com/1' }),
  };
  await publishReel({ post: p5, videoUrl: '/uploads/reels/f.mp4', adapters: both });
  await p5.reload();
  ok('two platforms recorded', p5.data.reel.results.length === 2, JSON.stringify(p5.data.reel.results));

  const retryIg = { instagram: async () => ({ ok: true, url: 'https://instagram.com/reel/2' }) };
  await publishReel({ post: p5, videoUrl: '/uploads/reels/g.mp4', platforms: ['instagram'], force: true, adapters: retryIg });
  await p5.reload();
  const kept = p5.data.reel.results;
  ok('retry updates only the retried platform',
    kept.length === 2
      && kept.find((r) => r.platform === 'instagram').url.endsWith('/2')
      && kept.find((r) => r.platform === 'facebook').url.endsWith('/1'),
    JSON.stringify(kept));

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  await sequelize.close();
  if (fail) process.exit(1);
}

main().catch((e) => { console.error('TEST ERROR', e); process.exit(1); });
