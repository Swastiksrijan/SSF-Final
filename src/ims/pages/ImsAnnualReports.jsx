import { useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Kpi, Empty, Spinner, Button } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

/**
 * Annual Progress Reports — the year-wise reporting register.
 *
 * Read-only: the entries are seeded from the Foundation's own progress reports
 * (backend_node/data/annualReports.js), which is the single source of truth. The
 * screen shows each year with its public document, the project that represents
 * the year of work and the initiatives recorded in it.
 */
export default function ImsAnnualReports() {
  const { lang } = useLang();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    let alive = true;
    ims.annualReports()
      .then((d) => { if (alive) setData(d); })
      .catch((e) => { if (alive) setErr(e.message); });
    return () => { alive = false; };
  }, []);

  const hi = lang === 'hi';
  const years = useMemo(() => {
    const list = (data && data.years) || [];
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((y) => (
      y.year.toLowerCase().includes(needle)
      || (y.title || '').toLowerCase().includes(needle)
      || (y.summary || '').toLowerCase().includes(needle)
      || (y.focusAreas || []).join(' ').toLowerCase().includes(needle)
      || (y.activities || []).some((a) => (a.title || '').toLowerCase().includes(needle))
    ));
  }, [data, q]);

  return (
    <ImsLayout active="annual_reports">
      <PageHeader
        title={hi ? 'वार्षिक प्रगति प्रतिवेदन' : 'Annual Progress Reports'}
        subtitle={hi
          ? 'वर्ष-वार प्रगति प्रतिवेदन, प्रत्येक अपने आधिकारिक दस्तावेज़, परियोजना एवं गतिविधियों से जुड़ा हुआ।'
          : 'Year-wise progress reports, each linked to its official document, the year\u2019s project and its recorded initiatives.'}
        actions={data && data.folderUrl ? (
          <a href={data.folderUrl} target="_blank" rel="noreferrer">
            <Button variant="ghost" icon="FolderOpen">{hi ? 'स्रोत फ़ोल्डर' : 'Source folder'}</Button>
          </a>
        ) : null}
      />

      {err && <Card className="mb-4 p-4 text-sm text-rose-700">{err}</Card>}
      {!data && !err && <Spinner />}

      {data && (
        <>
          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
            <Kpi icon="CalendarRange" label={hi ? 'वर्ष' : 'Years'} value={data.totals.years} tone="navy" />
            <Kpi icon="FileText" label={hi ? 'दस्तावेज़' : 'Documents'} value={data.totals.documents} tone="teal" />
            <Kpi icon="FolderKanban" label={hi ? 'परियोजनाएँ' : 'Projects'} value={data.totals.projects} tone="green" />
            <Kpi icon="Activity" label={hi ? 'गतिविधियाँ' : 'Activities'} value={data.totals.activities} tone="orange" />
            <Kpi icon="Layers" label={hi ? 'कार्यक्रम' : 'Programmes'} value={data.totals.programmes} tone="purple" />
          </div>

          <div className="mb-4 flex items-center gap-2">
            <Icons.Search size={16} className="text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={hi ? 'वर्ष, विषय या गतिविधि खोजें…' : 'Search year, theme or initiative…'}
              className="w-full max-w-md rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#176447] focus:ring-2 focus:ring-[#176447]/20"
            />
          </div>

          {years.length === 0 && <Card><Empty /></Card>}

          <div className="space-y-3">
            {years.map((y) => {
              const isOpen = open === y.year;
              return (
                <Card key={y.year} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : y.year)}
                    className="flex w-full items-start gap-4 p-4 text-left hover:bg-slate-50/70"
                  >
                    <span className="grid h-14 w-16 shrink-0 place-items-center rounded-xl bg-[#12345A] text-center text-[13px] font-black leading-tight text-white">
                      {y.year}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold text-[#12345A]">{y.title}</span>
                      <span className="mt-1 block text-sm text-slate-500">{y.summary}</span>
                      <span className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                          {y.activityCount} {hi ? 'गतिविधियाँ' : 'initiatives'}
                        </span>
                        {(y.programmesCovered || []).slice(0, 4).map((p) => (
                          <span key={p} className="rounded-full bg-[#EAF0F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#12345A]">{p}</span>
                        ))}
                      </span>
                    </span>
                    <Icons.ChevronDown size={18} className={`mt-1 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                      <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                            {hi ? 'वर्ष की गतिविधियाँ' : 'Initiatives recorded'}
                          </h3>
                          <ul className="space-y-2">
                            {(y.activities || []).map((a) => (
                              <li key={a.recordId} className="rounded-xl border border-slate-200 bg-white p-3">
                                <div className="flex items-start justify-between gap-3">
                                  <span className="text-sm font-semibold text-slate-800">{a.title}</span>
                                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{a.activityType}</span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">{a.outcome}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <div className="rounded-xl border border-slate-200 bg-white p-3">
                            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                              {hi ? 'स्रोत दस्तावेज़' : 'Source document'}
                            </h3>
                            {y.document ? (
                              <>
                                <p className="text-sm font-semibold text-[#12345A]">{y.document.title}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{y.document.recordId}</p>
                                <a
                                  href={y.driveUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#176447] hover:underline"
                                >
                                  <Icons.ExternalLink size={14} /> {hi ? 'PDF खोलें' : 'Open report PDF'}
                                </a>
                              </>
                            ) : (
                              <p className="text-sm text-slate-400">{hi ? 'दस्तावेज़ उपलब्ध नहीं' : 'No document'}</p>
                            )}
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-white p-3">
                            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                              {hi ? 'रिपोर्टिंग अवधि' : 'Reporting period'}
                            </h3>
                            <p className="text-sm text-slate-700">{y.fyStart} → {y.fyEnd}</p>
                            {y.project && <p className="mt-1 text-xs text-slate-500">{y.project.name} · {y.project.recordId}</p>}
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-white p-3">
                            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                              {hi ? 'कार्यक्षेत्र' : 'Focus areas'}
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                              {(y.focusAreas || []).map((f) => (
                                <span key={f} className="rounded-full bg-[#EAF0F6] px-2 py-0.5 text-[11px] font-semibold text-[#12345A]">{f}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </ImsLayout>
  );
}
