import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCheckCircle,
  FaHandHoldingHeart,
  FaGlobeAmericas,
  FaShieldAlt,
  FaBriefcase,
  FaSeedling,
  FaGraduationCap,
  FaFemale,
  FaHeartbeat,
  FaLeaf,
  FaTractor,
  FaBalanceScale,
  FaWheelchair,
  FaPaw,
  FaMusic,
} from "react-icons/fa";

export const Route = createFileRoute("/Objectives")({
  component: ObjectivesPage,
});

const detailedObjectives = [
  {
    title: "शिक्षा",
    subtitle: "Education",
    icon: <FaGraduationCap />,
    items: ["प्राथमिक, माध्यमिक, उच्च माध्यमिक विद्यालय", "कॉलेज", "कंप्यूटर शिक्षा", "नर्सिंग", "तकनीकी शिक्षा", "प्रतियोगी परीक्षा कोचिंग", "पुस्तकालय", "विज्ञान मेले"],
    tone: "blue",
  },
  {
    title: "कौशल विकास",
    subtitle: "Skill Development",
    icon: <FaBriefcase />,
    items: ["कंप्यूटर प्रशिक्षण", "सिलाई-कढ़ाई", "स्वरोजगार", "व्यावसायिक प्रशिक्षण", "ग्रामीण उद्योग", "खादी एवं ग्रामोद्योग"],
    tone: "indigo",
  },
  {
    title: "महिला एवं बाल विकास",
    subtitle: "Women & Child Development",
    icon: <FaFemale />,
    items: ["महिला सशक्तिकरण", "बालिका शिक्षा", "भ्रूण हत्या रोकथाम", "विधवा सहायता", "नारी निकेतन", "बालवाड़ी", "पोषण कार्यक्रम", "SHG (Self Help Groups)"],
    tone: "rose",
  },
  {
    title: "स्वास्थ्य",
    subtitle: "Health & Well-being",
    icon: <FaHeartbeat />,
    items: ["AIDS जागरूकता", "कैंसर", "कुपोषण", "प्राकृतिक चिकित्सा", "योग", "परिवार कल्याण", "नशा मुक्ति", "पुनर्वास"],
    tone: "red",
  },
  {
    title: "पर्यावरण",
    subtitle: "Environment",
    icon: <FaLeaf />,
    items: ["वृक्षारोपण", "जैव विविधता", "वन संरक्षण", "प्राकृतिक संसाधन संरक्षण", "औषधीय पौधे", "जैविक खेती", "प्राकृतिक ऊर्जा"],
    tone: "green",
  },
  {
    title: "कृषि एवं ग्रामीण विकास",
    subtitle: "Agriculture & Rural Development",
    icon: <FaTractor />,
    items: ["जैविक खेती", "किसानों का प्रशिक्षण", "पशुपालन", "गौ संरक्षण", "ग्रामीण विकास", "आजीविका"],
    tone: "emerald",
  },
  {
    title: "सामाजिक न्याय",
    subtitle: "Social Justice & Awareness",
    icon: <FaBalanceScale />,
    items: ["भ्रष्टाचार जागरूकता", "नैतिक शिक्षा", "राष्ट्रीय एकता", "सांप्रदायिक सद्भाव", "मानव अधिकार"],
    tone: "amber",
  },
  {
    title: "दिव्यांग एवं पुनर्वास",
    subtitle: "Disability, Elderly & Rehabilitation",
    icon: <FaWheelchair />,
    items: ["दिव्यांग सहायता", "मानसिक रूप से कमजोर बच्चों का पुनर्वास", "वृद्धजन सहायता", "अनाथ सहायता"],
    tone: "violet",
  },
  {
    title: "पशु संरक्षण",
    subtitle: "Animal Protection",
    icon: <FaPaw />,
    items: ["पशु-पक्षी संरक्षण", "गौशाला", "वन्यजीव संरक्षण"],
    tone: "teal",
  },
  {
    title: "धार्मिक एवं सांस्कृतिक",
    subtitle: "Religious & Cultural",
    icon: <FaMusic />,
    items: ["भजन", "संस्कृत शिक्षा", "संगीत", "सम्मेलन", "सांस्कृतिक कार्यक्रम"],
    tone: "orange",
  },
];

const toneClasses = {
  blue: "from-blue-50 to-white border-blue-100 text-blue-700",
  indigo: "from-indigo-50 to-white border-indigo-100 text-indigo-700",
  rose: "from-rose-50 to-white border-rose-100 text-rose-700",
  red: "from-red-50 to-white border-red-100 text-red-700",
  green: "from-green-50 to-white border-green-100 text-green-700",
  emerald: "from-emerald-50 to-white border-emerald-100 text-emerald-700",
  amber: "from-amber-50 to-white border-amber-100 text-amber-700",
  violet: "from-violet-50 to-white border-violet-100 text-violet-700",
  teal: "from-teal-50 to-white border-teal-100 text-teal-700",
  orange: "from-orange-50 to-white border-orange-100 text-orange-700",
};

function ObjectivesPage() {
  return (
    <div className="w-full overflow-hidden bg-white">
      {/* HERO */}
      <section className="relative flex min-h-[40vh] w-full justify-center bg-zinc-50 px-4 pb-12 pt-24">
        <div className="container mx-auto flex justify-center">
          <motion.img
            src="/images/uploads/ourobjective.jpeg"
            alt="Our Objectives"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="h-auto max-h-[70vh] w-full rounded-2xl border border-zinc-100 object-contain shadow-xl"
          />
        </div>
      </section>

      {/* OFFICIAL IDENTITY */}
      <section className="bg-[#002344] py-8 text-white">
        <div className="container mx-auto px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-5">
            {[
              ["December 2013", "Established"],
              ["05/22/03/11448/13", "Registration No."],
              ["MP Societies Act", "Registered Under"],
              ["Rewa, M.P.", "Registered Office"],
              ["Across India", "Area of Work"],
            ].map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-sm"
              >
                <div className="text-sm font-black text-[#FFB066] md:text-base">{value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/60 md:text-xs">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-6xl">
            {/* MAIN STATEMENT */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white shadow-2xl"
            >
              <div className="grid lg:grid-cols-2">
                <div className="h-[330px] overflow-hidden lg:h-auto">
                  <img src="/images/real/children-playing-park.jpg" alt="Foundation objectives" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col justify-center bg-gradient-to-br from-[#002344] to-[#003366] p-9 text-white md:p-14">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#FFB066]">Our Objective</p>
                  <h2 className="mb-6 text-3xl font-serif font-bold text-[#fb8500] md:text-4xl">Promoting Holistic Development</h2>
                  <p className="mb-6 text-xl font-medium leading-relaxed md:text-2xl">To promote holistic development of all sections of society through education, health, empowerment, and ethical values.</p>
                  <p className="text-lg italic leading-relaxed opacity-90">समाज के प्रत्येक वर्ग के सर्वांगीण विकास हेतु शिक्षा, स्वास्थ्य, सशक्तिकरण और नैतिक मूल्यों के माध्यम से आत्मनिर्भर भारत का निर्माण करना।</p>
                </div>
              </div>
            </motion.div>

            {/* PERSPECTIVE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#fb8500]">Purpose & Direction</p>
              <h3 className="mt-2 mb-6 text-3xl font-serif font-bold text-[#002344] md:text-4xl">Objectives in Perspective</h3>
              <div className="mx-auto max-w-4xl space-y-5 text-lg font-medium leading-relaxed text-zinc-600">
                <p>The objectives of Swastik Srijan Foundation focus on social equity, human dignity, and sustainable development. We work to create positive social change through education, healthcare, women and child welfare, environmental protection, and livelihood generation.</p>
                <p className="italic">स्वस्तिक सृजन फाउंडेशन के उद्देश्य सामाजिक समानता, मानव गरिमा और सतत विकास पर केंद्रित हैं। हम शिक्षा, स्वास्थ्य, महिला एवं बाल कल्याण, पर्यावरण संरक्षण और रोजगार के माध्यम से सकारात्मक सामाजिक परिवर्तन हेतु कार्य करते हैं।</p>
              </div>
            </motion.div>

            {/* KEY OBJECTIVES */}
            <div className="mb-20">
              <div className="mb-10 text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#fb8500]">Core Focus</p>
                <h3 className="mt-2 text-3xl font-serif font-bold text-[#002344] md:text-4xl">Our Key Objectives</h3>
                <p className="mx-auto mt-3 max-w-2xl text-zinc-500">हमारे प्रमुख उद्देश्य समाज के विभिन्न वर्गों के विकास और कल्याण को दिशा देते हैं।</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  [<FaGlobeAmericas />, "Quality Education", "शिक्षा के प्रसार एवं गुणवत्तापूर्ण शिक्षण को बढ़ावा देना"],
                  [<FaHandHoldingHeart />, "Health & Well-being", "स्वास्थ्य जागरूकता, पोषण एवं कल्याण सेवाओं को सुदृढ़ करना"],
                  [<FaShieldAlt />, "Empowerment", "महिलाओं, बच्चों, वृद्धों एवं दिव्यांगजनों का सशक्तिकरण"],
                  [<FaSeedling />, "Environment", "पर्यावरण संरक्षण एवं सतत विकास को प्रोत्साहित करना"],
                  [<FaBriefcase />, "Skills & Livelihood", "कौशल विकास, स्वरोजगार एवं आजीविका के अवसर सृजित करना"],
                  [<FaCheckCircle />, "Ethical & Social Values", "नैतिक मूल्यों, सामाजिक समरसता एवं राष्ट्रीय चेतना का विकास"],
                ].map(([icon, en, hi], index) => (
                  <motion.div
                    key={en}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="group flex gap-5 rounded-3xl border border-zinc-100 bg-zinc-50 p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl md:p-7"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl text-[#fb8500] shadow-sm transition-transform duration-300 group-hover:scale-110">{icon}</div>
                    <div>
                      <p className="text-xl font-bold text-[#002344]">{en}</p>
                      <p className="mt-1 text-sm font-medium leading-6 text-zinc-600">{hi}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* COMPLETE REGISTERED SCOPE */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 rounded-[2.5rem] border border-zinc-200 bg-zinc-50 p-6 md:p-10"
            >
              <div className="mb-10 text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#fb8500]">Registered Scope</p>
                <h3 className="mt-2 text-3xl font-serif font-bold text-[#002344] md:text-4xl">हमारी संस्था किन क्षेत्रों में कार्य कर सकती है?</h3>
                <p className="mx-auto mt-4 max-w-3xl leading-7 text-zinc-600">संस्था के पंजीकृत उद्देश्य व्यापक हैं। नीचे प्रमुख क्षेत्रों और उनके अंतर्गत दिए गए कार्यों को सरल कार्ड रूप में प्रस्तुत किया गया है।</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {detailedObjectives.map((category, index) => (
                  <motion.article
                    key={category.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ delay: (index % 2) * 0.1, duration: 0.45 }}
                    whileHover={{ y: -6 }}
                    className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:shadow-2xl md:p-7 ${toneClasses[category.tone]}`}
                  >
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/60 transition-transform duration-500 group-hover:scale-150" />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-md transition-all duration-300 group-hover:rotate-3 group-hover:scale-110">{category.icon}</div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-2xl font-black text-[#002344]">{category.title}</h4>
                        <p className="mt-0.5 text-xs font-black uppercase tracking-[0.12em] opacity-60">{category.subtitle}</p>
                      </div>
                      <span className="hidden rounded-full bg-white/80 px-3 py-1 text-xs font-black shadow-sm sm:block">{category.items.length}</span>
                    </div>
                    <div className="relative z-10 mt-5 grid gap-2 sm:grid-cols-2">
                      {category.items.map((item) => (
                        <div key={item} className="flex items-start gap-2 rounded-xl bg-white/75 px-3 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm backdrop-blur-sm">
                          <FaCheckCircle className="mt-0.5 shrink-0 text-xs opacity-70" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>

              <p className="mt-8 text-center text-xs leading-6 text-zinc-500">यह वेबसाइट अनुभाग संस्था के उद्देश्यों का सार्वजनिक एवं संक्षिप्त प्रस्तुतीकरण है। विस्तृत कार्य संस्था के पंजीकरण दस्तावेज, नियमावली, लागू कानूनों तथा उपलब्ध संसाधनों के अनुसार किया जाएगा।</p>
            </motion.section>

            {/* NAVIGATION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center gap-4 rounded-[2.5rem] border border-zinc-200 bg-zinc-50 p-8 sm:flex-row"
            >
              <Link to="/Mission" className="btn-secondary border-[#002344] text-[#002344] hover:bg-[#002344] hover:text-white">Our Mission</Link>
              <Link to="/Vision" className="btn-secondary border-[#fb8500] text-[#fb8500] hover:bg-[#fb8500] hover:text-white">Our Vision</Link>
              <Link to="/Campaign" className="btn-secondary border-[#d90429] text-[#d90429] hover:bg-[#d90429] hover:text-white">Project Focus Areas</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#001529] py-20 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
        <div className="container relative z-10 mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-4xl space-y-7 text-center">
            <h2 className="text-4xl font-serif font-bold leading-tight text-white lg:text-5xl">Build a Just and Self-Reliant India With Us</h2>
            <p className="text-xl font-medium text-zinc-400">यदि आपके विचार, सिद्धांत या उद्देश्य हमारी संस्था से कहीं भी मेल खाते हैं, तो हमसे जुड़ने में कोई संकोच न करें।</p>
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Link to="/Volunteer" className="btn-cta px-10 py-4 text-lg">Join Our Movement <FaArrowRight className="ml-2 inline" /></Link>
              <Link to="/Contact" className="btn-secondary border-white px-10 py-4 text-lg text-white hover:bg-white hover:text-[#001529]">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
