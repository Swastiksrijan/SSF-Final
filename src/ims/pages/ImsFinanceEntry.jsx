import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import ImsLayout from '../ImsLayout';
import { Card, Badge, Button, SectionHero, StatStrip, DataTable, DetailModal, Field2 } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

// RECEIPTS & PAYMENTS — the single entry point for every financial transaction.
// One entry posts balanced double-entry ledger lines, so the Ledger, Journal,
// Trial Balance, Cash Book and Bank Book all update without a second entry.

const RECEIPT_TYPES = ['donation', 'contribution', 'grant', 'interest', 'csr', 'income', 'receipt'];
const PAYMENT_TYPES = ['expense', 'rent', 'travel', 'reimbursement', 'advance', 'capital', 'bankCharges', 'payment'];
const CONTRA_TYPES = ['transfer', 'adjustment'];

const emptyForm = () => ({
  txnDate: new Date().toISOString().slice(0, 10),
  transactionType: 'donation',
  amount: '',
  paymentMode: 'cash',
  cashAccountId: '',
  bankAccountId: '',
  accountId: '',
  fundId: '',
  projectId: '',
  costCentreId: '',
  partyId: '',
  narration: '',
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
  const kind = RECEIPT_TYPES.includes(form.transactionType) ? 'receipt'
    : PAYMENT_TYPES.includes(form.transactionType) ? 'payment'
      : CONTRA_TYPES.includes(form.transactionType) ? 'contra' : 'journal';

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!form.amount) { setErr('Amount is required · राशि आवश्यक है'); return; }
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      for (const k of ['cashAccountId', 'bankAccountId', 'accountId', 'fundId', 'projectId', 'partyId', 'costCentreId']) {
        if (!payload[k]) delete payload[k];
      }
      if (kind === 'receipt' && !payload.cashAccountId && !payload.bankAccountId) {
        setErr('Select the cash or bank account · रोकड़ या बैंक खाता चुनें'); setSaving(false); return;
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
    { key: 'amount', en: 'Amount', hi: 'राशि', align: 'right', render: (r) => <span className="font-semibold">₹{Number(r.amount).toLocaleString('en-IN')}</span> },
    { key: 'direction', en: 'Dr/Cr', render: (r) => r.direction === 'in'
      ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">In · Dr</span>
      : <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">Out · Cr</span> },
    { key: 'paymentMode', en: 'Mode', hi: 'माध्यम' },
    { key: 'costCentreId', en: 'Cost Centre', hi: 'लागत केंद्र', render: (r) => (r.costCentreId && ccMap[r.costCentreId]) ? <span className="text-xs font-semibold text-[#002344]">{ccMap[r.costCentreId]}</span> : '—' },
    { key: 'narration', en: 'Narration', hi: 'विवरण', render: (r) => (r.narration ? String(r.narration).slice(0, 34) : '—') },
  ];

  const k = (dash && dash.kpis) || {};

  return (
    <ImsLayout active="receipts_payments">
      <SectionHero title={t('receipts_payments')} hi="प्राप्तियाँ एवं भुगतान" eyebrow={t('finance')} icon="ReceiptText" tone="orange"
        actions={<Button variant="ghost" icon="BookOpen" onClick={() => navigate({ to: '/ims/finance/ledger' })}>{t('ledger_journal')}</Button>}>
        <p className="text-sm text-white/80">{t('receipts_payments_hint')} — {t('double_entry_note')}</p>
      </SectionHero>

      <div className="mb-5">
        <StatStrip items={[
          { labelKey: 'income', label: t('income'), value: `₹${Number(k.income || 0).toLocaleString('en-IN')}`, icon: 'TrendingUp', tone: 'green' },
          { labelKey: 'expenses', label: t('expenses'), value: `₹${Number(k.expense || 0).toLocaleString('en-IN')}`, icon: 'TrendingDown', tone: 'red' },
          { label: t('balance'), value: `₹${Number(k.net || 0).toLocaleString('en-IN')}`, icon: 'Scale', tone: 'navy' },
          { label: t('financial_years'), value: k.financialYear || '—', icon: 'CalendarRange', tone: 'orange' },
        ]} />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* --- the single entry form --- */}
        <Card className="p-4 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <span className={`grid h-9 w-9 place-items-center rounded-xl text-white ${kind === 'receipt' ? 'bg-emerald-600' : kind === 'payment' ? 'bg-rose-600' : 'bg-[#002344]'}`}>
              {kind === 'receipt' ? '↓' : kind === 'payment' ? '↑' : '⇄'}
            </span>
            <div>
              <p className="text-sm font-black text-[#002344]">{t('new_entry')}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{kind}</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <L label={[t('date'), 'दिनांक']}><input type="date" className={inp} value={form.txnDate} onChange={(e) => set('txnDate', e.target.value)} /></L>
              <L label={[t('amount'), 'राशि']} req><input type="number" min="0" step="0.01" className={inp} value={form.amount} onChange={(e) => set('amount', e.target.value)} /></L>
            </div>

            <L label={['Type', 'प्रकार']}>
              <select className={inp} value={form.transactionType} onChange={(e) => set('transactionType', e.target.value)}>
                <optgroup label="Receipts · प्राप्तियाँ">{RECEIPT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}</optgroup>
                <optgroup label="Payments · भुगतान">{PAYMENT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}</optgroup>
                <optgroup label="Contra · अंतरण">{CONTRA_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}</optgroup>
              </select>
            </L>

            <L label={[t('payment_mode'), 'भुगतान माध्यम']}>
              <select className={inp} value={form.paymentMode} onChange={(e) => set('paymentMode', e.target.value)}>
                {['cash', 'bank', 'upi', 'cheque', 'online'].map((o) => <option key={o} value={o}>{o}</option>)}
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
              <RefSelect label={[t('parties'), 'पक्ष']} resource="parties" value={form.partyId} onChange={(v) => set('partyId', v)} nameKey="name" />
              <RefSelect label={['Project', 'परियोजना']} resource="projects" value={form.projectId} onChange={(v) => set('projectId', v)} nameKey="name" />
            </div>

            <RefSelect label={[t('cost_centres'), 'लागत केंद्र']} resource="costCentres" value={form.costCentreId} onChange={(v) => set('costCentreId', v)} nameKey="name" />

            <L label={[t('narration'), 'विवरण']}>
              <textarea rows={2} className={inp} value={form.narration} onChange={(e) => set('narration', e.target.value)} />
            </L>

            {err && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{err}</p>}
            {msg && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{msg}</p>}

            <Button icon="Check" type="submit" disabled={saving}>{saving ? '…' : t('post_entry')}</Button>
          </form>
        </Card>

        {/* --- the register of everything entered once --- */}
        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-500">{t('receipts_payments')} · Register</h2>
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

const inp = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF6600]';

function L({ label, req, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-slate-500">{label[0]} · {label[1]}{req && <span className="text-rose-500"> *</span>}</span>
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
