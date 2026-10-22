// Persistent sub-navigation for the current section.
//
// The sidebar only lists the 9 primary sections. This strip sits directly under
// the top bar and keeps every module of the active section one click away, so
// opening a module never hides its siblings. ImsLayout renders it once, so it
// appears on every IMS page — custom pages, generic resources and legacy
// registers alike.
//
// Small sections fit their modules on one scrolling row. The wide ones (Finance
// has ~70 modules in 8 blocks) do not. For those the strip stays a single row:
// it names the block and the module in view, and a "Modules" button opens the
// full grouped list as a dropdown. The dropdown is absolutely positioned, so it
// floats over the page instead of pushing the dashboard or the list down — the
// earlier inline panel was taller than the viewport and buried the content.
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

// Sections past this size switch from one scrolling row to the dropdown, so no
// module is ever hidden off the edge of the screen.
const DROPDOWN_MIN_ITEMS = 16;
const usesDropdown = (groups) => {
  const items = groups.reduce((n, g) => n + g.items.length, 0);
  return items > DROPDOWN_MIN_ITEMS || groups.length >= 6;
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

export default function SectionNav({ active }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeRef = useRef(null);
  const menuRef = useRef(null);

  const sectionId = sectionForPath(pathname) || sectionForKey(active);
  const activeKey = sectionId ? itemKeyForPath(sectionId, pathname) || active : null;
  const isDashboard = sectionId ? pathname === dashboardPath(sectionId) : false;

  // A dropdown that survives a navigation is worse than no dropdown: close it
  // whenever the module changes. Resetting during render (not in an effect)
  // keeps the reset in the same commit as the route change, so the menu never
  // flashes open on the new page.
  const [menuState, setMenuState] = useState({ path: null, open: false });
  if (menuState.path !== pathname) setMenuState({ path: pathname, open: false });
  const menuOpen = menuState.open;
  const setMenuOpen = (next) => setMenuState((prev) => ({ path: pathname, open: typeof next === 'function' ? next(prev.open) : next }));
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [pathname]);

  if (!sectionId) return null;
  const cfg = SECTIONS[sectionId];
  const groups = sectionGroups(sectionId);
  const dropdown = usesDropdown(groups);
  const [secEn, secHi] = tBoth(cfg.titleKey);
  const hi = lang === 'hi';

  const go = (item) => {
    if (item.planned) return;
    setMenuOpen(false);
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

  const currentGroup = groups.find((g) => g.items.some((it) => it.key === activeKey));
  const currentItem = currentGroup?.items.find((it) => it.key === activeKey);

  return (
    <div ref={menuRef} className="relative z-30">
      <div className="border-b border-slate-200 bg-white/95 shadow-[0_8px_18px_-14px_rgba(18,52,90,0.4)] backdrop-blur">
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

          {dropdown ? (
            <>
              {/* The wide sections keep the strip static: it names the block and
                  the module in view instead of scrolling a long row of tabs, so
                  the heading never slides left or right when a module opens. */}
              {currentGroup && (
                <>
                  <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-300 md:inline">
                    {hi ? tBoth(currentGroup.labelKey)[1] : tBoth(currentGroup.labelKey)[0]}
                  </span>
                  <span className="flex min-w-0 items-center gap-1.5 rounded-lg bg-[#12345A] px-2.5 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_-4px_rgba(18,52,90,0.6)]">
                    <Icon name={currentItem?.icon} />
                    <span className="truncate">{hi ? tBoth(currentItem?.shortKey || currentItem?.key)[1] : tBoth(currentItem?.shortKey || currentItem?.key)[0]}</span>
                  </span>
                </>
              )}
              <span className="min-w-0 flex-1" />
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${menuOpen ? 'border-[#12345A] bg-[#12345A] text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-[#12345A] hover:text-[#12345A]'}`}
              >
                <Icon name="LayoutGrid" />
                {hi ? 'मॉड्यूल' : 'Modules'}
                <Icons.ChevronDown size={14} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
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

      {/* The module menu floats over the page, so the dashboard or list below is
          never pushed down and never covered while it is shut. */}
      {dropdown && menuOpen && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-slate-200 bg-white shadow-[0_24px_48px_-24px_rgba(18,52,90,0.55)]">
          <div className="mx-auto max-w-[1600px] px-4 py-4 lg:px-8">
            <SectionModuleDirectory sectionId={sectionId} activeKey={activeKey} maxHeight="60vh" />
          </div>
        </div>
      )}

      {/* Notifications is a two-page section, so its modules get large dashboard
          cards below the strip instead of cramped header tabs. */}
      {sectionId === 'notifications' && <NotificationsModules activeKey={activeKey} />}
    </div>
  );
}

// The full module list of a section as a searchable, grouped card grid. Shared
// by the header dropdown and by the section dashboard (Finance), so a wide
// section's modules always live in one place the admin can open and click.
export function SectionModuleDirectory({ sectionId, activeKey = null, maxHeight = null, collapsible = false }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const hi = lang === 'hi';
  const groups = sectionGroups(sectionId);
  const [filter, setFilter] = useState('');
  const needle = filter.trim().toLowerCase();
  const matches = (it) => `${tBoth(it.key)[0]} ${tBoth(it.key)[1]} ${tBoth(it.shortKey || it.key)[0]}`.toLowerCase().includes(needle);
  const anyMatch = !needle || groups.some((g) => g.items.some(matches));

  const go = (item) => {
    if (item.planned) return;
    if (item.path) navigate({ to: item.path });
    else if (item.resource) navigate({ to: '/ims/r/$resource', params: { resource: item.resource } });
  };

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={hi ? 'मॉड्यूल खोजें…' : 'Search modules…'}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm"
            aria-label={hi ? 'मॉड्यूल खोजें' : 'Search modules'}
          />
        </label>
        <button type="button" onClick={() => navigate({ to: dashboardPath(sectionId) })}
          className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-[#12345A] hover:bg-slate-200">
          {hi ? 'अनुभाग डैशबोर्ड' : 'Section dashboard'}
        </button>
      </div>
      <div className="space-y-4 overflow-y-auto pr-1" style={maxHeight ? { maxHeight } : undefined}>
        {groups.map((g, groupIndex) => {
          const items = needle ? g.items.filter(matches) : g.items;
          if (items.length === 0) return null;
          const heading = (
            <h3 className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 ${collapsible ? 'mb-0 min-h-10' : 'mb-2 text-slate-400'}`}>
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#12345A]/5 text-[#176447]"><Icons.Layers size={13} /></span>
              <span className="min-w-0 flex-1">{hi ? tBoth(g.labelKey)[1] : tBoth(g.labelKey)[0]}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{items.length}</span>
              {collapsible && <Icons.ChevronDown size={15} className="text-slate-400" />}
            </h3>
          );
          const cards = (
            <div className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${collapsible ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-5'}`}>
              {items.map((item) => {
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
          );
          if (!collapsible) {
            return <div key={g.labelKey}>{heading}{cards}</div>;
          }
          return (
            <details key={g.labelKey} open={needle ? true : undefined} className="group/finance rounded-xl border border-slate-200 bg-white px-3">
              <summary className="flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden">
                {heading}
              </summary>
              <div className="pb-3">{cards}</div>
            </details>
          );
        })}
        {!anyMatch && <p className="py-6 text-center text-sm text-slate-400">{hi ? 'कोई मॉड्यूल नहीं मिला' : 'No module matches'}</p>}
      </div>
    </div>
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
