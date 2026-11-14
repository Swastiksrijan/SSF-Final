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

function RaisedAvatar({ person, size = "md", ring }) {
  const dims = size === "lg" ? "h-24 w-24 sm:h-28 sm:w-28" : size === "sm" ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24";
  const bg = ring || `linear-gradient(150deg, ${GOLD}, ${GREEN})`;
  return (
    <div className="rounded-full p-[3px] shadow-[0_18px_30px_-10px_rgba(0,35,68,.55)]" style={{ backgroundImage: bg }}>
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

function TierRow({ items, render }) {
  const n = items.length;
  const center = (i) => `${((i + 0.5) / n) * 100}%`;
  return (
    <div className="relative">
      <span className="absolute top-0 h-[2px]" style={{ left: center(0), right: `calc(100% - ${center(n - 1)})`, backgroundColor: LINE }} aria-hidden="true" />
      <div className="flex items-stretch">
        {items.map((person, i) => (
          <div key={person.name} className="relative flex-1 px-2 pt-9">
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
    <div className="mx-auto max-w-2xl rounded-2xl border-2 bg-[#002344] px-6 py-6 text-center text-white" style={{ borderColor: GOLD }}>
      <h3 className="font-serif text-xl font-bold tracking-wide md:text-2xl">General Body</h3>
      <p className="font-hindi mt-1 text-sm font-semibold" style={{ color: GOLD }}>साधारण सभा</p>
      <p className="mt-2 text-xs text-[#E6EDF3]">Supreme General Body of the Foundation</p>
    </div>
  );
}

function CommitteeBox() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-[#174B3A] px-6 py-5 text-center text-white" style={{ borderColor: "#2D6A4F" }}>
      <h3 className="font-serif text-lg font-bold md:text-xl">Managing Committee</h3>
      <p className="font-hindi mt-1 text-sm font-semibold" style={{ color: GOLD }}>प्रबंधकारिणी समिति</p>
    </div>
  );
}

function MatrixNode({ person, size = "md", ring }) {
  const Icon = POST_ICON[person.designation] || Users;
  const hindi = HINDI_POST[person.designation];
  return (
    <div className="flex h-full flex-col items-center text-center">
      <RaisedAvatar person={person} size={size} ring={ring} />
      <Icon className="mt-3" size={16} color={GREEN} aria-hidden="true" />
      <p className="mt-1 text-sm font-bold" style={{ color: NAVY }}>{person.designation === "Member" ? "Executive Member" : person.designation}</p>
      {hindi && <p className="font-hindi mt-0.5 text-xs font-semibold" style={{ color: GREEN }}>{hindi}</p>}
    </div>
  );
}

function GovernanceMatrix() {
  return (
    <div className="rounded-[2rem] border border-[#E3E9F0] bg-white p-5 shadow-[0_30px_70px_-50px_rgba(0,35,68,.5)] sm:p-8 md:p-10">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-black uppercase tracking-[.22em]" style={{ color: GREEN }}>Governance Structure</p>
        <h3 className="font-serif mt-2 text-2xl font-bold md:text-3xl" style={{ color: NAVY }}>संगठनात्मक संरचना</h3>
      </div>

      {/* Desktop / tablet */}
      <div className="hidden sm:block">
        <GeneralBodyBox />
        <DownLink className="h-9" />
        <CommitteeBox />
        <DownLink className="h-9" />
        <div className="flex justify-center"><MatrixNode person={president} size="lg" ring={`linear-gradient(150deg, ${GOLD_DARK}, ${GOLD})`} /></div>
        <DownLink className="h-9" />
        <TierRow items={bearers} render={(p) => <MatrixNode person={p} />} />
        <DownLink className="h-9" />
        <TierRow items={executives} render={(p) => <MatrixNode person={p} size="sm" />} />
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <GeneralBodyBox />
        <DownLink className="h-7" />
        <CommitteeBox />
        <DownLink className="h-7" />
        <div className="flex justify-center"><MatrixNode person={president} size="lg" ring={`linear-gradient(150deg, ${GOLD_DARK}, ${GOLD})`} /></div>
        <DownLink className="h-7" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-7">
          {bearers.map((p) => (
            <div key={p.name} className="flex flex-col items-center border-t-2 pt-6" style={{ borderColor: LINE }}>
              <MatrixNode person={p} />
            </div>
          ))}
        </div>
        <DownLink className="h-7" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-7">
          {executives.map((p) => (
            <div key={p.name} className="flex flex-col items-center border-t-2 pt-6" style={{ borderColor: LINE }}>
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
      className={`flex flex-col items-center rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${prominent ? "border-2" : ""}`}
      style={{ borderColor: prominent ? NAVY : "#D9E0E7" }}
    >
      <RaisedAvatar person={person} size={prominent ? "lg" : "md"} ring={prominent ? `linear-gradient(150deg, ${GOLD_DARK}, ${GOLD})` : undefined} />
      <h3 className="mt-4 text-base font-extrabold" style={{ color: NAVY }}>{nameOf(person)}</h3>
      {prominent ? (
        <>
          <p className="font-hindi mt-1 text-sm font-semibold" style={{ color: GREEN }}>संस्थापक एवं अध्यक्ष</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide" style={{ color: GREEN }}>Founder &amp; President</p>
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
    <div className="mb-9">
      <p className="text-xs font-black uppercase tracking-[.2em]" style={{ color: GREEN }}>{eyebrow}</p>
      <h2 className="font-serif mt-3 text-3xl font-bold md:text-4xl" style={{ color: NAVY }}>{title}</h2>
      {subtitle && <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{subtitle}</p>}
    </div>
  );
}

export default function Team() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <section className="relative isolate overflow-hidden bg-[#002344] px-5 pb-24 pt-36 text-white md:pb-28 md:pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-black uppercase tracking-[.28em]" style={{ color: GOLD }}>Swastik Srijan Foundation</p>
          <h1 className="font-serif mt-3 text-4xl font-bold md:text-6xl">Our Team</h1>
          <p className="mt-3 text-lg font-semibold md:text-xl" style={{ color: GOLD }}>Governance, Leadership &amp; Collective Responsibility</p>
          <p className="font-hindi mt-1 text-base font-semibold text-[#E6EDF3]">हमारी टीम – नेतृत्व, सुशासन एवं सामूहिक उत्तरदायित्व</p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#E6EDF3]">The strength of our foundation lies in collective leadership, responsible governance and dedicated teamwork.</p>
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

      <section className="bg-[#002344] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">Join Our Mission</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#E6EDF3] md:text-base">Contribute your time, skills or resources to meaningful community initiatives.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/Volunteer" className="inline-flex items-center gap-2 rounded-full bg-[#174B3A] px-6 py-3 text-sm font-bold text-white">Volunteer <FaArrowRight /></Link>
            <Link to="/PartnerWithUs" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white">Partner With Us</Link>
            <Link to="/Donate" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold" style={{ backgroundColor: GOLD, color: NAVY }}>Support SSF</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
