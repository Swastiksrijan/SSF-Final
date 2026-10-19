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
    <div className="border-b border-slate-200 bg-white/95 shadow-[0_8px_18px_-14px_rgba(18,52,90,0.4)] backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-2 lg:px-8">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#12345A] text-[#F7A814]">
          <Icons.BellRing size={15} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-xs font-bold text-[#12345A]">{t('centre_kicker')}</span>
          <span className="block text-[10px] font-medium text-[#176447]">{t('centre_purpose')}</span>
        </span>
        <span className="min-w-0 flex-1" />
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={refresh} disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#12345A] hover:text-[#12345A] disabled:opacity-50">
            <Icons.RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
            {t('refresh')}
          </button>
          <button type="button" onClick={markAll} disabled={busy || unread === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#176447] px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#12345A] disabled:opacity-50">
            <Icons.CheckCheck size={14} />
            {t('mark_all_read')}
            {unread > 0 && <span className="rounded-full bg-white/25 px-1.5 text-[11px] font-black">{unread}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
