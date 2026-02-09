import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaHandsHelping, FaLaptop, FaBullhorn, FaArrowRight, FaWhatsapp, FaTimes, FaBriefcase, FaCertificate, FaCode, FaRocket, FaDatabase } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import VolunteerForm from "../components/VolunteerForm";

export default function Internship() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const internshipRoles = [
        {
            id: "social_media",
            icon: <FaBullhorn />,
            title: "Social Media & Marketing",
            titleHi: "सोशल मीडिया और मार्केटिंग",
            color: "bg-blue-50 text-blue-600",
            border: "border-blue-100",
            description: "Manage our social media presence, create engaging content, and help us reach a wider audience for our campaigns.",
            requirements: "Familiarity with Instagram, LinkedIn, and Basic Design (Canva)."
        },
        {
            id: "content_writing",
            icon: <FaLaptop />,
            title: "Content Writing & Blogging",
            titleHi: "कंटेंट राइटिंग और ब्लॉगिंग",
            color: "bg-purple-50 text-purple-600",
            border: "border-purple-100",
            description: "Write articles, success stories, and newsletters to showcase the impact of our work on the ground.",
            requirements: "Strong writing skills in English and/or Hindi."
        },
        {
            id: "field_research",
            icon: <FaBriefcase />,
            title: "Field Research & Impact",
            titleHi: "फील्ड रिसर्च और इम्पेक्ट",
            color: "bg-orange-50 text-orange-600",
            border: "border-orange-100",
            description: "Work directly on the field to collect data, monitor projects, and understand the grassroots challenges.",
            requirements: "Willingness to travel and interact with local communities."
        },
        {
            id: "edu_support",
            icon: <FaGraduationCap />,
            title: "Education & Mentorship",
            titleHi: "शिक्षा और मेंटरशिप",
            color: "bg-emerald-50 text-emerald-600",
            border: "border-emerald-100",
            description: "Assist in our teaching programs, develop educational modules, and mentor children in our learning hubs.",
            requirements: "Passion for teaching and patience for working with children."
        },
        {
            id: "tech_dev",
            icon: <FaCode />,
            title: "Web Development & Tech",
            titleHi: "वेब डेवलपमेंट और टेक",
            color: "bg-indigo-50 text-indigo-600",
            border: "border-indigo-100",
            description: "Help us maintain our digital presence, build internal tools, and implement tech solutions for field data collection.",
            requirements: "Basic knowledge of React, HTML/CSS, or Data Management."
        }
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="w-full bg-white font-sans text-zinc-900 overflow-hidden">
            {/* ================= HERO ================= */}
            <section className="bg-[#001529] text-white pt-48 pb-24 relative">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="space-y-6 max-w-4xl"
                    >
                        <div className="flex items-center gap-4 text-[#fb8500] font-bold tracking-widest uppercase text-sm">
                            <span className="w-12 h-0.5 bg-[#fb8500]"></span>
                            <span>INTERNSHIP OPPORTUNITIES</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight">
                            Bridge the Gap: <span className="text-[#fb8500]">Learn, Lead, and Serve.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-2xl">
                            Gain professional experience while making a real difference. Our internship program is designed to bridge the gap between academic theory and grassroots reality.
                        </p>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-2 text-zinc-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#fb8500]"></div>
                                <span>Real World Projects</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#fb8500]"></div>
                                <span>Professional Mentorship</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#fb8500]"></div>
                                <span>Impact Certification</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= INTERNSHIP ROLES ================= */}
            <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#002344]">Internship के अवसर</h2>
                        <p className="text-zinc-500 text-lg font-medium">Develop your professional skills through social contribution.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {internshipRoles.map((role, i) => (
                            <motion.div
                                key={role.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                                }}
                                className={`bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-2 ${role.border} shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col`}
                            >
                                <div className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center text-3xl mb-8`}>
                                    {role.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#002344] mb-1">{role.title}</h3>
                                <h4 className="text-sm font-hindi text-zinc-400 font-bold mb-6">{role.titleHi}</h4>

                                <div className="space-y-4 flex-grow">
                                    <p className="text-sm text-zinc-600 leading-relaxed">
                                        {role.description}
                                    </p>
                                    <div className="pt-6 border-t border-zinc-100">
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Expectation: पात्रता</p>
                                        <p className="text-sm font-bold text-[#002344]">{role.requirements}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= TECH FOR GOOD SECTION ================= */}
            <section className="py-24 px-6 bg-zinc-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(#fb8500_1px,transparent_1px)] [background-size:30px_30px]"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                                <FaRocket />
                                Digital Transformation
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black leading-tight">
                                Tech for <span className="text-[#fb8500]">Social Good.</span>
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                We believe that technology is the greatest equalizer. By joining our tech team, you'll help build the digital infrastructure that powers grassroots change.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                                    <FaCode className="text-3xl text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-xl mb-2">Modern Stack</h4>
                                    <p className="text-sm text-zinc-500">Work with React, Node.js, and modern cloud infrastructures to build scalable NGO tools.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#fb8500]/50 transition-colors group">
                                    <FaDatabase className="text-3xl text-[#fb8500] mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-xl mb-2">Data Impact</h4>
                                    <p className="text-sm text-zinc-500">Transform raw field data into actionable insights through visualization and smart architecture.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-video rounded-3xl overflow-hidden border-8 border-white/5 shadow-2xl relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
                                    alt="Technology for NGO"
                                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="flex items-center gap-4 text-sm font-mono text-indigo-400">
                                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                        BUILDING DIGITAL BHARAT
                                    </div>
                                    <h3 className="text-2xl font-bold mt-2">Code that changes lives.</h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= APPLICATION SECTION ================= */}
            <section className="py-24 px-6 bg-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#001529] rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
                        {/* Background blobs */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fb8500] opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl -ml-48 -mb-48"></div>

                        <div className="lg:w-1/2 space-y-8 relative z-10 text-white">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#fb8500] text-xs font-bold uppercase tracking-widest">
                                <FaCertificate />
                                Verified NGO Internship
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black leading-tight">
                                Kickstart Your <br /><span className="text-[#fb8500]">Social Career</span> Today.
                            </h2>
                            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                                Join our mission across Bharat. Whether you are a student or a professional, we have a place for your passion and skills.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="bg-[#fb8500] text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-[#001529] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl"
                                >
                                    👉 Apply Now
                                    <FaArrowRight />
                                </button>
                                <a
                                    href="https://forms.gle/S6Qc56QE8nLYdDTL9"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 cursor-pointer"
                                >
                                    <FaHandsHelping />
                                    Volunteer Form
                                </a>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative w-full group">
                            <div className="absolute -inset-4 bg-[#fb8500] opacity-20 rounded-[3rem] blur-xl group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10">
                                <img
                                    src="/images/real/ngo_event_2.jpg"
                                    alt="Internship at SSF"
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#001529] via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-10 left-10 right-10 text-center">
                                    <p className="text-white text-xl md:text-2xl font-bold italic">"Be the change you wish to see in the world."</p>
                                    <p className="text-zinc-400 mt-2">— Mahatma Gandhi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ================= INTERNSHIP BENEFITS ================= */}
            <section className="py-24 px-6 bg-[#001529] text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-16">Internship Benefits | लाभ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="text-4xl text-[#fb8500] flex justify-center"><FaHandsHelping /></div>
                            <h3 className="text-xl font-bold">Real Impact</h3>
                            <p className="text-zinc-400">See the results of your hard work directly improving lives at the grassroots level.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl text-[#fb8500] flex justify-center"><FaGraduationCap /></div>
                            <h3 className="text-xl font-bold">Mentorship</h3>
                            <p className="text-zinc-400">Guided experience from social sector professionals and community leaders.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl text-[#fb8500] flex justify-center"><FaCertificate /></div>
                            <h3 className="text-xl font-bold">Certification</h3>
                            <p className="text-zinc-400">Receive a legitimate certificate that boosts your CV and professional portfolio.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= REGISTRATION MODAL ================= */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-[#001529]/80 backdrop-blur-md transition-all"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] shadow-2xl p-2 md:p-6"
                        >
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="absolute top-8 right-8 z-10 w-12 h-12 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center hover:bg-[#fb8500] hover:text-white transition-all shadow-lg"
                            >
                                <FaTimes size={24} />
                            </button>

                            <div className="p-4">
                                <VolunteerForm />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
