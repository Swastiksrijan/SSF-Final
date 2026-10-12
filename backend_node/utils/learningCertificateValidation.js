const PASS_THRESHOLD = 0.7;

/**
 * Validate the numeric result that a learner submits with a certificate
 * request. This is a consistency check, not proof that client-side lesson
 * progress itself cannot be tampered with.
 */
function isValidPassedAssessment(result, threshold = PASS_THRESHOLD) {
  if (!result || result.passed !== true) return false;
  const score = Number(result.score);
  const total = Number(result.total);
  return Number.isInteger(score)
    && Number.isInteger(total)
    && total > 0
    && score >= 0
    && score <= total
    && score / total >= threshold;
}

function validateCertificateAssessments({ moduleAssessments, requiredModuleAssessmentIds, finalAssessment } = {}) {
  const results = moduleAssessments && typeof moduleAssessments === "object" ? moduleAssessments : {};
  const requiredIds = Array.isArray(requiredModuleAssessmentIds)
    ? [...new Set(requiredModuleAssessmentIds.filter((id) => typeof id === "string" && id.trim()))]
    : [];
  return isValidPassedAssessment(finalAssessment)
    && Object.values(results).every((result) => isValidPassedAssessment(result))
    && requiredIds.every((id) => isValidPassedAssessment(results[id]));
}

module.exports = { isValidPassedAssessment, validateCertificateAssessments, PASS_THRESHOLD };
