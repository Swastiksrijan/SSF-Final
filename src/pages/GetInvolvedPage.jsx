import { motion } from "framer-motion";
import { FaHandHoldingHeart, FaUsers, FaHeart, FaWhatsapp, FaArrowRight, FaHandsHelping, FaAward, FaUniversity, FaHandshake } from "react-icons/fa";
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

    return (
        <div className="w-full bg-white font-sans text-zinc-900 overflow-hidden">
            {/* ================= HERO ================= */}
            <section className="relative w-full h-[60vh] overflow-hidden pt-20">
                <img
                    src="/images/real/ssf_event_members.jpg"
                    alt="Get Involved"
                    className="w-full h-full object-cover"
                />
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
                            <img src="/images/real/children-playing-park.jpg" alt="Children Unity" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
