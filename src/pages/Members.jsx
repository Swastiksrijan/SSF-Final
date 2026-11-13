import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCrown, FaUserShield, FaUserTie, FaAward, FaUsers, FaHandHoldingHeart, FaArrowRight, FaCheckCircle, FaTimes } from "react-icons/fa";
import CertificateGenerator from "../components/CertificateGenerator";
import MemberForm from "../components/MemberForm";
import MemberActionResponse from "../components/MemberActionResponse";

const Members = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMemberType, setSelectedMemberType] = useState("general");
  const [directApplication, setDirectApplication] = useState(false);
  const [noticeToken, setNoticeToken] = useState("");

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const memberTypes = [
    { id: "patron", title: "Patron Member", titleHi: "संरक्षक सदस्य", icon: <FaCrown />, color: "bg-amber-50 text-amber-700", border: "border-amber-100", role: ["Support the Foundation’s charitable objectives", "Encourage long-term community participation"], price: "₹10,000 or more", freq: "One-time or up to 12 instalments within one year" },
    { id: "life", title: "Life Member", titleHi: "आजीवन सदस्य", icon: <FaUserShield />, color: "bg-purple-50 text-purple-600", border: "border-purple-100", role: ["Long-term association with the Foundation", "Support its charitable objectives and programmes"], price: "₹8,000 or more", freq: "Contribution under Rule 5(B)" },
    { id: "general", title: "Ordinary Member", titleHi: "साधारण सदस्य", icon: <FaUserTie />, color: "bg-blue-50 text-blue-600", border: "border-blue-100", role: ["Support community-focused activities", "Membership remains valid for the paid period"], price: "₹100/month or ₹1,200/year", freq: "Six-month non-payment clause applies as written in Rule 5(C)" }
  ];

  const openApplication = (memberType = "general") => {
    setSelectedMemberType(memberType);
    setIsFormOpen(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("notice")) setNoticeToken(params.get("notice"));
    if (params.get("apply") === "1") {
      const requestedType = params.get("type");
      setSelectedMemberType(["patron", "life", "general"].includes(requestedType) ? requestedType : "general");
      setDirectApplication(true);
    }
  }, []);

  if (noticeToken) return <MemberActionResponse token={noticeToken} />;

  if (directApplication) return (
    <main className="min-h-screen bg-slate-50 px-4 pb-12 pt-32 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <a href="/Members" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#12345A] hover:text-[#176447]">← सदस्यता जानकारी पर वापस जाएँ</a>
        <MemberForm key={selectedMemberType} initialMemberType={selectedMemberType} />
      </div>
    </main>
  );

  return (
    <div className="w-full bg-white font-sans text-zinc-900 overflow-hidden">
      <section className="relative h-[80vh] flex items-center justify-center bg-[#12345A] overflow-hidden">
        <div className="absolute inset-0"><img src="/images/uploads/members-group.jpg" alt="Swastik Srijan Members Group" className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-[#12345A] via-[#12345A]/40 to-black/20"></div></div>
        <div className="relative z-10 text-center px-6 max-w-5xl space-y-8"><motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6"><div className="inline-block px-4 py-1.5 rounded-full bg-[#176447] text-white font-bold tracking-widest uppercase text-sm shadow-xl">Become a Member • सदस्य बनें</div><h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold text-white leading-tight drop-shadow-lg">The Backbone of <br /><span className="text-[#176447]">Our Foundation.</span></h1><p className="text-xl md:text-2xl text-zinc-100 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-md">"सदस्य वह है जो सेवा और सहयोग से संस्था के उद्देश्यों को आगे बढ़ाता है।"<br /><span className="text-lg opacity-80 font-normal">Join our charitable mission and help strengthen community initiatives.</span></p></motion.div></div>
      </section>

      <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4"><h2 className="text-3xl md:text-5xl font-bold text-[#12345A]">Member के प्रकार</h2><p className="text-zinc-500 text-lg font-medium">Choose your level of commitment and impact.</p></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memberTypes.map((type, i) => (
              <motion.div key={type.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }} className={`bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 ${type.border} shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative ${type.highlight ? 'ring-2 ring-purple-200' : ''}`}>
                {type.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">Most Popular</span></div>}
                <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center text-3xl mb-8`}>{type.icon}</div>
                <h3 className="text-xl font-bold text-[#12345A] mb-1">{type.title}</h3><h4 className="text-sm font-hindi text-zinc-400 font-bold mb-6">{type.titleHi}</h4>
                <div className="space-y-4 flex-grow"><div><p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Role: भूमिका</p><ul className="space-y-2">{type.role.map((r, idx) => <li key={idx} className="text-sm text-zinc-600 flex gap-2"><span className="text-orange-400">•</span><span>{r}</span></li>)}</ul></div><div className="pt-6 border-t border-zinc-100"><p className="text-2xl font-black text-[#12345A]">{type.price}</p><p className="text-xs text-zinc-500 font-medium">{type.freq}</p></div></div>
                <button type="button" onClick={() => openApplication(type.id)} className={`mt-8 w-full py-3 text-center rounded-xl font-bold transition-all ${type.highlight ? 'bg-[#12345A] text-white hover:bg-[#176447]' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}>Apply Now</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-100 bg-white px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#EAF0F6] bg-zinc-50 p-6">
            <h3 className="text-lg font-black text-[#12345A]">Community Participation / सामुदायिक सहभागिता</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">Members may support suitable charitable activities, community programmes and volunteer initiatives according to their interests, availability and the Foundation’s current capacity.</p>
          </div>
          <div className="rounded-2xl border border-[#EAF0F6] bg-zinc-50 p-6">
            <h3 className="text-lg font-black text-[#12345A]">Expert Contribution / विशेषज्ञ सहयोग</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">People with professional or subject expertise may offer guidance and practical support for specific initiatives, subject to suitability and applicable rules.</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 rounded-3xl border border-[#EAF0F6] bg-slate-50 p-7 md:flex-row md:items-center">
          <div><h2 className="text-xl font-black text-[#12345A]">पहले से सदस्य हैं?</h2><p className="mt-2 text-sm text-slate-600">मौजूदा सदस्यता रिकॉर्ड या संपर्क विवरण अपडेट कराने के लिए संस्था से संपर्क करें।</p></div>
          <a href="/Contact" className="inline-flex shrink-0 items-center rounded-xl bg-[#12345A] px-6 py-3 font-bold text-white hover:bg-[#176447]">संपर्क करें</a>
        </div>
      </section>

      <section className="py-20 px-6 bg-white" id="apply">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 shadow-xl sm:p-10 md:p-14">
          <div className="grid gap-10 md:grid-cols-2">
            <div><h3 className="flex items-center gap-3 text-2xl font-bold text-[#12345A]"><FaCheckCircle className="text-[#176447]" /> Membership Eligibility</h3><p className="mt-4 text-sm leading-7 text-zinc-600">Applicants should be at least 18 years old, be eligible under the registered membership rules and agree to support the Foundation’s objectives and policies. Applications are subject to review under the applicable rules.</p></div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6"><h4 className="mb-4 text-lg font-bold text-[#12345A]">Apply for Membership</h4><p className="mb-5 text-sm leading-6 text-slate-600">Complete the application form with accurate details. Submission is an application only; membership becomes effective after the required review and confirmation.</p><button onClick={() => openApplication("general")} className="flex w-full items-center justify-between rounded-xl bg-white p-4 text-left text-lg font-bold text-zinc-700 transition hover:text-[#12345A] hover:shadow-md"><span>📝 Member Application Form</span><FaArrowRight /></button></div>
          </div>
        </div>
      </section>

      <AnimatePresence>{isFormOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-[#12345A]/80 backdrop-blur-md"></motion.div><motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl p-2 md:p-4">
        <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 z-10 w-10 h-10 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"><FaTimes size={20} /></button>
        <div className="p-2"><MemberForm key={selectedMemberType} initialMemberType={selectedMemberType} /></div>
      </motion.div></div>}</AnimatePresence>

      <section className="py-24 bg-zinc-50 px-4 border-t border-zinc-100"><CertificateGenerator role="Member" /></section>
    </div>
  );
};

export default Members;
