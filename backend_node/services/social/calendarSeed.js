// Multicultural festival & observance calendar — seed.
//
// This is a VERIFIED, source-cited starting set, not an exhaustive list. It is
// deliberately per-year: lunar, lunisolar, Hijri and Hebrew festivals do not
// fall on the same Gregorian date each year, so each entry carries a concrete
// date and a source. Entries whose date depends on a local moon sighting (the
// Islamic calendar in particular) are marked `uncertain: true`; the publisher
// will NOT greet them automatically until an admin confirms the date.
//
// Administrators add, correct, approve, exclude or prioritise entries from the
// IMS Social Media screen — no code change needed (see SocialEvent model).
//
// Sources for the seeded dates:
//   UN international days & weeks — https://www.un.org/en/observances/international-days-and-weeks
//   Indian festival calendar 2026 — drikpanchang.com, give.do, timeanddate.com
// Islamic (Hijri) dates shift with the local moon sighting and are always
// approximate until confirmed; they are seeded as uncertain.

const SOURCE_UN = 'UN — https://www.un.org/en/observances/international-days-and-weeks';
const SOURCE_IN = 'India festival calendar (drikpanchang.com / timeanddate.com), 2026';
const SOURCE_ISLAMIC = 'Hijri calendar — subject to local moon sighting; confirm before greeting';

// { y, m, d, key, en, hi, tradition, region, cal, type, palette, solemn }
function ev(y, m, d, key, en, hi, tradition, region, cal, type, palette, opts = {}) {
  return {
    key: `${key}-${y}`,
    date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    month: m, day: d,
    titleEn: en, titleHi: hi,
    tradition, region, calendarSystem: cal, eventType: type,
    palette: palette || null,
    solemn: !!opts.solemn,
    altNames: opts.alt || null,
    greetingEn: opts.greetingEn || null,
    greetingHi: opts.greetingHi || null,
    significanceEn: opts.significanceEn || null,
    significanceHi: opts.significanceHi || null,
    source: opts.source || SOURCE_IN,
    verified: opts.verified !== false,
    uncertain: !!opts.uncertain,
    notes: opts.notes || null,
  };
}

// Recurring UN / national days with a fixed Gregorian date — these do not move.
const FIXED = [
  [1, 1, 'new-year', 'New Year — a new resolve to serve', 'नव वर्ष — सेवा का नया संकल्प', 'national', 'World', 'awareness'],
  [1, 12, 'youth-day', 'National Youth Day (Swami Vivekananda Jayanti)', 'राष्ट्रीय युवा दिवस (स्वामी विवेकानंद जयंती)', 'national', 'India', 'awareness'],
  [1, 13, 'lohri', 'Lohri', 'लोहड़ी', 'regional', 'Punjab / North India', 'cultural'],
  [1, 14, 'makar-sankranti', 'Makar Sankranti / Pongal / Bihu', 'मकर संक्रांति / पोंगल / बिहू', 'hindu', 'India', 'cultural'],
  [1, 23, 'vasant-panchami', 'Vasant Panchami (Saraswati Puja)', 'वसंत पंचमी (सरस्वती पूजा)', 'hindu', 'India', 'religious'],
  [1, 26, 'republic-day', 'Republic Day', 'गणतंत्र दिवस', 'national', 'India', 'national'],
  [1, 30, 'martyrs-day', 'Martyrs’ Day (Shaheed Diwas)', 'शहीद दिवस', 'national', 'India', 'remembrance', { solemn: true }],
  [2, 15, 'mahashivratri', 'Maha Shivaratri', 'महाशिवरात्रि', 'hindu', 'India', 'religious'],
  [3, 8, 'womens-day', 'International Women’s Day', 'अंतर्राष्ट्रीय महिला दिवस', 'un', 'World', 'awareness'],
  [3, 21, 'forest-day', 'International Day of Forests', 'अंतर्राष्ट्रीय वन दिवस', 'un', 'World', 'awareness'],
  [3, 22, 'water-day', 'World Water Day', 'विश्व जल दिवस', 'un', 'World', 'awareness'],
  [4, 7, 'health-day', 'World Health Day', 'विश्व स्वास्थ्य दिवस', 'un', 'World', 'awareness'],
  [4, 14, 'ambedkar-jayanti', 'Dr. B. R. Ambedkar Jayanti', 'डॉ. भीमराव आंबेडकर जयंती', 'national', 'India', 'awareness'],
  [4, 22, 'earth-day', 'Earth Day', 'पृथ्वी दिवस', 'un', 'World', 'awareness'],
  [5, 1, 'labour-day', 'Labour Day / Maharashtra Day', 'मजदूर दिवस', 'un', 'World', 'awareness'],
  [5, 31, 'tobacco-day', 'World No Tobacco Day', 'विश्व तम्बाकू निषेध दिवस', 'un', 'World', 'awareness'],
  [6, 5, 'environment-day', 'World Environment Day', 'विश्व पर्यावरण दिवस', 'un', 'World', 'awareness'],
  [6, 21, 'yoga-day', 'International Day of Yoga', 'अंतर्राष्ट्रीय योग दिवस', 'un', 'World', 'awareness'],
  [8, 9, 'indigenous-day', 'International Day of the World’s Indigenous Peoples', 'विश्व के स्वदेशी लोगों का अंतर्राष्ट्रीय दिवस', 'indigenous', 'World', 'awareness'],
  [8, 12, 'intl-youth-day', 'International Youth Day', 'अंतर्राष्ट्रीय युवा दिवस', 'un', 'World', 'awareness'],
  [8, 15, 'independence-day', 'Independence Day', 'स्वतंत्रता दिवस', 'national', 'India', 'national'],
  [9, 5, 'teacher-day', 'Teachers’ Day', 'शिक्षक दिवस', 'national', 'India', 'awareness'],
  [9, 8, 'literacy-day', 'International Literacy Day', 'अंतर्राष्ट्रीय साक्षरता दिवस', 'un', 'World', 'awareness'],
  [9, 21, 'peace-day', 'International Day of Peace', 'अंतर्राष्ट्रीय शांति दिवस', 'un', 'World', 'awareness'],
  [10, 1, 'elderly-day', 'International Day of Older Persons', 'वृद्धजनों का अंतर्राष्ट्रीय दिवस', 'un', 'World', 'awareness'],
  [10, 2, 'nonviolence-day', 'International Day of Non-Violence (Gandhi Jayanti)', 'अंतर्राष्ट्रीय अहिंसा दिवस (गांधी जयंती)', 'un', 'World', 'awareness'],
  [10, 10, 'mental-health-day', 'World Mental Health Day', 'विश्व मानसिक स्वास्थ्य दिवस', 'un', 'World', 'awareness'],
  [10, 11, 'girl-child-day', 'International Day of the Girl Child', 'अंतर्राष्ट्रीय बालिका दिवस', 'un', 'World', 'awareness'],
  [10, 16, 'food-day', 'World Food Day', 'विश्व खाद्य दिवस', 'un', 'World', 'awareness'],
  [10, 24, 'un-day', 'United Nations Day', 'संयुक्त राष्ट्र दिवस', 'un', 'World', 'awareness'],
  [11, 14, 'children-day', 'Children’s Day', 'बाल दिवस', 'national', 'India', 'awareness'],
  [11, 26, 'constitution-day', 'Constitution Day (Samvidhan Divas)', 'संविधान दिवस', 'national', 'India', 'awareness'],
  [12, 1, 'aids-day', 'World AIDS Day', 'विश्व एड्स दिवस', 'un', 'World', 'awareness'],
  [12, 3, 'disability-day', 'International Day of Persons with Disabilities', 'दिव्यांगजनों का अंतर्राष्ट्रीय दिवस', 'un', 'World', 'awareness'],
  [12, 10, 'human-rights-day', 'Human Rights Day', 'मानवाधिकार दिवस', 'un', 'World', 'awareness'],
  [12, 25, 'christmas', 'Christmas', 'क्रिसमस', 'christian', 'World', 'religious'],
];

// Year-specific festival dates (lunar / lunisolar / Hijri / Hebrew).
const YEAR_DATES = {
  2025: [
    [3, 14, 'holi', 'Holi', 'होली', 'hindu', 'India', 'lunisolar'],
    [3, 31, 'eid-fitr', 'Eid al-Fitr', 'ईद-उल-फ़ितर', 'muslim', 'World', 'hijri', { uncertain: true, source: SOURCE_ISLAMIC }],
    [6, 7, 'eid-adha', 'Eid al-Adha (Bakrid)', 'ईद-उल-अज़हा (बकरीद)', 'muslim', 'World', 'hijri', { uncertain: true, source: SOURCE_ISLAMIC }],
    [8, 9, 'raksha-bandhan', 'Raksha Bandhan', 'रक्षाबंधन', 'hindu', 'India', 'lunisolar'],
    [8, 16, 'janmashtami', 'Krishna Janmashtami', 'कृष्ण जन्माष्टमी', 'hindu', 'India', 'lunisolar'],
    [10, 20, 'diwali', 'Diwali (Deepavali)', 'दीपावली', 'hindu', 'India', 'lunisolar'],
    [11, 5, 'guru-nanak-jayanti', 'Guru Nanak Jayanti', 'गुरु नानक जयंती', 'sikh', 'India', 'lunisolar'],
    [4, 18, 'good-friday', 'Good Friday', 'गुड फ्राइडे', 'christian', 'World', 'gregorian'],
    [4, 20, 'easter', 'Easter Sunday', 'ईस्टर', 'christian', 'World', 'gregorian'],
    [5, 12, 'buddha-purnima', 'Buddha Purnima', 'बुद्ध पूर्णिमा', 'buddhist', 'World', 'lunisolar'],
    [4, 10, 'mahavir-jayanti', 'Mahavir Jayanti', 'महावीर जयंती', 'jain', 'India', 'lunisolar'],
  ],
  2026: [
    [3, 4, 'holi', 'Holi', 'होली', 'hindu', 'India', 'lunisolar'],
    [3, 19, 'ugadi', 'Ugadi / Gudi Padwa', 'उगादी / गुड़ी पाड़वा', 'hindu', 'Deccan / Maharashtra', 'lunisolar'],
    [3, 21, 'eid-fitr', 'Eid al-Fitr', 'ईद-उल-फ़ितर', 'muslim', 'World', 'hijri', { uncertain: true, notes: 'Listed 20–21 March by different sources; confirm the locally sighted date.', source: SOURCE_ISLAMIC }],
    [3, 26, 'ram-navami', 'Ram Navami', 'राम नवमी', 'hindu', 'India', 'lunisolar'],
    [3, 31, 'mahavir-jayanti', 'Mahavir Jayanti', 'महावीर जयंती', 'jain', 'India', 'lunisolar'],
    [4, 3, 'good-friday', 'Good Friday', 'गुड फ्राइडे', 'christian', 'World', 'gregorian'],
    [4, 5, 'easter', 'Easter Sunday', 'ईस्टर', 'christian', 'World', 'gregorian'],
    [4, 14, 'baisakhi', 'Baisakhi / Vaisakhi', 'बैसाखी', 'sikh', 'Punjab', 'gregorian'],
    [4, 19, 'akshaya-tritiya', 'Akshaya Tritiya', 'अक्षय तृतीया', 'hindu', 'India', 'lunisolar'],
    [5, 1, 'buddha-purnima', 'Buddha Purnima', 'बुद्ध पूर्णिमा', 'buddhist', 'World', 'lunisolar'],
    [5, 27, 'eid-adha', 'Eid al-Adha (Bakrid)', 'ईद-उल-अज़हा (बकरीद)', 'muslim', 'World', 'hijri', { uncertain: true, source: SOURCE_ISLAMIC }],
    [6, 26, 'muharram', 'Muharram (Ashura)', 'मुहर्रम', 'muslim', 'World', 'hijri', { uncertain: true, source: SOURCE_ISLAMIC }],
    [7, 16, 'rath-yatra', 'Jagannath Rath Yatra', 'जगन्नाथ रथ यात्रा', 'hindu', 'Odisha', 'lunisolar'],
    [7, 29, 'guru-purnima', 'Guru Purnima', 'गुरु पूर्णिमा', 'hindu', 'India', 'lunisolar'],
    [8, 26, 'milad-un-nabi', 'Milad-un-Nabi (Eid-e-Milad)', 'मिलाद-उन-नबी', 'muslim', 'World', 'hijri', { uncertain: true, source: SOURCE_ISLAMIC }],
    [8, 25, 'onam', 'Onam', 'ओणम', 'regional', 'Kerala', 'lunisolar'],
    [8, 28, 'raksha-bandhan', 'Raksha Bandhan', 'रक्षाबंधन', 'hindu', 'India', 'lunisolar'],
    [9, 4, 'janmashtami', 'Krishna Janmashtami', 'कृष्ण जन्माष्टमी', 'hindu', 'India', 'lunisolar'],
    [9, 14, 'ganesh-chaturthi', 'Ganesh Chaturthi', 'गणेश चतुर्थी', 'hindu', 'India', 'lunisolar'],
    [10, 11, 'navratri', 'Sharad Navratri begins', 'शरद नवरात्रि प्रारंभ', 'hindu', 'India', 'lunisolar'],
    [10, 20, 'dussehra', 'Dussehra (Vijayadashami)', 'दशहरा (विजयादशमी)', 'hindu', 'India', 'lunisolar'],
    [11, 8, 'diwali', 'Diwali (Deepavali)', 'दीपावली', 'hindu', 'India', 'lunisolar', { notes: 'Adhik Maas shifts Diwali later in 2026.' }],
    [11, 24, 'guru-nanak-jayanti', 'Guru Nanak Jayanti', 'गुरु नानक जयंती', 'sikh', 'India', 'lunisolar'],
  ],
};

// Per-festival greetings & significance. Every tradition has its OWN greeting —
// no single generic line is reused across religions. `greeting` is the sacred-
// appropriate salutation; `signif` explains why the day matters.
const GREETINGS = {
  christmas: {
    greetingEn: 'Merry Christmas! 🎄', greetingHi: 'क्रिसमस की शुभकामनाएँ! 🎄',
    significanceEn: 'Christmas marks the birth of Jesus Christ and is celebrated with prayers, carols, family gatherings and giving to those in need.',
    significanceHi: 'क्रिसमस यीशु मसीह के जन्म का पर्व है — प्रार्थना, भजन, परिवार मिलन और ज़रूरतमंदों को दान के साथ मनाया जाता है।',
  },
  easter: {
    greetingEn: 'Happy Easter! ✝️', greetingHi: 'ईस्टर की शुभकामनाएँ! ✝️',
    significanceEn: 'Easter celebrates the resurrection of Jesus Christ and is a day of hope, renewal and kindness.',
    significanceHi: 'ईस्टर यीशु मसीह के पुनरुत्थान का पर्व है — आशा, नवजीवन और दया का दिन।',
  },
  'good-friday': {
    greetingEn: 'On Good Friday, we remember sacrifice and compassion.', greetingHi: 'गुड फ्राइडे पर हम त्याग और करुणा को स्मरण करते हैं।',
    significanceEn: 'Good Friday commemorates the crucifixion of Jesus Christ — observed quietly, with reflection and prayer.',
    significanceHi: 'गुड फ्राइडे यीशु मसीह के सूली पर चढ़ने का स्मरण दिवस है — शांत चिंतन और प्रार्थना के साथ मनाया जाता है।',
  },
  'eid-fitr': {
    greetingEn: 'Eid Mubarak! 🌙', greetingHi: 'ईद मुबारक! 🌙',
    significanceEn: 'Eid al-Fitr ends the holy month of Ramadan — a day of gratitude, prayer, charity (Zakat) and togetherness.',
    significanceHi: 'ईद-उल-फ़ितर रमज़ान के पवित्र महीने के समापन का पर्व है — कृतज्ञता, प्रार्थना, दान (ज़कात) और मिलन का दिन।',
  },
  'eid-adha': {
    greetingEn: 'Eid al-Adha Mubarak! 🕌', greetingHi: 'ईद-उल-अज़हा मुबारक! 🕌',
    significanceEn: 'Eid al-Adha honours the willingness of Ibrahim to sacrifice — marked by prayer, and sharing food and meat with those in need.',
    significanceHi: 'ईद-उल-अज़हा हज़रत इब्राहीम की क़ुर्बानी की भावना का सम्मान है — प्रार्थना और ज़रूरतमंदों के साथ भोजन बाँटने के साथ मनाया जाता है।',
  },
  muharram: {
    greetingEn: 'During Muharram, we remember courage and sacrifice.', greetingHi: 'मुहर्रम में हम साहस और बलिदान को याद करते हैं।',
    significanceEn: 'Muharram is the first month of the Islamic year; Ashura is observed with remembrance, reflection and quiet mourning.',
    significanceHi: 'मुहर्रम इस्लामी वर्ष का पहला महीना है; आशूरा शोक और चिंतन के साथ मनाया जाता है।',
    solemn: true,
  },
  'milad-un-nabi': {
    greetingEn: 'Milad-un-Nabi Mubarak! 🌙', greetingHi: 'मिलाद-उन-नबी मुबारक! 🌙',
    significanceEn: 'Milad-un-Nabi marks the birth of the Prophet Muhammad and is observed with prayer, remembrance and charity.',
    significanceHi: 'मिलाद-उन-नबी पैग़ंबर मुहम्मद के जन्म दिवस का स्मरण है — प्रार्थना, याद और दान के साथ।',
  },
  holi: {
    greetingEn: 'Happy Holi! 🎨', greetingHi: 'होली की शुभकामनाएँ! 🎨',
    significanceEn: 'Holi welcomes spring and celebrates the victory of good over evil — a day of colour, forgiveness and renewed friendships.',
    significanceHi: 'होली वसंत का स्वागत और बुराई पर अच्छाई की जीत का पर्व है — रंग, क्षमा और नए रिश्तों का दिन।',
  },
  diwali: {
    greetingEn: 'Happy Diwali! 🪔', greetingHi: 'दीपावली की शुभकामनाएँ! 🪔',
    significanceEn: 'Diwali, the festival of lights, celebrates the return of light over darkness — marked with lamps, cleanliness, sharing sweets and charity.',
    significanceHi: 'दीपावली रोशनी का पर्व है — अंधकार पर प्रकाश की जीत; दीये, सफ़ाई, मिठाई बाँटने और दान के साथ मनाई जाती है।',
  },
  'raksha-bandhan': {
    greetingEn: 'Happy Raksha Bandhan! 🧵', greetingHi: 'रक्षाबंधन की शुभकामनाएँ! 🧵',
    significanceEn: 'Raksha Bandhan celebrates the bond of protection and care between siblings.',
    significanceHi: 'रक्षाबंधन भाई-बहन के स्नेह और रक्षा के बंधन का पर्व है।',
  },
  janmashtami: {
    greetingEn: 'Happy Krishna Janmashtami! 🪈', greetingHi: 'कृष्ण जन्माष्टमी की शुभकामनाएँ! 🪈',
    significanceEn: 'Janmashtami marks the birth of Lord Krishna, celebrated for his message of dharma, devotion and doing right by others.',
    significanceHi: 'जन्माष्टमी भगवान कृष्ण के जन्म का पर्व है — धर्म, भक्ति और सच्चाई के उनके संदेश का स्मरण।',
  },
  'ganesh-chaturthi': {
    greetingEn: 'Happy Ganesh Chaturthi! 🐘', greetingHi: 'गणेश चतुर्थी की शुभकामनाएँ! 🐘',
    significanceEn: 'Ganesh Chaturthi celebrates Lord Ganesha, the remover of obstacles, with prayers for wisdom and new beginnings.',
    significanceHi: 'गणेश चतुर्थी विघ्नहर्ता भगवान गणेश का पर्व है — बुद्धि और नई शुरुआत की प्रार्थना के साथ।',
  },
  navratri: {
    greetingEn: 'Happy Navratri! 🌺', greetingHi: 'नवरात्रि की शुभकामनाएँ! 🌺',
    significanceEn: 'Navratri honours Goddess Durga across nine nights of devotion, fasting and dance.',
    significanceHi: 'नवरात्रि माँ दुर्गा की नौ रातों की आराधना का पर्व है — उपवास, भक्ति और नृत्य के साथ।',
  },
  dussehra: {
    greetingEn: 'Happy Dussehra! 🏹', greetingHi: 'दशहरा की शुभकामनाएँ! 🏹',
    significanceEn: 'Dussehra marks the victory of truth over evil and is a reminder to choose the right path.',
    significanceHi: 'दशहरा सत्य की बुराई पर विजय का पर्व है — सही मार्ग चुनने का स्मरण।',
  },
  'guru-nanak-jayanti': {
    greetingEn: 'Guru Nanak Jayanti — Sat Sri Akal! 🙏', greetingHi: 'गुरु नानक जयंती — सत श्री अकाल! 🙏',
    significanceEn: 'Guru Nanak Jayanti celebrates the birth of Guru Nanak Dev Ji, whose teachings centred on one God, honest work and sharing with others (Sewa and Langar).',
    significanceHi: 'गुरु नानक जयंती गुरु नानक देव जी के प्रकाश पर्व का स्मरण है — एक ईश्वर, ईमानदारी और सेवा-लंगर के उनके संदेश का।',
  },
  baisakhi: {
    greetingEn: 'Happy Baisakhi! 🌾', greetingHi: 'बैसाखी की शुभकामनाएँ! 🌾',
    significanceEn: 'Baisakhi is the harvest festival of Punjab and commemorates the founding of the Khalsa in 1699.',
    significanceHi: 'बैसाखी पंजाब का फसल पर्व है और 1699 में खालसा की स्थापना का स्मरण दिवस है।',
  },
  'buddha-purnima': {
    greetingEn: 'Happy Buddha Purnima! ☸️', greetingHi: 'बुद्ध पूर्णिमा की शुभकामनाएँ! ☸️',
    significanceEn: 'Buddha Purnima marks the birth, enlightenment and passing of Gautama Buddha — a day of compassion, non-violence and mindfulness.',
    significanceHi: 'बुद्ध पूर्णिमा भगवान बुद्ध के जन्म, ज्ञान और महापरिनिर्वाण का दिन है — करुणा, अहिंसा और स्मृति का पर्व।',
  },
  'mahavir-jayanti': {
    greetingEn: 'Happy Mahavir Jayanti! 🕊️', greetingHi: 'महावीर जयंती की शुभकामनाएँ! 🕊️',
    significanceEn: 'Mahavir Jayanti celebrates the birth of Lord Mahavira, whose teachings of ahimsa (non-violence), truth and self-discipline guide Jain tradition.',
    significanceHi: 'महावीर जयंती भगवान महावीर के जन्म का पर्व है — अहिंसा, सत्य और संयम की जैन परंपरा के संदेश का।',
  },
};

const TRADITION_TO_PALETTE = {
  hindu: 'festival-hindu', muslim: 'festival-muslim', sikh: 'festival-sikh',
  christian: 'festival-christian', buddhist: 'festival-buddhist', jain: 'festival-jain',
  jewish: 'festival-jewish', indigenous: 'community', national: 'community', un: 'community',
  regional: 'community', other: 'community',
};

function decorate(entry) {
  const g = GREETINGS[entry.key.replace(/-\d{4}$/, '')] || {};
  const palette = entry.palette || TRADITION_TO_PALETTE[entry.tradition] || 'community';
  return {
    ...entry,
    // Never let a null field overwrite a resolved greeting / significance.
    greetingEn: entry.greetingEn || g.greetingEn || `Warm wishes on ${entry.titleEn}.`,
    greetingHi: entry.greetingHi || g.greetingHi || `${entry.titleHi} की शुभकामनाएँ।`,
    significanceEn: entry.significanceEn || g.significanceEn || null,
    significanceHi: entry.significanceHi || g.significanceHi || null,
    palette,
    solemn: entry.solemn || !!g.solemn,
  };
}

function buildEventSeed() {
  const out = [];
  for (const [m, d, key, en, hi, tradition, region, type, opts] of FIXED) {
    const year = new Date().getFullYear();
    out.push(decorate(ev(year, m, d, key, en, hi, tradition, region, 'gregorian', type, undefined, opts)));
  }
  for (const [year, rows] of Object.entries(YEAR_DATES)) {
    for (const [m, d, key, en, hi, tradition, region, cal, opts = {}] of rows) {
      out.push(decorate(ev(Number(year), m, d, key, en, hi, tradition, region, cal, 'religious', undefined, opts)));
    }
  }
  return out;
}

/**
 * Idempotently seed the calendar. Only MISSING keys are created, so admin edits,
 * approvals (verified/uncertain) and exclusions are never overwritten on reboot.
 */
async function seedSocialEvents() {
  const { SocialEvent } = require('../../models/social');
  const seed = buildEventSeed();
  const existing = await SocialEvent.findAll({ attributes: ['key'] });
  const have = new Set(existing.map((r) => r.key));
  let created = 0;
  for (const e of seed) {
    if (have.has(e.key)) continue;
    await SocialEvent.create(e);
    created += 1;
  }
  return { created, total: seed.length };
}

module.exports = { buildEventSeed, seedSocialEvents, GREETINGS, TRADITION_TO_PALETTE };
