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
    duration: "Self-paced",
    ready: true,
    description: "A complete practical guide to preparing a truthful, clear and job-ready Resume or CV for employment, internships, volunteering and further opportunities.",
    lessons: [
      ["01", "Resume vs CV", "Understand the purpose, difference, typical sections and when a short resume or longer CV may be appropriate."],
      ["02", "Collect Your Information", "Prepare education, skills, experience, projects, certificates, contact details and achievements before writing."],
      ["03", "Write a Strong Profile", "Create a short, truthful professional summary that matches your actual skills and the opportunity."],
      ["04", "Education, Skills & Experience", "Present qualifications, technical skills, soft skills, internships, volunteering and experience clearly and consistently."],
      ["05", "Projects & Achievements", "Describe genuine projects and achievements using specific responsibilities, outputs and measurable facts where available."],
      ["06", "Formatting & Accuracy", "Use readable structure, consistent dates, correct spelling and professional formatting; avoid false claims."],
      ["07", "Job-Specific Customisation", "Read the opportunity, identify relevant requirements and tailor the document without copying misleading keywords."],
      ["08", "Final Checklist & Application", "Check contact details, attachments, file name, privacy, references and the final application before sending."],
    ],
    resources: [
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
      ["OpenLearn", FREE_RESOURCES.openLearn],
    ],
  }
  {
    slug: "job-search",
    category: "Career & Jobs",
    icon: FaBriefcase,
    title: "Job Search Skills",
    hi: "नौकरी खोजने की तैयारी",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "A complete guide to finding opportunities, reading job descriptions, preparing applications, networking safely and following up professionally.",
    lessons: [
      ["01", "Know What You Want", "Define the type of work, location, schedule, qualification level and skills that match your real situation."],
      ["02", "Find Reliable Opportunities", "Use official employer pages, trusted job platforms, professional networks and verified recruitment channels."],
      ["03", "Read a Job Description", "Separate essential qualifications, preferred skills, responsibilities, location, pay information and application requirements."],
      ["04", "Prepare Your Application", "Match your truthful resume and cover message to the role and organise documents before applying."],
      ["05", "Professional Networking", "Build genuine professional connections, ask useful questions and avoid spam or misleading requests."],
      ["06", "Interview & Follow-up", "Prepare for interviews, record applications and send concise, respectful follow-ups when appropriate."],
      ["07", "Fraud & Recruitment Safety", "Recognise requests for money, suspicious links, fake offers, identity theft and other recruitment scams."],
      ["08", "Job Search Plan", "Create a weekly search routine, track applications, learn from responses and continuously improve your skills."],
    ],
    resources: [
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
      ["OpenLearn", FREE_RESOURCES.openLearn],
    ],
  }
  {
    slug: "professional-email",
    category: "Professional Writing",
    icon: FaEnvelope,
    title: "Professional Email Writing",
    hi: "Professional Email कैसे लिखें",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "A complete guide to writing clear, respectful and useful professional emails for requests, updates, applications, meetings and follow-ups.",
    lessons: [
      ["01", "Purpose & Recipient", "Decide why the email is needed, who must receive it and what action or information is required."],
      ["02", "Subject Line", "Write a short subject that lets the reader understand the purpose without opening the message."],
      ["03", "Opening & Context", "Use an appropriate greeting and explain the relevant context briefly and clearly."],
      ["04", "Main Request or Information", "Write the important message in logical paragraphs, bullets or numbered points."],
      ["05", "Attachments & Links", "Name files clearly, mention attachments, check permissions and avoid unsafe or unnecessary links."],
      ["06", "Follow-up & Reminders", "Follow up politely, refer to the earlier message and state the next action needed."],
      ["07", "Professional Tone & Privacy", "Avoid anger, unnecessary personal information, ALL CAPS, slang and accidental disclosure of sensitive data."],
      ["08", "Final Email Checklist", "Check recipient, subject, spelling, facts, attachments, links and tone before pressing Send."],
    ],
    resources: [
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
      ["British Council LearnEnglish", FREE_RESOURCES.britishCouncil],
    ],
  }
  {
    slug: "professional-messages",
    category: "Professional Writing",
    icon: FaEnvelope,
    title: "Professional Messages & WhatsApp",
    hi: "Professional Messages एवं WhatsApp",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn how to write short, respectful and actionable official messages, reminders, notices and follow-ups without creating confusion or pressure.",
    lessons: [
      ["01", "Purpose of a Short Message", "Know when a message is appropriate and when a formal email, notice or call is better."],
      ["02", "Clear Message Structure", "Use greeting, context, key information, required action and deadline in a simple order."],
      ["03", "Meeting & Event Messages", "Share date, time, venue or link, agenda, participation instructions and contact information."],
      ["04", "Reminder & Follow-up", "Send respectful reminders that record the purpose and expected response without harassment."],
      ["05", "Official WhatsApp Groups", "Use groups responsibly, avoid unnecessary forwarding and keep official conversations organised."],
      ["06", "Attachments, Links & Privacy", "Check documents, links and recipients before sharing personal or confidential information."],
      ["07", "Conflict & Sensitive Communication", "Respond calmly, factually and privately when a message concerns disagreement, absence or accountability."],
      ["08", "Message Checklist", "Before sending, verify recipient, facts, date, time, link, language and the exact action requested."],
    ],
    resources: [
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
    ],
  }
  {
    slug: "computer-digital-basics",
    category: "Digital Skills",
    icon: FaDesktop,
    title: "Computer & Digital Basics",
    hi: "Computer एवं Digital Basics",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "A complete beginner pathway covering computer hardware, operating systems, files, typing, browsers, documents, storage and safe everyday digital work.",
    lessons: [
      ["01", "Computer & Device Basics", "Understand desktop, laptop, mobile devices, keyboard, mouse, screen, ports, storage and basic hardware terms."],
      ["02", "Operating System & Settings", "Learn applications, windows, folders, settings, updates, accessibility options and basic troubleshooting."],
      ["03", "Files & Folders", "Create, rename, copy, move, organise, search, back up and safely delete files."],
      ["04", "Typing & Documents", "Practise typing, text formatting, saving documents and using basic office productivity features."],
      ["05", "Internet & Browser Basics", "Use browsers, tabs, search, downloads, bookmarks and safe website practices."],
      ["06", "Email & Online Services", "Create and manage email messages, attachments, accounts and common online forms."],
      ["07", "Security & Maintenance", "Use updates, strong authentication, backups and safe downloads; recognise suspicious activity."],
      ["08", "Practical Digital Task", "Complete an end-to-end exercise: create a document, save it, find it, attach it to an email and back it up."],
    ],
    resources: [
      ["Google Applied Digital Skills", FREE_RESOURCES.googleDigital],
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
    ],
  }
  {
    slug: "google-workspace",
    category: "Digital Skills",
    icon: FaLaptopCode,
    title: "Google Workspace & Office Productivity",
    hi: "Google Workspace एवं Office Productivity",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn practical workflows for Gmail, Drive, Docs, Sheets, Forms and Calendar with safe sharing, collaboration and record-keeping.",
    lessons: [
      ["01", "Workspace Basics", "Understand accounts, applications, files, permissions and the difference between personal and shared work."],
      ["02", "Gmail", "Write professional emails, organise conversations, use labels, attachments, signatures and search effectively."],
      ["03", "Google Drive", "Create folders, upload files, organise records, manage sharing and avoid accidental public access."],
      ["04", "Google Docs", "Create structured documents, collaborate, comment, use version history and prepare clean printable records."],
      ["05", "Google Sheets", "Enter data, use basic formulas, filters, sorting, validation and simple record-management workflows."],
      ["06", "Google Forms", "Create forms, collect responses responsibly, review data and protect personal information."],
      ["07", "Google Calendar & Meetings", "Schedule events, invite participants, add agendas and manage online meeting information."],
      ["08", "Integrated Office Workflow", "Practise a complete workflow from form response to sheet, document, email, calendar event and organised Drive record."],
    ],
    resources: [
      ["Google Applied Digital Skills", FREE_RESOURCES.googleDigital],
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
    ],
  }
  {
    slug: "internet-safety",
    category: "Digital Skills",
    icon: FaShieldAlt,
    title: "Internet & Online Safety",
    hi: "Internet एवं Online Safety",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "A practical digital-safety guide covering accounts, passwords, phishing, scams, privacy, devices, social media and responsible reporting.",
    lessons: [
      ["01", "Digital Risk Basics", "Understand common online risks including account takeover, fraud, malware, impersonation and privacy loss."],
      ["02", "Passwords & Authentication", "Create unique passwords, use a password manager where appropriate and enable multi-factor authentication."],
      ["03", "Phishing & Suspicious Links", "Check sender, domain, context and urgency before opening links, files or sharing information."],
      ["04", "Online Payments & Scams", "Learn safe payment habits, verify requests independently and never share OTPs, PINs or authentication codes."],
      ["05", "Privacy & Personal Data", "Understand what personal information can be sensitive and how apps, websites and social platforms use it."],
      ["06", "Device & App Security", "Keep systems updated, install apps from trusted sources and review permissions and backups."],
      ["07", "Social Media & Misinformation", "Verify claims, protect identity, seek consent before sharing others' information and avoid harmful forwarding."],
      ["08", "Incident Response Checklist", "Learn what to do after a suspected compromise: stop, secure accounts, preserve evidence and use official reporting channels."],
    ],
    resources: [
      ["Google Applied Digital Skills", FREE_RESOURCES.googleDigital],
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
    ],
  }
  {
    slug: "workplace-etiquette",
    category: "Workplace Skills",
    icon: FaUserTie,
    title: "Workplace Etiquette",
    hi: "कार्यस्थल व्यवहार",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn professional behaviour, punctuality, communication, meetings, responsibility, teamwork, boundaries and respectful workplace conduct.",
    lessons: [
      ["01", "Professional Conduct", "Understand respect, honesty, reliability, appropriate language and responsibility at work."],
      ["02", "Time & Punctuality", "Plan arrival, deadlines, breaks and commitments so colleagues can depend on you."],
      ["03", "Communication Etiquette", "Listen actively, speak clearly, ask questions and avoid unnecessary conflict or gossip."],
      ["04", "Meetings & Participation", "Prepare, join on time, follow the agenda, contribute constructively and record agreed actions."],
      ["05", "Email & Digital Etiquette", "Use professional messages, appropriate channels, privacy-aware sharing and clear subject lines."],
      ["06", "Feedback & Disagreement", "Receive feedback without defensiveness and raise disagreements respectfully with facts and solutions."],
      ["07", "Boundaries, Safety & Inclusion", "Respect personal boundaries, dignity, accessibility and applicable workplace rules and reporting mechanisms."],
      ["08", "Professional Habit Checklist", "Build a daily checklist for punctuality, communication, task tracking, learning and follow-through."],
    ],
    resources: [
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
    ],
  }
  {
    slug: "teamwork-leadership",
    category: "Workplace Skills",
    icon: FaStar,
    title: "Teamwork & Leadership Basics",
    hi: "Teamwork एवं Leadership Basics",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "A practical introduction to teamwork, responsibility, communication, problem-solving, delegation, leadership and ethical decision-making.",
    lessons: [
      ["01", "What Makes a Team", "Understand shared goals, roles, trust, communication and accountability."],
      ["02", "Your Role & Responsibility", "Clarify responsibilities, deadlines, dependencies and how individual work affects the team."],
      ["03", "Communication & Listening", "Use clear updates, active listening, questions and respectful disagreement."],
      ["04", "Problem Solving", "Define the problem, identify causes, compare options and agree on practical actions."],
      ["05", "Delegation & Follow-up", "Assign tasks according to capability, explain expectations and review progress without micromanaging."],
      ["06", "Leadership & Decision-Making", "Learn service-oriented leadership, evidence-based decisions, fairness and transparent communication."],
      ["07", "Conflict & Team Trust", "Recognise misunderstandings early, separate people from problems and seek constructive resolution."],
      ["08", "Team Action Plan", "Create a simple team goal, responsibility matrix, timeline, review method and learning loop."],
    ],
    resources: [
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
      ["OpenLearn", FREE_RESOURCES.openLearn],
    ],
  }
  {
    slug: "public-speaking",
    category: "Personal Development",
    icon: FaComments,
    title: "Confidence & Public Speaking",
    hi: "आत्मविश्वास एवं Public Speaking",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Build practical confidence and learn how to prepare, structure, deliver and improve speeches, presentations and community communication.",
    lessons: [
      ["01", "Confidence & Mindset", "Understand preparation, practice and gradual exposure as practical ways to improve speaking confidence."],
      ["02", "Know Your Audience", "Identify who is listening, what they need and what level of language and detail is appropriate."],
      ["03", "Structure a Speech", "Build an opening, clear points, examples, transitions, conclusion and call to action where appropriate."],
      ["04", "Voice & Body Language", "Practise pace, volume, pauses, posture, eye contact and natural gestures."],
      ["05", "Stories & Examples", "Use truthful examples, simple explanations and relevant stories without exaggeration or invented claims."],
      ["06", "Questions & Difficult Moments", "Handle questions, uncertainty and mistakes calmly; say when you do not know an answer."],
      ["07", "Presentation Practice", "Record or rehearse a short presentation and review clarity, timing and audience engagement."],
      ["08", "Final Speaking Checklist", "Prepare topic, facts, structure, visual aids, timing, pronunciation and a respectful closing."],
    ],
    resources: [
      ["British Council LearnEnglish", FREE_RESOURCES.britishCouncil],
      ["OpenLearn", FREE_RESOURCES.openLearn],
    ],
  }
  {
    slug: "time-management",
    category: "Personal Development",
    icon: FaClock,
    title: "Time Management & Productivity",
    hi: "Time Management एवं Productivity",
    level: "Beginner",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn practical planning, prioritisation, focus, scheduling, task tracking, review and sustainable work habits.",
    lessons: [
      ["01", "Understand Your Time", "Identify fixed commitments, recurring tasks, interruptions, energy patterns and time-wasting habits."],
      ["02", "Goals & Priorities", "Turn broad goals into clear tasks and distinguish urgent, important and low-value work."],
      ["03", "Daily & Weekly Planning", "Create realistic schedules with buffers, breaks, dependencies and time for unexpected work."],
      ["04", "Focus & Distraction Control", "Use focused work periods, notifications control, clean workspaces and single-tasking where practical."],
      ["05", "Task Lists & Tracking", "Break work into next actions, assign deadlines and track progress without creating an unmanageable list."],
      ["06", "Delegation & Saying No", "Understand what can be delegated, deferred or declined and communicate capacity respectfully."],
      ["07", "Review & Improve", "Compare planned versus actual time, identify bottlenecks and adjust the next plan."],
      ["08", "Build a Sustainable Routine", "Create a simple weekly system balancing work, learning, rest, health and important responsibilities."],
    ],
    resources: [
      ["Microsoft Learn", FREE_RESOURCES.microsoftLearn],
      ["OpenLearn", FREE_RESOURCES.openLearn],
    ],
  }
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
    ready: true,
    description: "A general education module on wellbeing, movement, breathing, sleep, stress management and responsible use of yoga practices; it is not a substitute for medical care.",
    lessons: [
      ["01", "Wellbeing Basics", "Understand physical, mental, social and everyday wellbeing and why healthy habits are individual and contextual."],
      ["02", "Yoga as a Practice", "Learn basic concepts of yoga, mindful movement, breathing and relaxation without treating yoga as a guaranteed cure."],
      ["03", "Safe Practice", "Understand warm-up, gradual progression, suitable space, hydration and the need to stop when something feels unsafe."],
      ["04", "Breathing & Relaxation", "Explore simple, non-strenuous breathing and relaxation practices and understand when professional advice is appropriate."],
      ["05", "Sleep, Food & Activity", "Learn how regular sleep, balanced nutrition and appropriate physical activity contribute to general wellbeing."],
      ["06", "Stress & Daily Routine", "Identify common stressors and build practical routines using rest, movement, social support and healthy coping."],
      ["07", "Limits & Professional Care", "Recognise that persistent or serious symptoms require qualified medical or mental-health support rather than self-treatment."],
      ["08", "Personal Wellbeing Plan", "Create a realistic weekly routine and track habits without making medical claims about outcomes."],
    ],
  }
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
    ready: true,
    description: "A complete introduction to rural development, community needs assessment, local resources, participation, livelihoods, infrastructure and responsible programme planning.",
    lessons: [
      ["01", "What Is Rural Development?", "Understand development as a combination of social, economic, human, environmental and institutional progress."],
      ["02", "Community Needs Assessment", "Learn how to identify needs, assets, priorities and local constraints through respectful consultation and evidence."],
      ["03", "Participation & Inclusion", "Understand why women, youth, older persons, persons with disabilities and marginalised groups should be included in planning."],
      ["04", "Livelihoods & Local Economy", "Explore agriculture, skills, small enterprises, services, producer groups and other local livelihood pathways."],
      ["05", "Basic Services & Infrastructure", "Understand the role of education, health, sanitation, water, roads, connectivity and digital access in community development."],
      ["06", "Natural Resources & Sustainability", "Learn how land, water, forests, biodiversity and climate risks affect rural planning."],
      ["07", "Project Planning & Monitoring", "Build a simple need-objective-activity-output-outcome-indicator framework with records and review."],
      ["08", "Community Action Plan", "Create a practical, evidence-based action plan that separates existing work, proposed work and future possibilities."],
    ],
  }
  {
    slug: "renewable-energy",
    category: "SSF Knowledge & Awareness",
    icon: FaStar,
    title: "Renewable Energy & Energy Awareness",
    hi: "नवीकरणीय ऊर्जा एवं ऊर्जा जागरूकता",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn the fundamentals of solar, wind, biomass and other renewable energy systems, energy efficiency, safety and responsible project thinking.",
    lessons: [
      ["01", "Energy Basics", "Understand energy, electricity, power, demand, generation and why energy efficiency matters."],
      ["02", "Solar Energy", "Learn basic solar photovoltaic concepts, components, suitable applications, limitations and maintenance considerations."],
      ["03", "Wind & Other Renewables", "Understand wind, small hydro, biomass and other renewable-energy approaches at a basic awareness level."],
      ["04", "Energy Efficiency", "Learn practical ways to reduce unnecessary energy use in homes, offices, farms and community spaces."],
      ["05", "Storage & Reliability", "Understand batteries, storage, intermittent generation and the importance of system design by qualified professionals."],
      ["06", "Safety & Responsible Use", "Learn electrical safety, installation boundaries and why technical work should be handled by qualified personnel."],
      ["07", "Project & Cost Thinking", "Compare need, site, technology, lifecycle cost, maintenance, financing and expected use before proposing a project."],
      ["08", "Community Energy Plan", "Create an awareness-level energy checklist and identify official technical or government sources for current options."],
    ],
  }
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
    ready: true,
    description: "Learn disability inclusion, accessibility, dignity, reasonable support, assistive technologies and rehabilitation pathways without stereotyping or exclusion.",
    lessons: [
      ["01", "Understanding Disability", "Learn the difference between impairment, disability and environmental barriers and use respectful, person-centred language."],
      ["02", "Rights, Dignity & Inclusion", "Understand equality, participation, accessibility and the importance of removing barriers rather than blaming individuals."],
      ["03", "Accessible Communication", "Practise respectful communication, accessible information, consent and asking before providing assistance."],
      ["04", "Physical & Digital Accessibility", "Learn basic principles for accessible buildings, transport, documents, websites, forms and communication."],
      ["05", "Education & Employment", "Understand inclusive learning, skills development, workplace participation and reasonable support."],
      ["06", "Assistive Support & Rehabilitation", "Learn the roles of rehabilitation professionals, assistive devices and referral pathways; avoid unqualified treatment advice."],
      ["07", "Family & Community Support", "Explore practical support that preserves choice, privacy, independence and dignity."],
      ["08", "Inclusion Action Checklist", "Assess a community activity for accessibility, communication, participation, safety and follow-up."],
    ],
  }
  {
    slug: "elderly-support",
    category: "SSF Knowledge & Awareness",
    icon: FaUsers,
    title: "Elderly Care & Dignity",
    hi: "वृद्धजन सहायता एवं सम्मान",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn about ageing, dignity, social connection, safety, health-support coordination and responsible community care for older persons.",
    lessons: [
      ["01", "Ageing with Dignity", "Understand ageing as a normal life stage and focus on autonomy, respect, participation and individual preferences."],
      ["02", "Daily Support & Independence", "Learn how to support everyday needs while avoiding unnecessary dependence and respecting personal choices."],
      ["03", "Health & Medication Awareness", "Understand the importance of professional healthcare, medication instructions and keeping reliable records without self-prescribing."],
      ["04", "Nutrition, Mobility & Safety", "Learn general awareness about food, hydration, movement, fall risks and safe living environments."],
      ["05", "Social Connection & Mental Wellbeing", "Recognise the value of relationships, meaningful activity, communication and timely professional support when needed."],
      ["06", "Financial & Digital Safety", "Help older persons recognise fraud, protect documents and use digital services safely without taking control of their accounts."],
      ["07", "Family & Community Support", "Plan respectful visits, practical assistance, referrals and emergency contacts while protecting privacy."],
      ["08", "Elder Support Checklist", "Create a simple, person-centred checklist covering safety, social connection, health coordination and follow-up."],
    ],
  }
  {
    slug: "animal-welfare",
    category: "SSF Knowledge & Awareness",
    icon: FaShieldAlt,
    title: "Animal Welfare & Responsible Care",
    hi: "पशु कल्याण एवं जिम्मेदार देखभाल",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn humane animal care, basic welfare needs, responsible ownership, community animal support and wildlife protection awareness.",
    lessons: [
      ["01", "Animal Welfare Basics", "Understand humane treatment, freedom from unnecessary suffering and the basic needs of animals."],
      ["02", "Responsible Care", "Learn about food, clean water, shelter, hygiene, safe handling and appropriate veterinary support."],
      ["03", "Companion & Community Animals", "Understand responsible ownership, vaccination and sterilisation awareness, identification and safe community interaction."],
      ["04", "Livestock & Working Animals", "Learn basic welfare considerations for housing, nutrition, workload, rest and professional veterinary care."],
      ["05", "Injured or Distressed Animals", "Use safe observation and referral practices; avoid unsafe handling or unqualified treatment."],
      ["06", "Wildlife Awareness", "Understand the difference between domestic, community and wild animals and why wildlife should not be treated as pets."],
      ["07", "Community Animal Programme Planning", "Learn how awareness, rescue referral, records, volunteers and local veterinary links can be organised responsibly."],
      ["08", "Responsible Care Checklist", "Review daily welfare needs, safety, records, referral contacts and humane conduct."],
    ],
  }
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
    ready: true,
    description: "Learn disaster-risk awareness, household preparedness, early warnings, emergency communication, evacuation planning and responsible community response.",
    lessons: [
      ["01", "Know the Risk", "Identify hazards relevant to your area such as floods, heat, lightning, fire, earthquakes, storms and other emergencies."],
      ["02", "Household Preparedness", "Prepare emergency contacts, essential documents, medicines, water, basic supplies and a family communication plan."],
      ["03", "Early Warning & Official Information", "Use authorised alerts and local authorities; avoid forwarding unverified emergency information."],
      ["04", "Evacuation & Safe Movement", "Know exits, assembly points, safe routes and the principle of following official instructions."],
      ["05", "First Aid & Emergency Limits", "Understand basic preparedness while recognising that advanced rescue, medical care and technical response require trained personnel."],
      ["06", "Community Volunteers", "Learn safe volunteer roles, coordination, attendance, communication and the importance of not creating additional risk."],
      ["07", "Recovery & Documentation", "Understand needs assessment, safe assistance, records, referrals and safeguarding after an incident."],
      ["08", "Personal Disaster Plan", "Create and practise a household/community checklist for contacts, warnings, evacuation, essential supplies and review."],
    ],
    resources: [
      ["NDMA SACHET", "https://sachet.ndma.gov.in/"],
      ["NDMA Dos & Don'ts", "https://sachet.ndma.gov.in/DosDont"],
    ],
  }
  {
    slug: "culture-heritage",
    category: "SSF Knowledge & Awareness",
    icon: FaBookOpen,
    title: "Culture, Language, Arts & Heritage",
    hi: "संस्कृति, भाषा, कला एवं विरासत",
    level: "Awareness",
    language: "Hindi + English",
    duration: "Self-paced",
    ready: true,
    description: "Learn how communities can understand, document and responsibly preserve language, music, literature, arts, traditions, local knowledge and heritage.",
    lessons: [
      ["01", "What Is Culture?", "Understand culture as living knowledge expressed through language, food, music, art, customs, stories and community practices."],
      ["02", "Language & Oral Traditions", "Learn why local languages, dialects, songs, stories and oral histories matter and how they can be documented respectfully."],
      ["03", "Music, Art & Craft", "Explore traditional and contemporary arts and the importance of recognising creators and cultural context."],
      ["04", "Tangible & Intangible Heritage", "Understand places, objects, rituals, skills, knowledge and practices and the difference between preservation and display."],
      ["05", "Documentation & Digital Archives", "Learn basic methods for recording interviews, photographs, audio and documents with consent, attribution and good metadata."],
      ["06", "Sanskrit & Classical Learning", "Understand how language and classical texts can be studied through reliable teachers, editions and contextual learning."],
      ["07", "Cultural Events & Ethics", "Plan cultural programmes with safety, consent, respectful representation, accessibility and proper acknowledgement."],
      ["08", "Community Heritage Plan", "Create a simple plan to identify, document, learn and share local heritage without misrepresentation or unauthorised use."],
    ],
  }
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
  ["SSF Knowledge & Awareness", "SSF Knowledge & Awareness"],
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
        {!course.lessons?.length ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <FaGraduationCap className="mx-auto text-5xl text-[#003366]" />
            <h2 className="mt-5 text-3xl font-black">Learning content is being prepared</h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600">This path will appear here only after its learning content is added and reviewed.</p>
            <button onClick={onBack} className="mt-7 rounded-xl bg-[#003366] px-6 py-3 font-bold text-white">Browse Learning Paths</button>
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
