import { FaBookOpen, FaBullhorn, FaCertificate, FaHandsHelping, FaLeaf, FaLaptop, FaUsers, FaHeartbeat } from 'react-icons/fa'

const DATA = {
  initiatives: {
    eyebrow: 'Evidence-led programme overview',
    title: 'Our work is rooted in documented service and registered objectives',
    intro: 'This page brings together the Foundation’s public programme areas with themes evidenced in its progress records. Activities are undertaken according to available resources, volunteers, partnerships and local requirements.',
    cards: [
      ['Education & Digital Learning', 'School support, foundational learning, computer education, online learning and the SSF Learning Hub.', FaBookOpen],
      ['Health & Wellbeing', 'Health awareness, hygiene, preventive information, community support and referral-oriented activities.', FaHeartbeat],
      ['Women, Youth & Children', 'Women-focused awareness and skills, child welfare, youth development and participation.', FaUsers],
      ['Environment & Community', 'Plantation, cleanliness, rural participation, environmental awareness and community development.', FaLeaf],
    ],
    evidence: 'Historical records include education and community work in 2014–2017, wider environment/yoga/sports and welfare activities in 2018–2019, health and COVID-era humanitarian work in 2019–2021, and consolidated education, skills, health, environment, awareness and documentation work in 2025–2026.'
  },
  learning: {
    eyebrow: 'Learning • Digital Education • Mentorship',
    title: 'Learning Hub — building access to learning opportunities',
    intro: 'The Learning Hub is presented as an education and digital-learning initiative. Its direction is consistent with the Foundation’s documented work in computer education, online classes, technical learning and educational support.',
    cards: [
      ['Digital Learning', 'Computer-based learning, online classes and digital literacy support.', FaLaptop],
      ['Academic Support', 'Foundational learning, communication, guidance and learner engagement.', FaBookOpen],
      ['Rural & Community Access', 'Learning opportunities designed with practical access and community participation in mind.', FaUsers],
      ['Pathways & Preparation', 'The 2026 record includes an initiative supporting Jawahar Navodaya Vidyalaya entrance preparation.', FaCertificate],
    ],
    evidence: 'The progress record documents computer education in the Foundation’s earlier community work, online/technical education during 2020–2021, and the SSF Learning Hub plus Navodaya-preparation initiative in 2026. Programme availability and eligibility should be understood from current announcements.'
  },
  skills: {
    eyebrow: 'Skill Development • Livelihood • Self-reliance',
    title: 'Skills that can strengthen confidence and opportunity',
    intro: 'Skill development is part of the Foundation’s registered field of work and is presented through practical learning, women-focused skill development and livelihood-oriented support.',
    cards: [
      ['Women & Sewing Skills', 'The 2026 progress record documents the Swastik Silai Training Centre in Rewa.', FaUsers],
      ['Digital & Computer Skills', 'Computer education and digital learning are part of the Foundation’s documented journey.', FaLaptop],
      ['Vocational Awareness', 'Awareness of practical skills, self-employment and livelihood pathways.', FaHandsHelping],
      ['Mentoring & Participation', 'Volunteer, trainer and community participation can strengthen learning and confidence.', FaCertificate],
    ],
    evidence: 'The Foundation’s registered objectives cover vocational and skill-development activities, while historical records include computer education and recent records include sewing training, digital learning and livelihood-oriented work. Specific courses, fees and batches should be announced only when actually available.'
  },
  impact: {
    eyebrow: 'Evidence • Documentation • Accountability',
    title: 'Impact is shown through work, records and learning — not inflated numbers',
    intro: 'The Impact page now follows an evidence-first standard: documented activities and programme themes are presented clearly, while unsupported beneficiary totals are not treated as facts.',
    cards: [
      ['Documented Journey', 'The available records cover the Foundation’s journey from establishment in 2013 through current programme development.', FaCertificate],
      ['Programme Evidence', 'Education, health, skills, women/child welfare, environment, rural development and awareness are evidenced across available records.', FaBookOpen],
      ['Human Stories', 'The consolidated report identifies education access, COVID-era assistance and local biodiversity care as documented case-study themes.', FaUsers],
      ['Transparent Reporting', 'Year-specific claims are separated from broader institutional continuity where standalone records are not available.', FaHandsHelping],
    ],
    evidence: 'The consolidated report explicitly recommends using available primary records and not reconstructing missing years with invented activities or figures. This standard is now reflected in the website presentation.'
  },
  campaigns: {
    eyebrow: 'Awareness • Public Interest • Community Action',
    title: 'Campaigns that turn useful information into responsible participation',
    intro: 'SSF campaigns combine awareness communication, community participation and practical public-interest messaging. Campaigns are presented according to the evidence and records available for each activity.',
    cards: [
      ['Education Awareness', 'School enrolment and learning-support themes are documented in early community work.', FaBookOpen],
      ['Health & De-addiction', 'Health, hygiene and de-addiction awareness appear across historical programme records.', FaHeartbeat],
      ['Environment & Cleanliness', 'Plantation, cleanliness and environmental responsibility are recurring community themes.', FaLeaf],
      ['Digital & Public Safety', '2026 records include cyber-safety, UPI/QR and digital-fraud awareness alongside public-interest appeals.', FaBullhorn],
    ],
    evidence: 'Documented campaign themes include School Chale Abhiyan, de-addiction awareness, cleanliness, environmental action, COVID-era public-health communication and recent cyber-safety/digital-awareness messaging.'
  },
  media: {
    eyebrow: 'Documentary Record • Photo Evidence',
    title: 'Media that helps document the Foundation’s journey',
    intro: 'The Media Gallery is intended to show documentary photographs and communication records from SSF activities. Visuals are evidence of a journey, not a substitute for programme records.',
    cards: [
      ['Early Community Work', 'Photographic records support the documented education and community activities of the early period.', FaUsers],
      ['Health & Humanitarian Work', 'Available records include health, awareness and COVID-era community support.', FaHeartbeat],
      ['Environment & Awareness', 'Plantation, cleanliness and environmental/social awareness activities are represented in the archive.', FaLeaf],
      ['Recent Programme Evidence', '2025–2026 documentation includes education, skills, digital initiatives and organisational communication.', FaCertificate],
    ],
    evidence: 'The consolidated report uses original photographs and visual records from supplied reports as documentary evidence and recommends pairing future visuals with dates, locations, activity descriptions and supporting records.'
  },
  involvement: {
    eyebrow: 'Volunteer • Member • Institution • CSR • Community',
    title: 'Participation is the strength behind sustainable community work',
    intro: 'SSF welcomes participation according to its objectives, organisational rules, available programmes and the capacity of volunteers and partners. Joining does not by itself guarantee a role, benefit or programme placement.',
    cards: [
      ['Volunteer & Member', 'Contribute time, skills, outreach, education support or community participation.', FaHandsHelping],
      ['Trainer & Mentor', 'Share subject knowledge, technical skills, professional experience or guidance.', FaBookOpen],
      ['Institutional Partnership', 'Schools, colleges, universities and civil-society organisations can explore defined collaborations.', FaUsers],
      ['CSR & Philanthropic Support', 'Structured support can focus on clearly scoped education, health, skills, environment or community projects.', FaCertificate],
    ],
    evidence: 'The Foundation’s institutional report identifies academic partnerships, implementation partnerships, employee/skill-based volunteering and community/philanthropic support as suitable collaboration models, subject to defined scope and documentation.'
  }
}

export default function WorkEvidenceBanner({ page }) {
  const item = DATA[page] || DATA.initiatives
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-[#001b32] text-white">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#FF6600]/15 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 md:pb-10 md:pt-28">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3 text-[#FFB066]">
                <span className="h-px w-8 bg-[#FF6600]" /><span className="text-xs font-black uppercase tracking-[0.22em]">{item.eyebrow}</span>
              </div>
              <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-4xl">{item.title}</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/72 md:text-lg">{item.intro}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {item.cards.map(([title, text, Icon]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-center gap-3"><Icon className="text-[#FF8A3D]" /><h3 className="font-extrabold">{title}</h3></div>
                  <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-7 rounded-2xl border border-[#FF6600]/20 bg-[#FF6600]/[0.08] px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FFB066]">Record & evidence note</p>
            <p className="mt-2 text-sm leading-6 text-white/75">{item.evidence}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
