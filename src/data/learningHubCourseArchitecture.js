/**
 * SSF Learning Hub — Master Course Architecture
 *
 * This file defines the stable learning contract used by future courses.
 * Existing LearningHubV2 content is intentionally not removed or rewritten here.
 *
 * Flow:
 * Explore -> Course Overview -> Modules -> Lessons -> Practice -> Assessment
 * -> Completion -> Certificate -> Verification
 */

export const LEARNING_LEVELS = [
  { id: "foundation", en: "Foundation", hi: "आधार स्तर" },
  { id: "beginner", en: "Beginner", hi: "प्रारंभिक स्तर" },
  { id: "intermediate", en: "Intermediate", hi: "मध्यवर्ती स्तर" },
  { id: "advanced", en: "Advanced", hi: "उन्नत स्तर" },
  { id: "practical", en: "Practical / Professional", hi: "व्यावहारिक / व्यावसायिक स्तर" },
];

export const LESSON_COMPONENTS = [
  "objectives", "prerequisites", "learn", "easyExplanation",
  "deepUnderstanding", "examples", "visual", "video", "audio",
  "practicalApplication", "activity", "practice", "commonMistakes",
  "knowledgeCheck", "reflection", "summary",
];

export const ASSESSMENT_TYPES = [
  "diagnostic", "formative", "module", "practical", "final",
];

export const CERTIFICATE_REQUIREMENTS = {
  lessons: "required",
  activities: "required",
  assessments: "required",
  finalAssessment: "required",
  completion: 100,
  accountAtCertificateStage: true,
};

export const COURSE_TYPES = [
  { id: "awareness", en: "Awareness", hi: "जागरूकता पाठ्यक्रम" },
  { id: "foundation", en: "Foundation Course", hi: "आधार पाठ्यक्रम" },
  { id: "skill", en: "Skill Course", hi: "कौशल पाठ्यक्रम" },
  { id: "advanced", en: "Advanced Course", hi: "उन्नत पाठ्यक्रम" },
  { id: "certificate", en: "Certificate Course", hi: "प्रमाणपत्र पाठ्यक्रम" },
  { id: "resource", en: "Learning Resource", hi: "अध्ययन संसाधन" },
];

/*
 * Official course identity.
 * The id must remain stable once a course is published.
 * The title is the canonical display name used on cards, learning pages,
 * dashboards, assessments, certificates and verification records.
 */
export function createCourseDefinition({
  id,
  title,
  category,
  type = "skill",
  level = "beginner",
  description = "",
  audience = "",
  prerequisites = [],
  outcomes = [],
  learningHours = 0,
  modules = [],
  resources = [],
  version = "1.0",
  lastReviewed = "",
}) {
  if (!id || !title || !category) {
    throw new Error("Course id, title and category are required.");
  }

  return {
    id, title, category, type, level, description, audience,
    prerequisites, outcomes, learningHours, modules, resources,
    version, lastReviewed,
    certificate: { ...CERTIFICATE_REQUIREMENTS },
  };
}

export function createModule({ id, title, description = "", lessons = [], assessment = null }) {
  return { id, title, description, lessons, assessment };
}

export function createLesson({
  id,
  title,
  objectives = [],
  prerequisites = [],
  content = {},
  practice = [],
  activity = null,
  assessment = null,
}) {
  return {
    id, title, objectives, prerequisites, content,
    practice, activity, assessment,
  };
}

/*
 * Visual identity contract for every shareable learning section.
 * A section should use a topic-relevant photo, approved illustration,
 * or meaningful subject icon — never a random decorative image.
 */
export function createLearningVisual({
  type = "icon",
  src = "",
  alt = "",
  icon = "",
  credit = "",
}) {
  return { type, src, alt, icon, credit };
}

/*
 * Learning stays open to visitors. Account creation/login is required
 * only when the learner requests a certificate.
 */
export function canRequestCertificate({ completion = 0, finalPassed = false }) {
  return completion >= CERTIFICATE_REQUIREMENTS.completion && finalPassed;
}
