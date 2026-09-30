import { useMemo, useState } from "react";
import { FaBookOpen, FaCheckCircle, FaExchangeAlt, FaSearch, FaVolumeUp } from "react-icons/fa";
import { ENGLISH_HINDI_DICTIONARY } from "../data/englishHindiDictionary";

const DAY_PLAN = [
  ["Day 1","Foundation / आधार","Words 1–10"],["Day 2","People & communication / लोग एवं संचार","Words 11–20"],
  ["Day 3","Action words / क्रिया","Words 21–30"],["Day 4","Learning / सीखना","Words 31–40"],
  ["Day 5","Thinking / विचार","Words 41–50"],["Day 6","Work / काम","Words 51–60"],
  ["Day 7","Review / पुनरावृत्ति","Days 1–6 retrieval"],["Day 8","Daily life / दैनिक जीवन","Words 61–70"],
  ["Day 9","Useful verbs / उपयोगी क्रियाएँ","Words 71–80"],["Day 10","Descriptions / वर्णन","Words 81–90"],
  ["Day 11","Safety & responsibility / सुरक्षा","Words 91–100"],["Day 12","Core review / मुख्य पुनरावृत्ति","Words 1–100"],
  ["Day 13","Speak / बोलें","Make 20 sentences"],["Day 14","Listen / सुनें","Hear + repeat 20 words"],
  ["Day 15","Read / पढ़ें","Read a short passage"],["Day 16","Write / लिखें","Write 20 sentences"],
  ["Day 17","Synonyms / पर्याय","Replace 20 common words"],["Day 18","Antonyms / विलोम","Learn 20 opposites"],
  ["Day 19","Word families / शब्द परिवार","Noun–verb–adjective forms"],["Day 20","Questions / प्रश्न","Ask + answer in English"],
  ["Day 21","Conversation / बातचीत","10 real-life dialogues"],["Day 22","Work English / कार्यस्थल","Emails + requests"],
  ["Day 23","Study English / अध्ययन","Notes + explanations"],["Day 24","Digital English / डिजिटल","Phone + internet vocabulary"],
  ["Day 25","Travel & daily use / दैनिक प्रयोग","Practical phrases"],["Day 26","Fluency / प्रवाह","Think in short English sentences"],
  ["Day 27","Test / परीक्षा","Recall without looking"],["Day 28","Correction / सुधार","Fix common errors"],
  ["Day 29","Master review / अंतिम पुनरावृत्ति","All learned words"],["Day 30","Use it / प्रयोग","Speak, write, read and test"]
];

function speakWord(word) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-IN";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

export default function EnglishHindiDictionary({ onBack }) {
  const [query,setQuery] = useState("");
  const [direction,setDirection] = useState("all");
  const [day,setDay] = useState(1);
  const [selected,setSelected] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ENGLISH_HINDI_DICTIONARY;
    return ENGLISH_HINDI_DICTIONARY.filter(item => {
      const hay = [item.word,item.hi,item.pos,item.pronunciation,...item.synonyms,...item.antonyms,item.example,item.exampleHi].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
      if (direction === "hi-en") return item.hi.toLowerCase().includes(q);
      return true;
    });
  },[query,direction]);

  const dayWords = useMemo(() => {
    if (day === 7 || day >= 12) return ENGLISH_HINDI_DICTIONARY.slice(0,10);
    const start = ((day - 1) % 10) * 10;
    return ENGLISH_HINDI_DICTIONARY.slice(start,start + 10);
  },[day]);

  return <div className="min-h-screen bg-[#f6f8fb] text-zinc-900">
    <section className="bg-gradient-to-br from-[#002344] via-[#0f4c81] to-[#007c91] px-4 py-12 text-white md:py-16">
      <div className="mx-auto max-w-7xl">
        <button onClick={onBack} className="mb-7 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20">← Learning Hub / वापस</button>
        <div className="max-w-4xl">
          <div className="text-xs font-black uppercase tracking-[.2em] text-white/70">SSF Language Learning / भाषा सीखना</div>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">English ↔ Hindi Dictionary</h1>
          <h2 className="mt-2 text-2xl font-bold">अंग्रेज़ी ↔ हिन्दी शब्दकोश एवं 30-Day English Learning</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/85">सिर्फ word meaning नहीं: pronunciation, हिन्दी अर्थ, कई समानार्थी शब्द, विलोम, example sentence, बोलने का अभ्यास और 30 दिन की revision-based learning journey।</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-5"><div className="text-3xl font-black">{ENGLISH_HINDI_DICTIONARY.length}+</div><div className="text-sm text-white/75">Core words / मुख्य शब्द</div></div>
          <div className="rounded-2xl bg-white/10 p-5"><div className="text-3xl font-black">A ↔ Z</div><div className="text-sm text-white/75">Search + translation / खोज</div></div>
          <div className="rounded-2xl bg-white/10 p-5"><div className="text-3xl font-black">30 Days</div><div className="text-sm text-white/75">Learn → Recall → Use</div></div>
        </div>
      </div>
    </section>

    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="English word या हिन्दी शब्द खोजें..." className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-4 pl-11 pr-4 text-base outline-none focus:border-[#0f4c81] focus:bg-white focus:ring-4 focus:ring-[#0f4c81]/10" />
          </div>
          <div className="flex rounded-2xl bg-zinc-100 p-1">
            {[["all","All / सभी"],["en-hi","English → Hindi"],["hi-en","Hindi → English"]].map(([key,label])=><button key={key} onClick={()=>setDirection(key)} className={"rounded-xl px-4 py-3 text-sm font-black "+(direction===key?"bg-[#003366] text-white":"text-zinc-600")}>{label}</button>)}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-zinc-600">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter=><button key={letter} onClick={()=>setQuery(letter)} className="h-8 w-8 rounded-lg bg-zinc-100 hover:bg-[#e7f2f7]">{letter}</button>)}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <div className="mb-4"><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Dictionary / शब्दकोश</div><h2 className="mt-1 text-2xl font-black">{results.length} words / शब्द</h2></div>
          <div className="grid gap-4 md:grid-cols-2">
            {results.map(item=><article key={item.word} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <button onClick={()=>setSelected(item)} className="text-left"><h3 className="text-2xl font-black text-[#003366]">{item.word}</h3><div className="mt-1 text-sm font-bold text-zinc-500">{item.hi}</div></button>
                <button onClick={()=>speakWord(item.word)} title="Listen / सुनें" className="rounded-xl bg-[#edf5fa] p-3 text-[#0f4c81]"><FaVolumeUp /></button>
              </div>
              <div className="mt-3 text-xs font-bold text-zinc-500">{item.pos} • /{item.pronunciation}/</div>
              <div className="mt-4"><div className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Synonyms / समानार्थी</div><div className="mt-1 text-sm leading-6 text-zinc-700">{item.synonyms.join(" • ")}</div></div>
              {item.antonyms.length>0 && <div className="mt-3"><div className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Antonyms / विलोम</div><div className="mt-1 text-sm text-zinc-700">{item.antonyms.join(" • ")}</div></div>}
              <div className="mt-4 rounded-xl bg-zinc-50 p-3"><div className="text-sm font-semibold text-zinc-800">{item.example}</div><div className="mt-1 text-sm text-zinc-500">{item.exampleHi}</div></div>
            </article>)}
          </div>
          {!results.length && <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">शब्द नहीं मिला। Spelling जाँचें या दूसरे अर्थ से खोजें।</div>}
        </div>

        <aside className="space-y-6">
          <section className="rounded-[1.5rem] border border-[#d9e7f0] bg-gradient-to-br from-white to-[#eef7fb] p-6">
            <div className="flex items-center gap-2 text-sm font-black text-[#0f4c81]"><FaCheckCircle /> 30-DAY ENGLISH PLAN</div>
            <h2 className="mt-2 text-2xl font-black">30 दिन में मजबूत आधार</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">लक्ष्य “हर English word याद” करने का दावा नहीं, बल्कि रोज़ सीखना, बिना देखे याद करना और वास्तविक वाक्यों में प्रयोग करना है। Spaced review और retrieval practice vocabulary retention में मदद कर सकते हैं।</p>
            <div className="mt-4 max-h-[420px] space-y-2 overflow-auto pr-1">
              {DAY_PLAN.map(([d,title,task],i)=><button key={d} onClick={()=>setDay(i+1)} className={"w-full rounded-xl border p-3 text-left "+(day===i+1?"border-[#0f4c81] bg-white shadow-sm":"border-zinc-200 bg-white/60")}><div className="text-xs font-black text-[#0f4c81]">{d}</div><div className="text-sm font-black">{title}</div><div className="text-xs text-zinc-500">{task}</div></button>)}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-zinc-200 bg-white p-6">
            <div className="flex items-center gap-2 text-sm font-black text-[#0f4c81]"><FaBookOpen /> TODAY'S WORD SET / आज के शब्द</div>
            <div className="mt-4 space-y-2">
              {dayWords.map(item=><button key={item.word} onClick={()=>setSelected(item)} className="flex w-full items-center justify-between rounded-xl bg-zinc-50 p-3 text-left hover:bg-[#eef7fb]"><span><b>{item.word}</b><span className="ml-2 text-sm text-zinc-500">{item.hi}</span></span><FaExchangeAlt className="text-zinc-300" /></button>)}
            </div>
          </section>
        </aside>
      </section>
    </main>

    {selected && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" onClick={()=>setSelected(null)}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 md:p-8" onClick={e=>e.stopPropagation()}>
        <div className="flex items-start justify-between"><div><div className="text-4xl font-black text-[#003366]">{selected.word}</div><div className="mt-1 text-lg font-bold text-zinc-500">{selected.hi}</div></div><button onClick={()=>setSelected(null)} className="rounded-xl bg-zinc-100 px-3 py-2 font-black">×</button></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-xl bg-zinc-50 p-4"><b>Pronunciation / उच्चारण</b><div className="mt-1">{selected.pronunciation}</div></div><div className="rounded-xl bg-zinc-50 p-4"><b>Part of speech / शब्द-भेद</b><div className="mt-1">{selected.pos}</div></div></div>
        <div className="mt-5"><b>Meanings / अर्थ</b><div className="mt-2 text-zinc-700">{selected.hi}</div></div>
        <div className="mt-5"><b>Synonyms / समानार्थी</b><div className="mt-2 flex flex-wrap gap-2">{selected.synonyms.map(s=><span key={s} className="rounded-full bg-[#edf5fa] px-3 py-1 text-sm">{s}</span>)}</div></div>
        <div className="mt-5"><b>Example / उदाहरण</b><div className="mt-2 rounded-xl bg-zinc-50 p-4">{selected.example}<div className="mt-1 text-zinc-500">{selected.exampleHi}</div></div></div>
        <button onClick={()=>speakWord(selected.word)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#003366] px-4 py-3 font-black text-white"><FaVolumeUp /> Listen / सुनें</button>
      </div>
    </div>}
  </div>;
}
