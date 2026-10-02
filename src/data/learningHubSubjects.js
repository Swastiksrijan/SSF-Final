export const LEARNING_SUBJECT_CATEGORIES = {
  "Digital Skills / डिजिटल कौशल": {
    key: "digital",
    accent: "#103a64",
  },
  "English & Communication / अंग्रेज़ी एवं संचार": {
    key: "english",
    accent: "#0f5aa6",
  },
  "Education / Learning Skills / शिक्षा / सीख कौशल": {
    key: "education",
    accent: "#1e5c3d",
  },
  "Skill Development / कौशल विकास": {
    key: "skills",
    accent: "#2d6a4f",
  },
  "Health / स्वास्थ्य": {
    key: "health",
    accent: "#9d0208",
  },
  "Environment / पर्यावरण": {
    key: "environment",
    accent: "#2d6a4f",
  },
  "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास": {
    key: "agriculture",
    accent: "#4a7c33",
  },
  "Women & Child Development / महिला एवं बाल विकास": {
    key: "women",
    accent: "#8b1e3f",
  },
  "Career & Workplace / करियर एवं कार्यस्थल": {
    key: "career",
    accent: "#374151",
  },
  "Digital Safety / साइबर सुरक्षा": {
    key: "cyber",
    accent: "#223d5d",
  },
};

const createSvgDataUri = (titleEn, titleHi, accent, iconText) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#0d1b2a" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#g)"/>
      <circle cx="980" cy="110" r="160" fill="rgba(255,255,255,0.08)"/>
      <circle cx="1020" cy="470" r="240" fill="rgba(255,255,255,0.05)"/>
      <rect x="80" y="80" width="260" height="86" rx="18" fill="rgba(255,255,255,0.14)"/>
      <text x="112" y="136" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="white">SSF</text>
      <text x="82" y="255" font-family="Arial, sans-serif" font-size="55" font-weight="800" fill="white">${titleEn}</text>
      <text x="82" y="315" font-family="Arial, sans-serif" font-size="30" font-weight="600" fill="rgba(255,255,255,0.86)">${titleHi}</text>
      <text x="82" y="395" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.75)">Swastik Srijan Foundation • Learning Hub</text>
      <rect x="82" y="455" width="210" height="72" rx="36" fill="rgba(255,255,255,0.18)"/>
      <text x="136" y="502" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="white">${iconText}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const buildCourse = ({
  id,
  titleEn,
  titleHi,
  category,
  description,
  status = "available",
  details,
  modules,
  activities,
  finalAssessment,
  shareImage,
}) => ({
  id,
  title: { en: titleEn, hi: titleHi },
  category,
  description,
  status,
  details,
  modules,
  activities,
  finalAssessment,
  image: shareImage,
  shareMeta: {
    title: `${titleEn} | SSF Learning Hub`,
    titleHi: `${titleHi} | SSF Learning Hub`,
    description,
    image: shareImage,
    url: `/LearningHub?subject=${encodeURIComponent(id)}`,
  },
});

const computerModules = [
  {
    id: "foundation",
    title: { en: "Foundation / आधार", hi: "आधार" },
    description: "Computer basics, hardware, software, files and safe digital habits.",
    lessons: [
      {
        id: "what-is-computer",
        title: { en: "What is a Computer?", hi: "कंप्यूटर क्या है?" },
        objective: "Understand the purpose of a computer and its major parts.",
        explanation: "A computer is an electronic system that accepts input, processes it using instructions, stores it and gives meaningful output. It helps us write documents, search information, communicate and manage information.",
        keyPoints: ["Input: keyboard, mouse, scanner", "Process: CPU and memory", "Storage: SSD, hard drive, cloud", "Output: screen, printer, speakers"],
        activity: "List 5 digital devices you use daily and identify whether they are input, output or storage devices.",
        knowledgeCheck: [
          { question: "Which part mainly processes instructions in a computer?", options: ["CPU", "Printer", "Keyboard", "Monitor"], answer: 0 },
          { question: "What is the role of RAM?", options: ["Temporary working memory", "Permanent file storage", "Internet connection", "Printer driver"], answer: 0 },
        ],
      },
      {
        id: "hardware-software",
        title: { en: "Hardware, Software and Operating System", hi: "हार्डवेयर, सॉफ्टवेयर और ऑपरेटिंग सिस्टम" },
        objective: "Differentiate between hardware and software and understand the operating system.",
        explanation: "Hardware is the physical body of the device, while software is the set of instructions used to do tasks. The operating system manages CPU, memory, files and applications so users can interact with the computer safely and smoothly.",
        keyPoints: ["Hardware = keyboard, mouse, screen, CPU", "Software = browser, Word, WhatsApp, OS", "Operating system = Windows, Android, Linux, macOS"],
        activity: "Open your device settings and identify 3 controls for display, network and privacy.",
        knowledgeCheck: [
          { question: "Which one is an operating system?", options: ["Windows", "Google Chrome", "Microsoft Word", "USB cable"], answer: 0 },
          { question: "What is software?", options: ["Instructions and programs that run on hardware", "A type of keyboard", "A power cable", "A monitor"], answer: 0 },
        ],
      },
      {
        id: "files-and-folders",
        title: { en: "Files, Folders and Safe Storage", hi: "फाइल, फोल्डर और सुरक्षित भंडारण" },
        objective: "Organize files and folders in a logical manner.",
        explanation: "Files hold data, while folders organize files. Clear naming helps you find documents easily. Good storage practices include saving work in folders, using backups and avoiding duplicate names.",
        keyPoints: ["Use descriptive names", "Create folders by year, course or project", "Keep backups in an external drive or cloud", "Avoid saving onto desktop only"],
        activity: "Create a folder named 'SSF-Learning' and inside it create subfolders for 'Notes', 'Assignments' and 'Certificates'.",
        knowledgeCheck: [
          { question: "What is the main purpose of a folder?", options: ["To organize and store files", "To connect to internet", "To charge the device", "To print pages"], answer: 0 },
          { question: "Why are clear file names important?", options: ["They make files easy to find and understand", "They make the device faster", "They increase battery life", "They create new software"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "internet-and-communication",
    title: { en: "Internet, Search and Communication", hi: "इंटरनेट, खोज और संचार" },
    description: "Use internet safely, search effectively and communicate professionally.",
    lessons: [
      {
        id: "browser-and-search",
        title: { en: "Web Browser and Search", hi: "वेब ब्राउज़र और खोज" },
        objective: "Use a browser and search internet information wisely.",
        explanation: "A browser opens websites, while a search engine helps us find information on the web. Good searches use clear keywords and check the trustworthiness of sources before acting.",
        keyPoints: ["Use specific keywords rather than vague words", "Check site owner, date and purpose", "Prefer official sources for facts", "Do not trust random forwarded claims"],
        activity: "Search for a general topic using 3 different keyword phrases and compare which result is most useful.",
        knowledgeCheck: [
          { question: "What should you check before trusting online information?", options: ["Source, date and evidence", "Only the headline", "Only the number of likes", "Only the website color"], answer: 0 },
          { question: "What is the browser used for?", options: ["Opening websites and online pages", "Copying files to USB", "Charging a device", "Creating folders"], answer: 0 },
        ],
      },
      {
        id: "email-and-message",
        title: { en: "Email and Professional Messages", hi: "ईमेल और पेशेवर संदेश" },
        objective: "Write clear and respectful digital messages.",
        explanation: "A good email has a clear subject, greeting, message body and closing. Professional messages should be short, respectful and action-oriented. This helps avoid confusion and builds trust.",
        keyPoints: ["Write a clear subject line", "Make request easy to understand", "Attach correct files", "Check spelling and recipient"],
        activity: "Write a 4-line email requesting a class schedule or meeting time.",
        knowledgeCheck: [
          { question: "Why is a subject line useful in email?", options: ["It tells the reader the purpose of the message", "It replaces the message", "It adds extra files", "It changes the time"], answer: 0 },
          { question: "What should be checked before sending mail?", options: ["Recipient, content and attachment", "Only bold text", "Only picture size", "Only keyboard color"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "cyber-safety",
    title: { en: "Cyber Safety and Digital Responsibility", hi: "साइबर सुरक्षा और डिजिटल जिम्मेदारी" },
    description: "Protect accounts, avoid scams and use digital tools safely.",
    lessons: [
      {
        id: "passwords-and-otp",
        title: { en: "Passwords, OTP and Account Safety", hi: "पासवर्ड, OTP और खाते की सुरक्षा" },
        objective: "Use safe account habits and detect suspicious requests.",
        explanation: "Strong passwords are unique and difficult to guess. OTP, account recovery codes and MFA add extra protection. Never share passwords or one-time codes with anyone, including people claiming to be a support agent.",
        keyPoints: ["Use unique passwords for each account", "Use two-step verification", "Never share OTP", "Verify before clicking links"],
        activity: "Create a checklist of 5 safety rules for your online accounts.",
        knowledgeCheck: [
          { question: "What should you never share with a caller or messenger?", options: ["OTP or password", "Your favorite color", "Your date of birth", "Your device model"], answer: 0 },
          { question: "Why are unique passwords important?", options: ["So if one account is leaked, others stay safer", "They make the internet faster", "They install new software", "They reduce storage use"], answer: 0 },
        ],
      },
      {
        id: "phishing-awareness",
        title: { en: "Phishing and Fake Communication", hi: "फिशिंग और झूठे संदेश" },
        objective: "Recognize scam patterns and protect yourself.",
        explanation: "Phishing tricks users by pretending to be a trusted bank, government office, school or company. Common signs include urgency, unexpected links, poor grammar and requests for passwords or OTP.",
        keyPoints: ["Stop before clicking", "Check the sender closely", "Use official apps and channels", "Verify with a known phone number or official website"],
        activity: "Read 3 sample messages and identify the suspicious ones.",
        knowledgeCheck: [
          { question: "What is a common phishing signal?", options: ["Urgent request for OTP or password", "Friendly greeting", "Normal office timings", "A signed document"], answer: 0 },
          { question: "Before clicking a link, what is the best action?", options: ["Check whether it is expected and verified", "Click it immediately", "Share your password first", "Ignore all warnings"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "digital-productivity",
    title: { en: "Productivity and Practical Digital Tasks", hi: "उत्पादकता और व्यावहारिक डिजिटल कार्य" },
    description: "Create documents, manage schedules and solve simple digital problems.",
    lessons: [
      {
        id: "documents-and-templates",
        title: { en: "Documents, Notes and Templates", hi: "दस्तावेज़, नोट्स और टेम्पलेट" },
        objective: "Create useful digital documents and forms.",
        explanation: "A good digital document has clear headings, bullet points and logical structure. This makes it easier to share, review and revise. Time saving and clarity improve when document templates are repeated.",
        keyPoints: ["Use headings and bullet points", "Keep one file version per task", "Save in a proper folder", "Review before sending or printing"],
        activity: "Draft a one-page training note with headings, date, purpose and action points.",
        knowledgeCheck: [
          { question: "What makes a document easy to read?", options: ["Clear headings and logical structure", "Very long paragraphs without breaks", "Random font changes", "No spacing"], answer: 0 },
          { question: "Why save files with meaningful names?", options: ["To identify the content quickly", "To slow down the computer", "To attach more files automatically", "To hide the file"], answer: 0 },
        ],
      },
      {
        id: "troubleshooting-basic",
        title: { en: "Basic Troubleshooting", hi: "मूल समस्या निवारण" },
        objective: "Solve common digital problems with safe steps.",
        explanation: "Before changing settings or deleting files, define the problem clearly and check the basics: connection, permissions, storage and software status. This reduces errors and protects work.",
        keyPoints: ["Reproduce the problem", "Check network, storage, permissions", "Update or restart only when needed", "Back up before major changes"],
        activity: "Write a short troubleshooting checklist for a slow computer or a browser not loading pages.",
        knowledgeCheck: [
          { question: "What is the best first step when a digital task fails?", options: ["Identify and reproduce the problem clearly", "Delete all files", "Restart without checking anything", "Ignore the issue"], answer: 0 },
          { question: "Why is backup useful before troubleshooting?", options: ["It protects important files from accidental loss", "It speeds up the browser", "It automatically fixes all issues", "It removes all errors"], answer: 0 },
        ],
      },
    ],
  },
];

const computerAssessment = {
  passPercent: 70,
  questions: [
    { question: "Which of the following is a real benefit of a computer?", options: ["Store, process and present information", "Only play music", "Only show advertisements", "Only work when connected to a printer"], answer: 0 },
    { question: "What does a folder help do?", options: ["Organize related files", "Turn off the internet", "Delete your account", "Replace the CPU"], answer: 0 },
    { question: "Why is it safer to verify a link before clicking?", options: ["It reduces the risk of scams and phishing", "It increases internet speed", "It makes files larger", "It helps add more RAM"], answer: 0 },
    { question: "Which is a good password habit?", options: ["Unique, strong and not shared with others", "Always same as email", "Written on a public board", "Shared with anyone online"], answer: 0 },
    { question: "What should you do before deleting or changing settings?", options: ["Understand the problem and back up important data", "Delete everything first", "Ignore the issue", "Turn off the monitor"], answer: 0 },
  ],
};

export const LEARNING_SUBJECTS = [
  buildCourse({
    id: "computer-digital-skills",
    titleEn: "Computer & Digital Skills",
    titleHi: "कंप्यूटर एवं डिजिटल कौशल",
    category: "Digital Skills / डिजिटल कौशल",
    description: "A complete beginner-friendly course on computer basics, file management, digital communication, cyber safety, productivity and practical problem solving.",
    details: {
      level: "Foundation to Practical",
      duration: "4-6 weeks",
      hours: "8-10 learning hours",
      audience: "Students, learners, volunteers, workers, elders and first-time digital users.",
      prerequisites: ["No previous experience required."],
      outcomes: [
        "Operate a computer and identify core digital tools.",
        "Manage files, folders and digital documents.",
        "Search the internet safely and evaluate information.",
        "Communicate with confidence through email and messages.",
        "Use safe password and cybersecurity habits.",
        "Solve practical digital problems step by step.",
      ],
    },
    modules: computerModules,
    activities: [
      "Create and organize a digital folder structure for study or work.",
      "Write a short professional email or message.",
      "Identify safe and risky online messages.",
      "Prepare a small digital checklist for passwords, backups and device safety.",
    ],
    finalAssessment: computerAssessment,
    shareImage: createSvgDataUri("Computer & Digital Skills", "कंप्यूटर एवं डिजिटल कौशल", "#103a64", "Digital"),
  }),
  buildCourse({
    id: "english-communication",
    titleEn: "English & Communication",
    titleHi: "अंग्रेज़ी एवं संचार",
    category: "English & Communication / अंग्रेज़ी एवं संचार",
    description: "English foundation, speaking, writing, reading and workplace communication essentials.",
    status: "coming-soon",
    details: { level: "Foundation" },
    modules: [],
    activities: [],
    finalAssessment: { questions: [] },
    shareImage: createSvgDataUri("English & Communication", "अंग्रेज़ी एवं संचार", "#0f5aa6", "EN"),
  }),
  buildCourse({
    id: "education-learning-skills",
    titleEn: "Education & Learning Skills",
    titleHi: "शिक्षा एवं सीख कौशल",
    category: "Education / Learning Skills / शिक्षा / सीख कौशल",
    description: "Learning habits, study methods, classroom confidence, reading and educational planning.",
    status: "coming-soon",
    details: { level: "Foundation" },
    modules: [],
    activities: [],
    finalAssessment: { questions: [] },
    shareImage: createSvgDataUri("Education & Learning Skills", "शिक्षा एवं सीख कौशल", "#1e5c3d", "Learn"),
  }),
  buildCourse({
    id: "skill-development",
    titleEn: "Skill Development",
    titleHi: "कौशल विकास",
    category: "Skill Development / कौशल विकास",
    description: "Practical skill building, job readiness, income generation and work confidence.",
    status: "coming-soon",
    details: { level: "Practical" },
    modules: [],
    activities: [],
    finalAssessment: { questions: [] },
    shareImage: createSvgDataUri("Skill Development", "कौशल विकास", "#2d6a4f", "Skill"),
  }),
  buildCourse({
    id: "health-wellbeing",
    titleEn: "Health & Wellbeing",
    titleHi: "स्वास्थ्य एवं कल्याण",
    category: "Health / स्वास्थ्य",
    description: "Preventive health habits, personal hygiene, nutrition awareness and safe wellbeing practices.",
    status: "coming-soon",
    details: { level: "Foundation" },
    modules: [],
    activities: [],
    finalAssessment: { questions: [] },
    shareImage: createSvgDataUri("Health & Wellbeing", "स्वास्थ्य एवं कल्याण", "#9d0208", "Health"),
  }),
  buildCourse({
    id: "environment-sustainability",
    titleEn: "Environment & Sustainability",
    titleHi: "पर्यावरण एवं स्थिरता",
    category: "Environment / पर्यावरण",
    description: "Waste segregation, water conservation, tree care, climate awareness and local environmental action.",
    status: "coming-soon",
    details: { level: "Foundation" },
    modules: [],
    activities: [],
    finalAssessment: { questions: [] },
    shareImage: createSvgDataUri("Environment & Sustainability", "पर्यावरण एवं स्थिरता", "#2d6a4f", "Eco"),
  }),
  buildCourse({
    id: "agriculture-rural-development",
    titleEn: "Agriculture & Rural Development",
    titleHi: "कृषि एवं ग्रामीण विकास",
    category: "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास",
    description: "Basic agriculture, soil, water, crop planning and rural livelihoods knowledge.",
    status: "coming-soon",
    details: { level: "Practical" },
    modules: [],
    activities: [],
    finalAssessment: { questions: [] },
    shareImage: createSvgDataUri("Agriculture & Rural Development", "कृषि एवं ग्रामीण विकास", "#4a7c33", "Agri"),
  }),
  buildCourse({
    id: "women-child-development",
    titleEn: "Women & Child Development",
    titleHi: "महिला एवं बाल विकास",
    category: "Women & Child Development / महिला एवं बाल विकास",
    description: "Women empowerment, child rights, health, education and safety awareness.",
    status: "coming-soon",
    details: { level: "Foundation" },
    modules: [],
    activities: [],
    finalAssessment: { questions: [] },
    shareImage: createSvgDataUri("Women & Child Development", "महिला एवं बाल विकास", "#8b1e3f", "Care"),
  }),
  buildCourse({
    id: "career-workplace",
    titleEn: "Career & Workplace",
    titleHi: "करियर एवं कार्यस्थल",
    category: "Career & Workplace / करियर एवं कार्यस्थल",
    description: "Career planning, workplace etiquette, communication and job readiness.",
    status: "coming-soon",
    details: { level: "Practical" },
    modules: [],
    activities: [],
    finalAssessment: { questions: [] },
    shareImage: createSvgDataUri("Career & Workplace", "करियर एवं कार्यस्थल", "#374151", "Career"),
  }),
  buildCourse({
    id: "digital-safety-cyber-awareness",
    titleEn: "Digital Safety & Cyber Awareness",
    titleHi: "डिजिटल सुरक्षा एवं साइबर जागरूकता",
    category: "Digital Safety / साइबर सुरक्षा",
    description: "Safe internet use, phishing awareness, privacy, scams and account security.",
    status: "coming-soon",
    details: { level: "Foundation" },
    modules: [],
    activities: [],
    finalAssessment: { questions: [] },
    shareImage: createSvgDataUri("Digital Safety & Cyber Awareness", "डिजिटल सुरक्षा एवं साइबर जागरूकता", "#223d5d", "Safe"),
  }),
];

export const SUBJECT_CATEGORY_ORDER = Object.keys(LEARNING_SUBJECT_CATEGORIES);

export const getShareUrl = (subjectId) => {
  const base = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "/LearningHub";
  return `${base}?subject=${encodeURIComponent(subjectId)}`;
};

export const getSubjectById = (subjectId) => LEARNING_SUBJECTS.find((subject) => subject.id === subjectId) || null;

export const getCourseMeta = (subject) => ({
  title: subject.title.en,
  titleHi: subject.title.hi,
  description: subject.description,
  image: subject.image,
  url: getShareUrl(subject.id),
});

export const getSubjectImage = (subject) => subject.image;

export const getSubjectStatusText = (subject) => {
  if (subject.status === "coming-soon") return "Coming Soon / शीघ्र उपलब्ध";
  return "Available / उपलब्ध";
};

export default LEARNING_SUBJECTS;
"main"
}   
{