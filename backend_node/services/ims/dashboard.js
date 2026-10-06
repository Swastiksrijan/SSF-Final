// Organisation-wide + module dashboard aggregation for SSF-IMS.
const { models } = require('../../models/ims');
const { Op, fn, col, literal } = require('sequelize');

const active = { status: { [Op.ne]: 'archived' } };
const money = (n) => Number(n || 0);

async function count(model, extra = {}) {
  return model.count({ where: { ...active, ...extra } });
}

async function sum(model, field, extra = {}) {
  const v = await model.sum(field, { where: { ...active, ...extra } });
  return Number(v || 0);
}

/** Money control-account codes (must match accounting.js ensureMoneyCoa). */
const CASH_CODE = '1000';
const BANK_CODE = '1100';

/** Ledger balance of one account code (debit - credit; asset => positive). */
async function ledgerBalance(code) {
  const acct = await models.ImsAccount.findOne({ where: { ...active, code } });
  if (!acct) return null;
  const [debit, credit] = await Promise.all([
    models.ImsLedgerEntry.sum('debit', { where: { ...active, accountId: acct.id } }),
    models.ImsLedgerEntry.sum('credit', { where: { ...active, accountId: acct.id } }),
  ]);
  return Number(debit || 0) - Number(credit || 0);
}

/**
 * Cash / Bank balance from the real books.
 * 1. Prefer the double-entry money control account (1000 / 1100) when it has postings.
 * 2. Otherwise fall back to how transactions are actually routed (cashAccountId vs
 *    bankAccountId), which is how legacy-imported money was tagged.
 * 3. Last resort: show net movement so the figure is never blank.
 */
async function moneySplit(income, expense) {
  const cash = await ledgerBalance(CASH_CODE);
  const bank = await ledgerBalance(BANK_CODE);
  if (cash !== null || bank !== null) return { cash: cash || 0, bank: bank || 0, basis: 'ledger' };

  const cashAcctIds = (await models.ImsCashAccount.findAll({ where: active, attributes: ['id'] })).map(a => a.id);
  const where = { ...active, direction: { [Op.in]: ['in', 'out'] } };
  const rows = await models.ImsTransaction.findAll({
    where, attributes: ['amount', 'direction', 'cashAccountId', 'bankAccountId', 'sourceModule'],
  });
  let cashBal = 0, bankBal = 0;
  for (const r of rows) {
    const amt = money(r.amount) * (r.direction === 'in' ? 1 : -1);
    if (r.cashAccountId && cashAcctIds.includes(r.cashAccountId)) cashBal += amt;
    else if (r.bankAccountId) bankBal += amt;
    else if (['bank'].includes(r.sourceModule)) bankBal += amt;
    else cashBal += amt;
  }
  return { cash: cashBal, bank: bankBal, basis: 'routing' };
}

/** One organisation-wide dashboard payload (control centre). */
async function mainDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [persons, members, donors, volunteers, employees, beneficiaries,
         projects, activities, meetings, openCases, pendingActions,
         funds, complianceDue, complianceOverdue, auditsOpen, committeeMembers] = await Promise.all([
    count(models.ImsPerson),
    count(models.ImsMembership),
    count(models.ImsDonor),
    count(models.ImsVolunteer),
    count(models.ImsEmployee),
    count(models.ImsBeneficiary),
    count(models.ImsProject, { projectStatus: 'active' }),
    count(models.ImsActivity),
    count(models.ImsMeeting),
    count(models.ImsCase, { stage: { [Op.ne]: 'closed' } }),
    count(models.ImsAction, { actionStatus: { [Op.notIn]: ['completed', 'cancelled'] } }),
    models.ImsFund.findAll({ where: active }),
    count(models.ImsCompliance, { complianceStatus: 'pending' }),
    count(models.ImsCompliance, { dueDate: { [Op.lt]: today }, complianceStatus: { [Op.ne]: 'filed' } }),
    count(models.ImsAudit, { closureDate: null }),
    count(models.ImsCommitteeMember),
  ]);

  const [income, expense, grantsTotal, membershipTotal] = await Promise.all([
    sum(models.ImsTransaction, 'amount', { direction: 'in' }),
    sum(models.ImsTransaction, 'amount', { direction: 'out' }),
    sum(models.ImsGrant, 'amount'),
    sum(models.ImsMembership, 'feeAmount'),
  ]);

  // Donations must reflect the ACTUAL donation income of the current period,
  // not an all-time / legacy-duplicated total. Prefer the current financial year;
  // if none is marked current, use the latest donation date on record.
  const fy = await models.ImsFinancialYear.findOne({ where: { ...active, isCurrent: true } });
  let donationWhere = { ...active };
  if (fy && fy.startDate && fy.endDate) {
    donationWhere.donationDate = { [Op.gte]: fy.startDate, [Op.lte]: fy.endDate };
  } else {
    const latest = await models.ImsDonation.findOne({ where: active, order: [['donationDate', 'DESC']] });
    if (latest && latest.donationDate) {
      const d = String(latest.donationDate);
      donationWhere.donationDate = { [Op.gte]: d.slice(0, 4) + '-04-01', [Op.lte]: d.slice(0, 4) + '-03-31' };
    }
  }
  const donationsTotal = await sum(models.ImsDonation, 'amount', donationWhere);

  const { cash: cashBalance, bank: bankBalance } = await moneySplit(income, expense);

  const nextMeeting = await models.ImsMeeting.findOne({
    where: { ...active, meetingDate: { [Op.gte]: today } },
    order: [['meetingDate', 'ASC']],
  });

  const recent = await models.ImsAuditTrail.findAll({ order: [['id', 'DESC']], limit: 15 });

  // Extra counts the control-centre sections ask for.
  const [pendingResolutions, pendingDocuments, expiringDocuments, pendingAudit] = await Promise.all([
    count(models.ImsResolution, { status: { [Op.ne]: 'approved' } }),
    count(models.ImsDocument, { status: { [Op.in]: ['draft', 'pending', 'review'] } }),
    count(models.ImsDocument, { expiryDate: { [Op.ne]: null, [Op.lt]: new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10) } }),
    count(models.ImsAudit, { closureDate: null }),
  ]);

  return {
    organisation: { persons, members, donors, volunteers, employees, beneficiaries, currentCommittee: committeeMembers },
    governance: {
      meetings, openCases, pendingActions,
      upcomingMeetings: await count(models.ImsMeeting, { meetingDate: { [Op.gte]: today } }),
      nextMeeting: nextMeeting ? nextMeeting.toJSON() : null,
      pendingMinutes: await count(models.ImsMeeting, { minutesStatus: { [Op.ne]: 'approved' } }),
      pendingResolutions,
      pendingDocuments,
    },
    programmes: { activeProjects: projects, activities, beneficiaries },
    finance: {
      income, expense, net: income - expense,
      cashBalance, bankBalance,
      donationsTotal, membershipTotal, grantsTotal, funds: funds.length,
    },
    compliance: { complianceDue, complianceOverdue, auditsOpen, pendingAudit, expiringDocuments },
    alerts: {
      critical: complianceOverdue,
      high: openCases,
      medium: pendingActions,
    },
    recent: recent.map(r => r.toJSON()),
  };
}

/** Module-scoped KPI dashboard. */
async function moduleDashboard(moduleKey) {
  const today = new Date().toISOString().slice(0, 10);
  switch (moduleKey) {
    case 'meetings': {
      const [upcoming, thisMonth, completed, noticesPending, attendancePending, minutesPending, actionsPending] = await Promise.all([
        count(models.ImsMeeting, { meetingDate: { [Op.gte]: today } }),
        count(models.ImsMeeting, { meetingDate: { [Op.gte]: today.slice(0, 7) + '-01' } }),
        count(models.ImsMeeting, { minutesStatus: 'approved' }),
        count(models.ImsNotice, { deliveryStatus: { [Op.notIn]: ['sent', 'delivered'] } }),
        count(models.ImsMeetingAttendee, { attendance: null }),
        count(models.ImsMeeting, { minutesStatus: { [Op.ne]: 'approved' } }),
        count(models.ImsAction, { actionStatus: { [Op.notIn]: ['completed', 'cancelled'] } }),
      ]);
      return { kpis: { upcoming, thisMonth, completed, noticesPending, attendancePending, minutesPending, actionsPending } };
    }
    case 'finance': {
      const [income, expense] = await Promise.all([
        sum(models.ImsTransaction, 'amount', { direction: 'in' }),
        sum(models.ImsTransaction, 'amount', { direction: 'out' }),
      ]);
      const unreviewed = await count(models.ImsTransaction, { needsReview: true });
      return { kpis: { income, expense, net: income - expense, unreviewed, funds: await count(models.ImsFund), projects: await count(models.ImsProject) } };
    }
    case 'cases': {
      const [open, overdue, awaiting, closed] = await Promise.all([
        count(models.ImsCase, { stage: { [Op.ne]: 'closed' } }),
        count(models.ImsCase, { deadline: { [Op.lt]: today }, stage: { [Op.ne]: 'closed' } }),
        count(models.ImsCase, { stage: { [Op.in]: ['notified', 'response'] } }),
        count(models.ImsCase, { stage: 'closed' }),
      ]);
      return { kpis: { open, overdue, awaiting, closed } };
    }
    case 'people': {
      const [persons, members, donors, volunteers, employees, beneficiaries] = await Promise.all([
        count(models.ImsPerson), count(models.ImsMembership), count(models.ImsDonor),
        count(models.ImsVolunteer), count(models.ImsEmployee), count(models.ImsBeneficiary),
      ]);
      return { kpis: { persons, members, donors, volunteers, employees, beneficiaries } };
    }
    case 'compliance': {
      const [pending, overdue, filed, auditsOpen, highRisks, agreements] = await Promise.all([
        count(models.ImsCompliance, { complianceStatus: 'pending' }),
        count(models.ImsCompliance, { dueDate: { [Op.lt]: today }, complianceStatus: { [Op.ne]: 'filed' } }),
        count(models.ImsCompliance, { complianceStatus: 'filed' }),
        count(models.ImsAudit, { closureDate: null }),
        count(models.ImsRisk, { rating: { [Op.in]: ['high', 'critical'] } }),
        count(models.ImsAgreement),
      ]);
      return { kpis: { pending, overdue, filed, auditsOpen, highRisks, agreements } };
    }
    case 'impact': {
      const [programmes, projects, activities, beneficiaries, freeActivities, outcomes] = await Promise.all([
        count(models.ImsProgramme), count(models.ImsProject), count(models.ImsActivity),
        count(models.ImsBeneficiary), count(models.ImsActivity, { isFree: true }),
        models.ImsActivity.count({ where: { ...active, outcome: { [Op.ne]: null } } }),
      ]);
      return { kpis: { programmes, projects, activities, beneficiaries, freeActivities, outcomes } };
    }
    case 'procurement': {
      const [vendors, assets, inventory, insuranceDue] = await Promise.all([
        count(models.ImsParty, { partyType: 'vendor' }), count(models.ImsAsset),
        count(models.ImsInventoryItem), count(models.ImsAsset, { insuranceDue: { [Op.lt]: today } }),
      ]);
      return { kpis: { vendors, assets, inventory, insuranceDue } };
    }
    case 'governance': {
      const [persons, members, committeeMembers, committees, meetings, upcoming, pendingActions, openCases, pendingMinutes, pendingResolutions, notices] = await Promise.all([
        count(models.ImsPerson), count(models.ImsMembership), count(models.ImsCommitteeMember),
        count(models.ImsCommittee), count(models.ImsMeeting),
        count(models.ImsMeeting, { meetingDate: { [Op.gte]: today } }),
        count(models.ImsAction, { actionStatus: { [Op.notIn]: ['completed', 'cancelled'] } }),
        count(models.ImsCase, { stage: { [Op.ne]: 'closed' } }),
        count(models.ImsMeeting, { minutesStatus: { [Op.ne]: 'approved' } }),
        count(models.ImsResolution, { status: { [Op.ne]: 'approved' } }),
        count(models.ImsNotice),
      ]);
      return { kpis: { members, committeeMembers, committees, meetings, upcoming, pendingActions, openCases, pendingMinutes, pendingResolutions, notices, persons } };
    }
    case 'programmes': {
      const [programmes, projects, activeProjects, activities, freeActivities, beneficiaries, outcomes] = await Promise.all([
        count(models.ImsProgramme), count(models.ImsProject),
        count(models.ImsProject, { projectStatus: 'active' }), count(models.ImsActivity),
        count(models.ImsActivity, { isFree: true }), count(models.ImsBeneficiary),
        models.ImsActivity.count({ where: { ...active, outcome: { [Op.ne]: null } } }),
      ]);
      return { kpis: { programmes, projects, activeProjects, activities, freeActivities, beneficiaries, outcomes } };
    }
    case 'resources': {
      const [donors, grants, vendors, assets, inventory, employees, volunteers, attendance, insuranceDue, donationsTotal] = await Promise.all([
        count(models.ImsDonor), count(models.ImsGrant),
        count(models.ImsParty, { partyType: 'vendor' }), count(models.ImsAsset),
        count(models.ImsInventoryItem), count(models.ImsEmployee), count(models.ImsVolunteer),
        count(models.ImsAttendance), count(models.ImsAsset, { insuranceDue: { [Op.lt]: today } }),
        sum(models.ImsDonation, 'amount'),
      ]);
      return { kpis: { donors, donationsTotal, grants, vendors, assets, inventory, employees, volunteers, attendance, insuranceDue } };
    }
    case 'compliance': {
      const [pending, overdue, filed, auditsOpen, highRisks] = await Promise.all([
        count(models.ImsCompliance, { complianceStatus: 'pending' }),
        count(models.ImsCompliance, { dueDate: { [Op.lt]: today }, complianceStatus: { [Op.ne]: 'filed' } }),
        count(models.ImsCompliance, { complianceStatus: 'filed' }),
        count(models.ImsAudit, { closureDate: null }),
        count(models.ImsRisk, { rating: { [Op.in]: ['high', 'critical'] } }),
      ]);
      return { kpis: { pending, overdue, filed, auditsOpen, highRisks, agreements: await count(models.ImsAgreement) } };
    }
    case 'records': {
      const [documents, communications, policies, governanceRules] = await Promise.all([
        count(models.ImsDocument), count(models.ImsCommunication),
        count(models.ImsPolicy), count(models.ImsGovernanceRule),
      ]);
      return { kpis: { documents, communications, policies, governanceRules } };
    }
    case 'organisation': {
      const [organisations, governanceRules, policies, committees, history] = await Promise.all([
        count(models.ImsOrganisation), count(models.ImsGovernanceRule),
        count(models.ImsPolicy), count(models.ImsCommittee),
        models.ImsAuditTrail.count(),
      ]);
      return { kpis: { organisations, governanceRules, policies, committees, history } };
    }
    default:
      return { kpis: {} };
  }
}

module.exports = { mainDashboard, moduleDashboard };
