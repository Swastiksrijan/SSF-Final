import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function MasonryCards() {
  const cards = [
    {
      title: "Education",
      desc: "Empowering children with quality learning for a brighter future.",
      img: "/images/real/scholarship_distribution.jpg",
      color: "border-l-4 border-[#003366]",
      link: "/LearningHub"
    },
    {
      title: "Protection",
      desc: "Ensuring safety and dignity, shielding children from abuse.",
      img: "/images/protection-ecosystem.png",
      color: "border-l-4 border-black",
      link: "/Campaign#legal"
    },
    {
      title: "Health",
      desc: "Providing essential healthcare and nutrition to combat disease.",
      img: "/images/real/nutrition_program.jpg",
      color: "border-l-4 border-[#003366]",
      link: "/Campaign#health"
    },
    {
      title: "Livelihood",
      desc: "Creating sustainable opportunities for families to thrive.",
      img: "/images/community-meeting.jpg",
      color: "border-l-4 border-black",
      link: "/Campaign#skills"
    },
    {
      title: "Participation",
      desc: "Giving children a voice in decisions affecting their lives.",
      img: "/images/real/community-rally-children.jpg",
      color: "border-l-4 border-zinc-400",
      link: "/Volunteer"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${card.color} group overflow-hidden flex flex-col`}
        >
          <Link to={card.link} className="flex flex-col h-full p-6 relative z-10">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-[#003366] transition-colors">{card.title}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                {card.desc}
              </p>
            </div>

            <div className="mt-auto">
              {card.img && (
                <div className="rounded-xl overflow-hidden h-40 w-full bg-zinc-100 mb-4 relative">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
              )}
              <div className="inline-flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider text-[#003366]">
                Explore Impact <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
