/**
 * Code-generated SVG art for the Trees & Forests / वृक्ष एवं जंगल course.
 *
 * Forest is visual, so scenes are coded (trees, layers, food chains, maps) with
 * emoji accents — never stock photos. `chapterArt(id)` maps each chapter to a
 * scene; `HeroArt` and `CardArt` are used by the hub.
 */

import { useId } from "react";

const NAVY = "#0b3a63";
const ORANGE = "#FF6600";
const YELLOW = "#FFD166";
const SKY = "#8ecae6";
const GREEN = "#2f9e44";
const DARKGREEN = "#166534";
const BROWN = "#7a4a1e";
const PURPLE = "#7048e8";

function Tile({ children, bg = NAVY, label = "Trees and forests illustration" }) {
  const uid = useId().replace(/[:]/g, "");
  const gid = "tfgloss-" + uid;
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

const cap = (t, fill = "#fff", y = 86, size = 13) => <text x="0" y={y} textAnchor="middle" fontSize={size} fontWeight="900" fill={fill} letterSpacing="0.3">{t}</text>;

function Tree({ x = 0, y = 0, s = 1, leaf = GREEN, trunk = BROWN }) {
  return <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x="-6" y="6" width="12" height="34" rx="4" fill={trunk} />
    <circle cx="0" cy="-8" r="30" fill={leaf} />
    <circle cx="-20" cy="4" r="20" fill={leaf} />
    <circle cx="20" cy="4" r="20" fill={leaf} />
  </g>;
}

/* ---------------------------------- scenes --------------------------------- */

export function WhatIsTreeArt() {
  return <Tile label="What is a tree">
    <Tree x={0} y={6} s={1.2} />
    <text x="0" y="-58" textAnchor="middle" fontSize="13" fontWeight="900" fill={YELLOW}>जीवित organism</text>
    {cap("🌳 पेड़ क्या है?", "#fff", 84)}
  </Tile>;
}

export function TreePartsArt() {
  const parts = [["🌱", "Roots", -62, 42], ["🪵", "Trunk", -20, 30], ["🌿", "Branch", 30, 8], ["🍃", "Leaf", 62, -22], ["🌸", "Flower", -58, -30], ["🍎", "Fruit", 58, 40], ["🌰", "Seed", 8, 62]];
  return <Tile label="Parts of a tree">
    <Tree x={0} y={-4} s={1} />
    {parts.map(([e, t, x, y], i) => <g key={i} transform={`translate(${x},${y})`}><text x="0" y="0" textAnchor="middle" fontSize="13">{e}</text><text x="0" y="11" textAnchor="middle" fontSize="7" fontWeight="900" fill="#fff">{t}</text></g>)}
    {cap("पेड़ के भाग", YELLOW, 90)}
  </Tile>;
}

export function WaterArt() {
  return <Tile label="Water movement">
    <Tree x={0} y={-4} s={1} />
    {[-8, 0, 8].map((x, i) => <circle key={i} cx={x} cy={-40 + i * 16} r="4" fill={SKY} opacity={0.9} />)}
    <path d="M0 34 v18" stroke={SKY} strokeWidth="5" strokeLinecap="round" strokeDasharray="6 6" />
    <text x="52" y="-30" textAnchor="middle" fontSize="16">💧</text>
    {cap("Roots → Xylem → Leaf", "#fff", 86)}
  </Tile>;
}

export function PhotosynthesisArt() {
  return <Tile label="Photosynthesis">
    <text x="-58" y="-48" textAnchor="middle" fontSize="26">☀️</text>
    <text x="0" y="-30" textAnchor="middle" fontSize="34">🍃</text>
    <path d="M-40 -40 l24 12" stroke={YELLOW} strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />
    <text x="0" y="20" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">CO₂ + H₂O + Light</text>
    <text x="0" y="40" textAnchor="middle" fontSize="18" fontWeight="900" fill={YELLOW}>→</text>
    <text x="0" y="62" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN}>Glucose + Oxygen</text>
    {cap("Photosynthesis", "#fff", 88)}
  </Tile>;
}

export function GrowthArt() {
  const stages = ["🌰", "🌱", "🌿", "🌳"];
  return <Tile label="Tree growth">
    {stages.map((e, i) => <g key={i} transform={`translate(${-54 + i * 36},6)`}>
      <text x="0" y="0" textAnchor="middle" fontSize={12 + i * 6}>{e}</text>
      {i < 3 && <text x="18" y="4" textAnchor="middle" fontSize="12" fontWeight="900" fill={YELLOW}>›</text>}
    </g>)}
    {cap("Seed → Mature tree", "#fff", 84)}
  </Tile>;
}

export function ForestEcosystemArt() {
  return <Tile label="Forest ecosystem" bg={DARKGREEN}>
    <Tree x={-46} y={-6} s={0.85} leaf="#2b8a3e" />
    <Tree x={46} y={-6} s={0.85} leaf="#2b8a3e" />
    <text x="0" y="-52" textAnchor="middle" fontSize="20">🐦</text>
    <text x="0" y="30" textAnchor="middle" fontSize="16">🦌</text>
    <text x="-70" y="40" textAnchor="middle" fontSize="14">🍄</text>
    <text x="70" y="40" textAnchor="middle" fontSize="14">🐛</text>
    <text x="0" y="60" textAnchor="middle" fontSize="10" fontWeight="900" fill={YELLOW}>living + non-living + interactions</text>
    {cap("Forest = ecosystem", "#fff", 86)}
  </Tile>;
}

export function ForestLayersArt() {
  return <Tile label="Forest layers">
    {[["Emergent", -70, "#2b8a3e"], ["Canopy", -30, "#2f9e44"], ["Understory", 10, "#40c057"], ["Floor", 44, "#5c940d"]].map(([t, y, c], i) => <g key={i}>
      <rect x="-78" y={y} width="156" height="30" rx="8" fill={c} opacity={0.9} />
      <text x="-70" y={y + 20} fontSize="10" fontWeight="900" fill="#fff">{t}</text>
    </g>)}
    <text x="0" y="-46" textAnchor="middle" fontSize="10" fontWeight="900" fill={YELLOW}>☀️ light ↓</text>
    {cap("Forest layers", "#fff", 88)}
  </Tile>;
}

export function HabitatsArt() {
  return <Tile label="Tree habitats">
    <Tree x={0} y={-4} s={1.05} />
    <text x="-42" y="-30" textAnchor="middle" fontSize="15">🐦</text>
    <text x="40" y="-24" textAnchor="middle" fontSize="15">🐝</text>
    <text x="-40" y="26" textAnchor="middle" fontSize="14">🐛</text>
    <text x="44" y="30" textAnchor="middle" fontSize="14">🍄</text>
    <text x="0" y="56" textAnchor="middle" fontSize="12">🪲</text>
    {cap("एक पेड़, कई habitats", "#fff", 86)}
  </Tile>;
}

export function FoodChainArt() {
  const chain = [["🌱", "Plant"], ["🐛", "Caterpillar"], ["🐦", "Bird"], ["🦅", "Eagle"]];
  return <Tile label="Food chain">
    {chain.map(([e, t], i) => <g key={i} transform={`translate(0,${-52 + i * 30})`}>
      <text x="0" y="0" textAnchor="middle" fontSize="17">{e}</text>
      <text x="34" y="4" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">{t}</text>
      {i < 3 && <text x="-34" y="4" textAnchor="middle" fontSize="14" fontWeight="900" fill={YELLOW}>↓</text>}
    </g>)}
    {cap("Food Chain", "#fff", 90)}
  </Tile>;
}

export function FoodWebArt() {
  return <Tile label="Food web">
    <circle cx="0" cy="0" r="9" fill={YELLOW} />
    {[["🌱", -52, -40], ["🐛", 52, -40], ["🐦", -56, 40], ["🦅", 56, 40], ["🐍", 0, 54]].map(([e, x, y], i) => <g key={i}>
      <line x1="0" y1="0" x2={x} y2={y} stroke="#ffffff66" strokeWidth="3" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="16">{e}</text>
    </g>)}
    {cap("Food Web", "#fff", 92)}
  </Tile>;
}

export function BiodiversityArt() {
  return <Tile label="Biodiversity" bg="#0f3d2e">
    <text x="-52" y="-34" textAnchor="middle" fontSize="20">🐦</text>
    <text x="0" y="-46" textAnchor="middle" fontSize="20">🦋</text>
    <text x="52" y="-34" textAnchor="middle" fontSize="20">🐝</text>
    <text x="-40" y="6" textAnchor="middle" fontSize="20">🌿</text>
    <text x="40" y="6" textAnchor="middle" fontSize="20">🍄</text>
    <text x="0" y="42" textAnchor="middle" fontSize="20">🦌</text>
    <text x="0" y="66" textAnchor="middle" fontSize="9" fontWeight="900" fill={YELLOW}>genetic · species · ecosystem</text>
    {cap("Biodiversity", "#fff", 86)}
  </Tile>;
}

export function PollinationArt() {
  return <Tile label="Pollination">
    <text x="-46" y="6" textAnchor="middle" fontSize="30">🌸</text>
    <text x="46" y="6" textAnchor="middle" fontSize="30">🌺</text>
    <text x="0" y="-30" textAnchor="middle" fontSize="20">🐝</text>
    <path d="M-24 -14 q24 -26 48 0" fill="none" stroke={YELLOW} strokeWidth="4" strokeDasharray="5 5" />
    {cap("Pollination", "#fff", 84)}
  </Tile>;
}

export function SeedDispersalArt() {
  return <Tile label="Seed dispersal">
    <Tree x={0} y={-30} s={0.75} />
    <text x="-40" y="20" textAnchor="middle" fontSize="16">🌬️</text>
    <text x="0" y="30" textAnchor="middle" fontSize="16">🐦</text>
    <text x="42" y="20" textAnchor="middle" fontSize="16">💧</text>
    <text x="-20" y="54" textAnchor="middle" fontSize="16">🐒</text>
    <text x="24" y="54" textAnchor="middle" fontSize="16">👣</text>
    {cap("Seed Dispersal", "#fff", 90)}
  </Tile>;
}

export function DecompositionArt() {
  return <Tile label="Decomposition">
    <text x="0" y="-40" textAnchor="middle" fontSize="20">🍂</text>
    <text x="0" y="-6" textAnchor="middle" fontSize="20">🍄</text>
    <text x="0" y="28" textAnchor="middle" fontSize="20">🌱</text>
    <path d="M0 -24 v14" stroke={YELLOW} strokeWidth="3" strokeLinecap="round" />
    <path d="M0 10 v12" stroke={YELLOW} strokeWidth="3" strokeLinecap="round" />
    <text x="0" y="62" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">leaves → decomposers → nutrients → soil</text>
    {cap("Decomposition", "#fff", 88)}
  </Tile>;
}

export function BiodiversityMattersArt() {
  return <Tile label="Why biodiversity matters" bg="#123a5f">
    <text x="-46" y="0" textAnchor="middle" fontSize="34">🌳</text>
    <text x="46" y="0" textAnchor="middle" fontSize="34">🌳🌳</text>
    <text x="0" y="48" textAnchor="middle" fontSize="10" fontWeight="900" fill={YELLOW}>3 species vs 300 species</text>
    <text x="0" y="-46" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">resilience &amp; functioning</text>
    {cap("Biodiversity क्यों ज़रूरी?", "#fff", 88)}
  </Tile>;
}

export function ForestGivesArt() {
  return <Tile label="Forest gives us">
    <text x="-52" y="-30" textAnchor="middle" fontSize="18">🪵</text>
    <text x="0" y="-40" textAnchor="middle" fontSize="18">💧</text>
    <text x="52" y="-30" textAnchor="middle" fontSize="18">🐾</text>
    <text x="-40" y="20" textAnchor="middle" fontSize="18">🍯</text>
    <text x="0" y="30" textAnchor="middle" fontSize="18">🌰</text>
    <text x="40" y="20" textAnchor="middle" fontSize="18">👨‍👩‍👧‍👦</text>
    <text x="0" y="62" textAnchor="middle" fontSize="9" fontWeight="900" fill={YELLOW}>material · regulation · habitat · livelihood</text>
    {cap("Forest हमें क्या देते हैं", "#fff", 88)}
  </Tile>;
}

export function ForestPeopleArt() {
  return <Tile label="Forest communities">
    <text x="-40" y="-24" textAnchor="middle" fontSize="24">🧑‍🌾</text>
    <text x="24" y="-24" textAnchor="middle" fontSize="24">🧺</text>
    <Tree x={-46} y={30} s={0.6} />
    <Tree x={20} y={30} s={0.6} />
    <text x="0" y="70" textAnchor="middle" fontSize="9" fontWeight="900" fill={YELLOW}>food · fuel · medicine · livelihood</text>
    {cap("Forest People", "#fff", 86)}
  </Tile>;
}

export function ForestProductsArt() {
  return <Tile label="Forest products">
    <text x="-46" y="-24" textAnchor="middle" fontSize="18">🪑</text>
    <text x="0" y="-34" textAnchor="middle" fontSize="18">📄</text>
    <text x="46" y="-24" textAnchor="middle" fontSize="18">🍯</text>
    <text x="-30" y="26" textAnchor="middle" fontSize="18">🎋</text>
    <text x="30" y="26" textAnchor="middle" fontSize="18">🌿</text>
    <text x="0" y="58" textAnchor="middle" fontSize="9" fontWeight="900" fill={YELLOW}>wood + non-wood products</text>
    {cap("Forest Products", "#fff", 88)}
  </Tile>;
}

export function DeforestationArt() {
  return <Tile label="Deforestation and degradation" bg="#5a2a00">
    <text x="-46" y="-4" textAnchor="middle" fontSize="30">🪓</text>
    <text x="34" y="-16" textAnchor="middle" fontSize="24">🌳</text>
    <text x="46" y="34" textAnchor="middle" fontSize="20">🪵</text>
    <text x="0" y="62" textAnchor="middle" fontSize="9" fontWeight="900" fill={YELLOW}>forest → other land use</text>
    {cap("Deforestation / Degradation", "#fff", 90)}
  </Tile>;
}

export function FragmentationArt() {
  return <Tile label="Habitat fragmentation">
    <g>
      <Tree x={-66} y={-6} s={0.5} /><Tree x={-30} y={-6} s={0.5} />
      <rect x="-8" y="-64" width="16" height="128" fill="#3a3a3a" />
      <path d="M-2 -60 h4 M-2 -40 h4 M-2 -20 h4 M-2 0 h4 M-2 20 h4 M-2 40 h4" stroke={YELLOW} strokeWidth="2" />
      <Tree x={34} y={-6} s={0.5} /><Tree x={66} y={-6} s={0.5} />
    </g>
    <text x="0" y="70" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">habitat | road | habitat</text>
    {cap("Fragmentation", "#fff", 88)}
  </Tile>;
}

export function ConservationArt() {
  return <Tile label="Conservation">
    <text x="0" y="-18" textAnchor="middle" fontSize="40">🤝</text>
    <text x="0" y="34" textAnchor="middle" fontSize="10" fontWeight="900" fill={YELLOW}>protect · manage · restore</text>
    <text x="0" y="52" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff">people + govt + science</text>
    {cap("Conservation", "#fff", 86)}
  </Tile>;
}

export function RestorationArt() {
  return <Tile label="Restoration">
    <text x="-58" y="4" textAnchor="middle" fontSize="24">🌱</text>
    <text x="-6" y="4" textAnchor="middle" fontSize="24">🌿</text>
    <text x="48" y="4" textAnchor="middle" fontSize="24">🌳</text>
    <text x="0" y="-42" textAnchor="middle" fontSize="11" fontWeight="900" fill={YELLOW}>plantation ≠ restoration</text>
    <text x="0" y="60" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">structure + functions + biodiversity</text>
    {cap("Afforestation · Reforestation · Restoration", "#fff", 88)}
  </Tile>;
}

export function ProtectedArt() {
  return <Tile label="Protected areas and community conservation" bg={DARKGREEN}>
    <text x="0" y="-22" textAnchor="middle" fontSize="38">🏞️</text>
    <text x="-52" y="30" textAnchor="middle" fontSize="20">🐅</text>
    <text x="0" y="36" textAnchor="middle" fontSize="20">🦌</text>
    <text x="52" y="30" textAnchor="middle" fontSize="20">🐘</text>
    <text x="0" y="66" textAnchor="middle" fontSize="9" fontWeight="900" fill={YELLOW}>parks · sanctuaries · communities</text>
    {cap("Protected &amp; Community Conservation", "#fff", 86)}
  </Tile>;
}

export function CaseStudyArt() {
  return <Tile label="Conservation case study">
    <Tree x={-52} y={-6} s={0.55} /><Tree x={52} y={-6} s={0.55} />
    <rect x="-10" y="-56" width="20" height="112" fill="#3a3a3a" />
    <path d="M-4 -52 h8 M-4 -28 h8 M-4 -4 h8 M-4 20 h8 M-4 44 h8" stroke={YELLOW} strokeWidth="2" />
    <text x="0" y="-62" textAnchor="middle" fontSize="18">🛣️</text>
    <text x="0" y="72" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">evidence-based decision</text>
    {cap("Forest Road Case Study", "#fff", 88)}
  </Tile>;
}

export function FieldStudyArt() {
  return <Tile label="Local field study">
    <text x="-40" y="-20" textAnchor="middle" fontSize="26">🔍</text>
    <text x="30" y="-24" textAnchor="middle" fontSize="24">📓</text>
    <text x="-30" y="30" textAnchor="middle" fontSize="20">🌳</text>
    <text x="30" y="30" textAnchor="middle" fontSize="20">🌱</text>
    <text x="0" y="66" textAnchor="middle" fontSize="9" fontWeight="900" fill={YELLOW}>observe · record · map</text>
    {cap("My Tree & Forest Study", "#fff", 86)}
  </Tile>;
}

/* --------------------------------- mappings -------------------------------- */

const MAP = {
  c1: WhatIsTreeArt, c2: TreePartsArt, c3: WaterArt, c4: PhotosynthesisArt, c5: GrowthArt,
  c6: ForestEcosystemArt, c7: ForestLayersArt, c8: HabitatsArt, c9: FoodChainArt, c10: FoodWebArt,
  c11: BiodiversityArt, c12: PollinationArt, c13: SeedDispersalArt, c14: DecompositionArt, c15: BiodiversityMattersArt,
  c16: ForestGivesArt, c17: ForestPeopleArt, c18: ForestProductsArt, c19: DeforestationArt, c20: FragmentationArt,
  c21: ConservationArt, c22: RestorationArt, c23: ProtectedArt, c24: CaseStudyArt, c25: FieldStudyArt,
};

export function chapterArt(id) {
  const C = MAP[id] || WhatIsTreeArt;
  return <C />;
}

/** Compact art for the hub course card. */
export function CardArt() {
  return <Tile label="Trees & Forests" bg={DARKGREEN}>
    <Tree x={-24} y={2} s={0.8} leaf="#2b8a3e" />
    <Tree x={26} y={2} s={0.65} leaf="#40c057" />
    <text x="0" y="56" textAnchor="middle" fontSize="10" fontWeight="900" fill={YELLOW}>वृक्ष एवं जंगल</text>
  </Tile>;
}

/** Large header illustration: layered forest with sun and wildlife. */
export function HeroArt({ className = "" }) {
  const uid = useId().replace(/[:]/g, "");
  const bgId = "tfhero-" + uid;
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Forest illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b3a63" /><stop offset="1" stopColor="#04121f" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="26" fill={`url(#${bgId})`} />
      <circle cx="320" cy="64" r="34" fill={YELLOW} opacity="0.9" />
      {[[70, 40], [150, 28], [240, 44], [360, 120], [40, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="#fff" opacity="0.6" />)}
      {/* far canopy */}
      <g opacity="0.55">
        <circle cx="60" cy="210" r="70" fill="#2b8a3e" />
        <circle cx="150" cy="200" r="80" fill="#2b8a3e" />
        <circle cx="250" cy="205" r="85" fill="#2b8a3e" />
        <circle cx="345" cy="212" r="70" fill="#2b8a3e" />
      </g>
      {/* trunks */}
      {[70, 160, 250, 340].map((x, i) => <rect key={i} x={x - 7} y="205" width="14" height="70" rx="5" fill={BROWN} />)}
      {/* mid trees */}
      <g>
        <circle cx="90" cy="180" r="52" fill="#40c057" />
        <circle cx="200" cy="172" r="58" fill="#37b24d" />
        <circle cx="310" cy="182" r="50" fill="#40c057" />
      </g>
      {/* foreground */}
      <rect x="0" y="262" width="400" height="38" fill="#1d5c2b" />
      <text x="96" y="150" fontSize="26" textAnchor="middle">🐦</text>
      <text x="250" y="120" fontSize="22" textAnchor="middle">🦋</text>
      <text x="330" y="240" fontSize="24" textAnchor="middle">🦌</text>
      <text x="70" y="246" fontSize="20" textAnchor="middle">🍄</text>
      <text x="200" y="292" textAnchor="middle" fontSize="16" fontWeight="900" fill={YELLOW} letterSpacing="0.5">वृक्ष एवं जंगल</text>
    </svg>
  );
}
