```javascript
import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaCertificate, FaDownload, FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

export default function VerificationPage() {
    const { certId } = useParams();
    const [status, setStatus] = useState("loading"); // loading, valid, invalid, error
    const [data, setData] = useState(null);

    useEffect(() => {
        const verifyCert = async () => {
            setStatus("loading");
            try {
                const response = await fetch(ENDPOINTS.VERIFY_CERT(certId));
                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.valid) {
                        setData(responseData);
                        setStatus("valid");
                    } else {
                        setData(null);
                        setStatus("invalid");
                    }
                } else {
                    setResult(null);
                }
            } catch (error) {
                console.error("Verification error:", error);
                setResult(null);
            } finally {
                setLoading(false);
            }
        };

        if (certId) verifyCert();
    }, [certId]);

    return (
        <div className="min-h-screen bg-[#001529] text-white pt-48 pb-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>

            <div className="max-w-xl mx-auto relative z-10 text-center">

                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="w-24 h-24 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <h1 className="text-2xl font-bold tracking-widest text-zinc-400 animate-pulse">CRYPTOGRAPHIC VERIFICATION IN PROGRESS...</h1>
                    </motion.div>
                ) : result ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3rem] p-10 md:p-16 text-[#002344] shadow-2xl space-y-8 border-t-[1rem] border-[#25D366]"
                    >
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner">
                            <FaCheckCircle />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-black">Official Verification</h1>
                            <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm">Status: Valid Certificate</p>
                        </div>

                        <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 text-left space-y-4">
                            <div className="flex items-center gap-4 border-b border-zinc-200 pb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm"><FaCertificate className="text-orange-500" /></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Certificate ID</p>
                                    <p className="font-black text-lg">{result.certId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 border-b border-zinc-200 pb-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm"><FaIdCard className="text-blue-500" /></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Issued To</p>
                                    <p className="font-black text-lg">{result.fullName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm"><FaBuilding className="text-emerald-500" /></div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Issuing Authority</p>
                                    <p className="font-black text-lg">Swastik Srijan Foundation</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-zinc-400 font-medium italic">
                            This document is verified via SSF Ledger v2.0. Issued on {new Date(result.approvedAt).toLocaleDateString()}.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[3rem] p-10 md:p-16 text-[#002344] shadow-2xl space-y-8 border-t-[1rem] border-red-500"
                    >
                        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-5xl mx-auto bg-inner">
                            <FaTimesCircle />
                        </div>
                        <h1 className="text-3xl font-black">Verification Failed</h1>
                        <p className="text-zinc-500 leading-relaxed font-medium">
                            No active certificate matches the ID: <span className="text-red-500 font-bold">{certId}</span>. <br />
                            Please contact Swastik Srijan Foundation for assistance.
                        </p>
                    </motion.div>
                )}

                <div className="mt-12 flex items-center justify-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                    <FaShieldAlt /> SSF Security Layer • Proudly Swadeshi
                </div>
            </div>
        </div>
    );
}
