import { useMemo, useState } from "react";
import {
  FaArrowLeft, FaArrowRight, FaBookOpen, FaCheckCircle, FaClock, FaGraduationCap,
  FaLeaf, FaLaptop, FaPlayCircle, FaQuestionCircle, FaSearch, FaShareAlt,
  FaShieldAlt, FaUsers, FaHeartbeat, FaSeedling, FaPaw, FaBalanceScale, FaChild,
  FaBriefcase, FaComments, FaUniversalAccess, FaHandsHelping
} from "react-icons/fa";

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
const makeSubjectVisual = (category, title, index) => { const bg=["#003366","#0f4c81","#2d6a4f","#8b1e3f","#9d0208","#386641","#463f3a","#264653","#6b4f3a","#6d597a","#33415c","#005f73","#003049"][index%13]; const esc=(s)=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); const svg="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1200\" height=\"700\"><rect width=\"1200\" height=\"700\" fill=\""+bg+"\"/><circle cx=\"1000\" cy=\"110\" r=\"180\" fill=\"white\" opacity=\".08\"/><circle cx=\"170\" cy=\"590\" r=\"240\" fill=\"white\" opacity=\".06\"/><text x=\"80\" y=\"120\" font-family=\"Arial\" font-size=\"28\" font-weight=\"700\" fill=\"white\" opacity=\".8\">SSF LEARNING HUB • "+esc(category.split(" / ")[0])+"</text><text x=\"80\" y=\"270\" font-family=\"Arial\" font-size=\"56\" font-weight=\"800\" fill=\"white\">"+esc(title.split(" / ")[0])+"</text><text x=\"80\" y=\"340\" font-family=\"Arial\" font-size=\"28\" fill=\"white\" opacity=\".82\">Learn • Understand • Practise • Share</text><path d=\"M80 420H1120\" stroke=\"white\" stroke-opacity=\".2\" stroke-width=\"3\"/><text x=\"80\" y=\"500\" font-family=\"Arial\" font-size=\"22\" fill=\"white\" opacity=\".72\">Subject "+String(index+1).padStart(3,"0")+"</text><text x=\"80\" y=\"550\" font-family=\"Arial\" font-size=\"22\" fill=\"white\" opacity=\".65\">Swastik Srijan Foundation</text></svg>"; return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg); };\n\nconst buildSubject = ([category, title, intro], index) => {
  const meta = CATEGORY_META[category] || CATEGORY_META["Education / शिक्षा"];
  const [en, hi] = title.split(" / ");
  return {
    id: slugify(title),
    category, title, intro, en, hi,
    image: makeSubjectVisual(category,title,index),\n    categoryImage: HUB_IMAGES[meta.key],
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

function LearningSubject({ subject, onBack }) {
  const progressKey = "ssf-learning-progress-" + subject.id;
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(progressKey) || "[]"); } catch { return []; }
  });
  const [quiz, setQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const sections = [
    ["01","Learning Objective / सीखने का उद्देश्य","इस lesson का उद्देश्य " + subject.title + " को सरल bilingual भाषा में समझना, सही जानकारी पहचानना और सुरक्षित practical use सीखना है।"],
    ["02","Introduction / परिचय",subject.intro],
    ["03","What is it? / यह क्या है?",subject.title + " का अर्थ, मूल अवधारणा और इसके प्रमुख शब्दों को सरल भाषा में समझें।"],
    ["04","Meaning & Definition / अर्थ एवं परिभाषा","मुख्य शब्दों का सरल अर्थ समझें और अपनी भाषा में लिखें। विषय को उसके उद्देश्य, प्रक्रिया, उपयोग और सीमाओं के साथ देखें।"],
    ["05","Why is it important? / यह क्यों जरूरी है?","यह विषय व्यक्ति, परिवार और समुदाय की समझ, अवसर, सुरक्षा, सीखने या विकास से कैसे जुड़ता है—इसे वास्तविक उदाहरणों के साथ समझें।"],
    ["06","Background / History / पृष्ठभूमि एवं इतिहास","विषय का विकास लोगों की जरूरतों, ज्ञान, तकनीक, समाज और संस्थागत अनुभवों के साथ हुआ है। पुराने और वर्तमान संदर्भ में अंतर समझें।"],
    ["07","Types / Categories / प्रकार एवं श्रेणियाँ","Basic / मूल स्तर, Practical / व्यावहारिक स्तर और Advanced / उन्नत स्तर—तीनों को समझें तथा विषय के अनुसार वास्तविक categories पहचानें।"],
    ["08","Basic Concepts / मूल अवधारणाएँ","मुख्य vocabulary, purpose, roles, process और expected result पहले समझें। कठिन शब्दों को अपनी भाषा में लिखकर दोहराएँ।"],
    ["09","Detailed Explanation / विस्तृत समझ","Concept → process → example → practice → review की श्रृंखला अपनाएँ। केवल definition याद करने के बजाय देखें कि विषय वास्तविक परिस्थिति में कैसे काम करता है।"],
    ["10","Real-life Examples / वास्तविक जीवन के उदाहरण","घर, स्कूल, खेत, workplace, digital environment या community से एक वास्तविक स्थिति चुनें। समस्या, action और result अलग-अलग पहचानें।"],
    ["11","Step-by-step Learning / चरणबद्ध सीखना","1) उद्देश्य तय करें। 2) मुख्य concepts सीखें। 3) विश्वसनीय material पढ़ें। 4) छोटा practical task करें। 5) परिणाम जाँचें। 6) feedback लेकर सुधारें।"],
    ["12","Practical Use / व्यावहारिक उपयोग","सीखी जानकारी को छोटे, सुरक्षित और measurable task में लागू करें। उपयोग के बाद परिणाम लिखें और जरूरत होने पर तरीका सुधारें।"],
    ["13","Do & Don’t / क्या करें और क्या न करें","क्या करें: facts verify करें, privacy/consent/safety रखें, official guidance लें और records रखें। क्या न करें: misinformation forward न करें, निजी जानकारी साझा न करें और बिना training high-risk काम न करें।"],
    ["14","Activities / गतिविधियाँ","एक notebook activity करें: आपने क्या जाना, कौन-सी समस्या दिखी, क्या विकल्प हैं, आपने क्या action चुना और आगे क्या सीखना है।"],
    ["15","Practice / अभ्यास","अपने शब्दों में 5-line summary लिखें। फिर एक example, एक practical use, एक सावधानी और एक next step लिखें।"],
    ["16","Questions & Answers / प्रश्नोत्तर","यह क्या है? क्यों जरूरी है? इसका एक real-life example क्या है? practical use क्या है? कौन-सी सावधानी जरूरी है? अपने उत्तर lesson के आधार पर लिखें।"],
    ["17","Quiz / Assessment / प्रश्नोत्तरी एवं आकलन","नीचे दिए गए 5 प्रश्नों का उत्तर दें। प्रत्येक प्रश्न lesson की समझ, responsible use और practical learning को जाँचता है।"] ,
    ["18","Key Points / मुख्य बिंदु","अर्थ समझें • मुख्य concepts पहचानें • example देखें • सुरक्षित practice करें • source verify करें • सीख record करें • जरूरत पर expert/official guidance लें।"],
    ["19","Related Topics / संबंधित विषय","इसी category के अन्य subjects पढ़ें। Search box से related keyword खोजें और अगला lesson चुनें।"],
    ["20","Useful Resources / उपयोगी संसाधन","Current information के लिए official government portals, recognised educational resources और trusted subject organisations का उपयोग करें। Current rules/eligibility हमेशा official source से verify करें।"],
    ["21","Government Schemes & Services / सरकारी योजनाएँ एवं सेवाएँ","इस विषय से संबंधित scheme/service उपलब्ध हो सकती है। Eligibility, dates और benefits बदल सकते हैं; इसलिए संबंधित Central/State official portal पर current guideline verify करें। Learning Hub eligibility या benefit की guarantee नहीं करता।"],
    ["22","SSF Learning & Community Perspective / SSF की सीख एवं सामुदायिक दृष्टि","SSF Learning Hub knowledge को practical, responsible और community-oriented learning में बदलने पर जोर देता है—सत्य, सहभागिता, सम्मान, self-reliance और lifelong learning के साथ।"],
    ["23","Video Lesson / वीडियो पाठ","Video sequence: Opening → Topic Introduction → Explanation → Visual Examples → Practical Example → Recap → Questions → Conclusion. Verified SSF video उपलब्ध होने पर इसी slot में जोड़ा जाएगा।"],
    ["24","What will be learned in video? / वीडियो में क्या सीखेंगे?","Topic introduction, key concepts, visual example, practical illustration, common mistakes, safety/verification points और final recap।"],
    ["25","Summary / सारांश",subject.title + " को पूरा करने के बाद learner को इसका अर्थ, महत्व, concepts, practical use और responsible learning approach स्पष्ट होना चाहिए।"],
    ["26","Conclusion / निष्कर्ष","अच्छी learning केवल information याद करना नहीं है। सही समझ, अभ्यास, verification, reflection और जिम्मेदार उपयोग से knowledge को useful skill में बदला जाता है।"],
    ["27","Next Lesson / अगला पाठ","इस category में अगला संबंधित subject चुनें या Search से अपनी learning जरूरत के अनुसार नया lesson शुरू करें।"]
  ];
  const toggle=(i)=>setDone(d=>{
    const next=d.includes(i)?d.filter(x=>x!==i):[...d,i];
    try { localStorage.setItem(progressKey, JSON.stringify(next)); } catch {}
    return next;
  });
  const progress=Math.round((done.length/sections.length)*100);
  const videoSearch="https://www.youtube.com/results?search_query="+encodeURIComponent(subject.title+" educational Hindi English lesson");
  const quizQuestions = [
    { q: "इस lesson का मुख्य विषय क्या है?", options: [subject.en, "केवल मनोरंजन", "केवल विज्ञापन", "इनमें से कोई नहीं"], answer: 0 },
    { q: "सीखी हुई जानकारी का जिम्मेदार उपयोग कैसे करें?", options: ["तथ्य verify करके और सुरक्षित तरीके से", "बिना जाँचे share करके", "बिना training high-risk काम करके", "निजी जानकारी public करके"], answer: 0 },
    { q: "अच्छी learning में कौन-सा क्रम उपयोगी है?", options: ["समझ → उदाहरण → अभ्यास → review", "केवल याद करना", "केवल video देखना", "बिना अभ्यास आगे बढ़ना"], answer: 0 },
    { q: "Current scheme/rule की जानकारी कहाँ verify करनी चाहिए?", options: ["संबंधित official source", "random forwarded message", "अनजान social post", "असत्यापित screenshot"], answer: 0 },
    { q: "इस lesson का practical लक्ष्य क्या है?", options: ["ज्ञान को समझकर सुरक्षित और उपयोगी skill में बदलना", "केवल title याद करना", "केवल certificate लेना", "बिना समझे copy करना"], answer: 0 }
  ];
  const submitQuiz = () => {
    const score = quizQuestions.reduce((sum, item, i) => sum + (quizAnswers[i] === item.answer ? 1 : 0), 0);
    setQuizScore(score);
    setQuizSubmitted(true);
  };
  const share=()=>{const url=window.location.href.split("?")[0]+"?subject="+encodeURIComponent(subject.id);if(navigator.share)navigator.share({title:subject.title+" | SSF Learning Hub",text:subject.intro,url}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>window.alert("Learning link copied."));};
  return <div className="min-h-screen bg-zinc-50 text-zinc-900 font-inria">
    <section className={"relative overflow-hidden bg-gradient-to-r "+subject.color+" text-white"}><img src={subject.image} alt={subject.title} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-[#001529]/60"/><div className="relative mx-auto max-w-7xl px-4 py-12 md:py-18">
      <button onClick={onBack} className="mb-7 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold"><FaArrowLeft/> Back / वापस</button>
      <div className="flex flex-col gap-6 md:flex-row md:items-end"><div className="flex-1"><div className="text-xs font-black uppercase tracking-widest text-white/75">SSF Learning Hub • Subject {subject.number}</div><h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">{subject.en}</h1><h2 className="mt-2 text-2xl font-bold md:text-3xl">{subject.hi}</h2><p className="mt-5 max-w-4xl text-lg leading-8 text-white/90">{subject.intro}</p></div><button onClick={share} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-[#003366]"><FaShareAlt/> Share / साझा करें</button></div>
    </div></section>
    <main className="mx-auto max-w-7xl px-4 py-10"><div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><div className="text-sm font-black text-[#003366]">Course Progress / पाठ्यक्रम प्रगति</div><div className="mt-1 text-xs text-zinc-500">{done.length} / {sections.length} sections completed</div></div><div className="text-2xl font-black text-[#003366]">{progress}%</div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full bg-[#003366]" style={{width:progress+"%"}}/></div></div>
    <div className="grid gap-8 lg:grid-cols-[1fr_330px]"><div className="space-y-5">{sections.map(([n,title,body],i)=><article key={n} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"><div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#003366]/10 text-[#003366] font-black">{done.includes(i)?<FaCheckCircle/>:n}</div><div className="flex-1"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-8 text-zinc-700">{body}</p><button onClick={()=>toggle(i)} className="mt-5 rounded-lg bg-[#003366] px-4 py-2 text-xs font-bold text-white">{done.includes(i)?"Completed ✓ / पूर्ण":"Mark complete / पूर्ण करें"}</button></div></div></article>)}</div>
    <aside className="space-y-5">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="font-black text-[#003366]">Quiz / प्रश्नोत्तरी</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">5 प्रश्न • तुरंत score • गलत उत्तर पर lesson दोबारा पढ़ें।</p>
        <button onClick={()=>{setQuiz(v=>!v);setQuizSubmitted(false);}} className="mt-4 w-full rounded-xl bg-[#003366] px-4 py-3 text-sm font-bold text-white">{quiz ? "Close Quiz / बंद करें" : "Start Quiz / शुरू करें"}</button>
        {quiz && <div className="mt-5 space-y-5">
          {quizQuestions.map((item,i)=><div key={i} className="rounded-xl bg-zinc-50 p-4">
            <div className="text-sm font-black">{i+1}. {item.q}</div>
            <div className="mt-3 space-y-2">{item.options.map((option,j)=><label key={j} className="flex cursor-pointer gap-2 text-sm leading-5">
              <input type="radio" name={"quiz-"+i} checked={quizAnswers[i]===j} onChange={()=>setQuizAnswers(a=>({...a,[i]:j}))} />
              <span>{option}</span>
            </label>)}</div>
          </div>)}
          <button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length<quizQuestions.length} className="w-full rounded-xl bg-[#0f4c81] px-4 py-3 text-sm font-bold text-white disabled:opacity-40">Submit Quiz / जमा करें</button>
          {quizSubmitted && <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
            <div className="text-2xl font-black text-[#003366]">{quizScore}/5</div>
            <p className="mt-1 text-sm text-zinc-600">{quizScore>=4 ? "Excellent — lesson understood. / बहुत अच्छा — lesson की अच्छी समझ है।" : "Review the lesson and try again. / lesson दोबारा पढ़ें और फिर प्रयास करें।"}</p>
          </div>}
        </div>}
      </div><div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"><img src={subject.image} alt={subject.title} className="h-52 w-full object-cover"/><div className="p-5"><div className="text-xs font-black uppercase tracking-widest text-[#003366]">Visual Learning / दृश्य सीख</div><p className="mt-2 text-sm leading-6 text-zinc-600">इस subject की visual identity इसी lesson से जुड़ी है।</p></div></div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><h3 className="font-black text-[#003366]">Practice + Quiz + Certificate</h3><p className="mt-2 text-sm leading-6 text-zinc-600">Lesson पढ़ें → Practice करें → Quiz पूरा करें → Course complete करें → certificate workflow के लिए record तैयार होगा।</p></div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><h3 className="font-black text-[#003366]">Video Lesson / वीडियो पाठ</h3><p className="mt-2 text-sm leading-6 text-zinc-600">Opening → Introduction → Explanation → Visual Examples → Practical Example → Recap → Questions → Conclusion.</p><a href={videoSearch} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#003366] px-4 py-3 text-sm font-bold text-white">Find Related Video <FaArrowRight/></a></div>
      <button onClick={share} className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-[#003366]"><FaShareAlt/> Share this subject</button>
    </aside></div></main></div>;
}
export default function LearningHubV2() {
  const [subjectId, setSubjectId] = useState(getSubjectFromUrl);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

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
  return <div className="min-h-screen bg-zinc-50 font-inria text-zinc-900">
    <section className="relative overflow-hidden bg-[#002344] text-white">
      <img src="/images/real/education_girls.jpg" alt="Students learning" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-[#002344]/80" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest"><FaGraduationCap /> Swastik Srijan Foundation</div>
        <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">SSF Learning Hub</h1>
        <h2 className="mt-3 text-2xl font-bold text-white/80">सीखिए • समझिए • अभ्यास कीजिए | Learn • Understand • Practise</h2>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-white/80">A free bilingual learning space where SSF objectives are converted into subjects that people can actually read, understand, practise and share.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white/10 p-5"><div className="text-3xl font-black">{SUBJECTS.length}</div><div className="text-sm font-bold">Subjects / विषय</div></div><div className="rounded-2xl bg-white/10 p-5"><div className="text-3xl font-black">{Object.keys(CATEGORY_META).length}</div><div className="text-sm font-bold">Learning Areas / क्षेत्र</div></div><div className="rounded-2xl bg-white/10 p-5"><div className="text-3xl font-black">Hindi + English</div><div className="text-sm font-bold">Bilingual Learning</div></div></div>
      </div>
    </section>

    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row"><div className="relative flex-1"><FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search subjects / विषय खोजें..." className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-4 pl-11 pr-4 outline-none focus:border-[#003366]" /></div><button onClick={()=>{setQuery("");setCategory("All")}} className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-bold text-[#003366]">Reset</button></div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={"shrink-0 rounded-full px-4 py-2 text-xs font-bold " + (category===c ? "bg-[#003366] text-white" : "bg-zinc-100 text-zinc-600")}>{c}</button>)}</div>
      </section>

      <section className="py-12">
        <div className="mb-8"><div className="text-sm font-black uppercase tracking-widest text-[#003366]">Learning Library / अध्ययन पुस्तकालय</div><h2 className="mt-2 text-4xl font-black">हर विषय को पढ़ें, समझें और सीखें</h2><p className="mt-3 max-w-4xl leading-7 text-zinc-600">हर card एक अलग shareable subject page खोलता है। Subject में introduction, meaning, importance, core concepts, practical learning, activity, do/don't, self-check, questions, video section और conclusion दिया गया है।</p></div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(s=><article key={s.id} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-48 overflow-hidden"><img src={s.image} alt={s.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-4 left-4 right-4 text-white"><div className="text-xs font-black uppercase tracking-widest opacity-80">{s.category}</div><h3 className="mt-1 text-xl font-black">{s.en}</h3><div className="text-sm font-bold opacity-90">{s.hi}</div></div></div>
            <div className="p-5"><p className="min-h-20 text-sm leading-6 text-zinc-600">{s.intro}</p><div className="mt-5 flex gap-2"><button onClick={()=>openSubject(s)} className="flex-1 rounded-xl bg-[#003366] px-4 py-3 text-sm font-black text-white">Start Learning <FaArrowRight className="ml-1 inline" /></button><button onClick={()=>shareSubject(s)} title="Share" className="rounded-xl border border-zinc-200 px-4 py-3 text-[#003366]"><FaShareAlt /></button></div></div>
          </article>)}
        </div>
        {!filtered.length && <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">No subject found. Try another search.</div>}
      </section>

      <section className="grid gap-6 pb-12 md:grid-cols-4">
        {[
          [FaBookOpen, "Read / पढ़ें", "हर subject को सरल भाषा में विस्तार से समझें।"],
          [FaPlayCircle, "Watch / देखें", "हर subject में related video learning slot।"],
          [FaCheckCircle, "Practise / अभ्यास", "Activities, self-check और questions से सीखें।"],
          [FaShareAlt, "Share / साझा करें", "हर subject का अलग link share करें।"]
        ].map(([Icon,title,desc])=><div key={title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"><Icon className="text-3xl text-[#003366]" /><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-600">{desc}</p></div>)}
      </section>
    </main>
  </div>;
}
