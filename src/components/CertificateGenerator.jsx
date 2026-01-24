import { useState } from 'react';
import { generateCertificate } from '../utils/generateCertificate';
import { FaDownload, FaCertificate, FaCheckCircle, FaSpinner, FaExclamationCircle, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function CertificateGenerator({ role }) {
    const [name, setName] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [error, setError] = useState('');

    // 🔒 SECURITY CODES (You can change these)
    const VALID_CODES = {
        'Volunteer': 'SSF-VOL-2025',
        'Member': 'SSF-MEM-2025',
        'Donor': 'SSF-DONOR-VAR'
    };

    // Load history
    const getHistory = () => {
        try {
            return JSON.parse(localStorage.getItem('ssf_cert_history') || '{}');
        } catch {
            return {};
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setError('');
        setGenerated(false);
        const trimmedName = name.trim();
        const trimmedCode = accessCode.trim();

        if (!trimmedName || !trimmedCode) return;

        // 1. 🛑 SECURITY CHECK: Validate Access Code
        const requiredCode = VALID_CODES[role];
        if (trimmedCode !== requiredCode) {
            setError("Invalid Access Code. Please check your email or contact the admin.");
            return;
        }

        // 2. 🛑 DUPLICATE CHECK: Prevent re-generation
        const history = getHistory();
        const recordKey = `${role}-${trimmedName.toLowerCase()}`;

        if (history[recordKey]) {
            setError(`A certificate for "${trimmedName}" has already been issued.`);
            return;
        }

        setLoading(true);

        const today = new Date().toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        // Simulate verifying via "server"
        await new Promise(r => setTimeout(r, 1500));

        try {
            await generateCertificate(trimmedName, role, today);

            // Save to history
            history[recordKey] = new Date().toISOString();
            localStorage.setItem('ssf_cert_history', JSON.stringify(history));

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
            <div className={`p-8 text-center transition-colors duration-500 ${generated ? 'bg-green-600' : 'bg-[#003366]'}`}>
                <FaCertificate className="text-5xl text-yellow-400 mx-auto mb-4 drop-shadow-md" />
                <h3 className="text-2xl font-bold text-white tracking-wide">
                    {generated ? 'Authorized & Issued' : `Official ${role} Certificate`}
                </h3>
                <p className="text-blue-100 text-sm mt-2 opacity-90 font-medium max-w-xs mx-auto">
                    {generated
                        ? 'Your certificate has been verified and downloaded.'
                        : 'Secure Generation Portal. Access Code required.'}
                </p>
            </div>

            <div className="p-8">
                <form onSubmit={handleGenerate} className="space-y-5">

                    {/* Name Input */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-4 focus:ring-[#003366]/10 focus:border-[#003366] text-lg font-semibold text-zinc-800 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Access Code Input */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-2">
                            <FaLock className="text-sm" /> Access Code
                        </label>
                        <input
                            type="text"
                            value={accessCode}
                            onChange={(e) => {
                                setAccessCode(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter Code (e.g. SSF-VOL...)"
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
                        disabled={loading || !name.trim() || !accessCode.trim()}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${generated
                                ? 'bg-green-50 text-green-700 border-2 border-green-200 cursor-default'
                                : 'bg-gradient-to-r from-[#003366] to-[#004080] text-white hover:shadow-xl'
                            } disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed`}
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
                            href="https://wa.me/919912345678?text=Hi%2C%20I%20have%20registered%20as%20a%20Volunteer%2FDonor%20but%20haven't%20received%20my%20Certificate%20Access%20Code%20yet."
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-xs text-[#003366] font-bold underline hover:text-blue-700"
                        >
                            Contact Support on WhatsApp
                        </a>
                    </div>
                )}

                {generated && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-green-50 rounded-lg text-center border border-green-100"
                    >
                        <p className="text-green-800 font-medium text-sm">
                            Certificate valid. Thank you for your service!
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
