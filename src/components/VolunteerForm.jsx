import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle, FaExclamationCircle, FaSpinner, FaUpload } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

const INITIAL_FORM = {
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    volunteerType: "field",
    position: "General Volunteer",
    idType: "College ID",
    message: "",
    idDocument: null
};

const inputClass = "w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-400/20 focus:border-orange-300 transition-all font-medium";

export default function VolunteerForm() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [applicationId, setApplicationId] = useState("");

    const update = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

    const validate = () => {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
        const phoneDigits = formData.phone.replace(/\D/g, "");
        if (formData.fullName.trim().length < 3) return "Please enter your full name.";
        if (!emailOk) return "Please enter a valid email address.";
        if (phoneDigits.length < 7 || phoneDigits.length > 15) return "Please enter a valid phone number.";
        if (!formData.message.trim() || formData.message.trim().length < 10) return "Please tell us briefly why you want to volunteer (minimum 10 characters).";
        if (!formData.idDocument) return "Please upload your ID document for verification.";
        if (formData.idDocument.size > 5 * 1024 * 1024) return "ID document must be 5MB or smaller.";
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            setStatus("error");
            return;
        }

        setStatus("submitting");
        setError("");

        try {
            const payload = new FormData();
            payload.append("name", formData.fullName.trim());
            payload.append("email", formData.email.trim().toLowerCase());
            payload.append("phone", `${formData.countryCode} ${formData.phone.trim()}`);
            payload.append("volunteer_type", formData.volunteerType);
            payload.append("position", formData.position);
            payload.append("id_type", formData.idType);
            payload.append("message", formData.message.trim());
            payload.append("id_document", formData.idDocument);

            const response = await fetch(ENDPOINTS.REGISTER, { method: "POST", body: payload });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Unable to submit your application.");

            setApplicationId(result.data?.id || "");
            setStatus("success");
        } catch (submitError) {
            console.error("Volunteer submission failed:", submitError);
            setError(submitError.message || "Unable to submit your application. Please try again.");
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-emerald-100 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-4xl"><FaCheckCircle /></div>
                <div>
                    <h3 className="text-3xl font-black text-[#002344]">Application Submitted</h3>
                    <p className="mt-2 text-zinc-500 font-medium">Your volunteer application has been received by Swastik Srijan Foundation.</p>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-5 text-left space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Application Reference</p>
                    <p className="font-mono font-bold text-[#002344] break-all">{applicationId || "Received"}</p>
                    <p className="text-sm text-zinc-500">Status: <span className="font-bold text-orange-600">Pending verification</span></p>
                </div>
                <p className="text-sm text-zinc-500">Our team will review the submitted details and ID proof. An official volunteer certificate is issued only after admin approval.</p>
                <button type="button" onClick={() => { setFormData(INITIAL_FORM); setApplicationId(""); setError(""); setStatus("idle"); }} className="text-sm font-bold text-[#002344] hover:text-orange-600 transition-colors">Submit another application</button>
            </motion.div>
        );
    }

    const positions = [
        "General Volunteer",
        "National CSR & Corporate Partnership Head",
        "National Program & Project Head",
        "National Strategy & Innovation Head",
        "State Impact Director",
        "State Program Coordinator",
        "State Volunteer & Community Mobilisation Head",
        "District Program Coordinator",
        "District Volunteer Coordinator",
        "Senior Advisor – Social Development",
        "Legal & Policy Advisor",
        "Website Development & IT Support",
        "Digital Marketing & Social Media",
        "Graphic Design & Visual Arts",
        "Content Writing & Blogging",
        "Photography & Video Editing",
        "Young Social Leadership Fellow",
        "Campus Social Coordinator"
    ];

    return (
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-zinc-100">
            <div className="mb-8">
                <h3 className="text-2xl font-black text-[#002344]">Volunteer Application Form</h3>
                <p className="mt-2 text-sm text-zinc-500">Submit your details once. Your application is saved in the SSF admin system for review.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid md:grid-cols-2 gap-5">
                    <div><label className="field-label">Full Name *</label><input className={inputClass} value={formData.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Your full name" autoComplete="name" /></div>
                    <div><label className="field-label">Email Address *</label><input type="email" className={inputClass} value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" autoComplete="email" /></div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label className="field-label">Phone Number *</label>
                        <div className="flex gap-2">
                            <select className={`${inputClass} w-28 shrink-0 px-3`} value={formData.countryCode} onChange={(e) => update("countryCode", e.target.value)} aria-label="Country code"><option value="+91">+91 IN</option><option value="+1">+1 US/CA</option><option value="+44">+44 UK</option><option value="+61">+61 AU</option><option value="+971">+971 UAE</option></select>
                            <input className={inputClass} value={formData.phone} onChange={(e) => update("phone", e.target.value)} placeholder="00000 00000" autoComplete="tel" />
                        </div>
                    </div>
                    <div><label className="field-label">Volunteer Type *</label><select className={inputClass} value={formData.volunteerType} onChange={(e) => update("volunteerType", e.target.value)}><option value="field">Field Volunteer</option><option value="program">Program Volunteer</option><option value="professional">Professional Volunteer</option><option value="digital">Digital / Online Volunteer</option></select></div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    <div><label className="field-label">Position Applied For *</label><select className={inputClass} value={formData.position} onChange={(e) => update("position", e.target.value)}>{positions.map((position) => <option key={position} value={position}>{position}</option>)}</select></div>
                    <div><label className="field-label">ID Proof Type *</label><select className={inputClass} value={formData.idType} onChange={(e) => update("idType", e.target.value)}><option value="College ID">College ID</option><option value="NGO ID">NGO ID</option><option value="Driving License">Driving License</option><option value="Voter ID">Voter ID</option></select></div>
                </div>

                <div>
                    <label className="field-label flex items-center gap-2"><FaUpload /> Upload ID Document * <span className="font-normal normal-case tracking-normal text-zinc-400">(JPG, PNG or PDF, max 5MB)</span></label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => update("idDocument", e.target.files?.[0] || null)} className={`${inputClass} file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-200 file:px-4 file:py-2 file:font-bold`} />
                    {formData.idDocument && <p className="mt-2 text-xs font-semibold text-emerald-600">Selected: {formData.idDocument.name}</p>}
                </div>

                <div><label className="field-label">Why do you want to volunteer? *</label><textarea className={`${inputClass} resize-none`} rows={5} value={formData.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us about your interest, skills or availability." /></div>

                {status === "error" && <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold flex gap-3 items-start"><FaExclamationCircle className="mt-0.5 shrink-0" /><span>{error}</span></div>}

                <button type="submit" disabled={status === "submitting"} className="w-full bg-[#001529] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#FF6600] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">{status === "submitting" ? <><FaSpinner className="animate-spin" /> Submitting securely...</> : <>Submit Volunteer Application <FaArrowRight /></>}</button>
            </form>
        </div>
    );
}
