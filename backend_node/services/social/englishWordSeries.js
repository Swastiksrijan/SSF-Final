// Series 5 — रोज़ का अंग्रेज़ी शब्द (English Word of the Day) — रोज़ एक शब्द.
//
// Objective (नियमावली): उद्देश्य 3 एवं 5 — शिक्षा, कौशल, रोजगार योग्यता।
//
// Each post teaches one useful English word: meaning in simple English, the
// Hindi meaning, a sentence, and a bonus word in another Indian language
// (Marathi / Bhojpuri / Sanskrit) so the learner sees languages connect.
//
// Bilingual (EN + HI).

const { CH, T } = require('./seriesEngine');

const items = [
  CH(
    T('EDUCATION', 'शिक्षा'),
    T('Say it: education (ed-yoo-KAY-shun).', 'बोलें: एजुकेशन।'),
    [
      T('Meaning: the process of teaching and learning.', 'अर्थ: सिखाने एवं सीखने की प्रक्रिया।'),
      T('हिंदी: शिक्षा — ज्ञान, विद्या।', 'हिंदी: शिक्षा — ज्ञान, विद्या (शब्द)।'),
      T('Another language — Sanskrit: विद्या (vidyā).', 'अन्य भाषा — संस्कृत: विद्या।'),
      T('Marathi: शिक्षण (śikṣaṇ).', 'मराठी: शिक्षण।'),
    ],
    T('"Education is the best investment a family can make."', '"शिक्षा वह सर्वोत्तम निवेश है जो परिवार कर सकता है।"'),
    T('Use the word "education" in one sentence of your own today.', 'आज "education" शब्द अपने एक वाक्य में प्रयोग करें।'),
    T('One new word a day is more than three hundred a year.', 'रोज़ एक नया शब्द वर्ष में तीन सौ से अधिक होता है।'),
    T('Learn the word, then use it — words are kept by using them.', 'शब्द सीखें, फिर प्रयोग करें — प्रयोग से ही शब्द याद रहता है।'),
  ),
  CH(
    T('HEALTH', 'स्वास्थ्य'),
    T('Say it: health (helth).', 'बोलें: हेल्थ।'),
    [
      T('Meaning: the condition of body and mind; being free from illness.', 'अर्थ: शरीर एवं मन की स्थिति; रोग से मुक्त होना।'),
      T('हिंदी: स्वास्थ्य — निरोगी होना।', 'हिंदी: स्वास्थ्य — निरोगी होना।'),
      T('Sanskrit: स्वास्थ्य (svāsthya).', 'संस्कृत: स्वास्थ्य।'),
      T('Bhojpuri: सेहत (sehat).', 'भोजपुरी: सेहत।'),
    ],
    T('"Good health is the foundation of every dream."', '"अच्छा स्वास्थ्य हर सपने की नींव है।"'),
    T('Say one sentence today about taking care of your health in English.', 'आज अपने स्वास्थ्य की देखभाल पर एक अंग्रेज़ी वाक्य बोलें।'),
    T('Health words help you read medicine labels and reports.', 'स्वास्थ्य संबंधी शब्द दवा के लेबल एवं रिपोर्ट पढ़ने में मदद करते हैं।'),
    T('Learn the word; for actual illness, still see a doctor.', 'शब्द सीखें; असली बीमारी में फिर भी डॉक्टर से मिलें।'),
  ),
  CH(
    T('GOVERNMENT', 'सरकार'),
    T('Say it: government (GUV-ern-ment).', 'बोलें: गवर्नमेंट।'),
    [
      T('Meaning: the group that runs and rules a country or state.', 'अर्थ: जो देश या राज्य चलाता एवं शासन करता है।'),
      T('हिंदी: सरकार — शासन चलाने वाली संस्था।', 'हिंदी: सरकार — शासन चलाने वाली संस्था।'),
      T('Sanskrit: शासन (śāsana).', 'संस्कृत: शासन।'),
      T('Marathi: शासन (śāsan).', 'मराठी: शासन।'),
    ],
    T('"The government should ensure every child goes to school."', '"सरकार को सुनिश्चित करना चाहिए कि हर बच्चा स्कूल जाए।"'),
    T('Learn the word "government" and one official scheme name today.', 'आज "government" शब्द एवं एक आधिकारिक योजना का नाम सीखें।'),
    T('Civic words help you understand news and forms.', 'नागरिक शब्द समाचार एवं फ़ॉर्म समझने में मदद करते हैं।'),
    T('Do not confuse government with any political party — the word covers the State.', 'सरकार को किसी राजनीतिक दल से न जोड़ें — यह शब्द राज्य को दर्शाता है।'),
  ),
  CH(
    T('HONESTY', 'ईमानदारी'),
    T('Say it: honesty (ON-uh-stee).', 'बोलें: ऑनेस्टी।'),
    [
      T('Meaning: always telling the truth and not cheating.', 'अर्थ: सदा सच बोलना एवं बेईमानी न करना।'),
      T('हिंदी: ईमानदारी — सत्यनिष्ठा।', 'हिंदी: ईमानदारी — सत्यनिष्ठा।'),
      T('Sanskrit: सत्यम् (satyam).', 'संस्कृत: सत्यम्।'),
      T('Bhojpuri: ईमान (īmān).', 'भोजपुरी: ईमान।'),
    ],
    T('"Honesty in small things builds trust in big things."', '"छोटी बातों में ईमानदारी बड़ी बातों में भरोसा बनाती है।"'),
    T('Use "honesty" in a sentence about your own work today.', 'आज अपने काम के बारे में "honesty" से एक वाक्य बनाएँ।'),
    T('Value words build character along with vocabulary.', 'मूल्य-शब्द शब्दावली के साथ चरित्र भी बनाते हैं।'),
    T('Honesty is not just a word — it is a daily practice.', 'ईमानदारी केवल शब्द नहीं — रोज़ का अभ्यास है।'),
  ),
  CH(
    T('OPPORTUNITY', 'अवसर'),
    T('Say it: opportunity (op-er-TYOO-ni-tee).', 'बोलें: ऑपर्च्युनिटी।'),
    [
      T('Meaning: a good chance to do something or improve.', 'अर्थ: कुछ करने या सुधारने का अच्छा मौका।'),
      T('हिंदी: अवसर — मौका।', 'हिंदी: अवसर — मौका।'),
      T('Sanskrit: अवसरः (avasaraḥ).', 'संस्कृत: अवसरः।'),
      T('Marathi: संधी (sandhī).', 'मराठी: संधी।'),
    ],
    T('"Every problem hides an opportunity to learn."', '"हर समस्या में सीखने का एक अवसर छिपा होता है।"'),
    T('Write one opportunity you have right now, in English.', 'अभी आपके पास जो एक अवसर है, उसे अंग्रेज़ी में लिखें।'),
    T('Seeing opportunity turns a learner into a doer.', 'अवसर देखना सीखने वाले को करने वाला बनाता है।'),
    T('An opportunity unused is an opportunity lost.', 'अवसर का उपयोग न होना उसका खो जाना है।'),
  ),
  CH(
    T('DISCIPLINE', 'अनुशासन'),
    T('Say it: discipline (DIS-uh-plin).', 'बोलें: डिसिप्लिन।'),
    [
      T('Meaning: training yourself to follow rules and keep good habits.', 'अर्थ: स्वयं को नियम एवं अच्छी आदतों में ढालना।'),
      T('हिंदी: अनुशासन — नियमबद्धता।', 'हिंदी: अनुशासन — नियमबद्धता।'),
      T('Sanskrit: अनुशासनम् (anuśāsanam).', 'संस्कृत: अनुशासनम्।'),
      T('Bhojpuri: अनुशासन।', 'भोजपुरी: अनुशासन।'),
    ],
    T('"Discipline turns a small talent into a great skill."', '"अनुशासन छोटी प्रतिभा को बड़ा कौशल बनाता है।"'),
    T('Make one sentence about your daily routine using "discipline".', 'अपनी दिनचर्या पर "discipline" से एक वाक्य बनाएँ।'),
    T('Discipline is the bridge between goal and achievement.', 'अनुशासन लक्ष्य एवं उपलब्धि के बीच का पुल है।'),
    T('Start small — a too-strict plan breaks quickly.', 'छोटे से शुरू करें — बहुत कड़ा प्लान जल्दी टूटता है।'),
  ),
  CH(
    T('COOPERATION', 'सहयोग'),
    T('Say it: cooperation (ko-op-er-AY-shun).', 'बोलें: कोऑपरेशन।'),
    [
      T('Meaning: working together toward a shared goal.', 'अर्थ: साझा लक्ष्य हेतु मिलकर काम करना।'),
      T('हिंदी: सहयोग — मिलकर काम करना।', 'हिंदी: सहयोग।'),
      T('Sanskrit: सहयोगः (sahayogaḥ).', 'संस्कृत: सहयोगः।'),
      T('Marathi: सहकार्य (sahakārya).', 'मराठी: सहकार्य।'),
    ],
    T('"Cooperation makes a hard task easy."', '"सहयोग कठिन काम को आसान बनाता है।"'),
    T('Say one way you cooperated with someone this week, in English.', 'इस सप्ताह आपने किसी के साथ जो सहयोग किया, उसे अंग्रेज़ी में बताएँ।'),
    T('Teams achieve what one person alone cannot.', 'जो एक व्यक्ति अकेले नहीं कर सकता, टीम वह कर लेती है।'),
    T('Cooperation needs listening, not only talking.', 'सहयोग हेतु सुनना भी ज़रूरी, केवल बोलना नहीं।'),
  ),
  CH(
    T('ENVIRONMENT', 'पर्यावरण'),
    T('Say it: environment (en-VY-run-ment).', 'बोलें: एनवायरनमेंट।'),
    [
      T('Meaning: the natural world around us — air, water, land, life.', 'अर्थ: हमारे चारों ओर का प्राकृतिक संसार — वायु, जल, भूमि, जीवन।'),
      T('हिंदी: पर्यावरण।', 'हिंदी: पर्यावरण।'),
      T('Sanskrit: पर्यावरणम् (paryāvaraṇam).', 'संस्कृत: पर्यावरणम्।'),
      T('Bhojpuri: वातावरण।', 'भोजपुरी: वातावरण।'),
    ],
    T('"Protecting the environment protects our children\'s future."', '"पर्यावरण की रक्षा बच्चों का भविष्य बचाती है।"'),
    T('Write one English sentence about saving water or trees.', 'पानी या पेड़ बचाने पर एक अंग्रेज़ी वाक्य लिखें।'),
    T('Environment words appear in news and science regularly.', 'पर्यावरण के शब्द समाचार एवं विज्ञान में अक्सर आते हैं।'),
    T('Words alone will not help — action must follow.', 'केवल शब्द मदद नहीं करेंगे — कर्म भी आवश्यक है।'),
  ),
  CH(
    T('RESPONSIBILITY', 'उत्तरदायित्व'),
    T('Say it: responsibility (ri-spon-si-BIL-i-tee).', 'बोलें: रिस्पॉन्सिबिलिटी।'),
    [
      T('Meaning: a duty you are expected to take care of.', 'अर्थ: जिसका निर्वाह आपसे अपेक्षित है।'),
      T('हिंदी: उत्तरदायित्व — जिम्मेदारी।', 'हिंदी: उत्तरदायित्व।'),
      T('Sanskrit: दायित्वम् (dāyitvam).', 'संस्कृत: दायित्वम्।'),
      T('Marathi: जबाबदारी (jabābdārī).', 'मराठी: जबाबदारी।'),
    ],
    T('"Taking responsibility is the first step to respect."', '"उत्तरदायित्व लेना सम्मान का पहला कदम है।"'),
    T('Name one responsibility you will complete today, in English.', 'आज जो एक ज़िम्मेदारी पूरी करेंगे, उसे अंग्रेज़ी में लिखें।'),
    T('Responsible citizens make a responsible nation.', 'उत्तरदायी नागरिक उत्तरदायी राष्ट्र बनाते हैं।'),
    T('A duty accepted is a right respected.', 'स्वीकृत कर्तव्य सम्मानित अधिकार है।'),
  ),
  CH(
    T('KNOWLEDGE', 'ज्ञान'),
    T('Say it: knowledge (NOL-ij).', 'बोलें: नॉलेज।'),
    [
      T('Meaning: understanding and information you have gained.', 'अर्थ: अर्जित समझ एवं जानकारी।'),
      T('हिंदी: ज्ञान।', 'हिंदी: ज्ञान।'),
      T('Sanskrit: ज्ञानम् (jñānam).', 'संस्कृत: ज्ञानम्।'),
      T('Bhojpuri: ज्ञान।', 'भोजपुरी: ज्ञान।'),
    ],
    T('"Knowledge shared is knowledge multiplied."', '"बाँटा गया ज्ञान बढ़ जाता है।"'),
    T('Teach one thing you know to someone younger today.', 'आज जो एक बात आप जानते हैं, वह किसी छोटे को सिखाएँ।'),
    T('Knowledge grows by sharing, not by hoarding.', 'ज्ञान बाँटने से बढ़ता है, जमा करने से नहीं।'),
    T('Knowledge without action benefits no one.', 'कर्म बिना ज्ञान किसी के काम नहीं आता।'),
  ),
  CH(
    T('DIGNITY', 'गरिमा'),
    T('Say it: dignity (DIG-ni-tee).', 'बोलें: डिग्निटी।'),
    [
      T('Meaning: the right to be respected and valued as a person.', 'अर्थ: व्यक्ति के रूप में सम्मान एवं मूल्य पाने का अधिकार।'),
      T('हिंदी: गरिमा — मान, सम्मान।', 'हिंदी: गरिमा।'),
      T('Sanskrit: गौरवम् (gauravam).', 'संस्कृत: गौरवम्।'),
      T('Marathi: प्रतिष्ठा (pratiṣṭhā).', 'मराठी: प्रतिष्ठा।'),
    ],
    T('"Every person deserves to live with dignity."', '"हर व्यक्ति गरिमा से जीने का हकदार है।"'),
    T('Speak respectfully to one person you may have ignored today.', 'आज किसी ऐसे व्यक्ति से सम्मानपूर्वक बात करें जिसे आप अनदेखा करते रहे।'),
    T('Dignity is a right, not a favour.', 'गरिमा अधिकार है, एहसान नहीं।'),
    T('Never use words that insult anyone\'s dignity.', 'कभी ऐसे शब्द प्रयोग न करें जो किसी की गरिमा का अपमान करें।'),
  ),
  CH(
    T('SAFETY', 'सुरक्षा'),
    T('Say it: safety (SAYF-tee).', 'बोलें: सेफ्टी।'),
    [
      T('Meaning: being free from danger or harm.', 'अर्थ: खतरे या हानि से मुक्त होना।'),
      T('हिंदी: सुरक्षा।', 'हिंदी: सुरक्षा।'),
      T('Sanskrit: सुरक्षा (surakṣā).', 'संस्कृत: सुरक्षा।'),
      T('Bhojpuri: सुरक्षा।', 'भोजपुरी: सुरक्षा।'),
    ],
    T('"Safety first saves lives on the road and at home."', '"सुरक्षा पहले — सड़क एवं घर पर जान बचाती है।"'),
    T('Write one English sentence about road safety.', 'सड़क सुरक्षा पर एक अंग्रेज़ी वाक्य लिखें।'),
    T('Safety is a habit, not a one-time act.', 'सुरक्षा एक आदत है, एक बार का काम नहीं।'),
    T('Helmets and seat-belts are not optional.', 'हेलमेट एवं सीट-बेल्ट वैकल्पिक नहीं हैं।'),
  ),
  CH(
    T('COURAGE', 'साहस'),
    T('Say it: courage (KUR-ij).', 'बोलें: करेज।'),
    [
      T('Meaning: the strength to face fear or difficulty.', 'अर्थ: भय या कठिनाई का सामना करने की शक्ति।'),
      T('हिंदी: साहस — हिम्मत।', 'हिंदी: साहस।'),
      T('Sanskrit: साहसम् (sāhasam).', 'संस्कृत: साहसम्।'),
      T('Marathi: धैर्य (dhairya).', 'मराठी: धैर्य।'),
    ],
    T('"Courage is not the absence of fear, but action despite it."', '"साहस भय का अभाव नहीं, भय के बावजूद कर्म है।"'),
    T('Say one small brave thing you will do today, in English.', 'आज जो एक छोटा साहसी काम करेंगे, उसे अंग्रेज़ी में बोलें।'),
    T('Courage grows each time it is used.', 'साहस हर प्रयोग से बढ़ता है।'),
    T('Courage never means breaking the law or endangering others.', 'साहस का अर्थ कानून तोड़ना या दूसरों को खतरे में डालना कभी नहीं।'),
  ),
  CH(
    T('COMPASSION', 'करुणा'),
    T('Say it: compassion (kum-PASH-un).', 'बोलें: कम्पैशन।'),
    [
      T('Meaning: feeling the pain of others and wanting to help.', 'अर्थ: दूसरों का दुख समझना एवं मदद करने की इच्छा।'),
      T('हिंदी: करुणा — दया।', 'हिंदी: करुणा।'),
      T('Sanskrit: करुणा (karuṇā).', 'संस्कृत: करुणा।'),
      T('Bhojpuri: दया।', 'भोजपुरी: दया।'),
    ],
    T('"Compassion turns a stranger into a neighbour."', '"करुणा अजनबी को पड़ोसी बना देती है।"'),
    T('Do one act of compassion today, then describe it in English.', 'आज करुणा का एक कार्य करें, फिर उसे अंग्रेज़ी में बताएँ।'),
    T('Compassion is the heart of community service.', 'करुणा समुदाय-सेवा का हृदय है।'),
    T('Help, but never harm or take over another\'s dignity.', 'मदद करें, पर किसी की गरिमा न छीनें।'),
  ),
];

module.exports = {
  key: 'english-word',
  emoji: '🔤',
  category: 'language',
  title: T('English Word of the Day', 'रोज़ का अंग्रेज़ी शब्द'),
  note: T('One useful English word daily, with Hindi and a bonus Indian-language word.',
    'रोज़ एक उपयोगी अंग्रेज़ी शब्द, हिंदी अर्थ एवं एक अतिरिक्त भारतीय-भाषा शब्द के साथ।'),
  cta: T('Learn one word, use it once — repeat tomorrow.',
    'एक शब्द सीखें, एक बार प्रयोग करें — कल फिर दोहराएँ।'),
  verified: '2026-01',
  items,
};
