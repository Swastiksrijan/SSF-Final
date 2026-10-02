import { useMemo, useState } from "react";
import {
  FaArrowLeft, FaArrowRight, FaBookOpen, FaCheckCircle, FaClock, FaGraduationCap,
  FaLeaf, FaLaptop, FaPlayCircle, FaQuestionCircle, FaSearch, FaShareAlt,
  FaShieldAlt, FaUsers, FaHeartbeat, FaSeedling, FaPaw, FaBalanceScale, FaChild,
  FaBriefcase, FaComments, FaUniversalAccess, FaHandsHelping
} from "react-icons/fa";
import { FLAGSHIP_COURSES, FLAGSHIP_COURSE_ASSESSMENTS } from "../data/learningHubCourseArchitecture";
import { ALL_STRUCTURED_COURSES, COURSE_ASSESSMENTS } from "../data/coursesData";
import { ENDPOINTS } from "../config/api";
import { ENGLISH_FROM_BASICS_COURSE, ENGLISH_FROM_BASICS_ASSESSMENTS } from "../data/englishFromBasicsContent";

const HUB_IMAGES = {
  education: "/images/real/classroom-floor-seating.jpg",
  skills: "/images/real/women_empowerment_tailoring.jpg",
  women: "/images/real/women_community_meeting.jpg",
  health: "/images/real/nutrition_program.jpg",
  environment: "/images/real/tree_plantation.jpg",
  agriculture: "/images/real/journey-seeds.jpg",
  justice: "/images/real/integrity-pledge.jpg",
  disability: "/images/real/community-education-meeting.jpg",
  animal: "/images/real/foundation_banner.jpg",
  culture: "/images/real/foundation_banner.jpg",
  digital: "/images/real/computer-donation-clipping.jpg",
  disaster: "/images/real/office_banner.jpg",
  career: "/images/real/academy_banner_wide.jpg",
  community: "/images/real/ngo_event_1.jpg",
  children: "/images/real/children-gathering.jpg"
};

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
  "NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान": { key:"community", icon:FaBookOpen, color:"from-[#003049] to-[#669bbc]" }
};

const TOPICS = [
  ["Education / शिक्षा", "Primary Education / प्राथमिक शिक्षा", "बुनियादी पढ़ना, लिखना, गणना, समझ और सीखने की मजबूत आदतें।"],
  ["Education / शिक्षा", "Secondary Education / माध्यमिक शिक्षा", "विषय ज्ञान, critical thinking, परीक्षा और आगे की पढ़ाई की तैयारी।"],
  ["Education / शिक्षा", "Higher Secondary Education / उच्च माध्यमिक शिक्षा", "विषय चयन, परीक्षा तैयारी, career awareness और आगे के विकल्प।"],
  ["Education / शिक्षा", "College & Higher Education / कॉलेज एवं उच्च शिक्षा", "Higher education, academic discipline, research, internships और lifelong learning।"],
  ["Education / शिक्षा", "Computer Education / कंप्यूटर शिक्षा", "Computer hardware, software, files और सुरक्षित digital work की आधारभूत समझ।"],
  ["Education / शिक्षा", "Nursing Education / नर्सिंग शिक्षा", "Nursing education, patient care, hygiene, observation और professional ethics की शैक्षिक समझ।"],
  ["Education / शिक्षा", "Technical Education / तकनीकी शिक्षा", "Technical fields, recognised training pathways और practical skill development।"],
  ["Education / शिक्षा", "Competitive Exam Preparation / प्रतियोगी परीक्षा तैयारी", "Syllabus, study plan, previous papers, mock tests और revision strategy।"],
  ["Education / शिक्षा", "Library & Reading / पुस्तकालय एवं पठन", "Reading habits, reference material, notes और critical thinking।"],
  ["Education / शिक्षा", "Science Fairs / विज्ञान मेले", "Observation, questions, safe experiments, data और evidence-based presentation।"],

  ["English & Communication / अंग्रेज़ी एवं संचार", "English from Basics / मूल अंग्रेज़ी", "Alphabet, vocabulary, sentence formation, reading, listening और speaking की शुरुआत।"],
  ["English & Communication / अंग्रेज़ी एवं संचार", "Spoken English / बोलचाल की अंग्रेज़ी", "दैनिक जीवन, introductions, questions, phone, travel और conversation practice।"],
  ["English & Communication / अंग्रेज़ी एवं संचार", "English Grammar / अंग्रेज़ी व्याकरण", "Words, sentence structure, tense, articles, prepositions और common errors।"],
  ["English & Communication / अंग्रेज़ी एवं संचार", "Vocabulary Building / शब्द भंडार", "नए शब्द समझना, याद रखना, context में प्रयोग और revision।"],
  ["English & Communication / अंग्रेज़ी एवं संचार", "Reading & Writing / पठन एवं लेखन", "Short texts समझना, ideas organise करना और स्पष्ट writing।"],
  ["English & Communication / अंग्रेज़ी एवं संचार", "Professional Communication / प्रोफेशनल संचार", "Office, meetings, clients और colleagues के साथ respectful communication।"],
  ["English & Communication / अंग्रेज़ी एवं संचार", "Public Speaking / सार्वजनिक बोलना", "Speech structure, voice, body language, examples और audience handling।"],
  ["English & Communication / अंग्रेज़ी एवं संचार", "Email & Message Writing / ईमेल एवं संदेश लेखन", "Clear subject, context, request, attachments, follow-up और privacy।"],

  ["Digital Skills / डिजिटल कौशल", "Computer & Digital Basics / कंप्यूटर एवं डिजिटल बेसिक्स", "Devices, operating systems, files, typing, browser और everyday digital work।"],
  ["Digital Skills / डिजिटल कौशल", "Internet Basics / इंटरनेट की मूल जानकारी", "Browser, search, websites, downloads, bookmarks और safe browsing।"],
  ["Digital Skills / डिजिटल कौशल", "Google Workspace / Google Workspace", "Gmail, Drive, Docs, Sheets, Forms, Calendar और collaboration।"],
  ["Digital Skills / डिजिटल कौशल", "Digital Literacy / डिजिटल साक्षरता", "Devices, online services, information verification और responsible digital behaviour।"],
  ["Digital Skills / डिजिटल कौशल", "Cyber Safety / साइबर सुरक्षा", "Passwords, MFA, phishing, scams, privacy और incident response।"],
  ["Digital Skills / डिजिटल कौशल", "Online Safety & Privacy / ऑनलाइन सुरक्षा एवं गोपनीयता", "Personal data, permissions, social media और safe sharing।"],
  ["Digital Skills / डिजिटल कौशल", "Digital Payments Awareness / डिजिटल भुगतान जागरूकता", "Safe payment habits, verification और OTP/PIN सुरक्षा की basic awareness।"],

  ["Career & Workplace / करियर एवं कार्यस्थल", "Career Planning / करियर योजना", "अपनी education, skills, interests और opportunities को समझकर योजना बनाना।"],
  ["Career & Workplace / करियर एवं कार्यस्थल", "Job Search / नौकरी खोजने की तैयारी", "Reliable opportunities, job descriptions, applications, networking और fraud awareness।"],
  ["Career & Workplace / करियर एवं कार्यस्थल", "Resume & CV / Resume एवं CV", "Truthful profile, education, skills, projects, experience और formatting।"],
  ["Career & Workplace / करियर एवं कार्यस्थल", "Interview Preparation / साक्षात्कार तैयारी", "Introduction, common questions, body language और mock interview।"],
  ["Career & Workplace / करियर एवं कार्यस्थल", "Workplace Etiquette / कार्यस्थल व्यवहार", "Punctuality, communication, meetings, boundaries और professional conduct।"],
  ["Career & Workplace / करियर एवं कार्यस्थल", "Teamwork & Leadership / टीमवर्क एवं नेतृत्व", "Roles, responsibility, listening, problem solving, delegation और ethical leadership।"],
  ["Career & Workplace / करियर एवं कार्यस्थल", "Time Management / समय प्रबंधन", "Priorities, planning, deadlines, routines और review।"],
  ["Career & Workplace / करियर एवं कार्यस्थल", "Professional Email / Professional Email लेखन", "Requests, updates, applications, meetings और follow-ups के लिए email।"],

  ["Skill Development / कौशल विकास", "Computer Training / कंप्यूटर प्रशिक्षण", "Practical digital workplace skills और सुरक्षित everyday workflows।"],
  ["Skill Development / कौशल विकास", "Tailoring & Embroidery / सिलाई एवं कढ़ाई", "Tools, measurement, basic patterns, finishing, costing और practice projects।"],
  ["Skill Development / कौशल विकास", "Self-Employment / स्वरोजगार", "Skill को service/product में बदलने, customer, cost और records की समझ।"],
  ["Skill Development / कौशल विकास", "Vocational Training / व्यावसायिक प्रशिक्षण", "Job-oriented training, eligibility, recognised providers और competency development।"],
  ["Skill Development / कौशल विकास", "Rural Industries / ग्रामीण उद्योग", "Local resources, value addition, quality, packaging और market linkage।"],
  ["Skill Development / कौशल विकास", "Khadi & Village Industries / खादी एवं ग्रामोद्योग", "Traditional production, local employment, quality और enterprise concepts।"],
  ["Skill Development / कौशल विकास", "Entrepreneurship Basics / उद्यमिता की मूल बातें", "Problem, customer, value, cost, risk और small pilot business।"],

  ["Women & Child Development / महिला एवं बाल विकास", "Women Empowerment / महिला सशक्तिकरण", "Education, economic participation, safety, rights और decision-making।"],
  ["Women & Child Development / महिला एवं बाल विकास", "Girls' Education / बालिका शिक्षा", "Education continuity, safe learning, digital access और future opportunities।"],
  ["Women & Child Development / महिला एवं बाल विकास", "Prevention of Female Foeticide / भ्रूण लिंग चयन की रोकथाम", "Gender equality, discrimination और lawful healthcare practices की awareness।"],
  ["Women & Child Development / महिला एवं बाल विकास", "Widow Support / विधवा सहयोग", "Dignity, inclusion, livelihood, documentation और available support systems।"],
  ["Women & Child Development / महिला एवं बाल विकास", "Women Shelter & Support / महिला आश्रय एवं सहयोग", "Safety, shelter, counselling, privacy और rehabilitation concepts।"],
  ["Women & Child Development / महिला एवं बाल विकास", "Balwadi & Early Childhood / बालवाड़ी एवं प्रारंभिक बाल शिक्षा", "Play-based learning, language, motor skills, nutrition और safe environment।"],
  ["Women & Child Development / महिला एवं बाल विकास", "Child Rights / बाल अधिकार", "Protection, participation, development, education और dignity।"],
  ["Women & Child Development / महिला एवं बाल विकास", "Child Nutrition / बाल पोषण", "Age-appropriate nutrition, hygiene, growth and nutrition awareness।"],
  ["Women & Child Development / महिला एवं बाल विकास", "Self-Help Groups / स्वयं सहायता समूह", "Savings, meetings, records, collective decisions और livelihood learning।"],

  ["Health / स्वास्थ्य", "Health & Well-being / स्वास्थ्य एवं कल्याण", "Preventive habits, healthy lifestyle और qualified care कब लेना है।"],
  ["Health / स्वास्थ्य", "AIDS Awareness / HIV-AIDS जागरूकता", "Transmission, prevention, testing, treatment और stigma reduction।"],
  ["Health / स्वास्थ्य", "Cancer Awareness / कैंसर जागरूकता", "Risk factors, prevention, warning signs और screening concepts।"],
  ["Health / स्वास्थ्य", "Malnutrition / कुपोषण", "Causes, signs, prevention, food diversity और nutrition support।"],
  ["Health / स्वास्थ्य", "Naturopathy / प्राकृतिक स्वास्थ्य पद्धतियाँ", "Lifestyle and natural approaches के concepts और safety limitations।"],
  ["Health / स्वास्थ्य", "Yoga / योग", "Movement, breathing, relaxation और safe wellbeing practice की basic understanding।"],
  ["Health / स्वास्थ्य", "Family Welfare / परिवार कल्याण", "Family health, reproductive health, informed choice और responsible parenthood।"],
  ["Health / स्वास्थ्य", "De-addiction / नशामुक्ति", "Substance use effects, recovery support, professional help और stigma-free approach।"],
  ["Health / स्वास्थ्य", "Rehabilitation / पुनर्वास", "Functional recovery, accessibility, social participation और coordinated support।"],
  ["Health / स्वास्थ्य", "Personal Hygiene / व्यक्तिगत स्वच्छता", "Hand hygiene, sanitation, oral care, safe food and daily habits।"],

  ["Environment / पर्यावरण", "Environment Basics / पर्यावरण की मूल बातें", "Air, water, soil, ecosystems और human-environment relationship।"],
  ["Environment / पर्यावरण", "Tree Plantation / वृक्षारोपण", "Right species, planting, watering, survival और long-term care।"],
  ["Environment / पर्यावरण", "Biodiversity / जैव विविधता", "Plants, animals, microorganisms, habitats और ecological balance।"],
  ["Environment / पर्यावरण", "Forest Conservation / वन संरक्षण", "Ecological, social and livelihood roles of forests।"],
  ["Environment / पर्यावरण", "Natural Resource Conservation / प्राकृतिक संसाधन संरक्षण", "Water, soil, land, forests और responsible use।"],
  ["Environment / पर्यावरण", "Medicinal Plants / औषधीय पौधे", "Identification, traditional knowledge और safe evidence-aware use।"],
  ["Environment / पर्यावरण", "Organic Farming / जैविक खेती", "Soil health, organic inputs, biodiversity और crop planning।"],
  ["Environment / पर्यावरण", "Renewable Energy / नवीकरणीय ऊर्जा", "Solar, wind, biomass, energy efficiency और responsible adoption।"],
  ["Environment / पर्यावरण", "Climate Change / जलवायु परिवर्तन", "Causes, impacts, adaptation, mitigation और local action।"],
  ["Environment / पर्यावरण", "Waste Management / कचरा प्रबंधन", "Reduce, reuse, segregation, recycling और safe disposal।"],
  ["Environment / पर्यावरण", "Water Conservation / जल संरक्षण", "Water use, rainwater, recharge, reuse और community responsibility।"],

  ["Agriculture & Rural Development / कृषि एवं ग्रामीण विकास", "Agriculture Basics / कृषि की मूल बातें", "Crops, soil, water, inputs, seasons and farm planning।"],
  ["Agriculture & Rural Development / कृषि एवं ग्रामीण विकास", "Farmer Training / किसान प्रशिक्षण", "Crop planning, soil, water, inputs, market and risk management।"],
  ["Agriculture & Rural Development / कृषि एवं ग्रामीण विकास", "Organic Farming / जैविक खेती", "Soil health, compost, crop planning and ecological practices।"],
  ["Agriculture & Rural Development / कृषि एवं ग्रामीण विकास", "Animal Husbandry / पशुपालन", "Nutrition, housing, hygiene, vaccination and veterinary care।"],
  ["Agriculture & Rural Development / कृषि एवं ग्रामीण विकास", "Cow Protection / गौ संरक्षण", "Cattle welfare, shelter, feeding, water, hygiene and humane care।"],
  ["Agriculture & Rural Development / कृषि एवं ग्रामीण विकास", "Rural Development / ग्रामीण विकास", "Education, health, infrastructure, livelihoods, participation and local institutions।"],
  ["Agriculture & Rural Development / कृषि एवं ग्रामीण विकास", "Rural Livelihood / ग्रामीण आजीविका", "Farm and non-farm livelihood options, skills, demand, cost and market linkage।"],
  ["Agriculture & Rural Development / कृषि एवं ग्रामीण विकास", "Self-Reliant Village / आत्मनिर्भर गाँव", "Local resources, skills, services, participation and sustainable development।"],

  ["Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य", "Social Justice / सामाजिक न्याय", "Equality, dignity, opportunity and responsible participation।"],
  ["Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य", "Human Rights / मानवाधिकार", "Dignity, equality, liberty, safety and basic rights concepts।"],
  ["Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य", "Moral Education / नैतिक शिक्षा", "Honesty, responsibility, empathy, fairness and consequences।"],
  ["Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य", "Corruption Awareness / भ्रष्टाचार जागरूकता", "Transparency, accountability, lawful processes and grievance awareness।"],
  ["Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य", "National Unity / राष्ट्रीय एकता", "Diversity, constitutional values and responsible citizenship।"],
  ["Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य", "Communal Harmony / सामुदायिक सद्भाव", "Respect, dialogue, coexistence and responsible information sharing।"],
  ["Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य", "Civic Responsibility / नागरिक जिम्मेदारी", "Rights, duties, public spaces, participation and lawful conduct।"],

  ["Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास", "Disability Awareness / दिव्यांगता जागरूकता", "Disability, accessibility, dignity and inclusion।"],
  ["Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास", "Disability Assistance / दिव्यांगता सहयोग", "Accessible services, assistive support and person-centred help।"],
  ["Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास", "Inclusive Education / समावेशी शिक्षा", "Learning access, reasonable support and inclusive classroom practices।"],
  ["Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास", "Rehabilitation / पुनर्वास", "Functional, social and community participation support।"],
  ["Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास", "Elderly Support / वरिष्ठ नागरिक सहयोग", "Dignity, safety, health support, social connection and inclusion।"],
  ["Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास", "Vulnerable Child Support / असुरक्षित बच्चों का सहयोग", "Child protection, education, nutrition, identity and safe care systems।"],

  ["Animal Protection / पशु संरक्षण", "Animal & Bird Protection / पशु-पक्षी संरक्षण", "Animal welfare, humane treatment and responsible coexistence।"],
  ["Animal Protection / पशु संरक्षण", "Gaushala / गौशाला", "Nutrition, sanitation, veterinary care, capacity and records।"],
  ["Animal Protection / पशु संरक्षण", "Wildlife Conservation / वन्यजीव संरक्षण", "Wildlife, habitat, ecological balance and safe coexistence।"],
  ["Animal Protection / पशु संरक्षण", "Responsible Animal Care / जिम्मेदार पशु देखभाल", "Food, water, shelter, hygiene, humane handling and veterinary support।"],

  ["Culture & Heritage / संस्कृति एवं विरासत", "Bhajan & Devotional Music / भजन एवं भक्तिमय संगीत", "Tradition, language, rhythm, meaning and cultural role।"],
  ["Culture & Heritage / संस्कृति एवं विरासत", "Sanskrit Education / संस्कृत शिक्षा", "Script, vocabulary, grammar, literature and authentic texts।"],
  ["Culture & Heritage / संस्कृति एवं विरासत", "Music / संगीत", "Swar, taal, rhythm, listening, practice and musical traditions।"],
  ["Culture & Heritage / संस्कृति एवं विरासत", "Conferences & Knowledge Events / सम्मेलन एवं ज्ञान कार्यक्रम", "Agenda, speakers, questions, documentation and learning records।"],
  ["Culture & Heritage / संस्कृति एवं विरासत", "Cultural Programmes / सांस्कृतिक कार्यक्रम", "Local art, language, heritage, consent and cultural sensitivity।"],

  ["Youth & Disaster Preparedness / युवा एवं आपदा तैयारी", "Youth Development / युवा विकास", "Skills, confidence, career awareness, civic responsibility and participation।"],
  ["Youth & Disaster Preparedness / युवा एवं आपदा तैयारी", "Disaster Preparedness / आपदा तैयारी", "Hazards, warnings, emergency kit, family plan and evacuation।"],
  ["Youth & Disaster Preparedness / युवा एवं आपदा तैयारी", "Disaster Relief / आपदा राहत", "Safe response, coordination, documentation and rehabilitation principles।"],
  ["Youth & Disaster Preparedness / युवा एवं आपदा तैयारी", "Community Emergency Planning / सामुदायिक आपदा योजना", "Local hazards, contacts, vulnerable groups, resources and drills।"],

  ["Personal Development / व्यक्तिगत विकास", "Self Awareness / आत्म-जागरूकता", "Strengths, limitations, values, interests and learning goals।"],
  ["Personal Development / व्यक्तिगत विकास", "Confidence Building / आत्मविश्वास", "Preparation, practice, gradual exposure and constructive feedback।"],
  ["Personal Development / व्यक्तिगत विकास", "Goal Setting / लक्ष्य निर्धारण", "Clear goals, priorities, timelines, action and review।"],
  ["Personal Development / व्यक्तिगत विकास", "Problem Solving / समस्या समाधान", "Define, analyse, compare options, act and review।"],
  ["Personal Development / व्यक्तिगत विकास", "Decision Making / निर्णय लेना", "Facts, options, risks, values and consequences।"],
  ["Personal Development / व्यक्तिगत विकास", "Creativity / रचनात्मकता", "Observation, ideas, experimentation and improvement।"],

  ["NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान", "What is an NGO? / NGO क्या है?", "NGO purpose, governance, community work and accountability।"],
  ["NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान", "Project Planning / परियोजना योजना", "Problem, objectives, activities, timeline, budget and indicators।"],
  ["NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान", "Grant Literacy / अनुदान की समझ", "Eligibility, guidelines, documents, application and compliance।"],
  ["NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान", "Budget & Financial Planning / बजट एवं वित्तीय योजना", "Units, quantities, assumptions, costs, records and variance।"],
  ["NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान", "Monitoring & Evaluation / निगरानी एवं मूल्यांकन", "Outputs, outcomes, indicators, evidence and learning loops।"],
  ["NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान", "Reporting & Documentation / रिपोर्टिंग एवं दस्तावेजीकरण", "Accurate records, evidence, narrative reports and responsible claims।"],
  ["NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान", "Safeguarding & Ethics / सुरक्षा एवं नैतिकता", "Consent, privacy, dignity, child safety and do-no-harm principles।"]
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, "-").replace(/^-|-$/g, "");
const makeSubjectVisual = (category, title, index) => { const bg=["#003366","#0f4c81","#2d6a4f","#8b1e3f","#9d0208","#386641","#463f3a","#264653","#6b4f3a","#6d597a","#33415c","#005f73","#003049"][index%13]; const esc=(s)=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); const svg="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1200\" height=\"700\"><rect width=\"1200\" height=\"700\" fill=\""+bg+"\"/><circle cx=\"1000\" cy=\"110\" r=\"180\" fill=\"white\" opacity=\".08\"/><circle cx=\"170\" cy=\"590\" r=\"240\" fill=\"white\" opacity=\".06\"/><text x=\"80\" y=\"120\" font-family=\"Arial\" font-size=\"28\" font-weight=\"700\" fill=\"white\" opacity=\".8\">SSF LEARNING HUB • "+esc(category.split(" / ")[0])+"</text><text x=\"80\" y=\"270\" font-family=\"Arial\" font-size=\"56\" font-weight=\"800\" fill=\"white\">"+esc(title.split(" / ")[0])+"</text><text x=\"80\" y=\"340\" font-family=\"Arial\" font-size=\"28\" fill=\"white\" opacity=\".82\">Learn • Understand • Practise • Share</text><path d=\"M80 420H1120\" stroke=\"white\" stroke-opacity=\".2\" stroke-width=\"3\"/><text x=\"80\" y=\"500\" font-family=\"Arial\" font-size=\"22\" fill=\"white\" opacity=\".72\">Subject "+String(index+1).padStart(3,"0")+"</text><text x=\"80\" y=\"550\" font-family=\"Arial\" font-size=\"22\" fill=\"white\" opacity=\".65\">Swastik Srijan Foundation</text></svg>"; return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg); };

const buildSubject = ([category, title, intro], index) => {
  const meta = CATEGORY_META[category] || CATEGORY_META["Education / शिक्षा"];
  const [en, hi] = title.split(" / ");
  return {
    id: slugify(title),
    category, title, intro, en, hi,
    image: makeSubjectVisual(category,title,index),
    categoryImage: HUB_IMAGES[meta.key],
    icon: meta.icon,
    color: meta.color,
    number: String(index + 1).padStart(2, "0")
  };
};

const SUBJECTS = TOPICS.map(buildSubject);

function shareSubject(subject) {
  const url = window.location.href.split("?")[0] + "?subject=" + encodeURIComponent(subject.id);
  if (navigator.share) navigator.share({ title: subject.title + " | SSF Learning Hub", text: subject.intro, url }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => window.alert("Learning link copied."));
}

function getSubjectFromUrl() {
  return new URLSearchParams(window.location.search).get("subject") || "";
}

const buildTopicModules = (subject) => {
  const topic = subject.en;
  const intro = subject.intro;
  const bilingual = (en, hi) => en + " / " + hi;
  const makeLesson = (en, hi, body, practice, examples) => [
    bilingual(en, hi),
    body,
    {
      objectives: "Understand " + en.toLowerCase() + " in the context of " + topic + ".",
      content: {
        deepUnderstanding: body + " इसे " + topic + " के वास्तविक संदर्भ, उपलब्ध संसाधनों और स्थानीय परिस्थितियों से जोड़कर समझें।",
        examples,
        commonMistakes: ["केवल definition याद करके practical use को छोड़ देना", "बिना context या evidence के निष्कर्ष निकालना", "सीखी बात को review और practice के बिना complete मान लेना"],
        summary: "मुख्य विचार को समझें, उदाहरण देखें, सुरक्षित अभ्यास करें और परिणाम की समीक्षा करें।"
      },
      practice: [practice, "अपने शब्दों में 3 मुख्य बातें लिखें और " + topic + " से जुड़ा एक वास्तविक उदाहरण दें।"],
      activity: practice
    }
  ];
  return [
    { title: bilingual("Foundation","आधार"), subtitle:"अर्थ, उद्देश्य, पृष्ठभूमि और मूल शब्दावली", lessons:[
      makeLesson("What is " + topic + "?","यह विषय क्या है?",intro+" इस पाठ में विषय का अर्थ, scope और basic vocabulary समझें।","विषय के 5 प्रमुख शब्द लिखें और प्रत्येक का सरल अर्थ बताएं।",[topic+" की सरल परिभाषा","मुख्य उद्देश्य","प्रमुख शब्द","विषय की सीमा"]),
      makeLesson("Why does it matter?","यह क्यों महत्वपूर्ण है?",topic+" का महत्व उसके practical use, लोगों पर प्रभाव, अवसरों और सीमाओं से समझा जाता है।","अपने आसपास "+topic+" से जुड़ी 3 वास्तविक स्थितियाँ पहचानें।",["दैनिक जीवन","समुदाय","शिक्षा/काम","अवसर और सीमाएँ"]),
      makeLesson("Background & Development","पृष्ठभूमि एवं विकास",topic+" समय के साथ जरूरतों, अनुभवों, तकनीक और सामाजिक परिस्थितियों के अनुसार विकसित हुआ है। विकास समझने से current practices का context स्पष्ट होता है।","विषय के विकास की एक छोटी timeline बनाएं: पहले, बदलाव और आज।",["पृष्ठभूमि","मुख्य बदलाव","आज का संदर्भ","भविष्य की जरूरतें"])
    ]},
    { title:bilingual("Core Knowledge","मूल ज्ञान"), subtitle:"मुख्य concepts, प्रकार, घटक और relationships", lessons:[
      makeLesson("Key Concepts","प्रमुख अवधारणाएँ",topic+" को समझने के लिए उसके मुख्य concepts को अलग-अलग पहचानना और फिर उनके बीच संबंध देखना जरूरी है।","कम-से-कम 5 concepts की mind-map बनाएं और उनके बीच arrows से संबंध दिखाएं।",["मुख्य concept","उद्देश्य","कारण-परिणाम","आपसी संबंध"]),
      makeLesson("Types & Components","प्रकार एवं घटक",topic+" में अलग-अलग types, components, roles या approaches हो सकते हैं। इन्हें category और purpose के आधार पर compare करना सीखें।","विषय के 3 types/components की तुलना table में करें।",["Type A/B/C","भूमिका","उपयोग","अंतर"]),
      makeLesson("Examples & Case Thinking","उदाहरण एवं केस","किसी concept को वास्तविक case में पहचानना learning को मजबूत करता है। Case को facts, context, problem, options और outcome के आधार पर पढ़ें।","एक वास्तविक या काल्पनिक case लिखें और उसमें problem, options और expected outcome पहचानें।",["Situation","Problem","Possible options","Outcome"])
    ]},
    { title:bilingual("Practice & Application","अभ्यास एवं प्रयोग"), subtitle:"ज्ञान को practical capability में बदलना", lessons:[
      makeLesson("Step-by-step Practice","चरणबद्ध अभ्यास",topic+" सीखते समय task को छोटे steps में बाँटें: उद्देश्य तय करें, जानकारी जुटाएं, सुरक्षित तरीके से practice करें और result देखें।","एक छोटा task चुनकर उसके 5 steps लिखें और पूरा होने के बाद result note करें।",["Goal","Resources","Steps","Result"]),
      makeLesson("Common Mistakes","सामान्य गलतियाँ",topic+" में mistakes अक्सर अधूरी जानकारी, गलत assumptions, जल्दबाजी या review की कमी से होती हैं। गलती को failure नहीं बल्कि feedback की तरह देखें।","विषय से जुड़ी 5 संभावित गलतियाँ लिखें और प्रत्येक के सामने सुधार का तरीका लिखें।",["Mistake","Possible cause","Correction","Prevention"]),
      makeLesson("Real-world Application","वास्तविक उपयोग",topic+" का practical application करते समय local context, available resources, safety, ethics और measurable results पर ध्यान दें।","अपने क्षेत्र में topic का एक छोटा उपयोग चुनें और action → result → review लिखें।",["Context","Action","Result","Improvement"])
    ]},
    { title:bilingual("Advanced Learning","उन्नत सीख"), subtitle:"विश्लेषण, समस्या समाधान और जिम्मेदार practice", lessons:[
      makeLesson("Analysis","विश्लेषण",topic+" से जुड़ी information को source, evidence, context और cause-effect के आधार पर analyse करें। अलग facts और opinions को पहचानें।","एक claim चुनें और लिखें: evidence क्या है, source कौन है और कौन-सी information अभी missing है।",["Facts vs opinions","Evidence","Context","Cause-effect"]),
      makeLesson("Problem Solving","समस्या समाधान",topic+" की समस्या को पहले स्पष्ट रूप से define करें, फिर root cause, constraints और possible solutions की तुलना करें।","एक problem को Why? पूछते हुए root cause तक break down करें और 2 solutions compare करें।",["Problem definition","Root cause","Options","Review"]),
      makeLesson("Professional Practice","व्यावहारिक दक्षता",topic+" को responsible तरीके से लागू करने में quality, communication, ethics, safety, documentation और continuous improvement महत्वपूर्ण हैं।","एक professional checklist बनाएं जिसमें quality, safety, ethics, documentation और review शामिल हों।",["Quality","Ethics","Safety","Documentation"])
    ]},
    { title:bilingual("Assessment & Next Step","आकलन एवं अगला चरण"), subtitle:"Revision, assessment और आगे की learning", lessons:[
      makeLesson("Revision","पुनरावृत्ति","Revision का उद्देश्य केवल पढ़ना दोहराना नहीं बल्कि recall, examples, practice और weak areas की पहचान करना है।","बिना notes देखे 10 points लिखें, फिर notes से मिलाकर missing points जोड़ें।",["Recall","Weak areas","Practice","Review"]),
      makeLesson("Final Assessment","अंतिम आकलन","Final assessment में definition के साथ understanding, application, analysis और responsible use की जाँच करें।","अपने लिए 10 questions बनाएं: 3 knowledge, 3 understanding, 2 application और 2 analysis।",["Knowledge","Understanding","Application","Analysis"]),
      makeLesson("Learning Path","आगे की सीख","Course के बाद अगले level का चुनाव आपकी रुचि, current skill, practice needs और learning goal पर निर्भर होना चाहिए।","अपने लिए 30-day next-learning plan बनाएं जिसमें topic, practice, resource और review date हो।",["Next level","Practice goal","Resource","Review date"])
    ]}
  ];
};

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
  const [moduleResults, setModuleResults] = useState(() => {
    try { return JSON.parse(localStorage.getItem(progressKey + "-assessments") || "{}"); } catch { return {}; }
  });

  const structuredCourseId = {
    "english-from-basics": "english-communication",
    "health-well-being": "health-wellness",
    "computer-training": "computer-education"
  }[subject.id] || subject.id;
  const structuredCourse = subject.id === "english-from-basics"
    ? ENGLISH_FROM_BASICS_COURSE
    : (FLAGSHIP_COURSES[subject.id] || ALL_STRUCTURED_COURSES[structuredCourseId]);
  const modules = structuredCourse
    ? structuredCourse.modules.map((m) => ({
        title: m.title.en + " / " + m.title.hi,
        subtitle: m.description,
        lessons: m.lessons.map((l) => [
          l.title.en + " / " + l.title.hi,
          l.content?.easyExplanation || "",
          l
        ])
      }))
    : buildTopicModules(subject);

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
        subject.id === "english-from-basics"
          ? ENGLISH_FROM_BASICS_ASSESSMENTS
          : (FLAGSHIP_COURSE_ASSESSMENTS && FLAGSHIP_COURSE_ASSESSMENTS[structuredCourseId]
              ? FLAGSHIP_COURSE_ASSESSMENTS[structuredCourseId]
              : COURSE_ASSESSMENTS?.[structuredCourseId] || {})
      ).flat()
    : [];
  const quizQuestions = structuredAssessmentPool.length
    ? structuredAssessmentPool.slice(0, 5).map(q => ({
        q: q.q || q.question,
        options: q.options || [],
        answer: typeof q.answer === "number" ? q.answer : 0
      }))
    : [
        {q:"अच्छी learning का उद्देश्य क्या है?", options:["समझकर और अभ्यास करके capability विकसित करना","केवल title याद करना","केवल video देखना","केवल certificate लेना"], answer:0},
        {q:"किसी concept को मजबूत करने का उपयोगी तरीका क्या है?", options:["Example + Practice + Review","बिना पढ़े अनुमान लगाना","बिना जाँचे जानकारी share करना","केवल एक definition याद करना"], answer:0},
        {q:"Current rules या schemes को कहाँ verify करना चाहिए?", options:["संबंधित official source","random forwarded message","unverified social post","anonymous screenshot"], answer:0},
        {q:"Practical learning में क्या महत्वपूर्ण है?", options:["सुरक्षित task, परिणाम और सुधार","केवल memorisation","बिना training high-risk action","दूसरे का work copy करना"], answer:0},
        {q:"Course पूरा करने के बाद अगला कदम क्या हो सकता है?", options:["Assessment, reflection और next learning path","सीखना बंद करना","बिना समझे certificate claim करना","सभी sources ignore करना"], answer:0}
      ];
  const completed = done.length;
  const total = lessons.length;
  const progress = Math.round((completed / total) * 100);
  const moduleAssessments = structuredCourse
    ? structuredCourse.modules.map((m) => ({
        ...m,
        questions:
          (FLAGSHIP_COURSE_ASSESSMENTS?.[m.id] ||
            (subject.id === "english-from-basics" ? ENGLISH_FROM_BASICS_ASSESSMENTS?.[m.id] : COURSE_ASSESSMENTS?.[structuredCourseId]?.[m.id]) ||
            m.assessment?.questions ||
            [])
      })).filter(m => m.questions.length)
    : [];
  const allLearningComplete = progress === 100;
  const modulePassCount = moduleAssessments.filter(m => moduleResults[m.id]?.passed).length;
  const moduleAssessmentComplete = moduleAssessments.length === 0 || modulePassCount === moduleAssessments.length;
  const finalAssessmentPassed = Boolean(finalResult?.passed);
  const certificateEligible = allLearningComplete && moduleAssessmentComplete && finalAssessmentPassed;
  const courseMeta = structuredCourse || {
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
  };
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

  return <div className="min-h-screen bg-[#f6f8fb] text-zinc-900 font-inria">
    <section className={"relative overflow-hidden bg-gradient-to-r "+subject.color+" text-white"}>
      <img src={subject.image} alt={subject.title} className="absolute inset-0 h-full w-full object-cover opacity-35"/>
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
          <div className="rounded-2xl bg-[#eef7fb] px-5 py-4 text-sm font-black text-[#003366]">Version {courseMeta.version}<br/>Reviewed {courseMeta.lastReviewed || "—"}</div>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-4">
          <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Level</div><div className="mt-1 font-black">{structuredCourse ? "Foundation" : "Foundation → Practical"}</div></div>
          <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Language</div><div className="mt-1 font-black">Hindi + English</div></div>
          <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Lessons</div><div className="mt-1 font-black">{total} structured lessons</div></div>
          <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Learning Time</div><div className="mt-1 font-black">{courseMeta.learningHours ? courseMeta.learningHours + " hours" : "Self-paced"}</div></div>
        </div>
        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 p-5"><h3 className="font-black text-[#003366]">Who is this for? / किसके लिए?</h3><p className="mt-2 text-sm leading-6 text-zinc-600">{courseMeta.audience}</p><h3 className="mt-5 font-black text-[#003366]">Prerequisites / पूर्व-आवश्यकताएँ</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600">{courseMeta.prerequisites.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
          <div className="rounded-2xl border border-zinc-200 p-5"><h3 className="font-black text-[#003366]">What you will learn / आप क्या सीखेंगे</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600">{courseMeta.outcomes.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
        </div>
        <div className="mt-7 rounded-2xl bg-[#f1f7fa] p-5">
          <div className="flex items-center justify-between"><div><div className="text-sm font-black text-[#003366]">Course Progress / प्रगति</div><div className="text-xs text-zinc-500">{completed} / {total} lessons completed</div></div><div className="text-2xl font-black text-[#003366]">{progress}%</div></div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white"><div className="h-full bg-gradient-to-r from-[#003366] to-[#0a9396]" style={{width:progress+"%"}}/></div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_330px]">
        <div className="space-y-7">
          {modules.map((m,mi)=><section key={m.title} className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
            <div className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#003366] text-white font-black">{mi+1}</div><div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Module {mi+1}</div><h2 className="mt-1 text-2xl font-black">{m.title}</h2><p className="mt-1 text-sm text-zinc-500">{m.subtitle}</p></div></div>
            <div className="mt-6 space-y-3">{m.lessons.map((l,li)=>{const global=modules.slice(0,mi).reduce((n,x)=>n+x.lessons.length,0)+li;const isDone=done.includes(global);return <button key={l[0]} onClick={()=>goLesson(global)} className={"flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition "+(activeLesson===global?"border-[#0f4c81] bg-[#eef7fb]":"border-zinc-200 hover:border-[#b9cfdd] hover:bg-zinc-50")}>
              <div className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black "+(isDone?"bg-[#e7f7ef] text-[#177245]":"bg-zinc-100 text-[#003366]")}>{isDone?<FaCheckCircle/>:li+1}</div>
              <div className="min-w-0 flex-1"><div className="font-black">{l[0]}</div><div className="mt-1 text-xs leading-5 text-zinc-500">{l[1]}</div></div><FaArrowRight className="shrink-0 text-zinc-400"/>
            </button>})}</div>
          </section>)}
        </div>

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
            <img src={subject.image} alt={subject.title} className="h-52 w-full object-cover"/>
            <div className="p-5"><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Visual Learning / दृश्य सीख</div><p className="mt-2 text-sm leading-6 text-zinc-600">इस course का visual उसी विषय से जुड़ा है।</p></div>
          </div>
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="font-black text-[#003366]">Current Lesson / वर्तमान पाठ</h3>
            <div id="current-lesson-content" className="mt-3 rounded-xl bg-zinc-50 p-4 scroll-mt-6">
              <div className="text-xs text-zinc-500">{lessons[activeLesson].module}</div>
              <div className="mt-1 font-black">{lessons[activeLesson].title}</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{lessons[activeLesson].body}</p>
              <div className="mt-5 flex gap-2 border-t border-zinc-200 pt-4">
                <button onClick={()=>goLesson(activeLesson-1)} disabled={activeLesson===0} className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-black text-[#003366] disabled:opacity-40">← Previous / पिछला</button>
                <button onClick={()=>goLesson(activeLesson+1)} disabled={activeLesson===total-1} className="flex-1 rounded-xl bg-[#003366] px-3 py-2 text-xs font-black text-white disabled:opacity-40">Next / अगला →</button>
              </div>
              {lessons[activeLesson].detail && <div className="mt-5 space-y-4 border-t border-zinc-200 pt-4">
                {[
                  ["Objectives / उद्देश्य", lessons[activeLesson].detail.objectives],
                  ["Deep Understanding / गहरी समझ", lessons[activeLesson].detail.content?.deepUnderstanding],
                  ["Examples / उदाहरण", lessons[activeLesson].detail.content?.examples],
                  ["Practice / अभ्यास", lessons[activeLesson].detail.practice],
                  ["Activity / गतिविधि", lessons[activeLesson].detail.activity],
                  ["Common Mistakes / सामान्य गलतियाँ", lessons[activeLesson].detail.content?.commonMistakes],
                  ["Summary / सार", lessons[activeLesson].detail.content?.summary]
                ].map(([label,value]) => value && <div key={label}>
                  <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">{label}</div>
                  {Array.isArray(value) ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600">{value.map((x,i)=><li key={i}>{x}</li>)}</ul> : <p className="mt-2 text-sm leading-6 text-zinc-600">{value}</p>}
                </div>)}
              </div>}
            </div>
          </div>
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="font-black text-[#003366]">Course Assessment / आकलन</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">पहले learning और practice पूरा करें, फिर self-check करें। Final certification अभी इस foundation stage में fake नहीं की जा रही है।</p>
            <button onClick={()=>setQuizOpen(v=>!v)} className="mt-4 w-full rounded-xl bg-[#003366] px-4 py-3 text-sm font-black text-white">{quizOpen?"Close Check / बंद करें":"Start Knowledge Check / शुरू करें"}</button>
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
            <p className="text-base leading-8 text-zinc-700">{lessons[activeLesson].body}</p>
            {lessons[activeLesson].detail && <div className="mt-7 space-y-5 border-t border-zinc-200 pt-6">
              {[
                ["Objectives / उद्देश्य", lessons[activeLesson].detail.objectives],
                ["Deep Understanding / गहरी समझ", lessons[activeLesson].detail.content?.deepUnderstanding],
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
              <button type="button" onClick={()=>setLessonOpen(false)} className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-black text-[#003366]">Close / बंद करें</button>
              <button type="button" disabled={activeLesson===total-1} onClick={()=>goLesson(activeLesson+1)} className="rounded-xl bg-[#003366] px-4 py-3 text-sm font-black text-white disabled:opacity-40">Next Lesson / अगला पाठ →</button>
            </div>
          </div>
        </div>
      </div>}

      <section className="mt-8 rounded-[2rem] border border-[#d9e7f0] bg-white p-6 md:p-8">
        <div className="flex items-center gap-3"><FaGraduationCap className="text-3xl text-[#003366]"/><div><h2 className="text-2xl font-black">Certificate Pathway / प्रमाणन मार्ग</h2><p className="text-sm text-zinc-500">Learning first. Certification after genuine completion and assessment.</p></div></div>
        <div className="mt-6 grid gap-3 md:grid-cols-5">{[
          ["Learn / सीखें", progress > 0],
          ["Practise / अभ्यास", completed > 0],
          ["Complete / पूर्ण करें", allLearningComplete],
          ["Assess / आकलन", moduleAssessmentComplete && finalAssessmentPassed],
          ["Certificate / प्रमाणपत्र", certificateEligible]
        ].map(([x,ok],i)=><div key={x} className={"rounded-xl p-4 text-center text-xs font-black "+(ok?"bg-[#e7f7ef] text-[#177245]":"bg-zinc-100 text-zinc-600")}>{i+1}. {x}</div>)}</div>
        <div className="mt-6 rounded-2xl bg-[#f7fafc] p-5">
          <div className="text-sm font-black text-[#003366]">Certificate request / प्रमाणपत्र अनुरोध</div>
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
            className={"mt-4 rounded-xl px-5 py-3 text-sm font-black text-white "+(certificateEligible?"bg-[#177245]":"bg-[#003366]")}
          >{certificateEligible ? "Proceed to Certificate / प्रमाणपत्र के लिए आगे बढ़ें" : "Get Certificate / प्रमाणपत्र प्राप्त करें"}</button>
        </div>
      </section>

      {accountOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001529]/70 p-4 backdrop-blur-sm">
        <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Certificate Account Stage / प्रमाणपत्र खाता चरण</div><h2 className="mt-2 text-2xl font-black text-[#003366]">{accountUser ? "Account ready / खाता तैयार है" : authMode === "login" ? "Login to continue / आगे बढ़ने के लिए लॉगिन" : "Create learning account / लर्निंग अकाउंट बनाएं"}</h2></div>
            <button type="button" onClick={()=>setAccountOpen(false)} className="rounded-xl bg-zinc-100 px-3 py-2 font-black text-zinc-500">✕</button>
          </div>
          {accountUser ? <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-[#f1f7fa] p-5"><div className="font-black text-[#003366]">{accountUser.fullName}</div><div className="mt-1 text-sm text-zinc-500">{accountUser.email}</div></div>
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
            <button disabled={authStatus==="submitting"} className="w-full rounded-xl bg-[#003366] px-5 py-3 font-black text-white disabled:opacity-50">{authStatus==="submitting"?"Please wait...":authMode==="login"?"Login & Continue / लॉगिन करें":"Create Account & Continue / अकाउंट बनाएं"}</button>
            <button type="button" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setAuthError("");}} className="w-full rounded-xl bg-zinc-100 px-5 py-3 text-sm font-black text-[#003366]">{authMode==="login"?"Create Account / नया अकाउंट बनाएं":"Already have an account? Login / पहले से अकाउंट है? लॉगिन"}</button>
          </form>}
        </div>
      </div>}
    </main>
  </div>;
}

export default function LearningHubV2() {
  const [subjectId, setSubjectId] = useState(getSubjectFromUrl);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const courseMetaBySubject = useMemo(() => {
    const map = {};
    const aliases = {
      "english-from-basics": "english-communication",
      "health-well-being": "health-wellness",
      "environment-basics": "environment-sustainability",
      "career-planning": "career-workplace",
      "computer-training": "computer-education"
    };
    SUBJECTS.forEach(s => {
      const course = s.id === "english-from-basics" ? ENGLISH_FROM_BASICS_COURSE : ALL_STRUCTURED_COURSES?.[aliases[s.id] || s.id];
      if (course) map[s.id] = course;
    });
    return map;
  }, []);

  const progressSummary = useMemo(() => {
    let active = null;
    let completedCount = 0;
    SUBJECTS.forEach(s => {
      try {
        const done = JSON.parse(localStorage.getItem("ssf-learning-course-progress-" + s.id) || "[]");
        const course = courseMetaBySubject[s.id];
        const total = course?.modules?.reduce((n,m) => n + (m.lessons?.length || 0), 0) || 0;
        if (total && done.length) {
          const percent = Math.min(100, Math.round(done.length / total * 100));
          if (percent >= 100) completedCount += 1;
          else if (!active || percent > active.percent) active = { subject:s, percent };
        }
      } catch {}
    });
    return { active, completedCount };
  }, [courseMetaBySubject]);

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
    url: window.location.origin + "/LearningHub?subject=" + encodeURIComponent(subject.id)
  });
  const openSubject = (subject) => {
    const url = "/LearningHub?subject=" + encodeURIComponent(subject.id);
    window.history.pushState({}, "", url);
    setSubjectId(subject.id);
    window.scrollTo({top:0, behavior:"smooth"});
  };
  const back = () => {
    window.history.pushState({}, "", "/LearningHub");
    setSubjectId("");
    window.scrollTo({top:0, behavior:"smooth"});
  };
  const filtered = useMemo(() => SUBJECTS.filter(s => {
    const hay = (s.title + " " + s.category + " " + s.intro).toLowerCase();
    return (category === "All" || s.category === category) && hay.includes(query.toLowerCase().trim());
  }), [category, query]);
  const selected = SUBJECTS.find(s => s.id === subjectId);
  if (selected) return <LearningSubject subject={selected} onBack={back} />;

  const categories = ["All", ...Object.keys(CATEGORY_META)];
  const visibleCategories = category === "All" ? Object.keys(CATEGORY_META) : [category];

  return <div className="min-h-screen bg-[#f6f8fb] font-inria text-zinc-900">
    <section className="relative overflow-hidden bg-[#002344] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#001426] via-[#003b63] to-[#007c91]" />
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5" />
      <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full border border-white/10 bg-white/5" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest"><FaGraduationCap /> SSF Learning Hub</div>
            <div className="mt-5 text-sm font-bold text-white/70">ज्ञान से कौशल तक • From Knowledge to Capability</div>
            <h1 className="mt-2 text-4xl font-black leading-tight md:text-6xl">सीखिए। अभ्यास कीजिए। आगे बढ़िए।</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/80 md:text-lg">विषय चुनें, structured lessons पूरा करें, practice करें और assessment के साथ अपनी learning progress आगे बढ़ाएँ।</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[430px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><div className="text-2xl font-black">{SUBJECTS.length}</div><div className="mt-1 text-xs font-bold text-white/70">Subjects</div></div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><div className="text-2xl font-black">{Object.keys(CATEGORY_META).length}</div><div className="mt-1 text-xs font-bold text-white/70">Learning Areas</div></div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><div className="text-2xl font-black">{Object.keys(ALL_STRUCTURED_COURSES || {}).length}</div><div className="mt-1 text-xs font-bold text-white/70">Structured</div></div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><div className="text-2xl font-black">{progressSummary.completedCount}</div><div className="mt-1 text-xs font-bold text-white/70">Completed</div></div>
          </div>
        </div>
      </div>
    </section>
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto]">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0f4c81]"><FaBookOpen /> Start here / यहाँ से शुरू करें</div>
          <h2 className="mt-2 text-2xl font-black md:text-3xl">अपनी learning journey चुनिए</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Search करें या learning area चुनें। Available structured courses को स्पष्ट course status के साथ देखें।</p>
          <div className="relative mt-5"><FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="आप क्या सीखना चाहते हैं? / Search courses..." aria-label="Search courses" className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-4 pl-11 pr-4 outline-none focus:border-[#0f4c81] focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/10" /></div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{categories.map(c => { const Meta=CATEGORY_META[c]; const Icon=Meta?.icon||FaBookOpen; return <button key={c} onClick={()=>setCategory(c)} className={"flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black transition "+(category===c?"bg-[#003366] text-white shadow-md":"bg-zinc-100 text-zinc-600 hover:bg-zinc-200")}><Icon/> {c}</button>; })}</div>
        </div>
        <div className="rounded-[2rem] bg-[#003366] p-6 text-white shadow-sm lg:w-[330px]">
          <div className="text-xs font-black uppercase tracking-widest text-white/60">Your learning / आपकी प्रगति</div>
          {progressSummary.active ? <button onClick={()=>openSubject(progressSummary.active.subject)} className="mt-4 w-full text-left"><div className="text-lg font-black">{progressSummary.active.subject.en}</div><div className="mt-1 text-sm text-white/70">{progressSummary.active.subject.hi}</div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-white" style={{width:progressSummary.active.percent+"%"}}/></div><div className="mt-2 flex justify-between text-xs font-bold"><span>{progressSummary.active.percent}% complete</span><span>Continue →</span></div></button> : <div className="mt-4"><div className="text-lg font-black">Start your first course</div><div className="mt-2 text-sm leading-6 text-white/70">अपना पहला structured course चुनें और progress track करें।</div></div>}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-[#d9e7f0] bg-gradient-to-r from-white to-[#eef7fb] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0f4c81]"><FaGraduationCap/> LEARNING PATH / सीखने का रास्ता</div><h2 className="mt-2 text-2xl font-black md:text-3xl">Learn → Practise → Assess → Complete</h2><p className="mt-2 text-sm text-zinc-600">Learning को छोटे, स्पष्ट steps में पूरा करें।</p></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[[FaBookOpen,"Learn","सीखें"],[FaPlayCircle,"Practise","अभ्यास"],[FaCheckCircle,"Assess","आकलन"],[FaGraduationCap,"Certificate","प्रमाणपत्र"]].map(([Icon,en,hi])=><div key={en} className="rounded-xl bg-white px-4 py-3 text-center shadow-sm"><Icon className="mx-auto text-lg text-[#003366]"/><div className="mt-1 text-xs font-black">{en}</div><div className="text-[10px] text-zinc-500">{hi}</div></div>)}</div></div>
      </section>

      {visibleCategories.map(cat => {
        const meta = CATEGORY_META[cat];
        const Icon = meta?.icon || FaBookOpen;
        const courses = filtered.filter(s => s.category === cat);
        if (!courses.length) return null;
        return <section key={cat} className="mt-12">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#0f4c81]"><Icon /> {cat}</div>
              <h2 className="mt-2 text-3xl font-black">Courses / पाठ्यक्रम</h2>
              <p className="mt-1 text-sm text-zinc-500">{courses.length} learning options available in this area / इस क्षेत्र में उपलब्ध learning options</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map(s => <article key={s.id} className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-zinc-200 bg-white shadow-[0_10px_35px_rgba(0,35,68,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,35,68,.14)]">
              <div className="relative h-52 overflow-hidden">
                <div className={"absolute inset-0 bg-gradient-to-br "+s.color} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/25 bg-white/10 text-5xl text-white shadow-2xl backdrop-blur">
                    <Icon aria-hidden="true" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur">
                  <Icon /> Course {s.number}
                </div>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h3 className="text-2xl font-black leading-tight">{s.en}</h3>
                  <div className="mt-1 text-sm font-bold text-white/90">{s.hi}</div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#edf5fa] px-3 py-1 text-[10px] font-black text-[#0f4c81]">{courseMetaBySubject[s.id] ? "Structured Course" : "Learning Topic"}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black text-zinc-600">Hindi + English</span>
                </div>
                <p className="flex-1 text-sm leading-7 text-zinc-600">{s.intro}</p>
                <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-zinc-500">
                  <div className="rounded-xl bg-zinc-50 p-2"><FaBookOpen className="mx-auto mb-1 text-[#0f4c81]"/>{courseMetaBySubject[s.id]?.modules?.length || "—"}<span className="block text-[9px] font-normal">Modules</span></div>
                  <div className="rounded-xl bg-zinc-50 p-2"><FaClock className="mx-auto mb-1 text-[#0f4c81]"/>{courseMetaBySubject[s.id]?.learningHours || "—"}<span className="block text-[9px] font-normal">Hours</span></div>
                  <div className="rounded-xl bg-zinc-50 p-2"><FaGraduationCap className="mx-auto mb-1 text-[#0f4c81]"/>{courseMetaBySubject[s.id] ? "Certificate" : "Coming Soon"}<span className="block text-[9px] font-normal">{courseMetaBySubject[s.id] ? "Pathway" : "Status"}</span></div>
                </div>
                <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                  <button onClick={()=>openSubject(s)} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#003366] to-[#0f4c81] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:from-[#0f4c81] hover:to-[#007c91] focus:outline-none focus:ring-4 focus:ring-[#0f4c81]/20">
                    {courseMetaBySubject[s.id] ? "Start Learning / सीखना शुरू करें" : "Explore Topic / विषय देखें"} <FaArrowRight />
                  </button>
                  <button type="button" onClick={()=>shareSubject(s)} aria-label={"Share " + s.en} title="Share this course" className="inline-flex min-w-14 items-center justify-center gap-2 rounded-2xl border border-[#0f4c81]/20 bg-[#eef7fb] px-4 text-[#003366] transition hover:bg-[#dceff7] focus:outline-none focus:ring-4 focus:ring-[#0f4c81]/20">
                    <FaShareAlt /> <span className="sr-only">Share</span>
                  </button>
                </div>
              </div>
            </article>)}
          </div>
        </section>;
      })}

      {!filtered.length && <div className="mt-10 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">No course found. Try another search / कोई दूसरा विषय खोजें।</div>}

      <section className="mt-14 grid gap-5 pb-8 md:grid-cols-4">
        {[
          [FaBookOpen, "Learn / सीखें", "Concepts, examples and reliable learning material."],
          [FaPlayCircle, "Practise / अभ्यास", "Activities and practical application."],
          [FaCheckCircle, "Assess / आकलन", "Quizzes and meaningful assessments."],
          [FaGraduationCap, "Certify / प्रमाणन", "Completion-based certificate pathway."]
        ].map(([Icon,title,desc])=><div key={title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"><Icon className="text-3xl text-[#003366]"/><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-600">{desc}</p></div>)}
      </section>
    </main>
  </div>;
}