// import ABFrame from "../assets/ABFrame1.png";
// import ABFrame1 from "../assets/ABFrame2.png";
// import ABFrame2 from "../assets/ABFrame3.png";
// import ABFrame3 from "../assets/ABFrame4.png";
// import ABFrame4 from "../assets/ABFrame5.png";
// import ABFrame5 from "../assets/ABFrame6.png";

// import { IoIosCheckmarkCircle } from "react-icons/io";
// function AbtDetailed() {
//     return (
//         <div className="w-full  flex flex-col gap-10 md:gap-2 items-center justify-center py-14 px-4 mt-10">
//             <div className="max-w-6xl py-10 w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
//                 <div>
//                     <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
//                         Education
//                     </span>
//                     <h2 className="text-2xl md:text-3xl font-bold mt-4 leading-snug">
//                         Ensuring every child has access to quality education
//                         and the tools they need to succeed.
//                     </h2>
//                     <ul className="mt-6 space-y-3 md:space-y-4 text-[15px] md:text-[18px] text-gray-800">
//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Scholarships for underprivileged students</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Distribution of books, uniforms, and learning materials</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Mentorship and academic support programs</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Initiatives to reduce school dropout rates</span>
//                         </li>
//                     </ul>

//                 </div>
//                 <div className="flex justify-center">
//                     <img
//                         src={ABFrame}
//                         alt="Children studying"
//                         className=" shadow-xl w-full object-contain"
//                     />
//                 </div>
//             </div>

//             <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-10">
//                 <div className="hidden md:flex justify-center">
//                     <img
//                         src={ABFrame1}
//                         alt="Children studying"
//                         className=" shadow-xl w-full object-contain"
//                     />
//                 </div>
//                 <div>
//                     <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
//                         Nutrition & Health
//                     </span>
//                     <h2 className="text-2xl md:text-3xl font-bold mt-4 leading-snug">
//                         Bringing healthcare within reach of every community member,
//                         regardless of circumstance.
//                     </h2>
//                     <ul className="mt-6 space-y-3 md:space-y-4 text-[15px] md:text-[18px] text-gray-800">
//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Free medical checkups and health camps</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Access to essential medicines and treatments</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Awareness programs on hygiene and disease prevention</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Support for maternal and child healthcare</span>
//                         </li>
//                     </ul>

//                 </div>
//                 <div className="flex justify-center md:hidden">
//                     <img
//                         src={ABFrame1}
//                         alt="Children studying"
//                         className=" shadow-xl w-full object-contain"
//                     />
//                 </div>
//             </div>

//             <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-10">
//                 <div>
//                     <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
//                         Development
//                     </span>
//                     <h2 className="text-2xl md:text-3xl font-bold mt-4 leading-snug">
//                         Building stronger, self-sufficient rural communities through sustainable development.
//                     </h2>
//                     <ul className="mt-6 space-y-3 md:space-y-4 text-[15px] md:text-[18px] text-gray-800">
//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Infrastructure improvements for villages</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Skill-development & livelihood training</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Women-led self-help group support</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Programs promoting agriculture & local entrepreneurship</span>
//                         </li>
//                     </ul>
//                 </div>
//                 <div className="flex justify-center">
//                     <img
//                         src={ABFrame2}
//                         alt="Children studying"
//                         className=" shadow-xl w-full object-cover"
//                     />
//                 </div>
//             </div>

//             <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-10">
//                 <div className="hidden md:flex justify-center">
//                     <img
//                         src={ABFrame3}
//                         alt="Children studying"
//                         className=" shadow-xl w-full object-cover"
//                     />
//                 </div>
//                 <div>
//                     <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
//                         Youth Empowerment
//                     </span>
//                     <h2 className="text-2xl md:text-3xl font-bold mt-4 leading-snug">
//                         Empowering young individuals with practical skills to build
//                         confident and independent futures.
//                     </h2>
//                     <ul className="mt-6 space-y-3 md:space-y-4 text-[15px] md:text-[18px] text-gray-800">
//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Vocational & technical skill training</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Career guidance & personality development</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Communication & leadership workshops</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Job readiness training & employment support</span>
//                         </li>
//                     </ul>

//                 </div>
//                 <div className="flex justify-center md:hidden">
//                     <img
//                         src={ABFrame3}
//                         alt="Children studying"
//                         className=" shadow-xl w-full object-cover"
//                     />
//                 </div>
//             </div>

//             <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-10">

//                 <div>
//                     <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
//                         Health Awareness
//                     </span>
//                     <h2 className="text-2xl md:text-3xl font-bold mt-4 leading-snug">
//                         Promoting healthier communities through education,
//                         prevention, and accessible health knowledge.
//                     </h2>
//                     <ul className="mt-6 space-y-3 md:space-y-4 text-[15px] md:text-[18px] text-gray-800">
//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Awareness sessions on hygiene and nutrition</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Disease prevention and first-aid workshops</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Mental health and wellness guidance</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Family and community health counseling</span>
//                         </li>
//                     </ul>

//                 </div>
//                 <div className="flex justify-center">
//                     <img
//                         src={ABFrame4}
//                         alt="Children studying"
//                         className=" shadow-xl w-full object-cover"
//                     />
//                 </div>
//             </div>

//             <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-10">
//                 <div className="hidden md:flex justify-center">
//                     <img
//                         src={ABFrame5}
//                         alt="Children studying"
//                         className=" shadow-xl w-full object-cover"
//                     />
//                 </div>
//                 <div>
//                     <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
//                         Homeless Support
//                     </span>
//                     <h2 className="text-2xl md:text-3xl font-bold mt-4 leading-snug">
//                         Providing care and essential support to individuals
//                         facing homelessness and hardship.
//                     </h2>
//                     <ul className="mt-6 space-y-3 md:space-y-4 text-[15px] md:text-[18px] text-gray-800">
//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Food, clothing, and essential relief distribution</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Temporary assistance for vulnerable families</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Community outreach and support drives</span>
//                         </li>

//                         <li className="flex items-start gap-1 md:gap-2 leading-tight">
//                             <IoIosCheckmarkCircle className="text-green-600 text-lg md:text-2xl shrink-0" />
//                             <span>Programs fostering safety, care, and dignity</span>
//                         </li>
//                     </ul>

//                 </div>
//                 <div className="flex justify-center md:hidden">
//                     <img
//                         src={ABFrame5}
//                         alt="Children studying"
//                         className=" shadow-xl w-full object-cover"
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default AbtDetailed;


const ABFrame = "/images/real/academy_banner_wide.jpg";
const ABFrame1 = "/images/real/vision-health-camp.jpg";
const ABFrame2 = "/images/real/women_community_meeting.jpg";
const ABFrame3 = "/images/real/girls-study-group-mat.jpg";
const ABFrame4 = "/images/real/awareness-poster-viewing.jpg";
const ABFrame5 = "/images/real/cloth-distribution.jpg";

import { IoIosCheckmarkCircle } from "react-icons/io";

function AbtDetailed() {
  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* ========== EDUCATION ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="inline-block text-sm text-[#003366] bg-[#003366]/5 px-3 py-1 rounded">
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
            <span className="inline-block text-sm text-[#003366] bg-[#003366]/5 px-3 py-1 rounded">
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
            <span className="inline-block text-sm text-[#003366] bg-[#003366]/5 px-3 py-1 rounded">
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
            <span className="inline-block text-sm text-[#003366] bg-[#003366]/5 px-3 py-1 rounded">
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
            <span className="inline-block text-sm text-[#003366] bg-[#003366]/5 px-3 py-1 rounded">
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
            <span className="inline-block text-sm text-[#003366] bg-[#003366]/5 px-3 py-1 rounded">
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
