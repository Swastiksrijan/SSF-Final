import { useEffect, useMemo, useState } from 'react';
import { FaBriefcase, FaEnvelope, FaHandshake, FaUsers } from 'react-icons/fa';
import { API_BASE_URL, ENDPOINTS } from '../config/api';

const TOKEN_KEY = 'ssf_admin_token';
const tabs = [
    { id: 'all', label: 'All', icon: FaUsers },
    { id: 'contact', label: 'Contact', icon: FaEnvelope },
    { id: 'internship', label: 'Internship', icon: FaBriefcase },
    { id: 'interest', label: 'Movement / Partnership', icon: FaHandshake }
];
const dateText = (value) => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function AdminApplicationDashboard() {
    const [data, setData] = useState({ contacts: [], internships: [], interests: [] });
    const [tab, setTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

    const load = async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) { setAuthenticated(false); return; }
        setAuthenticated(true); setLoading(true); setError('');
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const responses = await Promise.all([
                fetch(ENDPOINTS.ADMIN_CONTACTS, { headers }),
                fetch(ENDPOINTS.ADMIN_INTERNSHIPS, { headers }),
                fetch(ENDPOINTS.ADMIN_INTERESTS, { headers })
            ]);
            if (responses.some(r => r.status === 401)) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); throw new Error('Admin session expired. Please log in again.'); }
            if (!responses.every(r => r.ok)) throw new Error('Some application data could not be loaded.');
            const [contactData, internshipData, interestData] = await Promise.all(responses.map(r => r.json()));
            setData({ contacts: Array.isArray(contactData) ? contactData : [], internships: Array.isArray(internshipData) ? internshipData : [], interests: Array.isArray(interestData) ? interestData : [] });
        } catch (e) { setError(e.message || 'Unable to load applications.'); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const records = useMemo(() => {
        const contacts = data.contacts.map(x => ({ ...x, kind: 'contact', title: `${x.firstName || ''} ${x.lastName || ''}`.trim(), subtitle: x.email, detail: 'Contact inquiry', date: x.createdAt }));
        const internships = data.internships.map(x => ({ ...x, kind: 'internship', title: x.fullName, subtitle: x.email, detail: `${x.college} • ${x.course} • ${x.internshipType} • ${x.duration}`, date: x.createdAt }));
        const interests = data.interests.map(x => ({ ...x, kind: 'interest', title: x.fullName, subtitle: x.email, detail: `${x.interestType === 'partner' ? 'CSR / Partnership' : 'Nation-Building Movement'} • ${x.phone}`, date: x.createdAt }));
        return [...contacts, ...internships, ...interests].filter(x => tab === 'all' || x.kind === tab).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }, [data, tab]);

    const updateStatus = async (record, status) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const endpoint = record.kind === 'contact' ? ENDPOINTS.ADMIN_CONTACT_STATUS(record.id) : record.kind === 'internship' ? ENDPOINTS.ADMIN_INTERNSHIP_STATUS(record.id) : ENDPOINTS.ADMIN_INTEREST_STATUS(record.id);
        const response = await fetch(endpoint, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
        if (response.status === 401) { localStorage.removeItem(TOKEN_KEY); setAuthenticated(false); return; }
        if (!response.ok) { const result = await response.json().catch(() => ({})); return setError(result.message || 'Unable to update status.'); }
        await load();
    };
    if (!authenticated) return null;
    const counts = { contact: data.contacts.length, internship: data.internships.length, interest: data.interests.length };

    return <section className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-8 border-b border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-widest text-[#FF6600]">Central Application Desk</p><h2 className="text-2xl font-black text-[#002344] mt-1">Other Form Submissions</h2><p className="text-sm text-zinc-500 mt-1">Contact, Internship, Nation-Building Movement and CSR / Partnership applications.</p></div>
            <button onClick={load} className="px-4 py-2 rounded-xl bg-zinc-100 font-bold text-sm">Refresh</button>
        </div>
        <div className="px-8 pt-5 flex flex-wrap gap-2">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${tab === id ? 'bg-[#002344] text-white' : 'bg-zinc-100 text-zinc-600'}`}><Icon />{label}{id !== 'all' && <span className="opacity-70">({counts[id] || 0})</span>}</button>)}</div>
        {error && <div className="mx-8 mt-5 p-4 rounded-xl bg-red-50 text-red-700 font-semibold text-sm">{error}</div>}
        <div className="p-8 pt-5 overflow-x-auto">{loading ? <div className="py-12 text-center text-zinc-400">Loading applications…</div> : records.length === 0 ? <div className="py-12 text-center text-zinc-400">No submissions found.</div> : <table className="w-full text-left min-w-[900px]"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-5 py-4">Applicant</th><th className="px-5 py-4">Type / Details</th><th className="px-5 py-4">Submitted</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Message / Information</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{records.map(record => <tr key={`${record.kind}-${record.id}`} className="align-top"><td className="px-5 py-5"><p className="font-bold text-[#002344]">{record.title}</p><p className="text-xs text-zinc-500 mt-1">{record.subtitle}</p>{record.phone && <p className="text-xs text-zinc-500">{record.phone}</p>}</td><td className="px-5 py-5"><p className="font-bold capitalize">{record.kind === 'interest' ? (record.interestType === 'partner' ? 'CSR / Partnership' : 'Nation-Building Movement') : record.kind}</p><p className="text-xs text-zinc-500 mt-1 max-w-[260px]">{record.detail}</p>{record.resumePath && <a href={`${API_BASE_URL}${record.resumePath}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700 inline-block mt-2">Open Resume</a>}</td><td className="px-5 py-5 whitespace-nowrap text-xs text-zinc-600">{dateText(record.date)}</td><td className="px-5 py-5"><select value={record.status || ''} onChange={e => updateStatus(record, e.target.value)} className="rounded-lg border border-zinc-200 px-2 py-2 text-xs font-bold"><option value="new">New</option>{record.kind === 'internship' ? <><option value="pending">Pending</option><option value="reviewed">Reviewed</option><option value="selected">Selected</option><option value="rejected">Rejected</option></> : <><option value="contacted">Contacted</option><option value="closed">Closed</option></>}</select></td><td className="px-5 py-5 max-w-[360px] text-xs leading-5 text-zinc-600">{record.message || '—'}</td></tr>)}</tbody></table>}</div>
    </section>;
}
