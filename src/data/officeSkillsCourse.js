/**
 * Office Skills / ऑफिस कौशल — category + card data.
 *
 * Cards only for now: each of the 13 subjects ships a learning-focused English
 * title, Hindi title, a one-line learning subtitle and a level path. The
 * detailed course content (modules, lessons, examples, practice, quiz) is
 * authored later, category by category; `courseShell()` below produces a clean,
 * ready-to-fill shell so every card already opens a real course route.
 */

export const OFFICE_SKILLS_CATEGORY = "Office Skills / ऑफिस कौशल";

// Main section copy (used by the course shell header / future section header).
export const OFFICE_SKILLS_SECTION = {
  title: "Office Skills / ऑफिस कौशल",
  taglineEn: "Learn Office Tools • Build Digital Skills • Work Professionally",
  taglineHi: "ऑफिस टूल्स सीखें • डिजिटल कौशल बढ़ाएँ • प्रोफेशनल तरीके से काम करें",
  description:
    "Excel, Word, PowerPoint, PDF, Email, Google Workspace, Data and AI जैसे essential office skills को एक जगह सीखने का Learning Centre।"
};

// Compact authoring tuple: [en, hi, learningLine, level, emoji]
// en/hi become the card title "English / Hindi"; learningLine is the
// learning-focused subtitle; level is the 🌱 → 🛠️ → 🚀 learning indicator;
// emoji is the card's own relevant icon (never the same generic image).
const OFFICE_CARDS = [
  ["Excel & Spreadsheet Formulas", "एक्सेल एवं स्प्रेडशीट फ़ॉर्मूला", "A–Z Formulas • Functions • Calculations • Practical Examples", "Beginner → Advanced", "📊"],
  ["Microsoft Excel", "माइक्रोसॉफ्ट एक्सेल", "Data • Tables • Charts • Reports • Dashboards • Advanced Excel", "Beginner → Advanced", "📊"],
  ["Microsoft Word", "माइक्रोसॉफ्ट वर्ड", "Documents • Formatting • Tables • Reports • CV • Professional Work", "Beginner → Advanced", "📝"],
  ["Microsoft PowerPoint", "माइक्रोसॉफ्ट पावरपॉइंट", "Slides • Design • Animation • Charts • Presentation Skills", "Beginner → Advanced", "📽️"],
  ["PDF Tools & Management", "PDF टूल्स एवं प्रबंधन", "Create • Convert • Edit • Merge • Split • Compress • Sign", "Beginner → Practical", "📄"],
  ["Email & Office Communication", "ईमेल एवं ऑफिस संचार", "Gmail • Outlook • Professional Emails • Attachments • Meetings", "Beginner → Practical", "📧"],
  ["Google Workspace", "गूगल वर्कस्पेस", "Drive • Docs • Sheets • Slides • Forms • Collaboration", "Beginner → Advanced", "☁️"],
  ["Files & Document Management", "फाइल एवं दस्तावेज़ प्रबंधन", "Files • Folders • Organisation • Backup • Cloud • Sharing", "Beginner → Practical", "🗂️"],
  ["Printing & Scanning", "प्रिंटिंग एवं स्कैनिंग", "Print • Scan • PDF • OCR • Documents • Print Settings", "Beginner → Practical", "🖨️"],
  ["Office Data & Records", "ऑफिस डेटा एवं रिकॉर्ड", "Attendance • Salary • Expenses • Invoice • Stock • Records", "Beginner → Advanced", "🧮"],
  ["Data Analysis & Reporting", "डेटा विश्लेषण एवं रिपोर्टिंग", "Data • Charts • Pivot Tables • Dashboards • MIS Reports", "Practical → Advanced", "📈"],
  ["AI for Office Work", "ऑफिस कार्य के लिए AI", "AI • Excel • Word • PowerPoint • PDF • Email • Productivity", "Beginner → Advanced", "🤖"],
  ["Office Security & Privacy", "ऑफिस सुरक्षा एवं गोपनीयता", "Passwords • Phishing • Safe Files • Privacy • Backup • Recovery", "Beginner → Practical", "🔐"]
];

// Per-card learning intent: what the learner will be able to do. Kept short and
// honest — this is the card's promise, not lesson content.
const OFFICE_OUTCOMES = {
  "Excel & Spreadsheet Formulas": [
    "A–Z Excel formulas और functions को समझना और सही जगह उपयोग करना।",
    "Calculations, references और logical functions को practical उदाहरणों से सीखना।",
    "अपने रोज़ के काम का हिसाब-किताब spreadsheet में साफ़-सुथरा बनाना।"
  ],
  "Microsoft Excel": [
    "Data को tables, charts और reports में बदलना।",
    "Dashboards और advanced Excel features से जानकारी आसानी से पढ़ना।",
    "Office data को organised और reusable तरीके से रखना।"
  ],
  "Microsoft Word": [
    "Documents, letters और reports को साफ़ formatting में तैयार करना।",
    "Tables और professional layout का सही उपयोग करना।",
    "CV और office documents professional ढंग से बनाना।"
  ],
  "Microsoft PowerPoint": [
    "प्रभावी slides बनाना और content को सरल रूप में दिखाना।",
    "Design, animation और charts से presentation को मजबूत बनाना।",
    "Meeting में आत्मविश्वास के साथ प्रस्तुति देना।"
  ],
  "PDF Tools & Management": [
    "PDF create, convert और edit करना।",
    "Merge, split, compress और sign जैसे काम आसानी से करना।",
    "Documents को सुरक्षित और भेजने-योग्य रूप में रखना।"
  ],
  "Email & Office Communication": [
    "Professional emails सही structure में लिखना।",
    "Gmail/Outlook में attachments और meetings को सँभालना।",
    "Office में सम्मानजनक और स्पष्ट संवाद करना।"
  ],
  "Google Workspace": [
    "Drive, Docs, Sheets, Slides और Forms को रोज़ के काम में उपयोग करना।",
    "Online collaboration और sharing को समझना।",
    "Team के साथ मिलकर documents पर काम करना।"
  ],
  "Files & Document Management": [
    "Files और folders को व्यवस्थित तरीके से रखना।",
    "Backup, cloud और safe sharing की आदत बनाना।",
    "ज़रूरी document कभी न खोएँ — यह सुनिश्चित करना।"
  ],
  "Printing & Scanning": [
    "Print और scan के सही settings समझना।",
    "Scanned documents को PDF/OCR में उपयोग करना।",
    "Documents को साफ़ और पढ़ने-योग्य रूप में सुरक्षित रखना।"
  ],
  "Office Data & Records": [
    "Attendance, salary, expenses और stock के records रखना।",
    "Invoice और bills को व्यवस्थित तरीके से तैयार करना।",
    "Office records को सुरक्षित और traceable रखना।"
  ],
  "Data Analysis & Reporting": [
    "Data को पढ़कर उपयोगी जानकारी निकालना।",
    "Charts, pivot tables और dashboards बनाना।",
    "MIS reports तैयार करके निर्णय में मदद करना।"
  ],
  "AI for Office Work": [
    "AI को Excel, Word, PowerPoint, PDF और Email में सहायक की तरह उपयोग करना।",
    "Documents और reports जल्दी बनाने के लिए AI का सही तरीके से उपयोग करना।",
    "AI का उपयोग ईमानदार, सुरक्षित और जिम्मेदार तरीके से करना।"
  ],
  "Office Security & Privacy": [
    "Strong passwords और safe files की आदत बनाना।",
    "Phishing और fraud पहचानकर बचना।",
    "Privacy, backup और recovery की basic समझ रखना।"
  ]
};

const OFFICE_LEVELS = {
  "Beginner → Advanced": ["🌱 Beginner", "🛠️ Practical", "🚀 Advanced"],
  "Beginner → Practical": ["🌱 Beginner", "🛠️ Practical"],
  "Practical → Advanced": ["🛠️ Practical", "🚀 Advanced"]
};

// Compact office-course tuple: [title "En / Hi", learn, example, activity, quiz]
// Every entry is a single "Getting Started" topic so the course shell is
// complete and navigable without inventing detailed lesson material.
const OFFICE_MODULES = [
  [
    "Getting Started / शुरुआत करें",
    "इस course का परिचय, उद्देश्य और सीखने का तरीका।",
    "इस course को खोलें, परिचय पढ़ें और अपना पहला learning goal तय करें।",
    "अपने रोज़ के काम से एक example चुनें जिसमें यह skill काम आएगी।",
    ["इस course से पहले क्या करना उपयोगी है?", ["उद्देश्य और level समझना", "सभी lessons याद करना", "certificate claim करना", "कुछ नहीं"], 0, "शुरुआत में उद्देश्य और level समझना सबसे उपयोगी है।"]
  ],
  [
    "Course Structure / पाठ्यक्रम संरचना",
    "Course Overview → Modules → Lessons → Examples → Practice → Quiz → Revision → Assessment → Completion का रास्ता।",
    "Course map देखें और समझें कि हर चरण में क्या सीखेंगे।",
    "अपने लिए एक साप्ताहिक अभ्यास समय तय करें।",
    ["Course में सीखने का सही क्रम क्या है?", ["Overview → Modules → Lessons → Practice → Assessment", "Quiz → Completion → Lessons", "सिर्फ़ certificate", "सिर्फ़ video"], 0, "सीखने का क्रम overview से assessment तक step-by-step होता है।"]
  ],
  [
    "Detailed Lessons / विस्तृत पाठ",
    "इस card के विषय की विस्तृत lessons और examples यहाँ जोड़े जाएँगे।",
    "अभी Course Overview पढ़ें और नीचे दिए गए outcomes को समझें।",
    "इस विषय से जुड़ा अपना एक सवाल लिखें जिसका उत्तर आप ढूँढना चाहते हैं।",
    ["विस्तृत lessons कब उपलब्ध होंगी?", ["शीघ्र — category-by-category जोड़ी जाएँगी", "कभी नहीं", "सिर्फ़ paid", "अनजान"], 0, "विस्तृत content शीघ्र, एक-एक category करके जोड़ा जाएगा।"]
  ]
];

const buildShellModule = (m, mi) => ({
  id: "office-m" + (mi + 1),
  title: m[0],
  summary: m[1],
  topics: [
    {
      id: "office-m" + (mi + 1) + "-t1",
      title: "Getting Started / शुरुआत करें",
      learn: m[1],
      example: m[2],
      activity: m[3],
      quiz: { question: m[4][0], options: m[4][1], answer: m[4][2], explain: m[4][3] }
    }
  ]
});

const buildOfficeCourse = (tuple) => {
  const [en, hi, learningLine, level, emoji] = tuple;
  const outcomes = OFFICE_OUTCOMES[en] || [];
  const levels = OFFICE_LEVELS[level] || ["🌱 Beginner", "🛠️ Practical"];
  return {
    icon: emoji || "🏢",
    level,
    levels,
    learningLine,
    overview: {
      what: learningLine + "। " + en + " office work में रोज़ काम आने वाला practical skill है।",
      why: "यह skill office काम को तेज़, साफ़ और professional बनाती है।",
      where: "Office, business, दुकान, school, NGO और घर के कामों में।",
      outcome: outcomes.join(" ") || "इस विषय को foundation से practical application तक सीखना।"
    },
    outcomes,
    modules: OFFICE_MODULES.map(buildShellModule),
    glossary: [
      { term: en, hi, meaning: learningLine },
      { term: "Practical Skill", hi: "व्यावहारिक कौशल", meaning: "काम में उपयोग करने योग्य सीख।" },
      { term: "Assessment", hi: "आकलन", meaning: "सीखी बात की जाँच।" }
    ],
    facts: [],
    project: null,
    revision: null,
    mastery: [],
    related: [],
    shell: true
  };
};

export const OFFICE_SKILLS_CARDS = OFFICE_CARDS.map((tuple) => {
  const [en, hi, learningLine, level, emoji] = tuple;
  return { en, hi, title: en + " / " + hi, intro: learningLine, level, emoji, levels: OFFICE_LEVELS[level] || [] };
});

export const OFFICE_SKILLS_COURSES = Object.fromEntries(
  OFFICE_CARDS.map((tuple) => [tuple[0], buildOfficeCourse(tuple)])
);

export const getOfficeSkillsCourse = (subject) => {
  if (!subject) return null;
  const en = subject.en || String(subject.title || "").split(" / ")[0];
  if (OFFICE_SKILLS_COURSES[en]) return OFFICE_SKILLS_COURSES[en];
  const key = Object.keys(OFFICE_SKILLS_COURSES).find((k) => k.toLowerCase() === String(en).toLowerCase());
  return key ? OFFICE_SKILLS_COURSES[key] : null;
};

export const isOfficeSkillsSubject = (subject) =>
  Boolean(subject && subject.category === OFFICE_SKILLS_CATEGORY && getOfficeSkillsCourse(subject));

export const officeTopicCount = (course) =>
  course ? course.modules.reduce((n, m) => n + m.topics.length, 0) : 0;
