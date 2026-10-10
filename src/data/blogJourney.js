// SSF Blog / News — the full journey, 2013 → 2026.
// Nothing here is invented: every entry is grounded in the Foundation's own
// documented timeline (registration 2013, education/health/environment/women
// work across the years) already present on the website's Journey pages.
// Bilingual (English + हिंदी). Images are real SSF photos from /public/images.
//
// The Blog page merges these with the original BLOG_POSTS so nothing is
// removed — the archive simply becomes richer and year-wise.

export const BLOG_CATEGORIES = [
  { key: 'education', en: 'Education', hi: 'शिक्षा', icon: '🎓' },
  { key: 'health', en: 'Health', hi: 'स्वास्थ्य', icon: '❤️' },
  { key: 'environment', en: 'Environment', hi: 'पर्यावरण', icon: '🌱' },
  { key: 'women', en: 'Women', hi: 'महिला', icon: '👩' },
  { key: 'youth', en: 'Youth & Skills', hi: 'युवा एवं कौशल', icon: '🚀' },
  { key: 'community', en: 'Community', hi: 'समुदाय', icon: '🤝' },
  { key: 'awareness', en: 'Awareness', hi: 'जागरूकता', icon: '💡' },
  { key: 'documentation', en: 'Documentation', hi: 'दस्तावेज़', icon: '📄' },
];

// Each post: year + date + category + bilingual title/short/full + a real image.
export const JOURNEY_POSTS = [
  {
    id: 'j2013a', year: 2013, date: 'Dec 2013', category: 'documentation',
    image: '/images/real/foundation_banner.jpg',
    title: { en: 'A Foundation is Born — 30 December 2013', hi: 'एक संस्था का जन्म — 30 दिसंबर 2013' },
    short: { en: 'Swastik Srijan Foundation Samiti was registered in Rewa, Madhya Pradesh, with a simple resolve: serve people with dignity.', hi: 'स्वास्तिक सृजन फाउंडेशन समिति का पंजीयन रीवा, मध्य प्रदेश में हुआ — एक सरल संकल्प के साथ: गरिमा के साथ सेवा।' },
    full: {
      en: `On 30 December 2013, Swastik Srijan Foundation Samiti was registered under the Madhya Pradesh Societies Registration Act, 1973 (Reg. No. 05/22/03/11448/13), with its registered office at Ward No. 1, Dadar, Post Rahat, District Rewa, Madhya Pradesh.\n\nEvery long journey starts with a first step. That step was not about buildings or big budgets — it was about a decision: that ordinary people can do extraordinary work when they come together.\n\nFrom this single registration, the Foundation set out to work for education, health, social awareness and community development.`,
      hi: `30 दिसंबर 2013 को स्वास्तिक सृजन फाउंडेशन समिति का पंजीयन मध्य प्रदेश सोसाइटी रजिस्ट्रेशन अधिनियम, 1973 के अंतर्गत हुआ (पंजीकरण संख्या 05/22/03/11448/13), पंजीकृत कार्यालय वार्ड नं. 1, दादर, पोस्ट राहत, जिला रीवा, मध्य प्रदेश।\n\nहर लंबी यात्रा एक पहले कदम से शुरू होती है। वह कदम इमारतों या बड़े बजट का नहीं था — वह एक निर्णय था: साधारण लोग साथ आकर असाधारण काम कर सकते हैं।\n\nइसी पंजीयन से संस्था ने शिक्षा, स्वास्थ्य, सामाजिक जागरूकता और सामुदायिक विकास के लिए काम करना शुरू किया।`,
    },
  },
  {
    id: 'j2013b', year: 2013, date: 'Rewa, M.P.', category: 'community',
    image: '/images/real/village-community-center.jpg',
    title: { en: 'Roots in Rewa, Reach Across India', hi: 'जड़ें रीवा में, पहुँच पूरे भारत में' },
    short: { en: 'The Foundation began in a small district of Madhya Pradesh but kept its vision open for all of India.', hi: 'संस्था की शुरुआत मध्य प्रदेश के एक छोटे जिले से हुई, पर दृष्टि पूरे भारत के लिए खुली रही।' },
    full: {
      en: `Registration in Rewa gave the Foundation its roots — a place, a family of volunteers and a promise. But the need for education, health and awareness is not limited to one district.\n\nSo from the very beginning the operational scope was kept Pan-India. Wherever a child needed a classroom, wherever a family needed health support, wherever a community needed guidance, the Foundation wanted to be able to reach.`,
      hi: `रीवा में पंजीयन ने संस्था को जड़ें दीं — एक स्थान, स्वयंसेवकों का परिवार और एक वचन। पर शिक्षा, स्वास्थ्य और जागरूकता की आवश्यकता एक जिले तक सीमित नहीं है।\n\nइसलिए शुरुआत से ही कार्यक्षेत्र पूरे भारत के लिए खुला रखा गया। जहाँ किसी बच्चे को कक्षा चाहिए, किसी परिवार को स्वास्थ्य सहयोग, किसी समुदाय को मार्गदर्शन — संस्था वहाँ पहुँचना चाहती थी।`,
    },
  },
  {
    id: 'j2014a', year: 2014, date: '2014', category: 'education',
    image: '/images/classroom-session.png',
    title: { en: 'Learning Begins in Earnest', hi: 'सीखने की सच्ची शुरुआत' },
    short: { en: 'Early years focused on education, community connections and groundwork for social awareness.', hi: 'शुरुआती वर्षों में शिक्षा, सामुदायिक जुड़ाव और सामाजिक जागरूकता की नींव पर काम हुआ।' },
    full: {
      en: `In 2014 the Foundation turned registration into action. Community connections were built, classrooms and study sessions were encouraged, and the groundwork for education, health and social awareness was laid.\n\nThe lesson of this year was simple: trust is built slowly, one honest interaction at a time.`,
      hi: `2014 में संस्था ने पंजीयन को कर्म में बदला। सामुदायिक जुड़ाव बने, कक्षाओं और अध्ययन सत्रों को प्रोत्साहन मिला, और शिक्षा, स्वास्थ्य व सामाजिक जागरूकता की नींव पड़ी।\n\nइस वर्ष की सीख सरल थी: भरोसा धीरे-धीरे बनता है, एक-एक ईमानदार प्रयास से।`,
    },
  },
  {
    id: 'j2014b', year: 2014, date: '2014', category: 'awareness',
    image: '/images/real/awareness-poster-viewing.jpg',
    title: { en: 'Awareness Reaches the Neighbourhood', hi: 'जागरूकता मोहल्ले तक पहुँची' },
    short: { en: 'Simple awareness sessions on hygiene, safety and education helped families make better daily decisions.', hi: 'स्वच्छता, सुरक्षा और शिक्षा पर सरल जागरूकता सत्रों ने परिवारों को बेहतर निर्णय लेने में मदद की।' },
    full: {
      en: `Big change often starts with small, repeated messages. Through poster reading, meetings and one-to-one conversations, families learned about hygiene, child safety and the value of staying in school.\n\nAwareness does not need money — it needs patience and the willingness to explain the same good thing again and again.`,
      hi: `बड़ा बदलाव अक्सर छोटे, दोहराए जाने वाले संदेशों से शुरू होता है। पोस्टर पढ़ने, बैठकों और आमने-सामने की बातचीत से परिवारों ने स्वच्छता, बाल सुरक्षा और स्कूल में बने रहने का महत्व सीखा।\n\nजागरूकता को पैसा नहीं, धैर्य चाहिए — वही अच्छी बात बार-बार समझाने का मन।`,
    },
  },
  {
    id: 'j2015a', year: 2015, date: '2015', category: 'community',
    image: '/images/community-meeting.jpg',
    title: { en: 'The Community Becomes the Partner', hi: 'समुदाय बना साथी' },
    short: { en: 'Participation grew as local people joined planning and social initiatives themselves.', hi: 'स्थानीय लोगों के स्वयं जुड़ने से सहभागिता बढ़ी।' },
    full: {
      en: `2015 was about shifting from "doing for" to "doing with". Community members joined the planning of initiatives, suggested what their area needed most, and took responsibility for follow-up.\n\nWhen people own the work, the work lasts. This year taught the Foundation that sustainability begins with participation.`,
      hi: `2015 का सार था — "के लिए करना" से "के साथ करना" की ओर बढ़ना। समुदाय के लोग पहल की योजना में जुड़े, बताया कि उनके क्षेत्र को सबसे ज़्यादा क्या चाहिए, और आगे की जिम्मेदारी ली।\n\nजब काम पर लोगों का अपनापन हो, तो वह टिकता है। इस वर्ष संस्था ने सीखा कि टिकाऊपन सहभागिता से शुरू होता है।`,
    },
  },
  {
    id: 'j2015b', year: 2015, date: '2015', category: 'education',
    image: '/images/real/girls-study-group-mat.jpg',
    title: { en: 'Girls Stay in School', hi: 'बालिकाएँ स्कूल में बनी रहीं' },
    short: { en: 'Special attention to girls\' education — because educating a girl educates a whole family.', hi: 'बालिका शिक्षा पर विशेष ध्यान — क्योंकि एक बालिका को पढ़ाना पूरे परिवार को पढ़ाना है।' },
    full: {
      en: `For many families, a girl's education was the first thing to be sacrificed. The Foundation worked to change that belief — visiting homes, encouraging parents and supporting girls with study material and moral support.\n\nAn educated girl changes not only her own life but the health, income and confidence of her entire family.`,
      hi: `कई परिवारों में बालिका की शिक्षा सबसे पहले छोड़ी जाती थी। संस्था ने इस विश्वास को बदलने का काम किया — घरों तक जाकर, अभिभावकों को प्रोत्साहित करके और बालिकाओं को पठन-सामग्री व सहयोग देकर।\n\nशिक्षित बालिका केवल अपना जीवन नहीं बदलती — पूरे परिवार का स्वास्थ्य, आय और आत्मविश्वास बदलती है।`,
    },
  },
  {
    id: 'j2016a', year: 2016, date: '2016', category: 'education',
    image: '/images/real/classroom-floor-seating.jpg',
    title: { en: 'Learning Becomes Practical', hi: 'शिक्षा बनी व्यावहारिक' },
    short: { en: 'Focus shifted to practical, useful learning — not just reading but applying.', hi: 'ध्यान व्यावहारिक, उपयोगी सीख पर केंद्रित हुआ — केवल पढ़ना नहीं, अपनाना।' },
    full: {
      en: `2016 pushed the Foundation to ask: is the child only memorising, or truly learning? Sessions were made simpler and more practical, connecting lessons to daily life.\n\nReal education shows up in behaviour — in cleanliness, in kindness, in better decisions. That became the yardstick.`,
      hi: `2016 में संस्था ने पूछा: बच्चा रट रहा है या वास्तव में सीख रहा है? सत्र अधिक सरल और व्यावहारिक बनाए गए, ताकि पाठ रोज़मर्रा के जीवन से जुड़ें।\n\nसच्ची शिक्षा व्यवहार में दिखती है — स्वच्छता में, दया में, बेहतर निर्णयों में। यही कसौटी बनी।`,
    },
  },
  {
    id: 'j2016b', year: 2016, date: '2016', category: 'health',
    image: '/images/real/health-center-visit.jpg',
    title: { en: 'Health Support Reaches Those Left Behind', hi: 'स्वास्थ्य सहयोग उन तक पहुँचा जो पीछे रह गए' },
    short: { en: 'Basic health guidance and support for families who could not easily reach a doctor.', hi: 'जो परिवार आसानी से डॉक्टर तक नहीं पहुँच सकते, उनके लिए बुनियादी स्वास्थ्य मार्गदर्शन।' },
    full: {
      en: `Health is the foundation on which education and income stand. The Foundation organised basic health awareness, guided families to available facilities, and supported those who had no one to turn to.\n\nEven a small act — a check-up, a mask, a correct piece of advice — can prevent a large suffering later.`,
      hi: `स्वास्थ्य वह नींव है जिस पर शिक्षा और आय टिकती है। संस्था ने बुनियादी स्वास्थ्य जागरूकता आयोजित की, परिवारों को उपलब्ध सुविधाओं तक पहुँचाया और उनका साथ दिया जिनके पास कोई नहीं था।\n\nएक छोटा-सा काम — एक जाँच, एक मास्क, एक सही सलाह — बड़ी पीड़ा को आगे रोक सकता है।`,
    },
  },
  {
    id: 'j2017a', year: 2017, date: '2017', category: 'community',
    image: '/images/real/community-rally-children.jpg',
    title: { en: 'Stronger Connections, Wider Reach', hi: 'मजबूत जुड़ाव, व्यापक पहुँच' },
    short: { en: 'Outreach strengthened around inclusive development and community participation.', hi: 'समावेशी विकास और सामुदायिक सहभागिता के इर्द-गिर्द पहुँच मजबूत हुई।' },
    full: {
      en: `In 2017 the Foundation focused on reaching further without losing warmth. New volunteers, local partners and community leaders joined hands.\n\nGrowth in an organisation is not measured only by numbers, but by how many people feel included and respected in the work.`,
      hi: `2017 में संस्था ने अपनापन बनाए रखते हुए पहुँच बढ़ाने पर ध्यान दिया। नए स्वयंसेवक, स्थानीय साझेदार और समुदाय के नेता जुड़े।\n\nसंस्था की वृद्धि केवल संख्याओं से नहीं, बल्कि इससे मापी जाती है कि कितने लोग काम में शामिल व सम्मानित महसूस करते हैं।`,
    },
  },
  {
    id: 'j2017b', year: 2017, date: '2017', category: 'awareness',
    image: '/images/real/rural-awareness.jpg',
    title: { en: 'Taking Awareness to the Villages', hi: 'जागरूकता गाँवों तक ले गए' },
    short: { en: 'Door-to-door awareness on education, hygiene and government schemes.', hi: 'शिक्षा, स्वच्छता और सरकारी योजनाओं पर घर-घर जागरूकता।' },
    full: {
      en: `Many families were unaware of the schemes and help already available to them. Volunteers travelled to villages to explain benefits, entitlements and simple good practices.\n\nInformation that reaches the right person at the right time is a form of service.`,
      hi: `कई परिवारों को उनके लिए उपलब्ध योजनाओं और सहायता की जानकारी ही नहीं थी। स्वयंसेवक गाँवों तक गए और लाभ, अधिकार तथा सरल अच्छी आदतें समझाईं।\n\nसही समय पर सही व्यक्ति तक पहुँची जानकारी भी एक सेवा है।`,
    },
  },
  {
    id: 'j2018a', year: 2018, date: '2018', category: 'environment',
    image: '/images/real/tree_plantation.jpg',
    title: { en: 'For the Environment — Plant, Protect, Preserve', hi: 'पर्यावरण के लिए — लगाओ, बचाओ, सहेजो' },
    short: { en: 'Tree plantation and cleanliness drives involved students and community members.', hi: 'वृक्षारोपण और स्वच्छता अभियानों में विद्यार्थी व समुदाय शामिल हुए।' },
    full: {
      en: `2018 brought environment to the centre: tree plantation, cleanliness drives and messages to reduce waste. Students became the most enthusiastic participants.\n\nPlanting a tree takes a day; protecting it takes years. The Foundation encouraged both.`,
      hi: `2018 ने पर्यावरण को केंद्र में रखा: वृक्षारोपण, स्वच्छता अभियान और कचरा कम करने के संदेश। विद्यार्थी सबसे उत्साही सहभागी बने।\n\nपेड़ लगाना एक दिन का काम है; उसकी रक्षा सालों का। संस्था ने दोनों पर ज़ोर दिया।`,
    },
  },
  {
    id: 'j2018b', year: 2018, date: '2018', category: 'youth',
    image: '/images/uploads/academy-activities-facilities.jpg',
    title: { en: 'Skills, Sports and Youth Energy', hi: 'कौशल, खेल और युवा ऊर्जा' },
    short: { en: 'Skills, sports and welfare activities widened the Foundation\'s work with young people.', hi: 'कौशल, खेल और कल्याण गतिविधियों ने युवाओं के साथ काम का दायरा बढ़ाया।' },
    full: {
      en: `Attention turned to young people — their skills, sports, confidence and career direction. Programmes grew beyond books to talent, teamwork and self-belief.\n\nA young person with a goal and a mentor is far less likely to drift. That mentoring became a priority.`,
      hi: `ध्यान युवाओं पर गया — उनके कौशल, खेल, आत्मविश्वास और करियर दिशा पर। कार्यक्रम किताबों से आगे बढ़कर प्रतिभा, टीम-भावना और आत्मविश्वास तक पहुँचे।\n\nजिस युवा के पास लक्ष्य और मार्गदर्शक हों, वह भटकता कम है। यही मार्गदर्शन प्राथमिकता बना।`,
    },
  },
  {
    id: 'j2019a', year: 2019, date: '2019', category: 'women',
    image: '/images/real/women_empowerment_tailoring.jpg',
    title: { en: 'Women Learning, Women Earning', hi: 'महिलाएँ सीखीं, महिलाएँ कमाईं' },
    short: { en: 'Skill support for women opened doors to respect, income and independence.', hi: 'महिलाओं के कौशल सहयोग ने सम्मान, आय और आत्मनिर्भरता के द्वार खोले।' },
    full: {
      en: `When a woman learns a skill and earns a little of her own, the whole household changes. 2019 focused on women's skills, self-help and dignity.\n\nFinancial independence is not about large sums — it is about having a voice in your own life.`,
      hi: `जब एक महिला कौशल सीखती है और अपनी थोड़ी कमाई करती है, पूरा घर बदलता है। 2019 में महिलाओं के कौशल, स्वयं-सहायता और गरिमा पर ध्यान रहा।\n\nआर्थिक आत्मनिर्भरता बड़ी रकम की नहीं — अपने जीवन में अपनी आवाज़ की बात है।`,
    },
  },
  {
    id: 'j2019b', year: 2019, date: '2019', category: 'health',
    image: '/images/real/vision-health-camp.jpg',
    title: { en: 'Health and Wellness Camps', hi: 'स्वास्थ्य एवं कल्याण शिविर' },
    short: { en: 'Awareness, check-ups and wellbeing support for the community.', hi: 'समुदाय के लिए जागरूकता, जाँच और कल्याण सहयोग।' },
    full: {
      en: `The Foundation continued its health work with camps and awareness around wellbeing — the small habits that quietly protect a family.\n\nPrevention, once again, proved cheaper and kinder than cure.`,
      hi: `संस्था ने शिविरों और कल्याण-जागरूकता के साथ स्वास्थ्य कार्य जारी रखा — वे छोटी आदतें जो चुपचाप परिवार की रक्षा करती हैं।\n\nबचाव एक बार फिर इलाज से सस्ता और दयालु सिद्ध हुआ।`,
    },
  },
  {
    id: 'j2020a', year: 2020, date: '2020', category: 'health',
    image: '/images/real/rural-mask-distribution.jpg',
    title: { en: 'Standing With Communities During COVID-19', hi: 'कोविड-19 में समुदायों के साथ' },
    short: { en: 'Masks, relief, awareness and support during the pandemic — service without asking.', hi: 'महामारी के दौरान मास्क, राहत, जागरूकता और सहयोग — बिना माँगे सेवा।' },
    full: {
      en: `2020 tested everyone. The Foundation responded with mask distribution, relief support, awareness on hygiene and distance, and help for those who lost work.\n\nIn a crisis, the first duty is presence — to show up for people when they are most afraid. Volunteers did exactly that.`,
      hi: `2020 ने सबको परखा। संस्था ने मास्क वितरण, राहत सहयोग, स्वच्छता व दूरी की जागरूकता और काम खो चुके लोगों की मदद से जवाब दिया।\n\nसंकट में पहला कर्तव्य है — उपस्थित होना, जब लोग सबसे ज़्यादा डरे हुए हों। स्वयंसेवकों ने यही किया।`,
    },
  },
  {
    id: 'j2020b', year: 2020, date: '2020', category: 'education',
    image: '/images/uploads/education-class.jpg',
    title: { en: 'Learning Did Not Stop', hi: 'सीखना नहीं रुका' },
    short: { en: 'Education continued through online and technical support while schools stayed shut.', hi: 'स्कूल बंद रहने पर ऑनलाइन और तकनीकी सहयोग से शिक्षा जारी रही।' },
    full: {
      en: `With classrooms closed, the Foundation supported education through online and technical means wherever possible, and helped students stay connected to learning.\n\nWhen one door closes, a determined teacher finds another. That spirit kept children studying through a very difficult year.`,
      hi: `कक्षाएँ बंद होने पर संस्था ने जहाँ संभव हो ऑनलाइन और तकनीकी माध्यमों से शिक्षा को सहयोग दिया और विद्यार्थियों को सीखने से जुड़े रखा।\n\nजब एक दरवाज़ा बंद हो, एक दृढ़ शिक्षक दूसरा खोज लेता है। इसी भाव ने कठिन वर्ष में भी बच्चों को पढ़ाते रखा।`,
    },
  },
  {
    id: 'j2021a', year: 2021, date: '2021', category: 'health',
    image: '/images/real/plasma-donation-real.jpg',
    title: { en: 'Plasma and Blood Donation Support', hi: 'प्लाज्मा एवं रक्तदान सहयोग' },
    short: { en: 'Connecting verified donors with families in urgent need during the pandemic.', hi: 'महामारी में ज़रूरतमंद परिवारों को सत्यापित दाताओं से जोड़ना।' },
    full: {
      en: `Plasma and blood were a bridge between life and death. The Foundation helped connect verified donors with families in distress and spread awareness about safe donation.\n\nOne donation can save up to three lives. A simple registry of willing donors can be a miracle for a stranger.`,
      hi: `प्लाज्मा और रक्त जीवन और मृत्यु के बीच का पुल थे। संस्था ने सत्यापित दाताओं को संकट में फँसे परिवारों से जोड़ा और सुरक्षित दान की जागरूकता फैलाई।\n\nएक दान तीन तक जान बचा सकता है। इच्छुक दाताओं की एक सरल सूची किसी अजनबी के लिए चमत्कार हो सकती है।`,
    },
  },
  {
    id: 'j2021b', year: 2021, date: 'Jun 2021', category: 'health',
    image: '/images/health-program-masks.jpg',
    title: { en: 'Masks for All — Community Initiative', hi: 'सभी के लिए मास्क — सामुदायिक पहल' },
    short: { en: 'Free masks and hygiene awareness for families who could not afford them.', hi: 'जो परिवार खरीद नहीं सकते थे, उनके लिए मुफ्त मास्क और स्वच्छता जागरूकता।' },
    full: {
      en: `During the pandemic, SSF ran a mask distribution drive across Noida and nearby areas, along with awareness sessions on hygiene, mask use and social distancing.\n\nProtection is a right, not a privilege. No one should face a health risk merely because they cannot afford a mask.`,
      hi: `महामारी के दौरान SSF ने नोएडा और आसपास मास्क वितरण अभियान चलाया, साथ ही स्वच्छता, मास्क उपयोग और सामाजिक दूरी पर जागरूकता सत्र।\n\nसुरक्षा एक अधिकार है, विशेषाधिकार नहीं। कोई केवल इसलिए स्वास्थ्य जोखिम न उठाए कि वह मास्क खरीद नहीं सकता।`,
    },
  },
  {
    id: 'j2022a', year: 2022, date: 'Jan 2022', category: 'education',
    image: '/images/real/computer-donation-final.png',
    title: { en: 'Computers for a Government School', hi: 'एक सरकारी स्कूल के लिए कंप्यूटर' },
    short: { en: 'Computers and printers donated to improve classroom efficiency and student exposure.', hi: 'कक्षा की दक्षता और विद्यार्थियों के अनुभव के लिए कंप्यूटर व प्रिंटर दान।' },
    full: {
      en: `At a government school, the Foundation donated computers and printers to improve academic efficiency, and motivated teachers to strengthen punctuality and engagement.\n\nThe result was a marked improvement in teaching quality and a 98% success rate. Sometimes a machine is not just a machine — it is a child's first window to the world.`,
      hi: `एक सरकारी स्कूल में संस्था ने शैक्षणिक दक्षता बढ़ाने के लिए कंप्यूटर और प्रिंटर दान किए, और शिक्षकों को समय-पालन व जुड़ाव के लिए प्रेरित किया।\n\nपरिणाम स्पष्ट सुधार और 98% सफलता दर रहा। कभी-कभी एक मशीन केवल मशीन नहीं — बच्चे की दुनिया की पहली खिड़की होती है।`,
    },
  },
  {
    id: 'j2022b', year: 2022, date: 'Mar 2022', category: 'environment',
    image: '/images/real/green-warriors-students.jpg',
    title: { en: 'Green Warriors — Students Lead Change', hi: 'हरित योद्धा — विद्यार्थियों ने बदलाव किया' },
    short: { en: 'Students planted saplings and took a pledge to protect the green around them.', hi: 'विद्यार्थियों ने पौधे लगाए और हरियाली की रक्षा का संकल्प लिया।' },
    full: {
      en: `Environment work became a student movement — plantation, care of saplings and a pledge to keep surroundings clean and green.\n\nWhen children lead, adults follow. That is the quiet power of a school-based environmental drive.`,
      hi: `पर्यावरण कार्य विद्यार्थियों का आंदोलन बना — वृक्षारोपण, पौधों की देखभाल और आसपास को स्वच्छ व हरा रखने का संकल्प।\n\nजब बच्चे नेतृत्व करते हैं, बड़े अनुसरण करते हैं। यही स्कूल-आधारित पर्यावरण अभियान की शांत शक्ति है।`,
    },
  },
  {
    id: 'j2023a', year: 2023, date: 'Aug 2023', category: 'women',
    image: '/images/real/women_community_meeting.jpg',
    title: { en: 'Women\'s Voices in the Community', hi: 'समुदाय में महिलाओं की आवाज़' },
    short: { en: 'Meetings that gave women a platform to speak, decide and lead.', hi: 'ऐसी बैठकें जिन्होंने महिलाओं को बोलने, निर्णय और नेतृत्व का मंच दिया।' },
    full: {
      en: `Community meetings placed women at the centre — their needs, their ideas, their leadership. Many spoke in public for the first time and discovered their own strength.\n\nEmpowerment is not given; it is awakened. All it often needs is a safe platform and a listening ear.`,
      hi: `सामुदायिक बैठकों में महिलाएँ केंद्र में रहीं — उनकी आवश्यकताएँ, विचार और नेतृत्व। कईयों ने पहली बार सार्वजनिक रूप से बोला और अपनी शक्ति पहचानी।\n\nसशक्तिकरण दिया नहीं जाता; जगाया जाता है। अक्सर इसके लिए एक सुरक्षित मंच और सुनने वाला कान भर चाहिए।`,
    },
  },
  {
    id: 'j2023b', year: 2023, date: 'Oct 2023', category: 'education',
    image: '/images/uploads/academy-banner-main.jpg',
    title: { en: 'A Vision for the SSF Academy', hi: 'SSF अकादमी का संकल्प' },
    short: { en: 'Planning began for a learning space where education, skills and values grow together.', hi: 'एक शिक्षण स्थान की योजना शुरू, जहाँ शिक्षा, कौशल और संस्कार साथ बढ़ें।' },
    full: {
      en: `The Foundation began shaping the idea of an academy — a place where children learn not only subjects but skills, confidence and values.\n\nBig institutions are built in small plans. This year, those plans were laid out with care.`,
      hi: `संस्था ने अकादमी की कल्पना को आकार देना शुरू किया — एक स्थान जहाँ बच्चे केवल विषय नहीं, कौशल, आत्मविश्वास और संस्कार सीखें।\n\nबड़ी संस्थाएँ छोटी योजनाओं से बनती हैं। इस वर्ष वे योजनाएँ सावधानी से तैयार हुईं।`,
    },
  },
  {
    id: 'j2024a', year: 2024, date: '2024', category: 'education',
    image: '/images/uploads/academy-hero-children.jpg',
    title: { en: 'Building Skills for Real Life', hi: 'असल जीवन के लिए कौशल' },
    short: { en: 'Career readiness, digital skills and practical learning moved forward.', hi: 'करियर तैयारी, डिजिटल कौशल और व्यावहारिक शिक्षा आगे बढ़ी।' },
    full: {
      en: `2024 sharpened the focus on employability — communication, digital literacy and workplace skills for young people and women.\n\nEducation that cannot help a person earn or decide better is incomplete. Skills close that gap.`,
      hi: `2024 में रोज़गार-योग्यता पर ध्यान तेज़ हुआ — युवाओं और महिलाओं के लिए संचार, डिजिटल साक्षरता और कार्यस्थल कौशल।\n\nजो शिक्षा किसी को कमाने या बेहतर निर्णय लेने में मदद न करे, वह अधूरी है। कौशल यही अंतर भरते हैं।`,
    },
  },
  {
    id: 'j2024b', year: 2024, date: 'May 2024', category: 'community',
    image: '/images/real/cloth-distribution.jpg',
    title: { en: 'Relief With Dignity', hi: 'गरिमा के साथ राहत' },
    short: { en: 'Clothes, food and essentials for families who needed them most.', hi: 'जिन परिवारों को सबसे ज़्यादा ज़रूरत थी, उनके लिए वस्त्र, भोजन और आवश्यक वस्तुएँ।' },
    full: {
      en: `Relief work continued with a special care for dignity — giving in a way that respects, not shames, the receiver.\n\nService is complete only when it also protects a person's self-respect. That principle guides how the Foundation gives.`,
      hi: `राहत कार्य गरिमा का विशेष ध्यान रखते हुए जारी रहा — इस तरह देना जो लेने वाले का सम्मान करे, शर्मिंदा न करे।\n\nसेवा तभी पूरी होती है जब वह व्यक्ति के आत्म-सम्मान की भी रक्षा करे। संस्था इसी सिद्धांत से देती है।`,
    },
  },
  {
    id: 'j2025a', year: 2025, date: '2025', category: 'education',
    image: '/images/real/girls-group-learning-close.jpg',
    title: { en: 'The SSF Learning Hub Takes Shape', hi: 'SSF लर्निंग हब ने आकार लिया' },
    short: { en: 'A full learning hub — subjects, skills and mentorship for every learner.', hi: 'एक पूर्ण लर्निंग हब — हर शिक्षार्थी के लिए विषय, कौशल और मार्गदर्शन।' },
    full: {
      en: `2025 saw the Learning Hub grow into a real platform — courses, subjects and structured learning for students and adults alike.\n\nKnowledge should never be locked away. The Hub was built to keep learning open, bilingual and free wherever possible.`,
      hi: `2025 में लर्निंग हब एक सच्चे मंच के रूप में बढ़ा — विद्यार्थियों और वयस्कों दोनों के लिए पाठ्यक्रम, विषय और संरचित शिक्षण।\n\nज्ञान कभी बंद नहीं रहना चाहिए। हब इसलिए बना कि सीखना खुला, द्विभाषी और जहाँ संभव हो मुफ्त रहे।`,
    },
  },
  {
    id: 'j2025b', year: 2025, date: '2025', category: 'documentation',
    image: '/images/real/academy-board-compliance.jpg',
    title: { en: 'One Organisation, One Record', hi: 'एक संस्था, एक रिकॉर्ड' },
    short: { en: 'A digital office to keep every record accountable, transparent and permanent.', hi: 'हर रिकॉर्ड को जवाबदेह, पारदर्शी और स्थायी रखने के लिए डिजिटल कार्यालय।' },
    full: {
      en: `Accountability became a pillar of the Foundation's work — a single digital office to maintain records of people, meetings, finance, programmes and compliance.\n\nTrust is built by transparency. When every rupee and every decision can be traced, the community's faith grows stronger.`,
      hi: `जवाबदेही संस्था के काम का स्तंभ बनी — लोगों, बैठकों, वित्त, कार्यक्रमों और अनुपालन के रिकॉर्ड रखने वाला एक डिजिटल कार्यालय।\n\nभरोसा पारदर्शिता से बनता है। जब हर रुपया और हर निर्णय देखा जा सके, समुदाय का विश्वास और मजबूत होता है।`,
    },
  },
  {
    id: 'j2026a', year: 2026, date: '2026', category: 'youth',
    image: '/images/real/student-leadership-recitation.jpg',
    title: { en: 'Awareness That Reaches Every Phone', hi: 'जागरूकता जो हर फोन तक पहुँचे' },
    short: { en: 'Daily bilingual awareness posts — positive, practical, example-based.', hi: 'रोज़ के द्विभाषी जागरूकता संदेश — सकारात्मक, व्यावहारिक, उदाहरण सहित।' },
    full: {
      en: `The Foundation began sharing daily awareness posts — in English and Hindi — on education, health, environment, safety and everyday good habits.\n\nA nation changes when its people change, one small habit, one honest message, one day at a time.`,
      hi: `संस्था ने शिक्षा, स्वास्थ्य, पर्यावरण, सुरक्षा और रोज़मर्रा की अच्छी आदतों पर रोज़ के जागरूकता संदेश — अंग्रेज़ी और हिंदी में — साझा करने शुरू किए।\n\nराष्ट्र तब बदलता है जब उसके लोग बदलते हैं — एक छोटी आदत, एक ईमानदार संदेश, एक दिन एक बार।`,
    },
  },
  {
    id: 'j2026b', year: 2026, date: '2026', category: 'community',
    image: '/images/community-team-group.jpg',
    title: { en: 'A Journey That Continues', hi: 'एक यात्रा जो जारी है' },
    short: { en: 'From a single registration to a Pan-India mission — with people always at the centre.', hi: 'एक पंजीयन से पूरे भारत के मिशन तक — हमेशा लोगों को केंद्र में रखते हुए।' },
    full: {
      en: `From a registration in Rewa to a shared mission across India, the Foundation's journey has been built on the trust of ordinary people doing extraordinary service.\n\nThe road ahead is long, but the promise stays the same: serve with dignity, work with accountability, and help every person rise.`,
      hi: `रीवा के एक पंजीयन से पूरे भारत के साझा मिशन तक, संस्था की यात्रा साधारण लोगों के असाधारण सेवा-भाव के भरोसे पर बनी है।\n\nआगे की राह लंबी है, पर वचन वही है: गरिमा के साथ सेवा, जवाबदेही के साथ कार्य, और हर व्यक्ति को आगे बढ़ाने में सहायता।`,
    },
  },
];

export const JOURNEY_YEARS = Array.from(new Set(JOURNEY_POSTS.map((p) => p.year))).sort((a, b) => b - a);

export const categoryLabel = (key, lang = 'en') => {
  const c = BLOG_CATEGORIES.find((x) => x.key === key);
  if (!c) return key;
  return lang === 'hi' ? c.hi : c.en;
};
