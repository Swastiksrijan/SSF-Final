import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";
import { Alert, Field, FileField, FormHead, FormNote, Input, Select, SubmitButton, SuccessPanel, Textarea } from "./forms/FormUI";

const INITIAL = {
  fullName: "", email: "", countryCode: "+91", phone: "", college: "", course: "",
  internshipType: "", duration: "", startDate: "", message: "", idType: "Aadhaar Card", identityNumber: ""
};

const ID_PROOF_TYPES = ["Aadhaar Card", "PAN Card", "Voter ID", "Driving Licence", "Passport", "College / Student ID", "Other Government ID"];

const roles = [
  ["social_media", "Social Media & Marketing"],
  ["content_writing", "Content Writing & Blogging"],
  ["field_research", "Field Research & Impact"],
  ["edu_support", "Education & Mentorship"],
  ["tech_dev", "Web Development & Tech"]
];

export default function InternshipForm({ onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [resume, setResume] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [idDocument, setIdDocument] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const update = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.fullName.trim().length < 3) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Please enter a valid email address.");
    if (form.phone.replace(/\D/g, "").length < 7) return setError("Please enter a valid mobile number.");
    if (!form.college.trim()) return setError("Please enter your college / institution.");
    if (!form.course.trim()) return setError("Please enter your course / qualification.");
    if (!form.internshipType) return setError("Please select an internship area.");
    if (!form.duration) return setError("Please select your preferred duration.");
    if (!resume) return setError("Please upload your resume (PDF, DOC or DOCX).");
    if (resume.size > 5 * 1024 * 1024) return setError("Resume must be 5 MB or smaller.");
    if (!profilePhoto) return setError("Please upload a profile photo (used for your Internship ID card).");
    if (profilePhoto.size > 2 * 1024 * 1024) return setError("Profile photo must be 2 MB or smaller.");
    if (idDocument && idDocument.size > 5 * 1024 * 1024) return setError("Identity document must be 5 MB or smaller.");
    setStatus("submitting"); setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.set("phone", `${form.countryCode} ${form.phone}`);
      data.set("id_type", form.idType);
      data.set("identity_number", form.identityNumber.trim());
      data.append("resume", resume);
      data.append("profile_photo", profilePhoto);
      if (idDocument) data.append("id_document", idDocument);
      const response = await fetch(ENDPOINTS.INTERNSHIP, { method: "POST", body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to submit right now. Please try again.");
      setStatus("success");
    } catch (err) {
      console.error("Internship submission error:", err);
      setStatus("error"); setError(err.message || "Unable to submit right now. Please try again.");
    }
  };

  if (status === "success") return (
    <div className="p-8 md:p-12">
      <SuccessPanel title="Application Submitted" actions={
        onClose ? <button onClick={onClose} className="px-7 py-3 rounded-xl bg-[#12345A] text-white font-bold hover:bg-[#176447] transition-colors">Close</button> : null
      }>
        Thank you. Your internship application has been received. Our team will review it and contact you by email or phone.
      </SuccessPanel>
    </div>
  );

  return <div className="p-6 md:p-10">
    <FormHead eyebrow="Internship Application" title="Apply for an Internship" subtitle="इंटर्नशिप के लिए आवेदन करें" />
    <form onSubmit={submit} className="ssf-form mt-6" noValidate>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="Full Name" required><Input value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your full name" autoComplete="name" /></Field>
        <Field label="Email Address" required><Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" autoComplete="email" /></Field>
      </div>
      <Field label="Mobile Number" required>
        <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2">
          <Select value={form.countryCode} onChange={e => update("countryCode", e.target.value)}><option>+91</option><option>+1</option><option>+44</option><option>+61</option><option>+971</option></Select>
          <Input type="tel" inputMode="numeric" value={form.phone} onChange={e => update("phone", e.target.value.replace(/\D/g, ""))} placeholder="Enter mobile number" autoComplete="tel-national" />
        </div>
      </Field>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="College / Institution" required><Input value={form.college} onChange={e => update("college", e.target.value)} placeholder="College / university / institution" /></Field>
        <Field label="Course / Qualification" required><Input value={form.course} onChange={e => update("course", e.target.value)} placeholder="e.g. BCA, MBA, B.Tech" /></Field>
      </div>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="Internship Area" required><Select value={form.internshipType} onChange={e => update("internshipType", e.target.value)}><option value="">Select area</option>{roles.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</Select></Field>
        <Field label="Preferred Duration" required><Select value={form.duration} onChange={e => update("duration", e.target.value)}><option value="">Select duration</option><option>4 Weeks</option><option>6 Weeks</option><option>8 Weeks</option><option>12 Weeks</option><option>Flexible</option></Select></Field>
      </div>
      <Field label="Preferred Start Date"><Input type="date" value={form.startDate} onChange={e => update("startDate", e.target.value)} /></Field>
      <div className="ssf-form-grid ssf-form-grid-2">
        <FileField label="Resume / CV" required accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hint="PDF, DOC or DOCX · maximum 5 MB" onChange={e => setResume(e.target.files?.[0] || null)} />
        <FileField label="Profile Photo" required accept="image/jpeg,image/png,image/webp,image/heic,image/heif" hint="JPG, PNG or WebP · max 2MB · used for your Internship ID card" onChange={e => setProfilePhoto(e.target.files?.[0] || null)} />
      </div>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="Identity Proof Type" hint="Optional"><Select value={form.idType} onChange={e => update("idType", e.target.value)}>{ID_PROOF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</Select></Field>
        <Field label="ID Number" hint="Optional · Aadhaar / PAN / other ID number"><Input value={form.identityNumber} onChange={e => update("identityNumber", e.target.value)} placeholder="e.g. Aadhaar or PAN number" /></Field>
      </div>
      <FileField label="Identity Document" accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,application/pdf" hint="Optional · JPG, PNG, WebP or PDF · max 5MB" onChange={e => setIdDocument(e.target.files?.[0] || null)} />
      <Field label="Why do you want to intern with SSF?"><Textarea rows={4} value={form.message} onChange={e => update("message", e.target.value)} placeholder="Tell us about your interests, skills and what you hope to learn." /></Field>
      <FormNote>Your resume is used only for internship evaluation. Your profile photo is used for your Internship ID card; the identity document is optional — add Aadhaar / PAN / Voter ID only if you have it handy.</FormNote>
      {status === "error" && <Alert tone="error">{error}</Alert>}
      <SubmitButton busy={status === "submitting"} busyLabel="Submitting securely…">Submit Internship Application <FaArrowRight /></SubmitButton>
    </form>
  </div>;
}
