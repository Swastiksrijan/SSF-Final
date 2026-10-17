import { useEffect, useMemo, useState } from 'react';
import { FaBan, FaBriefcase, FaCertificate, FaEnvelope, FaEye, FaHandshake, FaHandsHelping, FaHeart, FaIdCard, FaPen, FaPowerOff, FaRedo, FaTrash, FaUsers } from 'react-icons/fa';
import { API_BASE_URL, ENDPOINTS } from '../config/api';
import { generateCertificate, generateIdentityCard } from '../utils/generateCertificate';

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

const editEndpoints = (kind, id) => {
  if (kind === 'volunteer') return ENDPOINTS.ADMIN_UPDATE_VOLUNTEER(id);
  if (kind === 'member') return ENDPOINTS.ADMIN_UPDATE_MEMBER(id);
  if (kind === 'donor') return ENDPOINTS.ADMIN_UPDATE_DONOR(id);
  if (kind === 'internship') return ENDPOINTS.ADMIN_UPDATE_INTERNSHIP(id);
  if (kind === 'contact') return ENDPOINTS.ADMIN_UPDATE_CONTACT(id);
  if (kind === 'interest' || kind === 'volunteer-interest' || kind === 'member-interest') return ENDPOINTS.ADMIN_UPDATE_INTEREST(id);
  return null;
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

// The fields each record type exposes for editing. An issued ID number is
// editable here too — an admin must be able to correct a number or give a
// person the offline number they already hold. The approve / re-issue / revoke
// buttons stay for minting a fresh number automatically.
const EDIT_FIELDS = {
  volunteer: [
    { name: 'fullName', label: 'Full name', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Mobile number' },
    { name: 'volunteerType', label: 'Volunteer type', type: 'select', options: [['field', 'Field Volunteer'], ['program', 'Program Volunteer'], ['professional', 'Professional Volunteer'], ['digital', 'Digital / Online Volunteer']] },
    { name: 'position', label: 'Position / role' },
    { name: 'volunteerId', label: 'Volunteer ID (leave blank to clear)', placeholder: 'SSF-VOL-2510-0001' },
    { name: 'idType', label: 'ID proof type', type: 'select', options: [['', '—'], ['Aadhaar Card', 'Aadhaar Card'], ['PAN Card', 'PAN Card'], ['Voter ID', 'Voter ID'], ['Driving Licence', 'Driving Licence'], ['Passport', 'Passport'], ['College / Student ID', 'College / Student ID'], ['Other Government ID', 'Other Government ID']] },
    { name: 'identityNumber', label: 'ID number' },
    { name: 'idValidFrom', label: 'ID valid from', type: 'date' },
    { name: 'idValidTill', label: 'ID valid till', type: 'date' },
    { name: 'idActive', label: 'ID card active', type: 'boolean-select', options: [['', '—'], ['true', 'Active'], ['false', 'Inactive (stops verifying)']] },
    { name: 'message', label: 'Message / notes', type: 'textarea' },
  ],
  member: [
    { name: 'fullName', label: 'Full name', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Mobile number' },
    { name: 'memberType', label: 'Membership role', type: 'select', options: [['website_signup', 'Website account (no role yet)'], ['general', 'General Member'], ['active', 'Active Member'], ['life', 'Life Member'], ['advisory', 'Advisory / Expert Member']] },
    { name: 'memberId', label: 'Member ID (leave blank to clear)', placeholder: 'SSF-MBR-00019', registerPicker: true },
    { name: 'designation', label: 'Designation / post' },
    { name: 'guardianName', label: "Father's / guardian's name" },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'pinCode', label: 'PIN code' },
    { name: 'joiningDate', label: 'Joining date', type: 'date' },
    { name: 'paymentStatus', label: 'Membership fee', type: 'select', options: [['', '—'], ['pending', 'Pending'], ['paid', 'Received / paid'], ['not_required', 'Not required (honorary)'], ['failed', 'Failed']] },
    { name: 'paymentMode', label: 'Fee payment mode', placeholder: 'UPI / cash / bank transfer' },
    { name: 'paymentReference', label: 'Fee reference / receipt no.' },
    { name: 'idProofType', label: 'ID proof type', type: 'select', options: [['', '—'], ['Aadhaar Card', 'Aadhaar Card'], ['PAN Card', 'PAN Card'], ['Voter ID', 'Voter ID'], ['Driving Licence', 'Driving Licence'], ['Passport', 'Passport'], ['Other Government ID', 'Other Government ID']] },
    { name: 'identityNumber', label: 'ID number' },
    { name: 'idValidFrom', label: 'ID valid from', type: 'date' },
    { name: 'idValidTill', label: 'ID valid till', type: 'date' },
    { name: 'idActive', label: 'ID card active', type: 'boolean-select', options: [['', '—'], ['true', 'Active'], ['false', 'Inactive (stops verifying)']] },
    { name: 'message', label: 'Message / notes', type: 'textarea' },
  ],
  donor: [
    { name: 'fullName', label: 'Full name', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Mobile number' },
    { name: 'donorId', label: 'Donor ID (leave blank to clear)', placeholder: 'SSF-DON-2510-0001' },
    { name: 'city', label: 'City' },
    { name: 'state', label: 'State' },
    { name: 'donationPurpose', label: 'Donation purpose' },
    { name: 'amount', label: 'Amount (₹)', type: 'number' },
    { name: 'pan', label: 'PAN' },
    { name: 'paymentMode', label: 'Payment mode' },
    { name: 'paymentStatus', label: 'Payment status', type: 'select', options: [['pending', 'Pending'], ['paid', 'Paid'], ['offline', 'Offline (bank/UPI)'], ['failed', 'Failed']] },
    { name: 'idValidFrom', label: 'ID valid from', type: 'date' },
    { name: 'idValidTill', label: 'ID valid till', type: 'date' },
    { name: 'idActive', label: 'ID card active', type: 'boolean-select', options: [['', '—'], ['true', 'Active'], ['false', 'Inactive (stops verifying)']] },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ],
  internship: [
    { name: 'fullName', label: 'Full name', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Mobile number' },
    { name: 'college', label: 'College' },
    { name: 'course', label: 'Course' },
    { name: 'internshipType', label: 'Internship area' },
    { name: 'duration', label: 'Duration' },
    { name: 'startDate', label: 'Start date', type: 'date' },
    { name: 'message', label: 'Message / notes', type: 'textarea' },
  ],
  contact: [
    { name: 'firstName', label: 'First name', required: true },
    { name: 'lastName', label: 'Last name' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone' },
    { name: 'message', label: 'Message', type: 'textarea' },
  ],
  interest: [
    { name: 'fullName', label: 'Full name', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone' },
    { name: 'category', label: 'Category' },
    { name: 'message', label: 'Message', type: 'textarea' },
  ],
};

const editKind = (kind) => (['volunteer-interest', 'member-interest'].includes(kind) ? 'interest' : kind);

// A website account that has not submitted a membership application yet. It is
// stored as memberType 'website_signup', so it must be told apart from a real
// membership everywhere the admin acts on it. Holding an official member
// number outranks the marker: a registered member keeps their card even if the
// old column was never updated.
const isAccountOnlyMember = (record) => !String(record?.memberId || '').trim() && (String(record?.memberType || '').toLowerCase() === 'website_signup' || String(record?.message || '').toLowerCase() === 'signup from website');

// A short human label for the state of an issued card: on, off, or expired.
const idStateBadge = (record) => {
  if (record.idActive === false) return { text: 'ID inactive', className: 'bg-amber-100 text-amber-800' };
  const today = new Date().toISOString().slice(0, 10);
  if (record.idValidTill && String(record.idValidTill).slice(0, 10) < today) return { text: 'ID expired', className: 'bg-red-100 text-red-700' };
  return null;
};

// An official ID exists once the record has been approved and given a number.
const issuedId = (record) => ['volunteer', 'member'].includes(record.kind) && record.status === 'approved' && !!record.applicationId && !String(record.applicationId).startsWith('Record ') && !String(record.applicationId).startsWith('Account ');
const isDonorIssued = (record) => record.kind === 'donor' && ['paid', 'offline'].includes(String(record.paymentStatus || '').toLowerCase());

export default function AdminApplicationDashboard() {
  const [data, setData] = useState({ contacts: [], internships: [], interests: [], volunteers: [], members: [], donors: [] });
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [busy, setBusy] = useState('');
  const [editTarget, setEditTarget] = useState(null);
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
        // includeAccounts=true keeps the people who signed up for a website
        // account but have not chosen a membership role yet. Without it the API
        // hides them and the admin can never assign them a role or an ID.
        fetch(`${ENDPOINTS.ADMIN_MEMBERS}?includeAccounts=true`, { headers }),
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
    const volunteers = data.volunteers.map(x => ({ ...x, kind: 'volunteer', title: x.fullName, subtitle: x.email, detail: `Volunteer • ${x.volunteerType || 'General Volunteer'} • ${x.position || 'General Volunteer'} • ${x.phone || '—'}`, date: x.submittedAt || x.createdAt, applicationId: x.volunteerId || `Record ${x.id}`, certificateId: x.certId, idActive: x.idActive, idValidFrom: x.idValidFrom, idValidTill: x.idValidTill, photoUrl: fileUrl(x.profilePhotoPath), idDocumentUrl: fileUrl(x.idDocumentUrl || x.idDocumentPath), proofType: x.idType, proofNumber: x.identityNumber }));
    const members = data.members.map(x => {
      const accountOnly = isAccountOnlyMember(x);
      return { ...x, kind: 'member', title: x.fullName, subtitle: x.email, detail: accountOnly ? `Website account • no membership role yet • ${x.phone || '—'}` : `Membership • ${x.memberType || 'Member'}${x.designation ? ` • ${x.designation}` : ''} • ${x.phone || '—'}`, date: x.createdAt, applicationId: x.memberId || (accountOnly ? 'Account only' : `Account ${x.id}`), accountOnly, certificateId: x.certId, idActive: x.idActive, idValidFrom: x.idValidFrom, idValidTill: x.idValidTill, photoUrl: fileUrl(x.profilePhotoPath || x.profilePhotoData), idDocumentUrl: fileUrl(x.idDocumentPath), proofType: x.idProofType, proofNumber: x.identityNumber };
    });
    const donors = data.donors.map(x => ({ ...x, kind: 'donor', title: x.fullName, subtitle: x.email, detail: `Donation • ${x.donationPurpose || 'General'} • Amount: ${x.amount == null ? 'Not specified' : `₹${Number(x.amount).toFixed(2)}`} • ${x.phone || '—'}`, date: x.createdAt, applicationId: x.donorId || `Record ${x.id}`, certificateId: x.certId, idActive: x.idActive, idValidFrom: x.idValidFrom, idValidTill: x.idValidTill, photoUrl: fileUrl(x.profilePhotoUrl || x.profilePhotoPath), idDocumentUrl: fileUrl(x.idDocumentUrl || x.idDocumentPath), proofNumber: x.pan }));
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

  const openEdit = (record) => setEditTarget(record);

  const saveEdit = async (record, values) => {
    const kind = editKind(record.kind);
    const endpoint = editEndpoints(kind, record.id);
    if (!endpoint) return;
    setBusy(`${record.kind}-${record.id}`); setError('');
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(endpoint, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); return; }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to update the record.');
      setEditTarget(null);
      await load();
    } catch (e) { setError(e.message || 'Unable to update the record.'); }
    finally { setBusy(''); }
  };

  // Re-issue mints a fresh official ID number for an approved record.
  const reissueIds = async (record) => {
    const endpoint = record.kind === 'volunteer' ? ENDPOINTS.ADMIN_REISSUE_VOLUNTEER(record.id) : record.kind === 'member' ? ENDPOINTS.ADMIN_REISSUE_MEMBER(record.id) : null;
    if (!endpoint) return;
    if (!window.confirm(`Re-issue a new ID number for ${record.title}?\n\nThe previous ID card and certificate will stop verifying.`)) return;
    setBusy(`${record.kind}-${record.id}`); setError('');
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); return; }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to re-issue the ID.');
      await load();
    } catch (e) { setError(e.message || 'Unable to re-issue the ID.'); }
    finally { setBusy(''); }
  };

  // Revoke clears the issued IDs and rejects the record, so the old card and
  // certificate stop verifying immediately.
  const revokeIds = async (record) => {
    const endpoint = record.kind === 'volunteer' ? ENDPOINTS.ADMIN_REVOKE_VOLUNTEER(record.id) : record.kind === 'member' ? ENDPOINTS.ADMIN_REVOKE_MEMBER(record.id) : null;
    if (!endpoint) return;
    if (!window.confirm(`Revoke the issued IDs for ${record.title}?\n\nThe ID card and certificate will stop verifying. This cannot be undone.`)) return;
    setBusy(`${record.kind}-${record.id}`); setError('');
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); return; }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to revoke the IDs.');
      await load();
    } catch (e) { setError(e.message || 'Unable to revoke the IDs.'); }
    finally { setBusy(''); }
  };

  // Switch an issued ID card on or off. Unlike revoke this keeps the number and
  // the record, so the person is not removed — only the card stops verifying.
  const toggleIdActive = async (record) => {
    const endpoint = record.kind === 'member' ? ENDPOINTS.ADMIN_MEMBER_ID_STATUS(record.id) : record.kind === 'volunteer' ? ENDPOINTS.ADMIN_VOLUNTEER_ID_STATUS(record.id) : record.kind === 'donor' ? ENDPOINTS.ADMIN_DONOR_ID_STATUS(record.id) : null;
    if (!endpoint) return;
    const next = record.idActive === false;
    if (!window.confirm(next ? `Activate the ID card for ${record.title}? It will verify again.` : `Deactivate the ID card for ${record.title}?\n\nThe number is kept, but the card stops verifying until it is switched back on.`)) return;
    setBusy(`${record.kind}-${record.id}`); setError('');
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ idActive: next }) });
      if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); return; }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Unable to change the ID card status.');
      await load();
    } catch (e) { setError(e.message || 'Unable to change the ID card status.'); }
    finally { setBusy(''); }
  };

  // Admins can download the same ID card / certificate PDF the applicant sees,
  // so a lost document can be replaced without the member logging in.
  const downloadIdCard = async (record) => {
    try {
      const role = record.kind === 'member' ? 'member' : record.kind === 'donor' ? 'donor' : (record.volunteerType || 'volunteer');
      await generateIdentityCard({ name: record.title, role, date: dateText(record.date), officialId: record.applicationId, certId: record.certificateId, photoUrl: record.photoUrl, validFrom: record.idValidFrom, validTill: record.idValidTill, active: record.idActive !== false });
    } catch (e) { setError(e.message || 'Unable to generate the ID card.'); }
  };
  const downloadCertificate = async (record) => {
    try {
      const role = record.kind === 'member' ? 'member' : record.kind === 'donor' ? 'donor' : (record.volunteerType || 'volunteer');
      const type = record.kind === 'donor' ? 'Appreciation' : record.kind === 'member' ? 'Membership' : 'Participation';
      await generateCertificate(record.title, role, dateText(record.date), record.certificateId || record.applicationId, record.applicationId, type);
    } catch (e) { setError(e.message || 'Unable to generate the certificate.'); }
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
    <div className="p-6 md:p-8 pt-5 overflow-x-auto">{loading ? <div className="py-12 text-center text-zinc-400">Loading applications…</div> : pageRows.length === 0 ? <div className="py-12 text-center text-zinc-400">{filtered.length === 0 && (query || statusFilter) ? 'No record matches your search or filter.' : 'No submissions found.'}</div> : <table className="w-full text-left min-w-[1200px]"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-5 py-4">Applicant</th><th className="px-5 py-4">Type / Category</th><th className="px-5 py-4">Submitted</th><th className="px-5 py-4">Status / Action</th><th className="px-5 py-4">Message / Information</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{pageRows.map(record => { const canDelete = deleteEndpoints(record.kind === 'volunteer-interest' || record.kind === 'member-interest' ? 'interest' : record.kind, record.id); return <tr key={`${record.kind}-${record.id}`} className="align-top"><td className="px-5 py-5"><button type="button" onClick={() => setDetail(record)} className="font-bold text-[#12345A] text-left hover:text-[#176447] underline decoration-dotted">{record.title}</button><p className="text-xs text-zinc-500 mt-1">{record.subtitle}</p>{record.phone && <p className="text-xs text-zinc-500">{record.phone}</p>}<button type="button" onClick={() => setDetail(record)} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#EAF0F6] text-[#12345A] px-2.5 py-1.5 text-[11px] font-black"><FaEye /> View details</button></td><td className="px-5 py-5"><p className="font-bold">{record.kind === 'donor' ? 'Donor' : record.kind === 'interest' || record.kind === 'volunteer-interest' || record.kind === 'member-interest' ? interestLabel(record.interestType) : record.kind}</p><p className="text-xs text-zinc-500 mt-1 max-w-[320px]">{record.detail}</p>{record.accountOnly && <span className="inline-flex mt-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-800">Account only — no role yet</span>}{record.applicationId && <p className="text-xs font-bold text-[#12345A] mt-2">{record.applicationId}</p>}{(() => { const badge = idStateBadge(record); return badge ? <span className={`inline-flex mt-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${badge.className}`}>{badge.text}</span> : null; })()}{record.idValidTill && <p className="text-[11px] text-zinc-500 mt-1">Valid till {String(record.idValidTill).slice(0, 10)}</p>}{record.proofType && <p className="text-xs text-zinc-500 mt-1">ID proof: <span className="font-semibold">{record.proofType}</span>{record.proofNumber ? ` • ${record.proofNumber}` : ''}</p>}{!record.proofType && record.proofNumber && <p className="text-xs text-zinc-500 mt-1">PAN: <span className="font-semibold">{record.proofNumber}</span></p>}<div className="flex flex-wrap items-center gap-3 mt-2">{record.photoUrl && <img src={record.photoUrl} alt={`${record.title || 'Applicant'} profile photo`} className="h-12 w-12 rounded-lg object-cover border border-zinc-200" />}{record.idDocumentUrl && <a href={record.idDocumentUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700 inline-block">Open ID Document</a>}{record.resumeUrl && <a href={record.resumeUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700 inline-block">Open Resume</a>}</div></td><td className="px-5 py-5 whitespace-nowrap text-xs text-zinc-600">{dateText(record.date)}</td><td className="px-5 py-5"><div className="flex flex-col gap-2">{statusOptions(record) ? <select disabled={busy === `${record.kind}-${record.id}`} value={record.status || ''} onChange={e => updateStatus(record, e.target.value)} className="rounded-lg border border-zinc-200 px-2 py-2 text-xs font-bold">{statusOptions(record)}</select> : <span className="inline-flex w-fit rounded-lg bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-700">{record.status || 'Submitted'}</span>}{(EDIT_FIELDS[editKind(record.kind)]) && <button onClick={() => openEdit(record)} disabled={!!busy} className="inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-xl font-bold text-xs"><FaPen />{busy === `${record.kind}-${record.id}` ? 'Working…' : 'Edit'}</button>}{issuedId(record) || isDonorIssued(record) ? <div className="flex flex-wrap gap-2 pt-1"><button onClick={() => downloadIdCard(record)} className="inline-flex items-center gap-1.5 bg-[#12345A] text-white px-3 py-2 rounded-xl font-bold text-xs"><FaIdCard /> ID Card</button><button onClick={() => downloadCertificate(record)} className="inline-flex items-center gap-1.5 bg-[#176447] text-white px-3 py-2 rounded-xl font-bold text-xs"><FaCertificate /> Certificate</button>{(record.kind === 'member' || record.kind === 'volunteer') && <button onClick={() => reissueIds(record)} className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-2 rounded-xl font-bold text-xs"><FaRedo /> Re-issue</button>}{(record.kind === 'member' || record.kind === 'volunteer') && <button onClick={() => revokeIds(record)} className="inline-flex items-center gap-1.5 bg-zinc-800 text-white px-3 py-2 rounded-xl font-bold text-xs"><FaBan /> Revoke</button>}<button onClick={() => toggleIdActive(record)} disabled={!!busy} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs ${record.idActive === false ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}><FaPowerOff />{record.idActive === false ? 'Activate ID' : 'Deactivate ID'}</button></div> : null}{canDelete && <button onClick={() => deleteRecord(record)} disabled={!!busy} className="inline-flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 px-3 py-2 rounded-xl font-bold text-xs"><FaTrash />{busy === `${record.kind}-${record.id}` ? 'Working…' : 'Delete Permanently'}</button>}</div></td><td className="px-5 py-5 max-w-[380px] text-xs leading-5 text-zinc-600">{record.reviewNote && <span className="block mb-1 rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 font-semibold text-amber-800">Correction asked: {record.reviewNote}</span>}{record.message || record.notes || '—'}</td></tr>; })}</tbody></table>}</div>
    {!loading && filtered.length > 0 && <div className="px-6 md:px-8 pb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-zinc-500">Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} record{filtered.length === 1 ? '' : 's'}</p><div className="flex gap-2"><button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold disabled:opacity-40">Previous</button><span className="px-3 py-2 text-sm font-bold text-zinc-500">Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)} className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-bold disabled:opacity-40">Next</button></div></div>}
    {detail && <RecordDrawer record={detail} onClose={() => setDetail(null)} onStatus={(status) => { updateStatus(detail, status); setDetail(null); }} onEdit={EDIT_FIELDS[editKind(detail.kind)] ? () => { const target = detail; setDetail(null); openEdit(target); } : null} onDelete={() => { setDetail(null); deleteRecord(detail); }} canDelete={!!deleteEndpoints(detail.kind === 'volunteer-interest' || detail.kind === 'member-interest' ? 'interest' : detail.kind, detail.id)} onIdCard={issuedId(detail) || isDonorIssued(detail) ? () => downloadIdCard(detail) : null} onCertificate={issuedId(detail) || isDonorIssued(detail) ? () => downloadCertificate(detail) : null} onReissue={['member', 'volunteer'].includes(detail.kind) && issuedId(detail) ? () => reissueIds(detail) : null} onRevoke={['member', 'volunteer'].includes(detail.kind) && issuedId(detail) ? () => revokeIds(detail) : null} onToggleActive={(issuedId(detail) || isDonorIssued(detail)) ? () => { const target = detail; toggleIdActive(target); } : null} idActive={detail.idActive} />}
    {editTarget && <EditModal record={editTarget} busy={busy === `${editTarget.kind}-${editTarget.id}`} onClose={() => setEditTarget(null)} onSave={saveEdit} />}
  </section>;
}

function RecordDrawer({ record, onClose, onStatus, onEdit, onDelete, canDelete, onIdCard, onCertificate, onReissue, onRevoke, onToggleActive, idActive }) {
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
          {(onIdCard || onCertificate || onReissue || onRevoke) && (
            <div className="border-t border-zinc-100 pt-5 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Official ID &amp; documents</p>
              <div className="flex flex-wrap gap-2">
                {onIdCard && <button type="button" onClick={onIdCard} className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] text-white px-4 py-2.5 text-sm font-bold"><FaIdCard /> Download ID card</button>}
                {onCertificate && <button type="button" onClick={onCertificate} className="inline-flex items-center gap-2 rounded-xl bg-[#176447] text-white px-4 py-2.5 text-sm font-bold"><FaCertificate /> Download certificate</button>}
                {onReissue && <button type="button" onClick={onReissue} className="inline-flex items-center gap-2 rounded-xl bg-amber-100 text-amber-800 px-4 py-2.5 text-sm font-bold"><FaRedo /> Re-issue new ID</button>}
                {onRevoke && <button type="button" onClick={onRevoke} className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 text-white px-4 py-2.5 text-sm font-bold"><FaBan /> Revoke issued IDs</button>}
              {onToggleActive && <button type="button" onClick={onToggleActive} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${idActive === false ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}><FaPowerOff /> {idActive === false ? 'Activate ID card' : 'Deactivate ID card'}</button>}
              </div>
            </div>
          )}
          <div className="border-t border-zinc-100 pt-5 space-y-3">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Set status</label>
              <select value={record.status || ''} onChange={(e) => onStatus(e.target.value)} className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold">
                {STATUS_CHOICES.all.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {onEdit && <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-bold"><FaPen /> Edit details</button>}
              {canDelete && <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-2.5 text-sm font-bold"><FaTrash /> Delete permanently</button>}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// A single modal replaces the old chain of window.prompt() calls, so an admin
// can see and correct every editable field of a record in one place.
const ID_FIELD_NAMES = ['memberId', 'volunteerId', 'donorId'];

function EditModal({ record, busy, onClose, onSave }) {
  const fields = EDIT_FIELDS[editKind(record.kind)] || [];
  const [values, setValues] = useState(() => {
    const initial = {};
    for (const field of fields) {
      const raw = record[field.name];
      initial[field.name] = field.type === 'boolean-select' ? (raw === false ? 'false' : raw === true ? 'true' : '') : raw ?? '';
    }
    return initial;
  });
  const [localError, setLocalError] = useState('');
  const [register, setRegister] = useState([]);

  // The offline register is only needed by the member modal, and only when a
  // number has to be picked by hand. It is fetched once, on open.
  const wantsRegister = fields.some((field) => field.registerPicker);
  useEffect(() => {
    if (!wantsRegister) return;
    const token = localStorage.getItem(TOKEN_KEY);
    fetch(ENDPOINTS.ADMIN_MEMBER_REGISTER, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => setRegister(Array.isArray(rows) ? rows.filter((row) => !row.claimed) : []))
      .catch(() => setRegister([]));
  }, [wantsRegister]);

  const submit = (event) => {
    event.preventDefault();
    const payload = {};
    for (const field of fields) {
      const raw = values[field.name];
      const text = typeof raw === 'string' ? raw.trim() : raw;
      if (field.required && !text) { setLocalError(`${field.label} is required.`); return; }
      if (field.type === 'boolean-select') {
        if (text !== '') payload[field.name] = text === 'true';
        continue;
      }
      // An ID field is allowed to be emptied — that is how a wrong number is
      // cleared. Other blank fields are simply left untouched.
      if (ID_FIELD_NAMES.includes(field.name)) { payload[field.name] = text; continue; }
      if (text !== '' && text !== null && text !== undefined) {
        // Send only what the admin actually changed. Posting an untouched field
        // back would wipe values the modal never showed (a stored payment mode,
        // for instance) and would re-send account-only markers on every save.
        const original = record[field.name];
        const normalizedOriginal = typeof original === 'string' ? original.trim() : original ?? '';
        if (text === normalizedOriginal) continue;
        payload[field.name] = field.type === 'number' ? Number(text) : text;
      }
    }
    setLocalError('');
    onSave(record, payload);
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close edit" onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <form onSubmit={submit} className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#176447]">Edit record</p>
        <h3 className="text-xl font-black text-[#12345A] mt-0.5">{record.title || 'Record'}</h3>
        <div className="mt-5 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={`edit-${field.name}`} className="text-xs font-black uppercase tracking-widest text-zinc-400">{field.label}</label>
              {field.type === 'select' || field.type === 'boolean-select' ? (
                <select id={`edit-${field.name}`} value={values[field.name] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold">
                  {field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea id={`edit-${field.name}`} rows={3} value={values[field.name] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
              ) : (
                <input id={`edit-${field.name}`} type={field.type || 'text'} placeholder={field.placeholder} value={values[field.name] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
              )}
              {field.registerPicker && register.length > 0 && (
                <select
                  aria-label="Pick a register number"
                  value=""
                  onChange={(e) => { if (e.target.value) setValues((v) => ({ ...v, [field.name]: e.target.value })); }}
                  className="mt-2 w-full rounded-xl border border-dashed border-[#176447] bg-[#F1F8F4] px-4 py-2.5 text-sm font-semibold text-[#12345A]"
                >
                  <option value="">Or pick an unclaimed register number…</option>
                  {register.map((row) => <option key={row.memberId} value={row.memberId}>{row.memberId} — {row.name}{row.designation ? ` (${row.designation})` : ''}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
        {localError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">{localError}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-bold">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-xl bg-[#12345A] text-white px-5 py-2.5 text-sm font-bold disabled:opacity-50">{busy ? 'Saving…' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  );
}
