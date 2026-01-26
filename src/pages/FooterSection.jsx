import { Link } from "@tanstack/react-router";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";

export default function FooterSection() {
  return (
    <footer className="w-full bg-[#001529] text-white mt-0 pt-32 pb-12 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* TOP: Newsletter & Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block group">
              <div className="text-xl sm:text-3xl font-serif font-bold tracking-tight text-white group-hover:text-[#fb8500] transition-colors leading-tight">
                SWASTIK <span className="text-[#fb8500]">SRIJAN FOUNDATION</span>
              </div>
            </Link>
            <p className="text-zinc-400 leading-relaxed font-medium text-lg">
              Empowering communities and ensuring every child has access to quality education, health, and a creative childhood.
              <span className="block text-sm text-zinc-500 mt-2 font-hindi">समुदायों को सशक्त बनाना और यह सुनिश्चित करना कि हर बच्चे की शिक्षा, स्वास्थ्य और रचनात्मक बचपन तक पहुँच हो।</span>
            </p>

            {/* Socials */}
            <div className="flex flex-wrap gap-3 md:gap-4 pt-4">
              {[
                { icon: FaFacebookF, href: CONTACT_INFO.social.facebook, label: "Facebook" },
                { icon: FaInstagram, href: CONTACT_INFO.social.instagram, label: "Instagram" },
                { icon: FaLinkedinIn, href: CONTACT_INFO.social.linkedin, label: "LinkedIn" },
                { icon: FaTwitter, href: CONTACT_INFO.social.twitter, label: "Twitter" },
                { icon: FaYoutube, href: CONTACT_INFO.social.youtube, label: "YouTube" }
              ].map((Item, i) => (
                <a
                  key={i}
                  href={Item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={Item.label}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-[1rem] bg-white/5 text-white hover:bg-[#fb8500] hover:text-white hover:-translate-y-1 transition-all border border-white/10"
                >
                  <Item.icon className="text-sm md:text-base" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Column 1: About */}
            <div>
              <h4 className="font-serif font-bold text-[#fb8500] uppercase tracking-[0.15em] mb-6 text-xs">About | परिचय</h4>
              <ul className="space-y-3 text-zinc-400 font-medium text-sm">
                <li><Link to="/Media" className="hover:text-white transition-colors">Media Gallery</Link></li>
                <li><Link to="/Contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/Journey" className="hover:text-white transition-colors">Our Journey</Link></li>
                <li><Link to="/Objectives" className="hover:text-white transition-colors">Objectives & Focus Areas</Link></li>
              </ul>
            </div>

            {/* Column 2: Get Involved */}
            <div>
              <h4 className="font-serif font-bold text-[#fb8500] uppercase tracking-[0.15em] mb-6 text-xs">Get Involved | जुड़ें</h4>
              <ul className="space-y-3 text-zinc-400 font-medium text-sm">
                <li><Link to="/Volunteer" className="hover:text-white transition-colors">Volunteer for India</Link></li>
                <li><Link to="/Internship" className="hover:text-white transition-colors">Internship | इंटर्नशिप</Link></li>
                <li><Link to="/Members" className="hover:text-white transition-colors">Become a Member</Link></li>
                <li><Link to="/PartnerWithUs" className="hover:text-white transition-colors">Partner with the Mission</Link></li>
                <li><Link to="/Humanity&Truth" className="hover:text-white transition-colors">Humanity & Truth</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="font-serif font-bold text-[#fb8500] uppercase tracking-[0.15em] mb-6 text-xs">Legal | नीतियां</h4>
              <ul className="space-y-3 text-zinc-400 font-medium text-sm">
                <li><Link to="/RegistrationDetails" className="hover:text-white transition-colors">Registration Details</Link></li>
                <li><Link to="/MemorandumAndRules" className="hover:text-white transition-colors">Memorandum & Rules</Link></li>
                <li><Link to="/PrivacyPolicy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/TermsAndConditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/Transparency" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM: Copyright */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-zinc-500 font-medium italic">
            © {new Date().getFullYear()} Swastik Srijan Foundation. <br className="md:hidden" />
            <span className="hidden md:inline"> | </span>
            A Commitment to Grassroots Governance.
            <span className="block text-xs mt-1 text-zinc-600">ग्रामीण शासन और जमीनी स्तर पर कार्य के प्रति हमारी प्रतिबद्धता।</span>
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center group">
            <span className="flex items-center gap-2 sm:gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
              Registered NGO
            </span>
            <span className="flex items-center gap-2 sm:gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-[#fb8500] shadow-[0_0_10px_rgba(251,133,0,0.3)]"></div>
              Transparency First
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
