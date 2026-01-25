
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  FaHeart, FaArrowRight, FaShieldAlt, FaWhatsapp,
  FaHandHoldingHeart, FaUsers, FaLandmark, FaCheckCircle,
  FaRegFileAlt, FaGlobeAsia, FaHandshake
} from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import FloatingTicker from "../components/FloatingTicker";
import ImpactTimeline from "../components/ImpactTimeline";
import { FaQuoteLeft } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";

// Import images
const heroImage = "/images/hero-main.jpg";

export default function Home() {

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="w-full bg-white font-sans text-zinc-800">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden bg-[#001529]">
        {/* Full-width real community photo with dark gradient overlay */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={heroImage}
            alt="Swastik Srijan Foundation Community"
            className="w-full h-full object-cover brightness-[0.85] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001529] via-[#001529]/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-start justify-center h-full text-left">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl space-y-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[2px] w-12 bg-[#FF6600]"></div>
              <h2 className="text-white font-bold tracking-widest uppercase text-sm md:text-base">
                Swastik Srijan Foundation
              </h2>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
              Transforming Lives <br /> Across Rural India
              <span className="block text-2xl md:text-4xl mt-3 font-normal text-zinc-100 opacity-90 drop-shadow-md">
                ग्रामीण भारत में जीवन परिवर्तन
              </span>
            </h1>

            {/* Impact keywords */}
            <div className="flex flex-wrap items-center gap-6 text-white font-bold text-sm md:text-lg uppercase tracking-wide mt-2">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FF6600]"></div>Education | शिक्षा</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FF6600]"></div>Health | स्वास्थ्य</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FF6600]"></div>Livelihood | आजीविका</span>
            </div>

            {/* Two primary buttons (Stacked on mobile) */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-8 pt-4">
              <a
                href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                target="_blank"
                rel="noreferrer noopener"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto px-8 py-4 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#e65c00] transition-colors shadow-xl active:scale-95 text-lg flex items-center gap-2">
                  Donate Now <FaHeart className="text-sm" />
                </button>
              </a>
              <Link to="/Impact" className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#002344] transition-colors text-lg">
                Our Impact
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <div className="bg-[#002344] text-zinc-300 py-3 text-center text-xs md:text-sm font-medium border-t border-white/10">
        <div className="container mx-auto px-4">
          Registered NGO | Reg. No. 05/22/03/11448/13 | Serving India Since 2013
        </div>
      </div>

      {/* 2.5 FLOATING TICKER (SEVA SAMRPAN PANEL) */}
      <FloatingTicker />



      {/* 4. IMPACT AT A GLANCE */}
      <section className="py-12 bg-zinc-50 border-y border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                text: "20,000+", sub: "Lives Impacted", subHi: "प्रभावित जीवन",
                icon: <FaUsers className="text-[#FF6600] text-4xl mb-4" />
              },
              {
                text: "100+", sub: "Villages Reached", subHi: "गाँव तक पहुँच",
                icon: <FaGlobeAsia className="text-[#002344] text-4xl mb-4" />
              },
              {
                text: "12+", sub: "Years of Service", subHi: "सेवा के वर्ष",
                icon: <FaHeart className="text-red-500 text-4xl mb-4" />
              },
              {
                text: "Volunteer", sub: "Driven Initiatives  - (Become a volunteer)", subHi: "स्वयंसेवक संचालित",
                icon: <FaHandshake className="text-green-600 text-4xl mb-4" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border border-zinc-100 flex flex-col items-center"
              >
                {item.icon}
                <h3 className="text-3xl font-extrabold text-zinc-800 mb-1">{item.text}</h3>
                <p className="text-zinc-600 font-bold uppercase text-sm tracking-wider">{item.sub}</p>
                <p className="text-zinc-400 text-xs mt-1">{item.subHi}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* 5. ABOUT US (Short & Honest) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002344] mb-4">About Us | हमारे बारे में</h2>
            <div className="w-20 h-1 bg-[#FF6600] mx-auto rounded-full"></div>
          </div>

          <div className="text-lg md:text-xl text-zinc-600 leading-relaxed text-center mb-12">
            <p className="mb-6">
              Founded in 2013, Swastik Srijan Foundation is a registered non-government organization (NGO) working at the grassroots level in Madhya Pradesh and across India. We believe that true nation-building starts from our villages.
            </p>
            <ul className="text-left max-w-2xl mx-auto space-y-4 mt-8 bg-zinc-50 p-8 rounded-xl border border-zinc-100">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-[#FF6600] mt-1 shrink-0" />
                <span><strong className="text-[#002344]">Our Mission:</strong> To bridge the gap between privilege and poverty through education and skill development.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-[#FF6600] mt-1 shrink-0" />
                <span><strong className="text-[#002344]">What We Do:</strong> We run community schools, health camps, and livelihood training centers for the underprivileged.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-[#FF6600] mt-1 shrink-0" />
                <span><strong className="text-[#002344]">Why We Exist:</strong> Because every child deserves a future, regardless of their background.</span>
              </li>
            </ul>
            <div className="flex justify-center mt-12">
              <Link to="/About">
                <button className="group flex items-center gap-3 px-8 py-3 bg-white border-2 border-[#002344] text-[#002344] font-bold rounded-full hover:bg-[#002344] hover:text-white transition-all active:scale-95 shadow-lg shadow-zinc-200/50">
                  Read Our Full Story | पूरी कहानी पढ़ें
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* 5.25 CSR APPEAL SECTION */}
      <section className="py-20 bg-gradient-to-br from-[#001529] to-[#002344] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl p-10 md:p-14">

            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* LEFT CONTENT */}
              <div className="space-y-5">
                <span className="inline-block px-4 py-1.5 bg-[#FF6600] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                  CSR Partnership
                </span>

                <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                  Become a <span className="text-[#FF6600]">Corporate Donor</span>
                </h2>

                <p className="text-zinc-300 text-lg leading-relaxed">
                  <strong>Swastik Srijan Foundation</strong> runs
                  <strong> 40+ community programmes</strong> across India through
                  corporate, institutional, and individual partnerships.
                </p>

                <p className="text-zinc-300 text-lg leading-relaxed">
                  Our work focuses on <strong>education, health & nutrition,
                    child protection, livelihoods, humanitarian relief</strong>,
                  and building resilient communities.
                </p>
              </div>

              {/* RIGHT CONTENT */}
              <div className="space-y-5">
                <h3 className="text-2xl font-bold">
                  Together for a Better Bharat
                </h3>

                <p className="text-zinc-300 text-lg leading-relaxed">
                  Partner with us to help underprivileged children and youth
                  not just survive — but truly thrive.
                </p>

                <p className="text-zinc-300 text-lg leading-relaxed">
                  Through CSR partnerships, we create scalable,
                  transparent, and measurable impact. Together,
                  we can reach many more lives.
                </p>

                {/* CONTACT INFO */}
                <div className="pt-4 space-y-1">
                  <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
                    CSR & Institutional Partnerships
                  </p>
                  <p className="text-sm text-zinc-300">
                    Email: {CONTACT_INFO.primaryEmail}
                  </p>
                  <p className="text-[10px] text-zinc-500 italic">
                    [Note: info@swastiksrijan.org/.in under temp. tech-issue]
                  </p>
                </div>

                {/* MORE INFO LINK */}
                <div className="pt-3">
                  <a
                    href="https://sites.google.com/view/swastiksrijanprofile/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#FF6600] font-bold text-sm hover:underline hover:text-[#ff7a1a] transition"
                  >
                    For more information, click here
                  </a>
                </div>

                {/* BUTTONS */}
                <div className="pt-6 flex flex-wrap gap-4">
                  <Link to="/Contact">
                    <button className="px-8 py-4 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#e65c00] transition-all shadow-lg active:scale-95">
                      Partner With Us
                    </button>
                  </Link>
                  <Link to="/Impact">
                    <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-[#002344] transition-all active:scale-95">
                      Our Impact
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>



      {/* 5.5 FOUNDER MESSAGE */}
      <section className="py-12 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden flex flex-col md:flex-row items-stretch">
            {/* Image Side - Fixed Aspect to show full content without taking too much height */}
            <div className="md:w-1/2 relative min-h-[300px] bg-zinc-100">
              <OptimizedImage
                src="/images/humanity-mission.jpg"
                alt="SSF Mission in Action"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Content Side */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white">
              <FaQuoteLeft className="text-4xl text-zinc-50 absolute top-6 right-6" />
              <div className="relative z-10 space-y-6">
                <div>
                  <span className="text-[#FF6600] font-bold uppercase tracking-widest text-[10px]">Founder's Message | संस्थापक का संदेश</span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#002344]">Building a <span className="text-[#FF6600]">Better Bharat</span></h2>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-zinc-600 font-serif italic leading-relaxed">
                    "Building a better Bharat requires a collective spirit of <span className="text-[#002344] font-bold">Seva</span> and <span className="text-[#002344] font-bold">Samarpan</span>."
                  </p>
                  <p className="text-sm font-hindi text-zinc-500 border-t border-zinc-50 pt-4">
                    "बेहतर भारत के निर्माण के लिए सेवा और समर्पण की सामूहिक भावना की आवश्यकता है।"
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <div className="w-10 h-1 bg-[#FF6600] rounded-full"></div>
                  <div>
                    <p className="text-[#002344] font-bold text-sm tracking-widest uppercase">Ramesh Pandey</p>
                    <p className="text-[10px] text-[#FF6600] font-bold uppercase tracking-widest">Founder & President</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRIMARY ACTIONS SECTION (Repeat Buttons) */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#002344] mb-8">Be a Part of the Change | बदलाव का हिस्सा बनें</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
              target="_blank"
              rel="noreferrer noopener"
            >
              <button className="px-10 py-4 bg-[#FF6600] text-white font-bold rounded-full hover:bg-[#e65c00] transition-all shadow-xl shadow-orange-500/20 active:scale-95 text-lg">
                Donate Now
              </button>
            </a>
            <Link to="/Impact" className="px-10 py-4 bg-white text-[#002344] border hover:bg-zinc-50 border-zinc-200 font-bold rounded-full transition-all shadow-lg active:scale-95 text-lg">
              Our Impact
            </Link>
          </div>
        </div>
      </section>

      {/* 7. LEGAL & COMPLIANCE SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#002344] flex items-center justify-center gap-3">
              <FaShieldAlt className="text-[#002344]" />
              Transparency & Compliance
            </h2>
            <p className="text-zinc-500 mt-2">We adhere to the highest standards of legal and financial integrity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { label: "Established", value: "2013", icon: <FaLandmark /> },
              { label: "Registered Under", value: "MP Societies Registration Act, 1973", icon: <FaRegFileAlt /> },
              { label: "Registration No", value: "05/22/03/11448/13", icon: <FaShieldAlt /> },
              { label: "NITI Aayog (NGO Darpan)", value: "Registered", icon: <FaCheckCircle /> },
              { label: "12A & 80G", value: "Provisionally Approved", icon: <FaCheckCircle /> },
              { label: "CSR-1", value: "Registered", icon: <FaCheckCircle /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-6 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-[#FF6600]/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#FF6600] shadow-sm text-lg border border-zinc-100 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-zinc-800 font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GET INVOLVED (Home End) */}
      <section className="pb-24 bg-[#001529] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 pt-24">Get Involved | हमसे जुड़ें</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-12 text-lg">
            There are many ways to contribute. Choose how you want to serve the nation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Join WhatsApp */}
            <a
              href={CONTACT_INFO.social.whatsappGroup}
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-[#25D366] hover:text-white p-8 rounded-2xl transition-all group flex flex-col items-center gap-4 backdrop-blur-sm border border-white/5"
            >
              <FaWhatsapp className="text-4xl text-[#25D366] group-hover:text-white transition-colors" />
              <div className="font-bold text-xl">Join WhatsApp</div>
            </a>

            {/* Volunteer */}
            <Link
              to="/Volunteer"
              className="bg-white/10 hover:bg-[#FF6600] p-8 rounded-2xl transition-all group flex flex-col items-center gap-4 backdrop-blur-sm border border-white/5"
            >
              <FaHandHoldingHeart className="text-4xl text-[#FF6600] group-hover:text-white transition-colors" />
              <div className="font-bold text-xl">Volunteer</div>
            </Link>

            {/* Support Our Work */}
            <Link
              to="/DonateAndSupport"
              className="bg-white/10 hover:bg-[#FF6600] p-8 rounded-2xl transition-all group flex flex-col items-center gap-4 backdrop-blur-sm border border-white/5"
            >
              <FaHeart className="text-4xl text-[#FF6600] group-hover:text-white transition-colors" />
              <div className="font-bold text-xl">Support Our Work</div>
            </Link>

            {/* Become a Member */}
            <Link
              to="/Members"
              className="bg-white/10 hover:bg-[#FF6600] p-8 rounded-2xl transition-all group flex flex-col items-center gap-4 backdrop-blur-sm border border-white/5"
            >
              <FaUsers className="text-4xl text-[#FF6600] group-hover:text-white transition-colors" />
              <div className="font-bold text-xl">Become a Member</div>
            </Link>
          </div>
        </div>
      </section>

      {/* 8.5 LAST MILESTONE (IMPACT TIMELINE) */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4">
          <ImpactTimeline />
        </div>
      </section>

    </div>
  );
}
