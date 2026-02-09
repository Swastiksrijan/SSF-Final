import { motion } from "framer-motion";

const ProgressTimeline = () => {
  const timelineData = [
    {
      year: "2013",
      title: "Why We Started",
      desc: "Witnessing the lack of basic resources in rural communities, a group of friends came together to form Swastik Srijan Foundation.",
    },
    {
      year: "2014",
      title: "Nurturing Community Well-being",
      desc: "Promoting mental health with community support, strengthening community support systems.",
    },
    {
      year: "2015",
      title: "Expanding Early Initiatives",
      desc: "Strengthened nutrition and preventive support services for vulnerable populations.",
    },
    {
      year: "2016",
      title: "A Year of Rural Empowerment",
      desc: "Introduced technology-driven solutions, hosting workshops, and community-led rural development initiatives.",
    },
    {
      year: "2017",
      title: "Empowering Through Education",
      desc: "Started education-focused interventions, fostering learning access to quality resources for underprivileged children.",
    },
    {
      year: "2018",
      title: "Promoting Health and Hygiene",
      desc: "Conducted large-scale health camps, hygiene awareness drives, and sanitation programs.",
    },
    {
      year: "2019",
      title: "Women's Empowerment in Focus",
      desc: "Rolled out women-centered initiatives, including skill training, self-help groups and livelihood programs.",
    },
    {
      year: "2020",
      title: "Navigating Challenges with Resilience",
      desc: "Provided support amid global crisis, distributed essentials, offering support during pandemic-driven hardships.",
    },
    {
      year: "2021",
      title: "Sustaining Momentum",
      desc: "Strengthened digital learning, digital platforms and changing conditions.",
    },
    {
      year: "2022",
      title: "Strengthening Communities",
      desc: "Reinforced efforts with disaster relief, implemented long-term resilience-building initiatives recovering from challenges.",
    },
    {
      year: "2023",
      title: "SSF Learning Hub",
      desc: "Established the SSF Learning Hub, offering structured learning, mentorship, and career guidance.",
    },
    {
      year: "2024",
      title: "Integrating Learning & Environment",
      desc: "Launched holistic programs combining environmental education, sustainability practices, and nutrition awareness.",
    },
    {
      year: "2025",
      title: "Expanding Grassroots Impact",
      desc: "Scaling community projects across regions with innovative tech solutions, empowering local leaders.",
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden relative border-t border-zinc-100">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-50/50 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#fb8500] font-bold uppercase tracking-[0.2em] text-xs"
          >
            Our Roadmap
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-[#002344]"
          >
            Milestones of Our <span className="text-[#fb8500]">Journey</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 max-w-2xl mx-auto text-lg md:text-xl font-medium"
          >
            A decade of commitment, resilience, and transforming lives across India.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-100 md:-translate-x-1/2"></div>

          <div className="space-y-16">
            {timelineData.map((item, i) => (
              <div key={i} className={`relative flex items-center justify-between md:justify-normal even:md:flex-row-reverse group`}>
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-white border-2 border-[#fb8500] rounded-full md:-translate-x-1/2 z-20 group-hover:scale-150 transition-transform"></div>

                {/* Content */}
                <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-12 text-left md:text-right" : "md:pl-12 text-left"}`}>
                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-zinc-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="text-4xl font-black text-[#fb8500]/10 block mb-2">{item.year}</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#fb8500] font-bold text-xs uppercase tracking-widest">{item.year}</span>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-[#002344] mb-3 leading-tight">{item.title}</h3>
                    </div>
                    <p className="text-zinc-600 leading-relaxed font-medium">{item.desc}</p>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressTimeline;
