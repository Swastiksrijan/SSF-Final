const PASS_THRESHOLD = 0.7;

// Keep these IDs aligned with the structured assessment banks in
// src/data/coursesData.js and src/data/learningHubCourseArchitecture.js.
// The API uses this server-owned list so a browser cannot omit required modules.
const REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE = Object.freeze({
  "computer-education": ["computer-foundation", "files-documents", "internet-communication", "cyber-safety", "practical-digital-work"],
  "english-communication": ["english-foundation", "english-grammar", "english-practical"],
  "health-wellness": ["health-hygiene", "health-disease", "health-wellness-applied-practice-1"],
  "environment-sustainability": ["env-basics", "env-conservation", "environment-sustainability-applied-practice-1"],
  "career-workplace": ["career-foundations", "workplace-skills", "career-workplace-applied-practice-1"],
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
  const clientRequiredIds = Array.isArray(requiredModuleAssessmentIds)
    ? [...new Set(requiredModuleAssessmentIds.filter((id) => typeof id === "string" && id.trim()))]
    : [];
  const serverRequiredIds = REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE[courseId];

  // For courses with server-defined module assessments, always enforce that
  // list even if the client omits it. Unknown courses may not invent required IDs.
  if (!serverRequiredIds && clientRequiredIds.length) return false;
  if (serverRequiredIds && (
    clientRequiredIds.length !== serverRequiredIds.length
    || serverRequiredIds.some((id) => !clientRequiredIds.includes(id))
  )) return false;
  const requiredIds = serverRequiredIds || clientRequiredIds;

  return isValidPassedAssessment(finalAssessment)
    && Object.values(results).every((result) => isValidPassedAssessment(result))
    && requiredIds.every((id) => isValidPassedAssessment(results[id]));
}

module.exports = {
  isValidPassedAssessment,
  validateCertificateAssessments,
  PASS_THRESHOLD,
  REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE,
};
