// Series 6 — प्रेरणा एवं नैतिक मूल्य (Motivation & Moral Values) — रोज़ एक पाठ.
//
// Objective (नियमावली): उद्देश्य 1, 4, 6 — नैतिक मूल्यों में सुधार, देश-प्रेम,
// सामाजिक उत्थान एवं जनचेतना।
//
// Positive, non-political character-building content: a thought, three points, a
// simple story link, a task and a caution. No party politics, no false promises,
// no shaming.
//
// Bilingual (EN + HI).

const { CH, T } = require('./seriesEngine');

const items = [
  CH(
    T('Small habits, big life', 'छोटी आदतें, बड़ा जीवन'),
    T('You do not rise by one big act, but by daily small ones.', 'आप एक बड़े काम से नहीं, रोज़ के छोटे कामों से ऊँचे उठते हैं।'),
    [
      T('Daily small habits decide long-term success more than rare big efforts.', 'रोज़ की छोटी आदतें दीर्घकालिक सफलता कभी-कभार के बड़े प्रयास से अधिक तय करती हैं।'),
      T('A habit is easy to start and hard to keep — so keep it small.', 'आदत शुरू करना आसान, निभाना कठिन — इसलिए छोटी रखें।'),
      T('Consistency beats intensity.', 'निरंतरता तीव्रता से बेहतर है।'),
    ],
    T('Reading ten minutes daily teaches more in a year than a month of cramming.', 'रोज़ दस मिनट पढ़ना, महीनेभर रटने से अधिक सिखाता है।'),
    T('Pick ONE tiny daily habit and keep it for seven days.', 'एक छोटी दैनिक आदत चुनें और सात दिन निभाएँ।'),
    T('Start so small that you cannot fail.', 'इतना छोटा शुरू करें कि असफल ही न हों।'),
    T('Do not copy someone else\'s routine — build one that fits your life.', 'किसी और की दिनचर्या की नकल न करें — अपने जीवन के अनुकूल बनाएँ।'),
  ),
  CH(
    T('Honesty in small things', 'छोटी बातों में ईमानदारी'),
    T('Character is what you do when no one is watching.', 'चरित्र वह है जो आप करते हैं जब कोई देख नहीं रहा।'),
    [
      T('Honesty in small daily choices builds a trustworthy character.', 'रोज़ के छोटे चुनावों में ईमानदारी भरोसेमंद चरित्र बनाती है।'),
      T('A lie often needs many more lies to hide it.', 'एक झूठ को छिपाने के लिए अक्सर कई झूठ चाहिए।'),
      T('Truthfulness protects peace of mind.', 'सत्यनिष्ठा मन की शांति बचाती है।'),
    ],
    T('Returning extra change a shopkeeper gave by mistake is honesty in action.', 'दुकानदार द्वारा गलती से दिए अतिरिक्त पैसे लौटाना व्यवहार में ईमानदारी है।'),
    T('Correct one small dishonest thing you notice today.', 'आज दिखी एक छोटी बेईमानी को सुधारें।'),
    T('A clear conscience is worth more than a quick gain.', 'साफ़ अंतःकरण शीघ्र लाभ से अधिक मूल्यवान है।'),
    T('Be honest, but also kind — truth should not be used to hurt.', 'ईमानदार रहें, पर विनम्र भी — सत्य को चोट पहुँचाने का हथियार न बनाएँ।'),
  ),
  CH(
    T('Respect for every religion and caste', 'हर धर्म एवं जाति का सम्मान'),
    T('Different roads, one humanity.', 'अलग रास्ते, एक मानवता।'),
    [
      T('Respecting all faiths and castes keeps society united and peaceful.', 'सभी आस्थाओं एवं जातियों का सम्मान समाज को जोड़े एवं शांत रखता है।'),
      T('No religion teaches hatred; people often twist it for selfishness.', 'कोई धर्म घृणा नहीं सिखाता; लोग उसे स्वार्थ में तोड़-मरोड़ देते हैं।'),
      T('Harmony is a strength, not a compromise.', 'सद्भाव एक शक्ति है, समझौता नहीं।'),
    ],
    T('A neighbourhood that celebrates every festival together stays safe in every season.', 'जो मोहल्ला हर पर्व साथ मनाता है, वह हर मौसम में सुरक्षित रहता है।'),
    T('Learn one thing about a tradition different from your own.', 'अपनी परंपरा से भिन्न एक परंपरा के बारे में एक बात जानें।'),
    T('Unity in diversity is India\'s greatest strength.', 'विविधता में एकता भारत की सबसे बड़ी शक्ति है।'),
    T('Never spread messages that divide communities or spread fear.', 'सामुदायिक विभाजन या भय फैलाने वाले संदेश कभी न फैलाएँ।'),
  ),
  CH(
    T('The value of hard work', 'परिश्रम का मूल्य'),
    T('Luck favours the hand that keeps working.', 'भाग्य उस हाथ का साथ देता है जो काम करता रहता है।'),
    [
      T('Hard work turns an ordinary person into an expert over time.', 'परिश्रम समय के साथ साधारण व्यक्ति को विशेषज्ञ बनाता है।'),
      T('Skill beats shortcuts that break rules.', 'कौशल उन शॉर्टकट को हराता है जो नियम तोड़ते हैं।'),
      T('Effort you control; result you influence.', 'प्रयास आपके हाथ में; परिणाम आपके प्रभाव में।'),
    ],
    T('A self-taught tailor who practises daily earns more than one who waits for luck.', 'रोज़ अभ्यास करने वाला स्व-शिक्षित दर्जी भाग्य के भरोसे बैठे व्यक्ति से अधिक कमाता है।'),
    T('Finish one pending task today that you have been avoiding.', 'आज एक टाला हुआ काम पूरा करें।'),
    T('Work done well today becomes skill tomorrow.', 'आज किया अच्छा काम कल कौशल बनता है।'),
    T('Hard work without rest leads to burnout — balance it.', 'बिना आराम का परिश्रम थका देता है — संतुलन रखें।'),
  ),
  CH(
    T('Help others, help yourself', 'दूसरों की मदद, अपनी मदद'),
    T('When you lift someone, you rise too.', 'जब आप किसी को उठाते हैं, आप भी ऊँचे उठते हैं।'),
    [
      T('Service to others builds both society and character.', 'दूसरों की सेवा समाज एवं चरित्र दोनों बनाती है।'),
      T('Small help at the right time can change a life.', 'सही समय पर छोटी मदद जीवन बदल सकती है।'),
      T('Helping is a duty, not a show.', 'मदद कर्तव्य है, प्रदर्शन नहीं।'),
    ],
    T('Teaching a neighbour\'s child to read for an hour a week changes their future.', 'सप्ताह में एक घंटा पड़ोसी के बच्चे को पढ़ाना उसका भविष्य बदलता है।'),
    T('Help one person today without telling anyone about it.', 'आज बिना किसे बताए एक व्यक्ति की मदद करें।'),
    T('Real service expects no return.', 'सच्ची सेवा प्रतिफल की अपेक्षा नहीं करती।'),
    T('Do not help in a way that hurts someone\'s self-respect.', 'ऐसी मदद न करें जो किसी का स्वाभिमान तोड़े।'),
  ),
  CH(
    T('Discipline and self-control', 'अनुशासन एवं आत्म-नियंत्रण'),
    T('The one who rules himself needs no other master.', 'जो स्वयं पर शासन करता है, उसे और किसी मालिक की ज़रूरत नहीं।'),
    [
      T('Self-control protects you from addictions and impulsive mistakes.', 'आत्म-नियंत्रण आपको व्यसन एवं आवेगी गलतियों से बचाता है।'),
      T('Discipline creates freedom — it removes chaos.', 'अनुशासन स्वतंत्रता बनाता है — अव्यवस्था हटाता है।'),
      T('Anger and greed unchecked destroy peace.', 'अनियंत्रित क्रोध एवं लोभ शांति नष्ट करते हैं।'),
    ],
    T('A student who limits phone time studies better with the same hours.', 'जो विद्यार्थी फोन समय सीमित करता है, वह उन्हीं घंटों में बेहतर पढ़ता है।'),
    T('Choose one small self-control rule and follow it today.', 'एक छोटा आत्म-नियंत्रण नियम चुनें और आज पालन करें।'),
    T('Mastering the mind is the hardest and best victory.', 'मन पर विजय सबसे कठिन एवं सर्वोत्तम जीत है।'),
    T('Self-control is strength, not suppression — it needs patience.', 'आत्म-नियंत्रण शक्ति है, दमन नहीं — इसमें धैर्य चाहिए।'),
  ),
  CH(
    T('Love for the country in daily life', 'देश-प्रेम दैनिक जीवन में'),
    T('Patriotism is shown in duties, not only in slogans.', 'देशभक्ति कर्तव्यों में दिखती है, केवल नारों में नहीं।'),
    [
      T('Keeping your street clean, paying taxes and obeying law are patriotism.', 'गली साफ़ रखना, कर देना एवं कानून मानना देशभक्ति है।'),
      T('Helping a fellow citizen in need serves the nation.', 'ज़रूरत में साथी नागरिक की मदद राष्ट्र की सेवा है।'),
      T('Using resources wisely protects the country\'s future.', 'संसाधनों का विवेकपूर्ण उपयोग देश का भविष्य बचाता है।'),
    ],
    T('A citizen who keeps public property safe is serving the nation silently.', 'जो नागरिक सार्वजनिक संपत्ति बचाता है, वह चुपचाप राष्ट्र की सेवा करता है।'),
    T('Do one national duty today — keep a public place clean.', 'आज एक राष्ट्रीय कर्तव्य निभाएँ — सार्वजनिक स्थल साफ़ रखें।'),
    T('A strong nation is built by responsible citizens.', 'मज़बूत राष्ट्र ज़िम्मेदार नागरिकों से बनता है।'),
    T('Patriotism never means disrespecting others or breaking the law.', 'देशभक्ति का अर्थ दूसरों का अपमान या कानून तोड़ना कभी नहीं।'),
  ),
  CH(
    T('Time is the real wealth', 'समय ही असली धन है'),
    T('Time wasted is life wasted.', 'गया समय, गया जीवन।'),
    [
      T('Time cannot be earned back; only used well.', 'समय लौटकर नहीं आता; केवल सदुपयोग हो सकता है।'),
      T('Planning the day saves hours of confusion.', 'दिन की योजना घंटों की उलझन बचाती है।'),
      T('Idle hours often turn into harmful habits.', 'खाली घंटे अक्सर हानिकारक आदतों में बदलते हैं।'),
    ],
    T('A worker who plans the night before starts faster in the morning.', 'जो रात में योजना बनाता है, वह सुबह तेज़ शुरुआत करता है।'),
    T('Write a short to-do list for tomorrow before sleeping.', 'सोने से पहले कल के लिए छोटी सूची बनाएँ।'),
    T('Respecting time is respecting life.', 'समय का सम्मान जीवन का सम्मान है।'),
    T('Rest is also part of using time well — do not confuse it with wasting.', 'आराम भी समय का सदुपयोग है — इसे बर्बादी न समझें।'),
  ),
  CH(
    T('Education is everyone\'s right', 'शिक्षा सबका अधिकार'),
    T('No child should be left out of school.', 'कोई बच्चा स्कूल से बाहर न छूटे।'),
    [
      T('Every child has the right to free education up to 14 years.', '14 वर्ष तक हर बच्चे को निःशुल्क शिक्षा का अधिकार है।'),
      T('Educating a girl educates a whole family.', 'बालिका को पढ़ाना पूरे परिवार को पढ़ाना है।'),
      T('Learning does not stop at school — adults can learn too.', 'सीखना स्कूल पर नहीं रुकता — वयस्क भी सीख सकते हैं।'),
    ],
    T('A village reading circle can teach adults who missed school.', 'गाँव का पठन-मंडल उन वयस्कों को सिखा सकता है जो स्कूल से चूक गए।'),
    T('Check that one out-of-school child is enrolled this week.', 'इस सप्ताह एक स्कूल-बाहर बच्चे का नामांकन सुनिश्चित करें।'),
    T('Education is the ladder that no one should be denied.', 'शिक्षा वह सीढ़ी है जिससे किसी को वंचित नहीं रखना चाहिए।'),
    T('Never pull a child out of school for work — it breaks the law and the future.', 'काम के लिए बच्चे को स्कूल से न निकालें — यह कानून एवं भविष्य दोनों तोड़ता है।'),
  ),
  CH(
    T('Service before self', 'स्वार्थ से पहले सेवा'),
    T('The best way to find yourself is to serve.', 'स्वयं को पाने का सर्वोत्तम तरीका सेवा है।'),
    [
      T('Volunteering builds skills, character and community.', 'स्वयंसेवा कौशल, चरित्र एवं समुदाय बनाती है।'),
      T('A volunteer gives time, not only money.', 'स्वयंसेवक समय देता है, केवल धन नहीं।'),
      T('Service brings inner satisfaction that money cannot.', 'सेवा वह आंतरिक संतुष्टि देती है जो धन नहीं दे सकता।'),
    ],
    T('A student volunteering to teach weekends gains confidence along with service.', 'सप्ताहांत पढ़ाने वाला विद्यार्थी सेवा के साथ आत्मविश्वास पाता है।'),
    T('Give one hour of your time to someone without expecting anything.', 'किसी को बिना कुछ अपेक्षा के एक घंटा दें।'),
    T('Time given is more valuable than things given.', 'दिया गया समय दी गई वस्तु से अधिक मूल्यवान है।'),
    T('Serve regularly, not only on a festival or a photo opportunity.', 'केवल पर्व या फोटो के अवसर पर नहीं, नियमित सेवा करें।'),
  ),
  CH(
    T('Kindness costs nothing', 'दया में कुछ खर्च नहीं'),
    T('A kind word can heal what medicine cannot.', 'एक विनम्र शब्द वह भर सकता है जो दवा नहीं।'),
    [
      T('Kindness to elders, children and animals makes a society gentle.', 'वृद्धों, बच्चों एवं पशुओं के प्रति दया समाज को सौम्य बनाती है।'),
      T('Kindness is free yet priceless.', 'दया निःशुल्क है पर अमूल्य।'),
      T('Small kindnesses create large trust.', 'छोटी दयाएँ बड़ा भरोसा बनाती हैं।'),
    ],
    T('Offering water to a thirsty stranger on a hot day is simple kindness.', 'गर्मी के दिन प्यासे अजनबी को पानी देना सरल दया है।'),
    T('Perform one act of kindness today and keep it quiet.', 'आज दया का एक कार्य करें और चुप रहें।'),
    T('Be kind — everyone is fighting a battle you cannot see.', 'दयालु रहें — हर कोई वह युद्ध लड़ रहा है जो आप नहीं देखते।'),
    T('Kindness never means tolerating wrong or harmful behaviour.', 'दया का अर्थ गलत या हानिकारक व्यवहार सहना कभी नहीं।'),
  ),
  CH(
    T('Save water, save life', 'जल बचाओ, जीवन बचाओ'),
    T('Every drop saved today is water for tomorrow.', 'आज बचाई हर बूँद कल का जल है।'),
    [
      T('Clean water is limited; saving it is everyone\'s duty.', 'स्वच्छ जल सीमित है; इसे बचाना सबका कर्तव्य है।'),
      T('Fixing a leaking tap saves water and money.', 'टपकता नल ठीक करना जल एवं धन दोनों बचाता है।'),
      T('Rainwater and reuse reduce pressure on rivers and wells.', 'वर्षा-जल एवं पुनरुपयोग नदियों व कुओं पर दबाव घटाते हैं।'),
    ],
    T('A household that reuses rinse water for plants saves buckets every week.', 'जो परिवार पौधों में पुनः उपयोग करता है, वह हर सप्ताह बाल्टियाँ बचाता है।'),
    T('Find and fix one water leak at home this week.', 'इस सप्ताह घर में एक जल-रिसाव ढूँढ़ें और ठीक करें।'),
    T('Water saved is a gift to every living being.', 'बचाया जल हर जीव को उपहार है।'),
    T('Do not waste water even if the tap is shared or public.', 'नल साझा या सार्वजनिक हो तो भी जल बर्बाद न करें।'),
  ),
  CH(
    T('Every drop of effort counts', 'प्रयास की हर बूँद मायने रखती है'),
    T('Many small efforts make one great change.', 'अनेक छोटे प्रयास एक बड़ा बदलाव बनाते हैं।'),
    [
      T('A single person cleaning a street inspires others to join.', 'अकेला व्यक्ति गली साफ़ करे तो दूसरे भी जुड़ते हैं।'),
      T('Collective small action beats one big plan never started.', 'छोटा सामूहिक कर्म उस बड़ी योजना से बेहतर है जो कभी शुरू नहीं हुई।'),
      T('Change begins with one willing person.', 'बदलाव एक इच्छुक व्यक्ति से शुरू होता है।'),
    ],
    T('One volunteer teaching ten children changes a whole village\'s future.', 'एक स्वयंसेवक दस बच्चों को पढ़ाए तो पूरे गाँव का भविष्य बदलता है।'),
    T('Start one small good work today, even if alone.', 'आज एक छोटा अच्छा काम शुरू करें, भले अकेले हों।'),
    T('Do not wait for a big opportunity — begin with what you have.', 'बड़े अवसर की प्रतीक्षा न करें — जो है उसी से शुरू करें।'),
    T('Good work needs patience; results come slowly.', 'अच्छे काम में धैर्य चाहिए; परिणाम धीरे आते हैं।'),
  ),
];

module.exports = {
  key: 'prerna',
  emoji: '🌟',
  category: 'motivation',
  title: T('Motivation & Moral Values — One Lesson a Day', 'प्रेरणा एवं नैतिक मूल्य — रोज़ एक पाठ'),
  note: T('Positive, non-political character-building content for daily life.',
    'दैनिक जीवन हेतु सकारात्मक, गैर-राजनीतिक चरित्र-निर्माण सामग्री।'),
  cta: T('Share one lesson that changed your day.',
    'वह एक पाठ साझा करें जिसने आपका दिन बदला।'),
  verified: '2026-01',
  items,
};
