// SSF Organisation Profile — single source of truth for the shareable PDF.
//
// This document is shared OUTSIDE the organisation: with CSR companies,
// government departments, institutional funders, donors and due-diligence
// teams. It therefore never carries SSF-IMS / internal software branding,
// never exposes sensitive banking or internal identifiers, never asserts a
// false office location, and never states a fact that is not already present
// in the verified institutional records (ImsOrganisationProfile seed).
//
// Fully bilingual: every label and value carries an English and a Hindi form.
// Where a value is genuinely unavailable, the document OMITS the field or uses
// a professional availability statement — never a "to be updated" filler and
// never an invented number.
import { CONTACT_INFO } from '../config/contact';

const P = { en: 'Swastik Srijan Foundation Samiti', hi: 'स्वस्तिक सृजन फाउंडेशन समिति' };
const T = (en, hi) => ({ en, hi });
const kv = (len, hen, lv, hv) => ({ l: T(len, hen), v: T(lv, hv) });

// Real SSF programme photographs (served from /public/images/real — the same
// images the website shows). Captions stay factual: they name the activity,
// not a beneficiary count or outcome.
const PHOTO = (src, capEn, capHi) => ({ src, caption: T(capEn, capHi) });
const GALLERY = [
  PHOTO('/images/real/education_girls.jpg', 'Education & Learning Support', 'शिक्षा एवं अध्ययन सहयोग'),
  PHOTO('/images/real/nutrition_program.jpg', 'Health & Nutrition Programme', 'स्वास्थ्य एवं पोषण कार्यक्रम'),
  PHOTO('/images/real/computer-donation-final.png', 'Digital & Computer Education', 'डिजिटल एवं कंप्यूटर शिक्षा'),
  PHOTO('/images/real/women_empowerment_tailoring.jpg', 'Women Empowerment & Skill Training', 'महिला सशक्तिकरण एवं कौशल प्रशिक्षण'),
  PHOTO('/images/real/tree_plantation.jpg', 'Environment & Tree Plantation', 'पर्यावरण एवं वृक्षारोपण'),
  PHOTO('/images/real/cow-rescue.jpg', 'Animal & Bird Welfare', 'पशु एवं पक्षी कल्याण'),
  PHOTO('/images/real/scholarship_distribution.jpg', 'Scholarship Distribution', 'छात्रवृत्ति वितरण'),
  PHOTO('/images/real/cricket-child.jpg', 'Sports & Youth Development', 'खेल एवं युवा विकास'),
  PHOTO('/images/real/village-community-center.jpg', 'Village & Community Outreach', 'ग्रामीण एवं सामुदायिक पहुँच'),
];

// Public documents the Foundation already publishes on its Transparency page.
// Each entry maps to ONE specific document only — never a fallback URL, so a
// reader is never sent to the wrong document.
const PUB_DOCS = [
  { name: T('Registration Certificate', 'पंजीकरण प्रमाणपत्र'), tag: T('Registered · 2013', 'पंजीकृत · 2013'), url: 'https://drive.google.com/file/d/1mvFn14TYtG-tiiE5_spHrUClTls1-Ii-/view?usp=sharing' },
  { name: T('12AB Registration', '12AB पंजीकरण'), tag: T('Registered', 'पंजीकृत'), url: 'https://drive.google.com/file/d/1MVtgKePT2WNTSrF1vrjrDIdrCZ6HaNrS/view?usp=drivesdk' },
  { name: T('80G Approval', '80G अनुमोदन'), tag: T('Registered', 'पंजीकृत'), url: 'https://drive.google.com/file/d/1uUAQuXCkz6H_sEJGgDvSx2Gj_PsIIVvB/view?usp=drivesdk' },
  { name: T('CSR-1 Registration (MCA)', 'सीएसआर-1 पंजीकरण (एमसीए)'), tag: T('Registered', 'पंजीकृत'), url: 'https://drive.google.com/file/d/1LdL8_IC3K6f4ZEddb68ki_393QkIBvcX/view?usp=drivesdk' },
  { name: T('NGO Darpan', 'एनजीओ दर्पण'), tag: T('Active', 'सक्रिय'), url: 'https://drive.google.com/file/d/15OX155DuYsymGQmEKCcoux1FGES_DSLH/view?usp=sharing' },
  { name: T('Audited Accounts', 'लेखा-परीक्षित खाते'), tag: T('Audit records', 'लेखा परीक्षण अभिलेख'), url: 'https://drive.google.com/file/d/1ka7G73eU1SamorxUJivAJKldnOuNIdZU/view?usp=sharing' },
  { name: T('PAN Verification', 'पैन सत्यापन'), tag: T('Verified', 'सत्यापित'), url: 'https://drive.google.com/file/d/1RkC1uHQRBSBqTbUv_H20Ri0sgcQ2zlmT/view?usp=sharing' },
];

// Year-wise annual (progress) reports. Each year links ONLY to its own report.
const ANNUAL_REPORTS = [
  ['2013–14', 'https://drive.google.com/file/d/1dRT8fkKgxHhPdiiiHmz8DA0ZSUYWTDDi/view?usp=drivesdk'],
  ['2014–15', 'https://drive.google.com/file/d/1D1Ak2S__z4yrZQ4ctR0qczBHdJtBcGkm/view?usp=drivesdk'],
  ['2015–16', 'https://drive.google.com/file/d/1JxbRRc3v-LAy-iBeDVO11nPuYmedy_76/view?usp=drivesdk'],
  ['2016–17', 'https://drive.google.com/file/d/1A75HkUwGyTAUzS2IrtJgv3zByw6OyrKK/view?usp=drivesdk'],
  ['2017–18', 'https://drive.google.com/file/d/1JlFCdN7dGRLAK3NXZa1WlaRV6PBRjSaJ/view?usp=drivesdk'],
  ['2018–19', 'https://drive.google.com/file/d/1u_ewjd6MUhARR_g35PRCQQX12TpmZd_F/view?usp=drivesdk'],
  ['2019–20', 'https://drive.google.com/file/d/1ogaIch6vpZXL7SDGRYokdm0ARdzif5Od/view?usp=drivesdk'],
  ['2020–21', 'https://drive.google.com/file/d/1osL_PaieAjLxLPK9lX52aNj4Gk51jgBg/view?usp=drivesdk'],
  ['2021–22', 'https://drive.google.com/file/d/1FolHQb41PjtJDbbJxDK4tz8xgEgh2744/view?usp=drivesdk'],
  ['2022–23', 'https://drive.google.com/file/d/19aC8NZ0q0-yjUxhOgJLzQFES7IIrh4tq/view?usp=drivesdk'],
  ['2023–24', 'https://drive.google.com/file/d/18U4BtmY2N7nBC7mVUZ__UEzit1Lx2kUA/view?usp=drivesdk'],
  ['2024–25', 'https://drive.google.com/file/d/1CymtYEy3BiUOpUn-enpIqyrsMbqunkRm/view?usp=drivesdk'],
  ['2025–26', 'https://drive.google.com/file/d/1tftxk1SfpHwMSifNUhnxeenw7dfizjDW/view?usp=drivesdk'],
].map(([year, url]) => ({ year, url }));

export const PROFILE_DOC = {
  code: 'SSF/PROFILE/2026/V1',
  org: P,
  title: T('Organisation Profile', 'संस्था परिचय'),
  subtitle: T(
    'Institutional Profile for CSR • Government • Grants • Donors • Institutional Partnerships',
    'सीएसआर • शासकीय • अनुदान • दानदाता • संस्थागत साझेदारी हेतु संस्थागत परिचय',
  ),
  // Section index — used by the IMS page to list what the PDF contains. Kept in
  // sync with PROFILE_RENDER.sections.
  sections: [
    { id: 'glance', en: 'At a Glance', hi: 'एक नज़र में' },
    { id: 'identity', en: 'Organisation Identity', hi: 'संस्थागत पहचान' },
    { id: 'about', en: 'About the Organisation', hi: 'संस्था परिचय' },
    { id: 'vision', en: 'Vision, Mission & Core Values', hi: 'दृष्टि, मिशन एवं मूल्य' },
    { id: 'work', en: 'Areas of Work', hi: 'कार्यक्षेत्र' },
    { id: 'programmes', en: 'Programmes & Initiatives', hi: 'कार्यक्रम एवं पहल' },
    { id: 'legal', en: 'Legal & Institutional Credentials', hi: 'वैधानिक एवं संस्थागत प्रमाणिकताएँ' },
    { id: 'governance', en: 'Governance & Leadership', hi: 'शासन एवं नेतृत्व' },
    { id: 'finance', en: 'Financial Governance & Transparency', hi: 'वित्तीय पारदर्शिता एवं उत्तरदायित्व' },
    { id: 'partnership', en: 'Why Partner with SSF', hi: 'एसएसएफ के साथ क्यों जुड़ें' },
    { id: 'opportunities', en: 'Partnership Opportunities', hi: 'साझेदारी के अवसर' },
    { id: 'transparency', en: 'Transparency & Public Documents', hi: 'पारदर्शिता एवं सार्वजनिक दस्तावेज़' },
    { id: 'reports', en: 'Annual Reports', hi: 'वार्षिक प्रतिवेदन' },
    { id: 'contact', en: 'Contact & Presence', hi: 'संपर्क एवं उपस्थिति' },
    { id: 'declaration', en: 'Declaration', hi: 'घोषणा' },
  ],
};

// ---- rendering model (used only by the PDF generator) ----------------------
// Blocks: para | kv | cards | table | callout | bullets | links | facts | gallery | years | docCards
export const PROFILE_RENDER = {
  cover: {
    title: PROFILE_DOC.title,
    subtitle: PROFILE_DOC.subtitle,
    docIdLabel: T('Document ID', 'दस्तावेज़ आईडी'),
    code: PROFILE_DOC.code,
    issuedLabel: T('Issued', 'जारी'),
    issued: '2026',
  },
  sections: [
    // 1 ──────────────────────────────────────────────────────────── AT A GLANCE
    {
      id: 'glance',
      en: 'At a Glance', hi: 'एक नज़र में',
      blocks: [
        { type: 'facts', items: [
          { value: T('2013', '2013'), label: T('Established', 'स्थापना') },
          { value: T('Registered Society', 'पंजीकृत सोसाइटी'), label: T('Organisation Type', 'संस्था का प्रकार') },
          { value: T('Rewa, MP', 'रीवा, म.प्र.'), label: T('Registered Office', 'पंजीकृत कार्यालय') },
          { value: T('Pan India', 'सम्पूर्ण भारत'), label: T('Operational Scope', 'कार्यक्षेत्र') },
          { value: T('MP Societies Act, 1973', 'म.प्र. सोसाइटी अधिनियम, 1973'), label: T('Registration Act', 'पंजीकरण अधिनियम') },
          { value: T('Regn. 05/22/03/11448/13', 'पंजी. 05/22/03/11448/13'), label: T('Registration No.', 'पंजीकरण सं.') },
        ] },
      ],
    },

    // 2 ────────────────────────────────────────────────────── ORGANISATION IDENTITY
    {
      id: 'identity',
      en: 'Organisation Identity', hi: 'संस्थागत पहचान',
      intro: T('Verified institutional identity as per official records.', 'आधिकारिक अभिलेखों के अनुसार सत्यापित संस्थागत पहचान।'),
      blocks: [
        { type: 'kv', rows: [
          kv('Legal Name', 'कानूनी नाम', P.en, P.hi),
          kv('Short Name', 'संक्षिप्त नाम', 'SSF', 'एसएसएफ'),
          kv('Organisation Type', 'संस्था का प्रकार', 'Society (Registered)', 'सोसाइटी (पंजीकृत)'),
          kv('Registration Number', 'पंजीकरण संख्या', '05/22/03/11448/13', '05/22/03/11448/13'),
          kv('Registration Date', 'पंजीकरण दिनांक', '30-12-2013', '30-12-2013'),
          kv('Registration Act', 'पंजीकरण अधिनियम', 'Madhya Pradesh Societies Registration Act, 1973', 'मध्य प्रदेश सोसाइटी पंजीकरण अधिनियम, 1973'),
          kv('Registered Office', 'पंजीकृत कार्यालय', 'Ward No. 1, Dadar, Post Rahat, District Rewa, Madhya Pradesh – 486446', 'वार्ड नं. 1, दादर, पोस्ट राहत, जिला रीवा, मध्य प्रदेश – 486446'),
          kv('Operational Scope', 'कार्यक्षेत्र', 'Pan India', 'सम्पूर्ण भारत'),
          kv('Website', 'वेबसाइट', 'www.swastiksrijan.in', 'www.swastiksrijan.in'),
          kv('Official Email', 'आधिकारिक ईमेल', CONTACT_INFO.primaryEmail, CONTACT_INFO.primaryEmail),
          kv('Official Contact', 'आधिकारिक संपर्क', CONTACT_INFO.phones.primaryFormatted, CONTACT_INFO.phones.primaryFormatted),
        ] },
      ],
    },

    // 3 ────────────────────────────────────────────────── ABOUT THE ORGANISATION
    {
      id: 'about',
      en: 'About the Organisation', hi: 'संस्था परिचय',
      blocks: [
        { type: 'para',
          text: T(
            'Swastik Srijan Foundation Samiti is a registered non-profit society established in 2013 in Rewa, Madhya Pradesh. The Foundation works with rural, tribal and underserved communities across India on education, health and nutrition, women and child welfare, livelihood, environment and social awareness. Its approach is community-led: programmes are designed with the people they serve, implemented through local participation, and documented so that governance, finances and outcomes remain accountable.',
            'स्वस्तिक सृजन फाउंडेशन समिति 2013 में रीवा, मध्य प्रदेश में स्थापित एक पंजीकृत गैर-लाभकारी सोसाइटी है। संस्था सम्पूर्ण भारत में ग्रामीण, जनजातीय एवं अलाभित समुदायों के साथ शिक्षा, स्वास्थ्य एवं पोषण, महिला एवं बाल कल्याण, आजीविका, पर्यावरण एवं सामाजिक जागरूकता के क्षेत्र में कार्य करती है। इसकी कार्यशैली समुदाय-नेतृत्व वाली है: कार्यक्रम समुदाय की भागीदारी से बनाए एवं क्रियान्वित किए जाते हैं, और शासन, वित्त एवं परिणामों की जवाबदेही हेतु उनका अभिलेखन किया जाता है।') },
        { type: 'para',
          text: T(
            'The organisation maintains documented records relating to governance, programmes, finances and statutory compliance, and is registered for CSR partnership under the Ministry of Corporate Affairs and on the NGO Darpan portal of NITI Aayog.',
            'संस्था शासन, कार्यक्रम, वित्त एवं सांविधिक अनुपालन से संबंधित प्रलेखित अभिलेख संधारित करती है, तथा कॉर्पोरेट कार्य मंत्रालय के अंतर्गत सीएसआर साझेदारी एवं नीति आयोग के एनजीओ दर्पण पोर्टल पर पंजीकृत है।') },
      ],
    },

    // 4 ─────────────────────────────────────────── VISION, MISSION & CORE VALUES
    {
      id: 'vision',
      en: 'Vision, Mission & Core Values', hi: 'दृष्टि, मिशन एवं मूल मूल्य',
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
      ],
    },

    // 5 ────────────────────────────────────────────────────────────── AREAS OF WORK
    {
      id: 'work',
      en: 'Areas of Work', hi: 'कार्यक्षेत्र',
      intro: T("Focus areas drawn from the Foundation's registered objectives.", 'संस्था के पंजीकृत उद्देश्यों से लिए गए कार्यक्षेत्र।'),
      blocks: [
        { type: 'bullets', items: [
          T('Education & Skill Development', 'शिक्षा एवं कौशल विकास'),
          T('Health, Nutrition & Wellbeing', 'स्वास्थ्य, पोषण एवं कल्याण'),
          T('Women & Child Welfare', 'महिला एवं बाल कल्याण'),
          T('Rural Development & Livelihood', 'ग्रामीण विकास एवं आजीविका'),
          T('Agriculture, Organic Farming & Animal Welfare', 'कृषि, जैविक खेती एवं पशु कल्याण'),
          T('Environment & Natural Resource Conservation', 'पर्यावरण एवं प्राकृतिक संसाधन संरक्षण'),
          T('Youth & Community Development', 'युवा एवं सामुदायिक विकास'),
          T('Disability Support & Rehabilitation', 'दिव्यांग सहयोग एवं पुनर्वास'),
          T('Social Awareness & Ethical Values', 'सामाजिक जागरूकता एवं नैतिक मूल्य'),
        ] },
        { type: 'bullets', label: T('Target Beneficiaries', 'लक्षित लाभार्थी'), items: [
          T('Children and youth', 'बच्चे एवं युवा'),
          T('Women and families', 'महिलाएँ एवं परिवार'),
          T('Elderly persons', 'वृद्धजन'),
          T('Persons with disabilities', 'दिव्यांगजन'),
          T('Farmers and rural communities', 'किसान एवं ग्रामीण समुदाय'),
          T('Tribal, remote and underserved communities', 'जनजातीय, दूरस्थ एवं अलाभित समुदाय'),
        ] },
      ],
    },

    // 6 ───────────────────────────────────────────────────────── PROGRAMMES
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
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Health, Nutrition & Wellbeing', 'स्वास्थ्य, पोषण एवं कल्याण') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Free health camps, medicine distribution & nutrition kits.', 'नि:शुल्क स्वास्थ्य शिविर, दवा वितरण एवं पोषण किट।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Women & Child Empowerment', 'महिला एवं बाल सशक्तिकरण'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Women & Child Welfare', 'महिला एवं बाल कल्याण') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Vocational training & protection programmes.', 'व्यावसायिक प्रशिक्षण एवं संरक्षण कार्यक्रम।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Sports & Youth Development', 'खेल एवं युवा विकास'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Youth & Community Development', 'युवा एवं सामुदायिक विकास') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Fitness, leadership & professional coaching for rural youth.', 'ग्रामीण युवाओं के लिए फिटनेस, नेतृत्व एवं व्यावसायिक कोचिंग।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Environment & Sustainability', 'पर्यावरण एवं स्थिरता'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Environment & Natural Resource Conservation', 'पर्यावरण एवं प्राकृतिक संसाधन संरक्षण') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Tree plantation, waste management & clean energy awareness.', 'वृक्षारोपण, कचरा प्रबंधन एवं स्वच्छ ऊर्जा जागरूकता।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Animal & Bird Welfare', 'पशु एवं पक्षी कल्याण'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Agriculture & Animal Welfare', 'कृषि एवं पशु कल्याण') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Rescue of injured strays & wildlife protection awareness.', 'घायल पशुओं का उपचार एवं वन्यजीव संरक्षण जागरूकता।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
          { name: T('Rural & Community Development', 'ग्रामीण एवं सामुदायिक विकास'),
            lines: [
              { l: T('Focus area', 'कार्यक्षेत्र'), v: T('Rural Development & Livelihood', 'ग्रामीण विकास एवं आजीविका') },
              { l: T('Purpose', 'उद्देश्य'), v: T('Infrastructure support & clean, self-reliant village campaigns.', 'अधोसंरचना सहयोग एवं स्वच्छ, आत्मनिर्भर गाँव अभियान।') },
              { l: T('Status', 'स्थिति'), v: T('Ongoing', 'सतत') },
            ] },
        ] },
        { type: 'gallery', label: T('Programme Activities', 'कार्यक्रम गतिविधियाँ'), items: GALLERY },
      ],
    },

    // 7 ───────────────────────────────────────── LEGAL & INSTITUTIONAL CREDENTIALS
    {
      id: 'legal',
      en: 'Legal & Institutional Credentials', hi: 'वैधानिक एवं संस्थागत प्रमाणिकताएँ',
      intro: T('Registrations and recognitions held by the Foundation, verifiable from official records.', 'संस्था द्वारा धारित पंजीकरण एवं मान्यताएँ, जो आधिकारिक अभिलेखों से सत्यापनीय हैं।'),
      blocks: [
        { type: 'table',
          columns: [T('Registration / ID', 'पंजीकरण / आईडी'), T('Number', 'संख्या'), T('Status', 'स्थिति')],
          rows: [
            [T('Society Registration', 'सोसाइटी पंजीकरण'), T('05/22/03/11448/13', '05/22/03/11448/13'), T('Registered · 30-12-2013 · MP Societies Act, 1973', 'पंजीकृत · 30-12-2013 · म.प्र. सोसाइटी अधिनियम, 1973')],
            [T('PAN', 'पैन'), T('AAKAS7123H', 'AAKAS7123H'), T('Registered', 'पंजीकृत')],
            [T('12AB Registration', '12AB पंजीकरण'), T('AAKAS7123H25BP01', 'AAKAS7123H25BP01'), T('Registered', 'पंजीकृत')],
            [T('80G Approval', '80G अनुमोदन'), T('AAKAS7123HF20231', 'AAKAS7123HF20231'), T('Registered', 'पंजीकृत')],
            [T('NGO Darpan ID', 'एनजीओ दर्पण आईडी'), T('MP/2017/0169529', 'MP/2017/0169529'), T('Active', 'सक्रिय')],
            [T('CSR-1 Registration (MCA)', 'सीएसआर-1 पंजीकरण (एमसीए)'), T('CSR00093974', 'CSR00093974'), T('Registered', 'पंजीकृत')],
            [T('MSME / Udyam', 'एमएसएमई / उद्यम'), T('UDYAM-MP-38-0042763', 'UDYAM-MP-38-0042763'), T('Registered · Micro (Services)', 'पंजीकृत · सूक्ष्म (सेवाएँ)')],
            [T('EPFO', 'ईपीएफओ'), T('MPJBP3643700000', 'MPJBP3643700000'), T('Registered', 'पंजीकृत')],
            [T('ESIC', 'ईएसआईसी'), T('81000588360001399', '81000588360001399'), T('Registered', 'पंजीकृत')],
            [T('Digital India Registration', 'डिजिटल इंडिया पंजीकरण'), T('REG2025070722444819', 'REG2025070722444819'), T('Registered', 'पंजीकृत')],
            [T('NCS / Government IDs', 'एनसीएस / शासकीय आईडी'), T('F7900E570628 · P20G74-0022474929830', 'F7900E570628 · P20G74-0022474929830'), T('Registered', 'पंजीकृत')],
            [T('MP Jan Abhiyan Parishad', 'म.प्र. जन अभियान परिषद'), T('NV2022REW0004', 'NV2022REW0004'), T('Registered', 'पंजीकृत')],
            [T('Startup Registration', 'स्टार्टअप पंजीकरण'), T('OI-0825-9266HS', 'OI-0825-9266HS'), T('Registered', 'पंजीकृत')],
          ],
          note: T('Supporting certificates and orders are available for verification and due diligence on request.',
            'सहायक प्रमाणपत्र एवं आदेश सत्यापन एवं जाँच हेतु अनुरोध पर उपलब्ध हैं।'),
        },
      ],
    },

    // 8 ───────────────────────────────────────────────────────── GOVERNANCE
    {
      id: 'governance',
      en: 'Governance & Leadership', hi: 'शासन एवं नेतृत्व',
      intro: T('Governing body as constituted under the registered Rules & Regulations (Niyamavali).', 'पंजीकृत नियमावली के अनुसार गठित कार्यकारी मंडल।'),
      blocks: [
        { type: 'table',
          columns: [T('Position', 'पद'), T('Name', 'नाम')],
          rows: [
            [T('President', 'अध्यक्ष'), T('Ramesh Pandey', 'रमेश पाण्डेय')],
            [T('Vice President', 'उपाध्यक्ष'), T('Preeti Shukla', 'प्रीति शुक्ला')],
            [T('Secretary', 'सचिव'), T('Amit Kumar Pandey', 'अमित कुमार पाण्डेय')],
            [T('Joint Secretary', 'सह-सचिव'), T('Kiran Pandey', 'किरण पाण्डेय')],
            [T('Treasurer', 'कोषाध्यक्ष'), T('Divya Sharma', 'दिव्या शर्मा')],
            [T('Governing Body Members', 'कार्यकारी मंडल सदस्य'), T('Sandeep Tripathi · Prameesh Singh · Rishi Kumar Pandey · Ritesh Kumar Tiwari', 'सन्दीप त्रिपाठी · प्रमीश सिंह · ऋषि कुमार पाण्डेय · रितेश कुमार तिवारी')],
          ],
        },
      ],
    },

    // 9 ──────────────────────────────────────────────────────── FINANCIAL GOVERNANCE
    {
      id: 'finance',
      en: 'Financial Governance & Transparency', hi: 'वित्तीय पारदर्शिता एवं उत्तरदायित्व',
      intro: T('Institutional financial information. Sensitive banking identifiers are masked in this public profile.', 'संस्थागत वित्तीय जानकारी। इस सार्वजनिक परिचय में संवेदनशील बैंकिंग विवरण छिपाए गए हैं।'),
      blocks: [
        { type: 'kv', rows: [
          kv('Financial Year', 'वित्तीय वर्ष', '2025-26', '2025-26'),
          kv('Books of Accounts', 'बहीखाता', 'Audited accounts and supporting records maintained.', 'लेखा-परीक्षित खाते एवं सहायक अभिलेख संधारित।'),
          kv('Auditor / CA', 'लेखा परीक्षक / सीए', 'CA Kapil Tiwari', 'सीए कपिल तिवारी'),
          kv('Audited Accounts', 'लेखा-परीक्षित खाते', 'Available for authorised due diligence on request.', 'अधिकृत जाँच हेतु अनुरोध पर उपलब्ध।'),
        ] },
        { type: 'callout', label: T('Banking (masked)', 'बैंकिंग (छिपा हुआ)'),
          text: T(
            'Bank: Union Bank of India · Branch: Transport Nagar, Rewa. Full account and payment details are shared only for authorised due diligence, on request.',
            'बैंक: यूनियन बैंक ऑफ इंडिया · शाखा: ट्रांसपोर्ट नगर, रीवा। पूर्ण खाता एवं भुगतान विवरण केवल अधिकृत जाँच हेतु, अनुरोध पर साझा किए जाते हैं।') },
      ],
    },

    // 10 ─────────────────────────────────────────────────────── WHY PARTNER WITH SSF
    {
      id: 'partnership',
      en: 'Why Partner with SSF', hi: 'एसएसएफ के साथ क्यों जुड़ें',
      intro: T('Factual institutional strengths that make the Foundation a dependable partner.', 'संस्था को एक विश्वसनीय साझेदार बनाने वाली तथ्यात्मक संस्थागत योग्यताएँ।'),
      blocks: [
        { type: 'bullets', items: [
          T('Registered institutional identity with verifiable documents', 'सत्यापनीय दस्तावेज़ों सहित पंजीकृत संस्थागत पहचान'),
          T('Clearly defined social-development focus areas', 'स्पष्ट रूप से परिभाषित सामाजिक विकास कार्यक्षेत्र'),
          T('Community-oriented, locally implemented programmes', 'समुदाय-केंद्रित, स्थानीय स्तर पर क्रियान्वित कार्यक्रम'),
          T('Governance framework as per registered Niyamavali', 'पंजीकृत नियमावली के अनुसार शासन ढाँचा'),
          T('Documented financial records and audited accounts', 'प्रलेखित वित्तीय अभिलेख एवं लेखा-परीक्षित खाते'),
          T('Compliance-oriented approach to statutory matters', 'सांविधिक विषयों हेतु अनुपालन-उन्मुख दृष्टिकोण'),
          T('Reporting & documentation readiness for CSR and grants', 'सीएसआर एवं अनुदान हेतु रिपोर्टिंग एवं प्रलेखन तैयारी'),
        ] },
      ],
    },

    // 11 ────────────────────────────────────────────────── PARTNERSHIP OPPORTUNITIES
    {
      id: 'opportunities',
      en: 'Partnership Opportunities', hi: 'साझेदारी के अवसर',
      intro: T("Areas open to lawful partnership aligned with the Foundation's registered objectives.", 'संस्था के पंजीकृत उद्देश्यों के अनुरूप विधिसम्मत साझेदारी हेतु उपलब्ध क्षेत्र।'),
      blocks: [
        { type: 'bullets', items: [
          T('CSR Partnership', 'सीएसआर साझेदारी'),
          T('Government Programme Partnership', 'शासकीय कार्यक्रम साझेदारी'),
          T('Institutional Grants', 'संस्थागत अनुदान'),
          T('Community Development Projects', 'सामुदायिक विकास परियोजनाएँ'),
          T('Education & Skill Development', 'शिक्षा एवं कौशल विकास'),
          T('Health & Nutrition', 'स्वास्थ्य एवं पोषण'),
          T('Women & Child Development', 'महिला एवं बाल विकास'),
          T('Rural Development & Livelihood', 'ग्रामीण विकास एवं आजीविका'),
          T('Environment & Sustainability', 'पर्यावरण एवं स्थिरता'),
        ] },
        { type: 'callout', tone: 'accent',
          text: T(
            'We welcome lawful, transparent and objective-aligned partnerships. For partnership or CSR enquiries, please contact the Secretary.',
            'हम विधिसम्मत, पारदर्शी एवं उद्देश्य-अनुरूप साझेदारी का स्वागत करते हैं। साझेदारी या सीएसआर संबंधी पूछताछ हेतु कृपया सचिव से संपर्क करें।') },
      ],
    },

    // 12 ──────────────────────────────────────── TRANSPARENCY & PUBLIC DOCUMENTS
    {
      id: 'transparency',
      en: 'Transparency & Public Documents', hi: 'पारदर्शिता एवं सार्वजनिक दस्तावेज़',
      intro: T('How the Foundation documents its work, and the public documents available for verification.', 'संस्था अपने कार्य का अभिलेखन कैसे करती है, एवं सत्यापन हेतु उपलब्ध सार्वजनिक दस्तावेज़।'),
      blocks: [
        { type: 'para',
          text: T(
            'Swastik Srijan Foundation Samiti maintains documented records relating to governance, programmes, finances and statutory/compliance matters, subject to applicable requirements and periodic updating.',
            'स्वस्तिक सृजन फाउंडेशन समिति शासन, कार्यक्रम, वित्त एवं सांविधिक/अनुपालन संबंधी प्रलेखित अभिलेख संधारित करती है, जो प्रचलित अपेक्षाओं एवं आवधिक अद्यतन के अधीन हैं।') },
        { type: 'docCards', label: T('Public Documents', 'सार्वजनिक दस्तावेज़'), items: PUB_DOCS },
      ],
    },

    // 13 ───────────────────────────────────────────────────────── ANNUAL REPORTS
    {
      id: 'reports',
      en: 'Annual Reports', hi: 'वार्षिक प्रतिवेदन',
      intro: T('Year-wise progress reports, each linked to its own official document.', 'वर्षानुसार प्रगति प्रतिवेदन, प्रत्येक अपने आधिकारिक दस्तावेज़ से लिंकित।'),
      blocks: [
        { type: 'years', items: ANNUAL_REPORTS },
      ],
    },

    // 14 ─────────────────────────────────────────────────────── CONTACT & PRESENCE
    {
      id: 'contact',
      en: 'Contact & Presence', hi: 'संपर्क एवं उपस्थिति',
      intro: T('Reach the Foundation and follow its work.', 'संस्था से जुड़ें एवं उसके कार्य से जुड़े रहें।'),
      blocks: [
        { type: 'kv', rows: [
          kv('Registered Office', 'पंजीकृत कार्यालय', CONTACT_INFO.address.fullRegistered, 'वार्ड नं. 1, दादर, पोस्ट राहत, जिला रीवा, मध्य प्रदेश – 486446, भारत'),
          kv('Operational Scope', 'कार्यक्षेत्र', 'Pan India', 'सम्पूर्ण भारत'),
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

    // 15 ──────────────────────────────────────────────────────────── DECLARATION
    {
      id: 'declaration',
      en: 'Declaration', hi: 'घोषणा',
      blocks: [
        { type: 'para',
          text: T(
            'The information presented in this profile is based on the official records and documents maintained by Swastik Srijan Foundation Samiti and is subject to periodic update. Supporting registration, statutory, financial and institutional documents may be provided for due diligence where appropriate.',
            'इस परिचय में प्रस्तुत जानकारी स्वस्तिक सृजन फाउंडेशन समिति द्वारा संधारित आधिकारिक अभिलेखों एवं दस्तावेज़ों पर आधारित है और आवधिक अद्यतन के अधीन है। उपयुक्त होने पर सहायक पंजीकरण, सांविधिक, वित्तीय एवं संस्थागत दस्तावेज़ जाँच हेतु उपलब्ध कराए जा सकते हैं।') },
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
    docIdLabel: T('Document ID', 'दस्तावेज़ आईडी'),
    issuedLabel: T('Issued / Updated', 'जारी / अद्यतन'),
    issued: '2026',
  },
};

export default PROFILE_DOC;
