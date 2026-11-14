import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";

const founder = {
  name: "Ramesh Pandey",
  designation: "Founder",
  location: "Rewa, Madhya Pradesh",
  img: "/Teams_Images/ramesh_pandey.jpg?v=3",
};

// Mirrors backend_node/data/managingCommittee.js — the single source of truth
// for the current committee (term 2025–2028).
const committee = [
  { name: "Mr. Ramesh Pandey", designation: "President", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/ramesh_pandey.jpg?v=3" },
  { name: "Ms. Preeti Shukla", designation: "Vice President", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_19.jpg" },
  { name: "Mr. Amit Kumar Pandey", designation: "Secretary", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_15.jpg" },
  { name: "Ms. Divya Sharma", designation: "Treasurer", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/divya_sharma.jpg" },
  { name: "Ms. Kiran Pandey", designation: "Joint Secretary", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_22.jpg" },
  { name: "Mr. Ritesh Kumar Tiwari", designation: "Member", location: "Mumbai, Maharashtra", img: "/Teams_Images/ritesh_tiwari.jpg" },
  { name: "Mr. Rishi Kumar Pandey", designation: "Member", location: "Satna, Madhya Pradesh", img: "/Teams_Images/rishi_pandey.jpg" },
  { name: "Mr. Sandeep Tripathi", designation: "Member", location: "Satna, Madhya Pradesh", img: "/Teams_Images/sandeep_tripathi.jpg" },
  { name: "Mr. Prameesh Singh", designation: "Member", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/prameesh_singh.jpg" },
];

const advisory = [
  { name: "Ms. Priya Shukla", designation: "Administrative Coordinator", location: "Madhya Pradesh", img: "/Teams_Images/priya_shukla.jpg" },
  { name: "Mr. Chaman Rajora", designation: "National Advisory Board", location: "Haryana", img: "/Teams_Images/chaman_rajora.jpg" },
  { name: "Mr. Kapil Tiwari", designation: "Legal Advisor", location: "Madhya Pradesh", img: "/Teams_Images/kapil_tiwari.jpg" },
  { name: "Mr. Harish Kumar", designation: "Legal Advisor", location: "Madhya Pradesh", img: "/Teams_Images/harish_kumar.jpg" },
];

const volunteers = [
  { name: "Mr. Rajeev Pandey", designation: "Advisor & Volunteer", location: "Madhya Pradesh", img: "/Teams_Images/rajeev_pandey.jpg" },
  { name: "Ms. A. Gincy George", designation: "Counselling Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/image_1.jpg" },
  { name: "Mr. Krishna Kumar", designation: "Volunteer & Advisor", location: "Hyderabad, Telangana", img: "/Teams_Images/krishna_kumar.jpg" },
  { name: "Ms. Sneha Ravishankar Pandey", designation: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/sneha_ravishankar_pandey.jpg" },
  { name: "Ms. Vaishnavi Manik Chaudhari", designation: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/vaishnavi_manik_chaudhari.jpg" },
];

// The committee section is drawn as a governance matrix: the President sits on
// top, connector rails and arrows link down to the office bearers and then to
// the general members. Everything is rendered from the committee list, so
// changing a member or designation updates the chart automatically.
const COMMITTEE_TERM = "2025–2028";

const ACCENTS = [
  { dot: "#F7A814", bar: "from-[#F7A814] to-[#FBCB6B]", chip: "bg-[#FEF3C7]", text: "text-[#B45309]" },
  { dot: "#176447", bar: "from-[#176447] to-[#3F9E78]", chip: "bg-[#DCFCE7]", text: "text-[#166534]" },
  { dot: "#1D4ED8", bar: "from-[#1D4ED8] to-[#60A5FA]", chip: "bg-[#DBEAFE]", text: "text-[#1D4ED8]" },
  { dot: "#7C3AED", bar: "from-[#7C3AED] to-[#A78BFA]", chip: "bg-[#EDE9FE]", text: "text-[#6D28D9]" },
  { dot: "#0891B2", bar: "from-[#0891B2] to-[#22D3EE]", chip: "bg-[#CFFAFE]", text: "text-[#0E7490]" },
];

const isMember = (m) => /member/i.test(m.designation);

function ConnectorArrow({ color, className = "" }) {
  return (
    <span className={`absolute left-1/2 -translate-x-1/2 ${className}`} style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `8px solid ${color}` }} aria-hidden="true" />
  );
}

function OrgNode({ person, accent, featured = false }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E7EDF3] bg-white px-3 pb-3.5 pt-4 text-center shadow-[0_16px_36px_-24px_rgba(8,43,73,.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_46px_-24px_rgba(8,43,73,.55)]">
      <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundImage: `linear-gradient(90deg, ${accent.dot}, #F7A814)` }} aria-hidden="true" />
      <div className="mx-auto w-fit rounded-full p-[3px]" style={{ backgroundImage: `conic-gradient(from 140deg, ${accent.dot}, #F7A814, #176447, ${accent.dot})` }}>
        <img src={person.img} alt={person.name} loading="lazy" className={`${featured ? "h-24 w-24 sm:h-28 sm:w-28" : "h-16 w-16 sm:h-20 sm:w-20"} rounded-full border-[3px] border-white object-cover`} />
      </div>
      <p className={`mt-2.5 font-black uppercase leading-tight tracking-wide text-[#0F2C48] ${featured ? "text-sm sm:text-base" : "text-[11px] sm:text-xs"}`}>{person.designation}</p>
      <span className="mt-1.5 inline-block h-1 w-8 rounded-full" style={{ backgroundImage: `linear-gradient(90deg, ${accent.dot}, #F7A814)` }} aria-hidden="true" />
      <p className="mt-1 text-[10px] font-medium text-slate-400">{person.location}</p>
    </div>
  );
}

function OrgMember({ person, accent }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[#E7EDF3] bg-white px-3 py-2.5 text-left shadow-[0_12px_30px_-24px_rgba(8,43,73,.6)] transition duration-300 hover:-translate-y-0.5">
      <img src={person.img} alt={person.name} loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover" style={{ boxShadow: `0 0 0 2px ${accent.dot}` }} />
      <div className="min-w-0">
        <p className="truncate text-xs font-bold uppercase tracking-wide text-[#0F2C48]">{person.designation}</p>
        <p className="truncate text-[10px] font-medium text-slate-400">{person.location}</p>
      </div>
    </div>
  );
}

function OrgRow({ items, offset = 0, kind }) {
  const n = items.length;
  const center = (i) => `${((i + 0.5) / n) * 100}%`;
  return (
    <div className="relative">
      <span className="absolute top-0 h-[2px]" style={{ left: center(0), right: `calc(100% - ${center(n - 1)})`, backgroundImage: "linear-gradient(90deg, #F7A814, #176447, #1D4ED8)" }} aria-hidden="true" />
      <div className="flex">
        {items.map((person, i) => {
          const accent = ACCENTS[(i + offset) % ACCENTS.length];
          return (
            <div key={person.name} className="relative flex-1 px-1.5 pt-10 sm:px-2.5">
              <span className="absolute left-1/2 top-0 h-8 w-[2px] -translate-x-1/2" style={{ backgroundImage: `linear-gradient(180deg, #176447, ${accent.dot})` }} aria-hidden="true" />
              <ConnectorArrow color={accent.dot} className="top-[26px]" />
              {kind === "member" ? <OrgMember person={person} accent={accent} /> : <OrgNode person={person} accent={accent} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CommitteeMatrix({ members }) {
  const president = members.find((m) => /president/i.test(m.designation) && !/vice/i.test(m.designation)) || members[0];
  const rest = members.filter((m) => m !== president);
  const bearers = rest.filter((m) => !isMember(m));
  const general = rest.filter(isMember);
  const ordered = [president, ...bearers, ...general];

  return (
    <div className="relative mb-12 overflow-hidden rounded-[2rem] border border-[#E3E9F0] bg-gradient-to-br from-[#F8FBFD] via-white to-[#EEF5F1] p-5 shadow-[0_36px_80px_-48px_rgba(8,43,73,.55)] sm:p-8 md:p-10">
      <span className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full opacity-25" style={{ backgroundImage: "radial-gradient(circle, #F7A814, transparent 70%)" }} aria-hidden="true" />
      <span className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full opacity-25" style={{ backgroundImage: "radial-gradient(circle, #176447, transparent 70%)" }} aria-hidden="true" />

      <div className="relative mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E9F0] pb-5">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#176447]">Swastik Srijan Foundation Samiti</p>
          <h3 className="mt-2 text-2xl font-black text-[#0F2C48] sm:text-3xl">कार्यकारिणी समिति</h3>
        </div>
        <span className="rounded-full border border-[#F7A814]/40 bg-[#FEF3C7] px-4 py-2 text-xs font-bold text-[#B45309]">कार्यकाल {COMMITTEE_TERM}</span>
      </div>

      <div className="relative hidden sm:block">
        <div className="mx-auto w-full max-w-[15rem]"><OrgNode person={president} accent={ACCENTS[0]} featured /></div>
        <div className="relative h-9">
          <span className="absolute left-1/2 top-0 h-9 w-[2px] -translate-x-1/2" style={{ backgroundImage: "linear-gradient(180deg, #F7A814, #176447)" }} aria-hidden="true" />
          <ConnectorArrow color="#176447" className="top-[28px]" />
        </div>
        <OrgRow items={bearers} offset={1} />
        <div className="relative h-9">
          <span className="absolute left-1/2 top-0 h-9 w-[2px] -translate-x-1/2" style={{ backgroundImage: "linear-gradient(180deg, #176447, #1D4ED8)" }} aria-hidden="true" />
          <ConnectorArrow color="#1D4ED8" className="top-[28px]" />
        </div>
        <OrgRow items={general} offset={2} kind="member" />
      </div>

      <ol className="relative sm:hidden">
        {ordered.map((person, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <li key={person.name} className="relative flex gap-3 pb-5 pl-8">
              {i < ordered.length - 1 && <span className="absolute bottom-0 left-[9px] top-4 w-[2px]" style={{ backgroundImage: `linear-gradient(180deg, ${accent.dot}, #1D4ED8)` }} aria-hidden="true" />}
              <span className="absolute left-0 top-3 h-5 w-5 rounded-full border-2 border-white shadow" style={{ background: accent.dot }} aria-hidden="true" />
              <div className="w-full">{isMember(person) ? <OrgMember person={person} accent={accent} /> : <OrgNode person={person} accent={accent} featured={person === president} />}</div>
            </li>
          );
        })}
      </ol>

      <p className="relative mt-6 text-center text-[11px] font-medium text-slate-500">Total {members.length} office bearers &amp; members · कुल {members.length} पदाधिकारी एवं सदस्य</p>
    </div>
  );
}

function PersonCard({ person, index = 0 }) {
  return (
    <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.04 }} className="overflow-hidden rounded-2xl border border-[#EAF0F6] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-[#EAF0F6]">
        <img src={person.img} alt={person.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <div className="p-5">
        <h3 className="text-base font-extrabold text-[#12345A]">{person.name}</h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#176447]">{person.designation}</p>
        <p className="mt-3 border-t border-[#EAF0F6] pt-3 text-xs text-slate-500">{person.location}</p>
      </div>
    </motion.article>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return <div className="mb-9"><p className="text-xs font-black uppercase tracking-[.2em] text-[#176447]">{eyebrow}</p><h2 className="mt-3 text-3xl font-black text-[#12345A] md:text-4xl">{title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{subtitle}</p></div>;
}

export default function Team() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <section className="relative isolate overflow-hidden bg-[#082B49] px-5 py-28 text-white md:py-36">
        <div className="absolute inset-0 -z-10 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, #F7A814, transparent 32%), radial-gradient(circle at 85% 80%, #176447, transparent 34%)" }} />
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_.7fr]">
          <div><p className="text-xs font-black uppercase tracking-[.22em] text-[#F7C45B]">People • Service • Community</p><h1 className="mt-5 text-4xl font-black md:text-6xl">People Behind the Mission</h1><p className="mt-3 text-xl font-semibold text-white/85">मिशन से जुड़े लोग</p><p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 md:text-base">Meet the Founder, the Managing Committee and the volunteers who contribute their time, skills and experience to community-focused work.</p></div>
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl"><img src={founder.img} alt="Ramesh Pandey, Founder" className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" /><div className="px-3 py-4"><p className="text-lg font-extrabold">Ramesh Pandey</p><p className="mt-1 text-sm font-semibold text-[#F7C45B]">Founder</p></div></div>
        </div>
      </section>

      <section className="bg-[#F5F8FA] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Managing Committee" title="कार्यकारिणी समिति" subtitle="The office bearers and members who currently hold responsibility for the Foundation’s governance, finance, compliance and institutional development." />
          <CommitteeMatrix members={committee} />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Advisory Council" title="सलाहकार परिषद्" subtitle="Experienced professionals providing strategic, legal and institutional guidance to the Foundation." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{advisory.map((person, index) => <PersonCard key={person.name} person={person} index={index} />)}</div>
        </div>
      </section>

      <section className="bg-[#F5F8FA] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Volunteer & Professional Network" title="स्वयंसेवक एवं प्रोफेशनल नेटवर्क" subtitle="People contributing specialist knowledge, counselling, technology and volunteer support. Participation and assignments are based on mutual understanding and current programme needs." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{volunteers.map((person, index) => <PersonCard key={person.name} person={person} index={index} />)}</div>
        </div>
      </section>

      <section className="bg-[#082B49] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-5xl text-center"><h2 className="text-3xl font-black md:text-4xl">Join Our Mission</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">Contribute your time, skills or resources to meaningful community initiatives.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/Volunteer" className="inline-flex items-center gap-2 rounded-full bg-[#176447] px-6 py-3 text-sm font-bold text-white">Volunteer <FaArrowRight /></Link><Link to="/PartnerWithUs" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white">Partner With Us</Link><Link to="/Donate" className="inline-flex items-center gap-2 rounded-full bg-[#F7A814] px-6 py-3 text-sm font-bold text-[#082B49]">Support SSF</Link></div></div>
      </section>
    </main>
  );
}
