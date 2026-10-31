import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaBuilding, FaHeartbeat, FaMicrochip, FaMapMarkedAlt, FaFilePdf, FaDownload, FaCheckCircle, FaArrowRight, FaHeart } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import profilePdf from "../assets/Swastik Srijan Profile 2026.pdf";


import PageHero from "../components/PageHero";
import UpcomingEvidenceBanner from "../components/UpcomingEvidenceBanner";

export default function UpcomingProjects() {
  return (
    <div className="w-full font-inria bg-white">

      {/* ================= HERO ================= */}
      <PageHero
        image="/images/real/academy_banner_wide.jpg"
        title="Building The Future"
        subtitle="Our vision for 2026 and beyond. Expanding our footprint, embracing technology, and deepening our impact across Bharat."
        hindiSubtitle="भविष्य का निर्माण - 2026 और उससे आगे की हमारी दृष्टि।"
      />

      {/* ================= 2026+ STRATEGIC DIRECTION ================= */}
      <UpcomingEvidenceBanner />

      {/* ================= 1. SCHOOL DONATION APPEAL ================= */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="w-20 h-20 bg-[#EAF0F6] text-[#12345A] rounded-[2rem] flex items-center justify-center text-3xl shadow-sm border border-[#EAF0F6]">
              <FaBuilding />
            </div>
            <div className="space-y-4">
              <p className="text-[#12345A] font-bold text-xs uppercase tracking-[0.2em]">Our Dream Project | हमारा स्वप्न प्रोजेक्ट</p>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#12345A]">Building a School for the Future</h2>
            </div>
            <p className="text-xl text-[#26343D] leading-relaxed font-medium">
              SSF National Academy is a long-term educational vision for a modern school serving children in rural communities. This project has not started: no construction or operational launch is being claimed. It can move forward only after a suitable location, feasibility, required permissions, a realistic project plan and adequate funding/resources are secured. <br /><span className="text-lg opacity-90 mt-2 block">SSF National Academy संस्था की दीर्घकालीन शैक्षिक परिकल्पना है। यह परियोजना अभी शुरू नहीं हुई है। पर्याप्त संसाधन, व्यवहार्यता और आवश्यक अनुमतियाँ मिलने के बाद ही इस पर आगे बढ़ा जाएगा।</span>
            </p>

            <div className="space-y-8 pt-4">
              <div className="flex gap-6 group">
                <div className="p-4 bg-[#EAF0F6] text-[#176447] rounded-2xl h-fit transition-transform group-hover:scale-110">
                  <FaCheckCircle className="text-2xl" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#12345A]">Holistic Education</h4>
                  <p className="text-[#26343D] font-medium mt-1">A comprehensive learning framework focusing on academics, technology, and essential life skills.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="p-4 bg-[#EAF0F6] text-[#12345A] rounded-2xl h-fit transition-transform group-hover:scale-110">
                  <FaHeart className="text-2xl" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#12345A]">We Need Your Support</h4>
                  <p className="text-[#26343D] font-medium mt-1">The school concept will require a separate, approved project proposal, land and permission review, itemised budget and dedicated funding plan before any construction appeal or commitment is made.</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/Contact" className="inline-flex items-center gap-2 rounded-full bg-[#12345A] px-8 py-4 text-white font-bold hover:bg-[#176447] transition-colors">Discuss this long-term vision <FaArrowRight className="text-sm" /></Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[#176447]/12 rounded-[3rem] blur-2xl"></div>
            <div className="relative bg-white rounded-[2.5rem] p-4 shadow-2xl border border-[#EAF0F6] overflow-hidden">
              <img
                src="/images/academy/academy-expansion.jpg"
                alt="SSF National Academy Plan"
                className="w-full h-full object-cover rounded-[1.5rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SSF YOUTH CAREER NETWORK ================= */}
      {/* <section className="py-32 px-6 bg-[#EAF0F6] border-y border-zinc-100">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="bg-white rounded-[3rem] p-6 shadow-2xl border border-zinc-50 transform -rotate-2 hover:rotate-0 transition duration-700">
                            <img
                                src="/images/ssf-youth-career.png"
                                alt="SSF Youth Career Network"
                                className="w-full h-full object-contain rounded-[2rem]"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#176447]/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <span className="inline-block px-4 py-1.5 bg-[#12345A] text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-blue-900/20">
                            Free Registration
                        </span>

                        <h2 className="text-4xl lg:text-6xl font-serif font-bold text-[#12345A] leading-tight">
                            SSF Youth <br />
                            <span className="text-[#176447]">Career Network</span>
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
                                    <div className="w-2 h-2 bg-[#176447] rounded-full"></div>
                                    <span className="text-[#26343D] font-bold text-sm tracking-tight">{item}</span>
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
                                <span className="text-[#12345A] font-bold text-lg">
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
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#176447]/8 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 bg-[#176447] text-[#12345A] text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
              Upcoming Initiative
            </span>

            <h2 className="text-4xl lg:text-6xl font-serif font-bold text-[#12345A] leading-tight">
              SSF <span className="text-[#12345A]">Learning Hub</span>
            </h2>

            <p className="text-xl text-[#26343D] leading-relaxed font-medium">
              SSF Learning Hub is an upcoming community-driven education initiative that will offer
              <span className="font-bold text-[#12345A]"> both online and offline classes</span>.
              It will support students, youth, and communities with holistic learning, guidance,
              and real-world support.
              <span className="block mt-2 text-lg text-[#26343D]">यह पहल छात्रों और युवाओं को समग्र शिक्षा और मार्गदर्शन (online & offline) प्रदान करेगी।</span>
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
                  className="flex items-center gap-3 bg-[#EAF0F6] p-4 rounded-2xl border border-[#EAF0F6] hover:border-[#F7A814]/50 transition-all"
                >
                  <div className="w-2.5 h-2.5 bg-[#176447] rounded-full"></div>
                  <span className="text-[#26343D] font-bold text-sm tracking-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* JOIN INFO */}
            <div className="pt-8 space-y-3">
              <p className="text-lg font-bold text-[#12345A]">
                👩‍🎓 Students will be able to join for learning & guidance
              </p>
              <p className="text-lg font-bold text-[#12345A]">
                👨‍🏫 Volunteer teachers & mentors will also be welcome
              </p>
              <p className="text-[#26343D] font-medium italic">
                "Together, we will learn. Together, we will grow."
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
            <div className="absolute -inset-4 bg-[#12345A]/8 rounded-[3rem] blur-2xl"></div>
            <div className="relative bg-white rounded-[2.5rem] p-6 shadow-2xl border border-[#EAF0F6]">
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
      <section className="py-24 px-6 relative overflow-hidden bg-[#EAF0F6] border-t border-[#EAF0F6]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-16 shadow-xl border border-[#EAF0F6] relative overflow-hidden">
            {/* Decorative BG elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#F7A814]/8 to-[#12345A]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">

              {/* LEFT: DOCUMENT VISUAL MOCKUP */}
              <div className="lg:col-span-4 lg:order-1 order-2 flex justify-center lg:justify-start">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#12345A] rounded-2xl rotate-6 opacity-20 blur-lg group-hover:rotate-12 transition-all duration-500"></div>
                  <div className="relative w-64 aspect-[1/1.414] bg-white rounded-xl shadow-2xl border border-[#EAF0F6] overflow-hidden flex flex-col transform group-hover:-translate-y-2 transition-transform duration-500">
                    {/* Header of Doc */}
                    <div className="h-1/3 bg-[#12345A] p-6 flex flex-col justify-between">
                      <div className="w-8 h-8 rounded-full bg-[#176447]/25 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#176447] rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                        <div className="h-2 w-24 bg-white/40 rounded-full"></div>
                      </div>
                    </div>
                    {/* Body of Doc */}
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-2 w-full bg-[#EAF0F6] rounded-full"></div>
                      <div className="h-2 w-5/6 bg-[#EAF0F6] rounded-full"></div>
                      <div className="h-2 w-4/6 bg-[#EAF0F6] rounded-full"></div>
                      <div className="h-2 w-full bg-[#EAF0F6] rounded-full"></div>
                      <div className="h-2 w-3/4 bg-[#EAF0F6] rounded-full"></div>
                    </div>
                    {/* Footer of Doc */}
                    <div className="h-16 border-t border-[#EAF0F6] flex items-center justify-between px-6 bg-[#EAF0F6]/60">
                      <div className="text-[10px] font-bold text-[#12345A]">OFFICIAL</div>
                      <FaFilePdf className="text-[#A73800] text-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: CONTENT */}
              <div className="lg:col-span-8 lg:order-2 order-1 space-y-8 text-center lg:text-left">
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#12345A]/5 text-[#12345A] text-xs font-bold rounded-full uppercase tracking-widest border border-[#12345A]/10 mb-6">
                    <span className="w-2 h-2 bg-[#12345A] rounded-full animate-pulse"></span>
                    Official Proposal Document
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#12345A] leading-tight mb-4">
                    Strategic Vision: <span className="text-[#12345A]">The SSF National Academy</span>
                  </h2>
                  <p className="text-xl text-[#26343D] font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
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
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-[#EAF0F6] rounded-lg border border-[#EAF0F6]">
                      <FaCheckCircle className="text-[#176447] text-sm" />
                      <span className="text-sm font-bold text-[#26343D]">{trait}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
                  <a
                    href={profilePdf}
                    download="Swastik_Srijan_Profile_2026.pdf"
                    className="relative overflow-hidden group px-10 py-5 bg-[#176447] text-[#12345A] font-bold rounded-full hover:bg-[#176447] transition-all shadow-xl shadow-[#F7A814]/25"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <FaDownload />
                      <span>Download Organization Profile</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </a>
                  <div className="text-left text-sm text-[#26343D] font-medium">
                    <p>PDF Format • 21 MB</p>
                    <p>Last Updated: Feb 2026</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ================= WATCH THIS (VIDEOS) ================= */}
      <section className="py-24 px-6 bg-[#EAF0F6] border-t border-[#EAF0F6]">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* HEADER */}
          <div className="text-center space-y-4">
            <span className="inline-block px-4 py-1.5 bg-[#12345A] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
              Watch This
            </span>

            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#12345A]">
              SSF in <span className="text-[#12345A]">Action</span> <span className="text-2xl text-[#26343D]">| जमीनी हकीकत</span>
            </h2>

            <p className="text-lg text-[#26343D] font-medium max-w-2xl mx-auto">
              Real stories, real impact — see how Swastik Srijan Foundation
              is transforming lives on the ground. सच्ची कहानियाँ, वास्तविक प्रभाव।
            </p>
          </div>

          {/* VIDEOS GRID */}
          <div className="grid md:grid-cols-3 gap-8">

            {/* VIDEO 1 */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-[#EAF0F6] bg-black">
              <iframe
                src="https://www.youtube.com/embed/5ccBV5QVy20"
                title="SSF Impact Video 1"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* VIDEO 2 */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-[#EAF0F6] bg-black">
              <iframe
                src="https://www.youtube.com/embed/-lc_6cUS-3g"
                title="SSF Impact Video 2"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* VIDEO 3 */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-[#EAF0F6] bg-black">
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
            <p className="text-[#12345A] font-bold text-xs uppercase tracking-[0.2em]">Our Flagship Roadmap | हमारा मुख्य रोडमैप</p>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#12345A]">Knowledge Hub for Future Leaders</h2>
            <p className="text-xl text-[#26343D] max-w-2xl mx-auto font-medium">Our comprehensive roadmap for the SSF National Academy excellence centers. <span className="block mt-2">भविष्य के लीडर्स के लिए हमारा ज्ञान केंद्र (Knowledge Hub)।</span></p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center bg-[#EAF0F6] p-10 rounded-[3rem] border border-[#EAF0F6] shadow-sm">
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
      <section className="py-20 px-6 bg-gradient-to-br from-[#12345A] to-[#12345A] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">

          <span className="inline-block px-4 py-1.5 bg-[#176447] text-[#12345A] text-[10px] font-bold rounded-full uppercase tracking-widest">
            CSR Partnership
          </span>

          <h2 className="text-3xl lg:text-4xl font-serif font-bold">
            Partner Through <span className="text-[#F7A814]">CSR</span> <span className="text-2xl opacity-90">| CSR के माध्यम से जुड़ें</span>
          </h2>

          <p className="text-lg text-[#EAF0F6] font-medium leading-relaxed">
            Collaborate with <strong>Swastik Srijan Foundation</strong> to create
            scalable, transparent, and measurable impact in
            <strong> education, youth development, and community upliftment</strong>.
            <span className="block mt-2 opacity-90 text-base">शिक्षा, युवा विकास और सामुदायिक उत्थान में वास्तविक प्रभाव पैदा करने के लिए हमारे साथ सहयोग करें।</span>
          </p>

          <div className="pt-4">
            <Link to="/Contact">
              <button className="px-10 py-4 bg-[#176447] text-[#12345A] font-bold rounded-full hover:bg-[#176447] transition-all shadow-lg">
                Explore CSR Partnership | साझेदारी तलाशें
              </button>
            </Link>
          </div>

        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-32 bg-[#12345A] text-white text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(#F7A814 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <h2 className="text-4xl lg:text-6xl font-serif font-bold">
            Invest in Our <span className="text-[#F7A814]">Future</span> <span className="text-3xl lg:text-4xl opacity-90 block mt-2">हमारे भविष्य में निवेश करें</span>
          </h2>
          <p className="text-xl text-[#EAF0F6] font-medium max-w-2xl mx-auto">
            Your partnership today builds the infrastructure for tomorrow's leaders. Join us as a Vision Partner.
          </p>
          <div className="pt-8">
            <Link to="/Contact">
              <button className="btn-cta px-14 py-6 text-xl shadow-[#A73800]/25">
                Become a Vision Partner | विजन पार्टनर बनें
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
