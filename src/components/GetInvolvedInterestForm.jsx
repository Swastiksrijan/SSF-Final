import { useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaArrowRight } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const INITIAL = { name: "", email: "", phone: "", message: "" };

export default function GetInvolvedInterestForm({ type = "movement", onClose }) {
  const labels = {
    movement: { title: "Join the Nation-Building Movement", hi: "राष्ट्र निर्माण आंदोलन", subject: "Nation-Building Movement Interest" },
    partner: { title: "Partner with the Mission", hi: "मिशन के साथ भागीदार", subject: "CSR / Partnership Interest" }
  };
  const meta = labels[type] || labels.movement;
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Please enter a valid email address.");
    if (form.phone.replace(/\D/g, "").length < 7) return setError("Please enter a valid phone number.");
    if (form.message.trim().length < 10) return setError("Please tell us briefly how you would like to contribute.");
    setStatus("submitting"); setError("");
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: form.name.trim(),
          from_name: form.name.trim(),
          from_email: form.email.trim().toLowerCase(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          subject: `SSF - ${meta.subject}`
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
    } catch (err) {
      console.error("Get Involved form error:", err);
      setStatus("error");
      setError("Unable to submit right now. Please try again.");
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
          <div><label className="gil-label">Full Name *</label><input className="gil-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required /></div>
          <div><label className="gil-label">Email Address *</label><input type="email" className="gil-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /></div>
        </div>
        <div><label className="gil-label">Phone Number *</label><input type="tel" inputMode="numeric" className="gil-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9 +()-]/g, "") })} placeholder="Mobile number" required /></div>
        <div><label className="gil-label">How would you like to contribute? *</label><textarea className="gil-input resize-none" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={type === "partner" ? "Tell us about your company, CSR interest, collaboration or partnership idea." : "Tell us how you would like to participate, support or stay connected."} required /></div>
        {status === "error" && <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold flex gap-2"><FaExclamationCircle />{error}</div>}
        <button type="submit" disabled={status === "submitting"} className="w-full bg-[#002344] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF6600] transition-all flex items-center justify-center gap-3 disabled:opacity-60">{status === "submitting" ? <><FaSpinner className="animate-spin" /> Submitting securely...</> : <>Submit Request <FaArrowRight /></>}</button>
      </form>
      <style>{`.gil-label{display:block;font-size:.72rem;font-weight:800;color:#71717a;text-transform:uppercase;letter-spacing:.08em;margin:0 0 .45rem .25rem}.gil-input{width:100%;padding:.9rem 1rem;background:#fafafa;border:1px solid #e4e4e7;border-radius:.8rem;outline:none;font-weight:500}.gil-input:focus{border-color:#fdba74;box-shadow:0 0 0 4px rgba(251,146,60,.1)}`}</style>
    </div>
  );
}
