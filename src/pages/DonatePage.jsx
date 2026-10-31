import { FaHandHoldingHeart, FaCheckCircle, FaShieldAlt, FaGraduationCap, FaHeartbeat, FaBriefcase, FaRunning, FaTree, FaClipboardCheck, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import qrCode from "../assets/barcode.jpg";
import DonorForm from "../components/DonorForm";

const RAZORPAY_URL = "https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view";

export default function DonatePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { question: "Is my donation tax-exempt?", answer: "The Foundation's final 80G approval application was submitted in July 2026 and is pending confirmation. The earlier provisional approval covered AY 2024–25 through AY 2026–27; please confirm current eligibility with the Foundation before claiming any deduction. Any tax benefit depends on the approval in force, the donation date and applicable law." },
    { question: "Is it safe to donate online?", answer: "Absolutely. We use Razorpay, a PCI-DSS compliant payment gateway that uses 128-bit encryption to ensure your transaction is completely secure." },
    { question: "Can I donate from outside India?", answer: "Please do not send any foreign contribution unless the Foundation has first obtained the required FCRA registration or project-specific prior permission. Contact the Foundation to verify the current legal position before initiating any cross-border transfer." },
    { question: "How will my donation be used?", answer: "We are committed to financial transparency. 85% of your donation directly funds our programs (Education, Health, Livelihood), 10% goes towards administrative costs, and 5% covers fundraising efforts." }
  ];

  const causes = [
    { id: 1, title: "Education for Every Child", titleHi: "हर बच्चे के लिए शिक्षा", icon: <FaGraduationCap />, points: ["School education", "Learning material", "Digital & creative education"], btnText: "Donate for Education", iconBox: "bg-[#EAF0F6] text-[#12345A]", border: "border-[#EAF0F6]", bg: "bg-[#EAF0F6]" },
    { id: 2, title: "Health & Nutrition", titleHi: "स्वास्थ्य और पोषण", icon: <FaHeartbeat />, points: ["Health camps", "Nutrition for children & women", "Medical assistance"], btnText: "Donate for Health", iconBox: "bg-[#EAF0F6] text-[#176447]", border: "border-[#EAF0F6]", bg: "bg-[#EAF0F6]" },
    { id: 3, title: "Livelihood & Skill Development", titleHi: "आजीविका और कौशल विकास", icon: <FaBriefcase />, points: ["Vocational training", "Women empowerment", "Self-employment support"], btnText: "Donate for Livelihood", iconBox: "bg-[#EAF0F6] text-[#176447]", border: "border-[#EAF0F6]", bg: "bg-[#EAF0F6]" },
    { id: 4, title: "Sports, Culture & Youth Development", titleHi: "खेल, संस्कृति और युवा विकास", icon: <FaRunning />, points: ["Sports activities", "Cultural programs", "Youth leadership"], btnText: "Support Youth & Sports", iconBox: "bg-[#EAF0F6] text-[#12345A]", border: "border-[#EAF0F6]", bg: "bg-[#EAF0F6]" },
    { id: 5, title: "Environment & Community Welfare", titleHi: "पर्यावरण और सामुदायिक कल्याण", icon: <FaTree />, points: ["Tree plantation", "Cleanliness & awareness", "Animal & bird welfare"], btnText: "Support Environment", iconBox: "bg-[#EAF0F6] text-[#176447]", border: "border-[#EAF0F6]", bg: "bg-[#EAF0F6]" }
  ];

  const whyDonate = [
    { text: "Serving communities since 2013", textHi: "2013 से समुदाय की सेवा में" },
    { text: "Grassroots, volunteer-driven organization", textHi: "जमीनी स्तर पर स्वयंसेवकों द्वारा संचालित संगठन" },
    { text: "Transparent & compliant NGO", textHi: "पारदर्शी और अनुपालन करने वाली संस्था" },
    { text: "Funds used directly on the ground", textHi: "निधि का सीधे धरातल पर उपयोग" }
  ];

  return (
    <div className="w-full font-sans bg-[#EAF0F6] text-[#12345A]">
      <section className="relative pt-20 md:pt-24 pb-8 md:pb-12 bg-[#12345A] overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 20%, rgba(247,168,20,0.28), transparent 35%)" }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-center">
            <div className="text-white py-6 md:py-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-5"><FaHandHoldingHeart className="text-[#F7A814]" /> Support Swastik Srijan Foundation Samiti</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">Your Support.<br /><span className="text-[#F7A814]">Real Impact.</span></h1>
              <p className="mt-5 text-lg md:text-xl text-[#EAF0F6] max-w-xl font-hindi leading-relaxed">आपका दान सिर्फ पैसा नहीं, आशा बनता है। शिक्षा, स्वास्थ्य, कौशल, युवा और पर्यावरण से जुड़े प्रयासों में सहयोग करें।</p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a href={RAZORPAY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 bg-[#176447] hover:bg-[#176447] text-[#12345A] font-bold px-7 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5">👉 Donate Now / Support SSF</a>
                <a href="#donate-methods" className="inline-flex justify-center items-center px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold transition-colors">दान कैसे करें ↓</a>
              </div>
              <div className="mt-7 flex flex-wrap gap-2 text-xs text-[#EAF0F6]">
                <span className="px-3 py-2 rounded-full bg-white/5 border border-white/10">Since 2013</span>
                <span className="px-3 py-2 rounded-full bg-white/5 border border-white/10">Transparent & compliant NGO</span>
                <span className="px-3 py-2 rounded-full bg-white/5 border border-white/10">Secure online payment</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-[#176447]/25 blur-2xl" />
              <img src="/images/uploads/donate-hero.jpg" alt="Donate - Children holding signs" className="relative w-full max-h-[520px] object-cover rounded-[2rem] shadow-2xl border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <span className="text-[#12345A] text-sm font-black uppercase tracking-[0.2em]">Why support SSF</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black text-[#12345A]">Why Your Donation Matters</h2>
              <p className="mt-2 text-xl md:text-2xl font-hindi text-[#26343D]">आपका दान क्यों मायने रखता है</p>
              <div className="mt-7 grid gap-3">
                {whyDonate.map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="flex items-start gap-3 p-4 rounded-2xl bg-[#EAF0F6] border border-[#EAF0F6] hover:border-[#F7A814]/50 hover:shadow-sm transition-all">
                    <span className="mt-0.5 w-7 h-7 shrink-0 rounded-full bg-[#176447] flex items-center justify-center"><FaCheckCircle className="text-[#12345A] text-sm" /></span>
                    <div><p className="font-bold text-[#12345A]">{item.text}</p><p className="text-sm font-hindi text-[#26343D] mt-0.5">{item.textHi}</p></div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pl-5 border-l-4 border-[#F7A814]"><p className="text-xl font-hindi text-[#12345A] font-semibold italic">“आपका दान सिर्फ पैसा नहीं, आशा बनता है।”</p></div>
            </div>
            <div className="relative">
              <div className="absolute -inset-2 bg-[#12345A] rounded-[2rem] rotate-2" />
              <img src="/images/real/community-education-meeting.jpg" alt="Community education meeting" className="relative w-full h-[300px] md:h-[410px] object-cover rounded-[1.7rem] shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-[#EAF0F6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <span className="text-[#12345A] text-sm font-black uppercase tracking-[0.2em]">Choose where to support</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-[#12345A]">CHOOSE A CAUSE TO DONATE</h2>
            <div className="w-20 h-1 bg-[#176447] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {causes.map((cause, idx) => (
              <motion.article key={cause.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className={`group flex flex-col p-6 md:p-7 rounded-[1.6rem] border ${cause.border} ${cause.bg} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl ${cause.iconBox}`}>{cause.icon}</div>
                  <div><h3 className="text-xl font-extrabold leading-snug text-[#12345A]">{cause.title}</h3><p className="mt-1 font-hindi text-[#26343D]">{cause.titleHi}</p></div>
                </div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {cause.points.map((point, i) => <li key={i} className="flex items-center gap-3 text-sm md:text-base text-[#26343D]"><span className="w-1.5 h-1.5 rounded-full bg-[#176447] transition-colors" />{point}</li>)}
                </ul>
                <a href={RAZORPAY_URL} target="_blank" rel="noopener noreferrer" className="mt-6 w-full text-center py-3.5 rounded-xl bg-white border border-[#EAF0F6] hover:bg-[#12345A] hover:text-white hover:border-[#12345A] font-bold transition-all">👉 {cause.btnText} · Support SSF</a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="donate-methods" className="py-14 md:py-20 px-4 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-9 md:mb-11">
            <span className="text-[#12345A] text-sm font-black uppercase tracking-[0.2em]">Simple & secure</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-[#12345A]">HOW TO DONATE</h2>
            <p className="mt-1 text-lg font-hindi text-[#26343D]">दान कैसे करें</p>
            <div className="w-20 h-1 bg-[#176447] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#12345A] to-[#12345A] text-white p-6 md:p-8 rounded-[1.7rem] shadow-xl">
              <FaHandHoldingHeart className="absolute -right-8 -top-8 text-[12rem] text-white/5" />
              <div className="relative z-10 h-full flex flex-col">
                <span className="w-fit px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider">Option 1</span>
                <h3 className="mt-5 text-3xl font-black">Online Donation</h3>
                <p className="mt-1 text-[#EAF0F6] text-sm italic">Fast & Secure | त्वरित और सुरक्षित</p>
                <ul className="mt-6 space-y-3 text-base">
                  <li className="flex gap-3 items-center"><FaCheckCircle className="text-[#F7A814]" /> UPI (GPay, PhonePe, etc.)</li>
                  <li className="flex gap-3 items-center"><FaCheckCircle className="text-[#F7A814]" /> Debit / Credit Card</li>
                  <li className="flex gap-3 items-center"><FaCheckCircle className="text-[#F7A814]" /> Net Banking</li>
                </ul>
                <div className="mt-auto pt-7">
                  <a href={RAZORPAY_URL} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#176447] hover:bg-[#176447] text-[#12345A] py-4 rounded-xl font-black text-lg shadow-lg transition-colors">👉 Donate Now / Support SSF</a>
                  <p className="mt-3 text-xs text-[#EAF0F6] flex justify-center items-center gap-2"><FaShieldAlt className="text-[#176447]" /> Razorpay / Secure Gateway</p>
                </div>
              </div>
            </div>

            <div className="bg-[#EAF0F6] border border-[#EAF0F6] p-6 md:p-8 rounded-[1.7rem] shadow-sm">
              <span className="w-fit inline-flex px-3 py-1 rounded-full bg-[#EAF0F6] text-[#26343D] text-xs font-bold uppercase tracking-wider">Option 2</span>
              <h3 className="mt-5 text-2xl md:text-3xl font-black text-[#12345A]">Donate via Bank Transfer</h3>
              <p className="mt-1 text-[#26343D] text-sm">Direct Account Transfer</p>
              <div className="mt-5 bg-white rounded-2xl border border-[#EAF0F6] overflow-hidden">
                <div className="divide-y divide-zinc-100">
                  <div className="p-4"><p className="text-xs text-[#26343D]">Account Name</p><p className="mt-1 font-bold">Swastik Srijan Foundation Samiti</p></div>
                  <div className="p-4"><p className="text-xs text-[#26343D]">Bank</p><p className="mt-1 font-bold">Union Bank of India</p></div>
                  <div className="p-4"><p className="text-xs text-[#26343D]">Account No.</p><p className="mt-1 font-mono font-bold break-all">481401010036579</p></div>
                  <div className="p-4"><p className="text-xs text-[#26343D]">IFSC Code</p><p className="mt-1 font-mono font-bold text-[#12345A]">UBIN0548146</p></div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 p-3 bg-white rounded-2xl border-2 border-dashed border-[#EAF0F6]">
                <img src={qrCode} alt="Scan to Donate" className="w-20 h-20 rounded-xl border border-[#EAF0F6] object-cover" />
                <div><p className="font-bold text-[#12345A]">Scan to Pay via UPI / Paytm</p><p className="text-xs text-[#26343D] mt-1">Scan the official QR code to make a payment.</p></div>
              </div>
              <div className="mt-4 rounded-2xl border border-[#EAF0F6] bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wider text-[#26343D]">Paytm mobile number</p><a href="tel:9718346691" className="mt-1 inline-block text-xl font-black tracking-wide text-[#12345A]">9718346691</a><p className="mt-1 text-xs text-[#26343D]">You may use this number in Paytm where mobile-number payments are supported. Verify the recipient name before confirming.</p></div><div className="mt-4 p-4 bg-[#EAF0F6] border border-[#EAF0F6] rounded-2xl"><p className="text-sm font-bold text-[#12345A] leading-relaxed">📩 After transfer, email your transaction details to request a donation receipt. Any 80G tax document depends on current approval status and donor eligibility.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#EAF0F6] py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-4 mb-5 text-center">
          <span className="text-[#12345A] text-sm font-black uppercase tracking-[0.2em]">Stay connected</span>
          <h2 className="mt-2 text-3xl font-black text-[#12345A]">Donor Details</h2>
          <p className="mt-1 text-[#26343D]">अपनी जानकारी देकर donation record और communication में सहायता करें।</p>
        </div>
        <DonorForm />
      </section>

      <section className="py-14 md:py-20 px-4 bg-[#12345A] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-start">
            <div>
              <span className="text-[#F7A814] text-sm font-black uppercase tracking-[0.2em]">Trust & compliance</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-black flex items-center gap-3"><FaClipboardCheck className="text-[#F7A814]" /> TAX & LEGAL BENEFITS</h2>
              <div className="mt-7 grid gap-3">
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"><FaCheckCircle className="mt-1 text-[#F7A814] shrink-0" /><div><h4 className="font-bold">Registered under MP Societies Registration Act, 1973</h4></div></div>
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"><FaCheckCircle className="mt-1 text-[#EAF0F6] shrink-0" /><div><h4 className="font-bold">12AB Registered · 80G Final Application Pending</h4><p className="text-sm text-zinc-400 mt-1">Please confirm current 80G eligibility before claiming a deduction</p></div></div>
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"><FaCheckCircle className="mt-1 text-[#176447] shrink-0" /><div><h4 className="font-bold">CSR-1 Registered</h4><p className="text-sm text-zinc-400 mt-1">CSR project implementation remains subject to all applicable eligibility conditions, including valid 80G approval where required. Please contact us for current status.</p></div></div>
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"><FaCheckCircle className="mt-1 text-[#F7A814] shrink-0" /><div><h4 className="font-bold">NITI Aayog (NGO Darpan) Registered</h4></div></div>
              </div>
            </div>
            <div className="bg-white/5 p-6 md:p-8 rounded-[1.7rem] border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-[#176447]/20 flex items-center justify-center mb-5"><FaShieldAlt className="text-[#F7A814] text-xl" /></div>
              <h3 className="text-2xl font-black">Transparent & Accountable</h3>
              <p className="mt-3 text-[#EAF0F6] leading-relaxed">We maintain proper records of donations and program expenditure. Donors may request relevant information for transparency and accountability.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-9">
            <span className="text-[#12345A] text-sm font-black uppercase tracking-[0.2em]">Need to know?</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-[#12345A]">Frequently Asked Questions</h2>
            <p className="mt-1 text-lg font-hindi text-[#26343D]">अक्सर पूछे जाने वाले सवाल</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return <div key={faq.question} className="rounded-2xl border border-[#EAF0F6] overflow-hidden bg-[#EAF0F6]">
                <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white transition-colors">
                  <span className="font-bold text-[#12345A]">{faq.question}</span>
                  <FaChevronDown className={`shrink-0 text-[#26343D] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}><div className="px-5 pb-5 text-sm md:text-base text-[#26343D] leading-relaxed border-t border-[#EAF0F6] pt-4">{faq.answer}</div></motion.div>}
                </AnimatePresence>
              </div>;
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
