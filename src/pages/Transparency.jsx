import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaFileContract, FaBalanceScale, FaHandHoldingUsd, FaFileAlt, FaLock, FaEnvelope, FaGavel, FaExternalLinkAlt, FaShieldAlt } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import PageHero from "../components/PageHero";

const documents = [
    {
        title: "Registration / Legal Identity",
        hindi: "पंजीकरण एवं कानूनी पहचान",
        status: "Registered Since 2013",
        description: "Official registration record of Swastik Srijan Foundation Samiti.",
        href: "https://drive.google.com/file/d/1mvFn14TYtG-tiiE5_spHrUClTls1-Ii-/view?usp=sharing"
    },
    {
        title: "12AB Registration",
        hindi: "12AB पंजीकरण",
        status: "Registered",
        description: "Income Tax statutory registration record available for public verification.",
        href: "https://drive.google.com/file/d/1MVtgKePT2WNTSrF1vrjrDIdrCZ6HaNrS/view?usp=drivesdk"
    },
    {
        title: "80G Status",
        hindi: "80G स्थिति",
        status: "Final Approval Applied",
        description: "Current status is presented as application / provisional status and is not described as final approval.",
        href: "https://drive.google.com/file/d/1uUAQuXCkz6H_sEJGgDvSx2Gj_PsIIVvB/view?usp=drivesdk"
    },
    {
        title: "CSR-1 Registration",
        hindi: "CSR-1 पंजीकरण",
        status: "Registered",
        description: "CSR-1 registration record maintained for corporate partnership documentation.",
        href: "https://drive.google.com/file/d/1LdL8_IC3K6f4ZEddb68ki_393QkIBvcX/view?usp=drivesdk"
    },
    {
        title: "NGO Darpan",
        hindi: "एनजीओ दर्पण",
        status: "Registered",
        description: "NGO Darpan registration record shared for transparency and verification.",
        href: "https://drive.google.com/file/d/15OX155DuYsymGQmEKCcoux1FGES_DSLH/view?usp=sharing"
    },
    {
        title: "Audited Accounts",
        hindi: "ऑडिटेड खाते",
        status: "Audit Records",
        description: "Audited financial records are maintained as part of the Foundation's accountability practices.",
        href: "https://drive.google.com/file/d/1ka7G73eU1SamorxUJivAJKldnOuNIdZU/view?usp=sharing"
    },
    {
        title: "PAN Verification",
        hindi: "PAN सत्यापन",
        status: "Verified PAN Record",
        description: "PAN identity documentation is maintained for statutory and financial records.",
        href: "https://drive.google.com/file/d/1RkC1uHQRBSBqTbUv_H20Ri0sgcQ2zlmT/view?usp=sharing"
    }
];

const reports = [
    { title: "Annual Activity Reports", hindi: "वार्षिक गतिविधि रिपोर्ट", note: "Available upon request" },
    { title: "Program Highlights", hindi: "कार्यक्रम प्रमुख झलकियाँ", note: "Available upon request" },
    { title: "Financial Summaries", hindi: "वित्तीय सारांश", note: "Available upon request" },
    { title: "Impact Reports", hindi: "प्रभाव रिपोर्ट", note: "Available upon request" }
];

const policies = [
    { title: "Privacy Policy", path: "/PrivacyPolicy" },
    { title: "Terms of Use", path: "/TermsAndConditions" },
    { title: "Donation & Refund Policy", path: "/DonationRefundPolicy" },
    { title: "Memorandum & Rules", path: "/MemorandumAndRules" }
];

export default function Transparency() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "Commitment to Transparency",
            hindi: "पारदर्शिता के प्रति हमारी प्रतिबद्धता",
            icon: <FaLock />,
            content: [
                "Transparency is a core value of Swastik Srijan Foundation. We believe that openness in operations, finances, and reporting builds trust and strengthens our commitment to social responsibility.",
                "We ensure that our governance, financial practices, and program implementation are conducted with integrity, responsibility, and openness."
            ]
        },
        {
            title: "Legal & Registration Details",
            hindi: "कानूनी और पंजीकरण विवरण",
            icon: <FaGavel />,
            content: [
                "Swastik Srijan Foundation is a registered non-profit organization operating in accordance with applicable laws and regulations."
            ],
            details: [
                { label: "Registration Act", value: "Madhya Pradesh Societies Registration Act, 1973" },
                { label: "Registration Number", value: "05/22/03/11448/13" },
                { label: "Year of Registration", value: "2013" },
                { label: "Nature of Organization", value: "Non-Profit / Voluntary Organization" },
                { label: "Registered Office", value: "Rewa, Madhya Pradesh" },
                { label: "Area of Work", value: "Across India" }
            ]
        },
        {
            title: "Governance & Compliance",
            hindi: "शासन और अनुपालन",
            icon: <FaBalanceScale />,
            content: [
                "The foundation is governed by its duly constituted Governing Body, which oversees policy decisions, compliance, and strategic direction.",
                "All activities are carried out in alignment with the organization’s rules, regulations, and objectives."
            ]
        },
        {
            title: "Financial Transparency",
            hindi: "वित्तीय पारदर्शिता",
            icon: <FaHandHoldingUsd />,
            content: [
                "Swastik Srijan Foundation follows responsible financial management practices to ensure that resources are utilized effectively and ethically.",
                "Financial information and reports are maintained to reflect the proper use of funds in support of our programs and initiatives."
            ]
        },
        {
            title: "Ethical Practices",
            hindi: "नैतिक व्यवहार",
            icon: <FaFileContract />,
            content: [
                "Swastik Srijan Foundation adheres to ethical practices, fairness, and accountability in all interactions.",
                "We uphold principles of honesty, non-discrimination, and respect for human dignity in our work."
            ]
        }
    ];

    return (
        <div className="w-full font-inria bg-white overflow-hidden text-[#002344]">
            <PageHero
                image="/images/real/academy-board-compliance.jpg"
                title="Transparency & Compliance"
                subtitle="Building trust through openness, accountability, documented compliance, and responsible governance."
                hindiSubtitle="पारदर्शिता, जवाबदेही, दस्तावेज़ी अनुपालन और जिम्मेदार शासन के माध्यम से विश्वास का निर्माण।"
            />

            <section className="py-20 px-6 max-w-5xl mx-auto space-y-20">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-col md:flex-row gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="md:w-1/3 flex justify-center md:block">
                            <div className="w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-4xl text-[#fb8500] shadow-sm">
                                {section.icon}
                            </div>
                        </div>
                        <div className="md:w-2/3 space-y-6">
                            <div className="space-y-4 text-lg text-zinc-600 leading-relaxed font-medium">
                                <h2 className="text-3xl font-serif font-bold mb-2 text-[#002344]">{section.title}</h2>
                                <p className="text-lg text-[#fb8500] font-serif font-bold italic mb-4">{section.hindi}</p>
                                {section.content.map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                            {section.details && (
                                <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-100 mt-6 grid gap-4">
                                    {section.details.map((detail, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-zinc-200 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{detail.label}</span>
                                            <span className="font-bold text-[#002344] mt-1 sm:mt-0">{detail.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </section>

            <section className="py-20 bg-[#f8fafc] border-y border-zinc-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 text-[#fb8500] text-xs font-black uppercase tracking-widest shadow-sm">
                            <FaShieldAlt /> Documentary Transparency
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold mt-5 text-[#002344]">Certificates & Compliance</h2>
                        <p className="text-zinc-500 mt-4 leading-relaxed">Key statutory and organizational records are shared for public reference. Document links open the records maintained by the Foundation.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc, idx) => (
                            <motion.div
                                key={doc.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: idx * 0.04 }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-xl hover:border-[#fb8500]/40 transition-all flex flex-col"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#002344]/5 text-[#002344] flex items-center justify-center text-xl">
                                        <FaFileContract />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-[#c65f00] border border-orange-100">{doc.status}</span>
                                </div>
                                <h3 className="text-xl font-bold mt-5 text-[#002344]">{doc.title}</h3>
                                <p className="text-sm text-[#fb8500] font-semibold mt-1">{doc.hindi}</p>
                                <p className="text-sm text-zinc-500 leading-relaxed mt-4 flex-1">{doc.description}</p>
                                <a
                                    href={doc.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#002344] text-white px-4 py-3 text-sm font-bold hover:bg-[#fb8500] transition-colors"
                                >
                                    View Document <FaExternalLinkAlt className="text-xs" />
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    <p className="text-center text-xs text-zinc-400 mt-8">For document verification or clarification, please contact the Foundation using the official contact details below.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#002344]">Reports & Disclosures</h2>
                        <p className="text-[#fb8500] font-serif font-bold italic mt-2">रिपोर्ट एवं सार्वजनिक प्रकटीकरण</p>
                        <p className="text-zinc-500 max-w-2xl mx-auto mt-4">Annual activities, program highlights, financial summaries and impact documentation are maintained as part of the Foundation’s transparency practices.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {reports.map((report, idx) => (
                            <motion.div key={idx} whileHover={{ y: -5 }} className="bg-zinc-50 p-8 rounded-2xl shadow-sm border border-zinc-100 hover:border-[#fb8500] transition-all group">
                                <div className="w-14 h-14 mx-auto bg-blue-50 text-[#002344] rounded-full flex items-center justify-center text-2xl mb-6 group-hover:bg-[#fb8500] group-hover:text-white transition-colors">
                                    <FaFileAlt />
                                </div>
                                <h3 className="text-xl font-bold text-[#002344]">{report.title}</h3>
                                <p className="text-sm text-[#fb8500] font-semibold mt-1">{report.hindi}</p>
                                <p className="text-sm text-zinc-400 mt-3">{report.note}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-zinc-50 border-y border-zinc-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold text-[#002344]">Policies & Public Documents</h2>
                        <p className="text-[#fb8500] font-serif font-bold italic mt-2">नीतियाँ और सार्वजनिक दस्तावेज़</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {policies.map((policy) => (
                            <a key={policy.path} href={policy.path} className="bg-white rounded-xl border border-zinc-200 px-5 py-5 text-sm font-bold text-[#002344] hover:border-[#fb8500] hover:text-[#fb8500] transition-all shadow-sm">
                                {policy.title} <span className="float-right">→</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#002344] text-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <FaEnvelope className="mx-auto text-[#fb8500] text-3xl mb-5" />
                    <h2 className="text-3xl font-serif font-bold">Document Verification & Requests</h2>
                    <p className="text-zinc-300 mt-4 leading-relaxed">For clarification, document verification, or reports not currently displayed online, please contact the Foundation. Information is shared in good faith to support transparency and public trust.</p>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(CONTACT_INFO.primaryEmail);
                            alert("Email copied to clipboard!");
                        }}
                        className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb8500] text-white font-bold hover:bg-[#ff9800] transition-colors"
                    >
                        {CONTACT_INFO.primaryEmail}
                    </button>
                </div>
            </section>
        </div>
    );
}
