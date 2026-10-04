/**
 * Code-generated SVG art for the Time & Calendar course.
 *
 * Everything here is drawn with plain SVG (no stock photos, no external
 * assets) so it stays crisp, light and copyright-free — matching the Learning
 * Hub rule that decorative visuals are coded, not photographed.
 *
 * Each chapter maps to one scene via `chapterArt(chapterId)`.
 */

import { useId } from "react";

const NAVY = "#0b3a63";
const ORANGE = "#FF6600";
const YELLOW = "#FFD166";
const SKY = "#8ecae6";
const GREEN = "#177245";
const ROSE = "#e5484d";

function Tile({ children, bg = NAVY, label = "Illustration" }) {
  const uid = useId().replace(/[:]/g, "");
  const gid = "tcgloss-" + uid;
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

/** Analog clock face centered on (0,0). Reused by many scenes. */
function ClockGroup({ hour = 10, minute = 10, r = 70, showNumbers = true, face = "#eef4f9", ring = YELLOW }) {
  const h = ((hour % 12) + 12) % 12;
  const hAng = h * 30 + minute * 0.5;
  const mAng = minute * 6;
  const hand = (ang, len, w, color) => {
    const a = (ang - 90) * Math.PI / 180;
    return <line x1="0" y1="0" x2={Math.cos(a) * len} y2={Math.sin(a) * len} stroke={color} strokeWidth={w} strokeLinecap="round" />;
  };
  return <g>
    <circle cx="0" cy="0" r={r + 10} fill={NAVY} />
    <circle cx="0" cy="0" r={r} fill={face} stroke={ring} strokeWidth="4" />
    {Array.from({ length: 60 }, (_, i) => {
      const a = (i * 6 - 90) * Math.PI / 180;
      const big = i % 5 === 0;
      const r1 = r - (big ? 10 : 5);
      return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * (r - 1)} y2={Math.sin(a) * (r - 1)} stroke={big ? NAVY : "#9fb2c4"} strokeWidth={big ? 3 : 1.4} />;
    })}
    {showNumbers && Array.from({ length: 12 }, (_, i) => {
      const n = i + 1;
      const a = (n * 30 - 90) * Math.PI / 180;
      return <text key={n} x={Math.cos(a) * (r - 24)} y={Math.sin(a) * (r - 24)} textAnchor="middle" dominantBaseline="central" fontSize={r * 0.2} fontWeight="800" fill={NAVY}>{n}</text>;
    })}
    {hand(hAng, r * 0.5, r * 0.1, NAVY)}
    {hand(mAng, r * 0.78, r * 0.065, ORANGE)}
    <circle cx="0" cy="0" r={r * 0.07} fill={ORANGE} />
  </g>;
}

/** Calendar page with an optional set of highlighted dates. */
function CalendarGroup({ month = "JUNE", highlight = [15], startCol = 6, days = 30 }) {
  const cols = 7;
  const colW = 21;
  const x0 = -(colW * 7) / 2 + colW / 2;
  const rowH = 18;
  const y0 = -26;
  const dow = ["S", "M", "T", "W", "T", "F", "S"];
  const cells = [];
  for (let i = 0; i < days; i++) {
    const idx = startCol + i;
    const col = idx % 7;
    const row = Math.floor(idx / 7);
    const cx = x0 + col * colW;
    const cy = y0 + row * rowH;
    const on = highlight.includes(i + 1);
    cells.push(<g key={i}>
      {on && <circle cx={cx} cy={cy} r="8.5" fill={ORANGE} />}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="10.5" fontWeight={on ? 800 : 600} fill={on ? "#fff" : "#33475b"}>{i + 1}</text>
    </g>);
  }
  return <g>
    <rect x="-80" y="-80" width="160" height="160" rx="16" fill="#ffffff" />
    <path d="M-80 -64 h160 v-16 a16 16 0 0 0 -16 -16 h-128 a16 16 0 0 0 -16 16 z" fill={ORANGE} />
    <text x="0" y="-70" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="900" fill="#fff" letterSpacing="1.5">{month}</text>
    <g>
      {dow.map((d, i) => <text key={i} x={x0 + i * colW} y="-40" textAnchor="middle" dominantBaseline="central" fontSize="9.5" fontWeight="800" fill={NAVY}>{d}</text>)}
    </g>
    {cells}
  </g>;
}

const caption = (t, fill = "#fff", y = 82) => (
  <text x="0" y={y} textAnchor="middle" fontSize="13" fontWeight="900" fill={fill} letterSpacing="0.5">{t}</text>
);

/* ---------------------------------- scenes --------------------------------- */

export function IdeaArt() {
  return <Tile label="Time as a sequence">
    <g transform="translate(0,-18)">
      <path d="M-26 -34 h52 v20 l-26 22 l-26 -22 z" fill="#fff" opacity="0.92" />
      <path d="M-26 34 h52 v-20 l-26 -22 l-26 22 z" fill={YELLOW} />
      <rect x="-30" y="-40" width="60" height="7" rx="3.5" fill={ORANGE} />
      <rect x="-30" y="33" width="60" height="7" rx="3.5" fill={ORANGE} />
      <path d="M-10 30 q10 14 20 0" stroke={ORANGE} strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
    {caption("कब → कितनी देर → क्रम", "#fff", 66)}
    <text x="0" y="86" textAnchor="middle" fontSize="11" fontWeight="700" fill={YELLOW}>Past · Present · Future</text>
  </Tile>;
}

export function UnitsArt() {
  const bars = [["sec", 26, SKY], ["min", 44, GREEN], ["hr", 62, YELLOW], ["day", 80, ORANGE], ["wk", 96, "#ff8c1a"], ["mo", 112, "#f4a261"], ["yr", 128, ROSE]];
  return <Tile label="Units of time">
    {bars.map(([l, w, c], i) => <g key={l} transform={`translate(-96,${-70 + i * 21})`}>
      <rect x="0" y="0" width={w} height="15" rx="7.5" fill={c} />
      <text x="6" y="11" fontSize="10" fontWeight="800" fill="#12233a">{l}</text>
    </g>)}
    <text x="0" y="90" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">Second → Year</text>
  </Tile>;
}

export function LeapArt() {
  return <Tile label="Leap year rule" bg="#123a5f">
    <g transform="translate(0,-14)"><CalendarGroup month="FEB" highlight={[29]} days={29} startCol={4} /></g>
    <text x="0" y="66" textAnchor="middle" fontSize="12" fontWeight="900" fill={YELLOW}>÷4 · ÷100 · ÷400</text>
    <text x="0" y="86" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">29 February</text>
  </Tile>;
}

export function ClockArt({ hour = 4, minute = 0 } = {}) {
  return <Tile label={`Clock showing ${hour}:${String(minute).padStart(2, "0")}`}>
    <g transform="translate(0,-6)"><ClockGroup hour={hour} minute={minute} r={64} /></g>
    <text x="0" y="88" textAnchor="middle" fontSize="13" fontWeight="900" fill={YELLOW}>Number × 5 = minutes</text>
  </Tile>;
}

export function DigitalArt() {
  return <Tile label="Digital clock" bg="#0d2a45">
    <rect x="-78" y="-46" width="156" height="66" rx="12" fill="#04101c" stroke={SKY} strokeWidth="2" />
    <text x="0" y="-12" textAnchor="middle" fontSize="34" fontWeight="900" fill={SKY} fontFamily="monospace">07:30</text>
    <text x="0" y="10" textAnchor="middle" fontSize="12" fontWeight="800" fill={YELLOW}>AM</text>
    <text x="0" y="58" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">7 घंटे 30 मिनट</text>
    <text x="0" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill={YELLOW}>12 AM = midnight</text>
  </Tile>;
}

export function ConvertArt() {
  return <Tile label="12-hour to 24-hour">
    <g transform="translate(-38,-8)"><ClockGroup hour={7} minute={0} r={40} showNumbers={false} /></g>
    <g transform="translate(38,-8)"><ClockGroup hour={7} minute={0} r={40} showNumbers={false} face="#dff0fb" ring={SKY} /></g>
    <path d="M-8 -8 h16" stroke={YELLOW} strokeWidth="4" strokeLinecap="round" />
    <path d="M6 -13 l6 5 l-6 5" fill="none" stroke={YELLOW} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <text x="-38" y="48" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">7 PM</text>
    <text x="38" y="48" textAnchor="middle" fontSize="12" fontWeight="800" fill={YELLOW}>19:00</text>
    {caption("+12 for PM", "#fff", 84)}
  </Tile>;
}

export function DurationArt() {
  return <Tile label="Duration between two times">
    <line x1="-78" y1="0" x2="78" y2="0" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
    <circle cx="-60" cy="0" r="7" fill={YELLOW} />
    <circle cx="60" cy="0" r="7" fill={ORANGE} />
    <rect x="-60" y="-6" width="120" height="12" rx="6" fill={ORANGE} opacity="0.85" />
    <text x="-60" y="-18" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">2:35</text>
    <text x="60" y="-18" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">4:10</text>
    {caption("1 hr 35 min", YELLOW, 40)}
    <text x="0" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">Start → Duration → End</text>
  </Tile>;
}

export function AddArt() {
  return <Tile label="Time addition" bg="#0f3d2e">
    <text x="-34" y="4" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">1:25</text>
    <text x="0" y="6" textAnchor="middle" fontSize="26" fontWeight="900" fill={YELLOW}>+</text>
    <text x="36" y="4" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">2:40</text>
    <line x1="-70" y1="18" x2="70" y2="18" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" />
    <text x="0" y="46" textAnchor="middle" fontSize="24" fontWeight="900" fill={YELLOW}>4:05</text>
    <text x="0" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">65 min = 1 hr 5 min</text>
  </Tile>;
}

export function SubArt() {
  return <Tile label="Time subtraction" bg="#5a1f22">
    <text x="-34" y="4" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">5:20</text>
    <text x="0" y="6" textAnchor="middle" fontSize="26" fontWeight="900" fill={YELLOW}>−</text>
    <text x="36" y="4" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">2:45</text>
    <line x1="-70" y1="18" x2="70" y2="18" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" />
    <text x="0" y="46" textAnchor="middle" fontSize="24" fontWeight="900" fill={YELLOW}>2:35</text>
    <text x="0" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">borrow = 60 (100 नहीं)</text>
  </Tile>;
}

export function MidnightArt() {
  return <Tile label="Crossing midnight" bg="#0a1b3a">
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-80 + i * 12} cy={-70 + (i % 3) * 8} r="1.6" fill="#fff" opacity="0.8" />)}
    <path d="M-70 30 a70 70 0 0 1 140 0" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="4" strokeDasharray="6 6" />
    <g transform="translate(-40,-6)"><ClockGroup hour={10} minute={30} r={34} showNumbers={false} /></g>
    <g transform="translate(40,-6)"><ClockGroup hour={1} minute={15} r={34} showNumbers={false} face="#1b2f4d" ring={YELLOW} /></g>
    <text x="0" y="52" textAnchor="middle" fontSize="12" fontWeight="900" fill={YELLOW}>10:30 PM → 1:15 AM</text>
    {caption("नया दिन शुरू", "#fff", 80)}
  </Tile>;
}

export function CalendarArt() {
  return <Tile label="Reading a calendar">
    <g transform="translate(0,-6)"><CalendarGroup month="JUNE" highlight={[15]} days={30} startCol={6} /></g>
    {caption("Day + Date + Month", "#fff", 88)}
  </Tile>;
}

export function DateDiffArt() {
  return <Tile label="Difference between dates" bg="#123a5f">
    <g transform="translate(0,-10)"><CalendarGroup month="MARCH" highlight={[3, 10]} days={31} startCol={0} /></g>
    <text x="0" y="72" textAnchor="middle" fontSize="12" fontWeight="900" fill={YELLOW}>10 − 3 = 7 days</text>
  </Tile>;
}

export function AgeArt() {
  return <Tile label="Age and birthday">
    <g transform="translate(0,6)">
      <rect x="-42" y="-6" width="84" height="42" rx="10" fill="#fff" />
      <rect x="-46" y="-16" width="92" height="16" rx="8" fill={YELLOW} />
      <path d="M-30 26 h60 v10 a6 6 0 0 1 -6 6 h-48 a6 6 0 0 1 -6 -6 z" fill={ORANGE} />
      {[-24, 0, 24].map((x, i) => <g key={i}>
        <rect x={x - 3} y="-34" width="6" height="18" rx="3" fill={i === 1 ? ORANGE : "#ff8c1a"} />
        <ellipse cx={x} cy="-38" rx="3.5" ry="5" fill={YELLOW} />
      </g>)}
    </g>
    {caption("2026 − 2010 = 16", "#fff", 82)}
  </Tile>;
}

export function TimetableArt() {
  const rows = [["6:30", "#8ecae6"], ["7:00", "#95d5b2"], ["8:00", ORANGE], ["16:00", YELLOW], ["19:00", "#c9a7f0"]];
  return <Tile label="Timetable">
    {rows.map(([t, c], i) => <g key={t} transform={`translate(-78,${-60 + i * 26})`}>
      <rect x="0" y="0" width="46" height="20" rx="6" fill={c} />
      <text x="23" y="14" textAnchor="middle" fontSize="11" fontWeight="800" fill="#12233a">{t}</text>
      <rect x="52" y="0" width={40 + (i % 3) * 26} height="20" rx="6" fill="#ffffff" opacity="0.9" />
    </g>)}
    {caption("Start · End · Duration", "#fff", 92)}
  </Tile>;
}

export function TravelArt() {
  return <Tile label="Travel time" bg="#123a5f">
    <line x1="-80" y1="10" x2="80" y2="10" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
    <g transform="translate(-52,10)">
      <rect x="-16" y="-14" width="34" height="22" rx="5" fill={ORANGE} />
      <rect x="-12" y="-8" width="9" height="8" rx="2" fill="#fff" />
      <rect x="0" y="-8" width="9" height="8" rx="2" fill="#fff" />
      <circle cx="-9" cy="10" r="4" fill={NAVY} /><circle cx="8" cy="10" r="4" fill={NAVY} />
    </g>
    <circle cx="66" cy="10" r="6" fill={YELLOW} />
    <text x="-52" y="-14" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">6:45 AM</text>
    <text x="66" y="-14" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">9:20 AM</text>
    {caption("2 hr 35 min", YELLOW, 52)}
    <text x="0" y="82" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">Departure → Arrival</text>
  </Tile>;
}

export function CookingArt() {
  return <Tile label="Cooking and daily life" bg="#0f3d2e">
    <g transform="translate(0,-4)">
      <rect x="-46" y="-6" width="92" height="46" rx="12" fill="#ffffff" />
      <rect x="-52" y="-14" width="104" height="14" rx="7" fill={YELLOW} />
      <path d="M-46 -6 q-14 10 0 22" fill="none" stroke="#ffffff" strokeWidth="5" />
      <path d="M46 -6 q14 10 0 22" fill="none" stroke="#ffffff" strokeWidth="5" />
      {[-18, 0, 18].map((x, i) => <path key={i} d={`M${x} -34 q6 -10 0 -18`} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />)}
    </g>
    {caption("20 + 35 = 55 min", "#fff", 78)}
  </Tile>;
}

export function WorkArt() {
  return <Tile label="Work and appointment planning">
    <g transform="translate(0,-6)">
      <rect x="-44" y="-8" width="88" height="52" rx="10" fill={ORANGE} />
      <rect x="-18" y="-18" width="36" height="12" rx="5" fill="#fff" />
      <rect x="-36" y="0" width="72" height="6" rx="3" fill="#fff" opacity="0.85" />
      <circle cx="0" cy="18" r="4" fill="#fff" />
    </g>
    <text x="0" y="66" textAnchor="middle" fontSize="12" fontWeight="900" fill={YELLOW}>3:30 − 45 min − buffer</text>
    {caption("= 2:30 PM निकलो", "#fff", 88)}
  </Tile>;
}

export function ZonesArt() {
  return <Tile label="Time zones">
    <circle cx="0" cy="-4" r="52" fill="#1b4a72" stroke={SKY} strokeWidth="3" />
    <ellipse cx="0" cy="-4" rx="52" ry="20" fill="none" stroke={SKY} strokeWidth="2" opacity="0.8" />
    <ellipse cx="0" cy="-4" rx="20" ry="52" fill="none" stroke={SKY} strokeWidth="2" opacity="0.8" />
    <path d="M-52 -4 h104" stroke={SKY} strokeWidth="2" opacity="0.8" />
    <circle cx="26" cy="-14" r="6" fill={YELLOW} />
    {caption("IST = UTC + 5:30", "#fff", 72)}
    <text x="0" y="88" textAnchor="middle" fontSize="11" fontWeight="700" fill={YELLOW}>Date + Time + Zone</text>
  </Tile>;
}

export function EvolutionArt() {
  const items = [["☀", YELLOW], ["⧗", SKY], ["⚙", "#c9a7f0"], ["⌚", GREEN], ["📱", ORANGE]];
  return <Tile label="Evolution of timekeeping" bg="#3a2a12">
    <path d="M-80 34 h160" stroke="#fff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
    {items.map(([g, c], i) => <g key={i} transform={`translate(${-64 + i * 32},4)`}>
      <circle r="14" fill={c} />
      <text x="0" y="5" textAnchor="middle" fontSize="15" fill="#12233a">{g}</text>
    </g>)}
    {caption("Sundial → Digital", "#fff", 72)}
  </Tile>;
}

export function EstimateArt() {
  return <Tile label="Time estimation" bg="#2a1b45">
    <text x="-40" y="8" textAnchor="middle" fontSize="30">🧠</text>
    <text x="40" y="8" textAnchor="middle" fontSize="30">⏱️</text>
    <text x="0" y="12" textAnchor="middle" fontSize="22" fontWeight="900" fill={YELLOW}>≈</text>
    {caption("10 pages ≈ 50 min", "#fff", 66)}
    <text x="0" y="86" textAnchor="middle" fontSize="11" fontWeight="700" fill={YELLOW}>planning estimate</text>
  </Tile>;
}

export function MistakesArt() {
  return <Tile label="Common mistakes" bg="#5a1f22">
    <g transform="translate(0,-16)">
      <text x="-44" y="4" textAnchor="middle" fontSize="34" fill={ROSE}>✗</text>
      <text x="0" y="6" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">1 hr = 100</text>
    </g>
    <g transform="translate(0,34)">
      <text x="-44" y="4" textAnchor="middle" fontSize="34" fill="#7ee0a8">✓</text>
      <text x="0" y="6" textAnchor="middle" fontSize="16" fontWeight="800" fill={YELLOW}>1 hr = 60</text>
    </g>
  </Tile>;
}

export function TrophyArt() {
  return <Tile label="Mastery">
    <g transform="translate(0,-6)">
      <path d="M-30 -34 h60 v22 a30 30 0 0 1 -60 0 z" fill={YELLOW} />
      <path d="M-30 -30 q-16 0 -16 12 q0 12 16 12" fill="none" stroke={YELLOW} strokeWidth="5" />
      <path d="M30 -30 q16 0 16 12 q0 12 -16 12" fill="none" stroke={YELLOW} strokeWidth="5" />
      <rect x="-6" y="12" width="12" height="16" fill="#f4a261" />
      <rect x="-22" y="28" width="44" height="10" rx="4" fill={ORANGE} />
    </g>
    {caption("Mastery 🏆", "#fff", 78)}
  </Tile>;
}

export function ProjectArt() {
  return <Tile label="Final project">
    <rect x="-70" y="-56" width="140" height="112" rx="12" fill="#fff" />
    <rect x="-70" y="-56" width="140" height="22" rx="12" fill={ORANGE} />
    <rect x="-70" y="-42" width="140" height="8" fill={ORANGE} />
    {[-28, -6, 16, 38].map((y, i) => <g key={i} transform={`translate(-58,${y})`}>
      <rect x="0" y="-6" width="14" height="14" rx="4" fill={i < 3 ? GREEN : "#dbe4ec"} />
      {i < 3 && <path d="M3 -1 l3 4 l6 -8" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
      <rect x="22" y="-4" width={60 + (i % 2) * 20} height="8" rx="4" fill="#dbe4ec" />
    </g>)}
    {caption("Weekly time plan", NAVY, 74)}
  </Tile>;
}

/** Compact art used inside hub course cards (no caption text). */
export function CardArt() {
  return <Tile label="Time & Calendar">
    <g transform="translate(-16,2)"><ClockGroup hour={10} minute={10} r={58} /></g>
    <g transform="translate(58,30) scale(0.5)"><CalendarGroup month="JUNE" highlight={[15]} days={30} startCol={6} /></g>
  </Tile>;
}

const MAP = {
  c1: IdeaArt,
  c2: UnitsArt,
  c3: LeapArt,
  c4: () => <ClockArt hour={4} minute={0} />,
  c5: DigitalArt,
  c6: ConvertArt,
  c7: DurationArt,
  c8: AddArt,
  c9: SubArt,
  c10: MidnightArt,
  c11: CalendarArt,
  c12: DateDiffArt,
  c13: AgeArt,
  c14: TimetableArt,
  c15: TravelArt,
  c16: CookingArt,
  c17: WorkArt,
  c18: ZonesArt,
  c19: EvolutionArt,
  c20: EstimateArt,
  c21: MistakesArt,
  c22: TrophyArt,
  c23: ProjectArt,
};

export function chapterArt(id) {
  const C = MAP[id] || IdeaArt;
  return <C />;
}

/** Large header illustration: clock + calendar + sun/moon. */
export function HeroArt({ className = "" }) {
  const uid = useId().replace(/[:]/g, "");
  const bgId = "heroBg-" + uid, glowId = "heroGlow-" + uid;
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="घड़ी और कैलेंडर illustration" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b3a63" /><stop offset="1" stopColor="#001529" />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="45%" r="62%">
          <stop offset="0" stopColor={YELLOW} stopOpacity="0.3" /><stop offset="1" stopColor={YELLOW} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="26" fill={`url(#${bgId})`} />
      <circle cx="200" cy="150" r="150" fill={`url(#${glowId})`} />
      {[[36, 40], [92, 74], [300, 36], [352, 92], [210, 26], [150, 260], [280, 258]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" opacity="0.75" />)}
      <g transform="translate(70,58)">
        <circle r="17" fill={YELLOW} />
        {Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return <line key={i} x1={Math.cos(a) * 22} y1={Math.sin(a) * 22} x2={Math.cos(a) * 28} y2={Math.sin(a) * 28} stroke={YELLOW} strokeWidth="3.5" strokeLinecap="round" />; })}
      </g>
      <path d="M332 48 a20 20 0 1 0 12 36 a16 16 0 1 1 -12 -36 z" fill="#cfe0ee" />
      <g transform="translate(120,168)"><ClockGroup hour={10} minute={10} r={78} /></g>
      <g transform="translate(292,168) scale(0.62)"><CalendarGroup month="JUNE" highlight={[15]} days={30} startCol={6} /></g>
      <text x="120" y="272" textAnchor="middle" fontSize="15" fontWeight="900" fill={YELLOW} letterSpacing="0.5">समय एवं कैलेंडर</text>
      <text x="292" y="272" textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" opacity="0.85">Time &amp; Calendar</text>
    </svg>
  );
}
