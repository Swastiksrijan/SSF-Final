import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion as Motion } from "framer-motion";
import {
  FaArrowRight, FaBookOpen, FaBuilding, FaFileAlt,
  FaHandshake, FaHeart, FaLeaf, FaUsers, FaLaptop,
  FaGraduationCap, FaShieldAlt, FaNewspaper, FaChartLine, FaSeedling,
  FaBullseye, FaHandsHelping, FaCompass, FaCheckCircle, FaAward,
  FaIdCard, FaCertificate, FaUserCircle, FaSignInAlt, FaShareAlt, FaQuoteLeft
} from "react-icons/fa";
import ImpactTimeline from "../components/ImpactTimeline";
import EliteDonationCard from "../components/EliteDonationCard";
import AuthModal from "../components/AuthModal";
import OptimizedImage from "../components/OptimizedImage";
import { CONTACT_INFO } from "../config/contact";
import { BRAND } from "../data/brandAssets";
import pageHeader from "../assets/page-header.jpg";

const values = [
  { 
    title: "Integrity", 
    hi: "ईमानदारी", 
    text: "Act responsibly, maintain transparent records, and communicate truthfully at every step.",
    tag: "Ethical Standard" 
  },
  { 
    title: "Dignity", 
    hi: "गरिमा", 
    text: "Respect every community member without bias, fostering self-worth and genuine equality.",
    tag: "Human First" 
  },
  { 
    title: "Inclusion", 
    hi: "समावेशिता", 
    text: "Encourage active grassroots participation, ensuring opportunities reach the last person.",
    tag: "Equal Opportunity" 
  },
  { 
    title: "Accountability", 
    hi: "जवाबदेही", 
    text: "Value transparency and responsible stewardship of all institutional and public resources.",
    tag: "Statutory Trust" 
  },
];

const focusAreas = [
  { 
    title: "Education & Learning", 
    hi: "शिक्षा एवं सीखना", 
    image: "/images/real/children-mat-session.jpg", 
    icon: <FaBookOpen />, 
    path: "/OurInitiatives", 
    text: "Remedial learning, community study sessions, and academic assistance to lower rural dropout rates." 
  },
  { 
    title: "Skills & Livelihoods", 
    hi: "कौशल एवं आजीविका", 
    image: "/images/real/women_empowerment_tailoring.jpg", 
    icon: <FaGraduationCap />, 
    path: "/SkillPrograms", 
    text: "Practical vocational training, tailoring, and micro-enterprise pathways to self-reliance." 
  },
  { 
    title: "Health & Well-being", 
    hi: "स्वास्थ्य एवं कल्याण", 
    image: "/images/real/vision-health-camp.jpg", 
    icon: <FaHeart />, 
    path: "/OurInitiatives#health", 
    text: "Preventive health camps, vision screening drives, hygiene literacy, and maternal health guidance." 
  },
  { 
    title: "Women & Child Welfare", 
    hi: "महिला एवं बाल कल्याण", 
    image: "/images/real/women_community_meeting.jpg", 
    icon: <FaUsers />, 
    path: "/OurInitiatives", 
    text: "Self-help group mobilization, women rights awareness, dignity, nutrition, and child safety." 
  },
  { 
    title: "Digital Learning", 
    hi: "डिजिटल शिक्षा", 
    image: "/images/real/computer-donation-clean-v2.png", 
    icon: <FaLaptop />, 
    path: "/LearningHub", 
    text: "Modern computer literacy, responsible technology orientation, and digital learning assets." 
  },
  { 
    title: "Environment & Awareness", 
    hi: "पर्यावरण एवं जागरूकता", 
    image: "/images/real/tree_plantation.jpg", 
    icon: <FaLeaf />, 
    path: "/OurInitiatives#awareness", 
    text: "Community tree afforestation drives, water conservation drives, and eco-responsibility rallies." 
  },
];

const proofItems = [
  { 
    title: "Registration & Legal Identity", 
    text: "Society registration details under MP Society Registration Act (Since Dec 2013).", 
    icon: <FaFileAlt />,
    meta: "Public Record Available" 
  },
  { 
    title: "Statutory Approvals", 
    text: "Verified 12AB, MCA CSR-1, PAN, and active institutional compliance filings.", 
    icon: <FaShieldAlt />,
    meta: "Statutory Certified" 
  },
  { 
    title: "Audited Financials", 
    text: "Audited financial statements and statutory annual reports open for formal institutional review.", 
    icon: <FaChartLine />,
    meta: "Transparent Reporting" 
  },
];

const activityCards = [
  { 
    image: "/images/real/children-mat-session.jpg", 
    alt: "Children taking part in a learning session", 
    label: "Education", 
    title: "Learning with the Community", 
    text: "Documented on-ground literacy and remedial education initiatives in rural Rewa.",
    badge: "Field Delivery"
  },
  { 
    image: "/images/real/women_empowerment_tailoring.jpg", 
    alt: "Women taking part in a skills and livelihood activity", 
    label: "Women & Skills", 
    title: "Skills, Confidence & Participation", 
    text: "Direct vocational training sessions fostering dignity and household economic self-reliance.",
    badge: "Empowerment"
  },
  { 
    image: "/images/real/tree_plantation.jpg", 
    alt: "Tree plantation activity", 
    label: "Environment", 
    title: "Awareness Through Direct Action", 
    text: "Ecological responsibility drives led by village volunteers and school students.",
    badge: "Sustainability"
  },
];

const pressItems = [
  { image: "/images/real/newspaper-clipping.jpg", alt: "Newspaper clipping documenting an SSF-related activity", label: "Press Coverage", source: "Regional Media" },
  { image: "/images/real/news_media_1.jpg", alt: "News coverage of a digital initiative in Rewa", label: "News & Media", source: "District News" },
  { image: "/images/real/online-food-support-clipping.jpg", alt: "Newspaper clipping about an online food support initiative", label: "Community Relief", source: "Print Archives" },
];

const communityPhotoStrip = [
  { src: "/images/real/children-playing-circle.jpg", alt: "Children learning and playing together", label: "Learning" },
  { src: "/images/real/women_community_meeting.jpg", alt: "Women at a community meeting", label: "Participation" },
  { src: "/images/real/health-center-visit.jpg", alt: "Community health visit", label: "Health Literacy" },
  { src: "/images/real/tree_planting_2.jpg", alt: "Tree planting activity", label: "Environment" },
  { src: "/images/real/stationery-distribution.jpg", alt: "Educational stationery distribution", label: "Education" },
  { src: "/images/real/ssf_event_members.jpg", alt: "Swastik Srijan Foundation members at an event", label: "Our Network" },
  { src: "/images/real/computer-donation-clean-v2.png", alt: "Documented computer donation initiative", label: "Digital Access" },
  { src: "/images/real/community-education-meeting.jpg", alt: "Community education meeting", label: "Ground Action" },
];

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Swastik Srijan Foundation",
          text: "Join the mission of Swastik Srijan Foundation. Empowering communities across India.",
          url: window.location.href,
        });
      } catch (err) {
        // User dismissed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <main className="w-full overflow-hidden bg-[#FAF9F5] font-sans text-[#26343D] antialiased selection:bg-[#F59E0B]/30">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-[#12345A] py-20 text-white sm:min-h-[720px] md:min-h-[780px] md:py-28">
        
        {/* Visual Backdrops */}
        <div className="absolute inset-0 -z-20">
          <OptimizedImage priority src={pageHeader} alt="Swastik Srijan Foundation community work" className="h-full w-full object-cover object-center" />
        </div>
        
        {/* Multi-layered Architectural Gradients */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#051424]/98 via-[#09223D]/92 to-[#0E355D]/75" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_25%,rgba(245,158,11,0.14),transparent_48%),linear-gradient(0deg,#07192C_0%,transparent_60%)]" />
        
        {/* Soft Ambient Vector Circles */}
        <div className="pointer-events-none absolute -right-48 -top-36 -z-10 h-[500px] w-[500px] rounded-full border border-amber-400/20 shadow-[0_0_90px_rgba(245,158,11,0.06)] md:h-[720px] md:w-[720px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-24 -z-10 h-72 w-72 rounded-full border border-white/5" />

        <div className="container mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 md:px-10 lg:grid-cols-[minmax(0,1.3fr)_22rem] lg:gap-14">
          
          <Motion.div 
            initial={{ opacity: 0, y: 22 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.65, ease: "easeOut" }} 
            className="max-w-4xl"
          >
            {/* Trust Micro-Tag (2 chawal ke dane barabar niche) */}
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-amber-400/35 bg-white/[0.07] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-amber-300 shadow-xl backdrop-blur-md sm:gap-2.5 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]">
                <FaSeedling className="shrink-0 text-amber-400 text-xs sm:text-sm" />
                <span>Registered Society · Dedicated Since 2013</span>
              </div>

              {/* Mobile/tablet only — desktop pe ye badge right column me hai */}
              <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-white/[0.08] px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-amber-300 shadow-xl backdrop-blur-md sm:px-4 sm:text-xs lg:hidden">
                <FaShieldAlt className="shrink-0 text-amber-400" /> Statutory Transparency
              </span>
            </div>

            <p className="mt-5 text-base font-semibold tracking-wide text-slate-300 sm:text-lg md:text-xl">
              Swastik Srijan Foundation Samiti
            </p>

            <p className="mt-1.5 font-hindi text-base font-medium text-amber-200/90 sm:text-lg md:text-xl">
              सहयोग <span className="px-1 text-amber-400">•</span> कौशल <span className="px-1 text-amber-400">•</span> जागरूकता <span className="px-1 text-amber-400">•</span> सृजन
            </p>

            {/* Impact Headline */}
            <h1 className="mt-6 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.75rem] lg:leading-[1.08]">
              Creating Change. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                Inspiring Lives.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg md:text-xl md:leading-relaxed">
              Advancing inclusive grassroots development across Rewa, Madhya Pradesh & India through quality education, rural skill incubation, preventive health, and statutory integrity.
            </p>

            <p className="mt-3 max-w-2xl font-hindi text-sm leading-relaxed text-slate-300 sm:text-base">
              शिक्षा, कौशल, स्वास्थ्य-जागरूकता, पर्यावरण संरक्षण और नैतिक साझेदारी के माध्यम से समावेशी सामुदायिक विकास की दिशा में सतत प्रयास।
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
              <a 
                href={CONTACT_INFO.social.razorpay} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ssf-nav-donate inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-extrabold shadow-xl shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
              >
                <FaHeart className="text-red-500 text-base" /> Support the Mission
              </a>

              <Link 
                to="/About" 
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#176447] to-[#176447] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-900/45 hover:brightness-110"
              >
                Discover SSF <FaArrowRight className="text-xs" />
              </Link>

              <Link 
                to="/CSRPartnership" 
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-amber-400/60 bg-amber-400/10 px-6 py-3.5 text-sm font-bold text-amber-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400/20 hover:text-white"
              >
                CSR & Institutional Partnerships <FaHandshake className="text-base" />
              </Link>

              <button
                type="button"
                onClick={() => { setAuthMode("signup"); setLoginOpen(true); }}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-amber-300/80 bg-[#FAF9F5] px-6 py-3.5 text-sm font-extrabold text-[#12345A] shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
              >
                <FaUsers /> Join SSF
              </button>
            </div>

            {/* Official Compliance Badges Bar */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-200 sm:text-sm">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <FaCheckCircle className="text-xs" /> 12AB Registered
                </span>
                <span className="text-slate-500" aria-hidden="true">|</span>
                <span className="inline-flex items-center gap-1.5 text-amber-300">
                  <FaCheckCircle className="text-xs" /> 80G Provisional (Final Applied)
                </span>
                <span className="text-slate-500" aria-hidden="true">|</span>
                <span className="inline-flex items-center gap-1.5 text-sky-400">
                  <FaCheckCircle className="text-xs" /> CSR-1 Registered
                </span>
                <span className="text-slate-500" aria-hidden="true">|</span>
                <span className="text-slate-200">
                  NGO Darpan • NITI Aayog
                </span>
              </div>
            </div>
          </Motion.div>

          {/* Right Floating Strategic Anchor (Desktop) - 2.5 Inch Right Shifted */}
          <Motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.65, delay: 0.2 }} 
            className="relative hidden min-h-[520px] flex-col items-end justify-between lg:flex lg:self-stretch lg:translate-x-[2.5in]"
          >
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-white/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-300 shadow-xl backdrop-blur-md">
              <FaShieldAlt className="text-amber-400" /> Statutory Transparency
            </div>

            {/* 2.5 Inch Right Placed Mission Card */}
            <div className="relative w-full max-w-[17rem] self-end overflow-hidden rounded-2xl border border-amber-300/30 bg-gradient-to-br from-[#102F4D]/95 via-[#0B2340]/95 to-[#07192C]/95 p-5 shadow-[0_18px_45px_-18px_rgba(0,0,0,0.75)] backdrop-blur-xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-amber-300/80 before:to-transparent">
              <span className="inline-flex items-center rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-amber-200">
                Foundational Mission
              </span>
              <p className="mt-3 font-serif text-2xl font-bold leading-tight text-white">
                Service with purpose.
              </p>
              <p className="mt-1.5 font-serif text-2xl italic leading-tight text-amber-300">
                Progress through people.
              </p>
              <p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-slate-300">
                100% direct field execution in rural and semi-urban communities with zero intermediary leakage.
              </p>
            </div>
          </Motion.div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3 CARDS IN A SINGLE UNIFIED INSTITUTIONAL FRAME (पुरानी डुप्लीकेट हटा दी गई) */}
      {/* ========================================================================= */}
      <section className="relative z-20 -mt-12 mb-10 sm:mb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-amber-300/35 bg-gradient-to-br from-[#06182B] via-[#0B3B3A] to-[#081B30] p-6 sm:p-8 lg:p-10 shadow-[0_28px_70px_-18px_rgba(7,25,44,0.58)] text-white backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-amber-300/80 before:to-transparent">
          
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-orange-500/5 via-yellow-400/5 to-transparent" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 divide-y lg:divide-y-0 lg:divide-x divide-white/10 items-stretch">
            
            {/* FRAME PILLAR 1: संस्थागत पहचान व अधिदेश */}
            <div className="flex flex-col justify-between pt-2 lg:pt-0 lg:pr-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
                  <FaShieldAlt className="text-amber-400 text-xs" />
                  <span>Registered Society • Est. Dec 2013</span>
                </div>
                
                <h2 className="mt-5 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                  Swastik Srijan Foundation
                </h2>
                <p className="mt-2 text-sm font-semibold text-amber-300/95 tracking-wide">
                  Empowering Lives. Building a Better Bharat.
                </p>

                <p className="mt-4 text-xs font-hindi text-slate-300 leading-relaxed bg-white/[0.04] p-3 rounded-xl border border-white/5">
                  पंजीकृत संस्था • संपूर्ण भारत में कार्यक्षेत्र <br />
                  <span className="font-bold text-amber-200">सेवा • समर्पण • समग्र विकास</span>
                </p>

                <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                  Operating with constitutional compliance under MP Society Registration Act. Ground interventions dedicated to inclusive community progress since December 2013.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono font-semibold">Reg: 05/22/03/11448/13</span>
                <span className="text-emerald-400 font-bold">● Active Status</span>
              </div>
            </div>

            {/* FRAME PILLAR 2: डिजिटल कनेक्ट व नागरिक प्रोफाइल */}
            <div className="flex flex-col justify-between pt-8 lg:pt-0 lg:px-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 border border-sky-400/30 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-sky-300">
                  <FaLaptop className="text-xs" />
                  <span>Your Digital Connection • नया</span>
                </div>

                <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-white">
                  Join SSF
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Create your verified account and be a part of our mission.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link to="/Signup" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-2 text-xs font-black text-[#12345A] shadow-md hover:brightness-110 transition-all">
                    Join SSF
                  </Link>
                  <button type="button" onClick={() => { setAuthMode("login"); setLoginOpen(true); }} className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15 transition-all">
                    <FaSignInAlt className="mr-1.5" /> Login
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-sky-200/30 bg-white/[0.06] px-3 py-2 text-xs text-white"><span className="block font-bold text-[#F8FAFC]">Member & Volunteer</span><span className="mt-1 block text-[10px] text-[#CBD5E1]">Join our social mission</span></div>
                  <div className="rounded-lg border border-sky-200/30 bg-white/[0.06] px-3 py-2 text-xs text-white"><span className="block font-bold text-[#F8FAFC]">Donor & Collaborator</span><span className="mt-1 block text-[10px] text-[#CBD5E1]">Support meaningful change</span></div>
                  <div className="rounded-lg border border-sky-200/30 bg-white/[0.06] px-3 py-2 text-xs text-white"><span className="block font-bold text-[#F8FAFC]">Internship & Digital Volunteer</span><span className="mt-1 block text-[10px] text-[#CBD5E1]">Contribute your skills</span></div>
                  <div className="rounded-lg border border-sky-200/30 bg-white/[0.06] px-3 py-2 text-xs text-white"><span className="block font-bold text-[#F8FAFC]">Digital ID Card & Certificate</span><span className="mt-1 block text-[10px] text-[#CBD5E1]">For eligible participants</span></div>
                </div>

                <Link to="/Signup" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#F7A814] bg-[#12345A] px-4 py-2.5 text-xs font-black text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#176447] hover:shadow-lg">
                  Create Account <FaArrowRight className="text-[10px]" />
                </Link>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <a href="https://wa.me/919718346691?text=New%20Signup%0AName%3A%20%0AEmail%3A%20%0APhone%3A%20" target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500/20 transition-all">WhatsApp</a>
                  <span className="h-6 w-px bg-white/25" />
                  <a href="mailto:info@swastiksrijan.in?subject=New%20signup%20alert&body=New%20login%2Fsignup%20activity%20on%20website." className="inline-flex flex-1 items-center justify-center rounded-full border border-sky-400/60 bg-sky-500/10 px-3 py-2 text-xs font-bold text-white hover:bg-sky-500/20 transition-all">Email</a>
                </div>
              </div>
            </div>

            {/* FRAME PILLAR 3: हमारा संकल्प / GUIDING PROMISE */}
            <div className="flex flex-col justify-between pt-8 lg:pt-0 lg:pl-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-emerald-300">
                  <FaAward className="text-xs" />
                  <span>Our Guiding Promise • हमारा संकल्प</span>
                </div>

                <div className="mt-5 relative">
                  <FaQuoteLeft className="text-3xl text-amber-400/20 absolute -top-3 -left-2" />
                  <blockquote className="pl-6 font-serif text-lg sm:text-xl font-bold leading-snug text-white">
                    “Serve with integrity. <br />
                    <span className="text-amber-300 italic">Act with compassion.”</span>
                  </blockquote>
                </div>

                <p className="mt-4 text-xs text-slate-200 leading-relaxed">
                  We strive to create lasting, meaningful social value through responsible action, community participation and institutional cooperation.
                </p>

                <div className="mt-4 p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 font-hindi text-xs leading-relaxed text-amber-100">
                  <strong className="block text-amber-300 mb-1">हमारा संकल्प:</strong>
                  ईमानदारी से सेवा, संवेदनशीलता के साथ कार्य और समाज के लिए स्थायी सकारात्मक परिवर्तन सुनिश्चित करना।
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  to="/About"
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-white transition-colors"
                >
                  संस्था के सिद्धांत एवं कार्यप्रणाली जानें <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>

          </div>

          <div className="mt-8 border-t border-white/10 pt-6 sm:mt-9 sm:pt-7">
            <h3 className="text-center font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">
              Building a Stronger, Kinder and More Inclusive Society
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                [FaUsers, "Children & Youth"],
                [FaGraduationCap, "Education"],
                [FaHeart, "Health & Wellbeing"],
                [FaLeaf, "Sustainability"],
                [FaHandsHelping, "Community Development"],
              ].map(([Icon, label]) => (
                <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-4 text-center transition-all duration-300 hover:border-amber-300/40 hover:bg-white/[0.08]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 text-lg text-amber-300">
                    <Icon />
                  </span>
                  <span className="text-xs font-semibold leading-snug text-slate-100 sm:text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEY STATUTORY METRICS STRIP ================= */}
      <section className="relative isolate overflow-hidden border-y border-[#4A7899]/60 bg-[radial-gradient(ellipse_at_12%_0%,rgba(245,158,11,0.2),transparent_34%),radial-gradient(ellipse_at_88%_100%,rgba(45,212,191,0.17),transparent_36%),linear-gradient(115deg,#081A2E_0%,#123A60_52%,#174D68_100%)] py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] md:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12] bg-[radial-gradient(ellipse_at_18%_20%,rgba(245,190,75,0.55),transparent_35%),radial-gradient(ellipse_at_82%_78%,rgba(125,190,220,0.5),transparent_38%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[url('/assets/new-logo-DCfoGBCm.png')] bg-no-repeat bg-center bg-contain" />
        <div className="container mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
          {[
            [FaShieldAlt, "Since 2013", "Registered Society (MP Act)", "10+ Years Dedicated Service"],
            [FaBuilding, "Rewa, MP", "Registered Head Office", "W.No 1, Dadar, Rewa 486446"],
            [FaCompass, "PAN India", "Constitutional Outreach", "Community Direct Delivery"],
            [FaFileAlt, "Audited Records", "Statutory Transparency", "Open Annual Disclosure"],
          ].map(([Icon, value, label, sub]) => (
            <div 
              key={label} 
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-6 shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-300/70 hover:bg-white/[0.11] hover:shadow-xl"
            >
              <span aria-hidden="true" className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-amber-400 to-amber-600" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">{label}</p>
                  <p className="mt-1 text-xs text-slate-300">{sub}</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-white/10 text-amber-300 transition-colors duration-300 group-hover:bg-amber-400 group-hover:text-[#12345A]">
                  <Icon className="text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DOCUMENTED ON-GROUND ACTIVITIES ================= */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="container mx-auto max-w-7xl">
          
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#12345A]/5 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#12345A]">
                Work & Community · कार्य और समुदाय
              </div>
              <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#12345A] sm:text-4xl md:text-5xl">
                The work matters. So does the evidence.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Explore documented grassroots programs and community initiatives. We believe institutional trust is earned through verifiable field action, not unsupported claims.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/Media" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#12345A] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md">
                <FaNewspaper className="text-amber-500" /> Media & Gallery
              </Link>
              <Link to="/Impact" className="inline-flex items-center gap-2 rounded-full bg-[#12345A] px-5 py-3 text-sm font-bold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#176447]">
                <FaChartLine className="text-amber-400" /> Work & Impact
              </Link>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {activityCards.map((item) => (
              <article 
                key={item.title} 
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-amber-400/60 hover:shadow-2xl"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100 sm:h-64">
                  <img 
                    src={item.image} 
                    alt={item.alt} 
                    loading="lazy" 
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#12345A]/90 px-3.5 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-md">
                    {item.label}
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#12345A]">
                    {item.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-7">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#12345A] group-hover:text-[#176447] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {item.text}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <Link to="/Media" className="inline-flex items-center gap-2 text-sm font-bold text-[#12345A] group-hover:text-[#176447]">
                      View documented activities <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ================= COMMUNITY PHOTO STRIP ================= */}
      <section className="border-y border-slate-200/80 bg-gradient-to-br from-[#EEF4F8] via-[#F8FAFC] to-[#EAF1F7] px-5 py-20 md:px-8 md:py-24">
        <div className="container mx-auto max-w-7xl">
          
          <div className="mb-12 text-center">
            <span className="rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              Glimpses of SSF · संस्था की झलकियाँ
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-[#12345A] sm:text-4xl md:text-5xl">
              Real moments. Shared purpose.
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              शिक्षा, सहभागिता, स्वास्थ्य-जागरूकता और जमीनी सेवा से जुड़ी संस्था की वास्तविक छवियाँ।
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-8">
            {communityPhotoStrip.map((item) => (
              <Link 
                to="/Media" 
                key={item.src} 
                className="group flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative block h-24 w-24 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50 p-1 shadow-md transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-xl sm:h-28 sm:w-28 md:h-32 md:w-32">
                  <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="mt-3.5 text-xs font-bold text-[#12345A] group-hover:text-[#176447]">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/Media" 
              className="inline-flex items-center gap-2 rounded-full border border-[#176447]/35 bg-white px-7 py-3.5 text-sm font-bold text-[#176447] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#176447] hover:bg-[#EAF0F6] hover:shadow-md"
            >
              सभी तस्वीरें और समाचार देखें <FaArrowRight className="text-xs" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= IMPACT & ACCOUNTABILITY ================= */}
      <section className="bg-gradient-to-br from-[#EAF0F6] via-white to-[#FAF9F5] px-5 py-20 md:px-8 md:py-28">
        <div className="container mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800">
              Impact & Accountability • प्रभाव एवं जवाबदेही
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#12345A] sm:text-4xl md:text-5xl">
              Show the work. <br />
              <span className="text-[#176447]">Share the learning.</span>
            </h2>
            <p className="leading-relaxed text-slate-600 text-base sm:text-lg">
              Institutional confidence solidifies when activities, field stories, annual audits, and project outcomes are published responsibly. Explore SSF’s documented path since 2013.
            </p>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#12345A]">Ethical Commitment</p>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Only verified field execution data and documented milestones are presented as organizational indicators.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { title: "Impact & Outcomes", hi: "प्रभाव एवं परिणाम", text: "Verified impact assessments, field reports, and project indicators.", path: "/Impact", icon: <FaBullseye /> },
              { title: "Stories & Activities", hi: "कहानियाँ एवं गतिविधियाँ", text: "Grassroot change narratives from children, families, and village groups.", path: "/Stories", icon: <FaHeart /> },
              { title: "Service Journey", hi: "सेवा यात्रा", text: "Institutional chronology and governance milestones since December 2013.", path: "/Journey", icon: <FaCompass /> },
              { title: "Media & Updates", hi: "मीडिया एवं अपडेट", text: "Official announcements, photo galleries, and registered updates.", path: "/Media", icon: <FaLaptop /> },
            ].map((item) => (
              <Link 
                key={item.title} 
                to={item.path} 
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#176447] hover:shadow-xl"
              >
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-[#12345A] transition-colors group-hover:bg-[#12345A] group-hover:text-amber-400">
                    {item.icon}
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-[#12345A] group-hover:text-[#176447] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#176447] mt-0.5">{item.hi}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#12345A] group-hover:text-[#176447] pt-4 border-t border-slate-100">
                  Explore Details <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ================= IN THE NEWS / MEDIA ================= */}
      <section className="relative isolate overflow-hidden border-t border-[#E4E8EC] bg-gradient-to-br from-[#F4F6F8] via-[#FAF9F5] to-[#F3EEE4] px-5 py-20 md:px-8 md:py-28">
        {/* Quiet editorial accents behind the media archive */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-[#D5B66A]/30" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 -z-10 h-56 w-56 rounded-full border border-[#12345A]/[0.08]" />
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D8C79D] bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#12345A] shadow-sm">
                <FaNewspaper className="text-[#B88728]" />
                In the News · समाचारों में
              </span>
              <h2 className="mt-5 font-serif text-3xl font-bold leading-tight tracking-tight text-[#12345A] sm:text-4xl md:text-5xl">
                A documented journey, <span className="text-[#176447]">not just a promise.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Print and regional news coverage documenting past and continuing field efforts across Rewa and surrounding areas.
              </p>
              <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#176447] via-[#D5A43B] to-[#12345A]" />
            </div>
            <Link
              to="/Media"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[#12345A] bg-[#12345A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#12345A]/15 transition duration-300 hover:-translate-y-0.5 hover:border-[#176447] hover:bg-[#176447] hover:shadow-xl"
            >
              Explore Media Archive <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {pressItems.map((item, index) => (
              <Link
                to="/Media"
                key={item.image}
                className="group relative flex flex-col overflow-hidden rounded-[1.65rem] border border-white bg-white/90 p-2 shadow-[0_14px_40px_-24px_rgba(18,52,90,0.42)] ring-1 ring-[#12345A]/[0.05] transition-all duration-500 hover:-translate-y-2 hover:border-[#D8BC79] hover:shadow-[0_24px_55px_-25px_rgba(18,52,90,0.38)]"
              >
                <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-[1.2rem] border border-[#E6E0D2] bg-gradient-to-br from-[#F6F2E9] via-[#F9FAFB] to-[#EAF0F6] p-4 sm:h-72">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-xl border border-white/80" />
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="relative z-10 h-full w-full object-contain drop-shadow-[0_8px_12px_rgba(18,52,90,0.13)] transition duration-700 ease-out group-hover:scale-[1.035]"
                  />
                  <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#12345A] shadow-sm backdrop-blur">
                    <FaNewspaper className="text-[#B88728]" /> Archive {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-between gap-3 px-4 py-4 sm:px-5">
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-[#176447]/[0.08] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#176447]">
                      {item.source}
                    </span>
                    <p className="mt-2 font-serif text-base font-bold text-[#12345A] transition-colors group-hover:text-[#176447]">
                      {item.label}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DDE4E9] bg-[#F5F7F8] text-[#12345A] transition-all duration-300 group-hover:border-[#176447] group-hover:bg-[#176447] group-hover:text-white">
                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-slate-500">
            Media items are presented as a record of coverage. Select a card to explore the archive.
          </p>
        </div>
      </section>

      {/* ================= FOCUS AREAS / WORK PILLARS ================= */}
      <section className="relative isolate overflow-hidden bg-[#FAF9F5] px-5 py-20 md:px-8 md:py-28 border-t border-slate-200/90">
        {/* Smaller, subtle focus-wheel watermark, layered behind the section content. */}
        <div aria-hidden="true" className="pointer-events-none absolute right-[-3rem] top-12 z-0 flex h-[22rem] w-[22rem] items-center justify-center opacity-[0.08] md:right-6 md:top-8 md:h-[29rem] md:w-[29rem]">
          <img src={BRAND.focusWheel} alt="" loading="lazy" className="h-full w-full object-contain" />
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          
          <div className="mb-14">
            <div className="max-w-3xl">
              <span className="rounded-full bg-[#176447]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#176447]">
                Our Focus Areas · हमारे कार्यक्षेत्र
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-[#12345A] sm:text-4xl md:text-5xl">
                Where we focus our efforts
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#26343D] sm:text-lg">
                These core pillars reflect the Foundation’s statutory objectives. Programs are custom-tailored to local community requirements and aligned with UN Sustainable Development Goals.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((item) => (
              <Link 
                to={item.path} 
                key={item.title} 
                className="group flex gap-4 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400 hover:shadow-xl"
              >
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 border-amber-400 bg-slate-50 shadow-sm sm:h-14 sm:w-14">
                  <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                </span>
                
                <span className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="block font-serif text-lg font-bold text-[#12345A] group-hover:text-[#176447] transition-colors">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold text-amber-600">
                      {item.hi}
                    </span>
                    <span className="mt-2 block text-xs leading-relaxed text-slate-600">
                      {item.text}
                    </span>
                  </div>
                  
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#12345A] group-hover:text-[#176447]">
                    Explore Pillar <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link 
              to="/Objectives" 
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#12345A] border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md"
            >
              View all registered statutory objectives <FaArrowRight className="text-xs" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= MISSION, VISION & CORE VALUES ================= */}
      <section className="relative isolate overflow-hidden border-t border-[#E5E9EC] bg-gradient-to-b from-[#F4F7FA] via-[#FAF9F5] to-white px-5 py-20 md:px-8 md:py-28">
        {/* Elegant, understated background geometry */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-10 -z-10 h-96 w-96 rounded-full border border-[#D8C79D]/40" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-22 -z-10 h-72 w-72 rounded-full border border-[#12345A]/[0.07]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-10 -z-10 h-72 w-72 rounded-full bg-[#176447]/[0.035] blur-3xl" />
        <div className="container relative mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9C99F] bg-white/85 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#12345A] shadow-sm">
              <FaCompass className="text-[#B88728]" />
              Purpose & Direction • उद्देश्य एवं दिशा
            </span>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight tracking-tight text-[#12345A] sm:text-4xl md:text-5xl">
              A clear purpose. <span className="text-[#176447]">A shared future.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              SSF’s mission and vision guide every institutional partnership, grassroots action, and community priority.
            </p>
            <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#176447] via-[#D5A43B] to-[#12345A]" />
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Mission */}
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#DDE5EB] bg-white/95 p-7 shadow-[0_18px_50px_-30px_rgba(18,52,90,0.35)] transition-all duration-500 hover:-translate-y-1 hover:border-[#CDB36F] hover:shadow-[0_28px_65px_-32px_rgba(18,52,90,0.42)] sm:p-9 md:p-11">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#176447] via-[#7EA99A] to-transparent" />
              <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 flex h-40 w-40 items-center justify-center rounded-full bg-[#176447]/[0.045] text-[8rem] text-[#176447]/[0.07] transition-transform duration-700 group-hover:scale-110">
                <FaBullseye />
              </div>
              <div className="relative flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D4E5DC] bg-gradient-to-br from-[#EAF4EE] to-white text-2xl text-[#176447] shadow-sm">
                  <FaBullseye />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#176447]">Our Mission</p>
                  <p className="mt-1 font-hindi text-sm font-semibold text-slate-500">हमारा मिशन</p>
                </div>
              </div>
              <h3 className="relative mt-7 font-serif text-2xl font-bold leading-snug text-[#12345A] sm:text-[1.7rem]">
                To contribute to inclusive development through education, skills, health, awareness, and community participation.
              </h3>
              <p className="relative mt-5 border-l-2 border-[#D8C79D] pl-4 font-hindi text-base leading-relaxed text-slate-600">
                शिक्षा, कौशल, स्वास्थ्य, जागरूकता और सामुदायिक सहभागिता के माध्यम से समावेशी विकास में सक्रिय और पारदर्शी योगदान देना।
              </p>
              <div className="relative mt-auto pt-8">
                <Link to="/Mission" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D9E4DE] bg-[#F4F8F5] px-5 py-3 text-sm font-bold text-[#176447] transition-all duration-300 hover:border-[#176447] hover:bg-[#176447] hover:text-white">
                  Explore our full mission <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>

            {/* Vision */}
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#183A5C] bg-gradient-to-br from-[#07192C] via-[#0D2947] to-[#16466A] p-7 text-white shadow-[0_22px_55px_-28px_rgba(7,25,44,0.65)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(7,25,44,0.7)] sm:p-9 md:p-11">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-[#E8D5A0] to-transparent" />
              <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-amber-300/20 transition-transform duration-700 group-hover:scale-110" />
              <div aria-hidden="true" className="absolute -right-7 -top-7 h-44 w-44 rounded-full border border-white/[0.07]" />
              <div className="relative flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/10 text-2xl text-amber-300 shadow-inner">
                  <FaCompass />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-amber-300">Our Vision</p>
                  <p className="mt-1 font-hindi text-sm font-semibold text-slate-300">हमारा विज़न</p>
                </div>
              </div>
              <h3 className="relative mt-7 font-serif text-2xl font-bold leading-snug text-white sm:text-[1.7rem]">
                A just, educated, inclusive and sustainable India where every individual has the opportunity to thrive with dignity.
              </h3>
              <p className="relative mt-5 border-l-2 border-amber-300/70 pl-4 font-hindi text-base leading-relaxed text-slate-300">
                एक न्यायपूर्ण, शिक्षित, समावेशी और सतत भारत, जहाँ प्रत्येक व्यक्ति को गरिमा और समानता के साथ आगे बढ़ने का समान अवसर मिले।
              </p>
              <div className="relative mt-auto pt-8">
                <Link to="/Vision" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-amber-300/30 bg-white/[0.07] px-5 py-3 text-sm font-bold text-amber-200 transition-all duration-300 hover:border-amber-300 hover:bg-amber-300 hover:text-[#12345A]">
                  Explore our institutional vision <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </div>

          {/* Core values — four distinct institutional principles */}
          <div className="mt-16">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#176447]">The Principles We Stand By</span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-[#12345A] sm:text-3xl">Our Core Values <span className="font-hindi text-lg font-semibold text-slate-500">· हमारे मूल मूल्य</span></h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-slate-500">The standards that shape how we serve, collaborate, and remain accountable.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <article
                  key={value.title}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-[#E0E6EA] bg-white/90 p-6 shadow-[0_12px_35px_-26px_rgba(18,52,90,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D4BD7D] hover:shadow-[0_22px_40px_-25px_rgba(18,52,90,0.32)]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#176447]/70 via-[#D5A43B]/80 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0F6] font-serif text-lg font-bold text-[#12345A] transition-colors group-hover:bg-[#12345A] group-hover:text-amber-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-[#E7DAB8] bg-[#FBF7EC] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#8B6825]">
                      {value.tag}
                    </span>
                  </div>
                  <h4 className="mt-5 font-serif text-xl font-bold text-[#12345A] transition-colors group-hover:text-[#176447]">{value.title}</h4>
                  <p className="mt-1 font-hindi text-xs font-semibold text-slate-500">{value.hi}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CSR & INSTITUTIONAL PARTNERSHIP ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#051424] via-[#09223D] to-[#0D345B] px-5 py-20 text-white md:px-8 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.15),transparent_40%)]" />
        
        <div className="container relative mx-auto max-w-7xl">
          
          <div className="mb-12 max-w-3xl">
            <span className="rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
              Work Together · साथ मिलकर
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Partnership starts with a conversation.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              For corporate CSR committees, government departments, donor trusts, and institutional partners, we invite direct engagement to explore project scope, compliance verification, and practical execution.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            
            <Link 
              to="/CSRPartnership" 
              className="group rounded-3xl border border-white/15 bg-white/[0.06] p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:bg-white/[0.1]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 text-2xl group-hover:scale-110 transition-transform">
                <FaHandshake />
              </div>
              <h3 className="mt-5 text-2xl font-bold">CSR & Corporate Partners</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Explore structured corporate social responsibility grants, compliance dossiers (CSR-1, 12AB, 80G), and verifiable field projects.
              </p>
              <div className="mt-6 flex items-center gap-2 font-bold text-sm text-amber-300 group-hover:text-white">
                Explore Partnerships <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link 
              to="/UpcomingProjects" 
              className="group rounded-3xl border border-white/15 bg-white/[0.06] p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:bg-white/[0.1]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 text-2xl group-hover:scale-110 transition-transform">
                <FaBuilding />
              </div>
              <h3 className="mt-5 text-2xl font-bold">Projects & Proposals</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Review planned community programs and co-design tailored initiatives with verifiable deliverables and transparent budgets.
              </p>
              <div className="mt-6 flex items-center gap-2 font-bold text-sm text-amber-300 group-hover:text-white">
                Explore Initiatives <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link 
              to="/JoinUs" 
              className="group rounded-3xl border border-white/15 bg-white/[0.06] p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:bg-white/[0.1]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 text-2xl group-hover:scale-110 transition-transform">
                <FaUsers />
              </div>
              <h3 className="mt-5 text-2xl font-bold">Volunteers & Community</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Lend your time, specialized skills, medical expertise, or ground volunteerism to strengthen community programs in rural regions.
              </p>
              <div className="mt-6 flex items-center gap-2 font-bold text-sm text-amber-300 group-hover:text-white">
                Find Your Role <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

          </div>

          <p className="mt-8 text-xs leading-relaxed text-slate-400 max-w-3xl">
            * Statutory Note: Listing a proposed program does not imply it is fully funded or active. Formal institutional commitments are initiated solely after bilateral agreements, scope finalization, and statutory due diligence.
          </p>

        </div>
      </section>

      {/* ================= STATUTORY TRANSPARENCY ================= */}
      <section className="px-5 py-20 md:px-8 md:py-28 bg-white">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] items-center">
          
          <div className="space-y-5">
            <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#12345A]">
              Trust & Transparency · पारदर्शिता
            </span>
            <h2 className="font-serif text-3xl font-bold leading-tight text-[#12345A] sm:text-4xl md:text-5xl">
              Trust should be supported by records.
            </h2>
            <p className="leading-relaxed text-slate-600 text-base sm:text-lg">
              Review institutional registrations, annual audit reports, and governance filings before deciding to partner, volunteer, or contribute.
            </p>
            <div>
              <Link 
                to="/Transparency" 
                className="inline-flex items-center gap-2 rounded-full bg-[#12345A] px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#176447]"
              >
                Open Transparency Centre <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {proofItems.map((item) => (
              <div 
                key={item.title} 
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#176447] hover:shadow-xl"
              >
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-[#12345A] group-hover:bg-[#12345A] group-hover:text-amber-400 transition-colors">
                    {item.icon}
                  </span>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
                    {item.meta}
                  </p>
                  <h3 className="mt-3 font-serif text-lg font-bold text-[#12345A]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.text}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link to="/Transparency" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176447] group-hover:text-[#12345A]">
                    View Records <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= FOUNDER'S MESSAGE — SIGNATURE LEADERSHIP ================= */}
      <section className="relative isolate overflow-hidden border-y border-[#E2E7E8] bg-[#F8F7F2] px-5 py-20 sm:px-8 md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-32 -top-28 h-[28rem] w-[28rem] rounded-full border border-[#12345A]/[0.07] md:h-[42rem] md:w-[42rem]" />
          <div className="absolute -right-16 -top-12 h-[21rem] w-[21rem] rounded-full border border-[#176447]/[0.07] md:h-[32rem] md:w-[32rem]" />
          <div className="absolute bottom-0 left-0 h-1 w-36 bg-gradient-to-r from-[#176447] via-[#D5B66A] to-transparent" />
        </div>

        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-center gap-3 md:mb-14">
            <span className="h-px w-10 bg-[#176447]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#176447]">Leadership & Institutional Purpose</span>
            <span className="rounded-full border border-[#D9DFD9] bg-white/70 px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#52616A]">EST. DECEMBER 2013</span>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div className="relative mx-auto w-full max-w-[390px] lg:mx-0">
              <div aria-hidden="true" className="absolute -left-3 -top-3 h-24 w-24 rounded-tl-[2rem] border-l-2 border-t-2 border-[#D5B66A] sm:-left-5 sm:-top-5 sm:h-32 sm:w-32" />
              <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-24 w-24 rounded-br-[2rem] border-b-2 border-r-2 border-[#176447]/70 sm:-bottom-5 sm:-right-5 sm:h-32 sm:w-32" />
              <div className="relative overflow-hidden rounded-[1.6rem] border border-white bg-white p-2 shadow-[0_24px_65px_-28px_rgba(18,52,90,0.48)] sm:rounded-[2rem] sm:p-3">
                <div className="relative aspect-[4/4.7] overflow-hidden rounded-[1.15rem] bg-[#E9ECE8] sm:rounded-[1.45rem]">
                  <OptimizedImage
                    src="/Teams_Images/ramesh_pandey.jpg?v=2"
                    alt="Ramesh Pandey, Founder and President of Swastik Srijan Foundation"
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.025]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07192C]/75 via-[#07192C]/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">Institutional Leadership</p>
                      <p className="mt-1 text-sm font-semibold text-white sm:text-base">Swastik Srijan Foundation</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-[#F7D88A] backdrop-blur-md">
                      <FaSeedling className="text-lg" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative mx-auto mt-5 flex w-fit items-center gap-3 rounded-full border border-[#E0E4DF] bg-white/90 px-5 py-2.5 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#176447]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#12345A]">Founder & President</span>
              </div>
            </div>

            <div className="relative pt-2 lg:py-5">
              <div className="flex items-center gap-2 text-[#176447]">
                <FaQuoteLeft className="text-lg opacity-80" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em]">A Message from Our Founder</span>
              </div>

              <h2 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight text-[#12345A] sm:text-5xl md:text-6xl">
                Mr. Ramesh <span className="text-[#176447]">Pandey</span>
              </h2>
              <p className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-[#52616A] sm:text-base">
                <span className="h-px w-8 bg-[#D5B66A]" />
                Founder & President, Swastik Srijan Foundation
              </p>

              <blockquote className="relative mt-8 max-w-3xl border-l-[3px] border-[#D5B66A] pl-5 font-serif text-xl font-medium leading-relaxed text-[#12345A] sm:pl-7 sm:text-2xl md:text-[1.75rem] md:leading-[1.55]">
                “Service becomes truly transformative when it reaches the community with dignity, ethical cooperation, and lasting hope.”
              </blockquote>

              <p className="mt-7 max-w-2xl text-[15px] leading-8 text-[#52616A] sm:text-base sm:leading-8">
                Swastik Srijan Foundation was conceived in December 2013 on the conviction that positive societal progress thrives when people unite, learn together, and take accountable action at the grassroots. We welcome institutional partners, CSR teams, and compassionate citizens to review our work and walk together.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/About"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#12345A] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(18,52,90,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#176447] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#176447]"
                >
                  Read SSF Governance Profile
                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <span className="text-xs font-medium tracking-wide text-[#748087]">Service · Dignity · Accountability</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GET INVOLVED CARDS ================= */}
      <section className="bg-gradient-to-br from-[#07192C] via-[#0B2542] to-[#0E355D] px-5 py-20 text-white md:px-8 md:py-28">
        <div className="container mx-auto max-w-7xl">
          
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
              Get Involved · जुड़िए
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
              Be Part of the Journey
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              आज Swastik Srijan Foundation से जुड़िए। हर नागरिक, पेशेवर और संस्था के लिए सहयोग का एक सार्थक मार्ग है — अपनी भूमिका चुनिए।
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "MEMBER", hi: "सदस्य बनें", text: "संस्था की दीर्घकालिक सेवा यात्रा और सामाजिक संकल्प का अभिन्न हिस्सा बनें।", path: "/JoinUs?role=member", icon: <FaUsers /> },
              { title: "VOLUNTEER", hi: "स्वयंसेवक बनें", text: "अपने समय, कौशल और सेवा-भावना से जमीनी अभियानों को मजबूती दें।", path: "/JoinUs?role=volunteer", icon: <FaHandsHelping /> },
              { title: "SUPPORTER / DONOR", hi: "सहयोगकर्ता / दानदाता", text: "पारदर्शी और कर-मुक्त (80G) सहयोग से बच्चों की शिक्षा व स्वास्थ्य को आगे बढ़ाएं।", path: "/Donate", icon: <FaHeart /> },
              { title: "PARTNER", hi: "साझेदार बनें", text: "आपकी संस्था / कंपनी / ट्रस्ट SSF के साथ CSR व विकास योजनाओं में सहयोग कर सकती है।", path: "/PartnerWithUs", icon: <FaHandshake /> },
            ].map((item) => (
              <Link 
                key={item.title} 
                to={item.path} 
                className="group flex h-full flex-col justify-between rounded-3xl border border-white/15 bg-white/[0.06] p-7 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:bg-white/[0.12] hover:shadow-2xl"
              >
                <div>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-2xl text-amber-300 group-hover:bg-amber-400 group-hover:text-[#12345A] transition-colors">
                    {item.icon}
                  </span>
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-white">{item.title}</h3>
                  <p className="text-xs font-semibold text-amber-300 mt-1">{item.hi}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{item.text}</p>
                </div>
                
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-black uppercase tracking-wider text-amber-300 group-hover:text-white">
                  <span>JOIN / EXPLORE</span>
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ================= DONATION CARD SECTION ================= */}
      <section className="bg-white px-5 py-16 md:px-8 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-800">
              Support SSF • सहयोग करें
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#12345A] sm:text-4xl">
              Help Meaningful Grassroots Work Move Forward
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Direct Bank & UPI Transfer • 100% On-ground Allocation
            </p>
          </div>
          <EliteDonationCard />
        </div>
      </section>

      {/* ================= SERVICE TIMELINE ================= */}
      <section className="bg-gradient-to-b from-slate-50 to-white px-5 py-20 md:px-8 md:py-28 border-t border-slate-200">
        <div className="container mx-auto max-w-7xl">
          
          <div className="mb-14 text-center">
            <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#12345A]">
              Institutional Journey • संस्थागत यात्रा
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#12345A] sm:text-4xl md:text-5xl">
              A Continuing Journey of Service Since 2013
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              Explore the documented history, statutory milestones, and community achievements of Swastik Srijan Foundation.
            </p>
          </div>

          <ImpactTimeline />

          <div className="mt-12 text-center">
            <Link 
              to="/Journey" 
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-bold text-[#12345A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400 hover:bg-slate-50 hover:shadow-md"
            >
              View Detailed Service Journey <FaArrowRight className="text-xs" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION ================= */}
      <section className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="container mx-auto flex max-w-7xl flex-col gap-8 rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 p-8 shadow-xl md:flex-row md:items-center md:justify-between md:p-14">
          
          <div className="max-w-2xl">
            <span className="rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-800">
              Take the Next Step · अगला कदम
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-[#12345A] sm:text-4xl">
              Every meaningful partnership starts somewhere.
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Explore the work, verify compliance records, volunteer a skill, or start an institutional conversation about CSR and community collaboration.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Link 
              to="/JoinUs" 
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#12345A] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#176447]"
            >
              <FaUsers /> Join SSF
            </Link>

            <Link 
              to="/PartnerWithUs" 
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-amber-500/80 bg-white px-7 py-3.5 text-sm font-bold text-[#12345A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50 hover:border-amber-600"
            >
              <FaHandshake className="text-amber-600" /> Partner With Us
            </Link>

            <Link 
              to="/Donate" 
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-[#12345A] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:border-slate-400"
            >
              <FaHeart className="text-red-500" /> Support SSF
            </Link>
          </div>

        </div>
      </section>

      <AuthModal open={loginOpen} initialMode={authMode} onClose={() => setLoginOpen(false)} />
    </main>
  );
}
