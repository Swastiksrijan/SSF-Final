import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaHeart, FaArrowRight, FaCheckCircle, FaUsers, FaGlobeAsia, FaHandshake, FaBullseye, FaHandsHelping, FaBookOpen, FaLaptop, FaHeartbeat, FaLeaf, FaLightbulb } from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import FloatingTicker from "../components/FloatingTicker";
import ImpactTimeline from "../components/ImpactTimeline";
import EliteDonationCard from "../components/EliteDonationCard";
import AuthModal from "../components/AuthModal";
import { CONTACT_INFO } from "../config/contact";
import pageHeader from "../assets/page-header.jpg";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const openAuth = (mode) => { setAuthMode(mode); setAuthOpen(true); };
  const focusAreas = [
    { title: "Education & Learning", hi: "शिक्षा एवं सीखना", icon: <FaBookOpen />, path: "/OurInitiatives" },
    { title: "Skill & Livelihood", hi: "कौशल एवं आजीविका", icon: <FaLightbulb />, path: "/SkillPrograms" },
    { title: "Health & Well-being", hi: "स्वास्थ्य एवं कल्याण", icon: <FaHeartbeat />, path: "/OurInitiatives#health" },
    { title: "Women & Child Welfare", hi: "महिला एवं बाल कल्याण", icon: <FaHandsHelping />, path: "/OurInitiatives" },
    { title: "Digital Learning", hi: "डिजिटल शिक्षा", icon: <FaLaptop />, path: "/LearningHub" },
    { title: "Environment & Awareness", hi: "पर्यावरण एवं जागरूकता", icon: <FaLeaf />, path: "/OurInitiatives#awareness" }
  ];
  const objectives = [
    { title: "Education & Knowledge", hi: "शिक्षा एवं ज्ञान", icon: <FaBookOpen /> },
    { title: "Skill Development & Livelihood", hi: "कौशल विकास एवं आजीविका", icon: <FaLightbulb /> },
    { title: "Women & Child Development", hi: "महिला एवं बाल विकास", icon: <FaHandsHelping /> },
    { title: "Health & Well-being", hi: "स्वास्थ्य एवं कल्याण", icon: <FaHeartbeat /> },
    { title: "Environment & Natural Resources", hi: "पर्यावरण एवं प्राकृतिक संसाधन", icon: <FaLeaf /> },
    { title: "Agriculture & Rural Development", hi: "कृषि एवं ग्रामीण विकास", icon: <FaGlobeAsia /> },
    { title: "Social Justice & Awareness", hi: "सामाजिक न्याय एवं जागरूकता", icon: <FaBullseye /> },
    { title: "Disability, Elderly & Rehabilitation", hi: "दिव्यांग, वृद्धजन एवं पुनर्वास", icon: <FaUsers /> },
    { title: "Animal & Wildlife Protection", hi: "पशु एवं वन्यजीव संरक्षण", icon: <FaLeaf /> },
    { title: "Religious, Cultural & Creative", hi: "धार्मिक, सांस्कृतिक एवं रचनात्मक", icon: <FaHandshake /> }
  ];
  const glanceCards = [
    { text: "2013–2026", sub: "Service Journey", hi: "सेवा यात्रा", icon: <FaHeart className="text-[#FF6600] text-3xl" /> },
    { text: "December 2013", sub: "Registered Foundation", hi: "पंजीकृत संस्था", icon: <FaBullseye className="text-[#002344] text-3xl" /> },
    { text: "Reg. No. 05/22/03/11448/13", sub: "Registration Number", hi: "पंजीयन क्रमांक", icon: <FaCheckCircle className="text-[#002344] text-3xl" /> },
    { text: "Pan India", sub: "Area of Work", hi: "कार्य क्षेत्र", icon: <FaGlobeAsia className="text-[#002344] text-3xl" /> }
  ];
  const quickActions = [
    { title: "Join SSF", text: "Become part of the journey", action: () => openAuth("signup"), icon: <FaUsers /> },
    { title: "Volunteer", text: "Give your time and skills", path: "/Volunteer", icon: <FaHandsHelping /> },
    { title: "Support Our Work", text: "Help create meaningful change", path: "/Donate", icon: <FaHeart /> }
  ];
  return (
    <div className="w-full bg-white font-sans text-zinc-800">
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden bg-[#001529]">
        <div className="absolute inset-0 z-0"><OptimizedImage src={pageHeader} alt="Swastik Srijan Foundation community activity" className="w-full h-full object-cover brightness-[0.8] contrast-[1.08]" /><div className="absolute inset-0 bg-gradient-to-r from-[#001529] via-[#001529]/70 to-[#001529]/15" /></div>
        <div className="container mx-auto px-6 relative z-10 flex items-center h-full"><motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-4xl space-y-7">
          <div className="flex items-center gap-3"><div className="h-[2px] w-12 bg-[#FF6600]" /><span className="text-white font-bold tracking-widest uppercase text-sm">Swastik Srijan Foundation Samiti</span></div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">Creating Change.<br />Inspiring Lives.<span className="block text-2xl md:text-4xl mt-4 font-normal text-zinc-100">सहयोग • कौशल • जागरूकता • सृजन</span></h1>
          <p className="max-w-2xl text-lg md:text-xl text-zinc-100 leading-relaxed">Working for inclusive community development across India through education, skills, health, awareness and meaningful partnerships.</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2"><button type="button" onClick={() => openAuth("signup")} className="px-8 py-4 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#e65c00] transition-all shadow-xl text-lg text-center">Join SSF</button><Link to="/Members" className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#002344] transition-all text-lg text-center">Member</Link><Link to="/Volunteer" className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/70 text-white font-bold rounded-full hover:bg-white hover:text-[#002344] transition-all text-lg text-center">Volunteer</Link><a href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view" target="_blank" rel="noreferrer noopener" className="px-8 py-4 bg-white text-[#002344] font-bold rounded-full hover:bg-zinc-100 transition-all text-lg text-center">Donate <FaHeart className="inline ml-2 text-[#FF6600]" /></a></div>
        </motion.div></div>
      </section>
      <div className="bg-[#002344] text-zinc-300 py-3 text-center text-xs md:text-sm font-medium border-t border-white/10"><div className="container mx-auto px-4">Registered NGO | Registered December 2013 | Reg. No. 05/22/03/11448/13 | Rewa, Madhya Pradesh | Working Across India</div></div>
      <FloatingTicker />
      <section className="py-14 bg-zinc-50 border-y border-zinc-200"><div className="container mx-auto px-4 max-w-6xl"><div className="text-center mb-9"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">SSF at a glance</p><h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">A Journey of Service Since 2013</h2></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{glanceCards.map((item,index)=><motion.div key={index} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*0.08}} className="bg-white p-7 rounded-2xl shadow-sm hover:shadow-lg transition-shadow text-center border border-zinc-100 flex flex-col items-center"><div className="mb-4">{item.icon}</div><h3 className="text-2xl md:text-3xl font-extrabold text-zinc-800 mb-1">{item.text}</h3><p className="text-zinc-600 font-bold uppercase text-xs md:text-sm tracking-wider">{item.sub}</p><p className="text-zinc-400 text-xs mt-1">{item.hi}</p></motion.div>)}</div></div></section>
      <section className="py-16 bg-white"><div className="container mx-auto px-4 max-w-6xl"><div className="text-center mb-10"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">What we do</p><h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">Our Focus Areas</h2><p className="text-zinc-500 mt-3 max-w-2xl mx-auto">Our work brings together education, skills, health, awareness and community participation to support inclusive development.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{focusAreas.map((item,index)=><Link key={index} to={item.path} className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#FF6600]/40 hover:shadow-xl transition-all"><div className="w-12 h-12 rounded-xl bg-[#002344]/5 text-[#FF6600] flex items-center justify-center text-xl mb-5 group-hover:bg-[#FF6600] group-hover:text-white transition-colors">{item.icon}</div><h3 className="font-bold text-lg text-[#002344]">{item.title}</h3><p className="text-sm text-zinc-500 mt-1">{item.hi}</p><span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#FF6600]">Explore <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></span></Link>)}</div></div></section>
      <section className="py-12 bg-[#002344] overflow-hidden"><div className="container mx-auto px-4 max-w-6xl"><div className="text-center mb-7"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">OUR OBJECTIVES</p><h2 className="text-2xl md:text-3xl font-bold text-white mt-2">Our Registered Objectives • संस्था के उद्देश्य</h2><p className="text-zinc-300 text-sm mt-2">संस्था की नियमावली में निर्धारित व्यापक कार्य क्षेत्र</p></div><div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] py-5"><div className="flex w-max animate-[scroll_28s_linear_infinite] hover:[animation-play-state:paused]">{[...objectives, ...objectives].map((item,index)=><div key={`${item.title}-${index}`} className="w-[260px] sm:w-[300px] mx-2 shrink-0 rounded-2xl bg-white p-5 shadow-lg"><div className="flex items-center gap-3"><div className="w-11 h-11 shrink-0 rounded-xl bg-[#002344]/5 text-[#FF6600] flex items-center justify-center text-xl">{item.icon}</div><div><h3 className="font-bold text-[#002344] text-sm leading-snug">{item.title}</h3><p className="text-xs text-zinc-500 mt-1">{item.hi}</p></div></div></div>)}</div></div><p className="text-center text-zinc-400 text-xs mt-4">Auto slider • Hover करने पर रुकेगा</p></div><style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style></section>
      <section className="py-12 bg-transparent"><div className="container mx-auto px-4"><EliteDonationCard /></div></section>
      <section className="py-16 bg-[#f8fafc]"><div className="container mx-auto px-4 max-w-6xl"><div className="text-center mb-9"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">Get involved</p><h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">You Can Be Part of the Change</h2></div><div className="grid md:grid-cols-3 gap-5">{quickActions.map((item,i)=>item.action ? <button key={i} type="button" onClick={item.action} className="text-left bg-white rounded-2xl p-7 border border-zinc-200 hover:shadow-xl hover:-translate-y-1 transition-all"><div className="text-[#FF6600] text-3xl mb-4">{item.icon}</div><h3 className="text-xl font-bold text-[#002344]">{item.title}</h3><p className="text-zinc-500 mt-2">{item.text}</p><span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#FF6600]">Get started <FaArrowRight /></span></button> : <Link key={i} to={item.path} className="bg-white rounded-2xl p-7 border border-zinc-200 hover:shadow-xl hover:-translate-y-1 transition-all"><div className="text-[#FF6600] text-3xl mb-4">{item.icon}</div><h3 className="text-xl font-bold text-[#002344]">{item.title}</h3><p className="text-zinc-500 mt-2">{item.text}</p><span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#FF6600]">Get started <FaArrowRight /></span></Link>)}</div></div></section>
      <section className="py-20 bg-white"><div className="container mx-auto px-4 max-w-5xl"><div className="text-center mb-10"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">About SSF</p><h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">Serving Communities, Creating Possibilities</h2><div className="w-20 h-1 bg-[#FF6600] mx-auto rounded-full mt-5" /></div><div className="text-lg text-zinc-600 leading-relaxed text-center"><p>Swastik Srijan Foundation is a registered non-government organization established in December 2013, working with communities across India. We believe meaningful social change grows through participation, learning, skills, awareness and cooperation.</p><div className="grid md:grid-cols-3 gap-5 text-left mt-10">{[["Our Mission","To contribute to inclusive development through education, skills, health, awareness and community participation."],["Our Approach","We value practical action, awareness, learning and cooperation with communities and partners."],["Our Values","Transparency, dignity, inclusion and service without discrimination guide our work."]].map(([title,text])=><div key={title} className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100"><h3 className="font-bold text-[#002344] text-lg">{title}</h3><p className="text-sm text-zinc-500 mt-2 leading-relaxed">{text}</p></div>)}</div></div></div></section>
      <section className="py-16 bg-zinc-50"><div className="container mx-auto px-4 max-w-5xl"><div className="text-center mb-10"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">Transparency & Partnership</p><h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">Work With Us for Meaningful Impact</h2><p className="text-zinc-500 mt-3 max-w-2xl mx-auto">We welcome volunteers, institutions, companies, trainers and community partners who want to contribute responsibly.</p></div><div className="grid md:grid-cols-3 gap-5">{[["Individuals","Volunteer, learn, support or share skills.","/Volunteer"],["Institutions","Explore partnerships, internships and learning initiatives.","/GetInvolved"],["Supporters","Contribute through transparent giving and collaboration.","/Donate"]].map(([title,text,path])=><Link key={title} to={path} className="p-7 rounded-2xl bg-white border border-zinc-200 hover:shadow-xl transition-all"><h3 className="font-bold text-[#002344] text-xl">{title}</h3><p className="text-zinc-500 mt-2 text-sm leading-relaxed">{text}</p><span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[#FF6600]">Explore <FaArrowRight /></span></Link>)}</div></div></section>
      <ImpactTimeline />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </div>
  );
}
