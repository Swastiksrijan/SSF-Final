import { useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaArrowRight } from "react-icons/fa";
import { API_BASE_URL } from "../config/api";

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
    <div className="p-8 md:p-10 text-center space-y-5">
      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl"><FaCheckCircle /></div>
      <h3 className="text-2xl font-black text-[#002344]">Request Submitted</h3>
      <p className="text-zinc-600">Thank you. Swastik Srijan Foundation has received your request and our team will contact you.</p>
      <button onClick={onClose} className="px-6 py-3 rounded-xl bg-[#002344] text-white font-bold hover:bg-[#FF6600] transition-colors">Close</button>
    </div>
  );

  return (
    <div className="p-6 md:p-10">
      <div className="mb-7"><p className="text-xs uppercase tracking-widest font-bold text-[#FF6600]">Get Involved</p><h3 className="text-2xl md:text-3xl font-black text-[#002344] mt-1">{meta.title}</h3><p className="text-sm text-zinc-500 mt-2">{meta.hi}</p></div>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className="gil-label">Full Name *</label><input className="gil-input" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your full name" required /></div>
          <div><label className="gil-label">Email Address *</label><input type="email" className="gil-input" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" required /></div>
        </div>
        <div><label className="gil-label">Mobile Number *</label><div className="flex gap-2"><select className="gil-input w-28 shrink-0" value={form.countryCode} onChange={e => update("countryCode", e.target.value)} aria-label="Country code"><option value="+91">🇮🇳 +91</option><option value="+1">🇺🇸 +1</option><option value="+44">🇬🇧 +44</option><option value="+61">🇦🇺 +61</option><option value="+971">🇦🇪 +971</option></select><input type="tel" inputMode="numeric" className="gil-input flex-1" value={form.phone} onChange={e => update("phone", e.target.value.replace(/\D/g, ""))} placeholder="Mobile number" required /></div></div>
        <div><label className="gil-label">How would you like to contribute? *</label><textarea className="gil-input resize-none" rows={5} value={form.message} onChange={e => update("message", e.target.value)} placeholder={type === "partner" ? "Tell us about your company, CSR interest, collaboration or partnership idea." : "Tell us how you would like to participate, support or stay connected."} required /></div>
        {status === "error" && <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold flex gap-2"><FaExclamationCircle />{error}</div>}
        <button type="submit" disabled={status === "submitting"} className="w-full bg-[#002344] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF6600] transition-all flex items-center justify-center gap-3 disabled:opacity-60">{status === "submitting" ? <><FaSpinner className="animate-spin" /> Submitting securely...</> : <>Submit Request <FaArrowRight /></>}</button>
      </form>
      <style>{`.gil-label{display:block;font-size:.72rem;font-weight:800;color:#71717a;text-transform:uppercase;letter-spacing:.08em;margin:0 0 .45rem .25rem}.gil-input{width:100%;padding:.9rem 1rem;background:#fafafa;border:1px solid #e4e4e7;border-radius:.8rem;outline:none;font-weight:500}.gil-input:focus{border-color:#fdba74;box-shadow:0 0 0 4px rgba(251,146,60,.1)}`}</style>
    </div>
  );
}
