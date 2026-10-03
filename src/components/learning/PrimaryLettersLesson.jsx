import { useMemo, useState } from "react";

const speak = (text) => {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF]/gu, ""));
    u.lang = /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-IN";
    u.rate = 0.8;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {}
};

const ENGLISH = [
  ["A","🍎","Apple","Ant","Axe","/æ/"],
  ["B","⚽","Ball","Bear","Bus","/b/"],
  ["C","🐱","Cat","Cup","Car","/k/"],
  ["D","🐶","Dog","Duck","Drum","/d/"],
  ["E","🥚","Egg","Elephant","Engine","/e/"],
  ["F","🐟","Fish","Frog","Fan","/f/"],
  ["G","🎁","Gift","Goat","Grapes","/g/"],
  ["H","🏠","House","Hat","Hen","/h/"],
  ["I","🍦","Ice cream","Ink","Igloo","/ɪ/"],
  ["J","🍯","Jam","Jug","Joker","/dʒ/"],
  ["K","🪁","Kite","Key","King","/k/"],
  ["L","🦁","Lion","Leaf","Lamp","/l/"],
  ["M","🌙","Moon","Mango","Monkey","/m/"],
  ["N","🥜","Nut","Nest","Nose","/n/"],
  ["O","🐙","Octopus","Orange","Owl","/ɒ/"],
  ["P","🐧","Penguin","Pen","Parrot","/p/"],
  ["Q","👑","Queen","Quilt","Quail","/kw/"],
  ["R","🌈","Rainbow","Rat","Rose","/r/"],
  ["S","☀️","Sun","Star","Snake","/s/"],
  ["T","🌳","Tree","Tiger","Table","/t/"],
  ["U","☂️","Umbrella","Uncle","Up","/ʌ/"],
  ["V","🎻","Violin","Van","Vase","/v/"],
  ["W","💧","Water","Watch","Whale","/w/"],
  ["X","🩻","X-ray","Xylophone","Box","/ks/"],
  ["Y","🧶","Yarn","Yak","Yellow","/j/"],
  ["Z","🦓","Zebra","Zip","Zoo","/z/"]
];

const SWAR = [
  ["अ","🍎","अनार"],["आ","🥭","आम"],["इ","🌰","इमली"],["ई","🎋","ईख"],
  ["उ","🦉","उल्लू"],["ऊ","🧶","ऊन"],["ऋ","🧘","ऋषि"],["ए","🪜","एड़ी"],
  ["ऐ","👓","ऐनक"],["ओ","🥣","ओखली"],["औ","🔨","औज़ार"],["अं","🍇","अंगूर"]
];

const VYANJAN_SETS = [
  ["क","ख","ग","घ","ङ"],
  ["च","छ","ज","झ","ञ"],
  ["ट","ठ","ड","ढ","ण"],
  ["त","थ","द","ध","न"],
  ["प","फ","ब","भ","म"],
  ["य","र","ल","व"],
  ["श","ष","स","ह"],
  ["क्ष","त्र","ज्ञ","श्र"]
];

const VYANJAN_WORDS = {
  "क":"कमल 🌸","ख":"खरगोश 🐇","ग":"गमला 🪴","घ":"घर 🏠","ङ":"अङ्क",
  "च":"चम्मच 🥄","छ":"छाता ☂️","ज":"जहाज 🚢","झ":"झंडा 🚩","ञ":"ञान",
  "ट":"टमाटर 🍅","ठ":"ठेला 🛒","ड":"डमरू 🥁","ढ":"ढोल 🥁","ण":"हिरण 🦌",
  "त":"तरबूज 🍉","थ":"थाली 🍽️","द":"दवा 💊","ध":"धनुष 🏹","न":"नल 🚰",
  "प":"पतंग 🪁","फ":"फल 🍎","ब":"बकरी 🐐","भ":"भालू 🐻","म":"मछली 🐟",
  "य":"यज्ञ 🔥","र":"रथ 🛞","ल":"लड्डू 🍬","व":"वन 🌲",
  "श":"शेर 🦁","ष":"षट्कोण 🔷","स":"सूरज ☀️","ह":"हाथी 🐘",
  "क्ष":"क्षत्रिय 🛡️","त्र":"त्रिशूल 🔱","ज्ञ":"ज्ञान 📖","श्र":"श्री ✨"
};

const BARAKHADI_MATRA = ["ा","ि","ी","ु","ू","े","ै","ो","ौ","ं","ः"];
const BARAKHADI = ["क","का","कि","की","कु","कू","के","कै","को","कौ","कं","कः"];

const BLENDS = [
  ["C","A","T","🐈","CAT"],
  ["B","A","T","🦇","BAT"],
  ["D","O","G","🐶","DOG"],
  ["S","U","N","☀️","SUN"],
  ["M","A","P","🗺️","MAP"]
];

const SENTENCES = [
  ["This is a cat.","🐱"],
  ["I have a ball.","⚽"],
  ["The sun is hot.","☀️"],
  ["यह आम है।","🥭"],
  ["राम घर गया।","🏠"],
  ["यह कमल है।","🌸"]
];

const GAMES = {
  find: { prompt:"🐱 Cat starts with which letter?", options:["A","B","C","D"], answer:"C" },
  missing: { prompt:"A, B, __, D — कौन-सा अक्षर आएगा?", options:["A","B","C","D"], answer:"C" },
  odd: { prompt:"इनमें कौन अलग है?", options:["🍎","🍌","🐶","🍊"], answer:"🐶" }
};

const WORKSHEET = [
  ["Apple starts with:", ["A","B","C"], "A"],
  ["Which word starts with B?", ["Ball","Cat","Dog"], "Ball"],
  ["क + ा = ?", ["कि","का","कु"], "का"],
  ["🍎 किसका चित्र है?", ["आम","अनार","इमली"], "अनार"],
  ["🍌 Banana का पहला अक्षर?", ["A","B","C"], "B"]
];

const FINAL_QUIZ = [
  ["Which letter comes after C?", ["B","D","E"], 1],
  ["A says the sound…", ["/æ/","/b/","/k/"], 0],
  ["🐱 which word?", ["Dog","Cat","Sun"], 1],
  ["C + A + T = ?", ["CAT","TAC","ACT"], 0],
  ["क + ि = ?", ["का","कि","की"], 1],
  ["कौन स्वर है?", ["क","अ","म"], 1],
  ["कमल किससे शुरू होता है?", ["क","ख","ग"], 0],
  ["Missing letter: A, B, __, D", ["A","C","E"], 1],
  ["🍎 किसका चित्र है?", ["आम","अनार","इमली"], 1],
  ["राम घर गया — यह क्या है?", ["शब्द","वाक्य","अक्षर"], 1]
];

function Section({ icon, title, subtitle, children, tone = "sky" }) {
  const tones = {
    sky: "border-[#cfe3ef] bg-gradient-to-br from-[#f3faff] to-white",
    purple: "border-[#e4d9ff] bg-gradient-to-br from-[#faf7ff] to-white",
    green: "border-[#d8eadf] bg-gradient-to-br from-[#f4fff7] to-white",
    amber: "border-[#f0dfc2] bg-gradient-to-br from-[#fffaf0] to-white",
    rose: "border-[#f3d9df] bg-gradient-to-br from-[#fff5f7] to-white"
  };
  return <section className={`rounded-[1.6rem] border-2 p-5 shadow-sm md:p-7 ${tones[tone]}`}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-lg font-black text-[#003366] md:text-xl">{title}</h3>
        {subtitle && <p className="text-xs font-bold text-zinc-500">{subtitle}</p>}
      </div>
    </div>
    <div className="mt-4">{children}</div>
  </section>;
}

function SoundButton({ text, label = "🔊 सुनें" }) {
  return <button type="button" onClick={() => speak(text)} className="rounded-full bg-[#003366] px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#0f4c81]">{label}</button>;
}

export default function PrimaryLettersLesson() {
  const [units, setUnits] = useState(100);
  const [activeConsonant, setActiveConsonant] = useState("क");
  const [gameAnswers, setGameAnswers] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});

  const quizScore = FINAL_QUIZ.reduce((n, [, , a], i) => n + (quizAnswers[i] === a ? 1 : 0), 0);
  const quizDone = Object.keys(quizAnswers).length === FINAL_QUIZ.length;
  const barakhadi = useMemo(() => ["क"].concat(BARAKHADI_MATRA.map(m => activeConsonant + m)), [activeConsonant]);

  return <div className="mt-6 space-y-6">
    <div className="overflow-hidden rounded-[1.8rem] border-2 border-[#cfe3ef] bg-gradient-to-br from-[#003366] via-[#0f4c81] to-[#007c91] p-6 text-white shadow-lg md:p-9">
      <div className="text-xs font-black uppercase tracking-[0.25em] text-white/70">Course 01 • Primary Education</div>
      <h2 className="mt-2 text-3xl font-black leading-tight md:text-5xl">🎓 Letters & Sounds<br /><span className="text-2xl md:text-3xl">अक्षर और ध्वनि</span></h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85 md:text-base">आज हम English और Hindi के अक्षरों को पहचानना, उनका सही उच्चारण करना और उनसे शब्द बनाना सीखेंगे।</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {["अक्षर पहचानना","अक्षर की आवाज़ समझना","अक्षर से शब्द बनाना","चित्र देखकर शब्द पहचानना","छोटे शब्द पढ़ना","स्वर, व्यंजन और मात्राएँ","बारहखड़ी पढ़ना"].map(g => <div key={g} className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold">✅ {g}</div>)}
      </div>
      <button type="button" onClick={() => speak("Let us learn letters and sounds. अक्षर और ध्वनि सीखते हैं।")} className="mt-5 rounded-2xl bg-white px-6 py-3 text-sm font-black text-[#003366] shadow-md">▶ Start Learning / सीखना शुरू करें</button>
    </div>

    <div className="overflow-hidden rounded-[1.8rem] border-2 border-[#cfe3ef] bg-white shadow-lg">
      <div className="border-b-2 border-[#dbeaf2] bg-gradient-to-r from-[#fff7d6] via-[#eefaff] to-[#f5efff] p-4 md:p-6">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#0f4c81]">Interactive Teaching Board / इंटरैक्टिव शिक्षण बोर्ड</div>
        <div className="mt-1 text-xl font-black text-[#003366]">👀 देखो → 🔊 सुनो → 👄 बोलो → 👉 पहचानो → ✍️ करो</div>
      </div>
    </div>

    <Section icon="📚" title="पूरा Course Path / Course Path" subtitle="15 modules — एक teacher की तरह step-by-step">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {["Meet the Letters","English Alphabet","Phonics","Picture Learning","Rhymes","Hindi स्वर","Hindi व्यंजन","मात्राएँ","बारहखड़ी","Word Building","Sentence Reading","Learning Games","Practice Worksheet","Knowledge Check","Revision & Achievement"].map((m, i) => <div key={m} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-black text-[#003366] shadow-sm"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8f4fa] text-xs">{i + 1}</span>{m}</div>)}
      </div>
    </Section>

    <Section icon="🔤" title="Module 2 — English Alphabet" subtitle="हर अक्षर का card: चित्र, शब्द, आवाज़" tone="purple">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ENGLISH.map(([l, emoji, w1, w2, w3, sound]) => <div key={l} className="rounded-[1.3rem] border-2 border-[#e4d9ff] bg-white p-4 text-center shadow-sm">
          <div className="text-4xl font-black text-[#7b2cbf] md:text-5xl">{l}<span className="text-2xl text-zinc-400"> {l.toLowerCase()}</span></div>
          <div className="my-2 text-4xl">{emoji}</div>
          <div className="text-sm font-black text-[#003366]">{w1}</div>
          <div className="text-[11px] font-bold text-zinc-500">{w2} • {w3}</div>
          <div className="mt-2 rounded-full bg-[#f3efff] px-3 py-1 text-xs font-black text-[#7b2cbf]">Sound {sound}</div>
          <div className="mt-3"><SoundButton text={`${l} ${l.toLowerCase()}, ${w1}`} /></div>
        </div>)}
      </div>
    </Section>

    <Section icon="🧩" title="Module 3 — Phonics (Sounds जोड़ो)" subtitle="C + A + T = CAT" tone="amber">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BLENDS.map((letters) => <div key={letters[4]} className="rounded-[1.3rem] border-2 border-[#f0dfc2] bg-white p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2">
            {letters.slice(0, 3).map((c, i) => <span key={i} className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#003366] text-2xl font-black text-white">{c}</span>)}
          </div>
          <div className="mt-2 text-sm font-black text-zinc-500">➡️</div>
          <div className="text-3xl font-black text-[#9a5b00]">{letters[4]}</div>
          <div className="text-3xl">{letters[3]}</div>
          <div className="mt-2"><SoundButton text={letters.slice(0, 3).join(", ") + ", " + letters[4]} label="🔊 Sounds जोड़ें" /></div>
        </div>)}
      </div>
      <p className="mt-4 rounded-xl bg-white p-4 text-sm font-bold text-zinc-700 shadow-sm">👉 नियम: हर letter की आवाज़ बोलो, फिर जोड़कर पूरा शब्द बनाओ — C(/k/) + A(/æ/) + T(/t/) ➡️ CAT 🐈</p>
    </Section>

    <Section icon="🖼️" title="Module 4 — Picture Learning" subtitle="चित्र देखकर शब्द पहचानो" tone="green">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[["🍎","Apple"],["🐱","Cat"],["🐶","Dog"],["☀️","Sun"],["🏠","House"]].map(([e, w]) => <div key={w} className="rounded-xl bg-white p-4 text-center shadow-sm"><div className="text-4xl">{e}</div><div className="mt-1 text-sm font-black text-[#177245]">{w}</div><button type="button" onClick={() => speak(w)} className="mt-2 text-xs font-black text-[#003366]">🔊</button></div>)}
      </div>
    </Section>

    <Section icon="🎵" title="Module 5 — Rhymes" subtitle="Listen 🔊 और Repeat 🎤" tone="rose">
      <div className="space-y-2">
        {["A says /æ/, Apple starts with A,","B says /b/, Ball we like to play!","C says /k/, Cat says meow,","D says /d/, Dog says bow-wow!"].map(r => <div key={r} className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 text-sm font-bold text-zinc-700 shadow-sm"><span>{r}</span><SoundButton text={r} label="🔊" /></div>)}
      </div>
    </Section>

    <Section icon="🇮🇳" title="Module 6 — Hindi स्वर / Vowels" subtitle="अ आ इ ई उ ऊ ए ऐ ओ औ अं" tone="purple">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SWAR.map(([l, e, w]) => <div key={l} className="rounded-xl border-2 border-[#e4d9ff] bg-white p-3 text-center shadow-sm"><div className="text-3xl font-black text-[#7b2cbf]">{l}</div><div className="my-1 text-3xl">{e}</div><div className="text-sm font-black text-[#003366]">{w}</div><button type="button" onClick={() => speak(`${l}, ${w}`)} className="mt-2 text-xs font-black text-[#7b2cbf]">🔊</button></div>)}
      </div>
    </Section>

    <Section icon="🅰️" title="Module 7 — Hindi व्यंजन / Consonants" subtitle="समूह में सीखो: क ख ग घ ङ" tone="amber">
      <div className="space-y-3">
        {VYANJAN_SETS.map((set, i) => <div key={i} className="flex flex-wrap gap-2">
          {set.map(v => <button key={v} type="button" onClick={() => speak(`${v}, ${VYANJAN_WORDS[v] || ""}`)} title={VYANJAN_WORDS[v]} className="flex min-w-[74px] flex-col items-center rounded-xl border-2 border-[#f0dfc2] bg-white px-3 py-2 shadow-sm transition hover:border-[#d90429]">
            <span className="text-2xl font-black text-[#9a5b00]">{v}</span>
            <span className="text-[10px] font-bold text-zinc-500">{VYANJAN_WORDS[v]}</span>
          </button>)}
        </div>)}
      </div>
    </Section>

    <Section icon="✍️" title="Module 8 — मात्राएँ / Matras" subtitle="व्यंजन चुनो और मात्रा जोड़कर देखो" tone="green">
      <div className="flex flex-wrap gap-2">
        {["क","ख","ग","म","र","स","न"].map(c => <button key={c} type="button" onClick={() => setActiveConsonant(c)} className={"rounded-xl px-4 py-2 text-lg font-black shadow-sm transition " + (activeConsonant === c ? "bg-[#177245] text-white" : "bg-white text-[#177245] border-2 border-[#d8eadf]")}>{c}</button>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {barakhadi.map((form) => <button key={form} type="button" onClick={() => speak(form)} className="rounded-xl border-2 border-[#d8eadf] bg-white px-4 py-3 text-xl font-black text-[#177245] shadow-sm transition hover:bg-[#f4fff7]">{form}</button>)}
      </div>
      <p className="mt-3 text-sm font-bold text-zinc-600">👉 {activeConsonant} + ा = {activeConsonant}ा • {activeConsonant} + ि = {activeConsonant}ि • {activeConsonant} + ी = {activeConsonant}ी</p>
    </Section>

    <Section icon="📖" title="Module 9 — बारहखड़ी" subtitle="क की बारहखड़ी — एक-एक करके सुनो" tone="sky">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {BARAKHADI.map(f => <button key={f} type="button" onClick={() => speak(f)} className="rounded-xl bg-white p-3 text-center shadow-sm transition hover:bg-[#f3faff]"><div className="text-2xl font-black text-[#0f4c81]">{f}</div><div className="text-[10px] font-bold text-zinc-500">🔊 सुनें</div></button>)}
      </div>
    </Section>

    <Section icon="📚" title="कहानी — राम और बंदर (Story)" subtitle="आसान शब्दों में कहानी पढ़ो और सुनो" tone="rose">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-base leading-8 text-zinc-700">
          एक था <b>राम</b>। राम के पास एक <b>बंदर</b> था। बंदर को <b>आम</b> बहुत पसंद था।<br/>
          एक दिन राम ने बंदर को <b>आम</b> दिया। बंदर खुश हुआ और <b>नाच</b>ने लगा।<br/>
          राम हँसा और बोला — “बंदर, तुम <b>अच्छे</b> हो!”
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["राम","बंदर","आम","नाच","अच्छे"].map(w => <button key={w} type="button" onClick={() => speak(w)} className="rounded-full bg-[#eef7fb] px-4 py-2 text-xs font-black text-[#003366]">🔊 {w}</button>)}
        </div>
        <div className="mt-3"><SoundButton text="एक था राम। राम के पास एक बंदर था। बंदर को आम बहुत पसंद था।" label="🔊 पूरी कहानी सुनें" /></div>
      </div>
    </Section>

    <Section icon="🧱" title="Module 10 — Word Building" subtitle="Letters जोड़कर शब्द बनाओ" tone="amber">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...BLENDS, ["क","म","ल","🌸","कमल"], ["घ","र","","🏠","घर"]].map((x) => {
          const letters = x.slice(0, 3).filter(Boolean);
          const word = x[4];
          return <div key={word} className="rounded-xl border-2 border-[#f0dfc2] bg-white p-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1">{letters.map((c, i) => <span key={i} className="rounded-lg bg-[#9a5b00] px-3 py-2 text-xl font-black text-white">{c}</span>)}</div>
            <div className="mt-2 text-2xl font-black text-[#9a5b00]">➡️ {word}</div>
            <div className="text-3xl">{x[3]}</div>
            <div className="mt-2"><SoundButton text={word} label="🔊 शब्द सुनें" /></div>
          </div>;
        })}
      </div>
    </Section>

    <Section icon="📕" title="Module 11 — Sentence Reading" subtitle="शब्द पढ़ लिए? अब वाक्य" tone="green">
      <div className="grid gap-3 sm:grid-cols-2">
        {SENTENCES.map(([s, e]) => <div key={s} className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm"><span className="text-2xl">{e}</span><span className="flex-1 text-base font-bold text-zinc-700">{s}</span><SoundButton text={s} label="🔊" /></div>)}
      </div>
    </Section>

    <Section icon="🎮" title="Module 12 — Learning Games" subtitle="खेल-खेल में जाँचो" tone="rose">
      <div className="grid gap-3 md:grid-cols-3">
        {Object.entries(GAMES).map(([key, g]) => <div key={key} className="rounded-xl border-2 border-[#f3d9df] bg-white p-4 shadow-sm">
          <div className="text-sm font-black text-zinc-700">{g.prompt}</div>
          <div className="mt-3 flex flex-wrap gap-2">{g.options.map(o => {
            const chosen = gameAnswers[key];
            const correct = chosen === o && o === g.answer;
            const wrong = chosen === o && o !== g.answer;
            return <button key={o} type="button" onClick={() => { setGameAnswers(a => ({ ...a, [key]: o })); if (o === g.answer) speak("Correct! " + o); }} className={"rounded-xl px-4 py-2 text-lg font-black shadow-sm transition " + (correct ? "bg-[#177245] text-white" : wrong ? "bg-[#d90429] text-white" : "bg-[#fafafa] text-[#003366] border-2 border-zinc-200")}>{o}</button>;
          })}</div>
          {gameAnswers[key] && <div className="mt-2 text-xs font-black">{gameAnswers[key] === g.answer ? "✅ सही!" : "❌ फिर कोशिश करें — सही उत्तर: " + g.answer}</div>}
        </div>)}
      </div>
    </Section>

    <Section icon="📝" title="Module 13 — Practice Worksheet" subtitle="हर module के बाद अभ्यास (printable)" tone="sky">
      <ol className="space-y-2">
        {WORKSHEET.map(([q, opts], i) => <li key={q} className="rounded-xl bg-white p-4 text-sm font-bold text-zinc-700 shadow-sm">
          <span className="font-black text-[#003366]">Q{i + 1}. </span>{q}
          <div className="mt-2 flex flex-wrap gap-2">{opts.map(o => <button key={o} type="button" onClick={() => speak(o)} className="rounded-lg border-2 border-zinc-200 px-3 py-1 text-xs font-black text-[#003366]">{o}</button>)}</div>
        </li>)}
      </ol>
    </Section>

    <Section icon="🧠" title="Module 14 — Knowledge Check" subtitle="10 प्रश्न — सही उत्तर चुनो" tone="purple">
      <div className="space-y-3">
        {FINAL_QUIZ.map(([q, opts, ans], i) => <div key={q} className="rounded-xl bg-white p-4 shadow-sm">
          <div className="text-sm font-black text-zinc-800">{i + 1}. {q}</div>
          <div className="mt-2 flex flex-wrap gap-2">{opts.map((o, oi) => {
            const chosen = quizAnswers[i];
            const correct = chosen === oi && oi === ans;
            const wrong = chosen === oi && oi !== ans;
            return <button key={o} type="button" onClick={() => { setQuizAnswers(a => ({ ...a, [i]: oi })); speak(o); }} className={"rounded-xl px-4 py-2 text-sm font-black shadow-sm transition " + (correct ? "bg-[#177245] text-white" : wrong ? "bg-[#d90429] text-white" : "bg-[#fafafa] text-[#003366] border-2 border-zinc-200")}>{o}</button>;
          })}</div>
        </div>)}
      </div>
      {quizDone && <div className={"mt-4 rounded-2xl p-5 text-center " + (quizScore >= 8 ? "bg-[#e7f7ef]" : "bg-[#fff5e6]")}>
        <div className="text-2xl font-black text-[#003366]">{quizScore >= 8 ? "🎉 Excellent!" : "👏 अच्छा प्रयास!"} {quizScore}/10</div>
        <div className="mt-2 text-sm font-bold text-zinc-600">{quizScore >= 8 ? "You completed: ✅ Alphabet ✅ Phonics ✅ Swar ✅ Vyanjan ✅ Matra ✅ Word Building" : "गलत उत्तर दोबारा करें और 8/10 लाएँ।"}</div>
      </div>}
    </Section>

    <Section icon="🏆" title="Module 15 — Revision + Achievement" subtitle="Course पूरा — अभ्यास जारी रखें" tone="green">
      <div className="text-center">
        <div className="text-4xl font-black text-[#177245]">🎓 Letters & Sounds Completed</div>
        <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-gradient-to-r from-[#177245] to-[#0a9396]" style={{ width: units + "%" }} /></div>
        <div className="mt-2 text-sm font-black text-zinc-600">{units}%</div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => { setQuizAnswers({}); setGameAnswers({}); setUnits(0); }} className="rounded-2xl border-2 border-[#177245] px-5 py-3 text-sm font-black text-[#177245]">Practice Again 🔄</button>
          <button type="button" onClick={() => setUnits(100)} className="rounded-2xl bg-[#177245] px-5 py-3 text-sm font-black text-white">Take Final Test 📝</button>
          <SoundButton text="शाबाश! अक्षर और ध्वनि पूरा हुआ।" label="Next: Reading Practice →" />
        </div>
      </div>
    </Section>

    <Section icon="🧑‍🏫" title="Parents & Teachers Guide / मार्गदर्शिका" subtitle="घर और कक्षा में कैसे सिखाएँ" tone="sky">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="text-sm font-black text-[#003366]">रोज़ 15 मिनट</div><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600"><li>5 मिनट अक्षर दोहराएँ</li><li>5 मिनट 🔇 बोलकर ध्वनि</li><li>5 मिनट लिखने का अभ्यास</li></ul></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="text-sm font-black text-[#003366]">घर पर अभ्यास</div><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600"><li>आसपास की चीज़ों के नाम बोलो</li><li>अनाज/ढक्कन गिनकर गिनती</li><li>बच्चे को 🔊 सुनें button दबाने दो</li></ul></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="text-sm font-black text-[#003366]">प्रगति जाँच</div><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600"><li>हर module बाद worksheet</li><li>10 में से 8 सही = आगे बढ़ें</li><li>गलती पर हँसें नहीं, दोबारा कराएँ</li></ul></div>
      </div>
      <p className="mt-4 rounded-xl bg-white p-4 text-sm font-bold text-zinc-700 shadow-sm">🎯 सिद्धांत: <b>Learn → See → Listen → Example → Practice → Activity → Quiz → Revision → Assessment → Completion</b>. बच्चे को लगे कि teacher step-by-step पढ़ा रहा है।</p>
    </Section>
  </div>;
}
