import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FaFileContract, FaShieldAlt, FaUserShield, FaExternalLinkAlt, FaSyncAlt, FaExclamationTriangle, FaGavel, FaEnvelope } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import PageHero from "../components/PageHero";

export default function TermsAndConditions() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "acceptance",
      icon: <FaFileContract />,
      title: "1. Acceptance of Terms",
      content: "By accessing or using this website, you agree to comply with these Terms & Conditions. If you do not agree with any part of these terms, please discontinue using our website."
    },
    {
      id: "content",
      icon: <FaShieldAlt />,
      title: "2. Use of Website Content",
      content: "All content on this website—including text, images, graphics, logos, and other materials—is the property of Swastik Srijan Foundation and is protected under applicable copyright and trademark laws. Unauthorized reproduction or distribution is prohibited."
    },
    {
      id: "responsibility",
      icon: <FaUserShield />,
      title: "3. User Responsibilities",
      content: "Users must not engage in activities that disrupt the website’s security, integrity, or functionality. Any unlawful or malicious usage is strictly prohibited."
    },
    {
      id: "links",
      icon: <FaExternalLinkAlt />,
      title: "4. External Links",
      content: "This website may contain links to third-party websites for convenience. Swastik Srijan Foundation is not responsible for external content or policies."
    },
    {
      id: "updates",
      icon: <FaSyncAlt />,
      title: "5. Updates to Terms",
      content: "We reserve the right to update or modify these Terms & Conditions at any time. Continued use of the website implies acceptance of updated terms."
    },
    {
      id: "liability",
      icon: <FaExclamationTriangle />,
      title: "6. Limitation of Liability",
      content: "While we strive for accuracy, we do not guarantee completeness or reliability of website content. Use of the website is at your own risk."
    },
    {
      id: "privacy",
      icon: <FaShieldAlt />,
      title: "7. Privacy Policy",
      content: (
        <>
          By using this website, you agree to our <Link to="/privacy-policy" className="text-[#003366] hover:text-[#002244] font-bold underline decoration-2 underline-offset-2 transition-colors">Privacy Policy</Link> regarding the collection and use of personal information.
        </>
      )
    },
    {
      id: "law",
      icon: <FaGavel />,
      title: "8. Governing Law",
      content: "These terms are governed by the laws of India. Any disputes shall fall under the jurisdiction of Indian courts."
    },
    {
      id: "donation",
      icon: <FaFileContract />,
      title: "9. Donation Policy",
      content: "All donations made to Swastik Srijan Foundation are voluntary and non-refundable. We ensure responsible and transparent utilization of all donated funds towards our programs and initiatives."
    },
  ];

  return (
    <div className="w-full bg-zinc-50 font-inria">

      {/* ================= HERO ================= */}
      <PageHero
        image="/images/real/green-warriors-students.jpg"
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our website."
        hindiSubtitle="नियम और शर्तें - हमारी वेबसाइट का उपयोग करने से पहले कृपया इन शर्तों को ध्यान से पढ़ें।"
      />

      <div className="max-w-5xl mx-auto py-16 px-4">

        {/* ================= INTRODUCTION CARD ================= */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border-l-8 border-[#003366]">
          <h2 className="text-3xl font-bold mb-6 text-zinc-900">Welcome to Swastik Srijan Foundation</h2>
          <p className="text-lg text-zinc-600 leading-relaxed">
            These Terms and Conditions govern your use of our website and services. By accessing our platform, you acknowledge that you have read, understood, and agree to be bound by these terms. We are committed to transparency and ethical practices in all our operations.
          </p>
        </div>

        {/* ================= SECTIONS GRID ================= */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#003366] group"
              onMouseEnter={() => setActiveSection(section.id)}
              onMouseLeave={() => setActiveSection(null)}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 p-3 rounded-full text-xl transition-colors duration-300 ${activeSection === section.id ? 'bg-[#003366] text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-900 group-hover:text-[#003366] transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CONTACT SECTION ================= */}
        <div className="bg-zinc-900 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#003366] opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>

          <div className="p-10 md:p-16 text-center relative z-10">
            <div className="w-16 h-16 bg-[#003366] text-white rounded-full mx-auto flex items-center justify-center text-3xl mb-6">
              <FaEnvelope />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Questions about our Terms?</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              If you have any questions or concerns regarding these Terms & Conditions, please do not hesitate to contact our team.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 w-full md:w-auto min-w-[280px]">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Email Us</p>
                <div className="text-white font-bold text-lg space-y-2">
                  <p>{CONTACT_INFO.primaryEmail}</p>
                  <div className="pt-2 border-t border-white/10 mt-2">
                    <p className="text-[10px] text-zinc-400 font-bold flex items-center justify-center gap-2">
                      {CONTACT_INFO.secondaryEmail}
                      <span className="text-[8px] bg-red-500/20 text-red-100 px-2 py-0.5 rounded-full border border-red-500/30 uppercase">
                        {CONTACT_INFO.techIssueNote}
                      </span>
                    </p>
                    <p className="text-[10px] text-zinc-400 font-bold flex items-center justify-center gap-2 mt-1">
                      {CONTACT_INFO.thirdEmail}
                      <span className="text-[8px] bg-red-500/20 text-red-100 px-2 py-0.5 rounded-full border border-red-500/30 uppercase">
                        {CONTACT_INFO.techIssueNote}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 w-full md:w-auto min-w-[250px]">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Call Us</p>
                <p className="text-white font-bold text-lg">
                  {CONTACT_INFO.phones.primaryFormatted}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
