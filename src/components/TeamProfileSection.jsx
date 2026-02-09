import React from "react";

const teamMembers = [
  { name: "Mr. Ramesh Pandey", position: "Founder & National President", img: "/Teams_Images/ramesh_pandey.jpg" },
  { name: "Ms. Preeti Shukla", position: "Vice President & Program Head", img: "/Teams_Images/image_19.jpg" },
  { name: "Mr. Amit Pandey", position: "General Secretary & Operations", img: "/Teams_Images/image_15.jpg" },
  { name: "Ms. Divya Sharma", position: "Treasurer & CFO", img: "/Teams_Images/divya_sharma.jpg" },
  { name: "Ms. Kiran Pandey", position: "Joint Secretary & Compliance", img: "/Teams_Images/image_22.jpg" },
  { name: "Mr. Naresh Kumar", position: "President - Faridabad Wing", img: "/Teams_Images/naresh_kumar.jpg" },
  { name: "Ms. A. Gincy George", position: "Head - Counselling Services", img: "/Teams_Images/image_1.jpg" },
  { name: "Mr. Raji P. Alex", position: "National Advisory Board", img: "/Teams_Images/raji_p_alex.jpg" },
  { name: "Mr. Kapil Tiwari", position: "Legal Advisor", img: "/Teams_Images/kapil_tiwari.jpg" },
  { name: "Mr. Harish Kumar", position: "Legal Advisor", img: "/Teams_Images/harish_kumar.jpg" },
  { name: "Mr. Krishna Kumar", position: "Volunteer & Advisor", img: "/Teams_Images/krishna_kumar.jpg" },
  { name: "Ms. Aayushi Tyagi", position: "Volunteer", img: "/Teams_Images/aayushi_tyagi.jpg" },
  { name: "Mr. Rajeev Pandey", position: "Advisor & Volunteer", img: "/Teams_Images/rajeev_pandey.jpg" },
  { name: "Ms. Amrita Sinha", position: "Coordination Officer", img: "/Teams_Images/image_20.jpg" },
  { name: "Mr. Ghanshyam Sharma", position: "National Advisor", img: "/Teams_Images/ghanshyam_sharma.jpg" },
  { name: "Ms. Priya Shukla", position: "Admin Support & Volunteer", img: "/Teams_Images/priya_shukla.jpg" },
  { name: "Mr. Sandeep Tripathi", position: "Board Member", img: "/Teams_Images/sandeep_tripathi.jpg" },
  { name: "Mr. Prameesh Singh", position: "Board Member", img: "/Teams_Images/prameesh_singh.jpg" },
  { name: "Mr. Rishi Pandey", position: "Board Member", img: "/Teams_Images/rishi_pandey.jpg" },
  { name: "Mr. Ritesh Tiwari", position: "Board Member", img: "/Teams_Images/ritesh_tiwari.jpg" },
  { name: "Mr. Chaman Rajora", position: "National Advisory Board", img: "/Teams_Images/chaman_rajora.jpg" },
  { name: "Mr. Surender Mishra", position: "President - UP Wing", img: "/Teams_Images/surender_mishra.jpg" },
  { name: "Mr. Azad Singh Adhana", position: "Regional Head & Operations", img: "/Teams_Images/azad_singh.jpg" },
  { name: "Ms. Sneha Ravishankar Pandey", position: "Web & Technical Support Volunteer", img: "/Teams_Images/sneha_ravishankar_pandey.jpg" },
  { name: "Ms. Vaishnavi Manik Chaudhari", position: "Web & Technical Support Volunteer", img: "/Teams_Images/vaishnavi_manik_chaudhari.jpg" },
];

export default function TeamProfileSection() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-10">
      {teamMembers.map((member, idx) => (
        <div
          key={idx}
          className="text-center group"
        >
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto overflow-hidden rounded-full border-2 border-[#fb8500]/20 group-hover:border-[#fb8500] transition-colors duration-300 shadow-sm group-hover:shadow-md">
            <img
              src={member.img || "/images/team/placeholder.jpg"}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <h3 className="mt-4 font-serif font-bold text-zinc-900 text-sm group-hover:text-[#fb8500] transition-colors">
            {member.name}
          </h3>

          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
            {member.position}
          </p>
        </div>
      ))}
    </div>
  );
}
