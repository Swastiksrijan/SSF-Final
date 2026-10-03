import { useMemo, useState } from "react";
import {
  FaArrowRight, FaBookOpen, FaCompass, FaGraduationCap, FaPlayCircle,
  FaSearch, FaLayerGroup, FaGlobe, FaCheckCircle, FaCertificate, FaBullseye,
  FaTools, FaRoute, FaHistory, FaStar
} from "react-icons/fa";
import { HubHeroArt } from "./LearningIllustrations";
import SubjectCard from "./SubjectCard";
import { buildLearningWorld, LEARNING_INTENTS, LEARNING_PATHS } from "../../data/learningWorld";

const SectionTitle = ({ icon, eyebrow, title, subtitle, action }) => (
  <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF6600]">
        <span aria-hidden="true">{icon}</span> {eyebrow}
      </div>
      <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#142b45] md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5b6b7c]">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const MODES = [
  { icon: <FaBookOpen aria-hidden="true" />, title: "Courses", hi: "पाठ्यक्रम", text: "Structured learning, module by module.", cta: "Explore courses", route: "explore" },
  { icon: <FaGlobe aria-hidden="true" />, title: "Knowledge World", hi: "ज्ञान संसार", text: "Topic-wise knowledge and facts.", cta: "Enter Knowledge World", route: "knowledge" },
  { icon: <FaTools aria-hidden="true" />, title: "Practice", hi: "अभ्यास", text: "Activities and practice inside every course.", cta: "Find a course", route: "explore" },
  { icon: <FaCheckCircle aria-hidden="true" />, title: "Assessment", hi: "आकलन", text: "Module checks and final quiz.", cta: "See your progress", route: "myLearning" },
  { icon: <FaCertificate aria-hidden="true" />, title: "Certificates", hi: "प्रमाणपत्र", text: "Recognise genuinely completed learning.", cta: "Verify a certificate", route: "verify" },
];

function HeroSearch({ matchSubjects, onOpenSubject, onSubmit }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => (q.trim().length >= 2 ? matchSubjects(q, 6) : []), [q, matchSubjects]);
  const showResults = focused && q.trim().length >= 2;

  const submit = (e) => {
    e.preventDefault();
    if (results[0] && q.trim()) { onOpenSubject(results[0]); return; }
    onSubmit(q);
  };

  return <form onSubmit={submit} className="relative mt-8 w-full max-w-2xl" role="search">
    <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/[0.07] p-2 pl-4 backdrop-blur transition focus-within:border-[#FFD166]/60 focus-within:bg-white/[0.12]">
      <FaSearch className="shrink-0 text-[#FFD166]" aria-hidden="true" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        type="search"
        aria-label="Search the Learning Hub"
        placeholder="Search a subject, skill, topic or anything you want to learn..."
        className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-white/45 focus:outline-none"
      />
      <button type="submit" className="shrink-0 rounded-xl bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] px-4 py-2.5 text-sm font-bold text-[#142b45] transition hover:brightness-110">Search</button>
    </div>
    {showResults && <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[#EADFCC] bg-white text-left shadow-2xl">
      {results.length ? results.map((s) => (
        <button key={s.id} type="button" onMouseDown={(e) => { e.preventDefault(); onOpenSubject(s); }} className="flex w-full items-center gap-3 border-b border-[#f1ece1] px-4 py-3 text-left transition last:border-0 hover:bg-[#FFF7EA]">
          <span className="min-w-0 flex-1">
            <span className="block truncate font-serif text-sm font-bold text-[#142b45]">{s.en}</span>
            <span className="block truncate text-[11px] font-semibold text-[#8a97a5]">{s.hi} • {s.category.split(" / ")[0]}</span>
          </span>
          <FaArrowRight className="shrink-0 text-[#FF6600]" aria-hidden="true" />
        </button>
      )) : <div className="px-4 py-4 text-sm text-[#8a97a5]">कोई परिणाम नहीं मिला। Explore में पूरी लाइब्रेरी देखें।</div>}
    </div>}
  </form>;
}

export default function LearningHubHome({
  subjects = [], categoryCards = [], knowledgeWorldSubjects = [], progressSummary,
  recentSubjects = [], cardProgress, cardInfo, matchSubjects,
  onOpenSubject, onShareSubject, onSearch, onCategory, onExplore, onKnowledge,
  onMyLearning, onIntent, onPath, onVerify,
}) {
  const groups = useMemo(() => buildLearningWorld(categoryCards), [categoryCards]);
  const active = progressSummary?.active || null;
  const inProgress = progressSummary?.inProgress || [];
  const completedCount = progressSummary?.completedCount || 0;
  const isReturning = Boolean(active || inProgress.length || completedCount || recentSubjects.length);

  // Discovery: only real courses, badged by their genuine kind (never invented
  // popularity or ratings). Pick a spread across the curriculum automatically.
  const discovery = useMemo(() => {
    const info = (s) => (cardInfo ? cardInfo(s) : {});
    const featured = subjects.filter((s) => info(s).kind === "Full Course");
    const fresh = subjects.filter((s) => info(s).kind === "Course Shell");
    const kw = knowledgeWorldSubjects.slice(0, 2);
    const out = [];
    const push = (arr) => arr.forEach((s) => { if (out.length < 8 && !out.includes(s)) out.push(s); });
    push(featured.slice(0, 4));
    push(kw);
    push(fresh.slice(0, 3));
    push(featured.slice(4, 8));
    return out;
  }, [subjects, knowledgeWorldSubjects, cardInfo]);

  // Honest starter suggestions for a brand-new learner: real courses from the
  // beginning of the curriculum, preferring full structured courses.
  const starters = useMemo(() => {
    const info = (s) => (cardInfo ? cardInfo(s) : {});
    const structured = subjects.filter((s) => info(s).kind === "Full Course");
    return (structured.length ? structured : subjects).slice(0, 4);
  }, [subjects, cardInfo]);

  const nextStepItems = active ? [active] : recentSubjects.length ? recentSubjects.slice(0, 3).map((s) => ({ subject: s, percent: cardProgress ? cardProgress(s) : 0 })) : [];
  const explorePreview = useMemo(() => subjects.slice(0, 8), [subjects]);
  const practiceItems = inProgress.slice(0, 3);

  return <>
    {/* ── HERO ─────────────────────────────────────────────── */}
    <section className="relative overflow-hidden bg-[#001529] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#001529] via-[#0b3a63] to-[#001529]" />
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 78% 22%, rgba(184,144,63,0.22), transparent 45%)" }} />
      <div className="absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full border border-[#FFD166]/15" />
      <div className="absolute -bottom-48 -left-24 h-[34rem] w-[34rem] rounded-full border border-white/[0.06]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF6600]/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#FFD166]/30 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFD166] backdrop-blur">
            <span aria-hidden="true">◆</span> SSF Learning Hub
          </div>
          <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            Welcome to Your <span className="text-[#FFD166]">Learning Journey</span> 🚀
          </h1>
          <div className="mt-4 text-lg font-semibold tracking-wide text-[#FFD166] md:text-2xl">Discover • Learn • Practice • Grow</div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 md:text-base">
            ज्ञान से कौशल तक — एक structured digital learning space। हर subject को Learning Area → Course → Modules → Lessons के स्पष्ट क्रम में सीखें, practice करें और अपनी गति से आगे बढ़ें।
          </p>

          <HeroSearch matchSubjects={matchSubjects} onOpenSubject={onOpenSubject} onSubmit={onSearch} />

          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={onExplore} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] px-6 py-3 text-sm font-bold text-[#142b45] shadow-[0_18px_40px_-20px_rgba(184,144,63,0.9)] transition hover:brightness-110">
              <FaCompass aria-hidden="true" /> Explore Learning
            </button>
            <button type="button" onClick={onMyLearning} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/[0.12]">
              <FaPlayCircle aria-hidden="true" /> My Learning
            </button>
          </div>

          {active && <button type="button" onClick={() => onOpenSubject(active.subject)} className="mt-8 flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border border-[#FFD166]/25 bg-white/[0.05] p-4 text-left backdrop-blur transition hover:bg-white/[0.1]">
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD166]">Continue where you left off</span>
              <span className="mt-1.5 block truncate text-base font-bold">{active.subject.en}</span>
              <span className="mt-2 block h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/15"><span className="block h-full rounded-full bg-gradient-to-r from-[#FFD166] to-[#FF6600]" style={{ width: active.percent + "%" }} /></span>
            </span>
            <span className="shrink-0 text-sm font-bold text-[#FFD166]">{active.percent}% <FaArrowRight className="ml-1 inline" aria-hidden="true" /></span>
          </button>}

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:grid-cols-4">
            {[
              [subjects.length, "Subjects", "विषय"],
              [categoryCards.length, "Learning Areas", "क्षेत्र"],
              [knowledgeWorldSubjects.length, "Knowledge Topics", "ज्ञान विषय"],
              ["Structured", "Modules & Lessons", "मॉड्यूल"],
            ].map(([value, en, hi]) => <div key={en} className="bg-[#001529]/40 p-4 text-center backdrop-blur">
              <div className="font-serif text-2xl font-bold text-[#FFD166]">{value}</div>
              <div className="mt-1 text-[11px] font-semibold text-white/60">{en} / {hi}</div>
            </div>)}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-5 rounded-[2.6rem] bg-[#FF6600]/10 blur-3xl" aria-hidden="true" />
          <div className="relative rounded-[2rem] border border-[#FFD166]/25 p-2.5 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10">
              <HubHeroArt className="block h-auto w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001529]/70 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur">◆ हर बच्चा सीख सकता है</div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD166]">Swastik Srijan Foundation</div>
                <div className="mt-1 text-sm font-bold text-white">शिक्षा • कौशल • स्वावलंबन</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── WHAT BRINGS YOU HERE TODAY ───────────────────────── */}
    <section className="mt-14">
      <SectionTitle icon={<FaCompass aria-hidden="true" />} eyebrow="What brings you here today? / आज आप क्यों आए हैं?"
        title="अपना रास्ता चुनें" subtitle="चार स्पष्ट रास्ते — अपने उद्देश्य के अनुसार learning चुनें।" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LEARNING_INTENTS.map((it) => <button key={it.id} type="button" onClick={() => onIntent(it)}
          className="group flex h-full flex-col rounded-[1.6rem] border border-[#EADFCC] bg-white p-6 text-left shadow-[0_18px_45px_-38px_rgba(20,43,69,0.6)] transition duration-300 hover:-translate-y-1.5 hover:border-[#FF6600]/45 hover:shadow-[0_32px_65px_-40px_rgba(20,43,69,0.7)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF3D6] to-[#FFE3B0] text-2xl shadow-inner" aria-hidden="true">{it.icon}</span>
          <span className="mt-5 font-serif text-lg font-bold text-[#142b45]">{it.title}</span>
          <span className="mt-0.5 text-xs font-bold text-[#B34A00]">{it.hi}</span>
          <span className="mt-3 flex-1 text-sm leading-6 text-[#5b6b7c]">{it.text}</span>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6600]">Start <FaArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" /></span>
        </button>)}
      </div>
    </section>

    {/* ── FIND YOUR NEXT STEP / START JOURNEY ──────────────── */}
    <section className="mt-14">
      <SectionTitle icon={<FaBullseye aria-hidden="true" />}
        eyebrow={isReturning ? "Find Your Next Step / अगला कदम" : "Start Your Learning Journey / यात्रा शुरू करें"}
        title={isReturning ? "आपका अगला learning step" : "यहाँ से शुरुआत करें"}
        subtitle={isReturning ? "आपकी progress, recently viewed और current course के आधार पर।" : "नए learners के लिए चुने हुए structured courses।"} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(nextStepItems.length ? nextStepItems : starters.map((s) => ({ subject: s, percent: cardProgress ? cardProgress(s) : 0 }))).map((item) => {
          const info = cardInfo ? cardInfo(item.subject) : {};
          return <SubjectCard key={item.subject.id} subject={item.subject} onOpen={onOpenSubject} onShare={onShareSubject}
            progress={item.percent} badge={info.badge} level={info.level} moduleCount={info.moduleCount} hours={info.hours} />;
        })}
      </div>
    </section>

    {/* ── EXPLORE YOUR LEARNING WORLD ──────────────────────── */}
    <section className="mt-14">
      <SectionTitle icon={<FaLayerGroup aria-hidden="true" />} eyebrow="Explore Your Learning World / सीखने की दुनिया"
        title="पूरा Learning Hub एक नज़र में"
        subtitle="हर समूह से जुड़े learning areas — area चुनें और उसके subjects देखें।"
        action={<button type="button" onClick={onExplore} className="self-start rounded-full border border-[#FF6600]/30 px-4 py-2 text-xs font-bold text-[#c2410c] transition hover:bg-[#FFF3D6]">View all learning →</button>} />
      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((g) => <div key={g.id} className="ssf-panel">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF3D6] to-[#FFE3B0] text-2xl shadow-inner" aria-hidden="true">{g.icon}</span>
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold text-[#142b45]">{g.title}</h3>
              <div className="text-xs font-bold text-[#B34A00]">{g.hi}</div>
              <p className="mt-1 text-sm text-[#5b6b7c]">{g.blurb}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {g.items.map((c) => <button key={c.name} type="button" onClick={() => onCategory(c.name)}
              className="group inline-flex items-center gap-2 rounded-full border border-[#EADFCC] bg-white px-3.5 py-2 text-xs font-bold text-[#142b45] shadow-sm transition hover:-translate-y-0.5 hover:border-[#FF6600]/50 hover:bg-[#FFF7EA]">
              <c.icon aria-hidden="true" />
              <span>{c.name.split(" / ")[0]}</span>
              <span className="rounded-full bg-[#f1efe8] px-2 py-0.5 text-[10px] font-bold text-[#5b6b7c]">{c.count}</span>
              <FaArrowRight className="text-[#FF6600] opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
            </button>)}
          </div>
        </div>)}
      </div>
    </section>

    {/* ── LEARNING PATHS / JOURNEYS ────────────────────────── */}
    <section className="mt-14">
      <SectionTitle icon={<FaRoute aria-hidden="true" />} eyebrow="Learning Paths / सीखने के रास्ते"
        title="लक्ष्य के अनुसार journeys" subtitle="हर path असली categories से जुड़ा है — कोई नकली course नहीं।" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARNING_PATHS.map((p) => <button key={p.id} type="button" onClick={() => onPath(p)}
          className="group flex h-full items-start gap-4 rounded-[1.6rem] border border-[#EADFCC] bg-white p-5 text-left shadow-[0_18px_45px_-38px_rgba(20,43,69,0.6)] transition duration-300 hover:-translate-y-1 hover:border-[#FF6600]/45 hover:shadow-[0_30px_60px_-40px_rgba(20,43,69,0.7)]">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b3a63] to-[#001529] text-xl text-[#FFD166]" aria-hidden="true">{p.icon}</span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-base font-bold text-[#142b45]">{p.title}</span>
            <span className="block text-[11px] font-bold text-[#B34A00]">{p.hi}</span>
            <span className="mt-1 block text-sm leading-6 text-[#5b6b7c]">{p.text}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6600]">Begin path <FaArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" /></span>
          </span>
        </button>)}
      </div>
    </section>

    {/* ── LEARNING MODES ───────────────────────────────────── */}
    <section className="mt-14">
      <SectionTitle icon={<FaGraduationCap aria-hidden="true" />} eyebrow="Learning Modes / सीखने के तरीके"
        title="सिर्फ course list से आगे" subtitle="SSF Learning Hub में सीखने, अभ्यास और आकलन के अलग-अलग तरीके हैं।" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {MODES.map((m) => <button key={m.title} type="button"
          onClick={() => m.route === "knowledge" ? onKnowledge() : m.route === "myLearning" ? onMyLearning() : m.route === "verify" ? onVerify() : onExplore()}
          className="group flex h-full flex-col rounded-2xl border border-[#EADFCC] bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#FF6600]/45 hover:shadow-lg">
          <span className="text-2xl text-[#FF6600]" aria-hidden="true">{m.icon}</span>
          <span className="mt-3 font-serif text-base font-bold text-[#142b45]">{m.title}</span>
          <span className="text-[11px] font-bold text-[#B34A00]">{m.hi}</span>
          <span className="mt-2 flex-1 text-xs leading-6 text-[#5b6b7c]">{m.text}</span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF6600]">{m.cta} <FaArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" /></span>
        </button>)}
      </div>
    </section>

    {/* ── FEATURED / DISCOVERY ─────────────────────────────── */}
    <section className="mt-14">
      <SectionTitle icon={<FaStar aria-hidden="true" />} eyebrow="Featured & Discovery / चुनिंदा"
        title="आपके लिए चुनिंदा learning"
        subtitle="Badges असली course metadata से — कोई नकली rating या popularity नहीं।"
        action={<button type="button" onClick={onExplore} className="self-start rounded-full border border-[#FF6600]/30 px-4 py-2 text-xs font-bold text-[#c2410c] transition hover:bg-[#FFF3D6]">Explore all →</button>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {discovery.map((s) => { const info = cardInfo ? cardInfo(s) : {}; return (
          <SubjectCard key={s.id} subject={s} onOpen={onOpenSubject} onShare={onShareSubject}
            progress={cardProgress ? cardProgress(s) : 0} badge={info.badge} level={info.level} moduleCount={info.moduleCount} hours={info.hours} />
        ); })}
      </div>
    </section>

    {/* ── PRACTICE & CHALLENGE ─────────────────────────────── */}
    <section className="mt-14">
      <SectionTitle icon={<FaTools aria-hidden="true" />} eyebrow="Practice & Challenge / अभ्यास एवं चुनौती"
        title={practiceItems.length ? "अपना अभ्यास जारी रखें" : "हर course के अंदर अभ्यास"}
        subtitle={practiceItems.length ? "जहाँ आप रुके थे वहीं से practice और assessment जारी रखें।" : "प्रत्येक structured course में activities, practice, module checks और final quiz शामिल हैं।"} />
      {practiceItems.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {practiceItems.map((item) => { const info = cardInfo ? cardInfo(item.subject) : {}; return (
          <SubjectCard key={item.subject.id} subject={item.subject} onOpen={onOpenSubject} onShare={onShareSubject}
            progress={item.percent} badge={info.badge} level={info.level} moduleCount={info.moduleCount} hours={info.hours} actionLabel="Continue Practice / अभ्यास जारी रखें" />
        ); })}
      </div> : <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: "🧪", title: "Quick Practice", hi: "त्वरित अभ्यास", text: "हर module में छोटे practice steps।" },
          { icon: "🎯", title: "Knowledge Check", hi: "ज्ञान जाँच", text: "Module assessment से समझ परखें।" },
          { icon: "🏆", title: "Assessment", hi: "आकलन", text: "अंत में final quiz और certificate pathway।" },
        ].map((c) => <div key={c.title} className="rounded-2xl border border-[#EADFCC] bg-white p-5 shadow-sm">
          <span className="text-2xl" aria-hidden="true">{c.icon}</span>
          <div className="mt-3 font-serif text-base font-bold text-[#142b45]">{c.title}</div>
          <div className="text-[11px] font-bold text-[#B34A00]">{c.hi}</div>
          <p className="mt-2 text-sm leading-6 text-[#5b6b7c]">{c.text}</p>
        </div>)}
      </div>}
    </section>

    {/* ── MY LEARNING ──────────────────────────────────────── */}
    <section className="mt-14">
      <SectionTitle icon={<FaHistory aria-hidden="true" />} eyebrow="My Learning / मेरी सीख"
        title="आपकी व्यक्तिगत learning"
        subtitle="Continue Learning, Recently Viewed, Progress और Certificates — सब एक जगह।"
        action={<button type="button" onClick={onMyLearning} className="self-start rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] px-4 py-2.5 text-xs font-bold text-[#142b45] shadow-md transition hover:brightness-110">Open My Learning →</button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <FaPlayCircle aria-hidden="true" />, label: "Continue Learning", hi: "सीखना जारी रखें", value: inProgress.length, note: inProgress.length ? "in progress" : "अभी शुरू करें" },
          { icon: <FaHistory aria-hidden="true" />, label: "Recently Viewed", hi: "हाल में देखा", value: recentSubjects.length, note: recentSubjects.length ? "recent courses" : "कुछ नहीं" },
          { icon: <FaCheckCircle aria-hidden="true" />, label: "Completed", hi: "पूर्ण", value: completedCount, note: "courses" },
          { icon: <FaCertificate aria-hidden="true" />, label: "Certificates", hi: "प्रमाणपत्र", value: "—", note: "verify anytime" },
        ].map((c) => <div key={c.label} className="rounded-2xl border border-[#EADFCC] bg-white p-5 shadow-sm">
          <span className="text-xl text-[#FF6600]" aria-hidden="true">{c.icon}</span>
          <div className="mt-3 font-serif text-2xl font-bold text-[#142b45]">{c.value}</div>
          <div className="text-xs font-bold text-[#142b45]">{c.label}</div>
          <div className="text-[11px] font-semibold text-[#8a97a5]">{c.hi} • {c.note}</div>
        </div>)}
      </div>
      {active && <button type="button" onClick={() => onOpenSubject(active.subject)} className="group mt-6 flex w-full items-center justify-between gap-4 rounded-2xl border border-[#FF6600]/25 bg-[#FFF7EA] p-5 text-left transition hover:bg-[#FFEFD6]">
        <span className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#B34A00]">Continue Learning</span>
          <span className="mt-1 block truncate font-serif text-lg font-bold text-[#142b45]">{active.subject.en}</span>
          <span className="mt-2 block h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white"><span className="block h-full rounded-full bg-gradient-to-r from-[#FF6600] to-[#FFD166]" style={{ width: active.percent + "%" }} /></span>
        </span>
        <span className="shrink-0 rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] px-5 py-3 text-sm font-bold text-[#142b45] shadow-md">Continue →</span>
      </button>}
    </section>

    {/* ── EXPLORE ALL LEARNING ─────────────────────────────── */}
    <section className="mt-14">
      <SectionTitle icon={<FaBookOpen aria-hidden="true" />} eyebrow="Explore All Learning / सारी सीख"
        title="पूरी learning library"
        subtitle={`Explore में सभी ${subjects.length} subjects search, category, level, type और sort से filter करें।`}
        action={<button type="button" onClick={onExplore} className="self-start rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] px-4 py-2.5 text-xs font-bold text-[#142b45] shadow-md transition hover:brightness-110">Open full Explore →</button>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {explorePreview.map((s) => { const info = cardInfo ? cardInfo(s) : {}; return (
          <SubjectCard key={s.id} subject={s} onOpen={onOpenSubject} onShare={onShareSubject}
            progress={cardProgress ? cardProgress(s) : 0} badge={info.badge} level={info.level} moduleCount={info.moduleCount} hours={info.hours} />
        ); })}
      </div>
    </section>
  </>;
}
