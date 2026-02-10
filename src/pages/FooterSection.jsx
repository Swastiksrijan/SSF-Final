import { Link } from "@tanstack/react-router";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import logoImg from "../assets/Home-logo.png";


export default function FooterSection() {
  return (
    <footer className="w-full bg-[#002344] text-white pt-24 pb-12 relative overflow-hidden font-sans border-t border-[#003366]">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* TOP: Branding & Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">

          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block group mb-4">
              <img
                src={logoImg}
                alt="Swastik Srijan Foundation"
                className="w-[100px] md:w-[130px] h-auto max-h-[34px] md:max-h-[42px] object-contain opacity-70 group-hover:opacity-100 transition-all transition-opacity duration-300"
              />
            </Link>
            <p className="text-zinc-400 leading-relaxed font-medium text-sm max-w-sm">
              Empowering communities through education, health, and creative development. We are committed to grassroots governance and sustainable impact.
              <span className="block text-xs text-zinc-500 mt-3 font-hindi opacity-70">समुदायों को सशक्त बनाना और यह सुनिश्चित करना कि हर बच्चे की शिक्षा, स्वास्थ्य और रचनात्मक बचपन तक पहुँच हो।</span>
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
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
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-zinc-400 hover:bg-[#fb8500] hover:text-white transition-all duration-300 border border-white/5 hover:border-[#fb8500]"
                >
                  <Item.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">

            {/* Column 1 */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-sm tracking-wider uppercase border-l-2 border-[#fb8500] pl-3">Organization</h4>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><Link to="/About" className="hover:text-[#fb8500] transition-colors">About Us</Link></li>
                <li><Link to="/Team" className="hover:text-[#fb8500] transition-colors">Our Team</Link></li>
                <li><Link to="/Journey" className="hover:text-[#fb8500] transition-colors">Our Journey</Link></li>
                <li><Link to="/Mission" className="hover:text-[#fb8500] transition-colors">Mission & Vision</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-sm tracking-wider uppercase border-l-2 border-[#fb8500] pl-3">Impact</h4>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><Link to="/Impact" className="hover:text-[#fb8500] transition-colors">Impact Stories</Link></li>
                <li><Link to="/CampaignsPage" className="hover:text-[#fb8500] transition-colors">Campaigns</Link></li>
                <li><Link to="/UpcomingProjects" className="hover:text-[#fb8500] transition-colors">Projects</Link></li>
                <li><Link to="/Media" className="hover:text-[#fb8500] transition-colors">Media Gallery</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-sm tracking-wider uppercase border-l-2 border-[#fb8500] pl-3">Involve</h4>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><Link to="/Volunteer" className="hover:text-[#fb8500] transition-colors">Volunteer</Link></li>
                <li><Link to="/Internship" className="hover:text-[#fb8500] transition-colors">Internship</Link></li>
                <li><Link to="/Members" className="hover:text-[#fb8500] transition-colors">Membership</Link></li>
                <li><Link to="/Donate" className="hover:text-[#fb8500] transition-colors">Donate</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact - Improved for visibility */}
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="font-bold text-white text-sm tracking-wider uppercase border-l-2 border-[#fb8500] pl-3">Contact</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li>
                  <a href={`mailto:${CONTACT_INFO.primaryEmail}`} className="group flex items-start gap-3 hover:text-white transition-colors">
                    <span className="mt-0.5 text-[#fb8500]">📧</span>
                    <span className="whitespace-nowrap">{CONTACT_INFO.primaryEmail}</span>
                  </a>
                </li>
                <li>
                  <a href="https://swastiksrijan.in" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 hover:text-white transition-colors">
                    <span className="mt-0.5 text-[#fb8500]">🌐</span>
                    <span className="whitespace-nowrap">swastiksrijan.in</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM: Copyright & Legal */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500 font-medium text-center md:text-left">
            <p>© {new Date().getFullYear()} Swastik Srijan Foundation</p>
            <p className="mt-1">Established 2013 | All rights reserved.</p>
            <div className="flex gap-4 mt-2 justify-center md:justify-start">
              <Link to="/PrivacyPolicy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
              <Link to="/TermsAndConditions" className="hover:text-zinc-300 transition-colors">Terms of Use</Link>
              <Link to="/Transparency" className="hover:text-zinc-300 transition-colors">Transparency</Link>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Registered NGO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
