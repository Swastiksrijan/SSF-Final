import PrimaryLettersLesson from "./PrimaryLettersLesson";
import { HeroPattern, IllustrationAlphabet, IllustrationStory, IllustrationSounds } from "./LearningIllustrations";

const HIGHLIGHTS = [
  [IllustrationAlphabet, "अक्षर पहचान", "Letters & recognition", "🅰️"],
  [IllustrationSounds, "ध्वनि व उच्चारण", "Sounds & speaking", "🔊"],
  [IllustrationStory, "शब्द व वाक्य", "Words & reading", "📖"]
];

const GOALS = [
  "English A–Z की पहचान",
  "Hindi स्वर एवं व्यंजन",
  "मात्राएँ और बारहखड़ी",
  "चित्र से शब्द पहचान",
  "छोटे वाक्य पढ़ना",
  "खेल व अभ्यास से दोहराव"
];

export default function PrimaryLettersCourse({ subject, nextLessonTitle, onNextLesson, onMarkDone }) {
  const scrollToContent = () => {
    try { document.getElementById("letters-content")?.scrollIntoView({ behavior: "smooth", block: "start" }); } catch {}
  };

  return <div className="min-h-screen bg-[#f4f7fb] font-inria text-zinc-900">
    <section className="relative overflow-hidden">
      <HeroPattern className="absolute inset-0 h-full w-full" />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 text-white md:pb-20 md:pt-36">
        <a href="/LearningHub" className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/20">← Back to Learning Hub / वापस</a>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] backdrop-blur">🎓 Course 01 • Primary Education / प्राथमिक शिक्षा</div>
          <h1 className="mt-5 text-4xl font-black leading-[1.1] md:text-6xl">Letters &amp; Sounds<br/><span className="text-2xl text-white/90 md:text-4xl">अक्षर और ध्वनि</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 md:text-lg">अक्षर पहचानना, आवाज़ समझना, शब्द बनाना, पढ़ना और लिखना — एक teacher की तरह step-by-step, चित्र, आवाज़, खेल और अभ्यास के साथ।</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={scrollToContent} className="rounded-2xl bg-[#ffd166] px-6 py-3 text-sm font-black text-[#062a52] shadow-lg transition hover:bg-[#ffdf8c]">▶ Start Learning / सीखना शुरू करें</button>
            <span className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur">हिंदी + English • आवाज़ सहित</span>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 bg-[#062a52]/70 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-4 px-4 py-5 text-white md:grid-cols-4 md:py-6">
          {[["15","Modules"],["36 + 26","Hindi + English letters"],["4","Games & activities"],["6 hrs","Self-paced"]].map(([v, l]) => <div key={l} className="px-2 text-center md:px-4"><div className="text-2xl font-black md:text-3xl">{v}</div><div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/70">{l}</div></div>)}
        </div>
      </div>
    </section>

    <main className="mx-auto max-w-6xl px-4">
      <section className="-mt-8 md:-mt-12">
        <div className="grid gap-4 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-xl md:grid-cols-3 md:p-6">
          {HIGHLIGHTS.map(([Art, hi, en, badge]) => <div key={hi} className="group overflow-hidden rounded-2xl border border-zinc-100 bg-[#fbfdff]">
            <div className="relative h-40 w-full overflow-hidden">
              <Art />
              <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-sm shadow-sm">{badge}</span>
            </div>
            <div className="px-4 py-3">
              <div className="text-sm font-black text-[#0b4a86]">{hi}</div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">{en}</div>
            </div>
          </div>)}
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#0b4a86]">About this course / इस course के बारे में</div>
          <p className="mt-3 text-sm leading-7 text-zinc-600">यह पाठ्यक्रम बच्चों को बुनियादी साक्षरता सिखाता है — अंग्रेज़ी वर्णमाला, हिंदी स्वर-व्यंजन, मात्राएँ, बारहखड़ी, शब्द निर्माण और वाक्य पठन। हर concept के बाद चित्र, आवाज़, खेल और अभ्यास ताकि सीखना पक्का हो।</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div><div className="text-sm font-black text-[#0b4a86]">किसके लिए?</div><p className="mt-1 text-sm leading-6 text-zinc-600">3–8 वर्ष के बच्चे, अभिभावक, प्राथमिक शिक्षक।</p></div>
            <div><div className="text-sm font-black text-[#0b4a86]">माध्यम</div><p className="mt-1 text-sm leading-6 text-zinc-600">हिंदी + English, 🔊 सुनें सहित।</p></div>
            <div><div className="text-sm font-black text-[#0b4a86]">स्तर</div><p className="mt-1 text-sm leading-6 text-zinc-600">Foundation — शुरुआत से।</p></div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-[#d8eadf] bg-gradient-to-br from-[#f4fff7] to-white p-6 shadow-sm md:p-8">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#177245]">What you will learn / आप क्या सीखेंगे</div>
          <ul className="mt-3 space-y-2">
            {GOALS.map(g => <li key={g} className="flex items-start gap-2 text-sm font-bold text-zinc-700"><span className="mt-0.5 text-[#177245]">✅</span>{g}</li>)}
          </ul>
        </div>
      </section>

      <div id="letters-content" className="scroll-mt-24 pb-16">
        <div className="mt-8 flex items-center gap-3">
          <span className="h-1.5 w-10 rounded-full bg-[#0b4a86]" />
          <h2 className="text-xl font-black text-[#062a52] md:text-2xl">Interactive Lesson / इंटरैक्टिव पाठ</h2>
        </div>
        <PrimaryLettersLesson onNextLesson={onNextLesson} onMarkDone={onMarkDone} nextLessonTitle={nextLessonTitle} />
      </div>
    </main>
  </div>;
}
