// Series 1 — भारत का संविधान (Constitution of India) — रोज़ एक अध्याय.
//
// Objective (नियमावली): उद्देश्य 1 & 7 — शिक्षा का अधिकार, जन-जागरूकता, नैतिक मूल्य,
// सर्वधर्म समभाव, सामाजिक समरसता।
//
// Sourcing: the facts below are the settled, widely-documented provisions of the
// Constitution of India. Article numbers are stated exactly. This is neutral
// civic education — it teaches the law as written and never takes a political
// side, criticises a party, or comments on a live dispute. Where a number could
// change (e.g. number of Fundamental Duties), only the article is cited.
//
// Bilingual (EN + HI). Every chapter: hook -> key points -> example -> today's
// task -> tip -> caution. "Learn, share, and help someone benefit."

const { CH, T } = require('./seriesEngine');

const preamble = "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC …";
const preambleHi = "हम भारत के लोग, भारत को एक सम्पूर्ण प्रभुत्व-सम्पन्न समाजवादी पंथनिरपेक्ष लोकतंत्रात्मक गणराज्य …";

const items = [
  CH(
    T('The Preamble — the soul of the Constitution', 'प्रस्तावना — संविधान की आत्मा'),
    T('The Preamble is the promise India made to itself.', 'प्रस्तावना वह वादा है जो भारत ने स्वयं से किया।'),
    [
      T('It declares India a Sovereign, Socialist, Secular, Democratic Republic.', 'यह भारत को सम्पूर्ण प्रभुत्व-सम्पन्न, समाजवादी, पंथनिरपेक्ष, लोकतंत्रात्मक गणराज्य घोषित करती है।'),
      T('The words begin "We, the People of India" — power flows from the people.', 'शब्द शुरू होते हैं "हम भारत के लोग" — शक्ति जनता से आती है।'),
      T('It promises Justice, Liberty, Equality and Fraternity to all citizens.', 'यह सभी नागरिकों को न्याय, स्वतंत्रता, समता और बंधुत्व का वादा करती है।'),
    ],
    T('A citizen can quote the Preamble to explain why equality and dignity matter.', 'एक नागरिक प्रस्तावना का हवाला देकर समता और गरिमा का महत्व समझा सकता है।'),
    T('Read the Preamble aloud once today and note which promise moves you most.', 'आज प्रस्तावना एक बार ज़ोर से पढ़ें और देखें कौन-सा वादा आपको सबसे ज़्यादा छूता है।'),
    T('The Preamble is the key used to interpret the whole Constitution.', 'प्रस्तावना पूरे संविधान को समझने की कुंजी है।'),
    T('The Preamble is not a source of enforceable rights by itself — articles are.', 'प्रस्तावना अपने-आप में लागू करने योग्य अधिकार नहीं देती — वे अनुच्छेद देते हैं।'),
  ),
  CH(
    T('Article 14 — equality before the law', 'अनुच्छेद 14 — कानून के समक्ष समता'),
    T('The law is the same for the rich and the poor.', 'कानून अमीर और गरीब के लिए एक समान है।'),
    [
      T('The State shall not deny any person equality before the law.', 'राज्य किसी व्यक्ति को कानून के समक्ष समता से वंचित नहीं करेगा।'),
      T('It also guarantees equal protection of the laws within India.', 'यह भारत के राज्यक्षेत्र में कानूनों के समान संरक्षण की भी गारंटी देता है।'),
      T('Reasonable classification is allowed; unfair discrimination is not.', 'उचित वर्गीकरण मान्य है; अनुचित भेदभाव नहीं।'),
    ],
    T('If two people commit the same offence, they must face the same process.', 'यदि दो लोग एक ही अपराध करें, तो दोनों को समान प्रक्रिया मिलनी चाहिए।'),
    T('Note one place in daily life where equal treatment should apply.', 'रोज़मर्रा के जीवन में एक जगह नोट करें जहाँ समान व्यवहार लागू होना चाहिए।'),
    T('Equality before the law is the base of every other right.', 'कानून के समक्ष समता हर दूसरे अधिकार का आधार है।'),
    T('Article 14 binds the State — it does not stop private personal choices by itself.', 'अनुच्छेद 14 राज्य पर बाध्यकारी है — यह अपने-आप निजी व्यक्तिगत चुनावों पर लागू नहीं होता।'),
    {
      labh: T('Free legal aid and guidance if your equal-treatment right is violated.', 'समान व्यवहार का अधिकार छिनने पर निःशुल्क विधिक सहायता एवं मार्गदर्शन।'),
      who: T('Women, children, SC/ST, industrial workers, persons with disability and low-income citizens.', 'महिलाएँ, बच्चे, अनुसूचित जाति/जनजाति, औद्योगिक श्रमिक, दिव्यांग एवं अल्प-आय नागरिक।'),
      docs: T('Aadhaar/ID, income or caste certificate (as applicable), any proof of the incident.', 'आधार/पहचान, आय या जाति प्रमाण (यथानुसार), घटना का कोई प्रमाण।'),
      where: T('District Legal Services Authority (DLSA) in your court complex — free. NALSA helpline 15100.', 'अपने न्यायालय परिसर की जिला विधिक सेवा प्राधिकरण (DLSA) — निःशुल्क। NALSA हेल्पलाइन 15100।'),
    },
  ),
  CH(
    T('Article 15 — no discrimination on religion, race, caste, sex or place of birth', 'अनुच्छेद 15 — धर्म, नस्ल, जाति, लिंग या जन्मस्थान पर भेदभाव नहीं'),
    T('Your identity must not decide your opportunity.', 'आपकी पहचान आपके अवसर तय नहीं करनी चाहिए।'),
    [
      T('The State shall not discriminate on grounds of religion, race, caste, sex or place of birth.', 'राज्य धर्म, नस्ल, जाति, लिंग या जन्मस्थान के आधार पर भेदभाव नहीं करेगा।'),
      T('No citizen may be denied access to shops, public restaurants, wells, roads and public places.', 'किसी नागरिक को दुकानों, सार्वजनिक भोजनालयों, कुओं, सड़कों व सार्वजनिक स्थलों तक पहुँच से वंचित नहीं किया जा सकता।'),
      T('Special provisions for women, children and backward classes are permitted.', 'महिलाओं, बच्चों एवं पिछड़े वर्गों हेतु विशेष प्रावधान की अनुमति है।'),
    ],
    T('A girl cannot be refused a seat or a job only because she is a girl.', 'किसी बालिका को केवल बालिका होने के कारण सीट या नौकरी से मना नहीं किया जा सकता।'),
    T('Explain Article 15 to one young person in your family today.', 'आज परिवार के एक युवा को अनुच्छेद 15 समझाएँ।'),
    T('Non-discrimination turns "equality" from a slogan into daily behaviour.', 'भेदभाव-रहितता "समता" को नारे से रोज़ के व्यवहार में बदलती है।'),
    T('Special provisions are an exception allowed by the article itself — not a violation of it.', 'विशेष प्रावधान स्वयं अनुच्छेद द्वारा अनुमत अपवाद हैं — उसका उल्लंघन नहीं।'),
  ),
  CH(
    T('Article 19 — the six freedoms', 'अनुच्छेद 19 — छह स्वतंत्रताएँ'),
    T('Freedom of speech is protected — and so is public order.', 'वाक् स्वतंत्रता संरक्षित है — और सार्वजनिक व्यवस्था भी।'),
    [
      T('Speech and expression, assembly, association, movement, residence and profession.', 'वाक् एवं अभिव्यक्ति, सम्मेलन, संगम, संचरण, निवास एवं व्यवसाय।'),
      T('These freedoms carry reasonable restrictions for public order, decency and safety.', 'इन स्वतंत्रताओं पर सार्वजनिक व्यवस्था, शिष्टाचार एवं सुरक्षा हेतु उचित निर्बंधन लागू हैं।'),
      T('Freedom of the press flows from freedom of speech and expression.', 'प्रेस की स्वतंत्रता वाक् एवं अभिव्यक्ति की स्वतंत्रता से निकलती है।'),
    ],
    T('You may peacefully assemble and speak — but not incite violence or hatred.', 'आप शांतिपूर्वक इकट्ठा व बोल सकते हैं — पर हिंसा या घृणा भड़काना नहीं।'),
    T('Share one true, useful fact online today instead of forward rumour.', 'आज अफ़वाह फॉरवर्ड करने के बजाय एक सच्ची, उपयोगी बात साझा करें।'),
    T('Rights and duties live together — your freedom ends where harm begins.', 'अधिकार और कर्तव्य साथ रहते हैं — आपकी स्वतंत्रता वहाँ रुकती है जहाँ हानि शुरू हो।'),
    T('Spreading false information that causes panic is not protected speech.', 'जो असत्य जानकारी भय फैलाए, वह संरक्षित अभिव्यक्ति नहीं है।'),
  ),
  CH(
    T('Article 21 — right to life and personal liberty', 'अनुच्छेद 21 — प्राण एवं दैहिक स्वतंत्रता का अधिकार'),
    T('Life means more than survival — it means dignity.', 'प्राण केवल जीवित रहना नहीं — गरिमा के साथ जीना है।'),
    [
      T('No person shall be deprived of life or personal liberty except by procedure established by law.', 'कानून द्वारा स्थापित प्रक्रिया के अनुसार ही किसी के प्राण या दैहिक स्वतंत्रता का हनन हो सकता है।'),
      T('Courts have read into it: right to food, health, education, shelter, clean water and a clean environment.', 'न्यायालयों ने इसमें शामिल किया: भोजन, स्वास्थ्य, शिक्षा, आवास, स्वच्छ जल एवं स्वच्छ पर्यावरण का अधिकार।'),
      T('It applies to every person — citizen or not.', 'यह हर व्यक्ति पर लागू है — नागरिक हो या न हो।'),
    ],
    T('A school cannot arbitrarily expel a child, nor a hospital deny emergency care.', 'कोई स्कूल बच्चे को मनमाने ढंग से निकाल नहीं सकता, न कोई अस्पताल आपात देखभाल से मना कर सकता है।'),
    T('Find out one basic service your area is entitled to under Article 21.', 'पता करें कि Article 21 के अंतर्गत आपके क्षेत्र को कौन-सी बुनियादी सेवा मिलनी चाहिए।'),
    T('Dignity is not a favour — it is a fundamental right.', 'गरिमा कोई एहसान नहीं — वह मूल अधिकार है।'),
    T('Article 21 does not remove every regulation — but the procedure must be fair and lawful.', 'Article 21 हर नियम को नहीं हटाता — पर प्रक्रिया उचित एवं विधिसम्मत होनी चाहिए।'),
  ),
  CH(
    T('Article 21A — free and compulsory education (6–14 years)', 'अनुच्छेद 21A — निःशुल्क एवं अनिवार्य शिक्षा (6–14 वर्ष)'),
    T('The State must ensure school for every child up to 14.', 'राज्य को 14 वर्ष तक हर बच्चे के लिए स्कूल सुनिश्चित करना होगा।'),
    [
      T('Free and compulsory education for all children aged 6 to 14 years.', '6 से 14 वर्ष के सभी बच्चों हेतु निःशुल्क एवं अनिवार्य शिक्षा।'),
      T('It was added by the 86th Constitutional Amendment, 2002.', 'यह 86वें संविधान संशोधन, 2002 द्वारा जोड़ा गया।'),
      T('The Right to Education Act, 2009 gives it effect: no capitation fee, no child without a school.', 'शिक्षा का अधिकार अधिनियम, 2009 इसे लागू करता है: कैपिटेशन फीस नहीं, कोई बच्चा स्कूल से बाहर नहीं।'),
    ],
    T('A child of 8 not attending school is being denied a constitutional right.', '8 वर्ष का बच्चा यदि स्कूल नहीं जा रहा, तो उसका संवैधानिक अधिकार छिन रहा है।'),
    T('Check if a child you know (6–14) is enrolled; help the family if not.', 'देखें कि आपके जान-पहचान का कोई बच्चा (6–14) नामांकित है या नहीं; न हो तो परिवार की मदद करें।'),
    T('Education is the strongest ladder out of poverty.', 'शिक्षा गरीबी से बाहर निकलने की सबसे मज़बूत सीढ़ी है।'),
    T('Free education does not allow collecting any capitation fee.', 'निःशुल्क शिक्षा का अर्थ है कोई कैपिटेशन फीस वसूल नहीं की जा सकती।'),
    {
      labh: T('Free education, no capitation fee, and a right to a neighbourhood school.', 'निःशुल्क शिक्षा, कैपिटेशन फीस नहीं, और पड़ोस के स्कूल में प्रवेश का अधिकार।'),
      who: T('Every child aged 6–14 (and as the RTE rules provide).', '6–14 वर्ष का प्रत्येक बच्चा (और जैसा RTE नियम कहें)।'),
      docs: T('Child\'s age proof, Aadhaar, address proof; no fee for admission.', 'बच्चे का आयु प्रमाण, आधार, पता प्रमाण; प्रवेश हेतु कोई शुल्क नहीं।'),
      where: T('Nearest government/neighbourhood school; complain to the local education officer if denied.', 'नज़दीकी सरकारी/पड़ोसी स्कूल; मना करने पर स्थानीय शिक्षा अधिकारी से शिकायत करें।'),
    },
  ),
  CH(
    T('Article 32 & 226 — the right to go to the courts', 'अनुच्छेद 32 एवं 226 — न्यायालय जाने का अधिकार'),
    T('The Constitution itself gives you a remedy.', 'संविधान स्वयं आपको उपचार देता है।'),
    [
      T('You may move the Supreme Court (Art. 32) or a High Court (Art. 226) if a fundamental right is violated.', 'मूल अधिकार के हनन पर आप सर्वोच्च न्यायालय (अनु. 32) या उच्च न्यायालय (अनु. 226) जा सकते हैं।'),
      T('The Supreme Court can issue writs — habeas corpus, mandamus, certiorari, prohibition, quo warranto.', 'सर्वोच्च न्यायालय रिट जारी कर सकता है — बंदी प्रत्यक्षीकरण, परमादेश, उत्प्रेषण, प्रतिषेध, अधिकार-पृच्छा।'),
      T('Article 32 is called the "heart and soul" of the Constitution.', 'अनुच्छेद 32 को संविधान की "आत्मा" कहा जाता है।'),
    ],
    T('If a public authority unlawfully detains or ignores you, a writ lies to the court.', 'यदि कोई सार्वजनिक प्राधिकरण आपको अवैध रूप से रोके या अनसुना करे, तो न्यायालय में रिट उपलब्ध है।'),
    T('Note the contact for Legal Services Authority (free legal aid) in your district.', 'अपने जिले की विधिक सेवा प्राधिकरण (निःशुल्क विधिक सहायता) की संपर्क जानकारी नोट करें।'),
    T('A right without a remedy is hollow; Article 32 gives the remedy.', 'बिना उपचार अधिकार खोखला है; अनुच्छेद 32 उपचार देता है।'),
    T('Fundamental rights have limits; consult a qualified advocate before any litigation.', 'मूल अधिकारों की सीमाएँ हैं; मुकदमे से पहले योग्य अधिवक्ता से परामर्श करें।'),
    {
      labh: T('Free legal aid and a free advocate for eligible citizens.', 'पात्र नागरिकों हेतु निःशुल्क विधिक सहायता एवं निःशुल्क अधिवक्ता।'),
      who: T('Women, children, SC/ST, disabled, victims of disaster/trafficking, low-income persons.', 'महिलाएँ, बच्चे, अनुसूचित जाति/जनजाति, दिव्यांग, आपदा/तस्करी के पीड़ित, अल्प-आय व्यक्ति।'),
      docs: T('ID/Aadhaar, income/caste certificate (if applicable), case papers.', 'पहचान/आधार, आय/जाति प्रमाण (यदि लागू), मुकदमे के कागज़।'),
      where: T('District Legal Services Authority (DLSA) / Lok Adalat — free. NALSA helpline 15100.', 'जिला विधिक सेवा प्राधिकरण (DLSA) / लोक अदालत — निःशुल्क। NALSA हेल्पलाइन 15100।'),
    },
  ),
  CH(
    T('Article 51A — eleven Fundamental Duties', 'अनुच्छेद 51A — ग्यारह मूल कर्तव्य'),
    T('Rights and duties are two hands of one body.', 'अधिकार और कर्तव्य एक ही देह के दो हाथ हैं।'),
    [
      T('Duties include respecting the Constitution, the national flag and the anthem.', 'कर्तव्यों में संविधान, राष्ट्रीय ध्वज एवं राष्ट्रगान का सम्मान शामिल है।'),
      T('They include protecting the environment, public property and promoting harmony.', 'इनमें पर्यावरण, सार्वजनिक संपत्ति की रक्षा एवं सद्भाव बढ़ाना शामिल है।'),
      T('They include education of one\'s own children between 6 and 14 years.', 'इनमें अपने 6 से 14 वर्ष के बच्चों की शिक्षा भी शामिल है।'),
    ],
    T('Throwing waste in public, damaging trees or attacking public property each breach a duty.', 'सार्वजनिक स्थल पर कचरा फेंकना, पेड़ काटना या सार्वजनिक संपत्ति को नुकसान पहुँचाना — हर कार्य कर्तव्य-भंग है।'),
    T('Do one small duty today: keep a public space clean or plant or protect a sapling.', 'आज एक छोटा कर्तव्य निभाएँ: सार्वजनिक जगह साफ़ रखें या पौधा लगाएँ/बचाएँ।'),
    T('A duty fulfilled by all makes rights real for everyone.', 'सबके द्वारा निभाया कर्तव्य सबके लिए अधिकार को सार्थक करता है।'),
    T('Fundamental duties are moral obligations — they complement, not replace, the rights.', 'मूल कर्तव्य नैतिक दायित्व हैं — वे अधिकारों के पूरक हैं, विकल्प नहीं।'),
  ),
  CH(
    T('Directive Principles (DPSP) — the goals of governance', 'नीति निदेशक तत्व (DPSP) — शासन के लक्ष्य'),
    T('The promises a government must work toward.', 'वे वादे जिनकी दिशा में शासन को काम करना है।'),
    [
      T('They guide the State to provide a living wage, equal pay for equal work, and a social security net.', 'वे राज्य को निर्वाह-वेतन, समान कार्य हेतु समान वेतन एवं सामाजिक सुरक्षा की दिशा दिखाते हैं।'),
      T('They aim at rural development, public health, nutrition, agriculture and animal husbandry.', 'उनका लक्ष्य ग्रामीण विकास, जन-स्वास्थ्य, पोषण, कृषि एवं पशुपालन है।'),
      T('They also ask the State to protect monuments and the environment.', 'वे राज्य से स्मारकों एवं पर्यावरण की रक्षा हेतु भी कहते हैं।'),
    ],
    T('A scheme for old-age pension or free school meals flows from these principles.', 'वृद्धावस्था पेंशन या निःशुल्क स्कूल भोजन जैसी योजना इन्हीं तत्वों से निकलती है।'),
    T('Look up one DPSP-linked scheme you could help a family access.', 'एक DPSP-संबंधित योजना खोजें जिससे आप किसी परिवार को जोड़ सकें।'),
    T('DPSPs are the blueprint of the welfare State.', 'DPSP कल्याणकारी राज्य का खाका हैं।'),
    T('DPSPs are not directly enforceable in court like fundamental rights.', 'DPSP न्यायालय में मूल अधिकारों की तरह सीधे लागू नहीं होते।'),
  ),
  CH(
    T('Article 44 & 25 — uniformity and freedom of religion', 'अनुच्छेद 44 एवं 25 — समानता एवं धर्म की स्वतंत्रता'),
    T('The State is secular; every faith is respected.', 'राज्य पंथनिरपेक्ष है; हर आस्था का सम्मान है।'),
    [
      T('Article 25 gives everyone freedom of conscience and the right to profess, practise and propagate religion.', 'अनुच्छेद 25 सबको अंतःकरण की स्वतंत्रता और धर्म को मानने, आचरण करने एवं प्रचार करने का अधिकार देता है।'),
      T('Article 44 asks the State to endeavour to secure a Uniform Civil Code.', 'अनुच्छेद 44 राज्य से समान नागरिक संहिता सुनिश्चित करने का प्रयास करने को कहता है।'),
      T('The State itself has no religion and treats all faiths alike.', 'राज्य स्वयं निरपंथ है और सभी आस्थाओं को समान मानता है।'),
    ],
    T('A citizen may follow any religion and also have no religion — both are lawful.', 'कोई नागरिक कोई भी धर्म मान सकता है, या कोई धर्म न माने — दोनों वैध हैं।'),
    T('Respect one different faith or custom you meet this week.', 'इस सप्ताह मिली किसी भिन्न आस्था या परंपरा का सम्मान करें।'),
    T('Freedom of religion keeps the nation united in diversity.', 'धर्म की स्वतंत्रता विविधता में राष्ट्र को जोड़े रखती है।'),
    T('Freedom of religion does not allow hurting others or breaking general law.', 'धर्म की स्वतंत्रता दूसरों को ठेस पहुँचाने या सामान्य कानून तोड़ने की अनुमति नहीं देती।'),
  ),
  CH(
    T('Article 40 & 243 — Gram Sabha and local self-rule', 'अनुच्छेद 40 एवं 243 — ग्राम सभा एवं स्थानीय स्वशासन'),
    T('Power should reach the last village.', 'शक्ति आख़िरी गाँव तक पहुँचे।'),
    [
      T('Article 40 asks the State to organise village panchayats as units of self-government.', 'अनुच्छेद 40 राज्य से ग्राम पंचायतों को स्वशासन की इकाई के रूप में संगठित करने को कहता है।'),
      T('The 73rd Amendment (Part IX) gave panchayats a constitutional basis and reservation for women.', '73वाँ संशोधन (भाग IX) ने पंचायतों को संवैधानिक आधार तथा महिलाओं हेतु आरक्षण दिया।'),
      T('The Gram Sabha includes all registered voters of the village.', 'ग्राम सभा में गाँव के सभी पंजीकृत मतदाता शामिल होते हैं।'),
    ],
    T('The Gram Sabha approves village plans and can question local spending.', 'ग्राम सभा ग्राम योजनाएँ स्वीकृत करती है और स्थानीय खर्च पर सवाल उठा सकती है।'),
    T('Find out when your Gram Sabha or ward meeting next meets — and attend.', 'पता करें आपकी ग्राम सभा या वार्ड बैठक अगली बार कब है — और जाएँ।'),
    T('Local self-rule is where a citizen\'s voice is strongest.', 'स्थानीय स्वशासन वहाँ है जहाँ नागरिक की आवाज़ सबसे मज़बूत होती है।'),
    T('Attending a meeting and speaking up is a right — not an interruption.', 'बैठक में जाना और बोलना अधिकार है — बाधा नहीं।'),
  ),
  CH(
    T('Article 17 & 23 — abolition of untouchability and forced labour', 'अनुच्छेद 17 एवं 23 — अस्पृश्यता एवं बलात् श्रम का उन्मूलन'),
    T('Dignity is non-negotiable for every person.', 'हर व्यक्ति हेतु गरिमा असंवेय है।'),
    [
      T('Article 17 abolishes untouchability in any form; its practice is a punishable offence.', 'अनुच्छेद 17 किसी भी रूप में अस्पृश्यता का उन्मूलन करता है; इसका आचरण दंडनीय अपराध है।'),
      T('Article 23 prohibits human trafficking, begar and other forms of forced labour.', 'अनुच्छेद 23 मानव तस्करी, बेगार एवं अन्य बलात् श्रम रूपों को प्रतिषिद्ध करता है।'),
      T('These protect the poorest and most vulnerable in society.', 'ये समाज के सबसे गरीब एवं कमज़ोर वर्ग की रक्षा करते हैं।'),
    ],
    T('Paying less than minimum wage or withholding wages under pressure breaches Article 23.', 'न्यूनतम मज़दूरी से कम देना या दबाव में मज़दूरी रोकना अनुच्छेद 23 का उल्लंघन है।'),
    T('If you see bonded or forced labour, report it (Police 112 / helpline).', 'बंधुआ या बलात् श्रम दिखे तो सूचित करें (पुलिस 112 / हेल्पलाइन)।'),
    T('A society is judged by how it treats its weakest member.', 'समाज की पहचान उसके सबसे कमज़ोर सदस्य के साथ व्यवहार से होती है।'),
    T('Never stay silent about discrimination you witness — silence enables it.', 'जो भेदभाव देखें, उस पर चुप न रहें — चुप्पी उसे बढ़ावा देती है।'),
    {
      labh: T('Protection against untouchability and forced/bonded labour, with legal remedy.', 'अस्पृश्यता एवं बलात्/बंधुआ श्रम से संरक्षण, विधिक उपचार सहित।'),
      who: T('Any victim of caste discrimination, bonded or forced labour.', 'जाति-भेदभाव, बंधुआ या बलात् श्रम का कोई भी पीड़ित।'),
      docs: T('None required to report; a written complaint helps.', 'रिपोर्ट करने हेतु कुछ ज़रूरी नहीं; लिखित शिकायत मदद करती है।'),
      where: T('Police 112, local police station, or DLSA free legal aid (NALSA 15100).', 'पुलिस 112, स्थानीय थाना, या DLSA निःशुल्क विधिक सहायता (NALSA 15100)।'),
    },
  ),
  CH(
    T('Article 51 & 26 — international peace and institutional duty', 'अनुच्छेद 51 एवं 26 — अंतर्राष्ट्रीय शांति एवं संस्थागत कर्तव्य'),
    T('India works for peace among nations and harmony within.', 'भारत राष्ट्रों के बीच शांति और भीतर सद्भाव हेतु कार्यरत है।'),
    [
      T('Article 51 directs the State to promote international peace, security and just relations.', 'अनुच्छेद 51 राज्य को अंतर्राष्ट्रीय शांति, सुरक्षा एवं न्यायपूर्ण संबंध बढ़ाने की दिशा देता है।'),
      T('It asks the State to maintain just and honourable relations between nations and respect international law.', 'यह राज्य से राष्ट्रों के बीच न्यायपूर्ण संबंध रखने एवं अंतर्राष्ट्रीय विधि का सम्मान करने को कहता है।'),
      T('Every person also owes a duty to the nation under Article 51A.', 'प्रत्येक व्यक्ति का अनुच्छेद 51A के अंतर्गत राष्ट्र के प्रति कर्तव्य भी होता है।'),
    ],
    T('A local volunteer group that keeps peace at a festival is living both ideals.', 'मेले में शांति बनाए रखने वाला स्थानीय स्वयंसेवी समूह दोनों आदर्श जीता है।'),
    T('Do one act today that strengthens harmony in your street or group.', 'आज एक कार्य करें जो आपकी गली या समूह में सद्भाव बढ़ाए।'),
    T('Peace abroad begins with harmony at home.', 'बाहर की शांति घर की सद्भावना से शुरू होती है।'),
    T('These are State directives and personal duties — not a licence for vigilantism.', 'ये राज्य के निदेश एवं व्यक्तिगत कर्तव्य हैं — अतिरिक्त-सक्रियता का लाइसेंस नहीं।'),
  ),
];

// Extra chapters appended in the companion file are merged here so this file
// stays readable; see constitutionExtra.js.
let extra = [];
try { extra = require('./constitutionExtra').items; } catch { extra = []; }

module.exports = {
  key: 'samvidhan',
  emoji: '🏛️',
  category: 'governance',
  title: T('Bharat ka Samvidhan — One Chapter a Day', 'भारत का संविधान — हर दिन एक अध्याय'),
  note: T('This is civic education, not legal advice. For a specific case, consult a qualified advocate.',
    'यह नागरिक शिक्षा है, कानूनी सलाह नहीं। किसी विशेष मामले में योग्य अधिवक्ता से परामर्श करें।'),
  cta: T('Learn, share, and help someone claim a right they didn\'t know they had.',
    'सीखें, बाँटें और किसी को उसका अधिकार दिलाने में मदद करें जो उसे पता ही नहीं था।'),
  verified: '2026-01',
  items: items.concat(extra),
  preamble, preambleHi,
};
