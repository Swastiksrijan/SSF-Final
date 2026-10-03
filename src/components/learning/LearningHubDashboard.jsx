import { FaArrowRight, FaBookOpen, FaPlayCircle, FaGlobe, FaGraduationCap, FaCheckCircle, FaLayerGroup } from "react-icons/fa";

const SectionTitle = ({ icon, eyebrow, title, subtitle, action }) => (
  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div>
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0f4c81]">
        {icon} {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl font-black text-[#062a52] md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export function LearningHubLanding({ onStart, onExplore, onContinue, onOpenSubject, onOpenKnowledge, progressSummary, totalSubjects, totalAreas }) {
  const active = progressSummary?.active;
  return <section className="relative overflow-hidden bg-[#002344] text-white">
    <div className="absolute inset-0 bg-gradient-to-br from-[#001426] via-[#003b63] to-[#007c91]" />
    <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10 bg-white/5" />
    <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full border border-white/10 bg-white/5" />
    <div className="absolute right-1/4 top-1/3 hidden h-40 w-40 rounded-full bg-[#ffd166]/10 blur-2xl md:block" />
    <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest">🎓 SSF Learning Hub</div>
        <h1 className="mt-5 text-4xl font-black leading-[1.08] md:text-6xl">Welcome to SSF Learning Hub</h1>
        <div className="mt-3 text-lg font-bold text-[#ffd166] md:text-2xl">ज्ञान से कौशल तक • From Knowledge to Capability</div>
        <p className="mt-5 text-xl font-black text-white md:text-2xl">सीखिए। अभ्यास कीजिए। आगे बढ़िए।</p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 md:text-base">एक structured digital learning space — हर subject को Learning Area → Subjects → Course → Modules → Lessons के स्पष्ट क्रम में सीखें, practice करें और अपनी गति से आगे बढ़ें।</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={onStart} className="inline-flex items-center gap-2 rounded-2xl bg-[#ffd166] px-6 py-3.5 text-sm font-black text-[#062a52] shadow-lg transition hover:bg-[#ffdf8c]">
            🚀 Start Learning
          </button>
          <button type="button" onClick={onExplore} className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20">
            <FaBookOpen aria-hidden="true" /> Explore Subjects
          </button>
          <button type="button" onClick={onContinue} className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20">
            <FaPlayCircle aria-hidden="true" /> Continue Learning
          </button>
        </div>
      </div>

      {active && <button type="button" onClick={() => onOpenSubject(active.subject)} className="mt-8 flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/15">
        <span className="min-w-0">
          <span className="block text-[10px] font-black uppercase tracking-widest text-[#ffd166]">Continue where you left off</span>
          <span className="mt-1 block truncate text-base font-black">{active.subject.en}</span>
          <span className="mt-2 block h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/15"><span className="block h-full rounded-full bg-[#ffd166]" style={{ width: active.percent + "%" }} /></span>
        </span>
        <span className="shrink-0 text-sm font-black text-white/90">{active.percent}% <FaArrowRight className="ml-1 inline" /></span>
      </button>}

      <div className="mt-10 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
        {[
          [totalSubjects ?? 132, "Subjects", "विषय"],
          [totalAreas ?? 17, "Learning Areas", "क्षेत्र"],
          ["Structured", "Modules & Lessons", "मॉड्यूल"],
          ["Practice & Quiz", "Assessment", "आकलन"]
        ].map(([value, en, hi]) => <div key={en} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
          <div className="text-2xl font-black text-white">{value}</div>
          <div className="mt-1 text-xs font-bold text-white/70">{en} / {hi}</div>
        </div>)}
      </div>
    </div>
  </section>;
}

export function LearningHubDashboard({
  progressSummary, categories = [], knowledgeWorldSubjects = [],
  onStart, onOpenSubject, onExplore, onKnowledge, onContinue, onCategory, cardProgress
}) {
  const active = progressSummary?.active;
  const inProgress = progressSummary?.inProgress || [];
  const completedCount = progressSummary?.completedCount || 0;

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
    {/* Start Here */}
    <section className="mt-10">
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">📚 Start Here / यहाँ से शुरू करें</div>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">अपनी Learning Journey चुनिए</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">Learning Area चुनें → subject देखें → course overview → modules → lessons → practice → quiz. हर step स्पष्ट और क्रमबद्ध है।</p>
          </div>
          <button type="button" onClick={onExplore} className="self-start rounded-2xl bg-[#003366] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0f4c81]">Explore Subjects →</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-[#d9e7f0] bg-gradient-to-br from-[#eef7fb] to-white p-5">
            <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">{active ? "Continue Learning" : "Recommended first step"}</div>
            <div className="mt-2 text-lg font-black text-[#062a52]">{active ? active.subject.en : "Primary Education"}</div>
            <div className="text-sm font-bold text-zinc-500">{active ? active.subject.hi : "प्राथमिक शिक्षा — letters, sounds, numbers, reading and writing"}</div>
            {active && <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-gradient-to-r from-[#0f4c81] to-[#0a9396]" style={{ width: active.percent + "%" }} /></div>}
            {active && <div className="mt-2 flex items-center justify-between text-xs font-black text-[#0f4c81]"><span>{active.percent}% Complete</span><span>In progress</span></div>}
            <button type="button" onClick={() => active ? onOpenSubject(active.subject) : onStart()} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#003366] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0f4c81]">
              {active ? "Continue" : "Start Learning"} <FaArrowRight aria-hidden="true" />
            </button>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Your snapshot / आपकी प्रगति</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-zinc-50 p-3 text-center"><div className="text-2xl font-black text-[#062a52]">{inProgress.length}</div><div className="text-[10px] font-bold text-zinc-500">In progress</div></div>
              <div className="rounded-xl bg-zinc-50 p-3 text-center"><div className="text-2xl font-black text-[#062a52]">{completedCount}</div><div className="text-[10px] font-bold text-zinc-500">Completed</div></div>
            </div>
            <button type="button" onClick={onKnowledge} className="mt-3 w-full rounded-2xl border border-[#1d3557]/20 bg-[#eef7fb] px-4 py-3 text-sm font-black text-[#1d3557] transition hover:bg-[#dceff7]">🌍 Explore Knowledge World</button>
          </div>
        </div>
      </div>
    </section>

    {/* Learning Areas */}
    <section className="mt-12">
      <SectionTitle icon={<FaLayerGroup aria-hidden="true" />} eyebrow="Learning Areas / सीखने के क्षेत्र"
        title={`${categories.length} Learning Areas`}
        subtitle="हर area एक व्यवस्थित समूह है — पहले area चुनें, फिर उसके subjects। एक साथ सभी subjects की भीड़ नहीं।"
        action={<button type="button" onClick={onExplore} className="self-start text-xs font-black text-[#0f4c81] hover:underline">View all subjects →</button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c) => <button key={c.name} type="button" onClick={() => onCategory && onCategory(c.name)}
          className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#0f4c81]/30 hover:shadow-lg">
          <span className={"flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-xl text-white shadow-sm " + (c.color || "from-[#003366] to-[#0f4c81]")}>
            <c.icon aria-hidden="true" />
          </span>
          <span className="mt-4 text-sm font-black leading-snug text-[#062a52]">{c.name}</span>
          <span className="mt-2 text-xs font-bold text-zinc-500">{c.count} subjects / विषय</span>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#0f4c81]">Explore <FaArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" /></span>
        </button>)}
      </div>
    </section>

    {/* Continue Learning */}
    {inProgress.length > 0 && <section className="mt-12">
      <SectionTitle icon={<FaPlayCircle aria-hidden="true" />} eyebrow="Continue Learning / सीखना जारी रखें"
        title="आपकी चालू courses" subtitle="जहाँ छोड़ा था, वहीं से आगे बढ़ें।" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {inProgress.slice(0, 4).map((item) => <button key={item.subject.id} type="button" onClick={() => onOpenSubject(item.subject)}
          className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#003366] to-[#0f4c81] text-xl text-white">📘</span>
          <span className="mt-3 text-sm font-black text-[#062a52]">{item.subject.en}</span>
          <span className="text-[11px] font-bold text-zinc-500">{item.subject.hi}</span>
          <span className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100"><span className="block h-full rounded-full bg-gradient-to-r from-[#0f4c81] to-[#0a9396]" style={{ width: item.percent + "%" }} /></span>
          <span className="mt-2 text-[11px] font-black text-[#0f4c81]">{item.percent}% • Resume →</span>
        </button>)}
      </div>
    </section>}

    {/* Recommended Learning */}
    {(recommended.length > 0 || featured.length > 0) && <section className="mt-12">
      <SectionTitle icon={<FaGraduationCap aria-hidden="true" />} eyebrow="Recommended Learning / सुझाए गए"
        title={recommended.length ? "आपके लिए recommended" : "शुरुआत के लिए recommended"}
        subtitle={recommended.length ? "आपकी progress के आधार पर अगले courses।" : "नए learners के लिए चुने हुए structured courses।"}
        action={<button type="button" onClick={onExplore} className="self-start text-xs font-black text-[#0f4c81] hover:underline">View all →</button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(recommendedItems).map((item) => <button key={item.subject.id} type="button" onClick={() => onOpenSubject(item.subject)}
          className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d3557] to-[#457b9d] text-xl text-white">🎓</span>
          <span className="mt-3 text-sm font-black text-[#062a52]">{item.subject.en}</span>
          <span className="text-[11px] font-bold text-zinc-500">{item.subject.hi}</span>
          <span className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100"><span className="block h-full rounded-full bg-gradient-to-r from-[#0f4c81] to-[#0a9396]" style={{ width: Math.max(item.percent || 0, 2) + "%" }} /></span>
          <span className="mt-2 text-[11px] font-black text-[#0f4c81]">{item.percent > 0 ? item.percent + "% • Resume →" : "Start Learning →"}</span>
        </button>)}
      </div>
    </section>}

    {/* Explore Subjects CTA */}
    <section className="mt-12">
      <div className="overflow-hidden rounded-[2rem] border border-[#cfe6ef] bg-gradient-to-br from-[#1d3557] to-[#457b9d] p-6 text-white shadow-sm md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest"><FaBookOpen /> Explore Subjects</div>
            <h2 className="mt-3 text-2xl font-black md:text-3xl">अपने subject खोजें और structured course शुरू करें</h2>
            <p className="mt-2 text-sm leading-6 text-white/80">Learning Area या search से subject चुनें — course overview, modules, lessons, practice और quiz के साथ।</p>
          </div>
          <button type="button" onClick={onExplore} className="shrink-0 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#1d3557] shadow-md transition hover:bg-white/90">Explore Subjects →</button>
        </div>
      </div>
    </section>

    {/* Knowledge World */}
    <section className="mt-12">
      <SectionTitle icon={<FaGlobe aria-hidden="true" />} eyebrow="Knowledge World / ज्ञान संसार"
        title="दुनिया को जानिए। ज्ञान बढ़ाइए।"
        subtitle="समय, प्रकृति, विज्ञान, भारत और विश्व — topic-wise factual learning, आसान भाषा और उदाहरणों के साथ।"
        action={<button type="button" onClick={onKnowledge} className="self-start rounded-2xl bg-[#1d3557] px-4 py-2.5 text-xs font-black text-white hover:bg-[#0f4c81]">Explore Knowledge World →</button>} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {knowledgeWorldSubjects.slice(0, 6).map((s) => <button key={s.id} type="button" onClick={() => onOpenSubject(s)}
          className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="min-w-0"><span className="block truncate text-sm font-black text-[#062a52]">{s.en}</span><span className="block truncate text-[11px] text-zinc-500">{s.hi}</span></span>
          <span className="shrink-0 text-sm font-black text-[#0f4c81]">→</span>
        </button>)}
      </div>
    </section>

    {/* Learning path */}
    <section className="mt-12">
      <div className="rounded-[2rem] border border-[#d9e7f0] bg-gradient-to-r from-white to-[#eef7fb] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0f4c81]"><FaGraduationCap aria-hidden="true" /> Learning Path / सीखने का रास्ता</div>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Learn → Practise → Assess → Complete</h2>
            <p className="mt-2 text-sm text-zinc-600">हर subject को छोटे, स्पष्ट steps में पूरा करें और achievement unlock करें।</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[[FaBookOpen, "Learn", "सीखें"], [FaPlayCircle, "Practise", "अभ्यास"], [FaCheckCircle, "Assess", "आकलन"], [FaGraduationCap, "Certificate", "प्रमाणपत्र"]].map(([Icon, en, hi]) =>
              <div key={en} className="rounded-xl bg-white px-4 py-3 text-center shadow-sm"><Icon className="mx-auto text-lg text-[#003366]" aria-hidden="true" /><div className="mt-1 text-xs font-black">{en}</div><div className="text-[10px] text-zinc-500">{hi}</div></div>)}
          </div>
        </div>
      </div>
    </section>
  </>;
}
