import { useState } from "react";

const CATEGORIES = [
  { label: "Awareness", icon: "💡", queries: ["जागरूकता", "awareness"] },
  { label: "Education & Skill", icon: "🎓", queries: ["शिक्षा", "education", "skill", "कौशल"] },
  { label: "Safety", icon: "🛡️", queries: ["सुरक्षा", "safety", "सुरक्षित"] },
  { label: "Health", icon: "❤️", queries: ["स्वास्थ्य", "health", "चिकित्सा"] },
  { label: "Environment", icon: "🌱", queries: ["पर्यावरण", "environment", "पेड़", "वृक्ष"] },
  { label: "SSF Activities", icon: "🤝", queries: ["SSF", "Swastik Srijan", "गतिविधि", "पहल"] },
  { label: "Digital Safety", icon: "🔐", queries: ["OTP", "UPI", "QR Code", "Password", "डिजिटल"] },
  { label: "Students & Youth", icon: "🚀", queries: ["विद्यार्थी", "student", "youth", "छात्र", "युवा"] },
  { label: "Knowledge & Awareness", icon: "📚", queries: ["Knowledge & Awareness", "First-Aid", "OTP", "जागरूकता"] },
  { label: "Social Impact", icon: "🤝", queries: ["Social Impact", "सामाजिक", "समाज", "सहायता"] },
  { label: "Learning & Responsibility", icon: "🌱", queries: ["Learning & Responsibility", "सीख", "सीखें", "जिम्मेदारी", "शिक्षा"] },
  { label: "Public Awareness", icon: "📢", queries: ["Public Awareness", "जन-जागरूकता", "जागरूकता", "awareness"] },
];

function findAndScroll(queries) {
  if (typeof document === "undefined" || !queries?.length) return;
  const terms = Array.isArray(queries) ? queries : [queries];
  const elements = Array.from(document.querySelectorAll("h1,h2,h3,h4,p,article,section"));

  for (const term of terms) {
    const match = elements.find((el) =>
      el.textContent?.toLowerCase().includes(term.toLowerCase())
    );
    if (match) {
      match.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }
}

export default function BlogHubHeader() {
  const [query, setQuery] = useState("");

  const submit = (event) => {
    event.preventDefault();
    findAndScroll(query.trim());
  };

  return (
    <section className="max-w-7xl mx-auto mb-12">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.11] via-white/[0.045] to-transparent p-5 sm:p-8 lg:p-10 shadow-2xl">
        <div className="pointer-events-none absolute -top-28 -left-20 h-64 w-64 rounded-full bg-white/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />

        <div className="relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs sm:text-sm text-white/70 shadow-lg">
            <span className="h-2 w-2 rounded-full bg-white/80" />
            Swastik Srijan Foundation • Blog & Knowledge Hub
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            ज्ञान • जागरूकता • सेवा • सृजन
          </h1>

          <p className="mt-5 text-base sm:text-lg text-white/70 leading-8 max-w-3xl mx-auto">
            <span className="text-white font-semibold">हर दिन कुछ नया सीखें</span> —
            उपयोगी जानकारी, डिजिटल सुरक्षा, शिक्षा, स्वास्थ्य, पर्यावरण और सामाजिक पहल से जुड़ी कहानियाँ एक जगह।
          </p>

          <form onSubmit={submit} className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/45 p-1.5 shadow-xl backdrop-blur-sm focus-within:border-white/35">
              <span className="pl-3 text-lg text-white/45">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Story खोजें… जैसे OTP, शिक्षा, पर्यावरण"
                aria-label="Blog story search"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-white placeholder:text-white/40 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-white px-5 py-3 font-bold text-black hover:bg-white/90 active:scale-[0.98] transition"
              >
                खोजें
              </button>
            </div>
          </form>
        </div>

        <div className="relative mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Explore</p>
              <h2 className="mt-1 text-lg sm:text-xl font-bold">विषय के अनुसार पढ़ें</h2>
            </div>
            <span className="text-xs text-white/40">12 Categories</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category.label}
                type="button"
                onClick={() => findAndScroll(category.queries)}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-3.5 py-3.5 text-left hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label={`${category.label} की संबंधित stories देखें`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-xl group-hover:bg-white/[0.12] transition">
                  {category.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white/90">{category.label}</span>
                  <span className="block mt-0.5 text-[11px] text-white/35 group-hover:text-white/55">Stories देखें →</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/40">
          <span>📚 Knowledge</span>
          <span>🤝 Social Impact</span>
          <span>🌱 Learning</span>
          <span>📢 Public Awareness</span>
        </div>
      </div>
    </section>
  );
}
