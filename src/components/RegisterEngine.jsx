// SSF Digital Office — reusable Register Engine.
//
// One bilingual, audit-ready pattern for every register so the MIS never has to
// change shape: bilingual headers, Add / Edit / View / Archive / Restore, search,
// FY filter, CSV export and PDF print. Each register is just a `def` object.
import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import logoImg from "../assets/new-logo.png";
import { FaPlus, FaSearch, FaEdit, FaEye, FaArchive, FaUndo, FaFileCsv, FaPrint, FaSync, FaChevronDown } from "react-icons/fa";

export const num = (v) => { const n = parseFloat(String(v == null ? "" : v).replace(/[^0-9.\-]/g, "")); return isFinite(n) ? n : 0; };
export const money = (v) => "₹" + Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const officeDate = (v) => { const s = String(v || ""); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + "-" + m[2] + "-" + m[1] : (s || "—"); };
export const fyOf = (value) => { const s = String(value || "").slice(0, 10); const y = Number(s.slice(0, 4)), m = Number(s.slice(5, 7)); if (!y || !m) return ""; const start = m >= 4 ? y : y - 1; return start + "-" + String((start + 1) % 100).padStart(2, "0"); };
export const inputCls = "w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-[#002344]/20 text-sm";

export const toCsv = (head, rows, filename) => {
  const esc = (x) => '"' + String(x == null ? "" : x).replace(/"/g, '""') + '"';
  const lines = [head.map(esc).join(",")].concat(rows.map((r) => r.map(esc).join(",")));
  const blob = new Blob(["\uFEFF" + lines.join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
};
export const downloadPdf = (doc, filename) => {
  try { doc.save(filename); }
  catch (e) { try { const url = doc.output("bloburl"); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); } catch (err) { console.error("PDF download failed", err); } }
};
export const tablePdf = (title, columns, rows, filename) => {
  const d = new jsPDF({ orientation: "landscape" });
  d.addImage(logoImg, "PNG", 10, 7, 12, 12); d.setTextColor(0, 35, 68); d.setFontSize(13); d.text("Swastik Srijan Foundation Samiti", 26, 13);
  d.setFontSize(9); d.setTextColor(60); d.text(title, 26, 19);
  let y = 28; const maxW = 270; const colW = columns.map(() => Math.max(20, Math.min(58, maxW / columns.length)));
  d.setFontSize(7); d.setTextColor(0, 35, 68); let x = 10; columns.forEach((c, i) => { d.text(String(c).slice(0, 26), x, y); x += colW[i]; }); y += 4;
  d.setTextColor(30);
  rows.forEach((r) => { x = 10; r.forEach((v, i) => { d.text(String(v == null ? "" : v).slice(0, 30), x, y); x += colW[i]; }); y += 4; if (y > 195) { d.addPage(); y = 20; } });
  d.setFontSize(7); d.setTextColor(120); d.text("Computer-generated from SSF Digital Office financial records", 148, 205, { align: "center" });
  downloadPdf(d, filename);
};

const Chip = ({ children, tone = "zinc" }) => {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
    zinc: "bg-zinc-100 text-zinc-600 border-zinc-200",
    navy: "bg-[#002344] text-white border-[#002344]"
  };
  return <span className={"inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border " + (tones[tone] || tones.zinc)}>{children}</span>;
};

// def = { title, titleHi, intro, fields:[{k,l,lHi,t,o,req,ro,def,full}], amountKey, dateKey, codeKey }
function RecordForm({ def, initial, onSubmit, onCancel, busy }) {
  const today = new Date().toISOString().slice(0, 10);
  const seed = {};
  def.fields.forEach((f) => {
    if (initial && Object.prototype.hasOwnProperty.call(initial, f.k)) seed[f.k] = initial[f.k];
    else if (f.def !== undefined) seed[f.k] = f.def;
    else if (f.t === "date" && f.k === (def.dateKey || "date")) seed[f.k] = today;
    else if (f.t === "select") seed[f.k] = f.o[0];
    else seed[f.k] = "";
  });
  const [form, setForm] = useState(seed);
  const set = (k, v) => setForm((x) => ({ ...x, [k]: v }));
  const submit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <form onSubmit={submit} className="p-5 bg-zinc-50 border-b border-zinc-200 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {def.fields.map((f) => (
        <div key={f.k} className={f.full ? "sm:col-span-2 lg:col-span-3" : ""}>
          <label className="block text-[11px] font-black uppercase tracking-wide text-zinc-400 mb-1">
            {f.l}{f.lHi ? " / " + f.lHi : ""}{f.req ? " *" : ""}
          </label>
          {f.t === "select" ? (
            <select value={form[f.k] || ""} onChange={(e) => set(f.k, e.target.value)} className={inputCls} disabled={f.ro}>
              {(f.o || []).map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : f.t === "textarea" ? (
            <textarea value={form[f.k] || ""} onChange={(e) => set(f.k, e.target.value)} className={inputCls} rows={2} disabled={f.ro} />
          ) : (
            <input type={f.t || "text"} step={f.t === "number" ? "0.01" : undefined} required={!!f.req} value={form[f.k] || ""} onChange={(e) => set(f.k, e.target.value)} className={inputCls} disabled={f.ro} />
          )}
        </div>
      ))}
      <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-3">
        <button type="submit" disabled={busy} className="bg-[#002344] text-white rounded-xl px-5 py-2.5 font-bold text-sm disabled:opacity-50">{busy ? "Saving… / सहेजा जा रहा…" : (initial ? "Update / अद्यतन करें" : "Save / सहेजें")}</button>
        <button type="button" onClick={onCancel} className="bg-white border border-zinc-300 text-[#002344] rounded-xl px-5 py-2.5 font-bold text-sm">Cancel / रद्द करें</button>
      </div>
    </form>
  );
}

export default function RegisterEngine({ def, rows, onAdd, onUpdate, onArchive, onRestore, loading, reload }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [q, setQ] = useState("");
  const [fy, setFy] = useState("");
  const [typeF, setTypeF] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const data = Array.isArray(rows) ? rows : [];
  const typeKey = def.fields.find((f) => f.t === "select")?.k;
  const dateKey = def.dateKey || "date";
  const amountKey = def.amountKey;

  const fyList = useMemo(() => Array.from(new Set(data.map((r) => fyOf(r.recordDate)).filter(Boolean))).sort().reverse(), [data]);
  const typeList = useMemo(() => typeKey ? Array.from(new Set(data.map((r) => r.data?.[typeKey]).filter(Boolean))).sort() : [], [data, typeKey]);

  const filtered = data.filter((r) => {
    if (fy && fyOf(r.recordDate) !== fy) return false;
    if (typeF && String(r.data?.[typeKey] || "") !== typeF) return false;
    if (!q) return true;
    const hay = [r.recordId, r.recordType, r.personId, amountKey ? r.data?.[amountKey] : "", ...def.fields.map((f) => r.data?.[f.k])].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const save = async (form) => {
    setBusy(true); setMsg("");
    const amount = amountKey ? (num(form[amountKey]) || null) : null;
    const recordDate = form[dateKey] || form.date || new Date().toISOString().slice(0, 10);
    const recordType = typeKey ? form[typeKey] : (form[def.fields[0]?.k] || def.titleEn);
    let ok;
    if (editing) ok = await onUpdate(editing.id, { recordDate, recordType, amount, data: { ...form, title: recordType } });
    else ok = await onAdd({ recordDate, recordType, amount, data: { ...form, title: recordType } });
    setBusy(false);
    if (ok) { setMsg(editing ? "Updated / अद्यतन हो गया" : "Saved / सहेजा गया"); setShowForm(false); setEditing(null); reload && reload(); }
    else setMsg("Unable to save / सहेज नहीं सका");
  };

  const exportCsv = () => {
    const head = ["ID", ...def.fields.map((f) => f.l + (f.lHi ? " / " + f.lHi : ""))];
    const body = filtered.map((r) => [r.recordId, ...def.fields.map((f) => r.data?.[f.k])]);
    toCsv(head, body, (def.codeKey || def.id || "register") + "-" + (fy || "all") + ".csv");
  };
  const printPdf = () => {
    const cols = ["ID", ...def.fields.map((f) => f.l)];
    const body = filtered.map((r) => [r.recordId, ...def.fields.map((f) => r.data?.[f.k])]);
    tablePdf((def.title || "") + (fy ? " · FY " + fy : ""), cols, body, (def.codeKey || def.id || "register") + "-" + (fy || "all") + ".pdf");
  };

  const isArchivedView = data.length > 0 && data.every((r) => r.status === "deleted");

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100">
          <div>
            <h3 className="text-lg font-black text-[#002344]">{def.title} <span className="text-zinc-400 font-bold">/ {def.titleHi}</span></h3>
            {def.intro && <p className="text-xs text-zinc-500 mt-0.5">{def.intro}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={fy} onChange={(e) => setFy(e.target.value)} className="border border-zinc-300 rounded-xl px-3 py-2 text-sm font-bold text-[#002344]">
              <option value="">All FY / सभी वर्ष</option>
              {fyList.map((y) => <option key={y} value={y}>FY {y}</option>)}
            </select>
            {typeList.length > 0 && (
              <select value={typeF} onChange={(e) => setTypeF(e.target.value)} className="border border-zinc-300 rounded-xl px-3 py-2 text-sm font-bold text-[#002344]">
                <option value="">All types / सभी प्रकार</option>
                {typeList.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
            <div className="relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search / खोजें" className="pl-8 pr-3 py-2 border border-zinc-300 rounded-xl text-sm" /></div>
            <button onClick={reload} className="bg-zinc-100 text-[#002344] px-3 py-2 rounded-xl font-bold inline-flex items-center gap-2"><FaSync /></button>
            <button onClick={exportCsv} className="bg-zinc-100 text-[#002344] px-3 py-2 rounded-xl font-bold inline-flex items-center gap-2"><FaFileCsv /></button>
            <button onClick={printPdf} className="bg-zinc-100 text-[#002344] px-3 py-2 rounded-xl font-bold inline-flex items-center gap-2"><FaPrint /></button>
            <button onClick={() => { setEditing(null); setShowForm((s) => !s); }} className="bg-[#FF6600] text-white px-3 py-2 rounded-xl font-bold inline-flex items-center gap-2"><FaPlus /> New / नया</button>
          </div>
        </div>

        {msg && <div className="mx-5 mt-3 text-sm font-semibold text-[#002344] bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">{msg}</div>}
        {showForm && <RecordForm def={def} initial={editing ? editing.data : null} onSubmit={save} onCancel={() => { setShowForm(false); setEditing(null); }} busy={busy} />}

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Date / दिनांक</th>
                {def.fields.map((f) => <th key={f.k} className="p-3 text-left">{f.l} / {f.lHi}</th>)}
                <th className="p-3 text-left">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && <tr><td colSpan={def.fields.length + 4} className="p-6 text-center text-zinc-400">Loading… / लोड हो रहा है…</td></tr>}
              {!loading && filtered.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50">
                  <td className="p-3 font-mono text-xs font-bold text-[#002344] whitespace-nowrap">{r.recordId}</td>
                  <td className="p-3 whitespace-nowrap">{officeDate(r.recordDate)}</td>
                  {def.fields.map((f) => (
                    <td key={f.k} className="p-3 whitespace-nowrap max-w-[220px] truncate">
                      {amountKey === f.k ? money(r.data?.[f.k]) : (r.data?.[f.k] || "—")}
                    </td>
                  ))}
                  <td className="p-3">{r.status === "deleted" ? <Chip tone="amber">archived</Chip> : <Chip tone="green">active</Chip>}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => setViewing(r)} title="View" className="text-[#002344] mr-2"><FaEye /></button>
                    {r.status !== "deleted" && <>
                      <button onClick={() => { setEditing(r); setShowForm(true); }} title="Edit" className="text-[#FF6600] mr-2"><FaEdit /></button>
                      <button onClick={() => { if (confirm("Archive this record? It stays in history. / यह प्रविष्टि संग्रहित होगी, मिटेगी नहीं।")) onArchive(r.id); }} title="Archive" className="text-rose-600 mr-2"><FaArchive /></button>
                    </>}
                    {r.status === "deleted" && <button onClick={() => onRestore(r.id)} title="Restore" className="text-emerald-600 mr-2"><FaUndo /></button>}
                  </td>
                </tr>
              ))}
              {!loading && !filtered.length && <tr><td colSpan={def.fields.length + 4} className="p-8 text-center text-zinc-400">No records yet. / अभी कोई प्रविष्टि नहीं।</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div><div className="font-black text-[#002344]">{viewing.recordId}</div><div className="text-xs text-zinc-500">{def.title} / {def.titleHi}</div></div>
              <button onClick={() => setViewing(null)} className="text-zinc-400 font-bold">✕</button>
            </div>
            <div className="p-5 space-y-2 text-sm">
              <div className="flex justify-between border-b border-zinc-100 py-1.5"><span className="text-zinc-500">Date / दिनांक</span><span className="font-semibold">{officeDate(viewing.recordDate)}</span></div>
              {def.fields.map((f) => (
                <div key={f.k} className="flex justify-between border-b border-zinc-100 py-1.5">
                  <span className="text-zinc-500">{f.l} / {f.lHi}</span>
                  <span className="font-semibold text-right">{amountKey === f.k ? money(viewing.data?.[f.k]) : (viewing.data?.[f.k] || "—")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
