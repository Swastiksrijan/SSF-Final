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

/**
 * Ensure a short authored micro-course has at least three learning stages and
 * five lessons. Added lessons are anchored to its actual first/last topics,
 * activities and examples rather than a generic placeholder.
 */
export function ensureAuthoredCourseDepth(subject, content) {
  if (!content || !Array.isArray(content.modules) || !content.modules.length) return content;
  const modules = content.modules.map((module) => ({
    ...module,
    topics: Array.isArray(module?.topics) ? [...module.topics] : [],
  }));
  const topicCount = () => modules.reduce((n, module) => n + module.topics.length, 0);
  const allTopics = () => modules.flatMap((module) => module.topics);
  const first = allTopics()[0];
  const last = allTopics()[allTopics().length - 1] || first;
  if (!first || !last) return { ...content, modules };

  const generatedTopics = [];
  while (topicCount() + generatedTopics.length < 5) {
    const n = generatedTopics.length;
    const title = n === 0
      ? "Applied Practice / व्यवहार में उपयोग"
      : "Review & Teach Others / पुनरावृत्ति और सिखाएँ";
    const lastTitle = String(last.title || "मुख्य विषय");
    const firstTitle = String(first.title || "पहला पाठ");
    const activity = String(last.activity || last.example || "विषय का अभ्यास करें।");
    const example = String(first.example || first.learn || "");
    const correctAction = "पूरा अभ्यास करें, परिणाम जाँचें और एक सुधार लिखें";
    generatedTopics.push({
      title,
      learn: "अब “" + firstTitle + "” की मूल समझ को “" + lastTitle + "” के साथ जोड़कर वास्तविक परिस्थिति में लागू करें। केवल उत्तर याद न करें—अपना तरीका, परिणाम और सुधार भी दर्ज करें।",
      example: "शुरुआत का उदाहरण: " + example.slice(0, 180) + " अंतिम अभ्यास: " + activity.slice(0, 180),
      activity: activity + " इसके बाद अपना परिणाम जाँचें और एक सुधार लिखें।",
      quiz: {
        q: "“" + lastTitle + "” का अभ्यास पूरा करने के बाद सबसे अच्छा अगला कदम क्या है?",
        options: [correctAction, "बिना जाँचे परिणाम साझा करना", "अभ्यास छोड़कर अनुमान लगाना", "गलती मिलने पर उसे अनदेखा करना"],
        answer: 0,
        explain: "विषय-विशिष्ट गतिविधि पूरी करके परिणाम जाँचना और सुधार लिखना वास्तविक कौशल को मजबूत करता है।",
      },
    });
  }

  while (modules.length < 3) {
    if (generatedTopics.length) {
      const topic = generatedTopics.shift();
      modules.push({
        title: "Applied Practice / व्यावहारिक अभ्यास",
        summary: "सीखे गए concepts को वास्तविक task में लागू करें और परिणाम जाँचें।",
        topics: [topic],
      });
      continue;
    }
    const donorIndex = modules.reduce((best, module, index, list) =>
      module.topics.length > (list[best]?.topics.length || 0) ? index : best, 0);
    if (modules[donorIndex]?.topics.length > 1) {
      const topic = modules[donorIndex].topics.pop();
      modules.push({
        title: "Practice & Review / अभ्यास और पुनरावृत्ति",
        summary: "मुख्य कौशल का अभ्यास, जाँच और सुधार।",
        topics: [topic],
      });
    } else {
      break;
    }
  }

  if (generatedTopics.length) {
    const practiceModule = modules.find((module) => /Applied Practice|Practice & Review/.test(module.title));
    (practiceModule || modules[modules.length - 1]).topics.push(...generatedTopics);
  }
  return { ...content, modules };
}
