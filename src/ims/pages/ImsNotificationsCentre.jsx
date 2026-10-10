// SSF-IMS Notification & Action Centre — /ims/notifications
//
// A live dashboard, not an empty page: a hero with real KPIs, a "monitored
// sources" strip that proves the centre is connected and working even when no
// alert is currently due, and three honest sections:
//   A. Notifications       — genuine alerts derived from real source records
//   B. Pending Actions     — actions that actually require attention (owner,
//                            real due date, live task status, source link)
//   C. Communications & Notices — the real communications + notices registers
//
// A notification is an ALERT, never proof of completion. Reading one clears the
// alert only; the underlying task is completed in its own register.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, SectionHero, StatStrip, Tabs, Empty, Spinner, Button, DetailModal } from '../ui';
import { useLang } from '../LangContext';
import { tBoth } from '../i18n';
import { ims } from '../api';
import { REFRESH_EVENT, CHANGED_EVENT } from '../NotificationsHeader';

const SEVERITY = {
  critical: 'border-l-[#DC2626] bg-rose-50/60',
  warning: 'border-l-[#D97706] bg-amber-50/50',
  info: 'border-l-[#2563EB] bg-sky-50/40',
};
const TASK_TONE = {
  overdue: 'bg-rose-100 text-rose-700',
  dueSoon: 'bg-amber-100 text-amber-700',
  pending: 'bg-slate-100 text-slate-600',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500',
  missing: 'bg-slate-100 text-slate-400',
};
const DELIVERY_TONE = {
  sent: 'bg-sky-100 text-sky-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
  read: 'bg-emerald-100 text-emerald-700',
};
// Label + icon for each watched source register.
const SOURCE_META = {
  actions: { key: 'actions', icon: 'ListChecks' },
  compliance: { key: 'compliance', icon: 'ShieldCheck' },
  audits: { key: 'audit_risk', icon: 'SearchCheck' },
  financialYears: { key: 'financialYears', icon: 'CalendarRange' },
};

function Pill({ children, tone = 'bg-slate-100 text-slate-600' }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>{children}</span>;
}

export default function ImsNotificationsCentre() {
  const { t } = useLang();
  const navigate = useNavigate();

  const [tab, setTab] = useState('notifications');
  const [data, setData] = useState(null);       // { records, total, unread, stats, today }
  const [sources, setSources] = useState(null); // per-source connectivity summary
  const [comms, setComms] = useState(null);     // communications + notices
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('unread');
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState(null);

  const loadNotifs = useCallback(async () => {
    setLoading(true); setErr('');
    try {
      const d = await ims.notifications({ limit: 200, ...(q ? { search: q } : {}) });
      setData(d);
    } catch (e) {
      setErr(e.message || 'load_error');
    } finally { setLoading(false); }
  }, [q]);

  const loadSources = useCallback(async () => {
    try { setSources(await ims.notificationSources()); } catch { setSources({ sources: [] }); }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const [c, n] = await Promise.all([
        ims.list('communications', { limit: 120 }).catch(() => ({ records: [] })),
        ims.list('notices', { limit: 120 }).catch(() => ({ records: [] })),
      ]);
      const merged = [
        ...(c.records || []).map((r) => ({ ...r, _kind: 'communication' })),
        ...(n.records || []).map((r) => ({ ...r, _kind: 'notice' })),
      ].sort((a, b) => new Date(b.createdAt || b.sentAt || 0) - new Date(a.createdAt || a.sentAt || 0));
      setComms(merged);
    } catch { setComms([]); }
  }, []);

  useEffect(() => { loadNotifs(); }, [loadNotifs]);
  useEffect(() => { loadSources(); }, [loadSources]);
  useEffect(() => { loadHistory(); }, [loadHistory]);

  // The header's Refresh / Mark-all buttons live in ImsLayout; they signal this
  // page through window events so the two stay in sync without prop drilling.
  useEffect(() => {
    const onRefresh = () => { loadNotifs(); loadSources(); };
    window.addEventListener(REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(REFRESH_EVENT, onRefresh);
  }, [loadNotifs, loadSources]);

  const markRead = async (row) => {
    if (row.read) return;
    setBusy(true);
    try {
      await ims.notificationRead(row.id);
      await loadNotifs();
      window.dispatchEvent(new Event(CHANGED_EVENT));
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const openSource = (row) => {
    if (!row.sourceLink) return;
    const [path, qs] = row.sourceLink.split('?');
    const id = new URLSearchParams(qs || '').get('open');
    const m = path.match(/^\/ims\/r\/([^/]+)$/);
    if (m) navigate({ to: '/ims/r/$resource', params: { resource: m[1] }, search: id ? { open: id } : {} });
    else navigate({ to: path });
  };

  const records = useMemo(() => data?.records || [], [data]);
  // Prefer server-side stats; fall back to computing from the page if the
  // backend has not been redeployed yet.
  const stats = data?.stats || {
    total: records.length,
    unread: records.filter((r) => !r.read).length,
    overdue: records.filter((r) => r.taskStatus === 'overdue').length,
    dueSoon: records.filter((r) => r.taskStatus === 'dueSoon').length,
  };
  const unread = stats.unread ?? data?.unread ?? 0;

  const shown = useMemo(() => records.filter((r) => {
    if (filter === 'unread') return !r.read;
    if (filter === 'read') return r.read;
    return true;
  }), [records, filter]);

  const pending = useMemo(() => records.filter((r) => ['pending', 'dueSoon', 'overdue'].includes(r.taskStatus) || !r.read), [records]);

  // Group the watched sources by register for the connectivity strip.
  const sourceGroups = useMemo(() => {
    const map = new Map();
    for (const s of (sources?.sources || [])) {
      const meta = SOURCE_META[s.resource] || { key: s.resource, icon: 'Activity' };
      const g = map.get(s.resource) || { resource: s.resource, meta, connected: false, monitored: 0, due: 0 };
      g.connected = g.connected || s.connected;
      g.monitored = Math.max(g.monitored, s.monitored || 0);
      g.due += s.due || 0;
      map.set(s.resource, g);
    }
    return [...map.values()];
  }, [sources]);

  const tabs = [
    { id: 'notifications', en: t('notifications'), hi: 'सूचनाएँ', count: unread },
    { id: 'actions', en: t('pending_actions'), hi: 'लंबित कार्य', count: pending.length },
    { id: 'history', en: t('comm_notices'), hi: 'संचार एवं नोटिस', count: comms ? comms.length : undefined },
  ];

  const hiTitle = tBoth('notifications')[1];

  return (
    <ImsLayout active="notifications">
      <SectionHero
        title={t('action_centre')}
        hi={hiTitle}
        eyebrow={`${t('app_name')} · ${t('centre_kicker')}`}
        icon="Bell"
        tone="navy"
      >
        <StatStrip
          items={[
            { labelKey: 'total_alerts', value: stats.total ?? 0, icon: 'Bell', tone: 'navy' },
            { labelKey: 'needs_attention', value: unread, icon: 'AlertTriangle', tone: 'amber' },
            { labelKey: 'task_overdue', value: stats.overdue ?? 0, icon: 'AlertOctagon', tone: 'red' },
            { labelKey: 'task_dueSoon', value: stats.dueSoon ?? 0, icon: 'Clock', tone: 'blue' },
          ]}
        />
      </SectionHero>

      {/* Live connectivity: proves the centre is working even with 0 alerts. */}
      <Card className="mb-5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Icons.Radio size={15} /></span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t('monitored_sources')}</h2>
          <Pill tone="bg-emerald-100 text-emerald-700"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> {t('live')}</Pill>
          <span className="ml-auto hidden text-[11px] text-slate-400 sm:block">{t('auto_note')}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {!sources && <div className="col-span-full"><Spinner /></div>}
          {sourceGroups.map((g) => {
            const I = Icons[g.meta.icon] || Icons.Activity;
            return (
              <div key={g.resource} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${g.connected ? 'bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white' : 'bg-slate-200 text-slate-400'}`}><I size={18} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-800">{t(g.meta.key)}</span>
                  <span className="block truncate text-[11px] text-slate-400">
                    {g.monitored} {t('source_monitored')} · {g.due} {t('source_due')}
                  </span>
                </span>
                <Pill tone={g.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}>
                  <span className={`h-1.5 w-1.5 rounded-full ${g.connected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {g.connected ? t('source_connected') : t('source_disconnected')}
                </Pill>
              </div>
            );
          })}
        </div>
      </Card>

      {err && (
        <Card className="mb-3 flex items-center justify-between border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <span>{t('load_error')}: {err}</span>
          <Button variant="ghost" icon="RotateCcw" onClick={loadNotifs}>{t('retry')}</Button>
        </Card>
      )}

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {/* A. Notifications */}
      {tab === 'notifications' && (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {['unread', 'read', 'all'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${filter === f ? 'bg-[#002344] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {t(f === 'unread' ? 'notif_unread' : f === 'read' ? 'notif_read' : 'notif_all')}
              </button>
            ))}
            <div className="relative ml-auto">
              <Icons.Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_placeholder')}
                className="rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm outline-none focus:border-[#FF6600]" />
            </div>
          </div>

          {loading && !data ? <Spinner /> : shown.length === 0 ? (
            <Card className="p-8">
              <Empty label={filter === 'unread' ? t('all_caught_up') : t('no_notifications')} />
              <p className="mt-2 text-center text-sm text-slate-400">{t('notif_empty_hint')}</p>
              <p className="mx-auto mt-3 max-w-md text-center text-xs text-slate-400">{t('auto_note')}</p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {shown.map((r) => (
                <button key={r.id} type="button" onClick={() => setDetail(r)}
                  className={`flex w-full items-start gap-3 rounded-2xl border border-l-4 border-slate-200 bg-white p-4 text-left transition hover:shadow-[0_10px_26px_-14px_rgba(2,35,68,0.3)] ${r.read ? 'opacity-70' : ''} ${SEVERITY[r.severity] || ''}`}>
                  <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${r.read ? 'bg-slate-100 text-slate-400' : 'bg-[#002344] text-[#FFD166]'}`}>
                    <Icons.Bell size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#002344]">{r.title}</span>
                      {!r.read && <span className="h-2 w-2 rounded-full bg-[#FF6600]" />}
                      {r.severity && r.severity !== 'info' && <Pill tone={r.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}>{r.severity}</Pill>}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-600">{r.message}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      {r.sourceRecordId && <span className="font-mono">{r.sourceRecordId}</span>}
                      {r.taskStatus && <Pill tone={TASK_TONE[r.taskStatus]}>{t('task_' + r.taskStatus)}</Pill>}
                      {r.dueDate && <span>· {t('due_date')}: {String(r.dueDate).slice(0, 10)}</span>}
                    </span>
                  </span>
                  <Icons.ChevronRight size={16} className="mt-1 shrink-0 text-slate-300" />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* B. Pending Actions */}
      {tab === 'actions' && (
        <>
          <Card className="mb-3 border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
            <Icons.Info size={13} className="mr-1 inline" /> {t('reading_note')}
          </Card>
          {loading && !data ? <Spinner /> : pending.length === 0 ? (
            <Card className="p-8"><Empty label={t('all_caught_up')} /></Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3">{t('pending_actions')}</th>
                      <th className="px-4 py-3">{t('responsible')}</th>
                      <th className="px-4 py-3">{t('due_date')}</th>
                      <th className="px-4 py-3">{t('status')}</th>
                      <th className="px-4 py-3 text-right">{t('source_record')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pending.map((r) => (
                      <tr key={r.id} className="hover:bg-[#F5F8FC]">
                        <td className="px-4 py-3">
                          <span className="block font-semibold text-slate-800">{r.title}</span>
                          <span className="block text-xs text-slate-400">{r.message}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{r.responsibleName || '—'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {r.dueDate ? String(r.dueDate).slice(0, 10) : t('no_due_date')}
                          {r.daysUntil != null && <span className="ml-1.5 text-[11px] text-slate-400">
                            ({r.daysUntil < 0 ? `${Math.abs(r.daysUntil)} ${t('days_overdue')}` : r.daysUntil === 0 ? t('due_today') : `${r.daysUntil} ${t('days_left')}`})
                          </span>}
                        </td>
                        <td className="px-4 py-3"><Pill tone={TASK_TONE[r.taskStatus]}>{t('task_' + r.taskStatus)}</Pill></td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {r.sourceLink
                            ? <button className="text-xs font-semibold text-[#FF6600] hover:underline" onClick={() => openSource(r)}>{t('open_source')} →</button>
                            : <span className="text-xs text-slate-300">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* C. Communications & Notices */}
      {tab === 'history' && (
        <>
          {!comms ? <Spinner /> : comms.length === 0 ? (
            <Card className="p-8"><Empty /></Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3">{t('subject')}</th>
                      <th className="px-4 py-3">{t('category')}</th>
                      <th className="px-4 py-3">{t('channel')}</th>
                      <th className="px-4 py-3">{t('delivery')}</th>
                      <th className="px-4 py-3 text-right">ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comms.map((c) => (
                      <tr key={c._kind + c.id} className="hover:bg-[#F5F8FC]">
                        <td className="px-4 py-3 font-medium text-slate-800">{c.subject || '—'}</td>
                        <td className="px-4 py-3"><Pill>{c._kind === 'notice' ? t('notices') : t('communications')}</Pill></td>
                        <td className="px-4 py-3 text-slate-600">{c.channel || c.noticeType || c.relatedType || '—'}</td>
                        <td className="px-4 py-3">
                          {c.deliveryStatus
                            ? <Pill tone={DELIVERY_TONE[c.deliveryStatus] || 'bg-slate-100 text-slate-500'}>{c.deliveryStatus}</Pill>
                            : <span className="text-xs text-slate-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-slate-400">{c.recordId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Notification detail — safe fields only, with a source link */}
      <DetailModal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.title}
        subtitle={detail?.sourceRecordId}
        badge={detail && <Pill tone={TASK_TONE[detail.taskStatus] || 'bg-slate-100 text-slate-500'}>{detail.taskStatus ? t('task_' + detail.taskStatus) : ''}</Pill>}
        actions={detail && !detail.read && (
          <Button variant="ghost" icon="Check" disabled={busy} onClick={() => { markRead(detail); setDetail(null); }}>{t('mark_read')}</Button>
        )}
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <p className="text-slate-700">{detail.message}</p>
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-[11px] font-bold uppercase text-slate-400">{t('due_date')}</div><div>{detail.dueDate ? String(detail.dueDate).slice(0, 10) : '—'}</div></div>
              <div><div className="text-[11px] font-bold uppercase text-slate-400">{t('responsible')}</div><div>{detail.responsibleName || '—'}</div></div>
              <div><div className="text-[11px] font-bold uppercase text-slate-400">{t('category')}</div><div>{detail.category || '—'}</div></div>
              <div><div className="text-[11px] font-bold uppercase text-slate-400">{t('source_record')}</div><div className="font-mono">{detail.sourceRecordId || '—'}</div></div>
            </div>
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">{t('reading_note')}</p>
            {detail.sourceLink && (
              <Button icon="ExternalLink" onClick={() => { openSource(detail); setDetail(null); }}>{t('open_source')}</Button>
            )}
          </div>
        )}
      </DetailModal>
    </ImsLayout>
  );
}
