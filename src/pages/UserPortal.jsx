import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FaBell, FaCertificate, FaFileAlt, FaIdCard, FaSignOutAlt, FaUserCircle, FaHeart, FaHandsHelping, FaGraduationCap, FaBuilding, FaCheckCircle, FaClock, FaDownload, FaEye, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

const SESSION_KEY = "ssf_user_session";
const badgeClass = (status) => { const value = String(status || "pending").toLowerCase(); if (["approved", "selected", "completed", "paid", "active"].includes(value)) return "bg-emerald-100 text-emerald-700"; if (["rejected", "failed"].includes(value)) return "bg-red-100 text-red-700"; return "bg-amber-100 text-amber-700"; };
const prettyStatus = (status) => String(status || "pending").replace(/_/g, " ");
const docButton = (href, label, Icon = FaDownload) => href ? <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#002344] text-white text-xs font-bold hover:bg-[#FF6600] transition"><Icon />{label}</a> : null;

export default function UserPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [portal, setPortal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
        if (!saved?.id) { navigate({ to: "/" }); return; }
        if (active) setUser(saved);
        const response = await fetch(ENDPOINTS.USER_PORTAL(saved.id));
        if (!response.ok) throw new Error("Unable to load portal");
        const data = await response.json();
        if (!active) return;
        setPortal(data);
        if (data.account) {
          const fresh = { ...saved, ...data.account };
          setUser(fresh); localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
          window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: fresh }));
        }
      } catch (error) { console.error("User portal load error", error); }
      finally { if (active) setLoading(false); }
    };
    load(); return () => { active = false; };
  }, [navigate]);

  const logout = () => { localStorage.removeItem(SESSION_KEY); window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: null })); navigate({ to: "/" }); };
  const volunteers = portal?.activities?.volunteers || [];
  const donors = portal?.activities?.donors || [];
  const internships = portal?.activities?.internships || [];
  const memberApproved = user?.status === "approved" && Boolean(user?.memberId);
  const approvedVolunteer = volunteers.find(v => v.status === "approved");
  const selectedIntern = internships.find(i => ["selected", "completed"].includes(String(i.status).toLowerCase()));
  const stats = { applications: volunteers.length + internships.length + (user?.memberType === "member" ? 1 : 0), roles: [memberApproved, volunteers.length > 0, internships.length > 0, donors.length > 0].filter(Boolean).length, documents: [memberApproved && user?.memberId, memberApproved && user?.certId, approvedVolunteer?.volunteerId, approvedVolunteer?.certId, ...donors.map(d => d.receiptPath || d.receiptUrl)].filter(Boolean).length };

  const roles = useMemo(() => [
    { title: "Volunteer for India", hi: "भारत के लिए स्वयंसेवक", icon: FaHandsHelping, active: volunteers.length > 0, detail: volunteers.length ? `${volunteers.length} application${volunteers.length > 1 ? "s" : ""}` : "Apply to serve on-ground", href: "/Volunteer" },
    { title: "Become a Member", hi: "सदस्य बनें", icon: FaIdCard, active: memberApproved, detail: memberApproved ? `Member ID: ${user.memberId}` : "Membership application", href: "/Members" },
    { title: "Join as an Intern", hi: "इंटर्न के रूप में जुड़ें", icon: FaGraduationCap, active: internships.length > 0, detail: internships.length ? `${internships.length} application${internships.length > 1 ? "s" : ""}` : "Apply for an internship", href: "/Internship" },
    { title: "Nation-Building Movement", hi: "राष्ट्र निर्माण आंदोलन", icon: FaHandsHelping, active: false, detail: "Join our digital community", href: "/GetInvolved#movement" },
    { title: "Become a Donor", hi: "दाता बनें", icon: FaHeart, active: donors.length > 0, detail: donors.length ? `${donors.length} donation record${donors.length > 1 ? "s" : ""}` : "Support our programmes", href: "/Donate" },
    { title: "Partner with the Mission", hi: "मिशन के साथ भागीदार", icon: FaBuilding, active: false, detail: "CSR / institutional collaboration", href: "/GetInvolved#partner" },
  ], [user, memberApproved, volunteers.length, internships.length, donors.length]);

  if (!user) return null;
  return <div className="min-h-screen bg-[#f6f8fa] pt-28 pb-20 px-4 sm:px-6"><div className="max-w-7xl mx-auto space-y-6">
    <header className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div className="flex items-center gap-4"><div className="w-16 h-16 rounded-2xl bg-[#002344] text-white flex items-center justify-center text-3xl overflow-hidden">{user.profilePhotoPath ? <img src={user.profilePhotoPath} alt="Profile" className="w-full h-full object-cover" /> : <FaUserCircle />}</div><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#FF6600]">Swastik Srijan Foundation Samiti</p><h1 className="text-2xl md:text-3xl font-black text-[#002344]">Welcome, {user.fullName}</h1><p className="text-sm text-zinc-500 mt-1">Your secure participation & official documents portal</p></div></div>
      <div className="flex gap-2"><button onClick={() => navigate({to:"/Members"})} className="px-4 py-3 rounded-xl bg-zinc-100 font-bold text-[#002344]">My Profile</button><button onClick={logout} className="px-4 py-3 rounded-xl bg-[#002344] text-white font-bold inline-flex items-center gap-2"><FaSignOutAlt/> Logout</button></div>
    </header>

    <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"><div className="bg-[#002344] text-white rounded-2xl p-5"><p className="text-xs uppercase opacity-60">Account</p><p className="font-black text-lg mt-1 break-all">{user.email}</p><span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/10 text-xs capitalize">{prettyStatus(user.status || "active")}</span></div><div className="bg-white rounded-2xl p-5 border"><p className="text-xs uppercase tracking-widest text-zinc-400">Active Roles</p><p className="text-3xl font-black text-[#002344] mt-2">{stats.roles}</p><p className="text-xs text-zinc-500 mt-1">Your participation areas</p></div><div className="bg-white rounded-2xl p-5 border"><p className="text-xs uppercase tracking-widest text-zinc-400">Applications</p><p className="text-3xl font-black text-[#002344] mt-2">{stats.applications}</p><p className="text-xs text-zinc-500 mt-1">Submitted records</p></div><div className="bg-white rounded-2xl p-5 border"><p className="text-xs uppercase tracking-widest text-zinc-400">Official Documents</p><p className="text-3xl font-black text-[#002344] mt-2">{stats.documents}</p><p className="text-xs text-zinc-500 mt-1">Available to download</p></div></section>

    <section className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><div className="flex items-center justify-between gap-3 mb-6"><div><h2 className="text-2xl font-black text-[#002344]">My Official Identity</h2><p className="text-sm text-zinc-500 mt-1">Only admin-approved identities are shown here.</p></div><FaShieldAlt className="text-[#FF6600] text-2xl"/></div>
      {(!memberApproved && !approvedVolunteer) ? <div className="rounded-2xl bg-zinc-50 border border-dashed p-7 text-center"><FaIdCard className="mx-auto text-3xl text-zinc-300"/><h3 className="font-black text-[#002344] mt-3">No official ID issued yet</h3><p className="text-sm text-zinc-500 mt-1">Apply for a role above. Your official ID card will appear after admin approval.</p></div> : <div className="grid lg:grid-cols-2 gap-5">
        {memberApproved && <OfficialCard type="MEMBERSHIP ID CARD" name={user.fullName} id={user.memberId} certId={user.certId} photo={user.profilePhotoPath} />}
        {approvedVolunteer && <OfficialCard type="VOLUNTEER ID CARD" name={user.fullName} id={approvedVolunteer.volunteerId} certId={approvedVolunteer.certId} photo={user.profilePhotoPath} />}
      </div>}
    </section>

    <section className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><div className="flex items-center gap-3 mb-5"><FaFileAlt className="text-[#FF6600]"/><div><h2 className="text-xl font-black text-[#002344]">My Applications & Roles</h2><p className="text-sm text-zinc-500">Choose any additional role without changing your existing role.</p></div></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{roles.map(({title,hi,icon:Icon,active,detail,href})=><a key={title} href={href} className={`rounded-2xl border p-5 hover:-translate-y-1 transition ${active?"border-emerald-200 bg-emerald-50/50":"bg-zinc-50 border-zinc-100"}`}><div className="flex items-center justify-between"><Icon className="text-2xl text-[#002344]"/>{active&&<FaCheckCircle className="text-emerald-500"/>}</div><h3 className="font-black text-[#002344] mt-4">{title}</h3><p className="text-xs font-bold text-zinc-500">{hi}</p><p className="text-xs text-zinc-500 mt-2">{detail}</p><span className="text-xs font-black text-[#FF6600] inline-flex items-center gap-1 mt-4">Open <FaArrowRight/></span></a>)}</div></section>

    <section className="grid lg:grid-cols-2 gap-6"><div className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><div className="flex items-center gap-3 mb-5"><FaCertificate className="text-[#FF6600]"/><h2 className="text-xl font-black text-[#002344]">My Certificates & Documents</h2></div><div className="space-y-3">
      {memberApproved && <DocumentRow title="Membership ID Card" number={user.memberId} href={user.idCardUrl || user.memberIdCardUrl}/>} {memberApproved && <DocumentRow title="Membership Certificate" number={user.certId} href={user.certificateUrl}/>} {approvedVolunteer && <DocumentRow title="Volunteer ID Card" number={approvedVolunteer.volunteerId} href={approvedVolunteer.idCardUrl}/>} {approvedVolunteer && <DocumentRow title="Volunteer Certificate" number={approvedVolunteer.certId} href={approvedVolunteer.certificateUrl}/>} {donors.map(d=><DocumentRow key={`d-${d.id}`} title="Donation Receipt" number={d.donorId} href={d.receiptUrl || d.receiptPath}/>)} {selectedIntern && <><DocumentRow title="Internship ID Card" number={selectedIntern.internId} href={selectedIntern.idCardUrl}/><DocumentRow title="Internship Joining Letter" number={selectedIntern.joiningLetterId} href={selectedIntern.joiningLetterUrl}/><DocumentRow title="Internship Completion Certificate" number={selectedIntern.completionCertId} href={selectedIntern.completionCertificateUrl}/></>}
      {(!memberApproved && !approvedVolunteer && !donors.length && !selectedIntern) && <p className="text-sm text-zinc-500 bg-zinc-50 rounded-xl p-5">Documents will appear here after approval, payment or completion.</p>}
    </div></div>

    <div className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><div className="flex items-center gap-3 mb-5"><FaBell className="text-[#FF6600]"/><h2 className="text-xl font-black text-[#002344]">Notifications & Status</h2></div><div className="space-y-3 text-sm">{loading&&<p className="p-4 rounded-xl bg-zinc-50">Refreshing your latest records…</p>}{volunteers.map(v=><StatusRow key={`v-${v.id}`} title="Volunteer application" status={v.status} id={v.volunteerId}/>) }{internships.map(i=><StatusRow key={`i-${i.id}`} title={`Internship — ${i.internshipType}`} status={i.status} id={i.internId}/>) }{donors.map(d=><StatusRow key={`d-${d.id}`} title={`Donation — ${d.donationPurpose || "General"}`} status={d.paymentStatus} id={d.donorId}/>) }{memberApproved&&<StatusRow title="Membership" status="approved" id={user.memberId}/>} {!volunteers.length&&!internships.length&&!donors.length&&!memberApproved&&!loading&&<p className="p-4 rounded-xl bg-zinc-50 text-zinc-500">No application activity yet. Choose a role above to get started.</p>}</div></div></section>

    <section className="bg-[#002344] text-white rounded-[2rem] p-6 md:p-8"><div className="flex gap-4"><FaCheckCircle className="text-emerald-300 text-2xl mt-1"/><div><h2 className="font-black text-xl">Official document policy</h2><p className="text-sm text-white/70 mt-2 leading-relaxed">Application → Review → Approval/Selection → Official ID → Certificate / Receipt → Verification. Pending applications never receive an official ID or certificate.</p></div><FaClock className="hidden sm:block ml-auto text-white/30"/></div></section>
  </div></div>;
}

function OfficialCard({type,name,id,certId,photo}) { return <div className="rounded-2xl border-2 border-[#002344] overflow-hidden shadow-lg bg-white"><div className="bg-[#002344] text-white p-4"><p className="text-[10px] tracking-[.25em] font-black">SWASTIK SRIJAN FOUNDATION SAMITI</p><h3 className="font-black mt-1">{type}</h3></div><div className="p-5 flex gap-5 items-center"><div className="w-24 h-28 rounded-xl bg-zinc-100 overflow-hidden flex items-center justify-center text-3xl text-zinc-300">{photo?<img src={photo} alt={name} className="w-full h-full object-cover"/>:<FaUserCircle/>}</div><div className="text-sm"><p className="text-xs text-zinc-400 uppercase">Name</p><p className="font-black text-lg text-[#002344]">{name}</p><p className="text-xs text-zinc-400 uppercase mt-3">Official ID</p><p className="font-black text-[#002344]">{id}</p>{certId&&<p className="text-xs text-zinc-500 mt-2">Certificate: {certId}</p>}</div></div><div className="px-5 pb-5 flex gap-2">{docButton(null,"View ID",FaEye)}{docButton(null,"Download",FaDownload)}</div></div>; }
function DocumentRow({title,number,href}) { return <div className="p-4 rounded-xl border bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="font-bold text-[#002344]">{title}</p><p className="text-xs text-zinc-500 mt-1">{number || "Issued document"}</p></div><div>{href?docButton(href,"Download"):<span className="px-3 py-2 rounded-lg bg-zinc-200 text-zinc-500 text-xs font-bold">Not issued</span>}</div></div>; }
function StatusRow({title,status,id}) { return <div className="p-4 rounded-xl border bg-zinc-50 flex items-center justify-between gap-3"><div><p className="font-bold text-[#002344]">{title}</p>{id&&<p className="text-xs text-zinc-500 mt-1">{id}</p>}</div><span className={`px-3 py-1.5 rounded-full text-xs font-black capitalize ${badgeClass(status)}`}>{prettyStatus(status)}</span></div>; }
