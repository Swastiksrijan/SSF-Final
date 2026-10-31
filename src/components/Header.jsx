import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserCircle, FaTachometerAlt, FaUserEdit, FaClipboardList, FaDonate, FaSignOutAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import AuthModal from "./AuthModal";
import TopContactBar from "./TopContactBar";
import { useLanguage } from "../context/LanguageContext";
import { API_BASE_URL } from "../config/api";
import { clearSession, readSession } from "../utils/userSession";
import logoImg from "../assets/new-logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(() => readSession());
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fn = e => setUser(e.detail || null);
    window.addEventListener("ssf-auth-changed", fn);
    return () => window.removeEventListener("ssf-auth-changed", fn);
  }, []);

  const closeMenu = () => { setMenuOpen(false); setMobileSubMenu(null); };
  const toggleMobileSubMenu = n => setMobileSubMenu(mobileSubMenu === n ? null : n);
  const openAuth = mode => { setAuthMode(mode); setAuthOpen(true); setAccountOpen(false); };
  const openGetInvolvedForm = form => {
    sessionStorage.setItem("ssf_getinvolved_form", form);
    window.dispatchEvent(new CustomEvent("ssf-getinvolved-form", { detail: form }));
  };
  const logout = () => {
    clearSession();
    setUser(null);
    setAccountOpen(false);
  };
  if (location.pathname === "/admin") return null;

  const isActive = path => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const profilePhoto = user?.profilePhotoPath
    ? (/^(?:https?:\/\/|data:image\/)/i.test(user.profilePhotoPath) ? user.profilePhotoPath : `${API_BASE_URL}${user.profilePhotoPath.startsWith("/") ? "" : "/"}${user.profilePhotoPath}`)
    : null;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/About", subItems: [{ name: "Mission & Vision", path: "/Mission" }, { name: "Our Objectives", path: "/Objectives" }, { name: "Meet Our Team", path: "/Team" }, { name: "Upcoming Projects", path: "/UpcomingProjects" }] },
    { name: "Our Work", path: "/OurInitiatives", subItems: [{ name: "Our Initiatives & Impact", path: "/OurInitiatives" }, { name: "Awareness Quiz & Certificate", path: "/AwarenessQuiz" }, { name: "SSF Digital HelpCentre", path: "/HelpCentre" }, { name: "Education & Child Development", path: "/OurInitiatives#education" }, { name: "Health & Well-being", path: "/OurInitiatives#health" }, { name: "Women Empowerment & Livelihood", path: "/OurInitiatives#women" }, { name: "Social Awareness", path: "/OurInitiatives#awareness" }] },
    { name: "Sustainable Development", path: "/SustainableDevelopment", subItems: [{ name: "Development Model", path: "/SustainableDevelopment" }, { name: "All Business & Livelihood Options", path: "/SocialEnterprises" }, { name: "Agriculture & Food Processing", path: "/SocialEnterprises#agriculture" }, { name: "Paper & Packaging", path: "/SocialEnterprises#paper-packaging" }, { name: "Garments & Footwear", path: "/SocialEnterprises#garments-footwear" }, { name: "Trading & Supply", path: "/SocialEnterprises#trading-supply" }, { name: "Digital & Professional Services", path: "/SocialEnterprises#digital-services" }, { name: "Manufacturing & Repair", path: "/SocialEnterprises#manufacturing-repair" }, { name: "Green Economy", path: "/SocialEnterprises#green-economy" }, { name: "Phased Roadmap", path: "/SocialEnterprises#roadmap" }, { name: "Impact, Transparency & Reports", path: "/DevelopmentImpact" }] },
    { name: "Funding & Partnerships", path: "/FundingPartnerships" },
    { name: "Impact", path: "/Impact" },
    { name: "Gallery", path: "/Media" }
  ];

  const getInvolvedItems = [
    { name: "Volunteer", path: "/Volunteer" },
    { name: "Membership", path: "/Members" },
    { name: "Internship", path: "/Internship" },
    { name: "Nation-Building Movement", path: "/GetInvolved", form: "movement" },
    { name: "Partnership", path: "/GetInvolved", form: "partner" }
  ];

  const account = user && (
    <div className="absolute right-0 top-12 w-64 bg-white text-[#12345A] rounded-2xl shadow-2xl border border-[#EAF0F6] p-2 z-[80]">
      <div className="px-3 py-3 border-b border-[#EAF0F6] mb-1 flex items-center gap-3">{profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" /> : <FaUserCircle className="text-3xl text-[#26343D]" />}<div className="min-w-0"><p className="font-black truncate">{user.fullName || "Member"}</p><p className="text-xs text-[#26343D] truncate">{user.email}</p></div></div>
      <Link to="/UserPortal" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF0F6] font-semibold"><FaTachometerAlt /> My SSF Dashboard</Link>
      <a href="/UserPortal#profile" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF0F6] font-semibold"><FaUserEdit /> My Profile</a>
      <a href="/UserPortal#applications" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF0F6] font-semibold"><FaClipboardList /> My Applications</a>
      <a href="/UserPortal#contributions" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EAF0F6] font-semibold"><FaDonate /> My Contributions</a>
      <button type="button" onClick={logout} className="w-full flex gap-3 px-3 py-2.5 mt-1 border-t border-[#EAF0F6] rounded-xl hover:bg-[#FCF3F0] text-[#A73800] font-semibold"><FaSignOutAlt /> Logout</button>
    </div>
  );

  return <header className={`fixed top-0 left-0 right-0 z-50 font-sans ${isScrolled ? "ssf-header-scrolled" : "ssf-header-top"}`}>
    <div className="ssf-contact-bar-wrap">
      <TopContactBar lang={lang} onToggleLang={toggleLang} />
    </div>
    <div className={`ssf-nav-shell ${isScrolled ? "is-scrolled" : "is-transparent"}`}>
      <div className="ssf-nav-bg" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-3">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 shrink-0 group">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 p-1.5 shadow-lg ring-1 ring-white/40 group-hover:scale-105 transition-transform">
            <img src={logoImg} alt="Swastik Srijan Foundation" className="h-full w-full object-contain" />
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className={`block font-black text-lg leading-none tracking-tight text-white`}>Swastik Srijan</span>
            <span className={`block font-bold text-[10px] tracking-[0.22em] uppercase mt-1 text-[#F7A814]`}>Foundation Samiti</span>
            <span className={`block text-[9px] tracking-[0.14em] uppercase mt-1 text-[#EAF0F6]/80`}>Service • Dedication • Creation</span>
          </span>
        </Link>

        <nav className={`hidden xl:flex items-center gap-4 lg:gap-5 `}>
          {navItems.map(item => (
            <div key={item.name} className="relative group">
              <Link to={item.path} data-active={isActive(item.path)} className="ssf-nav-link flex items-center gap-1.5 py-2 text-sm">
                {item.name}{item.subItems && <IoIosArrowDown className="text-xs" />}
              </Link>
              {item.subItems && <div className="absolute top-full left-0 w-72 pt-5 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200"><div className="ssf-nav-dropdown rounded-2xl p-2">{item.subItems.map(sub => <Link key={sub.name} to={sub.path} className="block px-4 py-3 text-sm font-semibold text-[#26343D] hover:text-[#12345A] hover:bg-[#EAF0F6] rounded-xl">{sub.name}</Link>)}</div></div>}
            </div>
          ))}
          <div className="relative group">
            <Link to="/GetInvolved" data-active={isActive("/GetInvolved")} className="ssf-nav-link flex items-center gap-1.5 py-2 text-sm">Get Involved <IoIosArrowDown className="text-xs" /></Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-5 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200"><div className="ssf-nav-dropdown rounded-2xl p-2">{getInvolvedItems.map(item => <Link key={item.name} to={item.path} onClick={e => { if (item.form) e.preventDefault(); openGetInvolvedForm(item.form); if (item.form) window.location.assign(item.path); }} className="block px-4 py-3 text-sm font-semibold text-[#26343D] hover:text-[#12345A] hover:bg-[#EAF0F6] rounded-xl">{item.name}</Link>)}</div></div>
          </div>
          <Link to="/Contact" data-active={isActive("/Contact")} className="ssf-nav-link py-2 text-sm">Contact</Link>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">

          {user ? <div className="relative hidden lg:block"><button onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-haspopup="menu" className="group flex items-center gap-2.5 px-3 py-2 rounded-full border border-white/25 bg-white/10 text-white font-extrabold text-[13px] tracking-[0.02em] hover:border-[#F7A814]/70 hover:bg-white/15 transition-all duration-200"><span className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center shrink-0 ring-1 ring-white/30">{profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : <FaUserCircle className="text-2xl text-white/80" />}</span><span className="max-w-28 truncate">{user.fullName || user.email}</span><IoIosArrowDown className={`transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`} /></button>{accountOpen && account}</div> : <button onClick={() => openAuth("signup")} className="ssf-nav-join hidden lg:inline-flex items-center justify-center px-5 py-2.5 rounded-full border font-extrabold text-[13px] tracking-[0.03em] transition-all duration-200">Join SSF</button>}

          <Link to="/Donate" className="ssf-nav-donate inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[13px] tracking-[0.03em] whitespace-nowrap transition-transform hover:-translate-y-0.5"><FaHeart className="text-[12px]" /> Donate Now</Link>

          <button aria-label={menuOpen ? "Close menu" : "Open menu"} className={`xl:hidden text-2xl p-2 rounded-xl text-white hover:bg-white/10`} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <HiX /> : <HiOutlineMenu />}</button>
        </div>
      </div>
    </div>

    {menuOpen && <div className="xl:hidden fixed inset-0 top-[114px] bg-white z-40 overflow-y-auto pb-20"><nav className="p-5 sm:p-6">
      <div className="mb-5 rounded-2xl bg-[#12345A] text-white p-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#F7A814] font-black mb-3">Official Contact</p>
        <div className="space-y-2.5 text-sm"><a href="https://wa.me/919718346691" target="_blank" rel="noreferrer" className="flex items-center gap-3"><FaPhoneAlt className="text-[#F7A814]" /> +91 97183 46691</a><a href="mailto:info@swastiksrijan.in" className="flex items-center gap-3"><FaEnvelope className="text-[#F7A814]" /> info@swastiksrijan.in</a><div className="flex items-center gap-3 text-[#EAF0F6]"><FaMapMarkerAlt className="text-[#F7A814]" /> Rewa, Madhya Pradesh, India</div></div>
        <button onClick={toggleLang} className="mt-4 px-3 py-1.5 rounded-lg border border-white/15 text-xs font-bold">{lang === "en" ? "हिन्दी" : "English"}</button>
      </div>
      {!user && <div className="mb-5"><button onClick={() => { closeMenu(); openAuth("signup"); }} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#12345A] to-[#176447] text-white font-extrabold tracking-wide">Join SSF</button></div>}
      <Link to="/Donate" onClick={closeMenu} className="mb-5 flex items-center justify-center gap-2 w-full py-4 rounded-2xl ssf-nav-donate font-black tracking-wide"><FaHeart /> Donate Now</Link>
      {user && <><Link to="/UserPortal" onClick={closeMenu} className="block w-full mb-3 py-3.5 rounded-2xl bg-[#12345A] text-white text-center font-extrabold tracking-wide">My SSF Dashboard</Link><button type="button" onClick={() => { closeMenu(); logout(); }} className="block w-full mb-5 py-3.5 rounded-2xl border border-[#F6CEC0] text-[#A73800] font-extrabold tracking-wide">Logout</button></>}
      {navItems.map(item => item.subItems ? <div key={item.name} className="border-b"><div className="flex items-center"><Link to={item.path} onClick={closeMenu} className="flex-1 py-4 text-lg font-bold text-[#12345A]">{item.name}</Link><button type="button" aria-label={`Toggle ${item.name} submenu`} aria-expanded={mobileSubMenu === item.name} onClick={() => toggleMobileSubMenu(item.name)} className="p-4 text-[#12345A]"><IoIosArrowDown className={`transition-transform duration-200 ${mobileSubMenu === item.name ? "rotate-180" : ""}`} /></button></div>{mobileSubMenu === item.name && <div className="pl-4 pb-2 border-l-2 border-[#F7A814]/30">{item.subItems.map(sub => <Link key={sub.name} to={sub.path} onClick={closeMenu} className="block py-3 text-[#26343D]">{sub.name}</Link>)}</div>}</div> : <Link key={item.name} to={item.path} onClick={closeMenu} className="block py-4 border-b text-lg font-bold text-[#12345A]">{item.name}</Link>)}
      <div className="border-b"><div className="flex items-center"><Link to="/GetInvolved" onClick={closeMenu} className="flex-1 py-4 text-lg font-bold text-[#12345A]">Get Involved</Link><button type="button" aria-label="Toggle Get Involved submenu" aria-expanded={mobileSubMenu === "Get Involved"} onClick={() => toggleMobileSubMenu("Get Involved")} className="p-4 text-[#12345A]"><IoIosArrowDown className={`transition-transform duration-200 ${mobileSubMenu === "Get Involved" ? "rotate-180" : ""}`} /></button></div>{mobileSubMenu === "Get Involved" && <div className="pl-4 pb-2 border-l-2 border-[#F7A814]/30">{getInvolvedItems.map(item => <Link key={item.name} to={item.path} onClick={() => { openGetInvolvedForm(item.form); closeMenu(); }} className="block py-3 text-[#26343D]">{item.name}</Link>)}</div>}</div>
      <Link to="/Contact" onClick={closeMenu} className="block py-4 border-b text-lg font-bold text-[#12345A]">Contact</Link>
    </nav></div>}
    <AuthModal open={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} onAuthSuccess={setUser} />
  </header>;
};
export default Header;
