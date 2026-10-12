import { SUBJECT_CONTENT } from "../src/data/learningHubSubjectContent.js";
import { SUBJECT_CONTENT_EXTRA } from "../src/data/learningSubjectContentExtra.js";
import { LEARNING_CATEGORIES, LEARNING_CATEGORIES_EXTRA } from "../src/data/learningCurriculum.js";

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

const categories = [...Object.values(LEARNING_CATEGORIES || {}), ...Object.values(LEARNING_CATEGORIES_EXTRA || {})];
const curriculumTitles = new Set();
for (const category of categories) {
  for (const item of Array.isArray(category) ? category : []) {
    if (Array.isArray(item) && typeof item[0] === "string") curriculumTitles.add(item[0]);
  }
}
const normalizeTitle = (title) => title.split(" / ")[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const normalizedKeys = new Set([...keysSeen.keys()].map(normalizeTitle));
const missingExactRegistry = [...curriculumTitles].filter((title) => !normalizedKeys.has(normalizeTitle(title)));

console.log(`Learning Hub content audit: ${entryCount} registry entries, ${questionCount} quiz questions checked, ${curriculumTitles.size} curriculum titles detected.`);
console.log(`Exact registry keys missing for ${missingExactRegistry.length} curriculum titles. These may be supplied by dedicated course providers; this is a coverage-review list, not an assertion that they are broken.`);
if (warnings.length) console.warn(warnings.join("\n"));
if (errors.length) {
  console.error(`Content audit failed with ${errors.length} issue(s):\n` + errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All explicit subject-registry entries have required sections and valid quiz answer keys.");
}
