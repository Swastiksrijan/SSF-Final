import React from 'react';

export default function DonationBanner() {
  const razorpayLink = 'https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view';
  const zohoLink = 'https://pay.zoho.com/checkout/your-form-id'; // Replace with your Zoho Pay form URL

  return (
    <div className="w-full bg-gradient-to-r from-[#002344] to-[#001529] text-white py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Support Swastik Srijan Foundation</h3>
          <p className="text-sm opacity-90 mt-1">Choose a secure payment method to make your donation. Your contribution helps education, health, and livelihood programs across India.</p>
        </div>

        <div className="flex gap-3">
          <a
            href={razorpayLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold px-6 py-3 rounded-2xl shadow-md"
          >
            Donate via Razorpay
          </a>

          <a
            href={zohoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white hover:bg-zinc-100 text-[#002344] font-bold px-6 py-3 rounded-2xl shadow-md border border-white/20"
          >
            Donate via Zoho Pay
          </a>
        </div>
      </div>
    </div>
  );
}
