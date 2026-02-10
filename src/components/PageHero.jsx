import { motion } from "framer-motion";
import OptimizedImage from "./OptimizedImage";

/**
 * PageHero Component
 * A reusable hero section for subpages to maintain consistency with the home page.
 * 
 * @param {string} image - Path to the background image
 * @param {string} title - Main title of the page
 * @param {string} subtitle - English subtitle
 * @param {string} hindiSubtitle - Hindi translation of the subtitle
 * @param {string} height - Tailwind height class (default: min-h-[60vh])
 * @param {string} overlayOpacity - Tailwind background overlay class
 * @param {React.ReactNode} children - Additional content to be rendered in the hero
 */
export default function PageHero({
    image,
    title,
    subtitle,
    hindiSubtitle,
    height = "min-h-[60vh]",
    overlayOpacity = "bg-black/50",
    children
}) {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    return (
        <section className={`relative ${height} flex items-center justify-center bg-[#001529] text-white overflow-hidden pt-20`}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <OptimizedImage
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover brightness-[0.75]"
                />
                {/* Gradient Overlay for better text readability */}
                <div className={`absolute inset-0 ${overlayOpacity} bg-gradient-to-b from-[#001529]/60 via-transparent to-[#001529]/80`}></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 text-center max-w-5xl px-6 space-y-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="space-y-4"
                >
                    {/* Tiny decorative header */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="h-[1px] w-8 bg-[#FF6600]/60"></div>
                        <h2 className="text-[#FF6600] font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
                            Swastik Srijan Foundation
                        </h2>
                        <div className="h-[1px] w-8 bg-[#FF6600]/60"></div>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl font-serif">
                        {title}
                    </h1>

                    {/* Subtitles */}
                    {(subtitle || hindiSubtitle) && (
                        <div className="space-y-3 pt-2">
                            {subtitle && (
                                <p className="text-lg md:text-2xl font-light text-blue-50/90 tracking-wide max-w-3xl mx-auto">
                                    {subtitle}
                                </p>
                            )}
                            {hindiSubtitle && (
                                <p className="text-xl md:text-3xl font-hindi text-zinc-200/90 leading-relaxed font-light">
                                    {hindiSubtitle}
                                </p>
                            )}
                        </div>
                    )}

                    {children}
                </motion.div>
            </div>

            {/* Simple Bottom Decor */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
        </section>
    );
}
