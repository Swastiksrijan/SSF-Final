import React from "react";

const HumanityAndTruth = () => {
  return (
    <div className="w-full bg-[#FAFAF8] text-[#2B2B2B] font-mukta selection:bg-[#C8A24D]/20">
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#1F3A5F] font-hindi text-lg mb-4 tracking-wide">
            मानवता और सत्य | Humanity & Truth
          </p>
          <h1 className="text-2xl md:text-6xl font-hindi font-bold text-[#1F3A5F] mb-6 leading-tight break-words">
            मानवता और सत्य : जैसा संसार वास्तव में है
          </h1>
          <p className="text-xl md:text-2xl font-merriweather italic text-[#5A3E2B] opacity-80">
            Humanity and Truth: As the World Truly Is
          </p>
          <div className="mt-10 h-px w-24 bg-[#C8A24D] mx-auto opacity-50"></div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="py-8 md:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-[#F2F1ED] p-5 sm:p-12 rounded-lg border-l-4 border-[#C8A24D]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-lg md:text-xl font-hindi italic leading-relaxed text-[#2B2B2B]">
                मैंने देखा और महसूस किया है कि हर इंसान अपने जीवन में कुछ न कुछ अनुभव करता है। कुछ अनुभव सुखद होते हैं, कुछ दर्दनाक। यह पृष्ठ किसी धर्म का प्रचार नहीं है, किसी विचारधारा का विरोध नहीं। यह केवल जीवन के अनुभवों और मानवता के सार को साझा करने का प्रयास है।
              </p>
              <p className="text-lg md:text-xl font-hindi italic leading-relaxed text-[#2B2B2B]">
                यहाँ न मानना भी स्वीकार है और मानना भी। सत्य आदेश से नहीं, अनुभव से प्रकट होता है।
              </p>
            </div>
            <div className="pt-4 border-t border-[#C8A24D]/20">
              <p className="text-base md:text-lg font-merriweather italic leading-relaxed text-[#5A3E2B]">
                I have seen and felt that every human being experiences something in their life. Some experiences are pleasant, some painful. This page is not a promotion of any religion, nor an opposition to any ideology. It is merely an attempt to share the experiences of life and the essence of humanity.
              </p>
              <p className="text-base md:text-lg font-merriweather italic leading-relaxed text-[#5A3E2B] mt-2">
                Here, not believing is also acceptable, as is believing. Truth is revealed not by command, but by experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-20">

        {/* 2. संसार : अनंत और अज्ञात */}
        <section>
          <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F] mb-6">
            2. संसार : अनंत और अज्ञात <span className="block text-xl font-merriweather font-normal opacity-60 mt-1">The World: Infinite and Unknown</span>
          </h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p>संसार अनंत है। आज तक कोई यह नहीं कह पाया कि इसकी सीमा कहाँ है। विज्ञान हमें बताता है कि ब्रह्मांड फैल रहा है, अरबों आकाशगंगाएँ हैं, ऊर्जा नष्ट नहीं होती।</p>
                <p>धर्म और शास्त्र कहते हैं कि चेतना शाश्वत है, सृष्टि का कोई आदि नहीं और सब कुछ नियम में बंधा है।</p>
              </div>
              <div className="space-y-4 text-[#5A3E2B] italic border-l-2 border-[#F2F1ED] pl-6">
                <p>The world is infinite. To this day, no one has been able to say where its limit is. Science tells us that the universe is expanding, there are billions of galaxies, energy is not destroyed.</p>
                <p>Religion and scriptures say that consciousness is eternal, there is no beginning to creation, and everything is bound by rules.</p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-[#F2F1ED] border-l-2 border-[#1F3A5F] flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-bold">निष्कर्ष: हम बहुत कुछ जानते हैं, पर सब कुछ नहीं।</p>
              <p className="text-[#5A3E2B] italic">Conclusion: We know much, but not everything.</p>
            </div>
          </div>
        </section>

        {/* 3. क्या कोई शक्ति है? */}
        <section>
          <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F] mb-6">
            3. क्या कोई शक्ति है? <span className="block text-xl font-merriweather font-normal opacity-60 mt-1">Is There a Power?</span>
          </h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p>कुछ कहते हैं: “सब नियम से चलता है।”</p>
                <p>कुछ कहते हैं: “कोई शक्ति है, ईश्वर है।”</p>
                <p>कुछ कहते हैं: “कुछ नहीं है।”</p>
              </div>
              <div className="text-[#5A3E2B] italic border-l-2 border-[#F2F1ED] pl-6">
                <p>Some say: "Everything runs by rules."</p>
                <p>Some say: "There is some power, there is God."</p>
                <p>Some say: "There is nothing."</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#F2F1ED]">
              <p className="font-bold text-[#5A3E2B]">सत्य यह है कि | The Truth is that:</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>जन्म हमारे नियंत्रण में नहीं है</li>
                  <li>मृत्यु हमारे तर्क से नहीं रुकती</li>
                  <li>चेतना का अंतिम रहस्य अभी भी पूरी तरह समझा नहीं गया है</li>
                </ul>
                <ul className="list-disc pl-6 space-y-2 text-[#5A3E2B] italic border-l-2 border-[#F2F1ED]">
                  <li>Birth is not in our control</li>
                  <li>Death does not stop by our logic</li>
                  <li>The ultimate mystery of consciousness is still not fully understood</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. धर्म और शास्त्र : सार क्या कहते हैं */}
        <section>
          <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F] mb-6">
            4. धर्म और शास्त्र : सार क्या कहते हैं <span className="block text-xl font-merriweather font-normal opacity-60 mt-1">Religion and Scriptures: What is the Essence?</span>
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="p-6 border border-[#F2F1ED] hover:border-[#C8A24D] transition-colors bg-white">
              <p className="font-hindi font-bold text-[#5A3E2B]">वेद | Vedas:</p>
              <p className="italic">“एकं सत्, विप्रा बहुधा वदन्ति”</p>
              <p className="text-sm opacity-60">(Truth is one, though the sages know it as many.)</p>
            </div>
            <div className="p-6 border border-[#F2F1ED] hover:border-[#C8A24D] transition-colors bg-white">
              <p className="font-hindi font-bold text-[#5A3E2B]">कुरान | Quran:</p>
              <p className="italic">“एक जान बचाना पूरी मानवता को बचाना है”</p>
              <p className="text-sm opacity-60">(To save one life is to save all of humanity.)</p>
            </div>
            <div className="p-6 border border-[#F2F1ED] hover:border-[#C8A24D] transition-colors bg-white">
              <p className="font-hindi font-bold text-[#5A3E2B]">बाइबिल | Bible:</p>
              <p className="italic">“प्रेम के बिना सब व्यर्थ है”</p>
              <p className="text-sm opacity-60">(Everything is in vain without love.)</p>
            </div>
            <div className="p-6 border border-[#F2F1ED] hover:border-[#C8A24D] transition-colors bg-white">
              <p className="font-hindi font-bold text-[#5A3E2B]">बुद्ध - महावीर | Buddha - Mahavir:</p>
              <p className="italic">“करुणा और अहिंसा ही मार्ग है”</p>
              <p className="text-sm opacity-60">(Compassion and non-violence is the way.)</p>
            </div>
          </div>
          <div className="p-8 bg-[#F2F1ED] space-y-4 text-center">
            <div className="space-y-1">
              <p className="text-xl font-bold font-hindi">जहाँ धर्म जीवन बचाए — वही धर्म है।</p>
              <p className="text-lg italic text-[#5A3E2B]">Where religion saves life — that is true religion.</p>
            </div>
            <div className="space-y-1 opacity-60">
              <p className="text-xl font-bold font-hindi">जहाँ धर्म जीवन कुचले — वह केवल सत्ता है।</p>
              <p className="text-lg italic text-[#5A3E2B]">Where religion crushes life — it is merely power.</p>
            </div>
          </div>
        </section>

        {/* 5. राम : मानव मूल्य का आदर्श */}
        <section className="bg-white p-8 md:p-12 shadow-sm border border-[#F2F1ED]">
          <h2 className="text-xl md:text-3xl font-hindi font-bold text-[#1F3A5F] mb-6">
            5. राम : मानव मूल्य का आदर्श <span className="block text-lg md:text-xl font-merriweather font-normal opacity-60 mt-1">Ram: The Ideal of Human Values</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-[#F2F1ED]">
            <p className="text-lg text-justify leading-relaxed">
              राम को किसी पूजा, मूर्ति या परंपरा तक सीमित नहीं किया गया है। राम उनके चरित्र और मानव मूल्यों के आदर्श प्रतीक हैं। वे हमें बताते हैं कि मानवता का असली माप बिना भेदभाव, करुणा, मर्यादा और समभाव में है।
            </p>
            <p className="text-lg text-justify leading-relaxed text-[#5A3E2B] italic">
              Ram is not limited to any worship, idol, or tradition. Ram is the ideal symbol of character and human values. They tell us that the true measure of humanity lies in non-discrimination, compassion, dignity, and equanimity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2">
              <p className="font-bold text-[#5A3E2B]">बिना भेदभाव का आचरण | Conduct without discrimination:</p>
              <p className="text-base opacity-80">राजा, वनवासी, ऋषि, वानर — सबको समान सम्मान। (Equal respect for all.)</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-[#5A3E2B]">मर्यादा | Dignity & Limits:</p>
              <p className="text-base opacity-80">शक्ति और अधिकार होने के बावजूद संयम और उत्तरदायित्व। (Restraint and responsibility despite having power.)</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-[#5A3E2B]">सुख-दुःख में समभाव | Equanimity:</p>
              <p className="text-base opacity-80">जीवन के उतार-चढ़ाव में संतुलन। (Balance in the ups and downs of life.)</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-[#5A3E2B]">हर जीव में चेतना का सम्मान | Respect for consciousness in all:</p>
              <p className="text-base opacity-80">पशु, पक्षी, नदी, वन — उपयोग नहीं, सम्मान। (Animals, birds, rivers, forests — respect, not just use.)</p>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-[#F2F1ED] text-center space-y-2">
            <p className="text-lg italic text-[#1F3A5F] font-bold">“आज के समय में सीख: राम के नाम पर लड़ाई नहीं, उनके गुणों से समाधान।”</p>
            <p className="text-base italic text-[#5A3E2B]">"Lesson for today: Not war in the name of Ram, but solutions through his qualities."</p>
          </div>
        </section>

        {/* 6. अच्छाई और बुराई */}
        <section>
          <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F] mb-6">
            6. अच्छाई और बुराई <span className="block text-xl font-merriweather font-normal opacity-60 mt-1">Good and Evil</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-lg">
              <p><span className="font-bold text-[#2d6a4f]">अच्छाई:</span> भूखे को खाना देना, कमजोर की मदद करना, सच्चाई के लिए खड़ा होना।</p>
              <p><span className="font-bold text-[#d90429]">बुराई:</span> ताकत के साथ संवेदना का अभाव, लाभ को जीवन से ऊपर रखना।</p>
              <p className="italic pt-4">कोई बच्चा बुरा पैदा नहीं होता। पर परिस्थिति उसे कठोर बना देती है।</p>
            </div>
            <div className="space-y-4 text-lg text-[#5A3E2B] italic border-l-2 border-[#F2F1ED] pl-6">
              <p><span className="font-bold text-[#2d6a4f]">Good:</span> Feeding the hungry, helping the weak, standing for truth.</p>
              <p><span className="font-bold text-[#d90429]">Evil:</span> Lack of sensitivity with power, keeping profit above life.</p>
              <p className="pt-4">No child is born evil. But circumstances make them harsh.</p>
            </div>
          </div>
        </section>

        {/* 7. समाज, जाति, वर्ग, राष्ट्र */}
        <section>
          <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F] mb-6">
            7. समाज, जाति, वर्ग, राष्ट्र <span className="block text-xl font-merriweather font-normal opacity-60 mt-1">Society, Caste, Class, Nation</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg leading-relaxed">
            <p>
              जाति, धर्म, देश — पहचान के लिए बने हैं, दीवार नहीं बनने के लिए। एक गरीब माँ, भूख और दर्द = कोई धर्म या देश नहीं जानता। दर्द और मानवता किसी सीमा में बंधी नहीं होती।
            </p>
            <p className="text-[#5A3E2B] italic border-l-2 border-[#F2F1ED] pl-6">
              Caste, religion, country — are made for identity, not to become walls. A poor mother, hunger and pain = knows no religion or country. Pain and humanity are not bound by any boundaries.
            </p>
          </div>
        </section>

        {/* 8 & 9. शासन, सत्ता और तटस्थता */}
        <section className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F]">
              8. शासन, सत्ता <span className="block text-lg font-merriweather font-normal opacity-60 mt-1">Governance and Power</span>
            </h2>
            <p className="text-justify leading-relaxed">जहाँ शक्ति है वहाँ जवाबदेही जरूरी है। जब लोग डर के कारण चुप रहते हैं, अन्याय सामान्य बन जाता है।</p>
            <p className="text-[#5A3E2B] italic text-justify leading-relaxed">Where there is power, accountability is necessary. When people stay silent out of fear, injustice becomes normal.</p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F]">
              9. तटस्थता का भ्रम <span className="block text-lg font-merriweather font-normal opacity-60 mt-1">The Illusion of Neutrality</span>
            </h2>
            <p className="text-justify leading-relaxed">हर स्थिति में चुप रहना सही नहीं होता। जब अन्याय साफ दिखे और हम तटस्थ रहें — तो हम भी उस पीड़ा का हिस्सा बन जाते हैं।</p>
            <p className="text-[#5A3E2B] italic text-justify leading-relaxed">It is not right to remain silent in every situation. When injustice is clearly visible and we remain neutral, we also become part of that suffering.</p>
          </div>
        </section>

        {/* 10. प्रकृति और अन्य जीव */}
        <section>
          <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F] mb-6">
            10. प्रकृति और अन्य जीव <span className="block text-xl font-merriweather font-normal opacity-60 mt-1">Nature and Other Beings</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg leading-relaxed mb-6">
            <p>जंगल, नदियाँ, जीव — ये सब जीवन का हिस्सा हैं। हमारा कर्तव्य है उन्हें सम्मान देना, उपयोग नहीं करना।</p>
            <p className="text-[#5A3E2B] italic border-l-2 border-[#F2F1ED] pl-6">Forests, rivers, creatures — they are all part of life. Our duty is to give them respect, not just use them.</p>
          </div>
          <div className="p-6 bg-[#F2F1ED] italic text-center space-y-2">
            <p className="text-lg">“मानव-प्रकृति संतुलन: यह प्रकृति के साथ जीने का समय है।”</p>
            <p className="text-base text-[#5A3E2B]">"Human-nature balance: It is time to live with nature."</p>
          </div>
        </section>

        {/* 11 & 12. आज की दुनिया और ब्रह्मांड */}
        <section className="space-y-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F]">
                11. आज की दुनिया <span className="block text-lg font-merriweather font-normal opacity-60 mt-1">Today's World and Future</span>
              </h2>
              <p>Digital जुड़ाव है, लेकिन अकेलापन बढ़ा है। यदि भविष्य केवल जीतना सिखाएगा, हिंसा बढ़ेगी। यदि भविष्य महसूस करना सिखाएगा, मानवता बचेगी।</p>
              <p className="text-[#5A3E2B] italic">Digital connectivity is there, but loneliness has increased. If the future only teaches winning, violence will increase. If the future teaches feeling, humanity will survive.</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-hindi font-bold text-[#1F3A5F]">
                12. ब्रह्मांड और अज्ञान <span className="block text-lg font-merriweather font-normal opacity-60 mt-1">The Universe and Mystery</span>
              </h2>
              <p>ब्रह्मांड अज्ञात है, चेतना का रहस्य अभी तक पूरी तरह समझा नहीं गया। विनम्रता: “हम सब अधूरे हैं और यही मानवता है।”</p>
              <p className="text-[#5A3E2B] italic">The universe is unknown, the mystery of consciousness is not yet fully understood. Humility: "We are all incomplete, and that is humanity."</p>
            </div>
          </div>
        </section>

        {/* 13. Swastik Srijan Foundation का अनुभव */}
        <section className="bg-[#1F3A5F] text-white p-8 md:p-12 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <h2 className="text-2xl md:text-3xl font-hindi font-bold mb-8 relative z-10">
            13. Swastik Srijan Foundation का अनुभव <span className="block text-xl font-merriweather font-normal opacity-60 mt-1">Experience of Swastik Srijan Foundation</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="space-y-2 p-6 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-[#C8A24D]">भूख | Hunger</p>
              <p className="text-sm opacity-80 uppercase tracking-widest">इंसान को बदल देती है</p>
              <p className="text-xs opacity-60 italic">Changes a human</p>
            </div>
            <div className="space-y-2 p-6 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-[#C8A24D]">अपमान | Insult</p>
              <p className="text-sm opacity-80 uppercase tracking-widest">चुप हिंसा बन जाता है</p>
              <p className="text-xs opacity-60 italic">Becomes silent violence</p>
            </div>
            <div className="space-y-2 p-6 bg-white/5 rounded-xl">
              <p className="text-3xl font-bold text-[#C8A24D]">सुनना | Listening</p>
              <p className="text-sm opacity-80 uppercase tracking-widest">सबसे बड़ा उपचार है</p>
              <p className="text-xs opacity-60 italic">Is the greatest cure</p>
            </div>
          </div>
          <div className="mt-12 text-center space-y-2 relative z-10">
            <p className="text-xl font-bold font-hindi uppercase tracking-wider">मानवता कोई विचार नहीं, अभ्यास है।</p>
            <p className="text-lg italic text-[#C8A24D]">Humanity is not a thought, but a practice.</p>
          </div>
        </section>

        {/* 14. अंतिम निष्कर्ष : सबका साझा सत्य */}
        <section className="text-center py-12 border-t border-[#F2F1ED]">
          <h2 className="text-3xl md:text-4xl font-hindi font-bold text-[#1F3A5F] mb-8">
            14. अंतिम निष्कर्ष : सबका साझा सत्य <span className="block text-2xl font-merriweather font-normal opacity-60 mt-1">Final Conclusion: A Shared Truth</span>
          </h2>
          <div className="space-y-8 text-xl md:text-2xl leading-relaxed">
            <div className="font-merriweather italic text-[#5A3E2B] space-y-4">
              <p>“मानवता, करुणा और सत्य हर अनुभव में मौजूद हैं। हर व्यक्ति, हर जीव और हर परिस्थिति से हम मानवता को समझ सकते हैं।”</p>
              <p className="text-lg">"Humanity, compassion, and truth exist in every experience. We can understand humanity through every person, every creature, and every circumstance."</p>
            </div>
            <div className="pt-8 border-t border-dashed border-[#F2F1ED]">
              <p className="text-[#2B2B2B] font-hindi font-bold">
                सत्य यह है कि हर इंसान, हर जीव और हर अनुभव का सम्मान करना ही मानवता है।
              </p>
              <p className="text-[#5A3E2B] text-lg italic mt-2">
                The truth is that respecting every human, every creature, and every experience is humanity.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER SIGNATURE */}
      <footer className="bg-[#F2F1ED] py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <p className="text-lg md:text-xl font-hindi leading-relaxed text-[#2B2B2B] italic">
              यह लेख किसी निष्कर्ष को थोपने का प्रयास नहीं है। यह केवल अनुभव, अवलोकन और जीवन से उभरे सत्य को साझा करने का एक प्रयास है — ताकि हर व्यक्ति अपने भीतर झांक कर स्वयं सत्य महसूस कर सके।
            </p>
            <p className="text-base md:text-lg font-merriweather italic text-[#5A3E2B]">
              This article is not an attempt to impose any conclusion. It is merely an attempt to share the truth derived from experience, observation, and life — so that every individual can look within and feel the truth for themselves.
            </p>
          </div>

          <div className="pt-8">
            <div className="h-px w-16 bg-[#C8A24D] mx-auto mb-6"></div>
            <h3 className="text-2xl font-hindi font-bold text-[#1F3A5F]">Ramesh Pandey</h3>
            <p className="text-[#5A3E2B] font-bold">Founder</p>
            <p className="text-[#1F3A5F]">Swastik Srijan Foundation</p>
          </div>

          <p className="text-xs text-zinc-400 mt-20 uppercase tracking-[0.2em]">
            Humanity & Truth &bull; जैसा संसार वास्तव में है &bull; As the World Truly Is
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HumanityAndTruth;
