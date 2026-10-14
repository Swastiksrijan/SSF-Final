const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidPassedAssessment, validateCertificateAssessments } = require("../utils/learningCertificateValidation");

test("accepts a passing score with a consistent total", () => {
  assert.equal(isValidPassedAssessment({ score: 7, total: 10, passed: true, assessmentVersion: "v2" }), true);
});

test("rejects a passing result saved by an older assessment version", () => {
  assert.equal(isValidPassedAssessment({ score: 10, total: 10, passed: true }), false);
});

test("rejects a claimed pass below the 70 percent minimum", () => {
  assert.equal(isValidPassedAssessment({ score: 6, total: 10, passed: true, assessmentVersion: "v2" }), false);
});

test("rejects missing, invalid, or impossible assessment totals", () => {
  assert.equal(isValidPassedAssessment({ passed: true }), false);
  assert.equal(isValidPassedAssessment({ score: 11, total: 10, passed: true, assessmentVersion: "v2" }), false);
  assert.equal(isValidPassedAssessment({ score: 0, total: 0, passed: true, assessmentVersion: "v2" }), false);
  assert.equal(isValidPassedAssessment({ score: 10, total: 10, passed: false, assessmentVersion: "v2" }), false);
});

test("requires the final assessment and every required module assessment to pass", () => {
  const finalAssessment = { score: 8, total: 10, passed: true, assessmentVersion: "v2" };
  const moduleAssessments = {
    "english-foundation": { score: 7, total: 10, passed: true, assessmentVersion: "v2" },
    "english-grammar": { score: 8, total: 10, passed: true, assessmentVersion: "v2" },
    "english-practical": { score: 9, total: 10, passed: true, assessmentVersion: "v2" },
  };
  assert.equal(validateCertificateAssessments({
    courseId: "english-communication", finalAssessment, moduleAssessments, requiredModuleAssessmentIds: ["english-foundation", "english-grammar", "english-practical"]
  }), true);
  assert.equal(validateCertificateAssessments({
    courseId: "english-communication", finalAssessment, moduleAssessments: { "english-foundation": moduleAssessments["english-foundation"], "english-grammar": moduleAssessments["english-grammar"], "english-practical": { score: 6, total: 10, passed: false, assessmentVersion: "v2" } },
    requiredModuleAssessmentIds: ["english-foundation", "english-grammar", "english-practical"]
  }), false);
  assert.equal(validateCertificateAssessments({
    courseId: "english-communication", finalAssessment, moduleAssessments, requiredModuleAssessmentIds: ["english-foundation", "missing"]
  }), false);
});

test("cannot omit server-defined required modules from a structured course request", () => {
  assert.equal(validateCertificateAssessments({
    courseId: "english-communication",
    finalAssessment: { score: 8, total: 10, passed: true, assessmentVersion: "v2" },
    moduleAssessments: {},
    requiredModuleAssessmentIds: []
  }), false);
});

test("does not accept client-invented required module IDs for an unknown course", () => {
  assert.equal(validateCertificateAssessments({
    courseId: "unregistered-course",
    finalAssessment: { score: 8, total: 10, passed: true, assessmentVersion: "v2" },
    moduleAssessments: { fake: { score: 10, total: 10, passed: true, assessmentVersion: "v2" } },
    requiredModuleAssessmentIds: ["fake"]
  }), false);
});

test("does not treat a missing final assessment as passed", () => {
  assert.equal(validateCertificateAssessments({ moduleAssessments: {}, requiredModuleAssessmentIds: [] }), false);
});
