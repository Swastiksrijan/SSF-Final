import { useState } from "react";
import { API_BASE_URL } from "../config/api";

const initial = { requestType: "existing_member", fullName: "", email: "", phone: "", memberId: "", designation: "", address: "", occupation: "", requestedChanges: "", termStart: "", termEnd: "" };
export default function GovernanceVerificationForm() {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/governance-verifications`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Request could not be submitted.");
      setResult(data); setForm(initial);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  if (result) return <div className="rounded-3xl border border-emerald-200 bg-white p-7 shadow-xl"><h2 className="text-2xl font-black text-[#12345A]">अनुरोध प्राप्त हुआ</h2><p className="mt-3 text-slate-700">{result.message}</p><p className="mt-2 font-bold text-[#176447]">Reference: {result.reference}</p><button onClick={() => setResult(null)} className="mt-5 rounded-xl bg-[#12345A] px-5 py-3 font-bold text-white">नया अनुरोध</button></div>;
  return <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl space-y-5">
    <div><p className="text-xs font-black uppercase tracking-widest text-[#176447]">SSF Governance Records</p><h2 className="mt-2 text-2xl font-black text-[#12345A]">सदस्य एवं पदाधिकारी सत्यापन</h2><p className="mt-2 text-sm text-slate-600">यह सत्यापन अनुरोध है, नया सदस्यता आवेदन नहीं। पुराने सदस्य की Member ID नहीं बदलेगी और कोई नया सदस्य रिकॉर्ड/ID स्वतः नहीं बनेगा।</p></div>
    <label className="block text-sm font-bold text-slate-700">सत्यापन का प्रकार<select value={form.requestType} onChange={e => set("requestType",e.target.value)} className="mt-1 w-full rounded-xl border p-3"><option value="existing_member">पुराने सदस्य का वार्षिक सत्यापन / विवरण अपडेट</option><option value="office_bearer">पदाधिकारी / Managing Committee सत्यापन</option></select></label>
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-semibold">पूरा नाम *<input required value={form.fullName} onChange={e=>set("fullName",e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label>
      <label className="block text-sm font-semibold">ईमेल *<input required type="email" value={form.email} onChange={e=>set("email",e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label>
      <label className="block text-sm font-semibold">मोबाइल *<input required value={form.phone} onChange={e=>set("phone",e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label>
      {form.requestType === "existing_member" ? <label className="block text-sm font-semibold">मौजूदा Member ID *<input required value={form.memberId} onChange={e=>set("memberId",e.target.value)} placeholder="SSF-MBR-00001" className="mt-1 w-full rounded-xl border p-3"/></label> : <label className="block text-sm font-semibold">मौजूदा Member ID (यदि जारी है)<input value={form.memberId} onChange={e=>set("memberId",e.target.value)} placeholder="यदि उपलब्ध हो" className="mt-1 w-full rounded-xl border p-3"/></label>}
      {form.requestType === "office_bearer" && <label className="block text-sm font-semibold">समिति में पद *<input required value={form.designation} onChange={e=>set("designation",e.target.value)} placeholder="जैसे अध्यक्ष / सचिव / कोषाध्यक्ष" className="mt-1 w-full rounded-xl border p-3"/></label>}
      <label className="block text-sm font-semibold">व्यवसाय / Occupation<input value={form.occupation} onChange={e=>set("occupation",e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label>
      {form.requestType === "office_bearer" && <><label className="block text-sm font-semibold">कार्यकाल प्रारंभ<input type="date" value={form.termStart} onChange={e=>set("termStart",e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label><label className="block text-sm font-semibold">कार्यकाल समाप्ति<input type="date" value={form.termEnd} onChange={e=>set("termEnd",e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label></>}
    </div>
    <label className="block text-sm font-semibold">पूरा पता<textarea rows={2} value={form.address} onChange={e=>set("address",e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label>
    <label className="block text-sm font-semibold">{form.requestType === "existing_member" ? "अपडेट / सत्यापन संबंधी जानकारी" : "पद / समिति संबंधी अतिरिक्त जानकारी"}<textarea rows={3} value={form.requestedChanges} onChange={e=>set("requestedChanges",e.target.value)} placeholder="पता, मोबाइल, व्यवसाय, पद या अन्य सुधार लिखें" className="mt-1 w-full rounded-xl border p-3"/></label>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={busy} className="w-full rounded-xl bg-[#12345A] px-5 py-4 font-black text-white disabled:opacity-60">{busy ? "जमा हो रहा है…" : "सत्यापन अनुरोध जमा करें"}</button>
  </form>;
}
