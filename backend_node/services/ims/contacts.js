// SSF-IMS contact & email directory.
//
// The Action Centre emails the responsible person when their address is known,
// and falls back to the admin mailbox otherwise. This service makes it easy to
// fill those addresses in bulk — it lists every person with their email status
// and how they are engaged (member / volunteer / committee / employee), so an
// admin can spot the gaps at a glance and paste a corrected list back.
//
// It only ever writes the `email` column of ImsPerson. Nothing else is touched.
const { models } = require('../../models/ims');

const clean = (v) => String(v == null ? '' : v).trim();

// A conservative email shape check — enough to catch "ramesh@" or a missing @.
function looksLikeEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean(v));
}

async function rolesByPerson() {
  const map = new Map();
  const add = (personId, tag) => {
    if (!personId) return;
    if (!map.has(personId)) map.set(personId, new Set());
    map.get(personId).add(tag);
  };
  const safe = async (model, tag, field = 'personId') => {
    try {
      const rows = await models[model].findAll({ attributes: [field] });
      for (const r of rows) add(r[field], tag);
    } catch { /* a missing table must never break the directory */ }
  };
  await safe('ImsMembership', 'member');
  await safe('ImsCommitteeMember', 'committee');
  await safe('ImsEmployee', 'employee');
  await safe('ImsVolunteer', 'volunteer');
  return map;
}

/**
 * Every person with email status. `onlyMissing` limits the list to people who
 * have no usable email — the working queue for filling addresses in.
 */
async function listContactEmails({ onlyMissing = false, search = '' } = {}) {
  const [people, roles] = await Promise.all([
    models.ImsPerson.findAll({ order: [['fullName', 'ASC']], limit: 5000 }),
    rolesByPerson(),
  ]);
  const q = clean(search).toLowerCase();
  const records = [];
  for (const p of people) {
    const email = clean(p.email);
    const valid = looksLikeEmail(email);
    if (onlyMissing && valid) continue;
    const name = p.fullName || p.recordId;
    if (q && !(`${name} ${p.recordId} ${email} ${p.mobile || ''}`.toLowerCase().includes(q))) continue;
    records.push({
      id: p.id,
      recordId: p.recordId,
      fullName: name,
      mobile: p.mobile || '',
      email: email || '',
      emailValid: valid,
      engaged: [...(roles.get(p.id) || [])],
    });
  }
  const total = people.length;
  const withEmail = people.filter((p) => looksLikeEmail(p.email)).length;
  return { records, total, withEmail, missing: total - withEmail, notifiable: withEmail };
}

/**
 * Bulk-update emails. Each row is { recordId | id, email }. Rows that name an
 * unknown person, or carry an empty/invalid email, are reported back instead of
 * silently ignored, so the admin knows exactly what still needs attention.
 */
async function importContactEmails(rows = []) {
  const updated = [];
  const invalid = [];
  const notFound = [];
  for (const row of Array.isArray(rows) ? rows : []) {
    const email = clean(row && row.email);
    if (!looksLikeEmail(email)) { invalid.push({ ...row, reason: 'invalid email' }); continue; }
    const where = row.recordId ? { recordId: clean(row.recordId) } : (row.id ? { id: row.id } : null);
    if (!where) { notFound.push({ ...row, reason: 'no id or recordId' }); continue; }
    try {
      const person = await models.ImsPerson.findOne({ where });
      if (!person) { notFound.push({ ...row, reason: 'person not found' }); continue; }
      await person.update({ email });
      updated.push({ recordId: person.recordId, fullName: person.fullName, email });
    } catch (e) {
      notFound.push({ ...row, reason: e.message });
    }
  }
  return { updated: updated.length, updatedRows: updated, invalid, notFound };
}

module.exports = { listContactEmails, importContactEmails, looksLikeEmail };
