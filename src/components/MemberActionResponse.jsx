import { useEffect, useState } from "react";
import { ENDPOINTS } from "../config/api";

export default function MemberActionResponse({ token }) {
  const [notice, setNotice] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    fetch(ENDPOINTS.MEMBER_ACTION_RESPONSE(token)).then(async r => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "नोटिस लोड नहीं हो सका।");
      if (active) setNotice(data);
    }).catch(e => { if (active) setMessage(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);
  const submit = async e => {
    e.preventDefault(); setMessage("");
    try {
      const r = await fetch(ENDPOINTS.MEMBER_ACTION_RESPONSE(token), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ replyText: reply }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "जवाब जमा नहीं हो सका।");
      setMessage(data.message || "जवाब प्राप्त हुआ।"); setNotice(n => ({ ...n, status: "reply_received" }));
    } catch (e) { setMessage(e.message); }
  };
  return <main className="min-h-screen bg-slate-50 px-4 pb-12 pt-32 sm:px-6"><div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
    <a href="/Members" className="text-sm font-bold text-[#12345A]">← सदस्यता पृष्ठ</a>
    <h1 className="mt-5 text-2xl font-black text-[#12345A]">कारण बताओ नोटिस — अपना पक्ष प्रस्तुत करें</h1>
    <p className="mt-2 text-sm text-slate-600">यह सुरक्षित लिंक केवल संबंधित व्यक्ति के लिए है। आपका जवाब संस्था के आधिकारिक रिकॉर्ड में दर्ज होगा।</p>
    {loading ? <p className="mt-6">नोटिस लोड हो रहा है…</p> : message && !notice ? <p className="mt-6 rounded-xl bg-amber-50 p-4 text-amber-800">{message}</p> : notice ? <>
      <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700"><p><b>नाम:</b> {notice.personName}</p><p><b>नियमावली:</b> {notice.bylawClause}</p><p><b>कारण:</b> {notice.grounds}</p><p><b>संबंधित तथ्य:</b> {notice.factualSummary}</p><p><b>जवाब की अंतिम तारीख:</b> {new Date(notice.replyDueAt).toLocaleDateString("hi-IN")}</p>{notice.noticeText && <pre className="mt-4 whitespace-pre-wrap font-sans">{notice.noticeText}</pre>}</div>
      {notice.status === "notice_issued" ? <form onSubmit={submit} className="mt-6 space-y-3"><label className="block text-sm font-bold text-slate-700">आपका लिखित जवाब / स्पष्टीकरण</label><textarea value={reply} onChange={e => setReply(e.target.value)} required minLength={20} rows={8} className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-[#176447]" placeholder="कृपया अपना पक्ष, तथ्य और उपलब्ध दस्तावेजों का विवरण लिखें…" /><button className="rounded-xl bg-[#12345A] px-6 py-3 font-bold text-white">जवाब जमा करें</button></form> : <p className="mt-6 rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-800">{notice.status === "reply_received" ? "आपका जवाब प्राप्त हो चुका है।" : "यह जवाब पोर्टल अभी जमा करने के लिए खुला नहीं है। जरूरत होने पर संस्था से संपर्क करें।"}</p>}
      {message && <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p>}
    </> : null}
    <p className="mt-8 border-t pt-4 text-xs leading-6 text-slate-500">नोट: नोटिस स्वयं अंतिम निष्कासन या पद से हटाने का आदेश नहीं है। संस्था को आपके जवाब और लागू नियमों पर विचार करना होगा।</p>
  </div></main>;
}
