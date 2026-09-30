import { FaHandHoldingHeart, FaCheckCircle, FaShieldAlt, FaGraduationCap, FaHeartbeat, FaBriefcase, FaRunning, FaTree, FaClipboardCheck, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import qrCode from "../assets/barcode.jpg";
import DonorForm from "../components/DonorForm";

const RAZORPAY_URL = "https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view";

export default function DonatePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { question: "Is my donation tax-exempt?", answer: "Yes, all donations to Swastik Srijan Foundation are 50% tax-exempt under Section 80G of the Income Tax Act, 1961. You will receive a tax exemption certificate via email within 48 hours of your donation." },
    { question: "Is it safe to donate online?", answer: "Absolutely. We use Razorpay, a PCI-DSS compliant payment gateway that uses 128-bit encryption to ensure your transaction is completely secure." },
    { question: "Can I donate from outside India?", answer: "Currently, we can only accept donations from Indian bank accounts and cards due to FCRA regulations. We are working on enabling international donations soon." },
    { question: "How will my donation be used?", answer: "We are committed to financial transparency. 85% of your donation directly funds our programs (Education, Health, Livelihood), 10% goes towards administrative costs, and 5% covers fundraising efforts." }
  ];

  const causes = [
    { id: 1, title: "Education for Every Child", titleHi: "हर बच्चे के लिए शिक्षा", icon: <FaGraduationCap />, points: ["School education", "Learning material", "Digital & creative education"], btnText: "Donate for Education", iconBox: "bg-blue-100 text-blue-700", border: "border-blue-200", bg: "bg-blue-50/70" },
    { id: 2, title: "Health & Nutrition", titleHi: "स्वास्थ्य और पोषण", icon: <FaHeartbeat />, points: ["Health camps", "Nutrition for children & women", "Medical assistance"], btnText: "Donate for Health", iconBox: "bg-red-100 text-red-700", border: "border-red-200", bg: "bg-red-50/70" },
    { id: 3, title: "Livelihood & Skill Development", titleHi: "आजीविका और कौशल विकास", icon: <FaBriefcase />, points: ["Vocational training", "Women empowerment", "Self-employment support"], btnText: "Donate for Livelihood", iconBox: "bg-green-100 text-green-700", border: "border-green-200", bg: "bg-green-50/70" },
    { id: 4, title: "Sports, Culture & Youth Development", titleHi: "खेल, संस्कृति और युवा विकास", icon: <FaRunning />, points: ["Sports activities", "Cultural programs", "Youth leadership"], btnText: "Support Youth & Sports", iconBox: "bg-orange-100 text-orange-700", border: "border-orange-200", bg: "bg-orange-50/70" },
    { id: 5, title: "Environment & Community Welfare", titleHi: "पर्यावरण और सामुदायिक कल्याण", icon: <FaTree />, points: ["Tree plantation", "Cleanliness & awareness", "Animal & bird welfare"], btnText: "Support Environment", iconBox: "bg-emerald-100 text-emerald-700", border: "border-emerald-200", bg: "bg-emerald-50/70" }
  ];

  const whyDonate = [
    { text: "Serving communities since 2013", textHi: "2013 से समुदाय की सेवा में" },
    { text: "Grassroots, volunteer-driven organization", textHi: "जमीनी स्तर पर स्वयंसेवकों द्वारा संचालित संगठन" },
    { text: "Transparent & compliant NGO", textHi: "पारदर्शी और अनुपालन करने वाली संस्था" },
    { text: "Funds used directly on the ground", textHi: "निधि का सीधे धरातल पर उपयोग" }
  ];

  return (
    <div className="w-full font-sans bg-zinc-50 text-zinc-900">
      <section className="relative pt-20 md:pt-24 pb-8 md:pb-12 bg-[#002344] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,102,0,0.22),transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-center">
            <div className="text-white py-6 md:py-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-semibold mb-5"><FaHandHoldingHeart className="text-[#FF6600]" /> Support meaningful work</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">Your Support.<br /><span className="text-[#FF6600]">Real Impact.</span></h1>
              <p className="mt-5 text-lg md:text-xl text-zinc-300 max-w-xl font-hindi leading-relaxed">आपका दान सिर्फ पैसा नहीं, आशा बनता है। शिक्षा, स्वास्थ्य, कौशल, युवा और पर्यावरण से जुड़े प्रयासों में सहयोग करें।</p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a href={RAZORPAY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold px-7 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5">👉 Donate Now</a>
                <a href="#donate-methods" className="inline-flex justify-center items-center px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold transition-colors">दान कैसे करें ↓</a>
              </div>
              <div className="mt-7 flex flex-wrap gap-2 text-xs text-zinc-300">
                <span className="px-3 py-2 rounded-full bg-white/5 border border-white/10">Since 2013</span>
                <span className="px-3 py-2 rounded-full bg-white/5 border border-white/10">Transparent & compliant NGO</span>
                <span className="px-3 py-2 rounded-full bg-white/5 border border-white/10">Secure online payment</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-[#FF6600]/20 blur-2xl" />
              <img src="/images/uploads/donate-hero.jpg" alt="Donate - Children holding signs" className="relative w-full max-h-[520px] object-cover rounded-[2rem] shadow-2xl border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <span className="text-[#FF6600] text-sm font-black uppercase tracking-[0.2em]">Why support SSF</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black text-[#002344]">Why Your Donation Matters</h2>
              <p className="mt-2 text-xl md:text-2xl font-hindi text-zinc-500">आपका दान क्यों मायने रखता है</p>
              <div className="mt-7 grid gap-3">
                {whyDonate.map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-orange-200 hover:shadow-sm transition-all">
                    <span className="mt-0.5 w-7 h-7 shrink-0 rounded-full bg-[#FF6600] flex items-center justify-center"><FaCheckCircle className="text-white text-sm" /></span>
                    <div><p className="font-bold text-zinc-800">{item.text}</p><p className="text-sm font-hindi text-zinc-500 mt-0.5">{item.textHi}</p></div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pl-5 border-l-4 border-[#FF6600]"><p className="text-xl font-hindi text-[#002344] font-semibold italic">“आपका दान सिर्फ पैसा नहीं, आशा बनता है।”</p></div>
            </div>
            <div className="relative">
              <div className="absolute -inset-2 bg-[#002344] rounded-[2rem] rotate-2" />
              <img src="/images/real/community-education-meeting.jpg" alt="Community education meeting" className="relative w-full h-[300px] md:h-[410px] object-cover rounded-[1.7rem] shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="text-[#FF6600] text-sm font-black uppercase tracking-[0.2em]">Choose where to support</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-[#002344]">CHOOSE A CAUSE TO DONATE</h2>
            <div className="w-20 h-1 bg-[#FF6600] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {causes.map((cause, idx) => (
              <motion.article key={cause.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className={`group flex flex-col p-6 md:p-7 rounded-[1.6rem] border ${cause.border} ${cause.bg} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl ${cause.iconBox}`}>{cause.icon}</div>
                  <div><h3 className="text-xl font-extrabold leading-snug text-zinc-900">{cause.title}</h3><p className="mt-1 font-hindi text-zinc-600">{cause.titleHi}</p></div>
                </div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {cause.points.map((point, i) => <li key={i} className="flex items-center gap-3 text-sm md:text-base text-zinc-700"><span className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-[#FF6600] transition-colors" />{point}</li>)}
                </ul>
                <a href={RAZORPAY_URL} target="_blank" rel="noopener noreferrer" className="mt-6 w-full text-center py-3.5 rounded-xl bg-white border border-zinc-200 hover:bg-[#002344] hover:text-white hover:border-[#002344] font-bold transition-all">👉 {cause.btnText}</a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="donate-methods" className="py-14 md:py-20 px-4 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-9 md:mb-11">
            <span className="text-[#FF6600] text-sm font-black uppercase tracking-[0.2em]">Simple & secure</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-[#002344]">HOW TO DONATE</h2>
            <p className="mt-1 text-lg font-hindi text-zinc-500">दान कैसे करें</p>
            <div className="w-20 h-1 bg-[#FF6600] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#002344] to-zinc-950 text-white p-6 md:p-8 rounded-[1.7rem] shadow-xl">
              <FaHandHoldingHeart className="absolute -right-8 -top-8 text-[12rem] text-white/5" />
              <div className="relative z-10 h-full flex flex-col">
                <span className="w-fit px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider">Option 1</span>
                <h3 className="mt-5 text-3xl font-black">Online Donation</h3>
                <p className="mt-1 text-zinc-400 text-sm italic">Fast & Secure | त्वरित और सुरक्षित</p>
                <ul className="mt-6 space-y-3 text-base">
                  <li className="flex gap-3 items-center"><FaCheckCircle className="text-[#FF6600]" /> UPI (GPay, PhonePe, etc.)</li>
                  <li className="flex gap-3 items-center"><FaCheckCircle className="text-[#FF6600]" /> Debit / Credit Card</li>
                  <li className="flex gap-3 items-center"><FaCheckCircle className="text-[#FF6600]" /> Net Banking</li>
                </ul>
                <div className="mt-auto pt-7">
                  <a href={RAZORPAY_URL} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#FF6600] hover:bg-[#e65c00] py-4 rounded-xl font-black text-lg shadow-lg transition-colors">👉 Donate Now</a>
                  <p className="mt-3 text-xs text-zinc-400 flex justify-center items-center gap-2"><FaShieldAlt className="text-green-400" /> Razorpay / Secure Gateway</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-6 md:p-8 rounded-[1.7rem] shadow-sm">
              <span className="w-fit inline-flex px-3 py-1 rounded-full bg-zinc-200 text-zinc-700 text-xs font-bold uppercase tracking-wider">Option 2</span>
              <h3 className="mt-5 text-2xl md:text-3xl font-black text-zinc-900">Donate via Bank Transfer</h3>
              <p className="mt-1 text-zinc-500 text-sm">Direct Account Transfer</p>
              <div className="mt-5 bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                <div className="divide-y divide-zinc-100">
                  <div className="p-4"><p className="text-xs text-zinc-500">Account Name</p><p className="mt-1 font-bold">Swastik Srijan Foundation</p></div>
                  <div className="p-4"><p className="text-xs text-zinc-500">Bank</p><p className="mt-1 font-bold">Union Bank of India</p></div>
                  <div className="p-4"><p className="text-xs text-zinc-500">Account No.</p><p className="mt-1 font-mono font-bold break-all">481401010036579</p></div>
                  <div className="p-4"><p className="text-xs text-zinc-500">IFSC Code</p><p className="mt-1 font-mono font-bold text-[#FF6600]">UBIN0548146</p></div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 p-3 bg-white rounded-2xl border-2 border-dashed border-zinc-200">
                <img src={qrCode} alt="Scan to Donate" className="w-20 h-20 rounded-xl border border-zinc-200 object-cover" />
                <div><p className="font-bold text-zinc-800">Scan for UPI</p><p className="text-xs text-zinc-500 mt-1">Fast Bank-to-Bank Transfer</p></div>
              </div>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl"><p className="text-sm font-bold text-orange-800 leading-relaxed">📩 After transfer, email receipt details to receive your 80G certificate.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-4 mb-5 text-center">
          <span className="text-[#FF6600] text-sm font-black uppercase tracking-[0.2em]">Stay connected</span>
          <h2 className="mt-2 text-3xl font-black text-[#002344]">Donor Details</h2>
          <p className="mt-1 text-zinc-500">अपनी जानकारी देकर donation record और communication में सहायता करें।</p>
        </div>
        <DonorForm />
      </section>

      <section className="py-14 md:py-20 px-4 bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-start">
            <div>
              <span className="text-[#FF6600] text-sm font-black uppercase tracking-[0.2em]">Trust & compliance</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black flex items-center gap-3"><FaClipboardCheck className="text-[#FF6600]" /> TAX & LEGAL BENEFITS</h2>
              <div className="mt-7 grid gap-3">
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"><FaCheckCircle className="mt-1 text-[#FF6600] shrink-0" /><div><h4 className="font-bold">Registered under MP Societies Registration Act, 1973</h4></div></div>
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"><FaCheckCircle className="mt-1 text-blue-400 shrink-0" /><div><h4 className="font-bold">12A & 80G – Provisionally Approved</h4><p className="text-sm text-zinc-400 mt-1">80G certificate available for eligible donors</p></div></div>
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"><FaCheckCircle className="mt-1 text-green-400 shrink-0" /><div><h4 className="font-bold">CSR-1 Registered</h4><p className="text-sm text-zinc-400 mt-1">Eligible for CSR Funding</p></div></div>
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"><FaCheckCircle className="mt-1 text-orange-400 shrink-0" /><div><h4 className="font-bold">NITI Aayog (NGO Darpan) Registered</h4></div></div>
              </div>
            </div>
            <div className="bg-white/5 p-6 md:p-8 rounded-[1.7rem] border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6600]/15 flex items-center justify-center mb-5"><FaShieldAlt className="text-[#FF6600] text-xl" /></div>
              <h3 className="text-2xl font-black">Transparent & Accountable</h3>
              <p className="mt-3 text-zinc-400 leading-relaxed">We maintain proper records of donations and program expenditure. Donors may request relevant information for transparency and accountability.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-9">
            <span className="text-[#FF6600] text-sm font-black uppercase tracking-[0.2em]">Need to know?</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-[#002344]">Frequently Asked Questions</h2>
            <p className="mt-1 text-lg font-hindi text-zinc-500">अक्सर पूछे जाने वाले सवाल</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return <div key={faq.question} className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50">
                <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white transition-colors">
                  <span className="font-bold text-zinc-900">{faq.question}</span>
                  <FaChevronDown className={`shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}><div className="px-5 pb-5 text-sm md:text-base text-zinc-600 leading-relaxed border-t border-zinc-200 pt-4">{faq.answer}</div></motion.div>}
                </AnimatePresence>
              </div>;
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
