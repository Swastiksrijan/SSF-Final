import { motion } from "framer-motion";

const governingBody = [
  { name: "Mr. Ramesh Pandey", role: "Founder & National President", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/ramesh_pandey.jpg" },
  { name: "Ms. Preeti Shukla", role: "Vice President", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_19.jpg" },
  { name: "Mr. Amit Pandey", role: "General Secretary", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_15.jpg" },
  { name: "Ms. Divya Sharma", role: "Treasurer", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/divya_sharma.jpg" },
  { name: "Ms. Kiran Pandey", role: "Joint Secretary", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_22.jpg" },
  { name: "Mr. Sandeep Tripathi", role: "Board Member", location: "Satna, Madhya Pradesh", img: "/Teams_Images/sandeep_tripathi.jpg" },
  { name: "Mr. Prameesh Singh", role: "Board Member", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/prameesh_singh.jpg" },
  { name: "Mr. Rishi Pandey", role: "Board Member", location: "Satna, Madhya Pradesh", img: "/Teams_Images/rishi_pandey.jpg" },
  { name: "Mr. Ritesh Tiwari", role: "Board Member", location: "Mumbai, Maharashtra", img: "/Teams_Images/ritesh_tiwari.jpg" },
];

const managementTeam = [
  { name: "Mr. Ramesh Pandey", role: "Founder & National President", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/ramesh_pandey.jpg" },
  { name: "Ms. Preeti Shukla", role: "Program Head", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_19.jpg" },
  { name: "Mr. Amit Pandey", role: "Operations & Administration", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_15.jpg" },
  { name: "Ms. Divya Sharma", role: "Chief Finance Officer", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/divya_sharma.jpg" },
  { name: "Ms. Kiran Pandey", role: "Compliance Officer", location: "Rewa, Madhya Pradesh", img: "/Teams_Images/image_22.jpg" },
  { name: "Ms. Priya Shukla", role: "Admin Support & Core Volunteer", location: "Madhya Pradesh", img: "/Teams_Images/priya_shukla.jpg" },
];

const regionalLeadership = [
  { name: "Mr. Azad Singh Adhana", role: "Regional Head & Operations", location: "Greater Noida, Uttar Pradesh", img: "/Teams_Images/azad_singh.jpg" },
  { name: "Mr. Naresh Kumar", role: "President, Faridabad Wing", location: "Faridabad, Haryana", img: "/Teams_Images/naresh_kumar.jpg" },
  { name: "Mr. Dhiraj Kumar", role: "President, Pune Wing", location: "Pune, Maharashtra", img: "/Teams_Images/image_4.png" },
  { name: "Mr. Surender Mishra", role: "President, Uttar Pradesh Wing", location: "Greater Noida, Uttar Pradesh", img: "/Teams_Images/surender_mishra.jpg" },
];

const advisoryBoard = [
  { name: "Mr. Kapil Tiwari", role: "Legal Advisor", location: "Madhya Pradesh", img: "/Teams_Images/kapil_tiwari.jpg" },
  { name: "Mr. Harish Kumar", role: "Legal Advisor", location: "Madhya Pradesh", img: "/Teams_Images/harish_kumar.jpg" },
  { name: "Mr. Raji P. Alex", role: "National Advisory Board", location: "Delhi NCR", img: "/Teams_Images/raji_p_alex.jpg" },
  { name: "Ms. Amrita Sinha", role: "Coordination Officer & Volunteer", location: "Delhi", img: "/Teams_Images/image_20.jpg" },
  { name: "Mr. Ghanshyam Sharma", role: "National Advisor", location: "Gautam Buddha Nagar, UP", img: "/Teams_Images/ghanshyam_sharma.jpg" },
  { name: "Mr. Chaman Rajora", role: "Support & National Advisory Board", location: "Haryana", img: "/Teams_Images/chaman_rajora.jpg" },
];

const volunteersTeam = [
  { name: "Mr. Rajeev Pandey", role: "Advisor & Volunteer", location: "Madhya Pradesh", img: "/Teams_Images/rajeev_pandey.jpg" },
  { name: "Ms. A. Gincy George", role: "Head, Counselling Services", location: "Mumbai, Maharashtra", img: "/Teams_Images/image_1.jpg" },
  { name: "Ms. Aayushi Tyagi", role: "Volunteer", location: "Ghaziabad, Uttar Pradesh", img: "/Teams_Images/aayushi_tyagi.jpg" },
  { name: "Mr. Krishna Kumar", role: "Volunteer & Advisor", location: "Hyderabad, Telangana", img: "/Teams_Images/krishna_kumar.jpg" },
  { name: "Ms. Sneha Ravishankar Pandey", role: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/sneha_ravishankar_pandey.jpg" },
  { name: "Ms. Vaishnavi Manik Chaudhari", role: "Web & Technical Support Volunteer", location: "Mumbai, Maharashtra", img: "/Teams_Images/vaishnavi_manik_chaudhari.jpg" },
];

export default function Team() {
  return (
    <main className="min-h-screen bg-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full bg-zinc-50 pt-24 pb-12 flex justify-center min-h-[40vh]">
        <div className="container mx-auto px-4 flex justify-center">
          <img
            src="/images/real/office_banner.jpg"
            alt="Meet Our Team"
            className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-xl border border-zinc-100"
          />
        </div>
      </section>



      {/* ================= MANAGEMENT & OPERATIONS ================= */}
      <section className="py-24 px-6 bg-[#f8f9fa] border-y border-zinc-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">
              Management & Operations | प्रबंधन और संचालन
            </h2>
            <div className="w-24 h-1 bg-[#d90429] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementTeam.map((member, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-zinc-100 flex flex-col items-center text-center hover:border-[#fb8500]/30 transition-all shadow-sm group"
              >
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-zinc-50 shadow-sm group-hover:shadow-md transition-all">
                  <img
                    src={member.img || "/images/real/coordinator-ramesh.jpg"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[#fb8500] text-[10px] font-bold uppercase tracking-widest leading-tight">{member.role}</p>
                  <h4 className="text-lg font-serif font-bold text-[#002344] group-hover:text-[#d90429] transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 italic mt-1">{member.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-10">
            <p className="text-zinc-500 font-medium italic">
              "Dedicated core team managing the foundation's day-to-day excellence and strategic growth."
            </p>
          </div>
        </div>
      </section>

      {/* ================= REGIONAL LEADERSHIP ================= */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">
              Regional Leadership | क्षेत्रीय नेतृत्व
            </h2>
            <div className="w-24 h-1 bg-[#fb8500] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {regionalLeadership.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4 group"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#002344] group-hover:text-[#fb8500] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    {member.role}
                  </p>
                  <p className="text-[10px] text-zinc-400 italic mt-1">{member.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ADVISORY BOARD ================= */}
      <section className="py-24 px-6 bg-[#fdfcfb]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">
              Advisory Board & Supporters | सलाहकार बोर्ड और समर्थक
            </h2>
            <div className="w-24 h-1 bg-[#2d6a4f] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {advisoryBoard.map((member, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-lg transition-all duration-500">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#002344] text-sm md:text-base leading-tight">{member.name}</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1 leading-tight">{member.role}</p>
                  <p className="text-[9px] text-zinc-400 italic mt-0.5">{member.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VOLUNTEERS ================= */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">
              Volunteers & Extended Team | स्वयंसेवक और विस्तारित टीम
            </h2>
            <div className="w-24 h-1 bg-[#fb8500] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {volunteersTeam.map((member, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#002344]">{member.name}</h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">{member.role}</p>
                  <p className="text-[10px] text-zinc-400 italic mt-1">{member.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GOVERNING BODY ================= */}
      <section className="py-24 px-6 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">
              Governing Body (Governance & Compliance)
            </h2>
            <div className="w-24 h-1 bg-[#fb8500] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {governingBody.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 border-4 border-zinc-50 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img
                    src={member.img || "/images/real/coordinator-ramesh.jpg"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002344]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">{member.location}</p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-serif font-bold text-[#002344] group-hover:text-[#fb8500] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    {member.role}
                  </p>
                  <p className="text-[10px] text-zinc-400 italic mt-1">{member.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FIELD TEAM & COMMUNITY ================= */}
      <section className="py-24 px-6 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">
              Our Field Force & Community Leaders | हमारा फील्ड फोर्स और सामुदायिक नेता
            </h2>
            <div className="w-24 h-1 bg-[#fb8500] mx-auto rounded-full"></div>
            <p className="text-zinc-500 max-w-2xl mx-auto mt-6">
              The heart of Swastik Srijan Foundation – our dedicated team members who work directly with the communities on the ground.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
          >
            <img
              src="/images/real/ssf_event_members.jpg"
              alt="SSF Community and Field Team"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

    </main>
  );
}
