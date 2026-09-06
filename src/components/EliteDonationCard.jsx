import React from "react";

export default function EliteDonationCard() {
  const handleDonate = (method) => {
    try {
      const event = {
        event: "donation_click",
        method,
        timestamp: new Date().toISOString()
      };
      console.log("Donation click:", event);
      if (window && window.dataLayer && typeof window.dataLayer.push === "function") {
        window.dataLayer.push(event);
      }
    } catch (e) {
      console.warn("Donation analytics error", e);
    }
  };

  return (
    <div className="w-full px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-br from-[#001529] via-[#002344] to-[#001529] border border-white/10 p-7 md:p-10 shadow-2xl">
        <div className="text-center space-y-6">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6600]/15 text-[#ff914d] text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] animate-pulse"></span>
              Make a Difference
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-white">
              Support Our <span className="text-[#FF6600]">Mission</span>
            </h2>
            <p className="mt-3 text-zinc-300 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
              Your contribution can help create lasting change in education, health, women empowerment and community development.
            </p>
            <p className="mt-2 text-zinc-400 text-sm font-hindi">
              आपका सहयोग शिक्षा, स्वास्थ्य, महिला सशक्तिकरण और सामुदायिक विकास में स्थायी बदलाव ला सकता है।
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            <span className="text-[11px] font-bold bg-white/5 border border-white/10 text-zinc-200 px-3.5 py-1.5 rounded-full">80G Eligible*</span>
            <span className="text-[11px] font-bold bg-white/5 border border-white/10 text-zinc-200 px-3.5 py-1.5 rounded-full">12AB Registered</span>
            <span className="text-[11px] font-bold bg-white/5 border border-white/10 text-zinc-200 px-3.5 py-1.5 rounded-full">CSR-1</span>
            <span className="text-[11px] font-bold bg-white/5 border border-white/10 text-zinc-200 px-3.5 py-1.5 rounded-full">Serving Since 2013</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2">
            <a
              href="https://zohosecurepay.in/checkout/yxvr3sa1-prwf19dxkza22/Donate-to-Swastik-Srijan-Foundation"
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => handleDonate("zoho")}
              aria-label="Donate via Zoho Payments"
              className="group w-full"
            >
              <div className="h-full flex items-center gap-4 justify-center px-6 py-4 rounded-2xl bg-[#FF6600] hover:bg-[#ff7a1a] text-white font-bold shadow-lg transition-all group-hover:-translate-y-0.5">
                <span className="text-2xl">❤️</span>
                <div className="text-left">
                  <div className="text-sm font-black uppercase tracking-wide">Donate via Zoho Payments</div>
                  <div className="text-xs text-white/90 mt-0.5">UPI • Cards • Net Banking</div>
                </div>
              </div>
            </a>

            <a
              href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => handleDonate("razorpay")}
              aria-label="Donate via Razorpay"
              className="group w-full"
            >
              <div className="h-full flex items-center gap-4 justify-center px-6 py-4 rounded-2xl bg-white text-[#002344] border border-white hover:bg-zinc-100 font-bold shadow-lg transition-all group-hover:-translate-y-0.5">
                <span className="text-2xl">⚡</span>
                <div className="text-left">
                  <div className="text-sm font-black uppercase tracking-wide">Donate via Razorpay</div>
                  <div className="text-xs text-zinc-500 mt-0.5">UPI • GPay • PhonePe • Paytm</div>
                </div>
              </div>
            </a>
          </div>

          <div className="pt-2 text-zinc-400 text-[11px] flex flex-wrap justify-center gap-x-6 gap-y-2">
            <div>🔒 <span className="text-zinc-300">Secure Online Payment</span></div>
            <div>📄 <span className="text-zinc-300">Donation Receipt</span></div>
            <div>🤝 <span className="text-zinc-300">Transparent Giving</span></div>
          </div>

          <p className="text-[10px] text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            *Tax exemption is subject to applicable provisions and donor eligibility.
          </p>
        </div>
      </div>
    </div>
  );
}
