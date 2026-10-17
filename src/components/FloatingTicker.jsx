import { motion as Motion } from "framer-motion";
import logoMark from "../assets/new-logo.png";

/* Certificate / letterhead finish shared by both cards: a faint logo
   watermark, a double gold rule inset from the edge, and gold corner
   ticks. Decorative only, so every piece is aria-hidden. */
const CardFinish = () => (
    <>
        <img
            src={logoMark}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.055]"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-[9px] rounded-[13px] border border-[#F7A814]/25" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-[14px] rounded-[10px] border border-[#F7A814]/12" />
        {["left-[9px] top-[9px] border-l border-t", "right-[9px] top-[9px] border-r border-t", "bottom-[9px] left-[9px] border-b border-l", "bottom-[9px] right-[9px] border-b border-r"].map((c) => (
            <span key={c} aria-hidden="true" className={`pointer-events-none absolute h-3.5 w-3.5 border-[#F7A814]/60 ${c}`} />
        ))}
    </>
);

const FloatingTicker = () => {
    const valuesText = "सेवा • समर्पण • समग्र विकास";

    return (
        <div className="relative z-30 -mt-5 px-4 md:px-10">
            <div className="mx-auto grid max-w-6xl gap-4 md:gap-5 lg:grid-cols-2 lg:items-stretch">
                {/* Left — identity + scrolling values ticker */}
                <Motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="bg-[#12345A] rounded-2xl shadow-xl border border-white/10 px-6 py-7 md:px-9 md:py-9 text-center text-white overflow-hidden relative flex flex-col justify-center"
                >
                    <CardFinish />
                    <div className="relative z-10 space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F7A814]">
                            Registered Society • Established 2013
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                            Operating Across India <span className="text-[#F7A814]/70">|</span> पंजीकृत संस्था • संपूर्ण भारत में कार्यक्षेत्र
                        </p>
                        <h2 className="pt-2 text-3xl md:text-4xl font-serif font-bold tracking-wide drop-shadow-md">
                            Swastik Srijan Foundation
                        </h2>
                        <p className="text-[#F7A814] font-medium text-lg md:text-xl tracking-wider uppercase font-sans">
                            Empowering Lives. Building a Better Bharat.
                        </p>
                    </div>

                    {/* Values line — static, no auto-scroll */}
                    <div className="relative z-10 mt-7 border-t border-white/10 pt-5">
                        <p className="text-xl md:text-2xl font-bold leading-normal text-white/90">
                            {valuesText}
                        </p>
                    </div>
                </Motion.div>

                {/* Right — our guiding promise */}
                <Motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.65 }}
                    className="bg-[#12345A] rounded-2xl shadow-xl border border-white/10 px-6 py-7 md:px-9 md:py-9 text-white relative overflow-hidden flex flex-col justify-center"
                >
                    <CardFinish />
                    <div className="absolute left-6 top-0 z-10 h-1 w-20 -translate-y-1/2 rounded-full bg-[#F7A814]"></div>
                    <p className="relative z-10 text-xs font-bold uppercase tracking-[0.22em] text-[#F7A814]">Our guiding promise</p>
                    <h2 className="relative z-10 mt-4 font-serif text-2xl leading-snug text-white md:text-3xl">Serve with integrity. Act with compassion.</h2>
                    <p className="relative z-10 mt-3 leading-relaxed text-slate-200">We strive to create lasting, meaningful social value through responsible action, community participation and cooperation.</p>
                    <div className="relative z-10 mt-5 border-t border-white/15 pt-5">
                        <p className="text-sm font-semibold text-[#F7A814]">हमारा संकल्प</p>
                        <p className="mt-2 leading-relaxed text-slate-200">ईमानदारी से सेवा, संवेदनशीलता के साथ कार्य और समाज के लिए स्थायी सकारात्मक परिवर्तन।</p>
                    </div>
                    <div className="relative z-10 mt-5 flex items-center gap-3 text-sm text-slate-300">
                        <span className="h-px flex-1 bg-[#F7A814]/45"></span>
                        <span>Since December 2013</span>
                        <span className="h-px flex-1 bg-[#F7A814]/45"></span>
                    </div>
                </Motion.div>
            </div>
        </div>
    );
};

export default FloatingTicker;
