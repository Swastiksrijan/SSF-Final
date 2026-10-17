// Bank / cash statement importer for SSF-IMS.
//
// A treasurer pastes a year's bank statement (or drops the bank's PDF text) and
// this module turns it into ledger postings, so the Bank Book, Day Book and
// Trial Balance all follow from the same double-entry engine the registers use.
// Nothing here is mocked: the parser is pure and the commit path calls the real
// accounting engine.
//
// Idempotent by construction: every imported row carries a deterministic
// sourceRecordId, and a row whose id is already in the ledger is skipped. So a
// year can be pasted twice (or a corrected paste re-run) without duplicating.
const { models, sequelize } = require('../../models/ims');
const { Op } = require('sequelize');
const accounting = require('./accounting');
const { nextId } = require('./ids');

const BANK_COA = '1100';
const CASH_COA = '1000';
// Where the other side of an unclassified bank line goes until it is matched to
// a register. Keeping it explicit (instead of guessing donation/expense) is what
// makes the later reconciliation honest.
const SUSPENSE_IN = '3999';
const SUSPENSE_OUT = '4999';
const OPENING_EQUITY = '2900';

const MONTHS = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

const pad = (n) => String(n).padStart(2, '0');

/** Parse one amount cell. Returns a number, or null when the cell is empty/nil. */
function parseAmount(raw) {
  if (raw == null) return null;
  let s = String(raw).replace(/[₹,\s]/g, '').replace(/(cr|dr)\.?$/i, '');
  if (!s || s === '-' || s === '--' || /^nil$/i.test(s)) return null;
  const neg = /^\(.*\)$/.test(s);
  s = s.replace(/[()]/g, '');
  if (!/^\d*\.?\d+$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return neg ? -n : n;
}

/** Parse a leading date in the formats Indian bank statements actually print. */
function parseDate(raw) {
  const s = String(raw || '').trim().replace(/^["']|["']$/g, '');
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/); // 2025-04-03
  if (m) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/); // 03/04/2025 (dd/mm/yyyy)
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${pad(m[2])}-${pad(m[1])}`;
  }
  m = s.match(/^(\d{1,2})[-\s]([A-Za-z]{3})[a-z]*[-\s](\d{2,4})/); // 03 Apr 2025
  if (m && MONTHS[m[2].toLowerCase()]) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${pad(MONTHS[m[2].toLowerCase()])}-${pad(m[1])}`;
  }
  m = s.match(/^([A-Za-z]{3})[a-z]*[-\s](\d{1,2}),?[-\s](\d{2,4})/); // Apr 03, 2025
  if (m && MONTHS[m[1].toLowerCase()]) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${pad(MONTHS[m[1].toLowerCase()])}-${pad(m[2])}`;
  }
  return null;
}

const HEADER_WORDS = {
  date: /^(date|txn\s*date|tran\s*date|value\s*date|post\s*date|दिनांक)$/i,
  particulars: /^(particulars?|description|narration|details|transaction\s*details|remarks|विवरण)$/i,
  ref: /^(chq|cheque|chq\.?\s*\/?\s*ref|ref\s*no\.?|reference|instrument\s*(no|id)?)$/i,
  withdrawal: /^(withdrawal|withdrawals|debit|dr|paid\s*out|payments?|नामे|भुगतान)$/i,
  deposit: /^(deposit|deposits|credit|cr|paid\s*in|receipts?|जमा)$/i,
  balance: /^(balance|closing\s*balance|running\s*balance|शेष)$/i,
};

/**
 * Find the money columns the header names and their left-to-right order.
 * We only use the ORDER (does withdrawal come before deposit?), never the exact
 * offsets — pasted text is rarely perfectly column-aligned, so each row is
 * parsed from its own tokens instead.
 */
function readHeader(line) {
  const cells = line.split(/\t| {2,}/).map((c) => c.trim()).filter(Boolean);
  if (cells.length < 2) return null;
  const seen = [];
  for (const cell of cells) {
    const clean = cell.replace(/[.:]$/, '');
    for (const [key, re] of Object.entries(HEADER_WORDS)) {
      if (re.test(clean) && !seen.includes(key)) { seen.push(key); break; }
    }
  }
  // A header is only usable if it names a date and at least one money column.
  const moneyCols = seen.filter((k) => k === 'withdrawal' || k === 'deposit' || k === 'balance');
  if (!seen.includes('date') || !moneyCols.length) return null;
  return { columns: seen, moneyOrder: moneyCols };
}

const MONEY_RE = /-?\d[\d,]*\.\d{1,2}/g;

const NOISE = /^(opening\s*balance|closing\s*balance|balance\s*(c\/f|b\/f)|brought\s*forward|carried\s*forward|total|sub\s*total|grand\s*total|statement\s*(of|period)|page\s*\d|generated|this\s*is\s*a\s*computer)/i;

/** Text of a data row split at the first money token. */
function splitRow(rest) {
  const firstMoney = rest.search(MONEY_RE);
  if (firstMoney < 0) return { text: rest.trim(), nums: [] };
  const text = rest.slice(0, firstMoney).trim();
  const nums = (rest.slice(firstMoney).match(MONEY_RE) || []).map(parseAmount).filter((n) => n != null);
  return { text, nums };
}

/**
 * Parse a pasted statement into entries. Handles aligned layouts (with a header
 * row) and loose layouts where the last number on the line is the running
 * balance. Direction is taken from the header column order when present, and
 * otherwise inferred from the balance movement.
 * Returns { entries, warnings }.
 */
function parseStatement(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n');
  const entries = [];
  const warnings = [];
  let header = null;
  let prevBalance = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '');
    if (!line.trim()) continue;

    const maybeHeader = readHeader(line);
    if (maybeHeader) { header = maybeHeader; continue; }

    const m = line.match(/^\s*(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{1,2}[-\s][A-Za-z]{3}[a-z]*[-\s]\d{2,4}|[A-Za-z]{3}[a-z]*[-\s]\d{1,2},?[-\s]\d{2,4})/);
    if (!m) continue;
    const date = parseDate(m[1]);
    if (!date) continue;
    const rest = line.slice(m[1].length).trim();

    // A total / brought-forward / opening line is furniture, not a transaction.
    if (NOISE.test(rest)) {
      const ob = rest.match(MONEY_RE);
      if (ob && /opening|brought|b\/f/i.test(rest)) prevBalance = parseAmount(ob[ob.length - 1]);
      continue;
    }

    const { text: textPart, nums } = splitRow(rest);
    if (!nums.length) { warnings.push(`No amount on: ${line.trim().slice(0, 90)}`); continue; }

    // The last number on a statement line is the running balance — unless the
    // header explicitly lists only withdrawal/deposit columns.
    const hasBalanceCol = header ? header.moneyOrder.includes('balance') : true;
    let balance = null;
    let moving = nums;
    if (hasBalanceCol && nums.length >= 2) { balance = nums[nums.length - 1]; moving = nums.slice(0, -1); }

    // A trailing bare integer before the first amount is the cheque / reference
    // no. (Amounts always carry decimals, so this cannot swallow a figure.)
    let ref = '';
    let particulars = textPart;
    const refTail = particulars.match(/(?:^|\s)(\d{3,12})\s*$/);
    if (refTail) { ref = refTail[1]; particulars = particulars.slice(0, refTail.index).trim(); }
    if (!ref) {
      const refMatch = rest.match(/(?:chq|ref|utr|neft|imps)[^\d]{0,6}(\d{4,})/i);
      if (refMatch) ref = refMatch[1];
    }

    let withdrawal = null;
    let deposit = null;
    if (moving.length >= 2) {
      // Two money cells: the header says which is which; without a header assume
      // the Indian convention (withdrawal first, deposit second).
      const wFirst = !header || header.moneyOrder.indexOf('withdrawal') < header.moneyOrder.indexOf('deposit');
      const first = moving[0];
      const second = moving[1];
      if (wFirst) { withdrawal = first; deposit = second; } else { deposit = first; withdrawal = second; }
    } else if (moving.length === 1) {
      const only = moving[0];
      if (header && header.moneyOrder.includes('withdrawal') && !header.moneyOrder.includes('deposit')) {
        withdrawal = only;
      } else if (header && header.moneyOrder.includes('deposit') && !header.moneyOrder.includes('withdrawal')) {
        deposit = only;
      } else if (prevBalance != null && balance != null) {
        if (balance < prevBalance) withdrawal = only; else deposit = only;
      } else {
        deposit = only;
      }
    }

    if (withdrawal == null && deposit == null) {
      warnings.push(`No amount found on: ${line.trim().slice(0, 90)}`);
      continue;
    }
    if (balance != null) prevBalance = balance;
    entries.push({
      date,
      particulars: particulars || 'Bank transaction',
      ref,
      withdrawal: withdrawal == null ? null : Math.abs(withdrawal),
      deposit: deposit == null ? null : Math.abs(deposit),
      balance,
    });
  }

  return { entries, warnings };
}

/** Financial-year label (e.g. 2025-26) for a date, FY starting in April. */
function fyOf(date) {
  const y = Number(String(date).slice(0, 4));
  const m = Number(String(date).slice(5, 7));
  if (!y || !m) return null;
  const start = m >= 4 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
}

/**
 * Inspect a paste without writing anything: what was parsed, the FY, the totals,
 * whether the running balance ties, and which rows are already in the ledger.
 */
async function preview(text, opts = {}) {
  const { entries, warnings } = parseStatement(text);
  const byFy = {};
  for (const e of entries) {
    const fy = fyOf(e.date);
    byFy[fy] = byFy[fy] || { fy, count: 0, deposit: 0, withdrawal: 0, from: e.date, to: e.date };
    const g = byFy[fy];
    g.count += 1;
    g.deposit += e.deposit || 0;
    g.withdrawal += e.withdrawal || 0;
    if (e.date < g.from) g.from = e.date;
    if (e.date > g.to) g.to = e.date;
  }

  // Does the printed running balance agree with opening + deposits - withdrawals?
  let runningOk = true;
  let first = null;
  let last = null;
  for (const e of entries) {
    if (e.balance == null) continue;
    if (!first) first = e;
    last = e;
  }
  let expectedClosing = null;
  if (first && last) {
    const opening = opts.openingBalance != null
      ? Number(opts.openingBalance)
      : Number((first.balance - (first.deposit || 0) + (first.withdrawal || 0)).toFixed(2));
    const sum = entries.reduce((s, e) => s + (e.deposit || 0) - (e.withdrawal || 0), 0);
    expectedClosing = Number((opening + sum).toFixed(2));
    runningOk = Math.abs(expectedClosing - last.balance) < 0.02;
    opts = { ...opts, openingBalance: opening };
  }

  const existing = new Set();
  let alreadyImported = 0;
  if (entries.length) {
    const ids = sourceIds(opts.accountKey || 'UBIN-4814', entries);
    const rows = await models.ImsLedgerEntry.findAll({
      where: { sourceRecordId: { [Op.in]: ids } },
      attributes: ['sourceRecordId'],
    });
    for (const r of rows) existing.add(r.sourceRecordId);
    alreadyImported = ids.filter((id) => existing.has(id)).length;
  }

  return {
    entries,
    warnings,
    years: Object.values(byFy).map((g) => ({
      ...g,
      deposit: Number(g.deposit.toFixed(2)),
      withdrawal: Number(g.withdrawal.toFixed(2)),
      net: Number((g.deposit - g.withdrawal).toFixed(2)),
    })).sort((a, b) => (a.fy < b.fy ? 1 : -1)),
    openingBalance: opts.openingBalance != null ? Number(opts.openingBalance) : null,
    expectedClosing,
    runningBalanceTies: runningOk,
    alreadyImported,
    toImport: entries.length - alreadyImported,
  };
}

/** Deterministic id so a re-paste never duplicates a row. */
function sourceId(accountKey, e, seq) {
  const amt = e.deposit != null ? `d${e.deposit}` : `w${e.withdrawal}`;
  const text = String(e.particulars || '').slice(0, 40).replace(/\s+/g, ' ');
  // The running balance is what makes a row unique when a statement prints two
  // identical-looking entries on the same day; `seq` covers pastes that omit it.
  const bal = e.balance != null ? `:${e.balance}` : `:#${seq || 0}`;
  return `bankst:${accountKey}:${e.date}:${amt}:${text}${bal}`;
}

/**
 * Ids for a whole parsed statement. Two rows that look identical get distinct
 * ids via a sequence suffix, so both survive; the same text always yields the
 * same ids, so re-pasting is still a no-op.
 */
function sourceIds(accountKey, entries) {
  const seen = new Map();
  return entries.map((e) => {
    const base = sourceId(accountKey, e, 0);
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}:${n}`;
  });
}

async function coaByCode(code, fallbackName, accountType) {
  let a = await models.ImsAccount.findOne({ where: { code } });
  if (!a) {
    a = await models.ImsAccount.create({
      code, name: fallbackName, accountType, recordId: await nextId('COA', null, models.ImsAccount),
      status: 'active', createdByName: 'Bank Statement Import',
    });
  }
  return a;
}

async function ensureFinancialYear(label) {
  let fy = await models.ImsFinancialYear.findOne({ where: { label } });
  if (!fy) {
    const start = Number(label.slice(0, 4));
    fy = await models.ImsFinancialYear.create({
      label, startDate: `${start}-04-01`, endDate: `${start + 1}-03-31`,
      isCurrent: false, recordId: await nextId('FY', null, models.ImsFinancialYear),
    });
  }
  return fy;
}

/**
 * Post the parsed statement to the ledger. Skips rows already imported.
 * `kind` is 'bank' or 'cash'; `accountId` is the ImsBankAccount/ImsCashAccount id.
 */
async function commit(text, opts = {}, req) {
  const kind = opts.kind === 'cash' ? 'cash' : 'bank';
  const accountKey = opts.accountKey || (kind === 'cash' ? 'SSF-CASH' : 'UBIN-4814');
  const moneyCode = kind === 'cash' ? CASH_COA : BANK_COA;
  const moneyAccount = await coaByCode(
    moneyCode, kind === 'cash' ? 'Cash in Hand' : 'Bank Accounts', 'asset',
  );
  const suspenseIn = await coaByCode(SUSPENSE_IN, 'Suspense — Unreconciled Receipts', 'income');
  const suspenseOut = await coaByCode(SUSPENSE_OUT, 'Suspense — Unreconciled Payments', 'expense');
  const openingEquity = await coaByCode(OPENING_EQUITY, 'Opening Balance', 'equity');

  const parsed = parseStatement(text);
  const imported = [];
  const skipped = [];
  const errors = [];

  // The opening balance becomes a real voucher dated the first day of the year,
  // so the running balance in the Bank Book is right without special-casing.
  // But each year's statement prints its own opening, and that figure is simply
  // the previous year's closing — posting it again would double-count it. So an
  // opening voucher is written only when the account has no earlier posting.
  if (opts.openingBalance != null && opts.openingFy) {
    const fy = await ensureFinancialYear(opts.openingFy);
    const openingId = `bankst-open:${accountKey}:${opts.openingFy}`;
    const earlier = await models.ImsLedgerEntry.findOne({
      where: { accountId: moneyAccount.id, entryDate: { [Op.lt]: fy.startDate }, status: { [Op.ne]: 'archived' } },
    });
    const seen = await models.ImsLedgerEntry.findOne({ where: { sourceRecordId: openingId } });
    const amount = Number(opts.openingBalance);
    if (!seen && !earlier && amount) {
      await accounting.postVoucher({
        txnDate: fy.startDate,
        transactionType: 'contra',
        voucherType: 'contra',
        amount: Math.abs(amount),
        financialYearId: fy.id,
        bankAccountId: kind === 'bank' ? opts.accountId || null : null,
        cashAccountId: kind === 'cash' ? opts.accountId || null : null,
        narration: `Opening balance ${opts.openingFy}`,
        sourceModule: 'bank_statement_import',
        sourceRecordId: openingId,
        lines: amount >= 0
          ? [
            { accountId: moneyAccount.id, debit: Math.abs(amount), credit: 0, narration: `Opening balance ${opts.openingFy}` },
            { accountId: openingEquity.id, debit: 0, credit: Math.abs(amount), narration: `Opening balance ${opts.openingFy}` },
          ]
          : [
            { accountId: openingEquity.id, debit: Math.abs(amount), credit: 0, narration: `Opening balance ${opts.openingFy}` },
            { accountId: moneyAccount.id, debit: 0, credit: Math.abs(amount), narration: `Opening balance ${opts.openingFy}` },
          ],
      }, req);
      imported.push({ date: fy.startDate, particulars: `Opening balance ${opts.openingFy}`, deposit: amount >= 0 ? Math.abs(amount) : null, withdrawal: amount < 0 ? Math.abs(amount) : null, kind: 'opening' });
    }
  }

  const ids = sourceIds(accountKey, parsed.entries);
  for (let i = 0; i < parsed.entries.length; i += 1) {
    const e = parsed.entries[i];
    const id = ids[i];
    const seen = await models.ImsLedgerEntry.findOne({ where: { sourceRecordId: id } });
    if (seen) { skipped.push(id); continue; }
    const isDeposit = e.deposit != null && (e.withdrawal == null || e.deposit !== 0);
    const amount = isDeposit ? e.deposit : e.withdrawal;
    if (!amount) { errors.push({ entry: e, reason: 'Zero amount' }); continue; }
    const fy = await ensureFinancialYear(fyOf(e.date));
    const narration = [e.particulars, e.ref ? `Ref: ${e.ref}` : null].filter(Boolean).join(' · ');
    try {
      await accounting.postVoucher({
        txnDate: e.date,
        transactionType: isDeposit ? 'receipt' : 'payment',
        voucherType: isDeposit ? 'receipt' : 'payment',
        amount,
        financialYearId: fy.id,
        bankAccountId: kind === 'bank' ? opts.accountId || null : null,
        cashAccountId: kind === 'cash' ? opts.accountId || null : null,
        narration,
        sourceModule: 'bank_statement_import',
        sourceRecordId: id,
        lines: isDeposit
          ? [
            { accountId: moneyAccount.id, debit: amount, credit: 0, narration },
            { accountId: suspenseIn.id, debit: 0, credit: amount, narration },
          ]
          : [
            { accountId: moneyAccount.id, debit: 0, credit: amount, narration },
            { accountId: suspenseOut.id, debit: amount, credit: 0, narration },
          ],
      }, req);
      imported.push({ ...e, kind: 'entry' });
    } catch (err) {
      errors.push({ entry: e, reason: err.message });
    }
  }

  return {
    kind,
    imported: imported.length,
    skipped: skipped.length,
    errors,
    warnings: parsed.warnings,
    years: [...new Set(parsed.entries.map((e) => fyOf(e.date)))].sort(),
  };
}

module.exports = {
  parseStatement, parseDate, parseAmount, fyOf, preview, commit, sourceId, sourceIds,
  SUSPENSE_IN, SUSPENSE_OUT, OPENING_EQUITY, BANK_COA, CASH_COA, sequelize,
};
