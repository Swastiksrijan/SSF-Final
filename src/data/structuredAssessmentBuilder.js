const MIN_QUESTIONS = 5;
const MAX_QUESTIONS = 10;

const textOf = (value) => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(textOf).filter(Boolean).join(" ");
  if (value && typeof value === "object") return textOf(value.en || value.hi || value.text || "");
  return "";
};

const normalizeQuestion = (item) => {
  if (!item || typeof item !== "object") return null;
  const q = textOf(item.q || item.question || item.prompt);
  const options = Array.isArray(item.options) ? item.options.map(textOf) : [];
  const answer = item.answer;
  if (!q || options.length < 2 || options.some((option) => !option) ||
      !Number.isInteger(answer) || answer < 0 || answer >= options.length) return null;
  if (new Set(options.map((option) => option.toLowerCase())).size !== options.length) return null;
  return { q, options, answer, explain: textOf(item.explain || item.explanation) };
};

const lessonSummary = (lesson) => {
  const c = lesson?.content || {};
  return textOf(c.summary || c.easyExplanation || c.deepUnderstanding || lesson?.objectives?.[0] || lesson?.description);
};
const lessonActivity = (lesson) => {
  const c = lesson?.content || {};
  return textOf((Array.isArray(c.practice) ? c.practice[0] : c.practice) || c.practicalApplication || lesson?.activity || lesson?.practice?.[0]);
};

const makeQuestion = (prompt, correct, distractors, explain, seed) => {
  const options = [];
  for (const option of [correct, ...distractors]) {
    const value = textOf(option);
    if (value && !options.some((existing) => existing.toLowerCase() === value.toLowerCase())) options.push(value.slice(0, 220));
    if (options.length === 4) break;
  }
  const fallback = [
    "Skip the required steps and do not check the result.",
    "Share the result without checking accuracy or safety.",
    "Ignore mistakes instead of reviewing them."
  ];
  for (const option of fallback) {
    if (options.length >= 4) break;
    if (!options.some((existing) => existing.toLowerCase() === option.toLowerCase())) options.push(option);
  }
  if (options.length < 2) return null;
  // Rotate the correct option so it is not always the first choice.
  const answer = seed % options.length;
  const ordered = [...options];
  const correctValue = ordered.shift();
  ordered.splice(answer, 0, correctValue);
  return normalizeQuestion({ q: prompt, options: ordered, answer, explain });
};

/**
 * Combine authored assessment questions with questions grounded in the actual
 * module lesson summaries and activities. Missing question banks are never
 * silently treated as complete; this builder creates transparent, content-
 * anchored checks and validates every answer key before rendering.
 */
export function buildStructuredAssessmentQuestions(module, authoredQuestions = [], maxQuestions = MAX_QUESTIONS) {
  const lessons = Array.isArray(module?.lessons) ? module.lessons : [];
  const raw = [
    ...(Array.isArray(authoredQuestions) ? authoredQuestions : []),
    ...(Array.isArray(module?.assessment?.questions) ? module.assessment.questions : []),
  ];
  const questions = [];
  const seen = new Set();
  const add = (candidate) => {
    const parsed = normalizeQuestion(candidate);
    if (!parsed) return;
    const key = parsed.q.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const optionCount = parsed.options.length;
    const textSeed = [...parsed.q].reduce((sum, character) => sum + character.charCodeAt(0), questions.length + 1);
    const shift = textSeed % optionCount;
    const options = parsed.options.map((_, index) => parsed.options[(index + shift) % optionCount]);
    const answer = (parsed.answer - shift + optionCount) % optionCount;
    questions.push({ ...parsed, options, answer });
  };
  raw.forEach(add);

  const lessonData = lessons.map((lesson) => ({
    title: textOf(lesson?.title),
    summary: lessonSummary(lesson),
    activity: lessonActivity(lesson),
  })).filter((lesson) => lesson.title);

  let seed = questions.length;
  for (const lesson of lessonData) {
    const summaryDistractors = lessonData
      .filter((other) => other.title !== lesson.title)
      .map((other) => other.summary)
      .filter(Boolean);
    if (lesson.summary) {
      add(makeQuestion(
        `“${lesson.title}” का मुख्य विचार क्या है? / What is the key idea in “${lesson.title}”?`,
        lesson.summary,
        summaryDistractors,
        "यह उत्तर इस पाठ के summary/explanation से लिया गया है। / Based on this lesson's authored summary or explanation.",
        seed++
      ));
    }
    const activityDistractors = lessonData
      .filter((other) => other.title !== lesson.title)
      .map((other) => other.activity)
      .filter(Boolean);
    if (lesson.activity) {
      add(makeQuestion(
        `“${lesson.title}” के अभ्यास में कौन-सा कदम सबसे उपयुक्त है? / Which action best matches the practice for “${lesson.title}”?`,
        lesson.activity,
        activityDistractors,
        "यह विकल्प इस पाठ की वास्तविक practice/activity से लिया गया है। / Based on the lesson's authored practice or activity.",
        seed++
      ));
    }
  }

  const moduleTitle = textOf(module?.title) || "इस मॉड्यूल";
  const generalQuestions = [
    {
      q: `“${moduleTitle}” सीखते समय परिणाम की जाँच क्यों करनी चाहिए? / Why review results while learning this module?`,
      correct: "गलतियों को पहचानने, सुधारने और सीख को लागू करने के लिए। / To identify errors, improve, and apply learning.",
      explain: "Review and improvement are part of demonstrated learning.",
    },
    {
      q: `“${moduleTitle}” का अभ्यास पूरा करने के बाद सबसे अच्छा कदम क्या है? / What is the best next step after practice?`,
      correct: "परिणाम दर्ज करें, checklist से जाँचें और एक सुधार करें। / Record the result, check it, and make one improvement.",
      explain: "A checked and improved result demonstrates application, not just recall.",
    },
  ];
  for (const item of generalQuestions) {
    add(makeQuestion(item.q, item.correct, [
      "बिना जाँचे काम जमा कर देना। / Submit without checking.",
      "गलती को अनदेखा करना। / Ignore errors.",
      "स्रोत और संदर्भ जाँचे बिना जानकारी साझा करना। / Share without checking source or context.",
    ], item.explain, seed++));
  }

  return questions.slice(0, Math.max(1, Math.min(MAX_QUESTIONS, maxQuestions)));
}

export { MIN_QUESTIONS, MAX_QUESTIONS };
