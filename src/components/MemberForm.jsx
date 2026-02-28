import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaSpinner, FaExclamationCircle, FaArrowRight, FaLock } from "react-icons/fa";
import { ALL_COUNTRIES } from "../data/countries";
import { ENDPOINTS } from "../config/api";

export default function MemberForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        confirmEmail: "",
        countryCode: "+91",
        phone: "",
        memberType: "general",
        message: ""
    });

    const [status, setStatus] = useState("idle");
    const [errors, setErrors] = useState({});
    const [certificateCode, setCertificateCode] = useState("");
    const [whatsappLink, setWhatsappLink] = useState("");

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCountries = ALL_COUNTRIES.filter(c =>
        c.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentCountry = ALL_COUNTRIES.find(c => c.code === formData.countryCode) || ALL_COUNTRIES.find(c => c.code === "+91");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const nextErrors = {};

        if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
            nextErrors.fullName = "Name must be at least 3 characters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            nextErrors.email = "Please enter a valid email address";
        }

        if (!emailRegex.test(formData.confirmEmail)) {
            nextErrors.confirmEmail = "Please enter a valid confirmation email";
        } else if (formData.email.trim().toLowerCase() !== formData.confirmEmail.trim().toLowerCase()) {
            nextErrors.confirmEmail = "Both email fields must match";
        }

        const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
        if (cleanPhone.length < 7 || cleanPhone.length > 15) {
            nextErrors.phone = "Please enter a valid phone number (7-15 digits)";
        }

        if (!formData.message.trim() || formData.message.trim().length < 10) {
            nextErrors.message = "Please tell us a bit more (min 10 chars)";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus("submitting");
        const MEMBER_CODE = "SSF-MEM-2025";
        setCertificateCode(MEMBER_CODE);

        try {
            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                confirmEmail: formData.confirmEmail,
                phone: `${formData.countryCode} ${formData.phone}`,
                memberType: formData.memberType,
                message: formData.message
            };

            const response = await fetch(ENDPOINTS.MEMBER_SIGNUP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Member signup request failed");
            }

            if (result.whatsapp) {
                setWhatsappLink(result.whatsapp);
            }

            setStatus("success");
            setFormData({ fullName: "", email: "", confirmEmail: "", countryCode: "+91", phone: "", memberType: "general", message: "" });
        } catch (error) {
            console.error("Member Signup Error:", error);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-[2rem] shadow-2xl border-2 border-blue-100 text-center space-y-6"
            >
                <div className="w-20 h-20 bg-blue-50 text-[#002344] rounded-full flex items-center justify-center text-4xl mx-auto">
                    <FaCheckCircle />
                </div>
                <h2 className="text-3xl font-bold text-[#002344]">Membership Application Sent!</h2>
                <p className="text-zinc-600 text-lg">Welcome to the core team. Your application has been submitted for review.</p>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-3">
                    <p className="text-sm font-bold text-blue-800 uppercase tracking-widest flex items-center justify-center gap-2">
                        <FaLock /> Membership Status
                    </p>
                    <div className="text-xl font-bold text-[#002344]">Processing Application</div>
                    <p className="text-sm text-blue-700">
                        Your <strong>Membership Access Code</strong> is <strong>{certificateCode}</strong>. We will contact you after verification.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    {whatsappLink && (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
                        >
                            Send on WhatsApp (9718346691)
                        </a>
                    )}
                    <button onClick={() => setStatus("idle")} className="text-zinc-400 hover:text-zinc-600 font-bold transition-colors">
                        Apply for another member
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-zinc-100">
            <h3 className="text-2xl font-bold text-[#002344] mb-6">Member Application Form</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-4 focus:ring-blue-400/10 transition-all font-medium ${errors.fullName ? "ring-2 ring-red-400" : ""}`}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            className={`w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-4 focus:ring-blue-400/10 transition-all font-medium ${errors.email ? "ring-2 ring-red-400" : ""}`}
                        />
                        {errors.email && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Confirm Email</label>
                        <input
                            type="email"
                            name="confirmEmail"
                            value={formData.confirmEmail}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            className={`w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-4 focus:ring-blue-400/10 transition-all font-medium ${errors.confirmEmail ? "ring-2 ring-red-400" : ""}`}
                        />
                        {errors.confirmEmail && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.confirmEmail}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="flex gap-2">
                        <div className="relative min-w-[140px]">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl transition-all font-bold"
                            >
                                <div className="flex items-center gap-2">
                                    <img src={`https://flagcdn.com/w40/${currentCountry.name}.png`} alt="Flag" className="w-5 h-auto rounded-sm shadow-sm" />
                                    <span>{formData.countryCode}</span>
                                </div>
                                <span className={`text-[10px] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[110]" onClick={() => setIsDropdownOpen(false)}></div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-zinc-100 py-2 z-[120] flex flex-col"
                                        >
                                            <div className="px-3 pb-2 pt-1">
                                                <input
                                                    type="text"
                                                    placeholder="Search country..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-400/20 outline-none"
                                                />
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredCountries.map((c, i) => (
                                                    <button
                                                        key={`${c.name}-${i}`}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, countryCode: c.code }));
                                                            setIsDropdownOpen(false);
                                                            setSearchTerm("");
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                                                    >
                                                        <img src={`https://flagcdn.com/w40/${c.name}.png`} alt={c.label} className="w-5 h-auto rounded-sm" />
                                                        <span className="text-sm font-bold text-zinc-700">{c.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="00000 00000"
                            className={`flex-1 px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-4 focus:ring-blue-400/10 transition-all font-medium ${errors.phone ? "ring-2 ring-red-400" : ""}`}
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Membership Type</label>
                    <select
                        name="memberType"
                        value={formData.memberType}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-4 focus:ring-blue-400/10 transition-all font-medium appearance-none"
                    >
                        <option value="general">General Member (₹100/mo)</option>
                        <option value="active">Active Member (₹2500/yr)</option>
                        <option value="life">Life Member (₹8000+)</option>
                        <option value="advisory">Advisory Member</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Message</label>
                    <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us why you want to join..."
                        className={`w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-4 focus:ring-blue-400/10 transition-all font-medium resize-none ${errors.message ? "ring-2 ring-red-400" : ""}`}
                    />
                    {errors.message && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.message}</p>}
                </div>

                {status === "error" && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3 border border-red-100">
                        <FaExclamationCircle />
                        Failed to submit. Please try again.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-[#002344] text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 group shadow-lg"
                >
                    {status === "submitting" ? (
                        <>
                            <FaSpinner className="animate-spin" /> Submitting...
                        </>
                    ) : (
                        <>
                            Submit Application
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
