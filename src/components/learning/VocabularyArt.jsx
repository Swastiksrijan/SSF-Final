/**
 * Code-generated SVG art for the Vocabulary Building / शब्द भंडार course.
 *
 * Vocabulary is abstract, so scenes combine coded shapes with glyphs (letters,
 * arrows, bubbles) — never stock photos. `chapterArt(id)` maps each chapter to
 * a scene; `HeroArt` and `CardArt` are used by the hub.
 */

import { useId } from "react";

const NAVY = "#0b3a63";
const ORANGE = "#FF6600";
const YELLOW = "#FFD166";
const SKY = "#8ecae6";
const GREEN = "#2f9e44";
const PURPLE = "#7048e8";
const ROSE = "#e64980";

function Tile({ children, bg = NAVY, label = "Vocabulary illustration" }) {
  const uid = useId().replace(/[:]/g, "");
  const gid = "vcgloss-" + uid;
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <rect x="-100" y="-100" width="200" height="200" rx="26" fill={bg} />
      <rect x="-100" y="-100" width="200" height="200" rx="26" fill={`url(#${gid})`} />
      <defs>
        <radialGradient id={gid} cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {children}
    </svg>
  );
}

const cap = (t, fill = "#fff", y = 86, size = 13) => <text x="0" y={y} textAnchor="middle" fontSize={size} fontWeight="900" fill={fill} letterSpacing="0.4">{t}</text>;

/* ------------------------------- small pieces ------------------------------ */

function Card({ x = 0, y = 0, w = 120, h = 74, fill = "#fff", rot = 0, children }) {
  return <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="12" fill={fill} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="12" fill="none" stroke="#00000022" strokeWidth="2" />
    {children}
  </g>;
}

function Magnifier({ cx = 0, cy = 0, r = 30, handle = 30 }) {
  return <g transform={`translate(${cx},${cy})`}>
    <circle r={r} fill="#ffffff" opacity="0.14" />
    <circle r={r} fill="none" stroke={YELLOW} strokeWidth="7" />
    <line x1={r * 0.7} y1={r * 0.7} x2={r * 0.7 + handle} y2={r * 0.7 + handle} stroke={YELLOW} strokeWidth="9" strokeLinecap="round" />
  </g>;
}

/* ---------------------------------- scenes --------------------------------- */

export function WordCardArt() {
  return <Tile label="Word card">
    <Card x={-6} y={-16} w={132} h={84}>
      <text x={-6} y={-30} textAnchor="middle" fontSize="13" fontWeight="900" fill={NAVY}>WORD</text>
      <text x={-6} y={-6} textAnchor="middle" fontSize="26" fontWeight="900" fill={ORANGE}>साहस</text>
      <line x1={-52} y1={8} x2={40} y2={8} stroke="#00000022" strokeWidth="2" />
      <text x={-6} y={28} textAnchor="middle" fontSize="14" fontWeight="800" fill={GREEN}>Courage</text>
    </Card>
    {cap("Word → Meaning", "#fff", 82)}
  </Tile>;
}

export function ContextArt() {
  return <Tile label="Context clues">
    <Card x={-2} y={-18} w={150} h={58} fill="#f8fafc">
      <text x={-6} y={-2} textAnchor="middle" fontSize="12" fontWeight="800" fill={NAVY}>“walking all day</text>
      <text x={-6} y={16} textAnchor="middle" fontSize="12" fontWeight="800" fill={NAVY}>under the sun”</text>
    </Card>
    <Magnifier cx={-46} cy={-16} r={22} handle={18} />
    {cap("Context Clues", YELLOW, 82)}
  </Tile>;
}

export function MultipleMeaningsArt() {
  return <Tile label="One word many meanings">
    <Card x={-40} y={-18} w={78} h={78}>
      <text x={-40} y={-6} textAnchor="middle" fontSize="30">🏦</text>
      <text x={-40} y={26} textAnchor="middle" fontSize="11" fontWeight="800" fill={NAVY}>money</text>
    </Card>
    <Card x={44} y={-18} w={78} h={78}>
      <text x={44} y={-6} textAnchor="middle" fontSize="30">🏞️</text>
      <text x={44} y={26} textAnchor="middle" fontSize="11" fontWeight="800" fill={NAVY}>river</text>
    </Card>
    <text x={0} y={-24} textAnchor="middle" fontSize="15" fontWeight="900" fill={YELLOW}>bank</text>
    {cap("अनेक अर्थ", "#fff", 84)}
  </Tile>;
}

export function SynonymsArt() {
  const words = ["जल", "पानी", "नीर"];
  return <Tile label="Synonyms">
    <path d="M-62 8 h124" stroke="#ffffff55" strokeWidth="6" strokeLinecap="round" />
    {words.map((w, i) => <g key={i} transform={`translate(${-46 + i * 46},-16)`}>
      <circle r="20" fill={i === 0 ? GREEN : i === 1 ? SKY : PURPLE} />
      <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="900" fill={NAVY}>{w}</text>
    </g>)}
    {cap("Synonyms", YELLOW, 82)}
  </Tile>;
}

export function AntonymsArt() {
  return <Tile label="Antonyms">
    <g transform="translate(-38,0)">
      <path d="M0 30 V-30" stroke={GREEN} strokeWidth="8" strokeLinecap="round" />
      <path d="M-14 -14 L0 -34 L14 -14" fill="none" stroke={GREEN} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="0" y="48" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">ऊँचा</text>
    </g>
    <g transform="translate(38,0)">
      <path d="M0 -30 V30" stroke={ORANGE} strokeWidth="8" strokeLinecap="round" />
      <path d="M-14 14 L0 34 L14 14" fill="none" stroke={ORANGE} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <text x="0" y="48" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">नीचा</text>
    </g>
    {cap("Antonyms", YELLOW, 82)}
  </Tile>;
}

export function PrecisionArt() {
  return <Tile label="Word precision">
    {[34, 24, 14].map((r, i) => <circle key={i} r={r} fill="none" stroke={i === 2 ? ORANGE : "#ffffff66"} strokeWidth="4" />)}
    <circle r="6" fill={ORANGE} />
    <text x="0" y="-44" textAnchor="middle" fontSize="14" fontWeight="900" fill={YELLOW}>precise</text>
    {cap("सही शब्द चुनो", "#fff", 84)}
  </Tile>;
}

export function ActivePassiveArt() {
  return <Tile label="Active and passive vocabulary">
    <g transform="translate(-38,-14)"><text x="0" y="0" textAnchor="middle" fontSize="40">👂</text></g>
    <g transform="translate(38,-14)"><text x="0" y="0" textAnchor="middle" fontSize="40">🔊</text></g>
    <text x="-38" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">Passive</text>
    <text x="38" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill={YELLOW}>Active</text>
    <path d="M-14 -14 h28" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" />
    <path d="M8 -20 l8 6 l-8 6" fill="none" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    {cap("पढ़ना → बोलना", "#fff", 84)}
  </Tile>;
}

export function WordFamilyArt() {
  const leaves = ["creation", "creative", "creatively", "creator"];
  return <Tile label="Word family tree" bg="#0f3d2e">
    <rect x="-6" y="-2" width="12" height="40" rx="5" fill="#7a4a1e" />
    <circle cx="0" cy="-20" r="30" fill={GREEN} />
    <text x="0" y="-14" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">create</text>
    {leaves.map((w, i) => <g key={i} transform={`translate(${-58 + i * 38},44)`}>
      <rect x="-17" y="-10" width="34" height="20" rx="8" fill={YELLOW} />
      <text x="0" y="4" textAnchor="middle" fontSize="8" fontWeight="800" fill={NAVY}>{w}</text>
    </g>)}
  </Tile>;
}

export function WordPartsArt() {
  return <Tile label="Prefix and suffix">
    <Card x={-40} y={-14} w={62} h={52} fill={ROSE}>
      <text x={-40} y={4} textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">un</text>
    </Card>
    <text x={-2} y={6} textAnchor="middle" fontSize="26" fontWeight="900" fill={YELLOW}>+</text>
    <Card x={40} y={-14} w={68} h={52} fill={SKY}>
      <text x={40} y={4} textAnchor="middle" fontSize="18" fontWeight="900" fill={NAVY}>happy</text>
    </Card>
    <text x={0} y={48} textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">→ unhappy</text>
    {cap("un + happy", YELLOW, 82)}
  </Tile>;
}

export function DictionaryArt() {
  return <Tile label="Dictionary entry">
    <Card x={0} y={-10} w={140} h={120} fill="#fff">
      <text x={0} y={-60} textAnchor="middle" fontSize="11" fontWeight="900" fill="#94a3b8">DICTIONARY</text>
      <text x={0} y={-30} textAnchor="middle" fontSize="22" fontWeight="900" fill={NAVY}>branch</text>
      <text x={0} y={-10} textAnchor="middle" fontSize="11" fontWeight="700" fill={GREEN}>/brɑːntʃ/ · noun</text>
      <text x={-60} y={14} fontSize="9" fontWeight="700" fill="#475569">1. tree part</text>
      <text x={-60} y={30} fontSize="9" fontWeight="700" fill="#475569">2. office division</text>
      <text x={-60} y={46} fontSize="9" fontWeight="700" fill="#475569">3. subject division</text>
    </Card>
    {cap("Dictionary", "#fff", 92)}
  </Tile>;
}

export function ReadingArt() {
  return <Tile label="Vocabulary from reading">
    <Card x={-14} y={-16} w={120} h={96} fill="#fff">
      {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={-62} y1={-44 + i * 20} x2={i === 4 ? -6 : 40} y2={-44 + i * 20} stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />)}
      <rect x={-30} y={-6} width="26" height="10" rx="4" fill={YELLOW} />
    </Card>
    <text x={56} y={-20} textAnchor="middle" fontSize="34">💡</text>
    {cap("Reading से सीखो", "#fff", 82)}
  </Tile>;
}

export function RegisterArt() {
  return <Tile label="Formal and informal register">
    <g transform="translate(-40,-14)">
      <path d="M-30 -18 h60 a10 10 0 0 1 10 10 v14 a10 10 0 0 1 -10 10 h-30 l-14 12 v-12 h-16 a10 10 0 0 1 -10 -10 v-14 a10 10 0 0 1 10 -10 z" fill={SKY} />
      <text x="0" y="6" textAnchor="middle" fontSize="12" fontWeight="900" fill={NAVY}>यार!</text>
    </g>
    <g transform="translate(42,16)">
      <path d="M-32 -18 h64 a10 10 0 0 1 10 10 v16 a10 10 0 0 1 -10 10 h-34 l-16 13 v-13 h-14 a10 10 0 0 1 -10 -10 v-16 a10 10 0 0 1 10 -10 z" fill={ORANGE} />
      <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">कृपया…</text>
    </g>
    {cap("Formal / Informal", YELLOW, 82)}
  </Tile>;
}

export function AcademicArt() {
  return <Tile label="Academic vocabulary">
    <Card x={0} y={-6} w={150} h={104} fill="#fff">
      <text x={0} y={-40} textAnchor="middle" fontSize="11" fontWeight="900" fill="#94a3b8">ACADEMIC WORDS</text>
      {["explain", "describe", "compare", "analyze"].map((w, i) => <g key={i} transform={`translate(${i % 2 ? 36 : -36},${-18 + Math.floor(i / 2) * 30})`}>
        <rect x="-32" y="-11" width="64" height="22" rx="8" fill={i === 3 ? ORANGE : "#eef4f9"} />
        <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="800" fill={i === 3 ? "#fff" : NAVY}>{w}</text>
      </g>)}
    </Card>
    {cap("🎓 Academic", "#fff", 88)}
  </Tile>;
}

export function SpeakingArt() {
  return <Tile label="Speaking vocabulary">
    <g transform="translate(0,-10)">
      <rect x="-14" y="-40" width="28" height="52" rx="14" fill={YELLOW} />
      <path d="M-24 6 a24 24 0 0 0 48 0" fill="none" stroke={ORANGE} strokeWidth="7" strokeLinecap="round" />
      <line x1="0" y1="30" x2="0" y2="46" stroke={ORANGE} strokeWidth="7" strokeLinecap="round" />
      <line x1="-14" y1="46" x2="14" y2="46" stroke={ORANGE} strokeWidth="7" strokeLinecap="round" />
    </g>
    {cap("🗣️ Speaking", "#fff", 84)}
  </Tile>;
}

export function WritingArt() {
  return <Tile label="Writing vocabulary">
    <g transform="translate(-40,4)"><text x="0" y="0" textAnchor="middle" fontSize="38">✍️</text></g>
    <text x="-40" y="-40" textAnchor="middle" fontSize="12" fontWeight="900" fill="#ffffff99">good</text>
    <path d="M-14 -10 h24" stroke={YELLOW} strokeWidth="5" strokeLinecap="round" />
    <path d="M2 -16 l8 6 l-8 6" fill="none" stroke={YELLOW} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    {["effective", "useful", "precise"].map((w, i) => <text key={i} x={34} y={-22 + i * 20} textAnchor="middle" fontSize="12" fontWeight="900" fill={i === 0 ? YELLOW : "#fff"}>{w}</text>)}
    {cap("vague → precise", "#fff", 84)}
  </Tile>;
}

export function RevisionArt() {
  return <Tile label="Revision cycle">
    <g fill="none" stroke={SKY} strokeWidth="7" strokeLinecap="round">
      <path d="M-40 -6 a40 40 0 1 1 -12 28" />
      <path d="M-58 6 l6 -16 l16 8 z" fill={SKY} stroke="none" />
    </g>
    {[["Encounter", -42, -40], ["Understand", 42, -40], ["Recall", -52, 44], ["Use", 52, 44]].map(([t, x, y], i) => <text key={i} x={x} y={y} textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">{t}</text>)}
    <text x="0" y="6" textAnchor="middle" fontSize="22">🔁</text>
    {cap("Revision cycle", YELLOW, 84)}
  </Tile>;
}

export function GamesArt() {
  return <Tile label="Vocabulary games">
    <g transform="translate(0,-8)">
      <rect x="-34" y="-34" width="68" height="68" rx="14" fill="#fff" />
      {[[-18, -18], [0, -18], [18, -18], [-18, 0], [0, 0], [18, 0], [-18, 18], [0, 18], [18, 18]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill={[ORANGE, GREEN, SKY, YELLOW, ROSE, PURPLE][i % 6]} />)}
    </g>
    {cap("🎲 Practice Games", "#fff", 84)}
  </Tile>;
}

export function DetectiveArt() {
  return <Tile label="Word detective">
    <Card x={-6} y={-14} w={132} h={86} fill="#f8fafc">
      {[0, 1, 2, 3].map((i) => <line key={i} x1={-56} y1={-36 + i * 20} x2={i === 2 ? 4 : 44} y2={-36 + i * 20} stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />)}
    </Card>
    <Magnifier cx={30} cy={18} r={24} handle={20} />
    {cap("🕵️ Word Detective", "#fff", 84)}
  </Tile>;
}

export function WordBankArt() {
  return <Tile label="Personal word bank">
    <Card x={0} y={-6} w={126} h={116} fill="#fff">
      <rect x="-52" y="-48" width="104" height="14" rx="7" fill={ORANGE} />
      {[0, 1, 2, 3, 4].map((i) => <g key={i}>
        <line x1={-46} y1={-22 + i * 20} x2={i % 2 ? 30 : 44} y2={-22 + i * 20} stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        <circle cx={-54} cy={-22 + i * 20} r="3.5" fill={GREEN} />
      </g>)}
    </Card>
    {cap("🗂️ Word Bank", "#fff", 92)}
  </Tile>;
}

export function TrophyArt() {
  return <Tile label="Mastery" bg="#5a3b00">
    <text x="0" y="18" textAnchor="middle" fontSize="72">🏆</text>
    {cap("Vocabulary Mastery", YELLOW, 86)}
  </Tile>;
}

/* --------------------------------- mappings -------------------------------- */

const MAP = {
  c1: WordCardArt,
  c2: ContextArt,
  c3: MultipleMeaningsArt,
  c4: SynonymsArt,
  c5: AntonymsArt,
  c6: PrecisionArt,
  c7: ActivePassiveArt,
  c8: WordFamilyArt,
  c9: WordPartsArt,
  c10: DictionaryArt,
  c11: ReadingArt,
  c12: RegisterArt,
  c13: AcademicArt,
  c14: SpeakingArt,
  c15: WritingArt,
  c16: RevisionArt,
  c17: GamesArt,
  c18: DetectiveArt,
  c19: WordBankArt,
  c20: TrophyArt,
};

export function chapterArt(id) {
  const C = MAP[id] || WordCardArt;
  return <C />;
}

/** Compact art for the hub course card. */
export function CardArt() {
  return <Tile label="Vocabulary Building">
    <Card x={-4} y={-18} w={118} h={82}>
      <text x={-4} y={-30} textAnchor="middle" fontSize="12" fontWeight="900" fill={NAVY}>WORD</text>
      <text x={-4} y={-2} textAnchor="middle" fontSize="24" fontWeight="900" fill={ORANGE}>शब्द</text>
      <text x={-4} y={24} textAnchor="middle" fontSize="12" fontWeight="800" fill={GREEN}>vocabulary</text>
    </Card>
    <g transform="translate(52,44)"><text x="0" y="0" textAnchor="middle" fontSize="26">💬</text></g>
  </Tile>;
}

/** Large header illustration: an open book with floating word cards. */
export function HeroArt({ className = "" }) {
  const uid = useId().replace(/[:]/g, "");
  const bgId = "vchero-" + uid;
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Vocabulary words illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#123a5f" /><stop offset="1" stopColor="#001529" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="26" fill={`url(#${bgId})`} />
      {[[40, 44], [96, 78], [304, 40], [352, 96], [214, 28], [150, 268], [290, 262]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" opacity="0.7" />)}
      {/* floating word cards */}
      <g transform="translate(96,70) rotate(-8)"><rect x="-46" y="-24" width="92" height="48" rx="12" fill={YELLOW} /><text x="0" y="7" textAnchor="middle" fontSize="18" fontWeight="900" fill="#0b3a63">साहस</text></g>
      <g transform="translate(300,84) rotate(7)"><rect x="-50" y="-22" width="100" height="44" rx="12" fill={SKY} /><text x="0" y="6" textAnchor="middle" fontSize="15" fontWeight="900" fill="#0b3a63">courage</text></g>
      <g transform="translate(320,168) rotate(-6)"><rect x="-48" y="-20" width="96" height="40" rx="12" fill={ROSE} /><text x="0" y="6" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff">reliable</text></g>
      {/* open book */}
      <g transform="translate(200,214)">
        <path d="M-120 20 C -70 -4 -20 -4 0 12 C 20 -4 70 -4 120 20 L 120 54 C 70 30 20 30 0 46 C -20 30 -70 30 -120 54 Z" fill="#f8fafc" />
        <path d="M0 12 V46" stroke="#cbd5e1" strokeWidth="4" />
        <path d="M-120 20 C -70 -4 -20 -4 0 12 C 20 -4 70 -4 120 20" fill="none" stroke={ORANGE} strokeWidth="4" />
        {[-88, -60, -32].map((x, i) => <line key={i} x1={x} y1={26} x2={x + 34} y2={22} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />)}
        {[32, 60, 88].map((x, i) => <line key={i} x1={x} y1={22} x2={x + 26} y2={26} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />)}
      </g>
      <text x="200" y="292" textAnchor="middle" fontSize="16" fontWeight="900" fill={YELLOW} letterSpacing="0.5">शब्द भंडार</text>
    </svg>
  );
}
