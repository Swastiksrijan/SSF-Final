import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCrown, FaUserShield, FaUserTie, FaAward, FaHandHoldingHeart, FaArrowRight, FaCheckCircle, FaTimes } from "react-icons/fa";
import CertificateGenerator from "../components/CertificateGenerator";
import MemberForm from "../components/MemberForm";
import MemberActionResponse from "../components/MemberActionResponse";
import JoinRolesSection from "../components/JoinRolesSection";

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
    { id: "patron", title: "Patron Member", titleHi: "संरक्षक सदस्य", icon: <FaCrown />, color: "bg-amber-50 text-amber-700", border: "border-amber-100", accent: "bg-amber-400", role: ["Support the Foundation’s charitable objectives", "Encourage long-term community participation"], price: "₹10,000 or more", freq: "One-time or up to 12 instalments within one year" },
    { id: "life", title: "Life Member", titleHi: "आजीवन सदस्य", icon: <FaUserShield />, color: "bg-purple-50 text-purple-600", border: "border-purple-100", accent: "bg-purple-400", role: ["Long-term association with the Foundation", "Support its charitable objectives and programmes"], price: "₹8,000 or more", freq: "Contribution under Rule 5(B)" },
    { id: "general", title: "Ordinary Member", titleHi: "साधारण सदस्य", icon: <FaUserTie />, color: "bg-blue-50 text-blue-600", border: "border-blue-100", accent: "bg-blue-400", role: ["Support community-focused activities", "Membership remains valid for the paid period"], price: "₹100/month or ₹1,200/year", freq: "Six-month non-payment clause applies as written in Rule 5(C)" }
  ];

  const waysToParticipate = [
    { icon: <FaHandHoldingHeart />, title: "Community Participation", hi: "सामुदायिक सहभागिता", text: "Members may support suitable charitable activities, community programmes and volunteer initiatives according to their interests, availability and the Foundation’s current capacity." },
    { icon: <FaAward />, title: "Expert Contribution", hi: "विशेषज्ञ सहयोग", text: "People with professional or subject expertise may offer guidance and practical support for specific initiatives, subject to suitability and applicable rules." }
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
      <section className="ssf-hero-offset relative h-[80vh] flex items-center justify-center bg-[#12345A] overflow-hidden">
        <div className="absolute inset-0"><img src="/images/uploads/members-group.jpg" alt="Swastik Srijan Members Group" className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-[#12345A] via-[#12345A]/40 to-black/20"></div></div>
        <div className="relative z-10 text-center px-6 max-w-5xl space-y-8"><motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6"><div className="inline-block px-4 py-1.5 rounded-full bg-[#176447] text-white font-bold tracking-widest uppercase text-sm shadow-xl">Become a Member • सदस्य बनें</div><h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold text-white leading-tight drop-shadow-lg">The Backbone of <br /><span className="text-[#176447]">Our Foundation.</span></h1><p className="text-xl md:text-2xl text-zinc-100 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-md">"सदस्य वह है जो सेवा और सहयोग से संस्था के उद्देश्यों को आगे बढ़ाता है।"<br /><span className="text-lg opacity-80 font-normal">Join our charitable mission and help strengthen community initiatives.</span></p></motion.div></div>
      </section>

      {/* Join & Contribute — gradient dashboard hugging the hero */}
      <JoinRolesSection />

      {/* Membership options */}
      <section id="member-types" className="border-b border-zinc-100 bg-gradient-to-b from-white to-[#F6F9FB] px-5 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-[#EAF0F6] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#12345A]">Membership Options • सदस्यता विकल्प</span>
            <h2 className="mt-5 text-3xl font-bold text-[#12345A] md:text-5xl">Member के प्रकार</h2>
            <p className="mt-4 text-base font-medium text-zinc-500 md:text-lg">Choose your level of commitment and impact.</p>
          </div>
          <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {memberTypes.map((type, i) => (
              <motion.article key={type.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }} className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border-2 ${type.border} bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:p-8`}>
                <span className={`absolute inset-x-0 top-0 h-1.5 ${type.accent}`} aria-hidden="true" />
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${type.color} text-3xl`}>{type.icon}</div>
                <h3 className="mt-6 text-xl font-bold text-[#12345A]">{type.title}</h3>
                <p className="mt-1 font-hindi text-sm font-bold text-zinc-400">{type.titleHi}</p>
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Role: भूमिका</p>
                  <ul className="mt-3 space-y-2.5">
                    {type.role.map((r, idx) => <li key={idx} className="flex gap-2.5 text-sm leading-6 text-zinc-600"><FaCheckCircle className="mt-1 shrink-0 text-[#176447]" /><span>{r}</span></li>)}
                  </ul>
                </div>
                <div className="mt-auto pt-7">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-2xl font-black text-[#12345A]">{type.price}</p>
                    <p className="mt-1 text-xs font-medium text-zinc-500">{type.freq}</p>
                  </div>
                  <button type="button" onClick={() => openApplication(type.id)} className="mt-5 w-full rounded-xl bg-[#12345A] py-3 font-bold text-white transition hover:bg-[#176447]">Apply Now</button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to participate */}
      <section className="bg-white px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-[#176447]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#176447]">Ways to Participate • सहभागिता के तरीके</span>
            <h2 className="mt-5 text-3xl font-bold text-[#12345A] md:text-4xl">How members contribute</h2>
          </div>
          <div className="grid items-stretch gap-5 md:grid-cols-2 lg:gap-6">
            {waysToParticipate.map((c, i) => (
              <div key={i} className="flex h-full gap-4 rounded-3xl border border-[#EAF0F6] bg-zinc-50/70 p-6 sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#12345A] text-xl text-white">{c.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-[#12345A]">{c.title}</h3>
                  <p className="text-sm font-bold text-[#176447]">{c.hi}</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Existing members */}
      <section className="bg-white px-5 py-12 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[2rem] p-7 text-white shadow-lg md:flex-row md:items-center md:justify-between md:p-9" style={{ background: "linear-gradient(135deg, #12345A 0%, #153f63 50%, #176447 100%)", backgroundColor: "#12345A" }}>
          <div>
            <h2 className="text-xl font-black md:text-2xl">पहले से सदस्य हैं?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: "rgba(255,255,255,0.82)" }}>मौजूदा सदस्यता रिकॉर्ड या संपर्क विवरण अपडेट कराने के लिए संस्था से संपर्क करें।</p>
          </div>
          <a href="/Contact" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#F7A814] px-6 py-3 font-black text-[#12345A] transition hover:bg-white">संपर्क करें <FaArrowRight /></a>
        </div>
      </section>

      {/* Eligibility & application */}
      <section id="apply" className="bg-gradient-to-b from-white to-[#F6F9FB] px-5 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-[#EAF0F6] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#12345A]">Eligibility & Application • पात्रता एवं आवेदन</span>
            <h2 className="mt-5 text-3xl font-bold text-[#12345A] md:text-4xl">Membership Eligibility</h2>
          </div>
          <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="flex h-full flex-col rounded-3xl border border-[#EAF0F6] bg-white p-7 shadow-sm sm:p-9">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#176447]/10 text-xl text-[#176447]"><FaCheckCircle /></span>
              <h3 className="mt-5 text-xl font-bold text-[#12345A]">Who can apply</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">Applicants should be at least 18 years old, be eligible under the registered membership rules and agree to support the Foundation’s objectives and policies. Applications are subject to review under the applicable rules.</p>
            </div>
            <div className="flex h-full flex-col rounded-3xl border border-blue-100 bg-blue-50 p-7 sm:p-9">
              <h3 className="text-xl font-bold text-[#12345A]">Apply for Membership</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Complete the application form with accurate details. Submission is an application only; membership becomes effective after the required review and confirmation.</p>
              <a href="/MembershipHardcopy" className="mb-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-[#176447]/25 bg-white p-4 text-left font-bold text-[#176447] shadow-sm transition hover:shadow-md"><span>📄 हार्ड-कॉपी आवेदन PDF डाउनलोड / प्रिंट</span><FaArrowRight className="shrink-0" /></a>
              <button onClick={() => openApplication("general")} className="mt-auto flex w-full items-center justify-between gap-3 rounded-2xl bg-white p-5 text-left text-lg font-bold text-zinc-700 shadow-sm transition hover:text-[#12345A] hover:shadow-md"><span>📝 Member Application Form</span><FaArrowRight className="shrink-0" /></button>
            </div>
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
