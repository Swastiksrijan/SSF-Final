import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserCircle, FaTachometerAlt, FaUserEdit, FaClipboardList, FaDonate, FaSignOutAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import AuthModal from "./AuthModal";
import { useLanguage } from "../context/LanguageContext";
import { API_BASE_URL } from "../config/api";
import logoImg from "../assets/new-logo.png";

const SESSION_KEY = "ssf_user_session";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
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
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setAccountOpen(false);
    window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: null }));
  };
  if (location.pathname === "/SSFDigitalOffice" || location.pathname === "/admin") return null;

  const profilePhoto = user?.profilePhotoPath
    ? (/^(?:https?:\/\/|data:image\/)/i.test(user.profilePhotoPath) ? user.profilePhotoPath : `${API_BASE_URL}${user.profilePhotoPath.startsWith("/") ? "" : "/"}${user.profilePhotoPath}`)
    : null;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/About", subItems: [{ name: "Mission & Vision", path: "/Mission" }, { name: "Our Objectives", path: "/Objectives" }, { name: "Meet Our Team", path: "/Team" }, { name: "Upcoming Projects", path: "/UpcomingProjects" }] },
    { name: "Our Work", path: "/OurInitiatives", subItems: [{ name: "Our Initiatives & Impact", path: "/OurInitiatives" }, { name: "SSF Learning HUB", path: "/LearningHub" }, { name: "Education & Child Development", path: "/LearningHub" }, { name: "Health & Well-being", path: "/OurInitiatives#health" }, { name: "Women Empowerment & Livelihood", path: "/SkillPrograms" }, { name: "Social Awareness", path: "/OurInitiatives#awareness" }] },
    { name: "Impact", path: "/Impact" },
    { name: "Blog & Stories", path: "/Blog" },
    { name: "Donate", path: "/Donate", isSpecial: true }
  ];

  const getInvolvedItems = [
    { name: "Volunteer", path: "/Volunteer" },
    { name: "Membership", path: "/Members" },
    { name: "Internship", path: "/Internship" },
    { name: "Nation-Building Movement", path: "/GetInvolved", form: "movement" },
    { name: "Partnership", path: "/GetInvolved", form: "partner" }
  ];

  const account = user && (
    <div className="absolute right-0 top-12 w-64 bg-white text-[#002344] rounded-2xl shadow-2xl border border-zinc-100 p-2 z-[80]">
      <div className="px-3 py-3 border-b border-zinc-100 mb-1 flex items-center gap-3">{profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" /> : <FaUserCircle className="text-3xl text-zinc-400" />}<div className="min-w-0"><p className="font-black truncate">{user.fullName || "Member"}</p><p className="text-xs text-zinc-500 truncate">{user.email}</p></div></div>
      <Link to="/UserPortal" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaTachometerAlt /> My SSF Dashboard</Link>
      <a href="/UserPortal#profile" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaUserEdit /> My Profile</a>
      <a href="/UserPortal#applications" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaClipboardList /> My Applications</a>
      <a href="/UserPortal#contributions" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaDonate /> My Contributions</a>
      <button type="button" onClick={logout} className="w-full flex gap-3 px-3 py-2.5 mt-1 border-t border-zinc-100 rounded-xl hover:bg-red-50 text-red-600 font-semibold"><FaSignOutAlt /> Logout</button>
    </div>
  );

  return <header className="fixed top-0 left-0 right-0 z-50 font-sans">
    <div className="hidden md:block bg-[#002344] text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-end gap-3 text-[11px] lg:text-xs whitespace-nowrap overflow-x-auto">
        <span>📞 Contact Us:</span><a href="https://wa.me/919718346691" target="_blank" rel="noreferrer" className="hover:text-[#FF6600]">WhatsApp: +91 9718346691</a><span className="text-white/30">|</span><span>Reg. Office: Rewa, Madhya Pradesh</span><span className="text-white/30">|</span><a href="mailto:info@swastiksrijan.in" className="hover:text-[#FF6600]">📧 info@swastiksrijan.in</a><span className="text-white/30">|</span><button onClick={toggleLang} className="px-2 py-0.5 rounded border border-white/20 hover:text-[#FF6600]">{lang === "en" ? "हिन्दी" : "English"}</button>
      </div>
    </div>
    <div className="bg-white border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2"><img src={logoImg} alt="Swastik Srijan Foundation" className="w-auto object-contain" style={{ height: "55px" }} /><div><span className="block text-[#002344] font-black text-xl leading-none">Swastik Srijan</span><span className="text-[#FF6600] font-bold text-[10px] tracking-[0.3em] uppercase">Foundation</span></div></Link>
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {navItems.map(item => <div key={item.name} className="relative group"><Link to={item.path} className={`flex items-center gap-1.5 py-2 text-sm font-bold ${item.isSpecial ? "bg-[#FF6600] text-white px-6 py-2.5 rounded-full" : "text-[#002344] hover:text-[#FF6600]"}`}>{item.name}{item.subItems && <IoIosArrowDown />}</Link>{item.subItems && <div className="absolute top-full left-0 w-72 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible"><div className="bg-white border shadow-2xl rounded-2xl p-2">{item.subItems.map(sub => <Link key={sub.name} to={sub.path} className="block px-4 py-3 text-sm font-semibold text-zinc-600 hover:text-[#FF6600] hover:bg-zinc-50 rounded-xl">{sub.name}</Link>)}</div></div>}</div>)}
          <div className="relative group"><button className="flex items-center gap-1.5 py-2 text-sm font-bold text-[#002344] hover:text-[#FF6600]">Get Involved <IoIosArrowDown /></button><div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible"><div className="bg-white border shadow-2xl rounded-2xl p-2">{getInvolvedItems.map(item => <Link key={item.name} to={item.path} onClick={e => { if (item.form) e.preventDefault(); openGetInvolvedForm(item.form); if (item.form) window.location.assign(item.path); }} className="block px-4 py-3 text-sm font-semibold text-zinc-600 hover:text-[#FF6600] hover:bg-zinc-50 rounded-xl">{item.name}</Link>)}</div></div></div>
          <Link to="/Contact" className="flex items-center gap-1.5 py-2 text-sm font-bold text-[#002344] hover:text-[#FF6600]">Contact</Link>
          {user ? <div className="relative"><button onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-haspopup="menu" className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#002344]/15 bg-white text-[#002344] font-extrabold text-[13px] tracking-[0.02em] shadow-sm hover:border-[#FF6600]/60 hover:shadow-md transition-all duration-200"><span className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">{profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : <FaUserCircle className="text-2xl text-zinc-400" />}</span><span className="max-w-32 truncate">{user.fullName || user.email}</span><IoIosArrowDown className={`transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`} /></button>{accountOpen && account}</div> : <button onClick={() => openAuth("signup")} className="group relative overflow-hidden px-6 py-2.5 rounded-full bg-gradient-to-r from-[#002344] to-[#064b78] text-white font-extrabold text-[13px] tracking-[0.04em] shadow-lg shadow-[#002344]/20 border border-white/10 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"><span className="relative z-10">Join SSF</span><span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#064b78] to-[#0a668f] transition-opacity duration-200" /></button>}
        </nav>
        <button aria-label={menuOpen ? "Close menu" : "Open menu"} className="md:hidden text-2xl text-[#002344] p-2 rounded-xl hover:bg-zinc-100" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <HiX /> : <HiOutlineMenu />}</button>
      </div>
    </div>
    {menuOpen && <div className="md:hidden fixed inset-0 top-20 bg-white z-40 overflow-y-auto pb-20"><nav className="p-5 sm:p-6">
      <div className="mb-5 rounded-2xl bg-[#002344] text-white p-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#FF9A45] font-black mb-3">Official Contact</p>
        <div className="space-y-2.5 text-sm"><a href="https://wa.me/919718346691" target="_blank" rel="noreferrer" className="flex items-center gap-3"><FaPhoneAlt className="text-[#FF6600]" /> +91 97183 46691</a><a href="mailto:info@swastiksrijan.in" className="flex items-center gap-3"><FaEnvelope className="text-[#FF6600]" /> info@swastiksrijan.in</a><div className="flex items-center gap-3 text-zinc-300"><FaMapMarkerAlt className="text-[#FF6600]" /> Rewa, Madhya Pradesh, India</div></div>
        <button onClick={toggleLang} className="mt-4 px-3 py-1.5 rounded-lg border border-white/15 text-xs font-bold">{lang === "en" ? "हिन्दी" : "English"}</button>
      </div>
      {!user && <div className="mb-5"><button onClick={() => { closeMenu(); openAuth("signup"); }} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#002344] to-[#064b78] text-white font-extrabold tracking-wide shadow-lg">Join SSF</button></div>}
      {user && <><Link to="/UserPortal" onClick={closeMenu} className="block w-full mb-3 py-3.5 rounded-2xl bg-[#002344] text-white text-center font-extrabold tracking-wide">My SSF Dashboard</Link><button type="button" onClick={() => { closeMenu(); logout(); }} className="block w-full mb-5 py-3.5 rounded-2xl border border-red-200 text-red-600 font-extrabold tracking-wide">Logout</button></>}
      {navItems.map(item => item.name === "Our Work" ? <div key={item.name} className="border-b"><button onClick={() => toggleMobileSubMenu("Our Work")} className="w-full flex justify-between py-4 text-lg font-bold text-[#002344]">Our Work <IoIosArrowDown className={mobileSubMenu === "Our Work" ? "rotate-180" : ""} /></button>{mobileSubMenu === "Our Work" && <div className="pl-4 pb-2 border-l-2 border-[#FF6600]/20">{item.subItems.map(sub => <Link key={sub.name} to={sub.path} onClick={closeMenu} className="block py-3 text-zinc-600">{sub.name}</Link>)}</div>}</div> : <Link key={item.name} to={item.path} onClick={closeMenu} className={`block py-4 border-b text-lg font-bold text-[#002344] ${item.isSpecial ? "text-[#FF6600]" : ""}`}>{item.name}</Link>)}
      <div className="border-b"><button onClick={() => toggleMobileSubMenu("Get Involved")} className="w-full flex justify-between py-4 text-lg font-bold text-[#002344]">Get Involved <IoIosArrowDown className={mobileSubMenu === "Get Involved" ? "rotate-180" : ""} /></button>{mobileSubMenu === "Get Involved" && <div className="pl-4 pb-2 border-l-2 border-[#FF6600]/20">{getInvolvedItems.map(item => <Link key={item.name} to={item.path} onClick={() => { openGetInvolvedForm(item.form); closeMenu(); }} className="block py-3 text-zinc-600">{item.name}</Link>)}</div>}</div>
      <Link to="/Contact" onClick={closeMenu} className="block py-4 border-b text-lg font-bold text-[#002344]">Contact</Link>
    </nav></div>}
    <AuthModal open={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} onAuthSuccess={setUser} />
  </header>;
};
export default Header;
