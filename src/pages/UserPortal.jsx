// The signed-in member's own workspace.
//
// One page, seven tabs, everything about THIS user and nobody else: the token
// kept at login is attached to every request, so the backend can prove the
// caller owns the account it is being asked about.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  FaArrowRight, FaBell, FaCamera, FaCheckCircle, FaClipboardList, FaCog, FaDownload,
  FaExclamationCircle, FaFileAlt, FaHandsHelping, FaIdCard, FaKey, FaRupeeSign,
  FaSignOutAlt, FaUserCircle, FaUserEdit, FaWallet,
} from "react-icons/fa";
import { API_BASE_URL, ENDPOINTS } from "../config/api";
import { authHeaders, clearSession, readSession, writeSession, withToken } from "../utils/userSession";
import { generateCertificate, generateIdentityCard } from "../utils/generateCertificate";
import UserParticipationForms from "../components/UserParticipationForms";
import { EmptyState, InlineAlert, ProgressRing, SectionCard, StatCard, StatusChip, Timeline, statusLabel } from "../components/dashboard/DashboardUI";

const MEMBERSHIP_FEE_TYPES = ["general", "active", "life"];
const MEMBERSHIP_FEES = { general: 1200, active: 2500, life: 8000 };
const needsFee = (memberType) => MEMBERSHIP_FEE_TYPES.includes(String(memberType || "").trim().toLowerCase());

const fileUrl = (path) => {
  if (!path) return null;
  if (/^(?:https?:\/\/|data:|blob:)/i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
const dateText = (value) => (value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—");
const dateTimeText = (value) => (value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—");
const formatINR = (value) => (value == null || value === "" ? "—" : `₹${Number(value).toLocaleString("en-IN")}`);

const TABS = [
  { id: "overview", label: "Overview", icon: FaIdCard },
  { id: "profile", label: "My Profile", icon: FaUserEdit },
  { id: "applications", label: "Applications", icon: FaClipboardList },
  { id: "documents", label: "Documents", icon: FaFileAlt },
  { id: "payments", label: "Payments", icon: FaWallet },
  { id: "notifications", label: "Notifications", icon: FaBell },
  { id: "settings", label: "Settings", icon: FaCog },
];

// Header links deep-link into a tab (e.g. /UserPortal#contributions), so keep a
// small alias table rather than renaming the tabs to match old links.
const TAB_ALIASES = { contributions: "payments", donations: "payments", documents: "documents", certificates: "documents" };
const tabFromHash = () => {
  const raw = String(window.location.hash || "").replace(/^#/, "").toLowerCase();
  if (!raw) return "overview";
  const id = TAB_ALIASES[raw] || raw;
  return TABS.some((t) => t.id === id) ? id : "overview";
};

export default function UserPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [portal, setPortal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(tabFromHash);
  const [openForm, setOpenForm] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const fileRef = useRef(null);

  const logout = useCallback(() => { clearSession(); navigate({ to: "/" }); }, [navigate]);

  const refresh = useCallback(async (session) => {
    const response = await fetch(ENDPOINTS.USER_PORTAL(session.id), { headers: authHeaders() });
    if (response.status === 401) { clearSession(); navigate({ to: "/" }); return; }
    if (!response.ok) throw new Error("Unable to load your portal right now.");
    const data = await response.json();
    setPortal(data);
    if (data.account) {
      // Keep the token issued at login while refreshing the profile fields.
      const fresh = { ...session, ...data.account, token: session.token };
      setUser(fresh);
      writeSession(fresh);
    }
  }, [navigate]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = readSession();
      if (!saved?.id || !saved?.token) { navigate({ to: "/" }); return; }
      setUser(saved);
      try { await refresh(saved); }
      catch (e) { if (alive) setError(e.message || "Unable to load your portal."); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [navigate, refresh]);

  useEffect(() => () => { if (photoPreview) URL.revokeObjectURL(photoPreview); }, [photoPreview]);

  // Keep the URL hash in step with the open tab so a refresh or a shared link
  // lands on the same section.
  useEffect(() => {
    const onHash = () => goTab(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const goTab = (id) => { setTab(id); window.history.replaceState(null, "", `#${id}`); };

  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoMessage("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setPhotoMessage("JPG, PNG or WebP photo only."); event.target.value = ""; return; }
    if (file.size > 2 * 1024 * 1024) { setPhotoMessage("Photo must be 2MB or smaller."); event.target.value = ""; return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const savePhoto = async () => {
    if (!photoFile || !user?.id) return;
    setPhotoBusy(true); setPhotoMessage("");
    try {
      const data = new FormData();
      data.append("profilePhoto", photoFile);
      const response = await fetch(ENDPOINTS.MEMBER_PROFILE_PHOTO(user.id), { method: "PATCH", headers: authHeaders(), body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to upload photo");
      const fresh = { ...user, profilePhotoPath: result.profilePhotoPath };
      setUser(fresh); writeSession(fresh);
      setPhotoFile(null); setPhotoPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setPhotoMessage("Profile photo updated.");
    } catch (e) { setPhotoMessage(e.message || "Unable to upload photo."); }
    finally { setPhotoBusy(false); }
  };

  const removePhoto = async () => {
    if (!user?.id || !user.profilePhotoPath) return;
    if (!window.confirm("Remove your profile photo? Some applications require a photo.")) return;
    setPhotoBusy(true); setPhotoMessage("");
    try {
      const response = await fetch(ENDPOINTS.MEMBER_PROFILE_PHOTO(user.id), { method: "DELETE", headers: authHeaders() });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to remove photo");
      const fresh = { ...user, profilePhotoPath: null };
      setUser(fresh); writeSession(fresh);
      setPhotoMessage("Profile photo removed.");
    } catch (e) { setPhotoMessage(e.message || "Unable to remove photo."); }
    finally { setPhotoBusy(false); }
  };

  const volunteers = portal?.activities?.volunteers || [];
  const donors = portal?.activities?.donors || [];
  const internships = portal?.activities?.internships || [];
  const interests = portal?.activities?.interests || [];

  const memberApproved = user?.status === "approved" && !!user?.memberId;
  const approvedVolunteer = volunteers.find((item) => item.status === "approved");
  const selectedIntern = internships.find((item) => ["selected", "completed"].includes(item.status));
  const photo = fileUrl(user?.profilePhotoPath);
  const displayPhoto = photoPreview || photo;
  const needsCorrection = String(user?.status || "").toLowerCase() === "changes_requested" && !!user?.reviewNote;

  const documents = useMemo(() => [
    memberApproved && { title: "Membership ID Card", id: user.memberId, href: user.idCardUrl, kind: "member-id" },
    memberApproved && { title: "Membership Certificate", id: user.certId, href: user.certificateUrl, kind: "member-cert" },
    approvedVolunteer && { title: "Volunteer ID Card", id: approvedVolunteer.volunteerId, href: approvedVolunteer.idCardUrl, kind: "vol-id" },
    approvedVolunteer && { title: "Volunteer Certificate", id: approvedVolunteer.certId, href: approvedVolunteer.certificateUrl, kind: "vol-cert" },
    ...donors.filter((item) => item.receiptUrl).map((item) => ({ title: "Donation Receipt", id: item.donorId, href: item.receiptUrl, kind: "receipt" })),
    selectedIntern?.internId && { title: "Internship ID Card", id: selectedIntern.internId, href: selectedIntern.idCardUrl, kind: "intern-id" },
    selectedIntern?.joiningLetterId && { title: "Internship Joining Letter", id: selectedIntern.joiningLetterId, href: selectedIntern.joiningLetterUrl, kind: "intern-letter" },
    selectedIntern?.completionCertId && { title: "Internship Completion Certificate", id: selectedIntern.completionCertId, href: selectedIntern.completionCertificateUrl, kind: "intern-cert" },
  ].filter(Boolean), [memberApproved, user, approvedVolunteer, donors, selectedIntern]);

  // The applicant-facing story: what happened, in order, and what is next.
  const timeline = useMemo(() => {
    if (!user) return [];
    const items = [{ key: "created", title: "Account created", detail: user.email, at: dateTimeText(user.createdAt), done: true }];
    if (needsFee(user.memberType)) {
      const paid = String(user.paymentStatus || "").toLowerCase() === "paid";
      items.push({ key: "fee", title: paid ? "Membership fee confirmed" : "Membership fee pending", detail: paid ? `${formatINR(MEMBERSHIP_FEES[user.memberType])} received` : `Pay ${formatINR(MEMBERSHIP_FEES[user.memberType])} to unlock approval`, at: user.paymentPaidAt ? dateTimeText(user.paymentPaidAt) : null, done: paid });
    }
    if (user.status === "approved") items.push({ key: "approved", title: "Membership approved", detail: user.memberId ? `Member ID ${user.memberId}` : null, at: dateTimeText(user.certificateIssuedAt), done: true });
    else if (needsCorrection) items.push({ key: "correction", title: "Correction requested", detail: user.reviewNote, at: null, done: false });
    else items.push({ key: "review", title: "Under review by the SSF team", detail: "We will update this as soon as a decision is made.", at: null, done: false });
    return items;
  }, [user, needsCorrection]);

  const notifications = useMemo(() => {
    if (!user) return [];
    const list = [];
    if (needsCorrection) list.push({ id: "correction", tone: "warning", title: "Action required: correction requested", body: user.reviewNote, action: "Fix & resubmit" });
    if (needsFee(user.memberType) && String(user.paymentStatus || "").toLowerCase() !== "paid" && user.status !== "approved") {
      list.push({ id: "fee", tone: "warning", title: "Membership fee pending", body: `Your ${statusLabel(user.memberType)} membership needs a confirmed fee payment of ${formatINR(MEMBERSHIP_FEES[user.memberType])} before approval.`, action: "Pay membership fee" });
    }
    if (memberApproved) list.push({ id: "issued", tone: "success", title: "Membership ID and certificate issued", body: `Your official Member ID ${user.memberId} is ready to download from Documents.` });
    if (String(user.paymentStatus || "").toLowerCase() === "paid") list.push({ id: "paid", tone: "success", title: "Payment confirmed", body: `We have confirmed your membership fee payment${user.paymentPaidAt ? ` on ${dateText(user.paymentPaidAt)}` : ""}.` });
    for (const v of volunteers) {
      if (v.status === "approved") list.push({ id: `v-${v.id}`, tone: "success", title: "Volunteer application approved", body: `Your Volunteer ID ${v.volunteerId || ""} is available in Documents.` });
      else if (v.status === "changes_requested") list.push({ id: `v-${v.id}`, tone: "warning", title: "Volunteer application needs a correction", body: v.reviewNote || "Please review and resubmit." });
    }
    for (const i of internships) {
      if (["selected", "completed"].includes(i.status)) list.push({ id: `i-${i.id}`, tone: "success", title: `Internship ${statusLabel(i.status)}`, body: `${i.internshipType || "Internship"} at SSF — documents are in your Documents tab.` });
      else if (i.status === "rejected") list.push({ id: `i-${i.id}`, tone: "error", title: "Internship application not selected", body: "You may apply again for a future cohort." });
    }
    if (list.length === 0) list.push({ id: "none", tone: "info", title: "No notifications yet", body: "Updates about your applications and payments will appear here." });
    return list;
  }, [user, needsCorrection, memberApproved, volunteers, internships]);

  const downloadMemberCertificate = async () => {
    try { await generateCertificate(user.fullName, "member", dateText(user.certificateIssuedAt), user.certId, user.memberId); }
    catch (e) { setError(e.message || "Unable to generate the certificate PDF."); }
  };
  const downloadMemberIdCard = async () => {
    try { await generateIdentityCard({ name: user.fullName, role: "member", date: dateText(user.certificateIssuedAt), officialId: user.memberId, certId: user.certId, photoUrl: photo }); }
    catch (e) { setError(e.message || "Unable to generate the ID card PDF."); }
  };
  const downloadVolunteerCertificate = async () => {
    try { await generateCertificate(approvedVolunteer.fullName, approvedVolunteer.volunteerType || "volunteer", dateText(approvedVolunteer.approvedAt), approvedVolunteer.certId, approvedVolunteer.volunteerId); }
    catch (e) { setError(e.message || "Unable to generate the certificate PDF."); }
  };
  const downloadVolunteerIdCard = async () => {
    try { await generateIdentityCard({ name: approvedVolunteer.fullName, role: approvedVolunteer.volunteerType || "volunteer", date: dateText(approvedVolunteer.approvedAt), officialId: approvedVolunteer.volunteerId, certId: approvedVolunteer.certId, photoUrl: photo }); }
    catch (e) { setError(e.message || "Unable to generate the ID card PDF."); }
  };
  const openOfficial = (href) => window.open(withToken(href, user.id), "_blank", "noopener,noreferrer");

  if (!user) return null;

  if (loading) {
    return <main className="min-h-screen bg-[#EAF0F6] pt-28 pb-16 px-4 sm:px-6"><div className="max-w-6xl mx-auto"><InlineAlert tone="loading">Loading your SSF workspace…</InlineAlert></div></main>;
  }

  const progressPct = memberApproved ? 100 : String(user.paymentStatus || "").toLowerCase() === "paid" ? 75 : 45;
  const activeRoleCount = [memberApproved, !!approvedVolunteer, !!selectedIntern, donors.some((item) => ["paid", "offline"].includes(String(item.paymentStatus).toLowerCase()))].filter(Boolean).length;
  const totalContributed = donors.filter((d) => ["paid", "offline"].includes(String(d.paymentStatus).toLowerCase())).reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  return (
    <main className="min-h-screen bg-[#EAF0F6] pt-24 md:pt-28 pb-16 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Identity bar */}
        <header className="rounded-3xl bg-[#12345A] text-white p-5 md:p-7 shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-white/10 ring-2 ring-white/20 flex items-center justify-center text-3xl">
                  {displayPhoto ? <img src={displayPhoto} alt="Profile" className="h-full w-full object-cover" /> : <FaUserCircle className="text-white/60" />}
                </div>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy} aria-label="Change profile photo" className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-[#F7A814] text-[#12345A] flex items-center justify-center shadow"><FaCamera /></button>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F7A814]">My SSF Workspace</p>
                <h1 className="text-2xl md:text-3xl font-black truncate">{user.fullName}</h1>
                <p className="text-sm text-white/70 truncate">{user.email}{user.phone ? ` · ${user.phone}` : ""}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <StatusChip status={user.status || "active"} />
                  {user.memberId && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold">{user.memberId}</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => goTab("profile")} className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-black"><FaUserEdit /> Edit profile</button>
              <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-white text-[#12345A] hover:bg-zinc-100 px-4 py-2.5 text-sm font-black"><FaSignOutAlt /> Logout</button>
            </div>
          </div>
          {photoMessage && <p className="relative text-xs text-[#F7A814] mt-3">{photoMessage}</p>}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="hidden" />
          {photoFile ? (
            <div className="relative flex flex-wrap gap-2 mt-3">
              <button type="button" onClick={savePhoto} disabled={photoBusy} className="rounded-xl bg-[#F7A814] text-[#12345A] px-4 py-2 text-xs font-black">{photoBusy ? "Saving…" : "Save photo"}</button>
              <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null); if (fileRef.current) fileRef.current.value = ""; }} className="rounded-xl bg-white/10 px-4 py-2 text-xs font-black">Cancel</button>
            </div>
          ) : user?.profilePhotoPath ? (
            <button type="button" onClick={removePhoto} disabled={photoBusy} className="relative mt-3 rounded-xl bg-white/10 px-4 py-2 text-xs font-black disabled:opacity-50">{photoBusy ? "Working…" : "Remove photo"}</button>
          ) : null}
        </header>

        {/* Tab bar */}
        <nav className="sticky top-20 md:top-28 z-20 mt-4 rounded-2xl border border-[#D8E1EA] bg-white/95 backdrop-blur shadow-sm p-2 overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => goTab(id)} className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold whitespace-nowrap transition ${tab === id ? "bg-[#12345A] text-white" : "text-zinc-600 hover:bg-[#EAF0F6]"}`}>
                <Icon /> {label}
                {id === "notifications" && notifications.some((n) => n.tone === "warning") && <span className="h-2 w-2 rounded-full bg-[#F7A814]" />}
              </button>
            ))}
          </div>
        </nav>

        {error && <InlineAlert tone="error" className="mt-4">{error}</InlineAlert>}

        <div className="mt-5 space-y-5">
          {tab === "overview" && (
            <>
              {needsCorrection && (
                <SectionCard eyebrow="Action required" title="The SSF team has asked for a correction" className="border-amber-300 bg-amber-50">
                  <p className="text-sm text-[#26343D] rounded-xl bg-white border border-amber-200 p-3"><strong>Note from admin:</strong> {user.reviewNote}</p>
                  <button type="button" onClick={() => setOpenForm("membership")} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#12345A] text-white px-5 py-3 font-bold">Fix &amp; Resubmit <FaArrowRight /></button>
                </SectionCard>
              )}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard tone="navy" label="Account status" value={statusLabel(user.status || "active")} hint="Membership record" icon={FaCheckCircle} />
                <StatCard tone="green" label="Active roles" value={activeRoleCount} hint="Member · Volunteer · Intern · Donor" icon={FaHandsHelping} />
                <StatCard tone="white" label="Documents" value={documents.length} hint="Ready to download" icon={FaFileAlt} />
                <StatCard tone="white" label="Total contributed" value={formatINR(totalContributed)} hint={`${donors.length} donation record${donors.length === 1 ? "" : "s"}`} icon={FaRupeeSign} />
              </div>
              <div className="grid lg:grid-cols-3 gap-5">
                <SectionCard eyebrow="Progress" title="Membership journey" className="lg:col-span-2">
                  <Timeline items={timeline} />
                  {needsFee(user.memberType) && String(user.paymentStatus || "").toLowerCase() !== "paid" && user.status !== "approved" && (
                    <button type="button" onClick={() => goTab("payments")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#12345A] text-white px-5 py-3 font-bold">Pay membership fee <FaArrowRight /></button>
                  )}
                </SectionCard>
                <SectionCard eyebrow="Completion" title="Profile readiness">
                  <div className="flex items-center gap-5">
                    <ProgressRing value={progressPct} />
                    <div className="text-sm space-y-1.5">
                      <p className="flex items-center gap-2 font-semibold text-[#12345A]"><span className={photo ? "text-emerald-600" : "text-amber-600"}>{photo ? "✓" : "•"}</span> Profile photo</p>
                      <p className="flex items-center gap-2 font-semibold text-[#12345A]"><span className={user.phone ? "text-emerald-600" : "text-amber-600"}>{user.phone ? "✓" : "•"}</span> Contact details</p>
                      <p className="flex items-center gap-2 font-semibold text-[#12345A]"><span className={memberApproved ? "text-emerald-600" : "text-amber-600"}>{memberApproved ? "✓" : "•"}</span> Membership approved</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    <button type="button" onClick={() => goTab("documents")} className="w-full rounded-xl bg-[#EAF0F6] text-[#12345A] px-4 py-2.5 text-sm font-bold text-left">View certificates &amp; ID cards</button>
                    <button type="button" onClick={() => goTab("applications")} className="w-full rounded-xl bg-[#EAF0F6] text-[#12345A] px-4 py-2.5 text-sm font-bold text-left">Start a new application</button>
                  </div>
                </SectionCard>
              </div>
            </>
          )}

          {tab === "profile" && <ProfileTab user={user} onRefresh={refresh} />}

          {tab === "applications" && (
            <>
              <SectionCard eyebrow="Participate" title="Start an application" subtitle="Choose any way you would like to work with SSF. The form opens right here.">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: "volunteer", title: "Volunteer", text: "Serve with SSF using your saved profile.", icon: FaHandsHelping },
                    { key: "membership", title: "Membership", text: "Join as General, Active, Life or Advisory member.", icon: FaIdCard },
                    { key: "internship", title: "Internship", text: "Gain practical social-service experience.", icon: FaClipboardList },
                    { key: "activities", title: "Activities & Events", text: "Join awareness, health, education and community drives.", icon: FaBell },
                    { key: "partnership", title: "Partnership", text: "Institutional, CSR or community collaboration.", icon: FaHandsHelping },
                    { key: "skills", title: "Skills Support", text: "Offer professional or technical expertise.", icon: FaUserEdit },
                  ].map(({ key, title, text, icon: Icon }) => (
                    <button key={key} type="button" onClick={() => setOpenForm(key)} className="group text-left rounded-2xl border border-[#D8E1EA] p-5 hover:border-[#176447] hover:-translate-y-0.5 hover:shadow-md transition bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <span className="h-11 w-11 rounded-2xl bg-[#EAF0F6] text-[#176447] flex items-center justify-center text-lg"><Icon /></span>
                        <FaArrowRight className="text-zinc-300 group-hover:text-[#176447] mt-2 transition" />
                      </div>
                      <h3 className="font-black text-[#12345A] mt-4">{title}</h3>
                      <p className="text-sm text-zinc-500 mt-1.5">{text}</p>
                      <p className="mt-3 text-xs font-black text-[#176447]">Start form →</p>
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard eyebrow="Track" title="My applications">
                <div className="space-y-3">
                  {needsFee(user.memberType) && (
                    <div className="rounded-2xl border border-[#D8E1EA] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div><p className="font-black text-[#12345A]">Membership — {statusLabel(user.memberType)}</p><p className="text-sm text-zinc-500 mt-0.5">{statusLabel(user.status)} · {formatINR(MEMBERSHIP_FEES[user.memberType])}/year</p></div>
                      <div className="flex items-center gap-2"><StatusChip status={user.status} /><StatusChip status={user.paymentStatus} /></div>
                    </div>
                  )}
                  {volunteers.map((v) => (
                    <div key={v.id} className="rounded-2xl border border-[#D8E1EA] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div><p className="font-black text-[#12345A]">Volunteer — {v.volunteerType || "General"}</p><p className="text-sm text-zinc-500 mt-0.5">Submitted {dateText(v.createdAt)}</p>{v.reviewNote && v.status === "changes_requested" && <p className="text-xs text-amber-700 mt-1 font-semibold">Correction: {v.reviewNote}</p>}</div>
                      <StatusChip status={v.status} />
                    </div>
                  ))}
                  {internships.map((i) => (
                    <div key={i.id} className="rounded-2xl border border-[#D8E1EA] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div><p className="font-black text-[#12345A]">Internship — {i.internshipType || "Internship"}</p><p className="text-sm text-zinc-500 mt-0.5">{i.college || "—"} · {i.duration || "—"}</p></div>
                      <StatusChip status={i.status} />
                    </div>
                  ))}
                  {interests.map((i) => (
                    <div key={i.id} className="rounded-2xl border border-[#D8E1EA] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div><p className="font-black text-[#12345A]">{i.category || statusLabel(i.interestType)}</p><p className="text-sm text-zinc-500 mt-0.5">Submitted {dateText(i.createdAt)}</p></div>
                      <StatusChip status={i.status} />
                    </div>
                  ))}
                  {!needsFee(user.memberType) && volunteers.length === 0 && internships.length === 0 && interests.length === 0 && (
                    <EmptyState title="No applications yet">Use the cards above to start your first application with SSF.</EmptyState>
                  )}
                </div>
              </SectionCard>
            </>
          )}

          {tab === "documents" && (
            <SectionCard eyebrow="Official records" title="Certificates & ID cards" subtitle="Every document carries a verification ID that can be checked on the public verify page.">
              {documents.length === 0 ? (
                <EmptyState title="No documents issued yet">After the SSF team approves your membership or volunteer application, your official ID card and certificate appear here for download.</EmptyState>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {documents.map((doc) => (
                    <div key={doc.kind} className="rounded-2xl border border-[#D8E1EA] bg-[#FAF9F5] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div><p className="font-black text-[#12345A]">{doc.title}</p><p className="text-xs text-zinc-500 mt-1 break-all">ID: {doc.id || "—"}</p></div>
                        <FaDownload className="text-[#176447] mt-1" />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {doc.kind === "member-cert" && <button type="button" onClick={downloadMemberCertificate} className="rounded-xl bg-[#12345A] text-white px-4 py-2 text-sm font-bold">Download PDF</button>}
                        {doc.kind === "member-id" && <button type="button" onClick={downloadMemberIdCard} className="rounded-xl bg-[#12345A] text-white px-4 py-2 text-sm font-bold">Download PDF</button>}
                        {doc.kind === "vol-cert" && <button type="button" onClick={downloadVolunteerCertificate} className="rounded-xl bg-[#12345A] text-white px-4 py-2 text-sm font-bold">Download PDF</button>}
                        {doc.kind === "vol-id" && <button type="button" onClick={downloadVolunteerIdCard} className="rounded-xl bg-[#12345A] text-white px-4 py-2 text-sm font-bold">Download PDF</button>}
                        {doc.href && <button type="button" onClick={() => openOfficial(doc.href)} className="rounded-xl bg-white border border-[#D8E1EA] text-[#12345A] px-4 py-2 text-sm font-bold">Official copy</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          )}

          {tab === "payments" && <PaymentsTab user={user} donors={donors} />}

          {tab === "notifications" && (
            <SectionCard eyebrow="Updates" title="Notifications">
              <div className="space-y-3">
                {notifications.map((n) => (
                  <InlineAlert key={n.id} tone={n.tone}>
                    <p className="font-black">{n.title}</p>
                    <p className="mt-0.5 font-medium">{n.body}</p>
                    {n.action === "Pay membership fee" && <button type="button" onClick={() => goTab("payments")} className="mt-2 font-black underline">{n.action}</button>}
                    {n.action === "Fix & resubmit" && <button type="button" onClick={() => setOpenForm("membership")} className="mt-2 font-black underline">{n.action}</button>}
                  </InlineAlert>
                ))}
              </div>
            </SectionCard>
          )}

          {tab === "settings" && <SettingsTab user={user} onLogout={logout} />}
        </div>
      </div>
      <UserParticipationForms openForm={openForm} onClose={() => { setOpenForm(null); refresh(user); }} user={user} />
    </main>
  );
}

function ProfileTab({ user, onRefresh }) {
  const [form, setForm] = useState({ fullName: user.fullName || "", phone: user.phone || "", idProofType: user.idProofType || "", identityNumber: user.identityNumber || "" });
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  const save = async (event) => {
    event.preventDefault();
    setState("saving"); setMessage("");
    try {
      const response = await fetch(ENDPOINTS.ACCOUNT_PROFILE, { method: "PATCH", headers: authHeaders({ "Content-Type": "application/json" }), body: JSON.stringify(form) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to update your profile.");
      await onRefresh(readSession());
      setState("success"); setMessage(result.message || "Profile updated.");
    } catch (e) { setState("error"); setMessage(e.message || "Unable to update your profile."); }
  };

  return (
    <SectionCard eyebrow="My details" title="Profile information" subtitle="Keep your contact details current — the SSF team uses them for approvals and official records.">
      <form onSubmit={save} className="ssf-form max-w-2xl">
        <div className="ssf-form-grid ssf-form-grid-2">
          <label className="ssf-field"><span className="ssf-label">Full name</span><input className="ssf-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></label>
          <label className="ssf-field"><span className="ssf-label">Email (login)</span><input className="ssf-input" value={user.email} readOnly /></label>
          <label className="ssf-field"><span className="ssf-label">Mobile number</span><input className="ssf-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label className="ssf-field"><span className="ssf-label">Member ID</span><input className="ssf-input" value={user.memberId || "Not issued"} readOnly /></label>
          <label className="ssf-field"><span className="ssf-label">ID proof type</span>
            <select className="ssf-select" value={form.idProofType} onChange={(e) => setForm({ ...form, idProofType: e.target.value })}>
              <option value="">Not provided</option>
              {["Aadhaar Card", "PAN Card", "Voter ID", "Driving Licence", "Passport", "College / Student ID", "Other Government ID"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="ssf-field"><span className="ssf-label">ID number</span><input className="ssf-input" value={form.identityNumber} onChange={(e) => setForm({ ...form, identityNumber: e.target.value })} /></label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={state === "saving"} className="rounded-xl bg-[#12345A] text-white px-5 py-3 font-bold disabled:opacity-60">{state === "saving" ? "Saving…" : "Save changes"}</button>
          {message && <span className={`text-sm font-semibold ${state === "error" ? "text-red-600" : "text-emerald-700"}`}>{message}</span>}
        </div>
      </form>
    </SectionCard>
  );
}

function PaymentsTab({ user, donors }) {
  const fee = MEMBERSHIP_FEES[user.memberType];
  const paid = String(user.paymentStatus || "").toLowerCase() === "paid";
  return (
    <>
      {needsFee(user.memberType) && (
        <SectionCard eyebrow="Membership fee" title={`${statusLabel(user.memberType)} membership`}>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><p className="text-xs font-black uppercase tracking-widest text-zinc-400">Amount</p><p className="text-2xl font-black text-[#12345A] mt-1">{formatINR(fee)}<span className="text-sm font-bold text-zinc-400">/year</span></p></div>
            <div><p className="text-xs font-black uppercase tracking-widest text-zinc-400">Status</p><div className="mt-1.5"><StatusChip status={user.paymentStatus} /></div></div>
            <div><p className="text-xs font-black uppercase tracking-widest text-zinc-400">Confirmed on</p><p className="font-bold text-[#12345A] mt-1">{user.paymentPaidAt ? dateText(user.paymentPaidAt) : "—"}</p></div>
          </div>
          {user.paymentMode && <p className="text-sm text-zinc-500 mt-4">Recorded as <strong>{user.paymentMode}</strong>{user.paymentReference ? ` · reference ${user.paymentReference}` : ""}</p>}
          {!paid && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-black text-amber-900 flex items-center gap-2"><FaExclamationCircle /> Membership fee not yet confirmed</p>
              <p className="text-sm text-amber-800 mt-1">Pay the fee through the secure Razorpay page, then submit your UPI / UTR reference from the Membership form so the SSF team can verify it.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] text-white px-4 py-2.5 font-bold">Pay {formatINR(fee)} <FaArrowRight /></a>
              </div>
            </div>
          )}
          {paid && <InlineAlert tone="success" className="mt-5">Your membership fee is confirmed. No further payment is needed.</InlineAlert>}
        </SectionCard>
      )}
      <SectionCard eyebrow="Contributions" title="Donations & receipts">
        {donors.length === 0 ? (
          <EmptyState title="No contributions recorded yet">Donation records and receipts will appear here after your first contribution.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead><tr className="text-left text-zinc-400 border-b"><th className="p-3">Date</th><th className="p-3">Purpose</th><th className="p-3">Amount</th><th className="p-3">Mode</th><th className="p-3">Status</th><th className="p-3">Receipt</th></tr></thead>
              <tbody>
                {donors.map((d) => (
                  <tr key={d.id} className="border-b last:border-0">
                    <td className="p-3">{dateText(d.createdAt)}</td>
                    <td className="p-3">{d.donationPurpose || "General"}</td>
                    <td className="p-3 font-bold">{formatINR(d.amount)}</td>
                    <td className="p-3 text-zinc-500">{d.paymentMode || "—"}</td>
                    <td className="p-3"><StatusChip status={d.paymentStatus} /></td>
                    <td className="p-3">{d.receiptUrl ? <button type="button" onClick={() => window.open(withToken(d.receiptUrl, user.id), "_blank", "noopener,noreferrer")} className="text-[#176447] font-bold">View</button> : <span className="text-zinc-400">Not issued</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </>
  );
}

function SettingsTab({ user, onLogout }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  const change = async (event) => {
    event.preventDefault();
    setMessage("");
    if (form.newPassword.length < 8) { setState("error"); return setMessage("New password must be at least 8 characters."); }
    if (form.newPassword !== form.confirmPassword) { setState("error"); return setMessage("New password and confirmation do not match."); }
    setState("saving");
    try {
      const response = await fetch(ENDPOINTS.ACCOUNT_PASSWORD, { method: "POST", headers: authHeaders({ "Content-Type": "application/json" }), body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to change your password.");
      setState("success"); setMessage(result.message || "Password changed.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) { setState("error"); setMessage(e.message || "Unable to change your password."); }
  };

  return (
    <>
      <SectionCard eyebrow="Security" title="Change password" subtitle="Use at least 8 characters. You will stay signed in on this device.">
        <form onSubmit={change} className="ssf-form max-w-lg">
          <label className="ssf-field"><span className="ssf-label">Current password</span><input type="password" autoComplete="current-password" className="ssf-input" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} required /></label>
          <div className="ssf-form-grid ssf-form-grid-2">
            <label className="ssf-field"><span className="ssf-label">New password</span><input type="password" autoComplete="new-password" className="ssf-input" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required /></label>
            <label className="ssf-field"><span className="ssf-label">Confirm new password</span><input type="password" autoComplete="new-password" className="ssf-input" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required /></label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={state === "saving"} className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] text-white px-5 py-3 font-bold disabled:opacity-60"><FaKey /> {state === "saving" ? "Updating…" : "Update password"}</button>
            {message && <span className={`text-sm font-semibold ${state === "error" ? "text-red-600" : "text-emerald-700"}`}>{message}</span>}
          </div>
        </form>
      </SectionCard>
      <SectionCard eyebrow="Account" title="Account details">
        <dl className="grid sm:grid-cols-2 gap-4 text-sm max-w-2xl">
          <div><dt className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Email</dt><dd className="font-semibold text-[#12345A] mt-1">{user.email}</dd></div>
          <div><dt className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Account type</dt><dd className="font-semibold text-[#12345A] mt-1">{statusLabel(user.memberType || "general")}</dd></div>
          <div><dt className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Member ID</dt><dd className="font-semibold text-[#12345A] mt-1">{user.memberId || "Not issued"}</dd></div>
          <div><dt className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Joined</dt><dd className="font-semibold text-[#12345A] mt-1">{dateText(user.createdAt)}</dd></div>
        </dl>
        <button type="button" onClick={onLogout} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-red-200 text-red-600 px-5 py-3 font-bold"><FaSignOutAlt /> Logout of this device</button>
      </SectionCard>
    </>
  );
}
