import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaHandsHelping, FaLaptop, FaBullhorn, FaArrowRight, FaTimes, FaBriefcase, FaCertificate, FaCode, FaRocket, FaDatabase } from "react-icons/fa";
import InternshipForm from "../components/InternshipForm";

export default function Internship() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const roles = [
    { icon: <FaBullhorn />, title: "Social Media & Marketing", hi: "सोशल मीडिया और मार्केटिंग", desc: "Create content, manage campaigns and help SSF reach a wider audience.", req: "Instagram, LinkedIn and basic Canva/design skills." },
    { icon: <FaLaptop />, title: "Content Writing & Blogging", hi: "कंटेंट राइटिंग और ब्लॉगिंग", desc: "Write articles, impact stories, newsletters and awareness content.", req: "Strong English and/or Hindi writing skills." },
    { icon: <FaBriefcase />, title: "Field Research & Impact", hi: "फील्ड रिसर्च और इम्पेक्ट", desc: "Support field data collection, project monitoring and community research.", req: "Willingness to travel and interact with communities." },
    { icon: <FaGraduationCap />, title: "Education & Mentorship", hi: "शिक्षा और मेंटरशिप", desc: "Support teaching programmes, learning modules and children’s mentorship.", req: "Interest in teaching and working with children." },
    { icon: <FaCode />, title: "Web Development & Tech", hi: "वेब डेवलपमेंट और टेक", desc: "Help build and maintain digital tools and the Foundation’s technology ecosystem.", req: "React, HTML/CSS, Node.js or data-management skills." }
  ];

  return <div className="w-full bg-white text-zinc-900 font-sans overflow-hidden">
    <section className="bg-[#001529] text-white pt-44 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-6">
          <p className="text-[#fb8500] font-black tracking-[.2em] uppercase text-sm">Internship Opportunities</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight">Learn, Lead, <span className="text-[#fb8500]">and Serve.</span></h1>
          <p className="text-lg md:text-2xl text-zinc-400 leading-relaxed max-w-3xl">Gain practical experience while contributing to meaningful social change with Swastik Srijan Foundation.</p>
          <div className="flex flex-wrap gap-5 text-zinc-300 text-sm font-bold"><span>• Real Projects</span><span>• Professional Mentorship</span><span>• Impact Certification</span></div>
        </motion.div>
      </div>
    </section>

    <section className="py-20 px-6 bg-zinc-50 border-y border-zinc-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12"><h2 className="text-3xl md:text-5xl font-black text-[#002344]">Internship के अवसर</h2><p className="text-zinc-500 mt-3">Choose the area where your skills can create the most impact.</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {roles.map((role, i) => <motion.article key={role.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }} className="bg-white p-7 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#fb8500] flex items-center justify-center text-2xl mb-6">{role.icon}</div>
            <h3 className="text-xl font-black text-[#002344]">{role.title}</h3><p className="text-sm font-bold text-zinc-400 mt-1 mb-5">{role.hi}</p>
            <p className="text-sm text-zinc-600 leading-relaxed mb-5">{role.desc}</p>
            <div className="pt-4 border-t border-zinc-100"><p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Expectation / पात्रता</p><p className="text-sm font-bold text-[#002344]">{role.req}</p></div>
          </motion.article>)}
        </div>
      </div>
    </section>

    <section className="py-20 px-6 bg-zinc-900 text-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div><p className="text-[#fb8500] font-black uppercase tracking-widest text-sm mb-4"><FaRocket className="inline mr-2" /> Digital Transformation</p><h2 className="text-4xl md:text-5xl font-black">Tech for <span className="text-[#fb8500]">Social Good.</span></h2><p className="text-zinc-400 text-lg leading-relaxed mt-5">Work with modern digital tools and help build technology that strengthens grassroots social impact.</p></div>
        <div className="grid sm:grid-cols-2 gap-5"><div className="p-6 rounded-2xl bg-white/5 border border-white/10"><FaCode className="text-3xl text-indigo-400 mb-4" /><h3 className="font-bold text-xl">Modern Stack</h3><p className="text-sm text-zinc-500 mt-2">React, Node.js and cloud-based NGO tools.</p></div><div className="p-6 rounded-2xl bg-white/5 border border-white/10"><FaDatabase className="text-3xl text-[#fb8500] mb-4" /><h3 className="font-bold text-xl">Data Impact</h3><p className="text-sm text-zinc-500 mt-2">Turn field information into useful insights.</p></div></div>
      </div>
    </section>

    <section className="py-20 px-6 bg-white"><div className="max-w-6xl mx-auto bg-[#001529] rounded-[2.5rem] p-8 md:p-14 text-white flex flex-col lg:flex-row items-center gap-10 shadow-2xl"><div className="flex-1"><p className="text-[#fb8500] text-xs font-black uppercase tracking-widest mb-3"><FaCertificate className="inline mr-2" /> Verified NGO Internship</p><h2 className="text-3xl md:text-5xl font-black">Start Your <span className="text-[#fb8500]">Social Career</span></h2><p className="text-zinc-400 mt-4 max-w-2xl">Students and professionals can apply for available internship opportunities with SSF.</p></div><button onClick={() => setIsFormOpen(true)} className="shrink-0 bg-[#fb8500] px-9 py-4 rounded-2xl font-black text-lg hover:bg-white hover:text-[#001529] transition-all flex items-center gap-3">Apply for Internship <FaArrowRight /></button></div></section>

    <section className="py-20 px-6 bg-[#001529] text-white"><div className="max-w-6xl mx-auto text-center"><h2 className="text-3xl md:text-5xl font-black mb-12">Internship Benefits | लाभ</h2><div className="grid sm:grid-cols-3 gap-8"><div><FaHandsHelping className="mx-auto text-4xl text-[#fb8500] mb-4" /><h3 className="font-bold text-xl">Real Impact</h3><p className="text-zinc-400 mt-2">Contribute to real grassroots initiatives.</p></div><div><FaGraduationCap className="mx-auto text-4xl text-[#fb8500] mb-4" /><h3 className="font-bold text-xl">Mentorship</h3><p className="text-zinc-400 mt-2">Learn from social-sector professionals.</p></div><div><FaCertificate className="mx-auto text-4xl text-[#fb8500] mb-4" /><h3 className="font-bold text-xl">Certification</h3><p className="text-zinc-400 mt-2">Receive an internship completion certificate as applicable.</p></div></div></div></section>

    <AnimatePresence>{isFormOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-[#001529]/80 backdrop-blur-md" /><motion.div initial={{ opacity: 0, scale: .95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 20 }} className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"><button onClick={() => setIsFormOpen(false)} aria-label="Close" className="sticky top-4 float-right mr-4 z-20 w-11 h-11 rounded-full bg-white border border-zinc-200 text-zinc-600 flex items-center justify-center shadow-lg hover:text-red-600"><FaTimes /></button><div className="clear-both"><InternshipForm onClose={() => setIsFormOpen(false)} /></div></motion.div></div>}</AnimatePresence>
  </div>;
}
