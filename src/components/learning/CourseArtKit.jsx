/**
 * CourseArtKit — reusable, code-generated SVG art for Master Courses.
 *
 * Instead of hand-authoring a scene per chapter for every subject, this kit
 * builds consistent, on-brand tiles from each chapter's own icon (emoji) plus
 * the course's module/meta icons. Everything is coded SVG — no stock photos.
 *
 * Usage in the hub:
 *   import { makeCourseArt } from "../components/learning/CourseArtKit";
 *   const art = makeCourseArt(MY_COURSE);
 *   <MasterCourse ... art={art.chapterArt} HeroArt={art.HeroArt} />
 *   // and for the card:  <art.CardArt />
 */

import { useId } from "react";

const NAVY = "#0b3a63";
const YELLOW = "#FFD166";

function Frame({ children, bg, label }) {
  const uid = useId().replace(/[:]/g, "");
  const gid = "cak-" + uid;
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <rect x="-100" y="-100" width="200" height="200" rx="26" fill={bg} />
      <rect x="-100" y="-100" width="200" height="200" rx="26" fill={`url(#${gid})`} />
      <defs>
        <radialGradient id={gid} cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {children}
    </svg>
  );
}

/** Palette per category, so tiles feel subject-appropriate but consistent. */
const PALETTE = {
  green: "#0f3d2e",
  blue: "#123a5f",
  navy: NAVY,
  earth: "#5a3b1e",
  sky: "#0b3a63",
  violet: "#3b2a63",
};

function pickBg(seed = "") {
  const keys = Object.keys(PALETTE);
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return PALETTE[keys[h % keys.length]];
}

/** One coded scene: the chapter's emoji as the hero glyph on a themed tile. */
export function SceneTile({ emoji = "📘", label = "", bg, caption, size = 78 }) {
  return (
    <Frame bg={bg || pickBg(label)} label={label || "course illustration"}>
      <circle cx="0" cy="-6" r="52" fill="#ffffff14" />
      <text x="0" y="18" textAnchor="middle" fontSize={size}>{emoji}</text>
      {caption && <text x="0" y="80" textAnchor="middle" fontSize="13" fontWeight="900" fill={YELLOW}>{caption}</text>}
    </Frame>
  );
}

/** Compact card art from up to three glyphs + a label. */
export function GlyphCard({ glyphs = ["📘"], label = "", bg }) {
  const list = glyphs.slice(0, 3);
  return (
    <Frame bg={bg || pickBg(label)} label={label || "course"}>
      {list.map((g, i) => {
        const n = list.length;
        const x = n === 1 ? 0 : -44 + i * 44;
        return <text key={i} x={x} y={n === 1 ? 16 : 12} textAnchor="middle" fontSize={n === 1 ? 76 : 46}>{g}</text>;
      })}
      {label && <text x="0" y="78" textAnchor="middle" fontSize="12" fontWeight="900" fill={YELLOW}>{label}</text>}
    </Frame>
  );
}

/** Large hero: floating glyphs around the course's main icon. */
export function GlyphHero({ icon = "📘", glyphs = [], title = "", className = "" }) {
  const uid = useId().replace(/[:]/g, "");
  const gid = "cakh-" + uid;
  const spots = [[80, 66], [320, 78], [70, 214], [330, 208], [200, 46]];
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={title || "course illustration"} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#123a5f" /><stop offset="1" stopColor="#001529" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" rx="26" fill={`url(#${gid})`} />
      {[[44, 40], [120, 30], [280, 34], [356, 60], [40, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" opacity="0.6" />)}
      {glyphs.slice(0, 5).map((g, i) => {
        const [x, y] = spots[i];
        return <g key={i} opacity="0.95"><circle cx={x} cy={y} r="26" fill="#ffffff1a" /><text x={x} y={y + 9} textAnchor="middle" fontSize="26">{g}</text></g>;
      })}
      <circle cx="200" cy="156" r="66" fill="#ffffff14" />
      <text x="200" y="186" textAnchor="middle" fontSize="86">{icon}</text>
      {title && <text x="200" y="288" textAnchor="middle" fontSize="17" fontWeight="900" fill={YELLOW} letterSpacing="0.5">{title}</text>}
    </svg>
  );
}

/** Category → emoji, so every subject card gets coded art even without a photo. */
const CATEGORY_EMOJI = {
  "Education / शिक्षा": "📚",
  "English & Communication / अंग्रेज़ी एवं संचार": "🗣️",
  "Digital Skills / डिजिटल कौशल": "💻",
  "Career & Workplace / करियर एवं कार्यस्थल": "💼",
  "Skill Development / कौशल विकास": "🛠️",
  "Women & Child Development / महिला एवं बाल विकास": "👩‍👧",
  "Health / स्वास्थ्य": "🩺",
  "Environment / पर्यावरण": "🌱",
  "Agriculture & Rural Development / कृषि एवं ग्रामीण विकास": "🌾",
  "Social Justice & Human Values / सामाजिक न्याय एवं मानवीय मूल्य": "⚖️",
  "Disability & Rehabilitation / दिव्यांगता एवं पुनर्वास": "♿",
  "Animal Protection / पशु संरक्षण": "🐾",
  "Culture & Heritage / संस्कृति एवं विरासत": "🏛️",
  "Youth & Disaster Preparedness / युवा एवं आपदा तैयारी": "🚨",
  "Personal Development / व्यक्तिगत विकास": "🌱",
  "NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान": "🤝",
  "Knowledge World / ज्ञान संसार": "🌍",
  "Office Skills / कार्यालय कौशल": "🗂️",
  "Computer Education / कंप्यूटर शिक्षा": "🖥️",
  "Entrepreneurship & Work / उद्यमिता एवं कार्य": "🚀",
  "Research & Mastery Skills / शोध एवं दक्षता कौशल": "🔍",
  "Arts, Creativity & Culture / कला, रचनात्मकता एवं संस्कृति": "🎨",
  "Media & Information Literacy / मीडिया एवं सूचना साक्षरता": "📰",
  "Practical Everyday Life / दैनिक व्यावहारिक जीवन": "🧰",
  "AI & Future Technology / AI एवं भविष्य की तकनीक": "🤖",
  "Life Skills / जीवन कौशल": "🌟",
  "Sports, Fitness & Wellness / खेल, फिटनेस एवं कल्याण": "🏃",
  "Mathematics & Financial Literacy / गणित एवं वित्तीय साक्षरता": "➗",
  "Languages / भाषाएँ": "🌐",
  "Science / विज्ञान": "🔬",
};

/** Coded card art derived only from the subject's own fields. */
export function subjectCardArt(subject) {
  const emoji = CATEGORY_EMOJI[subject.category] || "📘";
  const glyphs = [emoji, ...(String(subject.en || "").match(/^\p{Emoji}/u) || [])];
  return <GlyphCard glyphs={glyphs} label={subject.hi || ""} />;
}

/**
 * Build the three art surfaces for a Master Course straight from its data.
 * chapters' `icon` drive the scene art; `meta.icon` drives hero/card.
 */
export function makeCourseArt(course) {
  const chapters = (course.modules || []).flatMap((m) => m.chapters || []);
  const byId = {};
  chapters.forEach((c) => { byId[c.id] = { icon: c.icon, title: c.title }; });
  const chapterArt = (id) => {
    const c = byId[id];
    return <SceneTile emoji={(c && c.icon) || "📘"} label={(c && c.title) || ""} />;
  };
  const cardGlyphs = [course.meta.icon, ...chapters.slice(0, 2).map((c) => c.icon)];
  const CardArt = () => <GlyphCard glyphs={cardGlyphs} label={course.meta.title?.[1] || ""} />;
  const heroGlyphs = chapters.slice(0, 5).map((c) => c.icon);
  const HeroArt = ({ className = "" }) => <GlyphHero icon={course.meta.icon} glyphs={heroGlyphs} title={course.meta.title?.[1] || ""} className={className} />;
  return { chapterArt, CardArt, HeroArt };
}
