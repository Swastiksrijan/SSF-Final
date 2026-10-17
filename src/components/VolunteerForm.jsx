import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";
import { Alert, Field, FileField, FormNote, Input, Select, SubmitButton, SuccessPanel, Textarea } from "./forms/FormUI";

const ID_PROOF_TYPES = ["Aadhaar Card", "PAN Card", "Voter ID", "Driving Licence", "Passport", "College / Student ID", "Other Government ID"];

const initialForm = { name: "", email: "", phone: "", volunteerType: "field", idType: "Aadhaar Card", identityNumber: "", message: "", profilePhoto: null, idDocument: null };

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
        if (!form.profilePhoto) return setError("Please upload your profile photo."), setStatus("error");
        if (form.profilePhoto.size > 2 * 1024 * 1024) return setError("Profile photo must be 2MB or smaller."), setStatus("error");
        if (form.idDocument && form.idDocument.size > 5 * 1024 * 1024) return setError("Identity document must be 5MB or smaller."), setStatus("error");

        setStatus("submitting");
        try {
            const data = new FormData();
            data.append("name", form.name.trim());
            data.append("email", form.email.trim().toLowerCase());
            data.append("phone", form.phone.trim());
            data.append("volunteer_type", form.volunteerType);
            data.append("position", "General Volunteer");
            data.append("id_type", form.idType);
            data.append("identity_number", form.identityNumber.trim());
            data.append("message", form.message.trim());
            data.append("profile_photo", form.profilePhoto);
            if (form.idDocument) data.append("id_document", form.idDocument);

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
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#EAF0F6]">
            <SuccessPanel title="Volunteer Application Submitted" reference={reference} actions={
                <button type="button" onClick={() => { setForm(initialForm); setReference(""); setError(""); setStatus("idle"); }} className="px-5 py-3 rounded-xl bg-[#EAF0F6] text-[#26343D] font-bold">Submit another application</button>
            }>
                Thank you. Your application has been received and will be reviewed by our team.
            </SuccessPanel>
        </div>
    );

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-[#EAF0F6]">
            <div className="mb-6"><p className="ssf-eyebrow">Volunteer Application</p><h3 className="ssf-form-title">Serve with SSF</h3><p className="ssf-form-sub">A simple application for people who want to support Swastik Srijan Foundation.</p></div>
            <form onSubmit={submit} className="ssf-form" noValidate>
                <div className="ssf-form-grid ssf-form-grid-2">
                    <Field label="Full Name" required><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" autoComplete="name" /></Field>
                    <Field label="Email" required><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" autoComplete="email" /></Field>
                </div>
                <div className="ssf-form-grid ssf-form-grid-2">
                    <Field label="Mobile Number" required><Input type="tel" inputMode="numeric" value={form.phone} onChange={e => set("phone", e.target.value.replace(/[^0-9 +()-]/g, ""))} placeholder="Your mobile number" autoComplete="tel" /></Field>
                    <Field label="Volunteer Type" required><Select value={form.volunteerType} onChange={e => set("volunteerType", e.target.value)}><option value="field">Field Volunteer</option><option value="program">Program Volunteer</option><option value="professional">Professional Volunteer</option><option value="digital">Digital / Online Volunteer</option></Select></Field>
                </div>
                <div className="ssf-form-grid ssf-form-grid-2">
                    <Field label="Identity Proof Type" hint="Optional"><Select value={form.idType} onChange={e => set("idType", e.target.value)}>{ID_PROOF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</Select></Field>
                    <Field label="ID Number" hint="Optional · Aadhaar / PAN / other ID number"><Input value={form.identityNumber} onChange={e => set("identityNumber", e.target.value)} placeholder="e.g. Aadhaar or PAN number" /></Field>
                </div>
                <Field label="Why do you want to volunteer?" required><Textarea rows={4} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Tell us briefly how you would like to contribute." /></Field>
                <div className="ssf-form-grid ssf-form-grid-2">
                    <FileField label="Profile Photo" required accept="image/jpeg,image/png,image/webp,image/heic,image/heif" hint="JPG, PNG or WebP · max 2MB" onChange={e => set("profilePhoto", e.target.files?.[0] || null)} />
                    <FileField label="Identity Document" accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,application/pdf" hint="Optional · JPG, PNG, WebP or PDF · max 5MB" onChange={e => set("idDocument", e.target.files?.[0] || null)} />
                </div>
                <FormNote>Your profile photo is used for your official Volunteer ID card. The identity document is optional — add Aadhaar / PAN / Voter ID only if you have it handy; you can also share it later with the SSF team.</FormNote>
                {status === "error" && <Alert tone="error">{error}</Alert>}
                <SubmitButton busy={status === "submitting"}>Submit Volunteer Application <FaArrowRight /></SubmitButton>
            </form>
        </div>
    );
}
