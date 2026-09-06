import { useState } from "react";
import { FaArrowRight, FaCheckCircle, FaExclamationCircle, FaSpinner, FaLock, FaCamera } from "react-icons/fa";
import { ALL_COUNTRIES } from "../data/countries";
import { ENDPOINTS } from "../config/api";

const initialForm = { fullName: "", email: "", confirmEmail: "", countryCode: "+91", phone: "", password: "", memberType: "general", message: "", profilePhoto: null };
const amounts = { general: "₹1,200/year", active: "₹2,500/year", life: "₹8,000+ one-time", advisory: "By invitation" };

export default function MemberForm() {
    const [formData, setFormData] = useState(initialForm);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const validate = () => {
        if (formData.fullName.trim().length < 3) return "Please enter your full name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Please enter a valid email address.";
        if (formData.email.trim().toLowerCase() !== formData.confirmEmail.trim().toLowerCase()) return "Both email fields must match.";
        if (formData.phone.replace(/\D/g, "").length < 7) return "Please enter a valid mobile number.";
        if (formData.password.length < 8) return "Password must be at least 8 characters.";
        if (!formData.profilePhoto) return "Please upload a recent passport-size profile photo for your official Member ID Card.";
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(formData.profilePhoto.type)) return "Profile photo must be JPG, PNG or WebP.";
        if (formData.profilePhoto.size > 2 * 1024 * 1024) return "Profile photo must be 2MB or smaller.";
        if (formData.memberType !== "advisory" && !formData.message.trim()) return "Please tell us why you want to join.";
        return "";
    };

    const persistSession = (user) => {
        const session = { ...user, loggedInAt: new Date().toISOString() };
        localStorage.setItem("ssf_user_session", JSON.stringify(session));
        window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: session }));
        return session;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); setStatus("error"); return; }
        setStatus("submitting"); setError("");
        try {
            const payload = new FormData();
            payload.append("fullName", formData.fullName.trim());
            payload.append("email", formData.email.trim().toLowerCase());
            payload.append("confirmEmail", formData.confirmEmail.trim().toLowerCase());
            payload.append("phone", `${formData.countryCode} ${formData.phone.trim()}`);
            payload.append("password", formData.password);
            payload.append("memberType", formData.memberType);
            payload.append("message", formData.message.trim());
            payload.append("profile_photo", formData.profilePhoto);

            const applicationResponse = await fetch(ENDPOINTS.MEMBER_SIGNUP, { method: "POST", body: payload });
            const applicationResult = await applicationResponse.json().catch(() => ({}));
            if (!applicationResponse.ok) throw new Error(applicationResult.message || "Unable to submit membership application.");
            const user = persistSession(applicationResult.user || { ...applicationResult.data, id: applicationResult.data?.id });

            if (formData.memberType === "advisory") {
                setStatus("success"); setError("Advisory membership request saved. Our team will contact you for review."); setFormData(initialForm); return;
            }

            const paymentResponse = await fetch(ENDPOINTS.MEMBER_PAYMENT_LINK, {
                method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ memberId: user.id })
            });
            const paymentResult = await paymentResponse.json().catch(() => ({}));
            if (paymentResult.paymentUrl) return window.location.href = paymentResult.paymentUrl;
            if (paymentResult.fallbackUrl) return window.location.href = paymentResult.fallbackUrl;
            throw new Error(paymentResult.message || "Membership account created, but payment could not be started.");
        } catch (err) {
            console.error("Membership signup error:", err); setStatus("error"); setError(err.message || "Unable to complete membership signup.");
        }
    };

    if (status === "success") return <div className="p-8 md:p-10 rounded-[2rem] bg-white border border-emerald-100 text-center space-y-5"><div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl"><FaCheckCircle /></div><h2 className="text-2xl font-black text-[#002344]">Membership Request Saved</h2><p className="text-zinc-600">{error}</p><a href="/MemberDashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#002344] text-white font-bold">Open My Dashboard <FaArrowRight /></a></div>;

    return <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-xl border border-zinc-100">
        <div className="mb-7"><p className="text-xs uppercase tracking-widest font-bold text-[#FF6600]">Official Membership</p><h3 className="text-2xl font-black text-[#002344] mt-1">Create Your Member Account</h3><p className="text-sm text-zinc-500 mt-2">Apply → upload photo → payment → admin review → Member ID Card + Membership Certificate.</p></div>
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
                <div><label className="field-label">Full Name</label><input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Your full name" className="field-input" /></div>
                <div><label className="field-label">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="field-input" /></div>
                <div><label className="field-label">Confirm Email</label><input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required placeholder="Confirm email" className="field-input" /></div>
                <div><label className="field-label">Create Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} placeholder="Minimum 8 characters" className="field-input" /></div>
                <div><label className="field-label">Membership Type</label><select name="memberType" value={formData.memberType} onChange={handleChange} className="field-input"><option value="general">General Member — ₹1,200/year</option><option value="active">Active Member — ₹2,500/year</option><option value="life">Life Member — ₹8,000+ one-time</option><option value="advisory">Advisory / Expert — By invitation</option></select></div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <label className="field-label text-blue-900">📱 Mobile Number *</label>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2 w-full">
                    <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="field-input !w-full bg-white" aria-label="Country code">{ALL_COUNTRIES.map((c, i) => <option key={`${c.name}-${i}`} value={c.code}>{c.code} {c.label.slice(0, 10)}</option>)}</select>
                    <input type="tel" inputMode="numeric" name="phone" value={formData.phone} onChange={(e) => handleChange({ target: { name: "phone", value: e.target.value.replace(/\D/g, "") } })} required placeholder="Enter mobile number" autoComplete="tel-national" className="field-input !w-full min-w-0 bg-white" />
                </div>
                <p className="mt-2 text-xs text-blue-700">Please enter the mobile number you actively use for communication.</p>
            </div>

            <div><label className="field-label flex items-center gap-2"><FaCamera /> Profile Photo *</label><input type="file" name="profilePhoto" accept="image/jpeg,image/png,image/webp" capture="user" onChange={(e) => setFormData(prev => ({ ...prev, profilePhoto: e.target.files?.[0] || null }))} required className="field-input file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-200 file:px-4 file:py-2 file:font-bold" />{formData.profilePhoto && <p className="mt-2 text-xs font-semibold text-emerald-600">Photo selected: {formData.profilePhoto.name}</p>}<p className="mt-1 text-xs text-zinc-400">Recent passport-size photo · JPG, PNG or WebP · maximum 2MB</p></div>
            <div><label className="field-label">Why do you want to join?</label><textarea name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Tell us briefly about your interest and how you would like to contribute." className="field-input resize-none" /></div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900"><div className="font-bold flex items-center gap-2"><FaLock /> Payment & account flow</div><p className="mt-1">Selected plan: <strong>{amounts[formData.memberType]}</strong>. The payment page opens after your account and application are saved.</p></div>
            {error && status === "error" && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold flex gap-2"><FaExclamationCircle className="mt-0.5" />{error}</div>}
            <button type="submit" disabled={status === "submitting"} className="w-full bg-[#002344] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF6600] transition-all flex items-center justify-center gap-3 disabled:opacity-50">{status === "submitting" ? <><FaSpinner className="animate-spin" /> Creating account...</> : <>Create Account & Continue to Payment <FaArrowRight /></>}</button>
        </form>
        <style>{`.field-label{display:block;font-size:.72rem;font-weight:800;color:#a1a1aa;text-transform:uppercase;letter-spacing:.08em;margin:0 0 .45rem .25rem}.field-input{width:100%;padding:.85rem 1rem;background:#fafafa;border:1px solid #f4f4f5;border-radius:.8rem;outline:none;font-weight:500}.field-input:focus{border-color:#bfdbfe;box-shadow:0 0 0 4px rgba(59,130,246,.08)}`}</style>
    </div>;
}
