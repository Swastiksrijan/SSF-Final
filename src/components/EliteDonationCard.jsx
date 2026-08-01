import React from "react";

export default function EliteDonationCard() {
  const handleDonate = (method) => {
    try {
      const event = {
        event: "donation_click",
        method,
        timestamp: new Date().toISOString()
      };
      // Console log for quick verification
      console.log("Donation click:", event);
      // Push to dataLayer if available (GA4 / GTM)
      if (window && window.dataLayer && typeof window.dataLayer.push === "function") {
        window.dataLayer.push(event);
      }
    } catch (e) {
      console.warn("Donation analytics error", e);
    }
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-amber-400 p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-amber-400 font-extrabold uppercase tracking-wide text-lg">
            <span className="inline-block mr-2 animate-pulse">❤️</span>
            Support Our Mission & Donate Now
          </div>

          <p className="text-slate-200 max-w-3xl text-sm md:text-base font-medium">
            🌱 Your small contribution creates a big social impact in Education, Health & Women Empowerment. Swastik
            Srijan Foundation is a registered NGO in Rewa, Madhya Pradesh (Serving Pan India). Donations may be eligible for 80G tax exemption where applicable.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs font-bold bg-emerald-800/40 text-emerald-200 px-3 py-1 rounded-full">80G Tax Exemption</span>
            <span className="text-xs font-bold bg-emerald-800/20 text-emerald-200 px-3 py-1 rounded-full">12AB Registered</span>
            <span className="text-xs font-bold bg-emerald-800/20 text-emerald-200 px-3 py-1 rounded-full">CSR-1 Compliant</span>
            <span className="text-xs font-bold bg-emerald-800/20 text-emerald-200 px-3 py-1 rounded-full">Est. 2013</span>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center mt-3">
            <a
              href="https://zohosecurepay.in/checkout/yxvr3sa1-prwf19dxkza22/Donate-to-Swastik-Srijan-Foundation"
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => handleDonate("zoho")}
              aria-label="Donate via Zoho Pay"
              className="w-full md:w-auto"
            >
              <button className="w-full md:w-auto flex items-center gap-3 justify-center px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300">
                <span className="text-2xl">🔒</span>
                <div className="text-left">
                  <div className="text-sm font-black uppercase">Donate via Zoho Pay</div>
                  <div className="text-xs text-white/90">Cards / NetBanking / UPI</div>
                </div>
              </button>
            </a>

            <a
              href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => handleDonate("razorpay")}
              aria-label="Donate via Razorpay"
              className="w-full md:w-auto"
            >
              <button className="w-full md:w-auto flex items-center gap-3 justify-center px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-300">
                <span className="text-2xl">⚡</span>
                <div className="text-left">
                  <div className="text-sm font-black uppercase">Donate via Razorpay</div>
                  <div className="text-xs text-white/90">UPI / GPay / PhonePe / Paytm</div>
                </div>
              </button>
            </a>
          </div>

          <div className="mt-4 text-slate-300 text-xs font-semibold flex flex-wrap justify-center gap-6">
            <div>🛡️ <span className="text-emerald-300">256-Bit SSL Secure</span></div>
            <div>📜 <span className="text-emerald-300">Instant Tax Receipt</span></div>
            <div>🤝 <span className="text-emerald-300">100% Transparent Giving</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
