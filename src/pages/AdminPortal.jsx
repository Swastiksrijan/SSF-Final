import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaEye, FaShieldAlt, FaDownload, FaLock } from "react-icons/fa";
import { generateCertificate } from "../utils/generateCertificate";
import { ENDPOINTS, API_BASE_URL } from "../config/api";

const TOKEN_KEY = "ssf_admin_token";

export default function AdminPortal() {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [loginError, setLoginError] = useState("");

    const [applications, setApplications] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedAadhar, setSelectedAadhar] = useState(null);
    const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });

    useEffect(() => {
        if (token) {
            loadApplications(token);
            loadMembers(token);
        }
    }, [token]);

    const authHeaders = (authToken) => ({
        Authorization: `Bearer ${authToken}`
    });

    const loadApplications = async (authToken) => {
        try {
            const response = await fetch(ENDPOINTS.ADMIN_VOLUNTEERS, { headers: authHeaders(authToken) });
            if (response.status === 401) {
                handleLogout();
                return;
            }
            if (!response.ok) throw new Error("Failed to fetch volunteers");
            const data = await response.json();

            setApplications(data);
            const pending = data.filter(a => a.status === "pending").length;
            const approved = data.filter(a => a.status === "approved").length;
            setStats({ pending, approved, total: data.length });
        } catch (error) {
            console.error("Error loading applications:", error);
            setApplications([]);
        }
    };

    const loadMembers = async (authToken) => {
        try {
            const response = await fetch(ENDPOINTS.ADMIN_MEMBERS, { headers: authHeaders(authToken) });
            if (!response.ok) throw new Error("Failed to fetch members");
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error("Error loading members:", error);
            setMembers([]);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");

        try {
            const response = await fetch(ENDPOINTS.ADMIN_LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginForm)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Login failed");

            localStorage.setItem(TOKEN_KEY, result.token);
            setToken(result.token);
            setLoginForm({ username: "", password: "" });
        } catch (error) {
            setLoginError(error.message || "Login failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setApplications([]);
        setMembers([]);
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Approve this volunteer and issue certificate?")) return;

        try {
            const response = await fetch(ENDPOINTS.ADMIN_APPROVE(id), {
                method: "POST",
                headers: authHeaders(token)
            });

            if (response.status === 401) {
                handleLogout();
                return;
            }

            if (!response.ok) {
                alert("Failed to approve volunteer");
                return;
            }

            const result = await response.json();
            loadApplications(token);
            alert(result.emailSent
                ? "Application approved and email sent."
                : `Application approved but email failed: ${result.warning || "Check backend logs"}`);
        } catch (error) {
            console.error(error);
            alert("Error approving volunteer.");
        }
    };

    const handleDownloadCert = async (app) => {
        const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        await generateCertificate(app.fullName, app.volunteerType, today, app.certId);
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6 flex items-center justify-center">
                <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 space-y-5">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 text-[#FF6600] font-bold uppercase tracking-widest text-xs">
                            <FaLock /> Admin Login
                        </div>
                        <h1 className="text-3xl font-black text-[#002344]">Secure Portal Access</h1>
                    </div>

                    <input
                        type="text"
                        placeholder="Username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200"
                        required
                    />

                    {loginError && <p className="text-red-500 text-sm font-semibold">{loginError}</p>}

                    <button type="submit" className="w-full bg-[#002344] text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#FF6600] font-bold uppercase tracking-widest text-xs">
                            <FaShieldAlt /> Secure Admin Portal
                        </div>
                        <h1 className="text-4xl font-black text-[#002344]">Volunteer + Member Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-center">
                                <p className="text-lg font-bold text-[#FF6600]">{stats.pending}</p>
                                <p className="text-[10px] font-bold text-orange-800 uppercase">Pending</p>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                                <p className="text-lg font-bold text-emerald-600">{stats.approved}</p>
                                <p className="text-[10px] font-bold text-emerald-800 uppercase">Approved</p>
                            </div>
                            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                                <p className="text-lg font-bold text-zinc-500">{stats.total}</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase">Total</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-bold hover:bg-zinc-200">Logout</button>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                                    <th className="px-8 py-6">Volunteer Details</th>
                                    <th className="px-8 py-6">Type</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Identity</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 text-sm">
                                {applications.length === 0 ? (
                                    <tr><td colSpan="5" className="px-8 py-10 text-center text-zinc-400">No volunteer applications found.</td></tr>
                                ) : applications.map((app) => (
                                    <tr key={app.id} className="group hover:bg-zinc-50/70">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-[#002344]">{app.fullName}</p>
                                            <p className="text-zinc-500 text-xs">{app.email}</p>
                                            <p className="text-zinc-500 text-xs">{app.phone}</p>
                                        </td>
                                        <td className="px-8 py-6 text-zinc-600 font-semibold">{app.volunteerType}</td>
                                        <td className="px-8 py-6 text-zinc-500">{new Date(app.submittedAt).toLocaleDateString("en-IN")}</td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => {
                                                    const fullUrl = app.idDocumentUrl.startsWith("http") ? app.idDocumentUrl : `${API_BASE_URL}${app.idDocumentUrl}`;
                                                    setSelectedAadhar(fullUrl);
                                                }}
                                                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                <FaEye /> View ID
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {app.status === "pending" ? (
                                                <button onClick={() => handleApprove(app.id)} className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-all">Approve</button>
                                            ) : (
                                                <div className="flex items-center justify-end gap-4">
                                                    <div className="flex items-center gap-2 text-emerald-600 font-bold"><FaCheckCircle /> ID: {app.certId}</div>
                                                    <button onClick={() => handleDownloadCert(app)} className="bg-zinc-100 text-zinc-600 p-2 rounded-lg hover:bg-[#002344] hover:text-white transition-all" title="Download Certificate">
                                                        <FaDownload />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 p-8">
                    <h2 className="text-2xl font-black text-[#002344] mb-4 flex items-center gap-2"><FaUsers /> Member Signups</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-zinc-400 font-bold text-xs uppercase tracking-widest border-b border-zinc-100">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {members.length === 0 ? (
                                    <tr><td colSpan="5" className="px-4 py-8 text-center text-zinc-400">No member signups yet.</td></tr>
                                ) : members.map((m) => (
                                    <tr key={m.id}>
                                        <td className="px-4 py-3 font-semibold text-[#002344]">{m.fullName}</td>
                                        <td className="px-4 py-3 text-zinc-600">{m.email}</td>
                                        <td className="px-4 py-3 text-zinc-600">{m.phone}</td>
                                        <td className="px-4 py-3 text-zinc-600">{m.memberType}</td>
                                        <td className="px-4 py-3 text-orange-600 font-bold uppercase text-xs">{m.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedAadhar && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAadhar(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white p-4 rounded-3xl shadow-2xl max-w-2xl w-full">
                                <button onClick={() => setSelectedAadhar(null)} className="absolute -top-12 right-0 text-white font-bold flex items-center gap-2 hover:text-orange-400">Close Viewer <FaTimesCircle /></button>
                                <img src={selectedAadhar} alt="ID Document" className="w-full rounded-2xl shadow-inner border border-zinc-100" />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
