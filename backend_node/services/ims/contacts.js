// SSF-IMS contact & email directory.
//
// The Action Centre emails the responsible person when their address is known,
// and falls back to the admin mailbox otherwise. This service makes it easy to
// fill those addresses in bulk — it lists every person with their email status
// and how they are engaged (member / volunteer / committee / employee), so an
// admin can spot the gaps at a glance and paste a corrected list back.
//
// It also owns `syncPeopleFromRegisters()`: the members and managing-committee
// registers already hold each person's real name/email/mobile, so this reads
// them and makes sure every one of those people exists as an ImsPerson linked
// back to their register row. Existing rows are only filled where blank and
// never overwritten, so a later manual edit is preserved.
const { models } = require('../../models/ims');
const { nextId } = require('./ids');
const { Op } = require('sequelize');

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

// ---- register -> person sync ----------------------------------------------

const low = (v) => clean(v).toLowerCase();
// A name that is really a placeholder ("Member 1", "Unknown") — safe to replace.
const isPlaceholderName = (v) => !clean(v) || /^(member|unknown|person|test)\b/i.test(clean(v)) || /^member\s*\d+$/i.test(clean(v));

// Latest row wins: the current register is the highest id; earlier ids are the
// preserved role history for the same person.
function latestRows(rows) {
  const keyOf = (r) => {
    const email = low(r.email);
    if (email) return 'e:' + email;
    const mobile = clean(r.mobile).replace(/\D/g, '').slice(-10);
    if (mobile) return 'm:' + mobile;
    return 'n:' + low(r.name);
  };
  const out = new Map();
  for (const r of rows) {
    const k = keyOf(r);
    if (!k || k === 'n:') continue;
    const prev = out.get(k);
    if (!prev || r.id > prev.id) out.set(k, r);
  }
  return [...out.values()];
}

function personFrom(src) {
  const data = (src && src.data) || {};
  const name = clean(data.fullName || data.name || src.fullName || src.name);
  if (!name) return null;
  return {
    id: src.id,
    name,
    email: clean(data.email || src.email),
    mobile: clean(data.mobile || src.mobile),
    city: clean(data.city), state: clean(data.state),
    address: clean(data.address), pinCode: clean(data.pinCode),
    gender: clean(data.gender), occupation: clean(data.occupation),
    photoUrl: clean(data.photoUrl),
    source: src.__source,
  };
}

/** Fill only-blank fields on an existing person; never overwrite a real value. */
async function fillBlanks(person, p) {
  const patch = {};
  if (!clean(person.email) && looksLikeEmail(p.email)) patch.email = p.email;
  if (!clean(person.mobile) && p.mobile) patch.mobile = p.mobile;
  if (isPlaceholderName(person.fullName) && !isPlaceholderName(p.name)) patch.fullName = p.name;
  for (const f of ['city', 'state', 'address', 'pinCode', 'occupation', 'photoUrl']) {
    if (!clean(person[f]) && p[f]) patch[f] = p[f];
  }
  if (Object.keys(patch).length) await person.update(patch);
  return Object.keys(patch).length;
}

// Identity match: email, then 10-digit mobile, then full name — exact only, so
// two different people are never merged.
async function findPerson(p, index) {
  if (looksLikeEmail(p.email) && index.byEmail.has(low(p.email))) return index.byEmail.get(low(p.email));
  const m = clean(p.mobile).replace(/\D/g, '').slice(-10);
  if (m && index.byMobile.has(m)) return index.byMobile.get(m);
  if (index.byName.has(low(p.name))) return index.byName.get(low(p.name));
  return null;
}

async function buildIndex() {
  const people = await models.ImsPerson.findAll();
  const byEmail = new Map(), byMobile = new Map(), byName = new Map();
  for (const person of people) {
    const e = low(person.email); if (e) byEmail.set(e, person);
    const m = clean(person.mobile).replace(/\D/g, '').slice(-10); if (m) byMobile.set(m, person);
    const n = low(person.fullName); if (n) byName.set(n, person);
  }
  return { people, byEmail, byMobile, byName, add(person) {
    const e = low(person.email); if (e) byEmail.set(e, person);
    const m = clean(person.mobile).replace(/\D/g, '').slice(-10); if (m) byMobile.set(m, person);
    const n = low(person.fullName); if (n) byName.set(n, person);
  } };
}

async function grantRole(personId, roleCode, refType, refId) {
  try {
    await models.ImsPersonRole.findOrCreate({
      where: { personId, roleCode, refId },
      defaults: { personId, roleCode, refType, refId, recordId: `PR-${refType}-${refId}-${roleCode}`, status: 'active' },
    });
  } catch { /* a role is a convenience — never let it abort the sync */ }
}

/**
 * Read the members + managing-committee registers and make sure every distinct
 * person there exists as an ImsPerson, is linked to their register row, and has
 * a role. ADDITIVE + IDEMPOTENT: re-running changes nothing; existing people are
 * only topped up where their contact fields are blank.
 *
 * @returns a per-stage summary of what was created / linked / filled.
 */
async function syncPeopleFromRegisters() {
  const out = {
    personsCreated: 0, personsLinked: 0, personsFilled: 0,
    membersLinked: 0, committeeLinked: 0,
    members: 0, committee: 0, skipped: 0,
  };
  const index = await buildIndex();

  const ensure = async (p, roleCode, refType, refId) => {
    let person = await findPerson(p, index);
    if (person) {
      out.personsFilled += await fillBlanks(person, p);
      out.personsLinked += 1;
    } else {
      const recordId = await nextId('PERSON', null, models.ImsPerson);
      person = await models.ImsPerson.create({
        recordId, fullName: p.name,
        email: looksLikeEmail(p.email) ? p.email : undefined,
        mobile: p.mobile || undefined,
        city: p.city || undefined, state: p.state || undefined,
        address: p.address || undefined, pinCode: p.pinCode || undefined,
        gender: p.gender || undefined, occupation: p.occupation || undefined,
        photoUrl: p.photoUrl || undefined,
        data: { syncedFrom: p.source || null },
        createdBy: 'register-sync', createdByName: 'Register Sync',
      });
      index.add(person);
      out.personsCreated += 1;
    }
    if (roleCode) await grantRole(person.id, roleCode, refType, refId);
    return person;
  };

  const rowsOf = async (model) => {
    try { return await model.findAll({ where: { status: { [Op.ne]: 'archived' } } }); }
    catch { return await model.findAll(); }
  };
  const json = (r) => { const v = r && r.data; return (v && typeof v === 'object') ? v : {}; };

  // 1. Members
  const memberRows = latestRows((await rowsOf(models.ImsMembership)).map((r) => ({
    id: r.id, recordId: r.recordId, data: json(r),
    email: json(r).email, mobile: json(r).mobile, name: json(r).fullName || json(r).name,
  })));
  out.members = memberRows.length;
  for (const row of memberRows) {
    const p = personFrom({ id: row.id, data: row.data, __source: 'members' });
    if (!p) { out.skipped++; continue; }
    const person = await ensure(p, 'member', 'members', row.id);
    const rec = await models.ImsMembership.findByPk(row.id);
    if (rec && !rec.personId) { await rec.update({ personId: person.id }); out.membersLinked++; }
  }

  // 2. Managing committee
  const committeeRows = await rowsOf(models.ImsCommitteeMember);
  const enriched = committeeRows.map((r) => ({
    id: r.id, recordId: r.recordId, data: json(r),
    email: json(r).email, mobile: json(r).mobile, name: json(r).fullName || json(r).name, position: json(r).position,
  }));
  const currentRows = enriched.filter((r) => r.name);
  const currentIds = new Set(latestRows(currentRows).map((r) => r.id));
  out.committee = currentIds.size;
  for (const row of enriched) {
    const p = personFrom({ id: row.id, data: row.data, __source: 'committeeMembers' });
    if (!p) { out.skipped++; continue; }
    const isCurrent = currentIds.has(row.id) && clean(row.data.status || '').toLowerCase() !== 'former'
      && clean(row.data.status || '').toLowerCase() !== 'inactive';
    // Only a current member gets a role; a history row is just history.
    const person = await ensure(p, isCurrent ? 'committee' : null, 'committeeMembers', row.id);
    const rec = await models.ImsCommitteeMember.findByPk(row.id);
    if (rec) {
      const patch = {};
      if (!rec.personId) patch.personId = person.id;
      if (isCurrent && !clean(rec.position) && row.position) patch.position = row.position;
      if (Object.keys(patch).length) await rec.update(patch);
      if (!rec.personId) out.committeeLinked++;
    }
  }
  return out;
}

module.exports = { listContactEmails, importContactEmails, looksLikeEmail, syncPeopleFromRegisters };
