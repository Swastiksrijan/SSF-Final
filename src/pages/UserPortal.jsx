import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FaArrowRight, FaCamera, FaCheckCircle, FaFileAlt, FaHeart, FaIdCard, FaSignOutAlt, FaTrash, FaUserCircle } from "react-icons/fa";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

const SESSION_KEY = "ssf_user_session";

const statusText = (value) => {
  const s = String(value || "pending").toLowerCase();
  const map = {
    approved: "Approved",
    selected: "Selected",
    completed: "Completed",
    paid: "Paid",
    offline: "Received",
    pending: "Under review",
    submitted: "Under review",
    rejected: "Not approved",
    failed: "Failed",
  };
  return map[s] || s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const statusClass = (value) => {
  const s = String(value || "").toLowerCase();
  if (["approved", "selected", "completed", "paid", "offline"].includes(s)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (["rejected", "failed"].includes(s)) return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

const dateText = (value) => value
  ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  : "—";

const fileUrl = (path) => path
  ? (/^https?:\/\//i.test(path) ? path : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`)
  : null;

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

  const refresh = async (saved) => {
    const response = await fetch(ENDPOINTS.USER_PORTAL(saved.id));
    if (!response.ok) throw new Error("Unable to load your portal");
    const data = await response.json();
    setPortal(data);
    if (data.account) {
      const fresh = { ...saved, ...data.account };
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

  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoMessage("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoMessage("JPG, PNG or WebP photo only.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoMessage("Photo must be 2MB or smaller.");
      event.target.value = "";
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const savePhoto = async () => {
    if (!photoFile || !user?.id) return;
    setPhotoBusy(true);
    setPhotoMessage("");
    try {
      const formData = new FormData();
      formData.append("profilePhoto", photoFile);
      const response = await fetch(ENDPOINTS.MEMBER_PROFILE_PHOTO(user.id), { method: "PATCH", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to upload photo");
      const fresh = { ...user, profilePhotoPath: data.profilePhotoPath };
      setUser(fresh);
      localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
      window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: fresh }));
      setPhotoFile(null);
      setPhotoPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setPhotoMessage("Profile photo updated.");
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
      const response = await fetch(ENDPOINTS.MEMBER_PROFILE_PHOTO(user.id), { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to remove photo");
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
  const approvedVolunteer = volunteers.find((item) => item.status === "approved");
  const selectedIntern = internships.find((item) => ["selected", "completed"].includes(item.status));
  const photo = fileUrl(user.profilePhotoPath);
  const displayPhoto = photoPreview || photo;

  const documents = [
    memberApproved && { title: "Membership ID Card", id: user.memberId, href: user.idCardUrl },
    memberApproved && { title: "Membership Certificate", id: user.certId, href: user.certificateUrl },
    approvedVolunteer && { title: "Volunteer ID Card", id: approvedVolunteer.volunteerId, href: approvedVolunteer.idCardUrl },
    approvedVolunteer && { title: "Volunteer Certificate", id: approvedVolunteer.certId, href: approvedVolunteer.certificateUrl },
    ...donors.filter((item) => item.receiptUrl).map((item) => ({ title: "Donation Receipt", id: item.donorId, href: item.receiptUrl })),
    selectedIntern?.internId && { title: "Internship ID Card", id: selectedIntern.internId, href: selectedIntern.idCardUrl },
    selectedIntern?.joiningLetterId && { title: "Internship Joining Letter", id: selectedIntern.joiningLetterId, href: selectedIntern.joiningLetterUrl },
    selectedIntern?.completionCertId && { title: "Internship Completion Certificate", id: selectedIntern.completionCertId, href: selectedIntern.completionCertificateUrl },
  ].filter(Boolean);

  const applicationCount = volunteers.length + internships.length + (user.memberType && user.memberType !== "general" ? 1 : 0);
  const activeRoleCount = [memberApproved, !!approvedVolunteer, !!selectedIntern, donors.some((item) => ["paid", "offline"].includes(String(item.paymentStatus).toLowerCase()))].filter(Boolean).length;

  const roles = [
    {
      title: "Membership",
      icon: FaIdCard,
      status: memberApproved ? "approved" : (user.memberType && user.memberType !== "general" ? "pending" : "not_applied"),
      detail: memberApproved ? `Member ID: ${user.memberId}` : "Join the SSF family",
      href: "/Members",
    },
    {
      title: "Volunteer",
      icon: FaCheckCircle,
      status: approvedVolunteer ? "approved" : (volunteers.length ? "pending" : "not_applied"),
      detail: approvedVolunteer ? `Volunteer ID: ${approvedVolunteer.volunteerId || "Issued"}` : "Serve with SSF",
      href: "/Volunteer",
    },
    {
      title: "Internship",
      icon: FaFileAlt,
      status: selectedIntern ? selectedIntern.status : (internships.length ? "pending" : "not_applied"),
      detail: selectedIntern ? "Participation active / completed" : "Apply for an internship",
      href: "/Internship",
    },
    {
      title: "Donations",
      icon: FaHeart,
      status: donors.length ? donors[donors.length - 1].paymentStatus : "not_applied",
      detail: donors.length ? `${donors.length} donation record${donors.length > 1 ? "s" : ""}` : "Support SSF programmes",
      href: "/Donate",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8fa] pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <header className="bg-white rounded-3xl border shadow-sm p-5 md:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={displayPhoto} />
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#ff6600]">My SSF</p>
              <h1 className="text-2xl md:text-3xl font-black text-[#002344]">Welcome, {user.fullName}</h1>
              <p className="text-sm text-zinc-500 mt-1">{user.email}{user.phone ? ` · ${user.phone}` : ""}</p>
            </div>
          </div>
          <button onClick={logout} className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#002344] text-white font-bold inline-flex items-center gap-2"><FaSignOutAlt /> Logout</button>
        </header>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 font-semibold">{error}</div>}

        <section className="bg-white rounded-3xl border shadow-sm p-5 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative shrink-0">
              <Avatar src={displayPhoto} large />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy} aria-label="Change profile photo" className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#ff6600] text-white flex items-center justify-center shadow"><FaCamera /></button>
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#ff6600]">My Profile</p>
              <h2 className="text-2xl font-black text-[#002344] mt-1">{user.fullName}</h2>
              <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm">
                <p><span className="text-zinc-400">Email:</span> <strong>{user.email}</strong></p>
                <p><span className="text-zinc-400">Phone:</span> <strong>{user.phone || "Not added"}</strong></p>
                <p><span className="text-zinc-400">Account:</span> <strong>{statusText(user.status || "active")}</strong></p>
                <p><span className="text-zinc-400">Member ID:</span> <strong>{user.memberId || "Not issued"}</strong></p>
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="hidden" />
              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy} className="px-4 py-2 rounded-xl bg-[#002344] text-white text-sm font-bold">Change Photo</button>
                {photoFile && <button type="button" onClick={savePhoto} disabled={photoBusy} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold">{photoBusy ? "Saving…" : "Save Photo"}</button>}
                {photo && <button type="button" onClick={removePhoto} disabled={photoBusy} className="px-4 py-2 rounded-xl bg-zinc-100 text-red-600 text-sm font-bold inline-flex items-center gap-2"><FaTrash /> Remove</button>}
              </div>
              {photoMessage && <p className="text-sm text-zinc-500 mt-2">{photoMessage}</p>}
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Summary title="Account" value={statusText(user.status || "active")} />
          <Summary title="Active roles" value={activeRoleCount} />
          <Summary title="Applications" value={applicationCount} />
          <Summary title="Documents" value={documents.length} />
        </section>

        <section className="bg-white rounded-3xl border shadow-sm p-5 md:p-7">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div><h2 className="text-xl font-black text-[#002344]">My SSF Participation</h2><p className="text-sm text-zinc-500 mt-1">Your membership, volunteer, internship and giving activity.</p></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              const notApplied = role.status === "not_applied";
              return (
                <a key={role.title} href={role.href} className="rounded-2xl border border-zinc-200 p-5 hover:border-[#ff6600] hover:-translate-y-0.5 transition bg-white">
                  <Icon className="text-2xl text-[#ff6600]" />
                  <h3 className="font-black text-[#002344] mt-4">{role.title}</h3>
                  <p className="text-sm text-zinc-500 mt-2 min-h-10">{role.detail}</p>
                  <span className={`inline-block mt-3 px-2.5 py-1 rounded-full border text-[11px] font-black ${notApplied ? "bg-zinc-50 text-zinc-500 border-zinc-200" : statusClass(role.status)}`}>
                    {notApplied ? "Not joined" : statusText(role.status)}
                  </span>
                  <span className="block text-xs font-black text-[#ff6600] mt-4">Open <FaArrowRight className="inline ml-1" /></span>
                </a>
              );
            })}
          </div>
        </section>

        {donors.length > 0 && (
          <section className="bg-white rounded-3xl border shadow-sm p-5 md:p-7">
            <h2 className="text-xl font-black text-[#002344] mb-4">My Donations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-zinc-400 border-b"><th className="p-3">Date</th><th className="p-3">Purpose</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Receipt</th></tr></thead>
                <tbody>{donors.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="p-3">{dateText(item.createdAt)}</td><td className="p-3">{item.donationPurpose || "General"}</td><td className="p-3 font-bold">{item.amount ? `₹${item.amount}` : "—"}</td><td className="p-3"><span className={`px-2 py-1 rounded-full border text-[10px] font-black ${statusClass(item.paymentStatus)}`}>{statusText(item.paymentStatus)}</span></td><td className="p-3">{item.receiptUrl ? <a href={item.receiptUrl} target="_blank" rel="noreferrer" className="text-[#ff6600] font-bold">View receipt</a> : <span className="text-zinc-400">Not issued</span>}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        )}

        {documents.length > 0 && (
          <section className="bg-white rounded-3xl border shadow-sm p-5 md:p-7">
            <h2 className="text-xl font-black text-[#002344] mb-4">My Documents</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documents.map((doc, index) => <div key={`${doc.title}-${index}`} className="rounded-2xl border p-4 flex items-center justify-between gap-3"><div><p className="font-bold text-[#002344]">{doc.title}</p><p className="text-xs text-zinc-400 mt-1">{doc.id || "Official document"}</p></div>{doc.href ? <a href={doc.href} target="_blank" rel="noreferrer" className="text-[#ff6600] font-black text-sm">View</a> : <span className="text-xs text-zinc-400">Pending</span>}</div>)}
            </div>
          </section>
        )}

        {loading && <p className="text-center text-sm text-zinc-400">Loading your latest SSF information…</p>}
      </div>
    </main>
  );
}

function Avatar({ src, large = false }) {
  return (
    <div className={`${large ? "w-28 h-28" : "w-14 h-14"} rounded-2xl bg-[#002344] text-white overflow-hidden flex items-center justify-center shrink-0`}>
      {src ? <img src={src} alt="Profile" className="w-full h-full object-cover" /> : <FaUserCircle className="text-5xl text-white/70" />}
    </div>
  );
}

function Summary({ title, value }) {
  return <div className="bg-white rounded-2xl border shadow-sm p-5"><p className="text-xs font-black uppercase tracking-wider text-zinc-400">{title}</p><p className="text-2xl font-black text-[#002344] mt-2 capitalize">{value}</p></div>;
}
