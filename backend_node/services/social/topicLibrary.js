// Daily awareness topic library — 20 subject areas, each with several unique
// bilingual entries. This is the pre-reviewed fallback content used when no
// automated generation provider is configured. Templates here are honestly
// labelled library/template — never as AI-generated.
//
// Each entry follows the required structure where relevant:
//   issue, why, do, step, avoid, help, action, community
// Facts that change (helplines, scheme rules) carry a source and a verified
// date; eligibility rules, helplines and statistics are not invented. SSF is
// never claimed to have run a camp or helped a beneficiary.

const VERIFIED = '2026-01';
const T = (en, hi) => ({ en, hi });
const V = VERIFIED;

const TOPIC_LABELS = {
  education: T('Education & Literacy', 'शिक्षा एवं साक्षरता'),
  digital: T('Digital Skills & Cyber Safety', 'डिजिटल कौशल एवं साइबर सुरक्षा'),
  health: T('Health & Well-being', 'स्वास्थ्य एवं कल्याण'),
  women: T('Women’s Rights & Dignity', 'महिला अधिकार एवं गरिमा'),
  child: T('Child Rights & Protection', 'बाल अधिकार एवं संरक्षण'),
  youth: T('Youth, Careers & Enterprise', 'युवा, करियर एवं उद्यम'),
  farmer: T('Farmers & Rural Livelihood', 'किसान एवं ग्रामीण आजीविका'),
  environment: T('Environment & Climate', 'पर्यावरण एवं जलवायु'),
  finance: T('Financial Literacy', 'वित्तीय साक्षरता'),
  schemes: T('Government Schemes & Services', 'सरकारी योजनाएँ एवं सेवाएँ'),
  legal: T('Legal & Civic Awareness', 'कानूनी एवं नागरिक जागरूकता'),
  disability: T('Disability Inclusion & Accessibility', 'दिव्यांग समावेश एवं सुगम्यता'),
  roadsafety: T('Road Safety & Emergency Readiness', 'सड़क सुरक्षा एवं आपदा तैयारी'),
  equality: T('Social Equality & Harmony', 'सामाजिक समानता एवं सद्भाव'),
  science: T('Science & Critical Thinking', 'विज्ञान एवं तर्कशीलता'),
  volunteer: T('Volunteerism & Citizenship', 'स्वयंसेवा एवं नागरिकता'),
  employment: T('Employment Rights & Life Skills', 'श्रम अधिकार एवं जीवन कौशल'),
  water: T('Water, Sanitation & Energy', 'जल, स्वच्छता एवं ऊर्जा'),
  local: T('Local Problems & Solutions', 'स्थानीय समस्याएँ एवं समाधान'),
  global: T('Global Cooperation & Humanitarian Awareness', 'वैश्विक सहयोग एवं मानवीय जागरूकता'),
};

const LIBRARY = {};

// ---- 1. education & literacy -------------------------------------------------
LIBRARY.education = [
  {
    title: T('Reading 20 minutes a day changes a child', 'रोज़ 20 मिनट पढ़ना बच्चे को बदल देता है'),
    issue: T('Many children finish primary school without reading fluently.', 'कई बच्चे प्राथमिक पाठशाला पूरी करने पर भी ठीक से पढ़ नहीं पाते।'),
    why: T('Reading is the gate to every other subject and to lifelong learning.', 'पढ़ना हर विषय और जीवनभर सीखने का द्वार है।'),
    do: T('Sit with the child for 20 minutes daily and let them read aloud.', 'रोज़ 20 मिनट बच्चे के साथ बैठें और उसे ज़ोर से पढ़ने दें।'),
    step: T('Start with a story book in your own language.', 'अपनी भाषा की एक कहानी की किताब से शुरू करें।'),
    avoid: T('Do not scold or compare the child with others.', 'बच्चे को डाँटें नहीं और दूसरों से तुलना न करें।'),
    help: T('Your nearest government school or DIET centre can guide you.', 'आपका नज़दीकी सरकारी विद्यालय या DIET केंद्र मार्गदर्शन कर सकता है।'),
    action: T('Read with one child today, even for ten minutes.', 'आज एक बच्चे के साथ चाहे दस मिनट ही पढ़ें।'),
    community: T('SSF volunteers can start a weekend reading circle.', 'SSF स्वयंसेवक सप्ताहांत पठन-मंडल शुरू कर सकते हैं।'),
  },
  {
    title: T('Adult literacy opens a second chance', 'प्रौढ़ साक्षरता दूसरा अवसर देती है'),
    issue: T('Adults who never learned to read depend on others for basic tasks.', 'जो वयस्क कभी पढ़ना नहीं सीखे, उन्हें हर छोटे काम में दूसरों पर निर्भर रहना पड़ता है।'),
    why: T('Literacy lets a person read a medicine label, a bank slip or a form.', 'साक्षरता से दवा का लेबल, बैंक पर्ची या फ़ॉर्म पढ़ा जा सकता है।'),
    do: T('Teach one adult to write their own name and read numbers.', 'एक वयस्क को अपना नाम लिखना और अंक पढ़ना सिखाएँ।'),
    step: T('Use a slate and practise for 15 minutes each evening.', 'तख्ती लेकर हर शाम 15 मिनट अभ्यास करें।'),
    avoid: T('Never mock an adult for not knowing.', 'किसी वयस्क का अनपढ़ होने पर उपहास न करें।'),
    help: T('Ask about adult education centres at the local panchayat.', 'स्थानीय पंचायत में प्रौढ़ शिक्षा केंद्र के बारे में पूछें।'),
    action: T('Offer 15 minutes to one adult this week.', 'इस सप्ताह एक वयस्क को 15 मिनट दें।'),
    community: T('A village reading group can be run by a few volunteers.', 'कुछ स्वयंसेवक मिलकर गाँव का पठन समूह चला सकते हैं।'),
  },
  {
    title: T('Girls’ education lifts the whole family', 'बालिका शिक्षा पूरे परिवार को ऊपर उठाती है'),
    issue: T('Girls are more often pulled out of school for housework or early marriage.', 'बालिकाओं को अक्सर घर के काम या कम उम्र की शादी के लिए स्कूल से हटा दिया जाता है।'),
    why: T('An educated girl earns more, marries later and educates her own children.', 'शिक्षित बालिका अधिक कमाती है, देर से विवाह करती है और अपने बच्चों को पढ़ाती है।'),
    do: T('Support one girl’s school fee, books or commute.', 'एक बालिका की फीस, किताबें या आने-जाने में सहयोग करें।'),
    step: T('Check that a girl you know is still enrolled this term.', 'देखें कि आपकी जान-पहचान की बालिका इस सत्र में अब भी नामांकित है।'),
    avoid: T('Do not accept “she is needed at home” as final.', '“उसकी ज़रूरत घर में है” को अंतिम बहाना न मानें।'),
    help: T('A government school or NGO can advise on scholarships.', 'सरकारी विद्यालय या संस्था छात्रवृत्ति की सलाह दे सकती है।'),
    action: T('Ask one girl about her studies today.', 'आज एक बालिका से उसकी पढ़ाई के बारे में पूछें।'),
    community: T('SSF can help link families to existing scholarship schemes.', 'SSF परिवारों को मौजूदा छात्रवृत्ति योजनाओं से जोड़ सकता है।'),
  },
];

// ---- 2. digital skills & cyber safety ---------------------------------------
LIBRARY.digital = [
  {
    title: T('Never share an OTP with anyone', 'OTP किसी को न बताएँ'),
    issue: T('Fraudsters call pretending to be bank or gas officers to get an OTP.', 'ठग बैंक या गैस अधिकारी बनकर फ़ोन करके OTP माँगते हैं।'),
    why: T('An OTP is the last key to your account — sharing it lets a stranger take your money.', 'OTP आपके खाते की अंतिम चाबी है — बताने पर अजनबी आपका पैसा निकाल सकता है।'),
    do: T('Hang up and call the bank’s official number on the card.', 'फ़ोन काटें और कार्ड पर लिखे बैंक के आधिकारिक नंबर पर कॉल करें।'),
    step: T('Set a transaction alert SMS on your account.', 'अपने खाते पर लेन-देन का SMS अलर्ट चालू करें।'),
    avoid: T('Never install a screen-sharing app on a caller’s request.', 'कॉल करने वाले के कहने पर स्क्रीन-शेयरिंग ऐप कभी न डालें।'),
    help: T('Report cyber fraud on cybercrime.gov.in or helpline 1930.', 'साइबर धोखे की शिकायत cybercrime.gov.in या हेल्पलाइन 1930 पर करें।'),
    action: T('Warn two elders in your family today.', 'आज परिवार के दो बुज़ुर्गों को सावधान करें।'),
    community: T('SSF can hold a short cyber-safety talk in your colony.', 'SSF आपकी कॉलोनी में साइबर सुरक्षा पर छोटी बैठक रख सकता है।'),
  },
  {
    title: T('Teach a parent to use a smartphone safely', 'माता-पिता को स्मार्टफ़ोन सुरक्षित चलाना सिखाएँ'),
    issue: T('Older people use phones daily but often without basic safety settings.', 'बुज़ुर्ग रोज़ फ़ोन चलाते हैं पर बुनियादी सुरक्षा सेटिंग के बिना।'),
    why: T('A simple settings check prevents most fraud and accidental data loss.', 'सेटिंग की एक छोटी जाँच अधिकतर धोखे और डेटा नुकसान रोक देती है।'),
    do: T('Turn on screen lock, app updates and a phone-finder option.', 'स्क्रीन लॉक, ऐप अपडेट और फ़ोन खोजने की सुविधा चालू करें।'),
    step: T('Save the bank and police helpline numbers in contacts.', 'बैंक और पुलिस के हेल्पलाइन नंबर संपर्क में सेव करें।'),
    avoid: T('Do not click links from unknown numbers.', 'अनजान नंबरों के लिंक पर क्लिक न करें।'),
    help: T('Your telecom operator’s service centre can help with settings.', 'आपके टेलीकॉम ऑपरेटर का सर्विस सेंटर सेटिंग में मदद कर सकता है।'),
    action: T('Spend 10 minutes checking one elder’s phone today.', 'आज किसी बुज़ुर्ग का फ़ोन 10 मिनट जाँचें।'),
    community: T('Volunteers can run a small “phone clinic” at a community hall.', 'स्वयंसेवक समुदाय भवन में छोटा “फ़ोन क्लिनिक” चला सकते हैं।'),
  },
  {
    title: T('Use the internet to learn, not just scroll', 'इंटरनेट से सीखें, केवल स्क्रॉल न करें'),
    issue: T('Many youngsters spend hours online without gaining a usable skill.', 'कई युवा घंटों ऑनलाइन रहते हैं पर कोई उपयोगी कौशल नहीं सीखते।'),
    why: T('Free courses can turn screen time into a job-ready skill.', 'मुफ़्त कोर्स स्क्रीन समय को रोज़गार-योग्य कौशल बना सकते हैं।'),
    do: T('Pick one free course and finish it this month.', 'एक मुफ़्त कोर्स चुनें और इस महीने पूरा करें।'),
    step: T('Keep a notebook of what you learn each day.', 'रोज़ जो सीखें उसकी एक कॉपी रखें।'),
    avoid: T('Do not pay unknown sites for “guaranteed jobs”.', '“पक्की नौकरी” के दावे पर अनजान साइट को पैसे न दें।'),
    help: T('Government skill portals list verified free courses.', 'सरकारी कौशल पोर्टल सत्यापित मुफ़्त कोर्स की सूची देते हैं।'),
    action: T('Enrol in one free course today.', 'आज एक मुफ़्त कोर्स में नाम लिखाएँ।'),
    community: T('SSF can set up a shared computer learning corner.', 'SSF साझा कंप्यूटर सीखने का कोना बना सकता है।'),
  },
];

// ---- 3. health & well-being --------------------------------------------------
LIBRARY.health = [
  {
    title: T('Wash hands, prevent disease for free', 'हाथ धोएँ, बीमारी मुफ़्त में रोकें'),
    issue: T('Many infections spread through unwashed hands.', 'कई संक्रमण बिना धुले हाथों से फैलते हैं।'),
    why: T('Handwashing with soap is the cheapest way to avoid diarrhoea and fever.', 'साबुन से हाथ धोना दस्त और बुखार से बचाव का सबसे सस्ता तरीका है।'),
    do: T('Wash hands with soap before every meal and after the toilet.', 'हर भोजन से पहले और शौच के बाद साबुन से हाथ धोएँ।'),
    step: T('Keep a soap bar near the water point.', 'पानी के पास साबुन रखें।'),
    avoid: T('Do not rely on water alone or on a wet wipe.', 'केवल पानी या गीले टिशू पर निर्भर न रहें।'),
    help: T('Your ASHA or ANM worker can explain hygiene steps.', 'आपकी आशा या एएनएम कार्यकर्ता स्वच्छता के तरीके बता सकती हैं।'),
    action: T('Place a soap near your kitchen tap today.', 'आज रसोई के नल के पास साबुन रखें।'),
    community: T('SSF volunteers can promote handwashing in schools.', 'SSF स्वयंसेवक विद्यालयों में हाथ धुलाई को बढ़ावा दे सकते हैं।'),
  },
  {
    title: T('Know the warning signs before a health emergency', 'आपातकाल से पहले चेतावनी के संकेत जानें'),
    issue: T('People delay treatment because they cannot recognise danger signs.', 'लोग ख़तरे के संकेत न पहचान पाने से इलाज में देर करते हैं।'),
    why: T('Minutes matter in stroke, severe breathlessness or heavy bleeding.', 'स्ट्रोक, तेज़ साँस की तकलीफ़ या अधिक रक्तस्राव में मिनट मायने रखते हैं।'),
    do: T('Learn to spot face drooping, arm weakness and slurred speech.', 'चेहरे का लटकना, हाथ की कमज़ोरी और बोलने में लड़खड़ाहट पहचानना सीखें।'),
    step: T('Save the ambulance number 108 on every family phone.', 'हर परिवार के फ़ोन में एम्बुलेंस नंबर 108 सेव करें।'),
    avoid: T('Do not wait for morning if signs are severe.', 'गंभीर संकेत हों तो सुबह का इंतज़ार न करें।'),
    help: T('108 is the free emergency ambulance helpline in most states.', 'अधिकतर राज्यों में 108 मुफ़्त आपातकालीन एम्बुलेंस हेल्पलाइन है।'),
    action: T('Save 108 and one local doctor’s number now.', 'अभी 108 और एक स्थानीय डॉक्टर का नंबर सेव करें।'),
    community: T('SSF can arrange a basic first-aid session.', 'SSF बुनियादी प्राथमिक चिकित्सा का सत्र करा सकता है।'),
  },
  {
    title: T('Talking about mental health is strength', 'मानसिक स्वास्थ्य पर बात करना साहस है'),
    issue: T('Stigma stops people from seeking help for stress and depression.', 'कलंक के कारण लोग तनाव और अवसाद के लिए मदद नहीं लेते।'),
    why: T('Timely support prevents suffering and saves lives.', 'समय पर सहयोग कष्ट रोकता है और जान बचाता है।'),
    do: T('Ask a friend plainly, “How are you really feeling?”', 'किसी मित्र से सीधे पूछें, “आप सच में कैसा महसूस कर रहे हैं?”'),
    step: T('Listen without judging or giving quick advice.', 'बिना जज किए और जल्दी सलाह दिए सुनें।'),
    avoid: T('Do not say “just be positive” to someone in pain.', 'दुखी व्यक्ति से “सकारात्मक रहो” न कहें।'),
    help: T('A doctor or counsellor can assess and guide; tele-mental-health helplines also exist.', 'डॉक्टर या काउंसलर जाँच कर मार्गदर्शन कर सकते हैं; टेली-मानसिक स्वास्थ्य हेल्पलाइन भी हैं।'),
    action: T('Check on one person you have not spoken to lately.', 'उस व्यक्ति का हाल पूछें जिससे कुछ समय से बात नहीं हुई।'),
    community: T('SSF can share verified helpline numbers at its centres.', 'SSF अपने केंद्रों पर सत्यापित हेल्पलाइन नंबर बाँट सकता है।'),
  },
];

// ---- 4. women’s rights & dignity --------------------------------------------
LIBRARY.women = [
  {
    title: T('A skill makes a woman financially independent', 'कौशल महिला को आर्थिक रूप से आत्मनिर्भर बनाता है'),
    issue: T('Many women have no independent income or bank access.', 'कई महिलाओं की अपनी आय या बैंक पहुँच नहीं होती।'),
    why: T('Independent income gives a woman a voice at home and safety in a crisis.', 'अपनी आय महिला को घर में आवाज़ और संकट में सुरक्षा देती है।'),
    do: T('Help her open a bank account and learn one skill.', 'उन्हें बैंक खाता खुलवाने और एक कौशल सीखने में मदद करें।'),
    step: T('Start with a free government skill-training course.', 'सरकारी मुफ़्त कौशल-प्रशिक्षण कोर्स से शुरू करें।'),
    avoid: T('Do not let anyone else keep her earnings.', 'उनकी कमाई कोई और न रखे — इसका ध्यान रखें।'),
    help: T('The local bank branch and skill-centre can guide the process.', 'स्थानीय बैंक शाखा और कौशल केंद्र प्रक्रिया बता सकते हैं।'),
    action: T('Support one woman’s training or account today.', 'आज एक महिला के प्रशिक्षण या खाते में सहयोग करें।'),
    community: T('SSF can connect women to existing self-help groups.', 'SSF महिलाओं को मौजूदा स्वयं सहायता समूहों से जोड़ सकता है।'),
  },
  {
    title: T('Safety begins with knowing your rights', 'सुरक्षा अपने अधिकार जानने से शुरू होती है'),
    issue: T('Women facing harassment often do not know where to complain.', 'उत्पीड़न झेल रहीं महिलाओं को अक्सर शिकायत की जगह नहीं पता होती।'),
    why: T('Awareness of rights and helplines turns fear into action.', 'अधिकार और हेल्पलाइन की जानकारी डर को कार्रवाई में बदलती है।'),
    do: T('Share the women’s helpline 181 and police 112 widely.', 'महिला हेल्पलाइन 181 और पुलिस 112 व्यापक रूप से बाँटें।'),
    step: T('Write the numbers where they are easy to reach.', 'नंबर ऐसी जगह लिखें जहाँ आसानी से मिलें।'),
    avoid: T('Never advise a victim to stay silent for “family honour”.', '“परिवार की इज़्ज़त” के लिए चुप रहने की सलाह कभी न दें।'),
    help: T('181 is the women’s helpline; 112 is the emergency number.', '181 महिला हेल्पलाइन है; 112 आपातकालीन नंबर है।'),
    action: T('Tell two people about 181 today.', 'आज दो लोगों को 181 के बारे में बताएँ।'),
    community: T('SSF can display helpline numbers at its notice boards.', 'SSF अपने नोटिस बोर्ड पर हेल्पलाइन नंबर लगा सकता है।'),
  },
  {
    title: T('Equal work, equal dignity at home', 'घर में समान काम, समान गरिमा'),
    issue: T('Household work is often unpaid and shared unequally.', 'घर का काम अक्सर बिना वेतन और असमान रूप से बाँटा जाता है।'),
    why: T('Sharing chores reduces women’s burden and sets an example for children.', 'काम बाँटने से महिलाओं का बोझ घटता है और बच्चों को उदाहरण मिलता है।'),
    do: T('Take up one daily household task yourself.', 'रोज़ का एक घरेलू काम खुद करें।'),
    step: T('Start with the kitchen or the morning cleaning.', 'रसोई या सुबह की सफ़ाई से शुरू करें।'),
    avoid: T('Do not call housework “only women’s work”.', 'घर के काम को “केवल महिलाओं का काम” न कहें।'),
    help: T('Family counselling services can help resolve disputes.', 'पारिवारिक परामर्श सेवाएँ विवाद सुलझाने में मदद कर सकती हैं।'),
    action: T('Do one extra chore at home today.', 'आज घर में एक अतिरिक्त काम करें।'),
    community: T('SSF can discuss fair sharing in its family meetings.', 'SSF पारिवारिक बैठकों में न्यायपूर्ण बँटवारे पर चर्चा कर सकता है।'),
  },
];

// ---- 5. child rights & protection -------------------------------------------
LIBRARY.child = [
  {
    title: T('Every child has a right to play and safety', 'हर बच्चे का खेल और सुरक्षा पर अधिकार है'),
    issue: T('Some children work or are pushed into unsafe situations.', 'कुछ बच्चे काम करते हैं या असुरक्षित हालात में धकेल दिए जाते हैं।'),
    why: T('Childhood is for learning and play, not labour or fear.', 'बचपन सीखने और खेल का समय है, मज़दूरी या डर का नहीं।'),
    do: T('Report a child in danger without delay.', 'ख़तरे में बच्चे की सूचना तुरंत दें।'),
    step: T('Note the location and call the child helpline 1098.', 'जगह नोट करें और चाइल्ड हेल्पलाइन 1098 पर कॉल करें।'),
    avoid: T('Do not try to handle a dangerous case alone.', 'ख़तरनाक मामले को अकेले सुलझाने की कोशिश न करें।'),
    help: T('1098 is the national Childline helpline.', '1098 राष्ट्रीय चाइल्डलाइन हेल्पलाइन है।'),
    action: T('Save 1098 on your phone today.', 'आज 1098 अपने फ़ोन में सेव करें।'),
    community: T('SSF can run child-safety awareness in local schools.', 'SSF स्थानीय विद्यालयों में बाल-सुरक्षा जागरूकता चला सकता है।'),
  },
  {
    title: T('Good touch, bad touch — teach children early', 'अच्छा स्पर्श, बुरा स्पर्श — बच्चों को जल्दी सिखाएँ'),
    issue: T('Children often cannot name or report inappropriate behaviour.', 'बच्चे अक्सर अनुचित व्यवहार को नाम या रिपोर्ट नहीं कर पाते।'),
    why: T('Simple, age-appropriate teaching helps children speak up and stay safe.', 'उम्र के अनुसार सरल शिक्षा बच्चों को बोलने और सुरक्षित रहने में मदद करती है।'),
    do: T('Tell children their body is theirs and secrets can be told.', 'बच्चों को बताएँ कि उनका शरीर उनका है और कोई भेद नहीं छिपाना चाहिए।'),
    step: T('Name caring adults a child can talk to.', 'उन विश्वसनीय बड़ों के नाम बताएँ जिनसे बच्चा बात कर सकता है।'),
    avoid: T('Do not scold a child who reports something.', 'जो बच्चा बताए उसे डाँटें नहीं।'),
    help: T('Childline 1098 and the local women-and-child office can help.', 'चाइल्डलाइन 1098 और स्थानीय महिला-बाल कार्यालय मदद कर सकते हैं।'),
    action: T('Have a calm safety talk with one child today.', 'आज एक बच्चे से शांति से सुरक्षा की बात करें।'),
    community: T('SSF can arrange a trained counsellor for schools.', 'SSF विद्यालयों के लिए प्रशिक्षित काउंसलर की व्यवस्था कर सकता है।'),
  },
  {
    title: T('Nutrition: a strong start for every child', 'पोषण: हर बच्चे के लिए मज़बूत शुरुआत'),
    issue: T('Poor nutrition stunts growth and learning.', 'ख़राब पोषण विकास और सीखने को रोकता है।'),
    why: T('The first 1,000 days shape a child’s health for life.', 'पहले 1,000 दिन बच्चे के जीवनभर के स्वास्थ्य की नींव रखते हैं।'),
    do: T('Include iron-rich and protein foods in the child’s plate.', 'बच्चे की थाली में लोहा और प्रोटीन वाले भोजन शामिल करें।'),
    step: T('Use the free take-home ration at the anganwadi.', 'आंगनवाड़ी से मुफ़्त पौष्टिक राशन लें।'),
    avoid: T('Do not replace meals with tea or packaged snacks.', 'भोजन की जगह चाय या पैकेट स्नैक्स न रखें।'),
    help: T('The anganwadi or health worker can weigh and advise.', 'आंगनवाड़ी या स्वास्थ्य कार्यकर्ता वज़न और सलाह दे सकती हैं।'),
    action: T('Check the growth record of one child today.', 'आज एक बच्चे का विकास-रिकॉर्ड देखें।'),
    community: T('SSF can promote kitchen-garden vegetables in homes.', 'SSF घरों में रसोई-बगीचे को बढ़ावा दे सकता है।'),
  },
];

// ---- 6. youth, careers & enterprise -----------------------------------------
LIBRARY.youth = [
  {
    title: T('Turn a hobby into a small income', 'शौक को छोटी आमदनी में बदलें'),
    issue: T('Many young people wait for a job without trying independent work.', 'कई युवा स्वरोज़गार की कोशिश किए बिना नौकरी का इंतज़ार करते हैं।'),
    why: T('A small business builds skills and money even before a job arrives.', 'छोटा व्यवसाय नौकरी से पहले ही कौशल और पैसा बनाता है।'),
    do: T('Identify one skill others already ask you for.', 'वह एक कौशल पहचानें जो लोग पहले से आपसे माँगते हैं।'),
    step: T('Serve your first three customers with care.', 'अपने पहले तीन ग्राहकों की ईमानदारी से सेवा करें।'),
    avoid: T('Do not take a large loan to begin.', 'शुरुआत के लिए बड़ा क़र्ज़ न लें।'),
    help: T('A bank’s micro-enterprise desk can explain small loans.', 'बैंक की सूक्ष्म-उद्यम शाखा छोटे क़र्ज़ समझा सकती है।'),
    action: T('Write your first three customer names today.', 'आज अपने पहले तीन ग्राहकों के नाम लिखें।'),
    community: T('SSF can organise a market-day stall for young sellers.', 'SSF युवा विक्रेताओं के लिए बाज़ार-दिवस का स्टॉल लगा सकता है।'),
  },
  {
    title: T('Prepare a résumé even before you need one', 'ज़रूरत से पहले रिज़्यूमे बनाएँ'),
    issue: T('Young candidates lose opportunities for want of a prepared résumé.', 'युवा उम्मीदवार तैयार रिज़्यूमे के अभाव में अवसर खो देते हैं।'),
    why: T('A clear one-page résumé makes you ready the moment a job appears.', 'साफ़ एक पन्ने का रिज़्यूमे नौकरी आते ही आपको तैयार रखता है।'),
    do: T('List skills, education and any volunteer work honestly.', 'कौशल, शिक्षा और स्वयंसेवा का ईमानदार विवरण लिखें।'),
    step: T('Keep a soft copy on your phone and email.', 'फ़ोन और ईमेल में एक सॉफ़्ट कॉपी रखें।'),
    avoid: T('Never exaggerate qualifications.', 'योग्यता बढ़ा-चढ़ाकर न लिखें।'),
    help: T('A government employment exchange or college placement cell can help.', 'सरकारी रोज़गार कार्यालय या महाविद्यालय प्लेसमेंट सेल मदद कर सकता है।'),
    action: T('Write the first draft of your résumé today.', 'आज अपना पहला रिज़्यूमे लिखें।'),
    community: T('SSF can hold a free résumé-writing workshop.', 'SSF मुफ़्त रिज़्यूमे-लेखन कार्यशाला रख सकता है।'),
  },
  {
    title: T('Volunteering builds the skills employers want', 'स्वयंसेवा वह कौशल बनाती है जो नियोक्ता चाहते हैं'),
    issue: T('Fresh graduates often lack teamwork and communication experience.', 'नए स्नातकों में अक्सर टीम-भावना और संवाद का अनुभव नहीं होता।'),
    why: T('Volunteering adds real experience and references to a résumé.', 'स्वयंसेवा रिज़्यूमे में वास्तविक अनुभव और संदर्भ जोड़ती है।'),
    do: T('Give two hours a week to a cause you believe in.', 'हर सप्ताह दो घंटे किसी अच्छे काम को दें।'),
    step: T('Choose one organisation and stay for three months.', 'एक संस्था चुनें और तीन महीने टिकें।'),
    avoid: T('Do not volunteer only for a certificate.', 'केवल प्रमाणपत्र के लिए स्वयंसेवा न करें।'),
    help: T('Local NGOs and community centres welcome regular volunteers.', 'स्थानीय संस्थाएँ और समुदाय केंद्र नियमित स्वयंसेवकों का स्वागत करते हैं।'),
    action: T('Message one organisation about volunteering today.', 'आज एक संस्था को स्वयंसेवा के बारे में संदेश भेजें।'),
    community: T('SSF needs regular volunteers for its programmes.', 'SSF को अपने कार्यक्रमों के लिए नियमित स्वयंसेवक चाहिए।'),
  },
];

// ---- 7. farmers & rural livelihood ------------------------------------------
LIBRARY.farmer = [
  {
    title: T('Soil health: the base of every harvest', 'मृदा स्वास्थ्य: हर फसल की नींव'),
    issue: T('Overuse of chemicals weakens the soil over time.', 'रसायनों का अधिक उपयोग धीरे-धीरे मिट्टी को कमज़ोर करता है।'),
    why: T('Healthy soil holds water and nutrients better, giving steadier yields.', 'स्वस्थ मिट्टी पानी और पोषक तत्व बेहतर रोकती है, जिससे उपज स्थिर रहती है।'),
    do: T('Add compost or green manure to the field.', 'खेत में कम्पोस्ट या हरी खाद डालें।'),
    step: T('Start a compost pit with crop waste and dung.', 'फसल अवशेष और गोबर से कम्पोस्ट गड्ढा बनाएँ।'),
    avoid: T('Do not burn crop residue.', 'फसल अवशेष न जलाएँ।'),
    help: T('The local Krishi Vigyan Kendra offers free soil advice.', 'स्थानीय कृषि विज्ञान केंद्र मुफ़्त मृदा सलाह देता है।'),
    action: T('Start one compost pit this week.', 'इस सप्ताह एक कम्पोस्ट गड्ढा शुरू करें।'),
    community: T('SSF can help farmers share a compost unit.', 'SSF किसानों को साझा कम्पोस्ट इकाई में मदद कर सकता है।'),
  },
  {
    title: T('Save water on the farm', 'खेत में पानी बचाएँ'),
    issue: T('Flood irrigation wastes a lot of water.', 'बहाव सिंचाई बहुत पानी बर्बाद करती है।'),
    why: T('Water saved now protects the next crop and the water table.', 'अभी बचाया पानी अगली फसल और भूजल की रक्षा करता है।'),
    do: T('Level the field and use furrows instead of flooding.', 'खेत समतल करें और बहाव की जगह नालियों का उपयोग करें।'),
    step: T('Fix the channel so water does not leak.', 'नाली ठीक करें ताकि पानी रिसे नहीं।'),
    avoid: T('Do not irrigate in the hottest afternoon.', 'दोपहर की तेज़ धूप में सिंचाई न करें।'),
    help: T('The agriculture office can advise on drip and sprinkler support.', 'कृषि कार्यालय ड्रिप और स्प्रिंकलर सहयोग की सलाह दे सकता है।'),
    action: T('Check one leaking channel today.', 'आज एक रिसती नाली जाँचें।'),
    community: T('SSF can spread micro-irrigation awareness.', 'SSF सूक्ष्म सिंचाई की जागरूकता फैला सकता है।'),
  },
  {
    title: T('Sell together, earn better', 'मिलकर बेचें, बेहतर कमाएँ'),
    issue: T('Small farmers sell alone and often get low prices.', 'छोटे किसान अकेले बेचते हैं और अक्सर कम दाम पाते हैं।'),
    why: T('Grouping produce lowers cost and improves bargaining.', 'उपज को समूह में लाने से लागत घटती और सौदेबाज़ी बेहतर होती है।'),
    do: T('Join or form a farmer producer group.', 'किसान उत्पादक समूह से जुड़ें या बनाएँ।'),
    step: T('Talk to ten neighbours about selling together.', 'दस पड़ोसियों से मिलकर बेचने की बात करें।'),
    avoid: T('Do not commit to a buyer without a fair rate.', 'उचित दाम तय किए बिना व्यापारी से वादा न करें।'),
    help: T('The block agriculture office can register an FPO.', 'ब्लॉक कृषि कार्यालय एफपीओ पंजीकृत कर सकता है।'),
    action: T('Speak to three farmers today about a group.', 'आज तीन किसानों से समूह की बात करें।'),
    community: T('SSF can help form a farmer producer group.', 'SSF किसान उत्पादक समूह बनाने में मदद कर सकता है।'),
  },
];

// ---- 8. environment & climate -----------------------------------------------
LIBRARY.environment = [
  {
    title: T('Plant a tree that will outlive you', 'वह पेड़ लगाएँ जो आपसे ज़्यादा जिए'),
    issue: T('Tree cover is shrinking, raising heat and dust.', 'पेड़ों का क्षेत्र घट रहा है, जिससे गर्मी और धूल बढ़ रही है।'),
    why: T('Trees give shade, clean air, birds and cooler streets.', 'पेड़ छाया, स्वच्छ हवा, पक्षी और ठंडी गलियाँ देते हैं।'),
    do: T('Plant one native tree where it can grow safely.', 'एक देशी पेड़ ऐसी जगह लगाएँ जहाँ सुरक्षित बढ़े।'),
    step: T('Water it weekly for the first year.', 'पहले साल हर सप्ताह पानी दें।'),
    avoid: T('Do not plant where it will be cut soon.', 'ऐसी जगह न लगाएँ जहाँ जल्दी कट जाए।'),
    help: T('The forest or horticulture office gives free saplings.', 'वन या उद्यान कार्यालय मुफ़्त पौधे देता है।'),
    action: T('Get one sapling and plant it this week.', 'इस सप्ताह एक पौधा लेकर लगाएँ।'),
    community: T('SSF can organise a village plantation drive.', 'SSF गाँव में वृक्षारोपण अभियान चला सकता है।'),
  },
  {
    title: T('Segregate waste at home', 'घर पर कचरा अलग करें'),
    issue: T('Mixed waste cannot be recycled and pollutes land and water.', 'मिला हुआ कचरा रीसाइकल नहीं होता और ज़मीन-पानी को दूषित करता है।'),
    why: T('Separating wet and dry waste makes compost and reduces landfill.', 'गीले-सूखे कचरे को अलग करने से खाद बनती है और कचरा घटता है।'),
    do: T('Keep two bins — green for wet, blue for dry.', 'दो डिब्बे रखें — गीले के लिए हरा, सूखे के लिए नीला।'),
    step: T('Compost kitchen wet waste in a bucket.', 'रसोई का गीला कचरा बाल्टी में खाद बनाएँ।'),
    avoid: T('Do not burn plastic.', 'प्लास्टिक न जलाएँ।'),
    help: T('The municipal office can tell you the collection schedule.', 'नगरपालिका कार्यालय संग्रहण का समय बता सकता है।'),
    action: T('Set up two bins at home today.', 'आज घर पर दो डिब्बे रखें।'),
    community: T('SSF can promote segregation in its neighbourhood.', 'SSF अपने मोहल्ले में कचरा पृथक्करण को बढ़ावा दे सकता है।'),
  },
  {
    title: T('Say no to single-use plastic', 'सिंगल-यूज़ प्लास्टिक को ना कहें'),
    issue: T('Thin plastic bags choke drains and harm animals.', 'पतली प्लास्टिक थैलियाँ नाले रोकती और जानवरों को नुकसान पहुँचाती हैं।'),
    why: T('Reusable bags and bottles cut pollution for years.', 'बार-बार प्रयोग की थैलियाँ और बोतलें सालों तक प्रदूषण घटाती हैं।'),
    do: T('Carry a cloth bag and a steel bottle every day.', 'रोज़ कपड़े का थैला और स्टील बोतल रखें।'),
    step: T('Keep the cloth bag at the door so you never forget.', 'कपड़े का थैला दरवाज़े पर रखें ताकि भूलें नहीं।'),
    avoid: T('Do not accept a thin bag for one item.', 'एक चीज़ के लिए भी पतली थैली न लें।'),
    help: T('Local shops and markets increasingly welcome BYO bags.', 'स्थानीय दुकानें अपने थैले का स्वागत करती हैं।'),
    action: T('Keep a cloth bag in your vehicle today.', 'आज अपने वाहन में कपड़े का थैला रखें।'),
    community: T('SSF can distribute cloth bags at its events.', 'SSF अपने आयोजनों में कपड़े के थैले बाँट सकता है।'),
  },
];

// ---- 9. financial literacy ---------------------------------------------------
LIBRARY.finance = [
  {
    title: T('Save a little before you spend', 'खर्च से पहले थोड़ा बचाएँ'),
    issue: T('Many families spend their whole income and save nothing.', 'कई परिवार पूरी आय खर्च कर देते हैं और कुछ नहीं बचाते।'),
    why: T('A small monthly saving becomes a safety net in an emergency.', 'छोटी मासिक बचत आपातकाल में सुरक्षा कवच बनती है।'),
    do: T('Move even ₹50 to savings on income day.', 'आय के दिन ₹50 भी बचत में डालें।'),
    step: T('Open a recurring deposit or post-office savings.', 'आवर्ती जमा या डाकघर बचत खाता खोलें।'),
    avoid: T('Do not borrow from a moneylender for daily needs.', 'रोज़ की ज़रूरत के लिए साहूकार से क़र्ज़ न लें।'),
    help: T('A bank or post office can explain safe schemes.', 'बैंक या डाकघर सुरक्षित योजनाएँ समझा सकते हैं।'),
    action: T('Start one small saving this month.', 'इस महीने एक छोटी बचत शुरू करें।'),
    community: T('SSF can run a basic money-planning session.', 'SSF बुनियादी धन-योजना का सत्र चला सकता है।'),
  },
  {
    title: T('Beware of promises of quick money', 'तेज़ पैसों के दावों से सावधान रहें'),
    issue: T('Fraudulent schemes promise huge returns to trap savings.', 'धोखाधड़ी वाली योजनाएँ बड़ा मुनाफ़ा का लालच देकर बचत फँसाती हैं।'),
    why: T('Once money is gone to a scam, it is rarely recovered.', 'धोखे में गया पैसा जल्दी वापस नहीं आता।'),
    do: T('Check whether a scheme is registered and regulated.', 'देखें कि योजना पंजीकृत और नियंत्रित है या नहीं।'),
    step: T('Ask for the scheme in writing and read it slowly.', 'योजना लिखित में माँगें और धीरे पढ़ें।'),
    avoid: T('Do not be pressured to pay immediately.', 'तुरंत भुगतान के दबाव में न आएँ।'),
    help: T('Report cheating to the police and cyber helpline 1930.', 'धोखे की शिकायत पुलिस और साइबर हेल्पलाइन 1930 पर करें।'),
    action: T('Warn one person investing in a “double money” offer.', '“दुगुना पैसा” के निवेश पर एक व्यक्ति को सावधान करें।'),
    community: T('SSF can share verified scheme information.', 'SSF सत्यापित योजना जानकारी बाँट सकता है।'),
  },
  {
    title: T('Know your consumer rights', 'अपने उपभोक्ता अधिकार जानें'),
    issue: T('People accept defective goods without complaint.', 'लोग ख़राब सामान बिना शिकायत स्वीकार कर लेते हैं।'),
    why: T('A complaint often brings a refund, repair or replacement.', 'शिकायत अक्सर वापसी, मरम्मत या बदलाव कराती है।'),
    do: T('Always keep the bill for anything you buy.', 'जो खरीदें उसका बिल हमेशा रखें।'),
    step: T('Note the shop’s return policy before paying.', 'भुगतान से पहले दुकान की वापसी नीति देखें।'),
    avoid: T('Do not buy without a receipt.', 'बिना रसीद न खरीदें।'),
    help: T('Consumer helplines and the consumer court handle disputes.', 'उपभोक्ता हेल्पलाइन और उपभोक्ता न्यायालय विवाद देखते हैं।'),
    action: T('Keep today’s bills in one folder.', 'आज के बिल एक फ़ाइल में रखें।'),
    community: T('SSF can explain the complaint process in a meeting.', 'SSF बैठक में शिकायत प्रक्रिया समझा सकता है।'),
  },
];


// ---- 10. government schemes -------------------------------------------------
LIBRARY.schemes = [
  {
    title: T('Check what scheme you are eligible for', 'देखें आप किस योजना के पात्र हैं'),
    issue: T('Many people miss benefits because they never apply.', 'कई लोग आवेदन न करने से लाभ से चूक जाते हैं।'),
    why: T('A scheme can save real money on health, food, housing or school.', 'योजना स्वास्थ्य, भोजन, आवास या स्कूल पर असली पैसा बचाती है।'),
    do: T('Visit a Common Service Centre and ask what applies to you.', 'सामान्य सेवा केंद्र जाकर पूछें कि आप पर क्या लागू है।'),
    step: T('Keep Aadhaar, ration card and bank passbook copies ready.', 'आधार, राशन कार्ड और बैंक पासबुक की कॉपी तैयार रखें।'),
    avoid: T('Do not pay a large fee to any agent.', 'किसी एजेंट को बड़ी फ़ीस न दें।'),
    help: T('The official portal or CSC is the reliable place to apply.', 'आधिकारिक पोर्टल या सीएससी आवेदन की विश्वसनीय जगह है।'),
    action: T('List the documents you already have today.', 'आज अपने मौजूद दस्तावेज़ों की सूची बनाएँ।'),
    community: T('SSF can help families fill forms correctly.', 'SSF परिवारों को फ़ॉर्म सही भरने में मदद कर सकता है।'),
  },
  {
    title: T('Update your Aadhaar and bank link', 'आधार और बैंक लिंक अपडेट रखें'),
    issue: T('Benefits fail to arrive when Aadhaar and bank details do not match.', 'आधार और बैंक विवरण मेल न खाने पर लाभ नहीं पहुँचता।'),
    why: T('Direct benefit transfer needs an exact name and number match.', 'प्रत्यक्ष लाभ अंतरण के लिए नाम और नंबर का सटीक मिलान ज़रूरी है।'),
    do: T('Check your bank passbook for the linked Aadhaar.', 'बैंक पासबुक में जुड़ा आधार जाँचें।'),
    step: T('Correct spelling errors at the bank branch.', 'बैंक शाखा में नाम की वर्तनी ठीक कराएँ।'),
    avoid: T('Do not share Aadhaar OTP with anyone.', 'आधार OTP किसी को न बताएँ।'),
    help: T('The bank branch and Aadhaar centre resolve mismatches.', 'बैंक शाखा और आधार केंद्र गड़बड़ी सुधारते हैं।'),
    action: T('Check one passbook today.', 'आज एक पासबुक जाँचें।'),
    community: T('SSF can hold a document-check day.', 'SSF दस्तावेज़ जाँच दिवस रख सकता है।'),
  },
  {
    title: T('Health cover: know before you need it', 'स्वास्थ्य बीमा: ज़रूरत से पहले जानें'),
    issue: T('Families borrow heavily for hospital bills.', 'परिवार अस्पताल के खर्च के लिए भारी क़र्ज़ लेते हैं।'),
    why: T('A known health-cover scheme can prevent debt in illness.', 'ज्ञात स्वास्थ्य योजना बीमारी में क़र्ज़ रोक सकती है।'),
    do: T('Ask whether your family is covered by a government health scheme.', 'पूछें कि आपका परिवार किसी सरकारी स्वास्थ्य योजना में है या नहीं।'),
    step: T('Keep the health card with other important papers.', 'स्वास्थ्य कार्ड अन्य ज़रूरी कागज़ों के साथ रखें।'),
    avoid: T('Do not ignore a hospital that asks for the card.', 'कार्ड माँगने वाले अस्पताल की उपेक्षा न करें।'),
    help: T('The hospital help desk or health office can confirm coverage.', 'अस्पताल सहायता डेस्क या स्वास्थ्य कार्यालय कवरेज बता सकता है।'),
    action: T('Find your family’s health card today.', 'आज अपने परिवार का स्वास्थ्य कार्ड खोजें।'),
    community: T('SSF can add an information desk at its health camps.', 'SSF अपने स्वास्थ्य शिविरों में सूचना डेस्क जोड़ सकता है।'),
  },
];

// ---- 11. legal & civic awareness --------------------------------------------
LIBRARY.legal = [
  {
    title: T('You can file a complaint without a lawyer', 'बिना वकील भी शिकायत दर्ज करा सकते हैं'),
    issue: T('People avoid complaints thinking it needs money and lawyers.', 'लोग सोचते हैं शिकायत में पैसा और वकील लगेगा, इसलिए टालते हैं।'),
    why: T('Many grievances can be filed simply and free of cost.', 'कई शिकायतें सरल और मुफ़्त में दर्ज हो सकती हैं।'),
    do: T('Write the facts, date and place clearly.', 'तथ्य, तारीख़ और जगह साफ़ लिखें।'),
    step: T('Submit a written complaint and keep a receipt copy.', 'लिखित शिकायत दें और रसीद की कॉपी रखें।'),
    avoid: T('Do not give false information in a complaint.', 'शिकायत में झूठी जानकारी न दें।'),
    help: T('The local police, consumer forum or grievance portal can guide you.', 'स्थानीय पुलिस, उपभोक्ता मंच या शिकायत पोर्टल मार्गदर्शन कर सकते हैं।'),
    action: T('Note down one pending grievance today.', 'आज एक लंबित शिकायत लिख लें।'),
    community: T('SSF can help draft a simple complaint.', 'SSF सरल शिकायत लिखने में मदद कर सकता है।'),
  },
  {
    title: T('Know the difference between a bribe and a fee', 'रिश्वत और शुल्क में फ़र्क़ जानें'),
    issue: T('People pay unofficial money for services that should be free.', 'लोग उन सेवाओं के लिए अनौपचारिक पैसा देते हैं जो मुफ़्त होनी चाहिए।'),
    why: T('Knowing the official fee protects you from exploitation.', 'आधिकारिक शुल्क जानने से शोषण से बचाव होता है।'),
    do: T('Ask for an official receipt for every payment.', 'हर भुगतान की आधिकारिक रसीद माँगें।'),
    step: T('Check the fee on the department’s notice board.', 'विभाग के नोटिस बोर्ड पर शुल्क देखें।'),
    avoid: T('Do not pay cash without a receipt.', 'बिना रसीद नक़द न दें।'),
    help: T('An anti-corruption helpline or the department head can help.', 'भ्रष्टाचार-रोधी हेल्पलाइन या विभागाध्यक्ष मदद कर सकते हैं।'),
    action: T('Keep receipts for one service you use today.', 'आज जिस सेवा का उपयोग करें उसकी रसीद रखें।'),
    community: T('SSF can display official fee charts at its centres.', 'SSF अपने केंद्रों पर आधिकारिक शुल्क सूची लगा सकता है।'),
  },
  {
    title: T('Voting is a right and a duty', 'मतदान अधिकार और कर्तव्य दोनों है'),
    issue: T('Some voters miss the roll or the polling day.', 'कुछ मतदाता सूची या मतदान दिवस चूक जाते हैं।'),
    why: T('A single vote shapes local services like water, roads and schools.', 'एक वोट पानी, सड़क और स्कूल जैसी सेवाएँ तय करता है।'),
    do: T('Check your name in the voter list and correct errors.', 'मतदाता सूची में अपना नाम देखें और गलती ठीक कराएँ।'),
    step: T('Keep your voter slip ready before polling day.', 'मतदान दिवस से पहले पर्ची तैयार रखें।'),
    avoid: T('Do not accept money or gifts for a vote.', 'वोट के लिए पैसा या उपहार न लें।'),
    help: T('The election office or official voter portal can help.', 'निर्वाचन कार्यालय या आधिकारिक पोर्टल मदद कर सकता है।'),
    action: T('Verify one family member’s voter entry today.', 'आज एक परिवार के सदस्य की प्रविष्टि जाँचें।'),
    community: T('SSF can spread voter-awareness messages.', 'SSF मतदाता-जागरूकता संदेश फैला सकता है।'),
  },
];

// ---- 12. disability inclusion & accessibility -------------------------------
LIBRARY.disability = [
  {
    title: T('Accessibility is a right, not a favour', 'सुगम्यता अधिकार है, एहसान नहीं'),
    issue: T('Steps, narrow doors and bad ramps exclude people with disabilities.', 'सीढ़ियाँ, संकरी दरवाज़े और ख़राब रैंप दिव्यांगजनों को बाहर रखते हैं।'),
    why: T('Inclusion lets everyone study, work and travel with dignity.', 'समावेश सबको गरिमा के साथ पढ़ने, काम और यात्रा करने देता है।'),
    do: T('Point out one inaccessible entrance to its owner politely.', 'एक अगम्य प्रवेश द्वार के बारे में मालिक को विनम्रता से बताएँ।'),
    step: T('Suggest a simple ramp or a handrail.', 'सरल रैंप या रेलिंग का सुझाव दें।'),
    avoid: T('Do not speak about a disabled person as if they are absent.', 'दिव्यांग व्यक्ति की उपस्थिति में उनके बारे में ऐसे न बोलें जैसे वे न हों।'),
    help: T('The disability office issues UDID cards and support.', 'दिव्यांग कार्यालय यूडीआईडी कार्ड और सहयोग देता है।'),
    action: T('Identify one inaccessible spot in your area today.', 'आज अपने क्षेत्र में एक अगम्य जगह पहचानें।'),
    community: T('SSF can audit simple accessibility at public buildings.', 'SSF सार्वजनिक भवनों की सरल सुगम्यता जाँच सकता है।'),
  },
  {
    title: T('Respect and include older people', 'बुज़ुर्गों का सम्मान और सहभागिता'),
    issue: T('Older people are often left out of decisions and company.', 'बुज़ुर्ग अक्सर फैसलों और साथ से बाहर रह जाते हैं।'),
    why: T('Their experience guides a family and their dignity matters.', 'उनका अनुभव परिवार को राह दिखाता है और उनकी गरिमा महत्वपूर्ण है।'),
    do: T('Spend ten minutes listening to an elder today.', 'आज दस मिनट किसी बुज़ुर्ग की बात सुनें।'),
    step: T('Ask them to share one story or piece of advice.', 'उनसे एक कहानी या सलाह साझा करने को कहें।'),
    avoid: T('Do not talk over or dismiss them.', 'उनकी बात काटें या टालें नहीं।'),
    help: T('Health and social-welfare offices support elder care.', 'स्वास्थ्य और समाज कल्याण कार्यालय बुज़ुर्ग देखभाल में सहयोग करते हैं।'),
    action: T('Call one elder relative today.', 'आज एक बुज़ुर्ग रिश्तेदार को फ़ोन करें।'),
    community: T('SSF can organise a monthly elders’ meet.', 'SSF मासिक बुज़ुर्ग मिलन आयोजित कर सकता है।'),
  },
];

// ---- 13. road safety & disaster readiness -----------------------------------
LIBRARY.roadsafety = [
  {
    title: T('Wear a helmet, save a life', 'हेलमेट पहनें, जान बचाएँ'),
    issue: T('Head injuries in two-wheeler crashes are often fatal.', 'दोपहिया दुर्घटना में सिर की चोट अक्सर घातक होती है।'),
    why: T('A helmet reduces the chance of death and disability sharply.', 'हेलमेट मृत्यु और विकलांगता का ख़तरा बहुत घटाता है।'),
    do: T('Wear a fastened, standard helmet on every ride.', 'हर यात्रा पर मानक हेलमेट ठीक से बाँधें।'),
    step: T('Buy a helmet that fits and shows a standard mark.', 'फ़िटिंग वाला और मानक चिह्न युक्त हेलमेट लें।'),
    avoid: T('Do not carry a pillion rider without a helmet.', 'बिना हेलमेट दूसरे सवार को न बैठाएँ।'),
    help: T('Traffic police and road-safety cells run awareness drives.', 'यातायात पुलिस और सड़क-सुरक्षा इकाइयाँ जागरूकता चलाती हैं।'),
    action: T('Check your helmet strap today.', 'आज अपने हेलमेट का पट्टा जाँचें।'),
    community: T('SSF can distribute reflective stickers for night riding.', 'SSF रात की सवारी के लिए चमकदार स्टिकर बाँट सकता है।'),
  },
  {
    title: T('Be ready before a disaster strikes', 'आपदा से पहले तैयार रहें'),
    issue: T('Families rarely plan what to do in a flood, fire or quake.', 'परिवार बाढ़, आग या भूकंप के समय की योजना नहीं बनाते।'),
    why: T('A simple plan and a kit save minutes that save lives.', 'सरल योजना और किट वे मिनट बचाते हैं जो जान बचाते हैं।'),
    do: T('Keep water, dry food, a torch and documents in one bag.', 'पानी, सूखा भोजन, टॉर्च और दस्तावेज़ एक थैले में रखें।'),
    step: T('Agree on a family meeting point and one out-of-town contact.', 'परिवार का मिलन-स्थल और एक बाहर का संपर्क तय करें।'),
    avoid: T('Do not spread unverified disaster rumours.', 'आपदा की असत्यापित अफ़वाहें न फैलाएँ।'),
    help: T('112 and 108 handle emergencies; district control rooms give updates.', '112 और 108 आपातकाल देखते हैं; ज़िला नियंत्रण कक्ष जानकारी देते हैं।'),
    action: T('Prepare one emergency bag this week.', 'इस सप्ताह एक आपातकालीन थैला तैयार करें।'),
    community: T('SSF can map safe spots and make a volunteer call-list.', 'SSF सुरक्षित स्थान और स्वयंसेवक कॉल-सूची बना सकता है।'),
  },
  {
    title: T('Follow the rules at every crossing', 'हर चौराहे पर नियम मानें'),
    issue: T('Overspeeding and signal-jumping cause most road deaths.', 'तेज़ रफ़्तार और सिग्नल तोड़ना अधिकतर सड़क मौतों का कारण है।'),
    why: T('A few seconds saved is never worth a life.', 'बचाए कुछ सेकंड किसी जान के बराबर नहीं होते।'),
    do: T('Stop fully at red lights and give way to pedestrians.', 'लाल बत्ती पर पूरा रुकें और पैदल चलने वालों को रास्ता दें।'),
    step: T('Use dipped headlights at night in the city.', 'शहर में रात को लो बीम हेडलाइट रखें।'),
    avoid: T('Do not use a phone while driving.', 'गाड़ी चलाते समय फ़ोन न चलाएँ।'),
    help: T('Traffic helpline and the local police respond to violations.', 'यातायात हेल्पलाइन और स्थानीय पुलिस उल्लंघन पर कार्रवाई करते हैं।'),
    action: T('Follow one traffic rule strictly today.', 'आज एक यातायात नियम कड़ाई से मानें।'),
    community: T('SSF can hold a school road-safety drill.', 'SSF विद्यालय में सड़क-सुरक्षा अभ्यास करा सकता है।'),
  },
];

// ---- 14. social equality & harmony ------------------------------------------
LIBRARY.equality = [
  {
    title: T('Respect every caste, faith and language', 'हर जाति, धर्म और भाषा का सम्मान'),
    issue: T('Prejudice divides neighbours who share the same street.', 'पूर्वाग्रह उन पड़ोसियों को बाँटता है जो एक ही गली में रहते हैं।'),
    why: T('Mutual respect keeps a community peaceful and strong.', 'आपसी सम्मान समुदाय को शांत और मज़बूत रखता है।'),
    do: T('Greet and include someone from a different background.', 'अलग पृष्ठभूमि के किसी व्यक्ति का अभिवादन करें और शामिल करें।'),
    step: T('Invite them to a community meal or event.', 'उन्हें सामुदायिक भोजन या आयोजन में आमंत्रित करें।'),
    avoid: T('Never use casteist slurs or jokes.', 'जातिसूचक अपमान या मज़ाक कभी न करें।'),
    help: T('Interfaith and peace groups, and local elders, can mediate.', 'अंतरधार्मिक और शांति समूह तथा स्थानीय बुज़ुर्ग मध्यस्थता कर सकते हैं।'),
    action: T('Include one new person in a conversation today.', 'आज किसी नए व्यक्ति को बातचीत में शामिल करें।'),
    community: T('SSF can host a harmony gathering for all faiths.', 'SSF सभी धर्मों के लिए सद्भाव बैठक कर सकता है।'),
  },
  {
    title: T('Lift each other, not pull each other down', 'एक-दूसरे को ऊपर उठाएँ, नीचे न गिराएँ'),
    issue: T('Jealousy and gossip break cooperation in a village or colony.', 'ईर्ष्या और गपशप गाँव या कॉलोनी में सहयोग तोड़ती हैं।'),
    why: T('Communities progress fastest when they cooperate.', 'समुदाय तब सबसे तेज़ बढ़ते हैं जब वे सहयोग करते हैं।'),
    do: T('Share credit and help a neighbour’s small work.', 'श्रेय बाँटें और पड़ोसी के छोटे काम में मदद करें।'),
    step: T('Offer help without expecting anything back.', 'बिना किसी अपेक्षा के मदद दें।'),
    avoid: T('Do not spread unverified gossip.', 'असत्यापित गपशप न फैलाएँ।'),
    help: T('Community leaders and elders can calm disputes.', 'समुदाय के नेता और बुज़ुर्ग विवाद शांत कर सकते हैं।'),
    action: T('Help one neighbour today.', 'आज एक पड़ोसी की मदद करें।'),
    community: T('SSF can start a shared community fund for small needs.', 'SSF छोटी ज़रूरतों के लिए साझा समुदाय कोष शुरू कर सकता है।'),
  },
  {
    title: T('Dignity of every kind of work', 'हर काम की गरिमा'),
    issue: T('Some workers are looked down upon though society depends on them.', 'कुछ श्रमिकों को नीचा देखा जाता है, जबकि समाज उन पर निर्भर है।'),
    why: T('Every honest job keeps a city clean, fed and moving.', 'हर ईमानदार काम शहर को साफ़, पेट भरा और गतिशील रखता है।'),
    do: T('Speak to a sanitation or delivery worker with respect.', 'सफ़ाई या डिलीवरी कर्मी से सम्मान से बात करें।'),
    step: T('Offer water or a chair to an outdoor worker.', 'बाहर काम करने वाले को पानी या कुर्सी दें।'),
    avoid: T('Do not avoid touching or serving someone on leave.', 'कार्यकर्ता से छूने या परोसने से न बचें।'),
    help: T('Labour and municipal offices handle worker welfare.', 'श्रम और नगरपालिका कार्यालय श्रमिक कल्याण देखते हैं।'),
    action: T('Thank one worker by name today.', 'आज एक श्रमिक को नाम लेकर धन्यवाद दें।'),
    community: T('SSF can run a workers’ health and rest corner.', 'SSF श्रमिकों के लिए स्वास्थ्य और विश्राम कोना चला सकता है।'),
  },
];


// ---- 15. science & critical thinking ----------------------------------------
LIBRARY.science = [
  {
    title: T('Stop before you share — check the source', 'शेयर करने से पहले रुकें — स्रोत जाँचें'),
    issue: T('Unverified messages spread faster than the truth online.', 'असत्यापित संदेश ऑनलाइन सच से तेज़ फैलते हैं।'),
    why: T('Forwarding a rumour can cause panic and real harm.', 'अफ़वाह आगे बढ़ाने से दहशत और असली नुकसान हो सकता है।'),
    do: T('Check the same news on a trusted outlet before forwarding.', 'आगे भेजने से पहले वही ख़बर भरोसेमंद माध्यम पर देखें।'),
    step: T('Reverse-search a suspicious photo or video.', 'संदिग्ध फ़ोटो या वीडियो की उलटी खोज करें।'),
    avoid: T('Do not share a forward just because it feels urgent.', 'केवल ज़रूरी लगने पर कोई फ़ॉरवर्ड न भेजें।'),
    help: T('Fact-checking sites and official handles clarify claims.', 'तथ्य-जाँच साइटें और आधिकारिक हैंडल दावे साफ़ करते हैं।'),
    action: T('Verify one message before forwarding it today.', 'आज कोई एक संदेश भेजने से पहले जाँचें।'),
    community: T('SSF can run a media-literacy session for elders.', 'SSF बुज़ुर्गों के लिए मीडिया-साक्षरता सत्र चला सकता है।'),
  },
  {
    title: T('Teach children to ask “why”', 'बच्चों को “क्यों” पूछना सिखाएँ'),
    issue: T('Rote learning stops children from questioning and understanding.', 'रटने की पढ़ाई बच्चों को सवाल पूछने और समझने से रोकती है।'),
    why: T('Curiosity builds problem-solvers and innovators.', 'जिज्ञासा समस्या-समाधक और नवप्रवर्तक बनाती है।'),
    do: T('Answer a child’s “why” with an experiment, not just words.', 'बच्चे के “क्यों” का जवाब सिर्फ़ शब्दों से नहीं, प्रयोग से दें।'),
    step: T('Try a simple home experiment with water or a magnet.', 'पानी या चुंबक से घर पर सरल प्रयोग करें।'),
    avoid: T('Do not say “because I said so”.', '“जैसा मैंने कहा वैसा ही” न कहें।'),
    help: T('School science teachers and libraries can guide.', 'विद्यालय के विज्ञान शिक्षक और पुस्तकालय मार्गदर्शन कर सकते हैं।'),
    action: T('Do one small experiment with a child today.', 'आज एक बच्चे के साथ छोटा प्रयोग करें।'),
    community: T('SSF can organise a science fun-day for children.', 'SSF बच्चों के लिए विज्ञान मनोरंजन दिवस रख सकता है।'),
  },
  {
    title: T('Protect your data, protect your privacy', 'अपना डेटा बचाएँ, गोपनीयता की रक्षा करें'),
    issue: T('Apps collect personal data people never realise they gave.', 'ऐप वह व्यक्तिगत डेटा लेते हैं जिसकी अनुमति लोगों को पता ही नहीं होती।'),
    why: T('Leaked data can lead to fraud and harassment.', 'लीक हुआ डेटा धोखे और उत्पीड़न का कारण बन सकता है।'),
    do: T('Remove app permissions you do not use.', 'जिन अनुमतियों की ज़रूरत नहीं, उन्हें हटाएँ।'),
    step: T('Check the app’s privacy settings once a month.', 'महीने में एक बार ऐप की गोपनीयता सेटिंग देखें।'),
    avoid: T('Do not post your live location publicly.', 'अपनी लाइव लोकेशन सार्वजनिक न करें।'),
    help: T('Cyber helpline 1930 addresses fraud and misuse.', 'साइबर हेल्पलाइन 1930 धोखे और दुरुपयोग पर कार्रवाई करती है।'),
    action: T('Remove one unused app today.', 'आज एक अनुपयोगी ऐप हटाएँ।'),
    community: T('SSF can share a short digital-privacy checklist.', 'SSF छोटी डिजिटल-गोपनीयता सूची बाँट सकता है।'),
  },
];

// ---- 16. volunteerism & citizenship -----------------------------------------
LIBRARY.volunteer = [
  {
    title: T('An hour a week can change someone’s life', 'सप्ताह में एक घंटा किसी की ज़िंदगी बदल सकता है'),
    issue: T('Many problems persist simply for want of a helping hand.', 'कई समस्याएँ केवल मदद करने वाले हाथ के अभाव में बनी रहती हैं।'),
    why: T('Regular small service adds up to big community change.', 'नियमित छोटी सेवा बड़ा सामुदायिक बदलाव लाती है।'),
    do: T('Pick one weekly slot and one task you can keep.', 'एक साप्ताहिक समय और एक टिकाऊ काम चुनें।'),
    step: T('Tell one friend so you stay accountable.', 'एक मित्र को बताएँ ताकि आप ज़िम्मेदार बने रहें।'),
    avoid: T('Do not overpromise and quit quickly.', 'ज़्यादा वादा करके जल्दी छोड़ें नहीं।'),
    help: T('Local NGOs and resident groups welcome steady volunteers.', 'स्थानीय संस्थाएँ और निवासी समूह नियमित स्वयंसेवकों का स्वागत करते हैं।'),
    action: T('Commit to one weekly hour today.', 'आज सप्ताह के एक घंटे का संकल्प लें।'),
    community: T('SSF can match you with a nearby need.', 'SSF आपको पास की ज़रूरत से जोड़ सकता है।'),
  },
  {
    title: T('Donate transparently, ask where the money goes', 'पारदर्शी दान करें, पूछें पैसा कहाँ गया'),
    issue: T('Donors hesitate because they cannot see the impact.', 'दाता झिझकते हैं क्योंकि उन्हें असर दिखाई नहीं देता।'),
    why: T('Transparency builds trust and brings more support to genuine causes.', 'पारदर्शिता भरोसा बनाती है और असली काम को अधिक सहयोग दिलाती है।'),
    do: T('Ask an organisation for a receipt and a short update.', 'किसी संस्था से रसीद और छोटी अपडेट माँगें।'),
    step: T('Give to a cause whose work you have seen.', 'उस काम को दें जिसे आपने खुद देखा हो।'),
    avoid: T('Do not donate to unverified individual collections.', 'असत्यापित व्यक्तिगत संग्रह में दान न करें।'),
    help: T('Registered societies provide receipts and reports on request.', 'पंजीकृत संस्थाएँ माँगने पर रसीद और रिपोर्ट देती हैं।'),
    action: T('Ask one organisation for an impact update today.', 'आज एक संस्था से असर की जानकारी माँगें।'),
    community: T('SSF shares its receipts and programme updates openly.', 'SSF अपनी रसीदें और कार्यक्रम अपडेट खुलकर साझा करता है।'),
  },
  {
    title: T('Vote, volunteer and stay informed', 'मत दें, स्वयंसेवा करें और जागरूक रहें'),
    issue: T('Civic participation falls when people assume one person cannot matter.', 'जब लोग मानते हैं कि एक व्यक्ति से कुछ नहीं होगा, नागरिक भागीदारी घटती है।'),
    why: T('Informed participation improves the services everyone uses.', 'जागरूक भागीदारी उन सेवाओं को सुधारती है जो सब उपयोग करते हैं।'),
    do: T('Follow one local body’s official updates.', 'एक स्थानीय निकाय की आधिकारिक अपडेट देखें।'),
    step: T('Attend one ward or gram-sabha meeting.', 'एक वार्ड या ग्राम-सभा बैठक में जाएँ।'),
    avoid: T('Do not rely only on forwarded rumour.', 'केवल फ़ॉरवर्ड अफ़वाह पर निर्भर न रहें।'),
    help: T('Ward offices publish meeting notices and schemes.', 'वार्ड कार्यालय बैठक सूचना और योजनाएँ प्रकाशित करते हैं।'),
    action: T('Note the date of the next local meeting today.', 'आज अगली स्थानीय बैठक की तारीख़ नोट करें।'),
    community: T('SSF can help residents raise one common issue.', 'SSF निवासियों को एक साझा समस्या उठाने में मदद कर सकता है।'),
  },
];

// ---- 17. employment rights & life skills ------------------------------------
LIBRARY.employment = [
  {
    title: T('Know your wages and working hours', 'अपनी मज़दूरी और काम के घंटे जानें'),
    issue: T('Workers often accept less pay or extra hours without knowing the rules.', 'श्रमिक नियम न जानने के कारण कम मज़दूरी या अधिक घंटे मान लेते हैं।'),
    why: T('Knowing the minimum wage protects your family’s income.', 'न्यूनतम मज़दूरी जानने से परिवार की आय सुरक्षित रहती है।'),
    do: T('Ask the exact daily rate and hours in writing.', 'सटीक दैनिक दर और घंटे लिखित में पूछें।'),
    step: T('Keep a simple diary of days worked and wages paid.', 'काम के दिन और मिली मज़दूरी की साधारण डायरी रखें।'),
    avoid: T('Do not work without recording your payment.', 'भुगतान दर्ज किए बिना काम न करें।'),
    help: T('The labour office handles wage complaints.', 'श्रम कार्यालय मज़दूरी की शिकायतें देखता है।'),
    action: T('Write today’s wage in a diary.', 'आज की मज़दूरी डायरी में लिखें।'),
    community: T('SSF can explain wage rights at a workers’ meeting.', 'SSF श्रमिक बैठक में मज़दूरी अधिकार समझा सकता है।'),
  },
  {
    title: T('Safety gear is not optional', 'सुरक्षा उपकरण वैकल्पिक नहीं'),
    issue: T('Workers skip helmets, gloves or masks to save time.', 'श्रमिक समय बचाने के लिए हेलमेट, दस्ताने या मास्क छोड़ देते हैं।'),
    why: T('One accident can end a family’s only income.', 'एक दुर्घटना परिवार की एकमात्र आय समाप्त कर सकती है।'),
    do: T('Wear the safety gear your work needs, every time.', 'हर बार काम के अनुसार सुरक्षा उपकरण पहनें।'),
    step: T('Check the gear for damage before starting.', 'शुरू करने से पहले उपकरण की जाँच करें।'),
    avoid: T('Do not remove a guard to work faster.', 'तेज़ काम के लिए सुरक्षा कवच न हटाएँ।'),
    help: T('The workplace safety officer can enforce safe conditions.', 'कार्यस्थल सुरक्षा अधिकारी सुरक्षित हालात सुनिश्चित कर सकता है।'),
    action: T('Inspect your safety gear today.', 'आज अपने सुरक्षा उपकरण की जाँच करें।'),
    community: T('SSF can distribute basic safety gear to workers.', 'SSF श्रमिकों को बुनियादी सुरक्षा उपकरण बाँट सकता है।'),
  },
  {
    title: T('Learn one life skill this month', 'इस महीने एक जीवन कौशल सीखें'),
    issue: T('Basic skills like first aid or budgeting are rarely taught.', 'प्राथमिक चिकित्सा या बजट जैसे बुनियादी कौशल कम सिखाए जाते हैं।'),
    why: T('A practical skill helps in jobs and in daily life.', 'व्यावहारिक कौशल नौकरी और रोज़मर्रा दोनों में काम आता है।'),
    do: T('Choose one skill — first aid, cooking, a trade.', 'एक कौशल चुनें — प्राथमिक चिकित्सा, खाना बनाना, कोई हुनर।'),
    step: T('Practise it for ten minutes daily.', 'रोज़ दस मिनट इसका अभ्यास करें।'),
    avoid: T('Do not pay for overpriced “instant” courses.', 'अत्यधिक महँगे “तुरंत” कोर्स के लिए पैसे न दें।'),
    help: T('Government skill centres offer low-cost training.', 'सरकारी कौशल केंद्र कम खर्च में प्रशिक्षण देते हैं।'),
    action: T('Start learning one skill today.', 'आज एक कौशल सीखना शुरू करें।'),
    community: T('SSF can run a short life-skills workshop.', 'SSF छोटी जीवन-कौशल कार्यशाला चला सकता है।'),
  },
];

// ---- 18. water, sanitation & energy -----------------------------------------
LIBRARY.water = [
  {
    title: T('Save water before the tap runs dry', 'नल सूखने से पहले पानी बचाएँ'),
    issue: T('Wastage and leaking pipes drain a scarce resource.', 'बर्बादी और रिसते पाइप कम पानी को ख़त्म करते हैं।'),
    why: T('Clean water is limited and must last for everyone.', 'स्वच्छ जल सीमित है और सबके लिए बचाना ज़रूरी है।'),
    do: T('Fix every leaking tap and use a bucket, not a shower.', 'हर टपकता नल ठीक करें और शॉवर की जगह बाल्टी लें।'),
    step: T('Reuse rinse water for plants or cleaning.', 'धोने का पानी पौधों या सफ़ाई में दोबारा लें।'),
    avoid: T('Do not leave a tap running while working.', 'काम करते समय नल चालू न छोड़ें।'),
    help: T('The water works department fixes public leaks on report.', 'जल विभाग शिकायत पर सार्वजनिक रिसाव ठीक करता है।'),
    action: T('Report one leaking tap today.', 'आज एक टपकते नल की सूचना दें।'),
    community: T('SSF can map and report water leaks in its area.', 'SSF अपने क्षेत्र में पानी के रिसाव की सूची बना सकता है।'),
  },
  {
    title: T('Clean toilets protect health', 'स्वच्छ शौचालय स्वास्थ्य की रक्षा करते हैं'),
    issue: T('Unsafe sanitation spreads disease, especially among children.', 'असुरक्षित स्वच्छता रोग फैलाती है, विशेषकर बच्चों में।'),
    why: T('A clean toilet protects dignity and prevents infection.', 'स्वच्छ शौचालय गरिमा बचाता है और संक्रमण रोकता है।'),
    do: T('Clean and disinfect the toilet regularly.', 'शौचालय की नियमित सफ़ाई और कीटाणुनाशन करें।'),
    step: T('Keep water and soap near the toilet.', 'शौचालय के पास पानी और साबुन रखें।'),
    avoid: T('Do not defecate in the open.', 'खुले में शौच न करें।'),
    help: T('The swachhata mission can help build or repair toilets.', 'स्वच्छता मिशन शौचालय बनाने या ठीक करने में मदद कर सकता है।'),
    action: T('Clean one toilet at home today.', 'आज घर का एक शौचालय साफ़ करें।'),
    community: T('SSF can promote toilet upkeep in its locality.', 'SSF अपने इलाके में शौचालय रखरखाव को बढ़ावा दे सकता है।'),
  },
  {
    title: T('Use energy wisely', 'ऊर्जा का समझदारी से उपयोग करें'),
    issue: T('Wasteful use raises bills and stresses supply.', 'फ़िज़ूल उपयोग बिल बढ़ाता और आपूर्ति पर दबाव डालता है।'),
    why: T('Saving energy saves money and lowers pollution.', 'ऊर्जा बचाना पैसा बचाता है और प्रदूषण घटाता है।'),
    do: T('Switch off lights and fans when you leave a room.', 'कमरे से निकलते समय लाइट-पंखे बंद करें।'),
    step: T('Replace one bulb with an LED.', 'एक बल्ब को एलईडी से बदलें।'),
    avoid: T('Do not leave chargers and devices on standby.', 'चार्जर और उपकरण स्टैंडबाय पर न छोड़ें।'),
    help: T('The electricity office lists efficient-appliance support.', 'बिजली कार्यालय किफ़ायती उपकरण सहयोग बताता है।'),
    action: T('Switch off one unused appliance today.', 'आज एक अनुपयोगी उपकरण बंद करें।'),
    community: T('SSF can run an energy-saving pledge drive.', 'SSF ऊर्जा-बचत संकल्प अभियान चला सकता है।'),
  },
];

// ---- 19. local problems & solutions -----------------------------------------
LIBRARY.local = [
  {
    title: T('One pothole fixed prevents many accidents', 'एक गड्ढा भरने से कई दुर्घटनाएँ रुकती हैं'),
    issue: T('Broken roads and drains are reported but often not followed up.', 'टूटी सड़कें और नाले बताए जाते हैं पर पीछा नहीं होता।'),
    why: T('Small civic fixes prevent daily hardship and injury.', 'छोटे नागरिक सुधार रोज़ की परेशानी और चोट रोकते हैं।'),
    do: T('Photograph the problem and submit it to the ward office.', 'समस्या की फ़ोटो लेकर वार्ड कार्यालय में दें।'),
    step: T('Ask for a complaint number and follow up.', 'शिकायत संख्या माँगें और पीछा करें।'),
    avoid: T('Do not repair public property unsafely yourself.', 'सार्वजनिक संपत्ति की असुरक्षित मरम्मत खुद न करें।'),
    help: T('The municipal grievance portal or ward office is the right place.', 'नगरपालिका शिकायत पोर्टल या वार्ड कार्यालय सही जगह है।'),
    action: T('Report one local civic problem today.', 'आज एक स्थानीय नागरिक समस्या की सूचना दें।'),
    community: T('SSF can help residents file joint complaints.', 'SSF निवासियों को सामूहिक शिकायत भरने में मदद कर सकता है।'),
  },
  {
    title: T('A clean street starts with each home', 'साफ़ गली हर घर से शुरू होती है'),
    issue: T('Garbage thrown on streets blocks drains and breeds disease.', 'गली में फेंका कचरा नाले रोकता और रोग फैलाता है।'),
    why: T('A clean lane keeps children and elders healthy.', 'साफ़ गली बच्चों और बुज़ुर्गों को स्वस्थ रखती है।'),
    do: T('Use the bin, and place it where all can reach.', 'कूड़ेदान का उपयोग करें और सबकी पहुँच में रखें।'),
    step: T('Organise one neighbourhood cleaning hour.', 'मोहल्ले में एक घंटे की सफ़ाई रखें।'),
    avoid: T('Do not dump waste into drains.', 'नालों में कचरा न डालें।'),
    help: T('The municipal sanitation staff can clear blocked drains.', 'नगरपालिका सफ़ाई कर्मी रुके नाले साफ़ करते हैं।'),
    action: T('Pick up litter outside your home today.', 'आज घर के बाहर कचरा उठाएँ।'),
    community: T('SSF can organise a monthly cleanup drive.', 'SSF मासिक सफ़ाई अभियान चला सकता है।'),
  },
  {
    title: T('Solve one problem, not argue about all', 'सब पर बहस नहीं, एक समस्या हल करें'),
    issue: T('Communities argue over many issues without fixing any.', 'समुदाय कई मुद्दों पर बहस करते हैं पर कोई हल नहीं करते।'),
    why: T('Solving one issue builds confidence and momentum.', 'एक मुद्दा हल करने से भरोसा और गति बनती है।'),
    do: T('List problems and pick the smallest, most urgent one.', 'समस्याएँ लिखें और सबसे छोटी, सबसे ज़रूरी चुनें।'),
    step: T('Assign one person and one deadline.', 'एक व्यक्ति और एक समयसीमा तय करें।'),
    avoid: T('Do not blame people without facts.', 'बिना तथ्य किसी को दोष न दें।'),
    help: T('Local leaders and officials can unblock a stuck issue.', 'स्थानीय नेता और अधिकारी अटका मुद्दा खोल सकते हैं।'),
    action: T('Choose one problem to solve this week.', 'इस सप्ताह हल करने के लिए एक समस्या चुनें।'),
    community: T('SSF can convene a small action group.', 'SSF छोटा कार्य-समूह बुला सकता है।'),
  },
];

// ---- 20. global cooperation & humanitarian awareness ------------------------
LIBRARY.global = [
  {
    title: T('Local kindness has a global echo', 'स्थानीय दया का वैश्विक असर होता है'),
    issue: T('People feel world problems are too big to affect.', 'लोग सोचते हैं विश्व की समस्याएँ इतनी बड़ी हैं कि वे कुछ नहीं कर सकते।'),
    why: T('Millions of small local acts together shape global progress.', 'लाखों छोटे स्थानीय काम मिलकर विश्व प्रगति बनाते हैं।'),
    do: T('Support one humanitarian cause close to you.', 'अपने पास के एक मानवीय काम में सहयोग करें।'),
    step: T('Give time, goods or a small regular amount.', 'समय, सामान या छोटी नियमित राशि दें।'),
    avoid: T('Do not believe every viral appeal without checking.', 'हर वायरल अपील बिना जाँच विश्वास न करें।'),
    help: T('Recognised agencies publish verified appeals and reports.', 'मान्यता प्राप्त एजेंसियाँ सत्यापित अपील और रिपोर्ट देती हैं।'),
    action: T('Support one verified cause today.', 'आज एक सत्यापित काम में सहयोग करें।'),
    community: T('SSF can link local effort to a verified cause.', 'SSF स्थानीय प्रयास को सत्यापित काम से जोड़ सकता है।'),
  },
  {
    title: T('Peace begins with a neighbour', 'शांति पड़ोसी से शुरू होती है'),
    issue: T('Conflict often starts with small misunderstandings.', 'टकराव अक्सर छोटी ग़लतफ़हमियों से शुरू होता है।'),
    why: T('Resolving one dispute quietly prevents a wider rift.', 'एक विवाद चुपचाप सुलझाने से बड़ी दरार रुकती है।'),
    do: T('Listen to both sides before forming an opinion.', 'राय बनाने से पहले दोनों पक्ष सुनें।'),
    step: T('Suggest a calm, private conversation.', 'शांत, निजी बातचीत का सुझाव दें।'),
    avoid: T('Do not take sides publicly without facts.', 'बिना तथ्य सार्वजनिक रूप से पक्ष न लें।'),
    help: T('Peace committees and elders can mediate.', 'शांति समितियाँ और बुज़ुर्ग मध्यस्थता कर सकते हैं।'),
    action: T('Mediate one small misunderstanding today.', 'आज एक छोटी ग़लतफ़हमी में मध्यस्थता करें।'),
    community: T('SSF can host a neighbourhood harmony meet.', 'SSF पड़ोस सद्भाव बैठक कर सकता है।'),
  },
  {
    title: T('Fight inequality wherever you stand', 'जहाँ खड़े हों, असमानता से लड़ें'),
    issue: T('Inequality leaves some without food, school or safety.', 'असमानता कुछ को भोजन, स्कूल या सुरक्षा से वंचित रखती है।'),
    why: T('Fair access makes a society safer for everyone.', 'न्यायपूर्ण पहुँच समाज को सबके लिए सुरक्षित बनाती है।'),
    do: T('Share a resource you have with someone who lacks it.', 'जो आपके पास है, उसका कुछ ज़रूरतमंद के साथ बाँटें।'),
    step: T('Start with books, food or time.', 'किताब, भोजन या समय से शुरू करें।'),
    avoid: T('Do not treat anyone as lesser.', 'किसी को छोटा न समझें।'),
    help: T('Welfare offices and NGOs support the most excluded.', 'कल्याण कार्यालय और संस्थाएँ सबसे वंचित की मदद करती हैं।'),
    action: T('Share something useful today.', 'आज कुछ उपयोगी बाँटें।'),
    community: T('SSF can run an inclusive support circle.', 'SSF समावेशी सहयोग मंडल चला सकता है।'),
  },
];

// Deterministic coverage order: important topics recur fairly across the year.
const TOPIC_ORDER = [
  'education', 'health', 'environment', 'women', 'youth', 'digital', 'child',
  'farmer', 'finance', 'schemes', 'legal', 'disability', 'roadsafety', 'equality',
  'science', 'volunteer', 'employment', 'water', 'local', 'global',
];

module.exports = { LIBRARY, TOPIC_ORDER, TOPIC_LABELS, VERIFIED: V };

