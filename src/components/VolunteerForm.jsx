import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaSpinner, FaExclamationCircle, FaArrowRight, FaWhatsapp, FaIdCard, FaUpload, FaEye } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";

export default function VolunteerForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        volunteerType: "field",
        idType: "College ID",
        message: "",
        idDocument: null
    });

    const [status, setStatus] = useState("idle"); // idle, submitting, success, error
    const [errors, setErrors] = useState({});
    const [certificateCode, setCertificateCode] = useState("");

    useEffect(() => {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, idDocument: "File size must be less than 5MB" }));
                return;
            }
            setFormData(prev => ({ ...prev, idDocument: file }));
            setErrors(prev => ({ ...prev, idDocument: null }));
        }
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
            newErrors.fullName = "Name must be at least 3 characters";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
        if (!phoneRegex.test(cleanPhone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }
        if (!formData.message.trim() || formData.message.trim().length < 10) {
            newErrors.message = "Please tell us a bit more (min 10 chars)";
        }
        if (!formData.idDocument) {
            newErrors.idDocument = "Please upload an official ID for verification";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus("submitting");

        const VOLUNTEER_CODE = "SSF-VOL-2025";
        setCertificateCode(VOLUNTEER_CODE);

        try {
            // STEP 1: CONSTRUCT FORMDATA
            const data = new FormData();
            data.append("name", formData.fullName);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("volunteer_type", formData.volunteerType);
            data.append("id_type", formData.idType);
            data.append("message", formData.message);
            data.append("id_document", formData.idDocument);

            // STEP 2: SEND TO BACKEND
            const response = await fetch(ENDPOINTS.REGISTER, {
                method: "POST",
                body: data
            });

            if (response.ok) {
                setStatus("success");
            } else {
                throw new Error("Backend submission failed");
            }

        } catch (error) {
            console.error("Submission Error:", error);
            setStatus("error");
        }
    };

    if (status === "success") {
        const whatsappMsg = encodeURIComponent(
            `Hi SSF! I am ${formData.fullName}. I just applied to be a ${formData.volunteerType} volunteer.\n\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone}\n` +
            `Message: ${formData.message}\n\n` +
            `Please verify my details and provide my Certificate Access Code!`
        );
        const whatsappLink = `https://wa.me/${CONTACT_INFO.phones.primary.replace(/[^0-9]/g, "")}?text=${whatsappMsg}`;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-green-100 text-center space-y-8"
            >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
                    <FaCheckCircle />
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-[#002344]">Application Received!</h2>
                    <p className="text-zinc-500 font-medium">Thank you for your willingness to serve.</p>
                </div>

                <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold uppercase tracking-widest text-xs">
                        <FaIdCard /> Document Submitted
                    </div>
                    <div className="text-2xl font-bold text-[#002344]">
                        Awaiting Approval
                    </div>
                    <p className="text-sm text-emerald-700 font-medium leading-relaxed">
                        Our team will verify your documents manually. Once approved, you will receive an email to download your certificate.
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm font-bold text-zinc-400 uppercase">Final Step: Verify on WhatsApp</p>
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-green-200"
                    >
                        <FaWhatsapp size={24} />
                        Connect on WhatsApp
                    </a>
                    <p className="text-xs text-zinc-400">
                        Clicking this will pre-fill your details in WhatsApp.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setFormData({ fullName: "", email: "", phone: "", volunteerType: "field", message: "" });
                        setStatus("idle");
                    }}
                    className="text-zinc-400 hover:text-[#002344] font-bold transition-colors text-sm"
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
                            className={`w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium ${errors.fullName ? 'ring-2 ring-red-400' : ''}`}
                        />
                        {errors.fullName && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.fullName}</p>}
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
                            className={`w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium ${errors.email ? 'ring-2 ring-red-400' : ''}`}
                        />
                        {errors.email && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.email}</p>}
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
                            className={`w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium ${errors.phone ? 'ring-2 ring-red-400' : ''}`}
                        />
                        {errors.phone && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">ID Proof Type</label>
                        <select
                            name="idType"
                            value={formData.idType}
                            onChange={(e) => setFormData(p => ({ ...p, idType: e.target.value }))}
                            className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium appearance-none"
                        >
                            <option value="College ID">College ID</option>
                            <option value="NGO ID">NGO ID</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Voter ID">Voter ID</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                        <FaUpload /> Upload ID Document
                    </label>
                    <div className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all ${errors.idDocument ? 'border-red-300 bg-red-50' : 'border-zinc-200 bg-zinc-50 hover:border-orange-400'}`}>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex items-center justify-center gap-3">
                            <FaIdCard className={formData.idDocument ? 'text-green-500' : 'text-zinc-300'} />
                            <span className="text-sm font-bold text-zinc-500 truncate max-w-[150px]">
                                {formData.idDocument ? formData.idDocument.name : 'Select File'}
                            </span>
                        </div>
                    </div>
                    {errors.idDocument && <p className="text-xs text-red-500 font-bold ml-2">{errors.idDocument}</p>}
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
                        className={`w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-400/20 transition-all font-medium resize-none ${errors.message ? 'ring-2 ring-red-400' : ''}`}
                    />
                    {errors.message && <p className="text-xs text-red-500 font-bold ml-2 mt-1">{errors.message}</p>}
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
