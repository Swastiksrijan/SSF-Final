
const image1 = "/images/real/ssf_event_members.jpg";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

function Aboutus() {
  return (
    <div className="relative w-full bg-white py-24 px-4 overflow-hidden">
      <div id="about" className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-[#003366] rounded-2xl transform rotate-3 opacity-20"></div>
            <img
              src={image1}
              className="relative rounded-lg shadow-xl w-full object-cover transform transition hover:scale-[1.02] duration-500"
              alt="About us visual"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h2 className="text-[#003366] font-bold tracking-widest uppercase text-sm">Who We Are</h2>
          <h1 className="cry-title text-black">
            A catalyst for <span className="italic">change</span> since 2013.
          </h1>

          <p className="text-xl text-zinc-600 font-medium leading-relaxed">
            Swastik Srijan Foundation is a registered non-profit dedicated to uplifting communities across India.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2.5 rounded-full bg-black shrink-0"></div>
              <p className="text-zinc-600">Empowering <strong>50,000+</strong> lives through sustainable development.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2.5 rounded-full bg-black shrink-0"></div>
              <p className="text-zinc-600">Working in <strong>Education, Healthcare, and Livelihood</strong>.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2.5 rounded-full bg-black shrink-0"></div>
              <p className="text-zinc-600">Partnering with NGOs, corporates, and volunteers like <strong>YOU</strong>.</p>
            </div>
          </div>

          <Link to="/About">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-8 py-3 border-2 border-black text-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
            >
              Read Our Full Story
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

export default Aboutus;
