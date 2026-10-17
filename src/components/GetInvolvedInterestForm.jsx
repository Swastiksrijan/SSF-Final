import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { API_BASE_URL } from "../config/api";
import { Alert, Field, FormHead, FormNote, Input, Select, SubmitButton, SuccessPanel, Textarea } from "./forms/FormUI";

const INITIAL = { name: "", countryCode: "+91", phone: "", email: "", message: "" };

export default function GetInvolvedInterestForm({ type = "movement", onClose }) {
  const labels = {
    movement: { title: "Join the Nation-Building Movement", hi: "राष्ट्र निर्माण आंदोलन" },
    partner: { title: "Partner with the Mission", hi: "मिशन के साथ भागीदार" }
  };
  const meta = labels[type] || labels.movement;
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Please enter a valid email address.");
    if (form.phone.replace(/\D/g, "").length < 7) return setError("Please enter a valid phone number.");
    if (form.message.trim().length < 10) return setError("Please tell us briefly how you would like to contribute.");
    setStatus("submitting"); setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type,
          fullName: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: `${form.countryCode} ${form.phone.trim()}`,
          message: form.message.trim()
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to submit right now. Please try again.");
      setStatus("success");
    } catch (err) {
      console.error("Get Involved form error:", err);
      setStatus("error");
      setError(err.message || "Unable to submit right now. Please try again.");
    }
  };

  if (status === "success") return (
    <div className="p-8 md:p-10">
      <SuccessPanel title="Request Submitted" actions={
        onClose ? <button onClick={onClose} className="px-6 py-3 rounded-xl bg-[#12345A] text-white font-bold hover:bg-[#176447] transition-colors">Close</button> : null
      }>
        Thank you. Swastik Srijan Foundation has received your request and our team will contact you.
      </SuccessPanel>
    </div>
  );

  return (
    <div className="p-6 md:p-10">
      <FormHead eyebrow="Get Involved" title={meta.title} subtitle={meta.hi} />
      <form onSubmit={submit} className="ssf-form mt-6" noValidate>
        <div className="ssf-form-grid ssf-form-grid-2">
          <Field label="Full Name" required><Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your full name" autoComplete="name" /></Field>
          <Field label="Email Address" required><Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" autoComplete="email" /></Field>
        </div>
        <Field label="Mobile Number" required>
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2 w-full">
            <Select value={form.countryCode} onChange={e => update("countryCode", e.target.value)} aria-label="Country code">
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+971">🇦🇪 +971</option>
            </Select>
            <Input type="tel" inputMode="numeric" name="phone" className="min-w-0" value={form.phone} onChange={e => update("phone", e.target.value.replace(/\D/g, ""))} placeholder="Enter mobile number" autoComplete="tel-national" />
          </div>
        </Field>
        <Field label="How would you like to contribute?" required>
          <Textarea rows={5} value={form.message} onChange={e => update("message", e.target.value)} placeholder={type === "partner" ? "Tell us about your company, CSR interest, collaboration or partnership idea." : "Tell us how you would like to participate, support or stay connected."} />
        </Field>
        <FormNote>Your request is recorded for the SSF team to review and follow up. No payment is involved at this step.</FormNote>
        {status === "error" && <Alert tone="error">{error}</Alert>}
        <SubmitButton busy={status === "submitting"} busyLabel="Submitting securely…">Submit Request <FaArrowRight /></SubmitButton>
      </form>
    </div>
  );
}
