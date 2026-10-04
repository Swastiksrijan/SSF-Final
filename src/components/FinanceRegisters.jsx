// SSF Digital Office — operational financial registers.
//
// These are the registers an audit-ready NGO is expected to keep *in addition*
// to the core books (cash / bank / vouchers / donations / expenses). They are
// fully editable and stored in the Digital Office database (module-wise), and
// each carries the fields an auditor asks for:
//
//   fixedAssets     Fixed Asset Register (cost, depreciation, WDV)
//   tds             TDS Register (194C/J/I/H, challan, quarter)
//   statutoryDues   Statutory Dues Register (PF / ESI / TDS / GST …)
//   brs             Bank Reconciliation Register
//   budget          Budget vs Actual Register
//   loans           Loan / Borrowing Register
//   investments     Investment Register (FD / RD / mutual funds)
//   audits          Audit Register (reports & observations)
import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import logoImg from "../assets/new-logo.png";
import { FaPlus, FaSearch, FaPrint, FaBoxes, FaFileAlt, FaRupeeSign, FaBalanceScale, FaChartLine, FaCheckCircle, FaMoneyCheckAlt, FaPiggyBank, FaHandHoldingUsd, FaClipboardList, FaShieldAlt } from "react-icons/fa";

const num = (v) => { const n = parseFloat(String(v == null ? "" : v).replace(/[^0-9.\-]/g, "")); return isFinite(n) ? n : 0; };
const money = (v) => "₹" + Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const officeDate = (v) => { const s = String(v || ""); const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + "-" + m[2] + "-" + m[1] : (s || "—"); };
const inputCls = "w-full px-3 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-[#002344]/20";

const csvExport = (head, rows, filename) => {
  const esc = (x) => '"' + String(x == null ? "" : x).replace(/"/g, '""') + '"';
  const lines = [head.map(esc).join(",")].concat(rows.map((r) => r.map(esc).join(",")));
  const blob = new Blob(["\uFEFF" + lines.join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
};
const downloadPdf = (doc, filename) => {
  try { doc.save(filename); }
  catch (e) { try { const url = doc.output("bloburl"); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); } catch (err) { console.error("PDF download failed", err); } }
};
const tablePdf = (title, columns, rows, filename) => {
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

// ---- Register definitions ---------------------------------------------------
export const FIN_REG_DEFS = {
  fixedAssets: {
    title: "Fixed Asset Register / स्थायी संपत्ति रजिस्टर", icon: FaBoxes,
    intro: "Har sampatti — kharid date, lagat, depreciation aur WDV ke saath.",
    amountKey: "cost", dateKey: "purchaseDate",
    fields: [
      { k: "assetCode", l: "Asset Code", t: "text" },
      { k: "assetName", l: "Asset / Equipment", t: "text", req: true },
      { k: "category", l: "Category", t: "select", o: ["Furniture & Fixtures", "Computer & IT Equipment", "Office Equipment", "Vehicle", "Building", "Books & Library", "Other"] },
      { k: "purchaseDate", l: "Purchase Date", t: "date", req: true },
      { k: "cost", l: "Cost (₹)", t: "number", req: true },
      { k: "depRate", l: "Dep. Rate (%)", t: "number" },
      { k: "depAmount", l: "Dep. for Year (₹)", t: "number" },
      { k: "wdv", l: "WDV (₹)", t: "number" },
      { k: "location", l: "Location", t: "text" },
      { k: "custodian", l: "Custodian", t: "text" },
      { k: "remarks", l: "Remarks", t: "text" },
    ],
  },
  tds: {
    title: "TDS Register / टी.डी.एस. रजिस्टर", icon: FaMoneyCheckAlt,
    intro: "Kata hua tax, section, challan aur quarter ke saath.",
    amountKey: "tdsAmount", dateKey: "date",
    fields: [
      { k: "date", l: "Date", t: "date", req: true },
      { k: "party", l: "Deductee / Party", t: "text", req: true },
      { k: "pan", l: "PAN", t: "text" },
      { k: "section", l: "Section", t: "select", o: ["194C", "194J", "194I", "194H", "194A", "Other"] },
      { k: "nature", l: "Nature of Payment", t: "text" },
      { k: "gross", l: "Gross Amount (₹)", t: "number" },
      { k: "rate", l: "TDS Rate (%)", t: "number" },
      { k: "tdsAmount", l: "TDS Amount (₹)", t: "number", req: true },
      { k: "challanNo", l: "Challan / BSR No.", t: "text" },
      { k: "depositDate", l: "Deposit Date", t: "date" },
      { k: "quarter", l: "Quarter", t: "select", o: ["Q1", "Q2", "Q3", "Q4"] },
      { k: "remarks", l: "Remarks", t: "text" },
    ],
  },
  statutoryDues: {
    title: "Statutory Dues Register / सांविधिक देय रजिस्टर", icon: FaShieldAlt,
    intro: "PF / ESI / TDS / GST ki monthly liability aur payment.",
    amountKey: "amount", dateKey: "periodDate",
    fields: [
      { k: "periodDate", l: "Date", t: "date", req: true },
      { k: "duesType", l: "Dues Type", t: "select", o: ["PF", "ESI", "TDS", "GST", "Professional Tax", "Other"], req: true },
      { k: "period", l: "Period (Month/Quarter)", t: "text" },
      { k: "amount", l: "Amount (₹)", t: "number", req: true },
      { k: "dueDate", l: "Due Date", t: "date" },
      { k: "paidDate", l: "Paid Date", t: "date" },
      { k: "challanRef", l: "Challan / Reference", t: "text" },
      { k: "status", l: "Status", t: "select", o: ["Pending", "Paid", "Partially Paid"] },
      { k: "remarks", l: "Remarks", t: "text" },
    ],
  },
  brs: {
    title: "Bank Reconciliation Register / बैंक मिलान", icon: FaBalanceScale,
    intro: "Bank book aur bank statement ka mahine-wise match.",
    amountKey: "difference", dateKey: "date",
    fields: [
      { k: "date", l: "Date", t: "date", req: true },
      { k: "bankAccount", l: "Bank Account", t: "text", req: true },
      { k: "period", l: "Period", t: "text" },
      { k: "asPerBook", l: "Balance as per Books (₹)", t: "number" },
      { k: "asPerBank", l: "Balance as per Bank (₹)", t: "number" },
      { k: "difference", l: "Difference (₹)", t: "number" },
      { k: "items", l: "Reconciling Items", t: "textarea" },
      { k: "status", l: "Status", t: "select", o: ["Reconciled", "Pending"] },
      { k: "remarks", l: "Remarks", t: "text" },
    ],
  },
  budget: {
    title: "Budget vs Actual Register / बजट एवं वास्तविक", icon: FaChartLine,
    intro: "Approved budget aur asli kharch ka tulna.",
    amountKey: "actual", dateKey: "date",
    fields: [
      { k: "date", l: "Date", t: "date", req: true },
      { k: "head", l: "Budget Head", t: "text", req: true },
      { k: "budgetAmount", l: "Budget Amount (₹)", t: "number", req: true },
      { k: "actual", l: "Actual Amount (₹)", t: "number", req: true },
      { k: "variance", l: "Variance (₹)", t: "number" },
      { k: "remarks", l: "Remarks", t: "text" },
    ],
  },
  loans: {
    title: "Loan Register / ऋण रजिस्टर", icon: FaHandHoldingUsd,
    intro: "Liya gaya loan, interest aur outstanding.",
    amountKey: "outstanding", dateKey: "date",
    fields: [
      { k: "date", l: "Date", t: "date", req: true },
      { k: "lender", l: "Lender / Bank", t: "text", req: true },
      { k: "loanType", l: "Loan Type", t: "select", o: ["Secured", "Unsecured", "Bank Loan", "Director Loan", "Other"] },
      { k: "principal", l: "Principal (₹)", t: "number", req: true },
      { k: "interestRate", l: "Interest Rate (%)", t: "number" },
      { k: "emi", l: "EMI / Repayment (₹)", t: "number" },
      { k: "outstanding", l: "Outstanding (₹)", t: "number" },
      { k: "endDate", l: "Closure / Due Date", t: "date" },
      { k: "remarks", l: "Remarks", t: "text" },
    ],
  },
  investments: {
    title: "Investment Register / निवेश रजिस्टर", icon: FaPiggyBank,
    intro: "FD / RD / mutual fund aur unki maturity.",
    amountKey: "amount", dateKey: "date",
    fields: [
      { k: "date", l: "Date", t: "date", req: true },
      { k: "institution", l: "Institution", t: "text", req: true },
      { k: "instrument", l: "Instrument", t: "select", o: ["Fixed Deposit", "Recurring Deposit", "Mutual Fund", "Bond", "Other"] },
      { k: "amount", l: "Amount (₹)", t: "number", req: true },
      { k: "interestRate", l: "Interest Rate (%)", t: "number" },
      { k: "maturityDate", l: "Maturity Date", t: "date" },
      { k: "maturityAmount", l: "Maturity Amount (₹)", t: "number" },
      { k: "remarks", l: "Remarks", t: "text" },
    ],
  },
  audits: {
    title: "Audit Register / लेखा परीक्षा रजिस्टर", icon: FaClipboardList,
    intro: "Audit report, observations aur compliance status.",
    amountKey: "auditFee", dateKey: "date",
    fields: [
      { k: "date", l: "Date", t: "date", req: true },
      { k: "auditType", l: "Audit Type", t: "select", o: ["Internal", "Statutory", "Tax Audit", "Donor Audit", "Other"] },
      { k: "firm", l: "Auditor / Firm", t: "text", req: true },
      { k: "period", l: "Period / FY", t: "text" },
      { k: "reportDate", l: "Report Date", t: "date" },
      { k: "observations", l: "Observations", t: "textarea" },
      { k: "compliance", l: "Compliance / Action", t: "textarea" },
      { k: "auditFee", l: "Audit Fee (₹)", t: "number" },
      { k: "status", l: "Status", t: "select", o: ["Pending", "Completed", "Follow-up"] },
    ],
  },
};

export const FIN_REG_IDS = Object.keys(FIN_REG_DEFS);

function FinForm({ regId, onSave }) {
  const def = FIN_REG_DEFS[regId];
  const today = new Date().toISOString().slice(0, 10);
  const initial = {};
  def.fields.forEach((f) => { initial[f.k] = f.t === "date" && f.k === (def.dateKey || "date") ? today : (f.t === "select" ? f.o[0] : ""); });
  const [f, setF] = useState(initial);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    const amount = def.amountKey ? (num(f[def.amountKey]) || null) : null;
    const recordDate = f[def.dateKey] || f.date || today;
    onSave({ recordDate, recordType: f[def.fields[1]?.k] || def.title, amount, data: { ...f, title: f[def.fields[1]?.k] || def.title } });
    setF(initial);
  };
  return (
    <form onSubmit={submit} className="p-5 bg-zinc-50 border-b grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {def.fields.map((fld) => (
        <div key={fld.k} className={fld.t === "textarea" ? "sm:col-span-2 lg:col-span-4" : ""}>
          <label className="text-xs font-bold text-zinc-500">{fld.l}{fld.req && <span className="text-red-500"> *</span>}</label>
          {fld.t === "select" ? (
            <select value={f[fld.k]} onChange={(e) => set(fld.k, e.target.value)} className={inputCls + " mt-1"}>{fld.o.map((o) => <option key={o}>{o}</option>)}</select>
          ) : fld.t === "textarea" ? (
            <textarea value={f[fld.k]} onChange={(e) => set(fld.k, e.target.value)} required={fld.req} className={inputCls + " mt-1 min-h-[80px]"} />
          ) : (
            <input type={fld.t} value={f[fld.k]} onChange={(e) => set(fld.k, e.target.value)} required={fld.req} className={inputCls + " mt-1"} />
          )}
        </div>
      ))}
      <button className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold">Save {def.title.split(" / ")[0]}</button>
    </form>
  );
}

export function FinanceRegister({ regId, rows, add, archive }) {
  const def = FIN_REG_DEFS[regId];
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const records = useMemo(() => {
    const list = Array.isArray(rows) ? rows : [];
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((r) => JSON.stringify(r.data || {}).toLowerCase().includes(q));
  }, [rows, search]);
  const totalAmount = useMemo(() => records.reduce((a, r) => a + num(r.amount), 0), [records]);
  if (!def) return <div className="bg-white border rounded-2xl p-10 text-center text-zinc-400">Register not found.</div>;
  const Icon = def.icon;
  const cols = def.fields;
  const exportRows = records.map((r) => cols.map((c) => (r.data || {})[c.k] ?? ""));
  return (
    <div className="space-y-5">
      <div className="bg-[#002344] text-white rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3"><Icon className="text-2xl" /><div>
            <h2 className="text-2xl font-black">{def.title}</h2>
            <p className="text-white/70 mt-1">{def.intro}</p>
          </div></div>
          <div className="bg-white/10 rounded-xl px-4 py-3">
            <div className="text-xs opacity-70 font-bold uppercase">Total {def.amountKey ? "Amount" : "Records"}</div>
            <div className="text-xl font-black">{def.amountKey ? money(totalAmount) : records.length}</div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-5 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div><h3 className="text-xl font-black text-[#002344]">{records.length} of {(rows || []).length} record(s)</h3><p className="text-sm text-zinc-500 mt-1">Audit-ready register · apne aap add karein, edit ya delete kabhi nahi.</p></div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative"><FaSearch className="absolute left-3 top-3.5 text-zinc-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="pl-9 pr-3 py-2.5 border rounded-xl w-48" /></div>
            <button onClick={() => csvExport(cols.map((c) => c.l), exportRows, "ssf-" + regId + ".csv")} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2.5 rounded-xl font-bold">CSV</button>
            <button onClick={() => tablePdf(def.title, cols.map((c) => c.l), exportRows, "ssf-" + regId + ".pdf")} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2.5 rounded-xl font-bold">PDF</button>
            <button onClick={() => setOpen(!open)} className="bg-[#002344] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2"><FaPlus /> Add Entry</button>
          </div>
        </div>
        {open && <FinForm regId={regId} onSave={(d) => { add(regId, d); setOpen(false); }} />}
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase"><tr>{cols.map((c, i) => <th key={c.k} className={"p-3 whitespace-nowrap " + (c.t === "number" ? "text-right" : "text-left")}>{c.l}</th>)}<th className="p-3"></th></tr></thead>
          <tbody className="divide-y">
            {records.map((r) => { const d = r.data || {}; return (
              <tr key={r.id}>
                {cols.map((c) => <td key={c.k} className={"p-3 " + (c.t === "number" ? "text-right font-semibold whitespace-nowrap" : (c.t === "date" ? "whitespace-nowrap" : ""))}>{c.t === "number" ? (d[c.k] ? money(d[c.k]) : "—") : (c.t === "date" ? officeDate(d[c.k]) : (d[c.k] || "—"))}</td>)}
                <td className="p-3 text-right">{archive && <button onClick={() => { if (window.confirm("Sirf yahi record archive hoga — baaki safe rahengi. Archive karein?")) archive(r.id); }} className="text-xs font-bold text-red-600">Archive</button>}</td>
              </tr>); })}
            {!records.length && <tr><td colSpan={cols.length + 1} className="p-10 text-center text-zinc-400">No records yet — "Add Entry" se shuru karein.</td></tr>}
          </tbody>
        </table></div>
      </div>
      <p className="text-xs text-zinc-400">Ye register Digital Office database me save hota hai (module "{regId}"). Official workbook registers read-only hain; ye operational registers aap khud bharte hain.</p>
    </div>
  );
}
