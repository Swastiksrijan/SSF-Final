/**
 * SSF Learning Hub - Complete Course Definitions
 * Subject-specific courses with meaningful educational content
 */

import {
  FLAGSHIP_COMPUTER_COURSE,
  FLAGSHIP_COURSE_ID,
  FLAGSHIP_COURSE_ASSESSMENTS,
} from "./learningHubCourseArchitecture";

// ============================================================================
// ENGLISH & COMMUNICATION COURSE
// ============================================================================
export const ENGLISH_COMMUNICATION_COURSE = {
  id: "english-communication",
  title: { en: "English & Communication", hi: "अंग्रेजी और संचार" },
  category: "English & Communication / अंग्रेजी और संचार",
  type: "certificate",
  level: "beginner",
  description:
    "Learn English fundamentals, communication skills, grammar, and professional writing. Build confidence in speaking, listening, reading and writing through practical exercises.",
  audience:
    "Students, professionals, community learners and anyone building English communication skills.",
  prerequisites: ["No prior English experience required."],
  outcomes: [
    "Communicate clearly in English for everyday situations.",
    "Use correct grammar, vocabulary and pronunciation.",
    "Write professional emails and simple documents.",
    "Understand spoken English and respond appropriately.",
  ],
  learningHours: 15,
  version: "1.0",
  lastReviewed: "2026-09-30",
  modules: [
    {
      id: "english-foundation",
      title: { en: "English Foundations", hi: "अंग्रेजी की बुनियाद" },
      description: "Master alphabets, basic vocabulary and pronunciation.",
      lessons: [
        {
          id: "alphabet-vowels",
          title: { en: "Alphabets, Vowels & Consonants", hi: "वर्णमाला, स्वर और व्यंजन" },
          content: {
            easyExplanation:
              "English has 26 letters. Vowels (a, e, i, o, u) make open sounds. Consonants are the remaining letters.",
            deepUnderstanding:
              "Correct pronunciation depends on understanding vowel length (short vs long) and consonant positions.",
            examples: [
              "Vowels: apple, egg, ink, orange, umbrella",
              "Consonants: book, cat, dog, fan, girl",
            ],
            commonMistakes: ["Mixing similar-sounding letters (v/w, l/r)"],
            summary: "Master each letter's sound before moving to words.",
          },
          practice: [
            "Pronounce each letter of the alphabet 5 times.",
            "Identify vowels and consonants in 10 English words.",
          ],
        },
        {
          id: "basic-vocabulary",
          title: { en: "Basic Vocabulary", hi: "मूल शब्दावली" },
          content: {
            easyExplanation: "Vocabulary is the set of words you know. Start with common words used in daily life.",
            deepUnderstanding: "Learning words in context helps retention. Group words by category.",
            examples: ["Numbers: one, two, three", "Colors: red, blue, green", "Body: head, hand, foot"],
            commonMistakes: ["Learning only word list without usage"],
            summary: "Practice everyday vocabulary in sentences.",
          },
          practice: ["Learn 20 common words and use each in a sentence.", "Name 10 objects around you in English."],
        },
        {
          id: "greetings",
          title: { en: "Greetings & Common Phrases", hi: "अभिवादन और सामान्य वाक्यांश" },
          content: {
            easyExplanation: "Greetings are how people say hello and goodbye.",
            deepUnderstanding: "Different situations use different greetings (formal vs informal).",
            examples: [
              "Formal: Good morning, How do you do?",
              "Informal: Hi, Hey, What's up?",
            ],
            commonMistakes: ["Using formal greetings in casual settings"],
            summary: "Greetings build confidence to start conversations.",
          },
          practice: ["Practice 10 different greetings with correct pronunciation."],
        },
      ],
      assessment: { type: "module", passPercent: 70, questions: 8 },
    },
    {
      id: "english-grammar",
      title: { en: "Grammar Basics", hi: "व्याकरण की बुनियाद" },
      description: "Understand sentence structure, tenses and parts of speech.",
      lessons: [
        {
          id: "parts-of-speech",
          title: { en: "Parts of Speech", hi: "वाक्य के भाग" },
          content: {
            easyExplanation:
              "Words in English sentences have different roles: nouns (things), verbs (actions), adjectives (descriptions).",
            deepUnderstanding: "Understanding parts of speech helps construct correct sentences.",
            examples: [
              "Noun: book, girl, house",
              "Verb: read, run, eat",
              "Adjective: big, red, beautiful",
            ],
            commonMistakes: ["Confusing nouns with verbs"],
            summary: "Every word has a role in a sentence.",
          },
          practice: ["Identify parts of speech in 15 sentences.", "Write sentences using specific parts."],
        },
        {
          id: "sentence-structure",
          title: { en: "Sentence Structure", hi: "वाक्य की संरचना" },
          content: {
            easyExplanation: "A complete sentence has a subject (who/what) and verb (action).",
            deepUnderstanding: "Simple, compound and complex sentences serve different purposes.",
            examples: ["Simple: She reads books.", "Compound: She reads books and he watches movies."],
            commonMistakes: ["Sentence fragments without verbs", "Run-on sentences"],
            summary: "Correct structure makes writing clear.",
          },
          practice: ["Combine simple sentences into compound sentences.", "Correct 10 broken sentences."],
        },
        {
          id: "basic-tenses",
          title: { en: "Basic Tenses", hi: "काल (Tenses)" },
          content: {
            easyExplanation: "Tenses show when an action happens: past (finished), present (now), future.",
            deepUnderstanding: "Each tense changes the verb form appropriately.",
            examples: [
              "Past: I read the book",
              "Present: I read the book",
              "Future: I will read the book",
            ],
            commonMistakes: ["Wrong verb forms for tenses", "Inconsistent tense in writing"],
            summary: "Correct tense makes writing clear about timing.",
          },
          practice: ["Write 10 sentences in past, present, and future tense.", "Identify tenses in a paragraph."],
        },
      ],
      assessment: { type: "module", passPercent: 70, questions: 10 },
    },
    {
      id: "english-practical",
      title: { en: "Practical Communication", hi: "व्यावहारिक संचार" },
      description: "Speak, listen, write and communicate effectively.",
      lessons: [
        {
          id: "spoken-english",
          title: { en: "Spoken English", hi: "बोली जाने वाली अंग्रेजी" },
          content: {
            easyExplanation: "Speaking English requires confidence, correct pronunciation and natural flow.",
            deepUnderstanding: "Native speakers use contractions and speak naturally.",
            examples: ["Formal: I am not going", "Natural: I'm not going"],
            commonMistakes: ["Speaking too slowly", "Being too rigid about grammar"],
            summary: "Fluency comes with practice, not perfection.",
          },
          practice: ["Record yourself introducing yourself in English.", "Practice simple conversations."],
        },
        {
          id: "professional-writing",
          title: { en: "Professional Writing", hi: "व्यावसायिक लेखन" },
          content: {
            easyExplanation: "Professional writing is clear, concise and formal.",
            deepUnderstanding: "Professional writing has structure and serves clear purposes.",
            examples: [
              "Email: Clear subject, brief message",
              "Letter: Formal structure, polite closing",
            ],
            commonMistakes: ["Too casual tone", "Unclear purpose"],
            summary: "Good professional writing respects the reader.",
          },
          practice: ["Write a professional email.", "Write a formal letter."],
        },
      ],
      assessment: { type: "final", passPercent: 70, questions: 12 },
    },
  ],
};

// ============================================================================
// HEALTH & WELLNESS COURSE
// ============================================================================
export const HEALTH_WELLNESS_COURSE = {
  id: "health-wellness",
  title: { en: "Health & Wellness", hi: "स्वास्थ्य और कल्याण" },
  category: "Health / स्वास्थ्य",
  type: "awareness",
  level: "foundation",
  description:
    "Learn about personal health, hygiene, nutrition, and disease prevention. This course provides health awareness and does not replace professional medical advice.",
  audience: "Community members, students, families and anyone interested in personal health awareness.",
  prerequisites: ["No prerequisite required."],
  outcomes: [
    "Understand basic health and hygiene practices.",
    "Learn nutrition basics for healthy living.",
    "Recognize signs of common illnesses and prevention.",
    "Build healthy habits for personal wellness.",
  ],
  learningHours: 10,
  version: "1.0",
  lastReviewed: "2026-09-30",
  modules: [
    {
      id: "health-hygiene",
      title: { en: "Hygiene Practices", hi: "स्वच्छता की प्रथाएं" },
      description: "Essential daily hygiene habits to prevent illness.",
      lessons: [
        {
          id: "personal-cleanliness",
          title: { en: "Personal Cleanliness", hi: "व्यक्तिगत सफाई" },
          content: {
            easyExplanation: "Daily bathing, washing hands and cleaning clothes prevent many diseases.",
            deepUnderstanding: "Germs spread through touch. Hygiene breaks this chain of infection.",
            examples: [
              "Wash hands after toilet, before eating",
              "Bathe daily with clean water",
              "Keep nails clean and trimmed",
            ],
            commonMistakes: ["Washing hands quickly without soap"],
            summary: "Daily hygiene is the simplest way to stay healthy.",
          },
          practice: ["Create a daily hygiene checklist.", "Teach proper handwashing technique."],
        },
        {
          id: "water-sanitation",
          title: { en: "Clean Water & Sanitation", hi: "स्वच्छ जल और स्वच्छता" },
          content: {
            easyExplanation: "Clean drinking water and proper sanitation prevent serious diseases.",
            deepUnderstanding: "Access to clean water and toilets is a human right.",
            examples: [
              "Boil water if purity is questionable",
              "Store water in clean, covered containers",
              "Ensure toilets are separate from water sources",
            ],
            commonMistakes: ["Assuming water is safe without checking"],
            summary: "Clean water and sanitation are foundations of health.",
          },
          practice: [
            "Identify water sources in your area and their safety status.",
            "Check if your drinking water storage is clean.",
          ],
        },
      ],
      assessment: { type: "module", passPercent: 70, questions: 8 },
    },
    {
      id: "health-disease",
      title: { en: "Common Illnesses & Prevention", hi: "सामान्य बीमारियां और रोकथाम" },
      description: "Recognize symptoms and prevention of common diseases.",
      lessons: [
        {
          id: "infectious-diseases",
          title: { en: "Infectious Diseases", hi: "संक्रामक रोग" },
          content: {
            easyExplanation: "Infectious diseases spread from person to person through germs.",
            deepUnderstanding: "Vaccines prevent many serious diseases. Rest and nutrition help fight infections.",
            examples: [
              "Cold/Flu: fever, cough → rest, fluids, hygiene",
              "Diarrhea: watery stool → clean water, oral rehydration",
            ],
            commonMistakes: ["Not isolating when sick", "Not seeking medical help for severe symptoms"],
            summary: "Early recognition and proper care prevent complications.",
          },
          practice: ["List 5 infectious diseases and their symptoms.", "Create a prevention plan."],
        },
        {
          id: "mental-health",
          title: { en: "Mental Health", hi: "मानसिक स्वास्थ्य" },
          content: {
            easyExplanation: "Mental health is as important as physical health.",
            deepUnderstanding: "Good mental health requires managing emotions and maintaining relationships.",
            examples: [
              "Exercise reduces stress and depression",
              "Talking to friends/family helps",
              "Sleep and rest improve mood",
            ],
            commonMistakes: ["Ignoring mental health signs", "Feeling ashamed to seek help"],
            summary: "Mental health is health.",
          },
          practice: ["Identify personal stress triggers.", "Practice a stress-relief technique."],
        },
      ],
      assessment: { type: "final", passPercent: 70, questions: 10 },
    },
  ],
};

// ============================================================================
// ENVIRONMENT & SUSTAINABILITY COURSE
// ============================================================================
export const ENVIRONMENT_COURSE = {
  id: "environment-sustainability",
  title: { en: "Environment & Sustainability", hi: "पर्यावरण और स्थिरता" },
  category: "Environment / पर्यावरण",
  type: "awareness",
  level: "foundation",
  description:
    "Learn about environmental challenges, sustainability, conservation and how individual actions contribute to a healthier planet.",
  audience: "Students, community members and anyone interested in environmental awareness.",
  prerequisites: ["No prerequisite required."],
  outcomes: [
    "Understand environmental challenges like pollution and climate change.",
    "Learn sustainable practices for daily life.",
    "Appreciate water and forest conservation.",
    "Develop habits that reduce environmental impact.",
  ],
  learningHours: 12,
  version: "1.0",
  lastReviewed: "2026-09-30",
  modules: [
    {
      id: "env-basics",
      title: { en: "Environmental Basics", hi: "पर्यावरण की बुनियाद" },
      description: "Understand ecosystems and environmental challenges.",
      lessons: [
        {
          id: "ecosystem-understanding",
          title: { en: "Ecosystems & Biodiversity", hi: "पारिस्थितिकी तंत्र और जैव विविधता" },
          content: {
            easyExplanation: "An ecosystem is a community of living things and their environment.",
            deepUnderstanding: "Every organism has a role. Healthy ecosystems provide food, water, air.",
            examples: ["Forest ecosystem: trees, animals, soil interconnected", "Ocean ecosystem: fish, plants, coral"],
            commonMistakes: ["Thinking humans are separate from nature"],
            summary: "Humans depend on healthy ecosystems for survival.",
          },
          practice: ["Identify organisms in your local ecosystem.", "Draw a food chain."],
        },
        {
          id: "pollution-climate",
          title: { en: "Pollution & Climate Change", hi: "प्रदूषण और जलवायु परिवर्तन" },
          content: {
            easyExplanation: "Pollution harms air, water and soil. Climate change causes long-term shifts in temperature.",
            deepUnderstanding: "Burning fossil fuels releases CO₂. This traps heat, warming the planet.",
            examples: [
              "Air pollution: vehicles, factories",
              "Water pollution: factory waste, plastic",
              "Climate change: melting ice, extreme weather",
            ],
            commonMistakes: ["Thinking individual actions don't matter"],
            summary: "Individual and collective action reduces pollution.",
          },
          practice: ["Identify pollution sources near your home.", "Calculate your carbon footprint."],
        },
      ],
      assessment: { type: "module", passPercent: 70, questions: 10 },
    },
    {
      id: "env-conservation",
      title: { en: "Conservation & Sustainability", hi: "संरक्षण और स्थिरता" },
      description: "Learn sustainable practices to protect resources.",
      lessons: [
        {
          id: "water-conservation",
          title: { en: "Water Conservation", hi: "जल संरक्षण" },
          content: {
            easyExplanation: "Only 3% of water is fresh. Conservation ensures supply for future generations.",
            deepUnderstanding: "Groundwater depletion and pollution threaten water security.",
            examples: [
              "Fix leaking taps",
              "Take shorter showers",
              "Collect rainwater for plants",
            ],
            commonMistakes: ["Thinking water is infinite"],
            summary: "Water conservation protects this precious resource.",
          },
          practice: ["Audit household water use.", "Implement 3 water-saving actions."],
        },
        {
          id: "waste-recycling",
          title: { en: "Waste & Recycling", hi: "कचरा और पुनर्चक्रण" },
          content: {
            easyExplanation: "Waste management is reducing, reusing and recycling.",
            deepUnderstanding: "Recycling reduces mining and manufacturing. Reuse is often better.",
            examples: [
              "Reduce: Buy less, minimal packaging",
              "Reuse: Use bags again, repair items",
              "Recycle: Plastic, paper, metal, glass",
            ],
            commonMistakes: ["Throwing recyclables in trash"],
            summary: "Reduce, Reuse, Recycle - in that order.",
          },
          practice: ["Segregate your household waste.", "Find local recycling centers."],
        },
      ],
      assessment: { type: "final", passPercent: 70, questions: 12 },
    },
  ],
};

// ============================================================================
// CAREER & WORKPLACE SKILLS COURSE
// ============================================================================
export const CAREER_WORKPLACE_COURSE = {
  id: "career-workplace",
  title: { en: "Career & Workplace Skills", hi: "कैरियर और कार्यस्थल कौशल" },
  category: "Career & Workplace / कैरियर और कार्यस्थल",
  type: "skill",
  level: "beginner",
  description:
    "Develop essential workplace skills including professional communication, time management, teamwork and career planning.",
  audience: "Students, job seekers, professionals and anyone building career skills.",
  prerequisites: ["No prerequisite required."],
  outcomes: [
    "Build a professional mindset and workplace etiquette.",
    "Communicate effectively in professional settings.",
    "Manage time and priorities effectively.",
    "Work collaboratively in teams.",
  ],
  learningHours: 12,
  version: "1.0",
  lastReviewed: "2026-09-30",
  modules: [
    {
      id: "career-foundations",
      title: { en: "Career Foundations", hi: "कैरियर की बुनियाद" },
      description: "Understanding yourself and workplace expectations.",
      lessons: [
        {
          id: "self-assessment",
          title: { en: "Self-Assessment", hi: "आत्मविश्लेषण" },
          content: {
            easyExplanation: "Know your strengths, interests and skills.",
            deepUnderstanding: "Successful careers align personal values with job requirements.",
            examples: [
              "Skills: technical, soft (communication)",
              "Interests: creative work, helping people",
              "Values: income, work-life balance, impact",
            ],
            commonMistakes: ["Choosing career based only on money"],
            summary: "Self-awareness leads to fulfilling career choices.",
          },
          practice: ["List your top 5 strengths.", "Identify 5 career interests."],
        },
        {
          id: "workplace-etiquette",
          title: { en: "Workplace Etiquette", hi: "कार्यस्थल शिष्टाचार" },
          content: {
            easyExplanation: "Workplace etiquette means behaving professionally and respecting colleagues.",
            deepUnderstanding: "Professional behavior affects your reputation and career growth.",
            examples: [
              "Greeting: Firm handshake, eye contact",
              "Meetings: Listen, don't interrupt",
              "Communication: Professional tone, proper grammar",
              "Appearance: Dress code appropriate",
            ],
            commonMistakes: ["Oversharing personal information", "Being late without notice"],
            summary: "Professional behavior opens doors for opportunities.",
          },
          practice: ["Observe workplace etiquette in your environment.", "Role-play professional introductions."],
        },
      ],
      assessment: { type: "module", passPercent: 70, questions: 8 },
    },
    {
      id: "workplace-skills",
      title: { en: "Workplace Skills", hi: "कार्यस्थल कौशल" },
      description: "Essential skills for workplace success.",
      lessons: [
        {
          id: "professional-communication",
          title: { en: "Professional Communication", hi: "व्यावसायिक संचार" },
          content: {
            easyExplanation: "Professional communication is clear, respectful and goal-oriented.",
            deepUnderstanding: "Communication includes speaking, writing, listening and non-verbal.",
            examples: [
              "Emails: Clear subject, concise message",
              "Meetings: Prepare, participate, document",
              "Presentations: Clear structure, engaging",
            ],
            commonMistakes: ["Ambiguous instructions", "Emotional communication"],
            summary: "Clear communication is the foundation of effectiveness.",
          },
          practice: ["Write 3 professional emails.", "Prepare a 5-minute presentation."],
        },
        {
          id: "teamwork-time",
          title: { en: "Teamwork & Time Management", hi: "टीमवर्क और समय प्रबंधन" },
          content: {
            easyExplanation: "Teamwork and time management are crucial workplace skills.",
            deepUnderstanding: "Teams achieve more than individuals. Time management reduces stress.",
            examples: [
              "Team: Define roles, set goals, communicate",
              "Time: Prioritize, plan, execute without distractions",
            ],
            commonMistakes: ["Individual focus over team", "Treating everything as urgent"],
            summary: "Better skills lead to better results.",
          },
          practice: [
            "Participate in group project.",
            "Create a weekly schedule with priorities.",
          ],
        },
      ],
      assessment: { type: "final", passPercent: 70, questions: 12 },
    },
  ],
};

// ============================================================================
// EXPORT FOR USE IN COMPONENTS
// ============================================================================
export const ALL_STRUCTURED_COURSES = {
  [FLAGSHIP_COURSE_ID]: FLAGSHIP_COMPUTER_COURSE,
  "english-communication": ENGLISH_COMMUNICATION_COURSE,
  "health-wellness": HEALTH_WELLNESS_COURSE,
  "environment-sustainability": ENVIRONMENT_COURSE,
  "career-workplace": CAREER_WORKPLACE_COURSE,
};

// Course-specific assessment questions
export const COURSE_ASSESSMENTS = {
  ...FLAGSHIP_COURSE_ASSESSMENTS,
  "english-communication": {
    "english-foundation": [
      { q: "अंग्रेजी में कितने letters हैं?", options: ["24", "26", "28", "30"], answer: 1 },
      { q: "Vowels कौन से होते हैं?", options: ["A, E, I, O, U", "B, C, D, F, G", "सभी", "कोई नहीं"], answer: 0 },
    ],
    "english-grammar": [
      { q: "Complete sentence के लिए क्या जरूरी है?", options: ["Subject और verb", "केवल word", "सिर्फ verb", "कुछ नहीं"], answer: 0 },
      { q: "Present tense किस समय के लिए होता है?", options: ["भविष्य", "वर्तमान", "अतीत", "कोई नहीं"], answer: 1 },
    ],
    "english-practical": [
      { q: "Speaking में सबसे जरूरी क्या है?", options: ["हर word perfect होना", "आत्मविश्वास और समझ", "बहुत तेज़ बोलना", "नहीं बोलना"], answer: 1 },
      { q: "Professional email में क्या होना चाहिए?", options: ["बहुत लंबा", "Clear subject और tone", "केवल casual", "कोई signature नहीं"], answer: 1 },
    ],
  },
  "health-wellness": {
    "health-hygiene": [
      { q: "Handwashing का सबसे अच्छा तरीका क्या है?", options: ["बस पानी से", "Soap और clean water से", "तेल से", "dry रगड़ना"], answer: 1 },
      { q: "कौन से रोग clean water से prevent हो सकते हैं?", options: ["सिर्फ fever", "Cholera, dysentery, typhoid", "कोई नहीं", "सभी"], answer: 1 },
    ],
    "health-disease": [
      { q: "Fever आने पर पहली प्रतिक्रिया क्या होनी चाहिए?", options: ["तुरंत antibiotics", "Rest लें, fluids पिएं", "कुछ न करें", "तुरंत operate करवाएं"], answer: 1 },
      { q: "Mental health prevention कब शुरू होना चाहिए?", options: ["बीमारी के बाद", "अभी से healthy habits से", "बुढ़ापे में", "कभी नहीं"], answer: 1 },
    ],
  },
  "environment-sustainability": {
    "env-basics": [
      { q: "Ecosystem में सभी जीव किस तरह जुड़े होते हैं?", options: ["कोई connection नहीं", "एक-दूसरे पर निर्भर", "केवल plants", "केवल animals"], answer: 1 },
      { q: "Climate change का मुख्य कारण क्या है?", options: ["प्राकृतिक cycle", "Greenhouse gases (CO₂)", "सूर्य की गति", "ocean currents"], answer: 1 },
    ],
    "env-conservation": [
      { q: "3R rule में priority क्या है?", options: ["Recycle, Reuse, Reduce", "Reduce, Reuse, Recycle", "Reuse, Reduce, Recycle", "कोई नहीं"], answer: 1 },
      { q: "Water conservation का लाभ किसको होता है?", options: ["सिर्फ rich people को", "Future generations को", "Environment को नहीं", "किसी को नहीं"], answer: 1 },
    ],
  },
  "career-workplace": {
    "career-foundations": [
      { q: "सही career choice किसपर आधारित होनी चाहिए?", options: ["सिर्फ पैसे पर", "Interests, strengths, values पर", "सिर्फ status पर", "माता-पिता की choice पर"], answer: 1 },
      { q: "Workplace etiquette का सबसे महत्वपूर्ण भाग क्या है?", options: ["केवल appearance", "Professional behavior, punctuality", "केवल बोलना", "कोई नहीं"], answer: 1 },
    ],
    "workplace-skills": [
      { q: "Professional communication में सबसे जरूरी क्या है?", options: ["बहुत विस्तृत", "Clear, respectful और goal-oriented", "Emotional", "अस्पष्ट"], answer: 1 },
      { q: "Time management का फायदा क्या है?", options: ["काम को धीमा करना", "Productivity बढ़ना और stress कम होना", "काम न करना", "कोई नहीं"], answer: 1 },
    ],
  },
};
