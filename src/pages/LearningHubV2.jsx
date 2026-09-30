import { useMemo, useState } from "react";
import {
  FaArrowLeft, FaArrowRight, FaBookOpen, FaCheckCircle, FaClock, FaGraduationCap,
  FaLeaf, FaLaptop, FaPlayCircle, FaQuestionCircle, FaSearch, FaShareAlt,
  FaShieldAlt, FaUsers, FaHeartbeat, FaSeedling, FaPaw, FaBalanceScale, FaChild,
  FaBriefcase, FaComments, FaUniversalAccess, FaHandsHelping
} from "react-icons/fa";
import { FLAGSHIP_COURSES, FLAGSHIP_COURSE_ASSESSMENTS } from "../data/learningHubCourseArchitecture";
import { ENDPOINTS } from "../config/api";

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

function buildGenericLearningModules(subject) {
  const [en, hi] = subject.en.split(" / ");
  const intro = subject.intro;
  const make = (title, subtitle, lessons) => ({ title, subtitle, lessons: lessons.map((l) => [
    l.title,
    l.body,
    {
      objectives: l.objectives,
      content: {
        deepUnderstanding: l.deep,
        examples: l.examples,
        commonMistakes: l.mistakes,
        summary: l.summary
      },
      practice: [l.practice],
      activity: l.activity
    }
  ])});
  return [
    make("1. Foundation / आधार", "पहले विषय को सही अर्थ, उद्देश्य और संदर्भ में समझें।", [
      {title:"What is "+en+"? / "+hi+" क्या है?", body:intro+" इस lesson में definition, scope और basic vocabulary को समझें।", objectives:["विषय की स्पष्ट परिभाषा अपने शब्दों में बता सकें।","मुख्य terms और scope पहचान सकें।"], deep:"किसी विषय को सीखने की शुरुआत केवल definition याद करने से नहीं होती। पहले यह समझना जरूरी है कि इसका उद्देश्य क्या है, किन लोगों/परिस्थितियों में इसका उपयोग होता है और इसकी सीमाएँ क्या हैं।", examples:["विषय की रोजमर्रा की एक situation पहचानें।","एक technical term को सरल भाषा में समझाएँ।"], mistakes:["केवल एक-line definition याद करना","अलग संदर्भों में एक ही rule को बिना जाँच लागू करना"], summary:"Meaning + purpose + scope + vocabulary = मजबूत foundation.", practice:"अपने शब्दों में 5-line explanation लिखें।", activity:"तीन नए terms चुनकर उनका सरल अर्थ और एक example लिखें।"},
      {title:"Why it matters / यह क्यों महत्वपूर्ण है?", body:en+" का उपयोग education, work, community या daily life में अलग-अलग रूपों में हो सकता है।", objectives:["विषय के कम-से-कम 3 practical uses पहचानें।","Benefits और limitations में अंतर करें।"], deep:"Practical value तब समझ आती है जब हम knowledge को किसी वास्तविक problem, decision या task से जोड़ते हैं। हर application के साथ context और safety भी देखें।", examples:["एक personal use","एक workplace/community use","एक learning or development use"], mistakes:["हर situation में इसे universal solution मानना","benefit बताते समय limitations भूल जाना"], summary:"Importance को real use और responsible use दोनों से समझें.", practice:"विषय के 3 उपयोग और 2 limitations लिखें।", activity:"एक real-life problem चुनकर बताइए कि यह subject कहाँ मदद कर सकता है।"},
      {title:"Background, Scope & Key Terms / पृष्ठभूमि, दायरा एवं प्रमुख शब्द", body:"अब "+en+" की पृष्ठभूमि, scope और जरूरी terminology को व्यवस्थित करें।", objectives:["Basic history/development को broadly समझें।","Scope और related terms अलग कर सकें।"], deep:"विषय समय के साथ बदल सकता है। Current rules, standards या practices के लिए हमेशा relevant official/professional sources को verify करें।", examples:["Old approach vs current approach","Core term vs related term"], mistakes:["पुरानी जानकारी को current मान लेना","similar terms को एक ही मान लेना"], summary:"Context समझने से आगे के lessons अधिक स्पष्ट होते हैं.", practice:"10 key terms की अपनी glossary बनाइए।", activity:"एक concept map बनाकर main topic और related terms जोड़ें।"}
    ]),
    make("2. Core Knowledge / मूल ज्ञान", "मुख्य concepts, components, methods और evidence को समझें।", [
      {title:"Core Concepts / मुख्य अवधारणाएँ", body:en+" के core concepts को definition, relationship और example के साथ सीखें।", objectives:["मुख्य concepts समझें।","Concepts के बीच संबंध समझा सकें।"], deep:"Deep learning में केवल 'क्या' नहीं, बल्कि 'क्यों', 'कैसे' और 'कब' शामिल हैं। एक concept को दूसरे से compare करने से understanding मजबूत होती है।", examples:["Definition → example → non-example","Cause → process → result"], mistakes:["terms को context से अलग याद करना","example को rule समझ लेना"], summary:"Concept + context + example = usable knowledge.", practice:"हर core concept के लिए एक example और non-example लिखें।", activity:"दो related concepts की comparison table बनाएं।"},
      {title:"Types, Components & Methods / प्रकार, घटक एवं विधियाँ", body:"विषय के प्रमुख प्रकार/घटक और commonly used methods को पहचानना सीखें।", objectives:["Major categories identify करें।","Method चुनने के basic criteria समझें।"], deep:"सही method context, resources, purpose और risk पर निर्भर कर सकती है। इसलिए 'एक तरीका हर जगह' वाली सोच से बचें।", examples:["Basic vs advanced method","Individual vs group approach"], mistakes:["method को बिना context copy करना","resources और constraints ignore करना"], summary:"Type और method का चुनाव purpose और context से जुड़ा है.", practice:"कम-से-कम 3 types/methods की तुलना करें।", activity:"एक scenario देकर बताएं कि कौन-सा approach क्यों चुनेंगे।"},
      {title:"Evidence, Examples & Case Thinking / प्रमाण, उदाहरण एवं केस", body:"अब information को evidence और real situations से जोड़ें।", objectives:["Evidence और opinion में अंतर करें।","Case को facts, assumptions और options में तोड़ें।"], deep:"Reliable learning में source quality, date, evidence और context महत्वपूर्ण हैं। Case analysis में पहले facts अलग करें, फिर interpretation और action options देखें।", examples:["Primary source vs secondary summary","Fact vs assumption"], mistakes:["अनुमान को fact मानना","एक example को universal rule मानना"], summary:"Evidence-aware thinking गलत निष्कर्षों को कम करती है.", practice:"एक case में facts, assumptions और questions अलग करें।", activity:"Case के 2 possible solutions और उनके trade-offs लिखें।"}
    ]),
    make("3. Practice & Application / अभ्यास एवं प्रयोग", "सीखी बात को छोटे सुरक्षित tasks और real-world application में बदलें।", [
      {title:"Step-by-step Practice / चरणबद्ध अभ्यास", body:en+" से जुड़ा एक low-risk task चुनकर उसे छोटे steps में पूरा करना सीखें।", objectives:["Task को steps में divide करें।","हर step का expected result तय करें।"], deep:"Skill repetition से मजबूत होती है, लेकिन repetition तभी उपयोगी है जब feedback मिले और mistakes सुधारी जाएँ।", examples:["Plan → Do → Check → Improve","Checklist-based practice"], mistakes:["बिना goal practice करना","result check न करना"], summary:"छोटे repeatable tasks capability बनाते हैं.", practice:"एक 5-step practice task लिखकर पूरा करें।", activity:"अपने task के लिए checklist बनाएं।"},
      {title:"Common Mistakes & Safety / सामान्य गलतियाँ एवं सुरक्षा", body:"गलतियाँ learning का हिस्सा हैं; उनका कारण और prevention समझना जरूरी है।", objectives:["Common errors पहचानें।","High-risk actions में उचित caution अपनाएँ।"], deep:"हर subject में कुछ actions low-risk और कुछ high-risk हो सकते हैं। High-risk health, legal, financial, technical या safety decisions में qualified professionals/official guidance की आवश्यकता हो सकती है।", examples:["Wrong assumption","Missing verification","Poor record keeping"], mistakes:["गलती छिपाना","unverified advice को immediately apply करना"], summary:"Safe practice = verify + document + review + improve.", practice:"अपने subject में 5 common mistakes की checklist बनाएं।", activity:"एक mistake के लिए prevention rule लिखें।"},
      {title:"Real-world Application / वास्तविक उपयोग", body:"अब subject knowledge को एक meaningful scenario में लागू करें।", objectives:["Problem define करें।","Options compare करके responsible action चुनें।"], deep:"Application में context, stakeholders, resources, constraints, ethics और expected outcomes को साथ देखना चाहिए।", examples:["Community situation","Workplace situation","Personal learning situation"], mistakes:["एक ही solution सब पर लागू करना","impact और follow-up भूलना"], summary:"Knowledge तब capability बनती है जब वह context में सही तरह लागू हो।", practice:"एक realistic scenario पर step-by-step solution लिखें।", activity:"Action + expected result + follow-up का mini plan बनाएं।"}
    ]),
    make("4. Analysis & Advanced Practice / विश्लेषण एवं उन्नत अभ्यास", "समस्या समाधान, quality, ethics और continuous improvement सीखें।", [
      {title:"Analysis & Problem Solving / विश्लेषण एवं समस्या समाधान", body:en+" से जुड़ी समस्या को evidence के आधार पर define और solve करने का अभ्यास करें।", objectives:["Root cause और symptoms में अंतर करें।","Solution को evidence और feasibility से evaluate करें।"], deep:"Strong problem solving में समस्या की सीमा तय करना, data जुटाना, causes पहचानना, options बनाना, test करना और result review करना शामिल है।", examples:["5 Whys","Cause-effect map","Option comparison"], mistakes:["पहले solution तय कर लेना","root cause के बजाय symptom treat करना"], summary:"Define → Analyse → Options → Test → Review.", practice:"एक sample problem पर root-cause analysis करें।", activity:"तीन solutions को benefit, cost, risk और feasibility से compare करें।"},
      {title:"Quality, Ethics & Responsible Practice / गुणवत्ता, नैतिकता एवं जिम्मेदार उपयोग", body:"Good practice केवल result नहीं, बल्कि quality, dignity, privacy, fairness और safety को भी देखती है।", objectives:["Quality criteria तय करें।","Ethical/safety concerns पहचानें।"], deep:"जब किसी action का असर दूसरे लोगों पर पड़ता है, consent, privacy, fairness, documentation और accountability महत्वपूर्ण हो जाते हैं।", examples:["Accurate records","privacy-aware communication","inclusive practice"], mistakes:["short-term result के लिए safety छोड़ना","data या claims को exaggerate करना"], summary:"Responsible practice में quality और ethics दोनों शामिल हैं.", practice:"अपने subject के लिए 7-point quality checklist बनाएं।", activity:"एक difficult ethical scenario पर two-option analysis लिखें।"},
      {title:"Improve, Measure & Document / सुधार, मापन एवं दस्तावेज़ीकरण", body:"जो किया गया उसका evidence रखें, result measure करें और next improvement तय करें।", objectives:["Simple indicators चुनें।","Work को reproducible तरीके से document करें।"], deep:"Documentation future learning, audit, handover और improvement के लिए उपयोगी है। अच्छे records में date, purpose, action, result और next step स्पष्ट होते हैं।", examples:["Checklist","progress log","before/after comparison"], mistakes:["record बाद में memory से बनाना","measure किए बिना success claim करना"], summary:"Measure what matters, document what happened, improve what can be improved.", practice:"एक simple progress log template बनाएं।", activity:"अपने practice task के लिए 3 measurable indicators तय करें।"}
    ]),
    make("5. Mastery Check & Next Step / दक्षता जाँच एवं आगे की सीख", "Revision, assessment, reflection और आगे के learning path को पूरा करें।", [
      {title:"Revision & Knowledge Map / पुनरावृत्ति एवं ज्ञान मानचित्र", body:"पूरे "+en+" course को concepts, methods, practice और safety के map में जोड़ें।", objectives:["Major concepts recall करें।","Concepts को practical actions से जोड़ें।"], deep:"Revision केवल दोहराना नहीं है; gaps पहचानना, connections बनाना और बिना notes के explain करना mastery का बेहतर संकेत है।", examples:["Mind map","teach-back","flash questions"], mistakes:["केवल rereading","weak areas की practice न करना"], summary:"Recall + explain + apply + review = मजबूत retention.", practice:"बिना notes के 10 key points लिखें और बाद में check करें।", activity:"एक one-page knowledge map बनाएं।"},
      {title:"Final Practical Challenge / अंतिम व्यावहारिक चुनौती", body:"अब एक integrated task में foundation से application तक की पूरी learning दिखाएँ।", objectives:["Knowledge को complete workflow में लागू करें।","Output को quality checklist से review करें।"], deep:"Practical competence तब दिखाई देती है जब learner सही sequence, judgement, safety और quality के साथ task पूरा कर सके।", examples:["Plan → execute → verify → document","Scenario → decision → action → review"], mistakes:["final review छोड़ना","evidence के बिना completion मान लेना"], summary:"Integrated practice अलग-अलग lessons को एक usable skill में बदलती है.", practice:"अपने subject पर एक capstone task पूरा करें।", activity:"Output submit करने से पहले self-assessment checklist पूरा करें।"},
      {title:"Assessment, Reflection & Learning Path / आकलन, चिंतन एवं आगे की सीख", body:"अंत में knowledge check, practical reflection और next-level plan तैयार करें।", objectives:["अपनी strengths और gaps पहचानें।","अगले learning step की योजना बनाएं।"], deep:"Assessment का उद्देश्य केवल score नहीं है; यह learner को बताता है कि क्या समझ आया, कहाँ practice चाहिए और आगे क्या सीखना चाहिए।", examples:["Quiz","case response","practical checklist","reflection note"], mistakes:["score को capability का पूरा प्रमाण मानना","feedback ignore करना"], summary:"Assessment → feedback → improvement → next learning path.", practice:"अपनी 3 strengths, 3 gaps और next 3 actions लिखें।", activity:"30-day learning improvement plan बनाएं।"}
    ])
  ];
}

function LearningSubject({ subject, onBack }) {
  const progressKey = "ssf-learning-course-progress-" + subject.id;
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(progressKey) || "[]"); } catch { return []; }
  });
  const [activeLesson, setActiveLesson] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
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

  const structuredCourse = FLAGSHIP_COURSES[subject.id];
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
    : buildGenericLearningModules(subject);}