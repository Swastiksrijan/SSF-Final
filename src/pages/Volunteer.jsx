import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaProjectDiagram, FaUserTie, FaLaptop, FaArrowRight, FaHandsHelping, FaWhatsapp, FaTimes } from "react-icons/fa";
import CertificateGenerator from "../components/CertificateGenerator";
import VolunteerForm from "../components/VolunteerForm";
import { CONTACT_INFO } from "../config/contact";

export default function Volunteer() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const volunteerTypes = [
    {
      id: "field",
      icon: <FaMapMarkerAlt />,
      title: "Field Volunteer",
      titleHi: "सेवा देने वाले - फील्ड",
      color: "bg-orange-50 text-[#FF6600]",
      border: "border-orange-100",
      work: ["Education programs (शिक्षा कार्यक्रम)", "Health camps (स्वास्थ्य शिविर)", "Rural/Urban outreach", "Activities with children", "Sports, Environment, Awareness"],
      forWhom: "Students, Youth, Social workers"
    },
    {
      id: "program",
      icon: <FaProjectDiagram />,
      title: "Program Volunteer",
      titleHi: "प्रोजेक्ट वालंटियर",
      color: "bg-blue-50 text-[#002344]",
      border: "border-blue-100",
      work: ["Regular support in a project", "Women empowerment initiatives", "Livelihood / Skill training", "Sports & cultural activities"],
      forWhom: "Individuals wanting to work deeply on one subject"
    },
    {
      id: "professional",
      icon: <FaUserTie />,
      title: "Professional Volunteer",
      titleHi: "प्रोफेशनल वालंटियर",
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
      work: ["Teaching / Training", "Doctor / Nurse / Health advisor", "Legal / CA / Compliance support", "IT, Website, Design, Content"],
      forWhom: "Professionals who want to share their expertise"
    },
    {
      id: "digital",
      icon: <FaLaptop />,
      title: "Digital / Online Volunteer",
      titleHi: "डिजिटल वालंटियर",
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100",
      work: ["Social media management", "Content writing", "Poster / video creation", "Online awareness & campaigns"],
      forWhom: "Individuals who want to contribute from home"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="w-full bg-white font-sans text-zinc-900 overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="bg-[#001529] text-white pt-48 pb-24 relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6 max-w-4xl"
          >
            <div className="flex items-center gap-4 text-orange-400 font-bold tracking-widest uppercase text-sm">
              <span className="w-12 h-0.5 bg-orange-400"></span>
              <span>VOLUNTEER WITH US</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
              सेवा: <span className="text-orange-400">Your Time, Their Transformation.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-2xl">
              Volunteer वो होता है जो समय, कौशल और श्रम देता है। Choose the way you want to impact lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= VOLUNTEER CATEGORIES ================= */}
      <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#002344]">Volunteer के प्रकार</h2>
            <p className="text-zinc-500 text-lg font-medium">Empower communities through your unique contribution.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {volunteerTypes.map((type, i) => (
              <motion.div
                key={type.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
                className={`bg-white p-8 rounded-[2.5rem] border-2 ${type.border} shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col`}
              >
                <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center text-3xl mb-8`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-[#002344] mb-1">{type.title}</h3>
                <h4 className="text-sm font-hindi text-zinc-400 font-bold mb-6">{type.titleHi}</h4>

                <div className="space-y-4 flex-grow">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Work: क्या काम</p>
                    <ul className="space-y-2">
                      {type.work.map((w, idx) => (
                        <li key={idx} className="text-sm text-zinc-600 flex gap-2">
                          <span className="text-orange-400">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-zinc-100">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">For Whom: किसके लिए</p>
                    <p className="text-sm font-bold text-[#002344]">{type.forWhom}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APPLICATION SECTION ================= */}
      <section className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-8 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-[#002344] leading-tight">
              Start Your <br /><span className="text-[#FF6600]">Service Journey</span> Today.
            </h2>
            <p className="text-xl text-zinc-600 leading-relaxed">
              Join a community of over 500+ volunteers across Bharat who are dedicated to the wellness of every human being.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-[#FF6600] text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-[#002344] transition-all flex items-center gap-3 cursor-pointer shadow-xl hover:shadow-orange-200"
              >
                👉 Apply as a Volunteer
                <FaArrowRight />
              </button>
              <a
                href={CONTACT_INFO.social.whatsappGroup}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-[#128C7E] transition-all flex items-center gap-3 inline-flex shadow-xl"
              >
                <FaWhatsapp />
                Join Volunteer Hub
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl skew-y-1">
              <img src="/images/real/ngo_event_1.jpg" alt="Volunteer Impact" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001529] via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-2xl font-bold">"सेवा ही परमो धर्म:"</p>
                <p className="text-zinc-300 opacity-80 italic">Service is the highest duty.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VOLUNTEER REGISTRATION MODAL ================= */}
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
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] shadow-2xl p-2 md:p-6"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-8 right-8 z-10 w-12 h-12 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-lg"
              >
                <FaTimes size={24} />
              </button>

              <div className="p-4">
                <VolunteerForm />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= CERTIFICATE GENERATOR ================= */}
      <section className="py-24 bg-zinc-50 px-4 border-t border-zinc-100">
        <CertificateGenerator role="Volunteer" />
      </section>
    </div>
  );
}
