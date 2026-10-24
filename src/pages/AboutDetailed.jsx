import { IoIosCheckmarkCircle } from "react-icons/io";
import { FiTarget, FiArrowRight } from "react-icons/fi";

const initiatives = [
  {
    tag: "Education",
    sdg: "UN SDG 4: Quality Education",
    title: "Ensuring every child has access to quality education and the tools to succeed.",
    subtitle: "हर बच्चे को गुणवत्तापूर्ण शिक्षा एवं आत्मनिर्भर भविष्य",
    points: [
      "Scholarships & financial aid for underprivileged students",
      "Distribution of books, school kits, uniforms & digital learning materials",
      "Community study centers, mentorship & remedial academic support",
      "Special counseling drives to reduce school dropout rates in rural Rewa",
    ],
    images: [
      { src: "/images/real/academy_banner_wide.jpg", alt: "Education Initiatives SSF" }
    ],
    singleImage: true,
  },
  {
    tag: "Nutrition & Health",
    sdg: "UN SDG 3: Good Health & Well-being",
    title: "Bringing accessible, preventive healthcare to the doorstep of every family.",
    subtitle: "सुलभ एवं नि:शुल्क प्राथमिक स्वास्थ्य व पोषण सेवाएं",
    points: [
      "Free multi-specialty medical checkups and diagnostic health camps",
      "Direct distribution of essential life-saving medicines and supplements",
      "Grassroot awareness campaigns on menstrual hygiene, sanitation & clean water",
      "Focused nutritional support programs for expectant mothers and malnourished children",
    ],
    images: [
      { src: "/images/health.png", alt: "Health & Nutrition Camps" }
    ],
    singleImage: true,
  },
  {
    tag: "Rural & Women Development",
    sdg: "UN SDG 5 & 8: Decent Work & Gender Equality",
    title: "Building self-reliant rural communities through sustainable livelihood initiatives.",
    subtitle: "महिला सशक्तिकरण, स्वावलंबन एवं पर्यावरण संरक्षण",
    points: [
      "Formation, training, and micro-grant support for Women Self-Help Groups (SHGs)",
      "Vocational sewing, handicraft, and local entrepreneurship training",
      "Eco-restoration through intensive village tree plantation & water conservation drives",
      "Support for sustainable agriculture practices and small village enterprises",
    ],
    images: [
      { src: "/images/real/women_community_meeting.jpg", alt: "Women Community SHG Meeting" },
      { src: "/images/real/tree_planting_2.jpg", alt: "Environmental Tree Plantation" }
    ],
    singleImage: false,
  },
  {
    tag: "Youth Empowerment",
    sdg: "UN SDG 8: Decent Work & Economic Growth",
    title: "Equipping rural youth with technical skills, leadership, and employment readiness.",
    subtitle: "युवा कौशल विकास, करियर मार्गदर्शन एवं खेल प्रोत्साहन",
    points: [
      "Market-aligned vocational and digital literacy training workshops",
      "Dedicated career guidance, soft skills, and personality development sessions",
      "Sports and youth club initiatives fostering team spirit, leadership, and fitness",
      "Direct job readiness mentoring and connection with regional employment avenues",
    ],
    images: [
      { src: "/images/real/girls-study-group-mat.jpg", alt: "Youth Study Group Rewa" },
      { src: "/images/real/cricket-child.jpg", alt: "Youth Sports Initiative" }
    ],
    singleImage: false,
  },
  {
    tag: "Health Awareness & Preventive Care",
    sdg: "UN SDG 3: Community Well-being",
    title: "Empowering rural citizens with actionable health awareness and early diagnosis.",
    subtitle: "स्वास्थ्य साक्षरता, नेत्र जांच शिविर एवं प्राथमिक उपचार जागरूकता",
    points: [
      "Community workshops on epidemic prevention, first aid, and lifestyle health",
      "Specialized vision care and eye checkup camps for rural seniors and school kids",
      "Mental wellness counseling and family health guidance in remote villages",
      "Hygiene awareness rallies led by community youth volunteers",
    ],
    images: [
      { src: "/images/real/awareness-poster-viewing.jpg", alt: "Health Awareness Poster Viewing" },
      { src: "/images/real/vision-health-camp.jpg", alt: "Vision and Eye Care Camp" }
    ],
    singleImage: false,
  },
  {
    tag: "Humanitarian & Homeless Support",
    sdg: "UN SDG 1 & 2: No Poverty & Zero Hunger",
    title: "Restoring dignity, safety, and immediate emergency relief to vulnerable citizens.",
    subtitle: "आपदा राहत, भोजन एवं वस्त्र वितरण — मानवीय गरिमा की रक्षा",
    points: [
      "Emergency food rations, warm clothes, and blanket distribution in winter",
      "Temporary relief and rehabilitation support for destitute families",
      "Emergency outreach during seasonal hardships and natural distress",
      "Community-driven programs fostering compassion, safety, and human dignity",
    ],
    images: [
      { src: "/images/people_help.png", alt: "Humanitarian Outreach and Relief" }
    ],
    singleImage: true,
  },
];

function AbtDetailed() {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 border border-amber-500/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
            <FiTarget className="text-sm" /> Key Intervention Pillars
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A4A] tracking-tight leading-tight">
            Transforming Lives Across Rewa & Rural India
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Since 2013, Swastik Srijan Foundation has championed grassroot empowerment across 6 core pillars, 
            combining field execution with strict statutory compliance and institutional accountability.
          </p>
        </div>

        {/* Initiatives List */}
        <div className="space-y-16">
          {initiatives.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Content Column */}
                <div className={`space-y-5 lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="bg-[#0F2A4A] text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wide">
                      {item.tag}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-3 py-0.5 rounded-full">
                      {item.sdg}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-amber-700 mt-1.5">
                      {item.subtitle}
                    </p>
                  </div>

                  <ul className="space-y-3 text-slate-700 text-sm sm:text-base pt-2">
                    {item.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <IoIosCheckmarkCircle className="text-emerald-600 text-xl shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2A4A] bg-slate-100 px-3 py-1.5 rounded-lg">
                      100% Direct Field Delivery <FiArrowRight className="text-amber-600" />
                    </span>
                  </div>
                </div>

                {/* Images Column */}
                <div className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  {item.singleImage ? (
                    <div className="overflow-hidden rounded-2xl shadow-md border border-slate-100 group">
                      <img
                        src={item.images[0].src}
                        alt={item.images[0].alt}
                        loading="lazy"
                        className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/real/community-rally-children.jpg";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {item.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="overflow-hidden rounded-2xl shadow-md border border-slate-100 group">
                          <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/real/community-education-meeting.jpg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default AbtDetailed;
