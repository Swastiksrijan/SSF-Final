import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Languages } from "lucide-react";
import { stories } from "../data/stories";
import StoryModal from "./StoryModal";
import { useLanguage } from "../context/LanguageContext";

const FALLBACK_STORY_IMAGE = "/images/real/foundation_banner.jpg";

const CardContent = ({ story, lang }) => (
    <>
        <div className="relative h-72 overflow-hidden rounded-2xl m-2 mb-0 bg-[#002344]">
            <img
                src={story.img || FALLBACK_STORY_IMAGE}
                alt={story.title[lang] || story.title.en}
                loading="lazy"
                onError={(e) => {
                    if (e.currentTarget.src.endsWith(FALLBACK_STORY_IMAGE)) return;
                    e.currentTarget.src = FALLBACK_STORY_IMAGE;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 saturate-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002344]/40 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md text-[#002344] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                {story.category}
            </div>
        </div>

        <div className="p-8 space-y-4 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-[#002344] leading-tight group-hover:text-[#fb8500] transition-colors">
                {story.title[lang] || story.title.en}
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium line-clamp-3 mb-4 flex-1">
                {story.desc[lang] || story.desc.en}
            </p>

            <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                <div className="text-xs font-bold text-[#fb8500] flex items-center gap-2 uppercase tracking-wide group-hover:gap-3 transition-all">
                    {lang === 'en' ? 'Read Full Story' : 'पूरी कहानी पढ़ें'}
                    <FaArrowRight />
                </div>
            </div>
        </div>
    </>
);

export default function StoriesGrid({ limit = null, hideHeader = false, stories: customStories = stories }) {
    const [selectedStory, setSelectedStory] = useState(null);
    const { lang, toggleLang } = useLanguage();

    const displayedStories = limit ? customStories.slice(0, limit) : customStories;

    return (
        <div className="w-full">
            {!limit && !hideHeader && (
                <div className="text-center mb-16 space-y-4">
                    <button type="button" onClick={toggleLang} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 text-[#002344] text-xs font-bold">
                        <Languages size={14} /> {lang === "en" ? "हिन्दी" : "English"}
                    </button>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#fb8500] text-xs font-bold uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-[#fb8500]"></span>All Stories</div>
                    <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[#002344] leading-tight">Voices of <span className="text-[#fb8500]">Transformation</span></h1>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedStories.map((story, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} onClick={() => setSelectedStory(story)} className="group bg-white rounded-[2rem] overflow-hidden border border-zinc-100 hover:border-[#fb8500]/20 shadow-sm hover:shadow-2xl hover:shadow-[#fb8500]/10 transition-all duration-500 cursor-pointer flex flex-col h-full">
                        <CardContent story={story} lang={lang} />
                    </motion.div>
                ))}
            </div>

            <StoryModal story={selectedStory} isOpen={!!selectedStory} onClose={() => setSelectedStory(null)} lang={lang} onToggleLang={toggleLang} />
        </div>
    );
}
