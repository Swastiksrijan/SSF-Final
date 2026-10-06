import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Badge, Button, SectionHero, StatStrip, DataTable, DetailModal, Field2 } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

// RECEIPTS & PAYMENTS — the single entry point for every financial transaction.
// One entry posts balanced double-entry ledger lines, so the Ledger, Journal,
// Trial Balance, Cash Book and Bank Book all update without a second entry.
//
// The form presents the full SSF category list (Donation, Membership Fee,
// Founder Contribution, Grant, CSR, Interest, Salary, Honorarium, Travel,
// Taxi/Auto, Rent, Food, Programme, Procurement, Bank Charges, Capital …).
// Each label maps to an existing engine voucher type, so the accounting
// classification stays exactly as before — nothing in the database changes.

// Display categories -> engine voucher type. Kept identical to the engine's
// RECEIPT_TYPES / PAYMENT_TYPES so classification never drifts.
const INCOME_CATEGORIES = [
  { group: 'Donations & Contributions · दान एवं अंशदान', items: [
    ['donation', 'Donation / दान'],
    ['contribution', 'Membership Fee / सदस्यता शुल्क'],
    ['contribution', 'Founder Contribution / संस्थापक अंशदान'],
    ['csr', 'CSR / सी.एस.आर.'],
  ] },
  { group: 'Grants & Other Income · अनुदान एवं अन्य आय', items: [
    ['grant', 'Grant / अनुदान'],
    ['interest', 'Interest / ब्याज'],
    ['income', 'Other Income / अन्य आय'],
    ['receipt', 'Misc Receipt / अन्य प्राप्ति'],
  ] },
];
const EXPENSE_CATEGORIES = [
  { group: 'Programme & Procurement · कार्यक्रम एवं खरीद', items: [
    ['expense', 'Programme Expense / कार्यक्रम व्यय'],
    ['expense', 'Food / भोजन'],
    ['expense', 'Procurement / खरीद'],
    ['capital', 'Capital Expense / पूँजीगत व्यय'],
  ] },
  { group: 'People · कार्मिक', items: [
    ['expense', 'Salary / वेतन'],
    ['expense', 'Honorarium / मानदेय'],
    ['travel', 'Travel / यात्रा'],
    ['travel', 'Taxi / Auto / टैक्सी / ऑटो'],
    ['reimbursement', 'Reimbursement / प्रतिपूर्ति'],
    ['advance', 'Advance / अग्रिम'],
  ] },
  { group: 'Office & Admin · कार्यालय एवं प्रशासन', items: [
    ['rent', 'Rent / किराया'],
    ['bankCharges', 'Bank Charges / बैंक शुल्क'],
    ['payment', 'Other Payment / अन्य भुगतान'],
  ] },
];
// The precise label the user picked, so the register shows the real category.
const CATEGORY_LABEL = {};
[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].forEach((g) => g.items.forEach(([v, l]) => { CATEGORY_LABEL[`${v}::${l}`] = l; }));

const PAYMENT_MODES = ['cash', 'bank', 'upi', 'cheque', 'online'];

const emptyForm = () => ({
  direction: 'receipt',
  txnDate: new Date().toISOString().slice(0, 10),
  categoryKey: 'donation::Donation / दान',
  amount: '',
  paymentMode: 'cash',
  cashAccountId: '',
  bankAccountId: '',
  accountId: '',
  fundId: '',
  projectId: '',
  costCentreId: '',
  partyId: '',
  referenceNo: '',
  subCategory: '',
  particulars: '',
  purpose: '',
  remarks: '',
});

export default function ImsFinanceEntry() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [dash, setDash] = useState(null);
  const [rows, setRows] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [detail, setDetail] = useState(null);
  const [ccMap, setCcMap] = useState({});

  const load = async () => {
    try {
      const [d, r, cc] = await Promise.all([ims.financeDashboard(), ims.receiptsPayments(), ims.costCentres({})]);
      setDash(d);
      setRows(r.records || []);
      setCcMap(Object.fromEntries((cc.records || []).map((x) => [x.id, x.name])));
    } catch (e) { setErr(e.message); setRows([]); }
  };
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const categoryOptions = form.direction === 'receipt' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const [categoryType] = (form.categoryKey || '').split('::');
  const kind = form.direction === 'receipt' ? 'receipt' : 'payment';

  // Compose the engine narration from the descriptive fields the brief asks for,
  // so Purpose / Particulars / Remarks are captured without changing the schema.
  const composeNarration = () => {
    const parts = [];
    if (form.particulars) parts.push(form.particulars);
    if (form.purpose) parts.push(`Purpose: ${form.purpose}`);
    if (form.subCategory) parts.push(`Sub-category: ${form.subCategory}`);
    if (form.referenceNo) parts.push(`Ref: ${form.referenceNo}`);
    if (form.remarks) parts.push(`Remarks: ${form.remarks}`);
    return parts.join(' · ');
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!form.amount) { setErr('Amount is required · राशि आवश्यक है'); return; }
    if (kind === 'receipt' && !form.cashAccountId && !form.bankAccountId) {
      setErr('Select the cash or bank account · रोकड़ या बैंक खाता चुनें'); return;
    }
    setSaving(true);
    try {
      const payload = {
        txnDate: form.txnDate,
        transactionType: categoryType || (kind === 'receipt' ? 'donation' : 'expense'),
        amount: Number(form.amount),
        paymentMode: form.paymentMode,
        cashAccountId: form.cashAccountId,
        bankAccountId: form.bankAccountId,
        accountId: form.accountId,
        fundId: form.fundId,
        projectId: form.projectId,
        costCentreId: form.costCentreId,
        partyId: form.partyId,
        narration: composeNarration(),
      };
      for (const k of ['cashAccountId', 'bankAccountId', 'accountId', 'fundId', 'projectId', 'partyId', 'costCentreId']) {
        if (!payload[k]) delete payload[k];
      }
      const out = await ims.postVoucher(payload);
      setMsg(`${t('posted_ok')} · ${out.voucher.voucherNo}`);
      setForm(emptyForm());
      await load();
    } catch (e2) { setErr(e2.message); } finally { setSaving(false); }
  };

  const cols = [
    { key: 'transactionNo', en: 'Txn No.', render: (r) => <span className="font-mono text-xs text-slate-500">{r.transactionNo}</span> },
    { key: 'txnDate', en: 'Date', hi: 'दिनांक' },
    { key: 'transactionType', en: 'Type', hi: 'प्रकार', render: (r) => <Badge status={r.transactionType} /> },
    { key: 'amount', en: 'Amount', hi: 'राशि', align: 'right', render: (r) => <span className="font-semibold tabular-nums text-[#002344]">₹{Number(r.amount).toLocaleString('en-IN')}</span> },
    { key: 'direction', en: 'Dr/Cr', render: (r) => r.direction === 'in'
      ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">↓ {t('in_dr')}</span>
      : <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">↑ {t('out_cr')}</span> },
    { key: 'paymentMode', en: 'Mode', hi: 'माध्यम', render: (r) => <span className="capitalize">{r.paymentMode || '—'}</span> },
    { key: 'costCentreId', en: 'Cost Centre', hi: 'लागत केंद्र', render: (r) => (r.costCentreId && ccMap[r.costCentreId]) ? <span className="text-xs font-semibold text-[#002344]">{ccMap[r.costCentreId]}</span> : '—' },
    { key: 'narration', en: 'Particulars', hi: 'विवरण', render: (r) => (r.narration ? String(r.narration).slice(0, 40) : '—') },
  ];

  const k = (dash && dash.kpis) || {};

  return (
    <ImsLayout active="receipts_payments">
      <SectionHero title={t('money_transaction')} hi="धन लेन-देन" eyebrow={t('receipts_payments')} icon="ReceiptText" tone="navy"
        actions={<Button variant="ghost" icon="BookOpen" onClick={() => navigate({ to: '/ims/finance/ledger' })}>{t('ledger_journal')}</Button>}>
        <p className="text-sm text-white/80">{t('money_transaction_hint')}</p>
      </SectionHero>

      <div className="mb-6">
        <StatStrip items={[
          { labelKey: 'income', label: t('income'), value: `₹${Number(k.income || 0).toLocaleString('en-IN')}`, icon: 'TrendingUp', tone: 'green' },
          { labelKey: 'expenses', label: t('expenses'), value: `₹${Number(k.expense || 0).toLocaleString('en-IN')}`, icon: 'TrendingDown', tone: 'red' },
          { label: t('balance'), value: `₹${Number(k.net || 0).toLocaleString('en-IN')}`, icon: 'Scale', tone: 'navy' },
          { label: t('financial_years'), value: k.financialYear || '—', icon: 'CalendarRange', tone: 'orange' },
        ]} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* --- the single entry form --- */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <span className={`grid h-10 w-10 place-items-center rounded-2xl text-lg text-white shadow-sm ${kind === 'receipt' ? 'bg-gradient-to-br from-emerald-600 to-emerald-500' : 'bg-gradient-to-br from-rose-600 to-rose-500'}`}>
              {kind === 'receipt' ? '↓' : '↑'}
            </span>
            <div>
              <p className="text-sm font-black text-[#002344]">{t('new_entry')}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('money_transaction')}</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Income / Expense direction toggle */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
              {[['receipt', 'Income · आय', 'TrendingUp'], ['payment', 'Expense · व्यय', 'TrendingDown']].map(([v, lbl, ic]) => {
                const on = form.direction === v;
                const I = Icons[ic];
                return (
                  <button key={v} type="button" onClick={() => { set('direction', v); set('categoryKey', v === 'receipt' ? 'donation::Donation / दान' : 'expense::Programme Expense / कार्यक्रम व्यय'); }}
                    className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${on ? (v === 'receipt' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-rose-600 text-white shadow-sm') : 'text-slate-500 hover:text-slate-700'}`}>
                    <I size={15} /> {lbl}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <L label={[t('date'), 'दिनांक']}><input type="date" className={inp} value={form.txnDate} onChange={(e) => set('txnDate', e.target.value)} /></L>
              <L label={[t('amount'), 'राशि']} req><input type="number" min="0" step="0.01" className={inp} value={form.amount} onChange={(e) => set('amount', e.target.value)} /></L>
            </div>

            <L label={[t('category'), 'श्रेणी']} req>
              <select className={inp} value={form.categoryKey} onChange={(e) => set('categoryKey', e.target.value)}>
                {categoryOptions.map((g) => (
                  <optgroup key={g.group} label={g.group}>
                    {g.items.map(([v, l]) => <option key={`${v}::${l}`} value={`${v}::${l}`}>{l}</option>)}
                  </optgroup>
                ))}
              </select>
            </L>

            <div className="grid grid-cols-2 gap-3">
              <L label={[t('sub_category'), 'उप-श्रेणी']}><input className={inp} value={form.subCategory} onChange={(e) => set('subCategory', e.target.value)} placeholder={t('optional')} /></L>
              <L label={[t('reference_no'), 'संदर्भ क्र.']}><input className={inp} value={form.referenceNo} onChange={(e) => set('referenceNo', e.target.value)} placeholder={t('optional')} /></L>
            </div>

            <L label={[t('payment_mode'), 'भुगतान माध्यम']}>
              <select className={inp} value={form.paymentMode} onChange={(e) => set('paymentMode', e.target.value)}>
                {PAYMENT_MODES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </L>

            <div className="grid grid-cols-2 gap-3">
              <RefSelect label={[t('cash_accounts'), 'रोकड़ खाते']} resource="cashAccounts" value={form.cashAccountId} onChange={(v) => set('cashAccountId', v)} nameKey="name" />
              <RefSelect label={[t('bank_accounts'), 'बैंक खाते']} resource="bankAccounts" value={form.bankAccountId} onChange={(v) => set('bankAccountId', v)} nameKey="accountNo" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <RefSelect label={[t('chart_of_accounts'), 'लेखा सूची']} resource="accounts" value={form.accountId} onChange={(v) => set('accountId', v)} nameKey="name" />
              <RefSelect label={[t('funds'), 'निधियाँ']} resource="funds" value={form.fundId} onChange={(v) => set('fundId', v)} nameKey="name" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <RefSelect label={[t('party'), 'पक्ष']} resource="parties" value={form.partyId} onChange={(v) => set('partyId', v)} nameKey="name" />
              <RefSelect label={['Project', 'परियोजना']} resource="projects" value={form.projectId} onChange={(v) => set('projectId', v)} nameKey="name" />
            </div>

            <RefSelect label={[t('cost_centres'), 'लागत केंद्र']} resource="costCentres" value={form.costCentreId} onChange={(v) => set('costCentreId', v)} nameKey="name" />

            <L label={[t('purpose'), 'उद्देश्य']}><input className={inp} value={form.purpose} onChange={(e) => set('purpose', e.target.value)} placeholder={t('optional')} /></L>

            <L label={[t('particulars'), 'विवरण']}>
              <textarea rows={2} className={inp} value={form.particulars} onChange={(e) => set('particulars', e.target.value)} />
            </L>

            <L label={[t('remarks'), 'टिप्पणी']}>
              <textarea rows={2} className={inp} value={form.remarks} onChange={(e) => set('remarks', e.target.value)} />
            </L>

            <p className="flex items-start gap-1.5 rounded-xl bg-[#F5F8FC] px-3 py-2 text-[11px] font-semibold text-[#0F766E]">
              <Icons.RefreshCw size={13} className="mt-0.5 shrink-0" /> {t('auto_updated')}
            </p>

            {err && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{err}</p>}
            {msg && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{msg}</p>}

            <Button icon="Check" type="submit" disabled={saving} className="w-full">{saving ? '…' : t('post_entry')}</Button>
          </form>
        </Card>

        {/* --- the register of everything entered once --- */}
        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">{t('receipts_payments')} · Register</h2>
            <Button variant="ghost" icon="BookOpen" onClick={() => navigate({ to: '/ims/finance/ledger' })}>{t('ledger_journal')} →</Button>
          </div>
          <DataTable columns={cols} rows={rows} onRowClick={setDetail} empty={t('no_records')} />
        </div>
      </div>

      <VoucherDetail item={detail} onClose={() => setDetail(null)} t={t} />
    </ImsLayout>
  );
}

function VoucherDetail({ item, onClose, t }) {
  const [entries, setEntries] = useState(null);
  useEffect(() => {
    if (!item) return undefined;
    let live = true;
    ims.dayBook({ transactionNo: item.transactionNo, limit: 50 })
      .then((d) => { if (live) setEntries(d.entries || []); })
      .catch(() => { if (live) setEntries([]); });
    return () => { live = false; };
  }, [item]);
  if (!item) return null;
  return (
    <DetailModal open onClose={onClose} wide title={item.transactionNo} subtitle={`${item.txnDate} · ${item.transactionType}`}
      badge={<Badge status={item.transactionType} />}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field2 label={[t('amount'), 'राशि']} value={`₹${Number(item.amount).toLocaleString('en-IN')}`} />
          <Field2 label={[t('payment_mode'), 'माध्यम']} value={item.paymentMode} />
          <Field2 label={[t('narration'), 'विवरण']} value={item.narration} />
        </div>
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">{t('journal')} · {t('double_entry_note')}</p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr><th className="px-3 py-2">Account</th><th className="px-3 py-2 text-right">{t('debit')}</th><th className="px-3 py-2 text-right">{t('credit')}</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(entries || []).map((e) => (
                  <tr key={e.id}>
                    <td className="px-3 py-2">{e.accountCode} · {e.accountName}</td>
                    <td className="px-3 py-2 text-right">{Number(e.debit) ? `₹${Number(e.debit).toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-3 py-2 text-right">{Number(e.credit) ? `₹${Number(e.credit).toLocaleString('en-IN')}` : '—'}</td>
                  </tr>
                ))}
                {entries && entries.length === 0 && <tr><td className="px-3 py-2 text-slate-400" colSpan={3}>—</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DetailModal>
  );
}

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15';

function L({ label, req, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">{label[0]} · {label[1]}{req && <span className="text-rose-500"> *</span>}</span>
      {children}
    </label>
  );
}

function RefSelect({ label, resource, value, onChange, nameKey = 'name' }) {
  const [opts, setOpts] = useState([]);
  useEffect(() => {
    let live = true;
    ims.list(resource, { limit: 200 }).then((d) => { if (live) setOpts(d.records || []); }).catch(() => {});
    return () => { live = false; };
  }, [resource]);
  return (
    <L label={label}>
      <select className={inp} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {opts.map((o) => <option key={o.id} value={o.id}>{o[nameKey] || o.recordId}</option>)}
      </select>
    </L>
  );
}
