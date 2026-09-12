import { useState } from "react";
import { FaArrowRight, FaCheckCircle, FaExclamationCircle, FaSpinner, FaUpload } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

const initialForm = { name: "", email: "", phone: "", volunteerType: "field", message: "", idDocument: null };
const inputClass = "w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400";

export default function VolunteerForm() {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [reference, setReference] = useState("");

    const set = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.name.trim().length < 3) return setError("Please enter your full name."), setStatus("error");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("Please enter a valid email address."), setStatus("error");
        const phone = form.phone.replace(/\D/g, "");
        if (phone.length < 7 || phone.length > 15) return setError("Please enter a valid mobile number."), setStatus("error");
        if (!form.message.trim()) return setError("Please tell us briefly why you want to volunteer."), setStatus("error");
        if (!form.idDocument) return setError("Please upload one identity document."), setStatus("error");
        if (form.idDocument.size > 5 * 1024 * 1024) return setError("Identity document must be 5MB or smaller."), setStatus("error");

        setStatus("submitting");
        try {
            const data = new FormData();
            data.append("name", form.name.trim());
            data.append("email", form.email.trim().toLowerCase());
            data.append("phone", form.phone.trim());
            data.append("volunteer_type", form.volunteerType);
            data.append("position", "General Volunteer");
            data.append("id_type", "Identity Document");
            data.append("message", form.message.trim());
            data.append("id_document", form.idDocument);

            const response = await fetch(ENDPOINTS.REGISTER, { method: "POST", body: data });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || `Volunteer application failed (HTTP ${response.status}).`);
            setReference(result.data?.id || "Received");
            setStatus("success");
        } catch (err) {
            console.error("Volunteer application error:", err);
            setError(err.message || "Unable to submit the application. Please try again.");
            setStatus("error");
        }
    };

    if (status === "success") return (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 text-center space-y-4">
            <FaCheckCircle className="mx-auto text-5xl text-emerald-500" />
            <h3 className="text-2xl font-black text-[#002344]">Volunteer Application Submitted</h3>
            <p className="text-zinc-600">Thank you. Your application has been received and will be reviewed by our team.</p>
            <p className="text-sm text-zinc-500">Reference: <strong>{reference}</strong></p>
            <button type="button" onClick={() => { setForm(initialForm); setReference(""); setError(""); setStatus("idle"); }} className="text-sm font-bold text-[#002344] hover:text-orange-600">Submit another application</button>
        </div>
    );

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-zinc-100">
            <h3 className="text-2xl font-black text-[#002344]">Volunteer Application</h3>
            <p className="mt-2 mb-6 text-sm text-zinc-500">A simple application for people who want to support Swastik Srijan Foundation.</p>
            <form onSubmit={submit} className="space-y-5" noValidate>
                <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="field-label">Full Name *</label><input className={inputClass} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" required /></div>
                    <div><label className="field-label">Email *</label><input type="email" className={inputClass} value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" required /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="field-label">Mobile Number *</label><input type="tel" inputMode="numeric" className={inputClass} value={form.phone} onChange={e => set("phone", e.target.value.replace(/[^0-9 +()-]/g, ""))} placeholder="Your mobile number" required /></div>
                    <div><label className="field-label">Volunteer Type *</label><select className={inputClass} value={form.volunteerType} onChange={e => set("volunteerType", e.target.value)}><option value="field">Field Volunteer</option><option value="program">Program Volunteer</option><option value="professional">Professional Volunteer</option><option value="digital">Digital / Online Volunteer</option></select></div>
                </div>
                <div><label className="field-label">Why do you want to volunteer? *</label><textarea className={`${inputClass} resize-none`} rows={4} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Tell us briefly how you would like to contribute." required /></div>
                <div><label className="field-label flex items-center gap-2"><FaUpload /> Identity Document *</label><input type="file" accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,application/pdf" onChange={e => set("idDocument", e.target.files?.[0] || null)} className={inputClass} required /><p className="mt-1 text-xs text-zinc-400">JPG, PNG, WebP or PDF · max 5MB</p></div>
                {status === "error" && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-semibold flex gap-2"><FaExclamationCircle className="mt-0.5 shrink-0" />{error}</div>}
                <button type="submit" disabled={status === "submitting"} className="w-full bg-[#002344] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF6600] transition flex items-center justify-center gap-3 disabled:opacity-60">{status === "submitting" ? <><FaSpinner className="animate-spin" /> Submitting...</> : <>Submit Volunteer Application <FaArrowRight /></>}</button>
            </form>
            <style>{`.field-label{display:block;font-size:.72rem;font-weight:800;color:#52525b;text-transform:uppercase;letter-spacing:.07em;margin:0 0 .4rem .15rem}`}</style>
        </div>
    );
}
