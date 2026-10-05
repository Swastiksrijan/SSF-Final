import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import ImsLayout from '../ImsLayout';
import { Card, Badge, Button, SectionHero, StatStrip, DataTable, Tabs } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

// LEDGER & JOURNAL — everything derived from the single entry point.
// Trial Balance, Day Book (Journal), Cash Book, Bank Book, Account Ledger,
// Budget vs Actual. Read-only: the books follow from Receipts & Payments.
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function ImsFinanceLedger() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [tab, setTab] = useState('trial');
  const [tb, setTb] = useState(null);
  const [day, setDay] = useState(null);
  const [cash, setCash] = useState(null);
  const [bank, setBank] = useState(null);
  const [budget, setBudget] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [acctId, setAcctId] = useState('');
  const [ledger, setLedger] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    ims.trialBalance().then(setTb).catch((e) => setErr(e.message));
    ims.dayBook({ limit: 200 }).then(setDay).catch(() => {});
    ims.cashBook().then(setCash).catch(() => {});
    ims.bankBook().then(setBank).catch(() => {});
    ims.budgetVariance().then(setBudget).catch(() => {});
    ims.list('accounts', { limit: 200 }).then((d) => setAccounts(d.records || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!acctId) return undefined;
    let live = true;
    ims.accountLedger(acctId).then((d) => { if (live) setLedger(d); }).catch(() => { if (live) setLedger(null); });
    return () => { live = false; };
  }, [acctId]);

  return (
    <ImsLayout active="ledger_journal">
      <SectionHero title={t('ledger_journal')} hi="बही एवं रोजनामा" eyebrow={t('finance')} icon="BookOpen" tone="navy"
        actions={<Button variant="hero" icon="ReceiptText" onClick={() => navigate({ to: '/ims/finance/receipts-payments' })}>{t('receipts_payments')}</Button>}>
        <p className="text-sm text-white/80">{t('double_entry_note')}</p>
      </SectionHero>

      {err && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{err}</p>}

      <div className="mb-5">
        <StatStrip items={[
          { label: t('trial_balance'), value: tb ? `${tb.balanced ? '✓ ' : '✗ '}${inr(tb.totalDebit)}` : '…', icon: 'Scale', tone: tb && tb.balanced ? 'green' : 'red' },
          { label: t('cash_book'), value: cash ? inr(cash.closingBalance) : '…', icon: 'Banknote', tone: 'orange' },
          { label: t('bank_book'), value: bank ? inr(bank.closingBalance) : '…', icon: 'Landmark', tone: 'navy' },
          { label: t('budget_vs_actual'), value: budget ? inr(budget.totalActual) : '…', icon: 'Target', tone: 'slate' },
        ]} />
      </div>

      <div className="mb-4">
        <Tabs value={tab} onChange={setTab} tabs={[
          { id: 'trial', en: 'Trial Balance', hi: 'तलपट' },
          { id: 'day', en: 'Day Book', hi: 'रोजनामा', count: day ? day.entries.length : undefined },
          { id: 'cash', en: 'Cash Book', hi: 'रोकड़ बही' },
          { id: 'bank', en: 'Bank Book', hi: 'बैंक बही' },
          { id: 'account', en: 'Account Ledger', hi: 'खाता बही' },
          { id: 'budget', en: 'Budget vs Actual', hi: 'बजट एवं वास्तविक' },
        ]} />
      </div>

      {tab === 'trial' && (
        <div className="space-y-3">
          {tb && (
            <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${tb.balanced ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {tb.balanced ? `✓ ${t('balanced')}` : `✗ ${t('unbalanced')}`} · Dr {inr(tb.totalDebit)} = Cr {inr(tb.totalCredit)}
            </p>
          )}
          <DataTable rows={tb ? tb.accounts : null} empty={t('no_records')} columns={[
            { key: 'accountCode', en: 'Code', hi: 'कोड', render: (r) => <span className="font-mono text-xs text-slate-500">{r.accountCode}</span> },
            { key: 'accountName', en: 'Account', hi: 'खाता', render: (r) => <span className="font-semibold text-[#002344]">{r.accountName}</span> },
            { key: 'debit', en: 'Debit', hi: 'नामे', align: 'right', render: (r) => inr(r.debit) },
            { key: 'credit', en: 'Credit', hi: 'जमा', align: 'right', render: (r) => inr(r.credit) },
            { key: 'side', en: 'Balance', hi: 'शेष', align: 'right', render: (r) => `${inr(r.balance)} ${r.side}` },
          ]} />
        </div>
      )}

      {tab === 'day' && (
        <DataTable rows={day ? day.entries : null} empty={t('no_records')} columns={[
          { key: 'entryDate', en: 'Date', hi: 'दिनांक' },
          { key: 'voucherNo', en: 'Voucher', render: (r) => <span className="font-mono text-xs text-slate-500">{r.voucherNo}</span> },
          { key: 'voucherType', en: 'Type', render: (r) => <Badge status={r.voucherType} /> },
          { key: 'accountName', en: 'Account', hi: 'खाता', render: (r) => `${r.accountCode} · ${r.accountName}` },
          { key: 'debit', en: 'Debit', hi: 'नामे', align: 'right', render: (r) => (Number(r.debit) ? inr(r.debit) : '—') },
          { key: 'credit', en: 'Credit', hi: 'जमा', align: 'right', render: (r) => (Number(r.credit) ? inr(r.credit) : '—') },
          { key: 'narration', en: 'Narration', hi: 'विवरण', render: (r) => (r.narration ? String(r.narration).slice(0, 28) : '—') },
        ]} />
      )}

      {tab === 'cash' && <BookView book={cash} t={t} />}
      {tab === 'bank' && <BookView book={bank} t={t} />}

      {tab === 'account' && (
        <div className="space-y-3">
          <Card className="flex flex-wrap items-center gap-3 p-3">
            <span className="text-sm font-semibold text-slate-600">{t('all_accounts')}:</span>
            <select className="min-w-[240px] rounded-lg border border-slate-300 px-3 py-2 text-sm" value={acctId} onChange={(e) => setAcctId(e.target.value)}>
              <option value="">— {t('chart_of_accounts')} —</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.code} · {a.name}</option>)}
            </select>
            {ledger && <span className="text-sm font-bold text-[#002344]">{t('balance')}: {inr(ledger.closingBalance)}</span>}
          </Card>
          <DataTable rows={ledger ? ledger.entries : []} empty={t('no_records')} columns={[
            { key: 'entryDate', en: 'Date', hi: 'दिनांक' },
            { key: 'voucherNo', en: 'Voucher' },
            { key: 'debit', en: 'Debit', hi: 'नामे', align: 'right', render: (r) => (Number(r.debit) ? inr(r.debit) : '—') },
            { key: 'credit', en: 'Credit', hi: 'जमा', align: 'right', render: (r) => (Number(r.credit) ? inr(r.credit) : '—') },
            { key: 'balance', en: 'Balance', hi: 'शेष', align: 'right', render: (r) => inr(r.balance) },
            { key: 'narration', en: 'Narration', hi: 'विवरण', render: (r) => (r.narration ? String(r.narration).slice(0, 28) : '—') },
          ]} />
        </div>
      )}

      {tab === 'budget' && (
        <DataTable rows={budget ? budget.rows : null} empty={t('no_records')} columns={[
          { key: 'accountName', en: 'Account', hi: 'खाता', render: (r) => <span className="font-semibold text-[#002344]">{r.accountName}</span> },
          { key: 'amount', en: 'Budget', hi: 'बजट', align: 'right', render: (r) => inr(r.amount) },
          { key: 'actual', en: 'Actual', hi: 'वास्तविक', align: 'right', render: (r) => inr(r.actual) },
          { key: 'variance', en: 'Variance', hi: 'अंतर', align: 'right', render: (r) => <span className={r.variance < 0 ? 'font-semibold text-rose-600' : 'font-semibold text-emerald-600'}>{inr(r.variance)}</span> },
          { key: 'utilisation', en: 'Utilisation', hi: 'उपयोग', align: 'right', render: (r) => `${r.utilisation}%` },
        ]} />
      )}
    </ImsLayout>
  );
}

function BookView({ book, t }) {
  const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  return (
    <div className="space-y-3">
      {book && book.account && (
        <p className="text-sm font-semibold text-slate-600">{book.account.code} · {book.account.name} — <span className="font-bold text-[#002344]">{t('balance')}: {inr(book.closingBalance)}</span></p>
      )}
      <DataTable rows={book ? book.entries : null} empty={t('no_records')} columns={[
        { key: 'entryDate', en: 'Date', hi: 'दिनांक' },
        { key: 'voucherNo', en: 'Voucher' },
        { key: 'inflow', en: 'Receipt (Dr)', hi: 'प्राप्ति', align: 'right', render: (r) => (Number(r.inflow) ? inr(r.inflow) : '—') },
        { key: 'outflow', en: 'Payment (Cr)', hi: 'भुगतान', align: 'right', render: (r) => (Number(r.outflow) ? inr(r.outflow) : '—') },
        { key: 'balance', en: 'Balance', hi: 'शेष', align: 'right', render: (r) => inr(r.balance) },
        { key: 'narration', en: 'Narration', hi: 'विवरण', render: (r) => (r.narration ? String(r.narration).slice(0, 28) : '—') },
      ]} />
    </div>
  );
}
