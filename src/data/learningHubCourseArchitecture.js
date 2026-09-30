// SSF Learning Hub course architecture
// Curated, bilingual course definitions for structured learning and assessment.

const makeLesson = (en, hi, easy, deep, examples, practice, activity, mistakes, summary) => ({
  title:{en,hi},
  content:{
    easyExplanation:easy,
    deepUnderstanding:deep,
    examples,
    commonMistakes:mistakes,
    summary
  },
  practice,
  activity,
  objectives:[easy, "समझ को वास्तविक जीवन में सुरक्षित और जिम्मेदारी से लागू करना सीखें।"]
});


const makeQuestions = (pairs) => pairs.map(([q,options,answer=0]) => ({q,options,answer}));
\nconst makeModule = (id, en, hi, description, lessons) => ({
  id,
  title:{en,hi},
  description,
  lessons
});

const mobileLessons = [
  makeLesson("What Is a Mobile Phone?","मोबाइल फोन क्या है?","मोबाइल फोन एक portable computing और communication device है जो cellular network, Wi-Fi, Bluetooth और apps के माध्यम से काम कर सकता है।","आज का smartphone केवल फोन नहीं है; यह camera, map, payment interface, library, television, office और social connection का मिश्रण है।","Call, message, camera, maps, learning app, banking app.","अपने फोन में Communication, Camera, Maps और Settings जैसे चार काम पहचानें।","लिखें कि आप एक दिन में फोन से कौन-कौन से 10 काम करते हैं।","फोन को केवल entertainment device समझना और security settings को नजरअंदाज करना।","फोन की असली शक्ति उसके hardware, software, connectivity और user choices के संयोजन में है।"),
  makeLesson("How Mobile Networks Work","मोबाइल नेटवर्क कैसे काम करता है?","फोन radio signals के माध्यम से nearby cellular network से जुड़ता है और network आपकी voice/data को आगे route करता है।","SIM/eSIM पहचान, radio access, cell towers, core network और internet services मिलकर mobile communication बनाते हैं।","4G/5G data, VoLTE calls, roaming.","अपने phone में network type और preferred network setting देखें।","घर और बाहर signal strength बदलने के कारण observe करें।","Network bars को हमेशा internet speed का exact measure मानना।","Connectivity एक पूरी system chain है; केवल signal bars पूरी कहानी नहीं बताते।"),
  makeLesson("SIM, eSIM, IMEI & Mobile Identity","SIM, eSIM, IMEI और मोबाइल पहचान","SIM/eSIM network subscriber identity से जुड़ी होती है जबकि IMEI device की पहचान से जुड़ा identifier है।","इन identifiers को समझना account recovery, lost-phone reporting और device management में उपयोगी है।","Physical SIM, eSIM, dual-SIM, IMEI information screen.","अपने phone के official settings में device information देखें और sensitive identifiers सार्वजनिक न करें।","एक सुरक्षित जगह पर जरूरी recovery information रखने की checklist बनाएं।","IMEI, OTP या SIM details को strangers के साथ share करना।","Device identity और subscriber/account identity अलग concepts हैं और दोनों की सुरक्षा जरूरी है।"),
  makeLesson("Smartphone Hardware","स्मार्टफोन हार्डवेयर","Display, battery, processor, memory, storage, camera, microphones, speakers, sensors और connectivity hardware मिलकर फोन बनाते हैं।","Specifications तभी meaningful हैं जब उन्हें वास्तविक use-case से जोड़ा जाए। अधिक megapixels या RAM अकेले बेहतर user experience की guarantee नहीं हैं।","Battery capacity, storage, refresh rate, camera sensors.","अपने फोन की specification sheet पढ़ें और हर specification का practical purpose लिखें।","एक पुराने और नए फोन की जरूरत-आधारित तुलना करें।","केवल numbers देखकर phone खरीदना।","Hardware को जरूरत, reliability, repairability और total cost के संदर्भ में समझें।"),
  makeLesson("Operating System & Apps","ऑपरेटिंग सिस्टम और ऐप्स","Operating system phone के hardware और apps के बीच मुख्य software layer है।","Android/iOS जैसे systems permissions, updates, storage, notifications, accounts और app execution manage करते हैं।","Settings, app store, permissions, notifications.","एक unused app की permissions review करें।","App को install करने से पहले developer, reviews, permissions और purpose की checklist बनाएं।","Unknown sources से random APK/install files लेना।","App safety का पहला नियम है: source, permissions और purpose समझकर install करें।"),
  makeLesson("Touch, Gestures & Accessibility","टच, gestures और accessibility","Tap, swipe, long press, drag, pinch और keyboard input smartphone interaction के basic तरीके हैं।","Accessibility features जैसे text size, screen reader, captions, magnification और assistive options अलग-अलग users को phone usable बनाते हैं।","Zoom, voice input, screen reader, captions.","अपने phone की accessibility settings explore करें।","एक परिवार सदस्य के लिए आसान accessibility setup बनाएं।","Accessibility को केवल disability feature समझना; यह कई लोगों के लिए usability सुधारता है।","अच्छा mobile use inclusive और user-controlled होना चाहिए।"),
  makeLesson("Battery, Charging & Heat","बैटरी, चार्जिंग और गर्म होना","Battery एक consumable component है और charging habits, temperature तथा workload उसके व्यवहार को प्रभावित कर सकते हैं।","Heat, damaged chargers, poor cables और heavy workloads safety तथा battery health को प्रभावित कर सकते हैं।","Gaming while charging, sunlight, fast charging.","फोन को charging के दौरान असामान्य heat होने पर usage रोककर कारण देखें।","अपने charging routine और battery usage screen का weekly review करें।","Damaged cable/charger का उपयोग या extreme heat को ignore करना।","Battery health के लिए सुरक्षित charging, ventilation और reliable accessories महत्वपूर्ण हैं।"),
  makeLesson("Storage, Files & Backups","स्टोरेज, फाइलें और बैकअप","Photos, videos, documents, downloads और app data storage लेते हैं; backup अलग copy बनाता है।","Storage और backup अलग समस्याएँ हैं: file phone में होना backup नहीं कहलाता।","Cloud backup, computer copy, memory management.","Large videos और duplicate files review करें।","एक simple 3-step backup plan बनाएं: important data identify, backup location choose, restore test।","Backup है मान लेना लेकिन restore कभी test न करना।","महत्वपूर्ण data की कम-से-कम एक सुरक्षित अतिरिक्त copy रखें और restore प्रक्रिया समझें।")
];

const mobileLessons2 = [
  makeLesson("Calls, Contacts & Emergency Calling","कॉल, contacts और emergency calling","Phone calling features में contacts, call history, blocking और emergency options शामिल होते हैं।","Emergency communication में सही contact, local emergency number और accurate location information महत्वपूर्ण हो सकते हैं।","Family contacts, blocked numbers, emergency contacts.","अपने emergency/contact settings की समीक्षा करें।","परिवार के साथ एक emergency communication plan लिखें।","Unknown caller को personal information देना।","फोन का communication layer safety planning का हिस्सा भी हो सकता है।"),
  makeLesson("SMS, RCS & Messaging Apps","SMS, RCS और messaging apps","SMS, richer messaging systems और internet-based apps अलग technologies और privacy models का उपयोग करते हैं।","Message content, metadata, backups, encryption, contact discovery और account security को अलग-अलग समझना चाहिए।","SMS, WhatsApp-like messaging, group chats.","किसी messaging app की privacy/security settings review करें।","एक family group के लिए safe-sharing rules बनाएं।","OTP, password या sensitive documents को careless group में भेजना।","Convenient messaging को secure messaging समझ लेना सही नहीं है।"),
  makeLesson("Camera, Photos & Digital Memory","कैमरा, photos और digital memory","Phone camera photo/video capture, editing और sharing को आसान बनाता है।","Photos में location metadata, faces, documents और background details जैसी sensitive information हो सकती है।","School ID photo, home location, family image, document scan.","एक photo share करने से पहले background और metadata-related settings review करें।","Photo-sharing privacy checklist बनाएं।","हर photo को public social media पर डालना।","Photo केवल image नहीं; उसमें पहचान और context की जानकारी भी हो सकती है।"),
  makeLesson("Internet, Browser & Search","इंटरनेट, browser और search","Browser websites तक पहुंच देता है और search engines information खोजने में मदद करते हैं।","Search result और trustworthy evidence अलग चीजें हैं; source, date, author और corroboration देखना जरूरी है।","Official site, news article, social post, forwarded message.","एक claim के लिए कम-से-कम दो credible sources compare करें।","एक viral message की verification exercise करें।","पहले search result को automatically true मानना।","Digital literacy में information verification केंद्रीय skill है।"),
  makeLesson("Maps, Location & Navigation","Maps, location और navigation","GPS और network-assisted location services route planning और location sharing में मदद करते हैं।","Location access useful भी हो सकता है और privacy-sensitive भी; app permissions को purpose के अनुसार सीमित करें।","Maps, ride apps, location sharing.","अपने apps की location permissions review करें।","Location sharing कब useful है और कब unnecessary, इसकी table बनाएं।","हर app को always-on location access देना।","Location एक valuable personal data type है; इसे purpose-based तरीके से control करें।"),
  makeLesson("Email on Mobile","मोबाइल पर ईमेल","Mobile email से messages, files, calendars और professional communication manage की जा सकती है।","Subject, recipient verification, attachment safety, phishing awareness और account security professional email के आधार हैं।","Job application, school message, NGO communication.","एक sample professional email लिखें और भेजने से पहले checklist लगाएं।","Before-send checklist बनाएं।","गलत recipient को sensitive attachment भेजना।","Mobile convenience के बावजूद professional email में वही accuracy standards लागू होते हैं।"),
  makeLesson("Mobile Documents & Productivity","मोबाइल पर documents और productivity","Phones पर documents read, edit, scan, sign और share किए जा सकते हैं।","Mobile productivity के लिए file naming, version control, permissions और backup जरूरी हैं।","PDF, document scan, spreadsheet, cloud folder.","एक document को सही नाम देकर folder में organize करें।","एक छोटा mobile work package बनाएं: document + photo + PDF + share link।","Sensitive files को public link से share करना।","Mobile office useful है, लेकिन organization और access control जरूरी हैं।"),
  makeLesson("Digital Payments & Banking Safety","डिजिटल भुगतान और बैंकिंग सुरक्षा","Mobile banking और digital payments तेज सुविधा देते हैं लेकिन authentication और fraud awareness जरूरी है।","PIN, OTP, UPI credentials, device lock और transaction verification को अलग सुरक्षा layers की तरह समझें।","QR payment, UPI PIN, bank app, transaction alert.","Payment से पहले recipient और amount verify करने का अभ्यास करें।","एक payment safety checklist लिखें।","OTP/PIN बताना या screen-share करके payment कराना।","Payment convenience के साथ identity और transaction verification अनिवार्य है।")
];

const mobileLessons3 = [
  makeLesson("Passwords, Passkeys & MFA","पासवर्ड, passkeys और MFA","Strong authentication account access को unauthorized users से बचाने में मदद करती है।","Unique passwords, password managers, passkeys और multi-factor authentication अलग security mechanisms हैं।","Password manager, authenticator, device biometric.","दो important accounts में available MFA settings review करें।","अपने accounts की authentication inventory बनाएं।","एक password कई accounts में reuse करना।","Authentication को layered security की तरह सोचें।"),
  makeLesson("Phishing & Social Engineering","फिशिंग और social engineering","Attackers अक्सर technology से ज्यादा human trust और urgency का फायदा उठाते हैं।","Unexpected links, fake support, prize scams, impersonation और urgent requests के संकेत पहचानना जरूरी है।","Fake bank message, fake delivery link, fake job offer.","किसी suspicious message में sender, link, urgency और request identify करें।","तीन scam scenarios का safe response लिखें।","घबराकर तुरंत link खोलना या payment करना।","रुकना, verify करना और official channel से संपर्क करना core defense है।"),
  makeLesson("OTP, PIN & Financial Fraud","OTP, PIN और वित्तीय धोखाधड़ी","OTP/PIN authentication secrets हैं जिन्हें दूसरे व्यक्ति को नहीं देना चाहिए।","Legitimate support भी आम तौर पर आपके secret authentication code की मांग नहीं करनी चाहिए; fraud अक्सर urgency और authority का दिखावा करता है।","Fake KYC call, refund scam, remote-support scam.","एक simulated scam message में red flags mark करें।","परिवार के लिए 'never share' list बनाएं।","Caller ID को proof of identity मानना।","Authentication secret केवल authorized transaction flow में स्वयं enter करें।"),
  makeLesson("App Permissions & Tracking","ऐप permissions और tracking","Apps camera, microphone, contacts, location और files जैसी permissions मांग सकते हैं।","Permission का purpose, timing और necessity समझना privacy management का practical हिस्सा है।","Camera permission for camera app vs flashlight app.","कम-जरूरी permissions disable/review करें।","अपने top 10 apps की permission audit करें।","हर permission को बिना पढ़े allow करना।","Minimum necessary access एक उपयोगी privacy principle है।"),
  makeLesson("Social Media & Digital Footprint","सोशल मीडिया और digital footprint","Posts, comments, photos और interactions लंबे समय तक copy, archive या resurface हो सकते हैं।","Privacy settings मदद करती हैं लेकिन perfect control की guarantee नहीं; audience, context और permanence पर सोचें।","Public post, private group, story, screenshot.","एक पुराने public post की audience और personal information review करें।","Post करने से पहले STOP checklist बनाएं।","Anger या pressure में तुरंत पोस्ट करना।","Share करने से पहले सोचें: audience, purpose, permanence, harm।"),
  makeLesson("Cyberbullying, Abuse & Reporting","साइबरबुलिंग, abuse और reporting","Online harassment या abuse में evidence preserve करना, block/report tools और trusted support उपयोगी हो सकते हैं।","Victim को blame नहीं करना चाहिए; serious threats, exploitation या child-safety concerns में appropriate trusted adults और authorities/support services तक पहुंचना जरूरी है।","Harassing messages, impersonation, unwanted contact.","Evidence सुरक्षित रखने और account security सुधारने की basic checklist बनाएं।","एक safe reporting pathway लिखें।","Abuser से लंबी बहस करना या evidence delete कर देना।","Safety, evidence और trusted support को प्राथमिकता दें।"),
  makeLesson("Children & Smartphone Use","बच्चे और स्मार्टफोन","बच्चों के लिए phone learning और connection का साधन हो सकता है, लेकिन privacy, harmful content, bullying और exploitation के risks भी होते हैं।","UNICEF guidance privacy settings, parental controls, age-appropriate rules, open conversation और digital literacy पर जोर देती है।","Family rules, safe search, app permissions, trusted adult.","एक age-appropriate family digital agreement बनाएं।","बच्चे के साथ एक privacy setting मिलकर review करें।","केवल screen-time number पर ध्यान देकर content और experience ignore करना।","बच्चों की safety technology + education + trusted communication से मजबूत होती है।"),
  makeLesson("Screen Habits, Sleep & Well-being","स्क्रीन आदतें, नींद और wellbeing","Phone use attention, routine और sleep के साथ interact कर सकता है।","Evidence सभी screen use को समान नहीं मानता; activity, content, timing, individual context और online harms मायने रखते हैं।","Late-night scrolling, study use, social connection, gaming.","एक सप्ताह अपनी phone routine observe करें।","एक personal digital wellbeing plan बनाएं जिसमें sleep, study/work और offline time शामिल हों।","हर व्यक्ति के लिए एक ही rigid screen-time rule को universal solution मानना।","Healthy use का लक्ष्य meaningful use और wellbeing का संतुलन है।")
];

const mobileLessons4 = [
  makeLesson("AI on the Phone","फोन में AI","Modern phones और apps में AI photo tools, assistants, search, translation और content generation जैसी सुविधाएं दे सकते हैं।","AI output हमेशा सही नहीं होता; privacy, hallucination, bias, copyright और verification पर ध्यान देना चाहिए।","AI writing assistant, translation, image enhancement.","AI से मिली information को authoritative source से verify करें।","एक AI answer के लिए verification checklist लागू करें।","Private documents या sensitive personal data बिना जरूरत AI service में डालना।","AI helpful tool है, final authority नहीं।"),
  makeLesson("Online Learning from a Phone","फोन से ऑनलाइन सीखना","Phone से courses, videos, ebooks, practice और communities तक पहुंच मिल सकती है।","Effective learning में active recall, practice, reflection, assessment और reliable sources शामिल होने चाहिए।","SSF Learning Hub, educational video, quiz, PDF.","एक 30-minute mobile learning session करें और notes बनाएं।","अपना weekly learning path बनाएं।","केवल videos देखना और practice न करना।","Mobile learning को active learning में बदलना जरूरी है।"),
  makeLesson("Jobs, Work & Business on Mobile","मोबाइल से नौकरी, काम और व्यवसाय","Phone job search, customer communication, records, marketing और remote work में उपयोगी हो सकता है।","Professional mobile work में identity protection, document management, truthful communication और fraud awareness जरूरी हैं।","Job portal, business WhatsApp, invoices, cloud documents.","एक safe professional profile checklist बनाएं।","एक small business के लिए mobile workflow design करें।","Fake job offers या advance-fee scams पर भरोसा करना।","Mobile can expand opportunity, but verification and professionalism remain essential."),
  makeLesson("Mobile Accessibility & Inclusion","मोबाइल accessibility और inclusion","Accessibility features लोगों को vision, hearing, motor, learning या language needs के अनुसार phone उपयोग करने में मदद कर सकती हैं।","Inclusive design में captions, text scaling, voice control, screen readers, contrast और simple interaction उपयोगी हैं।","Voice input, captions, magnification, switch access.","एक accessibility feature enable करके test करें।","किसी community learner के लिए accessible setup checklist बनाएं।","User needs जाने बिना assumptions करना।","Accessibility phone को अधिक लोगों के लिए usable बनाती है।"),
  makeLesson("Lost or Stolen Phone Response","फोन खो जाए या चोरी हो जाए तो क्या करें","Lost device में पहले personal safety, account protection और device recovery steps महत्वपूर्ण हैं।","Remote lock/wipe, account sign-out, SIM blocking और official reporting जैसे options provider/device के अनुसार बदल सकते हैं।","Find-my-device service, SIM block, account password change.","अपने device ecosystem की official lost-device settings locate करें।","एक emergency recovery card बनाएं जिसमें sensitive secrets न हों।","घबराकर unknown person को OTP देना।","पहले accounts और device को सुरक्षित करें, फिर recovery/reporting steps लें।"),
  makeLesson("Updates, Antivirus & Security Hygiene","अपडेट, antivirus और security hygiene","Software updates security fixes और improvements ला सकते हैं।","Security hygiene में updates, app source control, screen lock, backups, permission review और phishing awareness शामिल हैं।","OS update, app update, security patch.","Pending updates review करें।","Monthly security checklist बनाएं।","Updates को हमेशा indefinitely postpone करना।","Security एक one-time setting नहीं बल्कि continuous practice है।"),
  makeLesson("Privacy, Data & Your Digital Rights","गोपनीयता, data और digital rights","Personal data में identity, contact, location, photos, activity और other information शामिल हो सकती है।","Different jurisdictions provide different rights and rules; users should read relevant platform notices and applicable law rather than assume one universal rule.","Privacy policy, account data export, permission controls.","किसी major app की privacy settings review करें।","एक personal data map बनाएं: क्या data, कौन access, क्यों, कब तक।","हर free app को automatically harmless मानना।","Data literacy informed digital choices की आधारशिला है।"),
  makeLesson("Responsible Mobile Citizenship","जिम्मेदार मोबाइल नागरिकता","Digital citizenship का मतलब respectful, lawful, informed और safe participation है।","Forwarding, commenting, recording, sharing और reporting के real-world consequences हो सकते हैं।","Misinformation, privacy violation, respectful debate, community help.","एक doubtful message को forward करने से पहले verification करें।","अपना Digital Citizen Code लिखें।","Private content बिना consent share करना।","Technology का अच्छा उपयोग knowledge, dignity, safety और responsibility से जुड़ा है।")
];

const mobileLessons5 = [
  makeLesson("How the Smartphone Changed Daily Life","स्मार्टफोन ने दैनिक जीवन कैसे बदला","Smartphones ने communication, navigation, entertainment, education, commerce और services को एक device में ला दिया है।","Convenience के साथ dependency, distraction, privacy और inequality के questions भी आए हैं।","Maps replacing paper directions, mobile banking, online classes.","अपने दिन के phone-dependent tasks map करें।","एक task का low-tech alternative identify करें।","Convenience को necessity समझ लेना।","Technology useful है, लेकिन resilience के लिए alternatives भी जानना अच्छा है।"),
  makeLesson("Attention, Notifications & Habit Loops","ध्यान, notifications और habit loops","Notifications और variable rewards attention को बार-बार phone की ओर खींच सकते हैं।","User-controlled notification settings, intentional checking और distraction-free periods attention management में मदद कर सकते हैं।","Social notifications, autoplay, streaks.","Non-essential notifications बंद करके एक दिन observe करें।","Notification audit करें: keep, reduce, mute. ","हर notification को urgent समझना।","Phone को अपने attention का controller नहीं बल्कि tool बनाना बेहतर है।"),
  makeLesson("Family Digital Rules","परिवार के डिजिटल नियम","Family rules को age, safety, school/work needs और mutual trust के अनुसार बनाना चाहिए।","Rules केवल punishment नहीं; explanation, participation, review और modelling से बेहतर काम कर सकते हैं।","No-phone dinner, privacy rule, emergency access.","परिवार के लिए 8–10 practical rules draft करें।","सभी सदस्यों के साथ rules review करें।","एकतरफा अस्पष्ट नियम बनाना।","Clear, age-appropriate और revisable rules अधिक उपयोगी होते हैं।"),
  makeLesson("Children, Privacy & Consent","बच्चे, privacy और consent","बच्चों की photos, names, school details और location sensitive information हो सकती है।","Parents/caregivers को भी child's privacy, dignity और long-term digital footprint पर विचार करना चाहिए।","School event photo, public post, family group.","किस information को private रखना चाहिए उसकी list बनाएं।","Child-friendly privacy conversation का अभ्यास करें।","बच्चे की image/details को बिना सोचे public करना।","बच्चों की digital dignity भी privacy और safety का हिस्सा है।"),
  makeLesson("Digital Balance for Students","विद्यार्थियों के लिए digital balance","Phone study, communication और creativity में मदद कर सकता है लेकिन distraction भी बन सकता है।","Task-based use, focused sessions, notifications control और sleep-friendly routines study quality में मदद कर सकते हैं।","Study mode, timer, notes, educational apps.","एक focused study block करें और distractions record करें।","अपना study-phone protocol बनाएं।","Study के नाम पर लगातार social media switching।","Technology का learning value उसके intentional use से बढ़ता है।"),
  makeLesson("Mobile Use for Older Adults","वरिष्ठ नागरिकों के लिए मोबाइल","Simple interface, larger text, voice features और trusted contacts older adults के लिए useful हो सकते हैं।","Scam awareness, privacy, emergency contacts और patient learning महत्वपूर्ण हैं।","Voice calling, magnification, contact favorites.","किसी older adult के साथ accessibility और scam-safety settings review करें।","Senior-friendly setup checklist बनाएं।","Technical jargon से सीखने को कठिन बनाना।","Inclusive teaching patient, simple और practical होनी चाहिए।"),
  makeLesson("Digital Divide & Responsible Access","डिजिटल divide और जिम्मेदार access","हर व्यक्ति के पास समान device, connectivity, skills या affordability नहीं होती।","Digital inclusion में device access के साथ skills, language, accessibility, connectivity और safe participation भी जरूरी हैं।","Shared device, low-data learning, community digital centre.","एक low-bandwidth learning plan बनाएं।","अपने क्षेत्र के learners के लिए device-sharing guidelines सोचें।","केवल smartphone होना digital inclusion मान लेना।","Access + affordability + skills + safety मिलकर meaningful digital inclusion बनाते हैं।"),
  makeLesson("The Future of Mobile Life","मोबाइल जीवन का भविष्य","Mobile computing AI, wearables, connected services और new interfaces के साथ बदलता रहेगा।","Future readiness का मतलब हर new feature अपनाना नहीं, बल्कि benefits, risks, evidence और personal need देखकर निर्णय लेना है।","AI assistants, wearables, eSIM, passkeys, connected devices.","किसी नए mobile feature का benefit-risk analysis करें।","एक personal technology adoption checklist बनाएं।","Novelty को usefulness का प्रमाण मानना।","Future-ready user curious भी है और cautious भी।")
];

const MOBILE_PHONE_COURSE = {
  id:"mobile-phone-digital-life-safety",
  title:{en:"Mobile Phone, Digital Life & Safety",hi:"मोबाइल फोन, डिजिटल जीवन एवं सुरक्षा"},
  category:"Digital Skills / डिजिटल कौशल",
  type:"certificate",
  level:"foundation",
  description:"A comprehensive, practical course about how mobile phones work, how people use them for communication, learning, work, money, health and daily life, and how to protect privacy, children, accounts and wellbeing.",
  audience:"Students, parents, children with age-appropriate guidance, volunteers, community learners, workers, older adults and anyone who wants to use a mobile phone confidently and safely.",
  prerequisites:["No prior technical knowledge required.","Children should learn with age-appropriate guidance and a trusted adult where needed."],
  learningHours:30,
  version:"1.0",
  lastReviewed:"2026-09-30",
  outcomes:[
    "Understand what a modern mobile phone is and how networks, hardware, software and apps work together.",
    "Use communication, camera, internet, maps, email, documents and digital payment features more safely.",
    "Protect passwords, OTPs, privacy, accounts, devices and personal data.",
    "Recognise phishing, scams, misinformation, cyberbullying and unsafe requests.",
    "Build healthier, more intentional mobile habits for learning, work, family and wellbeing.",
    "Guide children and older adults toward safer and more inclusive mobile use.",
    "Evaluate new mobile technologies such as AI features using benefits, risks, evidence and need."
  ],
  modules:[
    makeModule("mobile-foundations","Mobile Foundations","मोबाइल की बुनियाद","Understand the device, network, software, identity, hardware and basic maintenance.",mobileLessons),
    makeModule("mobile-communication","Communication & Everyday Mobile Use","संचार एवं दैनिक मोबाइल उपयोग","Use calls, messages, camera, internet, maps, email, documents and payments with care.",mobileLessons2),
    makeModule("mobile-security","Cyber Safety, Privacy & Children","साइबर सुरक्षा, गोपनीयता एवं बच्चे","Protect accounts and data while understanding online harms, child safety and digital wellbeing.",mobileLessons3),
    makeModule("mobile-learning-work","Learning, Work & Inclusion","सीखना, काम एवं समावेशन","Use the phone as a learning, work and accessibility tool without losing safety and critical thinking.",mobileLessons4),
    makeModule("mobile-life","Mobile Life, Habits & Future","मोबाइल जीवन, आदतें एवं भविष्य","Think critically about attention, family rules, digital inclusion and the future of mobile life.",mobileLessons5)
  ]
};


const MOBILE_BALANCE_LESSONS = [
  makeLesson("Why Are We So Busy on the Phone?","हम मोबाइल में इतने व्यस्त क्यों रहते हैं?","Mobile combines communication, entertainment, information, shopping, work and social connection in one device, so checking it can become frequent and automatic.","Notifications, infinite feeds, autoplay, social feedback, convenience and habit loops can repeatedly attract attention. The goal is not to blame the user, but to understand the system and regain intentional control.","A person opens the phone for one message and then spends 30 minutes switching between apps.","अपने पिछले दिन के सबसे ज्यादा इस्तेमाल किए गए 5 apps देखें और हर app का वास्तविक उद्देश्य लिखें।","एक दिन में बिना सोचे phone उठाने के कम-से-कम 5 अवसर नोट करें।","हर बार phone उठाने को जरूरी मानना; notification को urgency समझना।","पहचानना कि phone use need, habit और design—तीनों का परिणाम हो सकता है।"),
  makeLesson("Benefits of a Mobile Phone","मोबाइल फोन के फायदे","A mobile phone can provide communication, learning, navigation, emergency access, banking, work tools and creative opportunities.","Its value depends on purpose and context. The same device can save time when used intentionally and consume time when used without a clear purpose.","Online class, digital payment, map navigation, emergency call, small business communication.","अपने फोन के 10 उपयोग लिखकर उन्हें learning, work, communication, safety और entertainment में बाँटें।","एक ऐसा काम पहचानें जिसमें mobile ने आपका समय या मेहनत बचाई।","हर mobile use को केवल फायदा या केवल नुकसान मान लेना।","Mobile एक tool है; benefit उसके उपयोग के उद्देश्य और तरीके से तय होता है।"),
  makeLesson("Harms of Excessive Use","अत्यधिक उपयोग के नुकसान","Excessive or poorly timed use can interfere with sleep, attention, study, work, relationships and offline activities.","Impact varies by person and activity. The important question is not only total hours but what the phone replaces, when it is used and whether the user can stop intentionally.","Late-night scrolling, repeated checking during study, phone at meals, constant social-media switching.","अपने phone use के कारण छूटने वाली एक offline activity पहचानें।","एक 24-hour observation sheet बनाएं: time, app, purpose, duration, feeling/result।","हर समस्या को केवल screen-time number से समझना।","Healthy digital use requires looking at duration, timing, purpose, content and consequences together।"),
  makeLesson("Screen Time: What Does the Number Mean?","Screen Time: संख्या का अर्थ क्या है?","Screen-time statistics show device or app usage, but the number alone does not tell whether use was useful or harmful.","Compare categories such as work, study, communication and entertainment. Look for patterns, peak times and unnecessary repetition rather than chasing an arbitrary universal number.","Three hours of learning and three hours of uncontrolled scrolling are not equivalent uses.","अपने phone का weekly screen-time report देखें और categories बनाएं।","एक target तय करें: unnecessary entertainment use को धीरे-धीरे कम करना और useful use को organised रखना।","एक fixed hour limit को हर व्यक्ति के लिए universal rule मानना।","Screen time is a measurement for reflection, not the complete definition of digital wellbeing।"),
  makeLesson("When and How Much Should We Use a Phone?","मोबाइल कब और कितना इस्तेमाल करें?","There is no single useful number for every person or every day; appropriate use depends on age, work, study, sleep, health, responsibilities and purpose.","Instead of asking only 'how many hours?', ask 'for what purpose, at what time, with what effect, and could I stop when I intended?' Build personal rules around sleep, focused work, meals, exercise, family time and safety.","Student study session, worker using phone for work, parent managing children, older adult using calls.","अपने लिए five-zone routine बनाएं: essential, learning/work, communication, entertainment, screen-free time.","एक 7-day personal phone-use plan बनाएं और हर दिन review करें।","दूसरों के hours देखकर अपनी जरूरत तय करना।","Balanced use is intentional, context-aware and reviewable rather than a single universal number।"),
  makeLesson("Signs of Unhealthy Phone Habits","अस्वस्थ मोबाइल आदतों के संकेत","Warning signs can include repeatedly checking without purpose, losing sleep, difficulty stopping, neglecting responsibilities or becoming distracted during important activities.","A pattern matters more than one unusual day. If phone use is causing serious distress or functional problems, trusted support or qualified professional help may be appropriate.","Phone checking during conversations, study, meals or bedtime.","एक सप्ताह में अपने 3 सबसे common distraction patterns लिखें।","Habit trigger → phone action → immediate reward → consequence का छोटा map बनाएं।","हर frequent user को automatically addicted कहना।","Observe patterns without labels, then change specific behaviours one step at a time।"),
  makeLesson("Notifications and Distraction","Notifications और ध्यान भटकना","Notifications are useful alerts, but many non-essential alerts create repeated interruptions.","Turn off, group or delay notifications that do not require immediate attention. Keep safety, family and genuinely important work alerts available.","Social likes, shopping offers, game alerts versus emergency contacts.","आज केवल essential notifications रखें और difference observe करें।","Notifications को Keep / Reduce / Mute तीन groups में बाँटें।","हर notification को तुरंत खोलना।","Notification control is one of the simplest ways to return control of attention to the user।"),
  makeLesson("Social Media: Connection or Time Trap?","सोशल मीडिया: जुड़ाव या समय का जाल?","Social media can support communication, learning, communities and creativity, while feeds can also encourage prolonged passive consumption.","Algorithms and social feedback may shape what appears in the feed. Users can reduce passive scrolling by choosing specific purposes, following useful sources and taking intentional breaks.","Learning group, community information, creator content, endless short-video feed.","अपने social apps में top followed accounts को review करें।","एक 'purpose before opening' rule बनाएं: सीखना, संदेश, काम या specific search।","Scroll शुरू करने से पहले कोई उद्देश्य न होना।","Social media becomes more useful when the user chooses the purpose instead of simply following the feed।"),
  makeLesson("Gaming and Entertainment","Gaming और मनोरंजन","Games and entertainment can provide relaxation, creativity and social connection, but unplanned sessions can displace sleep, study, work or relationships.","Look at duration, stopping ability, spending, emotional effect and timing. Build clear start/stop conditions rather than relying only on willpower.","Online games, streaming, short videos, music.","एक entertainment session शुरू करने से पहले stop time तय करें।","एक सप्ताह का entertainment budget बनाएं: time, money and sleep boundaries।","रात में बिना सीमा entertainment जारी रखना।","Entertainment is healthiest when it fits inside a wider routine rather than replacing essential activities।"),
  makeLesson("Mobile and Sleep","मोबाइल और नींद","Late-night phone use can delay bedtime and keep attention active when the body should be preparing for sleep.","Create a consistent wind-down routine, reduce stimulating content late at night, use device controls where helpful and keep the bedroom routine intentional.","Short videos in bed, late messages, gaming before sleep.","अपने सोने से पहले के 60 मिनट observe करें।","एक screen-free wind-down routine बनाकर सात दिन test करें।","बिस्तर में लगातार scrolling को normal routine मानना।","Protecting sleep is an important part of responsible mobile use।"),
  makeLesson("Mobile and Study","मोबाइल और पढ़ाई","Mobile can provide lessons, dictionaries, research, notes and educational tools, but switching between study and entertainment can fragment attention.","Use focused sessions, relevant apps, notification control and clear study goals. Keep distracting apps out of the study workflow where possible.","Video lesson plus notes versus study interrupted by social media.","एक 30–45 minute focused study session करें।","Study Mode checklist बनाएं: goal, materials, notifications, timer, review।","हर study break को social-media session बना देना।","The phone should support the learning task rather than compete with it।"),
  makeLesson("Mobile and Work","मोबाइल और काम","Mobile enables calls, email, documents, payments, meetings and field work.","Productive use still needs boundaries: verify recipients, protect files, manage notifications and separate urgent work from constant availability.","Field worker, small business owner, NGO volunteer, remote worker.","अपने work apps और personal apps की notification needs अलग करें।","एक mobile work routine बनाएं जिसमें start, focus, response and shutdown periods हों।","हर work message को instantly urgent मानना।","Professional mobile use requires both productivity and boundaries।"),
  makeLesson("Family and Relationships","परिवार और रिश्तों में मोबाइल","Phones can connect families across distance, but constant checking during shared time can reduce attention to people nearby.","Agree on practical shared rules such as device-free meals, focused conversations and emergency exceptions.","Family dinner, meeting, parent-child conversation.","एक family interaction के दौरान phone-free period रखें।","परिवार के साथ 5 simple digital rules बनाएं।","दूसरे व्यक्ति के सामने लगातार screen देखना।","Digital balance includes giving people real attention, not only managing screen time।"),
  makeLesson("Children and Age-Appropriate Use","बच्चों और उम्र के अनुसार उपयोग","Children need age-appropriate guidance, privacy protection, safe content, clear routines and trusted adults who model healthy behaviour.","Rules should consider age, maturity, school needs, safety and family circumstances. Parents should explain reasons and review rules rather than relying only on punishment.","Study device, supervised video, family communication, online game.","बच्चे के साथ 'safe, useful, private, not allowed' categories बनाएं।","एक child-friendly family digital agreement तैयार करें।","बच्चे को बिना guidance unrestricted access देना या केवल punishment पर निर्भर रहना।","Children learn digital habits partly by watching adults, so adult behaviour matters too।"),
  makeLesson("Privacy in Everyday Mobile Use","दैनिक मोबाइल उपयोग में गोपनीयता","Phones contain contacts, photos, location, messages, documents and account information.","Review permissions, lock the device, use secure authentication and think before sharing photos, documents or live location.","Public photo with home address visible, unnecessary location permission, shared documents.","अपने top apps की camera, microphone, contacts, location permissions review करें।","एक personal privacy checklist बनाएं।","हर app को हर permission देना।","Privacy is not a single setting; it is a series of everyday choices।"),
  makeLesson("Scams, OTP and UPI Safety","Scam, OTP और UPI सुरक्षा","Fraudsters may use urgency, fear, authority or attractive offers to make people reveal secrets or send money.","Never share OTP, PIN or passwords with callers. Verify unexpected requests through official channels and stop when something feels unusual.","Fake KYC call, fake refund, fake delivery message, remote-support request.","तीन suspicious messages में red flags पहचानें।","घर के लिए 'STOP–VERIFY–THEN ACT' rule लिखें।","Caller ID को proof मानना या pressure में payment करना।","Slow verification is safer than fast reaction when money or accounts are involved।"),
  makeLesson("Phone Lost or Stolen","मोबाइल खो जाए या चोरी हो जाए तो क्या करें?","A lost phone can expose accounts, messages, photos and payment access, so preparation matters.","Use screen lock, account recovery options, backups and device-finding/security features where available. If lost, protect accounts and contact relevant providers or authorities as appropriate.","Lost phone at market, travel or public transport.","अपने important accounts की recovery options review करें।","एक 'Lost Phone Action Card' बनाएं: lock, locate, account protection, SIM/provider, reporting।","Backup और recovery options पहले से न रखना।","Preparation reduces the damage a lost device can cause।"),
  makeLesson("AI on the Mobile","मोबाइल में AI का उपयोग","AI tools can help with writing, learning, translation, ideas, summaries and productivity.","AI output can be wrong or incomplete. Important information should be checked, and sensitive personal or confidential data should not be shared carelessly.","Study explanation, translation, draft message, brainstorming.","एक simple question AI से पूछें और answer को reliable source से verify करें।","AI use checklist बनाएं: purpose, privacy, verification, human judgement।","AI को हमेशा सही मानना।","AI is an assistant, not a substitute for verification and responsible judgement।"),
  makeLesson("Mobile for Learning and Skills","मोबाइल से सीखना और कौशल विकास","A phone can make learning accessible through courses, videos, documents, practice and communication.","Good learning requires active practice, notes, assessment and application—not endless content consumption.","SSF Learning Hub, language practice, vocational tutorials.","एक learning goal चुनकर 30-minute focused session करें।","Learn → Practise → Check → Apply का routine बनाएं।","वीडियो देखकर practice न करना।","Learning value comes from active use and application, not simply screen time।"),
  makeLesson("Mobile for Work and Income","मोबाइल से काम और आय के अवसर","Phones can support job search, small business, customer communication, digital payments and content creation.","Opportunities also carry scams, platform fees, privacy risks and unrealistic earning claims. Verify opportunities and calculate real costs.","Online application, local service business, digital catalogue.","एक genuine work use-case का cost-benefit लिखें।","किसी earning offer के लिए verification checklist बनाएं।","'घर बैठे guaranteed income' जैसे claims पर तुरंत भरोसा करना।","Mobile can enable opportunity, but opportunity should be verified and evaluated realistically।"),
  makeLesson("Accessibility and Senior-Friendly Use","Accessibility और वरिष्ठ नागरिकों के लिए उपयोग","Larger text, voice input, magnification, captions and simplified contacts can make phones easier for many users.","Inclusive setup should match the person's needs and preserve privacy and independence.","Large text, voice calling, emergency contacts, hearing-related features.","किसी परिवार सदस्य के लिए accessibility settings review करें।","Senior-friendly phone setup checklist बनाएं।","तकनीकी भाषा में समझाना या settings बिना consent बदलना।","Good digital support is patient, understandable, respectful and user-controlled।"),
  makeLesson("Digital Balance Plan","अपना Digital Balance Plan बनाना","A sustainable plan combines useful phone time, focused work, family time, sleep, movement, offline activities and intentional entertainment.","Start with observation, choose a few changes, measure results and adjust. Extreme rules are often less practical than consistent habits.","7-day notification reduction, bedtime routine, study blocks.","अपना current pattern लिखकर तीन changes चुनें।","एक personal 7-day Digital Balance Plan बनाएं और daily review करें।","एक दिन में बहुत सारे कठोर नियम लगाना।","Small measurable changes, repeated consistently, can create a more sustainable routine।")
];



const DIRECTION_14_22_LESSONS = [
  makeLesson(
    "Why 14–22 Is a Direction-Building Age",
    "14–22 की उम्र दिशा बनाने की उम्र क्यों है?",
    "यह उम्र बचपन से जिम्मेदार वयस्क जीवन की ओर बढ़ने की होती है। इस समय पढ़ाई, मित्र, मोबाइल, प्रेम, परिवार, पैसा और करियर से जुड़े कई नए निर्णय सामने आते हैं।",
    "हर निर्णय जीवन का अंतिम फैसला नहीं होता, लेकिन छोटे-छोटे निर्णय आदत बनाते हैं। इसलिए लक्ष्य 'हर बार perfect decision' नहीं, बल्कि सोचकर निर्णय लेना, गलती से सीखना और जरूरत पर सही व्यक्ति से सलाह लेना है।",
    "उदाहरण: 16 साल का विद्यार्थी पढ़ाई छोड़कर केवल online entertainment में समय लगाने लगे; 18 साल का युवा बिना जांच किसी नौकरी/कमाई के प्रस्ताव में पैसा भेज दे; 20 साल का युवा केवल दोस्तों के दबाव में course चुन ले।",
    "पिछले 7 दिनों के अपने तीन महत्वपूर्ण निर्णय लिखें और बताएं: मैंने क्यों चुना, परिणाम क्या हुआ, अगली बार क्या बदलूंगा?",
    "एक 'मेरी दिशा' पृष्ठ बनाएं: मेरी ताकतें, मेरी रुचियां, मेरी जिम्मेदारियां, मेरे लक्ष्य और मुझे किन लोगों से सलाह लेनी चाहिए।",
    ["हर गलती को जीवन की बर्बादी मानना","दूसरों की life देखकर अपनी दिशा तय करना","तुरंत परिणाम को ही सफलता समझना"],
    "दिशा एक दिन में नहीं बनती। जागरूक निर्णय, अच्छे संबंध, कौशल, अनुशासन और लगातार सुधार मिलकर दिशा बनाते हैं।"
  ),
  makeLesson(
    "Know Yourself: Values, Strengths & Interests",
    "अपने आप को समझना: मूल्य, ताकत और रुचि",
    "सही दिशा चुनने से पहले यह समझना जरूरी है कि आपको क्या महत्वपूर्ण लगता है, आप किन कामों में अच्छे हैं और किन विषयों को सीखने में वास्तविक रुचि है।",
    "रुचि और क्षमता हमेशा एक जैसी नहीं होतीं। कोई काम पसंद होना उपयोगी संकेत है, लेकिन career decision के लिए aptitude, learning effort, अवसर, आर्थिक वास्तविकता और long-term fit भी देखना चाहिए।",
    "किसी को drawing पसंद है लेकिन graphic design के साथ communication और software skills भी सीखनी होंगी; किसी को science पसंद है लेकिन नियमित study और practical work भी जरूरी होगा।",
    "एक table बनाएं: मुझे पसंद है / मैं कर सकता हूं / मुझे सीखना है / इसके लिए कौन-से अवसर हैं।",
    "तीन trusted लोगों से पूछें कि वे आपकी दो strengths और एक improvement area क्या मानते हैं।",
    ["केवल personality test को अंतिम सत्य मानना","दूसरों की प्रशंसा को skill का प्रमाण मानना","अपनी कमजोरी देखकर पूरी क्षमता नकार देना"],
    "Self-awareness का अर्थ खुद को label करना नहीं, बल्कि अपने व्यवहार, क्षमता, values और learning needs को ईमानदारी से समझना है।"
  ),
  makeLesson(
    "Good Direction vs Wrong Direction",
    "सही दिशा और गलत दिशा को कैसे पहचानें?",
    "किसी रास्ते को केवल इसलिए सही नहीं माना जा सकता क्योंकि उसमें मजा, पैसा या popularity दिखाई देती है। दिशा का मूल्य उसके परिणाम, जोखिम, जिम्मेदारी और भविष्य पर असर से भी समझें।",
    "एक उपयोगी test है: क्या यह रास्ता मुझे सीखने, स्वास्थ्यकर दिनचर्या, सम्मानजनक संबंध, lawful काम और भविष्य की क्षमता की ओर ले जा रहा है या धीरे-धीरे मेरी पढ़ाई, भरोसा, पैसा, समय और अवसर कम कर रहा है?",
    "बार-बार पढ़ाई छोड़ना, रातभर अनियंत्रित scrolling, नशे या गैरकानूनी गतिविधियों की ओर साथियों का दबाव, online fraud में शामिल होना—ये warning signs हो सकते हैं।",
    "किसी भी नई activity के लिए Benefit / Cost / Risk / Learning / Future Opportunity के पांच कॉलम भरें।",
    "दो काल्पनिक युवाओं की weekly routine compare करें और identify करें कि कौन-सी आदतें future options बढ़ा रही हैं।",
    ["'सही' को केवल पैसा मानना","'गलत' को केवल डांट या समाज की राय से तय करना","warning signs को लगातार ignore करना"],
    "सही दिशा वह है जो व्यक्ति की गरिमा, सुरक्षा, सीखने, जिम्मेदारी और भविष्य के विकल्पों को मजबूत करे।"
  ),
  makeLesson(
    "Decision-Making Framework",
    "निर्णय लेने की वैज्ञानिक और व्यावहारिक विधि",
    "बड़ा निर्णय लेने से पहले समस्या स्पष्ट करें, विकल्प लिखें, तथ्य जुटाएं, परिणाम सोचें, जोखिम देखें और फिर निर्णय लें।",
    "एक simple framework: STOP → DEFINE → OPTIONS → EVIDENCE → RISKS → ADVICE → DECIDE → REVIEW. हर निर्णय में certainty नहीं होगी; अच्छी प्रक्रिया uncertainty को manage करती है।",
    "Course चुनना, job offer लेना, शहर बदलना, expensive phone खरीदना, दोस्ती की सीमा तय करना।",
    "अगले किसी छोटे निर्णय पर framework लागू करें और decision journal लिखें।",
    "परिवार/mentor से सलाह लें, लेकिन अंतिम जिम्मेदारी और उपलब्ध जानकारी को भी समझें।",
    ["जल्दबाजी में निर्णय","एक ही व्यक्ति की बात पर निर्भर रहना","सिर्फ emotion या peer pressure पर फैसला करना"],
    "अच्छा निर्णय भविष्य की guarantee नहीं देता; वह उपलब्ध जानकारी के आधार पर जिम्मेदार प्रक्रिया देता है।"
  ),
  makeLesson(
    "Peer Pressure & Influence",
    "दोस्तों का दबाव और प्रभाव",
    "मित्रों का प्रभाव सामान्य है। समस्या तब शुरू होती है जब व्यक्ति अपनी values, safety, पढ़ाई, पैसा या कानून के विरुद्ध केवल स्वीकार किए जाने के लिए कुछ करने लगे।",
    "Peer pressure direct भी हो सकता है और indirect भी: 'सब कर रहे हैं', मजाक उड़ाना, group से निकालने की धमकी, social media trends या status competition।",
    "नशे की शुरुआत के लिए दबाव, risky driving, cheating, private photo share करना, betting/gambling-like activities या किसी को online परेशान करने के लिए group pressure।",
    "तीन respectful refusal sentences तैयार करें: 'नहीं, मैं इसमें comfortable नहीं हूं'; 'मैं पहले verify करूंगा'; 'यह मेरे लक्ष्य के खिलाफ है।'",
    "एक role-play करें जिसमें दोस्त दबाव डालते हैं और learner बिना झगड़े स्पष्ट सीमा रखता है।",
    ["हर refusal को कमजोरी समझना","group approval को self-worth बनाना","risk समझकर भी 'एक बार' कहकर करना"],
    "सच्ची स्वतंत्रता केवल अपनी इच्छा करना नहीं; दबाव में भी अपने values और safety के अनुसार निर्णय कर पाना है।"
  ),

  makeLesson(
    "Friendship, Relationships & Boundaries",
    "दोस्ती, संबंध और व्यक्तिगत सीमाएं",
    "अच्छे संबंध सम्मान, consent, trust, communication और boundaries पर टिके होते हैं।",
    "14–22 की उम्र में friendship और romantic relationships दोनों भावनात्मक रूप से महत्वपूर्ण हो सकते हैं। लेकिन किसी संबंध के नाम पर control, threats, humiliation, money pressure, private content मांगना या isolation स्वीकार करना जरूरी नहीं है।",
    "फोन password मांगना, हर समय location मांगना, 'अगर दोस्त हो तो photo भेजो' कहना, पढ़ाई रोकने का दबाव या पैसे मांगना boundary concerns हो सकते हैं।",
    "अपने लिए five boundaries लिखें: privacy, time, money, online sharing और respectful communication।",
    "किसी trusted adult/mentor के साथ healthy vs unhealthy relationship scenarios पर चर्चा करें।",
    ["Jealousy को प्यार का प्रमाण मानना","private content share करके trust prove करना","अपनी boundary बताने में शर्म करना"],
    "Healthy relationship में सम्मान और स्वतंत्रता दोनों के लिए जगह होती है। असुरक्षित या coercive स्थिति में trusted support लेना महत्वपूर्ण है।"
  ),
  makeLesson(
    "Family Communication & Asking for Help",
    "परिवार से संवाद और मदद मांगना",
    "जब युवा कोई कठिन निर्णय, गलती, डर या confusion महसूस करे तो अकेले छिपाने के बजाय किसी भरोसेमंद व्यक्ति से बात करना उपयोगी हो सकता है।",
    "हर परिवार एक जैसा नहीं होता। इसलिए trusted support केवल माता-पिता तक सीमित नहीं: teacher, relative, mentor, counsellor, responsible elder या appropriate professional भी हो सकता है।",
    "Career confusion, exam failure, online scam, relationship conflict, bullying, money problem या unsafe situation।",
    "एक 'मेरे 3 भरोसेमंद लोग' list बनाएं और लिखें कि किस समस्या में किससे संपर्क करेंगे।",
    "एक कठिन बातचीत का rehearsal करें: तथ्य बताना, अपनी भावना बताना, मदद स्पष्ट रूप से मांगना और next step तय करना।",
    ["मदद मांगना कमजोरी समझना","समस्या बहुत बड़ी होने तक छिपाना","हर समस्या का समाधान केवल दोस्त से मांगना"],
    "समय पर सही व्यक्ति से मदद मांगना जिम्मेदारी है। यदि कोई स्थिति unsafe हो, तो immediate safety को प्राथमिकता दें।"
  ),
  makeLesson(
    "Digital Life, Social Media & Algorithms",
    "डिजिटल जीवन, सोशल मीडिया और algorithms",
    "मोबाइल और social media सीखने, जुड़ने और अवसर पाने के साधन हैं, लेकिन platforms attention पाने के लिए recommendations और notifications का उपयोग करते हैं।",
    "आप जो देखते हैं वह पूरी दुनिया का neutral sample नहीं होता। Algorithms आपके previous interactions के आधार पर content दिखा सकते हैं, जिससे comparison, outrage या endless scrolling बढ़ सकता है।",
    "Short-video feed, influencer lifestyle, viral challenge, targeted advertisement, repeated recommendation।",
    "एक सप्ताह notifications और social media opening triggers observe करें।",
    "अपने phone में non-essential notifications बंद करें और एक focused study/work block बिना social media पूरा करें।",
    ["हर viral content को reality मानना","online popularity को personal success मानना","privacy settings और audience को ignore करना"],
    "Digital tool को control में रखने के लिए intentional use, verification, privacy और time boundaries जरूरी हैं।"
  ),
  makeLesson(
    "Online Safety, Scams & Digital Reputation",
    "ऑनलाइन सुरक्षा, scams और digital reputation",
    "युवा job, study, gaming, shopping, payments और social media के कारण online fraud के target बन सकते हैं।",
    "Common warning signs में urgency, guaranteed money, advance payment, OTP/PIN मांगना, fake identity, suspicious links और unrealistic offers शामिल हैं। Digital reputation भी long-term asset है।",
    "Fake job registration fee, scholarship scam, fake account recovery, investment/earning promise, private photo blackmail या impersonation।",
    "किसी suspicious message को STOP → CHECK → VERIFY → REPORT के अनुसार handle करें।",
    "अपने लिए cyber safety card बनाएं: screen lock, MFA, backup, privacy, no OTP/PIN sharing, official verification।",
    ["Caller ID को proof मानना","'guaranteed income' देखकर payment करना","private image/video भेजकर threat के दबाव में रहना"],
    "Online दुनिया में speed से ज्यादा verification महत्वपूर्ण है। गंभीर threat या exploitation में trusted support और appropriate official help लें।"
  ),
  makeLesson(
    "Study, Skill & Career Direction",
    "पढ़ाई, कौशल और करियर की दिशा",
    "Career केवल एक job title नहीं है। Education, skills, experience, communication, digital ability और character मिलकर employability बनाते हैं।",
    "14–22 में career को final lock करने की जरूरत नहीं, लेकिन directionless रहने की भी जरूरत नहीं। छोटे experiments—course, project, internship, volunteering, practical skill—information बढ़ाते हैं।",
    "Commerce student spreadsheet skill सीखता है; rural youth agriculture value-addition project करता है; college student internship से field fit समझता है।",
    "अपनी रुचि से जुड़े तीन career options चुनें और प्रत्येक के लिए qualification, skills, cost, duration, earning reality और next step खोजें।",
    "30-day skill experiment चुनें और weekly evidence रखें: मैंने क्या सीखा, क्या बनाया, क्या कठिन लगा।",
    ["केवल salary देखकर career चुनना","fake coaching/job promises पर भरोसा करना","skill सीखने के बजाय केवल certificate जमा करना"],
    "Career clarity अक्सर action और evidence से आती है। छोटे वास्तविक experiments uncertainty को कम करते हैं।"
  ),
  makeLesson(
    "Money, Spending & First Financial Habits",
    "पैसा, खर्च और पहली वित्तीय आदतें",
    "कम उम्र में money habits बनना शुरू होती हैं। कमाई चाहे कम हो, budgeting, saving, record keeping और fraud awareness सीखी जा सकती है।",
    "Needs, wants, goals और risks अलग करें। Credit/loan, online offers, subscriptions, betting/gambling और impulsive purchases को long-term consequences के साथ देखें।",
    "Phone upgrade के लिए loan लेना, gaming purchase, subscription भूल जाना, emergency saving न रखना।",
    "एक महीने के काल्पनिक ₹10,000 budget में needs, learning, savings और discretionary spending allocate करें।",
    "अपने वास्तविक खर्च का 7-day record बनाएं और तीन unnecessary expenses identify करें।",
    ["दिखावे के लिए खर्च","दोस्तों से financial comparison","OTP/PIN share करना","quick money schemes पर भरोसा करना"],
    "Financial maturity का पहला कदम ज्यादा पैसा नहीं, बल्कि पैसे को समझकर जिम्मेदारी से संभालना है।"
  ),

  makeLesson(
    "Habits, Discipline & Time",
    "आदतें, अनुशासन और समय",
    "दिशा को daily routine में बदलने के लिए छोटे consistent habits जरूरी हैं। Motivation हमेशा नहीं रहती; systems मदद करते हैं।",
    "Habit loop में cue, routine और reward जैसे patterns हो सकते हैं। Environment बदलना—phone दूर रखना, study place तय करना, reminders—self-control को आसान बना सकता है।",
    "सुबह उठते ही social media, exam से पहले random browsing, रात देर तक gaming, या रोज 30-minute skill practice।",
    "एक 'one habit at a time' 7-day experiment करें।",
    "Daily 3 priorities लिखें और रात को केवल यह review करें कि क्या हुआ और क्यों।",
    ["एक साथ 10 habits शुरू करना","एक दिन fail होने पर पूरा plan छोड़ देना","अनुशासन को केवल कठोरता समझना"],
    "Discipline का उद्देश्य जीवन को कैद करना नहीं, बल्कि जरूरी कामों के लिए समय और ध्यान सुरक्षित करना है।"
  ),
  makeLesson(
    "Physical Activity, Sleep & Everyday Well-being",
    "शारीरिक गतिविधि, नींद और दैनिक wellbeing",
    "अच्छी दिशा केवल career नहीं; शरीर, नींद, भोजन, movement, relationships और rest भी daily functioning को प्रभावित करते हैं।",
    "बहुत देर तक screen use, irregular sleep और inactivity study/work performance को प्रभावित कर सकते हैं। व्यक्तिगत जरूरतें अलग हो सकती हैं, इसलिए severe or persistent problems में qualified professional की सलाह उचित है।",
    "Late-night scrolling से सुबह देर होना; पूरे दिन बैठना; exam के समय sleep sacrifice करना।",
    "एक सप्ताह sleep, movement और screen timing का simple observation log रखें।",
    "एक realistic evening wind-down routine बनाएं जिसमें phone-free period शामिल हो।",
    ["नींद को 'waste of time' मानना","अत्यधिक कठोर fitness rules","लगातार समस्या होने पर मदद न लेना"],
    "Wellbeing कोई luxury नहीं; सीखने, काम करने और जिम्मेदार निर्णय लेने की क्षमता के लिए daily foundation है।"
  ),
  makeLesson(
    "Handling Failure, Mistakes & Setbacks",
    "असफलता, गलती और setback से सीखना",
    "Exam failure, rejected application, broken friendship या गलत decision जीवन का अंत नहीं। घटना से सीखना और अगला कदम तय करना महत्वपूर्ण है।",
    "Reflection में तीन प्रश्न उपयोगी हैं: क्या हुआ? मेरे control में क्या था? अगली बार कौन-सा specific change करूंगा? Shame और learning को अलग रखें।",
    "कम marks के बाद study method बदलना; interview reject होने के बाद mock interview करना; गलत purchase के बाद budget rule बनाना।",
    "एक पुरानी गलती लिखें और उसे 'lesson → change → test' में बदलें।",
    "किसी trusted person से constructive feedback मांगें।",
    ["एक failure से identity तय करना","दूसरों को हर बार blame करना","सिर्फ regret करना, action न बदलना"],
    "Failure information दे सकता है। Responsible learner feedback को next experiment में बदलता है।"
  ),
  makeLesson(
    "Critical Thinking & Misinformation",
    "आलोचनात्मक सोच और गलत जानकारी",
    "हर confident statement सच नहीं होता। Young learners को claim, evidence, source, date और context की जांच करना सीखना चाहिए।",
    "Emotional headlines, edited screenshots, fake experts, cherry-picked examples और forwarded messages misleading हो सकते हैं। किसी claim को verify करने के लिए primary/official source और independent credible sources देखें।",
    "Fake scholarship notice, false exam date, health claim, political rumour, fake job vacancy।",
    "एक online claim चुनें और Source / Date / Evidence / Other sources / What remains uncertain लिखें।",
    "परिवार में एक 'forward करने से पहले verify' rule बनाएं।",
    ["पहले result को final evidence मानना","केवल अपने पसंद के source देखना","uncertainty को failure समझना"],
    "Critical thinking का अर्थ हर बात पर शक करना नहीं; evidence के अनुसार विश्वास की मात्रा तय करना है।"
  ),
  makeLesson(
    "Choosing Friends, Mentors & Environments",
    "दोस्त, mentor और environment कैसे चुनें?",
    "आप जिन लोगों और environments में बार-बार रहते हैं, वे आपकी habits और opportunities को प्रभावित कर सकते हैं।",
    "Friendship का मतलब identical होना नहीं। अच्छे peer group में respect, learning, honesty और boundaries के लिए जगह होती है। Mentor वह व्यक्ति हो सकता है जो experience के आधार पर प्रश्न पूछने और सोचने में मदद करे।",
    "Study group जो regular practice करता है; sports group जो discipline बढ़ाता है; online group जो केवल risky challenges और abuse को encourage करता है।",
    "अपने current circles को तीन categories में देखें: मुझे आगे बढ़ाते हैं / neutral / मुझे नुकसान की ओर धकेलते हैं।",
    "एक positive learning community खोजें और उसमें एक constructive activity join करें।",
    ["लोकप्रियता को quality मानना","एक ही group को पूरी identity बनाना","toxic behavior को loyalty के नाम पर सहना"],
    "Environment को पूरी तरह control करना संभव नहीं, लेकिन किन लोगों और activities को अधिक समय देना है, इस पर काफी agency होती है।"
  ),

  makeLesson(
    "Consent, Respect, Safety & Personal Boundaries",
    "सहमति, सम्मान, सुरक्षा और व्यक्तिगत सीमाएं",
    "किसी व्यक्ति की privacy, body, time, money, device और personal information का सम्मान करना healthy relationships का आधार है।",
    "Consent clear, voluntary और situation-specific होना चाहिए। Pressure, threats, deception या fear में मिली 'हाँ' को healthy consent नहीं माना जाना चाहिए।",
    "Private photo मांगना, phone check करने के लिए pressure, unwanted touch, money demand या personal information share करने का दबाव।",
    "Boundary sentence practice करें: 'मैं यह share नहीं करना चाहता/चाहती', 'कृपया मेरी permission के बिना ऐसा न करें।'",
    "Trusted support map बनाएं कि unsafe situation में किससे और कैसे संपर्क करेंगे।",
    ["'नहीं' का सम्मान न करना","private information को relationship proof मानना","unsafe situation को अकेले handle करने की कोशिश"],
    "Respect और safety दोनों दिशाओं में काम करते हैं। Unsafe or coercive situations में support लेना उचित है।"
  ),
  makeLesson(
    "Substance Use, Risky Activities & Law",
    "नशा, जोखिमपूर्ण गतिविधियां और कानून",
    "कुछ activities short-term excitement या peer acceptance दे सकती हैं लेकिन health, education, money, relationships और legal consequences पर गंभीर असर डाल सकती हैं।",
    "14–22 की उम्र में 'बस एक बार' या 'सब करते हैं' जैसे arguments risk को छोटा दिखा सकते हैं। Illegal substances, dangerous driving, violence, fraud, cybercrime और betting/gambling-like activities से दूर रहना जरूरी है।",
    "नशे के लिए group pressure, बिना licence/rules के dangerous driving, online fraud में account देने का प्रस्ताव।",
    "Risky invitation के लिए refusal + exit plan बनाएं: कौन-सा वाक्य बोलेंगे, किसे call करेंगे, सुरक्षित जगह कैसे जाएंगे।",
    "एक trusted adult/mentor को पहले से emergency contact बनाएं।",
    ["Risk को challenge समझना","legal consequences को ignore करना","group छोड़ने में शर्म करना"],
    "Courage का अर्थ अनावश्यक जोखिम लेना नहीं; सुरक्षित निर्णय लेकर भविष्य बचाना भी courage है।"
  ),
  makeLesson(
    "Career Choices, Courses & Avoiding False Promises",
    "Career और course चुनना: झूठे वादों से बचें",
    "Course या job चुनते समय recognition, eligibility, curriculum, cost, duration, practical outcomes और credible placement information की जांच करें।",
    "Guaranteed job, guaranteed income या '100% success' जैसे claims को evidence के बिना स्वीकार न करें। Official institution details और written terms पढ़ें।",
    "Fake training institute, paid registration for fake job, certificate-only course, misleading placement advertisement।",
    "किसी course के लिए verification checklist बनाएं: provider, recognition, syllabus, fees, refund terms, outcomes, independent evidence।",
    "दो courses की evidence-based comparison sheet बनाएं और assumptions अलग लिखें।",
    ["केवल advertisement देखकर admission","loan लेकर बिना research course खरीदना","certificate को skill का substitute मानना"],
    "Career investment में information और verification उतने ही महत्वपूर्ण हैं जितना enthusiasm।"
  ),
  makeLesson(
    "Building a 1-Year Personal Roadmap",
    "अपना 1-वर्षीय Personal Roadmap बनाना",
    "एक वर्ष की दिशा को छोटे quarterly और monthly goals में बदलने से बड़े लक्ष्य actionable बनते हैं।",
    "Roadmap में education, one employable skill, wellbeing, relationships, money habits, digital habits और contribution जैसे areas शामिल किए जा सकते हैं।",
    "12 महीने में English communication improve करना, spreadsheet सीखना, board/college preparation, internship project या local community volunteering।",
    "एक page roadmap बनाएं: 1-year goal → 90-day target → monthly milestones → weekly action → evidence of progress।",
    "हर Sunday 15-minute review: क्या सीखा, क्या पूरा हुआ, क्या बदलना है?",
    ["बहुत बड़े vague goals","केवल outcome लिखना, process नहीं","review न करना"],
    "Direction becomes practical when a goal has a next action, a time frame and evidence of progress."
  ),
  makeLesson(
    "Emergency Decision Plan & Trusted Support",
    "मुश्किल स्थिति के लिए Emergency Decision Plan",
    "जब situation अचानक बिगड़े—scam, threat, accident, bullying, unsafe gathering या serious conflict—तब पहले से तय plan मदद करता है।",
    "Emergency में priority order रखें: immediate physical safety → trusted person → appropriate local/emergency support → evidence/documentation where safe → follow-up.",
    "Unsafe ride से निकलना, scam payment रोकना, online threat का evidence रखना, lost phone secure करना।",
    "अपने phone में trusted contacts और important recovery information व्यवस्थित रखें।",
    "एक family/mentor emergency card बनाएं: contacts, safe place, essential information और first actions।",
    ["खतरे में evidence लेने के लिए खुद को risk में डालना","अकेले सामना करना","emergency को 'शर्म' के कारण छिपाना"],
    "Emergency plan का उद्देश्य panic कम करना और safe, timely action को आसान बनाना है।"
  ),
  makeLesson(
    "My Direction Charter: Values, Goals & Rules",
    "मेरी दिशा-पत्रिका: मूल्य, लक्ष्य और व्यक्तिगत नियम",
    "Course के अंत में learner अपनी personal direction charter बनाता है—मैं कौन बनना चाहता हूं, किन values पर चलूंगा, क्या सीखूंगा और किन risks से बचूंगा।",
    "यह कोई motivational poster नहीं बल्कि practical decision filter है। नया अवसर मिलने पर पूछें: क्या यह मेरे values, goals, safety और responsibilities के साथ fit है?",
    "Rules: झूठे shortcut नहीं; OTP/PIN नहीं share करूंगा; risky peer pressure में 'ना' कहूंगा; हर महीने skill evidence बनाऊंगा; जरूरत पर mentor से पूछूंगा।",
    "अपने पांच personal rules लिखें और उन्हें अगले 30 दिनों में test करें।",
    "एक final self-review करें: मेरी दिशा क्या है? मेरे top 3 goals क्या हैं? मेरे top 3 risks क्या हैं? मेरी support system कौन है?",
    ["बहुत generic promises","दूसरों के rules copy करना","charter लिखकर कभी review न करना"],
    "दिशा कोई एक मंजिल नहीं; यह values, choices, habits, learning और review से लगातार बनती रहने वाली प्रक्रिया है।"
  )
];

const DIRECTION_14_22_COURSE = {
  id:"direction-decision-life-14-22",
  title:{en:"14–22: Direction, Decisions & Life Skills",hi:"14–22: सही दिशा, सही निर्णय एवं जीवन-कौशल"},
  category:"Youth & Disaster Preparedness / युवा एवं आपदा तैयारी",
  type:"certificate",
  level:"foundation",
  description:"A complete, practical life-direction course for young people aged roughly 14–22: self-understanding, decision-making, peer pressure, friendships and boundaries, digital life, study and career direction, money habits, discipline, wellbeing, critical thinking, safety, risky situations and a one-year personal roadmap.",
  audience:"Adolescents, students, college learners, first-time job seekers, volunteers and young people who feel confused about studies, friends, career, mobile use or their next step.",
  prerequisites:["No academic prerequisite.","Best completed with a notebook or digital journal for exercises and reflection."],
  learningHours:30,
  version:"1.0",
  lastReviewed:"2026-10-01",
  outcomes:[
    "Understand common decision points and pressures faced between approximately 14 and 22.",
    "Identify personal values, strengths, interests, responsibilities and areas for growth.",
    "Use a repeatable decision framework instead of acting only from emotion or peer pressure.",
    "Recognize warning signs in harmful peer influence, unsafe relationships, scams and risky activities.",
    "Build healthier study, skill, digital, money and daily-life habits.",
    "Evaluate education and career opportunities using evidence instead of promises alone.",
    "Create a trusted-support network and an emergency decision plan.",
    "Complete a one-year personal roadmap and a practical personal direction charter."
  ],
  modules:[
    makeModule("d1422-self","Know Yourself & Build Your Direction","अपने आप को समझें और अपनी दिशा बनाएं","Understand identity, values, strengths, interests and what a healthy direction looks like.",DIRECTION_14_22_LESSONS.slice(0,3)),
    makeModule("d1422-decisions","Decision-Making & Independent Thinking","निर्णय लेना और स्वतंत्र सोच","Learn structured decision-making, evidence, peer pressure and critical thinking.",DIRECTION_14_22_LESSONS.slice(3,6)),
    makeModule("d1422-relationships","Friends, Family, Relationships & Boundaries","दोस्त, परिवार, संबंध और सीमाएं","Build respectful relationships, communication skills, boundaries and support systems.",DIRECTION_14_22_LESSONS.slice(6,9)),
    makeModule("d1422-digital","Digital Life, Safety & Reputation","डिजिटल जीवन, सुरक्षा और पहचान","Understand social media, algorithms, scams, privacy and digital reputation.",DIRECTION_14_22_LESSONS.slice(9,11)),
    makeModule("d1422-study-career","Study, Skills, Career & Money","पढ़ाई, कौशल, करियर और पैसा","Turn confusion into practical education, skill, career and financial experiments.",DIRECTION_14_22_LESSONS.slice(11,14)),
    makeModule("d1422-habits","Habits, Well-being & Setbacks","आदतें, wellbeing और असफलताओं से सीखना","Build routines, protect everyday wellbeing and convert mistakes into learning.",DIRECTION_14_22_LESSONS.slice(14,17)),
    makeModule("d1422-risk","Risk, Safety, Law & Real-World Choices","जोखिम, सुरक्षा, कानून और वास्तविक जीवन के निर्णय","Recognize unsafe situations, risky activities, false promises and how to exit safely.",DIRECTION_14_22_LESSONS.slice(17,21)),
    makeModule("d1422-roadmap","Personal Roadmap & Life Direction Charter","व्यक्तिगत रोडमैप और जीवन-दिशा पत्र","Create a one-year roadmap, emergency plan and personal rules for the next stage of life.",DIRECTION_14_22_LESSONS.slice(21))
  ]
};

const DIRECTION_14_22_ASSESSMENTS = {};
DIRECTION_14_22_COURSE.modules.forEach((m) => {
  DIRECTION_14_22_ASSESSMENTS[m.id] = makeQuestions([
    ["बड़ा निर्णय लेते समय पहला उपयोगी कदम क्या है?",["समस्या को स्पष्ट करना","तुरंत फैसला करना","दोस्तों की नकल करना","केवल social media poll देखना"],0],
    ["Peer pressure में सही प्रतिक्रिया क्या हो सकती है?",["अपनी सीमा स्पष्ट करना और जरूरत पर safe exit लेना","सिर्फ group को खुश करना","जोखिम को ignore करना","अपनी values छोड़ देना"],0],
    ["Career course चुनते समय क्या verify करना चाहिए?",["Provider, eligibility, curriculum, cost और evidence","केवल advertisement","केवल certificate design","केवल दोस्त की राय"],0],
    ["Online financial scam में क्या करना चाहिए?",["रुकें और official channel से verify करें","OTP/PIN बताएं","जल्दी payment करें","screen share करें"],0],
    ["Healthy relationship में क्या जरूरी है?",["Respect, consent, trust और boundaries","Control और threats","Password मांगना","Isolation"],0],
    ["गलती के बाद constructive approach क्या है?",["क्या हुआ समझकर specific change test करना","खुद को हमेशा failure मानना","कुछ न बदलना","सिर्फ blame करना"],0]
  ]);
});
DIRECTION_14_22_ASSESSMENTS.final = makeQuestions([
  ["14–22 की उम्र में दिशा बनाने का practical अर्थ क्या है?",["Values, skills, habits और responsible decisions को धीरे-धीरे मजबूत करना","एक ही दिन में पूरा career तय करना","हर trend follow करना","केवल ज्यादा पैसा कमाना"],0],
  ["Decision framework में evidence क्यों जरूरी है?",["क्योंकि assumptions और facts अलग हो सकते हैं","क्योंकि friends हमेशा गलत होते हैं","क्योंकि decision कभी uncertain नहीं होना चाहिए","क्योंकि emotion हमेशा बेकार है"],0],
  ["Peer pressure का warning sign क्या हो सकता है?",["'सब कर रहे हैं' कहकर safety या values के खिलाफ दबाव","सम्मानपूर्वक सलाह","स्वतंत्र विकल्प देना","सवाल पूछने देना"],0],
  ["Healthy boundary का उदाहरण क्या है?",["'मैं यह personal information share नहीं करना चाहता/चाहती'","'अगर दोस्त हो तो password दो'","'तुम्हें हर समय location share करनी होगी'","'ना कहने की अनुमति नहीं'"],0],
  ["Career decision में किससे बचना चाहिए?",["Guaranteed job/income जैसे unverified promises","Written terms","Course syllabus","Eligibility check"],0],
  ["Digital safety में कौन-सा नियम सही है?",["OTP/PIN secret रखें और suspicious requests verify करें","OTP caller को बताएं","Unknown link खोलें","Public post में personal documents डालें"],0],
  ["Financial maturity का शुरुआती संकेत क्या है?",["Needs, wants, goals और spending को समझना","दिखावे के लिए खर्च करना","Quick-money schemes","दोस्तों से खर्च की तुलना"],0],
  ["Failure के बाद useful response क्या है?",["Feedback लेकर अगला specific experiment करना","पूरी identity तय कर लेना","हर बार दूसरों को blame करना","कुछ न सीखना"],0],
  ["Critical thinking का अर्थ क्या है?",["Evidence, source, date और context देखकर belief update करना","हर बात को झूठ मानना","केवल अपनी पसंद की बात मानना","पहला search result मान लेना"],0],
  ["Unsafe situation में priority क्या है?",["Immediate safety और trusted/appropriate support","Video बनाना","अकेले confrontation","शर्म के कारण छिपाना"],0],
  ["Personal roadmap में क्या होना चाहिए?",["Goal, timeline, next actions और evidence of progress","केवल motivational quote","केवल final result","दूसरों की copied plan"],0],
  ["My Direction Charter किस काम आएगी?",["नए अवसरों और दबावों के बीच अपने values और goals के अनुसार निर्णय लेने में","दूसरों को control करने में","हर risk को खत्म करने में","career की guarantee देने में"],0]
]);
\nconst MOBILE_BALANCE_COURSE = {
  id:"mobile-use-digital-balance-smart-life",
  title:{en:"Mobile Use, Digital Balance & Smart Life",hi:"मोबाइल उपयोग, डिजिटल संतुलन एवं स्मार्ट जीवन"},
  category:"Digital Skills / डिजिटल कौशल",
  type:"certificate",
  level:"foundation",
  description:"A practical course for people who spend a large part of daily life on a mobile phone: understand the benefits and risks, measure use, build healthy routines, protect privacy and money, support children and family, and use the phone for learning, work and opportunity.",
  audience:"Students, parents, workers, young people, older adults, volunteers and community learners who want a practical relationship with their mobile phone.",
  prerequisites:["No technical prerequisite.","Learners should have access to a smartphone or can follow the exercises with a family member's device."],
  learningHours:20,
  version:"1.0",
  lastReviewed:"2026-10-01",
  outcomes:[
    "Understand why modern mobile use can become frequent and how to regain intentional control.",
    "Identify useful mobile activities and distinguish them from unnecessary or harmful patterns.",
    "Measure screen time by purpose, timing and consequences rather than relying on one number.",
    "Create practical routines for sleep, study, work, family time and entertainment.",
    "Improve privacy, scam, OTP, UPI, account and lost-phone safety.",
    "Use mobile phones more effectively for learning, work, accessibility and AI-assisted tasks.",
    "Create and test a personal 7-day Digital Balance Plan."
  ],
  modules:[
    makeModule("balance-foundation","Mobile Life: Benefits, Risks & Habits","मोबाइल जीवन: फायदे, नुकसान एवं आदतें","Understand why mobile phones are useful, why they can consume attention, and how to observe your own pattern.",MOBILE_BALANCE_LESSONS.slice(0,8)),
    makeModule("balance-time","Time, Attention, Sleep & Study","समय, ध्यान, नींद एवं पढ़ाई","Learn practical ways to manage notifications, social media, entertainment, sleep and study.",MOBILE_BALANCE_LESSONS.slice(8,12)),
    makeModule("balance-family","Work, Family, Children & Privacy","काम, परिवार, बच्चे एवं गोपनीयता","Build healthier family use, age-appropriate child guidance, work boundaries and everyday privacy habits.",MOBILE_BALANCE_LESSONS.slice(12,17)),
    makeModule("balance-safety","Scams, Money, Lost Phone & AI","Scam, पैसा, खोया फोन एवं AI","Practise financial safety, account protection, recovery preparation and responsible AI use.",MOBILE_BALANCE_LESSONS.slice(17,21)),
    makeModule("balance-growth","Learning, Work & Digital Balance Plan","सीखना, काम एवं डिजिटल संतुलन योजना","Turn the phone into a useful learning and work tool and complete a personal 7-day balance plan.",MOBILE_BALANCE_LESSONS.slice(21))
  ]
};

const MOBILE_BALANCE_ASSESSMENTS = {};
MOBILE_BALANCE_COURSE.modules.forEach((m) => {
  MOBILE_BALANCE_ASSESSMENTS[m.id] = makeQuestions([
    ["मोबाइल उपयोग का balanced approach क्या है?",["Purpose, timing, effect और personal needs देखकर use करना","हर समय phone बंद रखना","हर notification तुरंत देखना","सिर्फ entertainment"],0],
    ["Screen-time number को कैसे समझना चाहिए?",["Context और purpose के साथ","Universal rule की तरह","केवल दूसरों से तुलना करके","Ignore करके"],0],
    ["Suspicious financial request पर क्या करें?",["रुकें और official source से verify करें","OTP दें","जल्दी payment करें","Screen share करें"],0],
    ["Healthy digital routine में क्या शामिल हो सकता है?",["Sleep, focused work/study, family time और intentional entertainment","रातभर scrolling","हर meal में phone","हर notification का तुरंत जवाब"],0],
    ["AI output के साथ क्या करना चाहिए?",["Important information verify करें और sensitive data protect करें","हमेशा सही मानें","Passwords upload करें","बिना पढ़े forward करें"],0],
    ["Children के digital use में क्या जरूरी है?",["Age-appropriate guidance, privacy और trusted conversation","केवल punishment","Unlimited access","Public sharing"],0]
  ]);
});
MOBILE_BALANCE_ASSESSMENTS.final = makeQuestions([
  ["मोबाइल फोन का सबसे अच्छा उपयोग कैसे तय करें?",["Purpose, benefit, risk, timing और consequences देखकर","केवल hours देखकर","Advertisement देखकर","दूसरों की आदत देखकर"],0],
  ["क्या हर व्यक्ति के लिए एक ही screen-time limit सही है?",["नहीं; context और individual needs अलग होती हैं","हाँ, हमेशा","केवल students के लिए","केवल adults के लिए"],0],
  ["Notification management का उद्देश्य क्या है?",["अनावश्यक interruptions कम करना","सभी alerts बढ़ाना","हर message को urgent बनाना","Phone को slow करना"],0],
  ["Sleep के लिए practical habit क्या है?",["Consistent wind-down और late-night stimulation कम करना","बिस्तर में scrolling बढ़ाना","हर रात gaming करना","Notifications हमेशा loud रखना"],0],
  ["Study के दौरान mobile का अच्छा उपयोग क्या है?",["Focused learning और relevant tools","हर कुछ मिनट में social media","Random notifications खोलना","Entertainment switching"],0],
  ["Social media के balanced use में क्या मदद करता है?",["Purpose before opening और intentional breaks","Infinite scrolling","हर trend follow करना","हर post पर तुरंत प्रतिक्रिया"],0],
  ["Family digital balance में क्या जरूरी है?",["Clear, discussed and practical rules","केवल punishment","Secret rules","No conversation"],0],
  ["Privacy के लिए कौन सा principle उपयोगी है?",["Minimum necessary access और thoughtful sharing","हर permission allow करना","Location हमेशा public करना","Passwords share करना"],0],
  ["OTP/PIN के बारे में सही नियम क्या है?",["Secret रखें और किसी caller को न बताएं","Customer care को बताएं","Friend को बताएं","Message में भेजें"],0],
  ["Lost phone की तैयारी में क्या उपयोगी है?",["Screen lock, recovery options, backup और device protection","कोई preparation नहीं","Passwords public करना","Unknown links खोलना"],0],
  ["AI का responsible use क्या है?",["Useful assistance + privacy + verification + human judgement","AI को हमेशा सही मानना","Sensitive data freely upload करना","हर output forward करना"],0],
  ["Mobile से learning का अच्छा model क्या है?",["Learn → Practise → Check → Apply","Watch → Forget","Scroll → Scroll","Download → Never practise"],0],
  ["Digital balance plan कैसे बनाना चाहिए?",["Observe → choose a few changes → measure → adjust","एक दिन में कठोर सारे rules","बिना measurement","दूसरों की routine copy करके"],0],
  ["Mobile use का नुकसान समझते समय क्या देखें?",["Duration, timing, purpose, content and what it replaces","केवल phone model","केवल battery","केवल number of apps"],0],
  ["Healthy entertainment का संकेत क्या है?",["It fits within sleep, work/study, relationships and responsibilities","It replaces sleep","It has no stopping point","It continues whenever a notification appears"],0]
]);

const FLAGSHIP_COURSES = {
  [MOBILE_PHONE_COURSE.id]: MOBILE_PHONE_COURSE,
  [MOBILE_BALANCE_COURSE.id]: MOBILE_BALANCE_COURSE
};

const FLAGSHIP_COURSE_ASSESSMENTS = {
  [MOBILE_BALANCE_COURSE.id]: MOBILE_BALANCE_ASSESSMENTS
};

MOBILE_PHONE_COURSE.modules.forEach((m) => {
  FLAGSHIP_COURSE_ASSESSMENTS[m.id] = makeQuestions([
    ["इस module में सुरक्षित learning का मुख्य उद्देश्य क्या है?",["समझ + practice + responsible use","केवल title याद करना","हर app install करना","हर message forward करना"],0],
    ["किसी mobile feature को अपनाने से पहले क्या देखना चाहिए?",["Need, benefit, risk and evidence","केवल popularity","केवल advertisement","केवल price"],0],
    ["Personal data के बारे में सही approach क्या है?",["Purpose और access समझकर minimum necessary sharing","हर जगह public sharing","OTP share करना","Unknown links खोलना"],0],
    ["Suspicious message पर पहला कदम क्या होना चाहिए?",["रुकें और official source से verify करें","तुरंत payment करें","link खोलें","OTP भेजें"],0],
    ["Children के online safety में क्या जरूरी है?",["Age-appropriate guidance, privacy, safety and open conversation","केवल punishment","केवल phone छीन लेना","सिर्फ screen-time number"],0],
    ["Backup का सही अर्थ क्या है?",["Important data की अलग सुरक्षित copy जिसे restore किया जा सके","Phone में file होना","Screenshot लेना ही पर्याप्त होना","Message forward करना"],0],
    ["Mobile wellbeing में क्या महत्वपूर्ण है?",["Intentional use, healthy routines, content and context","हर notification तुरंत देखना","पूरी रात scrolling","हर app को notification देना"],0],
    ["Digital citizenship का अच्छा उदाहरण क्या है?",["Respectful, lawful, informed and safe participation","Private photo बिना consent share करना","Rumour forward करना","Fake account से harassment"],0]
  ]);
});

FLAGSHIP_COURSE_ASSESSMENTS.final = makeQuestions([
  ["Modern smartphone को सबसे सही तरीके से कैसे समझेंगे?",["Portable computing, communication and service platform","केवल calling machine","केवल camera","केवल gaming device"],0],
  ["OTP/PIN के बारे में सही rule क्या है?",["इसे secret रखें और किसी व्यक्ति को न बताएं","Customer care को बताएं","Friend को बताएं","Social media पर लिखें"],0],
  ["Suspicious payment request मिलने पर क्या करें?",["Transaction रोककर official channel से verify करें","जल्दी payment करें","screen share करें","OTP दें"],0],
  ["App permission का अच्छा principle क्या है?",["Purpose के अनुसार minimum necessary access","हर permission allow","Contacts हमेशा allow","Location हमेशा allow"],0],
  ["Photo share करने से पहले क्या देखना चाहिए?",["Audience, consent, location/context और sensitive details","केवल photo quality","केवल likes","केवल filter"],0],
  ["Information verification में क्या जरूरी है?",["Source, date, evidence और credible cross-check","Forward count","पहला search result","Anonymous comment"],0],
  ["Lost phone में प्राथमिकता क्या हो सकती है?",["Personal safety और accounts/device protection","Unknown caller को OTP देना","हर password public करना","Suspicious link खोलना"],0],
  ["Children के digital safety approach में क्या शामिल है?",["Privacy, age-appropriate guidance, safety tools and trusted conversation","केवल punishment","हर app public","Passwords share करना"],0],
  ["AI mobile feature के output को कैसे देखें?",["Useful assistance, but verify important claims and protect sensitive data","Always correct","Never verify","Private documents freely upload"],0],
  ["Healthy phone habit का उदाहरण क्या है?",["Intentional use, notification control and balanced routines","हर notification तुरंत खोलना","सोते समय लगातार scrolling","हर task के बीच social media check"],0],
  ["Digital inclusion में क्या शामिल है?",["Access, affordability, skills, language, accessibility and safety","केवल expensive phone","केवल fast internet","केवल app count"],0],
  ["Professional mobile work में क्या जरूरी है?",["Accurate communication, file organisation, privacy and verification","Unknown links","Sensitive public links","Unverified job offers"],0],
  ["Misinformation मिलने पर क्या करें?",["Verify before sharing and use reliable sources","Forward immediately","Edit screenshot and share","Hide source"],0],
  ["Children की photo sharing में क्या सोचें?",["Privacy, dignity, consent/context and long-term footprint","Only likes","Public by default","No need to think"],0],
  ["Battery safety में क्या जरूरी है?",["Reliable accessories, reasonable temperature and attention to damage/heat","Damaged cable use","Extreme heat ignore","Phone under unsafe conditions"],0],
  ["Accessibility features क्यों महत्वपूर्ण हैं?",["They can make phones more usable for diverse needs","Only for one group","Only for gaming","They reduce all privacy automatically"],0],
  ["Digital footprint का अर्थ क्या है?",["Online actions and information can persist, spread or be copied","Only phone storage","Battery history","SIM balance"],0],
  ["Family digital rules का अच्छा तरीका क्या है?",["Clear, age-appropriate, discussed and revisable rules","Secret rules","Only punishment","No emergency access"],0],
  ["New technology को अपनाने का balanced तरीका क्या है?",["Evaluate need, benefit, risk, evidence and alternatives","Use everything immediately","Reject everything automatically","Follow advertisements only"],0],
  ["Course mastery का सही संकेत क्या है?",["Understand, practise, apply, assess and reflect","Only open pages","Only watch videos","Only receive a certificate"],0]
]);

export { FLAGSHIP_COURSES, FLAGSHIP_COURSE_ASSESSMENTS, MOBILE_PHONE_COURSE, MOBILE_BALANCE_COURSE, DIRECTION_14_22_COURSE };
