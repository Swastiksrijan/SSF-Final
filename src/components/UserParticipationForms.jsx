import { useState } from "react";
import { FaArrowRight, FaCalendarAlt, FaExternalLinkAlt, FaGraduationCap, FaHandshake, FaHeart, FaTimes, FaTools, FaUserFriends, FaUsers } from "react-icons/fa";
import { API_BASE_URL, ENDPOINTS } from "../config/api";
import { Alert, Field, FileField, FormHead, FormNote, Input, Select, SubmitButton, SuccessPanel, Textarea } from "./forms/FormUI";
import InternshipForm from "./InternshipForm";
import DonorForm from "./DonorForm";

const ID_PROOF_TYPES = ["Aadhaar Card", "PAN Card", "Voter ID", "Driving Licence", "Passport", "College / Student ID", "Other Government ID"];

// Shared with the public membership form: the fee shown here is the same fee
// collected through the Razorpay page, so the two entry points never disagree.
const MEMBERSHIP_PAYMENT_LINK = "https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view";
const MEMBERSHIP_TYPES = {
  general: { title: "General Member", fee: "₹1,200/year", amount: 1200, payment: true },
  active: { title: "Active Member", fee: "₹2,500/year", amount: 2500, payment: true },
  life: { title: "Life Member", fee: "₹8,000+", amount: 8000, payment: true },
  advisory: { title: "Advisory / Expert Member", fee: "Honorary · No fee", amount: 0, payment: false },
};
const PAYMENT_MODES = ["Razorpay (online)", "UPI", "Bank transfer / NEFT", "Cash (paid at office)"];

const FORM_CONFIG = {
  volunteer: { title: "Volunteer", icon: FaUserFriends, eyebrow: "Serve with SSF", description: "Join SSF as a volunteer using the details already saved in your My Profile." },
  membership: { title: "Membership", icon: FaUsers, eyebrow: "Become part of SSF", description: "Choose the membership type that best matches your participation." },
  donor: { title: "Donor", icon: FaHeart, eyebrow: "Support SSF", description: "Register your donor details and support Swastik Srijan Foundation through your contribution." },
  internship: { title: "Internship", icon: FaGraduationCap, eyebrow: "Learn through service", description: "Apply for an internship and gain practical experience through social work." },
  activities: { title: "Activities & Events", icon: FaCalendarAlt, eyebrow: "Participate in action", description: "Tell us which SSF activities, campaigns or events you would like to join." },
  partnership: { title: "Partnership & Collaboration", icon: FaHandshake, eyebrow: "Work together", description: "Explore collaboration with SSF as an organisation, institution, professional or community partner." },
  skills: { title: "Skills & Professional Support", icon: FaTools, eyebrow: "Share your expertise", description: "Offer professional or technical skills to strengthen SSF programmes." },
};

function VolunteerPortalForm({ user }) {
  const [form, setForm] = useState({ volunteerType: "general", message: "" });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user?.id || !user?.fullName || !user?.email || !user?.phone) {
      setError("Please complete your My Profile details first.");
      setState("error");
      return;
    }
    if (!user?.profilePhotoPath) {
      setError("Please add your profile photo in My Profile before applying as a volunteer.");
      setState("error");
      return;
    }
    if (form.message.trim().length < 10) {
      setError("Please tell us briefly how you would like to contribute.");
      setState("error");
      return;
    }
    setState("submitting");
    try {
      const response = await fetch(ENDPOINTS.PORTAL_VOLUNTEER, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          accountId: user.id,
          name: user.fullName,
          email: user.email,
          phone: user.phone,
          volunteer_type: form.volunteerType,
          message: form.message.trim(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || `Volunteer application failed (HTTP ${response.status}).`);
      setReference(result.data?.volunteerId || result.data?.id || "Received");
      setState("success");
    } catch (err) {
      setError(err.message || "Unable to submit the volunteer application. Please try again.");
      setState("error");
    }
  };

  if (state === "success") return (
    <div className="p-5 md:p-7">
      <SuccessPanel title="Volunteer Application Submitted" reference={reference}>
        Your application has been received. Your My Profile photo and account details were used.
      </SuccessPanel>
    </div>
  );

  return (
    <form onSubmit={submit} className="p-5 md:p-7 ssf-form" noValidate>
      <FormNote>Your name, email, mobile number and profile photo come from <strong>My Profile</strong>. No membership payment or identity-document upload is part of this volunteer application.</FormNote>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="Full Name"><Input className="bg-[#F3F5F7]" value={user?.fullName || ""} readOnly /></Field>
        <Field label="Email"><Input className="bg-[#F3F5F7]" value={user?.email || ""} readOnly /></Field>
      </div>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="Mobile Number"><Input className="bg-[#F3F5F7]" value={user?.phone || ""} readOnly /></Field>
        <Field label="Volunteer Category" required>
          <Select value={form.volunteerType} onChange={(e) => set("volunteerType", e.target.value)}>
            <option value="general">General Volunteer</option>
            <option value="active">Active Volunteer</option>
            <option value="professional">Professional / Expert Volunteer</option>
            <option value="digital">Digital / Online Volunteer</option>
          </Select>
        </Field>
      </div>
      <Field label="Why do you want to volunteer?" required>
        <Textarea rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us briefly how you would like to contribute." />
      </Field>
      <Alert tone="success">Profile photo: using your current My Profile photo</Alert>
      {error && <Alert tone="error">{error}</Alert>}
      <SubmitButton busy={state === "submitting"}>Submit Volunteer Application <FaArrowRight /></SubmitButton>
    </form>
  );
}

// Logged-in membership application. Upgrades the existing SSF account (no second
// account, no password) and uploads the profile photo (identity proof optional)
// that the admin needs before approving and issuing the Member ID.
function MembershipPortalForm({ user }) {
  const [form, setForm] = useState({ memberType: "general", idProofType: "Aadhaar Card", identityNumber: "", message: "", profilePhoto: null, idDocument: null });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [memberId, setMemberId] = useState(null);
  const [payment, setPayment] = useState({ mode: PAYMENT_MODES[0], reference: "" });
  const [payState, setPayState] = useState("idle");
  const [payMessage, setPayMessage] = useState("");
  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const selected = MEMBERSHIP_TYPES[form.memberType] || MEMBERSHIP_TYPES.general;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user?.id) return setError("Please log in again."), setState("error");
    if (!form.profilePhoto) return setError("Please upload your profile photo."), setState("error");
    if (form.profilePhoto.size > 2 * 1024 * 1024) return setError("Profile photo must be 2MB or smaller."), setState("error");
    if (form.idDocument && form.idDocument.size > 5 * 1024 * 1024) return setError("Identity document must be 5MB or smaller."), setState("error");
    setState("submitting");
    try {
      const data = new FormData();
      data.append("accountId", user.id);
      data.append("fullName", user.fullName || "");
      data.append("email", user.email || "");
      data.append("phone", user.phone || "");
      data.append("memberType", form.memberType);
      data.append("idProofType", form.idProofType);
      data.append("identityNumber", form.identityNumber.trim());
      data.append("message", form.message.trim());
      data.append("profile_photo", form.profilePhoto);
      if (form.idDocument) data.append("id_document", form.idDocument);
      const response = await fetch(`${API_BASE_URL}/api/member-application`, { method: "POST", body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || `Membership application failed (HTTP ${response.status}).`);
      setMemberId(result?.user?.id || user.id);
      setState("success");
    } catch (err) {
      setError(err.message || "Unable to submit the membership application. Please try again.");
      setState("error");
    }
  };

  const recordPayment = async () => {
    setPayMessage("");
    if (!payment.mode) return setPayMessage("Please select how you paid the membership fee.");
    if (payment.reference.trim().length < 4) return setPayMessage("Please enter the UPI / UTR / receipt reference from your payment.");
    setPayState("submitting");
    try {
      const response = await fetch(ENDPOINTS.MEMBER_PAYMENT_SUBMIT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ memberId, paymentMode: payment.mode, paymentReference: payment.reference.trim() }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to record your payment details.");
      setPayState("success");
      setPayMessage(result.message || "Payment details received. Our team will verify and confirm your membership.");
    } catch (err) {
      setPayState("error");
      setPayMessage(err.message || "Unable to record your payment details. Please try again.");
    }
  };

  const reset = () => { setState("idle"); setMemberId(null); setPayment({ mode: PAYMENT_MODES[0], reference: "" }); setPayState("idle"); setPayMessage(""); };

  if (state === "success") return (
    <div className="p-5 md:p-7 space-y-4">
      <SuccessPanel title="Membership Application Submitted">
        Your membership application is now under review. Your Member ID and Membership Certificate will appear in <strong>My Documents</strong> after approval.
      </SuccessPanel>
      {selected.payment ? (
        <div className="rounded-2xl border border-[#EAF0F6] p-5">
          <h4 className="font-black text-[#12345A]">Step 2 · Pay the {selected.fee} membership fee</h4>
          <p className="text-sm text-[#26343D] mt-1">Your application is approved only after the fee is confirmed. Pay through the secure Razorpay page, then record the reference below so our team can verify it.</p>
          <a href={MEMBERSHIP_PAYMENT_LINK} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#12345A] text-white font-black hover:bg-[#176447] transition">Pay Membership Fee <FaExternalLinkAlt className="text-sm" /></a>
          {payState === "success" ? (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4"><p className="font-bold text-emerald-800">Payment details received</p><p className="text-sm text-emerald-700 mt-1">{payMessage}</p></div>
          ) : (
            <div className="mt-5 space-y-4">
              <Field label="How did you pay?" required><Select value={payment.mode} onChange={(e) => setPayment((p) => ({ ...p, mode: e.target.value }))}>{PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}</Select></Field>
              <Field label="UPI / UTR / Receipt reference" required hint="From your payment confirmation"><Input value={payment.reference} onChange={(e) => setPayment((p) => ({ ...p, reference: e.target.value }))} placeholder="e.g. 425789123456" /></Field>
              {payState === "error" && <Alert tone="error">{payMessage}</Alert>}
              <button type="button" onClick={recordPayment} disabled={payState === "submitting"} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#176447] text-white font-black disabled:opacity-60">{payState === "submitting" ? "Submitting…" : "I have paid · Submit payment details"}</button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#EAF0F6] border border-[#EAF0F6] p-5 text-sm text-[#26343D]"><strong>Advisory / Expert membership is honorary.</strong> No membership fee is required. Our team will contact you regarding the advisory role.</div>
      )}
      <button type="button" onClick={reset} className="px-5 py-3 rounded-xl bg-[#EAF0F6] text-[#26343D] font-bold">Submit another application</button>
    </div>
  );

  return (
    <form onSubmit={submit} className="p-5 md:p-7 ssf-form" noValidate>
      <FormNote>Your membership will be linked to your existing SSF account ({user?.email}). A clear profile photo is required for your ID card. The identity proof (Aadhaar / PAN / other) is optional — upload it if you have it, or share it later with the SSF team.</FormNote>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="Full Name"><Input className="bg-[#F3F5F7]" value={user?.fullName || ""} readOnly /></Field>
        <Field label="Email"><Input className="bg-[#F3F5F7]" value={user?.email || ""} readOnly /></Field>
      </div>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="Mobile Number"><Input className="bg-[#F3F5F7]" value={user?.phone || ""} readOnly /></Field>
        <Field label="Membership Type" required>
          <Select value={form.memberType} onChange={(e) => set("memberType", e.target.value)}>
            {Object.entries(MEMBERSHIP_TYPES).map(([key, type]) => <option key={key} value={key}>{type.title} · {type.fee}</option>)}
          </Select>
        </Field>
      </div>
      <div className="rounded-2xl bg-[#12345A] text-white p-5">
        <p className="text-xs font-black uppercase tracking-wider text-[#F7A814]">Selected membership</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
          <div><h4 className="text-lg font-black">{selected.title}</h4><p className="text-sm text-white/70 mt-0.5">{selected.fee}</p></div>
          {selected.payment ? <a href={MEMBERSHIP_PAYMENT_LINK} target="_blank" rel="noreferrer" className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#176447] text-white font-black hover:bg-white hover:text-[#12345A] transition">Pay Membership Fee <FaExternalLinkAlt className="text-sm" /></a> : <div className="shrink-0 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold">Honorary · No fee</div>}
        </div>
        {selected.payment && <p className="text-[11px] text-white/60 mt-3">Approval requires a confirmed fee payment. Pay now, or after submitting the application, then record your UPI / UTR reference so our team can verify it.</p>}
      </div>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="Identity Proof Type" hint="Optional"><Select value={form.idProofType} onChange={(e) => set("idProofType", e.target.value)}>{ID_PROOF_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</Select></Field>
        <Field label="ID Number" hint="Optional · Aadhaar / PAN / other ID number"><Input value={form.identityNumber} onChange={(e) => set("identityNumber", e.target.value)} placeholder="e.g. Aadhaar or PAN number" /></Field>
      </div>
      <Field label="Why do you want to join?"><Textarea rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us briefly how you would like to contribute." /></Field>
      <div className="ssf-form-grid ssf-form-grid-2">
        <FileField label="Profile Photo" required accept="image/jpeg,image/png,image/webp,image/heic,image/heif" hint="JPG, PNG or WebP · max 2MB" onChange={(e) => set("profilePhoto", e.target.files?.[0] || null)} />
        <FileField label="Identity Document" accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,application/pdf" hint="Optional · JPG, PNG, WebP or PDF · max 5MB" onChange={(e) => set("idDocument", e.target.files?.[0] || null)} />
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      <SubmitButton busy={state === "submitting"}>Submit Membership Application <FaArrowRight /></SubmitButton>
    </form>
  );
}

function ParticipationForm({ kind, user }) {
  const config = FORM_CONFIG[kind];
  const [form, setForm] = useState({ fullName: user?.fullName || "", email: user?.email || "", phone: user?.phone || "", category: "", message: "" });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const submit = async (e) => {
    e.preventDefault(); setError("");
    if (form.fullName.trim().length < 3) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Please enter a valid email address.");
    if (form.phone.replace(/\D/g, "").length < 7) return setError("Please enter a valid mobile number.");
    if (!form.category) return setError("Please select an option.");
    if (form.message.trim().length < 10) return setError("Please tell us briefly how you would like to participate.");
    setState("submitting");
    try {
      const type = kind === "partnership" || kind === "skills" ? "partner" : "movement";
      const response = await fetch(ENDPOINTS.INTEREST, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ type, fullName: form.fullName.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim(), category: form.category.trim(), message: form.message.trim() }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to submit your request.");
      setState("success");
    } catch (err) { setError(err.message || "Unable to submit your request. Please try again."); setState("error"); }
  };
  if (state === "success") return <div className="p-5 md:p-7"><SuccessPanel title="Request received">Your request has been recorded successfully. The SSF team will review it and contact you when needed.</SuccessPanel></div>;
  const options = kind === "activities" ? ["Awareness Campaign", "Education Activity", "Health Activity", "Environment / Plantation", "Community / Rural Development", "Event / Outreach"] : kind === "partnership" ? ["NGO / Institution", "Corporate / CSR", "School / College", "Professional / Organisation", "Community Partner"] : ["Teaching / Education", "Medical / Health", "Legal", "Finance / CA / Audit", "IT / Technology", "Design / Media", "Communications", "Other Professional Skill"];
  const selectLabel = kind === "activities" ? "Activity / Event" : kind === "partnership" ? "Partnership Type" : "Area of Expertise";
  const messageLabel = kind === "activities" ? "How would you like to participate?" : "How would you like to contribute?";
  return <form onSubmit={submit} className="p-5 md:p-7 ssf-form" noValidate>
    <FormNote>{config.description}</FormNote>
    <div className="ssf-form-grid ssf-form-grid-2">
      <Field label="Full Name" required><Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" /></Field>
      <Field label="Email" required><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" /></Field>
    </div>
    <div className="ssf-form-grid ssf-form-grid-2">
      <Field label="Mobile Number" required><Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/[^0-9 +()-]/g, ""))} placeholder="Your mobile number" /></Field>
      <Field label={selectLabel} required><Select value={form.category} onChange={(e) => set("category", e.target.value)}><option value="">Select an option</option>{options.map((option) => <option key={option}>{option}</option>)}</Select></Field>
    </div>
    <Field label={messageLabel} required><Textarea rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us briefly about your interest, availability or proposed contribution." /></Field>
    {error && <Alert tone="error">{error}</Alert>}
    <SubmitButton busy={state === "submitting"}>Submit Request <FaArrowRight /></SubmitButton>
  </form>;
}

export default function UserParticipationForms({ openForm, onClose, user }) {
  if (!openForm) return null;
  const config = FORM_CONFIG[openForm]; if (!config) return null;
  const Icon = config.icon;
  const renderForm = () => {
    if (openForm === "membership") return <MembershipPortalForm user={user} />;
    if (openForm === "volunteer") return <VolunteerPortalForm user={user} />;
    if (openForm === "donor") return <DonorForm />;
    if (["activities", "partnership", "skills"].includes(openForm)) return <ParticipationForm kind={openForm} user={user} />;
    if (openForm === "internship") return <InternshipForm onClose={onClose} />;
    return null;
  };
  return <div className="fixed inset-0 z-[120] bg-[#12345A]/70 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={config.title}><div className="w-full max-w-3xl max-h-[94vh] overflow-y-auto rounded-[2rem] bg-white shadow-2xl border border-white/40"><div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b px-5 md:px-7 py-4 flex items-center justify-between gap-4"><div className="flex items-center gap-3 min-w-0"><div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#176447] flex items-center justify-center shrink-0"><Icon /></div><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#176447]">{config.eyebrow}</p><h2 className="text-xl font-black text-[#12345A] truncate">{config.title}</h2></div></div><button type="button" onClick={onClose} className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 flex items-center justify-center shrink-0" aria-label="Close form"><FaTimes /></button></div>{renderForm()}</div></div>;
}

export { FORM_CONFIG };
