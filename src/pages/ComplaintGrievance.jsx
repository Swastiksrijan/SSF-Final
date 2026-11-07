import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AlertCircle, CheckCircle2, ClipboardList, Search, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const categories = [
  ['service', 'Service or assistance'], ['staff', 'Staff conduct'], ['volunteer', 'Volunteer conduct'],
  ['donation', 'Donation or receipt'], ['website', 'Website or digital service'], ['programme', 'Programme or activity'],
  ['safety', 'Safety or safeguarding concern'], ['other', 'Other']
];
const statusText = {
  received: 'Received', under_review: 'Under review', awaiting_information: 'Awaiting information',
  resolved: 'Resolved', closed: 'Closed'
};
const field = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#12345A] outline-none transition focus:border-[#176447] focus:ring-2 focus:ring-[#176447]/10';
const button = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#12345A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0c2948] disabled:cursor-not-allowed disabled:opacity-50';

export default function ComplaintGrievance() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', category: 'other', subject: '', description: '', website: '' });
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');
  const [track, setTrack] = useState({ reference: '', contact: '' });
  const [tracking, setTracking] = useState(false);
  const [tracked, setTracked] = useState(null);
  const [trackError, setTrackError] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError(''); setSubmitted(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Submission failed. Please try again.');
      setSubmitted(data);
      setForm({ fullName: '', email: '', phone: '', category: 'other', subject: '', description: '', website: '' });
    } catch (e) { setError(e.message || 'Unable to submit. Please try again.'); }
    finally { setBusy(false); }
  };

  const checkStatus = async (e) => {
    e.preventDefault(); setTracking(true); setTrackError(''); setTracked(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/complaints/track`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(track) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Unable to find this complaint.');
      setTracked(data);
    } catch (e) { setTrackError(e.message || 'Unable to check status.'); }
    finally { setTracking(false); }
  };

  return <main className="min-h-screen bg-[#F5F7FA] pb-16 pt-32 text-[#12345A]">
    <section className="bg-[#12345A] text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#F7A814]">Swastik Srijan Foundation Samiti</p>
        <h1 className="mt-3 text-3xl font-black sm:text-5xl">Complaint & Grievance Redressal</h1>
        <p className="mt-3 max-w-3xl text-lg text-white/85">शिकायत एवं शिकायत निवारण केंद्र</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">Submit a concern relating to the Foundation, its services, programmes, representatives or donation process. You will receive a reference number to track the response.</p>
      </div>
    </section>
    <div className="mx-auto grid max-w-6xl gap-7 px-5 py-9 sm:px-8 lg:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700"><AlertCircle /></span><div><h2 className="text-xl font-extrabold">Register a complaint</h2><p className="mt-1 text-sm text-slate-500">शिकायत दर्ज करें · Required fields are marked *</p></div></div>
        {submitted ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5" role="status"><CheckCircle2 className="mb-2 h-7 w-7 text-emerald-700" /><h3 className="font-bold text-emerald-900">Complaint received / शिकायत प्राप्त हुई</h3><p className="mt-2 text-sm text-emerald-800">Keep this reference number safe. You will need it to check progress.</p><p className="mt-3 rounded-xl bg-white px-4 py-3 font-mono text-lg font-black tracking-wide text-[#12345A]">{submitted.reference}</p><p className="mt-2 text-xs text-emerald-800">Initial status: {statusText[submitted.status] || submitted.status}</p><button className="mt-4 text-sm font-bold text-[#176447] underline" onClick={() => { setTrack({ reference: submitted.reference, contact: form.email || form.phone }); setSubmitted(null); }}>Track this complaint</button></div> : <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Full name *<input className={field + ' mt-1.5'} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} maxLength={120} required autoComplete="name" /></label>
            <label className="block text-sm font-semibold">Email<input className={field + ' mt-1.5'} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} maxLength={160} autoComplete="email" /></label>
            <label className="block text-sm font-semibold">Mobile number<input className={field + ' mt-1.5'} type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} maxLength={24} autoComplete="tel" /></label>
            <label className="block text-sm font-semibold">Complaint category *<select className={field + ' mt-1.5'} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(([v, label]) => <option key={v} value={v}>{label}</option>)}</select></label>
          </div>
          <label className="block text-sm font-semibold">Subject *<input className={field + ' mt-1.5'} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} maxLength={180} minLength={4} required /></label>
          <label className="block text-sm font-semibold">Complaint details *<textarea className={field + ' mt-1.5'} rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} maxLength={10000} minLength={20} required placeholder="Please explain what happened, when it happened and what response you are seeking." /></label>
          <label className="hidden" aria-hidden="true">Leave this field blank<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></label>
          <p className="rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-600">Please provide at least one follow-up contact method (email or mobile). Do not include passwords, OTPs, PINs, CVV, bank details or unrelated sensitive personal information. For an immediate emergency, contact the appropriate emergency service; this form is not an emergency channel.</p>
          {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">{error}</p>}
          <button className={button} disabled={busy}>{busy ? 'Submitting…' : 'Submit complaint / शिकायत दर्ज करें'} <ClipboardList size={17} /></button>
        </form>}
      </section>
      <aside className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#12345A]"><Search /></span><div><h2 className="text-xl font-extrabold">Track a complaint</h2><p className="text-sm text-slate-500">शिकायत की स्थिति देखें</p></div></div>
          <form onSubmit={checkStatus} className="space-y-3">
            <label className="block text-sm font-semibold">Reference number<input className={field + ' mt-1.5 font-mono uppercase'} value={track.reference} onChange={e => setTrack({ ...track, reference: e.target.value.toUpperCase() })} required placeholder="SSF-GRV-YYYYMMDD-XXXXXX" /></label>
            <label className="block text-sm font-semibold">Email or mobile used<input className={field + ' mt-1.5'} value={track.contact} onChange={e => setTrack({ ...track, contact: e.target.value })} required /></label>
            {trackError && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">{trackError}</p>}
            <button className={button} disabled={tracking}>{tracking ? 'Checking…' : 'Check status'} <Search size={16} /></button>
          </form>
          {tracked && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4" role="status"><p className="font-mono text-xs font-bold">{tracked.reference}</p><p className="mt-2 font-bold">{tracked.subject}</p><p className="mt-2 text-sm">Status: <span className="font-bold">{statusText[tracked.status] || tracked.status}</span></p><p className="mt-1 text-xs text-slate-600">Last updated: {new Date(tracked.updatedAt).toLocaleString('en-IN')}</p>{tracked.resolutionNote && <p className="mt-3 border-t border-emerald-200 pt-3 text-sm">{tracked.resolutionNote}</p>}</div>}
        </section>
        <section className="rounded-3xl bg-[#EAF0F6] p-5 sm:p-7"><ShieldCheck className="mb-3 h-7 w-7 text-[#176447]" /><h2 className="font-extrabold">What happens next?</h2><ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-6 text-slate-700"><li>Your complaint is recorded with a unique reference number.</li><li>The authorised team reviews the details and may contact you for clarification.</li><li>The status is updated as the matter progresses.</li><li>A resolution note is shown when the complaint is marked resolved or closed.</li></ol><p className="mt-4 text-xs leading-5 text-slate-500">Submission does not guarantee a particular outcome or response time. SSF will review complaints fairly and subject to available records and applicable requirements.</p><Link to="/Contact" className="mt-4 inline-block text-sm font-bold text-[#176447] underline">Contact the Foundation for other enquiries</Link></section>
      </aside>
    </div>
  </main>;
}
