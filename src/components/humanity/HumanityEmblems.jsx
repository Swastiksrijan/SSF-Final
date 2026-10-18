// Hand-drawn symbolic emblems for the Humanity & Truth page.
//
// Every mark is drawn here as pure SVG in the brand palette - no stock art and
// no photography. The page reflects on abstract ideas (the infinite, power,
// good and evil, neutrality), so abstract line marks fit it. Photos of the
// Foundation's beneficiaries would read as evidence for claims the page is not
// making, so they are deliberately not used here.

const NAVY = "#12345A";
const GREEN = "#176447";
const GOLD = "#F7A814";
const SOFT = "#EAF0F6";

const line = (color = NAVY, width = 2) => ({
  fill: "none",
  stroke: color,
  strokeWidth: width,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

const svg = { viewBox: "0 0 64 64", className: "h-full w-full", "aria-hidden": "true" };

// The chip carries a light plate by default. On the navy experience section a
// solid light plate is used instead so the dark strokes stay visible.
export function EmblemChip({ children, tone = "light", className = "" }) {
  const plate = tone === "dark"
    ? "border-white/25 bg-white/90"
    : "border-[#EAF0F6] bg-[#EAF0F6]/60";
  return (
    <span className={"inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border p-2.5 " + plate + " " + className}>
      {children}
    </span>
  );
}

// 2. संसार : अनंत और अज्ञात - orbit rings around a small sun, with far stars.
export function EmblemInfinite() {
  return (
    <svg {...svg}>
      <circle cx="32" cy="32" r="5.5" fill={GOLD} />
      <ellipse cx="32" cy="32" rx="23" ry="9" {...line(NAVY, 1.8)} transform="rotate(-28 32 32)" />
      <ellipse cx="32" cy="32" rx="23" ry="9" {...line(GREEN, 1.8)} opacity="0.55" transform="rotate(38 32 32)" />
      <circle cx="52" cy="21" r="2.2" fill={GOLD} />
      <circle cx="11" cy="45" r="1.9" fill={GREEN} />
      <path d="M15 12l1.3 3.1 3.1 1.3-3.1 1.3L15 20.8l-1.3-3.1-3.1-1.3 3.1-1.3z" fill={NAVY} opacity="0.45" />
      <path d="M49 45l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill={NAVY} opacity="0.45" />
    </svg>
  );
}

// 3. क्या कोई शक्ति है? - a radiant source; the question is the space between rays.
export function EmblemPower() {
  return (
    <svg {...svg}>
      <circle cx="32" cy="32" r="8" {...line(GOLD, 2.2)} />
      <circle cx="32" cy="32" r="2.6" fill={GOLD} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="32" y1="19" x2="32" y2="13" {...line(NAVY, 1.8)} transform={`rotate(${a} 32 32)`} />
      ))}
    </svg>
  );
}

// 4. धर्म और शास्त्र - an open book with a flame above it.
export function EmblemScriptures() {
  return (
    <svg {...svg}>
      <path d="M10 46V30c8-4 16-4 22 0v16" {...line(NAVY, 1.9)} />
      <path d="M54 46V30c-8-4-16-4-22 0" {...line(NAVY, 1.9)} />
      <path d="M10 46c8-4 16-4 22 0 8-4 16-4 22 0" {...line(GREEN, 1.9)} />
      <path d="M32 30v16" {...line(GREEN, 1.6)} />
      <path d="M32 16c3.2 4.2 4.8 6.8 4.8 9.4a4.8 4.8 0 1 1-9.6 0c0-2.6 1.6-5.2 4.8-9.4z" fill={GOLD} opacity="0.9" />
    </svg>
  );
}

// 5. राम : मानव मूल्य का आदर्श - a balanced scale (values, not weapons).
export function EmblemBalance() {
  return (
    <svg {...svg}>
      <circle cx="32" cy="14" r="2.6" fill={GOLD} />
      <path d="M32 17v33" {...line(NAVY, 2)} />
      <path d="M16 23h32" {...line(NAVY, 2)} />
      <path d="M16 23v4M48 23v4" {...line(NAVY, 1.6)} />
      <path d="M10 27q6 8 12 0" {...line(GREEN, 1.9)} />
      <path d="M42 27q6 8 12 0" {...line(GREEN, 1.9)} />
      <path d="M24 50h16" {...line(NAVY, 2)} />
    </svg>
  );
}

// 6. अच्छाई और बुराई - one circle, half in light, half in shadow.
export function EmblemDual() {
  return (
    <svg {...svg}>
      <circle cx="32" cy="32" r="19" fill={SOFT} />
      <path d="M32 13a19 19 0 0 1 0 38z" fill={NAVY} opacity="0.82" />
      <circle cx="32" cy="32" r="19" {...line(NAVY, 2)} />
      <path d="M22 36c0-5 3.5-8.5 8.5-8.5" {...line(GREEN, 1.8)} />
      <circle cx="22" cy="36" r="1.7" fill={GREEN} />
      <path d="M40 28l4.5 4-4.5 4" {...line(GOLD, 1.8)} />
    </svg>
  );
}

// 7. समाज, जाति, वर्ग, राष्ट्र - distinct points held in one ring.
const RING = [[50, 32], [44.7, 19.3], [32, 14], [19.3, 19.3], [14, 32], [19.3, 44.7], [32, 50], [44.7, 44.7]];
export function EmblemSociety() {
  return (
    <svg {...svg}>
      <circle cx="32" cy="32" r="18" {...line(NAVY, 1.5)} opacity="0.35" />
      {RING.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.7" fill={i % 2 ? GREEN : GOLD} />)}
      <circle cx="32" cy="32" r="3.6" fill={NAVY} />
    </svg>
  );
}

// 8. शासन, सत्ता - a classical column: structure that must carry accountability.
export function EmblemPillar() {
  return (
    <svg {...svg}>
      <path d="M14 15h36" {...line(NAVY, 2.2)} />
      <path d="M19 15v29M45 15v29" {...line(NAVY, 1.8)} />
      <path d="M27 15v29M37 15v29" {...line(NAVY, 1.5)} opacity="0.5" />
      <path d="M12 44h40" {...line(NAVY, 2.2)} />
      <path d="M14 50h36" {...line(GOLD, 1.8)} opacity="0.7" />
    </svg>
  );
}

// 9. तटस्थता का भ्रम - the same scale, tilted: silence is not balance.
export function EmblemTilt() {
  return (
    <svg {...svg}>
      <circle cx="32" cy="14" r="2.6" fill={GOLD} />
      <path d="M32 17v33" {...line(NAVY, 2)} />
      <path d="M16 22l32 9" {...line(NAVY, 2)} />
      <path d="M16 22v4M48 31v4" {...line(NAVY, 1.5)} />
      <path d="M10 26q6 8 12 0" {...line(GREEN, 1.9)} />
      <path d="M42 35q6 8 12 0" {...line(GREEN, 1.9)} />
      <path d="M24 50h16" {...line(NAVY, 2)} />
    </svg>
  );
}

// 10. प्रकृति और अन्य जीव - a tree and a bird, respect rather than use.
export function EmblemNature() {
  return (
    <svg {...svg}>
      <path d="M25 52V34" {...line(GREEN, 2)} />
      <circle cx="25" cy="24" r="12" fill={GREEN} opacity="0.14" />
      <circle cx="25" cy="24" r="12" {...line(GREEN, 1.8)} />
      <path d="M25 44c-6.5 0-10-3.8-10-9 5.5 0 10 3.8 10 9z" {...line(GREEN, 1.6)} />
      <path d="M41 20c2.8-3.8 6-3.8 8.6 0 2.6-3.8 5.8-3.8 8.6 0" {...line(NAVY, 1.8)} />
    </svg>
  );
}

// 11. आज की दुनिया - a connected globe.
export function EmblemWorld() {
  return (
    <svg {...svg}>
      <circle cx="32" cy="32" r="19" {...line(NAVY, 2)} />
      <ellipse cx="32" cy="32" rx="8" ry="19" {...line(GREEN, 1.6)} opacity="0.7" />
      <path d="M13 32h38" {...line(GREEN, 1.6)} opacity="0.7" />
      <path d="M17.5 21.5h29M17.5 42.5h29" {...line(GREEN, 1.4)} opacity="0.45" />
      <circle cx="42" cy="24" r="2.2" fill={GOLD} />
      <circle cx="24" cy="41" r="2" fill={GOLD} />
    </svg>
  );
}

// 12. ब्रह्मांड और अज्ञान - a galaxy turning, most of it still unknown.
export function EmblemUniverse() {
  return (
    <svg {...svg}>
      <path d="M32 24c6-12 20-12 25 0" {...line(NAVY, 1.9)} />
      <path d="M32 40c-6 12-20 12-25 0" {...line(GREEN, 1.9)} />
      <circle cx="32" cy="32" r="4" fill={GOLD} />
      <circle cx="55" cy="17" r="2.2" fill={NAVY} opacity="0.5" />
      <circle cx="9" cy="47" r="2.2" fill={NAVY} opacity="0.5" />
      <circle cx="50" cy="50" r="1.8" fill={GOLD} opacity="0.75" />
      <circle cx="14" cy="14" r="1.8" fill={GOLD} opacity="0.75" />
    </svg>
  );
}

// 13. SSF का अनुभव - open hands holding a heart: listening is the cure.
export function EmblemHands() {
  return (
    <svg {...svg}>
      <path d="M10 26c2.8 12 11.8 18 22 18s19.2-6 22-18" {...line(NAVY, 2)} />
      <path d="M32 38l-7-7a4.6 4.6 0 0 1 7-6 4.6 4.6 0 0 1 7 6z" fill={GOLD} />
      <path d="M10 26c-2.4-2.4-2.4-6 0-8.4M54 26c2.4-2.4 2.4-6 0-8.4" {...line(GREEN, 1.7)} />
    </svg>
  );
}

// 14. अंतिम निष्कर्ष : सबका साझा सत्य - many petals, one centre.
export function EmblemUnity() {
  return (
    <svg {...svg}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse key={a} cx="32" cy="32" rx="5.4" ry="13" {...line(NAVY, 1.5)} opacity="0.5" transform={`rotate(${a} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="6" fill={GOLD} />
    </svg>
  );
}
