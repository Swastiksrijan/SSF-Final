import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight, FaBookOpen, FaBriefcase, FaCertificate, FaCheckCircle, FaChevronLeft,
  FaClock, FaComments, FaDesktop, FaEnvelope, FaExternalLinkAlt,
  FaGraduationCap, FaLaptopCode, FaPlayCircle, FaSearch, FaShareAlt,
  FaShieldAlt, FaStar, FaUserTie, FaUsers, FaHeartbeat, FaLeaf
} from "react-icons/fa";

const FREE_RESOURCES = {
  britishCouncil: "https://learnenglish.britishcouncil.org/",
  googleDigital: "https://applieddigitalskills.withgoogle.com/s/en/learn",
  microsoftLearn: "https://learn.microsoft.com/training/",
  openLearn: "https://www.open.edu/openlearn/",
};

const COURSES = [
  {
    slug: "basic-english",
    category: "English & Communication",
    icon: FaComments,
    title: "English from Basics",
    hi: "मूल अंग्रेज़ी से शुरुआत",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Daily English vocabulary, sentences, reading, listening and speaking practice for beginners.",
    lessons: [
      ["01", "Introduction & Everyday Words", "Common words and simple sentence patterns."],
      ["02", "Build Your First Sentences", "Subject, verb, object and useful daily expressions."],
      ["03", "Daily Conversation", "Greetings, introductions, questions and replies."],
      ["04", "Reading & Listening Practice", "Short texts, pronunciation and comprehension."],
      ["05", "Speaking Practice", "Repeat, record, compare and improve."],
    ],
    resources: [
      ["British Council LearnEnglish", FREE_RESOURCES.britishCouncil],
      ["Free digital learning practice", FREE_RESOURCES.googleDigital],
    ],
  },
  {
    slug: "spoken-english",
    category: "English & Communication",
    icon: FaComments,
    title: "Spoken English for Everyday Life",
    hi: "दैनिक बोलचाल की अंग्रेज़ी",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Practical speaking situations for home, travel, phone calls, shopping and meeting people.",
    lessons: [
      ["01", "Self Introduction", "Name, place, education, work and interests."],
      ["02", "Questions & Answers", "How to ask clearly and respond naturally."],
      ["03", "Phone & Online Conversation", "Useful phrases for calls and online meetings."],
      ["04", "Travel & Public Places", "Directions, tickets, requests and polite conversation."],
      ["05", "Confidence Practice", "Short speaking tasks for daily practice."],
    ],
    resources: [
      ["British Council Speaking Practice", FREE_RESOURCES.britishCouncil],
      ["OpenLearn Free Courses", FREE_RESOURCES.openLearn],
    ],
  },
  {
    slug: "professional-communication",
    category: "English & Communication",
    icon: FaUserTie,
    title: "Professional Communication",
    hi: "प्रोफेशनल बातचीत एवं संवाद",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn how to speak clearly, respectfully and professionally with colleagues, seniors and clients.",
    lessons: [
      ["01", "Professional Introduction", "How to introduce yourself in an office or meeting."],
      ["02", "Speaking with Seniors", "Respectful language, clarity and confidence."],
      ["03", "Meetings & Discussion", "How to make a point, ask a question and disagree respectfully."],
      ["04", "Telephone Etiquette", "Professional opening, listening and closing."],
      ["05", "Difficult Conversations", "Stay calm, factual and solution-focused."],
    ],
    resources: [
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
      ["British Council LearnEnglish", FREE_RESOURCES.britishCouncil],
    ],
  },
  {
    slug: "interview-preparation",
    category: "Career & Jobs",
    icon: FaBriefcase,
    title: "Interview Preparation",
    hi: "साक्षात्कार की तैयारी",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "A practical interview path covering preparation, introduction, common questions, communication and mock practice.",
    lessons: [
      ["01", "Know the Interview", "Understand the role, organisation and interview format."],
      ["02", "Your Self Introduction", "Create and practise a clear 30–60 second introduction."],
      ["03", "Common Interview Questions", "Prepare honest, structured answers without memorising scripts."],
      ["04", "Body Language & Communication", "Eye contact, posture, listening and concise answers."],
      ["05", "Mock Interview", "Practice questions, review answers and improve."],
    ],
    resources: [
      ["Microsoft Learn Career & Skills Training", FREE_RESOURCES.microsoftLearn],
      ["OpenLearn", FREE_RESOURCES.openLearn],
    ],
  },
  {
    slug: "resume-cv",
    category: "Career & Jobs",
    icon: FaBookOpen,
    title: "Resume & CV Writing",
    hi: "Resume एवं CV बनाना",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Build a clear, truthful and professional resume for jobs, internships and opportunities.",
  },
  {
    slug: "job-search",
    category: "Career & Jobs",
    icon: FaBriefcase,
    title: "Job Search Skills",
    hi: "नौकरी खोजने की तैयारी",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Understand job descriptions, applications, follow-ups and professional profiles.",
  },
  {
    slug: "professional-email",
    category: "Professional Writing",
    icon: FaEnvelope,
    title: "Professional Email Writing",
    hi: "Professional Email कैसे लिखें",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Learn subject lines, openings, requests, follow-ups, attachments and professional closing.",
  },
  {
    slug: "professional-messages",
    category: "Professional Writing",
    icon: FaEnvelope,
    title: "Professional Messages & WhatsApp",
    hi: "Professional Messages एवं WhatsApp",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Write short, respectful and useful official messages, reminders and follow-ups.",
  },
  {
    slug: "computer-digital-basics",
    category: "Digital Skills",
    icon: FaDesktop,
    title: "Computer & Digital Basics",
    hi: "Computer एवं Digital Basics",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Essential computer, files, browser, typing and everyday digital skills.",
  },
  {
    slug: "google-workspace",
    category: "Digital Skills",
    icon: FaLaptopCode,
    title: "Google Workspace & Office Productivity",
    hi: "Google Workspace एवं Office Productivity",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Learn practical workflows using email, documents, sheets, forms, drive and calendars.",
  },
  {
    slug: "internet-safety",
    category: "Digital Skills",
    icon: FaShieldAlt,
    title: "Internet & Online Safety",
    hi: "Internet एवं Online Safety",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Passwords, phishing, scams, privacy and safe online behaviour.",
  },
  {
    slug: "workplace-etiquette",
    category: "Workplace Skills",
    icon: FaUserTie,
    title: "Workplace Etiquette",
    hi: "कार्यस्थल व्यवहार",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Professional behaviour, punctuality, meetings, respect and responsibility.",
  },
  {
    slug: "teamwork-leadership",
    category: "Workplace Skills",
    icon: FaStar,
    title: "Teamwork & Leadership Basics",
    hi: "Teamwork एवं Leadership Basics",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Team participation, responsibility, problem solving, delegation and leadership basics.",
  },
  {
    slug: "public-speaking",
    category: "Personal Development",
    icon: FaComments,
    title: "Confidence & Public Speaking",
    hi: "आत्मविश्वास एवं Public Speaking",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Build confidence, structure a speech and practise clear public speaking.",
  },
  {
    slug: "time-management",
    category: "Personal Development",
    icon: FaClock,
    title: "Time Management & Productivity",
    hi: "Time Management एवं Productivity",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Coming soon",
    ready: false,
    description: "Plan your day, set priorities and build practical work habits.",
  },
  {
    slug: "education-awareness",
    category: "SSF Knowledge & Awareness",
    icon: FaGraduationCap,
    title: "Education: Understanding the Right to Learn",
    hi: "शिक्षा: सीखने के अधिकार और अवसर को समझें",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "A complete awareness module on education, learning opportunities, inclusion, libraries, digital learning and responsible educational support.",
    lessons: [
      ["01", "Why Education Matters", "Understand education as a foundation for knowledge, opportunity, participation and personal development."],
      ["02", "Schooling & Lifelong Learning", "Learn the difference between formal education, vocational learning, self-learning and lifelong learning."],
      ["03", "Inclusive Education", "Understand barriers faced by girls, children with disabilities, rural learners and disadvantaged communities."],
      ["04", "Digital & Library Learning", "Learn how libraries, open educational resources and safe digital tools can support learning."],
      ["05", "Supporting a Learner", "Practical ways families, volunteers and communities can encourage attendance, reading and learning habits."],
      ["06", "Education Programme Planning", "Understand how an education awareness or support programme can be designed without claiming unverified beneficiaries."],
      ["07", "Common Mistakes", "Avoid misinformation, unsupported success claims and sharing outdated education information."],
      ["08", "Knowledge Check", "Review key concepts and identify responsible next steps for continued learning."],
    ],
  },
  {
    slug: "skill-development",
    category: "SSF Knowledge & Awareness",
    icon: FaBriefcase,
    title: "Skill Development & Livelihood",
    hi: "कौशल विकास एवं आजीविका",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn how practical skills, vocational training, entrepreneurship and livelihood planning can support self-reliance.",
    lessons: [
      ["01", "What Is Skill Development?", "Understand technical, digital, vocational, communication and workplace skills."],
      ["02", "Choosing a Useful Skill", "Assess interest, local demand, learning time, cost and realistic opportunities."],
      ["03", "Vocational & Practical Training", "Explore examples such as tailoring, computing, repair, food processing and rural skills."],
      ["04", "From Skill to Livelihood", "Understand the steps from learning and practice to service, employment or self-employment."],
      ["05", "Basic Business Thinking", "Learn about customers, pricing, quality, records, savings and responsible growth."],
      ["06", "Rural & Traditional Skills", "Understand how local crafts, village industries and traditional knowledge may support livelihoods."],
      ["07", "Training Programme Planning", "Learn how a skill-development awareness or training project can be structured."],
      ["08", "Knowledge Check", "Review the complete skill-to-livelihood pathway."],
    ],
  },
  {
    slug: "women-empowerment",
    category: "SSF Knowledge & Awareness",
    icon: FaUsers,
    title: "Women Empowerment & Economic Participation",
    hi: "महिला सशक्तिकरण एवं आर्थिक सहभागिता",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Understand education, safety, financial awareness, skills, self-help groups and participation without presenting planned work as completed activity.",
    lessons: [
      ["01", "Meaning of Empowerment", "Understand empowerment through education, agency, skills, safety, economic participation and informed decisions."],
      ["02", "Education & Skills", "Learn why education, digital literacy and practical skills can expand opportunities."],
      ["03", "Financial Awareness", "Understand budgeting, savings, documentation and safe financial decision-making."],
      ["04", "Self-Help Groups", "Learn the basic purpose, functioning and responsibilities of SHGs."],
      ["05", "Safety & Dignity", "Understand respectful communication, safety awareness and where to seek appropriate help."],
      ["06", "Livelihood Opportunities", "Explore employment, entrepreneurship, home-based and community-based livelihood models."],
      ["07", "Designing an Awareness Programme", "Learn how a responsible women-focused learning programme can be planned and documented."],
      ["08", "Knowledge Check", "Review key concepts and practical actions."],
    ],
  },
  {
    slug: "child-development",
    category: "SSF Knowledge & Awareness",
    icon: FaGraduationCap,
    title: "Child Development, Education & Protection",
    hi: "बाल विकास, शिक्षा एवं संरक्षण",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn the fundamentals of child development, education, nutrition awareness, safety and responsible community support.",
    lessons: [
      ["01", "Understanding Childhood", "Learn about physical, emotional, social and educational development."],
      ["02", "Learning & Early Development", "Understand the importance of supportive environments, play, reading and age-appropriate learning."],
      ["03", "Nutrition Awareness", "Learn basic concepts of balanced nutrition and the importance of professional guidance when needed."],
      ["04", "Child Safety", "Recognise common safety risks and the importance of trusted adults and appropriate reporting channels."],
      ["05", "Girls' Education", "Understand barriers to education and ways communities can encourage continued learning."],
      ["06", "Inclusive Support", "Learn how to avoid exclusion and support children with different needs respectfully."],
      ["07", "Responsible Community Programme", "Understand safe planning, safeguarding, consent, documentation and referral principles."],
      ["08", "Knowledge Check", "Review the complete learning module."],
    ],
  },
  {
    slug: "health-awareness",
    category: "SSF Knowledge & Awareness",
    icon: FaHeartbeat,
    title: "Health & Preventive Health Awareness",
    hi: "स्वास्थ्य एवं निवारक स्वास्थ्य जागरूकता",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn health-awareness fundamentals, prevention, healthy habits, screening awareness and when professional medical care is needed.",
    lessons: [
      ["01", "Health Is More Than Treatment", "Understand prevention, healthy habits, early attention and access to appropriate care."],
      ["02", "Everyday Healthy Practices", "Learn practical principles around hygiene, nutrition, physical activity, sleep and wellbeing."],
      ["03", "Screening Awareness", "Understand why screening can identify risks early and why results should be interpreted by qualified professionals."],
      ["04", "Common Health Risks", "Learn how awareness programmes can address non-communicable diseases and other public-health concerns."],
      ["05", "Nutrition & Malnutrition", "Understand basic nutrition concepts and the importance of professional assessment for suspected malnutrition."],
      ["06", "Substance Misuse Awareness", "Learn prevention, stigma reduction and the importance of professional de-addiction and rehabilitation services."],
      ["07", "Health Programme Ethics", "Avoid diagnosis, unsupported medical claims and unqualified treatment advice."],
      ["08", "Knowledge Check", "Review responsible health-awareness practices."],
    ],
  },
  {
    slug: "yoga-wellbeing",
    category: "SSF Knowledge & Awareness",
    icon: FaStar,
    title: "Yoga, Wellbeing & Healthy Living",
    hi: "योग, स्वास्थ्य एवं स्वस्थ जीवनशैली",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: false,
    description: "Learn general wellbeing concepts and responsible use of yoga and healthy-living practices without presenting them as medical treatment.",
  },
  {
    slug: "environment-conservation",
    category: "SSF Knowledge & Awareness",
    icon: FaLeaf,
    title: "Environment, Conservation & Biodiversity",
    hi: "पर्यावरण, संरक्षण एवं जैव विविधता",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Understand ecosystems, biodiversity, trees, natural resources, pollution prevention and community conservation.",
    lessons: [
      ["01", "Our Environment", "Understand ecosystems, air, water, soil and the relationship between people and nature."],
      ["02", "Biodiversity", "Learn what biodiversity means and why species and habitats matter."],
      ["03", "Trees & Forests", "Understand tree planting, survival, native species and long-term care—not just plantation counts."],
      ["04", "Water Conservation", "Learn practical approaches to water saving, groundwater awareness and community responsibility."],
      ["05", "Waste & Pollution", "Understand waste reduction, segregation, recycling and pollution-prevention principles."],
      ["06", "Climate Awareness", "Learn basic climate concepts, adaptation and responsible community action."],
      ["07", "Planning a Conservation Activity", "Learn how to design, document and monitor a genuine environmental activity."],
      ["08", "Knowledge Check", "Review the complete conservation learning pathway."],
    ],
  },
  {
    slug: "organic-farming",
    category: "SSF Knowledge & Awareness",
    icon: FaLeaf,
    title: "Organic Farming & Sustainable Agriculture",
    hi: "जैविक खेती एवं टिकाऊ कृषि",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn the principles of organic and sustainable farming, soil care, farm planning and responsible agricultural decision-making.",
    lessons: [
      ["01", "What Is Organic Farming?", "Understand the basic principles and how organic practices differ from conventional approaches."],
      ["02", "Soil Health", "Learn about soil organic matter, fertility, crop rotation and responsible soil management."],
      ["03", "Natural Inputs", "Understand common categories of organic inputs and why quality and correct use matter."],
      ["04", "Pest & Disease Management", "Learn integrated and preventive approaches rather than relying on unverified remedies."],
      ["05", "Water & Resource Efficiency", "Understand irrigation efficiency, water conservation and resource planning."],
      ["06", "Farm Economics", "Learn to consider costs, labour, yield, market access and risk before adopting a practice."],
      ["07", "Farmer Learning Programme", "Understand how a farmer-awareness or training programme can be designed and documented."],
      ["08", "Knowledge Check", "Review the sustainable agriculture pathway."],
    ],
  },
  {
    slug: "rural-development",
    category: "SSF Knowledge & Awareness",
    icon: FaUsers,
    title: "Rural Development & Community Development",
    hi: "ग्रामीण विकास एवं सामुदायिक विकास",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: false,
    description: "Understand community needs, local resources, participation, livelihoods and responsible rural programme planning.",
  },
  {
    slug: "renewable-energy",
    category: "SSF Knowledge & Awareness",
    icon: FaStar,
    title: "Renewable Energy & Energy Awareness",
    hi: "नवीकरणीय ऊर्जा एवं ऊर्जा जागरूकता",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: false,
    description: "Learn the basics of solar, wind, biomass, energy efficiency and responsible community energy awareness.",
  },
  {
    slug: "social-justice-rights",
    category: "SSF Knowledge & Awareness",
    icon: FaShieldAlt,
    title: "Social Justice, Human Rights & Civic Responsibility",
    hi: "सामाजिक न्याय, मानवाधिकार एवं नागरिक जिम्मेदारी",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Build foundational awareness of dignity, equality, rights, responsibilities, inclusion and peaceful community participation.",
    lessons: [
      ["01", "Dignity & Equality", "Understand the principles of equal dignity, non-discrimination and respectful participation."],
      ["02", "Human Rights Basics", "Learn the basic idea of rights and why reliable information matters."],
      ["03", "Responsibilities", "Understand that rights and social responsibilities operate together in a healthy community."],
      ["04", "Inclusion", "Learn how communities can reduce barriers faced by vulnerable and excluded groups."],
      ["05", "Ethics & Integrity", "Understand honesty, transparency and responsible communication in social work."],
      ["06", "Peace & Harmony", "Learn practical principles for respectful dialogue and community harmony."],
      ["07", "Awareness Campaign Planning", "Learn how to communicate social issues without misinformation, harassment or unsupported claims."],
      ["08", "Knowledge Check", "Review the complete module."],
    ],
  },
  {
    slug: "disability-inclusion",
    category: "SSF Knowledge & Awareness",
    icon: FaShieldAlt,
    title: "Disability Inclusion & Rehabilitation Awareness",
    hi: "दिव्यांग समावेशन एवं पुनर्वास जागरूकता",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: false,
    description: "Understand inclusion, accessibility, dignity, assistive support and rehabilitation pathways.",
  },
  {
    slug: "elderly-support",
    category: "SSF Knowledge & Awareness",
    icon: FaUsers,
    title: "Elderly Care & Dignity",
    hi: "वृद्धजन सहायता एवं सम्मान",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: false,
    description: "Learn about ageing, dignity, social connection, safety and responsible community support for older persons.",
  },
  {
    slug: "animal-welfare",
    category: "SSF Knowledge & Awareness",
    icon: FaShieldAlt,
    title: "Animal Welfare & Responsible Care",
    hi: "पशु कल्याण एवं जिम्मेदार देखभाल",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: false,
    description: "Understand humane treatment, basic welfare principles, responsible animal care and wildlife awareness.",
  },
  {
    slug: "youth-digital-literacy",
    category: "SSF Knowledge & Awareness",
    icon: FaLaptopCode,
    title: "Youth, Digital Literacy & Responsible Internet Use",
    hi: "युवा, डिजिटल साक्षरता एवं जिम्मेदार इंटरनेट उपयोग",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn digital basics, online safety, information literacy, responsible sharing and practical digital skills for young people.",
    lessons: [
      ["01", "Digital Literacy", "Understand devices, apps, browsers, files, accounts and basic online services."],
      ["02", "Information Literacy", "Learn how to check sources, dates, context and evidence before believing or sharing information."],
      ["03", "Passwords & Account Safety", "Understand strong passwords, multi-factor authentication and account recovery."],
      ["04", "Phishing & Scams", "Recognise suspicious messages, fake links, impersonation and common online fraud patterns."],
      ["05", "Privacy & Digital Footprint", "Learn what personal information should be protected and how online actions can persist."],
      ["06", "Responsible Social Media", "Learn respectful communication, consent before sharing others' information and avoiding misinformation."],
      ["07", "Digital Learning & Careers", "Explore safe use of online learning and professional resources."],
      ["08", "Knowledge Check", "Review practical digital-safety habits."],
    ],
  },
  {
    slug: "disaster-preparedness",
    category: "SSF Knowledge & Awareness",
    icon: FaShieldAlt,
    title: "Disaster Preparedness & Community Safety",
    hi: "आपदा तैयारी एवं सामुदायिक सुरक्षा",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: false,
    description: "Learn preparedness, risk awareness, emergency planning, communication and responsible community response.",
  },
  {
    slug: "culture-heritage",
    category: "SSF Knowledge & Awareness",
    icon: FaBookOpen,
    title: "Culture, Language, Arts & Heritage",
    hi: "संस्कृति, भाषा, कला एवं विरासत",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: false,
    description: "Learn how communities can understand, document and responsibly preserve cultural knowledge, language, arts and heritage.",
  },
  {
    slug: "grant-project-literacy",
    category: "SSF Knowledge & Awareness",
    icon: FaCertificate,
    title: "NGO Project & Grant Literacy",
    hi: "NGO Project एवं Grant की समझ",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn the difference between registered objectives, real activities, project design, eligibility, evidence, budgeting and grant applications.",
    lessons: [
      ["01", "Objectives vs Activities", "Understand why a registered objective does not by itself prove that an activity has been conducted."],
      ["02", "From Need to Project", "Learn the sequence: need assessment, target group, objective, activities, outputs and outcomes."],
      ["03", "Eligibility Is Scheme-Specific", "Understand why each government, CSR or donor opportunity has its own conditions."],
      ["04", "Documents & Compliance", "Learn why registrations, financial records, reports, policies and supporting documents may be required."],
      ["05", "Budget & Costing", "Understand realistic project budgeting and the importance of evidence for expenditure."],
      ["06", "Monitoring & Evidence", "Learn how attendance, photographs, reports, outputs and other records can support genuine programme documentation."],
      ["07", "Truthful Communication", "Never present planned, proposed or educational content as completed field impact."],
      ["08", "Knowledge Check", "Review the complete project-and-grant learning pathway."],
    ],
  },
];

const CATEGORIES = [
  ["All", "सभी"],
  ["English & Communication", "अंग्रेज़ी एवं संवाद"],
  ["Career & Jobs", "Career एवं Jobs"],
  ["Professional Writing", "Professional Writing"],
  ["Digital Skills", "Digital Skills"],
  ["Workplace Skills", "Workplace Skills"],
  ["Personal Development", "Personal Development"],
];

function getCourseFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("course") || "";
}

function shareCourse(course) {
  const url = `${window.location.origin}/LearningHub?course=${encodeURIComponent(course.slug)}`;
  if (navigator.share) {
    navigator.share({ title: `${course.title} | Swastik Srijan Foundation`, text: course.hi, url }).catch(() => {});
    return;
  }
  navigator.clipboard?.writeText(url).then(() => window.alert("Learning Path link copied."));
}

function CourseCard({ course, onOpen }) {
  const Icon = course.icon;
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#003366]/10 bg-[#003366]/10 text-4xl text-[#003366] shadow-inner" aria-hidden="true">
          <Icon />
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${course.ready ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
          {course.ready ? "Ready to Learn" : "Coming Soon"}
        </span>
      </div>
      <h3 className="text-xl font-black text-zinc-900">{course.title}</h3>
      <p className="mt-1 text-sm font-semibold text-[#003366]">{course.hi}</p>
      <p className="mt-4 flex-1 text-sm leading-6 text-zinc-600">{course.description}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-zinc-500">
        <span className="rounded-full bg-zinc-100 px-3 py-1">{course.level}</span>
        <span className="rounded-full bg-zinc-100 px-3 py-1">{course.language}</span>
      </div>
      <div className="mt-6 flex gap-2">
        <button onClick={() => onOpen(course)} className="flex-1 rounded-xl bg-[#003366] px-4 py-3 text-sm font-bold text-white hover:bg-[#002344]">
          {course.ready ? "Start Learning" : "View Path"} <FaArrowRight className="ml-1 inline" />
        </button>
        <button onClick={() => shareCourse(course)} aria-label="Share learning path" className="rounded-xl border border-zinc-200 px-4 py-3 text-[#003366] hover:bg-zinc-50">
          <FaShareAlt />
        </button>
      </div>
    </article>
  );
}

function CourseDetail({ course, onBack }) {
  const [completed, setCompleted] = useState([]);
  const [learnerName, setLearnerName] = useState("");

  useEffect(() => {
    const key = `ssf-learning-${course.slug}`;
    try { setCompleted(JSON.parse(localStorage.getItem(key) || "[]")); } catch { setCompleted([]); }
  }, [course.slug]);

  const toggleLesson = (index) => {
    const next = completed.includes(index) ? completed.filter((x) => x !== index) : [...completed, index];
    setCompleted(next);
    localStorage.setItem(`ssf-learning-${course.slug}`, JSON.stringify(next));
  };

  const progress = course.lessons?.length ? Math.round((completed.length / course.lessons.length) * 100) : 0;
  const certificateReady = course.ready && course.lessons?.length && progress === 100;

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-[#002344] px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white"><FaChevronLeft /> Back to Learning Hub</button>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">{course.category}</span>
              <h1 className="mt-6 text-4xl font-black md:text-6xl">{course.title}</h1>
              <p className="mt-3 text-xl font-semibold text-white/80">{course.hi}</p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">{course.description}</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="rounded-full bg-white/10 px-4 py-2">{course.level}</span>
                <span className="rounded-full bg-white/10 px-4 py-2">{course.language}</span>
                <span className="rounded-full bg-white/10 px-4 py-2">{course.duration}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <div className="text-sm font-bold text-white/70">YOUR PROGRESS</div>
              <div className="mt-4 text-4xl font-black">{progress}%</div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-sm text-white/70">{completed.length} of {course.lessons?.length || 0} lessons completed</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12">
        {!course.ready ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <FaGraduationCap className="mx-auto text-5xl text-[#003366]" />
            <h2 className="mt-5 text-3xl font-black">This learning path is being prepared</h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600">The structure is already reserved so SSF can add lessons, videos, practice activities and resources without changing the public Learning Hub.</p>
            <button onClick={onBack} className="mt-7 rounded-xl bg-[#003366] px-6 py-3 font-bold text-white">Browse Ready Courses</button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_330px]">
            <section>
              <div className="mb-8">
                <h2 className="text-3xl font-black">Course Lessons <span className="text-[#003366]">/ पाठ</span></h2>
                <p className="mt-2 text-zinc-600">Read the lesson, practise it, then mark it complete. Your progress is saved on this device.</p>
              </div>
              <div className="space-y-4">
                {(course.lessons || []).map(([no, title, description], index) => {
                  const done = completed.includes(index);
                  return (
                    <div key={no} className={`rounded-2xl border bg-white p-5 shadow-sm ${done ? "border-green-200" : "border-zinc-200"}`}>
                      <div className="flex items-start gap-4">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black ${done ? "bg-green-100 text-green-700" : "bg-[#003366]/10 text-[#003366]"}`}>
                          {done ? <FaCheckCircle /> : no}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-zinc-900">{title}</h3>
                          <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button onClick={() => toggleLesson(index)} className={`rounded-lg px-4 py-2 text-xs font-bold ${done ? "bg-green-50 text-green-700" : "bg-[#003366] text-white"}`}>
                              {done ? "Completed ✓" : "Mark Complete"}
                            </button>
                            <button onClick={() => window.alert("Video lesson placeholder — SSF can attach an official/free video from the Admin Learning Content module.")} className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-700">
                              <FaPlayCircle className="mr-1 inline" /> Video
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black">Free Resources</h3>
                <p className="mt-2 text-sm text-zinc-600">Curated links can supplement SSF's own learning material.</p>
                <div className="mt-5 space-y-3">
                  {(course.resources || []).map(([label, url]) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 text-sm font-bold text-[#003366] hover:bg-zinc-100">
                      {label}<FaExternalLinkAlt className="text-xs" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#003366]/10 bg-[#003366]/5 p-6">
                <FaCertificate className="text-3xl text-[#003366]" />
                <h3 className="mt-3 text-xl font-black">Completion Certificate</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">After all lessons and the required assessment are completed, SSF can issue a Certificate of Completion with a unique verification ID.</p>
                {certificateReady && (
                  <div className="mt-5 rounded-xl bg-white p-4">
                    <label className="text-xs font-bold text-zinc-500">Learner Name</label>
                    <input value={learnerName} onChange={(e) => setLearnerName(e.target.value)} placeholder="Enter your full name" className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#003366]" />
                    <button disabled={!learnerName.trim()} onClick={() => window.alert("Certificate issuance will be connected to the SSF verified certificate register and Admin approval workflow.")} className="mt-3 w-full rounded-lg bg-[#003366] px-4 py-3 text-sm font-bold text-white disabled:opacity-40">
                      Request Certificate
                    </button>
                  </div>
                )}
                {!certificateReady && <div className="mt-4 rounded-xl bg-white p-4 text-xs font-semibold text-zinc-500">Complete 100% of the lessons first.</div>}
              </div>

              <button onClick={() => shareCourse(course)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-[#003366]">
                <FaShareAlt /> Share this Learning Path
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default function LearningHub() {
  const [courseSlug, setCourseSlug] = useState(getCourseFromUrl);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const sync = () => setCourseSlug(getCourseFromUrl());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const openCourse = (course) => {
    const url = `/LearningHub?course=${encodeURIComponent(course.slug)}`;
    window.history.pushState({}, "", url);
    setCourseSlug(course.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToHub = () => {
    window.history.pushState({}, "", "/LearningHub");
    setCourseSlug("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedCourse = COURSES.find((c) => c.slug === courseSlug);

  const filtered = useMemo(() => COURSES.filter((course) => {
    const text = `${course.title} ${course.hi} ${course.category} ${course.description}`.toLowerCase();
    return (category === "All" || course.category === category) && text.includes(query.toLowerCase().trim());
  }), [category, query]);

  if (selectedCourse) return <CourseDetail course={selectedCourse} onBack={backToHub} />;

  return (
    <div className="min-h-screen bg-zinc-50 font-inria text-zinc-900">
      <section className="relative overflow-hidden bg-[#002344] px-4 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl pt-4 md:pt-6">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">
              <FaGraduationCap /> Swastik Srijan Foundation
            </div>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">SSF Learning Hub</h1>
            <h2 className="mt-3 text-2xl font-bold text-white/80 md:text-3xl">ज्ञान • कौशल • अवसर | Learn • Practise • Grow</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">
              Free, practical and accessible learning for education, career, communication, digital skills and personal development.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [String(COURSES.length), "Learning Paths", "Learning Paths"],
              [String(COURSES.filter((course) => course.ready).length), "Ready Now", "Ready Now"],
              ["Hindi + English", "Languages", "Languages"],
              ["Free", "Access", "Access"],
            ].map(([value, en, hi]) => (
              <div key={en} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                <div className="text-2xl font-black">{value}</div>
                <div className="mt-1 text-sm font-bold">{en}</div>
                <div className="text-xs text-white/60">{hi}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search learning paths / learning resources..." className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-4 pl-11 pr-4 outline-none focus:border-[#003366]" />
            </div>
            <Link to="/Contact" className="rounded-xl bg-[#003366] px-6 py-4 text-center text-sm font-bold text-white">Want to Teach / Volunteer?</Link>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(([en, hi]) => (
              <button key={en} onClick={() => setCategory(en)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${category === en ? "bg-[#003366] text-white" : "bg-zinc-100 text-zinc-600"}`}>
                {en}<span className="ml-1 opacity-70">/ {hi}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="py-14">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-[#003366]">Start Learning</div>
              <h2 className="mt-2 text-4xl font-black">Choose Your Learning Path</h2>
              <p className="mt-2 text-zinc-600">हर विषय को केवल एक label नहीं, बल्कि क्रमबद्ध learning path बनाया गया है—Introduction से Practical Learning, सावधानियों, examples और knowledge check तक।</p>
            </div>
            <div className="text-sm font-bold text-zinc-500">{filtered.length} paths</div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course) => <CourseCard key={course.slug} course={course} onOpen={openCourse} />)}
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-[#003366]/10 bg-white p-7 shadow-sm md:p-9">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#003366]/10 text-4xl text-[#003366]">
              <FaBookOpen />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-[#003366]">Knowledge • Awareness • Responsible Learning</div>
              <h2 className="mt-2 text-3xl font-black">जानिए • समझिए • जिम्मेदारी से सीखिए</h2>
              <p className="mt-3 max-w-4xl leading-7 text-zinc-600">
                SSF Learning Hub में संस्था के व्यापक objectives से जुड़े विषयों को learning modules के रूप में प्रस्तुत किया जा रहा है। जहाँ SSF की कोई field activity अभी नहीं हुई है, वहाँ सामग्री को केवल educational और awareness purpose के लिए रखा गया है—completed work या impact claim के रूप में नहीं।
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["01", "Understand", "विषय को समझें"],
                  ["02", "Learn", "पूरी जानकारी पढ़ें"],
                  ["03", "Practise", "व्यावहारिक रूप से सीखें"],
                  ["04", "Verify", "आगे के स्रोत जाँचें"],
                ].map(([n, en, hi]) => (
                  <div key={n} className="rounded-2xl bg-zinc-50 p-4">
                    <div className="text-xs font-black text-[#003366]">{n}</div>
                    <div className="mt-1 font-black text-zinc-900">{en}</div>
                    <div className="text-xs text-zinc-500">{hi}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 py-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-7 shadow-sm border border-zinc-200">
            <FaBookOpen className="text-3xl text-[#003366]" />
            <h3 className="mt-4 text-xl font-black">Text + Practice</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">हर learning path में step-by-step content, practice और progress tracking का आधार रहेगा।</p>
          </div>
          <div className="rounded-2xl bg-white p-7 shadow-sm border border-zinc-200">
            <FaPlayCircle className="text-3xl text-[#003366]" />
            <h3 className="mt-4 text-xl font-black">Video Learning</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Admin से official/free videos जोड़ने की जगह तैयार है; हर lesson अलग video resource ले सकेगा।</p>
          </div>
          <div className="rounded-2xl bg-white p-7 shadow-sm border border-zinc-200">
            <FaShieldAlt className="text-3xl text-[#003366]" />
            <h3 className="mt-4 text-xl font-black">Certificate & Verification</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Course completion के बाद verified Certificate of Completion और future QR verification workflow जोड़ा जाएगा।</p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-[#003366] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-white/60">Next Stage</div>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">200–300 learning resources के लिए तैयार architecture</h2>
              <p className="mt-4 max-w-3xl leading-7 text-white/75">
                Learning paths को बाद में Admin से lessons, PDFs, videos, quizzes, external free resources, thumbnails और publish status के साथ बढ़ाया जा सकेगा। Public page पर केवल published content दिखेगा।
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 text-center">
              <div className="text-4xl font-black">∞</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-widest text-white/70">Expandable</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
