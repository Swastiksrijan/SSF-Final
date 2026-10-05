import { useEffect, useState } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, Empty, Spinner } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

export default function ImsSearch() {
  const { q: initial = '' } = useSearch({ from: '/ims/search' });
  const { t } = useLang();
  const [q, setQ] = useState(initial);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const id = setTimeout(async () => {
      try { const r = await ims.search(q.trim()); setResults(r.results || []); } catch { setResults([]); }
    }, 200);
    return () => clearTimeout(id);
  }, [q]);

  const mapType = (tp) => ({ person: 'persons', member: 'members', donor: 'donors', project: 'projects', meeting: 'meetings', resolution: 'resolutions', action: 'actions', document: 'documents', case: 'cases', transaction: 'transactions' }[tp] || tp + 's');

  return (
    <ImsLayout active="global_search">
      <PageHeader title={t('global_search')} subtitle={t('tagline')} />
      <div className="relative mb-4 max-w-2xl">
        <Icons.Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={t('search_placeholder')}
          className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 outline-none focus:border-[#FF6600]" />
      </div>

      {!results && <Spinner />}
      {results && results.length === 0 && <Card><Empty /></Card>}
      {results && results.length > 0 && (
        <Card className="divide-y divide-slate-100">
          {results.map((r, i) => (
            <button key={i} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
              onClick={() => {
                if (r.type === 'person') navigate({ to: '/ims/person/$id', params: { id: String(r.id) } });
                else navigate({ to: '/ims/r/$resource', params: { resource: mapType(r.type) } });
              }}>
              <span>
                <span className="block font-medium text-slate-800">{r.title}</span>
                <span className="block text-xs uppercase tracking-wide text-slate-400">{r.type}</span>
              </span>
              <span className="font-mono text-xs text-slate-400">{r.recordId}</span>
            </button>
          ))}
        </Card>
      )}
    </ImsLayout>
  );
}
