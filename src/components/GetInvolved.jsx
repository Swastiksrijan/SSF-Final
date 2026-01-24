// import { FaArrowRightLong } from "react-icons/fa6";
// import { Link } from "react-router";

// const GetInvolved = () => {
//   return (
//     <div id="join-us" className="w-full min-h-screen flex items-center justify-center py-10 px-4">
//       <div className="w-full max-w-6xl min-h-96 mx-auto space-y-10">

//         <div className="text-center space-y-2 flex items-center justify-center flex-col">
//           <h1 className="font-black text-4xl italic">Get Involved - Swastik Srijan Foundation</h1>
//           <p className="max-w-130 font-bold text-zinc-500">join us to create impact in education , health, woman empowerment, environment and more</p>
//         </div>

//         {/* volunteer */}
//         <div className="w-full bg-[#ECF9FF] flex items-center flex-col-reverse md:flex-row gap-10 p-6 rounded-2xl">
//           <div className="f_content flex flex-col gap-4 justify-around w-full md:w-1/2">
//             <h3 className="text-3xl font-black">Volunteer</h3>
//             <p className="max-w-[380px] text-zinc-500 tracking-wide font-bold">Contribute your time and passion to make a difference. Work directly with communities and see your impact firsthand.</p>
//             <div className="flex items-center flex-wrap gap-4 max-w-[300px]">
//               <span className="bg-[#A7E1FF] py-1 px-4 rounded-md">Community Work</span>
//               <span className="bg-[#A7E1FF] py-1 px-4 rounded-md">Teaching</span>
//               <span className="bg-[#A7E1FF] py-1 px-4 rounded-md">Awareness Drives</span>
//             </div>
//             <Link to="/volunteer" className="bg-[#005DFF] text-white drop-shadow-md drop-shadow-white font-bold text-xl px-4 py-3 flex items-center justify-center gap-2 rounded-xl cursor-pointer hover:scale-103 active:scale-95 duration-200 transition-all ease">
//               <span>Explore</span>
//               <FaArrowRightLong />
//             </Link>
//           </div>
//           <div className="s_content w-full md:w-1/2">
//             <img src="./images/volunteers.png" alt="" />
//           </div>
//         </div>

//         {/* members */}
//         <div className="w-full bg-[#FFEDDC] grid grid-cols-1 md:grid-cols-2 gap-10 p-6 rounded-2xl">
//           <div className="f_content">
//             <img src="./images/members.png" alt="" />
//           </div>
//           <div className="s_content flex flex-col gap-4 justify-around">
//             <h3 className="text-3xl font-black">Member</h3>
//             <p className="max-w-[380px] text-zinc-500 tracking-wide font-bold">Join our growing family and be part of lasting change . As a member, you help sustain long-term projects and empower communities.</p>
//             <div className="flex items-center flex-wrap gap-4 max-w-[300px]">
//               <span className="bg-[#FFC898] py-1 px-4 rounded-md">Membership Benefit</span>
//               <span className="bg-[#FFC898] py-1 px-4 rounded-md">Network</span>
//               <span className="bg-[#FFC898] py-1 px-4 rounded-md">Impact Reports</span>
//             </div>
//             <Link
//             to="/members"
//             className="bg-[#FB7C1B] hover:bg-[#f7842c] hover:scale-105 drop-shadow-md drop-shadow-white text-white font-bold text-xl px-4 py-3 flex items-center justify-center gap-2 rounded-xl cursor-pointer active:scale-90 duration-200 transition-all ease">
//               <span>Explore</span>
//               <FaArrowRightLong />
//             </Link>
//           </div>

//         </div>

//         {/* SSF Learning Hub */}
//         <div className="w-full bg-[#E7FFF4] p-6 rounded-2xl grid grid-cols-1 gap-10">
//           <div className="f_content">
//             <img src="./images/learningHub.png" alt="" />
//           </div>
//           <div className="s_content flex flex-col items-center gap-4 justify-center text-center space-y-2">
//             <h3 className="text-3xl font-black">SSF Learning Hub</h3>
//             <p className="max-w-[660px] text-zinc-500 tracking-wide font-bold">Your trusted hub for free support and services, dedicated to empowering individuals and communities. We believe that knowledge and resources should be accessible to everyone, regardless of background. Our mission is to make knowledge and resources accessible to everyone</p>
//             <div className="flex items-center flex-wrap gap-4 justify-center">
//               <span className="bg-[#72FABC] py-1 px-4 rounded-md">Free Resources</span>
//               <span className="bg-[#72FABC] py-1 px-4 rounded-md">Skill Building</span>
//               <span className="bg-[#72FABC] py-1 px-4 rounded-md">Workshops</span>
//             </div>
//             <Link to="/learningHub" className="bg-[#029D56] hover:bg-[#02af61] hover:scale-103 mt-2 text-white w-full font-bold text-xl px-4 py-3 flex items-center justify-center gap-2 rounded-xl cursor-pointer active:scale-90 duration-200 transition-all ease">
//               <span>Explore</span>
//               <FaArrowRightLong />
//             </Link>
//           </div>

//         </div>

//         <div className="w-full p-6 rounded-2xl flex items-center justify-center">
//           <div className="content space-y-6 text-center flex flex-col items-center justify-center">
//             <h2 className="text-4xl italic font-black">Want to do more ?</h2>
//             <div className="">
//               <img src="./images/cpi_group.svg" alt="" />
//             </div>
//             <button className="bg-[#FFD609] hover:bg-[#FFD609] hover:scale-105 mt-6 text-zinc-800 font-bold text-xl px-8 border-2 border-zinc-600/60 py-3 flex items-center justify-center gap-2 rounded-xl cursor-pointer active:scale-95 duration-200 transition-all ease">
//               <a href="https://docs.google.com/forms/d/e/1FAIpQLSc3Wb-839SLDzv3A9QkbfpnJt_ORBQZbVByModSfDjQs-JuBQ/viewform" target="_blank">Apply Now</a>
//               <FaArrowRightLong />
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default GetInvolved



import { FaArrowRight } from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

const GetInvolved = () => {
  return (
    <section id="join-us" className="bg-[#F8F9FA] py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* ================= HEADER ================= */}
        <div className="text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cry-title"
          >
            Join. Learn. Support.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-zinc-600 font-medium"
          >
            Join a movement of changemakers dedicated to building a better future for every child.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* VOLUNTEER CARD */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-10 rounded-2xl shadow-sm border border-zinc-200 flex flex-col md:flex-row gap-8 items-center group hover:border-[#003366] transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#003366] opacity-10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>

            <div className="w-full md:w-1/3">
              <img src="./images/volunteers.png" alt="Volunteer" className="w-full rounded-lg shadow-md transform group-hover:rotate-2 transition-transform duration-300" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-[#003366] transition-colors">Volunteer</h3>
              <p className="text-zinc-600">Give your time and talent to support our groundwork.</p>
              <Link to="/Volunteer" className="inline-flex items-center gap-2 font-bold text-black border-b-2 border-black pb-1 hover:text-[#003366] hover:border-[#003366] transition-colors">
                Join the Team <FaArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

          {/* MEMBERS CARD */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-10 rounded-2xl shadow-sm border border-zinc-200 flex flex-col md:flex-row gap-8 items-center group hover:border-[#003366] transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-black opacity-5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>

            <div className="w-full md:w-1/3">
              <img src="./images/members.png" alt="Members" className="w-full rounded-lg shadow-md transform group-hover:-rotate-2 transition-transform duration-300" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-[#003366] transition-colors">Become a Member</h3>
              <p className="text-zinc-600">Support our long-term vision with monthly contributions.</p>
              <Link to="/members" className="inline-flex items-center gap-2 font-bold text-black border-b-2 border-black pb-1 hover:text-[#003366] hover:border-[#003366] transition-colors">
                Learn More <FaArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* CTA BOX */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-black rounded-2xl p-12 text-center relative overflow-hidden"
        >
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to make a difference?</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">Your contribution, no matter how small, helps us create a world where every child is safe, educated, and heard.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                target="_blank"
                className="px-8 py-4 bg-[#003366] text-white font-bold uppercase tracking-wide hover:bg-white hover:text-[#003366] transition-colors rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Donate Now
              </a>
              <Link
                to="/Contact"
                className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors rounded-lg"
              >
                Partner With Us
              </Link>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-zinc-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-20 -mt-20"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#003366] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -mr-20 -mb-20"></div>
        </motion.div>

      </div>
    </section>
  );
};

export default GetInvolved;
