import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaSeedling, FaGraduationCap, FaHandHoldingHeart, FaFemale, FaBriefcase, FaUsers, FaArrowRight, FaRocket } from "react-icons/fa";

export default function ImpactTimeline() {
    const milestones = [
        {
            year: "2013",
            title: "Foundation & Registration",
            desc: "Swastik Srijan Foundation began its registered journey with a commitment to social service, community participation and inclusive development.",
            icon: <FaSeedling />,
            color: "#FF6600"
        },
        {
            year: "2014–2017",
            title: "Building the Foundation",
            desc: "The early years focused on strengthening community connections and developing practical social initiatives around education, health, awareness and local participation.",
            icon: <FaHandHoldingHeart />,
            color: "#003366"
        },
        {
            year: "2018–2019",
            title: "Expanding Social Initiatives",
            desc: "The organisation continued to develop community-oriented efforts, with growing attention to education, health, skills, women and community empowerment.",
            icon: <FaFemale />,
            color: "#fb8500"
        },
        {
            year: "2020",
            title: "Standing With Communities",
            desc: "During a difficult period, the focus remained on community awareness, support and responsible social response during the COVID-19 crisis.",
            icon: <FaUsers />,
            color: "#002344"
        },
        {
            year: "2021–2022",
            title: "Strengthening Community Work",
            desc: "Social awareness, learning, support and community-focused initiatives continued while adapting to changing circumstances and needs.",
            icon: <FaBriefcase />,
            color: "#d90429"
        },
        {
            year: "2023–2024",
            title: "Learning & Community Development",
            desc: "Greater emphasis was placed on learning, skills, awareness, environment and practical community development initiatives.",
            icon: <FaGraduationCap />,
            color: "#003366"
        },
        {
            year: "2025",
            title: "Digital & Social Outreach",
            desc: "The organisation continued using digital tools and wider outreach to connect people with learning, awareness and social participation opportunities.",
            icon: <FaSeedling />,
            color: "#FF6600"
        },
        {
            year: "2026",
            title: "Continuing the Mission",
            desc: "Current initiatives continue to focus on education, skill development, health, awareness, community support and meaningful partnerships.",
            icon: <FaRocket />,
            color: "#d90429"
        }
    ];

    const duplicatedMilestones = [...milestones, ...milestones];

    return (
        <section className="py-24 bg-white overflow-hidden relative border-y border-zinc-100">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002344] mb-2 uppercase tracking-wide">
                    OUR JOURNEY | हमारी यात्रा
                </h2>
                <p className="text-[#FF6600] font-bold text-sm md:text-base uppercase tracking-widest mb-6">
                    2013–2026 • A Journey of Service & Srijan
                </p>
                <div className="w-20 h-1 bg-[#FF6600] mx-auto rounded-full mb-8"></div>
                <p className="text-zinc-600 max-w-4xl mx-auto text-lg leading-relaxed">
                    From its registered beginning in 2013 to its continuing work in 2026, Swastik Srijan Foundation has grown through community participation, service, learning and the commitment to keep creating positive social change.
                </p>
            </div>

            <div className="relative flex whitespace-nowrap py-10">
                <motion.div
                    className="flex gap-8 px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 50,
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
                            <span className="absolute -bottom-4 -right-4 text-9xl font-black opacity-[0.03] select-none group-hover:opacity-[0.07] transition-opacity" style={{ color: item.color }}>
                                {item.year.replace(/[+–]/g, "")}
                            </span>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg group-hover:rotate-12 transition-transform"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.icon}
                                    </div>
                                    <span className="text-2xl font-black tracking-tighter text-right" style={{ color: item.color }}>
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

                            <div
                                className="absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-500"
                                style={{ backgroundColor: item.color }}
                            ></div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="mt-8 text-center">
                <div className="mt-4">
                    <Link to="/Journey" className="inline-flex items-center gap-2 text-[#fb8500] font-bold hover:gap-3 transition-all uppercase tracking-widest text-sm">
                        View Detailed Journey <FaArrowRight className="text-xs" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
