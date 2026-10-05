// Organisation-wide + module dashboard aggregation for SSF-IMS.
const { models } = require('../../models/ims');
const { Op, fn, col, literal } = require('sequelize');

const active = { status: { [Op.ne]: 'archived' } };

async function count(model, extra = {}) {
  return model.count({ where: { ...active, ...extra } });
}

async function sum(model, field, extra = {}) {
  const v = await model.sum(field, { where: { ...active, ...extra } });
  return Number(v || 0);
}

/** One organisation-wide dashboard payload. */
async function mainDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [persons, members, donors, volunteers, employees, beneficiaries,
         projects, activities, meetings, openCases, pendingActions,
         funds, complianceDue, complianceOverdue, auditsOpen] = await Promise.all([
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
  ]);

  const [income, expense, donationsTotal] = await Promise.all([
    sum(models.ImsTransaction, 'amount', { direction: 'in' }),
    sum(models.ImsTransaction, 'amount', { direction: 'out' }),
    sum(models.ImsDonation, 'amount'),
  ]);

  const nextMeeting = await models.ImsMeeting.findOne({
    where: { ...active, meetingDate: { [Op.gte]: today } },
    order: [['meetingDate', 'ASC']],
  });

  const recent = await models.ImsAuditTrail.findAll({ order: [['id', 'DESC']], limit: 15 });

  return {
    organisation: { persons, members, donors, volunteers, employees, beneficiaries, currentCommittee: await count(models.ImsCommitteeMember) },
    governance: {
      meetings, openCases, pendingActions,
      nextMeeting: nextMeeting ? nextMeeting.toJSON() : null,
      pendingMinutes: await count(models.ImsMeeting, { minutesStatus: { [Op.ne]: 'approved' } }),
      pendingResolutions: await count(models.ImsResolution, { status: { [Op.ne]: 'approved' } }),
    },
    programmes: { activeProjects: projects, activities, beneficiaries },
    finance: { income, expense, net: income - expense, donationsTotal, funds: funds.length },
    compliance: { complianceDue, complianceOverdue, auditsOpen },
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
