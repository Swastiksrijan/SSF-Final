import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FaArrowRight, FaBookOpen, FaFlask, FaSeedling, FaLaptopCode,
  FaRunning, FaMusic, FaHeartbeat, FaShieldAlt, FaIndustry,
  FaLeaf, FaUsers, FaGlobeAsia, FaLightbulb, FaHandsHelping,
  FaChartLine, FaWater, FaBalanceScale, FaBuilding,
  FaCheckCircle, FaCompass, FaRecycle, FaUtensils
} from "react-icons/fa";

export const Route = createFileRoute("/BharatVikasModel")({
  component: BharatVikasModelPage,
});

const pillars = [
  { icon: FaBookOpen, title: "Foundational & Academic Education", text: "Languages, mathematics, sciences, humanities, history, civics, critical thinking and strong foundations for every learner." },
  { icon: FaFlask, title: "Science, Research & Discovery", text: "Hands-on experiments, scientific method, research ethics, innovation studios, observation and problem-solving." },
  { icon: FaSeedling, title: "Agriculture, Horticulture & Food Systems", text: "Soil, seeds, crops, orchards, flowers, vegetables, protected cultivation, water-wise farming and regenerative practices." },
  { icon: FaUtensils, title: "Food Processing & Nutrition", text: "Safe food handling, preservation, processing, kitchens, nutrition literacy, quality standards and responsible value addition." },
  { icon: FaLeaf, title: "Animal Care, Dairy & Allied Rural Livelihoods", text: "Animal welfare, responsible dairy practices, fisheries and other locally suitable livelihood systems, subject to expert guidance." },
  { icon: FaLaptopCode, title: "Digital Technology, AI & Computing", text: "Digital literacy, coding, data, AI awareness, cybersecurity, robotics, electronics and responsible technology use." },
  { icon: FaRunning, title: "Sports, Fitness & Physical Education", text: "A wide range of sports, athletics, teamwork, coaching, fitness, outdoor activity and pathways for talented learners." },
  { icon: FaMusic, title: "Arts, Music & Culture", text: "Music, dance, theatre, visual arts, craft, literature, local traditions and creative expression." },
  { icon: FaHeartbeat, title: "Health, Well-being & Nutrition", text: "Health education, preventive awareness, first aid, mental well-being, healthy habits and access to qualified care." },
  { icon: FaShieldAlt, title: "Yoga, Self-Defence & Personal Safety", text: "Age-appropriate yoga, movement, self-defence, consent, personal safety and emergency preparedness." },
  { icon: FaIndustry, title: "Engineering, Making & Manufacturing", text: "Design thinking, repair, tools, fabrication, product design, quality, safety and responsible manufacturing." },
  { icon: FaChartLine, title: "Enterprise, Finance & Management", text: "Financial literacy, entrepreneurship, accounting, marketing, cooperative models, planning and ethical business." },
  { icon: FaRecycle, title: "Environment, Climate & Circular Economy", text: "Biodiversity, climate literacy, waste reduction, recycling, composting, clean surroundings and resource efficiency." },
  { icon: FaWater, title: "Water, Energy & Sustainable Infrastructure", text: "Water conservation, rainwater harvesting, renewable energy, energy efficiency and resilient campus systems." },
  { icon: FaBalanceScale, title: "Constitution, Law & Civic Responsibility", text: "Constitutional values, rights and duties, legal awareness, democracy, public institutions and responsible citizenship." },
  { icon: FaUsers, title: "Leadership, Communication & Life Skills", text: "Public speaking, collaboration, empathy, decision-making, conflict resolution, languages and leadership." },
  { icon: FaHandsHelping, title: "Community Development & Social Innovation", text: "Understanding rural and urban needs, inclusion, volunteering, social research and practical community solutions." },
  { icon: FaBuilding, title: "Design, Construction & Habitat", text: "Architecture awareness, planning, construction science, accessible design, housing and safe built environments." },
  { icon: FaCompass, title: "Geography, Mobility & World Awareness", text: "Maps, local geography, transport systems, cultural understanding, global awareness and responsible travel." },
  { icon: FaLightbulb, title: "Media, Communication & Creative Industries", text: "Writing, journalism literacy, photography, video, design, digital publishing and responsible communication." },
];

const stages = [
  { no: "01", title: "Explore | Classes 1–5", subtitle: "Strong foundations and joyful discovery", items: ["Language, numeracy, science and curiosity", "Nature, gardens, food and the local community", "Sports, music, art, movement and play", "Age-appropriate digital familiarity", "Kindness, cooperation, safety and confidence"] },
  { no: "02", title: "Experience | Classes 6–8", subtitle: "Learning by doing and guided projects", items: ["Experiments, observation and maker activities", "Gardening, soil, water and food systems", "Coding, robotics and digital citizenship", "Sports practice, arts and creative expression", "Team projects, financial basics and community study"] },
  { no: "03", title: "Build | Classes 9–10", subtitle: "Deeper practice and informed choices", items: ["Strong board-aligned academic learning", "Research projects and evidence-based reasoning", "Elective pathways based on interest and aptitude", "Agriculture, technology, arts, sports and enterprise projects", "Career awareness, communication and leadership"] },
  { no: "04", title: "Specialise | Senior Secondary & Beyond", subtitle: "Multiple pathways, equal dignity", items: ["Academic, vocational, technical and creative pathways", "Advanced labs, apprenticeships and supervised practice", "Preparation for universities, professional institutes and work", "Mentoring, portfolios, research and entrepreneurship", "Flexible pathways for lifelong learning"] },
];

const phases = [
  { label: "Rewa — Foundation & feasibility", period: "Planning stage", text: "Community needs assessment, land and site feasibility, academic framework, child-safeguarding design, expert consultations, partnerships and a bankable Detailed Project Report." },
  { label: "First learning centre / school", period: "Pilot implementation", text: "Begin with a compliant, manageable school or learning centre and a carefully selected set of integrated activities. Establish learning quality, safety, governance and transparent measurement first." },
  { label: "Integrated Rewa campus", period: "Expansion after evidence", text: "Add residential facilities, laboratories, sports, arts, farms, food systems and skill studios in a phased manner, only when approvals, resources and operating capacity are secured." },
  { label: "Higher education & research ecosystem", period: "Long-term development", text: "Explore colleges, specialised institutes, research centres and university-level institutions through qualified academic partners and all required statutory approvals." },
  { label: "Madhya Pradesh & India network", period: "Replication and adaptation", text: "Document what works in Rewa, independently evaluate outcomes and adapt the model with local partners in other districts and states." },
  { label: "Global learning partnerships", period: "Long-term aspiration", text: "Share knowledge and collaborate internationally when the Indian model is proven, sustainable and ready for responsible adaptation." },
];

const safeguards = [
  "Child rights, dignity, privacy and safety are non-negotiable. Residential care, where introduced, will require trained staff, safeguarding policies, grievance channels and appropriate oversight.",
  "No child labour or commercial exploitation. Student projects are educational and age-appropriate; any commercial production or employment must comply with applicable law and must never replace education.",
  "School education will follow applicable curriculum, recognition, affiliation, teacher qualification and child-protection requirements.",
  "Colleges, professional institutes and university-level programmes will be established only through the relevant statutory routes, approvals and qualified academic governance. The vision does not claim IIT status or equivalence.",
  "Health, nutrition, mental well-being, disability inclusion, accessibility and equal opportunity will be built into campus planning.",
  "Land, construction, laboratories, farms, food processing and residential operations will proceed only after technical, environmental, financial and regulatory assessments.",
  "Budgets, procurement, grants, partnerships, outcomes and audited records will be maintained transparently, with independent evaluation where appropriate.",
];

const partnershipAreas = [
  "Education, curriculum, teacher development and school infrastructure",
  "Science laboratories, research mentorship, digital learning and technology",
  "Agriculture, horticulture, animal welfare and food processing",
  "Sports, arts, health, nutrition and student well-being",
  "Renewable energy, water, sanitation and sustainable infrastructure",
  "Skills, enterprise, manufacturing, market access and livelihood systems",
  "Research, monitoring, evaluation, governance and institutional capacity",
];

function SectionHeading({ eyebrow, title, text, light = false }) {
  return (
    <div className={`mx-auto mb-10 max-w-3xl text-center ${light ? "text-white" : "text-[#12345A]"}`}>
      <p className={`text-xs font-extrabold uppercase tracking-[.22em] ${light ? "text-[#FFD27A]" : "text-[#176447]"}`}>{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className={`mt-4 text-base leading-7 ${light ? "text-white/75" : "text-slate-600"}`}>{text}</p>}
    </div>
  );
}

function ConceptCampusIllustration() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#0b2947] via-[#14556a] to-[#176447] p-5 shadow-2xl sm:p-8" role="img" aria-label="Original conceptual diagram of a proposed integrated learning campus, not an actual existing campus">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#F7A814]/15 blur-3xl" />
      <div className="relative">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.18em] text-[#FFD27A]">Original concept illustration</span>
          <span className="text-[10px] font-semibold text-white/60">Proposed model • Rewa, Madhya Pradesh</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["01", "Learning & library", "from-[#f6d58b] to-[#d49b3e]"],
            ["02", "Science & innovation", "from-[#9ed5e7] to-[#3d91b1]"],
            ["03", "Sports & arts", "from-[#b7dfc4] to-[#4b9c70]"],
            ["04", "Farm & food systems", "from-[#d1e5a0] to-[#75a84e]"],
            ["05", "Residential care", "from-[#e5c5dc] to-[#a96e9a]"],
            ["06", "Health & well-being", "from-[#f1b9a7] to-[#cf755e]"],
            ["07", "Skills & enterprise", "from-[#c5c8ed] to-[#777eb9]"],
            ["08", "Nature & clean energy", "from-[#a6ded8] to-[#398e83]"],
          ].map(([n, label, gradient]) => (
            <div key={n} className="rounded-2xl border border-white/15 bg-white/[.08] p-3 backdrop-blur-sm">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-sm font-black text-[#102b42] shadow-lg`}>{n}</div>
              <p className="text-xs font-bold leading-5 text-white sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-dashed border-white/30 bg-black/10 p-4 text-center">
          <p className="text-sm font-extrabold text-white">One connected learning ecosystem</p>
          <p className="mt-1 text-xs leading-5 text-white/65">Knowledge • Practice • Research • Production • Community partnership</p>
        </div>
      </div>
    </div>
  );
}


function ConceptImageBand({ items }) {
  return (
    <div className="mx-auto mb-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ src, alt, label }) => (
        <figure key={label} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img src={src} alt={alt} loading="lazy" className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-52" />
          <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm font-bold text-[#12345A]">{label}</span>
            <span className="shrink-0 rounded-full bg-[#fff6df] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#8a641c]">प्रतीकात्मक चित्र</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function BharatVikasModelPage() {
  return (
    <main className="w-full overflow-hidden bg-white text-slate-800">
      <section className="relative isolate overflow-hidden bg-[#071d33] text-white">
        <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2200&q=85" alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06182c]/95 via-[#09233c]/85 to-[#09233c]/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(247,168,20,.18),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(18,160,180,.18),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[.12]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)", backgroundSize: "42px 42px" }} />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD27A]/40 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#FFD27A]">A long-term national vision of Swastik Srijan Foundation</span>
            <h1 className="mt-7 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">BHARAT VIKAS <span className="text-[#F7A814]">MODEL</span></h1>
            <p className="mt-5 max-w-3xl text-xl font-semibold leading-relaxed text-white sm:text-2xl">समग्र शिक्षा • कौशल • अनुसंधान • उत्पादन • आत्मनिर्भरता</p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">A proposed integrated ecosystem that connects education with life, science with discovery, agriculture with enterprise, and individual growth with the development of villages, cities and the nation.</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65">रीवा, मध्य प्रदेश से शुरुआत करने की परिकल्पना — सीखकर, प्रमाणित करके और चरणबद्ध तरीके से पूरे भारत तक विस्तार की दीर्घकालीन आकांक्षा।</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#vision" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#F7A814] px-5 py-3 text-sm font-extrabold text-[#102b42] transition hover:bg-[#FFD27A]">Explore the vision <FaArrowRight /></a>
              <a href="#partnership" className="inline-flex min-h-12 items-center rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:border-[#FFD27A] hover:text-[#FFD27A]">Explore partnerships</a>
            </div>
          </div>
          <div className="mt-12"><ConceptCampusIllustration /></div>
          <p className="mt-4 text-center text-[11px] leading-5 text-white/45">Illustrative concept diagram created for this proposal. It is not a photograph, architectural plan, completed campus or representation of another institution.</p>
        </div>
      </section>

      <section id="vision" className="scroll-mt-24 bg-[#f5f8fb] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="The central idea" title="Education for life. Knowledge for society. Development for all." text="The Bharat Vikas Model imagines a place where a child does not learn only from textbooks. Learners explore, ask questions, build, grow food, create art, play, conduct age-appropriate research and understand how communities and economies work." />
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#176447]">Our aspiration</p>
              <h3 className="mt-3 text-2xl font-black text-[#12345A]">A capable, compassionate and curious generation</h3>
              <p className="mt-4 leading-7 text-slate-600">Children and young people should gain strong academic foundations, practical understanding, confidence, creativity, physical well-being, respect for work and the ability to solve real problems.</p>
            </article>
            <article className="rounded-3xl bg-[#12345A] p-7 text-white shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#FFD27A]">Our development approach</p>
              <h3 className="mt-3 text-2xl font-black">Connect the village, the city and the nation</h3>
              <p className="mt-4 leading-7 text-white/75">A strong learning and livelihood ecosystem can connect local knowledge, modern science, responsible production, entrepreneurship, public institutions and community needs.</p>
            </article>
          </div>
          <div className="mt-7 rounded-3xl border border-[#dce6ee] bg-white p-6 sm:p-8">
            <h3 className="text-lg font-black text-[#12345A]">The guiding principle</h3>
            <p className="mt-3 text-lg font-semibold leading-8 text-slate-700">Every field of human knowledge and useful work deserves to be explored with curiosity, dignity, ethics and competence. The model is designed to remain broad, interdisciplinary and open to new fields as society evolves.</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Integrated learning ecosystem" title="One campus. Many disciplines. Shared purpose." text="The long-term concept brings academic learning together with practical exposure, research, creativity, health, livelihoods and community development. These are proposed areas of development, not claims that facilities already exist." />
          <ConceptImageBand items={[
            { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80", alt: "विद्यालय में सीखते विद्यार्थी", label: "शिक्षा और सीखना" },
            { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80", alt: "प्रयोगशाला में तकनीकी कार्य", label: "विज्ञान और अनुसंधान" },
            { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", alt: "डिजिटल तकनीक का उपयोग", label: "डिजिटल तकनीक" }
          ]} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }, i) => (
              <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-[#b8d1c6] hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3ef] text-xl text-[#176447] transition group-hover:bg-[#176447] group-hover:text-white"><Icon /></div>
                <p className="mt-4 text-[10px] font-black tracking-[.18em] text-[#b07816]">DOMAIN {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-lg font-extrabold leading-snug text-[#12345A]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-xs leading-6 text-slate-500">The list is intentionally expandable. Additional fields may be included after consultation with learners, communities, educators, researchers and domain experts.</p>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Learning journey" title="From discovery to informed specialisation" text="The learning framework aims to give every child broad exposure while respecting age, ability, interests, curriculum requirements and individual pace." />
          <ConceptImageBand items={[
            { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80", alt: "कक्षा में जिज्ञासा और अध्ययन", label: "बुनियादी शिक्षा" },
            { src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80", alt: "हाथों से प्रयोग और निर्माण", label: "प्रायोगिक शिक्षा" },
            { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80", alt: "समूह में सीखते युवा", label: "उच्च शिक्षा की तैयारी" }
          ]} />
          <div className="grid gap-5 md:grid-cols-2">
            {stages.map((stage) => (
              <article key={stage.no} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#12345A] text-lg font-black text-[#FFD27A]">{stage.no}</span>
                  <div><h3 className="text-xl font-black text-[#12345A]">{stage.title}</h3><p className="mt-1 text-sm font-semibold text-[#176447]">{stage.subtitle}</p></div>
                </div>
                <ul className="mt-6 space-y-3">
                  {stage.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><FaCheckCircle className="mt-1 shrink-0 text-[#176447]" />{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-[#e7d5a9] bg-[#fffaf0] p-5 text-sm leading-7 text-[#624a1c]">
            <strong>Important educational principle:</strong> By Class 10, learners should have meaningful introductory exposure and foundational practical competence across several fields—not be forced to become experts in every field. Advanced specialisation should follow aptitude, interest and informed choice.
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="A living and learning campus" title="A campus that learns from nature and responsible production" text="The proposed campus may progressively connect learning spaces with farms, gardens, food systems, workshops, clean energy and community services. Every facility will depend on feasibility, expertise, approvals and sustainable operating plans." />
          <ConceptImageBand items={[
            { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", alt: "खेत और हरित कृषि क्षेत्र", label: "कृषि और बागवानी" },
            { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80", alt: "प्राकृतिक और हरित परिवेश", label: "पर्यावरण संरक्षण" },
            { src: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80", alt: "स्वच्छ ऊर्जा की अवधारणा", label: "नवीकरणीय ऊर्जा" }
          ]} />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-[#12345A] p-7 text-white sm:p-9">
              <FaSeedling className="text-3xl text-[#FFD27A]" />
              <h3 className="mt-4 text-2xl font-black">Grow, understand and care</h3>
              <p className="mt-3 leading-7 text-white/75">Agriculture plots, orchards, nurseries, protected cultivation, soil and water labs, composting, biodiversity spaces and animal-care learning may help learners understand food, ecology and rural livelihoods.</p>
            </div>
            <div className="rounded-3xl bg-[#eaf3ef] p-7 text-[#12345A] sm:p-9">
              <FaIndustry className="text-3xl text-[#176447]" />
              <h3 className="mt-4 text-2xl font-black">Make, improve and add value</h3>
              <p className="mt-3 leading-7 text-slate-600">Food processing, craft, repair, fabrication, packaging, quality systems and enterprise studios may be developed as supervised learning and livelihood facilities, with lawful and ethical operating arrangements.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Food and nutrition systems", "Dairy and animal welfare", "Solar and clean energy", "Water and waste management", "Libraries and digital labs", "Sports and arts facilities", "Health and well-being centre", "Student hostels, if appropriate"].map((x) => <div key={x} className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-700"><FaCheckCircle className="mr-2 inline text-[#176447]" />{x}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#071d33] px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="A long-term institutional pathway" title="From school to advanced learning and research" text="The vision can grow into a connected network of educational and research institutions. Each stage must be independently planned, professionally governed and established under the applicable legal and regulatory framework." light />
          <ConceptImageBand items={[
            { src: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80", alt: "शैक्षणिक संस्थान का प्रतीकात्मक दृश्य", label: "विद्यालय और संस्थान" },
            { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80", alt: "अनुसंधान प्रयोगशाला", label: "उच्चस्तरीय शोध" },
            { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80", alt: "उच्च शिक्षा और अध्ययन", label: "कॉलेज और विश्वविद्यालय" }
          ]} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Integrated school", "Strong foundational, academic, practical, creative and physical education."],
              ["02", "Senior secondary & skills", "Academic, vocational, technical and creative pathways."],
              ["03", "Colleges & specialised institutes", "Engineering, agriculture, health, law, management, arts and other fields."],
              ["04", "Research & higher education", "Advanced laboratories, research centres and, subject to approvals, university-level institutions."],
            ].map(([n, title, text]) => <article key={n} className="rounded-2xl border border-white/15 bg-white/[.06] p-5"><span className="text-sm font-black text-[#FFD27A]">{n}</span><h3 className="mt-3 text-lg font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{text}</p></article>)}
          </div>
          <p className="mt-6 rounded-2xl border border-[#FFD27A]/30 bg-[#FFD27A]/10 p-5 text-sm leading-7 text-white/80">The aspiration is to build research and academic quality comparable with leading institutions in relevant disciplines over time. This is not an assertion of IIT status, affiliation, recognition or equivalence. Any professional institute or university will require its own legal structure, approvals, qualified faculty and academic governance.</p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Our journey" title="Rewa first. Evidence-led growth across India." text="The proposed path is deliberately phased. The model should earn the right to expand by demonstrating educational quality, community value, sound governance and financial sustainability." />
          <div className="relative ml-3 border-l-2 border-[#d7e4dc] pl-7 sm:ml-8 sm:pl-10">
            {phases.map((phase, i) => <article key={phase.label} className="relative pb-9 last:pb-0">
              <span className="absolute -left-[2.17rem] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#176447] text-[10px] font-black text-white sm:-left-[2.67rem]">{i + 1}</span>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#b07816]">{phase.period}</p>
              <h3 className="mt-1 text-xl font-black text-[#12345A]">{phase.label}</h3>
              <p className="mt-2 max-w-3xl leading-7 text-slate-600">{phase.text}</p>
            </article>)}
          </div>
          <p className="mt-7 rounded-2xl bg-[#f5f8fb] p-5 text-sm leading-7 text-slate-600">These are strategic stages, not guaranteed dates or funded commitments. The sequence and pace will be determined by feasibility studies, community consultation, available resources, regulatory approvals and independently reviewed results.</p>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Partnership ecosystem" title="Many partners. Shared responsibility. Measurable impact." text="No single organisation is expected to build every component. We welcome dialogue with philanthropic institutions, responsible companies, universities, research bodies, government institutions, practitioners and community organisations." />
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-xl font-black text-[#12345A]">Potential areas of collaboration</h3>
              <ul className="mt-5 space-y-3">{partnershipAreas.map((x) => <li key={x} className="flex gap-3 text-sm leading-6 text-slate-600"><FaCheckCircle className="mt-1 shrink-0 text-[#176447]" />{x}</li>)}</ul>
            </div>
            <div className="rounded-3xl bg-[#12345A] p-7 text-white shadow-sm">
              <h3 className="text-xl font-black">Partnership principles</h3>
              <div className="mt-5 space-y-4 text-sm leading-6 text-white/75">
                <p><strong className="text-[#FFD27A]">Alignment:</strong> Each partner may support a clearly defined component aligned with its expertise and mandate.</p>
                <p><strong className="text-[#FFD27A]">Accountability:</strong> Written agreements, transparent budgets, milestones, reporting and independent review.</p>
                <p><strong className="text-[#FFD27A]">Local participation:</strong> Communities, parents, educators and local institutions should shape priorities.</p>
                <p><strong className="text-[#FFD27A]">No implied endorsement:</strong> Listing an organisation as a potential partner does not mean it has agreed, funded, endorsed or joined this initiative.</p>
              </div>
            </div>
          </div>
          <div id="partnership" className="mt-8 scroll-mt-24 rounded-3xl border border-[#dce6ee] bg-white p-7 text-center sm:p-10">
            <FaHandsHelping className="mx-auto text-3xl text-[#176447]" />
            <h3 className="mt-4 text-2xl font-black text-[#12345A]">Help shape the first Rewa chapter</h3>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">We invite serious conversations with institutions and experts who can contribute knowledge, technical guidance, research, infrastructure, mentorship or responsible funding to the next stages of planning.</p>
            <Link to="/Contact" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#12345A] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#176447]">Contact Swastik Srijan Foundation <FaArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Impact and accountability" title="Measure what changes—not just what is built" text="The model will use clear baselines, measurable indicators and periodic review. Targets will be set only after the pilot scope, learner cohort and resources are established." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Learning", "Foundational learning, attendance, progression, completion and learner portfolios."],
              ["Skills & agency", "Demonstrated practical competencies, confidence, communication and informed career choices."],
              ["Health & safety", "Well-being, nutrition awareness, safeguarding compliance and safe learning environments."],
              ["Research & innovation", "Student projects, prototypes, research mentorship and documented problem-solving."],
              ["Community outcomes", "Family and community participation, locally relevant solutions and inclusion."],
              ["Sustainability & governance", "Resource use, financial transparency, audit compliance, partner reporting and independent evaluation."],
            ].map(([title, text]) => <article key={title} className="rounded-2xl border border-slate-200 p-5"><FaChartLine className="text-2xl text-[#176447]" /><h3 className="mt-3 text-lg font-extrabold text-[#12345A]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Responsible implementation" title="Principles that protect the purpose" text="A large vision must be matched by careful planning, lawful implementation and strong protections for every learner and community member." />
          <div className="grid gap-3 md:grid-cols-2">
            {safeguards.map((item, i) => <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eaf3ef] text-xs font-black text-[#176447]">{i + 1}</span><p className="text-sm leading-7 text-slate-600">{item}</p></div>)}
          </div>
        </div>
      </section>


      {/* ADDITIVE EXPANSION: all new chapters below supplement the original vision above. */}
      <section className="bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Expanded education framework" title="A complete pathway for every learner" text="The existing learning journey is further supported by individual guidance, teacher development, inclusive learning support and opportunities for lifelong growth." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Talent, aptitude & interest discovery", "Age-appropriate observation, learner portfolios, counselling, exposure to different fields and opportunities to discover strengths without labelling or limiting children."],
              ["Individual development plans", "Regular conversations among learners, families, teachers and qualified counsellors to set realistic learning goals and review progress."],
              ["Strong academic foundations", "Reading, writing, mathematics, languages, science, humanities, critical thinking, digital literacy and curriculum-aligned learning support."],
              ["Practical and experiential education", "Demonstrations, supervised projects, field visits, laboratories, gardens, workshops, community studies and reflection on real-world problems."],
              ["Competitive examinations & career guidance", "Accurate information, study skills, mentoring and preparation options for suitable entrance, scholarship, public-service and professional examinations—without making exam coaching the whole purpose of education."],
              ["Teacher education & continuous development", "Recruitment of qualified educators, induction, mentoring, subject development, inclusive pedagogy, child protection, classroom practice and regular professional learning."],
              ["Support for learners who need help", "Early identification of learning barriers, bridge courses, remedial support, accessible materials, counselling and family engagement."],
              ["Enrichment for advanced learners", "Deeper projects, research mentorship, competitions, advanced reading, creative challenges and opportunities matched to readiness."],
              ["Digital, AI & lifelong learning", "Responsible use of digital tools and AI, media literacy, online safety, continuing education and reskilling opportunities for youth and adults."]
            ].map(([title, text]) => <article key={title} className="rounded-2xl border border-[#eadfca] bg-white p-5"><h3 className="text-lg font-extrabold text-[#12345A]">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Practical life skills" title="Skills that make people more capable in everyday life" text="Practical learning will be age-appropriate, supervised, inclusive and safety-led. It will build respect for all forms of work and help learners understand how homes, communities and essential services function." />
          <ConceptImageBand items={[
            { src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80", alt: "भोजन तैयार करने का अभ्यास", label: "पाक-कला और पोषण" },
            { src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80", alt: "उपकरणों के साथ तकनीकी अभ्यास", label: "मशीन और मरम्मत कौशल" },
            { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", alt: "कंप्यूटर आधारित कौशल", label: "डिजिटल साक्षरता" }
          ]} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Food, cooking & nutrition", "Kitchen hygiene, safe cooking, meal planning, nutrition, food storage and reducing food waste."],
              ["Electrical, electronics & machines", "Basic circuits, safe appliance awareness, electronics, maintenance concepts and supervised machine operation."],
              ["Carpentry, plumbing & construction", "Materials, measuring, basic repairs, water fittings, tools, construction safety and practical design."],
              ["Tailoring, design & crafts", "Stitching, textiles, repair, handicrafts, product design, local crafts and creative making."],
              ["Money, banking & financial literacy", "Saving, budgeting, bank accounts, digital payments, interest, responsible borrowing, insurance awareness and fraud prevention."],
              ["First aid & emergency response", "Age-appropriate first aid, emergency contacts, fire and disaster safety, basic response and when to seek professional help."],
              ["Self-defence & personal safety", "Situational awareness, boundaries, consent, safe help-seeking, digital safety and age-appropriate self-defence."],
              ["Communication & leadership", "Listening, speaking, writing, teamwork, public presentation, negotiation, empathy and responsible leadership."],
              ["Time, work & personal organisation", "Planning, punctuality, goal setting, problem-solving, self-care and balancing study, rest and activities."],
              ["Family, society & civic responsibility", "Respect, care, shared responsibilities, community participation, constitutional values and responsible citizenship."]
            ].map(([title, text]) => <article key={title} className="rounded-2xl border border-slate-200 p-5"><h3 className="font-extrabold text-[#12345A]">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Agriculture to enterprise" title="Connect the complete production and value chain" text="The proposed ecosystem will help learners and communities understand how natural resources, knowledge, production, processing, quality, markets and livelihoods connect. Commercial activity, if developed, will be lawful, professionally managed and separate from compulsory student learning." />
          <ConceptImageBand items={[
            { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", alt: "खेती और फसल उत्पादन", label: "कृषि उत्पादन" },
            { src: "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=1200&q=80", alt: "खाद्य उत्पाद और बाजार", label: "खाद्य प्रसंस्करण" },
            { src: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80", alt: "ताजा कृषि उपज", label: "मूल्य संवर्धन" }
          ]} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Seeds, nurseries & planting material", "Seed knowledge, nursery management, saplings, local varieties, seed conservation and quality planting material."],
              ["Crop, fruit, flower & vegetable systems", "Field crops, orchards, vegetables, flowers, protected cultivation, horticulture and locally suitable cropping systems."],
              ["Modern and regenerative agriculture", "Soil health, efficient irrigation, water conservation, integrated pest management, farm mechanisation and climate-resilient practices."],
              ["Allied livelihoods", "Responsible dairy, animal husbandry, fisheries, poultry, beekeeping and other suitable activities with expert animal-welfare and biosecurity oversight."],
              ["Processing, preservation & packaging", "Food safety, grading, storage, processing, preservation, packaging, quality assurance and value addition."],
              ["Tools, machinery & farm technology", "Appropriate farm equipment, repair, sensors, irrigation technology, digital advisory and locally useful innovations."],
              ["Branding, marketing & market access", "Product standards, branding, pricing, logistics, retail, digital commerce, institutional buyers and consumer trust."],
              ["Cooperatives, FPOs & producer networks", "Collective procurement, producer organisations, shared facilities, fair market access and transparent benefit sharing."],
              ["Agri-enterprises & start-ups", "Business planning, incubation, finance readiness, research partnerships and responsible rural entrepreneurship."]
            ].map(([title, text]) => <article key={title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h3 className="font-extrabold text-[#12345A]">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Higher education & research" title="Build knowledge institutions across disciplines" text="The long-term aspiration is to develop specialised academic and research capacity in response to public needs, subject to demand, feasibility, qualified faculty, partnerships and statutory approvals." />
          <ConceptImageBand items={[
            { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80", alt: "वैज्ञानिक प्रयोग", label: "विज्ञान अनुसंधान" },
            { src: "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1200&q=80", alt: "इंजीनियरिंग और तकनीकी नवाचार", label: "इंजीनियरिंग" },
            { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", alt: "कंप्यूटिंग और डिजिटल नवाचार", label: "AI और कंप्यूटिंग" }
          ]} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Science & foundational research", "Physics, chemistry, biology, mathematics, materials, interdisciplinary science and research methods."],
              ["Engineering & advanced technology", "Engineering disciplines, computing, electronics, robotics, automation, manufacturing and emerging technologies."],
              ["Agriculture & animal sciences", "Agricultural sciences, horticulture, soil and water, veterinary and animal sciences, food systems and rural innovation."],
              ["Health & medical sciences", "Public health, allied health, nursing, health technology, preventive care and other programmes only through appropriate approvals."],
              ["Management & entrepreneurship", "Management, finance, operations, social enterprise, cooperatives, innovation and responsible business."],
              ["Law, governance & public administration", "Legal education, constitutional studies, public policy, governance, administration and justice awareness."],
              ["Environment & climate research", "Ecology, biodiversity, climate adaptation, renewable energy, water, waste and sustainable development."],
              ["AI, robotics, space & emerging fields", "Artificial intelligence, data science, robotics, aerospace and space science through qualified academic and research collaborations."],
              ["Innovation, invention & start-up incubation", "Maker spaces, prototyping, intellectual property awareness, technology transfer, incubation and responsible commercialisation."]
            ].map(([title, text]) => <article key={title} className="rounded-2xl border border-slate-200 p-5"><h3 className="font-extrabold text-[#12345A]">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#12345A] px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Village & city development" title="Solutions shaped by the realities of each community" text="The model will not impose one identical solution everywhere. Rural and urban development plans will be designed with local people, evidence, institutions and context." light />
          <ConceptImageBand items={[
            { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", alt: "ग्रामीण कृषि और आजीविका", label: "ग्रामीण विकास" },
            { src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80", alt: "शहरी आधारभूत संरचना", label: "शहरी विकास" },
            { src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80", alt: "समुदाय की सहभागिता", label: "सामुदायिक विकास" }
          ]} />
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/15 bg-white/[.07] p-7">
              <h3 className="text-2xl font-black text-[#FFD27A]">Rural development framework</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-white/80">{["Higher and more stable farm and allied-livelihood incomes","Local jobs, skill centres, small enterprises and value addition","Access to quality education, health awareness and digital services","Safe drinking water, sanitation, nutrition and clean energy","Women’s participation, leadership, safety and economic opportunity","Youth skills, career guidance, entrepreneurship and local innovation","Community institutions, producer groups and village-level planning"].map(x => <li key={x} className="flex gap-3"><FaCheckCircle className="mt-1 shrink-0 text-[#FFD27A]" />{x}</li>)}</ul>
            </article>
            <article className="rounded-3xl border border-white/15 bg-white/[.07] p-7">
              <h3 className="text-2xl font-black text-[#FFD27A]">Urban development framework</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-white/80">{["Education, employable skills, career pathways and entrepreneurship","Responsible waste management, recycling and circular economy","Urban agriculture, green spaces, biodiversity and clean air","Water conservation, energy efficiency and resilient infrastructure","Technology-enabled public services and digital inclusion","Community health, sports, arts, safety and accessible public spaces","Local enterprise, innovation, research and dignified employment"].map(x => <li key={x} className="flex gap-3"><FaCheckCircle className="mt-1 shrink-0 text-[#FFD27A]" />{x}</li>)}</ul>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Equity & social inclusion" title="Opportunity must reach those who need it most" text="The model will work toward access, dignity and participation for learners and communities who face economic, social, geographic or accessibility barriers." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Economically weaker families", "Scholarships, fee support, learning materials, meals or other assistance based on transparent eligibility and available resources."],
              ["Girls’ education and safety", "Safe access, retention, leadership, health awareness, mentoring, sports participation and pathways to further study."],
              ["Women’s skills and livelihoods", "Adult learning, digital and financial literacy, vocational skills, enterprise support and access to markets."],
              ["Disability inclusion", "Accessible buildings, inclusive teaching, reasonable accommodations, assistive technology and individual support."],
              ["Underserved and disadvantaged communities", "Community outreach, fair admissions processes, bridge support and culturally respectful engagement."],
              ["Rural talent and remote learners", "Local outreach, transport or digital access solutions where feasible, mentoring and pathways to advanced learning."]
            ].map(([title, text]) => <article key={title} className="rounded-2xl border border-slate-200 p-5"><h3 className="font-extrabold text-[#12345A]">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></article>)}
          </div>
          <p className="mt-5 rounded-2xl bg-[#fffaf0] p-5 text-sm leading-7 text-[#624a1c]">Scholarships and inclusion programmes will require transparent criteria, safeguarding, appropriate data privacy and realistic funding. No benefit or admission guarantee is implied by this vision page.</p>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Campus and infrastructure master plan" title="Plan the full ecosystem in connected, feasible stages" text="The following is a long-term infrastructure menu for assessment—not a statement that land, buildings, equipment or approvals have already been secured." />
          <ConceptImageBand items={[
            { src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", alt: "सीखने और काम करने के स्थान", label: "शैक्षणिक भवन" },
            { src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80", alt: "खेल और शारीरिक गतिविधि", label: "खेल परिसर" },
            { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80", alt: "हरित और टिकाऊ परिसर", label: "हरित कैंपस" }
          ]} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {["School and higher-education academic blocks","Student hostels and supervised residential facilities, if feasible","Libraries, reading rooms and digital knowledge centres","Science, computer, engineering and research laboratories","Sports grounds, courts, gymnasium and indoor facilities","Agricultural land, demonstration farms, gardens and orchards","Nurseries, greenhouses and protected cultivation","Dairy and animal-care facilities designed for welfare","Food processing, storage, testing and packaging facilities","Health centre and referral/clinical partnerships as permitted","Arts, music, theatre and cultural learning spaces","Vocational training, maker and enterprise centres","Solar power, energy storage and efficiency systems","Water supply, rainwater harvesting, sanitation and wastewater treatment","Waste segregation, recycling and composting systems","Accessible transport, roads, pathways and emergency systems","Staff, faculty and researcher accommodation where required","Community outreach, extension and public learning spaces"].map(x => <div key={x} className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold leading-6 text-slate-700"><FaCheckCircle className="mr-2 inline text-[#176447]" />{x}</div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Governance & institutional strength" title="A strong institution must be built behind the vision" text="Professional governance, public trust and accountability are essential for a project of this scale. Structures will be developed as the programme grows and in accordance with applicable law." />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Expert advisory council", "Seek independent expertise in education, science, agriculture, health, finance, law, child protection, infrastructure, environment and community development."],
              ["Professional leadership & teams", "Build accountable academic, operational, finance, safeguarding, engineering, research, partnership and monitoring teams with defined roles."],
              ["Transparent finance & procurement", "Use approved budgets, documented procurement, conflict-of-interest controls, grant restrictions, financial reporting and statutory audits."],
              ["Independent evaluation & public reporting", "Publish appropriate progress information, measure outcomes, commission reviews and act on lessons and complaints."],
              ["Child protection & grievance systems", "Maintain child-safeguarding policies, staff verification and training, safe reporting channels, response procedures and oversight."],
              ["University and research collaboration", "Create written, clearly scoped collaborations for faculty development, curriculum, research, evaluation and technical advice."],
              ["Responsible funding partnerships", "Engage government programmes, CSR, philanthropy, foundations and other lawful sources without assuming any grant or partnership is secured."],
              ["Community voice & participation", "Include parents, learners, local residents, educators and relevant community organisations in consultation and feedback."]
            ].map(([title, text]) => <article key={title} className="rounded-2xl border border-slate-200 p-5"><h3 className="font-extrabold text-[#12345A]">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8fb] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Financial and economic sustainability" title="Build a diversified resource model—without compromising education" text="A project of this scale will need realistic capital planning, recurring operating support, partnerships and phased investment. Income generation may support sustainability, but must not become a substitute for education or public benefit." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Agriculture and horticulture", "Potential lawful sale of surplus produce, nursery plants, seeds or other products after meeting learning, safety and operating needs."],
              ["Processed food and local products", "Quality-assured, compliant food products and value-added goods where facilities, licences and market feasibility exist."],
              ["Training and continuing education", "Appropriately designed training programmes for youth, adults, farmers, teachers and community groups."],
              ["Social enterprise and services", "Mission-aligned services, repair, design, production or community enterprise with transparent accounting and governance."],
              ["Technology and innovation products", "Responsible licensing, prototypes, technology transfer and products emerging from mature research partnerships."],
              ["Research and institutional partnerships", "Project grants, sponsored research, technical collaborations and evaluation partnerships under written agreements."],
              ["Donations, CSR and philanthropy", "Eligible contributions and grants subject to donor conditions, due diligence, statutory compliance and transparent utilisation."],
              ["Government programmes and convergence", "Explore suitable public schemes and institutional support where eligibility, approvals and programme rules permit."],
              ["Long-term financial planning", "Separate capital and operating budgets, maintenance reserves, risk planning, independent audits and periodic financial sustainability reviews."]
            ].map(([title, text]) => <article key={title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h3 className="font-extrabold text-[#12345A]">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></article>)}
          </div>
          <p className="mt-6 rounded-2xl border border-[#e7d5a9] bg-[#fffaf0] p-5 text-sm leading-7 text-[#624a1c]"><strong>Public-benefit safeguard:</strong> Access for economically weaker learners, educational quality, child welfare and the organisation’s charitable purpose must not depend solely on commercial profit. Any income-generating activity must comply with applicable law, the organisation’s objects and relevant tax and grant conditions.</p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Implementation roadmap" title="Three horizons: what exists, what is next and what is envisioned" text="A clear distinction between present reality, medium-term development and long-term aspiration protects credibility and helps partners assess each stage responsibly." />
          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-xs font-black uppercase tracking-[.18em] text-[#176447]">Horizon 1</p><h3 className="mt-2 text-xl font-black text-[#12345A]">Current work & readiness</h3><p className="mt-3 text-sm leading-7 text-slate-600">Document the organisation’s actual activities, governance, statutory status, audited records and available capacity. Conduct Rewa needs assessment, consultations, feasibility, concept design and preparation of a realistic pilot proposal. Only verified activities and resources should be described as current.</p></article>
            <article className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-xs font-black uppercase tracking-[.18em] text-[#176447]">Horizon 2</p><h3 className="mt-2 text-xl font-black text-[#12345A]">Medium-term pilot & strengthening</h3><p className="mt-3 text-sm leading-7 text-slate-600">Implement a feasible Rewa education and skills pilot after resources and approvals are secured. Build the team, teacher support, community participation, learning measurement, safe facilities and selected practical modules. Evaluate results before expanding.</p></article>
            <article className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-xs font-black uppercase tracking-[.18em] text-[#176447]">Horizon 3</p><h3 className="mt-2 text-xl font-black text-[#12345A]">Long-term national vision</h3><p className="mt-3 text-sm leading-7 text-slate-600">Develop the integrated Rewa campus, additional educational and research institutions, rural and urban development programmes, and a network across Madhya Pradesh and India. Explore international cooperation only when capacity, evidence and governance support it.</p></article>
          </div>
          <div className="mt-7 rounded-2xl bg-[#eaf3ef] p-6">
            <h3 className="font-black text-[#12345A]">Indicative milestones to be set after feasibility</h3>
            <p className="mt-2 text-sm leading-7 text-slate-700">Baseline and community assessment → Detailed Project Report and cost estimates → land/site and regulatory due diligence → resource mobilisation and written partnerships → pilot launch → periodic learning and safeguarding reviews → independent evaluation → evidence-based expansion decision. No calendar dates, budgets or outcomes are promised on this concept page.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#071d33] px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Development challenges & proposed responses" title="Understand the problem before designing the solution" text="A Rewa baseline study and later local assessments should identify which challenges are most significant in each geography. The following are themes for investigation and programme design, not unsupported claims about measured local conditions." light />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Unequal access to quality learning", "Strengthen foundational learning, teacher support, safe infrastructure, inclusion, mentoring and practical exposure."],
              ["Gap between education and practical capability", "Connect classroom learning with supervised projects, life skills, laboratories, farms, workshops and career awareness."],
              ["Limited local livelihood and value addition opportunities", "Explore skills, producer networks, processing, local enterprise, market access and responsible technology."],
              ["Research and innovation disconnected from local needs", "Encourage community problem statements, university partnerships, research mentorship and appropriate innovation."],
              ["Rural and urban service and infrastructure gaps", "Use local evidence to prioritise water, sanitation, health awareness, energy, waste, digital access and public spaces."],
              ["Barriers faced by women and underserved learners", "Design safe, accessible, affordable and inclusive programmes with community participation and transparent support."],
              ["Environmental and climate pressures", "Promote water stewardship, soil health, biodiversity, renewable energy, waste reduction and climate-resilient practices."],
              ["Weak coordination across sectors", "Create partnerships with clear roles, shared milestones, responsible data use, transparent finance and independent evaluation."]
            ].map(([title, text]) => <article key={title} className="rounded-2xl border border-white/15 bg-white/[.06] p-5"><h3 className="font-extrabold text-[#FFD27A]">{title}</h3><p className="mt-2 text-sm leading-7 text-white/75">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#12345A] via-[#14556a] to-[#176447] px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <FaGlobeAsia className="mx-auto text-4xl text-[#FFD27A]" />
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[.22em] text-[#FFD27A]">Our long-term commitment</p>
          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">From one beginning in Rewa to a stronger, more capable India.</h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/80">We believe that villages and cities develop when people have access to quality education, useful skills, science, opportunity, healthy communities and dignified livelihoods. The Bharat Vikas Model is a long-term effort to connect these elements—one responsible step at a time.</p>
          <p className="mt-7 text-lg font-bold text-[#FFD27A]">Swastik Srijan Foundation Samiti • Rewa, Madhya Pradesh • India</p>
          <Link to="/Contact" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-[#12345A] transition hover:bg-[#FFD27A]">Start a conversation <FaArrowRight /></Link>
        </div>
      </section>

      <section className="bg-[#071d33] px-5 py-8 text-white/55 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-3 text-[11px] leading-6">
          <p><strong className="text-white/80">Concept and image notice:</strong> This page presents an original proposed vision of Swastik Srijan Foundation Samiti. The campus diagram and graphic elements are original conceptual illustrations created for this page; they are not photographs of an existing school, university, company, NGO or other institution. No third-party institutional photographs have been used as representations of our facilities. Any future illustrative or generated image will be labelled as conceptual and will not be presented as a completed project.</p>
          <p><strong className="text-white/80">Status notice:</strong> The Bharat Vikas Model is a long-term vision under conceptual development. Facilities, institutions, partnerships, funding, land, construction, approvals, timelines and outcomes described here are proposed or aspirational unless separately and expressly confirmed. This page does not claim that any named external organisation has endorsed, funded or partnered in the initiative.</p>
          <p><strong className="text-white/80">Copyright and use:</strong> Original written content, page design, diagrams and brand presentation on this page are published by Swastik Srijan Foundation Samiti and are protected to the extent provided by applicable law. Reproduction or commercial reuse of these materials requires prior written permission, except where permitted by law. This notice does not claim exclusive ownership over general ideas, educational methods, facts or concepts. The organisation may maintain dated records of its original materials and future project documentation.</p>
          <p>© {new Date().getFullYear()} Swastik Srijan Foundation Samiti. All rights reserved.</p>
        </div>
      </section>
    </main>
  );
}
