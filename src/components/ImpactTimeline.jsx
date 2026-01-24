import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaSeedling, FaGraduationCap, FaHandHoldingHeart, FaFemale, FaBriefcase, FaUsers, FaArrowRight } from "react-icons/fa";

export default function ImpactTimeline() {
    const milestones = [
        {
            year: "2014",
            title: "Nurturing Well-being",
            desc: "Promoting mental health with community support and strengthening support systems.",
            icon: <FaHandHoldingHeart />,
            color: "#003366"
        },
        {
            year: "2016",
            title: "Rural Empowerment",
            desc: "Introduced technology-driven solutions and community-led rural development.",
            icon: <FaBriefcase />,
            color: "#fb8500"
        },
        {
            year: "2017",
            title: "Education Focus",
            desc: "Started education interventions, fostering learning access for underprivileged children.",
            icon: <FaGraduationCap />,
            color: "#d90429"
        },
        {
            year: "2019",
            title: "Women's Empowerment",
            desc: "Skill training, self-help groups and livelihood programs for rural women.",
            icon: <FaFemale />,
            color: "#002344"
        },
        {
            year: "2020",
            title: "Resilience in Crisis",
            desc: "Distributed essentials and provided support during pandemic-driven hardships.",
            icon: <FaUsers />,
            color: "#fb8500"
        },
        {
            year: "2023",
            title: "SSF Learning Hub",
            desc: "Established the SSF Hub for structured learning, mentorship, and career guidance.",
            icon: <FaGraduationCap />,
            color: "#003366"
        },
        {
            year: "2025",
            title: "Tech Integration",
            desc: "Scaling community projects with innovative tech solutions and local leadership.",
            icon: <FaSeedling />,
            color: "#fb8500"
        }
    ];

    // Double the array for seamless looping
    const duplicatedMilestones = [...milestones, ...milestones];

    return (
        <section className="py-24 bg-white overflow-hidden relative border-y border-zinc-100">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>


            {/* INFINITE LOOPING MARQUEE */}
            <div className="relative flex whitespace-nowrap py-10">
                <motion.div
                    className="flex gap-8 px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 45,
                            ease: "linear",
                        },
                    }}
                    style={{ width: "fit-content" }}
                >
                    {duplicatedMilestones.map((item, i) => (
                        <div
                            key={i}
                            className="inline-block w-[300px] md:w-[450px] bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-zinc-50 transition-all hover:shadow-2xl hover:-translate-y-2 duration-300 group relative overflow-hidden"
                        >
                            {/* Card Background Year */}
                            <span className="absolute -bottom-4 -right-4 text-9xl font-black opacity-[0.03] select-none group-hover:opacity-[0.07] transition-opacity" style={{ color: item.color }}>
                                {item.year}
                            </span>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg group-hover:rotate-12 transition-transform"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.icon}
                                    </div>
                                    <span className="text-2xl font-black tracking-tighter" style={{ color: item.color }}>
                                        {item.year}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-[#002344] mb-4 whitespace-normal font-serif">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-500 whitespace-normal text-lg font-medium leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Bottom Accent */}
                            <div
                                className="absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-500"
                                style={{ backgroundColor: item.color }}
                            ></div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Interactive hint */}
            <div className="mt-12 text-center">
                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                    <div className="w-12 h-px bg-zinc-100"></div>
                    Growing Together Since 2013
                    <div className="w-12 h-px bg-zinc-100"></div>
                </span>
                <div className="mt-8">
                    <Link to="/Journey" className="inline-flex items-center gap-2 text-[#fb8500] font-bold hover:gap-3 transition-all uppercase tracking-widest text-sm">
                        View Detailed Journey <FaArrowRight className="text-xs" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
