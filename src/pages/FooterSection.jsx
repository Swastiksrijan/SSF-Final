import { Link } from "@tanstack/react-router";
import {
  FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaTelegramPlane,
  FaYoutube, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaArrowRight
} from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import logoImg from "../assets/footer-logo-circle-v3.png";

const socialItems = [
  { icon: FaFacebookF, href: CONTACT_INFO.social.facebook, label: "Facebook" },
  { icon: FaInstagram, href: CONTACT_INFO.social.instagram, label: "Instagram" },
  { icon: FaLinkedinIn, href: CONTACT_INFO.social.linkedin, label: "LinkedIn" },
  { icon: FaTwitter, href: CONTACT_INFO.social.twitter, label: "X" },
  { icon: FaTelegramPlane, href: CONTACT_INFO.social.telegram, label: "Telegram" },
  { icon: FaWhatsapp, href: CONTACT_INFO.social.whatsappChannel, label: "WhatsApp Channel" },
  { icon: FaYoutube, href: CONTACT_INFO.social.youtube, label: "YouTube" },
];

const linkClass = "block text-[13px] leading-6 text-white/75 transition-colors hover:text-[#ffb347] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb347]";
const headingClass = "mb-4 border-l-[3px] border-[#fb8500] pl-3 text-xs font-extrabold uppercase tracking-[.14em] text-white";

function FooterLink({ to, children }) {
  return <li><Link to={to} className={linkClass}>{children}</Link></li>;
}

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate w-full overflow-hidden bg-[#002344] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.06]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-7 sm:py-14 lg:px-8">
        <div className="grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-[1.35fr_2.65fr] lg:gap-14">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb347]">
              <img src={logoImg} alt="Swastik Srijan Foundation Samiti logo" className="h-16 w-16 rounded-full bg-white p-1.5 object-contain shadow-lg" />
              <span>
                <span className="block text-lg font-extrabold leading-tight sm:text-xl">Swastik Srijan</span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[.22em] text-[#ffb347]">Foundation Samiti</span>
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/80">
              A registered society working for education, health, skills, livelihoods, awareness and community development through responsible, transparent and inclusive action.
            </p>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
              शिक्षा, स्वास्थ्य, कौशल, आजीविका और सामुदायिक विकास के लिए पारदर्शी एवं समावेशी प्रयास।
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/Donate" className="inline-flex items-center gap-2 rounded-lg bg-[#fb8500] px-4 py-2.5 text-xs font-extrabold text-[#17212b] transition hover:bg-[#ffad4d]">Donate Now <FaArrowRight /></Link>
              <Link to="/FundingPartnerships" className="inline-flex items-center rounded-lg border border-white/25 px-4 py-2.5 text-xs font-bold text-white transition hover:border-[#ffb347] hover:text-[#ffb347]">CSR & Partnerships</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {socialItems.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[.05] text-white/80 transition hover:border-[#fb8500] hover:bg-[#176447] hover:text-white">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 xl:grid-cols-4">
            <nav aria-label="About the Foundation">
              <h3 className={headingClass}>The Foundation</h3>
              <ul className="space-y-2.5">
                <FooterLink to="/About">About SSF</FooterLink>
                <FooterLink to="/Mission">Mission & Vision</FooterLink>
                <FooterLink to="/Objectives">Objectives</FooterLink>
                <FooterLink to="/Team">Our Team</FooterLink>
                <FooterLink to="/Humanity&Truth">Humanity & Truth</FooterLink>
                <FooterLink to="/Journey">Service Journey</FooterLink>
                <FooterLink to="/Transparency">Transparency & Records</FooterLink>
              </ul>
            </nav>

            <nav aria-label="Programs and activities">
              <h3 className={headingClass}>Programs & Work</h3>
              <ul className="space-y-2.5">
                <FooterLink to="/OurInitiatives">Initiatives</FooterLink>
                <FooterLink to="/LearningHub">Learning Hub</FooterLink>
                <FooterLink to="/HelpCentre">Digital Help Centre</FooterLink>
                <FooterLink to="/Impact">Impact & Outcomes</FooterLink>
                <FooterLink to="/Campaigns">Campaigns</FooterLink>
                <FooterLink to="/Media">Media Gallery</FooterLink>
                <FooterLink to="/Blog">Blog & Stories</FooterLink>
                <FooterLink to="/UpcomingProjects">Future Projects</FooterLink>
              </ul>
            </nav>

            <nav aria-label="Sustainable development and livelihoods">
              <h3 className={headingClass}>Sustainable Development</h3>
              <ul className="space-y-2.5">
                <FooterLink to="/SustainableDevelopment">Development Model</FooterLink>
                <FooterLink to="/SocialEnterprises">Social Enterprises & Livelihoods</FooterLink>
                <FooterLink to="/SocialEnterprises#agriculture">Agriculture & Farmer Economy</FooterLink>
                <FooterLink to="/SocialEnterprises#paper-packaging">Paper & Packaging</FooterLink>
                <FooterLink to="/SocialEnterprises#garments-footwear">Garments & Footwear</FooterLink>
                <FooterLink to="/SocialEnterprises#food-processing">Food Processing</FooterLink>
                <FooterLink to="/SocialEnterprises#trading-supply">Trading & Supply</FooterLink>
                <FooterLink to="/SocialEnterprises#digital-services">Digital & Professional Services</FooterLink>
                <FooterLink to="/SocialEnterprises#manufacturing-repair">Manufacturing & Repair</FooterLink>
                <FooterLink to="/SocialEnterprises#green-economy">Green Economy & Recycling</FooterLink>
                <FooterLink to="/SocialEnterprises#roadmap">Phased Roadmap</FooterLink>
                <FooterLink to="/DevelopmentImpact">Impact & Reports</FooterLink>
              </ul>
            </nav>

            <div className="col-span-2 sm:col-span-1">
              <nav aria-label="Funding and participation">
                <h3 className={headingClass}>Funding & Partnerships</h3>
                <ul className="space-y-2.5">
                  <FooterLink to="/FundingPartnerships">Funding & CSR Opportunities</FooterLink>
                  <FooterLink to="/PartnerOutreach">Donor & CSR Outreach Desk</FooterLink>
                </ul>
              </nav>
              <nav aria-label="Get involved" className="mt-8">
                <h3 className={headingClass}>Get Involved</h3>
                <ul className="space-y-2.5">
                  <FooterLink to="/Volunteer">Volunteer</FooterLink>
                  <FooterLink to="/Members">Membership</FooterLink>
                  <FooterLink to="/Internship">Internship</FooterLink>
                  <FooterLink to="/GetInvolved">Join & Participate</FooterLink>
                  <FooterLink to="/Donate">Donate / Support</FooterLink>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div className="grid gap-8 border-b border-white/15 py-9 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <h3 className={headingClass}>Contact the Foundation</h3>
            <div className="grid gap-4 text-sm text-white/80 sm:grid-cols-2">
              <a href={`mailto:${CONTACT_INFO.primaryEmail}`} className="flex min-w-0 items-start gap-3 hover:text-[#ffb347]">
                <FaEnvelope className="mt-1 shrink-0 text-[#ffb347]" /><span className="break-all">{CONTACT_INFO.primaryEmail}</span>
              </a>
              <a href={`tel:${CONTACT_INFO.phones.primary.replace(/\\s/g, "")}`} className="flex items-start gap-3 hover:text-[#ffb347]">
                <FaPhoneAlt className="mt-1 shrink-0 text-[#ffb347]" /><span>{CONTACT_INFO.phones.primaryFormatted}</span>
              </a>
              <a href={CONTACT_INFO.social.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-[#ffb347]">
                <FaWhatsapp className="mt-1 shrink-0 text-[#ffb347]" /><span>WhatsApp Enquiry</span>
              </a>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-[#ffb347]" />
                <span>Registered Office<br />{CONTACT_INFO.address.fullRegistered}</span>
              </div>
            </div>
          </div>
          <div className="md:min-w-48">
            <h3 className={headingClass}>Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <FooterLink to="/Contact">Contact & Enquiry</FooterLink>
              <FooterLink to="/Transparency">Registration & Documents</FooterLink>
              <FooterLink to="/Media">News & Media</FooterLink>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-7">
          <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div>
              <p className="text-sm font-extrabold text-white">© {year} Swastik Srijan Foundation Samiti</p>
              <p className="mt-1 text-xs leading-5 text-white/65">Registered Society · Reg. No. 05/22/03/11448/13 · Established 2013</p>
            </div>
            <span className="self-center rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/75 md:self-auto">Service area: All India</span>
          </div>
          <nav aria-label="Legal policies" className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs font-semibold text-white/70 md:justify-start">
            <Link to="/PrivacyPolicy" className="hover:text-[#ffb347]">Privacy Policy</Link>
            <Link to="/CookiePolicy" className="hover:text-[#ffb347]">Cookie Policy</Link>
            <Link to="/TermsAndConditions" className="hover:text-[#ffb347]">Terms of Use</Link>
            <Link to="/Transparency" className="hover:text-[#ffb347]">Transparency</Link>
            <Link to="/DonationRefundPolicy" className="hover:text-[#ffb347]">Donation & Refund</Link>
          </nav>
          <p className="text-center text-[11px] leading-5 text-white/50 md:text-left">Official website of Swastik Srijan Foundation Samiti · Serving communities across India</p>
        </div>
      </div>
    </footer>
  );
}
