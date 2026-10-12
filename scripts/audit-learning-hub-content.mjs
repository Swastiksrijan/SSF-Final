import { SUBJECT_CONTENT } from "../src/data/learningHubSubjectContent.js";
import { SUBJECT_CONTENT_EXTRA } from "../src/data/learningSubjectContentExtra.js";
import { LEARNING_CATEGORIES, LEARNING_CATEGORIES_EXTRA } from "../src/data/learningCurriculum.js";
import { ENTREPRENEURSHIP_CONTENT } from "../src/data/entrepreneurshipContent.js";
import { RESEARCH_CONTENT } from "../src/data/researchSkillsContent.js";
import { MEDIA_CONTENT } from "../src/data/mediaLiteracyContent.js";
import { ARTS_CONTENT } from "../src/data/artsCultureContent.js";
import { PRACTICAL_CONTENT } from "../src/data/practicalLifeContent.js";
import { AI_CONTENT } from "../src/data/aiTechContent.js";
import { LIFESKILLS_CONTENT } from "../src/data/lifeSkillsContent.js";
import { SPORTS_CONTENT } from "../src/data/sportsWellnessContent.js";
import { MATH_CONTENT } from "../src/data/mathFinanceContent.js";
import { LANGUAGES_CONTENT } from "../src/data/languagesContent.js";
import { SCIENCE_CONTENT } from "../src/data/scienceContent.js";
import { CORPORATE_CONTENT } from "../src/data/corporateMasteryContent.js";
import { OFFICE_SKILLS_CONTENT } from "../src/data/officeSkillsContent.js";
import { EDU_PART_A } from "../src/data/educationCoursesA.js";
import { EDU_PART_B } from "../src/data/educationCoursesB.js";
import { EDU_PART_C } from "../src/data/educationCoursesC.js";
import { EDU_PART_D } from "../src/data/educationCoursesD.js";
import { EDU_RICH_B1 } from "../src/data/educationCoursesRich.js";
import { EDU_RICH_B2 } from "../src/data/educationCoursesRichB.js";
import { KW_PART_A } from "../src/data/knowledgeWorldCoursesA.js";
import { KW_PART_B } from "../src/data/knowledgeWorldCoursesB.js";
import { KW_PART_C } from "../src/data/knowledgeWorldCoursesC.js";
import { KW_PART_D } from "../src/data/knowledgeWorldCoursesD.js";
import { KW_PART_E } from "../src/data/knowledgeWorldCoursesE.js";
import { KW_PART_F } from "../src/data/knowledgeWorldCoursesF.js";
import { FLAGSHIP_COURSES } from "../src/data/learningHubCourseArchitecture.js";

const registries = [
  ["SUBJECT_CONTENT", SUBJECT_CONTENT],
  ["SUBJECT_CONTENT_EXTRA", SUBJECT_CONTENT_EXTRA],
];
const requiredArrays = ["concepts", "examples", "practice", "activities", "mistakes", "quiz", "revision"];
const errors = [];
const warnings = [];
const keysSeen = new Map();
let entryCount = 0;
let questionCount = 0;

for (const [registryName, registry] of registries) {
  for (const [subject, content] of Object.entries(registry)) {
    entryCount += 1;
    if (keysSeen.has(subject)) {
      warnings.push(`Duplicate content key "${subject}" in ${keysSeen.get(subject)} and ${registryName}; EXTRA registry wins in LearningHubV2.`);
    } else {
      keysSeen.set(subject, registryName);
    }
    if (typeof content.focus !== "string" || !content.focus.trim()) {
      errors.push(`${registryName}["${subject}"]: missing bilingual focus.`);
    }
    if (typeof content.practical !== "string" || !content.practical.trim()) {
      errors.push(`${registryName}["${subject}"]: missing practical application.`);
    }
    for (const field of requiredArrays) {
      if (!Array.isArray(content[field]) || content[field].length === 0) {
        errors.push(`${registryName}["${subject}"]: ${field} must be a non-empty array.`);
      }
    }
    for (const [index, q] of (Array.isArray(content.quiz) ? content.quiz : []).entries()) {
      questionCount += 1;
      const label = `${registryName}["${subject}"].quiz[${index}]`;
      const prompt = q?.question || q?.q || q?.prompt;
      if (typeof prompt !== "string" || !prompt.trim()) errors.push(`${label}: missing question text.`);
      if (!Array.isArray(q?.options) || q.options.length < 2) {
        errors.push(`${label}: at least two answer options are required.`);
        continue;
      }
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
        errors.push(`${label}: answer must be a valid zero-based option index.`);
      }
      if (q.options.some((option) => typeof option !== "string" || !option.trim())) {
        errors.push(`${label}: every answer option must be a non-empty string.`);
      }
    }
  }
}

const compactCourseMaps = [
  ["EDU_PART_A", EDU_PART_A],
  ["EDU_PART_B", EDU_PART_B],
  ["EDU_PART_C", EDU_PART_C],
  ["EDU_PART_D", EDU_PART_D],
  ["EDU_RICH_B1", EDU_RICH_B1],
  ["EDU_RICH_B2", EDU_RICH_B2],
  ["KW_PART_A", KW_PART_A],
  ["KW_PART_B", KW_PART_B],
  ["KW_PART_C", KW_PART_C],
  ["KW_PART_D", KW_PART_D],
  ["KW_PART_E", KW_PART_E],
  ["KW_PART_F", KW_PART_F],
];
let compactCourseCount = 0;
let compactTopicCount = 0;
for (const [mapName, map] of compactCourseMaps) {
  for (const [title, course] of Object.entries(map || {})) {
    compactCourseCount += 1;
    const modules = Array.isArray(course?.modules) ? course.modules : [];
    if (!modules.length) errors.push(`${mapName}["${title}"]: no authored modules.`);
    for (const [mi, module] of modules.entries()) {
      const topics = Array.isArray(module) ? module[2] : module?.topics;
      if (!Array.isArray(topics) || !topics.length) {
        errors.push(`${mapName}["${title}"].modules[${mi}]: no authored topics.`);
        continue;
      }
      for (const [ti, topic] of topics.entries()) {
        compactTopicCount += 1;
        const label = `${mapName}["${title}"].modules[${mi}].topics[${ti}]`;
        const tuple = Array.isArray(topic);
        const quiz = tuple ? (Array.isArray(topic[4]) ? { q: topic[4][0], options: topic[4][1], answer: topic[4][2] } : {}) : (topic?.quiz || {});
        const prompt = quiz.q || quiz.question || quiz.prompt || topic?.question;
        const options = quiz.options;
        const answer = quiz.answer;
        const learn = tuple ? topic[1] : (topic?.learn || topic?.body);
        const example = tuple ? topic[2] : (topic?.example || topic?.examples);
        const activity = tuple ? topic[3] : topic?.activity;
        if (!(typeof (tuple ? topic[0] : topic?.title) === "string" && (tuple ? topic[0] : topic?.title).trim())) errors.push(`${label}: missing topic title.`);
        if (!(typeof learn === "string" && learn.trim())) errors.push(`${label}: missing learning explanation.`);
        if (!(typeof example === "string" && example.trim()) && !(Array.isArray(example) && example.length)) errors.push(`${label}: missing example.`);
        if (!(typeof activity === "string" && activity.trim())) errors.push(`${label}: missing activity.`);
        if (typeof prompt !== "string" || !prompt.trim()) errors.push(`${label}: missing quiz question.`);
        if (!Array.isArray(options) || options.length < 2) errors.push(`${label}: quiz needs at least two options.`);
        else if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) errors.push(`${label}: answer key is missing or invalid; do not guess option zero.`);
      }
    }
  }
}

const authoredMaps = [
  ["OFFICE_SKILLS_CONTENT", OFFICE_SKILLS_CONTENT],
  ["ENTREPRENEURSHIP_CONTENT", ENTREPRENEURSHIP_CONTENT],
  ["RESEARCH_CONTENT", RESEARCH_CONTENT],
  ["MEDIA_CONTENT", MEDIA_CONTENT],
  ["ARTS_CONTENT", ARTS_CONTENT],
  ["PRACTICAL_CONTENT", PRACTICAL_CONTENT],
  ["AI_CONTENT", AI_CONTENT],
  ["LIFESKILLS_CONTENT", LIFESKILLS_CONTENT],
  ["SPORTS_CONTENT", SPORTS_CONTENT],
  ["MATH_CONTENT", MATH_CONTENT],
  ["LANGUAGES_CONTENT", LANGUAGES_CONTENT],
  ["SCIENCE_CONTENT", SCIENCE_CONTENT],
  ["CORPORATE_CONTENT", CORPORATE_CONTENT],
];
let authoredCourseCount = 0;
let authoredTopicCount = 0;
for (const [mapName, map] of authoredMaps) {
  for (const [title, course] of Object.entries(map || {})) {
    authoredCourseCount += 1;
    const modules = Array.isArray(course?.modules) ? course.modules : [];
    if (!modules.length) errors.push(`${mapName}["${title}"]: no authored modules.`);
    for (const [mi, module] of modules.entries()) {
      const topics = Array.isArray(module?.topics) ? module.topics : [];
      if (!topics.length) errors.push(`${mapName}["${title}"].modules[${mi}]: no authored topics.`);
      for (const [ti, topic] of topics.entries()) {
        authoredTopicCount += 1;
        const label = `${mapName}["${title}"].modules[${mi}].topics[${ti}]`;
        if (typeof topic?.title !== "string" || !topic.title.trim()) errors.push(`${label}: missing topic title.`);
        for (const field of ["learn", "example", "activity"]) {
          if (typeof topic?.[field] !== "string" || !topic[field].trim()) errors.push(`${label}: missing ${field} content.`);
        }
        const quiz = topic?.quiz || {};
        const prompt = quiz.q || quiz.question || quiz.prompt;
        if (typeof prompt !== "string" || !prompt.trim()) errors.push(`${label}: missing quiz question.`);
        if (!Array.isArray(quiz.options) || quiz.options.length < 2) {
          errors.push(`${label}: quiz needs at least two options.`);
        } else if (!Number.isInteger(quiz.answer) || quiz.answer < 0 || quiz.answer >= quiz.options.length) {
          errors.push(`${label}: quiz answer key is not a valid zero-based option index.`);
        }
        if (Array.isArray(quiz.options) && quiz.options.some(option => typeof option !== "string" || !option.trim())) {
          errors.push(`${label}: quiz contains an empty answer option.`);
        }
      }
    }
    if (!Array.isArray(course?.mastery) || !course.mastery.length) warnings.push(`${mapName}["${title}"]: no final mastery question bank found.`);
    if (!course?.project) warnings.push(`${mapName}["${title}"]: no practical project authored.`);
  }
}

const categories = [...Object.values(LEARNING_CATEGORIES || {}), ...Object.values(LEARNING_CATEGORIES_EXTRA || {})];
const curriculumTitles = new Set();
for (const category of categories) {
  for (const item of Array.isArray(category) ? category : []) {
    if (Array.isArray(item) && typeof item[0] === "string") curriculumTitles.add(item[0]);
  }
}
const normalizeTitle = (title) => title.split(" / ")[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const providerMaps = [
  ["SUBJECT_CONTENT", SUBJECT_CONTENT],
  ["SUBJECT_CONTENT_EXTRA", SUBJECT_CONTENT_EXTRA],
  ["ENTREPRENEURSHIP_CONTENT", ENTREPRENEURSHIP_CONTENT],
  ["RESEARCH_CONTENT", RESEARCH_CONTENT],
  ["MEDIA_CONTENT", MEDIA_CONTENT],
  ["ARTS_CONTENT", ARTS_CONTENT],
  ["PRACTICAL_CONTENT", PRACTICAL_CONTENT],
  ["AI_CONTENT", AI_CONTENT],
  ["LIFESKILLS_CONTENT", LIFESKILLS_CONTENT],
  ["SPORTS_CONTENT", SPORTS_CONTENT],
  ["MATH_CONTENT", MATH_CONTENT],
  ["LANGUAGES_CONTENT", LANGUAGES_CONTENT],
  ["SCIENCE_CONTENT", SCIENCE_CONTENT],
  ["CORPORATE_CONTENT", CORPORATE_CONTENT],
  ["OFFICE_SKILLS_CONTENT", OFFICE_SKILLS_CONTENT],
  ["EDU_PART_A", EDU_PART_A],
  ["EDU_PART_B", EDU_PART_B],
  ["EDU_PART_C", EDU_PART_C],
  ["EDU_PART_D", EDU_PART_D],
  ["EDU_RICH_B1", EDU_RICH_B1],
  ["EDU_RICH_B2", EDU_RICH_B2],
  ["KW_PART_A", KW_PART_A],
  ["KW_PART_B", KW_PART_B],
  ["KW_PART_C", KW_PART_C],
  ["KW_PART_D", KW_PART_D],
  ["KW_PART_E", KW_PART_E],
  ["KW_PART_F", KW_PART_F],
];
const providerByTitle = new Map();
for (const [provider, map] of providerMaps) {
  for (const title of Object.keys(map || {})) {
    const key = normalizeTitle(title);
    if (!providerByTitle.has(key)) providerByTitle.set(key, provider);
  }
}
for (const title of ["Primary Education", "Time & Calendar", "Fruits", "Vocabulary Building", "Trees & Forests"]) {
  if (!providerByTitle.has(normalizeTitle(title))) providerByTitle.set(normalizeTitle(title), "DEDICATED_COURSE_RENDERER");
}
for (const course of Object.values(FLAGSHIP_COURSES || {})) {
  const title = course?.title?.en || course?.title || course?.id;
  if (title) providerByTitle.set(normalizeTitle(String(title)), "FLAGSHIP_COURSE");
}
const missingExactRegistry = [...curriculumTitles].filter((title) => !keysSeen.has(title) && !keysSeen.has(title.split(" / ")[0]));
const fallbackTitles = [...curriculumTitles].filter((title) => !providerByTitle.has(normalizeTitle(title)));

console.log(`Learning Hub content audit: ${entryCount} registry entries, ${questionCount} quiz questions checked, ${curriculumTitles.size} curriculum titles detected.`);
console.log(`Authored category audit: ${authoredCourseCount} courses and ${authoredTopicCount} topic lessons checked.`);
console.log(`Education/Knowledge World audit: ${compactCourseCount} courses and ${compactTopicCount} topic lessons checked.`);
console.log(`Titles without an exact SUBJECT_CONTENT registry entry: ${missingExactRegistry.length} (some are served by dedicated course providers).`);
console.log(`Titles not matched to an explicit subject registry or authored category map by this static audit: ${fallbackTitles.length}. Review these against dedicated course providers before claiming full subject-specific coverage.`);
if (fallbackTitles.length) console.warn("Provider coverage review: " + fallbackTitles.join("; "));
if (warnings.length) console.warn(warnings.join("\n"));
if (errors.length) {
  console.error(`Content audit failed with ${errors.length} issue(s):\n` + errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All explicit subject-registry entries have required sections and valid quiz answer keys.");
}
