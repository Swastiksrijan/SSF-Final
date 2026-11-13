import { useState } from "react";
import { API_BASE_URL } from "../config/api";

const CATEGORIES = [
  { id: "patron", title: "Patron Member", hindi: "संरक्षक सदस्य", amount: "₹10,000 या अधिक", note: "एकमुश्त या एक वर्ष के भीतर अधिकतम 12 किस्तों में" },
  { id: "life", title: "Life Member", hindi: "आजीवन सदस्य", amount: "₹8,000 या अधिक", note: "नियमावली के अनुसार अंशदान" },
  { id: "general", title: "Ordinary Member", hindi: "साधारण सदस्य", amount: "₹100 प्रति माह या ₹1,200 प्रति वर्ष", note: "सदस्यता भुगतान की अवधि तक मान्य" },
];

const initial = {
  fullName: "", email: "", phone: "", dateOfBirth: "", fatherOrGuardian: "",
  address: "", occupation: "", citizenship: "Indian", citizenshipConfirmed: false, memberType: "general", paymentPlan: "annual", patronInstallments: "1",
  electronicSignature: "", acceptsRules: false, goodCharacter: false, noAlcohol: false, declaration: false,
};

export default function MemberForm({ initialMemberType = "general" }) {
  const initialType = ["patron", "life", "general"].includes(initialMemberType) ? initialMemberType : "general";
  const [form, setForm] = useState({ ...initial, memberType: initialType });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [imsRecordId, setImsRecordId] = useState("");
  const [message, setMessage] = useState("");
  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const selected = CATEGORIES.find(item => item.id === form.memberType) || CATEGORIES[2];

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.dateOfBirth || !form.address.trim() || !form.occupation.trim()) {
      setError("कृपया सभी आवश्यक जानकारी भरें।"); return;
    }
    if (!form.citizenshipConfirmed || !form.acceptsRules || !form.goodCharacter || !form.noAlcohol || !form.declaration || form.electronicSignature.trim().toLowerCase() !== form.fullName.trim().toLowerCase()) {
      setError("कृपया सभी घोषणाएँ स्वीकार करें और अपने पूरे नाम से डिजिटल हस्ताक्षर करें।"); return;
    }
    setStatus("submitting");
    try {
      const response = await fetch(`${API_BASE_URL}/api/member-application-bylaw`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, address: form.address.trim(), occupation: form.occupation.trim(), fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim(), declaration: "I declare that the information supplied is true and request membership subject to the registered rules and required authorization." })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "आवेदन जमा नहीं हो सका।");
      setApplicationId(result.applicationId || "");
      setImsRecordId(result.imsRecordId || "");
      setMessage(result.message || "आवेदन प्राप्त हुआ।");
      setStatus("success");
    } catch (err) {
      setError(err.message || "आवेदन जमा नहीं हो सका। कृपया पुनः प्रयास करें।");
      setStatus("error");
    }
  };

  if (status === "success") return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-6 md:p-8">
      <div className="text-3xl mb-3">✓</div>
      <h3 className="text-2xl font-black text-[#12345A]">आवेदन प्राप्त हुआ</h3>
      <p className="mt-2 text-[#26343D]">{message}</p>
      {applicationId && <p className="mt-3 text-sm font-semibold text-[#12345A]">Application Reference: {applicationId}</p>}{imsRecordId && <p className="mt-1 text-sm font-semibold text-[#176447]">IMS Membership Record: {imsRecordId}</p>}
      <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        <strong>स्थिति: Pending Approval</strong><br />यह आवेदन सदस्यता की स्वीकृति नहीं है। आवश्यक स्वीकृति दर्ज होने और नियमावली की शर्तें पूरी होने के बाद ही सदस्यता प्रभावी होगी। अभी भुगतान न करें; समिति से प्राप्त निर्देशों के अनुसार ही अंशदान करें।
      </div>
      <button type="button" onClick={() => { setForm(initial); setStatus("idle"); setApplicationId(""); setImsRecordId(""); }} className="mt-5 rounded-xl bg-[#12345A] px-5 py-3 font-bold text-white">Close / नया आवेदन</button>
    </div>
  );

  return (
    <div className="rounded-3xl border border-[#EAF0F6] bg-white p-5 md:p-8 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-[#176447]">Swastik Srijan Foundation Samiti</p>
      <h3 className="mt-2 text-2xl font-black text-[#12345A]">सदस्यता हेतु आवेदन</h3>
      <p className="mt-1 text-sm font-semibold text-[#26343D]">Membership Application Form · नियमावली के नियम 5–9 के अनुसार</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">Swastik Srijan Foundation Samiti से जुड़ने के लिए नीचे अपनी जानकारी भरें। आवेदन की समीक्षा संस्था की अधिकृत प्रक्रिया के अनुसार की जाएगी।</p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {CATEGORIES.map(item => <button type="button" key={item.id} onClick={() => set("memberType", item.id)} className={`rounded-2xl border p-4 text-left transition ${form.memberType === item.id ? "border-[#176447] bg-[#EAF0F6] ring-2 ring-[#176447]/20" : "border-slate-200 hover:border-[#176447]"}`}>
          <span className="block font-bold text-[#12345A]">{item.title}</span><span className="block text-sm text-slate-600">{item.hindi}</span>
          <span className="mt-3 block font-black text-[#176447]">{item.amount}</span><span className="mt-1 block text-xs text-slate-500">{item.note}</span>
        </button>)}
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        <strong>सम्माननीय सदस्य:</strong> यह अलग नामांकन-आधारित श्रेणी है और इस ऑनलाइन आवेदन फॉर्म के माध्यम से उपलब्ध नहीं है। जानकारी के लिए संस्था से संपर्क करें।
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">पूरा नाम *<input required value={form.fullName} onChange={e => set("fullName", e.target.value)} autoComplete="name" className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
          <label className="block text-sm font-semibold text-slate-700">ईमेल *<input required type="email" value={form.email} onChange={e => set("email", e.target.value)} autoComplete="email" className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
          <label className="block text-sm font-semibold text-slate-700">मोबाइल नंबर *<input required type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} autoComplete="tel" className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
          <label className="block text-sm font-semibold text-slate-700">जन्मतिथि *<input required type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} max={new Date().toISOString().slice(0,10)} className="mt-1 w-full rounded-xl border border-slate-300 p-3" /><span className="mt-1 block text-xs font-normal text-slate-500">नियम 7 के अनुसार आयु कम-से-कम 18 वर्ष होनी चाहिए।</span></label>
          <label className="block text-sm font-semibold text-slate-700">पिता / अभिभावक का नाम<input value={form.fatherOrGuardian} onChange={e => set("fatherOrGuardian", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
          <label className="block text-sm font-semibold text-slate-700">व्यवसाय / Occupation *<input required value={form.occupation} onChange={e => set("occupation", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
        </div>
        <label className="block text-sm font-semibold text-slate-700">पूरा पता *<textarea required rows={3} value={form.address} onChange={e => set("address", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
        {form.memberType === "patron" && <label className="block text-sm font-semibold text-slate-700">संरक्षक सदस्य अंशदान भुगतान विकल्प<select value={form.patronInstallments} onChange={e => set("patronInstallments", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3"><option value="1">एकमुश्त ₹10,000 या अधिक</option><option value="2">2 किस्तें (कम-से-कम ₹5,000 प्रति किस्त)</option><option value="3">3 किस्तें (कम-से-कम ₹3,334 प्रति किस्त)</option><option value="4">4 किस्तें (कम-से-कम ₹2,500 प्रति किस्त)</option><option value="6">6 किस्तें (कम-से-कम ₹1,667 प्रति किस्त)</option><option value="12">12 किस्तें (कम-से-कम ₹834 प्रति किस्त)</option></select><span className="mt-1 block text-xs font-normal text-slate-500">सभी किस्तें एक वर्ष के भीतर पूरी करनी होंगी। समिति की अनुमति के बाद ही भुगतान करें।</span></label>}
        {form.memberType === "general" && <label className="block text-sm font-semibold text-slate-700">साधारण सदस्यता भुगतान अवधि
          <select value={form.paymentPlan} onChange={e => set("paymentPlan", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3"><option value="monthly">₹100 प्रति माह</option><option value="annual">₹1,200 प्रति वर्ष</option></select>
        </label>}
        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
          <p className="font-bold text-[#12345A]">नियम 7 के अनुसार पात्रता एवं घोषणा *</p>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.acceptsRules} onChange={e => set("acceptsRules", e.target.checked)} /> मैं संस्था की नियमावली का पालन करने के लिए सहमत हूँ।</label>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.goodCharacter} onChange={e => set("goodCharacter", e.target.checked)} /> मैं घोषित करता/करती हूँ कि मेरा चरित्र अच्छा है।</label>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.noAlcohol} onChange={e => set("noAlcohol", e.target.checked)} /> मैं नियमावली में दी गई मद्यपान संबंधी शर्त स्वीकार करता/करती हूँ।</label>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.citizenshipConfirmed} onChange={e => set("citizenshipConfirmed", e.target.checked)} /> मैं भारतीय नागरिक हूँ।</label>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.declaration} onChange={e => set("declaration", e.target.checked)} /> मेरे द्वारा दी गई जानकारी सत्य है। मैं समझता/समझती हूँ कि आवेदन की समीक्षा निर्धारित प्रक्रिया के अनुसार होगी और आवेदन जमा करने मात्र से सदस्यता नहीं मिलेगी।</label>
        </div>
        <label className="block text-sm font-semibold text-slate-700">इलेक्ट्रॉनिक हस्ताक्षर / सहमति — अपना पूरा नाम लिखें *<input required value={form.electronicSignature} onChange={e => set("electronicSignature", e.target.value)} placeholder="पूरा नाम जैसा ऊपर लिखा है" className="mt-1 w-full rounded-xl border border-slate-300 p-3" /><span className="mt-1 block text-xs font-normal text-slate-500">यह ऑनलाइन सहमति/हस्ताक्षर का रिकॉर्ड होगा। नियमावली में लिखित आवेदन की शर्त की स्थानीय रजिस्ट्रार प्रक्रिया के अनुसार पुष्टि आवश्यक हो सकती है; समिति हस्ताक्षरित प्रति भी मांग सकती है।</span></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={status === "submitting"} type="submit" className="w-full rounded-xl bg-[#12345A] px-6 py-4 font-black text-white hover:bg-[#176447] disabled:opacity-60">{status === "submitting" ? "आवेदन जमा हो रहा है…" : "Submit Membership Application / आवेदन जमा करें"}</button>
        <p className="text-xs leading-relaxed text-slate-500">आवेदन मिलने पर समिति द्वारा समीक्षा की जाएगी। स्वीकृति/अस्वीकृति और प्रवेश की तारीख व रसीद संख्या सदस्यता रजिस्टर में दर्ज की जाएगी। कृपया समिति के निर्देश से पहले भुगतान न करें।</p>
      </form>
    </div>
  );
}
