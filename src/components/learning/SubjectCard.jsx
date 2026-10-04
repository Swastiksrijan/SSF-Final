import { FaArrowRight, FaBookOpen, FaClock, FaGraduationCap, FaShareAlt } from "react-icons/fa";
import { isTimeCalendarSubject } from "../../data/timeCalendarCourse";
import { isFruitsSubject } from "../../data/fruitsCourse";
import { isVocabularySubject } from "../../data/vocabularyCourse";
import { CardArt as TimeCardArt } from "./TimeCalendarArt";
import { CardArt as FruitCardArt } from "./FruitsArt";
import { CardArt as VocabCardArt } from "./VocabularyArt";

const TONE = {
  gold: "border-[#FFD166]/50 bg-[#FFF7EA] text-[#B34A00]",
  blue: "border-[#8ecae6]/60 bg-[#eef7fb] text-[#0f4c81]",
  green: "border-[#95d5b2]/60 bg-[#eaf7f0] text-[#177245]",
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
  const cardArt = isTC ? <TimeCardArt /> : isFruit ? <FruitCardArt /> : isVocab ? <VocabCardArt /> : null;
  return <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[#e3ddcd] bg-white shadow-[0_18px_45px_-38px_rgba(20,43,69,0.6)] transition duration-300 hover:-translate-y-1.5 hover:border-[#FF6600]/45 hover:shadow-[0_32px_65px_-40px_rgba(20,43,69,0.7)]">
    <div className="ssf-shine relative h-44 overflow-hidden">
      <div className={"absolute inset-0 bg-gradient-to-br " + (subject.color || "from-[#003366] to-[#0f4c81]")} />
      {cardArt
        ? <div className="absolute inset-0 flex items-center justify-center p-4"><div className="h-full w-full max-w-[15rem]">{cardArt}</div></div>
        : <img src={subject.photo || subject.image} alt={subject.en} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-110" />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e33]/88 via-[#0a1e33]/20 to-transparent" />
      <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-1.5">
        {meta && <span className={"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur " + (TONE[meta.tone] || TONE.gold)}>
          <span aria-hidden="true">{meta.icon}</span> {meta.label}
        </span>}
      </div>
      <div className="absolute bottom-3.5 left-4 right-4 text-white">
        <h3 className="font-serif text-xl font-bold leading-tight">{subject.en}</h3>
        <div className="mt-0.5 text-xs font-semibold text-[#FFD166]">{subject.hi}</div>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-5">
      {level && <div className="mb-3"><span className="inline-flex rounded-full bg-[#f1efe8] px-2.5 py-1 text-[10px] font-bold text-[#5b6b7c]">{level}</span></div>}
      <p className="flex-1 text-sm leading-6 text-[#5b6b7c]">{subject.intro}</p>

      {pct > 0 && <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#FF6600]"><span>{pct >= 100 ? "Completed" : "In progress"}</span><span>{pct}%</span></div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#F3E7D5]"><div className="h-full rounded-full bg-gradient-to-r from-[#FF6600] to-[#FFD166]" style={{ width: pct + "%" }} /></div>
      </div>}

      {(moduleCount || hours) && <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[11px] font-bold text-[#7286a0]">
        {moduleCount ? <div className="rounded-xl border border-[#F3E7D5] bg-[#fbfaf7] p-2"><FaBookOpen className="mx-auto mb-1 text-[#FF6600]" />{moduleCount}<span className="block text-[9px] font-normal text-[#9aa7b4]">Modules</span></div> : null}
        {hours ? <div className="rounded-xl border border-[#F3E7D5] bg-[#fbfaf7] p-2"><FaClock className="mx-auto mb-1 text-[#FF6600]" />{hours}<span className="block text-[9px] font-normal text-[#9aa7b4]">Hours</span></div> : null}
      </div>}

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
        <button type="button" onClick={() => onOpen(subject)} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF8C1A] to-[#FF6600] px-5 py-3.5 text-sm font-bold text-[#142b45] shadow-[0_16px_36px_-22px_rgba(184,144,63,0.95)] transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-[#FF6600]/25">
          {actionLabel || (pct > 0 && pct < 100 ? "Continue Learning / जारी रखें" : "Start Learning / सीखना शुरू करें")} <FaArrowRight />
        </button>
        {onShare && <button type="button" onClick={() => onShare(subject)} aria-label={"Share " + subject.en} title="Share this course" className="inline-flex min-w-12 items-center justify-center gap-2 rounded-full border border-[#FF6600]/30 bg-[#FFF7EA] px-3.5 text-[#B34A00] transition hover:bg-[#FFEFD6] focus:outline-none focus:ring-4 focus:ring-[#FF6600]/20">
          <FaShareAlt /> <span className="sr-only">Share</span>
        </button>}
      </div>
    </div>
  </article>;
}
