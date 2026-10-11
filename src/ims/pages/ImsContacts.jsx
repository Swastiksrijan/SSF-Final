// Contact & Email Directory — the place to make sure every task owner can be
// notified. Lists each person with their email status, flags the gaps, and lets
// an admin paste a corrected list back in bulk. Editing one person still works
// through the normal Person Master; this page is the fast path for emails.
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, PageHeader, StatStrip, Empty, Spinner, Button, FormDrawer } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

const CONTACT_FIELDS = [
  { name: 'fullName', l: ['Name', 'नाम'], required: true },
  { name: 'mobile', l: ['Mobile', 'मोबाइल'] },
  { name: 'altMobile', l: ['Alternate mobile', 'वैकल्पिक मोबाइल'] },
  { name: 'email', l: ['Email', 'ईमेल'] },
];
const CONTACT_SCHEMA = { fields: CONTACT_FIELDS };

const ENGAGE = {
  member: { icon: 'IdCard', tone: 'bg-blue-50 text-blue-700' },
  committee: { icon: 'Landmark', tone: 'bg-purple-50 text-purple-700' },
  employee: { icon: 'Briefcase', tone: 'bg-teal-50 text-teal-700' },
  volunteer: { icon: 'HeartHandshake', tone: 'bg-amber-50 text-amber-700' },
};

export default function ImsContacts() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [missingOnly, setMissingOnly] = useState(true);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');
  const [edits, setEdits] = useState({});       // recordId -> drafted email
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [paste, setPaste] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const load = useCallback(async () => {
    setErr('');
    try { setData(await ims.contacts()); } catch (e) { setErr(e.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const rows = useMemo(() => {
    const recs = data?.records || [];
    const needle = q.trim().toLowerCase();
    return recs.filter((r) => {
      if (missingOnly && r.emailValid) return false;
      if (needle && !`${r.fullName} ${r.recordId} ${r.mobile} ${r.email}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [data, missingOnly, q]);

  const pendingRows = () => Object.entries(edits)
    .map(([recordId, email]) => ({ recordId, email: email.trim() }))
    .filter((r) => r.email);

  const saveAll = async () => {
    const rowsToSend = pendingRows();
    if (!rowsToSend.length) return;
    setSaving(true); setErr(''); setResult(null);
    try {
      const out = await ims.contactsImport(rowsToSend);
      setResult(out);
      setEdits({});
      await load();
    } catch (e) { setErr(e.message); } finally { setSaving(false); }
  };

  // "Name, email" or "Name <email>" per line, matched to a person by name.
  const applyPaste = () => {
    const byName = new Map((data?.records || []).map((r) => [r.fullName.toLowerCase().trim(), r.recordId]));
    const next = { ...edits };
    let matched = 0, unmatched = 0;
    for (const line of paste.split('\n')) {
      const m = line.match(/^\s*(.+?)\s*[<,;]\s*([^\s<>,;]+@[^\s<>,;]+)\s*$/);
      if (!m) { if (line.trim()) unmatched++; continue; }
      const recordId = byName.get(m[1].toLowerCase().trim());
      if (recordId) { next[recordId] = m[2].trim(); matched++; } else unmatched++;
    }
    setEdits(next);
    setPaste('');
    setShowPaste(false);
    setResult({ matched, unmatched, note: 'paste' });
  };

  const syncRegisters = async () => {
    setSyncing(true); setErr(''); setResult(null);
    try {
      const out = await ims.contactsSyncRegisters();
      setResult({ note: 'sync', ...out });
      setMissingOnly(false);
      await load();
    } catch (e) { setErr(e.message); }
    finally { setSyncing(false); }
  };

  const saveContact = async (form) => {
    if (!editRow) return;
    setEditSaving(true); setErr(''); setResult(null);
    try {
      const out = await ims.contactsUpdate(editRow.id, {
        fullName: form.fullName, mobile: form.mobile, altMobile: form.altMobile, email: form.email,
      });
      setResult({ note: 'saved', updated: 1, who: out.fullName });
      setEditRow(null);
      setEdits((s) => {
        const next = { ...s };
        delete next[editRow.recordId];
        return next;
      });
      await load();
    } catch (e) { setErr(e.message); } finally { setEditSaving(false); }
  };

  const removeContact = async (r) => {
    if (!confirm(`${t('remove_person')}: ${r.fullName} (${r.recordId})?`)) return;
    setErr('');
    try {
      const out = await ims.contactsRemove(r.id);
      setResult({ note: 'removed', who: out.fullName, how: out.removed });
      await load();
    } catch (e) { setErr(e.message); }
  };

  const shareWhatsapp = (r) => {
    const digits = String(r.mobile || '').replace(/\D/g, '').slice(-10);
    if (digits.length < 10) { setErr(t('no_mobile')); return; }
    const text = encodeURIComponent(t('wa_greeting'));
    window.open(`https://wa.me/91${digits}?text=${text}`, '_blank', 'noopener');
  };

  const notifySms = (r) => {
    const digits = String(r.mobile || '').replace(/\D/g, '').slice(-10);
    if (digits.length < 10) { setErr(t('no_mobile')); return; }
    window.location.assign(`sms:${digits}`);
  };

  const dirty = Object.keys(edits).length;

  return (
    <ImsLayout active="contacts">
      <PageHeader
        title={t('contacts_title')}
        subtitle={t('contacts_subtitle')}
        actions={(
          <>
            <Button variant="ghost" icon="RefreshCw" disabled={syncing} onClick={syncRegisters}>
              {syncing ? t('syncing') : t('sync_from_registers')}
            </Button>
            <Button variant="ghost" icon="ClipboardPaste" onClick={() => setShowPaste((v) => !v)}>{t('paste_list')}</Button>
            <Button icon="Save" disabled={saving || dirty === 0} onClick={saveAll}>
              {dirty ? `${t('save')} (${dirty})` : t('save')}
            </Button>
          </>
        )}
      />

      {data && (
        <StatStrip items={[
          { labelKey: 'contacts_total', value: data.total, icon: 'Users', tone: 'navy' },
          { labelKey: 'contacts_notifiable', value: data.withEmail, icon: 'MailCheck', tone: 'green' },
          { labelKey: 'contacts_missing', value: data.missing, icon: 'MailX', tone: 'amber' },
          { labelKey: 'contacts_placeholder', value: data.placeholder || 0, icon: 'UserX', tone: 'slate' },
        ]} />
      )}

      {showPaste && (
        <Card className="mt-4 p-4">
          <p className="mb-2 text-xs text-slate-500">{t('paste_hint')}</p>
          <textarea
            value={paste} onChange={(e) => setPaste(e.target.value)} rows={6}
            placeholder={'Ramesh Kumar, ramesh@example.org\nSita Devi <sita@example.org>'}
            className="w-full rounded-lg border border-slate-200 p-2 font-mono text-xs"
          />
          <div className="mt-2 flex gap-2">
            <Button icon="Check" onClick={applyPaste}>{t('apply')}</Button>
            <Button variant="ghost" icon="X" onClick={() => { setPaste(''); setShowPaste(false); }}>{t('cancel')}</Button>
          </div>
        </Card>
      )}

      <Card className="mt-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Icons.Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <button
            type="button" onClick={() => setMissingOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${missingOnly ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-600'}`}
          >
            <Icons.MailX size={14} /> {t('only_missing')}
          </button>
        </div>
      </Card>

      {result && (
        <Card className="mt-3 border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {result.note === 'paste'
            ? `${t('paste_matched')}: ${result.matched} · ${t('paste_unmatched')}: ${result.unmatched}`
            : result.note === 'sync'
              ? `${t('sync_people_new')}: ${result.personsCreated} · ${t('sync_people_linked')}: ${result.personsLinked} · ${t('sync_people_filled')}: ${result.personsFilled} · ${t('sync_members')}: ${result.members} · ${t('sync_committee')}: ${result.committee}`
              : result.note === 'saved'
                ? `${t('saved_count')}: ${result.who}`
                : result.note === 'removed'
                  ? `${t('removed')}: ${result.who} (${result.how})`
                  : `${t('saved_count')}: ${result.updated}${result.invalid?.length ? ` · ${t('invalid_count')}: ${result.invalid.length}` : ''}${result.notFound?.length ? ` · ${t('notfound_count')}: ${result.notFound.length}` : ''}`}
        </Card>
      )}
      {err && <Card className="mt-3 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}

      <Card className="mt-4 overflow-hidden">
        {!data && !err && <Spinner />}
        {data && rows.length === 0 && <Empty label={t('contacts_empty')} />}
        {data && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-2">{t('name')}</th>
                  <th className="px-4 py-2">{t('engaged_as')}</th>
                  <th className="px-4 py-2">{t('mobile')}</th>
                  <th className="px-4 py-2">{t('email')}</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const drafted = edits[r.recordId];
                  const value = drafted !== undefined ? drafted : (r.emailValid ? r.email : '');
                  const bad = value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
                  return (
                    <tr key={r.recordId} className="border-t border-slate-100">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${r.placeholder ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{r.fullName}</span>
                          {r.placeholder && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                              <Icons.UserX size={11} /> {t('placeholder_badge')}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">{r.recordId}</div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {r.engaged.length === 0 && <span className="text-xs text-slate-300">—</span>}
                          {r.engaged.map((tag) => {
                            const I = Icons[ENGAGE[tag]?.icon] || Icons.User;
                            return (
                              <span key={tag} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${ENGAGE[tag]?.tone || 'bg-slate-100 text-slate-500'}`}>
                                <I size={11} /> {t('engage_' + tag)}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-slate-600">{r.mobile || '—'}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <input
                            value={value}
                            placeholder="name@example.org"
                            onChange={(e) => setEdits((s) => ({ ...s, [r.recordId]: e.target.value }))}
                            className={`w-full min-w-[180px] rounded-lg border px-2 py-1 text-xs ${bad ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}
                          />
                          {r.emailValid && !bad && <Icons.MailCheck size={15} className="shrink-0 text-emerald-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-1">
                          {r.mobile ? (
                            <button
                              type="button" title={t('share_whatsapp')} onClick={() => shareWhatsapp(r)}
                              className="rounded-lg border border-slate-200 p-1.5 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50"
                            >
                              <Icons.MessageCircle size={14} />
                            </button>
                          ) : (
                            <span className="rounded-lg border border-slate-100 p-1.5 text-slate-200" title={t('no_mobile')}><Icons.MessageCircle size={14} /></span>
                          )}
                          {r.emailValid ? (
                            <a
                              href={`mailto:${r.email}`} title={t('send_email')}
                              className="rounded-lg border border-slate-200 p-1.5 text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                            >
                              <Icons.Mail size={14} />
                            </a>
                          ) : (
                            <span className="rounded-lg border border-slate-100 p-1.5 text-slate-200" title={t('contacts_missing')}><Icons.Mail size={14} /></span>
                          )}
                          <button
                            type="button" title={t('notify_sms')} onClick={() => notifySms(r)}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-[#002344] hover:text-[#002344]"
                          >
                            <Icons.Smartphone size={14} />
                          </button>
                          <button
                            type="button" title={t('edit_contact')} onClick={() => setEditRow(r)}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-[#FF6600] hover:text-[#FF6600]"
                          >
                            <Icons.Pencil size={14} />
                          </button>
                          <button
                            type="button" title={t('open_person')} onClick={() => window.location.assign(`/ims/person/${r.id}`)}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:text-[#002344]"
                          >
                            <Icons.ExternalLink size={14} />
                          </button>
                          <button
                            type="button" title={t('remove_person')} onClick={() => removeContact(r)}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-rose-300 hover:text-rose-600"
                          >
                            <Icons.Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <FormDrawer
        open={!!editRow}
        title={editRow ? `${t('edit_contact')} — ${editRow.fullName}` : t('edit_contact')}
        schema={CONTACT_SCHEMA}
        initial={editRow ? {
          fullName: editRow.fullName, mobile: editRow.mobile, altMobile: editRow.altMobile, email: editRow.email,
        } : {}}
        onClose={() => setEditRow(null)}
        onSubmit={saveContact}
        saving={editSaving}
      />
    </ImsLayout>
  );
}
