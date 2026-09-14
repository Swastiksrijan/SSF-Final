import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  FaFileContract,
  FaShieldAlt,
  FaUserShield,
  FaExternalLinkAlt,
  FaSyncAlt,
  FaExclamationTriangle,
  FaGavel,
  FaEnvelope,
  FaHandHoldingHeart,
  FaCopyright,
  FaBan,
  FaChild,
  FaCheckCircle,
} from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "acceptance",
      icon: <FaFileContract />,
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using the Swastik Srijan Foundation website, you acknowledge that you have read and understood these Terms of Use and agree to follow them. If you do not agree, please discontinue use of the website.",
    },
    {
      id: "website-use",
      icon: <FaCheckCircle />,
      title: "2. Permitted Use",
      content:
        "You may use this website for lawful purposes, including learning about our work, programs, volunteering opportunities, partnerships, donations, reports, and other information made available by the Foundation. You must use the website responsibly and respectfully.",
    },
    {
      id: "prohibited",
      icon: <FaBan />,
      title: "3. Prohibited Activities",
      content:
        "You must not misuse the website, attempt unauthorized access, interfere with its security or operation, introduce malicious code, impersonate another person or organization, submit knowingly false information, or use the website for any unlawful or harmful purpose.",
    },
    {
      id: "content",
      icon: <FaCopyright />,
      title: "4. Website Content & Intellectual Property",
      content:
        "Unless otherwise stated, website text, graphics, logos, photographs, designs, documents and other original materials are owned by or used by Swastik Srijan Foundation with appropriate rights. They must not be copied, reproduced, modified, distributed or commercially exploited without permission, except where permitted by applicable law.",
    },
    {
      id: "user-content",
      icon: <FaUserShield />,
      title: "5. Information Submitted by Users",
      content:
        "When you submit information through a form, inquiry, volunteer application, membership request, partnership request or similar facility, you should provide information that is accurate and that you are authorized to provide. Submission of information does not by itself guarantee membership, selection, employment, volunteering, partnership or any other outcome.",
    },
    {
      id: "donations",
      icon: <FaHandHoldingHeart />,
      title: "6. Donations & Financial Transactions",
      content:
        "Donations are voluntary contributions made to support the Foundation's charitable and social-development activities. Donation-related transactions may be subject to the separate Donation & Refund Policy and to the terms of the applicable payment service provider. Donors should review the relevant details before completing a transaction.",
    },
    {
      id: "accuracy",
      icon: <FaShieldAlt />,
      title: "7. Information Accuracy & Availability",
      content:
        "We make reasonable efforts to keep website information useful and current, but information may occasionally contain errors, omissions or become outdated. Website content is provided for general information and does not constitute a guarantee that every page, service, document or feature will always be available or error-free.",
    },
    {
      id: "external-links",
      icon: <FaExternalLinkAlt />,
      title: "8. External Links & Third-Party Services",
      content:
        "The website may link to external websites, portals or services for convenience, including services used for payments, documents, forms or other activities. Such third-party services operate under their own terms and policies. Swastik Srijan Foundation is not responsible for the content, availability or policies of external websites.",
    },
    {
      id: "privacy",
      icon: <FaShieldAlt />,
      title: "9. Privacy & Personal Information",
      content: (
        <>
          Your use of this website may involve the handling of personal information as described in our {" "}
          <Link
            to="/PrivacyPolicy"
            className="text-[#003366] hover:text-[#FF6600] font-bold underline decoration-2 underline-offset-2 transition-colors"
          >
            Privacy Policy
          </Link>
          . Please review that policy for information about collection, use, protection, retention and your available privacy choices.
        </>
      ),
    },
    {
      id: "children",
      icon: <FaChild />,
      title: "10. Children & Educational Activities",
      content:
        "Some Foundation activities may involve education, youth or child-development programs. Where information relating to children is involved, it should be provided only by a parent, guardian, authorized institution or other person legally permitted to provide it, and only for the relevant purpose.",
    },
    {
      id: "security",
      icon: <FaShieldAlt />,
      title: "11. Website Security",
      content:
        "We take reasonable measures to support the security and reliability of the website. However, no internet-based system can be guaranteed to be completely secure or continuously available. Users should also maintain appropriate device, account and password security when using online services.",
    },
    {
      id: "liability",
      icon: <FaExclamationTriangle />,
      title: "12. Limitation of Liability",
      content:
        "To the extent permitted by applicable law, the Foundation will not be responsible for losses arising solely from reliance on incomplete, outdated or temporarily unavailable website information, third-party websites or interruptions beyond our reasonable control. Nothing in these Terms is intended to exclude any liability that cannot lawfully be excluded.",
    },
    {
      id: "updates",
      icon: <FaSyncAlt />,
      title: "13. Changes to These Terms",
      content:
        "We may revise these Terms of Use when our website, activities, services or applicable requirements change. Updated terms will be posted on this page with a revised update date. Your continued use of the website after an update indicates that you have reviewed the revised terms.",
    },
    {
      id: "law",
      icon: <FaGavel />,
      title: "14. Governing Law & Jurisdiction",
      content:
        "These Terms are intended to be governed by the laws applicable in India. Subject to applicable law, disputes relating to the website or these Terms will be handled by the appropriate courts or authorities having jurisdiction.",
    },
  ];

  return (
    <div className="w-full bg-zinc-50 font-inria">
      {/* ================= CODED HERO ================= */}
      <section className="relative overflow-hidden bg-[#06182f] px-4 py-8 sm:px-6 sm:py-10 md:py-14">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:38px_38px]" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#FF6600]/30" />
        <div className="absolute -left-24 bottom-[-180px] h-96 w-96 rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-6xl rounded-[28px] border border-white/20 p-2 shadow-2xl shadow-black/30">
          <div className="relative overflow-hidden rounded-[22px] border border-[#FF6600]/40 bg-white/[0.06] px-5 py-9 sm:px-8 md:px-12 md:py-12">
            <div className="absolute left-0 top-0 h-1 w-32 bg-[#FF6600]" />
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FF6600]/40 bg-[#FF6600]/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff9a5c]">
                  <FaFileContract /> Website Terms
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/10 p-5 sm:p-7">
                  <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
                    Terms <span className="text-[#FF6600]">&</span> Conditions
                  </h1>
                  <p className="mt-4 text-base font-medium leading-relaxed text-zinc-200 sm:text-lg">
                    Please read these terms carefully before using the Swastik Srijan Foundation website.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-base">
                    नियम और शर्तें — हमारी वेबसाइट का उपयोग करने से पहले कृपया इन शर्तों को ध्यान से पढ़ें।
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-zinc-300 sm:text-sm">
                  <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Responsible Use</span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Transparency</span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Legal Awareness</span>
                </div>
              </div>

              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-[#FF6600]/50 bg-[#FF6600]/10 shadow-[0_0_60px_rgba(255,102,0,.12)] sm:h-40 sm:w-40">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/10 text-5xl text-[#FF6600] sm:h-28 sm:w-28 sm:text-6xl">
                  <FaGavel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        {/* ================= INTRODUCTION ================= */}
        <div className="mb-10 rounded-3xl border border-zinc-200 border-l-8 border-l-[#003366] bg-white p-7 shadow-lg sm:p-10">
          <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#FF6600]">Effective for website use</div>
          <h2 className="mb-4 text-2xl font-black text-zinc-900 sm:text-3xl">Welcome to Swastik Srijan Foundation</h2>
          <p className="text-base leading-8 text-zinc-600 sm:text-lg">
            These Terms of Use explain the basic rules governing access to and use of our website and online facilities. They are designed to support responsible use, transparency and respectful interaction with the Foundation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-zinc-600">
            <span className="rounded-full bg-zinc-100 px-4 py-2">India-focused nonprofit website</span>
            <span className="rounded-full bg-zinc-100 px-4 py-2">Responsible digital use</span>
          </div>
        </div>

        {/* ================= SECTIONS ================= */}
        <div className="mb-14 grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.id}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#003366]/40 hover:shadow-xl sm:p-7"
              onMouseEnter={() => setActiveSection(section.id)}
              onMouseLeave={() => setActiveSection(null)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-[#003366] text-white shadow-lg"
                      : "bg-zinc-100 text-[#003366]"
                  }`}
                >
                  {section.icon}
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-black leading-snug text-zinc-900 transition-colors group-hover:text-[#003366] sm:text-xl">
                    {section.title}
                  </h3>
                  <div className="text-sm leading-7 text-zinc-600 sm:text-base">
                    {section.content}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ================= LEGAL NOTE ================= */}
        <div className="mb-10 rounded-2xl border border-[#003366]/15 bg-[#003366]/5 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-xl text-[#FF6600]"><FaGavel /></div>
            <div>
              <h2 className="mb-2 text-xl font-black text-zinc-900">Important Legal Note</h2>
              <p className="text-sm leading-7 text-zinc-600 sm:text-base">
                These Terms are intended to clearly explain website use and are not a substitute for professional legal advice. Where applicable law provides a mandatory right or protection, nothing in these Terms is intended to take that right away.
              </p>
            </div>
          </div>
        </div>

        {/* ================= CONTACT ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 shadow-2xl">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#003366]/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#FF6600]/10 blur-3xl" />
          <div className="relative z-10 p-8 text-center sm:p-12 md:p-14">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#FF6600]/40 bg-[#FF6600]/10 text-2xl text-[#FF6600]">
              <FaEnvelope />
            </div>
            <h2 className="mb-3 text-2xl font-black text-white sm:text-3xl">Questions about our Terms?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              If you have a question about these Terms of Use or a website-related concern, please contact the Foundation through the official contact details below.
            </p>

            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-left">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-500">Official Email</p>
                <p className="break-all text-base font-bold text-white">{CONTACT_INFO.primaryEmail}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-left">
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-500">Official Contact</p>
                <p className="text-base font-bold text-white">{CONTACT_INFO.phones.primaryFormatted}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/PrivacyPolicy"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-zinc-200 transition hover:border-[#FF6600]/50 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                to="/Transparency"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-zinc-200 transition hover:border-[#FF6600]/50 hover:text-white"
              >
                Transparency & Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
