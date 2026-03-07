import { motion } from "framer-motion";
import { FaHandHoldingHeart, FaUsers, FaHeart, FaWhatsapp, FaArrowRight, FaHandsHelping, FaAward, FaUniversity, FaHandshake, FaEnvelope, FaPhoneAlt, FaChartPie, FaCheckCircle } from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import { CONTACT_INFO } from "../config/contact";

export default function GetInvolvedPage() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const roles = [
        {
            id: "volunteer",
            title: "Volunteer for India",
            titleHi: "भारत के लिए स्वयंसेवक",
            desc: "Join our on-ground force. Give your time and skills to build a better nation.",
            icon: <FaHandsHelping className="text-[#FF6600]" />,
            path: "/Volunteer",
            color: "border-orange-100 bg-orange-50/50",
            btnText: "Join as Volunteer"
        },
        {
            id: "member",
            title: "Become a Member",
            titleHi: "सदस्य बनें",
            desc: "Be a part of the institution. Shape our governance, philosophy and future.",
            icon: <FaAward className="text-[#002344]" />,
            path: "/Members",
            color: "border-blue-100 bg-blue-50/50",
            btnText: "Become a Member"
        },
        {
            id: "movement",
            title: "Join the Nation-Building Movement",
            titleHi: "राष्ट्र निर्माण आंदोलन",
            desc: "Connect with us on digital platforms. Stay updated and spread the word.",
            icon: <FaUsers className="text-green-600" />,
            path: "/Contact", // Or link to WhatsApp section if possible, or Contact
            color: "border-green-100 bg-green-50/50",
            btnText: "Join the Movement"
        },
        {
            id: "partner",
            title: "Partner with the Mission",
            titleHi: "मिशन के साथ भागीदार",
            desc: "CSR, Institutional alliances, and collaborations for sustainable impact.",
            icon: <FaHandshake className="text-[#002344]" />,
            path: "/PartnerWithUs",
            color: "border-purple-100 bg-purple-50/50",
            btnText: "Partner With Us"
        }
    ];



    const quickActions = [
        {
            title: "Volunteer",
            icon: <FaHandsHelping className="text-[#fb8500]" />,
            description: "Contribute your time and skills through teaching, outreach, logistics, and campaign support.",
            button: "Volunteer Now",
            to: "/Volunteer",
            image: "/images/classroom-mat-session.jpg",
        },
        {
            title: "Partner",
            icon: <FaHandshake className="text-[#002344]" />,
            description: "Collaborate through CSR, institutional partnerships, and strategic initiatives for scalable impact.",
            button: "Partner With Us",
            to: "/PartnerWithUs",
            image: "/images/community-team-group.jpg",
        },
        {
            title: "Donate",
            icon: <FaHeart className="text-[#d90429]" />,
            description: "Support education, health, women empowerment, and community programs through direct giving.",
            button: "Donate Now",
            to: "/Donate",
            image: "/images/real/nutrition_program.jpg",
        },
    ];

    const impactPreview = [
        { value: "50,000+", label: "Lives Impacted" },
        { value: "120+", label: "Villages Reached" },
        { value: "500+", label: "Active Volunteers" },
        { value: "40+", label: "Programs Active" },
    ];

    const volunteerTypes = ["Teaching & Mentoring", "Health Camp Support", "Event Coordination", "Digital & Creative Support"];
    const partnerAreas = ["Education Programs", "Skill Development", "Healthcare Outreach", "Community Infrastructure"];
    const donationDistribution = [
        { label: "Education", value: 45, color: "#1d4ed8" },
        { label: "Health", value: 25, color: "#ef4444" },
        { label: "Women Empowerment", value: 20, color: "#f59e0b" },
        { label: "Environment", value: 10, color: "#16a34a" },
    ];

    const donationPie = `conic-gradient(${donationDistribution.map((item, index) => `${item.color} ${donationDistribution.slice(0, index).reduce((a, c) => a + c.value, 0)}% ${donationDistribution.slice(0, index + 1).reduce((a, c) => a + c.value, 0)}%`).join(", ")})`;

    const getInvolvedTestimonials = [
        {
            quote: "Volunteering with SSF gave me a meaningful way to serve children in nearby communities.",
            author: "Volunteer, Rewa",
        },
        {
            quote: "Our partnership with SSF helped us deliver measurable social outcomes with transparency.",
            author: "CSR Partner",
        },
        {
            quote: "Donating here feels impactful because we can see real outcomes on the ground.",
            author: "Supporter, Delhi NCR",
        },
    ];

    return (
        <div className="w-full bg-white font-sans text-zinc-900 overflow-hidden">
            {/* ================= HERO ================= */}
            <section className="relative w-full h-[60vh] overflow-hidden pt-20">
                <img
                    src="/images/real/children-mat-session.jpg"
                    alt="Get Involved"
                    className="w-full h-full object-cover"
                />
            </section>



            {/* ================= HEADER + TAGLINE ================= */}
            <section className="py-12 md:py-16 px-6 bg-white border-b border-zinc-100">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-[#002344]">Get Involved With Us — Be the change</h1>
                    <p className="mt-4 text-zinc-600 text-lg max-w-3xl mx-auto">Choose your path to create measurable impact through volunteering, partnerships, or donations.</p>
                </div>
            </section>

            {/* ================= THREE ACTION CARDS ================= */}
            <section className="py-16 px-6 bg-zinc-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {quickActions.map((item, idx) => (
                            <motion.article
                                key={item.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.07 }}
                                className="rounded-3xl overflow-hidden border border-zinc-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                <div className="h-44 overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="p-6">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-2xl mb-3">{item.icon}</div>
                                    <h3 className="text-2xl font-bold text-[#002344]">{item.title}</h3>
                                    <p className="text-zinc-600 mt-2 leading-relaxed">{item.description}</p>
                                    <Link to={item.to} className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#002344] text-white font-bold hover:bg-[#FF6600] transition-colors">
                                        {item.button} <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= DETAILED ACTION SECTIONS ================= */}
            <section className="py-16 px-6 bg-white border-y border-zinc-100">
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="grid lg:grid-cols-2 gap-8 rounded-3xl border border-zinc-100 p-6 md:p-8">
                        <div>
                            <h3 className="text-3xl font-serif font-bold text-[#002344]">Volunteer</h3>
                            <p className="text-zinc-600 mt-3">Join field and digital initiatives by contributing your time and expertise.</p>
                            <ul className="mt-4 space-y-2 text-zinc-700">
                                {volunteerTypes.map((item) => <li key={item} className="flex items-center gap-2"><FaCheckCircle className="text-[#fb8500]" /> {item}</li>)}
                            </ul>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <Link to="/Volunteer" className="px-5 py-3 rounded-xl bg-[#fb8500] text-white font-bold hover:bg-[#e76f00] transition-colors">Sign Up to Volunteer</Link>
                                <a href="https://forms.gle/S6Qc56QE8nLYdDTL9" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-xl border border-zinc-200 font-semibold text-[#002344] hover:bg-zinc-50">Quick Volunteer Form</a>
                            </div>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-zinc-100">
                            <img src="/images/slum-outreach-children.jpg" alt="Volunteer action" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 rounded-3xl border border-zinc-100 p-6 md:p-8 bg-zinc-50">
                        <div className="rounded-2xl overflow-hidden border border-zinc-100 order-2 lg:order-1">
                            <img src="/images/community-team-group.jpg" alt="Partnership" className="w-full h-full object-cover" />
                        </div>
                        <div className="order-1 lg:order-2">
                            <h3 className="text-3xl font-serif font-bold text-[#002344]">Partner / CSR</h3>
                            <p className="text-zinc-600 mt-3">Create scalable, transparent, and measurable impact through partnership and CSR collaboration.</p>
                            <ul className="mt-4 space-y-2 text-zinc-700">
                                {partnerAreas.map((item) => <li key={item} className="flex items-center gap-2"><FaCheckCircle className="text-[#002344]" /> {item}</li>)}
                            </ul>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <Link to="/PartnerWithUs" className="px-5 py-3 rounded-xl bg-[#002344] text-white font-bold hover:bg-[#001a33] transition-colors">Partner With Us</Link>
                                <a href="https://forms.gle/ZjhgFc4By2RKnQbi8" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-xl border border-zinc-200 font-semibold text-[#002344] hover:bg-white">Partner Inquiry Form</a>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 rounded-3xl border border-zinc-100 p-6 md:p-8">
                        <div>
                            <h3 className="text-3xl font-serif font-bold text-[#002344]">Donate</h3>
                            <p className="text-zinc-600 mt-3">Support recurring and one-time donations with transparent fund use across core programs.</p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <Link to="/Donate" className="px-5 py-3 rounded-xl bg-[#d90429] text-white font-bold hover:bg-[#b30321] transition-colors">Donate Now</Link>
                                <a href={CONTACT_INFO.social.razorpay} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-xl border border-zinc-200 font-semibold text-[#002344] hover:bg-zinc-50">Quick Donate</a>
                            </div>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl border border-zinc-100 p-6">
                            <div className="flex items-center gap-2 mb-4"><FaChartPie className="text-[#fb8500]" /><p className="font-bold text-[#002344]">Fund Usage (Indicative)</p></div>
                            <div className="flex items-center gap-6">
                                <div className="w-32 h-32 rounded-full" style={{ background: donationPie }}></div>
                                <div className="space-y-2">
                                    {donationDistribution.map((d) => (
                                        <div key={d.label} className="flex items-center gap-2 text-sm">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                                            <span className="font-semibold text-zinc-700">{d.label}</span>
                                            <span className="text-zinc-500">{d.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= IMPACT PREVIEW ================= */}
            <section className="py-16 px-6 bg-zinc-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">Impact Preview</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {impactPreview.map((item) => (
                            <div key={item.label} className="rounded-2xl bg-white border border-zinc-100 p-5 text-center hover:shadow-md transition-shadow">
                                <p className="text-2xl md:text-3xl font-black text-[#002344]">{item.value}</p>
                                <p className="text-sm text-zinc-500 mt-1">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= TESTIMONIALS ================= */}
            <section className="py-16 px-6 bg-white border-y border-zinc-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">Voices of Participation</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {getInvolvedTestimonials.map((item, idx) => (
                            <blockquote key={idx} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
                                <p className="text-zinc-700 italic">“{item.quote}”</p>
                                <p className="mt-3 text-sm font-semibold text-[#fb8500]">— {item.author}</p>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= THREE PATHS GRID ================= */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {roles.map((role, i) => (
                            <motion.div
                                key={role.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6 } }
                                }}
                                className={`p-10 rounded-[3rem] border-2 ${role.color} flex flex-col h-full hover:shadow-2xl transition-all duration-500 group`}
                            >
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm mb-8 group-hover:scale-110 transition-transform">
                                    {role.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-[#002344] mb-2">{role.title}</h3>
                                <h4 className="text-lg font-hindi text-zinc-500 mb-6 font-bold">{role.titleHi}</h4>
                                <p className="text-zinc-600 leading-relaxed mb-8 font-medium flex-grow">
                                    {role.desc}
                                </p>
                                <div className="space-y-3">
                                    <Link to={role.path}>
                                        <button className="w-full flex items-center justify-center gap-3 bg-[#002344] text-white py-4 rounded-2xl font-bold hover:bg-[#FF6600] transition-colors group/btn shadow-lg">
                                            {role.btnText}
                                            <FaArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                                        </button>
                                    </Link>

                                    {(role.id === "volunteer" || role.id === "partner") && (
                                        <a
                                            href={role.id === "volunteer" ? "https://forms.gle/S6Qc56QE8nLYdDTL9" : "https://forms.gle/ZjhgFc4By2RKnQbi8"}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block"
                                        >
                                            <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#002344] text-[#002344] py-3 rounded-xl font-bold hover:bg-zinc-50 transition-colors text-sm">
                                                Apply via Google Form
                                            </button>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= DETAILED FLOW / NOTE ================= */}
            <section className="py-24 bg-zinc-50 border-y border-zinc-100 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="bg-white p-10 md:p-16 rounded-[4rem] shadow-xl border border-zinc-200"
                    >
                        <div className="inline-block px-6 py-2 bg-zinc-100 rounded-full text-zinc-400 font-bold uppercase tracking-widest text-xs mb-8">
                            🔒 CLARITY NOTE (IMPORTANT)
                        </div>
                        <h2 className="text-3xl font-bold text-[#002344] mb-8">Every role is unique</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                                <p className="font-bold text-[#FF6600]">Volunteer</p>
                                <p className="text-zinc-400 text-sm mt-1">Gives Time & Skills</p>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="font-bold text-[#002344]">Member</p>
                                <p className="text-zinc-400 text-sm mt-1">Gives Direction</p>
                            </div>
                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                <p className="font-bold text-red-500">Supporter</p>
                                <p className="text-zinc-400 text-sm mt-1">Gives Resources</p>
                            </div>
                        </div>
                        <p className="mt-10 text-xl font-hindi text-zinc-500">हर role अलग है • कोई overlap नहीं • User खुद decide करता है।</p>
                    </motion.div>
                </div>
            </section>

            {/* ================= VIBRANCY GALLERY (NEW) ================= */}
            <section className="py-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#002344]">Life at SSF | <span className="text-[#FF6600]">एक झलक</span></h2>
                        <p className="text-zinc-500 mt-4 text-lg">See the impact you'll be part of. Our community is built on joy, learning, and unity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 rounded-[3rem] overflow-hidden shadow-xl h-[400px]">
                            <img src="/images/children-unity-park.jpg" alt="Children Unity" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="rounded-[3rem] overflow-hidden shadow-xl h-[400px]">
                            <img src="/images/slum-outreach-children.jpg" alt="Slum Outreach" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="rounded-[3rem] overflow-hidden shadow-xl h-[400px]">
                            <img src="/images/classroom-mat-session.jpg" alt="Classroom Session" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="rounded-[3rem] overflow-hidden shadow-xl h-[400px]">
                            <img src="/images/rural-children-raising-hands.jpg" alt="Rural Children" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="rounded-[3rem] overflow-hidden shadow-xl h-[400px]">
                            <img src="/images/slum-area-outreach.jpg" alt="Outreach Efforts" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= WHATSAPP COMMUNITY ================= */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-10 md:p-20 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
                            <FaWhatsapp size={200} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black">Join our <br /> WhatsApp Community</h2>
                            <h3 className="text-2xl font-hindi opacity-90 font-normal">जुड़ाव और संवाद</h3>
                            <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">
                                Get real-time updates, event invitations, impact stories, and volunteer calls directly on your phone.
                            </p>
                            <div className="pt-6">
                                <a href={CONTACT_INFO.social.whatsappGroup} target="_blank" rel="noreferrer">
                                    <button className="bg-white text-[#25D366] px-14 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-xl">
                                        👉 Join WhatsApp Community
                                    </button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>



            {/* ================= CONTACT CTA ================= */}
            <section className="py-16 px-6 bg-[#001529] text-white">
                <div className="max-w-5xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold">Need Help Choosing How to Get Involved?</h2>
                    <p className="text-zinc-300">Reach out and our team will guide you to the best path for volunteering, partnering, or donating.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href={`mailto:${CONTACT_INFO.primaryEmail}`} className="px-6 py-3 rounded-xl bg-white text-[#002344] font-bold inline-flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors">
                            <FaEnvelope /> {CONTACT_INFO.primaryEmail}
                        </a>
                        <a href={`tel:${CONTACT_INFO.phones.primary}`} className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 font-bold inline-flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                            <FaPhoneAlt /> {CONTACT_INFO.phones.primaryFormatted}
                        </a>
                        <a href={CONTACT_INFO.social.whatsapp} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold inline-flex items-center justify-center gap-2 hover:brightness-95 transition-all">
                            <FaWhatsapp /> WhatsApp Us
                        </a>
                    </div>
                </div>
            </section>

            {/* ================= USER FLOW STEPS ================= */}
            <section className="py-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-zinc-400 font-bold tracking-widest uppercase text-xs">🧭 USER FLOW (PERFECT)</p>
                        <h2 className="text-4xl font-bold mt-4">The Journey of Participation</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Visitor", desc: "Arrives at the foundation portal" },
                            { step: "02", title: "Understand", desc: "Learns about our vision and impact" },
                            { step: "03", title: "Choose", desc: "Reflects and selects a suitable role" },
                            { step: "04", title: "Action", desc: "Takes a clear step to get involved" }
                        ].map((s, i) => (
                            <div key={i} className="relative p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 flex flex-col items-center text-center">
                                <div className="text-5xl font-black text-[#FF6600]/10 absolute top-6 right-6 select-none">
                                    {s.step}
                                </div>
                                <div className="w-12 h-12 bg-[#002344] text-white rounded-full flex items-center justify-center font-bold mb-6">
                                    {i + 1}
                                </div>
                                <h4 className="text-xl font-bold text-[#002344] mb-2">{s.title}</h4>
                                <p className="text-zinc-500 font-medium text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
