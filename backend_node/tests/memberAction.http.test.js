// Integration test: the member / office-bearer notice & disciplinary workflow.
//
// Exercises the real router (member lookup, notice numbering, issue, reply,
// hearing, committee review, General Body review, final order and the guarded
// export shape) against an in-memory Postgres (pg-mem) — nothing is mocked.
//
//   node backend_node/tests/memberAction.http.test.js
process.env.NODE_ENV = 'test';
process.env.ADMIN_PORTAL_TOKEN = 'test-token';

const { newDb } = require('pg-mem');
const mem = newDb();
mem.public.registerEnum('enum_MemberActions_actionScope', ['membership_review', 'office_bearer_role_review']);
mem.public.registerEnum('enum_MemberActions_status', ['draft', 'notice_issued', 'reply_received', 'hearing_scheduled', 'committee_review', 'general_body_review', 'closed']);
mem.public.registerEnum('enum_Members_status', ['pending', 'changes_requested', 'approved', 'rejected']);
mem.public.registerEnum('enum_Members_paymentStatus', ['not_required', 'pending', 'paid', 'failed']);
// pg-mem has no native hashtext()/pg_advisory_xact_lock(); the numbering routine
// uses them for a per-FY lock. Provide a stand-in hash and swallow the lock so
// the real numbering code path still runs.
mem.public.registerFunction({ name: 'hashtext', args: ['text'], returns: 'integer', implementation: (s) => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) | 0; return h; } });
let rewritingDonors = false;
mem.public.interceptQueries((sql) => {
  if (/pg_advisory_xact_lock/i.test(sql)) return [];
  if (sql.includes('pg_enum') && /typname='enum_/.test(sql)) return [];
  if (/DROP TYPE IF EXISTS "public"\."enum_/.test(sql)) return [];
  if (!rewritingDonors && /CREATE TABLE IF NOT EXISTS "Donors"/.test(sql)) {
    rewritingDonors = true;
    try { mem.public.none(sql.replace(/DECIMAL\(12,2\)/g, 'NUMERIC(12,2)')); } finally { rewritingDonors = false; }
    return [];
  }
  return null;
});
const pgAdapter = mem.adapters.createPg();
const realPgPath = require.resolve('pg');
require(realPgPath);
require.cache[realPgPath].exports = { ...require.cache[realPgPath].exports, Client: pgAdapter.Client, Pool: pgAdapter.Pool };

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`  \u2713 ${name}`); }
  else { fail += 1; console.log(`  \u2717 ${name} ${extra}`); }
};

async function main() {
  const express = require('express');
  const { sequelize } = require('../models/social');
  const Member = require('../models/Member');
  require('../models/MemberAction');
  await sequelize.sync({ force: true });

  // A real registered member to look up (mirrors the offline register shape).
  await Member.create({ fullName: 'Ramesh Pandey', email: 'ramesh@example.com', phone: '9718346691', memberType: 'general', status: 'approved', paymentStatus: 'paid', memberId: 'SSF-MBR-00001', designation: 'President' });

  const app = express();
  app.use(express.json());
  // The mailer is replaced so the email path is exercised without a live SMTP
  // server: the first call succeeds, the second throws (to prove a mail failure
  // never rolls back the notice). Everything else is the real router.
  const mailerPath = require.resolve('../services/mailer');
  require(mailerPath);
  const mailCalls = [];
  let mailShouldFail = false;
  require.cache[mailerPath].exports = {
    emailConfigured: () => true,
    sendMail: async (opts) => { mailCalls.push(opts); if (mailShouldFail) throw new Error('simulated SMTP outage'); return { ok: true, provider: 'test' }; },
  };
  app.use('/api', require('../routes/memberActionRoutes'));
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const auth = { Authorization: 'Bearer test-token' };
  const json = (p, h = {}) => fetch(base + p, { headers: h }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  const send = (p, method, body, h = {}) => fetch(base + p, { method, headers: { 'Content-Type': 'application/json', ...h }, body: body ? JSON.stringify(body) : undefined }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }));
  const future = () => new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

  try {
    console.log('\nAccess control:');
    ok('register list requires admin auth', (await json('/api/admin/member-actions')).status === 401);
    ok('member lookup requires admin auth', (await json('/api/admin/member-actions/member-lookup?email=x@y.z')).status === 401);
    ok('a bogus admin path 404s', (await json('/api/admin/member-actions-nope', auth)).status === 404);

    console.log('\nMember lookup:');
    const lookupEmpty = await json('/api/admin/member-actions/member-lookup', auth);
    ok('lookup without any key is rejected', lookupEmpty.status === 400, JSON.stringify(lookupEmpty.body));
    const byEmail = await json('/api/admin/member-actions/member-lookup?email=ramesh@example.com', auth);
    ok('lookup by email finds the member', byEmail.body.matches?.length === 1 && byEmail.body.matches[0].memberId === 'SSF-MBR-00001', JSON.stringify(byEmail.body));
    const byPhone = await json('/api/admin/member-actions/member-lookup?phone=9718346691', auth);
    ok('lookup by 10-digit phone finds the member', byPhone.body.matches?.[0]?.memberId === 'SSF-MBR-00001', JSON.stringify(byPhone.body));
    const byName = await json('/api/admin/member-actions/member-lookup?name=ramesh', auth);
    ok('lookup by name fragment finds the member', byName.body.matches?.some((m) => m.memberId === 'SSF-MBR-00001'));
    const noMatch = await json('/api/admin/member-actions/member-lookup?email=nobody@example.com', auth);
    ok('an unknown email returns no match (never a guessed ID)', noMatch.body.matches?.length === 0, JSON.stringify(noMatch.body));

    console.log('\nDraft creation and automatic reference number:');
    const badDraft = await send('/api/admin/member-actions', 'POST', { personName: 'X' }, auth);
    ok('an incomplete draft is rejected', badDraft.status === 400, JSON.stringify(badDraft.body));
    const pastDue = await send('/api/admin/member-actions', 'POST', { personName: 'Ramesh Pandey', email: 'ramesh@example.com', actionScope: 'membership_review', bylawClause: 'Rule 8', grounds: 'g', factualSummary: 'f', replyDueAt: new Date(Date.now() - 1000).toISOString() }, auth);
    ok('a past reply deadline is rejected', pastDue.status === 400, JSON.stringify(pastDue.body));
    const draft1 = await send('/api/admin/member-actions', 'POST', { personName: 'Ramesh Pandey', email: 'ramesh@example.com', phone: '9718346691', memberId: 'SSF-MBR-00001', actionScope: 'membership_review', bylawClause: 'Rule 8', grounds: 'Repeated breach', factualSummary: 'Recorded facts', replyDueAt: future() }, auth);
    ok('a valid draft is created', draft1.status === 201, JSON.stringify(draft1.body));
    ok('the draft gets an automatic reference number', /^SSF\/NOTICE\/\d{4}-\d{2}\/0001$/.test(draft1.body.noticeReference || ''), draft1.body.noticeReference);
    ok('a new draft starts in status draft', draft1.body.status === 'draft');
    const draft2 = await send('/api/admin/member-actions', 'POST', { personName: 'Second Person', email: 'second@example.com', actionScope: 'office_bearer_role_review', bylawClause: 'Rule 12', grounds: 'g2', factualSummary: 'f2', replyDueAt: future() }, auth);
    ok('the next draft increments the reference', /0002$/.test(draft2.body.noticeReference || ''), draft2.body.noticeReference);

    console.log('\nIssuing the notice:');
    const noMethod = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'issue_notice', dispatchMethod: 'telepathy' }, auth);
    ok('an invalid dispatch method is rejected', noMethod.status === 400, JSON.stringify(noMethod.body));
    const postNoRef = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'issue_notice', dispatchMethod: 'registered_post' }, auth);
    ok('a post method needs a dispatch reference', postNoRef.status === 400, JSON.stringify(postNoRef.body));
    const issued = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'issue_notice', dispatchMethod: 'hand_delivery', dispatchReference: 'Signed receipt 12' }, auth);
    ok('issuing by hand delivery succeeds', issued.status === 200, JSON.stringify(issued.body));
    ok('issuing returns the member response link', typeof issued.body.responseUrl === 'string' && issued.body.responseUrl.includes('/Members?notice='), issued.body.responseUrl);
    ok('the record is now notice_issued', issued.body.record?.status === 'notice_issued');
    ok('the issued copy is stored on the record', typeof issued.body.record?.noticeText === 'string' && issued.body.record.noticeText.includes('कारण बताओ नोटिस'));
    const reIssue = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'issue_notice', dispatchMethod: 'hand_delivery', dispatchReference: 'again' }, auth);
    ok('an already-issued notice cannot be re-issued', reIssue.status === 409, JSON.stringify(reIssue.body));

    console.log('\nEmail dispatch (a mail outage must leave the draft retryable):');
    const emailDraft = await send('/api/admin/member-actions', 'POST', { personName: 'Email Test', email: 'email.test@example.com', actionScope: 'membership_review', bylawClause: 'Rule 9', grounds: 'g', factualSummary: 'f', replyDueAt: future() }, auth);
    const emailSent = await send(`/api/admin/member-actions/${emailDraft.body.id}`, 'PATCH', { action: 'issue_notice', dispatchMethod: 'email' }, auth);
    ok('an email notice is issued', emailSent.status === 200, JSON.stringify(emailSent.body));
    ok('the notice was actually handed to the mailer', mailCalls.length === 1 && mailCalls[0].to === 'email.test@example.com', JSON.stringify(mailCalls.map((c) => c.to)));
    ok('the email body carries the notice reference', mailCalls[0].subject.includes(emailSent.body.record.noticeReference), mailCalls[0].subject);
    ok('the email body carries the response link', String(mailCalls[0].html).includes('/Members?notice='), 'html');
    ok('the delivery status is email_sent', emailSent.body.record.emailDeliveryStatus === 'email_sent', emailSent.body.record.emailDeliveryStatus);

    const failDraft = await send('/api/admin/member-actions', 'POST', { personName: 'Mail Fail', email: 'mail.fail@example.com', actionScope: 'membership_review', bylawClause: 'Rule 9', grounds: 'g', factualSummary: 'f', replyDueAt: future() }, auth);
    mailShouldFail = true;
    const failIssue = await send(`/api/admin/member-actions/${failDraft.body.id}`, 'PATCH', { action: 'issue_notice', dispatchMethod: 'email' }, auth);
    mailShouldFail = false;
    ok('a mail outage returns 502 and does not issue the notice', failIssue.status === 502, JSON.stringify(failIssue.body));
    ok('the failure explains that email delivery must be fixed before issuing', String(failIssue.body.message || '').includes('नोटिस जारी नहीं हुआ'), JSON.stringify(failIssue.body));
    const afterMailFailure = await json('/api/admin/member-actions', auth);
    const failedDraft = afterMailFailure.body.find((r) => r.id === failDraft.body.id);
    ok('the record remains a retryable draft', failedDraft?.status === 'draft', JSON.stringify(failedDraft));
    ok('the delivery status records the failure', failedDraft?.emailDeliveryStatus === 'email_failed', failedDraft?.emailDeliveryStatus);
    const refParts = String(failedDraft?.noticeReference || '').split('/');
    ok('the reference number survives the outage', refParts.length === 4 && refParts[0] === 'SSF' && refParts[1] === 'NOTICE' && refParts[2].length === 7 && refParts[3].length === 4 && !Number.isNaN(Number(refParts[3])), failedDraft?.noticeReference);
    ok('a response link is not activated when email delivery fails', !failedDraft?.responseUrl && !failedDraft?.responseTokenHash, JSON.stringify(failedDraft));

    console.log('\nMember reply (public token):');
    const token = issued.body.responseUrl.split('notice=')[1];
    const wrongToken = await json('/api/member-action-response/not-a-real-token');
    ok('a bogus response token 404s', wrongToken.status === 404, JSON.stringify(wrongToken.body));
    const noticeView = await json(`/api/member-action-response/${token}`);
    ok('the member can open the notice via the token', noticeView.status === 200 && noticeView.body.personName === 'Ramesh Pandey', JSON.stringify(noticeView.body));
    const shortReply = await send(`/api/member-action-response/${token}`, 'POST', { replyText: 'too short' });
    ok('a reply shorter than 20 chars is rejected', shortReply.status === 400, JSON.stringify(shortReply.body));
    const reply = await send(`/api/member-action-response/${token}`, 'POST', { replyText: 'मैं अपना पक्ष प्रस्तुत करता हूँ और सभी तथ्यों का खंडन करता हूँ।' });
    ok('a valid reply is accepted', reply.status === 200, JSON.stringify(reply.body));
    const afterReply = await json(`/api/admin/member-actions`, auth);
    const rowAfterReply = afterReply.body.find((r) => r.id === draft1.body.id);
    ok('the case does NOT auto-close on reply', rowAfterReply.status === 'reply_received', rowAfterReply.status);
    const doubleReply = await send(`/api/member-action-response/${token}`, 'POST', { replyText: 'दूसरा जवाब भेज रहा हूँ जो स्वीकार नहीं होना चाहिए।' });
    ok('a second reply on the same token is refused', doubleReply.status === 404, JSON.stringify(doubleReply.body));

    console.log('\nHearing (records the outcome, stamps completion and emails the member):');
    const hearing = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'hearing', hearingAt: new Date().toISOString(), hearingNotes: 'ऑनलाइन सुनवाई — सदस्य उपस्थित', hearingOutcome: 'सुनवाई पूर्ण हुई; सदस्य का पक्ष सुना गया।' }, auth);
    ok('a hearing is recorded', hearing.status === 200, JSON.stringify(hearing.body));
    ok('the hearing is stamped complete', Boolean(hearing.body.record?.hearingCompletedAt), JSON.stringify(hearing.body.record?.hearingCompletedAt));
    ok('the hearing outcome is stored', String(hearing.body.record?.hearingOutcome || '').includes('सुनवाई पूर्ण'), hearing.body.record?.hearingOutcome);
    ok('the member is emailed the hearing outcome', mailCalls.some((c) => /सुनवाई पूर्ण/.test(c.subject || '')), JSON.stringify(mailCalls.map((c) => c.subject)));
    ok('the email log records the hearing email', Array.isArray(hearing.body.record?.emailLog) && hearing.body.record.emailLog.some((e) => e.stage === 'hearing' && e.status === 'sent'), JSON.stringify(hearing.body.record?.emailLog));

    console.log('\nA hearing mail outage must still keep the record:');
    const hearingFailDraft = await send('/api/admin/member-actions', 'POST', { personName: 'Hearing Fail', email: 'hearing.fail@example.com', actionScope: 'membership_review', bylawClause: 'Rule 9', grounds: 'g', factualSummary: 'f', replyDueAt: future() }, auth);
    mailShouldFail = true;
    const hearingFail = await send(`/api/admin/member-actions/${hearingFailDraft.body.id}`, 'PATCH', { action: 'hearing', hearingAt: new Date().toISOString(), hearingNotes: 'सुनवाई', hearingOutcome: 'पूर्ण' }, auth);
    mailShouldFail = false;
    ok('a hearing is recorded even when its email fails', hearingFail.status === 200 && Boolean(hearingFail.body.record?.hearingCompletedAt), JSON.stringify(hearingFail.body));
    ok('the email outage is surfaced as a warning', typeof hearingFail.body.emailWarning === 'string' && hearingFail.body.emailWarning.length > 0, JSON.stringify(hearingFail.body.emailWarning));
    ok('the failed hearing email is logged', Array.isArray(hearingFail.body.record?.emailLog) && hearingFail.body.record.emailLog.some((e) => e.stage === 'hearing' && e.status === 'failed'), JSON.stringify(hearingFail.body.record?.emailLog));

    console.log('\nCommittee review (must wait for the reply window):');
    const early = await send(`/api/admin/member-actions/${draft2.body.id}`, 'PATCH', { action: 'committee_review', committeeMeetingReference: 'MC/2026/01', decisionText: 'note' }, auth);
    ok('committee review is blocked while a notice is still open', early.status === 409, JSON.stringify(early.body));
    const committee = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'committee_review', committeeMeetingReference: 'MC/2026/01', decisionText: 'समिति ने जवाब पर विचार किया।' }, auth);
    ok('committee review is recorded after the reply', committee.status === 200, JSON.stringify(committee.body));
    ok('the committee minutes are stored separately', committee.body.record?.committeeDecisionText === 'समिति ने जवाब पर विचार किया।' && !committee.body.record?.generalBodyDecisionText, JSON.stringify(committee.body.record));
    ok('the committee review is stamped complete', Boolean(committee.body.record?.committeeReviewCompletedAt));
    ok('the member is emailed the committee proceedings', mailCalls.some((c) => /समिति की कार्यवाही पूर्ण/.test(c.subject || '')), JSON.stringify(mailCalls.map((c) => c.subject)));

    console.log('\nGeneral Body review (only after committee):');
    const gbReview = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'general_body_review', generalBodyMeetingReference: 'GB/2026/01', decisionText: 'gb' }, auth);
    ok('General Body review is allowed after committee review', gbReview.status === 200, JSON.stringify(gbReview.body));
    ok('the General Body minutes are stored separately', gbReview.body.record?.generalBodyDecisionText === 'gb', JSON.stringify(gbReview.body.record));
    ok('the General Body review is stamped complete', Boolean(gbReview.body.record?.generalBodyReviewCompletedAt));
    ok('the member is emailed the General Body proceedings', mailCalls.some((c) => /सामान्य सभा की कार्यवाही पूर्ण/.test(c.subject || '')), JSON.stringify(mailCalls.map((c) => c.subject)));

    console.log('\nFinal order (gated by due process):');
    const wrongType = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'close', decisionType: 'banish', decisionText: 'x' }, auth);
    ok('an unknown decision type is rejected', wrongType.status === 400, JSON.stringify(wrongType.body));
    const termNoGB = await send(`/api/admin/member-actions/${draft2.body.id}`, 'PATCH', { action: 'close', decisionType: 'membership_termination_approved', decisionText: 'remove' }, auth);
    ok('a termination cannot be closed before the full process', termNoGB.status === 409 || termNoGB.status === 400, JSON.stringify(termNoGB.body));
    const close = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'close', decisionType: 'membership_termination_approved', decisionText: 'सदस्यता समाप्ति की पुष्टि।', generalBodyMeetingReference: 'GB/2026/01', committeeMeetingReference: 'MC/2026/01' }, auth);
    ok('the final order is recorded after the full process', close.status === 200, JSON.stringify(close.body));
    ok('the case is now closed', close.body.record?.status === 'closed');
    ok('the decision type is recorded', close.body.record?.decisionType === 'membership_termination_approved');
    ok('the committee minutes survive the close', close.body.record?.committeeDecisionText === 'समिति ने जवाब पर विचार किया।');
    ok('the General Body minutes survive the close', close.body.record?.generalBodyDecisionText === 'gb');
    ok('the member is emailed the final decision', mailCalls.some((c) => /अंतिम निर्णय/.test(c.subject || '')), JSON.stringify(mailCalls.map((c) => c.subject)));
    ok('the email log accumulates every stage', Array.isArray(close.body.record?.emailLog) && ['hearing', 'committee', 'general_body', 'final'].every((st) => close.body.record.emailLog.some((e) => e.stage === st && e.status === 'sent')), JSON.stringify(close.body.record?.emailLog));

    console.log('\nEditing a record (details only; workflow untouched):');
    const editDraft = await send('/api/admin/member-actions', 'POST', { personName: 'Edit Me', email: 'edit.me@example.com', actionScope: 'membership_review', bylawClause: 'Rule 9', grounds: 'old grounds', factualSummary: 'old facts', replyDueAt: future() }, auth);
    const editOk = await send(`/api/admin/member-actions/${editDraft.body.id}`, 'PATCH', { action: 'edit_details', personName: 'Corrected Name', email: 'corrected@example.com', bylawClause: 'Rule 11', grounds: 'corrected grounds', factualSummary: 'corrected facts', noticeText: 'सुधरा हुआ विवरण', replyDueAt: future() }, auth);
    ok('editing details succeeds', editOk.status === 200 && editOk.body.record?.personName === 'Corrected Name', JSON.stringify(editOk.body));
    ok('the corrected fields are stored', editOk.body.record?.bylawClause === 'Rule 11' && editOk.body.record?.email === 'corrected@example.com');
    ok('editing does not change the workflow status', editOk.body.record?.status === 'draft');
    ok('a draft notice text is editable', editOk.body.record?.noticeText === 'सुधरा हुआ विवरण', editOk.body.record?.noticeText);
    ok('the edit is recorded in the activity log', Array.isArray(editOk.body.record?.emailLog) && editOk.body.record.emailLog.some((e) => e.type === 'edit'), JSON.stringify(editOk.body.record?.emailLog));
    const editBad = await send(`/api/admin/member-actions/${editDraft.body.id}`, 'PATCH', { action: 'edit_details', personName: '', email: 'x@y.z', bylawClause: 'r', grounds: 'g', factualSummary: 'f' }, auth);
    ok('an edit missing required fields is rejected', editBad.status === 400, JSON.stringify(editBad.body));
    const editIssued = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'edit_details', personName: 'Ramesh Pandey', email: 'ramesh@example.com', actionScope: 'membership_review', bylawClause: 'Rule 8', grounds: 'corrected', factualSummary: 'corrected', noticeText: 'HACKED TEXT', replyDueAt: future() }, auth);
    ok('a closed record can still be corrected', editIssued.status === 200, JSON.stringify(editIssued.body));
    ok('the issued notice text is NOT editable', !String(editIssued.body.record?.noticeText || '').includes('HACKED TEXT'), editIssued.body.record?.noticeText?.slice(0, 40));
    ok('editing a closed record keeps it closed', editIssued.body.record?.status === 'closed');
    const editScope = await send(`/api/admin/member-actions/${draft1.body.id}`, 'PATCH', { action: 'edit_details', personName: 'Ramesh Pandey', email: 'ramesh@example.com', actionScope: 'office_bearer_role_review', bylawClause: 'Rule 8', grounds: 'g', factualSummary: 'f', replyDueAt: future() }, auth);
    ok('a final order locks the action scope', editScope.status === 400, JSON.stringify(editScope.body));

    console.log('\nDeleting a mistaken / test record:');
    const deletable = await send('/api/admin/member-actions', 'POST', { personName: 'Delete Me', email: 'delete.me@example.com', actionScope: 'membership_review', bylawClause: 'Rule 9', grounds: 'g', factualSummary: 'f', replyDueAt: future() }, auth);
    const delDraft = await send(`/api/admin/member-actions/${deletable.body.id}`, 'DELETE', null, auth);
    ok('a draft record can be deleted', delDraft.status === 200, JSON.stringify(delDraft.body));
    const gone = await send(`/api/admin/member-actions/${deletable.body.id}`, 'DELETE', null, auth);
    ok('a deleted record is gone', gone.status === 404, JSON.stringify(gone.body));
    const delClosed = await send(`/api/admin/member-actions/${draft1.body.id}`, 'DELETE', null, auth);
    ok('a closed (final-order) record cannot be deleted', delClosed.status === 409, JSON.stringify(delClosed.body));
    const delIssued = await send(`/api/admin/member-actions/${emailDraft.body.id}`, 'DELETE', null, auth);
    ok('an issued notice cannot be deleted (only drafts can)', delIssued.status === 409, JSON.stringify(delIssued.body));
    const delForced = await send(`/api/admin/member-actions/${draft1.body.id}?force=true`, 'DELETE', null, auth);
    ok('a mistaken issued/closed record can be removed only with the explicit force override', delForced.status === 200, JSON.stringify(delForced.body));
  } catch (error) {
    fail += 1;
    console.error('\n  \u2717 unexpected failure:', error);
  } finally {
    server.close();
    console.log(`\n${fail === 0 ? '\u2705' : '\u274c'} ${pass} passed, ${fail} failed\n`);
    process.exit(fail === 0 ? 0 : 1);
  }
}

main();
