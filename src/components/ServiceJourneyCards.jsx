import { motion } from "framer-motion";
import { FaSeedling, FaHandHoldingHeart, FaUsers, FaGraduationCap, FaBullhorn, FaBriefcase, FaFemale, FaHeartbeat, FaLeaf, FaLaptop, FaRocket, FaExternalLinkAlt } from "react-icons/fa";

const YEARS = [
  { year: "2013", title: "Foundation & Registration", hi: "स्थापना एवं पंजीयन", desc: "Registered beginning of the Swastik Srijan Foundation journey in Rewa, Madhya Pradesh.", icon: <FaSeedling />, tone: "orange" },
  { year: "2014", title: "Foundation Building", hi: "आधार निर्माण", desc: "Early community connections and groundwork for education, health and social awareness.", icon: <FaHandHoldingHeart />, tone: "blue" },
  { year: "2015", title: "Community Engagement", hi: "सामुदायिक सहभागिता", desc: "Continuing the foundation-building phase through community participation and social initiatives.", icon: <FaUsers />, tone: "green" },
  { year: "2016", title: "Learning & Awareness", hi: "शिक्षा एवं जागरूकता", desc: "Continued focus on learning, awareness and practical community-oriented support.", icon: <FaGraduationCap />, tone: "purple" },
  { year: "2017", title: "Strengthening Outreach", hi: "आउटरीच सुदृढ़ीकरण", desc: "Building stronger connections around inclusive development and community participation.", icon: <FaBullhorn />, tone: "pink" },
  { year: "2018", title: "Expanding Initiatives", hi: "पहल का विस्तार", desc: "Growing attention to education, health, skills and community empowerment.", icon: <FaBriefcase />, tone: "amber" },
  { year: "2019", title: "Social Development", hi: "सामाजिक विकास", desc: "Continuing community-oriented work with emphasis on skills, wellbeing and participation.", icon: <FaFemale />, tone: "cyan" },
  { year: "2020", title: "Standing With Communities", hi: "समुदायों के साथ सेवा", desc: "Community awareness, support and responsible social response during the COVID-19 period.", icon: <FaHeartbeat />, tone: "rose" },
  { year: "2021", title: "Adapting & Continuing", hi: "अनुकूलन एवं निरंतरता", desc: "Learning and support initiatives continued while adapting to changing community needs.", icon: <FaUsers />, tone: "teal" },
  { year: "2022", title: "Strengthening Community Work", hi: "सामुदायिक कार्य सुदृढ़ीकरण", desc: "Continued focus on awareness, learning, support and community participation.", icon: <FaHandHoldingHeart />, tone: "indigo" },
  { year: "2023", title: "Learning & Development", hi: "शिक्षा एवं विकास", desc: "Greater emphasis on learning, skills, awareness and practical community development.", icon: <FaGraduationCap />, tone: "sky" },
  { year: "2024", title: "Community Initiatives", hi: "सामुदायिक पहल", desc: "Continuing work across education, health, environment and community development areas.", icon: <FaLeaf />, tone: "lime" },
  { year: "2025", title: "Digital & Social Outreach", hi: "डिजिटल एवं सामाजिक जागरूकता", desc: "Wider use of digital tools and outreach for learning, awareness and participation.", icon: <FaLaptop />, tone: "violet" },
  { year: "2026", title: "Continuing the Mission", hi: "मिशन की निरंतरता", desc: "Current work continues around education, skills, health, awareness, community support and partnerships.", icon: <FaRocket />, tone: "red" }
];

const PHOTO_HIGHLIGHTS = [
  { id: "1QceaNSKbc8127uOvA4XJemT8y9DB93c4", label: "Activity Highlight 01" },
  { id: "1-hRdzPQZ2doslXWrZNtCaE6MlYfwS39Y", label: "Activity Highlight 02" },
  { id: "1bo4QhUfFgrmaSPAhBuUxYv2LiiR1u8vq", label: "Activity Highlight 03" },
  { id: "1mnxeCcIagsPGzFcBbtekK9B5LpGbVLLG", label: "Activity Highlight 04" },
  { id: "1a8VS3ThJNCO6_bmwlaD3bTxWd_L1123T", label: "Activity Highlight 05" },
  { id: "1Ear_De7MWSUBZnsMGALPClAoRZQIFMf3", label: "Activity Highlight 06" },
  { id: "1OJ9MwFO8wYEFwd8CrFpeQedBCteEDWmH", label: "Activity Highlight 07" }
].map((item) => ({
  ...item,
  image: `https://drive.google.com/uc?export=view&id=${item.id}`,
  view: `https://drive.google.com/file/d/${item.id}/view?usp=drivesdk`
}));

const TONES = {
  orange: "border-orange-200 bg-orange-50 text-orange-600",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  purple: "border-violet-200 bg-violet-50 text-violet-700",
  pink: "border-pink-200 bg-pink-50 text-pink-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  teal: "border-teal-200 bg-teal-50 text-teal-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  lime: "border-lime-200 bg-lime-50 text-lime-700",
  violet: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  red: "border-red-200 bg-red-50 text-red-700"
};

export default function ServiceJourneyCards() {
  return (
    <section className="py-20 bg-white overflow-hidden border-y border-zinc-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <span className="inline-flex px-5 py-2 rounded-full bg-[#002344] text-white text-[10px] font-black uppercase tracking-[0.25em]">2013 — 2026 • Detailed Journey</span>
          <h2 className="mt-5 text-3xl md:text-5xl font-serif font-bold text-[#002344]">SSF SERVICE JOURNEY <span className="text-[#FF6600]">| सेवा यात्रा</span></h2>
          <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">Year-by-year milestones, learning and community-oriented work across the continuing journey of SSF.</p>
        </div>

        <div className="mb-14">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-[#FF6600] font-black text-xs uppercase tracking-[0.2em]">SSF IN ACTION</span>
            <h3 className="mt-2 text-2xl md:text-4xl font-bold text-[#002344]">Our Work & Service Highlights</h3>
            <p className="mt-3 text-sm md:text-base text-zinc-500">संस्था की गतिविधियों और सेवा कार्यों की झलक</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHOTO_HIGHLIGHTS.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-full min-h-[260px] max-h-[520px] bg-zinc-50 flex items-center justify-center p-3">
                  <img
                    src={item.image}
                    alt={`Swastik Srijan Foundation ${item.label}`}
                    loading="lazy"
                    className="block w-full h-auto max-h-[500px] object-contain rounded-2xl"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF6600]">SSF • Activity</p>
                    <h4 className="mt-1 font-bold text-[#002344]">{item.label}</h4>
                  </div>
                  <a
                    href={item.view}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#002344] text-white px-4 py-2.5 text-xs font-bold hover:bg-[#FF6600] transition-colors"
                  >
                    View Full <FaExternalLinkAlt />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden py-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-white via-white/90 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-white via-white/90 to-transparent z-20" />
          <motion.div
            className="flex w-max gap-5 px-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 62, ease: "linear" } }}
          >
            {[...YEARS, ...YEARS].map((item, index) => (
              <motion.article
                key={`${item.year}-${index}`}
                className={`w-[285px] md:w-[330px] shrink-0 rounded-[1.75rem] border-2 p-6 md:p-7 shadow-lg ${TONES[item.tone]}`}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, delay: (index % YEARS.length) * 0.08, ease: "easeInOut" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="text-4xl md:text-5xl font-black tracking-tight">{item.year}</div>
                  <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center text-xl shadow-sm">{item.icon}</div>
                </div>
                <div className="mt-5 h-1.5 w-14 rounded-full bg-current opacity-70" />
                <h3 className="mt-5 text-xl font-black text-[#002344] leading-tight">{item.title}</h3>
                <p className="mt-2 text-sm font-bold opacity-80">{item.hi}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-600 bg-white/65 rounded-2xl p-4">{item.desc}</p>
                <div className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#002344]/55">SSF • Service • Learning • Awareness</div>
              </motion.article>
            ))}
          </motion.div>
        </div>
        <p className="mt-6 text-center text-[10px] text-zinc-400 font-bold uppercase tracking-[0.18em]">Auto-moving cards • लगातार चलने वाली सेवा यात्रा</p>
      </div>
    </section>
  );
}
