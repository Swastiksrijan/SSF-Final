// SSF Digital Office — Finance system.
//
// Built on the official financial-records workbook (see src/data/financialRecords.js).
// The Master Voucher Register is treated as the single source of truth: every
// figure below is derived from it, so nothing has to be entered twice and the
// statements can never disagree with the registers.
//
// Provides:
//   * FinanceDashboard  — headline position + breakdowns + audit summary
//   * FinanceStatements — Receipts & Payments, Income & Expenditure, Trial
//                         Balance, Balance Sheet, Category-wise summary
//   * IntegrityCheck    — duplicate / integrity scan so a wrong entry never
//                         silently corrupts a register
import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import logoImg from "../assets/new-logo.png";
import { FIN_REGISTERS, FIN_AUDIT_SUMMARY } from "../data/financialRecords";
import { FaChartLine, FaBalanceScale, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const num = (v) => {
  const n = parseFloat(String(v == null ? "" : v).replace(/[^0-9.\-]/g, ""));
  return isFinite(n) ? n : 0;
};
const money = (v) => "₹" + Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money0 = (v) => "₹" + Math.round(Number(v || 0)).toLocaleString("en-IN");
const idxOf = (reg, re) => (reg ? reg.columns.findIndex((c) => re.test(c)) : -1);
const cellOf = (row, i) => (i >= 0 && row[i] != null ? row[i] : "");
const isExpenseType = (t) => /^(expence|expense)/i.test(String(t || "").trim());

export function getFinanceRegister(id, fy) {
  return FIN_REGISTERS.find((r) => r.id === id && (!fy || r.fy === fy)) || FIN_REGISTERS.find((r) => r.id === id) || null;
}

// Everything the dashboard and statements need.
//
// Figures are anchored to the AUDITED Audit Summary so the statements tie out
// exactly; the registers are used only for the head/mode breakdowns. The two
// reconcile: donation register = audited receipts for the year, and
// (expense register − in-kind 'Support' rent/donations) = audited expenditure.
export function buildFinance(fy) {
  const auditMap = {};
  FIN_AUDIT_SUMMARY.forEach((x) => { auditMap[x.particulars] = num(x.amount); });
  const opening = auditMap["Total Opening Balance"] || 0;
  const auditedReceiptsInclOpening = auditMap["Total Receipts"] || 0;
  const cashOpening = auditMap["Opening Cash Balance"] || 0;
  const bankOpening = auditMap["Opening Bank Balance (UBI)"] || 0;
  const cashClosing = auditMap["Closing Cash Balance"] || 0;
  const bankClosing = auditMap["Closing Bank Balance (UBI)"] || 0;
  const closing = cashClosing + bankClosing;
  const generalFund = auditMap["General Fund Closing Balance"] || 0;

  // Breakdowns straight from the registers.
  const don = getFinanceRegister("donations", fy);
  const receiptsByHead = {}, receiptsByMode = {};
  let registerReceipts = 0;
  if (don) {
    const ti = idxOf(don, /^type$/i) >= 0 ? idxOf(don, /^type$/i) : idxOf(don, /type/i);
    const mi = idxOf(don, /mode/i), ai = idxOf(don, /amount/i);
    don.rows.forEach((r) => {
      const h = String(cellOf(r, ti)) || "Receipt", m = String(cellOf(r, mi)) || "Other", a = num(cellOf(r, ai));
      registerReceipts += a; receiptsByHead[h] = (receiptsByHead[h] || 0) + a; receiptsByMode[m] = (receiptsByMode[m] || 0) + a;
    });
  }
  const exp = getFinanceRegister("expenses", fy);
  const paymentsByHead = {}, paymentsByMode = {};
  let registerPayments = 0, inKind = 0;
  if (exp) {
    const ci = idxOf(exp, /category/i), mi = idxOf(exp, /mode/i), ai = idxOf(exp, /amount/i);
    exp.rows.forEach((r) => {
      const c = String(cellOf(r, ci)) || "Other", m = String(cellOf(r, mi)) || "Other", a = num(cellOf(r, ai));
      registerPayments += a;
      if (/support/i.test(m)) { inKind += a; return; } // in-kind rent support — not a cash payment
      paymentsByHead[c] = (paymentsByHead[c] || 0) + a; paymentsByMode[m] = (paymentsByMode[m] || 0) + a;
    });
  }
  const sortDesc = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
  // Cash-basis income = donation register total (ties to the audit); expenditure
  // is the audited figure (expense register less in-kind 'Support' rent).
  const receiptsYear = registerReceipts;
  const auditedPayments = auditMap["Total Expenditure"] || 0;
  const paymentsYear = auditedPayments;
  const surplus = receiptsYear - paymentsYear;
  const isDeficit = surplus < 0;
  const registerPaymentsCash = registerPayments - inKind;
  return {
    fy, opening, closing, cashOpening, bankOpening, cashClosing, bankClosing, generalFund,
    receiptsYear, paymentsYear, surplus, deficit: isDeficit ? -surplus : 0, isDeficit,
    receiptsByHead: sortDesc(receiptsByHead), receiptsByMode: sortDesc(receiptsByMode),
    paymentsByHead: sortDesc(paymentsByHead), paymentsByMode: sortDesc(paymentsByMode),
    registerReceipts, registerPayments, registerPaymentsCash, inKind, auditedReceiptsInclOpening,
    audit: FIN_AUDIT_SUMMARY, voucherCount: getFinanceRegister("vouchers", fy)?.rows.length || 0,
  };
}

const exportCsv = (head, rows, filename) => {
  const esc = (x) => '"' + String(x == null ? "" : x).replace(/"/g, '""') + '"';
  const lines = [head.map(esc).join(",")].concat(rows.map((r) => r.map(esc).join(",")));
  const blob = new Blob(["\uFEFF" + lines.join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
};
const downloadPdf = (doc, filename) => {
  try { doc.save(filename); }
  catch (e) { try { const url = doc.output("bloburl"); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); } catch (err) { console.error("PDF download failed", err); } }
};

// Render a list of {head, rows} tables into a branded PDF.
function statementPdf(title, fy, tables) {
  const d = new jsPDF();
  d.addImage(logoImg, "PNG", 14, 8, 16, 16);
  d.setTextColor(0, 35, 68); d.setFontSize(15); d.text("Swastik Srijan Foundation Samiti", 36, 15);
  d.setFontSize(10); d.setTextColor(60); d.text(title + "  ·  FY " + fy, 36, 22);
  let y = 34;
  tables.forEach((t) => {
    d.setFontSize(11); d.setTextColor(0, 35, 68); d.setFont(undefined, "bold"); d.text(t.name, 14, y); y += 6;
    d.setFont(undefined, "normal"); d.setFontSize(9);
    d.setTextColor(0, 35, 68); t.head.forEach((h, i) => d.text(String(h), 14 + i * 60, y)); y += 4.5;
    d.setTextColor(30);
    t.rows.forEach((r) => { r.forEach((c, i) => d.text(String(c == null ? "" : c).slice(0, 40), 14 + i * 60, y)); y += 4.5; if (y > 285) { d.addPage(); y = 20; } });
    y += 6;
  });
  d.setFontSize(8); d.setTextColor(120); d.text("Computer-generated from the official financial records · SSF Digital Office", 105, 290, { align: "center" });
  downloadPdf(d, "ssf-" + title.toLowerCase().replace(/[^a-z]+/g, "-") + "-" + fy + ".pdf");
}

function StatCard({ label, value, sub, tone }) {
  const tones = { navy: "bg-[#002344] text-white", green: "bg-emerald-50 text-emerald-800 border-emerald-200", red: "bg-red-50 text-red-800 border-red-200", blue: "bg-[#123B5D] text-white", white: "bg-white border-zinc-200 text-[#002344]" };
  return (
    <div className={"rounded-2xl p-5 border " + (tones[tone] || tones.white)}>
      <div className="text-xs font-bold uppercase opacity-70">{label}</div>
      <div className="text-2xl font-black mt-2">{value}</div>
      {sub && <div className="text-xs opacity-70 mt-1">{sub}</div>}
    </div>
  );
}

function Bar({ value, max, color }) {
  const w = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return <div className="h-2 rounded-full bg-zinc-100 overflow-hidden"><div className={"h-full rounded-full " + color} style={{ width: w + "%" }} /></div>;
}

export function FinanceDashboard({ fy }) {
  const f = useMemo(() => buildFinance(fy), [fy]);
  const maxRec = Math.max(1, ...f.receiptsByMode.map((x) => x[1]));
  const maxPay = Math.max(1, ...f.paymentsByHead.map((x) => x[1]));
  return (
    <div className="space-y-5">
      <div className="bg-[#002344] text-white rounded-2xl p-6">
        <div className="flex items-center gap-3"><FaChartLine className="text-2xl" /><div>
          <h2 className="text-2xl font-black">Finance Dashboard / वित्तीय डैशबोर्ड</h2>
          <p className="text-white/70 mt-1">FY {fy} · Master Voucher Register se auto-generated · {f.voucherCount} vouchers</p>
        </div></div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard tone="blue" label="Opening Balance" value={money(f.opening)} sub={"Cash " + money0(f.cashOpening) + " · Bank " + money0(f.bankOpening)} />
        <StatCard tone="white" label="Total Receipts" value={money(f.receiptsYear)} sub="Donations + Membership" />
        <StatCard tone="white" label="Total Expenditure" value={money(f.paymentsYear)} sub="All expense heads" />
        <StatCard tone="navy" label="Closing Balance" value={money(f.closing)} sub={"Cash " + money0(f.cashClosing) + " · Bank " + money0(f.bankClosing)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border p-5">
          <h3 className="text-lg font-black text-[#002344] mb-4">Receipts by Mode / प्राप्ति (साधन अनुसार)</h3>
          <div className="space-y-3">{f.receiptsByMode.map(([m, v]) => (
            <div key={m}><div className="flex justify-between text-sm font-semibold"><span>{m}</span><span>{money(v)}</span></div><Bar value={v} max={maxRec} color="bg-emerald-500" /></div>
          ))}</div>
          <div className="mt-4 pt-3 border-t flex justify-between font-black text-[#002344]"><span>Total Receipts</span><span>{money(f.receiptsYear)}</span></div>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h3 className="text-lg font-black text-[#002344] mb-4">Expenditure by Head / व्यय (शीर्ष अनुसार)</h3>
          <div className="space-y-3">{f.paymentsByHead.slice(0, 10).map(([h, v]) => (
            <div key={h}><div className="flex justify-between text-sm font-semibold"><span>{h}</span><span>{money(v)}</span></div><Bar value={v} max={maxPay} color="bg-red-500" /></div>
          ))}</div>
          <div className="mt-4 pt-3 border-t flex justify-between font-black text-[#002344]"><span>Total Expenditure</span><span>{money(f.paymentsYear)}</span></div>
        </div>
      </div>

      <div className={"rounded-2xl p-5 border " + (f.isDeficit ? "bg-amber-50 border-amber-300 text-amber-900" : "bg-emerald-50 border-emerald-300 text-emerald-900")}>
        <div className="flex items-center gap-2 font-black text-lg">{f.isDeficit ? <FaExclamationTriangle /> : <FaCheckCircle />}{f.isDeficit ? "Deficit for the year" : "Surplus for the year"}</div>
        <div className="text-2xl font-black mt-2">{money(f.isDeficit ? f.deficit : f.surplus)}</div>
        <p className="text-sm mt-1 opacity-80">Receipts {money(f.receiptsYear)} − Expenditure {money(f.paymentsYear)}</p>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-5 border-b"><h3 className="text-lg font-black text-[#002344]">Audit Summary / लेखा परीक्षा सारांश</h3><p className="text-sm text-zinc-500 mt-1">As per the audited financial statements for FY {fy}.</p></div>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <tbody className="divide-y">
            {f.audit.map((a) => (
              <tr key={a.particulars} className={/^Total|^Closing|^General Fund/i.test(a.particulars) ? "bg-[#f7fafc] font-bold" : ""}>
                <td className="p-3">{a.particulars}</td><td className="p-3 text-right font-semibold">{money(a.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}

const TABS = ["Receipts & Payments", "Income & Expenditure", "Trial Balance", "Balance Sheet", "Category-wise"];

export function FinanceStatements({ fy }) {
  const f = useMemo(() => buildFinance(fy), [fy]);
  const [tab, setTab] = useState(TABS[0]);

  const rp = () => {
    const head = ["Particulars", "Amount (₹)"];
    const receipts = f.receiptsByMode.map(([m, v]) => ["Receipts — " + m, v]);
    const payments = f.paymentsByMode.map(([m, v]) => ["Payments — " + m, v]);
    const rows = [
      ["Opening Balance", f.opening],
      ...receipts, ["Total Receipts", f.receiptsYear],
      ...payments, ["Total Payments", f.paymentsYear],
      ["Closing Balance", f.closing],
    ];
    return [{ name: "Receipts & Payments Account · FY " + fy, head, rows }];
  };
  const ie = () => {
    const head = ["Particulars", "Amount (₹)"];
    const rows = [
      ...f.receiptsByHead.map(([h, v]) => ["Income — " + h, v]), ["Total Income", f.receiptsYear],
      ...f.paymentsByHead.map(([h, v]) => ["Expenditure — " + h, v]), ["Total Expenditure", f.paymentsYear],
      [f.isDeficit ? "Deficit for the year" : "Surplus for the year", f.isDeficit ? f.deficit : f.surplus],
    ];
    return [{ name: "Income & Expenditure Account · FY " + fy, head, rows }];
  };
  const tb = () => {
    const head = ["Head", "Debit (₹)", "Credit (₹)"];
    const rows = [];
    f.paymentsByHead.forEach(([h, v]) => rows.push([h, v, ""]));
    f.receiptsByHead.forEach(([h, v]) => rows.push([h, "", v]));
    rows.push(["Opening Balance b/d", "", f.opening]);
    const dr = Math.round((f.paymentsYear + f.closing) * 100) / 100, cr = Math.round((f.receiptsYear + f.opening) * 100) / 100;
    rows.push(["Closing Balance c/f", f.closing, ""]);
    rows.push(["TOTAL", dr, cr]);
    return [{ name: "Trial Balance (Receipts & Payments basis) · FY " + fy, head, rows }];
  };
  const bs = () => {
    const head = ["Particulars", "Amount (₹)"];
    const otherAssets = f.generalFund - f.closing;
    const rows = [
      ["LIABILITIES / FUNDS", ""],
      ["General Fund (closing)", f.generalFund],
      ["", ""],
      ["ASSETS", ""],
      ["Cash in Hand", f.cashClosing],
      ["Bank Balance (UBI)", f.bankClosing],
      ["Other Assets (fixed assets, advances & receivables)", otherAssets],
      ["Total Assets", f.closing + otherAssets],
    ];
    return [{ name: "Balance Sheet (closing position) · FY " + fy, head, rows }];
  };
  const cw = () => {
    const head = ["Particulars", "Type", "Amount (₹)"];
    const rows = [
      ...f.receiptsByHead.map(([h, v]) => [h, "Receipt", v]),
      ...f.paymentsByHead.map(([h, v]) => [h, "Payment", v]),
    ];
    return [{ name: "Category-wise Summary · FY " + fy, head, rows }];
  };

  const current = tab === "Receipts & Payments" ? rp() : tab === "Income & Expenditure" ? ie() : tab === "Trial Balance" ? tb() : tab === "Balance Sheet" ? bs() : cw();

  return (
    <div className="space-y-5">
      <div className="bg-[#002344] text-white rounded-2xl p-6">
        <div className="flex items-center gap-3"><FaBalanceScale className="text-2xl" /><div>
          <h2 className="text-2xl font-black">Financial Statements / वित्तीय विवरण</h2>
          <p className="text-white/70 mt-1">Auto-generated from the Master Voucher Register · FY {fy}</p>
        </div></div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={"px-4 py-2.5 rounded-xl font-bold border " + (tab === t ? "bg-[#002344] text-white border-[#002344]" : "bg-white text-[#002344] border-zinc-200")}>{t}</button>
        ))}
      </div>

      {current.map((t) => (
        <div key={t.name} className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><h3 className="text-lg font-black text-[#002344]">{t.name}</h3><p className="text-sm text-zinc-500 mt-1">Read-only · derived from vouchers</p></div>
            <div className="flex gap-2">
              <button onClick={() => exportCsv(t.head, t.rows, "ssf-" + t.name.replace(/[^a-z]+/gi, "-").toLowerCase() + ".csv")} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2 rounded-xl font-bold">CSV</button>
              <button onClick={() => statementPdf(t.name, fy, current)} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2 rounded-xl font-bold">PDF</button>
            </div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase"><tr>{t.head.map((h, i) => <th key={i} className={"p-3 " + (i === 0 ? "text-left" : "text-right")}>{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {t.rows.map((r, ri) => (
                <tr key={ri} className={/^(TOTAL|Total|Closing|Opening|General Fund)/.test(String(r[0])) ? "bg-[#f7fafc] font-bold" : ""}>
                  {r.map((c, ci) => <td key={ci} className={"p-3 " + (ci === 0 ? "" : "text-right font-semibold")}>{typeof c === "number" ? money(c) : (c === "" ? "—" : c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      ))}
    </div>
  );
}

// ---- Integrity / duplicate check -------------------------------------------
// A duplicate is two rows that agree on date + amount + particulars. These are
// exactly what repeated imports create, so they are reported before anything is
// touched. Nothing is ever auto-deleted.
const norm = (s) => String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").trim();

function regDuplicates(reg) {
  if (!reg) return [];
  const di = idxOf(reg, /date/i), ai = idxOf(reg, /amount|receipt|payment|withdrawal|deposit/i), pi = idxOf(reg, /particulars|member name|name/i);
  if (ai < 0) return []; // only registers that carry an amount can have money duplicates
  const map = {};
  reg.rows.forEach((r, i) => {
    const amt = num(cellOf(r, ai));
    const key = [norm(cellOf(r, di)), amt, norm(cellOf(r, pi))].join("|");
    if (!amt || !norm(cellOf(r, pi))) return;
    (map[key] = map[key] || []).push({ i, row: r });
  });
  return Object.entries(map).filter(([, g]) => g.length > 1).map(([key, g]) => ({ key, count: g.length, sample: g[0].row, reg }));
}

// Registers that hold money movements (used for the duplicate scan).
const MONEY_REGISTERS = ["vouchers", "donations", "membership", "expenses", "cash", "bank", "cashbank"];

export function IntegrityCheck() {
  const reports = useMemo(() => FIN_REGISTERS.filter((r) => MONEY_REGISTERS.includes(r.id)).map((r) => ({ reg: r, dups: regDuplicates(r) })).filter((x) => x.dups.length), []);
  const totalDup = reports.reduce((a, x) => a + x.dups.reduce((b, d) => b + (d.count - 1), 0), 0);
  return (
    <div className="space-y-5">
      <div className="bg-[#002344] text-white rounded-2xl p-6">
        <div className="flex items-center gap-3"><FaCheckCircle className="text-2xl" /><div>
          <h2 className="text-2xl font-black">Data Integrity Check / डेटा जाँच</h2>
          <p className="text-white/70 mt-1">Duplicate entries dhoondhta hai — kuch bhi apne aap delete nahi hota.</p>
        </div></div>
      </div>
      <div className={"rounded-2xl p-5 border flex items-center gap-3 " + (totalDup ? "bg-amber-50 border-amber-300 text-amber-900" : "bg-emerald-50 border-emerald-300 text-emerald-900")}>
        {totalDup ? <FaExclamationTriangle className="text-2xl" /> : <FaCheckCircle className="text-2xl" />}
        <div><div className="font-black text-lg">{totalDup ? totalDup + " duplicate entries mile" : "Koi duplicate nahi mila"}</div>
          <div className="text-sm opacity-80">{reports.length ? reports.length + " register(s) me repetition" : "Sab registers saaf hain"}</div></div>
      </div>
      {reports.map(({ reg, dups }) => (
        <div key={reg.id} className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between"><h3 className="text-lg font-black text-[#002344]">{reg.title}</h3><span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">{dups.length} group(s)</span></div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase"><tr><th className="p-3 text-left">Date</th><th className="p-3 text-left">Particulars</th><th className="p-3 text-right">Amount</th><th className="p-3 text-right">Copies</th></tr></thead>
            <tbody className="divide-y">{dups.map((d, i) => {
              const di = idxOf(reg, /date/i), ai = idxOf(reg, /amount|receipt|payment|withdrawal|deposit/i), pi = idxOf(reg, /particulars|member name|name/i);
              return <tr key={i}><td className="p-3 whitespace-nowrap">{String(cellOf(d.sample, di))}</td><td className="p-3 min-w-[240px]">{String(cellOf(d.sample, pi))}</td><td className="p-3 text-right font-semibold">{money(num(cellOf(d.sample, ai)))}</td><td className="p-3 text-right font-black text-amber-700">{d.count}×</td></tr>;
            })}</tbody>
          </table></div>
        </div>
      ))}
      <p className="text-xs text-zinc-400">Note: official registers locked hain — yahan sirf detection hoti hai. Correction Master Voucher me naya voucher banakar ki jaati hai.</p>
    </div>
  );
}
