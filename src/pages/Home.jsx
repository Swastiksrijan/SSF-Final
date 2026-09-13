import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaHeart, FaArrowRight, FaUsers, FaGlobeAsia, FaHandshake, FaBullseye, FaHandsHelping, FaBookOpen, FaLaptop, FaHeartbeat, FaLeaf, FaLightbulb, FaFileAlt, FaChartLine, FaUserPlus } from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import FloatingTicker from "../components/FloatingTicker";
import ImpactTimeline from "../components/ImpactTimeline";
import EliteDonationCard from "../components/EliteDonationCard";
import AuthModal from "../components/AuthModal";
import pageHeader from "../assets/page-header.jpg";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const openAuth = (mode = "signup") => { setAuthMode(mode); setAuthOpen(true); };

  const objectives = [
    { no: "01", title: "Education & Knowledge", hi: "शिक्षा एवं ज्ञान", text: "Primary to higher education, computer education, nursing, technical learning, competitive exam coaching, libraries and science activities.", icon: <FaBookOpen /> },
    { no: "02", title: "Skill Development & Livelihood", hi: "कौशल विकास एवं आजीविका", text: "Computer training, tailoring, vocational skills, self-employment, rural industries, khadi and village industries.", icon: <FaLightbulb /> },
    { no: "03", title: "Women & Child Development", hi: "महिला एवं बाल विकास", text: "Women empowerment, girl education, nutrition, child welfare, widow support and Self Help Groups (SHGs).", icon: <FaHandsHelping /> },
    { no: "04", title: "Health & Well-being", hi: "स्वास्थ्य एवं कल्याण", text: "Health awareness, AIDS and cancer awareness, nutrition, yoga, naturopathy, family welfare, de-addiction and rehabilitation.", icon: <FaHeartbeat /> },
    { no: "05", title: "Environment & Natural Resources", hi: "पर्यावरण एवं प्राकृतिक संसाधन", text: "Tree plantation, biodiversity, forest and natural resource conservation, medicinal plants, organic farming and natural energy.", icon: <FaLeaf /> },
    { no: "06", title: "Agriculture & Rural Development", hi: "कृषि एवं ग्रामीण विकास", text: "Farmer training, organic agriculture, animal husbandry, rural development, livelihood and gaushala-related support.", icon: <FaGlobeAsia /> },
    { no: "07", title: "Social Justice & Awareness", hi: "सामाजिक न्याय एवं जागरूकता", text: "Human rights, anti-corruption awareness, moral education, national unity, social harmony and responsible citizenship.", icon: <FaBullseye /> },
    { no: "08", title: "Disability, Elderly & Rehabilitation", hi: "दिव्यांग, वृद्धजन एवं पुनर्वास", text: "Support for persons with disabilities, children needing rehabilitation, elderly persons and vulnerable communities.", icon: <FaUsers /> },
    { no: "09", title: "Animal & Wildlife Protection", hi: "पशु एवं वन्यजीव संरक्षण", text: "Animal and bird protection, gaushala support and awareness for wildlife conservation.", icon: <FaLeaf /> },
    { no: "10", title: "Religious, Cultural & Creative", hi: "धार्मिक, सांस्कृतिक एवं रचनात्मक", text: "Bhajan, Sanskrit and music education, conferences, cultural programmes and community cultural activities.", icon: <FaHandshake /> }
  ];

  const annualJourney = ["2013–14", "2014–15", "2015–16", "2016–17", "2017–18", "2018–19", "2019–20", "2020–21", "2021–22", "2022–23", "2023–24", "2024–25", "2025–26"];

  return (
    <div className="w-full bg-white font-sans text-zinc-800">
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden bg-[#001529]">
        <div className="absolute inset-0 z-0"><OptimizedImage src={pageHeader} alt="Swastik Srijan Foundation community activity" className="w-full h-full object-cover brightness-[0.8] contrast-[1.08]" /><div className="absolute inset-0 bg-gradient-to-r from-[#001529] via-[#001529]/70 to-[#001529]/15" /></div>
        <div className="container mx-auto px-6 relative z-10 flex items-center h-full"><motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl space-y-7">
          <div className="flex items-center gap-3"><div className="h-[2px] w-12 bg-[#FF6600]" /><span className="text-white font-bold tracking-widest uppercase text-sm">Swastik Srijan Foundation Samiti</span></div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">Creating Change.<br />Inspiring Lives.<span className="block text-2xl md:text-4xl mt-4 font-normal text-zinc-100">सहयोग • कौशल • जागरूकता • सृजन</span></h1>
          <p className="max-w-2xl text-lg md:text-xl text-zinc-100 leading-relaxed">Working for inclusive community development across India through education, skills, health, awareness and meaningful partnerships.</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2"><button type="button" onClick={() => openAuth("signup")} className="px-8 py-4 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#e65c00] transition-all shadow-xl text-lg text-center">Join SSF</button><Link to="/Members" className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#002344] transition-all text-lg text-center inline-flex items-center justify-center gap-2"><FaUserPlus /> Member Form</Link><Link to="/Volunteer" className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/70 text-white font-bold rounded-full hover:bg-white hover:text-[#002344] transition-all text-lg text-center">Volunteer</Link><a href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view" target="_blank" rel="noreferrer noopener" className="px-8 py-4 bg-white text-[#002344] font-bold rounded-full hover:bg-zinc-100 transition-all text-lg text-center">Donate <FaHeart className="inline ml-2 text-[#FF6600]" /></a></div>
        </motion.div></div>
      </section>

      <div className="bg-[#002344] text-zinc-300 py-3 text-center text-xs md:text-sm font-medium border-t border-white/10"><div className="container mx-auto px-4">Registered NGO | Registered December 2013 | Reg. No. 05/22/03/11448/13 | Rewa, Madhya Pradesh | Working Across India</div></div>
      <FloatingTicker />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">What we do</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">Our Objectives</h2>
            <p className="text-zinc-500 mt-3 max-w-3xl mx-auto">संस्था की नियमावली में निर्धारित व्यापक उद्देश्य — शिक्षा, कौशल, स्वास्थ्य, महिला एवं बाल विकास, पर्यावरण, ग्रामीण विकास, सामाजिक जागरूकता और अन्य सामुदायिक क्षेत्रों में All India स्तर पर कार्य की क्षमता।</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {objectives.map((item) => (
              <motion.div key={item.no} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45 }} className="group relative overflow-hidden rounded-[1.6rem] border border-zinc-200 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-[#FF6600]/50 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002344] via-[#FF6600] to-[#002344] opacity-80" />
                <div className="flex items-start justify-between gap-4"><div className="w-14 h-14 rounded-2xl bg-[#002344]/5 text-[#FF6600] flex items-center justify-center text-2xl group-hover:bg-[#FF6600] group-hover:text-white transition-colors">{item.icon}</div><span className="text-4xl font-black text-zinc-100 group-hover:text-[#002344]/10 transition-colors">{item.no}</span></div>
                <h3 className="font-extrabold text-xl text-[#002344] mt-5 leading-snug">{item.title}</h3><p className="text-sm font-semibold text-[#FF6600] mt-1">{item.hi}</p><p className="text-sm text-zinc-500 leading-relaxed mt-3">{item.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-[#002344]/10 bg-[#002344]/[0.03] px-5 py-4 text-center text-sm text-zinc-600"><strong className="text-[#002344]">महत्वपूर्ण:</strong> ये संस्था के पंजीकृत उद्देश्यों के व्यापक क्षेत्र हैं। वास्तविक कार्यक्रम उपलब्ध संसाधनों, सहयोग, स्थानीय आवश्यकता और लागू कानूनों के अनुसार संचालित किए जाते हैं।</div>
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc] border-y border-zinc-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">OUR JOURNEY | हमारी यात्रा</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">2013–2026 • A Journey of Service & Srijan</h2>
            <p className="text-zinc-500 mt-3 max-w-3xl mx-auto">दिसंबर 2013 में पंजीकरण से लेकर 2026 तक — सेवा, सहयोग, सीखने, जागरूकता और सृजन की निरंतर यात्रा। नीचे प्रत्येक वर्ष को report-style annual record के रूप में प्रस्तुत किया गया है।</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8"><span className="rounded-full bg-white border border-zinc-200 px-5 py-2 text-sm font-bold text-[#002344]">Registered: December 2013</span><span className="rounded-full bg-white border border-zinc-200 px-5 py-2 text-sm font-bold text-[#002344]">Reg. No. 05/22/03/11448/13</span><span className="rounded-full bg-white border border-zinc-200 px-5 py-2 text-sm font-bold text-[#002344]">Area of Work: All India</span></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {annualJourney.map((year, index) => (
              <motion.div key={year} initial={{ opacity: 0, y: 22, scale: .96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (index % 4) * .07, duration: .45 }} className="group relative overflow-hidden bg-white rounded-2xl border border-zinc-200 p-5 min-h-[170px] shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-[#FF6600]/50 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#002344] group-hover:bg-[#FF6600] transition-colors" />
                <div className="flex items-center justify-between"><span className="w-10 h-10 rounded-xl bg-[#002344] text-white flex items-center justify-center text-sm group-hover:bg-[#FF6600] transition-colors"><FaFileAlt /></span><span className="text-[11px] font-black tracking-widest text-zinc-300">RECORD {String(index + 1).padStart(2, "0")}</span></div>
                <div className="mt-5"><motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * .07 + .12 }} className="text-2xl md:text-3xl font-black tracking-tight text-[#002344]">{year}</motion.div><div className="flex items-end gap-1.5 h-7 mt-3" aria-hidden="true">{[35,55,42,68,50,76].map((h,i)=><motion.span key={i} initial={{ height: 0 }} whileInView={{ height: `${Math.max(25, h - (index % 3) * 6)}%` }} viewport={{ once: true }} transition={{ delay: .18 + i * .04 }} className="flex-1 rounded-t bg-[#002344]/15 group-hover:bg-[#FF6600]/35" />)}</div><div className="flex items-center justify-between mt-3"><span className="text-xs font-semibold text-zinc-500">Annual record</span><FaChartLine className="text-[#FF6600] text-sm" /></div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-transparent"><div className="container mx-auto px-4"><EliteDonationCard /></div></section>

      <section className="py-16 bg-[#f8fafc]"><div className="container mx-auto px-4 max-w-6xl"><div className="text-center mb-9"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">Get involved</p><h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">You Can Be Part of the Change</h2><p className="text-zinc-500 mt-3 max-w-2xl mx-auto">Join the SSF community, become a member, volunteer your skills or support meaningful work.</p></div><div className="grid md:grid-cols-3 gap-5"><button type="button" onClick={() => openAuth("signup")} className="text-left bg-white rounded-2xl p-7 border border-zinc-200 hover:shadow-xl hover:-translate-y-1 transition-all"><div className="text-[#FF6600] text-3xl mb-4"><FaUsers /></div><h3 className="text-xl font-bold text-[#002344]">Join SSF</h3><p className="text-zinc-500 mt-2">Create your SSF account and begin your journey with the organisation.</p><span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#FF6600]">Create account <FaArrowRight /></span></button><Link to="/Members" className="bg-white rounded-2xl p-7 border border-zinc-200 hover:shadow-xl hover:-translate-y-1 transition-all"><div className="text-[#FF6600] text-3xl mb-4"><FaUserPlus /></div><h3 className="text-xl font-bold text-[#002344]">Member Form</h3><p className="text-zinc-500 mt-2">Apply for membership through the dedicated SSF member form.</p><span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#FF6600]">Open member form <FaArrowRight /></span></Link><Link to="/Volunteer" className="bg-white rounded-2xl p-7 border border-zinc-200 hover:shadow-xl hover:-translate-y-1 transition-all"><div className="text-[#FF6600] text-3xl mb-4"><FaHandsHelping /></div><h3 className="text-xl font-bold text-[#002344]">Volunteer</h3><p className="text-zinc-500 mt-2">Share your time, knowledge or skills with community initiatives.</p><span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#FF6600]">Become a volunteer <FaArrowRight /></span></Link></div></div></section>

      <section className="py-16 bg-[#002344] text-white"><div className="container mx-auto px-4 max-w-6xl"><div className="grid lg:grid-cols-2 gap-10 items-center"><div><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">About SSF</p><h2 className="text-3xl md:text-4xl font-bold mt-2">Serving Communities, Creating Possibilities</h2><p className="text-zinc-300 leading-relaxed mt-5 max-w-3xl">Established in December 2013, Swastik Srijan Foundation works with communities across India through education, skills, health, awareness, digital learning, women and child welfare, environment and community participation.</p><div className="grid sm:grid-cols-3 gap-4 mt-8"><div className="rounded-2xl bg-white/5 border border-white/10 p-5"><FaBullseye className="text-[#FF6600] text-2xl mb-3" /><h3 className="font-bold">Mission</h3><p className="text-sm text-zinc-400 mt-1">Inclusive development through meaningful action.</p></div><div className="rounded-2xl bg-white/5 border border-white/10 p-5"><FaHandsHelping className="text-[#FF6600] text-2xl mb-3" /><h3 className="font-bold">Approach</h3><p className="text-sm text-zinc-400 mt-1">Support, skill, motivation, awareness and creation.</p></div><div className="rounded-2xl bg-white/5 border border-white/10 p-5"><FaHandshake className="text-[#FF6600] text-2xl mb-3" /><h3 className="font-bold">Values</h3><p className="text-sm text-zinc-400 mt-1">Transparency, cooperation and service without discrimination.</p></div></div></div><div className="rounded-3xl bg-white/5 border border-white/10 p-8"><h3 className="text-2xl font-bold">Transparency & Partnership</h3><p className="text-zinc-300 leading-relaxed mt-4">SSF welcomes responsible individuals, institutions, companies and community partners who want to contribute to sustainable social development.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/Members" className="rounded-full bg-white text-[#002344] px-6 py-3 font-bold hover:bg-zinc-100 transition-colors">Member Form</Link><Link to="/Volunteer" className="rounded-full bg-[#FF6600] text-white px-6 py-3 font-bold hover:bg-[#e65c00] transition-colors">Volunteer</Link></div></div></div></div></section>

      <ImpactTimeline />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} mode={authMode} />
    </div>
  );
}
