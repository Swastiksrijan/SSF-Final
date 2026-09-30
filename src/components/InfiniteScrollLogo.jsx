// "use client";
// import React, { useRef, useEffect, useState } from "react";
// import { motion } from "motion/react";

// export default function DualLogoScroll() {
//   const logosRow1 = [
//     { name: "Connect", img: "./images/logo5.png" },
//     { name: "IMPACT", img: "./images/logo1.png" },
//     { name: "Milaap", img: "./images/logo2.png" },
//     { name: "Ketto", img: "./images/logo3.png" },
//     { name: "Navankur", img: "./images/logo4.png" },
//   ];

//   const logosRow2 = [
//     { name: "Connect", img: "./images/logo5.png" },
//     { name: "Navankur", img: "./images/logo4.png" },
//     { name: "Ketto", img: "./images/logo3.png" },
//     { name: "IMPACT", img: "./images/logo1.png" },
//     { name: "Milaap", img: "./images/logo2.png" },
//   ];

//   // Auto-speed ScrollRow WITHIN SAME COMPONENT
//   const ScrollRow = ({ logos, reverse }) => {
//     const rowRef = useRef(null);
//     const [duration, setDuration] = useState(20);

//     useEffect(() => {
//       if (rowRef.current) {
//         const width = rowRef.current.scrollWidth;
//         const baseSpeed = 80; // control speed here
//         setDuration(width / baseSpeed);
//       }
//     }, []);

//     return (
//       <div className="w-full overflow-hidden">
//         <motion.div
//           ref={rowRef}
//           className="flex gap-6"
//           animate={{
//             x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
//           }}
//           transition={{
//             repeat: Infinity,
//             duration: duration,
//             ease: "linear",
//           }}
//         >
//           {/* duplicate logos for seamless loop */}
//           {[...logos, ...logos].map((logo, index) => (
//             <div
//               key={index}
//               className={`flex-shrink-0 w-34 h-16 md:w-70 md:h-26 bg-white shadow-lg border
//                 ${logo.name === "Navankur" ? "bg-zinc-800 border-zinc-700" : ""}
//                 flex items-center justify-center p-4`}
//             >
//               <img
//                 src={logo.img}
//                 alt={logo.name}
//                 className="w-full h-full object-contain"
//               />
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full flex flex-col gap-10 py-12">
//       {/* Scroll Right → */}
//       <ScrollRow logos={logosRow1} reverse={false} />

//       {/* Scroll Left ← */}
//       <ScrollRow logos={logosRow2} reverse={true} />
//     </div>
//   );
// }


import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InfiniteLogoScroll() {
  const logosRow1 = [
    { name: "Connect", img: "/images/logo5.png" },
    { name: "IMPACT", img: "/images/logo1.png" },
    { name: "Milaap", img: "/images/logo2.png" },
    { name: "Ketto", img: "/images/logo3.png" },
    { name: "Navankur", img: "/images/logo4.png" },
  ];

  const logosRow2 = [...logosRow1].reverse();

  const ScrollRow = ({ logos, reverse }) => {
    const rowRef = useRef(null);
    const [duration, setDuration] = useState(30); // ⬅ slower (CRY-style)

    useEffect(() => {
      if (rowRef.current) {
        const width = rowRef.current.scrollWidth;
        const baseSpeed = 120; // ⬅ smoother
        setDuration(width / baseSpeed);
      }
    }, []);

    return (
      <div className="w-full overflow-hidden">
        <motion.div
          ref={rowRef}
          className="flex items-center gap-8 md:gap-16 py-6"
          animate={{
            x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
          }}
          transition={{
            repeat: Infinity,
            duration: duration,
            ease: "linear",
          }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 h-20 flex items-center justify-center"
            >
              <img
                src={logo.img}
                alt={logo.name}
                className="max-h-16 object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition"
              />
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-10 mt-12">
      <ScrollRow logos={logosRow1} reverse={false} />
      <ScrollRow logos={logosRow2} reverse={true} />
    </div>
  );
}
