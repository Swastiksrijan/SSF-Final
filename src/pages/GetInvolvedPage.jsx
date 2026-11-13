import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaWhatsapp, FaArrowRight, FaHandsHelping, FaAward, FaHandshake, FaHeart, FaTimes, FaBullhorn } from "react-icons/fa";
import VolunteerForm from "../components/VolunteerForm";
import heroPhoto1 from "../assets/footer-gallery-1.jpg";
import heroPhoto2 from "../assets/footer-gallery-2.jpg";
import heroPhoto3 from "../assets/footer-gallery-3.jpg";
import MemberForm from "../components/MemberForm";
import GetInvolvedInterestForm from "../components/GetInvolvedInterestForm";
import { CONTACT_INFO } from "../config/contact";

export default function GetInvolvedPage() {
    const [activeForm, setActiveForm] = useState(null);
    const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
    const roles = [
        { id: "volunteer", title: "Volunteer for India", titleHi: "भारत के लिए स्वयंसेवक", desc: "Join our on-ground force. Give your time and skills to build a better nation.", icon: <FaHandsHelping className="text-[#12345A]" />, color: "border-[#EAF0F6] bg-[#EAF0F6]", btnText: "Apply as Volunteer" },
        { id: "member", title: "Become a Member", titleHi: "सदस्य बनें", desc: "Be a part of the institution. Shape our governance, philosophy and future.", icon: <FaAward className="text-[#12345A]" />, color: "border-[#EAF0F6] bg-[#EAF0F6]", btnText: "Apply for Membership" },
        { id: "internship", title: "Join as an Intern", titleHi: "इंटर्न के रूप में जुड़ें", desc: "Gain practical experience while contributing your skills to meaningful social-impact work.", icon: <FaUsers className="text-[#176447]" />, color: "border-[#EAF0F6] bg-[#EAF0F6]", btnText: "Apply for Internship", link: "/Internship" },
        { id: "movement", title: "Join the Nation-Building Movement", titleHi: "राष्ट्र निर्माण आंदोलन", desc: "Connect with us on digital platforms. Stay updated and spread the word.", icon: <FaBullhorn className="text-[#176447]" />, color: "border-[#EAF0F6] bg-[#EAF0F6]", btnText: "Join the Movement" },
        { id: "donor", title: "Become a Donor", titleHi: "दाता बनें", desc: "Support education, health, livelihood and community initiatives through your contribution.", icon: <FaHeart className="text-[#12345A]" />, color: "border-[#EAF0F6] bg-[#EAF0F6]", btnText: "Donate / Become a Donor", link: "/Donate" },
        { id: "partner", title: "Partner with the Mission", titleHi: "मिशन के साथ भागीदार", desc: "CSR, Institutional alliances, and collaborations for sustainable impact.", icon: <FaHandshake className="text-[#12345A]" />, color: "border-[#EAF0F6] bg-[#EAF0F6]", btnText: "Start a Partnership" }
    ];
    const openForm = (id) => { setActiveForm(id); document.body.style.overflow = "hidden"; };
    const closeForm = () => { setActiveForm(null); document.body.style.overflow = ""; };
    useEffect(() => {
        const openRequestedForm = form => { if (["member", "volunteer", "movement", "partner"].includes(form)) openForm(form); };
        const hash = window.location.hash.replace("#", "");
        if (["member", "volunteer", "movement", "partner"].includes(hash)) openRequestedForm(hash);
        const storedForm = sessionStorage.getItem("ssf_getinvolved_form");
        if (storedForm) { sessionStorage.removeItem("ssf_getinvolved_form"); openRequestedForm(storedForm); }
        const handleFormRequest = event => openRequestedForm(event.detail);
        window.addEventListener("ssf-getinvolved-form", handleFormRequest);
        return () => { window.removeEventListener("ssf-getinvolved-form", handleFormRequest); document.body.style.overflow = ""; };
    }, []);
    return <div className="w-full bg-white font-sans text-[#12345A] overflow-hidden">
        <section className="relative isolate min-h-[420px] h-[58vh] max-h-[680px] md:min-h-[560px] overflow-hidden bg-[#092541] px-3 py-3 sm:px-5 sm:py-5">
            <div className="absolute inset-3 sm:inset-5 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 md:grid-cols-4 md:grid-rows-2 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
                <div className="col-span-2 row-span-2 md:col-span-2">
                    <img src={heroPhoto1} alt="Girls learning together in a community study group" className="h-full w-full object-cover" />
                </div>
                <div className="hidden md:block">
                    <img src={heroPhoto2} alt="Community awareness activity" className="h-full w-full object-cover" />
                </div>
                <div className="hidden md:block">
                    <img src={heroPhoto3} alt="Women participating in a community meeting" className="h-full w-full object-cover" />
                </div>
                <div className="col-span-1 md:col-span-1">
                    <img src={heroPhoto1} alt="Community environmental activity" className="h-full w-full object-cover" />
                </div>
                <div className="col-span-1 md:col-span-1">
                    <img src={heroPhoto2} alt="Learning materials being shared" className="h-full w-full object-cover" />
                </div>
            </div>
            <div className="absolute inset-3 sm:inset-5 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-r from-[#07192d]/80 via-[#07192d]/55 to-[#07192d]/35" />
            <div className="relative z-10 flex h-full min-h-[390px] items-center justify-center px-4 text-center sm:min-h-[520px]">
                <div className="max-w-4xl rounded-[1.5rem] border border-white/25 bg-[#092541]/55 px-5 py-8 shadow-2xl backdrop-blur-md sm:rounded-[2rem] sm:px-10 sm:py-10 md:px-14">
                    <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.22em] text-[#F7A814] sm:text-sm">सेवा • सहभागिता • सृजन</p>
                    <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-7xl">Get Involved</h1>
                    <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-white sm:text-lg md:text-xl">Join our mission to transform lives and build a better Bharat.</p>
                    <p className="mx-auto mt-3 max-w-2xl text-base font-bold leading-relaxed text-white/95 sm:text-lg">राष्ट्र निर्माण के इस पावन लक्ष्य में अपना योगदान दें।</p>
                </div>
            </div>
        </section>
        <section className="py-24 px-6"><div className="max-w-7xl mx-auto"><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, i) => <motion.div key={role.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * .12, duration: .5 } } }} className={`p-9 rounded-[2.5rem] border-2 ${role.color} flex flex-col h-full hover:shadow-2xl transition-all duration-500 group`}><div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm mb-7 group-hover:scale-110 transition-transform">{role.icon}</div><h3 className="text-2xl font-bold text-[#12345A] mb-2">{role.title}</h3><h4 className="text-lg font-hindi text-[#26343D] mb-5 font-bold">{role.titleHi}</h4><p className="text-[#26343D] leading-relaxed mb-8 font-medium flex-grow">{role.desc}</p>{role.link?<a href={role.link} className="w-full flex items-center justify-center gap-3 bg-[#12345A] text-white py-4 rounded-2xl font-bold hover:bg-[#176447] hover:text-[#12345A] transition-colors shadow-lg">{role.btnText}<FaArrowRight/></a>:<button type="button" onClick={()=>openForm(role.id)} className="w-full flex items-center justify-center gap-3 bg-[#12345A] text-white py-4 rounded-2xl font-bold hover:bg-[#176447] hover:text-[#12345A] transition-colors shadow-lg">{role.btnText}<FaArrowRight/></button>}</motion.div>)}
        </div></div></section>
        <section className="bg-white px-6 pb-20">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <p className="text-xs font-black uppercase tracking-[.2em] text-[#176447]">Leadership • Coordination • Expertise</p>
                    <h2 className="mt-3 text-3xl font-black text-[#12345A] md:text-4xl">अपनी क्षमता के अनुसार जिम्मेदारी चुनें</h2>
                    <p className="mt-4 text-sm leading-7 text-[#52616D] md:text-base">SSF के कार्यक्षेत्रों और प्रशासनिक आवश्यकताओं के अनुसार विभिन्न स्तरों पर सहयोग एवं समन्वय के अवसर विकसित किए जा सकते हैं। आप अपनी रुचि, अनुभव और उपलब्धता के अनुसार अपनी प्राथमिकता भेज सकते हैं।</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        ["राष्ट्रीय / केंद्रीय समन्वय", "National / Central Coordination", "देश-स्तर पर योजनाओं, संस्थागत साझेदारी और विभिन्न राज्यों के बीच समन्वय में सहयोग।"],
                        ["राज्य समन्वयक", "State Coordinator", "राज्य स्तर पर कार्यक्रमों, स्थानीय नेटवर्क और जिला टीमों के बीच संपर्क व समन्वय।"],
                        ["जिला समन्वयक", "District Coordinator", "जिला स्तर पर जरूरतों की पहचान, स्थानीय संपर्क, गतिविधि योजना और रिपोर्टिंग।"],
                        ["ब्लॉक समन्वयक", "Block Coordinator", "ब्लॉक स्तर पर ग्राम/वार्ड टीमों, स्वयंसेवकों और कार्यक्रम गतिविधियों का समन्वय।"],
                        ["ग्राम / वार्ड समन्वयक", "Village / Ward Coordinator", "समुदाय से संवाद, स्थानीय आवश्यकताओं और स्वीकृत गतिविधियों में सहयोग।"],
                        ["शिक्षा एवं युवा विकास", "Education & Youth Development", "शिक्षक, मेंटर, करियर मार्गदर्शक और विद्यार्थी सहायता गतिविधियों में योगदान।"],
                        ["डिजिटल एवं तकनीकी सहयोग", "Digital & Technology", "कंप्यूटर शिक्षा, वेबसाइट, डेटा प्रबंधन, साइबर जागरूकता और डिजिटल सेवाएँ।"],
                        ["स्वास्थ्य एवं जन-जागरूकता", "Health & Community Well-being", "स्वास्थ्य जागरूकता, शिविर समन्वय और योग्य स्वास्थ्य पेशेवरों से संपर्क।"],
                        ["महिला एवं बाल कल्याण", "Women & Child Welfare", "महिला सहभागिता, बाल सुरक्षा जागरूकता और समुदाय आधारित सहयोग।"],
                        ["कौशल एवं आजीविका", "Skills & Livelihoods", "कौशल प्रशिक्षण, स्थानीय उद्यम, रोजगारोन्मुख मार्गदर्शन और आजीविका पहल।"],
                        ["पर्यावरण एवं ग्रामीण विकास", "Environment & Rural Development", "स्वच्छता, जल संरक्षण, वृक्षारोपण और ग्रामीण विकास गतिविधियों में सहयोग।"],
                        ["प्रशासन, वित्त एवं अनुपालन", "Administration, Finance & Compliance", "दस्तावेजीकरण, लेखा-सहायता, ऑडिट तैयारी, नियम-अनुपालन और कार्यालय प्रबंधन।"],
                        ["संचार एवं जनसंपर्क", "Communication & Public Engagement", "लेखन, मीडिया, डिजाइन, सोशल मीडिया, अभियान और संस्थागत संवाद।"],
                        ["मॉनिटरिंग, मूल्यांकन एवं रिपोर्टिंग", "Monitoring, Evaluation & Reporting", "कार्य प्रगति, परिणाम संकेतक, फील्ड रिपोर्ट और दस्तावेजी प्रमाण संकलन।"],
                        ["कानूनी, CA एवं विशेषज्ञ सलाह", "Legal, CA & Specialist Support", "योग्य अधिवक्ता, चार्टर्ड अकाउंटेंट और विषय-विशेषज्ञों द्वारा आवश्यकता-आधारित परामर्श।"],
                        ["परियोजना / कार्यक्रम प्रबंधन", "Project & Programme Management", "स्वीकृत परियोजनाओं की योजना, टीम समन्वय, समय-सीमा और प्रगति रिपोर्टिंग।"]
                    ].map(([hi,en,desc],i)=><article key={en} className="rounded-3xl border border-[#E3EAF0] bg-[#F8FAFB] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                        <div className="mb-4 flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF0F6] text-sm font-black text-[#176447]">{String(i+1).padStart(2,"0")}</span><span className="text-[10px] font-black uppercase tracking-widest text-[#8A98A4]">Expression of Interest</span></div>
                        <h3 className="text-lg font-black text-[#12345A]">{hi}</h3>
                        <p className="mt-1 text-xs font-bold text-[#176447]">{en}</p>
                        <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#5B6872]">{desc}</p>
                        <a href="/Volunteer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#12345A] hover:text-[#176447]">अपनी रुचि भेजें <FaArrowRight/></a>
                    </article>)}
                </div>
                <div className="mt-9 rounded-3xl border border-amber-200 bg-amber-50 p-6 md:p-8">
                    <h3 className="text-lg font-black text-[#12345A]">महत्वपूर्ण संस्थागत स्पष्टता</h3>
                    <p className="mt-2 text-sm leading-7 text-[#5B6872]">यह सूची संभावित कार्यात्मक जिम्मेदारियों और रुचि आमंत्रण के लिए है, घोषित रिक्तियों या तत्काल नियुक्तियों की सूची नहीं। General Body और Managing Committee सहित संवैधानिक पद नियमावली एवं विधिसम्मत प्रक्रिया के अनुसार ही निर्धारित होंगे। किसी विभाग, राज्य/जिला/ब्लॉक/ग्राम इकाई या समन्वयक की जिम्मेदारी सक्षम प्राधिकारी की लिखित स्वीकृति, नियुक्ति आदेश, निर्धारित कार्यक्षेत्र और उपलब्ध संसाधनों के बाद ही प्रभावी होगी। केवल आवेदन, सदस्यता या स्वयंसेवा से कोई पद, मतदान, प्रतिनिधित्व अथवा वित्तीय अधिकार स्वतः प्राप्त नहीं होता।</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <a href="/Members" className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] px-5 py-3 text-sm font-bold text-white hover:bg-[#176447]">सदस्यता की जानकारी <FaArrowRight/></a>
                        <a href="/Volunteer" className="inline-flex items-center gap-2 rounded-xl border border-[#12345A]/20 bg-white px-5 py-3 text-sm font-bold text-[#12345A] hover:border-[#176447]">स्वयंसेवक आवेदन <FaArrowRight/></a>
                        <a href="/Internship" className="inline-flex items-center gap-2 rounded-xl border border-[#12345A]/20 bg-white px-5 py-3 text-sm font-bold text-[#12345A] hover:border-[#176447]">इंटर्नशिप अवसर <FaArrowRight/></a>
                    </div>
                </div>
            </div>
        </section>
        <section className="py-24 bg-[#EAF0F6] border-y border-[#EAF0F6] px-6"><div className="max-w-4xl mx-auto text-center"><motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp} className="bg-white p-10 md:p-16 rounded-[4rem] shadow-xl border border-[#EAF0F6]"><div className="inline-block px-6 py-2 bg-[#EAF0F6] rounded-full text-[#26343D] font-bold uppercase tracking-widest text-xs mb-8">🔒 CLARITY NOTE</div><h2 className="text-3xl font-bold text-[#12345A] mb-8">Every role is unique</h2><div className="grid md:grid-cols-3 gap-6"><div className="p-6 bg-[#EAF0F6] rounded-2xl border border-[#EAF0F6]"><p className="font-bold text-[#12345A]">Volunteer</p><p className="text-[#26343D] text-sm mt-1">Gives Time & Skills</p></div><div className="p-6 bg-[#EAF0F6] rounded-2xl border border-[#EAF0F6]"><p className="font-bold text-[#12345A]">Member</p><p className="text-[#26343D] text-sm mt-1">Gives Direction</p></div><div className="p-6 bg-[#EAF0F6] rounded-2xl border border-[#EAF0F6]"><p className="font-bold text-[#176447]">Supporter</p><p className="text-[#26343D] text-sm mt-1">Gives Resources</p></div></div><p className="mt-10 text-xl font-hindi text-[#26343D]">हर role अलग है • कोई overlap नहीं • User खुद decide करता है।</p></motion.div></div></section>
        <section className="py-24 px-6"><div className="max-w-5xl mx-auto text-center"><motion.div initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp} className="bg-gradient-to-br from-[#176447] to-[#176447] p-10 md:p-20 rounded-[4rem] text-white shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 p-10 opacity-10"><FaWhatsapp size={200}/></div><div className="relative z-10 space-y-8"><h2 className="text-4xl md:text-6xl font-black">Join our <br/> WhatsApp Community</h2><h3 className="text-2xl font-hindi text-[#EAF0F6]">जुड़ाव और संवाद</h3><p className="text-xl md:text-2xl text-[#EAF0F6] max-w-2xl mx-auto">Get real-time updates, event invitations, impact stories, and volunteer calls directly on your phone.</p><a href={CONTACT_INFO.social.whatsappGroup} target="_blank" rel="noreferrer" className="inline-block pt-6"><span className="inline-block bg-white text-[#176447] px-14 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-xl">👉 Join WhatsApp Community</span></a></div></motion.div></div></section>
        {activeForm&&<div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center" role="dialog" aria-modal="true"><div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl"><button type="button" onClick={closeForm} aria-label="Close form" className="sticky top-4 float-right mr-4 z-20 w-11 h-11 rounded-full bg-white/95 border border-[#EAF0F6] text-[#26343D] flex items-center justify-center shadow-lg hover:text-[#12345A] hover:scale-105 transition-all"><FaTimes/></button><div className="clear-both">{activeForm==="volunteer"&&<VolunteerForm/>}{activeForm==="member"&&<MemberForm/>}{(activeForm==="movement"||activeForm==="partner")&&<GetInvolvedInterestForm type={activeForm} onClose={closeForm}/>}</div></div></div>}
    </div>;
}
