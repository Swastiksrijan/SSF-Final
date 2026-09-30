import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export default function InstitutionalDNA() {
  return (
    <main className="min-h-screen bg-white">
      {/* ================= HERO SECTION (LIGHT THEME) ================= */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden bg-white">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#fb8500]/5 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-[#002344]/5 rounded-full blur-[150px]"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="text-[#fb8500] font-bold uppercase tracking-[0.3em] text-xs px-4 py-2 bg-[#fb8500]/10 rounded-full inline-block">
              Foundational Identity
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-[#002344] leading-[1.1]">
              Institutional <br /> <span className="text-[#fb8500]">DNA</span>
            </h1>
            <p className="text-zinc-500 mt-12 text-2xl md:text-3xl font-medium leading-relaxed max-w-3xl mx-auto font-serif italic">
              "The foundational framework of our organization — the base upon which our thoughts, decisions, and social responsibilities are built."
            </p>
            <p className="text-zinc-400 text-sm italic">
              संस्था का मूल वैचारिक ढाँचा — यह वह आधार है जिस पर हमारी सोच, निर्णय और सामाजिक उत्तरदायित्व निर्मित होता है।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= DNA PILLARS GRID ================= */}
      <section className="py-24 bg-[#f8f9fa] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Identity",
                subtitle: "अस्तित्व",
                desc: "The organization is for society, by society, and with society.",
                pillar: "01",
                color: "from-[#fb8500] to-[#ff9e00]"
              },
              {
                title: "Guidance",
                subtitle: "मार्गदर्शन",
                desc: "Every step is driven by a clear vision and ethical purpose.",
                pillar: "02",
                color: "from-[#002344] to-[#004d99]"
              },
              {
                title: "Ethics",
                subtitle: "नैतिकता",
                desc: "Honesty and transparency are the pillars of our work culture.",
                pillar: "03",
                color: "from-[#d90429] to-[#ef233c]"
              },
              {
                title: "Nation",
                subtitle: "राष्ट्र",
                desc: "We consider social participation in nation-building as our duty.",
                pillar: "04",
                color: "from-[#2d6a4f] to-[#40916c]"
              },
              {
                title: "Workflow",
                subtitle: "कार्यशैली",
                desc: "A collaborative, sensitive, and results-oriented approach.",
                pillar: "05",
                color: "from-[#fb8500] to-[#ff9e00]"
              },
              {
                title: "Focus",
                subtitle: "लक्षित समाज",
                desc: "Deprived and underserved communities are at our core.",
                pillar: "06",
                color: "from-[#002344] to-[#004d99]"
              },
              {
                title: "Nature",
                subtitle: "प्रकृति",
                desc: "Balance between environment, animals, and human life is essential.",
                pillar: "07",
                color: "from-[#2d6a4f] to-[#40916c]"
              },
              {
                title: "Stability",
                subtitle: "स्थिरता",
                desc: "The organization operates within all legal and institutional frameworks.",
                pillar: "08",
                color: "from-[#d90429] to-[#ef233c]"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${item.color}`}></div>
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-5xl font-serif font-black text-zinc-50 group-hover:text-zinc-100 transition-colors">
                      {item.pillar}
                    </span>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}></div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[#fb8500] text-[10px] font-bold uppercase tracking-widest">{item.subtitle}</p>
                      <h3 className="text-2xl font-serif font-bold text-[#002344]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-zinc-500 font-medium leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VISION & MISSION (RE-STYLED) ================= */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[4rem] overflow-hidden shadow-2xl border border-zinc-100">
            {/* Vision Half */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#002344] p-16 md:p-24 text-white relative flex flex-col justify-center"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
              <p className="text-[#fb8500] font-bold uppercase tracking-[0.3em] text-xs mb-10">The Vision</p>
              <h4 className="text-4xl md:text-5xl font-serif font-bold leading-tight italic">
                "To build an inclusive society where every individual has access to education, health, dignity, and opportunities for self-reliance."
              </h4>
              <p className="text-[#fb8500]/60 text-sm mt-8 italic">
                "एक ऐसा समावेशी समाज जहाँ प्रत्येक व्यक्ति को शिक्षा, स्वास्थ्य, सम्मान और आत्मनिर्भरता का अवसर प्राप्त हो।"
              </p>
            </motion.div>

            {/* Mission Half */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-16 md:p-24 text-[#002344] flex flex-col justify-center"
            >
              <p className="text-[#d90429] font-bold uppercase tracking-[0.3em] text-xs mb-10">Our Mission</p>
              <ul className="space-y-8">
                {[
                  "Quality Education & Skill Development",
                  "Women & Child Empowerment",
                  "Health, Nutrition & Awareness",
                  "Environment & Animal Protection"
                ].map((li, idx) => {
                  const hindiLIs = [
                    "गुणवत्तापूर्ण शिक्षा एवं कौशल विकास",
                    "महिला एवं बाल सशक्तिकरण",
                    "स्वास्थ्य, पोषण एवं जागरूकता",
                    "पर्यावरण एवं पशु संरक्षण"
                  ];
                  return (
                    <li key={idx} className="flex items-center gap-6 group">
                      <div className="w-12 h-12 rounded-2xl bg-[#f8f9fa] flex items-center justify-center text-[#fb8500] font-bold group-hover:bg-[#fb8500] group-hover:text-white transition-all shadow-sm">
                        {idx + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-serif font-bold opacity-80 group-hover:opacity-100 transition-opacity">{li}</span>
                        <span className="text-sm opacity-50 italic">{hindiLIs[idx]}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION ================= */}
      <section className="py-40 bg-white px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-serif font-bold text-[#002344]"
          >
            Sowing Seeds <br /> of <span className="text-[#fb8500]">Change.</span>
          </motion.h2>
          <p className="text-xl md:text-2xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
            "Your support is our strength. Together, we are taking steps towards a better and stronger India."
          </p>
          <p className="text-zinc-400 text-sm italic">
            हमारी शक्ति, आपका सहयोग। इसी मूल मंत्र के साथ हम एक बेहतर भारत की ओर कदम बढ़ा रहे हैं।
          </p>
          <div className="flex flex-wrap justify-center gap-8 pt-10">
            <Link to="/Volunteer" className="btn-primary px-16 py-6 text-xl">
              Be a Part of It
            </Link>
            <Link to="/Campaign" className="btn-secondary px-16 py-6 text-xl">
              Explore More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
