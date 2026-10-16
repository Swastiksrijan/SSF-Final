import { FaArrowRight, FaBookOpen, FaClock, FaGraduationCap, FaShareAlt } from "react-icons/fa";
import { isTimeCalendarSubject } from "../../data/timeCalendarCourse";
import { isFruitsSubject } from "../../data/fruitsCourse";
import { isVocabularySubject } from "../../data/vocabularyCourse";
import { isTreesForestsSubject } from "../../data/treesForestsCourse";
import { CardArt as TimeCardArt } from "./TimeCalendarArt";
import { CardArt as FruitCardArt } from "./FruitsArt";
import { CardArt as VocabCardArt } from "./VocabularyArt";
import { CardArt as TreesCardArt } from "./TreesForestsArt";
import { GlyphCard, subjectCardArt } from "./CourseArtKit";
import { getKnowledgeWorldCourse, isKnowledgeWorldSubject } from "../../data/knowledgeWorldCourse";

const TONE = {
  gold: "border-[#F7A814]/50 bg-[#FAF9F5] text-[#E6530E]",
  blue: "border-[#EAF0F6]/60 bg-[#EAF0F6] text-[#12345A]",
  green: "border-[#176447]/60 bg-[#EAF0F6] text-[#176447]",
};

// One learner-facing card used everywhere in the hub (dashboard, explore,
// my-learning) so the whole experience feels like a single premium system.
// All values come from the real subject data — no invented descriptions.
export default function SubjectCard({ subject, onOpen, onShare, progress = 0, badge, level, moduleCount, hours, actionLabel }) {
  const pct = Math.max(0, Math.min(100, Math.round(progress || 0)));
  const meta = badge || (subject && subject.category === "Knowledge World / ज्ञान संसार" ? { icon: "🌍", label: "Knowledge", tone: "green" } : null);
  const isTC = isTimeCalendarSubject(subject);
  const isFruit = isFruitsSubject(subject);
  const isVocab = isVocabularySubject(subject);
  const isTrees = isTreesForestsSubject(subject);
  const kwCourse = isKnowledgeWorldSubject(subject) ? getKnowledgeWorldCourse(subject) : null;
  const kwCardArt = kwCourse ? <GlyphCard glyphs={[kwCourse.icon, ...kwCourse.modules.slice(0, 2).map((m) => (m.title.match(/^\p{Emoji}/u) || [kwCourse.icon])[0])]} label={subject.hi || ""} /> : null;
  const hasPhoto = Boolean(subject.photo || subject.image);
  const cardArt = isTC ? <TimeCardArt /> : isFruit ? <FruitCardArt /> : isVocab ? <VocabCardArt /> : isTrees ? <TreesCardArt /> : kwCardArt || (hasPhoto ? null : subjectCardArt(subject));
  return <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[#FAF9F5] bg-white shadow-[0_18px_45px_-38px_rgba(20,43,69,0.6)] transition duration-300 hover:-translate-y-1.5 hover:border-[#E6530E]/45 hover:shadow-[0_32px_65px_-40px_rgba(20,43,69,0.7)]">
    <div className="ssf-shine relative h-44 overflow-hidden">
      <div className={"absolute inset-0 bg-gradient-to-br " + (subject.color || "from-[#12345A] to-[#12345A]")} />
      {cardArt
        ? <div className="absolute inset-0 flex items-center justify-center p-4"><div className="h-full w-full max-w-[15rem]">{cardArt}</div></div>
        : <img src={subject.photo || subject.image} alt={subject.en} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-110" />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#12345A]/88 via-[#12345A]/20 to-transparent" />
      <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-1.5">
        {meta && <span className={"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur " + (TONE[meta.tone] || TONE.gold)}>
          <span aria-hidden="true">{meta.icon}</span> {meta.label}
        </span>}
      </div>
      <div className="absolute bottom-3.5 left-4 right-4 text-white">
        <h3 className="font-serif text-xl font-bold leading-tight">{subject.en}</h3>
        <div className="mt-0.5 text-xs font-semibold text-[#F7A814]">{subject.hi}</div>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-5">
      {level && <div className="mb-3"><span className="inline-flex rounded-full bg-[#FAF9F5] px-2.5 py-1 text-[10px] font-bold text-[#26343D]">{level}</span></div>}
      <p className="flex-1 text-sm leading-6 text-[#26343D]">{subject.intro}</p>

      {pct > 0 && <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#E6530E]"><span>{pct >= 100 ? "Completed" : "In progress"}</span><span>{pct}%</span></div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#FAF9F5]"><div className="h-full rounded-full bg-gradient-to-r from-[#E6530E] to-[#F7A814]" style={{ width: pct + "%" }} /></div>
      </div>}

      {(moduleCount || hours) && <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[11px] font-bold text-[#26343D]">
        {moduleCount ? <div className="rounded-xl border border-[#FAF9F5] bg-[#FAF9F5] p-2"><FaBookOpen className="mx-auto mb-1 text-[#E6530E]" />{moduleCount}<span className="block text-[9px] font-normal text-[#26343D]">Modules</span></div> : null}
        {hours ? <div className="rounded-xl border border-[#FAF9F5] bg-[#FAF9F5] p-2"><FaClock className="mx-auto mb-1 text-[#E6530E]" />{hours}<span className="block text-[9px] font-normal text-[#26343D]">Hours</span></div> : null}
      </div>}

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
        <button type="button" onClick={() => onOpen(subject)} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E6530E] to-[#E6530E] px-5 py-3.5 text-sm font-bold text-[#12345A] shadow-[0_16px_36px_-22px_rgba(184,144,63,0.95)] transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-[#E6530E]/25">
          {actionLabel || (pct > 0 && pct < 100 ? "Continue Learning / जारी रखें" : "Start Learning / सीखना शुरू करें")} <FaArrowRight />
        </button>
        {onShare && <button type="button" onClick={() => onShare(subject)} aria-label={"Share " + subject.en} title="Share this course" className="inline-flex min-w-12 items-center justify-center gap-2 rounded-full border border-[#E6530E]/30 bg-[#FAF9F5] px-3.5 text-[#E6530E] transition hover:bg-[#FAF9F5] focus:outline-none focus:ring-4 focus:ring-[#E6530E]/20">
          <FaShareAlt /> <span className="sr-only">Share</span>
        </button>}
      </div>
    </div>
  </article>;
}
