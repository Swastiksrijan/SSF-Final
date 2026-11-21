// Tests for the seva reel inbox: a "ways to help" reel is not tied to an
// awareness post, so the inbox has to create the record it publishes against.
//
//   node backend_node/tests/social.sevaInbox.test.js
process.env.NODE_ENV = 'test';
process.env.REEL_INBOX_TAGS = 'seva-inbox';

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

const sevaManifest = (extra = {}) => ({
  seva: {
    date: '2026-11-22',
    index: 3,
    titleHi: 'कन्या सेवा',
    titleEn: 'Stand with a daughter',
    bodyHi: 'तीन तरीके',
    bodyEn: 'Three ways',
  },
  renderedAt: '2026-11-22T06:30:00Z',
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

  console.log('seva reel inbox');

  const published = [];
  const out = await tick({
    fetchImpl: fakeFetch({ manifest: sevaManifest() }),
    publish: async ({ post, videoUrl }) => {
      published.push([post.postRef, videoUrl]);
      await post.update({ data: { ...(post.data || {}), reel: { videoUrl, publishedAt: new Date().toISOString() } } });
      return { skipped: false, published: true, results: [{ platform: 'facebook', ok: true }] };
    },
  });

  ok('a seva manifest is published', out.published === true, JSON.stringify(out));
  ok('the reel is stored under uploads/reels', published.length === 1 && published[0][1].startsWith('/uploads/reels/'), JSON.stringify(published));

  const row = await SocialPost.findOne({ where: { postRef: 'SEVA-2026-11-22-3' } });
  ok('the inbox created the post it published', Boolean(row), 'no SEVA-2026-11-22-3');
  ok('the post is listed as a seva post',
    Boolean(row) && row.slot === 'seva' && row.kind === 'seva' && row.status === 'published',
    row && JSON.stringify({ slot: row.slot, kind: row.kind, status: row.status }));
  ok('the Hindi title is kept for the admin screen', Boolean(row) && row.titleHi === 'कन्या सेवा', row && row.titleHi);
  ok('state is kept per series', Boolean((await getConfig(`${STATE_KEY}:seva-inbox`, {})).status === 'done'));

  // The same rendered reel must never go out twice.
  const again = await tick({
    fetchImpl: fakeFetch({ manifest: sevaManifest() }),
    publish: async () => { throw new Error('must not publish twice'); },
  });
  ok('the same request is handled once', again.skipped === 'already-handled', JSON.stringify(again));

  // A later run (new renderedAt) for the same day/group is a new request but the
  // post already has a reel, so it is skipped rather than duplicated.
  const later = await tick({
    fetchImpl: fakeFetch({ manifest: sevaManifest({ renderedAt: '2026-11-22T12:00:00Z' }) }),
    publish: async () => { throw new Error('must not publish twice'); },
  });
  ok('a post that already has a reel is skipped', later.skipped === 'already-published', JSON.stringify(later));

  // A different group on the same day is a different post.
  const other = await tick({
    fetchImpl: fakeFetch({ manifest: sevaManifest({ seva: { ...sevaManifest().seva, index: 4 } }) }),
    publish: async () => ({ skipped: false, published: true, results: [] }),
  });
  ok('another group gets its own post', other.published === true && other.postId !== row.id, JSON.stringify(other));

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
