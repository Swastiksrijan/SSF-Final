import { useEffect, useMemo, useState } from "react";
import { FaUsers, FaShieldAlt, FaLock, FaIdCard, FaCertificate, FaCamera, FaTrash } from "react-icons/fa";
import { generateCertificate, generateIdentityCard } from "../utils/generateCertificate";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

const TOKEN_KEY = "ssf_admin_token";
const photoUrl = (path) => {
    if (!path) return null;
    return /^(?:https?:\/\/|data:image\/)/i.test(path) ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
const formatDate = (person) => new Date(person.certificateIssuedAt || person.approvedAt || person.submittedAt || new Date()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

// A membership with a fee cannot be approved until the fee is confirmed, so the
// admin needs to see the payment state and be able to record an offline payment.
const MEMBERSHIP_FEES = { general: 1200, life: 8000, patron: 10000 };
const FEE_MEMBER_TYPES = ["general", "life", "patron"];
const needsFee = (member) => FEE_MEMBER_TYPES.includes(String(member?.memberType || "").trim().toLowerCase());
const minimumContribution = (member) => {
    const type = String(member?.memberType || "").trim().toLowerCase();
    if (type === "general") return /Ordinary membership payment preference: monthly/i.test(member.message || "") ? 100 : 1200;
    if (type === "patron") {
        const match = String(member.message || "").match(/Patron installment count:\\s*(\\d+)/i);
        const count = match ? Number(match[1]) : 1;
        return [1, 2, 3, 4, 6, 12].includes(count) ? (count === 1 ? 10000 : Math.ceil(10000 / count)) : 10000;
    }
    return MEMBERSHIP_FEES[type] || 0;
};
const paymentLabel = (member) => {
    const status = String(member?.paymentStatus || "pending").toLowerCase();
    if (!needsFee(member)) return "Not required";
    return { paid: "Contribution received", pending: "Fee pending", failed: "Fee failed", not_required: "Not required" }[status] || status;
};
const paymentTone = (member) => {
    const status = String(member?.paymentStatus || "pending").toLowerCase();
    if (!needsFee(member)) return "text-zinc-500";
    return status === "paid" ? "text-emerald-600" : "text-orange-600";
};

export default function AdminPortalV2() {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const [applications, setApplications] = useState([]);
    const [members, setMembers] = useState([]);
    const [governanceVerifications, setGovernanceVerifications] = useState([]);
    const [busy, setBusy] = useState("");
    const [filter, setFilter] = useState("all");

    const authHeaders = (authToken = token) => ({ Authorization: `Bearer ${authToken}` });
    const logout = () => { localStorage.removeItem(TOKEN_KEY); setToken(""); setApplications([]); setMembers([]); };
    const loadApplications = async (authToken = token) => {
        const response = await fetch(ENDPOINTS.ADMIN_VOLUNTEERS, { headers: authHeaders(authToken) });
        if (response.status === 401) return logout();
        const data = await response.json().catch(() => []);
        setApplications(response.ok && Array.isArray(data) ? data : []);
    };
    const loadMembers = async (authToken = token) => {
        const response = await fetch(`${ENDPOINTS.ADMIN_MEMBERS}?includeAccounts=true`, { headers: authHeaders(authToken) });
        if (response.status === 401) return logout();
        const data = await response.json().catch(() => []);
        setMembers(response.ok && Array.isArray(data) ? data : []);
    };
    const loadGovernanceVerifications = async (authToken = token) => {
        const response = await fetch(ENDPOINTS.GOVERNANCE_VERIFICATIONS, { headers: authHeaders(authToken) });
        if (response.status === 401) return logout();
        const data = await response.json().catch(() => []);
        setGovernanceVerifications(response.ok && Array.isArray(data) ? data : []);
    };
    useEffect(() => { if (token) { loadApplications(token); loadMembers(token); loadGovernanceVerifications(token); } }, [token]);

    const login = async (event) => {
        event.preventDefault(); setLoginError("");
        try {
            const response = await fetch(ENDPOINTS.ADMIN_LOGIN, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginForm) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Login failed");
            localStorage.setItem(TOKEN_KEY, result.token); setToken(result.token); setLoginForm({ username: "", password: "" });
        } catch (error) { setLoginError(error.message); }
    };

    const reviewGovernanceVerification = async (record, status) => {
        const committeeReference = status === "verified" ? window.prompt(`Enter Managing Committee meeting / resolution reference for verifying ${record.fullName}:`) : "";
        if (status === "verified" && committeeReference === null) return;
        if (status === "verified" && !committeeReference.trim()) return window.alert("Committee resolution reference is required.");
        const adminNote = status === "changes_requested" || status === "rejected" ? window.prompt("Enter the reason / correction required:") : "";
        if ((status === "changes_requested" || status === "rejected") && adminNote === null) return;
        setBusy(`gov-${record.id}`);
        try {
            const response = await fetch(`${ENDPOINTS.GOVERNANCE_VERIFICATIONS}/${record.id}`, { method: "PATCH", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ status, committeeReference: committeeReference || "", adminNote: adminNote || "" }) });
            const result = await response.json().catch(() => ({}));
            if (response.status === 401) return logout();
            if (!response.ok) return window.alert(result.message || "Unable to update verification.");
            await loadGovernanceVerifications();
        } finally { setBusy(""); }
    };

    const approveVolunteer = async (id) => {
        if (!window.confirm("Approve this volunteer and issue the official Volunteer ID + Certificate?")) return;
        setBusy(`v-${id}`);
        try {
            const response = await fetch(ENDPOINTS.ADMIN_APPROVE(id), { method: "POST", headers: authHeaders() });
            const result = await response.json().catch(() => ({}));
            if (response.status === 401) return logout();
            if (!response.ok) return window.alert(result.message || "Approval failed");
            await loadApplications();
            window.alert(`Volunteer approved.\nVolunteer ID: ${result.volunteerId || "Issued"}\nCertificate ID: ${result.certId || "Issued"}${result.warning ? `\n${result.warning}` : ""}`);
        } finally { setBusy(""); }
    };

    const approveMember = async (id) => {
        const member = members.find(item => String(item.id) === String(id));
        if (!member) return window.alert("Member record not found. Please refresh the list.");
        const committeeReference = window.prompt(`Enter the Managing Committee resolution / meeting reference authorizing admission and Member ID issuance for ${member.fullName}:`);
        if (committeeReference === null) return;
        if (!committeeReference.trim()) return window.alert("Managing Committee resolution/reference is required. No ID will be issued without it.");
        if (!window.confirm(`Confirm that the Managing Committee has approved ${member.fullName} for admission and official Member ID issuance?\\n\\nExisting official Member ID, if any, will be retained.`)) return;
        setBusy(`m-${id}`);
        try {
            const response = await fetch(ENDPOINTS.ADMIN_MEMBER_APPROVE(id), { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ committeeReference: committeeReference.trim() }) });
            const result = await response.json().catch(() => ({}));
            if (response.status === 401) return logout();
            if (!response.ok) return window.alert(result.message || "Approval failed");
            await loadMembers();
            window.alert(`Member approved.\nMember ID: ${result.memberId || "Issued"}\nCertificate ID: ${result.certId || "Issued"}${result.warning ? `\n${result.warning}` : ""}`);
        } finally { setBusy(""); }
    };

    const authorizeMemberPayment = async (member) => {
        const note = window.prompt(`Enter the Managing Committee meeting/resolution reference for approving payment from ${member.fullName}:`);
        if (note === null) return;
        if (!note.trim()) return window.alert("Committee decision/reference is required.");
        setBusy(`auth-${member.id}`);
        try {
            const response = await fetch(`${ENDPOINTS.ADMIN_MEMBERS}/${member.id}/authorize-payment`, { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ reviewNote: note.trim() }) });
            const result = await response.json().catch(() => ({}));
            if (response.status === 401) return logout();
            if (!response.ok) return window.alert(result.message || "Unable to record committee decision.");
            await loadMembers();
            window.alert("Committee payment authorization recorded. The applicant can now be instructed to pay.");
        } finally { setBusy(""); }
    };

    const markPaymentReceived = async (member) => {
        const type = String(member.memberType || "").toLowerCase();
        const monthlyOrdinary = type === "general" && /Ordinary membership payment preference: monthly/i.test(member.message || "");
        const minimum = minimumContribution(member);
        const amountText = window.prompt(`Enter the actual amount received from ${member.fullName} (minimum ₹${minimum.toLocaleString("en-IN")}):`, String(minimum));
        if (amountText === null) return;
        const amount = Number(String(amountText).replace(/,/g, "").trim());
        if (!Number.isFinite(amount) || amount < minimum) return window.alert(`Amount must be at least ₹${minimum.toLocaleString("en-IN")}.`);
        const reference = window.prompt(`Enter the UPI / UTR / receipt reference for ₹${amount.toLocaleString("en-IN")} received from ${member.fullName}:`);
        if (reference === null) return;
        if (String(reference).trim().length < 4) return window.alert("Please enter a valid payment reference (at least 4 characters).");
        const paymentMode = window.prompt("Select / enter payment mode (UPI, Bank Transfer, Cash, Cheque, Razorpay):", member.paymentMode || "UPI");
        if (paymentMode === null) return;
        if (!paymentMode.trim()) return window.alert("Payment mode is required.");
        setBusy(`pay-${member.id}`);
        try {
            const response = await fetch(ENDPOINTS.ADMIN_UPDATE_MEMBER(member.id), { method: "PATCH", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ paymentStatus: "paid", paymentAmount: Math.round(amount * 100), paymentMode: paymentMode.trim(), paymentReference: String(reference).trim() }) });
            const result = await response.json().catch(() => ({}));
            if (response.status === 401) return logout();
            if (!response.ok) return window.alert(result.message || "Unable to record the payment");
            await loadMembers();
            window.alert(`Membership contribution of ₹${amount.toLocaleString("en-IN")} recorded as received for ${member.fullName}. You can now approve and issue the Member ID.`);
        } finally { setBusy(""); }
    };

    const requestCorrection = async (person, member = false) => {
        const note = window.prompt(`What correction is needed from ${person.fullName}?\n\nThis note is shown in the applicant's dashboard so they can fix and resubmit.`);
        if (note === null) return;
        if (!note.trim()) return window.alert("A short correction note is required.");
        setBusy(`fix-${member ? "m" : "v"}-${person.id}`);
        try {
            const endpoint = member ? ENDPOINTS.ADMIN_MEMBER_STATUS(person.id) : ENDPOINTS.ADMIN_VOLUNTEER_STATUS(person.id);
            const response = await fetch(endpoint, { method: "PATCH", headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ status: "changes_requested", reviewNote: note.trim() }) });
            const result = await response.json().catch(() => ({}));
            if (response.status === 401) return logout();
            if (!response.ok) return window.alert(result.message || "Unable to send the correction request.");
            member ? await loadMembers() : await loadApplications();
            window.alert(`Correction request sent to ${person.fullName}. It will appear in their SSF dashboard.`);
        } finally { setBusy(""); }
    };

    const deleteVolunteer = async (person) => {
        if (!window.confirm(`Delete volunteer application for ${person.fullName}?\n\nThis permanently removes the application and uploaded files. This cannot be undone.`)) return;
        setBusy(`delete-v-${person.id}`);
        try {
            const response = await fetch(ENDPOINTS.ADMIN_DELETE_VOLUNTEER(person.id), { method: "DELETE", headers: authHeaders() });
            const result = await response.json().catch(() => ({}));
            if (response.status === 401) return logout();
            if (!response.ok) return window.alert(result.message || "Delete failed");
            setApplications(current => current.filter(item => item.id !== person.id));
        } catch (error) { window.alert(`Delete failed: ${error.message}`); }
        finally { setBusy(""); }
    };

    const deleteMember = async (person) => {
        if (!window.confirm(`Delete member application for ${person.fullName}?\n\nThis permanently removes the application and uploaded profile photo. This cannot be undone.`)) return;
        setBusy(`delete-m-${person.id}`);
        try {
            const response = await fetch(ENDPOINTS.ADMIN_DELETE_MEMBER(person.id), { method: "DELETE", headers: authHeaders() });
            const result = await response.json().catch(() => ({}));
            if (response.status === 401) return logout();
            if (!response.ok) return window.alert(result.message || "Delete failed");
            setMembers(current => current.filter(item => item.id !== person.id));
        } catch (error) { window.alert(`Delete failed: ${error.message}`); }
        finally { setBusy(""); }
    };

    const downloadCertificate = async (person, role) => {
        setBusy(`cert-${person.id}`);
        try { await generateCertificate(person.fullName, role, formatDate(person), person.certId, person.memberId); }
        catch (error) { window.alert(`Certificate generation failed: ${error.message}`); }
        finally { setBusy(""); }
    };
    const downloadIdCard = async (person, role) => {
        const officialId = person.memberId || person.volunteerId || (person.certId?.replace(/^SSF-VCERT-/, "SSF-VOL-") || null);
        if (!officialId) return window.alert("Official ID has not been issued yet.");
        if (!person.profilePhotoPath) return window.alert("This application has no profile photo. A new application with a profile photo is required for a photo ID card.");
        setBusy(`id-${person.id}`);
        try {
            await generateIdentityCard({ name: person.fullName, role, date: formatDate(person), officialId, certId: person.certId, photoUrl: photoUrl(person.profilePhotoPath) });
        } catch (error) {
            // Fallback to the same official document endpoint used by My Documents.
            const documentType = role === "member" ? "membership-id" : "volunteer-id";
            const fallbackUrl = `${API_BASE_URL}/api/user-document/${documentType}/${encodeURIComponent(officialId)}?account=${encodeURIComponent(person.id)}`;
            window.open(fallbackUrl, "_blank", "noopener,noreferrer");
            window.alert("ID Card PDF could not be generated in this browser. The official ID Card document has been opened instead.");
        }
        finally { setBusy(""); }
    };

    const records = useMemo(() => {
        const vols = applications.filter(a => a.status === "approved" && a.certId).map(a => ({ ...a, kind: "volunteer", label: "Volunteer Certificate", role: a.volunteerType || "volunteer" }));
        const mems = members.filter(m => m.status === "approved" && m.certId).map(m => ({ ...m, kind: "membership", label: m.certificateType || "Membership Certificate", role: "member" }));
        return [...mems, ...vols].filter(r => filter === "all" || r.kind === filter).sort((a, b) => new Date(b.certificateIssuedAt || b.approvedAt || 0) - new Date(a.certificateIssuedAt || a.approvedAt || 0));
    }, [applications, members, filter]);

    if (!token) return <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6 flex items-center justify-center"><form onSubmit={login} className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 space-y-5"><div className="text-center"><div className="inline-flex items-center gap-2 text-[#176447] font-bold uppercase tracking-widest text-xs"><FaLock /> Admin Login</div><h1 className="text-3xl font-black text-[#12345A] mt-2">Secure Portal Access</h1></div><input type="text" placeholder="Username" value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200" required /><input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200" required /><button className="w-full bg-[#12345A] text-white py-3 rounded-xl font-bold">Login</button></form></div>;

    const actionButtons = (person, role, member = false) => <div className="flex flex-wrap justify-end gap-2"><button onClick={() => downloadCertificate(person, role)} disabled={!!busy} className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-xl font-bold text-xs"><FaCertificate /> {busy === `cert-${person.id}` ? "Creating..." : member ? "Membership Certificate" : "Volunteer Certificate"}</button><button onClick={() => downloadIdCard(person, role)} disabled={!!busy} className="inline-flex items-center gap-2 bg-[#12345A] text-white hover:opacity-90 px-3 py-2 rounded-xl font-bold text-xs"><FaIdCard /> {busy === `id-${person.id}` ? "Creating..." : member ? "Member ID Card" : "Volunteer ID Card"}</button><button onClick={() => member ? deleteMember(person) : deleteVolunteer(person)} disabled={!!busy} className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-xl font-bold text-xs"><FaTrash /> {busy === `delete-${member ? "m" : "v"}-${person.id}` ? "Deleting..." : "Delete"}</button></div>;

    return <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6"><div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6"><div><div className="flex items-center gap-2 text-[#176447] font-bold uppercase tracking-widest text-xs"><FaShieldAlt /> Secure Admin Portal</div><h1 className="text-4xl font-black text-[#12345A] mt-2">Volunteer + Member Management</h1><p className="text-sm text-zinc-500 mt-2">Approve applications and issue separate official Photo ID Cards and Certificates.</p></div><button onClick={logout} className="px-5 py-3 rounded-xl bg-zinc-100 font-bold">Logout</button></header>
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden"><div className="p-8 border-b border-zinc-100"><h2 className="text-2xl font-black text-[#12345A] flex items-center gap-2"><FaUsers /> Volunteer Applications</h2></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-6 py-5">Volunteer</th><th className="px-6 py-5">Type / Photo</th><th className="px-6 py-5">Official IDs</th><th className="px-6 py-5 text-right">Action</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{applications.length === 0 ? <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-400">No volunteer applications found.</td></tr> : applications.map(app => <tr key={app.id}><td className="px-6 py-5"><p className="font-bold text-[#12345A]">{app.fullName}</p><p className="text-xs text-zinc-500">{app.email} • {app.phone}</p></td><td className="px-6 py-5"><p className="font-semibold">{app.volunteerType}</p><p className="text-xs mt-1">{app.profilePhotoPath ? <span className="text-emerald-600 font-bold"><FaCamera className="inline" /> Photo on file</span> : <span className="text-orange-600 font-bold">No photo</span>}</p></td><td className="px-6 py-5">{app.status === "approved" ? <div className="space-y-1 text-xs"><p><b>Volunteer ID:</b> {app.volunteerId || "Legacy"}</p><p><b>Certificate:</b> {app.certId}</p></div> : <span className="text-orange-600 font-bold">Pending approval</span>}</td><td className="px-6 py-5 text-right">{(app.status === "pending" || app.status === "changes_requested") ? <div className="flex flex-wrap justify-end gap-2">{app.status === "changes_requested" && <span className="w-full text-[11px] font-bold text-amber-700">Correction requested{app.reviewNote ? `: ${app.reviewNote}` : ""}</span>}<button onClick={() => approveVolunteer(app.id)} disabled={!!busy} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">{busy === `v-${app.id}` ? "Approving..." : "Approve"}</button><button onClick={() => requestCorrection(app)} disabled={!!busy} className="bg-amber-500 text-white hover:bg-amber-600 px-4 py-2 rounded-xl font-bold">{busy === `fix-v-${app.id}` ? "Sending..." : "Request Correction"}</button><button onClick={() => deleteVolunteer(app)} disabled={!!busy} className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-xl font-bold"><FaTrash /> {busy === `delete-v-${app.id}` ? "Deleting..." : "Delete"}</button></div> : actionButtons(app, app.volunteerType || "volunteer")}</td></tr>)}</tbody></table></div></section>
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden"><div className="p-8 border-b border-zinc-100"><h2 className="text-2xl font-black text-[#12345A] flex items-center gap-2"><FaIdCard /> Member Approvals & IDs</h2><p className="text-sm text-zinc-500 mt-1">Managing Committee admission decision → contribution authorization (where applicable) → Treasurer verification → Committee-authorized Member ID and certificate issuance.</p></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-6 py-5">Member</th><th className="px-6 py-5">Type / Photo</th><th className="px-6 py-5">Fee</th><th className="px-6 py-5">Official IDs</th><th className="px-6 py-5 text-right">Action</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{members.length === 0 ? <tr><td colSpan="5" className="px-6 py-10 text-center text-zinc-400">No member signups yet.</td></tr> : members.map(member => <tr key={member.id}><td className="px-6 py-5"><p className="font-bold text-[#12345A]">{member.fullName}</p><p className="text-xs text-zinc-500">{member.email} • {member.phone}</p></td><td className="px-6 py-5"><p className="font-semibold">{member.memberType}</p><p className="text-xs mt-1">{member.profilePhotoPath ? <span className="text-emerald-600 font-bold"><FaCamera className="inline" /> Photo on file</span> : <span className="text-orange-600 font-bold">No photo</span>}</p></td><td className="px-6 py-5"><p className={`text-xs font-black ${paymentTone(member)}`}>{paymentLabel(member)}</p>{member.paymentReference && <p className="text-[11px] text-zinc-500 mt-1 break-all">{member.paymentMode}: {member.paymentReference}</p>}{member.receiptNumber && <p className="mt-1 text-[11px] font-bold text-emerald-700">Receipt: {member.receiptNumber}</p>}</td><td className="px-6 py-5">{member.status === "approved" ? <div className="space-y-1 text-xs"><p><b>Member ID:</b> {member.memberId}</p><p><b>Certificate:</b> {member.certId}</p></div> : <div className="space-y-1"><span className="text-orange-600 font-bold">Pending committee approval</span>{member.memberId && <p className="text-xs font-bold text-emerald-700">Existing Member ID will be retained: {member.memberId}</p>}</div>}</td><td className="px-6 py-5 text-right">{(member.status === "pending" || member.status === "changes_requested") ? <div className="flex flex-wrap justify-end gap-2">{member.status === "changes_requested" && <span className="w-full text-[11px] font-bold text-amber-700">Correction requested{member.reviewNote ? `: ${member.reviewNote}` : ""}</span>}{!String(member.reviewNote || "").startsWith("SSF_COMMITTEE_PAYMENT_AUTHORIZED") && <button onClick={() => authorizeMemberPayment(member)} disabled={!!busy || member.status !== "pending"} className="bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold">{busy === `auth-${member.id}` ? "Saving..." : "Committee: Authorize Payment"}</button>}<button onClick={() => markPaymentReceived(member)} disabled={!!busy || String(member.paymentStatus || "").toLowerCase() === "paid" || !needsFee(member) || !String(member.reviewNote || "").startsWith("SSF_COMMITTEE_PAYMENT_AUTHORIZED")} className={`px-4 py-2 rounded-xl font-bold ${String(member.paymentStatus || "").toLowerCase() === "paid" || !needsFee(member) || !String(member.reviewNote || "").startsWith("SSF_COMMITTEE_PAYMENT_AUTHORIZED") ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-[#12345A] text-white"}`}>{busy === `pay-${member.id}` ? "Saving..." : String(member.paymentStatus || "").toLowerCase() === "paid" ? "Fee received" : "Record Verified Payment"}</button><button onClick={() => approveMember(member.id)} disabled={!!busy} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">{busy === `m-${member.id}` ? "Approving..." : "Approve + Issue"}</button><button onClick={() => requestCorrection(member, true)} disabled={!!busy} className="bg-amber-500 text-white hover:bg-amber-600 px-4 py-2 rounded-xl font-bold">{busy === `fix-m-${member.id}` ? "Sending..." : "Request Correction"}</button><button onClick={() => deleteMember(member)} disabled={!!busy} className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-xl font-bold"><FaTrash /> {busy === `delete-m-${member.id}` ? "Deleting..." : "Delete"}</button></div> : actionButtons(member, "member", true)}</td></tr>)}</tbody></table></div></section>
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden">
          <div className="p-8 border-b border-zinc-100"><h2 className="text-2xl font-black text-[#12345A]">वार्षिक सदस्य एवं पदाधिकारी सत्यापन</h2><p className="mt-1 text-sm text-zinc-500">ये अनुरोध अलग सत्यापन रजिस्टर में हैं; इनसे नया Member record या Member ID नहीं बनता।</p></div>
          <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-zinc-50 text-zinc-400 text-xs font-bold uppercase"><th className="px-5 py-4">नाम / संपर्क</th><th className="px-5 py-4">प्रकार / ID / पद</th><th className="px-5 py-4">विवरण</th><th className="px-5 py-4">स्थिति</th><th className="px-5 py-4 text-right">कार्रवाई</th></tr></thead><tbody className="divide-y divide-zinc-100 text-sm">
          {governanceVerifications.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-zinc-400">अभी कोई सत्यापन अनुरोध नहीं है।</td></tr> : governanceVerifications.map(record => <tr key={record.id}>
            <td className="px-5 py-4"><p className="font-bold text-[#12345A]">{record.fullName}</p><p className="text-xs text-zinc-500">{record.email} • {record.phone}</p><p className="text-[11px] text-zinc-400">{new Date(record.createdAt).toLocaleDateString("en-IN")}</p></td>
            <td className="px-5 py-4"><p className="font-semibold">{record.requestType === "existing_member" ? "पुराना सदस्य" : "पदाधिकारी"}</p>{record.memberId && <p className="text-xs font-bold text-emerald-700">{record.memberId}</p>}{record.designation && <p className="text-xs">{record.designation}</p>}</td>
            <td className="px-5 py-4 text-xs text-zinc-600">{record.requestedChanges || "—"}{record.termStart || record.termEnd ? <p className="mt-1">कार्यकाल: {record.termStart || "—"} से {record.termEnd || "—"}</p> : null}{record.committeeReference && <p className="mt-1 text-emerald-700">निर्णय: {record.committeeReference}</p>}{record.adminNote && <p className="mt-1 text-amber-700">नोट: {record.adminNote}</p>}</td>
            <td className="px-5 py-4"><span className={record.status === "verified" ? "font-bold text-emerald-700" : record.status === "rejected" ? "font-bold text-red-600" : "font-bold text-amber-700"}>{({pending:"लंबित",verified:"सत्यापित",changes_requested:"सुधार आवश्यक",rejected:"अस्वीकृत"})[record.status] || record.status}</span></td>
            <td className="px-5 py-4"><div className="flex flex-wrap justify-end gap-2">{record.status !== "verified" && <button disabled={!!busy} onClick={() => reviewGovernanceVerification(record,"verified")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Verify</button>}<button disabled={!!busy} onClick={() => reviewGovernanceVerification(record,"changes_requested")} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white">Correction</button><button disabled={!!busy} onClick={() => reviewGovernanceVerification(record,"rejected")} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Reject</button></div></td>
          </tr>)}
          </tbody></table></div>
        </section>
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden"><div className="p-8 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-black text-[#12345A] flex items-center gap-2"><FaCertificate /> Issued Documents</h2><p className="text-sm text-zinc-500 mt-1">Download certificate and Photo ID separately. No automatic double-download.</p></div><div className="flex gap-2">{[["all", "All"], ["volunteer", "Volunteers"], ["membership", "Members"]].map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`px-4 py-2 rounded-xl text-sm font-bold ${filter === value ? "bg-[#12345A] text-white" : "bg-zinc-100 text-zinc-700"}`}>{label}</button>)}</div></div><div className="divide-y divide-zinc-100">{records.length === 0 ? <p className="p-10 text-center text-zinc-400">No issued certificates.</p> : records.map(record => <div key={`${record.kind}-${record.id}`} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"><div><p className="font-bold text-[#12345A]">{record.fullName}</p><p className="text-xs text-zinc-500">{record.label} • {record.certId}</p><p className="text-xs text-zinc-500 mt-1">{record.memberId || record.volunteerId || "Official ID available after approval"}</p></div><div className="flex flex-wrap justify-end gap-2 w-full lg:w-auto"><button type="button" onClick={() => downloadCertificate(record, record.role)} disabled={!!busy} className="inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap"><FaCertificate /> {record.kind === "membership" ? "Membership Certificate PDF" : "Volunteer Certificate PDF"}</button><button type="button" onClick={() => downloadIdCard(record, record.role)} disabled={!!busy} className="inline-flex items-center justify-center gap-2 bg-[#12345A] text-white hover:opacity-90 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap"><FaIdCard /> {record.kind === "membership" ? "Member ID Card PDF" : "Volunteer ID Card PDF"}</button><button type="button" onClick={() => record.kind === "membership" ? deleteMember(record) : deleteVolunteer(record)} disabled={!!busy} className="inline-flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap"><FaTrash /> Delete</button></div></div>)}</div></section>
    </div></div>;
}
