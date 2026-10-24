import { useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Kpi, Badge, Spinner, DetailModal, Field2 } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

/**
 * Audited Financial Statements — the year-wise audit-report register.
 *
 * Read-only. The figures are the CA-signed audited statements transcribed into
 * backend_node/data/auditReports.json, which is the single source of truth, so
 * this screen can never disagree with the signed report. Each year opens to its
 * Income & Expenditure account, the Receipts & Payments position and the
 * Balance Sheet, exactly as the auditor signed it.
 */
const money = (n) => '\u20B9' + (Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money0 = (n) => '\u20B9' + (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
const signed = (n) => (Number(n) > 0 ? '+' : Number(n) < 0 ? '\u2212' : '') + money0(Math.abs(Number(n) || 0));
const dmy = (d) => {
  if (!d) return '\u2014';
  const p = String(d).slice(0, 10).split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
};

function HeadTable({ title, heads, total, tone = 'navy', hi }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className={`text-left text-[11px] font-bold uppercase tracking-wider ${tone === 'green' ? 'bg-emerald-50 text-emerald-700' : tone === 'red' ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-500'}`}>
            <th className="px-3 py-2">{hi ? 'शीर्षक' : 'Head'}</th>
            <th className="px-3 py-2 text-right">{hi ? 'राशि' : 'Amount'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(heads || []).map((h, i) => (
            <tr key={i}>
              <td className="px-3 py-2 text-slate-700">{h.head}</td>
              <td className="px-3 py-2 text-right font-semibold tabular-nums text-slate-800">{money(h.amount)}</td>
            </tr>
          ))}
          <tr className="bg-slate-50/80 font-black text-[#12345A]">
            <td className="px-3 py-2">{hi ? 'कुल' : 'Total'}</td>
            <td className="px-3 py-2 text-right tabular-nums">{money(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function MiniStat({ label, value, tone = 'navy' }) {
  const cls = tone === 'green' ? 'text-emerald-600' : tone === 'red' ? 'text-rose-600' : 'text-[#12345A]';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`mt-0.5 text-base font-black tabular-nums ${cls}`}>{value}</div>
    </div>
  );
}

export default function ImsAuditReports() {
  const { lang } = useLang();
  const hi = lang === 'hi';
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [fileErr, setFileErr] = useState('');
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let alive = true;
    ims.auditReports()
      .then((d) => { if (alive) setData(d); })
      .catch((e) => { if (alive) setErr(e.message); });
    return () => { alive = false; };
  }, []);

  const years = useMemo(() => ((data && data.years) || []).slice().reverse(), [data]);
  const active = useMemo(() => years.find((y) => y.financialYear === open) || null, [years, open]);

  useEffect(() => { setFileErr(''); }, [open]);

  return (
    <ImsLayout active="audit_reports">
      <PageHeader
        title={hi ? 'लेखापरीक्षित वित्तीय विवरण' : 'Audited Financial Statements'}
        subtitle={hi
          ? 'सी.ए. द्वारा हस्ताक्षरित वर्ष-वार लेखा परीक्षा प्रतिवेदन — आय-व्यय, प्राप्ति-भुगतान एवं तुलन-पत्र।'
          : 'Year-wise audit reports as signed by the Chartered Accountant \u2014 Income & Expenditure, Receipts & Payments and Balance Sheet.'}
      />

      {err && <Card className="mb-4 p-4 text-sm text-rose-700">{err}</Card>}
      {!data && !err && <Spinner />}

      {data && (
        <>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon="FileCheck2" label={hi ? 'लेखापरीक्षित वर्ष' : 'Audited years'} value={data.totals.auditedYears} tone="navy" />
            <Kpi icon="CalendarClock" label={hi ? 'शेष वर्ष' : 'Years pending'} value={data.totals.pendingYears} tone="amber" />
            <Kpi icon="TrendingUp" label={hi ? 'कुल आय' : 'Total income'} value={money0(data.totals.income)} tone="teal" />
            <Kpi icon="TrendingDown" label={hi ? 'कुल व्यय' : 'Total expenditure'} value={money0(data.totals.expenditure)} tone="orange" />
          </div>

          {data.note && (
            <Card className="mb-5 flex items-start gap-3 p-4">
              <Icons.Info size={16} className="mt-0.5 shrink-0 text-[#176447]" />
              <p className="text-xs leading-relaxed text-slate-500">{data.note}</p>
            </Card>
          )}

          <div className="space-y-3">
            {years.map((y) => {
              const surplus = y.result && y.result.type === 'surplus';
              return (
                <Card key={y.financialYear} className="overflow-hidden">
                  <button type="button" onClick={() => setOpen(y.financialYear)}
                    className="flex w-full flex-wrap items-center gap-4 p-4 text-left hover:bg-slate-50/70">
                    <span className="grid h-14 w-20 shrink-0 place-items-center rounded-xl bg-[#12345A] text-center text-[13px] font-black leading-tight text-white">
                      {y.financialYear}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-[#12345A]">{y.auditor ? (y.auditor.firm || y.auditor.partner) : '\u2014'}</span>
                        <Badge status="filed" />
                        {y.assessmentYear && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                            AY {y.assessmentYear}
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {hi ? 'रिपोर्ट दिनांक' : 'Report date'} {dmy(y.auditor && y.auditor.reportDate)}
                        {y.auditor && y.auditor.udin ? ` \u00B7 UDIN ${y.auditor.udin}` : ''}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-5 text-right">
                      <span className="hidden sm:block">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{hi ? 'आय' : 'Income'}</span>
                        <span className="block text-sm font-black tabular-nums text-slate-700">{money0(y.incomeTotal)}</span>
                      </span>
                      <span className="hidden sm:block">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{hi ? 'व्यय' : 'Expenditure'}</span>
                        <span className="block text-sm font-black tabular-nums text-slate-700">{money0(y.expenditureTotal)}</span>
                      </span>
                      <span>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{surplus ? (hi ? 'अधिशेष' : 'Surplus') : (hi ? 'घाटा' : 'Deficit')}</span>
                        <span className={`block text-sm font-black tabular-nums ${surplus ? 'text-emerald-600' : 'text-rose-600'}`}>{money0(y.result && y.result.amount)}</span>
                      </span>
                      <Icons.ChevronRight size={18} className="text-slate-300" />
                    </span>
                  </button>
                </Card>
              );
            })}
          </div>

          {data.pendingYears.length > 0 && (
            <Card className="mt-5 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                <Icons.CalendarClock size={15} className="text-[#C2830A]" />
                {hi ? 'शेष वर्ष (प्रतिवेदन प्रतीक्षित)' : 'Years without a signed report'}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">{data.pendingYears.length}</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.pendingYears.map((y) => (
                  <span key={y} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">{y}</span>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {hi
                  ? `संस्थापना वर्ष ${data.pendingYears[0]} से ${data.pendingYears[data.pendingYears.length - 1]} तक का लेखा परीक्षण अभिलेख उपलब्ध नहीं है।`
                  : `No audited record is held for ${data.pendingYears[0]} to ${data.pendingYears[data.pendingYears.length - 1]}.`}
              </p>
            </Card>
          )}
        </>
      )}

      <DetailModal
        open={!!active}
        onClose={() => setOpen(null)}
        wide
        title={active ? `FY ${active.financialYear}` : ''}
        subtitle={active && active.auditor ? `${active.auditor.firm || ''}${active.auditor.partner ? ' \u00B7 ' + active.auditor.partner : ''}${active.auditor.membershipNo ? ' \u00B7 M.No. ' + active.auditor.membershipNo : ''}` : ''}
        badge={active ? <Badge status="filed" /> : null}
        actions={active && active.sourceFile ? (
          <button
            type="button"
            onClick={async () => {
              try { await ims.auditReportFile(active.financialYear); }
              catch (e) { setFileErr(e.message); }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#12345A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0d2743]"
          >
            <Icons.FileDown size={14} />
            {hi ? 'हस्ताक्षरित प्रतिवेदन' : 'Signed report'}
          </button>
        ) : null}
      >
        {active && (
          <div className="space-y-5">
            {fileErr && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{fileErr}</p>
            )}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <MiniStat label={hi ? 'आय' : 'Income'} value={money(active.incomeTotal)} />
              <MiniStat label={hi ? 'व्यय' : 'Expenditure'} value={money(active.expenditureTotal)} />
              <MiniStat
                label={active.result && active.result.type === 'surplus' ? (hi ? 'अधिशेष' : 'Surplus') : (hi ? 'घाटा' : 'Deficit')}
                value={money(active.result && active.result.amount)}
                tone={active.result && active.result.type === 'surplus' ? 'green' : 'red'}
              />
              <MiniStat label={hi ? 'वर्ष-दर-वर्ष आय परिवर्तन' : 'YoY income'} value={active.yoy ? signed(active.yoy.income) : '\u2014'} tone={active.yoy && active.yoy.income >= 0 ? 'green' : 'red'} />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{hi ? 'आय एवं व्यय खाता' : 'Income & Expenditure Account'}</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <HeadTable title="Income" heads={active.income} total={active.incomeTotal} tone="green" hi={hi} />
                <HeadTable title="Expenditure" heads={active.expenditure} total={active.expenditureTotal} tone="red" hi={hi} />
              </div>
              <p className="mt-2 text-xs text-slate-400">{hi ? 'लेखा परीक्षक की राय: ' : "Auditor's opinion: "}{active.opinion}</p>
            </div>

            {active.capitalExpenditure.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{hi ? 'पूँजीगत व्यय' : 'Capital Expenditure'}</h3>
                <HeadTable heads={active.capitalExpenditure} total={active.capitalExpenditure.reduce((a, c) => a + (Number(c.amount) || 0), 0)} hi={hi} />
              </div>
            )}

            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{hi ? 'प्राप्ति एवं भुगतान' : 'Receipts & Payments'}</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <MiniStat label={hi ? 'प्रारंभिक रोकड़' : 'Opening cash'} value={money(active.openingBalances.cash)} />
                <MiniStat label={hi ? 'प्रारंभिक बैंक' : 'Opening bank'} value={money(active.openingBalances.bank)} />
                <MiniStat label={hi ? 'अंतिम रोकड़' : 'Closing cash'} value={money(active.closingBalances.cash)} />
                <MiniStat label={hi ? 'अंतिम बैंक' : 'Closing bank'} value={money(active.closingBalances.bank)} />
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">{hi ? 'तुलन-पत्र' : 'Balance Sheet'}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{hi ? 'स्थायी परिसंपत्तियाँ' : 'Fixed assets'}</div>
                  <ul className="space-y-1 text-sm">
                    {active.fixedAssets.map((f, i) => (
                      <li key={i} className="flex justify-between gap-3">
                        <span className="text-slate-700">{f.head}</span>
                        <span className="font-semibold tabular-nums text-slate-800">{money(f.amount)}</span>
                      </li>
                    ))}
                    <li className="flex justify-between gap-3 border-t border-slate-100 pt-1 font-black text-[#12345A]">
                      <span>{hi ? 'कुल' : 'Total'}</span>
                      <span className="tabular-nums">{money(active.fixedAssets.reduce((a, f) => a + (Number(f.amount) || 0), 0))}</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{hi ? 'सामान्य निधि' : 'General fund'}</div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between gap-3"><span className="text-slate-700">{hi ? 'प्रारंभिक' : 'Opening'}</span><span className="font-semibold tabular-nums text-slate-800">{money(active.generalFund && active.generalFund.opening)}</span></li>
                    <li className="flex justify-between gap-3"><span className="text-slate-700">{hi ? 'अंतिम' : 'Closing'}</span><span className="font-semibold tabular-nums text-slate-800">{money(active.generalFund && active.generalFund.closing)}</span></li>
                  </ul>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Field2 label={hi ? 'अंतिम कुल शेष' : 'Closing balance'} value={money(active.closingBalances.total)} />
                    <Field2 label={hi ? 'प्रारंभिक कुल शेष' : 'Opening balance'} value={money(active.openingBalances.total)} />
                  </div>
                  {active.closingBalances.breakup && Object.keys(active.closingBalances.breakup).length > 0 && (
                    <div className="mt-3">
                      <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{hi ? 'बैंक शेष विवरण' : 'Bank balance breakup'}</div>
                      {Object.entries(active.closingBalances.breakup).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-3 text-sm">
                          <span className="text-slate-700">{k}</span>
                          <span className="font-semibold tabular-nums text-slate-800">{money(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-500">
              {active.sourceFile ? (
                <button
                  type="button"
                  onClick={async () => {
                    try { await ims.auditReportFile(active.financialYear); }
                    catch (e) { setFileErr(e.message); }
                  }}
                  className="inline-flex items-center gap-2 font-semibold text-[#12345A] underline decoration-slate-300 underline-offset-2 hover:text-[#176447]"
                >
                  <Icons.FileText size={14} />
                  {active.sourceFile}
                </button>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Icons.FileText size={14} />
                  {hi ? 'स्रोत फ़ाइल उपलब्ध नहीं' : 'No source file recorded'}
                </span>
              )}
              {active.notes && <span className="font-semibold text-slate-600">{active.notes}</span>}
            </div>
          </div>
        )}
      </DetailModal>
    </ImsLayout>
  );
}
