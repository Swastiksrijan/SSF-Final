import { useState } from "react";
import { ENDPOINTS } from "../config/api";

const initialForm = {
  companyName: "",
  contactPerson: "",
  email: "",
  countryCode: "+91",
  phone: "",
  interestArea: "General CSR",
  proposal: "",
};

export default function CSRProposalForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    if (!form.companyName.trim() || !form.contactPerson.trim() || !form.email.trim() || !form.phone.trim() || !form.proposal.trim()) {
      setStatus({ type: "error", message: "Please complete all required fields." });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(ENDPOINTS.INTEREST, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type: "partner",
          fullName: form.contactPerson.trim(),
          email: form.email.trim().toLowerCase(),
          phone: `${form.countryCode} ${form.phone.trim()}`,
          message: `Company Name: ${form.companyName.trim()}\nInterest Area: ${form.interestArea}\nProposal / Requirement: ${form.proposal.trim()}`,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to submit your request.");
      setForm(initialForm);
      setStatus({ type: "success", message: "Thank you. Your partnership request has been submitted successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to submit your request. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <input name="companyName" value={form.companyName} onChange={update} required placeholder="Company Name *" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900" />
      <input name="contactPerson" value={form.contactPerson} onChange={update} required placeholder="Contact Person *" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900" />
      <input type="email" name="email" value={form.email} onChange={update} required placeholder="Work Email *" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900" />
      <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
        <select name="countryCode" value={form.countryCode} onChange={update} className="rounded-xl border border-slate-200 px-2 py-3 text-slate-900"><option>+91</option><option>+1</option><option>+44</option><option>+971</option><option>+65</option></select>
        <input type="tel" inputMode="numeric" name="phone" value={form.phone} onChange={update} required placeholder="Phone Number *" className="min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-slate-900" />
      </div>
      <select name="interestArea" value={form.interestArea} onChange={update} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900"><option>General CSR</option><option>Education</option><option>Healthcare</option><option>Skill Development</option><option>Women Empowerment</option><option>Environment</option></select>
      <textarea name="proposal" value={form.proposal} onChange={update} required rows="4" placeholder="Proposal / Requirement *" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900" />
      {status.message && <p className={status.type === "success" ? "text-green-700" : "text-red-600"}>{status.message}</p>}
      <button type="submit" disabled={submitting} className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-60">{submitting ? "Submitting..." : "Submit Request"}</button>
    </form>
  );
}
