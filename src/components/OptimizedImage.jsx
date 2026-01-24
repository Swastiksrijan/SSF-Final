import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * OptimizedImage Component
 * Features:
 * - Lazy loading by default
 * - Fallback image on error
 * - Loading skeleton/animation
 * - Smooth fade-in transition
 */
export default function OptimizedImage({
    src,
    alt,
    className = "",
    fallback = "/images/logo.png", // Using the project logo as default fallback
    objectFit = "cover",
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    // Reset state if src changes
    useEffect(() => {
        setIsLoaded(false);
        setHasError(false);
        setCurrentSrc(src);
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        if (fallback && currentSrc !== fallback) {
            setCurrentSrc(fallback);
        }
    };

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ minHeight: "20px" }}>
            {/* Loading Skeleton / Placeholder */}
            <AnimatePresence>
                {!isLoaded && !hasError && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-zinc-100 animate-pulse z-10 flex items-center justify-center"
                    >
                        <div className="w-12 h-12 border-4 border-[#002344]/10 border-t-[#002344] rounded-full animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actual Image */}
            <motion.img
                src={currentSrc}
                alt={alt}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{
                    opacity: isLoaded ? 1 : 0,
                    scale: isLoaded ? 1 : 1.05
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onLoad={handleLoad}
                onError={handleError}
                loading="lazy"
                className={`w-full h-full object-${objectFit} transition-transform duration-700`}
                {...props}
            />

            {/* Error State Overlay (Optional simple indicator) */}
            {hasError && currentSrc === fallback && (
                <div className="absolute inset-x-0 bottom-0 bg-black/20 backdrop-blur-sm py-1 px-2">
                    <p className="text-[10px] text-white/80 text-center font-medium uppercase tracking-widest">
                        Image Unavailable
                    </p>
                </div>
            )}
        </div>
    );
}
