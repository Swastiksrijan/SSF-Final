// Series 4 — आज का सामान्य ज्ञान (General Knowledge) — रोज़ एक प्रश्न.
//
// Objective (नियमावली): उद्देश्य 1 एवं 6 — शिक्षा, जनचेतना, नैतिक मूल्य।
//
// Format: a question to think about, three solid facts, a real-life link and a
// small task. Facts are India/world general knowledge that does not change
// quickly; where a figure could change, it is stated without a hard number.
//
// Bilingual (EN + HI).

const { CH, T } = require('./seriesEngine');

const items = [
  CH(
    T('Which is the largest organ of the human body?', 'मानव शरीर का सबसे बड़ा अंग कौन-सा है?'),
    T('Answer before you scroll: the body\'s biggest organ.', 'उत्तर देने से पहले सोचें: शरीर का सबसे बड़ा अंग।'),
    [
      T('The skin is the largest organ of the human body.', 'त्वचा मानव शरीर का सबसे बड़ा अंग है।'),
      T('It protects the body, controls temperature and senses touch.', 'यह शरीर की रक्षा करती है, तापमान नियंत्रित करती है एवं स्पर्श का अनुभव देती है।'),
      T('The liver is the largest internal organ.', 'यकृत (लिवर) सबसे बड़ा आंतरिक अंग है।'),
    ],
    T('Sun protection and hygiene protect the skin — the body\'s first shield.', 'धूप से बचाव एवं स्वच्छता त्वचा की रक्षा करते हैं — शरीर की पहली ढाल।'),
    T('Share this question with one child and let them guess first.', 'यह प्रश्न एक बच्चे से पूछें और पहले अनुमान लगाने दें।'),
    T('Asking "why" turns facts into understanding.', '"क्यों" पूछना तथ्यों को समझ में बदलता है।'),
    T('General knowledge is a starting point — verify details from a reliable source.', 'सामान्य ज्ञान एक शुरुआत है — विवरण विश्वसनीय स्रोत से जाँचें।'),
  ),
  CH(
    T('What is the national bird of India and why?', 'भारत का राष्ट्रीय पक्षी कौन है और क्यों?'),
    T('A peacock on every Indian school wall.', 'हर भारतीय स्कूल की दीवार पर मोर।'),
    [
      T('The Indian peacock (Pavo cristatus) is India\'s national bird.', 'भारतीय मोर (पावो क्रिस्टैटस) भारत का राष्ट्रीय पक्षी है।'),
      T('It was adopted in 1963 and is protected under the Wildlife Protection Act.', 'इसे 1963 में अपनाया गया एवं यह वन्यजीव संरक्षण अधिनियम के अंतर्गत संरक्षित है।'),
      T('The tiger is the national animal and the Ganges dolphin the national aquatic animal.', 'बाघ राष्ट्रीय पशु एवं गंगा डॉल्फिन राष्ट्रीय जलीय जीव है।'),
    ],
    T('Harming a peacock is a punishable offence — wildlife belongs to everyone.', 'मोर को हानि पहुँचाना दंडनीय है — वन्यजीव सबका है।'),
    T('Teach one child three national symbols of India today.', 'आज एक बच्चे को भारत के तीन राष्ट्रीय प्रतीक सिखाएँ।'),
    T('Knowing our symbols builds respect, not just memory.', 'हमारे प्रतीकों को जानना केवल याद नहीं, सम्मान बनाता है।'),
    T('National symbols must always be used with respect as per the law.', 'राष्ट्रीय प्रतीकों का उपयोग कानून अनुसार सदैव सम्मान से हो।'),
  ),
  CH(
    T('Why is the Sun important for life on Earth?', 'पृथ्वी पर जीवन हेतु सूर्य क्यों आवश्यक है?'),
    T('Every meal on your plate began as sunlight.', 'आपकी थाली का हर भोजन धूप से शुरू हुआ।'),
    [
      T('The Sun gives light and heat, and drives the water cycle.', 'सूर्य प्रकाश एवं ऊष्मा देता है, एवं जल-चक्र चलाता है।'),
      T('Plants make food using sunlight (photosynthesis) — the base of the food chain.', 'पौधे धूप से भोजन बनाते हैं (प्रकाश-संश्लेषण) — खाद्य शृंखला का आधार।'),
      T('Solar energy can power homes without burning fuel.', 'सौर ऊर्जा बिना ईंधन जलाए घरों को बिजली दे सकती है।'),
    ],
    T('A solar panel on a rooftop turns free sunlight into saving on the power bill.', 'छत पर सौर पैनल निःशुल्क धूप को बिजली-बचत में बदलता है।'),
    T('Find out whether your area has a solar or renewable energy scheme.', 'पता करें कि आपके क्षेत्र में सौर या नवीकरणीय ऊर्जा योजना है या नहीं।'),
    T('Clean energy protects both health and the environment.', 'स्वच्छ ऊर्जा स्वास्थ्य एवं पर्यावरण दोनों की रक्षा करती है।'),
    T('Never look directly at the Sun — it can permanently damage the eyes.', 'सूर्य को सीधे न देखें — इससे आँखें स्थायी रूप से खराब हो सकती हैं।'),
  ),
  CH(
    T('Which is the longest river in India?', 'भारत की सबसे लंबी नदी कौन-सी है?'),
    T('A river that feeds the north and the east.', 'एक नदी जो उत्तर एवं पूर्व को पोषित करती है।'),
    [
      T('The Ganga (Ganges) is the longest river flowing within India.', 'गंगा भारत के भीतर बहने वाली सबसे लंबी नदी है।'),
      T('It supports farming, drinking water and culture across many states.', 'यह अनेक राज्यों में खेती, पेयजल एवं संस्कृति को सहारा देती है।'),
      T('The Ganga is also India\'s national river.', 'गंगा भारत की राष्ट्रीय नदी भी है।'),
    ],
    T('Polluting a river harms the same water we drink and irrigate with.', 'नदी प्रदूषित करना उसी जल को हानि पहुँचाता है जो हम पीते व सींचते हैं।'),
    T('Commit today to never throw waste into any river or pond near you.', 'आज संकल्प लें कि अपने पास की किसी नदी या तालाब में कचरा न फेंकेंगे।'),
    T('Protecting rivers is protecting life.', 'नदियों की रक्षा जीवन की रक्षा है।'),
    T('Do not bathe or wash in visibly polluted water — it carries disease.', 'दिखने में प्रदूषित जल में स्नान या कपड़े धोना रोग लाता है।'),
  ),
  CH(
    T('What are the three pillars of good health in Ayurveda?', 'आयुर्वेद में अच्छे स्वास्थ्य के तीन स्तंभ क्या हैं?'),
    T('Three simple words: food, sleep, conduct.', 'तीन सरल शब्द: आहार, निद्रा, आचरण।'),
    [
      T('Ahara (food), Nidra (sleep) and Brahmacharya (regulated conduct) are the three pillars.', 'आहार, निद्रा एवं ब्रह्मचर्य (नियंत्रित आचरण) तीन स्तंभ हैं।'),
      T('Health rests on balance, not on extremes.', 'स्वास्थ्य संतुलन पर टिका है, अति पर नहीं।'),
      T('Regular habits matter more than occasional effort.', 'नियमित आदतें कभी-कभार के प्रयास से अधिक महत्वपूर्ण हैं।'),
    ],
    T('A person who eats, sleeps and works regularly often needs fewer medicines.', 'जो नियमित खाता, सोता एवं काम करता है, उसे कम दवाओं की आवश्यकता पड़ती है।'),
    T('Fix one pillar this week — start with a fixed sleep time.', 'इस सप्ताह एक स्तंभ सुधारें — निश्चित सोने के समय से शुरू करें।'),
    T('Prevention is cheaper than treatment.', 'बचाव उपचार से सस्ता है।'),
    T('Ayurveda principles are general guidance — illness needs a qualified doctor.', 'आयुर्वेद सिद्धांत सामान्य मार्गदर्शन हैं — रोग में योग्य डॉक्टर चाहिए।'),
  ),
  CH(
    T('What is the Constitution\'s basic structure?', 'संविधान की मूल संरचना क्या है?'),
    T('Some features of the Constitution can never be deleted.', 'संविधान की कुछ विशेषताएँ कभी नहीं मिटाई जा सकतीं।'),
    [
      T('Courts have held that certain basic features cannot be destroyed even by amendment.', 'न्यायालयों ने माना कि कुछ मूल विशेषताएँ संशोधन द्वारा भी नष्ट नहीं की जा सकतीं।'),
      T('These include supremacy of the Constitution, republican government, and judicial review.', 'इनमें संविधान की सर्वोच्चता, गणतंत्रात्मक शासन एवं न्यायिक समीक्षा शामिल हैं।'),
      T('This is called the "basic structure" doctrine.', 'इसे "मूल संरचना" सिद्धांत कहते हैं।'),
    ],
    T('Parliament can amend the Constitution, but cannot make it cease to be a democracy.', 'संसद संविधान संशोधित कर सकती है, पर उसे लोकतंत्र बनना बंद नहीं करा सकती।'),
    T('Learn the meaning of "judicial review" today — courts can check a law\'s validity.', 'आज "न्यायिक समीक्षा" का अर्थ जानें — न्यायालय कानून की वैधता जाँच सकते हैं।'),
    T('A written Constitution with limits protects every citizen.', 'सीमाओं वाला लिखित संविधान हर नागरिक की रक्षा करता है।'),
    T('This is civic knowledge, not a debate — for a case, consult an advocate.', 'यह नागरिक ज्ञान है, बहस नहीं — किसी मामले में अधिवक्ता से मिलें।'),
  ),
  CH(
    T('Why do we need trees for clean air?', 'स्वच्छ हवा हेतु पेड़ क्यों आवश्यक हैं?'),
    T('Trees are the earth\'s natural air purifiers.', 'पेड़ पृथ्वी के प्राकृतिक वायु-शोधक हैं।'),
    [
      T('Trees take in carbon dioxide and release oxygen.', 'पेड़ कार्बन डाइऑक्साइड लेते एवं ऑक्सीजन देते हैं।'),
      T('They cool the air, hold soil and bring rain.', 'वे हवा ठंडी करते हैं, मिट्टी थामते हैं एवं वर्षा लाते हैं।'),
      T('Trees support birds, animals and biodiversity.', 'पेड़ पक्षियों, पशुओं एवं जैव विविधता को सहारा देते हैं।'),
    ],
    T('A village with many trees is cooler and healthier in summer.', 'अधिक पेड़ों वाला गाँव गर्मी में ठंडा एवं स्वस्थ रहता है।'),
    T('Plant or protect one tree this month.', 'इस महीने एक पेड़ लगाएँ या बचाएँ।'),
    T('Planting a tree is a gift to the next generation.', 'पेड़ लगाना अगली पीढ़ी को उपहार है।'),
    T('Plant the right tree in the right place — not in the middle of a road.', 'सही पेड़ सही जगह लगाएँ — सड़क के बीच नहीं।'),
  ),
  CH(
    T('What is the difference between weather and climate?', 'मौसम और जलवायु में क्या अंतर है?'),
    T('Weather is today; climate is the pattern over years.', 'मौसम आज है; जलवायु वर्षों का प्रतिरूप है।'),
    [
      T('Weather is the day-to-day condition of the atmosphere.', 'मौसम वायुमंडल की दिन-प्रतिदिन की स्थिति है।'),
      T('Climate is the average weather over a long period.', 'जलवायु दीर्घकाल की औसत मौसम स्थिति है।'),
      T('Climate change affects farming, water and health.', 'जलवायु परिवर्तन खेती, जल एवं स्वास्थ्य को प्रभावित करता है।'),
    ],
    T('Farmers plan crops using both today\'s weather and the season\'s climate.', 'किसान आज के मौसम एवं ऋतु की जलवायु दोनों देखकर फसल तय करते हैं।'),
    T('Learn one way to reduce waste or save energy at home.', 'घर पर कचरा घटाने या ऊर्जा बचाने का एक तरीका जानें।'),
    T('Small green habits slow a big global change.', 'छोटी हरित आदतें बड़ा वैश्विक परिवर्तन धीमा करती हैं।'),
    T('Climate is a scientific matter — rely on official meteorological information.', 'जलवायु एक वैज्ञानिक विषय है — आधिकारिक मौसम विभाग की जानकारी पर भरोसा करें।'),
  ),
  CH(
    T('What is the meaning of "Secular" in the Indian Constitution?', 'भारतीय संविधान में "पंथनिरपेक्ष" का अर्थ क्या है?'),
    T('Not against religion — equal toward all religions.', 'धर्म के विरुद्ध नहीं — सभी धर्मों के प्रति समान।'),
    [
      T('The State has no religion of its own and treats all faiths equally.', 'राज्य का अपना कोई धर्म नहीं और वह सभी आस्थाओं को समान मानता है।'),
      T('Citizens are free to follow, change or not follow any religion.', 'नागरिक किसी भी धर्म को मानने, बदलने या न मानने हेतु स्वतंत्र हैं।'),
      T('The word "secular" was made explicit by the 42nd Amendment, 1976.', '"पंथनिरपेक्ष" शब्द 42वें संशोधन, 1976 द्वारा स्पष्ट किया गया।'),
    ],
    T('The State can help all religions equally but favours none.', 'राज्य सभी धर्मों की समान सहायता कर सकता है पर किसी को वरीयता नहीं।'),
    T('Respect one festival of a faith different from your own this month.', 'इस महीने अपने से भिन्न आस्था का एक पर्व सम्मानपूर्वक मनाएँ।'),
    T('Equal respect keeps a diverse nation together.', 'समान सम्मान विविध राष्ट्र को जोड़े रखता है।'),
    T('Secularism means freedom for all — not hostility to any religion.', 'पंथनिरपेक्षता सबके लिए स्वतंत्रता है — किसी धर्म के प्रति विरोध नहीं।'),
  ),
  CH(
    T('Which vitamins come from sunlight and from green vegetables?', 'धूप और हरी सब्जियों से कौन-से विटामिन मिलते हैं?'),
    T('Sunlight and greens keep bones and eyes strong.', 'धूप एवं हरी सब्जियाँ हड्डी एवं आँख मज़बूत रखती हैं।'),
    [
      T('Sunlight helps the body make Vitamin D, needed for strong bones.', 'धूप शरीर को विटामिन D बनाने में मदद करती है, जो मज़बूत हड्डियों हेतु आवश्यक है।'),
      T('Green leafy vegetables give Vitamin A, iron and calcium.', 'हरी पत्तेदार सब्जियाँ विटामिन A, लौह एवं कैल्शियम देती हैं।'),
      T('Vitamin A protects eyesight; iron prevents anaemia.', 'विटामिन A दृष्टि बचाता है; लौह रक्ताल्पता रोकता है।'),
    ],
    T('A child given greens and morning sunlight grows stronger than one given only packaged food.', 'हरी सब्जी एवं सुबह की धूप पाने वाला बच्चा केवल पैकेट-भोजन वाले से अधिक मज़बूत बढ़ता है।'),
    T('Add one green vegetable to today\'s meal.', 'आज के भोजन में एक हरी सब्जी जोड़ें।'),
    T('Local, seasonal food is usually the most nutritious.', 'स्थानीय, मौसमी भोजन सामान्यतः सबसे पौष्टिक होता है।'),
    T('For deficiency or supplements, do not self-prescribe — ask a doctor.', 'कमी या सप्लीमेंट हेतु स्वयं निर्णय न लें — डॉक्टर से पूछें।'),
  ),
  CH(
    T('What is the meaning of "democracy" in simple words?', 'सरल शब्दों में "लोकतंत्र" का अर्थ क्या है?'),
    T('Government of the people, by the people, for the people.', 'जनता की, जनता द्वारा, जनता के लिए सरकार।'),
    [
      T('People choose their government through free and fair elections.', 'लोग स्वतंत्र एवं निष्पक्ष चुनाव से अपनी सरकार चुनते हैं।'),
      T('Every adult citizen has one vote of equal value.', 'प्रत्येक वयस्क नागरिक का एक समान मूल्य का मत होता है।'),
      T('Rights, rule of law and an independent judiciary are its pillars.', 'अधिकार, विधि का शासन एवं स्वतंत्र न्यायपालिका इसके स्तंभ हैं।'),
    ],
    T('In a democracy, a citizen can question the government without fear.', 'लोकतंत्र में नागरिक बिना भय सरकार से सवाल कर सकता है।'),
    T('If eligible, make sure your vote is registered this year.', 'पात्र हों तो इस वर्ष अपना मत पंजीकरण सुनिश्चित करें।'),
    T('A democracy is strong when citizens participate, not just vote.', 'लोकतंत्र तब मज़बूत होता है जब नागरिक केवल मत नहीं, भागीदारी भी करें।'),
    T('Voting is a right and a duty — never sell or misuse it.', 'मतदान अधिकार एवं कर्तव्य है — इसे कभी बेचें या दुरुपयोग न करें।'),
  ),
  CH(
    T('Why is sanitation linked to nutrition?', 'स्वच्छता एवं पोषण कैसे जुड़े हैं?'),
    T('Clean water turns food into strength.', 'स्वच्छ जल भोजन को शक्ति में बदलता है।'),
    [
      T('Repeated infection from unsafe water and poor sanitation drains nutrients.', 'असुरक्षित जल एवं खराब स्वच्छता से बार-बार संक्रमण पोषक तत्व नष्ट करता है।'),
      T('A clean environment lets the body use the food it gets.', 'स्वच्छ वातावरण शरीर को मिले भोजन का उपयोग करने देता है।'),
      T('Malnutrition is not only "less food" — it is also poor absorption.', 'कुपोषण केवल "कम भोजन" नहीं — यह कम अवशोषण भी है।'),
    ],
    T('A child who eats well but drinks unclean water may still remain weak.', 'जो बच्चा अच्छा खाता है पर अशुद्ध जल पीता है, वह फिर भी कमज़ोर रह सकता है।'),
    T('Ensure your household uses safe drinking water and a clean toilet.', 'सुनिश्चित करें कि घर सुरक्षित पेयजल एवं स्वच्छ शौचालय का उपयोग करे।'),
    T('Sanitation and nutrition must go together.', 'स्वच्छता एवं पोषण साथ-साथ चलते हैं।'),
    T('Persistent weakness in a child needs medical check-up, not just more food.', 'बच्चे की लगातार कमज़ोरी हेतु चिकित्सकीय जाँच आवश्यक, केवल अधिक भोजन नहीं।'),
  ),
];

module.exports = {
  key: 'gk',
  emoji: '🧠',
  category: 'education',
  title: T('General Knowledge — One Question a Day', 'सामान्य ज्ञान — रोज़ एक प्रश्न'),
  note: T('General knowledge to spark curiosity. Figures change — verify from an official source.',
    'जिज्ञासा जगाने हेतु सामान्य ज्ञान। आँकड़े बदलते हैं — आधिकारिक स्रोत से जाँचें।'),
  cta: T('Ask one question a day — a curious mind never stops learning.',
    'रोज़ एक प्रश्न पूछें — जिज्ञासु मन सीखना कभी नहीं छोड़ता।'),
  verified: '2026-01',
  items,
};
