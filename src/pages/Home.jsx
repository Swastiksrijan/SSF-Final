import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaHeart, FaArrowRight, FaUsers, FaGlobeAsia, FaHandshake, FaBullseye, FaHandsHelping, FaBookOpen, FaHeartbeat, FaLeaf, FaLightbulb, FaFileAlt, FaChartLine, FaUserPlus, FaLaptop, FaImages } from "react-icons/fa";
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

  const workHighlights = [
    { image: "/images/real/news_media_1.jpg", title: "News & Community Story", hi: "समाचार एवं सामाजिक पहल", text: "A media/news visual from SSF's documented community work material." },
    { image: "/images/real/classroom-floor-seating.jpg", title: "Community Learning", hi: "शिक्षा एवं सीखना", text: "Community-focused learning and educational engagement." },
    { image: "/images/real/cloth-distribution.jpg", title: "Community Support", hi: "सामुदायिक सहयोग", text: "A glimpse of community support and service-oriented outreach." }
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
          <div className="text-center mb-10"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">What we do</p><h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">Our Objectives</h2><p className="text-zinc-500 mt-3 max-w-3xl mx-auto">संस्था की नियमावली में निर्धारित व्यापक उद्देश्य — शिक्षा, कौशल, स्वास्थ्य, महिला एवं बाल विकास, पर्यावरण, ग्रामीण विकास, सामाजिक जागरूकता और अन्य सामुदायिक क्षेत्रों में All India स्तर पर कार्य की क्षमता।</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{objectives.map((item) => <motion.div key={item.no} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45 }} className="group relative overflow-hidden rounded-[1.6rem] border border-zinc-200 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-[#FF6600]/50 transition-all"><div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002344] via-[#FF6600] to-[#002344] opacity-80" /><div className="flex items-start justify-between gap-4"><div className="w-14 h-14 rounded-2xl bg-[#002344]/5 text-[#FF6600] flex items-center justify-center text-2xl group-hover:bg-[#FF6600] group-hover:text-white transition-colors">{item.icon}</div><span className="text-4xl font-black text-zinc-100 group-hover:text-[#002344]/10 transition-colors">{item.no}</span></div><h3 className="font-extrabold text-xl text-[#002344] mt-5 leading-snug">{item.title}</h3><p className="text-sm font-semibold text-[#FF6600] mt-1">{item.hi}</p><p className="text-sm text-zinc-500 leading-relaxed mt-3">{item.text}</p></motion.div>)}</div>
          <div className="mt-8 rounded-2xl border border-[#002344]/10 bg-[#002344]/[0.03] px-5 py-4 text-center text-sm text-zinc-600"><strong className="text-[#002344]">महत्वपूर्ण:</strong> ये संस्था के पंजीकृत उद्देश्यों के व्यापक क्षेत्र हैं। वास्तविक कार्यक्रम उपलब्ध संसाधनों, सहयोग, स्थानीय आवश्यकता और लागू कानूनों के अनुसार संचालित किए जाते हैं।</div>
        </div>
      </section>

      <section className="py-16 bg-[#002344] text-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10"><div><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">FROM OUR WORK | हमारे कार्यों की झलक</p><h2 className="text-3xl md:text-4xl font-bold mt-2">Real Work. Real Stories.</h2><p className="text-zinc-300 mt-3 max-w-2xl">Home page पर केवल उपलब्ध SSF work material की झलक — बिना अनावश्यक या अप्रमाणित impact claims के।</p></div><span className="inline-flex items-center gap-2 text-sm font-bold text-zinc-200"><FaImages className="text-[#FF6600]" /> Authentic SSF visuals</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{workHighlights.map((item, index) => <motion.article key={item.image} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ delay: index * 0.08, duration: 0.5 }} className="group overflow-hidden rounded-3xl bg-white text-[#002344] shadow-lg"><div className="aspect-[4/3] overflow-hidden bg-zinc-100"><img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div><div className="p-5"><p className="text-xs font-bold tracking-widest uppercase text-[#FF6600]">{item.hi}</p><h3 className="font-extrabold text-lg mt-1 leading-snug">{item.title}</h3><p className="text-sm text-zinc-500 mt-2 leading-relaxed">{item.text}</p></div></motion.article>)}</div>
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc] border-y border-zinc-100"><div className="container mx-auto px-4 max-w-6xl"><div className="text-center mb-10"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">OUR JOURNEY | हमारी यात्रा</p><h2 className="text-3xl md:text-4xl font-bold text-[#002344] mt-2">2013–2026 • A Journey of Service & Srijan</h2><p className="text-zinc-500 mt-3 max-w-3xl mx-auto">दिसंबर 2013 में पंजीकरण से लेकर 2026 तक — सेवा, सहयोग, सीखने, जागरूकता और सृजन की यात्रा।</p></div><div className="flex flex-wrap justify-center gap-3 mb-8">{annualJourney.map((year) => <span key={year} className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-sm font-bold text-[#002344] shadow-sm">{year}</span>)}</div><div className="grid md:grid-cols-3 gap-5"><div className="rounded-3xl bg-white border border-zinc-200 p-6 shadow-sm"><p className="text-xs font-bold tracking-widest uppercase text-[#FF6600]">Registered</p><h3 className="text-2xl font-extrabold text-[#002344] mt-2">December 2013</h3><p className="text-sm text-zinc-500 mt-2">Formal registration and the beginning of the organisation's documented journey.</p></div><div className="rounded-3xl bg-white border border-zinc-200 p-6 shadow-sm"><p className="text-xs font-bold tracking-widest uppercase text-[#FF6600]">Registration</p><h3 className="text-2xl font-extrabold text-[#002344] mt-2">05/22/03/11448/13</h3><p className="text-sm text-zinc-500 mt-2">Registered under the Madhya Pradesh Societies Registration Act, 1973.</p></div><div className="rounded-3xl bg-white border border-zinc-200 p-6 shadow-sm"><p className="text-xs font-bold tracking-widest uppercase text-[#FF6600]">Area of Work</p><h3 className="text-2xl font-extrabold text-[#002344] mt-2">All India</h3><p className="text-sm text-zinc-500 mt-2">The organisation's stated area of work is across India.</p></div></div></div></section>

      <EliteDonationCard />

      <section className="py-16 bg-white"><div className="container mx-auto px-4 max-w-6xl"><div className="rounded-[2rem] bg-[#002344] text-white p-8 md:p-12 shadow-xl"><div className="max-w-3xl"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">GET INVOLVED | जुड़ें</p><h2 className="text-3xl md:text-4xl font-bold mt-2">You Can Be Part of the Change.</h2><p className="text-zinc-300 mt-4 leading-relaxed">Join, volunteer or become a member and contribute your time, skills or support to meaningful community work.</p><div className="flex flex-wrap gap-4 mt-7"><button type="button" onClick={() => openAuth("signup")} className="px-7 py-3 rounded-full bg-[#FF6600] font-bold hover:bg-[#e65c00] transition">Join SSF</button><Link to="/Members" className="px-7 py-3 rounded-full bg-white text-[#002344] font-bold hover:bg-zinc-100 transition">Member Form</Link><Link to="/Volunteer" className="px-7 py-3 rounded-full border border-white/50 font-bold hover:bg-white hover:text-[#002344] transition">Volunteer</Link></div></div></div></div></section>

      <section className="py-16 bg-[#f8fafc] border-y border-zinc-100"><div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-8"><div className="rounded-3xl bg-white border border-zinc-200 p-8 shadow-sm"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">ABOUT SSF</p><h2 className="text-3xl font-bold text-[#002344] mt-2">Service • Skill • Motivation • Creation</h2><p className="text-zinc-600 mt-4 leading-relaxed">Swastik Srijan Foundation works to encourage education, skills, health, awareness, cooperation and community development. Our approach is rooted in service, transparency and constructive social action.</p></div><div className="rounded-3xl bg-[#002344] text-white p-8 shadow-sm"><p className="text-[#FF6600] font-bold text-sm tracking-[0.2em] uppercase">TRUST & PARTNERSHIP</p><h2 className="text-3xl font-bold mt-2">Work With Us</h2><p className="text-zinc-300 mt-4 leading-relaxed">We welcome responsible volunteers, members, institutions, companies, CSR partners, trainers and community organisations who want to contribute meaningfully.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/GetInvolved" className="px-6 py-3 rounded-full bg-white text-[#002344] font-bold">Explore Opportunities <FaArrowRight className="inline ml-1" /></Link></div></div></div></section>

      <ImpactTimeline />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </div>
  );
}
