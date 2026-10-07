// SSF Volunteer Network — Pan-India chapters, leadership, tasks and funds.
// Read model that turns the chapter/member/task/fund tables into the views the
// "Volunteer & Chapters" module needs:
//   * coverage  — how many states / districts / blocks are active
//   * leaders   — the leadership ladder (State -> District -> Block)
//   * tasks     — what is assigned, what is done, what is stuck
//   * funds     — money raised per chapter and per purpose
// Everything is real data from the IMS; nothing is fabricated.
const { models } = require('../../models/ims');
const { Op } = require('sequelize');

const num = (v) => Number(v || 0);

async function volunteerDashboard() {
  const [chapters, members, tasks, funds] = await Promise.all([
    models.ImsChapter.findAll({ where: { status: { [Op.ne]: 'archived' } } }).catch(() => []),
    models.ImsChapterMember.findAll({ where: { status: { [Op.ne]: 'archived' }, isActive: true } }).catch(() => []),
    models.ImsVolunteerTask.findAll({ where: { status: { [Op.ne]: 'archived' } } }).catch(() => []),
    models.ImsVolunteerFund.findAll({ where: { status: { [Op.ne]: 'archived' } } }).catch(() => []),
  ]);

  const byLevel = (lv) => chapters.filter((c) => c.level === lv);
  const states = new Set(chapters.filter((c) => c.state).map((c) => c.state));
  const districts = new Set(chapters.filter((c) => c.district).map((c) => c.district));

  const leaders = members
    .filter((m) => m.designation && m.designation !== 'Member')
    .map((m) => ({
      id: m.id, recordId: m.recordId, name: m.fullName, designation: m.designation,
      level: m.level, chapterId: m.chapterId, mobile: m.mobile, state: m.state, isActive: m.isActive,
    }));

  const taskBy = (s) => tasks.filter((t) => (t.taskStatus || 'pending') === s);
  const done = taskBy('done');
  const pending = taskBy('pending');
  const active = taskBy('in_progress');

  const fundsRaised = funds.reduce((n, f) => n + num(f.amount), 0);
  const fundTarget = tasks.reduce((n, t) => n + num(t.fundRequired), 0);
  const fundSpentRaised = tasks.reduce((n, t) => n + num(t.fundRaised), 0);

  // Funds grouped by chapter and by purpose.
  const chapterName = (id) => {
    const c = chapters.find((x) => x.id === id);
    return c ? c.name : '—';
  };
  const fundsByChapterMap = {};
  for (const f of funds) {
    const k = f.chapterId || 0;
    fundsByChapterMap[k] = (fundsByChapterMap[k] || 0) + num(f.amount);
  }
  const fundsByChapter = Object.entries(fundsByChapterMap)
    .map(([id, amount]) => ({ chapterId: Number(id), chapter: chapterName(Number(id)), amount }))
    .sort((a, b) => b.amount - a.amount);

  const perChapter = chapters.map((c) => {
    const cm = members.filter((m) => m.chapterId === c.id);
    const ct = tasks.filter((t) => t.chapterId === c.id);
    const cf = funds.filter((f) => f.chapterId === c.id);
    return {
      id: c.id, recordId: c.recordId, name: c.name, level: c.level,
      state: c.state, district: c.district, block: c.block,
      coordinatorName: c.coordinatorName,
      members: cm.length, leaders: cm.filter((m) => m.designation && m.designation !== 'Member').length,
      tasks: ct.length, tasksDone: ct.filter((t) => (t.taskStatus || 'pending') === 'done').length,
      funds: cf.reduce((n, f) => n + num(f.amount), 0),
    };
  }).sort((a, b) => b.members - a.members);

  // Next actionable list: pending/active tasks by due date.
  const openTasks = [...pending, ...active]
    .sort((a, b) => String(a.dueDate || '9999').localeCompare(String(b.dueDate || '9999')))
    .slice(0, 40)
    .map((t) => ({
      id: t.id, recordId: t.recordId, title: t.title, assigneeName: t.assigneeName,
      assigneeRole: t.assigneeRole, chapter: chapterName(t.chapterId),
      dueDate: t.dueDate, priority: t.priority, taskStatus: t.taskStatus || 'pending',
      fundRequired: num(t.fundRequired), fundRaised: num(t.fundRaised),
    }));

  return {
    summary: {
      chapters: chapters.length,
      stateChapters: byLevel('state').length,
      districtChapters: byLevel('district').length,
      blockChapters: byLevel('block').length,
      states: states.size,
      districts: districts.size,
      members: members.length,
      leaders: leaders.length,
      tasks: tasks.length,
      tasksDone: done.length,
      tasksActive: active.length,
      tasksPending: pending.length,
      fundsRaised,
      fundTarget,
      fundAllocated: fundSpentRaised,
    },
    fundsByChapter,
    perChapter,
    leaders: leaders.slice(0, 60),
    openTasks,
  };
}

module.exports = { volunteerDashboard };
