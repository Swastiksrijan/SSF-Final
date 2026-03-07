import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCrown, FaUserShield, FaUserTie, FaAward, FaUsers, FaHandHoldingHeart, FaArrowRight, FaCheckCircle, FaTimes } from "react-icons/fa";
import CertificateGenerator from "../components/CertificateGenerator";
import MemberForm from "../components/MemberForm";

const Members = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const memberTypes = [
    {
      id: "general",
      title: "General Member",
      titleHi: "साधारण सदस्य",
      icon: <FaUserTie />,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
      role: ["Annual meetings participation", "Suggestions and guidance (सुझाव और मार्गदर्शन)", "Support institutional objectives"],
      price: "₹100/month",
      freq: "(₹1,200/year)"
    },
    {
      id: "active",
      title: "Active Member",
      titleHi: "सक्रिय सदस्य",
      icon: <FaUsers />,
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
      role: ["Planning & execution", "Project monitoring", "Volunteer coordination"],
      price: "₹2,500/year",
      freq: "One-time or installments"
    },
    {
      id: "life",
      title: "Life Member",
      titleHi: "आजीवन सदस्य",
      icon: <FaUserShield />,
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100",
      role: ["Long-term association", "Strategic guidance", "Institutional strength"],
      price: "₹8,000+",
      freq: "One-time donation",
      highlight: true
    },
    {
      id: "advisory",
      title: "Advisory / Expert Member",
      titleHi: "सलाहकार सदस्य",
      icon: <FaAward />,
      color: "bg-orange-50 text-orange-600",
      border: "border-orange-100",
      role: ["Policy guidance", "Legal / Financial / CSR advice", "Growth & governance support"],
      price: "By Invitation",
      freq: "Honorary"
    }
  ];

  return (
    <div className="w-full bg-white font-sans text-zinc-900 overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] flex items-center justify-center bg-[#001529] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/real/green-warriors-students.jpg"
            alt="Swastik Srijan Members Group"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001529] via-[#001529]/40 to-black/20"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl space-y-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#FF6600] text-white font-bold tracking-widest uppercase text-sm shadow-xl">
              Become a Member • सदस्य बनें
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold text-white leading-tight drop-shadow-lg">
              The Backbone of <br /><span className="text-[#FF6600]">Our Foundation.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-100 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              "Member वो होता है जो संस्था को दिशा देता है।"<br />
              <span className="text-lg opacity-80 font-normal">Join the governance and leadership. Shape the future.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= MEMBER TYPES ================= */}
      <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#002344]">Member के प्रकार</h2>
            <p className="text-zinc-500 text-lg font-medium">Choose your level of commitment and impact.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {memberTypes.map((type, i) => (
              <motion.div
                key={type.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
                className={`bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 ${type.border} shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative ${type.highlight ? 'ring-2 ring-purple-200' : ''}`}
              >
                {type.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center text-3xl mb-8`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-[#002344] mb-1">{type.title}</h3>
                <h4 className="text-sm font-hindi text-zinc-400 font-bold mb-6">{type.titleHi}</h4>

                <div className="space-y-4 flex-grow">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Role: भूमिका</p>
                    <ul className="space-y-2">
                      {type.role.map((r, idx) => (
                        <li key={idx} className="text-sm text-zinc-600 flex gap-2">
                          <span className="text-orange-400">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-zinc-100">
                    <p className="text-2xl font-black text-[#002344]">{type.price}</p>
                    <p className="text-xs text-zinc-500 font-medium">{type.freq}</p>
                  </div>
                </div>

                <a
                  href="#apply"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsFormOpen(true);
                  }}
                  className={`mt-8 w-full py-3 text-center rounded-xl font-bold transition-all ${type.highlight ? 'bg-[#002344] text-white hover:bg-[#FF6600]' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                >
                  Apply Now
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= QUALIFICATIONS ================= */}
      <section className="py-24 px-6 bg-white" id="apply">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-50 to-white p-6 sm:p-10 md:p-16 rounded-[2rem] md:rounded-[4rem] border border-zinc-200 shadow-xl">
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#002344] flex items-center gap-3">
                  <FaCheckCircle className="text-[#FF6600]" /> Qualification Of Members
                </h3>
                <ul className="space-y-4">
                  {[
                    "Age should not be less than 18 years",
                    "Must be an Indian citizen",
                    "Pledge to follow the rules of the committee",
                    "Sober lifestyle preferred (no alcohol)",
                    "Must apply in writing via application form"
                  ].map((rule, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-600">
                      <div className="mt-1 min-w-[20px]">
                        <FaCheckCircle className="text-green-500 text-lg" />
                      </div>
                      <span className="font-medium">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#002344] flex items-center gap-3">
                  <FaHandHoldingHeart className="text-[#FF6600]" /> Membership Termination
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  Membership of the organization will end in the event of death, resignation, or if a member works against the interest of the society. Non-payment of dues for 6 months without reason also leads to termination.
                </p>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-8">
                  <h4 className="font-bold text-[#002344] mb-4 text-lg">Ready to Apply?</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="w-full flex justify-between items-center bg-white p-4 rounded-xl hover:shadow-md transition text-lg font-bold text-zinc-700 hover:text-[#002344] cursor-pointer"
                    >
                      <span>📝 Member Application Form</span>
                      <FaArrowRight />
                    </button>
                    <a
                      href="https://forms.gle/S6Qc56QE8nLYdDTL9"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex justify-between items-center bg-white p-4 rounded-xl hover:shadow-md transition text-lg font-bold text-[#FF6600] cursor-pointer"
                    >
                      <span>📑 Apply via Google Form</span>
                      <FaArrowRight />
                    </a>
                    <a
                      href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                      target="_blank"
                      rel="noreferrer"
                      className="flex justify-between items-center bg-[#002344] text-white p-4 rounded-xl hover:shadow-md hover:bg-[#FF6600] transition text-sm font-bold"
                    >
                      <span>💳 Pay Membership Fee Online</span>
                      <FaArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MEMBER REGISTRATION MODAL ================= */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-[#001529]/80 backdrop-blur-md transition-all"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl p-2 md:p-4"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <FaTimes size={20} />
              </button>

              <div className="p-2">
                <MemberForm />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= CERTIFICATE GENERATOR ================= */}
      <section className="py-24 bg-zinc-50 px-4 border-t border-zinc-100">
        <CertificateGenerator role="Member" />
      </section>
    </div>
  );
};

export default Members;
