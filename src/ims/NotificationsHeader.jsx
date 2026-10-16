// Header for the global Notification & Action Centre.
//
// This page belongs to no single section — it watches every register — so it
// must NOT show a section sub-navigation strip (that caused the Governance
// tabs to appear here). Instead it gets its own compact command bar: the
// centre name and purpose, a live unread badge, and the two global actions
// (Refresh = sync + reload, Mark all as read).
//
// It is intentionally self-contained: it talks to the API itself and signals
// the page through window events, so it stays correct no matter where the
// layout renders it.
import { useCallback, useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { useLang } from './LangContext';
import { ims } from './api';

export const REFRESH_EVENT = 'ims-notifications-refresh';
export const CHANGED_EVENT = 'ims-notifications-changed';

export default function NotificationsHeader() {
  const { t } = useLang();
  const [unread, setUnread] = useState(0);
  const [busy, setBusy] = useState(false);

  const loadUnread = useCallback(() => {
    ims.notificationUnread().then((d) => setUnread(d.unread || 0)).catch(() => {});
  }, []);

  useEffect(() => {
    loadUnread();
    const onChange = () => loadUnread();
    window.addEventListener(CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CHANGED_EVENT, onChange);
  }, [loadUnread]);

  const refresh = async () => {
    setBusy(true);
    try {
      await ims.notificationSync();
      loadUnread();
      window.dispatchEvent(new Event(REFRESH_EVENT));
    } catch { /* page shows its own error */ } finally { setBusy(false); }
  };

  const markAll = async () => {
    setBusy(true);
    try {
      await ims.notificationReadAll();
      loadUnread();
      window.dispatchEvent(new Event(REFRESH_EVENT));
    } catch { /* ignore */ } finally { setBusy(false); }
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#12345A] to-[#12345A] p-5 text-white shadow-[0_18px_40px_-22px_rgba(18,52,90,0.55)] sm:p-6">
      <span className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/10" />
      <div className="relative flex flex-wrap items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
          <Icons.BellRing size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black leading-tight tracking-tight sm:text-2xl">{t('centre_kicker')}</h1>
          <p className="mt-0.5 text-sm font-medium text-white/70">{t('centre_purpose')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={refresh} disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20 disabled:opacity-50">
            <Icons.RefreshCw size={15} className={busy ? 'animate-spin' : ''} />
            {t('refresh')}
          </button>
          <button type="button" onClick={markAll} disabled={busy || unread === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#176447] px-3.5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#176447] disabled:opacity-50">
            <Icons.CheckCheck size={15} />
            {t('mark_all_read')}
            {unread > 0 && <span className="rounded-full bg-white/25 px-1.5 text-[11px] font-black">{unread}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
