/**
 * SSF Learning Hub — Master Course Architecture
 *
 * This file defines the stable learning contract used by future courses.
 * Existing LearningHubV2 content is intentionally not removed or rewritten here.
 *
 * Flow:
 * Explore -> Course Overview -> Modules -> Lessons -> Practice -> Assessment
 * -> Completion -> Certificate -> Verification
 */

export const LEARNING_LEVELS = [
  { id: "foundation", en: "Foundation", hi: "आधार स्तर" },
  { id: "beginner", en: "Beginner", hi: "प्रारंभिक स्तर" },
  { id: "intermediate", en: "Intermediate", hi: "मध्यवर्ती स्तर" },
  { id: "advanced", en: "Advanced", hi: "उन्नत स्तर" },
  { id: "practical", en: "Practical / Professional", hi: "व्यावहारिक / व्यावसायिक स्तर" },
];

export const LESSON_COMPONENTS = [
  "objectives", "prerequisites", "learn", "easyExplanation",
  "deepUnderstanding", "examples", "visual", "video", "audio",
  "practicalApplication", "activity", "practice", "commonMistakes",
  "knowledgeCheck", "reflection", "summary",
];

export const ASSESSMENT_TYPES = [
  "diagnostic", "formative", "module", "practical", "final",
];

export const CERTIFICATE_REQUIREMENTS = {
  lessons: "required",
  activities: "required",
  assessments: "required",
  finalAssessment: "required",
  completion: 100,
  accountAtCertificateStage: true,
};

export const COURSE_TYPES = [
  { id: "awareness", en: "Awareness", hi: "जागरूकता पाठ्यक्रम" },
  { id: "foundation", en: "Foundation Course", hi: "आधार पाठ्यक्रम" },
  { id: "skill", en: "Skill Course", hi: "कौशल पाठ्यक्रम" },
  { id: "advanced", en: "Advanced Course", hi: "उन्नत पाठ्यक्रम" },
  { id: "certificate", en: "Certificate Course", hi: "प्रमाणपत्र पाठ्यक्रम" },
  { id: "resource", en: "Learning Resource", hi: "अध्ययन संसाधन" },
];

/*
 * Official course identity.
 * The id must remain stable once a course is published.
 * The title is the canonical display name used on cards, learning pages,
 * dashboards, assessments, certificates and verification records.
 */
export function createCourseDefinition({
  id,
  title,
  category,
  type = "skill",
  level = "beginner",
  description = "",
  audience = "",
  prerequisites = [],
  outcomes = [],
  learningHours = 0,
  modules = [],
  resources = [],
  version = "1.0",
  lastReviewed = "",
}) {
  if (!id || !title || !category) {
    throw new Error("Course id, title and category are required.");
  }

  return {
    id, title, category, type, level, description, audience,
    prerequisites, outcomes, learningHours, modules, resources,
    version, lastReviewed,
    certificate: { ...CERTIFICATE_REQUIREMENTS },
  };
}

export function createModule({ id, title, description = "", lessons = [], assessment = null }) {
  return { id, title, description, lessons, assessment };
}

export function createLesson({
  id,
  title,
  objectives = [],
  prerequisites = [],
  content = {},
  practice = [],
  activity = null,
  assessment = null,
}) {
  return {
    id, title, objectives, prerequisites, content,
    practice, activity, assessment,
  };
}

/*
 * Visual identity contract for every shareable learning section.
 * A section should use a topic-relevant photo, approved illustration,
 * or meaningful subject icon — never a random decorative image.
 */
export function createLearningVisual({
  type = "icon",
  src = "",
  alt = "",
  icon = "",
  credit = "",
}) {
  return { type, src, alt, icon, credit };
}

/*
 * Learning stays open to visitors. Account creation/login is required
 * only when the learner requests a certificate.
 */
export function canRequestCertificate({ completion = 0, finalPassed = false }) {
  return completion >= CERTIFICATE_REQUIREMENTS.completion && finalPassed;
}


/*
 * Flagship end-to-end course: Computer & Digital Basics.
 * This is the reference implementation for the full SSF learning pattern.
 * The same contract can be reused for the remaining subjects.
 */
export const FLAGSHIP_COURSE_ID = "computer-education";

export const FLAGSHIP_COMPUTER_COURSE = createCourseDefinition({
  id: FLAGSHIP_COURSE_ID,
  title: {
    en: "Computer & Digital Basics",
    hi: "कंप्यूटर एवं डिजिटल बेसिक्स",
  },
  category: "Education / शिक्षा",
  type: "certificate",
  level: "foundation",
  description: "A structured beginner-to-practical course covering computer fundamentals, files, documents, internet use, digital communication, cyber safety and everyday digital problem solving.",
  audience: "Students, first-time computer learners, volunteers, community learners and anyone building practical digital confidence.",
  prerequisites: ["No prior computer experience required."],
  outcomes: [
    "Identify basic computer hardware, software and common digital terms.",
    "Create, organize, rename, move and safely store files and folders.",
    "Use a browser, search effectively and evaluate basic online information.",
    "Create and manage simple digital documents and communicate professionally.",
    "Apply passwords, privacy, phishing awareness, updates and backup habits.",
    "Complete everyday digital tasks using a safe, step-by-step problem-solving approach.",
  ],
  learningHours: 12,
  version: "1.0",
  lastReviewed: "2026-09-30",
  modules: [
    createModule({
      id: "computer-foundation",
      title: { en: "Computer Foundations", hi: "कंप्यूटर की आधारभूत समझ" },
      description: "Understand what a computer is, how its major parts work together, and the vocabulary needed for practical use.",
      lessons: [
        createLesson({
          id: "what-is-a-computer",
          title: { en: "What is a Computer?", hi: "कंप्यूटर क्या है?" },
          objectives: ["Explain the basic purpose of a computer.", "Distinguish input, processing, storage and output."],
          content: {
            easyExplanation: "कंप्यूटर एक electronic system है जो input लेता है, instructions के अनुसार processing करता है, information को store कर सकता है और output देता है।",
            deepUnderstanding: "किसी भी digital task को Input → Processing → Storage/Memory → Output के रूप में समझने से अलग-अलग devices और applications को समझना आसान होता है।",
            examples: ["Keyboard से text input", "CPU द्वारा processing", "SSD में file storage", "Screen पर result"],
            commonMistakes: ["Computer को केवल CPU समझना", "RAM और permanent storage को एक ही मानना"],
            summary: "Computer को उसके parts से नहीं, बल्कि उसके complete information-processing cycle से समझें।"
          },
          practice: ["अपने आसपास 5 digital devices पहचानें और लिखें कि उनका input और output क्या है।"],
          activity: "एक simple Input → Process → Output diagram स्वयं बनाइए।"
        }),
        createLesson({
          id: "hardware-software",
          title: { en: "Hardware, Software & Operating Systems", hi: "हार्डवेयर, सॉफ्टवेयर एवं ऑपरेटिंग सिस्टम" },
          objectives: ["Differentiate hardware and software.", "Explain the role of an operating system."],
          content: {
            easyExplanation: "Hardware वे physical parts हैं जिन्हें छू सकते हैं; software instructions/programs हैं जो hardware से काम करवाते हैं। Operating system दोनों के बीच मुख्य working layer है।",
            deepUnderstanding: "Application, operating system, drivers और hardware अलग layers की तरह काम करते हैं; समस्या पहचानने में यह distinction बहुत उपयोगी है।",
            examples: ["Keyboard = hardware", "Browser = application software", "Windows/Linux/Android = operating system"],
            commonMistakes: ["हर software को operating system कहना", "hardware problem और application problem को एक समझना"],
            summary: "Hardware resources देता है; software instructions देता है; operating system resources को manage करता है।"
          },
          practice: ["अपने device के 5 hardware और 5 software examples लिखें।"],
          activity: "किसी एक common computer problem को hardware/software/OS category में classify करें।"
        }),
        createLesson({
          id: "computer-settings",
          title: { en: "Basic Settings & Responsible Use", hi: "मूल सेटिंग्स एवं जिम्मेदार उपयोग" },
          objectives: ["Locate common settings.", "Use updates and settings responsibly."],
          content: {
            easyExplanation: "Settings से language, display, network, accounts, privacy और security जैसी सुविधाएँ manage की जाती हैं।",
            deepUnderstanding: "हर setting बदलना जरूरी नहीं है; पहले उद्देश्य समझें, फिर change करें और sensitive options में सावधानी रखें।",
            examples: ["Language", "Wi‑Fi", "screen brightness", "user account", "software updates"],
            commonMistakes: ["अनजान security setting बदल देना", "updates को हमेशा बंद रखना"],
            summary: "Settings का उपयोग समझकर करें और security/privacy options को विशेष सावधानी से संभालें।"
          },
          practice: ["अपने device में 3 safe settings खोजें और उनका purpose लिखें।"],
          activity: "एक checklist बनाइए: language, network, update, account और privacy।"
        })
      ],
      assessment: { type: "module", passPercent: 70, questions: 10 }
    }),
    createModule({
      id: "files-documents",
      title: { en: "Files, Folders & Documents", hi: "फाइल, फोल्डर एवं दस्तावेज़" },
      description: "Build practical file-management and document skills.",
      lessons: [
        createLesson({
          id: "files-folders",
          title: { en: "Files & Folders", hi: "फाइल एवं फोल्डर" },
          objectives: ["Create an organized folder structure.", "Rename, copy, move and delete files safely."],
          content: {
            easyExplanation: "Folder को digital cupboard की तरह और file को उसके अंदर रखी चीज़ की तरह समझ सकते हैं।",
            deepUnderstanding: "Consistent naming and folder structure खोजने, backup लेने और गलत file share होने का risk कम करते हैं।",
            examples: ["SSF/Training/2026/Attendance", "Documents/Certificates/2026"],
            commonMistakes: ["सभी files Desktop पर रखना", "एक ही नाम की कई unclear copies बनाना"],
            summary: "Good file management = clear names + logical folders + safe backup."
          },
          practice: ["अपने learning material के लिए Year → Course → Module folders बनाइए।"],
          activity: "10 sample files को meaningful names और folders में organize करें।"
        }),
        createLesson({
          id: "documents-basics",
          title: { en: "Creating Useful Documents", hi: "उपयोगी डिजिटल दस्तावेज़ बनाना" },
          objectives: ["Create a readable document.", "Use headings, lists and consistent formatting."],
          content: {
            easyExplanation: "A good document is readable, structured and easy for another person to understand.",
            deepUnderstanding: "Heading hierarchy, spacing, tables and descriptive filenames make information reusable and accessible.",
            examples: ["Meeting note", "application letter", "simple report", "learning notes"],
            commonMistakes: ["बहुत सारे fonts", "heading hierarchy न रखना", "file version का नाम अस्पष्ट रखना"],
            summary: "Document design should serve clarity, not decoration."
          },
          practice: ["एक one-page bilingual learning note तैयार करें।"],
          activity: "एक खराब formatted paragraph को headings और bullets से सुधारें।"
        }),
        createLesson({
          id: "backup-storage",
          title: { en: "Storage & Backup", hi: "स्टोरेज एवं बैकअप" },
          objectives: ["Explain why backups matter.", "Choose an appropriate backup location."],
          content: {
            easyExplanation: "Backup का अर्थ important data की अलग सुरक्षित copy रखना है।",
            deepUnderstanding: "एक ही device पर एक ही copy रखना single point of failure बनाता है। Backup strategy में frequency, location और restore test महत्वपूर्ण हैं।",
            examples: ["External storage", "trusted cloud storage", "institutional backup"],
            commonMistakes: ["Backup बना कर कभी restore test न करना", "हर file को बिना सोच के public cloud पर डालना"],
            summary: "Backup तभी उपयोगी है जब copy सुरक्षित हो और जरूरत पर वापस लाई जा सके।"
          },
          practice: ["अपने 5 सबसे महत्वपूर्ण files चुनकर backup plan लिखें।"],
          activity: "एक restore-check checklist बनाइए।"
        })
      ],
      assessment: { type: "module", passPercent: 70, questions: 10 }
    }),
    createModule({
      id: "internet-communication",
      title: { en: "Internet & Digital Communication", hi: "इंटरनेट एवं डिजिटल संचार" },
      description: "Use the web, search information and communicate responsibly.",
      lessons: [
        createLesson({
          id: "internet-browser-search",
          title: { en: "Internet, Browser & Search", hi: "इंटरनेट, ब्राउज़र एवं खोज" },
          objectives: ["Explain browser vs search engine.", "Use focused search terms."],
          content: {
            easyExplanation: "Internet connected systems का network है; browser web pages खोलता है; search engine information खोजने में मदद करता है।",
            deepUnderstanding: "Search result मिलना और information सही होना अलग बातें हैं; source, date, author and evidence देखें।",
            examples: ["Official government site", "institutional website", "documentation"],
            commonMistakes: ["पहले result को automatically true मानना", "search query बहुत vague रखना"],
            summary: "Search skill का दूसरा भाग source evaluation है।"
          },
          practice: ["एक ही प्रश्न को 3 अलग search queries से खोजें और results compare करें।"],
          activity: "एक official source और एक unverified source के संकेतों की तुलना करें।"
        }),
        createLesson({
          id: "email-messaging",
          title: { en: "Email & Professional Messaging", hi: "ईमेल एवं पेशेवर संदेश" },
          objectives: ["Write a clear email.", "Use subject, greeting, context and action request."],
          content: {
            easyExplanation: "Professional message छोटा, स्पष्ट, respectful और action-oriented होना चाहिए।",
            deepUnderstanding: "Subject line, recipient, attachments and privacy सभी communication quality का हिस्सा हैं।",
            examples: ["Request for information", "meeting confirmation", "document submission"],
            commonMistakes: ["blank subject", "unclear request", "wrong attachment", "sensitive data खुले में भेजना"],
            summary: "Good digital communication reduces ambiguity and protects information."
          },
          practice: ["एक professional bilingual email draft करें।"],
          activity: "एक unclear message को clear action-request में बदलें।"
        }),
        createLesson({
          id: "online-information",
          title: { en: "Evaluating Online Information", hi: "ऑनलाइन जानकारी की जाँच" },
          objectives: ["Identify basic credibility signals.", "Cross-check important claims."],
          content: {
            easyExplanation: "Online information को source, date, evidence, purpose और corroboration के आधार पर जाँचें।",
            deepUnderstanding: "Urgency, emotional language, unsupported certainty और missing source verification के warning signs हो सकते हैं।",
            examples: ["Official notice vs forwarded screenshot", "primary source vs repost"],
            commonMistakes: ["forward को evidence मानना", "old information को current मानना"],
            summary: "Important information को original/official source तक trace करना बेहतर practice है।"
          },
          practice: ["किसी public claim को उसके original source तक trace करें।"],
          activity: "Source-check checklist: Who? When? Evidence? Original? Current?"
        })
      ],
      assessment: { type: "module", passPercent: 70, questions: 10 }
    }),
    createModule({
      id: "cyber-safety",
      title: { en: "Cyber Safety, Privacy & Security", hi: "साइबर सुरक्षा, गोपनीयता एवं सुरक्षा" },
      description: "Develop practical habits for safer digital use.",
      lessons: [
        createLesson({
          id: "passwords-accounts",
          title: { en: "Passwords & Accounts", hi: "पासवर्ड एवं खाते" },
          objectives: ["Explain strong password principles.", "Recognize account-security risks."],
          content: {
            easyExplanation: "Strong, unique credentials और available multi-factor authentication account protection मजबूत करते हैं।",
            deepUnderstanding: "एक password के leak होने पर multiple accounts प्रभावित हो सकते हैं; इसलिए reuse से बचना महत्वपूर्ण है।",
            examples: ["Unique passwords", "MFA", "account recovery options"],
            commonMistakes: ["एक password कई जगह रखना", "OTP/PIN share करना"],
            summary: "Credentials निजी सुरक्षा information हैं; इन्हें share नहीं करना चाहिए।"
          },
          practice: ["अपने accounts के लिए security checklist बनाइए—password reuse, MFA, recovery।"],
          activity: "एक imaginary phishing request में कौन-सी जानकारी नहीं देनी चाहिए, चिन्हित करें।"
        }),
        createLesson({
          id: "phishing-scams",
          title: { en: "Phishing, Scams & Social Engineering", hi: "फिशिंग, धोखाधड़ी एवं सोशल इंजीनियरिंग" },
          objectives: ["Recognize common phishing patterns.", "Pause and verify before acting."],
          content: {
            easyExplanation: "Phishing में attacker trusted person/service बनकर sensitive information या action लेने के लिए धोखा दे सकता है।",
            deepUnderstanding: "Fear, urgency, reward and authority जैसे psychological triggers का उपयोग हो सकता है।",
            examples: ["Fake login page", "urgent payment request", "fake support call"],
            commonMistakes: ["link देखकर तुरंत click करना", "caller identity verify न करना"],
            summary: "Stop → Inspect → Verify → Act is safer than instant response."
          },
          practice: ["3 hypothetical messages में phishing indicators चिन्हित करें।"],
          activity: "अपना personal verification rule लिखें: sensitive request आने पर किस independent channel से verify करेंगे?"
        }),
        createLesson({
          id: "privacy-updates-device-safety",
          title: { en: "Privacy, Updates & Device Safety", hi: "गोपनीयता, अपडेट एवं डिवाइस सुरक्षा" },
          objectives: ["Use sensible privacy settings.", "Understand why updates matter."],
          content: {
            easyExplanation: "Privacy का अर्थ यह समझना भी है कि कौन-सा data किस purpose से share हो रहा है। Updates security fixes और improvements ला सकते हैं।",
            deepUnderstanding: "Privacy और security एक ही चीज़ नहीं हैं: security protects systems/data; privacy concerns appropriate collection and use of personal information.",
            examples: ["App permissions", "screen lock", "updates", "secure Wi‑Fi habits"],
            commonMistakes: ["हर app को unnecessary permissions देना", "unknown software install करना"],
            summary: "Least-necessary access और timely updates safer defaults हैं।"
          },
          practice: ["अपने device पर unnecessary permissions की सूची बनाकर review करें।"],
          activity: "एक safe-device checklist तैयार करें।"
        })
      ],
      assessment: { type: "module", passPercent: 70, questions: 10 }
    }),
    createModule({
      id: "practical-digital-work",
      title: { en: "Practical Digital Work & Problem Solving", hi: "व्यावहारिक डिजिटल कार्य एवं समस्या समाधान" },
      description: "Apply the learning to real tasks and prepare for final assessment.",
      lessons: [
        createLesson({
          id: "digital-task-workflow",
          title: { en: "Plan a Digital Task", hi: "डिजिटल कार्य की योजना" },
          objectives: ["Break a task into steps.", "Check inputs, outputs and risks before acting."],
          content: {
            easyExplanation: "पहले goal स्पष्ट करें, फिर required information/tools, steps, expected result और risks लिखें।",
            deepUnderstanding: "Structured workflow errors कम करता है और troubleshooting आसान बनाता है।",
            examples: ["Prepare a report", "send an official email", "organize project files"],
            commonMistakes: ["बिना plan शुरू करना", "final check छोड़ देना"],
            summary: "Plan → Do → Check → Improve."
          },
          practice: ["एक वास्तविक low-risk digital task का 5-step plan बनाइए।"],
          activity: "अपने plan में एक quality-check step जोड़ें।"
        }),
        createLesson({
          id: "troubleshooting",
          title: { en: "Basic Troubleshooting", hi: "मूल समस्या समाधान" },
          objectives: ["Describe a problem clearly.", "Use safe troubleshooting steps."],
          content: {
            easyExplanation: "Problem को observe करें, reproduce करें, simple causes check करें और एक समय में एक safe change करें।",
            deepUnderstanding: "Guessing की जगह evidence-based troubleshooting से unnecessary changes और data loss का risk कम होता है।",
            examples: ["No internet", "application not responding", "file not found"],
            commonMistakes: ["बार-बार random settings बदलना", "important data बिना backup के risky repair करना"],
            summary: "Observe → Define → Check basics → Test → Document result."
          },
          practice: ["एक hypothetical 'internet not working' problem के लिए troubleshooting tree बनाइए।"],
          activity: "किसी solved problem का छोटा incident note बनाइए।"
        }),
        createLesson({
          id: "capstone-practical",
          title: { en: "Capstone: Complete a Digital Work Package", hi: "कैपस्टोन: डिजिटल कार्य पैकेज पूरा करें" },
          objectives: ["Combine file management, document creation, communication and safety.", "Review your own work against a checklist."],
          content: {
            easyExplanation: "Capstone में अलग-अलग skills को एक meaningful task में जोड़कर दिखाया जाता है।",
            deepUnderstanding: "Capability केवल अलग-अलग facts जानने से नहीं, बल्कि सही sequence में skills apply करने से दिखाई देती है।",
            examples: ["Create a one-page report, save it in a structured folder, back it up and send a professional email with the correct attachment."],
            commonMistakes: ["wrong file attachment", "unclear filename", "missing final review", "unsafe sharing"],
            summary: "A complete digital task should be accurate, organized, safe and communicable."
          },
          practice: ["Capstone package पूरा करें और self-checklist से review करें।"],
          activity: "Final self-review: Accuracy, Organization, Communication, Safety, Backup."
        })
      ],
      assessment: { type: "final", passPercent: 70, questions: 20, practicalRequired: true }
    })
  ],
  resources: [
    "Use official operating-system/device documentation for current settings.",
    "Use official cybersecurity guidance for current security recommendations.",
    "Check official government or institutional sources for current digital-service rules."
  ]
});

export const FLAGSHIP_COURSE_ASSESSMENTS = {
  "computer-foundation": [
    { q: "Computer का मुख्य काम क्या है?", options: ["Data को process करके useful output देना", "केवल internet चलाना", "केवल games चलाना", "केवल files print करना"], answer: 0 },
    { q: "Operating system का एक प्रमुख काम क्या है?", options: ["Hardware और software resources को manage करना", "हर website को सुरक्षित बनाना", "केवल email भेजना", "केवल documents लिखना"], answer: 0 }
  ],
  "files-documents": [
    { q: "File और folder में मुख्य अंतर क्या है?", options: ["File में content/data होता है; folder files को organize कर सकता है", "दोनों हमेशा एक ही चीज हैं", "Folder केवल internet पर होता है", "File में कभी data नहीं होता"], answer: 0 },
    { q: "Backup का उद्देश्य क्या है?", options: ["महत्वपूर्ण data की अतिरिक्त सुरक्षित copy रखना", "Files को हमेशा delete करना", "Password को public करना", "Storage को बिना कारण भरना"], answer: 0 }
  ],
  "internet-communication": [
    { q: "Search result की reliability जाँचते समय क्या देखना चाहिए?", options: ["Source, date, evidence और context", "केवल headline", "केवल forward count", "केवल anonymous comment"], answer: 0 },
    { q: "Professional email में क्या उपयोगी है?", options: ["Clear subject, respectful message और appropriate attachment", "Blank subject", "सिर्फ capital letters", "Unrelated attachments"], answer: 0 }
  ],
  "cyber-safety": [
    { q: "Phishing क्या है?", options: ["धोखे से sensitive information प्राप्त करने का प्रयास", "Computer cleaning", "Normal software update", "File compression"], answer: 0 },
    { q: "Strong account security में क्या मदद करता है?", options: ["Unique passwords और multi-factor authentication", "एक ही password हर जगह", "Password share करना", "Unknown links खोलना"], answer: 0 }
  ],
  "practical-digital-work": [
    { q: "Digital task शुरू करने से पहले क्या करना चाहिए?", options: ["Goal, required information और expected output स्पष्ट करना", "Randomly click करना", "Backup हटाना", "हर warning ignore करना"], answer: 0 },
    { q: "Basic troubleshooting में पहला उपयोगी कदम क्या है?", options: ["Problem को reproduce और clearly identify करना", "तुरंत device reset करना", "सब data delete करना", "बिना जाँचे hardware बदलना"], answer: 0 }
  ]
};

export const FLAGSHIP_COURSES = {
  [FLAGSHIP_COURSE_ID]: FLAGSHIP_COMPUTER_COURSE,
};
