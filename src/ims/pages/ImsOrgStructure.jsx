import { Link } from '@tanstack/react-router';
import ImsLayout from '../ImsLayout';
import { PageHeader, Card } from '../ui';
import { Building2, Network, BriefcaseBusiness, ClipboardList, ShieldCheck, ArrowUpRight, Users, Landmark, FileCheck2, Layers3 } from 'lucide-react';

const departments = [
  ['Education & Learning', 'शिक्षा, साक्षरता, डिजिटल शिक्षा और कौशल विकास।'],
  ['Health & Community Well-being', 'स्वास्थ्य जागरूकता, जनकल्याण और समुदाय आधारित सहयोग।'],
  ['Women, Child & Social Inclusion', 'महिला, बाल विकास, समान अवसर और सामाजिक समावेशन।'],
  ['Livelihood & Sustainable Development', 'आजीविका, कौशल, पर्यावरण-अनुकूल गतिविधियाँ और टिकाऊ विकास।'],
  ['Environment & Rural Development', 'पर्यावरण संरक्षण, ग्रामीण विकास और स्थानीय जरूरतों पर आधारित गतिविधियाँ।'],
  ['Administration, Finance & Compliance', 'कार्यालयीन समन्वय, वित्तीय अनुशासन, अभिलेख और वैधानिक अनुपालन।'],
  ['Communication & Partnerships', 'जनसंपर्क, सूचना, मीडिया, साझेदारी और समुदाय से संवाद।'],
  ['Monitoring, Evaluation & Reporting', 'कार्य प्रगति, परिणाम, दस्तावेजीकरण और रिपोर्टिंग।'],
];

const levels = [
  ['National / Central', 'राष्ट्रीय / केंद्रीय स्तर पर नीति, दिशा और समन्वय'],
  ['State', 'राज्य स्तरीय समन्वय एवं कार्यक्रम सहयोग'],
  ['District', 'जिला स्तरीय योजना, संपर्क और समीक्षा'],
  ['Block', 'विकासखंड स्तर पर गतिविधियों का समन्वय'],
  ['Village / Ward', 'ग्राम / वार्ड स्तर पर समुदाय से जुड़ाव'],
];

const roles = [
  ['Programme / Project Lead', 'कार्यक्रम एवं परियोजना संचालन'],
  ['State / District / Block Coordinator', 'क्षेत्रीय समन्वय'],
  ['Department Head / Coordinator', 'विभागीय कार्य-विभाजन'],
  ['Finance / Accounts Officer', 'वित्त एवं लेखा'],
  ['HR / Administration Officer', 'मानव संसाधन एवं प्रशासन'],
  ['CSR / Partnership Coordinator', 'CSR एवं संस्थागत साझेदारी'],
  ['Legal / Compliance Support', 'कानूनी एवं अनुपालन सहयोग'],
  ['Monitoring & Reporting Officer', 'निगरानी एवं प्रतिवेदन'],
];

const shortcuts = [
  ['/ims/r/committeeMembers', 'प्रबंध समिति सदस्य', 'Constitutional committee register', Users],
  ['/ims/r/persons', 'व्यक्ति मास्टर', 'एकीकृत व्यक्ति रिकॉर्ड', Users],
  ['/ims/r/costCentres', 'विभाग एवं कार्यात्मक इकाइयाँ', 'Department / Cost Centre Register', Building2],
  ['/ims/r/chapters', 'क्षेत्रीय इकाइयाँ', 'National to Village / Ward', Network],
  ['/ims/r/chapterMembers', 'दायित्व आवंटन', 'Person-wise role assignments', BriefcaseBusiness],
  ['/ims/appointment-letters', 'नियुक्ति आदेश', 'Appointment and authorization records', ClipboardList],
];

function SectionTitle({Icon,title,subtitle}) {
  return <div className="mb-5 flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#176447]"><Icon size={21}/></span><div><h2 className="text-lg font-extrabold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div></div>;
}

export default function ImsOrgStructure() {
  return <ImsLayout active="org_structure">
    <PageHeader title="Organisation & Governance / संगठन एवं प्रशासन" subtitle="संस्था की संवैधानिक व्यवस्था, प्रशासनिक कार्य-विभाजन और क्षेत्रीय संचालन का आंतरिक नियंत्रण केंद्र।" />
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      {[[Landmark,'संवैधानिक शासन','General Body एवं Managing Committee'],[Layers3,'प्रशासनिक व्यवस्था','विभाग, जिम्मेदारियाँ एवं क्षेत्रीय इकाइयाँ'],[FileCheck2,'नियंत्रण एवं अभिलेख','प्रस्ताव, नियुक्ति और अनुमोदन रिकॉर्ड']].map(([Icon,title,desc])=><div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><Icon size={20}/></span><h3 className="mt-3 font-bold text-slate-900">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p></div>)}
    </div>

    <Card className="mb-6 overflow-hidden border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white shadow-sm">
      <SectionTitle Icon={ShieldCheck} title="1. संवैधानिक व्यवस्था / Constitutional Governance" subtitle="पंजीकृत नियमावली और विधिवत स्वीकृत अभिलेख सर्वोपरि हैं" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-100 bg-white p-5"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">General Body</p><h3 className="mt-2 text-lg font-extrabold text-slate-900">साधारण सभा</h3><p className="mt-2 text-sm leading-6 text-slate-600">नियमावली में निर्धारित सदस्यता, अधिकार, बैठक, प्रस्ताव और अनुमोदन के अनुसार सर्वोच्च सामान्य निकाय।</p></div>
        <div className="rounded-xl border border-emerald-100 bg-white p-5"><p className="text-xs font-black uppercase tracking-wider text-emerald-700">Managing Committee</p><h3 className="mt-2 text-lg font-extrabold text-slate-900">9 सदस्यीय प्रबंध समिति</h3><p className="mt-2 text-sm leading-6 text-slate-600">नियमावली और वैध चुनाव/निर्वाचन/प्रस्ताव के अनुसार गठित समिति; सदस्य, पद और कार्यकाल के विवरण समिति रजिस्टर में प्रमाणित रिकॉर्ड के आधार पर रखें।</p></div>
      </div>
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>महत्वपूर्ण:</strong> नियमावली में दिए गए नाम, पद, अधिकार, प्रक्रिया और कार्यकाल ही मान्य होंगे। इस स्क्रीन पर किसी व्यक्ति की नियुक्ति, पदाधिकारी स्थिति, मतदान अधिकार या वित्तीय अधिकार स्वतः निर्मित नहीं होते। कोई बदलाव केवल सक्षम निकाय के विधिवत प्रस्ताव/अनुमोदन और रिकॉर्ड के बाद दर्ज करें।</div>
      <Link to="/ims/r/committeeMembers" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:underline">प्रबंध समिति रजिस्टर खोलें <ArrowUpRight size={16}/></Link>
    </Card>

    <Card className="mb-6 border border-slate-200 shadow-sm">
      <SectionTitle Icon={Layers3} title="2. प्रशासनिक एवं विभागीय व्यवस्था" subtitle="कार्य-आधारित इकाइयाँ — स्वीकृति और वास्तविक आवश्यकता के अनुसार सक्रिय हों" />
      <div className="grid gap-3 md:grid-cols-2">
        {departments.map(([name,desc],i)=><div key={name} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-xs font-black text-emerald-800 shadow-sm">{String(i+1).padStart(2,'0')}</span><div><h3 className="font-bold text-slate-800">{name}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{desc}</p></div></div>)}
      </div>
    </Card>

    <div className="mb-6 grid gap-6 xl:grid-cols-2">
      <Card className="border border-slate-200 shadow-sm">
        <SectionTitle Icon={BriefcaseBusiness} title="3. प्रशासनिक भूमिकाएँ" subtitle="उदाहरणात्मक कार्य-जिम्मेदारियाँ; स्वतः स्वीकृत पद नहीं" />
        <div className="divide-y divide-slate-100">{roles.map(([a,b])=><div key={a} className="py-3 first:pt-0 last:pb-0"><p className="font-semibold text-slate-800">{a}</p><p className="mt-1 text-sm text-slate-500">{b}</p></div>)}</div>
      </Card>
      <Card className="border border-slate-200 shadow-sm">
        <SectionTitle Icon={Network} title="4. क्षेत्रीय प्रशासनिक स्तर" subtitle="Head Office से स्थानीय इकाइयों तक प्रस्तावित संचालन क्रम" />
        <div className="space-y-2">{levels.map(([a,b],i)=><div key={a} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#12345A] text-sm font-bold text-white">{i+1}</span><div><p className="font-bold text-slate-800">{a}</p><p className="text-sm text-slate-500">{b}</p></div></div>)}</div>
      </Card>
    </div>

    <Card className="mb-6 border border-slate-200 shadow-sm">
      <SectionTitle Icon={ClipboardList} title="5. IMS रजिस्टर एवं प्रबंधन लिंक" subtitle="हर व्यक्ति, समिति, इकाई और नियुक्ति का रिकॉर्ड संबंधित रजिस्टर में रखें" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shortcuts.map(([href,hi,en,Icon])=><Link key={href} to={href} className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><Icon size={19}/></span><ArrowUpRight size={17} className="text-slate-400 group-hover:text-emerald-700"/></div><p className="mt-3 font-bold text-slate-900">{hi}</p><p className="mt-1 text-xs text-slate-500">{en}</p><span className="mt-3 block text-xs font-bold text-emerald-800">रजिस्टर खोलें →</span></Link>)}
      </div>
    </Card>

    <Card className="border border-amber-200 bg-amber-50/60 shadow-sm">
      <SectionTitle Icon={ShieldCheck} title="6. अनिवार्य नियंत्रण एवं अनुमोदन प्रक्रिया" subtitle="कोई पद, इकाई या अधिकार केवल लिखित स्वीकृति के बाद ही लागू माना जाए" />
      <ol className="grid gap-3 md:grid-cols-2">
        {[
          'नियमावली और लागू कानून के अनुरूप सक्षम निकाय की स्वीकृति/प्रस्ताव दर्ज करें।',
          'इकाई/विभाग का उद्देश्य, कार्यक्षेत्र, रिपोर्टिंग व्यवस्था और जिम्मेदार व्यक्ति स्पष्ट करें।',
          'नियुक्त व्यक्ति की सहमति, भूमिका, कार्यकाल और नियुक्ति आदेश संलग्न करें।',
          'वित्तीय, बैंकिंग, अनुबंध या संस्था का प्रतिनिधित्व करने के अधिकार अलग लिखित प्राधिकरण से दें।',
          'बैठक, निर्णय, समीक्षा, प्रगति और अनुपालन के दस्तावेज सुरक्षित रखें।',
          'इकाई/नियुक्ति में बदलाव, निलंबन या समाप्ति का रिकॉर्ड भी अपडेट करें।',
        ].map((item,i)=><li key={i} className="flex gap-3 rounded-xl border border-amber-200/70 bg-white p-4 text-sm leading-6 text-slate-700"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-black text-amber-900">{i+1}</span>{item}</li>)}
      </ol>
      <p className="mt-4 text-xs leading-5 text-amber-950">यह पेज आंतरिक मार्गदर्शिका है, स्वयं में कोई नियुक्ति आदेश, समिति प्रस्ताव या कानूनी संशोधन नहीं। सभी वास्तविक विवरण पंजीकृत नियमावली और प्रमाणित अभिलेखों से मिलान करके ही दर्ज करें।</p>
    </Card>
  </ImsLayout>;
}
