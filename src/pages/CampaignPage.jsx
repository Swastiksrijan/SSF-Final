import { Link } from "@tanstack/react-router";
import { FaBook, FaStethoscope, FaTools, FaBalanceScale, FaUsers, FaArrowRight, FaSeedling } from "react-icons/fa";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";

export default function Campaign() {
  const programs = [
    {
      id: "education",
      title: "Education Excellence | शिक्षा",
      icon: <FaBook />,
      image: "/images/rural-education.jpg",
      description: "Bringing quality education to the doorsteps of rural communities. Our focus is on holistic development through interactive learning and literacy drives.",
      stats: "20,000+ Students Impacted",
      borderColor: "border-[#fb8500]",
      accent: "text-[#fb8500]",
      bg: "bg-orange-50/50"
    },
    {
      id: "health",
      title: "Health & Awareness | स्वास्थ्य",
      icon: <FaStethoscope />,
      image: "/images/health-program-masks.jpg",
      description: "From COVID-19 awareness to regular health camps, we ensure that rural families have the knowledge and support to live healthy lives.",
      stats: "10,000+ Awareness Drives",
      borderColor: "border-[#d90429]",
      accent: "text-[#d90429]",
      bg: "bg-red-50/50"
    },
    {
      id: "community",
      title: "Social Welfare | समाज सेवा",
      icon: <FaUsers />,
      image: "/images/real/cloth-distribution.jpg",
      description: "Serving the underprivileged through direct relief programs, including cloth distribution, food security, and community support initiatives.",
      stats: "150+ Distribution Drives",
      borderColor: "border-[#2d6a4f]",
      accent: "text-[#2d6a4f]",
      bg: "bg-emerald-50/50"
    },
    {
      id: "environment",
      title: "Green Future | पर्यावरण",
      icon: <FaSeedling />,
      image: "/images/tree-planting-1.jpg",
      description: "Our plantation drives and environmental awareness programs aim to build a sustainable and greener future for coming generations.",
      stats: "5,000+ Trees Planted",
      borderColor: "border-[#2d6a4f]",
      accent: "text-[#2d6a4f]",
      bg: "bg-emerald-50/50"
    },
    {
      id: "skills",
      title: "Rural Empowerment | ग्रामीण सशक्तिकरण",
      icon: <FaTools />,
      image: "/images/real/children-gathering.jpg",
      description: "Investing in the future of the nation by empowering youth and children with the tools they need for a dignified life.",
      stats: "5,000+ Youth Empowered",
      borderColor: "border-[#002344]",
      accent: "text-[#002344]",
      bg: "bg-blue-50/50"
    },
    {
      id: "direct-aid",
      title: "Direct Assistance | प्रत्यक्ष सहायता",
      icon: <FaBalanceScale />,
      image: "/images/real/direct-aid-mask.jpg",
      description: "Providing immediate support to those in need. Our volunteers work around the clock to ensure help reaches the last mile.",
      stats: "Every Individual Matters",
      borderColor: "border-purple-500",
      accent: "text-purple-600",
      bg: "bg-purple-50/50"
    },
  ];

  return (
    <section className="bg-white font-inria min-h-screen">
      {/* ================= HERO ================= */}
      <PageHero
        image="/images/uploads/our-campaigns-collage.jpg"
        title="Driving Holistic Change"
        subtitle="We focus on five key pillars of development to transform lives and empower communities."
        hindiSubtitle="समग्र विकास के माध्यम से जीवन परिवर्तन और सामुदायिक सशक्तिकरण।"
      />

      {/* ================= PROGRAMS GRID ================= */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {programs.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              id={program.id}
              className={`bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] border border-zinc-50 flex flex-col group hover:-translate-y-2 transition-all duration-500`}
            >
              <div className="w-full h-64 overflow-hidden relative">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002344]/60 to-transparent"></div>
                <div className={`absolute bottom-6 left-6 p-4 ${program.bg} backdrop-blur-md rounded-2xl shadow-xl border border-white/20`}>
                  <div className={`text-2xl ${program.accent}`}>{program.icon}</div>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-grow space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-bold text-[#002344] group-hover:text-[#fb8500] transition-colors leading-tight">
                    {program.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed font-medium text-sm">
                    {program.description}
                  </p>
                </div>

                <div className="pt-8 mt-auto border-t border-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${program.accent.replace('text-', 'bg-')}`}></div>
                    <span className="font-bold text-[#002344] text-xs uppercase tracking-wider">{program.stats}</span>
                  </div>
                  <Link
                    to="/Contact"
                    className={`inline-flex items-center gap-2 ${program.accent} font-bold text-sm hover:gap-3 transition-all`}
                  >
                    Partner Us <FaArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="py-32 bg-[#001529] relative overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(#fb8500_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-12">
          <h2 className="text-4xl lg:text-6xl font-serif font-bold text-white leading-tight">
            Want to <span className="text-[#fb8500]">support</span> these programs?
          </h2>
          <p className="text-zinc-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Your contribution provides the fuel for these initiatives to reach more villages and change more destinies. Join our mission today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
            <Link to="/DonateAndSupport" className="sm:w-auto">
              <button className="btn-cta w-full px-14 py-6 text-xl shadow-[#d90429]/20">
                Donate Now
              </button>
            </Link>
            <Link to="/Volunteer" className="sm:w-auto">
              <button className="btn-secondary w-full px-14 py-6 text-xl border-white text-white hover:bg-white hover:text-[#001529]">
                Volunteer with Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
