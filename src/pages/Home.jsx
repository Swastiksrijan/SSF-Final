import { Link } from "@tanstack/react-router";
import {
  FaArrowRight,
  FaBookOpen,
  FaDonate,
  FaHandsHelping,
  FaHeartbeat,
  FaQuoteLeft,
  FaUsers,
  FaShieldAlt,
  FaFileAlt,
} from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import { CONTACT_INFO } from "../config/contact";

const impactStats = [
  { value: "20,000+", label: "Lives Impacted", icon: <FaUsers className="text-[#FF6600]" /> },
  { value: "100+", label: "Villages Reached", icon: <FaHandsHelping className="text-[#FF6600]" /> },
  { value: "40+", label: "Active Programs", icon: <FaBookOpen className="text-[#FF6600]" /> },
  { value: "12+", label: "Years of Service", icon: <FaHeartbeat className="text-[#FF6600]" /> },
];

const projects = [
  {
    title: "Rural Education Support",
    desc: "Learning sessions, study material distribution, and mentoring for children in underserved communities.",
    image: "/images/rural-education.jpg",
    alt: "Children studying in rural education support classroom",
  },
  {
    title: "Health & Hygiene Outreach",
    desc: "Periodic camps, awareness drives, and direct support for preventive health and wellbeing.",
    image: "/images/health-program-masks.jpg",
    alt: "Health outreach session with masks and awareness material",
  },
  {
    title: "Livelihood & Skill Development",
    desc: "Skill-building and youth-focused programs to improve employability and local income opportunities.",
    image: "/images/ssf-youth-career.png",
    alt: "Youth participating in livelihood and skill development training",
  },
];

const galleryItems = [
  { src: "/images/community-team-group.jpg", alt: "Community team group at Swastik Srijan event" },
  { src: "/images/tree-planting-2.jpg", alt: "Volunteers and children during tree plantation drive" },
  { src: "/images/classroom-mat-session.jpg", alt: "Children participating in classroom mat learning session" },
  { src: "/images/children-unity-park.jpg", alt: "Children together in outdoor park activity" },
];

const testimonials = [
  {
    quote: "The education support from SSF helped my daughter continue school with confidence.",
    author: "Parent, Rewa",
  },
  {
    quote: "As a volunteer, I saw real grassroots impact and transparent execution of every activity.",
    author: "Volunteer, Pune",
  },
];

export default function Home() {
  return (
    <main className="w-full bg-white text-zinc-800">
      <section className="relative min-h-[78vh] pt-24 pb-16 flex items-center bg-[#001529]">
        <div className="absolute inset-0">
          <OptimizedImage
            src="/images/hero-main.jpg"
            alt="Swastik Srijan Foundation team with community members"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001529]/95 via-[#001529]/75 to-[#001529]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl space-y-6">
            <p className="text-[#FFB066] text-xs sm:text-sm tracking-[0.2em] uppercase font-bold">Since 2013 • Registered NGO</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Building Dignified Lives Through Education, Health & Livelihood
            </h1>
            <p className="text-zinc-200 text-base sm:text-lg leading-relaxed">
              Swastik Srijan Foundation works with rural and underserved communities to deliver practical, measurable, and transparent social impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/Donate" className="inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-full bg-[#FF6600] text-white font-semibold hover:bg-[#e45b00] transition-colors">
                Donate Now <FaDonate />
              </Link>
              <Link to="/Volunteer" className="inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-full border border-white/70 text-white font-semibold hover:bg-white hover:text-[#001529] transition-colors">
                Volunteer With Us <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-zinc-50 border-y border-zinc-100" aria-labelledby="mission-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <article>
            <h2 id="mission-title" className="text-3xl sm:text-4xl font-bold text-[#002344]">Our Mission</h2>
            <p className="mt-4 text-zinc-600 leading-relaxed">
              To bridge inequality by enabling access to education, healthcare, skilling, and emergency support for vulnerable communities.
            </p>
          </article>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Education", icon: <FaBookOpen />, text: "Learning support, mentorship, and school continuity for children." },
              { title: "Health", icon: <FaHeartbeat />, text: "Awareness drives and direct health support in communities." },
              { title: "Livelihood", icon: <FaHandsHelping />, text: "Skill development and youth empowerment opportunities." },
              { title: "Relief", icon: <FaUsers />, text: "Quick response for disaster and urgent humanitarian needs." },
            ].map((item) => (
              <article key={item.title} className="bg-white p-5 rounded-2xl border border-zinc-100">
                <div className="text-[#FF6600] text-2xl">{item.icon}</div>
                <h3 className="mt-3 font-bold text-[#002344]">{item.title}</h3>
                <p className="text-sm text-zinc-600 mt-1">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" aria-labelledby="impact-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="impact-title" className="text-3xl sm:text-4xl font-bold text-[#002344] text-center">Impact Numbers</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {impactStats.map((item) => (
              <article key={item.label} className="bg-white border border-zinc-100 rounded-2xl p-5 text-center shadow-sm">
                <div className="text-2xl flex justify-center">{item.icon}</div>
                <p className="text-2xl sm:text-3xl font-bold text-[#002344] mt-3">{item.value}</p>
                <p className="text-sm text-zinc-600 mt-1">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-zinc-50" aria-labelledby="projects-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="projects-title" className="text-3xl sm:text-4xl font-bold text-[#002344]">Projects</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {projects.map((project) => (
              <article key={project.title} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                <OptimizedImage src={project.image} alt={project.alt} className="w-full h-52" />
                <div className="p-5">
                  <h3 className="font-bold text-[#002344] text-lg">{project.title}</h3>
                  <p className="text-sm text-zinc-600 mt-2">{project.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" aria-labelledby="gallery-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 id="gallery-title" className="text-3xl sm:text-4xl font-bold text-[#002344]">Gallery</h2>
            <Link to="/Media" className="text-[#FF6600] font-semibold inline-flex items-center gap-2">View all <FaArrowRight /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {galleryItems.map((item) => (
              <figure key={item.src} className="rounded-xl overflow-hidden border border-zinc-100">
                <OptimizedImage src={item.src} alt={item.alt} className="w-full h-40 sm:h-48" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-zinc-50" aria-labelledby="testimonials-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="testimonials-title" className="text-3xl sm:text-4xl font-bold text-[#002344]">Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {testimonials.map((item) => (
              <article key={item.author} className="bg-white rounded-2xl border border-zinc-100 p-6">
                <FaQuoteLeft className="text-[#FF6600]" />
                <p className="mt-3 text-zinc-700">{item.quote}</p>
                <p className="mt-4 text-sm font-semibold text-[#002344]">— {item.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" aria-labelledby="trust-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 id="trust-title" className="text-3xl sm:text-4xl font-bold text-[#002344]">Trust & Transparency</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <article className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h3 className="font-bold text-[#002344] flex items-center gap-2"><FaShieldAlt className="text-[#FF6600]" /> Registration Certificate</h3>
              <p className="text-zinc-600 mt-2 text-sm">Reg. No. 05/22/03/11448/13 under MP Societies Registration Act, 1973.</p>
              <Link to="/RegistrationDetails" className="inline-flex items-center gap-2 text-[#FF6600] font-semibold mt-4">View registration details <FaArrowRight /></Link>
            </article>
            <article className="bg-white border border-zinc-100 rounded-2xl p-6">
              <h3 className="font-bold text-[#002344] flex items-center gap-2"><FaFileAlt className="text-[#FF6600]" /> Reports & Transparency</h3>
              <p className="text-zinc-600 mt-2 text-sm">Read our transparency page and key compliance documents for public accountability.</p>
              <Link to="/Transparency" className="inline-flex items-center gap-2 text-[#FF6600] font-semibold mt-4">Open transparency page <FaArrowRight /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#002344] text-white" aria-labelledby="cta-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 id="cta-title" className="text-3xl sm:text-4xl font-bold">Donate or Volunteer Today</h2>
          <p className="text-zinc-200 mt-3 max-w-2xl mx-auto">Your contribution helps us reach more children, youth, and families with quality support programs.</p>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/Donate" className="px-7 py-3 rounded-full bg-[#FF6600] font-semibold hover:bg-[#e45b00] transition-colors">Donate</Link>
            <Link to="/Volunteer" className="px-7 py-3 rounded-full border border-white/70 font-semibold hover:bg-white hover:text-[#002344] transition-colors">Volunteer</Link>
            <a href={`mailto:${CONTACT_INFO.primaryEmail}`} className="px-7 py-3 rounded-full border border-white/70 font-semibold hover:bg-white hover:text-[#002344] transition-colors">Contact Us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
