import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaEye, FaIdCard, FaWhatsapp, FaArrowLeft, FaShieldAlt, FaDownload } from "react-icons/fa";
import { generateCertificate } from "../utils/generateCertificate";

import { ENDPOINTS, API_BASE_URL } from "../config/api";

export default function AdminPortal() {
    const [applications, setApplications] = useState([]);
    const [selectedAadhar, setSelectedAadhar] = useState(null);
    const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const response = await fetch(ENDPOINTS.ADMIN_VOLUNTEERS);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();

            setApplications(data);

            const pending = data.filter(a => a.status === 'pending').length;
            const approved = data.filter(a => a.status === 'approved').length;
            setStats({ pending, approved, total: data.length });
        } catch (error) {
            console.error('Error loading applications:', error);
            // Fallback to empty if fails
            setApplications([]);
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm("Are you sure you want to Approve this volunteer and issue a certificate?")) {
            try {
                const response = await fetch(ENDPOINTS.ADMIN_APPROVE(id), { method: 'POST' });
                if (response.ok) {
                    loadApplications();
                    alert("Application Approved! Certificate ID generated.");
                } else {
                    alert("Failed to approve");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Are you sure you want to Reject and delete this application?")) {
            // For now we don't have a delete route, but if we did:
            // await fetch(..., { method: 'DELETE' });
            alert("Reject feature not yet implemented in backend");
        }
    };

    const handleDownloadCert = async (app) => {
        const today = new Date().toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        await generateCertificate(app.fullName, app.volunteerType, today, app.certId);
    };

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#FF6600] font-bold uppercase tracking-widest text-xs">
                            <FaShieldAlt /> Secure Admin Portal
                        </div>
                        <h1 className="text-4xl font-black text-[#002344]">Volunteer Approval Dashboard</h1>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
                            <p className="text-xl font-bold text-[#FF6600]">{stats.pending}</p>
                            <p className="text-[10px] font-bold text-orange-800 uppercase">Pending</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                            <p className="text-xl font-bold text-emerald-600">{stats.approved}</p>
                            <p className="text-[10px] font-bold text-emerald-800 uppercase">Approved</p>
                        </div>
                        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center">
                            <p className="text-xl font-bold text-zinc-500">{stats.total}</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Total</p>
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
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
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-zinc-400 font-medium italic">
                                            No pending applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-zinc-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-[#002344] text-base">{app.fullName}</div>
                                                <div className="text-zinc-500">{app.email}</div>
                                                <div className="text-zinc-400 text-xs mt-1">{app.phone}</div>
                                            </td>
                                            <td className="px-8 py-6 capitalize font-semibold text-zinc-600">
                                                {app.volunteerType}
                                            </td>
                                            <td className="px-8 py-6 text-zinc-500 font-medium">
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={() => {
                                                        const fullUrl = app.idDocumentUrl.startsWith('http')
                                                            ? app.idDocumentUrl
                                                            : `${API_BASE_URL}${app.idDocumentUrl}`;
                                                        setSelectedAadhar(fullUrl);
                                                    }}
                                                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <FaEye /> View Aadhar
                                                </button>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {app.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleApprove(app.id)}
                                                            className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(app.id)}
                                                            className="text-zinc-400 hover:text-red-500 font-bold p-2 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <FaTimesCircle size={20} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-4">
                                                        <div className="flex items-center gap-2 text-emerald-600 font-bold">
                                                            <FaCheckCircle /> ID: {app.certId}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDownloadCert(app)}
                                                            className="bg-zinc-100 text-zinc-600 p-2 rounded-lg hover:bg-[#002344] hover:text-white transition-all"
                                                            title="Download Certificate"
                                                        >
                                                            <FaDownload />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Aadhar Viewer Modal */}
                <AnimatePresence>
                    {selectedAadhar && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedAadhar(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative bg-white p-4 rounded-3xl shadow-2xl max-w-2xl w-full"
                            >
                                <button
                                    onClick={() => setSelectedAadhar(null)}
                                    className="absolute -top-12 right-0 text-white font-bold flex items-center gap-2 hover:text-orange-400"
                                >
                                    Close Viewer <FaTimesCircle />
                                </button>
                                <img src={selectedAadhar} alt="Aadhar Card" className="w-full rounded-2xl shadow-inner border border-zinc-100" />
                                <div className="mt-4 text-center text-[10px] text-zinc-400 uppercase font-black tracking-widest">
                                    🔒 Confidential Document - Admin Review Only
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
