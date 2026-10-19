// Seeds the IMS from the Foundation's Annual Progress Reports
// (data/annualReports.js). Idempotent and additive: every record is matched by a
// deterministic `recordId`, so re-running never duplicates and nothing is ever
// deleted. An existing row is only topped up where a field is still empty, so a
// record an admin has since edited is left exactly as they left it.
//
// What it creates:
//   • one Programme per recurring area of work (Education, Health, …)
//   • one Financial Year per report period (2013-14 … 2025-26)
//   • one Project per report year, carrying the report's own summary
//   • one Document per report year — the public PDF on the SSF Drive
//   • one Activity per named initiative recorded in that year's report
// Everything is cross-linked (report ↔ project ↔ activities ↔ programmes) so a
// single register shows the whole year-wise reporting record.
const { models } = require('../../models/ims');
const { link } = require('./audit');
const {
  PROGRAMMES, ANNUAL_REPORTS, DRIVE_FOLDER_URL, DRIVE_FILE_URL,
} = require('../../data/annualReports');

const SEED = { createdBy: 'annual-reports-seed', createdByName: 'Annual Reports Seed' };

const findRecord = (model, recordId) => model.findOne({ where: { recordId } });

// A deterministic id built from the record's own natural key. This is what makes
// the seed idempotent without depending on the global id sequence. The prefixes
// deliberately avoid the id generator's own namespaces (DOC-2026-0001,
// PROJECT-2026-0001, FY-2026-27) so the report register can never shift the
// numbering of records created from the UI.
const progId = (key) => `PROGRAM-ANNUAL-${key.toUpperCase()}`;
const fyId = (year) => `FYRPT-${year.replace('–', '-')}`;
const projectId = (year) => `PROJECT-AR-${year.replace('–', '-')}`;
const docId = (year) => `DOC-AR-${year.replace('–', '-')}`;
const actId = (year, i) => `ACT-AR-${year.replace('–', '-')}-${String(i + 1).padStart(2, '0')}`;

async function seedProgrammes(out) {
  out.programmes = out.programmes || 0;
  const byKey = {};
  for (const p of PROGRAMMES) {
    const recordId = progId(p.key);
    let row = await findRecord(models.ImsProgramme, recordId);
    if (!row) {
      row = await models.ImsProgramme.create({
        recordId, name: p.name, theme: p.theme, objective: p.objective,
        status: 'active', ...SEED, data: { nameHi: p.nameHi, key: p.key },
      });
      out.programmes++;
    } else {
      const patch = fillEmpty(row, { name: p.name, theme: p.theme, objective: p.objective },
        { nameHi: p.nameHi, key: p.key });
      if (Object.keys(patch).length) await row.update(patch);
    }
    byKey[p.key] = row;
  }
  return byKey;
}

async function seedFinancialYears(out) {
  out.financialYears = out.financialYears || 0;
  for (const y of ANNUAL_REPORTS) {
    const recordId = fyId(y.year);
    let row = await findRecord(models.ImsFinancialYear, recordId);
    if (!row) {
      row = await models.ImsFinancialYear.create({
        recordId, label: y.year, startDate: y.fyStart, endDate: y.fyEnd,
        isCurrent: false, isClosed: true, status: 'active', ...SEED,
      });
      out.financialYears++;
    } else {
      const patch = fillEmpty(row, { label: y.year, startDate: y.fyStart, endDate: y.fyEnd });
      if (Object.keys(patch).length) await row.update(patch);
    }
  }
}

async function seedReports(out, programmes) {
  out.projects = out.projects || 0;
  out.documents = out.documents || 0;
  out.activities = out.activities || 0;

  for (const y of ANNUAL_REPORTS) {
    const focus = (y.focusAreas || []).join('; ');
    const docUrl = DRIVE_FILE_URL(y.driveId);
    const objective = [
      y.summary,
      '',
      `Reporting period: ${y.fyStart} to ${y.fyEnd}.`,
      `Areas of work: ${focus}.`,
      `Source document: ${y.title} (SSF Annual Progress Reports, ${DRIVE_FOLDER_URL}).`,
    ].join('\n');

    // ---- Project (the year of work) ----
    const pid = projectId(y.year);
    let project = await findRecord(models.ImsProject, pid);
    if (!project) {
      project = await models.ImsProject.create({
        recordId: pid, name: `Annual Programme ${y.year}`, objective,
        startDate: y.fyStart, endDate: y.fyEnd, projectStatus: 'completed',
        status: 'active', ...SEED,
        data: { sourceReport: y.title, driveId: y.driveId, driveUrl: docUrl, focusAreas: y.focusAreas, reportYear: y.year },
      });
      out.projects++;
    } else {
      const patch = fillEmpty(project, {
        name: `Annual Programme ${y.year}`, objective,
        startDate: y.fyStart, endDate: y.fyEnd, projectStatus: 'completed',
      }, { sourceReport: y.title, driveId: y.driveId, driveUrl: docUrl, focusAreas: y.focusAreas, reportYear: y.year });
      if (Object.keys(patch).length) await project.update(patch);
    }

    // ---- Document (the public report PDF) ----
    const did = docId(y.year);
    const docTitle = `Annual Progress Report ${y.year}`;
    let doc = await findRecord(models.ImsDocument, did);
    const docFields = {
      title: docTitle, category: 'Annual Report', docType: 'Progress Report',
      version: 1, issueDate: y.fyEnd, effectiveDate: y.fyEnd,
      owner: 'Swastik Srijan Foundation Samiti', confidentiality: 'public',
      source: 'Annual Progress Reports (SSF Google Drive)', fileUrl: docUrl,
      status: 'active',
    };
    if (!doc) {
      doc = await models.ImsDocument.create({
        recordId: did, ...docFields, ...SEED,
        data: { year: y.year, driveId: y.driveId, folderUrl: DRIVE_FOLDER_URL, summary: y.summary, focusAreas: y.focusAreas },
      });
      out.documents++;
    } else {
      const patch = fillEmpty(doc, docFields,
        { year: y.year, driveId: y.driveId, folderUrl: DRIVE_FOLDER_URL, summary: y.summary, focusAreas: y.focusAreas });
      if (Object.keys(patch).length) await doc.update(patch);
    }

    // ---- Activities (the named initiatives of the year) ----
    for (let i = 0; i < y.activities.length; i++) {
      const a = y.activities[i];
      const prog = programmes[a.programme];
      const aid = actId(y.year, i);
      let act = await findRecord(models.ImsActivity, aid);
      const fields = {
        projectId: project.id,
        activityType: a.type || 'social',
        title: a.title,
        activityDate: y.fyEnd,
        isFree: true,
        outcome: a.outcome,
        status: 'active',
      };
      if (!act) {
        await models.ImsActivity.create({
          recordId: aid, ...fields, ...SEED,
          data: { reportYear: y.year, sourceReport: y.title, driveId: y.driveId, programme: a.programme, programmeName: prog ? prog.name : null },
        });
        out.activities++;
      } else {
        const patch = fillEmpty(act, fields,
          { reportYear: y.year, sourceReport: y.title, driveId: y.driveId, programme: a.programme, programmeName: prog ? prog.name : null });
        if (Object.keys(patch).length) await act.update(patch);
      }

      // Link the initiative to its programme and back to the report document.
      if (prog) await link('activities', aid, 'programmes', prog.recordId, 'programme');
      await link('activities', aid, 'documents', did, 'reportedIn');
    }

    await link('projects', pid, 'documents', did, 'reportedIn');
  }

  out.years = ANNUAL_REPORTS.length;
}

// Sequelize returns DATEONLY as 'YYYY-MM-DD' (or a Date under pg-mem); normalise
// before comparing so an unchanged row is never rewritten.
function rowValue(row, key) {
  const v = row[key];
  if (v === null || v === undefined) return v;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v;
}

const isEmpty = (v) => v === null || v === undefined || v === '';

/**
 * Fill only the fields that are still empty on an existing row, and merge the
 * seed's `data` keys only where the row has none. Nothing an admin has edited is
 * ever overwritten — the same non-destructive rule the other IMS seeds follow.
 */
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

async function seedAnnualReports() {
  const out = { programmes: 0, financialYears: 0, projects: 0, documents: 0, activities: 0, years: 0 };
  const programmes = await seedProgrammes(out);
  await seedFinancialYears(out);
  await seedReports(out, programmes);
  return out;
}

/**
 * The year-wise reporting register, assembled from the IMS records the seed
 * created. Read-only: it never writes. Each year carries its source document,
 * the project that represents the year of work and the initiatives recorded in
 * it, so one screen shows the whole reporting record.
 */
async function annualReportRegister() {
  const docIds = ANNUAL_REPORTS.map((y) => docId(y.year));
  const projIds = ANNUAL_REPORTS.map((y) => projectId(y.year));
  const docs = await models.ImsDocument.findAll({ where: { recordId: docIds } });
  const projects = await models.ImsProject.findAll({ where: { recordId: projIds } });
  const activities = await models.ImsActivity.findAll({ where: { recordId: ANNUAL_REPORTS.flatMap((y) => y.activities.map((_, i) => actId(y.year, i))) } });

  const docBy = Object.fromEntries(docs.map((d) => [d.recordId, d]));
  const projBy = Object.fromEntries(projects.map((p) => [p.recordId, p]));
  const actsByYear = {};
  for (const a of activities) {
    const y = (a.data || {}).reportYear;
    if (!y) continue;
    (actsByYear[y] = actsByYear[y] || []).push(a);
  }

  const progNames = Object.fromEntries(PROGRAMMES.map((p) => [p.key, p.name]));

  const years = ANNUAL_REPORTS.map((y) => {
    const doc = docBy[docId(y.year)];
    const proj = projBy[projectId(y.year)];
    const acts = (actsByYear[y.year] || []);
    const programmesCovered = [...new Set(acts.map((a) => progNames[(a.data || {}).programme]).filter(Boolean))];
    return {
      year: y.year,
      title: y.title,
      fyStart: y.fyStart,
      fyEnd: y.fyEnd,
      driveId: y.driveId,
      driveUrl: DRIVE_FILE_URL(y.driveId),
      summary: y.summary,
      focusAreas: y.focusAreas || [],
      document: doc ? { recordId: doc.recordId, title: doc.title, fileUrl: doc.fileUrl, issueDate: doc.issueDate } : null,
      project: proj ? { recordId: proj.recordId, name: proj.name } : null,
      programmesCovered,
      activityCount: acts.length,
      activities: acts.map((a) => ({
        recordId: a.recordId, title: a.title, activityType: a.activityType, outcome: a.outcome,
      })),
    };
  });

  return {
    folderUrl: DRIVE_FOLDER_URL,
    totals: {
      years: years.length,
      documents: docs.length,
      projects: projects.length,
      activities: activities.length,
      programmes: PROGRAMMES.length,
    },
    years,
  };
}

module.exports = { seedAnnualReports, annualReportRegister, ANNUAL_REPORT_IDS: { progId, fyId, projectId, docId, actId } };
