```javascript
import { useState } from 'react';
import { generateCertificate } from '../utils/generateCertificate';
import { FaDownload, FaCertificate, FaCheckCircle, FaSpinner, FaExclamationCircle, FaLock, FaShieldAlt, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CONTACT_INFO } from '../config/contact';
import { ENDPOINTS } from "../config/api";

export default function CertificateGenerator({ role }) {
    const [accessCode, setAccessCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [error, setError] = useState('');
    const [volunteerType, setVolunteerType] = useState('Field Volunteer');

    // Unified handle for verification
    const handleGenerate = async (e) => {
        e.preventDefault();
        setError('');
        setGenerated(false);
        const trimmedCode = accessCode.trim();

        if (!trimmedCode) return;

        setLoading(true);

        // 1. 🔍 DATABASE CHECK: Verify the Certificate ID
        try {
            const response = await fetch(ENDPOINTS.VERIFY_CERT(trimmedCode));
            if (!response.ok) {
                setError("Invalid Certificate ID. Your application might be pending or rejected.");
                setLoading(false);
                return;
            }
            const record = await response.json();

            // Check if valid again (backend should handle this but extra check)
            if (!record.valid) {
                setError("Invalid Certificate ID.");
                setLoading(false);
                return;
            }

            const today = new Date().toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
            });

            // Generate using the official details from database
            await generateCertificate(record.fullName, record.volunteerType, today, record.certId);

            setGenerated(true);
        } catch (error) {
            console.error("Certificate generation failed", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden my-12 relative">
            {/* Header */}
            <div className={`p - 8 text - center transition - colors duration - 500 ${ generated ? 'bg-green-600' : 'bg-[#003366]' } `}>
                <FaShieldAlt className="text-5xl text-yellow-400 mx-auto mb-4 drop-shadow-md" />
                <h3 className="text-2xl font-bold text-white tracking-wide">
                    {generated ? 'Verified & Issued' : `Secure Certificate Retrieval`}
                </h3>
                <p className="text-blue-100 text-sm mt-2 opacity-90 font-medium max-w-xs mx-auto">
                    {generated
                        ? 'Your certificate has been verified and downloaded.'
                        : 'Enter your unique Certificate ID provided by the admin.'}
                </p>
            </div>

            <div className="p-8">
                <form onSubmit={handleGenerate} className="space-y-5">

                    {/* Access Code Input */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-2">
                            <FaShieldAlt className="text-sm" /> Certificate ID / Registration ID
                        </label>
                        <input
                            type="text"
                            value={accessCode}
                            onChange={(e) => {
                                setAccessCode(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g. SSF-VOL-2026-0001"
                            className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-4 focus:ring-[#003366]/10 focus:border-[#003366] text-lg font-mono text-zinc-800 outline-none transition-all tracking-wider"
                            required
                        />
                        <p className="text-[10px] text-zinc-400 mt-1 ml-1">
                            * Received via email/WhatsApp after registration.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-sm font-bold flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100"
                        >
                            <FaExclamationCircle className="shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !accessCode.trim()}
                        className={`w - full py - 4 rounded - xl font - bold text - lg shadow - lg flex items - center justify - center gap - 3 transition - all transform active: scale - [0.98] ${
    generated
        ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-default'
        : 'bg-gradient-to-r from-[#003366] to-[#004080] text-white hover:shadow-xl'
} disabled: opacity - 50 disabled:grayscale disabled: cursor - not - allowed`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" /> Verifying Code...
                            </>
                        ) : generated ? (
                            <>
                                <FaCheckCircle /> Success
                            </>
                        ) : (
                            <>
                                <FaDownload /> Verify & Generate
                            </>
                        )}
                    </button>

                </form>

                {/* --- HELP SECTION --- */}
                {!generated && (
                    <div className="mt-8 pt-6 border-t border-zinc-100 text-center space-y-3">
                        <p className="text-sm font-bold text-zinc-600">
                            Don't have an Access Code?
                        </p>
                        <ul className="text-xs text-zinc-500 space-y-2 text-left bg-zinc-50 p-4 rounded-lg">
                            <li className="flex gap-2">
                                <span className="font-bold text-[#003366]">1. Check your Email:</span>
                                <span>The code is sent automatically after you complete your donation or volunteer registration form.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-[#003366]">2. Late Arrival:</span>
                                <span>Sometimes it takes up to 24 hours for the system to verify and send the code.</span>
                            </li>
                        </ul>
                        <a
                            href={`${ CONTACT_INFO.social.whatsapp }?text = ${ encodeURIComponent("Hi, I have registered as a Volunteer/Donor but haven't received my Certificate Access Code yet.") } `}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-xs text-[#003366] font-bold underline hover:text-blue-700"
                        >
                            Contact Support on WhatsApp
                        </a>
                    </div>
                )}

{
    generated && (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 rounded-lg text-center border border-green-100"
        >
            <p className="text-green-800 font-medium text-sm">
                Certificate valid. Thank you for your service!
            </p>
        </motion.div>
    )
}
            </div >
        </div >
    );
}
