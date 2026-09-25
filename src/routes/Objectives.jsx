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
  FaShareAlt,
} from "react-icons/fa";

export const Route = createFileRoute("/Objectives")({
  component: ObjectivesPage,
});

const detailedObjectives = [
  { id: "education", title: "शिक्षा", subtitle: "Education", icon: <FaGraduationCap />, tagline: "ज्ञान से अवसर, अवसर से विकास", items: ["प्राथमिक, माध्यमिक, उच्च माध्यमिक विद्यालय", "कॉलेज", "कंप्यूटर शिक्षा", "नर्सिंग", "तकनीकी शिक्षा", "प्रतियोगी परीक्षा कोचिंग", "पुस्तकालय", "विज्ञान मेले"], image: "/images/real/classroom-floor-seating.jpg", tone: "from-[#fb8500] to-[#e76f00]" },
  { id: "skills", title: "कौशल विकास", subtitle: "Skill Development", icon: <FaBriefcase />, tagline: "कौशल से आत्मनिर्भरता", items: ["कंप्यूटर प्रशिक्षण", "सिलाई-कढ़ाई", "स्वरोजगार", "व्यावसायिक प्रशिक्षण", "ग्रामीण उद्योग", "खादी एवं ग्रामोद्योग"], image: "/images/real/women_empowerment_tailoring.jpg", tone: "from-[#2d6a4f] to-[#1b4332]" },
  { id: "women-child", title: "महिला एवं बाल विकास", subtitle: "Women & Child Development", icon: <FaFemale />, tagline: "सशक्त महिला, सुरक्षित और शिक्षित बचपन", items: ["महिला सशक्तिकरण", "बालिका शिक्षा", "भ्रूण हत्या रोकथाम", "विधवा सहायता", "नारी निकेतन", "बालवाड़ी", "पोषण कार्यक्रम", "SHG (Self Help Groups)"], image: "/images/real/women_community_meeting.jpg", tone: "from-[#d90429] to-[#a00320]" },
  { id: "health", title: "स्वास्थ्य", subtitle: "Health & Well-being", icon: <FaHeartbeat />, tagline: "स्वस्थ समाज, जागरूक समाज", items: ["AIDS जागरूकता", "कैंसर", "कुपोषण", "प्राकृतिक चिकित्सा", "योग", "परिवार कल्याण", "नशा मुक्ति", "पुनर्वास"], image: "/images/real/nutrition_program.jpg", tone: "from-[#e63946] to-[#9d0208]" },
  { id: "environment", title: "पर्यावरण", subtitle: "Environment", icon: <FaLeaf />, tagline: "प्रकृति की रक्षा, भविष्य की सुरक्षा", items: ["वृक्षारोपण", "जैव विविधता", "वन संरक्षण", "प्राकृतिक संसाधन संरक्षण", "औषधीय पौधे", "जैविक खेती", "प्राकृतिक ऊर्जा"], image: "/images/tree-planting-1.jpg", tone: "from-[#40916c] to-[#1b4332]" },
  { id: "agriculture", title: "कृषि एवं ग्रामीण विकास", subtitle: "Agriculture & Rural Development", icon: <FaTractor />, tagline: "गांव मजबूत, देश मजबूत", items: ["जैविक खेती", "किसानों का प्रशिक्षण", "पशुपालन", "गौ संरक्षण", "ग्रामीण विकास", "आजीविका"], image: "https://images.unsplash.com/photo-1707811180272-53a54a905d14?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600", tone: "from-[#588157] to-[#344e41]" },
  { id: "social-justice", title: "सामाजिक न्याय", subtitle: "Social Justice & Awareness", icon: <FaBalanceScale />, tagline: "जागरूक नागरिक, मजबूत समाज", items: ["भ्रष्टाचार जागरूकता", "नैतिक शिक्षा", "राष्ट्रीय एकता", "सांप्रदायिक सद्भाव", "मानव अधिकार"], image: "https://images.unsplash.com/photo-1628238218162-1b11b9c5500b?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600", tone: "from-[#264653] to-[#1d3557]" },
  { id: "disability-rehabilitation", title: "दिव्यांग एवं पुनर्वास", subtitle: "Disability, Elderly & Rehabilitation", icon: <FaWheelchair />, tagline: "सहयोग, सम्मान और पुनर्वास", items: ["दिव्यांग सहायता", "मानसिक रूप से कमजोर बच्चों का पुनर्वास", "वृद्धजन सहायता", "अनाथ सहायता"], image: "/images/real/disability-rehabilitation.svg", tone: "from-[#6a4c93] to-[#3c096c]" },
  { id: "animal-protection", title: "पशु संरक्षण", subtitle: "Animal Protection", icon: <FaPaw />, tagline: "जीवों के प्रति संवेदना और संरक्षण", items: ["पशु-पक्षी संरक्षण", "गौशाला", "वन्यजीव संरक्षण"], image: "/images/cow-rescue-mission.jpg", tone: "from-[#386641] to-[#1b4332]" },
  { id: "religious-cultural", title: "धार्मिक एवं सांस्कृतिक", subtitle: "Religious & Cultural", icon: <FaMusic />, tagline: "संस्कृति, शिक्षा और सद्भाव", items: ["भजन", "संस्कृत शिक्षा", "संगीत", "सम्मेलन", "सांस्कृतिक कार्यक्रम"], image: "/images/cultural-event-children.jpg", tone: "from-[#9c6644] to-[#6f4518]" },
];

const shareObjective = async (objective) => {
  const url = `${window.location.origin}/Objectives#${objective.id}`;
  const text = `SSF — ${objective.title}\n${objective.tagline}`;

  if (navigator.share) {
    try {
      const imageUrl = new URL(objective.image, window.location.origin).href;
      const response = await fetch(imageUrl, { cache: "no-cache" });
      if (response.ok) {
        const blob = await response.blob();
        const mime = blob.type || "image/jpeg";
        const extension = mime.includes("png") ? "png" : "jpg";
        const file = new File([blob], `SSF-${objective.id}.${extension}`, { type: mime });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: `SSF | ${objective.title}`, text: `${text}\n\n${url}`, files: [file] });
          return;
        }
      }
      await navigator.share({ title: `SSF | ${objective.title}`, text, url });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};

function ObjectivesPage() {
  return (
    <div className="w-full overflow-hidden bg-white">
      <section className="relative min-h-[58vh] md:min-h-[72vh] w-full overflow-hidden bg-[#001529] text-white">
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2">
          <motion.img initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} src="/images/real/classroom-floor-seating.jpg" alt="Community education session" className="h-full w-full object-cover" />
          <motion.img initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.08 }} src="/images/real/women_empowerment_tailoring.jpg" alt="Women skill development" className="h-full w-full object-cover" />
          <motion.img initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.16 }} src="/images/real/children-playing-park.jpg" alt="Children and community development" className="h-full w-full object-cover" />
          <motion.img initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.24 }} src="/images/tree-planting-1.jpg" alt="Environmental sustainability activity" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[#001529]/58"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/25 via-[#001529]/55 to-[#001529]/90"></div>
        <div className="relative z-10 flex min-h-[58vh] md:min-h-[72vh] items-center justify-center px-5 py-24 text-center">
          <div className="max-w-5xl">
            <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-[#7dd3a8]">
              Swastik Srijan Foundation / हमारे उद्देश्य
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white">
              Our Objectives
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg md:text-2xl text-[#f1f5f9] leading-relaxed">
              Education, health, skills, community development and sustainable social change.
            </p>
            <p className="mx-auto mt-2 max-w-3xl text-base md:text-xl text-[#d5e1ea] leading-relaxed">
              शिक्षा, स्वास्थ्य, कौशल, सामुदायिक विकास और सतत सामाजिक परिवर्तन की दिशा में हमारे उद्देश्य।
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#002344] py-8 text-white">
        <div className="container mx-auto px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[["December 2013", "Established"], ["05/22/03/11448/13", "Registration No."], ["MP Societies Act", "Registered Under"], ["Rewa, M.P.", "Registered Office"], ["Across India", "Area of Work"]].map(([value, label], index) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="min-h-[150px] min-w-0 rounded-3xl border border-white/15 bg-white/[0.08] px-4 py-7 text-center backdrop-blur-md shadow-xl flex flex-col items-center justify-center overflow-hidden">
                <div className="w-full min-w-0 break-words text-xl font-black leading-tight tracking-tight text-[#FFB066] sm:text-2xl lg:text-xl xl:text-2xl">{value}</div>
                <div className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-white/65 sm:text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 overflow-hidden rounded-[2.5rem] border border-zinc-100 bg-white shadow-2xl">
              <div className="grid lg:grid-cols-2">
                <div className="h-[330px] overflow-hidden lg:h-auto"><img src="/images/real/children-playing-park.jpg" alt="Foundation objectives" className="h-full w-full object-cover" /></div>
                <div className="flex flex-col justify-center bg-gradient-to-br from-[#002344] to-[#003366] p-9 text-white md:p-14">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#FFB066]">Our Objective</p>
                  <h2 className="mb-6 text-3xl font-serif font-bold text-[#fb8500] md:text-4xl">Promoting Holistic Development</h2>
                  <p className="mb-6 text-xl font-medium leading-relaxed md:text-2xl">To promote holistic development of all sections of society through education, health, empowerment, and ethical values.</p>
                  <p className="text-lg italic leading-relaxed opacity-90">समाज के प्रत्येक वर्ग के सर्वांगीण विकास हेतु शिक्षा, स्वास्थ्य, सशक्तिकरण और नैतिक मूल्यों के माध्यम से आत्मनिर्भर भारत का निर्माण करना।</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#fb8500]">Purpose & Direction</p>
              <h3 className="mt-2 mb-6 text-3xl font-serif font-bold text-[#002344] md:text-4xl">Objectives in Perspective</h3>
              <div className="mx-auto max-w-4xl space-y-5 text-lg font-medium leading-relaxed text-zinc-600">
                <p>The objectives of Swastik Srijan Foundation focus on social equity, human dignity, and sustainable development. We work to create positive social change through education, healthcare, women and child welfare, environmental protection, and livelihood generation.</p>
                <p className="italic">स्वस्तिक सृजन फाउंडेशन के उद्देश्य सामाजिक समानता, मानव गरिमा और सतत विकास पर केंद्रित हैं। हम शिक्षा, स्वास्थ्य, महिला एवं बाल कल्याण, पर्यावरण संरक्षण और रोजगार के माध्यम से सकारात्मक सामाजिक परिवर्तन हेतु कार्य करते हैं।</p>
              </div>
            </motion.div>

            <div className="mb-20">
              <div className="mb-10 text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#fb8500]">10 Objective Areas</p>
                <h3 className="mt-2 text-3xl font-serif font-bold text-[#002344] md:text-4xl">Our Objectives | हमारे उद्देश्य</h3>
                <p className="mx-auto mt-3 max-w-3xl text-zinc-500">हर उद्देश्य को एक स्वतंत्र, photo-based share card के रूप में प्रस्तुत किया गया है। कार्ड को सीधे WhatsApp या अन्य apps पर साझा किया जा सकता है।</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {detailedObjectives.map((objective, index) => (
                  <motion.article key={objective.id} id={objective.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.5, delay: (index % 2) * 0.08 }} className="group scroll-mt-28 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="relative h-56 overflow-hidden">
                      <img src={objective.image} alt={`${objective.title} - Swastik Srijan Foundation`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className={`absolute inset-0 bg-gradient-to-tr ${objective.tone} opacity-35`} />
                      <div className={`absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${objective.tone} text-2xl text-white shadow-xl transition duration-300 group-hover:scale-110 group-hover:rotate-3`}>{objective.icon}</div>
                      <span className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-[#002344] shadow-sm">Objective {String(index + 1).padStart(2, "0")}</span>
                    </div>

                    <div className="p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-2xl font-serif font-bold text-[#002344] md:text-3xl">{objective.title}</h4>
                          <p className="mt-1 text-sm font-semibold text-zinc-400">{objective.subtitle}</p>
                        </div>
                      </div>
                      <p className={`mt-3 bg-gradient-to-r ${objective.tone} bg-clip-text font-bold text-transparent`}>{objective.tagline}</p>

                      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {objective.items.map((item) => <div key={item} className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-600 transition group-hover:bg-white">✓ {item}</div>)}
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3 border-t border-zinc-100 pt-5">
                        <span className="text-xs font-bold text-zinc-400">SSF • Swastik Srijan Foundation</span>
                        <button type="button" onClick={() => shareObjective(objective)} className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${objective.tone} px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95`} aria-label={`Share ${objective.title} objective`}>
                          <FaShareAlt /> Share
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 rounded-[2.5rem] border border-zinc-200 bg-zinc-50 p-8 md:p-12">
              <div className="mx-auto max-w-5xl">
                <div className="mb-8 text-center"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#fb8500]">Registered Scope</p><h3 className="mt-2 text-3xl font-serif font-bold text-[#002344] md:text-4xl">Our Broader Areas of Work</h3><p className="mx-auto mt-4 max-w-3xl text-zinc-600 leading-7">The summary above highlights our principal focus areas. Our registered objectives are broader and provide scope for work in education, skills, health, women and children, rural development, environment, social awareness and other community-focused areas, subject to applicable rules and available resources.</p></div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{["Education & Knowledge", "Skill Development & Livelihood", "Women & Child Development", "Health & Well-being", "Environment & Natural Resources", "Agriculture & Rural Development", "Social Justice & Awareness", "Disability, Elderly & Rehabilitation", "Animal & Wildlife Protection", "Cultural, Creative & Community Development"].map((area) => <div key={area} className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"><FaCheckCircle className="shrink-0 text-[#fb8500]" /><span className="font-bold text-zinc-700">{area}</span></div>)}</div>
                <p className="mt-6 text-center text-xs leading-6 text-zinc-500">This website section is a concise public summary and does not replace the Foundation’s registration documents, memorandum or rules.</p>
              </div>
            </motion.section>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col justify-center gap-6 rounded-[2.5rem] border border-zinc-200 bg-zinc-50 p-10 sm:flex-row md:p-12">
              <Link to="/Mission" className="btn-secondary border-[#002344] text-[#002344] hover:bg-[#002344] hover:text-white">Our Mission</Link>
              <Link to="/Vision" className="btn-secondary border-[#fb8500] text-[#fb8500] hover:bg-[#fb8500] hover:text-white">Our Vision</Link>
              <Link to="/Campaign" className="btn-secondary border-[#d90429] text-[#d90429] hover:bg-[#d90429] hover:text-white">Project Focus Areas</Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#001529] py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
        <div className="container relative z-10 mx-auto px-6"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-4xl space-y-8 text-center">
          <h2 className="text-4xl font-serif font-bold leading-tight text-white lg:text-5xl">Build a Just and Self-Reliant India With Us</h2>
          <p className="text-xl font-medium text-zinc-400">यदि आपके विचार, सिद्धांत या उद्देश्य हमारी संस्था से कहीं भी मेल खाते हैं, तो हमसे जुड़ने में कोई संकोच न करें।</p>
          <div className="flex flex-col justify-center gap-6 pt-6 sm:flex-row"><Link to="/Volunteer" className="btn-cta px-12 py-5 text-lg">Join Our Movement</Link><Link to="/Contact" className="btn-secondary border-white px-12 py-5 text-lg text-white hover:bg-white hover:text-[#001529]">Contact Us</Link></div>
        </motion.div></div>
      </section>
    </div>
  );
}
