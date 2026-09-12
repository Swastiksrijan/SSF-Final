import { useEffect, useMemo, useState } from 'react';
import { FaBriefcase, FaEnvelope, FaHandshake, FaHandsHelping, FaHeart, FaIdCard, FaTrash, FaUsers } from 'react-icons/fa';
import { API_BASE_URL, ENDPOINTS } from '../config/api';

const TOKEN_KEY = 'ssf_admin_token';
const tabs = [
  { id: 'all', label: 'All', icon: FaUsers },
  { id: 'contact', label: 'Contact', icon: FaEnvelope },
  { id: 'internship', label: 'Internship', icon: FaBriefcase },
  { id: 'volunteer', label: 'Volunteer', icon: FaHandsHelping },
  { id: 'member', label: 'Member', icon: FaIdCard },
  { id: 'donor', label: 'Donor', icon: FaHeart },
  { id: 'interest', label: 'Activities / Partnership', icon: FaHandshake }
];

const dateText = v => v ? new Date(v).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const interestLabel = type => ({ volunteer: 'Volunteer', member: 'Membership', partner: 'CSR / Partnership', movement: 'Activities / Nation-Building Movement' }[type] || 'Interest');

const deleteEndpoints = (kind, id) => {
  const safeId = encodeURIComponent(id);
  if (kind === 'contact') return [`${API_BASE_URL}/api/admin/contacts/${safeId}/delete`, `${API_BASE_URL}/api/admin/contacts/${safeId}`];
  if (kind === 'internship') return [`${API_BASE_URL}/api/admin/internships/${safeId}/delete`, `${API_BASE_URL}/api/admin/internships/${safeId}`];
  if (kind === 'volunteer') return [null, ENDPOINTS.ADMIN_DELETE_VOLUNTEER(id)];
  if (kind === 'member') return [null, ENDPOINTS.ADMIN_DELETE_MEMBER(id)];
  if (kind === 'interest') return [null, ENDPOINTS.ADMIN_DELETE_INTEREST(id)];
  return null;
};

export default function AdminApplicationDashboard() {
  const [data, setData] = useState({ contacts: [], internships: [], interests: [], volunteers: [], members: [], donors: [] });
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [busy, setBusy] = useState('');

  const load = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setAuthenticated(false); return; }
    setAuthenticated(true); setLoading(true); setError('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const responses = await Promise.all([
        fetch(ENDPOINTS.ADMIN_CONTACTS, { headers }),
        fetch(ENDPOINTS.ADMIN_INTERNSHIPS, { headers }),
        fetch(ENDPOINTS.ADMIN_INTERESTS, { headers }),
        fetch(ENDPOINTS.ADMIN_VOLUNTEERS, { headers }),
        fetch(ENDPOINTS.ADMIN_MEMBERS, { headers }),
        fetch(ENDPOINTS.ADMIN_DONORS, { headers })
      ]);
      if (responses.some(r => r.status === 401)) {
        localStorage.removeItem(TOKEN_KEY); setAuthenticated(false);
        throw new Error('Admin session expired. Please log in again.');
      }
      if (!responses.every(r => r.ok)) throw new Error('Some application data could not be loaded.');
      const [contacts, internships, interests, volunteers, members, donors] = await Promise.all(responses.map(r => r.json()));
      setData({
        contacts: Array.isArray(contacts) ? contacts : [],
        internships: Array.isArray(internships) ? internships : [],
        interests: Array.isArray(interests) ? interests : [],
        volunteers: Array.isArray(volunteers) ? volunteers : [],
        members: Array.isArray(members) ? members : [],
        donors: Array.isArray(donors) ? donors : []
      });
    } catch (e) { setError(e.message || 'Unable to load applications.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const records = useMemo(() => {
    const contacts = data.contacts.map(x => ({ ...x, kind: 'contact', title: `${x.firstName || ''} ${x.lastName || ''}`.trim(), subtitle: x.email, detail: 'Contact inquiry', date: x.createdAt }));
    const internships = data.internships.map(x => ({ ...x, kind: 'internship', title: x.fullName, subtitle: x.email, detail: `${x.college || '—'} • ${x.course || '—'} • ${x.internshipType || 'Internship'} • ${x.duration || '—'}`, date: x.createdAt }));
    const volunteers = data.volunteers.map(x => ({ ...x, kind: 'volunteer', title: x.fullName, subtitle: x.email, detail: `Volunteer • ${x.volunteerType || 'General Volunteer'} • ${x.position || 'General Volunteer'} • ${x.phone || '—'}`, date: x.submittedAt || x.createdAt, applicationId: x.volunteerId || `Record ${x.id}` }));
    const members = data.members.map(x => ({ ...x, kind: 'member', title: x.fullName, subtitle: x.email, detail: `Membership • ${x.memberType || 'Member'} • ${x.phone || '—'}`, date: x.createdAt, applicationId: x.memberId || `Account ${x.id}` }));
    const donors = data.donors.map(x => ({ ...x, kind: 'donor', title: x.fullName, subtitle: x.email, detail: `Donation • ${x.donationPurpose || 'General'} • Amount: ${x.amount == null ? 'Not specified' : `₹${Number(x.amount).toFixed(2)}`} • ${x.phone || '—'}`, date: x.createdAt, applicationId: x.donorId || `Record ${x.id}` }));
    const interests = data.interests.map(x => ({ ...x, kind: x.interestType === 'volunteer' ? 'volunteer-interest' : x.interestType === 'member' ? 'member-interest' : 'interest', title: x.fullName, subtitle: x.email, detail: `${interestLabel(x.interestType)}${x.category ? ` • ${x.category}` : ''} • ${x.phone || '—'}`, date: x.createdAt }));
    return [...contacts, ...internships, ...volunteers, ...members, ...donors, ...interests]
      .filter(x => tab === 'all' || x.kind === tab || (tab === 'interest' && ['interest', 'volunteer-interest', 'member-interest'].includes(x.kind)))
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [data, tab]);

  const updateStatus = async (record, status) => {
    const token = localStorage.getItem(TOKEN_KEY);
    let endpoint = null;
    if (record.kind === 'contact') endpoint = ENDPOINTS.ADMIN_CONTACT_STATUS(record.id);
    else if (record.kind === 'internship') endpoint = ENDPOINTS.ADMIN_INTERNSHIP_STATUS(record.id);
    else if (record.kind === 'volunteer') endpoint = ENDPOINTS.ADMIN_VOLUNTEER_STATUS(record.id);
    else if (record.kind === 'member') endpoint = ENDPOINTS.ADMIN_MEMBER_STATUS(record.id);
    else if (record.kind === 'interest' || record.kind === 'volunteer-interest' || record.kind === 'member-interest') endpoint = ENDPOINTS.ADMIN_INTEREST_STATUS(record.id);
    if (!endpoint) return;
    setBusy(`${record.kind}-${record.id}`); setError('');
    try {
      const response = await fetch(endpoint, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); return; }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to update status.');
      await load();
    } catch (e) { setError(e.message || 'Unable to update status.'); }
    finally { setBusy(''); }
  };

  const deleteRecord = async record => {
    const endpoints = deleteEndpoints(record.kind === 'volunteer-interest' || record.kind === 'member-interest' ? 'interest' : record.kind, record.id);
    if (!endpoints) return;
    if (!window.confirm(`Delete this ${record.kind} submission from ${record.title}?\n\nThis permanently removes the submission. This cannot be undone.`)) return;
    setBusy(`${record.kind}-${record.id}`); setError('');
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      let response;
      if (endpoints[0]) response = await fetch(endpoints[0], { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ permanent: true }) });
      else response = await fetch(endpoints[1], { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 404 && endpoints[1] && endpoints[0]) response = await fetch(endpoints[1], { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); return; }
      if (!response.ok) throw new Error(result.message || `Delete failed (${response.status}).`);
      await load();
    } catch (e) { setError(e.message || 'Unable to delete submission.'); }
    finally { setBusy(''); }
  };

  if (!authenticated) return null;

  const counts = {
    contact: data.contacts.length,
    internship: data.internships.length,
    volunteer: data.volunteers.length + data.interests.filter(x => x.interestType === 'volunteer').length,
    member: data.members.length + data.interests.filter(x => x.interestType === 'member').length,
    donor: data.donors.length,
    interest: data.interests.filter(x => !['volunteer', 'member'].includes(x.interestType)).length
  };

  const statusOptions = record => {
    if (record.kind === 'internship') return <><option value="new">New</option><option value="pending">Pending</option><option value="reviewed">Reviewed</option><option value="selected">Selected — Issue ID & Letter</option><option value="completed">Completed — Issue Certificate</option><option value="rejected">Rejected</option></>;
    if (record.kind === 'volunteer' || record.kind === 'member') return <><option value="pending">Pending</option><option value="changes_requested">Changes Requested</option><option value="approved">Approved — Issue ID</option><option value="rejected">Rejected</option></>;
    if (['interest', 'volunteer-interest', 'member-interest'].includes(record.kind)) return <><option value="new">New</option><option value="contacted">Contacted</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="closed">Closed</option></>;
    if (record.kind === 'contact') return <><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></>;
    return null;
  };

  return <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden">
    <div className="p-8 border-b border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div><p className="text-xs font-black uppercase tracking-widest text-[#FF6600]">Application Records</p><h2 className="text-2xl font-black text-[#002344] mt-1">Applications & Participation</h2><p className="text-sm text-zinc-500 mt-1">Every submission made through the User Portal or public forms is shown here. Review and update the appropriate records.</p></div>
      <button onClick={load} className="px-4 py-2 rounded-xl bg-zinc-100 font-bold text-sm">Refresh</button>
    </div>
    <div className="px-8 pt-5 flex flex-wrap gap-2">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${tab === id ? 'bg-[#002344] text-white' : 'bg-zinc-100 text-zinc-600'}`}><Icon />{label}{id !== 'all' && <span className="opacity-70">({counts[id] || 0})</span>}</button>)}</div>
    {error && <div className="mx-8 mt-5 p-4 rounded-xl bg-red-50 text-red-700 font-semibold text-sm">{error}</div>}
    <div className="p-8 pt-5 overflow-x-auto">{loading ? <div className="py-12 text-center text-zinc-400">Loading applications…</div> : records.length === 0 ? <div className="py-12 text-center text-zinc-400">No submissions found.</div> : <table className="w-full text-left min-w-[1200px]"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-5 py-4">Applicant</th><th className="px-5 py-4">Type / Category</th><th className="px-5 py-4">Submitted</th><th className="px-5 py-4">Status / Action</th><th className="px-5 py-4">Message / Information</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{records.map(record => { const canManage = !['donor'].includes(record.kind); const canDelete = deleteEndpoints(record.kind === 'volunteer-interest' || record.kind === 'member-interest' ? 'interest' : record.kind, record.id); return <tr key={`${record.kind}-${record.id}`} className="align-top"><td className="px-5 py-5"><p className="font-bold text-[#002344]">{record.title}</p><p className="text-xs text-zinc-500 mt-1">{record.subtitle}</p>{record.phone && <p className="text-xs text-zinc-500">{record.phone}</p>}</td><td className="px-5 py-5"><p className="font-bold">{record.kind === 'donor' ? 'Donor' : record.kind === 'interest' || record.kind === 'volunteer-interest' || record.kind === 'member-interest' ? interestLabel(record.interestType) : record.kind}</p><p className="text-xs text-zinc-500 mt-1 max-w-[320px]">{record.detail}</p>{record.applicationId && <p className="text-xs font-bold text-[#002344] mt-2">{record.applicationId}</p>}{record.resumePath && <a href={`${API_BASE_URL}${record.resumePath}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700 inline-block mt-2">Open Resume</a>}</td><td className="px-5 py-5 whitespace-nowrap text-xs text-zinc-600">{dateText(record.date)}</td><td className="px-5 py-5"><div className="flex flex-col gap-2">{canManage && statusOptions(record) ? <select disabled={busy === `${record.kind}-${record.id}`} value={record.status || ''} onChange={e => updateStatus(record, e.target.value)} className="rounded-lg border border-zinc-200 px-2 py-2 text-xs font-bold">{statusOptions(record)}</select> : <span className="inline-flex w-fit rounded-lg bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-700">{record.status || 'Submitted'}</span>}{canDelete && <button onClick={() => deleteRecord(record)} disabled={!!busy} className="inline-flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-xl font-bold text-xs"><FaTrash />{busy === `${record.kind}-${record.id}` ? 'Working…' : 'Delete Permanently'}</button>}</div></td><td className="px-5 py-5 max-w-[380px] text-xs leading-5 text-zinc-600">{record.message || record.notes || '—'}</td></tr>; })}</tbody></table>}</div>
  </section>;
}
