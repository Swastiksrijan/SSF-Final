import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FaBell, FaCertificate, FaFileAlt, FaIdCard, FaSignOutAlt, FaUserCircle, FaHeart, FaHandsHelping, FaGraduationCap, FaBuilding } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

const SESSION_KEY = "ssf_user_session";

export default function UserPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!saved) { navigate({ to: "/" }); return; }
      setUser(saved);
      if (saved.id && ENDPOINTS.MEMBER_STATUS) {
        fetch(ENDPOINTS.MEMBER_STATUS(saved.id))
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data) { const fresh = { ...saved, ...data }; setUser(fresh); localStorage.setItem(SESSION_KEY, JSON.stringify(fresh)); } })
          .catch(() => {});
      }
    } catch { navigate({ to: "/" }); }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("ssf-auth-changed"));
    navigate({ to: "/" });
  };

  const type = String(user?.memberType || "general").toLowerCase();
  const roles = useMemo(() => [
    { title: "Membership", hi: "सदस्यता", icon: FaIdCard, active: Boolean(user?.memberId || type === "general" || type === "member"), detail: user?.memberId ? `Member ID: ${user.memberId}` : "Apply / approval status", href: "/Members" },
    { title: "Volunteer", hi: "स्वयंसेवा", icon: FaHandsHelping, active: type.includes("volunteer"), detail: "Volunteer application, ID & certificate", href: "/Volunteer" },
    { title: "Internship", hi: "इंटर्नशिप", icon: FaGraduationCap, active: type.includes("intern"), detail: "Internship application & documents", href: "/Internship" },
    { title: "Donor", hi: "दाता", icon: FaHeart, active: type.includes("donor"), detail: "Donations, receipts & recognition", href: "/Donate" },
    { title: "Partnership", hi: "भागीदारी", icon: FaBuilding, active: type.includes("partner") || type.includes("csr"), detail: "CSR / institutional collaboration", href: "/GetInvolved#partner" },
  ], [type, user]);

  if (!user) return null;

  return <div className="min-h-screen bg-zinc-50 pt-28 pb-20 px-5 sm:px-8">
    <div className="max-w-7xl mx-auto space-y-7">
      <header className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm p-7 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FF6600]">Swastik Srijan Foundation</p>
          <h1 className="text-3xl md:text-4xl font-black text-[#002344] mt-2">Welcome, {user.fullName}</h1>
          <p className="text-zinc-500 mt-2">Your personal participation, application and document dashboard.</p>
        </div>
        <button onClick={logout} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 font-bold text-[#002344]"><FaSignOutAlt /> Logout</button>
      </header>

      <section className="grid md:grid-cols-3 gap-5">
        <div className="bg-[#002344] text-white rounded-[1.7rem] p-6"><FaUserCircle className="text-3xl mb-4" /><p className="text-xs uppercase tracking-widest opacity-70">Account</p><h2 className="text-xl font-black mt-1">{user.email}</h2><p className="text-sm opacity-70 mt-2">{user.phone || "Phone not added"}</p></div>
        <div className="bg-white rounded-[1.7rem] p-6 border border-zinc-100"><p className="text-xs uppercase tracking-widest text-zinc-400">Account Status</p><h2 className="text-2xl font-black text-[#002344] mt-2 capitalize">{status?.status || user.status || "Active"}</h2><p className="text-sm text-zinc-500 mt-2">Application records remain visible here.</p></div>
        <div className="bg-white rounded-[1.7rem] p-6 border border-zinc-100"><p className="text-xs uppercase tracking-widest text-zinc-400">Official ID</p><h2 className="text-2xl font-black text-[#002344] mt-2">{user.memberId || "Pending"}</h2><p className="text-sm text-zinc-500 mt-2">Issued after the relevant approval.</p></div>
      </section>

      <section className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm p-7 md:p-9">
        <div className="flex items-center gap-3 mb-6"><FaFileAlt className="text-[#FF6600]" /><div><h2 className="text-2xl font-black text-[#002344]">My Activities & Roles</h2><p className="text-sm text-zinc-500">Choose the area you want to join or manage.</p></div></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">{roles.map(({ title, hi, icon: Icon, active, detail, href }) => <a key={title} href={href} className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 ${active ? "border-emerald-200 bg-emerald-50/60" : "border-zinc-100 bg-zinc-50"}`}><Icon className="text-2xl text-[#002344]" /><h3 className="font-black text-[#002344] mt-4">{title}</h3><p className="text-xs text-zinc-500 font-semibold">{hi}</p><p className="text-xs text-zinc-500 mt-3 leading-relaxed">{detail}</p></a>)}</div>
      </section>

      <section className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-[2rem] border border-zinc-100 p-7"><div className="flex items-center gap-3"><FaCertificate className="text-[#FF6600] text-xl" /><h2 className="text-xl font-black text-[#002344]">Certificates & Documents</h2></div><div className="grid sm:grid-cols-2 gap-3 mt-5">{["Membership Certificate", "Member ID Card", "Volunteer Certificate", "Volunteer ID Card", "Donation Receipt", "Donor Appreciation Certificate", "Internship Letter", "Internship Certificate"].map(item => <div key={item} className="p-4 rounded-xl bg-zinc-50 border border-zinc-100"><p className="font-bold text-sm text-[#002344]">{item}</p><p className="text-xs text-zinc-400 mt-1">Issued when applicable</p></div>)}</div></div>
        <div className="bg-white rounded-[2rem] border border-zinc-100 p-7"><div className="flex items-center gap-3"><FaBell className="text-[#FF6600] text-xl" /><h2 className="text-xl font-black text-[#002344]">Notifications & Next Steps</h2></div><div className="mt-5 space-y-3 text-sm text-zinc-600"><p className="p-4 rounded-xl bg-zinc-50">Application updates and approval notifications will appear here.</p><p className="p-4 rounded-xl bg-zinc-50">Official IDs and certificates become available after the required review/approval.</p><p className="p-4 rounded-xl bg-zinc-50">For a new activity, use the relevant role card above.</p></div></div>
      </section>
    </div>
  </div>;
}
