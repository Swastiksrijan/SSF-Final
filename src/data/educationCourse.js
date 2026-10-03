/**
 * Education / शिक्षा — rich, subject-specific course architecture.
 *
 * Mirrors the Knowledge World course architecture so the same course UI can
 * render it: overview → modules → topic(learn/example/activity/quiz) →
 * glossary → facts → project → revision → mastery → related.
 *
 * Content is authored per subject in the four part files; this module only
 * normalises the compact authoring tuples into the objects the UI consumes.
 * Primary Education is intentionally NOT part of this registry: it keeps its
 * own dedicated, richer primary-learning renderer (letters, visuals, teaching
 * mode) which is the quality benchmark for the section.
 */
import { EDU_PART_A } from "./educationCoursesA.js";
import { EDU_PART_B } from "./educationCoursesB.js";
import { EDU_PART_C } from "./educationCoursesC.js";
import { EDU_PART_D } from "./educationCoursesD.js";

export const EDUCATION_CATEGORY = "Education / शिक्षा";

const buildTopic = (t, mi, ti) => ({
  id: `edu-m${mi + 1}-t${ti + 1}`,
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
    id: `edu-m${mi + 1}`,
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

const RAW = { ...EDU_PART_A, ...EDU_PART_B, ...EDU_PART_C, ...EDU_PART_D };

export const EDUCATION_COURSES = Object.fromEntries(
  Object.entries(RAW).map(([title, c]) => [title, buildCourse(c)])
);

export const getEducationCourse = (subject) => {
  if (!subject) return null;
  if (EDUCATION_COURSES[subject.en]) return EDUCATION_COURSES[subject.en];
  const key = Object.keys(EDUCATION_COURSES).find(
    (k) => k.toLowerCase() === String(subject.en || "").toLowerCase()
  );
  return key ? EDUCATION_COURSES[key] : null;
};

export const isEducationSubject = (subject) =>
  Boolean(subject && subject.category === EDUCATION_CATEGORY && getEducationCourse(subject));

export const educationTopicCount = (course) =>
  course ? course.modules.reduce((n, m) => n + m.topics.length, 0) : 0;
