import { useState } from "react";
import { FaArrowRight, FaCheckCircle, FaExclamationCircle, FaExternalLinkAlt, FaSpinner, FaUpload } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

const PAYMENT_LINK = "https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view";

const MEMBER_TYPES = {
    general: {
        title: "General Member",
        hindi: "साधारण सदस्य",
        role: "भूमिका",
        fee: "₹100/month",
        note: "₹1,200/year",
        payment: true,
        description: "For individuals who want to stay connected with SSF and support its mission through regular membership.",
    },
    active: {
        title: "Active Member",
        hindi: "सक्रिय सदस्य",
        role: "भूमिका",
        fee: "₹2,500/year",
        note: "One-time or installments",
        payment: true,
        description: "For members who want to take an active role in SSF programmes, activities and community service.",
    },
    life: {
        title: "Life Member",
        hindi: "आजीवन सदस्य",
        role: "भूमिका",
        fee: "₹8,000+",
        note: "One-time contribution",
        payment: true,
        description: "For long-term association with SSF through a one-time life membership contribution.",
    },
    advisory: {
        title: "Advisory / Expert Member",
        hindi: "सलाहकार / विशेषज्ञ सदस्य",
        role: "भूमिका",
        fee: "Honorary",
        note: "No membership fee",
        payment: false,
        description: "For experienced professionals and experts contributing knowledge, guidance or specialised support.",
    },
};

const initialForm = { fullName: "", email: "", confirmEmail: "", phone: "", password: "", memberType: "general", message: "", profilePhoto: null, idDocument: null };
const inputClass = "w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400";

export default function MemberForm({ initialMemberType = "general" }) {
    const [form, setForm] = useState({ ...initialForm, memberType: initialMemberType });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [submittedType, setSubmittedType] = useState(null);

    const set = (name, value) => setForm(prev => ({ ...prev, [name]: value }));
    const selected = MEMBER_TYPES[form.memberType] || MEMBER_TYPES.general;

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
            setSubmittedType(form.memberType);
            setStatus("success");
        } catch (err) {
            console.error("Membership application error:", err);
            setError(err.message || "Unable to submit the application. Please try again.");
            setStatus("error");
        }
    };

    const reset = () => {
        setForm({ ...initialForm, memberType: initialMemberType });
        setSubmittedType(null);
        setError("");
        setStatus("idle");
    };

    if (status === "success") {
        const type = MEMBER_TYPES[submittedType] || MEMBER_TYPES.general;
        return (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-emerald-100 space-y-5">
                <div className="text-center">
                    <FaCheckCircle className="mx-auto text-5xl text-emerald-500" />
                    <h3 className="text-2xl font-black text-[#002344] mt-4">Membership Application Submitted</h3>
                    <p className="text-zinc-600 mt-2">Your application has been received for <strong>{type.title}</strong>. Our team will review your documents and membership details.</p>
                </div>

                <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
                    <p className="text-xs font-black uppercase tracking-wider text-orange-700">Selected Membership</p>
                    <div className="flex items-start justify-between gap-4 mt-2">
                        <div>
                            <h4 className="text-lg font-black text-[#002344]">{type.title}</h4>
                            <p className="text-sm text-zinc-600">{type.hindi}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-[#002344]">{type.fee}</p>
                            <p className="text-xs text-zinc-500">{type.note}</p>
                        </div>
                    </div>
                </div>

                {type.payment ? (
                    <div className="rounded-2xl border border-zinc-200 p-5">
                        <h4 className="font-black text-[#002344]">Membership payment</h4>
                        <p className="text-sm text-zinc-500 mt-1">Complete the applicable membership payment through the secure Razorpay payment page.</p>
                        <a href={PAYMENT_LINK} target="_blank" rel="noreferrer" className="mt-4 w-full inline-flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-[#002344] text-white font-black hover:bg-[#ff6600] transition">
                            Pay Membership Fee <FaExternalLinkAlt className="text-sm" />
                        </a>
                        <p className="text-xs text-zinc-400 mt-3 text-center">Payment is processed on Razorpay's secure hosted page.</p>
                    </div>
                ) : (
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-5 text-sm text-zinc-600">
                        <strong>Advisory / Expert Membership is honorary.</strong> No membership fee is required. Our team will contact you regarding the advisory role.
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="/MemberDashboard" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#002344] text-white font-bold">Open Member Dashboard <FaArrowRight /></a>
                    <button type="button" onClick={reset} className="px-5 py-3 rounded-xl bg-zinc-100 text-zinc-600 font-bold hover:bg-zinc-200">Submit another application</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-zinc-100">
            <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[.18em] text-[#ff6600]">Join Swastik Srijan Foundation</p>
                <h3 className="text-2xl md:text-3xl font-black text-[#002344] mt-1">Choose your membership</h3>
                <p className="mt-2 text-sm text-zinc-500">Select the membership that best matches your intended role with SSF.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-7">
                {Object.entries(MEMBER_TYPES).map(([key, type]) => (
                    <button key={key} type="button" onClick={() => set("memberType", key)} className={`text-left rounded-2xl border p-4 transition ${form.memberType === key ? "border-[#ff6600] bg-orange-50 ring-2 ring-orange-100" : "border-zinc-200 bg-white hover:border-orange-200"}`}>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="font-black text-[#002344]">{type.title}</p>
                                <p className="text-sm text-zinc-500 mt-0.5">{type.hindi}</p>
                            </div>
                            {form.memberType === key && <FaCheckCircle className="text-[#ff6600] mt-1 shrink-0" />}
                        </div>
                        <p className="text-xs font-bold text-zinc-400 mt-3">{type.role}</p>
                        <p className="text-lg font-black text-[#002344] mt-1">{type.fee}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{type.note}</p>
                    </button>
                ))}
            </div>

            <div className="rounded-2xl bg-[#002344] text-white p-5 mb-6">
                <p className="text-xs font-black uppercase tracking-wider text-orange-300">Selected membership</p>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mt-1">
                    <div><h4 className="text-xl font-black">{selected.title}</h4><p className="text-sm text-white/70">{selected.description}</p></div>
                    <div className="sm:text-right shrink-0"><p className="text-xl font-black">{selected.fee}</p><p className="text-xs text-white/60">{selected.note}</p></div>
                </div>
            </div>

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
                <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-4 text-sm text-zinc-600">Your selected membership type will be submitted with the application. Paid membership applicants will see the Razorpay payment option after the application is accepted by the system.</div>
                {status === "error" && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-semibold flex gap-2"><FaExclamationCircle className="mt-0.5 shrink-0" />{error}</div>}
                <button type="submit" disabled={status === "submitting"} className="w-full bg-[#002344] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF6600] transition flex items-center justify-center gap-3 disabled:opacity-60">{status === "submitting" ? <><FaSpinner className="animate-spin" /> Submitting...</> : <>Submit Membership Application <FaArrowRight /></>}</button>
            </form>
            <style>{`.field-label{display:block;font-size:.72rem;font-weight:800;color:#52525b;text-transform:uppercase;letter-spacing:.07em;margin:0 0 .4rem .15rem}`}</style>
        </div>
    );
}
