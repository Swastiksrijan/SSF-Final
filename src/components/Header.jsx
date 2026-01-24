import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);

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
    { name: "Home", path: "/" },
    {
      name: "About Us",
      path: "/About",
      subItems: [
        { name: "Mission & Vision", path: "/Mission" },
        { name: "Our Objectives", path: "/Objectives" },
        { name: "Meet Our Team", path: "/Team" },
        { name: "Upcoming Projects", path: "/UpcomingProjects" } // ✅ added
      ]
    },
    {
      name: "Impact",
      path: "/Impact"
    },
    {
      name: "Get Involved",
      path: "/GetInvolved"
    },
    { name: "Donate", path: "/Donate", isSpecial: true },
  ];


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <img
            src="/images/home-logo.png"
            alt="SSF Logo"
            className="w-12 rounded-full"
          />
          <span className="font-bold text-xl tracking-tight text-black hidden sm:block">
            Swastik Srijan Foundation
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-base font-bold text-zinc-800">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              <div className="flex items-center gap-1 cursor-pointer">
                <Link
                  to={item.path}
                  activeProps={{ className: "text-[#FF6600]" }}
                  className="hover:text-[#FF6600] transition-colors flex items-center gap-1"
                >
                  {item.name}
                  {item.subItems && <IoIosArrowDown className="text-sm transition-transform group-hover:rotate-180" />}
                </Link>
              </div>

              {/* Desktop Dropdown */}
              {item.subItems && (
                <div className="absolute top-full left-0 w-56 bg-white border border-zinc-100 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                  <div className="py-2">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className="block px-5 py-3 text-sm text-zinc-600 hover:text-[#FF6600] hover:bg-zinc-50 transition-colors"
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
          className="md:hidden text-3xl text-zinc-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-white z-40 overflow-y-auto pb-20 animate-in slide-in-from-right duration-300">
          <nav className="flex flex-col p-6 text-lg font-bold text-zinc-800 divide-y divide-zinc-100">
            {navItems.map((item) => (
              <div key={item.name} className="py-4">
                <div className="flex items-center justify-between">
                  <Link
                    to={item.path}
                    onClick={closeMenu}
                    activeProps={{ className: "text-[#FF6600]" }}
                    className="hover:text-[#FF6600] flex-1 py-1"
                  >
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMobileSubMenu(item.name);
                      }}
                      className="p-2 text-zinc-400"
                    >
                      <IoIosArrowDown className={`transition-transform duration-300 ${mobileSubMenu === item.name ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>

                {/* Mobile Submenu */}
                {item.subItems && mobileSubMenu === item.name && (
                  <div className="mt-2 pl-4 space-y-3 border-l-2 border-zinc-100 animate-in slide-in-from-top-2 duration-200">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        onClick={closeMenu}
                        className="block text-base text-zinc-500 hover:text-[#FF6600] py-1"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
