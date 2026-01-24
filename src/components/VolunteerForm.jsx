import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaSpinner, FaExclamationCircle, FaArrowRight } from "react-icons/fa";

export default function VolunteerForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        volunteerType: "field",
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

        const VOLUNTEER_CODE = "SSF-VOL-2025";
        setCertificateCode(VOLUNTEER_CODE);

        try {
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            await emailjs.send(
                serviceId,
                templateId,
                {
                    name: formData.fullName,
                    from_name: formData.fullName,
                    from_email: formData.email,
                    email: formData.email,
                    phone: formData.phone,
                    volunteer_type: formData.volunteerType,
                    message: formData.message,
                    certificate_code: VOLUNTEER_CODE,
                    subject: "New Volunteer Registration - Swastik Srijan Foundation"
                },
                publicKey
            );

            setStatus("success");
            setFormData({ fullName: "", email: "", phone: "", volunteerType: "field", message: "" });
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
                className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-green-100 text-center space-y-6"
            >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto">
                    <FaCheckCircle />
                </div>
                <h2 className="text-3xl font-bold text-[#002344]">Registration Successful!</h2>
                <p className="text-zinc-600 text-lg">
                    Thank you for joining Swastik Srijan Foundation. Your registration has been received.
                </p>

                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-3">
                    <p className="text-sm font-bold text-orange-800 uppercase tracking-widest">Registration Status</p>
                    <div className="text-xl font-bold text-[#002344]">
                        Awaiting Verification
                    </div>
                    <p className="text-sm text-orange-700">
                        Your **Certificate Access Code** has been sent to your registered email address.
                        Please check your inbox (and spam folder) to retrieve it.
                    </p>
                </div>

                <button
                    onClick={() => setStatus("idle")}
                    className="text-zinc-400 hover:text-zinc-600 font-bold transition-colors"
                >
                    Register another volunteer
                </button>
            </motion.div>
        );
    }

    return (
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-zinc-100 relative">
            <h3 className="text-2xl font-bold text-[#002344] mb-8">Volunteer Application Form</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Full Name</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Phone Number</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+91 00000 00000"
                            className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Volunteer Type</label>
                        <select
                            name="volunteerType"
                            value={formData.volunteerType}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium appearance-none"
                        >
                            <option value="field">Field Volunteer</option>
                            <option value="program">Program Volunteer</option>
                            <option value="professional">Professional Volunteer</option>
                            <option value="digital">Digital Volunteer</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Tell us about yourself</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Why do you want to join SSF?"
                        className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium resize-none"
                    />
                </div>

                {status === "error" && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3 border border-red-100">
                        <FaExclamationCircle />
                        Something went wrong. Please try again later.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full bg-[#001529] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#FF6600] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {status === "submitting" ? (
                        <>
                            <FaSpinner className="animate-spin" /> Submitting...
                        </>
                    ) : (
                        <>
                            Submit Application
                            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
