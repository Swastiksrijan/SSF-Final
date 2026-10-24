const ABFrame = "/images/real/academy_banner_wide.jpg";
const ABFrame1 = "/images/health.png";
const ABFrame2 = "/images/real/women_community_meeting.jpg";
const ABFrame3 = "/images/real/girls-study-group-mat.jpg";
const ABFrame4 = "/images/real/awareness-poster-viewing.jpg";
const ABFrame5 = "/images/people_help.png";

import { IoIosCheckmarkCircle } from "react-icons/io";

function AbtDetailed() {
  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* ========== EDUCATION ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="inline-block text-sm text-[#12345A] bg-[#12345A]/5 px-3 py-1 rounded">
              Education
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">
              Ensuring every child has access to quality education and the tools they need to succeed.
            </h2>

            <ul className="space-y-3 text-zinc-700">
              {[
                "Scholarships for underprivileged students",
                "Distribution of books, uniforms, and learning materials",
                "Mentorship and academic support programs",
                "Initiatives to reduce school dropout rates",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <IoIosCheckmarkCircle className="text-green-600 text-xl shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <img src={ABFrame} alt="Education initiatives" className="w-full" />
        </div>

        {/* ========== NUTRITION & HEALTH ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img src={ABFrame1} alt="Health programs" className="w-full hidden md:block" />

          <div className="space-y-4">
            <span className="inline-block text-sm text-[#12345A] bg-[#12345A]/5 px-3 py-1 rounded">
              Nutrition & Health
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">
              Bringing healthcare within reach of every community member.
            </h2>

            <ul className="space-y-3 text-zinc-700">
              {[
                "Free medical checkups and health camps",
                "Access to essential medicines and treatments",
                "Awareness programs on hygiene and disease prevention",
                "Support for maternal and child healthcare",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <IoIosCheckmarkCircle className="text-green-600 text-xl shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <img src={ABFrame1} alt="" className="w-full md:hidden" />
        </div>

        {/* ========== DEVELOPMENT ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="inline-block text-sm text-[#12345A] bg-[#12345A]/5 px-3 py-1 rounded">
              Development
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">
              Building stronger, self-sufficient rural communities through sustainable development.
            </h2>

            <ul className="space-y-3 text-zinc-700">
              {[
                "Infrastructure improvements for villages",
                "Skill-development & livelihood training",
                "Women-led self-help group support",
                "Programs promoting agriculture & entrepreneurship",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <IoIosCheckmarkCircle className="text-green-600 text-xl shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img src={ABFrame2} alt="Rural development" className="w-full h-full object-cover rounded-xl" />
            <img src="/images/real/tree_planting_2.jpg" alt="Environmental initiative" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>

        {/* ========== YOUTH EMPOWERMENT ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img src={ABFrame3} alt="Youth study group" className="w-full h-full object-cover rounded-xl shadow-sm hidden md:block" />
            <img src="/images/real/cricket-child.jpg" alt="Child playing cricket" className="w-full h-full object-cover rounded-xl shadow-sm hidden md:block" />
          </div>

          <div className="space-y-4">
            <span className="inline-block text-sm text-[#12345A] bg-[#12345A]/5 px-3 py-1 rounded">
              Youth Empowerment
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">
              Empowering young individuals with skills to build independent futures.
            </h2>

            <ul className="space-y-3 text-zinc-700">
              {[
                "Vocational & technical skill training",
                "Career guidance & personality development",
                "Communication & leadership workshops",
                "Job readiness and employment support",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <IoIosCheckmarkCircle className="text-green-600 text-xl shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 md:hidden">
            <img src={ABFrame3} alt="Youth study group" className="w-full h-full object-cover rounded-xl shadow-sm" />
            <img src="/images/real/cricket-child.jpg" alt="Child playing cricket" className="w-full h-full object-cover rounded-xl shadow-sm" />
          </div>
        </div>

        {/* ========== HEALTH AWARENESS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="inline-block text-sm text-[#12345A] bg-[#12345A]/5 px-3 py-1 rounded">
              Health Awareness
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">
              Promoting healthier communities through education and prevention.
            </h2>

            <ul className="space-y-3 text-zinc-700">
              {[
                "Hygiene and nutrition awareness",
                "Disease prevention & first-aid training",
                "Mental health and wellness guidance",
                "Family and community health counseling",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <IoIosCheckmarkCircle className="text-green-600 text-xl shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img src={ABFrame4} alt="Health awareness poster viewing" className="w-full h-full object-cover rounded-xl shadow-sm" />
            <img src="/images/real/vision-health-camp.jpg" alt="Vision & Eye Care Camp" className="w-full h-full object-cover rounded-xl shadow-sm" />
          </div>
        </div>

        {/* ========== HOMELESS SUPPORT ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img src={ABFrame5} alt="Homeless support" className="w-full hidden md:block" />

          <div className="space-y-4">
            <span className="inline-block text-sm text-[#12345A] bg-[#12345A]/5 px-3 py-1 rounded">
              Homeless Support
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">
              Providing dignity, care, and essential support to the homeless.
            </h2>

            <ul className="space-y-3 text-zinc-700">
              {[
                "Food and clothing distribution",
                "Temporary assistance for vulnerable families",
                "Community outreach programs",
                "Safety, care, and dignity initiatives",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <IoIosCheckmarkCircle className="text-green-600 text-xl shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <img src={ABFrame5} alt="" className="w-full md:hidden" />
        </div>

      </div>
    </section>
  );
}

export default AbtDetailed;
