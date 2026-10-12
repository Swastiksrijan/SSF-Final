# SSF Learning Hub — Quality Audit & Acceptance Plan

Date: 2026-10-12
Scope: `src/pages/LearningHubV2.jsx` and the Learning Hub content/course registries. This is a targeted quality audit, not a claim that every subject has already passed a complete curriculum review.

## Confirmed findings from source inspection

1. **Lesson visits were counted as completion.** The generic lesson navigation handler called `markDone(safe)` whenever a learner opened or moved to a lesson. This inflated completion/progress and could misrepresent course completion. The handler has now been changed so navigation does not mark a lesson complete; a learner must use the explicit completion control. The primary-education course continues to receive its existing `onMarkDone` callback.
2. **Generic quick checks are not interactive.** In `PrimaryLessonVisual`, `knowledgeCheck` prompts/options are rendered as text for reflection rather than as selectable answers with feedback. This is a confirmed usability gap for those checks, not evidence that the entire Learning Hub has no assessment functionality; separate course assessment/quiz flows exist.
3. **Fallback content needs coverage review.** The subject registry explicitly says subjects without an exact entry use generated fallback content. Every published subject should be checked against its exact content key so generic fallback is never mistaken for fully subject-specific instruction.
4. **Progress persistence is browser-local in this flow.** The inspected progress handler uses `localStorage`; this does not establish cross-device/server-synced progress.
5. **Content completeness cannot be inferred from topic count.** Registries and module maps contain many subject/topic entries, but each subject still needs a coverage check for explanations, worked examples, guided practice, independent practice, feedback, real-world use, revision, and a meaningful assessment.

## Curriculum acceptance standard

Each subject should be reviewed through these stages, with English and Hindi support appropriate to the learner:
1. Foundation: prerequisites, vocabulary, clear definition and why it matters.
2. Beginner: step-by-step explanation, visuals/analogy where useful, worked examples.
3. Guided practice: scaffolded exercises with answers or feedback.
4. Intermediate: varied examples, misconceptions and error correction.
5. Advanced: deeper concepts, reasoning, comparisons and edge cases.
6. Practical application: authentic task/project and a usable rubric.
7. Assessment: MCQs plus suitable short-answer/performance questions, correct answers, explanations, retry and mastery threshold.
8. Revision/mastery: concise recap, spaced review suggestions, next steps and transparent completion criteria.

Not every subject should use identical question formats: practical skills need performance rubrics; languages need speaking/reading/writing; maths needs worked solutions; safety/health topics need careful, sourced and appropriately qualified guidance.

## Regression and quality gates

- Opening, previewing, or navigating to a lesson must not increment completion.
- Explicitly completing a lesson increments progress once only; reopening it must not double-count.
- Previous/Next and Back navigation must keep the correct lesson and must not strand the learner on a module list.
- A course certificate must depend on genuine course completion and assessment requirements, not merely visiting all lesson screens.
- Each visible subject is mapped to its exact content provider or is clearly labelled as a limited preview; no silent generic fallback for a course advertised as complete.
- Quick checks must let learners answer, receive correct/incorrect feedback and an explanation, and retry where appropriate.
- Verify bilingual rendering, keyboard/mobile usability, persistence, no React child/type errors, and production build.
- Check unrelated routes/pages (especially Primary/Secondary Education, SSF Digital Office and Members Register) for regressions before merging.
- Do not merge to `main` or claim the live website changed until CI/build and deployment results have been checked.

## Work performed on this branch

- Changed generic lesson navigation so it no longer marks a lesson complete automatically.
- Added an explicit “Mark lesson complete / पाठ पूरा चिह्नित करें” control in the generic course lesson panel.
- No changes to `main`; no live deployment performed by this audit branch.

## Remaining work

This branch is the safe starting point for the larger curriculum pass. Interactive question feedback, subject-by-subject coverage mapping, content fact-checking, certificate gating and automated/regression tests still need implementation and verification before this can be considered a complete global-standard learning system.
