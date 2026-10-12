const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidPassedAssessment, validateCertificateAssessments } = require("../utils/learningCertificateValidation");

test("accepts a passing score with a consistent total", () => {
  assert.equal(isValidPassedAssessment({ score: 7, total: 10, passed: true }), true);
});

test("rejects a claimed pass below the 70 percent minimum", () => {
  assert.equal(isValidPassedAssessment({ score: 6, total: 10, passed: true }), false);
});

test("rejects missing, invalid, or impossible assessment totals", () => {
  assert.equal(isValidPassedAssessment({ passed: true }), false);
  assert.equal(isValidPassedAssessment({ score: 11, total: 10, passed: true }), false);
  assert.equal(isValidPassedAssessment({ score: 0, total: 0, passed: true }), false);
  assert.equal(isValidPassedAssessment({ score: 10, total: 10, passed: false }), false);
});

test("requires the final assessment and every required module assessment to pass", () => {
  const finalAssessment = { score: 8, total: 10, passed: true };
  const moduleAssessments = {
    foundation: { score: 7, total: 10, passed: true },
    practical: { score: 9, total: 10, passed: true },
  };
  assert.equal(validateCertificateAssessments({
    finalAssessment, moduleAssessments, requiredModuleAssessmentIds: ["foundation", "practical"]
  }), true);
  assert.equal(validateCertificateAssessments({
    finalAssessment, moduleAssessments: { foundation: moduleAssessments.foundation, practical: { score: 6, total: 10, passed: false } },
    requiredModuleAssessmentIds: ["foundation", "practical"]
  }), false);
  assert.equal(validateCertificateAssessments({
    finalAssessment, moduleAssessments, requiredModuleAssessmentIds: ["foundation", "missing"]
  }), false);
});

test("does not treat a missing final assessment as passed", () => {
  assert.equal(validateCertificateAssessments({ moduleAssessments: {}, requiredModuleAssessmentIds: [] }), false);
});
