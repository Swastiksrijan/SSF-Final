import { useState } from "react";
import { ENDPOINTS } from "../config/api";
import { Alert, Field, FormNote, Input, Select, SubmitButton, Textarea } from "./forms/FormUI";

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
    <form onSubmit={submit} className="ssf-form" noValidate>
      <div className="ssf-form-grid ssf-form-grid-2">
        <Field label="Company Name" required><Input name="companyName" value={form.companyName} onChange={update} placeholder="Company / organisation name" /></Field>
        <Field label="Contact Person" required><Input name="contactPerson" value={form.contactPerson} onChange={update} placeholder="Your name" /></Field>
      </div>
      <Field label="Work Email" required><Input type="email" name="email" value={form.email} onChange={update} placeholder="name@company.com" /></Field>
      <Field label="Phone Number" required>
        <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
          <Select name="countryCode" value={form.countryCode} onChange={update}><option>+91</option><option>+1</option><option>+44</option><option>+971</option><option>+65</option></Select>
          <Input type="tel" inputMode="numeric" name="phone" value={form.phone} onChange={update} className="min-w-0" placeholder="Phone number" />
        </div>
      </Field>
      <Field label="CSR Interest Area">
        <Select name="interestArea" value={form.interestArea} onChange={update}><option>General CSR</option><option>Education</option><option>Healthcare</option><option>Skill Development</option><option>Women Empowerment</option><option>Environment</option></Select>
      </Field>
      <Field label="Proposal / Requirement" required><Textarea name="proposal" value={form.proposal} onChange={update} rows={4} placeholder="Tell us about your CSR proposal, collaboration or requirement." /></Field>
      <FormNote>Your proposal is reviewed by the SSF partnership team. This is an enquiry, not a confirmed partnership.</FormNote>
      {status.message && <Alert tone={status.type === "success" ? "success" : "error"}>{status.message}</Alert>}
      <SubmitButton busy={submitting}>Submit Request</SubmitButton>
    </form>
  );
}
