import PrimaryLettersLesson from "./PrimaryLettersLesson";

const PHOTOS = [
  ["/images/real/education_girls.jpg", "पढ़ाई में लगे बच्चे", "Learning begins with letters"],
  ["/images/real/girls-study-group-mat.jpg", "समूह में सीखना", "Learn together, grow together"],
  ["/images/real/classroom-floor-seating.jpg", "कक्षा में अभ्यास", "Practice makes perfect"],
  ["/images/real/rural-children-raising-hands.jpg", "उत्साह से जवाब", "Every child can learn"]
];

export default function PrimaryLettersCourse({ subject }) {
  const scrollToContent = () => {
    try { document.getElementById("letters-content")?.scrollIntoView({ behavior: "smooth", block: "start" }); } catch {}
  };

  return <div className="min-h-screen bg-[#f6f8fb] font-inria text-zinc-900">
    {/* Hero */}
    <section className="relative overflow-hidden text-white">
      <img src="/images/real/education_girls.jpg" alt="Primary education learners" className="absolute inset-0 h-full w-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-br from-[#001426]/95 via-[#003366]/85 to-[#007c91]/70"/>
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-28 md:pb-16 md:pt-36">
        <a href="/LearningHub" className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/20">← Back to Learning Hub / वापस</a>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest">🎓 Course 01 • Primary Education / प्राथमिक शिक्षा</div>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">Letters & Sounds<br/><span className="text-2xl text-white/90 md:text-4xl">अक्षर और ध्वनि</span></h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/85 md:text-lg">अक्षर पहचानना, आवाज़ समझना, शब्द बनाना, पढ़ना और लिखना — एक teacher की तरह step-by-step, चित्र, आवाज़, खेल और अभ्यास के साथ।</p>
            <button type="button" onClick={scrollToContent} className="mt-6 rounded-2xl bg-white px-6 py-3 text-sm font-black text-[#003366] shadow-md transition hover:bg-white/90">▶ Start Learning / सीखना शुरू करें</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[["15","Modules"],["40+","Lessons & Cards"],["26+36","English + Hindi letters"],["6 hrs","Self-paced"]].map(([v, l]) => <div key={l} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><div className="text-2xl font-black">{v}</div><div className="mt-1 text-xs font-bold text-white/70">{l}</div></div>)}
          </div>
        </div>
      </div>
    </section>

    <main className="mx-auto max-w-7xl px-4">
      {/* Photo strip */}
      <section className="-mt-8 md:-mt-10">
        <div className="grid gap-4 rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-4 md:p-5">
          {PHOTOS.map(([src, hi, en]) => <figure key={src} className="overflow-hidden rounded-2xl">
            <img src={src} alt={hi} className="h-40 w-full object-cover transition duration-500 hover:scale-105" loading="lazy"/>
            <figcaption className="bg-white px-3 py-2"><div className="text-xs font-black text-[#003366]">{hi}</div><div className="text-[11px] text-zinc-500">{en}</div></figcaption>
          </figure>)}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">About this course / इस course के बारे में</div>
        <div className="mt-3 grid gap-6 md:grid-cols-3">
          <div><div className="text-sm font-black text-[#003366]">किसके लिए? / Who is this for?</div><p className="mt-1 text-sm leading-6 text-zinc-600">3–8 वर्ष के बच्चे, अभिभावक, प्राथमिक शिक्षक और बुनियादी साक्षरता सीख रहे बड़े।</p></div>
          <div><div className="text-sm font-black text-[#003366]">आप क्या सीखेंगे / What you will learn</div><p className="mt-1 text-sm leading-6 text-zinc-600">English A–Z और Hindi स्वर-व्यंजन की पहचान, ध्वनि, मात्राएँ, बारहखड़ी, शब्द और वाक्य पठन।</p></div>
          <div><div className="text-sm font-black text-[#003366]">माध्यम / Medium</div><p className="mt-1 text-sm leading-6 text-zinc-600">हिंदी + English, आवाज़ सहित (🔊 सुनें)। हर topic के बाद अभ्यास व खेल।</p></div>
        </div>
      </section>

      <div id="letters-content" className="scroll-mt-28 pb-16">
        <PrimaryLettersLesson />
      </div>
    </main>
  </div>;
}
