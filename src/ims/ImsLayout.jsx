import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import { SIDEBAR, sidebarKeyFor, sidebarKeyForPath } from '../ims/sectionModules';
import SectionNav from './SectionNav';
import NotificationsHeader from './NotificationsHeader';
import { useLang } from '../ims/LangContext';
import { ims } from '../ims/api';
import { tBoth } from '../ims/i18n';
import logoImg from '../assets/new-logo.png';
import DownloadCenter from '../ims/DownloadCenter';

function Icon({ name, size = 18, className = '' }) {
  const C = Icons[name] || Icons.Circle;
  return <C size={size} className={className} />;
}

export default function ImsLayout({ children, active }) {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const shellRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    const id = setTimeout(async () => {
      try { const r = await ims.search(q.trim()); setResults(r.results || []); } catch { setResults([]); }
    }, 250);
    return () => clearTimeout(id);
  }, [q]);

  // The sidebar must sit exactly under the sticky chrome, and the chrome is
  // taller on the Notification Centre (its identity bar replaces the slim
  // section strip). Rather than hard-code a second offset that will drift, the
  // real height of header + secondary bar is published as `--ims-chrome-h` and
  // the sidebar consumes it. A ResizeObserver keeps it correct across language
  // switches and window resizes.
  const publishChromeHeight = useCallback(() => {
    const shell = shellRef.current;
    const bar = barRef.current;
    if (!shell || !bar) return;
    const header = shell.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    const h = headerHeight + bar.offsetHeight;
    if (headerHeight > 0) shell.style.setProperty('--ims-header-h', `${headerHeight}px`);
    if (h > 0) shell.style.setProperty('--ims-chrome-h', `${h}px`);
  }, []);

  useEffect(() => {
    publishChromeHeight();
    const bar = barRef.current;
    if (!bar || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(publishChromeHeight);
    ro.observe(bar);
    const header = shellRef.current?.querySelector('header');
    if (header) ro.observe(header);
    window.addEventListener('resize', publishChromeHeight);
    return () => { ro.disconnect(); window.removeEventListener('resize', publishChromeHeight); };
  }, [publishChromeHeight, active]);

  // Escape closes the mobile drawer, matching the behaviour of every other
  // overlay in the app (FormDrawer, DownloadCenter).
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const goToSearch = () => { if (q.trim()) { navigate({ to: '/ims/search', search: { q: q.trim() } }); setResults(null); } };
  const onSearchSubmit = (e) => { e.preventDefault(); goToSearch(); };

  const openResult = (r) => {
    setResults(null); setQ('');
    if (r.resource === 'persons') navigate({ to: '/ims/person/$id', params: { id: String(r.id) } });
    else if (r.resource === 'members') navigate({ to: '/ims/member/$id', params: { id: String(r.id) } });
    else navigate({ to: '/ims/r/$resource', params: { resource: r.resource }, search: { open: String(r.id) } });
  };

  const notifications = active === 'notifications' || active === 'notification_centre';
  // The route is the most reliable signal, with the page's own `active` label as
  // fallback — either way every alias collapses onto one sidebar entry.
  const activeKey = sidebarKeyForPath(pathname) || sidebarKeyFor(active);

  return (
    <div ref={shellRef} className="ssf-ims-shell min-h-screen bg-slate-50 text-slate-800" style={{ fontFamily: 'inherit' }}>
      {/* top bar */}
      <header className="sticky top-0 z-40 bg-[#12345A] text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4">
          <button className="lg:hidden rounded p-2 hover:bg-white/10" onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}>
            <Icons.Menu size={22} />
          </button>
          <Link to="/ims" className="flex items-center gap-2">
            <img src={logoImg} alt="SSF logo" className="h-10 w-10 rounded-lg bg-white p-1 object-contain" />
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-wide">{t('app_name')}</span>
              <span className="block text-[10px] text-white/70">{t('management_system')}</span>
            </span>
          </Link>

          <form onSubmit={onSearchSubmit} className="relative ml-2 hidden flex-1 max-w-xl md:block">
            <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder={t('search_placeholder')}
              aria-label={t('search_placeholder')}
              className="w-full rounded-lg bg-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder-white/60 outline-none focus:bg-white/15"
            />
            {results && (
              <div className="absolute left-0 right-0 top-11 max-h-80 overflow-auto rounded-lg bg-white p-1 text-slate-800 shadow-xl">
                {results.length === 0 && <div className="px-3 py-2 text-sm text-slate-400">{t('no_results_hint')}</div>}
                {results.slice(0, 8).map((r, i) => (
                  <button key={i} type="button" className="flex w-full items-center justify-between gap-2 rounded px-3 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => openResult(r)}>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{r.title}</span>
                      <span className="block text-[11px] text-slate-400">{r.type} • {r.recordId}</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-[#176447]">{t('open_record')}</span>
                  </button>
                ))}
                {results.length > 0 && (
                  <button type="button" onClick={goToSearch}
                    className="mt-0.5 block w-full rounded px-3 py-2 text-left text-xs font-semibold text-[#12345A] hover:bg-slate-100">
                    {t('results_found')}: {results.length} — {t('global_search')} →
                  </button>
                )}
              </div>
            )}
          </form>

          <div className="ml-auto flex items-center gap-2">
            <a href="/" title="Back to website · वेबसाइट पर वापस"
              className="hidden items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 sm:inline-flex">
              <Icons.Globe size={14} /> {lang === 'en' ? 'Website' : 'वेबसाइट'}
            </a>
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
              className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold hover:bg-white/10">
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>
            <DownloadCenter defaultResource={active} />
            <span className="hidden text-xs text-white/70 sm:block">{t('tagline')}</span>
          </div>
        </div>
      </header>

      {/* Secondary bar. ImsLayout owns the sticky slot so the section strip and
          the Notification Centre identity bar cannot drift apart — they are two
          faces of the same bar. The Notification Centre is global (it watches
          every register), so it shows its own identity bar instead of a single
          section's tab strip. */}
      <div ref={barRef} className="sticky z-30" style={{ top: 'var(--ims-header-h)' }}>
        {notifications ? <NotificationsHeader /> : <SectionNav active={active} />}
      </div>

      {/* Backdrop for the mobile drawer. Sits under the drawer (z-10 < z-20)
          and closes it on tap, so the content behind is visibly inert. */}
      {open && (
        <div
          className="fixed inset-0 z-10 bg-slate-900/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="mx-auto flex max-w-[1600px]">
        {/* sidebar */}
        <aside
          className={`${open ? 'block' : 'hidden'} fixed bottom-0 left-0 z-20 w-72 overflow-y-auto border-r border-slate-200 bg-white pb-24 lg:sticky lg:block lg:h-[calc(100vh-var(--ims-chrome-h))]`}
          style={{ top: 'var(--ims-chrome-h)' }}
        >
          <nav className="space-y-5 p-3">
            {[
              { title: 'Quick Access', hi: 'त्वरित पहुँच', keys: ['main_dashboard', 'global_search', 'notifications', 'social_publisher', 'volunteer_network'] },
              { title: 'Organisation & Operations', hi: 'संस्था एवं संचालन', keys: ['organisation', 'governance', 'programmes', 'finance', 'resources'] },
              { title: 'Control & Records', hi: 'नियंत्रण एवं अभिलेख', keys: ['compliance', 'records', 'admin'] },
            ].map((group) => (
              <section key={group.title} aria-label={lang === 'en' ? group.title : group.hi}>
                <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <span>{lang === 'en' ? group.title : group.hi}</span>
                </h2>
                <div className="space-y-1">
                  {group.keys.map((key) => {
                    const item = SIDEBAR.find((entry) => entry.key === key);
                    if (!item) return null;
                    const isActive = activeKey === item.key;
                    const both = tBoth(item.key);
                    return (
                      <button key={item.key}
                        onClick={() => (setOpen(false), navigate({ to: item.path }))}
                        aria-current={isActive ? 'page' : undefined}
                        className={`group flex min-h-[54px] w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-150
                          ${isActive ? 'border-[#12345A] bg-[#12345A] text-white shadow-[0_8px_20px_-10px_rgba(18,52,90,0.7)]' : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50'}`}>
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${isActive ? 'bg-white/15' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                          <Icon name={item.icon} size={17} className={isActive ? 'text-[#F7A814]' : 'text-slate-500'} />
                        </span>
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className={`block truncate text-[13px] font-semibold ${isActive ? 'text-white' : 'text-[#12345A]'}`}>{both[0]}</span>
                          <span className={`mt-0.5 block truncate text-[11px] font-medium ${isActive ? 'text-white/80' : 'text-[#176447]'}`}>{both[1]}</span>
                        </span>
                        {isActive && <Icons.ChevronRight size={15} className="shrink-0 text-white/70" />}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
