import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaSearch, FaTrash, FaUserShield } from 'react-icons/fa';
import { ENDPOINTS } from '../config/api';

const TOKEN_KEY = 'ssf_admin_token';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setLoading(true); setError('');
    try {
      const response = await fetch(ENDPOINTS.ADMIN_MEMBERS, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json().catch(() => []);
      if (response.status === 401) throw new Error('Admin session expired. Please log in again.');
      if (!response.ok) throw new Error(data.message || 'Unable to load users.');
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) { setError(e.message || 'Unable to load users.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const permanentlyDeleteUser = async user => {
    const first = window.confirm(`PERMANENTLY DELETE ${user.fullName}?\n\nThis removes the SSF account and all records linked to ${user.email}: membership, volunteer, donor, internship, interests and contact submissions. Uploaded documents will also be removed.\n\nThis cannot be undone.`);
    if (!first) return;
    const confirmation = window.prompt(`Type DELETE to permanently remove ${user.fullName} and all associated records:`);
    if (confirmation !== 'DELETE') return;

    const token = localStorage.getItem(TOKEN_KEY);
    setBusy(user.id); setError('');
    try {
      const response = await fetch(ENDPOINTS.ADMIN_DELETE_USER(user.id), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error('Admin session expired. Please log in again.');
      if (!response.ok) throw new Error(result.message || 'Unable to delete user.');
      setUsers(current => current.filter(item => item.id !== user.id));
    } catch (e) { setError(e.message || 'Unable to permanently delete user.'); }
    finally { setBusy(''); }
  };

  const filtered = users.filter(user => `${user.fullName} ${user.email} ${user.phone} ${user.memberId || ''}`.toLowerCase().includes(query.toLowerCase()));

  return <section id="admin-people" className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 overflow-hidden mt-8">
    <div className="p-8 border-b border-zinc-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#FF6600]">People & Accounts</p>
          <h2 className="text-2xl font-black text-[#002344] mt-1">User Management</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage website accounts. Permanent deletion is intentionally protected by a second confirmation.</p>
        </div>
        <div className="relative w-full lg:w-80"><FaSearch className="absolute left-3 top-3.5 text-zinc-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, email, phone…" className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-3 text-sm" /></div>
      </div>
    </div>
    {error && <div className="mx-8 mt-5 p-4 rounded-xl bg-red-50 text-red-700 font-semibold text-sm">{error}</div>}
    <div className="p-8 overflow-x-auto">
      {loading ? <div className="py-10 text-center text-zinc-400">Loading users…</div> : filtered.length === 0 ? <div className="py-10 text-center text-zinc-400">No user accounts found.</div> : <table className="w-full min-w-[900px] text-left"><thead><tr className="bg-zinc-50 text-zinc-400 font-bold text-xs uppercase tracking-widest"><th className="px-5 py-4">User</th><th className="px-5 py-4">Account / Membership</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Admin Actions</th></tr></thead><tbody className="divide-y divide-zinc-50 text-sm">{filtered.map(user => <tr key={user.id} className="align-top"><td className="px-5 py-5"><p className="font-bold text-[#002344]">{user.fullName}</p><p className="text-xs text-zinc-500 mt-1">{user.email}</p><p className="text-xs text-zinc-500">{user.phone}</p></td><td className="px-5 py-5"><p className="font-semibold">{user.memberType === 'website_signup' ? 'Website Account' : `Membership • ${user.memberType || 'General'}`}</p><p className="text-xs text-zinc-500 mt-1">{user.memberId || `Account ${user.id}`}</p></td><td className="px-5 py-5"><span className="inline-flex rounded-lg bg-zinc-100 px-3 py-2 text-xs font-bold">{user.status || '—'}</span></td><td className="px-5 py-5"><button disabled={busy === user.id} onClick={() => permanentlyDeleteUser(user)} className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 font-bold text-xs"><FaTrash />{busy === user.id ? 'Deleting…' : 'Delete User & All Records'}</button><p className="text-[11px] text-red-500 mt-2 flex items-center gap-1"><FaExclamationTriangle /> Irreversible action</p></td></tr>)}</tbody></table>}
    </div>
  </section>;
}
