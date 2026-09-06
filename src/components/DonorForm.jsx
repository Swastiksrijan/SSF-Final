import { useState } from 'react';
import { FaCheckCircle, FaHeart, FaShieldAlt } from 'react-icons/fa';
import { ENDPOINTS } from '../config/api';

const initialForm = {
    fullName: '', email: '', countryCode: '+91', phone: '', city: '', state: '', country: 'India',
    donationPurpose: 'General Donation', amount: '', pan: '', address: '', paymentMode: 'online',
    receiptPreference: 'email', notes: ''
};

export default function DonorForm() {
    const [form, setForm] = useState(initialForm);
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState(null);

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const submit = async (event) => {
        event.preventDefault();
        setResult(null);
        if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
            setResult({ type: 'error', message: 'Please complete Name, Email and Mobile Number.' });
            return;
        }
        setBusy(true);
        try {
            const response = await fetch(ENDPOINTS.DONOR, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, phone: `${form.countryCode}${form.phone}` })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.message || 'Unable to submit donor details.');
            setResult({ type: 'success', message: `Thank you. Your Donor ID is ${data.donorId}. Please keep it for your records.` });
            setForm(initialForm);
        } catch (error) {
            setResult({ type: 'error', message: error.message || 'Unable to submit donor details right now.' });
        } finally { setBusy(false); }
    };

    const inputClass = 'w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-[#002344] focus:ring-2 focus:ring-[#002344]/10';
    const labelClass = 'block text-sm font-semibold text-zinc-700 mb-2';

    return (
        <section id="donor-form" className="py-20 px-4 bg-zinc-50 border-t border-zinc-100">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#002344] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white mb-4"><FaHeart /> Donor Registration</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#002344]">Register as a Donor</h2>
                    <p className="mt-3 text-zinc-600">दान करने के बाद अपनी donor details यहाँ दर्ज करें, ताकि आपका record और future receipt support सुरक्षित रहे।</p>
                </div>
                <form onSubmit={submit} className="bg-white rounded-3xl border border-zinc-200 shadow-xl p-6 md:p-10">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div><label className={labelClass}>Full Name *</label><input className={inputClass} value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Enter full name" /></div>
                        <div><label className={labelClass}>Email Address *</label><input type="email" className={inputClass} value={form.email} onChange={e => update('email', e.target.value)} placeholder="name@example.com" /></div>
                        <div><label className={labelClass}>Mobile Number *</label><div className="grid grid-cols-[105px_minmax(0,1fr)] gap-2"><select className={inputClass} value={form.countryCode} onChange={e => update('countryCode', e.target.value)}><option>+91</option><option>+1</option><option>+44</option><option>+971</option><option>+61</option><option>+65</option></select><input type="tel" inputMode="numeric" className={inputClass} value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, ''))} placeholder="Mobile number" /></div></div>
                        <div><label className={labelClass}>Donation Amount</label><input type="number" min="0" className={inputClass} value={form.amount} onChange={e => update('amount', e.target.value)} placeholder="Amount in INR" /></div>
                        <div><label className={labelClass}>Donation Purpose</label><select className={inputClass} value={form.donationPurpose} onChange={e => update('donationPurpose', e.target.value)}><option>General Donation</option><option>Education</option><option>Health & Nutrition</option><option>Livelihood & Skill Development</option><option>Women Empowerment</option><option>Environment & Community Welfare</option><option>Youth & Sports</option><option>Other</option></select></div>
                        <div><label className={labelClass}>Payment Mode</label><select className={inputClass} value={form.paymentMode} onChange={e => update('paymentMode', e.target.value)}><option value="online">Online Donation</option><option value="upi">UPI</option><option value="bank_transfer">Bank Transfer</option><option value="cash">Cash / Offline</option></select></div>
                        <div><label className={labelClass}>City</label><input className={inputClass} value={form.city} onChange={e => update('city', e.target.value)} placeholder="City" /></div>
                        <div><label className={labelClass}>State</label><input className={inputClass} value={form.state} onChange={e => update('state', e.target.value)} placeholder="State" /></div>
                        <div><label className={labelClass}>PAN (Optional)</label><input className={inputClass} value={form.pan} onChange={e => update('pan', e.target.value.toUpperCase())} placeholder="For receipt records, if applicable" maxLength={10} /></div>
                        <div><label className={labelClass}>Receipt Preference</label><select className={inputClass} value={form.receiptPreference} onChange={e => update('receiptPreference', e.target.value)}><option value="email">Email</option><option value="email_and_whatsapp">Email & WhatsApp</option><option value="none">No receipt requested</option></select></div>
                        <div className="md:col-span-2"><label className={labelClass}>Address (Optional)</label><textarea className={`${inputClass} min-h-[90px]`} value={form.address} onChange={e => update('address', e.target.value)} placeholder="Address for records/receipt" /></div>
                        <div className="md:col-span-2"><label className={labelClass}>Note (Optional)</label><textarea className={`${inputClass} min-h-[90px]`} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any message for the Foundation" /></div>
                    </div>
                    <div className="mt-6 flex items-start gap-3 rounded-2xl bg-zinc-50 border border-zinc-100 p-4 text-sm text-zinc-600"><FaShieldAlt className="mt-0.5 text-[#002344] shrink-0" /><p>Your donor details are submitted securely to the Foundation for donation records and receipt support. Payment itself continues through the selected payment method.</p></div>
                    {result && <div className={`mt-5 rounded-2xl p-4 font-semibold ${result.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{result.type === 'success' ? <FaCheckCircle className="inline mr-2" /> : null}{result.message}</div>}
                    <button disabled={busy} className="mt-6 w-full rounded-2xl bg-[#002344] py-4 text-lg font-bold text-white hover:bg-[#003b70] disabled:opacity-60 transition-colors">{busy ? 'Submitting...' : 'Register as Donor'}</button>
                </form>
            </div>
        </section>
    );
}
