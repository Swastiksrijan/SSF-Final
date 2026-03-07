import { motion } from "framer-motion";
import {
  FaHandHoldingHeart,
  FaGlobeAmericas,
  FaUsers,
  FaSchool,
  FaClinicMedical,
  FaHandsHelping,
  FaBullseye,
  FaRoute,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "@tanstack/react-router";

export default function MissionPage() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-zinc-50 pt-24 pb-12 flex justify-center min-h-[40vh]">
        <div className="container mx-auto px-4 flex justify-center">
          <img
            src="/images/uploads/mission_vision.jpeg"
            alt="Mission & Vision"
            className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-xl border border-zinc-100"
          />
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-[#002344] mb-4">
                  Who We Are
                </h2>
                <div className="w-20 h-1.5 bg-[#fb8500] rounded-full"></div>
              </div>

              <div className="space-y-6">
                <p className="text-xl text-zinc-700 leading-relaxed font-serif italic">
                  "Swastik Srijan Foundation is a grassroots non-profit organization established in 2013."
                </p>

                <p className="text-lg text-zinc-600 leading-relaxed">
                  We are a collective of volunteers, professionals, and changemakers committed to building a self-reliant and dignified society through education and ethical leadership.
                </p>

                <p className="text-lg font-hindi text-zinc-500 border-l-4 border-zinc-100 pl-4 md:pl-6">
                  स्वस्तिक सृजन फाउंडेशन 2013 में स्थापित एक जमीनी स्तर का गैर-लाभकारी संगठन है।
                </p>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -inset-2 md:-inset-4 bg-[#fb8500]/10 rounded-[2rem] md:rounded-[3rem] -rotate-3"></div>
              <img
                src="/images/real/girls-study-group-mat.jpg"
                alt="Community Engagement"
                className="relative z-10 w-full aspect-[4/3] md:h-[450px] object-cover rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="py-16 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fb8500_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-[#fb8500]">
              A Commitment to Inclusive Growth
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed font-medium mb-8">
              Our vision reflects our commitment to inclusive growth, ethical action, and human dignity. We aspire to create a society where development reaches the last person and contributes to a stronger nation and a better world.
            </p>
            <div className="w-24 h-1 bg-[#fb8500] mx-auto mb-8 opacity-50"></div>
            <p className="text-lg md:text-xl leading-relaxed opacity-80 italic">
              हमारी दृष्टि समावेशी विकास, नैतिक कार्य और मानव गरिमा के प्रति हमारी प्रतिबद्धता को दर्शाती है, जहाँ विकास अंतिम व्यक्ति तक पहुँचे और राष्ट्र व विश्व के कल्याण में योगदान दे।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= MORE INFORMATION LINKS ================= */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">

            {/* MISSION LINK */}
            <a
              href="https://sites.google.com/view/swastiksrijanprofile/about-the-organization/mission"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-full border border-[#fb8500] text-[#002344] text-sm md:text-base font-bold hover:bg-[#fb8500] hover:text-white transition-all shadow-sm"
            >
              For more information on <span className="text-[#fb8500] hover:text-white">Mission</span>, click here
            </a>

            {/* VISION LINK */}
            <a
              href="https://sites.google.com/view/swastiksrijanprofile/about-the-organization/vision"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-full border border-[#002344] text-[#002344] text-sm md:text-base font-bold hover:bg-[#002344] hover:text-white transition-all shadow-sm"
            >
              For more information on <span className="text-[#002344] hover:text-white">Vision</span>, click here
            </a>

          </div>
        </div>
      </section>


      {/* ================= VISION & MISSION ================= */}
      <section className="py-20 md:py-32 bg-zinc-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#002344] mb-6">
              Our Compass for Change
            </h2>
            <p className="text-lg text-zinc-600">
              Our Vision and Mission are not just words on a page; they are the heartbeat of everything we do, guiding our path toward a more equitable world.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group p-8 md:p-12 rounded-[2.5rem] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:shadow-orange-200/30 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-transparent rounded-bl-[5rem] group-hover:scale-110 transition-transform duration-500"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-100 transition-colors">
                  <FaGlobeAmericas className="text-3xl text-[#fb8500]" />
                </div>

                <span className="text-[#fb8500] font-bold uppercase tracking-widest text-xs mb-4 block">
                  The Destination | हमारा दृष्टिकोण
                </span>

                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#002344] mb-6">
                  Our Vision
                </h3>

                <div className="space-y-6">
                  <p className="text-xl md:text-2xl text-[#002344] font-medium leading-relaxed">
                    "A compassionate, inclusive, and responsible society where every individual lives with dignity."
                  </p>
                  <p className="text-lg text-zinc-500 italic border-l-2 border-orange-200 pl-6">
                    एक ऐसा समावेशी, नैतिक और सशक्त समाज जहाँ प्रत्येक व्यक्ति को सम्मान, अवसर और सुरक्षित भविष्य प्राप्त हो।
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group p-8 md:p-12 rounded-[2.5rem] bg-[#002344] text-white shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/40 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-[5rem] group-hover:scale-110 transition-transform duration-500"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
                  <FaHandHoldingHeart className="text-3xl text-[#fb8500]" />
                </div>

                <span className="text-orange-300 font-bold uppercase tracking-widest text-xs mb-4 block">
                  The Journey | हमारा लक्ष्य
                </span>

                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  Our Mission
                </h3>

                <div className="space-y-6">
                  <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                    "To empower communities through education, health, skill development, and ethical leadership."
                  </p>
                  <p className="text-lg text-blue-200/70 italic border-l-2 border-blue-400/30 pl-6">
                    शिक्षा, स्वास्थ्य, कौशल विकास और नैतिक नेतृत्व के माध्यम से समुदायों को सशक्त बनाना।
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= DIAGRAM ================= */}
      <section className="py-12 bg-white flex justify-center border-b border-zinc-100">
        <div className="container mx-auto px-6 flex justify-center">
          <img
            src="/images/uploads/vision-mission-goals.jpg"
            alt="Vision, Mission, and Values Diagram"
            className="w-full max-w-3xl object-contain drop-shadow-lg rounded-xl"
          />
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="py-16 md:py-24 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344] mb-4">
            Our Core Values
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto mt-12 md:mt-16">
            {[
              "Integrity",
              "Compassion",
              "Inclusion",
              "Excellence",
              "Sustainability",
              "Volunteerism",
            ].map((val, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-zinc-50 border hover:border-[#fb8500] hover:shadow-lg transition-all flex items-center justify-center"
              >
                <h3 className="text-lg md:text-2xl font-bold text-[#002344]">{val}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= YOUTUBE / MEDIA ================= */}
      <section className="py-16 md:py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Our Work in Action
            </h2>
            <p className="text-[#fb8500] font-bold uppercase tracking-widest text-xs md:text-sm">
              Stories • Impact • Ground Reality
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto">
            <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/h5su0SaRqCs"
                  title="SSF Video 1"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/z5Mxpg_-214"
                  title="SSF Video 2"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION HIGHLIGHTS DASHBOARD ================= */}
      <section className="py-16 md:py-24 bg-white border-y border-zinc-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">Mission Highlights (Since 2013)</h2>
            <p className="text-zinc-500 mt-3">Key impact numbers reflecting our mission outcomes across communities.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: "20,000+", label: "Lives Reached", icon: <FaUsers /> },
              { value: "40+", label: "Programs", icon: <FaSchool /> },
              { value: "100+", label: "Villages Impacted", icon: <FaGlobeAmericas /> },
              { value: "500+", label: "Active Volunteers", icon: <FaHandsHelping /> },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-zinc-100 mx-auto mb-4 flex items-center justify-center text-[#fb8500] text-2xl">
                  {item.icon}
                </div>
                <p className="text-2xl md:text-3xl font-black text-[#002344]">{item.value}</p>
                <p className="text-sm text-zinc-500 mt-1">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MISSION GOALS (MEASURABLE) ================= */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">Mission Goals 2025-2030</h2>
            <p className="text-zinc-500 mt-3">Specific, measurable goals that guide our mission execution.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Reach 50,000+ children and families through education and support programs.",
              "Expand healthcare and awareness activities to 150+ villages.",
              "Enable 10,000+ youth and women with livelihood and skill-development pathways.",
              "Strengthen volunteer and community leadership network across major districts.",
            ].map((goal, idx) => (
              <div key={idx} className="bg-white border border-zinc-100 rounded-2xl p-6 flex items-start gap-3 hover:shadow-md transition-all">
                <FaBullseye className="text-[#fb8500] mt-1" />
                <p className="text-zinc-700 leading-relaxed">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MISSION FLOW ================= */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">How Our Mission Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { title: "Identify Needs", icon: <FaRoute /> },
              { title: "Design Programs", icon: <FaSchool /> },
              { title: "Community Delivery", icon: <FaClinicMedical /> },
              { title: "Measure Impact", icon: <FaCheckCircle /> },
            ].map((step, idx) => (
              <div key={idx} className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all">
                <div className="text-2xl text-[#fb8500] mb-3 flex justify-center">{step.icon}</div>
                <h3 className="font-bold text-[#002344]">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MISSION STORIES + TESTIMONIALS ================= */}
      <section className="py-16 md:py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6 max-w-6xl space-y-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">Mission Stories from the Ground</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#002344] mb-3">Education Support Example</h3>
              <p className="text-zinc-600">In underserved communities, SSF learning initiatives helped children continue education with school materials, mentoring, and regular classes.</p>
            </div>
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#002344] mb-3">Health & Community Outreach Example</h3>
              <p className="text-zinc-600">Through awareness camps and direct support drives, families gained access to health information, essentials, and timely referrals.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#002344] text-white rounded-2xl p-6">
              <p className="text-zinc-100 italic">“As a volunteer, I witnessed real change in children’s confidence and attendance after SSF education sessions.”</p>
              <p className="mt-3 text-sm text-orange-300 font-semibold">— Volunteer, Madhya Pradesh</p>
            </div>
            <div className="bg-white border border-zinc-100 rounded-2xl p-6">
              <p className="text-zinc-700 italic">“SSF’s support gave our local community both hope and practical help during difficult times.”</p>
              <p className="mt-3 text-sm text-[#fb8500] font-semibold">— Community Beneficiary</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["/images/classroom-mat-session.jpg", "/images/health-program-masks.jpg", "/images/slum-area-outreach.jpg"].map((src, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
                <img src={src} alt="Mission in action" className="w-full h-52 object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 md:py-24 bg-[#001529] text-center px-6">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
          Join Our Mission
        </h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
          <Link
            to="/Volunteer"
            className="w-full sm:w-auto px-8 py-4 bg-[#fb8500] text-white rounded-xl font-bold hover:bg-[#e67a00] transition-colors"
          >
            Volunteer With Us
          </Link>

          <Link
            to="/Donate"
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#002344] rounded-xl font-bold hover:bg-zinc-100 transition-colors"
          >
            Support Our Work
          </Link>

          <Link
            to="/PartnerWithUs"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/30"
          >
            Partner With Us
          </Link>
        </div>
      </section>
    </div>
  );
}
