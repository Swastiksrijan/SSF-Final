import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Badge, Button, SectionHero, Kpi, DataTable } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// FINANCE DASHBOARD — the head of the finance tree. Receipts & Payments is the
// single entry point; everything else (masters + books) hangs off it.
const MASTERS = [
  { key: 'financial_years', resource: 'financialYears', icon: 'CalendarRange' },
  { key: 'funds', resource: 'funds', icon: 'Wallet' },
  { key: 'chart_of_accounts', resource: 'accounts', icon: 'BookOpen' },
  { key: 'cost_centres', resource: 'costCentres', icon: 'Target' },
  { key: 'bank_accounts', resource: 'bankAccounts', icon: 'Landmark' },
  { key: 'cash_accounts', resource: 'cashAccounts', icon: 'Banknote' },
  { key: 'parties', resource: 'parties', icon: 'Handshake' },
];

export default function ImsFinanceDashboard() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');

  const load = () => ims.financeDashboard().then(setD).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const k = (d && d.kpis) || {};

  return (
    <ImsLayout active="finance_dashboard">
      <SectionHero title={t('finance_dashboard')} hi="वित्त डैशबोर्ड" eyebrow={t('finance')} icon="PieChart" tone="orange"
        actions={<Button variant="hero" icon="Plus" onClick={() => navigate({ to: '/ims/finance/receipts-payments' })}>{t('new_entry')}</Button>}>
        <p className="text-sm text-white/80">{t('tagline')}</p>
      </SectionHero>

      {err && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{err}</p>}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon="TrendingUp" label={t('income')} value={inr(k.income)} tone="green" />
        <Kpi icon="TrendingDown" label={t('expenses')} value={inr(k.expense)} tone="red" />
        <Kpi icon="Scale" label={t('net_surplus')} value={inr(k.net)} tone={k.net >= 0 ? 'navy' : 'red'} />
        <Kpi icon="CalendarRange" label={t('financial_years')} value={k.financialYear || '—'} tone="orange" />
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon="Landmark" label={t('total_assets')} value={inr(k.assets)} tone="navy" />
        <Kpi icon="Wallet" label={t('funds')} value={k.funds ?? 0} tone="orange" />
        <Kpi icon="BookOpen" label={t('chart_of_accounts')} value={k.accounts ?? 0} tone="slate" />
        <Kpi icon="ReceiptText" label={t('vouchers')} value={k.vouchers ?? 0} tone="navy" />
      </div>

      {/* Single entry point call-out */}
      <Card className="mb-5 flex flex-wrap items-center justify-between gap-4 border-l-4 border-[#FF6600] p-4">
        <div>
          <p className="text-base font-black text-[#002344]">{t('receipts_payments')} — {t('receipts_payments_hint')}</p>
          <p className="mt-0.5 text-sm text-slate-500">{t('double_entry_note')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="hero" icon="ReceiptText" onClick={() => navigate({ to: '/ims/finance/receipts-payments' })}>{t('receipts_payments')}</Button>
          <Button variant="ghost" icon="BookOpen" onClick={() => navigate({ to: '/ims/finance/ledger' })}>{t('ledger_journal')}</Button>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Finance masters (the finance tree) */}
        <Card className="p-4 lg:col-span-1">
          <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">{t('finance')} — {t('all_accounts')}</h2>
          <div className="space-y-1.5">
            {MASTERS.map((m) => {
              const I = Icons[m.icon] || Icons.Circle;
              return (
                <button key={m.key} onClick={() => navigate({ to: '/ims/r/$resource', params: { resource: m.resource } })}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-600 hover:bg-slate-100">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#002344]/5 text-[#002344]"><I size={16} /></span>
                  {t(m.key)}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Trial balance status + recent vouchers */}
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-500">{t('trial_balance')}</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${k.trialBalanced ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {k.trialBalanced ? `✓ ${t('balanced')}` : `✗ ${t('unbalanced')}`}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3"><span className="block text-[11px] font-semibold uppercase text-slate-400">{t('debit')}</span><span className="text-lg font-black text-[#002344]">{inr(d && d.trialBalance && d.trialBalance.totalDebit)}</span></div>
              <div className="rounded-xl bg-slate-50 p-3"><span className="block text-[11px] font-semibold uppercase text-slate-400">{t('credit')}</span><span className="text-lg font-black text-[#002344]">{inr(d && d.trialBalance && d.trialBalance.totalCredit)}</span></div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="ghost" icon="BookOpen" onClick={() => navigate({ to: '/ims/finance/ledger' })}>{t('ledger_journal')}</Button>
            </div>
          </Card>

          <div>
            <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">{t('vouchers')}</h2>
            <DataTable rows={d ? d.recentVouchers : null} empty={t('no_records')} columns={[
              { key: 'voucherNo', en: 'Voucher', render: (r) => <span className="font-mono text-xs text-slate-500">{r.voucherNo}</span> },
              { key: 'voucherType', en: 'Type', render: (r) => <Badge status={r.voucherType} /> },
              { key: 'voucherDate', en: 'Date', hi: 'दिनांक' },
              { key: 'amount', en: 'Amount', hi: 'राशि', align: 'right', render: (r) => inr(r.amount) },
            ]} />
          </div>
        </div>
      </div>
    </ImsLayout>
  );
}
