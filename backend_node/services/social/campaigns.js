// Rotating, share-ready SSF campaign posts for the existing Social Publisher.
// Posts are invitations to support registered objective areas, not claims that
// a project is currently running or that beneficiaries/results have been verified.
const { SocialPost } = require('../../models/social');

const CAMPAIGNS = [
  { id: 'education', en: 'Education & Digital Learning', hi: 'शिक्षा एवं डिजिटल शिक्षा', appeal: 'Help expand access to learning resources, computer education and study support.', appealHi: 'शिक्षण सामग्री, कंप्यूटर शिक्षा और अध्ययन सहयोग तक पहुँच बढ़ाने में साथ दें।', tags: '#Education #DigitalIndia #LearningForAll' },
  { id: 'skills', en: 'Skill Development & Livelihood', hi: 'कौशल एवं आजीविका विकास', appeal: 'Support skill-building, vocational learning and dignified livelihood opportunities.', appealHi: 'कौशल प्रशिक्षण, व्यावसायिक शिक्षा और सम्मानजनक आजीविका के अवसरों का साथ दें।', tags: '#SkillDevelopment #Livelihood #SelfReliance' },
  { id: 'women-child', en: 'Women & Child Development', hi: 'महिला एवं बाल विकास', appeal: 'Stand with initiatives for women’s empowerment, child learning and wellbeing.', appealHi: 'महिला सशक्तिकरण, बाल शिक्षा और बेहतर पोषण एवं कल्याण के प्रयासों से जुड़ें।', tags: '#WomenEmpowerment #ChildDevelopment' },
  { id: 'health', en: 'Health & Well-being', hi: 'स्वास्थ्य एवं कल्याण', appeal: 'Help promote health awareness, nutrition, prevention and community wellbeing.', appealHi: 'स्वास्थ्य जागरूकता, पोषण, बचाव और सामुदायिक कल्याण को बढ़ावा देने में सहयोग करें।', tags: '#HealthAwareness #Wellbeing #Nutrition' },
  { id: 'environment', en: 'Environment & Conservation', hi: 'पर्यावरण एवं संरक्षण', appeal: 'Support awareness and community action for trees, biodiversity, water and clean surroundings.', appealHi: 'वृक्ष, जैव विविधता, जल संरक्षण और स्वच्छ परिवेश के लिए जागरूकता एवं सामुदायिक प्रयासों का साथ दें।', tags: '#Environment #WaterConservation #Biodiversity' },
  { id: 'agriculture', en: 'Agriculture & Rural Development', hi: 'कृषि एवं ग्रामीण विकास', appeal: 'Encourage sustainable farming, farmer learning and locally rooted rural livelihoods.', appealHi: 'टिकाऊ खेती, किसान प्रशिक्षण और स्थानीय ग्रामीण आजीविका के अवसरों को प्रोत्साहित करें।', tags: '#RuralDevelopment #Agriculture #Farmers' },
  { id: 'social-justice', en: 'Social Justice & Awareness', hi: 'सामाजिक न्याय एवं जागरूकता', appeal: 'Promote informed citizenship, equality, social harmony and rights awareness.', appealHi: 'जागरूक नागरिकता, समानता, सामाजिक सद्भाव और अधिकारों की जानकारी को आगे बढ़ाएँ।', tags: '#SocialJustice #Awareness #Equality' },
  { id: 'disability-rehabilitation', en: 'Disability, Elderly & Rehabilitation', hi: 'दिव्यांग, वृद्धजन एवं पुनर्वास', appeal: 'Support dignity, inclusion, accessibility and rehabilitation-focused community efforts.', appealHi: 'सम्मान, समावेशन, सुगम्यता और पुनर्वास-केंद्रित सामुदायिक प्रयासों का साथ दें।', tags: '#Inclusion #Accessibility #ElderCare' },
  { id: 'animal-protection', en: 'Animal & Bird Protection', hi: 'पशु-पक्षी संरक्षण', appeal: 'Encourage compassion, responsible care and awareness for animals and birds.', appealHi: 'पशु-पक्षियों के प्रति संवेदना, जिम्मेदार देखभाल और संरक्षण जागरूकता को बढ़ावा दें।', tags: '#AnimalWelfare #BirdProtection #Compassion' },
  { id: 'religious-cultural', en: 'Culture, Values & Harmony', hi: 'संस्कृति, मूल्य एवं सद्भाव', appeal: 'Help preserve learning, cultural expression, shared values and social harmony.', appealHi: 'शिक्षा, सांस्कृतिक अभिव्यक्ति, साझा मूल्यों और सामाजिक सद्भाव को आगे बढ़ाने में सहयोग करें।', tags: '#Culture #Values #Harmony' },
];

const WEBSITE = 'https://swastiksrijan.in';
const DONATE = 'https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view';

function localDateParts(date, tz) {
  const p = {};
  for (const part of new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)) p[part.type] = part.value;
  return { y: Number(p.year), m: Number(p.month), d: Number(p.day) };
}

async function planCampaignPost(date = new Date()) {
  const tz = process.env.SOCIAL_TZ || 'Asia/Kolkata';
  const { y, m, d } = localDateParts(date, tz);
  const localDay = new Date(Date.UTC(y, m - 1, d));
  const weekday = localDay.getUTCDay();
  // Three campaign appeals each week (Mon/Wed/Fri), avoiding an excessive feed.
  if (![1, 3, 5].includes(weekday)) return [];
  const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const existing = await SocialPost.findOne({ where: { postDate: dateKey, kind: 'campaign' } });
  if (existing) return [];
  const dayIndex = Math.floor(localDay.getTime() / 86400000);
  const campaign = CAMPAIGNS[Math.floor(dayIndex / 2) % CAMPAIGNS.length];
  const pageUrl = `${WEBSITE}/Campaigns#${campaign.id}`;
  const titleEn = `SSF Campaign: ${campaign.en}`;
  const titleHi = `स्वस्तिक सृजन फाउंडेशन: ${campaign.hi}`;
  const bodyEn = [
    '🤝 Join Swastik Srijan Foundation Samiti in supporting this objective area.',
    campaign.en,
    campaign.appeal,
    'This is an appeal around the organisation’s stated objectives. Activities will begin according to verified community needs, available resources and applicable permissions.',
    `Explore: ${pageUrl}`,
    `Support: ${DONATE}`,
    campaign.tags,
    '#SwastikSrijan #SSF',
  ].join('\n\n');
  const bodyHi = [
    '🤝 स्वस्तिक सृजन फाउंडेशन समिति के इस उद्देश्य-क्षेत्र से जुड़ें।',
    campaign.hi,
    campaign.appealHi,
    'यह संस्था के घोषित उद्देश्यों से जुड़ा सहयोग आमंत्रण है। गतिविधियाँ सत्यापित सामुदायिक आवश्यकताओं, उपलब्ध संसाधनों और आवश्यक अनुमतियों के अनुसार शुरू होंगी।',
    `अभियान देखें: ${pageUrl}`,
    `सहयोग करें: ${DONATE}`,
    campaign.tags,
    '#SwastikSrijan #SSF',
  ].join('\n\n');
  const seq = Number((await require('./publisher').getConfig('post_seq', 0)) || 0) + 1;
  await require('./publisher').setConfig('post_seq', seq);
  const post = await SocialPost.create({
    postRef: `CAMPAIGN-${y}-${String(seq).padStart(4, '0')}`,
    postDate: dateKey,
    slot: `campaign-${campaign.id}`,
    topicKey: `campaign-${campaign.id}`,
    category: 'campaign',
    titleEn,
    titleHi,
    bodyEn,
    bodyHi,
    hashtags: campaign.tags,
    imageUrl: `${WEBSITE}/images/real/community-education-meeting.jpg`,
    kind: 'campaign',
    status: 'draft',
    scheduledFor: new Date(Date.UTC(y, m - 1, d, 7, 0, 0)),
    createdBy: 'campaign-scheduler',
  });
  return [post];
}

module.exports = { planCampaignPost, CAMPAIGNS };
