import { Link } from '@tanstack/react-router';
import ImsLayout from '../ImsLayout';
import { PageHeader, Card } from '../ui';
import { Building2, Network, BriefcaseBusiness, ClipboardList, ShieldCheck, ArrowUpRight, Users, Landmark, FileCheck2, Layers3, Wallet } from 'lucide-react';

const departments = [
  ['Education, Literacy & Educational Institutions','शिक्षा प्रमुख; प्राथमिक/माध्यमिक/उच्चतर/कॉलेज शिक्षा; तकनीकी व कंप्यूटर शिक्षा; नर्सिंग शिक्षा; वयस्क शिक्षा; पुस्तकालय; शिक्षक प्रशिक्षण; समावेशी शिक्षा; छात्र मार्गदर्शन/छात्रवृत्ति; स्कूल कार्यक्रम।'],
  ['Women Empowerment & Child Development','महिला सशक्तिकरण प्रमुख; बाल कल्याण; बालिका संरक्षण; महिला सुरक्षा; परिवार कल्याण; महिला स्वास्थ्य/पोषण; SHG; विधवा/निराश्रित महिला सहायता; बाल विकास केंद्र; महिला कौशल/स्वरोजगार।'],
  ['Health, Nutrition & Rehabilitation','स्वास्थ्य सेवा प्रमुख; जनस्वास्थ्य जागरूकता; पोषण/कुपोषण रोकथाम; HIV/AIDS जागरूकता/परामर्श; कैंसर जागरूकता; नशामुक्ति/पुनर्वास; प्राकृतिक चिकित्सा/योग; स्वास्थ्य शिविर; दिव्यांग पुनर्वास; मानसिक स्वास्थ्य/परामर्श।'],
  ['Social Welfare & Inclusive Development','सामाजिक कल्याण प्रमुख; गरीब/जरूरतमंद सहायता; वरिष्ठ नागरिक; अनाथ/निराश्रित; दिव्यांग समावेशन; वंचित/SC समुदाय; जनजातीय/वनवासी समुदाय; मलिन बस्ती; दूरस्थ/सीमावर्ती क्षेत्र; सामाजिक सुरक्षा योजनाएँ।'],
  ['Rural & Community Development','ग्रामीण विकास प्रमुख; ग्राम विकास कार्यक्रम; सामुदायिक सेवा केंद्र; ग्रामीण शिक्षा/स्वास्थ्य; ग्राम संस्थान संचालन; ग्रामीण आधारभूत संरचना; जनभागीदारी; ग्रामीण सरकारी योजनाएँ।'],
  ['Agriculture, Horticulture & Organic Farming','कृषि विकास प्रमुख; जैविक/प्राकृतिक खेती; बागवानी/फल उत्पादन; औषधीय पौधे; किसान प्रशिक्षण; खाद्य प्रसंस्करण/परिरक्षण; कृषि उपज विपणन; अनुसंधान/विस्तार।'],
  ['Animal Husbandry, Cow Protection & Animal Welfare','पशुपालन प्रमुख; गौ-संरक्षण; डेयरी; बकरी/भेड़ पालन; कुक्कुट/अन्य पशुधन; पशु कल्याण/संरक्षण; पशु चिकित्सा शिविर; पशु-पक्षी संरक्षण जागरूकता।'],
  ['Environment, Water & Natural Resources','पर्यावरण संरक्षण प्रमुख; वृक्षारोपण/वन संरक्षण; जल संरक्षण; जैव विविधता; प्राकृतिक संसाधन; वैकल्पिक/नवीकरणीय ऊर्जा; प्रदूषण जागरूकता; स्वच्छता/कचरा प्रबंधन।'],
  ['Skill Development, Employment & Village Industries','कौशल विकास प्रमुख; रोजगार/करियर मार्गदर्शन; स्वरोजगार; खादी/ग्रामोद्योग; लघु उद्योग/उद्यमिता; सिलाई/कढ़ाई; महिला उद्यमिता; युवा रोजगार; उत्पादन/विपणन; आजीविका/आय सृजन।'],
  ['Youth, Sports, Culture & Yoga','युवा विकास प्रमुख; खेल/शारीरिक शिक्षा; योग/प्राकृतिक विज्ञान; सांस्कृतिक कार्यक्रम; संगीत/कला; साहित्य/चर्चा मंच; युवा नेतृत्व; राष्ट्रीय दिवस/सामुदायिक आयोजन।'],
  ['Disaster Relief & Humanitarian Assistance','आपदा राहत प्रमुख; आपात सहायता; राहत सामग्री प्रबंधन; पुनर्वास/पुनर्निर्माण; स्वयंसेवी राहत दल।'],
  ['Organization, Membership & Volunteer Management','संगठन/सदस्यता प्रमुख; सदस्यता आवेदन; सदस्य रजिस्टर; स्वयंसेवक प्रबंधन; संगठन विस्तार; सदस्य प्रशिक्षण/परिचय; सामुदायिक संपर्क। सदस्यता स्वीकृति/समाप्ति नियमावली और सक्षम समिति के अनुसार।'],
  ['Project Planning, Implementation & Evaluation','परियोजना नियोजन प्रमुख; प्रस्ताव विकास; परियोजना क्रियान्वयन; निगरानी/मूल्यांकन; रिपोर्टिंग; परिणाम/प्रभाव आकलन; दस्तावेजीकरण; जोखिम प्रबंधन।'],
  ['CSR, Grants, Funding & Partnerships','CSR/कॉर्पोरेट साझेदारी प्रमुख; अनुदान/सरकारी योजनाएँ; दाता संबंध; संस्थागत साझेदारी; उद्योग/व्यापार संपर्क; परियोजना वित्तपोषण; संसाधन जुटाना; मशीन/उपकरण सहयोग; प्रायोजन।'],
  ['Finance, Accounts, Budget & Internal Controls','वित्त/लेखा समन्वय; बजट/व्यय नियंत्रण; बैंक/भुगतान रिकॉर्ड; दान/रसीद रजिस्टर; परियोजना लेखे; वेतन; संपत्ति/स्टॉक रजिस्टर; आंतरिक वित्तीय समीक्षा। कोषाध्यक्ष के अधीन; स्वतः बैंक अधिकार नहीं।'],
  ['Legal, Registration & Compliance','विधिक/अनुपालन समन्वय; पंजीयन दस्तावेज; आयकर; 12AB/80G; CSR-1; सरकारी विभाग संपर्क; अनुबंध; नीतियाँ/आंतरिक प्रक्रियाएँ। विधिक राय/ऑडिट/कर प्रमाणन योग्य पेशेवर से।'],
  ['Media, Communication & Public Relations','मीडिया/जनसंपर्क प्रमुख; प्रेस संपर्क; सोशल मीडिया; वेबसाइट सामग्री; प्रकाशन/प्रचार; फोटो/वीडियो दस्तावेजीकरण; जन-जागरूकता संचार।'],
  ['IT, Digital Office & MIS','आईटी/डिजिटल संचालन प्रमुख; वेबसाइट/पोर्टल; MIS/डेटा; डिजिटल अभिलेख; ऑनलाइन आवेदन/सदस्य सेवाएँ; साइबर सुरक्षा/डेटा गोपनीयता; डिजिटल प्रशिक्षण/तकनीकी सहायता।'],
  ['Human Resources & Personnel Management','मानव संसाधन समन्वय; भर्ती/कार्मिक रिकॉर्ड; कर्मचारी प्रशिक्षण; उपस्थिति/प्रदर्शन; वेतन/सेवा शर्तें; कर्मचारी कल्याण/शिकायत। नियुक्ति/भुगतान स्वीकृत बजट व श्रम कानून के अनुसार।'],
  ['Institutions, Centres & Office Operations','संस्था संचालन प्रमुख; स्कूल; प्रशिक्षण केंद्र; सेवा केंद्र; कार्यालय/सुविधा प्रबंधन; उपकरण/सामग्री; सुरक्षा/सुविधा प्रबंधन।'],
  ['Quality, Transparency & Grievance Redressal','गुणवत्ता/प्रदर्शन समीक्षा; आंतरिक प्रक्रिया निगरानी; शिकायत/सुझाव; पारदर्शिता/सूचना प्रबंधन; सामाजिक प्रभाव समीक्षा। वैधानिक ऑडिटर या समिति/साधारण सभा का विकल्प नहीं।'],
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

    
    <Card className="mb-6 border border-blue-200 bg-blue-50/60 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wider text-blue-800">पंजीकृत नाम का अभिलेखीय मिलान</p>
      <h2 className="mt-2 text-xl font-extrabold text-slate-900">स्वास्तिक सृजन फाउंडेशन समिति</h2>
    </Card>
    <Card className="mb-6 border border-emerald-200 bg-emerald-50/50 shadow-sm">
      <SectionTitle Icon={Landmark} title="संवैधानिक व्यवस्था — नियमावली के अनुसार" subtitle="संवैधानिक निकाय और पदों की सीमा" />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-4"><h3 className="font-bold">साधारण सभा (General Body)</h3><p className="mt-2 text-sm leading-6 text-slate-600">कम-से-कम एक वार्षिक बैठक; 15 दिन की सूचना; गणपूर्ति 3/5। नियम 11 के अनुसार वार्षिक प्रतिवेदन, बजट, लेखे, स्थायी निधि/संपत्ति व्यवस्था और लेखा परीक्षक की नियुक्ति पर विचार/अनुमोदन।</p></div>
        <div className="rounded-xl border bg-white p-4"><h3 className="font-bold">9 सदस्यीय प्रबंध समिति</h3><p className="mt-2 text-sm leading-6 text-slate-600">अध्यक्ष 1, उपाध्यक्ष 1, मंत्री 1, कोषाध्यक्ष 1, सह-मंत्री 1 और सदस्य 4। कार्यकाल 3 वर्ष; नई समिति बनने तक अधिकतम 6 माह की निरंतरता केवल पर्याप्त कारण और साधारण सभा की स्वीकृति से। मासिक बैठक, 7 दिन की सूचना और आधे सदस्यों की गणपूर्ति।</p></div>
      </div>
      <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900">National President / National General Secretary जैसे अतिरिक्त संवैधानिक पद नियमावली में नहीं हैं। विभागाध्यक्ष और क्षेत्रीय समन्वयक केवल लिखित स्वीकृत प्रशासनिक दायित्व होंगे, प्रबंध समिति का विकल्प नहीं।</p>
    </Card>
    <Card className="mb-6 border border-amber-200 bg-amber-50/50 shadow-sm">
      <SectionTitle Icon={Wallet} title="वित्तीय अधिकार एवं वैधानिक नियंत्रण" subtitle="विभागीय पद से बैंक या व्यय अधिकार स्वतः नहीं मिलता" />
      <ul className="space-y-2 text-sm leading-6 text-slate-700">
        <li>• बैंक निकासी: अध्यक्ष अथवा मंत्री/सचिव और कोषाध्यक्ष के संयुक्त हस्ताक्षर।</li>
        <li>• मंत्री/सचिव: नियम 17 के अनुसार एक कार्य पर ₹5,000 तक व्यय।</li>
        <li>• कोषाध्यक्ष: दैनिक खर्च हेतु अधिकतम ₹4,500 अपने पास रख सकता है; लेखे रखेगा और स्वीकृत व्यय करेगा।</li>
        <li>• सभी निधियाँ अनुसूचित बैंक/डाकघर में; विभागीय वित्त समन्वयक को स्वतः बैंक हस्ताक्षर/निकासी अधिकार नहीं।</li>
        <li>• साधारण सभा बजट/लेखे अनुमोदित और लेखा परीक्षक नियुक्त करती है; आंतरिक समीक्षा वैधानिक ऑडिट का विकल्प नहीं।</li>
        <li>• वार्षिक बैठक के 45 दिनों के भीतर नियम 21 के अनुसार प्रबंध समिति सूची और लेखा विवरण दाखिल। संशोधन हेतु 2/3 और विघटन हेतु 3/5 सदस्य समर्थन नियम 22–23 के अनुसार।</li>
      </ul>
      <p className="mt-3 text-xs leading-5 text-amber-950">नियम 14(च) और नियम 24 में संपत्ति के नाम/स्वामित्व की भाषा में अंतर है; इसे कानूनी सलाह से स्पष्ट करें। नियमावली का पता PIN 486001 है; दूसरे कर अभिलेख में अलग PIN का उल्लेख है—पते में बदलाव से पहले आधिकारिक अभिलेख मिलाएँ।</p>
    </Card>
    <Card className="mb-6 border border-slate-200 shadow-sm">
      <SectionTitle Icon={Users} title="सलाहकार परिषदें / Advisory Councils" subtitle="विशेषज्ञ सलाह हेतु प्रस्तावित, गैर-शासी व्यवस्था" />
      <p className="text-sm leading-6 text-slate-700">National Advisory Council; Education Advisory Board; Health Advisory Board; Agriculture & Environment Advisory Board; Finance & CSR Advisory Board; Legal Advisory Board; Technical Advisory Board; Youth Advisory Council; Women Advisory Council; Social Development Advisory Council.</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">सलाहकारों को स्वतः मतदान, प्रबंधकीय, बैंकिंग या वित्तीय अधिकार नहीं मिलेंगे।</p>
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
