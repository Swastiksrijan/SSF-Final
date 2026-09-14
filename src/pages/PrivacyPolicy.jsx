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
  FaEnvelope,
  FaChild,
  FaClock,
  FaBalanceScale,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";
import { motion } from "framer-motion";
import { CONTACT_INFO } from "../config/contact";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "intro",
      icon: <FaUserShield />,
      title: "1. Introduction",
      hindi: "परिचय",
      content:
        "Swastik Srijan Foundation (“SSF”, “we”, “our”) respects your privacy and is committed to responsible handling of personal information. This Privacy Policy explains what information may be collected when you visit or interact with our website, why it may be used, how it may be protected, and how you can contact us about your information."
    },
    {
      id: "collection",
      icon: <FaDatabase />,
      title: "2. Information We Collect",
      hindi: "हम कौन-सी जानकारी एकत्र कर सकते हैं",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Identity and contact information:</strong> name, email address, phone number, postal/address details and other information voluntarily submitted through forms.</li>
          <li><strong>Participation information:</strong> information provided for membership, volunteering, internship, partnership, events, campaigns or enquiries.</li>
          <li><strong>Donation information:</strong> information necessary to process, acknowledge or document a donation. Payment credentials should be handled by the relevant payment provider and are not intended to be stored by SSF unless specifically required and lawfully permitted.</li>
          <li><strong>Technical information:</strong> browser, device, IP address, approximate usage information, cookies and similar technical data where enabled by our website or service providers.</li>
        </ul>
      )
    },
    {
      id: "usage",
      icon: <FaTasks />,
      title: "3. How We Use Your Information",
      hindi: "जानकारी का उपयोग क्यों किया जाता है",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>To respond to enquiries and requests submitted to SSF.</li>
          <li>To facilitate membership, volunteering, internships, partnerships and participation in programmes.</li>
          <li>To process donations, maintain records and issue acknowledgements or receipts where applicable.</li>
          <li>To communicate relevant programme updates, notices, events or newsletters where appropriate.</li>
          <li>To maintain, secure and improve website functionality and user experience.</li>
          <li>To comply with applicable legal, accounting, regulatory or record-keeping requirements.</li>
        </ul>
      )
    },
    {
      id: "purpose",
      icon: <FaBalanceScale />,
      title: "4. Purpose, Minimisation & Lawful Processing",
      hindi: "उद्देश्य, आवश्यक जानकारी और वैध उपयोग",
      content: (
        <p>
          SSF aims to collect and use only information that is reasonably necessary for the stated purpose of a particular interaction. Where consent is the basis for processing, requests should be presented in clear language and consent may be withdrawn subject to applicable law and legitimate record-keeping requirements. Processing may also occur where permitted or required by applicable law.
        </p>
      )
    },
    {
      id: "sharing",
      icon: <FaShareAlt />,
      title: "5. Data Sharing and Disclosure",
      hindi: "जानकारी साझा करना",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>We do not sell or rent personal information for commercial purposes.</li>
          <li>Information may be shared with trusted service providers when reasonably necessary for hosting, forms, communications, analytics, payment processing or other website functions.</li>
          <li>Service providers are expected to handle information only for relevant purposes and in accordance with applicable requirements.</li>
          <li>Information may be disclosed where required, permitted or reasonably necessary under applicable law, legal process, fraud prevention or security requirements.</li>
        </ul>
      )
    },
    {
      id: "security",
      icon: <FaLock />,
      title: "6. Data Security",
      hindi: "डेटा सुरक्षा",
      content:
        "We take reasonable organisational and technical measures appropriate to the information we handle to reduce the risk of unauthorised access, alteration, disclosure or misuse. However, no internet transmission or electronic storage system can be guaranteed to be completely secure. If we become aware of a relevant personal data security incident, we will take appropriate steps as required by applicable law."
    },
    {
      id: "retention",
      icon: <FaClock />,
      title: "7. Data Retention",
      hindi: "डेटा कितने समय तक रखा जाता है",
      content:
        "Personal information is intended to be retained only for as long as reasonably necessary for the purpose for which it was collected, or for legitimate organisational, accounting, audit, legal or regulatory requirements. When information is no longer required, SSF may delete, anonymise or otherwise dispose of it using reasonable measures, subject to applicable law."
    },
    {
      id: "cookies",
      icon: <FaCookieBite />,
      title: "8. Cookies and Analytics",
      hindi: "कुकीज़ और एनालिटिक्स",
      content:
        "Our website may use cookies or similar technologies for essential functionality, preferences, analytics, security and performance. The availability and purpose of particular cookies may depend on the services enabled on the website. Where required, relevant consent or browser controls may be used. Disabling certain cookies may affect some website features."
    },
    {
      id: "thirdparty",
      icon: <FaExternalLinkAlt />,
      title: "9. Third-Party Links and Services",
      hindi: "थर्ड-पार्टी वेबसाइट और सेवाएँ",
      content:
        "Our website may contain links to external websites, payment services, document repositories or other third-party platforms. Those services operate under their own terms and privacy practices. SSF is not responsible for the privacy practices or content of third-party websites, and users should review the applicable privacy information before submitting personal information to them."
    },
    {
      id: "children",
      icon: <FaChild />,
      title: "10. Children and Young Persons",
      hindi: "बच्चों और नाबालिगों की जानकारी",
      content:
        "SSF undertakes education and child-related activities. Where personal information of a child is involved, we will seek to follow applicable requirements relating to parental or lawful guardian consent and child data protection. We do not knowingly seek unnecessary personal information from children through this website."
    },
    {
      id: "rights",
      icon: <FaUserCheck />,
      title: "11. Your Privacy Rights and Requests",
      hindi: "आपके अधिकार और अनुरोध",
      content: (
        <>
          <p className="mb-3">Subject to applicable law, you may contact SSF to request access to relevant information, correction or updating of inaccurate information, deletion where permitted, withdrawal of consent where consent is the basis of processing, or assistance with a privacy-related grievance.</p>
          <p className="mb-3">Requests may require reasonable verification of identity before action is taken. Some information may need to be retained where required by law or for legitimate organisational records.</p>
          <p><strong>Email:</strong> {CONTACT_INFO.primaryEmail}<br /><strong>Phone:</strong> {CONTACT_INFO.phones.primary}</p>
        </>
      )
    },
    {
      id: "grievance",
      icon: <FaShieldAlt />,
      title: "12. Privacy Questions & Grievance Support",
      hindi: "गोपनीयता संबंधी प्रश्न और शिकायत",
      content:
        "If you have a question, concern or grievance about how your personal information is handled, please contact SSF using the official contact details below. We will review the request and respond through the appropriate process, subject to applicable law and verification requirements."
    },
    {
      id: "updates",
      icon: <FaSyncAlt />,
      title: "13. Updates to This Privacy Policy",
      hindi: "गोपनीयता नीति में बदलाव",
      content:
        "This Privacy Policy may be updated from time to time to reflect changes in our website, services, operational practices or applicable legal requirements. The updated version will be published on this page with an updated date."
    },
    {
      id: "consent",
      icon: <FaFileSignature />,
      title: "14. Consent and Your Choices",
      hindi: "सहमति और आपकी पसंद",
      content:
        "Where consent is requested for processing personal information, it should be given through a clear affirmative action for the stated purpose. Where consent is the applicable basis for processing, you may withdraw it through the available mechanism or by contacting SSF. Withdrawal does not affect processing that was lawful before withdrawal or processing that is otherwise permitted or required by law."
    }
  ];

  return (
    <div className="w-full bg-zinc-50 font-inria text-[#002344]">
      {/* ================= CODED HERO ================= */}
      <section className="relative overflow-hidden bg-[#001a33] text-white py-16 sm:py-20 lg:py-24 border-b-4 border-[#fb8500]">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-[#fb8500]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute right-[7%] top-[18%] hidden lg:block w-72 h-72 rounded-full border border-white/10 rotate-12" />
        <div className="container mx-auto px-5 sm:px-8 max-w-6xl relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }} className="rounded-[28px] border border-white/15 bg-white/[.06] backdrop-blur-md p-5 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#fb8500]" />
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#fb8500]/30 bg-[#fb8500]/10 px-4 py-2 text-xs font-black tracking-[.16em] uppercase text-orange-200">
                    <FaUserShield /> Privacy & Data Protection
                  </div>
                  <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .08 }} className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight break-words">
                    Privacy <span className="text-[#fb8500]">Policy</span>
                  </motion.h1>
                  <p className="mt-4 text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-3xl">
                    How Swastik Srijan Foundation collects, uses, protects and manages personal information.
                  </p>
                  <p className="mt-3 text-sm sm:text-base text-orange-200 font-serif font-bold italic">
                    आपकी जानकारी की सुरक्षा, जिम्मेदार उपयोग और पारदर्शी डेटा प्रबंधन के लिए हमारी नीति।
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 text-xs sm:text-sm">
                    <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-2">Clear information</span>
                    <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-2">Responsible use</span>
                    <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-2">Data protection</span>
                  </div>
                </div>
                <div className="shrink-0 mx-auto lg:mx-0 w-32 h-32 sm:w-40 sm:h-40 rounded-[32px] border border-white/15 bg-white/[.06] flex items-center justify-center rotate-3 shadow-xl">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#fb8500]/60 flex items-center justify-center -rotate-3">
                    <FaShieldAlt className="text-4xl sm:text-5xl text-[#fb8500]" />
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="mt-4 flex flex-wrap justify-between gap-2 px-2 text-xs text-slate-400">
              <span>Swastik Srijan Foundation</span>
              <span>Last reviewed: September 2026</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        {/* ================= INTRO CARD ================= */}
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl shadow-lg p-7 sm:p-9 lg:p-11 mb-10 border border-zinc-200 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#fb8500]" />
          <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#002344]/5 border border-[#002344]/10 flex items-center justify-center text-2xl text-[#fb8500]"><FaCheckCircle /></div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3">Your Privacy Matters to Us</h2>
              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">Swastik Srijan Foundation is committed to transparency, accountability and responsible handling of personal information entrusted to us. This page is designed to explain our approach in clear, accessible language.</p>
              <div className="mt-5 inline-flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <span className="rounded-full bg-zinc-100 px-3 py-1.5">Privacy</span>
                <span className="rounded-full bg-zinc-100 px-3 py-1.5">Security</span>
                <span className="rounded-full bg-zinc-100 px-3 py-1.5">Accountability</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= SECTIONS GRID ================= */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-7 mb-14">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .35, delay: Math.min(index * .025, .25) }}
              className="bg-white rounded-2xl shadow-sm p-6 sm:p-7 border border-zinc-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              onMouseEnter={() => setActiveSection(section.id)}
              onMouseLeave={() => setActiveSection(null)}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 mt-1 w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${activeSection === section.id ? "bg-[#002344] text-white scale-105" : "bg-[#002344]/5 text-[#fb8500]"}`}>
                  {section.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#002344] transition-colors">{section.title}</h3>
                  <p className="text-[#fb8500] font-serif font-bold italic mt-1 mb-3">{section.hindi}</p>
                  <div className="text-zinc-600 leading-relaxed text-[15px]">{section.content}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= CONTACT SECTION ================= */}
        <div className="rounded-3xl bg-[#001a33] shadow-2xl overflow-hidden relative border border-[#003b66]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 48%, rgba(251,133,0,.25) 49%, transparent 51%)", backgroundSize: "28px 28px" }} />
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#fb8500] opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
          <div className="p-8 sm:p-10 lg:p-14 text-center relative z-10">
            <div className="w-16 h-16 bg-[#fb8500] text-white rounded-2xl mx-auto flex items-center justify-center text-2xl mb-5 shadow-lg"><FaEnvelope /></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Privacy Questions or Data Request?</h2>
            <p className="text-slate-300 text-base sm:text-lg mb-7 max-w-2xl mx-auto leading-relaxed">For access, correction, deletion, consent withdrawal, privacy questions or a grievance, please contact Swastik Srijan Foundation through the official details below.</p>
            <div className="bg-white/10 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-white/15 inline-block max-w-full">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Official Privacy Contact</p>
              <button
                onClick={() => { navigator.clipboard?.writeText(CONTACT_INFO.primaryEmail); alert("Email copied to clipboard!"); }}
                className="text-white font-bold text-base sm:text-lg hover:text-[#fb8500] transition-colors cursor-pointer outline-none break-all"
              >
                {CONTACT_INFO.primaryEmail}
              </button>
              <div className="mt-3 text-sm text-slate-300">Phone: <span className="font-semibold text-white">{CONTACT_INFO.phones.primary}</span></div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-7 leading-relaxed">
          This Privacy Policy is intended as an organisational privacy notice and should be read together with applicable laws, website terms and specific notices presented when information is collected. Where applicable law provides a different requirement, the applicable law will prevail.
        </p>
      </div>
    </div>
  );
}
