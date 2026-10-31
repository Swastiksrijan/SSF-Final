import { useEffect, useMemo, useState } from "react";
import { FaGraduationCap, FaCheckCircle, FaTimesCircle, FaWhatsapp, FaArrowLeft, FaArrowRight, FaBookOpen, FaShieldAlt, FaTrophy, FaRedo, FaHome, FaChevronRight } from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import AuthModal from "../components/AuthModal";
import { API_BASE_URL, ENDPOINTS } from "../config/api";
import { generateCertificate } from "../utils/generateCertificate";

const SESSION_KEY = "ssf_user_session";
const QUIZ_ID = "ssf-awareness-1";
const readSession = () => {
  try { const raw = sessionStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
};
const sessionUser = (e) => e?.detail || null;
const SUBJECTS = {
  samvidhan: ["Constitution & Citizenship", "संविधान एवं नागरिकता"],
  yojana: ["Government Schemes", "सरकारी योजनाएँ"],
  swasthya: ["Health & Hygiene", "स्वास्थ्य एवं स्वच्छता"],
  gk: ["General Knowledge", "सामान्य ज्ञान"],
  "english-word": ["English & Vocabulary", "अंग्रेज़ी एवं शब्दावली"],
  prerna: ["Values & Social Awareness", "मूल्य एवं सामाजिक जागरूकता"],
};

export default function AwarenessQuiz() {
  const [quiz, setQuiz] = useState(null);
  const [quizCatalog, setQuizCatalog] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(QUIZ_ID);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(readSession);
  const [authOpen, setAuthOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/quiz`)
      .then((r) => { if (!r.ok) throw new Error("Quiz service is temporarily unavailable."); return r.json(); })
      .then((d) => {
        if (!d.quiz?.questions?.length) throw new Error("No questions are available right now.");
        setQuiz(d.quiz); setQuizCatalog(d.quizzes || []);
      })
      .catch((e) => setError(e.message || "Quiz load nahi ho payi. Please try again."));
    const fn = (e) => setUser(sessionUser(e));
    window.addEventListener("ssf-auth-changed", fn);
    return () => window.removeEventListener("ssf-auth-changed", fn);
  }, []);

  useEffect(() => {
    if (!user?.token) { setAttemptHistory([]); return; }
    let active = true;
    setHistoryLoading(true);
    fetch(`${API_BASE_URL}/api/quiz/my-attempts`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.message || "Quiz history unavailable.");
        if (active) setAttemptHistory(data.attempts || []);
      })
      .catch(() => { if (active) setAttemptHistory([]); })
      .finally(() => { if (active) setHistoryLoading(false); });
    return () => { active = false; };
  }, [user, result]);

  const chooseQuiz = async (quizId) => {
    if (!quizId) return;
    setError(""); setSubmitting(false);
    try {
      const response = await fetch(ENDPOINTS.AWARENESS_QUIZ(quizId));
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.quiz?.questions?.length) throw new Error(data.message || "This quiz is not available right now.");
      setSelectedQuizId(quizId); setQuiz(data.quiz); setAnswers({}); setResult(null); setCurrent(0); setShowSubmitConfirm(false); setShowInstructions(true); setShowDashboard(false);
    } catch (e) { setError(e.message || "Quiz load nahi ho payi."); }
  };

  const questions = quiz?.questions || [];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const activeQuestion = questions[current];
  const waHref = useMemo(() => {
    const t = "Namaste SSF. I passed the SSF Awareness Quiz. Certificate: " + (result?.certificate?.certificateId || "") + ". Learner: " + (user?.fullName || "");
    return "https://wa.me/919718346691?text=" + encodeURIComponent(t);
  }, [result, user]);

  const submit = async () => {
    if (!user) { setAuthOpen(true); return; }
    setSubmitting(true); setError(""); setShowSubmitConfirm(false);
    try {
      // Only selected option indexes are sent. The answer key remains on the server.
      const payload = { accountId: user.id, learner: { fullName: user.fullName, email: user.email }, answers };
      const res = await fetch(ENDPOINTS.AWARENESS_QUIZ_SUBMIT(selectedQuizId), {
        method: "POST", headers: { "Content-Type": "application/json", ...(user.token ? { Authorization: `Bearer ${user.token}` } : {}) }, body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Submit fail ho gaya.");
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) { setError(e.message || "Submit fail ho gaya."); }
    finally { setSubmitting(false); }
  };

  const download = async () => {
    const cert = result?.certificate;
    if (!cert) return;
    await generateCertificate(cert.learnerName, cert.courseTitle || "SSF Quiz", new Date(cert.issuedAt || Date.now()), cert.certificateId, null, cert.courseTitle || "SSF Quiz");
  };

  const retry = () => { setResult(null); setAnswers({}); setCurrent(0); setShowSubmitConfirm(false); };

  return (
    <main className="min-h-screen bg-[#F3F6FA] pb-12 text-slate-800">
      <div className="bg-[#082B4C] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/AwarenessQuiz" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">🎓</span>
            <span className="flex flex-col leading-tight"><span className="text-sm font-black tracking-wide">SSF LEARNING CENTRE</span><span className="text-[10px] text-white/65">Learn · Participate · Grow</span></span>
          </Link>
          <nav aria-label="Learning Centre navigation" className="flex flex-wrap items-center gap-1 text-xs font-bold sm:gap-2">
            <Link to="/AwarenessQuiz" className="rounded-lg bg-white/15 px-3 py-2 text-white">Quiz Centre</Link>
            <Link to="/LearningHub" className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white">Explore Courses</Link>
            <Link to="/LearningHub/my-learning" className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white">My Learning</Link>
            <Link to="/LearningCertificateVerify" className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white">Certificates</Link>
            <Link to="/" className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white">Main Website</Link>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-br from-[#0B355B] via-[#123F68] to-[#176447] px-4 py-8 text-white md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-white/70">
            <Link to="/" className="hover:text-white">Home</Link><FaChevronRight className="text-[9px]" /><span>Learning Centre</span><FaChevronRight className="text-[9px]" /><span className="text-white">Learning & Awareness</span>
          </div>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-wider text-emerald-100"><FaGraduationCap /> SSF KNOWLEDGE & LEARNING CENTRE</div>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">Learning & Awareness Centre <span className="block text-2xl font-semibold text-emerald-100 md:text-3xl">शिक्षा एवं जागरूकता केंद्र</span></h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50/85 md:text-base">Explore learning resources, take available assessments and build knowledge for an aware and empowered society.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="min-w-[82px] rounded-xl border border-white/15 bg-white/10 px-3 py-3"><div className="text-xl font-black">{quiz?.size || questions.length || "—"}</div><div className="text-[10px] text-white/70">QUESTIONS</div></div>
              <div className="min-w-[82px] rounded-xl border border-white/15 bg-white/10 px-3 py-3"><div className="text-xl font-black">{quiz?.passPercent ?? 80}%</div><div className="text-[10px] text-white/70">PASS MARK</div></div>
              <div className="min-w-[82px] rounded-xl border border-white/15 bg-white/10 px-3 py-3"><div className="text-xl font-black">Free</div><div className="text-[10px] text-white/70">TO ATTEMPT</div></div>
            </div>
          </div>
        </div>
      </section>

      {showDashboard ? (
        <section className="mx-auto max-w-7xl px-4 py-8 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#176447]">SSF Knowledge & Learning Centre</div>
              <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-[#12345A] md:text-4xl">Learn with purpose. <span className="text-[#176447]">Test what you know.</span></h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">शिक्षा, कौशल और सामाजिक जागरूकता को आगे बढ़ाने के लिए निःशुल्क Quiz और Learning Resources। अपनी पसंद का विषय चुनें और सीखना शुरू करें।</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => setShowDashboard(false)} disabled={!quiz} className="rounded-xl bg-[#176447] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#12543B] disabled:cursor-not-allowed disabled:opacity-50">{quiz ? "Start Awareness Quiz" : "Loading available quiz…"} <FaArrowRight className="ml-2 inline" /></button>
                <Link to="/LearningHub" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#12345A] hover:bg-slate-50">Explore Learning Hub</Link>
              </div>
            </div>
            <div className="rounded-3xl bg-[#0E3558] p-6 text-white shadow-sm md:p-7">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">Your learning space</div>
              <h3 className="mt-3 text-2xl font-black">One place to learn and grow</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">{quiz ? "01" : "—"}</div><div className="mt-1 text-xs text-white/70">Published Quiz</div></div>
                <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">Free</div><div className="mt-1 text-xs text-white/70">Learning Access</div></div>
              </div>
              <p className="mt-4 text-xs leading-6 text-white/65">Quiz results are evaluated by the SSF quiz service. Login is required when requesting a certificate.</p>
            </div>
          </div>

          {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
          <div className="mt-9">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><div className="text-xs font-black uppercase tracking-[0.18em] text-[#176447]">Take an assessment</div><h2 className="mt-2 text-2xl font-black text-[#12345A] md:text-3xl">Available Quiz / उपलब्ध प्रश्नोत्तरी</h2><p className="mt-1 text-sm text-slate-500">नीचे सात प्रकाशित Quiz उपलब्ध हैं—एक सामान्य जागरूकता और छह विषयवार प्रश्नोत्तरी।</p></div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">{quizCatalog.length ? `${quizCatalog.length} Published Quizzes` : "Checking availability"}</span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {quizCatalog.length ? quizCatalog.map((item) => {
                const subject = SUBJECTS[item.subject] || ["General Awareness", "सामान्य जागरूकता"];
                const isGeneral = item.subject === "all";
                return <article key={item.quizId} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3"><span className="rounded-xl bg-blue-50 p-3 text-2xl text-[#123F68]">{isGeneral ? "🌐" : item.subject === "samvidhan" ? "⚖️" : item.subject === "yojana" ? "🏛️" : item.subject === "swasthya" ? "🩺" : item.subject === "gk" ? "📚" : item.subject === "english-word" ? "🔤" : "🌱"}</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-800">Available now</span></div>
                  <h3 className="mt-4 text-lg font-black text-[#12345A]">{item.title.en}</h3><p className="mt-1 text-sm font-semibold text-slate-500">{item.title.hi}</p>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{item.description?.en || subject[0]}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-500"><span className="rounded-lg bg-slate-50 px-3 py-2">{item.questionCount || (isGeneral ? 10 : 6)} Questions</span><span className="rounded-lg bg-slate-50 px-3 py-2">80% Pass Mark</span><span className="rounded-lg bg-slate-50 px-3 py-2">Free</span></div>
                  <button type="button" onClick={() => chooseQuiz(item.quizId)} className="mt-5 w-full rounded-xl bg-[#176447] px-4 py-3 text-sm font-black text-white hover:bg-[#12543B]">Start this Quiz <FaArrowRight className="ml-2 inline" /></button>
                </article>;
              }) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Quiz catalogue is loading…</div>}
            </div>
          </div>

          <div className="mt-10">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[#176447]">Explore by subject</div>
            <h2 className="mt-2 text-2xl font-black text-[#12345A] md:text-3xl">Learning Categories / सीखने के विषय</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">इनमें से छह विषयों की Quiz ऊपर उपलब्ध हैं। अन्य विषयों के Courses और Learning Resources SSF Learning Hub में देखें।</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[
                ["📚","Education & General Knowledge","शिक्षा एवं सामान्य ज्ञान"],
                ["💻","Digital Literacy & Cyber Safety","डिजिटल साक्षरता एवं साइबर सुरक्षा"],
                ["🌱","Environment & Climate","पर्यावरण एवं जलवायु"],
                ["⚖️","Constitution & Civic Awareness","संविधान एवं नागरिक जागरूकता"],
                ["💼","Career & Workplace Skills","करियर एवं कार्यस्थल कौशल"],
                ["🩺","Health, Hygiene & Wellness","स्वास्थ्य, स्वच्छता एवं कल्याण"],
                ["💰","Financial Literacy","वित्तीय साक्षरता"],
                ["👩‍👧","Women & Child Development","महिला एवं बाल विकास"],
                ["🚦","Road & Public Safety","सड़क एवं सार्वजनिक सुरक्षा"],
                ["🌾","Agriculture & Rural Development","कृषि एवं ग्रामीण विकास"],
                ["🤖","Science, Technology & AI","विज्ञान, तकनीक एवं AI"],
                ["🎨","Culture, Sports & Human Values","संस्कृति, खेल एवं मानवीय मूल्य"]
              ].map(([icon,title,hi]) => <Link key={title} to="/LearningHub" className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#176447]/40 hover:shadow-md"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl">{icon}</span><span className="min-w-0 flex-1"><span className="block text-sm font-black text-[#12345A] group-hover:text-[#176447]">{title}</span><span className="mt-1 block text-xs text-slate-500">{hi}</span></span><FaChevronRight className="shrink-0 text-xs text-slate-300 group-hover:text-[#176447]" /></Link>)}
            </div>
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900"><b>Learning Hub:</b> विस्तृत courses, lessons, activities और course assessments के लिए <Link to="/LearningHub" className="font-black underline">SSF Learning Hub खोलें</Link>।</div>
          </div>
          {user?.token && (
            <section className="mt-9 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><div className="text-xs font-black uppercase tracking-wider text-[#176447]">Your learning record</div><h2 className="mt-1 text-xl font-black text-[#12345A]">Quiz History / आपकी परीक्षा का रिकॉर्ड</h2><p className="mt-1 text-sm text-slate-500">आपके खाते में सुरक्षित किए गए पिछले प्रयास।</p></div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{attemptHistory.length} saved attempts</span>
              </div>
              {historyLoading ? <p className="mt-4 text-sm text-slate-500">Loading your history…</p> : attemptHistory.length ? (
                <div className="mt-4 divide-y divide-slate-100">
                  {attemptHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div className="min-w-0"><div className="font-bold text-[#12345A]">{item.quizTitle}</div><div className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()} · {item.correct}/{item.total} correct</div></div>
                      <div className="flex items-center gap-2"><span className="text-sm font-black text-[#12345A]">{item.percent}%</span><span className={"rounded-full px-3 py-1 text-xs font-bold " + (item.passed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{item.passed ? "Passed" : "Try again"}</span>{item.certificateId && <span className="text-xs font-bold text-emerald-700">Certificate</span>}</div>
                    </div>
                  ))}
                </div>
              ) : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">अभी कोई Quiz attempt सेव नहीं है। अपना पहला Quiz शुरू करें।</p>}
            </section>
          )}
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            <Link to="/LearningHub/my-learning" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-[#12345A] hover:border-[#176447]/40">📈 My Learning <span className="mt-1 block text-xs font-normal text-slate-500">अपनी learning progress देखें</span></Link>
            <Link to="/LearningCertificateVerify" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-[#12345A] hover:border-[#176447]/40">🏅 Certificate Verification <span className="mt-1 block text-xs font-normal text-slate-500">जारी प्रमाणपत्र की जाँच करें</span></Link>
            <a href="https://wa.me/919718346691" target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-[#12345A] hover:border-[#176447]/40">💬 Need Help? <span className="mt-1 block text-xs font-normal text-slate-500">SSF से संपर्क करें</span></a>
          </div>
        </section>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-7 lg:grid-cols-[minmax(0,1fr)_290px] lg:py-9">
        <div className="min-w-0">
          {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
          {!quiz && !error && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading your quiz…</div>}

          {quiz && !result && showInstructions && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
              <div className="flex items-center gap-3"><span className="rounded-xl bg-blue-50 p-3 text-xl text-[#123F68]"><FaBookOpen /></span><div><h2 className="text-xl font-black text-[#12345A]">{quiz.title?.en || "Before you begin"}</h2><p className="text-sm text-slate-500">परीक्षा शुरू करने से पहले निर्देश पढ़ें</p></div></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  [`${questions.length} questions`, "सभी प्रश्नों के उत्तर देने का प्रयास करें।"],
                  [`${quiz.passPercent ?? 80}% to pass`, "प्रमाणपत्र हेतु निर्धारित न्यूनतम अंक आवश्यक हैं।"],
                  ["One question at a time", "आप आगे-पीछे जाकर उत्तर बदल सकते हैं।"],
                  ["Login required for certificate", "प्रमाणपत्र जारी करने के लिए Learning Account में लॉगिन जरूरी है।"],
                ].map(([a,b]) => <div key={a} className="rounded-xl bg-slate-50 p-4"><div className="font-bold text-[#12345A]">{a}</div><div className="mt-1 text-sm text-slate-500">{b}</div></div>)}
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900"><FaShieldAlt className="mt-0.5 shrink-0" /><p>Your answers are checked securely on the server. The quiz is free. A certificate is issued only after meeting the passing score and verifying your learning account.</p></div>
              <button onClick={() => setShowInstructions(false)} className="mt-6 w-full rounded-xl bg-[#176447] px-5 py-4 font-black text-white shadow-sm transition hover:bg-[#12543B]">Start Quiz <FaArrowRight className="ml-2 inline" /></button>
            </section>
          )}

          {quiz && !result && !showInstructions && (
            <section className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-bold text-[#12345A]">Your progress / आपकी प्रगति</span><span className="font-bold text-slate-500">{answeredCount} of {questions.length} answered</span></div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#176447] transition-all" style={{ width: progress + "%" }} /></div>
                <div className="mt-2 flex justify-between text-xs text-slate-400"><span>{progress}% completed</span><span>Pass mark: {quiz.passPercent}%</span></div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#123F68]">{SUBJECTS[activeQuestion?.subject]?.[0] || activeQuestion?.subject || "Awareness"}</span>
                  <span className="text-sm font-bold text-slate-400">Question {current + 1} / {questions.length}</span>
                </div>
                <h2 className="mt-5 text-xl font-black leading-snug text-[#12345A] md:text-2xl">{activeQuestion?.q.en}</h2>
                <p className="mt-2 text-base leading-relaxed text-slate-500">{activeQuestion?.q.hi}</p>
                <div className="mt-6 grid gap-3">
                  {activeQuestion?.options.map((option, idx) => {
                    const selected = Number(answers[activeQuestion.id]) === idx;
                    return <button key={idx} type="button" aria-pressed={selected} onClick={() => setAnswers((old) => ({ ...old, [activeQuestion.id]: idx }))}
                      className={"flex w-full items-start gap-3 rounded-xl border p-4 text-left transition " + (selected ? "border-[#176447] bg-emerald-50 ring-1 ring-[#176447]" : "border-slate-200 bg-white hover:border-[#123F68]/50 hover:bg-slate-50")}>
                      <span className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black " + (selected ? "bg-[#176447] text-white" : "bg-slate-100 text-slate-600")}>{String.fromCharCode(65 + idx)}</span>
                      <span className="pt-1"><span className={"block font-bold " + (selected ? "text-[#12543B]" : "text-slate-800")}>{option.en}</span><span className="mt-1 block text-sm text-slate-500">{option.hi}</span></span>
                      {selected && <FaCheckCircle className="ml-auto mt-2 shrink-0 text-[#176447]" />}
                    </button>;
                  })}
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <button type="button" disabled={current === 0} onClick={() => setCurrent((v) => Math.max(0, v - 1))} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"><FaArrowLeft /> Previous</button>
                  {answers[activeQuestion?.id] !== undefined && <button type="button" onClick={() => setAnswers((old) => { const next = { ...old }; delete next[activeQuestion.id]; return next; })} className="text-xs font-bold text-slate-400 underline hover:text-red-600">Clear answer</button>}
                  {current < questions.length - 1
                    ? <button type="button" onClick={() => setCurrent((v) => Math.min(questions.length - 1, v + 1))} className="inline-flex items-center gap-2 rounded-lg bg-[#12345A] px-5 py-3 text-sm font-bold text-white hover:bg-[#0B2948]">Next <FaArrowRight /></button>
                    : <button type="button" onClick={() => setShowSubmitConfirm(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#176447] px-5 py-3 text-sm font-black text-white hover:bg-[#12543B]">Review & Submit <FaCheckCircle /></button>}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between"><h3 className="font-black text-[#12345A]">Question navigator</h3><span className="text-xs text-slate-400">Tap to jump</span></div>
                <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {questions.map((q, i) => <button key={q.id} type="button" onClick={() => setCurrent(i)} aria-label={"Go to question " + (i + 1)} className={"h-10 rounded-lg text-sm font-black " + (i === current ? "bg-[#12345A] text-white ring-2 ring-blue-200" : answers[q.id] !== undefined ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>{i + 1}</button>)}
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-semibold text-slate-400"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[#12345A]" />Current</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-emerald-100" />Answered</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-slate-100" />Not answered</span></div>
              </div>

              {showSubmitConfirm && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="font-black text-amber-950">Ready to submit?</h3>
                <p className="mt-1 text-sm text-amber-900">{answeredCount} of {questions.length} questions answered. {questions.length - answeredCount > 0 ? (questions.length - answeredCount) + " questions are still unanswered. You can go back and complete them." : "You have answered every question."}</p>
                <div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={submitting} onClick={submit} className="rounded-lg bg-[#176447] px-5 py-3 text-sm font-black text-white disabled:opacity-50">{submitting ? "Submitting…" : user ? "Confirm & Submit" : "Login to Submit"}</button><button type="button" onClick={() => setShowSubmitConfirm(false)} className="rounded-lg border border-amber-300 bg-white px-5 py-3 text-sm font-bold text-amber-950">Continue Quiz</button></div>
              </div>}
            </section>
          )}

          {result && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="text-center">
                <div className={"mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl " + (result.passed ? "bg-emerald-100 text-[#176447]" : "bg-red-50 text-red-600")}>{result.passed ? <FaTrophy /> : <FaTimesCircle />}</div>
                <h2 className="mt-4 text-2xl font-black text-[#12345A]">{result.passed ? "Congratulations! आप सफल हुए" : "Keep learning! फिर प्रयास करें"}</h2>
                <p className="mt-1 text-sm text-slate-500">{result.passed ? "You have achieved the required passing score." : "Review the explanations below and try again."}</p>
                <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3"><div className="text-2xl font-black text-[#12345A]">{result.correct}/{result.total}</div><div className="text-xs text-slate-500">Correct</div></div>
                  <div className="rounded-xl bg-slate-50 p-3"><div className="text-2xl font-black text-[#12345A]">{result.percent}%</div><div className="text-xs text-slate-500">Your score</div></div>
                  <div className="rounded-xl bg-slate-50 p-3"><div className="text-2xl font-black text-[#12345A]">{result.passPercent}%</div><div className="text-xs text-slate-500">Pass mark</div></div>
                </div>
              </div>

              {result.passed && result.certificate && <div className="mt-7 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 md:p-6">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#12345A]"><FaCheckCircle className="text-[#176447]" /> Certificate issued / प्रमाणपत्र जारी</div>
                <div className="mt-2 break-all text-xl font-black text-[#12345A]">{result.certificate.certificateId}</div>
                <p className="mt-1 text-sm text-slate-600">Issued to <b>{result.certificate.learnerName}</b> · {result.certificate.courseTitle}</p>
                <p className="mt-3 text-xs leading-5 text-slate-500">This is an SSF learning achievement certificate for this quiz. It is not a government qualification or an accredited academic credential.</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <button type="button" onClick={download} className="rounded-xl bg-[#12345A] px-4 py-3 text-sm font-black text-white">Download PDF</button>
                  <a href={waHref} target="_blank" rel="noreferrer" className="rounded-xl bg-[#25D366] px-4 py-3 text-center text-sm font-black text-white"><FaWhatsapp className="mr-1 inline" /> Share</a>
                  <a href={ENDPOINTS.AWARENESS_QUIZ_CERTIFICATE(result.certificate.certificateId)} target="_blank" rel="noreferrer" className="rounded-xl border border-[#12345A]/20 bg-white px-4 py-3 text-center text-sm font-black text-[#12345A]">Verify Certificate</a>
                </div>
              </div>}
              {result.passed && !result.certificate && <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">{result.message || "Certificate पाने के लिए अपने learning account से login करें।"}</p>}

              {!result.passed && <div className="mt-7">
                <h3 className="font-black text-[#12345A]">Answer review / उत्तरों की समीक्षा</h3>
                <div className="mt-3 space-y-3">{(result.wrong || []).map((w) => {
                  const question = questions.find((q) => q.id === w.id);
                  return <div key={w.id} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-black uppercase text-slate-400">{SUBJECTS[question?.subject]?.[0] || "Review"} · {w.id}</p>
                    <p className="mt-1 font-bold text-[#12345A]">{question?.q.en}</p>
                    <p className="text-sm text-slate-500">{question?.q.hi}</p>
                    <p className="mt-3 text-sm font-bold text-emerald-800">Correct answer: {question?.options?.[w.correctIndex]?.en}</p>
                    <p className="text-sm text-emerald-700">{question?.options?.[w.correctIndex]?.hi}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{w.explain?.en}<br />{w.explain?.hi}</p>
                  </div>;
                })}</div>
              </div>}
              <button type="button" onClick={retry} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-black text-[#12345A] hover:bg-slate-50"><FaRedo /> Try Again</button>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-black text-[#12345A]">Quiz topics</h3>
            <p className="mt-1 text-xs text-slate-500">ज्ञान के छह महत्वपूर्ण क्षेत्र</p>
            <div className="mt-4 space-y-3">{Object.entries(SUBJECTS).map(([key, names]) => <div key={key} className="flex items-start gap-3"><span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#176447]" /><div><div className="text-sm font-bold text-slate-700">{names[0]}</div><div className="text-xs text-slate-400">{names[1]}</div></div></div>)}</div>
          </div>
          <div className="rounded-2xl bg-[#0E3558] p-5 text-white shadow-sm">
            <FaShieldAlt className="text-2xl text-emerald-200" />
            <h3 className="mt-3 font-black">Fair & secure assessment</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100/80">Correct answers are stored and checked securely by the SSF quiz server. Your result is calculated after submission.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-black text-[#12345A]">Need help?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">For assistance with your learning account or certificate, contact the SSF team.</p>
            <a href="https://wa.me/919718346691" target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">Contact SSF on WhatsApp</a>
          </div>
        </aside>
      </div>
      )}

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-slate-400">
        <span>© {new Date().getFullYear()} Swastik Srijan Foundation Samiti</span>
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-[#12345A]"><FaHome /> Back to website</Link>
      </footer>
      <AuthModal open={authOpen} initialMode="signup" stayOnSuccess onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => { setUser(u); setAuthOpen(false); }} />
    </main>
  );
}
