import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaHeartbeat,
  FaHome,
  FaLeaf,
  FaHandHoldingHeart,
  FaRupeeSign,
  FaArrowRight,
  FaUsers,
  FaChild,
  FaLaptopCode,
  FaFemale,
  FaSeedling,
  FaBullhorn,
  FaHandsHelping,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import PageHero from "../components/PageHero";
import { CONTACT_INFO } from "../config/contact";

const RAZORPAY_LINK = CONTACT_INFO.social.razorpay;

const campaigns = [
  {
    id: "education-learning",
    icon: <FaGraduationCap />,
    title: "Education & Learning Campaign",
    hindiTitle: "शिक्षा और सीखने का अभियान",
    tagline: "हर व्यक्ति तक सीखने का अवसर",
    description:
      "Education, academic support, digital learning, awareness and community learning initiatives के लिए लोगों, students और institutions को जोड़ने का अभियान।",
    gradient: "from-[#fb8500] to-[#e76f00]",
    image: "/images/real/community-education-meeting.jpg",
  },
  {
    id: "skills-livelihood",
    icon: <FaLaptopCode />,
    title: "Skill & Livelihood Campaign",
    hindiTitle: "कौशल विकास और आत्मनिर्भरता अभियान",
    tagline: "Skill से अवसर, अवसर से आत्मनिर्भरता",
    description:
      "Computer/digital skills, sewing, vocational learning, self-employment, livelihood support और skill-based volunteering को बढ़ावा देने के लिए अभियान।",
    gradient: "from-[#2d6a4f] to-[#1b4332]",
    image: "/images/real/skill-training.jpg",
  },
  {
    id: "women-child",
    icon: <FaFemale />,
    title: "Women & Child Welfare Campaign",
    hindiTitle: "महिला और बाल कल्याण अभियान",
    tagline: "सुरक्षा, शिक्षा, सम्मान और अवसर",
    description:
      "Women empowerment, child welfare, education, health awareness और community support से जुड़े प्रयासों के लिए जनभागीदारी और सहयोग जुटाने का अभियान।",
    gradient: "from-[#d90429] to-[#a00320]",
    image: "/images/real/community-education-meeting.jpg",
  },
  {
    id: "health-awareness",
    icon: <FaHeartbeat />,
    title: "Health Awareness Campaign",
    hindiTitle: "स्वास्थ्य जागरूकता अभियान",
    tagline: "स्वस्थ समुदाय, जागरूक समाज",
    description:
      "Health awareness, preventive awareness, community wellbeing और आवश्यकता अनुसार health-support activities के लिए सहयोग और awareness को बढ़ाना।",
    gradient: "from-[#e63946] to-[#9d0208]",
    image: "/images/real/covid-awareness-banner.jpg",
  },
  {
    id: "rural-community",
    icon: <FaHome />,
    title: "Rural & Community Development",
    hindiTitle: "ग्रामीण और सामुदायिक विकास अभियान",
    tagline: "समुदाय के साथ, समुदाय के लिए",
    description:
      "Rural development, community participation, local needs, self-reliance और social development से जुड़े projects को सहयोग देने का अभियान।",
    gradient: "from-[#264653] to-[#1d3557]",
    image: "/images/real/cloth-distribution.jpg",
  },
  {
    id: "environment",
    icon: <FaLeaf />,
    title: "Environment & Green Awareness",
    hindiTitle: "पर्यावरण और हरित जागरूकता अभियान",
    tagline: "प्रकृति की रक्षा, भविष्य की सुरक्षा",
    description:
      "Environment awareness, tree plantation, responsible community participation और sustainable living से जुड़े awareness campaigns के लिए जनसहयोग।",
    gradient: "from-[#40916c] to-[#1b4332]",
    image: "/images/uploads/tree-plantation.jpg",
  },
];

const objectiveCards = [
  [FaGraduationCap, "Education", "शिक्षा और academic support"],
  [FaLaptopCode, "Skills", "Computer, digital & vocational skills"],
  [FaFemale, "Women", "महिला सशक्तिकरण और livelihood"],
  [FaChild, "Children", "बाल कल्याण और अवसर"],
  [FaHeartbeat, "Health", "स्वास्थ्य जागरूकता और wellbeing"],
  [FaHome, "Rural Development", "ग्रामीण और सामुदायिक विकास"],
  [FaLeaf, "Environment", "पर्यावरण और हरित जागरूकता"],
  [FaUsers, "Youth & Community", "युवा सहभागिता और community support"],
  [FaBullhorn, "Awareness", "Social awareness & campaigns"],
  [FaHandsHelping, "Partnership", "CSR, NGO & institutional collaboration"],
];

export default function Campaigns() {
  return (
    <section className="min-h-screen bg-white font-inria">
      <PageHero
        image="/images/uploads/childhood-hero.webp"
        title="Our Campaigns"
        subtitle="अभियान जो SSF के उद्देश्यों को लोगों की भागीदारी, जागरूकता, volunteering और responsible support से जोड़ते हैं।"
        hindiSubtitle="हर उद्देश्य के लिए एक उद्देश्यपूर्ण अभियान — मिलकर करें सृजन।"
      />

      <div className="bg-[#002344] py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#fb8500]">Support SSF Campaigns</p>
            <p className="mt-1 text-sm text-white/80">जिस अभियान को आप support करना चाहते हैं, उसमें योगदान दें।</p>
          </div>
          <a
            href={RAZORPAY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e76f00]"
          >
            <FaRupeeSign /> Donate via Razorpay
          </a>
        </div>
      </div>

      <div className="bg-gradient-to-b from-white to-zinc-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#fb8500]">Campaigns aligned with objectives</p>
            <h2 className="text-4xl font-serif font-bold text-[#002344] md:text-5xl">Our Campaigns | हमारे अभियान</h2>
            <p className="mt-5 text-lg leading-relaxed text-zinc-600">
              ये campaigns SSF के registered objectives और उपलब्ध resources, volunteers तथा partnerships के अनुसार समय-समय पर चलाए जा सकते हैं।
            </p>
          </motion.div>

          <div className="space-y-16">
            {campaigns.map((campaign, index) => (
              <motion.article
                key={campaign.id}
                id={campaign.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5 }}
                className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-xl md:p-8 lg:grid-cols-2"
              >
                <div className={`${index % 2 ? "lg:order-2" : ""}`}>
                  <div className="relative overflow-hidden rounded-3xl">
                    <img src={campaign.image} alt={campaign.title} className="h-72 w-full object-cover transition duration-700 hover:scale-105 md:h-96" />
                    <div className={`absolute inset-0 bg-gradient-to-tr ${campaign.gradient} opacity-20`} />
                    <div className={`absolute left-5 top-5 rounded-2xl bg-gradient-to-br ${campaign.gradient} p-4 text-3xl text-white shadow-xl`}>
                      {campaign.icon}
                    </div>
                  </div>
                </div>

                <div className={`space-y-5 ${index % 2 ? "lg:order-1" : ""}`}>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#fb8500]">Campaign {String(index + 1).padStart(2, "0")}</p>
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-[#002344] md:text-4xl">{campaign.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-zinc-400">{campaign.hindiTitle}</p>
                  </div>
                  <p className={`bg-gradient-to-r ${campaign.gradient} bg-clip-text text-lg font-bold text-transparent`}>{campaign.tagline}</p>
                  <p className="text-base leading-relaxed text-zinc-600 md:text-lg">{campaign.description}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a href={RAZORPAY_LINK} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${campaign.gradient} px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5`}>
                      <FaRupeeSign /> Support This Campaign
                    </a>
                    <Link to="/DonateAndSupport" className="inline-flex items-center gap-2 rounded-full border-2 border-[#002344] px-6 py-3 text-sm font-bold text-[#002344] transition hover:bg-[#002344] hover:text-white">
                      Donation Details <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#001529] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <HiSparkles className="mx-auto mb-4 text-4xl text-[#fb8500]" />
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#fb8500]">Objective Map</p>
            <h2 className="text-4xl font-serif font-bold text-white md:text-5xl">हर उद्देश्य, एक अवसर</h2>
            <p className="mt-4 text-lg text-zinc-400">इन areas में campaign, volunteering, partnership या responsible donation के माध्यम से सहयोग किया जा सकता है।</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {objectiveCards.map(([Icon, title, text]) => (
              <motion.div key={title} whileHover={{ y: -4 }} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center backdrop-blur">
                <Icon className="mx-auto mb-4 text-3xl text-[#fb8500]" />
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#fb8500]/10 via-white to-[#002344]/5 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-[2rem] border border-[#fb8500]/20 bg-white p-8 shadow-2xl md:p-12">
            <FaHandHoldingHeart className="mx-auto mb-5 text-5xl text-[#fb8500]" />
            <h2 className="text-3xl font-serif font-bold text-[#002344] md:text-4xl">आप किस अभियान में सहयोग करना चाहते हैं?</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-zinc-600">
              Donation किसी specific campaign के लिए करना हो, volunteering करनी हो या CSR/partnership पर बात करनी हो — SSF team से सीधे जुड़ें।
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={RAZORPAY_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fb8500] px-8 py-4 font-bold text-white shadow-lg transition hover:bg-[#e76f00]">
                <FaRupeeSign /> Donate Securely
              </a>
              <a href={CONTACT_INFO.social.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#002344] px-8 py-4 font-bold text-[#002344] transition hover:bg-[#002344] hover:text-white">
                <FaHandsHelping /> Talk to SSF Team
              </a>
            </div>
            <p className="mt-6 text-xs text-zinc-400">Campaigns and programme availability depend on available resources, volunteers, partnerships and local requirements.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
