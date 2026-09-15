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
    <section className="max-w-6xl mx-auto mb-12">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 sm:p-8 shadow-2xl">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white/60 mb-3">SSF Blog</p>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">ज्ञान • जागरूकता • सेवा • सृजन</h1>
          <p className="mt-4 text-white/70 text-sm sm:text-base leading-7">
            हर दिन कुछ नया सीखें — उपयोगी जानकारी, सामाजिक जागरूकता और SSF की गतिविधियों की कहानियाँ एक जगह।
          </p>

          <form onSubmit={submit} className="mt-7 flex gap-2 max-w-2xl mx-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Story खोजें… जैसे OTP, शिक्षा, पर्यावरण"
              aria-label="Blog story search"
              className="min-w-0 flex-1 rounded-2xl bg-black/50 border border-white/15 px-4 py-3.5 text-white placeholder:text-white/40 outline-none focus:border-white/40"
            />
            <button type="submit" className="rounded-2xl px-5 py-3.5 bg-white text-black font-semibold hover:bg-white/90 transition">
              🔍 खोजें
            </button>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.label}
              type="button"
              onClick={() => findAndScroll(category.queries)}
              className="rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-left hover:bg-white/10 hover:border-white/25 transition"
              aria-label={`${category.label} की संबंधित stories देखें`}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="block mt-1 text-sm font-medium">{category.label}</span>
              <span className="block mt-1 text-[11px] text-white/40">Stories देखें →</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
