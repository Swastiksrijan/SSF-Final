import { Link } from "@tanstack/react-router";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import logoImg from "../assets/footer-logo-circle-v3.png";
import { useLanguage } from "../context/LanguageContext";
import footerImg1 from "../assets/footer-gallery-1.jpg";
import footerImg2 from "../assets/footer-gallery-2.jpg";
import footerImg3 from "../assets/footer-gallery-3.jpg";
import footerImg4 from "../assets/footer-gallery-4.png";

const socialItems = [
  { icon: FaFacebookF, href: CONTACT_INFO.social.facebook, label: "Facebook" },
  { icon: FaInstagram, href: CONTACT_INFO.social.instagram, label: "Instagram" },
  { icon: FaLinkedinIn, href: CONTACT_INFO.social.linkedin, label: "LinkedIn" },
  { icon: FaTwitter, href: CONTACT_INFO.social.twitter, label: "X / Twitter" },
  { icon: FaYoutube, href: CONTACT_INFO.social.youtube, label: "YouTube" }
];

export default function FooterSection() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#002344] text-white relative overflow-hidden font-sans border-t border-[#123f61]">
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-[#FF6600]/10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">
        <div className="py-14 sm:py-16 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-7">
            <div><p className="text-[#FF9A45] text-xs font-black uppercase tracking-[0.18em]">From our work</p><h3 className="text-2xl sm:text-3xl font-black mt-1">Recent Media</h3><div className="mt-3 h-1 w-12 rounded-full bg-[#FF6600]" /></div>
            <Link to="/Media" className="text-sm font-bold text-zinc-300 hover:text-[#FF6600] transition-colors">View Media Gallery →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[footerImg1, footerImg2, footerImg3, footerImg4].map((img, idx) => (
              <Link key={idx} to="/Media" className="relative h-28 sm:h-36 rounded-2xl overflow-hidden border border-white/10 group bg-black/20">
                <img src={img} alt={`Swastik Srijan Foundation media ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white/90">SSF • Media</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="py-14 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <img src={logoImg} alt="Swastik Srijan Foundation Samiti" className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full bg-white p-1.5 shadow-lg group-hover:scale-105 transition-transform" />
              <div><span className="block text-white font-black text-xl leading-tight">Swastik Srijan</span><span className="text-[#FF6600] font-bold text-[10px] tracking-[0.28em] uppercase">Foundation Samiti</span></div>
            </Link>
            <p className="text-zinc-300 leading-7 text-sm max-w-md">
              {lang === "en" ? "A registered society working to support education, health, skills, livelihoods, awareness and community development through responsible, transparent and inclusive action." : "शिक्षा, स्वास्थ्य, कौशल, आजीविका, जागरूकता और सामुदायिक विकास के लिए जिम्मेदार, पारदर्शी और समावेशी प्रयासों के साथ कार्यरत पंजीकृत संस्था।"}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5 max-w-md">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-[#FF9A45] text-[10px] font-black uppercase">Established</p><p className="text-sm font-bold mt-1">2013</p></div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-[#FF9A45] text-[10px] font-black uppercase">Registered Office</p><p className="text-sm font-bold mt-1">Rewa, MP</p></div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6"><Link to="/Donate" className="px-5 py-2.5 rounded-xl bg-[#FF6600] text-white text-xs font-black hover:bg-[#ff7b26] transition">Donate</Link><Link to="/Volunteer" className="px-5 py-2.5 rounded-xl border border-white/15 text-white text-xs font-black hover:bg-white/10 transition">Volunteer</Link><Link to="/CSRPartnership" className="px-5 py-2.5 rounded-xl border border-white/15 text-white text-xs font-black hover:bg-white/10 transition">Partner</Link></div>
            <div className="flex items-center gap-2.5 mt-6">{socialItems.map(({ icon: Icon, href, label }) => <a key={label} href={href} target="_blank" rel="noreferrer noopener" aria-label={label} title={label} className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-300 hover:text-white hover:bg-[#FF6600] hover:border-[#FF6600] transition-all"><Icon className="text-sm" /></a>)}</div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-x-7 gap-y-10">
            <div><h4 className="font-black text-sm uppercase tracking-wider border-l-2 border-[#FF6600] pl-3 mb-5">Organization</h4><ul className="space-y-3 text-sm text-zinc-400"><li><Link to="/About" className="hover:text-white transition">About Us</Link></li><li><Link to="/Mission" className="hover:text-white transition">Mission & Vision</Link></li><li><Link to="/Objectives" className="hover:text-white transition">Objectives</Link></li><li><Link to="/Team" className="hover:text-white transition">Our Team</Link></li><li><Link to="/UpcomingProjects" className="hover:text-white transition">Upcoming Projects</Link></li></ul></div>
            <div><h4 className="font-black text-sm uppercase tracking-wider border-l-2 border-[#FF6600] pl-3 mb-5">Our Work</h4><ul className="space-y-3 text-sm text-zinc-400"><li><Link to="/OurInitiatives" className="hover:text-white transition">Initiatives</Link></li><li><Link to="/LearningHub" className="hover:text-white transition">Learning HUB</Link></li><li><Link to="/Impact" className="hover:text-white transition">Impact</Link></li><li><Link to="/Campaigns" className="hover:text-white transition">Campaigns</Link></li><li><Link to="/Media" className="hover:text-white transition">Media Gallery</Link></li></ul></div>
            <div><h4 className="font-black text-sm uppercase tracking-wider border-l-2 border-[#FF6600] pl-3 mb-5">Get Involved</h4><ul className="space-y-3 text-sm text-zinc-400"><li><Link to="/Volunteer" className="hover:text-white transition">Volunteer</Link></li><li><Link to="/Members" className="hover:text-white transition">Membership</Link></li><li><Link to="/Internship" className="hover:text-white transition">Internship</Link></li><li><Link to="/GetInvolved#partner" className="hover:text-white transition">Partnership</Link></li><li><Link to="/Donate" className="hover:text-white transition">Donate</Link></li></ul></div>
            <div className="col-span-2 md:col-span-1"><h4 className="font-black text-sm uppercase tracking-wider border-l-2 border-[#FF6600] pl-3 mb-5">Contact</h4><div className="space-y-4 text-sm text-zinc-400"><a href={`mailto:${CONTACT_INFO.primaryEmail}`} className="flex items-start gap-3 hover:text-white transition"><FaEnvelope className="mt-1 text-[#FF6600] shrink-0" /><span className="break-all">{CONTACT_INFO.primaryEmail}</span></a><a href={`tel:${CONTACT_INFO.phones.primary.replace(/\s/g, "")}`} className="flex items-start gap-3 hover:text-white transition"><FaPhoneAlt className="mt-1 text-[#FF6600] shrink-0" /><span>{CONTACT_INFO.phones.primaryFormatted}</span></a><div className="flex items-start gap-3"><FaMapMarkerAlt className="mt-1 text-[#FF6600] shrink-0" /><span>Registered Office<br />Rewa, Madhya Pradesh, India</span></div><Link to="/Contact" className="inline-flex text-[#FF9A45] font-bold hover:text-white transition">Contact & Enquiry →</Link></div></div>
          </div>
        </div>

        <div className="py-8 border-t border-white/10"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"><div className="text-center lg:text-left"><p className="text-sm font-black text-white">© {year} Swastik Srijan Foundation Samiti</p><p className="text-xs text-zinc-400 mt-1">Registered Society • Reg. No. 05/22/03/11448/13 • Established 2013</p></div><div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-zinc-400"><Link to="/PrivacyPolicy" className="hover:text-white transition">Privacy Policy</Link><Link to="/CookiePolicy" className="hover:text-white transition">Cookie Policy</Link><Link to="/TermsAndConditions" className="hover:text-white transition">Terms of Use</Link><Link to="/Transparency" className="hover:text-white transition">Transparency</Link><Link to="/DonationRefundPolicy" className="hover:text-white transition">Donation & Refund</Link></div></div><div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-[11px] text-zinc-500 text-center"><span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]"><FaShieldAlt className="text-[#FF6600]" /> Official website of Swastik Srijan Foundation Samiti</span><span>Service area: India</span></div></div>
      </div>
    </footer>
  );
}
