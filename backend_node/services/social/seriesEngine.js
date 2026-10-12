// SSF Daily Awareness Series — generic chapter-by-chapter stream engine.
//
// A "series" is an ordered list of chapters (Samvidhan / Sarkari Yojana /
// Charak Samhita / GK / English word / Motivational …). Exactly ONE chapter per
// series is released per day, always the NEXT one, so a series can never jump or
// repeat — the same guarantee the course series already gives.
//
// Additive only: this engine never touches the existing awareness/festival or
// course posts. A series is enabled/disabled from config
// (`seriesEnabled: { <key>: true|false }`) so the whole stream can be paused
// without a code change. Every chapter is bilingual (EN + HI) and self-contained:
// hook -> key points -> example -> today's task -> tip -> caution.
//
// Provenance: content is composed from curated, reviewable templates and is
// labelled `contentSource: 'library'` — never "AI-generated".

const ORG = {
  name: 'Swastik Srijan Foundation',
  short: 'SSF',
  website: 'swastiksrijan.in',
  phone: '+91 97183 46691',
  baseHashtags: '#SwastikSrijan #SSF #NGO #SocialImpact #India',
};

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_HI = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Chapter constructor used by every stream file: keeps the authoring dense.
// `extra` is OPTIONAL and additive — a chapter can add a concrete "how to get the
// benefit" box (labh / koun patra / kagaz / kahan). Chapters that omit it render
// exactly as before, so this is backward compatible with every existing stream.
//   extra = { labh, who, docs, where }   (each a T(en, hi))
const CH = (title, hook, keyPoints, example, task, tip, avoid, extra) => ({ title, hook, keyPoints, example, task, tip, avoid, extra: extra || null });
const T = (en, hi) => ({ en, hi });

function seriesLabel(series, lang) {
  const t = lang === 'hi' ? series.title.hi : series.title.en;
  return t;
}

// Render ONE chapter of a series into a bilingual post plan, in the exact shape
// the image renderer + UI expect (title/subtitle/date/palette + bodyEn/bodyHi).
function buildSeriesPost(series, chapterNo, date, slot) {
  const items = series.items || [];
  const item = items[chapterNo - 1];
  if (!item) throw new Error(`buildSeriesPost: ${series.key} has no chapter ${chapterNo} (of ${items.length})`);
  const total = items.length;
  const dateEn = `${date.getDate()} ${MONTHS_EN[date.getMonth()]} ${date.getFullYear()}`;
  const dateHi = `${date.getDate()} ${MONTHS_HI[date.getMonth()]} ${date.getFullYear()}`;
  const tags = `${ORG.baseHashtags} #${series.category} #${series.key.replace(/[^A-Za-z0-9]/g, '')}`.replace(/\s+/g, ' ');
  const headerEn = `${series.emoji} ${series.title.en} — ${chapterNo}/${total}`;
  const headerHi = `${series.emoji} ${series.title.hi} — ${chapterNo}/${total}`;
  const pointsEn = item.keyPoints.map((p) => `• ${p.en}`).join('\n');
  const pointsHi = item.keyPoints.map((p) => `• ${p.hi}`).join('\n');

  const next = chapterNo < total ? items[chapterNo] : null;
  const nextEn = next
    ? `➡️ Next: ${chapterNo + 1}/${total} — "${next.title.en}" (tomorrow)`
    : `➡️ This series is complete. Watch for the next series from SSF.`;
  const nextHi = next
    ? `➡️ अगला: ${chapterNo + 1}/${total} — "${next.title.hi}" (कल)`
    : `➡️ यह शृंखला पूरी हुई। SSF की अगली शृंखला देखते रहें।`;

  const note = (item.note ? item.note : series.note) || '';

  // Optional "how to actually get the benefit" box. Only rendered when present.
  const x = item.extra;
  const labhEn = x ? [
    '🎯 लाभ / What you get:',
    `• ${x.labh.en}`,
    '👤 Who is eligible:',
    `• ${x.who.en}`,
    '📄 Documents:',
    `• ${x.docs.en}`,
    '🏢 Where to apply (free):',
    `• ${x.where.en}`,
  ].join('\n') : '';
  const labhHi = x ? [
    '🎯 लाभ — आपको क्या मिलेगा:',
    `• ${x.labh.hi}`,
    '👤 कौन पात्र है:',
    `• ${x.who.hi}`,
    '📄 कागज़ात:',
    `• ${x.docs.hi}`,
    '🏢 कहाँ आवेदन करें (निःशुल्क):',
    `• ${x.where.hi}`,
  ].join('\n') : '';

  const blocksEn = [
    headerEn, '', `📖 ${item.title.en}`, item.hook.en, '',
    labhEn ? labhEn : '',
    '🔑 Key points:', pointsEn, '',
    `🔎 Example: ${item.example.en}`, '',
    `✅ Today's task: ${item.task.en}`,
    `💡 Tip: ${item.tip.en}`,
    `⚠️ Caution: ${item.avoid.en}`, '',
    note ? `ℹ️ ${note}` : '',
    nextEn, '',
    `🌐 ${ORG.website}  |  📞 ${ORG.phone}`, tags,
  ];
  const blocksHi = [
    headerHi, '', `📖 ${item.title.hi}`, item.hook.hi, '',
    labhHi ? labhHi : '',
    '🔑 मुख्य बातें:', pointsHi, '',
    `🔎 उदाहरण: ${item.example.hi}`, '',
    `✅ आज का काम: ${item.task.hi}`,
    `💡 टिप: ${item.tip.hi}`,
    `⚠️ सावधानी: ${item.avoid.hi}`, '',
    note ? `ℹ️ ${note}` : '',
    nextHi, '',
    `🌐 ${ORG.website}  |  📞 ${ORG.phone}`, tags,
  ];
  const bodyEn = blocksEn.filter((b) => b).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const bodyHi = blocksHi.filter((b) => b).join('\n').replace(/\n{3,}/g, '\n\n').trim();

  return {
    postDate: ymd(date), slot, category: series.category, kind: 'series',
    seriesKey: series.key, chapterNo, chapterTotal: total,
    topicKey: `series-${series.key}-${chapterNo}`,
    titleEn: item.title.en, titleHi: item.title.hi,
    bodyEn, bodyHi, hashtags: tags,
    headingEn: `${chapterNo}/${total} · ${item.title.en}`, headingHi: `${chapterNo}/${total} · ${item.title.hi}`,
    subtitleEn: series.title.en, subtitleHi: series.title.hi,
    exampleEn: item.example.en, exampleHi: item.example.hi,
    takeawayEn: item.task.en, takeawayHi: item.task.hi,
    ctaEn: series.cta ? series.cta.en : 'Learn, share, and help someone benefit.',
    ctaHi: series.cta ? series.cta.hi : 'सीखें, बाँटें और किसी को लाभ पहुँचाएँ।',
    catLabelEn: series.title.en, catLabelHi: series.title.hi,
    contentSource: 'library', contentVerified: series.verified || '2026-01',
    dateEn, dateHi,
    imageUrl: `${(process.env.PUBLIC_BASE_URL || 'https://ngo-backend-03hq.onrender.com').replace(/\/$/, '')}/api/social/image/daily?date=${ymd(date)}&slot=${slot}&format=png`,
  };
}

// Advance a series pointer only after a chapter has actually been published, so
// a draft that is never published does not skip the next chapter.
async function advanceSeriesProgress(models, post) {
  const data = post.data || {};
  const kind = post.kind || data.kind;
  if (kind !== 'series' || !data.seriesKey || !data.chapterNo) return;
  const { SocialSeriesProgress } = models;
  let prog = await SocialSeriesProgress.findOne({ where: { seriesKey: data.seriesKey } });
  if (!prog) {
    try { prog = await SocialSeriesProgress.create({ seriesKey: data.seriesKey, lastChapter: 0 }); }
    catch { prog = await SocialSeriesProgress.findOne({ where: { seriesKey: data.seriesKey } }); }
  }
  if (prog && Number(data.chapterNo) > Number(prog.lastChapter || 0)) {
    const total = Number(data.chapterTotal || 0);
    await prog.update({
      lastChapter: Number(data.chapterNo),
      lastPostDate: post.postDate,
      completedAt: total && Number(data.chapterNo) >= total ? new Date() : prog.completedAt,
    });
  }
}

module.exports = { ORG, CH, T, MONTHS_EN, MONTHS_HI, ymd, pad, buildSeriesPost, advanceSeriesProgress, seriesLabel };
