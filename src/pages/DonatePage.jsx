import { FaHandHoldingHeart, FaChartPie, FaUniversity, FaCheckCircle, FaRupeeSign, FaQrcode, FaShieldAlt, FaQuestionCircle, FaChevronDown, FaChevronUp, FaGraduationCap, FaHeartbeat, FaBriefcase, FaRunning, FaTree, FaClipboardCheck, FaFileAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import qrCode from "../assets/barcode.jpg";
import CertificateGenerator from "../components/CertificateGenerator";

export default function DonatePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is my donation tax-exempt?",
      answer: "Yes, all donations to Swastik Srijan Foundation are 50% tax-exempt under Section 80G of the Income Tax Act, 1961. You will receive a tax exemption certificate via email within 48 hours of your donation."
    },
    {
      question: "Is it safe to donate online?",
      answer: "Absolutely. We use Razorpay, a PCI-DSS compliant payment gateway that uses 128-bit encryption to ensure your transaction is completely secure."
    },
    {
      question: "Can I donate from outside India?",
      answer: "Currently, we can only accept donations from Indian bank accounts and cards due to FCRA regulations. We are working on enabling international donations soon."
    },
    {
      question: "How will my donation be used?",
      answer: "We are committed to financial transparency. 85% of your donation directly funds our programs (Education, Health, Livelihood), 10% goes towards administrative costs, and 5% covers fundraising efforts."
    }
  ];

  const causes = [
    {
      id: 1,
      title: "Education for Every Child",
      titleHi: "हर बच्चे के लिए शिक्षा",
      icon: <FaGraduationCap className="text-4xl text-blue-600 mb-4" />,
      points: ["School education", "Learning material", "Digital & creative education"],
      btnText: "Donate for Education",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: 2,
      title: "Health & Nutrition",
      titleHi: "स्वास्थ्य और पोषण",
      icon: <FaHeartbeat className="text-4xl text-red-600 mb-4" />,
      points: ["Health camps", "Nutrition for children & women", "Medical assistance"],
      btnText: "Donate for Health",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      id: 3,
      title: "Livelihood & Skill Development",
      titleHi: "आजीविका और कौशल विकास",
      icon: <FaBriefcase className="text-4xl text-green-600 mb-4" />,
      points: ["Vocational training", "Women empowerment", "Self-employment support"],
      btnText: "Donate for Livelihood",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: 4,
      title: "Sports, Culture & Youth Development",
      titleHi: "खेल, संस्कृति और युवा विकास",
      icon: <FaRunning className="text-4xl text-orange-600 mb-4" />,
      points: ["Sports activities", "Cultural programs", "Youth leadership"],
      btnText: "Support Youth & Sports",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      id: 5,
      title: "Environment & Community Welfare",
      titleHi: "पर्यावरण और सामुदायिक कल्याण",
      icon: <FaTree className="text-4xl text-emerald-600 mb-4" />,
      points: ["Tree plantation", "Cleanliness & awareness", "Animal & bird welfare"],
      btnText: "Support Environment",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    }
  ];

  const whyDonate = [
    { text: "Serving communities since 2013", textHi: "2013 से समुदाय की सेवा में" },
    { text: "Grassroots, volunteer-driven organization", textHi: "जमीनी स्तर पर स्वयंसेवकों द्वारा संचालित संगठन" },
    { text: "Transparent & compliant NGO", textHi: "पारदर्शी और अनुपालन करने वाली संस्था" },
    { text: "Funds used directly on the ground", textHi: "निधि का सीधे धरातल पर उपयोग" }
  ];

  return (
    <div className="w-full font-sans bg-zinc-50">

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-zinc-50 pt-24 pb-12 flex justify-center min-h-[50vh]">
        <div className="container mx-auto px-4 flex justify-center">
          <img
            src="/images/real/green-warriors-students.jpg"
            alt="Donate - Children holding signs"
            className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-xl border border-zinc-100"
          />
        </div>
      </section>

      {/* ================= WHY DONATE (Trust + Emotion) ================= */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#002344] mb-4">Why Your Donation Matters</h2>
                <h3 className="text-2xl font-hindi text-zinc-600">आपका दान क्यों मायने रखता है</h3>
              </div>

              <div className="grid gap-4">
                {whyDonate.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100 group hover:border-[#FF6600] transition-colors"
                  >
                    <div className="mt-1 bg-[#FF6600] rounded-full p-1">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-800">{item.text}</p>
                      <p className="text-sm font-hindi text-zinc-500">{item.textHi}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <p className="text-xl font-hindi text-[#002344] font-medium italic">
                  आपका दान सिर्फ पैसा नहीं, आशा बनता है।
                </p>
              </div>
            </div>

            <div className="bg-[#002344] p-1 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/real/community-education-meeting.jpg"
                alt="Impact"
                className="w-full h-[400px] object-cover rounded-[1.4rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CHOOSE A CAUSE TO DONATE ================= */}
      <section className="py-24 px-4 bg-zinc-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#002344] mb-2 uppercase tracking-tight">CHOOSE A CAUSE TO DONATE</h2>
            <div className="w-24 h-1 bg-[#FF6600] mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {causes.map((cause, idx) => (
              <motion.div
                key={cause.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col p-8 rounded-3xl border ${cause.borderColor} ${cause.bgColor} shadow-sm hover:shadow-xl transition-all group`}
              >
                <div className="flex-1">
                  {cause.icon}
                  <h3 className="text-2xl font-bold text-zinc-900 mb-1">{cause.title}</h3>
                  <p className="text-lg font-hindi text-zinc-600 mb-6">{cause.titleHi}</p>

                  <ul className="space-y-3 mb-8">
                    {cause.points.map((p, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-[#FF6600]"></div>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                  target="_blank"
                  className="block w-full py-4 text-center rounded-2xl bg-white text-zinc-900 font-bold border-2 border-zinc-200 hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  👉 {cause.btnText}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW TO DONATE ================= */}
      <section id="donate-methods" className="py-24 px-4 bg-white border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">HOW TO DONATE | दान कैसे करें</h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Online Donation */}
            <div className="bg-gradient-to-br from-[#002344] to-black text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <FaHandHoldingHeart size={200} />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="bg-white/10 w-fit px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Option 1️⃣</div>
                <h3 className="text-3xl font-bold mb-4">Online Donation</h3>
                <p className="text-zinc-400 text-sm font-medium mb-8 italic">Fast & Secure | त्वरित और सुरक्षित</p>

                <ul className="space-y-4 mb-10 text-lg">
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-[#FF6600]" /> UPI (GPay, PhonePe, etc.)
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-[#FF6600]" /> Debit / Credit Card
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-[#FF6600]" /> Net Banking
                  </li>
                </ul>

                <div className="mt-auto space-y-6">
                  <a
                    href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-[#FF6600] text-white font-bold text-xl py-5 rounded-2xl text-center hover:bg-[#e65c00] transition-colors shadow-lg"
                  >
                    👉 Donate Now
                  </a>
                  <p className="text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                    <FaShieldAlt className="text-green-500" /> Razorpay / Secure Gateway
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="bg-zinc-50 border border-zinc-200 p-8 md:p-12 rounded-3xl flex flex-col h-full relative group">
              <div className="bg-zinc-200 w-fit px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Option 2️⃣</div>
              <h3 className="text-3xl font-bold text-zinc-900 mb-2">Donate via Bank Transfer</h3>
              <p className="text-zinc-500 text-sm font-medium mb-8">Direct Account Transfer</p>

              <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-5 mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-zinc-100 pb-3">
                  <span className="text-zinc-500 text-sm">Account Name</span>
                  <span className="font-bold text-zinc-900">Swastik Srijan Foundation</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-zinc-100 pb-3">
                  <span className="text-zinc-500 text-sm">Bank</span>
                  <span className="font-bold text-zinc-900">Union Bank of India</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-zinc-100 pb-3">
                  <span className="text-zinc-500 text-sm">Account No.</span>
                  <span className="font-mono font-bold text-zinc-900">481401010036579</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-zinc-100 pb-3">
                  <span className="text-zinc-500 text-sm">IFSC Code</span>
                  <span className="font-mono font-bold text-[#FF6600]">UBIN0548146</span>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
                    <img src={qrCode} alt="Scan to Donate" className="w-16 h-16 rounded border border-zinc-300" />
                    <div>
                      <p className="text-xs font-bold text-zinc-700">Scan for UPI</p>
                      <p className="text-[10px] text-zinc-500">Fast Bank-to-Bank Transfer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex items-start gap-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <p className="text-sm font-bold text-orange-800 leading-snug">
                  📩 After transfer, email receipt details to receive your 80G certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TAX & LEGAL BENEFITS ================= */}
      <section className="py-24 px-4 bg-zinc-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold flex items-center gap-4">
                  <FaClipboardCheck className="text-[#FF6600]" />
                  TAX & LEGAL BENEFITS
                </h2>
                <div className="w-20 h-1 bg-[#FF6600]"></div>
              </div>

              <div className="grid gap-6">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#FF6600] group-hover:border-[#FF6600] transition-colors">
                    <FaCheckCircle className="text-[#FF6600] group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Registered under MP Societies Registration Act, 1973</h4>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                    <FaCheckCircle className="text-blue-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">12A & 80G – Provisionally Approved</h4>
                    <p className="text-zinc-400">80G certificate available for eligible donors</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-colors">
                    <FaCheckCircle className="text-green-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">CSR-1 Registered</h4>
                    <p className="text-zinc-400">Eligible for CSR Funding</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-colors">
                    <FaCheckCircle className="text-orange-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">NITI Aayog (NGO Darpan) Registered</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-[#FF6600] blur-3xl opacity-10 rounded-full"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] text-center space-y-6">
                <FaFileAlt className="text-8xl text-zinc-700 mx-auto opacity-20" />
                <h3 className="text-2xl font-bold">Standard 80G Tax Exemption</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Generous support helps us sustain programs and offers you significant tax benefits under the Income Tax Act.
                </p>
                <div className="pt-4">
                  <div className="inline-block px-6 py-2 rounded-full border border-[#FF6600] text-[#FF6600] font-bold">
                    Official Receipt Provided
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRANSPARENCY PROMISE ================= */}
      <section className="py-24 bg-white px-4 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#002344] p-12 md:p-16 rounded-[4rem] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6600] opacity-5 blur-[120px] -mr-32 -mt-32"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold">TRANSPARENCY PROMISE</h2>
                  <p className="text-xl text-zinc-300 font-medium italic">We believe trust is sacred.</p>
                </div>

                <div className="grid gap-6">
                  {["Proper utilization of funds", "Donor receipts issued", "Impact updates shared", "Ethical governance since 2013"].map((text, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <FaCheckCircle className="text-[#FF6600]" />
                      <span className="text-lg font-medium">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <div className="text-3xl font-black text-[#FF6600] tracking-tighter uppercase opacity-80">
                    Transparency First. Always.
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
                    <p className="text-4xl font-black text-[#FF6600] mb-1">85%</p>
                    <p className="text-sm font-bold opacity-60 uppercase tracking-widest">To Programs</p>
                  </div>
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
                    <p className="text-4xl font-black text-white mb-1">100%</p>
                    <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Transparency</p>
                  </div>
                </div>
                <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                  <p className="text-zinc-300 italic mb-4">"For every ₹100 you donate, ₹85 goes directly to field implementation, ensuring maximum impact for those who need it most."</p>
                  <p className="font-bold text-sm text-[#FF6600]">— Financial Promise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WANT TO DONATE IN A DIFFERENT WAY? ================= */}
      <section className="py-24 px-4 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">WANT TO DONATE IN A DIFFERENT WAY?</h2>
            <p className="text-xl text-zinc-500">Every kind of support helps us grow stronger together.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-zinc-100 text-center group hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FaGraduationCap size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">Sponsor a Project</h4>
              <p className="text-zinc-500 text-sm mb-6">Fund an entire learning center or health camp in your name or your loved one's.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-zinc-100 text-center group hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FaBriefcase size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">Corporate / CSR</h4>
              <p className="text-zinc-500 text-sm mb-6">Partner with us for your Corporate Social Responsibility initiatives and create large-scale impact.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-sm border border-zinc-100 text-center group hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <FaHandHoldingHeart size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">In-kind Support</h4>
              <p className="text-zinc-500 text-sm mb-6">Donate books, clothes, sports equipment, or digital devices for our learning centers.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/Contact"
              className="inline-block px-10 py-4 bg-black text-white font-bold rounded-2xl hover:bg-zinc-800 transition-colors"
            >
              👉 Contact Us for Partnership
            </a>
          </div>
        </div>
      </section>

      {/* ================= CERTIFICATE GENERATOR ================= */}
      <section className="py-24 bg-white px-4 border-t border-zinc-100">
        <CertificateGenerator role="Donor" />
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-24 px-4 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 flex items-center justify-center gap-3">
              <FaQuestionCircle className="text-[#002344]" /> Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#002344] group">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-zinc-50 transition-colors text-left"
                >
                  <span className="font-bold text-lg text-zinc-800">{faq.question}</span>
                  {openFaq === i ? <FaChevronUp className="text-[#002344]" /> : <FaChevronDown className="text-zinc-400" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white px-6 pb-6 text-zinc-600 leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA (Bottom) ================= */}
      <section className="py-32 px-4 relative overflow-hidden bg-black text-white text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/real/green-warriors-students.jpg"
            alt="Better Bharat"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black">Together, We Can Build <br /> a Better Bharat</h2>
            <p className="text-2xl md:text-3xl font-hindi text-[#FF6600] font-bold">आइए मिलकर एक बेहतर समाज बनाएं</p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <a
              href="#donate-methods"
              className="inline-block bg-[#FF6600] text-white font-black text-2xl px-12 py-5 rounded-full hover:bg-white hover:text-black transition-all transform hover:scale-105 shadow-2xl"
            >
              👉 Donate Now | अभी दान करें
            </a>
            <p className="text-zinc-400 text-sm max-w-md mx-auto italic uppercase tracking-widest">
              Your contribution today plants hope for generations tomorrow...
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
