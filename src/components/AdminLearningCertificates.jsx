import { useEffect, useMemo, useState } from "react";
import { FaCertificate, FaEye, FaCheckCircle, FaClock, FaExternalLinkAlt, FaSyncAlt } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";
import { generateCertificate } from "../utils/generateCertificate";

const TOKEN_KEY = "ssf_admin_token";

const dateLabel = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

export default function AdminLearningCertificates() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    window.location.assign("/Admin");
  };

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(ENDPOINTS.LEARNING_CERTIFICATE_ADMIN, { headers: authHeaders() });
      if (response.status === 401) return logout();
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data.message || "Unable to load certificate requests.");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Unable to load certificate requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const counts = useMemo(() => ({
    total: items.length,
    requested: items.filter(x => x.status === "requested").length,
    issued: items.filter(x => x.status === "issued").length,
    other: items.filter(x => !["requested", "issued"].includes(x.status)).length
  }), [items]);

  const issue = async (item) => {
    if (!window.confirm(`Review completed for ${item.learnerName}? This will issue the official SSF Learning Certificate ID.`)) return;
    setBusy(item.id);
    try {
      const response = await fetch(ENDPOINTS.LEARNING_CERTIFICATE_ADMIN_ISSUE(item.id), {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ reviewNote: "Reviewed and approved by SSF authorized administrator." })
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) return logout();
      if (!response.ok) throw new Error(result.message || "Certificate issue failed.");
      await load();
      setSelected({ ...item, ...result.certificate, status: "issued", certificateId: result.certificateId || result.certificate?.certificateId });
      window.alert(`Certificate issued successfully.\nCertificate ID: ${result.certificateId || "Issued"}`);
    } catch (e) {
      window.alert(e.message || "Certificate issue failed.");
    } finally {
      setBusy("");
    }
  };

  const download = async (item) => {
    const certId = item.certificateId;
    if (!certId) return window.alert("Certificate ID is not available yet.");
    setBusy(`pdf-${item.id}`);
    try {
      await generateCertificate(
        item.learnerName,
        `Learning Hub Course: ${item.courseTitle}`,
        new Date(item.certificateIssuedAt || item.updatedAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
        certId,
        null,
        "Completion"
      );
    } catch (e) {
      window.alert(`Certificate PDF generation failed: ${e.message}`);
    } finally {
      setBusy("");
    }
  };

  return <section className="rounded-[2rem] bg-white border border-zinc-100 shadow-sm overflow-hidden">
    <div className="p-6 bg-[#002344] text-white">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb067]">SSF Learning Hub</p>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Learning Certificates / शिक्षण प्रमाणपत्र</h2>
          <p className="text-sm text-white/70 mt-2 max-w-3xl">Review completed learning records, issue official certificate IDs, and open the verification record. Account creation alone never issues a certificate.</p>
        </div>
        <button onClick={load} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#002344] px-4 py-2.5 text-sm font-black">
          <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5 border-b border-zinc-100">
      {[["Total Requests", counts.total, FaCertificate], ["Requested", counts.requested, FaClock], ["Issued", counts.issued, FaCheckCircle], ["Other Status", counts.other, FaEye]].map(([label, value, Icon]) =>
        <div key={label} className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4"><Icon className="text-[#ff6600]" /><p className="text-xs uppercase tracking-widest text-zinc-400 font-black mt-2">{label}</p><p className="text-2xl font-black text-[#002344] mt-1">{value}</p></div>
      )}
    </div>

    {error && <div className="mx-5 mt-5 rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm font-semibold">{error}</div>}

    <div className="p-5 overflow-x-auto">
      {items.length === 0 && !loading ? <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">No learning certificate requests yet / अभी कोई प्रमाणपत्र अनुरोध नहीं है।</div> :
      <table className="w-full min-w-[980px] text-sm">
        <thead><tr className="text-left border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500">
          <th className="p-3">Learner</th><th className="p-3">Course</th><th className="p-3">Completion</th><th className="p-3">Assessments</th><th className="p-3">Requested</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
        </tr></thead>
        <tbody>{items.map(item => {
          const modules = Array.isArray(item.moduleAssessments) ? item.moduleAssessments : [];
          const passed = modules.filter(x => x?.passed).length;
          return <tr key={item.id} className="border-b border-zinc-100 align-top">
            <td className="p-3"><div className="font-black text-[#002344]">{item.learnerName || "—"}</div><div className="text-xs text-zinc-500 mt-1">{item.email || "—"}</div></td>
            <td className="p-3"><div className="font-bold max-w-[250px]">{item.courseTitle || item.courseId || "—"}</div><div className="text-xs text-zinc-500 mt-1">{item.learningHours || 0} learning hours</div></td>
            <td className="p-3 font-black">{item.completionPercent ?? 0}%</td>
            <td className="p-3"><div>{passed}/{modules.length || 0} modules passed</div><div className="text-xs mt-1">{item.finalAssessment?.passed ? "Final: Passed" : "Final: Not passed"}</div></td>
            <td className="p-3 text-zinc-600">{dateLabel(item.createdAt)}</td>
            <td className="p-3"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${item.status === "issued" ? "bg-green-100 text-green-700" : item.status === "requested" ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-700"}`}>{item.status || "—"}</span></td>
            <td className="p-3"><div className="flex justify-end gap-2">
              <button onClick={() => setSelected(item)} className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 font-bold text-xs"><FaEye /> Review</button>
              {item.status === "requested" && <button disabled={!!busy} onClick={() => issue(item)} className="inline-flex items-center gap-2 rounded-xl bg-[#002344] text-white px-3 py-2 font-bold text-xs">{busy === item.id ? "Issuing..." : "Issue Certificate"}</button>}
              {item.status === "issued" && <button disabled={!!busy} onClick={() => download(item)} className="inline-flex items-center gap-2 rounded-xl bg-[#ff6600] text-white px-3 py-2 font-bold text-xs">{busy === `pdf-${item.id}` ? "Creating..." : "PDF"}</button>}
            </div></td>
          </tr>;
        })}</tbody>
      </table>}
    </div>

    {selected && <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="p-6 border-b border-zinc-100 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-[#ff6600]">Certificate Review / प्रमाणपत्र समीक्षा</p><h3 className="text-2xl font-black text-[#002344] mt-1">{selected.learnerName || "Learner"}</h3></div><button onClick={() => setSelected(null)} className="text-zinc-500 text-2xl">×</button></div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          {[["Course", selected.courseTitle], ["Email", selected.email], ["Completion", `${selected.completionPercent ?? 0}%`], ["Learning Hours", selected.learningHours || 0], ["Status", selected.status], ["Request Date", dateLabel(selected.createdAt)]].map(([k,v]) => <div key={k} className="rounded-2xl bg-zinc-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-zinc-400">{k}</p><p className="font-bold text-[#002344] mt-1 break-words">{v || "—"}</p></div>)}
          <div className="sm:col-span-2 rounded-2xl border border-zinc-200 p-4"><p className="text-xs font-black uppercase tracking-wider text-zinc-400">Module Assessments</p>{(selected.moduleAssessments || []).map((a,i) => <div key={i} className="flex justify-between gap-4 py-2 border-b last:border-0"><span>{a.moduleId || `Module ${i+1}`}</span><span className={a.passed ? "text-green-700 font-black" : "text-red-700 font-black"}>{a.passed ? "Passed" : "Not passed"}{a.score != null ? ` • ${a.score}%` : ""}</span></div>)}</div>
          <div className="sm:col-span-2 rounded-2xl border border-zinc-200 p-4"><p className="text-xs font-black uppercase tracking-wider text-zinc-400">Final Assessment</p><p className={selected.finalAssessment?.passed ? "text-green-700 font-black mt-1" : "text-red-700 font-black mt-1"}>{selected.finalAssessment?.passed ? "Passed" : "Not passed"}{selected.finalAssessment?.score != null ? ` • ${selected.finalAssessment.score}%` : ""}</p></div>
        </div>
        {selected.certificateId && <div className="mx-6 mb-6 rounded-2xl bg-green-50 border border-green-200 p-4"><p className="text-xs uppercase tracking-widest text-green-700 font-black">Issued Certificate ID</p><p className="text-xl font-black text-[#002344] mt-1">{selected.certificateId}</p><a className="inline-flex items-center gap-2 mt-3 text-sm font-bold text-[#0B3A63]" href={`/LearningCertificateVerify?code=${encodeURIComponent(selected.certificateId)}`} target="_blank" rel="noreferrer"><FaExternalLinkAlt /> Open Verification</a></div>}
        <div className="p-6 border-t border-zinc-100 flex flex-wrap justify-end gap-2">
          <button onClick={() => setSelected(null)} className="rounded-xl bg-zinc-100 px-4 py-2.5 font-bold">Close</button>
          {selected.status === "requested" && <button disabled={!!busy} onClick={() => issue(selected)} className="rounded-xl bg-[#002344] text-white px-5 py-2.5 font-black">{busy === selected.id ? "Issuing..." : "Issue Certificate / जारी करें"}</button>}
          {selected.status === "issued" && <button disabled={!!busy} onClick={() => download(selected)} className="rounded-xl bg-[#ff6600] text-white px-5 py-2.5 font-black">{busy === `pdf-${selected.id}` ? "Creating..." : "Generate PDF / PDF बनाएं"}</button>}
        </div>
      </div>
    </div>}
  </section>;
}
