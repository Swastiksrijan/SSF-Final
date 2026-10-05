import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import { NAV } from '../ims/nav';
import { useLang } from '../ims/LangContext';
import { ims } from '../ims/api';

function Icon({ name, size = 18, className = '' }) {
  const C = Icons[name] || Icons.Circle;
  return <C size={size} className={className} />;
}

const GROUP_ORDER = ['main', 'organisation', 'governance', 'programmes', 'finance', 'resources', 'compliance', 'records', 'admin'];

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

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) { navigate({ to: '/ims/search', search: { q: q.trim() } }); setResults(null); }
  };

  const openResource = (item) => {
    setOpen(false);
    navigate({ to: '/ims/r/$resource', params: { resource: item.resource } });
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
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FF6600] font-bold">S</span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-wide">SSF-IMS</span>
              <span className="block text-[10px] text-white/70">{t('working_name')}</span>
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
                {results.length === 0 && <div className="px-3 py-2 text-sm text-slate-400">{t('no_records')}</div>}
                {results.map((r, i) => (
                  <button key={i} type="button" className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => { setResults(null); setQ(''); navigate({ to: '/ims/r/$resource', params: { resource: mapType(r.type) } }); }}>
                    <span className="font-medium">{r.title}</span>
                    <span className="text-xs text-slate-400">{r.recordId}</span>
                  </button>
                ))}
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
            <span className="hidden text-xs text-white/70 sm:block">{t('tagline')}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* sidebar */}
        <aside className={`${open ? 'block' : 'hidden'} fixed inset-y-16 left-0 z-30 w-72 overflow-y-auto border-r border-slate-200 bg-white pb-24 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)]`}>
          <nav className="p-3">
            {GROUP_ORDER.map(g => {
              const group = NAV.find(n => n.group === g);
              if (!group) return null;
              return (
                <div key={g} className="mb-3">
                  <div className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t(g)}</div>
                  {group.items.map(item => {
                    const isActive = active === item.key;
                    return (
                      <button key={item.key}
                        onClick={() => item.path ? (setOpen(false), navigate({ to: item.path })) : openResource(item)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition
                          ${isActive ? 'bg-[#FF6600] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <Icon name={item.icon} size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                        <span className="font-medium">{t(item.key)}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function mapType(tp) {
  const map = { person: 'persons', member: 'members', donor: 'donors', project: 'projects', meeting: 'meetings', resolution: 'resolutions', action: 'actions', document: 'documents', case: 'cases', transaction: 'transactions' };
  return map[tp] || tp + 's';
}
