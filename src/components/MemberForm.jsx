import { useState } from "react";
import { FaArrowRight, FaCheckCircle, FaExclamationCircle, FaSpinner, FaUpload } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

const initialForm = { fullName: "", email: "", confirmEmail: "", phone: "", password: "", memberType: "general", message: "", profilePhoto: null, idDocument: null };
const inputClass = "w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400";

export default function MemberForm({ initialMemberType = "general" }) {
    const [form, setForm] = useState({ ...initialForm, memberType: initialMemberType });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const set = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.fullName.trim().length < 3) return setError("Please enter your full name."), setStatus("error");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("Please enter a valid email address."), setStatus("error");
        if (form.email.trim().toLowerCase() !== form.confirmEmail.trim().toLowerCase()) return setError("Email and confirm email must match."), setStatus("error");
        if (form.phone.replace(/\D/g, "").length < 7) return setError("Please enter a valid mobile number."), setStatus("error");
        if (form.password.length < 8) return setError("Password must be at least 8 characters."), setStatus("error");
        if (!form.profilePhoto) return setError("Please upload your profile photo."), setStatus("error");
        if (form.profilePhoto.size > 2 * 1024 * 1024) return setError("Profile photo must be 2MB or smaller."), setStatus("error");
        if (!form.idDocument) return setError("Please upload one identity document."), setStatus("error");
        if (form.idDocument.size > 5 * 1024 * 1024) return setError("Identity document must be 5MB or smaller."), setStatus("error");

        setStatus("submitting");
        try {
            const data = new FormData();
            data.append("fullName", form.fullName.trim());
            data.append("email", form.email.trim().toLowerCase());
            data.append("confirmEmail", form.confirmEmail.trim().toLowerCase());
            data.append("phone", form.phone.trim());
            data.append("password", form.password);
            data.append("memberType", form.memberType);
            data.append("idProofType", "Identity Document");
            data.append("message", form.message.trim());
            data.append("profile_photo", form.profilePhoto);
            data.append("id_document", form.idDocument);

            const response = await fetch(ENDPOINTS.MEMBER_SIGNUP, { method: "POST", body: data });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || `Membership application failed (HTTP ${response.status}).`);
            setStatus("success");
        } catch (err) {
            console.error("Membership application error:", err);
            setError(err.message || "Unable to submit the application. Please try again.");
            setStatus("error");
        }
    };

    if (status === "success") return (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 text-center space-y-4">
            <FaCheckCircle className="mx-auto text-5xl text-emerald-500" />
            <h3 className="text-2xl font-black text-[#002344]">Membership Application Submitted</h3>
            <p className="text-zinc-600">Your application and documents have been received. Our team will review them and contact you regarding approval and applicable membership payment.</p>
            <a href="/MemberDashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#002344] text-white font-bold">Open Member Dashboard <FaArrowRight /></a>
            <button type="button" onClick={() => { setForm({ ...initialForm, memberType: initialMemberType }); setError(""); setStatus("idle"); }} className="block mx-auto text-sm font-bold text-zinc-500 hover:text-orange-600">Submit another application</button>
        </div>
    );

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-zinc-100">
            <h3 className="text-2xl font-black text-[#002344]">Membership Application</h3>
            <p className="mt-2 mb-6 text-sm text-zinc-500">Create your member account and submit your application for review.</p>
            <form onSubmit={submit} className="space-y-5" noValidate>
                <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="field-label">Full Name *</label><input className={inputClass} value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Your full name" required /></div>
                    <div><label className="field-label">Email *</label><input type="email" className={inputClass} value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" required /></div>
                    <div><label className="field-label">Confirm Email *</label><input type="email" className={inputClass} value={form.confirmEmail} onChange={e => set("confirmEmail", e.target.value)} placeholder="Confirm email" required /></div>
                    <div><label className="field-label">Mobile Number *</label><input type="tel" inputMode="numeric" className={inputClass} value={form.phone} onChange={e => set("phone", e.target.value.replace(/[^0-9 +()-]/g, ""))} placeholder="Your mobile number" required /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="field-label">Create Password *</label><input type="password" className={inputClass} value={form.password} onChange={e => set("password", e.target.value)} placeholder="Minimum 8 characters" minLength={8} required /></div>
                    <div><label className="field-label">Membership Type *</label><select className={inputClass} value={form.memberType} onChange={e => set("memberType", e.target.value)}><option value="general">General Member</option><option value="active">Active Member</option><option value="life">Life Member</option><option value="advisory">Advisory / Expert</option></select></div>
                </div>
                <div><label className="field-label">Why do you want to join?</label><textarea className={`${inputClass} resize-none`} rows={4} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Tell us briefly how you would like to contribute." /></div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="field-label flex items-center gap-2"><FaUpload /> Profile Photo *</label><input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={e => set("profilePhoto", e.target.files?.[0] || null)} className={inputClass} required /><p className="mt-1 text-xs text-zinc-400">JPG, PNG or WebP · max 2MB</p></div>
                    <div><label className="field-label flex items-center gap-2"><FaUpload /> Identity Document *</label><input type="file" accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,application/pdf" onChange={e => set("idDocument", e.target.files?.[0] || null)} className={inputClass} required /><p className="mt-1 text-xs text-zinc-400">JPG, PNG, WebP or PDF · max 5MB</p></div>
                </div>
                <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3 text-sm text-zinc-600">Membership approval and any applicable membership fee/payment instructions will be provided after review.</div>
                {status === "error" && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-semibold flex gap-2"><FaExclamationCircle className="mt-0.5 shrink-0" />{error}</div>}
                <button type="submit" disabled={status === "submitting"} className="w-full bg-[#002344] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF6600] transition flex items-center justify-center gap-3 disabled:opacity-60">{status === "submitting" ? <><FaSpinner className="animate-spin" /> Submitting...</> : <>Submit Membership Application <FaArrowRight /></>}</button>
            </form>
            <style>{`.field-label{display:block;font-size:.72rem;font-weight:800;color:#52525b;text-transform:uppercase;letter-spacing:.07em;margin:0 0 .4rem .15rem}`}</style>
        </div>
    );
}
