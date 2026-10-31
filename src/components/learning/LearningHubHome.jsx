import { useMemo, useState } from "react";
import {
  FaArrowRight, FaBookOpen, FaCompass, FaGraduationCap, FaPlayCircle,
  FaSearch, FaLayerGroup, FaGlobe, FaCheckCircle, FaCertificate, FaBullseye,
  FaTools, FaRoute, FaHistory, FaStar, FaLightbulb, FaLaptop, FaHandsHelping,
  FaShieldAlt, FaRegClock
} from "react-icons/fa";
import { HubHeroArt } from "./LearningIllustrations";
import SubjectCard from "./SubjectCard";
import { buildLearningWorld, LEARNING_INTENTS, LEARNING_PATHS } from "../../data/learningWorld";

const SectionTitle = ({ icon, eyebrow, title, subtitle, action }) => (
  <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#176447]">
        <span aria-hidden="true">{icon}</span><span>{eyebrow}</span>
      </div>
      <h2 className="mt-2 font-serif text-3xl font-bold leading-tight tracking-tight text-[#12345A] md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-7 text-[#536170] md:text-base">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const MODES = [
  { icon: <FaBookOpen aria-hidden="true" />, title: "Courses", hi: "पाठ्यक्रम", text: "Step-by-step subjects, modules and lessons.", cta: "Browse courses", route: "explore" },
  { icon: <FaGlobe aria-hidden="true" />, title: "Knowledge World", hi: "ज्ञान संसार", text: "Explore useful topics, facts and connected ideas.", cta: "Explore knowledge", route: "knowledge" },
  { icon: <FaTools aria-hidden="true" />, title: "Practice", hi: "अभ्यास", text: "Build understanding through activities and practice.", cta: "Find practice", route: "explore" },
  { icon: <FaCheckCircle aria-hidden="true" />, title: "Assessment", hi: "आकलन", text: "Check your understanding through course assessments.", cta: "View my learning", route: "myLearning" },
  { icon: <FaCertificate aria-hidden="true" />, title: "Certificates", hi: "प्रमाणपत्र", text: "Check and verify an SSF learning certificate.", cta: "Verify certificate", route: "verify" },
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
  return (
    <form onSubmit={submit} className="relative mt-8 w-full max-w-2xl" role="search">
      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white p-2 pl-4 shadow-[0_18px_50px_-28px_rgba(0,0,0,.55)] transition focus-within:ring-4 focus-within:ring-[#F7A814]/20">
        <FaSearch className="shrink-0 text-[#176447]" aria-hidden="true" />
        <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)} type="search"
          aria-label="Search the Learning Hub" placeholder="What would you like to learn? / क्या सीखना चाहेंगे?"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#12345A] placeholder:text-[#718096] focus:outline-none" />
        <button type="submit" className="shrink-0 rounded-xl bg-[#176447] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#10543A] focus:outline-none focus:ring-4 focus:ring-[#176447]/20">Search</button>
      </div>
      {showResults && <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[#E5EAF0] bg-white text-left shadow-2xl">
        {results.length ? results.map((s) => (
          <button key={s.id} type="button" onMouseDown={(e) => { e.preventDefault(); onOpenSubject(s); }}
            className="flex w-full items-center gap-3 border-b border-[#EEF1F4] px-4 py-3 text-left transition last:border-0 hover:bg-[#F5F8F6]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF0F6] text-[#12345A]"><FaBookOpen aria-hidden="true" /></span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-[#12345A]">{s.en}</span>
              <span className="block truncate text-xs text-[#647184]">{s.hi} · {s.category.split(" / ")[0]}</span>
            </span>
            <FaArrowRight className="shrink-0 text-[#176447]" aria-hidden="true" />
          </button>
        )) : <div className="px-4 py-4 text-sm text-[#536170]">No matching topic yet. Try another word or browse all subjects. / कोई दूसरा शब्द खोजें या सभी विषय देखें।</div>}
      </div>}
    </form>
  );
}

const FEATURE_ITEMS = [
  { icon: <FaLaptop aria-hidden="true" />, title: "Learn at your pace", hi: "अपनी गति से सीखें", text: "Open lessons and study when it suits you." },
  { icon: <FaLightbulb aria-hidden="true" />, title: "Understand by doing", hi: "अभ्यास से समझें", text: "Use examples, activities and checks built into courses." },
  { icon: <FaHandsHelping aria-hidden="true" />, title: "Inclusive access", hi: "सबके लिए सीख", text: "A welcoming learning space with English and Hindi support where provided." },
  { icon: <FaShieldAlt aria-hidden="true" />, title: "Learn with clarity", hi: "स्पष्ट जानकारी", text: "Course type, level and learning details are shown wherever available." },
];

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
  const starters = useMemo(() => {
    const info = (s) => (cardInfo ? cardInfo(s) : {});
    const structured = subjects.filter((s) => info(s).kind === "Full Course");
    return (structured.length ? structured : subjects).slice(0, 3);
  }, [subjects, cardInfo]);
  const starterIds = useMemo(() => new Set(starters.map((s) => s.id)), [starters]);
  const discovery = useMemo(() => {
    const info = (s) => (cardInfo ? cardInfo(s) : {});
    const isNew = (s) => !starterIds.has(s.id);
    const featured = subjects.filter((s) => info(s).kind === "Full Course" && isNew(s));
    const fresh = subjects.filter((s) => info(s).kind === "Course Shell" && isNew(s));
    const kw = knowledgeWorldSubjects.filter(isNew).slice(0, 2);
    const out = [];
    const push = (arr) => arr.forEach((s) => { if (out.length < 4 && !out.includes(s)) out.push(s); });
    push(featured.slice(0, 3)); push(kw); push(fresh.slice(0, 2)); push(featured.slice(3, 6));
    return out;
  }, [subjects, knowledgeWorldSubjects, cardInfo, starterIds]);
  const nextStepItems = active ? [active] : recentSubjects.length
    ? recentSubjects.slice(0, 2).map((s) => ({ subject: s, percent: cardProgress ? cardProgress(s) : 0 })) : [];
  const explorePreview = useMemo(() => {
    const shown = new Set([...starters, ...discovery].map((s) => s.id));
    const pool = subjects.filter((s) => !shown.has(s.id));
    const byCategory = new Map();
    pool.forEach((s) => { const arr = byCategory.get(s.category) || []; arr.push(s); byCategory.set(s.category, arr); });
    const out = [];
    let progressed = true;
    while (out.length < 4 && progressed) {
      progressed = false;
      for (const arr of byCategory.values()) {
        if (arr.length) { out.push(arr.shift()); progressed = true; if (out.length >= 4) break; }
      }
    }
    return out.length ? out : subjects.slice(0, 4);
  }, [subjects, starters, discovery]);
  const practiceItems = inProgress.slice(0, 2);
  const countLabel = (n) => new Intl.NumberFormat("en-IN").format(n);

  return <>
    <section className="relative isolate overflow-hidden bg-[#102D4D] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_18%,rgba(247,168,20,.19),transparent_38%),radial-gradient(ellipse_at_8%_95%,rgba(23,100,71,.36),transparent_42%),linear-gradient(125deg,#102D4D_0%,#12345A_55%,#173D5C_100%)]" />
      <div className="absolute -right-36 -top-44 -z-10 h-[34rem] w-[34rem] rounded-full border border-white/10" />
      <div className="absolute -right-20 -top-28 -z-10 h-[25rem] w-[25rem] rounded-full border border-[#F7A814]/15" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F7A814]/60 to-transparent" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.08fr_.92fr] lg:gap-14 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F7A814]/35 bg-white/[0.07] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#F7C45B]">
            <span aria-hidden="true">✦</span> Swastik Srijan Foundation · Learning Hub
          </div>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            Learn today. <span className="text-[#F7C45B]">Build tomorrow.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold text-white/90 md:text-xl">ज्ञान से कौशल तक — सीखने का एक खुला मंच</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Explore subjects, build practical understanding and move forward one lesson at a time. अपनी रुचि और उद्देश्य के अनुसार विषय चुनें, सीखें और अभ्यास करें।
          </p>
          <HeroSearch matchSubjects={matchSubjects} onOpenSubject={onOpenSubject} onSubmit={onSearch} />
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={onExplore} className="inline-flex items-center gap-2 rounded-full bg-[#F7A814] px-6 py-3 text-sm font-extrabold text-[#17324D] shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#FFC247] focus:outline-none focus:ring-4 focus:ring-[#F7A814]/30">
              <FaCompass aria-hidden="true" /> Explore learning <FaArrowRight aria-hidden="true" />
            </button>
            <button type="button" onClick={onMyLearning} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-6 py-3 text-sm font-bold text-white transition hover:bg-white/[0.15] focus:outline-none focus:ring-4 focus:ring-white/20">
              <FaPlayCircle aria-hidden="true" /> My Learning
            </button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/65">
            <span className="inline-flex items-center gap-2"><FaBookOpen className="text-[#F7C45B]" /> Self-paced learning</span>
            <span className="inline-flex items-center gap-2"><FaGlobe className="text-[#F7C45B]" /> Knowledge for everyone</span>
            <span className="inline-flex items-center gap-2"><FaRegClock className="text-[#F7C45B]" /> Learn at your pace</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-[#F7A814]/10 blur-3xl" aria-hidden="true" />
          <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.07] p-2 shadow-[0_35px_90px_-35px_rgba(0,0,0,.75)] backdrop-blur">
            <div className="overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#173D5C]">
              <HubHeroArt className="block h-auto w-full" />
              <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#102D4D] px-5 py-4">
                <div><div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#F7C45B]">Swastik Srijan Foundation</div><div className="mt-1 text-sm font-semibold text-white">शिक्षा · कौशल · स्वावलंबन</div></div>
                <span className="rounded-full border border-[#F7A814]/30 px-3 py-1.5 text-[10px] font-bold text-[#F7C45B]">Learn · Practice · Grow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
        {[
          [countLabel(subjects.length), "Subjects", "विषय"],
          [countLabel(categoryCards.length), "Learning areas", "शिक्षा क्षेत्र"],
          [countLabel(knowledgeWorldSubjects.length), "Knowledge topics", "ज्ञान विषय"],
          ["Self-paced", "Learning approach", "सीखने की सुविधा"],
        ].map(([value, en, hi]) => <div key={en} className="bg-[#102D4D]/95 px-3 py-4 text-center sm:py-5">
          <div className="font-serif text-xl font-bold text-[#F7C45B] sm:text-2xl">{value}</div>
          <div className="mt-1 text-[11px] font-bold text-white/85">{en}</div><div className="text-[10px] text-white/55">{hi}</div>
        </div>)}
      </div>
    </section>

    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
      <nav aria-label="Learning Hub sections" className="sticky top-0 z-20 -mx-4 border-b border-[#E7EBEF] bg-[#FAF9F5]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold text-[#405266]">
          {[["#learning-start","Start here"],["#learning-areas","Learning areas"],["#learning-paths","Learning paths"],["#learning-methods","How to learn"],["#featured-learning","Featured"],["#my-learning","My learning"]].map(([href,label]) => <a key={href} href={href} className="shrink-0 rounded-full border border-[#E1E7EC] bg-white px-4 py-2.5 transition hover:border-[#176447]/40 hover:bg-[#EDF4EF] hover:text-[#176447]">{label}</a>)}
          <button type="button" onClick={onVerify} className="shrink-0 rounded-full bg-[#176447] px-4 py-2.5 text-white transition hover:bg-[#10543A]">Verify certificate</button>
        </div>
      </nav>

      <section id="learning-start" className="scroll-mt-24 pt-12 md:pt-16">
        <SectionTitle icon={<FaBullseye />} eyebrow="A clear place to begin / शुरुआत यहाँ से"
          title="आप आज क्या सीखना चाहते हैं?"
          subtitle="अपने लक्ष्य के अनुसार रास्ता चुनें। हर विकल्प आपको संबंधित विषयों तक ले जाएगा।" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {LEARNING_INTENTS.map((it) => <button key={it.id} type="button" onClick={() => onIntent(it)}
            className="group flex h-full min-h-48 flex-col rounded-2xl border border-[#E4E9ED] bg-white p-5 text-left shadow-[0_12px_35px_-30px_rgba(18,52,90,.45)] transition duration-300 hover:-translate-y-1 hover:border-[#176447]/40 hover:shadow-[0_22px_45px_-30px_rgba(18,52,90,.38)] focus:outline-none focus:ring-4 focus:ring-[#176447]/15">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2ED] text-2xl text-[#176447]" aria-hidden="true">{it.icon}</span>
            <span className="mt-4 font-serif text-lg font-bold text-[#12345A]">{it.title}</span>
            <span className="text-xs font-bold text-[#176447]">{it.hi}</span>
            <span className="mt-2 flex-1 text-sm leading-6 text-[#5B6875]">{it.text}</span>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#176447]">Explore this path <FaArrowRight className="transition group-hover:translate-x-1" /></span>
          </button>)}
        </div>
      </section>

      <section id="learning-areas" className="scroll-mt-24 pt-14 md:pt-20">
        <SectionTitle icon={<FaLayerGroup />} eyebrow="Explore the learning world / सीखने की दुनिया"
          title="हर रुचि के लिए एक learning area"
          subtitle="विषयवार क्षेत्रों में जाएँ और अपनी जरूरत के अनुसार course या knowledge topic चुनें।"
          action={<button type="button" onClick={onExplore} className="self-start rounded-full border border-[#176447]/30 px-5 py-2.5 text-xs font-extrabold text-[#176447] transition hover:bg-[#EAF2ED]">View all subjects <FaArrowRight className="ml-1 inline" /></button>} />
        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map((g) => <div key={g.id} className="rounded-[1.6rem] border border-[#E4E9ED] bg-white p-5 shadow-[0_15px_45px_-38px_rgba(18,52,90,.35)] sm:p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2ED] text-2xl text-[#176447]" aria-hidden="true">{g.icon}</span>
              <div className="min-w-0"><h3 className="font-serif text-xl font-bold text-[#12345A]">{g.title}</h3><div className="mt-0.5 text-xs font-bold text-[#176447]">{g.hi}</div><p className="mt-2 text-sm leading-6 text-[#5B6875]">{g.blurb}</p></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {g.items.map((c) => <button key={c.name} type="button" onClick={() => onCategory(c.name)}
                className="inline-flex items-center gap-2 rounded-full border border-[#E3E9E5] bg-[#F8FAF8] px-3.5 py-2 text-xs font-bold text-[#29445A] transition hover:border-[#176447]/40 hover:bg-[#EAF2ED] hover:text-[#176447]">
                <c.icon aria-hidden="true" /><span>{c.name.split(" / ")[0]}</span><span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-[#647184]">{c.count}</span>
              </button>)}
            </div>
          </div>)}
        </div>
      </section>

      <section id="learning-paths" className="scroll-mt-24 pt-14 md:pt-20">
        <SectionTitle icon={<FaRoute />} eyebrow="Learning paths / सीखने के रास्ते"
          title="अपने लक्ष्य तक कदम-दर-कदम"
          subtitle="तैयार learning journeys आपको संबंधित विषयों और कौशलों का रास्ता दिखाती हैं।" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {LEARNING_PATHS.map((p) => <button key={p.id} type="button" onClick={() => onPath(p)}
            className="group flex h-full items-start gap-4 rounded-2xl border border-[#E4E9ED] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#176447]/40 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#176447]/15">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#12345A] text-xl text-[#F7C45B]" aria-hidden="true">{p.icon}</span>
            <span className="min-w-0 flex-1"><span className="block font-serif text-base font-bold text-[#12345A]">{p.title}</span><span className="mt-0.5 block text-[11px] font-bold text-[#176447]">{p.hi}</span><span className="mt-2 block text-sm leading-6 text-[#5B6875]">{p.text}</span><span className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-[#176447]">Begin path <FaArrowRight className="transition group-hover:translate-x-1" /></span></span>
          </button>)}
        </div>
      </section>

      <section id="learning-methods" className="scroll-mt-24 pt-14 md:pt-20">
        <SectionTitle icon={<FaGraduationCap />} eyebrow="Learning methods / सीखने के तरीके"
          title="सिर्फ पढ़ना नहीं — समझना, करना और जाँचना"
          subtitle="Learning Hub के उपलब्ध course tools को एक ही जगह से समझें।" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {MODES.map((m) => <button key={m.title} type="button"
            onClick={() => m.route === "knowledge" ? onKnowledge() : m.route === "myLearning" ? onMyLearning() : m.route === "verify" ? onVerify() : onExplore()}
            className="group flex h-full flex-col rounded-2xl border border-[#E4E9ED] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#176447]/40 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#176447]/15">
            <span className="text-2xl text-[#176447]" aria-hidden="true">{m.icon}</span><span className="mt-3 font-serif text-base font-bold text-[#12345A]">{m.title}</span><span className="text-[11px] font-bold text-[#176447]">{m.hi}</span><span className="mt-2 flex-1 text-xs leading-6 text-[#5B6875]">{m.text}</span><span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#176447]">{m.cta} <FaArrowRight className="transition group-hover:translate-x-1" /></span>
          </button>)}
        </div>
      </section>

      <section className="pt-14 md:pt-20">
        <SectionTitle icon={<FaStar />} eyebrow="The SSF learning approach / सीखने का अनुभव"
          title="एक उपयोगी और learner-first अनुभव"
          subtitle="हमारा उद्देश्य है कि सीखने की शुरुआत आसान हो और हर कदम समझ में आए।" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURE_ITEMS.map((f) => <div key={f.title} className="rounded-2xl border border-[#E4E9ED] bg-white p-5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF2ED] text-lg text-[#176447]">{f.icon}</span><h3 className="mt-4 font-serif text-base font-bold text-[#12345A]">{f.title}</h3><div className="text-xs font-bold text-[#176447]">{f.hi}</div><p className="mt-2 text-sm leading-6 text-[#5B6875]">{f.text}</p></div>)}
        </div>
      </section>

      <section id="featured-learning" className="scroll-mt-24 pt-14 md:pt-20">
        <SectionTitle icon={<FaStar />} eyebrow="Recommended starting points / शुरुआत के लिए"
          title="आपके लिए चुने हुए courses"
          subtitle="नीचे उपलब्ध course library से कुछ विकल्प हैं। Course खोलकर उसका स्तर, modules और lesson details देखें।"
          action={<button type="button" onClick={onExplore} className="self-start rounded-full bg-[#176447] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#10543A]">Explore full library <FaArrowRight className="ml-1 inline" /></button>} />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {(nextStepItems.length ? nextStepItems : starters.map((s) => ({ subject: s, percent: cardProgress ? cardProgress(s) : 0 }))).map((item) => {
            const info = cardInfo ? cardInfo(item.subject) : {};
            return <SubjectCard key={item.subject.id} subject={item.subject} onOpen={onOpenSubject} onShare={onShareSubject}
              progress={item.percent} badge={info.badge} level={info.level} moduleCount={info.moduleCount} hours={info.hours} />;
          })}
        </div>
      </section>

      {discovery.length > 0 && <section className="pt-14 md:pt-20">
        <SectionTitle icon={<FaCompass />} eyebrow="Discover more / और जानें"
          title="नई दिशाएँ खोजें"
          subtitle="अलग-अलग learning areas से चुने गए और विषय।" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {discovery.map((s) => { const info = cardInfo ? cardInfo(s) : {}; return <SubjectCard key={s.id} subject={s} onOpen={onOpenSubject} onShare={onShareSubject} progress={cardProgress ? cardProgress(s) : 0} badge={info.badge} level={info.level} moduleCount={info.moduleCount} hours={info.hours} />; })}
        </div>
      </section>}

      <section className="pt-14 md:pt-20">
        <SectionTitle icon={<FaTools />} eyebrow="Practice & assessment / अभ्यास और आकलन"
          title={practiceItems.length ? "अपना अभ्यास जारी रखें" : "सीखने के साथ अभ्यास भी करें"}
          subtitle="Course के भीतर उपलब्ध activities, practice और assessments से अपनी समझ मजबूत करें।" />
        {practiceItems.length ? <div className="grid gap-5 sm:grid-cols-2">{practiceItems.map((item) => { const info = cardInfo ? cardInfo(item.subject) : {}; return <SubjectCard key={item.subject.id} subject={item.subject} onOpen={onOpenSubject} onShare={onShareSubject} progress={item.percent} badge={info.badge} level={info.level} moduleCount={info.moduleCount} hours={info.hours} actionLabel="Continue learning / आगे बढ़ें" />; })}</div>
          : <div className="grid gap-4 sm:grid-cols-3">
            {[{icon:"🧩",title:"Practice activities",hi:"अभ्यास गतिविधियाँ",text:"अवधारणाओं को उदाहरण और गतिविधियों से समझें।"},{icon:"🎯",title:"Knowledge checks",hi:"ज्ञान जाँच",text:"Module के भीतर अपनी समझ को परखें।"},{icon:"🏅",title:"Course assessment",hi:"पाठ्यक्रम आकलन",text:"जहाँ उपलब्ध हो, course assessment पूरा करें।"}].map((c) => <div key={c.title} className="rounded-2xl border border-[#E4E9ED] bg-white p-5"><span className="text-2xl" aria-hidden="true">{c.icon}</span><h3 className="mt-3 font-serif font-bold text-[#12345A]">{c.title}</h3><div className="text-xs font-bold text-[#176447]">{c.hi}</div><p className="mt-2 text-sm leading-6 text-[#5B6875]">{c.text}</p></div>)}
          </div>}
      </section>

      <section id="my-learning" className="scroll-mt-24 pt-14 md:pt-20">
        <div className="rounded-[1.8rem] bg-[#12345A] p-6 text-white shadow-[0_25px_65px_-38px_rgba(18,52,90,.7)] md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.18em] text-[#F7C45B]"><FaHistory /> My Learning / मेरी सीख</div><h2 className="mt-3 font-serif text-3xl font-bold">आपकी learning journey</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-white/70">हाल में देखे गए विषय, course progress और completed learning यहाँ देखें। अभी progress इसी browser/device में सुरक्षित होती है।</p></div>
            <button type="button" onClick={onMyLearning} className="self-start rounded-full bg-[#F7A814] px-5 py-3 text-sm font-extrabold text-[#17324D] transition hover:bg-[#FFC247]">Open My Learning <FaArrowRight className="ml-1 inline" /></button>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              [inProgress.length, "In progress", "जारी courses"],
              [recentSubjects.length, "Recently viewed", "हाल में देखे"],
              [completedCount, "Completed", "पूर्ण courses"],
              ["Available", "Certificate verification", "प्रमाणपत्र जाँच"],
            ].map(([value,label,hi]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4"><div className="font-serif text-2xl font-bold text-[#F7C45B]">{value}</div><div className="mt-1 text-xs font-bold text-white">{label}</div><div className="text-[10px] text-white/55">{hi}</div></div>)}
          </div>
          {active && <button type="button" onClick={() => onOpenSubject(active.subject)} className="mt-5 flex w-full items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-left transition hover:bg-white/[0.12]">
            <span className="min-w-0"><span className="block text-[10px] font-extrabold uppercase tracking-[.16em] text-[#F7C45B]">Continue where you left off</span><span className="mt-1 block truncate font-bold text-white">{active.subject.en}</span><span className="mt-2 block h-1.5 max-w-md overflow-hidden rounded-full bg-white/15"><span className="block h-full rounded-full bg-[#F7A814]" style={{ width: active.percent + "%" }} /></span></span>
            <span className="shrink-0 text-sm font-extrabold text-[#F7C45B]">{active.percent}% <FaArrowRight className="ml-1 inline" /></span>
          </button>}
          <p className="mt-4 text-[11px] leading-5 text-white/50">Note: Progress and recently viewed items are currently stored locally in this browser. They do not automatically sync across devices.</p>
        </div>
      </section>

      <section className="pt-14 md:pt-20">
        <SectionTitle icon={<FaBookOpen />} eyebrow="Explore the full library / पूरी लाइब्रेरी"
          title="और भी बहुत कुछ सीखने के लिए"
          subtitle={`सभी \${subjects.length} subjects को search, category, level और learning type के अनुसार explore करें।`}
          action={<button type="button" onClick={onExplore} className="self-start rounded-full border border-[#176447]/30 px-5 py-2.5 text-xs font-extrabold text-[#176447] transition hover:bg-[#EAF2ED]">Open full library <FaArrowRight className="ml-1 inline" /></button>} />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {explorePreview.map((s) => { const info = cardInfo ? cardInfo(s) : {}; return <SubjectCard key={s.id} subject={s} onOpen={onOpenSubject} onShare={onShareSubject} progress={cardProgress ? cardProgress(s) : 0} badge={info.badge} level={info.level} moduleCount={info.moduleCount} hours={info.hours} />; })}
        </div>
      </section>

      <section className="pt-14 md:pt-20">
        <div className="rounded-[1.6rem] border border-[#DDE7E0] bg-[#F1F6F2] p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div><div className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[#176447]">Need help? / सहायता चाहिए?</div><h2 className="mt-2 font-serif text-2xl font-bold text-[#12345A]">अपनी learning journey शुरू करें</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-[#536170]">कोई विषय खोजें, learning area चुनें या certificate verify करें। हर course की जानकारी खोलकर उपलब्ध lessons और सुविधाएँ देख सकते हैं।</p></div>
          <div className="mt-5 flex shrink-0 flex-wrap gap-3 md:mt-0"><button type="button" onClick={onExplore} className="rounded-full bg-[#176447] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#10543A]">Browse courses</button><button type="button" onClick={onVerify} className="rounded-full border border-[#176447]/30 bg-white px-5 py-3 text-sm font-extrabold text-[#176447] transition hover:bg-[#EAF2ED]">Verify certificate</button></div>
        </div>
      </section>
    </div>
  </>;
}
