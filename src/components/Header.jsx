import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserCircle, FaTachometerAlt, FaUserEdit, FaClipboardList, FaDonate } from "react-icons/fa";
import AuthModal from "./AuthModal";
import { useLanguage } from "../context/LanguageContext";
import logoImg from "../assets/new-logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
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
    const fn = e => setUser(e.detail || null);
    window.addEventListener("ssf-auth-changed", fn);
    return () => window.removeEventListener("ssf-auth-changed", fn);
  }, []);

  const closeMenu = () => { setMenuOpen(false); setMobileSubMenu(null); };
  const toggleMobileSubMenu = n => setMobileSubMenu(mobileSubMenu === n ? null : n);
  const openAuth = mode => { setAuthMode(mode); setAuthOpen(true); setAccountOpen(false); };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/About", subItems: [{ name: "Mission & Vision", path: "/Mission" }, { name: "Our Objectives", path: "/Objectives" }, { name: "Meet Our Team", path: "/Team" }, { name: "Upcoming Projects", path: "/UpcomingProjects" }] },
    { name: "Impact", path: "/Impact" },
    { name: "Blog", path: "/Blog" },
    { name: "Donate", path: "/Donate", isSpecial: true },
    { name: "Contact", path: "/Contact" }
  ];

  const getInvolvedItems = [
    { name: "Volunteer", path: "/Volunteer" },
    { name: "Membership", path: "/Members" },
    { name: "Internship", path: "/Internship" },
    { name: "Nation-Building Movement", path: "/GetInvolved#movement" },
    { name: "Partnership", path: "/GetInvolved#partner" }
  ];

  const account = user && (
    <div className="absolute right-0 top-8 w-60 bg-white text-[#002344] rounded-2xl shadow-2xl border border-zinc-100 p-2 z-[80]">
      <div className="px-3 py-3 border-b border-zinc-100 mb-1">
        <p className="font-black truncate">{user.fullName || "Member"}</p>
        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
      </div>
      <Link to="/UserPortal" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaTachometerAlt /> My SSF Dashboard</Link>
      <a href="/UserPortal#profile" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaUserEdit /> My Profile</a>
      <a href="/UserPortal#applications" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaClipboardList /> My Applications</a>
      <a href="/UserPortal#contributions" onClick={() => setAccountOpen(false)} className="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-semibold"><FaDonate /> My Contributions</a>
    </div>
  );

  return <header className="fixed top-0 left-0 right-0 z-50 font-sans">
    <div className="bg-[#002344] text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-end gap-3 text-xs whitespace-nowrap overflow-visible">
        <span>📞 Contact Us:</span><a href="https://wa.me/919718346691" target="_blank" rel="noreferrer" className="hover:text-[#FF6600]">WhatsApp: +91 9718346691</a><span>|</span><span>Reg. Office: Rewa, Madhya Pradesh, India</span><span>|</span><a href="mailto:info@swastiksrijan.in" className="hover:text-[#FF6600]">📧 info@swastiksrijan.in</a><span>|</span><button onClick={toggleLang} className="px-2 py-0.5 rounded border border-white/20 hover:text-[#FF6600]">{lang === "en" ? "हिन्दी" : "English"}</button>
      </div>
    </div>
    <div className="bg-white border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2"><img src={logoImg} alt="Swastik Srijan Foundation" className="w-auto object-contain" style={{ height: "55px" }} /><div><span className="block text-[#002344] font-black text-xl leading-none">Swastik Srijan</span><span className="text-[#FF6600] font-bold text-[10px] tracking-[0.3em] uppercase">Foundation</span></div></Link>
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {navItems.map(item => <div key={item.name} className="relative group"><Link to={item.path} className={`flex items-center gap-1.5 py-2 text-sm font-bold ${item.isSpecial ? "bg-[#FF6600] text-white px-6 py-2.5 rounded-full" : "text-[#002344] hover:text-[#FF6600]"}`}>{item.name}{item.subItems && <IoIosArrowDown />}</Link>{item.subItems && <div className="absolute top-full left-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible"><div className="bg-white border shadow-2xl rounded-2xl p-2">{item.subItems.map(sub => <Link key={sub.name} to={sub.path} className="block px-4 py-3 text-sm font-semibold text-zinc-600 hover:text-[#FF6600] hover:bg-zinc-50 rounded-xl">{sub.name}</Link>)}</div></div>}</div>)}
          <div className="relative group"><button className="flex items-center gap-1.5 py-2 text-sm font-bold text-[#002344] hover:text-[#FF6600]">Get Involved <IoIosArrowDown /></button><div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible"><div className="bg-white border shadow-2xl rounded-2xl p-2">{getInvolvedItems.map(item => <Link key={item.name} to={item.path} className="block px-4 py-3 text-sm font-semibold text-zinc-600 hover:text-[#FF6600] hover:bg-zinc-50 rounded-xl">{item.name}</Link>)}</div></div></div>
          {user ? <div className="relative"><button onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-haspopup="menu" className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#002344]/15 bg-zinc-50 text-[#002344] font-bold hover:border-[#FF6600] hover:text-[#FF6600]"><FaUserCircle /> {user.fullName || user.email} <IoIosArrowDown /></button>{accountOpen && account}</div> : <div className="flex items-center gap-2"><button onClick={() => openAuth("signup")} className="px-5 py-2.5 rounded-full bg-[#002344] text-white font-black shadow-sm hover:bg-[#00345f]">Join SSF</button><button onClick={() => openAuth("login")} className="px-5 py-2.5 rounded-full border-2 border-[#002344] text-[#002344] font-black hover:bg-zinc-50">Login</button></div>}
        </nav>
        <button className="md:hidden text-2xl text-[#002344] p-2" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <HiX /> : <HiOutlineMenu />}</button>
      </div>
    </div>
    {menuOpen && <div className="md:hidden fixed inset-0 top-[116px] bg-white z-40 overflow-y-auto pb-20"><nav className="p-6">
      {!user && <div className="grid grid-cols-2 gap-3 mb-5"><button onClick={() => { closeMenu(); openAuth("signup"); }} className="py-3.5 rounded-2xl bg-[#002344] text-white font-black">Join SSF</button><button onClick={() => { closeMenu(); openAuth("login"); }} className="py-3.5 rounded-2xl border-2 border-[#002344] text-[#002344] font-black">Login</button></div>}
      {user && <Link to="/UserPortal" onClick={closeMenu} className="block w-full mb-5 py-3.5 rounded-2xl bg-[#002344] text-white text-center font-black">My SSF Dashboard</Link>}
      <div className="border-b"><button onClick={() => toggleMobileSubMenu("Get Involved")} className="w-full flex justify-between py-4 text-lg font-bold text-[#002344]">Get Involved <IoIosArrowDown /></button>{mobileSubMenu === "Get Involved" && <div className="pl-4 border-l-2 border-[#FF6600]/10">{getInvolvedItems.map(item => <Link key={item.name} to={item.path} onClick={closeMenu} className="block py-3 text-zinc-600">{item.name}</Link>)}</div>}</div>
      {navItems.map(item => <Link key={item.name} to={item.path} onClick={closeMenu} className="block py-4 border-b text-lg font-bold text-[#002344]">{item.name}</Link>)}
    </nav></div>}
    <AuthModal open={authOpen} initialMode={authMode} onClose={() => setAuthOpen(false)} onAuthSuccess={setUser} />
  </header>;
};
export default Header;
