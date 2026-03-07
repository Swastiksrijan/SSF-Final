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

export default function CSRPartnership() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const benefits = [
        {
            icon: <FaChartLine />,
            title: "Measurable Impact",
            description: "We provide detailed impact reports with quantifiable metrics, ensuring you see the exact value of your contribution."
        },
        {
            icon: <FaFileContract />,
            title: "Tax Exemption",
            description: "All contributions are eligible for 50% tax exemption under Section 80G of the Income Tax Act, 1961."
        },
        {
            icon: <FaGlobeAsia />,
            title: "Grassroots Reach",
            description: "Our deep connection with rural communities ensures your CSR funds reach the most marginalized beneficiaries."
        },
        {
            icon: <FaHandshake />,
            title: "End-to-End Compliance",
            description: "We are fully compliant with CSR-1, 12A, and all NGO regulations, offering a hassle-free partnership experience."
        }
    ];

    const registrationDetails = [
        { label: "Legal Name", value: "Swastik Srijan Foundation Samiti" },
        { label: "Status", value: "Registered Non-Governmental Organization (NGO)" },
        { label: "Act", value: "Madhya Pradesh Societies Registration Act, 1973" },
        { label: "Registration No.", value: "11448/13" },
        { label: "Registration Date", value: "30/12/2013" },
        { label: "Registered Office", value: CONTACT_INFO.address.fullRegistered },
        { label: "CSR-1 Registration", value: "Available & Compliant" },
        { label: "12A & 80G", value: "Certified" },
    ];

    return (
        <div className="w-full font-sans bg-white overflow-hidden">

            {/* ================= HERO SECTION ================= */}
            <PageHero
                image="/images/uploads/community-banner.jpg"
                title="Corporate Partnership"
                subtitle="Partner with Swastik Srijan Foundation to create deep, lasting social impact."
                hindiSubtitle="सीएसआर से आगे, दिलों का जुड़ाव ला सकता है दुनिया में बदलाव।"
            />

            {/* ================= WHY PARTNER (BENEFITS) ================= */}
            <section id="benefits" className="py-24 px-6 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-serif font-bold text-[#002344] mb-4">Why Partner with SSF?</h2>
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
                                <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-3xl text-[#003366] mb-6 group-hover:bg-[#fb8500] group-hover:text-white transition-colors duration-300">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#002344] mb-3">{benefit.title}</h3>
                                <p className="text-zinc-500 leading-relaxed font-medium">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= TAX & COMPLIANCE SECTION ================= */}
            <section className="py-24 px-6 bg-[#001529] text-white relative overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fb8500]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#004d99]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <h2 className="text-4xl font-serif font-bold mb-6">
                            Maximize Impact,<br /> <span className="text-[#fb8500]">Optimize Taxes.</span>
                        </h2>
                        <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                            Partnering with Swastik Srijan Foundation not only helps you fulfill your corporate social responsibility but also provides tangible financial benefits through tax exemptions.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-[#fb8500] flex items-center justify-center text-xl font-bold">
                                    %
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">80G Tax Exemption</h4>
                                    <p className="text-zinc-400 text-sm">Donors receive a 50% tax deduction on their contributed amount under Section 80G.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-[#2d6a4f] flex items-center justify-center text-xl font-bold">
                                    <FaCheckCircle />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">CSR-1 Compliant</h4>
                                    <p className="text-zinc-400 text-sm">We are registered with the Ministry of Corporate Affairs (MCA) for undertaking CSR activities.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Details Card */}
                    <div className="bg-white text-[#002344] p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-zinc-100 pb-4">
                            <FaBuilding className="text-[#fb8500]" /> Registration Details
                        </h3>
                        <div className="space-y-4">
                            {registrationDetails.map((item, i) => (
                                <div key={i} className="flex flex-col sm:flex-row sm:justify-between text-sm sm:items-center py-2 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 px-2 rounded-lg transition-colors">
                                    <span className="font-bold text-zinc-500 w-1/3">{item.label}</span>
                                    <span className="font-semibold text-[#002344] sm:text-right flex-1">{item.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">Verified & Trusted</p>
                            <div className="flex justify-center gap-4 text-2xl text-[#003366]">
                                <FaFileContract title="12A Registered" />
                                <FaHandshake title="CSR-1 Compliant" />
                                <FaCheckCircle title="NGO Darpan" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CERTIFICATIONS ================= */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-[#002344] mb-4">Recognitions & Certifications</h2>
                    <p className="text-xl text-zinc-500">Endorsed by national bodies for transparency and integrity.</p>
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
                            <h3 className="text-xl font-bold text-[#002344]">PM CARES Contribution</h3>
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
                            <h3 className="text-xl font-bold text-[#002344]">Integrity Pledge</h3>
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
                            <h3 className="text-xl font-bold text-[#002344]">All India Registered</h3>
                            <p className="text-zinc-500 mt-2 text-sm">Operational scope covering all of India, registered under MP Society Act.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= SOCIAL IMPACT ================= */}
            <section className="py-24 px-6 bg-zinc-50">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-[#002344] mb-4">Focus Areas for CSR</h2>
                    <p className="text-xl text-zinc-500">Align your CSR goals with our key initiatives.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { title: "Education", count: "5000+", label: "Students Impacted", img: "bg-gradient-to-br from-blue-400 to-blue-600" },
                        { title: "Healthcare", count: "100+", label: "Medical Camps", img: "bg-gradient-to-br from-green-400 to-green-600" },
                        { title: "Women Empowerment", count: "2000+", label: "Women Trained", img: "bg-gradient-to-br from-purple-400 to-purple-600" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className={`p-10 rounded-[2rem] text-white shadow-xl ${stat.img} relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <h3 className="text-2xl font-bold mb-2">{stat.title}</h3>
                            <div className="text-5xl font-black mb-1">{stat.count}</div>
                            <p className="font-medium opacity-90">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
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
                <div className="max-w-5xl mx-auto bg-[#001529] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                    <div className="p-12 md:p-16 md:w-1/2 flex flex-col justify-center relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <h2 className="text-4xl font-serif font-bold text-white mb-6 relative z-10">
                            Ready to create an impact?
                        </h2>
                        <p className="text-zinc-400 text-lg mb-8 relative z-10">
                            Connect with our CSR relations team to discuss proposals, site visits, or collaboration opportunities.
                        </p>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-4 text-white">
                                <div className="w-10 h-10 rounded-full bg-[#fb8500] flex items-center justify-center">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1 opacity-60">Corporate Inquiry</p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(CONTACT_INFO.primaryEmail);
                                            alert("Email copied to clipboard!");
                                        }}
                                        className="text-lg font-semibold text-white hover:text-[#fb8500] transition-colors cursor-pointer outline-none border-b border-white/10 hover:border-[#fb8500] pb-1"
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
                                                    className="text-xs text-zinc-400 font-medium hover:text-[#fb8500] transition-colors cursor-pointer outline-none"
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
                                                    className="text-xs text-zinc-400 font-medium hover:text-[#fb8500] transition-colors cursor-pointer outline-none"
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
                                <div className="w-10 h-10 rounded-full bg-[#fb8500] flex items-center justify-center">
                                    <FaPhoneAlt />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">Call Us</p>
                                    <p className="font-bold">{CONTACT_INFO.phones.primaryFormatted}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 md:p-16 md:w-1/2 bg-white">
                        <form className="space-y-6">
                            <h3 className="text-2xl font-bold text-[#002344] mb-4">Request a Proposal</h3>
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-2">Company Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20 outline-none transition-all" placeholder="Enter company name" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-2">Phone / Email</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20 outline-none transition-all" placeholder="How can we reach you?" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-500 mb-2">Interest Area</label>
                                <select className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20 outline-none transition-all">
                                    <option>General CSR</option>
                                    <option>Education</option>
                                    <option>Healthcare</option>
                                    <option>Skill Development</option>
                                </select>
                            </div>
                            <button className="w-full py-4 bg-[#002344] text-white font-bold rounded-xl hover:bg-[#003366] transition-colors shadow-lg">
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    );
}
