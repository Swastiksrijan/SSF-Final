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
    <section className="mx-auto mb-12 w-full max-w-7xl px-0">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.11] via-white/[0.045] to-transparent p-4 shadow-2xl sm:rounded-[2rem] sm:p-7 lg:p-9">
        <div className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full bg-white/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />

        <div className="relative mx-auto w-full max-w-4xl text-center">
          <div className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-black/30 px-3.5 py-2 text-xs text-white/70 shadow-lg sm:px-4 sm:text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-white/80" />
            <span className="truncate">Swastik Srijan Foundation • Blog &amp; Knowledge Hub</span>
          </div>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
            ज्ञान • जागरूकता • सेवा • सृजन
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:mt-5 sm:text-lg sm:leading-8">
            <span className="font-semibold text-white">हर दिन कुछ नया सीखें</span> —
            उपयोगी जानकारी, डिजिटल सुरक्षा, शिक्षा, स्वास्थ्य, पर्यावरण और सामाजिक पहल से जुड़ी कहानियाँ एक जगह।
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
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-white/90 active:scale-[0.98] sm:px-5 sm:text-base"
              >
                खोजें
              </button>
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

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.label}
                type="button"
                onClick={() => findAndScroll(category.queries)}
                className="group flex min-h-[70px] w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-white/30 sm:min-h-[76px] sm:px-4"
                aria-label={`${category.label} की संबंधित stories देखें`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-xl transition group-hover:bg-white/[0.12] sm:h-11 sm:w-11">
                  {category.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold leading-5 text-white/90">{category.label}</span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-white/35 transition group-hover:text-white/55">Stories देखें →</span>
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
  );
}
