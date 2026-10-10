// SSF-IMS Notification & Action Centre — /ims/notifications
//
// Three honest sections:
//   A. Notifications       — genuine alerts derived from real source records
//   B. Pending Actions     — actions that actually require attention (with owner,
//                            real due date, live task status and a source link)
//   C. Communications & Notices — the real communications + notices registers,
//                            preserved as-is (delivery status shown only as recorded)
//
// A notification is an ALERT, never proof of completion. Reading one clears the
// alert only; the underlying task is completed in its own register.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Button, Empty, Spinner, Tabs, Badge, DetailModal } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

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

function Pill({ children, tone = 'bg-slate-100 text-slate-600' }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>{children}</span>;
}

export default function ImsNotificationsCentre() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const [tab, setTab] = useState('notifications');
  const [data, setData] = useState(null);       // { records, total, unread, today }
  const [comms, setComms] = useState(null);     // communications + notices
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('unread'); // notifications sub-filter
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState('');

  const loadNotifs = useCallback(async () => {
    setLoading(true); setErr('');
    try {
      const d = await ims.notifications({ limit: 200, ...(q ? { search: q } : {}) });
      setData(d);
    } catch (e) {
      setErr(e.message || 'load_error');
    } finally { setLoading(false); }
  }, [q]);

  const loadHistory = useCallback(async () => {
    try {
      const [c, n] = await Promise.all([
        ims.list('communications', { limit: 120 }).catch(() => ({ records: [] })),
        ims.list('notices', { limit: 120 }).catch(() => ({ records: [] })),
      ]);
      // Preserve both registers, distinguish the kind by the record's own fields.
      const merged = [
        ...(c.records || []).map((r) => ({ ...r, _kind: 'communication' })),
        ...(n.records || []).map((r) => ({ ...r, _kind: 'notice' })),
      ].sort((a, b) => new Date(b.createdAt || b.sentAt || 0) - new Date(a.createdAt || a.sentAt || 0));
      setComms(merged);
    } catch { setComms([]); }
  }, []);

  useEffect(() => { loadNotifs(); }, [loadNotifs]);
  useEffect(() => { loadHistory(); }, [loadHistory]);

  const refresh = async () => {
    setBusy(true); setToast('');
    try {
      await ims.notificationSync();
      await loadNotifs();
      setToast(t('notifications_refreshed'));
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const markRead = async (row) => {
    if (row.read) return;
    setBusy(true);
    try {
      await ims.notificationRead(row.id);
      await loadNotifs();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const markAll = async () => {
    setBusy(true);
    try { await ims.notificationReadAll(); await loadNotifs(); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
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
  const unread = data?.unread || 0;
  const overdueCount = records.filter((r) => r.taskStatus === 'overdue').length;

  const shown = useMemo(() => records.filter((r) => {
    if (filter === 'unread') return !r.read;
    if (filter === 'read') return r.read;
    return true;
  }), [records, filter]);

  const pending = useMemo(() => records.filter((r) => ['pending', 'dueSoon', 'overdue'].includes(r.taskStatus) || !r.read), [records]);

  const tabs = [
    { id: 'notifications', en: t('notifications'), hi: lang === 'hi' ? '' : 'सूचनाएँ', count: unread },
    { id: 'actions', en: t('pending_actions'), hi: lang === 'hi' ? '' : 'लंबित कार्य', count: pending.length },
    { id: 'history', en: t('comm_notices'), hi: lang === 'hi' ? '' : 'संचार एवं नोटिस', count: comms ? comms.length : undefined },
  ];

  const label = (p) => (Array.isArray(p) ? (lang === 'hi' ? p[1] : p[0]) : p);

  return (
    <ImsLayout active="notifications">
      <PageHeader
        title={t('notifications')}
        subtitle={t('notif_subtitle')}
        actions={
          <>
            <Pill tone={unread ? 'bg-[#002344] text-white' : 'bg-emerald-100 text-emerald-700'}>
              <Icons.Bell size={12} /> {unread} {t('notif_unread')}
            </Pill>
            {overdueCount > 0 && <Pill tone="bg-rose-100 text-rose-700"><Icons.AlertTriangle size={12} /> {overdueCount} {t('task_overdue')}</Pill>}
            <Button variant="ghost" icon="RefreshCw" onClick={refresh} disabled={busy}>{t('refresh')}</Button>
            <Button variant="navy" icon="CheckCheck" onClick={markAll} disabled={busy || unread === 0}>{t('mark_all_read')}</Button>
          </>
        }
      />

      {toast && <Card className="mb-3 border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{toast}</Card>}
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
            <Card className="p-6">
              <Empty label={filter === 'unread' ? t('all_caught_up') : t('no_notifications')} />
              <p className="mt-2 text-center text-xs text-slate-400">{t('notif_empty_hint')}</p>
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
                      {r.severity && r.severity !== 'info' && <Pill tone={r.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}>{label([r.severity, r.severity])}</Pill>}
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
            <Card className="p-6"><Empty label={t('all_caught_up')} /></Card>
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
            <Card className="p-6"><Empty /></Card>
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
                            : <span className="text-xs text-slate-400">{t('no_records')}</span>}
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
          <Button variant="ghost" icon="Check" onClick={() => { markRead(detail); setDetail(null); }}>{t('mark_read')}</Button>
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
