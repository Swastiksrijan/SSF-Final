# SSF Learning Hub — Quality Audit & Acceptance Plan

Date: 2026-10-12
Scope: Learning Hub lesson rendering, content-provider registries, assessments, progress and certificate requests. Static checks establish structural coverage; they do not replace a human review of every fact, translation or on-device interaction.

## Confirmed findings and fixes

1. **Lesson visits no longer count as completion.** Opening or navigating between lessons does not mark them done. Learners must use the explicit completion control.
2. **Quick checks are interactive.** Primary lesson renderers, authored category courses and Knowledge World/Master Courses now accept an answer before giving feedback. Correct answers are not shown before the learner checks; verified explanations appear after a correct response, and learners can retry.
3. **Assessment answer keys are not guessed.** Invalid/missing answer keys are excluded from final quiz pools. The Education course builder no longer silently converts a missing answer key to option zero.
4. **Module assessments are rendered for structured courses.** Results are persisted, invalidated when a learner changes answers, and required module IDs are passed into certificate eligibility checks. Each structured module assessment combines its authored bank with validated questions derived from that module’s real lesson summaries and activities; the static audit requires at least five valid, keyed questions per module.
5. **Final assessments can be retried after a fail.** A failed attempt can be changed and resubmitted. Assessment results are versioned so a pass saved by an older assessment implementation cannot automatically unlock a new certificate request.
6. **Practical capstones are available across providers.** Courses without an authored project receive a subject-grounded capstone built from that course’s actual lesson titles, examples and activities. Primary Education includes a bilingual picture-book project.
7. **Certificate request checks are stronger.** The front end requires 100% lesson progress, a current-version passed final assessment and every configured module assessment. The API checks score/total consistency, the minimum passing ratio, the assessment version, and required module results. Issuance remains an SSF admin-reviewed action; this prevents a learner from claiming an issued certificate directly.
8. **Progress is still browser-local in this flow.** `localStorage` preserves progress on the same browser/device; it does not establish server-synced or cross-device progress. The API’s score checks are consistency checks, not cryptographic proof that client-side progress cannot be tampered with.

## Static audit coverage

The repeatable `npm run audit:learning-hub` check currently validates:
- 154 explicit subject-registry entries and 483 quiz questions.
- 108 authored-category courses and 651 topic lessons after subject-grounded applied-practice expansion.
- 45 Education / Knowledge World courses and 587 topic lessons.
- 41 flagship / English-from-basics assessment-bank questions.
- 5 structured courses, 38 lessons after depth expansion and 17 module-assessment banks (including assessed practical modules added to short courses); every rendered structured module assessment must contain at least five validated questions.
- 9 source-level regression guards for lesson navigation, interactive checks, certificate eligibility and server-side required-module validation.
- Placeholder-copy scan across explicit subject registries, authored category maps, compact Education/Knowledge World maps and structured courses.

The curriculum inventory detected 243 titles. The static provider map matched all 243 to an explicit registry or authored provider; 109 do not have an exact `SUBJECT_CONTENT` key because they are supplied through other dedicated course providers. These are registry/provider counts, not a claim that 243 unique courses have each passed human pedagogical or factual review.

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

## Release status

The latest PR build, certificate-validation unit tests, static content audit and production bundle build pass on the audit branch. The Vercel preview deployment is protected and the connected Vercel tool currently returns 403 authorization errors, so a real browser/mobile smoke test could not be completed from this session. The changes remain isolated in draft PR #94; production/main has not been changed. Do not treat the Learning Hub as fully released until an authorized person verifies the preview on desktop/mobile and approves merging.

## Regression and quality gates

- Opening, previewing, or navigating to a lesson must not increment completion.
- Explicitly completing a lesson increments progress once only; reopening it must not double-count.
- Previous/Next and Back navigation must keep the correct lesson and must not strand the learner on a module list.
- Certificate requests require 100% lesson completion, a current-version passed final assessment and all configured module assessments. SSF admin review remains required for issuance.
- Each visible subject maps to an explicit content provider in the static inventory; any remaining semantic fallback must be clearly labelled and reviewed.
- Quick checks must allow an answer, feedback, explanation where supplied, and retry.
- Verify bilingual rendering, keyboard/mobile usability, progress persistence, no React child/type errors, and production build.
- Check unrelated routes/pages (especially Primary/Secondary Education, SSF Digital Office and Members Register) for regressions before merging.
- Do not merge to `main` or claim the live website changed until CI/build and deployment results have been checked.

## Work performed on this branch

- Fixed lesson auto-completion on navigation and added explicit completion controls.
- Made quick checks interactive in primary, authored-category and Knowledge World/Master Course lesson renderers.
- Corrected retry behavior for failed final/mastery assessments and versioned current assessment results.
- Added module assessment UI for structured courses and tied recorded results to certificate eligibility.
- Added subject-grounded practical projects for authored-category, Education, Knowledge World and structured courses; short authored courses are extended to at least three modules/five lessons using real topic examples and activities; short structured courses receive an assessed practical module; added a bilingual Primary Education capstone.
- Removed guessed answer-key defaults from the Education course builder.
- Added server-side score/version consistency checks for certificate requests and five Node test cases.
- Added `npm run audit:learning-hub` to validate content sections, lesson examples/activities, answer keys, provider coverage, projects and assessment banks.
- Added a PR workflow that runs certificate tests, the content audit and a production build.
- Kept all changes on `audit/learning-hub-quality-fixes`; `main` and production have not been changed by this branch.

## Remaining validation before release

- Latest CI run passed at commit `82200ab581c55225307ed33719df142a0f5b2aaa`: locked dependency install, certificate validation unit tests, content audit, and production build all succeeded.
- Actual browser/mobile smoke tests for course opening, Back/Next, completion persistence, final/module assessment retries and certificate eligibility are still blocked. Vercel reports the branch preview is READY, but the connected Vercel integration denies preview access with HTTP 403; authorize the SSF-Final project/team in the Vercel connection, then run these tests before release.
- Review bilingual accuracy, subject-specific facts and answer explanations with a human educator; static checks cannot certify pedagogical quality.
- Confirm the existing progress-storage limitation and certificate API trust model are acceptable before claiming a tamper-proof or cross-device learning record.
- Merge/deploy only after these release gates pass. No live deployment has been performed by this audit branch.
