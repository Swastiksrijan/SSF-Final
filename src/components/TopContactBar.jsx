import {
  FaEnvelope, FaPhoneAlt, FaGlobe, FaMapMarkerAlt,
  FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter,
  FaTelegramPlane, FaWhatsapp, FaYoutube, FaHeart,
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
 * Verified contact details and primary actions stay visible.
 * Small screens wrap into compact rows instead of horizontal scrolling.
 */
export default function TopContactBar({ lang, onToggleLang, onJoin }) {
  const tel = CONTACT_INFO.phones.primary.replace(/\s/g, "");

  return (
    <div className="ssf-contact-bar relative z-10 text-white">
      <div className="relative z-10 mx-auto flex max-w-7xl items-center gap-3 flex-wrap justify-center px-3 py-2 lg:flex-nowrap lg:px-4 lg:py-1.5 text-[11px] leading-none lg:text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-2.5 whitespace-nowrap sm:gap-3">
          <a href={`tel:${tel}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-[#F7A814]">
            <FaPhoneAlt className="text-[#F7A814]" />
            <span>{CONTACT_INFO.phones.primaryFormatted}</span>
          </a>
          <span className="text-white/25">|</span>
          <a href={`mailto:${CONTACT_INFO.primaryEmail}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-[#F7A814]">
            <FaEnvelope className="text-[#F7A814]" />
            <span>{CONTACT_INFO.primaryEmail}</span>
          </a>
          <span className="hidden text-white/25 md:inline">|</span>
          <a href="https://swastiksrijan.in" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 transition-colors hover:text-[#F7A814] md:inline-flex">
            <FaGlobe className="text-[#F7A814]" />
            <span>swastiksrijan.in</span>
          </a>
          <span className="hidden text-white/25 lg:inline">|</span>
          <span className="hidden items-center gap-1.5 lg:inline-flex">
            <FaMapMarkerAlt className="text-[#F7A814]" />
            <span>{CONTACT_INFO.address.registered}</span>
          </span>
        </div>

        <div className="order-3 flex w-full items-center justify-center gap-1.5 whitespace-nowrap lg:order-none lg:w-auto lg:gap-2">
          <button type="button" onClick={onJoin} className="ssf-top-action ssf-top-action-join">Join SSF</button>
          <a href="/Members?apply=1" className="ssf-top-action ssf-top-action-member">सदस्यता आवेदन</a>
          <a href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view" target="_blank" rel="noopener noreferrer" className="ssf-top-action ssf-top-action-donate"><FaHeart /> Donate Now</a>
        </div>
        <div className="ml-auto flex items-center gap-2 whitespace-nowrap lg:hidden">
          <button type="button" onClick={onToggleLang} aria-label="Switch language" className="rounded-full border border-white/25 px-2 py-1 text-[9px] font-bold">{lang === "en" ? "हिन्दी" : "English"}</button>
        </div>
        <div className="ml-auto hidden items-center gap-2 whitespace-nowrap pl-2 sm:gap-3 2xl:flex">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                title={label}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white/85 transition-colors hover:bg-white/15 hover:text-[#F7A814]"
              >
                <Icon />
              </a>
            ))}
          </div>
          <span className="text-white/25">|</span>
          <button
            type="button"
            onClick={onToggleLang}
            aria-label="Switch language"
            className="rounded-full border border-white/25 px-2 py-0.5 text-[10px] font-bold transition-colors hover:border-[#F7A814] hover:text-[#F7A814]"
          >
            {lang === "en" ? "हिन्दी" : "English"}
          </button>
        </div>
      </div>
    </div>
  );
}
