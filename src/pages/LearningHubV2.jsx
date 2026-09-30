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
  animal: "/images/real/animal.jpg",
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
const buildSubject = ([category, title, intro], index) => {
  const meta = CATEGORY_META[category] || CATEGORY_META["Education / शिक्षा"];
  const [en, hi] = title.split(" / ");
  return {
    id: slugify(title),
    category, title, intro, en, hi,
    image: HUB_IMAGES[meta.key],
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
  const [done, setDone] = useState([]);
  const [quiz, setQuiz] = useState(false);
  const sections = [
    ["01", "Introduction / परिचय", subject.intro],
    ["02", "What is it? / यह क्या है?", subject.title + " का अर्थ, मूल अवधारणा और इसके प्रमुख शब्दों को सरल भाषा में समझें।"],
    ["03", "Why is it important? / यह क्यों जरूरी है?", "यह विषय व्यक्ति, परिवार, समुदाय और समाज के सीखने, अवसरों, सुरक्षा या विकास से कैसे जुड़ता है—इसे उदाहरणों के साथ समझें।"],
    ["04", "Core Concepts / मूल बातें", "सबसे पहले मूल शब्द, प्रकार, भूमिकाएँ और आपस में उनके संबंध समझें। कठिन शब्दों को अपनी भाषा में लिखकर दोहराएँ।"],
    ["05", "Step-by-step Learning / चरणबद्ध सीखना", "पहले उद्देश्य तय करें, फिर विश्वसनीय जानकारी पढ़ें, एक छोटा practical task करें, परिणाम देखें और feedback के आधार पर सुधार करें।"],
    ["06", "Real-life Example / वास्तविक उदाहरण", "अपने घर, स्कूल, गाँव, workplace या community से एक छोटी स्थिति चुनें। उसमें इस विषय के principles लागू करके देखें और लिखें कि क्या बदला।"],
    ["07", "Practical Activity / व्यावहारिक गतिविधि", "एक notebook activity करें: आपने क्या जाना, कौन-सी समस्या दिखी, क्या विकल्प हैं, आपने क्या action चुना और आगे क्या सीखना है।"],
    ["08", "Do & Don't / क्या करें और क्या न करें", "तथ्य जाँचें, सम्मान रखें, privacy और safety का ध्यान रखें। बिना training, authority या professional advice के high-risk काम न करें।"],
    ["09", "Questions / प्रश्नोत्तर", "अपने शब्दों में पाँच प्रश्न बनाइए: यह क्या है? क्यों जरूरी है? इसका एक उदाहरण क्या है? क्या सावधानी चाहिए? आगे कहाँ से सीखेंगे?"],
    ["10", "Self-Check / स्वयं जाँच", "क्या मैं विषय को सरल भाषा में समझा सकता/सकती हूँ? क्या मैं एक वास्तविक उदाहरण दे सकता/सकती हूँ? क्या मुझे पता है कि कब official या expert source verify करना चाहिए?"],
    ["11", "Key Learning / मुख्य सीख", "विषय का अर्थ समझना, evidence और अनुभव को अलग रखना, practical action को सुरक्षित रखना और लगातार सीखना इस lesson की मुख्य सीख है।"],
    ["12", "Conclusion / निष्कर्ष", "सीखने का उद्देश्य केवल जानकारी याद करना नहीं, बल्कि सही समझ विकसित करना, जिम्मेदारी से उपयोग करना और जरूरत पड़ने पर आगे की विश्वसनीय जानकारी तक पहुँचना है।"]
  ];
  const toggle = (i) => setDone((d) => d.includes(i) ? d.filter(x=>x!==i) : [...d, i]);
  const videoSearch = "https://www.youtube.com/results?search_query=" + encodeURIComponent(subject.title + " educational Hindi English");
  const progress = Math.round((done.length / sections.length) * 100);
  return <div className="min-h-screen bg-zinc-50 text-zinc-900 font-inria">
    <section className={"relative overflow-hidden bg-gradient-to-r " + subject.color + " text-white"}>
      <img src={subject.image} alt={subject.title} className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-[#001529]/55" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-20">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20"><FaArrowLeft /> Back to Learning Hub</button>
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <div className="flex-1">
            <div className="text-sm font-bold uppercase tracking-widest text-white/70">SSF Learning Hub • Subject {subject.number}</div>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">{subject.en}</h1>
            <h2 className="mt-2 text-2xl font-bold text-white/85 md:text-3xl">{subject.hi}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">{subject.intro}</p>
          </div>
          <button onClick={()=>shareSubject(subject)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-[#003366]"><FaShareAlt /> Share / साझा करें</button>
        </div>
      </div>
    </section>

    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><div><div className="text-sm font-black text-[#003366]">Learning Progress / सीखने की प्रगति</div><div className="mt-1 text-xs text-zinc-500">{done.length} of {sections.length} sections completed</div></div><div className="text-2xl font-black text-[#003366]">{progress}%</div></div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full bg-[#003366] transition-all" style={{width: progress + "%"}} /></div>
          </div>
          <div className="space-y-5">
            {sections.map(([n, title, body], i) => <article key={n} className={"rounded-2xl border bg-white p-6 shadow-sm " + (done.includes(i) ? "border-green-200" : "border-zinc-200")}>
              <div className="flex gap-4">
                <div className={"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black " + (done.includes(i) ? "bg-green-100 text-green-700" : "bg-[#003366]/10 text-[#003366]")}>{done.includes(i) ? <FaCheckCircle /> : n}</div>
                <div className="flex-1"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-8 text-zinc-700">{body}</p>
                  <button onClick={()=>toggle(i)} className={"mt-5 rounded-lg px-4 py-2 text-xs font-bold " + (done.includes(i) ? "bg-green-50 text-green-700" : "bg-[#003366] text-white")}>{done.includes(i) ? "Completed ✓" : "Mark section complete"}</button>
                </div>
              </div>
            </article>)}
          </div>

          <section className="mt-8 rounded-2xl border border-[#003366]/10 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4"><FaQuestionCircle className="mt-1 text-2xl text-[#003366]" /><div><h2 className="text-2xl font-black">Practice & Quiz / अभ्यास एवं प्रश्नोत्तरी</h2><p className="mt-2 leading-7 text-zinc-600">अपने शब्दों में उत्तर लिखें। इस exercise का उद्देश्य समझ की जाँच है, केवल याद करना नहीं।</p>
              <button onClick={()=>setQuiz(!quiz)} className="mt-4 rounded-lg bg-[#003366] px-4 py-2 text-sm font-bold text-white">{quiz ? "Hide Questions" : "Show Questions"}</button>
              {quiz && <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-zinc-700"><li>यह विषय क्या है और इसका सरल अर्थ क्या है?</li><li>यह व्यक्ति या समुदाय के लिए क्यों महत्वपूर्ण है?</li><li>एक वास्तविक जीवन का उदाहरण लिखिए।</li><li>इस विषय में कौन-सी सावधानी जरूरी है?</li><li>आप आगे किस विश्वसनीय source से सीखेंगे?</li></ol>}
            </div></div>
          </section>

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><FaPlayCircle className="text-3xl text-[#003366]" /><div><h2 className="text-2xl font-black">Video Lesson / वीडियो पाठ</h2><p className="mt-1 text-sm text-zinc-600">इस विषय के लिए Hindi/English educational video slot। SSF का अपना verified video उपलब्ध होने पर यहाँ लगाया जा सकता है।</p></div></div>
            <a href={videoSearch} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#003366] px-5 py-3 text-sm font-bold text-white">Find Related Educational Videos <FaArrowRight /></a>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"><img src={subject.image} alt={subject.title} className="h-52 w-full object-cover" /><div className="p-5"><div className="text-xs font-black uppercase tracking-widest text-[#003366]">Visual Learning</div><p className="mt-2 text-sm leading-6 text-zinc-600">इस subject को पढ़ते समय image, examples और practical activity को साथ रखें।</p></div></div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><div className="text-xs font-black uppercase tracking-widest text-[#003366]">Responsible Learning</div><p className="mt-2 text-sm leading-6 text-zinc-600">Health, legal, financial, safety और technical topics में official guidance तथा qualified professionals की सलाह को प्राथमिकता दें।</p></div>
          <button onClick={()=>shareSubject(subject)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-[#003366]"><FaShareAlt /> Share this subject</button>
        </aside>
      </div>
    </main>
  </div>;
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
