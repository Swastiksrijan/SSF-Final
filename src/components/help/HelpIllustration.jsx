// Hand-built flat SVG scenes for the Help Centre category cards.
// No stock photos and no external assets — every scene is drawn here with the
// brand palette so cards stay crisp, light and consistent in both languages.
const NAVY = "#002344";
const NAVY_2 = "#0e4a70";
const TEAL = "#0e7490";
const ORANGE = "#FF6600";
const AMBER = "#FFD166";

function Frame({ id, children }) {
  return (
    <svg viewBox="0 0 320 150" role="img" aria-hidden="true" className="h-full w-full">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={NAVY} />
          <stop offset="1" stopColor={NAVY_2} />
        </linearGradient>
        <linearGradient id={`sun-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={AMBER} />
          <stop offset="1" stopColor={ORANGE} />
        </linearGradient>
      </defs>
      <rect width="320" height="150" fill={`url(#bg-${id})`} />
      <g opacity="0.14" fill="#fff">
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 12 }).map((__, c) => (
            <circle key={`${r}-${c}`} cx={18 + c * 26} cy={16 + r * 24} r="1.6" />
          ))
        )}
      </g>
      <circle cx="286" cy="26" r="46" fill={TEAL} opacity="0.22" />
      <circle cx="34" cy="134" r="34" fill={ORANGE} opacity="0.16" />
      {children}
    </svg>
  );
}

const S = {
  education: (id) => (
    <>
      <path d="M160 44 96 74l64 30 64-30z" fill={`url(#sun-${id})`} />
      <path d="M118 88v20c0 11 19 20 42 20s42-9 42-20V88l-42 20z" fill="#fff" opacity="0.92" />
      <rect x="216" y="74" width="6" height="34" rx="3" fill={AMBER} />
      <circle cx="219" cy="112" r="7" fill={AMBER} />
    </>
  ),
  career: (id) => (
    <>
      <rect x="112" y="66" width="96" height="58" rx="10" fill={`url(#sun-${id})`} />
      <rect x="142" y="52" width="36" height="20" rx="8" fill="none" stroke="#fff" strokeWidth="6" />
      <rect x="112" y="88" width="96" height="6" fill={NAVY} opacity="0.55" />
      <rect x="152" y="84" width="16" height="14" rx="3" fill="#fff" />
    </>
  ),
  government: (id) => (
    <>
      <path d="M160 34 96 62h128z" fill={`url(#sun-${id})`} />
      <rect x="104" y="66" width="112" height="8" rx="4" fill="#fff" opacity="0.9" />
      {[116, 140, 164, 188].map((x) => (
        <rect key={x} x={x} y="78" width="12" height="34" rx="4" fill="#fff" opacity="0.85" />
      ))}
      <rect x="104" y="114" width="112" height="10" rx="5" fill={AMBER} />
    </>
  ),
  documents: (id) => (
    <>
      <rect x="108" y="46" width="74" height="88" rx="8" fill="#fff" opacity="0.55" transform="rotate(-7 145 90)" />
      <rect x="126" y="40" width="76" height="92" rx="8" fill="#fff" />
      <g fill={TEAL} opacity="0.75">
        <rect x="142" y="58" width="44" height="7" rx="3.5" />
        <rect x="142" y="74" width="44" height="7" rx="3.5" />
        <rect x="142" y="90" width="30" height="7" rx="3.5" />
      </g>
      <circle cx="196" cy="112" r="18" fill={`url(#sun-${id})`} />
      <path d="m188 112 6 6 12-13" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  research: (id) => (
    <>
      <rect x="96" y="44" width="82" height="94" rx="8" fill="#fff" opacity="0.9" />
      <g fill={NAVY} opacity="0.35">
        <rect x="112" y="62" width="50" height="7" rx="3.5" />
        <rect x="112" y="78" width="50" height="7" rx="3.5" />
        <rect x="112" y="94" width="34" height="7" rx="3.5" />
      </g>
      <circle cx="196" cy="94" r="30" fill="none" stroke={`url(#sun-${id})`} strokeWidth="9" />
      <rect x="214" y="112" width="12" height="30" rx="6" fill={AMBER} transform="rotate(-45 220 127)" />
    </>
  ),
  agriculture: () => (
    <>
      <rect x="150" y="60" width="10" height="68" rx="5" fill="#fff" opacity="0.9" />
      <path d="M155 78c-26 2-38-12-38-30 20-2 36 10 38 30z" fill={AMBER} />
      <path d="M155 96c26 2 38-12 38-30-20-2-36 10-38 30z" fill={ORANGE} />
      <circle cx="248" cy="46" r="20" fill="#fff" opacity="0.9" />
    </>
  ),
  women: (id) => (
    <>
      <circle cx="160" cy="58" r="18" fill={`url(#sun-${id})`} />
      <path d="M160 82c-22 0-34 16-34 38h68c0-22-12-38-34-38z" fill="#fff" opacity="0.92" />
      <path d="M212 44l6-12 6 12 12 6-12 6-6 12-6-12-12-6z" fill={AMBER} />
    </>
  ),
  senior: (id) => (
    <>
      <circle cx="150" cy="56" r="17" fill={`url(#sun-${id})`} />
      <path d="M150 78c-20 0-30 16-30 40h60c0-24-10-40-30-40z" fill="#fff" opacity="0.92" />
      <rect x="196" y="70" width="7" height="62" rx="3.5" fill={AMBER} />
      <path d="M196 70a10 10 0 0 0-14 6" fill="none" stroke={AMBER} strokeWidth="7" strokeLinecap="round" />
    </>
  ),
  forms: (id) => (
    <>
      <rect x="104" y="40" width="96" height="100" rx="10" fill="#fff" />
      <g fill={TEAL} opacity="0.8">
        <rect x="120" y="58" width="30" height="7" rx="3.5" />
        <rect x="120" y="74" width="64" height="4" rx="2" />
        <rect x="120" y="88" width="64" height="4" rx="2" />
        <rect x="120" y="102" width="44" height="4" rx="2" />
      </g>
      <rect x="120" y="116" width="60" height="4" rx="2" fill={NAVY} opacity="0.3" />
      <path d="M214 40l34 34-70 70-40 6 6-40z" fill={`url(#sun-${id})`} transform="translate(-60 -10)" />
    </>
  ),
  digital: () => (
    <>
      <rect x="92" y="48" width="136" height="70" rx="8" fill="#fff" />
      <rect x="102" y="58" width="116" height="50" rx="4" fill={TEAL} opacity="0.7" />
      <path d="M80 122h160l-10 12H90z" fill={AMBER} />
      <circle cx="160" cy="84" r="14" fill="#fff" opacity="0.9" />
    </>
  ),
  cyber: (id) => (
    <>
      <path d="M160 34l56 20v34c0 40-26 62-56 74-30-12-56-34-56-74V54z" fill={`url(#sun-${id})`} />
      <rect x="140" y="82" width="40" height="34" rx="6" fill="#fff" />
      <path d="M148 82v-10a12 12 0 0 1 24 0v10" fill="none" stroke="#fff" strokeWidth="7" />
      <circle cx="160" cy="98" r="5" fill={NAVY} />
    </>
  ),
  email: (id) => (
    <>
      <rect x="88" y="52" width="144" height="92" rx="12" fill="#fff" />
      <path d="M88 64l72 52 72-52" fill="none" stroke={ORANGE} strokeWidth="8" strokeLinejoin="round" />
      <circle cx="230" cy="52" r="14" fill={AMBER} />
    </>
  ),
  website: (id) => (
    <>
      <rect x="84" y="44" width="152" height="104" rx="12" fill="#fff" />
      <rect x="84" y="44" width="152" height="26" rx="12" fill={`url(#sun-${id})`} />
      <circle cx="100" cy="57" r="4" fill="#fff" />
      <circle cx="114" cy="57" r="4" fill="#fff" opacity="0.7" />
      <rect x="100" y="84" width="58" height="8" rx="4" fill={TEAL} opacity="0.7" />
      <rect x="100" y="100" width="120" height="6" rx="3" fill={NAVY} opacity="0.25" />
      <rect x="100" y="114" width="90" height="6" rx="3" fill={NAVY} opacity="0.25" />
    </>
  ),
  legal: (id) => (
    <>
      <rect x="156" y="40" width="8" height="88" rx="4" fill="#fff" />
      <rect x="104" y="128" width="112" height="10" rx="5" fill={AMBER} />
      <rect x="108" y="56" width="104" height="7" rx="3.5" fill="#fff" />
      <path d="M118 63l-22 34h44z" fill={`url(#sun-${id})`} />
      <path d="M202 63l-22 34h44z" fill={`url(#sun-${id})`} />
    </>
  ),
  health: () => (
    <>
      <rect x="88" y="52" width="144" height="94" rx="14" fill="#fff" />
      <path d="M160 116s-34-20-34-42a20 20 0 0 1 34-13 20 20 0 0 1 34 13c0 22-34 42-34 42z" fill={ORANGE} />
      <path d="M150 92h20l-6-12-8 22-6-10z" fill="#fff" />
    </>
  ),
  ngo: (id) => (
    <>
      <path d="M160 40 96 66h128z" fill={`url(#sun-${id})`} />
      <rect x="104" y="70" width="112" height="8" rx="4" fill="#fff" opacity="0.9" />
      {[120, 148, 176, 196].map((x) => (
        <rect key={x} x={x} y="82" width="10" height="30" rx="4" fill="#fff" opacity="0.85" />
      ))}
      <path d="M96 122c8-10 20-10 28 0 8-10 20-10 28 0 8-10 20-10 28 0 8-10 20-10 28 0" fill="none" stroke={AMBER} strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  community: (id) => (
    <>
      {[112, 160, 208].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={i === 1 ? 52 : 62} r={i === 1 ? 16 : 13} fill={i === 1 ? `url(#sun-${id})` : "#fff"} />
          <path d={`M${x - 22} 122c0-18 10-30 22-30s22 12 22 30z`} fill={i === 1 ? ORANGE : "#fff"} opacity={i === 1 ? 1 : 0.9} />
        </g>
      ))}
    </>
  ),
  people: (id) => (
    <>
      <circle cx="134" cy="58" r="16" fill={`url(#sun-${id})`} />
      <path d="M104 124c0-20 13-34 30-34s30 14 30 34z" fill={ORANGE} />
      <circle cx="192" cy="64" r="13" fill="#fff" />
      <path d="M168 124c0-18 11-30 24-30s24 12 24 30z" fill="#fff" opacity="0.9" />
    </>
  )
};

export default function HelpIllustration({ name }) {
  const id = name || "default";
  const draw = S[name] || S.documents;
  return <Frame id={id}>{draw(id)}</Frame>;
}