import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FaBell, FaCertificate, FaFileAlt, FaIdCard, FaSignOutAlt, FaUserCircle, FaHeart, FaHandsHelping, FaGraduationCap, FaBuilding, FaCheckCircle, FaClock } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

const SESSION_KEY = "ssf_user_session";
const badgeClass = (status) => { const value = String(status || "pending").toLowerCase(); if (["approved", "selected", "completed", "paid"].includes(value)) return "bg-emerald-100 text-emerald-700"; if (["rejected", "failed"].includes(value)) return "bg-red-100 text-red-700"; return "bg-amber-100 text-amber-700"; };
const prettyStatus = (status) => String(status || "pending").replace(/_/g, " ");

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
          setUser(fresh);
          localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
          window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: fresh }));
        }
      } catch (error) { console.error("User portal load error", error); }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [navigate]);

  const logout = () => { localStorage.removeItem(SESSION_KEY); window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: null })); navigate({ to: "/" }); };
  const volunteers = portal?.activities?.volunteers || [];
  const donors = portal?.activities?.donors || [];
  const internships = portal?.activities?.internships || [];
  const memberApproved = user?.status === "approved" && Boolean(user?.memberId);
  const volunteerApproved = volunteers.some(v => v.status === "approved");
  const internSelected = internships.some(i => i.status === "selected");
  const donorExists = donors.length > 0;

  const roles = useMemo(() => [
    { title: "Membership", hi: "सदस्यता", icon: FaIdCard, active: memberApproved || String(user?.memberType || "").includes("member"), detail: memberApproved ? `Member ID: ${user.memberId}` : "Apply / approval status", href: "/Members" },
    { title: "Volunteer", hi: "स्वयंसेवा", icon: FaHandsHelping, active: volunteers.length > 0, detail: volunteers.length ? `${volunteers.length} application${volunteers.length > 1 ? "s" : ""}` : "No volunteer application yet", href: "/Volunteer" },
    { title: "Internship", hi: "इंटर्नशिप", icon: FaGraduationCap, active: internships.length > 0, detail: internships.length ? `${internships.length} application${internships.length > 1 ? "s" : ""}` : "No internship application yet", href: "/Internship" },
    { title: "Donor", hi: "दाता", icon: FaHeart, active: donorExists, detail: donorExists ? `${donors.length} donation record${donors.length > 1 ? "s" : ""}` : "No donation record yet", href: "/Donate" },
    { title: "Partnership", hi: "भागीदारी", icon: FaBuilding, active: false, detail: "CSR / institutional collaboration", href: "/GetInvolved#partner" },
  ], [user, memberApproved, volunteers.length, internships.length, donors.length, donorExists]);

  if (!user) return null;

  return <div className="min-h-screen bg-zinc-50 pt-28 pb-20 px-5 sm:px-8"><div className="max-w-7xl mx-auto space-y-7">
    <header className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm p-7 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#FF6600]">Swastik Srijan Foundation</p><h1 className="text-3xl md:text-4xl font-black text-[#002344] mt-2">Welcome, {user.fullName}</h1><p className="text-zinc-500 mt-2">Your personal participation, application and official document dashboard.</p></div><button onClick={logout} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 font-bold text-[#002344]"><FaSignOutAlt /> Logout</button></header>

    <section className="grid md:grid-cols-4 gap-5"><div className="bg-[#002344] text-white rounded-[1.7rem] p-6"><FaUserCircle className="text-3xl mb-4" /><p className="text-xs uppercase tracking-widest opacity-70">Account</p><h2 className="text-lg font-black mt-1 break-all">{user.email}</h2><p className="text-sm opacity-70 mt-2">{user.phone || "Phone not added"}</p></div><div className="bg-white rounded-[1.7rem] p-6 border border-zinc-100"><p className="text-xs uppercase tracking-widest text-zinc-400">Account Status</p><h2 className="text-2xl font-black text-[#002344] mt-2 capitalize">{prettyStatus(user.status || "pending")}</h2><p className="text-sm text-zinc-500 mt-2">Website account</p></div><div className="bg-white rounded-[1.7rem] p-6 border border-zinc-100"><p className="text-xs uppercase tracking-widest text-zinc-400">Member ID</p><h2 className="text-xl font-black text-[#002344] mt-2">{user.memberId || "Not issued"}</h2><p className="text-sm text-zinc-500 mt-2">Issued after membership approval</p></div><div className="bg-white rounded-[1.7rem] p-6 border border-zinc-100"><p className="text-xs uppercase tracking-widest text-zinc-400">My Records</p><h2 className="text-2xl font-black text-[#002344] mt-2">{volunteers.length + donors.length + internships.length}</h2><p className="text-sm text-zinc-500 mt-2">Volunteer + donor + internship</p></div></section>

    <section className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm p-7 md:p-9"><div className="flex items-center gap-3 mb-6"><FaFileAlt className="text-[#FF6600]" /><div><h2 className="text-2xl font-black text-[#002344]">My Activities & Roles</h2><p className="text-sm text-zinc-500">Your role records are loaded from the account email.</p></div></div><div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">{roles.map(({ title, hi, icon: Icon, active, detail, href }) => <a key={title} href={href} className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 ${active ? "border-emerald-200 bg-emerald-50/60" : "border-zinc-100 bg-zinc-50"}`}><Icon className="text-2xl text-[#002344]" /><h3 className="font-black text-[#002344] mt-4">{title}</h3><p className="text-xs text-zinc-500 font-semibold">{hi}</p><p className="text-xs text-zinc-500 mt-3 leading-relaxed">{detail}</p></a>)}</div></section>

    <section className="grid lg:grid-cols-3 gap-5"><div className="bg-white rounded-[2rem] border border-zinc-100 p-7 lg:col-span-2"><div className="flex items-center gap-3"><FaCertificate className="text-[#FF6600] text-xl" /><div><h2 className="text-xl font-black text-[#002344]">Official IDs & Documents</h2><p className="text-sm text-zinc-500">Only approved/issued documents are shown as available.</p></div></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
      <div className={`p-4 rounded-xl border ${memberApproved ? "border-emerald-200 bg-emerald-50" : "border-zinc-100 bg-zinc-50"}`}><p className="font-bold text-sm text-[#002344]">Member ID Card</p><p className="text-xs text-zinc-500 mt-1">{user.memberId || "Not issued"}</p></div>
      <div className={`p-4 rounded-xl border ${memberApproved && user.certId ? "border-emerald-200 bg-emerald-50" : "border-zinc-100 bg-zinc-50"}`}><p className="font-bold text-sm text-[#002344]">Membership Certificate</p><p className="text-xs text-zinc-500 mt-1">{user.certId || "Not issued"}</p></div>
      <div className={`p-4 rounded-xl border ${volunteerApproved ? "border-emerald-200 bg-emerald-50" : "border-zinc-100 bg-zinc-50"}`}><p className="font-bold text-sm text-[#002344]">Volunteer ID</p><p className="text-xs text-zinc-500 mt-1">{volunteers.find(v => v.status === "approved")?.volunteerId || "Not issued"}</p></div>
      <div className={`p-4 rounded-xl border ${volunteerApproved ? "border-emerald-200 bg-emerald-50" : "border-zinc-100 bg-zinc-50"}`}><p className="font-bold text-sm text-[#002344]">Volunteer Certificate</p><p className="text-xs text-zinc-500 mt-1">{volunteers.find(v => v.status === "approved")?.certId || "Not issued"}</p></div>
      <div className={`p-4 rounded-xl border ${donorExists ? "border-emerald-200 bg-emerald-50" : "border-zinc-100 bg-zinc-50"}`}><p className="font-bold text-sm text-[#002344]">Donor Record</p><p className="text-xs text-zinc-500 mt-1">{donors[0]?.donorId || "No record"}</p></div>
      <div className={`p-4 rounded-xl border ${internSelected ? "border-emerald-200 bg-emerald-50" : "border-zinc-100 bg-zinc-50"}`}><p className="font-bold text-sm text-[#002344]">Internship Status</p><p className="text-xs text-zinc-500 mt-1">{internships[0]?.status ? prettyStatus(internships[0].status) : "No application"}</p></div>
    </div></div><div className="bg-white rounded-[2rem] border border-zinc-100 p-7"><div className="flex items-center gap-3"><FaBell className="text-[#FF6600] text-xl" /><h2 className="text-xl font-black text-[#002344]">Notifications</h2></div><div className="mt-5 space-y-3 text-sm text-zinc-600"><p className="p-4 rounded-xl bg-zinc-50">{loading ? "Loading your latest records..." : "Your portal has been refreshed with the latest available records."}</p><p className="p-4 rounded-xl bg-zinc-50">Official IDs and certificates are issued only after the required admin approval.</p></div></div></section>

    <section className="grid lg:grid-cols-3 gap-5"><div className="bg-white rounded-[2rem] border border-zinc-100 p-7 lg:col-span-2"><div className="flex items-center gap-3 mb-5"><FaHandsHelping className="text-[#FF6600]" /><h2 className="text-xl font-black text-[#002344]">Volunteer Applications</h2></div>{volunteers.length === 0 ? <p className="text-sm text-zinc-500">No volunteer application found for this account email.</p> : <div className="space-y-3">{volunteers.map(v => <div key={v.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="font-bold text-[#002344]">{v.position || v.volunteerType || "Volunteer"}</p><p className="text-xs text-zinc-500 mt-1">Applied {new Date(v.createdAt).toLocaleDateString()}</p>{v.volunteerId && <p className="text-xs text-zinc-500 mt-1">Volunteer ID: {v.volunteerId}</p>}</div><span className={`px-3 py-1.5 rounded-full text-xs font-black capitalize ${badgeClass(v.status)}`}>{prettyStatus(v.status)}</span></div>)}</div>}</div><div className="bg-white rounded-[2rem] border border-zinc-100 p-7"><div className="flex items-center gap-3 mb-5"><FaHeart className="text-[#FF6600]" /><h2 className="text-xl font-black text-[#002344]">Donations</h2></div>{donors.length === 0 ? <p className="text-sm text-zinc-500">No donation record found for this account email.</p> : <div className="space-y-3">{donors.map(d => <div key={d.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-100"><div className="flex justify-between gap-3"><p className="font-bold text-[#002344]">{d.donorId}</p><span className={`px-2 py-1 rounded-full text-[10px] font-black capitalize ${badgeClass(d.paymentStatus)}`}>{prettyStatus(d.paymentStatus)}</span></div><p className="text-sm text-zinc-600 mt-2">{d.amount ? `₹${Number(d.amount).toLocaleString("en-IN")}` : "Amount not specified"}</p><p className="text-xs text-zinc-400 mt-1">{d.donationPurpose || "General donation"}</p></div>)}</div>}</div></section>

    <section className="bg-white rounded-[2rem] border border-zinc-100 p-7"><div className="flex items-center gap-3 mb-5"><FaGraduationCap className="text-[#FF6600]" /><h2 className="text-xl font-black text-[#002344]">Internship Applications</h2></div>{internships.length === 0 ? <p className="text-sm text-zinc-500">No internship application found for this account email.</p> : <div className="grid md:grid-cols-2 gap-3">{internships.map(i => <div key={i.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between gap-3"><div><p className="font-bold text-[#002344]">{i.internshipType}</p><p className="text-xs text-zinc-500 mt-1">{i.college} · {i.course}</p></div><span className={`px-3 py-1.5 rounded-full text-xs font-black capitalize ${badgeClass(i.status)}`}>{prettyStatus(i.status)}</span></div>)}</div>}</section>

    <section className="bg-[#002344] text-white rounded-[2rem] p-7 md:p-9"><div className="flex items-start gap-4"><FaCheckCircle className="text-emerald-300 text-2xl mt-1" /><div><h2 className="text-xl font-black">Official document lifecycle</h2><p className="text-sm text-white/70 mt-2 leading-relaxed">Application → Admin Review → Approval → Official ID → Certificate / Receipt → Verification. A pending application is never presented as an official approval.</p></div><FaClock className="hidden sm:block text-white/30 text-xl ml-auto" /></div></section>
  </div></div>;
}
