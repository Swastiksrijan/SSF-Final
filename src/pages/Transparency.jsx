import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaFileContract, FaBalanceScale, FaHandHoldingUsd, FaFileAlt, FaLock, FaEnvelope, FaGavel, FaExternalLinkAlt, FaShieldAlt, FaCheckCircle, FaBuilding, FaChartLine } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";

const documents = [
    { title: "Registration / Legal Identity", hindi: "पंजीकरण एवं कानूनी पहचान", status: "Registered Since 2013", description: "Official registration record of Swastik Srijan Foundation Samiti.", href: "https://drive.google.com/file/d/1mvFn14TYtG-tiiE5_spHrUClTls1-Ii-/view?usp=sharing" },
    { title: "12AB Registration", hindi: "12AB पंजीकरण", status: "Registered", description: "Income Tax statutory registration record available for public verification.", href: "https://drive.google.com/file/d/1MVtgKePT2WNTSrF1vrjrDIdrCZ6HaNrS/view?usp=drivesdk" },
    { title: "80G Status", hindi: "80G स्थिति", status: "Final Approval Applied", description: "Current status is presented as application / provisional status and is not described as final approval.", href: "https://drive.google.com/file/d/1uUAQuXCkz6H_sEJGgDvSx2Gj_PsIIVvB/view?usp=drivesdk" },
    { title: "CSR-1 Registration", hindi: "CSR-1 पंजीकरण", status: "Registered", description: "CSR-1 registration record maintained for corporate partnership documentation.", href: "https://drive.google.com/file/d/1LdL8_IC3K6f4ZEddb68ki_393QkIBvcX/view?usp=drivesdk" },
    { title: "NGO Darpan", hindi: "एनजीओ दर्पण", status: "Registered", description: "NGO Darpan registration record shared for transparency and verification.", href: "https://drive.google.com/file/d/15OX155DuYsymGQmEKCcoux1FGES_DSLH/view?usp=sharing" },
    { title: "Audited Accounts", hindi: "ऑडिटेड खाते", status: "Audit Records", description: "Audited financial records are maintained as part of the Foundation's accountability practices.", href: "https://drive.google.com/file/d/1ka7G73eU1SamorxUJivAJKldnOuNIdZU/view?usp=sharing" },
    { title: "PAN Verification", hindi: "PAN सत्यापन", status: "Verified PAN Record", description: "PAN identity documentation is maintained for statutory and financial records.", href: "https://drive.google.com/file/d/1RkC1uHQRBSBqTbUv_H20Ri0sgcQ2zlmT/view?usp=sharing" }
];

const annualReports = [
    { year: "2013–14", href: "https://drive.google.com/file/d/1dRT8fkKgxHhPdiiiHmz8DA0ZSUYWTDDi/view?usp=drivesdk" },
    { year: "2014–15", href: "https://drive.google.com/file/d/1D1Ak2S__z4yrZQ4ctR0qczBHdJtBcGkm/view?usp=drivesdk" },
    { year: "2015–16", href: "https://drive.google.com/file/d/1JxbRRc3v-LAy-iBeDVO11nPuYmedy_76/view?usp=drivesdk" },
    { year: "2016–17", href: "https://drive.google.com/file/d/1A75HkUwGyTAUzS2IrtJgv3zByw6OyrKK/view?usp=drivesdk" },
    { year: "2017–18", href: "https://drive.google.com/file/d/1JlFCdN7dGRLAK3NXZa1WlaRV6PBRjSaJ/view?usp=drivesdk" },
    { year: "2018–19", href: "https://drive.google.com/file/d/1u_ewjd6MUhARR_g35PRCQQX12TpmZd_F/view?usp=drivesdk" },
    { year: "2019–20", href: "https://drive.google.com/file/d/1ogaIch6vpZXL7SDGRYokdm0ARdzif5Od/view?usp=drivesdk" },
    { year: "2020–21", href: "https://drive.google.com/file/d/1osL_PaieAjLxLPK9lX52aNj4Gk51jgBg/view?usp=drivesdk" },
    { year: "2021–22", href: "https://drive.google.com/file/d/1FolHQb41PjtJDbbJxDK4tz8xgEgh2744/view?usp=drivesdk" },
    { year: "2022–23", href: "https://drive.google.com/file/d/19aC8NZ0q0-yjUxhOgJLzQFES7IIrh4tq/view?usp=drivesdk" },
    { year: "2023–24", href: "https://drive.google.com/file/d/18U4BtmY2N7nBC7mVUZ__UEzit1Lx2kUA/view?usp=drivesdk" },
    { year: "2024–25", href: "https://drive.google.com/file/d/1CymtYEy3BiUOpUn-enpIqyrsMbqunkRm/view?usp=drivesdk" },
    { year: "2025–26", href: "https://drive.google.com/file/d/1tftxk1SfpHwMSifNUhnxeenw7dfizjDW/view?usp=drivesdk" }
];

const reports = [
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

const sections = [
    { title: "Commitment to Transparency", hindi: "पारदर्शिता के प्रति हमारी प्रतिबद्धता", icon: <FaLock />, content: ["Transparency is a core value of Swastik Srijan Foundation. We believe that openness in operations, finances, and reporting builds trust and strengthens our commitment to social responsibility.", "We ensure that our governance, financial practices, and program implementation are conducted with integrity, responsibility, and openness."] },
    { title: "Legal & Registration Details", hindi: "कानूनी और पंजीकरण विवरण", icon: <FaGavel />, content: ["Swastik Srijan Foundation is a registered non-profit organization operating in accordance with applicable laws and regulations."], details: [
        { label: "Registration Act", value: "Madhya Pradesh Societies Registration Act, 1973" },
        { label: "Registration Number", value: "05/22/03/11448/13" },
        { label: "Year of Registration", value: "2013" },
        { label: "Nature of Organization", value: "Non-Profit / Voluntary Organization" },
        { label: "Registered Office", value: "Rewa, Madhya Pradesh" },
        { label: "Area of Work", value: "Across India" }
    ] },
    { title: "Governance & Compliance", hindi: "शासन और अनुपालन", icon: <FaBalanceScale />, content: ["The foundation is governed by its duly constituted Governing Body, which oversees policy decisions, compliance, and strategic direction.", "All activities are carried out in alignment with the organization’s rules, regulations, and objectives."] },
    { title: "Financial Transparency", hindi: "वित्तीय पारदर्शिता", icon: <FaHandHoldingUsd />, content: ["Swastik Srijan Foundation follows responsible financial management practices to ensure that resources are utilized effectively and ethically.", "Financial information and reports are maintained to reflect the proper use of funds in support of our programs and initiatives."] },
    { title: "Ethical Practices", hindi: "नैतिक व्यवहार", icon: <FaFileContract />, content: ["Swastik Srijan Foundation adheres to ethical practices, fairness, and accountability in all interactions.", "We uphold principles of honesty, non-discrimination, and respect for human dignity in our work."] }
];

export default function Transparency() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="w-full font-inria bg-white overflow-hidden text-[#002344]">
            {/* Coded page hero: no separate image file required, so it stays sharp and lightweight on every device. */}
            <section className="relative min-h-[430px] lg:min-h-[500px] overflow-hidden bg-[#001a33] text-white flex items-center">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
                <div className="absolute -top-28 -right-24 w-96 h-96 rounded-full bg-[#fb8500]/25 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl" />
                <div className="absolute right-[8%] top-[18%] hidden lg:block w-72 h-72 rounded-full border border-white/10 rotate-12" />
                <div className="absolute right-[10%] top-[22%] hidden lg:block w-56 h-56 rounded-[40px] border border-[#fb8500]/30 rotate-12 bg-white/[.03] backdrop-blur-sm" />
                <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                    <div className="max-w-3xl">
                        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black tracking-[.18em] uppercase text-orange-200 backdrop-blur-md">
                            <FaShieldAlt /> Documentary Transparency
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .08 }} className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                            Transparency <span className="text-[#fb8500]">&amp;</span> Compliance
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .16 }} className="mt-4 text-lg lg:text-xl text-slate-200 leading-relaxed max-w-2xl">
                            Building trust through openness, accountability, documented compliance, and responsible governance.
                        </motion.p>
                        <p className="mt-3 text-base text-orange-200 font-serif font-bold italic">पारदर्शिता, जवाबदेही, दस्तावेज़ी अनुपालन और जिम्मेदार शासन के माध्यम से विश्वास का निर्माण।</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md"><span className="block text-2xl font-black">2013</span><span className="text-xs text-slate-300">Registered Since</span></div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md"><span className="block text-2xl font-black">13</span><span className="text-xs text-slate-300">Annual Reports</span></div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md"><span className="block text-2xl font-black">7</span><span className="text-xs text-slate-300">Key Records</span></div>
                        </div>
                    </div>
                    <div className="hidden lg:flex absolute right-8 bottom-12 w-44 h-44 rounded-[34px] border border-white/10 bg-white/[.05] backdrop-blur-md items-center justify-center rotate-6 shadow-2xl">
                        <div className="w-28 h-28 rounded-full border-2 border-[#fb8500]/60 flex items-center justify-center -rotate-6"><FaShieldAlt className="text-5xl text-[#fb8500]" /></div>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-20 px-6 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-6 mb-16">
                    {sections.map((section, idx) => (
                        <motion.div key={section.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .45, delay: idx * .04 }} className={`rounded-3xl border border-zinc-200 bg-white p-7 lg:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all ${idx === 1 ? 'lg:row-span-2' : ''}`}>
                            <div className="flex items-start gap-5">
                                <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#002344]/5 border border-[#002344]/10 flex items-center justify-center text-2xl text-[#fb8500]">{section.icon}</div>
                                <div className="min-w-0">
                                    <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#002344]">{section.title}</h2>
                                    <p className="text-[#fb8500] font-serif font-bold italic mt-1">{section.hindi}</p>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4 text-zinc-600 leading-relaxed font-medium">{section.content.map((p, i) => <p key={i}>{p}</p>)}</div>
                            {section.details && <div className="mt-7 rounded-2xl bg-zinc-50 border border-zinc-200 p-5 space-y-3">{section.details.map((detail, i) => <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-zinc-200 pb-3 last:border-0 last:pb-0"><span className="text-xs font-black uppercase tracking-wider text-zinc-500">{detail.label}</span><span className="font-bold text-[#002344] text-sm sm:text-right">{detail.value}</span></div>)}</div>}
                        </motion.div>
                    ))}
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-[#002344] to-[#063b63] text-white p-8 lg:p-10 relative overflow-hidden mb-16">
                    <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-white/10" />
                    <div className="relative grid md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-2"><p className="text-xs font-black uppercase tracking-[.2em] text-orange-200">Our transparency standard</p><h2 className="text-2xl lg:text-3xl font-serif font-bold mt-3">Evidence first. Clear records. Responsible governance.</h2><p className="text-slate-300 mt-3 leading-relaxed">Statutory records, annual reports and public documents are presented separately so visitors can verify information without searching through the website.</p></div>
                        <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 border border-white/10 p-4"><FaCheckCircle className="text-[#fb8500]" /><p className="mt-2 font-bold">Documented</p></div><div className="rounded-2xl bg-white/10 border border-white/10 p-4"><FaChartLine className="text-[#fb8500]" /><p className="mt-2 font-bold">Year-wise</p></div></div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[#f8fafc] border-y border-zinc-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center max-w-3xl mx-auto mb-12"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 text-[#fb8500] text-xs font-black uppercase tracking-widest shadow-sm"><FaShieldAlt /> Documentary Transparency</div><h2 className="text-3xl lg:text-4xl font-serif font-bold mt-5 text-[#002344]">Certificates &amp; Compliance</h2><p className="text-zinc-500 mt-4 leading-relaxed">Key statutory and organizational records are shared for public reference. Document links open the records maintained by the Foundation.</p></div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{documents.map((doc, idx) => <motion.div key={doc.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .35, delay: idx * .04 }} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-xl hover:border-[#fb8500]/40 transition-all flex flex-col"><div className="flex items-start justify-between gap-4"><div className="w-12 h-12 rounded-xl bg-[#002344]/5 text-[#002344] flex items-center justify-center text-xl"><FaFileContract /></div><span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-[#c65f00] border border-orange-100">{doc.status}</span></div><h3 className="text-xl font-bold mt-5 text-[#002344]">{doc.title}</h3><p className="text-sm text-[#fb8500] font-semibold mt-1">{doc.hindi}</p><p className="text-sm text-zinc-500 leading-relaxed mt-4 flex-1">{doc.description}</p><a href={doc.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#002344] text-white px-4 py-3 text-sm font-bold hover:bg-[#fb8500] transition-colors">View Document <FaExternalLinkAlt className="text-xs" /></a></motion.div>)}</div>
                    <p className="text-center text-xs text-zinc-400 mt-8">For document verification or clarification, please contact the Foundation using the official contact details below.</p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center max-w-3xl mx-auto mb-12"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-[#c65f00] text-xs font-black uppercase tracking-widest"><FaFileAlt /> Year-wise record</div><h2 className="text-3xl lg:text-4xl font-serif font-bold mt-5 text-[#002344]">Annual Reports / वार्षिक प्रतिवेदन</h2><p className="text-zinc-500 mt-4 leading-relaxed">Year-wise annual reports of the Foundation are provided below for public reference and transparency.</p></div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">{annualReports.map((report, idx) => <motion.div key={report.year} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .3, delay: idx * .03 }} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm hover:shadow-xl hover:border-[#fb8500]/50 transition-all flex flex-col"><div className="w-12 h-12 rounded-xl bg-[#002344]/5 text-[#002344] flex items-center justify-center text-xl"><FaFileAlt /></div><h3 className="text-2xl font-bold mt-5 text-[#002344]">{report.year}</h3><p className="text-sm text-[#fb8500] font-semibold mt-1">वार्षिक प्रतिवेदन</p><a href={report.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#002344] text-white px-4 py-3 text-sm font-bold hover:bg-[#fb8500] transition-colors">View Report <FaExternalLinkAlt className="text-xs" /></a></motion.div>)}</div>
                </div>
            </section>

            <section className="py-20 bg-[#f8fafc] border-y border-zinc-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12"><h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#002344]">Reports &amp; Disclosures</h2><p className="text-[#fb8500] font-serif font-bold italic mt-2">रिपोर्ट एवं सार्वजनिक प्रकटीकरण</p><p className="text-zinc-500 max-w-2xl mx-auto mt-4">Program highlights, financial summaries and impact documentation are maintained as part of the Foundation’s transparency practices.</p></div>
                    <div className="grid md:grid-cols-3 gap-6">{reports.map((report, idx) => <motion.div key={idx} whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 hover:border-[#fb8500] transition-all group"><div className="w-14 h-14 mx-auto bg-blue-50 text-[#002344] rounded-full flex items-center justify-center text-2xl mb-6 group-hover:bg-[#fb8500] group-hover:text-white transition-colors"><FaFileAlt /></div><h3 className="text-xl font-bold text-[#002344]">{report.title}</h3><p className="text-sm text-[#fb8500] font-semibold mt-1">{report.hindi}</p><p className="text-sm text-zinc-400 mt-3">{report.note}</p></motion.div>)}</div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl"><div className="text-center mb-10"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-200 text-[#fb8500] text-xs font-black uppercase tracking-widest"><FaBuilding /> Public documents</div><h2 className="text-3xl font-serif font-bold text-[#002344] mt-5">Policies &amp; Public Documents</h2><p className="text-[#fb8500] font-serif font-bold italic mt-2">नीतियाँ और सार्वजनिक दस्तावेज़</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{policies.map((policy) => <a key={policy.path} href={policy.path} className="bg-white rounded-xl border border-zinc-200 px-5 py-5 text-sm font-bold text-[#002344] hover:border-[#fb8500] hover:text-[#fb8500] transition-all shadow-sm">{policy.title} <span className="float-right">→</span></a>)}</div></div>
            </section>

            <section className="py-16 bg-[#002344] text-white"><div className="container mx-auto px-6 max-w-4xl text-center"><FaEnvelope className="mx-auto text-[#fb8500] text-3xl mb-5" /><h2 className="text-3xl font-serif font-bold">Document Verification &amp; Requests</h2><p className="text-zinc-300 mt-4 leading-relaxed">For clarification, document verification, or reports not currently displayed online, please contact the Foundation. Information is shared in good faith to support transparency and public trust.</p><button onClick={() => { navigator.clipboard.writeText(CONTACT_INFO.primaryEmail); alert("Email copied to clipboard!"); }} className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb8500] text-white font-bold hover:bg-[#ff9800] transition-colors">{CONTACT_INFO.primaryEmail}</button></div></section>
        </div>
    );
}
