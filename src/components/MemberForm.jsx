import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { FaCheckCircle, FaSpinner, FaExclamationCircle, FaArrowRight, FaLock } from "react-icons/fa";

export default function MemberForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        memberType: "general",
        message: ""
    });

    const [status, setStatus] = useState("idle"); // idle, submitting, success, error
    const [certificateCode, setCertificateCode] = useState("");

    useEffect(() => {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");

        const MEMBER_CODE = "SSF-MEM-2025";
        setCertificateCode(MEMBER_CODE);

        try {
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            await emailjs.send(
                serviceId,
                templateId,
                {
                    from_name: formData.fullName,
                    from_email: formData.email,
                    phone: formData.phone,
                    role: "Member",
                    member_type: formData.memberType,
                    message: formData.message,
                    certificate_code: MEMBER_CODE,
                    subject: "New Member Registration - Swastik Srijan Foundation"
                },
                publicKey
            );

            setStatus("success");
            setFormData({ fullName: "", email: "", phone: "", memberType: "general", message: "" });
        } catch (error) {
            console.error("EmailJS Error:", error);
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
                <p className="text-zinc-600 text-lg">
                    Welcome to the core team. Your application has been submitted for review.
                </p>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-3">
                    <p className="text-sm font-bold text-blue-800 uppercase tracking-widest flex items-center justify-center gap-2">
                        <FaLock /> Membership Status
                    </p>
                    <div className="text-xl font-bold text-[#002344]">
                        Processing Application
                    </div>
                    <p className="text-sm text-blue-700">
                        Your **Membership Access Code** has been sent to your email.
                        Use that code in the portal below once your payment is verified.
                    </p>
                </div>

                <button
                    onClick={() => setStatus("idle")}
                    className="text-zinc-400 hover:text-zinc-600 font-bold transition-colors"
                >
                    Apply for another member
                </button>
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
                        className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-4 focus:ring-blue-400/10 transition-all font-medium"
                    />
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
                            placeholder="your@email.com"
                            className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-4 focus:ring-blue-400/10 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Phone</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+91..."
                            className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-4 focus:ring-blue-400/10 transition-all font-medium"
                        />
                    </div>
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
