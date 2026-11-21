// SSF Social Publisher — reel (video) publishing.
//
// The daily image post and the daily reel are two publications of the SAME
// content: the reel reuses the post's poster plus a Hindi voiceover, so nothing
// new has to be written. Rendering happens on a GitHub Actions runner (free,
// has ffmpeg); this module only takes the finished MP4 and publishes it to the
// channels that accept video.
//
// Idempotent per post: once `data.reel.publishedAt` is set, a re-run is a no-op
// unless `force` is passed, so a retried workflow can never double-post.

const { SocialChannel } = require('../../models/social');
const { REEL_ADAPTERS } = require('./channels');
const { enabledPlatforms } = require('./publisher');

const REEL_PLATFORMS = Object.keys(REEL_ADAPTERS);

async function publishReel({ post, videoUrl, platforms, force = false, adapters = REEL_ADAPTERS }) {
  const previous = (post.data && post.data.reel) || null;
  if (!force && previous && previous.publishedAt) {
    return { skipped: true, reel: previous };
  }

  const rows = await SocialChannel.findAll();
  const credsBy = {};
  for (const row of rows) credsBy[row.platform] = row.credentials || {};

  const connected = new Set(await enabledPlatforms());
  const requested = (Array.isArray(platforms) && platforms.length ? platforms : REEL_PLATFORMS)
    .filter((p) => adapters[p]);
  const targets = requested.filter((p) => connected.has(p));

  if (!targets.length) {
    const err = new Error(`no reel channel connected (available: ${REEL_PLATFORMS.join(', ')})`);
    err.status = 409;
    throw err;
  }

  const results = [];
  for (const platform of targets) {
    const out = await adapters[platform](post, credsBy[platform] || {}, videoUrl);
    results.push({ platform, ...out });
  }

  const anyOk = results.some((r) => r.ok);
  if (!anyOk) return { skipped: false, published: false, results };

  const reel = {
    videoUrl,
    publishedAt: new Date().toISOString(),
    results,
  };
  await post.update({ data: { ...(post.data || {}), reel } });

  for (const r of results) {
    const ch = rows.find((x) => x.platform === r.platform);
    if (!ch) continue;
    await ch.update({
      lastError: r.ok ? null : r.error,
      lastPublishedAt: r.ok ? new Date() : ch.lastPublishedAt,
    });
  }

  return { skipped: false, published: true, reel };
}

module.exports = { publishReel, REEL_PLATFORMS };
