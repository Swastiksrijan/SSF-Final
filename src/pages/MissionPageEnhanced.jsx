import { motion } from "framer-motion";
import { FaArrowRight, FaBookOpen, FaHandsHelping, FaLightbulb, FaBullseye, FaGlobeAsia } from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import MissionPage from "./MissionPage";

function MissionEnhancement() {
  const pillars = [
    { icon: <FaHandsHelping />, title: "Support", hi: "सहयोग", text: "Encouraging practical support, participation and cooperation with communities." },
    { icon: <FaLightbulb />, title: "Skill", hi: "कौशल", text: "Promoting learning and practical skills that can strengthen confidence and opportunity." },
    { icon: <FaBookOpen />, title: "Awareness", hi: "जागरूकता", text: "Creating useful physical and online awareness for informed and responsible communities." },
    { icon: <FaBullseye />, title: "Creation", hi: "सृजन", text: "Turning positive ideas into constructive action, learning and meaningful community participation." },
  ];

  return (
    <>
      <MissionPage />

      <section className="py-20 bg-[#002344] text-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#fb8500] font-bold tracking-[0.2em] uppercase text-sm">SSF Guiding Pillars</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mt-2">From Vision to Meaningful Action</h2>
            <p className="text-zinc-300 mt-4 leading-relaxed">Our mission is expressed through cooperation, learning, awareness and constructive action—while keeping dignity, equal opportunity and service without discrimination at the centre.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-2xl bg-white/10 border border-white/10 p-6 hover:bg-white/[0.14] transition-all">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#fb8500] flex items-center justify-center text-xl mb-5">{item.icon}</div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-[#fb8500] font-semibold mt-1">{item.hi}</p>
                <p className="text-zinc-300 text-sm leading-relaxed mt-4">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 text-[#002344] text-sm font-bold shadow-sm"><FaGlobeAsia className="text-[#fb8500]" /> Working Across India</div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344] mt-6">A Mission Built for People</h2>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl mx-auto mt-5">SSF seeks to contribute to an inclusive and responsible society where education, health, skills, awareness and community participation can create practical opportunities for people and communities.</p>
          <p className="font-hindi text-zinc-500 mt-4">शिक्षा, स्वास्थ्य, कौशल, जागरूकता और सामुदायिक सहभागिता के माध्यम से समावेशी एवं जिम्मेदार समाज के निर्माण में योगदान देना हमारा निरंतर प्रयास है।</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/Objectives" className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#002344] text-white font-bold hover:bg-[#fb8500] transition-all">Explore Objectives <FaArrowRight /></Link>
            <Link to="/GetInvolved" className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border-2 border-[#002344] text-[#002344] font-bold hover:bg-[#002344] hover:text-white transition-all">Be Part of the Mission <FaArrowRight /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function MissionPageEnhanced() {
  return <MissionEnhancement />;
}
