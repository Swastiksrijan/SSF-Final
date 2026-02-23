import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaBullseye, FaArrowRight, FaCheckCircle, FaHandHoldingHeart, FaGlobeAmericas, FaShieldAlt, FaBriefcase, FaSeedling } from "react-icons/fa";

export const Route = createFileRoute("/Objectives")({
  component: ObjectivesPage,
});

function ObjectivesPage() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-zinc-50 pt-24 pb-12 flex justify-center min-h-[40vh]">
        <div className="container mx-auto px-4 flex justify-center">
          <img
            src="/images/uploads/ourobjective.jpeg"
            alt="Our Objectives"
            className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-xl border border-zinc-100"
          />
        </div>
      </section>

      {/* ================= OBJECTIVES STATEMENT ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Main Objectives Statement Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-zinc-100 mb-16"
            >
              <div className="grid lg:grid-cols-2">
                <div className="h-[400px] lg:h-auto overflow-hidden">
                  <img src="/images/real/children-playing-park.jpg" alt="Team Objectives" className="w-full h-full object-cover" />
                </div>
                <div className="p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-[#002344] to-[#003366] text-white">
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-8 text-[#fb8500]">
                    Promoting Holistic Development
                  </h2>
                  <p className="text-xl lg:text-2xl leading-relaxed font-medium mb-8">
                    To promote holistic development of all sections of society through education, health, empowerment, and ethical values.
                  </p>
                  <p className="text-lg lg:text-xl leading-relaxed opacity-90 italic font-hindi">
                    समाज के प्रत्येक वर्ग के सर्वांगीण विकास हेतु शिक्षा, स्वास्थ्य, सशक्तिकरण और नैतिक मूल्यों के माध्यम से आत्मनिर्भर भारत का निर्माण करना।
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Objectives In Perspective */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h3 className="text-3xl font-serif font-bold text-[#002344] mb-6">
                Objectives in Perspective
              </h3>
              <div className="space-y-6 max-w-4xl mx-auto text-lg text-zinc-600 font-medium leading-relaxed">
                <p>
                  The objectives of Swastik Srijan Foundation focus on social equity, human dignity, and sustainable development. We work to create positive social change through education, healthcare, women and child welfare, environmental protection, and livelihood generation.
                </p>
                <p className="italic">
                  स्वस्तिक सृजन फाउंडेशन के उद्देश्य सामाजिक समानता, मानव गरिमा और सतत विकास पर केंद्रित हैं। हम शिक्षा, स्वास्थ्य, महिला एवं बाल कल्याण, पर्यावरण संरक्षण और रोजगार के माध्यम से सकारात्मक सामाजिक परिवर्तन हेतु कार्य करते हैं।
                </p>
              </div>
            </motion.div>

            {/* Key Objectives Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  en: "Promoting access to quality education",
                  hi: "शिक्षा के प्रसार एवं गुणवत्तापूर्ण शिक्षण को बढ़ावा देना",
                  icon: <FaGlobeAmericas />,
                  color: "bg-blue-50 text-[#003366] border-blue-100"
                },
                {
                  en: "Strengthening healthcare awareness and well-being",
                  hi: "स्वास्थ्य जागरूकता, पोषण एवं कल्याण सेवाओं को सुदृढ़ करना",
                  icon: <FaHandHoldingHeart />,
                  color: "bg-red-50 text-[#d90429] border-red-100"
                },
                {
                  en: "Empowering women, children, elderly, and persons with disabilities",
                  hi: "महिलाओं, बच्चों, वृद्धों एवं दिव्यांगजनों का सशक्तिकरण",
                  icon: <FaShieldAlt />,
                  color: "bg-amber-50 text-[#fb8500] border-amber-100"
                },
                {
                  en: "Encouraging environmental protection and sustainability",
                  hi: "पर्यावरण संरक्षण एवं सतत विकास को प्रोत्साहित करना",
                  icon: <FaSeedling />,
                  color: "bg-emerald-50 text-[#2d6a4f] border-emerald-100"
                },
                {
                  en: "Creating skill development and livelihood opportunities",
                  hi: "कौशल विकास, स्वरोजगार एवं आजीविका के अवसर सृजित करना",
                  icon: <FaBriefcase />,
                  color: "bg-indigo-50 text-[#4361ee] border-indigo-100"
                },
                {
                  en: "Promoting ethical values, social harmony, and national awareness",
                  hi: "नैतिक मूल्यों, सामाजिक समरसता एवं राष्ट्रीय चेतना का विकास",
                  icon: <FaCheckCircle />,
                  color: "bg-zinc-50 text-zinc-700 border-zinc-200"
                }
              ].map((objective, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group p-8 rounded-3xl border ${objective.color} hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl mt-1 shrink-0">
                      {objective.icon}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold leading-tight">
                        {objective.en}
                      </p>
                      <p className="text-sm opacity-80 font-medium">
                        {objective.hi}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-50 rounded-[2.5rem] p-12 border border-zinc-200 flex flex-col sm:flex-row justify-center gap-6"
            >
              <Link to="/Mission" className="btn-secondary border-[#002344] text-[#002344] hover:bg-[#002344] hover:text-white">
                Our Mission
              </Link>
              <Link to="/Vision" className="btn-secondary border-[#fb8500] text-[#fb8500] hover:bg-[#fb8500] hover:text-white">
                Our Vision
              </Link>
              <Link to="/Campaign" className="btn-secondary border-[#d90429] text-[#d90429] hover:bg-[#d90429] hover:text-white">
                Project Focus Areas
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 bg-[#001529] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
              Build a Just and Self-Reliant India With Us
            </h2>
            <p className="text-xl text-zinc-400 font-medium">
              यदि आपके विचार, सिद्धांत या उद्देश्य हमारी संस्था से कहीं भी मेल खाते हैं, तो हमसे जुड़ने में कोई संकोच न करें।
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
              <Link to="/Volunteer" className="btn-cta px-12 py-5 text-lg">
                Join Our Movement
              </Link>
              <Link to="/Contact" className="btn-secondary border-white text-white hover:bg-white hover:text-[#001529] px-12 py-5 text-lg">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
