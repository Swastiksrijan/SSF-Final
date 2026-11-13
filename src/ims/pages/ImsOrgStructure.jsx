import { Link } from '@tanstack/react-router';
import ImsLayout from '../ImsLayout';
import { PageHeader, Card } from '../ui';
import { Building2, Network, BriefcaseBusiness, ClipboardList, ShieldCheck, ArrowUpRight } from 'lucide-react';

const departments = [
  ['Education & Learning', 'शिक्षा, साक्षरता, डिजिटल शिक्षा और कौशल विकास।'],
  ['Health & Community Well-being', 'स्वास्थ्य जागरूकता, जनकल्याण और समुदाय आधारित सहयोग।'],
  ['Women, Child & Social Inclusion', 'महिला, बाल विकास, समान अवसर और वंचित समुदायों का सशक्तिकरण।'],
  ['Livelihood & Sustainable Development', 'आजीविका, कौशल, पर्यावरण-अनुकूल गतिविधियाँ और टिकाऊ विकास।'],
  ['Environment & Rural Development', 'पर्यावरण संरक्षण, ग्रामीण विकास और स्थानीय जरूरतों पर आधारित गतिविधियाँ।'],
  ['Administration, Finance & Compliance', 'कार्यालयीन समन्वय, वित्तीय अनुशासन, अभिलेख और वैधानिक अनुपालन।'],
  ['Communication & Public Engagement', 'जनसंपर्क, सूचना, मीडिया, साझेदारी और समुदाय से संवाद।'],
  ['Monitoring, Evaluation & Reporting', 'कार्य प्रगति, परिणाम, दस्तावेजीकरण और रिपोर्टिंग।'],
];

const levels = [
  ['National / Central', 'राष्ट्रीय / केंद्रीय समन्वय'],
  ['State', 'राज्य स्तरीय समन्वय'],
  ['District', 'जिला स्तरीय समन्वय'],
  ['Block', 'विकासखंड स्तरीय समन्वय'],
  ['Village / Ward', 'ग्राम / वार्ड स्तरीय समन्वय'],
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

export default function ImsOrgStructure() {
  return <ImsLayout active="org_structure">
    <PageHeader title="Internal Organisation Structure / आंतरिक संगठनात्मक व्यवस्था" subtitle="केवल अधिकृत Admin / IMS उपयोगकर्ताओं के लिए — यह संचालन-योजना है, नियमावली में वर्णित संवैधानिक निकायों का विकल्प नहीं।" />
    <Card className="mb-5 overflow-hidden border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 via-white to-white shadow-sm">
      <h2 className="font-bold text-slate-900">महत्वपूर्ण नियंत्रण / Governance safeguard</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">General Body और पंजीकृत नियमावली के अनुसार 9 सदस्यीय Managing Committee ही संवैधानिक ढाँचे का आधार हैं। नीचे दिए गए विभाग, प्रशासनिक पद और क्षेत्रीय स्तर केवल आवश्यकता के अनुसार समिति/सक्षम प्राधिकारी की लिखित स्वीकृति, नियुक्ति आदेश और उपलब्ध संसाधनों के बाद लागू होंगे। इन्हें स्वतः मतदान, समिति-सदस्यता या वित्तीय अधिकार प्राप्त नहीं होंगे।</p>
    </Card>
    <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[[Building2,"विभाग","Department Register","/ims/r/costCentres"],[Network,"क्षेत्रीय इकाइयाँ","Field Unit Register","/ims/r/chapters"],[BriefcaseBusiness,"दायित्व आवंटन","Role Assignments","/ims/r/chapterMembers"],[ClipboardList,"नियुक्ति आदेश","Appointment Records","/ims/appointment-letters"]].map(([Icon,hi,en,href]) => <Link key={href} to={href} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><Icon size={20}/></span><ArrowUpRight size={17} className="text-slate-400 transition group-hover:text-emerald-700"/></div><p className="mt-4 font-bold text-slate-900">{hi}</p><p className="mt-1 text-xs text-slate-500">{en}</p></Link>)}
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="mb-3 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-900"><BriefcaseBusiness size={20}/></span><div><h2 className="text-lg font-bold text-slate-900">प्रशासनिक जिम्मेदारियाँ / Operational roles</h2><p className="text-xs text-slate-500">आवश्यकता और स्वीकृति के अनुसार</p></div></div>
        <div className="mt-4 divide-y divide-slate-100">
          {roles.map(([a,b]) => <div key={a} className="py-3"><p className="font-semibold text-slate-800">{a}</p><p className="text-sm text-slate-500">{b}</p></div>)}
        </div>
      </Card>
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="mb-3 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><Network size={20}/></span><div><h2 className="text-lg font-bold text-slate-900">क्षेत्रीय समन्वय / Field coordination</h2><p className="text-xs text-slate-500">स्तरवार कार्य-समन्वय</p></div></div>
        <div className="mt-4 space-y-3">
          {levels.map(([a,b],i) => <div key={a} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#12345A] text-sm font-bold text-white">{i+1}</span><div><p className="font-semibold text-slate-800">{a}</p><p className="text-sm text-slate-500">{b}</p></div></div>)}
        </div>
      </Card>
    </div>
    <Card className="mt-5 overflow-hidden border border-slate-200 shadow-sm">
      <div className="mb-3 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-800"><Building2 size={20}/></span><div><h2 className="text-lg font-bold text-slate-900">विभाग एवं कार्यक्षेत्र / Departments</h2><p className="text-xs text-slate-500">प्रस्तावित विभागीय कार्यक्षेत्र — स्वीकृति के बाद सक्रिय करें</p></div></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {departments.map(([a,b]) => <div key={a} className="rounded-xl border border-slate-200 p-4"><p className="font-semibold text-slate-800">{a}</p><p className="mt-1 text-sm leading-6 text-slate-600">{b}</p></div>)}
      </div>
    </Card>
    <Card className="mt-5 overflow-hidden border border-slate-200 shadow-sm">
      <div className="mb-3 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-800"><ClipboardList size={20}/></span><div><h2 className="text-lg font-bold text-slate-900">आंतरिक रजिस्टर खोलें / Open operational registers</h2><p className="text-xs text-slate-500">सीधे संबंधित IMS रिकॉर्ड तक पहुँचें</p></div></div>
      <p className="mt-1 text-sm text-slate-600">नीचे के रजिस्टर मौजूदा IMS डेटाबेस से जुड़े हैं। वास्तविक रिकॉर्ड दर्ज करने के लिए संबंधित रजिस्टर खोलें।</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ['/ims/r/costCentres', 'विभाग एवं कार्यात्मक इकाइयाँ', 'Department / Cost Centre Register'],
          ['/ims/r/chapters', 'क्षेत्रीय इकाइयाँ', 'National / State / District / Block / Village / Ward'],
          ['/ims/r/chapterMembers', 'नियुक्तियाँ एवं दायित्व', 'Person-wise Unit Role Assignments'],
          ['/ims/r/persons', 'व्यक्ति मास्टर', 'Single Person Record'],
          ['/ims/r/committeeMembers', 'प्रबंध समिति सदस्य', 'Constitutional 9-member Committee'],
          ['/ims/appointment-letters', 'नियुक्ति पत्र', 'Issue and maintain appointment orders'],
        ].map(([href,hi,en]) => <Link key={href} to={href} className="rounded-xl border border-slate-200 p-4 transition hover:border-[#12345A] hover:bg-slate-50">
          <span className="block font-semibold text-[#12345A]">{hi}</span>
          <span className="mt-1 block text-xs text-slate-500">{en}</span>
          <span className="mt-3 block text-xs font-bold text-[#176447]">रजिस्टर खोलें →</span>
        </Link>)}
      </div>
    </Card>
    <Card className="mt-5 overflow-hidden border border-slate-200 shadow-sm">
      <div className="mb-3 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-800"><ShieldCheck size={20}/></span><div><h2 className="font-bold text-slate-900">नियुक्ति एवं नियंत्रण अभिलेख / Required internal records</h2><p className="text-xs text-slate-500">प्रत्येक नियुक्ति और इकाई के लिए जरूरी नियंत्रण</p></div></div>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
        <li>समिति/सक्षम प्राधिकारी का अनुमोदित प्रस्ताव और नियुक्ति आदेश।</li>
        <li>पद/भूमिका, कार्यक्षेत्र, रिपोर्टिंग अधिकारी, अधिकार-सीमा और कार्यकाल।</li>
        <li>संबंधित व्यक्ति की सहमति, पहचान/संपर्क विवरण और आवश्यक सत्यापन रिकॉर्ड।</li>
        <li>क्षेत्रीय इकाई के गठन, कार्य-क्षेत्र, समीक्षा और निष्क्रिय/समाप्ति का रिकॉर्ड।</li>
        <li>वित्तीय, बैंकिंग, अनुबंध या प्रतिनिधित्व अधिकार केवल अलग स्पष्ट लिखित प्राधिकरण से।</li>
      </ul>
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">यह स्क्रीन संरचनात्मक मार्गदर्शिका है; अभी किसी विभाग, पद या क्षेत्रीय इकाई के गठन/नियुक्ति की पुष्टि नहीं करती। वास्तविक रिकॉर्ड नियुक्ति, प्रस्ताव और समिति रजिस्टर में दर्ज करें।</p>
    </Card>
  </ImsLayout>;
}
