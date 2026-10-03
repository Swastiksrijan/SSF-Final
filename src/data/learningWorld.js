// SSF Learning Hub — information architecture for the dashboard.
// Pure data + tiny helpers. Nothing here hard-codes a course/subject count or a
// course name; everything resolves against the live curriculum so the dashboard
// grows automatically when new categories/subjects/cards are added.
import { KNOWLEDGE_WORLD_CATEGORY } from "./learningCurriculum.js";

// Higher-level groups that organise the real curriculum categories so a learner
// can understand the whole Learning Hub at a glance. A category that is not
// listed anywhere still appears (see buildLearningWorld) so nothing is hidden.
export const LEARNING_WORLD_GROUPS = [
  {
    id: "knowledge",
    title: "Knowledge & Education",
    hi: "ज्ञान एवं शिक्षा",
    icon: "📖",
    blurb: "School, science, language and research foundations.",
    categories: [
      "Education / शिक्षा",
      "Science / विज्ञान",
      "Mathematics & Financial Literacy / गणित एवं वित्तीय साक्षरता",
      "Languages / भाषाएँ",
      "Research & Mastery Skills / शोध एवं दक्षता कौशल",
    ],
  },
  {
    id: "digital",
    title: "Digital & Future",
    hi: "डिजिटल एवं भविष्य",
    icon: "💻",
    blurb: "Technology, AI and information literacy for the modern world.",
    categories: [
      "Digital Skills / डिजिटल कौशल",
      "Office Skills / ऑफिस कौशल",
      "AI & Future Technology / AI एवं भविष्य की तकनीक",
      "Media & Information Literacy / मीडिया एवं सूचना साक्षरता",
    ],
  },
  {
    id: "career",
    title: "Career, Work & Enterprise",
    hi: "करियर, कार्य एवं उद्यम",
    icon: "💼",
    blurb: "Job-ready skills, professional communication and enterprise.",
    categories: [
      "Career & Workplace / करियर एवं कार्यस्थल",
      "English & Communication / अंग्रेज़ी एवं संचार",
      "Skill Development / कौशल विकास",
      "Entrepreneurship & Work / उद्यमिता एवं कार्य",
      "NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान",
    ],
  },
  {
    id: "life",
    title: "Life & Wellbeing",
    hi: "जीवन एवं कल्याण",
    icon: "🌱",
    blurb: "Health, mindset and practical everyday living.",
    categories: [
      "Health / स्वास्थ्य",
      "Life Skills / जीवन कौशल",
      "Personal Development / व्यक्तिगत विकास",
      "Sports, Fitness & Wellness / खेल, फिटनेस एवं कल्याण",
      "Practical Everyday Life / दैनिक व्यावहारिक जीवन",
    ],
  },
  {
    id: "community",
    title: "Community & Development",
    hi: "समुदाय एवं विकास",
    icon: "🌾",
    blurb: "Agriculture, environment and inclusive social development.",
    categories: [
      "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास",
      "Environment / पर्यावरण",
      "Women & Child Development / महिला एवं बाल विकास",
      "Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास",
      "Animal Protection / पशु संरक्षण",
      "Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य",
      "Youth & Disaster Preparedness / युवा एवं आपदा तैयारी",
    ],
  },
  {
    id: "culture",
    title: "Culture & Creativity",
    hi: "संस्कृति एवं रचनात्मकता",
    icon: "🎨",
    blurb: "Heritage, arts, music and creative expression.",
    categories: [
      "Culture & Heritage / संस्कृति एवं विरासत",
      "Arts, Creativity & Culture / कला, रचनात्मकता एवं संस्कृति",
    ],
  },
];

const WORLD_CATEGORY_SET = new Set(LEARNING_WORLD_GROUPS.flatMap((g) => g.categories));

// Attach the live category objects to each group. Categories missing from the
// mapping land in an auto "More Learning" group so they are never lost.
export function buildLearningWorld(categoryCards = []) {
  const byName = new Map(categoryCards.map((c) => [c.name, c]));
  const groups = LEARNING_WORLD_GROUPS.map((g) => ({
    ...g,
    items: g.categories.map((name) => byName.get(name)).filter(Boolean),
  })).filter((g) => g.items.length);
  const ungrouped = categoryCards.filter(
    (c) => c.name !== KNOWLEDGE_WORLD_CATEGORY && !WORLD_CATEGORY_SET.has(c.name)
  );
  if (ungrouped.length) {
    groups.push({
      id: "more",
      title: "More Learning",
      hi: "और क्षेत्र",
      icon: "✨",
      blurb: "Additional learning areas.",
      categories: ungrouped.map((c) => c.name),
      items: ungrouped,
    });
  }
  return groups;
}

// "What brings you here today?" — each choice opens Explore pre-filtered to the
// matching real categories. No fake content, only category routing.
export const LEARNING_INTENTS = [
  {
    id: "learn",
    icon: "📚",
    title: "Learn Something",
    hi: "कुछ सीखें",
    text: "Explore a subject or structured course.",
    categories: [
      "Education / शिक्षा",
      "Science / विज्ञान",
      "Mathematics & Financial Literacy / गणित एवं वित्तीय साक्षरता",
      "Languages / भाषाएँ",
      "Research & Mastery Skills / शोध एवं दक्षता कौशल",
      "Culture & Heritage / संस्कृति एवं विरासत",
      "Arts, Creativity & Culture / कला, रचनात्मकता एवं संस्कृति",
    ],
  },
  {
    id: "skill",
    icon: "🛠️",
    title: "Build a Skill",
    hi: "कौशल बनाएँ",
    text: "Develop a practical, work-ready skill.",
    categories: [
      "Skill Development / कौशल विकास",
      "Digital Skills / डिजिटल कौशल",
      "Office Skills / ऑफिस कौशल",
      "English & Communication / अंग्रेज़ी एवं संचार",
      "Practical Everyday Life / दैनिक व्यावहारिक जीवन",
    ],
  },
  {
    id: "goal",
    icon: "🎯",
    title: "Achieve a Goal",
    hi: "लक्ष्य पाएँ",
    text: "Learn for a career, personal or professional goal.",
    categories: [
      "Career & Workplace / करियर एवं कार्यस्थल",
      "Entrepreneurship & Work / उद्यमिता एवं कार्य",
      "NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान",
      "Personal Development / व्यक्तिगत विकास",
      "AI & Future Technology / AI एवं भविष्य की तकनीक",
    ],
  },
  {
    id: "discover",
    icon: "🌍",
    title: "Explore & Discover",
    hi: "खोजें एवं जानें",
    text: "Explore knowledge, society and new areas.",
    categories: [
      "Health / स्वास्थ्य",
      "Environment / पर्यावरण",
      "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास",
      "Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य",
      "Women & Child Development / महिला एवं बाल विकास",
      "Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास",
      "Animal Protection / पशु संरक्षण",
      "Youth & Disaster Preparedness / युवा एवं आपदा तैयारी",
      "Life Skills / जीवन कौशल",
      "Sports, Fitness & Wellness / खेल, फिटनेस एवं कल्याण",
    ],
  },
];

// Goal-based journeys. Each path maps to real categories (and optionally real
// Knowledge World, which is reached through the Knowledge World experience).
export const LEARNING_PATHS = [
  {
    id: "start",
    icon: "🌱",
    title: "Start Learning",
    hi: "शुरुआत करें",
    text: "New here? Begin with foundations.",
    categories: [
      "Education / शिक्षा",
      "Languages / भाषाएँ",
      "Digital Skills / डिजिटल कौशल",
      "Practical Everyday Life / दैनिक व्यावहारिक जीवन",
    ],
  },
  {
    id: "career",
    icon: "💼",
    title: "Career Ready",
    hi: "करियर के लिए तैयार",
    text: "Skills for work and workplace.",
    categories: [
      "Career & Workplace / करियर एवं कार्यस्थल",
      "English & Communication / अंग्रेज़ी एवं संचार",
      "Skill Development / कौशल विकास",
      "Entrepreneurship & Work / उद्यमिता एवं कार्य",
    ],
  },
  {
    id: "digital",
    icon: "💻",
    title: "Digital Professional",
    hi: "डिजिटल पेशेवर",
    text: "Everyday digital tools and office work.",
    categories: [
      "Digital Skills / डिजिटल कौशल",
      "Office Skills / ऑफिस कौशल",
      "Media & Information Literacy / मीडिया एवं सूचना साक्षरता",
    ],
  },
  {
    id: "knowledge",
    icon: "🧠",
    title: "Knowledge Explorer",
    hi: "ज्ञान खोजी",
    text: "Education, science, languages and knowledge.",
    categories: [
      "Education / शिक्षा",
      "Science / विज्ञान",
      "Mathematics & Financial Literacy / गणित एवं वित्तीय साक्षरता",
      "Languages / भाषाएँ",
      "Research & Mastery Skills / शोध एवं दक्षता कौशल",
    ],
  },
  {
    id: "future",
    icon: "🤖",
    title: "Future Skills",
    hi: "भविष्य के कौशल",
    text: "AI and emerging technology.",
    categories: ["AI & Future Technology / AI एवं भविष्य की तकनीक", "Digital Skills / डिजिटल कौशल"],
  },
  {
    id: "community",
    icon: "🌍",
    title: "Life & Community",
    hi: "जीवन एवं समुदाय",
    text: "Health, environment and social development.",
    categories: [
      "Health / स्वास्थ्य",
      "Environment / पर्यावरण",
      "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास",
      "Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य",
      "Life Skills / जीवन कौशल",
    ],
  },
];

// Progress metadata only — never invents ratings or popularity numbers.
const BADGE_META = {
  "Full Course": { icon: "⭐", label: "Featured", tone: "gold" },
  "Course Shell": { icon: "🆕", label: "New", tone: "blue" },
  "Knowledge World": { icon: "🌍", label: "Knowledge", tone: "green" },
};

export function courseBadge(kind) {
  return BADGE_META[kind] || null;
}
