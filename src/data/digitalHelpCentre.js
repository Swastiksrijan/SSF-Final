// SSF Free Digital Help Centre — service registry (bilingual, data-driven).
// Adding a service = add one { en, hi } row to a category's `services` array.
// Detail pages inherit category-level `who / help / docs / process` so the UI
// never needs a bespoke component per service.

export const HELP_FILTERS = [
  { id: "all", en: "All Services", hi: "सभी सेवाएँ" },
  { id: "ngo", en: "NGO", hi: "संस्था" },
  { id: "education", en: "Education", hi: "शिक्षा" },
  { id: "career", en: "Career", hi: "करियर" },
  { id: "government", en: "Government", hi: "सरकारी" },
  { id: "documents", en: "Documents", hi: "दस्तावेज़" },
  { id: "agriculture", en: "Agriculture", hi: "कृषि" },
  { id: "women-family", en: "Women & Family", hi: "महिला एवं परिवार" },
  { id: "digital-skills", en: "Digital Skills", hi: "डिजिटल कौशल" },
  { id: "cyber-safety", en: "Cyber Safety", hi: "साइबर सुरक्षा" },
  { id: "research", en: "Research", hi: "शोध" },
  { id: "other", en: "Other", hi: "अन्य" }
];

export const HELP_CATEGORIES = [
  {
    id: "ngo-support",
    en: "NGO & Institution Support",
    hi: "एनजीओ एवं संस्था सहायता",
    icon: "ngo",
    filter: "ngo",
    blurbEn: "Guidance for registering, documenting and running a non-profit or community organisation.",
    blurbHi: "गैर-लाभकारी या सामुदायिक संस्था के पंजीकरण, दस्तावेज़ीकरण और संचालन के लिए मार्गदर्शन।",
    whoEn: "New and existing non-profits, trusts, societies, community organisations and social groups.",
    whoHi: "नई एवं मौजूदा गैर-लाभकारी संस्थाएँ, ट्रस्ट, समितियाँ, सामुदायिक संगठन और सामाजिक समूह।",
    helpEn: "SSF explains processes, prepares checklists, helps organise information and helps you understand official requirements. Final registration/approval rests with the concerned authority.",
    helpHi: "एसएसएफ प्रक्रियाएँ समझाता है, चेकलिस्ट तैयार करता है और आधिकारिक आवश्यकताएँ समझने में सहायता करता है। अंतिम पंजीकरण/स्वीकृति संबंधित प्राधिकरण के पास रहती है।",
    docsEn: ["Aadhaar / ID of office bearers", "Address proof", "Number of members / founding details", "Objectives of the organisation", "Any existing registration papers (if any)"],
    docsHi: ["पदाधिकारियों का आधार / पहचान पत्र", "पते का प्रमाण", "सदस्यों की संख्या / स्थापना विवरण", "संस्था के उद्देश्य", "कोई मौजूदा पंजीकरण दस्तावेज़ (यदि हो)"]
  },
  {
    id: "government-services",
    en: "Government Schemes & Online Services",
    hi: "सरकारी योजनाएँ एवं ऑनलाइन सेवाएँ",
    icon: "government",
    filter: "government",
    blurbEn: "Understand schemes, eligibility and how to navigate official government portals correctly.",
    blurbHi: "योजनाएँ, पात्रता और आधिकारिक सरकारी पोर्टलों को सही ढंग से समझने में सहायता।",
    whoEn: "Any citizen trying to use a government scheme or online government service.",
    whoHi: "कोई भी नागरिक जो सरकारी योजना या ऑनलाइन सरकारी सेवा का उपयोग करना चाहता है।",
    helpEn: "SSF shares information, explains eligibility, shows the correct official website and guides you through the application process. Benefits and approval depend solely on the concerned department.",
    helpHi: "एसएसएफ जानकारी देता है, पात्रता समझाता है, सही आधिकारिक वेबसाइट दिखाता है और आवेदन प्रक्रिया में मार्गदर्शन करता है। लाभ एवं स्वीकृति पूर्णतः संबंधित विभाग पर निर्भर है।",
    docsEn: ["Aadhaar / identity proof", "Address proof", "Income / caste / relevant certificate (as applicable)", "Bank account details", "Passport-size photograph"],
    docsHi: ["आधार / पहचान प्रमाण", "पते का प्रमाण", "आय / जाति / संबंधित प्रमाणपत्र (यथानुसार)", "बैंक खाता विवरण", "पासपोर्ट आकार का फोटो"]
  },
  {
    id: "student-education",
    en: "Student & Education Help",
    hi: "विद्यार्थी एवं शिक्षा सहायता",
    icon: "education",
    filter: "education",
    blurbEn: "Support for scholarships, admissions, exam forms, projects and study resources.",
    blurbHi: "छात्रवृत्ति, प्रवेश, परीक्षा फॉर्म, प्रोजेक्ट एवं अध्ययन संसाधनों के लिए सहायता।",
    whoEn: "School students, college students, competitive-exam aspirants and parents.",
    whoHi: "स्कूल एवं कॉलेज विद्यार्थी, प्रतियोगी परीक्षा के अभ्यर्थी और अभिभावक।",
    helpEn: "SSF helps you find the right scholarship or exam, prepare documents and understand online education portals. Selection remains with the school, board or authority.",
    helpHi: "एसएसएफ सही छात्रवृत्ति या परीक्षा खोजने, दस्तावेज़ तैयार करने और ऑनलाइन शिक्षा पोर्टल समझने में सहायता करता है। चयन स्कूल, बोर्ड या प्राधिकरण के पास रहता है।",
    docsEn: ["Student ID / marksheet", "Aadhaar", "Income certificate (for scholarships)", "Bank account details", "Passport-size photograph"],
    docsHi: ["विद्यार्थी पहचान पत्र / अंकतालिका", "आधार", "आय प्रमाणपत्र (छात्रवृत्ति हेतु)", "बैंक खाता विवरण", "पासपोर्ट आकार का फोटो"]
  },
  {
    id: "job-career",
    en: "Job & Career Help",
    hi: "नौकरी एवं करियर सहायता",
    icon: "career",
    filter: "career",
    blurbEn: "Find openings, prepare applications and improve your professional profile.",
    blurbHi: "अवसर खोजें, आवेदन तैयार करें और अपनी पेशेवर प्रोफ़ाइल बेहतर बनाएँ।",
    whoEn: "Freshers, experienced job seekers, students and anyone exploring a career path.",
    whoHi: "नए एवं अनुभवी नौकरी तलाशने वाले, विद्यार्थी और करियर विकल्प खोजने वाले लोग।",
    helpEn: "SSF guides you on job portals, application formats, resumes and interview preparation. Employment is decided by the employer, not by SSF.",
    helpHi: "एसएसएफ जॉब पोर्टल, आवेदन प्रारूप, रिज्यूमे और साक्षात्कार तैयारी में मार्गदर्शन करता है। रोज़गार का निर्णय नियोक्ता करता है, एसएसएफ नहीं।",
    docsEn: ["Resume / CV", "Educational certificates", "Identity proof", "Experience letters (if any)", "Passport-size photograph"],
    docsHi: ["रिज्यूमे / सीवी", "शैक्षणिक प्रमाणपत्र", "पहचान प्रमाण", "अनुभव पत्र (यदि हों)", "पासपोर्ट आकार का फोटो"]
  },
  {
    id: "resume-documents",
    en: "Resume & Professional Documents",
    hi: "रिज्यूमे एवं पेशेवर दस्तावेज़",
    icon: "documents",
    filter: "documents",
    blurbEn: "Professionally structured resumes, CVs, cover letters and application documents.",
    blurbHi: "पेशेवर रूप से तैयार रिज्यूमे, सीवी, कवर लेटर और आवेदन दस्तावेज़।",
    whoEn: "Job seekers, students and professionals who need clear, well-formatted documents.",
    whoHi: "नौकरी तलाशने वाले, विद्यार्थी और पेशेवर जिन्हें स्पष्ट, सुव्यवस्थित दस्तावेज़ चाहिए।",
    helpEn: "SSF helps you structure and format your resume or document based on the information you provide. Accuracy of information is your responsibility.",
    helpHi: "एसएसएफ आपकी दी गई जानकारी के आधार पर रिज्यूमे या दस्तावेज़ को व्यवस्थित एवं प्रारूपित करने में सहायता करता है। जानकारी की सत्यता आपकी जिम्मेदारी है।",
    docsEn: ["Your education details", "Work / experience details", "Skills list", "Contact details", "Any existing resume (if any)"],
    docsHi: ["आपकी शिक्षा का विवरण", "कार्य / अनुभव का विवरण", "कौशल सूची", "संपर्क विवरण", "कोई मौजूदा रिज्यूमे (यदि हो)"]
  },
  {
    id: "project-proposal",
    en: "Project Report & Proposal",
    hi: "परियोजना रिपोर्ट एवं प्रस्ताव",
    icon: "research",
    filter: "research",
    blurbEn: "Structured project reports, concept notes and proposals for institutions, CSR and grants.",
    blurbHi: "संस्थाओं, सीएसआर एवं अनुदान हेतु व्यवस्थित परियोजना रिपोर्ट, कॉन्सेप्ट नोट एवं प्रस्ताव।",
    whoEn: "NGOs, students, community organisations and institutions preparing a project document.",
    whoHi: "एनजीओ, विद्यार्थी, सामुदायिक संस्थाएँ और परियोजना दस्तावेज़ तैयार करने वाली संस्थाएँ।",
    helpEn: "SSF helps organise the structure, sections and formatting of your proposal. Facts, figures and outcomes must come from you — SSF never invents data.",
    helpHi: "एसएसएफ आपके प्रस्ताव की संरचना, अनुभाग और प्रारूप व्यवस्थित करने में सहायता करता है। तथ्य, आँकड़े एवं परिणाम आपसे ही आने चाहिए — एसएसएफ कोई डेटा नहीं गढ़ता।",
    docsEn: ["Project idea / objective", "Target area and beneficiaries (real)", "Activity plan", "Basic budget figures (real)", "Organisation details"],
    docsHi: ["परियोजना विचार / उद्देश्य", "लक्षित क्षेत्र एवं लाभार्थी (वास्तविक)", "गतिविधि योजना", "मूल बजट आँकड़े (वास्तविक)", "संस्था का विवरण"]
  },
  {
    id: "farmer-agriculture",
    en: "Farmer & Agriculture Help",
    hi: "किसान एवं कृषि सहायता",
    icon: "agriculture",
    filter: "agriculture",
    blurbEn: "Navigate agriculture schemes, portals and digital farming resources.",
    blurbHi: "कृषि योजनाओं, पोर्टलों एवं डिजिटल कृषि संसाधनों को समझने में सहायता।",
    whoEn: "Farmers, farming families and rural producers.",
    whoHi: "किसान, कृषि परिवार और ग्रामीण उत्पादक।",
    helpEn: "SSF shares scheme information and helps you use official agriculture portals. Technical or chemical decisions should always follow expert guidance.",
    helpHi: "एसएसएफ योजना जानकारी साझा करता है और आधिकारिक कृषि पोर्टल उपयोग करने में सहायता करता है। तकनीकी या रासायनिक निर्णय सदैव विशेषज्ञ सलाह के अनुसार लें।",
    docsEn: ["Aadhaar", "Land records / khasra (as required)", "Bank account details", "Mobile number linked to Aadhaar"],
    docsHi: ["आधार", "भूमि अभिलेख / खसरा (यथानुसार)", "बैंक खाता विवरण", "आधार से जुड़ा मोबाइल नंबर"]
  },
  {
    id: "women-family",
    en: "Women, Family & Community Help",
    hi: "महिला, परिवार एवं समुदाय सहायता",
    icon: "women",
    filter: "women-family",
    blurbEn: "Guidance on schemes and digital services for women, children and families.",
    blurbHi: "महिलाओं, बच्चों एवं परिवारों के लिए योजनाओं एवं डिजिटल सेवाओं में मार्गदर्शन।",
    whoEn: "Women, mothers, families and community members seeking support.",
    whoHi: "महिलाएँ, माताएँ, परिवार और सहायता चाहने वाले समुदाय के सदस्य।",
    helpEn: "SSF helps identify relevant schemes, prepare documents and navigate official helplines. Approval is decided by the concerned department.",
    helpHi: "एसएसएफ संबंधित योजनाएँ पहचानने, दस्तावेज़ तैयार करने और आधिकारिक हेल्पलाइन उपयोग करने में सहायता करता है। स्वीकृति संबंधित विभाग द्वारा दी जाती है।",
    docsEn: ["Aadhaar", "Bank account details", "Relevant certificates (income / caste / domicile)", "Passport-size photograph"],
    docsHi: ["आधार", "बैंक खाता विवरण", "संबंधित प्रमाणपत्र (आय / जाति / निवास)", "पासपोर्ट आकार का फोटो"]
  },
  {
    id: "senior-citizen",
    en: "Senior Citizen Digital Help",
    hi: "वरिष्ठ नागरिक डिजिटल सहायता",
    icon: "senior",
    filter: "digital-skills",
    blurbEn: "Patient, step-by-step help for seniors using online services and smartphones.",
    blurbHi: "ऑनलाइन सेवाओं एवं स्मार्टफोन उपयोग हेतु वरिष्ठ नागरिकों के लिए चरण-दर-चरण सहायता।",
    whoEn: "Senior citizens and anyone who finds digital services difficult.",
    whoHi: "वरिष्ठ नागरिक और वे लोग जिन्हें डिजिटल सेवाएँ कठिन लगती हैं।",
    helpEn: "SSF explains forms, portals and digital payments slowly and clearly, and shares cyber-safety basics. Never share OTP, PIN or passwords with anyone.",
    helpHi: "एसएसएफ फॉर्म, पोर्टल एवं डिजिटल भुगतान को धीरे-धीरे एवं स्पष्ट रूप से समझाता है तथा साइबर-सुरक्षा की बुनियादी बातें बताता है। ओटीपी, पिन या पासवर्ड कभी किसी से साझा न करें।",
    docsEn: ["Aadhaar / identity proof", "Mobile number", "Bank / pension details (as applicable)", "Passport-size photograph"],
    docsHi: ["आधार / पहचान प्रमाण", "मोबाइल नंबर", "बैंक / पेंशन विवरण (यथानुसार)", "पासपोर्ट आकार का फोटो"]
  },
  {
    id: "documents-forms",
    en: "Documents & Online Forms",
    hi: "दस्तावेज़ एवं ऑनलाइन फॉर्म सहायता",
    icon: "forms",
    filter: "documents",
    blurbEn: "Fill forms correctly, prepare files and handle PDFs and scans with confidence.",
    blurbHi: "फॉर्म सही भरें, फाइलें तैयार करें और पीडीएफ एवं स्कैन आत्मविश्वास से संभालें।",
    whoEn: "Anyone who needs help filling an online form or organising digital documents.",
    whoHi: "कोई भी व्यक्ति जिसे ऑनलाइन फॉर्म भरने या डिजिटल दस्तावेज़ व्यवस्थित करने में सहायता चाहिए।",
    helpEn: "SSF guides you on how to fill, upload and organise documents correctly. Never share passwords, OTPs, PINs, CVV or authentication codes.",
    helpHi: "एसएसएफ दस्तावेज़ सही ढंग से भरने, अपलोड करने एवं व्यवस्थित करने में मार्गदर्शन करता है। पासवर्ड, ओटीपी, पिन, सीवीवी या ऑथेंटिकेशन कोड कभी साझा न करें।",
    docsEn: ["The document to be filled / uploaded", "Scanned copy (clear photo)", "Photo and signature (as required)", "Aadhaar / identity proof"],
    docsHi: ["भरा / अपलोड किया जाने वाला दस्तावेज़", "स्कैन की गई स्पष्ट प्रति", "फोटो एवं हस्ताक्षर (यथानुसार)", "आधार / पहचान प्रमाण"]
  },
  {
    id: "digital-literacy",
    en: "Digital Literacy",
    hi: "डिजिटल साक्षरता",
    icon: "digital",
    filter: "digital-skills",
    blurbEn: "Learn smartphone, internet, email and computer basics from the beginning.",
    blurbHi: "स्मार्टफोन, इंटरनेट, ईमेल एवं कंप्यूटर की बुनियादी बातें शुरू से सीखें।",
    whoEn: "First-time internet users, beginners and anyone building digital confidence.",
    whoHi: "पहली बार इंटरनेट उपयोग करने वाले, शुरुआती और डिजिटल आत्मविश्वास बढ़ाने वाले लोग।",
    helpEn: "SSF explains digital basics in simple language with practical examples. Learning is guided; regular practice at home builds confidence.",
    helpHi: "एसएसएफ डिजिटल बुनियादी बातें सरल भाषा एवं व्यावहारिक उदाहरणों के साथ समझाता है। मार्गदर्शन दिया जाता है; नियमित अभ्यास से आत्मविश्वास बढ़ता है।",
    docsEn: ["A smartphone or computer (if available)", "Mobile number", "Willingness to practise"],
    docsHi: ["स्मार्टफोन या कंप्यूटर (यदि उपलब्ध हो)", "मोबाइल नंबर", "सीखने की इच्छा"]
  },
  {
    id: "cyber-safety",
    en: "Cyber Safety",
    hi: "साइबर सुरक्षा जागरूकता",
    icon: "cyber",
    filter: "cyber-safety",
    blurbEn: "Recognise scams, protect accounts and use digital payments safely.",
    blurbHi: "ठगी पहचानें, खातों की सुरक्षा करें और डिजिटल भुगतान सुरक्षित रूप से करें।",
    whoEn: "Every internet and smartphone user, especially first-time digital payment users.",
    whoHi: "प्रत्येक इंटरनेट एवं स्मार्टफोन उपयोगकर्ता, विशेषकर पहली बार डिजिटल भुगतान करने वाले।",
    helpEn: "SSF shares awareness about phishing, fake websites and account safety, and helps you find official complaint resources. SSF never asks for OTP, PIN, CVV or passwords.",
    helpHi: "एसएसएफ फिशिंग, फर्जी वेबसाइट एवं खाता सुरक्षा के बारे में जागरूकता साझा करता है तथा आधिकारिक शिकायत संसाधन खोजने में सहायता करता है। एसएसएफ कभी ओटीपी, पिन, सीवीवी या पासवर्ड नहीं माँगता।",
    docsEn: ["No sensitive credentials required", "Details of the suspicious message/site (if reporting)"],
    docsHi: ["कोई संवेदनशील जानकारी आवश्यक नहीं", "संदिग्ध संदेश/साइट का विवरण (शिकायत हेतु)"]
  },
  {
    id: "email-communication",
    en: "Email, Letter & Communication",
    hi: "ईमेल, पत्र एवं संचार सहायता",
    icon: "email",
    filter: "documents",
    blurbEn: "Draft clear official emails, applications and letters in Hindi or English.",
    blurbHi: "हिंदी या अंग्रेज़ी में स्पष्ट आधिकारिक ईमेल, आवेदन एवं पत्र तैयार करें।",
    whoEn: "Students, job seekers, organisations and citizens writing to an office or authority.",
    whoHi: "विद्यार्थी, नौकरी तलाशने वाले, संस्थाएँ और किसी कार्यालय या प्राधिकरण को लिखने वाले नागरिक।",
    helpEn: "SSF helps you draft and format the communication based on your requirement. You should read and verify before sending.",
    helpHi: "एसएसएफ आपकी आवश्यकता के अनुसार संचार तैयार एवं प्रारूपित करने में सहायता करता है। भेजने से पहले स्वयं पढ़कर सत्यापित करें।",
    docsEn: ["Purpose of the letter/email", "Recipient / department name", "Your details", "Supporting facts (if any)"],
    docsHi: ["पत्र/ईमेल का उद्देश्य", "प्राप्तकर्ता / विभाग का नाम", "आपका विवरण", "सहायक तथ्य (यदि हों)"]
  },
  {
    id: "learning-research",
    en: "Learning & Research",
    hi: "अध्ययन एवं शोध सहायता",
    icon: "research",
    filter: "research",
    blurbEn: "Plan studies, find reliable sources and organise notes and reports.",
    blurbHi: "अध्ययन योजना बनाएँ, विश्वसनीय स्रोत खोजें और नोट्स एवं रिपोर्ट व्यवस्थित करें।",
    whoEn: "Students, researchers, teachers and lifelong learners.",
    whoHi: "विद्यार्थी, शोधकर्ता, शिक्षक और आजीवन शिक्षार्थी।",
    helpEn: "SSF helps you find information sources and structure your study or report. Academic outcomes depend on your own work.",
    helpHi: "एसएसएफ सूचना स्रोत खोजने और अध्ययन या रिपोर्ट की संरचना बनाने में सहायता करता है। शैक्षणिक परिणाम आपके स्वयं के कार्य पर निर्भर हैं।",
    docsEn: ["Topic / subject", "Purpose (assignment, project, exam)", "Any notes already collected"],
    docsHi: ["विषय / टॉपिक", "उद्देश्य (असाइनमेंट, प्रोजेक्ट, परीक्षा)", "पहले से एकत्र नोट्स (यदि हों)"]
  },
  {
    id: "website-presence",
    en: "Website & Digital Presence",
    hi: "वेबसाइट एवं डिजिटल उपस्थिति",
    icon: "website",
    filter: "ngo",
    blurbEn: "Plan website content and a clean digital presence for your organisation.",
    blurbHi: "अपनी संस्था के लिए वेबसाइट सामग्री एवं स्वच्छ डिजिटल उपस्थिति की योजना बनाएँ।",
    whoEn: "NGOs, community organisations, small institutions and social enterprises.",
    whoHi: "एनजीओ, सामुदायिक संगठन, छोटी संस्थाएँ एवं सामाजिक उद्यम।",
    helpEn: "SSF helps organise your content, structure and profile. Hosting, domains and third-party costs remain the organisation's responsibility.",
    helpHi: "एसएसएफ आपकी सामग्री, संरचना एवं प्रोफ़ाइल व्यवस्थित करने में सहायता करता है। होस्टिंग, डोमेन एवं तृतीय-पक्ष खर्च संस्था की जिम्मेदारी रहते हैं।",
    docsEn: ["Organisation profile", "Programme details", "Contact information", "Logo and images (if available)"],
    docsHi: ["संस्था प्रोफ़ाइल", "कार्यक्रम विवरण", "संपर्क जानकारी", "लोगो एवं चित्र (यदि उपलब्ध हों)"]
  },
  {
    id: "legal-information",
    en: "Basic Legal Information",
    hi: "सामान्य कानूनी जानकारी",
    icon: "legal",
    filter: "other",
    blurbEn: "Basic information and navigation to official legal resources and grievance portals.",
    blurbHi: "आधिकारिक कानूनी संसाधनों एवं शिकायत पोर्टलों तक बुनियादी जानकारी एवं पहुँच।",
    whoEn: "Citizens looking for basic process information or the right official portal.",
    whoHi: "बुनियादी प्रक्रिया जानकारी या सही आधिकारिक पोर्टल खोजने वाले नागरिक।",
    helpEn: "SSF only provides basic information and navigation to official resources. SSF is not a law firm and does not provide legal representation.",
    helpHi: "एसएसएफ केवल बुनियादी जानकारी एवं आधिकारिक संसाधनों तक पहुँच प्रदान करता है। एसएसएफ कोई लॉ फर्म नहीं है और कानूनी प्रतिनिधित्व नहीं देता।",
    docsEn: ["Details of the issue", "Any relevant notices or documents", "Identity proof (as required by the authority)"],
    docsHi: ["मामले का विवरण", "संबंधित नोटिस या दस्तावेज़ (यदि हों)", "पहचान प्रमाण (प्राधिकरण द्वारा आवश्यकतानुसार)"]
  },
  {
    id: "health-navigation",
    en: "Health Information Navigation",
    hi: "स्वास्थ्य सूचना सहायता",
    icon: "health",
    filter: "other",
    blurbEn: "Find official health schemes, resources and appointment portals.",
    blurbHi: "आधिकारिक स्वास्थ्य योजनाएँ, संसाधन एवं अपॉइंटमेंट पोर्टल खोजें।",
    whoEn: "Citizens looking for official health information or a health service portal.",
    whoHi: "आधिकारिक स्वास्थ्य जानकारी या स्वास्थ्य सेवा पोर्टल खोजने वाले नागरिक।",
    helpEn: "SSF only helps locate official health information and portals. SSF does not diagnose, treat or replace a qualified doctor.",
    helpHi: "एसएसएफ केवल आधिकारिक स्वास्थ्य जानकारी एवं पोर्टल खोजने में सहायता करता है। एसएसएफ निदान, उपचार नहीं करता और योग्य चिकित्सक का विकल्प नहीं है।",
    docsEn: ["The health service or scheme you are looking for", "Identity proof (as required by the portal)"],
    docsHi: ["आप जिस स्वास्थ्य सेवा या योजना की तलाश में हैं", "पहचान प्रमाण (पोर्टल द्वारा आवश्यकतानुसार)"]
  },
  {
    id: "social-awareness",
    en: "Social Awareness & Community Resources",
    hi: "सामाजिक जागरूकता एवं सामुदायिक संसाधन",
    icon: "community",
    filter: "other",
    blurbEn: "Awareness material, campaign resources and public information support.",
    blurbHi: "जागरूकता सामग्री, अभियान संसाधन एवं जन-सूचना सहायता।",
    whoEn: "Community groups, volunteers, students and organisations running awareness work.",
    whoHi: "जागरूकता कार्य करने वाले सामुदायिक समूह, स्वयंसेवक, विद्यार्थी एवं संस्थाएँ।",
    helpEn: "SSF helps organise public-interest content and connect you with official helplines and resources. Content must remain factual and responsible.",
    helpHi: "एसएसएफ जनहित सामग्री व्यवस्थित करने तथा आधिकारिक हेल्पलाइन एवं संसाधनों से जोड़ने में सहायता करता है। सामग्री तथ्यात्मक एवं जिम्मेदार होनी चाहिए।",
    docsEn: ["Campaign / topic details", "Audience and language", "Any existing material (if any)"],
    docsHi: ["अभियान / विषय विवरण", "लक्षित समूह एवं भाषा", "कोई मौजूदा सामग्री (यदि हो)"]
  }
];

// ---- service rows (En/Hi) per category ------------------------------------
const SERVICE_LISTS = {
  "ngo-support": [
    ["NGO registration process guidance", "एनजीओ पंजीकरण प्रक्रिया मार्गदर्शन"],
    ["NGO Darpan / NITI Aayog guidance", "एनजीओ दर्पण / नीति आयोग मार्गदर्शन"],
    ["NGO profile preparation", "एनजीओ प्रोफ़ाइल तैयारी"],
    ["Organisation information preparation", "संस्था सूचना तैयारी"],
    ["NGO document checklist", "एनजीओ दस्तावेज़ चेकलिस्ट"],
    ["Basic compliance-document guidance", "बुनियादी अनुपालन दस्तावेज़ मार्गदर्शन"],
    ["12AB process information", "12AB प्रक्रिया जानकारी"],
    ["80G process information", "80G प्रक्रिया जानकारी"],
    ["CSR-1 process information", "सीएसआर-1 प्रक्रिया जानकारी"],
    ["PAN / TAN basic guidance", "पैन / टैन बुनियादी मार्गदर्शन"],
    ["NGO project documentation", "एनजीओ परियोजना दस्तावेज़ीकरण"],
    ["Annual report preparation guidance", "वार्षिक रिपोर्ट तैयारी मार्गदर्शन"],
    ["Meeting / document formats", "बैठक / दस्तावेज़ प्रारूप"],
    ["Policy / document templates", "नीति / दस्तावेज़ टेम्पलेट"],
    ["Proposal preparation guidance", "प्रस्ताव तैयारी मार्गदर्शन"],
    ["Donor / grant document checklist", "दानदाता / अनुदान दस्तावेज़ चेकलिस्ट"],
    ["Institutional profile preparation", "संस्थागत प्रोफ़ाइल तैयारी"],
    ["Website / content guidance", "वेबसाइट / सामग्री मार्गदर्शन"]
  ],
  "government-services": [
    ["Government scheme information", "सरकारी योजना जानकारी"],
    ["Eligibility information", "पात्रता जानकारी"],
    ["Application process guidance", "आवेदन प्रक्रिया मार्गदर्शन"],
    ["Online form guidance", "ऑनलाइन फॉर्म मार्गदर्शन"],
    ["Required-document checklist", "आवश्यक दस्तावेज़ चेकलिस्ट"],
    ["Official website identification", "आधिकारिक वेबसाइट की पहचान"],
    ["Application status navigation", "आवेदन स्थिति मार्गदर्शन"],
    ["Government portal navigation", "सरकारी पोर्टल मार्गदर्शन"],
    ["Certificate application guidance", "प्रमाणपत्र आवेदन मार्गदर्शन"],
    ["Renewal process guidance", "नवीनीकरण प्रक्रिया मार्गदर्शन"],
    ["General digital verification guidance", "सामान्य डिजिटल सत्यापन मार्गदर्शन"]
  ],
  "student-education": [
    ["Scholarship information", "छात्रवृत्ति जानकारी"],
    ["Scholarship application guidance", "छात्रवृत्ति आवेदन मार्गदर्शन"],
    ["Admission form assistance", "प्रवेश फॉर्म सहायता"],
    ["Education portal guidance", "शिक्षा पोर्टल मार्गदर्शन"],
    ["Exam form guidance", "परीक्षा फॉर्म मार्गदर्शन"],
    ["Educational document checklist", "शैक्षणिक दस्तावेज़ चेकलिस्ट"],
    ["Study resources", "अध्ययन संसाधन"],
    ["Project guidance", "प्रोजेक्ट मार्गदर्शन"],
    ["Assignment formatting", "असाइनमेंट प्रारूपण"],
    ["Presentation / PPT preparation guidance", "प्रस्तुति / पीपीटी तैयारी मार्गदर्शन"],
    ["Basic research guidance", "बुनियादी शोध मार्गदर्शन"],
    ["Learning resources", "अधिगम संसाधन"],
    ["Online learning platform guidance", "ऑनलाइन अधिगम प्लेटफॉर्म मार्गदर्शन"],
    ["Digital study skills", "डिजिटल अध्ययन कौशल"],
    ["Academic profile preparation", "शैक्षणिक प्रोफ़ाइल तैयारी"]
  ],
  "job-career": [
    ["Job portal guidance", "जॉब पोर्टल मार्गदर्शन"],
    ["Government job application guidance", "सरकारी नौकरी आवेदन मार्गदर्शन"],
    ["Private job application guidance", "निजी नौकरी आवेदन मार्गदर्शन"],
    ["Resume creation", "रिज्यूमे निर्माण"],
    ["CV improvement", "सीवी सुधार"],
    ["Fresher resume", "फ्रेशर रिज्यूमे"],
    ["Experienced resume", "अनुभवी रिज्यूमे"],
    ["Cover letter", "कवर लेटर"],
    ["Job application message", "नौकरी आवेदन संदेश"],
    ["Interview preparation", "साक्षात्कार तैयारी"],
    ["Internship guidance", "इंटर्नशिप मार्गदर्शन"],
    ["Apprenticeship guidance", "अप्रेंटिसशिप मार्गदर्शन"],
    ["Career information", "करियर जानकारी"],
    ["Skill development resource discovery", "कौशल विकास संसाधन खोज"],
    ["Professional profile guidance", "पेशेवर प्रोफ़ाइल मार्गदर्शन"]
  ],
  "resume-documents": [
    ["Resume", "रिज्यूमे"],
    ["CV", "सीवी"],
    ["Bio-data", "बायो-डेटा"],
    ["Cover Letter", "कवर लेटर"],
    ["Job Application", "नौकरी आवेदन"],
    ["Internship Application", "इंटर्नशिप आवेदन"],
    ["Professional introduction", "पेशेवर परिचय"],
    ["LinkedIn / profile content guidance", "लिंक्डइन / प्रोफ़ाइल सामग्री मार्गदर्शन"],
    ["Statement / profile writing", "स्टेटमेंट / प्रोफ़ाइल लेखन"],
    ["Basic portfolio guidance", "बुनियादी पोर्टफोलियो मार्गदर्शन"]
  ],
  "project-proposal": [
    ["Project report structure", "परियोजना रिपोर्ट संरचना"],
    ["Project concept note", "परियोजना कॉन्सेप्ट नोट"],
    ["Project proposal", "परियोजना प्रस्ताव"],
    ["NGO project proposal", "एनजीओ परियोजना प्रस्ताव"],
    ["CSR proposal guidance", "सीएसआर प्रस्ताव मार्गदर्शन"],
    ["Grant proposal structure", "अनुदान प्रस्ताव संरचना"],
    ["Budget format guidance", "बजट प्रारूप मार्गदर्शन"],
    ["Activity plan", "गतिविधि योजना"],
    ["Logical framework / outcome planning", "लॉजिकल फ्रेमवर्क / परिणाम नियोजन"],
    ["Monitoring format", "निगरानी प्रारूप"],
    ["Project presentation", "परियोजना प्रस्तुति"],
    ["Donor-ready document formatting", "दानदाता-योग्य दस्तावेज़ प्रारूपण"]
  ],
  "farmer-agriculture": [
    ["Agriculture scheme information", "कृषि योजना जानकारी"],
    ["Online agriculture portal guidance", "ऑनलाइन कृषि पोर्टल मार्गदर्शन"],
    ["Farmer application guidance", "किसान आवेदन मार्गदर्शन"],
    ["Document checklist", "दस्तावेज़ चेकलिस्ट"],
    ["Organic farming information", "जैविक खेती जानकारी"],
    ["Natural farming information", "प्राकृतिक खेती जानकारी"],
    ["Digital agriculture resources", "डिजिटल कृषि संसाधन"],
    ["Market information navigation", "बाजार सूचना मार्गदर्शन"],
    ["Training / resource discovery", "प्रशिक्षण / संसाधन खोज"]
  ],
  "women-family": [
    ["Government scheme information", "सरकारी योजना जानकारी"],
    ["Women-focused scheme navigation", "महिला-केंद्रित योजना मार्गदर्शन"],
    ["Child-related scheme information", "बाल-संबंधित योजना जानकारी"],
    ["Family welfare information", "परिवार कल्याण जानकारी"],
    ["Education support information", "शिक्षा सहायता जानकारी"],
    ["Digital form assistance", "डिजिटल फॉर्म सहायता"],
    ["Document checklist", "दस्तावेज़ चेकलिस्ट"],
    ["Official helpline / resource discovery", "आधिकारिक हेल्पलाइन / संसाधन खोज"]
  ],
  "senior-citizen": [
    ["Online form guidance", "ऑनलाइन फॉर्म मार्गदर्शन"],
    ["Government portal navigation", "सरकारी पोर्टल मार्गदर्शन"],
    ["Digital document assistance", "डिजिटल दस्तावेज़ सहायता"],
    ["Appointment booking guidance", "अपॉइंटमेंट बुकिंग मार्गदर्शन"],
    ["Official information search", "आधिकारिक सूचना खोज"],
    ["Digital payment awareness", "डिजिटल भुगतान जागरूकता"],
    ["Basic smartphone / internet guidance", "बुनियादी स्मार्टफोन / इंटरनेट मार्गदर्शन"],
    ["Cyber-safety awareness", "साइबर-सुरक्षा जागरूकता"]
  ],
  "documents-forms": [
    ["Document checklist", "दस्तावेज़ चेकलिस्ट"],
    ["Online form filling guidance", "ऑनलाइन फॉर्म भरने का मार्गदर्शन"],
    ["Document upload guidance", "दस्तावेज़ अपलोड मार्गदर्शन"],
    ["PDF creation", "पीडीएफ निर्माण"],
    ["PDF merging", "पीडीएफ मर्जिंग"],
    ["PDF compression", "पीडीएफ संपीड़न"],
    ["Document formatting", "दस्तावेज़ प्रारूपण"],
    ["Scan quality guidance", "स्कैन गुणवत्ता मार्गदर्शन"],
    ["Photo / signature preparation guidance", "फोटो / हस्ताक्षर तैयारी मार्गदर्शन"],
    ["Digital file organisation", "डिजिटल फाइल व्यवस्थापन"],
    ["Online verification navigation", "ऑनलाइन सत्यापन मार्गदर्शन"],
    ["Document naming / filing guidance", "दस्तावेज़ नामकरण / फाइलिंग मार्गदर्शन"]
  ],
  "digital-literacy": [
    ["Smartphone basics", "स्मार्टफोन बुनियादी बातें"],
    ["Email basics", "ईमेल बुनियादी बातें"],
    ["Internet basics", "इंटरनेट बुनियादी बातें"],
    ["Online search", "ऑनलाइन खोज"],
    ["Online forms", "ऑनलाइन फॉर्म"],
    ["PDF handling", "पीडीएफ संचालन"],
    ["Cloud / document basics", "क्लाउड / दस्तावेज़ बुनियादी बातें"],
    ["Video meeting basics", "वीडियो मीटिंग बुनियादी बातें"],
    ["Online application basics", "ऑनलाइन आवेदन बुनियादी बातें"],
    ["Digital communication", "डिजिटल संचार"],
    ["Basic computer guidance", "बुनियादी कंप्यूटर मार्गदर्शन"]
  ],
  "cyber-safety": [
    ["Phishing awareness", "फिशिंग जागरूकता"],
    ["Scam awareness", "ठगी जागरूकता"],
    ["Fake website identification", "फर्जी वेबसाइट की पहचान"],
    ["Suspicious message awareness", "संदिग्ध संदेश जागरूकता"],
    ["Account safety guidance", "खाता सुरक्षा मार्गदर्शन"],
    ["Password safety education", "पासवर्ड सुरक्षा शिक्षा"],
    ["OTP safety education", "ओटीपी सुरक्षा शिक्षा"],
    ["Digital payment safety", "डिजिटल भुगतान सुरक्षा"],
    ["Social media safety", "सोशल मीडिया सुरक्षा"],
    ["Privacy awareness", "गोपनीयता जागरूकता"],
    ["Cyber complaint / resource navigation", "साइबर शिकायत / संसाधन मार्गदर्शन"]
  ],
  "email-communication": [
    ["Official email drafting", "आधिकारिक ईमेल लेखन"],
    ["Application letter", "आवेदन पत्र"],
    ["Complaint letter", "शिकायत पत्र"],
    ["Request letter", "अनुरोध पत्र"],
    ["Leave / application format", "अवकाश / आवेदन प्रारूप"],
    ["NGO communication", "एनजीओ संचार"],
    ["Institutional letter", "संस्थागत पत्र"],
    ["Cover letter", "कवर लेटर"],
    ["Formal Hindi / English communication", "औपचारिक हिंदी / अंग्रेज़ी संचार"],
    ["Translation", "अनुवाद"],
    ["Proofreading", "प्रूफरीडिंग"]
  ],
  "learning-research": [
    ["Research topic guidance", "शोध विषय मार्गदर्शन"],
    ["Information finding", "सूचना खोज"],
    ["Source discovery", "स्रोत खोज"],
    ["Study planning", "अध्ययन योजना"],
    ["Notes organisation", "नोट्स व्यवस्थापन"],
    ["Presentation preparation", "प्रस्तुति तैयारी"],
    ["Basic data organisation", "बुनियादी डेटा व्यवस्थापन"],
    ["Report formatting", "रिपोर्ट प्रारूपण"],
    ["Educational resource discovery", "शैक्षणिक संसाधन खोज"],
    ["Learning roadmap", "अधिगम रोडमैप"]
  ],
  "website-presence": [
    ["Website content guidance", "वेबसाइट सामग्री मार्गदर्शन"],
    ["Organisation profile", "संस्था प्रोफ़ाइल"],
    ["Programme page content", "कार्यक्रम पृष्ठ सामग्री"],
    ["Basic website structure", "बुनियादी वेबसाइट संरचना"],
    ["Contact page content", "संपर्क पृष्ठ सामग्री"],
    ["NGO website guidance", "एनजीओ वेबसाइट मार्गदर्शन"],
    ["Social media content guidance", "सोशल मीडिया सामग्री मार्गदर्शन"],
    ["Digital profile improvement", "डिजिटल प्रोफ़ाइल सुधार"],
    ["Document / resource page organisation", "दस्तावेज़ / संसाधन पृष्ठ व्यवस्थापन"]
  ],
  "legal-information": [
    ["Official legal resource discovery", "आधिकारिक कानूनी संसाधन खोज"],
    ["Government legal portal navigation", "सरकारी कानूनी पोर्टल मार्गदर्शन"],
    ["Basic process information", "बुनियादी प्रक्रिया जानकारी"],
    ["Document checklist", "दस्तावेज़ चेकलिस्ट"],
    ["Complaint / grievance resource discovery", "शिकायत / निवारण संसाधन खोज"],
    ["RTI basic process information", "आरटीआई बुनियादी प्रक्रिया जानकारी"],
    ["Consumer grievance navigation", "उपभोक्ता निवारण मार्गदर्शन"],
    ["e-Court / basic court portal navigation", "ई-कोर्ट / बुनियादी न्यायालय पोर्टल मार्गदर्शन"]
  ],
  "health-navigation": [
    ["Official health-resource discovery", "आधिकारिक स्वास्थ्य संसाधन खोज"],
    ["Government health scheme information", "सरकारी स्वास्थ्य योजना जानकारी"],
    ["Appointment portal navigation", "अपॉइंटमेंट पोर्टल मार्गदर्शन"],
    ["Health-service website discovery", "स्वास्थ्य सेवा वेबसाइट खोज"],
    ["Public health information resources", "जन स्वास्थ्य सूचना संसाधन"]
  ],
  "social-awareness": [
    ["Awareness material", "जागरूकता सामग्री"],
    ["Educational posters", "शैक्षणिक पोस्टर"],
    ["Public information", "जन-सूचना"],
    ["Social issue resources", "सामाजिक मुद्दा संसाधन"],
    ["Community campaign material", "सामुदायिक अभियान सामग्री"],
    ["Digital awareness content", "डिजिटल जागरूकता सामग्री"],
    ["Government helpline / resource discovery", "सरकारी हेल्पलाइन / संसाधन खोज"]
  ]
};

const slug = (s) =>
  // The Devanagari range in this character class is intentional.
  // eslint-disable-next-line no-misleading-character-class
  String(s).toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, "-").replace(/^-+|-+$/g, "");

// Compose the category objects with fully-formed service records.
export const HELP_SERVICES = HELP_CATEGORIES.flatMap((cat) =>
  (SERVICE_LISTS[cat.id] || []).map(([en, hi], i) => ({
    id: `${cat.id}--${slug(en)}`,
    categoryId: cat.id,
    categoryEn: cat.en,
    categoryHi: cat.hi,
    icon: cat.icon,
    filter: cat.filter,
    en,
    hi,
    sortOrder: i,
    whoEn: cat.whoEn,
    whoHi: cat.whoHi,
    helpEn: cat.helpEn,
    helpHi: cat.helpHi,
    docsEn: cat.docsEn,
    docsHi: cat.docsHi
  }))
);

export const HELP_PROCESS = [
  { n: "01", en: "Choose a Service", hi: "सेवा चुनें" },
  { n: "02", en: "Tell Us What You Need", hi: "अपनी आवश्यकता बताएं" },
  { n: "03", en: "Receive Guidance", hi: "सहायता एवं मार्गदर्शन प्राप्त करें" },
  { n: "04", en: "Complete the Official Process", hi: "आधिकारिक प्रक्रिया पूरी करें" }
];

export const HELP_AUDIENCE = [
  { icon: "education", en: "Students", hi: "विद्यार्थी" },
  { icon: "career", en: "Job Seekers", hi: "नौकरी तलाशने वाले" },
  { icon: "agriculture", en: "Farmers", hi: "किसान" },
  { icon: "women", en: "Women & Families", hi: "महिलाएँ एवं परिवार" },
  { icon: "senior", en: "Senior Citizens", hi: "वरिष्ठ नागरिक" },
  { icon: "ngo", en: "NGOs", hi: "गैर-लाभकारी संस्थाएँ" },
  { icon: "community", en: "Community Organisations", hi: "सामुदायिक संस्थाएँ" },
  { icon: "digital", en: "Digitally Less-Confident Users", hi: "डिजिटल सहायता की आवश्यकता वाले लोग" }
];

// Frequently requested (shown as a curated list, not a fabricated ranking).
export const HELP_POPULAR = [
  "job-career--resume-creation",
  "ngo-support--ngo-registration-process-guidance",
  "student-education--scholarship-application-guidance",
  "government-services--online-form-guidance",
  "project-proposal--project-proposal",
  "job-career--job-portal-guidance",
  "documents-forms--online-form-filling-guidance",
  "resume-documents--resume"
].map((id) => HELP_SERVICES.find((s) => s.id === id)).filter(Boolean);

export const HELP_FAQ = [
  {
    q: "Is SSF assistance free?",
    qHi: "क्या एसएसएफ सहायता निःशुल्क है?",
    a: "Where specifically offered, SSF provides digital assistance and guidance without an assistance charge. However, official third-party costs may still apply, such as government fees, registration fees, examination fees, stamp duty, notary charges, printing or courier.",
    aHi: "जहाँ विशेष रूप से प्रदान की जाती है, एसएसएफ सहायता शुल्क के बिना डिजिटल सहायता एवं मार्गदर्शन देता है। हालाँकि, आधिकारिक तृतीय-पक्ष खर्च लागू हो सकते हैं, जैसे सरकारी शुल्क, पंजीकरण शुल्क, परीक्षा शुल्क, स्टांप शुल्क, नोटरी शुल्क, प्रिंटिंग या कूरियर।"
  },
  {
    q: "Does SSF guarantee approval?",
    qHi: "क्या एसएसएफ स्वीकृति की गारंटी देता है?",
    a: "No. SSF provides digital assistance and guidance. Final approval, eligibility and decisions remain with the concerned government department, institution or service provider.",
    aHi: "नहीं। एसएसएफ डिजिटल सहायता एवं मार्गदर्शन देता है। अंतिम स्वीकृति, पात्रता एवं निर्णय संबंधित सरकारी विभाग, संस्थान या सेवा प्रदाता के पास रहते हैं।"
  },
  {
    q: "Can SSF fill government forms?",
    qHi: "क्या एसएसएफ सरकारी फॉर्म भर सकता है?",
    a: "Where offered, SSF may provide digital assistance or guidance. Final submission and approval always belong to the concerned authority.",
    aHi: "जहाँ प्रदान किया जाता है, एसएसएफ डिजिटल सहायता या मार्गदर्शन दे सकता है। अंतिम जमा एवं स्वीकृति सदैव संबंधित प्राधिकरण के पास होती है।"
  },
  {
    q: "Can I share my OTP or password?",
    qHi: "क्या मैं अपना ओटीपी या पासवर्ड साझा कर सकता/सकती हूँ?",
    a: "No. Never share your OTP, password, ATM PIN, UPI PIN, CVV or any authentication code with anyone. SSF will never ask for these.",
    aHi: "नहीं। अपना ओटीपी, पासवर्ड, एटीएम पिन, यूपीआई पिन, सीवीवी या कोई ऑथेंटिकेशन कोड कभी किसी से साझा न करें। एसएसएफ ये कभी नहीं माँगेगा।"
  },
  {
    q: "What documents are needed?",
    qHi: "कौन-से दस्तावेज़ आवश्यक हैं?",
    a: "It depends on the service. Each service detail page lists a general document checklist. Exact requirements are set by the concerned authority.",
    aHi: "यह सेवा पर निर्भर करता है। प्रत्येक सेवा विवरण पृष्ठ पर सामान्य दस्तावेज़ चेकलिस्ट दी गई है। सटीक आवश्यकताएँ संबंधित प्राधिकरण द्वारा निर्धारित होती हैं।"
  },
  {
    q: "Can students use the centre?",
    qHi: "क्या विद्यार्थी इस केंद्र का उपयोग कर सकते हैं?",
    a: "Yes. Students can use the centre for scholarships, admissions, exam forms, projects, resumes and digital skills.",
    aHi: "हाँ। विद्यार्थी छात्रवृत्ति, प्रवेश, परीक्षा फॉर्म, प्रोजेक्ट, रिज्यूमे एवं डिजिटल कौशल हेतु इस केंद्र का उपयोग कर सकते हैं।"
  },
  {
    q: "Can NGOs request help?",
    qHi: "क्या एनजीओ सहायता का अनुरोध कर सकते हैं?",
    a: "Yes, for the services offered, such as registration guidance, documentation, proposals and digital presence.",
    aHi: "हाँ, प्रदान की जाने वाली सेवाओं हेतु, जैसे पंजीकरण मार्गदर्शन, दस्तावेज़ीकरण, प्रस्ताव एवं डिजिटल उपस्थिति।"
  },
  {
    q: "Can people outside Rewa use it?",
    qHi: "क्या रीवा के बाहर के लोग इसका उपयोग कर सकते हैं?",
    a: "The organisation's operational scope is Pan India. Availability of a particular assistance service may depend on the service and capacity.",
    aHi: "संस्था का कार्यक्षेत्र सम्पूर्ण भारत है। किसी विशेष सहायता सेवा की उपलब्धता सेवा एवं क्षमता पर निर्भर हो सकती है।"
  }
];

export const HELP_SERVICE_COUNT = HELP_SERVICES.length;

// ---- search / filter helpers ----------------------------------------------
export function searchHelpServices(query, filterId = "all") {
  const q = String(query || "").trim().toLowerCase();
  const inFilter = (s) => filterId === "all" || s.filter === filterId;
  const base = HELP_SERVICES.filter(inFilter);
  if (!q) return base;
  return base.filter((s) =>
    `${s.en} ${s.hi} ${s.categoryEn} ${s.categoryHi}`.toLowerCase().includes(q)
  );
}

export function helpServiceById(id) {
  return HELP_SERVICES.find((s) => s.id === id) || null;
}

export function helpCategoriesWithCounts() {
  return HELP_CATEGORIES.map((c) => ({
    ...c,
    count: HELP_SERVICES.filter((s) => s.categoryId === c.id).length
  }));
}
