// Integration test: awareness quiz + AUTOMATIC certificate issuance.
// Runs the real quizRoutes on express with an in-memory Postgres (pg-mem).
//
//   node backend_node/tests/quiz.http.test.js
process.env.NODE_ENV = 'test';

const { newDb } = require('pg-mem');
const mem = newDb();
// pg-mem cannot run Sequelize's ENUM introspection or its `DROP TYPE ... DO $$`
// block, so the enum types are pre-registered and those two queries intercepted.
mem.public.registerEnum('enum_Members_status', ['pending', 'changes_requested', 'approved', 'rejected']);
mem.public.registerEnum('enum_Members_paymentStatus', ['not_required', 'pending', 'paid', 'failed']);
mem.public.registerEnum('enum_LearningCertificates_status', ['requested', 'approved', 'rejected', 'issued']);
mem.public.interceptQueries((sql) => {
  if (sql.includes('pg_enum') && /typname='enum_/.test(sql)) return [];
  if (/DROP TYPE IF EXISTS "public"\."enum_/.test(sql)) return [];
  return null;
});
const pgAdapter = mem.adapters.createPg();
const realPgPath = require.resolve('pg');
require(realPgPath);
require.cache[realPgPath].exports = { ...require.cache[realPgPath].exports, Client: pgAdapter.Client, Pool: pgAdapter.Pool };

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  \u2713 ${name}`); }
  else { fail += 1; console.log(`  \u2717 ${name} ${extra}`); }
};

async function main() {
  const express = require('express');
  const { sequelize } = require('../models/social');
  const Member = require('../models/Member');
  const LearningCertificate = require('../models/LearningCertificate');
  await sequelize.sync({ force: true });

  const { buildQuiz, scoreQuiz, QUESTIONS } = require('../services/social/quizBank');

  console.log('\nQuiz bank (server-side answers):');
  ok('bank has at least 30 questions', QUESTIONS.length >= 30, `n=${QUESTIONS.length}`);
  const paper = buildQuiz('ssf-awareness-1');
  ok('paper has 10 questions', paper.questions.length === 10, `n=${paper.questions.length}`);
  ok('pass mark is 80%', paper.passPercent === 80);
  ok('no answer key is ever sent to the client', paper.questions.every((q) => q.answer === undefined && q.explain === undefined));
  ok('paper is stable for the same quizId', JSON.stringify(buildQuiz('ssf-awareness-1').questions.map((q) => q.id)) === JSON.stringify(paper.questions.map((q) => q.id)));

  // A perfect submission passes; a blank one fails.
  const allRight = {};
  for (const q of paper.questions) allRight[q.id] = require('../services/social/quizBank').byId[q.id].answer;
  const scored = scoreQuiz('ssf-awareness-1', allRight);
  ok('all-correct scores 100% and passes', scored.percent === 100 && scored.passed === true, JSON.stringify(scored).slice(0, 80));
  const blank = scoreQuiz('ssf-awareness-1', {});
  ok('blank answers do NOT pass', blank.passed === false && blank.percent === 0);
  ok('wrong answers reveal the correct index + explanation', blank.wrong.length === 10 && typeof blank.wrong[0].correctIndex === 'number' && !!blank.wrong[0].explain.en);

  // Route wiring + automatic certificate.
  const router = require('../routes/quizRoutes');
  const app = express();
  app.use(express.json());
  app.use('/api', router);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = (p) => fetch(base + p).then(async (r) => ({ status: r.status, body: await r.json() }));
  const post = (p, body) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }).then(async (r) => ({ status: r.status, body: await r.json() }));

  try {
    console.log('\nQuiz API:');
    const q = await get('/api/quiz/ssf-awareness-1');
    ok('GET quiz 200', q.status === 200, JSON.stringify(q.body).slice(0, 100));
    ok('quiz API hides answers', q.body.quiz.questions.every((x) => x.answer === undefined));

    // A real, verified learning account.
    const member = await Member.create({ fullName: 'Test Learner', email: 'learner@example.com', phone: '9000000000', passwordHash: 'x', status: 'approved' });

    console.log('\nAuto-certificate on pass:');
    const submit = await post('/api/quiz/ssf-awareness-1/submit', { accountId: member.id, learner: { email: 'learner@example.com' }, answers: allRight });
    ok('pass issues a certificate immediately (no admin step)', submit.status === 200 && submit.body.passed === true && submit.body.certificate && submit.body.certificate.certificateId, JSON.stringify(submit.body).slice(0, 160));
    ok('certificate id has the SSF-LCERT format', /^SSF-LCERT-\d{4}-\d{5}$/.test(submit.body.certificate.certificateId), submit.body.certificate.certificateId);
    ok('certificate carries a verification URL', /LearningCertificateVerify\?code=/.test(submit.body.certificate.verificationUrl));
    const certId = submit.body.certificate.certificateId;

    console.log('\nPublic verification:');
    const verify = await get(`/api/quiz/certificate/${certId}`);
    ok('issued cert verifies publicly', verify.status === 200 && verify.body.valid === true && verify.body.learnerName === 'Test Learner', JSON.stringify(verify.body));
    const missing = await get('/api/quiz/certificate/SSF-LCERT-2099-99999');
    ok('unknown cert is not valid', missing.status === 404 && missing.body.valid === false);

    console.log('\nOne certificate per account+quiz (idempotent):');
    const again = await post('/api/quiz/ssf-awareness-1/submit', { accountId: member.id, learner: { email: 'learner@example.com' }, answers: allRight });
    ok('re-submitting returns the SAME certificate', again.body.certificate.certificateId === certId, `${again.body.certificate.certificateId} vs ${certId}`);
    const count = await LearningCertificate.count({ where: { accountId: member.id } });
    ok('only one certificate row exists', count === 1, `rows=${count}`);

    console.log('\nGuards:');
    const fakeMember = await post('/api/quiz/ssf-awareness-1/submit', { accountId: member.id, learner: { email: 'someone-else@example.com' }, answers: allRight });
    ok('wrong email = 401 (no certificate)', fakeMember.status === 401 && !fakeMember.body.certificate);
    const noAccount = await post('/api/quiz/ssf-awareness-1/submit', { answers: allRight });
    ok('pass without account passes but issues no cert', noAccount.body.passed === true && noAccount.body.certificate === null);
    const failSubmit = await post('/api/quiz/ssf-awareness-1/submit', { accountId: member.id, learner: { email: 'learner@example.com' }, answers: {} });
    ok('failing score issues no certificate', failSubmit.body.passed === false && failSubmit.body.certificate === null);
  } finally {
    server.close();
    await sequelize.close();
  }

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  if (fail) process.exit(1);
}

main().catch((e) => { console.error('TEST ERROR', e); process.exit(1); });
