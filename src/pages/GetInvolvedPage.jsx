import { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaWhatsapp, FaArrowRight, FaHandsHelping, FaAward, FaHandshake, FaTimes } from "react-icons/fa";
import PageHero from "../components/PageHero";
import VolunteerForm from "../components/VolunteerForm";
import MemberForm from "../components/MemberForm";
import GetInvolvedInterestForm from "../components/GetInvolvedInterestForm";
import { CONTACT_INFO } from "../config/contact";
import pageHeader from "../assets/page-header.jpg";

export default function GetInvolvedPage() {
    const [activeForm, setActiveForm] = useState(null);
    const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

    const roles = [
        { id: "volunteer", title: "Volunteer for India", titleHi: "भारत के लिए स्वयंसेवक", desc: "Join our on-ground force. Give your time and skills to build a better nation.", icon: <FaHandsHelping className="text-[#FF6600]" />, color: "border-orange-100 bg-orange-50/50", btnText: "Join as Volunteer" },
        { id: "member", title: "Become a Member", titleHi: "सदस्य बनें", desc: "Be a part of the institution. Shape our governance, philosophy and future.", icon: <FaAward className="text-[#002344]" />, color: "border-blue-100 bg-blue-50/50", btnText: "Become a Member" },
        { id: "movement", title: "Join the Nation-Building Movement", titleHi: "राष्ट्र निर्माण आंदोलन", desc: "Connect with us on digital platforms. Stay updated and spread the word.", icon: <FaUsers className="text-green-600" />, color: "border-green-100 bg-green-50/50", btnText: "Join the Movement" },
        { id: "partner", title: "Partner with the Mission", titleHi: "मिशन के साथ भागीदार", desc: "CSR, Institutional alliances, and collaborations for sustainable impact.", icon: <FaHandshake className="text-[#002344]" />, color: "border-purple-100 bg-purple-50/50", btnText: "Partner With Us" }
    ];

    const openForm = (id) => { setActiveForm(id); document.body.style.overflow = "hidden"; };
    const closeForm = () => { setActiveForm(null); document.body.style.overflow = ""; };

    return (
        <div className="w-full bg-white font-sans text-zinc-900 overflow-hidden">
            <PageHero image={pageHeader} title="Get Involved" subtitle="Join our mission to transform lives and build a better Bharat." hindiSubtitle="राष्ट्र निर्माण के इस पावन लक्ष्य में अपना योगदान दें।" height="h-[40vh] md:h-[60vh]" overlayOpacity="bg-black/40" />

            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {roles.map((role, i) => (
                            <motion.div key={role.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6 } } }} className={`p-10 rounded-[3rem] border-2 ${role.color} flex flex-col h-full hover:shadow-2xl transition-all duration-500 group`}>
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm mb-8 group-hover:scale-110 transition-transform">{role.icon}</div>
                                <h3 className="text-2xl font-bold text-[#002344] mb-2">{role.title}</h3>
                                <h4 className="text-lg font-hindi text-zinc-500 mb-6 font-bold">{role.titleHi}</h4>
                                <p className="text-zinc-600 leading-relaxed mb-8 font-medium flex-grow">{role.desc}</p>
                                <button type="button" onClick={() => openForm(role.id)} className="w-full flex items-center justify-center gap-3 bg-[#002344] text-white py-4 rounded-2xl font-bold hover:bg-[#FF6600] transition-colors shadow-lg">
                                    {role.btnText}<FaArrowRight />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-zinc-50 border-y border-zinc-100 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white p-10 md:p-16 rounded-[4rem] shadow-xl border border-zinc-200">
                        <div className="inline-block px-6 py-2 bg-zinc-100 rounded-full text-zinc-400 font-bold uppercase tracking-widest text-xs mb-8">🔒 CLARITY NOTE</div>
                        <h2 className="text-3xl font-bold text-[#002344] mb-8">Every role is unique</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100"><p className="font-bold text-[#FF6600]">Volunteer</p><p className="text-zinc-400 text-sm mt-1">Gives Time & Skills</p></div>
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100"><p className="font-bold text-[#002344]">Member</p><p className="text-zinc-400 text-sm mt-1">Gives Direction</p></div>
                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100"><p className="font-bold text-red-500">Supporter</p><p className="text-zinc-400 text-sm mt-1">Gives Resources</p></div>
                        </div>
                        <p className="mt-10 text-xl font-hindi text-zinc-500">हर role अलग है • कोई overlap नहीं • User खुद decide करता है।</p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-[#002344]">Life at SSF | <span className="text-[#FF6600]">एक झलक</span></h2><p className="text-zinc-500 mt-4 text-lg">See the impact you'll be part of. Our community is built on joy, learning, and unity.</p></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 rounded-[3rem] overflow-hidden shadow-xl h-[400px]"><img src="/images/children-unity-park.jpg" alt="Children Unity" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                        <div className="rounded-[3rem] overflow-hidden shadow-xl h-[400px]"><img src="/images/slum-outreach-children.jpg" alt="Slum Outreach" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                        <div className="rounded-[3rem] overflow-hidden shadow-xl h-[400px]"><img src="/images/classroom-mat-session.jpg" alt="Classroom Session" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                        <div className="rounded-[3rem] overflow-hidden shadow-xl h-[400px]"><img src="/images/rural-children-raising-hands.jpg" alt="Rural Children" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                        <div className="rounded-[3rem] overflow-hidden shadow-xl h-[400px]"><img src="/images/slum-area-outreach.jpg" alt="Outreach Efforts" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6"><div className="max-w-5xl mx-auto text-center"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-br from-[#25D366] to-[#128C7E] p-10 md:p-20 rounded-[4rem] text-white shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 p-10 opacity-10"><FaWhatsapp size={200} /></div><div className="relative z-10 space-y-8"><h2 className="text-4xl md:text-6xl font-black">Join our <br /> WhatsApp Community</h2><h3 className="text-2xl font-hindi opacity-90">जुड़ाव और संवाद</h3><p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">Get real-time updates, event invitations, impact stories, and volunteer calls directly on your phone.</p><a href={CONTACT_INFO.social.whatsappGroup} target="_blank" rel="noreferrer" className="inline-block pt-6"><span className="inline-block bg-white text-[#25D366] px-14 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-xl">👉 Join WhatsApp Community</span></a></div></motion.div></div></section>

            {activeForm && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center" role="dialog" aria-modal="true">
                    <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl">
                        <button type="button" onClick={closeForm} aria-label="Close form" className="sticky top-4 float-right mr-4 z-20 w-11 h-11 rounded-full bg-white/95 border border-zinc-200 text-zinc-600 flex items-center justify-center shadow-lg hover:text-red-600 hover:scale-105 transition-all"><FaTimes /></button>
                        <div className="clear-both">
                            {activeForm === "volunteer" && <VolunteerForm />}
                            {activeForm === "member" && <MemberForm />}
                            {(activeForm === "movement" || activeForm === "partner") && <GetInvolvedInterestForm type={activeForm} onClose={closeForm} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
