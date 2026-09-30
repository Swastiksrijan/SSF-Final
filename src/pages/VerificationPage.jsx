import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaCertificate, FaDownload, FaCheckCircle, FaTimesCircle, FaShieldAlt, FaIdCard, FaBuilding } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";
import { generateCertificate } from "../utils/generateCertificate";

export default function VerificationPage() {
    const { certId } = useParams();
    const [status, setStatus] = useState("loading");
    const [data, setData] = useState(null);
    const [downloaded, setDownloaded] = useState(false);

    useEffect(() => {
        let active = true;
        const verify = async () => {
            try {
                const response = await fetch(ENDPOINTS.VERIFY_CERT(certId));
                const responseData = await response.json();
                if (!active) return;
                if (!response.ok || !responseData.valid) return setStatus("invalid");
                setData(responseData);
                setStatus("valid");
            } catch (error) {
                console.error("Verification error:", error);
                if (active) setStatus("error");
            }
        };
        if (certId) verify();
        return () => { active = false; };
    }, [certId]);

    const downloadCertificate = async () => {
        if (!data) return;
        const issuedDate = data.issuedAt || data.approvedAt || new Date();
        const date = new Date(issuedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        const role = data.certificateType === "Membership Certificate" ? "member" : (data.volunteerType || "volunteer");
        await generateCertificate(data.fullName, role, date, data.certId);
        setDownloaded(true);
    };

    useEffect(() => {
        if (status !== "valid" || !data) return;
        const timer = setTimeout(() => downloadCertificate().catch(console.error), 900);
        return () => clearTimeout(timer);
    }, [status, data]);

    return <div className="min-h-screen bg-[#001529] text-white pt-48 pb-24 px-6"><div className="max-w-xl mx-auto text-center relative z-10">
        {status === "loading" ? <div className="space-y-8"><div className="w-24 h-24 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" /><h1 className="text-2xl font-bold tracking-widest text-zinc-400 animate-pulse">VERIFYING CERTIFICATE...</h1></div> : data ? <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3rem] p-10 md:p-16 text-[#002344] shadow-2xl space-y-8 border-t-[1rem] border-[#25D366]"><div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto">{downloaded ? <FaCheckCircle /> : <FaCertificate />}</div><div><h1 className="text-4xl font-black">Official Verification</h1><p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mt-2">VALID CERTIFICATE</p></div><div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 text-left space-y-4"><div className="flex items-center gap-4 border-b border-zinc-200 pb-4"><FaCertificate className="text-orange-500" /><div><p className="text-[10px] uppercase font-bold text-zinc-400">Certificate ID</p><p className="font-black text-lg">{data.certId}</p></div></div><div className="flex items-center gap-4 border-b border-zinc-200 pb-4"><FaIdCard className="text-blue-500" /><div><p className="text-[10px] uppercase font-bold text-zinc-400">Issued To</p><p className="font-black text-lg">{data.fullName}</p></div></div>{data.memberId && <div className="flex items-center gap-4 border-b border-zinc-200 pb-4"><FaIdCard className="text-violet-500" /><div><p className="text-[10px] uppercase font-bold text-zinc-400">Member ID</p><p className="font-black text-lg">{data.memberId}</p></div></div>}<div className="flex items-center gap-4"><FaBuilding className="text-emerald-500" /><div><p className="text-[10px] uppercase font-bold text-zinc-400">Certificate Type</p><p className="font-black text-lg">{data.certificateType || "Official Certificate"}</p></div></div></div>{downloaded && <div className="bg-emerald-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3"><FaDownload /> PDF Downloaded</div>}<button type="button" onClick={downloadCertificate} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#002344] text-white font-bold"><FaDownload /> Download Again</button><p className="text-xs text-zinc-400 font-medium italic">Issued by Swastik Srijan Foundation. This verification page confirms the certificate record held by SSF.</p></motion.div> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[3rem] p-10 md:p-16 text-[#002344] shadow-2xl space-y-8 border-t-[1rem] border-red-500"><div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-5xl mx-auto"><FaTimesCircle /></div><h1 className="text-3xl font-black">Verification Failed</h1><p className="text-zinc-500 leading-relaxed font-medium">No active certificate matches the ID: <span className="text-red-500 font-bold">{certId}</span>.</p></motion.div>}
        <div className="mt-12 flex items-center justify-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest"><FaShieldAlt /> SSF Security Layer</div>
    </div></div>;
}
