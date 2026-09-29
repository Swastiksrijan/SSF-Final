import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight, FaBookOpen, FaBriefcase, FaCheckCircle, FaChevronLeft,
  FaClock, FaComments, FaDesktop, FaEnvelope, FaExternalLinkAlt,
  FaGraduationCap, FaLaptopCode, FaPlayCircle, FaSearch, FaShareAlt,
  FaShieldAlt, FaStar, FaUserTie
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#003366]/10 text-xl text-[#003366]">
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
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">
              <FaGraduationCap /> Swastik Srijan Foundation
            </div>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">Learning Hub</h1>
            <h2 className="mt-3 text-2xl font-bold text-white/80 md:text-3xl">ज्ञान एवं सीख • Learn. Practise. Grow.</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">
              Free, practical and accessible learning resources for students, young people, volunteers, members and anyone who wants to learn useful skills.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["15", "Learning Paths", "Learning Paths"],
              ["4", "Ready Now", "Ready Now"],
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
              <p className="mt-2 text-zinc-600">अभी 4 paths में structured lessons हैं; बाकी paths के लिए framework तैयार है।</p>
            </div>
            <div className="text-sm font-bold text-zinc-500">{filtered.length} paths</div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course) => <CourseCard key={course.slug} course={course} onOpen={openCourse} />)}
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
