import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  FaArrowLeft, FaArrowRight, FaBookOpen, FaCheckCircle, FaGraduationCap,
  FaLeaf, FaLaptop, FaQuestionCircle, FaSearch,
  FaShieldAlt, FaUsers, FaHeartbeat, FaSeedling, FaPaw, FaBalanceScale, FaChild,
  FaBriefcase, FaComments, FaUniversalAccess, FaHandsHelping, FaGlobe,
  FaWhatsapp, FaEnvelope
} from "react-icons/fa";
import { FLAGSHIP_COURSES, FLAGSHIP_COURSE_ASSESSMENTS } from "../data/learningHubCourseArchitecture";
import { ALL_STRUCTURED_COURSES, COURSE_ASSESSMENTS } from "../data/coursesData";
import { ENDPOINTS } from "../config/api";
import { ENGLISH_FROM_BASICS_COURSE, ENGLISH_FROM_BASICS_ASSESSMENTS } from "../data/englishFromBasicsContent";
import { KNOWLEDGE_WORLD_TOPICS } from "../data/knowledgeWorldContent";
import { getKnowledgeWorldCourse, isKnowledgeWorldSubject, knowledgeWorldTopicCount, knowledgeWorldToMasterCourse } from "../data/knowledgeWorldCourse";
import { makeCourseArt } from "../components/learning/CourseArtKit";
import { getEducationCourse, isEducationSubject, educationTopicCount, EDUCATION_CATEGORY } from "../data/educationCourse";
import { getOfficeSkillsCourse, isOfficeSkillsSubject, officeTopicCount, OFFICE_SKILLS_CATEGORY, OFFICE_SKILLS_SECTION, OFFICE_SKILLS_CARDS, OFFICE_SKILLS_CONTENT } from "../data/officeSkillsCourse";
import { LEARNING_CATEGORIES, LEARNING_CATEGORIES_EXTRA, KNOWLEDGE_WORLD_CATEGORY } from "../data/learningCurriculum";
import { DISCIPLINE_PROFILES } from "../data/learningMethodology";
import PrimaryLettersCourse from "../components/learning/PrimaryLettersCourse";
import PrimaryLessonFresh from "../components/learning/PrimaryLessonFresh";
import MasterCourse from "../components/learning/MasterCourse";
import { isTimeCalendarSubject, TIME_CALENDAR_COURSE, readTimeCalendarProgress } from "../data/timeCalendarCourse";
import { HeroArt as TimeHeroArt, chapterArt as timeChapterArt } from "../components/learning/TimeCalendarArt";
import { isFruitsSubject, FRUITS_COURSE, readFruitsProgress } from "../data/fruitsCourse";
import { HeroArt as FruitHeroArt, chapterArt as fruitChapterArt } from "../components/learning/FruitsArt";
import { isVocabularySubject, VOCABULARY_COURSE, readVocabularyProgress } from "../data/vocabularyCourse";
import { HeroArt as VocabHeroArt, chapterArt as vocabChapterArt } from "../components/learning/VocabularyArt";
import { isTreesForestsSubject, TREES_FORESTS_COURSE, readTreesForestsProgress } from "../data/treesForestsCourse";
import { HeroArt as TreesHeroArt, chapterArt as treesChapterArt } from "../components/learning/TreesForestsArt";
import LearningHubHome from "../components/learning/LearningHubHome";
import SubjectCard from "../components/learning/SubjectCard";
import { courseBadge } from "../data/learningWorld";
import { SUBJECT_CONTENT } from "../data/learningHubSubjectContent";
import { SUBJECT_CONTENT_EXTRA } from "../data/learningSubjectContentExtra";

// Single registry lookup: hand-written content first, then the discipline-
// specific content added for the new learning areas.
const SUBJECT_CONTENT_ALL = { ...SUBJECT_CONTENT, ...SUBJECT_CONTENT_EXTRA };

const CATEGORY_META = {
  "Education / शिक्षा": { key:"education", icon:FaGraduationCap, color:"from-[#003366] to-[#1d4f7a]" },
  "English & Communication / अंग्रेज़ी एवं संचार": { key:"career", icon:FaComments, color:"from-[#0f4c81] to-[#2c7da0]" },
  "Digital Skills / डिजिटल कौशल": { key:"digital", icon:FaLaptop, color:"from-[#17324d] to-[#2563eb]" },
  "Career & Workplace / करियर एवं कार्यस्थल": { key:"career", icon:FaBriefcase, color:"from-[#374151] to-[#111827]" },
  "Skill Development / कौशल विकास": { key:"skills", icon:FaHandsHelping, color:"from-[#2d6a4f] to-[#1b4332]" },
  "Women & Child Development / महिला एवं बाल विकास": { key:"women", icon:FaChild, color:"from-[#8b1e3f] to-[#d90429]" },
  "Health / स्वास्थ्य": { key:"health", icon:FaHeartbeat, color:"from-[#9d0208] to-[#e63946]" },
  "Environment / पर्यावरण": { key:"environment", icon:FaLeaf, color:"from-[#1b4332] to-[#40916c]" },
  "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास": { key:"agriculture", icon:FaSeedling, color:"from-[#386641] to-[#6a994e]" },
  "Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य": { key:"justice", icon:FaBalanceScale, color:"from-[#463f3a] to-[#8a817c]" },
  "Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास": { key:"disability", icon:FaUniversalAccess, color:"from-[#264653] to-[#2a9d8f]" },
  "Animal Protection / पशु संरक्षण": { key:"animal", icon:FaPaw, color:"from-[#6b4f3a] to-[#9c6644]" },
  "Culture & Heritage / संस्कृति एवं विरासत": { key:"culture", icon:FaBookOpen, color:"from-[#6d597a] to-[#b56576]" },
  "Youth & Disaster Preparedness / युवा एवं आपदा तैयारी": { key:"disaster", icon:FaShieldAlt, color:"from-[#33415c] to-[#5c677d]" },
  "Personal Development / व्यक्तिगत विकास": { key:"community", icon:FaUsers, color:"from-[#005f73] to-[#0a9396]" },
  "NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान": { key:"community", icon:FaBookOpen, color:"from-[#003049] to-[#669bbc]" },
  "Knowledge World / ज्ञान संसार": { key:"community", icon:FaBookOpen, color:"from-[#0b3a63] to-[#001529]" },
  "Mathematics & Financial Literacy / गणित एवं वित्तीय साक्षरता": { key:"education", icon:FaBalanceScale, color:"from-[#0b3a63] to-[#002344]" },
  "Science / विज्ञान": { key:"education", icon:FaLeaf, color:"from-[#0b3a63] to-[#1b4332]" },
  "Languages / भाषाएँ": { key:"career", icon:FaComments, color:"from-[#0f4c81] to-[#2c7da0]" },
  "AI & Future Technology / AI एवं भविष्य की तकनीक": { key:"digital", icon:FaLaptop, color:"from-[#17324d] to-[#2563eb]" },
  "Media & Information Literacy / मीडिया एवं सूचना साक्षरता": { key:"digital", icon:FaShieldAlt, color:"from-[#0b3a63] to-[#005f73]" },
  "Life Skills / जीवन कौशल": { key:"community", icon:FaHandsHelping, color:"from-[#005f73] to-[#0a9396]" },
  "Practical Everyday Life / दैनिक व्यावहारिक जीवन": { key:"health", icon:FaChild, color:"from-[#9d0208] to-[#e63946]" },
  "Entrepreneurship & Work / उद्यमिता एवं कार्य": { key:"skills", icon:FaBriefcase, color:"from-[#374151] to-[#111827]" },
  "Research & Mastery Skills / शोध एवं दक्षता कौशल": { key:"education", icon:FaBookOpen, color:"from-[#003049] to-[#669bbc]" },
  "Arts, Creativity & Culture / कला, रचनात्मकता एवं संस्कृति": { key:"culture", icon:FaBookOpen, color:"from-[#6d597a] to-[#b56576]" },
  "Sports, Fitness & Wellness / खेल, फिटनेस एवं कल्याण": { key:"health", icon:FaHeartbeat, color:"from-[#1b4332] to-[#40916c]" },
  "Office Skills / ऑफिस कौशल": { key:"digital", icon:FaBriefcase, color:"from-[#0b3a63] to-[#1f6f8b]" }
};

const TOPICS = [
  ...Object.entries(LEARNING_CATEGORIES).flatMap(([category, subjects]) =>
    subjects.map(([title, intro]) => [category, title, intro])
  ),
  ...Object.entries(LEARNING_CATEGORIES_EXTRA).flatMap(([category, subjects]) =>
    subjects.map(([title, intro]) => [category, title, intro])
  ),
  ...KNOWLEDGE_WORLD_TOPICS,
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, "-").replace(/^-|-$/g, "");

const KW_CATEGORY_NAME = "Knowledge World / ज्ञान संसार";

// Home and Explore are separate routes, so React remounts LearningHubV2 between
// them and component state is lost. This tiny module-level handoff carries a
// dashboard choice (intent/path/search) into the freshly-mounted Explore view.
const PENDING_FILTERS = { category: null, query: "", level: "All", type: "All" };
function takePendingFilters() {
  const p = { ...PENDING_FILTERS };
  PENDING_FILTERS.category = null; PENDING_FILTERS.query = ""; PENDING_FILTERS.level = "All"; PENDING_FILTERS.type = "All";
  return p;
}

// Subject ids are slugified from "English / Hindi", so they include the Hindi
// suffix (e.g. "english-from-basics-मूल-अंग्रेज़ी"). Structured-course registries
// are keyed by the ENGLISH course id only ("english-from-basics",
// "health-wellness", ...). Resolve by the English half so the lookups actually
// match; otherwise the rich structured courses become dead code and learners
// only ever see the generic topic template.
const STRUCTURED_COURSE_ALIASES = {
  "english-from-basics": "english-communication",
  "health-well-being": "health-wellness",
  "computer-training": "computer-education",
  "environment-basics": "environment-sustainability",
  "career-planning": "career-workplace",
};
const englishBaseId = (subject) => slugify((subject && subject.en) || subject.id || "");
const isEnglishFromBasics = (subject) => englishBaseId(subject) === "english-from-basics";
const resolveStructuredCourse = (subject) => {
  if (isEnglishFromBasics(subject)) return { course: ENGLISH_FROM_BASICS_COURSE, id: "english-communication" };
  const base = englishBaseId(subject);
  const id = STRUCTURED_COURSE_ALIASES[base] || base;
  const course = FLAGSHIP_COURSES[id] || ALL_STRUCTURED_COURSES[id];
  return { course: course || null, id };
};
// Knowledge World topics are not curriculum subjects and must never match a
// structured course registry.
const hasStructuredCourse = (subject) =>
  subject && subject.category !== KNOWLEDGE_WORLD_CATEGORY && Boolean(resolveStructuredCourse(subject).course);

// Single source of truth for a subject's saved progress, applying the legacy
// numeric → chapter-id migration for every hand-authored Master Course.
const readStoredProgress = (subject) => {
  if (isTimeCalendarSubject(subject)) return readTimeCalendarProgress(subject);
  if (isFruitsSubject(subject)) return readFruitsProgress(subject);
  if (isVocabularySubject(subject)) return readVocabularyProgress(subject);
  if (isTreesForestsSubject(subject)) return readTreesForestsProgress(subject);
  if (isKnowledgeWorldSubject(subject) || isGenericTopicSubject(subject) || (isOfficeSkillsSubject(subject) && OFFICE_SKILLS_CONTENT[subject.en])) return readMigratedProgress(subject, curriculumChapterIdsFor(subject));
  try {
    const raw = JSON.parse(localStorage.getItem("ssf-learning-course-progress-" + subject.id) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
};
const SUBJECT_VISUAL_GLYPH = {
  "Education / शिक्षा": "📚", "English & Communication / अंग्रेज़ी एवं संचार": "🗣️",
  "Digital Skills / डिजिटल कौशल": "💻", "Career & Workplace / करियर एवं कार्यस्थल": "💼",
  "Skill Development / कौशल विकास": "🛠️", "Women & Child Development / महिला एवं बाल विकास": "👩‍👧",
  "Health / स्वास्थ्य": "🩺", "Environment / पर्यावरण": "🌳",
  "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास": "🌾", "Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य": "⚖️",
  "Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास": "♿", "Animal Protection / पशु संरक्षण": "🐄",
  "Culture & Heritage / संस्कृति एवं विरासत": "🪔", "Youth & Disaster Preparedness / युवा एवं आपदा तैयारी": "🛡️",
  "Personal Development / व्यक्तिगत विकास": "🌱", "NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान": "🤝",
  "Knowledge World / ज्ञान संसार": "🌍",
  "Mathematics & Financial Literacy / गणित एवं वित्तीय साक्षरता": "🔢",
  "Science / विज्ञान": "🔬",
  "Languages / भाषाएँ": "🈯",
  "AI & Future Technology / AI एवं भविष्य की तकनीक": "🤖",
  "Media & Information Literacy / मीडिया एवं सूचना साक्षरता": "📰",
  "Life Skills / जीवन कौशल": "🧭",
  "Practical Everyday Life / दैनिक व्यावहारिक जीवन": "🏠",
  "Entrepreneurship & Work / उद्यमिता एवं कार्य": "📈",
  "Research & Mastery Skills / शोध एवं दक्षता कौशल": "🎓",
  "Arts, Creativity & Culture / कला, रचनात्मकता एवं संस्कृति": "🎨",
  "Sports, Fitness & Wellness / खेल, फिटनेस एवं कल्याण": "🏅",
  "Office Skills / ऑफिस कौशल": "🏢"
};
const HUB_ACCENTS = ["#FF6600","#FFD166","#8ecae6","#95d5b2","#f4a261","#e9c46a","#48cae4","#a7c957"];
const HUB_PALETTES = [
  ["#003366","#0b2e59"],["#0f4c81","#052a4a"],["#2d6a4f","#0b2e59"],["#8b1e3f","#2a0a18"],
  ["#9d0208","#2b0504"],["#386641","#132a13"],["#6d597a","#2b1f33"],["#264653","#0b2e59"],
  ["#6b4f3a","#241a12"],["#33415c","#111a29"],["#005f73","#002733"],["#003049","#001529"],["#7a4b1e","#2b1a08"]
];
// Hand-coded SVG cover art (no stock photos). Kept inline so every subject and
// learning area gets a unique, on-brand visual that animates even inside <img>.
const makeSubjectVisual = (category, title, index, bigGlyph) => {
  const [c1, c2] = HUB_PALETTES[index % HUB_PALETTES.length];
  const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const en = esc(title.split(" / ")[0]);
  const hi = esc(title.split(" / ")[1] || "");
  const cat = esc(category.split(" / ")[0]);
  const glyph = bigGlyph || SUBJECT_VISUAL_GLYPH[category] || "🎓";
  const accent = HUB_ACCENTS[index % HUB_ACCENTS.length];
  const num = String(index + 1).padStart(3, "0");
  const enSize = en.length > 30 ? 40 : en.length > 22 ? 48 : en.length > 15 ? 56 : 62;
  const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1200\" height=\"700\" viewBox=\"0 0 1200 700\">"
    + "<defs>"
    + "<linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\""+c1+"\"/><stop offset=\"1\" stop-color=\""+c2+"\"/></linearGradient>"
    + "<radialGradient id=\"glow\" cx=\"0.82\" cy=\"0.18\" r=\"0.75\"><stop offset=\"0\" stop-color=\""+accent+"\" stop-opacity=\"0.30\"/><stop offset=\"1\" stop-color=\""+accent+"\" stop-opacity=\"0\"/></radialGradient>"
    + "<linearGradient id=\"sheen\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\"0\"/><stop offset=\"0.5\" stop-color=\"#fff\" stop-opacity=\"0.16\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient>"
    + "</defs>"
    + "<rect width=\"1200\" height=\"700\" fill=\"url(#bg)\"/>"
    + "<rect width=\"1200\" height=\"700\" fill=\"url(#glow)\"/>"
    + "<circle cx=\"150\" cy=\"620\" r=\"260\" fill=\"#fff\" opacity=\"0.05\"/>"
    + "<circle cx=\"1040\" cy=\"110\" r=\"190\" fill=\"#fff\" opacity=\"0.06\"/>"
    + "<g opacity=\"0.65\">"
    + "<circle cx=\"880\" cy=\"540\" r=\"7\" fill=\""+accent+"\"><animate attributeName=\"cy\" values=\"540;495;540\" dur=\"6s\" repeatCount=\"indefinite\"/></circle>"
    + "<circle cx=\"1090\" cy=\"420\" r=\"5\" fill=\"#8ecae6\"><animate attributeName=\"cy\" values=\"420;370;420\" dur=\"7.6s\" repeatCount=\"indefinite\"/></circle>"
    + "<circle cx=\"720\" cy=\"150\" r=\"5\" fill=\"#95d5b2\"><animate attributeName=\"cy\" values=\"150;108;150\" dur=\"5.4s\" repeatCount=\"indefinite\"/></circle>"
    + "<circle cx=\"980\" cy=\"260\" r=\"4\" fill=\""+accent+"\"><animate attributeName=\"cy\" values=\"260;222;260\" dur=\"8.2s\" repeatCount=\"indefinite\"/></circle>"
    + "</g>"
    + "<text x=\"1030\" y=\"330\" font-size=\"246\" text-anchor=\"middle\" opacity=\"0.22\">"+glyph+"</text>"
    + "<path d=\"M-260 380 L180 0 L660 0 L220 500 Z\" fill=\"url(#sheen)\"><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0,0;1500,0\" dur=\"9s\" repeatCount=\"indefinite\"/></path>"
    + "<text x=\"80\" y=\"116\" font-family=\"Arial, sans-serif\" font-size=\"26\" font-weight=\"700\" fill=\"#fff\" opacity=\"0.82\" letter-spacing=\"2\">SSF LEARNING HUB • "+cat+"</text>"
    + "<text x=\"80\" y=\"288\" font-family=\"Arial, sans-serif\" font-size=\""+enSize+"\" font-weight=\"800\" fill=\"#fff\">"+en+"</text>"
    + "<text x=\"80\" y=\"352\" font-family=\"Arial, sans-serif\" font-size=\"34\" font-weight=\"700\" fill=\"#FFD166\">"+hi+"</text>"
    + "<rect x=\"80\" y=\"398\" width=\"120\" height=\"6\" rx=\"3\" fill=\""+accent+"\"><animate attributeName=\"width\" values=\"120;270;120\" dur=\"6s\" repeatCount=\"indefinite\"/></rect>"
    + "<text x=\"80\" y=\"520\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#fff\" opacity=\"0.72\">Subject "+num+"</text>"
    + "<text x=\"80\" y=\"562\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#fff\" opacity=\"0.62\">Swastik Srijan Foundation</text>"
    + "</svg>";
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
};
const makeCategoryVisual = (category, count, glyph, index) =>
  makeSubjectVisual(category, category, index, glyph).replace(
    "Subject " + String(index + 1).padStart(3, "0"),
    count + " subjects"
  );

const OFFICE_EMOJI_BY_TITLE = Object.fromEntries(OFFICE_SKILLS_CARDS.map((c) => [c.title, c.emoji]));

const buildSubject = ([category, title, intro], index) => {
  const meta = CATEGORY_META[category] || CATEGORY_META["Education / शिक्षा"];
  const [en, hi] = title.split(" / ");
  const visual = makeSubjectVisual(category, title, index, OFFICE_EMOJI_BY_TITLE[title]);
  return {
    id: slugify(title),
    category, title, intro, en, hi,
    image: visual,
    photo: visual,
    categoryImage: visual,
    icon: meta.icon,
    color: meta.color,
    number: String(index + 1).padStart(2, "0")
  };
};

const SUBJECTS = TOPICS.map(buildSubject);

function getSubjectFromUrl() {
  return new URLSearchParams(window.location.search).get("subject") || "";
}

// Legacy /LearningHub?subject=<id> links (old shares, bookmarks) -> new course route.
function LegacySubjectRedirect() {
  const navigate = useNavigate();
  const id = getSubjectFromUrl();
  if (id) {
    navigate({ to: "/LearningHub/course/$subjectId", params: { subjectId: id }, replace: true });
    return null;
  }
  navigate({ to: "/LearningHub", replace: true });
  return null;
}

// Certificate follow-up helpers: a pre-filled WhatsApp and an email draft so a
// learner can reach SSF about their certificate without hunting for the number.
const SSF_CERT_WHATSAPP = "919718346691";
const SSF_CERT_EMAIL = "info@swastiksrijan.in";
const certificateWhatsAppHref = (user, subject, courseMeta, progress) => {
  const text = "Namaste SSF Learning Hub. Certificate request: " + subject.en + " (" + (courseMeta?.title || subject.title) + "). Learner: " + (user?.fullName || "") + ", email: " + (user?.email || "") + ", progress: " + progress + "%.";
  return "https://wa.me/" + SSF_CERT_WHATSAPP + "?text=" + encodeURIComponent(text);
};
const certificateEmailHref = (user, subject, courseMeta, progress) => {
  const subjectLine = "Certificate request – " + subject.en;
  const body = "Namaste SSF Team,\n\nI have completed the learning and assessment for: " + subject.en + " (" + (courseMeta?.title || subject.title) + ").\n\nLearner name: " + (user?.fullName || "") + "\nAccount email: " + (user?.email || "") + "\nProgress: " + progress + "%\n\nPlease review my certificate request.\n\nThank you.";
  return "mailto:" + SSF_CERT_EMAIL + "?subject=" + encodeURIComponent(subjectLine) + "&body=" + encodeURIComponent(body);
};

// Subject-specific module structures for subjects that previously fell back to the
// generic per-category blueprint. These are prepended so getSubjectProfile() picks
// the most specific rule first (SUBJECT_PROFILE_RULES.filter keeps source order).
const SUBJECT_SPECIFIC_MODULES = [
  {
    test:/technical education|तकनीकी शिक्षा|\biti\b|polytechnic|vocational course/i,icon:"⚙️",
    modules:[
      ["Technical Foundation / तकनीकी आधार",["🔧 Tools, Safety & Measurement / उपकरण, सुरक्षा एवं मापन","📐 Technical Drawing & Symbols / तकनीकी चित्रण एवं संकेत","🔌 Basic Electricity & Machines / विद्युत एवं मशीन","🧱 Materials & Workshop Practice / सामग्री एवं कार्यशाला"]],
      ["Trade Skills / व्यवसाय कौशल",["🛠️ Fitting, Wiring & Assembly / फिटिंग, वायरिंग एवं असेंबली","⚙️ Machine Operation & Maintenance / मशीन संचालन एवं रखरखाव","📏 Quality & Accuracy / गुणवत्ता एवं सटीकता","🧰 Fault Finding & Repair / खराबी पहचान एवं मरम्मत"]],
      ["Workplace Readiness / कार्यस्थल तैयारी",["📋 Job Card & Work Order / कार्य कार्ड एवं ऑर्डर","🦺 Safety, PPE & First Aid / सुरक्षा, PPE एवं प्राथमिक चिकित्सा","🤝 Teamwork & Supervision / टीमवर्क एवं पर्यवेक्षण","💼 Self-employment & Billing / स्वरोजगार एवं बिलिंग"]]
    ]
  },
  {
    test:/english from basics|मूल अंग्रेज़ी/i,icon:"🔤",
    modules:[
      ["English Foundation / अंग्रेज़ी आधार",["🔤 Alphabet & Letter Sounds / वर्णमाला एवं ध्वनि","🔊 Phonics & Pronunciation / ध्वनि एवं उच्चारण","📖 Sight Words & Word Families / दृष्टि शब्द एवं शब्द परिवार","✍️ Capital & Small Letters / बड़े-छोटे अक्षर"]],
      ["Everyday Vocabulary / दैनिक शब्दावली",["🧠 Colours, Numbers & Shapes / रंग, संख्या एवं आकार","👨‍👩‍👧 Family, Home & School / परिवार, घर एवं विद्यालय","🍎 Food, Body & Clothes / भोजन, शरीर एवं वस्त्र","🌦️ Weather, Animals & Places / मौसम, पशु एवं स्थान"]],
      ["Grammar Basics / व्याकरण आधार",["🧩 Nouns & Pronouns / संज्ञा एवं सर्वनाम","⚡ Action Words (Verbs) / क्रिया","🎨 Describing Words (Adjectives) / विशेषण","🔗 Simple Sentence Structure / सरल वाक्य संरचना"]],
      ["Reading & Writing / पठन एवं लेखन",["📖 Short Reading Passages / लघु पठन अंश","❓ Question & Answer Practice / प्रश्न-उत्तर अभ्यास","💬 Simple Conversations / सरल संवाद","📝 Paragraph & Diary Writing / अनुच्छेद एवं डायरी"]]
    ]
  },
  {
    test:/reading & writing|पठन एवं लेखन/i,icon:"📖",
    modules:[
      ["Reading Skills / पठन कौशल",["👀 Skimming & Scanning / सरसरी एवं सूक्ष्म पठन","🎯 Main Idea & Details / मुख्य विचार एवं विवरण","🧩 Context Clues / संदर्भ से अर्थ","📚 Reading Fluency / प्रवाहपूर्ण पठन"]],
      ["Comprehension / पठन-बोध",["❓ Question Types / प्रश्न के प्रकार","🧠 Inference & Prediction / अनुमान एवं पूर्वानुमान","🗂️ Summarising / सारांश लेखन","🔎 Fact vs Opinion / तथ्य एवं राय"]],
      ["Writing Skills / लेखन कौशल",["🧱 Sentence Building / वाक्य निर्माण","📄 Paragraph Structure / अनुच्छेद संरचना","✍️ Letters & Notices / पत्र एवं सूचना","📝 Essays & Reports / निबंध एवं रिपोर्ट"]],
      ["Editing & Style / संशोधन एवं शैली",["🔤 Spelling & Punctuation / वर्तनी एवं विराम","🔁 Cohesion & Linking / सुसंगति एवं संयोजन","🎨 Word Choice & Tone / शब्द चयन एवं लहजा","✅ Proofreading / प्रूफ़रीडिंग"]]
    ]
  },
  {
    test:/professional communication|व्यावसायिक संचार/i,icon:"💼",
    modules:[
      ["Communication Foundation / संचार आधार",["🧩 Elements of Communication / संचार के तत्व","🗣️ Verbal & Non-verbal / मौखिक एवं अमौखिक","👂 Active Listening / सक्रिय श्रवण","🚧 Barriers & Fixes / बाधाएँ एवं समाधान"]],
      ["Workplace Writing / कार्यस्थल लेखन",["📧 Professional Email / व्यावसायिक ईमेल","📄 Reports & Notes / रिपोर्ट एवं नोट्स","📅 Meeting & Minutes / बैठक एवं कार्यवृत्त","💬 Chat & Message Etiquette / चैट एवं संदेश शिष्टाचार"]],
      ["Speaking & Presence / बोलना एवं उपस्थिति",["🎤 Presentations / प्रस्तुति","📞 Phone & Video Calls / फोन एवं वीडियो कॉल","🤝 Client & Team Talk / ग्राहक एवं टीम संवाद","🌐 Cross-cultural Etiquette / अंतर-सांस्कृतिक शिष्टाचार"]]
    ]
  },
  {
    test:/public speaking|वक्तृत्व|speech delivery|भाषण कौशल/i,icon:"🎤",
    modules:[
      ["Speaking Foundation / बोलने का आधार",["🫁 Breathing & Voice / श्वास एवं स्वर","🗣️ Pronunciation & Clarity / उच्चारण एवं स्पष्टता","😌 Confidence & Nervousness / आत्मविश्वास एवं घबराहट","👀 Eye Contact & Body Language / नेत्र संपर्क एवं भाव-भंगिमा"]],
      ["Speech Craft / भाषण कौशल",["📝 Structure: Opening-Body-Close / संरचना: प्रारंभ-मध्य-अंत","🎯 Knowing Your Audience / श्रोता को समझना","📊 Storytelling & Examples / कहानी एवं उदाहरण","⏱️ Timing & Pacing / समय एवं गति"]],
      ["Delivery & Handling / प्रस्तुति एवं प्रबंधन",["🎙️ Mic, Stage & Slides / माइक, मंच एवं स्लाइड","❓ Handling Questions / प्रश्नों का उत्तर","🚨 Managing Mistakes / गलतियाँ संभालना","🏆 Practice & Feedback / अभ्यास एवं प्रतिक्रिया"]]
    ]
  },
  {
    test:/computer & digital basics|कंप्यूटर एवं डिजिटल बेसिक्स|computer basics/i,icon:"💻",
    modules:[
      ["Computer Foundation / कंप्यूटर आधार",["🖥️ Parts of a Computer / कंप्यूटर के भाग","🖱️ Keyboard & Mouse / कीबोर्ड एवं माउस","🗂️ Files & Folders / फाइल एवं फोल्डर","⌨️ Typing Basics / टाइपिंग आधार"]],
      ["Everyday Digital Tools / दैनिक डिजिटल उपकरण",["📝 Documents & Notes / दस्तावेज़ एवं नोट्स","🖼️ Images & Screenshots / चित्र एवं स्क्रीनशॉट","📄 Print, Save & Share / प्रिंट, सेव एवं शेयर","🔋 Care & Storage / देखभाल एवं भंडारण"]],
      ["Safe Digital Use / सुरक्षित डिजिटल उपयोग",["🔐 Passwords & Login / पासवर्ड एवं लॉगिन","⚠️ Scams & Frauds / ठगी एवं धोखा","🧹 Files, Updates & Antivirus / फाइल, अपडेट एवं एंटीवायरस","♻️ Responsible Use / जिम्मेदार उपयोग"]]
    ]
  },
  {
    test:/internet basics|इंटरनेट बेसिक्स/i,icon:"🌐",
    modules:[
      ["Getting Online / ऑनलाइन जुड़ना",["🔌 Network, Wi-Fi & Data / नेटवर्क, वाई-फाई एवं डेटा","🌐 Browser & Website / ब्राउज़र एवं वेबसाइट","🔗 Links, Tabs & Bookmarks / लिंक, टैब एवं बुकमार्क","🔎 Search Effectively / प्रभावी खोज"]],
      ["Using the Web Well / वेब का सही उपयोग",["📧 Email & Forms / ईमेल एवं फॉर्म","⬇️ Safe Downloads / सुरक्षित डाउनलोड","🎥 Video & Voice / वीडियो एवं आवाज़","🗺️ Maps & Payments / मैप एवं भुगतान"]],
      ["Safety & Reliability / सुरक्षा एवं विश्वसनीयता",["🎣 Fake Links & Phishing / फर्जी लिंक एवं फिशिंग","🔒 Privacy & Permissions / गोपनीयता एवं अनुमति","✅ Verifying Information / जानकारी जाँचना","📶 Data Saving / डेटा बचत"]]
    ]
  },
  {
    test:/google workspace|gmail|google docs|google sheets/i,icon:"🧰",
    modules:[
      ["Google Basics / गूगल आधार",["👤 Account & Sign-in / खाता एवं लॉगिन","📧 Gmail: Compose & Reply / जीमेल: लिखें एवं उत्तर","📁 Drive: Upload & Organise / ड्राइव: अपलोड एवं व्यवस्थित","🔗 Sharing & Permissions / शेयरिंग एवं अनुमति"]],
      ["Documents & Sheets / दस्तावेज़ एवं शीट",["📝 Docs: Format & Edit / डॉक्स: स्वरूपण एवं संपादन","📊 Sheets: Data & Formulas / शीट: डेटा एवं सूत्र","🖼️ Slides: Presentation / स्लाइड: प्रस्तुति","🗓️ Calendar & Meet / कैलेंडर एवं मीट"]],
      ["Productivity Habits / उत्पादकता",["🧩 Templates / टेम्पलेट","🤝 Collaborative Editing / सहयोगी संपादन","🔎 Search & Shortcuts / खोज एवं शॉर्टकट","☁️ Offline & Sync / ऑफलाइन एवं सिंक"]]
    ]
  },
  {
    test:/digital literacy|डिजिटल साक्षरता/i,icon:"📱",
    modules:[
      ["Digital Foundation / डिजिटल आधार",["📱 Devices & Screens / उपकरण एवं स्क्रीन","👆 Touch, Type & Navigate / स्पर्श, टाइप एवं नेविगेशन","🔋 Charging & Care / चार्जिंग एवं देखभाल","🗣️ Voice & Accessibility / आवाज़ एवं सुगम्यता"]],
      ["Digital Services / डिजिटल सेवाएँ",["🏦 Banking & UPI / बैंकिंग एवं यूपीआई","🏛️ Government Portals / सरकारी पोर्टल","🩺 Health & Education Apps / स्वास्थ्य एवं शिक्षा ऐप","🛒 Buying & Selling Online / ऑनलाइन खरीद-बिक्री"]],
      ["Responsible Digital Life / जिम्मेदार डिजिटल जीवन",["🔐 Privacy & Passwords / गोपनीयता एवं पासवर्ड","⚠️ Fraud Awareness / धोखाधड़ी जागरूकता","🗣️ Respectful Behaviour / सम्मानजनक व्यवहार","📰 Fake News & Fact-check / फर्जी खबर एवं तथ्य-जाँच"]]
    ]
  },
  {
    test:/job search|नौकरी खोज/i,icon:"🔎",
    modules:[
      ["Preparation / तैयारी",["🎯 Knowing Your Skills / अपने कौशल की पहचान","📄 Resume & Portfolio / रिज्यूमे एवं पोर्टफोलियो","🔑 Keywords & Profiles / कीवर्ड एवं प्रोफ़ाइल","🌐 Online Presence / ऑनलाइन उपस्थिति"]],
      ["Finding Opportunities / अवसर खोजना",["📰 Job Portals & Ads / जॉब पोर्टल एवं विज्ञापन","🤝 Networking & Referrals / नेटवर्किंग एवं संदर्भ","🏢 Local & Government Jobs / स्थानीय एवं सरकारी नौकरी","🚨 Avoiding Job Scams / नौकरी ठगी से बचाव"]],
      ["Applying & Following Up / आवेदन एवं पीछा",["📤 Applying Correctly / सही आवेदन","✉️ Cover Message / कवर संदेश","📞 Follow-up / फॉलो-अप","🗂️ Tracking Applications / आवेदन ट्रैक करना"]]
    ]
  },
  {
    test:/workplace etiquette|कार्यस्थल शिष्टाचार/i,icon:"🏢",
    modules:[
      ["Professional Conduct / पेशेवर आचरण",["⏰ Punctuality & Attendance / समयपालन एवं उपस्थिति","👔 Dress & Grooming / वेशभूषा एवं शिष्टता","🤝 Respect & Courtesy / सम्मान एवं शिष्टाचार","🗣️ Language & Tone / भाषा एवं लहजा"]],
      ["Working with Others / दूसरों के साथ कार्य",["👥 Team Behaviour / टीम व्यवहार","📢 Communication Chain / संचार श्रृंखला","🚧 Conflict Handling / टकराव प्रबंधन","🔒 Confidentiality / गोपनीयता"]],
      ["Workplace Systems / कार्यस्थल प्रणाली",["📋 Duties & Reporting / कर्तव्य एवं रिपोर्टिंग","🦺 Safety Rules / सुरक्षा नियम","📱 Phone & Email Etiquette / फोन एवं ईमेल शिष्टाचार","🌱 Growth & Feedback / विकास एवं प्रतिक्रिया"]]
    ]
  },
  {
    test:/teamwork|leadership|नेतृत्व|टीमवर्क/i,icon:"🤝",
    modules:[
      ["Team Foundation / टीम आधार",["🎯 Shared Goals / साझा लक्ष्य","🧩 Roles & Strengths / भूमिका एवं क्षमता","💬 Trust & Communication / विश्वास एवं संवाद","🤗 Diversity & Inclusion / विविधता एवं समावेश"]],
      ["Leadership Skills / नेतृत्व कौशल",["🧭 Vision & Direction / दृष्टि एवं दिशा","🗣️ Motivation & Feedback / प्रेरणा एवं प्रतिक्रिया","⚖️ Fair Decision Making / निष्पक्ष निर्णय","🚧 Problem Solving / समस्या समाधान"]],
      ["Team Performance / टीम प्रदर्शन",["📅 Planning & Delegation / योजना एवं कार्य-विभाजन","📊 Review & Recognition / समीक्षा एवं सम्मान","🧯 Handling Conflict / टकराव संभालना","🌱 Building Future Leaders / भावी नेतृत्व"]]
    ]
  },
  {
    test:/time management|समय प्रबंधन/i,icon:"⏰",
    modules:[
      ["Time Awareness / समय की समझ",["🧠 Time & Priorities / समय एवं प्राथमिकता","🕵️ Finding Time Leaks / समय की हानि पहचानना","🎯 Goal & Deadline / लक्ष्य एवं समयसीमा","📝 To-do & Lists / कार्य-सूची"]],
      ["Planning Tools / योजना उपकरण",["📅 Daily & Weekly Plan / दैनिक एवं साप्ताहिक योजना","🍅 Focus & Pomodoro / ध्यान एवं पोमोडोरो","🔢 Important vs Urgent / महत्वपूर्ण एवं अत्यावश्यक","📵 Avoiding Distractions / ध्यान भटकाव से बचाव"]],
      ["Consistency / निरंतरता",["🔁 Habits & Routines / आदत एवं दिनचर्या","⚖️ Work-Life Balance / कार्य-जीवन संतुलन","📈 Review & Adjust / समीक्षा एवं सुधार","🚫 Beating Procrastination / टालमटोल पर विजय"]]
    ]
  },
  {
    test:/vocational training|व्यावसायिक प्रशिक्षण|skill training/i,icon:"🛠️",
    modules:[
      ["Trade Foundation / व्यवसाय आधार",["🧰 Tools & Equipment / उपकरण एवं औज़ार","📏 Measurement & Accuracy / मापन एवं सटीकता","🦺 Safety & First Aid / सुरक्षा एवं प्राथमिक चिकित्सा","🧱 Materials & Handling / सामग्री एवं संभाल"]],
      ["Core Practical Skills / मुख्य व्यावहारिक कौशल",["🔧 Step-by-step Practice / चरणबद्ध अभ्यास","🎯 Quality Standards / गुणवत्ता मानक","🧩 Common Faults & Fixes / सामान्य खराबी एवं समाधान","⏱️ Speed & Finish / गति एवं अंतिम रूप"]],
      ["Work & Enterprise / कार्य एवं उद्यम",["📋 Customer Requirement / ग्राहक की आवश्यकता","💰 Costing & Pricing / लागत एवं मूल्य","📈 Marketing & Records / विपणन एवं रिकॉर्ड","🌱 Self-employment / स्वरोजगार"]]
    ]
  },
  {
    test:/girls' education|girls education|बालिका शिक्षा|कन्या शिक्षा/i,icon:"👧",
    modules:[
      ["Why Girls' Education / बालिका शिक्षा क्यों",["🌍 Right to Education / शिक्षा का अधिकार","📈 Benefits to Family & Society / परिवार एवं समाज को लाभ","🚧 Barriers & Myths / बाधाएँ एवं भ्रांतियाँ","🏆 Role Models / आदर्श उदाहरण"]],
      ["Supporting Learning / सीखने में सहयोग",["🏫 School Access & Attendance / विद्यालय पहुँच एवं उपस्थिति","🏠 Family & Community Support / परिवार एवं समुदाय सहयोग","📚 Study Environment / अध्ययन वातावरण","🧠 Confidence & Aspiration / आत्मविश्वास एवं आकांक्षा"]],
      ["Safety & Continuity / सुरक्षा एवं निरंतरता",["🛡️ Safe Journey & School / सुरक्षित यात्रा एवं विद्यालय","🩺 Health & Hygiene / स्वास्थ्य एवं स्वच्छता","🔄 Continuing After Gaps / अंतराल के बाद पढ़ाई","🎯 Career Pathways / करियर मार्ग"]]
    ]
  },
  {
    test:/female foeticide|कन्या भ्रूण|भ्रूण हत्या/i,icon:"⚖️",
    modules:[
      ["Understanding the Issue / समस्या को समझना",["📉 Sex Ratio Basics / लिंग अनुपात","🧬 Girl Child Value / बालिका का महत्व","❌ Causes & Myths / कारण एवं भ्रांतियाँ","📜 Law & Rights / कानून एवं अधिकार"]],
      ["Prevention & Awareness / रोकथाम एवं जागरूकता",["📢 Awareness Campaigns / जागरूकता अभियान","🏥 Safe Pregnancy & Care / सुरक्षित गर्भावस्था","📞 Reporting & Helplines / शिकायत एवं हेल्पलाइन","🤝 Community Role / समुदाय की भूमिका"]],
      ["Supporting Families / परिवारों का सहयोग",["👨‍👩‍👧 Family Counselling / परिवार परामर्श","🎓 Educating Girls / बालिकाओं की शिक्षा","🏆 Celebrating Girl Child / बालिका का सम्मान","🌱 Long-term Change / दीर्घकालिक बदलाव"]]
    ]
  },
  {
    test:/balwadi|early childhood|बालवाड़ी|प्रारंभिक बाल्यावस्था|anganwadi/i,icon:"🧸",
    modules:[
      ["Child Development / बाल विकास",["🧠 Stages of Development / विकास के चरण","🗣️ Language & Speech / भाषा एवं वाणी","🤸 Motor Skills / गति कौशल","❤️ Social-Emotional Growth / सामाजिक-भावनात्मक विकास"]],
      ["Early Learning Activities / प्रारंभिक सीख",["🎵 Rhymes, Songs & Stories / कविता, गीत एवं कहानी","🔢 Pre-number & Shapes / पूर्व-संख्या एवं आकार","🎨 Art, Craft & Play / कला, शिल्प एवं खेल","📖 Pre-reading Skills / पूर्व-पठन कौशल"]],
      ["Care & Nutrition / देखभाल एवं पोषण",["🍎 Nutrition & Meals / पोषण एवं भोजन","🩺 Health & Hygiene / स्वास्थ्य एवं स्वच्छता","🛡️ Safety & First Aid / सुरक्षा एवं प्राथमिक चिकित्सा","🤝 Parents & Anganwadi Link / माता-पिता एवं आंगनवाड़ी"]]
    ]
  },
  {
    test:/self-help group|self help group|स्वयं सहायता समूह|shg/i,icon:"👭",
    modules:[
      ["Group Foundation / समूह आधार",["🤝 What is an SHG / स्वयं सहायता समूह क्या है","📜 Rules & Registration / नियम एवं पंजीकरण","👥 Roles & Meetings / भूमिका एवं बैठक","💰 Savings & Contribution / बचत एवं अंशदान"]],
      ["Money & Credit / धन एवं ऋण",["🏦 Bank Linkage / बैंक जुड़ाव","📊 Interest & Repayment / ब्याज एवं भुगतान","📒 Record Keeping / रिकॉर्ड रखना","🛒 Group Purchasing / सामूहिक खरीद"]],
      ["Enterprise & Growth / उद्यम एवं विकास",["💡 Choosing an Activity / गतिविधि चुनना","📈 Cost, Price & Profit / लागत, मूल्य एवं लाभ","📣 Marketing / विपणन","🌱 Federation & Sustainability / संघ एवं स्थायित्व"]]
    ]
  },
  {
    test:/personal hygiene|व्यक्तिगत स्वच्छता|स्वच्छता/i,icon:"🧼",
    modules:[
      ["Daily Hygiene / दैनिक स्वच्छता",["✋ Hand Hygiene / हाथ की स्वच्छता","🦷 Oral & Body Care / दाँत एवं शरीर देखभाल","🚿 Bathing & Clean Clothes / स्नान एवं स्वच्छ वस्त्र","💧 Safe Drinking Water / सुरक्षित पेयजल"]],
      ["Home & Food Hygiene / घर एवं भोजन स्वच्छता",["🍳 Safe Food Handling / सुरक्षित भोजन","🧽 Kitchen & Utensils / रसोई एवं बर्तन","🚽 Toilet & Sanitation / शौचालय एवं स्वच्छता","🗑️ Waste Disposal / कचरा निपटान"]],
      ["Health & Prevention / स्वास्थ्य एवं रोकथाम",["🦟 Vector & Germ Control / कीट एवं कीटाणु नियंत्रण","🤧 Cough, Cold & Prevention / खाँसी, जुकाम एवं रोकथाम","🩺 When to See a Doctor / डॉक्टर कब दिखाएँ","🌿 Healthy Habits / स्वस्थ आदतें"]]
    ]
  },
  {
    test:/cow protection|गौ संरक्षण|गौशाला/i,icon:"🐄",
    modules:[
      ["Cattle Care / पशु देखभाल",["🐄 Breeds & Identification / नस्ल एवं पहचान","🌾 Feeding & Water / चारा एवं जल","🏠 Shelter & Ventilation / आश्रय एवं हवादारी","🧹 Cleanliness / स्वच्छता"]],
      ["Health & Welfare / स्वास्थ्य एवं कल्याण",["💉 Vaccination & Deworming / टीकाकरण एवं कृमिनाशन","🩺 Common Diseases / सामान्य रोग","🐮 Breeding & Pregnancy Care / प्रजनन एवं गर्भ देखभाल","🚨 Emergency Care / आपात देखभाल"]],
      ["Products & Sustainability / उत्पाद एवं स्थायित्व",["🥛 Milk & Hygiene / दूध एवं स्वच्छता","♻️ Cow Dung & Urine Uses / गोबर एवं गोमूत्र उपयोग","💰 Gaushala Management / गौशाला प्रबंधन","🌱 Humane & Ethical Care / मानवीय एवं नैतिक देखभाल"]]
    ]
  },
  {
    test:/self-reliant village|आत्मनिर्भर गाँव|आत्मनिर्भर ग्राम/i,icon:"🏘️",
    modules:[
      ["Village Foundation / गाँव का आधार",["🗺️ Village Resources / गाँव के संसाधन","👥 People & Institutions / जन एवं संस्थाएँ","🧩 Needs Assessment / आवश्यकता आकलन","🎯 Vision & Goals / दृष्टि एवं लक्ष्य"]],
      ["Livelihood & Services / आजीविका एवं सेवाएँ",["🌾 Farming & Allied Work / कृषि एवं सहयोगी कार्य","💼 Local Enterprise / स्थानीय उद्यम","🏫 Education & Health Access / शिक्षा एवं स्वास्थ्य पहुँच","🏗️ Basic Infrastructure / बुनियादी ढाँचा"]],
      ["Collective Action / सामूहिक कार्य",["🤝 Panchayat & Groups / पंचायत एवं समूह","💰 Funds & Schemes / निधि एवं योजनाएँ","📊 Planning & Review / योजना एवं समीक्षा","🌱 Sustainability / स्थायित्व"]]
    ]
  },
  {
    test:/social justice|सामाजिक न्याय/i,icon:"⚖️",
    modules:[
      ["Justice Foundation / न्याय आधार",["📖 Meaning of Social Justice / सामाजिक न्याय का अर्थ","⚖️ Equality & Equity / समानता एवं न्यायसंगतता","🚫 Discrimination Types / भेदभाव के प्रकार","📜 Constitutional Values / संवैधानिक मूल्य"]],
      ["Rights & Entitlements / अधिकार एवं पात्रता",["📋 Fundamental Rights / मौलिक अधिकार","🎓 Education & Work Rights / शिक्षा एवं कार्य अधिकार","🏥 Welfare Schemes / कल्याण योजनाएँ","📞 Grievance Redressal / शिकायत निवारण"]],
      ["Building Fairness / निष्पक्षता का निर्माण",["🤝 Inclusion in Practice / व्यवहार में समावेश","📢 Awareness & Advocacy / जागरूकता एवं पैरवी","🛡️ Protecting the Vulnerable / कमजोर की सुरक्षा","🌱 Community Responsibility / सामुदायिक जिम्मेदारी"]]
    ]
  },
  {
    test:/human rights|मानवाधिकार|मानव अधिकार/i,icon:"🕊️",
    modules:[
      ["Rights Foundation / अधिकार आधार",["📖 What are Human Rights / मानवाधिकार क्या हैं","🌍 Universal Declaration / सार्वभौमिक घोषणा","🧩 Categories of Rights / अधिकारों की श्रेणियाँ","⚖️ Rights & Duties / अधिकार एवं कर्तव्य"]],
      ["Rights in Daily Life / दैनिक जीवन में अधिकार",["🎓 Education & Health / शिक्षा एवं स्वास्थ्य","👷 Work & Fair Wage / कार्य एवं उचित वेतन","👩 Women & Child Rights / महिला एवं बाल अधिकार","🧑‍🦽 Disability & Inclusion / दिव्यांगता एवं समावेश"]],
      ["Protection & Action / संरक्षण एवं कार्रवाई",["📜 Laws & Institutions / कानून एवं संस्थाएँ","📞 Helplines & Complaints / हेल्पलाइन एवं शिकायत","🛡️ Preventing Violations / उल्लंघन की रोकथाम","🤝 Community Action / सामुदायिक कार्रवाई"]]
    ]
  },
  {
    test:/moral education|नैतिक शिक्षा/i,icon:"🌼",
    modules:[
      ["Values Foundation / मूल्य आधार",["💛 Honesty & Truth / ईमानदारी एवं सत्य","🤝 Respect & Kindness / सम्मान एवं दया","🕊️ Peace & Non-violence / शांति एवं अहिंसा","🙏 Gratitude / कृतज्ञता"]],
      ["Values in Action / मूल्य व्यवहार में",["👨‍👩‍👧 At Home & Family / घर एवं परिवार","🏫 At School & Work / विद्यालय एवं कार्य","🤲 Helping Others / दूसरों की सहायता","🌍 Responsibility to Society / समाज के प्रति जिम्मेदारी"]],
      ["Building Character / चरित्र निर्माण",["🧠 Self-control & Discipline / आत्म-संयम एवं अनुशासन","⚖️ Right & Wrong Choices / सही-गलत चयन","🔄 Admitting Mistakes / गलती स्वीकारना","🌱 Daily Practice / दैनिक अभ्यास"]]
    ]
  },
  {
    test:/corruption awareness|भ्रष्टाचार/i,icon:"🚫",
    modules:[
      ["Understanding Corruption / भ्रष्टाचार को समझना",["📖 What is Corruption / भ्रष्टाचार क्या है","🧾 Common Forms / सामान्य रूप","🌍 Causes & Effects / कारण एवं प्रभाव","📉 Impact on Society / समाज पर प्रभाव"]],
      ["Prevention / रोकथाम",["📜 Laws & Anti-corruption Bodies / कानून एवं एजेंसियाँ","📞 Reporting Channels / शिकायत के माध्यम","📄 Right to Information / सूचना का अधिकार","🔍 Transparency in Services / सेवाओं में पारदर्शिता"]],
      ["Building Integrity / ईमानदारी का निर्माण",["💛 Personal Integrity / व्यक्तिगत ईमानदारी","🏛️ Ethical Institutions / नैतिक संस्थाएँ","👥 Citizen Vigilance / नागरिक सतर्कता","🌱 Long-term Culture / दीर्घकालिक संस्कृति"]]
    ]
  },
  {
    test:/national unity|राष्ट्रीय एकता/i,icon:"🇮🇳",
    modules:[
      ["Unity Foundation / एकता आधार",["📖 Unity in Diversity / विविधता में एकता","🗺️ States & Cultures / राज्य एवं संस्कृतियाँ","🤝 Common Values / साझा मूल्य","🏳️ National Symbols / राष्ट्रीय प्रतीक"]],
      ["Historical & Civic Bond / ऐतिहासिक एवं नागरिक बंधन",["📜 Freedom Movement / स्वतंत्रता आंदोलन","⚖️ Constitution & Equality / संविधान एवं समानता","🪖 Role of Institutions / संस्थाओं की भूमिका","🌐 India in the World / विश्व में भारत"]],
      ["Practising Unity / एकता का अभ्यास",["🗣️ Respecting Languages & Faiths / भाषा एवं आस्था का सम्मान","🚫 Opposing Division / विभाजन का विरोध","🤝 Community Programmes / सामुदायिक कार्यक्रम","🌱 Nation Building / राष्ट्र निर्माण"]]
    ]
  },
  {
    test:/communal harmony|सांप्रदायिक सद्भाव|साम्प्रदायिक/i,icon:"🕊️",
    modules:[
      ["Harmony Foundation / सद्भाव आधार",["📖 Meaning of Harmony / सद्भाव का अर्थ","🌍 Diversity of Faiths / आस्थाओं की विविधता","🤝 Shared Humanity / साझा मानवता","⚖️ Secular Values / धर्मनिरपेक्ष मूल्य"]],
      ["Understanding Conflict / टकराव को समझना",["🧩 Causes of Division / विभाजन के कारण","📰 Rumours & Misinformation / अफवाह एवं भ्रांति","🚨 Warning Signs / चेतावनी संकेत","🗣️ Peaceful Dialogue / शांतिपूर्ण संवाद"]],
      ["Building Peace / शांति का निर्माण",["🤝 Inter-community Activities / अंतर-समुदाय गतिविधियाँ","🛡️ Protection of All / सबकी सुरक्षा","📢 Responsible Media Use / जिम्मेदार मीडिया","🌱 Long-term Coexistence / दीर्घकालिक सहअस्तित्व"]]
    ]
  },
  {
    test:/civic responsibility|नागरिक जिम्मेदारी|नागरिक कर्तव्य/i,icon:"🏛️",
    modules:[
      ["Citizenship Foundation / नागरिकता आधार",["📖 Who is a Citizen / नागरिक कौन है","⚖️ Rights & Duties / अधिकार एवं कर्तव्य","🗳️ Voting & Democracy / मतदान एवं लोकतंत्र","🏛️ Local Governance / स्थानीय शासन"]],
      ["Civic Participation / नागरिक भागीदारी",["🤝 Community Service / सामुदायिक सेवा","📢 Raising Issues / समस्याएँ उठाना","🧹 Public Spaces & Hygiene / सार्वजनिक स्थान एवं स्वच्छता","💧 Water, Roads & Facilities / जल, सड़क एवं सुविधाएँ"]],
      ["Responsible Living / जिम्मेदार जीवन",["📜 Following Laws / कानून का पालन","💳 Paying Taxes / कर भुगतान","🌍 Environment Duty / पर्यावरण कर्तव्य","🌱 Inspiring Others / दूसरों को प्रेरित करना"]]
    ]
  },
  {
    test:/inclusive education|समावेशी शिक्षा/i,icon:"🧑‍🏫",
    modules:[
      ["Inclusion Foundation / समावेश आधार",["📖 What is Inclusive Education / समावेशी शिक्षा क्या है","🧑‍🦽 Diversity of Learners / शिक्षार्थियों की विविधता","⚖️ Right to Education for All / सबके लिए शिक्षा का अधिकार","🚫 Barriers & Attitudes / बाधाएँ एवं दृष्टिकोण"]],
      ["Classroom Practice / कक्षा व्यवहार",["♿ Accessibility & Seating / सुगम्यता एवं बैठक","🧩 Differentiated Teaching / विभेदित शिक्षण","🗣️ Communication Support / संचार सहयोग","📝 Flexible Assessment / लचीला मूल्यांकन"]],
      ["Support Systems / सहयोग प्रणाली",["🤝 Parents & Special Educators / अभिभावक एवं विशेष शिक्षक","🛠️ Assistive Tools / सहायक उपकरण","🧠 Peer Sensitivity / साथियों की संवेदनशीलता","🌱 Inclusive Culture / समावेशी संस्कृति"]]
    ]
  },
  {
    test:/conferences|knowledge events|सम्मेलन|ज्ञान कार्यक्रम|seminar/i,icon:"🎪",
    modules:[
      ["Event Basics / कार्यक्रम आधार",["🎯 Purpose & Theme / उद्देश्य एवं विषय","👥 Audience & Speakers / श्रोता एवं वक्ता","🗓️ Planning & Schedule / योजना एवं समय-सारिणी","📣 Promotion & Invites / प्रचार एवं आमंत्रण"]],
      ["Organising / आयोजन",["🏛️ Venue & Logistics / स्थल एवं व्यवस्था","🎤 Sessions & Panels / सत्र एवं पैनल","📸 Documentation / दस्तावेज़ीकरण","🤝 Partnerships / साझेदारी"]],
      ["Learning & Follow-up / सीख एवं अनुवर्ती",["📝 Note-taking / नोट लेना","💬 Networking / नेटवर्किंग","📊 Feedback & Report / प्रतिक्रिया एवं रिपोर्ट","🌱 Applying Learnings / सीख लागू करना"]]
    ]
  },
  {
    test:/self awareness|आत्म जागरूकता|आत्म-जागरूकता/i,icon:"🪞",
    modules:[
      ["Knowing Yourself / स्वयं को जानना",["🧠 Strengths & Weaknesses / शक्ति एवं कमजोरी","❤️ Values & Beliefs / मूल्य एवं विश्वास","🎭 Emotions & Triggers / भावनाएँ एवं कारण","🪞 Self-image / आत्म-छवि"]],
      ["Reflection Tools / चिंतन उपकरण",["📓 Journaling / डायरी लेखन","🧘 Mindfulness / सजगता","❓ Self-questioning / आत्म-प्रश्न","📊 Feedback from Others / दूसरों की प्रतिक्रिया"]],
      ["Growth / विकास",["🎯 Setting Personal Goals / व्यक्तिगत लक्ष्य","🔄 Breaking Old Habits / पुरानी आदतें बदलना","🌱 Self-compassion / आत्म-करुणा","📈 Continuous Improvement / निरंतर सुधार"]]
    ]
  },
  {
    test:/confidence building|आत्मविश्वास/i,icon:"💪",
    modules:[
      ["Confidence Foundation / आत्मविश्वास आधार",["🧠 Understanding Confidence / आत्मविश्वास को समझना","🎯 Strengths & Achievements / शक्ति एवं उपलब्धि","🗣️ Self-talk / आत्म-संवाद","😌 Managing Fear / भय प्रबंधन"]],
      ["Confident Actions / आत्मविश्वासी कार्य",["👀 Body Language / भाव-भंगिमा","🗣️ Speaking Up / बोलने का साहस","🤝 Saying No Politely / विनम्र मना करना","❓ Asking for Help / सहायता माँगना"]],
      ["Sustaining Confidence / निरंतर आत्मविश्वास",["📈 Small Wins / छोटी सफलताएँ","🔄 Learning from Failure / असफलता से सीख","👥 Supportive Circle / सहयोगी वातावरण","🌱 Daily Practice / दैनिक अभ्यास"]]
    ]
  },
  {
    test:/goal setting|लक्ष्य निर्धारण|लक्ष्य/i,icon:"🎯",
    modules:[
      ["Goal Basics / लक्ष्य आधार",["📖 Why Goals Matter / लक्ष्य क्यों जरूरी","🧩 Short vs Long Term / अल्पकालिक एवं दीर्घकालिक","✍️ SMART Goals / स्मार्ट लक्ष्य","💡 Values & Goals / मूल्य एवं लक्ष्य"]],
      ["Planning / योजना",["🗺️ Breaking into Steps / चरणों में बाँटना","⏱️ Timeline & Milestones / समय-सीमा एवं पड़ाव","🚧 Anticipating Obstacles / बाधाओं का अनुमान","🧰 Resources & Support / संसाधन एवं सहयोग"]],
      ["Achieving / प्राप्ति",["📅 Daily Action / दैनिक कार्य","📊 Tracking Progress / प्रगति ट्रैक","🔄 Adjusting Plans / योजना बदलना","🏆 Celebrating Success / सफलता का उत्सव"]]
    ]
  },
  {
    test:/problem solving|समस्या समाधान/i,icon:"🧩",
    modules:[
      ["Understanding Problems / समस्या को समझना",["🔍 Defining the Problem / समस्या परिभाषित करना","🧾 Facts vs Assumptions / तथ्य एवं अनुमान","🎯 Root Cause / मूल कारण","📋 Impact / प्रभाव"]],
      ["Finding Solutions / समाधान खोजना",["💡 Brainstorming / विचार-मंथन","⚖️ Weighing Options / विकल्प तौलना","🧪 Testing Ideas / विचार परखना","🤝 Seeking Input / सलाह लेना"]],
      ["Implementing / क्रियान्वयन",["📝 Action Plan / कार्य योजना","🚀 Executing Steps / चरण पूरे करना","📊 Reviewing Results / परिणाम समीक्षा","🌱 Learning & Improving / सीख एवं सुधार"]]
    ]
  },
  {
    test:/decision making|निर्णय लेना|निर्णय/i,icon:"⚖️",
    modules:[
      ["Decision Basics / निर्णय आधार",["📖 Types of Decisions / निर्णय के प्रकार","🧩 Factors that Matter / महत्वपूर्ण कारक","⚖️ Pros & Cons / लाभ एवं हानि","❤️ Values & Ethics / मूल्य एवं नैतिकता"]],
      ["Making the Choice / चयन करना",["📊 Gathering Information / जानकारी जुटाना","🧠 Thinking Clearly / स्पष्ट सोच","👥 Consulting Others / दूसरों से परामर्श","⏱️ Timing / समय"]],
      ["After the Decision / निर्णय के बाद",["🚀 Acting Confidently / आत्मविश्वास से कार्य","📈 Reviewing Outcome / परिणाम समीक्षा","🔄 Learning from Mistakes / गलती से सीख","🌱 Responsibility / जिम्मेदारी"]]
    ]
  },
  {
    test:/creativity|रचनात्मकता|सृजनात्मकता/i,icon:"🎨",
    modules:[
      ["Creative Foundation / रचनात्मक आधार",["🧠 Imagination & Curiosity / कल्पना एवं जिज्ञासा","👀 Observation / अवलोकन","❓ Asking Questions / प्रश्न पूछना","🌐 Open Mindset / खुली सोच"]],
      ["Creative Skills / रचनात्मक कौशल",["💡 Idea Generation / विचार उत्पन्न करना","🎨 Drawing, Craft & Design / चित्र, शिल्प एवं डिज़ाइन","✍️ Story & Writing / कहानी एवं लेखन","🎵 Music, Rhythm & Movement / संगीत, लय एवं गति"]],
      ["Turning Ideas into Reality / विचार से वास्तविकता",["🧪 Experimenting / प्रयोग","🛠️ Making & Prototyping / निर्माण एवं नमूना","🤝 Collaboration / सहयोग","🏆 Showcasing Work / कार्य प्रदर्शन"]]
    ]
  },
  {
    test:/budget & financial planning|बजट एवं वित्तीय योजना/i,icon:"💰",
    modules:[
      ["Budget Foundation / बजट आधार",["📖 What is a Budget / बजट क्या है","💵 Income & Expenses / आय एवं व्यय","🎯 Needs vs Wants / आवश्यकता एवं इच्छा","📊 Categories & Units / श्रेणियाँ एवं इकाइयाँ"]],
      ["Preparing a Budget / बजट बनाना",["🧮 Estimating Costs / लागत अनुमान","📋 Assumptions / मान्यताएँ","🕒 Timeline & Phases / समय-सीमा एवं चरण","🛟 Contingency / आकस्मिक निधि"]],
      ["Monitoring / निगरानी",["📒 Recording Actuals / वास्तविक व्यय","📉 Variance Analysis / अंतर विश्लेषण","🔄 Reallocation / पुनः आवंटन","📄 Reporting / रिपोर्टिंग"]]
    ]
  },
  {
    test:/monitoring & evaluation|निगरानी एवं मूल्यांकन/i,icon:"📊",
    modules:[
      ["M&E Foundation / निगरानी आधार",["📖 Monitoring vs Evaluation / निगरानी एवं मूल्यांकन","🎯 Objectives & Results / उद्देश्य एवं परिणाम","🧩 Inputs-Activities-Outputs / निवेश-गतिविधि-उत्पाद","📐 Indicators / संकेतक"]],
      ["Data & Evidence / डेटा एवं प्रमाण",["📋 Data Collection Tools / डेटा संग्रह उपकरण","🔢 Quantitative & Qualitative / मात्रात्मक एवं गुणात्मक","📸 Evidence Records / प्रमाण अभिलेख","✅ Data Quality / डेटा गुणवत्ता"]],
      ["Learning & Reporting / सीख एवं रिपोर्टिंग",["📊 Analysis / विश्लेषण","📝 Progress Reports / प्रगति रिपोर्ट","🔁 Feedback Loops / प्रतिक्रिया चक्र","🌱 Adaptive Management / अनुकूली प्रबंधन"]]
    ]
  },
  {
    test:/reporting & documentation|रिपोर्टिंग एवं दस्तावेज|दस्तावेज़ीकरण/i,icon:"📄",
    modules:[
      ["Documentation Basics / दस्तावेज़ीकरण आधार",["📖 Why Document / दस्तावेज़ क्यों","🗂️ Types of Records / रिकॉर्ड के प्रकार","✍️ Accurate Writing / सटीक लेखन","📸 Evidence & Photos / प्रमाण एवं चित्र"]],
      ["Writing Reports / रिपोर्ट लेखन",["🧱 Report Structure / रिपोर्ट संरचना","📊 Data & Tables / डेटा एवं तालिका","📝 Narrative & Findings / विवरण एवं निष्कर्ष","🎯 Recommendations / सुझाव"]],
      ["Responsible Reporting / जिम्मेदार रिपोर्टिंग",["✅ Honest Claims / सच्चे दावे","🔒 Privacy & Consent / गोपनीयता एवं सहमति","📅 Timely Submission / समय पर प्रस्तुति","📚 Archiving / अभिलेखन"]]
    ]
  },
  {
    test:/safeguarding & ethics|सुरक्षा एवं नैतिकता|safeguarding/i,icon:"🛡️",
    modules:[
      ["Safeguarding Foundation / सुरक्षा आधार",["📖 What is Safeguarding / सुरक्षा क्या है","👶 Child Protection / बाल संरक्षण","🧑 Vulnerable Adults / असुरक्षित वयस्क","📜 Code of Conduct / आचार संहिता"]],
      ["Ethics in Practice / व्यवहार में नैतिकता",["🤝 Consent & Privacy / सहमति एवं गोपनीयता","⚖️ Do No Harm / नुकसान न करें","🚫 Power & Boundaries / शक्ति एवं सीमाएँ","📸 Responsible Images / जिम्मेदार चित्र"]],
      ["Reporting & Response / रिपोर्टिंग एवं प्रतिक्रिया",["🚨 Recognising Concerns / चिंता पहचानना","📞 Reporting Channels / शिकायत माध्यम","🤲 Supporting Survivors / पीड़ित की सहायता","🔄 Learning & Improvement / सीख एवं सुधार"]]
    ]
  }
];

const CATEGORY_BLUEPRINTS = {
  "Education / शिक्षा": [
    ["Foundation / आधार","अर्थ, स्तर, लक्ष्य और सीखने की बुनियाद",["Learning Goals / सीखने के लक्ष्य","Core Concepts / मुख्य अवधारणाएँ","Study Plan / अध्ययन योजना"]],
    ["Learning Methods / सीखने की विधियाँ","पढ़ना, समझना, नोट्स और स्मृति",["Effective Reading / प्रभावी पठन","Note Making / नोट्स बनाना","Memory & Revision / स्मृति एवं पुनरावृत्ति"]],
    ["Practice / अभ्यास","करके सीखना, प्रश्न और application",["Active Learning / सक्रिय सीखना","Practice Tasks / अभ्यास कार्य","Problem Solving / समस्या समाधान"]],
    ["Assessment / आकलन","प्रगति, feedback और सुधार",["Self Assessment / स्व-मूल्यांकन","Exam & Project Skills / परीक्षा एवं प्रोजेक्ट कौशल","Feedback & Improvement / feedback एवं सुधार"]],
    ["Next Learning / आगे की सीख","उच्च स्तर, resources और lifelong learning",["Learning Resources / learning resources","Career & Further Study / करियर एवं आगे की पढ़ाई","Lifelong Learning / आजीवन सीखना"]]
  ],
  "English & Communication / अंग्रेज़ी एवं संचार": [
    ["Language Foundation / भाषा आधार","शब्द, वाक्य और सही अर्थ",["Vocabulary / शब्द भंडार","Sentence Building / वाक्य निर्माण","Pronunciation / उच्चारण"]],
    ["Reading & Writing / पठन एवं लेखन","पढ़कर समझना और स्पष्ट लिखना",["Reading Skills / पठन कौशल","Paragraph Writing / अनुच्छेद लेखन","Grammar in Use / प्रयोगात्मक व्याकरण"]],
    ["Listening & Speaking / सुनना एवं बोलना","समझ, response और conversation",["Listening Practice / listening अभ्यास","Daily Conversation / दैनिक बातचीत","Confidence & Fluency / आत्मविश्वास एवं fluency"]],
    ["Practical Communication / व्यावहारिक संचार","काम, फोन, email और public situations",["Email & Messages / ईमेल एवं संदेश","Workplace Communication / कार्यस्थल संचार","Public Speaking / सार्वजनिक बोलना"]],
    ["Communication Mastery / संचार दक्षता","tone, clarity, feedback और continuous practice",["Polite & Clear Language / विनम्र एवं स्पष्ट भाषा","Common Errors / सामान्य गलतियाँ","30-Day Practice / 30-दिन अभ्यास"]]
  ],
  "Digital Skills / डिजिटल कौशल": [
    ["Digital Foundation / डिजिटल आधार","device, OS, files और basic workflows",["Devices & Operating Systems / डिवाइस एवं ऑपरेटिंग सिस्टम","Files & Folders / फाइल एवं फोल्डर","Typing & Everyday Tasks / typing एवं दैनिक कार्य"]],
    ["Internet Skills / इंटरनेट कौशल","search, websites, downloads और online services",["Browser & Search / ब्राउज़र एवं खोज","Online Forms & Services / ऑनलाइन फॉर्म एवं सेवाएँ","Information Verification / जानकारी सत्यापन"]],
    ["Productivity / डिजिटल उत्पादकता","documents, spreadsheets और collaboration",["Documents & Notes / दस्तावेज़ एवं नोट्स","Sheets & Data Basics / शीट एवं डेटा आधार","Cloud & Collaboration / cloud एवं collaboration"]],
    ["Digital Safety / डिजिटल सुरक्षा","privacy, accounts और safe transactions",["Passwords & MFA / पासवर्ड एवं MFA","Phishing & Scams / phishing एवं scams","Privacy & Digital Payments / privacy एवं डिजिटल भुगतान"]],
    ["Troubleshooting / समस्या समाधान","backup, errors और responsible digital practice",["Basic Troubleshooting / मूल troubleshooting","Backup & Recovery / backup एवं recovery","Digital Responsibility / डिजिटल जिम्मेदारी"]]
  ],
  "Career & Workplace / करियर एवं कार्यस्थल": [
    ["Career Foundation / करियर आधार","interest, skills, education और goals",["Self Assessment / स्व-मूल्यांकन","Career Options / करियर विकल्प","Goal & Roadmap / लक्ष्य एवं roadmap"]],
    ["Job Search / नौकरी खोज","opportunities, applications और verification",["Job Description Reading / job description समझना","Application Strategy / application strategy","Job Fraud Awareness / job fraud awareness"]],
    ["Resume & Interview / रिज्यूमे एवं इंटरव्यू","truthful profile और interview practice",["Resume Structure / resume structure","Portfolio & Evidence / portfolio एवं evidence","Interview Practice / interview अभ्यास"]],
    ["Workplace Skills / कार्यस्थल कौशल","communication, teamwork और time",["Professional Communication / professional communication","Teamwork & Leadership / teamwork एवं leadership","Time & Task Management / समय एवं task management"]],
    ["Professional Growth / पेशेवर विकास","ethics, feedback और upskilling",["Workplace Ethics / workplace ethics","Feedback & Performance / feedback एवं performance","Continuous Upskilling / लगातार upskilling"]]
  ],
  "Skill Development / कौशल विकास": [
    ["Skill Foundation / कौशल आधार","knowledge से practical capability तक",["What is a Skill? / कौशल क्या है?","Skill Gap / skill gap","Practice Design / अभ्यास योजना"]],
    ["Technical Practice / तकनीकी अभ्यास","tools, method, quality और repetition",["Tools & Safety / tools एवं safety","Step-by-Step Work / चरणबद्ध काम","Quality Standards / गुणवत्ता मानक"]],
    ["Work Readiness / कार्य तैयारी","communication, records और discipline",["Professional Behaviour / पेशेवर व्यवहार","Records & Documentation / रिकॉर्ड एवं documentation","Teamwork / teamwork"]],
    ["Income & Enterprise / आय एवं उद्यम","service, product, cost और customer",["Customer Need / customer need","Costing & Pricing / costing एवं pricing","Small Pilot / छोटा pilot"]],
    ["Improvement / निरंतर सुधार","feedback, portfolio और growth",["Quality Feedback / quality feedback","Portfolio of Work / काम का portfolio","Next Skill Roadmap / अगला skill roadmap"]]
  ],
  "Women & Child Development / महिला एवं बाल विकास": [
    ["Rights & Dignity / अधिकार एवं गरिमा","समानता, सम्मान और अवसर",["Equality & Dignity / समानता एवं गरिमा","Women’s Rights Awareness / महिला अधिकार जागरूकता","Child Rights / बाल अधिकार"]],
    ["Health & Development / स्वास्थ्य एवं विकास","nutrition, hygiene और life-stage needs",["Nutrition Basics / पोषण आधार","Hygiene & Safe Water / स्वच्छता एवं सुरक्षित जल","Growth & Development / वृद्धि एवं विकास"]],
    ["Safety & Protection / सुरक्षा एवं संरक्षण","personal, digital और safeguarding",["Personal Safety / व्यक्तिगत सुरक्षा","Digital Safety / डिजिटल सुरक्षा","Child Protection / बाल संरक्षण"]],
    ["Education & Empowerment / शिक्षा एवं सशक्तिकरण","learning, skills और participation",["Girls’ Education / बालिका शिक्षा","Skills & Economic Participation / कौशल एवं आर्थिक भागीदारी","Self-Help Groups / स्वयं सहायता समूह"]],
    ["Family & Support / परिवार एवं सहयोग","positive care, inclusion और referral",["Positive Parenting / सकारात्मक पालन-पोषण","Inclusion & Accessibility / समावेशन एवं accessibility","Support & Referral / सहायता एवं referral"]]
  ],
  "Health / स्वास्थ्य": [
    ["Health Foundation / स्वास्थ्य आधार","wellbeing, prevention और health literacy",["Health & Well-being / स्वास्थ्य एवं कल्याण","Risk & Prevention / जोखिम एवं बचाव","When to Seek Care / कब चिकित्सकीय सहायता लें"]],
    ["Nutrition & Hygiene / पोषण एवं स्वच्छता","food, sanitation और daily habits",["Balanced Nutrition / संतुलित पोषण","Personal Hygiene / व्यक्तिगत स्वच्छता","Safe Food & Water / सुरक्षित भोजन एवं जल"]],
    ["Condition Awareness / रोग जागरूकता","awareness, risk factors और timely support",["HIV-AIDS Awareness / HIV-AIDS जागरूकता","Cancer Awareness / कैंसर जागरूकता","Malnutrition Awareness / कुपोषण जागरूकता"]],
    ["Wellbeing Practices / कल्याण अभ्यास","movement, sleep, stress और safe practices",["Yoga & Movement / योग एवं movement","Sleep & Recovery / नींद एवं recovery","Stress & Healthy Habits / तनाव एवं healthy habits"]],
    ["Support & Prevention / सहयोग एवं prevention","stigma-free support और responsible decisions",["Family Health / परिवार स्वास्थ्य","De-addiction & Recovery / नशामुक्ति एवं recovery","Health Information Literacy / स्वास्थ्य जानकारी की समझ"]]
  ],
  "Environment / पर्यावरण": [
    ["Ecology Foundation / पारिस्थितिकी आधार","air, water, soil और ecosystems",["Air & Water / वायु एवं जल","Soil & Land / मिट्टी एवं भूमि","Ecosystems & Biodiversity / ecosystem एवं biodiversity"]],
    ["Nature Conservation / प्रकृति संरक्षण","trees, forests और natural resources",["Tree Care / वृक्ष देखभाल","Forest Conservation / वन संरक्षण","Natural Resources / प्राकृतिक संसाधन"]],
    ["Climate & Energy / जलवायु एवं ऊर्जा","climate risk और cleaner energy",["Climate Change / जलवायु परिवर्तन","Renewable Energy / नवीकरणीय ऊर्जा","Energy Efficiency / ऊर्जा दक्षता"]],
    ["Waste & Water / कचरा एवं जल","reduce, reuse और water stewardship",["Waste Segregation / कचरा पृथक्करण","Recycling & Safe Disposal / recycling एवं सुरक्षित disposal","Water Conservation / जल संरक्षण"]],
    ["Local Action / स्थानीय पर्यावरण action","community planning और measurable action",["Environmental Audit / पर्यावरण audit","Community Campaign / सामुदायिक अभियान","Action & Monitoring / action एवं monitoring"]]
  ],
  "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास": [
    ["Farm Foundation / कृषि आधार","soil, season, seed और crop planning",["Soil Health / मृदा स्वास्थ्य","Crop & Season Planning / फसल एवं मौसम योजना","Seeds & Planting / बीज एवं बुवाई"]],
    ["Crop Management / फसल प्रबंधन","water, nutrition और crop protection",["Water Management / जल प्रबंधन","Plant Nutrition / पौध पोषण","Pest & Disease Management / कीट एवं रोग प्रबंधन"]],
    ["Livestock & Rural Livelihood / पशुपालन एवं आजीविका","livestock, post-harvest और local enterprise",["Animal Husbandry / पशुपालन","Post-Harvest Management / कटाई बाद प्रबंधन","Rural Livelihoods / ग्रामीण आजीविका"]],
    ["Market & Enterprise / बाजार एवं उद्यम","cost, quality और market linkage",["Farm Records & Costing / खेत रिकॉर्ड एवं costing","Value Addition / value addition","Market Linkage / market linkage"]],
    ["Sustainable Rural Development / टिकाऊ ग्रामीण विकास","resources, risk और community planning",["Climate-Smart Agriculture / climate-smart agriculture","Natural Resource Conservation / संसाधन संरक्षण","Farmer Groups & Planning / किसान समूह एवं योजना"]]
  ],
  "Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य": [
    ["Human Dignity / मानवीय गरिमा","equality, dignity और basic rights",["Equality & Non-Discrimination / समानता एवं भेदभाव-रोध","Human Rights Basics / मानवाधिकार आधार","Dignity in Practice / व्यवहार में गरिमा"]],
    ["Values & Ethics / मूल्य एवं नैतिकता","honesty, empathy और responsibility",["Moral Reasoning / नैतिक सोच","Honesty & Integrity / ईमानदारी एवं integrity","Empathy & Fairness / सहानुभूति एवं fairness"]],
    ["Justice & Accountability / न्याय एवं जवाबदेही","lawful process, transparency और grievance awareness",["Civic Rights & Duties / नागरिक अधिकार एवं कर्तव्य","Transparency & Accountability / पारदर्शिता एवं जवाबदेही","Grievance Awareness / शिकायत व्यवस्था जागरूकता"]],
    ["Harmony & Inclusion / सद्भाव एवं समावेशन","diversity, dialogue और participation",["Respectful Dialogue / सम्मानजनक संवाद","Communal Harmony / सामुदायिक सद्भाव","Inclusive Participation / समावेशी भागीदारी"]],
    ["Responsible Citizenship / जिम्मेदार नागरिकता","public responsibility और ethical action",["Public Spaces / सार्वजनिक स्थान","Information Responsibility / जानकारी की जिम्मेदारी","Community Action / सामुदायिक action"]]
  ],
  "Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास": [
    ["Understanding Disability / दिव्यांगता की समझ","disability, dignity और barriers",["Disability Awareness / दिव्यांगता जागरूकता","Accessibility / accessibility","Person-Centred Support / व्यक्ति-केंद्रित सहयोग"]],
    ["Inclusive Education / समावेशी शिक्षा","learning access और reasonable support",["Learning Barriers / learning barriers","Accessible Learning / accessible learning","Family & Teacher Support / परिवार एवं शिक्षक सहयोग"]],
    ["Rehabilitation / पुनर्वास","functional recovery और participation",["Functional Support / functional support","Assistive Support / सहायक उपकरण एवं support","Community Participation / सामुदायिक भागीदारी"]],
    ["Vulnerable & Elder Support / संवेदनशील समूह सहयोग","safety, dignity और referral",["Elderly Support / वरिष्ठ नागरिक सहयोग","Vulnerable Child Support / vulnerable child support","Referral & Documentation / referral एवं documentation"]],
    ["Inclusive Community / समावेशी समुदाय","rights, design और continuous improvement",["Inclusive Services / inclusive services","Communication & Consent / communication एवं consent","Accessibility Action Plan / accessibility action plan"]]
  ],
  "Animal Protection / पशु संरक्षण": [
    ["Animal Welfare Foundation / पशु कल्याण आधार","humane care और responsible coexistence",["Animal Welfare / पशु कल्याण","Food, Water & Shelter / भोजन, जल एवं आश्रय","Humane Handling / मानवीय handling"]],
    ["Health & Care / स्वास्थ्य एवं देखभाल","hygiene, observation और veterinary support",["Hygiene & Sanitation / स्वच्छता","Basic Health Observation / स्वास्थ्य observation","Veterinary Support / veterinary सहायता"]],
    ["Gaushala & Livestock Care / गौशाला एवं पशुधन देखभाल","capacity, nutrition और records",["Cattle Nutrition / पशु पोषण","Shelter Management / shelter management","Health Records / health records"]],
    ["Wildlife & Birds / वन्यजीव एवं पक्षी","habitat, safety और conservation",["Wildlife Protection / वन्यजीव संरक्षण","Bird Care & Habitat / पक्षी एवं habitat","Human-Wildlife Coexistence / सह-अस्तित्व"]],
    ["Community Action / सामुदायिक action","responsible volunteering और monitoring",["Rescue Awareness / rescue awareness","Volunteer Safety / volunteer safety","Community Monitoring / community monitoring"]]
  ],
  "Culture & Heritage / संस्कृति एवं विरासत": [
    ["Heritage Foundation / विरासत आधार","history, identity और preservation",["What is Heritage? / विरासत क्या है?","Local History / स्थानीय इतिहास","Documentation / documentation"]],
    ["Language & Literature / भाषा एवं साहित्य","language, texts और meaning",["Sanskrit & Language Basics / संस्कृत एवं भाषा आधार","Reading Traditional Texts / पारंपरिक पाठ पठन","Meaning & Context / अर्थ एवं संदर्भ"]],
    ["Music & Performance / संगीत एवं प्रस्तुति","rhythm, practice और expression",["Swar & Taal / स्वर एवं ताल","Practice & Performance / अभ्यास एवं प्रस्तुति","Audience & Respect / audience एवं सम्मान"]],
    ["Cultural Programmes / सांस्कृतिक कार्यक्रम","planning, participation और documentation",["Event Planning / event planning","Cultural Sensitivity / सांस्कृतिक संवेदनशीलता","Documentation & Archive / documentation एवं archive"]],
    ["Preservation & Sharing / संरक्षण एवं साझा करना","heritage care और responsible digital sharing",["Preservation Methods / संरक्षण विधियाँ","Digital Archive / digital archive","Community Heritage Project / community heritage project"]]
  ],
  "Youth & Disaster Preparedness / युवा एवं आपदा तैयारी": [
    ["Youth Foundation / युवा आधार","skills, confidence और responsibility",["Youth Strengths & Goals / युवा strengths एवं goals","Communication & Teamwork / communication एवं teamwork","Career Awareness / career awareness"]],
    ["Disaster Preparedness / आपदा तैयारी","hazards, warnings और family readiness",["Local Hazards / स्थानीय hazards","Emergency Kit & Contacts / emergency kit एवं contacts","Family Emergency Plan / family emergency plan"]],
    ["Safe Response / सुरक्षित प्रतिक्रिया","first actions, evacuation और coordination",["Warning & Evacuation / warning एवं evacuation","Basic Response Principles / basic response principles","Volunteer Safety / volunteer safety"]],
    ["Relief & Recovery / राहत एवं recovery","documentation, support और rehabilitation",["Relief Coordination / राहत coordination","Needs Assessment / जरूरत assessment","Recovery & Rehabilitation / recovery एवं rehabilitation"]],
    ["Community Resilience / सामुदायिक resilience","drills, inclusion और continuous improvement",["Community Emergency Plan / community emergency plan","Mock Drill / mock drill","After-Action Review / after-action review"]]
  ],
  "Personal Development / व्यक्तिगत विकास": [
    ["Self Awareness / आत्म-जागरूकता","strengths, values और interests",["Strengths & Values / strengths एवं values","Interests & Learning Style / रुचि एवं learning style","Personal Reflection / personal reflection"]],
    ["Confidence & Communication / आत्मविश्वास एवं संचार","practice, body language और feedback",["Confidence Through Practice / अभ्यास से confidence","Listening & Expression / listening एवं expression","Feedback / feedback"]],
    ["Goals & Time / लक्ष्य एवं समय","priority, routine और progress",["Goal Setting / लक्ष्य निर्धारण","Time Management / समय प्रबंधन","Habit Building / आदत निर्माण"]],
    ["Thinking & Decisions / सोच एवं निर्णय","problem solving, evidence और choices",["Problem Solving / समस्या समाधान","Decision Making / निर्णय लेना","Critical Thinking / critical thinking"]],
    ["Creativity & Growth / रचनात्मकता एवं विकास","ideas, experimentation और lifelong learning",["Creative Thinking / creative thinking","Experiment & Learn / प्रयोग एवं सीख","Personal Growth Plan / personal growth plan"]]
  ],
  "NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान": [
    ["NGO Foundation / NGO आधार","purpose, governance और accountability",["What is an NGO? / NGO क्या है?","Governance & Roles / governance एवं roles","Community Accountability / community accountability"]],
    ["Project Planning / परियोजना योजना","problem, objectives और activities",["Needs Assessment / जरूरत assessment","Objectives & Activities / objectives एवं activities","Timeline & Responsibilities / timeline एवं responsibilities"]],
    ["Grant & Budget / grant एवं बजट","eligibility, cost और financial planning",["Grant Guidelines / grant guidelines","Budget Building / बजट निर्माण","Records & Variance / records एवं variance"]],
    ["Monitoring & Reporting / monitoring एवं reporting","outputs, outcomes और evidence",["Indicators & Evidence / indicators एवं evidence","Monitoring & Learning / monitoring एवं learning","Reports & Documentation / reports एवं documentation"]],
    ["Ethics & Sustainability / नैतिकता एवं sustainability","safeguarding, transparency और continuity",["Safeguarding & Consent / safeguarding एवं consent","Transparency & Responsible Claims / transparency एवं responsible claims","Sustainability & Next Project / sustainability एवं अगला project"]]
  ]
};

const SUBJECT_PROFILE_RULES = [
  {
    test: /primary education|प्राथमिक शिक्षा/i,
    icon:"📚",
    modules:[
      ["Foundation / आधार",["🔤 Letters & Sounds / अक्षर एवं ध्वनि","🔢 Numbers & Counting / संख्या एवं गिनती","✍️ Fine Motor & Writing Readiness / लेखन तैयारी","👀 Observation & Classification / अवलोकन एवं वर्गीकरण"]],
      ["Hindi Language / हिंदी भाषा",["अ — स्वर / Vowels","क — व्यंजन / Consonants","म — मात्राएँ / Matras","📖 शब्द, वाक्य एवं पठन / Words, Sentences & Reading"]],
      ["English Foundation / अंग्रेज़ी आधार",["🔤 Alphabet A–Z / वर्णमाला","🔊 Phonics & Sounds / ध्वनि","🧠 Everyday Vocabulary / दैनिक शब्दावली","💬 Simple Sentences / सरल वाक्य"]],
      ["Reading & Writing / पठन एवं लेखन",["📖 Reading Fluency / प्रवाहपूर्ण पठन","🧩 Comprehension / पठन-बोध","✍️ Sentence Writing / वाक्य लेखन","📝 Paragraph & Picture Writing / अनुच्छेद एवं चित्र लेखन"]],
      ["Mathematics / गणित",["🔢 Number Sense / संख्या-बोध","➕ Addition & Subtraction / जोड़ एवं घटाव","✖️ Multiplication & Division / गुणा एवं भाग","🍕 Fractions, Patterns & Problems / भिन्न, पैटर्न एवं समस्याएँ"]],
      ["Measurement & Money / मापन एवं धन",["📏 Length & Distance / लंबाई एवं दूरी","⚖️ Weight & Capacity / भार एवं क्षमता","⏰ Time & Calendar / समय एवं कैलेंडर","💰 Money & Simple Budget / पैसा एवं सरल बजट"]],
      ["EVS & Science / पर्यावरण एवं विज्ञान",["👨‍👩‍👧 Myself, Family & School / मैं, परिवार एवं विद्यालय","🌱 Plants & Animals / पौधे एवं पशु","💧 Water, Air & Weather / जल, वायु एवं मौसम","🔬 Simple Experiments / सरल प्रयोग"]],
      ["Health & Safety / स्वास्थ्य एवं सुरक्षा",["🧼 Hygiene & Nutrition / स्वच्छता एवं पोषण","🦷 Dental & Physical Health / दंत एवं शारीरिक स्वास्थ्य","🚦 Road & Home Safety / सड़क एवं घर सुरक्षा","🛡️ Personal & Emergency Safety / व्यक्तिगत एवं आपात सुरक्षा"]],
      ["Life Skills & Values / जीवन कौशल एवं मूल्य",["❤️ Empathy & Kindness / सहानुभूति एवं दया","🤝 Cooperation & Respect / सहयोग एवं सम्मान","🗣️ Communication & Asking Questions / संवाद एवं प्रश्न","🧠 Problem Solving & Decision Making / समस्या समाधान एवं निर्णय"]],
      ["Creativity & Digital Learning / रचनात्मकता एवं डिजिटल सीख",["🎨 Drawing, Music & Craft / कला, संगीत एवं शिल्प","📖 Stories, Poems & Role Play / कहानी, कविता एवं अभिनय","💻 Devices & Basic Digital Skills / उपकरण एवं डिजिटल कौशल","🏆 Projects, Revision & Assessment / प्रोजेक्ट, पुनरावृत्ति एवं आकलन"]]
    ]
  },
  {
    test:/secondary education|माध्यमिक शिक्षा/i,icon:"🎓",
    modules:[
      ["Academic Foundation / शैक्षणिक आधार",["📚 Subject Basics / विषय आधार","🧠 Concept Building / अवधारणा निर्माण","📝 Notes & Textbook Skills / नोट्स एवं पाठ्यपुस्तक कौशल","🎯 Learning Goals / सीखने के लक्ष्य"]],
      ["Language & Communication / भाषा एवं संचार",["📖 Reading Comprehension / पठन-बोध","✍️ Structured Writing / संरचित लेखन","🗣️ Speaking & Presentation / बोलना एवं प्रस्तुति","🔤 Grammar & Vocabulary / व्याकरण एवं शब्दावली"]],
      ["Mathematics / गणित",["🔢 Number & Algebra / संख्या एवं बीजगणित","📐 Geometry / ज्यामिति","📊 Data & Graphs / डेटा एवं ग्राफ","🧩 Problem Solving / समस्या समाधान"]],
      ["Science / विज्ञान",["⚛️ Physics Foundations / भौतिकी आधार","🧪 Chemistry Foundations / रसायन आधार","🌱 Biology Foundations / जीवविज्ञान आधार","🔬 Experiment & Evidence / प्रयोग एवं प्रमाण"]],
      ["Social Science / सामाजिक विज्ञान",["🌍 Geography / भूगोल","📜 History / इतिहास","🏛️ Civics / नागरिक शास्त्र","💹 Economics Basics / अर्थशास्त्र आधार"]],
      ["Study & Examination / अध्ययन एवं परीक्षा",["⏱️ Time Management / समय प्रबंधन","📝 Answer Writing / उत्तर लेखन","📋 Mock Tests / मॉक टेस्ट","🔄 Revision & Error Analysis / पुनरावृत्ति एवं त्रुटि विश्लेषण"]]
    ]
  },
  {
    test:/higher secondary education|उच्च माध्यमिक शिक्षा/i,icon:"🎓",
    modules:[
      ["Stream Foundation / विषय-धारा आधार",["🧭 Subject Selection / विषय चयन","📚 Core Concepts / मुख्य अवधारणाएँ","🧪 Practical Orientation / प्रायोगिक आधार","🎯 Learning Outcomes / learning outcomes"]],
      ["Academic Mastery / अकादमिक दक्षता",["📖 Deep Reading / गहन पठन","📝 Notes & Answer Writing / नोट्स एवं उत्तर लेखन","🧠 Critical Thinking / आलोचनात्मक सोच","📊 Data & Evidence / डेटा एवं प्रमाण"]],
      ["Practical & Projects / प्रायोगिक एवं प्रोजेक्ट",["🔬 Practical Work / प्रायोगिक कार्य","📁 Project Planning / प्रोजेक्ट योजना","📊 Observation & Reporting / अवलोकन एवं रिपोर्ट","🎤 Presentation / प्रस्तुति"]],
      ["Examination / परीक्षा तैयारी",["📋 Syllabus Mapping / पाठ्यक्रम मानचित्रण","⏱️ Study Plan / अध्ययन योजना","📝 Mock Tests / मॉक टेस्ट","🔄 Revision & Error Log / पुनरावृत्ति एवं त्रुटि लॉग"]],
      ["Higher Study & Career / उच्च शिक्षा एवं करियर",["🎓 Courses & Pathways / पाठ्यक्रम एवं मार्ग","🧭 Career Exploration / करियर खोज","📝 Applications & Documents / आवेदन एवं दस्तावेज़","💡 Skills & Portfolio / कौशल एवं portfolio"]]
    ]
  },
  {
    test:/college|higher education|उच्च शिक्षा/i,icon:"🎓",
    modules:[
      ["Academic Skills / अकादमिक कौशल",["📚 Academic Reading / अकादमिक पठन","📝 Academic Writing / अकादमिक लेखन","🔎 Research Basics / शोध आधार","📑 Referencing & Sources / संदर्भ एवं स्रोत"]],
      ["Subject Mastery / विषय दक्षता",["🧠 Core Concepts / मुख्य अवधारणाएँ","📊 Evidence & Analysis / प्रमाण एवं विश्लेषण","💬 Discussion & Seminar / चर्चा एवं seminar","📝 Assignment Skills / assignment कौशल"]],
      ["Research & Projects / शोध एवं प्रोजेक्ट",["❓ Research Question / शोध प्रश्न","🧪 Method & Data / विधि एवं डेटा","📊 Analysis / विश्लेषण","📄 Report & Presentation / रिपोर्ट एवं प्रस्तुति"]],
      ["Professional Exposure / पेशेवर अनुभव",["💼 Internship Readiness / internship तैयारी","🤝 Teamwork / teamwork","📧 Professional Communication / professional communication","📁 Portfolio / portfolio"]],
      ["Career & Lifelong Learning / करियर एवं आजीवन सीख",["🧭 Career Options / करियर विकल्प","📜 Certifications / प्रमाणन","🧠 Upskilling / upskilling","🌐 Lifelong Learning / आजीवन सीख"]]
    ]
  },
  {
    test:/computer education|computer training|कंप्यूटर शिक्षा|कंप्यूटर प्रशिक्षण/i,icon:"💻",
    modules:[
      ["Computer Foundation / कंप्यूटर आधार",["🖥️ Hardware / हार्डवेयर","⚙️ Software / सॉफ्टवेयर","🪟 Operating System / ऑपरेटिंग सिस्टम","⌨️ Keyboard & Mouse / कीबोर्ड एवं माउस"]],
      ["Files & Productivity / फाइल एवं उत्पादकता",["📁 Files & Folders / फाइल एवं फोल्डर","📝 Documents / दस्तावेज़","📊 Spreadsheets / स्प्रेडशीट","📽️ Presentations / प्रस्तुति"]],
      ["Internet / इंटरनेट",["🌐 Browser / ब्राउज़र","🔎 Search / खोज","⬇️ Download & Upload / डाउनलोड एवं अपलोड","📝 Online Forms / ऑनलाइन फॉर्म"]],
      ["Communication / डिजिटल संचार",["📧 Email / ईमेल","☁️ Cloud Storage / cloud storage","🤝 Online Collaboration / online collaboration","📅 Calendar & Meetings / कैलेंडर एवं meetings"]],
      ["Digital Safety / डिजिटल सुरक्षा",["🔐 Passwords & MFA / पासवर्ड एवं MFA","🎣 Phishing & Scams / phishing एवं scams","🛡️ Privacy / गोपनीयता","💳 Safe Digital Payments / सुरक्षित डिजिटल भुगतान"]],
      ["Troubleshooting / समस्या समाधान",["🧰 Basic Troubleshooting / मूल troubleshooting","💾 Backup / backup","🔄 Recovery / recovery","🧑‍💻 Responsible Use / जिम्मेदार उपयोग"]]
    ]
  },
  {
    test:/nursing/i,icon:"🩺",
    modules:[
      ["Nursing Foundation / नर्सिंग आधार",["🩺 Role of Nursing / नर्सिंग की भूमिका","🧼 Infection Prevention / संक्रमण रोकथाम","🛏️ Patient Comfort / रोगी सुविधा","⚖️ Ethics & Dignity / नैतिकता एवं गरिमा"]],
      ["Patient Assessment / रोगी आकलन",["👁️ Observation / अवलोकन","🌡️ Vital Signs / vital signs","📝 History & Records / इतिहास एवं रिकॉर्ड","🚨 Warning Signs / चेतावनी संकेत"]],
      ["Basic Care / मूल रोगी देखभाल",["🛏️ Hygiene & Positioning / स्वच्छता एवं स्थिति","🍲 Nutrition & Hydration / पोषण एवं hydration","💊 Medication Safety / दवा सुरक्षा","🧴 Wound & Skin Care / घाव एवं त्वचा देखभाल"]],
      ["Communication / संचार",["🗣️ Patient Communication / रोगी संवाद","👨‍👩‍👧 Family Support / परिवार सहयोग","🔒 Privacy & Confidentiality / गोपनीयता","📋 Handover & Teamwork / handover एवं teamwork"]],
      ["Documentation & Safety / दस्तावेज़ एवं सुरक्षा",["📑 Nursing Records / नर्सिंग रिकॉर्ड","🧤 PPE & Safety / PPE एवं सुरक्षा","🚑 Emergency Awareness / आपात जागरूकता","🔄 Review & Quality / समीक्षा एवं गुणवत्ता"]]
    ]
  },
  {
    test:/competitive exam|प्रतियोगी परीक्षा/i,icon:"📝",
    modules:[
      ["Exam Foundation / परीक्षा आधार",["📋 Syllabus Mapping / पाठ्यक्रम मानचित्रण","🎯 Exam Pattern / परीक्षा पैटर्न","📚 Resources / अध्ययन सामग्री","📊 Baseline Test / प्रारंभिक परीक्षण"]],
      ["Quantitative Aptitude / मात्रात्मक योग्यता",["🔢 Number System / संख्या पद्धति","➕ Arithmetic / अंकगणित","📊 Data Interpretation / डेटा व्याख्या","⏱️ Speed & Accuracy / गति एवं शुद्धता"]],
      ["Reasoning / तर्कशक्ति",["🧩 Series / श्रृंखला","🔗 Analogy & Classification / analogy एवं वर्गीकरण","🧭 Direction & Relation / दिशा एवं संबंध","🧠 Logical Puzzles / तार्किक पहेलियाँ"]],
      ["Language & General Awareness / भाषा एवं सामान्य ज्ञान",["📖 Comprehension / comprehension","🔤 Grammar & Vocabulary / व्याकरण एवं शब्दावली","🌍 General Awareness / सामान्य जागरूकता","📰 Current Affairs Method / current affairs method"]],
      ["Mocks & Revision / मॉक एवं पुनरावृत्ति",["📝 Previous Papers / previous papers","⏱️ Timed Mock / timed mock","📊 Error Analysis / त्रुटि विश्लेषण","🔄 Revision Plan / पुनरावृत्ति योजना"]]
    ]
  },
  {
    test:/library|पुस्तकालय/i,icon:"📚",
    modules:[
      ["Reading Foundation / पठन आधार",["📖 Reading Habit / पठन आदत","🔎 Finding a Book / पुस्तक खोज","📚 Book Structure / पुस्तक संरचना","📝 Reading Notes / पठन नोट्स"]],
      ["Information Skills / सूचना कौशल",["🔎 Search & Keywords / खोज एवं keywords","📑 Reference Sources / संदर्भ स्रोत","🧭 Reliable Information / विश्वसनीय जानकारी","©️ Responsible Use / जिम्मेदार उपयोग"]],
      ["Critical Reading / आलोचनात्मक पठन",["💡 Main Idea / मुख्य विचार","🧩 Evidence / प्रमाण","⚖️ Compare Sources / स्रोत तुलना","📝 Summarise / सार लेखन"]],
      ["Library Practice / पुस्तकालय अभ्यास",["🏷️ Classification / वर्गीकरण","📇 Catalogue / catalogue","📅 Issue & Return / issue एवं return","🤝 Library Etiquette / पुस्तकालय शिष्टाचार"]],
      ["Reading Project / पठन प्रोजेक्ट",["📕 Book Review / पुस्तक समीक्षा","🗣️ Book Talk / book talk","📁 Reading Portfolio / reading portfolio","🏆 Reading Challenge / reading challenge"]]
    ]
  },
  {
    test:/science fair|विज्ञान मेले/i,icon:"🔬",
    modules:[
      ["Question & Idea / प्रश्न एवं विचार",["❓ Observation / अवलोकन","💡 Problem Identification / समस्या पहचान","🧠 Research Question / शोध प्रश्न","🎯 Project Objective / उद्देश्य"]],
      ["Experiment / प्रयोग",["🧪 Hypothesis / परिकल्पना","🧰 Materials & Safety / सामग्री एवं सुरक्षा","🔬 Procedure / प्रक्रिया","👀 Observation / अवलोकन"]],
      ["Data & Evidence / डेटा एवं प्रमाण",["📊 Data Recording / डेटा रिकॉर्डिंग","📈 Tables & Graphs / तालिका एवं ग्राफ","🔎 Evidence / प्रमाण","🧠 Conclusion / निष्कर्ष"]],
      ["Model & Presentation / मॉडल एवं प्रस्तुति",["🧱 Model Building / मॉडल निर्माण","🪧 Display Board / display board","🎤 Presentation / प्रस्तुति","❓ Question Handling / प्रश्नों का उत्तर"]],
      ["Reflection / समीक्षा",["⚠️ Errors & Limitations / त्रुटियाँ एवं सीमाएँ","🔄 Improvements / सुधार","🌍 Real-world Application / वास्तविक उपयोग","📄 Final Report / अंतिम रिपोर्ट"]]
    ]
  },
  {
    test:/spoken english|बोलचाल की अंग्रेज़ी/i,icon:"🗣️",
    modules:[
      ["Speaking Foundation / बोलने की नींव",["🔊 Pronunciation / उच्चारण","👋 Greetings & Introduction / अभिवादन एवं परिचय","🧠 Everyday Vocabulary / दैनिक शब्दावली","💬 Basic Sentences / मूल वाक्य"]],
      ["Daily Conversation / दैनिक बातचीत",["🏠 Home Talk / घर की बातचीत","🏫 School & Work Talk / school एवं work","🛒 Shopping & Services / खरीदारी एवं सेवाएँ","📞 Phone Conversation / फोन बातचीत"]],
      ["Listening & Response / सुनना एवं प्रतिक्रिया",["👂 Listening for Meaning / अर्थ के लिए सुनना","❓ Questions & Answers / प्रश्नोत्तर","🔁 Repeat & Paraphrase / दोहराना एवं अपने शब्दों में कहना","🧩 Clarification / clarification"]],
      ["Fluency / प्रवाह",["⏱️ Speaking Practice / speaking अभ्यास","🗣️ Storytelling / कहानी कहना","🎤 Presentation / प्रस्तुति","😊 Confidence & Body Language / confidence एवं body language"]],
      ["Practical English / व्यावहारिक अंग्रेज़ी",["✈️ Travel / यात्रा","💼 Workplace / कार्यस्थल","📧 Messages & Email / संदेश एवं email","🤝 Polite English / विनम्र अंग्रेज़ी"]]
    ]
  },
  {
    test:/grammar|व्याकरण/i,icon:"🔤",
    modules:[
      ["Word Classes / शब्द-भेद",["🧱 Noun / संज्ञा","👤 Pronoun / सर्वनाम","🏃 Verb / क्रिया","🎨 Adjective & Adverb / विशेषण एवं क्रिया-विशेषण"]],
      ["Sentence Structure / वाक्य संरचना",["🧩 Subject & Predicate / subject एवं predicate","🔗 Subject-Verb Agreement / subject-verb agreement","❓ Questions / प्रश्न","🚫 Negatives / नकारात्मक वाक्य"]],
      ["Tense & Time / काल",["⏮️ Present / वर्तमान","⏪ Past / भूत","⏩ Future / भविष्य","🔄 Mixed Practice / मिश्रित अभ्यास"]],
      ["Usage / प्रयोग",["📌 Articles / articles","📍 Prepositions / prepositions","🔗 Conjunctions / conjunctions","📝 Punctuation / विराम चिह्न"]],
      ["Error Correction / त्रुटि सुधार",["🔎 Common Errors / सामान्य गलतियाँ","✍️ Editing / editing","🧠 Rule + Example / नियम एवं उदाहरण","📝 Practice Test / अभ्यास परीक्षण"]]
    ]
  },
  {
    test:/vocabulary|शब्द भंडार/i,icon:"📖",
    modules:[
      ["Word Foundations / शब्द आधार",["🔤 Word Families / word families","🧩 Prefix & Suffix / उपसर्ग एवं प्रत्यय","🔊 Pronunciation / उच्चारण","✍️ Spelling / spelling"]],
      ["Meaning & Context / अर्थ एवं संदर्भ",["📖 Meaning / अर्थ","🧠 Context Clues / context clues","🔄 Synonyms & Antonyms / समानार्थी एवं विलोम","🧩 Multiple Meanings / बहुअर्थी शब्द"]],
      ["Usage / प्रयोग",["💬 Sentence Use / वाक्य प्रयोग","🗣️ Conversation Words / बातचीत शब्द","💼 Workplace Vocabulary / workplace vocabulary","📚 Academic Vocabulary / academic vocabulary"]],
      ["Memory / स्मृति",["🧠 Active Recall / active recall","🃏 Flashcards / flashcards","🔁 Spaced Review / spaced review","📝 Word Journal / word journal"]],
      ["Application / उपयोग",["📖 Reading Practice / पठन अभ्यास","✍️ Writing Practice / लेखन अभ्यास","🎯 Topic Word Lists / विषयवार शब्द सूची","🏆 Vocabulary Quiz / शब्दावली quiz"]]
    ]
  },
  {
    test:/email|message writing|संदेश लेखन/i,icon:"📧",
    modules:[
      ["Message Foundation / संदेश आधार",["🎯 Purpose & Audience / उद्देश्य एवं पाठक","🧾 Subject Line / विषय पंक्ति","📝 Clear Sentences / स्पष्ट वाक्य","🙏 Polite Tone / विनम्र tone"]],
      ["Email Structure / ईमेल संरचना",["👋 Greeting / अभिवादन","📌 Context / संदर्भ","🙏 Request or Information / अनुरोध या सूचना","👋 Closing & Signature / समापन एवं हस्ताक्षर"]],
      ["Practical Messages / व्यावहारिक संदेश",["📅 Meeting Request / meeting request","📄 Application / आवेदन","📦 Follow-up / follow-up","🚨 Urgent but Clear Message / जरूरी संदेश"]],
      ["Attachments & Privacy / attachment एवं privacy",["📎 Attachments / attachments","🔒 Personal Information / निजी जानकारी","🔗 Links & Verification / links एवं सत्यापन","🧹 Proofreading / proofreading"]],
      ["Practice / अभ्यास",["✍️ Rewrite Poor Message / गलत संदेश सुधारें","📧 Write a Formal Email / formal email","💬 Write a Short Message / छोटा संदेश","🏆 Review Checklist / review checklist"]]
    ]
  },
  {
    test:/cyber safety|online safety|privacy|साइबर सुरक्षा|ऑनलाइन सुरक्षा/i,icon:"🛡️",
    modules:[
      ["Digital Identity / डिजिटल पहचान",["👤 Personal Information / व्यक्तिगत जानकारी","🔐 Passwords / पासवर्ड","2️⃣ MFA / बहु-कारक प्रमाणीकरण","🧾 Account Recovery / account recovery"]],
      ["Threat Awareness / खतरे पहचानना",["🎣 Phishing / phishing","💸 Scams / scams","🦠 Malware Awareness / malware awareness","🎭 Impersonation / नकली पहचान"]],
      ["Safe Browsing / सुरक्षित browsing",["🌐 Website Checks / website जाँच","🔗 Link Safety / link safety","⬇️ Safe Downloads / सुरक्षित downloads","📱 App Permissions / app permissions"]],
      ["Privacy / गोपनीयता",["🔒 Data Sharing / data sharing","📍 Location Privacy / location privacy","📸 Photo & Social Sharing / photo एवं social sharing","🧹 Digital Footprint / digital footprint"]],
      ["Incident Response / घटना के बाद",["🚨 Recognise a Problem / समस्या पहचानें","⛔ Stop & Secure / रोकें एवं सुरक्षित करें","📣 Report / report करें","🔄 Recover & Learn / recovery एवं learning"]]
    ]
  },
  {
    test:/digital payment|डिजिटल भुगतान/i,icon:"💳",
    modules:[
      ["Payment Basics / भुगतान आधार",["💳 UPI & Digital Payments / UPI एवं डिजिटल भुगतान","🏦 Bank Account Basics / बैंक खाता आधार","📱 Payment Apps / payment apps","🧾 Transaction Records / लेनदेन रिकॉर्ड"]],
      ["Safe Transactions / सुरक्षित लेनदेन",["🔐 PIN & Password / PIN एवं password","🔢 OTP Safety / OTP सुरक्षा","👤 Verify Receiver / प्राप्तकर्ता सत्यापन","📲 QR Safety / QR सुरक्षा"]],
      ["Fraud Awareness / धोखाधड़ी जागरूकता",["🎣 Phishing / phishing","📞 Fake Calls / fake calls","💸 Payment Request Scams / payment scams","🚨 Suspicious Transaction / संदिग्ध लेनदेन"]],
      ["After Payment / भुगतान के बाद",["🧾 Receipt / receipt","🔎 Statement Check / statement check","📣 Report Fraud / fraud report","🔄 Dispute & Follow-up / dispute एवं follow-up"]],
      ["Practice / अभ्यास",["🧠 Spot the Scam / scam पहचानें","📋 Safe Payment Checklist / सुरक्षित checklist","💬 Role Play / role play","🏆 Knowledge Check / ज्ञान जाँच"]]
    ]
  },
  {
    test:/resume|cv|रिज्यूमे/i,icon:"📄",
    modules:[
      ["Profile Foundation / प्रोफाइल आधार",["👤 Contact Details / संपर्क विवरण","🎓 Education / शिक्षा","🛠️ Skills / कौशल","🏆 Achievements / उपलब्धियाँ"]],
      ["Experience & Evidence / अनुभव एवं प्रमाण",["💼 Experience / अनुभव","📁 Projects / projects","📜 Certificates / certificates","🔗 Portfolio Evidence / portfolio प्रमाण"]],
      ["Resume Structure / resume संरचना",["🧾 Summary / summary","📋 Sections / sections","📐 Formatting / formatting","🔎 Relevance / relevance"]],
      ["Job-Specific Resume / job अनुसार resume",["🎯 Job Description Match / job description match","🔑 Keywords / keywords","🧹 Remove Unnecessary Detail / अनावश्यक detail हटाएँ","✅ Accuracy / accuracy"]],
      ["Review & Application / समीक्षा एवं आवेदन",["🔍 Proofreading / proofreading","📧 Cover Message / cover message","📤 Submit & Track / submit एवं track","🚫 Common Mistakes / सामान्य गलतियाँ"]]
    ]
  },
  {
    test:/interview|साक्षात्कार/i,icon:"🎤",
    modules:[
      ["Interview Foundation / इंटरव्यू आधार",["🎯 Purpose & Role / उद्देश्य एवं role","📄 Job Description / job description","👤 Self Introduction / परिचय","🧠 Research / research"]],
      ["Question Practice / प्रश्न अभ्यास",["❓ Common Questions / सामान्य प्रश्न","⭐ Strengths / strengths","🧩 Situation Questions / situation questions","📈 Experience Examples / अनुभव examples"]],
      ["Communication / संचार",["🗣️ Clear Answers / स्पष्ट उत्तर","👀 Body Language / body language","👂 Listening / listening","⏱️ Concise Responses / संक्षिप्त उत्तर"]],
      ["Mock Interview / mock interview",["🎭 Role Play / role play","📹 Record & Review / record एवं review","📝 Feedback / feedback","🔄 Improve Answers / answers सुधारें"]],
      ["Professional Follow-up / follow-up",["📧 Thank-you Message / thank-you message","📌 Clarification / clarification","📅 Next Steps / next steps","🧭 Learning from Rejection / rejection से learning"]]
    ]
  },
  {
    test:/career planning|करियर योजना/i,icon:"🧭",
    modules:[
      ["Self Discovery / आत्म-खोज",["❤️ Interests / रुचियाँ","💪 Strengths / strengths","🛠️ Skills / कौशल","🎯 Values & Priorities / values एवं priorities"]],
      ["Career Information / करियर जानकारी",["🔎 Occupations / occupations","🎓 Education Pathways / शिक्षा मार्ग","📜 Qualifications / qualifications","💼 Work Reality / काम की वास्तविकता"]],
      ["Decision Making / निर्णय",["⚖️ Compare Options / विकल्प तुलना","📊 Evidence / evidence","🧩 Constraints / सीमाएँ","🎯 Shortlist / shortlist"]],
      ["Career Roadmap / करियर roadmap",["🗺️ Short-term Goal / अल्पकालिक लक्ष्य","📅 Action Plan / action plan","🧠 Skill Gap / skill gap","📈 Progress Review / progress review"]],
      ["Practical Preparation / व्यावहारिक तैयारी",["📄 Resume / resume","🎤 Interview / interview","🤝 Networking / networking","🔄 Continuous Learning / continuous learning"]]
    ]
  },
  {
    test:/tailoring|embroidery|सिलाई|कढ़ाई/i,icon:"🧵",
    modules:[
      ["Tools & Safety / उपकरण एवं सुरक्षा",["🧵 Sewing Machine / सिलाई मशीन","✂️ Tools / औजार","📏 Measurement / नाप","🛡️ Work Safety / कार्य सुरक्षा"]],
      ["Basic Techniques / मूल तकनीक",["🪡 Stitching / सिलाई","🧷 Seams & Finishing / seams एवं finishing","🧵 Embroidery Basics / कढ़ाई आधार","🧶 Thread & Fabric / धागा एवं कपड़ा"]],
      ["Measurement & Pattern / नाप एवं pattern",["📏 Body Measurement / body measurement","📐 Pattern Basics / pattern आधार","✂️ Cutting / cutting","🧩 Fitting / fitting"]],
      ["Practice Projects / अभ्यास प्रोजेक्ट",["👗 Simple Garment / सरल परिधान","👜 Utility Item / उपयोगी वस्तु","🎨 Design & Finishing / design एवं finishing","🔎 Quality Check / quality check"]],
      ["Enterprise / उद्यम",["💰 Costing / costing","🏷️ Pricing / pricing","📦 Packaging / packaging","🤝 Customer Service / customer service"]]
    ]
  },
  {
    test:/self-employment|entrepreneurship|उद्यमिता|स्वरोजगार/i,icon:"💼",
    modules:[
      ["Idea & Problem / विचार एवं समस्या",["💡 Business Idea / business idea","👥 Customer Need / customer need","🔎 Local Opportunity / स्थानीय अवसर","🎯 Value Proposition / value proposition"]],
      ["Product & Service / उत्पाद एवं सेवा",["🛠️ Product Design / product design","📋 Service Process / service process","✅ Quality / quality","📦 Packaging / packaging"]],
      ["Money / धन प्रबंधन",["💰 Cost / cost","🏷️ Price / price","📊 Revenue & Profit / आय एवं लाभ","🧾 Records / records"]],
      ["Customer & Market / ग्राहक एवं बाजार",["🗣️ Customer Communication / ग्राहक संवाद","📣 Marketing / marketing","🤝 Repeat Customers / repeat customers","🔎 Feedback / feedback"]],
      ["Small Pilot / छोटा pilot",["🧪 Test the Idea / idea test","📈 Measure Results / परिणाम मापें","🔄 Improve / सुधारें","🗺️ Next Plan / अगली योजना"]]
    ]
  },
  {
    test:/women empowerment|महिला सशक्तिकरण/i,icon:"👩",
    modules:[
      ["Education & Confidence / शिक्षा एवं आत्मविश्वास",["📚 Education / शिक्षा","🗣️ Communication / संचार","💪 Self-Confidence / आत्मविश्वास","🎯 Goal Setting / लक्ष्य निर्धारण"]],
      ["Rights & Dignity / अधिकार एवं गरिमा",["⚖️ Equality / समानता","🧾 Identity & Documents / पहचान एवं दस्तावेज़","🛡️ Safety / सुरक्षा","🤝 Support Systems / सहयोग प्रणालियाँ"]],
      ["Economic Participation / आर्थिक भागीदारी",["🛠️ Skills / कौशल","💼 Work Opportunities / काम के अवसर","💰 Financial Awareness / वित्तीय जागरूकता","👥 SHG & Collective Action / SHG एवं सामूहिक action"]],
      ["Health & Well-being / स्वास्थ्य एवं कल्याण",["🥗 Nutrition / पोषण","🧼 Hygiene / स्वच्छता","🩺 Healthcare Access / स्वास्थ्य सेवा","🧠 Mental Well-being / मानसिक कल्याण"]],
      ["Leadership & Participation / नेतृत्व एवं भागीदारी",["🗣️ Voice & Decision Making / आवाज एवं निर्णय","🤝 Community Participation / सामुदायिक भागीदारी","📋 Planning / योजना","🌱 Sustainable Growth / सतत विकास"]]
    ]
  },
  {
    test:/child rights|बाल अधिकार/i,icon:"🧒",
    modules:[
      ["Child Rights / बाल अधिकार",["🛡️ Protection / संरक्षण","📚 Education / शिक्षा","❤️ Development / विकास","🗣️ Participation / भागीदारी"]],
      ["Safety / सुरक्षा",["🏠 Safe Home / सुरक्षित घर","🏫 Safe School / सुरक्षित विद्यालय","📱 Digital Safety / डिजिटल सुरक्षा","🚨 Help Seeking / सहायता लेना"]],
      ["Health & Nutrition / स्वास्थ्य एवं पोषण",["🥗 Nutrition / पोषण","🧼 Hygiene / स्वच्छता","🩺 Health Care / स्वास्थ्य देखभाल","📈 Growth / विकास"]],
      ["Learning & Inclusion / सीखना एवं समावेशन",["📖 Learning Support / learning support","♿ Inclusion / समावेशन","👩‍🏫 Teacher Support / teacher support","👨‍👩‍👧 Family Support / family support"]],
      ["Awareness & Referral / जागरूकता एवं सहायता",["🔎 Recognise Concern / चिंता पहचानें","🗣️ Safe Disclosure / सुरक्षित रूप से बताना","🤝 Trusted Adult / भरोसेमंद वयस्क","📋 Referral & Follow-up / referral एवं follow-up"]]
    ]
  },
  {
    test:/health|well-being|स्वास्थ्य|कल्याण/i,icon:"❤️",
    modules:[
      ["Health Foundation / स्वास्थ्य आधार",["❤️ Well-being / कल्याण","🧠 Health Literacy / health literacy","⚠️ Risk Factors / जोखिम कारक","🩺 When to Seek Care / कब care लें"]],
      ["Nutrition & Hygiene / पोषण एवं स्वच्छता",["🥗 Balanced Nutrition / संतुलित पोषण","💧 Safe Water / सुरक्षित जल","🧼 Hygiene / स्वच्छता","🍎 Food Safety / food safety"]],
      ["Prevention / रोकथाम",["💉 Prevention & Vaccination Awareness / रोकथाम एवं टीकाकरण जागरूकता","🦠 Infection Prevention / संक्रमण रोकथाम","🏃 Physical Activity / physical activity","😴 Sleep & Recovery / नींद एवं recovery"]],
      ["Condition Awareness / रोग जागरूकता",["🔎 Symptoms & Risk / लक्षण एवं जोखिम","📋 Screening Awareness / screening awareness","🧑‍⚕️ Professional Care / professional care","🤝 Stigma-free Support / stigma-free support"]],
      ["Healthy Living / स्वस्थ जीवन",["🧘 Yoga & Movement / योग एवं movement","🧠 Stress Management / stress management","🚭 De-addiction Awareness / नशामुक्ति जागरूकता","📚 Reliable Health Information / विश्वसनीय health information"]]
    ]
  },
  {
    test:/aids|hiv/i,icon:"🧬",
    modules:[
      ["HIV Basics / HIV की मूल जानकारी",["🧬 HIV क्या है? / What is HIV?","🦠 Transmission / संक्रमण के मार्ग","🚫 What Does Not Transmit / किनसे नहीं फैलता","🧠 Facts vs Myths / तथ्य एवं मिथक"]],
      ["Prevention / रोकथाम",["🛡️ Prevention / बचाव","🩺 Testing Awareness / परीक्षण जागरूकता","💊 Treatment & Care / उपचार एवं care","🤝 Safe & Respectful Support / सुरक्षित सहयोग"]],
      ["Testing & Treatment / परीक्षण एवं उपचार",["🔎 Testing / testing","📋 Confirmatory Care / confirmatory care","💊 ART Awareness / ART awareness","📅 Follow-up / follow-up"]],
      ["Stigma & Rights / stigma एवं अधिकार",["❤️ Dignity / गरिमा","🚫 Stigma Reduction / stigma reduction","🔒 Privacy / privacy","🤝 Support / support"]],
      ["Community Awareness / सामुदायिक जागरूकता",["📣 Correct Information / सही जानकारी","🧑‍🏫 Awareness Session / awareness session","❓ Questions / questions","📝 Knowledge Check / knowledge check"]]
    ]
  },
  {
    test:/cancer|कैंसर/i,icon:"🎗️",
    modules:[
      ["Cancer Basics / कैंसर आधार",["🧬 What is Cancer? / कैंसर क्या है?","🔎 Risk Factors / जोखिम कारक","🧠 Myths & Facts / मिथक एवं तथ्य","🩺 Why Early Care Matters / early care"]],
      ["Prevention / रोकथाम",["🚭 Tobacco Risk / तंबाकू जोखिम","🍎 Healthy Lifestyle / स्वस्थ जीवन","☀️ Relevant Exposure Awareness / exposure awareness","🩺 Screening Concepts / screening concepts"]],
      ["Warning Signs / चेतावनी संकेत",["🔎 Persistent Changes / लगातार बदलाव","🩸 Unusual Symptoms / असामान्य लक्षण","🩺 Professional Evaluation / medical evaluation","📋 Records & Follow-up / records एवं follow-up"]],
      ["Care Journey / care journey",["👨‍⚕️ Diagnosis Awareness / diagnosis awareness","💊 Treatment Awareness / treatment awareness","❤️ Supportive Care / supportive care","🧠 Emotional Support / emotional support"]],
      ["Community Awareness / सामुदायिक जागरूकता",["📣 Evidence-based Information / प्रमाण-आधारित जानकारी","🚫 Stigma Reduction / stigma reduction","🤝 Family Support / family support","📝 Knowledge Check / knowledge check"]]
    ]
  },
  {
    test:/malnutrition|कुपोषण|nutrition|पोषण/i,icon:"🥗",
    modules:[
      ["Nutrition Foundation / पोषण आधार",["🥗 Macronutrients / प्रमुख पोषक तत्व","🧬 Micronutrients / सूक्ष्म पोषक तत्व","💧 Hydration / hydration","🍽️ Balanced Plate / balanced plate"]],
      ["Child & Family Nutrition / बाल एवं परिवार पोषण",["👶 Growth Needs / वृद्धि की जरूरत","🤱 Age-appropriate Feeding / उम्रानुसार feeding","🏠 Family Food Diversity / family food diversity","📈 Growth Monitoring Awareness / growth monitoring"]],
      ["Food Safety / खाद्य सुरक्षा",["🧼 Hygiene / hygiene","💧 Safe Water / safe water","🍲 Safe Cooking & Storage / cooking एवं storage","🚫 Contamination Awareness / contamination awareness"]],
      ["Deficiency & Risk / कमी एवं जोखिम",["🩸 Iron Awareness / iron awareness","☀️ Vitamin D Awareness / vitamin D awareness","🧠 Iodine & Other Micronutrients / iodine एवं micronutrients","⚠️ Risk Recognition / risk recognition"]],
      ["Action & Support / action एवं support",["📋 Food Diary / food diary","🥕 Local Nutritious Foods / स्थानीय पौष्टिक भोजन","🩺 Professional Support / professional support","📊 Review & Improve / review एवं सुधार"]]
    ]
  },
  {
    test:/yoga|योग/i,icon:"🧘",
    modules:[
      ["Yoga Foundation / योग आधार",["🧘 What is Yoga? / योग क्या है?","🫁 Breath Awareness / श्वास जागरूकता","🧍 Posture & Alignment / मुद्रा एवं alignment","🛡️ Safety / सुरक्षा"]],
      ["Movement / movement",["🌅 Warm-up / warm-up","🧍 Basic Asanas / मूल आसन","🤸 Mobility / mobility","🧘 Relaxation / relaxation"]],
      ["Breathing / प्राणायाम आधार",["🌬️ Natural Breathing / सामान्य श्वास","⏱️ Breath Awareness / श्वास पर ध्यान","🧘 Simple Practices / सरल अभ्यास","⚠️ Contraindication Awareness / सावधानी"]],
      ["Mind & Well-being / मन एवं कल्याण",["🧠 Attention / ध्यान","😌 Relaxation / relaxation","❤️ Emotional Balance / भावनात्मक संतुलन","😴 Sleep Support / नींद support"]],
      ["Practice Plan / अभ्यास योजना",["📅 Daily Routine / दैनिक routine","📝 Practice Log / अभ्यास log","🔄 Progress Review / progress review","👨‍🏫 Guided Learning / guided learning"]]
    ]
  },
  {
    test:/de-addiction|नशामुक्ति/i,icon:"🚭",
    modules:[
      ["Understanding Substance Use / पदार्थ उपयोग की समझ",["🧠 What is Dependence? / निर्भरता क्या है?","🚭 Tobacco / तंबाकू","🍺 Alcohol Awareness / alcohol awareness","💊 Other Substances / अन्य पदार्थ"]],
      ["Risk & Impact / जोखिम एवं प्रभाव",["❤️ Physical Health / शारीरिक स्वास्थ्य","🧠 Mental & Social Impact / मानसिक एवं सामाजिक प्रभाव","👨‍👩‍👧 Family Impact / परिवार पर प्रभाव","💰 Financial Impact / आर्थिक प्रभाव"]],
      ["Recovery / recovery",["🤝 Asking for Help / मदद लेना","🧑‍⚕️ Professional Treatment / professional treatment","📅 Recovery Plan / recovery plan","🔄 Relapse Awareness / relapse awareness"]],
      ["Family & Community / परिवार एवं समुदाय",["❤️ Supportive Communication / supportive communication","🚫 Stigma Reduction / stigma reduction","🛡️ Safe Environment / सुरक्षित वातावरण","🤝 Community Support / community support"]],
      ["Action / action",["📋 Personal Trigger Awareness / triggers","☎️ Help-Seeking Plan / help-seeking plan","📝 Recovery Journal / recovery journal","🏆 Review / review"]]
    ]
  },
  {
    test:/environment basics|tree plantation|biodiversity|forest conservation|natural resource|medicinal plant|organic farming|renewable energy|climate change|waste management|water conservation|पर्यावरण|वृक्षारोपण|जैव विविधता|वन संरक्षण|प्राकृतिक संसाधन|औषधीय पौधे|जैविक खेती|नवीकरणीय ऊर्जा|जलवायु परिवर्तन|कचरा प्रबंधन|जल संरक्षण/i,
    icon:"🌱",
    modules:[
      ["Ecology Foundation / पारिस्थितिकी आधार",["🌍 Ecosystems / ecosystem","🌬️ Air / वायु","💧 Water / जल","🌱 Soil & Land / मिट्टी एवं भूमि"]],
      ["Topic Knowledge / विषय की मुख्य समझ",["🔎 Identification & Observation / पहचान एवं अवलोकन","🧩 Causes & Processes / कारण एवं प्रक्रियाएँ","📊 Evidence & Measurement / प्रमाण एवं मापन","⚠️ Risks & Impacts / जोखिम एवं प्रभाव"]],
      ["Conservation / संरक्षण",["🌳 Protection / संरक्षण","♻️ Reduce-Reuse-Recycle / reduce-reuse-recycle","💧 Resource Efficiency / संसाधन दक्षता","🤝 Community Participation / सामुदायिक भागीदारी"]],
      ["Practical Action / व्यावहारिक action",["🧪 Field Activity / field activity","📋 Local Audit / local audit","📸 Observation Record / observation record","🗺️ Action Plan / action plan"]],
      ["Project & Assessment / प्रोजेक्ट एवं आकलन",["📁 Project / project","📊 Data & Results / डेटा एवं परिणाम","🗣️ Presentation / प्रस्तुति","🏆 Knowledge Check / ज्ञान जाँच"]]
    ]
  },
  {
    test:/agriculture|farmer|organic farming|animal husbandry|rural|कृषि|किसान|जैविक खेती|पशुपालन|ग्रामीण/i,icon:"🌾",
    modules:[
      ["Farm Foundation / कृषि आधार",["🌱 Soil Health / मृदा स्वास्थ्य","🌦️ Season & Climate / मौसम एवं जलवायु","🌾 Crop Planning / फसल योजना","🌱 Seed & Planting / बीज एवं बुवाई"]],
      ["Crop Management / फसल प्रबंधन",["💧 Irrigation / सिंचाई","🥗 Plant Nutrition / पौध पोषण","🐛 Pest & Disease Awareness / कीट एवं रोग जागरूकता","🌿 Weed Management / खरपतवार प्रबंधन"]],
      ["Livestock & Rural Livelihood / पशुपालन एवं आजीविका",["🐄 Animal Nutrition / पशु पोषण","🏠 Housing & Hygiene / आवास एवं hygiene","🩺 Veterinary Care / veterinary care","🧺 Rural Livelihoods / ग्रामीण आजीविका"]],
      ["Post-Harvest & Market / कटाई बाद एवं बाजार",["🌾 Harvest / कटाई","📦 Storage / भंडारण","💰 Costing / लागत","🤝 Market Linkage / बाजार linkage"]],
      ["Sustainable Agriculture / टिकाऊ कृषि",["♻️ Resource Conservation / संसाधन संरक्षण","🌍 Climate-smart Practice / climate-smart practice","📒 Farm Records / farm records","📈 Farm Improvement Plan / farm improvement plan"]]
    ]
  },
  {
    test:/disability|rehabilitation|दिव्यांगता|पुनर्वास/i,icon:"♿",
    modules:[
      ["Understanding Disability / दिव्यांगता की समझ",["♿ Types & Diversity / विविधता","❤️ Dignity / गरिमा","🚧 Barriers / बाधाएँ","🗣️ Person-first Communication / सम्मानजनक communication"]],
      ["Accessibility / accessibility",["🏫 Accessible Learning / accessible learning","🏢 Accessible Spaces / accessible spaces","📱 Digital Accessibility / digital accessibility","🦯 Assistive Support / सहायक support"]],
      ["Rehabilitation / पुनर्वास",["🧑‍⚕️ Functional Support / functional support","🏃 Daily Activities / दैनिक गतिविधियाँ","🗣️ Communication Support / communication support","🤝 Community Participation / सामुदायिक भागीदारी"]],
      ["Family & Education / परिवार एवं शिक्षा",["👨‍👩‍👧 Family Support / family support","👩‍🏫 Teacher Support / teacher support","📚 Individual Learning Needs / learning needs","📝 Documentation / documentation"]],
      ["Inclusion / समावेशन",["⚖️ Rights & Inclusion / अधिकार एवं समावेशन","🤝 Participation / participation","📋 Accessibility Plan / accessibility plan","🌱 Continuous Improvement / निरंतर सुधार"]]
    ]
  },
  {
    test:/animal|gaushala|wildlife|birds|पशु|गौशाला|वन्यजीव|पक्षी/i,icon:"🐾",
    modules:[
      ["Animal Welfare / पशु कल्याण",["❤️ Humane Care / मानवीय देखभाल","🍚 Food & Water / भोजन एवं जल","🏠 Shelter / आश्रय","👐 Humane Handling / मानवीय handling"]],
      ["Health & Hygiene / स्वास्थ्य एवं स्वच्छता",["🧼 Sanitation / स्वच्छता","👀 Observation / observation","🩺 Veterinary Support / veterinary support","📋 Health Records / health records"]],
      ["Livestock / पशुधन",["🐄 Nutrition / पोषण","🏠 Housing / housing","💉 Preventive Care Awareness / preventive care","📈 Production & Welfare Balance / welfare balance"]],
      ["Wildlife & Birds / वन्यजीव एवं पक्षी",["🌳 Habitat / habitat","🦅 Bird Care Awareness / पक्षी care","🚫 Illegal Harm Awareness / अवैध harm awareness","🤝 Coexistence / सह-अस्तित्व"]],
      ["Community Action / सामुदायिक action",["🚨 Rescue Awareness / rescue awareness","🛡️ Volunteer Safety / volunteer safety","📣 Awareness / awareness","📊 Monitoring / monitoring"]]
    ]
  },
  {
    test:/culture|heritage|sanskrit|music|cultural|संस्कृति|विरासत|संस्कृत|संगीत/i,icon:"🏛️",
    modules:[
      ["Heritage Foundation / विरासत आधार",["🏛️ Tangible Heritage / भौतिक विरासत","📜 Intangible Heritage / अमूर्त विरासत","🗺️ Local History / स्थानीय इतिहास","🧾 Documentation / documentation"]],
      ["Language & Literature / भाषा एवं साहित्य",["🔤 Language Basics / भाषा आधार","📖 Reading Texts / पाठ पठन","🧠 Meaning & Context / अर्थ एवं संदर्भ","✍️ Writing & Recitation / लेखन एवं वाचन"]],
      ["Arts & Performance / कला एवं प्रस्तुति",["🎵 Music / संगीत","🥁 Rhythm & Taal / लय एवं ताल","🎭 Performance / प्रस्तुति","🎨 Visual Arts / दृश्य कला"]],
      ["Culture in Community / समुदाय में संस्कृति",["🤝 Participation / participation","🎪 Event Planning / event planning","🙏 Cultural Sensitivity / cultural sensitivity","📸 Documentation / documentation"]],
      ["Preservation / संरक्षण",["🛡️ Conservation / संरक्षण","💾 Digital Archive / digital archive","📚 Responsible Sharing / responsible sharing","🌱 Community Heritage Project / community project"]]
    ]
  },
  {
    test:/disaster|youth|आपदा|युवा/i,icon:"🛡️",
    modules:[
      ["Preparedness / तैयारी",["⚠️ Hazards / hazards","📢 Warning Systems / warning systems","🎒 Emergency Kit / emergency kit","📞 Emergency Contacts / emergency contacts"]],
      ["Family & Community Plan / परिवार एवं समुदाय योजना",["🏠 Family Plan / family plan","🗺️ Evacuation Route / evacuation route","👥 Community Roles / community roles","♿ Inclusion / inclusion"]],
      ["Response / प्रतिक्रिया",["🚨 Immediate Safety / immediate safety","🏃 Evacuation / evacuation","🤝 Coordination / coordination","🛡️ Volunteer Safety / volunteer safety"]],
      ["Relief & Recovery / राहत एवं recovery",["📦 Relief Needs / राहत जरूरत","📋 Needs Assessment / जरूरत assessment","🏠 Recovery / recovery","🧠 Psychosocial Support Awareness / psychosocial support awareness"]],
      ["Drill & Improvement / drill एवं सुधार",["🎯 Mock Drill / mock drill","📝 After-Action Review / review","🔄 Improve Plan / plan सुधार","📊 Community Resilience / resilience"]]
    ]
  },
  {
    test:/ngo|project|grant|csr|non-profit|social project|एनजीओ|परियोजना|अनुदान/i,icon:"🤝",
    modules:[
      ["NGO Foundation / NGO आधार",["🏛️ Purpose & Governance / उद्देश्य एवं governance","👥 Roles & Responsibilities / roles एवं जिम्मेदारी","📜 Registration & Compliance Awareness / registration एवं compliance","🤝 Accountability / जवाबदेही"]],
      ["Needs & Project Design / जरूरत एवं project design",["🔎 Needs Assessment / जरूरत assessment","🎯 Problem Statement / समस्या कथन","📌 Objectives / objectives","🗓️ Activities & Timeline / activities एवं timeline"]],
      ["Budget & Grant / बजट एवं grant",["💰 Budget / budget","📋 Eligibility / eligibility","🧾 Financial Records / financial records","📤 Grant Application / grant application"]],
      ["Implementation & Monitoring / implementation एवं monitoring",["🚀 Activity Delivery / activity delivery","📊 Indicators / indicators","📸 Evidence / evidence","📝 Progress Review / progress review"]],
      ["Reporting & Sustainability / reporting एवं sustainability",["📄 Report Writing / report writing","📊 Outcomes / outcomes","🔍 Transparency / transparency","🌱 Sustainability & Next Project / sustainability एवं अगला project"]]
    ]
  }
];

// Prepend the subject-specific module structures so they win over the generic
// per-category blueprints. filter() preserves source order, and getSubjectProfile()
// picks the first match, so the most specific rule must come first.
SUBJECT_PROFILE_RULES.unshift(...SUBJECT_SPECIFIC_MODULES);

// KNOWLEDGE_WORLD_MODULES is keyed by the full "English / Hindi" title, while the
// subject exposes only the English part, so match on the English prefix.
const knowledgeWorldModulesFor = (subject) => {
  if (KNOWLEDGE_WORLD_MODULES[subject.en]) return KNOWLEDGE_WORLD_MODULES[subject.en];
  const key = Object.keys(KNOWLEDGE_WORLD_MODULES).find((k) => k.split(" / ")[0].trim() === subject.en);
  return key ? KNOWLEDGE_WORLD_MODULES[key] : null;
};

const getSubjectProfile = (subject) => {
  if (subject.category === "Knowledge World / ज्ञान संसार" && knowledgeWorldModulesFor(subject)) {
    return { icon:"🌍", modules: knowledgeWorldModulesFor(subject) };
  }
  const hay = subject.en + " " + subject.hi;
  const matches = SUBJECT_PROFILE_RULES.filter((p) => p.test.test(hay));
  const hit = matches.sort((a, b) => b.test.source.length - a.test.source.length)[0];
  if (hit) return hit;
  const disciplineMatches = DISCIPLINE_PROFILES.filter((p) => p.test.test(hay));
  const discipline = disciplineMatches.sort((a, b) => b.test.source.length - a.test.source.length)[0];
  if (discipline) return discipline;
  const blueprint = CATEGORY_BLUEPRINTS[subject.category] || CATEGORY_BLUEPRINTS["Personal Development / व्यक्तिगत विकास"];
  return {
    icon:"📘",
    modules: blueprint.map((m, i) => [
      m[0],
      m[2].map((x, j) => {
        const icons = ["📘","🔎","🧠","🛠️","📝","🎯"];
        return icons[j % icons.length] + " " + x;
      })
    ])
  };
};


const PRIMARY_EDUCATION_LESSON_CONTENT = {
  "Letters & Sounds / अक्षर एवं ध्वनि": {
    body:"बच्चे अक्षर की पहचान, उसका सही नाम और उससे जुड़ी ध्वनि सीखते हैं। हिंदी में स्वर-व्यंजन और अंग्रेज़ी में letter-sound connection को सुनना, बोलना, पहचानना और लिखना सिखाया जाता है।",
    objectives:["अक्षरों को देखकर पहचानना और नाम बताना।","सही ध्वनि सुनकर संबंधित अक्षर पहचानना।","अक्षर को सही दिशा और आकार में लिखने का अभ्यास करना।"],
    deep:"अक्षर केवल चित्र नहीं हैं; ध्वनि और लिखित चिन्ह के बीच संबंध पढ़ने की नींव है। समान दिखने या सुनने वाले अक्षरों को अलग पहचानना भी जरूरी है।",
    examples:["A → /a/ → Apple; B → /b/ → Ball.","क → कमल, म → मछली; अक्षर देखें, ध्वनि बोलें और शब्द में पहचानें।"],
    practice:["5 अक्षर देखकर नाम और ध्वनि बताइए।","सुनी हुई 5 ध्वनियों के सही अक्षर चुनिए.","अक्षर tracing और स्वतंत्र writing करें."],
    activity:"घर/कक्षा में 10 वस्तुएँ चुनकर उनके नाम का पहला अक्षर खोजें और बोलकर दिखाएँ।",
    mistakes:["अक्षर का नाम और उसकी ध्वनि एक ही मान लेना।","सिर्फ tracing करना, बिना स्वयं लिखे।"],
    summary:"पहचान → ध्वनि → बोलना → शब्द में पहचानना → लिखना।"
  },
  "Numbers & Counting / संख्या एवं गिनती": {
    body:"बच्चे वस्तुओं को एक-एक करके गिनना, संख्या पहचानना, संख्या लिखना और quantity से numeral का संबंध समझते हैं। 0 से आगे की संख्या-बोध को वास्तविक वस्तुओं और खेलों से विकसित किया जाता है।",
    objectives:["1 से आगे संख्याएँ क्रम में बोलना।","वस्तुओं की संख्या और लिखी हुई संख्या मिलाना।","कम, अधिक और बराबर मात्रा पहचानना।"],
    deep:"गिनती में हर वस्तु को एक संख्या देना और अंतिम संख्या को कुल मात्रा समझना महत्वपूर्ण है। केवल संख्या याद करना number sense नहीं है।",
    examples:["7 pencils गिनें और numeral 7 चुनें.","●●●● और ●● की तुलना करके बताएं कौन अधिक है।"],
    practice:["1–20 counting करें.","10 वस्तुओं के समूह बनाकर संख्या लिखें.","दो समूहों में more/less/equal बताएं."],
    activity:"रसोई या कक्षा की वस्तुओं की गिनती करके तीन अलग संख्या-सूचियाँ बनाएं।",
    mistakes:["एक वस्तु को दो बार गिनना।","अंतिम गिनी संख्या को कुल मात्रा न समझना।"],
    summary:"देखो → एक-एक गिनो → कुल बताओ → संख्या लिखो → तुलना करो।"
  },
  "Fine Motor & Writing Readiness / लेखन तैयारी": {
    body:"लेखन से पहले हाथ, उँगलियों और आँख-हाथ समन्वय को तैयार किया जाता है। tracing, line patterns, colouring, bead/string activities और pencil grip से लिखने की तैयारी होती है।",
    objectives:["सही और आरामदायक pencil grip विकसित करना।","सीधी, टेढ़ी, गोल और pattern lines बनाना।","आँख और हाथ के movement का coordination बढ़ाना।"],
    deep:"सुंदर handwriting केवल दबाव से नहीं आती; posture, grip, movement control और पर्याप्त practice मिलकर writing readiness बनाते हैं।",
    examples:["Standing lines → sleeping lines → curves → circles → letter strokes.","बिंदुओं को जोड़कर pattern पूरा करना।"],
    practice:["5 line patterns trace और फिर बिना guide के बनाएं.","चित्र में निर्धारित भाग colour करें.","छोटी-बड़ी shapes copy करें."],
    activity:"कागज पर 4 प्रकार की lines और 4 shapes बनाकर एक pattern book तैयार करें।",
    mistakes:["pencil बहुत कसकर पकड़ना।","बहुत देर तक बिना break लिखना।"],
    summary:"सही बैठना → grip → movement control → pattern → अक्षर लेखन।"
  },
  "Observation & Classification / अवलोकन एवं वर्गीकरण": {
    body:"बच्चे वस्तुओं, चित्रों, पौधों और जीवों को ध्यान से देखकर रंग, आकार, आकारमान, उपयोग और समानता-अंतर के आधार पर समूह बनाना सीखते हैं।",
    objectives:["वस्तु की कम से कम दो विशेषताएँ बताना।","समान और अलग वस्तुओं को पहचानना।","सरल नियम के आधार पर वस्तुओं को वर्गीकृत करना।"],
    deep:"Observation में केवल देखना नहीं, ध्यान से विवरण पहचानना और evidence के आधार पर group बनाना शामिल है।",
    examples:["लाल/नीली वस्तुएँ अलग करें.","पत्तियों को आकार या किनारे के आधार पर समूहित करें."],
    practice:["10 वस्तुओं में 2 classification rules बनाएं.","दो चित्रों में कम से कम 5 differences खोजें."],
    activity:"कक्षा में उपलब्ध वस्तुओं का 'किस आधार पर समूह बनाया?' चार्ट बनाएं।",
    mistakes:["बिना कारण group बनाना।","सिर्फ रंग देखकर हर वस्तु को एक ही तरह समझना।"],
    summary:"देखो → विशेषता पहचानो → तुलना करो → नियम बनाओ → समूह बनाओ।"
  },
  "अ — स्वर / Vowels": {
    body:"हिंदी के स्वर बच्चों को स्वतंत्र ध्वनि के रूप में पहचानने, बोलने, सुनने और लिखने सिखाए जाते हैं। अ, आ, इ, ई, उ, ऊ आदि को चित्र और शब्दों से जोड़ा जाता है।",
    objectives:["मुख्य स्वरों की पहचान करना।","स्वर की ध्वनि सही बोलना।","स्वर से शुरू होने वाले सरल शब्द पहचानना।"],
    deep:"स्वर की स्पष्ट ध्वनि आगे मात्राओं और शब्द-पठन को समझने की आधारशिला है।",
    examples:["अ → अनार, आ → आम, इ → इमली.","चित्र देखकर शुरुआती स्वर बताना।"],
    practice:["स्वर cards मिलाएँ.","हर स्वर के दो शब्द बोलें.","स्वर लिखने का अभ्यास करें."],
    activity:"घर से ऐसे चित्र/वस्तुएँ लाएँ जिनके नाम अलग-अलग स्वरों से शुरू होते हों।",
    mistakes:["स्वर की मात्रा और स्वतंत्र स्वर में भ्रम करना।","चित्र का नाम गलत बोलकर अक्षर चुनना।"],
    summary:"स्वर पहचानो → ध्वनि बोलो → शब्द से जोड़ो → लिखो।"
  },
  "क — व्यंजन / Consonants": {
    body:"व्यंजन जैसे क, ख, ग, घ आदि की पहचान, उच्चारण और शब्दों में स्थिति सिखाई जाती है। बच्चों को समान ध्वनियों के बीच अंतर सुनने और बोलने का अभ्यास कराया जाता है।",
    objectives:["व्यंजन देखकर नाम/ध्वनि पहचानना।","सरल शब्दों में व्यंजन ढूँढना।","सही stroke से व्यंजन लिखना।"],
    deep:"व्यंजन को अलग-अलग सुनना और शब्द में पहचानना phonological awareness बढ़ाता है; आगे मात्रा जोड़कर शब्द पढ़ने में यही आधार काम आता है।",
    examples:["क → कमल, ग → गमला, म → मछली.","'कमल' में क और म पहचानें."],
    practice:["5 व्यंजन सुनकर चुनें.","दिए शब्द में पहला/अंतिम व्यंजन खोजें.","copy और free writing करें."],
    activity:"अक्षर कार्ड से 5 छोटे शब्द बनाकर पढ़ें।",
    mistakes:["मिलती ध्वनियों को बिना सुने अनुमान से चुनना।","अक्षर का आकार उल्टा लिखना।"],
    summary:"ध्वनि सुनो → व्यंजन पहचानो → शब्द में खोजो → लिखो।"
  },
  "म — मात्राएँ / Matras": {
    body:"मात्राएँ व्यंजन के साथ स्वर ध्वनि बदलकर नए शब्द बनाती हैं। ा, ि, ी, ु, ू, े, ै, ो, ौ आदि को बोलकर, जोड़कर, पढ़कर और लिखकर समझाया जाता है।",
    objectives:["मात्रा का चिन्ह और उसकी ध्वनि पहचानना।","व्यंजन में मात्रा जोड़कर शब्द पढ़ना।","मात्रा की स्थिति सही लिखना।"],
    deep:"मात्रा को केवल याद नहीं करना; यह समझना जरूरी है कि मात्रा लगने पर अक्षर की आवाज कैसे बदलती है।",
    examples:["क + ा = का, क + ि = कि, क + ी = की.","कमल और कामल जैसे शब्दों में मात्रा का प्रभाव देखें."],
    practice:["एक व्यंजन पर अलग-अलग मात्राएँ लगाएँ.","10 मात्रा वाले शब्द पढ़ें.","सुने शब्द की सही मात्रा चुनें."],
    activity:"मात्रा chart बनाकर हर मात्रा के 3 सरल शब्द लिखें।",
    mistakes:["ि की मात्रा की स्थिति गलत लिखना।","मात्रा देखकर ध्वनि न बदलना।"],
    summary:"व्यंजन → मात्रा जोड़ो → नई ध्वनि → शब्द पढ़ो → लिखो।"
  },
  "शब्द, वाक्य एवं पठन / Words, Sentences & Reading": {
    body:"अक्षर और मात्राओं से बने शब्दों को पढ़कर अर्थ समझना और उन्हीं शब्दों से छोटे वाक्य बनाना सिखाया जाता है। चित्र, कहानी और बोलचाल को reading से जोड़ा जाता है।",
    objectives:["सरल शब्दों को बिना अक्षर-अक्षर अटककर पढ़ना।","पढ़े शब्द का अर्थ बताना।","2–5 शब्दों के सरल वाक्य बनाना।"],
    deep:"पठन का लक्ष्य केवल आवाज निकालना नहीं, अर्थ समझना है। इसलिए decoding के साथ vocabulary और comprehension भी विकसित की जाती है।",
    examples:["'राम आम खाता है।' पढ़ें और पूछें—कौन? क्या?","चित्र देखकर 3 शब्द और एक वाक्य लिखें."],
    practice:["10 सरल शब्द पढ़ें.","एक छोटा passage पढ़कर 3 प्रश्नों के उत्तर दें.","चित्र से वाक्य बनाएं."],
    activity:"बच्चे की पसंद की छोटी कहानी सुनाकर उसे 3 मुख्य शब्द और एक वाक्य बोलने दें।",
    mistakes:["हर शब्द का अर्थ समझे बिना केवल पढ़ जाना।","वाक्य में शब्दों का क्रम बिगाड़ना।"],
    summary:"शब्द पढ़ो → अर्थ समझो → वाक्य बनाओ → प्रश्न का उत्तर दो।"
  },
  "Alphabet A–Z / वर्णमाला": {
    body:"English alphabet A–Z में uppercase और lowercase letters, letter names और basic sound association सिखाई जाती है। Alphabet को केवल क्रम से बोलने के बजाय शब्दों और pictures से जोड़ा जाता है।",
    objectives:["A–Z पहचानना और क्रम बताना।","uppercase/lowercase pair मिलाना।","letter से जुड़े सरल शब्द पहचानना।"],
    deep:"Alphabet knowledge में visual form, letter name और sound—तीनों का connection जरूरी है।",
    examples:["A/a → apple, B/b → ball, C/c → cat.","Random letters दिखाकर नाम बताना."],
    practice:["A–Z flashcards मिलाएँ.","10 random letters पहचानें.","uppercase को lowercase से match करें."],
    activity:"घर की वस्तुओं में A–Z से शुरू होने वाले 5 English words खोजें।",
    mistakes:["B/d या p/q जैसे visually similar letters में भ्रम।","alphabet order याद होना ही reading मान लेना।"],
    summary:"देखो → नाम बोलो → uppercase/lowercase मिलाओ → word से जोड़ो।"
  },
  "Phonics & Sounds / ध्वनि": {
    body:"Phonics में letter और sound के संबंध को सुनकर पहचानना, बोलना और शब्द में प्रयोग करना सिखाया जाता है। शुरुआती CVC जैसे cat, sun, map शब्दों से blending की शुरुआत होती है।",
    objectives:["common letter sounds पहचानना।","अलग sounds को जोड़कर सरल शब्द पढ़ना।","शब्द के beginning sound पहचानना।"],
    deep:"Reading में sound blending बहुत महत्वपूर्ण है: /c/ /a/ /t/ को जोड़कर 'cat' बनाना decoding का practical आधार है।",
    examples:["m-a-t → mat; s-u-n → sun.","'ball' में शुरुआती /b/ sound पहचानें."],
    practice:["5 sound cards बोलें.","CVC words blend करें.","सुने sound से सही letter चुनें."],
    activity:"तीन अक्षरों के cards से शब्द बनाकर हर sound अलग और फिर पूरा शब्द बोलें।",
    mistakes:["letter name बोलना जहाँ sound चाहिए।","sounds को जोड़ते समय बीच में अनावश्यक vowel जोड़ना।"],
    summary:"Sound सुनो → letter पहचानो → blend करो → word पढ़ो।"
  },
  "Everyday Vocabulary / दैनिक शब्दावली": {
    body:"बच्चों के आसपास के परिवार, घर, स्कूल, शरीर, रंग, भोजन, वस्तुएँ, actions और common places के शब्द सिखाए जाते हैं। शब्द picture, pronunciation और sentence में प्रयोग से मजबूत होते हैं।",
    objectives:["दैनिक जीवन के common English words समझना।","वस्तु/चित्र देखकर सही शब्द बोलना।","नए शब्द को छोटे वाक्य में प्रयोग करना।"],
    deep:"Vocabulary केवल सूची याद करना नहीं है; बच्चे को word का meaning, pronunciation, context और usage समझना चाहिए।",
    examples:["book, pen, water, mother, school, red.","This is a book. / यह एक किताब है।"],
    practice:["10 picture-word matches करें.","5 नए words से sentences बोलें.","पुराने words की spaced revision करें."],
    activity:"एक 'My Day' picture chart बनाकर 8 English words label करें।",
    mistakes:["Hindi meaning याद करके English word का use न करना।","pronunciation सुने बिना spelling अनुमान लगाना।"],
    summary:"देखो → नाम सीखो → बोलो → sentence में लगाओ → दोहराओ।"
  },
  "Simple Sentences / सरल वाक्य": {
    body:"बच्चे subject, action और object की basic idea से सरल English sentences बनाना सीखते हैं। am/is/are और common verbs को daily situations से जोड़ा जाता है।",
    objectives:["सरल sentence की basic structure समझना।","I am, This is, I have जैसे patterns का सही प्रयोग करना।","affirmative और simple question बोलना।"],
    deep:"Sentence formation में शब्दों का सही क्रम अर्थ बदल सकता है। इसलिए pattern को समझकर अलग examples बनाना memorisation से बेहतर है।",
    examples:["I am a student. / मैं विद्यार्थी हूँ।","This is my book. / यह मेरी किताब है।"],
    practice:["5 picture sentences बनाएं.","I am / This is / I have के 3-3 sentences बोलें.","एक statement को simple question में बदलें."],
    activity:"कक्षा की 5 वस्तुओं पर English sentences बोलकर partner से check कराएँ।",
    mistakes:["Subject और verb का mismatch।","हर sentence को Hindi word-order से बनाना।"],
    summary:"Subject चुनो → verb/pattern लगाओ → meaning check करो → बोलो/लिखो।"
  },
  "Reading Fluency / प्रवाहपूर्ण पठन": {
    body:"बच्चे परिचित शब्दों और छोटे passages को accuracy, appropriate pace और expression के साथ पढ़ते हैं। बार-बार guided reading और meaningful text fluency बढ़ाते हैं।",
    objectives:["शब्दों को अधिक automatic रूप से पढ़ना।","विराम चिन्ह के अनुसार रुकना।","छोटे passage को समझते हुए पढ़ना।"],
    deep:"Fluency का अर्थ तेज पढ़ना मात्र नहीं; accuracy, उचित गति और expression के साथ अर्थ समझना जरूरी है।",
    examples:["Full stop पर pause, question mark पर questioning tone.","एक ही छोटा passage पहले teacher के साथ, फिर independently पढ़ें."],
    practice:["1-minute reading करें और गलत शब्द note करें.","अगली बार उसी passage को बेहतर accuracy से पढ़ें.","3 punctuation-based pauses mark करें."],
    activity:"Pair reading: एक बच्चा पढ़े, दूसरा केवल supportive feedback दे।",
    mistakes:["बहुत तेज पढ़ना और अर्थ खो देना।","हर शब्द पर रुकना जबकि वह परिचित हो।"],
    summary:"सही पढ़ो → अर्थ समझो → expression रखो → repeated practice करो।"
  },
  "Comprehension / पठन-बोध": {
    body:"पठन-बोध में बच्चा passage का मुख्य विचार, पात्र, क्रम, कारण-परिणाम और सीधे/अनुमान आधारित उत्तर समझना सीखता है।",
    objectives:["कौन, क्या, कब, कहाँ जैसे प्रश्नों का उत्तर देना।","मुख्य विचार पहचानना।","text से evidence लेकर उत्तर देना।"],
    deep:"Comprehension में पाठ को दोहराना पर्याप्त नहीं; बच्चा text से जानकारी निकालकर उसे अपने शब्दों में समझा सके।",
    examples:["कहानी पढ़ें → मुख्य पात्र बताएं → घटना का कारण बताएं.","'क्यों?' प्रश्न का उत्तर text के आधार पर दें."],
    practice:["एक छोटा passage और 5 questions करें.","एक sentence में main idea लिखें.","एक उत्तर के लिए text में evidence underline करें."],
    activity:"कहानी का 4-box sequence बनाएं: शुरुआत → घटना → समाधान → सीख।",
    mistakes:["अपनी कल्पना को text का answer मान लेना।","केवल एक शब्द देखकर पूरा उत्तर बना देना।"],
    summary:"पढ़ो → प्रश्न समझो → text में evidence खोजो → अपने शब्दों में उत्तर दो।"
  },
  "Sentence Writing / वाक्य लेखन": {
    body:"बच्चे capital letter, word spacing, punctuation और meaningful sentence formation का अभ्यास करते हैं। बोलकर sentence बनाना और फिर उसे लिखना writing development को आसान बनाता है।",
    objectives:["एक स्पष्ट, अर्थपूर्ण sentence लिखना।","capital letter और full stop का सही उपयोग करना।","शब्दों के बीच उचित spacing रखना।"],
    deep:"Writing में विचार पहले स्पष्ट होना चाहिए; फिर grammar, spelling और punctuation की जाँच की जाती है।",
    examples:["I play outside. / मैं बाहर खेलता हूँ।","चित्र: boy + ball → The boy has a ball."],
    practice:["5 picture sentences लिखें.","गलत punctuation वाले 3 sentences सुधारें.","अपना sentence पढ़कर self-check करें."],
    activity:"'See → Think → Write' worksheet: picture देखें, 3 words लिखें, 2 sentences बनाएं।",
    mistakes:["हर शब्द जोड़कर एक लंबी string लिखना।","sentence शुरू करते समय capital letter भूलना।"],
    summary:"विचार → शब्द → sentence → punctuation → पढ़कर जाँच।"
  },
  "Paragraph & Picture Writing / अनुच्छेद एवं चित्र लेखन": {
    body:"बच्चे चित्र या अनुभव से ideas collect करके क्रमबद्ध 4–8 वाक्यों का छोटा paragraph लिखना सीखते हैं। beginning, middle और ending का सरल ढाँचा दिया जाता है।",
    objectives:["चित्र से relevant details चुनना।","वाक्यों को logical order में रखना।","छोटा paragraph लिखकर revise करना।"],
    deep:"अच्छा paragraph अलग-अलग sentences का ढेर नहीं; एक मुख्य idea से जुड़े वाक्यों का क्रम होता है।",
    examples:["Park picture → place, people, actions, ending sentence.","My School पर 5 connected sentences लिखें."],
    practice:["चित्र से 8 keywords निकालें.","उनमें से 5 से paragraph बनाएं.","spelling और punctuation check करें."],
    activity:"एक picture story को 3 parts में बाँटकर mini paragraph तैयार करें।",
    mistakes:["चित्र में न दिखने वाली बातें तथ्य की तरह लिखना।","sentences के बीच connection न रखना।"],
    summary:"देखो → keywords चुनो → क्रम बनाओ → paragraph लिखो → revise करो।"
  },
  "Number Sense / संख्या-बोध": {
    body:"Number sense में place value, number comparison, ordering, skip counting, odd-even की शुरुआती समझ और numbers को अलग तरीकों से represent करना शामिल है।",
    objectives:["संख्या को quantity से जोड़ना।","छोटी-बड़ी संख्या compare और order करना।","10s/1s जैसी place-value idea समझना।"],
    deep:"Number sense में संख्या का आकार और संबंध समझना मुख्य है; केवल counting sequence याद करना पर्याप्त नहीं।",
    examples:["34 = 3 tens + 4 ones.","27 और 72 में कौन बड़ा है? Place value से समझाएँ."],
    practice:["0–100 numbers order करें.","10s में count करें.","bundles of ten से 2-digit numbers बनाएं."],
    activity:"sticks/buttons से tens और ones के bundles बनाकर 5 numbers represent करें।",
    mistakes:["digits की जगह देखकर हमेशा संख्या बड़ी मान लेना।","place value को केवल नाम से याद करना।"],
    summary:"Quantity → tens/ones → compare → order → explain।"
  },
  "Addition & Subtraction / जोड़ एवं घटाव": {
    body:"जोड़ और घटाव को concrete objects, number line, drawings और equations से सिखाया जाता है। बच्चे 'कुल कितना?' और 'कितना बचा/कम हुआ?' जैसी वास्तविक स्थितियों से operations समझते हैं।",
    objectives:["addition और subtraction का अर्थ समझना।","basic facts और written method का अभ्यास करना।","word problem में सही operation चुनना।"],
    deep:"Operation चुनने से पहले स्थिति समझना जरूरी है। Addition हमेशा 'बड़ा number' नहीं और subtraction केवल 'minus sign' नहीं; context निर्णय कराता है।",
    examples:["3 apples + 2 apples = 5.","8 pencils में से 3 देने पर 5 बचते हैं."],
    practice:["objects से 5 sums करें.","number line पर jumps दिखाएँ.","5 word problems में operation चुनें."],
    activity:"कक्षा में वस्तुओं का छोटा shop game बनाकर खरीद/बची वस्तुओं के sums करें।",
    mistakes:["place value align न करना।","word problem पढ़े बिना plus/minus चुनना।"],
    summary:"स्थिति समझो → वस्तु/चित्र से model बनाओ → equation → answer check।"
  },
  "Multiplication & Division / गुणा एवं भाग": {
    body:"गुणा को equal groups और repeated addition से तथा भाग को sharing और grouping से समझाया जाता है। Tables को meaning के साथ सिखाया जाता है, केवल रटने के रूप में नहीं।",
    objectives:["equal groups बनाकर multiplication समझना।","सरल division में equal sharing करना।","basic multiplication facts का उपयोग करना।"],
    deep:"3 × 4 का अर्थ 3 groups of 4 या 4+4+4 जैसे representations से समझा जा सकता है। Division में remainder की शुरुआती समझ भी practical sharing से आती है।",
    examples:["3 plates में 4-4 biscuits → 12 biscuits.","12 biscuits को 3 बच्चों में बराबर बाँटें → 4 each."],
    practice:["arrays बनाएं.","tables को repeated addition से verify करें.","sharing problems हल करें."],
    activity:"buttons/blocks से 2, 3, 4 equal groups बनाकर multiplication और division दोनों लिखें।",
    mistakes:["multiplication को केवल table chant मानना।","division में groups बराबर न बनाना।"],
    summary:"Groups बनाओ → repeated addition/share करो → equation लिखो → check करो।"
  },
  "Fractions, Patterns & Problems / भिन्न, पैटर्न एवं समस्याएँ": {
    body:"बच्चे whole को equal parts में बाँटकर half, third, quarter जैसी fractions समझते हैं और repeating/growing patterns पहचानते हैं। Multi-step word problems में जानकारी छाँटना सिखाया जाता है।",
    objectives:["whole और equal parts का संबंध समझना।","सरल fractions identify करना।","pattern rule पहचानना और आगे बढ़ाना।"],
    deep:"Fraction तभी meaningful है जब parts equal हों। Pattern में अगला item guess नहीं, rule देखकर तय किया जाता है।",
    examples:["एक रोटी को 4 equal parts → each part is one-fourth.","2,4,6,8 → rule +2."],
    practice:["paper shapes fold करके halves/quarters बनाएं.","3 patterns complete करें.","एक word problem में given/required लिखें."],
    activity:"कागज की circle को equal parts में बाँटकर fraction label करें।",
    mistakes:["unequal parts को fraction समझना।","pattern में केवल last two terms देखकर rule मान लेना।"],
    summary:"Whole समझो → equal parts → fraction; pattern देखो → rule खोजो → आगे बढ़ाओ।"
  },
  "Length & Distance / लंबाई एवं दूरी": {
    body:"बच्चे लंबाई और दूरी को तुलना, standard/non-standard units और सरल measurement tools से समझते हैं। वस्तुओं को estimate करके फिर measure करने से measurement sense विकसित होता है।",
    objectives:["longer/shorter पहचानना।","ruler का शुरुआती सही उपयोग करना।","cm/m जैसी units का basic context समझना।"],
    deep:"Measurement में unit बार-बार समान size की होनी चाहिए और ruler में zero point से शुरुआत समझना जरूरी है।",
    examples:["pencil की अनुमानित length → ruler से measure.","classroom में door और desk की length compare करें."],
    practice:["5 objects measure करें.","estimate और actual value compare करें.","cm और m के appropriate examples चुनें."],
    activity:"'Estimate vs Measure' chart बनाकर 5 classroom objects record करें।",
    mistakes:["ruler को object के edge से हटाकर शुरू करना।","unit लिखना भूलना।"],
    summary:"Estimate → सही unit/tool → measure → unit सहित record → compare।"
  },
  "Weight & Capacity / भार एवं क्षमता": {
    body:"बच्चे हल्का-भारी, अधिक-कम capacity और containers की तुलना practical objects से सीखते हैं। आगे gram/kilogram और litre/millilitre का परिचय रोजमर्रा की वस्तुओं से कराया जाता है।",
    objectives:["heavy/light और more/less capacity पहचानना।","basic units को context से जोड़ना।","simple comparison record करना।"],
    deep:"Weight और capacity अलग concepts हैं: कोई वस्तु बड़ी दिख सकती है पर हल्की हो सकती है; container का size capacity से जुड़ा है।",
    examples:["पानी की bottle और bucket की capacity compare करें.","school bag और pencil box का weight compare करें."],
    practice:["5 वस्तुओं को heavy→light order करें.","2 containers में अधिक पानी वाला पहचानें.","g/kg और L/mL के examples match करें."],
    activity:"घर की 5 वस्तुओं का अनुमान और उपलब्ध scale/container से comparison करें।",
    mistakes:["size को weight मान लेना।","capacity और weight को एक ही चीज समझना।"],
    summary:"तुलना → अनुमान → सही unit/tool → measure → record।"
  },
  "Time & Calendar / समय एवं कैलेंडर": {
    body:"बच्चे दिन, सप्ताह, महीने, तारीख, घड़ी के घंटे/मिनट और daily routine को समय से जोड़ते हैं। पहले familiar events से शुरू करके clock reading तक बढ़ाया जाता है।",
    objectives:["दिन/महीने का क्रम बताना।","घड़ी में hour और minute hand पहचानना।","simple elapsed time और routine समझना।"],
    deep:"Time को केवल clock देखकर नहीं; घटनाओं के क्रम, duration और before/after संबंध से भी समझना चाहिए।",
    examples:["School starts 8:00, lunch 12:30.","आज Monday है तो 3 days बाद कौन सा day होगा?"],
    practice:["calendar में dates खोजें.","घड़ी पर full/half hour पढ़ें.","अपनी दिनचर्या का time chart बनाएं."],
    activity:"'My Day' timetable बनाकर कम से कम 6 activities और उनके times लिखें।",
    mistakes:["hour और minute hand को उल्टा पढ़ना।","12-hour clock में AM/PM का context न देखना।"],
    summary:"क्रम → duration → clock → calendar → daily planning।"
  },
  "Money & Simple Budget / पैसा एवं सरल बजट": {
    body:"बच्चे coins/notes की पहचान, price comparison, जोड़-घटाव और जरूरत/इच्छा के सरल अंतर से money literacy शुरू करते हैं। बजट को छोटी वास्तविक राशि के उदाहरण से समझाया जाता है।",
    objectives:["basic denominations पहचानना।","simple purchase का total और change निकालना।","जरूरी खर्च और saving का basic idea समझना।"],
    deep:"Money learning में गणित के साथ decision-making आता है: उपलब्ध राशि, कीमत और प्राथमिकता तीनों देखना जरूरी है।",
    examples:["₹20 + ₹10 = ₹30.","₹50 में ₹32 की वस्तु लेने पर ₹18 बचते हैं."],
    practice:["shop cards से 5 purchases करें.","total और change निकालें.","₹100 का simple needs/saving budget बनाएं."],
    activity:"classroom pretend shop में buyer-seller role play करें और receipt लिखें।",
    mistakes:["price जोड़ते समय denomination भूलना।","change बिना calculation के अनुमान से बताना।"],
    summary:"राशि पहचानो → कीमत देखो → total/change निकालो → जरूरत/बचत सोचो।"
  },
  "Myself, Family & School / मैं, परिवार एवं विद्यालय": {
    body:"EVS में बच्चा अपने शरीर, परिवार, घर और विद्यालय को पहचानता है तथा roles, routines, relationships और सुरक्षित व्यवहार समझता है।",
    objectives:["अपने बारे में basic जानकारी बताना।","परिवार और school roles पहचानना।","school rules और safe behaviour समझना।"],
    deep:"EVS का उद्देश्य आसपास की दुनिया को observe करके language, social understanding और responsible behaviour विकसित करना है।",
    examples:["My name, age, favourite activity.","Teacher, helper, parent और student की responsibilities पर चर्चा."],
    practice:["My Family tree/chart बनाएं.","school के 5 safe rules लिखें.","अपने daily routine का sequence बताएं."],
    activity:"कक्षा का 'People who help us' poster बनाएं।",
    mistakes:["हर परिवार एक जैसा मानना।","role और person को stereotype से जोड़ना।"],
    summary:"मैं → मेरा परिवार → मेरा विद्यालय → roles → सुरक्षित जिम्मेदारी।"
  },
  "Plants & Animals / पौधे एवं पशु": {
    body:"बच्चे पौधों और पशुओं की basic needs, parts, habitats और उपयोगी/सुरक्षित interaction समझते हैं। observation से classification और care की आदत विकसित की जाती है।",
    objectives:["पौधे के मुख्य parts पहचानना।","पशु और उनके habitats के उदाहरण देना।","जीवों की basic needs बताना।"],
    deep:"Plants और animals जीवित systems हैं; food, water, air और suitable habitat उनकी survival needs से जुड़े हैं।",
    examples:["root, stem, leaf, flower.","fish → water habitat; bird → nest/tree environment."],
    practice:["एक पौधे का weekly observation record रखें.","5 animals को habitat से match करें.","plant care checklist बनाएं."],
    activity:"school/घर के पौधे की height/leaf changes का picture log बनाएं।",
    mistakes:["हर पौधे को रोज समान मात्रा में पानी चाहिए मानना।","wild animals को pets की तरह handle करना।"],
    summary:"पहचान → parts/needs → habitat → observation → responsible care।"
  },
  "Water, Air & Weather / जल, वायु एवं मौसम": {
    body:"बच्चे पानी और हवा की रोजमर्रा की भूमिका, मौसम के basic बदलाव और water conservation की जरूरत समझते हैं। observation और simple records से science thinking विकसित होती है।",
    objectives:["जल और वायु के मुख्य उपयोग बताना।","weather observations record करना।","पानी बचाने के practical तरीके पहचानना।"],
    deep:"Weather रोज बदल सकता है; climate अलग अवधारणा है। प्राथमिक स्तर पर बच्चे visible observations—cloud, wind, rain, heat—से शुरुआत करते हैं।",
    examples:["आज cloudy/sunny/windy record करें.","tap बंद रखना, leaking tap report करना."],
    practice:["7-day weather chart बनाएं.","घर में water-use के 5 points खोजें.","air/water uses की सूची बनाएं."],
    activity:"'Save Water' classroom audit करके 3 measurable improvements सुझाएँ।",
    mistakes:["weather और climate को एक ही मानना।","water conservation को केवल slogan रखना, action न करना।"],
    summary:"Observe → record → understand use → conserve → review।"
  },
  "Simple Experiments / सरल प्रयोग": {
    body:"प्राथमिक science में सुरक्षित, कम-जोखिम वाले experiments से prediction, observation, comparison और conclusion सिखाया जाता है। बच्चों को 'क्या होगा?' पूछने और evidence देखने की आदत दी जाती है।",
    objectives:["simple prediction करना।","एक experiment को step-by-step करना।","observation और conclusion अलग लिखना।"],
    deep:"Experiment में परिणाम पहले से तय नहीं माना जाता; observation evidence देता है और conclusion उसी evidence पर आधारित होना चाहिए।",
    examples:["कौन-सी वस्तु पानी में तैरेगी? prediction → test → record.","sunlight में रखे और छाया में रखे objects का temperature observation."],
    practice:["prediction लिखें.","materials और steps list करें.","result को table/चित्र में record करें."],
    activity:"Teacher-guided sink/float activity करें और हर बच्चे से evidence-based conclusion लिखवाएँ।",
    mistakes:["prediction को result समझ लेना।","unsafe chemicals/fire जैसी गतिविधियाँ बिना trained adult के करना।"],
    summary:"Question → prediction → safe test → observation → conclusion।"
  },
  "Hygiene & Nutrition / स्वच्छता एवं पोषण": {
    body:"बच्चे हाथ धोने, साफ पानी, दाँतों की देखभाल, साफ भोजन और balanced food choices की basic समझ सीखते हैं। संदेश डर पर नहीं, healthy daily habits पर आधारित होना चाहिए।",
    objectives:["महत्वपूर्ण hygiene habits पहचानना।","food groups और विविध भोजन का basic idea समझना।","safe water और food handling की आदत बनाना।"],
    deep:"Nutrition में केवल पेट भरना नहीं; growth और health के लिए विविध nutrients जरूरी हैं। Hygiene infection risk घटाने में मदद करती है।",
    examples:["खाने से पहले और toilet के बाद हाथ धोना.","थाली में अनाज + दाल/अन्य protein + सब्जी/फल जैसे विविध food शामिल करना."],
    practice:["handwashing steps क्रम में लगाएं.","एक दिन का food diary बनाएं.","safe/unsafe food practices पहचानें."],
    activity:"कक्षा में healthy plate poster बनाएं और local foods के examples जोड़ें।",
    mistakes:["एक food को हर समस्या का इलाज मानना।","हाथ धोने में बहुत कम समय देना।"],
    summary:"साफ हाथ → सुरक्षित भोजन/जल → विविध पोषण → नियमित healthy habits।"
  },
  "Dental & Physical Health / दंत एवं शारीरिक स्वास्थ्य": {
    body:"बच्चे दाँत साफ करने, oral hygiene, शरीर की देखभाल, physical activity, rest और चोट से बचाव की उम्रानुकूल जानकारी सीखते हैं।",
    objectives:["दिन में oral care routine समझना।","physical activity और rest का महत्व बताना।","basic warning signs पर trusted adult को बताना।"],
    deep:"Health education का उद्देश्य self-care habits और help-seeking behaviour बनाना है, diagnosis करना नहीं।",
    examples:["सुबह-रात brushing routine.","दर्द/चोट होने पर छिपाने के बजाय parent/teacher को बताना."],
    practice:["daily self-care checklist बनाएं.","safe physical activities की सूची बनाएं.","oral hygiene steps क्रम में लगाएं."],
    activity:"एक सप्ताह का healthy routine chart बनाकर पूरा होने पर tick करें।",
    mistakes:["दर्द को लगातार ignore करना।","खेल और physical activity को बिना safety rules के करना।"],
    summary:"Daily care → movement → rest → safe reporting → qualified help।"
  },
  "Road & Home Safety / सड़क एवं घर सुरक्षा": {
    body:"बच्चों को road crossing, traffic signals, seat belt/helmet awareness और घर में बिजली, आग, sharp objects, medicines तथा strangers से जुड़ी basic safety सिखाई जाती है।",
    objectives:["safe road crossing steps बताना।","घर के common hazards पहचानना।","emergency में trusted adult को सूचना देना।"],
    deep:"Safety में खतरा पहचानना, जोखिम कम करना और सही व्यक्ति से मदद लेना मुख्य है; बच्चे को high-risk rescue करने के लिए नहीं कहा जाता।",
    examples:["Stop → Look → Listen → cross with adult when needed.","अज्ञात medicine को बिना adult के न छूना."],
    practice:["home safety picture में 10 hazards खोजें.","traffic signs match करें.","trusted contacts की list बनाएं."],
    activity:"classroom road-safety role play करें जिसमें pedestrian और traffic signals हों।",
    mistakes:["चलते समय phone/attention distract करना।","घर में medicine/chemical को curiosity से खोलना।"],
    summary:"खतरा पहचानो → रुककर सोचो → सुरक्षित नियम अपनाओ → adult help लो।"
  },
  "Personal & Emergency Safety / व्यक्तिगत एवं आपात सुरक्षा": {
    body:"बच्चे body boundaries, trusted adults, emergency contacts, safe/unsafe situations और help-seeking behaviour की age-appropriate understanding सीखते हैं।",
    objectives:["अपने trusted adults पहचानना।","unsafe situation में 'No/Stop' और help-seeking का basic response जानना।","emergency में सही जानकारी देना।"],
    deep:"Personal safety का उद्देश्य डर पैदा करना नहीं, बच्चे को अपनी boundaries समझने और मदद माँगने का confidence देना है।",
    examples:["Lost होने पर uniformed/identified helper या trusted adult से सहायता लेना.","असहज touch/situation को trusted adult को बताना."],
    practice:["3 trusted adults लिखें.","emergency contact practice करें.","safe/unsafe scenario cards discuss करें."],
    activity:"Teacher-guided safety circle बनाएं—किससे मदद माँगनी है और कैसे बताना है।",
    mistakes:["बच्चे को हर स्थिति में अकेले solve करने को कहना।","बच्चे की disclosure को blame करना।"],
    summary:"Boundary → safe choice → trusted adult → clear help request।"
  },
  "Empathy & Kindness / सहानुभूति एवं दया": {
    body:"बच्चे दूसरे व्यक्ति की feelings पहचानना, मदद करना, बिना मज़ाक उड़ाए सुनना और जरूरत के समय kindness दिखाना सीखते हैं।",
    objectives:["basic emotions पहचानना।","दूसरे की स्थिति समझकर respectful response देना।","छोटे helpful actions करना।"],
    deep:"Empathy का अर्थ दूसरे की भावना को समझने की कोशिश करना है, जरूरी नहीं कि हम उसी तरह महसूस करें।",
    examples:["किसी मित्र के गिरने पर हँसने के बजाय मदद करना.","'तुम ठीक हो?' पूछना."],
    practice:["emotion cards match करें.","3 kind actions plan करें.","role-play में supportive response दें."],
    activity:"एक सप्ताह 'Kindness Log' रखें और हर दिन एक वास्तविक helpful action लिखें।",
    mistakes:["मदद करते समय सामने वाले को शर्मिंदा करना।","हर व्यक्ति की जरूरत का अनुमान बिना पूछे लगा लेना।"],
    summary:"देखो → समझो → सम्मान से सुनो → मदद करो → dignity बनाए रखो।"
  },
  "Cooperation & Respect / सहयोग एवं सम्मान": {
    body:"बच्चे sharing, turn-taking, listening, group rules और अलग-अलग लोगों का सम्मान करना सीखते हैं। समूह गतिविधियों में जिम्मेदारियाँ बाँटकर cooperation को practical बनाया जाता है।",
    objectives:["अपनी turn का इंतजार करना।","दूसरे की बात सुनना और सम्मानपूर्वक disagree करना।","group task में assigned responsibility निभाना।"],
    deep:"Cooperation का मतलब हर बात में सहमत होना नहीं; common goal के लिए respectful communication और fair participation जरूरी है।",
    examples:["चार बच्चों को poster के अलग-अलग roles देना.","'मैं अलग सोचता/सोचती हूँ क्योंकि…' कहना."],
    practice:["team puzzle करें.","एक group rule list बनाएं.","partner की बात बिना interrupt किए सुनें."],
    activity:"चार सदस्य मिलकर classroom improvement poster बनाएं और roles rotate करें।",
    mistakes:["एक बच्चा पूरा काम कर लेना।","असहमति को personal insult बनाना।"],
    summary:"सुनो → turn दो → role निभाओ → सम्मान रखो → साझा लक्ष्य पूरा करो।"
  },
  "Communication & Asking Questions / संवाद एवं प्रश्न": {
    body:"बच्चों को स्पष्ट बोलना, ध्यान से सुनना, मदद माँगना और 'क्या, क्यों, कैसे?' जैसे प्रश्न पूछना सिखाया जाता है। Curiosity को learning का हिस्सा माना जाता है।",
    objectives:["अपनी जरूरत स्पष्ट शब्दों में बताना।","उत्तर सुनकर relevant follow-up question पूछना।","अनिश्चित होने पर help माँगना।"],
    deep:"अच्छा communication दोतरफा है: बोलना जितना जरूरी है, उतना ही सुनना और समझना भी।",
    examples:["'मुझे यह step समझ नहीं आया, क्या आप फिर समझा सकते हैं?'","'यह क्यों होता है?' पूछना."],
    practice:["5 question words का उपयोग करें.","partner की बात दोहराकर confirm करें.","एक classroom problem पर 3 questions बनाएं."],
    activity:"Question Wall बनाएं जहाँ बच्चे रोज एक genuine learning question लगाएँ।",
    mistakes:["उत्तर न सुनकर अगला प्रश्न पूछना।","'मुझे नहीं पता' कहने में शर्म करना।"],
    summary:"साफ बोलो → ध्यान से सुनो → clarification पूछो → सीखो।"
  },
  "Problem Solving & Decision Making / समस्या समाधान एवं निर्णय": {
    body:"बच्चे समस्या को पहचानना, जानकारी जुटाना, दो-तीन विकल्प सोचना, सुरक्षित विकल्प चुनना और परिणाम की समीक्षा करना सीखते हैं।",
    objectives:["समस्या को स्पष्ट शब्दों में बताना।","एक से अधिक possible solutions सोचना।","सुरक्षित और उचित विकल्प चुनने का कारण बताना।"],
    deep:"Decision-making में impulse के बजाय situation, safety, available information और consequences देखना जरूरी है।",
    examples:["दो बच्चों के बीच एक toy: turn-taking, timer या shared play options.","किताब खो जाए तो खोजने के steps बनाएं."],
    practice:["एक daily problem के 3 solutions लिखें.","हर option के benefit/risk पर बात करें.","चुने solution का result review करें."],
    activity:"'Problem → Options → Choice → Result' worksheet पूरा करें।",
    mistakes:["पहला idea ही final मान लेना।","unsafe solution को केवल आसान होने के कारण चुनना।"],
    summary:"समस्या समझो → विकल्प बनाओ → सुरक्षित विकल्प चुनो → परिणाम देखो।"
  },
  "Drawing, Music & Craft / कला, संगीत एवं शिल्प": {
    body:"रचनात्मक learning में drawing, colouring, rhythm, singing, paper craft और local art forms के माध्यम से expression, fine-motor skills और imagination विकसित की जाती है।",
    objectives:["विभिन्न materials का सुरक्षित उपयोग करना।","pattern, colour और rhythm से creative work बनाना।","अपने work के बारे में 2–3 बातें बताना।"],
    deep:"Creative work का लक्ष्य केवल सुंदर final product नहीं; planning, experimentation, expression और reflection भी learning हैं।",
    examples:["shape collage, simple rhythm clapping, paper folding.","एक ही object के दो अलग creative designs बनाना."],
    practice:["एक drawing को तीन shapes से बनाएं.","4-beat rhythm repeat करें.","reusable paper से craft बनाएं."],
    activity:"'My Local Culture' theme पर drawing/craft तैयार करें और छोटा oral presentation दें।",
    mistakes:["हर बच्चे से एक जैसा output अपेक्षित करना।","sharp tools बिना supervision के देना।"],
    summary:"Idea → material → create → explain → improve।"
  },
  "Stories, Poems & Role Play / कहानी, कविता एवं अभिनय": {
    body:"कहानी, कविता और role play से language, imagination, sequencing, listening और social-emotional learning विकसित होती है। बच्चे characters और events को अपने शब्दों में व्यक्त करते हैं।",
    objectives:["कहानी का beginning-middle-end पहचानना।","poem में rhythm/repetition का आनंद लेना।","role play में dialogue और respectful turn-taking करना।"],
    deep:"Story learning में prediction, vocabulary, moral/values और comprehension को जोड़ना चाहिए; केवल कहानी सुनाकर समाप्त करना पर्याप्त नहीं।",
    examples:["कहानी रोककर पूछें—अब आगे क्या होगा?","दो characters का short dialogue enact करें."],
    practice:["एक कहानी का 4-step sequence बनाएं.","3 नए words से sentences बनाएं.","role play में 4 lines बोलें."],
    activity:"बच्चे समूह में एक छोटी local story enact करें और अंत में 'मैंने क्या सीखा?' बताएं।",
    mistakes:["हर story का केवल एक 'correct' interpretation मानना।","role play में किसी बच्चे को शर्मिंदा करना।"],
    summary:"सुनो → सोचो → sequence करो → enact करो → सीख बताओ।"
  },
  "Devices & Basic Digital Skills / उपकरण एवं डिजिटल कौशल": {
    body:"प्राथमिक digital learning में device की पहचान, safe handling, mouse/touch, keyboard की basic keys, opening/closing an app और digital responsibility सिखाई जाती है।",
    objectives:["computer/tablet के basic parts पहचानना।","device को साफ और सुरक्षित तरीके से उपयोग करना।","keyboard/mouse या touch का basic control करना।"],
    deep:"Digital skill में technical action के साथ safety, privacy और responsible use भी शुरू से शामिल होना चाहिए।",
    examples:["monitor, keyboard, mouse पहचानें.","spacebar, enter और backspace का उपयोग करें."],
    practice:["guided typing में अपना नाम लिखें.","एक app खोलकर properly close करें.","device handling rules repeat करें."],
    activity:"'Digital Lab Rules' poster बनाएं: clean hands, careful handling, no unknown clicks, ask before changing settings.",
    mistakes:["screen/device पर जोर से दबाना।","unknown links/apps पर बिना adult guidance click करना।"],
    summary:"पहचानो → सुरक्षित पकड़ो → basic controls → responsible use।"
  },
  "Projects, Revision & Assessment / प्रोजेक्ट, पुनरावृत्ति एवं आकलन": {
    body:"सीखी हुई भाषा, गणित, EVS, life skills और creativity को छोटे projects में जोड़कर revise किया जाता है। Assessment में केवल marks नहीं, understanding, application और improvement भी देखी जाती है।",
    objectives:["सीखे concepts को एक practical task में जोड़ना।","अपनी गलतियाँ पहचानकर सुधारना।","assessment के बाद next learning goal तय करना।"],
    deep:"अच्छा assessment learner को label करने के लिए नहीं; यह बताने के लिए है कि क्या समझ आया, कहाँ support चाहिए और आगे क्या सीखना है।",
    examples:["'My Healthy Day' poster में writing + time + health habits जोड़ें.","10-question self-check के बाद error log बनाएं."],
    practice:["हर module की 3 key बातें बिना notes लिखें.","एक mini project पूरा करें.","गलत answers की वजह लिखें."],
    activity:"Final primary portfolio: reading sample + maths work + EVS observation + creative work + reflection.",
    mistakes:["केवल score देखकर learning मान लेना।","गलती छिपाना, error से सीखना नहीं।"],
    summary:"Revise → apply → assess → error समझो → improve → next goal।"
  }
};

const PRIMARY_TEACHING_MODE = {
  "Foundation / आधार": {
    steps:["👀 वस्तु/चित्र दिखाएँ और नाम पूछें।","🔊 शिक्षक सही शब्द/ध्वनि बोले; बच्चा सुने।","👄 बच्चा अकेले और समूह में दोहराए।","👉 सही अक्षर/संख्या/वस्तु चुनवाएँ।","✍️ tracing के बाद बिना guide लिखवाएँ।","🎯 रोजमर्रा की वस्तुओं से पुनरावृत्ति कराएँ।"],
    checks:["बच्चे को बिना संकेत के पहचानना और बोलना चाहिए।","देखी/सुनी चीज को सही चिन्ह से मिलाना चाहिए।"]
  },
  "Hindi Language / हिंदी भाषा": {
    steps:["👀 अक्षर/मात्रा बड़ा करके दिखाएँ।","🔊 उसकी ध्वनि स्पष्ट रूप से सुनाएँ।","👄 बच्चा ध्वनि और शब्द दोहराए।","🧩 अक्षर/मात्रा को शब्द में खोजवाएँ।","📖 शब्द/वाक्य पढ़वाएँ।","✍️ देखकर और फिर memory से लिखवाएँ।"],
    checks:["अक्षर/मात्रा को सुनकर पहचान सके।","शब्द पढ़कर उसका अर्थ या चित्र बता सके।"]
  },
  "English Foundation / अंग्रेज़ी आधार": {
    steps:["👀 uppercase/lowercase और picture दिखाएँ।","🔊 letter name और sound सुनाएँ।","👄 बच्चा sound/word दोहराए।","🧩 beginning sound से picture match कराएँ।","📖 sounds blend करके छोटा word पढ़ाएँ।","✍️ letter/word लिखवाकर बोलने को कहें।"],
    checks:["letter को देखकर नाम/sound बता सके।","simple word को sound-by-sound blend कर सके।"]
  },
  "Reading & Writing / पठन एवं लेखन": {
    steps:["👀 title/picture देखकर prediction कराएँ।","🔊 passage/word का model reading सुनाएँ।","👄 बच्चा phrase-by-phrase पढ़े।","❓ कौन, क्या, कहाँ, क्यों जैसे प्रश्न पूछें।","✍️ उत्तर/वाक्य अपने शब्दों में लिखवाएँ।","🔎 spelling, punctuation और meaning check कराएँ।"],
    checks:["पढ़े हुए का मुख्य अर्थ बता सके।","उत्तर text/evidence से जोड़ सके।"]
  },
  "Mathematics / गणित": {
    steps:["🧮 वास्तविक वस्तुओं से concept दिखाएँ।","👀 picture/number line/shape model दिखाएँ।","🗣️ mathematical language में बोलवाएँ।","✋ teacher के साथ guided example कराएँ।","✍️ similar और फिर new problems करवाएँ।","🔎 answer के साथ method भी जाँचें।"],
    checks:["उत्तर के साथ तरीका समझा सके।","नए उदाहरण में वही concept लागू कर सके।"]
  },
  "Measurement & Money / मापन एवं धन": {
    steps:["📏 वास्तविक scale/container/clock/coins दिखाएँ।","👀 unit और quantity का संबंध समझाएँ।","🗣️ तुलना करवाएँ—लंबा/छोटा, भारी/हल्का, पहले/बाद।","✋ वास्तविक वस्तुओं से measurement/counting करवाएँ।","🧮 word problem करवाएँ।","🏠 घर की सुरक्षित स्थिति से application करवाएँ।"],
    checks:["सही unit/tool चुन सके।","real-life problem में सही operation/choice कर सके।"]
  },
  "EVS & Science / पर्यावरण एवं विज्ञान": {
    steps:["🔎 आसपास की वास्तविक चीज/चित्र दिखाएँ।","👀 observation करवाकर 'क्या दिख रहा है?' पूछें।","🗣️ अनुमान और कारण अलग-अलग बोलवाएँ।","🧪 सुरक्षित छोटा demonstration करें।","📝 observation/result record करवाएँ।","🌱 सीख को घर/प्रकृति से जोड़ें।"],
    checks:["observation और guess में अंतर बता सके।","सुरक्षित activity के result को सरल शब्दों में बता सके।"]
  },
  "Health & Safety / स्वास्थ्य एवं सुरक्षा": {
    steps:["🖼️ सही और गलत situation का चित्र दिखाएँ।","🗣️ बच्चे से खतरा/healthy habit पहचानवाएँ।","🔊 सही action और emergency words बोलवाएँ।","🎭 safe role-play करवाएँ।","🧼 वास्तविक safe habit practice करवाएँ।","🔁 'क्या करेंगे?' scenarios से revision करें।"],
    checks:["unsafe और safe behaviour अलग कर सके।","जरूरत पर trusted adult/emergency help लेने का सही तरीका बता सके।"]
  },
  "Life Skills & Values / जीवन कौशल एवं मूल्य": {
    steps:["🎭 daily-life situation का role-play करें।","👀 feelings और problem पहचानें।","🗣️ अपनी बात और दूसरे की बात सुनें।","🧩 2–3 possible responses सोचें।","🤝 respectful response चुनकर practice करें।","🔁 result और सीख पर reflection करें।"],
    checks:["अपना कारण समझाकर बता सके।","दूसरे व्यक्ति के perspective को कम से कम एक वाक्य में बता सके।"]
  },
  "Creativity & Digital Learning / रचनात्मकता एवं डिजिटल सीख": {
    steps:["👀 example/demo दिखाएँ।","💡 बच्चे से अपना idea सोचवाएँ।","🛠️ material/device का सुरक्षित उपयोग दिखाएँ।","🎨 बच्चा guided और फिर स्वतंत्र काम करे।","🗣️ अपने काम के बारे में बताए।","🔎 feedback लेकर सुधार करे।"],
    checks:["काम की प्रक्रिया समझा सके।","digital activity में basic safety rule follow करे।"]
  }
};

const SECONDARY_EDUCATION_MODULES = [
  { title:"Hindi Language & Literature / हिंदी भाषा एवं साहित्य", lessons:["वर्ण, शब्द, वाक्य एवं भाषा-प्रयोग","संज्ञा, सर्वनाम, विशेषण, क्रिया, काल एवं वाक्य-रचना","संधि, समास, उपसर्ग, प्रत्यय, पर्यायवाची, विलोम एवं मुहावरे","अपठित गद्यांश, पद्यांश, निबंध, पत्र, आवेदन, संवाद एवं रिपोर्ट लेखन"] },
  { title:"English Language & Communication / अंग्रेज़ी भाषा एवं संचार", lessons:["Parts of Speech, sentence structure एवं vocabulary","Tenses, articles, prepositions, modals एवं subject-verb agreement","Reading comprehension, inference, main idea एवं vocabulary in context","Paragraph, letter, email, report, story, speaking एवं listening practice"] },
  { title:"Mathematics Foundations / गणित की आधारशिला", lessons:["Number system, real numbers, integers, fractions एवं decimals","Exponents, powers, ratio, proportion एवं percentage","Algebraic expressions, identities एवं factorisation","Linear equations, word problems एवं mathematical reasoning"] },
  { title:"Advanced Algebra / बीजगणित", lessons:["Polynomials एवं operations","Linear equations एवं pairs of equations","Quadratic equations एवं applications","Arithmetic progression, sequences एवं patterns"] },
  { title:"Geometry / ज्यामिति", lessons:["Lines, angles एवं basic geometric reasoning","Triangles, congruence एवं similarity","Quadrilaterals, polygons एवं constructions","Circles, theorems एवं proof-based questions"] },
  { title:"Mensuration, Trigonometry & Coordinate Geometry / क्षेत्रमिति, त्रिकोणमिति एवं निर्देशांक", lessons:["Perimeter, area एवं practical mensuration","Surface area एवं volume","Coordinate geometry एवं graphs","Trigonometric ratios, identities एवं applications"] },
  { title:"Statistics, Probability & Data / सांख्यिकी, प्रायिकता एवं आँकड़े", lessons:["Data collection, tables एवं frequency","Mean, median, mode एवं interpretation","Graphs, charts एवं data comparison","Probability basics एवं real-life decision making"] },
  { title:"Physics / भौतिक विज्ञान", lessons:["Units, measurement, motion, distance, displacement, speed एवं velocity","Force, Newton's laws, gravitation एवं pressure","Work, energy, power, heat एवं temperature","Sound, light, reflection, refraction एवं everyday physics"] },
  { title:"Electricity, Magnetism & Energy / विद्युत, चुंबकत्व एवं ऊर्जा", lessons:["Electric current, voltage, resistance एवं circuits","Series/parallel circuits एवं electrical safety","Magnetism, electromagnetic effects एवं applications","Renewable/non-renewable energy एवं energy conservation"] },
  { title:"Chemistry / रसायन विज्ञान", lessons:["Matter, states, physical/chemical changes एवं separation","Elements, compounds, mixtures, atoms एवं molecules","Atomic structure, valency, formulas एवं periodic table basics","Chemical reactions, acids, bases, salts, metals एवं non-metals"] },
  { title:"Biology / जीव विज्ञान", lessons:["Cell, organelles, tissues एवं organisation","Nutrition, respiration, transport एवं excretion","Control, coordination, reproduction एवं heredity basics","Microorganisms, diseases, immunity, health एवं hygiene"] },
  { title:"Environment & Life Science / पर्यावरण एवं जीवन विज्ञान", lessons:["Ecosystems, food chains, habitats एवं biodiversity","Air, water, soil एवं pollution","Natural resources, conservation एवं climate change","Sustainable living, waste management एवं environmental projects"] },
  { title:"History / इतिहास", lessons:["Historical sources, chronology एवं evidence","Ancient and medieval India: society, culture एवं developments","Modern India, colonialism एवं social-economic change","Freedom movement, major events, causes, consequences एवं historical reasoning"] },
  { title:"Geography / भूगोल", lessons:["Earth, globe, latitude, longitude, maps एवं scale","Physical features, mountains, plateaus, plains एवं rivers","Climate, weather, natural resources एवं agriculture","Population, settlements, industries, transport एवं map practice"] },
  { title:"Civics & Constitution / नागरिक शास्त्र एवं संविधान", lessons:["Society, government, democracy एवं Constitution","Fundamental Rights, Duties, equality एवं justice","Parliament, executive, judiciary एवं rule of law","Elections, local government, Panchayati Raj, media एवं citizen participation"] },
  { title:"Economics & Financial Literacy / अर्थशास्त्र एवं वित्तीय साक्षरता", lessons:["Needs, wants, resources, production एवं economic activities","Money, banking, markets, demand-supply एवं prices","Income, expenditure, savings, budget एवं responsible spending","Employment, poverty, development, consumers एवं digital payment safety"] },
  { title:"Computer & Digital Skills / कंप्यूटर एवं डिजिटल कौशल", lessons:["Computer hardware, software, operating system, files एवं typing","Word processing, spreadsheets, presentations एवं digital documents","Internet, search, email, cloud tools एवं online services","Cyber safety, passwords, phishing, privacy, misinformation एवं AI awareness"] },
  { title:"Study Skills, Career & Life Readiness / अध्ययन, करियर एवं जीवन तैयारी", lessons:["Syllabus mapping, notes, active reading, recall एवं revision","Question solving, answer writing, time management, mock tests एवं error analysis","Communication, teamwork, problem solving, goals एवं presentation","Career awareness, subject pathways, scholarships, skills, resume एवं interview basics"] }
];

const SECONDARY_DOMAIN_GUIDE = {
  "Hindi Language & Literature / हिंदी भाषा एवं साहित्य":"भाषा को नियम रटने के बजाय उदाहरण, पाठ, लेखन और अभिव्यक्ति के साथ सीखें।",
  "English Language & Communication / अंग्रेज़ी भाषा एवं संचार":"English को grammar, vocabulary, reading, listening, speaking और writing के integrated practice से सीखें।",
  "Mathematics Foundations / गणित की आधारशिला":"गणित में concept, worked example, calculation और word problem को क्रम से समझें।",
  "Advanced Algebra / बीजगणित":"Algebra में symbols, rules, transformations और real problems के बीच संबंध समझें।",
  "Geometry / ज्यामिति":"आकृतियों, properties, constructions और reasoning/proof को diagram के साथ समझें।",
  "Mensuration, Trigonometry & Coordinate Geometry / क्षेत्रमिति, त्रिकोणमिति एवं निर्देशांक":"Formula को याद करने से पहले उसका अर्थ, units, diagram और practical application समझें।",
  "Statistics, Probability & Data / सांख्यिकी, प्रायिकता एवं आँकड़े":"Data को collect, organise, calculate, interpret और evidence के आधार पर explain करना सीखें।",
  "Physics / भौतिक विज्ञान":"Physics में observation, units, law, formula, diagram, numerical और experiment को जोड़कर सीखें।",
  "Electricity, Magnetism & Energy / विद्युत, चुंबकत्व एवं ऊर्जा":"Electrical और energy concepts को safe demonstrations, circuits, diagrams और calculations से समझें।",
  "Chemistry / रसायन विज्ञान":"Chemistry में पदार्थ, संरचना, properties, reactions, equations और laboratory safety को साथ समझें।",
  "Biology / जीव विज्ञान":"Biology में structure, function, process, diagram, health connection और observation पर जोर दें।",
  "Environment & Life Science / पर्यावरण एवं जीवन विज्ञान":"Environment को local observation, ecosystem relationships, evidence और conservation action से समझें।",
  "History / इतिहास":"History को dates की list नहीं, बल्कि sources, chronology, causes, consequences और perspectives से समझें।",
  "Geography / भूगोल":"Geography में map, location, physical processes, human activity और data को जोड़कर सीखें।",
  "Civics & Constitution / नागरिक शास्त्र एवं संविधान":"Civics में institutions, rights, duties, constitutional values और citizen participation को examples से समझें।",
  "Economics & Financial Literacy / अर्थशास्त्र एवं वित्तीय साक्षरता":"Economics को household, market, employment, banking, budgeting और consumer situations से जोड़ें।",
  "Computer & Digital Skills / कंप्यूटर एवं डिजिटल कौशल":"Digital learning में करके सीखना, safe workflow, privacy और information verification जरूरी है।",
  "Study Skills, Career & Life Readiness / अध्ययन, करियर एवं जीवन तैयारी":"Learning को plan, practice, assessment, reflection, career exploration और practical life skills से जोड़ें।"
};

const KNOWLEDGE_WORLD_MODULES = {
  "Time & Calendar / समय एवं कैलेंडर":[["Units of Time / समय की इकाइयाँ",["⏱️ Second / सेकंड","⏱️ Minute / मिनट","🕐 Hour / घंटा","📅 Day, Week, Month, Year / दिन, सप्ताह, महीना, वर्ष"]],["Clock / घड़ी",["🕐 Hour Hand / घंटे की सुई","🕑 Minute Hand / मिनट की सुई","⏰ Analog Clock / एनालॉग घड़ी","📱 Digital Clock / डिजिटल घड़ी"]],["Calendar / कैलेंडर",["📆 Date & Day / तारीख एवं दिन","🗓️ Months / महीने","🌦️ Seasons / ऋतुएँ","🔁 Leap Year / लीप वर्ष"]],["Time Practice / समय अभ्यास",["➕ Add Time / समय जोड़ना","➖ Subtract Time / समय घटाना","⏳ Duration / अवधि","🎯 Timetable & Planning / समय योजना"]]],
  "Fruits / फल":[["Fruit Identification / फल पहचान",["🍎 Names & Pictures / नाम एवं चित्र","🎨 Colours & Shapes / रंग एवं आकार","🍃 Edible Parts / खाने योग्य भाग","🌱 Fruit Plants / फलदार पौधे"]],["Growth & Seasons / वृद्धि एवं मौसम",["🌱 Seed / बीज","🌸 Flower to Fruit / फूल से फल","🌦️ Fruit Seasons / फलों का मौसम","👨‍🌾 Harvest / तुड़ाई"]],["Food & Nutrition / भोजन एवं पोषण",["🥗 Nutrients / पोषक तत्व","💧 Washing & Hygiene / धुलाई एवं स्वच्छता","🍽️ Serving & Eating / भोजन करना","🧺 Storage / भंडारण"]],["Learning Practice / अभ्यास",["🔎 Identify / पहचानें","🧩 Match Fruit to Plant / फल-पौधा मिलाएँ","📊 Compare / तुलना करें","❓ Quiz / प्रश्नोत्तरी"]]],
  "Flowers / फूल":[["Flower Basics / फूल आधार",["🌸 Names / नाम","🌼 Parts / भाग","🎨 Colours & Shapes / रंग एवं आकार","🌺 Fragrance / सुगंध"]],["Plant Reproduction / पौधों में प्रजनन",["🐝 Pollination / परागण","🌱 Seed Formation / बीज निर्माण","🍃 Plant Life Cycle / जीवन चक्र","🌦️ Seasonal Flowers / मौसमी फूल"]],["Uses & Importance / उपयोग एवं महत्व",["🐝 Pollinators / परागणकर्ता","🌿 Ecosystem Role / पारिस्थितिक भूमिका","🎉 Cultural Uses / सांस्कृतिक उपयोग","🌱 Gardening / बागवानी"]],["Practice / अभ्यास",["🔎 Identify Flowers / फूल पहचानें","🧩 Parts Match / भाग मिलान","🌱 Grow & Observe / उगाएँ एवं देखें","❓ Quiz / प्रश्नोत्तरी"]]],
  "Trees & Forests / वृक्ष एवं जंगल":[["Tree Basics / वृक्ष आधार",["🌳 Root / जड़","🌿 Stem & Bark / तना एवं छाल","🍃 Leaf / पत्ती","🌸 Flower, Fruit & Seed / फूल, फल एवं बीज"]],["Forest Life / जंगल का जीवन",["🌲 Forest Layers / वन स्तर","🐾 Wildlife / वन्यजीव","🦋 Biodiversity / जैव विविधता","🌱 Food Chains / खाद्य श्रृंखला"]],["Uses & Services / उपयोग एवं सेवाएँ",["🪵 Timber & Products / लकड़ी एवं उत्पाद","💧 Water & Soil Protection / जल एवं मिट्टी संरक्षण","🌬️ Air & Climate / वायु एवं जलवायु","👨‍🌾 Livelihoods / आजीविका"]],["Protection / संरक्षण",["🔥 Fire Safety / आग से सुरक्षा","🚫 Deforestation / वनों की कटाई","♻️ Sustainable Use / टिकाऊ उपयोग","🌱 Plantation & Care / रोपण एवं देखभाल"]]],
  "Animals & Birds / जानवर एवं पक्षी":[["Animal Groups / जीव समूह",["🐾 Mammals / स्तनधारी","🐦 Birds / पक्षी","🐍 Reptiles / सरीसृप","🐸 Amphibians & Fish / उभयचर एवं मछलियाँ"]],["Body & Adaptation / शरीर एवं अनुकूलन",["🦴 Body Parts / शरीर के अंग","🪶 Feathers & Beaks / पंख एवं चोंच","🧭 Habitat Adaptation / आवास अनुकूलन","🍽️ Food / भोजन"]],["Behaviour & Life / व्यवहार एवं जीवन",["🥚 Life Cycle / जीवन चक्र","🏠 Nests & Shelters / घोंसले एवं आवास","🗣️ Calls & Behaviour / आवाज़ एवं व्यवहार","🌿 Food Chain / खाद्य श्रृंखला"]],["Care & Protection / देखभाल एवं संरक्षण",["💧 Animal Welfare / पशु कल्याण","🚫 Wildlife Safety / वन्यजीव सुरक्षा","🌳 Habitat Protection / आवास संरक्षण","❓ Identification Quiz / पहचान प्रश्नोत्तरी"]]],
  "Rivers, Mountains & Seas / नदियाँ, पर्वत एवं समुद्र":[["Geography Basics / भूगोल आधार",["🗺️ Map & Location / मानचित्र एवं स्थान","🏔️ Mountain / पर्वत","🌊 River / नदी","🌊 Sea & Ocean / समुद्र एवं महासागर"]],["Formation & Features / निर्माण एवं विशेषताएँ",["⛰️ Relief & Slopes / ढाल एवं भू-आकृति","💧 River Source & Tributary / नदी स्रोत एवं सहायक नदी","🌊 Coast & Waves / तट एवं लहरें","🏞️ Basin / जलग्रहण क्षेत्र"]],["Life & Human Use / जीवन एवं उपयोग",["💧 Water Use / जल उपयोग","🌾 Agriculture / कृषि","🐟 Aquatic Life / जलचर जीवन","🏙️ Settlements & Transport / बस्तियाँ एवं परिवहन"]],["Risk & Conservation / जोखिम एवं संरक्षण",["🌊 Floods / बाढ़","⛰️ Landslides / भूस्खलन","🚯 Pollution / प्रदूषण","♻️ Conservation / संरक्षण"]]],
  "Countries & World / देश एवं विश्व":[["Country Basics / देश आधार",["🌎 Country / देश","🏛️ Capital / राजधानी","🏳️ Flag / ध्वज","💰 Currency / मुद्रा"]],["People & Geography / लोग एवं भूगोल",["🗺️ Location / स्थान","🗣️ Language / भाषा","👥 People & Culture / लोग एवं संस्कृति","🏙️ Cities / शहर"]],["Administration / प्रशासन",["🏛️ State/Province/Region / राज्य-प्रांत-क्षेत्र","📍 District/Local Areas / जिले एवं स्थानीय क्षेत्र","📊 Population & Area / जनसंख्या एवं क्षेत्र","🔄 Boundary Changes / सीमाओं में बदलाव"]],["Map & Fact Practice / मानचित्र एवं तथ्य",["🗺️ Locate Country / देश खोजें","🔎 Compare / तुलना करें","📚 Verify Current Facts / तथ्य जाँचें","❓ Quiz / प्रश्नोत्तरी"]]],
  "India / भारत":[["India Geography / भारत का भूगोल",["🗺️ Location & Borders / स्थिति एवं सीमाएँ","🏔️ Mountains / पर्वत","🌊 Rivers / नदियाँ","🌳 Forests / जंगल"]],["States & UTs / राज्य एवं केंद्रशासित प्रदेश",["🏛️ States / राज्य","🏝️ Union Territories / केंद्रशासित प्रदेश","🏙️ Capitals / राजधानियाँ","🗺️ Map Practice / मानचित्र अभ्यास"]],["Districts & Administration / जिले एवं प्रशासन",["📍 District / जिला","🏘️ Local Bodies / स्थानीय निकाय","🏛️ State Administration / राज्य प्रशासन","📋 Administrative Information / प्रशासनिक जानकारी"]],["People & Culture / लोग एवं संस्कृति",["🗣️ Languages / भाषाएँ","🎭 Culture / संस्कृति","🌾 Agriculture / कृषि","🧭 Regions / क्षेत्र"]]],
  "Earth & Nature / पृथ्वी एवं प्रकृति":[["Earth / पृथ्वी",["🌍 Shape & Layers / आकार एवं परतें","🔄 Rotation / घूर्णन","☀️ Revolution / परिक्रमण","🗺️ Continents & Oceans / महाद्वीप एवं महासागर"]],["Earth Systems / पृथ्वी तंत्र",["🌬️ Air / वायु","💧 Water / जल","🌱 Soil / मिट्टी","🌦️ Weather / मौसम"]],["Nature & Life / प्रकृति एवं जीवन",["🌱 Plants / पौधे","🐾 Animals / जीव","🦋 Ecosystems / पारिस्थितिकी तंत्र","🔗 Food Chains / खाद्य श्रृंखला"]],["Conservation / संरक्षण",["♻️ Resources / संसाधन","🚯 Pollution / प्रदूषण","🌳 Biodiversity / जैव विविधता","🎯 Local Action / स्थानीय कार्रवाई"]]],
  "Solar System & Space / सौरमंडल एवं अंतरिक्ष":[["Space Basics / अंतरिक्ष आधार",["🌍 Earth / पृथ्वी","☀️ Sun / सूर्य","🌙 Moon / चंद्रमा","⭐ Stars / तारे"]],["Solar System / सौरमंडल",["☀️ Sun / सूर्य","🪐 Planets / ग्रह","🌙 Moons / उपग्रह","☄️ Asteroids & Comets / क्षुद्रग्रह एवं धूमकेतु"]],["Beyond / आगे का अंतरिक्ष",["🌌 Galaxy / आकाशगंगा","✨ Nebulae / नीहारिकाएँ","🌌 Universe / ब्रह्मांड","💡 Light-year / प्रकाश-वर्ष"]],["Observation / अवलोकन",["🔭 Telescope / दूरबीन","🛰️ Satellites / उपग्रह","🚀 Space Missions / अंतरिक्ष मिशन","❓ Quiz / प्रश्नोत्तरी"]]],
  "Human Body & Health / मानव शरीर एवं स्वास्थ्य":[["Body Basics / शरीर आधार",["🧍 Body Parts / शरीर के अंग","🦴 Bones & Muscles / हड्डियाँ एवं मांसपेशियाँ","🫀 Heart & Blood / हृदय एवं रक्त","🧠 Brain & Nerves / मस्तिष्क एवं तंत्रिकाएँ"]],["Body Systems / शरीर तंत्र",["🫁 Respiratory / श्वसन तंत्र","🍽️ Digestive / पाचन तंत्र","🩸 Circulatory / परिसंचरण तंत्र","🚽 Excretory / उत्सर्जन तंत्र"]],["Food & Prevention / भोजन एवं बचाव",["🥗 Balanced Diet / संतुलित आहार","💧 Water / जल","🧼 Hygiene / स्वच्छता","🦠 Infection Prevention / संक्रमण रोकथाम"]],["Safety & Care / सुरक्षा एवं देखभाल",["🩹 First Aid / प्राथमिक उपचार","⚠️ Warning Signs / चेतावनी संकेत","🧑‍⚕️ Professional Care / चिकित्सकीय सहायता","🧘 Healthy Routine / स्वस्थ दिनचर्या"]]],
  "Plants & Natural Health Knowledge / पौधे एवं प्राकृतिक स्वास्थ्य ज्ञान":[["Plant Knowledge / पौध ज्ञान",["🌿 Herb Identification / जड़ी-बूटी पहचान","🍃 Plant Parts / पौधे के भाग","🌱 Growing Conditions / वृद्धि की परिस्थितियाँ","🔎 Correct Identification / सही पहचान"]],["Traditional Knowledge / पारंपरिक ज्ञान",["🌿 Common Uses / सामान्य उपयोग","🫖 Household Preparations / घरेलू उपयोग","📜 Traditional Practices / पारंपरिक अभ्यास","🧪 Evidence / वैज्ञानिक प्रमाण"]],["Safety / सुरक्षा",["⚠️ Dose & Concentration / मात्रा एवं सांद्रता","💊 Drug Interactions / दवा अंतःक्रिया","🚫 Contraindications / सावधानियाँ","🧑‍⚕️ Professional Advice / विशेषज्ञ सलाह"]],["Responsible Use / जिम्मेदार उपयोग",["🔎 Verify Identity / पहचान सत्यापित करें","📋 Record Response / प्रतिक्रिया दर्ज करें","🚨 Stop for Warning Signs / चेतावनी पर रोकें","❓ Knowledge Check / प्रश्नोत्तरी"]]],
  "Materials & Their Uses / सामग्री एवं उनके उपयोग":[["Material Basics / सामग्री आधार",["🧱 Wood / लकड़ी","📄 Paper / कागज","🪟 Glass / काँच","🔩 Metal / धातु"]],["Properties / गुण",["💪 Strength / मजबूती","⚖️ Weight / भार","💧 Water Resistance / जल प्रतिरोध","🔥 Heat Behaviour / ऊष्मा व्यवहार"]],["Where Used / कहाँ उपयोग",["🏠 Home / घर","🏫 School & Work / स्कूल एवं कार्य","🏗️ Construction / निर्माण","🛠️ Tools & Products / औजार एवं उत्पाद"]],["Safe Use & Reuse / सुरक्षित उपयोग एवं पुनः उपयोग",["🧤 Safety / सुरक्षा","🧹 Maintenance / देखभाल","♻️ Reuse / पुनः उपयोग","♻️ Recycling / पुनर्चक्रण"]]],
  "Family, Values & Peace / परिवार, मूल्य एवं शांति":[["Healthy Relationships / स्वस्थ संबंध",["❤️ Respect / सम्मान","👂 Listening / सुनना","🗣️ Communication / संवाद","🤝 Cooperation / सहयोग"]],["Why Conflicts Happen / झगड़े क्यों होते हैं",["💬 Misunderstanding / गलतफहमी","😠 Anger & Stress / गुस्सा एवं तनाव","💰 Money & Responsibilities / पैसा एवं जिम्मेदारी","🧩 Different Expectations / अलग अपेक्षाएँ"]],["Peaceful Resolution / शांतिपूर्ण समाधान",["🛑 Pause / रुकना","👂 Listen / सुनना","🗣️ Explain Needs / जरूरत बताना","🤝 Problem Solve / समाधान"]],["Safety & Support / सुरक्षा एवं सहायता",["🛡️ Boundaries / सीमाएँ","🚨 Violence Warning Signs / हिंसा के संकेत","📞 Trusted Support / भरोसेमंद सहायता","🌱 Healthy Living / स्वस्थ जीवन"]]],
  "Science Around Us / हमारे आसपास का विज्ञान":[["Everyday Physics / रोज़मर्रा की भौतिकी",["⚖️ Force & Motion / बल एवं गति","💡 Light / प्रकाश","🔊 Sound / ध्वनि","🌡️ Heat / ऊष्मा"]],["Everyday Chemistry / रोज़मर्रा की रसायन",["💧 Mixtures / मिश्रण","🧂 Solutions / विलयन","🧼 Acids & Bases Basics / अम्ल एवं क्षार आधार","🔄 Physical & Chemical Change / भौतिक एवं रासायनिक परिवर्तन"]],["Everyday Biology / रोज़मर्रा की जीवविज्ञान",["🌱 Plants / पौधे","🦠 Microbes / सूक्ष्मजीव","🧍 Body / शरीर","🍽️ Food / भोजन"]],["Energy & Experiments / ऊर्जा एवं प्रयोग",["⚡ Electricity / बिजली","☀️ Solar Energy / सौर ऊर्जा","🌀 Wind / पवन ऊर्जा","🧪 Safe Experiment / सुरक्षित प्रयोग"]]]
};

// Builds a lesson from the subject-specific content registry (SUBJECT_CONTENT).
// Rotation over the registry's own concept/example/practice/quiz material keeps
// every module and lesson of a subject distinct while staying on-topic.
const buildSpecificLesson = (subject, content, moduleTitle, label, mi, li) => {
  const clean = String(label || "").replace(/^[^\p{L}\p{N}]+/u, "");
  const en = subject.en;
  const pick = (arr, n) => (arr && arr.length ? arr[n % arr.length] : "");
  const rotate = (arr, n, count) => {
    if (!arr || !arr.length) return [];
    const out = [];
    for (let i = 0; i < Math.min(count, arr.length); i++) out.push(arr[(n + i) % arr.length]);
    return out;
  };
  const concept = pick(content.concepts, mi * 3 + li);
  const example = pick(content.examples, mi + li);
  const practiceItem = pick(content.practice, mi + li);
  const activityItem = pick(content.activities, mi + li);
  const mistake = pick(content.mistakes, mi + li);
  const safetyList = (content.safety || []).slice(0, 3);
  const quiz = rotate(content.quiz, mi + li, 4);
  const body = (moduleTitle ? "📘 " + moduleTitle + " • " : "") + clean + ": " + content.focus;
  return [label, body, {
    objectives: [
      clean + " को " + en + " के संदर्भ में समझना। / Understand " + clean + " within " + en + ".",
      concept,
      "सीखे गए concept को उदाहरण और अभ्यास से लागू करना। / Apply the concept through example and practice."
    ],
    content: {
      easyExplanation: "📖 सरल समझ / Simple meaning: " + clean + " — " + content.focus,
      deepUnderstanding: "🧠 गहरी समझ / Deep understanding: " + concept,
      whyItMatters: "🎯 क्यों जरूरी है / Why it matters: " + en + " में यह ज्ञान रोज़मर्रा की समझ और सही निर्णय में मदद करता है।",
      keyPoints: rotate(content.concepts, mi, 4),
      examples: [example, "🔎 अपने आसपास से एक और उदाहरण खोजें और समझाएँ।"],
      steps: ["🎯 उद्देश्य समझें","📖 concept पढ़ें","👀 उदाहरण देखें","🔊 सुनें और बोलें","🛠️ guided practice करें","✍️ स्वयं अभ्यास करें","🔎 उत्तर जाँचें","🔁 revision करें"],
      practicalApplication: "🏠 व्यावहारिक उपयोग / Practical application: " + (content.practical || activityItem),
      memoryHook: "🧠 याद रखें / Remember: समझो → उदाहरण देखो → करो → जाँचो → दोहराओ।",
      commonMistakes: [mistake, ...(content.mistakes || []).filter((x) => x !== mistake).slice(0, 1), ...safetyList],
      summary: "📌 सार / Summary: " + clean + " — " + concept,
      knowledgeCheck: quiz,
      reflection: [
        "आज मैंने " + clean + " के बारे में क्या नया सीखा?",
        "इसका एक वास्तविक उदाहरण क्या हो सकता है?",
        "कौन-सी बात मुझे दोहरानी या अभ्यास करनी है?"
      ]
    },
    practice: [practiceItem, ...rotate(content.practice, mi + li + 1, 2), "🔁 बिना notes देखे एक बार फिर दोहराएँ।"],
    activity: "🎯 गतिविधि / Activity: " + (content.practical ? activityItem + " (लक्ष्य: " + content.practical + ")" : activityItem)
  }];
};

const makeRichSubjectLesson = (subject, moduleTitle, label, mi, li) => {
  if (SUBJECT_CONTENT_ALL[subject.en]) {
    return buildSpecificLesson(subject, SUBJECT_CONTENT_ALL[subject.en], moduleTitle, label, mi, li);
  }
  if (subject.en === "Secondary Education") {
    const m = SECONDARY_EDUCATION_MODULES[mi % SECONDARY_EDUCATION_MODULES.length];
    const lesson = m.lessons[li % m.lessons.length];
    return {
      label,
      body: "माध्यमिक शिक्षा में " + lesson + " को concept → example → guided practice → independent practice → revision के क्रम में सीखें।",
      objectives:["Concept को स्पष्ट समझना।","Example देखकर method/कारण पहचानना।","नया practice task स्वयं पूरा करके self-check करना।"],
      easy:"पहले concept को सरल भाषा और उदाहरण से समझें, फिर guided example करें और अंत में बिना मदद के नया प्रश्न/कार्य पूरा करें।",
      deep:"माध्यमिक स्तर पर केवल उत्तर याद करना पर्याप्त नहीं है। कारण, method, evidence, calculation और answer presentation को समझना जरूरी है।",
      why:"यह lesson school learning, परीक्षा, आगे की पढ़ाई और वास्तविक जीवन की problem-solving क्षमता मजबूत करता है।",
      keyPoints:["Concept को अपने शब्दों में समझाएँ।","Solved example का method पहचानें।","नया example स्वयं करें।","गलती का कारण पहचानकर सुधारें।"],
      examples:["Textbook example को step-by-step समझाएँ।","उसी concept पर नया प्रश्न स्वयं हल करें।","Answer को question की मांग और method से verify करें।"],
      steps:["Topic और objective पढ़ें।","Model example देखें।","Guided practice में हर step करें।","Independent task बिना notes के करें।","Answer check करके error सुधारें।"],
      practice:["3 key points बिना किताब देखे लिखें।","2 guided और 2 independent questions करें।","एक real-life application example लिखें।"],
      activity:"Mini study card बनाएं: Concept → Example → Method → Practice → Mistake → Correct Method.",
      memoryHook:"समझो → उदाहरण देखो → खुद करो → जाँचो → सुधारो → दोहराओ।",
      mistakes:["सिर्फ answer याद करना और method न समझना।","Question की मांग ठीक से न पढ़ना।","गलत answer के बाद error analysis न करना।"],
      safety:"Science/practical activity में teacher guidance और safe equipment use जरूरी है। Online study में unknown links, downloads, OTP या personal information share न करें।",
      summary:"Concept को समझकर, example देखकर, practice करके और self-check से mastery विकसित करें।",
      knowledgeCheck:[
        {question:"सही learning sequence क्या है?",options:["Concept → Example → Practice → Self-check → Revision","केवल answer याद करना","सिर्फ video देखना","सिर्फ notes copy करना"],answer:0},
        {question:"गलत answer मिलने पर सबसे उपयोगी कदम क्या है?",options:["गलती का कारण पहचानकर method दोबारा करना","उत्तर छोड़ देना","बिना समझे याद करना","practice छोड़ देना"],answer:0},
        {question:"अच्छी learning का प्रमाण क्या है?",options:["नए प्रश्न में concept का सही उपयोग कर पाना","सिर्फ definition बोलना","केवल notebook भरना","सिर्फ marks याद रखना"],answer:0}
      ],
      reflection:["आज मैंने कौन-सा concept अपने शब्दों में समझाया?","किस step में गलती हुई और कैसे सुधारी?","इस knowledge का real-life उपयोग कहाँ हो सकता है?"]
    };
  }


  const clean = String(label || "").replace(/^[^\p{L}\p{N}]+/u, "");
  const subjectName = subject.en;
  if (/^primary-education$/.test(subject.id) || /primary education|प्राथमिक शिक्षा/i.test(subject.en + " " + subject.hi)) {
    const primary = PRIMARY_EDUCATION_LESSON_CONTENT[clean + ""] || PRIMARY_EDUCATION_LESSON_CONTENT[label];
    if (primary) {
      const mode = PRIMARY_TEACHING_MODE[moduleTitle.replace(/^[^/]+\s/, "").trim()] || PRIMARY_TEACHING_MODE["Foundation / आधार"];
      const check = [
        {question: "👀 देखकर " + clean + " में क्या पहचान सकते हैं?", options:["मुख्य concept/उदाहरण को पहचानना","सिर्फ heading पढ़ना","बिना देखे अनुमान लगाना","practice छोड़ देना"], answer:0},
        {question: "🛠️ " + clean + " सीखने के बाद क्या करना चाहिए?", options:["स्वयं example/practice करके answer जाँचना","केवल याद करना","गलत answer को छोड़ देना","बिना समझे copy करना"], answer:0},
        {question: "🗣️ क्या बच्चा " + clean + " को अपने शब्दों में समझा सकता है?", options:["हाँ, example के साथ समझाना चाहिए","नहीं, केवल notes पढ़ने चाहिए","केवल certificate देखना चाहिए","practice की जरूरत नहीं"], answer:0}
      ];
      return [
        label,
        primary.body + " इसे सुनकर, देखकर, बोलकर, करके और दोहराकर सीखें।",
        {
          objectives: primary.objectives,
          content:{
            easyExplanation:"📖 सरल समझ / Simple meaning: " + primary.body,
            deepUnderstanding:"🧠 गहरी समझ / Deep understanding: " + primary.deep,
            whyItMatters:"🎯 क्यों जरूरी है / Why it matters: " + primary.summary,
            keyPoints:[clean,...primary.objectives],
            examples:[...primary.examples,"🔎 नया उदाहरण: अपने आसपास की एक वास्तविक वस्तु/स्थिति चुनें और बताएं कि " + clean + " उससे कैसे जुड़ता है।"],
            steps:mode.steps,
            practicalApplication:"🏠 व्यावहारिक उपयोग / Practical application: " + primary.activity,
            memoryHook:"🧠 याद रखें / Remember: " + primary.summary,
            commonMistakes:primary.mistakes,
            summary:"📌 " + primary.summary
          },
          practice:[...primary.practice,"🗣️ किसी साथी/परिजन को " + clean + " का एक उदाहरण बोलकर समझाएँ।","🔁 बिना notes देखे एक बार फिर करके देखें।"],
          activity:"🎯 गतिविधि / Activity: " + primary.activity,
          knowledgeCheck:check,
          reflection:["आज मैंने क्या देखा, सुना और बोला?","मैंने खुद करके क्या सीखा?","कौन-सी गलती हुई और मैंने उसे कैसे सुधारा?"]
        }
      ];
    }
  }

  if (subject.en === "Secondary Education") {
    const module = SECONDARY_EDUCATION_MODULES[mi % SECONDARY_EDUCATION_MODULES.length];
    const focus = SECONDARY_DOMAIN_GUIDE[module.title] || "Concept, example, guided practice, independent practice, application और assessment के साथ सीखें।";
    const lesson = module.lessons[li % module.lessons.length];
    const body = "माध्यमिक शिक्षा में " + lesson + " को " + focus;
    return [label, body, {
      objectives:[
        lesson + " के मुख्य concepts और vocabulary समझना।",
        "Solved examples देखकर method/reasoning पहचानना।",
        "नए प्रश्न या practical situation में concept स्वयं लागू करना।"
      ],
      content:{
        easyExplanation:"📖 सरल समझ: " + lesson + " को पहले आसान भाषा में समझें, फिर textbook-style example और real-life connection से जोड़ें।",
        deepUnderstanding:"🧠 गहरी समझ: क्या है, क्यों है, कैसे काम करता है, कब लागू होता है और answer/result को कैसे verify करेंगे—इन सवालों से topic को समझें।",
        whyItMatters:"🎯 महत्व: यह lesson school learning, examination, आगे की पढ़ाई और practical problem-solving को मजबूत करता है।",
        keyPoints:[module.title, lesson, focus],
        examples:[
          "एक solved example को step-by-step पढ़ें और हर step का कारण बताएं।",
          "उसी concept पर एक नया example स्वयं करें।",
          "इस topic का एक real-life या school-level application पहचानें।"
        ],
        steps:["🎯 Learning objective समझें","📖 concept और vocabulary सीखें","👀 example/diagram/model देखें","🗣️ method अपने शब्दों में समझाएँ","🛠️ guided practice करें","✍️ independent question/task करें","🔎 answer, calculation या evidence check करें","🔄 error सुधारकर revision करें"],
        practicalApplication:"🏠/🏫 इस lesson से जुड़ा एक छोटा real-life या classroom task करें और उसका result लिखें।",
        memoryHook:"🧠 समझो → उदाहरण देखो → तरीका समझाओ → खुद करो → जाँचो → सुधारो → दोहराओ।",
        commonMistakes:["सिर्फ definition/formula याद करके application न करना।","Question की मांग या units/evidence को ignore करना।","गलत answer के बाद error analysis न करना।"],
        summary:"Concept + Example + Practice + Application + Self-check = मजबूत learning."
      },
      practice:[
        "3 मुख्य points बिना notes देखे लिखें।",
        "2 guided और 2 independent questions/tasks करें।",
        "एक application example अपने शब्दों में समझाएँ।"
      ],
      activity:"Mini Learning Task: " + lesson + " का concept → example → practice → result → reflection एक page पर पूरा करें।",
      knowledgeCheck:[
        {question:"" + lesson + " सीखने का सही तरीका क्या है?",options:["Concept समझना, example देखना, practice और self-check करना","केवल heading याद करना","सिर्फ notes copy करना","practice छोड़ देना"],answer:0},
        {question:"गलत answer मिलने पर क्या करना चाहिए?",options:["Error का कारण पहचानकर method दोबारा करना","गलती छोड़ देना","बिना समझे answer याद करना","अगला topic छोड़ देना"],answer:0},
        {question:"Learning का practical evidence क्या है?",options:["नए question/situation में concept सही लागू कर पाना","केवल definition बोलना","सिर्फ notebook भरना","केवल marks याद रखना"],answer:0}
      ],
      reflection:["आज मैंने कौन-सा concept अपने शब्दों में समझाया?","किस step में मेरी गलती हुई?","इस lesson को वास्तविक जीवन या अगले subject topic से कैसे जोड़ सकता/सकती हूँ?"]
    }];
  }

  if (subject.category === "Knowledge World / ज्ञान संसार" && knowledgeWorldModulesFor(subject)) {
    const modules = knowledgeWorldModulesFor(subject);
    const module = modules[mi] || modules[0];
    const lessonText = clean + " को " + subjectName + " के संदर्भ में पहचान, कारण, उपयोग, उदाहरण, सुरक्षित अभ्यास और वास्तविक जीवन के प्रयोग के साथ समझें।";
    const safety = /health|violence|peace|health knowledge/i.test(subject.en)
      ? ["⚠️ सामान्य जानकारी को व्यक्तिगत diagnosis/treatment न मानें।","🧑‍⚕️ जरूरत पर qualified professional/help service लें।"]
      : ["🔎 तथ्य और उदाहरण को ध्यान से जाँचें।","🛠️ practical activity सुरक्षित तरीके से करें।"];
    return [label,lessonText,{
      objectives:[clean + " का अर्थ और मुख्य भाग समझना।","इसके वास्तविक उदाहरण और उपयोग पहचानना।","अभ्यास करके सही समझ को स्वयं explain करना।"],
      content:{
        easyExplanation:"📖 सरल समझ: " + clean + " को आसान भाषा और आसपास के उदाहरणों से सीखें।",
        deepUnderstanding:"🧠 गहरी समझ: " + clean + " क्या है, कैसे/क्यों होता है, कहाँ मिलता है, किस काम आता है और किन सीमाओं/सावधानियों को समझना चाहिए।",
        whyItMatters:"🎯 महत्व: यह ज्ञान रोज़मर्रा की समझ, सही निर्णय और practical learning में मदद करता है।",
        keyPoints:[clean,moduleTitle,subjectName],
        examples:["अपने आसपास इसका एक वास्तविक उदाहरण खोजें।","चित्र/वस्तु/मानचित्र देखकर इसकी पहचान करें।","एक सही और एक गलत उपयोग/स्थिति की तुलना करें।"],
        steps:["👀 देखें और पहचानें","📖 सरल explanation पढ़ें","🔊 सुनें और key point बोलें","🧩 उदाहरण से मिलाएँ","🛠️ guided practice करें","✍️ स्वयं answer/activity करें","🔎 result जाँचें","🔁 revision करें"],
        practicalApplication:"🏠 घर/स्कूल/समुदाय में " + clean + " का एक वास्तविक उपयोग या observation करें।",
        memoryHook:"🧠 क्या? कहाँ? क्यों? कैसे? किस काम? — इन 5 सवालों से याद रखें।",
        commonMistakes:["केवल नाम/definition याद करना।","example और real-life application न करना.","असत्यापित जानकारी को तथ्य मान लेना.",...safety],
        summary:"📌 समझें → उदाहरण देखें → करके सीखें → जाँचें → दूसरों को समझाएँ।"
      },
      practice:["एक पहचान/समझ वाला प्रश्न हल करें।","एक real-life example लिखें।","बिना notes देखे 3 मुख्य बातें बोलें।"],
      activity:"🎯 Mini Activity: " + clean + " का एक उदाहरण/चित्र/वस्तु चुनें और उसका नाम, मुख्य विशेषता, उपयोग तथा एक सावधानी लिखें।",
      knowledgeCheck:[
        {question:clean + " के बारे में सही learning क्या है?",options:["अर्थ + उदाहरण + उपयोग + practice समझना","सिर्फ नाम याद करना","बिना जाँच अनुमान लगाना","activity छोड़ देना"],answer:0},
        {question:"सीखी बात को कैसे verify करेंगे?",options:["example/activity से और जहाँ जरूरी हो reliable source से जाँचेंगे","केवल forward message मानेंगे","सिर्फ guess करेंगे","बिना context copy करेंगे"],answer:0},
        {question:"सीखने के बाद क्या करें?",options:["Explain, practice और revision","केवल heading पढ़ें","गलती छोड़ दें","practice न करें"],answer:0}
      ],
      reflection:["आज मैंने क्या नया जाना?","मैं इसे कहाँ उपयोग/देख सकता/सकती हूँ?","मेरी कौन-सी बात verify या practice करनी बाकी है?"]
    }];
  }

  const domainGuide = ({
    "Education / शिक्षा": { focus:"शिक्षार्थी को विषय का अर्थ, मुख्य concepts, examples, अभ्यास, प्रश्न हल करना, revision और आगे की learning समझाना।", examples:["एक concept को आसान भाषा में समझाएँ, फिर textbook/real-life example दिखाएँ।","सीखे हुए point पर छोटा प्रश्न दें और बच्चे से कारण सहित उत्तर लें।","एक topic को पढ़ने के बाद 3-line summary और 5-question self-check कराएँ।"], practice:["मुख्य concept अपने शब्दों में समझाएँ।","3 आसान + 2 application questions हल करें।","एक छोटा revision/error-log बनाएं।"], activity:"एक छोटा concept चुनकर Learn → Example → Practice → Explain वाला mini learning sheet बनाएं।", mistakes:["सिर्फ परिभाषा याद करना।","उत्तर याद करके कारण/समझ न बता पाना।","revision और error correction छोड़ देना।"] },
    "English & Communication / अंग्रेज़ी एवं संचार": { focus:"शब्दावली, pronunciation, grammar in context, reading, listening, speaking, writing और real conversation के साथ भाषा सिखाना।", examples:["नया word देखें → pronunciation सुनें → meaning समझें → sentence में बोलें।","एक daily situation में question-answer का छोटा dialogue करें।","एक short paragraph पढ़कर main idea बताएं और फिर 2–3 sentences लिखें।"], practice:["5 नए words बोलकर sentences बनाएं।","एक short dialogue सुनकर repeat और paraphrase करें।","छोटा message/email लिखकर grammar और tone check करें।"], activity:"Listen → Repeat → Speak → Write चार-step communication practice करें।", mistakes:["Hindi से word-by-word translation करना।","pronunciation सुने बिना spelling अनुमान लगाना।","grammar सही रखते हुए भी context और polite tone भूल जाना।"] },
    "Digital Skills / डिजिटल कौशल": { focus:"device, software, files, internet, productivity, digital safety, privacy और online services को करके सीखना।", examples:["File बनाएं → सही नाम दें → folder में save करें → दोबारा खोलकर verify करें।","Search करें → source देखें → दूसरी reliable source से important information verify करें।","Unknown link/message मिले तो sender, URL और request check करके ही आगे बढ़ें।"], practice:["एक file/folder task पूरा करें।","एक safe search करके source verification लिखें।","एक cyber-safety scenario में सही action चुनें।"], activity:"एक guided digital task पूरा करके steps की screenshot/list बनाएं और बताएं कहाँ safety check किया।", mistakes:["unknown links/apps पर जल्दी click करना।","password/OTP/PIN share करना।","file save, backup या privacy settings check न करना।"] },
    "Career & Workplace / करियर एवं कार्यस्थल": { focus:"career information, self-assessment, job search, resume, interview, workplace communication, teamwork, time management और professional growth।", examples:["Job description पढ़ें → required skills निकालें → अपनी skills से match करें।","60-second self-introduction बोलें और clarity, accuracy तथा confidence check करें।","एक work task को priority, deadline और responsible person के साथ plan करें।"], practice:["एक career option का qualification-skill-roadmap बनाएं।","एक resume section या interview answer तैयार करें।","एक weekly task plan बनाकर review करें।"], activity:"एक वास्तविक career goal के लिए Skills → Evidence → Action → Review चार्ट बनाएं।", mistakes:["unverified job opportunity पर भरोसा करना।","resume में गलत/बढ़ा-चढ़ाकर information देना।","deadline, communication और follow-up को नज़रअंदाज़ करना।"] },
    "Skill Development / कौशल विकास": { focus:"tool knowledge, safety, step-by-step technique, quality, repeated practice, work records, customer need, costing और income application।", examples:["Tool पहचानें → safety rule समझें → demonstration देखें → supervised practice करें।","एक finished product/service में measurement, quality और finishing check करें।","cost निकालें → reasonable price समझें → customer feedback लें।"], practice:["एक skill step को 3 बार सही तरीके से दोहराएँ।","अपने काम की quality checklist से जाँच करें।","एक छोटा product/service costing exercise करें।"], activity:"एक practical mini-project बनाकर raw material, steps, time, quality और final result record करें।", mistakes:["safety step छोड़कर सीधे काम शुरू करना।","एक बार practice करके skill mastered मान लेना।","quality, cost और customer requirement का record न रखना।"] },
    "Women & Child Development / महिला एवं बाल विकास": { focus:"सम्मान, समानता, शिक्षा, health, nutrition, safety, child protection, participation, economic empowerment और support/referral की समझ।", examples:["किसी situation में dignity, safety और equality से सही response पहचानें।","बच्चे की learning/health need देखकर supportive और non-judgmental action चुनें।","SHG/skill activity में saving, record और collective decision का example देखें।"], practice:["safe/unsafe situations पहचानें।","एक rights-and-responsibility scenario पर कारण सहित उत्तर दें।","support लेने के trusted person/service pathway की practice करें।"], activity:"एक Rights → Safety → Support → Action scenario card हल करें और respectful response बोलें।", mistakes:["victim/blame language इस्तेमाल करना।","privacy और consent की अनदेखी करना।","हर समस्या का समाधान स्वयं करने की कोशिश करना जब qualified/support service जरूरी हो।"] },
    "Health / स्वास्थ्य": { focus:"health literacy, prevention, nutrition, hygiene, disease awareness, safe wellbeing practices, warning signs और qualified healthcare/support तक पहुँच।", examples:["Healthy और risky habit को compare करके prevention step बताएं।","किसी health claim को reliable source से verify करें; self-diagnosis न करें।","हाथ स्वच्छता, safe food/water या basic wellbeing routine का सही sequence दिखाएँ।"], practice:["एक healthy routine checklist बनाएं।","3 myths/facts को reliable information से check करें।","किस situation में professional help लेनी चाहिए, यह पहचानें।"], activity:"देखें → समझें → सुरक्षित कदम → जरूरत पर qualified help health scenario practice करें।", mistakes:["internet/अनुमान से diagnosis या treatment करना।","warning signs को लंबे समय तक ignore करना।","unsafe home remedy को proven treatment मान लेना।"] },
    "Environment / पर्यावरण": { focus:"ecosystems, air-water-soil, biodiversity, conservation, climate, energy, waste management और local environmental action।", examples:["किसी local resource को पहचानें → उसका उपयोग लिखें → conservation का तरीका बताएं।","कचरे को wet/dry/recyclable categories में अलग करके reason समझाएँ।","एक पौधे के लिए species, स्थान, पानी और long-term care की योजना बनाएं।"], practice:["घर/कक्षा का छोटा resource-use audit करें।","एक waste-segregation exercise करें।","local environmental problem के 3 practical actions लिखें।"], activity:"एक mini environment audit करें: Problem → Evidence → Action → Follow-up.", mistakes:["केवल awareness poster बनाकर action न करना।","हर जगह एक ही plantation/waste solution मान लेना।","result/maintenance की monitoring न करना।"] },
    "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास": { focus:"soil, seed, season, crop planning, irrigation, nutrition, pest awareness, livestock, post-harvest, farm records, markets और sustainable rural livelihoods।", examples:["मिट्टी की condition देखें → crop requirement से compare करें → planning करें।","seed/planting activity में spacing, depth और पानी की जरूरत समझें।","crop cost, yield और market price के आधार पर simple farm record बनाएं।"], practice:["एक crop का season-to-harvest plan बनाएं।","water/input use का record करें।","एक local farm product के value-addition और market steps लिखें।"], activity:"खेत/स्थानीय आजीविका case study बनाएं: resources → practice → cost → result → improvement.", mistakes:["local soil/weather को बिना देखे एक ही practice लागू करना।","input और farm cost का record न रखना।","pest/disease में बिना सही पहचान के कोई treatment करना।"] },
    "Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य": { focus:"human dignity, equality, rights, duties, ethics, empathy, fairness, accountability, respectful dialogue और inclusion।", examples:["एक situation में समानता और समान अवसर का फर्क समझें।","conflict में आरोप के बजाय facts सुनकर respectful response बनाएं।","किसी decision के stakeholders, responsibility और possible impact लिखें।"], practice:["एक ethical dilemma के 2–3 options compare करें।","एक respectful disagreement sentence बोलें।","एक community issue के लिए rights + duties दोनों लिखें।"], activity:"स्थिति → तथ्य → मूल्य → विकल्प → जिम्मेदार action reflection card पूरा करें।", mistakes:["व्यक्ति को label करके समस्या को सरल मान लेना।","facts verify किए बिना आरोप लगाना।","rights की बात करते समय responsibilities और dignity भूल जाना।"] },
    "Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास": { focus:"disability diversity, dignity, accessibility, assistive support, functional rehabilitation, inclusive education और community participation।", examples:["किसी जगह की accessibility barriers पहचानें और practical improvement सुझाएँ।","learning task को अलग support देकर कैसे accessible बनाया जाए, यह दिखाएँ।","daily activity में व्यक्ति की independence और choice को सम्मान देते हुए support plan करें।"], practice:["एक accessibility checklist भरें।","inclusive communication के 5 respectful examples लिखें।","एक daily-function support plan बनाएं।"], activity:"घर/कक्षा/समुदाय के एक स्थान का accessibility walk-through करें और 3 सुधार सुझाएँ।", mistakes:["व्यक्ति की जरूरत पूछे बिना सहायता थोपना।","disability को केवल limitation मानना।","privacy, dignity और choice की अनदेखी करना।"] },
    "Animal Protection / पशु संरक्षण": { focus:"animal welfare, humane care, food-water-shelter, hygiene, observation, veterinary support, wildlife/bird protection और safe community action।", examples:["पशु के लिए food, clean water, shelter और safe handling checklist बनाएं।","असामान्य behaviour/health sign दिखे तो observation record करके appropriate veterinary support समझें।","wildlife/birds के habitat और human coexistence के safe तरीके पहचानें।"], practice:["daily animal-care checklist बनाएं।","safe/unsafe handling situations पहचानें।","एक habitat-protection action plan लिखें।"], activity:"स्थानीय पशु/पक्षी welfare observation करें; बिना छेड़छाड़ के findings और safe action record करें।", mistakes:["बीमार/घायल पशु का स्वयं इलाज करने की कोशिश करना।","rescue में अपनी safety और animal stress की अनदेखी करना।","wild animals को घर लाने या खिलाने को हमेशा सही मानना।"] },
    "Culture & Heritage / संस्कृति एवं विरासत": { focus:"local history, tangible/intangible heritage, language, literature, music, arts, traditions, documentation और responsible preservation।", examples:["किसी local heritage item/person/practice का source-based परिचय बनाएं।","लोकगीत/कहानी में भाषा, rhythm और cultural context पहचानें।","पुरानी photo/object/story को consent और context के साथ document करें।"], practice:["एक local heritage item पर 5 verified facts लिखें।","एक folk art/music element का short presentation दें।","heritage documentation card बनाएं।"], activity:"मेरी स्थानीय विरासत mini-project: पहचान → स्रोत → अर्थ → फोटो/नोट → संरक्षण सुझाव।", mistakes:["सुनी-सुनाई बात को verified history मान लेना।","cultural practice को बिना context के प्रस्तुत करना।","दूसरों की photo/story बिना consent share करना।"] },
    "Youth & Disaster Preparedness / युवा एवं आपदा तैयारी": { focus:"hazard awareness, warning systems, emergency kit, family/community plans, evacuation, safe response, relief, recovery और drills।", examples:["घर/कक्षा के hazards पहचानें और safe exit route दिखाएँ।","emergency kit में जरूरी items चुनें और उनका purpose बताएं।","mock drill में warning → move safely → assembly point → accountability sequence करें।"], practice:["family emergency contact card बनाएं।","एक evacuation route map करें।","एक disaster scenario में safe/unsafe actions पहचानें।"], activity:"छोटा mock-drill plan बनाएं और बाद में क्या अच्छा हुआ/क्या सुधारना है review करें।", mistakes:["panic में बिना plan के भागना।","unverified emergency information forward करना।","volunteer response में personal safety और coordination छोड़ देना।"] },
    "Personal Development / व्यक्तिगत विकास": { focus:"self-awareness, communication, emotional skills, habits, goals, decision-making, problem solving, confidence और continuous improvement।", examples:["एक goal को छोटे measurable steps में बदलें।","किसी difficult situation में pause → options → consequence → choice का उपयोग करें।","daily habit का tracker बनाकर एक सप्ताह बाद review करें।"], practice:["3 strengths और 2 improvement areas लिखें।","एक weekly goal और action plan बनाएं।","एक problem के कम से कम 3 solutions सोचें।"], activity:"Goal → Daily Action → Evidence → Review personal learning tracker बनाएं।", mistakes:["बहुत बड़ा अस्पष्ट goal बनाना।","progress measure किए बिना केवल motivation पर निर्भर रहना।","mistake को failure मानकर improvement रोक देना।"] },
    "NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान": { focus:"NGO purpose/governance, needs assessment, project design, budget, implementation, monitoring, evidence, reporting, compliance awareness और sustainability।", examples:["Community problem → evidence → objective → activity → indicator का logical chain बनाएं।","एक activity का budget item, quantity, unit cost और total निकालें।","photo/attendance/record जैसे evidence को activity और outcome से link करें।"], practice:["एक mini project concept note बनाएं।","simple budget और timeline तैयार करें।","3 indicators और evidence sources तय करें।"], activity:"एक छोटा project case बनाएं: Need → Objective → Activities → Budget → Indicators → Evidence → Report.", mistakes:["activity को outcome मान लेना।","बिना evidence के impact claim करना।","budget/records/documentation को बाद के लिए छोड़ देना।"] }
  // Knowledge/subject fallback kept syntax-safe for Vite/esbuild builds.
  }[subject.category] || {focus:"इस विषय को definition से आगे concept, demonstration, multiple examples, guided practice, independent practice, application और assessment के साथ सीखें।",examples:["एक आसान example देखें और उसका कारण समझाएँ।","दूसरा नया example स्वयं बनाकर compare करें।","real-life situation में concept का उपयोग पहचानें।"],practice:["3 key points बिना notes लिखें।","एक guided और एक independent task करें।","अपने answer का self-check करें।"],activity:"इस topic पर छोटा practical task करें और result को 3–5 points में explain करें।",mistakes:["सिर्फ heading/definition याद करना।","example को बिना समझे copy करना।","practice के बाद review न करना。"]});

  const topic = clean;
  const body = subjectName + ' में "' + topic + '" को केवल definition की तरह नहीं, बल्कि ' + domainGuide.focus;
  const check = [
    {question:subjectName + ' में "' + topic + '" सीखते समय सबसे जरूरी क्या है?',options:["Concept समझना, examples देखना, practice करना और application करना","केवल heading याद करना","बिना context अनुमान लगाना","practice छोड़ देना"],answer:0},
    {question:'"' + topic + '" समझने का practical प्रमाण क्या होगा?',options:["नया example देखकर/करके सही कारण समझा पाना","सिर्फ title दोहराना","notes की line copy करना","बिना समझे answer चुनना"],answer:0},
    {question:"सीखने के बाद अगला कदम क्या होना चाहिए?",options:["Self-check, गलती सुधारना और फिर revision करना","गलत answer छोड़ देना","source/context check न करना","केवल certificate देखना"],answer:0}
  ];

  return [
    label,
    body,
    {
      objectives:[
        '"' + topic + '" का अर्थ, मुख्य parts और ' + subjectName + ' में उसका उद्देश्य समझना।',
        topic + ' से जुड़े examples देखकर सही और गलत application में अंतर करना।',
        topic + ' को guided practice के बाद नए real-life/subject situation में लागू करना।'
      ],
      content:{
        easyExplanation:"📖 सरल समझ / Simple meaning: " + topic + " को पहले आसान भाषा में समझें, फिर " + subjectName + " के वास्तविक context से जोड़ें।",
        deepUnderstanding:"🧠 गहरी समझ / Deep understanding: " + topic + " के पीछे कारण, प्रक्रिया, सही उपयोग, सीमाएँ और context समझें। खुद से पूछें—क्या है, क्यों है, कब उपयोग होगा और कैसे जाँचेंगे?",
        whyItMatters:"🎯 क्यों जरूरी है / Why it matters: " + topic + " की समझ " + subjectName + " में knowledge को practical capability में बदलती है।",
        keyPoints:[topic,moduleTitle,...domainGuide.focus.split("।").slice(0,2)],
        examples:domainGuide.examples.map((x,i)=>"उदाहरण " + (i+1) + ": " + x),
        steps:["🎯 उद्देश्य स्पष्ट करें / Goal समझें","📖 concept और vocabulary सीखें","👀 teacher/demo या visual example देखें","🔊 सुनकर/बोलकर key idea दोहराएँ","🛠️ guided practice करें","✍️ independent task करें","🔎 answer/result और method जाँचें","🔄 गलती सुधारें और revision करें"],
        practicalApplication:"🏠 व्यावहारिक उपयोग / Practical application: " + domainGuide.activity,
        memoryHook:"🧠 याद रखें / Remember: समझो → देखो/सुनो → उदाहरण → करो → जाँचो → समझाकर बताओ।",
        commonMistakes:domainGuide.mistakes,
        summary:"📌 सार / Summary: " + topic + " को समझने का लक्ष्य " + subjectName + " में सही knowledge, practice और responsible application विकसित करना है।"
      },
      practice:[...domainGuide.practice,"🗣️ किसी साथी/परिजन को इस topic का एक example और उसका कारण समझाएँ।","🔁 notes बंद करके दोबारा एक छोटा task करें।"],
      activity:"🎯 गतिविधि / Activity: " + domainGuide.activity,
      knowledgeCheck:check,
      reflection:["आज मैंने इस topic के बारे में क्या नया समझा?","मैंने कौन-सा example खुद करके देखा?","कहाँ गलती हुई और अगली बार उसे कैसे सुधारूँगा/सुधारूँगी?"]
    }
  ];
};


const formatBilingual = (text) => {
  if (typeof text !== "string") return text;
  const parts = text.split(" / ");
  if (parts.length < 2) return text;
  return parts.slice(0, -1).join(" / ") + " (" + parts[parts.length - 1].trim() + ")";
};

// Renders authored lesson notes: blank-line paragraphs, "- " bullets and
// **bold** spans. Plain strings without markup render as a single paragraph.
const LessonNotes = ({ text, className }) => {
  if (!text) return null;
  const lines = String(text).split("\n");
  const blocks = [];
  let list = null;
  const inline = (s) => s.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-black text-[#002344]">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) { if (list) { blocks.push(<ul key={"u" + i} className="list-disc space-y-1 pl-5">{list}</ul>); list = null; } return; }
    if (line.startsWith("- ")) { (list = list || []).push(<li key={i}>{inline(line.slice(2))}</li>); return; }
    if (list) { blocks.push(<ul key={"u" + i} className="list-disc space-y-1 pl-5">{list}</ul>); list = null; }
    blocks.push(<p key={i} className="leading-8">{inline(line)}</p>);
  });
  if (list) blocks.push(<ul key="u-end" className="list-disc space-y-1 pl-5">{list}</ul>);
  return <div className={className}>{blocks}</div>;
};

const buildTopicModules = (subject) => {
  const profile = getSubjectProfile(subject);
  return profile.modules.map((module, mi) => {
    const moduleTitle = module[0];
    const lessonLabels = module[1];
    return {
      id: subject.id + "-module-" + (mi + 1),
      title: profile.icon + " " + formatBilingual(moduleTitle),
      subtitle: "🎯 इस module में " + subject.en + " के " + moduleTitle.replace(/\/.*/, "").trim() + " से जुड़े वास्तविक concepts, examples, practice और application सीखें।",
      lessons: lessonLabels.map((label, li) => {
        const lesson = makeRichSubjectLesson(subject, moduleTitle, label, mi, li);
        lesson[0] = formatBilingual(lesson[0]);
        return lesson;
      })
    };
  });
};

// Subjects that still use the generated topic blueprint (i.e. NOT one of the
// hand-authored master courses, Knowledge World, education, office skills or
// structured courses). These are the cards this upgrade lifts to a Master Course.
const isGenericTopicSubject = (subject) => {
  if (!subject) return false;
  if (isTimeCalendarSubject(subject) || isFruitsSubject(subject) || isVocabularySubject(subject) || isTreesForestsSubject(subject)) return false;
  if (isKnowledgeWorldSubject(subject)) return false;
  if (isEducationSubject(subject) || isOfficeSkillsSubject(subject)) return false;
  if (hasStructuredCourse(subject)) return false;
  if (/^primary-education$/.test(subject.id) || /primary education|प्राथमिक शिक्षा/i.test(subject.en + " " + subject.hi)) return false;
  if (/secondary education|माध्यमिक शिक्षा/i.test(subject.en + " " + subject.hi)) return false;
  return true;
};

// Stable chapter ids for a generic subject: subject.id + "-c<globalIndex>".
// Keeping the global order lets legacy numeric progress migrate onto ids.
const curriculumChapterIds = (subject) => {
  const profile = getSubjectProfile(subject);
  const ids = [];
  profile.modules.forEach((m) => (m[1] || []).forEach(() => ids.push(subject.id + "-c" + ids.length)));
  return ids;
};

// Chapter-id list for any subject rendered through the generated/Knowledge World
// master path — used to migrate legacy numeric progress onto stable ids.
function curriculumChapterIdsFor(subject) {
  if (isKnowledgeWorldSubject(subject)) {
    const kwc = knowledgeWorldToMasterCourse(subject, getKnowledgeWorldCourse(subject));
    return kwc ? kwc.modules.flatMap((m) => m.chapters.map((c) => c.id)) : [];
  }
  if (isOfficeSkillsSubject(subject) && OFFICE_SKILLS_CONTENT[subject.en]) {
    const oc = officeToMasterCourse(subject);
    return oc ? oc.modules.flatMap((m) => m.chapters.map((c) => c.id)) : [];
  }
  return curriculumChapterIds(subject);
}

// Turn a generated topic profile + subject content into the Master Course shape.
const curriculumToMasterCourse = (subject) => {
  const profile = getSubjectProfile(subject);
  const content = SUBJECT_CONTENT_ALL[subject.en] || {};
  const modules = profile.modules;
  const chapterMeta = [];
  let gi = 0;
  modules.forEach((m, mi) => (m[1] || []).forEach((label, li) => { chapterMeta.push({ mi, li, label, moduleTitle: m[0], id: subject.id + "-c" + gi }); gi++; }));

  const chapters = chapterMeta.map((cm, idx) => {
    const lesson = makeRichSubjectLesson(subject, cm.moduleTitle, cm.label, cm.mi, cm.li);
    const d = (lesson && lesson[2]) || {};
    const c = d.content || {};
    const clean = String(cm.label || "").replace(/^[^\p{L}\p{N}]+/u, "");
    const check = (c.knowledgeCheck || d.knowledgeCheck || [])[0];
    const blocks = [
      { t: "note", k: "goal", title: "इस chapter का लक्ष्य / Goal", items: d.objectives || [] },
      { t: "p", x: lesson[1] || c.easyExplanation || "" },
      { t: "note", k: "concept", title: "गहरी समझ / Deep understanding", x: c.deepUnderstanding },
      { t: "note", k: "info", title: "क्यों जरूरी है / Why it matters", x: c.whyItMatters },
      { t: "h", x: "मुख्य बिंदु / Key points" },
      { t: "ul", items: c.keyPoints || [] },
      { t: "h", x: "उदाहरण / Examples" },
      { t: "ul", items: c.examples || [] },
      { t: "h", x: "सीखने के चरण / Steps" },
      { t: "ol", items: c.steps || [] },
      { t: "note", k: "tip", title: "व्यावहारिक उपयोग / Practical application", x: c.practicalApplication },
      { t: "note", k: "remember", title: "याद रखें / Memory hook", x: c.memoryHook },
      { t: "note", k: "warn", title: "सामान्य गलतियाँ / Common mistakes", items: c.commonMistakes || [] },
      { t: "act", title: "गतिविधि / Activity", x: d.activity || c.practicalApplication, items: d.practice || [] },
      check ? { t: "note", k: "goal", title: "स्वयं जाँचें / Self-check", x: check.question, items: check.options } : null,
      { t: "note", k: "info", title: "सार / Summary", x: c.summary },
    ].filter(Boolean);
    return { id: cm.id, number: idx + 1, title: clean, titleHi: String(cm.label).split(" / ")[1] || "", icon: (clean.match(/^\p{Emoji}/u) || ["📘"])[0], blocks };
  });

  // One mastery question per chapter (first knowledge check), up to 10.
  const masteryQuiz = [];
  for (const cm of chapterMeta) {
    if (masteryQuiz.length >= 10) break;
    const lesson = makeRichSubjectLesson(subject, cm.moduleTitle, cm.label, cm.mi, cm.li);
    const d = (lesson && lesson[2]) || {};
    const c = d.content || {};
    const q = (c.knowledgeCheck || d.knowledgeCheck || [])[0];
    if (q) masteryQuiz.push({ q: q.question, options: q.options, answer: q.answer, explain: q.explain || (q.options?.[q.answer] ? q.options[q.answer] + " सही उत्तर है।" : "") });
  }
  if (masteryQuiz.length < 5 && Array.isArray(content.quiz)) {
    for (const q of content.quiz) { if (masteryQuiz.length >= 10) break; masteryQuiz.push({ q: q.question, options: q.options, answer: q.answer, explain: q.options?.[q.answer] ? q.options[q.answer] + " सही उत्तर है।" : "" }); }
  }

  const moduleList = modules.map((m, mi) => ({
    id: subject.id + "-cm-" + (mi + 1),
    title: String(m[0]).split(" / ")[0],
    titleHi: String(m[0]).split(" / ")[1] || "",
    icon: profile.icon || "📘",
    chapters: chapters.filter((_, i) => chapterMeta[i].mi === mi),
  }));

  const focus = content.focus || subject.intro || ("इस विषय को समझ, उदाहरण और अभ्यास के साथ सीखें।");

  return {
    meta: {
      icon: profile.icon || "📘",
      title: [subject.en, subject.hi],
      level: subject.level || "Foundation → Intermediate",
      tag: subject.category,
      tagline: focus.length > 120 ? focus.slice(0, 118) + "…" : focus,
      heroSubtitle: subject.intro || focus,
    },
    overview: {
      what: content.focus || subject.intro || focus,
      why: "यह ज्ञान " + subject.en + " में रोज़मर्रा की समझ, सही निर्णय और practical capability के लिए जरूरी है।",
      where: "घर, स्कूल, कार्यस्थल और रोज़मर्रा की वास्तविक स्थितियों में।",
      outcome: "Learner " + subject.en + " के मुख्य concepts समझेगा, उदाहरण देखेगा, अभ्यास करेगा और नई स्थितियों में लागू कर सकेगा।",
    },
    courseStart: {
      title: "इस course को कैसे सीखें",
      blocks: [
        { t: "p", x: focus },
        { t: "note", k: "goal", title: "सीखने का लक्ष्य / Outcome", x: "अंत तक हर module के concepts, examples और practice को स्वयं समझा और कर पाएँ।" },
        { t: "note", k: "tip", title: "सीखने का flow", x: "हर chapter में: Goal → Concept → Example → Steps → Activity → Practice → Self-check → Revision।" },
      ],
    },
    modules: moduleList,
    revision: {
      title: "पूरा course एक नज़र में",
      groups: [
        ...(Array.isArray(content.revision) ? [{ title: "🔄 याद रखें / Revise", items: content.revision }] : []),
        ...(Array.isArray(content.concepts) ? [{ title: "🧠 मुख्य अवधारणाएँ / Concepts", items: content.concepts }] : []),
        ...(Array.isArray(content.keywords) ? [{ title: "🔑 मुख्य शब्द / Key words", items: content.keywords }] : []),
      ].filter((g) => g.items.length),
    },
    mastery: {
      title: "Final Test / अंतिम परीक्षा",
      note: "इस course के modules से चुने गए प्रश्न।",
      tasks: moduleList.map((m) => ({ icon: m.icon, title: m.title, x: (modules.find((x) => String(x[0]).startsWith(m.title))?.[1]) || "" })),
      quiz: masteryQuiz,
    },
    outcomeIntro: "इस course के बाद learner:",
    outcome: [content.practical, ...(content.concepts || []).slice(0, 4)].filter(Boolean),
    outcomeClose: "समझ + उदाहरण + अभ्यास + जाँच + revision — यही असली mastery है।",
  };
};

// Office Skills: real authored content (officeSkillsContent.js) rendered as a
// Master Course. Falls back to the shell modules when a course has no content.
const officeToMasterCourse = (subject) => {
  const shell = getOfficeSkillsCourse(subject);
  const content = OFFICE_SKILLS_CONTENT[subject.en];
  if (!shell || !content) return null;
  let gi = 0;
  const modules = content.modules.map((m, mi) => ({
    id: subject.id + "-om-" + (mi + 1),
    title: String(m.title).split(" / ")[0],
    titleHi: String(m.title).split(" / ")[1] || "",
    icon: shell.icon || "🏢",
    chapters: m.topics.map((t) => {
      const clean = String(t.title).replace(/^[^\p{L}\p{N}]+/u, "");
      const id = subject.id + "-c" + gi; gi++;
      return {
        id, number: 0, title: clean, titleHi: "", icon: (clean.match(/^\p{Emoji}/u) || [shell.icon || "🏢"])[0],
        blocks: [
          { t: "note", k: "goal", title: "इस chapter का लक्ष्य", items: ["इस topic को समझना, उदाहरण देखना और खुद करके सीखना।"] },
          { t: "p", x: t.learn },
          { t: "ex", title: "Example / उदाहरण", x: t.example },
          { t: "act", title: "Activity / अभ्यास", x: t.activity },
          { t: "note", k: "tip", title: "स्वयं जाँचें / Self-check", x: t.quiz.q, items: t.quiz.options },
          { t: "note", k: "remember", title: "सही उत्तर", x: t.quiz.options[t.quiz.answer] + " — " + t.quiz.explain },
        ],
      };
    }),
  }));
  let n = 0; modules.forEach((m) => m.chapters.forEach((c) => { c.number = ++n; }));

  const mastery = (content.mastery || []).map(([q, options, answer, explain]) => ({ q, options, answer, explain }));
  const firstQuiz = content.modules.flatMap((m) => m.topics).slice(0, 10).map((t) => ({ q: t.quiz.q, options: t.quiz.options, answer: t.quiz.answer, explain: t.quiz.explain }));

  return {
    meta: { icon: shell.icon || "🏢", title: [subject.en, subject.hi], level: shell.level, tag: OFFICE_SKILLS_CATEGORY, tagline: content.tagline, heroSubtitle: shell.overview.what },
    overview: shell.overview,
    courseStart: {
      title: "इस course को कैसे सीखें",
      blocks: [
        { t: "p", x: content.tagline },
        { t: "note", k: "goal", title: "सीखने के बाद / Outcome", x: shell.overview.outcome },
        { t: "note", k: "info", title: "कहाँ दिखता है / Where", x: shell.overview.where },
        { t: "note", k: "tip", title: "सीखने का flow", x: "हर chapter में: Learn → Example → Activity → Self-check।" },
      ],
    },
    modules,
    revision: { title: "पूरा course एक नज़र में", groups: [
      ...(content.glossary ? [{ title: "📖 मुख्य शब्द / Key Words", items: content.glossary.map(([term, hi, meaning]) => term + (hi ? " (" + hi + ")" : "") + (meaning ? " — " + meaning : "")) }] : []),
      ...(content.facts ? [{ title: "💡 Did You Know?", items: content.facts }] : []),
    ].filter((g) => g.items.length) },
    mastery: { title: "Final Test / अंतिम परीक्षा", note: "इस course के modules से चुने गए प्रश्न।", tasks: modules.map((m) => ({ icon: m.icon, title: m.title, x: "" })), quiz: [...mastery, ...firstQuiz].slice(0, 10) },
    outcomeIntro: "इस course के बाद learner:",
    outcome: shell.outcomes && shell.outcomes.length ? shell.outcomes : [content.tagline],
    outcomeClose: "अभ्यास + वास्तविक उदाहरण + जाँच — यही असली office skill है।",
  };
};

// Knowledge World: turns a subject-specific KW course into the module/lesson
// structure the course UI renders. Each topic becomes a rich lesson built from
// that topic's own learn / example / activity / quiz material.
const buildKnowledgeWorldModules = (subject) => {
  const course = getKnowledgeWorldCourse(subject);
  if (!course) return null;
  return course.modules.map((module, mi) => ({
    id: subject.id + "-kw-module-" + (mi + 1),
    title: course.icon + " " + formatBilingual(module.title),
    subtitle: module.summary,
    lessons: module.topics.map((topic) => {
      const t = topic.title;
      const plain = t.split(" / ")[0].trim();
      const { question: q, options, answer, explain } = topic.quiz;
      return [formatBilingual(t), topic.learn, {
        objectives: [
          plain + " को " + subject.en + " के संदर्भ में समझना।",
          "इसका एक वास्तविक उदाहरण पहचानना और समझाना।",
          "activity करके सीखी बात को लागू करना।"
        ],
        content: {
          easyExplanation: topic.learn,
          deepUnderstanding: explain,
          whyItMatters: subject.en + " में यह ज्ञान रोज़मर्रा की समझ और सही निर्णय में मदद करता है।",
          keyPoints: [plain, module.title.split(" / ")[0], subject.en],
          examples: [topic.example],
          practicalApplication: topic.activity,
          commonMistakes: [
            plain + " को केवल नाम/definition तक सीमित रखना।",
            "example और real-life application न जोड़ना।"
          ],
          summary: topic.learn,
          knowledgeCheck: [{ question: q, options, answer, explain }]
        },
        practice: [topic.activity],
        activity: topic.activity,
        reflection: [
          "आज मैंने " + plain + " के बारे में क्या नया सीखा?",
          "इसका एक और उदाहरण कहाँ मिलेगा?",
          "कौन-सी बात दोहरानी या अभ्यास करनी है?"
        ]
      }];
    })
  }));
};

// Education: turns a subject-specific Education course into the module/lesson
// structure the course UI renders. Same proven shape as Knowledge World, but
// Education subjects get their own subject-specific content (no generic filler).
const buildEducationModules = (subject) => {
  const course = getEducationCourse(subject);
  if (!course) return null;
  return course.modules.map((module, mi) => ({
    id: subject.id + "-edu-module-" + (mi + 1),
    title: course.icon + " " + formatBilingual(module.title),
    subtitle: module.summary,
    lessons: module.topics.map((topic) => {
      const t = topic.title;
      const plain = t.split(" / ")[0].trim();
      const { question: q, options, answer, explain } = topic.quiz;
      // Enriched subjects author the full Primary-level field set on each topic
      // (body, objectives, deep, why, examples, practice, mistakes, summary).
      // Subjects that are not yet enriched fall back to the generic shape.
      const rich = Boolean(topic.body && topic.objectives && topic.mistakes);
      return [formatBilingual(t), rich ? topic.body : topic.learn, {
        objectives: rich ? topic.objectives : [
          plain + " को " + subject.en + " के संदर्भ में समझना।",
          "इसका एक वास्तविक उदाहरण पहचानना और समझाना।",
          "activity करके सीखी बात को लागू करना।"
        ],
        content: {
          easyExplanation: topic.learn,
          deepUnderstanding: rich ? topic.deep : explain,
          whyItMatters: rich ? topic.why : subject.en + " में यह ज्ञान सीखने, निर्णय लेने और आगे बढ़ने में मदद करता है।",
          keyPoints: rich ? (topic.keyPoints || [plain, module.title.split(" / ")[0], subject.en]) : [plain, module.title.split(" / ")[0], subject.en],
          examples: rich ? topic.examples : [topic.example],
          steps: rich ? (module.steps || undefined) : undefined,
          checks: rich ? (module.checks || undefined) : undefined,
          practicalApplication: topic.activity,
          commonMistakes: rich ? topic.mistakes : [
            plain + " को केवल नाम/definition तक सीमित रखना।",
            "example और real-life application न जोड़ना।"
          ],
          summary: rich ? topic.summary : topic.learn,
          knowledgeCheck: [{ question: q, options, answer, explain }]
        },
        practice: rich ? topic.practice : [topic.activity],
        activity: topic.activity,
        reflection: rich ? (topic.reflection || [
          "आज मैंने " + plain + " के बारे में क्या नया सीखा?",
          "इसका एक और उदाहरण कहाँ मिलेगा?",
          "कौन-सी बात दोहरानी या अभ्यास करनी है?"
        ]) : [
          "आज मैंने " + plain + " के बारे में क्या नया सीखा?",
          "इसका एक और उदाहरण कहाँ मिलेगा?",
          "कौन-सी बात दोहरानी या अभ्यास करनी है?"
        ]
      }];
    })
  }));
};

// Office Skills: card-first subjects. Detailed lessons arrive later, so this
// builder turns the ready-to-fill shell into the same module/lesson structure
// the course UI renders (Getting Started → Course Structure → Detailed Lessons).
const buildOfficeSkillsModules = (subject) => {
  const course = getOfficeSkillsCourse(subject);
  if (!course) return null;
  return course.modules.map((module, mi) => ({
    id: subject.id + "-office-module-" + (mi + 1),
    title: course.icon + " " + formatBilingual(module.title),
    subtitle: module.summary,
    lessons: module.topics.map((topic) => {
      const t = topic.title;
      const plain = t.split(" / ")[0].trim();
      const { question: q, options, answer, explain } = topic.quiz;
      return [formatBilingual(t), topic.learn, {
        objectives: course.outcomes,
        content: {
          easyExplanation: topic.learn,
          deepUnderstanding: course.overview.what,
          whyItMatters: course.overview.why,
          keyPoints: [plain, course.level, subject.en],
          examples: [topic.example],
          practicalApplication: topic.activity,
          commonMistakes: [
            plain + " को केवल नाम तक सीमित रखना।",
            "practice और real-life application न जोड़ना।"
          ],
          summary: topic.learn,
          knowledgeCheck: [{ question: q, options, answer, explain }]
        },
        practice: [topic.activity],
        activity: topic.activity,
        reflection: [
          "आज मैंने " + plain + " के बारे में क्या सीखा?",
          "इसका उपयोग मैं अपने office काम में कहाँ करूँगा?",
          "कौन-सी बात दोहरानी या अभ्यास करनी है?"
        ]
      }];
    })
  }));
};

// Single source of truth for a subject's module structure. Both the lesson viewer
// and the dashboard progress summary use this so that progress is tracked
// consistently for structured courses, Secondary Education and topic-based subjects.
const resolveSubjectModules = (subject, structuredCourse, buildStructuredModules, secondaryModules) =>
  secondaryModules || (structuredCourse ? buildStructuredModules() : buildTopicModules(subject));

const SUBJECT_MODULES_CACHE = new Map();
const getSubjectModules = (subject) => {
  if (SUBJECT_MODULES_CACHE.has(subject.id)) return SUBJECT_MODULES_CACHE.get(subject.id);
  if (isTimeCalendarSubject(subject)) {
    const result = { total: TIME_CALENDAR_COURSE.modules.reduce((n, m) => n + m.chapters.length, 0), moduleCount: TIME_CALENDAR_COURSE.modules.length, hasStructured: true };
    SUBJECT_MODULES_CACHE.set(subject.id, result);
    return result;
  }
  if (isFruitsSubject(subject)) {
    const result = { total: FRUITS_COURSE.modules.reduce((n, m) => n + m.chapters.length, 0), moduleCount: FRUITS_COURSE.modules.length, hasStructured: true };
    SUBJECT_MODULES_CACHE.set(subject.id, result);
    return result;
  }
  if (isVocabularySubject(subject)) {
    const result = { total: VOCABULARY_COURSE.modules.reduce((n, m) => n + m.chapters.length, 0), moduleCount: VOCABULARY_COURSE.modules.length, hasStructured: true };
    SUBJECT_MODULES_CACHE.set(subject.id, result);
    return result;
  }
  if (isTreesForestsSubject(subject)) {
    const result = { total: TREES_FORESTS_COURSE.modules.reduce((n, m) => n + m.chapters.length, 0), moduleCount: TREES_FORESTS_COURSE.modules.length, hasStructured: true };
    SUBJECT_MODULES_CACHE.set(subject.id, result);
    return result;
  }
  if (isKnowledgeWorldSubject(subject) || isGenericTopicSubject(subject) || (isOfficeSkillsSubject(subject) && OFFICE_SKILLS_CONTENT[subject.en])) {
    const mc = isKnowledgeWorldSubject(subject)
      ? knowledgeWorldToMasterCourse(subject, getKnowledgeWorldCourse(subject))
      : (isOfficeSkillsSubject(subject) ? officeToMasterCourse(subject) : curriculumToMasterCourse(subject));
    const result = { total: mc.modules.reduce((n, m) => n + m.chapters.length, 0), moduleCount: mc.modules.length, hasStructured: true };
    SUBJECT_MODULES_CACHE.set(subject.id, result);
    return result;
  }
  const structuredCourse = hasStructuredCourse(subject) ? resolveStructuredCourse(subject).course : null;
  const isSecondaryEducation = /secondary education|माध्यमिक शिक्षा/i.test(subject.en + " " + subject.hi);
  const eduModules = isEducationSubject(subject) ? buildEducationModules(subject) : null;
  const secondaryModules = !eduModules && isSecondaryEducation
    ? SECONDARY_EDUCATION_MODULES.map((module, mi) => ({
        id: subject.id + "-secondary-module-" + (mi + 1),
        title: formatBilingual(module.title),
        lessons: module.lessons.map((label, li) => makeRichSubjectLesson(subject, module.title, label, mi, li))
      }))
    : null;
  const buildStructuredModules = () => structuredCourse
    ? structuredCourse.modules.map((m) => ({
        title: formatBilingual(m.title.en + " / " + m.title.hi),
        lessons: m.lessons.map((l) => [l.title.en + " / " + l.title.hi, l.content?.easyExplanation || ""])
      }))
    : buildTopicModules(subject);
  const kwModules = isKnowledgeWorldSubject(subject) ? buildKnowledgeWorldModules(subject) : null;
  const officeModules = isOfficeSkillsSubject(subject) ? buildOfficeSkillsModules(subject) : null;
  const resolved = resolveSubjectModules(subject, structuredCourse, buildStructuredModules, eduModules || secondaryModules || kwModules || officeModules);
  const total = resolved.reduce((n, m) => n + (m.lessons?.length || 0), 0);
  const result = { total, moduleCount: resolved.length, hasStructured: Boolean(structuredCourse) };
  SUBJECT_MODULES_CACHE.set(subject.id, result);
  return result;
};

function speakLessonText(text) {
  try {
    if (!("speechSynthesis" in window)) {
      window.alert("Audio is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = /[\u0900-\u097F]/.test(clean) ? "hi-IN" : "en-IN";
    utterance.rate = 0.82;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

function PrimaryLessonVisual({ lesson }) {
  const detail = lesson.detail?.content || {};
  const examples = detail.examples || [];
  const practice = lesson.detail?.practice || [];
  const title = lesson.title || "";
  const cleanTitle = title.split(" / ")[0].trim();
  const isLetters = /letters|sounds|अक्षर|ध्वनि|alphabet|वर्णमाला/i.test(title);
  const isNumbers = /numbers|counting|संख्या|गिनती|number sense|जोड़|घटाव|गुणा|भाग|fractions|भिन्न/i.test(title);
  const isLanguage = /hindi|english|शब्द|reading|writing|vocabulary|phonics|मात्रा|वाक्य|पठन|लेखन/i.test(title);

  const conceptSets = {
    letters: [
      ["🔤 A a", "🍎 Apple", "A → Apple"],
      ["🔤 B b", "⚽ Ball", "B → Ball"],
      ["🔤 C c", "🐱 Cat", "C → Cat"],
      ["🔤 D d", "🐶 Dog", "D → Dog"]
    ],
    numbers: [
      ["1️⃣ One", "🍎", "1 object = 1"],
      ["2️⃣ Two", "🍎🍎", "2 objects = 2"],
      ["3️⃣ Three", "🍎🍎🍎", "3 objects = 3"],
      ["🔟 Ten", "●●●●●●●●●●", "10 objects = 10"]
    ]
  };
  const cards = isLetters ? conceptSets.letters : isNumbers ? conceptSets.numbers : [];

  return <div className="mt-6 overflow-hidden rounded-[1.8rem] border-2 border-[#cfe3ef] bg-white shadow-lg">
    <div className="border-b-2 border-[#dbeaf2] bg-gradient-to-r from-[#fff7d6] via-[#eefaff] to-[#f5efff] p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#0f4c81]">Interactive Teaching Board / इंटरैक्टिव शिक्षण बोर्ड</div>
          <div className="mt-1 text-xl font-black text-[#002344]">👀 देखो → 🔊 सुनो → 👄 बोलो → 👉 पहचानो → ✍️ करो</div>
        </div>
        <button type="button" onClick={()=>speakLessonText([lesson.title,lesson.body,...examples,...practice].join(". "))} className="rounded-full bg-gradient-to-br from-[#0b3a63] to-[#001529] px-5 py-3 text-sm font-black text-white shadow-md">
          🔊 Listen All / सब सुनें
        </button>
      </div>
    </div>

    <div className="p-4 md:p-7">
      <div className="rounded-[1.5rem] border-2 border-white bg-gradient-to-br from-[#003366] via-[#0f4c81] to-[#007c91] p-5 text-center text-white shadow-inner md:p-8">
        <div className="text-sm font-bold text-white/80">Today we learn / आज हम सीखेंगे</div>
        <div className={(isLetters ? "text-6xl md:text-9xl " : isLanguage ? "text-4xl md:text-6xl " : "text-3xl md:text-5xl ")+"mt-2 font-black leading-tight tracking-tight"}>{cleanTitle}</div>
        <div className="mt-4 text-base font-black">🔊 सुनें • 👄 दोहराएँ • 👉 पहचानें • ✍️ करके सीखें</div>
      </div>

      {cards.length>0 && <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([big,visual,meaning],i)=><div key={i} className="rounded-[1.4rem] border-2 border-[#e4d9ff] bg-gradient-to-b from-white to-[#faf7ff] p-4 text-center shadow-sm">
          <div className="text-4xl font-black text-[#7b2cbf] md:text-5xl">{big}</div>
          <div className="my-3 text-3xl md:text-4xl">{visual}</div>
          <div className="text-base font-black text-[#002344]">{meaning}</div>
          <button type="button" onClick={()=>speakLessonText(big+" "+meaning)} className="mt-3 rounded-full bg-[#eef7fb] px-4 py-2 text-xs font-black text-[#002344]">🔊 बोलें</button>
        </div>)}
      </div>}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.4rem] border-2 border-[#d8eadf] bg-[#f4fff7] p-5">
          <div className="text-sm font-black uppercase tracking-widest text-[#177245]">📖 Concept / अवधारणा</div>
          <p className="mt-3 text-base font-semibold leading-7 text-zinc-700">{detail.easyExplanation || lesson.body}</p>
          {detail.deepUnderstanding && <p className="mt-3 rounded-xl bg-white p-3 text-sm leading-6 text-zinc-600">{detail.deepUnderstanding}</p>}
        </div>
        <div className="rounded-[1.4rem] border-2 border-[#f0dfc2] bg-[#fffaf0] p-5">
          <div className="text-sm font-black uppercase tracking-widest text-[#9a5b00]">🎯 Why & Goal / क्यों और लक्ष्य</div>
          <ul className="mt-3 space-y-2 text-sm font-bold leading-6 text-zinc-700">
            {(lesson.detail?.objectives || []).map((x,i)=><li key={i}>✅ {x}</li>)}
          </ul>
          {detail.whyItMatters && <p className="mt-3 text-sm leading-6 text-zinc-600">{detail.whyItMatters}</p>}
        </div>
      </div>

      {examples.length>0 && <div className="mt-6 rounded-[1.4rem] border-2 border-[#dbe3f7] bg-[#f8faff] p-5">
        <div className="text-sm font-black uppercase tracking-widest text-[#0f4c81]">🧩 Many Examples / कई उदाहरण</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {examples.map((x,i)=><div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f4fa] font-black text-[#002344]">{i+1}</div>
            <div className="flex-1 text-sm font-bold leading-6 text-zinc-700">{x}</div>
            <button type="button" onClick={()=>speakLessonText(x)} className="shrink-0 rounded-full bg-gradient-to-br from-[#0b3a63] to-[#001529] px-3 py-2 text-xs font-black text-white">🔊</button>
          </div>)}
        </div>
      </div>}

      <div className="mt-6 rounded-[1.4rem] border-2 border-[#e8d9d9] bg-[#fff8f8] p-5">
        <div className="text-sm font-black uppercase tracking-widest text-[#9d0208]">🪜 Step-by-Step / चरणबद्ध सीखना</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(detail.steps || ["🎯 उद्देश्य समझें","👀 उदाहरण देखें","🔊 सुनें और बोलें","✍️ स्वयं करें","🔎 उत्तर जाँचें","🔁 दोबारा अभ्यास करें"]).map((x,i)=><div key={i} className="rounded-xl bg-white p-4 text-sm font-black leading-6 text-zinc-700 shadow-sm"><span className="mr-2 text-[#d90429]">{i+1}.</span>{x}</div>)}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.4rem] border-2 border-[#dce8f5] bg-white p-5">
          <div className="text-sm font-black uppercase tracking-widest text-[#002344]">🎮 Do It / करके देखें</div>
          <ul className="mt-3 space-y-2 text-sm font-bold leading-6 text-zinc-700">{practice.slice(0,6).map((x,i)=><li key={i}>👉 {x}</li>)}</ul>
          {lesson.detail?.activity && <div className="mt-4 rounded-xl bg-[#eef7fb] p-4 text-sm font-bold leading-6 text-[#002344]">🎯 {lesson.detail.activity}</div>}
        </div>
        <div className="rounded-[1.4rem] border-2 border-[#e4e4e4] bg-[#fafafa] p-5">
          <div className="text-sm font-black uppercase tracking-widest text-[#463f3a]">🧠 Remember & Correct / याद रखें और सुधारें</div>
          {detail.memoryHook && <p className="mt-3 text-sm font-black leading-6 text-zinc-700">{detail.memoryHook}</p>}
          <ul className="mt-3 space-y-2 text-sm font-bold leading-6 text-zinc-700">{(detail.commonMistakes || []).map((x,i)=><li key={i}>{x}</li>)}</ul>
        </div>
      </div>

      {detail.knowledgeCheck && <div className="mt-6 rounded-[1.4rem] border-2 border-[#d9e7f0] bg-gradient-to-r from-[#f7fbff] to-[#fffdf5] p-5">
        <div className="text-sm font-black uppercase tracking-widest text-[#0f4c81]">❓ Quick Check / तुरंत जाँच</div>
        <div className="mt-4 space-y-3">
          {detail.knowledgeCheck.map((q,i)=><div key={i} className="rounded-xl bg-white p-4"><div className="text-sm font-black text-zinc-800">{i+1}. {q.question}</div><div className="mt-2 text-xs font-bold text-zinc-500">सोचकर उत्तर दें: {q.options?.join(" • ")}</div></div>)}
        </div>
      </div>}

      <div className="mt-6 rounded-[1.4rem] bg-gradient-to-br from-[#0b3a63] to-[#001529] p-5 text-center text-white">
        <div className="text-xs font-black uppercase tracking-widest text-white/70">🔁 Speak & Repeat / सुनें और दोहराएँ</div>
        <button type="button" onClick={()=>speakLessonText([cleanTitle,...examples].join(". "))} className="mt-3 rounded-full bg-white px-5 py-3 text-sm font-black text-[#002344]">🔊 फिर से सुनें और बोलें</button>
      </div>
    </div>
  </div>;
}

function LearningSubject({ subject, onBack }) {
  const progressKey = "ssf-learning-course-progress-" + subject.id;
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(progressKey) || "[]"); } catch { return []; }
  });
  const [activeLesson, setActiveLesson] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [finalResult, setFinalResult] = useState(() => {
    try { return JSON.parse(localStorage.getItem(progressKey + "-final") || "null"); } catch { return null; }
  });
  const [moduleAnswers, setModuleAnswers] = useState({});
  const [accountOpen, setAccountOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ fullName:"", email:"", confirmEmail:"", phone:"", password:"" });
  const [authStatus, setAuthStatus] = useState("idle");
  const [authError, setAuthError] = useState("");
  const [accountUser, setAccountUser] = useState(() => { try { return JSON.parse(localStorage.getItem("ssf-learning-account") || "null"); } catch { return null; } });
  const isPrimaryEducation = /^primary-education$/.test(subject.id) || /primary education|प्राथमिक शिक्षा/i.test(subject.en + " " + subject.hi);
  const [moduleResults, setModuleResults] = useState(() => {
    try { return JSON.parse(localStorage.getItem(progressKey + "-assessments") || "{}"); } catch { return {}; }
  });

  const structuredResolution = resolveStructuredCourse(subject);
  const structuredCourseId = structuredResolution.id;
  const structuredCourse = hasStructuredCourse(subject) ? structuredResolution.course : null;
  const kwCourse = isKnowledgeWorldSubject(subject) ? getKnowledgeWorldCourse(subject) : null;
  const eduCourse = isEducationSubject(subject) ? getEducationCourse(subject) : null;
  const officeCourse = isOfficeSkillsSubject(subject) ? getOfficeSkillsCourse(subject) : null;
  const isSecondaryEducation = /secondary education|माध्यमिक शिक्षा/i.test(subject.en + " " + subject.hi);
  const eduModules = eduCourse ? buildEducationModules(subject) : null;
  const officeModules = officeCourse ? buildOfficeSkillsModules(subject) : null;
  const secondaryModules = !eduModules && isSecondaryEducation
    ? SECONDARY_EDUCATION_MODULES.map((module, mi) => ({
        id: subject.id + "-secondary-module-" + (mi + 1),
        title: formatBilingual(module.title),
        subtitle: "इस module में " + module.title.split(" / ")[0] + " के core concepts, examples, practice, application और assessment को step-by-step सीखें।",
        lessons: module.lessons.map((label, li) => {
          const lesson = makeRichSubjectLesson(subject, module.title, label, mi, li);
          lesson[0] = formatBilingual(lesson[0]);
          return lesson;
        })
      }))
    : null;
  const buildStructuredModules = () => structuredCourse
    ? structuredCourse.modules.map((m) => ({
        title: formatBilingual(m.title.en + " / " + m.title.hi),
        subtitle: m.description,
        lessons: m.lessons.map((l) => [
          l.title.en + " / " + l.title.hi,
          l.content?.easyExplanation || "",
          l
        ])
      }))
    : buildTopicModules(subject);
  const modules = useMemo(
    () => resolveSubjectModules(
      subject,
      structuredCourse,
      buildStructuredModules,
      eduModules || secondaryModules || (isKnowledgeWorldSubject(subject) ? buildKnowledgeWorldModules(subject) : null) || officeModules
    ),
    [subject, structuredCourse, secondaryModules, eduModules]
  );

  // Flatten module lessons into the structure used by the active-lesson panel.
  // This is required for every course, including the generic courses that do not
  // have a flagship architecture entry yet.
  const lessons = modules.flatMap((module) => module.lessons.map((lesson) => ({
    module: module.title,
    title: lesson[0],
    body: lesson[1],
    detail: lesson[2] || null
  })));

  const structuredAssessmentPool = structuredCourse
    ? Object.values(
        isEnglishFromBasics(subject)
          ? ENGLISH_FROM_BASICS_ASSESSMENTS
          : (FLAGSHIP_COURSE_ASSESSMENTS && FLAGSHIP_COURSE_ASSESSMENTS[structuredCourseId]
              ? FLAGSHIP_COURSE_ASSESSMENTS[structuredCourseId]
              : COURSE_ASSESSMENTS?.[structuredCourseId] || {})
      ).flat()
    : [];
  const subjectQuiz = (SUBJECT_CONTENT_ALL[subject.en] && SUBJECT_CONTENT_ALL[subject.en].quiz) || [];
  const kwQuiz = kwCourse ? kwCourse.mastery.map((m) => ({ q: m.question, options: m.options, answer: m.answer })) : [];
  const eduQuiz = eduCourse ? eduCourse.mastery.map((m) => ({ q: m.question, options: m.options, answer: m.answer })) : [];
  const officeQuiz = officeCourse ? officeCourse.mastery.map((m) => ({ q: m.question, options: m.options, answer: m.answer })) : [];
  // Education, Knowledge World and Office Skills share the same rich course UI
  // (overview, modules, glossary, project, revision, mastery). `richCourse`
  // selects whichever applies so the sections below stay single-sourced.
  const richCourse = eduCourse || kwCourse || officeCourse;
  const richTopicCount = eduCourse ? educationTopicCount(eduCourse) : kwCourse ? knowledgeWorldTopicCount(kwCourse) : officeCourse ? officeTopicCount(officeCourse) : 0;
  const quizQuestions = structuredAssessmentPool.length
    ? structuredAssessmentPool.slice(0, 5).map(q => ({
        q: q.q || q.question,
        options: q.options || [],
        answer: typeof q.answer === "number" ? q.answer : 0
      }))
    : eduQuiz.length
      ? eduQuiz.slice(0, 5)
    : kwQuiz.length
      ? kwQuiz.slice(0, 5)
    : officeQuiz.length
      ? officeQuiz.slice(0, 5)
    : subjectQuiz.length
      ? subjectQuiz.slice(0, 5).map(q => ({ q: q.question, options: q.options, answer: q.answer }))
      : [
        {q:"अच्छी learning का उद्देश्य क्या है?", options:["समझकर और अभ्यास करके capability विकसित करना","केवल title याद करना","केवल video देखना","केवल certificate लेना"], answer:0},
        {q:"किसी concept को मजबूत करने का उपयोगी तरीका क्या है?", options:["Example + Practice + Review","बिना पढ़े अनुमान लगाना","बिना जाँचे जानकारी share करना","केवल एक definition याद करना"], answer:0},
        {q:"Current rules या schemes को कहाँ verify करना चाहिए?", options:["संबंधित official source","random forwarded message","unverified social post","anonymous screenshot"], answer:0},
        {q:"Practical learning में क्या महत्वपूर्ण है?", options:["सुरक्षित task, परिणाम और सुधार","केवल memorisation","बिना training high-risk action","दूसरे का work copy करना"], answer:0},
        {q:"Course पूरा करने के बाद अगला कदम क्या हो सकता है?", options:["Assessment, reflection और next learning path","सीखना बंद करना","बिना समझे certificate claim करना","सभी sources ignore करना"], answer:0}
      ];
  const completed = done.length;
  const total = lessons.length;
  const isRichLesson = isPrimaryEducation && /letters\s*&\s*sounds|अक्षर एवं ध्वनि/i.test(lessons[activeLesson]?.title || "");

  const progress = Math.round((completed / total) * 100);
  const moduleAssessments = structuredCourse
    ? structuredCourse.modules.map((m) => ({
        ...m,
        questions:
          (FLAGSHIP_COURSE_ASSESSMENTS?.[m.id] ||
            (isEnglishFromBasics(subject) ? ENGLISH_FROM_BASICS_ASSESSMENTS?.[m.id] : COURSE_ASSESSMENTS?.[structuredCourseId]?.[m.id]) ||
            m.assessment?.questions ||
            [])
      })).filter(m => m.questions.length)
    : [];
  const allLearningComplete = progress === 100;
  const modulePassCount = moduleAssessments.filter(m => moduleResults[m.id]?.passed).length;
  const moduleAssessmentComplete = moduleAssessments.length === 0 || modulePassCount === moduleAssessments.length;
  const finalAssessmentPassed = Boolean(finalResult?.passed);
  const certificateEligible = allLearningComplete && moduleAssessmentComplete && finalAssessmentPassed;
  const courseMeta = structuredCourse || (eduCourse ? {
    title: { en: subject.en, hi: subject.hi },
    level: eduCourse.level,
    learningHours: Math.max(1, Math.round(educationTopicCount(eduCourse) * 0.5)),
    version: "1.0",
    lastReviewed: "2026-10-03",
    audience: eduCourse.overview.what,
    prerequisites: ["किसी पूर्व ज्ञान की जरूरत नहीं — यह beginner से शुरू होता है।"],
    outcomes: [eduCourse.overview.outcome, eduCourse.overview.why, eduCourse.overview.where]
  } : kwCourse ? {
    title: { en: subject.en, hi: subject.hi },
    level: kwCourse.level,
    learningHours: Math.max(1, Math.round(knowledgeWorldTopicCount(kwCourse) * 0.5)),
    version: "1.0",
    lastReviewed: "2026-10-03",
    audience: kwCourse.overview.what,
    prerequisites: ["किसी पूर्व ज्ञान की जरूरत नहीं — यह beginner से शुरू होता है।"],
    outcomes: [kwCourse.overview.outcome, kwCourse.overview.why, kwCourse.overview.where]
  } : officeCourse ? {
    title: { en: subject.en, hi: subject.hi },
    level: officeCourse.level,
    description: officeCourse.learningLine,
    learningHours: Math.max(1, Math.round(officeTopicCount(officeCourse) * 0.5)),
    version: "1.0",
    lastReviewed: "2026-10-03",
    audience: officeCourse.overview.what,
    prerequisites: ["किसी पूर्व ज्ञान की जरूरत नहीं — यह beginner से शुरू होता है।"],
    outcomes: officeCourse.outcomes.length ? officeCourse.outcomes : [officeCourse.overview.outcome, officeCourse.overview.why, officeCourse.overview.where]
  } : {
    title: { en: subject.en, hi: subject.hi },
    level: "foundation",
    learningHours: 0,
    version: "1.0",
    lastReviewed: "2026-09-30",
    audience: "Learners, students, volunteers and community learners.",
    prerequisites: ["No special prerequisite stated for this learning resource."],
    outcomes: [
      "Understand the subject from foundation to practical application.",
      "Use examples and activities to connect knowledge with real situations.",
      "Review learning through practice and assessment before claiming completion."
    ]
  });
  const markDone = (i) => setDone(current => {
    const next = current.includes(i) ? current : [...current, i];
    try { localStorage.setItem(progressKey, JSON.stringify(next)); } catch {}
    return next;
  });
  const goLesson = (nextIndex) => {
    const safe = Math.max(0, Math.min(nextIndex, total - 1));
    setActiveLesson(safe);
    setQuizOpen(false);
    setAnswers({});
    setSubmitted(false);
    setLessonOpen(true);
    markDone(safe);
    requestAnimationFrame(() => document.getElementById("current-lesson-content")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  if (isPrimaryEducation) {
    const cur = lessons[activeLesson];
    const common = {
      lessonLabel: cur.title,
      moduleTitle: cur.module,
      nextLessonTitle: lessons[activeLesson + 1]?.title,
      onNextLesson: activeLesson < total - 1 ? () => goLesson(activeLesson + 1) : undefined,
      onMarkDone: () => markDone(activeLesson)
    };
    if (isRichLesson) return <PrimaryLettersCourse subject={subject} {...common} />;
    const d = cur.detail || {};
    return <PrimaryLessonFresh {...common}
      content={{
        body: cur.body,
        deep: d.content?.deepUnderstanding,
        objectives: d.objectives,
        examples: d.content?.examples,
        practice: d.practice,
        mistakes: d.content?.commonMistakes,
        activity: d.activity,
        summary: d.content?.summary
      }}
      check={d.knowledgeCheck}
    />;
  }
  if (isTimeCalendarSubject(subject)) return <MasterCourse course={TIME_CALENDAR_COURSE} subject={subject} onBack={onBack} art={timeChapterArt} HeroArt={TimeHeroArt} />;
  if (isFruitsSubject(subject)) return <MasterCourse course={FRUITS_COURSE} subject={subject} onBack={onBack} art={fruitChapterArt} HeroArt={FruitHeroArt} />;
  if (isVocabularySubject(subject)) return <MasterCourse course={VOCABULARY_COURSE} subject={subject} onBack={onBack} art={vocabChapterArt} HeroArt={VocabHeroArt} />;
  if (isTreesForestsSubject(subject)) return <MasterCourse course={TREES_FORESTS_COURSE} subject={subject} onBack={onBack} art={treesChapterArt} HeroArt={TreesHeroArt} />;
  if (isKnowledgeWorldSubject(subject)) {
    const kwc = knowledgeWorldToMasterCourse(subject, getKnowledgeWorldCourse(subject));
    if (kwc) { const a = makeCourseArt(kwc); return <MasterCourse course={kwc} subject={subject} onBack={onBack} art={a.chapterArt} HeroArt={a.HeroArt} />; }
  }
  if (isOfficeSkillsSubject(subject)) {
    const oc = officeToMasterCourse(subject);
    if (oc) { const a = makeCourseArt(oc); return <MasterCourse course={oc} subject={subject} onBack={onBack} art={a.chapterArt} HeroArt={a.HeroArt} />; }
  }
  if (isGenericTopicSubject(subject)) {
    const mc = curriculumToMasterCourse(subject);
    const a = makeCourseArt(mc);
    return <MasterCourse course={mc} subject={subject} onBack={onBack} art={a.chapterArt} HeroArt={a.HeroArt} />;
  }
  const submitQuiz = () => {
    const passed = score >= 4;
    const result = { score, total: quizQuestions.length, passed, completedAt: new Date().toISOString() };
    setSubmitted(true);
    setFinalResult(result);
    try { localStorage.setItem(progressKey + "-final", JSON.stringify(result)); } catch {}
  };
  const score = quizQuestions.reduce((n,q,i)=>n+(answers[i]===q.answer?1:0),0);
  const submitModuleAssessment = (moduleId, questions) => {
    const result = questions.reduce((n,q,i)=>n+(moduleAnswers[moduleId]?.[i]===q.answer?1:0),0);
    setModuleResults(r => {
      const next = { ...r, [moduleId]: { score: result, total: questions.length, passed: result / questions.length >= 0.7 } };
      try { localStorage.setItem(progressKey + "-assessments", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return <div className="min-h-screen bg-[#f6f8fb] pt-4 text-zinc-900 font-inria md:pt-6">
    <section className={"relative overflow-hidden bg-gradient-to-r "+subject.color+" text-white"}>
      <img src={subject.photo || subject.image} alt={subject.title} className="absolute inset-0 h-full w-full object-cover opacity-30"/>
      <div className="absolute inset-0 bg-[#001529]/75"/>
      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-16">
        <button onClick={onBack} className="mb-7 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20"><FaArrowLeft/> Back / वापस</button>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="text-xs font-black uppercase tracking-widest text-white/70">SSF Learning Hub • Course {subject.number}</div>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">{subject.en}</h1>
            <h2 className="mt-2 text-2xl font-bold text-white/90">{subject.hi}</h2>
            <p className="mt-5 text-lg leading-8 text-white/85">{subject.intro}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur lg:w-72">
            <div className="text-xs font-black uppercase tracking-widest text-white/70">Course Journey</div>
            <div className="mt-2 text-xl font-black">Foundation → Advanced</div>
            <div className="mt-1 text-sm text-white/75">Learn → Practise → Assess → Complete</div>
          </div>
        </div>
      </div>
    </section>

    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Official Course / आधिकारिक पाठ्यक्रम</div>
            <h2 className="mt-2 text-2xl font-black">{courseMeta.title.en}</h2>
            <div className="text-base font-bold text-zinc-500">{courseMeta.title.hi}</div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">{courseMeta.description || subject.intro}</p>
          </div>
          <div className="rounded-2xl bg-[#eef7fb] px-5 py-4 text-sm font-black text-[#002344]">Version {courseMeta.version}<br/>Reviewed {courseMeta.lastReviewed || "—"}</div>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-4">
          <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Level</div><div className="mt-1 font-black">{structuredCourse ? "Foundation" : "Foundation → Practical"}</div></div>
          <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Language</div><div className="mt-1 font-black">Hindi + English</div></div>
          <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Lessons</div><div className="mt-1 font-black">{total} structured lessons</div></div>
          <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Learning Time</div><div className="mt-1 font-black">{courseMeta.learningHours ? courseMeta.learningHours + " hours" : "Self-paced"}</div></div>
        </div>
        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-5"><h3 className="font-black text-[#002344]">Who is this for? / किसके लिए?</h3><p className="mt-2 text-sm leading-6 text-zinc-600">{courseMeta.audience}</p><h3 className="mt-5 font-black text-[#002344]">Prerequisites / पूर्व-आवश्यकताएँ</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600">{courseMeta.prerequisites.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
          <div className="rounded-2xl border border-zinc-200 p-5"><h3 className="font-black text-[#002344]">What you will learn / आप क्या सीखेंगे</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600">{courseMeta.outcomes.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
        </div>
        <div className="mt-7 rounded-2xl bg-[#f1f7fa] p-5">
          <div className="flex items-center justify-between"><div><div className="text-sm font-black text-[#002344]">Course Progress / प्रगति</div><div className="text-xs text-zinc-500">{completed} / {total} lessons completed</div></div><div className="text-2xl font-black text-[#002344]">{progress}%</div></div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white"><div className="h-full bg-gradient-to-r from-[#003366] to-[#0a9396]" style={{width:progress+"%"}}/></div>
        </div>
      </section>

      {richCourse && <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
          <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">About this subject / इस विषय के बारे में</div>
          <h3 className="mt-2 text-xl font-black text-[#002344]">यह विषय क्या है? / What is it?</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-600">{richCourse.overview.what}</p>
          <h3 className="mt-5 text-xl font-black text-[#002344]">क्यों महत्वपूर्ण है? / Why it matters</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-600">{richCourse.overview.why}</p>
        </div>
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
          <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Where we see it / कहाँ दिखता है</div>
          <p className="mt-2 text-sm leading-7 text-zinc-600">{richCourse.overview.where}</p>
          <h3 className="mt-5 text-xl font-black text-[#002344]">सीखने के बाद आप समझ पाएँगे / What you will understand</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-600">{richCourse.overview.outcome}</p>
          <div className="mt-5 rounded-2xl bg-[#f1f7fa] p-4 text-sm font-bold text-[#002344]">
            🧭 Learning Map: {richCourse.modules.length} modules • {richTopicCount} topics • {richCourse.glossary.length} key words • quiz + activity + project
          </div>
        </div>
      </section>}

      {richCourse && richCourse.facts?.length > 0 && <section className="mt-6 rounded-[2rem] border border-[#ffe6b3] bg-[#fffaf0] p-6 shadow-sm md:p-7">
        <div className="text-xs font-black uppercase tracking-widest text-[#b8860b]">Did You Know? / क्या आप जानते हैं?</div>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">{richCourse.facts.map((f,i)=><li key={i} className="rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-[#5a3e00] shadow-sm">💡 {f}</li>)}</ul>
      </section>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_330px]">
        <div className="space-y-7">
          {modules.map((m,mi)=><section key={m.title} className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
            <div className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b3a63] to-[#001529] text-white font-black">{mi+1}</div><div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Module {mi+1}</div><h2 className="mt-1 text-2xl font-black">{m.title}</h2><p className="mt-1 text-sm text-zinc-500">{m.subtitle}</p></div></div>
            <div className="mt-6 space-y-3">{m.lessons.map((l,li)=>{const global=modules.slice(0,mi).reduce((n,x)=>n+x.lessons.length,0)+li;const isDone=done.includes(global);return <button key={l[0]} onClick={()=>goLesson(global)} className={"flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition "+(activeLesson===global?"border-[#0f4c81] bg-[#eef7fb]":"border-zinc-200 hover:border-[#b9cfdd] hover:bg-zinc-50")}>
              <div className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black "+(isDone?"bg-[#e7f7ef] text-[#177245]":"bg-zinc-100 text-[#002344]")}>{isDone?<FaCheckCircle/>:li+1}</div>
              <div className="min-w-0 flex-1"><div className="font-black">{l[0]}</div><div className="mt-1 text-xs leading-5 text-zinc-500">{l[1]}</div></div><FaArrowRight className="shrink-0 text-zinc-400"/>
            </button>})}</div>
          </section>)}
        </div>

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
            <img src={subject.photo || subject.image} alt={subject.title} className="h-52 w-full object-cover"/>
            <div className="p-5"><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Visual Learning / दृश्य सीख</div><p className="mt-2 text-sm leading-6 text-zinc-600">इस course का visual उसी विषय से जुड़ा है।</p></div>
          </div>
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="font-black text-[#002344]">Current Lesson / वर्तमान पाठ</h3>
            <div id="current-lesson-content" className="mt-3 rounded-xl bg-zinc-50 p-4 scroll-mt-6">
              <div className="text-xs text-zinc-500">{lessons[activeLesson].module}</div>
              <div className="mt-1 font-black">{lessons[activeLesson].title}</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{lessons[activeLesson].body}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={()=>speakLessonText([lessons[activeLesson].title,lessons[activeLesson].body,...(lessons[activeLesson].detail?.content?.examples||[])].join(". "))} className="rounded-full bg-gradient-to-br from-[#0b3a63] to-[#001529] px-4 py-2 text-xs font-black text-white">🔊 Listen / सुनें</button>
                <span className="rounded-full bg-[#eef7fb] px-4 py-2 text-xs font-black text-[#0f4c81]">👄 Repeat / बोलें</span>
              </div>
              {isPrimaryEducation && <PrimaryLessonVisual lesson={lessons[activeLesson]} />}

              <div className="mt-5 border-t border-zinc-200 pt-4">
                <div className="mb-3 flex items-center justify-between text-[11px] font-black text-zinc-500">
                  <span>Lesson {activeLesson + 1} of {total} / पाठ {activeLesson + 1} / {total}</span>
                  <span>{Math.round(((activeLesson + 1) / total) * 100)}% path</span>
                </div>
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-gradient-to-r from-[#003366] to-[#0a9396]" style={{width:(((activeLesson + 1) / total) * 100)+"%"}}/></div>
                <div className="flex gap-2">
                  <button type="button" onClick={()=>goLesson(activeLesson-1)} disabled={activeLesson===0} className="flex-1 rounded-xl border border-zinc-200 px-3 py-3 text-xs font-black text-[#002344] disabled:cursor-not-allowed disabled:opacity-40">← Previous / पिछला</button>
                  <button type="button" onClick={()=>goLesson(activeLesson+1)} disabled={activeLesson===total-1} className="flex-1 rounded-xl bg-gradient-to-br from-[#0b3a63] to-[#001529] px-3 py-3 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Next Lesson / अगला पाठ →</button>
                </div>
              </div>
              {lessons[activeLesson].detail && <div className="mt-5 space-y-4 border-t border-zinc-200 pt-4">
                {[
                  ["Objectives / उद्देश्य", lessons[activeLesson].detail.objectives],
                  ["Deep Understanding / गहरी समझ", lessons[activeLesson].detail.content?.deepUnderstanding],
                  ["Examples / उदाहरण", lessons[activeLesson].detail.content?.examples],
                  ["Practical Application / वास्तविक उपयोग", lessons[activeLesson].detail.content?.practicalApplication],
                  ["Practice / अभ्यास", lessons[activeLesson].detail.practice],
                  ["Activity / गतिविधि", lessons[activeLesson].detail.activity],
                  ["Knowledge Check / ज्ञान जाँच", lessons[activeLesson].detail.content?.knowledgeCheck],
                  ["Reflection / स्वयं विचार", lessons[activeLesson].detail.content?.reflection],
                  ["Common Mistakes / सामान्य गलतियाँ", lessons[activeLesson].detail.content?.commonMistakes],
                  ["Summary / सार", lessons[activeLesson].detail.content?.summary]
                ].map(([label,value]) => value && <div key={label}>
                  <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">{label}</div>
                  {Array.isArray(value) ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600">{value.map((x,i)=><li key={i}>{x && typeof x === "object" ? [x.question || x.title || x.text || "", x.options ? x.options.join(" • ") : ""].filter(Boolean).join(" — ") : x}</li>)}</ul> : <p className="mt-2 text-sm leading-6 text-zinc-600">{value}</p>}
                </div>)}
              </div>}
            </div>
          </div>
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="font-black text-[#002344]">Course Assessment / आकलन</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">पहले learning और practice पूरा करें, फिर self-check करें। Final certification अभी इस foundation stage में fake नहीं की जा रही है।</p>
            <button onClick={()=>setQuizOpen(v=>!v)} className="mt-4 w-full rounded-xl bg-gradient-to-br from-[#0b3a63] to-[#001529] px-4 py-3 text-sm font-black text-white">{quizOpen?"Close Check / बंद करें":"Start Knowledge Check / शुरू करें"}</button>
            {quizOpen && <div className="mt-4 space-y-4">
              {quizQuestions.map((q,i)=><div key={i} className="rounded-xl bg-zinc-50 p-4"><div className="text-sm font-black">{i+1}. {q.q}</div><div className="mt-3 space-y-2">{q.options.map((o,j)=><label key={j} className="flex gap-2 text-xs leading-5"><input type="radio" name={"course-q-"+i} checked={answers[i]===j} onChange={()=>setAnswers(a=>({...a,[i]:j}))}/><span>{o}</span></label>)}</div></div>)}
              <button onClick={submitQuiz} disabled={Object.keys(answers).length<quizQuestions.length} className="w-full rounded-xl bg-[#0f4c81] px-4 py-3 text-sm font-black text-white disabled:opacity-40">Check Answers / उत्तर जाँचें</button>
              {(submitted || finalResult) && <div className={"rounded-xl border p-4 text-center "+(finalResult?.passed?"border-[#cfe5d8] bg-[#f3fbf6]":"border-[#f2dfbd] bg-[#fffaf0]")}><div className={"text-2xl font-black "+(finalResult?.passed?"text-[#177245]":"text-[#9a5b00]")}>{finalResult?.score ?? score}/{finalResult?.total ?? 5}</div><div className="mt-1 text-xs text-zinc-600">{finalResult?.passed?"Final assessment passed / अंतिम आकलन पास":"Review and retry / दोबारा पढ़ें और प्रयास करें"}</div></div>}
            </div>}
          </div>
        </aside>
      </div>

      {lessonOpen && lessons[activeLesson] && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#001529]/75 p-3 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true" aria-label="Current lesson">
        <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <div className={"shrink-0 bg-gradient-to-r "+subject.color+" p-5 text-white md:p-7"}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-white/70">{lessons[activeLesson].module}</div>
                <h2 className="mt-2 text-2xl font-black leading-tight md:text-3xl">{lessons[activeLesson].title}</h2>
              </div>
              <button type="button" onClick={()=>{setLessonOpen(false);}} className="rounded-xl bg-white/15 px-3 py-2 text-lg font-black text-white hover:bg-white/25" aria-label="Close lesson">✕</button>
            </div>
          </div>
          <div className="overflow-y-auto p-5 md:p-8">
            {(lessons[activeLesson].detail?.content?.steps?.length > 0 || lessons[activeLesson].detail?.content?.checks?.length > 0) && (
              <div className="mb-5 rounded-2xl bg-[#f1f7fa] p-4">
                <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">How to Learn It / कैसे सीखें</div>
                {lessons[activeLesson].detail.content.steps?.length > 0 && <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-7 text-zinc-700">{lessons[activeLesson].detail.content.steps.map((s,i)=><li key={i}>{s}</li>)}</ol>}
                {lessons[activeLesson].detail.content.checks?.length > 0 && <div className="mt-3"><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Check your understanding / समझ जाँचें</div><ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-700">{lessons[activeLesson].detail.content.checks.map((s,i)=><li key={i}>{s}</li>)}</ul></div>}
              </div>
            )}
            {/[\n]|\*\*|^-\s/m.test(String(lessons[activeLesson].body || ""))
              ? <LessonNotes text={lessons[activeLesson].body} className="space-y-3 text-base text-zinc-700" />
              : <p className="text-base leading-8 text-zinc-700">{lessons[activeLesson].body}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={()=>speakLessonText([lessons[activeLesson].title,lessons[activeLesson].body,...(lessons[activeLesson].detail?.content?.examples||[])].join(". "))} className="rounded-full bg-gradient-to-br from-[#0b3a63] to-[#001529] px-4 py-2 text-xs font-black text-white">🔊 Listen / सुनें</button>
              <span className="rounded-full bg-[#eef7fb] px-4 py-2 text-xs font-black text-[#0f4c81]">👄 Repeat / बोलें</span>
            </div>
            {isPrimaryEducation && <PrimaryLessonVisual lesson={lessons[activeLesson]} />}

            {lessons[activeLesson].detail && <div className="mt-7 space-y-5 border-t border-zinc-200 pt-6">
              {[
                ["Objectives / उद्देश्य", lessons[activeLesson].detail.objectives],
                ["Deep Understanding / गहरी समझ", lessons[activeLesson].detail.content?.deepUnderstanding],
                ["Why It Matters / क्यों जरूरी है", lessons[activeLesson].detail.content?.whyItMatters],
                ["Examples / उदाहरण", lessons[activeLesson].detail.content?.examples],
                ["Practice / अभ्यास", lessons[activeLesson].detail.practice],
                ["Activity / गतिविधि", lessons[activeLesson].detail.activity],
                ["Common Mistakes / सामान्य गलतियाँ", lessons[activeLesson].detail.content?.commonMistakes],
                ["Summary / सार", lessons[activeLesson].detail.content?.summary]
              ].map(([label,value]) => value && <div key={label}>
                <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">{label}</div>
                {Array.isArray(value) ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-700">{value.map((x,i)=><li key={i}>{x}</li>)}</ul> : <p className="mt-2 text-sm leading-7 text-zinc-700">{value}</p>}
              </div>)}
            </div>}
          </div>
          <div className="shrink-0 border-t border-zinc-200 bg-white p-4 md:p-5">
            <div className="mb-3 text-center text-xs font-bold text-zinc-500">Lesson {activeLesson + 1} of {total} • पूरा पढ़ें, फिर आगे बढ़ें</div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={()=>setLessonOpen(false)} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-black text-[#002344]">Close / बंद करें</button>
              <button type="button" disabled={activeLesson===total-1} onClick={()=>goLesson(activeLesson+1)} className="rounded-xl bg-gradient-to-br from-[#0b3a63] to-[#001529] px-4 py-3 text-sm font-black text-white disabled:opacity-40">Next Lesson / अगला पाठ →</button>
            </div>
          </div>
        </div>
      </div>}

      {richCourse && <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
          <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Key Words / मुख्य शब्द</div>
          <h3 className="mt-2 text-xl font-black text-[#002344]">Glossary</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{richCourse.glossary.map((g,i)=><div key={i} className="rounded-xl bg-[#f7fafc] p-3"><div className="text-sm font-black text-[#002344]">{g.term} <span className="text-[#0f4c81]">/ {g.hi}</span></div><div className="mt-1 text-xs leading-5 text-zinc-600">{g.meaning}</div></div>)}</div>
        </div>
        <div className="space-y-6">
          {richCourse.project && <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
            <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Project / परियोजना</div>
            <h3 className="mt-2 text-xl font-black text-[#002344]">{richCourse.project.objective}</h3>
            <div className="mt-3 grid gap-3 text-sm leading-6 text-zinc-600 md:grid-cols-2">
              <div><span className="font-black text-[#002344]">Materials:</span> {richCourse.project.materials}</div>
              <div><span className="font-black text-[#002344]">Observation:</span> {richCourse.project.observation}</div>
            </div>
            <div className="mt-3"><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Steps</div><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-zinc-600">{richCourse.project.steps.map((s,i)=><li key={i}>{s}</li>)}</ol></div>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-zinc-600 md:grid-cols-2"><div><span className="font-black text-[#002344]">Result:</span> {richCourse.project.result}</div><div><span className="font-black text-[#002344]">Reflection:</span> {richCourse.project.reflection}</div></div>
          </div>}
          {richCourse.revision?.length > 0 && <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
            <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Quick Revision / द्रुत पुनरावृत्ति</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600">{richCourse.revision.map((r,i)=><li key={i}>{r}</li>)}</ul>
          </div>}
          {richCourse.related?.length > 0 && <div className="rounded-[2rem] border border-[#d9e7f0] bg-[#f7fafc] p-6 shadow-sm md:p-7">
            <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Related Knowledge / संबंधित ज्ञान</div>
            <p className="mt-1 text-xs text-zinc-500">Knowledge World आपस में जुड़ा है — इन विषयों से यह topic गहरा होता है।</p>
            <div className="mt-3 flex flex-wrap gap-2">{richCourse.related.map((r,i)=><span key={i} className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#002344] shadow-sm">🔗 {r}</span>)}</div>
          </div>}
        </div>
      </section>}

      <section className="mt-8 rounded-[2rem] border border-[#d9e7f0] bg-white p-6 md:p-8">
        <div className="flex items-center gap-3"><FaGraduationCap className="text-3xl text-[#002344]"/><div><h2 className="text-2xl font-black">Certificate Pathway / प्रमाणन मार्ग</h2><p className="text-sm text-zinc-500">Learning first. Certification after genuine completion and assessment.</p></div></div>
        <div className="mt-6 grid gap-3 md:grid-cols-5">{[
          ["Learn / सीखें", progress > 0],
          ["Practise / अभ्यास", completed > 0],
          ["Complete / पूर्ण करें", allLearningComplete],
          ["Assess / आकलन", moduleAssessmentComplete && finalAssessmentPassed],
          ["Certificate / प्रमाणपत्र", certificateEligible]
        ].map(([x,ok],i)=><div key={x} className={"rounded-xl p-4 text-center text-xs font-black "+(ok?"bg-[#e7f7ef] text-[#177245]":"bg-zinc-100 text-zinc-600")}>{i+1}. {x}</div>)}</div>
        <div className="mt-6 rounded-2xl bg-[#f7fafc] p-5">
          <div className="text-sm font-black text-[#002344]">Certificate request / प्रमाणपत्र अनुरोध</div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Certificate issuance will be enabled only after the required learning, activities and assessments are complete. Opening lessons or creating an account alone does not issue a certificate.</p>
          <button
            onClick={() => {
              if (!certificateEligible) {
                window.alert("Certificate is not yet available. Complete all lessons, pass every module assessment, and pass the final assessment first.");
                return;
              }
              setAuthError("");
              setAuthStatus("idle");
              setAccountOpen(true);
            }}
            className={"mt-4 rounded-xl px-5 py-3 text-sm font-black text-white "+(certificateEligible?"bg-[#177245]":"bg-gradient-to-br from-[#0b3a63] to-[#001529]")}
          >{certificateEligible ? "Proceed to Certificate / प्रमाणपत्र के लिए आगे बढ़ें" : "Get Certificate / प्रमाणपत्र प्राप्त करें"}</button>
          <div className="mt-5 border-t border-zinc-200 pt-4">
            <div className="text-xs font-black uppercase tracking-widest text-zinc-400">Or reach SSF directly / सीधे संपर्क करें</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <a href={certificateWhatsAppHref(accountUser, subject, courseMeta, progress)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-white"><FaWhatsapp/> WhatsApp</a>
              <a href={certificateEmailHref(accountUser, subject, courseMeta, progress)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0f4c81]/25 bg-[#f1f7fa] px-4 py-3 text-sm font-black text-[#0f4c81]"><FaEnvelope/> Email</a>
            </div>
          </div>
        </div>
      </section>

      {accountOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001529]/70 p-4 backdrop-blur-sm">
        <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Certificate Account Stage / प्रमाणपत्र खाता चरण</div><h2 className="mt-2 text-2xl font-black text-[#002344]">{accountUser ? "Account ready / खाता तैयार है" : authMode === "login" ? "Login to continue / आगे बढ़ने के लिए लॉगिन" : "Create learning account / लर्निंग अकाउंट बनाएं"}</h2></div>
            <button type="button" onClick={()=>setAccountOpen(false)} className="rounded-xl bg-zinc-100 px-3 py-2 font-black text-zinc-500">✕</button>
          </div>
          {accountUser ? <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-[#f1f7fa] p-5"><div className="font-black text-[#002344]">{accountUser.fullName}</div><div className="mt-1 text-sm text-zinc-500">{accountUser.email}</div></div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800"><strong>Learning completion verified.</strong> Your course completion and assessment record is ready for the certificate request stage. Certificate issuance remains subject to SSF's certificate workflow.</div>
            <button type="button" disabled={authStatus==="submitting"} onClick={async()=>{
              setAuthStatus("submitting"); setAuthError("");
              try {
                const response=await fetch(ENDPOINTS.LEARNING_CERTIFICATE_REQUEST,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accountId:accountUser.id,learner:accountUser,courseId:subject.id,courseTitle:courseMeta.title,completionPercent:progress,moduleAssessments:moduleResults,finalAssessment:finalResult,learningHours:courseMeta.learningHours})});
                const result=await response.json().catch(()=>({}));
                if(!response.ok) throw new Error(result.message||"Certificate request could not be submitted.");
                try { localStorage.setItem("ssf-learning-certificate-request",JSON.stringify(result.request)); } catch {}
                setAccountOpen(false);
                window.alert("Certificate request submitted successfully. SSF will review the request before issuing the certificate.");
              } catch(err){ setAuthStatus("error"); setAuthError(err.message||"Unable to submit certificate request."); }
            }} className="w-full rounded-xl bg-[#177245] px-5 py-3 font-black text-white disabled:opacity-50">{authStatus==="submitting"?"Submitting...":"Request Certificate / प्रमाणपत्र का अनुरोध करें"}</button>
            {authError && <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{authError}</div>}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-black text-[#002344]">Need help or a quick update? / मदद या जानकारी चाहिए?</div>
              <p className="mt-1 text-xs leading-5 text-zinc-500">Certificate status लेने के लिए SSF से सीधे संपर्क करें — अपना course नाम और account email बताएँ।</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <a href={certificateWhatsAppHref(accountUser, subject, courseMeta, progress)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-white"><FaWhatsapp/> WhatsApp</a>
                <a href={certificateEmailHref(accountUser, subject, courseMeta, progress)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0f4c81]/25 bg-[#f1f7fa] px-4 py-3 text-sm font-black text-[#0f4c81]"><FaEnvelope/> Email</a>
              </div>
            </div>
          </div> : <form className="mt-6 space-y-4" onSubmit={async e=>{
            e.preventDefault(); setAuthError(""); setAuthStatus("submitting");
            try {
              const payload = authMode === "login"
                ? { email:authForm.email.trim().toLowerCase(), password:authForm.password }
                : { fullName:authForm.fullName.trim(), email:authForm.email.trim().toLowerCase(), confirmEmail:authForm.confirmEmail.trim().toLowerCase(), phone:authForm.phone.trim(), password:authForm.password, memberType:"website_signup", message:"SSF Learning Hub certificate account" };
              if(authMode==="signup" && (!payload.fullName || payload.fullName.length<3 || !payload.phone || payload.password.length<8 || payload.email!==payload.confirmEmail)) throw new Error("Please complete all account fields correctly.");
              const response=await fetch(authMode==="login"?ENDPOINTS.MEMBER_LOGIN:ENDPOINTS.MEMBER_SIGNUP,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
              const result=await response.json().catch(()=>({}));
              if(!response.ok) throw new Error(result.message || "Account request failed.");
              const user=result.user;
              setAccountUser(user);
              try { localStorage.setItem("ssf-learning-account",JSON.stringify(user)); } catch {}
              setAuthStatus("success");
            } catch(err){ setAuthStatus("error"); setAuthError(err.message || "Unable to continue."); }
          }}>
            {authMode==="signup" && <><div><label className="text-xs font-black text-zinc-500">Full Name / पूरा नाम</label><input className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3" value={authForm.fullName} onChange={e=>setAuthForm(v=>({...v,fullName:e.target.value}))} required/></div><div><label className="text-xs font-black text-zinc-500">Mobile / मोबाइल</label><input className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3" value={authForm.phone} onChange={e=>setAuthForm(v=>({...v,phone:e.target.value}))} required/></div></>}
            <div><label className="text-xs font-black text-zinc-500">Email / ईमेल</label><input type="email" className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3" value={authForm.email} onChange={e=>setAuthForm(v=>({...v,email:e.target.value}))} required/></div>
            {authMode==="signup" && <div><label className="text-xs font-black text-zinc-500">Confirm Email / ईमेल पुष्टि</label><input type="email" className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3" value={authForm.confirmEmail} onChange={e=>setAuthForm(v=>({...v,confirmEmail:e.target.value}))} required/></div>}
            <div><label className="text-xs font-black text-zinc-500">Password / पासवर्ड</label><input type="password" minLength={8} className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-3" value={authForm.password} onChange={e=>setAuthForm(v=>({...v,password:e.target.value}))} required/></div>
            {authError && <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{authError}</div>}
            <button disabled={authStatus==="submitting"} className="w-full rounded-xl bg-gradient-to-br from-[#0b3a63] to-[#001529] px-5 py-3 font-black text-white disabled:opacity-50">{authStatus==="submitting"?"Please wait...":authMode==="login"?"Login & Continue / लॉगिन करें":"Create Account & Continue / अकाउंट बनाएं"}</button>
            <button type="button" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthError("");}} className="w-full rounded-xl bg-zinc-100 px-5 py-3 text-sm font-black text-[#002344]">{authMode==="login"?"Create Account / नया अकाउंट बनाएं":"Already have an account? Login / पहले से अकाउंट है? लॉगिन"}</button>
          </form>}
        </div>
      </div>}
    </main>
  </div>;
}

export default function LearningHubV2({ view = "home", subjectIdParam = "" }) {
  const navigate = useNavigate();
  // Only the Explore view consumes a dashboard handoff; other views discard it
  // so an intent choice can't leak into My Learning or Knowledge World.
  const [pending] = useState(() => {
    if (view === "explore") return takePendingFilters();
    takePendingFilters();
    return { category: null, query: "", level: "All", type: "All" };
  });
  const [subjectId, setSubjectId] = useState(subjectIdParam || "");
  const [category, setCategory] = useState(pending.category || (view === "knowledge-world" ? KW_CATEGORY_NAME : "All"));
  const [query, setQuery] = useState(pending.query || "");
  const [progressTick, setProgressTick] = useState(0);
  const [levelFilter, setLevelFilter] = useState(pending.level || "All");
  const [typeFilter, setTypeFilter] = useState(pending.type || "All");
  const [sortBy, setSortBy] = useState("default");

  const courseMetaBySubject = useMemo(() => {
    const map = {};
    SUBJECTS.forEach(s => {
      const course = hasStructuredCourse(s) ? resolveStructuredCourse(s).course : null;
      if (course) map[s.id] = course;
    });
    return map;
  }, []);
  const progressSummary = useMemo(() => {
    const inProgress = [];
    let completedCount = 0;
    SUBJECTS.forEach(s => {
      try {
        const done = readStoredProgress(s);
        if (!done.length) return;
        const { total } = getSubjectModules(s);
        if (!total) return;
        const percent = Math.min(100, Math.round(done.length / total * 100));
        if (percent >= 100) completedCount += 1;
        else inProgress.push({ subject: s, percent });
      } catch {}
    });
    inProgress.sort((a, b) => b.percent - a.percent);
    return { active: inProgress[0] || null, inProgress, completedCount };
  }, [progressTick]);

  const cardProgress = (s) => {
    try {
      const done = readStoredProgress(s);
      if (!done.length) return 0;
      const { total } = getSubjectModules(s);
      return total ? Math.min(100, Math.round(done.length / total * 100)) : 0;
    } catch { return 0; }
  };

  // Recently viewed — a lightweight, real signal recorded when a learner opens a
  // course. Used for the "Find Your Next Step" / Recently Viewed surfaces.
  const recentSubjects = useMemo(() => {
    let ids = [];
    try { ids = JSON.parse(localStorage.getItem("ssf-learning-recent") || "[]"); } catch {}
    return (Array.isArray(ids) ? ids : []).map((id) => SUBJECTS.find((s) => s.id === id)).filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressTick]);

  // Normalised course metadata used by the shared card so the dashboard never
  // hard-codes levels/hours/badges. Values come from real course data only.
  const cardInfo = (s) => {
    const c = getSubjectModules(s);
    const meta = courseMetaBySubject[s.id];
    const level =
      (isTimeCalendarSubject(s) && TIME_CALENDAR_COURSE.meta.level) ||
      (isFruitsSubject(s) && FRUITS_COURSE.meta.level) ||
      (isVocabularySubject(s) && VOCABULARY_COURSE.meta.level) ||
      (isTreesForestsSubject(s) && TREES_FORESTS_COURSE.meta.level) ||
      (isOfficeSkillsSubject(s) && getOfficeSkillsCourse(s)?.level) ||
      (isEducationSubject(s) && getEducationCourse(s)?.level) ||
      (isKnowledgeWorldSubject(s) && getKnowledgeWorldCourse(s)?.level) ||
      (meta && (meta.level === "foundation" ? "Foundation" : meta.level)) ||
      "";
    const hours = meta && meta.learningHours ? meta.learningHours : "";
    const kind = isKnowledgeWorldSubject(s) ? "Knowledge World" : getOfficeSkillsCourse(s) ? "Course Shell" : "Full Course";
    return {
      kind,
      badge: courseBadge(kind),
      level: level ? String(level).replace(/\b\w/g, (m) => m.toUpperCase()) : "",
      moduleCount: c.moduleCount || 0,
      hours,
    };
  };

  const matchSubjects = (q, limit = 8) => {
    const needle = String(q || "").toLowerCase().trim();
    if (!needle) return [];
    return SUBJECTS.filter((s) => {
      const c = SUBJECT_CONTENT_ALL[s.en];
      const extra = c ? [c.focus, (c.concepts || []).join(" "), (c.keywords || []).join(" "), (c.examples || []).join(" ")].join(" ") : "";
      return (s.title + " " + s.category + " " + s.intro + " " + extra).toLowerCase().includes(needle);
    }).slice(0, limit);
  };

  const pushRecent = (id) => {
    try {
      const prev = JSON.parse(localStorage.getItem("ssf-learning-recent") || "[]");
      const next = [id, ...(Array.isArray(prev) ? prev : []).filter((x) => x !== id)].slice(0, 12);
      localStorage.setItem("ssf-learning-recent", JSON.stringify(next));
    } catch {}
  };

  const shareLearningBox = async ({ title, text, url }) => {
    const shareUrl = url || window.location.href;
    const shareData = { title, text, url: shareUrl };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      window.alert("Share link copied. अब आप इसे WhatsApp, Facebook या किसी भी app में share कर सकते हैं.");
    } catch (err) {
      if (err?.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareUrl);
          window.alert("Share link copied.");
        } catch {}
      }
    }
  };
  const shareSubject = (subject) => shareLearningBox({
    title: subject.en + " | SSF Learning Hub",
    text: subject.intro + " — SSF Learning Hub",
    url: window.location.origin + "/LearningHub/course/" + encodeURIComponent(subject.id)
  });
  const openSubject = (subject) => {
    pushRecent(subject.id);
    navigate({ to: "/LearningHub/course/$subjectId", params: { subjectId: subject.id } });
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
  };
  const back = () => {
    navigate({ to: "/LearningHub" });
    setProgressTick(t => t + 1);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
  };
  // Explore can be opened pre-filtered to a real category, an intent or a path.
  const exploreFor = (cats) => {
    const first = Array.isArray(cats) ? cats[0] : cats;
    PENDING_FILTERS.category = first || null;
    PENDING_FILTERS.query = ""; PENDING_FILTERS.level = "All"; PENDING_FILTERS.type = "All";
    setCategory(first || "All"); setQuery(""); setLevelFilter("All"); setTypeFilter("All");
    navigate({ to: "/LearningHub/explore" });
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
  };
  const goExplore = ({ query: q = "", category: cat = "All" } = {}) => {
    PENDING_FILTERS.category = cat; PENDING_FILTERS.query = q; PENDING_FILTERS.level = "All"; PENDING_FILTERS.type = "All";
    setCategory(cat); setQuery(q); setLevelFilter("All"); setTypeFilter("All");
    navigate({ to: "/LearningHub/explore" });
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
  };
  const openVerify = () => { try { window.location.href = "/LearningCertificateVerify"; } catch {} };
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const hayFor = (s) => {
      const c = SUBJECT_CONTENT_ALL[s.en];
      const extra = c ? [c.focus, (c.concepts || []).join(" "), (c.keywords || []).join(" "), (c.examples || []).join(" ")].join(" ") : "";
      return (s.title + " " + s.category + " " + s.intro + " " + extra).toLowerCase();
    };
    const levelOf = (s) => (cardInfo(s).level || "").toLowerCase();
    let list = SUBJECTS.filter((s) => category === "All" || s.category === category);
    if (q) list = list.filter((s) => hayFor(s).includes(q));
    if (levelFilter !== "All") {
      const want = levelFilter.toLowerCase();
      list = list.filter((s) => levelOf(s).includes(want) || (want === "foundation" && (!levelOf(s) || levelOf(s) === "foundation")));
    }
    if (typeFilter !== "All") list = list.filter((s) => cardInfo(s).kind === typeFilter);
    if (sortBy === "az") list = [...list].sort((a, b) => a.en.localeCompare(b.en));
    else if (sortBy === "za") list = [...list].sort((a, b) => b.en.localeCompare(a.en));
    return list;
  }, [category, query, levelFilter, typeFilter, sortBy]);
  const selected = SUBJECTS.find(s => s.id === subjectId);
  if (view === "course" && selected) return <LearningSubject subject={selected} onBack={back} />;
  if (view === "course" && !selected) return <div className="mx-auto max-w-3xl px-4 py-16 text-center">
    <h1 className="text-2xl font-black text-[#062a52]">Subject not found / विषय नहीं मिला</h1>
    <p className="mt-2 text-sm text-zinc-600">यह course उपलब्ध नहीं है। कृपया Subjects list से चुनें।</p>
    <button type="button" onClick={() => navigate({ to: "/LearningHub/explore" })} className="mt-6 rounded-2xl bg-gradient-to-br from-[#0b3a63] to-[#001529] px-6 py-3 text-sm font-black text-white">Explore Subjects →</button>
  </div>;
  if (view === "home" && getSubjectFromUrl()) return <LegacySubjectRedirect />;

  const KW_CATEGORY = "Knowledge World / ज्ञान संसार";
  const CATEGORY_ORDER = [KW_CATEGORY, ...Object.keys(CATEGORY_META).filter(c => c !== KW_CATEGORY)];
  const visibleCategories = category === "All" ? CATEGORY_ORDER : [category];
  const knowledgeWorldSubjects = SUBJECTS.filter(s => s.category === KW_CATEGORY);
  const categoryCards = CATEGORY_ORDER.map((name, ci) => {
    const meta = CATEGORY_META[name] || {};
    const subjects = SUBJECTS.filter((s) => s.category === name);
    return { name, icon: meta.icon || FaBookOpen, color: meta.color || "from-[#003366] to-[#0f4c81]", image: makeCategoryVisual(name, subjects.length, SUBJECT_VISUAL_GLYPH[name] || "🎓", ci + 40), count: subjects.length, subjects };
  });
  const openCategory = (name) => { PENDING_FILTERS.category = name; PENDING_FILTERS.query = ""; setCategory(name); setQuery(""); navigate({ to: "/LearningHub/explore" }); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {} };
  const myLearningSubjects = filtered.filter((s) => cardProgress(s) > 0);
  const gridSubjects = view === "my-learning" ? myLearningSubjects : filtered;
  const isExploreLike = view === "explore" || view === "knowledge-world" || view === "my-learning";
  const hasActiveFilters = Boolean(query) || category !== "All" || levelFilter !== "All" || typeFilter !== "All" || sortBy !== "default";
  const clearFilters = () => { setQuery(""); setLevelFilter("All"); setTypeFilter("All"); setSortBy("default"); setCategory(view === "knowledge-world" ? KW_CATEGORY : "All"); };

  return <div className="ssf-hub font-inria text-[#142b45]">
    {view === "home" && <LearningHubHome
      subjects={SUBJECTS}
      categoryCards={categoryCards}
      knowledgeWorldSubjects={knowledgeWorldSubjects}
      progressSummary={progressSummary}
      recentSubjects={recentSubjects}
      cardProgress={cardProgress}
      cardInfo={cardInfo}
      matchSubjects={matchSubjects}
      onOpenSubject={openSubject}
      onShareSubject={shareSubject}
      onSearch={(q) => goExplore({ query: q })}
      onCategory={openCategory}
      onExplore={() => goExplore({})}
      onKnowledge={() => navigate({ to: "/LearningHub/knowledge-world" })}
      onMyLearning={() => navigate({ to: "/LearningHub/my-learning" })}
      onIntent={(it) => exploreFor(it.categories)}
      onPath={(p) => exploreFor(p.categories)}
      onVerify={openVerify}
    />}
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {isExploreLike && <div className="mt-2 rounded-3xl border border-[#EADFCC] bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#142b45] md:text-4xl">{view === "my-learning" ? "My Learning / मेरी सीख" : view === "knowledge-world" ? "Knowledge World / ज्ञान संसार" : "Explore All Learning / सारी सीख"}</h1>
            <p className="mt-1 text-sm text-[#5b6b7c]">{view === "my-learning" ? "आपके शुरू किए courses — यहीं से जारी रखें।" : `${gridSubjects.length} learning options — search, category, level, type और sort से filter करें।`}</p>
          </div>
          <button type="button" onClick={() => navigate({ to: "/LearningHub" })} className="self-start rounded-full border border-[#FF6600]/30 px-4 py-2 text-xs font-bold text-[#c2410c] transition hover:bg-[#FFF3D6]">← Learning Hub home</button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="lg:col-span-2">
            <span className="sr-only">Search learning</span>
            <div className="flex items-center gap-2 rounded-xl border border-[#EADFCC] bg-[#fbfaf7] px-3">
              <FaSearch className="text-[#FF6600]" aria-hidden="true" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search subject, skill or topic..." className="min-w-0 flex-1 bg-transparent py-2.5 text-sm focus:outline-none" />
            </div>
          </label>
          <label>
            <span className="sr-only">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-[#EADFCC] bg-[#fbfaf7] px-3 py-2.5 text-sm font-semibold focus:outline-none">
              <option value="All">All categories</option>
              {CATEGORY_ORDER.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Learning type</span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full rounded-xl border border-[#EADFCC] bg-[#fbfaf7] px-3 py-2.5 text-sm font-semibold focus:outline-none">
              <option value="All">All learning types</option>
              <option value="Full Course">Full Course</option>
              <option value="Course Shell">Course Shell</option>
              <option value="Knowledge World">Knowledge World</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Level</span>
            <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="w-full rounded-xl border border-[#EADFCC] bg-[#fbfaf7] px-3 py-2.5 text-sm font-semibold focus:outline-none">
              <option value="All">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Foundation">Foundation</option>
              <option value="Applied">Applied / Practical</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Sort</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-xl border border-[#EADFCC] bg-[#fbfaf7] px-3 py-2.5 text-sm font-semibold focus:outline-none">
              <option value="default">Sort: Default</option>
              <option value="az">Sort: A → Z</option>
              <option value="za">Sort: Z → A</option>
            </select>
          </label>
          <div className="flex items-end">
            <button type="button" onClick={clearFilters} disabled={!hasActiveFilters} className={"w-full rounded-xl px-4 py-2.5 text-sm font-bold transition " + (hasActiveFilters ? "border border-[#FF6600]/40 bg-[#FFF7EA] text-[#B34A00] hover:bg-[#FFEFD6]" : "border border-zinc-200 bg-zinc-50 text-zinc-400")}>Clear filters</button>
          </div>
        </div>
      </div>}

      {view !== "home" && <div className="mt-10">
        {visibleCategories.map(cat => {
          const meta = CATEGORY_META[cat];
          const Icon = meta?.icon || FaBookOpen;
          const courses = gridSubjects.filter(s => s.category === cat);
          if (!courses.length) return null;
          const isOfficeCat = cat === OFFICE_SKILLS_CATEGORY;
          return <section key={cat} className="mt-14">
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF6600]"><Icon aria-hidden="true" /> {cat}</div>
                <h2 className="mt-3 font-serif text-3xl font-bold text-[#142b45] md:text-4xl">{isOfficeCat ? "Learning Cards / लर्निंग कार्ड" : "Courses / पाठ्यक्रम"}</h2>
                {isOfficeCat && <p className="mt-2 text-sm font-semibold text-[#5b6b7c]">{OFFICE_SKILLS_SECTION.taglineEn} • {OFFICE_SKILLS_SECTION.taglineHi}</p>}
                {isOfficeCat && <p className="mt-1 text-sm leading-7 text-[#5b6b7c]">{OFFICE_SKILLS_SECTION.description}</p>}
                <p className="mt-2 text-sm text-[#9aa7b4]">{courses.length} learning options available in this area / इस क्षेत्र में उपलब्ध learning options</p>
              </div>
              <span className="block h-px flex-1 bg-gradient-to-r from-[#FF6600]/50 to-transparent md:mb-3" aria-hidden="true" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map(s => { const info = cardInfo(s); return (
                <SubjectCard key={s.id} subject={s} onOpen={openSubject} onShare={shareSubject}
                  progress={cardProgress(s)} badge={info.badge} level={info.level} moduleCount={info.moduleCount} hours={info.hours} />
              ); })}
            </div>
          </section>;
        })}

        {!gridSubjects.length && <div className="mt-10 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">{view === "my-learning" ? "अभी कोई course शुरू नहीं हुआ। Explore Subjects से अपना पहला course चुनें।" : "No course found. Try another search / कोई दूसरा विषय खोजें।"}</div>}
      </div>}
    </main>
  </div>;
}
