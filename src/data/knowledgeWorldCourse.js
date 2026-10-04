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

/** Glossary entries come in as strings from buildCourse; normalise for the UI. */
const kwGlossary = (course) =>
  (course.glossary || []).map((g) => (typeof g === "string" ? { term: g, hi: "", meaning: "" } : g));

/**
 * Adapt a Knowledge World course (module → topic with learn/example/activity/
 * quiz) into the Master Course shape consumed by MasterCourse.jsx. This lets
 * every KW subject render through the same premium renderer instead of the
 * older flat topic list. Chapter ids stay `kw-mX-tY` so saved progress maps
 * across the two renderers.
 */
export const knowledgeWorldToMasterCourse = (subject, course) => {
  if (!course) return null;
  const [en, hi] = String(subject.en || course.tagline || "").split(" / ");
  const topic = (t) => ({ ...t, id: t.id, icon: (t.title.match(/^\p{Emoji}/u) || ["📘"])[0] });
  return {
    meta: {
      icon: course.icon,
      title: [en || course.tagline || "", hi || subject.hi || ""],
      level: course.level,
      tag: course.tag || "Knowledge World",
      tagline: course.tagline,
      heroSubtitle: course.overview?.what || course.tagline,
    },
    overview: course.overview,
    courseStart: {
      title: "इस course को कैसे सीखें",
      blocks: [
        { t: "p", x: course.overview?.what },
        { t: "note", k: "goal", title: "सीखने के बाद / Outcome", x: course.overview?.outcome },
        { t: "note", k: "info", title: "कहाँ दिखता है / Where we see it", x: course.overview?.where },
        { t: "note", k: "tip", title: "सीखने का flow", x: "हर chapter में: Learn → Example → Activity → Practice Quiz।" },
      ],
    },
    modules: course.modules.map((m) => {
      const mIcon = (m.title.match(/^\p{Emoji}/u) || [course.icon])[0];
      return {
        id: m.id,
        title: m.title.split(" / ")[0],
        titleHi: m.title.split(" / ")[1] || "",
        icon: mIcon,
        chapters: m.topics.map((t) => {
          const tt = topic(t);
          return {
            id: tt.id,
            number: 0,
            title: tt.title.split(" / ")[0],
            titleHi: tt.title.split(" / ")[1] || "",
            icon: tt.icon,
            blocks: [
              { t: "p", x: tt.learn },
              { t: "ex", title: "Example / उदाहरण", x: tt.example },
              { t: "act", title: "Activity / गतिविधि", x: tt.activity },
              { t: "note", k: "tip", title: "Quiz / अभ्यास", x: tt.quiz?.question, items: tt.quiz?.options },
              { t: "note", k: "remember", title: "सही उत्तर", x: tt.quiz ? `${tt.quiz.options[tt.quiz.answer]} — ${tt.quiz.explain}` : "" },
            ],
          };
        }),
      };
    }).map((m, mi, arr) => {
      let n = 0;
      for (let i = 0; i < mi; i++) n += arr[i].chapters.length;
      m.chapters.forEach((c, ci) => { c.number = n + ci + 1; });
      return m;
    }),
    revision: {
      title: "पूरा course एक नज़र में",
      groups: [
        ...(course.revision ? [{ title: "🔄 याद रखें", items: course.revision }] : []),
        { title: "📖 मुख्य शब्द / Key Words", items: kwGlossary(course).map((g) => `${g.term}${g.hi ? " (" + g.hi + ")" : ""}${g.meaning ? " — " + g.meaning : ""}`) },
        { title: "💡 Did You Know?", items: course.facts || [] },
      ].filter((g) => g.items.length),
    },
    mastery: {
      title: "Final Test / अंतिम परीक्षा",
      note: "इस course के सभी modules से चुने गए प्रश्न।",
      tasks: course.modules.map((m) => ({ icon: "📘", title: m.title.split(" / ")[0], x: m.summary })),
      quiz: (course.mastery || []).map((q) => ({ q: q.question, options: q.options, answer: q.answer, explain: q.explain })),
    },
    outcomeIntro: "इस course के बाद learner:",
    outcome: [course.overview?.outcome, course.overview?.why].filter(Boolean),
    outcomeClose: "समझ + अभ्यास + वास्तविक उदाहरण — यही असली learning है।",
    project: course.project,
  };
};
