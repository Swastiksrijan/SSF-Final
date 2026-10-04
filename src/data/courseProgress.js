/**
 * Shared progress helpers for the hand-authored "Master Courses" (Time &
 * Calendar, Fruits, ...). Progress is stored under the same key the hub cards
 * read: "ssf-learning-course-progress-<subject.id>".
 *
 * Legacy generic courses saved numeric lesson indices; master courses key by
 * chapter id. `readMigratedProgress` maps the old numbers onto chapter ids so a
 * learner keeps their place (and the subject stays in "My Learning").
 */
export function readMigratedProgress(subject, chapterIds) {
  try {
    const raw = JSON.parse(localStorage.getItem("ssf-learning-course-progress-" + subject.id) || "[]");
    if (!Array.isArray(raw)) return [];
    const valid = new Set(chapterIds);
    const migrated = raw.map((x) => {
      if (valid.has(x)) return x;
      const n = typeof x === "number" ? x : (/^\d+$/.test(String(x)) ? Number(x) : NaN);
      return !Number.isNaN(n) && chapterIds[n] ? chapterIds[n] : null;
    }).filter(Boolean);
    return [...new Set(migrated)];
  } catch { return []; }
}
