import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FaArrowRight, FaBell, FaBuilding, FaCamera, FaCheckCircle, FaClock, FaEye, FaFileAlt, FaGraduationCap, FaHandsHelping, FaHeart, FaIdCard, FaSignOutAlt, FaShieldAlt, FaTrash, FaUserCircle } from "react-icons/fa";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

const SESSION_KEY = "ssf_user_session";
const statusText = (s) => String(s || "pending").replace(/_/g, " ");
const statusClass = (s) => ["approved", "selected", "completed", "paid", "offline"].includes(String(s || "").toLowerCase()) ? "bg-emerald-100 text-emerald-700" : ["rejected", "failed"].includes(String(s || "").toLowerCase()) ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";
const dateText = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fileUrl = (p) => p ? (/^https?:\/\//i.test(p) ? p : `${API_BASE_URL}${p.startsWith("/") ? "" : "/"}${p}`) : null;

export default function UserPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [portal, setPortal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const fileRef = useRef(null);
  const profileRef = useRef(null);

  const refresh = async (saved) => {
    const r = await fetch(ENDPOINTS.USER_PORTAL(saved.id));
    if (!r.ok) throw new Error("Unable to load your portal");
    const d = await r.json();
    setPortal(d);
    if (d.account) {
      const fresh = { ...saved, ...d.account };
      setUser(fresh);
      localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
      window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: fresh }));
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
        if (!saved?.id) {
          navigate({ to: "/" });
          return;
        }
        setUser(saved);
        await refresh(saved);
      } catch (e) {
        if (alive) setError(e.message || "Unable to load portal");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [navigate]);

  useEffect(() => () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: null }));
    navigate({ to: "/" });
  };

  const choosePhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoMessage("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setPhotoMessage("JPG, PNG or WebP photo only.");
      e.target.value = "";
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setPhotoMessage("Photo must be 2MB or smaller.");
      e.target.value = "";
      return;
    }
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const savePhoto = async () => {
    if (!photoFile || !user?.id) return;
    setPhotoBusy(true);
    setPhotoMessage("");
    try {
      const fd = new FormData();
      fd.append("profilePhoto", photoFile);
      const r = await fetch(ENDPOINTS.MEMBER_PROFILE_PHOTO(user.id), { method: "PATCH", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Unable to upload photo");
      const fresh = { ...user, profilePhotoPath: d.profilePhotoPath };
      setUser(fresh);
      localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
      window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: fresh }));
      setPhotoFile(null);
      setPhotoPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setPhotoMessage("Profile photo updated successfully.");
    } catch (e) {
      setPhotoMessage(e.message || "Unable to upload photo.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = async () => {
    if (!user?.id || !user.profilePhotoPath) return;
    setPhotoBusy(true);
    setPhotoMessage("");
    try {
      const r = await fetch(ENDPOINTS.MEMBER_PROFILE_PHOTO(user.id), { method: "DELETE" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Unable to remove photo");
      const fresh = { ...user, profilePhotoPath: null };
      setUser(fresh);
      localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
      window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: fresh }));
      setPhotoMessage("Profile photo removed.");
    } catch (e) {
      setPhotoMessage(e.message || "Unable to remove photo.");
    } finally {
      setPhotoBusy(false);
    }
  };

  if (!user) return null;

  const volunteers = portal?.activities?.volunteers || [];
  const donors = portal?.activities?.donors || [];
  const internships = portal?.activities?.internships || [];
  const memberApproved = user.status === "approved" && !!user.memberId;
  const approvedVolunteer = volunteers.find(v => v.status === "approved");
  const selectedIntern = internships.find(i => ["selected", "completed"].includes(i.status));
  const photo = fileUrl(user.profilePhotoPath);
  const displayPhoto = photoPreview || photo;
  const docs = [
    memberApproved && user.memberId,
    memberApproved && user.certId,
    approvedVolunteer?.volunteerId,
    approvedVolunteer?.certId,
    ...donors.filter(d => d.receiptUrl).map(d => d.donorId),
    selectedIntern?.internId,
    selectedIntern?.joiningLetterId,
    selectedIntern?.completionCertId
  ].filter(Boolean).length;

  const notifications = [
    ...volunteers.map(v => ({ key: `v-${v.id}`, title: "Volunteer application", status: v.status, date: v.approvedAt || v.createdAt, id: v.volunteerId || "Under review" })),
    ...internships.map(i => ({ key: `i-${i.id}`, title: `Internship — ${i.internshipType}`, status: i.status, date: i.completedAt || i.selectedAt || i.createdAt, id: i.internId || "Under review" })),
    ...donors.map(d => ({ key: `d-${d.id}`, title: `Donation — ${d.donationPurpose || "General"}`, status: d.paymentStatus, date: d.createdAt, id: d.donorId })),
    ...(memberApproved ? [{ key: "m", title: "Membership", status: "approved", date: user.certificateIssuedAt || user.createdAt, id: user.memberId }] : [])
  ];

  const roles = [
    ["Volunteer for India", FaHandsHelping, volunteers.length > 0, "Volunteer application", "/Volunteer"],
    ["Become a Member", FaIdCard, memberApproved || user.memberType !== "general", memberApproved ? `Member ID: ${user.memberId}` : "Membership application", "/Members"],
    ["Join as an Intern", FaGraduationCap, internships.length > 0, "Internship application", "/Internship"],
    ["Nation-Building Movement", FaHandsHelping, false, "Community participation", "/GetInvolved#movement"],
    ["Become a Donor", FaHeart, donors.length > 0, "Support SSF programmes", "/Donate"],
    ["Partner with the Mission", FaBuilding, false, "CSR / institutional collaboration", "/GetInvolved#partner"]
  ];

  return (
    <div className="min-h-screen bg-[#f6f8fa] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4"><Avatar src={photo} size="w-16 h-16"/><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6600]">Swastik Srijan Foundation Samiti</p><h1 className="text-2xl md:text-3xl font-black text-[#002344]">Welcome, {user.fullName}</h1><p className="text-sm text-zinc-500 mt-1">{user.email} · {user.phone || "Mobile not added"}</p></div></div>
          <div className="flex gap-2"><button onClick={() => profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-4 py-3 rounded-xl bg-zinc-100 font-bold text-[#002344]">My Profile</button><button onClick={logout} className="px-4 py-3 rounded-xl bg-[#002344] text-white font-bold inline-flex items-center gap-2"><FaSignOutAlt/> Logout</button></div>
        </header>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 font-semibold">{error}</div>}

        <section ref={profileRef} id="my-profile" className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8 scroll-mt-28">
          <div className="flex flex-col md:flex-row gap-6 md:items-center"><div className="relative"><Avatar src={displayPhoto} size="w-32 h-32"/><button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy} className="absolute -bottom-2 -right-2 w-11 h-11 rounded-full bg-[#ff6600] text-white flex items-center justify-center shadow-lg"><FaCamera/></button></div>
            <div className="flex-1"><p className="text-xs font-black uppercase tracking-[.2em] text-[#ff6600]">My Profile</p><h2 className="text-2xl font-black text-[#002344] mt-1">{user.fullName}</h2><div className="grid sm:grid-cols-2 gap-2 mt-4 text-sm"><p><span className="text-zinc-400">Email:</span> <strong>{user.email}</strong></p><p><span className="text-zinc-400">Phone:</span> <strong>{user.phone || "Not added"}</strong></p><p><span className="text-zinc-400">Account:</span> <strong className="capitalize">{statusText(user.status || "active")}</strong></p><p><span className="text-zinc-400">Member ID:</span> <strong>{user.memberId || "Not issued"}</strong></p></div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="hidden"/><div className="flex flex-wrap gap-2 mt-5"><button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy} className="px-4 py-2.5 rounded-xl bg-[#002344] text-white text-sm font-black inline-flex items-center gap-2"><FaCamera/>{photo ? "Change Photo" : "Upload Photo"}</button>{photoFile && <button type="button" onClick={savePhoto} disabled={photoBusy} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-black">{photoBusy ? "Saving…" : "Save Photo"}</button>}{photo && <button type="button" onClick={removePhoto} disabled={photoBusy} className="px-4 py-2.5 rounded-xl bg-zinc-100 text-red-600 text-sm font-black inline-flex items-center gap-2"><FaTrash/>Remove</button>}</div>{photoMessage && <p className="text-sm font-semibold mt-3 text-zinc-600">{photoMessage}</p>}<p className="text-xs text-zinc-400 mt-2">JPG, PNG or WebP · maximum 2MB.</p>
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"><Stat title="Account" value={statusText(user.status || "active")} sub={user.email} dark/><Stat title="Active Roles" value={[memberApproved, !!approvedVolunteer, !!selectedIntern, donors.some(d => ["paid", "offline"].includes(String(d.paymentStatus).toLowerCase()))].filter(Boolean).length} sub="Approved / active participation"/><Stat title="Applications" value={volunteers.length + internships.length + (user.memberType !== "general" ? 1 : 0)} sub="Submitted records"/><Stat title="Documents" value={docs} sub="Currently available"/></section>

        <section className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-black text-[#002344]">My Official Identity</h2><p className="text-sm text-zinc-500 mt-1">Official cards appear only after admin approval.</p></div><FaShieldAlt className="text-[#ff6600] text-2xl"/></div>{!memberApproved && !approvedVolunteer && !selectedIntern ? <Empty title="No official ID issued yet" text="Complete a role application to receive an official identity document after approval."/> : <div className="grid lg:grid-cols-3 gap-5">{memberApproved && <Identity title="MEMBERSHIP ID CARD" name={user.fullName} id={user.memberId} cert={user.certId} photo={photo} href={user.idCardUrl}/>} {approvedVolunteer && <Identity title="VOLUNTEER ID CARD" name={user.fullName} id={approvedVolunteer.volunteerId} cert={approvedVolunteer.certId} photo={photo} href={approvedVolunteer.idCardUrl}/>} {selectedIntern?.internId && <Identity title="INTERNSHIP ID CARD" name={user.fullName} id={selectedIntern.internId} cert={selectedIntern.completionCertId || selectedIntern.joiningLetterId} photo={photo} href={selectedIntern.idCardUrl}/>}</div>}</section>

        <section className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><div className="flex items-center gap-3 mb-5"><FaFileAlt className="text-[#ff6600]"/><div><h2 className="text-xl font-black text-[#002344]">My Applications & Roles</h2><p className="text-sm text-zinc-500">Each role remains independent.</p></div></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{roles.map(([title, Icon, active, detail, href]) => <a key={title} href={href} className={`rounded-2xl border p-5 hover:-translate-y-1 transition ${active ? "border-emerald-200 bg-emerald-50/50" : "bg-zinc-50 border-zinc-100"}`}><div className="flex justify-between"><Icon className="text-2xl text-[#002344]"/>{active && <FaCheckCircle className="text-emerald-500"/>}</div><h3 className="font-black text-[#002344] mt-4">{title}</h3><p className="text-xs text-zinc-500 mt-2">{detail}</p><span className="text-xs font-black text-[#ff6600] inline-flex gap-1 items-center mt-4">Open <FaArrowRight/></span></a>)}</div></section>

        <section className="grid lg:grid-cols-2 gap-6"><div className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><h2 className="text-xl font-black text-[#002344] mb-5">My Official Documents</h2><div className="space-y-3">{memberApproved && <Document title="Membership ID Card" number={user.memberId} href={user.idCardUrl}/>} {memberApproved && <Document title="Membership Certificate" number={user.certId} href={user.certificateUrl}/>} {approvedVolunteer && <Document title="Volunteer ID Card" number={approvedVolunteer.volunteerId} href={approvedVolunteer.idCardUrl}/>} {approvedVolunteer && <Document title="Volunteer Certificate" number={approvedVolunteer.certId} href={approvedVolunteer.certificateUrl}/>} {donors.filter(d => d.receiptUrl).map(d => <Document key={d.id} title="Donation Receipt" number={d.donorId} href={d.receiptUrl}/>)} {selectedIntern?.internId && <Document title="Internship ID Card" number={selectedIntern.internId} href={selectedIntern.idCardUrl}/>} {selectedIntern?.joiningLetterId && <Document title="Internship Joining Letter" number={selectedIntern.joiningLetterId} href={selectedIntern.joiningLetterUrl}/>} {selectedIntern?.completionCertId && <Document title="Internship Completion Certificate" number={selectedIntern.completionCertId} href={selectedIntern.completionCertificateUrl}/>} {!docs && <Empty title="No documents available" text="Documents appear only when officially issued."/>}</div></div>
          <div className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><h2 className="text-xl font-black text-[#002344] mb-5">Notifications & Status</h2>{loading && <p className="p-4 bg-zinc-50 rounded-xl text-sm">Refreshing latest records…</p>}<div className="space-y-3">{notifications.length ? notifications.map(n => <div key={n.key} className="p-4 rounded-xl bg-zinc-50 border flex items-start gap-3"><FaBell className="text-[#ff6600] mt-1"/><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><strong className="text-[#002344]">{n.title}</strong><span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${statusClass(n.status)}`}>{statusText(n.status)}</span></div><p className="text-xs text-zinc-500 mt-1">{n.id} · {dateText(n.date)}</p></div></div>) : <Empty title="No activity yet" text="Your application and participation updates will appear here."/>}</div></div>
        </section>

        <section className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><div className="flex items-center gap-3 mb-5"><FaHeart className="text-[#ff6600]"/><h2 className="text-xl font-black text-[#002344]">My Donations</h2></div>{donors.length ? <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-zinc-400 border-b"><th className="p-3">Date</th><th className="p-3">Purpose</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Receipt</th></tr></thead><tbody>{donors.map(d => <tr key={d.id} className="border-b last:border-0"><td className="p-3">{dateText(d.createdAt)}</td><td className="p-3">{d.donationPurpose || "General"}</td><td className="p-3 font-black">{d.amount ? `₹${d.amount}` : "—"}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${statusClass(d.paymentStatus)}`}>{statusText(d.paymentStatus)}</span></td><td className="p-3">{d.receiptUrl ? <a href={d.receiptUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#002344] text-white text-xs font-bold"><FaEye/>Receipt</a> : <span className="text-xs text-zinc-400">Not issued</span>}</td></tr>)}</tbody></table></div> : <p className="text-sm text-zinc-500 bg-zinc-50 rounded-xl p-5">No donation records linked to this account yet.</p>}</section>

        <section className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><div className="flex items-center gap-3 mb-5"><FaGraduationCap className="text-[#ff6600]"/><h2 className="text-xl font-black text-[#002344]">My Internship</h2></div>{internships.length ? internships.map(i => <InternshipRow key={i.id} item={i}/>) : <p className="text-sm text-zinc-500 bg-zinc-50 rounded-xl p-5">No internship application linked to this account.</p>}</section>

        <section className="bg-[#002344] text-white rounded-[2rem] p-6 md:p-8"><div className="flex gap-4"><FaCheckCircle className="text-emerald-300 text-2xl mt-1"/><div><h2 className="font-black text-xl">Official document lifecycle</h2><p className="text-sm text-white/70 mt-2 leading-relaxed">Application → Review → Approval / Selection → Official ID → Certificate / Receipt → Public Verification. Pending applications never receive an official document.</p></div><FaClock className="hidden sm:block ml-auto text-white/30"/></div></section>
      </div>
    </div>
  );
}

function Avatar({ src, size = "w-20 h-20" }) { return <div className={`${size} rounded-2xl bg-[#002344] text-white overflow-hidden flex items-center justify-center text-3xl shrink-0`}>{src ? <img src={src} alt="Profile" className="w-full h-full object-cover"/> : <FaUserCircle/>}</div>; }
function Stat({ title, value, sub, dark }) { return <div className={`${dark ? "bg-[#002344] text-white" : "bg-white"} rounded-2xl p-5 border`}><p className="text-xs uppercase tracking-widest opacity-60">{title}</p><p className="font-black text-2xl mt-2 break-all capitalize">{value}</p><p className="text-xs opacity-60 mt-1 truncate">{sub}</p></div>; }
function Empty({ title, text }) { return <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-5"><p className="font-black text-[#002344]">{title}</p><p className="text-sm text-zinc-500 mt-1">{text}</p></div>; }
function Document({ title, number, href }) { return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-zinc-50 p-4"><div><p className="font-black text-[#002344]">{title}</p><p className="text-xs text-zinc-500 mt-1">{number || "—"}</p></div>{href ? <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#002344] text-white text-xs font-bold"><FaEye/>Open</a> : <span className="text-xs text-zinc-400">Not issued</span>}</div>; }
function Identity({ title, name, id, cert, photo, href }) { return <div className="rounded-2xl overflow-hidden border-2 border-[#002344] shadow-lg bg-white"><div className="bg-[#002344] text-white p-4"><p className="text-[10px] font-black tracking-[.2em]">SWASTIK SRIJAN FOUNDATION SAMITI</p><p className="text-sm font-black mt-1">{title}</p></div><div className="p-5 flex gap-4 items-center"><Avatar src={photo} size="w-20 h-20"/><div className="min-w-0"><p className="font-black text-[#002344] truncate">{name}</p><p className="text-xs text-zinc-500 mt-1">ID: <strong>{id || "—"}</strong></p><p className="text-xs text-zinc-500 mt-1">Certificate: <strong>{cert || "—"}</strong></p></div></div><div className="px-5 pb-5">{href ? <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#002344] text-white text-xs font-bold"><FaEye/>Open ID</a> : <span className="text-xs text-zinc-400">Official document not issued</span>}</div></div>; }
function InternshipRow({ item }) { return <div className="rounded-2xl border bg-zinc-50 p-5 mb-3"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-black text-[#002344]">{item.internshipType || "Internship"}</p><p className="text-xs text-zinc-500 mt-1">{item.internId || "ID not issued"}</p></div><span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${statusClass(item.status)}`}>{statusText(item.status)}</span></div><div className="flex flex-wrap gap-2 mt-4">{item.joiningLetterUrl && <a href={item.joiningLetterUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-[#002344] text-white text-xs font-bold">Joining Letter</a>}{item.completionCertificateUrl && <a href={item.completionCertificateUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-[#002344] text-white text-xs font-bold">Completion Certificate</a>}</div></div>; }
