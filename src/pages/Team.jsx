import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";
import { Crown, Landmark, FileText, Coins, ScrollText, Users } from "lucide-react";

// ---------------------------------------------------------------------------
// Palette (see the Our Team design spec)
// ---------------------------------------------------------------------------
const NAVY = "#002344";
const GREEN = "#174B3A";
const GOLD = "#D6B56D";
const GOLD_DARK = "#B8860B";
const LINE = "#8B9BA8";

const HINDI_POST = {
  President: "अध्यक्ष",
  "Vice President": "उपाध्यक्ष",
  Secretary: "सचिव",
  Treasurer: "कोषाध्यक्ष",
  "Joint Secretary": "संयुक्त सचिव",
  Member: "कार्यकारिणी सदस्य",
};

const POST_ICON = {
  President: Crown,
  "Vice President": Landmark,
  Secretary: FileText,
  Treasurer: Coins,
  "Joint Secretary": ScrollText,
  Member: Users,
};

const PRESIDENT_INTRO =
  "Founder of Swastik Srijan Foundation and its first President, guiding the Foundation’s mission, governance and community work since inception.";

// Mirrors backend_node/data/managingCommittee.js — the single source of truth
// for the current committee.
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

const nameOf = (p) => p.name.replace(/^(Mr\.|Ms\.|Mrs\.)\s*/, "");
const isMember = (m) => /member/i.test(m.designation);
const isPresident = (m) => /president/i.test(m.designation) && !/vice/i.test(m.designation);

const president = committee.find(isPresident) || committee[0];
const bearers = committee.filter((m) => !isPresident(m) && !isMember(m));
const executives = committee.filter(isMember);
const displayPost = (d) => (d === "Member" ? "Executive Member" : d);

const GRAIN =
  "radial-gradient(circle at 15% 12%, rgba(214,181,109,.14), transparent 42%), radial-gradient(circle at 85% 88%, rgba(23,75,58,.20), transparent 46%)";

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

function Ornament({ tone = GOLD, className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(90deg, transparent, ${tone})` }} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: tone }} />
      <span className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(90deg, ${tone}, transparent)` }} />
    </div>
  );
}

function RaisedAvatar({ person, size = "md", ring }) {
  const dims = size === "lg" ? "h-24 w-24 sm:h-28 sm:w-28" : size === "sm" ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24";
  const bg = ring || `linear-gradient(150deg, ${GOLD}, ${GREEN})`;
  return (
    <div className="rounded-full p-[3px] shadow-[0_20px_34px_-12px_rgba(0,35,68,.6)] transition-transform duration-300 group-hover:-translate-y-1" style={{ backgroundImage: bg }}>
      {person.img ? (
        <img src={person.img} alt={person.name} loading="lazy" className={`${dims} rounded-full border-[3px] border-white object-cover`} />
      ) : (
        <span className={`${dims} flex items-center justify-center rounded-full border-[3px] border-white bg-[#EAF0F6] text-lg font-black`} style={{ color: GREEN }}>
          {nameOf(person).split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Governance matrix — General Body → Managing Committee → President →
// Office Bearers → Executive Committee Members, joined by thin connectors
// with arrowheads. Nodes carry the post and a raised round photograph.
// ---------------------------------------------------------------------------

function Arrow({ color = LINE, className = "" }) {
  return (
    <span className={`absolute left-1/2 -translate-x-1/2 ${className}`} style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `8px solid ${color}` }} aria-hidden="true" />
  );
}

function DownLink({ className = "h-8" }) {
  return (
    <div className={`relative mx-auto w-[2px] ${className}`} style={{ backgroundColor: LINE }} aria-hidden="true">
      <Arrow className="top-[calc(100%-8px)]" />
    </div>
  );
}

function TierRow({ items, render }) {
  const n = items.length;
  const center = (i) => `${((i + 0.5) / n) * 100}%`;
  return (
    <div className="relative">
      <span className="absolute top-0 h-[2px]" style={{ left: center(0), right: `calc(100% - ${center(n - 1)})`, backgroundColor: LINE }} aria-hidden="true" />
      <div className="flex items-stretch">
        {items.map((person, i) => (
          <div key={person.name} className="group relative flex-1 px-2 pt-9">
            <span className="absolute left-1/2 top-0 h-9 w-[2px] -translate-x-1/2" style={{ backgroundColor: LINE }} aria-hidden="true" />
            <Arrow className="top-[28px]" />
            {render(person, i)}
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneralBodyBox() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border-2 bg-[#002344] px-6 py-6 text-center text-white shadow-[0_22px_44px_-30px_rgba(0,35,68,.9)]" style={{ borderColor: GOLD }}>
      <span className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 20% 0%, rgba(214,181,109,.18), transparent 55%)" }} aria-hidden="true" />
      <h3 className="font-serif relative text-xl font-bold tracking-wide md:text-2xl">General Body</h3>
      <p className="font-hindi relative mt-1 text-sm font-semibold" style={{ color: GOLD }}>साधारण सभा</p>
      <p className="relative mt-2 text-xs text-[#E6EDF3]">Supreme General Body of the Foundation</p>
    </div>
  );
}

function CommitteeBox() {
  return (
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-2xl border bg-[#174B3A] px-6 py-5 text-center text-white shadow-[0_22px_44px_-30px_rgba(23,75,58,.9)]" style={{ borderColor: "#2D6A4F" }}>
      <span className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 80% 0%, rgba(214,181,109,.16), transparent 55%)" }} aria-hidden="true" />
      <h3 className="font-serif relative text-lg font-bold md:text-xl">Managing Committee</h3>
      <p className="font-hindi relative mt-1 text-sm font-semibold" style={{ color: GOLD }}>प्रबंधकारिणी समिति</p>
    </div>
  );
}

function MatrixNode({ person, size = "md", ring, badge }) {
  const Icon = POST_ICON[person.designation] || Users;
  const hindi = HINDI_POST[person.designation];
  return (
    <div className="flex h-full flex-col items-center text-center">
      <RaisedAvatar person={person} size={size} ring={ring} />
      <span className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border" style={{ borderColor: "#E3E9F0", backgroundColor: "#F8FAFB" }}>
        <Icon size={15} color={GREEN} aria-hidden="true" />
      </span>
      <p className="mt-2 text-sm font-bold" style={{ color: NAVY }}>{displayPost(person.designation)}</p>
      {hindi && <p className="font-hindi mt-0.5 text-xs font-semibold" style={{ color: GREEN }}>{hindi}</p>}
      {badge && <p className="mt-1 text-[10px] font-bold uppercase tracking-[.18em]" style={{ color: GOLD_DARK }}>{badge}</p>}
    </div>
  );
}

function GovernanceMatrix() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#E3E9F0] bg-white p-5 shadow-[0_40px_90px_-60px_rgba(0,35,68,.6)] sm:p-8 md:p-12">
      <span className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 50% 0%, rgba(0,35,68,.05), transparent 60%), radial-gradient(circle at 100% 100%, rgba(23,75,58,.05), transparent 55%)" }} aria-hidden="true" />
      <div className="relative mb-9 text-center">
        <p className="text-[11px] font-black uppercase tracking-[.24em]" style={{ color: GREEN }}>Governance Structure</p>
        <h3 className="font-serif mt-2 text-2xl font-bold md:text-3xl" style={{ color: NAVY }}>संगठनात्मक संरचना</h3>
        <Ornament className="mt-4" />
      </div>

      {/* Desktop / tablet */}
      <div className="relative hidden sm:block">
        <GeneralBodyBox />
        <DownLink className="h-9" />
        <CommitteeBox />
        <DownLink className="h-9" />
        <div className="flex justify-center">
          <MatrixNode person={president} size="lg" ring={`linear-gradient(150deg, ${GOLD_DARK}, ${GOLD})`} badge="Presiding" />
        </div>
        <DownLink className="h-9" />
        <TierRow items={bearers} render={(p) => <MatrixNode person={p} />} />
        <DownLink className="h-9" />
        <TierRow items={executives} render={(p) => <MatrixNode person={p} size="sm" />} />
      </div>

      {/* Mobile */}
      <div className="relative sm:hidden">
        <GeneralBodyBox />
        <DownLink className="h-7" />
        <CommitteeBox />
        <DownLink className="h-7" />
        <div className="flex justify-center">
          <MatrixNode person={president} size="lg" ring={`linear-gradient(150deg, ${GOLD_DARK}, ${GOLD})`} badge="Presiding" />
        </div>
        <DownLink className="h-7" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-7">
          {bearers.map((p) => (
            <div key={p.name} className="group flex flex-col items-center border-t-2 pt-6" style={{ borderColor: LINE }}>
              <MatrixNode person={p} />
            </div>
          ))}
        </div>
        <DownLink className="h-7" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-7">
          {executives.map((p) => (
            <div key={p.name} className="group flex flex-col items-center border-t-2 pt-6" style={{ borderColor: LINE }}>
              <MatrixNode person={p} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Member photo cards
// ---------------------------------------------------------------------------

function MemberCard({ person, index = 0, prominent = false }) {
  const hindi = HINDI_POST[person.designation];
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-white p-6 text-center shadow-[0_24px_50px_-40px_rgba(0,35,68,.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_60px_-38px_rgba(0,35,68,.6)] ${prominent ? "border-2" : "border-[#D9E0E7]"}`}
      style={prominent ? { borderColor: NAVY } : undefined}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1" style={{ background: prominent ? `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD})` : `linear-gradient(90deg, ${GREEN}, ${GOLD})` }} aria-hidden="true" />
      <RaisedAvatar person={person} size={prominent ? "lg" : "md"} ring={prominent ? `linear-gradient(150deg, ${GOLD_DARK}, ${GOLD})` : undefined} />
      <h3 className="mt-4 text-base font-extrabold" style={{ color: NAVY }}>{nameOf(person)}</h3>
      {prominent ? (
        <>
          <p className="font-hindi mt-1 text-sm font-semibold" style={{ color: GREEN }}>संस्थापक एवं अध्यक्ष</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[.16em]" style={{ color: GOLD_DARK }}>Founder &amp; President</p>
          <span className="mt-3 h-px w-16" style={{ backgroundColor: "#E3E9F0" }} aria-hidden="true" />
          <p className="mt-3 text-sm leading-6 text-slate-600">{PRESIDENT_INTRO}</p>
        </>
      ) : (
        <>
          <p className="mt-1 text-xs font-bold" style={{ color: GREEN }}>{person.designation}</p>
          {hindi && <p className="font-hindi text-[11px] font-semibold" style={{ color: GREEN }}>{hindi}</p>}
          <p className="mt-2 text-[11px] text-slate-500">{person.location}</p>
        </>
      )}
    </motion.article>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-10">
      <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[.2em]" style={{ color: GREEN }}>
        <span className="h-px w-8" style={{ backgroundColor: GOLD }} aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="font-serif mt-3 text-3xl font-bold md:text-4xl" style={{ color: NAVY }}>{title}</h2>
      {subtitle && <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{subtitle}</p>}
    </div>
  );
}

export default function Team() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <section className="relative isolate overflow-hidden bg-[#002344] px-5 pb-24 pt-36 text-white md:pb-28 md:pt-40">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: GRAIN }} aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} aria-hidden="true" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[.3em]" style={{ color: GOLD }}>
            <span className="hidden h-px w-10 sm:block" style={{ backgroundColor: GOLD }} aria-hidden="true" />
            Swastik Srijan Foundation
            <span className="hidden h-px w-10 sm:block" style={{ backgroundColor: GOLD }} aria-hidden="true" />
          </p>
          <h1 className="font-serif mt-4 text-4xl font-bold leading-tight md:text-6xl">Our Team</h1>
          <Ornament className="mt-5" />
          <p className="mt-5 text-lg font-semibold md:text-xl" style={{ color: GOLD }}>Governance, Leadership &amp; Collective Responsibility</p>
          <p className="font-hindi mt-1 text-base font-semibold text-[#E6EDF3]">हमारी टीम – नेतृत्व, सुशासन एवं सामूहिक उत्तरदायित्व</p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-[#E6EDF3]">The strength of our foundation lies in collective leadership, responsible governance and dedicated teamwork.</p>
          <p className="font-hindi mx-auto mt-1 max-w-2xl text-sm leading-6 text-[#E6EDF3]">हमारी संस्था की शक्ति सामूहिक नेतृत्व, जिम्मेदार प्रशासन और समर्पित टीमवर्क में निहित है।</p>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <GovernanceMatrix />
        </div>
      </section>

      <section className="bg-[#F8FAFB] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Office Bearers" title="प्रबंधकारिणी समिति के पदाधिकारी" subtitle="The office bearers who currently hold responsibility for the Foundation’s governance, finance and compliance." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MemberCard person={president} prominent />
            {bearers.map((person, index) => <MemberCard key={person.name} person={person} index={index} />)}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Executive Committee Members" title="कार्यकारिणी सदस्य" subtitle="Members of the Managing Committee who contribute to the Foundation’s governance and institutional work." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {executives.map((person, index) => <MemberCard key={person.name} person={person} index={index} />)}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFB] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Advisory Council" title="सलाहकार परिषद्" subtitle="Experienced professionals providing strategic, legal and institutional guidance to the Foundation." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{advisory.map((person, index) => <MemberCard key={person.name} person={person} index={index} />)}</div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Volunteer & Professional Network" title="स्वयंसेवक एवं प्रोफेशनल नेटवर्क" subtitle="People contributing specialist knowledge, counselling, technology and volunteer support. Participation and assignments are based on mutual understanding and current programme needs." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{volunteers.map((person, index) => <MemberCard key={person.name} person={person} index={index} />)}</div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#002344] px-5 py-20 text-white sm:px-8">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: GRAIN }} aria-hidden="true" />
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">Join Our Mission</h2>
          <Ornament className="mt-5" />
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#E6EDF3] md:text-base">Contribute your time, skills or resources to meaningful community initiatives.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/Volunteer" className="inline-flex items-center gap-2 rounded-full bg-[#174B3A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1d5a46]">Volunteer <FaArrowRight /></Link>
            <Link to="/PartnerWithUs" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:border-white/60">Partner With Us</Link>
            <Link to="/Donate" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition hover:brightness-105" style={{ backgroundColor: GOLD, color: NAVY }}>Support SSF</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
