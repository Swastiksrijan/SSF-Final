import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";

// Team data structure - Single source of truth
const teamStructure = {
  leadership: [
    { name: "Mr. Ramesh Pandey", designation: "Founder & President", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/ramesh_pandey.jpg" },
    { name: "Ms. Preeti Shukla", designation: "Vice President", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_19.jpg" },
    { name: "Mr. Amit Pandey", designation: "Secretary", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_15.jpg" },
    { name: "Ms. Divya Sharma", designation: "Treasurer", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/divya_sharma.jpg" },
    { name: "Ms. Kiran Pandey", designation: "Joint Secretary", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_22.jpg" },
    { name: "Ms. Priya Shukla", designation: "Administrative Coordinator", location: "Madhya Pradesh", img: "/Teams_Images/priya_shukla.jpg" },
    { name: "Mr. Sandeep Tripathi", designation: "Board Member", location: "Satna, Madhya Pradesh", img: "/Teams_Images/sandeep_tripathi.jpg" },
    { name: "Mr. Prameesh Singh", designation: "Board Member", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/prameesh_singh.jpg" },
    { name: "Mr. Rishi Pandey", designation: "Board Member", location: "Satna, Madhya Pradesh", img: "/Teams_Images/rishi_pandey.jpg" },
    { name: "Mr. Ritesh Tiwari", designation: "Board Member", location: "Mumbai, Maharashtra", img: "/Teams_Images/ritesh_tiwari.jpg" },
  ],
  advisory: [
    { name: "Mr. Chaman Rajora", designation: "National Advisory Board", location: "Haryana", img: "/Teams_Images/chaman_rajora.jpg" },
    { name: "Mr. Kapil Tiwari", designation: "Legal Advisor", location: "Madhya Pradesh", img: "/Teams_Images/kapil_tiwari.jpg" },
    { name: "Mr. Harish Kumar", designation: "Legal Advisor", location: "Madhya Pradesh", img: "/Teams_Images/harish_kumar.jpg" },
  ],
  volunteers: [
    { name: "Mr. Rajeev Pandey", designation: "Advisor & Volunteer", location: "Madhya Pradesh", img: "/Teams_Images/rajeev_pandey.jpg" },
    { name: "Ms. A. Gincy George", designation: "Head, Counselling Services", location: "Mumbai, Maharashtra", img: "/Teams_Images/image_1.jpg" },
    { name: "Mr. Krishna Kumar", designation: "Volunteer & Advisor", location: "Hyderabad, Telangana", img: "/Teams_Images/krishna_kumar.jpg" },
    { name: "Ms. Sneha Ravishankar Pandey", designation: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/sneha_ravishankar_pandey.jpg" },
    { name: "Ms. Vaishnavi Manik Chaudhari", designation: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/vaishnavi_manik_chaudhari.jpg" },
  ],
};

// Professional Team Member Card
const TeamMemberCard = ({ member, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className="h-full"
  >
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col group">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-zinc-100 to-zinc-50 overflow-hidden">
        <img
          src={member.img || "/images/team/placeholder.jpg"}
          alt={`${member.name}, ${member.designation}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-between p-5 lg:p-6">
        {/* Text Content */}
        <div className="space-y-2">
          <h3 className="text-base lg:text-lg font-bold text-[#002344] leading-tight tracking-tight">
            {member.name}
          </h3>
          <p className="text-xs lg:text-sm font-semibold text-[#fb8500] uppercase tracking-wider leading-tight">
            {member.designation}
          </p>
        </div>

        {/* Location */}
        <p className="text-xs text-zinc-600 mt-3 pt-3 border-t border-zinc-100 leading-tight">
          {member.location}
        </p>
      </div>
    </div>
  </motion.div>
);

// Section Header Component
const SectionHeader = ({ enTitle, hiTitle, description }) => (
  <div className="max-w-3xl mx-auto mb-14 lg:mb-16">
    <div className="space-y-3">
      <div>
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#002344]">
          {enTitle}
        </h2>
        <p className="text-sm lg:text-base font-bold text-[#fb8500] uppercase tracking-widest mt-2">
          {hiTitle}
        </p>
      </div>
      <div className="w-12 h-1 bg-[#fb8500] rounded-full"></div>
      <p className="text-base lg:text-lg text-zinc-600 leading-relaxed pt-2">
        {description}
      </p>
    </div>
  </div>
);

export default function Team() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-gradient-to-b from-zinc-50 via-white to-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            {/* Main Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#002344] leading-tight">
                Our Team
              </h1>
              <p className="text-lg lg:text-xl font-bold text-[#fb8500] uppercase tracking-widest">
                हमारी टीम
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-zinc-700 leading-relaxed max-w-3xl mx-auto font-light">
              Meet the people who lead, guide and strengthen the mission of Swastik Srijan Foundation across India.
            </p>

            {/* Divider */}
            <div className="flex justify-center pt-4">
              <div className="w-16 h-1 bg-[#fb8500] rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= LEADERSHIP & GOVERNANCE SECTION ================= */}
      <section className="py-20 lg:py-28 px-6 lg:px-8 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 lg:mb-16">
            <SectionHeader
              enTitle="Leadership & Governance"
              hiTitle="नेतृत्व एवं शासन"
              description="The governing leadership responsible for strategic direction, governance, policy, compliance and institutional development."
            />
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {teamStructure.leadership.map((member, index) => (
              <TeamMemberCard key={`leadership-${index}`} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= ADVISORY COUNCIL SECTION ================= */}
      <section className="py-20 lg:py-28 px-6 lg:px-8 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 lg:mb-16">
            <SectionHeader
              enTitle="Advisory Council"
              hiTitle="सलाहकार परिषद्"
              description="Experienced professionals providing strategic, legal and institutional guidance to the Foundation."
            />
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {teamStructure.advisory.map((member, index) => (
              <TeamMemberCard key={`advisory-${index}`} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= VOLUNTEER & PROFESSIONAL NETWORK SECTION ================= */}
      <section className="py-20 lg:py-28 px-6 lg:px-8 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 lg:mb-16">
            <SectionHeader
              enTitle="Volunteer & Professional Network"
              hiTitle="स्वयंसेवक एवं प्रोफेशनल नेटवर्क"
              description="Dedicated volunteers and professionals supporting education, counselling, technology and community development initiatives."
            />
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {teamStructure.volunteers.map((member, index) => (
              <TeamMemberCard key={`volunteer-${index}`} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= JOIN OUR MISSION CTA SECTION ================= */}
      <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#002344] text-white border-t border-[#003366]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-8"
          >
            {/* Heading */}
            <div className="space-y-3">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold leading-tight">
                Join Our Mission
              </h2>
              <div className="flex justify-center">
                <div className="w-12 h-1 bg-[#fb8500] rounded-full"></div>
              </div>
            </div>

            {/* Subheading */}
            <p className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto font-light">
              Together we can create lasting social impact through education, service and innovation.
            </p>

            {/* CTA Buttons */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              <Link to="/Volunteer">
                <button className="w-full px-6 py-3.5 lg:py-4 bg-[#fb8500] hover:bg-[#e07600] text-[#002344] font-bold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 text-sm lg:text-base">
                  Become a Volunteer
                </button>
              </Link>
              <Link to="/About">
                <button className="w-full px-6 py-3.5 lg:py-4 bg-white hover:bg-blue-50 text-[#002344] font-bold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 text-sm lg:text-base">
                  Become a Member
                </button>
              </Link>
              <Link to="/PartnerWithUs">
                <button className="w-full px-6 py-3.5 lg:py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-lg transition-all duration-300 hover:border-[#fb8500] active:scale-95 text-sm lg:text-base">
                  Partner With Us
                </button>
              </Link>
              <Link to="/Donate">
                <button className="w-full px-6 py-3.5 lg:py-4 bg-transparent border-2 border-[#fb8500] hover:bg-[#fb8500] hover:text-[#002344] text-[#fb8500] font-bold rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 text-sm lg:text-base">
                  Donate Now
                </button>
              </Link>
            </div>

            {/* Footer note */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-sm lg:text-base text-blue-200">
                Every contribution strengthens our mission to empower communities across India.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
