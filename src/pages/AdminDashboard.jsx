// The admin command centre.
//
// A sidebar dashboard rather than one long scroll: each module is a real,
// working area (live KPIs, the applications workflow, people and roles, account
// administration, learning certificates, the audit log and settings). The three
// placeholder sections that only held a paragraph and a jump button have been
// removed — their data is reachable where it actually lives.
import { useState } from "react";
import {
  FaBars, FaCertificate, FaChartLine, FaClipboardList, FaCog, FaExternalLinkAlt,
  FaHistory, FaIdCard, FaSignOutAlt, FaUserShield, FaUsers, FaTimes,
} from "react-icons/fa";
import AdminPortalV2 from "./AdminPortalV2";
import AdminApplicationDashboard from "../components/AdminApplicationDashboard";
import AdminIdRegister from "../components/dashboard/AdminIdRegister";
import AdminUserManagement from "../components/AdminUserManagement";
import AdminLearningCertificates from "../components/AdminLearningCertificates";
import { AdminAuditLog, AdminOverview } from "../components/dashboard/AdminOverview";
import { SectionCard } from "../components/dashboard/DashboardUI";
import AdminPageHeader from "../components/dashboard/AdminPageHeader";
import { ENDPOINTS } from "../config/api";

const TOKEN_KEY = "ssf_admin_token";

const MODULES = [
  { id: "overview", label: "Dashboard", hint: "Live KPIs & work queue", icon: FaChartLine, crumb: "Overview" },
  { id: "applications", label: "Applications", hint: "Intake, status & records", icon: FaClipboardList, crumb: "Applications" },
  { id: "ids", label: "ID Register", hint: "Issued IDs & member register", icon: FaIdCard, crumb: "ID Register" },
  { id: "people", label: "People & Roles", hint: "Members, volunteers, approvals", icon: FaUsers, crumb: "People & Roles" },
  { id: "users", label: "User Management", hint: "Accounts & access", icon: FaUserShield, crumb: "User Management" },
  { id: "learning", label: "Learning Certificates", hint: "Course completions", icon: FaCertificate, crumb: "Learning" },
  { id: "audit", label: "Audit Log", hint: "Every admin change", icon: FaHistory, crumb: "Audit Log" },
  { id: "settings", label: "Settings", hint: "Session, exports & links", icon: FaCog, crumb: "Settings" },
];

export default function AdminDashboard() {
  const [active, setActive] = useState(() => {
    const stored = sessionStorage.getItem("ssf_admin_module");
    return MODULES.some((m) => m.id === stored) ? stored : "overview";
  });
  const [navOpen, setNavOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.assign("/Admin");
  };

  const open = (id) => {
    setActive(id);
    sessionStorage.setItem("ssf_admin_module", id);
    setNavOpen(false);
  };

  const current = MODULES.find((m) => m.id === active) || MODULES[0];

  return (
    <main className="min-h-screen bg-[#EAF0F6] pt-20 md:pt-[116px] pb-12">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar */}
          <aside className={`lg:w-72 shrink-0 ${navOpen ? "" : "hidden lg:block"}`}>
            <div className="lg:sticky lg:top-32 space-y-4">
              <div className="rounded-3xl bg-[#12345A] text-white p-5 shadow-sm relative overflow-hidden">
                <div className="absolute -right-14 -top-16 h-52 w-52 rounded-full bg-white/5" />
                <div className="relative">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F7A814]">Swastik Srijan Foundation</p>
                  <h1 className="text-xl font-black mt-1">Admin Command Center</h1>
                  <p className="text-xs text-white/60 mt-1.5">Full control over applications, people, records and the audit trail.</p>
                  <div className="mt-4 rounded-2xl bg-white/10 border border-white/10 px-3.5 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">System status</p>
                    <p className="font-black text-sm mt-0.5">Admin session active</p>
                  </div>
                </div>
              </div>

              <nav className="rounded-3xl bg-white border border-[#EAF0F6] shadow-sm p-2.5">
                {MODULES.map(({ id, label, hint, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => open(id)}
                    className={`w-full text-left rounded-2xl px-3.5 py-3 flex items-start gap-3 transition ${active === id ? "bg-[#12345A] text-white" : "text-zinc-700 hover:bg-[#EAF0F6]"}`}
                  >
                    <Icon className={`mt-0.5 ${active === id ? "text-[#F7A814]" : "text-[#176447]"}`} />
                    <span className="min-w-0">
                      <span className="block text-sm font-black leading-tight">{label}</span>
                      <span className={`block text-[11px] mt-0.5 ${active === id ? "text-white/60" : "text-zinc-400"}`}>{hint}</span>
                    </span>
                  </button>
                ))}
              </nav>

              <div className="rounded-3xl bg-white border border-[#EAF0F6] shadow-sm p-4 space-y-2">
                <a href="/admin/funding-outreach" className="flex items-center justify-between gap-2 rounded-2xl bg-[#12345A] text-white px-4 py-3 text-sm font-black">Funding & CSR Outreach <FaExternalLinkAlt className="text-xs" /></a>
                <a href="/ims" className="flex items-center justify-between gap-2 rounded-2xl bg-[#176447] text-white px-4 py-3 text-sm font-black">SSF OneOffice (IMS) <FaExternalLinkAlt className="text-xs" /></a>
                <button type="button" onClick={logout} className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-200 text-red-600 px-4 py-3 text-sm font-black"><FaSignOutAlt /> Logout</button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-4">
              <button type="button" onClick={() => setNavOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-2xl bg-[#12345A] text-white px-4 py-3 text-sm font-black">
                {navOpen ? <FaTimes /> : <FaBars />} {navOpen ? "Close menu" : `Menu · ${current.label}`}
              </button>
            </div>

            <div className="mb-5">
              <AdminPageHeader
                eyebrow="SSF Admin · Command Center"
                title={current.label}
                subtitle={current.hint}
                breadcrumb={["Admin", "Command Center", current.crumb || current.label]}
                icon={<current.icon />}
                action={
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a href="/ims" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-black text-white backdrop-blur-sm transition hover:bg-white/20">
                      SSF OneOffice (IMS) <FaExternalLinkAlt className="text-[11px]" />
                    </a>
                    <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-black text-white backdrop-blur-sm transition hover:bg-white/20">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                }
              />
            </div>

            {active === "overview" && <AdminOverview onOpenModule={open} />}

            {active === "applications" && <AdminApplicationDashboard />}

            {active === "ids" && <AdminIdRegister />}

            {active === "people" && (
              <div className="space-y-5">
                <SectionCard eyebrow="People & roles" title="Members, volunteers & approvals" subtitle="Approve applications and issue official ID cards and certificates. Membership approval requires a confirmed fee.">
                  <AdminPortalV2 />
                </SectionCard>
              </div>
            )}

            {active === "users" && (
              <SectionCard eyebrow="Accounts & access" title="User management" subtitle="Website accounts, roles and account-level administration.">
                <AdminUserManagement />
              </SectionCard>
            )}

            {active === "learning" && <AdminLearningCertificates />}

            {active === "audit" && <AdminAuditLog />}

            {active === "settings" && <AdminSettings onLogout={logout} />}
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminSettings({ onLogout }) {
  const exportCsv = async (type) => {
    const response = await fetch(ENDPOINTS.ADMIN_EXPORT_CSV(type), {
      headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ""}` },
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ssf-${type}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <SectionCard eyebrow="Data" title="Export records" subtitle="Download a CSV of any record set for offline reporting and record-keeping.">
        <div className="flex flex-wrap gap-2">
          {["members", "volunteers", "donors", "internships"].map((type) => (
            <button key={type} type="button" onClick={() => exportCsv(type)} className="rounded-xl bg-[#12345A] text-white px-4 py-2.5 text-sm font-black capitalize">Export {type}</button>
          ))}
        </div>
      </SectionCard>
      <SectionCard eyebrow="Session" title="Admin session">
        <p className="text-sm text-zinc-600">Your admin session is stored on this device only. Logging out removes it immediately — always log out on a shared computer.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="/ims" className="inline-flex items-center gap-2 rounded-xl bg-[#176447] text-white px-4 py-2.5 text-sm font-black">SSF OneOffice (IMS) <FaExternalLinkAlt className="text-xs" /></a>
          <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl border border-red-200 text-red-600 px-4 py-2.5 text-sm font-black"><FaSignOutAlt /> Logout</button>
        </div>
      </SectionCard>
    </div>
  );
}
