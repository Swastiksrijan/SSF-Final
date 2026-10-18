import { useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import { IdCard, Award, HandCoins, UserRound, Share2, Check, Link as LinkIcon } from "lucide-react";
import html2canvas from "html2canvas";
import logoMark from "../assets/new-logo.png";
import AuthModal from "./AuthModal";

/* Colours are written as explicit rgba() rather than Tailwind's `/opacity`
   modifiers: Tailwind 4 compiles those to `oklab()`, which html2canvas cannot
   parse, and the join card is rendered to an image for sharing. */
const GOLD_RULE = "rgba(247,168,20,0.25)";
const GOLD_RULE_INNER = "rgba(247,168,20,0.12)";
const GOLD_TICK = "rgba(247,168,20,0.6)";
const HAIRLINE = "rgba(255,255,255,0.15)";
const CARD_EDGE = "rgba(255,255,255,0.10)";
const BTN_EDGE = "rgba(255,255,255,0.30)";

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
        <span aria-hidden="true" className="pointer-events-none absolute inset-[9px] rounded-[13px] border" style={{ borderColor: GOLD_RULE }} />
        <span aria-hidden="true" className="pointer-events-none absolute inset-[14px] rounded-[10px] border" style={{ borderColor: GOLD_RULE_INNER }} />
        {["left-[9px] top-[9px] border-l border-t", "right-[9px] top-[9px] border-r border-t", "bottom-[9px] left-[9px] border-b border-l", "bottom-[9px] right-[9px] border-b border-r"].map((c) => (
            <span key={c} aria-hidden="true" className={`pointer-events-none absolute h-3.5 w-3.5 ${c}`} style={{ borderColor: GOLD_TICK }} />
        ))}
    </>
);

/* One shell for all three cards. The grid stretches them to a common height and
   each card is a flex column, so the footer blocks line up across the row. */
const Card = ({ delay, children, innerRef }) => (
    <Motion.div
        ref={innerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
        className="relative flex flex-col overflow-hidden rounded-2xl border bg-[#12345A] px-6 py-7 text-white shadow-xl md:px-8 md:py-8"
        style={{ borderColor: CARD_EDGE }}
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

/* Hand-coded "Rising Together" mark: rising sun, gold rays and three figures.
   Pure SVG so it stays sharp at any size and inside the shared card image. */
const RisingTogether = () => (
    <svg viewBox="0 0 120 120" className="h-[104px] w-[104px] shrink-0" role="img" aria-label="Rising sun with people">
        <defs>
            <radialGradient id="ssfRiseGlow" cx="50%" cy="62%" r="58%">
                <stop offset="0%" stopColor="#F7A814" stopOpacity=".42" />
                <stop offset="100%" stopColor="#F7A814" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ssfRiseSun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFE3A6" />
                <stop offset="100%" stopColor="#F7A814" />
            </linearGradient>
        </defs>
        <circle cx="60" cy="74" r="52" fill="url(#ssfRiseGlow)" />
        <g stroke="#F7A814" strokeOpacity=".55" strokeWidth="2.6" strokeLinecap="round">
            <path d="M60 12 v11" /><path d="M22 24 l7 7" /><path d="M98 24 l-7 7" />
            <path d="M13 58 h11" /><path d="M96 58 h11" />
        </g>
        <circle cx="60" cy="104" r="27" fill="url(#ssfRiseSun)" />
        <path d="M16 84 H104" stroke="#F7A814" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
        <g fill="#12345A">
            {[[35, 0.84], [60, 1.12], [85, 0.84]].map(([x, s]) => (
                <g key={x} transform={`translate(${x} 84) scale(${s})`}>
                    <circle cx="0" cy="-38" r="8.4" />
                    <path d="M-9 -28 Q0 -31 9 -28 L11 0 L-11 0 Z" />
                    <path d="M-8 -26 L-18 -43" stroke="#12345A" strokeWidth="4.4" strokeLinecap="round" />
                    <path d="M8 -26 L18 -43" stroke="#12345A" strokeWidth="4.4" strokeLinecap="round" />
                </g>
            ))}
        </g>
        <g fill="#FFE3A6">
            <path d="M24 42 l1.7 4.6 L30 48 l-4.3 1.4 L24 54 l-1.7-4.6 L18 48 l4.3-1.4 Z" />
            <path d="M96 40 l1.4 3.8 L101 45 l-3.6 1.2 L96 50 l-1.4-3.8 L91 45 l3.6-1.2 Z" />
            <path d="M92 74 l1.1 3 L96 78 l-2.9 1 L92 82 l-1.1-3 L88 78 l2.9-1 Z" />
        </g>
    </svg>
);

/* Each feature tile carries its own hue — amber for the brand's ID card,
   emerald for certificates, orange for donors, sky for members — so the row
   reads as four distinct things instead of one grey block. Values are explicit
   rgba()/gradients because the card is rasterised by html2canvas, which cannot
   parse Tailwind 4's oklab() colours. */
const PROFILE_FEATURES = [
    ["Digital ID Card", "डिजिटल पहचान पत्र", IdCard, {
        icon: "#FFD37A",
        bg: "linear-gradient(150deg, rgba(247,168,20,0.30), rgba(247,168,20,0.06))",
        edge: "rgba(247,168,20,0.50)",
        chip: "rgba(247,168,20,0.22)",
    }],
    ["Certificates", "प्रमाण-पत्र", Award, {
        icon: "#7CE3B0",
        bg: "linear-gradient(150deg, rgba(52,211,153,0.30), rgba(52,211,153,0.06))",
        edge: "rgba(52,211,153,0.50)",
        chip: "rgba(52,211,153,0.22)",
    }],
    ["Donor Profile", "दाता प्रोफ़ाइल", HandCoins, {
        icon: "#FDA4AF",
        bg: "linear-gradient(150deg, rgba(251,113,133,0.30), rgba(251,113,133,0.06))",
        edge: "rgba(251,113,133,0.50)",
        chip: "rgba(251,113,133,0.22)",
    }],
    ["Member Profile", "सदस्य प्रोफ़ाइल", UserRound, {
        icon: "#8FD4FF",
        bg: "linear-gradient(150deg, rgba(56,189,248,0.30), rgba(56,189,248,0.06))",
        edge: "rgba(56,189,248,0.50)",
        chip: "rgba(56,189,248,0.22)",
    }],
];

const SHARE_TEXT = "Join Swastik Srijan Foundation — become a Member, Volunteer, Leadership, Intern, Donor or Partner.";
/* The hash drops the recipient straight onto the join card (see the id on the
   wrapper below) instead of the top of the home page. Hash fragments never
   reach the server, so the OG tags for `/` still drive the link preview. */
const SHARE_URL = "https://swastiksrijan.in/#join-ssf";

const FloatingTicker = () => {
    const [authMode, setAuthMode] = useState(null);
    const [shareState, setShareState] = useState("idle");
    const joinCardRef = useRef(null);

    /* WhatsApp/Instagram show a page link as a bare thumbnail, so the only way the
       full card travels is as an image. Render it and hand the file to the OS
       share sheet. The URL rides inside `text` rather than `url`, because Chrome
       rejects `url` whenever `files` is present — and without it the recipient
       gets a picture with nothing to tap. */
    const handleShare = async () => {
        setShareState("working");
        const message = `${SHARE_TEXT}\n${SHARE_URL}`;
        let file = null;
        try {
            if (joinCardRef.current) {
                const canvas = await html2canvas(joinCardRef.current, {
                    scale: 2, backgroundColor: "#12345A", useCORS: true, logging: false,
                });
                const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
                if (blob) file = new File([blob], "ssf-join-card.png", { type: "image/png" });
            }
        } catch { /* fall through to a link-only share */ }

        try {
            if (file && navigator.canShare?.({ files: [file] })) {
                await navigator.share({ files: [file], title: "Swastik Srijan Foundation", text: message });
            } else if (navigator.share) {
                await navigator.share({ title: "Swastik Srijan Foundation", text: message, url: SHARE_URL });
            } else {
                await navigator.clipboard.writeText(message);
            }
            setShareState("done");
        } catch {
            setShareState("idle");
            return;
        }
        setTimeout(() => setShareState("idle"), 2200);
    };

    const ShareIcon = shareState === "done" ? Check : shareState === "idle" ? Share2 : LinkIcon;

    return (
        <div id="join-ssf" className="relative z-30 -mt-5 scroll-mt-24 px-4 md:px-10">
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
                        <div className="border-t pt-5" style={{ borderColor: HAIRLINE }}>
                            <p className="text-xl font-bold leading-normal text-white/90 md:text-2xl">सेवा • समर्पण • समग्र विकास</p>
                            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">Since December 2013</p>
                        </div>
                    </Foot>
                </Card>

                {/* Centre — join SSF */}
                <Card delay={0.65} innerRef={joinCardRef}>
                    <div className="relative z-10 grid grid-cols-2 items-center gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <img src={logoMark} alt="" className="h-11 w-11 shrink-0 object-contain drop-shadow-[0_2px_10px_rgba(247,168,20,0.35)]" />
                            <div className="min-w-0 leading-tight">
                                <p className="text-[10.5px] font-black uppercase tracking-[0.12em] text-[#F7A814]">Swastik Srijan Foundation</p>
                                <p className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-300">Registered Society • Est. 2013</p>
                            </div>
                        </div>
                        <div className="flex justify-end border-l pl-3" style={{ borderColor: GOLD_RULE }}>
                            <RisingTogether />
                        </div>
                    </div>

                    <div className="mt-5">
                        <Eyebrow>Your Digital Connection • नया</Eyebrow>
                    </div>
                    <Title>Join the Mission. Make a Difference.</Title>
                    <Body>
                        SSF के साथ जुड़ें और अपनी डिजिटल प्रोफ़ाइल बनाएँ। Create your account as a Member, Volunteer or Donor.
                    </Body>
                    <Foot>
                        <div className="border-t pt-5" style={{ borderColor: HAIRLINE }}>
                            <div className="grid grid-cols-2 gap-2">
                                {PROFILE_FEATURES.map(([en, hi, Icon, tone]) => (
                                    <span
                                        key={en}
                                        className="flex flex-col items-center rounded-xl border px-2.5 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide text-white"
                                        style={{ borderColor: tone.edge, backgroundImage: tone.bg }}
                                    >
                                        <span
                                            className="mb-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full"
                                            style={{ backgroundColor: tone.chip, boxShadow: `0 0 12px ${tone.edge}` }}
                                        >
                                            <Icon aria-hidden="true" className="h-4 w-4" style={{ color: tone.icon }} />
                                        </span>
                                        {en}
                                        <span className="mt-0.5 block text-[9px] font-semibold normal-case tracking-normal" style={{ color: "rgba(255,255,255,0.75)" }}>{hi}</span>
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
                                    className="inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-white/10"
                                    style={{ borderColor: BTN_EDGE }}
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    disabled={shareState === "working"}
                                    className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white transition hover:bg-white/10 disabled:opacity-60"
                                    style={{ borderColor: BTN_EDGE }}
                                >
                                    <ShareIcon aria-hidden="true" className="h-3.5 w-3.5" />
                                    {shareState === "done" ? "Shared" : "Share"}
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
                        <div className="border-t pt-5" style={{ borderColor: HAIRLINE }}>
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
