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
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import { useLang } from './LangContext';
import { ims } from './api';

export const REFRESH_EVENT = 'ims-notifications-refresh';
export const CHANGED_EVENT = 'ims-notifications-changed';

export default function NotificationsHeader() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const hi = lang === 'hi';
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

  const btn = 'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#002344]/30 hover:text-[#002344] disabled:opacity-50';

  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-2 lg:px-8">
        <button
          type="button"
          onClick={() => navigate({ to: '/ims' })}
          title={hi ? 'डैशबोर्ड पर वापस' : 'Back to dashboard'}
          className={btn + ' shrink-0'}
        >
          <Icons.ArrowLeft size={15} />
          <span className="hidden sm:inline">{t('main_dashboard')}</span>
        </button>

        <span className="h-7 w-px shrink-0 bg-slate-200" />

        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#002344] text-[#FFD166]">
          <Icons.BellRing size={16} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-bold text-[#002344]">{t('centre_kicker')}</span>
          <span className="hidden truncate text-[11px] font-medium text-slate-400 sm:block">{t('centre_purpose')}</span>
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={refresh} disabled={busy} className={btn}>
            <Icons.RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{t('refresh')}</span>
          </button>
          <button type="button" onClick={markAll} disabled={busy || unread === 0} className={btn}>
            <Icons.CheckCheck size={14} />
            <span className="hidden sm:inline">{t('mark_all_read')}</span>
            {unread > 0 && <span className="rounded-full bg-[#FF6600] px-1.5 text-[10px] font-black text-white">{unread}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
