import { useState } from "react";
import { FaArrowRight, FaCheckCircle, FaExclamationCircle, FaSpinner, FaLock } from "react-icons/fa";
import { ALL_COUNTRIES } from "../data/countries";
import { ENDPOINTS } from "../config/api";

const initialForm = { fullName: "", email: "", confirmEmail: "", countryCode: "+91", phone: "", password: "", memberType: "general", message: "" };
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
        if (formData.phone.replace(/\D/g, "").length < 7) return "Please enter a valid phone number.";
        if (formData.password.length < 8) return "Password must be at least 8 characters.";
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
        if (validationError) return setError(validationError);
        setStatus("submitting"); setError("");
        try {
            const payload = { ...formData, fullName: formData.fullName.trim(), email: formData.email.trim().toLowerCase(), confirmEmail: formData.confirmEmail.trim().toLowerCase(), phone: `${formData.countryCode} ${formData.phone.trim()}` };
            const accountResponse = await fetch(ENDPOINTS.MEMBER_ACCOUNT_SIGNUP, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
            const accountResult = await accountResponse.json().catch(() => ({}));
            if (!accountResponse.ok || !accountResult.user) throw new Error(accountResult.message || "Unable to create membership account.");
            const user = persistSession(accountResult.user);

            if (formData.memberType === "advisory") {
                setStatus("success");
                setError("Advisory membership request saved. Our team will contact you for review.");
                setFormData(initialForm);
                return;
            }

            const paymentResponse = await fetch(ENDPOINTS.MEMBER_PAYMENT_LINK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ memberId: user.id }) });
            const paymentResult = await paymentResponse.json().catch(() => ({}));
            if (paymentResult.paymentUrl) {
                window.location.href = paymentResult.paymentUrl;
                return;
            }
            if (paymentResult.fallbackUrl) {
                window.location.href = paymentResult.fallbackUrl;
                return;
            }
            throw new Error(paymentResult.message || "Membership account created, but payment could not be started.");
        } catch (err) {
            console.error("Membership signup error:", err);
            setStatus("error"); setError(err.message || "Unable to complete membership signup.");
        }
    };

    if (status === "success") return <div className="p-8 md:p-10 rounded-[2rem] bg-white border border-emerald-100 text-center space-y-5"><div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl"><FaCheckCircle /></div><h2 className="text-2xl font-black text-[#002344]">Membership Request Saved</h2><p className="text-zinc-600">{error}</p><a href="/MemberDashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#002344] text-white font-bold">Open My Dashboard <FaArrowRight /></a></div>;

    return <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-xl border border-zinc-100">
        <div className="mb-7"><p className="text-xs uppercase tracking-widest font-bold text-[#FF6600]">Official Membership</p><h3 className="text-2xl font-black text-[#002344] mt-1">Create Your Member Account</h3><p className="text-sm text-zinc-500 mt-2">Apply → create dashboard → pay membership fee → admin review → Member ID + Certificate.</p></div>
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
                <div><label className="field-label">Full Name</label><input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Your full name" className="field-input" /></div>
                <div><label className="field-label">Phone</label><div className="flex gap-2"><select name="countryCode" value={formData.countryCode} onChange={handleChange} className="field-input w-28">{ALL_COUNTRIES.map((c, i) => <option key={`${c.name}-${i}`} value={c.code}>{c.code} {c.label.slice(0, 12)}</option>)}</select><input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" className="field-input flex-1" /></div></div>
                <div><label className="field-label">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="field-input" /></div>
                <div><label className="field-label">Confirm Email</label><input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required placeholder="Confirm email" className="field-input" /></div>
                <div><label className="field-label">Create Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} placeholder="Minimum 8 characters" className="field-input" /></div>
                <div><label className="field-label">Membership Type</label><select name="memberType" value={formData.memberType} onChange={handleChange} className="field-input"><option value="general">General Member — ₹1,200/year</option><option value="active">Active Member — ₹2,500/year</option><option value="life">Life Member — ₹8,000+ one-time</option><option value="advisory">Advisory / Expert — By invitation</option></select></div>
            </div>
            <div><label className="field-label">Why do you want to join?</label><textarea name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Tell us briefly about your interest and how you would like to contribute." className="field-input resize-none" /></div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900"><div className="font-bold flex items-center gap-2"><FaLock /> Payment & account flow</div><p className="mt-1">Selected plan: <strong>{amounts[formData.memberType]}</strong>. For paid membership, the payment page opens immediately after account creation.</p></div>
            {error && status === "error" && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold flex gap-2"><FaExclamationCircle className="mt-0.5" />{error}</div>}
            <button type="submit" disabled={status === "submitting"} className="w-full bg-[#002344] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF6600] transition-all flex items-center justify-center gap-3 disabled:opacity-50">{status === "submitting" ? <><FaSpinner className="animate-spin" /> Creating account...</> : <>Create Account & Continue to Payment <FaArrowRight /></>}</button>
        </form>
        <style>{`.field-label{display:block;font-size:.72rem;font-weight:800;color:#a1a1aa;text-transform:uppercase;letter-spacing:.08em;margin:0 0 .45rem .25rem}.field-input{width:100%;padding:.85rem 1rem;background:#fafafa;border:1px solid #f4f4f5;border-radius:.8rem;outline:none;font-weight:500}.field-input:focus{border-color:#bfdbfe;box-shadow:0 0 0 4px rgba(59,130,246,.08)}`}</style>
    </div>;
}
