import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaArrowRight, FaBell, FaCertificate, FaCheckCircle, FaClipboardList, FaDonate, FaFileAlt, FaHandsHelping, FaIdCard, FaSignOutAlt, FaUserCircle, FaUserEdit, FaCamera } from "react-icons/fa";

const cards = [
  { id: "profile", title: "My Profile", text: "View and update your profile details.", icon: FaUserEdit },
  { id: "applications", title: "My Applications", text: "Track your membership and participation status.", icon: FaClipboardList },
  { id: "contributions", title: "My Contributions", text: "Keep your donation and support records together.", icon: FaDonate },
  { id: "documents", title: "Receipts / Documents", text: "Your certificates and official documents will appear here.", icon: FaFileAlt },
  { id: "notifications", title: "Notifications", text: "Important account and application updates.", icon: FaBell },
];

function StatusBadge({ status }) {
  const value = String(status || "pending").toLowerCase();
  const approved = value === "approved";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${approved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{approved ? <FaCheckCircle /> : <FaBell />}{value.charAt(0).toUpperCase() + value.slice(1)}</span>;
}

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ssf_user_session");
      if (!saved) { navigate({ to: "/" }); return; }
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setPhoto(parsed.profilePhoto || "");
    } catch {
      localStorage.removeItem("ssf_user_session");
      navigate({ to: "/" });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ssf_user_session");
    window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: null }));
    navigate({ to: "/" });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      window.alert("Profile photo must be 2 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const nextPhoto = String(reader.result || "");
      setPhoto(nextPhoto);
      const current = JSON.parse(localStorage.getItem("ssf_user_session") || "{}");
      const updated = { ...current, profilePhoto: nextPhoto };
      localStorage.setItem("ssf_user_session", JSON.stringify(updated));
      setUser(updated);
      window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: updated }));
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  const memberStatus = user.status || "pending";
  const memberType = user.memberType === "website_signup" ? "Website Member" : (user.memberType || "Website Member");
  const joinedDate = user.loggedInAt ? new Date(user.loggedInAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const avatar = photo || "";

  return (
    <main className="min-h-screen bg-[#f6f8f7] pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <section className="rounded-[2rem] bg-[#002344] text-white overflow-hidden shadow-xl">
          <div className="p-6 sm:p-9 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 border-2 border-white/20 overflow-hidden flex items-center justify-center text-4xl">
                  {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : <FaUserCircle />}
                </div>
                <label htmlFor="profile-photo" className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-[#FF6600] text-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#e85b00]" title="Change profile photo">
                  <FaCamera className="text-sm" />
                  <input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
              <div><p className="text-sm text-white/65 font-semibold">Welcome back 👋</p><h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">{user.fullName || "Member"}</h1><p className="text-sm text-white/65 mt-1 break-all">{user.email}</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-3"><StatusBadge status={memberStatus} /><button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#002344] font-bold hover:bg-zinc-100"><FaSignOutAlt /> Logout</button></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/10">
            <div className="p-5 border-r border-white/10"><p className="text-xs text-white/50 uppercase tracking-wider font-bold">Account</p><p className="font-bold mt-1">{memberType}</p></div>
            <div className="p-5 lg:border-r border-white/10"><p className="text-xs text-white/50 uppercase tracking-wider font-bold">Status</p><p className="font-bold mt-1 capitalize">{memberStatus}</p></div>
            <div className="p-5 border-r border-white/10 border-t lg:border-t-0"><p className="text-xs text-white/50 uppercase tracking-wider font-bold">Phone</p><p className="font-bold mt-1">{user.phone || "Not added"}</p></div>
            <div className="p-5 border-t lg:border-t-0"><p className="text-xs text-white/50 uppercase tracking-wider font-bold">Last sign-in</p><p className="font-bold mt-1">{joinedDate}</p></div>
          </div>
        </section>

        <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">{cards.map(({ id, title, text, icon: Icon }) => <a key={id} href={`#${id}`} className="group bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"><div className="w-11 h-11 rounded-xl bg-[#002344]/5 text-[#002344] flex items-center justify-center text-lg group-hover:bg-[#FF6600] group-hover:text-white transition-colors"><Icon /></div><h2 className="font-black text-[#002344] mt-4">{title}</h2><p className="text-xs text-zinc-500 mt-1 leading-relaxed">{text}</p></a>)}</section>

        <section className="mt-8 grid lg:grid-cols-[1.4fr_0.8fr] gap-6"><div className="space-y-6">
          <article id="profile" className="scroll-mt-32 bg-white rounded-3xl border border-zinc-100 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6"><div><p className="text-xs uppercase tracking-widest font-bold text-[#FF6600]">My Account</p><h2 className="text-2xl font-black text-[#002344]">My Profile</h2></div><FaIdCard className="text-2xl text-zinc-300" /></div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 p-5 rounded-2xl bg-zinc-50">
              <div className="relative"><div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white flex items-center justify-center text-6xl text-zinc-300">{avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : <FaUserCircle />}</div><label htmlFor="profile-photo-2" className="absolute right-0 bottom-0 px-3 py-2 rounded-full bg-[#FF6600] text-white cursor-pointer shadow hover:bg-[#e85b00]"><FaCamera /><input id="profile-photo-2" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} /></label></div>
              <div className="text-center sm:text-left"><h3 className="text-xl font-black text-[#002344]">{user.fullName || "Member"}</h3><p className="text-sm text-zinc-500 mt-1">Profile Photo</p><p className="text-xs text-zinc-400 mt-2">JPG, PNG or WebP • Maximum 2 MB</p></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4"><div className="rounded-2xl bg-zinc-50 p-4"><p className="text-xs font-bold text-zinc-400 uppercase">Full Name</p><p className="mt-1 font-bold text-[#002344]">{user.fullName || "—"}</p></div><div className="rounded-2xl bg-zinc-50 p-4"><p className="text-xs font-bold text-zinc-400 uppercase">Email</p><p className="mt-1 font-bold text-[#002344] break-all">{user.email || "—"}</p></div><div className="rounded-2xl bg-zinc-50 p-4"><p className="text-xs font-bold text-zinc-400 uppercase">Phone</p><p className="mt-1 font-bold text-[#002344]">{user.phone || "—"}</p></div><div className="rounded-2xl bg-zinc-50 p-4"><p className="text-xs font-bold text-zinc-400 uppercase">Membership</p><p className="mt-1 font-bold text-[#002344] capitalize">{memberType}</p></div></div>
          </article>

          <article id="applications" className="scroll-mt-32 bg-white rounded-3xl border border-zinc-100 p-6 sm:p-8 shadow-sm"><div className="flex items-center justify-between gap-4 mb-6"><div><p className="text-xs uppercase tracking-widest font-bold text-[#FF6600]">Track progress</p><h2 className="text-2xl font-black text-[#002344]">My Applications</h2></div><FaClipboardList className="text-2xl text-zinc-300" /></div><div className="rounded-2xl border border-zinc-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><p className="font-black text-[#002344]">Website Account</p><p className="text-sm text-zinc-500 mt-1">Your website membership/account status.</p></div><StatusBadge status={memberStatus} /></div><div className="rounded-2xl border border-dashed border-zinc-200 p-5 mt-4"><p className="font-bold text-[#002344]">Want to participate in SSF activities?</p><p className="text-sm text-zinc-500 mt-1">Submit a volunteer or other participation application. Its status can be connected to this portal as your member journey grows.</p><Link to="/GetInvolved" className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-[#002344] text-white font-bold">Get Involved <FaArrowRight /></Link></div></article>
          <article id="contributions" className="scroll-mt-32 bg-white rounded-3xl border border-zinc-100 p-6 sm:p-8 shadow-sm"><div className="flex items-center justify-between gap-4 mb-6"><div><p className="text-xs uppercase tracking-widest font-bold text-[#FF6600]">Support SSF</p><h2 className="text-2xl font-black text-[#002344]">My Contributions</h2></div><FaDonate className="text-2xl text-zinc-300" /></div><div className="rounded-2xl bg-zinc-50 p-6"><p className="font-bold text-[#002344]">No contribution records linked to this account yet.</p><p className="text-sm text-zinc-500 mt-1">When donation tracking is connected to member accounts, receipts and contribution history will appear here.</p><Link to="/Donate" className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-[#FF6600] text-white font-bold">Donate to SSF <FaArrowRight /></Link></div></article>
          <article id="documents" className="scroll-mt-32 bg-white rounded-3xl border border-zinc-100 p-6 sm:p-8 shadow-sm"><div className="flex items-center justify-between gap-4 mb-6"><div><p className="text-xs uppercase tracking-widest font-bold text-[#FF6600]">Official records</p><h2 className="text-2xl font-black text-[#002344]">Receipts / Documents</h2></div><FaCertificate className="text-2xl text-zinc-300" /></div>{user.certId ? <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><p className="font-black text-emerald-800">Certificate available</p><p className="text-sm text-emerald-700 mt-1">Certificate ID: {user.certId}</p><a href={`/verify/${user.certId}`} className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-bold">Verify Certificate <FaArrowRight /></a></div> : <div className="rounded-2xl border border-dashed border-zinc-200 p-6"><p className="font-bold text-[#002344]">No certificate issued yet.</p><p className="text-sm text-zinc-500 mt-1">Approved volunteer/member certificates can be displayed here once issued by SSF.</p></div>}</article>
          <article id="notifications" className="scroll-mt-32 bg-white rounded-3xl border border-zinc-100 p-6 sm:p-8 shadow-sm"><div className="flex items-center justify-between gap-4 mb-6"><div><p className="text-xs uppercase tracking-widest font-bold text-[#FF6600]">Stay informed</p><h2 className="text-2xl font-black text-[#002344]">Notifications</h2></div><FaBell className="text-2xl text-zinc-300" /></div><div className="flex gap-3 rounded-2xl bg-blue-50 p-5"><FaCheckCircle className="text-blue-700 mt-0.5" /><div><p className="font-bold text-blue-900">Account is connected</p><p className="text-sm text-blue-800/70 mt-1">You are signed in to the Swastik Srijan Foundation member area. Future application, certificate and contribution updates can be shown here.</p></div></div></article>
        </div><aside className="space-y-6"><div className="bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm sticky top-32"><div className="flex items-center gap-3"><FaHandsHelping className="text-xl text-[#FF6600]" /><h2 className="font-black text-[#002344]">Get Involved</h2></div><p className="text-sm text-zinc-500 mt-2 leading-relaxed">Use your account as your starting point to participate in SSF's programmes and initiatives.</p><div className="space-y-2 mt-5"><Link to="/GetInvolved" className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 font-bold text-[#002344] hover:bg-zinc-100">Become a Volunteer <FaArrowRight /></Link><Link to="/GetInvolved" className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 font-bold text-[#002344] hover:bg-zinc-100">Become a Member <FaArrowRight /></Link><Link to="/Internship" className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 font-bold text-[#002344] hover:bg-zinc-100">Apply for Internship <FaArrowRight /></Link><Link to="/Donate" className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#FF6600] text-white font-bold hover:bg-[#e85b00]">Donate <FaArrowRight /></Link></div></div></aside></section>
        <div className="mt-8 text-center"><Link to="/" className="text-sm font-bold text-[#002344] hover:text-[#FF6600]">← Back to public website</Link></div>
      </div>
    </main>
  );
}
