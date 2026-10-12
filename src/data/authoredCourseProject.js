/**
 * Build a course-specific capstone project for authored subject courses that
 * do not yet define one explicitly. The project is anchored to real lesson
 * titles, examples and activities; it never substitutes a generic placeholder
 * for subject content.
 */
export function buildAuthoredCourseProject(subject, content) {
  if (content?.project?.objective && Array.isArray(content.project.steps) && content.project.steps.length >= 3) {
    return content.project;
  }

  const topics = (content?.modules || []).flatMap((module) => {
    if (Array.isArray(module)) return Array.isArray(module[2]) ? module[2] : [];
    if (Array.isArray(module?.topics)) return module.topics;
    return Array.isArray(module?.lessons) ? module.lessons : [];
  });
  if (!topics.length) return null;

  const get = (topic, field) => {
    if (Array.isArray(topic)) {
      return ({ title: topic[0], learn: topic[1], example: topic[2], activity: topic[3] })[field];
    }
    if (field === "title") return typeof topic?.title === "object" ? (topic.title.en || topic.title.hi) : topic?.title;
    if (field === "learn") return topic?.learn || topic?.body || topic?.content?.easyExplanation || topic?.content?.deepUnderstanding || topic?.content?.summary;
    if (field === "example") return topic?.example || topic?.examples?.[0] || topic?.content?.examples?.[0] || topic?.content?.example;
    if (field === "activity") return topic?.activity || topic?.content?.activity || topic?.content?.practicalApplication || topic?.practice?.[0] || topic?.content?.practice?.[0];
    return topic?.[field];
  };
  const first = topics[0];
  const middle = topics[Math.floor((topics.length - 1) / 2)] || first;
  const last = topics[topics.length - 1];
  const firstTitle = String(get(first, "title") || "पहला पाठ");
  const middleTitle = String(get(middle, "title") || "मुख्य अवधारणा");
  const lastTitle = String(get(last, "title") || "अंतिम पाठ");
  const firstLearn = String(get(first, "learn") || "");
  const firstExample = String(get(first, "example") || firstLearn);
  const lastActivity = String(get(last, "activity") || get(last, "example") || "");
  const en = subject?.en || "इस विषय";
  const hi = subject?.hi || "";
  const courseName = hi ? en + " / " + hi : en;

  return {
    objective: courseName + ": “" + lastTitle + "” को वास्तविक काम में लागू करें / Apply the final topic in a practical task",
    materials: "Notebook or phone/computer as appropriate, the examples from “" + firstTitle + "”, and a simple record sheet / कॉपी या उपलब्ध device और अभ्यास के लिए एक record sheet।",
    observation: "पहले और बाद के परिणाम लिखें; देखें कि “" + middleTitle + "” और “" + lastTitle + "” से आपका काम कैसे बेहतर हुआ।",
    steps: [
      "एक वास्तविक समस्या या काम चुनें जो “" + firstTitle + "” से जुड़ा हो। / Choose a real task related to the first lesson.",
      "इस उदाहरण को समझें और अपने शब्दों में मुख्य concept लिखें: " + firstExample.slice(0, 260),
      "आखिरी topic का activity पूरा करें: “" + lastTitle + "” — " + lastActivity.slice(0, 260),
      "अपना output, steps और result लिखें या सुरक्षित करें; जरूरत हो तो screenshot/table/drawing जोड़ें।",
      "Checklist से जाँचें: सही जानकारी, साफ़ प्रस्तुति, सुरक्षा/नैतिकता जहाँ लागू हो, और कोई सुधार।",
      "एक छोटा सुधार करके final version बनाएँ और बताएं कि यह skill वास्तविक जीवन में कहाँ उपयोग होगी।"
    ],
    result: "एक छोटा, जाँचने योग्य subject-specific output: " + courseName + " में चुना गया काम, उसका record और सुधार का प्रमाण।",
    reflection: "कौन-सा concept सबसे उपयोगी रहा? किस गलती को सुधारा? अगली बार क्या बेहतर करेंगे? / What did you learn and what would you improve next?"
  };
}
