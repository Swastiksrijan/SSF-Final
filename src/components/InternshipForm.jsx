import { useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaArrowRight } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

const INITIAL = {
  fullName: "", email: "", countryCode: "+91", phone: "", college: "", course: "",
  internshipType: "", duration: "", startDate: "", message: ""
};

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
    setStatus("submitting"); setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.set("phone", `${form.countryCode} ${form.phone}`);
      data.append("resume", resume);
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
    <div className="p-8 md:p-12 text-center space-y-5">
      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl"><FaCheckCircle /></div>
      <p className="text-xs uppercase tracking-widest font-black text-[#FF6600]">Internship Application</p>
      <h3 className="text-2xl md:text-3xl font-black text-[#002344]">Application Submitted</h3>
      <p className="text-zinc-600">Thank you. Your internship application has been received. Our team will review it and contact you by email or phone.</p>
      <button onClick={onClose} className="px-7 py-3 rounded-xl bg-[#002344] text-white font-bold hover:bg-[#FF6600] transition-colors">Close</button>
    </div>
  );

  const input = "w-full px-4 py-3.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100/60";
  const label = "block text-xs font-black uppercase tracking-wider text-zinc-500 mb-2";

  return <div className="p-6 md:p-10">
    <div className="mb-7"><p className="text-xs uppercase tracking-widest font-black text-[#FF6600]">Internship Application</p><h3 className="text-2xl md:text-3xl font-black text-[#002344] mt-1">Apply for an Internship</h3><p className="text-sm text-zinc-500 mt-2">इंटर्नशिप के लिए आवेदन करें</p></div>
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid md:grid-cols-2 gap-5">
        <div><label className={label}>Full Name *</label><input className={input} value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your full name" /></div>
        <div><label className={label}>Email Address *</label><input type="email" className={input} value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" /></div>
      </div>
      <div><label className={label}>Mobile Number *</label><div className="grid grid-cols-[120px_minmax(0,1fr)] gap-2"><select className={input} value={form.countryCode} onChange={e => update("countryCode", e.target.value)}><option>+91</option><option>+1</option><option>+44</option><option>+61</option><option>+971</option></select><input type="tel" inputMode="numeric" className={input} value={form.phone} onChange={e => update("phone", e.target.value.replace(/\D/g, ""))} placeholder="Enter mobile number" /></div></div>
      <div className="grid md:grid-cols-2 gap-5">
        <div><label className={label}>College / Institution *</label><input className={input} value={form.college} onChange={e => update("college", e.target.value)} placeholder="College / university / institution" /></div>
        <div><label className={label}>Course / Qualification *</label><input className={input} value={form.course} onChange={e => update("course", e.target.value)} placeholder="e.g. BCA, MBA, B.Tech" /></div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div><label className={label}>Internship Area *</label><select className={input} value={form.internshipType} onChange={e => update("internshipType", e.target.value)}><option value="">Select area</option>{roles.map(([v,t]) => <option key={v} value={v}>{t}</option>)}</select></div>
        <div><label className={label}>Preferred Duration *</label><select className={input} value={form.duration} onChange={e => update("duration", e.target.value)}><option value="">Select duration</option><option>4 Weeks</option><option>6 Weeks</option><option>8 Weeks</option><option>12 Weeks</option><option>Flexible</option></select></div>
      </div>
      <div><label className={label}>Preferred Start Date</label><input type="date" className={input} value={form.startDate} onChange={e => update("startDate", e.target.value)} /></div>
      <div><label className={label}>Resume / CV *</label><input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className={input} onChange={e => setResume(e.target.files?.[0] || null)} /><p className="text-xs text-zinc-400 mt-1">PDF, DOC or DOCX · maximum 5 MB</p></div>
      <div><label className={label}>Why do you want to intern with SSF?</label><textarea className={`${input} resize-none`} rows={4} value={form.message} onChange={e => update("message", e.target.value)} placeholder="Tell us about your interests, skills and what you hope to learn." /></div>
      {status === "error" && <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold flex gap-2"><FaExclamationCircle />{error}</div>}
      <button type="submit" disabled={status === "submitting"} className="w-full bg-[#002344] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FF6600] transition-all flex items-center justify-center gap-3 disabled:opacity-60">{status === "submitting" ? <><FaSpinner className="animate-spin" /> Submitting securely...</> : <>Submit Internship Application <FaArrowRight /></>}</button>
    </form>
  </div>;
}
