// Single source of truth for the organisation's public social presence.
// The public website footer and the IMS "Awareness Publisher" both read this,
// so a link only ever has to be corrected in one place.
//
// `profileUrl` is the PUBLIC page/channel the admin can open to grab an ID.
// `idHint` says exactly which value from that page goes into each credential
// field, and where to find it — the small step that used to stall setup.
import { CONTACT_INFO } from '../config/contact';

export const SOCIAL_PROFILES = {
  website: {
    profileUrl: 'https://swastiksrijan.in',
    fields: {},
  },
  facebook: {
    profileUrl: CONTACT_INFO.social.facebook,
    idHint: {
      pageId: {
        en: 'Business Manager → System Users → assign the Page; the Page ID is under Page settings',
        hi: 'Business Manager → System Users → Page असाइन करें; Page ID, Page settings में मिलता है',
      },
      accessToken: {
        en: 'Use a Business Manager System User token with pages_manage_posts — it never expires (a plain Graph API Explorer token dies in ~1 hour).',
        hi: 'Business Manager System User token (pages_manage_posts) इस्तेमाल करें — यह कभी expire नहीं होता (Graph API Explorer का token ~1 घंटे में ख़त्म)।',
      },
    },
  },
  instagram: {
    profileUrl: CONTACT_INFO.social.instagram,
    idHint: {
      igUserId: {
        en: 'Tap "Detect Instagram id" below — it reads the id from your linked Facebook Page, no typing needed.',
        hi: 'नीचे "Instagram id अपने-आप लाएँ" दबाएँ — जुड़े Facebook Page से id खुद आ जाएगी, टाइप करने की ज़रूरत नहीं।',
      },
      accessToken: {
        en: 'Same Facebook Page token (Instagram Business uses the Page token).',
        hi: 'वही Facebook Page token (Instagram Business, Page token ही इस्तेमाल करता है)।',
      },
    },
  },
  telegram: {
    profileUrl: CONTACT_INFO.social.telegram,
    idHint: {
      botToken: {
        en: 'Open @BotFather in Telegram → /newbot → copy the token',
        hi: 'Telegram में @BotFather खोलें → /newbot → token कॉपी करें',
      },
      chatId: {
        en: 'Add the bot to your channel/group, then read it via @userinfobot',
        hi: 'bot को channel/group में जोड़ें, फिर @userinfobot से chat id लें',
      },
    },
  },
  linkedin: {
    profileUrl: CONTACT_INFO.social.linkedin,
    idHint: {
      authorUrn: {
        en: 'Company page URN, e.g. urn:li:organization:12345678 (the number is in your page admin URL).',
        hi: 'Company page URN, जैसे urn:li:organization:12345678 (नंबर आपके page admin URL में मिलता है)।',
      },
      accessToken: {
        en: 'linkedin.com/developers → your app → Auth → OAuth 2.0 token with scope w_organization_social (valid 60 days).',
        hi: 'linkedin.com/developers → app → Auth → OAuth 2.0 token, scope w_organization_social (60 दिन चलता है)।',
      },
    },
  },
  whatsapp: {
    profileUrl: CONTACT_INFO.social.whatsapp,
    channelUrl: CONTACT_INFO.social.whatsappChannel,
    idHint: {
      phoneNumberId: {
        en: 'developers.facebook.com app, WhatsApp, API Setup: the "Phone number ID" shown there.',
        hi: 'developers.facebook.com app, WhatsApp, API Setup: वहाँ दिखा "Phone number ID"।',
      },
      accessToken: {
        en: 'Same screen: the temporary token works for a test; for daily posts create a System User permanent token (WhatsApp, Configuration).',
        hi: 'उसी स्क्रीन पर: टेस्ट के लिए temporary token चलेगा; रोज़ के लिए System User permanent token बनाएँ (WhatsApp, Configuration)।',
      },
      to: {
        en: 'Receiver number with country code, e.g. 919718346691 (must be an opted-in test number until verified).',
        hi: 'पाने वाले का नंबर country code के साथ, जैसे 919718346691 (verify होने तक opted-in test number होना चाहिए)।',
      },
    },
  },
  x: {
    profileUrl: CONTACT_INFO.social.twitter,
    idHint: {
      consumerKey: {
        en: 'developer.x.com → your app → Keys and tokens → API Key (Consumer Key).',
        hi: 'developer.x.com → app → Keys and tokens → API Key (Consumer Key)।',
      },
      consumerSecret: {
        en: 'developer.x.com → same page → API Key Secret.',
        hi: 'developer.x.com → उसी पेज पर → API Key Secret।',
      },
      accessToken: {
        en: 'developer.x.com → same page → Access Token (user context, write).',
        hi: 'developer.x.com → उसी पेज पर → Access Token (user context, write)।',
      },
      accessTokenSecret: {
        en: 'developer.x.com → same page → Access Token Secret.',
        hi: 'developer.x.com → उसी पेज पर → Access Token Secret।',
      },
    },
  },
  youtube: {
    profileUrl: CONTACT_INFO.social.youtube,
    // Honest note: YouTube's public Data API cannot create community/feed posts,
    // so this channel is stored but cannot auto-publish an image today.
    note: {
      en: 'Heads-up: YouTube Data API v3 cannot create community posts, so the publisher cannot auto-post an image here. The channel is saved for reference; use the Open your page link to post manually. An upload workflow (video/Shorts) can be added later.',
      hi: 'ध्यान दें: YouTube Data API v3 से community post नहीं बनते, इसलिए publisher यहाँ image अपने-आप पोस्ट नहीं कर सकता। चैनल संदर्भ के लिए सेव रहेगा; मैन्युअल पोस्ट के लिए "आपका पेज खोलें" लिंक इस्तेमाल करें। आगे चाहें तो video/Shorts upload workflow जोड़ा जा सकता है।',
    },
    idHint: {
      accessToken: {
        en: 'Google Cloud → enable YouTube Data API v3 → OAuth 2.0 token with scope youtube.upload (only needed for a future video workflow).',
        hi: 'Google Cloud → YouTube Data API v3 enable करें → scope youtube.upload वाला OAuth 2.0 token (भविष्य के video workflow के लिए)।',
      },
    },
  },
};

// "Grab it from your website" shortcut: the public link to open for a platform.
export function profileUrlFor(platform) {
  return (SOCIAL_PROFILES[platform] && SOCIAL_PROFILES[platform].profileUrl) || '';
}

// Platform-level note (e.g. "this API cannot auto-post"), in the chosen language.
export function noteFor(platform, lang) {
  const n = SOCIAL_PROFILES[platform] && SOCIAL_PROFILES[platform].note;
  if (!n) return '';
  return lang === 'hi' ? n.hi : n.en;
}

// Human hint for one credential field, in the chosen language.
export function idHintFor(platform, field, lang) {
  const h = SOCIAL_PROFILES[platform] && SOCIAL_PROFILES[platform].idHint;
  if (!h || !h[field]) return '';
  return lang === 'hi' ? h[field].hi : h[field].en;
}

// Ready-to-paste caption for a post, in the chosen language.
export function captionFor(post, lang) {
  if (!post) return '';
  if (lang === 'hi') {
    const parts = [post.titleHi];
    if (post.subtitleHi) parts.push(post.subtitleHi);
    if (post.bodyHi) parts.push(post.bodyHi);
    if (post.takeawayHi) parts.push(`✅ ${post.takeawayHi}`);
    if (post.ctaHi) parts.push(`👉 ${post.ctaHi}`);
    if (post.hashtags) parts.push(post.hashtags);
    return parts.filter(Boolean).join('\n\n');
  }
  const parts = [post.titleEn];
  if (post.subtitleEn) parts.push(post.subtitleEn);
  if (post.bodyEn) parts.push(post.bodyEn);
  if (post.takeawayEn) parts.push(`✅ ${post.takeawayEn}`);
  if (post.ctaEn) parts.push(`👉 ${post.ctaEn}`);
  if (post.hashtags) parts.push(post.hashtags);
  return parts.filter(Boolean).join('\n\n');
}
