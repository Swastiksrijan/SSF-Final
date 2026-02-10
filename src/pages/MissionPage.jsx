import { motion } from "framer-motion";
import {
  FaHandHoldingHeart,
  FaGlobeAmericas
} from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import PageHero from "../components/PageHero";

export default function MissionPage() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <PageHero
        image="/images/real/community-education-meeting.jpg"
        title="Mission & Vision"
        subtitle="Our Guiding Principles for a Better Bharat"
        hindiSubtitle="लक्ष्य और दृष्टिकोण - एक बेहतर भारत के लिए हमारे प्रेरक सिद्धांत"
      />

      {/* ================= WHO WE ARE ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
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

                <p className="text-lg font-hindi text-zinc-500 border-l-4 border-zinc-100 pl-6">
                  स्वस्तिक सृजन फाउंडेशन 2013 में स्थापित एक जमीनी स्तर का गैर-लाभकारी संगठन है।
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-[#fb8500]/10 rounded-[3rem] -rotate-3"></div>
              <img
                src="/images/real/girls-study-group-mat.jpg"
                alt="Community Engagement"
                className="relative z-10 w-full h-[450px] object-cover rounded-[2.5rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= MORE INFORMATION LINKS ================= */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-6 justify-center items-center">

            {/* MISSION LINK */}
            <a
              href="https://sites.google.com/view/swastiksrijanprofile/about-the-organization/mission"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border border-[#fb8500] text-[#002344] font-bold hover:bg-[#fb8500] hover:text-white transition-all shadow-sm"
            >
              For more information on <span className="text-[#fb8500] hover:text-white">Mission</span>, click here
            </a>

            {/* VISION LINK */}
            <a
              href="https://sites.google.com/view/swastiksrijanprofile/about-the-organization/vision"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border border-[#002344] text-[#002344] font-bold hover:bg-[#002344] hover:text-white transition-all shadow-sm"
            >
              For more information on <span className="text-[#002344] hover:text-white">Vision</span>, click here
            </a>

          </div>
        </div>
      </section>


      {/* ================= VISION & MISSION ================= */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
          {/* Vision */}
          <div className="space-y-6 p-10 rounded-[2.5rem] bg-orange-50/50 border border-orange-100 relative hover:shadow-xl transition-all">
            <div className="absolute top-10 right-10 opacity-10 text-[#fb8500] text-6xl">
              <FaGlobeAmericas />
            </div>
            <span className="text-[#fb8500] font-bold uppercase tracking-wider text-sm">
              Vision | हमारा दृष्टिकोण
            </span>
            <h3 className="text-4xl font-serif font-bold text-[#002344]">
              A Future of Dignity
            </h3>
            <p className="text-zinc-600 text-lg">
              We envision a compassionate, inclusive, and responsible society where every individual lives with dignity.
            </p>
          </div>

          {/* Mission */}
          <div className="space-y-6 p-10 rounded-[2.5rem] bg-blue-50/50 border border-blue-100 relative hover:shadow-xl transition-all">
            <div className="absolute top-10 right-10 opacity-10 text-[#002344] text-6xl">
              <FaHandHoldingHeart />
            </div>
            <span className="text-[#002344] font-bold uppercase tracking-wider text-sm">
              Mission | हमारा लक्ष्य
            </span>
            <h3 className="text-4xl font-serif font-bold text-[#002344]">
              Empowerment in Action
            </h3>
            <p className="text-zinc-600 text-lg">
              To empower communities through education, health, skill development, and ethical leadership.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-serif font-bold text-[#002344] mb-4">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
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
                className="p-8 rounded-3xl bg-zinc-50 border hover:border-[#fb8500] hover:shadow-lg transition-all"
              >
                <h3 className="text-2xl font-bold text-[#002344]">{val}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= YOUTUBE / MEDIA ================= */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Our Work in Action
            </h2>
            <p className="text-[#fb8500] font-bold uppercase tracking-widest text-sm">
              Stories • Impact • Ground Reality
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            <div className="rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:shadow-2xl transition-all">
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

            <div className="rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:shadow-2xl transition-all">
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
      <section className="py-24 bg-[#001529] text-center">
        <h2 className="text-4xl font-serif font-bold text-white mb-8">
          Join Our Mission
        </h2>

        <div className="flex justify-center gap-6">
          <Link
            to="/Volunteer"
            className="px-8 py-4 bg-[#fb8500] text-white rounded-xl font-bold hover:bg-[#e67a00]"
          >
            Volunteer With Us
          </Link>

          <Link
            to="/Donate"
            className="px-8 py-4 bg-white text-[#002344] rounded-xl font-bold hover:bg-zinc-100"
          >
            Support Our Work
          </Link>
        </div>
      </section>
    </div>
  );
}
