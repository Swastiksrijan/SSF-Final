import { useState } from "react";
import { FaArrowRight, FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";
import { Alert, Field, FileField, FormNote, Input, Select, SubmitButton, SuccessPanel, Textarea } from "./forms/FormUI";

const PAYMENT_LINK = "https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view";

const MEMBER_TYPES = {
    general: { title: "General Member", hindi: "साधारण सदस्य", role: "भूमिका", fee: "₹100/month", note: "₹1,200/year", payment: true, description: "For individuals who want to stay connected with SSF and support its mission through regular membership." },
    active: { title: "Active Member", hindi: "सक्रिय सदस्य", role: "भूमिका", fee: "₹2,500/year", note: "One-time or installments", payment: true, description: "For members who want to take an active role in SSF programmes, activities and community service." },
    life: { title: "Life Member", hindi: "आजीवन सदस्य", role: "भूमिका", fee: "₹8,000+", note: "One-time contribution", payment: true, description: "For long-term association with SSF through a one-time life membership contribution." },
    advisory: { title: "Advisory / Expert Member", hindi: "सलाहकार / विशेषज्ञ सदस्य", role: "भूमिका", fee: "Honorary", note: "No membership fee", payment: false, description: "For experienced professionals and experts contributing knowledge, guidance or specialised support." },
};

const ID_PROOF_TYPES = ["Aadhaar Card", "PAN Card", "Voter ID", "Driving Licence", "Passport", "College / Student ID", "Other Government ID"];
const PAYMENT_MODES = ["Razorpay (online)", "UPI", "Bank transfer / NEFT", "Cash (paid at office)"];

const initialForm = { fullName: "", email: "", confirmEmail: "", phone: "", password: "", memberType: "general", idProofType: "Aadhaar Card", identityNumber: "", message: "", profilePhoto: null, idDocument: null };

export default function MemberForm({ initialMemberType = "general" }) {
    const [form, setForm] = useState({ ...initialForm, memberType: initialMemberType });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [submittedType, setSubmittedType] = useState(null);
    const [submittedId, setSubmittedId] = useState(null);
    const [payment, setPayment] = useState({ mode: PAYMENT_MODES[0], reference: "" });
    const [payState, setPayState] = useState("idle");
    const [payMessage, setPayMessage] = useState("");
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
        if (form.idDocument && form.idDocument.size > 5 * 1024 * 1024) return setError("Identity document must be 5MB or smaller."), setStatus("error");

        setStatus("submitting");
        try {
            const data = new FormData();
            data.append("fullName", form.fullName.trim());
            data.append("email", form.email.trim().toLowerCase());
            data.append("confirmEmail", form.confirmEmail.trim().toLowerCase());
            data.append("phone", form.phone.trim());
            data.append("password", form.password);
            data.append("memberType", form.memberType);
            data.append("idProofType", form.idProofType);
            data.append("identityNumber", form.identityNumber.trim());
            data.append("message", form.message.trim());
            data.append("profile_photo", form.profilePhoto);
            if (form.idDocument) data.append("id_document", form.idDocument);

            const response = await fetch(ENDPOINTS.MEMBER_SIGNUP, { method: "POST", body: data });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || `Membership application failed (HTTP ${response.status}).`);
            setSubmittedType(form.memberType);
            setSubmittedId(result?.user?.id || result?.data?.id || null);
            setStatus("success");
        } catch (err) {
            console.error("Membership application error:", err);
            setError(err.message || "Unable to submit the application. Please try again.");
            setStatus("error");
        }
    };

    const recordPayment = async () => {
        setPayMessage("");
        if (!submittedId) return setPayMessage("Your application reference is missing. Please contact the SSF team.");
        if (!payment.mode) return setPayMessage("Please select how you paid the membership fee.");
        if (payment.reference.trim().length < 4) return setPayMessage("Please enter the UPI / UTR / receipt reference from your payment.");
        setPayState("submitting");
        try {
            const response = await fetch(ENDPOINTS.MEMBER_PAYMENT_SUBMIT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ memberId: submittedId, paymentMode: payment.mode, paymentReference: payment.reference.trim() }) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Unable to record your payment details.");
            setPayState("success");
            setPayMessage(result.message || "Payment details received. Our team will verify and confirm your membership.");
        } catch (err) {
            setPayState("error");
            setPayMessage(err.message || "Unable to record your payment details. Please try again.");
        }
    };

    const reset = () => {
        setForm({ ...initialForm, memberType: initialMemberType });
        setSubmittedType(null);
        setSubmittedId(null);
        setPayment({ mode: PAYMENT_MODES[0], reference: "" });
        setPayState("idle");
        setPayMessage("");
        setError("");
        setStatus("idle");
    };

    if (status === "success") {
        const type = MEMBER_TYPES[submittedType] || MEMBER_TYPES.general;
        return <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-[#EAF0F6]">
            <SuccessPanel title="Membership Application Submitted" actions={
                <><a href="/UserPortal" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#12345A] text-white font-bold">Open My SSF Dashboard <FaArrowRight /></a>
                <button type="button" onClick={reset} className="px-5 py-3 rounded-xl bg-[#EAF0F6] text-[#26343D] font-bold">Submit another application</button></>
            }>
                Your application has been received for <strong>{type.title}</strong>. Our team will review your documents and membership details.
            </SuccessPanel>
            <div className="rounded-2xl bg-[#EAF0F6] border border-[#EAF0F6] p-5 mt-2"><p className="text-xs font-black uppercase tracking-wider text-[#12345A]">Selected Membership</p><div className="flex items-start justify-between gap-4 mt-2"><div><h4 className="text-lg font-black text-[#12345A]">{type.title}</h4><p className="text-sm text-[#26343D]">{type.hindi}</p></div><div className="text-right"><p className="font-black text-[#12345A]">{type.fee}</p><p className="text-xs text-[#26343D]">{type.note}</p></div></div></div>
            {type.payment ? <div className="rounded-2xl border border-[#EAF0F6] p-5 mt-4"><h4 className="font-black text-[#12345A]">Membership payment</h4><p className="text-sm text-[#26343D] mt-1">Your application is approved only after the fee is confirmed. Complete the payment through the secure Razorpay page, then record your reference below.</p><a href={PAYMENT_LINK} target="_blank" rel="noreferrer" className="mt-4 w-full inline-flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-[#12345A] text-white font-black hover:bg-[#176447] transition">Pay Membership Fee <FaExternalLinkAlt className="text-sm" /></a>{payState === "success" ? <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4"><p className="font-bold text-emerald-800">Payment details received</p><p className="text-sm text-emerald-700 mt-1">{payMessage}</p></div> : <div className="mt-4 space-y-3"><Field label="How did you pay?" required><Select value={payment.mode} onChange={e => setPayment(p => ({ ...p, mode: e.target.value }))}>{PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}</Select></Field><Field label="UPI / UTR / Receipt reference" required><Input value={payment.reference} onChange={e => setPayment(p => ({ ...p, reference: e.target.value }))} placeholder="e.g. 425789123456" /></Field>{payState === "error" && <Alert tone="error">{payMessage}</Alert>}<button type="button" onClick={recordPayment} disabled={payState === "submitting"} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#176447] text-white font-black disabled:opacity-60">{payState === "submitting" ? "Submitting…" : "I have paid · Submit payment details"}</button></div>}<p className="text-xs text-[#26343D] mt-3 text-center">Payment is processed on Razorpay's secure hosted page.</p></div> : <div className="rounded-2xl bg-[#EAF0F6] border border-[#EAF0F6] p-5 mt-4 text-sm text-[#26343D]"><strong>Advisory / Expert Membership is honorary.</strong> No membership fee is required. Our team will contact you regarding the advisory role.</div>}
        </div>;
    }

    return <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-[#EAF0F6]">
        <div className="mb-6"><p className="ssf-eyebrow">Join Swastik Srijan Foundation</p><h3 className="ssf-form-title">Choose your membership</h3><p className="ssf-form-sub">Select the membership that best matches your intended role with SSF.</p></div>
        <div className="grid sm:grid-cols-2 gap-3 mb-7">
            {Object.entries(MEMBER_TYPES).map(([key, type]) => <button key={key} type="button" onClick={() => set("memberType", key)} className={`text-left rounded-2xl border p-4 transition ${form.memberType === key ? "border-[#176447] bg-[#EAF0F6] ring-2 ring-[#176447]/25" : "border-[#EAF0F6] bg-white hover:border-[#176447]/40"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-black text-[#12345A]">{type.title}</p><p className="text-sm text-[#26343D] mt-0.5">{type.hindi}</p></div>{form.memberType === key && <FaCheckCircle className="text-[#176447] mt-1 shrink-0" />}</div><p className="text-xs font-bold text-[#26343D] mt-3">{type.role}</p><p className="text-lg font-black text-[#12345A] mt-1">{type.fee}</p><p className="text-xs text-[#26343D] mt-0.5">{type.note}</p></button>)}
        </div>

        <div className="rounded-2xl bg-[#12345A] text-white p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><p className="text-xs font-black uppercase tracking-wider text-[#F7A814]">Selected membership</p><h4 className="text-xl font-black mt-1">{selected.title}</h4><p className="text-sm text-white/70 mt-1">{selected.description}</p><p className="text-xs text-white/60 mt-2">{selected.fee} · {selected.note}</p></div>
                {selected.payment ? <a href={PAYMENT_LINK} target="_blank" rel="noreferrer" className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#176447] text-white font-black hover:bg-white hover:text-[#12345A] transition shadow-lg">Pay Membership Fee <FaExternalLinkAlt className="text-sm" /></a> : <div className="shrink-0 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white/90">Honorary · No fee</div>}
            </div>
            {selected.payment && <p className="text-[11px] text-white/50 mt-3">Payment option is available for this selected paid membership. You can pay through Razorpay before or after submitting the application.</p>}
        </div>

        <form onSubmit={submit} className="ssf-form" noValidate>
            <div className="ssf-form-grid ssf-form-grid-2">
                <Field label="Full Name" required><Input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Your full name" autoComplete="name" /></Field>
                <Field label="Email" required><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" autoComplete="email" /></Field>
                <Field label="Confirm Email" required><Input type="email" value={form.confirmEmail} onChange={e => set("confirmEmail", e.target.value)} placeholder="Confirm email" autoComplete="email" /></Field>
                <Field label="Mobile Number" required><Input type="tel" inputMode="numeric" value={form.phone} onChange={e => set("phone", e.target.value.replace(/[^0-9 +()-]/g, ""))} placeholder="Your mobile number" autoComplete="tel" /></Field>
            </div>
            <div className="ssf-form-grid ssf-form-grid-2">
                <Field label="Create Password" required hint="Minimum 8 characters"><Input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Minimum 8 characters" minLength={8} autoComplete="new-password" /></Field>
                <Field label="Membership Type" required><Select value={form.memberType} onChange={e => set("memberType", e.target.value)}><option value="general">General Member</option><option value="active">Active Member</option><option value="life">Life Member</option><option value="advisory">Advisory / Expert</option></Select></Field>
            </div>
            <div className="ssf-form-grid ssf-form-grid-2">
                <Field label="Identity Proof Type" hint="Optional"><Select value={form.idProofType} onChange={e => set("idProofType", e.target.value)}>{ID_PROOF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</Select></Field>
                <Field label="ID Number" hint="Optional · Aadhaar / PAN / other ID number"><Input value={form.identityNumber} onChange={e => set("identityNumber", e.target.value)} placeholder="e.g. Aadhaar or PAN number" /></Field>
            </div>
            <Field label="Why do you want to join?"><Textarea rows={4} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Tell us briefly how you would like to contribute." /></Field>
            <div className="ssf-form-grid ssf-form-grid-2">
                <FileField label="Profile Photo" required accept="image/jpeg,image/png,image/webp,image/heic,image/heif" hint="JPG, PNG or WebP · max 2MB" onChange={e => set("profilePhoto", e.target.files?.[0] || null)} />
                <FileField label="Identity Document" accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,application/pdf" hint="Optional · JPG, PNG, WebP or PDF · max 5MB" onChange={e => set("idDocument", e.target.files?.[0] || null)} />
            </div>
            <FormNote>Your selected membership type will be submitted with the application. For paid membership, the Pay Membership Fee button appears immediately when a paid type is selected. The identity document is optional — add Aadhaar / PAN / Voter ID only if you have it handy.</FormNote>
            {status === "error" && <Alert tone="error">{error}</Alert>}
            <SubmitButton busy={status === "submitting"}>Submit Membership Application <FaArrowRight /></SubmitButton>
        </form>
    </div>;
}
