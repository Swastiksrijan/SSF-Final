// Series 7 — जुड़िए SSF से (Join SSF) — रोज़ एक अध्याय.
//
// Objective (नियमावली): this stream is the *invitation* arm of the daily series.
// The other six streams inform and teach; this one tells a reader what SSF
// actually does and how to take part — as a member, volunteer, donor or partner.
//
// Sourcing: every claim here is taken from SSF's OWN published pages, not
// invented. The ten objectives match `src/routes/Objectives.jsx`; the four
// membership tiers match `src/components/MemberForm.jsx`; the four volunteer
// types match `src/components/VolunteerForm.jsx`; the six non-financial gifts
// match `src/pages/JoinUsPage.jsx`; the join link is the real `/JoinUs` route.
//
// Bilingual (EN + HI). Every chapter: hook -> key points -> example -> today's
// task -> tip -> caution. "Learn, share, and help someone benefit."

const { CH, T } = require('./seriesEngine');

const items = [
  CH(
    T('Join the Movement — four ways to be part of SSF', 'आंदोलन से जुड़िए — SSF का हिस्सा बनने के चार तरीके'),
    T('You do not need money to help. Your time, knowledge and will are enough.', 'मदद के लिए पैसा ज़रूरी नहीं। आपका समय, ज्ञान और इच्छा ही काफ़ी है।'),
    [
      T('Be a MEMBER — join SSF\'s long-term journey and support its mission.', 'सदस्य बनें — SSF की दीर्घकालिक यात्रा का हिस्सा बनें और उसके उद्देश्य को सहयोग दें।'),
      T('Be a VOLUNTEER — give your time, knowledge or skill to society\'s work.', 'स्वयंसेवक बनें — अपना समय, ज्ञान या कौशल समाज के काम में लगाएँ।'),
      T('Be a DONOR — support any initiative according to your capacity.', 'दानदाता बनें — अपनी क्षमता के अनुसार किसी भी पहल को सहयोग दें।'),
      T('COLLABORATE — work together with a school, hospital, company, institution, professional or NGO.', 'साझेदार बनें — विद्यालय, अस्पताल, कंपनी, संस्था, पेशेवर या NGO के साथ मिलकर काम करें।'),
    ],
    T('A retired teacher giving two hours a week is as valuable to SSF as a large cheque.', 'सप्ताह में दो घंटे देने वाले सेवानिवृत्त शिक्षक SSF के लिए उतने ही मूल्यवान हैं जितना बड़ा चेक।'),
    T('Open the SSF Join page today and read all four roles before you choose one.', 'आज SSF का जुड़िए पेज खोलें और कोई भूमिका चुनने से पहले चारों भूमिकाएँ पढ़ें।'),
    T('Start with the role that matches what you already have, not what you wish you had.', 'उस भूमिका से शुरू करें जो आपके पास पहले से है, उससे नहीं जो आप चाहते हैं।'),
    T('Never pay money to any individual for a role in SSF — membership fees go only to the official SSF account.', 'SSF में भूमिका दिलाने के लिए किसी व्यक्ति को पैसा कभी न दें — सदस्यता शुल्क केवल SSF के आधिकारिक खाते में जाता है।'),
    {
      labh: T('A clear first step: pick a role, fill the official form, get a welcome from the SSF team.', 'स्पष्ट पहला कदम: भूमिका चुनें, आधिकारिक फ़ॉर्म भरें, SSF टीम से स्वागत पाएँ।'),
      who: T('Any adult who shares SSF\'s values — students, professionals, homemakers, retired persons, institutions.', 'कोई भी वयस्क जो SSF के मूल्यों से सहमत हो — विद्यार्थी, पेशेवर, गृहिणी, सेवानिवृत्त व्यक्ति, संस्थाएँ।'),
      docs: T('Basic details and a mobile number or email. An identity document is optional and can be shared later.', 'बुनियादी विवरण और मोबाइल नंबर या ईमेल। पहचान-दस्तावेज़ वैकल्पिक है, बाद में भी दे सकते हैं।'),
      where: T('Online at swastiksrijan.in → Join Us. No fee is charged for volunteer registration.', 'ऑनलाइन: swastiksrijan.in → जुड़िए। स्वयंसेवक पंजीकरण के लिए कोई शुल्क नहीं।'),
    },
  ),
  CH(
    T('Education — our first objective', 'शिक्षा — हमारा पहला उद्देश्य'),
    T('Knowledge creates opportunity, and opportunity creates development.', 'ज्ञान से अवसर, अवसर से विकास।'),
    [
      T('SSF works for primary, secondary and senior secondary school education.', 'SSF प्राथमिक, माध्यमिक एवं उच्च माध्यमिक विद्यालय शिक्षा के लिए कार्य करता है।'),
      T('It supports computer education, nursing and technical education.', 'यह कंप्यूटर शिक्षा, नर्सिंग एवं तकनीकी शिक्षा को सहयोग देता है।'),
      T('It runs competitive-examination coaching, libraries and science fairs.', 'यह प्रतियोगी परीक्षा कोचिंग, पुस्तकालय एवं विज्ञान मेले आयोजित करता है।'),
    ],
    T('The SSF Learning Hub and community classes turn this objective into daily lessons.', 'SSF लर्निंग हब एवं सामुदायिक कक्षाएँ इस उद्देश्य को रोज़ के पाठों में बदलती हैं।'),
    T('Share one free learning resource with a student who cannot afford coaching.', 'जो छात्र कोचिंग का खर्च नहीं उठा सकता, उसे एक निःशुल्क शिक्षण संसाधन भेजें।'),
    T('One book or one hour of teaching can change a child\'s whole direction.', 'एक किताब या पढ़ाने का एक घंटा बच्चे की पूरी दिशा बदल सकता है।'),
    T('Do not promise a job or a certificate in return for teaching — SSF roles are service, not employment.', 'पढ़ाने के बदले नौकरी या प्रमाणपत्र का वादा न करें — SSF की भूमिकाएँ सेवा हैं, रोज़गार नहीं।'),
  ),
  CH(
    T('Skill Development — self-reliance through skills', 'कौशल विकास — कौशल से आत्मनिर्भरता'),
    T('A skill is a lifelong income; a certificate alone is not.', 'कौशल आजीवन आय है; अकेला प्रमाणपत्र नहीं।'),
    [
      T('SSF promotes computer training, tailoring and embroidery.', 'SSF कंप्यूटर प्रशिक्षण, सिलाई-कढ़ाई को बढ़ावा देता है।'),
      T('It supports self-employment, vocational training and rural industries.', 'यह स्वरोजगार, व्यावसायिक प्रशिक्षण एवं ग्रामीण उद्योगों को सहयोग देता है।'),
      T('It encourages Khadi and village industries as local livelihood.', 'यह खादी एवं ग्रामोद्योग को स्थानीय आजीविका के रूप में प्रोत्साहित करता है।'),
    ],
    T('A woman who learns tailoring can earn from home without leaving her family.', 'सिलाई सीखी महिला परिवार छोड़े बिना घर से कमा सकती है।'),
    T('Teach one person one useful digital or vocational skill this week.', 'इस सप्ताह किसी एक व्यक्ति को एक उपयोगी डिजिटल या व्यावसायिक कौशल सिखाएँ।'),
    T('Teach the skill, then help the learner practise it — practice builds confidence.', 'पहले कौशल सिखाएँ, फिर अभ्यास कराएँ — अभ्यास से आत्मविश्वास बनता है।'),
    T('Do not charge a learner in SSF\'s name for a free community training.', 'निःशुल्क सामुदायिक प्रशिक्षण के लिए SSF के नाम पर शिक्षार्थी से शुल्क न लें।'),
  ),
  CH(
    T('Women & Child Development — dignity and safety', 'महिला एवं बाल विकास — गरिमा एवं सुरक्षा'),
    T('Empowered women, and safe, educated children.', 'सशक्त महिला, और सुरक्षित, शिक्षित बचपन।'),
    [
      T('SSF works for women empowerment and girls\' education.', 'SSF महिला सशक्तिकरण एवं बालिका शिक्षा के लिए कार्य करता है।'),
      T('It supports prevention of female foeticide and support for widows.', 'यह भ्रूण हत्या रोकथाम एवं विधवा सहायता को सहयोग देता है।'),
      T('It runs early-childhood centres, nutrition programmes and Self Help Groups (SHG).', 'यह बालवाड़ी, पोषण कार्यक्रम एवं स्वयं सहायता समूह (SHG) चलाता है।'),
    ],
    T('A girls\' education drive keeps a girl in school and lifts the whole family\'s income over time.', 'बालिका शिक्षा अभियान बालिका को विद्यालय में रखता है और आगे पूरे परिवार की आय बढ़ाता है।'),
    T('Encourage one family today to keep a daughter in school.', 'आज एक परिवार को बेटी को विद्यालय में बनाए रखने के लिए प्रोत्साहित करें।'),
    T('Speak about nutrition and health in the local language; it is understood and trusted.', 'पोषण एवं स्वास्थ्य की बात स्थानीय भाषा में करें; वह समझी और भरोसेमंद लगती है।'),
    T('Never collect money in the name of a girl\'s marriage or dowry — SSF does not support either.', 'बालिका विवाह या दहेज के नाम पर कभी पैसा न जुटाएँ — SSF दोनों का समर्थन नहीं करता।'),
  ),
  CH(
    T('Health & Well-being — healthy, aware communities', 'स्वास्थ्य एवं कल्याण — स्वस्थ, जागरूक समाज'),
    T('Health is the foundation on which education and income stand.', 'स्वास्थ्य वह नींव है जिस पर शिक्षा और आय टिकती है।'),
    [
      T('SSF works on AIDS awareness, cancer awareness and malnutrition prevention.', 'SSF एड्स जागरूकता, कैंसर जागरूकता एवं कुपोषण रोकथाम पर कार्य करता है।'),
      T('It promotes naturopathy, yoga and family welfare.', 'यह प्राकृतिक चिकित्सा, योग एवं परिवार कल्याण को बढ़ावा देता है।'),
      T('It supports de-addiction and rehabilitation.', 'यह नशा मुक्ति एवं पुनर्वास को सहयोग देता है।'),
    ],
    T('A free health camp and a nutrition kit can stop a small illness from becoming a crisis.', 'निःशुल्क स्वास्थ्य शिविर एवं पोषण किट छोटी बीमारी को संकट बनने से रोक सकते हैं।'),
    T('Learn one basic first-aid step today and teach it to one person.', 'आज एक बुनियादी प्राथमिक-चिकित्सा चरण सीखें और किसी एक को सिखाएँ।'),
    T('Refer, never prescribe — for any illness, a qualified doctor must decide.', 'संदर्भ दें, दवा न बताएँ — किसी भी बीमारी का निर्णय योग्य चिकित्सक ही करे।'),
    T('This is health awareness, not medical advice. For emergencies call 108; for health queries call 104.', 'यह स्वास्थ्य जागरूकता है, चिकित्सीय सलाह नहीं। आपातकाल में 108; स्वास्थ्य पूछताछ हेतु 104 पर कॉल करें।'),
    {
      labh: T('Free health camps, medicine distribution and nutrition kits through SSF programmes.', 'SSF कार्यक्रमों के माध्यम से निःशुल्क स्वास्थ्य शिविर, दवा वितरण एवं पोषण किट।'),
      who: T('Children, women, elderly persons and families with low income.', 'बच्चे, महिलाएँ, वृद्धजन एवं अल्प-आय परिवार।'),
      docs: T('Aadhaar/ID if available and any previous medical papers — both optional.', 'आधार/पहचान यदि हो और पुराने चिकित्सीय कागज़ात — दोनों वैकल्पिक।'),
      where: T('Watch for SSF health-camp announcements, or contact the SSF team through the website. Emergency: 108, health helpline: 104.', 'SSF स्वास्थ्य शिविर की सूचना देखें, या वेबसाइट से SSF टीम से संपर्क करें। आपातकाल: 108, स्वास्थ्य हेल्पलाइन: 104।'),
    },
  ),
];

items.push(
  CH(
    T('Environment — protect nature, secure the future', 'पर्यावरण — प्रकृति की रक्षा, भविष्य की सुरक्षा'),
    T('We do not inherit the earth from our ancestors; we borrow it from our children.', 'हम धरती विरासत में नहीं पाते; इसे अपने बच्चों से उधार लेते हैं।'),
    [
      T('SSF promotes tree plantation and biodiversity conservation.', 'SSF वृक्षारोपण एवं जैव विविधता संरक्षण को बढ़ावा देता है।'),
      T('It works for forest conservation and natural resource conservation.', 'यह वन संरक्षण एवं प्राकृतिक संसाधन संरक्षण के लिए कार्य करता है।'),
      T('It promotes medicinal plants, organic farming and renewable energy.', 'यह औषधीय पौधे, जैविक खेती एवं प्राकृतिक ऊर्जा को बढ़ावा देता है।'),
    ],
    T('A village that plants and protects a hundred saplings shades the next generation.', 'जो गाँव सौ पौधे लगाकर बचाता है, वह अगली पीढ़ी को छाया देता है।'),
    T('Plant or water one sapling today and keep it alive for a month.', 'आज एक पौधा लगाएँ या सींचें और उसे एक महीने जीवित रखें।'),
    T('Water and protect a sapling for a full year — planting alone is not enough.', 'पौधे को पूरे वर्ष पानी दें और बचाएँ — सिर्फ़ लगाना काफ़ी नहीं।'),
    T('Do not plant an invasive or foreign species in a forest area.', 'वन क्षेत्र में आक्रामक या विदेशी प्रजाति का पौधा न लगाएँ।'),
  ),
  CH(
    T('Agriculture & Rural Development — strong villages, stronger nation', 'कृषि एवं ग्रामीण विकास — गाँव मजबूत, देश मजबूत'),
    T('A strong village builds a strong nation.', 'गाँव मजबूत, देश मजबूत।'),
    [
      T('SSF promotes organic farming and farmer training.', 'SSF जैविक खेती एवं किसानों के प्रशिक्षण को बढ़ावा देता है।'),
      T('It supports animal husbandry and cow protection.', 'यह पशुपालन एवं गौ संरक्षण को सहयोग देता है।'),
      T('It works for rural development and livelihood.', 'यह ग्रामीण विकास एवं आजीविका के लिए कार्य करता है।'),
    ],
    T('A farmer trained in organic methods cuts chemical cost and keeps the soil healthy.', 'जैविक विधि में प्रशिक्षित किसान रासायनिक खर्च घटाता है और मिट्टी स्वस्थ रखता है।'),
    T('Learn one organic or low-cost farming practice and share it with a farmer.', 'एक जैविक या कम-लागत कृषि विधि सीखें और किसी किसान को बताएँ।'),
    T('Local seeds and cow-based compost are cheap and reliable.', 'देशी बीज और गौ-आधारित खाद सस्ते एवं भरोसेमंद हैं।'),
    T('Do not advise a pesticide or a dose without expert guidance.', 'विशेषज्ञ सलाह बिना कीटनाशक या उसकी मात्रा न बताएँ।'),
  ),
  CH(
    T('Social Justice & Awareness — aware citizens, stronger society', 'सामाजिक न्याय एवं जागरूकता — जागरूक नागरिक, मजबूत समाज'),
    T('Aware citizens build a stronger society.', 'जागरूक नागरिक, मजबूत समाज।'),
    [
      T('SSF spreads anti-corruption awareness and ethical education.', 'SSF भ्रष्टाचार जागरूकता एवं नैतिक शिक्षा फैलाता है।'),
      T('It works for national unity and communal harmony.', 'यह राष्ट्रीय एकता एवं सांप्रदायिक सद्भाव के लिए कार्य करता है।'),
      T('It promotes human rights awareness.', 'यह मानव अधिकार जागरूकता को बढ़ावा देता है।'),
    ],
    T('A neighbourhood that settles a dispute peacefully shows harmony in action.', 'जो मोहल्ला विवाद शांति से सुलझाता है, वह सद्भाव को कर्म में दिखाता है।'),
    T('Do one act today that strengthens harmony in your street or group.', 'आज एक कार्य करें जो आपकी गली या समूह में सद्भाव बढ़ाए।'),
    T('Talk about shared values, not divisions.', 'विभाजन की नहीं, साझा मूल्यों की बात करें।'),
    T('Do not forward an unverified message that targets any community.', 'किसी समुदाय को निशाना बनाने वाला असत्यापित संदेश आगे न भेजें।'),
  ),
  CH(
    T('Disability, Elderly & Rehabilitation — support with dignity', 'दिव्यांग एवं पुनर्वास — सम्मान के साथ सहयोग'),
    T('Support, dignity and rehabilitation for every person.', 'सहयोग, सम्मान और पुनर्वास।'),
    [
      T('SSF works for disability support.', 'SSF दिव्यांग सहयोग के लिए कार्य करता है।'),
      T('It supports rehabilitation of children with intellectual disabilities.', 'यह बौद्धिक दिव्यांगता वाले बच्चों के पुनर्वास को सहयोग देता है।'),
      T('It provides elderly support and orphan support.', 'यह वृद्धजन सहायता एवं अनाथ सहायता प्रदान करता है।'),
    ],
    T('A ramp at a school lets a wheelchair user study with dignity.', 'विद्यालय में एक रैंप दिव्यांग विद्यार्थी को सम्मान से पढ़ने देता है।'),
    T('Find one barrier near you — a step, a missing ramp — and report or fix it.', 'अपने पास एक बाधा खोजें — सीढ़ी, रैंप की कमी — और बताएँ या ठीक कराएँ।'),
    T('Ask the person what help they want before you act.', 'कार्य करने से पहले व्यक्ति से पूछें कि उसे क्या सहयोग चाहिए।'),
    T('Never use a disrespectful word for any disability.', 'किसी दिव्यांगता के लिए अपमानजनक शब्द कभी प्रयोग न करें।'),
  ),
  CH(
    T('Animal Protection — compassion for all living beings', 'पशु संरक्षण — जीवों के प्रति संवेदना'),
    T('Compassion and protection for living beings.', 'जीवों के प्रति संवेदना और संरक्षण।'),
    [
      T('SSF works for animal and bird protection.', 'SSF पशु एवं पक्षी संरक्षण के लिए कार्य करता है।'),
      T('It supports cow shelters (gaushala).', 'यह गौशाला को सहयोग देता है।'),
      T('It promotes wildlife protection awareness.', 'यह वन्यजीव संरक्षण जागरूकता को बढ़ावा देता है।'),
    ],
    T('Keeping water for birds in summer saves many lives.', 'गर्मी में पक्षियों के लिए पानी रखना कई जान बचाता है।'),
    T('Keep a bowl of clean water for birds and strays today.', 'आज पक्षियों एवं बेसहारा जीवों के लिए एक बर्तन साफ़ पानी रखें।'),
    T('Report an injured stray to a local rescue group instead of treating it yourself.', 'घायल बेसहारा जीव को स्वयं इलाज देने के बजाय स्थानीय बचाव समूह को बताएँ।'),
    T('Do not feed milk or human food to a stray animal without knowing what is safe for it.', 'बेसहारा जीव को सुरक्षित भोजन जाने बिना दूध या मानव-भोजन न खिलाएँ।'),
  ),
);

items.push(
  CH(
    T('Religious & Cultural — culture, education and harmony', 'धार्मिक एवं सांस्कृतिक — संस्कृति, शिक्षा और सद्भाव'),
    T('Culture, education and harmony together.', 'संस्कृति, शिक्षा और सद्भाव।'),
    [
      T('SSF promotes devotional music (bhajan).', 'SSF भजन को बढ़ावा देता है।'),
      T('It encourages Sanskrit education and music.', 'यह संस्कृत शिक्षा एवं संगीत को प्रोत्साहित करता है।'),
      T('It organises conferences and cultural programmes.', 'यह सम्मेलन एवं सांस्कृतिक कार्यक्रम आयोजित करता है।'),
    ],
    T('A cultural evening of bhajan and music brings a whole village together in joy.', 'भजन एवं संगीत की सांस्कृतिक संध्या पूरे गाँव को आनंद में जोड़ती है।'),
    T('Attend or help organise one local cultural or educational programme.', 'एक स्थानीय सांस्कृतिक या शैक्षिक कार्यक्रम में भाग लें या मदद करें।'),
    T('Keep every programme respectful to all faiths — SSF serves everyone.', 'हर कार्यक्रम सभी आस्थाओं के प्रति सम्मानपूर्ण रखें — SSF सबकी सेवा करता है।'),
    T('Never use a cultural platform to promote a political party or a commercial brand.', 'सांस्कृतिक मंच का प्रयोग किसी राजनीतिक दल या व्यावसायिक ब्रांड के प्रचार हेतु कभी न करें।'),
  ),
  CH(
    T('Membership — choose the tier that fits you', 'सदस्यता — अपने अनुकूल श्रेणी चुनें'),
    T('Name joining is the beginning; participation strengthens the mission.', 'नाम से जुड़ना शुरुआत है; सहभागिता से उद्देश्य मजबूत होता है।'),
    [
      T('General Member — ₹100/month (₹1,200/year) to stay connected and support the mission.', 'साधारण सदस्य — ₹100/माह (₹1,200/वर्ष) से जुड़े रहें और उद्देश्य को सहयोग दें।'),
      T('Active Member — ₹2,500/year to take an active role in SSF programmes and community service.', 'सक्रिय सदस्य — ₹2,500/वर्ष, SSF कार्यक्रमों एवं सामुदायिक सेवा में सक्रिय भूमिका हेतु।'),
      T('Life Member — a one-time contribution of ₹8,000+ for long-term association.', 'आजीवन सदस्य — दीर्घकालिक जुड़ाव हेतु ₹8,000+ का एकमुश्त योगदान।'),
      T('Advisory / Expert Member — honorary, for experienced professionals giving knowledge or guidance.', 'सलाहकार / विशेषज्ञ सदस्य — मानद, अनुभवी पेशेवरों हेतु जो ज्ञान या मार्गदर्शन देते हैं।'),
    ],
    T('A general member who brings one friend a month grows SSF faster than any advertisement.', 'हर माह एक मित्र लाने वाला साधारण सदस्य किसी विज्ञापन से तेज़ी से SSF बढ़ाता है।'),
    T('Read the four membership tiers on the Join page and note the one that fits you.', 'जुड़िए पेज पर चारों सदस्यता श्रेणियाँ पढ़ें और अपने अनुकूल श्रेणी चुनें।'),
    T('For paid membership, keep the payment reference — approval follows fee confirmation.', 'सशुल्क सदस्यता हेतु भुगतान संदर्भ रखें — शुल्क पुष्टि के बाद ही स्वीकृति होती है।'),
    T('The membership fee is confirmed before approval; pay only through the official SSF payment page.', 'सदस्यता शुल्क पुष्टि के बाद ही स्वीकृति; भुगतान केवल SSF के आधिकारिक भुगतान पेज से करें।'),
    {
      labh: T('An official membership record; paid tiers get an ID card and certificate after approval.', 'आधिकारिक सदस्यता अभिलेख; सशुल्क श्रेणियों को स्वीकृति के बाद पहचान-पत्र एवं प्रमाणपत्र।'),
      who: T('Any individual committed to SSF\'s mission and values.', 'कोई भी व्यक्ति जो SSF के उद्देश्य एवं मूल्यों के प्रति प्रतिबद्ध हो।'),
      docs: T('Name, contact details and membership type. An identity document is optional.', 'नाम, संपर्क विवरण एवं सदस्यता प्रकार। पहचान-दस्तावेज़ वैकल्पिक।'),
      where: T('Online at swastiksrijan.in → Join Us. Choose your membership tier and submit the form.', 'ऑनलाइन: swastiksrijan.in → जुड़िए। अपनी सदस्यता श्रेणी चुनें और फ़ॉर्म भेजें।'),
      fee: true,
    },
  ),
  CH(
    T('Volunteer — give your time, knowledge or skill', 'स्वयंसेवक — समय, ज्ञान या कौशल दें'),
    T('Every contribution is not financial.', 'हर योगदान पैसे से नहीं होता।'),
    [
      T('Field Volunteer — on-ground activities and community work.', 'क्षेत्रीय स्वयंसेवक — ज़मीनी गतिविधियाँ एवं सामुदायिक कार्य।'),
      T('Program Volunteer — support SSF programmes and drives.', 'कार्यक्रम स्वयंसेवक — SSF कार्यक्रमों एवं अभियानों में सहयोग।'),
      T('Professional Volunteer — lend a professional or specialised skill.', 'व्यावसायिक स्वयंसेवक — पेशेवर या विशेष कौशल दें।'),
      T('Digital / Online Volunteer — help from anywhere, online.', 'डिजिटल / ऑनलाइन स्वयंसेवक — कहीं से भी ऑनलाइन सहयोग करें।'),
    ],
    T('A digital volunteer in a city can design posters for a camp held in a village.', 'शहर का डिजिटल स्वयंसेवक गाँव में होने वाले शिविर के पोस्टर बना सकता है।'),
    T('Choose your volunteer type and submit the volunteer form today.', 'आज अपना स्वयंसेवक प्रकार चुनें और स्वयंसेवक फ़ॉर्म भेजें।'),
    T('You can volunteer from home; you do not need to travel to be useful.', 'आप घर से स्वयंसेवा कर सकते हैं; उपयोगी होने के लिए यात्रा ज़रूरी नहीं।'),
    T('Volunteer registration is free — never pay anyone to become an SSF volunteer.', 'स्वयंसेवक पंजीकरण निःशुल्क है — SSF स्वयंसेवक बनने के लिए किसी को पैसा न दें।'),
  ),
);

items.push(
  CH(
    T('Give what you have — time, knowledge, skill, will', 'जो आपके पास है वह दें — समय, ज्ञान, कौशल, इच्छा'),
    T('Your time, knowledge, skills and willingness can make a difference.', 'आपका समय, ज्ञान, कौशल और इच्छा बदलाव की शुरुआत हो सकते हैं।'),
    [
      T('TIME — serve with your time.', 'समय — अपने समय से सेवा करें।'),
      T('KNOWLEDGE — teach with your knowledge.', 'ज्ञान — अपने ज्ञान से सिखाएँ।'),
      T('SKILL — solve with your skill.', 'कौशल — अपने कौशल से समाधान दें।'),
      T('WILL — begin with your willingness.', 'इच्छा — अपनी इच्छा से शुरुआत करें।'),
      T('NETWORK — connect through your network.', 'संपर्क — अपने नेटवर्क से जोड़ें।'),
      T('RESOURCES — support with your resources.', 'संसाधन — अपने संसाधनों से सहयोग दें।'),
    ],
    T('Someone with no money but good contacts can connect SSF to a school that needs help.', 'जिसके पास पैसा नहीं पर अच्छे संपर्क हैं, वह SSF को ज़रूरतमंद विद्यालय से जोड़ सकता है।'),
    T('Pick one gift from the six and give it this week.', 'छह में से एक उपहार चुनें और इस सप्ताह दें।'),
    T('Six small gifts from six people can run a whole programme.', 'छह लोगों के छह छोटे उपहार एक पूरा कार्यक्रम चला सकते हैं।'),
    T('Give only what you genuinely have — do not overcommit and then withdraw.', 'केवल वही दें जो सचमुच आपके पास है — अधिक वादा करके पीछे न हटें।'),
  ),
  CH(
    T('Donate or Partner — support and collaboration', 'दान करें या साझेदार बनें — सहयोग एवं भागीदारी'),
    T('Support within your capacity, or collaborate with your institution.', 'अपनी क्षमता के अनुसार सहयोग करें, या अपनी संस्था के साथ मिलकर काम करें।'),
    [
      T('As a Donor, support any SSF initiative according to your capacity.', 'दानदाता के रूप में, अपनी क्षमता के अनुसार किसी भी SSF पहल को सहयोग दें।'),
      T('As a Partner, collaborate as a school, hospital, company, institution, professional or NGO.', 'साझेदार के रूप में, विद्यालय, अस्पताल, कंपनी, संस्था, पेशेवर या NGO के रूप में सहयोग करें।'),
      T('SSF welcomes lawful, transparent and objective-aligned partnerships.', 'SSF विधिसम्मत, पारदर्शी एवं उद्देश्य-अनुरूप साझेदारी का स्वागत करता है।'),
    ],
    T('A local company can sponsor a health camp and its staff can also volunteer.', 'एक स्थानीय कंपनी स्वास्थ्य शिविर प्रायोजित कर सकती है और उसके कर्मचारी स्वयंसेवा भी कर सकते हैं।'),
    T('If you have resources or a network, ask the SSF team how you can support.', 'यदि आपके पास संसाधन या नेटवर्क है, तो SSF टीम से पूछें कि आप कैसे सहयोग कर सकते हैं।'),
    T('Partnership works best when both sides are clear about the goal and the record.', 'साझेदारी तब बेहतर चलती है जब दोनों पक्ष लक्ष्य एवं अभिलेख पर स्पष्ट हों।'),
    T('Never make a donation promise in SSF\'s name without the team\'s written confirmation.', 'टीम की लिखित पुष्टि बिना SSF के नाम पर दान का वादा कभी न करें।'),
  ),
);

items.push(
  CH(
    T('Take responsibility — grow into a leader', 'जिम्मेदारी लें — नेतृत्व की ओर बढ़ें'),
    T('Joining is the beginning. Participation starts change. Leadership sustains it.', 'नाम जुड़ना शुरुआत है। सहभागिता बदलाव की शुरुआत है। नेतृत्व उसे टिकाता है।'),
    [
      T('Level 1 — I want to join: a simple registration, your first step.', 'स्तर 1 — मैं जुड़ना चाहता हूँ: सरल पंजीकरण, आपका पहला कदम।'),
      T('Level 2 — I want to participate: activities, volunteering and active involvement.', 'स्तर 2 — मैं सहभागिता करना चाहता हूँ: गतिविधियाँ, स्वयंसेवा एवं सक्रिय भागीदारी।'),
      T('Level 3 — I want to take responsibility: coordinator, team and leadership opportunities.', 'स्तर 3 — मैं जिम्मेदारी लेना चाहता हूँ: समन्वयक, टीम एवं नेतृत्व के अवसर।'),
    ],
    T('A steady volunteer who coordinates a local team turns one good camp into a monthly habit.', 'स्थानीय टीम का नेतृत्व करने वाला नियमित स्वयंसेवक एक अच्छे शिविर को मासिक अभ्यास बना देता है।'),
    T('After you join, volunteer for one small responsibility this month.', 'जुड़ने के बाद, इस माह एक छोटी जिम्मेदारी स्वेच्छा से लें।'),
    T('Reliability is the first leadership skill — do what you promised, on time.', 'भरोसेमंद होना पहला नेतृत्व कौशल है — जो वादा किया, समय पर करें।'),
    T('Do not take a responsibility you cannot give time to; someone else can do it better.', 'जिस जिम्मेदारी का समय न दे सकें, वह न लें; कोई और उसे बेहतर कर सकता है।'),
  ),
  CH(
    T('Take your first step today', 'आज अपना पहला कदम उठाएँ'),
    T('Maybe that person is you.', 'शायद वह व्यक्ति आप हैं।'),
    [
      T('Open swastiksrijan.in → Join Us and choose Member, Volunteer, Donor or Partner.', 'swastiksrijan.in → जुड़िए खोलें और सदस्य, स्वयंसेवक, दानदाता या साझेदार चुनें।'),
      T('Fill the official form for your role — it takes only a few minutes.', 'अपनी भूमिका का आधिकारिक फ़ॉर्म भरें — इसमें कुछ ही मिनट लगते हैं।'),
      T('The SSF team will review and welcome you into the work.', 'SSF टीम समीक्षा करेगी और आपको कार्य में स्वागत करेगी।'),
    ],
    T('In 2013 SSF began with ordinary people; today the same invitation is open to you.', '2013 में SSF साधारण लोगों से शुरू हुआ; आज वही निमंत्रण आपके लिए खुला है।'),
    T('Share the SSF Join page with one person today and take your own first step.', 'आज SSF का जुड़िए पेज किसी एक को भेजें और स्वयं अपना पहला कदम उठाएँ।'),
    T('One honest first step beats a perfect plan never started.', 'एक ईमानदार पहला कदम उस पूर्ण योजना से बेहतर है जो कभी शुरू नहीं हुई।'),
    T('Verify any SSF request through the official website or the team — never trust a forwarded link alone.', 'किसी भी SSF अनुरोध को आधिकारिक वेबसाइट या टीम से सत्यापित करें — अकेले फ़ॉरवर्ड किए लिंक पर भरोसा न करें।'),
    {
      labh: T('A place in SSF\'s work — as member, volunteer, donor or partner.', 'SSF के कार्य में स्थान — सदस्य, स्वयंसेवक, दानदाता या साझेदार के रूप में।'),
      who: T('Everyone who shares SSF\'s values — no prior experience needed.', 'हर वह व्यक्ति जो SSF के मूल्यों से सहमत हो — पूर्व अनुभव आवश्यक नहीं।'),
      docs: T('Just your basic details. Identity documents are optional.', 'केवल आपके बुनियादी विवरण। पहचान-दस्तावेज़ वैकल्पिक।'),
      where: T('Online at swastiksrijan.in → Join Us, or contact the SSF team through the website.', 'ऑनलाइन: swastiksrijan.in → जुड़िए, या वेबसाइट से SSF टीम से संपर्क करें।'),
    },
  ),
);

module.exports = {
  key: 'join',
  emoji: '🤝',
  category: 'community',
  title: T('Join SSF — One Way to Serve a Day', 'जुड़िए SSF से — रोज़ एक सेवा-मार्ग'),
  note: T('SSF never asks for money to give you a volunteer role or a certificate. Verify every request through the official website swastiksrijan.in or the SSF team.',
    'स्वयंसेवक भूमिका या प्रमाणपत्र देने के लिए SSF कभी पैसा नहीं माँगता। हर अनुरोध को आधिकारिक वेबसाइट swastiksrijan.in या SSF टीम से सत्यापित करें।'),
  cta: T('Join SSF — as a member, volunteer, donor or partner.', 'SSF से जुड़ें — सदस्य, स्वयंसेवक, दानदाता या साझेदार के रूप में।'),
  ctaUrl: 'https://swastiksrijan.in/JoinUs',
  ctaLabel: T('Join SSF', 'SSF से जुड़ें'),
  verified: '2026-10',
  items,
};
