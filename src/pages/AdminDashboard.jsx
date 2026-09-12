import { useEffect, useState } from 'react';
import { FaChartLine, FaClipboardList, FaUsers, FaHeart, FaHandsHelping, FaIdCard, FaFileAlt, FaShieldAlt } from 'react-icons/fa';
import AdminPortalV2 from './AdminPortalV2';
import AdminApplicationDashboard from '../components/AdminApplicationDashboard';
import AdminUserManagement from '../components/AdminUserManagement';

const TOKEN_KEY = 'ssf_admin_token';

const modules = [
  { id: 'admin-overview', label: 'Dashboard', icon: FaChartLine },
  { id: 'admin-applications', label: 'Applications', icon: FaClipboardList },
  { id: 'admin-people', label: 'People & Roles', icon: FaUsers },
  { id: 'admin-donors', label: 'Donors & Donations', icon: FaHeart },
  { id: 'admin-volunteers', label: 'Volunteers', icon: FaHandsHelping },
  { id: 'admin-members', label: 'Members', icon: FaIdCard },
  { id: 'admin-reports', label: 'Reports & Records', icon: FaFileAlt },
  { id: 'admin-compliance', label: 'Compliance', icon: FaShieldAlt }
];

function jumpTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const sync = () => setLoggedIn(Boolean(localStorage.getItem(TOKEN_KEY)));
    window.addEventListener('storage', sync);
    const timer = window.setInterval(sync, 1000);
    return () => { window.removeEventListener('storage', sync); window.clearInterval(timer); };
  }, []);

  return <main className="min-h-screen bg-[#f6f8fb]">
    <section id="admin-overview" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-24">
      <div className="rounded-[2rem] bg-[#002344] text-white shadow-sm overflow-hidden relative">
        <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative p-6 sm:p-8 lg:p-9">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
            <div className="min-w-0 flex-1 lg:pr-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffb067]">Swastik Srijan Foundation</p>
              <h1 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">Admin Command Center</h1>
              <p className="text-white/70 mt-3 max-w-3xl leading-6">One place to review applications, manage people, approve roles, issue official records and keep SSF operational data organized.</p>
            </div>
            {loggedIn && <div className="w-full lg:w-[270px] shrink-0 rounded-2xl bg-white/10 border border-white/15 px-5 py-4 lg:self-center">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" /><p className="text-xs uppercase tracking-widest text-white/60 font-bold">System status</p></div>
              <p className="font-black mt-2">Admin session active</p>
              <p className="text-xs text-white/60 mt-1 leading-5">Protected records are available below.</p>
            </div>}
          </div>
        </div>
      </div>
      <div className="sticky top-0 z-20 mt-4 rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur shadow-sm p-2 overflow-x-auto"><div className="flex gap-2 min-w-max">{modules.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => jumpTo(id)} className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100 transition whitespace-nowrap"><Icon className="text-[#ff6600]" />{label}</button>)}</div></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <button onClick={() => jumpTo('admin-applications')} className="text-left rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm hover:shadow-md transition"><p className="text-xs uppercase tracking-widest text-zinc-400 font-black">Workflow</p><p className="text-lg font-black text-[#002344] mt-1">Applications</p><p className="text-xs text-zinc-500 mt-1">Review every portal/public submission</p></button>
        <button onClick={() => jumpTo('admin-people')} className="text-left rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm hover:shadow-md transition"><p className="text-xs uppercase tracking-widest text-zinc-400 font-black">CRM</p><p className="text-lg font-black text-[#002344] mt-1">People & Roles</p><p className="text-xs text-zinc-500 mt-1">Members, volunteers and applicants</p></button>
        <button onClick={() => jumpTo('admin-donors')} className="text-left rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm hover:shadow-md transition"><p className="text-xs uppercase tracking-widest text-zinc-400 font-black">Fundraising</p><p className="text-lg font-black text-[#002344] mt-1">Donors & Donations</p><p className="text-xs text-zinc-500 mt-1">Track requests without overstating receipts</p></button>
        <button onClick={() => jumpTo('admin-reports')} className="text-left rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm hover:shadow-md transition"><p className="text-xs uppercase tracking-widest text-zinc-400 font-black">Records</p><p className="text-lg font-black text-[#002344] mt-1">Reports & Records</p><p className="text-xs text-zinc-500 mt-1">Keep approvals and official records traceable</p></button>
      </div>
    </section>

    <section id="admin-applications" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-24"><AdminApplicationDashboard /></section>

    <section id="admin-people" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-24">
      <div className="rounded-[2rem] bg-white border border-zinc-100 p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-[#ff6600]">People & Roles</p>
        <h2 className="text-2xl font-black text-[#002344] mt-1">Members, Volunteers & Accounts</h2>
        <p className="text-sm text-zinc-500 mt-1 mb-5">Approval and official ID/certificate issuance remain in the existing secure management area. Account administration is available below.</p>
        <AdminPortalV2 />
      </div>
      <AdminUserManagement />
    </section>

    <section id="admin-donors" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-24"><div className="rounded-[2rem] bg-white border border-zinc-100 p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-[#ff6600]">Fundraising</p><h2 className="text-2xl font-black text-[#002344] mt-1">Donors & Donations</h2><p className="text-sm text-zinc-500 mt-1">Donor submissions are available in Applications. Donation status must reflect the actual transaction state; a request or pending record is not treated as money received.</p><button onClick={() => jumpTo('admin-applications')} className="mt-4 px-4 py-2.5 rounded-xl bg-[#002344] text-white text-sm font-bold">Open donor records</button></div></section>
    <section id="admin-volunteers" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-24"><div className="rounded-[2rem] bg-white border border-zinc-100 p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-[#ff6600]">Volunteer Management</p><h2 className="text-2xl font-black text-[#002344] mt-1">Volunteer workflow</h2><p className="text-sm text-zinc-500 mt-1">Use Applications for intake/status and the secure management area for approval and official volunteer ID/certificate actions.</p><button onClick={() => jumpTo('admin-applications')} className="mt-4 px-4 py-2.5 rounded-xl bg-[#002344] text-white text-sm font-bold">Open volunteer applications</button></div></section>
    <section id="admin-members" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-24"><div className="rounded-[2rem] bg-white border border-zinc-100 p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-[#ff6600]">Membership</p><h2 className="text-2xl font-black text-[#002344] mt-1">Member management</h2><p className="text-sm text-zinc-500 mt-1">Review membership submissions and use the secure management area to approve members and issue official records.</p><button onClick={() => jumpTo('admin-applications')} className="mt-4 px-4 py-2.5 rounded-xl bg-[#002344] text-white text-sm font-bold">Open member applications</button></div></section>
    <section id="admin-reports" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 scroll-mt-24"><div className="rounded-[2rem] bg-white border border-zinc-100 p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-[#ff6600]">Records</p><h2 className="text-2xl font-black text-[#002344] mt-1">Reports & official records</h2><p className="text-sm text-zinc-500 mt-1">This section is intentionally factual: no funding, donation or impact figure is treated as confirmed until the underlying record supports it.</p></div></section>
    <section id="admin-compliance" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-24"><div className="rounded-[2rem] bg-[#002344] text-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-[#ffb067]">Governance</p><h2 className="text-2xl font-black mt-1">Compliance & audit readiness</h2><p className="text-sm text-white/70 mt-2 max-w-4xl">The admin architecture is prepared for future modules such as audit logs, document records, programme reporting, CSR/partnership pipeline and grant tracking. These should be added only when the corresponding backend records and permissions exist.</p></div></section>
  </main>;
}
