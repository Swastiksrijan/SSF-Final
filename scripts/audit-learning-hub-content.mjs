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
import { FLAGSHIP_COURSES, FLAGSHIP_COURSE_ASSESSMENTS } from "../src/data/learningHubCourseArchitecture.js";
import { ENGLISH_FROM_BASICS_ASSESSMENTS } from "../src/data/englishFromBasicsContent.js";
import { ALL_STRUCTURED_COURSES, COURSE_ASSESSMENTS } from "../src/data/coursesData.js";
import certificateValidation from "../backend_node/utils/learningCertificateValidation.js";
import { buildAuthoredCourseProject, ensureAuthoredCourseDepth, ensureStructuredCourseDepth } from "../src/data/authoredCourseProject.js";
import { readFileSync } from "node:fs";

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
    if ((content.concepts?.length || 0) < 3 || (content.examples?.length || 0) < 2 || (content.practice?.length || 0) < 2 || (content.quiz?.length || 0) < 3) {
      warnings.push(`${registryName}["${subject}"]: shallow registry section counts; confirm that the dedicated provider supplies the missing depth.`);
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
    for (const [qi, item] of (Array.isArray(course?.mastery) ? course.mastery : []).entries()) {
      const tuple = Array.isArray(item);
      const prompt = tuple ? item[0] : (item?.question || item?.q || item?.prompt);
      const options = tuple ? item[1] : item?.options;
      const answer = tuple ? item[2] : item?.answer;
      const label = `${mapName}["${title}"].mastery[${qi}]`;
      if (typeof prompt !== "string" || !prompt.trim()) errors.push(`${label}: missing final assessment question.`);
      if (!Array.isArray(options) || options.length < 2) errors.push(`${label}: final assessment needs at least two options.`);
      else if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) errors.push(`${label}: final assessment answer key is missing or invalid.`);
    }
    const compactTopics = modules.reduce((n, module) => n + ((Array.isArray(module) ? module[2] : module?.topics)?.length || 0), 0);
    if (modules.length < 3 || compactTopics < 5) warnings.push(`${mapName}["${title}"]: fewer than three modules or five topics.`);
    const project = buildAuthoredCourseProject({ en: title, hi: "" }, course);
    if (!project || !project.objective || !Array.isArray(project.steps) || project.steps.length < 3) {
      errors.push(`${mapName}["${title}"]: no usable subject-specific capstone project.`);
    }
  }
}

const REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE = certificateValidation.REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE;
let structuredCourseCount = 0;
let structuredLessonCount = 0;
let structuredModuleAssessmentCount = 0;
const structuredAssessmentIdsByCourse = {};
for (const [courseId, course] of Object.entries(ALL_STRUCTURED_COURSES || {})) {
  structuredCourseCount += 1;
  if (!course?.title?.en || !course?.title?.hi) errors.push(`ALL_STRUCTURED_COURSES["${courseId}"]: missing bilingual course title.`);
  const preparedCourse = ensureStructuredCourseDepth({ id: courseId, en: course?.title?.en, hi: course?.title?.hi }, course);
  const modules = Array.isArray(preparedCourse?.modules) ? preparedCourse.modules : [];
  if (!modules.length) errors.push(`ALL_STRUCTURED_COURSES["${courseId}"]: no modules.`);
  const bank = COURSE_ASSESSMENTS?.[courseId] || {};
  for (const [mi, module] of modules.entries()) {
    const lessons = Array.isArray(module?.lessons) ? module.lessons : [];
    if (!lessons.length) errors.push(`ALL_STRUCTURED_COURSES["${courseId}"].modules[${mi}]: no lessons.`);
    const questionSource = COURSE_ASSESSMENTS?.[module.id] || bank[module.id] || module.assessment?.questions;
    const questions = Array.isArray(questionSource) ? questionSource : [];
    if (questions.length) {
      structuredModuleAssessmentCount += 1;
      (structuredAssessmentIdsByCourse[courseId] ||= []).push(module.id);
    } else warnings.push(`ALL_STRUCTURED_COURSES["${courseId}"].modules["${module.id}"]: no module assessment bank.`);
    for (const [qi, q] of questions.entries()) {
      const label = `ALL_STRUCTURED_COURSES["${courseId}"].modules["${module.id}"].assessment[${qi}]`;
      const prompt = q?.q || q?.question || q?.prompt;
      if (typeof prompt !== "string" || !prompt.trim()) errors.push(`${label}: missing question text.`);
      if (!Array.isArray(q?.options) || q.options.length < 2) errors.push(`${label}: at least two options are required.`);
      else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errors.push(`${label}: answer key is missing or invalid.`);
    }
    for (const [li, lesson] of lessons.entries()) {
      structuredLessonCount += 1;
      const label = `ALL_STRUCTURED_COURSES["${courseId}"].modules["${module.id}"].lessons[${li}]`;
      if (!lesson?.title?.en || !lesson?.title?.hi) errors.push(`${label}: missing bilingual lesson title.`);
      if (!(lesson?.content?.easyExplanation || lesson?.content?.deepUnderstanding || lesson?.content?.body)) warnings.push(`${label}: no authored explanation field found.`);
      if (!(Array.isArray(lesson?.content?.examples) && lesson.content.examples.length) && !lesson?.content?.example) warnings.push(`${label}: no authored example field found.`);
    }
  }
  const lessonCount = modules.reduce((n, module) => n + (module?.lessons?.length || 0), 0);
  if (modules.length < 3 || lessonCount < 5) warnings.push(`ALL_STRUCTURED_COURSES["${courseId}"]: fewer than three modules or five lessons.`);
  const project = buildAuthoredCourseProject({ en: course?.title?.en || courseId, hi: course?.title?.hi || "" }, preparedCourse);
  if (!project || !project.objective || !Array.isArray(project.steps) || project.steps.length < 3) errors.push(`ALL_STRUCTURED_COURSES["${courseId}"]: no usable practical capstone project.`);
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
    const preparedCourse = ensureAuthoredCourseDepth({ en: title, hi: "" }, course);
    const modules = Array.isArray(preparedCourse?.modules) ? preparedCourse.modules : [];
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
    for (const [qi, item] of (Array.isArray(preparedCourse?.mastery) ? preparedCourse.mastery : []).entries()) {
      const tuple = Array.isArray(item);
      const prompt = tuple ? item[0] : (item?.question || item?.q || item?.prompt);
      const options = tuple ? item[1] : item?.options;
      const answer = tuple ? item[2] : item?.answer;
      const label = `${mapName}["${title}"].mastery[${qi}]`;
      if (typeof prompt !== "string" || !prompt.trim()) errors.push(`${label}: missing final assessment question.`);
      if (!Array.isArray(options) || options.length < 2) errors.push(`${label}: final assessment needs at least two options.`);
      else if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) errors.push(`${label}: final assessment answer key is missing or invalid.`);
    }
    const authoredTopics = modules.reduce((n, module) => n + (module?.topics?.length || 0), 0);
    if (modules.length < 3 || authoredTopics < 5) warnings.push(`${mapName}["${title}"]: fewer than three modules or five topics.`);
    const project = buildAuthoredCourseProject({ en: title, hi: "", intro: preparedCourse?.tagline }, preparedCourse);
    if (!project || !project.objective || !Array.isArray(project.steps) || project.steps.length < 3) {
      errors.push(`${mapName}["${title}"]: no usable subject-specific capstone project.`);
    }
    const masteryQuestions = Array.isArray(preparedCourse?.mastery) ? preparedCourse.mastery.length : 0;
    const topicQuestions = modules.reduce((n, module) => n + (module?.topics?.length || 0), 0);
    if (masteryQuestions + topicQuestions < 5) warnings.push(`${mapName}["${title}"]: fewer than five potential final assessment questions.`);
  }
}

const explicitAssessmentMaps = [
  ["FLAGSHIP_COURSE_ASSESSMENTS", FLAGSHIP_COURSE_ASSESSMENTS],
  ["ENGLISH_FROM_BASICS_ASSESSMENTS", ENGLISH_FROM_BASICS_ASSESSMENTS],
];
let explicitAssessmentCount = 0;
for (const [mapName, map] of explicitAssessmentMaps) {
  for (const [moduleId, questions] of Object.entries(map || {})) {
    for (const [qi, q] of (Array.isArray(questions) ? questions : []).entries()) {
      explicitAssessmentCount += 1;
      const label = `${mapName}["${moduleId}"][${qi}]`;
      const prompt = q?.q || q?.question || q?.prompt;
      if (typeof prompt !== "string" || !prompt.trim()) errors.push(`${label}: missing question text.`);
      if (!Array.isArray(q?.options) || q.options.length < 2) errors.push(`${label}: at least two options are required.`);
      else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errors.push(`${label}: answer key is missing or invalid.`);
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
const courseIdsWithAssessments = new Set([...Object.keys(structuredAssessmentIdsByCourse), ...Object.keys(REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE || {})]);
for (const courseId of courseIdsWithAssessments) {
  const actualIds = [...(structuredAssessmentIdsByCourse[courseId] || [])].sort();
  const requiredIds = [...(REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE[courseId] || [])].sort();
  if (actualIds.length !== requiredIds.length || actualIds.some((id, index) => id !== requiredIds[index])) {
    errors.push(`Server-required module assessment IDs do not match the course assessment banks for "${courseId}". Expected [${actualIds.join(", ")}], configured [${requiredIds.join(", ")}].`);
  }
}
for (const [courseId, requiredIds] of Object.entries(REQUIRED_MODULE_ASSESSMENT_IDS_BY_COURSE || {})) {
  if (!ALL_STRUCTURED_COURSES?.[courseId]) errors.push(`Server certificate assessment map references unknown course "${courseId}".`);
  for (const moduleId of requiredIds) {
    const preparedCourse = ensureStructuredCourseDepth({ id: courseId }, ALL_STRUCTURED_COURSES?.[courseId]);
    const preparedModule = preparedCourse?.modules?.find((module) => module.id === moduleId);
    const questions = COURSE_ASSESSMENTS?.[moduleId] || COURSE_ASSESSMENTS?.[courseId]?.[moduleId] || preparedModule?.assessment?.questions;
    if (!Array.isArray(questions) || !questions.length) {
      errors.push(`Server certificate assessment map references missing question bank "${courseId}/${moduleId}".`);
    }
  }
}

const sourceChecks = [
  ["src/pages/LearningHubV2.jsx", [
    ["lesson navigation does not auto-complete", /const goLesson = \(nextIndex\) => \{[\s\S]*?Opening or navigating to a lesson is not proof that the learner completed it\./],
    ["final assessment is versioned", /assessmentVersion: "v2"/],
    ["required structured module assessments are passed to certificate gate", /requiredModuleAssessmentIds=\{moduleAssessments\.map\(\(m\) => m\.id\)\}/],
  ]],
  ["src/components/learning/MasterCourse.jsx", [
    ["lesson-level Quick Check is interactive", /function QuickCheck\(\{ b \}\)/],
    ["Quick Check block is rendered", /case "quiz":[\s\S]*?return <QuickCheck b=\{b\} \/>/],
    ["final assessment uses current result version", /assessmentVersion: "v2"/],
  ]],
  ["src/components/learning/CourseCertificate.jsx", [
    ["certificate requires full progress and current passed final assessment", /progress >= 100 && finalResult\?\.passed === true && finalResult\?\.assessmentVersion === "v2"/],
    ["certificate request sends required assessment IDs", /requiredModuleAssessmentIds: requiredIds/],
  ]],
  ["backend_node/routes/learningCertificateRoutes.js", [
    ["certificate API uses server-side assessment validator", /validateCertificateAssessments\(\{ courseId, moduleAssessments, requiredModuleAssessmentIds, finalAssessment \}\)/],
  ]],
];
for (const [file, checks] of sourceChecks) {
  let source = "";
  try { source = readFileSync(new URL("../" + file, import.meta.url), "utf8"); }
  catch { errors.push(`Source regression check could not read ${file}.`); continue; }
  for (const [label, pattern] of checks) {
    if (!pattern.test(source)) errors.push(`${file}: regression guard failed — ${label}.`);
  }
}

const placeholderPattern = /\b(?:coming soon|placeholder|lorem ipsum|detailed lessons will be added|content will be added|under construction|coming shortly)\b/i;
function scanForPlaceholder(value, location) {
  if (typeof value === "string") {
    if (placeholderPattern.test(value)) errors.push(`${location}: placeholder-like copy found: "${value.slice(0, 100)}".`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForPlaceholder(item, `${location}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) scanForPlaceholder(item, `${location}.${key}`);
  }
}
for (const [registryName, registry] of registries) {
  for (const [title, content] of Object.entries(registry || {})) scanForPlaceholder(content, `${registryName}["${title}"]`);
}
for (const [mapName, map] of authoredMaps) {
  for (const [title, content] of Object.entries(map || {})) scanForPlaceholder(content, `${mapName}["${title}"]`);
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
console.log(`Explicit flagship/English assessment banks: ${explicitAssessmentCount} questions checked.`);
console.log(`Structured courses: ${structuredCourseCount} courses, ${structuredLessonCount} lessons, and ${structuredModuleAssessmentCount} modules with assessment banks checked.`);
console.log(`Source regression guards: ${sourceChecks.reduce((n, item) => n + item[1].length, 0)} navigation, quiz, certificate and API checks.`);
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
