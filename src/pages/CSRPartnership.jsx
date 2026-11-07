import { useEffect } from "react";
import { motion } from "framer-motion";
import {
    FaHandshake,
    FaChartLine,
    FaFileContract,
    FaGlobeAsia,
    FaBuilding,
    FaCheckCircle,
    FaEnvelope,
    FaPhoneAlt
} from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import profilePdf from "../assets/Swastik Srijan Profile 2026.pdf";
import PageHero from "../components/PageHero";
import { Field, Input, Select, SubmitButton } from "../components/forms/FormUI";

export default function CSRPartnership() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const benefits = [
        {
            icon: <FaChartLine />,
            title: "Measurable Impact",
            description: "We aim to share available project records, utilisation details and outcome updates in a clear, responsible manner. Reporting will reflect verified information."
        },
        {
            icon: <FaFileContract />,
            title: "Tax Exemption",
            description: "The final 80G approval application was submitted in July 2026 and is pending confirmation. The earlier provisional approval covered AY 2024–25 through AY 2026–27. Confirm current eligibility before claiming any deduction; tax treatment depends on the approval in force and applicable law."
        },
        {
            icon: <FaGlobeAsia />,
            title: "Grassroots Reach",
            description: "Partnerships can help develop and support community-focused projects, subject to local needs assessment, resources and implementation readiness."
        },
        {
            icon: <FaHandshake />,
            title: "End-to-End Compliance",
            description: "The Foundation maintains CSR-1 and 12AB registration records. Each proposed project and partnership remains subject to applicable law, due diligence and written agreement."
        }
    ];

    const registrationDetails = [
        { label: "Legal Name", value: "Swastik Srijan Foundation Samiti" },
        { label: "Status", value: "Registered Non-Governmental Organization (NGO)" },
        { label: "Act", value: "Madhya Pradesh Societies Registration Act, 1973" },
        { label: "Registration No.", value: "05/22/03/11448/13" },
        { label: "Registration Date", value: "30/12/2013" },
        { label: "Registered Office", value: CONTACT_INFO.address.fullRegistered },
        { label: "CSR-1 Registration", value: "Registered (document available for due diligence)" },
        { label: "12AB Status", value: "Registered (as per current records)" },
        { label: "80G Status", value: "Application submitted; final approval pending" },
    ];

    return (
        <div className="w-full font-sans bg-white overflow-hidden">

            {/* ================= HERO SECTION ================= */}
            <PageHero
                image="/images/uploads/csr-unity.jpg"
                title="Corporate Partnership"
                subtitle="Partner with Swastik Srijan Foundation to create deep, lasting social impact."
                hindiSubtitle="सीएसआर से आगे, दिलों का जुड़ाव ला सकता है दुनिया में बदलाव।"
            />

            {/* ================= WHY PARTNER (BENEFITS) ================= */}
            <section id="benefits" className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-serif font-bold text-[#12345A] mb-4">Why Partner with SSF?</h2>
                        <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                            We offer a transparent, compliant, and impactful pathway for your CSR initiatives, ensuring maximum value for society and your brand.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-3xl text-[#12345A] mb-6 group-hover:bg-[#176447] group-hover:text-white transition-colors duration-300">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#12345A] mb-3">{benefit.title}</h3>
                                <p className="text-zinc-500 leading-relaxed font-medium">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= TAX & COMPLIANCE SECTION ================= */}
            <section className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 bg-[#12345A] text-white relative overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#176447]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#12345A]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <h2 className="text-4xl font-serif font-bold mb-6">
                            Partner for Impact,<br /> <span className="text-[#176447]">Build Trust.</span>
                        </h2>
                        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                            Partnering with Swastik Srijan Foundation can support documented community-development outcomes and transparent reporting. Any tax treatment depends on the applicable approval status, the nature of the contribution and current law.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-[#176447] flex items-center justify-center text-xl font-bold">
                                    <FaCheckCircle />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">80G Status & Donor Eligibility</h4>
                                    <p className="text-zinc-400 text-sm">Final 80G approval application pending confirmation. Please verify current validity and eligibility before claiming any tax deduction.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-[#176447] flex items-center justify-center text-xl font-bold">
                                    <FaCheckCircle />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">CSR-1 Compliant</h4>
                                    <p className="text-zinc-400 text-sm">CSR-1 registration is on record. The company and Foundation should complete applicable eligibility checks and due diligence for each proposed project before execution.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Details Card */}
                    <div className="bg-white text-[#12345A] p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-zinc-100 pb-4">
                            <FaBuilding className="text-[#176447]" /> Registration Details
                        </h3>
                        <div className="space-y-4">
                            {registrationDetails.map((item, i) => (
                                <div key={i} className="flex flex-col sm:flex-row sm:justify-between text-sm sm:items-center py-2 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 px-2 rounded-lg transition-colors">
                                    <span className="font-bold text-zinc-500 w-1/3">{item.label}</span>
                                    <span className="font-semibold text-[#12345A] sm:text-right flex-1">{item.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Registration references</p>
                            <div className="flex justify-center gap-4 text-2xl text-[#12345A]">
                                <FaFileContract title="12A Registered" />
                                <FaHandshake title="CSR-1 Compliant" />
                                <FaCheckCircle title="NGO Darpan" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CERTIFICATIONS ================= */}
            <section className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 bg-white">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-[#12345A] mb-4">Recognitions & Certifications</h2>
                    <p className="text-xl text-zinc-500">Selected records and acknowledgements are displayed for reference.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* PM CARES */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-lg hover:shadow-xl transition-all"
                    >
                        <div className="rounded-2xl overflow-hidden h-64 relative group cursor-pointer">
                            <img
                                src="/images/uploads/pm-cares-cert.jpg"
                                alt="PM CARES Certificate"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        <div className="mt-6 text-center">
                            <h3 className="text-xl font-bold text-[#12345A]">PM CARES Contribution</h3>
                            <p className="text-zinc-500 mt-2 text-sm">Acknowledged for valuable contribution to the Prime Minister's Citizen Assistance Fund.</p>
                        </div>
                    </motion.div>

                    {/* Integrity Pledge */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-lg hover:shadow-xl transition-all"
                    >
                        <div className="rounded-2xl overflow-hidden h-64 relative group cursor-pointer">
                            <img
                                src="/images/uploads/integrity-pledge.jpg"
                                alt="Integrity Pledge Certificate"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        <div className="mt-6 text-center">
                            <h3 className="text-xl font-bold text-[#12345A]">Integrity Pledge</h3>
                            <p className="text-zinc-500 mt-2 text-sm">Committed to upholding the highest standards of integrity and transparency.</p>
                        </div>
                    </motion.div>

                    {/* National Scope Seal */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100 shadow-lg hover:shadow-xl transition-all"
                    >
                        <div className="rounded-2xl overflow-hidden h-64 relative group cursor-pointer flex items-center justify-center bg-white">
                            <img
                                src="/images/uploads/ssf-golden-seal.jpg"
                                alt="SSF All India Registered Seal"
                                className="w-auto h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="mt-6 text-center">
                            <h3 className="text-xl font-bold text-[#12345A]">All India Registered</h3>
                            <p className="text-zinc-500 mt-2 text-sm">The Society's registered area of operation is All India under the MP Societies Registration Act.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= CSR FOCUS AREAS ================= */}
            <section className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 bg-zinc-50">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#12345A] mb-4">Focus Areas for CSR</h2>
                    <p className="text-base sm:text-xl text-zinc-500 max-w-3xl mx-auto">Potential areas for discussion and partnership, based on community needs, available resources and project feasibility.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                    {[
                        { title: "Education & Digital Learning", detail: "Learning support, digital access and capacity building" },
                        { title: "Health & Community Well-being", detail: "Community awareness and support initiatives" },
                        { title: "Women & Youth Development", detail: "Skills, livelihood readiness and participation" },
                        { title: "Environment & Sustainability", detail: "Local environmental awareness and practical action" },
                        { title: "Rural Development", detail: "Community-led development and access to opportunities" },
                        { title: "Sustainable Livelihoods", detail: "Feasibility-led livelihood and income-generation pilots" },
                    ].map((item) => (
                        <div key={item.title} className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[#12345A] mb-2">{item.title}</h3>
                            <p className="text-sm text-zinc-600 leading-relaxed">{item.detail}</p>
                        </div>
                    ))}
                </div>
                <p className="max-w-5xl mx-auto mt-8 text-sm text-zinc-600 text-center leading-relaxed bg-white border border-zinc-200 rounded-xl p-4">
                    Current status: the Foundation is at the resource-mobilisation and project-planning stage. These are proposed focus areas, not a claim that programmes are presently running or that beneficiary targets have already been achieved. Implementation will begin only after funding, needs assessment, approvals and compliance checks.
                </p>
            </section>

            {/* ================= INVITATION BANNER ================= */}
            <section className="py-0 px-6 max-w-7xl mx-auto -mb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
                >
                    <img
                        src="/images/uploads/academy-csr-invitation.jpg"
                        alt="Invitation to CSR Partners"
                        className="w-full h-auto"
                    />
                </motion.div>
            </section>

            {/* ================= CONTACT / CTA ================= */}
            <section id="partner-form" className="pt-24 pb-24 px-6 bg-white">
                <div className="max-w-5xl mx-auto bg-[#12345A] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                    <div className="p-12 md:p-16 md:w-1/2 flex flex-col justify-center relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <h2 className="text-4xl font-serif font-bold text-white mb-6 relative z-10">
                            Ready to create an impact?
                        </h2>
                        <p className="text-zinc-400 text-lg mb-8 relative z-10">
                            Connect with the Foundation to discuss a proposed project, resource support, equipment donation or a potential partnership. All proposals are subject to feasibility, approvals and written agreement.
                        </p>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-4 text-white">
                                <div className="w-10 h-10 rounded-full bg-[#176447] flex items-center justify-center">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1 opacity-60">Corporate Inquiry</p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(CONTACT_INFO.primaryEmail);
                                            alert("Email copied to clipboard!");
                                        }}
                                        className="text-lg font-semibold text-white hover:text-[#176447] transition-colors cursor-pointer outline-none border-b border-white/10 hover:border-[#176447] pb-1"
                                        title="Click to copy"
                                    >
                                        {CONTACT_INFO.primaryEmail}
                                    </button>
                                    <div className="pt-4 border-t border-white/5 mt-4 space-y-3">
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold opacity-60">Alternative Support</p>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(CONTACT_INFO.secondaryEmail);
                                                        alert("Email copied!");
                                                    }}
                                                    className="text-xs text-zinc-400 font-medium hover:text-[#176447] transition-colors cursor-pointer outline-none"
                                                    title="Click to copy"
                                                >
                                                    {CONTACT_INFO.secondaryEmail}
                                                </button>
                                                <span className="text-[7px] font-black bg-white/5 text-zinc-500 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest shadow-sm">
                                                    {CONTACT_INFO.techIssueNote}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(CONTACT_INFO.thirdEmail);
                                                        alert("Email copied!");
                                                    }}
                                                    className="text-xs text-zinc-400 font-medium hover:text-[#176447] transition-colors cursor-pointer outline-none"
                                                    title="Click to copy"
                                                >
                                                    {CONTACT_INFO.thirdEmail}
                                                </button>
                                                <span className="text-[7px] font-black bg-white/5 text-zinc-500 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest shadow-sm">
                                                    {CONTACT_INFO.techIssueNote}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <div className="w-10 h-10 rounded-full bg-[#176447] flex items-center justify-center">
                                    <FaPhoneAlt />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">Call Us</p>
                                    <p className="font-bold">{CONTACT_INFO.phones.primaryFormatted}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 md:p-12 md:w-1/2 bg-white flex flex-col justify-center">
                        <div className="max-w-md mx-auto">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176447] mb-3">Start a conversation</p>
                            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#12345A] mb-4">Discuss a CSR partnership</h3>
                            <p className="text-zinc-600 leading-relaxed mb-7">Please share your organisation's requirement through our main contact form. This keeps enquiries in one place and avoids a form here that cannot reliably submit or track your request.</p>
                            <a href="/Contact" className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-4 rounded-xl bg-[#176447] text-white font-bold hover:bg-[#12345A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#176447] transition-colors">
                                Open Contact Form <FaEnvelope aria-hidden="true" />
                            </a>
                            <p className="text-xs text-zinc-500 mt-4">You can select CSR / Corporate Partnership as your enquiry type.</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
