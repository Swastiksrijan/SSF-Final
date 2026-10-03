import { IllustrationAlphabet, IllustrationStory, IllustrationSounds } from "./LearningIllustrations";

const speak = (text) => {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF]/gu, ""));
    u.lang = /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-IN";
    u.rate = 0.82;
    window.speechSynthesis.speak(u);
  } catch {}
};

function Card({ tone = "sky", icon, title, subtitle, children }) {
  const tones = {
    sky: ["border-[#cfe3ef] from-[#f2f9ff]", "from-[#0b4a86] to-[#0c7a86]", "bg-[#e8f4fa] text-[#0b4a86]", "text-[#083a68]"],
    purple: ["border-[#e0d5ff] from-[#f8f5ff]", "from-[#5b21b6] to-[#7c3aed]", "bg-[#efe8ff] text-[#5b21b6]", "text-[#4a1d96]"],
    green: ["border-[#d3e8db] from-[#f2fdf6]", "from-[#14663b] to-[#2f9e63]", "bg-[#e4f7ec] text-[#14663b]", "text-[#0f5130]"],
    amber: ["border-[#efdcc0] from-[#fffaf0]", "from-[#b45309] to-[#f59e0b]", "bg-[#fdf0dc] text-[#92400e]", "text-[#7a3a06]"],
    rose: ["border-[#f2d6dd] from-[#fff5f7]", "from-[#9d174d] to-[#db2777]", "bg-[#fce8ee] text-[#9d174d]", "text-[#831843]"]
  };
  const t = tones[tone] || tones.sky;
  return <section className={`relative overflow-hidden rounded-[1.8rem] border-2 p-5 shadow-[0_10px_30px_-18px_rgba(11,46,89,0.45)] md:p-7 bg-gradient-to-br to-white ${t[0]}`}>
    <span className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${t[1]}`} />
    <div className="flex items-center gap-3">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm ${t[2]}`}>{icon}</span>
      <div><h3 className={`text-lg font-black md:text-xl ${t[3]}`}>{title}</h3>{subtitle && <p className="text-xs font-bold text-zinc-500">{subtitle}</p>}</div>
    </div>
    <div className="mt-4">{children}</div>
  </section>;
}

function Bullets({ items, tone = "text-zinc-700", mark = "•" }) {
  return <ul className="space-y-2">{(items || []).map((x, i) => <li key={i} className={`flex items-start gap-2 text-sm leading-7 ${tone}`}><span className="mt-0.5 shrink-0 font-black text-[#0b4a86]">{mark}</span><span>{x}</span></li>)}</ul>;
}


export default function PrimaryLessonFresh({ lessonLabel, moduleTitle, content, check, nextLessonTitle, onNextLesson, onMarkDone }) {
  const c = content || {};
  const goals = c.objectives || [];
  const examples = c.examples || [];
  const practice = c.practice || [];
  const mistakes = c.mistakes || [];
  const knowledge = (check || []).slice(0, 3);

  const isLettersy = /letters|sounds|अक्षर|ध्वनि|alphabet|वर्णमाला/i.test(lessonLabel || "");
  const isNumbery = /number|counting|संख्या|गिनती|जोड़|घटाव|गुणा|भाग|भिन्न|मापन|मुद्रा|समय/i.test(lessonLabel || "");
  const Art = isNumbery ? IllustrationSounds : isLettersy ? IllustrationAlphabet : IllustrationStory;

  return <div className="min-h-screen bg-[#f4f7fb] font-inria text-zinc-900">
    <section className="relative overflow-hidden bg-gradient-to-br from-[#062a52] via-[#0b4a86] to-[#0c7a86]">
      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-28 text-white md:pt-36">
        <a href="/LearningHub" className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/20">← Back to Learning Hub / वापस</a>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] backdrop-blur">🎓 Course 01 • Primary Education</div>
        <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{lessonLabel}</h1>
        {moduleTitle && <p className="mt-2 text-sm font-bold text-white/80">{moduleTitle}</p>}
        {c.body && <p className="mt-4 max-w-3xl text-base leading-8 text-white/90">{c.body}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => speak([lessonLabel, c.body, ...examples, ...practice].join(". "))} className="rounded-2xl bg-[#ffd166] px-6 py-3 text-sm font-black text-[#062a52] shadow-lg transition hover:bg-[#ffdf8c]">🔊 Listen / सुनें</button>
          {onNextLesson && <button type="button" onClick={onNextLesson} className="rounded-2xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/20">Next: {nextLessonTitle} →</button>}
        </div>
      </div>
    </section>

    <main className="mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card icon="📖" title="सीखें / Understand" subtitle="आसान भाषा में" tone="sky">
          {c.deep && <p className="text-sm leading-7 text-zinc-700">{c.deep}</p>}
          {goals.length > 0 && <div className="mt-4"><div className="text-xs font-black uppercase tracking-widest text-[#0b4a86]">उद्देश्य / Goals</div><div className="mt-2"><Bullets items={goals} mark="✅" /></div></div>}
        </Card>
        <div className="overflow-hidden rounded-[1.8rem] border border-zinc-200 bg-white shadow-sm">
          <div className="h-44 w-full"><Art /></div>
          <div className="p-4"><div className="text-xs font-black uppercase tracking-widest text-[#0b4a86]">Visual / चित्र</div><p className="mt-1 text-sm text-zinc-600">चित्र देखकर concept को पहचानें।</p></div>
        </div>
      </div>

      {examples.length > 0 && <Card icon="👀" title="उदाहरण / Examples" subtitle="देखो और समझो" tone="amber"><div className="grid gap-3 sm:grid-cols-2">{examples.map((e, i) => <div key={i} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm"><span className="flex-1 text-sm font-bold text-zinc-700">{e}</span><button type="button" onClick={() => speak(e)} className="rounded-full bg-[#003366] px-3 py-1.5 text-xs font-black text-white">🔊</button></div>)}</div></Card>}

      <div className="grid gap-6 lg:grid-cols-2">
        {practice.length > 0 && <Card icon="✍️" title="अभ्यास / Practice" subtitle="खुद करके सीखो" tone="green"><Bullets items={practice} mark="👉" /></Card>}
        {mistakes.length > 0 && <Card icon="⚠️" title="सावधानियाँ / Watch out" subtitle="इन गलतियों से बचें" tone="rose"><Bullets items={mistakes} mark="✖" /></Card>}
      </div>

      {c.activity && <Card icon="🎯" title="गतिविधि / Activity" subtitle="करके सीखो" tone="purple"><p className="text-sm leading-7 text-zinc-700">{c.activity}</p></Card>}

      {c.summary && <div className="rounded-2xl border border-[#d3e8db] bg-gradient-to-r from-[#f2fdf6] to-white p-5 shadow-sm"><div className="text-xs font-black uppercase tracking-widest text-[#14663b]">सार / Summary</div><p className="mt-1 text-sm font-bold text-zinc-700">📌 {c.summary}</p></div>}

      {knowledge.length > 0 && <Card icon="🧠" title="Knowledge Check" subtitle="छोटा स्व-मूल्यांकन" tone="sky">
        <div className="space-y-3">{knowledge.map((q, i) => <div key={i} className="rounded-2xl bg-white p-4 shadow-sm"><div className="text-sm font-black text-zinc-800">{i + 1}. {q.question}</div><div className="mt-2 flex flex-wrap gap-2">{(q.options || []).map((o, oi) => <span key={oi} className={"rounded-xl px-3 py-2 text-xs font-black " + (oi === q.answer ? "bg-[#e4f7ec] text-[#14663b]" : "bg-zinc-50 text-zinc-600")}>{oi === q.answer ? "✅ " : ""}{o}</span>)}</div></div>)}</div>
      </Card>}

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button type="button" onClick={() => speak([lessonLabel, c.summary].join(". "))} className="rounded-2xl border-2 border-[#0b4a86] px-5 py-3 text-sm font-black text-[#0b4a86] transition hover:bg-[#eef7ff]">🔊 दोहराएँ</button>
        {onMarkDone && <button type="button" onClick={onMarkDone} className="rounded-2xl bg-[#177245] px-5 py-3 text-sm font-black text-white transition hover:bg-[#14663b]">✅ Mark Complete</button>}
        {onNextLesson && <button type="button" onClick={onNextLesson} className="rounded-2xl bg-[#0b4a86] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0f4c81]">Next: {nextLessonTitle} →</button>}
      </div>
    </main>
  </div>;
}
