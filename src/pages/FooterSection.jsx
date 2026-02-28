import { Link } from "@tanstack/react-router";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import logoImg from "../assets/footer-logo-circle-v3.png";
import { useLanguage } from "../context/LanguageContext";


export default function FooterSection() {
  const { lang } = useLanguage();
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
                className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full bg-white p-1.5 group-hover:scale-105 transition-all duration-300 shadow-md"
              />
            </Link>
            <p className="text-zinc-400 leading-relaxed font-medium text-sm max-w-sm">
              {lang === "en"
                ? "Empowering communities through education, health, and creative development. We are committed to grassroots governance and sustainable impact."
                : "शिक्षा, स्वास्थ्य और रचनात्मक विकास के माध्यम से समुदायों को सशक्त बनाना हमारा संकल्प है। हम जमीनी स्तर पर टिकाऊ बदलाव के लिए काम करते हैं।"}
              <span className="block text-xs text-zinc-500 mt-3 font-hindi opacity-70">{lang === "en" ? "समुदायों को सशक्त बनाना और यह सुनिश्चित करना कि हर बच्चे की शिक्षा, स्वास्थ्य और रचनात्मक बचपन तक पहुँच हो।" : "Empowering communities and ensuring that every child has access to education, health and a creative childhood."}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md">
              {[
                ...(lang === "en"
                  ? [
                      "Since 2013: Seva, Satya aur Samarpan",
                      "Every Donation = Direct Grassroots Impact",
                      "CSR + Community = Sustainable Bharat",
                      "Join Us: Volunteer • Donate • Partner",
                    ]
                  : [
                      "2013 से: सेवा, सत्य और समर्पण",
                      "हर दान = जमीनी बदलाव",
                      "CSR + समुदाय = सतत भारत",
                      "जुड़ें: वॉलंटियर • दान • साझेदारी",
                    ])
              ].map((line) => (
                <p key={line} className="text-[11px] text-zinc-300 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  {line}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/Donate"
                className="px-4 py-2 rounded-lg bg-[#fb8500] text-white text-xs font-bold tracking-wide hover:bg-[#ff9800] transition-colors"
              >
                Donate Now
              </Link>
              <Link
                to="/CSRPartnership"
                className="px-4 py-2 rounded-lg border border-white/20 text-white text-xs font-bold tracking-wide hover:bg-white/10 transition-colors"
              >
                CSR Partnership
              </Link>
            </div>

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
                <li><Link to="/Humanity&Truth" className="hover:text-[#fb8500] transition-colors">Humanity & Truth</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <h4 className="font-bold text-white text-sm tracking-wider uppercase border-l-2 border-[#fb8500] pl-3">Impact</h4>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><Link to="/Impact" className="hover:text-[#fb8500] transition-colors">Impact Stories</Link></li>
                <li><Link to="/Campaigns" className="hover:text-[#fb8500] transition-colors">Campaigns</Link></li>
                <li><Link to="/UpcomingProjects" className="hover:text-[#fb8500] transition-colors">Projects</Link></li>
                <li><Link to="/Media" className="hover:text-[#fb8500] transition-colors">Media Gallery</Link></li>
              </ul>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Featured Videos</p>
                <a href="https://youtu.be/uF7rXdsHm0o?si=aIugOn4bzbXtTDMq" target="_blank" rel="noopener noreferrer" className="block text-xs text-zinc-400 hover:text-[#fb8500] transition-colors">YouTube Story Film</a>
                <a href="https://youtube.com/shorts/OqG3OxA8P_Q?si=KBYHwg7mW1sZ7KOI" target="_blank" rel="noopener noreferrer" className="block text-xs text-zinc-400 hover:text-[#fb8500] transition-colors">YouTube Short 01</a>
                <a href="https://youtube.com/shorts/COq-OKNz1ds?si=rpqN-jUVK2EgaHGl" target="_blank" rel="noopener noreferrer" className="block text-xs text-zinc-400 hover:text-[#fb8500] transition-colors">YouTube Short 02</a>
              </div>
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


        <div className="mb-14 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#fb8500] font-bold">{lang === "en" ? "National Call" : "राष्ट्रीय आह्वान"}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                {lang === "en"
                  ? "Bharat Impact Alliance: Citizens + Corporate + Government"
                  : "भारत प्रभाव गठबंधन: नागरिक + कॉर्पोरेट + सरकार"}
              </h3>
            </div>
            <Link
              to="/GetInvolved"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#fb8500] text-white text-sm font-bold hover:bg-[#ff9800] transition-colors"
            >
              {lang === "en" ? "Join The Movement" : "अभियान से जुड़ें"}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: lang === "en" ? "Aam Aadmi" : "आम नागरिक",
                text: lang === "en"
                  ? "Volunteer 2 hours/week, spread awareness, and sponsor one child or one family support kit."
                  : "हर हफ्ते 2 घंटे सेवा दें, जागरूकता फैलाएं और एक बच्चे या एक परिवार सहायता किट का सहयोग करें।",
              },
              {
                title: lang === "en" ? "Corporate & CSR" : "कॉर्पोरेट और CSR",
                text: lang === "en"
                  ? "Co-create measurable projects in education, health, skilling and livelihood with transparent reporting."
                  : "शिक्षा, स्वास्थ्य, कौशल और आजीविका में मापनीय परियोजनाएं पारदर्शी रिपोर्टिंग के साथ मिलकर चलाएं।",
              },
              {
                title: lang === "en" ? "Government & Institutions" : "सरकार और संस्थान",
                text: lang === "en"
                  ? "Partner for last-mile implementation, citizen outreach, and scalable public-impact initiatives."
                  : "लास्ट-माइल क्रियान्वयन, जन-जागरूकता और बड़े स्तर के जन-हित कार्यक्रमों के लिए साझेदारी करें।",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-[#001d39] border border-white/10 p-4">
                <p className="text-white font-bold mb-2">{item.title}</p>
                <p className="text-xs text-zinc-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
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
