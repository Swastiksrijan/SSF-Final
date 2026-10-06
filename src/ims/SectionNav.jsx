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

const dashboardPath = (id) => (id === 'finance' ? '/ims/finance' : `/ims/sections/${id}`);

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
        ? 'bg-[#002344] text-white shadow-[0_4px_12px_-4px_rgba(2,35,68,0.6)]'
        : planned
          ? 'cursor-not-allowed text-slate-300'
          : 'text-slate-600 hover:bg-slate-100 hover:text-[#002344]',
    ].join(' ');

  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 lg:px-8">
        <button
          type="button"
          onClick={() => navigate({ to: dashboardPath(sectionId) })}
          className="flex shrink-0 items-center gap-2 py-2 pr-1 text-left"
          title={hi ? 'अनुभाग डैशबोर्ड' : 'Section dashboard'}
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[#002344] text-[#FFD166]">
            <Icon name={cfg.icon} size={15} />
          </span>
          <span className="leading-tight">
            <span className="block text-xs font-bold text-[#002344]">{secEn}</span>
            <span className="block text-[10px] font-medium text-[#1F7A70]">{secHi}</span>
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
                const [en, hiLabel] = tBoth(item.key);
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
  );
}
