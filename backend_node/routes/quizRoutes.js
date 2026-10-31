// SSF Awareness Quiz — HTTP API + automatic certificate issuance.
//
// Flow (no manual admin step for a pass):
//   1. GET  /api/quiz/:quizId            -> 10 questions (answers NEVER sent)
//   2. POST /api/quiz/:quizId/submit     -> scored server-side; on >= 80% the
//                                           certificate is issued immediately and
//                                           the verification URL is returned.
//   3. GET  /api/quiz/certificate/:id    -> public verification of an issued cert.
//
// A verified learning account (Member with a password hash) is required to earn a
// certificate, so a certificate is tied to a real person. Scoring is always done
// on the server — the browser never sees the answer key.

const express = require('express');
const router = express.Router();
const LearningCertificate = require('../models/LearningCertificate');
const Member = require('../models/Member');
const { buildQuiz, scoreQuiz, SUBJECTS, QUIZ_CATALOG } = require('../services/social/quizBank');
const { authorizeAccount } = require('../services/userAuth');

const wrap = (fn) => (req, r) => fn(req, r).catch((e) => { console.error('quiz error:', e); r.status(500).json({ message: 'Server Error' }); });

// Build a fresh certificate id: SSF-LCERT-<year>-<5-digit sequence>.
async function nextCertificateId() {
  const year = new Date().getFullYear();
  const count = await LearningCertificate.count({ where: { status: ['approved', 'issued'] } });
  let n = count + 1;
  // Guard against a collision if several pass at the same instant.
  for (let i = 0; i < 50; i += 1) {
    const id = `SSF-LCERT-${year}-${String(n).padStart(5, '0')}`;
    const clash = await LearningCertificate.findOne({ where: { certificateId: id } });
    if (!clash) return id;
    n += 1;
  }
  return `SSF-LCERT-${year}-${Date.now().toString().slice(-5)}`;
}

function verificationUrl(certificateId) {
  const frontend = (process.env.FRONTEND_URL || 'https://swastiksrijan.in').replace(/\/$/, '');
  return `${frontend}/LearningCertificateVerify?code=${encodeURIComponent(certificateId)}`;
}

// The quiz paper. Public (no token) so any visitor can attempt it.
router.get('/quiz/:quizId', wrap(async (req, r) => {
  const quizId = String(req.params.quizId || 'ssf-awareness-1');
  if (!QUIZ_CATALOG.some((item) => item.quizId === quizId)) {
    return r.status(404).json({ ok: false, message: 'Quiz not found or not published.' });
  }
  r.json({ ok: true, quiz: buildQuiz(quizId) });
}));

router.get('/quiz', wrap(async (_req, r) => {
  r.json({ ok: true, quiz: buildQuiz('ssf-awareness-1'), subjects: SUBJECTS, quizzes: QUIZ_CATALOG });
}));

// Submit answers. If the account is verified and the score >= 80%, issue the
// certificate automatically and return it in the same response.
router.post('/quiz/:quizId/submit', wrap(async (req, r) => {
  const quizId = String(req.params.quizId || 'ssf-awareness-1');
  if (!QUIZ_CATALOG.some((item) => item.quizId === quizId)) {
    return r.status(404).json({ ok: false, message: 'Quiz not found or not published.' });
  }
  const { answers } = req.body || {};
  const authHeader = String(req.headers.authorization || '');
  const accountAuth = authHeader ? authorizeAccount(req) : null;
  if (accountAuth && !accountAuth.ok) {
    return r.status(accountAuth.status).json({ ok: false, message: accountAuth.message });
  }
  const result = scoreQuiz(quizId, answers || {});
  if (!result.passed) {
    return r.json({ ok: true, passed: false, correct: result.correct, total: result.total, percent: result.percent, passPercent: result.passPercent, wrong: result.wrong, certificate: null });
  }

  // Passed. A certificate needs a verified learning account (name + email match).
  if (!accountAuth || !accountAuth.ok || accountAuth.admin || !accountAuth.accountId) {
    return r.json({ ok: true, passed: true, correct: result.correct, total: result.total, percent: result.percent, passPercent: result.passPercent, wrong: [], certificate: null, message: 'Sign in with your learning account to receive your certificate.' });
  }
  const member = await Member.findByPk(accountAuth.accountId);
  if (!member || !member.passwordHash || String(member.email).toLowerCase() !== String(accountAuth.email).toLowerCase()) {
    return r.status(401).json({ ok: false, message: 'Learning account could not be verified.' });
  }

  const courseId = `quiz-${quizId}`;
  const courseTitle = buildQuiz(quizId).title.en;
  // One certificate per account + quiz.
  let record = await LearningCertificate.findOne({ where: { accountId, courseId, status: ['requested', 'approved', 'issued'] } });
  const now = new Date();
  if (!record) {
    record = await LearningCertificate.create({
      accountId, learnerName: member.fullName, learnerEmail: member.email, courseId, courseTitle,
      completionPercent: 100, moduleAssessments: {}, finalAssessment: { passed: true, score: result.percent, quizId },
      status: 'issued', certificateId: await nextCertificateId(), certificateIssuedAt: now,
    });
  } else if (!record.certificateId) {
    await record.update({ status: 'issued', certificateId: await nextCertificateId(), certificateIssuedAt: now });
  }
  return r.json({
    ok: true, passed: true, correct: result.correct, total: result.total, percent: result.percent, passPercent: result.passPercent, wrong: [],
    certificate: { certificateId: record.certificateId, learnerName: record.learnerName, courseTitle: record.courseTitle, issuedAt: record.certificateIssuedAt, verificationUrl: verificationUrl(record.certificateId) },
  });
}));

// Public verification of an issued awareness-quiz certificate.
router.get('/quiz/certificate/:certificateId', wrap(async (req, r) => {
  const record = await LearningCertificate.findOne({ where: { certificateId: req.params.certificateId, status: ['approved', 'issued'] } });
  if (!record) return r.status(404).json({ valid: false, message: 'Certificate not found or no longer valid.' });
  r.json({ valid: true, certificateId: record.certificateId, learnerName: record.learnerName, courseTitle: record.courseTitle, issuedAt: record.certificateIssuedAt, status: record.status });
}));

module.exports = router;
