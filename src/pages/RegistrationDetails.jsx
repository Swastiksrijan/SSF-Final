import { useEffect, useState } from "react";
import { FaBuilding, FaIdCard, FaBalanceScale, FaBullseye, FaAward, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import { CONTACT_INFO } from "../config/contact";
import PageHero from "../components/PageHero";

export default function RegistrationDetails() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "overview",
      icon: <FaBuilding />,
      title: "Organization Overview",
      content:
        "Swastik Srijan Foundation (SSF) is a legally registered non-profit organization committed to education, health, social welfare, environment, and cultural development across India.",
      extra: (
        <ul className="list-disc pl-6 mt-3 space-y-1 font-medium">
          <li><strong>Full Name:</strong> Swastik Srijan Foundation Samiti</li>
          <li><strong>Type:</strong> Non-Governmental Organization (NGO)</li>
          <li>
            <strong>Scope:</strong> Nationwide activities covering education,
            health, women & child welfare.
          </li>
        </ul>
      ),
    },
    {
      id: "registration",
      icon: <FaIdCard />,
      title: "Legal Registration",
      content: null,
      extra: (
        <ul className="list-disc pl-6 space-y-2 font-medium">
          <li><strong>Registered Under:</strong> Madhya Pradesh Societies Registration Act, 1973</li>
          <li><strong>Registration Number:</strong> 05/22/03/11448/13</li>
          <li><strong>Date of Registration:</strong> 30/12/2013</li>
          <li>
            <strong>Registered Office:</strong> {CONTACT_INFO.address.fullRegistered}
          </li>
        </ul>
      ),
    },
    {
      id: "governance",
      icon: <FaBalanceScale />,
      title: "Compliance & Governance",
      content:
        "SSF operates in full compliance with Indian laws and regulations applicable to non-profit organizations.",
      extra: (
        <>
          <ul className="list-disc pl-6 mt-3 space-y-1 font-medium">
            <li>Maintains transparency through annual filings and audits.</li>
            <li>Governed by an Executive Committee (President, Secretary, Treasurer).</li>
          </ul>
        </>
      ),
    },
    {
      id: "purpose",
      icon: <FaBullseye />,
      title: "Purpose & Trust",
      content: null,
      extra: (
        <ul className="list-disc pl-6 space-y-2 font-medium">
          <li>Legal recognition as a charitable organization</li>
          <li>Authority to conduct nationwide welfare programs</li>
          <li>Transparency and trust for donors & beneficiaries</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#f8f9fa] font-inria min-h-screen">

      {/* ================= HERO ================= */}
      <PageHero
        image="/images/uploads/community-banner.jpg"
        title="Registration Details"
        subtitle="Official legal registration and governance information of Swastik Srijan Foundation."
        hindiSubtitle="पंजीकरण विवरण - स्वास्तिक सृजन फाउंडेशन की आधिकारिक कानूनी पंजीकरण और शासन जानकारी।"
      />

      <div className="max-w-7xl mx-auto py-32 px-6">

        {/* ================= INTRO CARD ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] p-10 md:p-16 mb-20 border-l-8 border-[#002344] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#002344]/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700"></div>
          <h2 className="text-4xl font-serif font-bold mb-8 text-[#002344]">
            Legal Identity & Compliance
          </h2>
          <p className="text-xl text-zinc-500 leading-relaxed font-medium">
            This page provides official registration and governance details of Swastik
            Srijan Foundation to ensure transparency, trust, and compliance with
            applicable laws and regulations.
          </p>
        </motion.div>

        {/* ================= SECTIONS GRID ================= */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] shadow-sm p-10 hover:shadow-xl hover:bg-[#002344] transition-all duration-500 border border-zinc-100 group"
              onMouseEnter={() => setActiveSection(section.id)}
              onMouseLeave={() => setActiveSection(null)}
            >
              <div className="flex flex-col gap-6">
                <div
                  className={`w-16 h-16 rounded-2xl text-2xl flex items-center justify-center transition-all duration-500 ${activeSection === section.id
                    ? "bg-[#fb8500] text-white"
                    : "bg-blue-50 text-[#002344]"
                    }`}
                >
                  {section.icon}
                </div>

                <div className="space-y-4">
                  <h3 className={`text-2xl font-serif font-bold transition-colors duration-500 ${activeSection === section.id ? 'text-white' : 'text-[#002344]'}`}>
                    {section.title}
                  </h3>

                  {section.content && (
                    <p className={`leading-relaxed transition-colors duration-500 ${activeSection === section.id ? 'text-blue-100' : 'text-zinc-500'}`}>
                      {section.content}
                    </p>
                  )}

                  {section.extra && (
                    <div className={`leading-relaxed transition-colors duration-500 ${activeSection === section.id ? 'text-blue-200' : 'text-zinc-600'}`}>
                      {section.extra}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= OFFICIAL DOCUMENTS ================= */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-[#002344] mb-4">Official Recognize & Certificates</h2>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10">
              We are committed to maintaining the highest standards of transparency and integrity.
            </p>
            <div className="max-w-4xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white mb-16 group">
              <img
                src="/images/uploads/community-banner.jpg"
                alt="SSF National Academy Official Board - Registration & Compliance"
                className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-100 hover:shadow-xl transition-all">
              <img src="/images/uploads/pm-cares-cert.jpg" alt="PM CARES Certificate" className="w-full h-auto rounded-2xl" />
              <p className="text-center font-bold text-[#002344] mt-4">PM CARES Fund Contribution</p>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-100 hover:shadow-xl transition-all">
              <img src="/images/uploads/integrity-pledge.jpg" alt="Integrity Pledge" className="w-full h-auto rounded-2xl" />
              <p className="text-center font-bold text-[#002344] mt-4">Integrity Pledge Certificate</p>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-100 hover:shadow-xl transition-all">
              <img src="/images/uploads/ngo-darpan.jpg" alt="NITI Aayog DARPAN" className="w-full h-auto rounded-2xl" />
              <p className="text-center font-bold text-[#002344] mt-4">NITI Aayog DARPAN Registration</p>
            </div>
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#001529] rounded-[3rem] shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#fb8500] opacity-[0.05] rounded-full translate-x-1/3 -translate-y-1/3 blur-[120px]"></div>

          <div className="p-12 md:p-20 text-center relative z-10 space-y-8">
            <div className="w-20 h-20 bg-[#fb8500] text-white rounded-[1.5rem] mx-auto flex items-center justify-center text-3xl shadow-lg shadow-[#fb8500]/20">
              <FaEnvelope />
            </div>
            <h2 className="text-4xl font-serif font-bold text-white">
              Need official clarification?
            </h2>
            <p className="text-zinc-400 text-xl mb-12 max-w-2xl mx-auto font-medium lead">
              For any legal verification or compliance-related queries, feel free to
              reach our administrative head.
            </p>

            <div className="bg-white/5 backdrop-blur-md px-10 py-8 rounded-[2rem] border border-white/10 inline-block group hover:bg-white/10 transition-all text-white space-y-6">
              <div className="text-center">
                <p className="text-[10px] text-[#fb8500] uppercase tracking-[0.3em] font-bold mb-3 opacity-80">
                  Official Email Inbox
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(CONTACT_INFO.primaryEmail);
                    alert("Email copied to clipboard!");
                  }}
                  className="font-serif font-bold text-2xl md:text-3xl hover:text-[#fb8500] transition-colors cursor-pointer outline-none border-b border-white/10 hover:border-[#fb8500] pb-1"
                  title="Click to copy"
                >
                  {CONTACT_INFO.primaryEmail}
                </button>
              </div>
              <div className="pt-6 border-t border-white/5 space-y-4">
                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold opacity-60 text-center">Alternative Support</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(CONTACT_INFO.secondaryEmail);
                        alert("Email copied!");
                      }}
                      className="text-sm text-zinc-300 font-semibold hover:text-[#fb8500] transition-colors cursor-pointer outline-none"
                      title="Click to copy"
                    >
                      {CONTACT_INFO.secondaryEmail}
                    </button>
                    <span className="text-[7px] font-black bg-white/5 text-zinc-500 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest shadow-sm">
                      {CONTACT_INFO.techIssueNote}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(CONTACT_INFO.thirdEmail);
                        alert("Email copied!");
                      }}
                      className="text-sm text-zinc-300 font-semibold hover:text-[#fb8500] transition-colors cursor-pointer outline-none"
                      title="Click to copy"
                    >
                      {CONTACT_INFO.thirdEmail}
                    </button>
                    <span className="text-[7px] font-black bg-white/5 text-zinc-500 px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest shadow-sm">
                      {CONTACT_INFO.techIssueNote}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
