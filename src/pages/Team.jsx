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

const TERM_LABEL = "2025–2028";

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

const GOVERNANCE = [
  { label: "Managing Committee Tenure", hindi: "कार्यकाल", value: "3 Years · 3 वर्ष" },
  { label: "Extension", hindi: "विस्तार", value: "Maximum 6 months, with General Body approval · साधारण सभा की स्वीकृति से अधिकतम 6 माह" },
  { label: "General Body Quorum", hindi: "साधारण सभा का कोरम", value: "3 / 5" },
  { label: "Managing Committee Quorum", hindi: "प्रबंधकारिणी समिति का कोरम", value: "1 / 2" },
];

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

const nameOf = (p) => p.name.replace(/^(Mr\.|Ms\.|Mrs\.)\s*/, "");
const isMember = (m) => /member/i.test(m.designation);
const isPresident = (m) => /president/i.test(m.designation) && !/vice/i.test(m.designation);

const president = committee.find(isPresident) || committee[0];
const bearers = committee.filter((m) => !isPresident(m) && !isMember(m));
const executives = committee.filter(isMember);
const pad2 = (n) => String(n).padStart(2, "0");

// ---------------------------------------------------------------------------
// Governance matrix — General Body → Managing Committee → President →
// Office Bearers → Executive Committee Members, joined by thin connectors.
// ---------------------------------------------------------------------------

function VLine({ className = "h-8" }) {
  return <div className={`mx-auto w-[2px] ${className}`} style={{ backgroundColor: LINE }} aria-hidden="true" />;
}

function TierRow({ items, render }) {
  const n = items.length;
  const center = (i) => `${((i + 0.5) / n) * 100}%`;
  return (
    <div className="relative">
      <span className="absolute top-0 h-[2px]" style={{ left: center(0), right: `calc(100% - ${center(n - 1)})`, backgroundColor: LINE }} aria-hidden="true" />
      <div className="flex items-stretch">
        {items.map((person, i) => (
          <div key={person.name} className="relative flex-1 px-2 pt-8">
            <span className="absolute left-1/2 top-0 h-8 w-[2px] -translate-x-1/2" style={{ backgroundColor: LINE }} aria-hidden="true" />
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

function CommitteeBox({ count }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border bg-[#174B3A] px-6 py-5 text-center text-white" style={{ borderColor: "#2D6A4F" }}>
      <h3 className="font-serif text-lg font-bold md:text-xl">Managing Committee</h3>
      <p className="font-hindi mt-1 text-sm font-semibold" style={{ color: GOLD }}>प्रबंधकारिणी समिति</p>
      <span className="mt-3 inline-block rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide" style={{ borderColor: GOLD, color: GOLD }}>
        TOTAL {pad2(count)} MEMBERS · कुल {pad2(count)} सदस्य
      </span>
    </div>
  );
}

function PresidentBox({ person }) {
  return (
    <div className="mx-auto max-w-xs rounded-2xl border-2 bg-white px-6 py-5 text-center shadow-sm" style={{ borderColor: GOLD_DARK }}>
      <Crown className="mx-auto" size={20} color={GOLD_DARK} aria-hidden="true" />
      <h3 className="font-serif mt-2 text-lg font-bold" style={{ color: NAVY }}>President</h3>
      <p className="font-hindi mt-0.5 text-sm font-semibold" style={{ color: GREEN }}>अध्यक्ष</p>
      <p className="mt-2 text-xs text-slate-500">{nameOf(person)}</p>
    </div>
  );
}

function BearerBox({ person }) {
  const Icon = POST_ICON[person.designation] || Users;
  return (
    <div className="flex h-full flex-col items-center rounded-xl border border-[#D9E0E7] border-t-4 bg-white px-4 py-5 text-center shadow-sm transition hover:shadow-md" style={{ borderTopColor: GREEN }}>
      <Icon size={18} color={GREEN} aria-hidden="true" />
      <h4 className="mt-2 text-sm font-bold" style={{ color: NAVY }}>{person.designation}</h4>
      <p className="font-hindi mt-0.5 text-xs font-semibold" style={{ color: GREEN }}>{HINDI_POST[person.designation]}</p>
    </div>
  );
}

function ExecBox({ person, index }) {
  return (
    <div className="flex h-full flex-col items-center rounded-xl border bg-[#F1F6F3] px-4 py-5 text-center transition hover:shadow-md" style={{ borderColor: "#D7E4DB" }}>
      <span className="text-sm font-black" style={{ color: GREEN }}>EXECUTIVE MEMBER – {pad2(index + 1)}</span>
      <p className="mt-1 text-xs font-bold" style={{ color: NAVY }}>{nameOf(person)}</p>
      <p className="font-hindi mt-0.5 text-[11px] font-semibold" style={{ color: GREEN }}>कार्यकारिणी सदस्य</p>
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
        <VLine className="h-8" />
        <CommitteeBox count={committee.length} />
        <VLine className="h-8" />
        <PresidentBox person={president} />
        <VLine className="h-8" />
        <TierRow items={bearers} render={(p) => <BearerBox person={p} />} />
        <VLine className="h-8" />
        <TierRow items={executives} render={(p, i) => <ExecBox person={p} index={i} />} />
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <GeneralBodyBox />
        <VLine className="h-6" />
        <CommitteeBox count={committee.length} />
        <VLine className="h-6" />
        <PresidentBox person={president} />
        <VLine className="h-6" />
        <div className="grid grid-cols-2 gap-3">{bearers.map((p) => <BearerBox key={p.name} person={p} />)}</div>
        <VLine className="h-6" />
        <div className="grid grid-cols-2 gap-3">{executives.map((p, i) => <ExecBox key={p.name} person={p} index={i} />)}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Member photo cards
// ---------------------------------------------------------------------------

function Photo({ person, className }) {
  if (person.img) {
    return <img src={person.img} alt={person.name} loading="lazy" className={`h-full w-full object-cover ${className || ""}`} />;
  }
  return (
    <div className={`flex h-full w-full items-center justify-center text-2xl font-black ${className || ""}`} style={{ backgroundColor: "#EAF0F6", color: GREEN }}>
      {nameOf(person).split(" ").map((w) => w[0]).slice(0, 2).join("")}
    </div>
  );
}

function PresidentCard({ person }) {
  return (
    <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="overflow-hidden rounded-2xl border-2 bg-white shadow-sm lg:col-span-2" style={{ borderColor: NAVY }}>
      <div className="grid sm:grid-cols-[minmax(0,14rem)_1fr]">
        <div className="aspect-square overflow-hidden bg-[#EAF0F6]"><Photo person={person} /></div>
        <div className="p-6">
          <span className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide" style={{ backgroundColor: "#FBF3E2", color: GOLD_DARK }}>President</span>
          <h3 className="font-serif mt-3 text-2xl font-bold" style={{ color: NAVY }}>{person.name}</h3>
          <p className="font-hindi mt-1 text-sm font-semibold" style={{ color: GREEN }}>संस्थापक एवं अध्यक्ष</p>
          <p className="mt-1 text-xs text-slate-500">Founder &amp; President · कार्यकाल {TERM_LABEL}</p>
          <p className="mt-4 border-t border-[#EAF0F6] pt-4 text-sm leading-7 text-slate-600">{PRESIDENT_INTRO}</p>
        </div>
      </div>
    </motion.article>
  );
}

function MemberCard({ person, index = 0, tone = "default" }) {
  const mint = tone === "mint";
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: mint ? "#D7E4DB" : "#D9E0E7" }}
    >
      <div className="aspect-square overflow-hidden bg-[#EAF0F6]"><Photo person={person} /></div>
      <div className="p-5">
        <h3 className="text-base font-extrabold" style={{ color: NAVY }}>{nameOf(person)}</h3>
        <p className="mt-1 text-xs font-bold" style={{ color: GREEN }}>{person.designation}</p>
        <p className="font-hindi text-[11px] font-semibold" style={{ color: GREEN }}>{HINDI_POST[person.designation] || person.designation}</p>
        <p className="mt-3 border-t border-[#EAF0F6] pt-3 text-[11px] text-slate-500">कार्यकाल {TERM_LABEL} · {person.location}</p>
      </div>
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
      <section className="relative isolate overflow-hidden bg-[#002344] px-5 py-24 text-white md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-black uppercase tracking-[.28em]" style={{ color: GOLD }}>Swastik Srijan Foundation</p>
          <h1 className="font-serif mt-4 text-4xl font-bold md:text-6xl">Our Team</h1>
          <p className="mt-4 text-lg font-semibold md:text-xl" style={{ color: GOLD }}>Governance, Leadership &amp; Collective Responsibility</p>
          <p className="font-hindi mt-2 text-base font-semibold text-[#E6EDF3]">हमारी टीम – नेतृत्व, सुशासन एवं सामूहिक उत्तरदायित्व</p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#E6EDF3]">The strength of our foundation lies in collective leadership, responsible governance and dedicated teamwork.</p>
          <p className="font-hindi mx-auto mt-2 max-w-2xl text-sm leading-7 text-[#E6EDF3]">हमारी संस्था की शक्ति सामूहिक नेतृत्व, जिम्मेदार प्रशासन और समर्पित टीमवर्क में निहित है।</p>
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
            <PresidentCard person={president} />
            {bearers.map((person, index) => <MemberCard key={person.name} person={person} index={index} />)}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Executive Committee Members" title="कार्यकारिणी सदस्य" subtitle="Members of the Managing Committee who contribute to the Foundation’s governance and institutional work." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {executives.map((person, index) => <MemberCard key={person.name} person={person} index={index} tone="mint" />)}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFB] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Governance Information" title="सुशासन एवं नियमावली" subtitle="Key governance provisions, as recorded in the registered rules and applicable amendments." />
          <div className="grid gap-4 sm:grid-cols-2">
            {GOVERNANCE.map((row) => (
              <div key={row.label} className="rounded-2xl border border-[#D9E0E7] bg-white p-5 shadow-sm">
                <p className="text-sm font-bold" style={{ color: NAVY }}>{row.label}</p>
                <p className="font-hindi mt-0.5 text-xs font-semibold" style={{ color: GREEN }}>{row.hindi}</p>
                <p className="mt-2 text-sm text-slate-600">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Advisory Council" title="सलाहकार परिषद्" subtitle="Experienced professionals providing strategic, legal and institutional guidance to the Foundation." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{advisory.map((person, index) => <MemberCard key={person.name} person={person} index={index} />)}</div>
        </div>
      </section>

      <section className="bg-[#F8FAFB] px-5 py-16 sm:px-8 md:py-20">
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
