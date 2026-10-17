import { useState } from "react";
import { motion as Motion } from "framer-motion";
import logoMark from "../assets/new-logo.png";
import AuthModal from "./AuthModal";

/* Certificate / letterhead finish shared by all three cards: a faint logo
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

/* One shell for all three cards. The grid stretches them to a common height and
   each card is a flex column, so the footer blocks line up across the row. */
const Card = ({ delay, children }) => (
    <Motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
        className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12345A] px-6 py-7 text-white shadow-xl md:px-8 md:py-8"
    >
        <CardFinish />
        {children}
    </Motion.div>
);

const Eyebrow = ({ children }) => (
    <p className="relative z-10 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F7A814]">{children}</p>
);

const Title = ({ children }) => (
    <h2 className="relative z-10 mt-3 font-serif text-xl font-bold leading-snug text-white lg:text-[22px] xl:text-[26px]">{children}</h2>
);

const Body = ({ children }) => (
    <p className="relative z-10 mt-3 text-sm leading-relaxed text-slate-200">{children}</p>
);

const Foot = ({ children }) => (
    <div className="relative z-10 mt-auto pt-5">{children}</div>
);

const PROFILE_FEATURES = [
    ["Digital ID Card", "डिजिटल पहचान पत्र"],
    ["Certificates", "प्रमाण-पत्र"],
    ["Donor Profile", "दाता प्रोफ़ाइल"],
    ["Member Profile", "सदस्य प्रोफ़ाइल"],
];

const FloatingTicker = () => {
    const [authMode, setAuthMode] = useState(null);

    return (
        <div className="relative z-30 -mt-5 px-4 md:px-10">
            <div className="mx-auto grid max-w-7xl gap-4 md:gap-5 lg:grid-cols-3 lg:items-stretch">
                {/* Left — identity + values */}
                <Card delay={0.5}>
                    <Eyebrow>Registered Society • Established 2013</Eyebrow>
                    <p className="relative z-10 mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                        Operating Across India <span className="text-[#F7A814]/70">|</span> पंजीकृत संस्था • संपूर्ण भारत में कार्यक्षेत्र
                    </p>
                    <Title>Swastik Srijan Foundation</Title>
                    <p className="relative z-10 mt-3 text-sm font-semibold uppercase tracking-wider text-[#F7A814]">
                        Empowering Lives. Building a Better Bharat.
                    </p>
                    <Foot>
                        <div className="border-t border-white/15 pt-5">
                            <p className="text-xl font-bold leading-normal text-white/90 md:text-2xl">सेवा • समर्पण • समग्र विकास</p>
                            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">Since December 2013</p>
                        </div>
                    </Foot>
                </Card>

                {/* Centre — join SSF (new) */}
                <Card delay={0.65}>
                    <Eyebrow>Your Digital Connection • नया</Eyebrow>
                    <Title>Join the Mission. Make a Difference.</Title>
                    <Body>
                        SSF के साथ जुड़ें और अपनी डिजिटल प्रोफ़ाइल बनाएँ। Create your account as a Member, Volunteer or Donor.
                    </Body>
                    <Foot>
                        <div className="border-t border-white/15 pt-5">
                            <div className="grid grid-cols-2 gap-2">
                                {PROFILE_FEATURES.map(([en, hi]) => (
                                    <span key={en} className="rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-2 text-center text-[10px] font-bold uppercase tracking-wide text-slate-100">
                                        {en}
                                        <span className="mt-0.5 block text-[9px] font-semibold normal-case tracking-normal text-slate-300">{hi}</span>
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAuthMode("signup")}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#F7A814] px-4 py-2.5 text-xs font-black uppercase tracking-wide text-[#12345A] transition hover:bg-white"
                                >
                                    Join SSF / Sign Up
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAuthMode("login")}
                                    className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-white/10"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </Foot>
                </Card>

                {/* Right — our guiding promise */}
                <Card delay={0.8}>
                    <Eyebrow>Our guiding promise</Eyebrow>
                    <Title>Serve with integrity. Act with compassion.</Title>
                    <Body>
                        We strive to create lasting, meaningful social value through responsible action, community participation and cooperation.
                    </Body>
                    <Foot>
                        <div className="border-t border-white/15 pt-5">
                            <p className="text-sm font-semibold text-[#F7A814]">हमारा संकल्प</p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-200">
                                ईमानदारी से सेवा, संवेदनशीलता के साथ कार्य और समाज के लिए स्थायी सकारात्मक परिवर्तन।
                            </p>
                        </div>
                    </Foot>
                </Card>
            </div>

            <AuthModal open={authMode !== null} initialMode={authMode || "signup"} onClose={() => setAuthMode(null)} />
        </div>
    );
};

export default FloatingTicker;
