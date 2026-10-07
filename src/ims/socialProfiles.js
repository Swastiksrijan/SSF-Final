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
        en: 'Page → About → Page transparency shows the Page ID',
        hi: 'Page → About → Page transparency में Page ID दिखता है',
      },
      accessToken: {
        en: 'developers.facebook.com → Graph API Explorer → generate a Page token',
        hi: 'developers.facebook.com → Graph API Explorer से Page token बनाएँ',
      },
    },
  },
  instagram: {
    profileUrl: CONTACT_INFO.social.instagram,
    idHint: {
      igUserId: {
        en: 'Instagram Business account id (via the linked Facebook Page)',
        hi: 'Instagram Business account की id (जुड़े Facebook Page से)',
      },
      accessToken: {
        en: 'Same Facebook app token used for the Page',
        hi: 'वही Facebook app token जो Page के लिए है',
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
        en: 'Company page URN, e.g. urn:li:organization:12345678',
        hi: 'Company page URN, जैसे urn:li:organization:12345678',
      },
      accessToken: {
        en: 'LinkedIn Developer app → OAuth token with w_organization_social',
        hi: 'LinkedIn Developer app → w_organization_social वाला token',
      },
    },
  },
  whatsapp: {
    profileUrl: CONTACT_INFO.social.whatsapp,
    channelUrl: CONTACT_INFO.social.whatsappChannel,
    idHint: {
      phoneNumberId: {
        en: 'Meta WhatsApp Cloud API → Phone number ID',
        hi: 'Meta WhatsApp Cloud API → Phone number ID',
      },
      accessToken: {
        en: 'Meta WhatsApp Cloud API → permanent access token',
        hi: 'Meta WhatsApp Cloud API → permanent access token',
      },
      to: {
        en: 'Receiver number in full form, e.g. 919718346691',
        hi: 'पाने वाले का नंबर, जैसे 919718346691',
      },
    },
  },
  x: {
    profileUrl: CONTACT_INFO.social.twitter,
    idHint: {
      consumerKey: {
        en: 'developer.x.com → your App → Keys and tokens → API Key',
        hi: 'developer.x.com → App → Keys and tokens → API Key',
      },
      consumerSecret: {
        en: 'developer.x.com → API Key Secret',
        hi: 'developer.x.com → API Key Secret',
      },
      accessToken: {
        en: 'developer.x.com → Access Token (user context, write)',
        hi: 'developer.x.com → Access Token (user context, write)',
      },
      accessTokenSecret: {
        en: 'developer.x.com → Access Token Secret',
        hi: 'developer.x.com → Access Token Secret',
      },
    },
  },
  youtube: {
    profileUrl: CONTACT_INFO.social.youtube,
    idHint: {
      accessToken: {
        en: 'Google Cloud → YouTube Data API v3 → OAuth token with upload scope',
        hi: 'Google Cloud → YouTube Data API v3 → upload scope वाला OAuth token',
      },
    },
  },
};

// "Grab it from your website" shortcut: the public link to open for a platform.
export function profileUrlFor(platform) {
  return (SOCIAL_PROFILES[platform] && SOCIAL_PROFILES[platform].profileUrl) || '';
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
