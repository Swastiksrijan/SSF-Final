import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaBuilding, FaHeartbeat, FaMicrochip, FaMapMarkedAlt, FaFilePdf, FaDownload, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";

export default function UpcomingProjects() {
  return (
    <div className="w-full font-inria bg-white">

      {/* ================= HERO ================= */}
      <section className="bg-[#001529] text-white pt-48 pb-24 relative overflow-hidden text-center px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#fb8500_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fb8500] opacity-[0.03] rounded-full blur-[100px]"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8">
              Building The <span className="text-[#fb8500]">Future</span>
            </h1>
            <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed font-medium">
              Our vision for 2026 and beyond. Expanding our footprint, embracing technology, and deepening our impact across Bharat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= 1. NEW ACADEMIES & HUBS ================= */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-blue-50 text-[#002344] rounded-[2rem] flex items-center justify-center text-3xl shadow-sm border border-blue-100">
              <FaMapMarkedAlt />
            </div>
            <div className="space-y-4">
              <p className="text-[#2d6a4f] font-bold text-xs uppercase tracking-[0.2em]">Scale of Impact</p>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344]">New Centers & Hubs</h2>
            </div>
            <p className="text-xl text-zinc-500 leading-relaxed font-medium">
              We are aggressively expanding our physical presence to reach the most remote corners of Madhya Pradesh and Uttar Pradesh.
            </p>

            <div className="space-y-8 pt-4">
              <div className="flex gap-6 group">
                <div className="p-4 bg-emerald-50 text-[#2d6a4f] rounded-2xl h-fit transition-transform group-hover:scale-110">
                  <FaBuilding className="text-2xl" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#002344]">5 New Academies</h4>
                  <p className="text-zinc-500 font-medium mt-1">Scheduled for Q3 2025: Patna, Gaya, Muzaffarpur, Varanasi, and Gorakhpur.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="p-4 bg-blue-50 text-[#002344] rounded-2xl h-fit transition-transform group-hover:scale-110">
                  <FaMicrochip className="text-2xl" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#002344]">10 Digital Learning Hubs</h4>
                  <p className="text-zinc-500 font-medium mt-1">Solar-powered, internet-enabled micro-hubs in deep rural villages.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[#2d6a4f]/5 rounded-[3rem] blur-2xl"></div>
            <div className="relative bg-white rounded-[2.5rem] p-4 shadow-2xl border border-zinc-100 overflow-hidden">
              <img
                src="/images/academy/academy-expansion.jpg"
                alt="Map of Future Sites - Rewa & Satna Expansion"
                className="w-full h-full object-cover rounded-[1.5rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SSF YOUTH CAREER NETWORK ================= */}
      {/* <section className="py-32 px-6 bg-[#f8f9fa] border-y border-zinc-100">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="bg-white rounded-[3rem] p-6 shadow-2xl border border-zinc-50 transform -rotate-2 hover:rotate-0 transition duration-700">
                            <img
                                src="/images/ssf-youth-career.png"
                                alt="SSF Youth Career Network"
                                className="w-full h-full object-contain rounded-[2rem]"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#fb8500]/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <span className="inline-block px-4 py-1.5 bg-[#002344] text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-blue-900/20">
                            Free Registration
                        </span>

                        <h2 className="text-4xl lg:text-6xl font-serif font-bold text-[#002344] leading-tight">
                            SSF Youth <br />
                            <span className="text-[#fb8500]">Career Network</span>
                        </h2>

                        <p className="text-xl text-zinc-500 leading-relaxed font-medium">
                            A Pan-India initiative by Swastik Srijan Foundation to empower students and youth with
                            career-ready skills, confidence, and expert mentorship.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            {[
                                "Interview Prep",
                                "Public Speaking",
                                "Career Mentorship",
                                "Personality Dev",
                                "LinkedIn / Resume",
                                "Live Workshops",
                                "Skill Training",
                                "Industry Guidance"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-zinc-50 shadow-sm">
                                    <div className="w-2 h-2 bg-[#fb8500] rounded-full"></div>
                                    <span className="text-zinc-700 font-bold text-sm tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-8 items-center pt-8">
                            <a
                                href={CONTACT_INFO.social.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="btn-primary px-10 py-5">
                                    Register on WhatsApp
                                </button>
                            </a>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[#002344] font-bold text-lg">
                                    {CONTACT_INFO.phones.primaryFormatted}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
             */}
      {/* ================= SSF LEARNING HUB (LIVE) ================= */}
      <section className="py-32 px-6 bg-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#fb8500]/5 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 bg-[#2d6a4f] text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
              Currently Active
            </span>

            <h2 className="text-4xl lg:text-6xl font-serif font-bold text-[#002344] leading-tight">
              SSF <span className="text-[#fb8500]">Learning Hub</span>
            </h2>

            <p className="text-xl text-zinc-600 leading-relaxed font-medium">
              SSF Learning Hub is an active, community-driven education initiative offering
              <span className="font-bold text-[#002344]"> both online and offline classes</span>.
              It supports students, youth, and communities with holistic learning, guidance,
              and real-world support.
            </p>

            {/* FEATURES */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {[
                "Academic Education Support",
                "Interview Preparation",
                "Career & Personal Counselling",
                "Legal Advisory Guidance",
                "Competitive Exam Support",
                "Life Skills & Awareness Sessions",
                "Student Mentorship Programs",
                "Community Problem Solving"
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 hover:border-[#fb8500]/40 transition-all"
                >
                  <div className="w-2.5 h-2.5 bg-[#fb8500] rounded-full"></div>
                  <span className="text-zinc-700 font-bold text-sm tracking-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* JOIN INFO */}
            <div className="pt-8 space-y-3">
              <p className="text-lg font-bold text-[#002344]">
                👩‍🎓 Students can join for learning & guidance
              </p>
              <p className="text-lg font-bold text-[#002344]">
                👨‍🏫 Volunteer teachers & mentors are welcome
              </p>
              <p className="text-zinc-500 font-medium italic">
                "Together, we learn. Together, we grow."
              </p>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[#002344]/5 rounded-[3rem] blur-2xl"></div>
            <div className="relative bg-white rounded-[2.5rem] p-6 shadow-2xl border border-zinc-100">
              <img
                src="./Gallery_Images/ssf.jpg"
                alt="SSF Learning Hub Online Offline Classes"
                className="w-full h-full object-cover rounded-[2rem]"
              />
            </div>
          </motion.div>
        </div>
      </section>
      {/* ================= PROJECT DOCUMENT (OFFICIAL PROPOSAL) ================= */}
      <section className="py-24 px-6 relative overflow-hidden bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-16 shadow-xl border border-zinc-100 relative overflow-hidden">
            {/* Decorative BG elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#fb8500]/5 to-[#002344]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">

              {/* LEFT: DOCUMENT VISUAL MOCKUP */}
              <div className="lg:col-span-4 lg:order-1 order-2 flex justify-center lg:justify-start">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#002344] rounded-2xl rotate-6 opacity-20 blur-lg group-hover:rotate-12 transition-all duration-500"></div>
                  <div className="relative w-64 aspect-[1/1.414] bg-white rounded-xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col transform group-hover:-translate-y-2 transition-transform duration-500">
                    {/* Header of Doc */}
                    <div className="h-1/3 bg-[#002344] p-6 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-full bg-[#fb8500]/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#fb8500] rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                        <div className="h-2 w-24 bg-white/40 rounded-full"></div>
                      </div>
                    </div>
                    {/* Body of Doc */}
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-2 w-full bg-zinc-100 rounded-full"></div>
                      <div className="h-2 w-5/6 bg-zinc-100 rounded-full"></div>
                      <div className="h-2 w-4/6 bg-zinc-100 rounded-full"></div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full"></div>
                      <div className="h-2 w-3/4 bg-zinc-100 rounded-full"></div>
                    </div>
                    {/* Footer of Doc */}
                    <div className="h-16 border-t border-zinc-50 flex items-center justify-between px-6 bg-zinc-50/50">
                      <div className="text-[10px] font-bold text-[#002344]">OFFICIAL</div>
                      <FaFilePdf className="text-red-500 text-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: CONTENT */}
              <div className="lg:col-span-8 lg:order-2 order-1 space-y-8 text-center lg:text-left">
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#002344]/5 text-[#002344] text-xs font-bold rounded-full uppercase tracking-widest border border-[#002344]/10 mb-6">
                    <span className="w-2 h-2 bg-[#002344] rounded-full animate-pulse"></span>
                    Official Proposal Document
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344] leading-tight mb-4">
                    Strategic Vision: <span className="text-[#fb8500]">The SSF National Academy</span>
                  </h2>
                  <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    A comprehensive blueprint outlining our mission to establish state-of-the-art educational excellence centers across Bharat by 2027-28.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {[
                    "5-Year Strategic Roadmap",
                    "Impact & Sustainability Model",
                    "Infrastructure & Architecture",
                    "Financial Allocation"
                  ].map((trait, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-lg border border-zinc-100">
                      <FaCheckCircle className="text-[#2d6a4f] text-sm" />
                      <span className="text-sm font-bold text-zinc-700">{trait}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
                  <a
                    href="/pdfs/SSF.pdf"
                    download="SSF_National_Academy_Proposal.pdf"
                    className="relative overflow-hidden group px-10 py-5 bg-[#fb8500] text-white font-bold rounded-full hover:bg-[#e76f00] transition-all shadow-xl shadow-[#fb8500]/20"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <FaDownload />
                      <span>Download Full Proposal</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </a>
                  <div className="text-left text-sm text-zinc-400 font-medium">
                    <p>PDF Format • 45 MB</p>
                    <p>Last Updated: January 2026</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ================= WATCH THIS (VIDEOS) ================= */}
      <section className="py-24 px-6 bg-[#f8f9fa] border-t border-zinc-100">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* HEADER */}
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1.5 bg-[#002344] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
              Watch This
            </span>

            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#002344]">
              SSF in <span className="text-[#fb8500]">Action</span>
            </h2>

            <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
              Real stories, real impact — see how Swastik Srijan Foundation
              is transforming lives on the ground.
            </p>
          </div>

          {/* VIDEOS GRID */}
          <div className="grid md:grid-cols-3 gap-8">

            {/* VIDEO 1 */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-200 bg-black">
              <iframe
                src="https://www.youtube.com/embed/5ccBV5QVy20"
                title="SSF Impact Video 1"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* VIDEO 2 */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-200 bg-black">
              <iframe
                src="https://www.youtube.com/embed/-lc_6cUS-3g"
                title="SSF Impact Video 2"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* VIDEO 3 */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-200 bg-black">
              <iframe
                src="https://www.youtube.com/embed/d1W4UZ_PGpE"
                title="SSF Impact Video 3"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

          </div>

        </div>
      </section>



      {/* ================= SSF National Academy ROADMAP ================= */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <p className="text-[#fb8500] font-bold text-xs uppercase tracking-[0.2em]">Our Flagship Roadmap</p>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344]">Knowledge Hub for Future Leaders</h2>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium">Our comprehensive roadmap for the SSF National Academy excellence centers.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center bg-[#f8f9fa] p-10 rounded-[3rem] border border-zinc-100 shadow-sm">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/images/academy/academy-roadmap.jpg"
                alt="SSF National Academy Future Roadmap"
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/images/academy/academy-mission-hindi.jpg"
                alt="SSF National Academy Mission"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CSR APPEAL ================= */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#001529] to-[#002344] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">

          <span className="inline-block px-4 py-1.5 bg-[#fb8500] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
            CSR Partnership
          </span>

          <h2 className="text-3xl lg:text-4xl font-serif font-bold">
            Partner Through <span className="text-[#fb8500]">CSR</span>
          </h2>

          <p className="text-lg text-zinc-300 font-medium leading-relaxed">
            Collaborate with <strong>Swastik Srijan Foundation</strong> to create
            scalable, transparent, and measurable impact in
            <strong> education, youth development, and community upliftment</strong>.
          </p>

          <div className="pt-4">
            <Link to="/Contact">
              <button className="px-10 py-4 bg-[#fb8500] text-white font-bold rounded-full hover:bg-[#e76f00] transition-all shadow-lg">
                Explore CSR Partnership
              </button>
            </Link>
          </div>

        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-32 bg-[#001529] text-white text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#fb8500_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <h2 className="text-4xl lg:text-6xl font-serif font-bold">
            Invest in Our <span className="text-[#fb8500]">Future</span>
          </h2>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            Your partnership today builds the infrastructure for tomorrow's leaders. Join us as a Vision Partner.
          </p>
          <div className="pt-8">
            <Link to="/Contact">
              <button className="btn-cta px-14 py-6 text-xl shadow-[#d90429]/20">
                Become a Vision Partner
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
