import { useEffect, useState } from "react";
import { ENDPOINTS } from "../config/api";
import logoImg from "../assets/new-logo.png";
import { downloadNoticePdf } from "../utils/noticePdf";

const headers = token => ({ Authorization: `Bearer ${token}` });
const dateText = value => value ? new Date(value).toLocaleString("en-IN") : "—";
const noticeEscape = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const openNoticePreview = row => {
  const due = row.replyDueAt ? new Date(row.replyDueAt).toLocaleString("hi-IN", { dateStyle:"long", timeStyle:"short" }) : "जवाब की तारीख दर्ज नहीं";
  const lines = row.status !== "draft" && row.noticeText ? row.noticeText : [
    "प्रति: " + row.personName,
    "सदस्य ID: " + (row.memberId || "रजिस्टर में उपलब्ध नहीं / पुष्टि अपेक्षित"),
    "वर्तमान पद: " + (row.currentDesignation || "रिकॉर्ड अनुसार"),
    "संपर्क ईमेल: " + row.email,
    "विषय: अपना पक्ष/स्पष्टीकरण प्रस्तुत करने के संबंध में।",
    row.noticeText ? "अतिरिक्त विवरण: " + row.noticeText : "",
    "लागू नियम/उप-नियम: " + row.bylawClause,
    "प्रस्तावित कार्रवाई का कारण: " + row.grounds,
    "तथ्य एवं उपलब्ध रिकॉर्ड: " + row.factualSummary,
    "जवाब की अंतिम तारीख: " + due,
    "ऑनलाइन जवाब लिंक: नोटिस जारी होने पर जोड़ा जाएगा।",
    "यदि आप व्यक्तिगत/ऑनलाइन सुनवाई चाहते हैं, तो जवाब में इसकी मांग और सुविधाजनक संपर्क विवरण लिखें।",
    "यह नोटिस केवल अपना पक्ष रखने का अवसर है; यह दोष सिद्धि, सदस्यता समाप्ति या पद से हटाने का अंतिम आदेश नहीं है।"
  ].filter(Boolean).join("\n\n");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>SSF Notice Preview</title>
  <style>body{font:15px/1.7 Arial,sans-serif;color:#172b3a;margin:0;background:#eef2f6}.sheet{max-width:800px;margin:28px auto;background:#fff;padding:42px 48px;border:1px solid #d7dee8;box-shadow:0 4px 24px #0f172a18}.head{display:flex;align-items:center;gap:20px;border-bottom:3px solid #176447;padding-bottom:18px}.head img{width:92px;height:92px;object-fit:contain}.en{font-size:22px;font-weight:800;color:#12345A}.hi{font-size:17px;font-weight:700;color:#176447}.meta{display:flex;justify-content:space-between;gap:12px;margin-top:22px;font-size:13px}.body{white-space:pre-wrap;margin-top:20px}.foot{border-top:1px solid #d7dee8;margin-top:32px;padding-top:12px;font-size:12px;color:#64748b}.print{margin:20px 0;padding:10px 18px;background:#12345A;color:white;border:0;border-radius:8px}@media print{body{background:white}.sheet{margin:0;border:0;box-shadow:none;max-width:none;padding:18mm}.print{display:none}}</style></head><body>
  <main class="sheet"><header class="head"><img src="${noticeEscape(new URL(logoImg, window.location.origin).href)}" alt="SSF Logo"><div><div class="en">SWASTIK SRIJAN FOUNDATION SAMITI</div><div class="hi">स्वास्तिक सृजन फाउंडेशन समिति</div><div>आधिकारिक सूचना / Official Communication</div></div></header>
  <div class="meta"><b>नोटिस संदर्भ: ${noticeEscape(row.noticeReference || "ड्राफ्ट")}</b><b>दिनांक: ${noticeEscape(new Date().toLocaleDateString("hi-IN"))}</b></div>
  <h2 style="text-align:center;color:#12345A">कारण बताओ नोटिस</h2><div class="body">${noticeEscape(lines)}</div>
  <footer class="foot">Swastik Srijan Foundation Samiti | यह पूर्वावलोकन है। जारी करने से पहले सभी विवरण जाँचें।</footer>
  <button class="print" onclick="window.print()">प्रिंट / PDF सेव करें</button></main></body></html>`;
  const w = window.open("", "_blank");
  if (!w) { window.alert("पॉप-अप ब्लॉक है। ब्राउज़र में इस साइट के पॉप-अप की अनुमति दें।"); return; }
  w.document.open(); w.document.write(html); w.document.close();
};
const REGISTER_COLUMNS = [
  ["रिकॉर्ड ID","id"],["नोटिस Ref. No.","noticeReference"],["नाम","personName"],["ईमेल","email"],["मोबाइल","phone"],["सदस्य ID","memberId"],
  ["वर्तमान पद","currentDesignation"],["कार्रवाई का दायरा","actionScope"],["लागू नियम","bylawClause"],
  ["कारण","grounds"],["तथ्य/दस्तावेज","factualSummary"],["नोटिस","noticeText"],["जवाब अंतिम तारीख","replyDueAt"],
  ["स्थिति","status"],["भेजने का माध्यम","dispatchMethod"],["भेजने का प्रमाण","dispatchReference"],
  ["भेजने की तारीख","dispatchAt"],["ईमेल स्थिति","emailDeliveryStatus"],["प्राप्त जवाब","replyText"],
  ["जवाब प्राप्त तारीख","replyReceivedAt"],["सुनवाई तारीख","hearingAt"],["सुनवाई विवरण","hearingNotes"],
  ["समिति बैठक संदर्भ","committeeMeetingReference"],["समिति कार्यवाही","committeeDecisionText"],
  ["सामान्य सभा संदर्भ","generalBodyMeetingReference"],["सामान्य सभा कार्यवाही","generalBodyDecisionText"],
  ["अंतिम निर्णय प्रकार","decisionType"],["अंतिम निर्णय/आदेश","decisionText"],["निर्णय तारीख","decisionAt"],
  ["रिकॉर्ड बनाया","createdAt"],["अंतिम अपडेट","updatedAt"]
];
const NAVY = "FF12345A";
const exportRegister = async rows => {
  // A real .xlsx workbook. It is a point-in-time snapshot, not a live sheet:
  // download a fresh export after any new action.
  const mod = await import("exceljs");
  const ExcelJS = mod.default || mod;
  const wb = new ExcelJS.Workbook();
  wb.creator = "SSF Notice Register";
  wb.created = new Date();
  const ws = wb.addWorksheet("Notice Register");
  ws.columns = REGISTER_COLUMNS.map(c => ({ header: c[0], key: c[1], width: Math.min(46, Math.max(14, c[0].length + 6)) }));
  const hr = ws.getRow(1);
  hr.font = { bold: true, color: { argb: "FFFFFFFF" } };
  hr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  hr.alignment = { vertical: "middle", wrapText: true };
  hr.height = 22;
  rows.forEach(row => {
    const out = {};
    REGISTER_COLUMNS.forEach(c => { const v = row[c[1]]; out[c[1]] = v == null ? "" : (typeof v === "object" ? JSON.stringify(v) : v); });
    ws.addRow(out);
  });
  ws.autoFilter = { from: "A1", to: { row: 1, column: REGISTER_COLUMNS.length } };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  const a = document.createElement("a");
  a.href = url; a.download = "SSF_Member_Notice_Action_Register.xlsx"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
};

export default function MemberActionManager({ token }) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ personName:"", email:"", phone:"", memberId:"", currentDesignation:"", actionScope:"office_bearer_role_review", bylawClause:"नियम 8 / नियम 12 / लागू नियम", grounds:"", factualSummary:"", replyDueAt:"", noticeText:"" });
  const [memberMatches, setMemberMatches] = useState([]);
  const [lookupMessage, setLookupMessage] = useState("");
  const [closing, setClosing] = useState(null);

  const load = async () => { const r = await fetch(ENDPOINTS.ADMIN_MEMBER_ACTIONS, { headers: headers(token) }); const d = await r.json().catch(() => []); if (!r.ok) throw new Error(d.message || "रजिस्टर लोड नहीं हुआ"); setRows(Array.isArray(d) ? d : []); };
  useEffect(() => { load().catch(e => setMessage(e.message)); }, [token]);
  const update = (key, value) => setForm(p => ({ ...p, [key]: value }));
  const lookupMember = async () => {
    const params = new URLSearchParams();
    if (form.personName.trim()) params.set("name", form.personName.trim());
    if (form.email.trim()) params.set("email", form.email.trim());
    if (form.phone.trim()) params.set("phone", form.phone.trim());
    if (![...params.keys()].length) return;
    try {
      const r = await fetch(`${ENDPOINTS.ADMIN_MEMBER_LOOKUP}?${params.toString()}`, { headers: headers(token) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.message || "सदस्य नहीं मिला");
      const matches = Array.isArray(d.matches) ? d.matches : [];
      setMemberMatches(matches);
      if (matches.length === 1) {
        const m = matches[0];
        setForm(p => ({ ...p, memberId: m.memberId || "", personName: p.personName || m.fullName || "", email: p.email || m.email || "", phone: p.phone || m.phone || "", currentDesignation: p.currentDesignation || m.designation || "" }));
        setLookupMessage("सदस्य रजिस्टर से Member ID अपने-आप भर दी गई।");
      } else if (matches.length > 1) setLookupMessage("एक से अधिक सदस्य मिले हैं। नीचे सही सदस्य चुनें।");
      else setLookupMessage("रजिस्टर में मिलान नहीं मिला। गैर-सदस्य/नए व्यक्ति के लिए ID खाली रखें।");
    } catch (e) { setLookupMessage(e.message); }
  };
  const selectMember = m => { setForm(p => ({ ...p, memberId:m.memberId, personName:m.fullName||p.personName, email:m.email||p.email, phone:m.phone||p.phone, currentDesignation:m.designation||p.currentDesignation })); setMemberMatches([]); setLookupMessage("सदस्य चुना गया: "+m.memberId); };
  const createDraft = async e => {
    e.preventDefault(); setBusy(true); setMessage("");
    try { const r = await fetch(ENDPOINTS.ADMIN_MEMBER_ACTIONS, { method:"POST", headers:{ ...headers(token), "Content-Type":"application/json" }, body:JSON.stringify({ ...form, replyDueAt:new Date(form.replyDueAt).toISOString() }) }); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.message || "ड्राफ्ट सेव नहीं हुआ"); setMessage("नोटिस ड्राफ्ट सुरक्षित हो गया। जारी करने से पहले सभी तथ्य और नियम जाँचें।"); setForm(p=>({ ...p, personName:"", email:"", phone:"", memberId:"", currentDesignation:"", grounds:"", factualSummary:"", replyDueAt:"", noticeText:"" })); await load(); }
    catch(e){ setMessage(e.message); } finally { setBusy(false); }
  };
  const act = async (row, body) => {
    setBusy(true); setMessage("");
    try { const r=await fetch(`${ENDPOINTS.ADMIN_MEMBER_ACTIONS}/${row.id}`, { method:"PATCH", headers:{ ...headers(token), "Content-Type":"application/json" }, body:JSON.stringify(body) }); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.message || "कार्रवाई विफल"); if(d.emailWarning) setMessage(d.emailWarning); else if(d.responseUrl) { await navigator.clipboard?.writeText(d.responseUrl).catch(()=>{}); setMessage("नोटिस जारी हुआ। जवाब लिंक कॉपी करने का प्रयास किया गया: "+d.responseUrl); } else setMessage("रिकॉर्ड अपडेट हो गया।"); await load(); return true; }
    catch(e){ setMessage(e.message); return false; } finally { setBusy(false); }
  };
  const saveNoticePdf = async row => { try { await downloadNoticePdf(row); } catch (e) { setMessage("PDF बनाते समय त्रुटि: " + (e.message || e)); } };
  const remove = async row => { if(row.status!=="draft"){ if(!window.confirm(`सचेत रहें: “${row.personName}” का जारी हो चुका नोटिस रिकॉर्ड है। इसे हटाने से उनका जवाब लिंक काम नहीं करेगा। क्या वाकई हटाना है?`)) return; } else if(!window.confirm("क्या आप इस नोटिस ड्राफ्ट को हटाना चाहते हैं? यह वापस नहीं आएगा।")) return; setBusy(true); setMessage(""); try { const url = `${ENDPOINTS.ADMIN_MEMBER_ACTIONS}/${row.id}` + (row.status!=="draft" ? "?force=true" : ""); const r=await fetch(url, { method:"DELETE", headers:headers(token) }); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.message || "रिकॉर्ड हटाया नहीं जा सका"); setMessage("रिकॉर्ड हटा दिया गया।"); await load(); } catch(e){ setMessage(e.message); } finally { setBusy(false); } };
  const issue = row => { openNoticePreview(row); const method=window.prompt("पहले खुले पूर्वावलोकन में पूरा नोटिस जाँचें। भेजने का माध्यम: email / registered_post / speed_post / hand_delivery / email_and_post","email"); if(!method) return; const ref=["registered_post","speed_post","hand_delivery","email_and_post"].includes(method) ? window.prompt("डाक रसीद / डिलीवरी प्रमाण का विवरण दर्ज करें:") : ""; if(ref===null) return; if(!window.confirm("जारी करने से पहले पुष्टि करें: सही सदस्य/ID, सही ईमेल, लागू नियम, स्पष्ट तथ्य/कारण और उचित जवाब-अवधि जाँच ली है? नोटिस भेजने के बाद लॉक हो जाएगा।")) return; act(row,{action:"issue_notice",dispatchMethod:method,dispatchReference:ref||"",logoUrl:new URL(logoImg, window.location.origin).href}); };
  const hearing = row => { const when=window.prompt("सुनवाई की तारीख और समय (उदाहरण: 2026-11-25T11:00)"); if(!when) return; const notes=window.prompt("सुनवाई का स्थान/ऑनलाइन माध्यम और सूचना विवरण"); if(!notes) return; act(row,{action:"hearing",hearingAt:when,hearingNotes:notes}); };
  const committee = row => { const ref=window.prompt("प्रबंध समिति बैठक/कार्यवाही संदर्भ"); if(!ref) return; const note=window.prompt("जवाब, सुनवाई और समिति की चर्चा का पूरा सार"); if(!note) return; act(row,{action:"committee_review",committeeMeetingReference:ref,decisionText:note}); };
  const generalBody = row => { const ref=window.prompt("सामान्य सभा बैठक/प्रस्ताव संदर्भ"); if(!ref) return; const note=window.prompt("सामान्य सभा की कार्यवाही और निर्णय का पूरा विवरण"); if(!note) return; act(row,{action:"general_body_review",generalBodyMeetingReference:ref,decisionText:note}); };
  // "अंतिम निर्णय दर्ज करें" opens a proper form. The old flow used window.prompt
  // pop-ups; when a step was skipped (e.g. a role-change decision chosen before
  // the General Body stage) it only flashed an alert, the record never changed,
  // and the "अगला चरण" hint kept reappearing with no visible reason.
  const openClose = row => setClosing({ row, decisionType: "no_action", note: "", ref: "" });
  const submitClose = async e => {
    e.preventDefault();
    const { row, decisionType, note, ref } = closing;
    const ok = await act(row, { action: "close", decisionType, decisionText: note.trim(), generalBodyMeetingReference: ref.trim(), committeeMeetingReference: row.committeeMeetingReference || "" });
    if (ok) setClosing(null);
  };
  // Click-to-WhatsApp: opens WhatsApp with the notice text pre-filled for the
  // member's number. The admin still presses Send in WhatsApp, so this is a
  // manual share, not an automated Cloud API delivery.
  const shareWhatsApp = row => {
    const digits = String(row.phone || "").replace(/\D/g, "");
    if (digits.length < 10) { window.alert("इस रिकॉर्ड में मान्य मोबाइल नंबर नहीं है। पहले नंबर जोड़ें।"); return; }
    const to = digits.length === 10 ? "91" + digits : digits;
    const noticeBody = row.noticeText || ["कारण बताओ नोटिस", "प्रति: " + row.personName, "नोटिस संदर्भ: " + (row.noticeReference || "जारी होना बाकी"), "नियम: " + row.bylawClause, "कारण: " + row.grounds, "तथ्य: " + row.factualSummary, "जवाब की अंतिम तारीख: " + (row.replyDueAt ? new Date(row.replyDueAt).toLocaleString("hi-IN") : "—")].join("\n");
    const body = row.status === "draft" ? "⚠️ यह केवल नोटिस का मसौदा है। अभी औपचारिक रूप से जारी नहीं हुआ है; इसे आधिकारिक नोटिस न मानें।\n\n" + noticeBody : noticeBody;
    window.open("https://wa.me/" + to + "?text=" + encodeURIComponent(body), "_blank");
  };
  const status = {draft:"ड्राफ्ट",notice_issued:"नोटिस जारी",reply_received:"जवाब प्राप्त",hearing_scheduled:"सुनवाई तय",committee_review:"समिति समीक्षा",general_body_review:"सामान्य सभा समीक्षा",closed:"बंद"};
  return <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b p-6 sm:p-8"><div><h2 className="text-2xl font-black text-[#12345A]">सदस्य / पदाधिकारी नोटिस एवं कार्रवाई रजिस्टर</h2><p className="mt-2 text-sm text-slate-600">आसान प्रक्रिया: 1. ड्राफ्ट  2. नोटिस  3. जवाब  4. सुनवाई  5. समिति  6. सामान्य सभा (जहाँ जरूरी)  7. अंतिम आदेश। जवाब आने से केस अपने-आप बंद नहीं होता।</p><p className="mt-2 text-xs text-slate-500">Excel डाउनलोड उस समय का स्नैपशॉट है (live नहीं)। नई कार्रवाई के बाद दोबारा डाउनलोड करें। WhatsApp साझा करना मैनुअल है — स्वतः WhatsApp Delivery के लिए Meta Cloud API सेटअप आवश्यक है।</p></div><button type="button" onClick={()=>exportRegister(rows)} disabled={!rows.length} className="rounded-xl border border-[#12345A] px-4 py-2 text-sm font-bold text-[#12345A] disabled:opacity-40">Excel रजिस्टर डाउनलोड करें (.xlsx)</button></div>
    <form onSubmit={createDraft} className="grid gap-4 border-b bg-slate-50 p-6 sm:grid-cols-2 sm:p-8">
      <h3 className="sm:col-span-2 text-lg font-bold text-[#12345A]">नया कारण बताओ नोटिस — ड्राफ्ट</h3>
      <input required value={form.personName} onChange={e=>update("personName",e.target.value)} onBlur={lookupMember} placeholder="सदस्य / पदाधिकारी का पूरा नाम" className="rounded-xl border p-3"/>
      <input required type="email" value={form.email} onChange={e=>update("email",e.target.value)} onBlur={lookupMember} placeholder="आधिकारिक ईमेल" className="rounded-xl border p-3"/>
      <input value={form.phone} onChange={e=>update("phone",e.target.value)} onBlur={lookupMember} placeholder="मोबाइल" className="rounded-xl border p-3"/>
      <input value={form.memberId} onChange={e=>update("memberId",e.target.value)} placeholder="Member ID (अपने-आप भरेगी)" className="rounded-xl border p-3" readOnly/>
      <input value={form.currentDesignation} onChange={e=>update("currentDesignation",e.target.value)} placeholder="वर्तमान पद (यदि हो)" className="rounded-xl border p-3"/>
      {lookupMessage && <div className="sm:col-span-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{lookupMessage}</div>}
      {memberMatches.length>1 && <div className="sm:col-span-2 rounded-xl border bg-white p-3"><p className="mb-2 text-sm font-bold">सही सदस्य चुनें</p>{memberMatches.map(m=><button type="button" key={m.memberId} onClick={()=>selectMember(m)} className="mr-2 mb-2 rounded-lg border px-3 py-2 text-left text-sm hover:bg-slate-50">{m.fullName} • {m.memberId} • {m.designation||"पद दर्ज नहीं"}</button>)}</div>}
      <select value={form.actionScope} onChange={e=>update("actionScope",e.target.value)} className="rounded-xl border p-3"><option value="office_bearer_role_review">केवल पदाधिकारी पद की समीक्षा</option><option value="membership_review">सदस्यता की समीक्षा</option></select>
      <input required value={form.bylawClause} onChange={e=>update("bylawClause",e.target.value)} placeholder="नियमावली का लागू नियम/उप-नियम" className="rounded-xl border p-3 sm:col-span-2"/>
      <textarea required value={form.grounds} onChange={e=>update("grounds",e.target.value)} rows={3} placeholder="कारण — स्पष्ट और निष्पक्ष भाषा में" className="rounded-xl border p-3 sm:col-span-2"/>
      <textarea required value={form.factualSummary} onChange={e=>update("factualSummary",e.target.value)} rows={4} placeholder="तारीखों सहित तथ्य/रिकॉर्ड/दस्तावेजों का सार" className="rounded-xl border p-3 sm:col-span-2"/>
      <label className="text-sm font-semibold text-slate-600">जवाब की अंतिम तारीख<input required type="datetime-local" value={form.replyDueAt} onChange={e=>update("replyDueAt",e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label>
      <textarea value={form.noticeText} onChange={e=>update("noticeText",e.target.value)} rows={4} placeholder="वैकल्पिक: अतिरिक्त विवरण लिखें। नियम, कारण, तथ्य, जवाब की तारीख और जवाब लिंक सिस्टम नोटिस में जोड़ेगा।" className="rounded-xl border p-3"/>
      <button disabled={busy} className="rounded-xl bg-[#12345A] px-5 py-3 font-bold text-white disabled:opacity-50 sm:col-span-2">{busy?"सेव हो रहा है…":"नोटिस ड्राफ्ट सुरक्षित करें"}</button>
    </form>
    {message && <p className="break-words border-b bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    <div className="divide-y">{rows.length===0?<p className="p-8 text-center text-slate-400">अभी कोई नोटिस रिकॉर्ड नहीं है।</p>:rows.map(row=><article key={row.id} className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="mb-2 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">नोटिस Ref. No.: {row.noticeReference || "जारी होना बाकी"}</div><h3 className="font-bold text-[#12345A]">{row.personName} {row.memberId ? "• "+row.memberId : ""}</h3><p className="text-sm text-slate-500">{row.email} • {row.currentDesignation || (row.actionScope==="membership_review"?"सदस्यता समीक्षा":"पदाधिकारी समीक्षा")}</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">{status[row.status]||row.status}</span></div>
      <p className="mt-3 text-sm text-slate-600">नियम: {row.bylawClause} • जवाब की तारीख: {dateText(row.replyDueAt)}</p>
      {row.replyText && <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm"><b>प्राप्त जवाब:</b><p className="mt-1 whitespace-pre-wrap">{row.replyText}</p></div>}
      {row.hearingNotes && <p className="mt-2 text-sm text-slate-600">सुनवाई: {dateText(row.hearingAt)} • {row.hearingNotes}</p>}
      {row.committeeDecisionText && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700"><b>समिति कार्यवाही:</b> {row.committeeDecisionText}</p>}{row.generalBodyDecisionText && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700"><b>सामान्य सभा कार्यवाही:</b> {row.generalBodyDecisionText}</p>}{row.decisionText && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700"><b>अंतिम निर्णय:</b> {row.decisionText}</p>}
      {row.status!=="draft" && row.noticeText && <button type="button" onClick={()=>openNoticePreview(row)} className="mt-4 mr-2 rounded-lg border border-[#12345A] px-4 py-2 text-sm font-bold text-[#12345A]">पूरी नोटिस प्रति देखें</button>}
      {row.status==="draft" && <><button type="button" onClick={()=>openNoticePreview(row)} className="mt-4 mr-2 rounded-lg border border-[#12345A] px-4 py-2 text-sm font-bold text-[#12345A]">पूरा नोटिस देखें</button><button disabled={busy} onClick={()=>issue(row)} className="mt-4 rounded-lg bg-[#176447] px-4 py-2 text-sm font-bold text-white">नोटिस जाँचकर जारी करें</button></>}
      <button type="button" onClick={()=>saveNoticePdf(row)} className="mt-4 mr-2 rounded-lg border border-[#176447] px-4 py-2 text-sm font-bold text-[#176447]">PDF डाउनलोड करें</button>
      <button type="button" onClick={()=>shareWhatsApp(row)} className="mt-4 mr-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-bold text-white">{row.status==="draft"?"ड्राफ्ट WhatsApp पर साझा करें":"WhatsApp पर साझा करें"}</button>
      {["notice_issued","reply_received","hearing_scheduled"].includes(row.status) && <div className="mt-4 flex flex-wrap gap-2">{["notice_issued","reply_received"].includes(row.status) && <button disabled={busy} onClick={()=>hearing(row)} className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-bold text-white">सुनवाई तय करें</button>}<button disabled={busy} onClick={()=>committee(row)} className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-bold text-white">समिति कार्यवाही दर्ज करें</button></div>}
      {row.status==="committee_review" && <div className="mt-4 flex flex-wrap gap-2"><button disabled={busy} onClick={()=>generalBody(row)} className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-bold text-white">सामान्य सभा में रखें</button><button disabled={busy} onClick={()=>openClose(row)} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">अंतिम निर्णय दर्ज करें</button></div>}
      {row.status==="general_body_review" && <button disabled={busy} onClick={()=>openClose(row)} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white">सामान्य सभा के निर्णय के बाद बंद करें</button>}
      {row.dispatchMethod && <p className="mt-3 text-xs text-slate-400">भेजने का माध्यम: {row.dispatchMethod} • {row.dispatchReference||row.emailDeliveryStatus||"—"}</p>}
      <button type="button" disabled={busy} onClick={()=>remove(row)} className="mt-4 mr-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700">{row.status==="draft"?"रिकॉर्ड हटाएँ":"रिकॉर्ड हटाएँ (सचेत)"}</button>
      {row.status==="closed" && <p className="mt-2 text-xs font-bold text-slate-500">अंतिम निर्णय: {row.decisionType}</p>}{row.status==="reply_received" && <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">अगला चरण: जवाब पढ़ें → आवश्यकता हो तो सुनवाई तय करें → फिर समिति की बैठक में कार्यवाही दर्ज करें।</p>}{row.status==="hearing_scheduled" && <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">अगला चरण: सुनवाई पूरी होने पर उसका सार दर्ज रखें → समिति कार्यवाही दर्ज करें।</p>}{row.status==="committee_review" && <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">अगला चरण: जहाँ नियम/निर्णय के लिए जरूरी हो, सामान्य सभा की कार्यवाही दर्ज करें; अन्यथा सक्षम समिति का वैध अंतिम निर्णय दर्ज करें।</p>}
    </article>)}</div>
    {closing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={()=>setClosing(null)}>
      <form onSubmit={submitClose} onClick={e=>e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-black text-[#12345A]">अंतिम निर्णय दर्ज करें</h3>
        <p className="mt-1 text-sm text-slate-500">{closing.row.personName} • {closing.row.noticeReference || "—"} • {status[closing.row.status]}</p>
        <label className="mt-4 block text-sm font-semibold text-slate-600">निर्णय का प्रकार
          <select value={closing.decisionType} onChange={e=>setClosing(p=>({...p, decisionType:e.target.value}))} className="mt-1 w-full rounded-xl border p-3">
            <option value="no_action">कोई कार्रवाई नहीं</option>
            <option value="advisory">सलाह</option>
            <option value="warning">चेतावनी</option>
            {closing.row.actionScope==="office_bearer_role_review" && <option value="role_change_approved">पद में परिवर्तन (सामान्य सभा आवश्यक)</option>}
            {closing.row.actionScope==="membership_review" && <option value="membership_termination_approved">सदस्यता समाप्ति (सामान्य सभा आवश्यक)</option>}
            <option value="other">अन्य निर्णय</option>
          </select>
        </label>
        {["role_change_approved","membership_termination_approved"].includes(closing.decisionType) && <>
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{closing.row.status==="general_body_review" ? "यह निर्णय सामान्य सभा की कार्यवाही के आधार पर दर्ज होगा।" : "ध्यान दें: पद/सदस्यता समाप्ति से पहले सामान्य सभा की विधिवत कार्यवाही आवश्यक है। पहले “सामान्य सभा में रखें” से कार्यवाही दर्ज करें, वरना यह निर्णय अस्वीकार हो जाएगा।"}</p>
          <label className="mt-3 block text-sm font-semibold text-slate-600">सामान्य सभा बैठक/प्रस्ताव संदर्भ
            <input value={closing.ref} onChange={e=>setClosing(p=>({...p, ref:e.target.value}))} placeholder="उदाहरण: GB/2026/01" className="mt-1 w-full rounded-xl border p-3"/>
          </label>
        </>}
        <label className="mt-3 block text-sm font-semibold text-slate-600">अंतिम आदेश/कारण सहित पूरा निर्णय
          <textarea required value={closing.note} onChange={e=>setClosing(p=>({...p, note:e.target.value}))} rows={5} placeholder="सक्षम निकाय का पूरा निर्णय और उसके कारण लिखें…" className="mt-1 w-full rounded-xl border p-3"/>
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={()=>setClosing(null)} className="rounded-xl border px-4 py-2 text-sm font-bold text-slate-600">रद्द करें</button>
          <button type="submit" disabled={busy || !closing.note.trim()} className="rounded-xl bg-emerald-700 px-5 py-2 text-sm font-bold text-white disabled:opacity-50">{busy?"सुरक्षित हो रहा है…":"अंतिम निर्णय सुरक्षित करें"}</button>
        </div>
      </form>
    </div>}
  </section>;
}
