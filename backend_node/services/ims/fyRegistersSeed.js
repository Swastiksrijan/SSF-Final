// Seeds the three registers that came out of the FY 2025-26 financial workbook
// (data/financialYearRegisters.js) and had no home in the IMS until now:
//
//   • Sector Registers   -> Programmes  > Activities (the sector-wise roll-up)
//   • Annual Compliance  -> Compliance  > Compliance register
//   • Sahyog support     -> Finance     > Sahyog register (in-kind rent support)
//
// Idempotent and additive, like every other IMS seed: a record is matched by a
// deterministic `recordId`, so re-running never duplicates and nothing is ever
// deleted. An existing row is only topped up where a field is still empty, so a
// record an admin has edited is left exactly as they left it.
const { models } = require('../../models/ims');
const { link } = require('./audit');
const {
  SECTOR_REGISTERS, ANNUAL_COMPLIANCE, SAHYOG_SUPPORT,
} = require('../../data/financialYearRegisters');

const SEED = { createdBy: 'fy-registers-seed', createdByName: 'FY 2025-26 Registers Seed' };
// The annual-reports seed labels the year with an en dash ('2025–26'); the
// workbook writes it with a hyphen. Keep both: the en-dash is the register
// label, the hyphen is what the source sheet says.
const FY_LABEL = '2025–26';
const FY_SOURCE = '2025-26';

// The annual-reports seed owns the programme namespace; reuse its ids so the
// sector activities attach to the programme and year project that already exist.
const progId = (key) => `PROGRAM-ANNUAL-${String(key).toUpperCase()}`;
const projectId = (year) => `PROJECT-AR-${String(year).replace('–', '-')}`;
const sectorActId = (key) => `ACT-SECTOR-${String(key).toUpperCase()}`;
const complianceId = (no) => `CMP-ANNUAL-${String(no).replace(/^COMP-/, '')}`;
const sahyogId = (i) => `SSF-SYG-2025-26-${String(i + 1).padStart(3, '0')}`;

function rowValue(row, key) {
  const v = row[key];
  if (v === null || v === undefined) return v;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v;
}

const isEmpty = (v) => v === null || v === undefined || v === '';

/** Fill only the fields that are still empty; never overwrite an admin's edit. */
function fillEmpty(row, fields, dataPatch) {
  const patch = {};
  for (const [k, v] of Object.entries(fields)) {
    if (isEmpty(rowValue(row, k)) && !isEmpty(v)) patch[k] = v;
  }
  if (dataPatch) {
    const current = row.data || {};
    const merged = { ...current };
    let changed = false;
    for (const [k, v] of Object.entries(dataPatch)) {
      if (isEmpty(current[k]) && !isEmpty(v)) { merged[k] = v; changed = true; }
    }
    if (changed) patch.data = merged;
  }
  return patch;
}

const findRecord = (model, recordId) => model.findOne({ where: { recordId } });

// The Activities screen shows `outcome`, not the workbook's extra columns, so
// the sector roll-up is written there as readable text (and kept verbatim in
// `data` as well, so the source figures are never lost).
function sectorOutcome(s) {
  const parts = [s.sector];
  if (s.location) parts.push(s.location);
  if (s.expenditure) parts.push(`₹${s.expenditure}`);
  if (s.remarks) parts.push(s.remarks);
  return parts.join(' · ');
}

async function financialYear() {
  return models.ImsFinancialYear.findOne({ where: { label: FY_LABEL } });
}

// ---- 1. Sector Registers -> Programmes > Activities ------------------------
async function seedSectorRegisters(out) {
  out.sectorActivities = out.sectorActivities || 0;
  const fy = await financialYear();
  for (const s of SECTOR_REGISTERS) {
    const recordId = sectorActId(s.key);
    const programme = await findRecord(models.ImsProgramme, progId(s.programme));
    const project = await findRecord(models.ImsProject, projectId(FY_LABEL));
    const fields = {
      projectId: project ? project.id : null,
      activityType: s.activityType,
      title: s.title,
      activityDate: s.activityDate || null,
      isFree: !s.expenditure,
      outcome: sectorOutcome(s),
      status: 'active',
    };
    const data = {
      sector: s.sector,
      location: s.location || '',
      beneficiaries: s.beneficiaries || '',
      expenditure: s.expenditure || 0,
      resolutionRef: s.resolutionRef || '',
      remarks: s.remarks,
      programme: s.programme,
      programmeName: programme ? programme.name : null,
      source: 'FY 2025-26 Sector Registers',
      financialYear: FY_SOURCE,
      ...(fy ? { financialYearId: fy.recordId } : {}),
    };
    let act = await findRecord(models.ImsActivity, recordId);
    if (!act) {
      act = await models.ImsActivity.create({ recordId, ...fields, ...SEED, data });
      out.sectorActivities++;
    } else {
      const patch = fillEmpty(act, fields, data);
      if (Object.keys(patch).length) await act.update(patch);
    }
    if (programme) await link('activities', recordId, 'programmes', programme.recordId, 'programme');
    if (fy) await link('activities', recordId, 'financialYears', fy.recordId, 'reportedIn');
  }
}

// ---- 2. Annual Compliance -> Compliance register ---------------------------
// The workbook's "Responsible Person" is a committee position (President,
// Secretary, ...); resolve it to the person who currently holds that position.
async function resolveResponsible(position) {
  if (!position) return null;
  const cm = await models.ImsCommitteeMember.findOne({ where: { position } });
  return cm && cm.personId ? cm.personId : null;
}

async function seedAnnualCompliance(out) {
  out.compliance = out.compliance || 0;
  for (const c of ANNUAL_COMPLIANCE) {
    const recordId = complianceId(c.no);
    const fields = {
      obligation: c.purpose,
      legalSource: c.type,
      dueDate: c.date,
      complianceStatus: 'filed',
      submittedOn: c.date,
      evidence: c.decision,
      responsiblePersonId: await resolveResponsible(c.person),
      status: 'active',
    };
    const data = {
      complianceNo: c.no,
      complianceType: c.type,
      purpose: c.purpose,
      decision: c.decision,
      responsiblePerson: c.person,
      status: 'Completed',
      source: 'FY 2025-26 Annual Compliance',
    };
    let row = await findRecord(models.ImsCompliance, recordId);
    if (!row) {
      row = await models.ImsCompliance.create({ recordId, ...fields, ...SEED, data });
      out.compliance++;
    } else {
      const patch = fillEmpty(row, fields, data);
      if (Object.keys(patch).length) await row.update(patch);
    }
    // Each compliance entry resolves the meeting held that day.
    const meeting = await models.ImsMeeting.findOne({ where: { meetingDate: c.date } });
    if (meeting) await link('compliance', recordId, 'meetings', meeting.recordId, 'resolution');
  }
}

// ---- 3. Sahyog in-kind support -> Sahyog register --------------------------
// The Sahyog screen (src/components/SahyogRegister.jsx) reads the legacy Digital
// Office contract, module 'sahyog', so the support lands where that register
// looks for it. Recorded in-kind: income + matching expense, net effect nil.
async function seedSahyog(out) {
  out.sahyog = out.sahyog || 0;
  const DigitalOfficeRecord = require('../../models/DigitalOfficeRecord');
  for (let i = 0; i < SAHYOG_SUPPORT.length; i++) {
    const s = SAHYOG_SUPPORT[i];
    const recordId = sahyogId(i);
    const exists = await DigitalOfficeRecord.findOne({ where: { recordId } });
    if (exists) continue;
    await DigitalOfficeRecord.create({
      recordId,
      module: 'sahyog',
      recordType: 'Support',
      status: 'active',
      recordDate: s.date,
      amount: s.amount,
      paymentMode: 'In-kind',
      account: 'In-kind',
      direction: 'in',
      createdBy: SEED.createdBy,
      createdByName: SEED.createdByName,
      data: {
        sahyogKarta: 'Well-wisher',
        name: 'Property Owner (Office Landlord)',
        sahyogType: 'Rent',
        description: s.particular,
        amountValue: s.amount,
        mode: 'In-kind',
        inFavourOf: 'Office',
        fund: 'Unrestricted',
        receiptNo: '',
        adjustment: 'No',
        balance: 0,
        voucherRef: '',
        verifiedBy: 'NA',
        remarks: 'Support by Property Owner',
        source: 'FY 2025-26 Expense Register (Mode: Support)',
      },
    });
    out.sahyog++;
  }
}

async function seedFinancialYearRegisters() {
  const out = { sectorActivities: 0, compliance: 0, sahyog: 0 };
  await seedSectorRegisters(out);
  await seedAnnualCompliance(out);
  await seedSahyog(out);
  return out;
}

module.exports = { seedFinancialYearRegisters };
