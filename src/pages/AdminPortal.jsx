import { useState, useEffect, useMemo } from "react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaShieldAlt, FaDownload, FaLock, FaIdCard, FaCertificate } from "react-icons/fa";
import { generateCertificate } from "../utils/generateCertificate";
import { ENDPOINTS } from "../config/api";

const TOKEN_KEY = "ssf_admin_token";

export default function AdminPortal() {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [loginError, setLoginError] = useState("");
    const [applications, setApplications] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [certificateFilter, setCertificateFilter] = useState("all");
    const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0, pendingMembers: 0, approvedMembers: 0 });

    useEffect(() => {
        if (token) {
            loadApplications(token);
            loadMembers(token);
        }
    }, [token]);

    const authHeaders = (authToken) => ({ Authorization: `Bearer ${authToken}` });

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setApplications([]);
        setMembers([]);
    };

    const loadApplications = async (authToken) => {
        try {
            const response = await fetch(ENDPOINTS.ADMIN_VOLUNTEERS, { headers: authHeaders(authToken) });
            if (response.status === 401) return handleLogout();
            const data = await response.json();
            setApplications(response.ok ? data : []);
            if (response.ok) {
                setStats(prev => ({ ...prev, pending: data.filter(a => a.status === "pending").length, approved: data.filter(a => a.status === "approved").length, total: data.length }));
            }
        } catch (error) { console.error("Error loading applications:", error); setApplications([]); }
    };

    const loadMembers = async (authToken) => {
        try {
            const response = await fetch(ENDPOINTS.ADMIN_MEMBERS, { headers: authHeaders(authToken) });
            if (response.status === 401) return handleLogout();
            const data = await response.json();
            setMembers(response.ok ? data : []);
            if (response.ok) setStats(prev => ({ ...prev, pendingMembers: data.filter(m => m.status === "pending").length, approvedMembers: data.filter(m => m.status === "approved").length }));
        } catch (error) { console.error("Error loading members:", error); setMembers([]); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        try {
            const response = await fetch(ENDPOINTS.ADMIN_LOGIN, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginForm) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Login failed");
            localStorage.setItem(TOKEN_KEY, result.token);
            setToken(result.token);
            setLoginForm({ username: "", password: "" });
        } catch (error) { setLoginError(error.message || "Login failed"); }
    };

    const handleApproveVolunteer = async (id) => {
        if (!window.confirm("Approve this volunteer and issue the official certificate?")) return;
        try {
            const response = await fetch(ENDPOINTS.ADMIN_APPROVE(id), { method: "POST", headers: authHeaders(token) });
            const result = await response.json();
            if (response.status === 401) return handleLogout();
            if (!response.ok) return window.alert(result.message || "Failed to approve volunteer");
            await loadApplications(token);
            window.alert(result.emailSent ? `Volunteer approved. Certificate ID: ${result.certId}` : `Approved. Certificate ID: ${result.certId}. ${result.warning || "Email failed."}`);
        } catch (error) { console.error(error); window.alert("Error approving volunteer."); }
    };

    const handleApproveMember = async (id) => {
        if (!window.confirm("Approve this member and issue Member ID + Membership Certificate?")) return;
        try {
            const response = await fetch(ENDPOINTS.ADMIN_MEMBER_APPROVE(id), { method: "POST", headers: authHeaders(token) });
            const result = await response.json();
            if (response.status === 401) return handleLogout();
            if (!response.ok) return window.alert(result.message || "Failed to approve member");
            await loadMembers(token);
            window.alert(result.emailSent ? `Member approved.\nMember ID: ${result.memberId}\nCertificate ID: ${result.certId}` : `Member approved.\nMember ID: ${result.memberId}\nCertificate ID: ${result.certId}\n${result.warning || "Email failed."}`);
        } catch (error) { console.error(error); window.alert("Error approving member."); }
    };

    const downloadCertificate = async (person, role = "member") => {
        const dateValue = person.certificateIssuedAt || person.approvedAt || person.submittedAt || new Date();
        const date = new Date(dateValue).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        await generateCertificate(person.fullName, role, date, person.certId, person.memberId);
    };

    const certificateRecords = useMemo(() => {
        const memberRecords = members
            .filter(member => member.status === "approved" && member.certId)
            .map(member => ({ ...member, certificateCategory: "Membership", certificateLabel: member.certificateType || "Membership Certificate", role: "member" }));
        const volunteerRecords = applications
            .filter(app => app.status === "approved" && app.certId)
            .map(app => ({ ...app, certificateCategory: "Volunteer", certificateLabel: "Volunteer Certificate", role: app.volunteerType || "volunteer" }));
        const all = [...memberRecords, ...volunteerRecords].sort((a, b) => new Date(b.certificateIssuedAt || b.approvedAt || b.submittedAt || 0) - new Date(a.certificateIssuedAt || a.approvedAt || a.submittedAt || 0));
        return certificateFilter === "all" ? all : all.filter(record => record.certificateCategory.toLowerCase() === certificateFilter);
    }, [members, applications, certificateFilter]);

    const certificateCounts = useMemo(() => ({
        all: members.filter(m => m.status === "approved" && m.certId).length + applications.filter(a => a.status === "approved" && a.certId).length,
        membership: members.filter(m => m.status === "approved" && m.certId).length,
        volunteer: applications.filter(a => a.status === "approved" && a.certId).length
    }), [members, applications]);

    if (!token) {
        return <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6 flex items-center justify-center"><form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 space-y-5"><div className="text-center space-y-2"><div className="inline-flex items-center gap-2 text-[#FF6600] font-bold uppercase tracking-widest text-xs"><FaLock /> Admin Login</div><h1 className="text-3xl font-black text-[#002344]">Secure Portal Access</h1></div><input type="text" placeholder="Username" value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200" required /><input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200" required />{loginError && <p className="text-red-500 text-sm font-semibold">{loginError}</p>}<button type="submit" className="w-full bg-[#002344] text-white py-3 rounded-xl font-bold">Login</button></form></div>;
    }

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6"><div><div className="flex items-center gap-2 text-[#FF6600] font-bold uppercase tracking-widest text-xs"><FaShieldAlt /> Secure Admin Portal</div><h1 className="text-4xl font-black text-[#002344] mt-2">Volunteer + Member Management</h1><p className="text-sm text-zinc-500 mt-2">Approve applications, issue official IDs and manage certificates.</p></div><div className="flex flex-wrap items-center gap-2"><span className="px-3 py-2 rounded-xl bg-orange-50 text-orange-700 font-bold text-xs">Vol. Pending {stats.pending}</span><span className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">Vol. Approved {stats.approved}</span><span className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs">Members Pending {stats.pendingMembers}</span><span className="px-3 py-2 rounded-xl bg-violet-50 text-violet-700 font-bold text-xs">Members Approved {stats.approvedMembers}</span><button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-zinc-100 font-bold">Logout</button></div></header>

                <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden"><div className="p-8 border-b border-zinc-100"><h2 className="text-2xl font-black text-[#002344] flex items-center gap-2"><FaUsers /> Volunteer Applications</h2></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-6 py-5">Volunteer</th><th className="px-6 py-5">Type</th><th className="px-6 py-5">Status / Certificate</th><th className="px-6 py-5 text-right">Action</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{applications.length === 0 ? <tr><td colSpan="4" className="px-6 py-10 text-center text-zinc-400">No volunteer applications found.</td></tr> : applications.map(app => <tr key={app.id}><td className="px-6 py-5"><p className="font-bold text-[#002344]">{app.fullName}</p><p className="text-xs text-zinc-500">{app.email} • {app.phone}</p></td><td className="px-6 py-5 font-semibold">{app.volunteerType}</td><td className="px-6 py-5">{app.status === "approved" ? <span className="text-emerald-700 font-bold"><FaCheckCircle className="inline mr-1" />{app.certId}</span> : <span className="text-orange-600 font-bold">Pending</span>}</td><td className="px-6 py-5 text-right">{app.status === "pending" ? <button onClick={() => handleApproveVolunteer(app.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">Approve</button> : <button onClick={() => downloadCertificate(app, app.volunteerType || "volunteer")} className="bg-zinc-100 px-3 py-2 rounded-xl font-bold" title="Download certificate"><FaDownload /></button>}</td></tr>)}</tbody></table></div></section>

                <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden"><div className="p-8 border-b border-zinc-100"><h2 className="text-2xl font-black text-[#002344] flex items-center gap-2"><FaIdCard /> Member Approvals & IDs</h2><p className="text-sm text-zinc-500 mt-1">Approval issues the permanent Member ID and Membership Certificate ID.</p></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-6 py-5">Member</th><th className="px-6 py-5">Type</th><th className="px-6 py-5">Member ID</th><th className="px-6 py-5">Certificate</th><th className="px-6 py-5 text-right">Action</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{members.length === 0 ? <tr><td colSpan="5" className="px-6 py-10 text-center text-zinc-400">No member signups yet.</td></tr> : members.map(member => <tr key={member.id}><td className="px-6 py-5"><p className="font-bold text-[#002344]">{member.fullName}</p><p className="text-xs text-zinc-500">{member.email} • {member.phone}</p></td><td className="px-6 py-5">{member.memberType}</td><td className="px-6 py-5">{member.memberId ? <span className="font-black text-[#002344]">{member.memberId}</span> : <span className="text-orange-600 font-bold">Pending</span>}</td><td className="px-6 py-5">{member.certId ? <span className="font-bold text-emerald-700">{member.certId}</span> : <span className="text-zinc-400">Not issued</span>}</td><td className="px-6 py-5 text-right">{member.status === "pending" ? <button onClick={() => handleApproveMember(member.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">Approve + Issue</button> : <button onClick={() => downloadCertificate(member, "member")} className="inline-flex items-center gap-2 bg-zinc-100 px-3 py-2 rounded-xl font-bold" title="Download membership certificate"><FaCertificate /><FaDownload /></button>}</td></tr>)}</tbody></table></div></section>

                <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden">
                    <div className="p-8 border-b border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div><h2 className="text-2xl font-black text-[#002344] flex items-center gap-2"><FaCertificate /> Certificate Management</h2><p className="text-sm text-zinc-500 mt-1">Central view of all issued membership and volunteer certificates.</p></div>
                        <div className="flex flex-wrap gap-2">
                            {[['all', 'All', certificateCounts.all], ['membership', 'Membership', certificateCounts.membership], ['volunteer', 'Volunteer', certificateCounts.volunteer]].map(([value, label, count]) => <button key={value} onClick={() => setCertificateFilter(value)} className={`px-4 py-2 rounded-xl text-sm font-bold ${certificateFilter === value ? 'bg-[#002344] text-white' : 'bg-zinc-100 text-zinc-700'}`}>{label} ({count})</button>)}
                        </div>
                    </div>
                    <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-6 py-5">Recipient</th><th className="px-6 py-5">Certificate Type</th><th className="px-6 py-5">Official ID</th><th className="px-6 py-5">Issued</th><th className="px-6 py-5 text-right">PDF</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{certificateRecords.length === 0 ? <tr><td colSpan="5" className="px-6 py-10 text-center text-zinc-400">No issued certificates in this category.</td></tr> : certificateRecords.map(record => <tr key={`${record.certificateCategory}-${record.id}`}><td className="px-6 py-5"><p className="font-bold text-[#002344]">{record.fullName}</p><p className="text-xs text-zinc-500">{record.email}</p></td><td className="px-6 py-5"><span className="font-semibold">{record.certificateLabel}</span><span className="block text-xs text-zinc-400 mt-1">{record.certificateCategory}</span></td><td className="px-6 py-5"><span className="font-black text-emerald-700">{record.certId}</span>{record.memberId && <span className="block text-xs text-zinc-500 mt-1">Member: {record.memberId}</span>}</td><td className="px-6 py-5 text-zinc-600">{new Date(record.certificateIssuedAt || record.approvedAt || record.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td><td className="px-6 py-5 text-right"><button onClick={() => downloadCertificate(record, record.role)} className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-xl font-bold" title="Download official certificate"><FaDownload /> PDF</button></td></tr>)}</tbody></table></div>
                </section>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-900"><strong>Certificate roadmap:</strong> Membership and Volunteer certificates are connected. Internship, Training/Program and Participation certificates should be connected to their respective application/approval workflows before they are issued from this portal.</div>

                {selectedDocument && <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6" onClick={() => setSelectedDocument(null)}><div className="bg-white rounded-3xl p-4 max-w-2xl w-full" onClick={e => e.stopPropagation()}><button onClick={() => setSelectedDocument(null)} className="mb-3 font-bold"><FaTimesCircle /> Close</button><img src={selectedDocument} alt="Identity document" className="w-full rounded-2xl" /></div></div>}
            </div>
        </div>
    );
}
