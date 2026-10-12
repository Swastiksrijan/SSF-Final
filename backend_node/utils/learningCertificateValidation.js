const PASS_THRESHOLD = 0.7;

// These IDs are defined by the checked-in structured course assessment banks.
// Do not let a browser omit required modules from the certificate request.
const REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE = Object.freeze({
  "computer-education": ["computer-foundation", "files-documents", "internet-communication", "cyber-safety", "practical-digital-work"],
  "english-communication": ["english-foundation", "english-grammar", "english-practical"],
  "health-wellness": ["health-hygiene", "health-disease"],
  "environment-sustainability": ["env-basics", "env-conservation"],
  "career-workplace": ["career-foundations", "workplace-skills"],
});

/**
 * Validate the numeric result that a learner submits with a certificate
 * request. This is a consistency check, not proof that client-side lesson
 * progress itself cannot be tampered with.
 */
function isValidPassedAssessment(result, threshold = PASS_THRESHOLD) {
  if (!result || result.passed !== true || result.assessmentVersion !== "v2") return false;
  const score = Number(result.score);
  const total = Number(result.total);
  return Number.isInteger(score)
    && Number.isInteger(total)
    && total > 0
    && score >= 0
    && score <= total
    && score / total >= threshold;
}

function validateCertificateAssessments({ courseId, moduleAssessments, requiredModuleAssessmentIds, finalAssessment } = {}) {
  const results = moduleAssessments && typeof moduleAssessments === "object" ? moduleAssessments : {};
const PASS_THRESHOLD = 0.7;

// These IDs are defined by the checked-in structured course assessment banks.
// Do not let a browser omit required modules from the certificate request.
const REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE = Object.freeze({
  "computer-education": ["computer-foundation", "files-documents", "internet-communication", "cyber-safety", "practical-digital-work"],
  "english-communication": ["english-foundation", "english-grammar", "english-practical"],
  "health-wellness": ["health-hygiene", "health-disease"],
  "environment-sustainability": ["env-basics", "env-conservation"],
  "career-workplace": ["career-foundations", "workplace-skills"],
});

}

module.exports = { isValidPassedAssessment, validateCertificateAssessments, PASS_THRESHOLD, REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE };
