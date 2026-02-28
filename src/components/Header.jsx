import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import AuthModal from "./AuthModal";
import { useLanguage } from "../context/LanguageContext";

import logoImg from "../assets/Home-logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const t = lang === "en"
    ? {
      home: "Home",
      about: "About Us",
      missionVision: "Mission & Vision",
      objectives: "Our Objectives",
      team: "Meet Our Team",
      projects: "Upcoming Projects",
      impact: "Impact",
      involved: "Get Involved",
      donate: "Donate",
      contact: "Contact Us",
      regOffice: "Reg. Office: Rewa, Madhya Pradesh, India",
      signup: "Signup / Login",
    }
    : {
      home: "होम",
      about: "हमारे बारे में",
      missionVision: "मिशन और विज़न",
      objectives: "हमारे उद्देश्य",
      team: "हमारी टीम",
      projects: "आगामी परियोजनाएँ",
      impact: "प्रभाव",
      involved: "जुड़ें",
      donate: "दान करें",
      contact: "संपर्क करें",
      regOffice: "पंजीकृत कार्यालय: रीवा, मध्य प्रदेश, भारत",
      signup: "साइनअप / लॉगिन",
    };

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileSubMenu(null);
  };

  const toggleMobileSubMenu = (name) => {
    if (mobileSubMenu === name) {
      setMobileSubMenu(null);
    } else {
      setMobileSubMenu(name);
    }
  };

  const navItems = [
    { name: t.home, path: "/" },
    {
      name: t.about,
      path: "/About",
      subItems: [
        { name: t.missionVision, path: "/Mission" },
        { name: t.objectives, path: "/Objectives" },
        { name: t.team, path: "/Team" },
        { name: t.projects, path: "/UpcomingProjects" }
      ]
    },
    {
      name: t.impact,
      path: "/Impact"
    },
    {
      name: t.involved,
      path: "/GetInvolved"
    },
    { name: t.donate, path: "/Donate", isSpecial: true },
  ];


  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-sans">
      {/* TOP BAR */}
      <div className="bg-[#002344] text-white py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-end gap-3 sm:gap-4 text-[11px] sm:text-xs font-semibold text-white/90 whitespace-nowrap overflow-x-auto no-scrollbar">
            <span>{`📞 ${t.contact}:`}</span>
            <a
              href="https://wa.me/919718346691"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6600] transition-colors"
            >
              WhatsApp: +91 9718346691
            </a>
            <span className="text-white/30">|</span>
            <span>{t.regOffice}</span>
            <span className="text-white/30">|</span>
            <a
              href="mailto:info@swastiksrijan.in"
              className="flex items-center gap-2 font-medium hover:text-[#FF6600] transition-colors"
            >
              <span className="opacity-70">📧</span> info@swastiksrijan.in
            </a>
            <span className="text-white/30">|</span>
            <a
              href="https://swastiksrijan.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium hover:text-[#FF6600] transition-colors"
            >
              <span className="opacity-70">🌐</span> swastiksrijan.in
            </a>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={toggleLang}
              className="px-2 py-0.5 rounded border border-white/20 text-[10px] sm:text-xs hover:text-[#FF6600] hover:border-[#FF6600]/50 transition-colors"
            >
              {lang === "en" ? "हिन्दी" : "English"}
            </button>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-2 hover:text-[#FF6600] transition-colors"
            >
              <FaUserCircle /> {t.signup}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <img
              src={logoImg}
              alt="Swastik Srijan Foundation"
              className="w-auto object-contain"
              style={{ height: "60px", maxHeight: "100%" }}
            />
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  activeProps={{ className: "text-[#FF6600]" }}
                  className={`
                    flex items-center gap-1.5 py-2 text-sm font-bold tracking-wide transition-all duration-300
                    ${item.isSpecial ? "bg-[#FF6600] text-white px-6 py-2.5 rounded-full hover:bg-[#E65C00] shadow-md hover:shadow-lg -translate-y-0.5" : "text-[#002344] hover:text-[#FF6600]"}
                  `}
                >
                  {item.name}
                  {item.subItems && (
                    <IoIosArrowDown className="text-xs transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {/* Desktop Dropdown */}
                {item.subItems && (
                  <div className="absolute top-full left-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white border border-zinc-100 shadow-2xl rounded-2xl overflow-hidden p-2">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className="block px-4 py-3 text-[13px] font-semibold text-zinc-600 hover:text-[#FF6600] hover:bg-zinc-50 rounded-xl transition-all"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

          </nav>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-2xl text-[#002344] p-2 hover:bg-zinc-100 rounded-xl transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[116px] bg-white z-40 overflow-y-auto pb-20 animate-in slide-in-from-right duration-500">
          <nav className="flex flex-col p-6 space-y-2">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                setAuthOpen(true);
              }}
              className="w-full mb-2 px-4 py-3 rounded-xl bg-[#002344] text-white font-semibold"
            >
              {t.signup}
            </button>

            {navItems.map((item) => (
              <div key={item.name} className="border-b border-zinc-50 last:border-0">
                <div className="flex items-center justify-between py-4">
                  <Link
                    to={item.path}
                    onClick={closeMenu}
                    activeProps={{ className: "text-[#FF6600]" }}
                    className={`
                      text-lg font-bold flex-1
                      ${item.isSpecial ? "text-[#FF6600]" : "text-[#002344]"}
                    `}
                  >
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMobileSubMenu(item.name);
                      }}
                      className="p-2 bg-zinc-50 rounded-lg text-zinc-400"
                    >
                      <IoIosArrowDown className={`transition-transform duration-300 ${mobileSubMenu === item.name ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>

                {/* Mobile Submenu */}
                {item.subItems && mobileSubMenu === item.name && (
                  <div className="mb-4 pl-4 space-y-1 animate-in slide-in-from-top-2 duration-300 border-l-2 border-[#FF6600]/10">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        onClick={closeMenu}
                        className="block py-3 text-base font-medium text-zinc-500 hover:text-[#FF6600]"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Contact Info */}
            <div className="pt-8 mt-4 border-t border-zinc-100">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">{lang === "en" ? "Contact Us" : "संपर्क"}</p>
              <div className="space-y-4">
                <a href="mailto:info@swastiksrijan.in" className="flex items-center gap-3 text-[#002344] font-semibold">
                  <span className="bg-zinc-100 p-2 rounded-lg">📧</span>
                  info@swastiksrijan.in
                </a>
                <a href="https://swastiksrijan.in" className="flex items-center gap-3 text-[#002344] font-semibold">
                  <span className="bg-zinc-100 p-2 rounded-lg">🌐</span>
                  swastiksrijan.in
                </a>
                <a
                  href="https://wa.me/919718346691"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#002344] font-semibold"
                >
                  <span className="bg-zinc-100 p-2 rounded-lg">💬</span>
                  +91 97183 46691
                </a>
                <div className="flex items-center gap-3 text-[#002344] font-semibold">
                  <span className="bg-zinc-100 p-2 rounded-lg">📍</span>
                  Rewa, Madhya Pradesh, India
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
};

export default Header;
