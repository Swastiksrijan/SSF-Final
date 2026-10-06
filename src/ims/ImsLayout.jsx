import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import { SIDEBAR } from '../ims/sectionModules';
import SectionNav from './SectionNav';
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

  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    const id = setTimeout(async () => {
      try { const r = await ims.search(q.trim()); setResults(r.results || []); } catch { setResults([]); }
    }, 250);
    return () => clearTimeout(id);
  }, [q]);

  const goToSearch = () => { if (q.trim()) { navigate({ to: '/ims/search', search: { q: q.trim() } }); setResults(null); } };
  const onSearchSubmit = (e) => { e.preventDefault(); goToSearch(); };

  const openResult = (r) => {
    setResults(null); setQ('');
    if (r.resource === 'persons') navigate({ to: '/ims/person/$id', params: { id: String(r.id) } });
    else if (r.resource === 'members') navigate({ to: '/ims/member/$id', params: { id: String(r.id) } });
    else navigate({ to: '/ims/r/$resource', params: { resource: r.resource }, search: { open: String(r.id) } });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" style={{ fontFamily: 'inherit' }}>
      {/* top bar */}
      <header className="sticky top-0 z-40 bg-[#002344] text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4">
          <button className="lg:hidden rounded p-2 hover:bg-white/10" onClick={() => setOpen(o => !o)} aria-label="Menu">
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
                    <span className="shrink-0 text-xs font-semibold text-[#FF6600]">{t('open_record')}</span>
                  </button>
                ))}
                {results.length > 0 && (
                  <button type="button" onClick={goToSearch}
                    className="mt-0.5 block w-full rounded px-3 py-2 text-left text-xs font-semibold text-[#002344] hover:bg-slate-100">
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
              className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold hover:bg-white/10">
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>
            <DownloadCenter defaultResource={active} />
            <span className="hidden text-xs text-white/70 sm:block">{t('tagline')}</span>
          </div>
        </div>
      </header>

      <SectionNav active={active} />

      <div className="mx-auto flex max-w-[1600px]">
        {/* sidebar */}
        <aside className={`${open ? 'block' : 'hidden'} fixed top-[7rem] bottom-0 left-0 z-20 w-72 overflow-y-auto border-r border-slate-200 bg-white pb-24 lg:sticky lg:top-[7rem] lg:block lg:h-[calc(100vh-7rem)]`}>
          <nav className="space-y-1 p-3">
            {SIDEBAR.map((item) => {
              const isActive = active === (item.activeKey || item.key);
              const both = tBoth(item.key);
              return (
                <button key={item.key}
                  onClick={() => (setOpen(false), navigate({ to: item.path }))}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150
                    ${isActive ? 'bg-gradient-to-r from-[#002344] to-[#0b3a63] text-white shadow-[0_8px_20px_-10px_rgba(2,35,68,0.7)]' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${isActive ? 'bg-white/15' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                    <Icon name={item.icon} size={16} className={isActive ? 'text-[#FFD166]' : 'text-slate-500'} />
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className={`block truncate text-sm font-semibold ${isActive ? 'text-white' : 'text-[#002344]'}`}>{both[0]}</span>
                    <span className={`block truncate text-[11px] font-medium ${isActive ? 'text-[#FFF8E7]/90' : 'text-[#1F7A70]'}`}>{both[1]}</span>
                  </span>
                  {isActive && <Icons.ChevronRight size={15} className="shrink-0 text-white/60" />}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
