import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaGlobeAsia,
  FaHeart,
  FaHandshake,
  FaShieldAlt,
  FaUsers,
  FaBullseye,
  FaLeaf,
  FaRegCompass,
  FaQuoteLeft,
} from "react-icons/fa";
import OptimizedImage from "../components/OptimizedImage";
import footerImg1 from "../assets/footer-gallery-1.jpg";
import footerImg2 from "../assets/footer-gallery-2.jpg";
import footerImg3 from "../assets/footer-gallery-3.jpg";

const organizationFacts = [
  {
    icon: FaCalendarAlt,
    label: "Established",
    value: "December 2013",
    detail: "A journey of service and learning",
  },
  {
    icon: FaShieldAlt,
    label: "Registration",
    value: "05/22/03/11448/13",
    detail: "Madhya Pradesh Societies Act, 1973",
    compact: true,
  },
  {
    icon: FaGlobeAsia,
    label: "Area of Work",
    value: "Pan India",
    detail: "A vision for communities across India",
  },
  {
    icon: FaHeart,
    label: "Registered Office",
    value: "Rewa, M.P.",
    detail: "Madhya Pradesh, India",
  },
];

const quickLinks = [
  {
    to: "/Mission",
    eyebrow: "Our direction",
    title: "Mission & Vision",
    description: "The principles and values that guide our work.",
    action: "Discover our vision",
  },
  {
    to: "/Objectives",
    eyebrow: "Our priorities",
    title: "Our Objectives",
    description: "The focus areas that shape our community initiatives.",
    action: "Explore objectives",
  },
  {
    to: "/Team",
    eyebrow: "People behind the work",
    title: "Meet Our Team",
    description: "The leadership and volunteers working toward our purpose.",
    action: "Meet the team",
  },
];

const principles = [
  {
    icon: FaBullseye,
    number: "01",
    title: "Our Mission",
    description:
      "To contribute to inclusive community development through education, skills, health, awareness, participation and practical support.",
  },
  {
    icon: FaHandshake,
    number: "02",
    title: "Our Approach",
    description:
      "We encourage cooperation, learning, responsible awareness and partnerships that can create meaningful and sustainable outcomes.",
  },
  {
    icon: FaHeart,
    number: "03",
    title: "Our Values",
    description:
      "Transparency, dignity, equal opportunity, cooperation and service without discrimination guide our work.",
  },
];

const journey = [
  {
    years: "2013–2017",
    title: "Laying the foundation",
    description:
      "Building the foundation, community relationships and early social initiatives.",
  },
  {
    years: "2018–2024",
    title: "Learning through service",
    description:
      "Continuing social initiatives, learning activities and community-focused work.",
  },
  {
    years: "2025–2026",
    title: "Strengthening participation",
    description:
      "Developing digital outreach, awareness and opportunities for wider participation.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans text-[#26343D]">
      {/* Hero */}
      <section className="relative isolate min-h-[600px] overflow-hidden bg-[#071D34] text-white sm:min-h-[660px] lg:min-h-[740px]">
        <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1 sm:gap-2 sm:p-2 lg:gap-3 lg:p-3" aria-hidden="true">
          {[footerImg1, footerImg2, footerImg3].map((img, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg sm:rounded-2xl lg:rounded-[2rem] ${
                index === 1 ? "translate-y-4 sm:translate-y-6" : ""
              }`}
            >
              <img
                src={img}
                alt=""
                className="h-full w-full scale-[1.015] object-cover object-center opacity-100 [filter:brightness(1.12)_contrast(1.10)_saturate(1.10)] transition-transform duration-700"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        {/* Keep the photographs bright and readable; concentrate the text contrast on the left. */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,24,43,0.94)_0%,rgba(9,37,65,0.76)_32%,rgba(9,37,65,0.34)_52%,rgba(9,37,65,0.06)_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,29,52,0.20)_0%,transparent_32%)]" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#E6530E]/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#176447]/10 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl items-center px-5 py-20 sm:min-h-[660px] sm:px-8 lg:min-h-[740px] lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl xl:max-w-[48rem]"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#06182B]/35 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFE0A3] shadow-lg shadow-black/10 backdrop-blur-md sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#F7A814]" />
              Swastik Srijan Foundation
              <span className="text-white/55">/</span>
              स्थापना 2013
            </div>
            <h1 className="mt-8 max-w-4xl text-[2.65rem] font-black leading-[0.99] tracking-[-0.045em] text-white [text-shadow:0_3px_28px_rgba(0,0,0,0.48)] sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[6.1rem]">
              A purpose rooted in{" "}
              <span className="text-[#FFC56D]">humanity.</span>
              <span className="mt-2 block text-white/95">A future shaped together.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base font-semibold leading-8 text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.42)] sm:text-lg md:text-xl lg:text-[1.35rem] lg:leading-9">
              Empowering communities through education, health, awareness and
              sustainable development—with dignity, participation and care.
            </p>
            <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.42)] sm:text-lg">
              शिक्षा, स्वास्थ्य, जागरूकता और सतत विकास के माध्यम से समुदायों के
              साथ मिलकर सकारात्मक बदलाव की दिशा में प्रयास।
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/Mission"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#FFC247] to-[#F7A814] px-7 py-4 text-sm font-black text-[#092541] shadow-[0_16px_35px_-15px_rgba(0,0,0,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#F7A814]/45 sm:px-8"
              >
                Discover our purpose <FaArrowRight aria-hidden="true" />
              </Link>
              <Link
                to="/GetInvolved"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/55 bg-[#06182B]/25 px-7 py-4 text-sm font-extrabold text-white shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-[#092541] focus:outline-none focus:ring-4 focus:ring-white/35 sm:px-8"
              >
                Be part of the journey <FaHeart aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-bold tracking-wide text-white/90 sm:text-sm">
              <span className="inline-flex items-center gap-2"><FaShieldAlt className="text-[#FFC56D]" /> Registered society</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/45 sm:block" />
              <span className="inline-flex items-center gap-2"><FaGlobeAsia className="text-[#FFC56D]" /> Pan-India area of work</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      </section>

      {/* Organization facts */}
      <section className="relative z-20 -mt-5 px-4 sm:-mt-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_30px_90px_-40px_rgba(9,37,65,0.42)] ring-1 ring-[#12345A]/[0.04] sm:grid-cols-2 lg:grid-cols-4">
          {organizationFacts.map(({ icon: Icon, label, value, detail, compact }, index) => (
            <div
              key={label}
              className={`group flex items-start gap-4 px-5 py-6 sm:px-6 sm:py-7 lg:px-5 ${
                index > 0 ? "border-t border-[#E8EDF1] sm:border-t-0 lg:border-l" : ""
              } ${index === 2 ? "sm:border-l sm:border-[#E8EDF1] lg:border-l" : ""}`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFF3DE] to-[#FFE5B8] text-xl text-[#C74713] shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                <Icon aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#D94C13]">{label}</p>
                <p className={`mt-1 break-words font-black leading-tight tracking-tight text-[#12345A] ${compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl"}`}>
                  {value}
                </p>
                <p className="mt-2 text-xs leading-5 text-[#64727D] sm:text-sm">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Introduction */}
      <section className="px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.55 }}
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#D94C13] sm:text-sm">About SSF</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#12345A] sm:text-4xl lg:text-5xl">
              People first.{" "}
              <span className="text-[#176447]">Purpose always.</span>
            </h2>
            <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#E6530E] via-[#F7A814] to-[#176447]" />
            <p className="mt-6 text-lg leading-8 text-[#53616C]">
              Swastik Srijan Foundation is a registered non-profit organization
              based in Rewa, Madhya Pradesh. Established in December 2013, the
              Foundation works to contribute to community development through
              education, health, skills, awareness and sustainable initiatives.
            </p>
            <p className="mt-5 text-base leading-8 text-[#53616C]">
              दिसंबर 2013 में स्थापित स्वस्तिक सृजन फाउंडेशन मध्य प्रदेश के रीवा
              में स्थित एक पंजीकृत गैर-लाभकारी संस्था है। संस्था शिक्षा, स्वास्थ्य,
              कौशल, जागरूकता और सतत पहलों के माध्यम से समुदाय के विकास में योगदान
              देने का प्रयास करती है।
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map((item, index) => (
              <motion.div
                key={item.to}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={index === 0 ? "sm:col-span-2" : ""}
              >
                <Link
                  to={item.to}
                  className="group flex h-full min-h-[205px] flex-col rounded-3xl border border-[#E7EBEF] bg-gradient-to-br from-[#FBFAF7] to-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D9E3EA] hover:shadow-[0_24px_55px_-30px_rgba(9,37,65,0.45)] focus:outline-none focus:ring-4 focus:ring-[#12345A]/15 sm:p-7"
                >
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#D94C13]">{item.eyebrow}</span>
                  <h3 className="mt-3 text-xl font-extrabold text-[#12345A] sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-[#64727D]">{item.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold text-[#176447]">
                    {item.action}
                    <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder message */}
      <section className="relative overflow-hidden border-y border-[#E7EBEF] bg-[linear-gradient(135deg,#FBFAF6_0%,#F3F6F3_55%,#F8F4EC_100%)] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[50px] border-[#176447]/[0.04]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#D94C13] sm:text-sm">Leadership</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#12345A] sm:text-4xl lg:text-5xl">A message from our Founder</h2>
            <p className="mt-3 text-base text-[#64727D]">संस्थापक का संदेश</p>
          </div>
          <div className="grid overflow-hidden rounded-[2rem] border border-[#E5E8E5] bg-white shadow-[0_25px_80px_-45px_rgba(9,37,65,0.35)] lg:grid-cols-[340px_1fr]">
            <div className="relative flex flex-col items-center justify-center bg-[#0D2B49] px-7 py-10 text-center text-white sm:px-10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#12345A] via-[#0D2B49] to-[#176447]" aria-hidden="true" />
              <div className="relative w-full max-w-[230px] overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/10 p-2 shadow-2xl">
                <OptimizedImage
                  src="/Teams_Images/ramesh_pandey.jpg?v=2"
                  alt="Mr. Ramesh Pandey, Founder and President of Swastik Srijan Foundation"
                  className="block aspect-square w-full rounded-[1rem] object-cover"
                />
              </div>
              <h3 className="relative mt-6 text-2xl font-extrabold">Mr. Ramesh Pandey</h3>
              <p className="relative mt-2 text-sm font-bold text-[#FFC56D]">Founder & President</p>
              <div className="relative mt-5 h-px w-16 bg-white/30" />
              <p className="relative mt-4 text-xs font-semibold uppercase tracking-[0.17em] text-white/65">Swastik Srijan Foundation</p>
            </div>
            <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
              <FaQuoteLeft className="text-3xl text-[#F7A814]" aria-hidden="true" />
              <blockquote className="mt-5 space-y-5 text-base leading-8 text-[#53616C] sm:text-lg">
                <p>
                  “Social development becomes meaningful when people come together
                  with a spirit of cooperation, learning and responsibility.
                  Swastik Srijan Foundation was established with the belief that
                  every person deserves dignity, opportunity and a chance to contribute.”
                </p>
                <p>
                  Our journey is guided by education, skill development, awareness,
                  community participation and practical support. We seek to encourage
                  positive change through sincere service, transparency and meaningful
                  partnerships.
                </p>
                <p className="text-base">
                  हमारा प्रयास है कि सहयोग, कौशल, जागरूकता और सृजन के माध्यम से समाज
                  में सकारात्मक परिवर्तन को बढ़ावा दिया जाए। सेवा में पारदर्शिता,
                  सम्मान और समान अवसर हमारे लिए महत्वपूर्ण हैं।
                </p>
              </blockquote>
              <div className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-[#F4F8F5] px-4 py-3 text-xs font-bold leading-5 text-[#176447] sm:max-w-max">
                <FaShieldAlt className="shrink-0 text-xl" aria-hidden="true" />
                <span>Registered Society<br />पंजीकृत संस्था · Regn. No. 05/22/03/11448/13</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#D94C13] sm:text-sm">Our Journey</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#12345A] sm:text-4xl lg:text-5xl">A journey of service since 2013</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#64727D] sm:text-lg">
              From our establishment in December 2013 to continued community work
              and digital outreach, SSF has evolved through learning, participation
              and service.
            </p>
          </div>
          <div className="relative mt-12 grid gap-5 md:grid-cols-3">
            <div className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-gradient-to-r from-[#E6530E]/30 via-[#F7A814] to-[#176447]/30 md:block" aria-hidden="true" />
            {journey.map((item, index) => (
              <motion.div
                key={item.years}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="relative rounded-3xl border border-[#E7EBEF] bg-gradient-to-br from-white to-[#FBFCFD] p-6 shadow-[0_16px_42px_-28px_rgba(9,37,65,0.42)] transition duration-300 hover:-translate-y-1 hover:border-[#D6E2E9] sm:p-8"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-[#FFF1DE] text-xl text-[#D94C13] shadow-sm">
                  {index === 0 ? <FaHeart aria-hidden="true" /> : index === 1 ? <FaUsers aria-hidden="true" /> : <FaGlobeAsia aria-hidden="true" />}
                </div>
                <p className="mt-6 text-sm font-extrabold tracking-wide text-[#D94C13]">{item.years}</p>
                <h3 className="mt-2 text-xl font-extrabold text-[#12345A]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64727D]">{item.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-9 text-center">
            <Link
              to="/Impact"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#12345A] px-7 py-3 text-sm font-extrabold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#176447] focus:outline-none focus:ring-4 focus:ring-[#12345A]/20"
            >
              Explore our impact <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-y border-[#E7EBEF] bg-[linear-gradient(135deg,#FBFAF6_0%,#F3F6F3_55%,#F8F4EC_100%)] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="space-y-6"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#D94C13] sm:text-sm">People make the difference</p>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-[#12345A] sm:text-4xl lg:text-5xl">
              Progress is a shared effort.
            </h2>
            <p className="text-lg leading-8 text-[#53616C]">
              Behind every program and impact story is a dedicated group of
              volunteers and team members. Together, they work to translate the
              vision of Swastik Srijan Foundation into meaningful community action.
            </p>
            <p className="leading-8 text-[#53616C]">
              प्रत्येक कार्यक्रम और प्रयास के पीछे स्वयंसेवकों और टीम के सदस्यों
              का योगदान होता है। सभी मिलकर संस्था के उद्देश्य को सार्थक कार्य में
              बदलने का प्रयास करते हैं।
            </p>
            <Link
              to="/Team"
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#12345A] px-6 py-3 text-sm font-extrabold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#176447] focus:outline-none focus:ring-4 focus:ring-[#12345A]/20"
            >
              Meet the full team <FaArrowRight aria-hidden="true" />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="relative"
          >
            <div className="absolute -bottom-4 -right-4 h-2/3 w-2/3 rounded-[2rem] bg-[#F7A814]/25" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-white shadow-[0_25px_70px_-35px_rgba(9,37,65,0.45)]">
              <OptimizedImage
                src="/images/ssf-team.jpg"
                alt="SSF team and core members"
                className="block aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -left-3 top-8 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:-left-5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#176447]">Together</p>
              <p className="mt-1 text-sm font-bold text-[#12345A]">For the common good</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission, approach and values */}
      <section className="px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#D94C13] sm:text-sm">What guides us</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#12345A] sm:text-4xl lg:text-5xl">Mission, approach & values</h2>
            <p className="mt-5 text-base leading-7 text-[#64727D] sm:text-lg">
              The commitments that help shape how we work with people and communities.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map(({ icon: Icon, number, title, description }, index) => (
              <motion.article
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border border-[#E7EBEF] bg-gradient-to-br from-white via-white to-[#F8FBF9] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D6E2E9] hover:shadow-[0_28px_65px_-35px_rgba(9,37,65,0.45)] sm:p-8"
              >
                <span className="absolute right-6 top-4 text-5xl font-black tracking-tighter text-[#12345A]/[0.05]">{number}</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F8F5] text-2xl text-[#176447] transition duration-200 group-hover:bg-[#176447] group-hover:text-white">
                  <Icon aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-[#12345A]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64727D]">{description}</p>
                <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-[#E6530E] to-[#F7A814] transition-all duration-300 group-hover:w-20" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust and governance */}
      <section className="border-t border-[#E7EBEF] bg-[linear-gradient(135deg,#FBFAF6_0%,#F3F6F3_55%,#F8F4EC_100%)] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#D94C13] sm:text-sm">Transparency & governance</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#12345A] sm:text-4xl lg:text-5xl">Trust is built through action.</h2>
            <p className="mt-5 text-base leading-8 text-[#64727D] sm:text-lg">
              We aim to maintain clear records, responsible governance and ethical
              practices in our work.
            </p>
          </div>
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="overflow-hidden rounded-3xl border border-[#E1E5E2] bg-white p-3 shadow-[0_25px_70px_-45px_rgba(9,37,65,0.4)]">
              <OptimizedImage
                src="/images/cvc-certificate.jpg"
                alt="Central Vigilance Commission pledge certificate"
                className="block h-auto w-full rounded-2xl"
              />
            </div>
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-[#176447] shadow-sm">
                <FaShieldAlt aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-2xl font-black text-[#12345A] sm:text-3xl">A commitment to ethics</h3>
              <p className="mt-4 leading-8 text-[#53616C]">
                Swastik Srijan Foundation is committed to integrity, responsible
                governance and ethical practices. Its pledge with the Central
                Vigilance Commission (CVC) reflects this commitment.
              </p>
              <p className="mt-4 leading-8 text-[#53616C]">
                We believe trust is built through responsible conduct, clear
                communication, proper records and accountability to the communities
                and partners we serve.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-[#E3E8E3] bg-white p-4">
                  <FaShieldAlt className="shrink-0 text-xl text-[#176447]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-extrabold text-[#12345A]">Registered society</p>
                    <p className="mt-1 text-xs text-[#64727D]">Registration details shown above</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-[#E3E8E3] bg-white p-4">
                  <FaHandshake className="shrink-0 text-xl text-[#176447]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-extrabold text-[#12345A]">Accountability</p>
                    <p className="mt-1 text-xs text-[#64727D]">Responsible, transparent conduct</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="relative isolate overflow-hidden bg-[#092541] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#12345A] via-[#092541] to-[#124B3A]" aria-hidden="true" />
        <div className="absolute -left-16 -top-28 h-72 w-72 rounded-full bg-[#F7A814]/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 -right-12 h-80 w-80 rounded-full bg-[#176447]/35 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl text-[#FFC56D]">
            <FaRegCompass aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.22em] text-[#FFC56D] sm:text-sm">Get involved</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Positive change begins when we come together.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
            Join, volunteer or partner with Swastik Srijan Foundation and contribute
            to meaningful community development.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/GetInvolved"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#F7A814] px-7 py-3 text-sm font-extrabold text-[#092541] transition duration-200 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#F7A814]/35"
            >
              Join SSF <FaArrowRight aria-hidden="true" />
            </Link>
            <Link
              to="/Volunteer"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/35 bg-white/10 px-7 py-3 text-sm font-extrabold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#092541] focus:outline-none focus:ring-4 focus:ring-white/25"
            >
              Volunteer <FaHeart aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-8 text-sm font-medium text-white/55">Humanity & Truth · मानवता और सत्य</p>
        </div>
      </section>
    </main>
  );
}
