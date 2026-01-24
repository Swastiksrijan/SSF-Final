import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaGraduationCap, FaLightbulb, FaUsers, FaHandsHelping, FaChartLine, FaBuilding, FaArrowRight, FaRupeeSign, FaHeart } from "react-icons/fa";
import { HiSparkles, HiAcademicCap, HiBookOpen, HiUserGroup } from "react-icons/hi2";

export default function SSFNationalAcademy() {
    const objectives = [
        "Support academic growth, career development, and skill enhancement",
        "Bridge learning gaps and encourage critical thinking",
        "Promote ethical and social values alongside education",
        "Provide accessible and inclusive quality learning opportunities"
    ];

    const focusAreas = [
        { icon: <HiBookOpen />, title: "Academic Support", desc: "Learning assistance and tutoring" },
        { icon: <HiAcademicCap />, title: "Career Guidance", desc: "Mentorship and career counseling" },
        { icon: <FaLightbulb />, title: "Competitive Exams", desc: "Awareness and preparation support" },
        { icon: <FaChartLine />, title: "Skill Development", desc: "Personality enhancement programs" },
        { icon: <FaUsers />, title: "Digital Literacy", desc: "Educational awareness programs" },
    ];

    const beneficiaries = [
        "School and college students",
        "Youth and job aspirants",
        "Learners from economically weaker sections",
        "Individuals seeking guidance and skill development"
    ];

    const fundingNeeds = [
        { title: "Infrastructure Development", amount: "₹50,00,000", desc: "Building classrooms, labs, and learning centers" },
        { title: "Digital Equipment", amount: "₹25,00,000", desc: "Computers, projectors, and e-learning tools" },
        { title: "Scholarship Fund", amount: "₹30,00,000", desc: "Supporting underprivileged students" },
        { title: "Faculty & Training", amount: "₹20,00,000", desc: "Hiring quality educators and trainers" },
    ];

    return (
        <section className="bg-white font-inria min-h-screen">
            {/* ================= HERO WITH PROGRESS BADGE ================= */}
            <div className="bg-gradient-to-br from-[#001529] via-[#002344] to-[#003366] text-white pt-48 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>

                {/* Animated floating elements */}
                <motion.div
                    className="absolute top-32 right-20 w-72 h-72 bg-[#fb8500]/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 left-10 w-96 h-96 bg-[#d90429]/10 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />

                <div className="max-w-6xl mx-auto px-6 text-center relative z-10 space-y-8">
                    {/* Under Progress Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#fb8500]/20 to-[#d90429]/20 backdrop-blur-md border border-[#fb8500]/30 px-6 py-3 rounded-full"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fb8500] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#fb8500]"></span>
                        </span>
                        <span className="text-[#fb8500] font-bold text-sm uppercase tracking-wider">Currently Under Development</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-[#fb8500] font-bold text-xs uppercase tracking-[0.2em] mb-4">Education & Values | शिक्षा और संस्कार</p>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">
                            The SSF <span className="text-[#fb8500]">National Academy</span> <br />
                            <span className="text-3xl md:text-5xl font-sans font-normal opacity-80 decoration-[#fb8500]/30">एसएसएफ नेशनल एकेडमी</span>
                        </h1>
                        <h2 className="text-xl md:text-2xl font-serif text-zinc-300 mb-8 italic">
                            "Creating Leaders of Tomorrow" | "कल के लीडर्स बनाना"
                        </h2>
                        <p className="text-zinc-300 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                            An educational initiative dedicated to nurturing young minds and building the nation through knowledge, skills, and values. We aim to provide inclusive quality learning for all.
                        </p>
                        <p className="text-zinc-400 mt-2 text-lg">
                            एक शैक्षिक पहल जो ज्ञान, कौशल और मूल्यों के माध्यम से युवा दिमागों को पोषित करने और राष्ट्र के निर्माण के लिए समर्पित है। हमारा लक्ष्य सभी के लिए समावेशी गुणवत्तापूर्ण शिक्षा प्रदान करना है।
                        </p>
                    </motion.div>

                    {/* Progress Indicator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-md mx-auto mt-12"
                    >
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-white/80">Project Progress</span>
                                <span className="text-[#fb8500] font-bold">35%</span>
                            </div>
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#fb8500] to-[#d90429] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: "35%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-white/60 text-xs mt-3">Help us reach our goal faster with your support</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ================= OBJECTIVES ================= */}
            <div className="py-24 bg-gradient-to-b from-white to-zinc-50">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-[#fb8500] font-bold text-xs uppercase tracking-[0.2em] mb-4">Our Purpose | हमारा उद्देश्य</p>
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344]">
                            Objectives of The Academy <br />
                            <span className="text-2xl lg:text-3xl font-sans font-normal text-[#002344]/60">एकेडमी के उद्देश्य</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {objectives.map((obj, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border border-zinc-100 hover:shadow-xl hover:border-[#fb8500]/30 transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fb8500] to-[#d90429] flex items-center justify-center text-white font-bold shrink-0">
                                    {idx + 1}
                                </div>
                                <p className="text-zinc-700 font-medium leading-relaxed">{obj}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= KEY FOCUS AREAS ================= */}
            <div className="py-24 bg-[#001529]">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-[#fb8500] font-bold text-xs uppercase tracking-[0.2em] mb-4">What We Focus On | हमारा विशेष ध्यान</p>
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-2">
                            Key Focus Areas | प्रमुख कार्य क्षेत्र
                        </h2>
                        <h3 className="text-xl text-zinc-400 font-medium">
                            Empowering Through Education | शिक्षा के माध्यम से सशक्तिकरण
                        </h3>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {focusAreas.map((area, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 hover:border-[#fb8500]/50 hover:bg-white/10 transition-all group"
                            >
                                <div className="text-4xl text-[#fb8500] mb-4 group-hover:scale-110 transition-transform">
                                    {area.icon}
                                </div>
                                <h3 className="text-white font-bold mb-2">{area.title}</h3>
                                <p className="text-zinc-400 text-sm">{area.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= WHO CAN BENEFIT ================= */}
            <div className="py-24 bg-gradient-to-b from-zinc-50 to-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-[#fb8500] font-bold text-xs uppercase tracking-[0.2em] mb-4">Target Audience</p>
                            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344] mb-2">
                                Who Can Benefit?
                            </h2>
                            <h3 className="text-lg text-zinc-500 mb-8 italic">
                                Who Can Benefit?
                            </h3>
                            <div className="space-y-4">
                                {beneficiaries.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-zinc-100 hover:border-[#002344]/30 transition-all">
                                        <div className="w-8 h-8 rounded-lg bg-[#002344] flex items-center justify-center">
                                            <HiUserGroup className="text-white text-lg" />
                                        </div>
                                        <span className="text-zinc-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-[#002344] to-[#001529] rounded-3xl p-8 text-white">
                                <HiSparkles className="text-[#fb8500] text-4xl mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Our Approach</h3>
                                <p className="text-zinc-300 leading-relaxed mb-6">
                                    We follow a learner-centric and inclusive approach, combining knowledge sharing, mentorship, and practical exposure.
                                </p>
                                <p className="text-zinc-400 leading-relaxed">
                                    The academy emphasizes accessibility, affordability, and community-driven learning to ensure long-term impact.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ================= FUNDING REQUIREMENTS ================= */}
            <div className="py-24 bg-gradient-to-br from-[#d90429]/5 via-white to-[#fb8500]/5">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <p className="text-[#d90429] font-bold text-xs uppercase tracking-[0.2em] mb-4">Support Our Vision | हमारे विजन का समर्थन करें</p>
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344] mb-6">
                            Funding Requirements | फंड की जरूरतें
                        </h2>
                        <p className="text-zinc-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            The SSF National Academy is currently under development. Your contributions will help us build a state-of-the-art learning facility.
                        </p>
                        <p className="text-zinc-400 mt-2 text-md italic">
                            एसएसएफ नेशनल एकेडमी वर्तमान में निर्माणाधीन है। आपका सहयोग हमें एक अत्याधुनिक शिक्षण सुविधा बनाने में मदद करेगा।
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {fundingNeeds.map((need, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-8 shadow-xl border border-zinc-100 hover:border-[#fb8500]/30 hover:shadow-2xl transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-bold text-[#002344] group-hover:text-[#fb8500] transition-colors">
                                        {need.title}
                                    </h3>
                                    <span className="bg-[#fb8500]/10 text-[#fb8500] font-bold px-4 py-2 rounded-full text-sm">
                                        {need.amount}
                                    </span>
                                </div>
                                <p className="text-zinc-500 leading-relaxed">{need.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Total Funding Goal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#002344] to-[#001529] rounded-3xl p-10 text-center text-white"
                    >
                        <p className="text-[#fb8500] font-bold text-sm uppercase tracking-wider mb-4">Total Project Budget</p>
                        <h3 className="text-5xl lg:text-6xl font-serif font-bold mb-4">₹1,25,00,000</h3>
                        <p className="text-zinc-400 max-w-xl mx-auto mb-8">
                            Every contribution brings us closer to establishing a world-class educational facility that will transform thousands of lives.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#d90429] to-[#b00422] text-white font-bold px-10 py-5 rounded-full hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-1 transition-all"
                            >
                                <FaHeart className="text-lg" />
                                Support This Project
                            </a>
                            <Link
                                to="/CSRPartnership"
                                className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold px-10 py-5 rounded-full hover:bg-white/20 transition-all"
                            >
                                <FaBuilding className="text-lg" />
                                CSR Partnership
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ================= COLLABORATION ================= */}
            <div className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <FaHandsHelping className="text-6xl text-[#fb8500] mx-auto mb-8" />
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344] mb-6">
                            Collaboration & Support
                        </h2>
                        <p className="text-zinc-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
                            The SSF National Academy collaborates with educators, volunteers, institutions, and partners to strengthen its educational initiatives. Through collective efforts, we aim to expand learning opportunities and reach a wider audience.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/Volunteer"
                                className="inline-flex items-center gap-2 bg-[#002344] text-white font-bold px-8 py-4 rounded-full hover:bg-[#001529] transition-all"
                            >
                                Volunteer as Mentor <FaArrowRight />
                            </Link>
                            <Link
                                to="/PartnerWithUs"
                                className="inline-flex items-center gap-2 border-2 border-[#002344] text-[#002344] font-bold px-8 py-4 rounded-full hover:bg-[#002344] hover:text-white transition-all"
                            >
                                Partner With Us <FaArrowRight />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ================= CTA ================= */}
            <div className="py-24 bg-gradient-to-br from-[#fb8500] to-[#d90429] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.1]"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
                            Together, We Can Nurture Minds
                        </h2>
                        <p className="text-white/90 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Help us build The SSF National Academy and create a brighter future for thousands of young learners across India.
                        </p>
                        <a
                            href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-white text-[#d90429] font-bold px-12 py-5 rounded-full text-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
                        >
                            <FaRupeeSign className="text-xl" />
                            Donate Now
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
