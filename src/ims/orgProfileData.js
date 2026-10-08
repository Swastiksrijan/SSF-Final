// SSF Organisation Profile — single source of truth for the shareable PDF.
// Everything here is drawn from the SSF website + the Institution Profile
// (ImsOrganisationProfile seed) so the document matches what IMS already shows.
// Fully bilingual: every label and value carries an English and a Hindi form.
import { CONTACT_INFO } from '../config/contact';

const P = { en: 'Swastik Srijan Foundation Samiti', hi: 'स्वस्तिक सृजन फाउंडेशन समिति' };
const row = (len, hen, lv, hv) => ({ l: { en: len, hi: hen }, v: { en: lv, hi: hv } });

export const PROFILE_DOC = {
  code: 'SSF/PROFILE/2026/V1',
  generation: { en: 'SSF-IMS Organisation Profile', hi: 'एसएसएफ-आईएमएस संस्था परिचय' },
  org: P,
  tagline: {
    en: 'One Organisation • One Record • Complete Accountability',
    hi: 'एक संस्था • एक रिकॉर्ड • पूर्ण जवाबदेही',
  },
  purpose: {
    en: 'Institutional profile for CSR partners, government bodies, funders and institutional collaborators.',
    hi: 'सीएसआर भागीदारों, शासकीय संस्थाओं, सहयोगियों एवं संस्थागत साझेदारों के लिए संस्थागत परिचय।',
  },
  sections: [
    {
      id: 'parichay', icon: 'Building2',
      en: 'Organization Profile', hi: 'संस्था परिचय',
      intro: { en: 'Core identity of the Foundation.', hi: 'संस्था की मूल पहचान।' },
      rows: [
        row('Legal Name', 'कानूनी नाम', P.en, P.hi),
        row('Short Name', 'संक्षिप्त नाम', 'SSF', 'एसएसएफ'),
        row('Organization Type', 'संस्था का प्रकार', 'Society (Registered)', 'सोसाइटी (पंजीकृत)'),
        row('Registration Number', 'पंजीकरण संख्या', '05/22/03/11448/13', '05/22/03/11448/13'),
        row('Registration Date', 'पंजीकरण दिनांक', '30-12-2013', '30-12-2013'),
        row('Registration Act', 'पंजीकरण अधिनियम', 'Madhya Pradesh Societies Registration Act, 1973', 'मध्य प्रदेश सोसाइटी पंजीकरण अधिनियम, 1973'),
        row('Operational Scope', 'कार्यक्षेत्र', 'Pan India', 'सम्पूर्ण भारत'),
        row('Head Office (Registered)', 'पंजीकृत कार्यालय', 'Ward No. 1, Dadar, Post Rahat, District Rewa, MP 486446', 'वार्ड नं. 1, दादर, पोस्ट राहत, जिला रीवा, म.प्र. 486446'),
        row('Operational Office', 'प्रचालन कार्यालय', CONTACT_INFO.address.operational, 'पुणे, महाराष्ट्र, भारत'),
        row('Website', 'वेबसाइट', 'www.swastiksrijan.in', 'www.swastiksrijan.in'),
        row('Primary Email', 'प्राथमिक ईमेल', CONTACT_INFO.primaryEmail, CONTACT_INFO.primaryEmail),
        row('Mobile', 'मोबाइल', CONTACT_INFO.phones.primaryFormatted, CONTACT_INFO.phones.primaryFormatted),
        row('Data Protection Officer', 'डेटा संरक्षण अधिकारी', `${CONTACT_INFO.dataProtectionOfficer.name} (${CONTACT_INFO.dataProtectionOfficer.email})`, `${CONTACT_INFO.dataProtectionOfficer.name} (${CONTACT_INFO.dataProtectionOfficer.email})`),
      ],
    },
    {
      id: 'objectives', icon: 'Target',
      en: 'Vision, Mission & Objectives', hi: 'दृष्टि, मिशन एवं उद्देश्य',
      intro: { en: 'What the Foundation stands for.', hi: 'संस्था किसके लिए प्रतिबद्ध है।' },
      rows: [
        row('Vision', 'दृष्टि', 'An inclusive, educated, healthy, self-reliant and harmonious society where every person can live with dignity, equal opportunity and the ability to participate in sustainable development.', 'एक समावेशी, शिक्षित, स्वस्थ, आत्मनिर्भर एवं सामंजस्यपूर्ण समाज, जहाँ प्रत्येक व्यक्ति गरिमा, समान अवसर एवं सतत विकास में भागीदारी के साथ जीवन जी सके।'),
        row('Mission', 'मिशन', 'To work across India for education, health and well-being, livelihood and self-reliance, women and child empowerment, rural development, environmental protection and social awareness through community participation, capacity building, lawful partnerships and transparent organisational practices.', 'शिक्षा, स्वास्थ्य एवं कल्याण, आजीविका एवं आत्मनिर्भरता, महिला एवं बाल सशक्तिकरण, ग्रामीण विकास, पर्यावरण संरक्षण एवं सामाजिक जागरूकता के लिए सामुदायिक सहभागिता, क्षमता निर्माण, विधिसम्मत साझेदारी एवं पारदर्शी संस्थागत व्यवहार के माध्यम से सम्पूर्ण भारत में कार्य करना।'),
        row('Core Values', 'मूल मूल्य', 'Humanity & Truth; Equality & Dignity; Social Harmony; Responsibility; Transparency; Community Participation; Service with Integrity', 'मानवता एवं सत्य; समानता एवं गरिमा; सामाजिक समरसता; उत्तरदायित्व; पारदर्शिता; सामुदायिक सहभागिता; सत्यनिष्ठा से सेवा'),
        row('Areas of Work', 'कार्यक्षेत्र', 'Education & Skill Development; Health, Nutrition & Wellness; Women & Child Welfare; Rural Development & Livelihood; Agriculture, Organic Farming & Animal Welfare; Environment & Natural Resource Conservation; Disability Support & Rehabilitation; Youth & Community Development; Social Awareness & Ethical Values', 'शिक्षा एवं कौशल विकास; स्वास्थ्य, पोषण एवं कल्याण; महिला एवं बाल कल्याण; ग्रामीण विकास एवं आजीविका; कृषि, जैविक खेती एवं पशु कल्याण; पर्यावरण एवं प्राकृतिक संसाधन संरक्षण; दिव्यांग सहयोग एवं पुनर्वास; युवा एवं सामुदायिक विकास; सामाजिक जागरूकता एवं नैतिक मूल्य'),
        row('Target Beneficiaries', 'लक्षित लाभार्थी', 'Children; women; elderly persons; persons with disabilities; farmers; rural and economically disadvantaged communities; tribal, remote and underserved communities; youth and families.', 'बच्चे; महिलाएँ; वृद्धजन; दिव्यांगजन; किसान; ग्रामीण एवं आर्थिक रूप से वंचित समुदाय; जनजातीय, दूरस्थ एवं अलाभित समुदाय; युवा एवं परिवार।'),
      ],
    },
    {
      id: 'projects', icon: 'Sprout',
      en: 'Projects & Programmes', hi: 'परियोजनाएँ एवं कार्यक्रम',
      intro: { en: 'Active and planned initiatives across our focus areas.', hi: 'हमारे कार्यक्षेत्रों में सक्रिय एवं प्रस्तावित पहलें।' },
      rows: [
        row('SSF Learning Hub — community-driven online & offline education classes', 'एसएसएफ लर्निंग हब — समुदाय-संचालित ऑनलाइन एवं ऑफलाइन शिक्षा कक्षाएँ', 'Active', 'सक्रिय'),
        row('The SSF National Academy — flagship knowledge hub for future leaders', 'एसएसएफ नेशनल अकादमी — भावी नेताओं के लिए प्रमुख ज्ञान केंद्र', 'Upcoming', 'प्रस्तावित'),
        row('Education for Underprivileged Children — school fees, materials & digital learning support', 'वंचित बच्चों के लिए शिक्षा — स्कूल फीस, सामग्री एवं डिजिटल शिक्षा सहयोग', 'Ongoing', 'सतत'),
        row('Health & Nutrition Initiative — free health camps, medicine distribution & nutrition kits', 'स्वास्थ्य एवं पोषण पहल — नि:शुल्क स्वास्थ्य शिविर, दवा वितरण एवं पोषण किट', 'Ongoing', 'सतत'),
        row('Sports & Youth Development — fitness, leadership & professional coaching for rural youth', 'खेल एवं युवा विकास — ग्रामीण युवाओं के लिए फिटनेस, नेतृत्व एवं व्यावसायिक कोचिंग', 'Ongoing', 'सतत'),
        row('Women & Child Empowerment — vocational training & protection programmes', 'महिला एवं बाल सशक्तिकरण — व्यावसायिक प्रशिक्षण एवं संरक्षण कार्यक्रम', 'Ongoing', 'सतत'),
        row('Environment & Sustainability — tree plantation, waste management & clean energy awareness', 'पर्यावरण एवं स्थिरता — वृक्षारोपण, कचरा प्रबंधन एवं स्वच्छ ऊर्जा जागरूकता', 'Ongoing', 'सतत'),
        row('Animal & Bird Welfare — rescue of injured strays & wildlife protection awareness', 'पशु एवं पक्षी कल्याण — घायल पशुओं का उपचार एवं वन्यजीव संरक्षण जागरूकता', 'Ongoing', 'सतत'),
        row('Community Development — infrastructure support & clean, self-reliant village campaigns', 'सामुदायिक विकास — अधोसंरचना सहयोग एवं स्वच्छ, आत्मनिर्भर गाँव अभियान', 'Ongoing', 'सतत'),
      ],
    },
    {
      id: 'legal', icon: 'Scale',
      en: 'Legal & Statutory Registrations', hi: 'कानूनी एवं सांविधिक पंजीकरण',
      intro: { en: 'Registration and recognition details, verifiable from official records.', hi: 'पंजीकरण एवं मान्यता विवरण, आधिकारिक अभिलेखों से सत्यापनीय।' },
      rows: [
        row('PAN', 'पैन', 'AAKAS7123H', 'AAKAS7123H'),
        row('12AB Registration', '12AB पंजीकरण', 'AAKAS7123H25BP01', 'AAKAS7123H25BP01'),
        row('80G Registration', '80G पंजीकरण', 'AAKAS7123HF20231', 'AAKAS7123HF20231'),
        row('NGO Darpan ID', 'एनजीओ दर्पण आईडी', 'MP/2017/0169529', 'MP/2017/0169529'),
        row('CSR-1 Registration (MCA)', 'सीएसआर-1 पंजीकरण (एमसीए)', 'CSR00093974', 'CSR00093974'),
        row('MSME / Udyam', 'एमएसएमई / उद्यम', 'UDYAM-MP-38-0042763', 'UDYAM-MP-38-0042763'),
        row('EPFO', 'ईपीएफओ', 'MPJBP3643700000', 'MPJBP3643700000'),
        row('ESIC', 'ईएसआईसी', '81000588360001399', '81000588360001399'),
        row('Digital India Registration', 'डिजिटल इंडिया पंजीकरण', 'REG2025070722444819', 'REG2025070722444819'),
        row('NCS Employer / Organization ID', 'एनसीएस नियोक्ता / संस्था आईडी', 'F7900E570628 / P20G74-0022474929830', 'F7900E570628 / P20G74-0022474929830'),
        row('MP Jan Abhiyan Parishad', 'म.प्र. जन अभियान परिषद', 'NV2022REW0004', 'NV2022REW0004'),
        row('Startup Registration', 'स्टार्टअप पंजीकरण', 'OI-0825-9266HS', 'OI-0825-9266HS'),
      ],
    },
    {
      id: 'governance', icon: 'Users',
      en: 'Governance & Office Bearers', hi: 'शासन एवं पदाधिकारी',
      intro: { en: 'Governing body as per the registered Niyamavali (Rules & Regulations).', hi: 'पंजीकृत नियमावली के अनुसार कार्यकारी मंडल।' },
      rows: [
        row('President', 'अध्यक्ष', 'Ramesh Pandey', 'रमेश पाण्डेय'),
        row('Vice President', 'उपाध्यक्ष', 'Preeti Shukla', 'प्रीति शुक्ला'),
        row('Secretary', 'सचिव', 'Amit Kumar Pandey', 'अमित कुमार पाण्डेय'),
        row('Joint Secretary', 'सह-सचिव', 'Kiran Pandey', 'किरण पाण्डेय'),
        row('Treasurer', 'कोषाध्यक्ष', 'Divya Sharma', 'दिव्या शर्मा'),
        row('Governing Body Members', 'कार्यकारी मंडल सदस्य', 'Sandeep Tripathi; Prameesh Singh; Rishi Kumar Pandey; Ritesh Kumar Tiwari', 'सन्दीप त्रिपाठी; प्रमीश सिंह; ऋषि कुमार पाण्डेय; रितेश कुमार तिवारी'),
      ],
    },
    {
      id: 'finance', icon: 'Landmark',
      en: 'Financial & Banking Profile', hi: 'वित्तीय एवं बैंकिंग विवरण',
      intro: { en: 'Audited books and banking details for institutional due diligence.', hi: 'संस्थागत जाँच हेतु लेखा-परीक्षित बहीखाता एवं बैंकिंग विवरण।' },
      rows: [
        row('Financial Year', 'वित्तीय वर्ष', '2025-26', '2025-26'),
        row('Bank Name', 'बैंक का नाम', 'Union Bank of India', 'यूनियन बैंक ऑफ इंडिया'),
        row('Branch', 'शाखा', 'Transport Nagar, Rewa', 'ट्रांसपोर्ट नगर, रीवा'),
        row('Account Number', 'खाता संख्या', '481401010036579', '481401010036579'),
        row('IFSC', 'आईएफएससी', 'UBIN0548146', 'UBIN0548146'),
        row('UPI ID', 'यूपीआई आईडी', '9718346691@ptyes', '9718346691@ptyes'),
        row('Auditor / CA', 'लेखा परीक्षक / सीए', 'CA Kapil Tiwari (8527067812)', 'सीए कपिल तिवारी (8527067812)'),
        row('Books of Accounts', 'बहीखाता', 'Audited accounts and supporting records maintained and available.', 'लेखा-परीक्षित खाते एवं सहायक अभिलेख संधारित एवं उपलब्ध।'),
      ],
    },
    {
      id: 'csr', icon: 'Handshake',
      en: 'CSR & Partnership', hi: 'सीएसआर एवं साझेदारी',
      intro: { en: 'Why corporates and institutions partner with SSF.', hi: 'कंपनियाँ एवं संस्थाएँ एसएसएफ से क्यों जुड़ती हैं।' },
      rows: [
        row('Compliance Ready', 'अनुपालन हेतु तैयार', '12A & 80G registered · CSR-1 registered (MCA) · NGO Darpan active', '12A एवं 80G पंजीकृत · सीएसआर-1 पंजीकृत (एमसीए) · एनजीओ दर्पण सक्रिय'),
        row('Tax Exemption', 'कर छूट', 'Donations eligible for 80G deduction (subject to applicable law).', 'दान 80G कटौती हेतु पात्र (प्रचलित विधि के अधीन)।'),
        row('Grassroots Reach', 'जमीनी पहुँच', 'Community-driven delivery across education, health, livelihood, environment and rural development.', 'शिक्षा, स्वास्थ्य, आजीविका, पर्यावरण एवं ग्रामीण विकास में समुदाय-संचालित क्रियान्वयन।'),
        row('Transparency & Records', 'पारदर्शिता एवं अभिलेख', 'Every rupee, decision and record is maintained in SSF-IMS with maker–checker accountability.', 'प्रत्येक रुपया, निर्णय एवं अभिलेख एसएसएफ-आईएमएस में निर्माता–सत्यापनकर्ता उत्तरदायित्व के साथ संधारित।'),
        row('Partnership Contact', 'साझेदारी संपर्क', `${CONTACT_INFO.primaryEmail} · ${CONTACT_INFO.phones.primaryFormatted}`, `${CONTACT_INFO.primaryEmail} · ${CONTACT_INFO.phones.primaryFormatted}`),
      ],
    },
    {
      id: 'contact', icon: 'Phone',
      en: 'Contact & Presence', hi: 'संपर्क एवं उपस्थिति',
      intro: { en: 'Reach the Foundation and follow our work.', hi: 'संस्था से जुड़ें एवं हमारे कार्य से जुड़े रहें।' },
      rows: [
        row('Primary Email', 'प्राथमिक ईमेल', CONTACT_INFO.primaryEmail, CONTACT_INFO.primaryEmail),
        row('President Email', 'अध्यक्ष ईमेल', CONTACT_INFO.presidentEmail, CONTACT_INFO.presidentEmail),
        row('Phone', 'दूरभाष', `${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.phones.secondaryFormatted}`, `${CONTACT_INFO.phones.primaryFormatted} · ${CONTACT_INFO.phones.secondaryFormatted}`),
        row('Registered Office', 'पंजीकृत कार्यालय', CONTACT_INFO.address.fullRegistered, 'वार्ड नं. 1, दादर, पोस्ट राहत, जिला रीवा, पिन 48446, मध्य प्रदेश, भारत'),
        row('Website', 'वेबसाइट', 'www.swastiksrijan.in', 'www.swastiksrijan.in'),
        row('Facebook', 'फेसबुक', CONTACT_INFO.social.facebook, CONTACT_INFO.social.facebook),
        row('Instagram', 'इंस्टाग्राम', CONTACT_INFO.social.instagram, CONTACT_INFO.social.instagram),
        row('LinkedIn', 'लिंक्डइन', CONTACT_INFO.social.linkedin, CONTACT_INFO.social.linkedin),
        row('X (Twitter)', 'एक्स (ट्विटर)', CONTACT_INFO.social.twitter, CONTACT_INFO.social.twitter),
        row('Telegram', 'टेलीग्राम', CONTACT_INFO.social.telegram, CONTACT_INFO.social.telegram),
        row('YouTube', 'यूट्यूब', CONTACT_INFO.social.youtube, CONTACT_INFO.social.youtube),
        row('WhatsApp Channel', 'व्हाट्सएप चैनल', CONTACT_INFO.social.whatsappChannel, CONTACT_INFO.social.whatsappChannel),
      ],
    },
    {
      id: 'declaration', icon: 'ShieldCheck',
      en: 'Declaration', hi: 'घोषणा',
      intro: { en: 'Drawn from official SSF-IMS records.', hi: 'आधिकारिक एसएसएफ-आईएमएस अभिलेखों से लिया गया।' },
      rows: [
        row('Declaration', 'घोषणा', 'The information in this profile is drawn from the Foundation\u2019s maintained records in SSF-IMS (One Organisation, One Record). Details are subject to update as records are revised. For verification of any certificate or registration, contact the Foundation.', 'इस परिचय में दी गई जानकारी संस्था के एसएसएफ-आईएमएस में संधारित अभिलेखों से ली गई है (एक संस्था, एक रिकॉर्ड)। अभिलेख संशोधित होने पर विवरण अद्यतन हो सकते हैं। किसी प्रमाणपत्र या पंजीकरण के सत्यापन हेतु संस्था से संपर्क करें।'),
        row('Issued By', 'जारीकर्ता', 'Secretary, Swastik Srijan Foundation Samiti', 'सचिव, स्वस्तिक सृजन फाउंडेशन समिति'),
      ],
    },
  ],
};

export default PROFILE_DOC;
