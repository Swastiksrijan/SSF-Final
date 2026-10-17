import { useEffect, useMemo, useState } from 'react';
import { FaBriefcase, FaEnvelope, FaEye, FaHandshake, FaHandsHelping, FaHeart, FaIdCard, FaPen, FaTrash, FaUsers } from 'react-icons/fa';
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
// Profile photos are stored as /uploads URLs (or legacy absolute paths); the API
// normalises them, so here we only need to prefix the backend origin. Internship
// and donor documents live in /uploads subdirectories, so the path after
// /uploads/ is preserved rather than flattened to a basename.
const fileUrl = v => {
  if (!v) return null;
  if (/^https?:\/\//i.test(v) || v.startsWith('data:')) return v;
  const normalized = String(v).replace(/\\/g, '/');
  const marker = normalized.indexOf('/uploads/');
  const relative = marker >= 0 ? normalized.slice(marker + '/uploads/'.length) : normalized.split('/').pop();
  return relative ? `${API_BASE_URL}/uploads/${relative}` : null;
};

const STATUS_CHOICES = {
  all: ['pending', 'changes_requested', 'approved', 'rejected', 'new', 'contacted', 'reviewed', 'selected', 'completed', 'closed'],
  internship: ['new', 'pending', 'reviewed', 'selected', 'completed', 'rejected'],
  volunteer: ['pending', 'changes_requested', 'approved', 'rejected'],
  member: ['pending', 'changes_requested', 'approved', 'rejected'],
  donor: ['new', 'contacted', 'completed'],
  contact: ['new', 'contacted', 'closed'],
  interest: ['new', 'contacted', 'approved', 'rejected', 'closed'],
};

const deleteEndpoints = (kind, id) => {
  const safeId = encodeURIComponent(id);
  if (kind === 'contact') return [`${API_BASE_URL}/api/admin/contacts/${safeId}/delete`, `${API_BASE_URL}/api/admin/contacts/${safeId}`];
  if (kind === 'internship') return [`${API_BASE_URL}/api/admin/internships/${safeId}/delete`, `${API_BASE_URL}/api/admin/internships/${safeId}`];
  if (kind === 'volunteer') return [null, ENDPOINTS.ADMIN_DELETE_VOLUNTEER(id)];
  if (kind === 'member') return [null, ENDPOINTS.ADMIN_DELETE_MEMBER(id)];
  if (kind === 'donor') return [null, ENDPOINTS.ADMIN_DELETE_DONOR(id)];
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
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const pageSize = 20;

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
      setData({ contacts: Array.isArray(contacts) ? contacts : [], internships: Array.isArray(internships) ? internships : [], interests: Array.isArray(interests) ? interests : [], volunteers: Array.isArray(volunteers) ? volunteers : [], members: Array.isArray(members) ? members : [], donors: Array.isArray(donors) ? donors : [] });
    } catch (e) { setError(e.message || 'Unable to load applications.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const records = useMemo(() => {
    const contacts = data.contacts.map(x => ({ ...x, kind: 'contact', title: `${x.firstName || ''} ${x.lastName || ''}`.trim(), subtitle: x.email, detail: 'Contact inquiry', date: x.createdAt }));
    const internships = data.internships.map(x => ({ ...x, kind: 'internship', title: x.fullName, subtitle: x.email, detail: `${x.college || '—'} • ${x.course || '—'} • ${x.internshipType || 'Internship'} • ${x.duration || '—'}`, date: x.createdAt, applicationId: x.internId || `Application ${x.id}`, photoUrl: fileUrl(x.profilePhotoUrl || x.profilePhotoPath), idDocumentUrl: fileUrl(x.idDocumentUrl || x.idDocumentPath), resumeUrl: fileUrl(x.resumeUrl || x.resumePath), proofType: x.idType, proofNumber: x.identityNumber }));
    const volunteers = data.volunteers.map(x => ({ ...x, kind: 'volunteer', title: x.fullName, subtitle: x.email, detail: `Volunteer • ${x.volunteerType || 'General Volunteer'} • ${x.position || 'General Volunteer'} • ${x.phone || '—'}`, date: x.submittedAt || x.createdAt, applicationId: x.volunteerId || `Record ${x.id}`, photoUrl: fileUrl(x.profilePhotoPath), idDocumentUrl: fileUrl(x.idDocumentUrl || x.idDocumentPath), proofType: x.idType, proofNumber: x.identityNumber }));
    const members = data.members.map(x => ({ ...x, kind: 'member', title: x.fullName, subtitle: x.email, detail: `Membership • ${x.memberType || 'Member'} • ${x.phone || '—'}`, date: x.createdAt, applicationId: x.memberId || `Account ${x.id}`, photoUrl: fileUrl(x.profilePhotoPath), idDocumentUrl: fileUrl(x.idDocumentPath), proofType: x.idProofType, proofNumber: x.identityNumber }));
    const donors = data.donors.map(x => ({ ...x, kind: 'donor', title: x.fullName, subtitle: x.email, detail: `Donation • ${x.donationPurpose || 'General'} • Amount: ${x.amount == null ? 'Not specified' : `₹${Number(x.amount).toFixed(2)}`} • ${x.phone || '—'}`, date: x.createdAt, applicationId: x.donorId || `Record ${x.id}`, photoUrl: fileUrl(x.profilePhotoUrl || x.profilePhotoPath), idDocumentUrl: fileUrl(x.idDocumentUrl || x.idDocumentPath), proofNumber: x.pan }));
    const interests = data.interests.map(x => ({ ...x, kind: x.interestType === 'volunteer' ? 'volunteer-interest' : x.interestType === 'member' ? 'member-interest' : 'interest', title: x.fullName, subtitle: x.email, detail: `${interestLabel(x.interestType)}${x.category ? ` • ${x.category}` : ''} • ${x.phone || '—'}`, date: x.createdAt }));
    return [...contacts, ...internships, ...volunteers, ...members, ...donors, ...interests].filter(x => tab === 'all' || x.kind === tab || (tab === 'interest' && ['interest', 'volunteer-interest', 'member-interest'].includes(x.kind))).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [data, tab]);

  // Search + status narrowing happen on the already-loaded rows, so filtering is
  // instant and never re-hits the API.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((record) => {
      if (statusFilter && String(record.status || '').toLowerCase() !== statusFilter) return false;
      if (!q) return true;
      const haystack = [record.title, record.subtitle, record.phone, record.detail, record.applicationId, record.proofNumber, record.message, record.notes, record.reviewNote].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [records, query, statusFilter]);

  useEffect(() => { setPage(1); }, [tab, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const updateStatus = async (record, status) => {
    const token = localStorage.getItem(TOKEN_KEY);
    let endpoint = null;
    if (record.kind === 'contact') endpoint = ENDPOINTS.ADMIN_CONTACT_STATUS(record.id);
    else if (record.kind === 'internship') endpoint = ENDPOINTS.ADMIN_INTERNSHIP_STATUS(record.id);
    else if (record.kind === 'volunteer') endpoint = ENDPOINTS.ADMIN_VOLUNTEER_STATUS(record.id);
    else if (record.kind === 'member') endpoint = ENDPOINTS.ADMIN_MEMBER_STATUS(record.id);
    else if (record.kind === 'interest' || record.kind === 'volunteer-interest' || record.kind === 'member-interest') endpoint = ENDPOINTS.ADMIN_INTEREST_STATUS(record.id);
    if (!endpoint) return;
    // A correction request must carry the reason, so it reaches the applicant's dashboard.
    let reviewNote;
    if (status === 'changes_requested') {
      reviewNote = window.prompt(`What correction is needed from ${record.title}?\n\nThis note is shown to the applicant in their dashboard.`);
      if (reviewNote === null) return;
      if (!reviewNote.trim()) { setError('A short correction note is required so the applicant knows what to fix.'); return; }
    }
    setBusy(`${record.kind}-${record.id}`); setError('');
    try {
      const response = await fetch(endpoint, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(reviewNote !== undefined ? { status, reviewNote } : { status }) });
      if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); return; }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to update status.');
      await load();
    } catch (e) { setError(e.message || 'Unable to update status.'); }
    finally { setBusy(''); }
  };

  const editRecord = async (record) => {
    const endpoint = record.kind === 'volunteer' ? ENDPOINTS.ADMIN_UPDATE_VOLUNTEER(record.id) : record.kind === 'member' ? ENDPOINTS.ADMIN_UPDATE_MEMBER(record.id) : null;
    if (!endpoint) return;
    const fullName = window.prompt('Edit full name:', record.title || '');
    if (fullName === null) return;
    const phone = window.prompt('Edit mobile number:', record.phone || '');
    if (phone === null) return;
    const message = window.prompt('Edit message / notes:', record.message || '');
    if (message === null) return;
    if (fullName.trim().length < 3) { setError('Full name must be at least 3 characters.'); return; }
    setBusy(`${record.kind}-${record.id}`); setError('');
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(endpoint, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName: fullName.trim(), phone: phone.trim(), message: message.trim() }) });
      if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); return; }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to update the record.');
      await load();
    } catch (e) { setError(e.message || 'Unable to update the record.'); }
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

  const counts = { contact: data.contacts.length, internship: data.internships.length, volunteer: data.volunteers.length + data.interests.filter(x => x.interestType === 'volunteer').length, member: data.members.length + data.interests.filter(x => x.interestType === 'member').length, donor: data.donors.length, interest: data.interests.filter(x => !['volunteer', 'member'].includes(x.interestType)).length };

  const statusOptions = record => {
    if (record.kind === 'internship') return <><option value="new">New</option><option value="pending">Pending</option><option value="reviewed">Reviewed</option><option value="selected">Selected — Issue ID & Letter</option><option value="completed">Completed — Issue Certificate</option><option value="rejected">Rejected</option></>;
    if (record.kind === 'volunteer' || record.kind === 'member') return <><option value="pending">Pending</option><option value="changes_requested">Changes Requested — ask for correction</option><option value="approved">Approved — Issue ID</option><option value="rejected">Rejected</option></>;
    if (record.kind === 'donor') return <><option value="new">New</option><option value="contacted">Contacted</option><option value="completed">Completed</option></>;
    if (['interest', 'volunteer-interest', 'member-interest'].includes(record.kind)) return <><option value="new">New</option><option value="contacted">Contacted</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="closed">Closed</option></>;
    if (record.kind === 'contact') return <><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></>;
    return null;
  };

  return <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden">
    <div className="p-6 md:p-8 border-b border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-[#176447]">Application Records</p><h2 className="text-2xl font-black text-[#12345A] mt-1">Applications &amp; Participation</h2><p className="text-sm text-zinc-500 mt-1">Every submission made through the User Portal or public forms is shown here. Search, filter, open a record and update its status.</p></div><button onClick={load} className="px-4 py-2 rounded-xl bg-zinc-100 font-bold text-sm">Refresh</button></div>
    <div className="px-6 md:px-8 pt-5 flex flex-wrap gap-2">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${tab === id ? 'bg-[#12345A] text-white' : 'bg-zinc-100 text-zinc-600'}`}><Icon />{label}{id !== 'all' && <span className="opacity-70">({counts[id] || 0})</span>}</button>)}</div>
    <div className="px-6 md:px-8 pt-4 flex flex-col sm:flex-row gap-2">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone, ID…" className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" aria-label="Search applications" />
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-[#12345A]" aria-label="Filter by status">
        <option value="">All statuses</option>
        {(STATUS_CHOICES[tab] || STATUS_CHOICES.all).map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
      </select>
    </div>
    {error && <div className="mx-6 md:mx-8 mt-5 p-4 rounded-xl bg-red-50 text-red-700 font-semibold text-sm">{error}</div>}
    <div className="p-6 md:p-8 pt-5 overflow-x-auto">{loading ? <div className="py-12 text-center text-zinc-400">Loading applications…</div> : pageRows.length === 0 ? <div className="py-12 text-center text-zinc-400">{filtered.length === 0 && (query || statusFilter) ? 'No record matches your search or filter.' : 'No submissions found.'}</div> : <table className="w-full text-left min-w-[1200px]"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-5 py-4">Applicant</th><th className="px-5 py-4">Type / Category</th><th className="px-5 py-4">Submitted</th><th className="px-5 py-4">Status / Action</th><th className="px-5 py-4">Message / Information</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{pageRows.map(record => { const canDelete = deleteEndpoints(record.kind === 'volunteer-interest' || record.kind === 'member-interest' ? 'interest' : record.kind, record.id); return <tr key={`${record.kind}-${record.id}`} className="align-top"><td className="px-5 py-5"><button type="button" onClick={() => setDetail(record)} className="font-bold text-[#12345A] text-left hover:text-[#176447] underline decoration-dotted">{record.title}</button><p className="text-xs text-zinc-500 mt-1">{record.subtitle}</p>{record.phone && <p className="text-xs text-zinc-500">{record.phone}</p>}<button type="button" onClick={() => setDetail(record)} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#EAF0F6] text-[#12345A] px-2.5 py-1.5 text-[11px] font-black"><FaEye /> View details</button></td><td className="px-5 py-5"><p className="font-bold">{record.kind === 'donor' ? 'Donor' : record.kind === 'interest' || record.kind === 'volunteer-interest' || record.kind === 'member-interest' ? interestLabel(record.interestType) : record.kind}</p><p className="text-xs text-zinc-500 mt-1 max-w-[320px]">{record.detail}</p>{record.applicationId && <p className="text-xs font-bold text-[#12345A] mt-2">{record.applicationId}</p>}{record.proofType && <p className="text-xs text-zinc-500 mt-1">ID proof: <span className="font-semibold">{record.proofType}</span>{record.proofNumber ? ` • ${record.proofNumber}` : ''}</p>}{!record.proofType && record.proofNumber && <p className="text-xs text-zinc-500 mt-1">PAN: <span className="font-semibold">{record.proofNumber}</span></p>}<div className="flex flex-wrap items-center gap-3 mt-2">{record.photoUrl && <img src={record.photoUrl} alt={`${record.title || 'Applicant'} profile photo`} className="h-12 w-12 rounded-lg object-cover border border-zinc-200" />}{record.idDocumentUrl && <a href={record.idDocumentUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700 inline-block">Open ID Document</a>}{record.resumeUrl && <a href={record.resumeUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700 inline-block">Open Resume</a>}</div></td><td className="px-5 py-5 whitespace-nowrap text-xs text-zinc-600">{dateText(record.date)}</td><td className="px-5 py-5"><div className="flex flex-col gap-2">{statusOptions(record) ? <select disabled={busy === `${record.kind}-${record.id}`} value={record.status || ''} onChange={e => updateStatus(record, e.target.value)} className="rounded-lg border border-zinc-200 px-2 py-2 text-xs font-bold">{statusOptions(record)}</select> : <span className="inline-flex w-fit rounded-lg bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-700">{record.status || 'Submitted'}</span>}{(record.kind === 'volunteer' || record.kind === 'member') && <button onClick={() => editRecord(record)} disabled={!!busy} className="inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-xl font-bold text-xs"><FaPen />{busy === `${record.kind}-${record.id}` ? 'Working…' : 'Edit'}</button>}{canDelete && <button onClick={() => deleteRecord(record)} disabled={!!busy} className="inline-flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-xl font-bold text-xs"><FaTrash />{busy === `${record.kind}-${record.id}` ? 'Working…' : 'Delete Permanently'}</button>}</div></td><td className="px-5 py-5 max-w-[380px] text-xs leading-5 text-zinc-600">{record.reviewNote && <span className="block mb-1 rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 font-semibold text-amber-800">Correction asked: {record.reviewNote}</span>}{record.message || record.notes || '—'}</td></tr>; })}</tbody></table>}</div>
    {!loading && filtered.length > 0 && <div className="px-6 md:px-8 pb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-zinc-500">Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} record{filtered.length === 1 ? '' : 's'}</p><div className="flex gap-2"><button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold disabled:opacity-40">Previous</button><span className="px-3 py-2 text-sm font-bold text-zinc-500">Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)} className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold disabled:opacity-40">Next</button></div></div>}
    {detail && <RecordDrawer record={detail} onClose={() => setDetail(null)} onStatus={(status) => { updateStatus(detail, status); setDetail(null); }} onEdit={() => { setDetail(null); editRecord(detail); }} onDelete={() => { setDetail(null); deleteRecord(detail); }} canDelete={!!deleteEndpoints(detail.kind === 'volunteer-interest' || detail.kind === 'member-interest' ? 'interest' : detail.kind, detail.id)} />}
  </section>;
}

function RecordDrawer({ record, onClose, onStatus, onEdit, onDelete, canDelete }) {
  const rows = [
    ['Type', record.kind === 'donor' ? 'Donor' : ['interest', 'volunteer-interest', 'member-interest'].includes(record.kind) ? interestLabel(record.interestType) : record.kind],
    ['Email', record.subtitle],
    ['Phone', record.phone],
    ['Detail', record.detail],
    ['Reference', record.applicationId],
    ['ID proof', record.proofType ? `${record.proofType}${record.proofNumber ? ` • ${record.proofNumber}` : ''}` : record.proofNumber],
    ['Submitted', dateText(record.date)],
    ['Status', record.status],
    ['Review note', record.reviewNote],
    ['Message', record.message || record.notes],
  ].filter(([, value]) => value);

  return (
    <div className="fixed inset-0 z-[130] flex justify-end" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close details" onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <aside className="relative w-full max-w-xl h-full bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-zinc-100 p-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#176447]">Record detail</p>
            <h3 className="text-xl font-black text-[#12345A] mt-0.5">{record.title || 'Record'}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl bg-zinc-100 px-3 py-2 text-sm font-bold">Close</button>
        </div>
        <div className="p-5 space-y-5">
          {record.photoUrl && <img src={record.photoUrl} alt="Profile" className="h-24 w-24 rounded-2xl object-cover border border-zinc-200" />}
          <dl className="space-y-3">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-[#FAFBFC] border border-zinc-100 p-3">
                <dt className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</dt>
                <dd className="text-sm font-semibold text-[#12345A] mt-1 break-words">{String(value)}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-2">
            {record.idDocumentUrl && <a href={record.idDocumentUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#EAF0F6] text-[#12345A] px-4 py-2.5 text-sm font-bold">Open ID document</a>}
            {record.resumeUrl && <a href={record.resumeUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#EAF0F6] text-[#12345A] px-4 py-2.5 text-sm font-bold">Open resume</a>}
            {record.receiptUrl && <a href={record.receiptUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#EAF0F6] text-[#12345A] px-4 py-2.5 text-sm font-bold">Open receipt</a>}
          </div>
          <div className="border-t border-zinc-100 pt-5 space-y-3">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Set status</label>
              <select value={record.status || ''} onChange={(e) => onStatus(e.target.value)} className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold">
                {STATUS_CHOICES.all.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {(record.kind === 'volunteer' || record.kind === 'member') && <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-bold"><FaPen /> Edit details</button>}
              {canDelete && <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-2.5 text-sm font-bold"><FaTrash /> Delete permanently</button>}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
