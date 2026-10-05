import { useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, Button, SectionHero, Tabs, Badge, Empty } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { parseBlocks, renderBlocks, slugifyHeading } from '../markdown';
import { exportManualPdf } from '../pdf';
import { POLICY_MANUAL_MARKDOWN, POLICY_MANUAL_META, POLICY_AREAS } from '../data/policyManual';

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const downloadText = (text, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};

export default function ImsPolicies() {
  const { t, lang } = useLang();
  const [tab, setTab] = useState('manual');
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    ims.list('policies', { limit: 100 })
      .then((d) => { if (live) setRecords(d.records || []); })
      .catch(() => { if (live) setRecords([]); });
    return () => { live = false; };
  }, []);

  const blocks = useMemo(() => parseBlocks(POLICY_MANUAL_MARKDOWN), []);
  const chapters = useMemo(
    () => blocks.filter((b) => b.type === 'heading' && b.level <= 2).map((b) => ({ id: slugifyHeading(b.text), text: b.text, level: b.level })),
    [blocks],
  );
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return blocks.filter((b) => {
      if (b.type === 'heading') return b.text.toLowerCase().includes(q);
      if (b.type === 'ul' || b.type === 'ol') return b.items.some((i) => i.toLowerCase().includes(q));
      if (b.type === 'table') return b.rows.some((r) => r.join(' ').toLowerCase().includes(q));
      if (b.type === 'p') return b.text.toLowerCase().includes(q);
      return false;
    });
  }, [blocks, query]);

  const master = useMemo(() => (records || []).find((r) => r.recordId === POLICY_MANUAL_META.policyId), [records]);
  const meta = POLICY_MANUAL_META;
  const parts = useMemo(() => chapters.filter((c) => c.level === 1 && /^PART\b/i.test(c.text)).length, [chapters]);
  const sections = useMemo(() => chapters.filter((c) => c.level === 1 && /^\d+\./.test(c.text)).length, [chapters]);

  const metaLines = [
    `${lang === 'hi' ? 'संगठन' : 'Organisation'}: ${meta.organisation}`,
    `Policy ID: ${meta.policyId}  ·  Version: ${meta.version}  ·  Status: ${meta.status}`,
    `${lang === 'hi' ? 'दस्तावेज़ प्रकार' : 'Document Type'}: ${meta.docType}`,
    `${lang === 'hi' ? 'लागू क्षेत्र' : 'Applicable Area'}: ${meta.applicableArea}  ·  Owner: ${meta.owner}`,
    `${lang === 'hi' ? 'पुनरीक्षण चक्र' : 'Review Cycle'}: ${meta.reviewCycle}`,
  ];

  const doPdf = async (md, name) => {
    setBusy(true);
    try {
      await exportManualPdf({
        title: meta.title, subtitle: meta.titleHi, meta: metaLines,
        toc: chapters.map((c) => c.text), markdown: md, filename: name,
      });
    } finally { setBusy(false); }
  };

  const downloadChapter = (id) => {
    const start = blocks.findIndex((b) => b.type === 'heading' && slugifyHeading(b.text) === id);
    if (start < 0) return;
    let end = blocks.length;
    const lvl = blocks[start].level;
    for (let i = start + 1; i < blocks.length; i++) {
      if (blocks[i].type === 'heading' && blocks[i].level <= lvl) { end = i; break; }
    }
    const chunk = blocks.slice(start, end);
    const md = renderChunkToMarkdown(chunk);
    doPdf(md, `ssf-policy-${slug(id)}.pdf`);
  };

  return (
    <ImsLayout>
      <SectionHero
        title={t('policy_manual')}
        hi={meta.titleHi}
        eyebrow={`${meta.policyId} · v${meta.version}`}
        icon="ScrollText"
        tone="navy"
        actions={(
          <div className="flex flex-wrap gap-2">
            <Button variant="hero" icon="Printer" onClick={() => window.print()}>{t('print')}</Button>
            <Button variant="hero" icon="FileDown" onClick={() => doPdf(POLICY_MANUAL_MARKDOWN, 'ssf-policy-manual.pdf')} disabled={busy}>{t('download_pdf')}</Button>
            <Button variant="hero" icon="FileText" onClick={() => downloadText(POLICY_MANUAL_MARKDOWN, 'ssf-policy-manual.md')}>{t('download')} MD</Button>
          </div>
        )}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-semibold text-white/80">
          <span>{meta.organisation}</span>
          <span>{t('policy_status')}: <span className="text-[#FFD166]">{meta.status}</span></span>
          <span>{t('parts')}: {parts}</span>
          <span>{t('sections')}: {sections}</span>
          <span>{t('policy_areas')}: {POLICY_AREAS.length}</span>
        </div>
      </SectionHero>

      <Tabs
        tabs={[
          { id: 'manual', en: t('manual'), hi: 'नियमावली' },
          { id: 'approval', en: t('approval_versions'), hi: 'अनुमोदन एवं संस्करण' },
          { id: 'register', en: t('all_policies'), hi: 'सभी नीतियाँ', count: records ? records.length : undefined },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'manual' && (
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <Card className="h-fit p-3 lg:sticky lg:top-24">
            <div className="relative mb-3">
              <Icons.Search size={15} className="pointer-events-none absolute left-2.5 top-2.5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_policy')}
                className="w-full rounded-lg border border-slate-300 py-2 pl-8 pr-2 text-sm outline-none focus:border-[#FF6600]"
              />
            </div>
            <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">{t('contents')}</p>
            <nav className="max-h-[62vh] space-y-0.5 overflow-y-auto">
              {chapters.map((c) => (
                <div key={c.id} className="group flex items-center gap-1">
                  <button
                    onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className={`flex-1 rounded-md px-2 py-1.5 text-left text-[13px] leading-snug transition hover:bg-slate-100 ${c.level === 1 ? 'font-bold text-[#002344]' : 'pl-4 text-slate-500'}`}
                  >
                    {c.text}
                  </button>
                  {c.level === 1 && (
                    <button
                      title={t('export_chapter')}
                      onClick={() => downloadChapter(c.id)}
                      className="rounded p-1 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-[#FF6600] group-hover:opacity-100"
                    >
                      <Icons.FileDown size={14} />
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </Card>

          <Card className="p-5 sm:p-7">
            {matches ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-500">{matches.length} {t('matches_for')} “{query}”</p>
                  <Button variant="ghost" icon="X" onClick={() => setQuery('')}>{t('clear')}</Button>
                </div>
                {matches.length === 0 ? <Empty label={t('no_matches')} /> : <div className="space-y-2">{renderBlocks(matches)}</div>}
              </div>
            ) : (
              <article className="prose-sm max-w-none">{renderBlocks(blocks)}</article>
            )}
          </Card>
        </div>
      )}

      {tab === 'approval' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('approval_record')}</h2>
            <dl className="space-y-2 text-sm">
              {[
                [t('policy_id'), meta.policyId],
                [t('version'), `v${meta.version}`],
                [t('approval_status'), meta.status],
                [t('approval_meeting'), meta.approval.meeting || '—'],
                [t('resolution_no'), meta.approval.resolutionNo || '—'],
                [t('approval_date'), meta.approval.date || '—'],
                [t('approved_by'), meta.approval.approvedBy || '—'],
                [t('signature'), meta.approval.signature || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-dashed border-slate-200 pb-1.5">
                  <dt className="text-slate-500">{k}</dt><dd className="text-right font-semibold text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>
            {master && (
              <p className="mt-4 text-xs text-slate-500">
                {t('linked_record')}: <span className="font-mono font-semibold text-[#002344]">{master.recordId}</span> · <Badge status={master.status} />
              </p>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('amendment_history')}</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="pb-2">{t('version')}</th><th className="pb-2">{t('date')}</th><th className="pb-2">{t('description')}</th><th className="pb-2">{t('approved_by')}</th>
                </tr>
              </thead>
              <tbody>
                {meta.amendmentHistory.map((a) => (
                  <tr key={a.version} className="border-t border-slate-100">
                    <td className="py-2 font-semibold">v{a.version}</td><td className="py-2">{a.date}</td><td className="py-2">{a.description}</td><td className="py-2">{a.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-slate-500">{t('policy_versioning_note')}</p>
          </Card>
        </div>
      )}

      {tab === 'register' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('all_policies')}</h2>
            {records === null ? <p className="text-sm text-slate-400">…</p> : records.length === 0 ? <Empty /> : (
              <ul className="space-y-2">
                {records.map((r) => (
                  <li key={r.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 p-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{r.title}</p>
                      <p className="text-xs text-slate-400">{r.recordId} · {r.category || '—'} · v{r.version}</p>
                    </div>
                    <Badge status={r.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t('policy_areas')} ({POLICY_AREAS.length})</h2>
            <p className="mb-3 text-xs text-slate-500">{t('policy_areas_note')}</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
              {POLICY_AREAS.map((a) => <li key={a}>{a}</li>)}
            </ol>
          </Card>
        </div>
      )}
    </ImsLayout>
  );
}

/** Rebuild a markdown string for a subset of parsed blocks (chapter export). */
function renderChunkToMarkdown(chunk) {
  return chunk.map((b) => {
    if (b.type === 'heading') return `${'#'.repeat(b.level)} ${b.text}`;
    if (b.type === 'hr') return '---';
    if (b.type === 'ul') return b.items.map((i) => `- ${i}`).join('\n');
    if (b.type === 'ol') return b.items.map((i, n) => `${n + 1}. ${i}`).join('\n');
    if (b.type === 'table') return b.rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
    return b.text;
  }).join('\n\n');
}
