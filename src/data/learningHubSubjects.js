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


const makeExpandedLesson = (id, titleEn, titleHi, objective, body, points, activity, mistakes, summary) => [
  titleEn + " / " + titleHi,
  body,
  {
    objectives: objective,
    content: { deepUnderstanding: body + " इसे वास्तविक परिस्थितियों, सही संदर्भ और नियमित अभ्यास के साथ जोड़कर समझें।", examples: points, commonMistakes: mistakes, summary },
    practice: [activity, "अपने शब्दों में 3 मुख्य बातें लिखें और एक वास्तविक उदाहरण दें।"],
    activity,
  },
];
const makeExpandedModules = (key, modules) => modules.map((m, mi) => ({
  id: key + "-module-" + (mi + 1), title: m.title, subtitle: m.subtitle,
  lessons: m.lessons.map((x, li) => makeExpandedLesson(key + "-lesson-" + (mi + 1) + "-" + (li + 1), ...x)),
}));
const EXPANDED_CONTENT = {
  "education-learning-skills": makeExpandedModules("education", [
    {title:"Foundation / आधार",subtitle:"सीखने की प्रकृति, लक्ष्य और अध्ययन की बुनियाद",lessons:[
      ["Learning Process","सीखने की प्रक्रिया","समझना कि सीखना केवल याद करना नहीं बल्कि समझ, recall, practice और feedback है।","Learning में attention, understanding, retrieval, practice और feedback मिलकर knowledge को मजबूत करते हैं।",["Attention","Active recall","Practice","Feedback"],"एक छोटा विषय पढ़कर किताब बंद करें और 5 points बिना देखे लिखें।",["सिर्फ rereading","एक बार पढ़कर mastery मान लेना"],"अच्छी learning में समझ, recall और application शामिल हैं।"],
      ["Learning Goals","सीखने के लक्ष्य","स्पष्ट और मापने योग्य learning goals बनाना।","एक उपयोगी goal बताता है कि learner क्या कर पाएगा, किस समय तक और किस स्तर पर।",["Specific target","Time limit","Resources","Review"],"अगले 7 दिनों के लिए daily learning target बनाएं।",["Vague goal","समय/output तय न करना"],"छोटे स्पष्ट goals नियमित progress बनाते हैं।"],
      ["Focus & Study Environment","एकाग्रता और अध्ययन वातावरण","ऐसा वातावरण बनाना जिसमें ध्यान और consistency बनी रहे।","कम distractions, व्यवस्थित सामग्री, तय समय और focused sessions study quality सुधारते हैं।",["Phone control","Study space","Focused sessions","Breaks"],"25 मिनट का distraction-free study session करें।",["Notifications","बिना break बहुत देर पढ़ना"],"Focus भी practice से विकसित होने वाली skill है।"]
    ]},
    {title:"Study Methods / अध्ययन विधियाँ",subtitle:"Reading, notes, memory और revision",lessons:[
      ["Effective Reading","प्रभावी पठन","Text का main idea और important information पहचानना।","Preview, questions, reading, recall और review passive reading से अधिक उपयोगी हैं।",["Preview","Questions","Main idea","Recall"],"एक page पढ़कर 5-line summary लिखें।",["हर शब्द underline करना","Summary copy करना"],"अच्छा reading information को meaning में बदलता है।"],
      ["Note Making","नोट्स बनाना","Revision-friendly notes बनाना।","Headings, keywords, examples और questions रखें; पूरा paragraph copy करने से revision कठिन होता है।",["Keywords","Bullets","Examples","Questions"],"एक lesson के लिए one-page notes बनाएं।",["पूरा text copy करना","सिर्फ decoration"],"अच्छे notes छोटे, स्पष्ट और revision-friendly होते हैं।"],
      ["Memory & Revision","स्मृति और पुनरावृत्ति","Active recall और spaced revision का उपयोग करना।","Information को intervals पर recall करना memory को मजबूत करता है और weak areas दिखाता है।",["Active recall","Spaced repetition","Flash questions","Teach-back"],"10 facts को आज, 2 दिन बाद और 1 सप्ताह बाद recall करें।",["केवल rereading","सिर्फ परीक्षा से पहले पढ़ना"],"Memory नियमित retrieval और revision से मजबूत होती है।"]
    ]},
    {title:"Application / प्रयोग",subtitle:"अभ्यास, समस्या समाधान और communication",lessons:[
      ["Active Learning","सक्रिय सीखना","करके, समझाकर और प्रश्न पूछकर सीखना।","Active learning में learner information को task में लागू करता है और feedback से सुधारता है।",["Practice","Questioning","Discussion","Teach-back"],"किसी concept को 3 मिनट में दूसरे व्यक्ति को समझाएं।",["Passive listening","Feedback से बचना"],"Application learning को मजबूत करती है।"],
      ["Problem Solving","समस्या समाधान","समस्या को define, analyse, solve और review करना।","Problem solving में root cause, evidence, constraints और options को अलग देखना उपयोगी है।",["Define","Causes","Options","Review"],"दैनिक समस्या पर 4-step solution sheet बनाएं।",["पहला अनुमान मानना","Review न करना"],"Structured thinking बेहतर solutions में मदद करती है।"],
      ["Communication of Learning","सीखी बात का संचार","सीखी बात को सरल और स्पष्ट बताना।","अच्छी explanation में context, main idea, example और conclusion होता है।",["Simple language","Example","Questions","Summary"],"एक concept का Hindi और simple English explanation बनाएं।",["बहुत technical भाषा","उदाहरण न देना"],"ज्ञान की उपयोगिता स्पष्ट communication से बढ़ती है।"]
    ]},
    {title:"Growth & Assessment / विकास और आकलन",subtitle:"Self-assessment, digital learning और lifelong learning",lessons:[
      ["Self Assessment","स्व-मूल्यांकन","अपनी strengths, gaps और progress पहचानना।","Assessment बताता है कि क्या आता है, कहाँ गलती है और आगे क्या सीखना है।",["Recall test","Practice evidence","Mistake log","Next target"],"10-question self-test बनाकर गलत answers का कारण लिखें।",["केवल score देखना","गलतियों का कारण न देखना"],"Assessment learning को बेहतर बनाने का tool है।"],
      ["Digital Learning Resources","डिजिटल learning resources","Online resources को credibility और purpose के आधार पर चुनना।","Author, source, date, evidence और purpose देखना जरूरी है।",["Official sources","Reliable references","Date","Evidence"],"एक online resource की source और date जाँचें।",["Random forward","Source verify न करना"],"Digital learning में source literacy core skill है।"],
      ["Lifelong Learning","आजीवन सीखना","बदलती जरूरतों के अनुसार लगातार सीखने की आदत बनाना।","Technology और work बदलते हैं; curiosity, reflection और upskilling adaptability बढ़ाते हैं।",["Curiosity","Practice","Upskilling","Reflection"],"अगले 6 महीनों के लिए 3 skills का roadmap बनाएं।",["सीखना exam तक सीमित करना","पुरानी जानकारी review न करना"],"Lifelong learning adaptability बनाए रखती है।"]
    ]}
  ]),
  "skill-development": makeExpandedModules("skills", [
    {title:"Skill Foundation / कौशल आधार",subtitle:"Skill, goal और practice की बुनियाद",lessons:[
      ["What is a Skill?","कौशल क्या है?","Knowledge और वास्तविक performance के बीच अंतर समझना।","Skill वह capability है जिसे practice के बाद वास्तविक task में consistently उपयोग किया जा सके।",["Knowledge","Practice","Performance","Feedback"],"एक skill के knowledge और practical performance को अलग लिखें।",["Certificate को skill मानना","Practice छोड़ना"],"Skill का प्रमाण वास्तविक काम करने की क्षमता है।"],
      ["Skill Gap Analysis","कौशल अंतर विश्लेषण","Current ability और target requirement का gap पहचानना।","Target role/task की requirements को current capability से compare करके learning priority तय करें।",["Target","Current level","Gap","Action"],"किसी target skill की 5 requirements और अपनी level लिखें।",["बिना evidence self-rating","सिर्फ weakness देखना"],"Gap analysis targeted training बनाता है।"],
      ["Practice Planning","अभ्यास योजना","Skill को measurable practice में बदलना।","Effective practice gradual difficulty, repetition, feedback और measurable output पर आधारित होती है।",["Daily practice","Progression","Feedback","Output"],"एक skill का 14-day practice plan बनाएं।",["सिर्फ आसान task","Progress measure न करना"],"Measurable practice improvement दिखाती है।"]
    ]},
    {title:"Work Skills / कार्य कौशल",subtitle:"Communication, teamwork और ethics",lessons:[
      ["Professional Communication","व्यावसायिक संचार","Instructions, updates और feedback को स्पष्ट communicate करना।","Professional message में context, purpose, respectful tone और expected action स्पष्ट होना चाहिए।",["Clear message","Listening","Written record","Feedback"],"एक अस्पष्ट instruction को professional message में बदलें।",["Assumptions","Aggressive tone"],"Clear communication errors कम कर सकती है।"],
      ["Teamwork","टीमवर्क","Shared goal, roles और accountability के साथ काम करना।","Team performance के लिए role clarity, coordination और responsibility जरूरी हैं।",["Shared goal","Roles","Coordination","Accountability"],"एक project के लिए 4 roles और responsibilities तय करें।",["Role overlap","Information hide करना"],"Teamwork में individual contribution और common goal दोनों जरूरी हैं।"],
      ["Professional Ethics","कार्य नैतिकता","Honesty, quality, punctuality और responsibility को काम में लागू करना।","Professional conduct में commitments, confidentiality, respectful behaviour और reliable work शामिल हैं।",["Punctuality","Quality","Honesty","Confidentiality"],"अपने काम की 8-point ethics checklist बनाएं।",["False claims","Unverified work"],"Trust reliable और responsible behaviour से बनता है।"]
    ]},
    {title:"Employability / रोजगार कौशल",subtitle:"Resume, interview और workplace readiness",lessons:[
      ["Resume & Portfolio","रिज्यूमे और पोर्टफोलियो","Relevant skills और वास्तविक achievements को evidence के साथ प्रस्तुत करना।","Resume target role की relevant skills, projects और outcomes दिखाता है; portfolio practical proof दे सकता है।",["Relevant skills","Projects","Achievements","Evidence"],"एक target role का one-page resume outline बनाएं।",["False claims","Unrelated details"],"Resume evidence-based और role-focused होना चाहिए।"],
      ["Interview Skills","साक्षात्कार कौशल","Preparation और truthful examples के साथ interview देना।","Interview preparation में role research, examples, listening और questions शामिल हैं।",["Role research","Examples","Listening","Questions"],"5 common interview questions के truthful answers लिखें।",["Fake answers","Question पूरा न सुनना"],"Preparation clarity बढ़ाती है और honesty credibility बनाए रखती है।"],
      ["Workplace Readiness","कार्यस्थल तैयारी","पहले दिन से responsible और productive बनने की तैयारी करना।","Work readiness में attendance, tools, safety, communication, reporting और learning attitude शामिल हैं।",["Attendance","Tools","Safety","Reporting"],"किसी नए workplace का first-week checklist बनाएं।",["Rules न पढ़ना","Problem छिपाना"],"Ready worker पूछता है, सीखता है और report करता है।"]
    ]},
    {title:"Skill to Opportunity / कौशल से अवसर",subtitle:"Self-employment, quality और improvement",lessons:[
      ["Self Employment Basics","स्वरोजगार की बुनियाद","Skill को product या service opportunity में बदलना।","Self-employment में customer need, skill, cost, pricing, quality और records साथ देखने पड़ते हैं।",["Customer need","Cost","Price","Quality"],"अपनी skill से एक service और basic cost items लिखें।",["Cost न calculate करना","Overpromise"],"Sustainable opportunity में skill, need और economics का संतुलन जरूरी है।"],
      ["Quality & Customer Service","गुणवत्ता और ग्राहक सेवा","Quality standards तय करना और respectful service देना।","Delivery से पहले quality criteria तय करें, feedback लें और repeat errors record करें।",["Quality","Timeliness","Feedback","Correction"],"एक service के 5 quality standards बनाएं।",["Feedback ignore करना","Delay communicate न करना"],"Quality और trust repeat opportunities को प्रभावित करते हैं।"],
      ["Continuous Improvement","निरंतर सुधार","हर task के बाद review करके process बेहतर करना।","Plan-do-check-improve cycle errors, time और waste कम कर सकती है।",["Review","Root cause","Small change","Measure"],"किसी task की एक गलती चुनकर improvement action लिखें।",["गलती दोहराना","Result measure न करना"],"छोटे लगातार सुधार skill को मजबूत करते हैं।"]
    ]}
  ]),
  "agriculture-rural-development": makeExpandedModules("agri", [
    {title:"Agriculture Foundation / कृषि आधार",subtitle:"मिट्टी, फसल, बीज और मौसम",lessons:[
      ["Soil Health","मृदा स्वास्थ्य","Soil structure, organic matter, fertility और testing की मूल समझ।","Healthy soil में structure, water holding, nutrients और biological activity का संतुलन होता है।",["Soil texture","Organic matter","pH awareness","Soil testing"],"अपने खेत/बगीचे के लिए soil-test की जरूरत note करें।",["बिना test input बढ़ाना","हर crop के लिए soil समान मानना"],"Soil testing input decisions का बेहतर आधार देता है।"],
      ["Crop Selection & Seasons","फसल चयन और मौसम","Location, season, water और market के अनुसार crop planning करना।","Crop planning में climate, soil, irrigation, duration, pest risk और local demand साथ देखें।",["Season","Water need","Duration","Market"],"अपने क्षेत्र की 3 crops की requirements compare करें।",["केवल price देखकर चुनना","Water ignore करना"],"Crop choice local conditions और risk के अनुसार होनी चाहिए।"],
      ["Seeds & Planting","बीज और बुवाई","Quality seed, suitable variety और planting practices समझना।","Seed quality, variety, sowing time, depth और spacing crop establishment को प्रभावित करते हैं।",["Quality seed","Variety","Timing","Spacing"],"किसी crop के recommended seed source और sowing window लिखें।",["Unknown seed source","Spacing ignore करना"],"अच्छी शुरुआत healthy crop stand की नींव है।"]
    ]},
    {title:"Farm Management / खेत प्रबंधन",subtitle:"पानी, पोषण और crop care",lessons:[
      ["Water Management","जल प्रबंधन","Crop water requirement और efficient irrigation समझना।","Water need crop stage, soil और weather पर निर्भर करती है; overwatering भी नुकसान कर सकता है।",["Crop stage","Soil moisture","Irrigation","Drainage"],"अपने field के water source और irrigation method का map बनाएं।",["Fixed watering","Drainage ignore करना"],"Water management का लक्ष्य सही समय पर पर्याप्त पानी है।"],
      ["Plant Nutrition","पौध पोषण","Balanced nutrients और soil-test based management समझना।","Plants को macro और micronutrients चाहिए; testing और diagnosis management को बेहतर बनाते हैं।",["N-P-K","Micronutrients","Organic matter","Soil test"],"किसी fertilizer label पर nutrient percentage पढ़ें।",["Blind fertilizer use","Dose बिना guidance तय करना"],"Balanced nutrition crop health और input efficiency के लिए जरूरी है।"],
      ["Pest & Disease Management","कीट और रोग प्रबंधन","Crop problems की सही पहचान और integrated management समझना।","पहले diagnosis करें; monitoring, sanitation, cultural/biological methods और आवश्यकता पर approved controls देखें।",["Scouting","Diagnosis","Cultural control","Safe control"],"साप्ताहिक crop scouting के 5 observation points तय करें।",["Diagnosis के बिना spray","Safety label ignore करना"],"सही diagnosis unnecessary pesticide use घटा सकता है।"]
    ]},
    {title:"Rural Livelihoods / ग्रामीण आजीविका",subtitle:"पशुपालन, post-harvest और समूह",lessons:[
      ["Livestock Basics","पशुपालन की बुनियाद","Feed, water, shelter, hygiene और veterinary care समझना।","Livestock health nutrition, housing, hygiene और timely veterinary support पर निर्भर करती है।",["Feed","Water","Shelter","Veterinary care"],"अपने क्षेत्र की veterinary contact और vaccination record व्यवस्था note करें।",["बीमारी में देर","Unsafe feed/water"],"Prevention और timely veterinary support महत्वपूर्ण हैं।"],
      ["Post Harvest Management","कटाई बाद प्रबंधन","Grading, drying, storage और packaging से losses कम करना।","Harvest के बाद moisture, cleanliness, sorting और storage conditions quality और value को प्रभावित करते हैं।",["Harvest timing","Grading","Drying","Storage"],"एक local crop की post-harvest loss points सूची बनाएं।",["गीला produce store करना","Storage hygiene ignore करना"],"Post-harvest management income और food quality दोनों को प्रभावित करता है।"],
      ["Farmer Groups & Enterprise","किसान समूह और स्थानीय उद्यम","Collective buying, aggregation और market access समझना।","Groups inputs, knowledge, aggregation और shared infrastructure में मदद कर सकते हैं जब roles और records स्पष्ट हों।",["Aggregation","Shared services","Records","Market access"],"एक farmer group के roles और record list बनाएं।",["Records न रखना","Roles अस्पष्ट रखना"],"सहयोग की sustainability के लिए governance और records जरूरी हैं।"]
    ]},
    {title:"Sustainable Rural Development / टिकाऊ ग्रामीण विकास",subtitle:"Climate risk, resources और farm records",lessons:[
      ["Climate-Smart Agriculture","जलवायु-स्मार्ट कृषि","Weather risk और resource efficiency के अनुसार planning करना।","Diversification, moisture conservation, timely information और risk planning resilience बढ़ा सकते हैं।",["Diversification","Moisture conservation","Weather info","Risk plan"],"अपने farm के 5 weather risks और mitigation action लिखें।",["Single plan","Weather info ignore करना"],"Resilience का अर्थ risk समझकर तैयारी और विकल्प रखना है।"],
      ["Natural Resource Conservation","प्राकृतिक संसाधन संरक्षण","Soil, water और biodiversity को लंबे समय तक बचाने की सोच।","Conservation practices erosion, water loss और soil degradation कम कर सकती हैं।",["Mulching","Soil protection","Water harvesting","Biodiversity"],"अपने क्षेत्र के लिए 3 conservation practices चुनें।",["Short-term yield only","Erosion ignore करना"],"Resource conservation future productivity का आधार है।"],
      ["Farm Records & Planning","खेत रिकॉर्ड और योजना","Input, labour, yield और sales records से decisions बेहतर करना।","Simple records cost, production, sales और problems compare करने देते हैं और next season planning में मदद करते हैं।",["Input record","Labour","Yield","Sales"],"एक crop की simple cost-and-yield sheet बनाएं।",["बाद में अनुमान से भरना","Receipts खो देना"],"साफ records बेहतर decisions और accountability में मदद करते हैं।"]
    ]}
  ]),
  "women-child-development": makeExpandedModules("wcd", [
    {title:"Rights & Dignity / अधिकार और गरिमा",subtitle:"समानता, बाल अधिकार और gender awareness",lessons:[
      ["Equality & Dignity","समानता और गरिमा","महिलाओं और बच्चों के सम्मान, समान अवसर और non-discrimination की समझ।","Dignity में respect, safety, consent और equal opportunity का महत्व शामिल है।",["Equal opportunity","Dignity","Respect","Non-discrimination"],"Community setting में equal opportunity बढ़ाने के 3 actions लिखें।",["Stereotyping","Participation रोकना"],"सम्मान और समान अवसर सुरक्षित समाज की नींव हैं।"],
      ["Child Rights & Protection","बाल अधिकार और संरक्षण","बच्चों की safety, education, health और protection की मूल समझ।","Child protection का focus safe environment, education, health, care और abuse/exploitation से सुरक्षा पर है।",["Safety","Education","Health","Protection"],"अपने क्षेत्र के verified child-support resources की list बनाने की योजना बनाएं।",["Warning signs ignore करना","बच्चे की बात dismiss करना"],"Child safety में timely attention और appropriate support महत्वपूर्ण हैं।"],
      ["Gender Awareness","लैंगिक जागरूकता","Gender stereotypes पहचानना और fair participation बढ़ाना।","Gender roles बदल सकते हैं; education, work, household responsibility और decision-making में fairness महत्वपूर्ण है।",["Stereotypes","Shared responsibility","Education","Participation"],"घर/संस्था में एक responsibility पहचानें जिसे fair तरीके से share किया जा सके।",["'यह काम केवल...' धारणा","Unequal opportunity"],"Gender awareness fairness को बढ़ावा देती है।"]
    ]},
    {title:"Health & Development / स्वास्थ्य और विकास",subtitle:"Nutrition, hygiene और adolescence",lessons:[
      ["Women & Child Nutrition","महिला और बाल पोषण","Life-stage के अनुसार balanced nutrition की मूल समझ।","Nutrition needs age, activity और life stage के अनुसार बदलती हैं; diverse foods और qualified guidance महत्वपूर्ण हैं।",["Balanced diet","Protein","Micronutrients","Food safety"],"परिवार के एक दिन के भोजन की food-group diversity checklist बनाएं।",["एक group पर निर्भर रहना","Food safety ignore करना"],"Nutrition में variety, adequacy और safe practices महत्वपूर्ण हैं।"],
      ["Hygiene & Safe Water","स्वच्छता और सुरक्षित जल","Handwashing, sanitation और safe water का महत्व समझना।","Hygiene infection risk घटाती है; safe drinking water और sanitation community health के लिए महत्वपूर्ण हैं।",["Handwashing","Safe water","Sanitation","Clean surroundings"],"घर/केंद्र के hygiene points की checklist बनाएं।",["Visible dirt को ही cleanliness मानना","Water storage खुला रखना"],"Basic hygiene disease prevention का आधार है।"],
      ["Adolescent Development","किशोरावस्था और विकास","Puberty और emotional/social changes को respectful तरीके से समझना।","Adolescence में physical, emotional और social changes होते हैं; accurate information, privacy और trusted support जरूरी हैं।",["Puberty","Emotions","Privacy","Trusted support"],"किशोरों के लिए verified age-appropriate resources की list बनाएं।",["Shaming","Myths को facts मानना"],"Adolescent health education respectful और accurate होनी चाहिए।"]
    ]},
    {title:"Safety & Empowerment / सुरक्षा और सशक्तिकरण",subtitle:"Personal, digital और educational safety",lessons:[
      ["Personal Safety","व्यक्तिगत सुरक्षा","Unsafe situations, boundaries और help-seeking समझना।","Safety planning में trusted contacts, safe places, boundaries और emergency support की जानकारी शामिल हो सकती है।",["Boundaries","Trusted contacts","Safe places","Help-seeking"],"Trusted-contact और emergency information list सुरक्षित रखें।",["Unsafe situation secret रखना","Help में देर करना"],"Safety में timely help और trusted support शामिल हैं।"],
      ["Digital Safety for Women & Children","महिला और बच्चों की डिजिटल सुरक्षा","Privacy, passwords और online abuse से बचाव समझना।","Online safety में privacy settings, strong passwords, block/report और evidence preservation शामिल हैं।",["Privacy","Passwords","Block/report","Evidence"],"परिवार के लिए 8-point digital safety checklist बनाएं।",["OTP share करना","Private evidence public करना"],"Digital safety में prevention और appropriate reporting जरूरी हैं।"],
      ["Education & Empowerment","शिक्षा और सशक्तिकरण","Education, skills और informed decision-making को empowerment से जोड़ना।","Education capability और opportunities बढ़ा सकती है; digital और financial literacy practical independence में सहायक हैं।",["Education","Skills","Digital literacy","Financial awareness"],"Community में women/girls learning के 3 barriers और support actions लिखें।",["Capability को gender से जोड़ना","Learning opportunities सीमित करना"],"Empowerment में knowledge, skills, voice और opportunities शामिल हैं।"]
    ]},
    {title:"Family & Community Support / परिवार और समुदाय",subtitle:"Parenting, inclusion और referral awareness",lessons:[
      ["Positive Parenting","सकारात्मक पालन-पोषण","Respectful communication और age-appropriate boundaries समझना।","Positive parenting में listening, clear boundaries, routines, encouragement और non-violent discipline शामिल हैं।",["Listening","Boundaries","Routine","Encouragement"],"एक सप्ताह daily 10-minute child listening time तय करें।",["अपमानित करना","हर गलती पर केवल punishment"],"Respectful communication trust और learning को support करती है।"],
      ["Inclusion & Accessibility","समावेशन और पहुंच","Different abilities और backgrounds के लिए inclusive environment बनाना।","Inclusion में barriers पहचानना और accessible communication, participation और reasonable support देना शामिल है।",["Accessible space","Simple language","Participation","Support"],"अपने learning/community space में 5 accessibility barriers पहचानें।",["सभी needs समान मानना","Feedback न लेना"],"Inclusive design participation आसान बनाता है।"],
      ["Support & Referral Awareness","सहायता और रेफरल जागरूकता","Serious concerns में appropriate professional/official support तक referral समझना।","Volunteers awareness दे सकते हैं, लेकिन medical, legal या protection matters में qualified services तक referral जरूरी हो सकता है।",["Listen","Safe documentation","Refer","Confidentiality"],"अपने क्षेत्र की verified support services list बनाने की योजना बनाएं।",["Unqualified advice","Confidential information share करना"],"सही referral सुरक्षित support का हिस्सा है।"]
    ]}
  ]),
  "digital-safety-cyber-awareness": makeExpandedModules("cyber", [
    {title:"Cyber Foundation / साइबर आधार",subtitle:"Threats, accounts और personal data",lessons:[
      ["Common Cyber Threats","सामान्य साइबर खतरे","Phishing, malware, fraud और social engineering की मूल समझ।","Cyber threats technology के साथ human behaviour को भी target कर सकते हैं; urgency, secrecy और unexpected requests warning signs हैं।",["Phishing","Malware","Scams","Social engineering"],"अपने लिए 10 cyber warning signs की list बनाएं।",["Urgency पर तुरंत action","Unknown link/file खोलना"],"Threat पहचानना defensive cyber safety का पहला कदम है।"],
      ["Passwords & MFA","पासवर्ड और MFA","Unique passwords और multi-factor authentication से account protection समझना।","हर important account के लिए unique strong password/passphrase और available होने पर MFA उपयोगी है।",["Unique passwords","Passphrase","MFA","Recovery"],"Important accounts की MFA availability checklist बनाएं।",["Same password everywhere","OTP/recovery code share करना"],"Account security layered protection पर निर्भर करती है।"],
      ["Personal Data & Privacy","व्यक्तिगत डेटा और गोपनीयता","Sensitive personal information को जरूरत के अनुसार share और protect करना।","Identity details, financial information और credentials अलग sensitivity रखते हैं; unnecessary sharing risk बढ़ा सकता है।",["Data minimization","Privacy settings","Permissions","Secure sharing"],"Phone/app permissions की privacy review checklist बनाएं।",["हर app को सभी permissions","Sensitive data public करना"],"Privacy का उद्देश्य जरूरत भर data share करना है।"]
    ]},
    {title:"Scam & Phishing Defense / ठगी से बचाव",subtitle:"Messages, calls और digital payments",lessons:[
      ["Phishing Messages","फिशिंग संदेश","Suspicious email, SMS और social messages के red flags पहचानना।","Phishing trusted person/brand बनकर credentials, money या information लेने की कोशिश कर सकता है।",["Unexpected request","Urgency","Suspicious link","Credential request"],"एक sample message में red flags mark करें।",["Logo देखकर trust करना","Link destination check न करना"],"Appearance से अधिक source और request verify करें।"],
      ["Fraud Calls & Impersonation","फर्जी कॉल और पहचान की नकल","Impersonation और pressure tactics से सावधान रहना।","Scammers bank, police, courier, employer या support agent होने का दावा कर सकते हैं; independent verification जरूरी है।",["Caller identity","Pressure","Secret information","Verification"],"Suspicious caller के लिए stop-verify-report script लिखें।",["Caller के दिए number पर भरोसा","OTP/PIN बताना"],"High-pressure request को independent channel से verify करें।"],
      ["Safe Digital Payments","सुरक्षित डिजिटल भुगतान","UPI, cards और net banking में basic safety समझना।","Payment करते समय recipient, amount और authentication prompt देखें; receiving money के नाम पर PIN/OTP share नहीं किया जाता।",["Verify recipient","Check amount","Never share PIN/OTP","Official app"],"Family के साथ payment safety checklist review करें।",["Unknown collect request","PIN/OTP share करना"],"Payment security में verification और credential secrecy जरूरी हैं।"]
    ]},
    {title:"Device & Network Security / डिवाइस सुरक्षा",subtitle:"Updates, Wi-Fi, browsing और backups",lessons:[
      ["Updates & Security","अपडेट और सुरक्षा","OS और apps updated रखने की भूमिका समझना।","Security updates known vulnerabilities को address कर सकते हैं; trusted sources से updates लेना महत्वपूर्ण है।",["Security updates","Official stores","Supported software","Restart"],"अपने devices की update settings review करें।",["Unknown update links","Updates हमेशा टालना"],"Timely updates security maintenance का हिस्सा हैं।"],
      ["Wi-Fi & Public Networks","Wi-Fi और सार्वजनिक नेटवर्क","Network use में basic security precautions समझना।","Public networks में sensitive activity के लिए caution रखें; HTTPS और sharing controls check करें।",["Network name","HTTPS","Sharing controls","Trusted networks"],"Phone में hotspot और Wi-Fi sharing settings review करें।",["Unknown auto-connect","Open sharing"],"Network convenience के साथ security settings भी देखें।"],
      ["Backup & Recovery","बैकअप और रिकवरी","Important files और account recovery options तैयार रखना।","Backup accidental deletion, device loss और कुछ cyber incidents में recovery support कर सकता है; critical files की tested copy उपयोगी है।",["Important files","Multiple copies","Recovery test","Secure storage"],"अपने 10 important files की backup priority list बनाएं।",["Backup test न करना","सभी copies एक device में"],"Backup accessible और recoverable होना चाहिए।"]
    ]},
    {title:"Incident Response & Digital Citizenship / घटना प्रतिक्रिया",subtitle:"Incident के बाद action और responsible online behaviour",lessons:[
      ["After a Cyber Incident","साइबर घटना के बाद","Compromised account या scam के बाद defensive steps समझना।","Situation के अनुसार password बदलना, sessions revoke करना, official support से contact करना और evidence सुरक्षित रखना उपयोगी हो सकता है।",["Secure account","Revoke access","Official support","Evidence"],"Important accounts के official recovery routes की verified list बनाएं।",["Scammer से बहस करना","Evidence नष्ट करना"],"Incident response में जल्दी, शांत और verified action जरूरी है।"],
      ["Reporting & Evidence","रिपोर्टिंग और साक्ष्य","Cyber abuse/fraud में evidence preservation और appropriate reporting समझना।","Screenshots, timestamps, transaction references और relevant messages useful evidence हो सकते हैं; report appropriate official channel को करें।",["Screenshots","Timestamps","Transaction details","Official reporting"],"Hypothetical scam के लिए evidence checklist बनाएं।",["Evidence public post करना","Fake report बनाना"],"Evidence सुरक्षित रखना और सही channel चुनना महत्वपूर्ण है।"],
      ["Digital Citizenship","डिजिटल नागरिकता","Privacy, respect, consent और verification के साथ responsible online behaviour अपनाना।","Responsible digital citizens misinformation verify करते हैं, harassment से बचते हैं और दूसरों की privacy का सम्मान करते हैं।",["Verify before share","Respect privacy","Consent","Report abuse"],"Forwarded claim share करने से पहले 5-step verification checklist बनाएं।",["Unverified forward","Private content बिना consent share करना"],"Digital responsibility security के साथ respectful behaviour भी है।"]
    ]}
  ])
};
const expandedFinalAssessment = (key) => ({
  passPercent: 70,
  questions: EXPANDED_CONTENT[key].flatMap(m => m.lessons.slice(0,2).map(l => ({
    q: "इस विषय में सही learning approach क्या है?",
    options: ["समझकर, सुरक्षित तरीके से अभ्यास और review करना", "बिना समझे तुरंत action लेना", "Unverified जानकारी पर निर्भर रहना", "गलतियों को ignore करना"],
    answer: 0
  }))).slice(0, 8)
});

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
    status: "available",
    details: { level: "Foundation to Practical", duration: "Self-paced" },
    modules: EXPANDED_CONTENT["education-learning-skills"],
    activities: EXPANDED_CONTENT["education-learning-skills"].flatMap(m => m.lessons.map(l => l[2]?.practice?.[0]).filter(Boolean)).slice(0, 8),
    finalAssessment: expandedFinalAssessment("education-learning-skills"),
    shareImage: createSvgDataUri("Education & Learning Skills", "शिक्षा एवं सीख कौशल", "#1e5c3d", "Learn"),
  }),
  buildCourse({
    id: "skill-development",
    titleEn: "Skill Development",
    titleHi: "कौशल विकास",
    category: "Skill Development / कौशल विकास",
    description: "Practical skill building, job readiness, income generation and work confidence.",
    status: "available",
    details: { level: "Foundation to Practical", duration: "Self-paced" },
    modules: EXPANDED_CONTENT["skill-development"],
    activities: EXPANDED_CONTENT["skill-development"].flatMap(m => m.lessons.map(l => l[2]?.practice?.[0]).filter(Boolean)).slice(0, 8),
    finalAssessment: expandedFinalAssessment("skill-development"),
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
    status: "available",
    details: { level: "Foundation to Practical", duration: "Self-paced" },
    modules: EXPANDED_CONTENT["agriculture-rural-development"],
    activities: EXPANDED_CONTENT["agriculture-rural-development"].flatMap(m => m.lessons.map(l => l[2]?.practice?.[0]).filter(Boolean)).slice(0, 8),
    finalAssessment: expandedFinalAssessment("agriculture-rural-development"),
    shareImage: createSvgDataUri("Agriculture & Rural Development", "कृषि एवं ग्रामीण विकास", "#4a7c33", "Agri"),
  }),
  buildCourse({
    id: "women-child-development",
    titleEn: "Women & Child Development",
    titleHi: "महिला एवं बाल विकास",
    category: "Women & Child Development / महिला एवं बाल विकास",
    description: "Women empowerment, child rights, health, education and safety awareness.",
    status: "available",
    details: { level: "Foundation to Practical", duration: "Self-paced" },
    modules: EXPANDED_CONTENT["women-child-development"],
    activities: EXPANDED_CONTENT["women-child-development"].flatMap(m => m.lessons.map(l => l[2]?.practice?.[0]).filter(Boolean)).slice(0, 8),
    finalAssessment: expandedFinalAssessment("women-child-development"),
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
    status: "available",
    details: { level: "Foundation to Practical", duration: "Self-paced" },
    modules: EXPANDED_CONTENT["digital-safety-cyber-awareness"],
    activities: EXPANDED_CONTENT["digital-safety-cyber-awareness"].flatMap(m => m.lessons.map(l => l[2]?.practice?.[0]).filter(Boolean)).slice(0, 8),
    finalAssessment: expandedFinalAssessment("digital-safety-cyber-awareness"),
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