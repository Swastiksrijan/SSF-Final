import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

const roles = [
  { id: "volunteer", title: "Volunteer for India", icon: "🤝", text: "Serve communities and support SSF activities." },
  { id: "member", title: "Become a Member", icon: "👥", text: "Join the SSF family and participate in its mission." },
  { id: "intern", title: "Join as an Intern", icon: "🎓", text: "Learn, contribute and gain meaningful experience." },
  { id: "movement", title: "Nation-Building Movement", icon: "🇮🇳", text: "Take part in citizen-led nation-building initiatives." },
  { id: "donor", title: "Become a Donor", icon: "💚", text: "Support meaningful work when and how you can." },
  { id: "partner", title: "Partner with the Mission", icon: "🌐", text: "Explore institutional and mission partnerships." },
];
const initial = { fullName: "", email: "", phone: "", message: "", college: "", course: "", internshipType: "", duration: "", startDate: "", city: "", state: "", donationPurpose: "", amount: "", paymentMode: "", memberType: "", volunteerCategory: "", idProofType: "", profilePhoto: null, idDocument: null, resume: null };
const session = () => { try { return JSON.parse(localStorage.getItem("ssf_user_session") || "null"); } catch (_) { return null; } };

async function request(url, options) {
  let response;
  try { response = await fetch(url, options); } catch (_) { throw new Error("Unable to connect to the SSF server. Please check your internet connection and try again."); }
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (_) {}
  if (!response.ok) throw new Error(data.message || `Server error (${response.status}). Please try again.`);
  return data;
}

export default function JoinSSFHub() {
  const [selected, setSelected] = useState("");
  const [mountNode, setMountNode] = useState(null);
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let timer;
    const findProfile = () => {
      const profile = document.getElementById("my-profile");
      if (!profile?.parentNode) return false;
      let node = document.getElementById("ssf-join-after-profile");
      if (!node) { node = document.createElement("div"); node.id = "ssf-join-after-profile"; profile.parentNode.insertBefore(node, profile.nextSibling); }
      setMountNode(node); return true;
    };
    if (!findProfile()) timer = window.setInterval(() => { if (findProfile()) window.clearInterval(timer); }, 100);
    return () => { if (timer) window.clearInterval(timer); document.getElementById("ssf-join-after-profile")?.remove(); };
  }, []);

  const choose = (id) => {
    const u = session();
    setSelected(id);
    setForm({ ...initial, fullName: u?.fullName || "", email: u?.email || "", phone: u?.phone || "" });
    setMessage(""); setError("");
  };
  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const role = roles.find((r) => r.id === selected);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMessage(""); setError("");
    try {
      let data;
      if (selected === "volunteer") {
        data = await request(`${API_BASE_URL}/api/interest`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "volunteer", fullName: form.fullName, email: form.email, phone: form.phone, category: form.volunteerCategory, message: form.message || `Volunteer category: ${form.volunteerCategory || "General Volunteer"}` }) });
      } else if (selected === "member") {
        data = await request(`${API_BASE_URL}/api/interest`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "member", fullName: form.fullName, email: form.email, phone: form.phone, category: form.memberType, message: form.message || `Membership type: ${form.memberType || "General Member"}` }) });
      } else if (selected === "intern") {
        if (!form.resume) throw new Error("Resume is required.");
        const fd = new FormData();
        ["fullName", "email", "phone", "college", "course", "internshipType", "duration", "startDate", "message"].forEach((k) => fd.append(k, form[k] || "")); fd.append("resume", form.resume);
        data = await request(`${API_BASE_URL}/api/internship`, { method: "POST", body: fd });
      } else if (selected === "donor") {
        data = await request(`${API_BASE_URL}/api/donor`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: form.fullName, email: form.email, phone: form.phone, city: form.city, state: form.state, donationPurpose: form.donationPurpose, amount: form.amount, paymentMode: form.paymentMode, receiptPreference: "email", country: "India", notes: form.message }) });
      } else if (selected === "movement" || selected === "partner") {
        if (form.message.trim().length < 10) throw new Error("Please tell us briefly how you would like to contribute (at least 10 characters).");
        data = await request(`${API_BASE_URL}/api/interest`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: selected, fullName: form.fullName, email: form.email, phone: form.phone, message: form.message }) });
      }
      setMessage(data?.message || "Application submitted successfully. SSF will review it.");
      setForm((p) => ({ ...p, message: "" }));
      window.dispatchEvent(new CustomEvent("ssf-portal-refresh"));
    } catch (e) { setError(e.message || "Unable to submit the application."); }
    finally { setBusy(false); }
  };

  const content = (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl">
        <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 px-6 py-7 text-white sm:px-8"><span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">JOIN SSF • TAKE PART</span><h2 className="mt-3 text-2xl font-bold sm:text-3xl">Choose how you want to be part of SSF</h2><p className="mt-2 text-sm leading-6 text-white/90 sm:text-base">Select an option below. The form will open right here — you will not be sent to another page.</p></div>
        <div className="p-5 sm:p-7"><label htmlFor="ssf-role" className="mb-2 block text-sm font-semibold text-gray-800">Select an opportunity</label><select id="ssf-role" value={selected} onChange={(e) => choose(e.target.value)} className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"><option value="">Choose from six ways to participate…</option>{roles.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</select>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{roles.map((r) => <button key={r.id} type="button" onClick={() => choose(r.id)} className={`group rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${selected === r.id ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-gray-200 bg-white"}`}><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">{r.icon}</span><span><span className="block font-bold text-gray-900">{r.title}</span><span className="mt-1 block text-sm leading-5 text-gray-600">{r.text}</span><span className="mt-3 block text-sm font-semibold text-emerald-700">Open form →</span></span></div></button>)}</div>
          {role && <form onSubmit={submit} className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6"><div className="flex items-center gap-3"><span className="text-2xl">{role.icon}</span><div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">SSF Participation</p><h3 className="text-lg font-bold text-gray-900">{role.title}</h3></div></div>
            <div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Full name" required value={form.fullName} onChange={(v) => set("fullName", v)} /><Field label="Email" required type="email" value={form.email} onChange={(v) => set("email", v)} /><Field label="Mobile number" required value={form.phone} onChange={(v) => set("phone", v)} />
              {selected === "volunteer" && <SelectField label="Volunteer category" required value={form.volunteerCategory} onChange={(v) => set("volunteerCategory", v)} options={["", "General Volunteer", "Education & Teaching", "Health & Awareness", "Women Empowerment", "Rural Development", "Environment & Plantation", "Digital / IT & Media", "Fundraising & Outreach", "Event & Field Support"]} />}
              {selected === "member" && <SelectField label="Membership type" required value={form.memberType} onChange={(v) => set("memberType", v)} options={["", "General Member", "Active Member", "Life Member", "Advisory Member"]} />}
              {selected === "intern" && <><Field label="College / Institution" required value={form.college} onChange={(v) => set("college", v)} /><Field label="Course / Programme" required value={form.course} onChange={(v) => set("course", v)} /><Field label="Internship area" required value={form.internshipType} onChange={(v) => set("internshipType", v)} /><Field label="Duration" required value={form.duration} onChange={(v) => set("duration", v)} /><Field label="Preferred start date" type="date" value={form.startDate} onChange={(v) => set("startDate", v)} /></>}
              {selected === "donor" && <><Field label="City" value={form.city} onChange={(v) => set("city", v)} /><Field label="State" value={form.state} onChange={(v) => set("state", v)} /><Field label="Donation purpose" value={form.donationPurpose} onChange={(v) => set("donationPurpose", v)} /><Field label="Amount (optional)" type="number" value={form.amount} onChange={(v) => set("amount", v)} /><SelectField label="Payment mode" value={form.paymentMode} onChange={(v) => set("paymentMode", v)} options={["", "upi", "bank_transfer", "other"]} /></>}
            </div>
            {selected === "intern" && <div className="mt-4"><FileField label="Resume (PDF/DOC/DOCX)" required accept="application/pdf,.doc,.docx" onChange={(f) => set("resume", f)} /></div>}
            <label className="mt-4 block text-sm font-semibold text-gray-700">Message / Notes<textarea required={false} value={form.message} onChange={(e) => set("message", e.target.value)} rows="4" placeholder="Optional notes" className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-emerald-500" /></label>
            <button disabled={busy} type="submit" className="mt-5 rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white shadow hover:bg-emerald-800 disabled:opacity-60">{busy ? "Submitting…" : "Submit Application"}</button>
            {message && <div className="mt-4 rounded-xl bg-emerald-100 p-4 text-sm font-semibold text-emerald-800">{message}</div>}{error && <div className="mt-4 rounded-xl bg-red-100 p-4 text-sm font-semibold text-red-700">{error}</div>}
          </form>}
        </div>
      </div>
    </section>
  );
  return mountNode ? createPortal(content, mountNode) : null;
}
function Field({ label, value, onChange, type = "text", required = false }) { return <label className="block text-sm font-semibold text-gray-700">{label}{required ? " *" : ""}<input required={required} type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 outline-none focus:border-emerald-500" /></label>; }
function SelectField({ label, value, onChange, options, required = false }) { return <label className="block text-sm font-semibold text-gray-700">{label}{required ? " *" : ""}<select required={required} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 outline-none focus:border-emerald-500">{options.map((o) => <option key={o} value={o}>{o || "Select"}</option>)}</select></label>; }
function FileField({ label, onChange, accept, required = false }) { return <label className="block text-sm font-semibold text-gray-700">{label}{required ? " *" : ""}<input required={required} type="file" accept={accept} onChange={(e) => onChange(e.target.files?.[0] || null)} className="mt-2 block w-full rounded-xl border border-gray-300 bg-white p-2 text-sm" /></label>; }
