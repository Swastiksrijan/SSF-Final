// Permanent, atomic, never-reused ID generation for SSF-IMS.
// PERSON-000001 (global) | MEM-2027-0001 (year-scoped) ...
const { models, sequelize } = require('../../models/ims');

const YEAR_PREFIXES = new Set([
  'MEM', 'DON', 'VOL', 'EMP', 'BEN', 'PROJECT', 'PROGRAM', 'MEET', 'RES',
  'ACTION', 'CASE', 'DOC', 'TXN', 'VCH', 'ASSET', 'AUDIT', 'GRANT', 'DONATION',
  'CMP', 'AGM', 'RPT', 'INV', 'POL', 'AGR',
]);

function pad(n, width) {
  return String(n).padStart(width, '0');
}

/**
 * Next permanent id for a prefix. Atomic via row lock, safe under concurrency.
 * @param {string} prefix e.g. 'PERSON' or 'MEM'
 * @param {number} [year] defaults to current FY start year
 * @param {object} [model] optional Sequelize model used to seed the counter from
 *   existing recordIds on first use (covers pre-existing/imported data).
 */
async function nextId(prefix, year, model) {
  const scoped = YEAR_PREFIXES.has(prefix);
  const y = scoped ? (year || currentFyStartYear()) : 0;
  return sequelize.transaction(async (t) => {
    let row = await models.ImsIdSequence.findOne({
      where: { prefix, year: y },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    // Highest numeric suffix already present in the table (covers seeded/imported rows).
    let existingMax = 0;
    if (model) {
      const like = scoped ? `${prefix}-${y}-%` : `${prefix}-%`;
      const [existing] = await sequelize.query(
        `SELECT "recordId" FROM "${model.getTableName()}" WHERE "recordId" LIKE :like`,
        { replacements: { like }, transaction: t }
      );
      for (const e of existing) {
        const m = String(e.recordId).match(/(\d+)$/);
        if (m) existingMax = Math.max(existingMax, parseInt(m[1], 10));
      }
    }
    if (!row) {
      row = await models.ImsIdSequence.create(
        { prefix, year: y, lastValue: existingMax },
        { transaction: t }
      );
      row = await models.ImsIdSequence.findOne({
        where: { prefix, year: y }, transaction: t, lock: t.LOCK.UPDATE,
      });
    } else if (existingMax > row.lastValue) {
      row.lastValue = existingMax;
    }
    row.lastValue += 1;
    await row.save({ transaction: t });
    const n = row.lastValue;
    return scoped
      ? `${prefix}-${y}-${pad(n, 4)}`
      : `${prefix}-${pad(n, 6)}`;
  });
}

function currentFyStartYear(date = new Date()) {
  const m = date.getMonth(); // 0=Jan
  return m >= 3 ? date.getFullYear() : date.getFullYear() - 1; // FY starts April
}

module.exports = { nextId, currentFyStartYear, YEAR_PREFIXES };
