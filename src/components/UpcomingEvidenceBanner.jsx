import { FaBookOpen, FaHandsHelping, FaLeaf, FaLaptop, FaUsers } from 'react-icons/fa'

export default function UpcomingEvidenceBanner() {
  const cards = [
    ['Education & Digital Learning', 'Expand learning access, digital education and structured learning opportunities.', FaBookOpen],
    ['Women & Youth Skills', 'Strengthen practical skills, confidence, mentoring and livelihood-oriented pathways.', FaUsers],
    ['Environment & Rural Awareness', 'Deepen plantation, cleanliness, environmental responsibility and rural participation.', FaLeaf],
    ['Cyber & Digital Awareness', 'Continue useful digital-safety and public-awareness campaigns.', FaLaptop],
    ['Partnership & Documentation', 'Build structured CSR, academic, government and civil-society partnerships with better monitoring and reporting.', FaHandsHelping],
  ]
  return <section className="relative overflow-hidden border-b border-[#e9e3d6] bg-[#08192b] text-white">
    <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#c9a227]/15 blur-3xl" />
    <div className="mx-auto max-w-7xl px-4 pb-9 pt-24 sm:px-6 md:pb-11 md:pt-28">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur md:p-9">
        <div className="flex items-center gap-3 text-[#e4c86a]"><span className="h-px w-8 bg-[#c9a227]" /><span className="text-xs font-black uppercase tracking-[0.22em]">2026+ Strategic Direction</span></div>
        <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight md:text-4xl">Future projects will grow from documented needs, partnerships and available capacity</h2>
        <p className="mt-4 max-w-4xl text-base leading-7 text-[#cbd5e1] md:text-lg">The Foundation’s recent progress material identifies practical priorities rather than unsupported promises. Projects will be developed with clear scope, responsible implementation, documentation and transparent communication.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([title, text, Icon]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"><Icon className="text-[#c9a227]" /><h3 className="mt-3 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#cbd5e1]">{text}</p></div>)}
        </div>
        <p className="mt-6 rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/[0.10] px-5 py-4 text-sm leading-6 text-[#cbd5e1]">Planning note: a future project is not the same as an operating programme. Launch dates, locations, beneficiaries, fees and services should be treated as confirmed only when SSF publishes the relevant programme notice or partnership information.</p>
      </div>
    </div>
  </section>
}
