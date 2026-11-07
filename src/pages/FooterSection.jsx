import { Link } from "@tanstack/react-router";
import {
  FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaTelegramPlane,
  FaYoutube, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaArrowRight
} from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import logoImg from "../assets/footer-logo-circle-v3.png";
import footerImg1 from "../assets/footer-gallery-1.jpg";
import footerImg2 from "../assets/footer-gallery-2.jpg";
import footerImg3 from "../assets/footer-gallery-3.jpg";

const socialItems = [
  { icon: FaFacebookF, href: CONTACT_INFO.social.facebook, label: "Facebook" },
  { icon: FaInstagram, href: CONTACT_INFO.social.instagram, label: "Instagram" },
  { icon: FaLinkedinIn, href: CONTACT_INFO.social.linkedin, label: "LinkedIn" },
  { icon: FaTwitter, href: CONTACT_INFO.social.twitter, label: "X" },
  { icon: FaTelegramPlane, href: CONTACT_INFO.social.telegram, label: "Telegram" },
  { icon: FaWhatsapp, href: CONTACT_INFO.social.whatsappChannel, label: "WhatsApp Channel" },
  { icon: FaYoutube, href: CONTACT_INFO.social.youtube, label: "YouTube" },
];

const linkClass = "block text-[13px] leading-6 text-white/70 transition-colors hover:translate-x-0.5 hover:text-[#ffc46b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffc46b]";
const headingClass = "mb-4 border-l-2 border-[#f59e0b] pl-3 text-[11px] font-extrabold uppercase tracking-[.16em] text-white";

function FooterLink({ to, children }) {
  return <li><Link to={to} className={linkClass}>{children}</Link></li>;
}

function FooterColumn({ label, children }) {
  return (
    <nav aria-label={label} className="min-w-0">
      <h3 className={headingClass}>{label}</h3>
      <ul className="space-y-2">{children}</ul>
    </nav>
  );
}

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate w-full overflow-hidden bg-[#061f36] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.055]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "26px 26px" }} />

      <div className="relative mx-auto max-w-[1440px] px-5 pt-10 sm:px-7 lg:px-10">
        <section aria-label="Recent community media" className="border-b border-white/10 pb-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#ffc46b]">Stories from the ground</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">Recent Media</h2>
              <p className="mt-1 text-xs text-white/55">Glimpses of our community initiatives and activities</p>
            </div>
            <Link to="/Media" className="inline-flex items-center gap-2 text-xs font-bold text-white/75 transition hover:text-[#ffc46b]">Explore media gallery <FaArrowRight /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {[footerImg1, footerImg2, footerImg3].map((img, idx) => (
              <Link key={idx} to="/Media" aria-label={`Open SSF media gallery, image ${idx + 1}`} className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <img src={img} alt={`Swastik Srijan Foundation community activity ${idx + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06182a]/90 to-transparent px-3 pb-2 pt-8 text-[9px] font-bold uppercase tracking-[.16em] text-white/90">SSF · Community Work</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 border-b border-white/10 py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <Link to="/" className="inline-flex w-fit shrink-0 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffc46b]">
              <img src={logoImg} alt="Swastik Srijan Foundation Samiti logo" className="h-[68px] w-[68px] rounded-full bg-white p-1.5 object-contain shadow-xl" />
              <span>
                <span className="block text-lg font-extrabold leading-tight sm:text-xl">Swastik Srijan Foundation</span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[.22em] text-[#ffc46b]">Samiti · Established 2013</span>
              </span>
            </Link>
            <div className="max-w-2xl sm:border-l sm:border-white/15 sm:pl-5">
              <p className="text-sm leading-6 text-white/75">Working for education, health, skills, livelihoods, awareness and community development through responsible, transparent and inclusive action.</p>
              <p className="mt-1 text-xs leading-5 text-white/55">शिक्षा, स्वास्थ्य, कौशल, आजीविका और सामुदायिक विकास के लिए पारदर्शी एवं समावेशी प्रयास।</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/Donate" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 text-xs font-extrabold text-[#142333] shadow-lg shadow-black/15 transition hover:bg-[#ffc46b]">Support Our Work <FaArrowRight /></Link>
            <Link to="/FundingPartnerships" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-xs font-bold text-white transition hover:border-[#ffc46b] hover:text-[#ffc46b]">CSR & Partnerships</Link>
          </div>
        </section>

        <section aria-label="Website navigation" className="grid grid-cols-2 gap-x-5 gap-y-9 border-b border-white/10 py-10 sm:grid-cols-3 sm:gap-x-7 lg:grid-cols-6 lg:gap-x-6">
          <FooterColumn label="The Foundation">
            <FooterLink to="/About">About SSF</FooterLink>
            <FooterLink to="/Mission">Mission & Vision</FooterLink>
            <FooterLink to="/Objectives">Objectives</FooterLink>
            <FooterLink to="/Team">Our Team</FooterLink>
            <FooterLink to="/Humanity&Truth">Humanity & Truth</FooterLink>
            <FooterLink to="/Journey">Service Journey</FooterLink>
            <FooterLink to="/Transparency">Transparency & Records</FooterLink>
          </FooterColumn>
          <FooterColumn label="Programs & Work">
            <FooterLink to="/OurInitiatives">Initiatives</FooterLink>
            <FooterLink to="/LearningHub">Learning Hub</FooterLink>
            <FooterLink to="/HelpCentre">Digital Help Centre</FooterLink>
            <FooterLink to="/Impact">Impact & Outcomes</FooterLink>
            <FooterLink to="/Campaigns">Campaigns</FooterLink>
            <FooterLink to="/Blog">Blog & Stories</FooterLink>
            <FooterLink to="/UpcomingProjects">Future Projects</FooterLink>
          </FooterColumn>
          <FooterColumn label="Sustainable Development">
            <FooterLink to="/SustainableDevelopment">Development Model</FooterLink>
            <FooterLink to="/SocialEnterprises">Social Enterprises</FooterLink>
            <FooterLink to="/DevelopmentImpact">Impact & Reports</FooterLink>
            <FooterLink to="/UpcomingProjects">Future Livelihood Projects</FooterLink>
          </FooterColumn>
          <FooterColumn label="Funding & Support">
            <FooterLink to="/FundingPartnerships">Funding & CSR</FooterLink>
            <FooterLink to="/Donor">Donor Registration</FooterLink>
            <FooterLink to="/CSRPartnership">Corporate Partnership</FooterLink>
            <FooterLink to="/PartnerOutreach">Outreach Desk</FooterLink>
            <FooterLink to="/Campaigns">Campaigns & Appeals</FooterLink>
            <FooterLink to="/Donate">Donate / Support</FooterLink>
          </FooterColumn>
          <FooterColumn label="Get Involved">
            <FooterLink to="/Volunteer">Volunteer</FooterLink>
            <FooterLink to="/Members">Membership</FooterLink>
            <FooterLink to="/Internship">Internship</FooterLink>
            <FooterLink to="/GetInvolved">Join & Participate</FooterLink>
          </FooterColumn>
          <FooterColumn label="Help & Contact">
            <FooterLink to="/Contact">Contact & Enquiry</FooterLink>
            <FooterLink to="/ComplaintGrievance">Grievance Redressal</FooterLink>
            <FooterLink to="/Media">Media Gallery</FooterLink>
            <FooterLink to="/PrivacyPolicy">Privacy Policy</FooterLink>
            <FooterLink to="/TermsAndConditions">Terms of Use</FooterLink>
            <FooterLink to="/DonationRefundPolicy">Donation & Refund</FooterLink>
          </FooterColumn>
        </section>

        <section aria-label="Contact information" className="grid gap-6 border-b border-white/10 py-8 sm:grid-cols-2 xl:grid-cols-4">
          <div className="min-w-0">
            <p className={headingClass}>Email</p>
            <a href={`mailto:${CONTACT_INFO.primaryEmail}`} className="break-all text-sm text-white/75 transition hover:text-[#ffc46b]"><FaEnvelope className="mr-2 inline text-[#ffc46b]" />{CONTACT_INFO.primaryEmail}</a>
          </div>
          <div>
            <p className={headingClass}>Call Us</p>
            <a href={`tel:${CONTACT_INFO.phones.primary.replace(/\\s/g, "")}`} className="text-sm text-white/75 transition hover:text-[#ffc46b]"><FaPhoneAlt className="mr-2 inline text-[#ffc46b]" />{CONTACT_INFO.phones.primaryFormatted}</a>
          </div>
          <div>
            <p className={headingClass}>WhatsApp</p>
            <a href={CONTACT_INFO.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-white/75 transition hover:text-[#ffc46b]"><FaWhatsapp className="mr-2 inline text-[#ffc46b]" />WhatsApp Enquiry</a>
          </div>
          <div className="min-w-0">
            <p className={headingClass}>Registered Office</p>
            <p className="text-sm leading-6 text-white/70"><FaMapMarkerAlt className="mr-2 inline text-[#ffc46b]" />{CONTACT_INFO.address.fullRegistered}</p>
          </div>
        </section>

        <section className="flex flex-col gap-5 py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-white">© {year} Swastik Srijan Foundation Samiti</p>
              <p className="mt-1 text-[11px] leading-5 text-white/50">Registered Society · Reg. No. 05/22/03/11448/13 · Established 2013 · Service area: All India</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {socialItems.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[.04] text-white/70 transition hover:border-[#f59e0b] hover:bg-white/10 hover:text-[#ffc46b]">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Legal policies" className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-[11px] font-semibold text-white/55">
            <Link to="/PrivacyPolicy" className="hover:text-[#ffc46b]">Privacy Policy</Link>
            <Link to="/CookiePolicy" className="hover:text-[#ffc46b]">Cookie Policy</Link>
            <Link to="/TermsAndConditions" className="hover:text-[#ffc46b]">Terms of Use</Link>
            <Link to="/Transparency" className="hover:text-[#ffc46b]">Transparency</Link>
            <Link to="/DonationRefundPolicy" className="hover:text-[#ffc46b]">Donation & Refund</Link>
          </nav>
          <p className="text-[10px] leading-5 text-white/40">Official website of Swastik Srijan Foundation Samiti · Serving communities across India</p>
        </section>
      </div>
    </footer>
  );
}
