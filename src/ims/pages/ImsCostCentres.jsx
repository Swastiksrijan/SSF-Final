import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Badge, Button, SectionHero, StatStrip, Tabs, DataTable, Empty, Spinner, FormDrawer } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { schemaFor } from '../schemas';
import { exportRecordsPdf } from '../pdf';
import { exportRecordsExcel } from '../excel';

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const TYPE_KEYS = { programme: 'Programme', project: 'Project', department: 'Department', location: 'Location', activity: 'Activity', institutional: 'Institutional' };

// COST CENTRES — the financial classification & reporting dimension.
// NEVER a second entry point: all figures come from Receipts & Payments
// vouchers, classified here by programme/project/location/activity.
export default function ImsCostCentres() {
  const { t } = useLang();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const openId = search && search.cc ? String(search.cc) : null;

  const [dash, setDash] = useState(null);
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState({ centreType: '', category: '', status: '' });
  const [drawer, setDrawer] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setRows(null);
    try {
      const [d, l] = await Promise.all([ims.costCentreDashboard({}), ims.costCentres({})]);
      setDash(d);
      setRows(l.records || []);
    } catch (e) { setErr(e.message); setRows([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const open = (row) => navigate({ to: '/ims/finance/cost-centres', search: { cc: String(row.id) } });
  const close = () => navigate({ to: '/ims/finance/cost-centres' });

  const filtered = useMemo(() => {
    let list = rows || [];
    if (tab === 'active') list = list.filter((r) => r.status === 'active');
    if (tab === 'overspent') list = list.filter((r) => r.overspent);
    if (tab === 'closed') list = list.filter((r) => ['closed', 'archived'].includes(r.status) || r.isClosed);
    if (filters.centreType) list = list.filter((r) => r.centreType === filters.centreType);
    if (filters.category) list = list.filter((r) => r.category === filters.category);
    if (filters.status) list = list.filter((r) => r.status === filters.status);
    const needle = q.trim().toLowerCase();
    if (needle) list = list.filter((r) => [r.name, r.nameHi, r.recordId, r.shortCode, r.category, r.location, r.district, r.programmeName, r.projectName]
      .some((v) => v && String(v).toLowerCase().includes(needle)));
    return list;
  }, [rows, tab, q, filters]);

  if (openId) return <CostCentreWorkspace id={openId} onBack={close} onChanged={load} />;

  const k = (dash && dash.kpis) || {};
  const cols = [
    { key: 'recordId', en: 'ID', render: (r) => <span className="font-mono text-xs text-slate-500">{r.recordId}</span> },
    { key: 'name', en: 'Cost Centre', hi: 'लागत केंद्र', render: (r) => (
      <div>
        <p className="font-semibold text-[#002344]">{r.name}</p>
        <p className="text-[11px] text-slate-400">{TYPE_KEYS[r.centreType] || r.centreType || '—'}{r.category ? ` · ${r.category}` : ''}{r.programmeName ? ` · ${r.programmeName}` : ''}</p>
      </div>
    ) },
    { key: 'budget', en: 'Budget', hi: 'बजट', align: 'right', render: (r) => <span className="font-semibold">{money(r.budget)}</span> },
    { key: 'actualExpense', en: 'Actual', hi: 'वास्तविक', align: 'right', render: (r) => <span>{money(r.actualExpense)}</span> },
    { key: 'balance', en: 'Balance', hi: 'शेष', align: 'right', render: (r) => <span className={r.variance < 0 ? 'font-semibold text-rose-600' : ''}>{money(r.balance)}</span> },
    { key: 'utilisation', en: 'Util.', render: (r) => <UtilBar pct={r.utilisation} over={r.overspent} /> },
    { key: 'status', en: 'Status', hi: 'स्थिति', render: (r) => <Badge status={r.status} /> },
  ];

  const exportRows = filtered.map((r) => ({
    ID: r.recordId, Name: r.name, Type: TYPE_KEYS[r.centreType] || r.centreType, Category: r.category,
    Programme: r.programmeName || '', Project: r.projectName || '', Location: r.location || '',
    Budget: r.budget, Actual: r.actualExpense, Balance: r.balance, Utilisation: `${r.utilisation}%`, Status: r.status,
  }));
  const doCsv = () => {
    const cols2 = Object.keys(exportRows[0] || {});
    const csv = [cols2.join(',')].concat(exportRows.map((r) => cols2.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `ssf-cost-centres-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <ImsLayout active="cost_centres">
      <SectionHero title={t('cost_centres')} hi="लागत केंद्र" eyebrow={t('finance')} icon="Target" tone="navy"
        actions={<>
          <Button variant="hero" icon="FileDown" onClick={() => exportRecordsPdf({ title: t('cost_centres'), subtitle: t('app_full'), records: exportRows })}>{t('download')} PDF</Button>
          <Button variant="hero" icon="Table" onClick={() => exportRecordsExcel({ title: t('cost_centres'), records: exportRows, sheetName: 'Cost Centres' })}>Excel</Button>
          <Button variant="hero" icon="FileText" onClick={doCsv}>CSV</Button>
          <Button variant="hero" icon="Plus" onClick={() => setDrawer({ mode: 'create', initial: { status: 'draft' } })}>{t('new_record')}</Button>
        </>}>
        <p className="text-sm text-white/80">{t('cost_centre_hint')}</p>
      </SectionHero>

      {err && <Card className="mb-3 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}

      <div className="mb-5">
        <StatStrip items={[
          { labelKey: 'total_cost_centres', value: k.total || 0, icon: 'Target', tone: 'navy' },
          { labelKey: 'active', value: k.active || 0, icon: 'CircleCheck', tone: 'green' },
          { labelKey: 'total_budget', value: money(k.totalBudget), icon: 'Wallet', tone: 'slate' },
          { labelKey: 'actual_expense', value: money(k.totalExpense), icon: 'TrendingDown', tone: 'orange' },
          { labelKey: 'total_income', value: money(k.totalIncome), icon: 'TrendingUp', tone: 'green' },
          { labelKey: 'remaining_budget', value: money(k.remaining), icon: 'Scale', tone: 'navy' },
          { labelKey: 'overspent', value: k.overspent || 0, icon: 'TriangleAlert', tone: (k.overspent ? 'red' : 'slate') },
          { labelKey: 'closed', value: k.closed || 0, icon: 'Archive', tone: 'slate' },
        ]} />
      </div>

      <Tabs tabs={[
        { id: 'all', en: t('all'), hi: 'सभी', count: (rows || []).length },
        { id: 'active', en: t('active'), hi: 'सक्रिय', count: k.active },
        { id: 'overspent', en: t('overspent'), hi: 'अधिक व्यय', count: k.overspent },
        { id: 'closed', en: t('closed'), hi: 'बंद', count: k.closed },
      ]} value={tab} onChange={setTab} />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Icons.Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_placeholder')}
            className="rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm outline-none focus:border-[#FF6600]" />
        </div>
        <Select value={filters.centreType} onChange={(v) => setFilters((f) => ({ ...f, centreType: v }))}
          options={Object.entries(TYPE_KEYS).map(([v, l]) => [v, l])} placeholder={t('type')} />
        <Select value={filters.status} onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
          options={[['draft', 'Draft'], ['active', 'Active'], ['onHold', 'On Hold'], ['closing', 'Closing'], ['closed', 'Closed'], ['archived', 'Archived']]} placeholder={t('status')} />
        <span className="ml-auto text-xs font-semibold text-slate-400">{filtered.length} / {(rows || []).length}</span>
      </div>

      <DataTable columns={cols} rows={filtered} onRowClick={open} empty={t('no_records')} />

      <FormDrawer open={!!drawer} title={t('new_record')} schema={schemaFor('costCentres')}
        initial={drawer && drawer.initial} saving={saving}
        onClose={() => setDrawer(null)}
        onSubmit={async (form) => {
          setSaving(true); setErr('');
          try { await ims.create('costCentres', form, true); setDrawer(null); await load(); }
          catch (e) { setErr(e.message); } finally { setSaving(false); }
        }} />
    </ImsLayout>
  );
}

function UtilBar({ pct, over }) {
  const p = Math.min(100, Math.max(0, pct || 0));
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${over ? 'bg-rose-500' : p > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${p}%` }} />
      </div>
      <span className={`text-xs font-semibold ${over ? 'text-rose-600' : 'text-slate-500'}`}>{pct || 0}%</span>
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#FF6600]">
      <option value="">{placeholder} · —</option>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

/* ------------------------------------------------------------------ */
/* Detail workspace: Overview · Budget · Transactions · Programme/     */
/* Project · Documents · Reports · Audit History  (spec §22, §51)      */
/* ------------------------------------------------------------------ */
function CostCentreWorkspace({ id, onBack, onChanged }) {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('overview');
  const [monthly, setMonthly] = useState(null);
  const [quarterly, setQuarterly] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setData(null);
    try { setData(await ims.costCentre(id)); }
    catch (e) { setErr(e.message); }
  }, [id]);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (tab === 'reports' && !monthly) {
      ims.costCentreMonthly(id).then(setMonthly).catch(() => {});
      ims.costCentreQuarterly(id).then(setQuarterly).catch(() => {});
    }
  }, [tab, id, monthly]);

  if (err) return <ImsLayout active="cost_centres"><Card className="border-rose-200 bg-rose-50 p-4 text-rose-700">{err}</Card><Button className="mt-3" variant="ghost" icon="ArrowLeft" onClick={onBack}>{t('back')}</Button></ImsLayout>;
  if (!data) return <ImsLayout active="cost_centres"><Spinner /></ImsLayout>;

  const c = data.costCentre;
  const s = data.summary;
  const setStatus = async (status) => {
    setBusy(true);
    try { await ims.costCentreSetStatus(id, status); await load(); onChanged && onChanged(); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const regCols = [
    { key: 'date', en: 'Date', hi: 'दिनांक' },
    { key: 'voucherNo', en: 'Voucher', render: (r) => <span className="font-mono text-xs text-slate-500">{r.voucherNo}</span> },
    { key: 'accountName', en: 'Ledger', hi: 'लेखा' },
    { key: 'narration', en: 'Particulars', hi: 'विवरण', render: (r) => (r.narration ? String(r.narration).slice(0, 30) : '—') },
    { key: 'debit', en: 'Debit', align: 'right', render: (r) => (r.debit ? money(r.debit) : '—') },
    { key: 'credit', en: 'Credit', align: 'right', render: (r) => (r.credit ? money(r.credit) : '—') },
    { key: 'balance', en: 'Balance', align: 'right', render: (r) => <span className="font-semibold">{money(r.balance)}</span> },
  ];

  return (
    <ImsLayout active="cost_centres">
      <SectionHero title={c.name} hi={c.nameHi} eyebrow={c.recordId} icon="Target" tone="navy"
        actions={<>
          <Button variant="hero" icon="ArrowLeft" onClick={onBack}>{t('back')}</Button>
          <Button variant="hero" icon="FileDown" onClick={() => exportRecordsPdf({ title: c.name, subtitle: `${c.recordId} · ${t('cost_centres')}`, records: data.register })}>{t('download')} PDF</Button>
        </>}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-semibold text-white/85">
          <span>{TYPE_KEYS[c.centreType] || c.centreType || '—'}</span>
          <span>{c.category || '—'}</span>
          {c.programmeName && <span>▸ {c.programmeName}</span>}
          {c.projectName && <span>▸ {c.projectName}</span>}
          {c.location && <span>📍 {c.location}</span>}
          <Badge status={c.status} />
          {s.overspent && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold">⚠ {t('budget_exceeded')}</span>}
        </div>
      </SectionHero>

      <div className="mb-5">
        <StatStrip items={[
          { labelKey: 'budget', value: money(s.budget), icon: 'Wallet', tone: 'slate' },
          { labelKey: 'actual_expense', value: money(s.expense), icon: 'TrendingDown', tone: 'orange' },
          { labelKey: 'total_income', value: money(s.income), icon: 'TrendingUp', tone: 'green' },
          { labelKey: 'remaining_budget', value: money(s.balance), icon: 'Scale', tone: s.variance < 0 ? 'red' : 'navy' },
        ]} />
      </div>

      <Tabs tabs={[
        { id: 'overview', en: t('overview'), hi: 'अवलोकन' },
        { id: 'budget', en: t('budget'), hi: 'बजट' },
        { id: 'transactions', en: t('transactions'), hi: 'लेनदेन', count: data.register.length },
        { id: 'mapping', en: t('programme_project'), hi: 'कार्यक्रम/परियोजना' },
        { id: 'documents', en: t('documents'), hi: 'दस्तावेज़' },
        { id: 'reports', en: t('reports'), hi: 'रिपोर्ट' },
        { id: 'audit', en: t('audit_history'), hi: 'लेखा इतिहास' },
      ]} value={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('overview')}</h2>
            <dl className="space-y-2 text-sm">
              <Row k={t('cost_centre_id')} v={c.recordId} />
              <Row k={t('name')} v={c.name} />
              <Row k={t('hindi_name')} v={c.nameHi} />
              <Row k={t('short_code')} v={c.shortCode} />
              <Row k={t('type')} v={TYPE_KEYS[c.centreType] || c.centreType} />
              <Row k={t('category')} v={c.category} />
              <Row k={t('status')} v={<Badge status={c.status} />} />
              <Row k={t('description')} v={c.description} />
              <Row k={t('purpose')} v={c.purpose} />
            </dl>
          </Card>
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('financial_summary')}</h2>
            <dl className="space-y-2 text-sm">
              <Row k={t('budget')} v={money(s.budget)} />
              <Row k={t('actual_expense')} v={money(s.expense)} />
              <Row k={t('total_income')} v={money(s.income)} />
              <Row k={t('remaining_budget')} v={money(s.balance)} />
              <Row k={t('variance')} v={<span className={s.variance < 0 ? 'font-semibold text-rose-600' : 'text-emerald-600'}>{money(s.variance)}</span>} />
              <Row k={t('utilisation')} v={`${s.utilisation}%`} />
              <Row k={t('transactions')} v={s.transactions} />
            </dl>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{t('status_actions')}</p>
              <div className="flex flex-wrap gap-2">
                {c.status === 'draft' && <Button variant="navy" icon="CircleCheck" disabled={busy} onClick={() => setStatus('active')}>{t('approve_activate')}</Button>}
                {c.status === 'active' && <Button variant="ghost" icon="Pause" disabled={busy} onClick={() => setStatus('onHold')}>{t('put_on_hold')}</Button>}
                {['active', 'onHold', 'closing'].includes(c.status) && <Button variant="ghost" icon="Lock" disabled={busy} onClick={() => setStatus('closing')}>{t('start_closing')}</Button>}
                {c.status !== 'closed' && <Button variant="danger" icon="Archive" disabled={busy} onClick={() => setStatus('closed')}>{t('close')}</Button>}
                {['closed', 'archived'].includes(c.status) && <Button variant="ghost" icon="RotateCcw" disabled={busy} onClick={() => setStatus('active')}>{t('reopen')}</Button>}
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'budget' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('budget')}</h2>
            <dl className="space-y-2 text-sm">
              <Row k={t('approved_budget')} v={money(c.approvedBudget)} />
              <Row k={t('current_budget')} v={money(c.currentBudget)} />
              <Row k={t('budget_head')} v={c.budgetHead} />
              <Row k={t('financial_years')} v={c.financialYearId ? `#${c.financialYearId}` : null} />
              <Row k={t('funds')} v={c.fundName} />
              <Row k={t('start_date')} v={c.startDate} />
              <Row k={t('end_date')} v={c.endDate} />
            </dl>
          </Card>
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('budget_control')}</h2>
            <div className="space-y-3">
              <BudgetLine label={t('budget')} value={money(s.budget)} />
              <BudgetLine label={t('actual_expense')} value={money(s.expense)} />
              <BudgetLine label={t('remaining_budget')} value={money(s.balance)} tone={s.variance < 0 ? 'red' : 'green'} />
              <BudgetLine label={t('utilisation')} value={`${s.utilisation}%`} tone={s.overspent ? 'red' : s.utilisation > 80 ? 'amber' : 'green'} />
            </div>
            {s.overspent && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">⚠ {t('budget_exceeded')} — {money(s.expense - s.budget)}</p>}
            {data.budgets && data.budgets.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{t('linked_budget_lines')}</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  {data.budgets.map((b) => <li key={b.id} className="flex justify-between border-b border-dashed border-slate-200 pb-1"><span>{b.period || 'annual'}</span><span className="font-semibold">{money(b.amount)}</span></li>)}
                </ul>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab === 'transactions' && (
        <>
          <p className="mb-2 text-xs text-slate-500">{t('cc_txn_note')}</p>
          <DataTable columns={regCols} rows={data.register} empty={t('no_records')} />
        </>
      )}

      {tab === 'mapping' && (
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('programme_project')}</h2>
          <dl className="space-y-2 text-sm">
            <Row k={t('programmes')} v={c.programmeName} />
            <Row k={t('projects')} v={c.projectName} />
            <Row k={t('department')} v={c.department} />
            <Row k={t('location')} v={c.location} />
            <Row k={t('district')} v={c.district} />
            <Row k={t('state')} v={c.state} />
            <Row k={t('responsible_person')} v={c.responsibleName} />
            <Row k={t('approval_authority')} v={c.approvalAuthority} />
            <Row k={t('approval_date')} v={c.approvalDate} />
            <Row k={t('resolution_reference')} v={c.resolutionReference} />
          </dl>
        </Card>
      )}

      {tab === 'documents' && (
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('documents')}</h2>
          {data.linked.documents.length === 0 ? <Empty label={t('no_records')} /> : (
            <ul className="space-y-2">
              {data.linked.documents.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                  <span className="text-sm font-semibold text-slate-700">{d.title}</span>
                  <span className="font-mono text-xs text-slate-400">{d.recordId}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-slate-400">{t('cc_doc_note')}</p>
        </Card>
      )}

      {tab === 'reports' && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{t('monthly_report')}</h2>
              {monthly && <Button variant="ghost" icon="FileDown" onClick={() => exportRecordsPdf({ title: `${c.name} — ${t('monthly_report')}`, records: monthly.months })}>PDF</Button>}
            </div>
            {!monthly ? <Spinner /> : monthly.months.length === 0 ? <Empty label={t('no_records')} /> : (
              <DataTable columns={[
                { key: 'month', en: 'Month', hi: 'माह' },
                { key: 'opening', en: 'Opening', align: 'right', render: (r) => money(r.opening) },
                { key: 'income', en: 'Income', align: 'right', render: (r) => money(r.income) },
                { key: 'expense', en: 'Expense', align: 'right', render: (r) => money(r.expense) },
                { key: 'closing', en: 'Closing', align: 'right', render: (r) => <span className="font-semibold">{money(r.closing)}</span> },
              ]} rows={monthly.months} />
            )}
          </Card>
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{t('quarterly_report')}</h2>
              {quarterly && <Button variant="ghost" icon="FileDown" onClick={() => exportRecordsPdf({ title: `${c.name} — ${t('quarterly_report')}`, records: quarterly.quarters })}>PDF</Button>}
            </div>
            {!quarterly ? <Spinner /> : (
              <DataTable columns={[
                { key: 'quarter', en: 'Quarter' },
                { key: 'budget', en: 'Budget', align: 'right', render: (r) => money(r.budget) },
                { key: 'expense', en: 'Actual', align: 'right', render: (r) => money(r.expense) },
                { key: 'variance', en: 'Variance', align: 'right', render: (r) => <span className={r.variance < 0 ? 'text-rose-600 font-semibold' : ''}>{money(r.variance)}</span> },
                { key: 'utilisation', en: 'Util.', align: 'right', render: (r) => `${r.utilisation}%` },
              ]} rows={quarterly.quarters} />
            )}
          </Card>
        </div>
      )}

      {tab === 'audit' && <AuditHistory id={id} />}
    </ImsLayout>
  );
}

function AuditHistory({ id }) {
  const { t } = useLang();
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let live = true;
    ims.history('costCentres', id).then((d) => { if (live) setRows(d.history || []); }).catch(() => { if (live) setRows([]); });
    return () => { live = false; };
  }, [id]);
  if (!rows) return <Spinner />;
  if (!rows.length) return <Card className="p-5"><Empty label={t('no_records')} /></Card>;
  return (
    <Card className="p-5">
      <ol className="relative space-y-4 border-l border-slate-200 pl-4">
        {rows.map((h) => (
          <li key={h.id} className="relative">
            <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-[#FF6600]" />
            <div className="flex items-center gap-2">
              <Badge status={h.action} />
              <span className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString('en-IN')}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{t('edited_by')} <b>{h.actor}</b></p>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-3 border-b border-dashed border-slate-200 pb-1.5">
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-right font-semibold text-slate-800">{v === null || v === undefined || v === '' ? '—' : v}</dd>
    </div>
  );
}

function BudgetLine({ label, value, tone = 'navy' }) {
  const colors = { navy: 'text-[#002344]', green: 'text-emerald-600', red: 'text-rose-600', amber: 'text-amber-600' };
  return (
    <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1.5">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-bold ${colors[tone]}`}>{value}</span>
    </div>
  );
}
