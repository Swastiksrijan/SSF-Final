import { FaHandHoldingHeart, FaChartPie, FaFileContract, FaUniversity, FaCheckCircle, FaRupeeSign, FaQrcode, FaShieldAlt, FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import qrCode from "../assets/barcode.jpg"; // Updated to the correct QR code image
import heroInvestImage from "/images/real/scholarship_distribution.jpg";

export default function DonateAndSupport() {
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

  const impactTiers = [
    { amount: 1000, desc: "Educational supplies for 2 children", descHi: "2 बच्चों के लिए शैक्षिक सामग्री", color: "bg-[#003366]/5 border-[#003366]/20 text-[#003366]" },
    { amount: 2500, desc: "Health checkup camp for 20 villagers", descHi: "20 ग्रामीणों के लिए स्वास्थ्य जांच शिविर", color: "bg-green-50 border-green-200 text-green-800" },
    { amount: 5000, desc: "Vocational training for 1 woman", descHi: "1 महिला के लिए व्यावसायिक प्रशिक्षण", color: "bg-purple-50 border-purple-200 text-purple-800" },
    { amount: 10000, desc: "Digital classroom setup support", descHi: "डिजिटल क्लासरूम सेटअप सहायता", color: "bg-orange-50 border-orange-200 text-orange-800" },
  ];

  return (
    <div className="w-full font-inria bg-zinc-50">

      {/* ================= HERO ================= */}
      <section className="bg-zinc-900 text-white min-h-[60vh] flex items-center justify-center relative overflow-hidden px-4 pt-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm tracking-widest uppercase">
              Join the Movement • आंदोलन में शामिल हों
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Invest in <br /><span className="text-white">Hope & Dignity</span>
            </h1>
            <h2 className="text-3xl font-hindi text-[#fb8500] mb-6">आशा और गरिमा में निवेश करें</h2>
            <p className="text-zinc-300 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
              Your contribution isn't just charity. It's an investment in a child's education, a woman's independence, and a village's future.
            </p>
            <div className="pt-6 flex justify-center">
              <img
                src={heroInvestImage}
                alt="Investing in Future"
                className="w-full max-w-lg h-60 md:h-80 object-cover rounded-2xl shadow-2xl opacity-80 hover:opacity-100 transition-opacity border-4 border-white/10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= IMPACT TIERS ================= */}
      <section className="py-12 px-4 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactTiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border-2 shadow-lg backdrop-blur-xl bg-white flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 ${tier.color}`}
            >
              <div className="text-3xl font-black mb-2 flex items-center">
                <FaRupeeSign className="text-xl" /> {tier.amount.toLocaleString()}
              </div>
              <p className="font-semibold opacity-80">{tier.desc}</p>
              <p className="text-xs font-hindi mt-1 opacity-60">{tier.descHi}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WAYS TO DONATE ================= */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-zinc-900 mb-4">Ways to Contribute</h2>
            <h3 className="text-2xl font-hindi text-[#003366]">योगदान के तरीके</h3>
            <p className="text-xl text-zinc-500 mt-4">Choose the method that suits you best.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* LEFT COLUMN: ONLINE & QR */}
            <div className="space-y-8">

              {/* Online Donation Card */}
              <div className="bg-gradient-to-br from-[#003366] to-black text-white p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                  <FaHandHoldingHeart size={200} />
                </div>

                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <FaHandHoldingHeart /> Donate Online | ऑनलाइन दान करें
                </h3>
                <p className="text-zinc-200 mb-8 text-lg">
                  Secure, instant, and hassle-free. Supports Credit Cards, Debit Cards, Netbanking, and UPI.
                </p>

                <a
                  href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                  target="_blank"
                  className="inline-block w-full bg-white text-[#003366] font-black text-xl py-4 rounded-xl text-center hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  DONATE NOW
                </a>
                <p className="text-center text-xs text-zinc-300 mt-4 flex items-center justify-center gap-1">
                  <FaShieldAlt /> 256-bit Secure SSL Payment
                </p>
              </div>

              {/* QR Code Card */}
              <div className="bg-white border-2 border-zinc-100 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 bg-white p-2 border-2 border-black rounded-xl shrink-0">
                  <img src={qrCode} alt="SSF Donation QR Code" className="w-full h-full object-contain" />
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-2xl font-bold text-zinc-900 mb-2 flex items-center justify-center md:justify-start gap-2">
                    <FaQrcode className="text-[#003366]" /> Scan to Donate | स्कैन करें
                  </h4>
                  <p className="text-zinc-600 mb-4">
                    Use any UPI app (Google Pay, PhonePe, Paytm, BHIM) to scan and donate instantly.
                  </p>
                  <div className="inline-block px-4 py-2 bg-zinc-100 rounded-lg text-sm font-mono text-zinc-500">
                    swastiksrijanfoundation@ptyes
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: BANK TRANSFER */}
            <div>
              <div className="bg-zinc-900 text-white p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden h-full">
                {/* Decorative Elements for "Premium Card" look */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#003366] opacity-10 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <FaUniversity /> Bank Transfer • बैंक ट्रांसफर
                </h3>

                <div className="space-y-6 relative z-10">
                  <p className="text-zinc-400">
                    Prefer direct bank transfer? Use the details below for NEFT, IMPS or RTGS.
                  </p>

                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 pb-3">
                      <span className="text-zinc-400 text-sm">Account Name</span>
                      <span className="font-bold text-lg text-white text-right">Swastik Srijan Foundation Samiti</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 pb-3">
                      <span className="text-zinc-400 text-sm">Account Number</span>
                      <span className="font-mono text-xl tracking-wider text-right">481401010036579</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 pb-3">
                      <span className="text-zinc-400 text-sm">IFSC Code</span>
                      <span className="font-mono text-lg text-right">UBIN0548146</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 pb-3">
                      <span className="text-zinc-400 text-sm">Bank Name</span>
                      <span className="font-bold text-right">Union Bank Of India</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-1">
                      <span className="text-zinc-400 text-sm">Branch</span>
                      <span className="font-medium text-right text-sm">Transport Nagar, Rewa, MP</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-zinc-400 bg-black/30 p-4 rounded-lg">
                    <FaCheckCircle className="text-green-500 shrink-0 mt-0.5" />
                    <p>After transfer, please share transaction details (Screenshot/UTR) to <b>contact@swastiksrijan.org</b> to receive your 80G tax exemption receipt.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TRANSPARENCY & UTILIZATION ================= */}
      <section className="py-20 bg-zinc-100 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-black">Complete Financial <br /><span className="text-[#003366]">Transparency</span></h2>
              <h3 className="text-2xl font-hindi text-zinc-500">पूर्ण वित्तीय पारदर्शिता</h3>
              <p className="text-lg text-zinc-600 leading-relaxed">
                We believe you deserve to know exactly where your money goes. For every ₹100 you donate, ₹85 goes directly to the field.
              </p>
              <p className="text-zinc-400 mt-2 text-md">
                हमारा मानना है कि आपको यह जानने का पूरा अधिकार है कि आपका पैसा कहाँ जा रहा है। आपके द्वारा दान किए गए प्रत्येक ₹100 में से ₹85 सीधे क्षेत्र (फील्ड) में सेवा के लिए जाते हैं।
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-[#003366]"></div>
                  <div className="flex-1 font-bold">Program Implementation</div>
                  <div className="font-mono font-bold text-xl">85%</div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-black"></div>
                  <div className="flex-1 font-bold">Admin & Overheads</div>
                  <div className="font-mono font-bold text-xl">10%</div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-zinc-400"></div>
                  <div className="flex-1 font-bold">Fundraising Costs</div>
                  <div className="font-mono font-bold text-xl">5%</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-80 h-80">
                <FaChartPie className="w-full h-full text-zinc-200 drop-shadow-xl" />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-6xl font-black text-[#003366] drop-shadow-sm">85%</span>
                  <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase mt-2">To Programs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-zinc-900 flex items-center justify-center gap-3">
              <FaQuestionCircle className="text-[#003366]" /> Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-zinc-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#003366]">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-6 bg-zinc-50 hover:bg-white transition-colors text-left"
                >
                  <span className="font-bold text-lg text-zinc-800">{faq.question}</span>
                  {openFaq === i ? <FaChevronUp className="text-[#003366]" /> : <FaChevronDown className="text-zinc-400" />}
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

      {/* ================= TRANSPARENCY PROMISE FOOTER ================= */}
      <section className="py-12 bg-black text-center text-zinc-400 text-sm px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 opacity-60">
          <span className="flex items-center gap-2"><FaCheckCircle /> Registered NGO</span>
          <span className="flex items-center gap-2"><FaCheckCircle /> 12A Certified</span>
          <span className="flex items-center gap-2"><FaCheckCircle /> 80G Tax Exempt</span>
          <span className="flex items-center gap-2"><FaCheckCircle /> CSR-1 Compliant</span>
        </div>
      </section>

    </div>
  );
}
