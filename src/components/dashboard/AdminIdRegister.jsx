// The admin's ID operations desk.
//
// Two panels in one screen:
//   1. the offline membership register — every number the Foundation already
//      holds, and whether a website account has claimed it;
//   2. the issuance ledger — every number ever minted here, including ones
//      revoked since, so an admin can always answer "who holds SSF-MBR-…?".
//
// Editing, re-issuing, revoking and switching a card on or off all live in the
// Applications module next door; this screen is the read-only audit view plus a
// quick way to jump to the right record.
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaBan, FaCheckCircle, FaIdCard, FaSearch, FaSyncAlt } from "react-icons/fa";
import { ENDPOINTS } from "../../config/api";
import { SectionCard } from "./DashboardUI";

const TOKEN_KEY = "ssf_admin_token";
const adminHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ""}` });

const KIND_LABELS = { member: "Member", volunteer: "Volunteer", donor: "Donor" };

const dateText = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function AdminIdRegister() {
  const [register, setRegister] = useState([]);
  const [issuances, setIssuances] = useState([]);
  const [kind, setKind] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [regRes, issRes] = await Promise.all([
        fetch(ENDPOINTS.ADMIN_MEMBER_REGISTER, { headers: adminHeaders() }),
        fetch(ENDPOINTS.ADMIN_ID_ISSUANCES, { headers: adminHeaders() }),
      ]);
      if (regRes.status === 401 || issRes.status === 401) { localStorage.removeItem(TOKEN_KEY); window.location.assign("/Admin"); return; }
      const reg = await regRes.json().catch(() => []);
      const iss = await issRes.json().catch(() => []);
      setRegister(Array.isArray(reg) ? reg : []);
      setIssuances(Array.isArray(iss) ? iss : []);
    } catch (e) { setError(e.message || "Unable to load the ID register."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visibleIssuances = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return issuances
      .filter((row) => !kind || row.kind === kind)
      .filter((row) => !needle || [row.value, row.certValue, row.holderName, row.holderEmail].some((v) => String(v || "").toLowerCase().includes(needle)));
  }, [issuances, kind, query]);

  const visibleRegister = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return register.filter((row) => !needle || [row.memberId, row.name, row.email, row.mobile].some((v) => String(v || "").toLowerCase().includes(needle)));
  }, [register, query]);

  const stats = useMemo(() => ({
    total: issuances.length,
    live: issuances.filter((r) => r.status !== "revoked").length,
    revoked: issuances.filter((r) => r.status === "revoked").length,
    unclaimed: register.filter((r) => !r.claimed).length,
  }), [issuances, register]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Numbers issued", value: stats.total, tone: "bg-[#12345A] text-white" },
          { label: "Live cards", value: stats.live, tone: "bg-[#176447] text-white" },
          { label: "Revoked (never reused)", value: stats.revoked, tone: "bg-zinc-800 text-white" },
          { label: "Register unclaimed", value: stats.unclaimed, tone: "bg-[#F7A814] text-[#12345A]" },
        ].map(({ label, value, tone }) => (
          <div key={label} className={`rounded-2xl p-5 shadow-sm ${tone}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] opacity-70">{label}</p>
            <p className="text-2xl font-black mt-1">{value}</p>
          </div>
        ))}
      </div>

      <SectionCard eyebrow="ID operations" title="Issued ID numbers" subtitle="Every official number this website has generated. A revoked number stays here forever and is never handed to anybody else.">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search number, name or email…" className="w-full rounded-xl border border-zinc-200 pl-9 pr-4 py-2.5 text-sm" aria-label="Search issued IDs" />
          </div>
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-[#12345A]" aria-label="Filter by ID kind">
            <option value="">All types</option>
            <option value="member">Member</option>
            <option value="volunteer">Volunteer</option>
            <option value="donor">Donor</option>
          </select>
          <button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-bold"><FaSyncAlt /> Refresh</button>
        </div>
        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">{error}</p>}
        {loading ? <p className="py-10 text-center text-zinc-400">Loading…</p> : visibleIssuances.length === 0 ? <p className="py-10 text-center text-zinc-400">No issued ID matches your search.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[820px]">
              <thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-4 py-3">Number</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Holder</th><th className="px-4 py-3">Issued</th><th className="px-4 py-3">State</th></tr></thead>
              <tbody className="divide-y divide-zinc-50 text-sm">
                {visibleIssuances.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="px-4 py-3"><span className="font-bold text-[#12345A]">{row.value}</span>{row.certValue && <span className="block text-xs text-zinc-500">{row.certValue}</span>}</td>
                    <td className="px-4 py-3">{KIND_LABELS[row.kind] || row.kind}</td>
                    <td className="px-4 py-3"><span className="font-semibold">{row.holderName || "—"}</span><span className="block text-xs text-zinc-500">{row.holderEmail || "—"}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-zinc-600">{dateText(row.issuedAt)}</td>
                    <td className="px-4 py-3">
                      {row.status === "revoked"
                        ? <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-zinc-700"><FaBan /> Revoked {row.revokedAt ? dateText(row.revokedAt) : ""}</span>
                        : <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200"><FaCheckCircle /> Live</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard eyebrow="Offline register" title="Membership register" subtitle="The numbers the Foundation already holds on paper. A number marked unclaimed is free to be handed to a member from the Applications module.">
        {visibleRegister.length === 0 ? <p className="py-8 text-center text-zinc-400">No register row matches your search.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[760px]">
              <thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-4 py-3">Member ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Type / Post</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Claimed</th></tr></thead>
              <tbody className="divide-y divide-zinc-50 text-sm">
                {visibleRegister.map((row) => (
                  <tr key={row.memberId} className="align-top">
                    <td className="px-4 py-3 font-bold text-[#12345A]">{row.memberId}</td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3 text-xs text-zinc-600">{row.memberType || "—"}{row.designation ? ` • ${row.designation}` : ""}</td>
                    <td className="px-4 py-3 text-xs text-zinc-600">{row.email || "—"}<span className="block">{row.mobile || ""}</span></td>
                    <td className="px-4 py-3">{row.claimed ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200"><FaIdCard /> Claimed</span> : <span className="inline-flex rounded-full bg-[#F7A814]/20 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-[#8a5b00]">Unclaimed</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
