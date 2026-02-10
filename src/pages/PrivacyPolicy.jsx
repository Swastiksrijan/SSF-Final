import { useEffect, useState } from "react";
import {
  FaUserShield,
  FaDatabase,
  FaTasks,
  FaShareAlt,
  FaLock,
  FaCookieBite,
  FaExternalLinkAlt,
  FaUserCheck,
  FaSyncAlt,
  FaFileSignature,
  FaEnvelope
} from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import PageHero from "../components/PageHero";

export default function PrivacyPolicy() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "intro",
      icon: <FaUserShield />,
      title: "1. Introduction",
      content:
        "Swastik Srijan Foundation (“SSF”, “we”, “our”) values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit or interact with our website."
    },
    {
      id: "collection",
      icon: <FaDatabase />,
      title: "2. Information We Collect",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Personal Information:</strong> Name, email address, phone number,
            postal address, and any details voluntarily provided for membership,
            donations, volunteering, or inquiries.
          </li>
          <li>
            <strong>Non-Personal Information:</strong> Browser type, device information,
            IP address, and website usage data for analytics and performance improvement.
          </li>
        </ul>
      )
    },
    {
      id: "usage",
      icon: <FaTasks />,
      title: "3. How We Use Your Information",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Facilitate membership registration, donations, and volunteering</li>
          <li>Communicate program updates, events, and newsletters</li>
          <li>Process donations and issue receipts</li>
          <li>Improve website functionality and user experience</li>
          <li>Comply with legal obligations and internal policies</li>
        </ul>
      )
    },
    {
      id: "sharing",
      icon: <FaShareAlt />,
      title: "4. Data Sharing and Disclosure",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>We do not sell or rent your personal information to third parties</li>
          <li>
            Information may be shared with trusted service providers for hosting,
            payment processing, or communication under strict confidentiality
          </li>
          <li>Disclosure may occur if required by law or legal process</li>
        </ul>
      )
    },
    {
      id: "security",
      icon: <FaLock />,
      title: "5. Data Security",
      content:
        "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or misuse. However, no internet transmission is completely secure."
    },
    {
      id: "cookies",
      icon: <FaCookieBite />,
      title: "6. Cookies and Analytics",
      content:
        "Our website may use cookies or similar technologies to improve user experience, analyze trends, and monitor performance. Disabling cookies may impact certain website features."
    },
    {
      id: "thirdparty",
      icon: <FaExternalLinkAlt />,
      title: "7. Third-Party Links",
      content:
        "Our website may contain links to external websites. Swastik Srijan Foundation is not responsible for the privacy practices or content of third-party sites."
    },
    {
      id: "rights",
      icon: <FaUserCheck />,
      title: "8. Your Rights",
      content: (
        <>
          <p className="mb-2">
            You may request access, correction, or deletion of your personal
            information held by SSF.
          </p>
          <p>
            <strong>Email:</strong> {CONTACT_INFO.primaryEmail} <br />
            <strong>Phone:</strong> {CONTACT_INFO.phones.primary}
          </p>
        </>
      )
    },
    {
      id: "updates",
      icon: <FaSyncAlt />,
      title: "9. Updates to Privacy Policy",
      content:
        "This Privacy Policy may be updated periodically. Updated versions will be posted on the website, and continued use signifies acceptance of the revised policy."
    },
    {
      id: "consent",
      icon: <FaFileSignature />,
      title: "10. Consent",
      content:
        "By using our website, you consent to the collection and use of your information as described in this Privacy Policy."
    }
  ];

  return (
    <div className="w-full bg-zinc-50 font-inria">

      {/* ================= HERO ================= */}
      <PageHero
        image="/images/real/academy-board-compliance.jpg"
        title="Privacy Policy"
        subtitle="How Swastik Srijan Foundation protects and manages your information."
        hindiSubtitle="गोपनीयता नीति - हम आपकी जानकारी की सुरक्षा और प्रबंधन कैसे करते हैं।"
      />

      <div className="max-w-5xl mx-auto py-16 px-4">

        {/* ================= INTRO CARD ================= */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border-l-8 border-[#003366]">
          <h2 className="text-3xl font-bold mb-6 text-zinc-900">
            Your Privacy Matters to Us
          </h2>
          <p className="text-lg text-zinc-600 leading-relaxed">
            Swastik Srijan Foundation is committed to transparency, accountability,
            and responsible handling of personal information entrusted to us.
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
                <div
                  className={`mt-1 p-3 rounded-full text-xl transition-colors duration-300 ${activeSection === section.id
                    ? "bg-[#003366] text-white"
                    : "bg-zinc-100 text-zinc-500"
                    }`}
                >
                  {section.icon}
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-900 group-hover:text-[#003366] transition-colors">
                    {section.title}
                  </h3>
                  <div className="text-zinc-600 leading-relaxed">
                    {section.content}
                  </div>
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
            <h2 className="text-3xl font-bold text-white mb-4">
              Privacy Questions?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              Reach out to us for any privacy-related concerns or data requests.
            </p>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 inline-block">
              <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">
                Contact Email
              </p>
              <div className="text-white font-bold text-lg space-y-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(CONTACT_INFO.primaryEmail);
                    alert("Email copied to clipboard!");
                  }}
                  className="block hover:text-[#fb8500] transition-colors cursor-pointer outline-none w-full"
                >
                  {CONTACT_INFO.primaryEmail}
                </button>
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(CONTACT_INFO.secondaryEmail);
                        alert("Email copied!");
                      }}
                      className="text-xs text-zinc-400 font-bold hover:text-[#fb8500] transition-colors cursor-pointer outline-none"
                    >
                      {CONTACT_INFO.secondaryEmail}
                    </button>
                    <span className="text-[8px] bg-white/5 text-zinc-500 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-tighter">
                      {CONTACT_INFO.techIssueNote}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(CONTACT_INFO.thirdEmail);
                        alert("Email copied!");
                      }}
                      className="text-xs text-zinc-400 font-bold hover:text-[#fb8500] transition-colors cursor-pointer outline-none"
                    >
                      {CONTACT_INFO.thirdEmail}
                    </button>
                    <span className="text-[8px] bg-white/5 text-zinc-500 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-tighter">
                      {CONTACT_INFO.techIssueNote}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
