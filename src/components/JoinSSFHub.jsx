import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { Alert, Field, FileField, FormHead, FormNote, Input, Select, SubmitButton, Textarea } from "./forms/FormUI";

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
        if (!form.profilePhoto) throw new Error("Profile photo is required for your Internship ID card.");
        const fd = new FormData();
        ["fullName", "email", "phone", "college", "course", "internshipType", "duration", "startDate", "message"].forEach((k) => fd.append(k, form[k] || "")); fd.append("resume", form.resume); fd.append("profile_photo", form.profilePhoto); if (form.idDocument) fd.append("id_document", form.idDocument);
        data = await request(`${API_BASE_URL}/api/internship`, { method: "POST", body: fd });
      } else if (selected === "donor") {
        const fd = new FormData();
        ["fullName", "email", "phone", "city", "state", "donationPurpose", "amount", "paymentMode"].forEach((k) => fd.append(k, form[k] || ""));
        fd.append("receiptPreference", "email"); fd.append("country", "India"); fd.append("notes", form.message || "");
        if (form.idDocument) fd.append("id_document", form.idDocument);
        data = await request(`${API_BASE_URL}/api/donor`, { method: "POST", body: fd });
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
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#D8E1EA] bg-white shadow-xl">
        <div className="bg-[#12345A] px-6 py-7 text-white sm:px-8"><span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">JOIN SSF • TAKE PART</span><h2 className="mt-3 text-2xl font-bold sm:text-3xl">Choose how you want to be part of SSF</h2><p className="mt-2 text-sm leading-6 text-white/90 sm:text-base">Select an option below. The form will open right here — you will not be sent to another page.</p></div>
        <div className="p-5 sm:p-7">
          <label htmlFor="ssf-role" className="ssf-label mb-2">Select an opportunity</label>
          <Select id="ssf-role" value={selected} onChange={(e) => choose(e.target.value)}><option value="">Choose from six ways to participate…</option>{roles.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</Select>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{roles.map((r) => <button key={r.id} type="button" onClick={() => choose(r.id)} className={`group rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${selected === r.id ? "border-[#176447] bg-[#EAF0F6] shadow-md" : "border-[#EAF0F6] bg-white"}`}><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF0F6] text-2xl">{r.icon}</span><span><span className="block font-bold text-[#12345A]">{r.title}</span><span className="mt-1 block text-sm leading-5 text-[#26343D]">{r.text}</span><span className="mt-3 block text-sm font-semibold text-[#176447]">Open form →</span></span></div></button>)}</div>
          {role && <form onSubmit={submit} className="mt-6 rounded-2xl border border-[#D8E1EA] bg-[#FAF9F5] p-5 sm:p-6">
            <FormHead eyebrow="SSF Participation" title={role.title} />
            <div className="ssf-form mt-5">
              <div className="ssf-form-grid ssf-form-grid-2">
                <Field label="Full Name" required><Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} /></Field>
                <Field label="Email" required><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
                <Field label="Mobile Number" required><Input type="tel" inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/[^0-9 +()-]/g, ""))} /></Field>
                {selected === "volunteer" && <Field label="Volunteer Category" required><Select value={form.volunteerCategory} onChange={(e) => set("volunteerCategory", e.target.value)}>{["", "General Volunteer", "Education & Teaching", "Health & Awareness", "Women Empowerment", "Rural Development", "Environment & Plantation", "Digital / IT & Media", "Fundraising & Outreach", "Event & Field Support"].map((o) => <option key={o} value={o}>{o || "Select"}</option>)}</Select></Field>}
                {selected === "member" && <Field label="Membership Type" required><Select value={form.memberType} onChange={(e) => set("memberType", e.target.value)}>{["", "General Member", "Active Member", "Life Member", "Advisory Member"].map((o) => <option key={o} value={o}>{o || "Select"}</option>)}</Select></Field>}
                {selected === "intern" && <><Field label="College / Institution" required><Input value={form.college} onChange={(e) => set("college", e.target.value)} /></Field><Field label="Course / Programme" required><Input value={form.course} onChange={(e) => set("course", e.target.value)} /></Field><Field label="Internship Area" required><Input value={form.internshipType} onChange={(e) => set("internshipType", e.target.value)} /></Field><Field label="Duration" required><Input value={form.duration} onChange={(e) => set("duration", e.target.value)} /></Field><Field label="Preferred Start Date" type="date"><Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} /></Field></>}
                {selected === "donor" && <><Field label="City"><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></Field><Field label="State"><Input value={form.state} onChange={(e) => set("state", e.target.value)} /></Field><Field label="Donation Purpose"><Input value={form.donationPurpose} onChange={(e) => set("donationPurpose", e.target.value)} /></Field><Field label="Amount (optional)" type="number"><Input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} /></Field><Field label="Payment Mode"><Select value={form.paymentMode} onChange={(e) => set("paymentMode", e.target.value)}>{["", "upi", "bank_transfer", "other"].map((o) => <option key={o} value={o}>{o || "Select"}</option>)}</Select></Field></>}
              </div>
              {selected === "intern" && <div className="ssf-form-grid ssf-form-grid-2"><FileField label="Resume (PDF/DOC/DOCX)" required accept="application/pdf,.doc,.docx" onChange={(e) => set("resume", e.target.files?.[0] || null)} /><FileField label="Profile Photo" required accept="image/jpeg,image/png,image/webp" hint="JPG, PNG or WebP · max 2MB" onChange={(e) => set("profilePhoto", e.target.files?.[0] || null)} /></div>}
              {selected === "intern" && <FileField label="Identity Document" accept=".jpg,.jpeg,.png,.webp,.pdf,application/pdf" hint="Optional · JPG, PNG or PDF · max 5MB" onChange={(e) => set("idDocument", e.target.files?.[0] || null)} />}
              {selected === "donor" && <FileField label="PAN / Identity Document" accept=".jpg,.jpeg,.png,.webp,.pdf,application/pdf" hint="Optional · JPG, PNG or PDF · max 5MB" onChange={(e) => set("idDocument", e.target.files?.[0] || null)} />}
              <Field label="Message / Notes"><Textarea rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Optional notes" /></Field>
              <FormNote>Your submission is recorded for the SSF team to review and follow up. No payment is involved at this step unless you choose a paid membership or donation.</FormNote>
              {message && <Alert tone="success">{message}</Alert>}
              {error && <Alert tone="error">{error}</Alert>}
              <SubmitButton busy={busy}>Submit Application</SubmitButton>
            </div>
          </form>}
        </div>
      </div>
    </section>
  );
  return mountNode ? createPortal(content, mountNode) : null;
}
