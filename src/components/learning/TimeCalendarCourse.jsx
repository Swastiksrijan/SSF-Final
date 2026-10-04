import { useEffect, useMemo, useRef, useState } from "react";
import { TIME_CALENDAR_COURSE } from "../../data/timeCalendarCourse";

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
  // Titles already carry their own emoji in the authored content; only add the
  // semantic icon when the title is plain text (or absent).
  const lead = title && /^[^\p{L}\p{N}]/u.test(title) ? title : (s.icon + " " + (title || s.def));
  return <div className={"rounded-2xl border p-4 md:p-5 " + s.box}>
    <div className={"flex items-center gap-2 text-xs font-black uppercase tracking-widest " + s.label}>{lead}</div>
    {b.x && <p className="mt-2 text-sm leading-7 text-zinc-700">{b.x}</p>}
    {b.items && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-700">{b.items.map((it, i) => <li key={i}>{it}</li>)}</ul>}
  </div>;
}

function Block({ b }) {
  if (!b) return null;
  switch (b.t) {
    case "h":
      return <h4 className="mt-2 text-lg font-black text-[#062a52] md:text-xl">{b.x}</h4>;
    case "p":
      return <p className="text-sm leading-7 text-zinc-700 md:text-[15px] md:leading-8">{b.x}</p>;
    case "ul":
      return <ul className="list-disc space-y-1.5 pl-5 text-sm leading-7 text-zinc-700 md:text-[15px]">{b.items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
    case "ol":
      return <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-7 text-zinc-700 md:text-[15px]">{b.items.map((it, i) => <li key={i}>{it}</li>)}</ol>;
    case "flow":
      return <div className="space-y-1.5">{b.items.map((it, i) => <div key={i}>
        <div className="rounded-xl border border-[#d9e4ee] bg-[#f7fafd] px-4 py-2.5 text-sm font-bold text-[#0b3a63]">{it}</div>
        {i < b.items.length - 1 && <div className="py-0.5 text-center text-lg font-black text-[#8fa6bd]" aria-hidden="true">↓</div>}
      </div>)}</div>;
    case "table":
      return <div className="overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          {b.head && <thead className="bg-[#eef4f9] text-[#0b3a63]"><tr>{b.head.map((h, i) => <th key={i} className="px-4 py-2.5 text-xs font-black uppercase tracking-wide">{h}</th>)}</tr></thead>}
          <tbody>{b.rows.map((row, r) => <tr key={r} className={r % 2 ? "bg-[#fbfdff]" : "bg-white"}>
            {row.map((cell, c) => <td key={c} className="border-t border-zinc-100 px-4 py-2.5 leading-6 text-zinc-700">{cell}</td>)}
          </tr>)}</tbody>
        </table>
      </div>;
    case "note":
      return <Note b={b} />;
    case "ex":
      return <div className="rounded-2xl border border-[#cfe0ee] bg-[#f4f9fd] p-4 md:p-5">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0b4a86]"><span aria-hidden="true">📖</span>{b.title || "Example"}</div>
        {b.x && <p className="mt-2 text-sm font-bold leading-7 text-[#0b3a63]">{b.x}</p>}
        {b.steps && <ol className="mt-3 space-y-2">{b.steps.map((s, i) => <li key={i} className="flex gap-3 text-sm leading-7 text-zinc-700"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b3a63] text-[11px] font-black text-white">{i + 1}</span><span>{s}</span></li>)}</ol>}
      </div>;
    case "act":
      return <div className="rounded-2xl border border-[#d7ecdd] bg-[#f4fdf7] p-4 md:p-5">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#177245]"><span aria-hidden="true">🧩</span>Activity</div>
        <div className="mt-1 text-base font-black text-[#14532d]">{b.title}</div>
        {b.x && <p className="mt-2 text-sm leading-7 text-zinc-700">{b.x}</p>}
        {b.items && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-700">{b.items.map((it, i) => <li key={i}>{it}</li>)}</ul>}
      </div>;
    case "ch":
      return <div className="rounded-2xl border border-[#f2d59a] bg-[#fffaf0] p-4 md:p-5">
        <div className="text-base font-black text-[#9a5b00]">{b.title}</div>
        {b.x && <p className="mt-2 text-sm leading-7 text-zinc-700">{b.x}</p>}
        {b.items && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-700">{b.items.map((it, i) => <li key={i}>{it}</li>)}</ul>}
      </div>;
    case "mistakes":
      return <div className="grid gap-3 sm:grid-cols-2">{b.items.map((m, i) => <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-bold text-rose-600">❌ {m.w}</div>
        <div className="mt-2 text-sm font-bold text-emerald-700">✅ {m.c}</div>
      </div>)}</div>;
    default:
      return null;
  }
}

function Chapter({ chapter, index, total, done, onToggleDone }) {
  return <section id={"tc-" + chapter.id} className="scroll-mt-28 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm md:p-7">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b3a63] to-[#001529] text-xl text-white">{chapter.icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Chapter {chapter.number} · {index + 1}/{total}</div>
        <h3 className="mt-1 text-xl font-black leading-tight text-[#062a52] md:text-2xl">{chapter.title}</h3>
        <div className="text-sm font-bold text-zinc-500">{chapter.titleHi}</div>
      </div>
      <button type="button" onClick={() => speak(chapter.title + "। " + chapter.blocks.filter(x => x.t === "p").map(x => x.x).join(" "))}
        className="shrink-0 rounded-full bg-[#eef4f9] px-3 py-2 text-xs font-black text-[#0b3a63]" aria-label="Listen to chapter">🔊</button>
    </div>

    <div className="mt-5 space-y-4">{chapter.blocks.map((b, i) => <Block key={i} b={b} />)}</div>

    <button type="button" onClick={() => onToggleDone(chapter.id)}
      className={"mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition " + (done ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-[#0b3a63] text-white hover:brightness-110")}>
      {done ? "✅ Completed / पूरा हुआ" : "Mark as done / पूरा करें"}
    </button>
  </section>;
}

function MasteryTest({ mastery }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = mastery.quiz.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const total = mastery.quiz.length;
  const answered = Object.keys(answers).length;
  const pct = total ? Math.min(100, Math.round((score / total) * 100)) : 0;

  return <section id="tc-mastery" className="scroll-mt-28 rounded-[2rem] border border-[#e6d3a8] bg-gradient-to-br from-[#fffaf0] to-white p-5 shadow-sm md:p-8">
    <div className="flex items-center gap-3">
      <span className="text-2xl" aria-hidden="true">🎓</span>
      <h3 className="text-xl font-black text-[#062a52] md:text-2xl">{mastery.title}</h3>
    </div>
    <p className="mt-2 text-sm leading-7 text-zinc-600">{mastery.note}</p>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {mastery.tasks.map((t) => <div key={t.title} className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-black text-[#0b3a63]"><span aria-hidden="true">{t.icon}</span> {t.title}</div>
        <p className="mt-1 text-xs leading-6 text-zinc-600">{t.x}</p>
      </div>)}
    </div>

    <div className="mt-7 space-y-4">
      {mastery.quiz.map((q, i) => <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-black text-zinc-800">{i + 1}. {q.q}</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {q.options.map((o, j) => {
            const chosen = answers[i] === j;
            const correct = submitted && j === q.answer;
            const wrong = submitted && chosen && j !== q.answer;
            return <label key={j} className={"flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition " + (correct ? "border-emerald-300 bg-emerald-50 font-bold text-emerald-800" : wrong ? "border-rose-300 bg-rose-50 font-bold text-rose-700" : chosen ? "border-[#0b3a63] bg-[#eef4f9]" : "border-zinc-200 hover:bg-zinc-50")}>
              <input type="radio" name={"tc-q-" + i} checked={chosen} onChange={() => !submitted && setAnswers(a => ({ ...a, [i]: j }))} />
              <span>{o}</span>
            </label>;
          })}
        </div>
        {submitted && <div className="mt-2 text-xs leading-6 text-zinc-600"><strong className="text-[#0b3a63]">Explanation:</strong> {q.explain}</div>}
      </div>)}
    </div>

    <div className="mt-6 flex flex-wrap items-center gap-4">
      <button type="button" disabled={answered < total || submitted} onClick={() => setSubmitted(true)}
        className="rounded-2xl bg-gradient-to-br from-[#0b3a63] to-[#001529] px-6 py-3 text-sm font-black text-white disabled:opacity-40">Check Answers / उत्तर जाँचें</button>
      {submitted && <div className={"rounded-2xl px-5 py-3 text-sm font-black " + (pct >= 80 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>Score: {score}/{total} ({pct}%) {pct >= 80 ? "· Mastered 🏆" : "· दोबारा पढ़ें"}</div>}
    </div>
  </section>;
}

export default function TimeCalendarCourse({ subject, onBack }) {
  const course = TIME_CALENDAR_COURSE;
  const chapters = useMemo(() => course.modules.flatMap((m) => m.chapters.map((c) => ({ ...c, moduleTitle: m.title, moduleIcon: m.icon }))), [course]);
  const total = chapters.length;
  // Use the same progress key the hub cards read so completion is consistent
  // across the dashboard and this course view.
  const progressKey = "ssf-learning-course-progress-" + subject.id;
  const [done, setDone] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(progressKey) || "[]");
      // Heal stale data from the previous generic course (numeric indices) so the
      // count stays truthful after the content rewrite.
      const valid = new Set(chapters.map((c) => c.id));
      return Array.isArray(raw) ? raw.filter((id) => valid.has(id)) : [];
    } catch { return []; }
  });
  const topRef = useRef(null);

  useEffect(() => { try { localStorage.setItem(progressKey, JSON.stringify(done)); } catch {} }, [done, progressKey]);

  const completed = chapters.filter((c) => done.includes(c.id)).length;
  const pct = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  const toggleDone = (id) => setDone((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  const goTo = (id) => { try { document.getElementById("tc-" + id)?.scrollIntoView({ behavior: "smooth", block: "start" }); } catch {} };

  return <div className="min-h-screen bg-[#f4f7fb] font-inria text-zinc-900">
    <section className="relative overflow-hidden bg-[#001529] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#001529] via-[#0b3a63] to-[#001529]" />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 md:pb-16 md:pt-32">
        <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/20">← Back to Learning Hub / वापस</button>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD166]/30 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#FFD166] backdrop-blur">{course.meta.icon} Knowledge World • Master Course</div>
          <h1 className="mt-5 text-4xl font-black leading-[1.1] md:text-6xl">Time &amp; Calendar<br /><span className="text-2xl text-white/90 md:text-4xl">समय एवं कैलेंडर</span></h1>
          <p className="mt-4 text-lg font-bold text-[#FFD166]">{course.meta.tagline}</p>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-white/85 md:text-base">{course.meta.heroSubtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="rounded-2xl bg-[#FFD166] px-6 py-3 text-sm font-black text-[#062a52] shadow-lg transition hover:bg-[#ffdf8c]">▶ Start Learning / सीखना शुरू करें</button>
            <span className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur">हिंदी + English • 🔊 Audio</span>
          </div>
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
          {[["यह विषय क्या है? / What is it?", course.overview.what], ["क्यों महत्वपूर्ण है? / Why it matters", course.overview.why], ["कहाँ दिखता है? / Where we see it", course.overview.where], ["सीखने के बाद / Outcome", course.overview.outcome]].map(([h, x]) => <div key={h} className="rounded-2xl border border-zinc-100 bg-[#fbfdff] p-5">
            <div className="text-sm font-black text-[#0b3a63]">{h}</div><p className="mt-2 text-sm leading-7 text-zinc-600">{x}</p>
          </div>)}
        </div>
      </section>

      {/* Course Start */}
      <section className="mt-6 rounded-[2rem] border border-[#e6d3a8] bg-gradient-to-br from-[#fff8e8] to-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3"><span className="text-2xl" aria-hidden="true">🌟</span><h2 className="text-xl font-black text-[#062a52] md:text-2xl">Course Start — {course.courseStart.title}</h2></div>
        <div className="mt-4 space-y-3">{course.courseStart.blocks.map((b, i) => <Block key={i} b={b} />)}</div>
      </section>

      {/* Chapter navigation */}
      <section className="mt-6 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-7">
        <h2 className="text-lg font-black text-[#062a52] md:text-xl">📚 Course Path / पाठ्यक्रम</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {course.modules.map((m) => <div key={m.id} className="rounded-2xl border border-zinc-100 bg-[#fbfdff] p-4">
            <div className="text-sm font-black text-[#0b3a63]"><span aria-hidden="true">{m.icon}</span> {m.title} <span className="text-zinc-400">/ {m.titleHi}</span></div>
            <div className="mt-2 flex flex-wrap gap-1.5">{m.chapters.map((c) => <button key={c.id} type="button" onClick={() => goTo(c.id)} className={"rounded-full border px-3 py-1 text-xs font-bold transition " + (done.includes(c.id) ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 text-zinc-600 hover:bg-white")}>{c.number}. {c.title}</button>)}</div>
          </div>)}
        </div>
      </section>

      {/* Chapters */}
      <div className="mt-8 space-y-6">
        {chapters.map((c, i) => <Chapter key={c.id} chapter={c} index={i} total={total} done={done.includes(c.id)} onToggleDone={toggleDone} />)}
      </div>

      {/* Revision */}
      <section className="mt-8 rounded-[2rem] border border-[#cfe0ee] bg-[#f4f9fd] p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3"><span className="text-2xl" aria-hidden="true">🔄</span><h2 className="text-xl font-black text-[#062a52] md:text-2xl">Final Revision — {course.revision.title}</h2></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {course.revision.groups.map((g) => <div key={g.title} className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="text-sm font-black text-[#0b3a63]">{g.title}</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-zinc-700">{g.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>)}
        </div>
      </section>

      {/* Mastery */}
      <div className="mt-8"><MasteryTest mastery={course.mastery} /></div>

      {/* Outcome */}
      <section className="mt-8 rounded-[2rem] border border-[#d7ecdd] bg-gradient-to-br from-[#f4fdf7] to-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3"><span className="text-2xl" aria-hidden="true">🌟</span><h2 className="text-xl font-black text-[#14532d] md:text-2xl">Course Outcome</h2></div>
        <p className="mt-2 text-sm leading-7 text-zinc-600">इस course को पूरा करने के बाद learner केवल यह नहीं कहेगा “मुझे time पढ़ना आता है”, बल्कि वह:</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">{course.outcome.map((x, i) => <li key={i} className="flex items-start gap-2 text-sm font-bold text-zinc-700"><span className="mt-0.5 text-[#177245]">✅</span>{x}</li>)}</ul>
        <p className="mt-5 rounded-2xl bg-[#eaf7f0] p-4 text-sm font-black text-[#177245]">यही Time &amp; Calendar की वास्तविक mastery है।</p>
      </section>

      <div className="py-10 text-center">
        <button type="button" onClick={onBack} className="rounded-2xl border border-zinc-300 bg-white px-6 py-3 text-sm font-black text-[#0b3a63] hover:bg-zinc-50">← Back to Learning Hub / वापस</button>
      </div>
    </main>
  </div>;
}
