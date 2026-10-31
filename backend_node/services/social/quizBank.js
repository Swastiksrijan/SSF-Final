// SSF Awareness Quiz — curated question bank.
//
// Objective (नियमावली): उद्देश्य 1, 4, 6, 7 — जन-जागरूकता, शिक्षा, नैतिक मूल्य,
// कौशल एवं रोजगार योग्यता।
//
// SECURITY: the correct answers live ONLY here on the server. The quiz API never
// sends `answer` or `explain` to the browser — it sends question id, the question
// text and the options; scoring happens on submit. The client cannot see the key.
//
// All questions are drawn from the daily-series subjects (Samvidhan, Sarkari
// Yojana, Charak/health, General Knowledge, English, Moral values) so a daily
// reader is already prepared. Pass mark: 80%.

const Q = (id, subject, qEn, qHi, options, answer, exEn, exHi) => ({
  id, subject,
  q: { en: qEn, hi: qHi },
  options: options.map((o) => ({ en: o[0], hi: o[1] })),
  answer,
  explain: { en: exEn, hi: exHi },
});

// Each option is [englishText, hindiText]; `answer` is the 0-based correct index.
const QUESTIONS = [
  // ---- Samvidhan (Constitution) ----
  Q('gov-1', 'samvidhan', 'Which article of the Constitution guarantees equality before the law?', 'संविधान का कौन-सा अनुच्छेद कानून के समक्ष समता की गारंटी देता है?',
    [['Article 14', 'अनुच्छेद 14'], ['Article 19', 'अनुच्छेद 19'], ['Article 21', 'अनुच्छेद 21'], ['Article 32', 'अनुच्छेद 32']],
    0, 'Article 14 guarantees equality before the law and equal protection of the laws.', 'अनुच्छेद 14 कानून के समक्ष समता एवं कानूनों के समान संरक्षण की गारंटी देता है।'),
  Q('gov-2', 'samvidhan', 'Which article is called the "heart and soul" of the Constitution?', 'किस अनुच्छेद को संविधान की "आत्मा" कहा जाता है?',
    [['Article 21', 'अनुच्छेद 21'], ['Article 32', 'अनुच्छेद 32'], ['Article 44', 'अनुच्छेद 44'], ['Article 51A', 'अनुच्छेद 51A']],
    1, 'Article 32 gives the right to move the Supreme Court for enforcement of fundamental rights.', 'अनुच्छेद 32 मूल अधिकारों के प्रवर्तन हेतु सर्वोच्च न्यायालय जाने का अधिकार देता है।'),
  Q('gov-3', 'samvidhan', 'Free and compulsory education for children aged 6–14 is under which article?', '6–14 वर्ष के बच्चों हेतु निःशुल्क एवं अनिवार्य शिक्षा किस अनुच्छेद के अंतर्गत है?',
    [['Article 19', 'अनुच्छेद 19'], ['Article 21A', 'अनुच्छेद 21A'], ['Article 23', 'अनुच्छेद 23'], ['Article 40', 'अनुच्छेद 40']],
    1, 'Article 21A (added by the 86th Amendment, 2002) guarantees free and compulsory education for ages 6–14.', 'अनुच्छेद 21A (86वाँ संशोधन, 2002) 6–14 वर्ष हेतु निःशुल्क एवं अनिवार्य शिक्षा देता है।'),
  Q('gov-4', 'samvidhan', 'Fundamental Duties of citizens are listed under which article?', 'नागरिकों के मूल कर्तव्य किस अनुच्छेद में हैं?',
    [['Article 32', 'अनुच्छेद 32'], ['Article 44', 'अनुच्छेद 44'], ['Article 51A', 'अनुच्छेद 51A'], ['Article 15', 'अनुच्छेद 15']],
    2, 'Article 51A lists the Fundamental Duties of citizens.', 'अनुच्छेद 51A नागरिकों के मूल कर्तव्यों की सूची देता है।'),
  Q('gov-5', 'samvidhan', 'The word "Secular", describing the State, was made explicit by which amendment?', 'राज्य को "पंथनिरपेक्ष" बताने वाला शब्द किस संशोधन द्वारा स्पष्ट किया गया?',
    [['42nd Amendment, 1976', '42वाँ संशोधन, 1976'], ['86th Amendment, 2002', '86वाँ संशोधन, 2002'], ['73rd Amendment, 1992', '73वाँ संशोधन, 1992'], ['44th Amendment, 1978', '44वाँ संशोधन, 1978']],
    0, 'The 42nd Amendment (1976) added the words socialist and secular to the Preamble.', '42वें संशोधन (1976) ने प्रस्तावना में समाजवादी एवं पंथनिरपेक्ष शब्द जोड़े।'),
  Q('gov-6', 'samvidhan', 'Untouchability in any form is abolished under which article?', 'किसी भी रूप में अस्पृश्यता किस अनुच्छेद द्वारा समाप्त की गई है?',
    [['Article 14', 'अनुच्छेद 14'], ['Article 17', 'अनुच्छेद 17'], ['Article 21', 'अनुच्छेद 21'], ['Article 25', 'अनुच्छेद 25']],
    1, 'Article 17 abolishes untouchability; its practice is a punishable offence.', 'अनुच्छेद 17 अस्पृश्यता समाप्त करता है; इसका आचरण दंडनीय है।'),

  // ---- Sarkari Yojana (Schemes) ----
  Q('sch-1', 'yojana', 'PM-KISAN gives income support to which group?', 'पीएम-किसान किस समूह को आय सहायता देती है?',
    [['Street vendors', 'रेहड़ी-पटरी विक्रेता'], ['Eligible landholding farmer families', 'पात्र भूमि-धारक किसान परिवार'], ['School teachers', 'स्कूल शिक्षक'], ['Bus drivers', 'बस चालक']],
    1, 'PM-KISAN provides direct income support to eligible landholding farmer families.', 'पीएम-किसान पात्र भूमि-धारक किसान परिवारों को प्रत्यक्ष आय सहायता देती है।'),
  Q('sch-2', 'yojana', 'MGNREGA guarantees how many days of wage work per rural household per year?', 'मनरेगा प्रति ग्रामीण परिवार प्रति वर्ष कितने दिन मज़दूरी कार्य की गारंटी देती है?',
    [['50 days', '50 दिन'], ['100 days', '100 दिन'], ['150 days', '150 दिन'], ['365 days', '365 दिन']],
    1, 'MGNREGA guarantees at least 100 days of unskilled wage work per rural household per year.', 'मनरेगा प्रति ग्रामीण परिवार प्रति वर्ष कम से कम 100 दिन अकुशल मज़दूरी कार्य की गारंटी देती है।'),
  Q('sch-3', 'yojana', 'Ayushman Bharat (PM-JAY) mainly provides which benefit?', 'आयुष्मान भारत (PM-JAY) मुख्यतः क्या लाभ देती है?',
    [['Free mobile phones', 'निःशुल्क मोबाइल'], ['Health cover for hospitalisation', 'भर्ती उपचार हेतु स्वास्थ्य सुरक्षा'], ['Free train travel', 'निःशुल्क रेल यात्रा'], ['Crop insurance only', 'केवल फसल बीमा']],
    1, 'PM-JAY gives eligible families health assurance covering hospitalisation at empanelled hospitals.', 'PM-JAY पात्र परिवारों को सूचीबद्ध अस्पतालों में भर्ती उपचार हेतु स्वास्थ्य आश्वासन देती है।'),
  Q('sch-4', 'yojana', 'Sukanya Samriddhi Yojana is a savings scheme for whom?', 'सुकन्या समृद्धि योजना किसके लिए बचत योजना है?',
    [['A senior citizen', 'वरिष्ठ नागरिक'], ['A girl child', 'बालिका'], ['A small business', 'छोटा व्यापार'], ['A farmer', 'किसान']],
    1, 'Sukanya Samriddhi Yojana is a small-deposit savings scheme for a girl child.', 'सुकन्या समृद्धि योजना बालिका हेतु लघु जमा बचत योजना है।'),
  Q('sch-5', 'yojana', 'A genuine government scheme application should always be made where?', 'असली सरकारी योजना का आवेदन सदैव कहाँ करना चाहिए?',
    [['On any WhatsApp link', 'किसी WhatsApp लिंक पर'], ['On the official .gov.in portal / CSC', 'आधिकारिक .gov.in पोर्टल / CSC पर'], ['Through a stranger\'s personal app', 'अजनबी के निजी ऐप से'], ['By sharing your bank OTP', 'बैंक OTP साझा करके']],
    1, 'Genuine schemes are applied for only on official .gov.in sites, a bank, or a CSC.', 'असली योजनाओं का आवेदन केवल आधिकारिक .gov.in साइट, बैंक या CSC पर होता है।'),
  Q('sch-6', 'yojana', 'PM Mudra Yojana provides what kind of support?', 'पीएम मुद्रा योजना किस प्रकार की सहायता देती है?',
    [['A grant that need not be repaid', 'अनुदान जो चुकाना नहीं'], ['A collateral-free micro/small business loan', 'बिना जमानत सूक्ष्म/छोटा व्यापार ऋण'], ['A pension', 'पेंशन'], ['A scholarship', 'छात्रवृत्ति']],
    1, 'Mudra offers collateral-free micro/small business loans through banks/NBFCs — it is a loan, not a grant.', 'मुद्रा बैंक/NBFC से बिना जमानत सूक्ष्म/छोटा व्यापार ऋण देती है — यह ऋण है, अनुदान नहीं।'),

  // ---- Charak / health ----
  Q('hlth-1', 'swasthya', 'In Ayurveda, which three are called the pillars of health?', 'आयुर्वेद में स्वास्थ्य के तीन स्तंभ कौन हैं?',
    [['Food, sleep and regulated conduct', 'आहार, निद्रा एवं नियंत्रित आचरण'], ['Money, fame and power', 'धन, यश एवं शक्ति'], ['Salt, sugar and oil', 'नमक, चीनी एवं तेल'], ['Walking, running and jumping', 'चलना, दौड़ना एवं कूदना']],
    0, 'Ahara (food), Nidra (sleep) and Brahmacharya (regulated conduct) are the three pillars.', 'आहार, निद्रा एवं ब्रह्मचर्य (नियंत्रित आचरण) तीन स्तंभ हैं।'),
  Q('hlth-2', 'swasthya', 'What is the correct first-aid for a minor burn?', 'हल्की जलन हेतु सही प्राथमिक चिकित्सा क्या है?',
    [['Apply toothpaste', 'टूथपेस्ट लगाएँ'], ['Apply oil or ghee', 'तेल या घी लगाएँ'], ['Cool running water for 20 minutes', '20 मिनट ठंडा बहता पानी डालें'], ['Cover tightly with cloth', 'कपड़े से कसकर ढकें']],
    2, 'Cool running water for about 20 minutes; never apply toothpaste, oil or ghee.', 'लगभग 20 मिनट ठंडा बहता पानी; टूथपेस्ट, तेल या घी कभी न लगाएँ।'),
  Q('hlth-3', 'swasthya', 'Which habit most directly prevents diarrhoea and infections?', 'कौन-सी आदत दस्त एवं संक्रमण को सबसे सीधे रोकती है?',
    [['Sleeping late', 'देर से सोना'], ['Washing hands with soap', 'साबुन से हाथ धोना'], ['Drinking less water', 'कम पानी पीना'], ['Eating more sugar', 'अधिक चीनी खाना']],
    1, 'Washing hands with soap before eating and after toilet prevents diarrhoea and infections.', 'खाने से पहले एवं शौच के बाद साबुन से हाथ धोना दस्त एवं संक्रमण रोकता है।'),
  Q('hlth-4', 'swasthya', 'Which vitamin does the body make with the help of sunlight?', 'सूर्य की धूप की मदद से शरीर कौन-सा विटामिन बनाता है?',
    [['Vitamin A', 'विटामिन A'], ['Vitamin C', 'विटामिन C'], ['Vitamin D', 'विटामिन D'], ['Vitamin K', 'विटामिन K']],
    2, 'Sunlight helps the body make Vitamin D, needed for strong bones.', 'धूप शरीर को विटामिन D बनाने में मदद करती है, जो मज़बूत हड्डियों हेतु आवश्यक है।'),
  Q('hlth-5', 'swasthya', 'How is addiction best described?', 'व्यसन को सर्वोत्तम रूप से कैसे वर्णित किया जाए?',
    [['A character flaw to be shamed', 'चरित्र-दोष जिस पर शर्म आनी चाहिए'], ['A treatable condition helped by support and medical care', 'उपचार योग्य स्थिति जिसमें सहयोग एवं चिकित्सा मदद करती है'], ['Something to ignore', 'जिसे नज़रअंदाज़ करें'], ['Only a police matter', 'केवल पुलिस का मामला']],
    1, 'Addiction can be treated; support and medical help increase the chance of recovery.', 'व्यसन का इलाज संभव है; सहयोग एवं चिकित्सकीय मदद से स्वस्थ होने की संभावना बढ़ती है।'),
  Q('hlth-6', 'swasthya', 'How many hours of sleep do most students need for good concentration?', 'अच्छे ध्यान हेतु अधिकांश विद्यार्थियों को कितने घंटे की नींद चाहिए?',
    [['2–3 hours', '2–3 घंटे'], ['4–5 hours', '4–5 घंटे'], ['7–8 hours', '7–8 घंटे'], ['12–14 hours', '12–14 घंटे']],
    2, 'About 7–8 hours at a fixed time improves concentration and health.', 'निश्चित समय पर लगभग 7–8 घंटे ध्यान एवं स्वास्थ्य सुधारते हैं।'),

  // ---- General Knowledge ----
  Q('gk-1', 'gk', 'Which is the largest organ of the human body?', 'मानव शरीर का सबसे बड़ा अंग कौन-सा है?',
    [['Liver', 'यकृत'], ['Skin', 'त्वचा'], ['Heart', 'हृदय'], ['Lungs', 'फेफड़े']],
    1, 'The skin is the largest organ; the liver is the largest internal organ.', 'त्वचा सबसे बड़ा अंग है; यकृत सबसे बड़ा आंतरिक अंग है।'),
  Q('gk-2', 'gk', 'What is the national bird of India?', 'भारत का राष्ट्रीय पक्षी कौन है?',
    [['Parrot', 'तोता'], ['Peacock', 'मोर'], ['Eagle', 'चील'], ['Swan', 'हंस']],
    1, 'The Indian peacock is the national bird, adopted in 1963.', 'भारतीय मोर राष्ट्रीय पक्षी है, जिसे 1963 में अपनाया गया।'),
  Q('gk-3', 'gk', 'Which is the longest river flowing within India?', 'भारत के भीतर बहने वाली सबसे लंबी नदी कौन-सी है?',
    [['Yamuna', 'यमुना'], ['Godavari', 'गोदावरी'], ['Ganga', 'गंगा'], ['Narmada', 'नर्मदा']],
    2, 'The Ganga is the longest river flowing within India and the national river.', 'गंगा भारत के भीतर बहने वाली सबसे लंबी नदी एवं राष्ट्रीय नदी है।'),
  Q('gk-4', 'gk', 'What is the difference between weather and climate?', 'मौसम और जलवायु में क्या अंतर है?',
    [['They mean the same', 'दोनों एक ही हैं'], ['Weather is daily; climate is the long-term pattern', 'मौसम दैनिक; जलवायु दीर्घकालिक प्रतिरूप'], ['Climate changes every hour', 'जलवायु हर घंटे बदलती है'], ['Weather is measured in years', 'मौसम वर्षों में मापा जाता है']],
    1, 'Weather is day-to-day; climate is the average over a long period.', 'मौसम दिन-प्रतिदिन; जलवायु दीर्घकाल की औसत स्थिति है।'),
  Q('gk-5', 'gk', 'Which nutrient from green leafy vegetables helps protect eyesight?', 'हरी पत्तेदार सब्जियों का कौन-सा पोषक तत्व दृष्टि बचाता है?',
    [['Vitamin A', 'विटामिन A'], ['Vitamin D', 'विटामिन D'], ['Vitamin K', 'विटामिन K'], ['Vitamin B12', 'विटामिन B12']],
    0, 'Vitamin A (and iron/calcium) comes from green leafy vegetables and protects eyesight.', 'विटामिन A (एवं लौह/कैल्शियम) हरी पत्तेदार सब्जियों से मिलता है और दृष्टि बचाता है।'),
  Q('gk-6', 'gk', 'In a democracy, how many votes does each adult citizen have?', 'लोकतंत्र में प्रत्येक वयस्क नागरिक का कितना मत होता है?',
    [['As many as properties owned', 'जितनी संपत्ति उतने मत'], ['One vote of equal value', 'एक समान मूल्य का मत'], ['Only if educated', 'केवल शिक्षित होने पर'], ['Two votes', 'दो मत']],
    1, 'Every adult citizen has one vote of equal value.', 'प्रत्येक वयस्क नागरिक का एक समान मूल्य का मत होता है।'),

  // ---- English ----
  Q('eng-1', 'english-word', 'What does the word "education" mean?', '"education" शब्द का अर्थ क्या है?',
    [['The process of teaching and learning', 'सिखाने एवं सीखने की प्रक्रिया'], ['A type of food', 'एक प्रकार का भोजन'], ['A place to sleep', 'सोने का स्थान'], ['A kind of machine', 'एक प्रकार की मशीन']],
    0, 'Education is the process of teaching and learning.', 'Education सिखाने एवं सीखने की प्रक्रिया है।'),
  Q('eng-2', 'english-word', 'Which English word means "the group that runs a country"?', 'कौन-सा अंग्रेज़ी शब्द "देश चलाने वाले समूह" को दर्शाता है?',
    [['Garden', 'Garden'], ['Government', 'Government'], ['Graduation', 'Graduation'], ['Guest', 'Guest']],
    1, 'Government = the group that runs and rules a country or state.', 'Government = देश या राज्य चलाने एवं शासन करने वाला समूह।'),
  Q('eng-3', 'english-word', 'What is the meaning of "honesty"?', '"honesty" का अर्थ क्या है?',
    [['Always telling the truth', 'सदा सच बोलना'], ['Running fast', 'तेज़ दौड़ना'], ['Being rich', 'अमीर होना'], ['Staying awake', 'जागते रहना']],
    0, 'Honesty means always telling the truth and not cheating.', 'Honesty का अर्थ सदा सच बोलना एवं बेईमानी न करना।'),
  Q('eng-4', 'english-word', 'Which word means "working together toward a shared goal"?', 'कौन-सा शब्द "साझा लक्ष्य हेतु मिलकर काम करना" दर्शाता है?',
    [['Competition', 'Competition'], ['Cooperation', 'Cooperation'], ['Confusion', 'Confusion'], ['Correction', 'Correction']],
    1, 'Cooperation = working together toward a shared goal.', 'Cooperation = साझा लक्ष्य हेतु मिलकर काम करना।'),
  Q('eng-5', 'english-word', 'What does "dignity" mean?', '"dignity" का अर्थ क्या है?',
    [['The right to be respected as a person', 'व्यक्ति के रूप में सम्मान पाने का अधिकार'], ['A kind of disease', 'एक प्रकार का रोग'], ['A government office', 'एक सरकारी कार्यालय'], ['A festival', 'एक पर्व']],
    0, 'Dignity is the right to be respected and valued as a person.', 'Dignity व्यक्ति के रूप में सम्मान एवं मूल्य पाने का अधिकार है।'),
  Q('eng-6', 'english-word', 'Which word means "being free from danger or harm"?', 'कौन-सा शब्द "खतरे या हानि से मुक्त होना" दर्शाता है?',
    [['Safety', 'Safety'], ['Sadness', 'Sadness'], ['Silence', 'Silence'], ['Speed', 'Speed']],
    0, 'Safety = being free from danger or harm.', 'Safety = खतरे या हानि से मुक्त होना।'),

  // ---- Moral values ----
  Q('val-1', 'prerna', 'What does "consistency beats intensity" mean?', '"निरंतरता तीव्रता से बेहतर है" का क्या अर्थ है?',
    [['Do everything in one day', 'सब कुछ एक दिन में करें'], ['Small daily effort wins over rare big effort', 'रोज़ का छोटा प्रयास कभी-कभार के बड़े प्रयास से बेहतर है'], ['Never work hard', 'कभी कठिन परिश्रम न करें'], ['Only big efforts matter', 'केवल बड़े प्रयास मायने रखते हैं']],
    1, 'Daily small habits decide long-term success more than rare big efforts.', 'रोज़ की छोटी आदतें दीर्घकालिक सफलता कभी-कभार के बड़े प्रयास से अधिक तय करती हैं।'),
  Q('val-2', 'prerna', 'A citizen\'s fundamental duties are important because…', 'नागरिक के मूल कर्तव्य महत्वपूर्ण हैं क्योंकि…',
    [['They replace fundamental rights', 'वे मूल अधिकारों का विकल्प हैं'], ['They complement rights and make them real for all', 'वे अधिकारों के पूरक हैं एवं सबके लिए उन्हें सार्थक बनाते हैं'], ['They are only for officials', 'वे केवल अधिकारियों के लिए हैं'], ['They can be ignored', 'उन्हें नज़रअंदाज़ किया जा सकता है']],
    1, 'Duties complement rights and make them real for everyone.', 'कर्तव्य अधिकारों के पूरक हैं एवं सबके लिए उन्हें सार्थक बनाते हैं।'),
  Q('val-3', 'prerna', 'What is the best way to treat people of other religions and castes?', 'दूसरे धर्म एवं जाति के लोगों के साथ सर्वोत्तम व्यवहार क्या है?',
    [['Avoid them', 'उनसे बचें'], ['Respect them equally', 'उनका समान सम्मान करें'], ['Only talk on festivals', 'केवल पर्व पर बात करें'], ['Ignore their rights', 'उनके अधिकार अनदेखा करें']],
    1, 'Respecting all faiths and castes keeps society united and peaceful.', 'सभी आस्थाओं एवं जातियों का सम्मान समाज को जोड़े एवं शांत रखता है।'),
  Q('val-4', 'prerna', 'Time is called the real wealth because…', 'समय को असली धन कहा जाता है क्योंकि…',
    [['It can be earned back later', 'इसे बाद में कमाया जा सकता है'], ['It cannot be earned back, only used well', 'इसे वापस नहीं पाया जा सकता, केवल सदुपयोग हो सकता है'], ['It is free', 'यह निःशुल्क है'], ['It never runs out', 'यह कभी खत्म नहीं होता']],
    1, 'Time cannot be earned back; it can only be used well.', 'समय लौटकर नहीं आता; केवल सदुपयोग हो सकता है।'),
  Q('val-5', 'prerna', 'Why should we save water?', 'हमें जल क्यों बचाना चाहिए?',
    [['Because it is expensive', 'क्योंकि यह महँगा है'], ['Because clean water is limited and shared by all', 'क्योंकि स्वच्छ जल सीमित है एवं सबका साझा है'], ['Only if the tap leaks', 'केवल नल टपके तो'], ['It is not important', 'यह महत्वपूर्ण नहीं']],
    1, 'Clean water is limited; saving it is everyone\'s duty.', 'स्वच्छ जल सीमित है; इसे बचाना सबका कर्तव्य है।'),
  Q('val-6', 'prerna', 'Real service to others should be done…', 'दूसरों की सच्ची सेवा कैसे करनी चाहिए?',
    [['Only for photos and fame', 'केवल फोटो एवं प्रसिद्धि हेतु'], ['Expecting nothing in return', 'बिना कुछ अपेक्षा के'], ['Only on festivals', 'केवल पर्व पर'], ['By hurting someone\'s self-respect', 'किसी का स्वाभिमान तोड़कर']],
    1, 'Real service expects no return and respects the other person\'s dignity.', 'सच्ची सेवा प्रतिफल की अपेक्षा नहीं करती एवं दूसरे की गरिमा का सम्मान करती है।'),
];

const SUBJECTS = ['samvidhan', 'yojana', 'swasthya', 'gk', 'english-word', 'prerna'];
const SUBJECT_TITLES = {
  samvidhan: { en: 'Constitution & Citizenship', hi: 'संविधान एवं नागरिकता' },
  yojana: { en: 'Government Schemes', hi: 'सरकारी योजनाएँ' },
  swasthya: { en: 'Health & Hygiene', hi: 'स्वास्थ्य एवं स्वच्छता' },
  gk: { en: 'General Knowledge', hi: 'सामान्य ज्ञान' },
  'english-word': { en: 'English & Vocabulary', hi: 'अंग्रेज़ी एवं शब्दावली' },
  prerna: { en: 'Values & Social Awareness', hi: 'मूल्य एवं सामाजिक जागरूकता' },
};
const QUIZ_CATALOG = [
  { quizId: 'ssf-awareness-1', subject: 'all', title: { en: 'SSF General Awareness Quiz', hi: 'SSF सामान्य जागरूकता प्रश्नोत्तरी' }, description: { en: 'A mixed assessment across all six learning subjects.', hi: 'छहों विषयों पर आधारित मिश्रित प्रश्नोत्तरी।' } },
  ...SUBJECTS.map((subject) => ({ quizId: `ssf-${subject}-quiz`, subject, title: SUBJECT_TITLES[subject], description: { en: `Test your knowledge in ${SUBJECT_TITLES[subject].en}.`, hi: `${SUBJECT_TITLES[subject].hi} में अपना ज्ञान जाँचें।` } })),
];
const byId = {};
for (const q of QUESTIONS) byId[q.id] = q;

// A stable shuffle so the same quizId always yields the same paper (deterministic
// for a given seed) but questions are not in bank order.
function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a 10-question paper for a quiz id. `seed` makes the paper stable, so a
 * page refresh shows the same questions (the answers are scored server-side).
 * The returned questions deliberately OMIT `answer` and `explain`.
 */
function buildQuiz(quizId = 'ssf-awareness-1', size = 10) {
  let seed = 0;
  for (const ch of String(quizId)) seed = (seed * 31 + ch.charCodeAt(0)) & 0x7fffffff;
  const catalogItem = QUIZ_CATALOG.find((item) => item.quizId === quizId);
  const subject = catalogItem?.subject;
  const pool = subject && subject !== 'all' ? QUESTIONS.filter((q) => q.subject === subject) : QUESTIONS;
  const picked = shuffle(pool, seed).slice(0, Math.min(size, pool.length));
  return {
    quizId,
    subject: subject || 'all',
    title: catalogItem?.title || { en: 'SSF Awareness Quiz', hi: 'SSF जागरूकता प्रश्नोत्तरी' },
    passPercent: 80,
    size: picked.length,
    questions: picked.map((q) => ({ id: q.id, subject: q.subject, q: q.q, options: q.options })),
  };
}

// Score a submission server-side. `answers` is { questionId: optionIndex }.
// Returns { correct, total, percent, passed, wrong:[{id, correctIndex, explain}] }.
function scoreQuiz(quizId, answers, size = 10) {
  const paper = buildQuiz(quizId, size);
  let correct = 0;
  const wrong = [];
  for (const q of paper.questions) {
    const src = byId[q.id];
    const given = answers ? answers[q.id] : undefined;
    if (Number(given) === src.answer) correct += 1;
    else wrong.push({ id: q.id, correctIndex: src.answer, explain: src.explain });
  }
  const total = paper.questions.length;
  const percent = Math.round((correct / total) * 100);
  return { correct, total, percent, passed: percent >= paper.passPercent, wrong, passPercent: paper.passPercent };
}

module.exports = { QUESTIONS, SUBJECTS, SUBJECT_TITLES, QUIZ_CATALOG, buildQuiz, scoreQuiz, byId };
