/**
 * Code-generated SVG art for the Fruits / फल course.
 *
 * All visuals are drawn with plain SVG (no stock photos, no external assets),
 * matching the Learning Hub rule that decorative art is coded, not photographed.
 * Each chapter maps to a scene via `chapterArt(chapterId)`.
 */

import { useId } from "react";

const NAVY = "#0b3a63";
const ORANGE = "#FF6600";
const YELLOW = "#FFD166";
const SKY = "#8ecae6";
const GREEN = "#2f9e44";
const LEAF = "#40c057";
const RED = "#e03131";
const PURPLE = "#7048e8";

function Tile({ children, bg = NAVY, label = "Illustration" }) {
  const uid = useId().replace(/[:]/g, "");
  const gid = "frgloss-" + uid;
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

const cap = (t, fill = "#fff", y = 86) => <text x="0" y={y} textAnchor="middle" fontSize="13" fontWeight="900" fill={fill} letterSpacing="0.4">{t}</text>;

/* ------------------------------- fruit shapes ------------------------------ */

function Apple({ s = 1, color = RED }) {
  return <g transform={`scale(${s})`}>
    <path d="M0 -30 C -22 -46 -46 -28 -42 -2 C -39 20 -22 38 0 38 C 22 38 39 20 42 -2 C 46 -28 22 -46 0 -30 Z" fill={color} />
    <path d="M0 -30 C -10 -40 -24 -40 -32 -30" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" />
    <rect x="-2.5" y="-46" width="5" height="16" rx="2.5" fill="#7a4a1e" />
    <path d="M2 -40 q14 -6 18 4 q-12 6 -18 -4 z" fill={LEAF} />
  </g>;
}

function Banana({ s = 1 }) {
  return <g transform={`scale(${s})`}>
    <path d="M-40 -18 C -34 24 34 30 42 6 C 30 24 -24 20 -40 -18 Z" fill={YELLOW} />
    <path d="M-40 -18 C -34 24 34 30 42 6" fill="none" stroke="#d9a400" strokeWidth="3" strokeLinecap="round" />
    <path d="M-40 -18 q-6 -6 -2 -12" fill="none" stroke="#7a4a1e" strokeWidth="4" strokeLinecap="round" />
    <path d="M42 6 q8 -2 8 -10" fill="none" stroke="#7a4a1e" strokeWidth="4" strokeLinecap="round" />
  </g>;
}

function Orange({ s = 1 }) {
  return <g transform={`scale(${s})`}>
    <circle r="36" fill="#f76707" />
    <circle r="36" fill="none" stroke="#d9480f" strokeWidth="3" />
    {Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return <circle key={i} cx={Math.cos(a) * 20} cy={Math.sin(a) * 20} r="1.6" fill="#ffd8a8" />; })}
    <circle cx="-10" cy="-12" r="12" fill="#ffffff" opacity="0.25" />
    <path d="M0 -36 q10 -10 18 -4 q-8 10 -18 4 z" fill={LEAF} />
  </g>;
}

function Mango({ s = 1 }) {
  return <g transform={`scale(${s})`}>
    <path d="M-30 -18 C -34 -44 8 -50 26 -28 C 42 -8 30 34 -2 36 C -32 38 -26 -2 -30 -18 Z" fill="#f59f00" />
    <path d="M-30 -18 C -34 -44 8 -50 26 -28" fill="none" stroke={RED} strokeOpacity="0.5" strokeWidth="8" strokeLinecap="round" />
    <path d="M24 -30 q12 -8 18 -2 q-8 10 -18 2 z" fill={LEAF} />
  </g>;
}

function Grapes({ s = 1 }) {
  const pts = [[-14, -18], [14, -18], [0, -8], [-24, 0], [24, 0], [-12, 6], [12, 6], [0, 16], [0, 32]];
  return <g transform={`scale(${s})`}>
    {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="11" fill={PURPLE} />)}
    {pts.map(([x, y], i) => <circle key={"h" + i} cx={x - 3} cy={y - 3} r="3" fill="#ffffff" opacity="0.28" />)}
    <path d="M0 -30 q6 -12 16 -14" fill="none" stroke="#7a4a1e" strokeWidth="4" strokeLinecap="round" />
    <path d="M8 -40 q16 -8 22 2 q-14 8 -22 -2 z" fill={LEAF} />
  </g>;
}

function Watermelon({ s = 1 }) {
  return <g transform={`scale(${s})`}>
    <path d="M-44 8 A 44 44 0 0 1 44 8 Z" fill={GREEN} />
    <path d="M-40 8 A 40 40 0 0 1 40 8 Z" fill="#e03131" />
    <path d="M-40 8 A 40 40 0 0 1 40 8 Z" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="5" />
    {[[-20, -2], [0, -14], [20, -2], [-10, 0], [10, 0]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="2.6" ry="4" fill="#2b2b2b" transform={`rotate(${x * 0.6} ${x} ${y})`} />)}
  </g>;
}

function Guava({ s = 1 }) {
  return <g transform={`scale(${s})`}>
    <ellipse rx="34" ry="38" fill="#94d82d" />
    <ellipse rx="34" ry="38" fill="none" stroke="#66a80f" strokeWidth="3" />
    <circle cx="-10" cy="-12" r="11" fill="#ffffff" opacity="0.25" />
    <rect x="-3" y="-44" width="6" height="12" rx="3" fill="#7a4a1e" />
  </g>;
}

function Flower({ s = 1 }) {
  return <g transform={`scale(${s})`}>
    {Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return <ellipse key={i} cx={Math.cos(a) * 24} cy={Math.sin(a) * 24} rx="15" ry="11" fill="#f783ac" transform={`rotate(${i * 60} ${Math.cos(a) * 24} ${Math.sin(a) * 24})`} />; })}
    <circle r="15" fill={YELLOW} />
    <circle r="15" fill="none" stroke="#e8590c" strokeWidth="2" />
  </g>;
}

function Seed({ s = 1 }) {
  return <g transform={`scale(${s})`}>
    <ellipse rx="12" ry="18" fill="#7a4a1e" />
    <path d="M0 -16 q6 16 0 32" fill="none" stroke="#c99a6a" strokeWidth="2.5" />
  </g>;
}

function Leaf() {
  return <g>
    <path d="M-30 20 C -30 -20 20 -34 34 -30 C 30 6 -6 28 -30 20 Z" fill={GREEN} />
    <path d="M-24 16 C -6 0 12 -14 30 -26" fill="none" stroke="#d3f9d8" strokeWidth="2.5" />
  </g>;
}

/* ---------------------------------- scenes --------------------------------- */

export function IdentifyArt() {
  return <Tile label="Fruits: apple and banana">
    <g transform="translate(-32,-6)"><Apple s={1.05} /></g>
    <g transform="translate(38,10)"><Banana s={0.9} /></g>
    {cap("पहचानो", YELLOW, 82)}
  </Tile>;
}

export function ColoursArt() {
  const fruits = [[RED, -52], ["#f76707", -18], [YELLOW, 16], [GREEN, 50]];
  return <Tile label="Fruits in many colours">
    {fruits.map(([c, x], i) => <g key={i} transform={`translate(${x},-16)`}>
      <circle r="20" fill={c} />
      <circle cx="-6" cy="-7" r="6" fill="#ffffff" opacity="0.3" />
    </g>)}
    <path d="M-64 34 q64 34 128 0" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4" strokeDasharray="6 6" />
    {cap("🌈 रंग", "#fff", 82)}
  </Tile>;
}

export function PlantSourceArt() {
  return <Tile label="Tree with fruits" bg="#0f3d2e">
    <rect x="-8" y="4" width="16" height="46" rx="5" fill="#7a4a1e" />
    <circle cx="0" cy="-18" r="42" fill={GREEN} />
    <circle cx="-30" cy="-4" r="24" fill={LEAF} />
    <circle cx="30" cy="-6" r="24" fill={LEAF} />
    <circle cx="-14" cy="-26" r="7" fill={RED} />
    <circle cx="18" cy="-20" r="7" fill={RED} />
    <circle cx="2" cy="-6" r="7" fill={RED} />
    {cap("पेड़ से", "#fff", 84)}
  </Tile>;
}

export function SeedsArt() {
  return <Tile label="Fruit and seeds" bg="#4a2c12">
    <g transform="translate(0,-18)"><Apple s={1} /></g>
    <g transform="translate(-26,40)"><Seed s={1} /></g>
    <g transform="translate(0,42)"><Seed s={1.15} /></g>
    <g transform="translate(26,40)"><Seed s={1} /></g>
    {cap("बीज", YELLOW, 88)}
  </Tile>;
}

export function FlowerFruitArt() {
  return <Tile label="Flower to fruit">
    <g transform="translate(0,-42)"><Flower s={0.7} /></g>
    <path d="M0 -6 v14" stroke={YELLOW} strokeWidth="4" strokeLinecap="round" />
    <path d="M-6 4 l6 8 l6 -8" fill="none" stroke={YELLOW} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <g transform="translate(0,34)"><Apple s={0.85} /></g>
    {cap("🌸 → 🍎", "#fff", 90)}
  </Tile>;
}

export function FormsArt() {
  return <Tile label="Different sizes and shapes">
    <g transform="translate(-52,10)"><circle r="12" fill={RED} /></g>
    <g transform="translate(-14,6)"><Apple s={0.75} /></g>
    <g transform="translate(38,10)"><Watermelon s={0.62} /></g>
    {cap("छोटा · मध्यम · बड़ा", YELLOW, 88)}
  </Tile>;
}

export function TasteArt() {
  return <Tile label="Taste">
    <g transform="translate(0,-14)">
      <circle r="42" fill="#e8590c" opacity="0.9" />
      <circle r="42" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="4" />
      <text x="0" y="6" textAnchor="middle" fontSize="34">👅</text>
    </g>
    {cap("sweet · tart · juicy", "#fff", 84)}
  </Tile>;
}

export function SeasonArt() {
  return <Tile label="Seasons" bg="#123a5f">
    <g transform="translate(-44,-18)">
      <circle r="20" fill={YELLOW} />
      {Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <line key={i} x1={Math.cos(a) * 25} y1={Math.sin(a) * 25} x2={Math.cos(a) * 31} y2={Math.sin(a) * 31} stroke={YELLOW} strokeWidth="3.5" strokeLinecap="round" />; })}
      <text x="0" y="46" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">गर्मी</text>
    </g>
    <g transform="translate(46,-18)">
      <ellipse cx="0" cy="6" rx="26" ry="18" fill="#ced4da" />
      <path d="M-24 6 a24 24 0 0 1 48 0 z" fill="#adb5bd" />
      {[[-8, 24], [4, 30], [14, 22]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l-4 12`} stroke={SKY} strokeWidth="3.5" strokeLinecap="round" />)}
      <text x="0" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">बारिश</text>
    </g>
    {cap("मौसम", YELLOW, 86)}
  </Tile>;
}

export function FarmingArt() {
  return <Tile label="Farming" bg="#0f3d2e">
    <rect x="-80" y="26" width="160" height="30" rx="8" fill="#5c3d1e" />
    <g transform="translate(0,-6)">
      <circle cy="-30" r="14" fill="#ffd8a8" />
      <path d="M-20 -8 a20 22 0 0 1 40 0 z" fill={ORANGE} />
      <rect x="-22" y="-30" width="44" height="8" rx="4" fill={YELLOW} />
    </g>
    {cap("☀️ 💧 🌱 👨‍🌾", "#fff", 82)}
  </Tile>;
}

export function NutritionArt() {
  return <Tile label="Nutrition" bg="#0f3d2e">
    <ellipse cx="0" cy="14" rx="56" ry="20" fill="#ffffff" />
    <g transform="translate(-24,-6)"><Apple s={0.62} /></g>
    <g transform="translate(16,-4)"><Orange s={0.5} /></g>
    <g transform="translate(40,10)"><Banana s={0.42} /></g>
    {cap("vitamins · fibre", "#fff", 74)}
  </Tile>;
}

export function JuiceArt() {
  return <Tile label="Whole fruit vs juice">
    <g transform="translate(-38,4)"><Orange s={0.72} /></g>
    <path d="M-4 -6 h12" stroke={YELLOW} strokeWidth="4" strokeLinecap="round" />
    <path d="M6 -11 l6 5 l-6 5" fill="none" stroke={YELLOW} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <g transform="translate(42,-4)">
      <path d="M-18 -24 h36 l-6 44 h-24 z" fill={SKY} opacity="0.85" />
      <rect x="-20" y="-30" width="40" height="8" rx="4" fill="#fff" />
      <path d="M-16 -14 h32 l-4 30 h-24 z" fill="#f76707" opacity="0.85" />
    </g>
    {cap("whole ≠ juice", "#fff", 86)}
  </Tile>;
}

export function RipeArt() {
  return <Tile label="Ripeness check">
    <g transform="translate(-6,-2)"><Banana s={0.95} /></g>
    <g transform="translate(44,26)">
      <circle r="20" fill="none" stroke={YELLOW} strokeWidth="5" />
      <line x1="14" y1="14" x2="30" y2="30" stroke={YELLOW} strokeWidth="6" strokeLinecap="round" />
    </g>
    {cap("पका है?", "#fff", 88)}
  </Tile>;
}

export function ChoosingArt() {
  return <Tile label="Choosing fruits">
    <path d="M-34 -26 h68 l-8 40 h-52 z" fill={SKY} opacity="0.9" />
    <path d="M-34 -26 l-10 -12" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    <g transform="translate(-16,-8)"><Apple s={0.5} /></g>
    <g transform="translate(12,-6)"><Orange s={0.42} /></g>
    <circle cx="-18" cy="26" r="6" fill={NAVY} /><circle cx="18" cy="26" r="6" fill={NAVY} />
    {cap("🛒 चुनो", YELLOW, 84)}
  </Tile>;
}

export function SafetyArt() {
  return <Tile label="Wash fruit safely" bg="#0b3a63">
    <text x="-30" y="2" textAnchor="middle" fontSize="40">🧼</text>
    <text x="26" y="2" textAnchor="middle" fontSize="40">🚿</text>
    <g transform="translate(0,42)"><Apple s={0.55} /></g>
    {cap("साफ करो", "#fff", 90)}
  </Tile>;
}

export function MythArt() {
  return <Tile label="Myth vs reality" bg="#5a1f22">
    <g transform="translate(0,-24)">
      <text x="-34" y="6" textAnchor="middle" fontSize="30" fill="#ff8787">✗</text>
      <text x="30" y="6" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff">Myth</text>
    </g>
    <g transform="translate(0,34)">
      <text x="-34" y="6" textAnchor="middle" fontSize="30" fill="#69db7c">✓</text>
      <text x="30" y="6" textAnchor="middle" fontSize="22" fontWeight="800" fill={YELLOW}>Reality</text>
    </g>
  </Tile>;
}

export function GlobeArt() {
  return <Tile label="Local and global fruits">
    <circle r="52" fill="#1b4a72" stroke={SKY} strokeWidth="3" />
    <ellipse rx="52" ry="20" fill="none" stroke={SKY} strokeWidth="2" opacity="0.8" />
    <ellipse rx="20" ry="52" fill="none" stroke={SKY} strokeWidth="2" opacity="0.8" />
    <path d="M-52 0 h104" stroke={SKY} strokeWidth="2" opacity="0.8" />
    <circle cx="22" cy="-16" r="7" fill={RED} />
    <circle cx="-20" cy="12" r="7" fill={YELLOW} />
    {cap("🌏 दुनिया भर", "#fff", 84)}
  </Tile>;
}

export function FarmToPlateArt() {
  return <Tile label="Farm to plate" bg="#123a5f">
    <line x1="-76" y1="16" x2="76" y2="16" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
    <g transform="translate(-40,16)">
      <rect x="-18" y="-16" width="40" height="26" rx="5" fill={ORANGE} />
      <rect x="-13" y="-10" width="10" height="9" rx="2" fill="#fff" />
      <rect x="2" y="-10" width="10" height="9" rx="2" fill="#fff" />
      <circle cx="-10" cy="12" r="5" fill={NAVY} /><circle cx="10" cy="12" r="5" fill={NAVY} />
    </g>
    <g transform="translate(58,-8)"><Apple s={0.55} /></g>
    {cap("खेत → थाली", YELLOW, 82)}
  </Tile>;
}

export function EnvironmentArt() {
  return <Tile label="Reduce food waste" bg="#0f3d2e">
    <g transform="translate(0,-10)"><Leaf /></g>
    <path d="M-30 40 q30 -14 60 0" fill="none" stroke={YELLOW} strokeWidth="5" strokeLinecap="round" />
    <path d="M18 34 l10 6 l-10 6" fill="none" stroke={YELLOW} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    {cap("♻️ waste घटाओ", "#fff", 86)}
  </Tile>;
}

/* --------------------------------- mappings -------------------------------- */

const MAP = {
  c1: IdentifyArt,
  c2: ColoursArt,
  c3: PlantSourceArt,
  c4: SeedsArt,
  c5: FlowerFruitArt,
  c6: FormsArt,
  c7: TasteArt,
  c8: SeasonArt,
  c9: FarmingArt,
  c10: NutritionArt,
  c11: JuiceArt,
  c12: RipeArt,
  c13: ChoosingArt,
  c14: SafetyArt,
  c15: MythArt,
  c16: GlobeArt,
  c17: FarmToPlateArt,
  c18: EnvironmentArt,
};

export function chapterArt(id) {
  const C = MAP[id] || IdentifyArt;
  return <C />;
}

/** Compact art used inside hub course cards (no caption text). */
export function CardArt() {
  return <Tile label="Fruits">
    <g transform="translate(-26,-8)"><Apple s={0.95} /></g>
    <g transform="translate(34,4)"><Orange s={0.68} /></g>
    <g transform="translate(6,40)"><Banana s={0.5} /></g>
  </Tile>;
}

/** Large header illustration: a basket of fruit. */
export function HeroArt({ className = "" }) {
  const uid = useId().replace(/[:]/g, "");
  const bgId = "frhero-" + uid;
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="फलों की टोकरी illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f3d2e" /><stop offset="1" stopColor="#001529" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="26" fill={`url(#${bgId})`} />
      {[[40, 44], [96, 78], [304, 40], [352, 96], [214, 28], [156, 262], [286, 260]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" opacity="0.7" />)}
      <g transform="translate(120,110)"><Apple s={1.15} /></g>
      <g transform="translate(214,120)"><Orange s={0.9} /></g>
      <g transform="translate(280,150)"><Grapes s={0.72} /></g>
      <g transform="translate(160,196)"><Banana s={0.8} /></g>
      <g transform="translate(258,206)"><Mango s={0.7} /></g>
      {/* basket */}
      <path d="M92 168 h216 l-20 92 a20 20 0 0 1 -20 16 h-136 a20 20 0 0 1 -20 -16 z" fill="#a9651f" />
      <path d="M92 168 h216 l-20 92 a20 20 0 0 1 -20 16 h-136 a20 20 0 0 1 -20 -16 z" fill="none" stroke="#7a4a1e" strokeWidth="4" />
      {[130, 168, 206, 244, 282].map((x, i) => <line key={i} x1={x} y1="172" x2={x - 4} y2="268" stroke="#7a4a1e" strokeWidth="3" opacity="0.6" />)}
      <rect x="84" y="158" width="232" height="18" rx="9" fill="#c47b2b" />
      <text x="200" y="292" textAnchor="middle" fontSize="16" fontWeight="900" fill={YELLOW} letterSpacing="0.5">फल</text>
    </svg>
  );
}
