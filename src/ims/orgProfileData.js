// SSF Organisation Profile — single source of truth for the shareable PDF.
//
// This document is meant to be shared OUTSIDE the organisation: with CSR
// companies, government departments, institutional funders, donors and
// partners. It therefore never carries SSF-IMS / internal software branding,
// never exposes sensitive banking or internal identifiers, and never states a
// fact that is not already present in the verified institutional records.
//
// Everything here is drawn from the SSF website + the Institution Profile
// (ImsOrganisationProfile seed) so the document matches what IMS already shows.
// Fully bilingual: every label and value carries an English and a Hindi form.
//
// RULE: where a value is not verified/available, keep it blank or say
// "To be updated …" (hi: "अद्यतन किया जाना है …"). Never invent numbers.
import { CONTACT_INFO } from '../config/contact';

const P = { en: 'Swastik Srijan Foundation Samiti', hi: 'स्वस्तिक सृजन फाउंडेशन समिति' };
const T = (en, hi) => ({ en, hi });
const kv = (len, hen, lv, hv) => ({ l: T(len, hen), v: T(lv, hv) });

const UPD = (what_en, what_hi) => ({
  en: `To be updated from verified ${what_en}.`,
  hi: `सत्यापित ${what_hi} से अद्यतन किया जाना है।`,
});

export const PROFILE_DOC = {
  code: 'SSF/PROFILE/2026/V1',
  org: P,
  title: T('Organisation Profile', 'संस्था परिचय'),
  subtitle: T(
    'Institutional Profile for CSR • Government • Grants • Donors • Institutional Partnerships',
    'सीएसआर • शासकीय • अनुदान • दानदाता • संस्थागत साझेदारी हेतु संस्थागत परिचय',
  ),
  // Section index — used by the IMS page to list what the PDF contains and by
  // the generator to build the contents page.
  sections: [
    { id: 'about', en: 'About the Organisation', hi: 'संस्था परिचय' },
    { id: 'vision', en: 'Vision, Mission & Objectives', hi: 'दृष्टि, मिशन एवं उद्देश्य' },
    { id: 'programmes', en: 'Programmes & Initiatives', hi: 'कार्यक्रम एवं पहल' },
    { id: 'legal', en: 'Legal, Tax & Institutional Credentials', hi: 'कानूनी एवं संस्थागत विवरण' },
    { id: 'governance', en: 'Governance & Leadership', hi: 'शासन एवं नेतृत्व' },
    { id: 'finance', en: 'Financial Governance & Transparency', hi: 'वित्तीय पारदर्शिता' },
    { id: 'partnership', en: 'CSR & Partnership', hi: 'सीएसआर एवं साझेदारी' },
    { id: 'impact', en: 'Our Reach & Impact', hi: 'हमारी पहुँच एवं प्रभाव' },
    { id: 'transparency', en: 'Transparency & Accountability', hi: 'पारदर्शिता एवं जवाबदेही' },
    { id: 'contact', en: 'Contact & Presence', hi: 'संपर्क एवं उपस्थिति' },
    { id: 'declaration', en: 'Declaration', hi: 'घोषणा' },
  ],
};

// ---- rendering model (used only by the PDF generator) ----------------------
// Blocks: para | kv | cards | table | callout | bullets | links | signature
export const PROFILE_RENDER = {
  cover: {
    title: PROFILE_DOC.title,
    subtitle: PROFILE_DOC.subtitle,
    versionLabel: T('Version', 'संस्करण'),
    code: PROFILE_DOC.code,
  },
  sections: [
    // 1 ─────────────────────────────────────────────────────────────── ABOUT
    {
      id: 'about',
      en: 'About the Organisation', hi: 'संस्था परिचय',
      intro: T('Registered identity and profile of the Foundation.', 'संस्था की पंजीकृत पहचान एवं परिचय।'),
      blocks: [
        { type: 'kv', rows: [
          kv('Legal Name', 'कानूनी नाम', P.en, P.hi),
          kv('Short Name', 'संक्षिप्त नाम', 'SSF', 'एसएसएफ'),
          kv('Organisation Type', 'संस्था का प्रकार', 'Society (Registered)', 'सोसाइटी (पंजीकृत)'),
          kv('Registration Number', 'पंजीकरण संख्या', '05/22/03/11448/13', '05/22/03/11448/13'),
          kv('Registration Date', 'पंजीकरण दिनांक', '30-12-2013', '30-12-2013'),
          kv('Registration Act', 'पंजीकरण अधिनियम', 'Madhya Pradesh Societies Registration Act, 1973', 'मध्य प्रदेश सोसाइटी पंजीकरण अधिनियम, 1973'),
          kv('Operational Scope', 'कार्यक्षेत्र', 'Pan India', 'सम्पूर्ण भारत'),
          kv('Registered Office', 'पंजीकृत कार्यालय', 'Ward No. 1, Dadar, Post Rahat, District Rewa, MP 486446', 'वार्ड नं. 1, दादर, पोस्ट राहत, जिला रीवा, म.प्र. 486446'),
          kv('Operational Office', 'प्रचालन कार्यालय', CONTACT_INFO.address.operational, 'पुणे, महाराष्ट्र, भारत'),
          kv('Website', 'वेबसाइट', 'www.swastiksrijan.in', 'www.swastiksrijan.in'),
          kv('Official Email', 'आधिकारिक ईमेल', CONTACT_INFO.primaryEmail, CONTACT_INFO.primaryEmail),
          kv('Official Contact', 'आधिकारिक संपर्क', CONTACT_INFO.phones.primaryFormatted, CONTACT_INFO.phones.primaryFormatted),
        ] },
      ],
    },

    // 2 ─────────────────────────────────────────────────────── VISION / MISSION
    {
      id: 'vision',
      en: 'Vision, Mission & Objectives', hi: 'दृष्टि, मिशन एवं उद्देश्य',
      intro: T('What the Foundation stands for, and the areas it works in.', 'संस्था किसके लिए प्रतिबद्ध है एवं किन क्षेत्रों में कार्यरत है।'),
      blocks: [
        { type: 'para', label: T('Vision', 'दृष्टि'),
          text: T(
            'An inclusive, educated, healthy, self-reliant and harmonious society where every person can live with dignity, equal opportunity and the ability to participate in sustainable development.',
            'एक समावेशी, शिक्षित, स्वस्थ, आत्मनिर्भर एवं सामंजस्यपूर्ण समाज, जहाँ प्रत्येक व्यक्ति गरिमा, समान अवसर एवं सतत विकास में भागीदारी के साथ जीवन जी सके।') },
        { type: 'para', label: T('Mission', 'मिशन'),
          text: T(
            'To work across India for education, health and well-being, livelihood and self-reliance, women and child empowerment, rural development, environmental protection and social awareness through community participation, capacity building, lawful partnerships and transparent organisational practices.',
            'शिक्षा, स्वास्थ्य एवं कल्याण, आजीविका एवं आत्मनिर्भरता, महिला एवं बाल सशक्तिकरण, ग्रामीण विकास, पर्यावरण संरक्षण एवं सामाजिक जागरूकता के लिए सामुदायिक सहभागिता, क्षमता निर्माण, विधिसम्मत साझेदारी एवं पारदर्शी संस्थागत व्यवहार के माध्यम से सम्पूर्ण भारत में कार्य करना।') },
        { type: 'bullets', label: T('Core Values', 'मूल मूल्य'), items: [
          T('Humanity & Truth', 'मानवता एवं सत्य'),
          T('Equality & Dignity', 'समानता एवं गरिमा'),
          T('Social Harmony', 'सामाजिक समरसता'),
          T('Responsibility', 'उत्तरदायित्व'),
          T('Transparency', 'पारदर्शिता'),
          T('Community Participation', 'सामुदायिक सहभागिता'),
          T('Service with Integrity', 'सत्यनिष्ठा से सेवा'),
        ] },
        { type: 'bullets', label: T('Areas of Work', 'कार्यक्षेत्र'), items: [
          T('Education & Skill Development', 'शिक्षा एवं कौशल विकास'),
          T('Health, Nutrition & Wellness', 'स्वास्थ्य, पोषण एवं कल्याण'),
          T('Women & Child Welfare', 'महिला एवं बाल कल्याण'),
          T('Rural Development & Livelihood', 'ग्रामीण विकास एवं आजीविका'),
          T('Agriculture, Organic Farming & Animal Welfare', 'कृषि, जैविक खेती एवं पशु कल्याण'),
          T('Environment & Natural Resource Conservation', 'पर्यावरण एवं प्राकृतिक संसाधन संरक्षण'),
          T('Disability Support & Rehabilitation', 'दिव्यांग सहयोग एवं पुनर्वास'),
          T('Youth & Community Development', 'युवा एवं सामुदायिक विकास'),
          T('Social Awareness & Ethical Values', 'सामाजिक जागरूकता एवं नैतिक मूल्य'),
        ] },
        { type: 'bullets', label: T('Target Beneficiaries', 'लक्षित लाभार्थी'), items: [
          T('Children', 'बच्चे'),
          T('Women', 'महिलाएँ'),
          T('Elderly persons', 'वृद्धजन'),
          T('Persons with disabilities', 'दिव्यांगजन'),
          T('Farmers', 'किसान'),
          T('Rural and economically disadvantaged communities', 'ग्रामीण एवं आर्थिक रूप से वंचित समुदाय'),
          T('Tribal, remote and underserved communities', 'जनजातीय, दूरस्थ एवं अलाभित समुदाय'),
          T('Youth and families', 'युवा एवं परिवार'),
        ] },
      ],
    },

    // 3 ─────────────────────────────────────────────────────────── PROGRAMMES
    {
      id: 'programmes',
      en: 'Programmes & Initiatives', hi: 'कार्यक्रम एवं पहल',
      intro: T('Focus areas delivered through community participation. Status is as recorded.', 'सामुदायिक सहभागिता के माध्यम से संचालित कार्यक्षेत्र। स्थिति अभिलेखानुसार।'),
      blocks: [
        { type: 'cards', items: [
          { name: T('SSF Learning Hub', 'एसएसएफ लर्निंग हब'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Education & Skill Development', 'शिक्षा एवं कौशल विकास') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Community-driven online & offline education classes.', 'समुदाय-संचालित ऑनलाइन एवं ऑफलाइन शिक्षा कक्षाएँ।') },
              { l: T('Status', 'स्थिति'), v: T('Active', 'सक्रिय') },
              { l: T('Target group', 'लक्षित समूह'), v: T('Children and youth', 'बच्चे एवं युवा') },
            ] },
          { name: T('The SSF National Academy', 'एसएसएफ नेशनल अकादमी'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Education & Skill Development', 'शिक्षा एवं कौशल विकास') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Flagship knowledge hub for future leaders.', 'भावी नेताओं के लिए प्रमुख ज्ञान केंद्र।') },
              { l: T('Status', 'स्थिति'), v: T('Upcoming', 'प्रस्तावित') },
            ] },
          { name: T('Education for Underprivileged Children', 'वंचित बच्चों के लिए शिक्षा'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Education', 'शिक्षा') },
              { l: T('Purpose', 'उद्देश्य'), v: T('School fees, materials & digital learning support.', 'स्कूल फीस, सामग्री एवं डिजिटल शिक्षा सहयोग।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Health & Nutrition Initiative', 'स्वास्थ्य एवं पोषण पहल'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Health, Nutrition & Wellness', 'स्वास्थ्य, पोषण एवं कल्याण') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Free health camps, medicine distribution & nutrition kits.', 'नि:शुल्क स्वास्थ्य शिविर, दवा वितरण एवं पोषण किट।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Sports & Youth Development', 'खेल एवं युवा विकास'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Youth & Community Development', 'युवा एवं सामुदायिक विकास') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Fitness, leadership & professional coaching for rural youth.', 'ग्रामीण युवाओं के लिए फिटनेस, नेतृत्व एवं व्यावसायिक कोचिंग।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Women & Child Empowerment', 'महिला एवं बाल सशक्तिकरण'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Women & Child Welfare', 'महिला एवं बाल कल्याण') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Vocational training & protection programmes.', 'व्यावसायिक प्रशिक्षण एवं संरक्षण कार्यक्रम।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Environment & Sustainability', 'पर्यावरण एवं स्थिरता'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Environment & Sustainability', 'पर्यावरण एवं स्थिरता') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Tree plantation, waste management & clean energy awareness.', 'वृक्षारोपण, कचरा प्रबंधन एवं स्वच्छ ऊर्जा जागरूकता।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Animal & Bird Welfare', 'पशु एवं पक्षी कल्याण'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Agriculture & Animal Welfare', 'कृषि एवं पशु कल्याण') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Rescue of injured strays & wildlife protection awareness.', 'घायल पशुओं का उपचार एवं वन्यजीव संरक्षण जागरूकता।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Community Development', 'सामुदायिक विकास'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Rural Development', 'ग्रामीण विकास') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Infrastructure support & clean, self-reliant village campaigns.', 'अधोसंरचना सहयोग एवं स्वच्छ, आत्मनिर्भर गाँव अभियान।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
        ] },
      ],
    },

    // 4 ──────────────────────────────────────────────────────────────── LEGAL
    {
      id: 'legal',
      en: 'Legal, Tax & Institutional Credentials', hi: 'कानूनी एवं संस्थागत विवरण',
      intro: T('Registrations and recognitions, verifiable from official records and certificates.', 'आधिकारिक अभिलेखों एवं प्रमाणपत्रों से सत्यापनीय पंजीकरण एवं मान्यताएँ।'),
      blocks: [
        { type: 'table',
          columns: [T('Registration / ID', 'पंजीकरण / आईडी'), T('Number', 'संख्या'), T('Status / Validity', 'स्थिति / वैधता')],
          rows: [
            [T('Society Registration', 'सोसाइटी पंजीकरण'), T('05/22/03/11448/13', '05/22/03/11448/13'), T('Registered · 30-12-2013 · MP Societies Registration Act, 1973', 'पंजीकृत · 30-12-2013 · म.प्र. सोसाइटी पंजीकरण अधिनियम, 1973')],
            [T('PAN', 'पैन'), T('AAKAS7123H', 'AAKAS7123H'), T('Available', 'उपलब्ध')],
            [T('12AB Registration', '12AB पंजीकरण'), T('AAKAS7123H25BP01', 'AAKAS7123H25BP01'), T('Registered · dates to be updated from certificate', 'पंजीकृत · दिनांक प्रमाणपत्र से अद्यतन किया जाना है')],
            [T('80G Registration', '80G पंजीकरण'), T('AAKAS7123HF20231', 'AAKAS7123HF20231'), T('Provisional / final status to be updated from current certificate or order', 'प्रावधिक / अंतिम स्थिति वर्तमान प्रमाणपत्र या आदेश से अद्यतन किया जाना है')],
            [T('NGO Darpan ID', 'एनजीओ दर्पण आईडी'), T('MP/2017/0169529', 'MP/2017/0169529'), T('Active', 'सक्रिय')],
            [T('CSR-1 Registration (MCA)', 'सीएसआर-1 पंजीकरण (एमसीए)'), T('CSR00093974', 'CSR00093974'), T('Registered', 'पंजीकृत')],
            [T('MSME / Udyam', 'एमएसएमई / उद्यम'), T('UDYAM-MP-38-0042763', 'UDYAM-MP-38-0042763'), T('Registered · Micro (Services)', 'पंजीकृत · सूक्ष्म (सेवाएँ)')],
            [T('EPFO', 'ईपीएफओ'), T('MPJBP3643700000', 'MPJBP3643700000'), T('Registered', 'पंजीकृत')],
            [T('ESIC', 'ईएसआईसी'), T('81000588360001399', '81000588360001399'), T('Registered', 'पंजीकृत')],
            [T('Digital India Registration', 'डिजिटल इंडिया पंजीकरण'), T('REG2025070722444819', 'REG2025070722444819'), T('Registered', 'पंजीकृत')],
            [T('NCS Employer / Organisation ID', 'एनसीएस नियोक्ता / संस्था आईडी'), T('F7900E570628 / P20G74-0022474929830', 'F7900E570628 / P20G74-0022474929830'), T('Registered', 'पंजीकृत')],
            [T('MP Jan Abhiyan Parishad', 'म.प्र. जन अभियान परिषद'), T('NV2022REW0004', 'NV2022REW0004'), T('Registered', 'पंजीकृत')],
            [T('Startup Registration', 'स्टार्टअप पंजीकरण'), T('OI-0825-9266HS', 'OI-0825-9266HS'), T('Registered', 'पंजीकृत')],
          ],
          note: UPD('certificates and orders', 'प्रमाणपत्रों एवं आदेशों'),
        },
      ],
    },

    // 5 ─────────────────────────────────────────────────────────── GOVERNANCE
    {
      id: 'governance',
      en: 'Governance & Leadership', hi: 'शासन एवं नेतृत्व',
      intro: T('Governing body as per the registered Niyamavali (Rules & Regulations). Tenure and resolution references are shown only where recorded.', 'पंजीकृत नियमावली के अनुसार कार्यकारी मंडल। कार्यकाल एवं संकल्प संदर्भ केवल जहाँ अभिलिखित हैं वहीं दर्शाए गए हैं।'),
      blocks: [
        { type: 'table',
          columns: [T('Position', 'पद'), T('Name', 'नाम'), T('Tenure / Reference', 'कार्यकाल / संदर्भ')],
          rows: [
            [T('President', 'अध्यक्ष'), T('Ramesh Pandey', 'रमेश पाण्डेय'), T('To be updated from resolution', 'संकल्प से अद्यतन किया जाना है')],
            [T('Vice President', 'उपाध्यक्ष'), T('Preeti Shukla', 'प्रीति शुक्ला'), T('To be updated from resolution', 'संकल्प से अद्यतन किया जाना है')],
            [T('Secretary', 'सचिव'), T('Amit Kumar Pandey', 'अमित कुमार पाण्डेय'), T('To be updated from resolution', 'संकल्प से अद्यतन किया जाना है')],
            [T('Joint Secretary', 'सह-सचिव'), T('Kiran Pandey', 'किरण पाण्डेय'), T('To be updated from resolution', 'संकल्प से अद्यतन किया जाना है')],
            [T('Treasurer', 'कोषाध्यक्ष'), T('Divya Sharma', 'दिव्या शर्मा'), T('To be updated from resolution', 'संकल्प से अद्यतन किया जाना है')],
            [T('Governing Body Members', 'कार्यकारी मंडल सदस्य'), T('Sandeep Tripathi; Prameesh Singh; Rishi Kumar Pandey; Ritesh Kumar Tiwari', 'सन्दीप त्रिपाठी; प्रमीश सिंह; ऋषि कुमार पाण्डेय; रितेश कुमार तिवारी'), T('To be updated from resolution', 'संकल्प से अद्यतन किया जाना है')],
          ],
        },
      ],
    },

    // 6 ────────────────────────────────────────────────────────────── FINANCE
    {
      id: 'finance',
      en: 'Financial Governance & Transparency', hi: 'वित्तीय पारदर्शिता',
      intro: T('Institutional financial information. Sensitive banking identifiers are masked in this public profile.', 'संस्थागत वित्तीय जानकारी। इस सार्वजनिक परिचय में संवेदनशील बैंकिंग विवरण छिपाए गए हैं।'),
      blocks: [
        { type: 'kv', rows: [
          kv('Financial Year', 'वित्तीय वर्ष', '2025-26', '2025-26'),
          kv('Books of Accounts', 'बहीखाता', 'Audited accounts and supporting records maintained and available.', 'लेखा-परीक्षित खाते एवं सहायक अभिलेख संधारित एवं उपलब्ध।'),
          kv('Auditor / CA', 'लेखा परीक्षक / सीए', 'CA Kapil Tiwari', 'सीए कपिल तिवारी'),
          kv('Audited Accounts', 'लेखा-परीक्षित खाते', 'Available on request for institutional due diligence.', 'संस्थागत जाँच हेतु अनुरोध पर उपलब्ध।'),
        ] },
        { type: 'callout', label: T('Banking (masked)', 'बैंकिंग (छिपा हुआ)'),
          text: T(
            'Bank: Union Bank of India · Branch: Transport Nagar, Rewa. Full account and payment details are shared only for authorised due diligence, on request.',
            'बैंक: यूनियन बैंक ऑफ इंडिया · शाखा: ट्रांसपोर्ट नगर, रीवा। पूर्ण खाता एवं भुगतान विवरण केवल अधिकृत जाँच हेतु, अनुरोध पर साझा किए जाते हैं।') },
      ],
    },

    // 7 ────────────────────────────────────────────────────────── PARTNERSHIP
    {
      id: 'partnership',
      en: 'CSR & Partnership', hi: 'सीएसआर एवं साझेदारी',
      intro: T('Why institutions partner with SSF, and the areas open to lawful partnership.', 'संस्थाएँ एसएसएफ से क्यों जुड़ती हैं, एवं विधिसम्मत साझेदारी हेतु उपलब्ध क्षेत्र।'),
      blocks: [
        { type: 'bullets', label: T('Why Partner with SSF', 'एसएसएफ से क्यों जुड़ें'), items: [
          T('Registered institutional identity', 'पंजीकृत संस्थागत पहचान'),
          T('Clearly defined social-development focus areas', 'स्पष्ट रूप से परिभाषित सामाजिक विकास कार्यक्षेत्र'),
          T('Community-oriented programmes', 'समुदाय-केंद्रित कार्यक्रम'),
          T('Governance and accountability', 'शासन एवं जवाबदेही'),
          T('Documented financial records', 'प्रलेखित वित्तीय अभिलेख'),
          T('Compliance-oriented approach', 'अनुपालन-उन्मुख दृष्टिकोण'),
          T('Transparent reporting', 'पारदर्शी रिपोर्टिंग'),
          T('Institutional partnership readiness', 'संस्थागत साझेदारी हेतु तैयारी'),
        ] },
        { type: 'bullets', label: T('Partnership Opportunities', 'साझेदारी के अवसर'), items: [
          T('CSR Partnership', 'सीएसआर साझेदारी'),
          T('Government Programme Partnership', 'शासकीय कार्यक्रम साझेदारी'),
          T('Institutional Grants', 'संस्थागत अनुदान'),
          T('Community Development Projects', 'सामुदायिक विकास परियोजनाएँ'),
          T('Education & Skill Development', 'शिक्षा एवं कौशल विकास'),
          T('Health & Nutrition', 'स्वास्थ्य एवं पोषण'),
          T('Women & Child Development', 'महिला एवं बाल विकास'),
          T('Rural Development & Livelihood', 'ग्रामीण विकास एवं आजीविका'),
          T('Environment & Sustainability', 'पर्यावरण एवं स्थिरता'),
          T('Other lawful activities aligned with the registered objectives', 'पंजीकृत उद्देश्यों के अनुरूप अन्य विधिसम्मत गतिविधियाँ'),
        ] },
        { type: 'callout', tone: 'accent',
          text: T(
            'We welcome lawful, transparent and objective-aligned partnerships. For partnership or CSR enquiries, please contact the Secretary.',
            'हम विधिसम्मत, पारदर्शी एवं उद्देश्य-अनुरूप साझेदारी का स्वागत करते हैं। साझेदारी या सीएसआर संबंधी पूछताछ हेतु कृपया सचिव से संपर्क करें।') },
      ],
    },

    // 8 ─────────────────────────────────────────────────────────────── IMPACT
    {
      id: 'impact',
      en: 'Our Reach & Impact', hi: 'हमारी पहुँच एवं प्रभाव',
      intro: T('Programme reach and impact figures are published only from verified programme records.', 'कार्यक्रम पहुँच एवं प्रभाव के आँकड़े केवल सत्यापित कार्यक्रम अभिलेखों से प्रकाशित किए जाते हैं।'),
      blocks: [
        { type: 'callout', tone: 'muted',
          text: T(
            'Programme Reach & Impact Data — to be updated from verified programme records. No estimates are shown.',
            'कार्यक्रम पहुँच एवं प्रभाव डेटा — सत्यापित कार्यक्रम अभिलेखों से अद्यतन किया जाना है। कोई अनुमान नहीं दर्शाया गया।') },
      ],
    },

    // 9 ───────────────────────────────────────────────────────── TRANSPARENCY
    {
      id: 'transparency',
      en: 'Transparency & Accountability', hi: 'पारदर्शिता एवं जवाबदेही',
      intro: T('How the Foundation documents and reports its work.', 'संस्था अपने कार्य का अभिलेखन एवं रिपोर्टिंग कैसे करती है।'),
      blocks: [
        { type: 'para',
          text: T(
            'Swastik Srijan Foundation Samiti maintains documented records relating to governance, programmes, finances and statutory/compliance matters, subject to applicable requirements and periodic updating.',
            'स्वस्तिक सृजन फाउंडेशन समिति शासन, कार्यक्रम, वित्त एवं सांविधिक/अनुपालन संबंधी प्रलेखित अभिलेख संधारित करती है, जो प्रचलित अपेक्षाओं एवं आवधिक अद्यतन के अधीन हैं।') },
      ],
    },

    // 10 ────────────────────────────────────────────────────────────── CONTACT
    {
      id: 'contact',
      en: 'Contact & Presence', hi: 'संपर्क एवं उपस्थिति',
      intro: T('Reach the Foundation and follow its work.', 'संस्था से जुड़ें एवं उसके कार्य से जुड़े रहें।'),
      blocks: [
        { type: 'kv', rows: [
          kv('Registered Office', 'पंजीकृत कार्यालय', CONTACT_INFO.address.fullRegistered, 'वार्ड नं. 1, दादर, पोस्ट राहत, जिला रीवा, पिन 48446, मध्य प्रदेश, भारत'),
          kv('Official Email', 'आधिकारिक ईमेल', CONTACT_INFO.primaryEmail, CONTACT_INFO.primaryEmail),
          kv('Phone', 'दूरभाष', `${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.phones.secondaryFormatted}`, `${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.phones.secondaryFormatted}`),
          kv('Website', 'वेबसाइट', 'www.swastiksrijan.in', 'www.swastiksrijan.in'),
        ] },
        { type: 'links', label: T('Official Social Media', 'आधिकारिक सोशल मीडिया'), links: [
          { label: 'Facebook', url: CONTACT_INFO.social.facebook },
          { label: 'Instagram', url: CONTACT_INFO.social.instagram },
          { label: 'LinkedIn', url: CONTACT_INFO.social.linkedin },
          { label: 'X (Twitter)', url: CONTACT_INFO.social.twitter },
          { label: 'Telegram', url: CONTACT_INFO.social.telegram },
          { label: 'YouTube', url: CONTACT_INFO.social.youtube },
          { label: 'WhatsApp Channel', url: CONTACT_INFO.social.whatsappChannel },
        ] },
      ],
    },

    // 11 ──────────────────────────────────────────────────────── DECLARATION
    {
      id: 'declaration',
      en: 'Declaration', hi: 'घोषणा',
      intro: T('Statement of the issuing authority.', 'जारीकर्ता प्राधिकरण का कथन।'),
      blocks: [
        { type: 'para',
          text: T(
            'The information presented in this profile is based on the official records and documents maintained by Swastik Srijan Foundation Samiti and is subject to periodic update. Supporting registration, statutory, financial and institutional documents may be provided for due diligence where appropriate.',
            'इस परिचय में प्रस्तुत जानकारी स्वस्तिक सृजन फाउंडेशन समिति द्वारा संधारित आधिकारिक अभिलेखों एवं दस्तावेज़ों पर आधारित है और आवधिक अद्यतन के अधीन है। उपयुक्त होने पर सहायक पंजीकरण, सांविधिक, वित्तीय एवं संस्थागत दस्तावेज़ जाँच हेतु उपलब्ध कराए जा सकते हैं।') },
        { type: 'signature',
          issuedLabel: T('Issued by', 'जारीकर्ता'),
          issuedByEn: 'Secretary', issuedByHi: 'सचिव',
          orgEn: P.en, orgHi: P.hi,
          dateLabel: T('Date', 'दिनांक'),
          placeLabel: T('Place', 'स्थान'),
          sealLabel: T('Authorised Signatory / Official Seal', 'अधिकृत हस्ताक्षरकर्ता / आधिकारिक मुहर'),
        },
      ],
    },
  ],

  closing: {
    statement: T(
      'Working towards an inclusive, educated, healthy, self-reliant and harmonious society.',
      'एक समावेशी, शिक्षित, स्वस्थ, आत्मनिर्भर एवं सामंजस्यपूर्ण समाज की ओर।'),
    audience: T(
      'For Institutional Partnerships, CSR, Grants & Government Collaboration',
      'संस्थागत साझेदारी, सीएसआर, अनुदान एवं शासकीय सहयोग हेतु'),
    signatoryCaption: T('Authorised Signatory', 'अधिकृत हस्ताक्षरकर्ता'),
    nameLabel: T('Name', 'नाम'),
    designationLabel: T('Designation', 'पद'),
    dateLabel: T('Date', 'दिनांक'),
    placeLabel: T('Place', 'स्थान'),
    sealLabel: T('Official Seal', 'आधिकारिक मुहर'),
  },
};

export default PROFILE_DOC;