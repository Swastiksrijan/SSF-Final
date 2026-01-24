// import { useState } from 'react';

// export default function FAQSection() {
//   const [openIndex, setOpenIndex] = useState(0);

//   const faqs = [
//     {
//       question: "What is Swastik Srijan Foundation?",
//       answer: "Swastik Srijan Foundation is a non-profit organization dedicated to community development through health, education, rural empowerment, women’s upliftment, and environmental sustainability."
//     },
//     {
//       question: "What are the key focus areas of the Foundation?",
//       answer: "Our work spans community well-being, rural empowerment, education support, health & hygiene awareness, women’s empowerment, and sustainable development initiatives."
//     },
//     {
//       question: "How can individuals contribute or volunteer?",
//       answer: "You can support us through donations, volunteering, partnerships, or by sharing your success stories. Every contribution—big or small—helps create meaningful impact."
//     },
//     {
//       question: "How did the Foundation support communities during COVID-19?",
//       answer: "We distributed masks, food, and water, and ran awareness drives to support vulnerable communities during the pandemic."
//     },
//     {
//       question: "What is the SSF Learning Hub?",
//       answer: "The SSF Learning Hub is our educational initiative focused on providing accessible, quality learning resources to empower students and promote long-term growth."
//     }
//   ];

//   const toggleFAQ = (index) => {
//     setOpenIndex(openIndex === index ? -1 : index);
//   };

//   return (
//     <div className="min-h-screen w-full bg-white py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-extrabold italic text-center mb-12 text-gray-800">
//           FAQ
//         </h1>
        
//         <div className="space-y-10">
//           {faqs.map((faq, index) => (
//             <div
//               key={index}
//               className="bg-[#EDEDED] shadow-[6px_6px_0px_#333] overflow-hidden"
//             >
//               <button
//                 onClick={() => toggleFAQ(index)}
//                 className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-250 transition-colors"
//               >
//                 <img src="./images/Back.png"
//                   className={`flex-shrink-0 w-5 mt-1 transition-transform duration-300 ${
//                     openIndex === index ? 'rotate-180' : ''
//                   }`}
//                   size={24}
//                   strokeWidth={1.5}
//                 />
//                 <span className="flex-1 text-xl font-serif text-gray-800 leading-tight">
//                   {faq.question}
//                 </span>
//               </button>
              
//               {openIndex === index && faq.answer && (
//                 <div className="px-6 pb-6 pl-16">
//                   <div className="">
//                     <p className="text-gray-700 leading-relaxed">
//                       {faq.answer}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is Swastik Srijan Foundation?",
      answer:
        "Swastik Srijan Foundation is a non-profit organization dedicated to community development through health, education, rural empowerment, women’s upliftment, and environmental sustainability.",
    },
    {
      question: "What are the key focus areas of the Foundation?",
      answer:
        "Our work spans community well-being, rural empowerment, education support, health & hygiene awareness, women’s empowerment, and sustainable development initiatives.",
    },
    {
      question: "How can individuals contribute or volunteer?",
      answer:
        "You can support us through donations, volunteering, partnerships, or by sharing your success stories. Every contribution—big or small—helps create meaningful impact.",
    },
    {
      question: "How did the Foundation support communities during COVID-19?",
      answer:
        "We distributed masks, food, and water, and ran awareness drives to support vulnerable communities during the pandemic.",
    },
    {
      question: "What is the SSF Learning Hub?",
      answer:
        "The SSF Learning Hub is our educational initiative focused on providing accessible, quality learning resources to empower students and promote long-term growth.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="w-full bg-zinc-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-4xl font-black text-zinc-900">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-600">
            Find answers to common questions about our work and mission.
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center gap-4 p-6 text-left"
              >
                <FiChevronDown
                  className={`text-xl text-zinc-600 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />

                <span className="text-lg font-semibold text-zinc-900">
                  {faq.question}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 pl-14">
                  <p className="text-zinc-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
