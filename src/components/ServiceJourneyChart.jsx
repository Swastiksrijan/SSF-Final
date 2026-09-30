import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";

const YEARS = [
  { year: 2013, label: "Foundation & Registration", hi: "स्थापना एवं पंजीयन" },
  { year: 2014, label: "Service Journey", hi: "सेवा यात्रा" },
  { year: 2015, label: "Community Work", hi: "सामुदायिक कार्य" },
  { year: 2016, label: "Learning & Awareness", hi: "शिक्षा एवं जागरूकता" },
  { year: 2017, label: "Foundation Building", hi: "आधार निर्माण" },
  { year: 2018, label: "Social Initiatives", hi: "सामाजिक पहल" },
  { year: 2019, label: "Community Outreach", hi: "सामुदायिक पहुंच" },
  { year: 2020, label: "Standing With Communities", hi: "समुदायों के साथ सेवा" },
  { year: 2021, label: "Strengthening Community Work", hi: "सामुदायिक कार्य सुदृढ़ीकरण" },
  { year: 2022, label: "Community Development", hi: "सामुदायिक विकास" },
  { year: 2023, label: "Learning & Development", hi: "शिक्षा एवं विकास" },
  { year: 2024, label: "Learning & Community Development", hi: "शिक्षा एवं सामुदायिक विकास" },
  { year: 2025, label: "Digital & Social Outreach", hi: "डिजिटल एवं सामाजिक जागरूकता" },
  { year: 2026, label: "Continuing The Mission", hi: "मिशन की निरंतरता" },
];

export default function ServiceJourneyChart({ compact = false }) {
  const [selectedYear, setSelectedYear] = useState(2026);
  const selected = YEARS.find((item) => item.year === selectedYear) || YEARS[YEARS.length - 1];

  return (
    <section className={compact ? "py-16 px-6 bg-white" : "py-24 px-6 bg-zinc-50 border-y border-zinc-100"}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-[#FF6600] text-[10px] font-bold uppercase tracking-[0.2em]">
            <FaCalendarAlt /> 2013 — 2026
          </div>
          <h2 className="mt-4 text-3xl md:text-5xl font-serif font-bold text-[#002344]">
            SSF <span className="text-[#FF6600]">Service Journey</span>
          </h2>
          <p className="mt-3 text-zinc-500 max-w-2xl mx-auto">
            A year-by-year view of our continuing journey of service, learning, awareness and community development.
          </p>
          <p className="mt-2 text-sm font-hindi text-zinc-400">सेवा, सीखने, जागरूकता और सामुदायिक विकास की निरंतर यात्रा</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-xl p-5 md:p-8 overflow-hidden">
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[900px]">
              <div className="flex items-end gap-2 md:gap-3 h-64 border-b border-zinc-200 px-2">
                {YEARS.map((item, index) => {
                  const active = item.year === selectedYear;
                  return (
                    <button
                      key={item.year}
                      type="button"
                      onClick={() => setSelectedYear(item.year)}
                      aria-label={`View ${item.year} service journey`}
                      className="group flex-1 h-full flex flex-col justify-end items-center gap-2 focus:outline-none"
                    >
                      <motion.div
                        initial={{ opacity: 0, scaleY: 0.5 }}
                        whileInView={{ opacity: 1, scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.03, duration: 0.35 }}
                        className={`w-full max-w-12 rounded-t-xl transition-all duration-300 origin-bottom ${active ? "h-44 bg-[#FF6600] shadow-lg" : "h-28 bg-[#002344]/15 group-hover:h-36 group-hover:bg-[#002344]/30"}`}
                      />
                      <span className={`text-xs md:text-sm font-black ${active ? "text-[#FF6600]" : "text-[#002344]"}`}>{item.year}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-7 grid md:grid-cols-[1fr_auto] gap-6 items-center rounded-3xl bg-zinc-50 border border-zinc-100 p-6 md:p-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF6600]">Selected year • {selected.year}</div>
              <h3 className="mt-2 text-2xl md:text-3xl font-serif font-bold text-[#002344]">{selected.label}</h3>
              <p className="mt-1 text-lg font-hindi text-zinc-500">{selected.hi}</p>
              <p className="mt-3 text-sm text-zinc-500">The visual shows the continuity of SSF's journey; it is not a beneficiary or financial-performance chart.</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-[#FF6600] shadow-sm text-xl font-black">
              {String(selected.year).slice(2)}
            </div>
          </div>

          {!compact && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
              <span>2013: Registered foundation • Rewa, Madhya Pradesh</span>
              <span>2026: Continuing the mission across India</span>
              <a href="/Impact" className="inline-flex items-center gap-2 font-bold text-[#002344] hover:text-[#FF6600] transition-colors">
                Explore Impact <FaArrowRight />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
