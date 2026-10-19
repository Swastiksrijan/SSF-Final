// Letter types offered by the Letterhead composer. Each carries a bilingual
// subject + a short draft the admin can edit. The drafts are starting points,
// not legal wording — the admin is expected to adapt them.
export const LETTER_TYPES = [
  {
    en: 'General Letter', hi: 'सामान्य पत्र',
    subject: { en: '', hi: '' }, body: { en: '', hi: '' },
  },
  {
    en: 'Government / Department Letter', hi: 'शासकीय / विभागीय पत्र',
    subject: { en: 'Request regarding …', hi: '… के संबंध में अनुरोध' },
    body: {
      en: 'With reference to the above subject, we wish to bring to your kind notice that Swastik Srijan Foundation Samiti is a registered society working in the fields of education, health, livelihood and community development.\n\nWe request your good office to kindly …\n\nWe shall be glad to furnish any further information or documents that may be required.',
      hi: 'उपरोक्त विषय के संदर्भ में सूचित करना है कि स्वस्तिक सृजन फाउंडेशन समिति एक पंजीकृत संस्था है, जो शिक्षा, स्वास्थ्य, आजीविका एवं सामुदायिक विकास के क्षेत्र में कार्यरत है।\n\nहम आपके कार्यालय से निवेदन करते हैं कि कृपया …\n\nआवश्यक होने पर हम कोई भी अतिरिक्त सूचना या दस्तावेज़ उपलब्ध कराने में प्रसन्नता अनुभव करेंगे।',
    },
  },
  {
    en: 'Company / CSR Letter', hi: 'कंपनी / सीएसआर पत्र',
    subject: { en: 'Proposal for CSR partnership — …', hi: 'सीएसआर साझेदारी हेतु प्रस्ताव — …' },
    body: {
      en: 'We are pleased to introduce Swastik Srijan Foundation Samiti, a registered society with 12AB and 80G registrations and CSR-1 registration with the MCA.\n\nWe propose a partnership for … under your CSR programme. A detailed project note is enclosed for your consideration.\n\nWe would welcome an opportunity to discuss this proposal at your convenience.',
      hi: 'हम स्वस्तिक सृजन फाउंडेशन समिति का परिचय प्रस्तुत करते हैं — एक पंजीकृत संस्था, जिसके पास 12AB एवं 80G पंजीकरण तथा एमसीए के साथ सीएसआर-1 पंजीकरण है।\n\nआपके सीएसआर कार्यक्रम के अंतर्गत … हेतु साझेदारी का प्रस्ताव प्रस्तुत है। विचारार्थ विस्तृत परियोजना नोट संलग्न है।\n\nआपकी सुविधानुसार इस प्रस्ताव पर चर्चा का हमें अवसर मिलने पर प्रसन्नता होगी।',
    },
  },
  {
    en: 'Bank Letter', hi: 'बैंक पत्र',
    subject: { en: 'Request regarding the Society account', hi: 'संस्था खाते के संबंध में अनुरोध' },
    body: {
      en: 'This is to request, in respect of the account of Swastik Srijan Foundation Samiti maintained with your branch, that …\n\nCertified copies of the relevant resolutions of the Managing Committee are enclosed.',
      hi: 'इस पत्र के माध्यम से आपकी शाखा में संचालित स्वस्तिक सृजन फाउंडेशन समिति के खाते के संबंध में निवेदन है कि …\n\nप्रबंधकारिणी के संबंधित संकल्पों की प्रमाणित प्रतियाँ संलग्न हैं।',
    },
  },
  {
    en: 'Donor / Thank-you Letter', hi: 'दानदाता / धन्यवाद पत्र',
    subject: { en: 'Grateful acknowledgement of your contribution', hi: 'आपके योगदान हेतु हार्दिक आभार' },
    body: {
      en: 'On behalf of Swastik Srijan Foundation Samiti, we express our sincere gratitude for your generous contribution of ₹ … .\n\nYour support will be used for … . A receipt for the same is enclosed.',
      hi: 'स्वस्तिक सृजन फाउंडेशन समिति की ओर से आपके उदार योगदान ₹ … हेतु हम हार्दिक आभार व्यक्त करते हैं।\n\nआपका सहयोग … हेतु उपयोग किया जाएगा। इसकी रसीद संलग्न है।',
    },
  },
  {
    en: 'Membership / Appointment Letter', hi: 'सदस्यता / नियुक्ति पत्र',
    subject: { en: 'Appointment / Membership in the Foundation', hi: 'संस्था में नियुक्ति / सदस्यता' },
    body: {
      en: 'We are pleased to inform you that, by a resolution of the Managing Committee, you have been appointed as … of Swastik Srijan Foundation Samiti with effect from … .\n\nWe look forward to your valuable contribution to the Foundation and the community it serves.',
      hi: 'हमें यह सूचित करते हुए प्रसन्नता है कि प्रबंधकारिणी के संकल्प द्वारा आपको स्वस्तिक सृजन फाउंडेशन समिति का … पद दिनांक … से प्रदान किया गया है।\n\nसंस्था एवं समाज की सेवा में आपके बहुमूल्य योगदान की हमें प्रतीक्षा रहेगी।',
    },
  },
  {
    en: 'NOC / Permission Letter', hi: 'अनापत्ति / अनुमति पत्र',
    subject: { en: 'No Objection Certificate', hi: 'अनापत्ति प्रमाण पत्र' },
    body: {
      en: 'This is to certify that Swastik Srijan Foundation Samiti has no objection to … .\n\nThis certificate is issued on the specific request of the concerned person / organisation for the stated purpose only.',
      hi: 'इसके द्वारा प्रमाणित किया जाता है कि स्वस्तिक सृजन फाउंडेशन समिति को … पर कोई आपत्ति नहीं है।\n\nयह प्रमाण पत्र संबंधित व्यक्ति / संस्था के विशेष अनुरोध पर केवल उल्लिखित प्रयोजन हेतु जारी किया गया है।',
    },
  },
  {
    en: 'Recommendation Letter', hi: 'संस्तुति पत्र',
    subject: { en: 'Letter of recommendation', hi: 'संस्तुति पत्र' },
    body: {
      en: 'This is to certify that Mr./Ms. … has been associated with Swastik Srijan Foundation Samiti as … .\n\nDuring this period we have found him/her sincere, diligent and cooperative. We wish him/her success in all future endeavours.',
      hi: 'इसके द्वारा प्रमाणित किया जाता है कि श्री / श्रीमती … स्वस्तिक सृजन फाउंडेशन समिति से … के रूप में जुड़े रहे हैं।\n\nइस अवधि में हमने उन्हें कर्तव्यनिष्ठ, परिश्रमी एवं सहयोगी पाया। उनके भावी जीवन की हम शुभकामनाएँ करते हैं।',
    },
  },
  {
    en: 'Notice / Circular', hi: 'सूचना / परिपत्र',
    subject: { en: 'Notice — …', hi: 'सूचना — …' },
    body: {
      en: 'It is hereby notified for the information of all concerned that … .\n\nAll concerned are requested to take note and act accordingly.',
      hi: 'इसके द्वारा सभी संबंधितों को सूचित किया जाता है कि …\n\nसभी संबंधितों से अनुरोध है कि इसका संज्ञान लेकर तदनुसार कार्य करें।',
    },
  },
  {
    en: 'Invitation Letter', hi: 'आमंत्रण पत्र',
    subject: { en: 'Invitation — …', hi: 'आमंत्रण — …' },
    body: {
      en: 'We are pleased to invite you to … organised by Swastik Srijan Foundation Samiti on … at … .\n\nYour gracious presence will greatly encourage our efforts. Kindly confirm your availability.',
      hi: 'स्वस्तिक सृजन फाउंडेशन समिति द्वारा दिनांक … को … स्थान पर आयोजित … हेतु हम आपको सादर आमंत्रित करते हैं।\n\nआपकी गरिमामयी उपस्थिति हमारे प्रयासों को प्रोत्साहन देगी। कृपया अपनी उपलब्धता की पुष्टि करें।',
    },
  },
  {
    en: 'Complaint / Representation', hi: 'शिकायत / अभ्यावेदन',
    subject: { en: 'Representation regarding …', hi: '… के संबंध में अभ्यावेदन' },
    body: {
      en: 'We respectfully submit this representation on behalf of Swastik Srijan Foundation Samiti regarding … .\n\nWe request your kind intervention so that the matter may be resolved at the earliest.\n\nWe shall remain grateful for your consideration.',
      hi: 'हम स्वस्तिक सृजन फाउंडेशन समिति की ओर से … के संबंध में यह अभ्यावेदन सादर प्रस्तुत करते हैं।\n\nहम आपके सहयोग की प्रार्थना करते हैं जिससे इस विषय का शीघ्र समाधान हो सके।\n\nआपके विचारार्थ प्रस्तुत करने हेतु हम आभारी रहेंगे।',
    },
  },
];
