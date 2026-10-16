import React from 'react';

export default function DonationBanner() {
  const razorpayLink = 'https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view';
  const zohoLink = 'https://zohosecurepay.in/checkout/yxvr3sa1-prwf19dxkza22/Donate-to-Swastik-Srijan-Foundation';

  return (
    <div className="w-full bg-gradient-to-r from-[#12345A] to-[#12345A] text-white py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-[#F7A814] rounded-2xl p-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-bold text-[#F7A814]">Support Swastik Srijan Foundation</h3>
          <p className="text-sm text-white/90 mt-1">
            Your gift fuels education, health & livelihood programs. Donors receive 80G tax benefits where applicable.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-block bg-white/5 border border-[#F7A814] text-[#F7A814] px-2 py-1 rounded-full text-xs font-bold">80G</span>
            <span className="text-xs text-white/70">Certificates provided on request</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex gap-3">
          <a
            href={razorpayLink}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-block bg-[#F7A814] text-[#12345A] font-bold px-5 py-2.5 rounded-full shadow-md hover:opacity-95 transition"
          >
            Donate via Razorpay
          </a>

          <a
            href={zohoLink}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-block bg-transparent text-white font-semibold px-5 py-2.5 rounded-full border-2 border-white/20 hover:border-[#F7A814] hover:text-[#F7A814] transition"
          >
            Donate via Zoho Pay
          </a>
        </div>
      </div>
    </div>
  );
}
