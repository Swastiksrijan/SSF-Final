import { Link } from "@tanstack/react-router";
import { ArrowRight, Sprout, Package, Shirt, Utensils, Truck, Laptop, Factory, Recycle, GraduationCap, HeartHandshake, ShieldCheck, TrendingUp, MapPin, ClipboardCheck } from "lucide-react";

const sectors = [
  { icon: Sprout, title: "Agriculture & farmer economy", hindi: "कृषि एवं किसान आधारित कार्य", items: ["Farm produce aggregation and direct marketing", "Turmeric, spices, pulses and grains cleaning, grading and packing", "Flour, besan, sattu, dal and millet processing", "Cold-pressed oil, jaggery and traditional foods", "Pickles, papad, badi, chutneys and preserves", "Fruit and vegetable sorting, packing and local delivery", "Nursery, seedlings, seeds and saplings", "Vermicompost, organic manure and bio-inputs", "Mushroom cultivation, honey and medicinal plants", "Dairy, animal husbandry, poultry, fisheries and fodder", "Farm equipment rental and repair", "Farmer producer groups and market linkages"] },
  { icon: Package, title: "Paper, packaging & eco-products", hindi: "कागज, पैकेजिंग एवं पर्यावरण-अनुकूल उत्पाद", items: ["Dona-pattal, leaf plates and bowls", "Paper plates, cups, napkins and tissues", "Paper bags, envelopes and carry bags", "Notebooks, registers, diaries and school stationery", "Files, folders, office paper and printed forms", "Corrugated boxes and product packaging", "Wedding cards, invitation and customised print products", "Cloth, jute, bamboo and areca-based products", "Waste-paper collection, sorting and recycling", "Reusable and low-waste packaging solutions"] },
  { icon: Shirt, title: "Footwear, garments & daily-use goods", hindi: "जूते-चप्पल, वस्त्र एवं दैनिक उपयोग", items: ["Slippers, sandals, school shoes and footwear distribution", "Footwear repair and, later, small manufacturing", "School uniforms and institutional uniforms", "Tailoring, stitching, embroidery and alteration", "Cloth bags, school bags and utility bags", "Bedsheets, towels, curtains and household textiles", "Ready-made garments and local artisan products", "Belts, wallets and other accessories"] },
  { icon: Utensils, title: "Food processing & nutrition", hindi: "खाद्य प्रसंस्करण एवं पोषण", items: ["Roasted gram, peanuts, makhana and healthy snacks", "Namkeen, traditional snacks and bakery products", "Poha, murmura, daliya and millet products", "Spice blends and ready-to-cook mixes", "Tea, coffee and local beverage packing", "Tiffin, institutional meals and catering", "Traditional sweets and seasonal food products", "Safe drinking-water supply; packaged-water unit only after feasibility and compliance review"] },
  { icon: Truck, title: "Trading, supply & distribution", hindi: "व्यापार, सप्लाई एवं वितरण", items: ["School stationery, books, uniforms and shoes supply", "Office paper, printing and packaging supply", "Dona-pattal supply to caterers, hotels and event organisers", "Farm produce buying, aggregation and commission marketing", "Wholesale-to-retail distribution for local shops", "Institutional purchase orders and eligible tenders", "SHG and local artisan product marketing", "Online catalogue, direct orders and local delivery"] },
  { icon: Laptop, title: "Digital, education & professional services", hindi: "डिजिटल, शिक्षा एवं प्रोफेशनल सेवाएँ", items: ["Website creation, maintenance and digital support", "Graphic design, posters, banners and social media creatives", "Printing, photocopy, scanning and document formatting", "Resume, biodata and application assistance", "Computer basics, typing and digital literacy training", "Data entry, billing and basic bookkeeping support", "Digital marketing support for small businesses", "Skill training, career guidance and placement assistance", "Paid training or services only with transparent fee policy and access safeguards"] },
  { icon: Factory, title: "Local manufacturing & repair", hindi: "स्थानीय निर्माण एवं मरम्मत", items: ["Agarbatti, dhoop and candle making", "Soap, detergent and household cleaning products subject to applicable rules", "Furniture making and repair", "Metal fabrication and small utility products", "Concrete blocks, pavers and construction-material distribution", "Electrical, mobile and computer repair services", "Solar lights and energy-product sales/installation", "Small job-work, assembly and packaging services"] },
  { icon: Recycle, title: "Green economy & circular livelihoods", hindi: "हरित अर्थव्यवस्था एवं पुनर्चक्रण", items: ["Dry and wet waste segregation and authorised collection", "Paper, plastic, textile and e-waste channelisation through authorised recyclers", "Compost from biodegradable waste", "Repair, refurbish and reuse services", "Biogas and decentralised resource recovery after feasibility study", "Plant nursery, plantation supplies and maintenance contracts"] },
];

const phases = [
  { n: "01", title: "Market-first pilot", time: "First 0–3 months", desc: "Start with order-backed supply and service work; validate customers before buying machines.", bullets: ["Spices and local farm produce packing on a small, compliant scale", "Stationery, paper bags and institutional supply", "Dona-pattal trading and supply", "Digital design, printing coordination and document services"] },
  { n: "02", title: "Own production capability", time: "3–9 months", desc: "Use repeat orders and verified margins to add only the equipment that removes a real bottleneck.", bullets: ["Small spice/grain processing and packing equipment", "Paper/leaf plate machinery only after confirmed demand", "Tailoring and uniform orders through local workers", "Standard product costing, labels, quality checks and inventory control"] },
  { n: "03", title: "Build a local enterprise hub", time: "9–18 months", desc: "Develop a modest SSF enterprise and livelihood centre in Rewa, subject to premises, demand and funding.", bullets: ["Shared workspace, storage and dispatch", "Training and paid production opportunities", "Supplier and buyer network across nearby blocks", "Separate accounts and monthly performance review for each unit"] },
  { n: "04", title: "Expand proven units", time: "18–36 months", desc: "Replicate only units with repeat customers, positive contribution margin and reliable operations.", bullets: ["Add footwear distribution/manufacturing where viable", "Expand food processing and institutional supply", "Explore warehouse, cold chain or larger production only with feasibility", "Replicate the model in other districts and states"] },
];

const principles = [
  ["Mission first", "All surplus is retained and applied only toward the Foundation’s charitable objects, subject to applicable law and governing documents."],
  ["No personal distribution", "No profit, dividend or private benefit is intended for members or office-bearers; related-party transactions must be transparent and properly approved."],
  ["Separate books", "Maintain unit-wise cost centres, invoices, stock records, bank trail and separate books wherever required by law."],
  ["Prove demand before capex", "Prefer advance orders, buyer commitments, small batches, job-work and rented equipment before purchasing machinery."],
  ["Quality and compliance", "Obtain applicable registrations, licences, product testing, labelling, labour and safety compliance before operations."],
  ["Protect the social mission", "Do not divert restricted donations or CSR grants into commercial activity. Use each grant only for its sanctioned purpose."],
];

export default function SustainableLivelihoodPage() {
  return <main className="min-h-screen bg-[#F7F9FC] text-[#26343D]">
    <section className="relative overflow-hidden bg-[#002344] text-white">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 15% 20%, #2d6a4f 0, transparent 32%), radial-gradient(circle at 85% 80%, #fb8500 0, transparent 28%)"}} />
      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <p className="mb-4 text-xs font-bold uppercase tracking-[.28em] text-[#ffb347]">Swastik Srijan Foundation · Long-term sustainability initiative</p>
        <div className="max-w-4xl">
          <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">Sustainable Livelihood & Social Enterprise Initiative</h1>
          <p className="mt-4 text-xl font-semibold text-white/90">स्थायी आजीविका एवं सामाजिक उद्यम पहल</p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/80 md:text-lg">Building responsible, income-generating activities whose lawful surplus can strengthen the Foundation’s social mission—so education, health, skills, rural development and community service can continue with greater financial resilience.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#roadmap" className="inline-flex items-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 font-bold text-[#17212b] hover:bg-[#ffad4d]">Explore the roadmap <ArrowRight size={18}/></a>
            <Link to="/Contact" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 font-bold text-white hover:bg-white/10">Discuss partnership</Link>
          </div>
        </div>
        <div className="mt-14 grid gap-3 sm:grid-cols-3">
          {[["2013","Foundation journey"],["Rewa, MP","Proposed pilot hub"],["Pan-India","Long-term vision"]].map(([v,l])=><div key={l} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"><div className="text-2xl font-black text-[#ffb347]">{v}</div><div className="mt-1 text-sm text-white/75">{l}</div></div>)}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">Our central idea</p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">Earn responsibly. Reinvest in social good.</h2>
        <p className="mt-5 text-base leading-8 text-slate-600">The initiative is designed to reduce long-term dependence on donations, CSR and government assistance. It does not replace the Foundation’s charitable work; it aims to create a dependable support system for that work.</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {[["01","Identify demand","Choose useful products and services with real buyers."],["02","Start lean","Trade, aggregate, provide services or use job-work before heavy investment."],["03","Build surplus","Track every cost, improve quality and grow repeat customers."],["04","Support the mission","Apply available lawful surplus to the Foundation’s charitable objects."]].map(([n,t,d])=><div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="text-sm font-black text-[#fb8500]">{n}</div><h3 className="mt-3 text-lg font-extrabold text-[#002344]">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{d}</p></div>)}
      </div>
    </section>

    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">Opportunity portfolio</p><h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">A broad list of potential activities</h2><p className="mt-4 leading-7 text-slate-600">This is a long-term opportunity bank, not a promise to launch every activity. Each unit will be screened for demand, capital, margins, skills, licences and environmental impact before approval.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {sectors.map(({icon:Icon,title,hindi,items})=><article key={title} className="rounded-2xl border border-slate-200 bg-[#FBFCFE] p-6 transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-start gap-4"><div className="rounded-xl bg-[#EAF2EE] p-3 text-[#2d6a4f]"><Icon size={25}/></div><div><h3 className="text-lg font-extrabold text-[#002344]">{title}</h3><p className="mt-1 text-sm font-semibold text-[#2d6a4f]">{hindi}</p></div></div><ul className="mt-5 grid gap-2 sm:grid-cols-2">{items.map(item=><li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#fb8500]"/>{item}</li>)}</ul></article>)}
        </div>
      </div>
    </section>

    <section id="roadmap" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-16 md:px-8 md:py-20">
      <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">Implementation roadmap</p><h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">Start small. Prove. Reinvest. Expand.</h2><p className="mt-4 leading-7 text-slate-600">Indicative stages only; actual timing will depend on initial funding, customer orders, compliance and operational capacity.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {phases.map(p=><article key={p.n} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-3xl font-black text-[#fb8500]">{p.n}</span><span className="rounded-full bg-[#EAF2EE] px-3 py-1 text-xs font-bold text-[#2d6a4f]">{p.time}</span></div><h3 className="mt-4 text-xl font-extrabold text-[#002344]">{p.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{p.desc}</p><ul className="mt-4 space-y-2">{p.bullets.map(b=><li key={b} className="flex gap-2 text-sm leading-6 text-slate-700"><ClipboardCheck size={17} className="mt-1 shrink-0 text-[#2d6a4f]"/>{b}</li>)}</ul></article>)}
      </div>
      <div className="mt-8 rounded-2xl bg-[#002344] p-7 text-white md:p-9"><div className="flex items-start gap-4"><MapPin className="mt-1 shrink-0 text-[#ffb347]" size={28}/><div><h3 className="text-xl font-bold">Proposed first hub: Rewa, Madhya Pradesh</h3><p className="mt-2 max-w-3xl text-sm leading-7 text-white/75">A modest SSF Business & Production Centre may be developed in Rewa after checking premises, local demand, transport, utilities, working capital and permissions. It can later connect producer groups, workers, buyers and social programmes across districts.</p></div></div></div>
    </section>

    <section className="bg-[#EAF0F6] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">Operating principles</p><h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">Trust, transparency and legal compliance</h2></div><div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{principles.map(([t,d],i)=><div key={t} className="rounded-2xl bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><ShieldCheck className="text-[#2d6a4f]" size={22}/><h3 className="font-extrabold text-[#002344]">{t}</h3></div><p className="mt-3 text-sm leading-7 text-slate-600">{d}</p></div>)}</div></div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div><p className="text-xs font-black uppercase tracking-[.22em] text-[#2d6a4f]">Funding strategy</p><h2 className="mt-3 font-serif text-3xl font-bold text-[#002344] md:text-4xl">Funding the first viable unit</h2><p className="mt-4 leading-7 text-slate-600">The first funding proposal will be based on a specific product, buyer evidence, itemised project cost and realistic working-capital need—not an unsupported large funding request.</p><ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">{["Philanthropic support or equipment-in-kind for eligible purposes","Eligible MSME or bank finance after checking applicant and project eligibility","Customer purchase orders, advance bookings and institutional supply contracts","Partnerships with farmers, producer groups, SHGs and local manufacturers","CSR support only for separately approved charitable projects and permitted uses"].map(x=><li key={x} className="flex gap-3"><HeartHandshake className="mt-0.5 shrink-0 text-[#2d6a4f]" size={19}/>{x}</li>)}</ul></div>
        <div className="rounded-3xl bg-white p-7 shadow-md ring-1 ring-slate-200"><TrendingUp className="text-[#2d6a4f]" size={30}/><h3 className="mt-4 text-xl font-extrabold text-[#002344]">First-project selection test</h3><p className="mt-2 text-sm leading-6 text-slate-600">Every proposed unit will be scored before investment.</p><div className="mt-5 space-y-3">{["Low initial investment and limited fixed costs","Repeat demand and identifiable buyers","Healthy contribution margin after all costs","Simple operations and manageable compliance","Local employment and social value","Ability to scale without risking the Foundation"].map((x,i)=><div key={x} className="flex items-center gap-3 border-b border-slate-100 pb-3 text-sm font-semibold text-slate-700"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EAF2EE] text-xs font-black text-[#2d6a4f]">{i+1}</span>{x}</div>)}</div></div>
      </div>
    </section>

    <section className="bg-[#002344] px-5 py-16 text-center text-white md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl"><GraduationCap className="mx-auto text-[#ffb347]" size={38}/><h2 className="mt-5 font-serif text-3xl font-bold md:text-4xl">A stronger foundation for lasting social impact</h2><p className="mt-5 leading-8 text-white/75">We welcome responsible business mentors, technical experts, buyers, producer groups, equipment partners and supporters who can help build sustainable livelihoods and strengthen community service.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/Contact" className="inline-flex items-center gap-2 rounded-full bg-[#fb8500] px-6 py-3 font-bold text-[#17212b] hover:bg-[#ffad4d]">Connect with SSF <ArrowRight size={18}/></Link><Link to="/GetInvolved" className="rounded-full border border-white/35 px-6 py-3 font-bold hover:bg-white/10">Get involved</Link></div><p className="mt-8 text-xs leading-6 text-white/50">This page describes a proposed initiative and potential activities. It is not a claim that all listed units are currently operational, funded, licensed or accepting orders. Each activity will begin only after feasibility, approvals and compliance checks.</p></div>
    </section>
  </main>;
}
