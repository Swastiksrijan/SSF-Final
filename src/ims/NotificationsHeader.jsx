// Header for the global Notification & Action Centre.
//
// This page belongs to no single section — it watches every register — so it
// must NOT show a section sub-navigation strip (that caused the Governance
// tabs to appear here). Instead it gets its own identity bar: the centre name,
// a right-to-the-point purpose line, and a clear "Back to dashboard" action.
import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import { useLang } from './LangContext';

export default function NotificationsHeader({ onRefresh, onMarkAll, unread = 0, busy }) {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const hi = lang === 'hi';

  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-2 lg:px-8">
        <button
          type="button"
          onClick={() => navigate({ to: '/ims' })}
          title={hi ? 'डैशबोर्ड पर वापस' : 'Back to dashboard'}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#002344]/30 hover:text-[#002344]"
        >
          <Icons.ArrowLeft size={15} />
          <span className="hidden sm:inline">{t('main_dashboard')}</span>
        </button>

        <span className="h-7 w-px shrink-0 bg-slate-200" />

        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#002344] text-[#FFD166]">
          <Icons.BellRing size={16} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-bold text-[#002344]">{t('action_centre')}</span>
          <span className="hidden truncate text-[11px] font-medium text-slate-400 sm:block">{t('centre_purpose')}</span>
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#002344]/30 hover:text-[#002344] disabled:opacity-50"
          >
            <Icons.RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{t('refresh')}</span>
          </button>
          <button
            type="button"
            onClick={onMarkAll}
            disabled={busy || unread === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#002344]/30 hover:text-[#002344] disabled:opacity-50"
          >
            <Icons.CheckCheck size={14} />
            <span className="hidden sm:inline">{t('mark_all_read')}</span>
            {unread > 0 && <span className="rounded-full bg-[#FF6600] px-1.5 text-[10px] font-black text-white">{unread}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
