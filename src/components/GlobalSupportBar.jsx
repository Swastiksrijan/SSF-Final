import { FaHeart, FaBuilding, FaTools, FaShareAlt, FaUniversity, FaHandshake } from "react-icons/fa";

const RAZORPAY_URL = "https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view";

export default function GlobalSupportBar() {
  const sharePage = async () => {
    const url = window.location.href;
    const data = {
      title: "Support Swastik Srijan Foundation Samiti",
      text: "Support SSF through donations, CSR, machinery, production units, materials, skills or partnerships.",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        window.alert("This page link has been copied. You can now share it.");
      } else {
        window.prompt("Copy this page link:", url);
      }
    } catch (error) {
      if (error?.name !== "AbortError") console.error("Page sharing failed", error);
    }
  };

  return (
    <section aria-label="Support Swastik Srijan Foundation" className="relative overflow-hidden bg-[#002344] px-5 py-10 text-white md:px-8 md:py-12">
      <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#2d6a4f]/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#ffb347]">Every form of support matters</p>
            <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">Be a part of the SSF mission</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">दान, CSR, मशीनरी, पूरी उत्पादन यूनिट, उपकरण, कच्चा माल, जगह, वाहन, तकनीकी ज्ञान, प्रशिक्षण, खरीद ऑर्डर, बाजार और साझेदारी—आप अपनी क्षमता के अनुसार सहयोग कर सकते हैं।</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={RAZORPAY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fb8500] px-5 py-3 text-sm font-extrabold text-[#17212b] hover:bg-[#ffad4d]"><FaHeart /> Donate via Razorpay</a>
            <a href="/Donate" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"><FaUniversity /> Bank / UPI details</a>
            <a href="/FundingPartnerships" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"><FaBuilding /> CSR & all support</a>
            <a href="/Contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"><FaHandshake /> Offer machine / unit</a>
            <button type="button" onClick={sharePage} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffb347]/60 px-5 py-3 text-sm font-bold text-[#ffcf83] hover:bg-white/10"><FaShareAlt /> Share this page</button>
          </div>
        </div>
        <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-6 text-white/50">All support is subject to need, due diligence, documentation, applicable law and the Foundation’s registered objectives. CSR, donations, loans, commercial orders and in-kind contributions are different forms of support and will be recorded separately. Please verify beneficiary details before payment.</p>
      </div>
    </section>
  );
}
