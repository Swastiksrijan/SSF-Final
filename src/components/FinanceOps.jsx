import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaSync, FaPlus, FaSearch, FaCheckCircle, FaExclamationTriangle, FaBook,
  FaBalanceScale, FaHistory, FaFileAlt, FaLink, FaLayerGroup, FaDownload,
  FaClipboardCheck, FaLock, FaChevronRight
} from "react-icons/fa";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

const TOKEN_KEY = "ssf_admin_token";
const money = (n) => "₹" + (Number(n) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "—");
const FY_OPTIONS = ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26", "2026-27"];

const authHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY) || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json" };
};
const api = async (url, opts = {}) => {
  const r = await fetch(url, { headers: authHeaders(), ...opts });
  let data = null;
  try { data = await r.json(); } catch (_) {}
  return { ok: r.ok, status: r.status, data };
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

const Panel = ({ title, subtitle, right, children }) => (
  <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100">
      <div>
        <h3 className="text-lg font-black text-[#002344]">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Stat = ({ label, value, tone = "navy" }) => (
  <div className="rounded-2xl border border-zinc-200 p-4 bg-gradient-to-br from-white to-zinc-50">
    <div className="text-[11px] font-black uppercase tracking-wide text-zinc-400">{label}</div>
    <div className={"text-xl font-black mt-1 " + (tone === "red" ? "text-rose-600" : tone === "green" ? "text-emerald-600" : "text-[#002344]")}>{value}</div>
  </div>
);

const useFy = () => {
  const [fy, setFy] = useState("2025-26");
  const picker = (
    <select value={fy} onChange={(e) => setFy(e.target.value)} className="border border-zinc-300 rounded-xl px-3 py-2 text-sm font-bold text-[#002344]">
      {FY_OPTIONS.map((y) => <option key={y} value={y}>FY {y}</option>)}
    </select>
  );
  return { fy, setFy, picker };
};

const useFetch = (url, fy, extra = "") => {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const full = url + (url.includes("?") ? "&" : "?") + (fy ? "fy=" + fy + (extra ? "&" + extra : "") : extra);
    const { ok, data } = await api(full);
    setState({ loading: false, data: ok ? data : null, error: ok ? null : "Unable to load." });
  }, [url, fy, extra]);
  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load };
};

/* ----------------------------- Transactions ----------------------------- */
export function FinanceTransactions({ token }) {
  const { fy, picker } = useFy();
  const { data, loading, reload } = useFetch(ENDPOINTS.FINANCE_TRANSACTIONS, fy);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ transactionType: "receipt", amount: "", transactionDate: new Date().toISOString().slice(0, 10), paymentMode: "Cash", referenceNumber: "", partyId: "" });
  const [msg, setMsg] = useState("");

  const rows = Array.isArray(data) ? data : (data?.transactions || []);
  const filtered = rows.filter((r) => {
    if (type && r.transactionType !== type) return false;
    if (!q) return true;
    const hay = [r.transactionId, r.partyId, r.referenceNumber, r.transactionType, r.paymentMode].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });
  const totals = useMemo(() => rows.reduce((a, r) => {
    if (r.transactionType === "opening") return a;
    if (r.direction === "in") a.receipts += Number(r.amount) || 0;
    else if (r.direction === "out") a.payments += Number(r.amount) || 0;
    else if (r.direction === "none") a.inKind += Number(r.amount) || 0;
    return a;
  }, { receipts: 0, payments: 0, inKind: 0 }), [rows]);

  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    const { ok, data: d } = await api(ENDPOINTS.FINANCE_TRANSACTIONS, { method: "POST", body: JSON.stringify({ ...form, amount: Number(form.amount) }) });
    if (ok) { setMsg("Saved " + (d?.transactionId || "transaction")); setShowForm(false); reload(); }
    else setMsg(d?.duplicate ? "Duplicate blocked — a matching transaction already exists." : (d?.message || "Unable to save."));
  };

  const del = async (r) => {
    if (!confirm("Archive transaction " + r.transactionId + "?")) return;
    await api(ENDPOINTS.FINANCE_TRANSACTIONS + "/" + r.id, { method: "DELETE" });
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Canonical transactions" value={rows.length} />
        <Stat label="Receipts" value={money(totals.receipts)} tone="green" />
        <Stat label="Payments" value={money(totals.payments)} tone="red" />
        <Stat label="In-kind (non-cash)" value={money(totals.inKind)} />
      </div>
      <Panel
        title="Canonical Finance Transactions"
        subtitle={"Every financial event carries one FIN id · FY " + fy}
        right={<div className="flex flex-wrap items-center gap-2">
          {picker}
          <div className="relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search id / party / ref" className="pl-8 pr-3 py-2 border border-zinc-300 rounded-xl text-sm" /></div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="border border-zinc-300 rounded-xl px-3 py-2 text-sm font-bold text-[#002344]">
            <option value="">All types</option>
            {["donation", "membership", "expense", "receipt", "payment", "opening"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={reload} className="bg-zinc-100 text-[#002344] px-3 py-2 rounded-xl font-bold inline-flex items-center gap-2"><FaSync /> Refresh</button>
          <button onClick={() => setShowForm((s) => !s)} className="bg-[#FF6600] text-white px-3 py-2 rounded-xl font-bold inline-flex items-center gap-2"><FaPlus /> New</button>
        </div>}
      >
        {msg && <div className="mb-3 text-sm font-semibold text-[#002344] bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">{msg}</div>}
        {showForm && (
          <form onSubmit={submit} className="grid sm:grid-cols-3 gap-3 mb-4 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
            <select value={form.transactionType} onChange={(e) => setForm({ ...form, transactionType: e.target.value })} className="border rounded-lg px-3 py-2">
              {["receipt", "payment", "donation", "membership", "expense"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input required type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input required type="date" value={form.transactionDate} onChange={(e) => setForm({ ...form, transactionDate: e.target.value })} className="border rounded-lg px-3 py-2" />
            <select value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })} className="border rounded-lg px-3 py-2">
              {["Cash", "Bank", "UPI", "NEFT", "Cheque"].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input placeholder="Reference / UTR" value={form.referenceNumber} onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Party / Payee" value={form.partyId} onChange={(e) => setForm({ ...form, partyId: e.target.value })} className="border rounded-lg px-3 py-2" />
            <button type="submit" className="bg-[#002344] text-white rounded-lg px-4 py-2 font-bold">Save transaction</button>
          </form>
        )}
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500"><tr>
              <th className="p-2 text-left">FIN ID</th><th className="p-2 text-left">Date</th><th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Party</th><th className="p-2 text-left">Mode</th><th className="p-2 text-right">Amount</th>
              <th className="p-2 text-left">Links</th><th className="p-2 text-left">Flags</th><th className="p-2"></th>
            </tr></thead>
            <tbody className="divide-y">
              {loading && <tr><td colSpan="9" className="p-4 text-center text-zinc-400">Loading…</td></tr>}
              {!loading && filtered.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50">
                  <td className="p-2 font-mono text-xs font-bold text-[#002344]">{r.transactionId}</td>
                  <td className="p-2 whitespace-nowrap">{day(r.transactionDate)}</td>
                  <td className="p-2"><Chip tone={r.direction === "in" ? "green" : r.direction === "out" ? "red" : "zinc"}>{r.transactionType}</Chip></td>
                  <td className="p-2 max-w-[180px] truncate">{r.partyId || "—"}</td>
                  <td className="p-2">{r.paymentMode || "—"}</td>
                  <td className={"p-2 text-right font-bold " + (r.direction === "out" ? "text-rose-600" : "text-emerald-700")}>{money(r.amount)}</td>
                  <td className="p-2"><span className="inline-flex items-center gap-1 text-xs text-zinc-500"><FaLink /> {(r.linkedRecords || []).length}</span></td>
                  <td className="p-2">{r.needsReview && <Chip tone="amber">review</Chip>}</td>
                  <td className="p-2 text-right"><button onClick={() => del(r)} className="text-xs font-bold text-rose-600">Archive</button></td>
                </tr>
              ))}
              {!loading && !filtered.length && <tr><td colSpan="9" className="p-6 text-center text-zinc-400">No transactions for this FY. Use “Seed official registers” below if the ledger is empty.</td></tr>}
            </tbody>
          </table>
        </div>
        <SeedBar reload={reload} count={rows.length} />
      </Panel>
    </div>
  );
}

/* -------------------------------- Ledger -------------------------------- */
export function FinanceLedger({ token }) {
  const { fy, picker } = useFy();
  const { data, loading } = useFetch(ENDPOINTS.FINANCE_LEDGER, fy);
  const { data: journal } = useFetch(ENDPOINTS.FINANCE_JOURNAL, fy);
  const { data: close } = useFetch(ENDPOINTS.FINANCE_YEAR_CLOSE, fy);
  const heads = data?.heads || [];
  const entries = journal?.entries || [];
  const checks = close?.checks || [];

  return (
    <div className="space-y-4">
      <Panel title="Head-wise Ledger & Trial Balance" subtitle={"Derived from canonical FIN transactions · FY " + fy} right={picker}>
        {loading ? <p className="text-zinc-400">Loading…</p> : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-500"><tr><th className="p-2 text-left">Head</th><th className="p-2 text-right">Debit</th><th className="p-2 text-right">Credit</th><th className="p-2 text-right">Net</th></tr></thead>
              <tbody className="divide-y">
                {heads.map((h) => (
                  <tr key={h.head}>
                    <td className="p-2 font-bold text-[#002344] capitalize">{h.head}</td>
                    <td className="p-2 text-right">{money(h.debit)}</td>
                    <td className="p-2 text-right">{money(h.credit)}</td>
                    <td className="p-2 text-right font-bold">{money((h.credit || 0) - (h.debit || 0))}</td>
                  </tr>
                ))}
                {!heads.length && <tr><td colSpan="4" className="p-4 text-center text-zinc-400">No ledger data.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title="Year-close checks" subtitle={"Run before closing FY " + fy} right={close && <Chip tone={close.canClose ? "green" : "amber"}>{close.canClose ? "Ready to close" : "Review needed"}</Chip>}>
        <div className="space-y-2">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              {c.level === "warning" ? <FaExclamationTriangle className="text-amber-500" /> : <FaCheckCircle className="text-emerald-500" />}
              <span className="text-zinc-700">{c.message}</span>
            </div>
          ))}
          {!checks.length && <p className="text-emerald-600 font-semibold text-sm inline-flex items-center gap-2"><FaCheckCircle /> All checks passed.</p>}
        </div>
      </Panel>

      <Panel title="Journal (chronological)" subtitle="Running balance across the year">
        <div className="overflow-auto max-h-[420px]">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500 sticky top-0"><tr><th className="p-2 text-left">FIN ID</th><th className="p-2 text-left">Date</th><th className="p-2 text-left">Particulars</th><th className="p-2 text-right">In</th><th className="p-2 text-right">Out</th><th className="p-2 text-right">Running</th></tr></thead>
            <tbody className="divide-y">
              {entries.map((e) => (
                <tr key={e.transactionId} className="hover:bg-zinc-50">
                  <td className="p-2 font-mono text-xs">{e.transactionId}</td>
                  <td className="p-2 whitespace-nowrap">{day(e.date)}</td>
                  <td className="p-2 max-w-[260px] truncate">{e.party || e.type}</td>
                  <td className="p-2 text-right text-emerald-700">{e.direction === "in" ? money(e.amount) : ""}</td>
                  <td className="p-2 text-right text-rose-600">{e.direction === "out" ? money(e.amount) : ""}</td>
                  <td className="p-2 text-right font-bold">{money(e.running)}</td>
                </tr>
              ))}
              {!entries.length && <tr><td colSpan="6" className="p-4 text-center text-zinc-400">No journal entries.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------ Integrity ------------------------------- */
export function FinanceIntegrity() {
  const { fy, picker } = useFy();
  const { data, loading, reload } = useFetch(ENDPOINTS.FINANCE_INTEGRITY, fy);
  const { data: dupes } = useFetch(ENDPOINTS.FINANCE_DUPLICATES, fy);
  const issues = data?.issues || [];
  const rec = data?.reconciliation;
  const dupeList = dupes?.duplicates || [];
  const crit = issues.filter((i) => i.severity === "critical").length;

  const line = (label, pair) => pair && (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-zinc-100 last:border-0">
      <span className="text-zinc-600 font-semibold">{label}</span>
      <span className="flex items-center gap-3">
        <span className="text-zinc-500">computed {money(pair.computed)}</span>
        <span className="text-zinc-500">audited {money(pair.audited)}</span>
        {Math.abs(pair.diff) <= 0.5 ? <Chip tone="green">match</Chip> : <Chip tone="amber">diff {money(pair.diff)}</Chip>}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Transactions" value={data?.count ?? "—"} />
        <Stat label="Cash balance" value={money(data?.balances?.cash)} />
        <Stat label="Bank balance" value={money(data?.balances?.bank)} />
        <Stat label="Critical issues" value={crit} tone={crit ? "red" : "green"} />
      </div>
      <Panel title="Audited vs Computed reconciliation" subtitle={"FY " + fy} right={<div className="flex gap-2">{picker}<button onClick={reload} className="bg-zinc-100 px-3 py-2 rounded-xl font-bold inline-flex items-center gap-2"><FaSync /> Recheck</button></div>}>
        {rec ? <div>
          {line("Receipts (income for the year)", rec.receipts)}
          {line("Expenditure", rec.expenditure)}
          {line("Closing cash", rec.cashClosing)}
          {line("Closing bank", rec.bankClosing)}
        </div> : <p className="text-zinc-400 text-sm">No audited summary for this FY yet.</p>}
      </Panel>
      <Panel title="Integrity findings" subtitle="Duplicate, orphan and linkage checks">
        {loading ? <p className="text-zinc-400">Loading…</p> : issues.length ? (
          <div className="space-y-2">
            {issues.map((it, i) => (
              <div key={i} className="flex items-start gap-3 text-sm border border-zinc-100 rounded-xl px-3 py-2">
                <Chip tone={it.severity === "critical" ? "red" : it.severity === "warning" ? "amber" : "zinc"}>{it.severity}</Chip>
                <div><div className="text-zinc-700 font-semibold">{it.message}</div>{it.transactionId && <div className="font-mono text-[11px] text-zinc-400">{it.transactionId}</div>}</div>
              </div>
            ))}
          </div>
        ) : <p className="text-emerald-600 font-semibold text-sm inline-flex items-center gap-2"><FaCheckCircle /> No integrity issues found.</p>}
      </Panel>
      <Panel title="Possible duplicates" subtitle="Same amount + date + party">
        {dupeList.length ? <div className="space-y-2">{dupeList.slice(0, 50).map((d, i) => (
          <div key={i} className="flex items-center justify-between text-sm border border-amber-100 bg-amber-50/50 rounded-xl px-3 py-2">
            <span className="font-mono text-xs">{d.a?.transactionId}</span>
            <span className="text-zinc-500">{money(d.a?.amount)} · {day(d.a?.transactionDate)}</span>
            <span className="font-mono text-xs">{d.b?.transactionId}</span>
          </div>
        ))}</div> : <p className="text-emerald-600 font-semibold text-sm inline-flex items-center gap-2"><FaCheckCircle /> No duplicate candidates.</p>}
      </Panel>
    </div>
  );
}

/* -------------------------------- Audit --------------------------------- */
const AUDIT_KINDS = [
  ["observation", "Observation"],
  ["query", "Auditor Query"],
  ["document", "Document"],
  ["reportVersion", "Report Version"],
  ["filing", "Compliance Filing"],
  ["adjustment", "Adjustment"],
  ["compliance", "Compliance"]
];
export function FinanceAudit() {
  const { fy, picker } = useFy();
  const { data: years } = useFetch(ENDPOINTS.AUDIT_YEARS, "");
  const { data: summary, reload } = useFetch(ENDPOINTS.AUDIT_SUMMARY, fy);
  const { data: comparison } = useFetch(ENDPOINTS.AUDIT_COMPARISON, "");
  const { data: pack } = useFetch(ENDPOINTS.AUDIT_PACK, fy);
  const { data: audited } = useFetch(ENDPOINTS.AUDIT_REPORTS, "");
  const [kind, setKind] = useState("observation");
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [openFy, setOpenFy] = useState("2025-26");
  const yearList = Array.isArray(years) ? years : [];
  const auditId = yearList.find((y) => y.financialYear === fy)?.auditId || (yearList[0]?.auditId);
  const auditedYears = audited?.years || [];
  const selectedReport = (audited?.reports || []).find((r) => r.financialYear === openFy);

  const add = async (e) => {
    e.preventDefault(); setMsg("");
    const payload = { kind, auditId, financialYear: fy, amount: amount ? Number(amount) : undefined, data: {} };
    if (kind === "observation") payload.data = { observation: text, severity: "Medium", status: "Open", recommendation: "", managementResponse: "", responsible: "" };
    else if (kind === "query") payload.data = { question: text, requestedDocument: "", status: "Open", auditorStatus: "Pending" };
    else if (kind === "document") payload.data = { category: "Audit Reports", title: text, version: "Version 1", uploadDate: day(new Date()) };
    else if (kind === "reportVersion") payload.data = { version: text || "Final", label: "", isCurrent: true };
    else if (kind === "filing") payload.data = { form: text, applicability: "To Be Confirmed", actualFilingDate: "", acknowledgementNo: "" };
    else if (kind === "adjustment") payload.data = { reason: text, note: "" };
    else payload.data = { title: text, status: "Open" };
    const { ok, data: d } = await api(ENDPOINTS.AUDIT_RECORDS, { method: "POST", body: JSON.stringify(payload) });
    if (ok) { setMsg("Added " + (d?.recordId || "record")); setText(""); setAmount(""); reload(); }
    else setMsg(d?.message || "Unable to add.");
  };

  const downloadPack = () => {
    const blob = new Blob([JSON.stringify(pack || {}, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "ssf-audit-pack-" + fy + ".json";
    document.body.appendChild(a); a.click(); a.remove();
  };

  const fin = summary?.financial || {};
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Audit year" value={auditId || "—"} />
        <Stat label="Receipts" value={money(fin.receipts)} tone="green" />
        <Stat label="Payments" value={money(fin.payments)} tone="red" />
        <Stat label="Surplus / (deficit)" value={money(fin.surplus)} tone={fin.surplus < 0 ? "red" : "green"} />
      </div>

      <Panel title="Audit & Compliance Records" subtitle={"Add observations, queries, documents and filings · FY " + fy} right={picker}>
        <form onSubmit={add} className="grid sm:grid-cols-4 gap-3 mb-4 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="border rounded-lg px-3 py-2">
            {AUDIT_KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input className="border rounded-lg px-3 py-2 sm:col-span-2" placeholder="Description / title / form" value={text} onChange={(e) => setText(e.target.value)} />
          <input type="number" step="0.01" className="border rounded-lg px-3 py-2" placeholder="Amount (optional)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button className="bg-[#002344] text-white rounded-lg px-4 py-2 font-bold">Add record</button>
        </form>
        {msg && <div className="mb-3 text-sm font-semibold text-[#002344]">{msg}</div>}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="border rounded-xl p-3"><div className="text-xs font-black text-zinc-400 uppercase">Findings</div><div className="text-2xl font-black text-[#002344]">{summary?.findings?.total ?? 0}</div><div className="text-xs text-zinc-500">{summary?.findings?.open ?? 0} open</div></div>
          <div className="border rounded-xl p-3"><div className="text-xs font-black text-zinc-400 uppercase">Documents</div><div className="text-2xl font-black text-[#002344]">{(summary?.documents?.uploaded ?? 0)}</div><div className="text-xs text-zinc-500">{summary?.documents?.versions ?? 0} versions</div></div>
          <div className="border rounded-xl p-3"><div className="text-xs font-black text-zinc-400 uppercase">Filings</div><div className="text-2xl font-black text-[#002344]">{(summary?.filings || []).length}</div><div className="text-xs text-zinc-500">{(summary?.filings || [])[0]?.status || "—"}</div></div>
        </div>
      </Panel>

      <Panel title="Year-on-year comparison" right={comparison && <Chip tone="navy">{(comparison.years || []).length} FY</Chip>}>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500"><tr><th className="p-2 text-left">FY</th><th className="p-2 text-right">Receipts</th><th className="p-2 text-right">Payments</th><th className="p-2 text-right">Surplus</th><th className="p-2 text-left">Source</th><th className="p-2 text-left">Status</th></tr></thead>
            <tbody className="divide-y">
              {(comparison?.years || []).map((y) => (
                <tr key={y.financialYear}><td className="p-2 font-bold">{y.financialYear}</td><td className="p-2 text-right">{money(y.receipts)}</td><td className="p-2 text-right">{money(y.payments)}</td><td className={"p-2 text-right font-bold " + (y.surplus < 0 ? "text-rose-600" : "text-emerald-700")}>{money(y.surplus)}</td><td className="p-2 text-xs"><Chip tone={y.source === "books" ? "green" : "blue"}>{y.source === "books" ? "books" : "audited"}</Chip></td><td className="p-2">{y.status}</td></tr>
              ))}
              {!(comparison?.years || []).length && <tr><td colSpan="6" className="p-4 text-center text-zinc-400">No years yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Audited Financial Statements" subtitle={audited ? `${audited.organization || ""} · CA-certified, transcribed from signed statements` : "Loading audited reports…"} right={audited && <Chip tone="navy">{auditedYears.length} audited FY</Chip>}>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500"><tr>
              <th className="p-2 text-left">FY</th><th className="p-2 text-right">Receipts (incl. opening)</th><th className="p-2 text-right">Income</th>
              <th className="p-2 text-right">Expenditure</th><th className="p-2 text-left">Result</th><th className="p-2 text-right">Closing cash + bank</th><th className="p-2 text-left">Auditor</th>
            </tr></thead>
            <tbody className="divide-y">
              {auditedYears.map((y) => (
                <tr key={y.financialYear} className={"hover:bg-zinc-50 cursor-pointer " + (openFy === y.financialYear ? "bg-amber-50/60" : "")} onClick={() => setOpenFy(y.financialYear)}>
                  <td className="p-2 font-bold text-[#002344]">{y.financialYear}</td>
                  <td className="p-2 text-right">{money(y.receiptsTotal)}</td>
                  <td className="p-2 text-right text-emerald-700">{money(y.income)}</td>
                  <td className="p-2 text-right text-rose-600">{money(y.expenditure)}</td>
                  <td className="p-2"><Chip tone={y.result.type === "surplus" ? "green" : "red"}>{y.result.type} {money(y.result.amount)}</Chip></td>
                  <td className="p-2 text-right font-bold">{money(y.closing?.total)}</td>
                  <td className="p-2 text-xs text-zinc-500">{y.auditor}</td>
                </tr>
              ))}
              {(audited?.pendingYears || []).map((p) => (
                <tr key={p} className="text-zinc-400"><td className="p-2 font-bold">{p}</td><td className="p-2 text-right" colSpan="6">Audit report pending</td></tr>
              ))}
              {!auditedYears.length && <tr><td colSpan="7" className="p-4 text-center text-zinc-400">No audited reports loaded.</td></tr>}
            </tbody>
          </table>
        </div>
        {audited?.note && <p className="text-[11px] text-zinc-400 mt-3">{audited.note} Inception FY {audited.inceptionFinancialYear}; earlier years pending.</p>}
      </Panel>

      {selectedReport && (
        <Panel title={"FY " + selectedReport.financialYear + " — Audited statements"} subtitle={selectedReport.opinion} right={<Chip tone={selectedReport.result.type === "surplus" ? "green" : "red"}>{selectedReport.result.type}</Chip>}>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <div className="bg-zinc-50 px-3 py-2 font-black text-[#002344] text-sm">Income &amp; Expenditure Account</div>
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {selectedReport.income.map((i) => (
                    <tr key={"i" + i.head}><td className="p-1.5">{i.head}</td><td className="p-1.5 text-right text-emerald-700">{money(i.amount)}</td></tr>
                  ))}
                  {selectedReport.expenditure.map((e) => (
                    <tr key={"e" + e.head}><td className="p-1.5">{e.head}</td><td className="p-1.5 text-right text-rose-600">{money(e.amount)}</td></tr>
                  ))}
                  <tr className="bg-zinc-50 font-bold"><td className="p-1.5">Total income / expenditure</td><td className="p-1.5 text-right">{money(selectedReport.incomeTotal)} / {money(selectedReport.expenditureTotal)}</td></tr>
                  <tr className="font-black text-[#002344]"><td className="p-1.5 capitalize">{selectedReport.result.type} to Balance Sheet</td><td className="p-1.5 text-right">{money(selectedReport.result.amount)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <div className="bg-zinc-50 px-3 py-2 font-black text-[#002344] text-sm">Balance Sheet (as at 31 March)</div>
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr><td className="p-1.5">General Fund — opening</td><td className="p-1.5 text-right">{money(selectedReport.generalFund.opening)}</td></tr>
                  <tr><td className="p-1.5 capitalize">{selectedReport.result.type === "surplus" ? "Add: surplus" : "Less: deficit"}</td><td className="p-1.5 text-right">{money(selectedReport.result.amount)}</td></tr>
                  <tr className="bg-zinc-50 font-bold"><td className="p-1.5">General Fund — closing</td><td className="p-1.5 text-right">{money(selectedReport.generalFund.closing)}</td></tr>
                  {selectedReport.fixedAssets.map((f) => (
                    <tr key={"f" + f.head}><td className="p-1.5 text-zinc-500">{f.head}</td><td className="p-1.5 text-right text-zinc-500">{money(f.amount)}</td></tr>
                  ))}
                  <tr><td className="p-1.5">Closing cash in hand</td><td className="p-1.5 text-right">{money(selectedReport.closingBalances.cash)}</td></tr>
                  <tr><td className="p-1.5">Closing cash at bank{selectedReport.closingBalances.breakup ? " (" + Object.keys(selectedReport.closingBalances.breakup).join(", ") + ")" : ""}</td><td className="p-1.5 text-right">{money(selectedReport.closingBalances.bank)}</td></tr>
                  <tr className="bg-zinc-50 font-bold"><td className="p-1.5">Closing cash + bank</td><td className="p-1.5 text-right">{money(selectedReport.closingBalances.total)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 mt-3 font-mono">{selectedReport.sourceFile}</p>
        </Panel>
      )}

      <Panel title="Audit Pack" subtitle={"Organized index of everything for FY " + fy} right={<button onClick={downloadPack} className="bg-[#FF6600] text-white px-3 py-2 rounded-xl font-bold inline-flex items-center gap-2"><FaDownload /> Download pack</button>}>
        <div className="grid sm:grid-cols-2 gap-3">
          {(pack?.index || []).map((s) => (
            <div key={s.section} className="border rounded-xl p-3 flex items-center justify-between">
              <span className="font-bold text-[#002344] inline-flex items-center gap-2"><FaLayerGroup className="text-[#FF6600]" /> {s.section}</span>
              <Chip tone="zinc">{s.items.length} items</Chip>
            </div>
          ))}
          {!(pack?.index || []).length && <p className="text-zinc-400 text-sm">No pack data.</p>}
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------- Seed bar ------------------------------- */
export function SeedBar({ reload, count }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const seed = async (force) => {
    if (force && !confirm("Re-import the official registers? This clears and rebuilds canonical transactions.")) return;
    setBusy(true); setMsg("");
    const { ok, data } = await api(ENDPOINTS.FINANCE_SEED + (force ? "?force=1" : ""), { method: "POST" });
    setBusy(false);
    if (ok) { setMsg("Seeded " + data.created + " transactions (" + data.skipped + " skipped)."); reload && reload(); }
    else setMsg(data?.message || "Seed failed.");
  };
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3">
      <button disabled={busy} onClick={() => seed(false)} className="bg-[#002344] text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2 disabled:opacity-50"><FaClipboardCheck /> {busy ? "Working…" : "Seed official registers"}</button>
      <button disabled={busy} onClick={() => seed(true)} className="bg-white border border-zinc-300 text-[#002344] px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2 disabled:opacity-50"><FaSync /> Re-import (rebuild)</button>
      <span className="text-xs text-zinc-500">Import is duplicate-safe: re-running never creates duplicate transactions.</span>
      {msg && <span className="text-xs font-bold text-[#002344]">{msg}</span>}
    </div>
  );
}
