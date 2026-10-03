/**
 * Knowledge World — rich, subject-specific course architecture.
 *
 * Each Knowledge World subject is a mini knowledge-explorer, not a flat topic
 * list. A course carries:
 *   overview  → what / why / where we see it / what the learner will understand
 *   modules[] → subject-specific themes, each with concrete topics
 *   topic     → learn / example / activity / quiz(with explanation)
 *   glossary  → Key Words / मुख्य शब्द (English + Hindi + simple meaning)
 *   facts     → verified "Did You Know?" notes
 *   project   → objective → materials → steps → observation → result → reflection
 *   related   → connected Knowledge World subjects (Knowledge Connections)
 *
 * Content is authored per subject in the six part files; this module only
 * normalises the compact authoring tuples into the objects the UI consumes.
 */
import { KW_PART_A } from "./knowledgeWorldCoursesA.js";
import { KW_PART_B } from "./knowledgeWorldCoursesB.js";
import { KW_PART_C } from "./knowledgeWorldCoursesC.js";
import { KW_PART_D } from "./knowledgeWorldCoursesD.js";
import { KW_PART_E } from "./knowledgeWorldCoursesE.js";
import { KW_PART_F } from "./knowledgeWorldCoursesF.js";

const buildTopic = (t, mi, ti) => ({
  id: `kw-m${mi + 1}-t${ti + 1}`,
  title: t[0],
  learn: t[1],
  example: t[2],
  activity: t[3],
  quiz: {
    question: t[4][0],
    options: t[4][1],
    answer: t[4][2],
    explain: t[4][3],
  },
});

const buildCourse = (c) => ({
  icon: c.icon,
  level: c.level,
  tagline: c.tagline,
  tag: c.tag,
  overview: { what: c.what, why: c.why, where: c.where, outcome: c.outcome },
  modules: c.modules.map((m, mi) => ({
    id: `kw-m${mi + 1}`,
    title: m[0],
    summary: m[1],
    topics: m[2].map((t, ti) => buildTopic(t, mi, ti)),
  })),
  glossary: (c.glossary || []).map((g) => ({ term: g[0], hi: g[1], meaning: g[2] })),
  facts: c.facts || [],
  project: c.project,
  revision: c.revision || null,
  mastery: (c.mastery || []).map((q) => ({
    question: q[0],
    options: q[1],
    answer: q[2],
    explain: q[3],
  })),
  related: c.related || [],
});

const RAW = { ...KW_PART_A, ...KW_PART_B, ...KW_PART_C, ...KW_PART_D, ...KW_PART_E, ...KW_PART_F };

export const KNOWLEDGE_WORLD_COURSES = Object.fromEntries(
  Object.entries(RAW).map(([title, c]) => [title, buildCourse(c)])
);

// Subject titles are stored as "English / Hindi" in the topic registry.
export const getKnowledgeWorldCourse = (subject) => {
  if (!subject) return null;
  if (KNOWLEDGE_WORLD_COURSES[subject.en]) return KNOWLEDGE_WORLD_COURSES[subject.en];
  const key = Object.keys(KNOWLEDGE_WORLD_COURSES).find(
    (k) => k.toLowerCase() === String(subject.en || "").toLowerCase()
  );
  return key ? KNOWLEDGE_WORLD_COURSES[key] : null;
};

export const isKnowledgeWorldSubject = (subject) =>
  Boolean(subject && subject.category === "Knowledge World / ज्ञान संसार" && getKnowledgeWorldCourse(subject));

// ADULT-GRADE: every Knowledge World course is a full learning path.
export const knowledgeWorldTopicCount = (course) =>
  course ? course.modules.reduce((n, m) => n + m.topics.length, 0) : 0;
