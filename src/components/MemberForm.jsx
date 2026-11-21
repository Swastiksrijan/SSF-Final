import { useState } from "react";
import { API_BASE_URL } from "../config/api";

const CATEGORIES = [
  { id: "patron", title: "Patron Member", hindi: "संरक्षक सदस्य", amount: "₹10,000 या अधिक", amountEn: "₹10,000 or more", note: "एकमुश्त या एक वर्ष के भीतर अधिकतम 12 किस्तों में", noteEn: "One-time or up to 12 instalments within one year" },
  { id: "life", title: "Life Member", hindi: "आजीवन सदस्य", amount: "₹8,000 या अधिक", amountEn: "₹8,000 or more", note: "नियमावली के अनुसार अंशदान", noteEn: "Contribution as per the bylaws" },
  { id: "general", title: "Ordinary Member", hindi: "साधारण सदस्य", amount: "₹100 प्रति माह या ₹1,200 प्रति वर्ष", amountEn: "₹100 per month or ₹1,200 per year", note: "सदस्यता भुगतान की अवधि तक मान्य", noteEn: "Valid for the paid membership period" },
];

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PHOTO_MAX_BYTES = 2 * 1024 * 1024;

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
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoNotice, setPhotoNotice] = useState("");
  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null); setPhotoPreview(""); setPhotoNotice("");
  };

  const onPhotoChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) { clearPhoto(); return; }
    if (!PHOTO_TYPES.includes(file.type)) {
      clearPhoto(); event.target.value = "";
      setPhotoNotice("फोटो JPG, PNG या WebP होनी चाहिए। / Photo must be JPG, PNG or WebP.");
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      clearPhoto(); event.target.value = "";
      setPhotoNotice("फोटो 2 MB या उससे छोटी होनी चाहिए। / Photo must be 2 MB or smaller.");
      return;
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); setPhotoNotice("");
  };

  // The photo is optional: any upload failure must never block the application.
  const uploadPhoto = async () => {
    if (!photoFile) return "";
    try {
      const body = new FormData();
      body.append("profilePhoto", photoFile);
      const response = await fetch(`${API_BASE_URL}/api/member-application-photo`, { method: "POST", body });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.photoPath) return result.photoPath;
      setPhotoNotice("फोटो अपलोड नहीं हो सकी — आवेदन बिना फोटो जमा होगा। / The photo could not be uploaded; the application will be submitted without it.");
    } catch {
      setPhotoNotice("फोटो अपलोड नहीं हो सकी — आवेदन बिना फोटो जमा होगा। / The photo could not be uploaded; the application will be submitted without it.");
    }
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.dateOfBirth || !form.address.trim() || !form.occupation.trim()) {
      setError("कृपया सभी आवश्यक जानकारी भरें। / Please fill in all required details."); return;
    }
    if (!form.citizenshipConfirmed || !form.acceptsRules || !form.goodCharacter || !form.noAlcohol || !form.declaration || form.electronicSignature.trim().toLowerCase() !== form.fullName.trim().toLowerCase()) {
      setError("कृपया सभी घोषणाएँ स्वीकार करें और अपने पूरे नाम से डिजिटल हस्ताक्षर करें। / Please accept all declarations and sign with your full name."); return;
    }
    setStatus("submitting");
    const photoPath = await uploadPhoto();
    try {
      const response = await fetch(`${API_BASE_URL}/api/member-application-bylaw`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photoPath: photoPath || undefined, address: form.address.trim(), occupation: form.occupation.trim(), fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim(), declaration: "I declare that the information supplied is true and request membership subject to the registered rules and required authorization." })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "आवेदन जमा नहीं हो सका। / The application could not be submitted.");
      setApplicationId(result.applicationId || "");
      setImsRecordId(result.imsRecordId || "");
      setMessage(result.message || "आवेदन प्राप्त हुआ। / Application received.");
      setStatus("success");
    } catch (err) {
      setError(err.message || "आवेदन जमा नहीं हो सका। कृपया पुनः प्रयास करें। / The application could not be submitted. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-6 md:p-8">
      <div className="text-3xl mb-3">✓</div>
      <h3 className="text-2xl font-black text-[#12345A]">आवेदन प्राप्त हुआ / Application received</h3>
      <p className="mt-2 text-[#26343D]">{message}</p>
      {applicationId && <p className="mt-3 text-sm font-semibold text-[#12345A]">Application Reference: {applicationId}</p>}{imsRecordId && <p className="mt-1 text-sm font-semibold text-[#176447]">IMS Membership Record: {imsRecordId}</p>}
      <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        <strong>स्थिति: Pending Approval / Status: Pending approval</strong>
        <p className="mt-2">यह आवेदन सदस्यता की स्वीकृति नहीं है। आवश्यक स्वीकृति दर्ज होने और नियमावली की शर्तें पूरी होने के बाद ही सदस्यता प्रभावी होगी। अभी भुगतान न करें; समिति से प्राप्त निर्देशों के अनुसार ही अंशदान करें।</p>
        <p className="mt-2">This is not an approval of membership. Membership becomes effective only after the required approval is recorded and the conditions of the bylaws are met. Please do not pay yet; contribute only as directed by the committee.</p>
      </div>
      <button type="button" onClick={() => { setForm(initial); setStatus("idle"); setApplicationId(""); setImsRecordId(""); clearPhoto(); }} className="mt-5 rounded-xl bg-[#12345A] px-5 py-3 font-bold text-white">नया आवेदन / New application</button>
    </div>
  );

  return (
    <div className="rounded-3xl border border-[#EAF0F6] bg-white p-5 md:p-8 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-[#176447]">Swastik Srijan Foundation Samiti</p>
      <h3 className="mt-2 text-2xl font-black text-[#12345A]">सदस्यता हेतु आवेदन / Membership Application</h3>
      <p className="mt-1 text-sm font-semibold text-[#26343D]">नियमावली के नियम 5–9 के अनुसार / As per Rules 5–9 of the bylaws</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">Swastik Srijan Foundation Samiti से जुड़ने के लिए नीचे अपनी जानकारी भरें। आवेदन की समीक्षा संस्था की अधिकृत प्रक्रिया के अनुसार की जाएगी।</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">Fill in your details below to join Swastik Srijan Foundation Samiti. The application will be reviewed as per the Foundation's authorised process.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {CATEGORIES.map(item => <button type="button" key={item.id} onClick={() => set("memberType", item.id)} className={`rounded-2xl border p-4 text-left transition ${form.memberType === item.id ? "border-[#176447] bg-[#EAF0F6] ring-2 ring-[#176447]/20" : "border-slate-200 hover:border-[#176447]"}`}>
          <span className="block font-bold text-[#12345A]">{item.hindi} / {item.title}</span>
          <span className="mt-3 block font-black text-[#176447]">{item.amount}</span><span className="block text-xs font-semibold text-[#176447]">{item.amountEn}</span>
          <span className="mt-1 block text-xs text-slate-500">{item.note}</span><span className="block text-xs text-slate-500">{item.noteEn}</span>
        </button>)}
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        <strong>सम्माननीय सदस्य / Honorary Member:</strong> यह अलग नामांकन-आधारित श्रेणी है और इस ऑनलाइन आवेदन फॉर्म के माध्यम से उपलब्ध नहीं है। जानकारी के लिए संस्था से संपर्क करें।
        <p className="mt-1">This is a separate nomination-based category and is not available through this online form. Please contact the Foundation for details.</p>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">पूरा नाम / Full name *<input required value={form.fullName} onChange={e => set("fullName", e.target.value)} autoComplete="name" className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
          <label className="block text-sm font-semibold text-slate-700">ईमेल / Email *<input required type="email" value={form.email} onChange={e => set("email", e.target.value)} autoComplete="email" className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
          <label className="block text-sm font-semibold text-slate-700">मोबाइल नंबर / Mobile number *<input required type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} autoComplete="tel" className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
          <label className="block text-sm font-semibold text-slate-700">जन्मतिथि / Date of birth *<input required type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} max={new Date().toISOString().slice(0,10)} className="mt-1 w-full rounded-xl border border-slate-300 p-3" /><span className="mt-1 block text-xs font-normal text-slate-500">नियम 7 के अनुसार आयु कम-से-कम 18 वर्ष होनी चाहिए। / Minimum age 18 years as per Rule 7.</span></label>
          <label className="block text-sm font-semibold text-slate-700">पिता / अभिभावक का नाम / Father or guardian's name<input value={form.fatherOrGuardian} onChange={e => set("fatherOrGuardian", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
          <label className="block text-sm font-semibold text-slate-700">व्यवसाय / Occupation *<input required value={form.occupation} onChange={e => set("occupation", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>
        </div>
        <label className="block text-sm font-semibold text-slate-700">पूरा पता / Full postal address *<textarea required rows={3} value={form.address} onChange={e => set("address", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3" /></label>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="font-bold text-[#12345A]">फोटो (वैकल्पिक) / Photograph (optional)</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">हाल की रंगीन पासपोर्ट आकार की फोटो (लगभग 3.5 × 4.5 सेमी), JPG / PNG / WebP, 2 MB तक। फोटो न देने पर भी आवेदन जमा हो जाएगा। / Recent colour passport-size photo (approx. 3.5 × 4.5 cm), JPG / PNG / WebP up to 2 MB. The application is still accepted without a photo.</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {photoPreview
              ? <img src={photoPreview} alt="Selected photograph / चुनी गई फोटो" className="h-[90px] w-[70px] rounded-lg border border-slate-300 object-cover" />
              : <div className="flex h-[90px] w-[70px] items-center justify-center rounded-lg border border-dashed border-slate-300 text-center text-[10px] font-semibold text-slate-400">35×45 mm</div>}
            <div className="min-w-0">
              <input id="member-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhotoChange} className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#12345A] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" />
              {photoFile && <button type="button" onClick={() => { clearPhoto(); const input = document.getElementById("member-photo"); if (input) input.value = ""; }} className="mt-2 text-xs font-bold text-red-600 underline">फोटो हटाएँ / Remove photo</button>}
            </div>
          </div>
          {photoNotice && <p className="mt-2 text-xs font-semibold text-amber-700">{photoNotice}</p>}
        </div>

        {form.memberType === "patron" && <label className="block text-sm font-semibold text-slate-700">संरक्षक सदस्य अंशदान भुगतान विकल्प / Patron contribution payment option<select value={form.patronInstallments} onChange={e => set("patronInstallments", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3"><option value="1">एकमुश्त ₹10,000 या अधिक / One-time ₹10,000 or more</option><option value="2">2 किस्तें (कम-से-कम ₹5,000 प्रति किस्त) / 2 instalments (min ₹5,000 each)</option><option value="3">3 किस्तें (कम-से-कम ₹3,334 प्रति किस्त) / 3 instalments (min ₹3,334 each)</option><option value="4">4 किस्तें (कम-से-कम ₹2,500 प्रति किस्त) / 4 instalments (min ₹2,500 each)</option><option value="6">6 किस्तें (कम-से-कम ₹1,667 प्रति किस्त) / 6 instalments (min ₹1,667 each)</option><option value="12">12 किस्तें (कम-से-कम ₹834 प्रति किस्त) / 12 instalments (min ₹834 each)</option></select><span className="mt-1 block text-xs font-normal text-slate-500">सभी किस्तें एक वर्ष के भीतर पूरी करनी होंगी। समिति की अनुमति के बाद ही भुगतान करें। / All instalments must be completed within one year. Pay only after the committee's approval.</span></label>}
        {form.memberType === "general" && <label className="block text-sm font-semibold text-slate-700">साधारण सदस्यता भुगतान अवधि / Ordinary membership payment period
          <select value={form.paymentPlan} onChange={e => set("paymentPlan", e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-3"><option value="monthly">₹100 प्रति माह / ₹100 per month</option><option value="annual">₹1,200 प्रति वर्ष / ₹1,200 per year</option></select>
        </label>}
        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
          <p className="font-bold text-[#12345A]">नियम 7 के अनुसार पात्रता एवं घोषणा / Eligibility and declaration under Rule 7 *</p>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.acceptsRules} onChange={e => set("acceptsRules", e.target.checked)} /> <span>मैं संस्था की नियमावली का पालन करने के लिए सहमत हूँ। / I agree to follow the Foundation's bylaws.</span></label>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.goodCharacter} onChange={e => set("goodCharacter", e.target.checked)} /> <span>मैं घोषित करता/करती हूँ कि मेरा चरित्र अच्छा है। / I declare that I am of good character.</span></label>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.noAlcohol} onChange={e => set("noAlcohol", e.target.checked)} /> <span>मैं नियमावली में दी गई मद्यपान संबंधी शर्त स्वीकार करता/करती हूँ। / I accept the alcohol-related condition stated in the bylaws.</span></label>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.citizenshipConfirmed} onChange={e => set("citizenshipConfirmed", e.target.checked)} /> <span>मैं भारतीय नागरिक हूँ। / I am an Indian citizen.</span></label>
          <label className="flex gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.declaration} onChange={e => set("declaration", e.target.checked)} /> <span>मेरे द्वारा दी गई जानकारी सत्य है। मैं समझता/समझती हूँ कि आवेदन की समीक्षा निर्धारित प्रक्रिया के अनुसार होगी और आवेदन जमा करने मात्र से सदस्यता नहीं मिलेगी। / The information I have given is true. I understand that the application will be reviewed as per the prescribed process and that submitting it does not by itself grant membership.</span></label>
        </div>
        <label className="block text-sm font-semibold text-slate-700">इलेक्ट्रॉनिक हस्ताक्षर / सहमति — अपना पूरा नाम लिखें / Electronic signature — type your full name *<input required value={form.electronicSignature} onChange={e => set("electronicSignature", e.target.value)} placeholder="पूरा नाम जैसा ऊपर लिखा है / Full name as written above" className="mt-1 w-full rounded-xl border border-slate-300 p-3" /><span className="mt-1 block text-xs font-normal text-slate-500">यह ऑनलाइन सहमति/हस्ताक्षर का रिकॉर्ड होगा। नियमावली में लिखित आवेदन की शर्त की स्थानीय रजिस्ट्रार प्रक्रिया के अनुसार पुष्टि आवश्यक हो सकती है; समिति हस्ताक्षरित प्रति भी मांग सकती है। / This will be recorded as your online consent/signature. The Foundation may ask for a signed copy as required under the bylaws.</span></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={status === "submitting"} type="submit" className="w-full rounded-xl bg-[#12345A] px-6 py-4 font-black text-white hover:bg-[#176447] disabled:opacity-60">{status === "submitting" ? "आवेदन जमा हो रहा है… / Submitting…" : "आवेदन जमा करें / Submit Membership Application"}</button>
        <p className="text-xs leading-relaxed text-slate-500">आवेदन मिलने पर समिति द्वारा समीक्षा की जाएगी। स्वीकृति/अस्वीकृति और प्रवेश की तारीख व रसीद संख्या सदस्यता रजिस्टर में दर्ज की जाएगी। कृपया समिति के निर्देश से पहले भुगतान न करें।</p>
        <p className="text-xs leading-relaxed text-slate-500">The committee will review the application. Approval or rejection, admission date and receipt number will be recorded in the membership register. Please do not pay before the committee's instructions.</p>
      </form>
    </div>
  );
}
