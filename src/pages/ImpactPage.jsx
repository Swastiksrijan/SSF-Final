import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaGraduationCap, FaHeartbeat, FaBriefcase, FaSeedling, FaFutbol, FaChild, FaPaw, FaUsers, FaArrowRight, FaQuoteLeft, FaUniversity } from "react-icons/fa";
import { useState } from "react";
import ImpactStories from "../components/ImpactStories";

export default function ImpactPage() {
    const [showAllPrograms, setShowAllPrograms] = useState(false);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const stats = [
        { number: "15,000+", label: "Children Educated", labelHi: "शिक्षित बच्चे" },
        { number: "8,000+", label: "Health Checkups", labelHi: "स्वास्थ्य जांच" },
        { number: "3,500+", label: "Women Empowered", labelHi: "सशक्त महिलाएं" },
        { number: "120+", label: "Villages Reached", labelHi: "गांव पहुंचे" },
        { number: "50,000+", label: "Lives Touched", labelHi: "जीवन प्रभावित" },
        { number: "500+", label: "Active Volunteers", labelHi: "सक्रिय स्वयंसेवक" }
    ];

    const programs = [
        {
            icon: <FaUsers />,
            image: "/images/real/children-mat-session.jpg",
            title: "SSF Learning Hub",
            titleHi: "एसएसएफ लर्निंग हब",
            desc: "An active community-driven education initiative offering both online and offline classes for holistic learning.",
            descHi: "एक सक्रिय समुदाय-संचालित शिक्षा पहल जो समग्र सीखने के लिए ऑनलाइन और ऑफलाइन दोनों कक्षाएं प्रदान करती है।",
            color: "bg-blue-50 text-blue-600 border-blue-100",
            impact: "Currently Active",
            customButtons: [
                { label: "🔘 Donate for Learning Hub", link: "/Donate" },
                { label: "🔘 View Details", link: "/LearningHub" }
            ]
        },
        {
            icon: <FaUniversity />,
            image: "/images/academy/academy-roadmap.jpg",
            title: "The SSF National Academy",
            titleHi: "एसएसएफ नेशनल अकादमी",
            desc: "Our flagship knowledge hub for future leaders, focusing on academic excellence and professional growth.",
            descHi: "भावी नेताओं के लिए हमारा प्रमुख ज्ञान केंद्र, जो शैक्षणिक उत्कृष्टता और व्यावसायिक विकास पर केंद्रित है।",
            color: "bg-indigo-50 text-indigo-600 border-indigo-100",
            impact: "Upcoming Project",
            customButtons: [
                { label: "🔘 Support Education", link: "/Donate" },
                { label: "🔘 Project Roadmap", link: "/SSFNationalAcademy" }
            ]
        },
        {
            icon: <FaGraduationCap />,
            image: "/images/real/education_girls.jpg",
            title: "Education for Underprivileged Children",
            titleHi: "वंचित बच्चों के लिए शिक्षा",
            desc: "Direct support for school fees, materials, and digital learning for children in need.",
            color: "bg-orange-50 text-orange-600 border-orange-100",
            impact: "Education Access"
        },
        {
            icon: <FaHeartbeat />,
            image: "/images/real/nutrition_program.jpg",
            title: "Health & Nutrition Initiative",
            titleHi: "स्वास्थ्य और पोषण पहल",
            desc: "Free health camps, medicine distribution, and nutrition kits for women and children.",
            color: "bg-red-50 text-red-600 border-red-100",
            impact: "Preventive Healthcare"
        },
        {
            icon: <FaFutbol />,
            image: "/images/real/children-playing-park.jpg",
            title: "Sports & Youth Development",
            titleHi: "खेल और युवा विकास",
            desc: "Promoting physical fitness, leadership, and professional coaching for rural youth.",
            color: "bg-indigo-50 text-indigo-600 border-indigo-100",
            impact: "Youth Leadership"
        },
        {
            icon: <FaChild />,
            image: "/images/real/women_empowerment_tailoring.jpg",
            title: "Women & Child Empowerment",
            titleHi: "महिला एवं बाल सशक्तिकरण",
            desc: "Vocational training and protection programs for social and economic independence.",
            color: "bg-pink-50 text-pink-600 border-pink-100",
            impact: "Social Equality"
        },
        {
            icon: <FaSeedling />,
            image: "/images/real/tree_plantation.jpg",
            title: "Environment & Sustainability",
            titleHi: "पर्यावरण और स्थिरता",
            desc: "Tree plantation drives, waste management awareness, and clean energy advocacy.",
            color: "bg-green-50 text-green-600 border-green-100",
            impact: "Climate Action"
        },
        {
            icon: <FaPaw />,
            image: "/images/real/mural_humanity_first.jpg",
            title: "Animal & Bird Welfare",
            titleHi: "पशु और पक्षी कल्याण",
            desc: "Rescuing injured strays and creating awareness for wildlife protection.",
            color: "bg-amber-50 text-amber-600 border-amber-100",
            impact: "Ecological Care"
        },
        {
            icon: <FaUsers />,
            image: "/images/real/community-education-meeting.jpg",
            title: "Community Development",
            titleHi: "सामुदायिक विकास",
            desc: "Infrastructure support and awareness campaigns for clean and self-reliant villages.",
            color: "bg-zinc-50 text-zinc-600 border-zinc-100",
            impact: "Holistic Growth"
        }
    ];

    return (
        <div className="w-full bg-white font-sans text-zinc-900 overflow-hidden">
            {/* ================= HERO ================= */}
            <section className="relative w-full bg-zinc-50 pt-28 pb-12 flex items-center justify-center min-h-[60vh]">
                <div className="container mx-auto px-4 h-full flex items-center justify-center">
                    <img
                        src="/images/uploads/impact-hero-banner.jpg"
                        alt="Impact - SSF Vaccine Awareness Newspaper Clipping"
                        className="w-full h-auto max-h-[80vh] object-contain shadow-lg rounded-lg"
                    />
                </div>
            </section>

            {/* ================= STATS ================= */}
            <section className="py-20 px-6 relative z-20 -mt-16">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="bg-gradient-to-br from-zinc-50 to-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-zinc-200"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center space-y-2"
                                >
                                    <div className="text-4xl md:text-5xl font-black text-[#002344]">{stat.number}</div>
                                    <div className="text-sm font-bold text-zinc-600 uppercase tracking-wider">{stat.label}</div>
                                    <div className="text-xs font-hindi text-zinc-400">{stat.labelHi}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= PROGRAMS & INITIATIVES FEATURED ================= */}
            <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#002344] text-[10px] font-bold uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#002344] animate-pulse"></span>
                            Ecosystem of Empowerment
                        </div>
                        <h2 className="text-4xl lg:text-7xl font-serif font-bold text-[#002344]">
                            Programs & <span className="text-[#FF6600]">Initiatives</span>
                        </h2>
                        <p className="max-w-2xl mx-auto text-zinc-500 text-lg font-medium leading-relaxed">
                            Every program we run has a purpose that deserves support. Explore the diverse channels of transformation created by our collective effort.
                        </p>
                        <p className="text-sm font-hindi text-zinc-400 font-bold uppercase tracking-widest mb-6">सामुदायिक विकास के लिए हमारा व्यापक दृष्टिकोण</p>

                        <div className="flex justify-center pt-2">
                            <Link to="/Campaigns">
                                <button className="px-8 py-3 bg-white border-2 border-[#002344] text-[#002344] rounded-2xl font-bold hover:bg-[#002344] hover:text-white transition-all shadow-lg flex items-center gap-2 text-xs uppercase tracking-widest">
                                    View Detailed Campaigns <FaArrowRight className="text-[10px]" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Featured Program - Flagship Layout */}
                    <div className="bg-white rounded-[3.5rem] p-4 md:p-8 border border-zinc-200 shadow-xl overflow-hidden mb-16 group">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            {/* Image Column */}
                            <div className="lg:w-1/2 w-full h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                                <img
                                    src={programs[0].image}
                                    alt={programs[0].title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <span className="absolute bottom-8 left-8 bg-[#002344] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border border-white/20">
                                    Flagship Initiative
                                </span>
                            </div>

                            {/* Text Column */}
                            <div className="lg:w-1/2 w-full p-4 md:p-12 space-y-10 text-left">
                                <FaQuoteLeft className="text-[#FF6600] opacity-20 text-7xl" />
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#002344] leading-tight group-hover:text-[#FF6600] transition-colors">
                                            {programs[0].title}
                                        </h3>
                                        <h4 className="text-2xl font-hindi text-zinc-400 font-medium">{programs[0].titleHi}</h4>
                                    </div>
                                    <p className="text-xl text-zinc-600 leading-relaxed font-medium">
                                        "{programs[0].desc}"
                                    </p>
                                    <p className="text-lg font-hindi text-zinc-400 italic">
                                        {programs[0].descHi}
                                    </p>
                                </div>

                                <div className="pt-10 border-t border-zinc-100 flex flex-wrap gap-6 items-center">
                                    {programs[0].customButtons.map((btn, idx) => (
                                        <Link
                                            key={idx}
                                            to={btn.link}
                                            className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-3 uppercase tracking-wider text-[10px] ${idx === 0 ? 'bg-[#002344] text-white hover:bg-[#FF6600]' : 'bg-white border-2 border-zinc-100 text-zinc-600 hover:border-[#002344] hover:text-[#002344]'}`}
                                        >
                                            {btn.label.replace('🔘 ', '')} <FaArrowRight />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Button to expand or show more */}
                    {!showAllPrograms ? (
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowAllPrograms(true)}
                                className="group px-16 py-7 bg-zinc-900 text-white rounded-[2rem] font-bold hover:bg-[#FF6600] transition-all shadow-2xl flex items-center gap-4 text-xl"
                            >
                                Explore All 9+ Initiatives
                                <FaArrowRight className="text-orange-400 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                        >
                            <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-12">
                                <div className="space-y-1">
                                    <h4 className="text-3xl font-bold text-[#002344]">Full Spectrum of Impact</h4>
                                    <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Bridging the gap across all developmental sectors</p>
                                </div>
                                <button
                                    onClick={() => setShowAllPrograms(false)}
                                    className="text-[#FF6600] font-bold flex items-center gap-2 hover:gap-3 transition-all text-lg"
                                >
                                    Show Less <FaArrowRight className="-rotate-90 transition-transform" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {programs.slice(1).map((program, i) => (
                                    <motion.div
                                        key={i}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={{
                                            hidden: { opacity: 0, y: 30 },
                                            visible: { opacity: 1, y: 0, transition: { delay: i * 0.05 } }
                                        }}
                                        className={`flex flex-col rounded-[2rem] border-2 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden ${program.color}`}
                                    >
                                        {program.image && (
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={program.image}
                                                    alt={program.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        )}

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform w-fit opacity-80">
                                                {program.icon}
                                            </div>
                                            <div className="space-y-1 mb-4">
                                                <h3 className="text-xl font-bold text-[#002344] leading-tight group-hover:text-[#FF6600] transition-colors">{program.title}</h3>
                                                <h4 className="text-xs font-hindi text-zinc-400 font-bold tracking-wide">{program.titleHi}</h4>
                                            </div>

                                            <div className="space-y-3 mb-6 flex-1">
                                                <p className="text-sm text-zinc-600 leading-relaxed font-medium">{program.desc}</p>
                                                {program.descHi && (
                                                    <p className="text-[11px] font-hindi text-zinc-400/80 leading-relaxed italic">{program.descHi}</p>
                                                )}
                                            </div>

                                            {program.customButtons ? (
                                                <div className="flex flex-col gap-2 mb-6">
                                                    {program.customButtons.map((btn, idx) => (
                                                        <Link
                                                            key={idx}
                                                            to={btn.link}
                                                            className="w-full py-3 px-4 bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-xl text-[10px] font-black text-center text-[#002344] hover:bg-[#002344] hover:text-white transition-all flex items-center justify-center gap-2 group/btn uppercase tracking-widest shadow-sm"
                                                        >
                                                            {btn.label.replace('🔘 ', '')}
                                                            <FaArrowRight className="text-[8px] group-hover/btn:translate-x-1 transition-transform" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Link
                                                    to="/Donate"
                                                    className="w-fit mb-6 text-[10px] font-black flex items-center gap-2 hover:gap-3 transition-all text-[#002344] uppercase tracking-widest border-b-2 border-transparent hover:border-[#FF6600]"
                                                >
                                                    Help Now <FaArrowRight className="text-[8px] text-[#FF6600]" />
                                                </Link>
                                            )}

                                            <div className="pt-4 border-t border-zinc-200 mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600]"></span>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{program.impact}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={() => setShowAllPrograms(false)}
                                    className="px-12 py-5 border-2 border-[#002344]/10 rounded-2xl font-bold text-zinc-400 hover:border-[#002344] hover:text-[#002344] transition-all flex items-center gap-3"
                                >
                                    Hide Grid
                                    <FaArrowRight className="-rotate-90 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ================= DIRECT IMPACT SPOTLIGHT ================= */}
            <section className="py-24 px-6 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] -mr-[300px] -mt-[300px]"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Image Composition */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                                <img
                                    src="/images/real/vision-health-camp.jpg"
                                    alt="Health Camp Impact"
                                    className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-[#FF6600] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                                            <FaHeartbeat />
                                        </div>
                                        <div className="text-white">
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Focus Area</p>
                                            <p className="text-xl font-bold">Preventive Healthcare</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-xl border border-blue-50 hidden md:block"
                            >
                                <div className="text-center">
                                    <p className="text-4xl font-black text-[#002344]">8k+</p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Checkups Completed</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2 space-y-8"
                        >
                            <div className="space-y-4">
                                <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-[0.2em]">
                                    Direct Impact Spotlight
                                </span>
                                <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#002344] leading-tight">
                                    Health is the first step to <span className="text-[#FF6600]">Dignity</span>
                                </h2>
                                <p className="text-xl text-zinc-500 leading-relaxed font-medium">
                                    Our health awareness camps don't just provide medicines; they provide hope and education for a healthier generation.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center mt-1">
                                        <FaArrowRight className="text-xs" />
                                    </div>
                                    <p className="text-zinc-600 font-medium italic select-none">"I never knew my vision could be restored with a simple procedure. SSF changed how I see my future." — Health Camp Beneficiary</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF6600] flex-shrink-0 flex items-center justify-center mt-1">
                                        <FaArrowRight className="text-xs" />
                                    </div>
                                    <p className="text-zinc-600 font-hindi border-l-4 border-orange-100 pl-4 py-1 leading-loose">
                                        "मुझे कभी नहीं पता था कि एक साधारण प्रक्रिया से मेरी दृष्टि बहाल हो सकती है। एसएसएफ ने मेरे भविष्य को देखने के तरीके को बदल दिया है।" — स्वास्थ्य शिविर लाभार्थी
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Link to="/Donate">
                                    <button className="px-10 py-5 bg-[#002344] text-white rounded-2xl font-bold hover:bg-[#FF6600] transition-all shadow-xl flex items-center gap-3">
                                        Support Our Health Camps <FaArrowRight />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= STORIES OF CHANGE ================= */}
            <ImpactStories />

            {/* ================= YOUTH EMPOWERMENT SPOTLIGHT ================= */}
            <section className="py-24 px-6 bg-zinc-50 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#002344] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center border border-white/10">
                        <div className="lg:w-1/2 p-12 md:p-20 space-y-8">
                            <div className="inline-block px-4 py-1.5 bg-[#FF6600] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                                Holistic Development | समग्र विकास
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                More Than Just <br /> <span className="text-[#FF6600]">Academics</span>
                            </h2>
                            <p className="text-zinc-300 text-xl leading-relaxed font-serif italic">
                                "We believe sports play a vital role in building character, leadership, and confidence in children. It's about nurturing the spirit of resilience."
                            </p>
                            <p className="text-zinc-400 font-hindi border-l-2 border-[#FF6600] pl-6">
                                हमारा मानना है कि खेल बच्चों में चरित्र, नेतृत्व और आत्मविश्वास के निर्माण में महत्वपूर्ण भूमिका निभाते हैं। यह लचीलेपन की भावना को पोषित करने के बारे में है।
                            </p>
                        </div>
                        <div className="lg:w-1/2 relative h-[500px] lg:h-[700px] w-full">
                            <motion.div
                                className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-1000"
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src="/images/real/cricket-child.jpg"
                                    alt="Child playing cricket"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#002344] via-transparent to-transparent"></div>

                                {/* Overlay Badges */}
                                <div className="absolute top-10 right-10 flex flex-col gap-4">
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white text-center">
                                        <div className="text-2xl font-bold">10+</div>
                                        <div className="text-[8px] uppercase tracking-widest font-black opacity-60">Sports Hubs</div>
                                    </div>
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white text-center">
                                        <div className="text-2xl font-bold">2k+</div>
                                        <div className="text-[8px] uppercase tracking-widest font-black opacity-60">Young Athletes</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= GROUND REALITY GALLERY ================= */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                Ground Reality
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#002344]">Visualising the <span className="text-[#FF6600]">Transformation</span></h2>
                            <p className="text-xl text-zinc-500 font-medium">Real moments of change captured during our field operations.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Interactive Gallery Cards */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="rounded-3xl overflow-hidden shadow-lg h-[400px]"
                        >
                            <img src="/images/real/ssf_event_members.jpg" alt="SSF Community Group" className="w-full h-full object-cover" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="rounded-3xl overflow-hidden shadow-lg h-[400px]"
                        >
                            <img src="/images/children-exercise-session.jpg" alt="Health & Fitness" className="w-full h-full object-cover" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="rounded-3xl overflow-hidden shadow-lg h-[400px]"
                        >
                            <img src="/images/cultural-event-children.jpg" alt="Cultural Enrichment" className="w-full h-full object-cover" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="py-24 px-6 bg-[#002344] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
                    <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        Be the reason a <br /> <span className="text-[#FF6600]">child smiles today.</span>
                    </h2>
                    <p className="text-xl text-zinc-300 font-medium">Your contribution, no matter the size, fuels these programs and keeps our mission alive.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link to="/Donate">
                            <button className="px-12 py-5 bg-[#FF6600] text-white rounded-2xl font-black text-lg hover:bg-white hover:text-[#002344] transition-all shadow-2xl flex items-center gap-3">
                                Become a Donor <FaArrowRight />
                            </button>
                        </Link>
                        <Link to="/Volunteer">
                            <button className="px-12 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-lg hover:bg-white hover:text-[#002344] transition-all flex items-center gap-3">
                                Join as Volunteer <FaArrowRight />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
