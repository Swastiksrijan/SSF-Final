// Admin command-centre overview: the live numbers, the work queue and the trail.
import { useCallback, useEffect, useState } from "react";
import { FaArrowRight, FaClipboardList, FaDownload, FaHeart, FaIdCard, FaHandsHelping, FaHistory, FaRupeeSign, FaSyncAlt, FaUsers } from "react-icons/fa";
import { ENDPOINTS } from "../../config/api";
import { EmptyState, InlineAlert, SectionCard, StatCard, StatusChip } from "./DashboardUI";

const TOKEN_KEY = "ssf_admin_token";
const adminHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ""}` });
const dateTime = (value) => (value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—");
const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const KIND_LABEL = { member: "Membership", volunteer: "Volunteer", internship: "Internship", donor: "Donation" };

export function AdminOverview({ onOpenModule }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch(ENDPOINTS.ADMIN_DASHBOARD, { headers: adminHeaders() });
      if (!response.ok) throw new Error("Unable to load the dashboard summary.");
      setStats(await response.json());
    } catch (e) { setError(e.message || "Unable to load the dashboard summary."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const exportCsv = async (type) => {
    try {
      const response = await fetch(ENDPOINTS.ADMIN_EXPORT_CSV(type), { headers: adminHeaders() });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ssf-${type}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e.message || "Unable to export that record set."); }
  };

  if (loading && !stats) return <InlineAlert tone="loading">Building the live dashboard…</InlineAlert>;

  const m = stats?.members || {};
  const v = stats?.volunteers || {};
  const i = stats?.internships || {};
  const d = stats?.donations || {};

  return (
    <div className="space-y-5">
      {error && <InlineAlert tone="error">{error}</InlineAlert>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">Live figures from the SSF database{stats?.generatedAt ? ` · updated ${dateTime(stats.generatedAt)}` : ""}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#D8E1EA] px-4 py-2.5 text-sm font-bold text-[#12345A]"><FaSyncAlt /> Refresh</button>
          <button type="button" onClick={() => exportCsv("members")} className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] text-white px-4 py-2.5 text-sm font-bold"><FaDownload /> Export members</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard tone="navy" label="Members pending" value={m.pending || 0} hint={`${m.realMembers || 0} membership records`} icon={FaIdCard} onClick={() => onOpenModule("applications")} />
        <StatCard tone="green" label="Volunteers pending" value={v.pending || 0} hint={`${v.approved || 0} approved · ${v.total || 0} total`} icon={FaHandsHelping} onClick={() => onOpenModule("applications")} />
        <StatCard tone="white" label="Internships" value={i.total || 0} hint={`${i.pending || 0} pending · ${i.selected || 0} selected`} icon={FaClipboardList} onClick={() => onOpenModule("applications")} />
        <StatCard tone="white" label="Confirmed donations" value={formatINR(d.confirmedAmount)} hint={`${d.confirmed || 0} confirmed · ${d.pending || 0} pending`} icon={FaRupeeSign} onClick={() => onOpenModule("applications")} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard tone="white" label="Fee paid members" value={m.paid || 0} hint={`${m.approved || 0} approved`} icon={FaIdCard} />
        <StatCard tone="white" label="Accounts (logins)" value={m.totalAccounts || 0} hint="Includes website signups" icon={FaUsers} />
        <StatCard tone="white" label="Corrections requested" value={m.correctionsRequested || 0} hint="Waiting on the applicant" icon={FaHistory} />
        <StatCard tone="white" label="Open enquiries" value={(stats?.interests?.open || 0) + (stats?.contacts?.open || 0)} hint={`${stats?.interests?.total || 0} interests · ${stats?.contacts?.total || 0} contacts`} icon={FaHeart} />
      </div>

      <SectionCard eyebrow="Work queue" title="Waiting on the admin team" subtitle="Everything here needs a decision or a follow-up." actions={
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => exportCsv("volunteers")} className="rounded-xl bg-[#EAF0F6] text-[#12345A] px-3.5 py-2 text-xs font-black">Export volunteers</button>
          <button type="button" onClick={() => exportCsv("donors")} className="rounded-xl bg-[#EAF0F6] text-[#12345A] px-3.5 py-2 text-xs font-black">Export donors</button>
          <button type="button" onClick={() => exportCsv("internships")} className="rounded-xl bg-[#EAF0F6] text-[#12345A] px-3.5 py-2 text-xs font-black">Export internships</button>
        </div>
      }>
        {stats?.pendingQueue?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead><tr className="text-left text-zinc-400 border-b"><th className="p-3">Applicant</th><th className="p-3">Type</th><th className="p-3">Detail</th><th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3">Submitted</th><th className="p-3"></th></tr></thead>
              <tbody>
                {stats.pendingQueue.map((row) => (
                  <tr key={`${row.kind}-${row.id}`} className="border-b last:border-0">
                    <td className="p-3"><p className="font-bold text-[#12345A]">{row.name || "—"}</p><p className="text-xs text-zinc-400">{row.email}</p></td>
                    <td className="p-3 text-zinc-500">{KIND_LABEL[row.kind] || row.kind}</td>
                    <td className="p-3 text-zinc-500">{row.detail || "—"}</td>
                    <td className="p-3"><StatusChip status={row.status} /></td>
                    <td className="p-3">{row.paymentStatus ? <StatusChip status={row.paymentStatus} /> : <span className="text-zinc-300">—</span>}</td>
                    <td className="p-3 text-zinc-500 whitespace-nowrap">{dateTime(row.at)}</td>
                    <td className="p-3"><button type="button" onClick={() => onOpenModule("applications")} className="text-[#176447] font-bold whitespace-nowrap">Review <FaArrowRight className="inline ml-1" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="Nothing is waiting">Every membership, volunteer and internship record has been actioned.</EmptyState>}
      </SectionCard>

      <SectionCard eyebrow="Audit trail" title="Recent admin activity" subtitle="Every state-changing admin action is recorded automatically." actions={<button type="button" onClick={() => onOpenModule("audit")} className="rounded-xl bg-[#EAF0F6] text-[#12345A] px-3.5 py-2 text-xs font-black">Open full audit log</button>}>
        {stats?.recentActivity?.length ? (
          <ol className="space-y-3">
            {stats.recentActivity.map((row) => (
              <li key={row.id} className="flex items-start gap-3 rounded-2xl border border-[#EAF0F6] p-3.5">
                <span className="h-9 w-9 shrink-0 rounded-xl bg-[#EAF0F6] text-[#176447] flex items-center justify-center"><FaHistory /></span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#12345A] break-words">{row.summary || `${row.action} ${row.entityType || ""}`}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{row.actor || "admin"}{row.entityName ? ` · ${row.entityName}` : ""} · {dateTime(row.at)}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : <EmptyState title="No admin activity recorded yet">Actions such as approvals, status changes and deletions appear here automatically.</EmptyState>}
      </SectionCard>
    </div>
  );
}

export function AdminAuditLog() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityType, setEntityType] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${ENDPOINTS.ADMIN_AUDIT_LOGS}?limit=500${entityType ? `&entityType=${encodeURIComponent(entityType)}` : ""}`;
      const response = await fetch(url, { headers: adminHeaders() });
      const data = await response.json().catch(() => []);
      setRows(Array.isArray(data) ? data : []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  }, [entityType]);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((row) => {
    if (!query.trim()) return true;
    const haystack = `${row.actor} ${row.action} ${row.entityType} ${row.entityName} ${row.summary}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const pageRows = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <SectionCard eyebrow="Governance" title="Audit log" subtitle="A tamper-evident history of admin changes. Filter, search and export the trail.">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search actor, action or record…" className="flex-1 min-w-[220px] rounded-xl border border-[#D8E1EA] px-4 py-2.5 text-sm" />
        <select value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1); }} className="rounded-xl border border-[#D8E1EA] px-4 py-2.5 text-sm font-semibold text-[#12345A]">
          <option value="">All record types</option>
          {["member", "volunteer", "donor", "internship", "contact", "interest", "user", "admin"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl bg-[#EAF0F6] text-[#12345A] px-4 py-2.5 text-sm font-bold"><FaSyncAlt /> Refresh</button>
      </div>
      {loading ? <InlineAlert tone="loading">Loading the audit trail…</InlineAlert> : pageRows.length === 0 ? (
        <EmptyState title="No audit entries found">{rows.length === 0 ? "Admin changes will be recorded here automatically." : "No entry matches this filter."}</EmptyState>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead><tr className="text-left text-zinc-400 border-b"><th className="p-3">When</th><th className="p-3">Actor</th><th className="p-3">Action</th><th className="p-3">Record</th><th className="p-3">Summary</th><th className="p-3">Result</th></tr></thead>
              <tbody>
                {pageRows.map((row) => {
                  const ok = row.detail?.ok !== false;
                  return (
                    <tr key={row.id} className="border-b last:border-0 align-top">
                      <td className="p-3 text-zinc-500 whitespace-nowrap">{dateTime(row.at)}</td>
                      <td className="p-3 font-bold text-[#12345A]">{row.actor || "admin"}</td>
                      <td className="p-3"><span className="rounded-full bg-[#EAF0F6] text-[#12345A] px-2.5 py-1 text-[11px] font-black uppercase">{row.action}</span></td>
                      <td className="p-3 text-zinc-500">{row.entityType}{row.entityName ? ` · ${row.entityName}` : ""}</td>
                      <td className="p-3 text-zinc-600 max-w-[320px] break-words">{row.summary}</td>
                      <td className="p-3"><span className={`font-bold ${ok ? "text-emerald-600" : "text-red-600"}`}>{ok ? "Success" : "Failed"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3 mt-4">
            <p className="text-xs text-zinc-500">{filtered.length} entr{filtered.length === 1 ? "y" : "ies"} · page {current} of {pageCount}</p>
            <div className="flex gap-2">
              <button type="button" disabled={current <= 1} onClick={() => setPage(current - 1)} className="rounded-xl bg-[#EAF0F6] text-[#12345A] px-4 py-2 text-sm font-bold disabled:opacity-40">Previous</button>
              <button type="button" disabled={current >= pageCount} onClick={() => setPage(current + 1)} className="rounded-xl bg-[#EAF0F6] text-[#12345A] px-4 py-2 text-sm font-bold disabled:opacity-40">Next</button>
            </div>
          </div>
        </>
      )}
    </SectionCard>
  );
}
