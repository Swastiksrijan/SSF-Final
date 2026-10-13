import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  FaHeart, FaArrowRight, FaCheckCircle, FaUsers, FaGlobeAsia, FaHandshake,
  FaBullseye, FaHandsHelping, FaBookOpen, FaLaptop, FaHeartbeat, FaLeaf,
  FaLightbulb, FaGraduationCap, FaShieldAlt, FaFileAlt, FaBuilding, FaCompass
} from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import FloatingTicker from "../components/FloatingTicker";
import ImpactTimeline from "../components/ImpactTimeline";
import EliteDonationCard from "../components/EliteDonationCard";
import AuthModal from "../components/AuthModal";
import pageHeader from "../assets/page-header.jpg";

const focusAreas = [
  { title: "Education & Learning", hi: "शिक्षा एवं सीखना", icon: <FaBookOpen />, path: "/OurInitiatives" },
  { title: "Skills & Livelihoods", hi: "कौशल एवं आजीविका", icon: <FaLightbulb />, path: "/SkillPrograms" },
  { title: "Health & Well-being", hi: "स्वास्थ्य एवं कल्याण", icon: <FaHeartbeat />, path: "/OurInitiatives#health" },
  { title: "Women & Child Welfare", hi: "महिला एवं बाल कल्याण", icon: <FaHandsHelping />, path: "/OurInitiatives" },
  { title: "Digital Learning", hi: "डिजिटल शिक्षा", icon: <FaLaptop />, path: "/LearningHub" },
  { title: "Environment & Awareness", hi: "पर्यावरण एवं जागरूकता", icon: <FaLeaf />, path: "/OurInitiatives#awareness" },
];

const partnershipCards = [
  { eyebrow: "FOR CORPORATES & INSTITUTIONS", title: "CSR & Institutional Partnerships", hi: "सीएसआर एवं संस्थागत साझेदारी", text: "Explore collaboration opportunities, project proposals and ways to work together for inclusive community development.", icon: <FaHandshake />, path: "/CSRPartnership", action: "Explore partnerships" },
  { eyebrow: "PROGRAMMES & PROPOSALS", title: "Projects & Initiatives", hi: "परियोजनाएँ एवं पहल", text: "Learn about SSF’s focus areas and proposed initiatives. Future plans are distinguished from programmes currently in operation.", icon: <FaBuilding />, path: "/UpcomingProjects", action: "Explore initiatives" },
  { eyebrow: "OPEN INSTITUTIONAL INFORMATION", title: "Transparency & Documents", hi: "पारदर्शिता एवं दस्तावेज़", text: "Find available institutional information, policies and reports. Each document should link to its own verified record.", icon: <FaShieldAlt />, path: "/Transparency", action: "View transparency" },
];

const values = [
  { title: "Integrity", hi: "ईमानदारी", text: "Act responsibly and communicate truthfully." },
  { title: "Dignity", hi: "गरिमा", text: "Respect every person without discrimination." },
  { title: "Inclusion", hi: "समावेशिता", text: "Encourage participation and equal opportunity." },
  { title: "Accountability", hi: "जवाबदेही", text: "Value transparency and responsible use of resources." },
];

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const openAuth = (mode = "signup") => { setAuthMode(mode); setAuthOpen(true); };
  const fadeInUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65 } } };
  const facts = [
    { value: "2013", label: "Established", hi: "स्थापना वर्ष", icon: <FaHeart /> },
    { value: "December 2013", label: "Registered Society", hi: "पंजीकृत संस्था", icon: <FaCheckCircle /> },
    { value: "05/22/03/11448/13", label: "Registration Number", hi: "पंजीयन क्रमांक", icon: <FaFileAlt /> },
    { value: "Rewa, Madhya Pradesh", label: "Registered Office", hi: "पंजीकृत कार्यालय", icon: <FaGlobeAsia /> },
  ];

  return (
    <main className="w-full overflow-hidden bg-[#fbfaf7] font-sans text-[#17283a]">
      <section className="relative isolate flex min-h-[660px] items-center overflow-hidden bg-[#081e33] pb-20 pt-28 md:min-h-[730px] md:pb-28 md:pt-32">
        <div className="absolute inset-0 -z-20">
          <OptimizedImage priority src={pageHeader} alt="Community activity associated with Swastik Srijan Foundation" className="h-full w-full" />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(5,23,40,0.97)_0%,rgba(8,30,51,0.88)_43%,rgba(8,30,51,0.48)_78%,rgba(8,30,51,0.36)_100%)]" />
        <div className="absolute -right-20 -top-24 -z-10 h-[460px] w-[460px] rounded-full border border-[#d7bd7c]/35 md:h-[640px] md:w-[640px]" aria-hidden="true" />
        <div className="absolute -right-8 -top-12 -z-10 h-[360px] w-[360px] rounded-full border border-[#d7bd7c]/25 md:h-[520px] md:w-[520px]" aria-hidden="true" />
        <div className="container relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.25fr_0.75fr]">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#d7bd7c]/45 bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#f0dba5] backdrop-blur-sm md:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#e8c878]" /> Swastik Srijan Foundation Samiti
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#e8c878] md:text-base">सहयोग • कौशल • जागरूकता • सृजन</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight text-white md:text-6xl lg:text-7xl">
              Creating Change.<span className="block font-serif italic font-normal text-[#f0dba5]">Inspiring Lives.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-100 md:text-xl">Working towards inclusive community development through education, skills, health, awareness and meaningful partnerships.</p>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">शिक्षा, कौशल, स्वास्थ्य, जागरूकता और सार्थक साझेदारी के माध्यम से समावेशी सामुदायिक विकास की दिशा में प्रयास।</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/PartnerWithUs" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#d8b96d] px-7 py-3.5 font-bold text-[#10263b] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#f0dba5]">Partner with SSF <FaArrowRight /></Link>
              <Link to="/JoinUs" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/70 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-[#10263b]">Join the Mission <FaUsers /></Link>
              <Link to="/LearningHub" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:border-[#d8b96d] hover:text-[#f0dba5]"><FaGraduationCap /> SSF Learning Hub</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2"><FaCheckCircle className="text-[#d8b96d]" /> Registered society</span>
              <span className="inline-flex items-center gap-2"><FaGlobeAsia className="text-[#d8b96d]" /> Working across India</span>
            </div>
          </motion.div>
          <motion.aside initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="hidden lg:block">
            <div className="relative rounded-[2rem] border border-[#d8b96d]/45 bg-[#0b2740]/75 p-8 shadow-2xl shadow-black/30 backdrop-blur-md">
              <div className="absolute left-8 top-0 h-1 w-20 -translate-y-1/2 rounded-full bg-[#d8b96d]" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e8c878]">Our guiding promise</p>
              <h2 className="mt-5 font-serif text-3xl leading-snug text-white">Serve with integrity. Act with compassion.</h2>
              <p className="mt-4 leading-relaxed text-slate-200">We strive to create lasting, meaningful social value through responsible action, community participation and cooperation.</p>
              <div className="mt-7 border-t border-white/15 pt-6">
                <p className="text-sm font-semibold text-[#f0dba5]">हमारा संकल्प</p>
                <p className="mt-2 leading-relaxed text-slate-200">ईमानदारी से सेवा, संवेदनशीलता के साथ कार्य और समाज के लिए स्थायी सकारात्मक परिवर्तन।</p>
              </div>
              <div className="mt-7 flex items-center gap-3 text-sm text-slate-300"><span className="h-px flex-1 bg-[#d8b96d]/50" /><span>Since December 2013</span><span className="h-px flex-1 bg-[#d8b96d]/50" /></div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="border-b border-[#e8e0ce] bg-[#f5f1e8] py-7 md:py-9">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 sm:grid-cols-2 md:grid-cols-4 md:gap-0 md:px-8">
          {facts.map((item, index) => (
            <div key={item.label} className={"flex items-start gap-4 px-4 " + (index ? "md:border-l md:border-[#d9ceb7]" : "")}>
              <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d2bd83] bg-white text-lg text-[#9b7831]">{item.icon}</span>
              <div className="min-w-0"><p className="break-words text-base font-bold leading-snug text-[#122b43] md:text-lg">{item.value}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#7a6b4e]">{item.label}</p><p className="mt-1 text-sm text-slate-600">{item.hi}</p></div>
            </div>
          ))}
        </div>
        <p className="container mx-auto mt-6 max-w-7xl px-5 text-xs leading-relaxed text-slate-500 md:px-8">Registered NGO • Registered office: Rewa, Madhya Pradesh • Area of work: India-wide. Institutional details should be read with the relevant official records.</p>
      </section>

      <FloatingTicker />

      <section className="bg-[#fbfaf7] px-5 pb-16 pt-5 md:px-8 md:pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7831] md:text-sm">People • Learning • Community</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#10263b] md:text-4xl">Progress begins with people.</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">A visual introduction to the themes behind SSF’s work. These are illustrative stock photographs, not claims that the pictured activities were conducted by SSF.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="group relative min-h-[280px] overflow-hidden rounded-2xl bg-[#102b43] shadow-lg md:min-h-[340px]">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85" alt="Illustrative photograph of students learning in a classroom" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07182b]/95 via-[#07182b]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f0dba5]">Education & Learning</p><h3 className="mt-2 font-serif text-2xl md:text-3xl">A chance to learn. A future to shape.</h3></div>
            </article>
            <article className="group relative min-h-[280px] overflow-hidden rounded-2xl bg-[#102b43] shadow-lg md:min-h-[340px]">
              <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85" alt="Illustrative photograph of people collaborating around a table" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07182b]/95 via-[#07182b]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f0dba5]">Partnership & Participation</p><h3 className="mt-2 font-serif text-2xl md:text-3xl">Shared purpose. Collective progress.</h3></div>
            </article>
            <article className="group relative min-h-[280px] overflow-hidden rounded-2xl bg-[#102b43] shadow-lg md:min-h-[340px]">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=85" alt="Illustrative photograph of community support for children" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07182b]/95 via-[#07182b]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f0dba5]">Care & Inclusion</p><h3 className="mt-2 font-serif text-2xl md:text-3xl">Dignity and opportunity for all.</h3></div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7831] md:text-sm">Purpose & Direction • उद्देश्य एवं दिशा</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-[#10263b] md:text-5xl">A clear purpose. A shared future.</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">SSF’s mission and vision guide the work, partnerships and choices we make.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <motion.article whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} viewport={{ once: true }} className="relative overflow-hidden rounded-[1.75rem] border border-[#e1d5b9] bg-white p-7 shadow-[0_20px_60px_-45px_rgba(16,38,59,0.45)] md:p-10">
              <span className="absolute right-6 top-2 font-serif text-8xl text-[#e8dfcb]">“</span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7831]">Our Mission • हमारा मिशन</p>
              <h3 className="relative mt-5 max-w-xl font-serif text-2xl leading-snug text-[#10263b] md:text-3xl">To contribute to inclusive development through education, skills, health, awareness and community participation.</h3>
              <p className="mt-5 max-w-xl leading-relaxed text-slate-600">शिक्षा, कौशल, स्वास्थ्य, जागरूकता और सामुदायिक सहभागिता के माध्यम से समावेशी विकास में योगदान देना।</p>
              <Link to="/Mission" className="mt-7 inline-flex items-center gap-2 font-bold text-[#8c6c2d] hover:text-[#10263b]">Explore our mission <FaArrowRight /></Link>
            </motion.article>
            <motion.article whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="relative overflow-hidden rounded-[1.75rem] border border-[#183a57] bg-[#102b43] p-7 text-white shadow-[0_20px_60px_-35px_rgba(16,38,59,0.6)] md:p-10">
              <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full border border-[#d8b96d]/25" /><div className="absolute -right-4 -top-4 h-36 w-36 rounded-full border border-[#d8b96d]/20" />
              <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-[#e8c878]">Our Vision • हमारा विज़न</p>
              <h3 className="relative mt-5 max-w-xl font-serif text-2xl leading-snug md:text-3xl">A just, educated, inclusive and sustainable India where every individual has the opportunity to thrive with dignity.</h3>
              <p className="relative mt-5 max-w-xl leading-relaxed text-slate-200">एक न्यायपूर्ण, शिक्षित, समावेशी और सतत भारत, जहाँ प्रत्येक व्यक्ति को गरिमा के साथ आगे बढ़ने का अवसर मिले।</p>
              <Link to="/Vision" className="relative mt-7 inline-flex items-center gap-2 font-bold text-[#f0dba5] hover:text-white">Explore our vision <FaArrowRight /></Link>
            </motion.article>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => <div key={value.title} className="rounded-2xl border border-[#e8e0ce] bg-[#f8f5ed] p-5"><p className="font-bold text-[#10263b]">{value.title}</p><p className="mt-1 text-sm font-semibold text-[#9b7831]">{value.hi}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{value.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7831] md:text-sm">Our Focus Areas • हमारे कार्यक्षेत्र</p><h2 className="mt-3 font-serif text-3xl leading-tight text-[#10263b] md:text-5xl">Where we focus our efforts</h2><p className="mt-4 leading-relaxed text-slate-600">Explore the areas connected to SSF’s registered objectives and community-development approach.</p></div><Link to="/Objectives" className="inline-flex items-center gap-2 self-start rounded-full border border-[#d7c69e] px-5 py-3 font-bold text-[#6f5625] transition hover:bg-[#f5f1e8] md:self-auto">All registered objectives <FaArrowRight /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((item, index) => <motion.div key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}><Link to={item.path} className="group flex h-full gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d1b56b] hover:shadow-[0_20px_45px_-35px_rgba(16,38,59,0.55)]"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5f1e8] text-xl text-[#9b7831] transition group-hover:bg-[#102b43] group-hover:text-[#f0dba5]">{item.icon}</span><span><span className="block font-bold text-[#10263b]">{item.title}</span><span className="mt-1 block text-sm text-slate-500">{item.hi}</span><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8c6c2d]">Explore <FaArrowRight className="transition group-hover:translate-x-1" /></span></span></Link></motion.div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#102b43] px-5 py-16 text-white md:px-8 md:py-20">
        <div className="container mx-auto max-w-7xl"><div className="mb-10 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e8c878] md:text-sm">Work together • साथ मिलकर काम करें</p><h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">Partnership built on purpose and responsibility.</h2><p className="mt-4 leading-relaxed text-slate-200">For CSR teams, government departments, grantmakers and institutions, a clear starting point matters. Explore SSF’s information and connect to discuss a potential collaboration.</p></div>
          <div className="grid gap-5 lg:grid-cols-3">{partnershipCards.map((item) => <Link key={item.title} to={item.path} className="group flex h-full flex-col rounded-[1.5rem] border border-white/15 bg-white/[0.055] p-6 transition hover:-translate-y-1 hover:border-[#d8b96d]/65 hover:bg-white/[0.09] md:p-7"><span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d8b96d]/40 bg-[#d8b96d]/10 text-xl text-[#f0dba5]">{item.icon}</span><p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c878]">{item.eyebrow}</p><h3 className="mt-2 text-xl font-bold text-white">{item.title}</h3><p className="mt-1 text-sm text-slate-300">{item.hi}</p><p className="mt-4 flex-1 leading-relaxed text-slate-200">{item.text}</p><span className="mt-6 inline-flex items-center gap-2 font-bold text-[#f0dba5]">{item.action}<FaArrowRight /></span></Link>)}</div>
          <p className="mt-6 max-w-4xl text-xs leading-relaxed text-slate-400">Programme descriptions and documents should be verified before publication. A listed opportunity is not a claim of grant approval, CSR eligibility or funding guarantee.</p>
        </div>
      </section>

      <section className="bg-[#f5f1e8] px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7831] md:text-sm">Impact & Accountability • प्रभाव एवं जवाबदेही</p><h2 className="mt-3 font-serif text-3xl leading-tight text-[#10263b] md:text-5xl">Show the work. Share the learning.</h2><p className="mt-5 leading-relaxed text-slate-600">Institutional trust grows when activities, stories, reports and progress are shared responsibly. Explore SSF’s available updates and documented journey.</p><p className="mt-4 text-sm leading-relaxed text-slate-500">Only verified project results and supported figures should be presented as impact metrics.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{[
            { title: "Impact & Outcomes", hi: "प्रभाव एवं परिणाम", text: "Explore available impact information and project outcomes.", path: "/Impact", icon: <FaBullseye /> },
            { title: "Stories & Activities", hi: "कहानियाँ एवं गतिविधियाँ", text: "Discover community stories, activities and updates.", path: "/Stories", icon: <FaHeart /> },
            { title: "Service Journey", hi: "सेवा यात्रा", text: "Learn about SSF’s institutional journey since 2013.", path: "/Journey", icon: <FaCompass /> },
            { title: "Media & Updates", hi: "मीडिया एवं अपडेट", text: "Find available media, announcements and information.", path: "/Media", icon: <FaLaptop /> },
          ].map((item) => <Link key={item.title} to={item.path} className="group rounded-2xl border border-[#e1d5b9] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg md:p-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1e8] text-lg text-[#9b7831]">{item.icon}</span><h3 className="mt-4 font-bold text-[#10263b]">{item.title}</h3><p className="mt-1 text-sm text-[#9b7831]">{item.hi}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8c6c2d]">Explore <FaArrowRight className="transition group-hover:translate-x-1" /></span></Link>)}</div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="text-center lg:text-left"><div className="mx-auto h-48 w-48 overflow-hidden rounded-full border-4 border-[#d8b96d] bg-[#f5f1e8] p-1 shadow-xl lg:mx-0"><OptimizedImage src="/Teams_Images/ramesh_pandey.jpg?v=2" alt="Mr. Ramesh Pandey, Founder and President of Swastik Srijan Foundation" className="h-full w-full rounded-full" /></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#9b7831]">Founder’s Message</p><h2 className="mt-2 font-serif text-3xl text-[#10263b] md:text-4xl">Mr. Ramesh Pandey</h2><p className="mt-2 font-medium text-slate-500">Founder & President</p></div>
          <div className="rounded-[1.75rem] border border-[#e1d5b9] bg-[#fbfaf7] p-7 md:p-10"><span className="font-serif text-5xl leading-none text-[#c5a45a]">“</span><h3 className="mt-2 font-serif text-2xl leading-snug text-[#10263b] md:text-3xl">Service becomes meaningful when it reaches people with dignity, cooperation and hope.</h3><p className="mt-5 leading-relaxed text-slate-600">Swastik Srijan Foundation was founded with the belief that positive change grows when people come together, learn together and take responsible action. Our journey is rooted in education, skills, awareness, health, cooperation and community participation.</p><p className="mt-4 leading-relaxed text-slate-600">We invite citizens, volunteers, institutions and partners to join this journey and contribute to a stronger, more aware and inclusive society.</p><Link to="/About" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#102b43] px-6 py-3 font-bold text-white transition hover:bg-[#1b405f]">Read about SSF <FaArrowRight /></Link></div>
        </div>
      </section>

      <section className="bg-[#102b43] px-5 py-16 md:px-8 md:py-20"><div className="container mx-auto max-w-7xl"><div className="mx-auto mb-10 max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e8c878] md:text-sm">Be Part of the Journey</p><h2 className="mt-3 font-serif text-3xl text-white md:text-5xl">Be Part of the Journey</h2><p className="mt-4 leading-relaxed text-slate-100">आज Swastik Srijan Foundation से जुड़िए। आपके लिए जुड़ने का एक रास्ता है — अपनी भूमिका चुनिए।</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
          { title: "MEMBER", hi: "सदस्य बनें", text: "मैं Swastik Srijan Foundation की यात्रा का हिस्सा बनना चाहता हूँ।", path: "https://swastiksrijan.in/Join", icon: <FaUsers /> },
          { title: "VOLUNTEER", hi: "स्वयंसेवक बनें", text: "मेरे पास समय / skill है, मैं काम करना चाहता हूँ।", path: "https://swastiksrijan.in/Join", icon: <FaHandsHelping /> },
          { title: "SUPPORTER / DONOR", hi: "सहयोगकर्ता / दानदाता", text: "मैं किसी अच्छे काम को support करना चाहता हूँ।", path: "https://swastiksrijan.in/Donate", icon: <FaHeart /> },
          { title: "PARTNER", hi: "साझेदार बनें", text: "मेरी संस्था / company / institution Swastik Srijan Foundation के साथ काम कर सकती है।", path: "https://swastiksrijan.in/PartnerWithUs", icon: <FaHandshake /> },
        ].map((item) => <a key={item.title} href={item.path} className="group flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:border-[#d8b96d]/65 hover:bg-white/[0.1] md:p-7"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d8b96d]/10 text-xl text-[#f0dba5]">{item.icon}</span><h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3><p className="mt-1 text-sm text-[#f0dba5]">{item.hi}</p><p className="mt-3 flex-1 leading-relaxed text-slate-200">{item.text}</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-[#f0dba5]">JOIN / EXPLORE <FaArrowRight className="transition group-hover:translate-x-1" /></span></a>)}</div>
      </div></section>

      <section className="bg-white px-5 py-12 md:px-8"><div className="container mx-auto max-w-7xl"><div className="mb-8 text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7831]">Support SSF • सहयोग करें</p><h2 className="mt-2 font-serif text-3xl text-[#10263b] md:text-4xl">Help meaningful work move forward.</h2></div><EliteDonationCard /></div></section>

      <section className="bg-[#fbfaf7] px-5 py-16 md:px-8 md:py-20"><div className="container mx-auto max-w-7xl"><div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7831] md:text-sm">Institutional Journey • संस्थागत यात्रा</p><h2 className="mt-3 font-serif text-3xl text-[#10263b] md:text-5xl">A continuing journey of service.</h2><p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">Explore the history and milestones documented by SSF.</p></div><ImpactTimeline /><div className="mt-8 text-center"><Link to="/Journey" className="inline-flex items-center gap-2 rounded-full border border-[#d7c69e] px-6 py-3 font-bold text-[#6f5625] transition hover:bg-[#f5f1e8]">View service journey <FaArrowRight /></Link></div></div></section>

      <section className="border-t border-[#e1d5b9] bg-white px-5 py-10 md:px-8"><div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left"><div><p className="font-serif text-xl font-bold text-[#10263b]">Swastik Srijan Foundation Samiti</p><p className="mt-1 text-sm text-slate-500">Registered Society • Rewa, Madhya Pradesh • Working across India</p></div><div className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-semibold text-[#6f5625]"><Link to="/About" className="hover:text-[#10263b]">About</Link><Link to="/Transparency" className="hover:text-[#10263b]">Transparency</Link><Link to="/CSRPartnership" className="hover:text-[#10263b]">CSR Partnerships</Link><Link to="/Contact" className="hover:text-[#10263b]">Contact</Link></div></div></section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
      <button type="button" onClick={() => openAuth("signup")} className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-[#d8b96d] bg-[#102b43] px-4 py-3 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#183b58]" aria-label="Open SSF account registration"><FaUsers /> Join SSF</button>
    </main>
  );
}
