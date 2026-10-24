import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { 
  FaArrowRight, 
  FaCalendarAlt, 
  FaGlobeAsia, 
  FaHeart, 
  FaHandshake, 
  FaShieldAlt, 
  FaUsers, 
  FaBullseye, 
  FaAward, 
  FaCheckCircle,
  FaFileContract,
  FaQuoteLeft
} from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import footerImg1 from "../assets/footer-gallery-1.jpg";
import footerImg2 from "../assets/footer-gallery-2.jpg";
import footerImg3 from "../assets/footer-gallery-3.jpg";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-amber-500 selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[55vh] md:min-h-[65vh] w-full overflow-hidden bg-[#0A192F] text-white flex items-center">
        {/* Background Mosaic */}
        <div className="absolute inset-0 p-2 sm:p-4 opacity-25">
          <div className="grid h-full grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4">
            {[footerImg1, footerImg2, footerImg3].map((img, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl bg-[#0A192F]">
                <img 
                  src={img} 
                  alt="Swastik Srijan Community Work" 
                  className="h-full w-full object-cover object-center scale-105" 
                  loading={index === 0 ? "eager" : "lazy"} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0A192F]/60 to-[#0A192F]"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-5 py-24 max-w-5xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest backdrop-blur-md">
              <FaAward className="text-amber-400" /> Swastik Srijan Foundation • स्थापना 2013
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              Rooted in Service, <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                Driven by Purpose
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-lg sm:text-xl text-slate-300 font-medium leading-relaxed pt-2">
              Empowering marginalized communities across Rewa, Madhya Pradesh & PAN India through education, healthcare, sustainable livelihoods, and statutory integrity.
            </p>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-amber-300/90 font-hindi font-medium">
              सशक्त समाज, स्वावलम्बी भारत — शिक्षा, स्वास्थ्य और सेवा से सृजन का संकल्प।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= STATUTORY COMPLIANCE BAR ================= */}
      <section className="relative -mt-10 z-20 container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200/80 hover:border-amber-400 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-2xl group-hover:scale-110 transition-transform">
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Established</p>
                <p className="text-xl font-extrabold text-[#0A192F]">30 Dec 2013</p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">10+ Years of Service</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200/80 hover:border-amber-400 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl group-hover:scale-110 transition-transform">
                <FaFileContract />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Legal Registration</p>
                <p className="text-lg font-black text-[#0A192F] break-all">05/22/03/11448/13</p>
                <p className="text-xs text-slate-500 font-medium">MP Societies Act, 1973</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200/80 hover:border-amber-400 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl group-hover:scale-110 transition-transform">
                <FaShieldAlt />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">CSR & Tax Relief</p>
                <p className="text-lg font-black text-[#0A192F]">12AB • 80G • CSR-1</p>
                <p className="text-xs text-emerald-600 font-semibold">Eligible for CSR Grants</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-200/80 hover:border-amber-400 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl group-hover:scale-110 transition-transform">
                <FaGlobeAsia />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jurisdiction</p>
                <p className="text-xl font-extrabold text-[#0A192F]">Rewa & PAN India</p>
                <p className="text-xs text-slate-500 font-medium">Central HQ: Rewa, M.P.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= WHO WE ARE OVERVIEW ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-5 max-w-5xl text-center">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-[0.25em] bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full">
            Our Identity & Mandate
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] mt-4 tracking-tight">
            Who We Are | हम कौन हैं
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mt-6 max-w-4xl mx-auto font-normal">
            Founded in December 2013, <strong>Swastik Srijan Foundation Samiti</strong> is a registered non-profit organization headquartered in Dadar, Rewa, Madhya Pradesh. We operate with an all-India outreach to foster inclusive community advancement through education, preventive healthcare, livelihood incubation, and statutory transparency.
          </p>
          
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed mt-4 font-hindi max-w-3xl mx-auto">
            दिसंबर 2013 में स्थापित, स्वस्तिक सृजन फाउंडेशन मध्य प्रदेश के रीवा में स्थित एक पंजीकृत गैर-लाभकारी संस्था है, जो शिक्षा, स्वास्थ्य, कौशल, महिला स्वावलंबन और सतत विकास के माध्यम से भारत भर में समुदायों के साथ कार्य करती है।
          </p>

          {/* Core Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6 text-left mt-14">
            <Link 
              to="/Mission" 
              className="p-8 rounded-3xl bg-slate-50 hover:bg-[#0A192F] hover:text-white transition-all duration-300 border border-slate-200 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl mb-6 group-hover:bg-white/10 group-hover:text-amber-400">
                  <FaBullseye />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-white text-slate-900">Mission & Vision</h3>
                <p className="text-sm text-slate-500 group-hover:text-slate-300 leading-relaxed">
                  Our core foundational principles, moral compass, and developmental vision.
                </p>
              </div>
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider group-hover:text-amber-300 mt-6 pt-4 border-t border-slate-200 group-hover:border-white/10">
                Read Full Mission <FaArrowRight />
              </div>
            </Link>

            <Link 
              to="/Objectives" 
              className="p-8 rounded-3xl bg-slate-50 hover:bg-[#0A192F] hover:text-white transition-all duration-300 border border-slate-200 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl mb-6 group-hover:bg-white/10 group-hover:text-amber-400">
                  <FaHandshake />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-white text-slate-900">Key Objectives</h3>
                <p className="text-sm text-slate-500 group-hover:text-slate-300 leading-relaxed">
                  Strategic milestones targeting UN SDGs in education, health, and rural growth.
                </p>
              </div>
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider group-hover:text-amber-300 mt-6 pt-4 border-t border-slate-200 group-hover:border-white/10">
                Explore Focus Areas <FaArrowRight />
              </div>
            </Link>

            <Link 
              to="/Team" 
              className="p-8 rounded-3xl bg-slate-50 hover:bg-[#0A192F] hover:text-white transition-all duration-300 border border-slate-200 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl mb-6 group-hover:bg-white/10 group-hover:text-amber-400">
                  <FaUsers />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-white text-slate-900">Leadership Team</h3>
                <p className="text-sm text-slate-500 group-hover:text-slate-300 leading-relaxed">
                  Our Governing Board, managing committee members, and dedicated on-ground volunteers.
                </p>
              </div>
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider group-hover:text-amber-300 mt-6 pt-4 border-t border-slate-200 group-hover:border-white/10">
                View Leadership <FaArrowRight />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PRESIDENT'S / FOUNDER'S MESSAGE ================= */}
      <section className="py-24 bg-gradient-to-b from-slate-100 to-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-5 max-w-6xl">
          
          <div className="text-center mb-14">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-[0.25em] bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full">
              Leadership Word
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0A192F] mt-3">
              Founder & President’s Message
            </h2>
            <p className="text-slate-500 mt-2 font-hindi text-base">संस्थापक एवं अध्यक्ष का संदेश</p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-slate-200/80 grid lg:grid-cols-[300px_1fr] gap-10 lg:gap-14 items-center">
            
            {/* Founder Profile */}
            <div className="text-center">
              <div className="relative mx-auto w-52 sm:w-60 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                <OptimizedImage 
                  src="/Teams_Images/ramesh_pandey.jpg?v=2" 
                  alt="Mr. Ramesh Pandey, Founder and President of Swastik Srijan Foundation" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h3 className="text-2xl font-black text-[#0A192F] mt-5">Mr. Ramesh Pandey</h3>
              <p className="text-amber-600 font-bold text-sm tracking-wide">Founder & President</p>
              <p className="text-slate-400 text-xs mt-1">Swastik Srijan Foundation Samiti</p>
            </div>

            {/* Message Content */}
            <div className="space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
              <FaQuoteLeft className="text-amber-500/20 text-5xl mb-2" />
              
              <p className="font-medium text-slate-900 leading-relaxed">
                “Social development becomes genuinely impactful when driven by grassroot cooperation, transparent governance, and unconditional empathy. Swastik Srijan Foundation was created in 2013 on the conviction that every citizen—regardless of geography or socio-economic background—deserves dignity, equal opportunity, and the tools to self-sustain.”
              </p>

              <p>
                Our ongoing trajectory is anchored in practical field execution: quality schooling, life-saving preventive health camps, rural women self-help incubation, and environmental restoration. We welcome corporate partners, philanthropic institutions, and volunteers to walk hand-in-hand with us.
              </p>

              <p className="font-hindi text-base sm:text-lg text-slate-800 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60 leading-relaxed">
                "हमारा प्रयास है कि सहयोग, कौशल, जन-जागरूकता और सृजन के माध्यम से समाज के अंतिम व्यक्ति तक सकारात्मक परिवर्तन पहुँचे। सेवा में शत-प्रतिशत वित्तीय पारदर्शिता, मानवीय सम्मान और निष्ठा ही हमारी सबसे बड़ी शक्ति है।"
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                  <FaCheckCircle /> Registered Society No. 05/22/03/11448/13
                </div>
                <div className="text-slate-500 text-xs font-semibold">
                  Rewa, Madhya Pradesh (India)
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 10-YEAR JOURNEY TIMELINE ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-5 max-w-5xl text-center">
          
          <span className="text-amber-600 font-bold text-xs uppercase tracking-[0.25em] bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full">
            Our Evolution
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0A192F] mt-3">
            A Decade of Dedicated Service (2013 – Present)
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
            From modest grassroots beginnings in Rewa to institutional partnerships, each phase has cemented our accountability and ground-level execution.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-14 text-left">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase">Phase 1</span>
              <h3 className="font-black text-[#0A192F] text-2xl mt-4">2013 – 2017</h3>
              <p className="font-bold text-slate-800 text-sm mt-1">Foundational Community Trust</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Official registration under MP Societies Act. Establishment of village-level relationships, early literacy camps, and emergency winter relief drives.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase">Phase 2</span>
              <h3 className="font-black text-[#0A192F] text-2xl mt-4">2018 – 2024</h3>
              <p className="font-bold text-slate-800 text-sm mt-1">Scale & Statutory Excellence</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Procurement of 12AB, 80G tax exemptions, and MCA CSR-1 certifications. Expansion into Women Self-Help Groups (SHGs) and structured medical diagnostics.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase">Current Era</span>
              <h3 className="font-black text-[#0A192F] text-2xl mt-4">2025 – 2026</h3>
              <p className="font-bold text-slate-800 text-sm mt-1">Institutional Partnerships & CSR</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Digital transparency, open public reporting, corporate CSR grant integrations, and youth vocational incubation centers across central India.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link 
              to="/Impact" 
              className="inline-flex items-center gap-2 bg-[#0A192F] text-white px-9 py-4 rounded-full font-bold text-sm hover:bg-amber-500 hover:text-[#0A192F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Verified Impact Data <FaArrowRight />
            </Link>
          </div>

        </div>
      </section>

      {/* ================= TRANSPARENCY & STATUTORY ETHICS ================= */}
      <section className="py-24 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-5 max-w-6xl">
          
          <div className="text-center mb-16 space-y-3">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-[0.25em] bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
              Institutional Governance
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0A192F]">
              Transparency, Ethics & Compliance
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
              We operate under full public disclosure with audited accounts, statutory filings, and government integrity pledges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
            
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <OptimizedImage 
                src="/images/cvc-certificate.jpg" 
                alt="Central Vigilance Commission (CVC) Integrity Pledge Certificate" 
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300" 
              />
              <div className="p-4 bg-slate-900 text-white text-center text-xs font-semibold tracking-wide">
                Central Vigilance Commission (CVC) • Official Integrity Pledge
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F]">
                Uncompromising Commitment to Statutory Trust
              </h3>
              
              <p className="text-slate-700 leading-relaxed text-base">
                Swastik Srijan Foundation adheres to the highest tenets of financial discipline and statutory accountability. Every contribution received is audited and deployed directly on-ground with zero intermediary leakage.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <FaShieldAlt className="text-amber-500 text-2xl mb-2" />
                  <p className="font-extrabold text-[#0A192F] text-base">NITI Aayog</p>
                  <p className="text-xs text-slate-500 mt-0.5">NGO-DARPAN Verified</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <FaHandshake className="text-emerald-600 text-2xl mb-2" />
                  <p className="font-extrabold text-[#0A192F] text-base">MCA CSR-1</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ministry of Corp. Affairs</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <p className="font-extrabold text-[#0A192F] text-sm">Audited Financials & 80G Receipts</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  All individual and corporate donors receive immediate digital receipts eligible for 50% tax deductions under Section 80G of the Income Tax Act.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-5 max-w-4xl text-center relative z-10 space-y-6">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.25em] bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            Join the Movement
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Be Part of Our Transformative Journey
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Whether you represent a CSR foundation, a corporate partner, or an individual change-maker, your association drives real grassroots impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              to="/GetInvolved" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0A192F] px-9 py-4 rounded-full font-black text-sm hover:brightness-110 transition-all shadow-xl hover:-translate-y-0.5"
            >
              Partner / Join SSF <FaArrowRight />
            </Link>
            <Link 
              to="/Volunteer" 
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-9 py-4 rounded-full font-bold text-sm hover:bg-white hover:text-[#0A192F] transition-all"
            >
              Become a Volunteer <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
