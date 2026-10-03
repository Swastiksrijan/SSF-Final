import { FaArrowRight, FaBookOpen, FaPlayCircle, FaGlobe, FaGraduationCap, FaCheckCircle, FaLayerGroup } from "react-icons/fa";
import { HubHeroArt } from "./LearningIllustrations";

const GoldRule = ({ className = "" }) => (
  <span className={"block h-px w-20 bg-gradient-to-r from-[#FF6600] to-transparent " + className} aria-hidden="true" />
);

const SectionTitle = ({ icon, eyebrow, title, subtitle, action }) => (
  <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF6600]">
        <span className="text-[#FF6600]">{icon}</span> {eyebrow}
      </div>
      <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#142b45] md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5b6b7c]">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export function LearningHubLanding({ onStart, onExplore, onContinue, onOpenSubject, onOpenKnowledge, progressSummary, totalSubjects, totalAreas }) {
  const active = progressSummary?.active;
  return <section className="relative overflow-hidden bg-[#001529] text-white">
    <div className="absolute inset-0 bg-gradient-to-br from-[#001529] via-[#0b3a63] to-[#001529]" />
    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 78% 22%, rgba(184,144,63,0.22), transparent 45%)" }} />
    <div className="absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full border border-[#FFD166]/15" />
    <div className="absolute -bottom-48 -left-24 h-[34rem] w-[34rem] rounded-full border border-white/[0.06]" />
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF6600]/60 to-transparent" />

    <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#FFD166]/30 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#FFD166] backdrop-blur">
          <span className="text-[#FFD166]">◆</span> SSF Learning Hub
        </div>
        <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
          Welcome to <span className="text-[#FFD166]">SSF Learning Hub</span>
        </h1>
        <div className="mt-4 text-lg font-semibold text-[#FFD166] md:text-2xl">ज्ञान से कौशल तक • From Knowledge to Capability</div>
        <p className="mt-6 max-w-xl text-lg font-semibold text-white/90 md:text-xl">सीखिए। अभ्यास कीजिए। आगे बढ़िए।</p>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/70 md:text-base">एक structured digital learning space — हर subject को Learning Area → Subjects → Course → Modules → Lessons के स्पष्ट क्रम में सीखें, practice करें और अपनी गति से आगे बढ़ें।</p>

        <div className="mt-9 flex flex-wrap gap-3">
          <button type="button" onClick={onStart} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] px-7 py-3.5 text-sm font-bold text-[#142b45] shadow-[0_18px_40px_-20px_rgba(184,144,63,0.9)] transition hover:brightness-110">
            🚀 Start Learning
          </button>
          <button type="button" onClick={onExplore} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/[0.12]">
            <FaBookOpen aria-hidden="true" /> Explore Subjects
          </button>
          <button type="button" onClick={onContinue} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/[0.12]">
            <FaPlayCircle aria-hidden="true" /> Continue Learning
          </button>
        </div>

        {active && <button type="button" onClick={() => onOpenSubject(active.subject)} className="mt-9 flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border border-[#FFD166]/25 bg-white/[0.05] p-4 text-left backdrop-blur transition hover:bg-white/[0.1]">
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD166]">Continue where you left off</span>
            <span className="mt-1.5 block truncate text-base font-bold">{active.subject.en}</span>
            <span className="mt-2 block h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/15"><span className="block h-full rounded-full bg-gradient-to-r from-[#FFD166] to-[#FF6600]" style={{ width: active.percent + "%" }} /></span>
          </span>
          <span className="shrink-0 text-sm font-bold text-[#FFD166]">{active.percent}% <FaArrowRight className="ml-1 inline" /></span>
        </button>}

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:grid-cols-4">
          {[
            [totalSubjects ?? 132, "Subjects", "विषय"],
            [totalAreas ?? 17, "Learning Areas", "क्षेत्र"],
            ["Structured", "Modules & Lessons", "मॉड्यूल"],
            ["Practice & Quiz", "Assessment", "आकलन"]
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
        <div className="absolute -bottom-5 -left-4 hidden items-center gap-2.5 rounded-2xl border border-[#FFD166]/25 bg-[#001529] px-4 py-3 shadow-2xl sm:flex">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD166] to-[#FF6600] text-[#142b45]">📘</span>
          <span className="leading-tight"><span className="block text-xs font-bold text-white">Structured Courses</span><span className="block text-[10px] text-white/55">Modules → Lessons → Quiz</span></span>
        </div>
      </div>
    </div>
  </section>;
}

export function LearningHubDashboard({
  progressSummary, categories = [], knowledgeWorldSubjects = [],
  onStart, onOpenSubject, onExplore, onKnowledge, onContinue, onCategory, cardProgress
}) {
  const inProgress = progressSummary?.inProgress || [];

  // "Recommended" prefers genuinely in-progress courses the learner has not just
  // opened, and falls back to featured flagship courses for a first-time learner.
  const featuredIds = [
    "primary-education-प्राथमिक-शिक्षा",
    "computer-education-कंप्यूटर-शिक्षा",
    "english-from-basics-मूल-अंग्रेज़ी",
    "health-well-being-स्वास्थ्य-एवं-कल्याण"
  ];
  const recommended = inProgress.slice(1, 5);
  const featured = recommended.length ? [] : featuredIds
    .map((id) => (knowledgeWorldSubjects || []).concat(categories.flatMap((c) => c.subjects || [])).find((s) => s && s.id === id))
    .filter(Boolean);
  const recommendedItems = recommended.length
    ? recommended
    : featured.map((s) => ({ subject: s, percent: cardProgress ? cardProgress(s) : 0 }));

  return <>
    {/* Learning Areas */}
    <section className="mt-14">
      <SectionTitle icon={<FaLayerGroup aria-hidden="true" />} eyebrow="Learning Areas / सीखने के क्षेत्र"
        title={`${categories.length} Learning Areas`}
        subtitle="हर area एक व्यवस्थित समूह है — पहले area चुनें, फिर उसके subjects। एक साथ सभी subjects की भीड़ नहीं।"
        action={<button type="button" onClick={onExplore} className="self-start rounded-full border border-[#FF6600]/30 px-4 py-2 text-xs font-bold text-[#c2410c] transition hover:bg-[#FFF3D6]">View all subjects →</button>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c) => <button key={c.name} type="button" onClick={() => onCategory && onCategory(c.name)}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EADFCC] bg-white text-left shadow-[0_16px_40px_-34px_rgba(20,43,69,0.6)] transition duration-300 hover:-translate-y-1.5 hover:border-[#FF6600]/45 hover:shadow-[0_30px_60px_-38px_rgba(20,43,69,0.7)]">
          <span className="ssf-shine relative block h-36 w-full overflow-hidden">
            <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-t from-[#001529]/90 via-[#001529]/25 to-transparent" />
            <span className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#FFD166]/40 bg-[#001529]/70 text-lg text-[#FFD166] shadow-lg backdrop-blur">
              <c.icon aria-hidden="true" />
            </span>
            <span className="absolute bottom-3 right-4 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">{c.count} subjects</span>
          </span>
          <span className="flex flex-1 flex-col p-5">
            <span className="font-serif text-base font-bold leading-snug text-[#142b45]">{c.name}</span>
            <span className="mt-2 text-xs font-semibold text-[#8a97a5]">{c.count} subjects / विषय</span>
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-bold text-[#FF6600]">Explore <FaArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" /></span>
          </span>
        </button>)}
      </div>
    </section>

    {/* Continue Learning */}
    {inProgress.length > 0 && <section className="mt-14">
      <SectionTitle icon={<FaPlayCircle aria-hidden="true" />} eyebrow="Continue Learning / सीखना जारी रखें"
        title="आपकी चालू courses" subtitle="जहाँ छोड़ा था, वहीं से आगे बढ़ें।" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {inProgress.slice(0, 4).map((item) => <button key={item.subject.id} type="button" onClick={() => onOpenSubject(item.subject)}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EADFCC] bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#FF6600]/45 hover:shadow-lg">
          <span className="relative block h-28 w-full overflow-hidden">
            <img src={item.subject.image} alt={item.subject.en} loading="lazy" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-t from-[#001529]/85 to-transparent" />
            <span className="absolute bottom-2 left-3 font-serif text-sm font-bold text-white">{item.subject.en}</span>
          </span>
          <span className="flex flex-1 flex-col p-4">
            <span className="text-[11px] font-semibold text-[#8a97a5]">{item.subject.hi}</span>
            <span className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F5E6CE]"><span className="block h-full rounded-full bg-gradient-to-r from-[#FF6600] to-[#FFD166]" style={{ width: item.percent + "%" }} /></span>
            <span className="mt-2 text-[11px] font-bold text-[#FF6600]">{item.percent}% • Resume →</span>
          </span>
        </button>)}
      </div>
    </section>}

    {/* Recommended Learning */}
    {(recommended.length > 0 || featured.length > 0) && <section className="mt-14">
      <SectionTitle icon={<FaGraduationCap aria-hidden="true" />} eyebrow="Recommended Learning / सुझाए गए"
        title={recommended.length ? "आपके लिए recommended" : "शुरुआत के लिए recommended"}
        subtitle={recommended.length ? "आपकी progress के आधार पर अगले courses।" : "नए learners के लिए चुने हुए structured courses।"}
        action={<button type="button" onClick={onExplore} className="self-start rounded-full border border-[#FF6600]/30 px-4 py-2 text-xs font-bold text-[#c2410c] transition hover:bg-[#FFF3D6]">View all →</button>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(recommendedItems).map((item) => <button key={item.subject.id} type="button" onClick={() => onOpenSubject(item.subject)}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EADFCC] bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#FF6600]/45 hover:shadow-lg">
          <span className="relative block h-28 w-full overflow-hidden">
            <img src={item.subject.image} alt={item.subject.en} loading="lazy" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-t from-[#001529]/85 to-transparent" />
            <span className="absolute bottom-2 left-3 font-serif text-sm font-bold text-white">{item.subject.en}</span>
          </span>
          <span className="flex flex-1 flex-col p-4">
            <span className="text-[11px] font-semibold text-[#8a97a5]">{item.subject.hi}</span>
            <span className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F5E6CE]"><span className="block h-full rounded-full bg-gradient-to-r from-[#FF6600] to-[#FFD166]" style={{ width: Math.max(item.percent || 0, 2) + "%" }} /></span>
            <span className="mt-2 text-[11px] font-bold text-[#FF6600]">{item.percent > 0 ? item.percent + "% • Resume →" : "Start Learning →"}</span>
          </span>
        </button>)}
      </div>
    </section>}

    {/* Explore Subjects CTA */}
    <section className="mt-14">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#FFD166]/25 bg-gradient-to-br from-[#0b3a63] to-[#001529] p-7 text-white shadow-[0_36px_80px_-46px_rgba(13,36,59,0.95)] md:p-10">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(circle at 88% 15%, rgba(184,144,63,0.25), transparent 42%)" }} />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD166]/30 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD166]"><FaBookOpen /> Explore Subjects</div>
            <h2 className="mt-4 font-serif text-2xl font-bold md:text-3xl">अपने subject खोजें और structured course शुरू करें</h2>
            <p className="mt-2 text-sm leading-7 text-white/75">Learning Area या search से subject चुनें — course overview, modules, lessons, practice और quiz के साथ।</p>
          </div>
          <button type="button" onClick={onExplore} className="shrink-0 rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] px-6 py-3.5 text-sm font-bold text-[#142b45] shadow-lg transition hover:brightness-110">Explore Subjects →</button>
        </div>
      </div>
    </section>

    {/* Knowledge World */}
    <section className="mt-14">
      <SectionTitle icon={<FaGlobe aria-hidden="true" />} eyebrow="Knowledge World / ज्ञान संसार"
        title="दुनिया को जानिए। ज्ञान बढ़ाइए।"
        subtitle="समय, प्रकृति, विज्ञान, भारत और विश्व — topic-wise factual learning, आसान भाषा और उदाहरणों के साथ।"
        action={<button type="button" onClick={onKnowledge} className="self-start rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] px-4 py-2.5 text-xs font-bold text-[#142b45] shadow-md transition hover:brightness-110">Explore Knowledge World →</button>} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {knowledgeWorldSubjects.slice(0, 6).map((s) => <button key={s.id} type="button" onClick={() => onOpenSubject(s)}
          className="group flex items-center gap-3 rounded-2xl border border-[#EADFCC] bg-white p-2.5 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#FF6600]/45 hover:shadow-md">
          <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <img src={s.image} alt={s.en} loading="lazy" className="h-full w-full object-cover" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-serif text-sm font-bold text-[#142b45]">{s.en}</span>
            <span className="block truncate text-[11px] font-semibold text-[#8a97a5]">{s.hi}</span>
          </span>
          <span className="shrink-0 text-sm font-bold text-[#FF6600] transition group-hover:translate-x-1">→</span>
        </button>)}
      </div>
    </section>

    {/* Learning path */}
    <section className="mt-14">
      <div className="ssf-panel">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF6600]"><FaGraduationCap aria-hidden="true" /> Learning Path / सीखने का रास्ता</div>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[#142b45] md:text-3xl">Learn → Practise → Assess → Complete</h2>
            <p className="mt-2 text-sm text-[#5b6b7c]">हर subject को छोटे, स्पष्ट steps में पूरा करें और achievement unlock करें।</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[[FaBookOpen, "Learn", "सीखें"], [FaPlayCircle, "Practise", "अभ्यास"], [FaCheckCircle, "Assess", "आकलन"], [FaGraduationCap, "Certificate", "प्रमाणपत्र"]].map(([Icon, en, hi]) =>
              <div key={en} className="rounded-xl border border-[#EADFCC] bg-white px-4 py-3 text-center shadow-sm"><Icon className="mx-auto text-lg text-[#FF6600]" aria-hidden="true" /><div className="mt-1.5 text-xs font-bold text-[#142b45]">{en}</div><div className="text-[10px] text-[#8a97a5]">{hi}</div></div>)}
          </div>
        </div>
      </div>
    </section>
  </>;
}
