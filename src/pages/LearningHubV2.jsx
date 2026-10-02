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

const getSubjectProfile = (subject) => {
  const hit = SUBJECT_PROFILE_RULES.find((p) => p.test.test(subject.en + " " + subject.hi));
  if (hit) return hit;
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

const makeRichSubjectLesson = (subject, moduleTitle, label, mi, li) => {
  const clean = label.replace(/^[^\s]+\s/, "");
  const subjectName = subject.en;
  const examplesByWord = [
    ["Letters","Example / उदाहरण: A → Apple; अ → अनार. पहले पहचानें, फिर बोलें, फिर लिखें।"],
    ["Numbers","Example / उदाहरण: 4 objects गिनें → संख्या 4 लिखें → 4 का उपयोग वास्तविक स्थिति में करें।"],
    ["Addition","Example / उदाहरण: 2 apples + 3 apples = 5 apples. वस्तुओं से शुरू करके equation तक जाएँ।"],
    ["Subtraction","Example / उदाहरण: 8 वस्तुओं में से 3 हटाएँ → 5 बचें।"],
    ["Reading","Example / उदाहरण: छोटा passage पढ़ें → मुख्य विचार खोजें → 3 प्रश्नों के उत्तर दें।"],
    ["Writing","Example / उदाहरण: चित्र देखें → keywords लिखें → 3–5 वाक्य बनाएं → proofreading करें।"],
    ["Grammar","Example / उदाहरण: rule पढ़ें → 3 सही sentences बनाएं → एक common error सुधारें।"],
    ["Hardware","Example / उदाहरण: keyboard, mouse और monitor पहचानें और उनके उपयोग बताएं।"],
    ["Software","Example / उदाहरण: operating system और application में अंतर पहचानें।"],
    ["Internet","Example / उदाहरण: search करें → source देखें → information को दूसरे reliable source से verify करें।"],
    ["Password","Example / उदाहरण: मजबूत, अलग password रखें और उसे किसी से share न करें।"],
    ["Phishing","Example / उदाहरण: urgent message में link खोलने से पहले sender, URL और request verify करें।"],
    ["Soil","Example / उदाहरण: अलग मिट्टी देखें, रंग/texture लिखें और crop के लिए उपयुक्तता पर चर्चा करें।"],
    ["Water","Example / उदाहरण: घर/खेत में पानी कहाँ खर्च होता है, सूची बनाकर बचत के 3 तरीके खोजें।"],
    ["Health","Example / उदाहरण: symptom देखकर स्वयं diagnosis न करें; reliable information और qualified care का उपयोग करें।"],
    ["Safety","Example / उदाहरण: खतरा पहचानें → सुरक्षित स्थान लें → trusted adult/professional help लें।"],
    ["Resume","Example / उदाहरण: job description पढ़ें और केवल relevant, truthful skills को resume में रखें।"],
    ["Interview","Example / उदाहरण: 60-second self-introduction record करें और clarity, accuracy, body language review करें।"],
    ["Budget","Example / उदाहरण: income लिखें → जरूरी खर्च अलग करें → saving रखें → records maintain करें।"],
    ["Project","Example / उदाहरण: problem → objective → activity → evidence → result → learning report करें।"],
    ["Assessment","Example / उदाहरण: answer देने के बाद गलतियों को error-log में लिखें और targeted revision करें।"]
  ];
  const found = examplesByWord.find(([k]) => clean.toLowerCase().includes(k.toLowerCase()));
  const example = found?.[1] || ("Example / उदाहरण: " + clean + " को " + subjectName + " के वास्तविक संदर्भ में देखें, एक छोटा उदाहरण बनाएं और उसे स्वयं करके verify करें।");
  const activity = "Activity / गतिविधि: " + clean + " से जुड़ा एक छोटा, सुरक्षित task करें; उसका परिणाम 3–5 points में लिखें और किसी दूसरे व्यक्ति को Hindi + English में समझाएँ।";
  const body = subjectName + " में " + clean + " को केवल definition की तरह नहीं, बल्कि concept → example → practice → application → review के क्रम में सीखें। " + subject.intro;
  const check = [
    {question: subjectName + " में " + clean + " को सीखने का बेहतर तरीका क्या है?", options:["समझना, उदाहरण देखना, practice करना और result review करना","केवल heading याद करना","बिना context के अनुमान लगाना","practice छोड़ देना"], answer:0},
    {question:"सीखने के बाद सबसे उपयोगी अगला कदम क्या है?",options:["एक छोटा practical task और self-check","बिना पढ़े answer देना","source verify न करना","केवल certificate देखना"],answer:0}
  ];
  return [
    label,
    body,
    {
      objectives:[
        clean + " का अर्थ और उद्देश्य समझना।",
        subjectName + " के संदर्भ में इसका उपयोग पहचानना।",
        example + " के आधार पर खुद practice करना।"
      ],
      content:{
        easyExplanation:"सरल समझ / Simple meaning: " + clean + " को पहले आसान भाषा में समझें, फिर subject-specific example से जोड़ें।",
        deepUnderstanding:"Deep understanding / गहरी समझ: concept के पीछे कारण, context, limitations और सही उपयोग समझें। केवल याद करने के बजाय बताएं कि कब, क्यों और कैसे इसका उपयोग होगा।",
        whyItMatters:"क्यों जरूरी है / Why it matters: " + clean + " की सही समझ learner को अधिक स्पष्ट, सुरक्षित और practical decision लेने में मदद करती है।",
        keyPoints:[clean,moduleTitle,"Example + Practice","Application + Review"],
        examples:[example,"एक अपना example बनाइए और बताइए कि वह सही क्यों है।"],
        steps:["🎯 उद्देश्य स्पष्ट करें / Define the goal","📖 concept पढ़ें / Learn the concept","👀 example देखें / Study examples","🛠️ खुद करके देखें / Practice","🔎 result जाँचें / Review","🔄 गलती हो तो सुधारें / Improve"],
        practicalApplication:activity,
        memoryHook:"🧠 याद रखें / Remember: समझो → देखो → करो → जाँचो → समझाकर बताओ।",
        commonMistakes:["❌ केवल definition याद करना","❌ example को बिना समझे copy करना","❌ practice के बाद result review न करना","❌ जरूरत होने पर reliable source/qualified person से पुष्टि न करना"],
        summary:"📌 सार / Summary: " + clean + " को समझने का लक्ष्य knowledge को practical capability में बदलना है।"
      },
      practice:[
        "✍️ बिना notes देखे 3 मुख्य बातें लिखें।",
        "🔎 एक real-life example खोजें।",
        "🛠️ एक छोटा practical task करें।",
        "🗣️ किसी दूसरे व्यक्ति को 60 seconds में समझाएँ।"
      ],
      activity,
      knowledgeCheck:check,
      reflection:["आज मैंने क्या नया सीखा?","मुझे किस हिस्से में और practice चाहिए?","मैं इसे वास्तविक जीवन में कहाँ उपयोग कर सकता/सकती हूँ?"]
    }
  ];
};

const formatBilingual = (text) => {
  if (typeof text !== "string") return text;
  const m = text.match(/^(.*)\s\/\s([^/]+)$/);
  return m ? m[1] + " (" + m[2].trim() + ")" : text;
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
        title: formatBilingual(m.title.en + " / " + m.title.hi),
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
                  ["Practical Application / वास्तविक उपयोग", lessons[activeLesson].detail.content?.practicalApplication],
                  ["Practice / अभ्यास", lessons[activeLesson].detail.practice],
                  ["Activity / गतिविधि", lessons[activeLesson].detail.activity],
                  ["Knowledge Check / ज्ञान जाँच", lessons[activeLesson].detail.content?.knowledgeCheck],
                  ["Reflection / स्वयं विचार", lessons[activeLesson].detail.content?.reflection],
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