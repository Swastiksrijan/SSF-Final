import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaUserEdit, FaClipboardList, FaDonate } from "react-icons/fa";
import AuthModal from "./AuthModal";
import { useLanguage } from "../context/LanguageContext";
import logoImg from "../assets/new-logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ssf_user_session");
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem("ssf_user_session");
    }

    const handleAuthChanged = (event) => setUser(event.detail || null);
    window.addEventListener("ssf-auth-changed", handleAuthChanged);
    return () => window.removeEventListener("ssf-auth-changed", handleAuthChanged);
  }, []);

  const closeMenu = () => { setMenuOpen(false); setMobileSubMenu(null); };
  const toggleMobileSubMenu = (name) => setMobileSubMenu(mobileSubMenu === name ? null : name);

  const handleLogout = () => {
    localStorage.removeItem("ssf_user_session");
    setUser(null);
    setAccountOpen(false);
    window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: null }));
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/About", subItems: [
      { name: "Mission & Vision", path: "/Mission" },
      { name: "Our Objectives", path: "/Objectives" },
      { name: "Meet Our Team", path: "/Team" },
      { name: "Upcoming Projects", path: "/UpcomingProjects" }
    ]},
    { name: "Impact", path: "/Impact" },
    { name: "Blog", path: "/Blog" },
    { name: "Donate", path: "/Donate", isSpecial: true },
    { name: "Contact", path: "/Contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-sans">
      <div className="bg-[#002344] text-white py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-end gap-3 sm:gap-4 text-[11px] sm:text-xs font-semibold text-white/90 whitespace-nowrap overflow-x-auto no-scrollbar">
            <span>{lang === "en" ? "📞 Contact Us:" : "📞 संपर्क करें:"}</span>
            <a href="https://wa.me/919718346691" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6600] transition-colors">WhatsApp: +91 9718346691</a>
            <span className="text-white/30">|</span>
            <span>{lang === "en" ? "Reg. Office: Rewa, Madhya Pradesh, India" : "पंजीकृत कार्यालय: रीवा, मध्य प्रदेश, भारत"}</span>
            <span className="text-white/30">|</span>
            <a href="mailto:info@swastiksrijan.in" className="flex items-center gap-2 font-medium hover:text-[#FF6600] transition-colors"><span className="opacity-70">📧</span> info@swastiksrijan.in</a>
            <span className="text-white/30">|</span>
            <a href="https://swastiksrijan.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium hover:text-[#FF6600] transition-colors"><span className="opacity-70">🌐</span> swastiksrijan.in</a>
            <span className="text-white/30">|</span>
            <button type="button" onClick={toggleLang} className="px-2 py-0.5 rounded border border-white/20 text-[10px] sm:text-xs hover:text-[#FF6600] hover:border-[#FF6600]/50 transition-colors">{lang === "en" ? "हिन्दी" : "English"}</button>
            <span className="text-white/30">|</span>
            {user ? (
              <div className="relative flex items-center">
                <button type="button" onClick={() => setAccountOpen(!accountOpen)} className="flex items-center gap-2 hover:text-[#FF6600] transition-colors" aria-expanded={accountOpen}>
                  <FaUserCircle />
                  <span className="max-w-[150px] truncate">{user.fullName || user.email}</span>
                  <IoIosArrowDown className={`transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>
                {accountOpen && <div className="absolute right-0 top-8 w-60 bg-white text-[#002344] rounded-2xl shadow-2xl border border-zinc-100 p-2 z-[80]">
                  <div className="px-3 py-3 border-b border-zinc-100 mb-1"><p className="font-black truncate">{user.fullName || "Member"}</p><p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p></div>
                  <Link to="/MemberDashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaTachometerAlt /> Dashboard</Link>
                  <a href="/MemberDashboard#profile" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaUserEdit /> My Profile</a>
                  <a href="/MemberDashboard#applications" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaClipboardList /> My Applications</a>
                  <a href="/MemberDashboard#contributions" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaDonate /> My Contributions</a>
                  <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 font-semibold"><FaSignOutAlt /> Logout</button>
                </div>}
              </div>
            ) : (
              <button type="button" onClick={() => setAuthOpen(true)} className="flex items-center gap-2 hover:text-[#FF6600] transition-colors"><FaUserCircle /> {lang === "en" ? "Signup / Login" : "साइनअप / लॉगिन"}</button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
            <img src={logoImg} alt="Swastik Srijan Foundation" className="w-auto object-contain" style={{ height: "55px", maxHeight: "100%" }} />
            <div className="flex flex-col"><span className="text-[#002344] font-black text-xl leading-none tracking-tight group-hover:text-[#FF6600] transition-colors">Swastik Srijan</span><span className="text-[#FF6600] font-bold text-[10px] leading-tight tracking-[0.3em] uppercase group-hover:text-[#002344] transition-colors">Foundation</span></div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link to={item.path} activeProps={{ className: "text-[#FF6600]" }} className={`flex items-center gap-1.5 py-2 text-sm font-bold tracking-wide transition-all duration-300 ${item.isSpecial ? "bg-[#FF6600] text-white px-6 py-2.5 rounded-full hover:bg-[#E65C00] shadow-md hover:shadow-lg -translate-y-0.5" : "text-[#002344] hover:text-[#FF6600]"}`}>{item.name}{item.subItems && <IoIosArrowDown className="text-xs transition-transform group-hover:rotate-180" />}</Link>
                {item.subItems && <div className="absolute top-full left-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"><div className="bg-white border border-zinc-100 shadow-2xl rounded-2xl overflow-hidden p-2">{item.subItems.map((sub) => <Link key={sub.name} to={sub.path} className="block px-4 py-3 text-[13px] font-semibold text-zinc-600 hover:text-[#FF6600] hover:bg-zinc-50 rounded-xl transition-all">{sub.name}</Link>)}</div></div>}
              </div>
            ))}
            <Link to="/GetInvolved"><button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-7 py-2.5 rounded-full font-black hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 -translate-y-0.5">🚀 {lang === "en" ? "JOIN US" : "हमसे जुड़ें"}</button></Link>
          </nav>

          <button className="md:hidden text-2xl text-[#002344] p-2 hover:bg-zinc-100 rounded-xl transition-colors" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <HiX /> : <HiOutlineMenu />}</button>
        </div>
      </div>

      {menuOpen && <div className="md:hidden fixed inset-0 top-[116px] bg-white z-40 overflow-y-auto pb-20 animate-in slide-in-from-right duration-500"><nav className="flex flex-col p-6 space-y-2">
        <Link to="/GetInvolved" onClick={closeMenu}><button className="w-full mb-4 px-4 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-lg">🚀 {lang === "en" ? "JOIN US" : "हमसे जुड़ें"}</button></Link>
        {user ? <div className="mb-2 space-y-2"><Link to="/MemberDashboard" onClick={closeMenu} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#002344] text-white font-semibold"><FaTachometerAlt /> Dashboard</Link><a href="/MemberDashboard#profile" onClick={closeMenu} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 text-[#002344] font-semibold"><FaUserEdit /> My Profile</a><a href="/MemberDashboard#applications" onClick={closeMenu} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 text-[#002344] font-semibold"><FaClipboardList /> My Applications</a><a href="/MemberDashboard#contributions" onClick={closeMenu} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 text-[#002344] font-semibold"><FaDonate /> My Contributions</a><button type="button" onClick={() => { handleLogout(); closeMenu(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold"><FaSignOutAlt /> Logout ({user.fullName || user.email})</button></div> : <button type="button" onClick={() => { closeMenu(); setAuthOpen(true); }} className="w-full mb-2 px-4 py-3 rounded-xl bg-[#002344] text-white font-semibold">{lang === "en" ? "Signup / Login" : "साइनअप / लॉगिन"}</button>}
        {navItems.map((item) => <div key={item.name} className="border-b border-zinc-50 last:border-0"><div className="flex items-center justify-between py-4"><Link to={item.path} onClick={closeMenu} activeProps={{ className: "text-[#FF6600]" }} className={`text-lg font-bold flex-1 ${item.isSpecial ? "text-[#FF6600]" : "text-[#002344]"}`}>{item.name}</Link>{item.subItems && <button onClick={(e) => { e.preventDefault(); toggleMobileSubMenu(item.name); }} className="p-2 bg-zinc-50 rounded-lg text-zinc-400"><IoIosArrowDown className={`transition-transform duration-300 ${mobileSubMenu === item.name ? "rotate-180" : ""}`} /></button>}</div>{item.subItems && mobileSubMenu === item.name && <div className="mb-4 pl-4 space-y-1 animate-in slide-in-from-top-2 duration-300 border-l-2 border-[#FF6600]/10">{item.subItems.map((sub) => <Link key={sub.name} to={sub.path} onClick={closeMenu} className="block py-3 text-base font-medium text-zinc-500 hover:text-[#FF6600]">{sub.name}</Link>)}</div>}</div>)}
        <div className="pt-8 mt-4 border-t border-zinc-100"><p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">{lang === "en" ? "Contact Us" : "संपर्क"}</p><div className="space-y-4"><a href="mailto:info@swastiksrijan.in" className="flex items-center gap-3 text-[#002344] font-semibold"><span className="bg-zinc-100 p-2 rounded-lg">📧</span>info@swastiksrijan.in</a><a href="https://swastiksrijan.in" className="flex items-center gap-3 text-[#002344] font-semibold"><span className="bg-zinc-100 p-2 rounded-lg">🌐</span>swastiksrijan.in</a><a href="https://wa.me/919718346691" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#002344] font-semibold"><span className="bg-zinc-100 p-2 rounded-lg">💬</span>+91 97183 46691</a><div className="flex items-center gap-3 text-[#002344] font-semibold"><span className="bg-zinc-100 p-2 rounded-lg">📍</span>Rewa, Madhya Pradesh, India</div></div></div>
      </nav></div>}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthSuccess={setUser} />
    </header>
  );
};

export default Header;
