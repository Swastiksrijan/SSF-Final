import {
  FaEnvelope, FaPhoneAlt, FaGlobe,
  FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter,
  FaTelegramPlane, FaWhatsapp, FaYoutube,
  FaHeart, FaUserPlus, FaIdCard,
} from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";

const SOCIALS = [
  { icon: FaFacebookF, href: CONTACT_INFO.social.facebook, label: "Facebook" },
  { icon: FaInstagram, href: CONTACT_INFO.social.instagram, label: "Instagram" },
  { icon: FaLinkedinIn, href: CONTACT_INFO.social.linkedin, label: "LinkedIn" },
  { icon: FaTwitter, href: CONTACT_INFO.social.twitter, label: "X (Twitter)" },
  { icon: FaTelegramPlane, href: CONTACT_INFO.social.telegram, label: "Telegram" },
  { icon: FaWhatsapp, href: CONTACT_INFO.social.whatsappChannel, label: "WhatsApp Channel" },
  { icon: FaYoutube, href: CONTACT_INFO.social.youtube, label: "YouTube" },
];

/**
 * Slim gradient strip that sits above the main navigation header.
 * Contact details sit on the left; the primary actions and the social links
 * form a single group on the right so the buttons and icons read as one
 * cluster. Below `xl` the strip wraps into centred rows.
 */
export default function TopContactBar({ lang, onToggleLang, onJoin }) {
  const tel = CONTACT_INFO.phones.primary.replace(/\s/g, "");

  return (
    <div className="ssf-contact-bar relative z-10 text-white">
      <div className="ssf-contact-inner relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-3 py-2 text-[11px] leading-none lg:text-xs xl:flex-nowrap xl:justify-between xl:px-4 xl:py-2">
        <div className="flex w-full items-center justify-center gap-2.5 whitespace-nowrap sm:gap-3 xl:w-auto xl:justify-start">
          <a href={`tel:${tel}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-[#F7A814]">
            <FaPhoneAlt className="text-[#F7A814]" />
            <span>{CONTACT_INFO.phones.primaryFormatted}</span>
          </a>
          <span className="ssf-contact-email text-white/25">|</span>
          <a href={`mailto:${CONTACT_INFO.primaryEmail}`} className="ssf-contact-email inline-flex items-center gap-1.5 transition-colors hover:text-[#F7A814]">
            <FaEnvelope className="text-[#F7A814]" />
            <span>{CONTACT_INFO.primaryEmail}</span>
          </a>
          <span className="hidden text-white/25 md:inline">|</span>
          <a href="https://swastiksrijan.in" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 transition-colors hover:text-[#F7A814] md:inline-flex">
            <FaGlobe className="text-[#F7A814]" />
            <span>swastiksrijan.in</span>
          </a>
          <button
            type="button"
            onClick={onToggleLang}
            aria-label="Switch language"
            className="ssf-top-action ssf-top-action-lang xl:hidden"
          >
            {lang === "en" ? "हिन्दी" : "English"}
          </button>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-2 xl:w-auto xl:flex-nowrap xl:justify-end xl:gap-2.5">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <button type="button" onClick={onJoin} className="ssf-top-action ssf-top-action-join">
              <FaUserPlus className="ssf-top-action-icon" />
              <span>Join SSF</span>
            </button>
            <a href="/Members?apply=1" className="ssf-top-action ssf-top-action-member">
              <FaIdCard className="ssf-top-action-icon" />
              <span>सदस्यता आवेदन</span>
            </a>
            <a href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view" target="_blank" rel="noopener noreferrer" className="ssf-top-action ssf-top-action-donate">
              <FaHeart className="ssf-top-action-icon" />
              <span>Donate Now</span>
            </a>
          </div>

          <span className="hidden text-white/20 xl:inline">|</span>

          <div className="hidden items-center gap-1.5 xl:flex">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                title={label}
                className="ssf-top-social"
              >
                <Icon />
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleLang}
            aria-label="Switch language"
            className="ssf-top-lang hidden xl:inline-flex"
          >
            {lang === "en" ? "हिन्दी" : "English"}
          </button>
        </div>
      </div>
    </div>
  );
}
