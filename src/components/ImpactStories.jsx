import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaArrowRight, FaQuoteLeft } from "react-icons/fa";
import { stories } from "../data/stories";
import StoryModal from "./StoryModal";

export default function ImpactStories() {
    const [selectedStory, setSelectedStory] = useState(null);
    const [lang, setLang] = useState('en');

    // Featuring "Dreams Taking Flight" as requested
    const featuredStory = stories[2];

    const toggleLang = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

    return (
        <section className="py-24 px-6 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-[120px] opacity-60 translate-y-1/2 -translate-x-1/4"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-[#fb8500] text-[10px] font-bold uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fb8500] animate-pulse"></span>
                        Voice of Transformation
                    </div>
                    <h2 className="text-4xl lg:text-7xl font-serif font-bold text-[#002344]">
                        Stories of <span className="text-[#fb8500]">Change</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-zinc-500 text-lg font-medium leading-relaxed">
                        Every life we touch has a story that deserves to be told. Explore the ripples of impact created by your support.
                    </p>
                </div>

                {/* Featured Story - High Impact Layout */}
                <div className="bg-[#fcfcfb] rounded-[3.5rem] p-4 md:p-8 border border-zinc-100 shadow-xl overflow-hidden mb-16 group">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Image Column */}
                        <div className="lg:w-1/2 w-full h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
                            <img
                                src={featuredStory.img}
                                alt={featuredStory.title.en}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <span className="absolute bottom-8 left-8 bg-[#fb8500] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                {featuredStory.category}
                            </span>
                        </div>

                        {/* Text Column */}
                        <div className="lg:w-1/2 w-full p-4 md:p-12 space-y-10">
                            <FaQuoteLeft className="text-[#fb8500] opacity-20 text-7xl" />
                            <div className="space-y-6">
                                <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#002344] leading-tight group-hover:text-[#fb8500] transition-colors">
                                    {featuredStory.title.en}
                                </h3>
                                <p className="text-2xl text-zinc-600 leading-relaxed font-medium italic">
                                    "{featuredStory.desc.en}"
                                </p>
                            </div>

                            <div className="pt-10 border-t border-zinc-100 flex flex-wrap gap-8 items-center">
                                <button
                                    onClick={() => setSelectedStory(featuredStory)}
                                    className="px-12 py-6 bg-[#002344] text-white rounded-2xl font-bold hover:bg-[#fb8500] transition-all shadow-2xl hover:shadow-[#fb8500]/20 flex items-center gap-3 text-lg"
                                >
                                    Read Full Story <FaArrowRight />
                                </button>
                                <span className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px]">
                                    Direct Field Impact
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Single CTA to See All Highlights */}
                <div className="flex justify-center">
                    <Link to="/Stories">
                        <button className="group px-16 py-7 bg-zinc-900 text-white rounded-[2rem] font-bold hover:bg-[#fb8500] transition-all shadow-2xl flex items-center gap-4 text-xl">
                            View All Impact Highlights
                            <FaArrowRight className="text-orange-400 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Global Story Modal */}
            <StoryModal
                story={selectedStory}
                isOpen={!!selectedStory}
                onClose={() => setSelectedStory(null)}
                lang={lang}
                onToggleLang={toggleLang}
            />
        </section>
    );
}
