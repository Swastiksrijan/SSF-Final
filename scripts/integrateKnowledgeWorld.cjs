const fs = require("fs");
const p = "src/pages/LearningHubV2.jsx";
let c = fs.readFileSync(p, "utf8");
const imp = 'import { KNOWLEDGE_WORLD_TOPICS } from "../data/knowledgeWorldContent";';
if (!c.includes(imp)) {
  const marker = 'import { ENGLISH_FROM_BASICS_COURSE, ENGLISH_FROM_BASICS_ASSESSMENTS } from "../data/englishFromBasicsContent";';
  c = c.replace(marker, marker + "\n" + imp);
}
if (!c.includes("...KNOWLEDGE_WORLD_TOPICS")) {
  const start = c.indexOf("const TOPICS = [");
  const end = c.indexOf("\n];\n\nconst getSubjectProfile", start);
  if (start >= 0 && end >= 0) c = c.slice(0,end) + "\n  ...KNOWLEDGE_WORLD_TOPICS," + c.slice(end);
}
if (!c.includes('"Knowledge World / ज्ञान संसार"')) {
  const marker = '  "NGO, Project & Grant Learning / NGO, परियोजना एवं अनुदान": { key:"community", icon:FaBookOpen, color:"from-[#003049] to-[#669bbc]" }';
  c = c.replace(marker, marker + ',\n  "Knowledge World / ज्ञान संसार": { key:"community", icon:FaBookOpen, color:"from-[#1d3557] to-[#457b9d]" }');
}
fs.writeFileSync(p, c);
