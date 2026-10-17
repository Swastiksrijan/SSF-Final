import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import ImsLayout from '../ImsLayout';
import { Card, Button, SectionHero, StatStrip } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';

// BANK / CASH STATEMENT IMPORT
//
// The treasurer pastes a year's statement (or the text copied out of the bank's
// PDF). The parser shows exactly what it understood BEFORE anything is written:
// the year, the totals, and whether the running balance ties to the printed one.
// Committing posts every row to the same double-entry ledger the registers read,
// so the Bank Book, Day Book and Trial Balance agree by construction.
//
// Importing is idempotent: each row carries a deterministic id, so re-pasting a
// corrected statement only fills the gaps.

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const SAMPLE = `Date        Particulars                                  Chq/Ref   Withdrawal   Deposit    Balance
03-04-2026  UPIAB/509368400629/CR/RAMESH P/UBIN/9971103790@pts            300.00   20116.84
05-05-2026  March 25 Worldine QR Rent                  271     29.50              20576.52`;

export default function ImsStatementImport() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [kind, setKind] = useState('bank');
  const [text, setText] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [openingFy, setOpeningFy] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    ims.list('bankAccounts', { limit: 100 })
      .then((d) => setAccounts(d.records || []))
      .catch(() => setAccounts([]));
  }, []);

  const accountKey = kind === 'cash' ? 'SSF-CASH' : 'UBIN-4814';
  const payload = () => ({
    text,
    kind,
    accountKey,
    accountId: accountId || undefined,
    openingBalance: openingBalance === '' ? undefined : Number(openingBalance),
    openingFy: openingFy || undefined,
  });

  const runPreview = async () => {
    setErr(''); setResult(null); setBusy(true);
    try {
      setPreview(await ims.statementPreview(payload()));
    } catch (e) { setErr(e.message); setPreview(null); } finally { setBusy(false); }
  };

  const runImport = async () => {
    if (!window.confirm('Import these entries into the ledger? Rows already imported are skipped.')) return;
    setErr(''); setBusy(true);
    try {
      const out = await ims.statementImport(payload());
      setResult(out);
      setPreview(await ims.statementPreview(payload()));
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const years = preview?.years || [];

  return (
    <ImsLayout active="statement_import">
      <SectionHero title={t('statement_import')} hi="बैंक विवरण आयात" eyebrow={t('finance')} icon="Upload" tone="navy"
        actions={<Button variant="hero" icon="BookText" onClick={() => navigate({ to: '/ims/finance/ledger' })}>{t('ledger_journal')}</Button>}>
        <p className="text-sm text-white/80">{t('statement_import_note')}</p>
      </SectionHero>

      {err && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{err}</p>}

      <Card className="mb-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm">
            <span className="font-bold text-[#12345A]">Book · बही</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5">
              <option value="bank">Bank Book · बैंक बही</option>
              <option value="cash">Cash Book · रोकड़ बही</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="font-bold text-[#12345A]">Account · खाता</span>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5">
              <option value="">— select —</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.bankName} {a.accountNo}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="font-bold text-[#12345A]">Opening balance · प्रारंभिक शेष</span>
            <input value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} inputMode="decimal" placeholder="19816.84" className="mt-1 w-full rounded-xl border px-3 py-2.5" />
          </label>
          <label className="text-sm">
            <span className="font-bold text-[#12345A]">Opening FY · वर्ष</span>
            <input value={openingFy} onChange={(e) => setOpeningFy(e.target.value)} placeholder="2026-27" className="mt-1 w-full rounded-xl border px-3 py-2.5" />
          </label>
        </div>

        <label className="mt-4 block text-sm">
          <span className="font-bold text-[#12345A]">Paste the statement · विवरण चिपकाएँ</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            placeholder={SAMPLE}
            className="mt-1 w-full rounded-xl border px-3 py-2.5 font-mono text-xs"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button icon="Search" onClick={runPreview} disabled={busy || !text.trim()}>Check / जाँचें</Button>
          <Button variant="primary" icon="Upload" onClick={runImport} disabled={busy || !preview || preview.toImport === 0}>
            {preview?.toImport ? `Import ${preview.toImport} entries / आयात करें` : 'Import / आयात करें'}
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="mb-5 border-emerald-200 bg-emerald-50">
          <p className="font-black text-emerald-800">
            Imported {result.imported} · skipped {result.skipped} already present
            {result.errors?.length ? ` · ${result.errors.length} could not be read` : ''}
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            The Bank Book, Day Book and Trial Balance now include these rows. Re-pasting the same statement is safe.
          </p>
        </Card>
      )}

      {preview && (
        <>
          <div className="mb-5">
            <StatStrip items={[
              { label: 'Rows read', value: String(preview.entries.length), icon: 'List', tone: 'navy' },
              { label: 'Already in ledger', value: String(preview.alreadyImported), icon: 'CheckCircle', tone: 'slate' },
              { label: 'Still to import', value: String(preview.toImport), icon: 'Upload', tone: preview.toImport ? 'orange' : 'green' },
              { label: 'Running balance', value: preview.runningBalanceTies ? '✓ ties' : '✗ differs', icon: 'Scale', tone: preview.runningBalanceTies ? 'green' : 'red' },
            ]} />
          </div>

          <Card className="mb-5">
            <h3 className="mb-3 font-black text-[#12345A]">Year totals · वर्षवार कुल</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="bg-zinc-50 text-xs uppercase text-zinc-500">
                  <th className="p-3">FY</th><th className="p-3">From</th><th className="p-3">To</th>
                  <th className="p-3 text-right">Rows</th><th className="p-3 text-right">Deposits</th>
                  <th className="p-3 text-right">Withdrawals</th><th className="p-3 text-right">Net</th>
                </tr></thead>
                <tbody className="divide-y">
                  {years.map((y) => (
                    <tr key={y.fy}>
                      <td className="p-3 font-black text-[#12345A]">FY {y.fy}</td>
                      <td className="p-3">{y.from}</td><td className="p-3">{y.to}</td>
                      <td className="p-3 text-right">{y.count}</td>
                      <td className="p-3 text-right text-emerald-700">{inr(y.deposit)}</td>
                      <td className="p-3 text-right text-red-700">{inr(y.withdrawal)}</td>
                      <td className="p-3 text-right font-bold">{inr(y.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {preview.openingBalance != null && (
              <p className="mt-3 text-sm text-zinc-600">
                Opening {inr(preview.openingBalance)} + net = expected closing {inr(preview.expectedClosing)}.
                {preview.runningBalanceTies
                  ? ' The statement’s own printed closing balance matches, so every row was read correctly.'
                  : ' The printed closing balance differs — a row may have been missed or misread; check the rows below.'}
              </p>
            )}
          </Card>

          <Card>
            <h3 className="mb-3 font-black text-[#12345A]">Rows read · पंक्तियाँ ({preview.entries.length})</h3>
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0"><tr className="bg-zinc-50 text-xs uppercase text-zinc-500">
                  <th className="p-2">Date</th><th className="p-2">Particulars</th><th className="p-2">Ref</th>
                  <th className="p-2 text-right">Withdrawal</th><th className="p-2 text-right">Deposit</th>
                  <th className="p-2 text-right">Balance</th>
                </tr></thead>
                <tbody className="divide-y">
                  {preview.entries.slice(0, 500).map((e, i) => (
                    <tr key={`${e.date}-${i}`}>
                      <td className="whitespace-nowrap p-2">{e.date}</td>
                      <td className="p-2">{e.particulars}</td>
                      <td className="p-2 text-zinc-500">{e.ref || '—'}</td>
                      <td className="p-2 text-right text-red-700">{e.withdrawal != null ? inr(e.withdrawal) : ''}</td>
                      <td className="p-2 text-right text-emerald-700">{e.deposit != null ? inr(e.deposit) : ''}</td>
                      <td className="p-2 text-right text-zinc-500">{e.balance != null ? inr(e.balance) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {preview.warnings?.length > 0 && (
              <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                <p className="font-bold">{preview.warnings.length} line(s) could not be read:</p>
                <ul className="mt-1 list-disc pl-5">
                  {preview.warnings.slice(0, 8).map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </Card>
        </>
      )}
    </ImsLayout>
  );
}
