// "मदद करने के हज़ार तरीके" — the seva reel series.
//
// One group = one reel: a theme plus three concrete ways a viewer can help today.
// Kept as data (not inside the renderer) so the list can grow without touching
// the video code, and so the same wording feeds the caption, the narration and
// the on-screen cards.
//
// `hi` and `en` are the on-screen lines and stay short; `how` is the spoken
// detail. Everything is free to act on: no donation is required to do any of it.

const SEVA_GROUPS = [
  {
    key: 'education',
    titleHi: 'शिक्षा से मदद',
    titleEn: 'Help through education',
    ideas: [
      { hi: 'किसी बच्चे की स्कूल फीस भरें', en: "Pay a child's school fees", how: 'एक बच्चे की साल भर की फीस भरकर उसकी पढ़ाई नहीं रुकने दें।' },
      { hi: 'बच्चों को किताबें और बस्ता दें', en: 'Give books and a school bag', how: 'किताबें, कॉपी और बस्ता देकर स्कूल जाने का हौसला बढ़ाएं।' },
      { hi: 'स्कूल को पंखे और पानी दिलाएं', en: 'Help a school get fans and water', how: 'सरकारी स्कूल में पंखा या पीने का पानी जुटवाएं।' },
    ],
  },
  {
    key: 'kanya',
    titleHi: 'कन्या सेवा',
    titleEn: 'Stand with a daughter',
    ideas: [
      { hi: 'एक कन्या की पढ़ाई का खर्च उठाएं', en: "Sponsor a girl's education", how: 'एक बेटी की पूरी पढ़ाई का खर्च उठाएं।' },
      { hi: 'बेटी की शादी में सहयोग करें', en: "Help a daughter's wedding", how: 'जरूरतमंद परिवार की बेटी के नयादान में सहयोग करें।' },
      { hi: 'किशोरी को सैनिटरी पैड दें', en: 'Give sanitary pads to a girl', how: 'स्वच्छता की शर्म खत्म करें, सैनिटरी पैड पहुंचाएं।' },
    ],
  },
  {
    key: 'smile',
    titleHi: 'बच्चों की मुस्कान',
    titleEn: "A child's smile",
    ideas: [
      { hi: 'किसी बच्चे की मुस्कान बनें', en: "Be someone's smile", how: 'एक दिन किसी बच्चे के साथ खेलकर उसकी मुस्कान बनें।' },
      { hi: 'नंगे पैर बच्चों को जूते दें', en: 'Give shoes to a child', how: 'स्कूल जाने वाले बच्चों को जूते और मोज़े दें।' },
      { hi: 'बच्चे को खेल किट दिलाएं', en: 'Give a child a sports kit', how: 'बॉल, बैट या स्किपिंग रस्सी से खेल का हक दें।' },
    ],
  },
  {
    key: 'environment',
    titleHi: 'पर्यावरण की सेवा',
    titleEn: 'Serve the environment',
    ideas: [
      { hi: 'एक पेड़ लगाएं और उसे पालें', en: 'Plant a tree and care for it', how: 'सिर्फ पेड़ लगाना नहीं, उसे बड़ा होने तक पानी देना।' },
      { hi: 'नदी या तालाब की सफाई में जुड़ें', en: 'Join a river or pond clean-up', how: 'अपने इलाके की नदी, तालाब या कुएं की सफाई में हाथ बंटाएं।' },
      { hi: 'सड़क किनारे पौधों को पानी दें', en: 'Water roadside plants', how: 'रोज एक बाल्टी पानी सड़क किनारे लगे पौधों को दें।' },
    ],
  },
  {
    key: 'swachh',
    titleHi: 'स्वच्छता की सेवा',
    titleEn: 'Serve cleanliness',
    ideas: [
      { hi: 'मोहल्ले की सफाई में हाथ बंटाएं', en: 'Join a neighbourhood clean-up', how: 'अपनी गली की सफाई के लिए एक घंटा निकालें।' },
      { hi: 'कपड़े का थैला बांटें', en: 'Hand out cloth bags', how: 'पॉलीथिन की जगह कपड़े का थैला बांटें।' },
      { hi: 'मोहल्ले को प्लास्टिक मुक्त बनाएं', en: 'Make your street plastic-free', how: 'दुकानदारों से मिलकर प्लास्टिक कम करने का वादा कराएं।' },
    ],
  },
  {
    key: 'gau',
    titleHi: 'गौ और जीव सेवा',
    titleEn: 'Serve cows and animals',
    ideas: [
      { hi: 'गौशाला में गौ सेवा करें', en: 'Serve a cow at a gaushala', how: 'आसपास की गौशाला में चारा और सेवा का समय दें।' },
      { hi: 'बेसहारा जानवरों के लिए पानी रखें', en: 'Keep water for stray animals', how: 'छत या गली में पक्षियों और कुत्तों के लिए पानी रखें।' },
      { hi: 'किसी किसान को बीज दिलाएं', en: 'Help a farmer with seeds', how: 'एक किसान परिवार को अच्छे बीज और खाद दिलवाएं।' },
    ],
  },
  {
    key: 'health',
    titleHi: 'स्वास्थ्य की सेवा',
    titleEn: 'Serve health',
    ideas: [
      { hi: 'किसी की आंखों का ऑपरेशन कराएं', en: 'Fund an eye operation', how: 'मोतियाबिंद का ऑपरेशन कराकर किसी को रोशनी लौटाएं।' },
      { hi: 'बुजुर्ग की दवा का खर्च उठाएं', en: "Cover an elder's medicine", how: 'एक महीने की दवा का खर्च उठाकर जान बचाएं।' },
      { hi: 'रक्तदान करें', en: 'Donate blood', how: 'हर तीन महीने में एक बार रक्तदान करें।' },
    ],
  },
  {
    key: 'elder',
    titleHi: 'बुजुर्गों की सेवा',
    titleEn: 'Serve elders',
    ideas: [
      { hi: 'वृद्धाश्रम को राशन दें', en: 'Give rations to an old-age home', how: 'एक महीने का आटा, चावल और दाल पहुंचाएं।' },
      { hi: 'अनाथालय में एक दिन बिताएं', en: 'Spend a day at an orphanage', how: 'बच्चों के साथ खेलें, पढ़ाएं और सुनें।' },
      { hi: 'अस्पताल में मरीज के साथ रहें', en: 'Stand with a patient', how: 'अकेले भर्ती मरीज के लिए एक दिन का सहारा बनें।' },
    ],
  },
  {
    key: 'food',
    titleHi: 'अन्न और सर्दी',
    titleEn: 'Food and warmth',
    ideas: [
      { hi: 'एक दिन का भोजन दान करें', en: "Donate a day's meal", how: 'एक दिन का खाना किसी भूखे तक पहुंचाएं।' },
      { hi: 'जरूरतमंद को कंबल दें', en: 'Give a blanket', how: 'सर्दी में एक कंबल किसी की रात बचा सकता है।' },
      { hi: 'सर्दी में गर्म कपड़े जुटाएं', en: 'Arrange warm clothes', how: 'पुराने गर्म कपड़े धुलकर जरूरतमंद तक पहुंचाएं।' },
    ],
  },
  {
    key: 'livelihood',
    titleHi: 'रोजगार की सेवा',
    titleEn: 'Serve livelihood',
    ideas: [
      { hi: 'किसी को सिलाई मशीन दें', en: 'Give a sewing machine', how: 'एक सिलाई मशीन से घर का रोजगार शुरू हो सकता है।' },
      { hi: 'किसी को रोजगार दिलाएं', en: 'Help someone find work', how: 'अपने संपर्क से किसी को काम दिलाएं।' },
      { hi: 'किसी को कंप्यूटर सिखाएं', en: 'Teach computer skills', how: 'बेसिक कंप्यूटर सिखाकर नौकरी का रास्ता खोलें।' },
    ],
  },
  {
    key: 'reach',
    titleHi: 'स्कूल तक पहुंच',
    titleEn: 'Reach school',
    ideas: [
      { hi: 'बच्चे को साइकिल दिलाएं', en: 'Get a child a bicycle', how: 'दूर के स्कूल तक जाने के लिए साइकिल दिलाएं।' },
      { hi: 'गांव के स्कूल में लाइब्रेरी बनाएं', en: 'Build a village library', how: 'किताबों की अलमारी से एक लाइब्रेरी शुरू करें।' },
      { hi: 'किसी बच्चे का चश्मा दिलाएं', en: 'Get spectacles for a child', how: 'आंख जांचकर चश्मा दिलाएं, ब्लैकबोर्ड फिर साफ दिखेगा।' },
    ],
  },
  {
    key: 'together',
    titleHi: 'मिलकर मदद करें',
    titleEn: 'Help together',
    ideas: [
      { hi: 'दोस्तों के साथ फीस जुटाएं', en: "Crowdfund a child's fees", how: 'दस दोस्त, थोड़ा-थोड़ा — एक बच्चे की फीस पूरी।' },
      { hi: 'किसी बच्चे को मुफ्त पढ़ाएं', en: 'Teach a child for free', how: 'हफ्ते में दो घंटे पढ़ाकर बड़ा बदलाव लाएं।' },
      { hi: 'किसी की कानूनी मदद कराएं', en: 'Help someone get legal aid', how: 'जरूरतमंद को मुफ्त कानूनी सहायता से जोड़ें।' },
    ],
  },
];

const groupCount = SEVA_GROUPS.length;

function getGroup(index) {
  const n = Number(index);
  if (!Number.isFinite(n) || n < 0) return SEVA_GROUPS[0];
  return SEVA_GROUPS[Math.floor(n) % groupCount];
}

module.exports = { SEVA_GROUPS, groupCount, getGroup };
