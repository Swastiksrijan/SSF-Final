// Audited financial statements — the year-wise audit-report register.
//
// Read-only. The figures are the CA-signed audited statements, transcribed into
// data/auditReports.json, which is the single source of truth. Nothing here
// writes: the IMS screen shows what the auditor signed, so the register can
// never disagree with the signed report.
const data = require('../../data/auditReports.json');

const num = (v) => {
  const n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.\-]/g, ''));
  return isFinite(n) ? n : 0;
};

const sumHeads = (heads) => (heads || []).reduce((a, h) => a + num(h.amount), 0);

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * The audit-report register: one entry per audited year, newest first, with the
 * year-on-year movement against the previous audited year. `pendingYears` lists
 * the years that still have no signed report.
 */
function auditReportRegister() {
  const reports = (data.reports || []).slice().sort((a, b) => String(a.financialYear).localeCompare(String(b.financialYear)));

  const years = reports.map((r, i) => {
    const prev = reports[i - 1];
    const opening = r.openingBalances || {};
    const closing = r.closingBalances || {};
    const incomeTotal = num(r.incomeTotal) || sumHeads(r.income);
    const expenditureTotal = num(r.expenditureTotal) || sumHeads(r.expenditure);
    return {
      financialYear: r.financialYear,
      assessmentYear: r.assessmentYear || null,
      status: r.status,
      opinion: r.opinion,
      result: r.result,
      auditor: r.auditor || null,
      income: r.income || [],
      incomeTotal,
      expenditure: r.expenditure || [],
      expenditureTotal,
      capitalExpenditure: r.capitalExpenditure || [],
      openingBalances: opening,
      closingBalances: closing,
      generalFund: r.generalFund || null,
      fixedAssets: r.fixedAssets || [],
      sourceFile: r.sourceFile || null,
      notes: r.notes || null,
      receiptsTotal: num(opening.total) + incomeTotal,
      yoy: prev ? {
        income: round2(incomeTotal - num(prev.incomeTotal)),
        expenditure: round2(expenditureTotal - num(prev.expenditureTotal)),
      } : null,
    };
  });

  const latest = years[years.length - 1] || null;
  return {
    organization: data.organization,
    address: data.address,
    inceptionFinancialYear: data.inceptionFinancialYear,
    currency: data.currency,
    note: data.note,
    totals: {
      auditedYears: years.length,
      pendingYears: (data.pendingYears || []).length,
      income: years.reduce((a, y) => a + y.incomeTotal, 0),
      expenditure: years.reduce((a, y) => a + y.expenditureTotal, 0),
    },
    latestYear: latest ? latest.financialYear : null,
    latestClosing: latest ? num(latest.closingBalances.total) : 0,
    years,
    pendingYears: data.pendingYears || [],
  };
}

module.exports = { auditReportRegister };
