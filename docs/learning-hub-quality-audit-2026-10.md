# SSF Learning Hub — Quality Audit & Acceptance Plan

Date: 2026-10-12
Scope: `src/pages/LearningHubV2.jsx` and the Learning Hub content/course registries. This is a targeted quality audit, not a claim that every subject has already passed a complete curriculum review.

## Confirmed findings from source inspection

1. **Lesson visits were counted as completion.** The generic lesson navigation handler called `markDone(safe)` whenever a learner opened or moved to a lesson. This inflated completion/progress and could misrepresent course completion. The handler has now been changed so navigation does not mark a lesson complete; a learner must use the explicit completion control. The primary-education course continues to receive its existing `onMarkDone` callback.
2. **Quick checks needed interactivity.** In `PrimaryLessonVisual`, `knowledgeCheck` prompts/options were initially display-only. The audit branch now makes quick checks selectable in the primary lesson board and the generic lesson detail panel, provides correct/incorrect feedback, shows the correct option and any supplied explanation, and allows retry. The Primary Lesson Fresh renderer no longer reveals the answer before the learner responds. Questions without a usable answer key are explicitly identified rather than assigning a guessed answer.
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
- A course certificate request must depend on genuine 100% course completion and a passed final assessment; the client and existing API both enforce these checks. Module-assessment tracking remains course-dependent and needs full end-to-end verification.
- Each visible subject is mapped to its exact content provider or is clearly labelled as a limited preview; no silent generic fallback for a course advertised as complete.
- Quick checks must let learners answer, receive correct/incorrect feedback and an explanation, and retry where appropriate.
- Verify bilingual rendering, keyboard/mobile usability, persistence, no React child/type errors, and production build.
- Check unrelated routes/pages (especially Primary/Secondary Education, SSF Digital Office and Members Register) for regressions before merging.
- Do not merge to `main` or claim the live website changed until CI/build and deployment results have been checked.

## Work performed on this branch

- Changed generic lesson navigation so it no longer marks a lesson complete automatically and added an explicit completion control.
- Made lesson-level quick checks interactive in the primary lesson board and generic lesson detail panel; feedback reveals the correct option and any supplied explanation after a learner answers.
- Corrected final-assessment pass scoring to use a 70% threshold rather than requiring four correct answers regardless of test length.
- Excluded malformed assessment questions rather than silently assigning option zero as a guessed answer.
- Connected Master Course mastery-test results to persisted final results and certificate eligibility.
- Added front-end certificate-request gating for 100% completion plus a passed final assessment; the existing API independently validates these requirements.
- Added `npm run audit:learning-hub` to validate explicit registry sections and answer-key indices, and wired it into PR CI before the production build.
- Removed the duplicate push trigger from the PR-build workflow to reduce redundant CI runs.
- No changes to `main`; no live deployment performed by this audit branch.

## Remaining work

This is still not a claim that the entire curriculum is finished. Remaining work: run and fix the new registry audit; map every visible subject to its actual content provider; replace shallow generated lessons where they are presented as complete courses; review bilingual accuracy, examples and answer explanations; verify certificate requests for every course type; and perform browser/mobile regression tests for navigation, progress persistence, keyboard use, other website routes and production build. Do not merge to `main` or deploy live until the latest CI run passes and the course flows are tested.
