import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";

const founder = {
  name: "Ramesh Pandey",
  designation: "Founder",
  location: "Rewa, Madhya Pradesh",
  img: "/Teams_Images/ramesh_pandey.jpg?v=3",
};

const volunteers = [
  { name: "Mr. Rajeev Pandey", designation: "Advisor & Volunteer", location: "Madhya Pradesh", img: "/Teams_Images/rajeev_pandey.jpg" },
  { name: "Ms. A. Gincy George", designation: "Counselling Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/image_1.jpg" },
  { name: "Mr. Krishna Kumar", designation: "Volunteer & Advisor", location: "Hyderabad, Telangana", img: "/Teams_Images/krishna_kumar.jpg" },
  { name: "Ms. Sneha Ravishankar Pandey", designation: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/sneha_ravishankar_pandey.jpg" },
  { name: "Ms. Vaishnavi Manik Chaudhari", designation: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/vaishnavi_manik_chaudhari.jpg" },
];

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
          <div><p className="text-xs font-black uppercase tracking-[.22em] text-[#F7C45B]">People • Service • Community</p><h1 className="mt-5 text-4xl font-black md:text-6xl">People Behind the Mission</h1><p className="mt-3 text-xl font-semibold text-white/85">मिशन से जुड़े लोग</p><p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 md:text-base">Meet the Founder and the volunteers who contribute their time, skills and experience to community-focused work.</p></div>
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl"><img src={founder.img} alt="Ramesh Pandey, Founder" className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" /><div className="px-3 py-4"><p className="text-lg font-extrabold">Ramesh Pandey</p><p className="mt-1 text-sm font-semibold text-[#F7C45B]">Founder</p></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <SectionHeading eyebrow="Founder" title="संस्थापक" subtitle="The Foundation’s journey began in Rewa in December 2013 with a commitment to community service and inclusive development." />
        <div className="grid max-w-sm gap-6"><PersonCard person={founder} /></div>
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
