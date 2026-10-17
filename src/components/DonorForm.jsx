import { useState } from 'react';
import { FaCheckCircle, FaHeart, FaShieldAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { ENDPOINTS } from '../config/api';
import { Alert, Field, FileField, FormNote, Input, Select, SubmitButton, Textarea } from './forms/FormUI';

const DONATION_PAYMENT_LINK = 'https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view';

const initialForm = {
    fullName: '', email: '', countryCode: '+91', phone: '', city: '', state: '', country: 'India',
    donationPurpose: 'General Donation', amount: '', pan: '', address: '', paymentMode: 'online',
    receiptPreference: 'email', notes: ''
};

export default function DonorForm() {
    const [form, setForm] = useState(initialForm);
    const [idDocument, setIdDocument] = useState(null);
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
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setResult({ type: 'error', message: 'Please enter a valid email address.' });
            return;
        }
        if (form.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.trim().toUpperCase())) {
            setResult({ type: 'error', message: 'Please enter a valid PAN (e.g. AAKAS7123H) or leave it blank.' });
            return;
        }
        if (idDocument && idDocument.size > 5 * 1024 * 1024) {
            setResult({ type: 'error', message: 'Document must be 5MB or smaller.' });
            return;
        }
        setBusy(true);
        try {
            const data = new FormData();
            Object.entries(form).forEach(([key, value]) => data.append(key, value));
            data.set('pan', form.pan.trim().toUpperCase());
            data.set('phone', `${form.countryCode}${form.phone}`);
            if (idDocument) data.append('id_document', idDocument);
            const response = await fetch(ENDPOINTS.DONOR, { method: 'POST', body: data });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.message || 'Unable to submit donor details.');
            setResult({ type: 'success', message: `Thank you. Your Donor ID is ${payload.donorId}. Please keep it for your records.` });
            setForm(initialForm);
            setIdDocument(null);
        } catch (error) {
            setResult({ type: 'error', message: error.message || 'Unable to submit donor details right now.' });
        } finally { setBusy(false); }
    };

    return (
        <section id="donor-form" className="py-20 px-4 bg-zinc-50 border-t border-zinc-100">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#12345A] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white mb-4"><FaHeart /> Donor Registration</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#12345A]">Register as a Donor</h2>
                    <p className="mt-3 text-zinc-600">दान करने के बाद अपनी donor details यहाँ दर्ज करें, ताकि आपका record और future receipt support सुरक्षित रहे।</p>
                </div>
                <form onSubmit={submit} className="bg-white rounded-3xl border border-zinc-200 shadow-xl p-6 md:p-10">
                    <div className="ssf-form-grid ssf-form-grid-2">
                        <Field label="Full Name" required><Input value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Enter full name" autoComplete="name" /></Field>
                        <Field label="Email Address" required><Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="name@example.com" autoComplete="email" /></Field>
                        <Field label="Mobile Number" required>
                            <div className="grid grid-cols-[105px_minmax(0,1fr)] gap-2">
                                <Select value={form.countryCode} onChange={e => update('countryCode', e.target.value)}><option>+91</option><option>+1</option><option>+44</option><option>+971</option><option>+61</option><option>+65</option></Select>
                                <Input type="tel" inputMode="numeric" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, ''))} placeholder="Mobile number" autoComplete="tel-national" />
                            </div>
                        </Field>
                        <Field label="Donation Amount"><Input type="number" min="0" value={form.amount} onChange={e => update('amount', e.target.value)} placeholder="Amount in INR" /></Field>
                        <Field label="Donation Purpose"><Select value={form.donationPurpose} onChange={e => update('donationPurpose', e.target.value)}><option>General Donation</option><option>Education</option><option>Health & Nutrition</option><option>Livelihood & Skill Development</option><option>Women Empowerment</option><option>Environment & Community Welfare</option><option>Youth & Sports</option><option>Other</option></Select></Field>
                        <Field label="Payment Mode"><Select value={form.paymentMode} onChange={e => update('paymentMode', e.target.value)}><option value="online">Online Donation</option><option value="upi">UPI</option><option value="bank_transfer">Bank Transfer</option><option value="cash">Cash / Offline</option></Select></Field>

                        {form.paymentMode === 'online' && (
                            <div className="md:col-span-2 rounded-2xl border border-orange-200 bg-orange-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="font-black text-[#12345A]">Online Donation</p>
                                    <p className="text-sm text-zinc-600 mt-1">Pay securely through Razorpay. You can select the donation amount on the payment page.</p>
                                </div>
                                <a href={DONATION_PAYMENT_LINK} target="_blank" rel="noreferrer noopener" className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#176447] px-5 py-3 font-black text-white hover:bg-[#12345A] transition">
                                    Donate Now <FaExternalLinkAlt className="text-xs" />
                                </a>
                            </div>
                        )}

                        <Field label="City"><Input value={form.city} onChange={e => update('city', e.target.value)} placeholder="City" /></Field>
                        <Field label="State"><Input value={form.state} onChange={e => update('state', e.target.value)} placeholder="State" /></Field>
                        <Field label="PAN" hint="For 80G receipt records, if applicable"><Input value={form.pan} onChange={e => update('pan', e.target.value.toUpperCase())} placeholder="e.g. AAKAS7123H" maxLength={10} /></Field>
                        <Field label="Receipt Preference"><Select value={form.receiptPreference} onChange={e => update('receiptPreference', e.target.value)}><option value="email">Email</option><option value="email_and_whatsapp">Email & WhatsApp</option><option value="none">No receipt requested</option></Select></Field>
                        <FileField label="PAN / Identity Document" className="md:col-span-2" accept=".jpg,.jpeg,.png,.webp,.pdf,application/pdf" hint="Optional · JPG, PNG or PDF · max 5MB · attach a PAN card or other ID for 80G records" onChange={e => setIdDocument(e.target.files?.[0] || null)} />
                        <Field label="Address" className="md:col-span-2"><Textarea className="min-h-[90px]" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Address for records/receipt" /></Field>
                        <Field label="Note" className="md:col-span-2"><Textarea className="min-h-[90px]" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any message for the Foundation" /></Field>
                    </div>
                    <div className="mt-6"><FormNote><span className="flex items-start gap-3"><FaShieldAlt className="mt-0.5 text-[#12345A] shrink-0" /><span>Your donor details are submitted securely to the Foundation for donation records and receipt support. Payment itself continues through the selected payment method.</span></span></FormNote></div>
                    {result && <div className="mt-5">{result.type === 'success' ? <Alert tone="success"><FaCheckCircle className="inline mr-1" />{result.message}</Alert> : <Alert tone="error">{result.message}</Alert>}</div>}
                    <div className="mt-6"><SubmitButton busy={busy} busyLabel="Submitting…">Register as Donor</SubmitButton></div>
                </form>
            </div>
        </section>
    );
}
