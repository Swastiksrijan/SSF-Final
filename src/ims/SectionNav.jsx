// Persistent sub-navigation for the current section.
//
// The sidebar only lists the 9 primary sections. This strip sits directly
// under the top bar and keeps every module of the active section one click
// away, so opening a module never hides its siblings. It is rendered once by
// ImsLayout, so it appears on every IMS page — custom pages, generic
// resources and legacy registers alike.
import { useEffect, useRef } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import { SECTIONS, sectionGroups } from './sectionModules';
import { tBoth } from './i18n';
import { useLang } from './LangContext';

function Icon({ name, size = 14, className = '' }) {
  const C = Icons[name] || Icons.Circle;
  return <C size={size} className={className} />;
}

const dashboardPath = (id) =>
  id === 'finance' ? '/ims/finance' : id === 'volunteer' ? '/ims/volunteer-network' : `/ims/sections/${id}`;

// A catalogue item resolves to either its explicit path or its generic
// resource route; `planned` items have no target yet.
const itemPath = (it) => it.path || (it.resource ? `/ims/r/${it.resource}` : null);

function itemKeyForPath(sectionId, pathname) {
  for (const g of sectionGroups(sectionId)) {
    for (const it of g.items) if (itemPath(it) === pathname) return it.key;
  }
  return null;
}

function sectionForPath(pathname) {
  for (const id of Object.keys(SECTIONS)) {
    if (pathname === dashboardPath(id)) return id;
    if (itemKeyForPath(id, pathname)) return id;
  }
  return null;
}

function sectionForKey(active) {
  if (!active) return null;
  for (const id of Object.keys(SECTIONS)) {
    if (active === `${id}_dashboard`) return id;
    for (const g of sectionGroups(id)) if (g.items.some((it) => it.key === active)) return id;
  }
  return null;
}

export default function SectionNav({ active }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeRef = useRef(null);

  const sectionId = sectionForPath(pathname) || sectionForKey(active);
  const activeKey = sectionId ? itemKeyForPath(sectionId, pathname) || active : null;
  const isDashboard = sectionId ? pathname === dashboardPath(sectionId) : false;

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [pathname]);

  if (!sectionId) return null;
  const cfg = SECTIONS[sectionId];
  const groups = sectionGroups(sectionId);
  const [secEn, secHi] = tBoth(cfg.titleKey);
  const hi = lang === 'hi';

  const go = (item) => {
    if (item.planned) return;
    if (item.path) navigate({ to: item.path });
    else if (item.resource) navigate({ to: '/ims/r/$resource', params: { resource: item.resource } });
  };

  const tabClass = (on, planned) =>
    [
      'flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-150',
      on
        ? 'bg-[#12345A] text-white shadow-[0_4px_12px_-4px_rgba(18,52,90,0.6)]'
        : planned
          ? 'cursor-not-allowed text-slate-300'
          : 'text-slate-600 hover:bg-slate-100 hover:text-[#12345A]',
    ].join(' ');

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 shadow-[0_8px_18px_-14px_rgba(18,52,90,0.4)] backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 lg:px-8">
        <button
          type="button"
          onClick={() => navigate({ to: dashboardPath(sectionId) })}
          className="flex shrink-0 items-center gap-2 py-2 pr-1 text-left"
          title={hi ? 'अनुभाग डैशबोर्ड' : 'Section dashboard'}
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[#12345A] text-[#F7A814]">
            <Icon name={cfg.icon} size={15} />
          </span>
          <span className="leading-tight">
            <span className="block text-xs font-bold text-[#12345A]">{secEn}</span>
            <span className="block text-[10px] font-medium text-[#176447]">{secHi}</span>
          </span>
        </button>

        <span className="h-8 w-px shrink-0 bg-slate-200" />

        <div
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1.5 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <button
            type="button"
            ref={isDashboard ? activeRef : null}
            onClick={() => navigate({ to: dashboardPath(sectionId) })}
            className={tabClass(isDashboard)}
          >
            <Icon name="LayoutGrid" />
            {hi ? 'अवलोकन' : 'Overview'}
          </button>

          {groups.map((g) => (
            <span key={g.labelKey} className="flex items-center gap-1">
              <span className="mx-1 hidden shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-300 xl:inline">
                {hi ? tBoth(g.labelKey)[1] : tBoth(g.labelKey)[0]}
              </span>
              {g.items.map((item) => {
                const on = item.key === activeKey;
                // Tabs use a short label when one exists, so a long name such as
                // "Meetings & Decisions" does not crowd the strip.
                const [en, hiLabel] = tBoth(item.shortKey || item.key);
                return (
                  <button
                    type="button"
                    key={item.key}
                    ref={on ? activeRef : null}
                    onClick={() => go(item)}
                    disabled={item.planned}
                    title={item.planned ? (hi ? 'जल्द आ रहा है' : 'Coming soon') : undefined}
                    className={tabClass(on, item.planned)}
                  >
                    <Icon name={item.icon} />
                    <span className="whitespace-nowrap">{hi ? hiLabel : en}</span>
                    {item.planned && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-amber-400" />}
                  </button>
                );
              })}
            </span>
          ))}
        </div>
      </div>
    </div>
    {/* Notifications is a two-page section, so its modules get large dashboard
        cards below the strip instead of cramped header tabs. */}
    {sectionId === 'notifications' && <NotificationsModules activeKey={activeKey} />}
    </>
  );
}

// The two modules of the Notifications section shown as large two-column
// dashboard cards. Shared so the same switcher appears on the centre page and
// on the contacts page; the active module is highlighted and each card opens
// only its own content.
export function NotificationsModules({ activeKey }) {
  const navigate = useNavigate();
  const items = sectionGroups('notifications').flatMap((g) => g.items);
  const go = (item) => {
    if (item.planned) return;
    if (item.path) navigate({ to: item.path });
    else if (item.resource) navigate({ to: '/ims/r/$resource', params: { resource: item.resource } });
  };
  return (
    <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-5 sm:grid-cols-2 lg:px-8">
        {items.map((item) => {
          const on = item.key === activeKey;
          const I = Icons[item.icon] || Icons.Circle;
          const [en, hiLabel] = tBoth(item.key);
          return (
            <button key={item.key} type="button" onClick={() => go(item)}
              className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgba(18,52,90,0.5)] ${on ? 'border-[#12345A]/30 bg-white shadow-[0_12px_30px_-18px_rgba(18,52,90,0.55)] ring-1 ring-[#12345A]/10' : 'border-slate-200 bg-white hover:border-[#12345A]/40'}`}>
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-sm ring-1 ring-black/5 ${on ? 'bg-gradient-to-br from-[#12345A] to-[#12345A] text-[#F7A814]' : 'bg-gradient-to-br from-[#12345A] to-[#12345A] text-white'}`}>
                <I size={26} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg font-black text-[#12345A]">{en}</span>
                <span className="block truncate text-sm font-semibold text-slate-400">{hiLabel}</span>
              </span>
              <Icons.ArrowRight size={20} className={`shrink-0 transition-transform group-hover:translate-x-1 ${on ? 'text-[#176447]' : 'text-slate-300'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
