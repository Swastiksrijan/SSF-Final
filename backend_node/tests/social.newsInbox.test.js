// Tests for the news reel inbox: the morning/evening awareness digest is not
// tied to an awareness post, so the inbox creates the record it publishes
// against — one per (day, slot).
//
//   node backend_node/tests/social.newsInbox.test.js
process.env.NODE_ENV = 'test';
process.env.REEL_INBOX_TAGS = 'news-inbox';

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

function fakeFetch({ manifest, video = VIDEO, status = 200 } = {}) {
  const calls = [];
  const impl = async (url) => {
    calls.push(url);
    const name = String(url).split('/').pop();
    if (status !== 200) return { ok: false, status };
    const body = name === 'inbox.json' ? manifest : (name === 'reel.mp4' ? video : null);
    if (!body) return { ok: false, status: 404 };
    const buf = Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body));
    return { ok: true, status: 200, arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length) };
  };
  impl.calls = calls;
  return impl;
}

const newsManifest = (extra = {}) => ({
  news: {
    date: '2026-11-22',
    slot: 'morning',
    titleHi: 'आज की ज़रूरी खबरें',
    titleEn: "Today's news at a glance",
    bodyHi: '1. शिक्षा की खबर\nस्रोत: Dainik Bhaskar — https://example.org/a',
    bodyEn: '1. A story about education\nSource: Dainik Bhaskar — https://example.org/a',
    hashtags: '#Samachar',
    items: [{ title: 'शिक्षा की खबर', source: 'Dainik Bhaskar', url: 'https://example.org/a' }],
  },
  renderedAt: '2026-11-22T01:30:00Z',
  ...extra,
});

async function main() {
  const { sequelize, SocialPost } = require('../models/social');
  await sequelize.sync({ force: true });
  const { tick, STATE_KEY } = require('../services/social/reelInbox');
  const { getConfig } = require('../services/social/publisher');

  const before = new Set(fs.existsSync(REEL_DIR) ? fs.readdirSync(REEL_DIR) : []);
  process.on('exit', () => {
    for (const f of fs.existsSync(REEL_DIR) ? fs.readdirSync(REEL_DIR) : []) {
      if (!before.has(f)) fs.unlinkSync(path.join(REEL_DIR, f));
    }
  });

  console.log('news reel inbox');

  const published = [];
  const out = await tick({
    fetchImpl: fakeFetch({ manifest: newsManifest() }),
    publish: async ({ post, videoUrl }) => {
      published.push([post.postRef, videoUrl]);
      await post.update({ data: { ...(post.data || {}), reel: { videoUrl, publishedAt: new Date().toISOString() } } });
      return { skipped: false, published: true, results: [{ platform: 'facebook', ok: true }] };
    },
  });

  ok('a news manifest is published', out.published === true, JSON.stringify(out));
  ok('the reel is stored under uploads/reels', published.length === 1 && published[0][1].startsWith('/uploads/reels/'), JSON.stringify(published));

  const row = await SocialPost.findOne({ where: { postRef: 'NEWS-2026-11-22-morning' } });
  ok('the inbox created the post it published', Boolean(row), 'no NEWS-2026-11-22-morning');
  ok('the post is listed as a news post',
    Boolean(row) && row.slot === 'news-morning' && row.kind === 'news' && row.category === 'news' && row.status === 'published',
    row && JSON.stringify({ slot: row.slot, kind: row.kind, category: row.category, status: row.status }));
  ok('the caption body is kept for the admin screen', Boolean(row) && row.bodyHi.includes('Dainik Bhaskar'), row && row.bodyHi);
  ok('the picked headlines are kept with the post', Boolean(row) && Array.isArray(row.data && row.data.news && row.data.news.items), 'items missing');
  ok('state is kept per series', Boolean((await getConfig(`${STATE_KEY}:news-inbox`, {})).status === 'done'));

  // The same rendered reel must never go out twice.
  const again = await tick({
    fetchImpl: fakeFetch({ manifest: newsManifest() }),
    publish: async () => { throw new Error('must not publish twice'); },
  });
  ok('the same request is handled once', again.skipped === 'already-handled', JSON.stringify(again));

  // The evening digest is its own post, not a second reel on the morning one.
  const evening = await tick({
    fetchImpl: fakeFetch({ manifest: newsManifest({ news: { ...newsManifest().news, slot: 'evening' }, renderedAt: '2026-11-22T14:00:00Z' }) }),
    publish: async () => ({ skipped: false, published: true, results: [] }),
  });
  const eveningRow = await SocialPost.findOne({ where: { postRef: 'NEWS-2026-11-22-evening' } });
  ok('the evening slot gets its own post',
    evening.published === true && Boolean(eveningRow) && eveningRow.id !== row.id,
    JSON.stringify(evening));

  // A manifest with nothing usable is rejected rather than published.
  const empty = await tick({ fetchImpl: fakeFetch({ manifest: { renderedAt: '2026-11-23T01:30:00Z' } }) });
  ok('a manifest without postId/seva/news is rejected', empty.skipped === 'bad-manifest', JSON.stringify(empty));

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
