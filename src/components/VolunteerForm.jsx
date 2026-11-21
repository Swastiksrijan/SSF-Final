import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";
import { Alert, Field, FileField, FormNote, Input, Select, SubmitButton, SuccessPanel, Textarea } from "./forms/FormUI";

const ID_PROOF_TYPES = ["Aadhaar Card", "PAN Card", "Voter ID", "Driving Licence", "Passport", "College / Student ID", "Other Government ID"];
const initialForm = {
  name: "", email: "", phone: "", dob: "", guardianName: "", occupation: "", education: "",
  gender: "", address: "", city: "", districtState: "", pin: "", volunteerType: "field",
  position: "General Community Support", otherRole: "", idType: "", identityNumber: "",
  message: "", availability: "", preferredLocation: "", profilePhoto: null, idDocument: null,
  truth: false, conduct: false, noGuarantee: false, photoConsent: false
};

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
    if (!form.truth || !form.conduct || !form.noGuarantee) return setError("Please confirm all required declarations before submitting."), setStatus("error");
    if (form.profilePhoto && form.profilePhoto.size > 2 * 1024 * 1024) return setError("Passport-size photo must be 2MB or smaller."), setStatus("error");
    if (form.idDocument && form.idDocument.size > 5 * 1024 * 1024) return setError("Identity document must be 5MB or smaller."), setStatus("error");

    setStatus("submitting");
    try {
      const data = new FormData();
      ["name","email","phone","volunteerType","position","idType","identityNumber"].forEach(key => data.append(
        ({volunteerType:"volunteer_type",idType:"id_type",identityNumber:"identity_number"})[key] || key,
        String(form[key] || "").trim()
      ));
      const additionalDetails = {
        dateOfBirth: form.dob, guardianName: form.guardianName, occupation: form.occupation,
        education: form.education, gender: form.gender, address: form.address, city: form.city,
        districtState: form.districtState, pin: form.pin, otherPreferredRole: form.otherRole,
        availability: form.availability, preferredLocation: form.preferredLocation,
        declarations: { truth: form.truth, conduct: form.conduct, noGuarantee: form.noGuarantee, photoConsent: form.photoConsent }
      };
      data.append("message", JSON.stringify({ motivation: form.message.trim(), additionalDetails }));
      if (form.profilePhoto) data.append("profile_photo", form.profilePhoto);
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

  const Check = ({name,children,required=false}) => (
    <label className="flex items-start gap-2 text-sm text-slate-700">
      <input type="checkbox" checked={form[name]} required={required} onChange={e=>set(name,e.target.checked)} className="mt-1 accent-[#176447]" />
      <span>{children}</span>
    </label>
  );

  return (
    <div className="bg-white p-5 md:p-8 rounded-3xl shadow-xl border border-[#EAF0F6]">
      <div className="mb-6"><p className="ssf-eyebrow">Volunteer Application / स्वयंसेवक आवेदन</p><h3 className="ssf-form-title">Serve with SSF</h3><p className="ssf-form-sub">Please complete the details below. This online form follows the SSF hardcopy application.</p></div>
      <form onSubmit={submit} className="ssf-form space-y-5" noValidate>
        <h4 className="font-bold text-[#12345A]">1. Applicant Details / आवेदक का व्यक्तिगत विवरण</h4>
        <div className="ssf-form-grid ssf-form-grid-2">
          <Field label="Full Name / पूरा नाम" required><Input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your full name" autoComplete="name" /></Field>
          <Field label="Email Address / ईमेल" required><Input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="you@example.com" autoComplete="email" /></Field>
          <Field label="Mobile Number / मोबाइल नंबर" required><Input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value.replace(/[^0-9 +()-]/g,""))} placeholder="Your mobile number" autoComplete="tel" /></Field>
          <Field label="Date of Birth / जन्मतिथि"><Input type="date" value={form.dob} onChange={e=>set("dob",e.target.value)} /></Field>
          <Field label="Parent or Guardian Name / अभिभावक का नाम"><Input value={form.guardianName} onChange={e=>set("guardianName",e.target.value)} /></Field>
          <Field label="Occupation / व्यवसाय"><Input value={form.occupation} onChange={e=>set("occupation",e.target.value)} /></Field>
          <Field label="Educational Qualification / शैक्षणिक योग्यता"><Input value={form.education} onChange={e=>set("education",e.target.value)} /></Field>
          <Field label="Gender / लिंग (Optional)"><Select value={form.gender} onChange={e=>set("gender",e.target.value)}><option value="">Prefer not to say</option><option>Male</option><option>Female</option><option>Other</option></Select></Field>
          <Field label="Full Current Address / पूरा वर्तमान पता"><Input value={form.address} onChange={e=>set("address",e.target.value)} /></Field>
          <Field label="City / शहर"><Input value={form.city} onChange={e=>set("city",e.target.value)} /></Field>
          <Field label="District & State / जिला एवं राज्य"><Input value={form.districtState} onChange={e=>set("districtState",e.target.value)} /></Field>
          <Field label="PIN Code / पिन कोड"><Input value={form.pin} onChange={e=>set("pin",e.target.value)} inputMode="numeric" /></Field>
        </div>

        <h4 className="font-bold text-[#12345A]">2. Volunteer Type & Preferred Role / स्वयंसेवा का प्रकार एवं पसंदीदा भूमिका</h4>
        <div className="ssf-form-grid ssf-form-grid-2">
          <Field label="Volunteer Type / स्वयंसेवा का प्रकार" required><Select value={form.volunteerType} onChange={e=>set("volunteerType",e.target.value)}><option value="field">Field Volunteer</option><option value="program">Program Volunteer</option><option value="professional">Professional Volunteer</option><option value="digital">Digital / Online Volunteer</option></Select></Field>
          <Field label="Preferred Area / पसंदीदा कार्यक्षेत्र" required><Select value={form.position} onChange={e=>set("position",e.target.value)}><option value="Education & Mentoring">Education & Mentoring</option><option value="Health & Well-being">Health & Well-being</option><option value="Skills & Livelihoods">Skills & Livelihoods</option><option value="Environment & Rural Development">Environment & Rural Development</option><option value="Digital & Creative Support">Digital & Creative Support</option><option value="Partnerships & Resource Support">Partnerships & Resource Support</option><option value="General Community Support">General Community Support</option></Select></Field>
        </div>
        <Field label="Other Preferred Role / अन्य पसंदीदा भूमिका"><Input value={form.otherRole} onChange={e=>set("otherRole",e.target.value)} /></Field>

        <h4 className="font-bold text-[#12345A]">3. Identity Details / पहचान विवरण</h4>
        <div className="ssf-form-grid ssf-form-grid-2">
          <Field label="Identity Proof Type / पहचान पत्र का प्रकार (Optional)"><Select value={form.idType} onChange={e=>set("idType",e.target.value)}><option value="">Not provided</option>{ID_PROOF_TYPES.map(t=><option key={t}>{t}</option>)}</Select></Field>
          <Field label="Identity Number / पहचान पत्र संख्या (Optional)"><Input value={form.identityNumber} onChange={e=>set("identityNumber",e.target.value)} placeholder="Optional" /></Field>
        </div>
        <FormNote>Providing Aadhaar, PAN, Voter ID or other identity details is optional. Do not upload original documents.</FormNote>

        <h4 className="font-bold text-[#12345A]">4. Photo & Documents / फोटो एवं दस्तावेज</h4>
        <div className="ssf-form-grid ssf-form-grid-2">
          <FileField label="Passport-size Photo / पासपोर्ट आकार की फोटो (Optional)" accept="image/jpeg,image/png,image/webp" hint="Recent colour photo · JPG, PNG or WebP · max 2MB · not required" onChange={e=>set("profilePhoto",e.target.files?.[0] || null)} />
          <FileField label="Identity Proof Copy / पहचान पत्र की प्रति (Optional)" accept=".jpg,.jpeg,.png,.webp,.pdf,application/pdf" hint="JPG, PNG, WebP or PDF · max 5MB" onChange={e=>set("idDocument",e.target.files?.[0] || null)} />
        </div>
        <FormNote>Your application can be submitted even if you do not upload a photo or identity document. / फोटो या पहचान पत्र अपलोड किए बिना भी आवेदन जमा किया जा सकता है।</FormNote>

        <h4 className="font-bold text-[#12345A]">5. Motivation & Contribution / प्रेरणा एवं योगदान</h4>
        <Field label="Why do you want to volunteer and how can you contribute? / आप स्वयंसेवा क्यों करना चाहते हैं और कैसे योगदान देंगे?" required><Textarea rows={4} value={form.message} onChange={e=>set("message",e.target.value)} placeholder="Tell us briefly about your motivation and contribution." /></Field>
        <div className="ssf-form-grid ssf-form-grid-2">
          <Field label="Availability (Days / Time) / उपलब्धता"><Input value={form.availability} onChange={e=>set("availability",e.target.value)} /></Field>
          <Field label="Preferred Location / पसंदीदा स्थान"><Input value={form.preferredLocation} onChange={e=>set("preferredLocation",e.target.value)} /></Field>
        </div>

        <h4 className="font-bold text-[#12345A]">6. Declaration & Consent / घोषणा एवं सहमति</h4>
        <div className="space-y-3 rounded-xl bg-slate-50 p-4">
          <Check name="truth" required>The information provided by me is true to the best of my knowledge. / मेरे द्वारा दी गई जानकारी मेरी जानकारी के अनुसार सही है। *</Check>
          <Check name="conduct" required>I agree to follow the Foundation’s objectives, rules, code of conduct and instructions. / मैं संस्था के उद्देश्यों, नियमों और आचार-संहिता का पालन करूँगा/करूँगी। *</Check>
          <Check name="noGuarantee" required>I understand that applying does not guarantee appointment or payment/honorarium. / आवेदन से नियुक्ति या मानदेय की गारंटी नहीं मिलती। *</Check>
          <Check name="photoConsent">If I upload a photo, I consent to its use for volunteer identification and internal records. / फोटो अपलोड करने पर मैं उसके पहचान-पत्र एवं आंतरिक रिकॉर्ड में उपयोग की सहमति देता/देती हूँ।</Check>
        </div>
        {status === "error" && <Alert tone="error">{error}</Alert>}
        <SubmitButton busy={status === "submitting"}>Submit Volunteer Application / आवेदन जमा करें <FaArrowRight /></SubmitButton>
      </form>
    </div>
  );
}
