import { useEffect, useState } from "react";
import { ENDPOINTS } from "../config/api";

const headers = token => ({ Authorization: `Bearer ${token}` });
const dateText = value => value ? new Date(value).toLocaleString("en-IN") : "—";

export default function MemberActionManager({ token }) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ personName:"", email:"", phone:"", memberId:"", currentDesignation:"", actionScope:"office_bearer_role_review", bylawClause:"नियम 8 / नियम 12 / लागू नियम", grounds:"", factualSummary:"", replyDueAt:"", noticeText:"" });
  const load = async () => { const r = await fetch(ENDPOINTS.ADMIN_MEMBER_ACTIONS, { headers: headers(token) }); const d = await r.json().catch(() => []); if (!r.ok) throw new Error(d.message || "रजिस्टर लोड नहीं हुआ"); setRows(Array.isArray(d) ? d : []); };
  useEffect(() => { load().catch(e => setMessage(e.message)); }, [token]);
  const update = (key, value) => setForm(p => ({ ...p, [key]: value }));
  const createDraft = async e => {
    e.preventDefault(); setBusy(true); setMessage("");
    try { const r = await fetch(ENDPOINTS.ADMIN_MEMBER_ACTIONS, { method:"POST", headers:{ ...headers(token), "Content-Type":"application/json" }, body:JSON.stringify({ ...form, replyDueAt:new Date(form.replyDueAt).toISOString() }) }); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.message || "ड्राफ्ट सेव नहीं हुआ"); setMessage("नोटिस ड्राफ्ट सुरक्षित हो गया। जारी करने से पहले सभी तथ्य और नियम जाँचें।"); setForm(p=>({ ...p, personName:"", email:"", phone:"", memberId:"", currentDesignation:"", grounds:"", factualSummary:"", replyDueAt:"", noticeText:"" })); await load(); }
    catch(e){ setMessage(e.message); } finally { setBusy(false); }
  };
  const act = async (row, body) => {
    setBusy(true); setMessage("");
    try { const r=await fetch(`${ENDPOINTS.ADMIN_MEMBER_ACTIONS}/${row.id}`, { method:"PATCH", headers:{ ...headers(token), "Content-Type":"application/json" }, body:JSON.stringify(body) }); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.message || "कार्रवाई विफल"); if(d.responseUrl) { await navigator.clipboard?.writeText(d.responseUrl).catch(()=>{}); setMessage("नोटिस जारी हुआ। जवाब लिंक कॉपी करने का प्रयास किया गया: "+d.responseUrl); } else setMessage("रिकॉर्ड अपडेट हो गया।"); await load(); }
    catch(e){ setMessage(e.message); } finally { setBusy(false); }
  };
  const issue = row => { const method=window.prompt("भेजने का माध्यम: email / registered_post / speed_post / hand_delivery / email_and_post","email"); if(!method) return; const ref=["registered_post","speed_post","hand_delivery","email_and_post"].includes(method) ? window.prompt("डाक रसीद / डिलीवरी प्रमाण का विवरण दर्ज करें:") : ""; if(ref===null) return; if(!window.confirm("क्या आपने नोटिस के सभी तथ्य, नियम, पता और जवाब की अंतिम तारीख जाँच ली है? जारी करने के बाद नोटिस लॉक हो जाएगा।")) return; act(row,{action:"issue_notice",dispatchMethod:method,dispatchReference:ref||""}); };
  const hearing = row => { const when=window.prompt("सुनवाई की तारीख और समय (उदाहरण: 2026-11-25T11:00)"); if(!when) return; const notes=window.prompt("सुनवाई का स्थान/ऑनलाइन माध्यम और सूचना विवरण"); if(!notes) return; act(row,{action:"hearing",hearingAt:when,hearingNotes:notes}); };
  const committee = row => { const ref=window.prompt("प्रबंध समिति बैठक/कार्यवाही संदर्भ"); if(!ref) return; const note=window.prompt("जवाब, सुनवाई और समिति की चर्चा का पूरा सार"); if(!note) return; act(row,{action:"committee_review",committeeMeetingReference:ref,decisionText:note}); };
  const generalBody = row => { const ref=window.prompt("सामान्य सभा बैठक/प्रस्ताव संदर्भ"); if(!ref) return; const note=window.prompt("सामान्य सभा की कार्यवाही और निर्णय का पूरा विवरण"); if(!note) return; act(row,{action:"general_body_review",generalBodyMeetingReference:ref,decisionText:note}); };
  const close = row => { const type=window.prompt("निर्णय प्रकार: no_action / advisory / warning / role_change_approved / membership_termination_approved / other"); if(!type) return; const ref=window.prompt("सक्षम निकाय की बैठक/प्रस्ताव संख्या (यदि पद/सदस्यता समाप्ति का निर्णय है)",""); const note=window.prompt("अंतिम आदेश/कारण सहित पूरा निर्णय"); if(!note) return; act(row,{action:"close",decisionType:type,committeeMeetingReference:ref||"",decisionText:note}); };
  const status = {draft:"ड्राफ्ट",notice_issued:"नोटिस जारी",reply_received:"जवाब प्राप्त",hearing_scheduled:"सुनवाई तय",committee_review:"समिति समीक्षा",general_body_review:"सामान्य सभा समीक्षा",closed:"बंद"};
  return <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b p-6 sm:p-8"><h2 className="text-2xl font-black text-[#12345A]">सदस्य / पदाधिकारी नोटिस एवं कार्रवाई रजिस्टर</h2><p className="mt-2 text-sm text-slate-600">ड्राफ्ट → नोटिस और जवाब → सुनवाई → बैठक कार्यवाही → सक्षम निकाय का निर्णय। कोई स्वतः निष्कासन नहीं।</p></div>
    <form onSubmit={createDraft} className="grid gap-4 border-b bg-slate-50 p-6 sm:grid-cols-2 sm:p-8">
      <h3 className="sm:col-span-2 text-lg font-bold text-[#12345A]">नया कारण बताओ नोटिस — ड्राफ्ट</h3>
      <input required value={form.personName} onChange={e=>update("personName",e.target.value)} placeholder="सदस्य / पदाधिकारी का पूरा नाम" className="rounded-xl border p-3"/>
      <input required type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="आधिकारिक ईमेल" className="rounded-xl border p-3"/>
      <input value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="मोबाइल" className="rounded-xl border p-3"/>
      <input value={form.memberId} onChange={e=>update("memberId",e.target.value)} placeholder="पुराना Member ID (यदि हो)" className="rounded-xl border p-3"/>
      <input value={form.currentDesignation} onChange={e=>update("currentDesignation",e.target.value)} placeholder="वर्तमान पद (यदि हो)" className="rounded-xl border p-3"/>
      <select value={form.actionScope} onChange={e=>update("actionScope",e.target.value)} className="rounded-xl border p-3"><option value="office_bearer_role_review">केवल पदाधिकारी पद की समीक्षा</option><option value="membership_review">सदस्यता की समीक्षा</option></select>
      <input required value={form.bylawClause} onChange={e=>update("bylawClause",e.target.value)} placeholder="नियमावली का लागू नियम/उप-नियम" className="rounded-xl border p-3 sm:col-span-2"/>
      <textarea required value={form.grounds} onChange={e=>update("grounds",e.target.value)} rows={3} placeholder="कारण — स्पष्ट और निष्पक्ष भाषा में" className="rounded-xl border p-3 sm:col-span-2"/>
      <textarea required value={form.factualSummary} onChange={e=>update("factualSummary",e.target.value)} rows={4} placeholder="तारीखों सहित तथ्य/रिकॉर्ड/दस्तावेजों का सार" className="rounded-xl border p-3 sm:col-span-2"/>
      <label className="text-sm font-semibold text-slate-600">जवाब की अंतिम तारीख<input required type="datetime-local" value={form.replyDueAt} onChange={e=>update("replyDueAt",e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label>
      <textarea value={form.noticeText} onChange={e=>update("noticeText",e.target.value)} rows={4} placeholder="वैकल्पिक: पूरा नोटिस स्वयं लिखें; खाली छोड़ने पर सिस्टम ड्राफ्ट तैयार करेगा।" className="rounded-xl border p-3"/>
      <button disabled={busy} className="rounded-xl bg-[#12345A] px-5 py-3 font-bold text-white disabled:opacity-50 sm:col-span-2">{busy?"सेव हो रहा है…":"नोटिस ड्राफ्ट सुरक्षित करें"}</button>
    </form>
    {message && <p className="break-words border-b bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    <div className="divide-y">{rows.length===0?<p className="p-8 text-center text-slate-400">अभी कोई नोटिस रिकॉर्ड नहीं है।</p>:rows.map(row=><article key={row.id} className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-[#12345A]">{row.personName} {row.memberId ? "• "+row.memberId : ""}</h3><p className="text-sm text-slate-500">{row.email} • {row.currentDesignation || (row.actionScope==="membership_review"?"सदस्यता समीक्षा":"पदाधिकारी समीक्षा")}</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">{status[row.status]||row.status}</span></div>
      <p className="mt-3 text-sm text-slate-600">नियम: {row.bylawClause} • जवाब की तारीख: {dateText(row.replyDueAt)}</p>
      {row.replyText && <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm"><b>प्राप्त जवाब:</b><p className="mt-1 whitespace-pre-wrap">{row.replyText}</p></div>}
      {row.hearingNotes && <p className="mt-2 text-sm text-slate-600">सुनवाई: {dateText(row.hearingAt)} • {row.hearingNotes}</p>}
      {row.decisionText && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">कार्यवाही/निर्णय: {row.decisionText}</p>}
      {row.status==="draft" && <button disabled={busy} onClick={()=>issue(row)} className="mt-4 rounded-lg bg-[#176447] px-4 py-2 text-sm font-bold text-white">नोटिस जाँचकर जारी करें</button>}
      {["notice_issued","reply_received"].includes(row.status) && <div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={()=>hearing(row)} className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-bold text-white">सुनवाई तय करें</button><button disabled={busy} onClick={()=>committee(row)} className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-bold text-white">समिति कार्यवाही दर्ज करें</button></div>}
      {row.status==="committee_review" && <div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={()=>generalBody(row)} className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-bold text-white">सामान्य सभा में रखें</button><button disabled={busy} onClick={()=>close(row)} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">अंतिम निर्णय दर्ज करें</button></div>}
      {row.status==="general_body_review" && <button disabled={busy} onClick={()=>close(row)} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white">सामान्य सभा के निर्णय के बाद बंद करें</button>}
      {row.dispatchMethod && <p className="mt-3 text-xs text-slate-400">भेजने का माध्यम: {row.dispatchMethod} • {row.dispatchReference||row.emailDeliveryStatus||"—"}</p>}
      {row.status==="closed" && <p className="mt-2 text-xs font-bold text-slate-500">अंतिम निर्णय: {row.decisionType}</p>}
    </article>)}</div>
  </section>;
}
