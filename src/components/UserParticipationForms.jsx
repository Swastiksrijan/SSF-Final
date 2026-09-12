import { useState } from "react";
import { FaArrowRight, FaCalendarAlt, FaCheckCircle, FaGraduationCap, FaHandshake, FaHeart, FaTimes, FaTools, FaUserFriends, FaUsers, FaSpinner } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";
import InternshipForm from "./InternshipForm";
import DonorForm from "./DonorForm";
import MemberForm from "./MemberForm";
import VolunteerForm from "./VolunteerForm";

const FORM_CONFIG = {
  volunteer: { title: "Volunteer", icon: FaUserFriends, eyebrow: "Serve with SSF", description: "Tell us how you would like to contribute your time, skills and energy." },
  membership: { title: "Membership", icon: FaUsers, eyebrow: "Become part of SSF", description: "Choose the membership type that best matches your participation." },
  internship: { title: "Internship", icon: FaGraduationCap, eyebrow: "Learn through service", description: "Apply for an internship and gain practical experience through social work." },
  donations: { title: "Donations", icon: FaHeart, eyebrow: "Support the mission", description: "Make a contribution towards education, health, livelihood and community work." },
  activities: { title: "Activities & Events", icon: FaCalendarAlt, eyebrow: "Participate in action", description: "Tell us which SSF activities, campaigns or events you would like to join." },
  partnership: { title: "Partnership & Collaboration", icon: FaHandshake, eyebrow: "Work together", description: "Explore collaboration with SSF as an organisation, institution, professional or community partner." },
  skills: { title: "Skills & Professional Support", icon: FaTools, eyebrow: "Share your expertise", description: "Offer professional or technical skills to strengthen SSF programmes." },
};

function ParticipationForm({ kind }) {
  const config = FORM_CONFIG[kind];
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", category: "", message: "" });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
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

  if (state === "success") return <div className="text-center py-12 px-5"><FaCheckCircle className="mx-auto text-5xl text-emerald-500" /><h3 className="text-2xl font-black text-[#002344] mt-5">Request received</h3><p className="text-zinc-500 mt-2 max-w-md mx-auto">Your request has been recorded successfully. The SSF team will review it and contact you when needed.</p></div>;

  const options = kind === "activities" ? ["Awareness Campaign", "Education Activity", "Health Activity", "Environment / Plantation", "Community / Rural Development", "Event / Outreach"] : kind === "partnership" ? ["NGO / Institution", "Corporate / CSR", "School / College", "Professional / Organisation", "Community Partner"] : ["Teaching / Education", "Medical / Health", "Legal", "Finance / CA / Audit", "IT / Technology", "Design / Media", "Communications", "Other Professional Skill"];
  const selectLabel = kind === "activities" ? "Activity / Event *" : kind === "partnership" ? "Partnership Type *" : "Area of Expertise *";
  const messageLabel = kind === "activities" ? "How would you like to participate? *" : "How would you like to contribute? *";

  return <form onSubmit={submit} className="p-5 md:p-7 space-y-5" noValidate>
    <div className="rounded-2xl bg-[#f8fafc] border border-zinc-100 p-4 text-sm text-zinc-600">{config.description}</div>
    <div className="grid md:grid-cols-2 gap-4"><Field label="Full Name *"><input className="ssf-form-input" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" /></Field><Field label="Email *"><input type="email" className="ssf-form-input" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" /></Field></div>
    <div className="grid md:grid-cols-2 gap-4"><Field label="Mobile Number *"><input type="tel" className="ssf-form-input" value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/[^0-9 +()-]/g, ""))} placeholder="Your mobile number" /></Field><Field label={selectLabel}><select className="ssf-form-input" value={form.category} onChange={(e) => set("category", e.target.value)}><option value="">Select an option</option>{options.map((option) => <option key={option}>{option}</option>)}</select></Field></div>
    <Field label={messageLabel}><textarea className="ssf-form-input resize-none" rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us briefly about your interest, availability or proposed contribution." /></Field>
    {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 text-sm font-semibold">{error}</div>}
    <button disabled={state === "submitting"} className="w-full rounded-2xl bg-[#002344] text-white py-4 font-black text-base hover:bg-[#ff6600] transition inline-flex items-center justify-center gap-3 disabled:opacity-60">{state === "submitting" ? <><FaSpinner className="animate-spin" /> Sending…</> : <>Submit Request <FaArrowRight /></>}</button>
    <style>{`.ssf-form-input{width:100%;padding:.8rem 1rem;border:1px solid #e4e4e7;border-radius:.85rem;background:#fff;outline:none}.ssf-form-input:focus{border-color:#ff9b66;box-shadow:0 0 0 3px rgba(255,102,0,.10)}`}</style>
  </form>;
}

function Field({ label, children }) { return <label className="block"><span className="block text-[11px] font-black uppercase tracking-[.08em] text-zinc-500 mb-1.5">{label}</span>{children}</label>; }

export default function UserParticipationForms({ openForm, onClose }) {
  if (!openForm) return null;
  const config = FORM_CONFIG[openForm];
  if (!config) return null;
  const Icon = config.icon;
  const renderForm = () => {
    if (openForm === "membership") return <MemberForm />;
    if (openForm === "volunteer") return <VolunteerForm />;
    if (["activities", "partnership", "skills"].includes(openForm)) return <ParticipationForm kind={openForm} />;
    if (openForm === "internship") return <InternshipForm />;
    return <DonorForm />;
  };
  return <div className="fixed inset-0 z-[120] bg-[#002344]/70 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center" role="dialog" aria-modal="true" aria-label={config.title}>
    <div className="w-full max-w-3xl max-h-[94vh] overflow-y-auto rounded-[2rem] bg-white shadow-2xl border border-white/40">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b px-5 md:px-7 py-4 flex items-center justify-between gap-4"><div className="flex items-center gap-3 min-w-0"><div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#ff6600] flex items-center justify-center shrink-0"><Icon /></div><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#ff6600]">{config.eyebrow}</p><h2 className="text-xl font-black text-[#002344] truncate">{config.title}</h2></div></div><button type="button" onClick={onClose} className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 flex items-center justify-center shrink-0" aria-label="Close form"><FaTimes /></button></div>
      {renderForm()}
    </div>
  </div>;
}

export { FORM_CONFIG };
