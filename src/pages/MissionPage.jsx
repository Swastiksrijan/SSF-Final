import { motion } from "framer-motion";
import {
  FaHandHoldingHeart,
  FaGlobeAmericas
} from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import pageHeader from "../assets/page-header.jpg";

export default function MissionPage() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[48vh] md:min-h-[62vh] w-full overflow-hidden bg-[#001529] text-white">
        <img
          src={pageHeader}
          alt="Community education and participation"
          className="absolute inset-0 h-full w-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-[#001529]/55"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/25 via-[#001529]/50 to-[#001529]/90"></div>
        <div className="relative z-10 flex min-h-[48vh] md:min-h-[62vh] items-center justify-center px-5 py-20 text-center">
          <div className="max-w-5xl">
            <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-[#7dd3a8]">
              Swastik Srijan Foundation / स्थापना
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white">
              Mission & Vision
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg md:text-2xl text-[#f1f5f9] leading-relaxed">
              Our direction, purpose and commitment to community development.
            </p>
            <p className="mx-auto mt-2 max-w-3xl text-base md:text-xl text-[#d5e1ea] leading-relaxed">
              हमारा मिशन और विज़न — शिक्षा, स्वास्थ्य, कौशल और सामुदायिक विकास की दिशा।
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-[#002344] mb-4">
                  Who We Are
                </h2>
                <div className="w-20 h-1.5 bg-[#fb8500] rounded-full"></div>
              </div>

              <div className="space-y-6">
                <p className="text-xl text-zinc-700 leading-relaxed font-serif italic">
                  "Swastik Srijan Foundation is a grassroots non-profit organization established in 2013."
                </p>

                <p className="text-lg text-zinc-600 leading-relaxed">
                  We are a collective of volunteers, professionals, and changemakers committed to building a self-reliant and dignified society through education and ethical leadership.
                </p>

                <p className="text-lg font-hindi text-zinc-500 border-l-4 border-zinc-100 pl-4 md:pl-6">
                  स्वस्तिक सृजन फाउंडेशन 2013 में स्थापित एक जमीनी स्तर का गैर-लाभकारी संगठन है।
                </p>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -inset-2 md:-inset-4 bg-[#fb8500]/10 rounded-[2rem] md:rounded-[3rem] -rotate-3"></div>
              <img
                src="/images/real/girls-study-group-mat.jpg"
                alt="Community Engagement"
                className="relative z-10 w-full aspect-[4/3] md:h-[450px] object-cover rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="py-16 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fb8500_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-[#fb8500]">
              A Commitment to Inclusive Growth
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed font-medium mb-8">
              Our vision reflects our commitment to inclusive growth, ethical action, and human dignity. We aspire to create a society where development reaches the last person and contributes to a stronger nation and a better world.
            </p>
            <div className="w-24 h-1 bg-[#fb8500] mx-auto mb-8 opacity-50"></div>
            <p className="text-lg md:text-xl leading-relaxed opacity-80 italic">
              हमारी दृष्टि समावेशी विकास, नैतिक कार्य और मानव गरिमा के प्रति हमारी प्रतिबद्धता को दर्शाती है, जहाँ विकास अंतिम व्यक्ति तक पहुँचे और राष्ट्र व विश्व के कल्याण में योगदान दे।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="py-20 md:py-32 bg-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-14 md:mb-20">
            <span className="text-[#fb8500] font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
              Our Direction • हमारा मार्ग
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-serif font-bold text-[#002344] mb-6">
              Our Vision & Mission
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed">
              Our Vision is realized through our Mission and guided by our Core Values.
            </p>
            <p className="mt-2 text-base md:text-lg text-zinc-500 leading-relaxed">
              हमारा विज़न हमारे मिशन के माध्यम से साकार होता है और हमारे मूल्यों द्वारा निर्देशित है।
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="group p-8 md:p-12 rounded-[2.5rem] bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-orange-50 to-transparent rounded-bl-[5rem]"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8">
                  <FaGlobeAmericas className="text-3xl text-[#fb8500]" />
                </div>
                <span className="text-[#fb8500] font-bold uppercase tracking-widest text-xs mb-3 block">
                  VISION | दृष्टि कथन
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#002344] mb-6">Our Vision</h3>
                <p className="text-xl md:text-2xl text-[#002344] font-medium leading-relaxed">
                  To build an inclusive, ethical, and empowered society where every individual has access to education, health, dignity, opportunities, and a secure future—contributing to nation-building and global well-being.
                </p>
                <p className="mt-6 text-lg text-zinc-500 italic border-l-2 border-orange-200 pl-6 leading-relaxed">
                  एक ऐसा समावेशी, नैतिक और सशक्त समाज बनाना जहाँ प्रत्येक व्यक्ति को शिक्षा, स्वास्थ्य, सम्मान, अवसर और सुरक्षित भविष्य प्राप्त हो — राष्ट्र निर्माण के माध्यम से वैश्विक कल्याण की दिशा में।
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="group p-8 md:p-12 rounded-[2.5rem] bg-[#002344] text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-white/10 to-transparent rounded-bl-[5rem]"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                  <FaHandHoldingHeart className="text-3xl text-[#fb8500]" />
                </div>
                <span className="text-orange-300 font-bold uppercase tracking-widest text-xs mb-3 block">
                  MISSION | ध्येय कथन
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Our Mission</h3>
                <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                  To empower marginalized and underprivileged communities through education, healthcare, and livelihood initiatives; ensure the protection, development, and dignity of women, children, differently-abled persons, and senior citizens; promote sustainable development, environmental awareness, and ethical consciousness; and collaborate transparently with government, society, and other organizations to implement welfare programs effectively.
                </p>
                <p className="mt-6 text-lg text-blue-200/80 italic border-l-2 border-blue-400/30 pl-6 leading-relaxed">
                  शिक्षा, स्वास्थ्य और आजीविका के माध्यम से वंचित व उपेक्षित वर्गों को सशक्त बनाना; महिलाओं, बच्चों, दिव्यांगों और वरिष्ठ नागरिकों की सुरक्षा, विकास और सम्मान सुनिश्चित करना; ग्रामीण एवं शहरी क्षेत्रों में सतत विकास, पर्यावरण संरक्षण और नैतिक जागरूकता को बढ़ावा देना; तथा सरकार, समाज और अन्य संस्थाओं के साथ सहयोगात्मक एवं पारदर्शी ढंग से जनकल्याणकारी कार्यक्रमों का संचालन करना।
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-10 md:mt-14 grid md:grid-cols-2 gap-8">
            <div className="rounded-3xl bg-white border border-zinc-100 p-8 md:p-10 shadow-lg">
              <span className="text-[#fb8500] font-bold uppercase tracking-widest text-xs">Vision in Perspective | दृष्टि का परिप्रेक्ष्य</span>
              <h3 className="mt-3 text-2xl md:text-3xl font-serif font-bold text-[#002344]">A Commitment to Inclusive Growth</h3>
              <p className="mt-5 text-lg text-zinc-600 leading-relaxed">
                Our vision reflects our commitment to inclusive growth, ethical action, and human dignity. We aspire to create a society where development reaches the last person and contributes to a stronger nation and a better world.
              </p>
              <p className="mt-4 text-base md:text-lg text-zinc-500 italic leading-relaxed">
                हमारी दृष्टि समावेशी विकास, नैतिक कार्य और मानव गरिमा के प्रति हमारी प्रतिबद्धता को दर्शाती है, जहाँ विकास अंतिम व्यक्ति तक पहुँचे और राष्ट्र व विश्व के कल्याण में योगदान दे।
              </p>
              <div className="mt-6 pt-5 border-t border-zinc-100 font-semibold text-[#002344]">
                Our Vision is realized through our Mission and guided by our Core Values.
              </div>
            </div>

            <div className="rounded-3xl bg-[#001529] text-white p-8 md:p-10 shadow-lg">
              <span className="text-orange-300 font-bold uppercase tracking-widest text-xs">Mission in Perspective | ध्येय का परिप्रेक्ष्य</span>
              <h3 className="mt-3 text-2xl md:text-3xl font-serif font-bold">Tangible Social Impact</h3>
              <p className="mt-5 text-lg text-white/85 leading-relaxed">
                Our mission embodies our commitment to tangible social impact. Through education, health, and sustainable development, we aim to uplift communities and empower individuals to realize their full potential.
              </p>
              <p className="mt-4 text-base md:text-lg text-blue-100/75 italic leading-relaxed">
                हमारा ध्येय समाज में वास्तविक प्रभाव डालने की प्रतिबद्धता को दर्शाता है। शिक्षा, स्वास्थ्य और सतत विकास के माध्यम से हम समुदायों को सशक्त बनाना और व्यक्तियों को उनकी पूरी क्षमता प्राप्त करने के लिए प्रेरित करना चाहते हैं।
              </p>
              <div className="mt-6 pt-5 border-t border-white/10 font-semibold">
                Our Mission is guided by our Vision and implemented through our Core Values.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="py-16 md:py-24 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344] mb-4">
            Our Core Values
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto mt-12 md:mt-16">
            {[
              "Integrity",
              "Compassion",
              "Inclusion",
              "Excellence",
              "Sustainability",
              "Volunteerism",
            ].map((val, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-zinc-50 border hover:border-[#fb8500] hover:shadow-lg transition-all flex items-center justify-center"
              >
                <h3 className="text-lg md:text-2xl font-bold text-[#002344]">{val}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= YOUTUBE / MEDIA ================= */}
      <section className="py-16 md:py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Our Work in Action
            </h2>
            <p className="text-[#fb8500] font-bold uppercase tracking-widest text-xs md:text-sm">
              Stories • Impact • Ground Reality
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto">
            <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/h5su0SaRqCs"
                  title="SSF Video 1"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:shadow-2xl transition-all">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/z5Mxpg_-214"
                  title="SSF Video 2"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 md:py-24 bg-[#001529] text-center px-6">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
          Join Our Mission
        </h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
          <Link
            to="/Volunteer"
            className="w-full sm:w-auto px-8 py-4 bg-[#fb8500] text-white rounded-xl font-bold hover:bg-[#e67a00] transition-colors"
          >
            Volunteer With Us
          </Link>

          <Link
            to="/Donate"
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#002344] rounded-xl font-bold hover:bg-zinc-100 transition-colors"
          >
            Support Our Work
          </Link>
        </div>
      </section>
    </div>
  );
}
