import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaFileContract, FaBalanceScale, FaHandHoldingUsd, FaFileAlt, FaLock, FaEnvelope, FaGavel, FaDownload, FaEye } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import PageHero from "../components/PageHero";

const REPORT_TYPES = [
    "Audit Report",
    "Balance Sheet",
    "Income & Expenditure",
    "Activity Summary"
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
                { label: "Nature of Organization", value: "Non-Profit / Voluntary Organization" }
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

    const currentYear = new Date().getFullYear();

    const years = useMemo(() => {
        const entries = [];

        for (let year = currentYear; year >= 2014; year -= 1) {
            const allOnRequest = year <= 2021;
            const scanAvailable = [2022, 2023, 2024, 2025].includes(year);

            entries.push({
                year,
                auditStatus: scanAvailable ? "Audit scan received (PDF upload pending)" : "Available upon request",
                docs: REPORT_TYPES.map((name) => ({
                    name,
                    status: allOnRequest
                        ? "On request"
                        : name === "Audit Report" && scanAvailable
                            ? "Scan available"
                            : "On request",
                    available: false,
                    href: null
                }))
            });
        }

        return entries;
    }, [currentYear]);

    const requestLink = (year, docName) =>
        `mailto:${CONTACT_INFO.primaryEmail}?subject=${encodeURIComponent(`${year} ${docName} Request`)}&body=${encodeURIComponent(`Namaste,\n\nPlease share the ${docName} for FY ${year}-${year + 1}.\n\nRegards`)}`;

    return (
        <div className="w-full font-inria bg-white overflow-hidden text-[#002344]">
            <PageHero
                image="/images/real/academy-board-compliance.jpg"
                title="Transparency & Reports"
                subtitle="Building trust through openness, accountability, and ethical governance."
                hindiSubtitle="पारदर्शिता और रिपोर्ट - खुलेपन, जवाबदेही और नैतिक शासन के माध्यम से विश्वास का निर्माण।"
            />

            <section className="py-20 px-6 max-w-5xl mx-auto space-y-20">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-col md:flex-row gap-8 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                    >
                        <div className="md:w-1/3 flex justify-center md:block">
                            <div className="w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-4xl text-[#fb8500] shadow-sm">
                                {section.icon}
                            </div>
                        </div>
                        <div className="md:w-2/3 space-y-6">
                            <div className="space-y-4 text-lg text-zinc-600 leading-relaxed font-medium">
                                <h2 className="text-3xl font-serif font-bold mb-2 text-[#002344]">{section.title}</h2>
                                {section.hindi && (
                                    <p className="text-lg text-[#fb8500] font-serif font-bold italic mb-4">{section.hindi}</p>
                                )}
                                {section.content.map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
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

            <section className="py-20 bg-zinc-50 border-y border-zinc-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold">Financial Transparency / Audit Reports</h2>
                        <p className="text-zinc-600 text-lg">
                            Year-wise document access from 2014 to present. For 2014-2021 and documents marked “On request”,
                            click View/Download and our team will share official copies.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {years.map((entry) => (
                            <details key={entry.year} className="bg-white border border-zinc-100 rounded-2xl shadow-sm open:shadow-md transition-all">
                                <summary className="cursor-pointer list-none p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-[#002344]">FY {entry.year}-{entry.year + 1}</h3>
                                        <p className="text-sm text-zinc-500 mt-1">{entry.auditStatus}</p>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#fb8500] bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                                        4 Documents
                                    </span>
                                </summary>

                                <div className="px-6 pb-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {entry.docs.map((doc) => (
                                            <div key={`${entry.year}-${doc.name}`} className="border border-zinc-100 rounded-xl p-4 bg-zinc-50/50">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-bold text-[#002344]">{doc.name}</p>
                                                        <p className="text-xs text-zinc-500 mt-1">Status: {doc.status}</p>
                                                    </div>
                                                    <FaFileAlt className="text-[#fb8500] text-lg shrink-0" />
                                                </div>

                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    <a
                                                        href={doc.available ? doc.href : requestLink(entry.year, doc.name)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-[#002344] text-white hover:bg-[#fb8500] transition-colors"
                                                    >
                                                        <FaEye /> View Report
                                                    </a>
                                                    <a
                                                        href={doc.available ? doc.href : requestLink(entry.year, doc.name)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        download={doc.available}
                                                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-zinc-300 text-zinc-700 hover:border-[#fb8500] hover:text-[#fb8500] transition-colors"
                                                    >
                                                        <FaDownload /> Download PDF
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-zinc-500 mb-6 italic">
                            Information provided on this page is shared in good faith to maintain transparency and public trust.
                        </p>
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3 text-[#fb8500] font-semibold">
                                <FaEnvelope className="text-sm opacity-80" />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(CONTACT_INFO.primaryEmail);
                                        alert("Email copied to clipboard!");
                                    }}
                                    className="hover:underline transition-all cursor-pointer outline-none md:text-lg"
                                >
                                    {CONTACT_INFO.primaryEmail}
                                </button>
                            </div>
                            <div className="pt-4 border-t border-zinc-200/60 space-y-3">
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(CONTACT_INFO.secondaryEmail);
                                            alert("Email copied!");
                                        }}
                                        className="text-[11px] text-zinc-500 font-semibold hover:text-[#fb8500] transition-colors cursor-pointer outline-none"
                                    >
                                        {CONTACT_INFO.secondaryEmail}
                                    </button>
                                    <span className="text-[7px] font-black bg-zinc-50 text-zinc-400 px-2 py-1 rounded border border-zinc-200 uppercase tracking-widest">
                                        {CONTACT_INFO.techIssueNote}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(CONTACT_INFO.backupEmail);
                                            alert("Email copied!");
                                        }}
                                        className="text-[11px] text-zinc-500 font-semibold hover:text-[#fb8500] transition-colors cursor-pointer outline-none"
                                    >
                                        {CONTACT_INFO.backupEmail}
                                    </button>
                                    <span className="text-[7px] font-black bg-zinc-50 text-zinc-400 px-2 py-1 rounded border border-zinc-200 uppercase tracking-widest">
                                        {CONTACT_INFO.techIssueNote}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
