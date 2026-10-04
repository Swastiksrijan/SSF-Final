import { useEffect, useMemo, useRef, useState } from "react";
import { readMigratedProgress } from "../../data/courseProgress";
import ssfLogo from "../../assets/new-logo.png";

const stripEmoji = (s) => String(s).replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u2190-\u21FF\u2B00-\u2BFF]/gu, "").trim();

/** Read a whole chapter aloud (Hindi/English) via the browser's speech engine. */
function chapterNarration(chapter) {
  const parts = [chapter.title, chapter.titleHi];
  for (const b of chapter.blocks) {
    if (b.x) parts.push(b.x);
    if (b.head) parts.push(b.head.join(", "));
    if (b.items) parts.push(b.items.map((it) => typeof it === "string" ? it : [it.w, it.c].filter(Boolean).join(". ")).join(". "));
    if (b.rows) parts.push(b.rows.map((r) => r.join(", ")).join(". "));
    if (b.steps) parts.push(b.steps.join(". "));
  }
  return parts.filter(Boolean).join(". ");
}

function useSpeaker() {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch {} }, []);
  const toggle = (text) => {
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      if (speaking) { setSpeaking(false); return; }
      const u = new SpeechSynthesisUtterance(stripEmoji(text));
      u.lang = /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-IN";
      u.rate = 0.85;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    } catch { setSpeaking(false); }
  };
  return { speaking, toggle };
}

const NOTE_STYLE = {
  goal: { box: "border-emerald-200 bg-emerald-50", label: "text-emerald-700", icon: "🎯", def: "Learning Goal / लक्ष्य" },
  concept: { box: "border-sky-200 bg-sky-50", label: "text-sky-700", icon: "🧠", def: "Concept / समझो" },
  observe: { box: "border-indigo-200 bg-indigo-50", label: "text-indigo-700", icon: "👀", def: "Observe / देखो" },
  tip: { box: "border-amber-200 bg-amber-50", label: "text-amber-700", icon: "💡", def: "Teacher Tip / सुझाव" },
  mistake: { box: "border-rose-200 bg-rose-50", label: "text-rose-700", icon: "⚠️", def: "Common Mistake / गलती" },
  remember: { box: "border-[#f0d69b] bg-[#fff8e8]", label: "text-[#a86a00]", icon: "⭐", def: "Remember / याद रखो" },
  real: { box: "border-teal-200 bg-teal-50", label: "text-teal-700", icon: "🏠", def: "Real Life / वास्तविक जीवन" },
  career: { box: "border-violet-200 bg-violet-50", label: "text-violet-700", icon: "💼", def: "Career / करियर" },
  info: { box: "border-zinc-200 bg-zinc-50", label: "text-zinc-600", icon: "ℹ️", def: "Info / जानकारी" },
  warn: { box: "border-orange-200 bg-orange-50", label: "text-orange-700", icon: "🔔", def: "Note / ध्यान दो" },
};

function Note({ b }) {
  const s = NOTE_STYLE[b.k] || NOTE_STYLE.info;
  const title = b.title || "";
  // Titles often carry their own emoji already; only add the semantic icon when
  // the title is plain text (or absent), else it would render doubled.
  const lead = title && /^[^\p{L}\p{N}]/u.test(title) ? title : (s.icon + " " + (title || s.def));
  return <div className={"rounded-2xl border p-4 md:p-6 " + s.box}>
    <div className={"flex items-center gap-2 text-xs font-black uppercase tracking-widest md:text-sm " + s.label}>{lead}</div>
    {b.x && <p className="mt-2 text-base leading-8 text-zinc-700 md:text-lg md:leading-9">{b.x}</p>}
    {b.items && <ul className="mt-2 space-y-1.5 pl-1 text-base leading-8 text-zinc-700 md:text-lg">{b.items.map((it, i) => <li key={i} className="flex gap-3"><span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-current opacity-60" aria-hidden="true" /><span>{it}</span></li>)}</ul>}
  </div>;
}

function Block({ b }) {
  if (!b) return null;
  switch (b.t) {
    case "h":
      return <h4 className="mt-3 flex items-center gap-3 text-xl font-black leading-snug text-[#062a52] md:text-2xl">
        <span className="h-6 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-[#FF6600] to-[#FFD166]" aria-hidden="true" />
        {b.x}
      </h4>;
    case "p":
      return <p className="text-base leading-8 text-zinc-700 md:text-lg md:leading-9">{b.x}</p>;
    case "ul":
      return <ul className="space-y-2 pl-1 text-base leading-8 text-zinc-700 md:text-lg md:leading-9">{b.items.map((it, i) => <li key={i} className="flex gap-3"><span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#FF6600]" aria-hidden="true" /><span>{it}</span></li>)}</ul>;
    case "ol":
      return <ol className="space-y-2 pl-1 text-base leading-8 text-zinc-700 md:text-lg md:leading-9">{b.items.map((it, i) => <li key={i} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef4f9] text-sm font-black text-[#0b3a63]">{i + 1}</span><span className="pt-0.5">{it}</span></li>)}</ol>;
    case "flow":
      return <div className="space-y-2">{b.items.map((it, i) => <div key={i}>
        <div className="rounded-2xl border border-[#d9e4ee] bg-gradient-to-r from-[#f7fafd] to-white px-4 py-3 text-base font-bold text-[#0b3a63] md:text-lg">{it}</div>
        {i < b.items.length - 1 && <div className="py-0.5 text-center text-2xl font-black text-[#FF6600]" aria-hidden="true">↓</div>}
      </div>)}</div>;
    case "table":
      return <div className="overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="w-full min-w-[22rem] border-collapse text-left text-[15px] md:text-base">
          {b.head && <thead className="bg-[#0b3a63] text-white"><tr>{b.head.map((h, i) => <th key={i} className="px-4 py-3 text-xs font-black uppercase tracking-wide md:text-sm">{h}</th>)}</tr></thead>}
          <tbody>{b.rows.map((row, r) => <tr key={r} className={r % 2 ? "bg-[#fbfdff]" : "bg-white"}>
            {row.map((cell, c) => <td key={c} className="border-t border-zinc-100 px-4 py-3 leading-7 text-zinc-700">{cell}</td>)}
          </tr>)}</tbody>
        </table>
      </div>;
    case "note":
      return <Note b={b} />;
    case "ex":
      return <div className="rounded-2xl border border-[#cfe0ee] bg-gradient-to-br from-[#f4f9fd] to-white p-4 md:p-6">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0b4a86] md:text-sm"><span aria-hidden="true">📖</span>{b.title || "Example"}</div>
        {b.x && <p className="mt-2 text-base font-bold leading-8 text-[#0b3a63] md:text-lg">{b.x}</p>}
        {b.steps && <ol className="mt-4 space-y-3">{b.steps.map((s, i) => <li key={i} className="flex gap-3 text-base leading-8 text-zinc-700 md:text-lg"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b3a63] text-sm font-black text-white">{i + 1}</span><span>{s}</span></li>)}</ol>}
      </div>;
    case "act":
      return <div className="rounded-2xl border border-[#d7ecdd] bg-gradient-to-br from-[#f4fdf7] to-white p-4 md:p-6">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#177245] md:text-sm"><span aria-hidden="true">🧩</span>Activity</div>
        <div className="mt-1 text-lg font-black text-[#14532d] md:text-xl">{b.title}</div>
        {b.x && <p className="mt-2 text-base leading-8 text-zinc-700 md:text-lg">{b.x}</p>}
        {b.items && <ul className="mt-3 space-y-2 pl-1 text-base leading-8 text-zinc-700 md:text-lg">{b.items.map((it, i) => <li key={i} className="flex gap-3"><span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#177245]" aria-hidden="true" /><span>{it}</span></li>)}</ul>}
      </div>;
    case "ch":
      return <div className="rounded-2xl border border-[#f2d59a] bg-gradient-to-br from-[#fffaf0] to-white p-4 md:p-6">
        <div className="text-lg font-black text-[#9a5b00] md:text-xl">{b.title}</div>
        {b.x && <p className="mt-2 text-base leading-8 text-zinc-700 md:text-lg">{b.x}</p>}
        {b.items && <ul className="mt-3 space-y-2 pl-1 text-base leading-8 text-zinc-700 md:text-lg">{b.items.map((it, i) => <li key={i} className="flex gap-3"><span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#f4a261]" aria-hidden="true" /><span>{it}</span></li>)}</ul>}
      </div>;
    case "mistakes":
      return <div className="grid gap-3 sm:grid-cols-2">{b.items.map((m, i) => <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-5">
        <div className="text-base font-bold text-rose-600 md:text-lg">❌ {m.w}</div>
        <div className="mt-2 text-base font-bold text-emerald-700 md:text-lg">✅ {m.c}</div>
      </div>)}</div>;
    case "img":
      return <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <img src={b.src} alt={b.alt || b.cap || "course illustration"} loading="lazy" className="h-auto w-full object-cover" />
        {b.cap && <figcaption className="px-4 py-3 text-sm font-bold text-zinc-600 md:text-base">{b.cap}</figcaption>}
      </figure>;
    default:
      return null;
  }
}

function Chapter({ chapter, index, total, done, onToggleDone, speaking, onSpeak, art }) {
  return <section id={"mc-" + chapter.id} className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
    {/* colourful chapter banner */}
    <div className="flex items-center gap-4 bg-gradient-to-r from-[#001529] via-[#0b3a63] to-[#0b3a63] p-5 md:p-6">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/15 md:h-24 md:w-24" aria-hidden="true">{art(chapter.id)}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FFD166] md:text-xs">{chapter.moduleIcon} {chapter.moduleTitle} · Chapter {chapter.number}</div>
        <h3 className="mt-1 text-2xl font-black leading-tight text-white md:text-3xl">{chapter.title}</h3>
        <div className="mt-0.5 text-sm font-bold text-white/75 md:text-base">{chapter.titleHi}</div>
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-white/80">{index + 1}/{total}</span>
        <button type="button" onClick={() => onSpeak(chapterNarration(chapter))}
          className={"inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition " + (speaking ? "bg-[#FF6600] text-white" : "bg-[#FFD166] text-[#062a52] hover:bg-[#ffdf8c]")}
          aria-label={speaking ? "Stop audio" : "Listen to this chapter"}>
          {speaking ? "⏸ रोकें" : "🔊 सुनें"}
        </button>
      </div>
    </div>

    <div className="p-5 md:p-7">
      <div className="space-y-4">{chapter.blocks.map((b, i) => <Block key={i} b={b} />)}</div>
      <button type="button" onClick={() => onSpeak(chapterNarration(chapter))}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eef4f9] px-4 py-2 text-xs font-black text-[#0b3a63] sm:hidden">
        {speaking ? "⏸ रोकें / Stop" : "🔊 पूरा पाठ सुनें / Listen"}
      </button>
      <button type="button" onClick={() => onToggleDone(chapter.id)}
        className={"mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition " + (done ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] text-[#142b45] hover:brightness-110")}>
        {done ? "✅ Completed / पूरा हुआ" : "Mark as done / पूरा करें"}
      </button>
    </div>
  </section>;
}

function MasteryTest({ mastery }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = mastery.quiz.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const total = mastery.quiz.length;
  const answered = Object.keys(answers).length;
  const pct = total ? Math.min(100, Math.round((score / total) * 100)) : 0;

  return <section id="mc-mastery" className="scroll-mt-28 rounded-[2rem] border border-[#e6d3a8] bg-gradient-to-br from-[#fffaf0] to-white p-5 shadow-sm md:p-8">
    <div className="flex items-center gap-3">
      <span className="text-3xl" aria-hidden="true">🎓</span>
      <h3 className="text-2xl font-black text-[#062a52] md:text-3xl">{mastery.title}</h3>
    </div>
    <p className="mt-2 text-base leading-8 text-zinc-600 md:text-lg">{mastery.note}</p>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {mastery.tasks.map((t) => <div key={t.title} className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="text-base font-black text-[#0b3a63] md:text-lg"><span aria-hidden="true">{t.icon}</span> {t.title}</div>
        <p className="mt-1 text-sm leading-7 text-zinc-600 md:text-base">{t.x}</p>
      </div>)}
    </div>

    <div className="mt-7 space-y-4">
      {mastery.quiz.map((q, i) => <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-5">
        <div className="text-base font-black text-zinc-800 md:text-lg">{i + 1}. {q.q}</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {q.options.map((o, j) => {
            const chosen = answers[i] === j;
            const correct = submitted && j === q.answer;
            const wrong = submitted && chosen && j !== q.answer;
            return <label key={j} className={"flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-base transition md:text-lg " + (correct ? "border-emerald-300 bg-emerald-50 font-bold text-emerald-800" : wrong ? "border-rose-300 bg-rose-50 font-bold text-rose-700" : chosen ? "border-[#0b3a63] bg-[#eef4f9]" : "border-zinc-200 hover:bg-zinc-50")}>
              <input type="radio" name={"mc-q-" + i} checked={chosen} onChange={() => !submitted && setAnswers(a => ({ ...a, [i]: j }))} />
              <span>{o}</span>
            </label>;
          })}
        </div>
        {submitted && <div className="mt-2 text-sm leading-7 text-zinc-600 md:text-base"><strong className="text-[#0b3a63]">Explanation:</strong> {q.explain}</div>}
      </div>)}
    </div>

    <div className="mt-6 flex flex-wrap items-center gap-4">
      <button type="button" disabled={answered < total || submitted} onClick={() => setSubmitted(true)}
        className="rounded-2xl bg-gradient-to-br from-[#0b3a63] to-[#001529] px-6 py-3 text-sm font-black text-white disabled:opacity-40">Check Answers / उत्तर जाँचें</button>
      {submitted && <div className={"rounded-2xl px-5 py-3 text-sm font-black md:text-base " + (pct >= 80 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>Score: {score}/{total} ({pct}%) {pct >= 80 ? "· Mastered 🏆" : "· दोबारा पढ़ें"}</div>}
    </div>
  </section>;
}

/**
 * Generic renderer for the hand-authored "Master Courses". All content comes
 * from `course`; `art` maps a chapter id to its coded SVG illustration and
 * `HeroArt` is the header illustration. Progress uses the shared hub key.
 */
export default function MasterCourse({ course, subject, onBack, art, HeroArt }) {
  const chapters = useMemo(() => course.modules.flatMap((m) => m.chapters.map((c) => ({ ...c, moduleTitle: m.title, moduleIcon: m.icon }))), [course]);
  const total = chapters.length;
  const chapterIds = useMemo(() => chapters.map((c) => c.id), [chapters]);
  const progressKey = "ssf-learning-course-progress-" + subject.id;
  const [done, setDone] = useState(() => readMigratedProgress(subject, chapterIds));
  const topRef = useRef(null);

  useEffect(() => { try { localStorage.setItem(progressKey, JSON.stringify(done)); } catch {} }, [done, progressKey]);

  const completed = chapters.filter((c) => done.includes(c.id)).length;
  const pct = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  const toggleDone = (id) => setDone((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  const goTo = (id) => { try { document.getElementById("mc-" + id)?.scrollIntoView({ behavior: "smooth", block: "start" }); } catch {} };
  const { speaking, toggle: onSpeak } = useSpeaker();
  const [titleEn, titleHi] = course.meta.title || [course.meta.tag || "", ""];

  return <div className="min-h-screen bg-[#f4f7fb] font-inria text-zinc-900">
    {/* Brand strip — SSF logo + official line, kept on every Master Course */}
    <div className="bg-[#001529]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-28 pb-3 md:pt-32">
        <a href="/LearningHub" className="flex items-center gap-2.5">
          <img src={ssfLogo} alt="Swastik Srijan Foundation" className="h-11 w-11 object-contain drop-shadow md:h-12 md:w-12" />
          <span className="leading-none">
            <span className="block text-sm font-black text-white md:text-base">Swastik Srijan</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#FF6600] md:text-[10px]">Foundation</span>
          </span>
        </a>
        <span className="hidden text-right text-[11px] font-bold text-white/70 sm:block md:text-sm">
          SSF Learning Hub <span className="mx-1 text-[#FFD166]">•</span> Empowering Lives Since 2013
        </span>
      </div>
    </div>
    <section className="relative overflow-hidden bg-[#001529] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#001529] via-[#0b3a63] to-[#001529]" />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 md:pb-16 md:pt-10">
        <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/20">← Back to Learning Hub / वापस</button>
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD166]/30 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FFD166] backdrop-blur">{course.meta.icon} Knowledge World • Master Course</div>
            <h1 className="mt-5 text-4xl font-black leading-[1.1] md:text-6xl">{titleEn}<br /><span className="text-2xl text-white/90 md:text-4xl">{titleHi}</span></h1>
            <p className="mt-4 text-lg font-bold text-[#FFD166] md:text-xl">{course.meta.tagline}</p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">{course.meta.heroSubtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="rounded-2xl bg-[#FFD166] px-6 py-3 text-sm font-black text-[#062a52] shadow-lg transition hover:bg-[#ffdf8c]">▶ Start Learning / सीखना शुरू करें</button>
              <button type="button" onClick={() => onSpeak([course.meta.tagline, course.overview.what, course.overview.why, course.overview.outcome].join(". "))}
                className={"rounded-2xl border px-6 py-3 text-sm font-bold backdrop-blur transition " + (speaking ? "border-[#FF6600] bg-[#FF6600] text-white" : "border-white/20 bg-white/10 hover:bg-white/20")}>
                {speaking ? "⏸ रोकें / Stop" : "🔊 सुनें / Listen"}
              </button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm lg:max-w-none">{HeroArt && <HeroArt className="h-auto w-full drop-shadow-2xl" />}</div>
        </div>
      </div>
      <div className="relative border-t border-white/10 bg-[#062a52]/70 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-4 px-4 py-5 text-white md:grid-cols-4 md:py-6">
          {[[String(total), "Chapters"], [String(course.modules.length), "Modules"], [course.meta.level, "Level"], ["Self-paced", "Pace"]].map(([v, l]) => <div key={l} className="px-2 text-center md:px-4"><div className="text-2xl font-black md:text-3xl">{v}</div><div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/70">{l}</div></div>)}
        </div>
      </div>
    </section>

    {/* sticky progress + chapter nav */}
    <div className="sticky top-20 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur md:top-[116px]">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between text-[11px] font-black text-zinc-500"><span>{completed} / {total} chapters</span><span className="text-[#FF6600]">{pct}%</span></div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#eef1f4]"><div className="h-full rounded-full bg-gradient-to-r from-[#FF6600] to-[#FFD166]" style={{ width: pct + "%" }} /></div>
        </div>
        <div className="hidden shrink-0 gap-2 lg:flex">
          <button type="button" onClick={() => goTo("mastery")} className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-black text-[#0b3a63] hover:bg-zinc-50">Final Test</button>
          <button type="button" onClick={() => goTo(chapters[0].id)} className="rounded-xl bg-[#0b3a63] px-4 py-2 text-xs font-black text-white">Start</button>
        </div>
      </div>
    </div>

    <main ref={topRef} className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">About this course / इस course के बारे में</div>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {[["यह विषय क्या है? / What is it?", course.overview.what], ["क्यों महत्वपूर्ण है? / Why it matters", course.overview.why], ["कहाँ दिखता है? / Where we see it", course.overview.where], ["सीखने के बाद / Outcome", course.overview.outcome]].map(([h, x]) => <div key={h} className="rounded-2xl border border-zinc-100 bg-gradient-to-br from-[#fbfdff] to-white p-5">
            <div className="text-base font-black text-[#0b3a63] md:text-lg">{h}</div><p className="mt-2 text-base leading-8 text-zinc-600 md:text-lg">{x}</p>
          </div>)}
        </div>
      </section>

      {/* Course Start */}
      <section className="mt-6 rounded-[2rem] border border-[#e6d3a8] bg-gradient-to-br from-[#fff8e8] to-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3"><span className="text-3xl" aria-hidden="true">🌟</span><h2 className="text-2xl font-black text-[#062a52] md:text-3xl">Course Start — {course.courseStart.title}</h2></div>
        <div className="mt-4 space-y-4">{course.courseStart.blocks.map((b, i) => <Block key={i} b={b} />)}</div>
      </section>

      {/* Chapter navigation */}
      <section className="mt-6 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
        <h2 className="text-2xl font-black text-[#062a52] md:text-3xl">📚 Course Path / पाठ्यक्रम</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {course.modules.map((m) => <div key={m.id} className="rounded-2xl border border-zinc-100 bg-gradient-to-br from-[#fbfdff] to-white p-4">
            <div className="text-base font-black text-[#0b3a63] md:text-lg"><span aria-hidden="true">{m.icon}</span> {m.title} <span className="font-bold text-zinc-400">/ {m.titleHi}</span></div>
            <div className="mt-2 flex flex-wrap gap-1.5">{m.chapters.map((c) => <button key={c.id} type="button" onClick={() => goTo(c.id)} className={"rounded-full border px-3 py-1.5 text-sm font-bold transition " + (done.includes(c.id) ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 text-zinc-600 hover:bg-white")}>{c.number}. {c.title}</button>)}</div>
          </div>)}
        </div>
      </section>

      {/* Chapters */}
      <div className="mt-8 space-y-6">
        {chapters.map((c, i) => <Chapter key={c.id} chapter={c} index={i} total={total} done={done.includes(c.id)} onToggleDone={toggleDone} speaking={speaking} onSpeak={onSpeak} art={art} />)}
      </div>

      {/* Revision */}
      <section className="mt-8 rounded-[2rem] border border-[#cfe0ee] bg-[#f4f9fd] p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3"><span className="text-3xl" aria-hidden="true">🔄</span><h2 className="text-2xl font-black text-[#062a52] md:text-3xl">Final Revision — {course.revision.title}</h2></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {course.revision.groups.map((g) => <div key={g.title} className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-base font-black text-[#0b3a63] md:text-lg">{g.title}</div>
            <ul className="mt-2 space-y-1.5 pl-1 text-base leading-8 text-zinc-700">{g.items.map((x, i) => <li key={i} className="flex gap-3"><span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#FF6600]" aria-hidden="true" /><span>{x}</span></li>)}</ul>
          </div>)}
        </div>
      </section>

      {/* Mastery */}
      <div className="mt-8"><MasteryTest mastery={course.mastery} /></div>

      {/* Project (optional — Knowledge World courses carry a field project) */}
      {course.project && <section className="mt-8 rounded-[2rem] border border-[#e6d3a8] bg-gradient-to-br from-[#fffaf0] to-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3"><span className="text-3xl" aria-hidden="true">🧪</span><h2 className="text-2xl font-black text-[#062a52] md:text-3xl">Project — {course.project.objective}</h2></div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {course.project.materials && <div className="rounded-2xl border border-zinc-200 bg-white p-4"><div className="text-base font-black text-[#0b3a63] md:text-lg">Materials / सामग्री</div><p className="mt-1 text-base leading-8 text-zinc-600 md:text-lg">{course.project.materials}</p></div>}
          {course.project.observation && <div className="rounded-2xl border border-zinc-200 bg-white p-4"><div className="text-base font-black text-[#0b3a63] md:text-lg">Observe / निरीक्षण</div><p className="mt-1 text-base leading-8 text-zinc-600 md:text-lg">{course.project.observation}</p></div>}
        </div>
        {course.project.steps && <ol className="mt-4 space-y-2 pl-1 text-base leading-8 text-zinc-700 md:text-lg">{course.project.steps.map((s, i) => <li key={i} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef4f9] text-sm font-black text-[#0b3a63]">{i + 1}</span><span>{s}</span></li>)}</ol>}
        {course.project.result && <p className="mt-4 rounded-2xl bg-[#eaf7f0] p-4 text-base font-black text-[#177245] md:text-lg">Result: {course.project.result}</p>}
        {course.project.reflection && <p className="mt-2 text-base italic leading-8 text-zinc-600 md:text-lg">Reflection: {course.project.reflection}</p>}
      </section>}

      {/* Outcome */}
      <section className="mt-8 rounded-[2rem] border border-[#d7ecdd] bg-gradient-to-br from-[#f4fdf7] to-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3"><span className="text-3xl" aria-hidden="true">🌟</span><h2 className="text-2xl font-black text-[#14532d] md:text-3xl">Course Outcome</h2></div>
        <p className="mt-2 text-base leading-8 text-zinc-600 md:text-lg">{course.outcomeIntro}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{course.outcome.map((x, i) => <li key={i} className="flex items-start gap-2 text-base font-bold text-zinc-700 md:text-lg"><span className="mt-0.5 text-[#177245]">✅</span>{x}</li>)}</ul>
        <p className="mt-5 rounded-2xl bg-[#eaf7f0] p-4 text-base font-black text-[#177245] md:text-lg">{course.outcomeClose}</p>
      </section>

      <div className="py-10 text-center">
        <button type="button" onClick={onBack} className="rounded-2xl border border-zinc-300 bg-white px-6 py-3 text-sm font-black text-[#0b3a63] hover:bg-zinc-50">← Back to Learning Hub / वापस</button>
      </div>
    </main>
  </div>;
}
