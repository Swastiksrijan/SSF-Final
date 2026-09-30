import { useEffect, useState } from 'react';
import { FaBell, FaCheckCircle, FaFileInvoiceDollar, FaIdCard } from 'react-icons/fa';
import { ENDPOINTS } from '../config/api';

const SESSION_KEY = 'ssf_user_session';

// Admin workflow states such as "contacted" and "reviewed" should not be
// exposed as the final user-facing application state. Keep those details in
// the admin dashboard and show a clear status to the applicant instead.
const userStatus = (status, type) => {
  const value = String(status || '').trim().toLowerCase();

  if (type === 'donation') {
    if (['paid', 'offline'].includes(value)) return 'paid';
    if (['failed', 'rejected'].includes(value)) return 'failed';
    return 'pending';
  }

  if (type === 'internship') {
    if (value === 'completed') return 'completed';
    if (['selected', 'approved'].includes(value)) return 'approved';
    if (['rejected', 'failed'].includes(value)) return 'rejected';
    return 'under_review';
  }

  if (['approved', 'active'].includes(value)) return 'approved';
  if (['rejected', 'failed'].includes(value)) return 'rejected';
  return 'under_review';
};

const text = value => {
  const labels = {
    under_review: 'Under review',
    pending: 'Pending',
    paid: 'Paid',
    approved: 'Approved',
    completed: 'Completed',
    rejected: 'Rejected',
    failed: 'Failed'
  };
  return labels[String(value || '').toLowerCase()] || 'Under review';
};

const badge = status => ['approved', 'paid', 'completed'].includes(String(status || '').toLowerCase())
  ? 'bg-emerald-100 text-emerald-700'
  : ['rejected', 'failed'].includes(String(status || '').toLowerCase())
    ? 'bg-red-100 text-red-700'
    : 'bg-amber-100 text-amber-700';

export default function UserApplicationStatus() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        if (!saved?.id) return;
        const response = await fetch(ENDPOINTS.USER_PORTAL(saved.id));
        if (!response.ok) return;
        const data = await response.json();
        const volunteers = data.activities?.volunteers || [];
        const donors = data.activities?.donors || [];
        const internships = data.activities?.internships || [];
        const interests = data.activities?.interests || [];

        const volunteerRows = interests
          .filter(x => x.interestType === 'volunteer')
          .map(x => {
            const v = volunteers.find(item => item.email === x.email);
            return {
              key: `interest-v-${x.id}`,
              title: `Volunteer — ${x.category || 'General Volunteer'}`,
              status: userStatus(x.status, 'volunteer'),
              id: v?.volunteerId || 'Under review',
              date: x.createdAt,
              doc: v?.idCardUrl
            };
          });

        const memberRows = interests
          .filter(x => x.interestType === 'member')
          .map(x => ({
            key: `interest-m-${x.id}`,
            title: `Member — ${x.category || 'General Member'}`,
            status: userStatus(x.status, 'member'),
            id: data.account?.memberId || 'Under review',
            date: x.createdAt,
            doc: data.account?.idCardUrl
          }));

        const donationRows = donors.map(d => ({
          key: `don-${d.id}`,
          title: `Donation — ${d.donationPurpose || 'General'}`,
          status: userStatus(d.paymentStatus, 'donation'),
          id: d.donorId || 'Receipt pending',
          date: d.createdAt,
          doc: d.receiptUrl
        }));

        const internshipRows = internships.map(i => ({
          key: `int-${i.id}`,
          title: `Internship — ${i.internshipType || 'Application'}`,
          status: userStatus(i.status, 'internship'),
          id: i.internId || 'Under review',
          date: i.createdAt
        }));

        const memberApproved = data.account?.status === 'approved' && data.account?.memberId
          ? [{
              key: 'member-approved',
              title: `Membership — ${data.account.memberType || 'Member'}`,
              status: 'approved',
              id: data.account.memberId,
              date: data.account.certificateIssuedAt || data.account.createdAt,
              doc: data.account.idCardUrl
            }]
          : [];

        const approvedVolunteers = volunteers
          .filter(v => v.status === 'approved' && !volunteerRows.some(r => r.id === v.volunteerId))
          .map(v => ({
            key: `vol-${v.id}`,
            title: `Volunteer — ${v.volunteerType || 'General Volunteer'}`,
            status: 'approved',
            id: v.volunteerId,
            date: v.approvedAt || v.createdAt,
            doc: v.idCardUrl
          }));

        if (alive) {
          setItems([
            ...volunteerRows,
            ...memberRows,
            ...memberApproved,
            ...approvedVolunteers,
            ...internshipRows,
            ...donationRows
          ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)));
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-6"><div className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8"><div className="flex items-center gap-3 mb-5"><FaBell className="text-[#ff6600]"/><div><h2 className="text-xl font-black text-[#002344]">Notifications & Status</h2><p className="text-sm text-zinc-500">Volunteer, membership, internship and donation updates.</p></div></div>{loading ? <p className="p-4 bg-zinc-50 rounded-xl text-sm text-zinc-500">Refreshing latest records…</p> : items.length === 0 ? <p className="p-4 bg-zinc-50 rounded-xl text-sm text-zinc-500">No application or contribution updates yet.</p> : <div className="space-y-3">{items.map(item => <div key={item.key} className="p-4 rounded-xl bg-zinc-50 border flex flex-col md:flex-row md:items-center justify-between gap-3"><div><p className="font-bold text-[#002344]">{item.title}</p><p className="text-xs text-zinc-500 mt-1">{item.id} · {item.date ? new Date(item.date).toLocaleDateString('en-IN') : '—'}</p></div><div className="flex items-center gap-2"><span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${badge(item.status)}`}>{text(item.status)}</span>{item.doc && <a href={item.doc} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-[#002344] text-white text-xs font-black inline-flex items-center gap-2">{String(item.title).startsWith('Donation') ? <FaFileInvoiceDollar/> : <FaIdCard/>}{String(item.title).startsWith('Donation') ? 'Receipt' : 'ID Card'}</a>}{item.status === 'approved' && !item.doc && <FaCheckCircle className="text-emerald-500" title="Approved"/>}</div></div>)}</div>}</div></section>;
}
