// Persistent sub-navigation for the current section.
//
// The sidebar only lists the 9 primary sections. This strip sits directly
// under the top bar and keeps every module of the active section one click
// away, so opening a module never hides its siblings. It is rendered once by
// ImsLayout, so it appears on every IMS page — custom pages, generic
// resources and legacy registers alike.
//
// Small sections fit their modules on one scrolling row. The wide ones
// (Finance has ~70 modules in 8 blocks) do not: a single row pushes most of
// them off-screen, which is exactly the "names hide" problem. Those render a
// grouped panel under the strip instead — every module visible at once,
// grouped like the section dashboard, with the current one highlighted.
import { useEffect, useRef, useState } from 'react';
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

// Sections past this size switch from one scrolling row to the grouped panel,
// so no module is ever hidden off the edge.
const PANEL_MIN_ITEMS = 16;
const usesPanel = (groups) => {
  const items = groups.reduce((n, g) => n + g.items.length, 0);
  return items > PANEL_MIN_ITEMS || groups.length >= 6;
};

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

const PANEL_KEY = (id) => `ssf_ims_nav_panel_${id}`;

export default function SectionNav({ active }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeRef = useRef(null);

  const sectionId = sectionForPath(pathname) || sectionForKey(active);
  const activeKey = sectionId ? itemKeyForPath(sectionId, pathname) || active : null;
  const isDashboard = sectionId ? pathname === dashboardPath(sectionId) : false;

  // The panel remembers whether it is open, per section, so a treasurer who
  // prefers a compact header is not forced to collapse it on every page.
  // Reading it during render (rather than in an effect) keeps the first paint
  // correct and avoids a flash of the wrong state.
  const [panelState, setPanelState] = useState({ id: null, open: true });
  if (sectionId && panelState.id !== sectionId) {
    let saved = null;
    try { saved = localStorage.getItem(PANEL_KEY(sectionId)); } catch { saved = null; }
    setPanelState({ id: sectionId, open: saved !== 'closed' });
  }
  const panelOpen = panelState.open;
  const togglePanel = () => {
    setPanelState((prev) => {
      try { localStorage.setItem(PANEL_KEY(sectionId), prev.open ? 'closed' : 'open'); } catch { /* storage may be blocked */ }
      return { id: sectionId, open: !prev.open };
    });
  };

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [pathname]);

  if (!sectionId) return null;
  const cfg = SECTIONS[sectionId];
  const groups = sectionGroups(sectionId);
  const panel = usesPanel(groups);
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

  // The module the visitor is looking at, so the strip can name it in place of
  // a long scrolling row of tabs.
  const currentGroup = groups.find((g) => g.items.some((it) => it.key === activeKey));
  const currentItem = currentGroup?.items.find((it) => it.key === activeKey);

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

        <button
          type="button"
          ref={isDashboard ? activeRef : null}
          onClick={() => navigate({ to: dashboardPath(sectionId) })}
          className={tabClass(isDashboard)}
        >
          <Icon name="LayoutGrid" />
          {hi ? 'अवलोकन' : 'Overview'}
        </button>

        {panel ? (
          <>
            {/* The wide sections keep the strip static: it names the module in
                view instead of scrolling a long row of tabs, so the section
                heading never slides left or right when a module is opened. */}
            {currentGroup && (
              <span className="flex min-w-0 items-center gap-2">
                <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-300 md:inline">
                  {hi ? tBoth(currentGroup.labelKey)[1] : tBoth(currentGroup.labelKey)[0]}
                </span>
                <span className="flex min-w-0 items-center gap-1.5 rounded-lg bg-[#12345A] px-2.5 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_-4px_rgba(18,52,90,0.6)]">
                  <Icon name={currentItem?.icon} />
                  <span className="truncate">{hi ? tBoth(currentItem?.shortKey || currentItem?.key)[1] : tBoth(currentItem?.shortKey || currentItem?.key)[0]}</span>
                </span>
              </span>
            )}
            <span className="min-w-0 flex-1" />
            <button
              type="button"
              onClick={togglePanel}
              aria-expanded={panelOpen}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#12345A] hover:text-[#12345A]"
            >
              <Icon name={panelOpen ? 'ChevronUp' : 'LayoutGrid'} />
              {hi ? (panelOpen ? 'मॉड्यूल पैनल छिपाएँ' : 'सभी मॉड्यूल दिखाएँ') : (panelOpen ? 'Hide modules' : 'Show all modules')}
            </button>
          </>
        ) : (
          <div
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1.5 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {groups.map((g) => (
              <span key={g.labelKey} className="flex items-center gap-1">
                <span className="mx-1 hidden shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-300 xl:inline">
                  {hi ? tBoth(g.labelKey)[1] : tBoth(g.labelKey)[0]}
                </span>
                {g.items.map((item) => {
                  const on = item.key === activeKey;
                  // Tabs use a short label when one exists, so a long name such
                  // as "Meetings & Decisions" does not crowd the strip.
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
        )}
      </div>
      </div>

      {/* The section dashboard already lists every module as cards, so the panel
          would only repeat it there. It appears once a module is opened. */}
      {panel && panelOpen && !isDashboard && (
        <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 lg:px-8">
            {groups.map((g) => (
              <div key={g.labelKey}>
                <h3 className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-[#12345A]/5 text-[#176447]"><Icons.Layers size={12} /></span>
                  {hi ? tBoth(g.labelKey)[1] : tBoth(g.labelKey)[0]}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{g.items.length}</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {g.items.map((item) => {
                    const on = item.key === activeKey;
                    const [en, hiLabel] = tBoth(item.key);
                    const I = Icons[item.icon] || Icons.Folder;
                    if (item.planned) {
                      return (
                        <div key={item.key} title={hi ? 'जल्द आ रहा है' : 'Coming soon'}
                          className="flex cursor-not-allowed items-center gap-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-2 text-left">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-200 text-slate-400"><I size={15} /></span>
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-semibold text-slate-400">{en}</span>
                            <span className="block truncate text-[10px] text-slate-400">{hiLabel}</span>
                          </span>
                        </div>
                      );
                    }
                    return (
                      <button key={item.key} type="button" onClick={() => go(item)} aria-current={on ? 'page' : undefined}
                        className={`group flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_-14px_rgba(18,52,90,0.35)] ${on ? 'border-[#12345A]/40 bg-white ring-1 ring-[#12345A]/15' : 'border-slate-200 bg-white hover:border-[#12345A]/40'}`}>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg shadow-sm ring-1 ring-black/5 ${on ? 'bg-gradient-to-br from-[#176447] to-[#176447] text-white' : 'bg-gradient-to-br from-[#12345A] to-[#12345A] text-white'}`}><I size={15} /></span>
                        <span className="min-w-0">
                          <span className={`block truncate text-xs font-semibold ${on ? 'text-[#176447]' : 'text-slate-800 group-hover:text-[#12345A]'}`}>{en}</span>
                          <span className="block truncate text-[10px] text-slate-400">{hiLabel}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
