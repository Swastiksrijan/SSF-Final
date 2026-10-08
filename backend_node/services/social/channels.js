// SSF Social Publisher — channel adapters.
// One function per platform. Each returns {platform, ok, url, error}. Missing
// credentials are reported as {ok:false, error:'not_connected'} instead of
// throwing, so a post can succeed on the channels that ARE connected while the
// rest wait for tokens. Uses global fetch (Node 18+).
//
// Token/credential keys expected inside SocialChannel.credentials:
//   telegram : { botToken, chatId }
//   facebook : { pageId, accessToken }
//   instagram: { igUserId, accessToken }
//   linkedin : { authorUrn, accessToken }
//   whatsapp : { phoneNumberId, accessToken, to }
//   youtube  : { accessToken }  (upload scope) — auto publish when provided
//   x        : { accessToken }  (X API v2 + OAuth1) — auto publish when provided

const GRAPH = 'https://graph.facebook.com/v21.0';
const crypto = require('crypto');
const { postPng, site: SITE } = require('./image');
const { ORG } = require('./content');

// ---- OAuth 1.0a (X / Twitter) ---------------------------------------------
// X requires user-context OAuth 1.0a for posting; OAuth2 app tokens are read-only.
const pct = (s) => encodeURIComponent(String(s)).replace(/[!*'()]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());

function oauth1Header({ method, url, params, consumerKey, consumerSecret, token, tokenSecret }) {
  const oauth = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: token,
    oauth_version: '1.0',
  };
  const all = { ...params, ...oauth };
  const paramStr = Object.keys(all).sort().map((k) => `${pct(k)}=${pct(all[k])}`).join('&');
  const base = `${method.toUpperCase()}&${pct(url)}&${pct(paramStr)}`;
  const key = `${pct(consumerSecret)}&${pct(tokenSecret)}`;
  oauth.oauth_signature = crypto.createHmac('sha1', key).update(base).digest('base64');
  return 'OAuth ' + Object.keys(oauth).sort().map((k) => `${pct(k)}="${pct(oauth[k])}"`).join(', ');
}

// Rasterize a post to PNG; null when the rasterizer is unavailable.
async function safePng(post) {
  try { return await postPng(post); } catch { return null; }
}

// Turn a short-lived Facebook user token into a NON-EXPIRING Page token.
//
// A token from Graph API Explorer (or a Login flow) dies within ~1-2 hours, so
// scheduled posts silently 401 later. Exchanging it for a long-lived user token
// and then reading the Page's own token yields a Page token with no expiry, which
// is what the publisher must store. Requires the app's own App ID + App Secret.
async function exchangeFacebookToken({ appId, appSecret, shortToken }) {
  if (!appId || !appSecret || !shortToken) {
    return { ok: false, error: 'missing_inputs', hint: 'App ID, App Secret and a short-lived user token are all required.' };
  }
  const qs = (o) => new URLSearchParams(o).toString();
  try {
    // 1) short-lived user token -> long-lived user token (~60 days)
    let res = await fetch(`${GRAPH}/oauth/access_token?${qs({
      grant_type: 'fb_exchange_token', client_id: appId, client_secret: appSecret, fb_exchange_token: shortToken,
    })}`);
    let data = await res.json().catch(() => null);
    if (!res.ok || !data || !data.access_token) throw new Error((data && data.error && data.error.message) || `HTTP ${res.status}`);
    const longUser = data.access_token;
    // 2) the Pages this user administers, each with its own token
    res = await fetch(`${GRAPH}/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(longUser)}`);
    data = await res.json().catch(() => null);
    if (!res.ok) throw new Error((data && data.error && data.error.message) || `HTTP ${res.status}`);
    const pages = (data && data.data ? data.data : []).map((p) => ({ id: p.id, name: p.name, accessToken: p.access_token }));
    if (!pages.length) {
      return { ok: false, error: 'no_pages', hint: 'This token manages no Pages. Generate it while logged in as a Page admin.' };
    }
    // A Page token derived from a long-lived user token does not expire.
    // Prove it with debug_token so the admin can SEE "never expires" (0) rather
    // than trusting the exchange. `data_access_expires_at` is the separate
    // data-access window and is intentionally ignored here.
    const first = pages[0];
    let expiresAt = 0;
    try {
      const appToken = `${appId}|${appSecret}`;
      const dbg = await fetch(`${GRAPH}/debug_token?input_token=${encodeURIComponent(first.accessToken)}&access_token=${encodeURIComponent(appToken)}`);
      const djson = await dbg.json().catch(() => null);
      if (djson && djson.data && typeof djson.data.expires_at === 'number') expiresAt = djson.data.expires_at;
    } catch { /* expiry is best-effort; the token still works */ }
    return { ok: true, pages, pageId: first.id, accessToken: first.accessToken, expiresAt };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Bilingual caption used for image posts and plain-text fallbacks. A bare URL
// is appended so the post's "Join Us" button has somewhere to go on platforms
// that only expose the caption (Facebook/Telegram linkify it automatically).
function caption(post) {
  return `${post.bodyEn}\n\n————\n${post.bodyHi}\n\n${SITE}`;
}

async function multipartCall(url, fields) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    if (v && typeof v === 'object' && v.blob) form.append(k, v.blob, v.filename || 'file');
    else if (v != null) form.append(k, String(v));
  }
  const res = await fetch(url, { method: 'POST', body: form });
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok) {
    const msg = (data && (data.description || data.error?.message || data.message)) || `HTTP ${res.status}`;
    const err = new Error(msg); err.status = res.status; throw err;
  }
  return data || {};
}

async function jsonCall(url, { method = 'POST', headers = {}, body } = {}) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok) {
    const msg = (data && (data.error?.message || data.error_description || data.message)) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data || {};
}

async function formCall(url, form) {
  const params = new URLSearchParams(form);
  const res = await fetch(url, { method: 'POST', body: params });
  let data = null;
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok) {
    const msg = (data && (data.description || data.error?.message || data.error_description)) || `HTTP ${res.status}`;
    const err = new Error(msg); err.status = res.status; throw err;
  }
  return data || {};
}

const pick = (o, k) => (o && o[k]) || '';
const missing = (name) => ({ ok: false, error: 'not_connected', hint: `${name} credentials missing` });

// ---- website (always available) -------------------------------------------
async function publishWebsite(post) {
  // The website "blog" is rendered from the SocialPost table itself, so this is
  // always considered connected. The admin screen lists these as site posts.
  return { ok: true, url: `https://swastiksrijan.in/Blog#social-${post.postDate}-${post.slot}` };
}

// ---- Telegram --------------------------------------------------------------
async function publishTelegram(post, creds) {
  const token = pick(creds, 'botToken');
  const chatId = pick(creds, 'chatId');
  if (!token || !chatId) return missing('Telegram');
  const text = caption(post);
  const publicBase = process.env.PUBLIC_BASE_URL || '';
  try {
    // Prefer an uploaded PNG so the post always carries the branded visual.
    const png = await safePng(post);
    if (png) {
      const out = await multipartCall(`https://api.telegram.org/bot${token}/sendPhoto`, {
        chat_id: chatId, caption: text.slice(0, 1024),
        photo: { blob: new Blob([png], { type: 'image/png' }), filename: 'ssf-post.png' },
      });
      return { ok: true, url: out?.result?.message_id ? `https://t.me/c/${chatId}/${out.result.message_id}` : null };
    }
    if (publicBase) {
      const photo = `${publicBase.replace(/\/$/, '')}${post.imageUrl}`;
      const out = await jsonCall(`https://api.telegram.org/bot${token}/sendPhoto`, {
        body: { chat_id: chatId, photo, caption: text.slice(0, 1024) },
      });
      return { ok: true, url: out?.result?.message_id ? `https://t.me/c/${chatId}/${out.result.message_id}` : null };
    }
    const out = await jsonCall(`https://api.telegram.org/bot${token}/sendMessage`, {
      body: { chat_id: chatId, text, disable_web_page_preview: false },
    });
    return { ok: true, url: out?.result?.message_id ? `https://t.me/c/${chatId}/${out.result.message_id}` : null };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ---- Facebook Page ---------------------------------------------------------
async function publishFacebook(post, creds) {
  const pageId = pick(creds, 'pageId');
  const token = pick(creds, 'accessToken');
  if (!pageId || !token) return missing('Facebook');
  const publicBase = process.env.PUBLIC_BASE_URL || '';
  try {
    // Upload the PNG directly (no public URL needed).
    const png = await safePng(post);
    if (png) {
      const out = await multipartCall(`${GRAPH}/${pageId}/photos`, {
        message: caption(post),
        access_token: token,
        source: { blob: new Blob([png], { type: 'image/png' }), filename: 'ssf-post.png' },
      });
      const id = out?.post_id || out?.id;
      return { ok: true, url: id ? `https://facebook.com/${pageId}/posts/${String(id).split('_').pop()}` : null };
    }
    if (publicBase) {
      const out = await formCall(`${GRAPH}/${pageId}/photos`, {
        url: `${publicBase.replace(/\/$/, '')}${post.imageUrl}`,
        message: caption(post),
        caption: caption(post),
        access_token: token,
      });
      const id = out?.post_id || out?.id;
      return { ok: true, url: id ? `https://facebook.com/${pageId}/posts/${String(id).split('_').pop()}` : null };
    }
    const out = await formCall(`${GRAPH}/${pageId}/feed`, { message: caption(post), access_token: token });
    return { ok: true, url: out?.id ? `https://facebook.com/${out.id}` : null };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ---- Instagram (Business) --------------------------------------------------
async function publishInstagram(post, creds) {
  const igUserId = pick(creds, 'igUserId');
  const token = pick(creds, 'accessToken');
  if (!igUserId || !token) return missing('Instagram');
  // Instagram fetches the image itself, so it must be a public URL.
  let img = pick(post, 'imageUrl');
  if (img && !/^https?:\/\//i.test(img)) {
    img = `${(process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '')}${img}`;
  }
  if (!img) return { ok: false, error: 'public_image_url_unavailable' };
  try {
    const container = await formCall(`${GRAPH}/${igUserId}/media`, { image_url: img, caption: caption(post), access_token: token });
    const created = container?.id;
    if (!created) return { ok: false, error: 'container_failed' };
    const out = await formCall(`${GRAPH}/${igUserId}/media_publish`, { creation_id: created, access_token: token });
    return { ok: true, url: out?.id ? `https://instagram.com/p/${out.id}` : null };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ---- LinkedIn --------------------------------------------------------------
// Uploads the generated PNG as a LinkedIn image asset, then posts it with the
// bilingual caption. Falls back to a text-only post if the upload fails.
async function publishLinkedIn(post, creds) {
  const author = pick(creds, 'authorUrn');
  const token = pick(creds, 'accessToken');
  if (!author || !token) return missing('LinkedIn');
  const headers = { Authorization: `Bearer ${token}`, 'LinkedIn-Version': '202405', 'X-Restli-Protocol-Version': '2.0.0' };
  try {
    const body = {
      author,
      commentary: caption(post),
      visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    };

    const png = await safePng(post);
    if (png) {
      const init = await jsonCall('https://api.linkedin.com/rest/images?action=initializeUpload', {
        headers, body: { initializeUploadRequest: { owner: author } },
      });
      const uploadUrl = init?.value?.uploadUrl;
      const imageUrn = init?.value?.image;
      if (uploadUrl && imageUrn) {
        const up = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/octet-stream' },
          body: png,
        });
        if (up.ok) body.content = { media: { id: imageUrn, title: post.titleEn || 'SSF' } };
      }
    }

    const out = await jsonCall('https://api.linkedin.com/rest/posts', { headers, body });
    return { ok: true, url: out?.id ? `https://www.linkedin.com/feed/update/${out.id}` : null };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ---- WhatsApp Cloud API ----------------------------------------------------
async function publishWhatsApp(post, creds) {
  const phoneNumberId = pick(creds, 'phoneNumberId');
  const token = pick(creds, 'accessToken');
  const to = pick(creds, 'to');
  if (!phoneNumberId || !token || !to) return missing('WhatsApp');
  try {
    const out = await jsonCall(`${GRAPH}/${phoneNumberId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
      body: { messaging_product: 'whatsapp', to, type: 'text', text: { body: post.bodyEn } },
    });
    return { ok: true, url: out?.messages?.[0]?.id ? `wa://${to}` : null };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ---- YouTube (Community post via Data API is limited) ----------------------
async function publishYouTube(post, creds) {
  const token = pick(creds, 'accessToken');
  if (!token) return missing('YouTube');
  // Community posts are not exposed by the public YouTube Data API; keep this a
  // clearly-reported no-op rather than a silent success.
  return { ok: false, error: 'youtube_community_api_unavailable', hint: 'Post manually; connect a video workflow to enable.' };
}

// ---- X (Twitter) -----------------------------------------------------------
// X posts need user-context OAuth 1.0a. Credentials (keys + user tokens) come
// from the X developer portal; the OAuth2 bearer token alone cannot post.
async function publishX(post, creds) {
  const consumerKey = pick(creds, 'consumerKey');
  const consumerSecret = pick(creds, 'consumerSecret');
  const token = pick(creds, 'accessToken');
  const tokenSecret = pick(creds, 'accessTokenSecret');
  // Backwards-compatible: an OAuth2 bearer token is accepted for read-only use,
  // but posting requires the OAuth 1.0a quadruple.
  if (!consumerKey || !consumerSecret || !token || !tokenSecret) return missing('X');
  const auth = (method, url, params) => oauth1Header({ method, url, params, consumerKey, consumerSecret, token, tokenSecret });
  const text = caption(post).slice(0, 280);
  try {
    const mediaIds = [];
    const png = await safePng(post);
    if (png) {
      const form = new FormData();
      form.append('media', new Blob([png], { type: 'image/png' }), 'ssf-post.png');
      const up = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
        method: 'POST',
        headers: { Authorization: auth('POST', 'https://upload.twitter.com/1.1/media/upload.json', {}) },
        body: form,
      });
      const upData = await up.json().catch(() => null);
      if (up.ok && upData?.media_id_string) mediaIds.push(upData.media_id_string);
    }
    const body = { text };
    if (mediaIds.length) body.media = { media_ids: mediaIds };
    const url = 'https://api.twitter.com/2/tweets';
    const out = await jsonCall(url, {
      headers: { Authorization: auth('POST', url, {}) },
      body,
    });
    return { ok: true, url: out?.data?.id ? `https://x.com/i/web/status/${out.data.id}` : null };
  } catch (e) { return { ok: false, error: e.message }; }
}

// Instagram Business account ids are painful to find by hand. The id lives on
// the linked Facebook Page, so with the Page token we already store we can read
// it directly: GET /{pageId}?fields=instagram_business_account.
async function resolveInstagramAccount({ pageId, accessToken }) {
  if (!pageId || !accessToken) return { ok: false, error: 'missing_inputs', hint: 'Connect Facebook first (its token also works for Instagram).' };
  try {
    const out = await jsonCall(`${GRAPH}/${pageId}?fields=instagram_business_account{id,username}&access_token=${encodeURIComponent(accessToken)}`, { method: 'GET' });
    const ig = out && out.instagram_business_account;
    if (!ig || !ig.id) {
      return { ok: false, error: 'no_linked_instagram', hint: 'Link an Instagram Business account to this Facebook Page, then retry.' };
    }
    return { ok: true, igUserId: ig.id, username: ig.username || null };
  } catch (e) { return { ok: false, error: e.message }; }
}

const ADAPTERS = {
  website: publishWebsite,
  telegram: publishTelegram,
  facebook: publishFacebook,
  instagram: publishInstagram,
  linkedin: publishLinkedIn,
  whatsapp: publishWhatsApp,
  youtube: publishYouTube,
  x: publishX,
};

// Send a small "it works" message so the admin can confirm the saved credentials
// are live without waiting for the next scheduled post. Only Telegram is wired
// today (it needs no public image and no review); other platforms report that a
// test is not available yet instead of failing silently.
async function testChannel(platform, creds) {
  if (platform === 'telegram') {
    const token = pick(creds, 'botToken');
    const chatId = pick(creds, 'chatId');
    if (!token || !chatId) return missing('Telegram');
    try {
      const out = await jsonCall(`https://api.telegram.org/bot${token}/sendMessage`, {
        body: {
          chat_id: chatId,
          text: '✅ SSF OneOffice — Telegram connected.\nAwareness posts will arrive here.\n\n✅ एसएसएफ वनऑफिस — टेलीग्राम जुड़ गया।\nजागरूकता पोस्ट यहाँ आएँगे।',
        },
      });
      return { ok: true, platform, url: out?.result?.message_id ? `https://t.me/c/${chatId}/${out.result.message_id}` : null };
    } catch (e) { return { ok: false, platform, error: e.message }; }
  }
  if (platform === 'facebook') {
    const pageId = pick(creds, 'pageId');
    const token = pick(creds, 'accessToken');
    if (!pageId || !token) return missing('Facebook');
    try {
      // Reading the page with the saved token proves both values work.
      const out = await jsonCall(`${GRAPH}/${pageId}?fields=name,id&access_token=${encodeURIComponent(token)}`, { method: 'GET' });
      return { ok: true, platform, page: out?.name || null, url: `https://facebook.com/${pageId}` };
    } catch (e) { return { ok: false, platform, error: e.message }; }
  }
  if (platform === 'instagram') {
    const igUserId = pick(creds, 'igUserId');
    const token = pick(creds, 'accessToken');
    if (!igUserId || !token) return missing('Instagram');
    try {
      const out = await jsonCall(`${GRAPH}/${igUserId}?fields=username,name&access_token=${encodeURIComponent(token)}`, { method: 'GET' });
      return { ok: true, platform, user: out?.username || out?.name || null, url: out?.username ? `https://instagram.com/${out.username}` : null };
    } catch (e) { return { ok: false, platform, error: e.message }; }
  }
  if (platform === 'whatsapp') {
    const phoneNumberId = pick(creds, 'phoneNumberId');
    const token = pick(creds, 'accessToken');
    if (!phoneNumberId || !token) return missing('WhatsApp');
    try {
      // Reading the phone number proves the id + token are valid.
      const out = await jsonCall(`${GRAPH}/${phoneNumberId}?fields=display_phone_number,verified_name&access_token=${encodeURIComponent(token)}`, { method: 'GET' });
      return { ok: true, platform, phone: out?.display_phone_number || null, name: out?.verified_name || null, url: `https://wa.me/${ORG.phone.replace(/\D/g, '')}` };
    } catch (e) { return { ok: false, platform, error: e.message }; }
  }
  if (platform === 'linkedin') {
    const authorUrn = pick(creds, 'authorUrn');
    const token = pick(creds, 'accessToken');
    if (!authorUrn || !token) return missing('LinkedIn');
    try {
      // Reading the organisation proves the URN + token are valid.
      const out = await jsonCall(`https://api.linkedin.com/rest/organizations/${String(authorUrn).split(':').pop()}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'LinkedIn-Version': '202405', 'X-Restli-Protocol-Version': '2.0.0' },
      });
      return { ok: true, platform, name: out?.localizedName || null, url: `https://www.linkedin.com/company/${String(authorUrn).split(':').pop()}` };
    } catch (e) { return { ok: false, platform, error: e.message }; }
  }
  if (platform === 'x') {
    const consumerKey = pick(creds, 'consumerKey');
    const consumerSecret = pick(creds, 'consumerSecret');
    const token = pick(creds, 'accessToken');
    const tokenSecret = pick(creds, 'accessTokenSecret');
    if (!consumerKey || !consumerSecret || !token || !tokenSecret) return missing('X');
    try {
      const url = 'https://api.twitter.com/2/users/me';
      const auth = oauth1Header({ method: 'GET', url, params: {}, consumerKey, consumerSecret, token, tokenSecret });
      const res = await fetch(url, { headers: { Authorization: auth } });
      const out = await res.json().catch(() => null);
      if (!res.ok) throw new Error(out?.detail || out?.title || `HTTP ${res.status}`);
      return { ok: true, platform, user: out?.data?.username || null, url: out?.data?.username ? `https://x.com/${out.data.username}` : null };
    } catch (e) { return { ok: false, platform, error: e.message }; }
  }
  return { ok: false, platform, error: 'test_not_available', hint: 'Save & connect, then publish a post to verify.' };
}

module.exports = { ADAPTERS, testChannel, exchangeFacebookToken, resolveInstagramAccount };
