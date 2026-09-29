import { useState } from "react";

const CATEGORIES = [
  { label: "Awareness", hi: "जागरूकता", icon: "💡", intro: "जागरूकता सही जानकारी को समझकर जिम्मेदार व्यवहार में बदलने की शुरुआत है।", points: ["सामाजिक और नागरिक जिम्मेदारी समझें", "अधिकार और कर्तव्य के बारे में जानें", "गलत सूचना और अफवाह से सावधान रहें", "महत्वपूर्ण विषयों पर तथ्य आधारित जानकारी लें"], action: "किसी जानकारी को आगे साझा करने से पहले उसके स्रोत और संदर्भ की जाँच करें।" },
  { label: "Education & Skill", hi: "शिक्षा एवं कौशल", icon: "🎓", intro: "शिक्षा केवल जानकारी प्राप्त करना नहीं, बल्कि ज्ञान को उपयोगी कौशल और बेहतर निर्णय में बदलना है।", points: ["अध्ययन और सीखने की अच्छी आदतें", "English और communication skills", "Digital और workplace skills", "Career और practical skill development"], action: "एक छोटा skill चुनें, नियमित अभ्यास करें और सीखी हुई बात को वास्तविक जीवन में उपयोग करें।" },
  { label: "Safety", hi: "सुरक्षा", icon: "🛡️", intro: "सुरक्षा का अर्थ जोखिम को पहले पहचानना और सही समय पर सावधानी बरतना है।", points: ["घर और आसपास के सामान्य जोखिम", "आग, बिजली और emergency preparedness", "बच्चों और परिवार की सुरक्षा", "आपात स्थिति में शांत और सुरक्षित प्रतिक्रिया"], action: "Emergency contacts और जरूरी safety information पहले से तैयार रखें।" },
  { label: "Health", hi: "स्वास्थ्य", icon: "❤️", intro: "स्वास्थ्य जागरूकता का उद्देश्य स्वस्थ आदतों, स्वच्छता और समय पर उचित स्वास्थ्य सलाह के महत्व को समझना है।", points: ["स्वच्छता और healthy daily habits", "Preventive health awareness", "पोषण और शारीरिक सक्रियता", "लक्षणों या चिंता की स्थिति में qualified health professional से सलाह"], action: "सामान्य जानकारी को व्यक्तिगत medical diagnosis का विकल्प न मानें।" },
  { label: "Environment", hi: "पर्यावरण", icon: "🌱", intro: "पर्यावरण की रक्षा केवल बड़े अभियानों से नहीं, बल्कि रोज़मर्रा की जिम्मेदार आदतों से भी होती है।", points: ["जल और ऊर्जा संरक्षण", "कचरा कम करना और सही disposal", "पेड़-पौधों और स्थानीय biodiversity की देखभाल", "स्वच्छ और जिम्मेदार community practices"], action: "अपने घर और समुदाय में एक ऐसा छोटा कदम चुनें जिसे नियमित रूप से निभाया जा सके।" },
  { label: "SSF Activities", hi: "SSF गतिविधियाँ", icon: "🤝", intro: "Swastik Srijan Foundation की वास्तविक initiatives, learning activities और community-oriented efforts को समझें।", points: ["SSF के programmes और initiatives", "शिक्षा, स्वास्थ्य, skills और awareness से जुड़े प्रयास", "Volunteer और community participation", "कार्य से मिली सीख और आगे की दिशा"], action: "SSF गतिविधियों की जानकारी में केवल documented और verified information पर भरोसा करें।" },
  { label: "Digital Safety", hi: "डिजिटल सुरक्षा", icon: "🔐", intro: "Digital safety का मतलब अपने accounts, devices, documents और personal information को online risks से सुरक्षित रखना है।", points: ["Strong passwords और two-factor authentication", "OTP, PIN और sensitive information की सुरक्षा", "Phishing, fake links और online scams पहचानना", "UPI, social media और device security"], action: "OTP, PIN या password किसी व्यक्ति के साथ साझा न करें और संदिग्ध links पर तुरंत click न करें।" },
  { label: "Students & Youth", hi: "विद्यार्थी एवं युवा", icon: "🚀", intro: "युवाओं के लिए शिक्षा के साथ communication, confidence, digital skills और career readiness भी महत्वपूर्ण हैं।", points: ["Career planning और job readiness", "Resume, interview और professional communication", "Confidence और public speaking", "Time management, teamwork और leadership basics"], action: "एक लक्ष्य तय करें और उसे छोटे weekly learning tasks में बाँटकर लगातार अभ्यास करें।" },
  { label: "Knowledge & Awareness", hi: "ज्ञान एवं जागरूकता", icon: "📚", intro: "यह section रोज़मर्रा के जीवन में उपयोगी knowledge को सरल भाषा और practical examples के साथ समझने के लिए है।", points: ["महत्वपूर्ण concepts की सरल व्याख्या", "Safety और first-response awareness", "Digital और social awareness", "जानकारी को व्यवहार में लागू करने के तरीके"], action: "हर लेख से 2–3 मुख्य बातें नोट करें और देखें कि उन्हें अपने जीवन में कहाँ उपयोग किया जा सकता है।" },
  { label: "Social Impact", hi: "सामाजिक प्रभाव", icon: "🤝", intro: "सामाजिक प्रभाव को समझने के लिए समस्या, community participation, प्रयास और उससे मिली सीख को साथ देखना जरूरी है।", points: ["Community needs और challenges", "Education, health और livelihood initiatives", "Volunteer और local participation", "Responsible और sustainable community action"], action: "किसी social issue को समझने से पहले स्थानीय परिस्थितियों और उपलब्ध तथ्य को जानें।" },
  { label: "Learning & Responsibility", hi: "सीख एवं जिम्मेदारी", icon: "🌱", intro: "सीख तब सार्थक होती है जब वह जिम्मेदार व्यवहार, discipline और positive action में दिखाई दे।", points: ["Self-learning और continuous improvement", "Discipline और time management", "Teamwork और leadership", "परिवार, समाज और environment के प्रति जिम्मेदारी"], action: "हर सप्ताह एक सीखी हुई बात को व्यवहार में लागू करने का छोटा लक्ष्य रखें।" },
  { label: "Public Awareness", hi: "जन-जागरूकता", icon: "📢", intro: "जन-जागरूकता का उद्देश्य public-interest information को सरल, जिम्मेदार और उपयोगी तरीके से लोगों तक पहुँचाना है।", points: ["Public safety और community awareness", "महत्वपूर्ण alerts और campaigns", "सही जानकारी को जिम्मेदारी से साझा करना", "समुदाय में सकारात्मक participation"], action: "किसी public message को forward करने से पहले उसकी authenticity और source की जाँच करें।" },
];

function findAndScroll(queries) {
  if (typeof document === "undefined" || !queries?.length) return;
  const terms = Array.isArray(queries) ? queries : [queries];
  const elements = Array.from(document.querySelectorAll("h1,h2,h3,h4,p,article,section"));

  for (const term of terms) {
    const match = elements.find((el) => el.textContent?.toLowerCase().includes(term.toLowerCase()));
    if (match) {
      match.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }
}

export default function BlogHubHeader() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const submit = (event) => {
    event.preventDefault();
    findAndScroll(query.trim());
  };

  return (
    <>
    <section className="mx-auto mb-12 w-full max-w-7xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.11] via-white/[0.045] to-transparent p-4 shadow-2xl sm:rounded-[2rem] sm:p-7 lg:p-9">
        <div className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full bg-white/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />

        <div className="relative mx-auto w-full max-w-4xl text-center">
          <div className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-black/30 px-3.5 py-2 text-xs text-white/70 shadow-lg sm:px-4 sm:text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-white/80" />
            <span className="truncate">Swastik Srijan Foundation • Blog &amp; Knowledge Hub</span>
          </div>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">ज्ञान • जागरूकता • सेवा • सृजन</h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:mt-5 sm:text-lg sm:leading-8">
            <span className="font-semibold text-white">हर दिन कुछ नया सीखें</span> — उपयोगी जानकारी, डिजिटल सुरक्षा, शिक्षा, स्वास्थ्य, पर्यावरण और सामाजिक पहल से जुड़ी कहानियाँ एक जगह।
          </p>

          <form onSubmit={submit} className="mx-auto mt-6 w-full max-w-2xl sm:mt-8">
            <div className="flex min-h-14 w-full items-center gap-1.5 rounded-2xl border border-white/15 bg-black/45 p-1.5 shadow-xl backdrop-blur-sm focus-within:border-white/35 sm:gap-2">
              <span className="hidden pl-2 text-lg text-white/45 sm:block sm:pl-3">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Story खोजें… जैसे OTP, शिक्षा, पर्यावरण"
                aria-label="Blog story search"
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/40 sm:text-base"
              />
              <button type="submit" className="shrink-0 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-white/90 active:scale-[0.98] sm:px-5 sm:text-base">खोजें</button>
            </div>
          </form>
        </div>

        <div className="relative mt-8 sm:mt-10">
          <div className="mb-4 flex items-end justify-between gap-3 px-1">
            <div className="min-w-0 text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">Explore</p>
              <h2 className="mt-1 text-base font-bold sm:text-xl">विषय के अनुसार पढ़ें</h2>
            </div>
            <span className="shrink-0 text-[11px] text-white/40 sm:text-xs">12 Categories</span>
          </div>

          {/* Every category is a compact card. Desktop: 4 columns. Tablet: 3 columns. Mobile: 2 columns. */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.label}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="group flex min-h-[92px] w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/25 px-2.5 py-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-white/30 sm:min-h-[104px] sm:px-3"
                aria-label={`${category.label} की पूरी जानकारी और सीख देखें`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-xl transition group-hover:bg-white/[0.12] sm:h-11 sm:w-11">{category.icon}</span>
                <span className="mt-2 w-full min-w-0">
                  <span className="block truncate text-xs font-semibold leading-5 text-white/90 sm:text-sm">{category.label}</span>
                  <span className="mt-0.5 block text-[10px] leading-4 text-white/35 transition group-hover:text-white/55 sm:text-[11px]">पूरी जानकारी →</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/[0.07] pt-5 text-[11px] text-white/40 sm:mt-7 sm:gap-x-5 sm:pt-6 sm:text-xs">
          <span>📚 Knowledge</span>
          <span>🤝 Social Impact</span>
          <span>🌱 Learning</span>
          <span>📢 Public Awareness</span>
        </div>
      </div>
    </section>

      {activeCategory && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4 py-6" onClick={() => setActiveCategory(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-white text-[#002344] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#002344]/[0.06] text-2xl">{activeCategory.icon}</span><div><p className="text-xs font-bold uppercase tracking-wider text-[#fb8500]">SSF Knowledge & Awareness</p><h2 className="text-xl font-black sm:text-2xl">{activeCategory.label} / {activeCategory.hi}</h2></div></div>
              <button type="button" onClick={() => setActiveCategory(null)} aria-label="Close" className="rounded-full border border-zinc-200 px-3 py-2 text-xl leading-none text-zinc-600 hover:bg-zinc-100">×</button>
            </div>
            <div className="p-6 sm:p-8"><p className="text-base leading-8 text-zinc-700 sm:text-lg">{activeCategory.intro}</p>
              <div className="mt-7 rounded-2xl bg-[#F4F8FB] p-5 sm:p-6"><h3 className="text-lg font-extrabold">क्या जानें / What you will learn</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-700 sm:text-base">{activeCategory.points.map((point) => <li key={point} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#fb8500]" />{point}</li>)}</ul></div>
              <div className="mt-6 rounded-2xl border border-[#fb8500]/25 bg-[#fff8f1] p-5 sm:p-6"><h3 className="text-lg font-extrabold">मुख्य सीख / Practical Learning</h3><p className="mt-3 leading-7 text-zinc-700">{activeCategory.action}</p></div>
              <p className="mt-6 text-sm leading-6 text-zinc-500">इस विषय से संबंधित SSF Blog stories और Learning Hub resources को आगे पढ़ें। जानकारी को अपने संदर्भ में उपयोग करते समय उचित स्रोत और विशेषज्ञ सलाह को प्राथमिकता दें।</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

  );