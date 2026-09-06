import { useEffect, useMemo, useState } from "react";
import { FaUsers, FaShieldAlt, FaLock, FaIdCard, FaCertificate, FaCamera, FaTrash } from "react-icons/fa";
import { generateCertificate, generateIdentityCard } from "../utils/generateCertificate";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

const TOKEN_KEY = "ssf_admin_token";
const photoUrl = (path) => {
    if (!path) return null;
    return /^https?:\/\//i.test(path) ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
const formatDate = (person) => new Date(person.certificateIssuedAt || person.approvedAt || person.submittedAt || new Date()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function AdminPortalV2() {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const [applications, setApplications] = useState([]);
    const [members, setMembers] = useState([]);
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
        const response = await fetch(ENDPOINTS.ADMIN_MEMBERS, { headers: authHeaders(authToken) });
        if (response.status === 401) return logout();
        const data = await response.json().catch(() => []);
        setMembers(response.ok && Array.isArray(data) ? data : []);
    };
    useEffect(() => { if (token) { loadApplications(token); loadMembers(token); } }, [token]);

    const login = async (event) => {
        event.preventDefault(); setLoginError("");
        try {
            const response = await fetch(ENDPOINTS.ADMIN_LOGIN, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginForm) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Login failed");
            localStorage.setItem(TOKEN_KEY, result.token); setToken(result.token); setLoginForm({ username: "", password: "" });
        } catch (error) { setLoginError(error.message); }
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
        if (!window.confirm("Approve this member and issue the official Member ID + Membership Certificate?")) return;
        setBusy(`m-${id}`);
        try {
            const response = await fetch(ENDPOINTS.ADMIN_MEMBER_APPROVE(id), { method: "POST", headers: authHeaders() });
            const result = await response.json().catch(() => ({}));
            if (response.status === 401) return logout();
            if (!response.ok) return window.alert(result.message || "Approval failed");
            await loadMembers();
            window.alert(`Member approved.\nMember ID: ${result.memberId || "Issued"}\nCertificate ID: ${result.certId || "Issued"}${result.warning ? `\n${result.warning}` : ""}`);
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
        try { await generateIdentityCard({ name: person.fullName, role, date: formatDate(person), officialId, certId: person.certId, photoUrl: photoUrl(person.profilePhotoPath) }); }
        catch (error) { window.alert(`ID card generation failed: ${error.message}`); }
        finally { setBusy(""); }
    };

    const records = useMemo(() => {
        const vols = applications.filter(a => a.status === "approved" && a.certId).map(a => ({ ...a, kind: "volunteer", label: "Volunteer Certificate", role: a.volunteerType || "volunteer" }));
        const mems = members.filter(m => m.status === "approved" && m.certId).map(m => ({ ...m, kind: "membership", label: m.certificateType || "Membership Certificate", role: "member" }));
        return [...mems, ...vols].filter(r => filter === "all" || r.kind === filter).sort((a, b) => new Date(b.certificateIssuedAt || b.approvedAt || 0) - new Date(a.certificateIssuedAt || a.approvedAt || 0));
    }, [applications, members, filter]);

    if (!token) return <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6 flex items-center justify-center"><form onSubmit={login} className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 space-y-5"><div className="text-center"><div className="inline-flex items-center gap-2 text-[#FF6600] font-bold uppercase tracking-widest text-xs"><FaLock /> Admin Login</div><h1 className="text-3xl font-black text-[#002344] mt-2">Secure Portal Access</h1></div><input type="text" placeholder="Username" value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200" required /><input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200" required /><button className="w-full bg-[#002344] text-white py-3 rounded-xl font-bold">Login</button></form></div>;

    const actionButtons = (person, role, member = false) => <div className="flex flex-wrap justify-end gap-2"><button onClick={() => downloadCertificate(person, role)} disabled={!!busy} className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-xl font-bold text-xs"><FaCertificate /> {busy === `cert-${person.id}` ? "Creating..." : member ? "Membership Certificate" : "Volunteer Certificate"}</button><button onClick={() => downloadIdCard(person, role)} disabled={!!busy} className="inline-flex items-center gap-2 bg-[#002344] text-white hover:opacity-90 px-3 py-2 rounded-xl font-bold text-xs"><FaIdCard /> {busy === `id-${person.id}` ? "Creating..." : member ? "Member ID Card" : "Volunteer ID Card"}</button><button onClick={() => member ? deleteMember(person) : deleteVolunteer(person)} disabled={!!busy} className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-xl font-bold text-xs"><FaTrash /> {busy === `delete-${member ? "m" : "v"}-${person.id}` ? "Deleting..." : "Delete"}</button></div>;

    return <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6"><div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6"><div><div className="flex items-center gap-2 text-[#FF6600] font-bold uppercase tracking-widest text-xs"><FaShieldAlt /> Secure Admin Portal</div><h1 className="text-4xl font-black text-[#002344] mt-2">Volunteer + Member Management</h1><p className="text-sm text-zinc-500 mt-2">Approve applications and issue separate official Photo ID Cards and Certificates.</p></div><button onClick={logout} className="px-5 py-3 rounded-xl bg-zinc-100 font-bold">Logout</button></header>
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden"><div className="p-8 border-b border-zinc-100"><h2 className="text-2xl font-black text-[#002344] flex items-center gap-2"><FaUsers /> Volunteer Applications</h2></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-6 py-5">Volunteer</th><th className="px-6 py-5">Type / Photo</th><th className="px-6 py-5">Official IDs</th><th className="px-6 py-5 text-right">Action</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{applications.length === 0 ? <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-400">No volunteer applications found.</td></tr> : applications.map(app => <tr key={app.id}><td className="px-6 py-5"><p className="font-bold text-[#002344]">{app.fullName}</p><p className="text-xs text-zinc-500">{app.email} • {app.phone}</p></td><td className="px-6 py-5"><p className="font-semibold">{app.volunteerType}</p><p className="text-xs mt-1">{app.profilePhotoPath ? <span className="text-emerald-600 font-bold"><FaCamera className="inline" /> Photo on file</span> : <span className="text-orange-600 font-bold">No photo</span>}</p></td><td className="px-6 py-5">{app.status === "approved" ? <div className="space-y-1 text-xs"><p><b>Volunteer ID:</b> {app.volunteerId || "Legacy"}</p><p><b>Certificate:</b> {app.certId}</p></div> : <span className="text-orange-600 font-bold">Pending approval</span>}</td><td className="px-6 py-5 text-right">{app.status === "pending" ? <div className="flex flex-wrap justify-end gap-2"><button onClick={() => approveVolunteer(app.id)} disabled={!!busy} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">{busy === `v-${app.id}` ? "Approving..." : "Approve"}</button><button onClick={() => deleteVolunteer(app)} disabled={!!busy} className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-xl font-bold"><FaTrash /> {busy === `delete-v-${app.id}` ? "Deleting..." : "Delete"}</button></div> : actionButtons(app, app.volunteerType || "volunteer")}</td></tr>)}</tbody></table></div></section>
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden"><div className="p-8 border-b border-zinc-100"><h2 className="text-2xl font-black text-[#002344] flex items-center gap-2"><FaIdCard /> Member Approvals & IDs</h2><p className="text-sm text-zinc-500 mt-1">Approval issues the permanent Member ID and Membership Certificate ID.</p></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-6 py-5">Member</th><th className="px-6 py-5">Type / Photo</th><th className="px-6 py-5">Official IDs</th><th className="px-6 py-5 text-right">Action</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{members.length === 0 ? <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-400">No member signups yet.</td></tr> : members.map(member => <tr key={member.id}><td className="px-6 py-5"><p className="font-bold text-[#002344]">{member.fullName}</p><p className="text-xs text-zinc-500">{member.email} • {member.phone}</p></td><td className="px-6 py-5"><p className="font-semibold">{member.memberType}</p><p className="text-xs mt-1">{member.profilePhotoPath ? <span className="text-emerald-600 font-bold"><FaCamera className="inline" /> Photo on file</span> : <span className="text-orange-600 font-bold">No photo</span>}</p></td><td className="px-6 py-5">{member.status === "approved" ? <div className="space-y-1 text-xs"><p><b>Member ID:</b> {member.memberId}</p><p><b>Certificate:</b> {member.certId}</p></div> : <span className="text-orange-600 font-bold">Pending approval</span>}</td><td className="px-6 py-5 text-right">{member.status === "pending" ? <div className="flex flex-wrap justify-end gap-2"><button onClick={() => approveMember(member.id)} disabled={!!busy} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">{busy === `m-${member.id}` ? "Approving..." : "Approve + Issue"}</button><button onClick={() => deleteMember(member)} disabled={!!busy} className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-xl font-bold"><FaTrash /> {busy === `delete-m-${member.id}` ? "Deleting..." : "Delete"}</button></div> : actionButtons(member, "member", true)}</td></tr>)}</tbody></table></div></section>
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden"><div className="p-8 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-black text-[#002344] flex items-center gap-2"><FaCertificate /> Issued Documents</h2><p className="text-sm text-zinc-500 mt-1">Download certificate and Photo ID separately. No automatic double-download.</p></div><div className="flex gap-2">{[["all", "All"], ["volunteer", "Volunteers"], ["membership", "Members"]].map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`px-4 py-2 rounded-xl text-sm font-bold ${filter === value ? "bg-[#002344] text-white" : "bg-zinc-100 text-zinc-700"}`}>{label}</button>)}</div></div><div className="divide-y divide-zinc-100">{records.length === 0 ? <p className="p-10 text-center text-zinc-400">No issued certificates.</p> : records.map(record => <div key={`${record.kind}-${record.id}`} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"><div><p className="font-bold text-[#002344]">{record.fullName}</p><p className="text-xs text-zinc-500">{record.label} • {record.certId}</p><p className="text-xs text-zinc-500 mt-1">{record.memberId || record.volunteerId || "Official ID available after approval"}</p></div>{actionButtons(record, record.role, record.kind === "membership")}</div>)}</div></section>
    </div></div>;
}
