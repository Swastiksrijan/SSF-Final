import { useEffect, useState } from "react";
import {
  FaUndoAlt,
  FaMoneyBillWave,
  FaClipboardCheck,
  FaCreditCard,
  FaExclamationTriangle,
  FaSyncAlt,
  FaFileInvoiceDollar,
  FaEnvelope
} from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import PageHero from "../components/PageHero";

export default function RefundAndCancellation() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "intro",
      icon: <FaUndoAlt />,
      title: "1. Introduction",
      content:
        "Swastik Srijan Foundation (SSF) is committed to maintaining transparency and accountability in all financial transactions. This Refund and Cancellation Policy explains the terms related to donations and payments made through our website."
    },
    {
      id: "donation",
      icon: <FaMoneyBillWave />,
      title: "2. Donation Cancellation Policy",
      content:
        "All donations made to Swastik Srijan Foundation are voluntary contributions towards our social development programs. Once a donation has been successfully completed, it generally cannot be cancelled."
    },
    {
      id: "refund",
      icon: <FaFileInvoiceDollar />,
      title: "3. Refund Policy",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Donations are generally non-refundable as they are utilized for charitable activities and programs.
          </li>
          <li>
            Refund requests may be considered only in exceptional cases such as duplicate payments or technical errors.
          </li>
          <li>
            Refund eligibility will be reviewed after verification of transaction details.
          </li>
        </ul>
      )
    },
    {
      id: "process",
      icon: <FaClipboardCheck />,
      title: "4. Refund Request Process",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Refund requests must be submitted with transaction details, payment reference number, donor name, and reason for request.
          </li>
          <li>
            After verification, approved refunds will be processed through the original payment method wherever possible.
          </li>
          <li>
            Processing time may vary depending on banks and payment service providers.
          </li>
        </ul>
      )
    },
    {
      id: "payment",
      icon: <FaCreditCard />,
      title: "5. Payment Gateway Issues",
      content:
        "In case of failed, pending, or unsuccessful payment transactions, please contact us with your transaction details. We will verify the status and assist accordingly."
    },
    {
      id: "unauthorized",
      icon: <FaExclamationTriangle />,
      title: "6. Unauthorized Transactions",
      content:
        "If you notice any unauthorized transaction made using your payment method, please immediately contact your bank/payment provider and inform Swastik Srijan Foundation for assistance."
    },
    {
      id: "updates",
      icon: <FaSyncAlt />,
      title: "7. Policy Updates",
      content:
        "Swastik Srijan Foundation reserves the right to update or modify this Refund and Cancellation Policy whenever required. Updated policies will be published on this website."
    }
  ];

  return (
    <div className="w-full bg-zinc-50 font-inria">

      {/* ================= HERO ================= */}
      <PageHero
        image="/images/real/academy-board-compliance.jpg"
        title="Refund & Cancellation Policy"
        subtitle="Please review our refund and cancellation terms before making any payment."
        hindiSubtitle="रिफंड और रद्दीकरण नीति - भुगतान करने से पहले कृपया हमारी नीति को पढ़ें।"
      />

      <div className="max-w-5xl mx-auto py-16 px-4">

        {/* ================= INTRO CARD ================= */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border-l-8 border-[#003366]">

          <h2 className="text-3xl font-bold mb-6 text-zinc-900">
            Transparency in Donations
          </h2>

          <p className="text-lg text-zinc-600 leading-relaxed">
            Swastik Srijan Foundation believes in responsible financial management.
            Every contribution received is handled with accountability and utilized
            towards our education, community development, and social welfare initiatives.
          </p>

        </div>


        {/* ================= SECTIONS GRID ================= */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">

          {sections.map((section) => (

            <div
              key={section.id}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#003366] group"

              onMouseEnter={() => setActiveSection(section.id)}
              onMouseLeave={() => setActiveSection(null)}
            >

              <div className="flex items-start gap-4">

                <div
                  className={`mt-1 p-3 rounded-full text-xl transition-colors duration-300 ${
                    activeSection === section.id
                      ? "bg-[#003366] text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {section.icon}
                </div>


                <div>

                  <h3 className="text-xl font-bold mb-3 text-zinc-900 group-hover:text-[#003366] transition-colors">
                    {section.title}
                  </h3>


                  <div className="text-zinc-600 leading-relaxed">
                    {section.content}
                  </div>


                </div>

              </div>

            </div>

          ))}

        </div>



        {/* ================= CONTACT SECTION ================= */}

        <div className="bg-zinc-900 rounded-2xl shadow-xl overflow-hidden relative">

          <div className="absolute top-0 right-0 w-64 h-64 bg-[#003366] opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>


          <div className="p-10 md:p-16 text-center relative z-10">

            <div className="w-16 h-16 bg-[#003366] text-white rounded-full mx-auto flex items-center justify-center text-3xl mb-6">
              <FaEnvelope />
            </div>


            <h2 className="text-3xl font-bold text-white mb-4">
              Refund Related Questions?
            </h2>


            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              For refund requests or payment-related concerns, please contact our team with your transaction details.
            </p>


            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20 inline-block">

              <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">
                Contact Email
              </p>


              <p className="text-white font-bold text-lg">
                {CONTACT_INFO.primaryEmail}
              </p>


              <p className="text-zinc-300 mt-3">
                {CONTACT_INFO.phones.primaryFormatted}
              </p>


            </div>


          </div>


        </div>


      </div>

    </div>
  );
}
