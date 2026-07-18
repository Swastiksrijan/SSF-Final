import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";

// Team data - Single source of truth (no duplicates)
const teamData = {
  leadership: [
    { name: "Mr. Ramesh Pandey", role: "Founder & National President", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/ramesh_pandey.jpg" },
    { name: "Ms. Preeti Shukla", role: "Vice President", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_19.jpg" },
    { name: "Mr. Amit Pandey", role: "General Secretary", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_15.jpg" },
    { name: "Ms. Divya Sharma", role: "Treasurer", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/divya_sharma.jpg" },
  ],
  management: [
    { name: "Ms. Kiran Pandey", role: "Joint Secretary & Compliance Officer", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_22.jpg" },
    { name: "Ms. Priya Shukla", role: "Admin Support & Core Volunteer", location: "Madhya Pradesh", img: "/Teams_Images/priya_shukla.jpg" },
  ],
  board: [
    { name: "Mr. Sandeep Tripathi", role: "Board Member", location: "Satna, Madhya Pradesh", img: "/Teams_Images/sandeep_tripathi.jpg" },
    { name: "Mr. Prameesh Singh", role: "Board Member", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/prameesh_singh.jpg" },
    { name: "Mr. Rishi Pandey", role: "Board Member", location: "Satna, Madhya Pradesh", img: "/Teams_Images/rishi_pandey.jpg" },
    { name: "Mr. Ritesh Tiwari", role: "Board Member", location: "Mumbai, Maharashtra", img: "/Teams_Images/ritesh_tiwari.jpg" },
  ],
  advisory: [
    { name: "Mr. Kapil Tiwari", role: "Legal Advisor", location: "Madhya Pradesh", img: "/Teams_Images/kapil_tiwari.jpg" },
    { name: "Mr. Harish Kumar", role: "Legal Advisor", location: "Madhya Pradesh", img: "/Teams_Images/harish_kumar.jpg" },
    { name: "Mr. Chaman Rajora", role: "Support & National Advisory Board", location: "Haryana", img: "/Teams_Images/chaman_rajora.jpg" },
  ],
  volunteers: [
    { name: "Mr. Rajeev Pandey", role: "Advisor & Volunteer", location: "Madhya Pradesh", img: "/Teams_Images/rajeev_pandey.jpg" },
    { name: "Ms. A. Gincy George", role: "Head, Counselling Services", location: "Mumbai, Maharashtra", img: "/Teams_Images/image_1.jpg" },
    { name: "Mr. Krishna Kumar", role: "Volunteer & Advisor", location: "Hyderabad, Telangana", img: "/Teams_Images/krishna_kumar.jpg" },
    { name: "Ms. Sneha Ravishankar Pandey", role: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/sneha_ravishankar_pandey.jpg" },
    { name: "Ms. Vaishnavi Manik Chaudhari", role: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/vaishnavi_manik_chaudhari.jpg" },
  ],
};

// Reusable team member card component
const TeamMemberCard = ({ member }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col h-full"
  >
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col h-full group">
      {/* Image Container - Fixed height */}
      <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-3 border-zinc-100 shadow-sm group-hover:border-[#fb8500]/50 transition-all duration-300">
        <img
          src={member.img || "/images/team/placeholder.jpg"}
          alt={`${member.name}, ${member.role}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Text Content - Flexible layout */}
      <div className="text-center flex-grow flex flex-col justify-start">
        <h3 className="text-sm font-bold text-[#002344] leading-snug mb-2 line-clamp-2">
          {member.name}
        </h3>
        <p className="text-xs font-semibold text-[#fb8500] uppercase tracking-wide mb-3 leading-snug line-clamp-2">
          {member.role}
        </p>
        <p className="text-xs text-zinc-500 italic leading-snug">
          {member.location}
        </p>
      </div>
    </div>
  </motion.div>
);

// Section header component
const SectionHeader = ({ title, titleHi, description }) => (
  <div className="text-center space-y-3 mb-12">
    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">
      {title} {titleHi && <span className="block text-lg font-hindi text-zinc-600 mt-2">{titleHi}</span>}
    </h2>
    <div className="w-20 h-1 bg-[#fb8500] mx-auto rounded-full"></div>
    {description && <p className="text-zinc-600 text-base max-w-2xl mx-auto mt-4">{description}</p>}
  </div>
);

export default function Team() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-gradient-to-b from-zinc-50 to-white pt-20 pb-16 flex justify-center">
        <div className="container mx-auto px-4 flex justify-center max-w-5xl">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            src="/images/uploads/MeetOurTeam.jpeg"
            alt="Meet Our Team - Swastik Srijan Foundation"
            className="w-full h-auto max-h-[60vh] object-contain rounded-2xl shadow-lg border border-zinc-200"
          />
        </div>
      </section>

      {/* ================= LEADERSHIP & GOVERNANCE ================= */}
      <section className="py-20 px-6 bg-[#f8f9fa] border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Leadership" 
            titleHi="नेतृत्व"
            description="The visionary founders and senior leadership guiding SSF's mission."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamData.leadership.map((member, i) => (
              <TeamMemberCard key={`leadership-${i}`} member={member} />
            ))}
          </div>

          <div className="text-center pt-12">
            <p className="text-zinc-600 font-medium italic max-w-3xl mx-auto">
              "Committed to empowering communities through visionary leadership and dedicated service."
            </p>
          </div>
        </div>
      </section>

      {/* ================= MANAGEMENT & OPERATIONS ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Management & Operations" 
            titleHi="प्रबंधन और संचालन"
            description="Core team members managing day-to-day excellence and strategic operations."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamData.management.map((member, i) => (
              <TeamMemberCard key={`management-${i}`} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOARD MEMBERS ================= */}
      <section className="py-20 px-6 bg-[#f8f9fa] border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Board Members" 
            titleHi="बोर्ड सदस्य"
            description="Governance and board representatives ensuring organizational excellence."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamData.board.map((member, i) => (
              <TeamMemberCard key={`board-${i}`} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= ADVISORY BOARD ================= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Advisory Board" 
            titleHi="सलाहकार बोर्ड"
            description="Expert advisors providing strategic guidance and specialized expertise."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamData.advisory.map((member, i) => (
              <TeamMemberCard key={`advisory-${i}`} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= VOLUNTEERS & EXTENDED TEAM ================= */}
      <section className="py-20 px-6 bg-[#f8f9fa] border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Volunteers & Extended Team" 
            titleHi="स्वयंसेवक और विस्तारित टीम"
            description="Dedicated volunteers and specialized consultants supporting our mission."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamData.volunteers.map((member, i) => (
              <TeamMemberCard key={`volunteer-${i}`} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= JOIN OUR TEAM CTA ================= */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#002344] to-[#003366] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Join Our Team
            </h2>
            <p className="text-xl text-blue-100 font-hindi">
              हमारी टीम का हिस्सा बनें
            </p>
            <p className="text-lg text-blue-50 max-w-2xl mx-auto leading-relaxed">
              Be part of a passionate community creating meaningful change across India. Whether you're a professional, volunteer, or advocate, there's a place for you at Swastik Srijan Foundation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link to="/Volunteer">
              <button className="px-8 py-4 bg-[#fb8500] hover:bg-[#e07600] text-[#002344] font-bold rounded-full transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                Become a Volunteer <FaArrowRight className="text-sm" />
              </button>
            </Link>
            <Link to="/Contact">
              <button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full border-2 border-white transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                Get in Touch <FaArrowRight className="text-sm" />
              </button>
            </Link>
          </motion.div>

          <div className="pt-8 border-t border-white/20">
            <p className="text-blue-200 text-sm">
              💼 Currently hiring for specialized roles in technology, health, and education.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
