// Sector Registers + Annual Compliance — the two FY 2025-26 workbook sheets that
// were not previously represented anywhere in the repo.
//
// Source: the organisation's FY 2025-26 financial workbook (`sheet/sheet.xlsx`,
// sheet names "Sector Registers" and "Annual Compliance"), maintained by SSF for
// reconciliation with the audited financial statements.
//
// HOW TO CHANGE / ADD
//   1. Append a row below (order does not matter).
//   2. Deploy / restart the backend. The registers are kept in step.
// The seed is idempotent and additive: a row already present (matched by its
// deterministic recordId) is refreshed only where a field is still empty, never
// duplicated, and nothing is ever deleted.

// "Sector Registers" — the sector-wise roll-up of the year's activity. The two
// expenditure figures are exactly the Expense register's category totals
// (Education Exp. 1000; Environment Protection & Awareness 15200), which is why
// each row is carried as an Activity under its Programme rather than as a new
// financial record — the money is already booked in the expense register.
const SECTOR_REGISTERS = [
  {
    key: 'education',
    sector: 'Education',
    activityDate: '2025-06-15',
    title: 'Education / Awareness Activity',
    activityType: 'educationSupport',
    programme: 'education',
    location: 'Rewa',
    beneficiaries: null,
    expenditure: 1000,
    resolutionRef: null,
    remarks: 'As per available records',
  },
  {
    key: 'environment',
    sector: 'Environment',
    activityDate: '2025-07-06',
    title: 'Environment Protection & Awareness Activity',
    activityType: 'plantation',
    programme: 'environment',
    location: 'Rewa',
    beneficiaries: null,
    expenditure: 15200,
    resolutionRef: null,
    remarks: 'As per audited expenditure',
  },
  {
    key: 'community',
    sector: 'General / Community Awareness',
    activityDate: null,
    title: 'Community / Social Awareness Activities',
    activityType: 'social',
    programme: 'community',
    location: null,
    beneficiaries: null,
    expenditure: null,
    resolutionRef: null,
    remarks: 'Supporting details to be maintained where available',
  },
];

// "Annual Compliance" — the compliance resolution recorded against each of the
// year's meetings (the 14 dates are the Meeting Register's own dates).
const ANNUAL_COMPLIANCE = [
  { no: 'COMP-01', date: '2025-04-30', type: 'AGM', purpose: 'Approval of FY 2024-25 Audit Report', decision: 'Audit Report approved unanimously', person: 'President' },
  { no: 'COMP-02', date: '2025-05-01', type: 'ECM', purpose: 'Internship Programme Launch', decision: 'Internship letters issued to 2 trainees', person: 'Secretary' },
  { no: 'COMP-03', date: '2025-05-08', type: 'ECM', purpose: 'Appointment of Institutional Representative', decision: 'Ramesh Pandey named Principal Contact Person', person: 'Secretary' },
  { no: 'COMP-04', date: '2025-05-10', type: 'AGM', purpose: 'Membership Changes & New Committee Formation', decision: 'Inactive members removed; New members inducted; New committee formed', person: 'President' },
  { no: 'COMP-05', date: '2025-06-20', type: 'Special Meeting', purpose: 'Vigilance Cell Formation & Digitization', decision: 'Ethics & Vigilance Cell formed; Digital archiving approved', person: 'Vice President' },
  { no: 'COMP-06', date: '2025-06-20', type: 'Advisory Meeting', purpose: 'Appointment of Honorary Advisors', decision: 'Advisors (CA, Advocates, Social workers) nominated', person: 'Secretary' },
  { no: 'COMP-07', date: '2025-07-06', type: 'Core Group', purpose: 'Plantation Campaign & Outreach', decision: 'Plantation drive approved; Outreach strengthened', person: 'Joint Secretary' },
  { no: 'COMP-08', date: '2025-07-20', type: 'ECM', purpose: 'CSR1 Filing & Office Expenses', decision: 'CSR1 filing approved; Rent ₹2500 sanctioned', person: 'Treasurer' },
  { no: 'COMP-09', date: '2025-09-30', type: 'AGM', purpose: 'Membership Register Approval', decision: 'Membership register approved; Audit report accepted', person: 'Secretary' },
  { no: 'COMP-10', date: '2025-11-20', type: 'ECM', purpose: 'CSR Registration & Compliance Filing', decision: 'CSR-1 filing completed; Registrar informed', person: 'Vice President' },
  { no: 'COMP-11', date: '2025-12-31', type: 'AGM', purpose: 'Mid-Year Review & Internship Evaluation', decision: 'Internship programme continuation approved', person: 'President' },
  { no: 'COMP-12', date: '2026-01-15', type: 'ECM', purpose: 'Office Rent & Admin Expenses', decision: 'Rent ₹2500 approved; Admin expenses sanctioned', person: 'Treasurer' },
  { no: 'COMP-13', date: '2026-02-20', type: 'ECM', purpose: 'Laptop Repair & Travel Expenses', decision: 'Laptop repair ₹6000 approved; Travel ₹700 sanctioned', person: 'Secretary' },
  { no: 'COMP-14', date: '2026-03-31', type: 'AGM', purpose: 'Approval of FY 2025-26 Accounts', decision: 'Accounts approved; Closing balance ₹15,600.51', person: 'President' },
];

// "Sahyog" — the in-kind support the property owner gives by not charging full
// office rent. The Expense register books these as Mode = "Support"; they are
// mirrored into the Sahyog register so the support is recorded in the register
// meant for it (income + matching expense, net effect nil).
const SAHYOG_SUPPORT = [
  { date: '2025-04-01', particular: 'Office Rent – April 2025', amount: 2500 },
  { date: '2025-05-01', particular: 'Office Rent – May 2025', amount: 2500 },
  { date: '2025-06-01', particular: 'Office Rent – June 2025', amount: 2500 },
  { date: '2025-07-21', particular: 'Office Rent – July 2025 (Balance)', amount: 2300 },
  { date: '2025-10-01', particular: 'Office Rent – October 2025', amount: 2500 },
  { date: '2025-11-01', particular: 'Office Rent – November 2025', amount: 2500 },
  { date: '2025-12-01', particular: 'Office Rent – December 2025', amount: 2500 },
  { date: '2026-01-01', particular: 'Office Rent – January 2026', amount: 2500 },
  { date: '2026-02-01', particular: 'Office Rent – February 2026', amount: 1000 },
];

module.exports = { SECTOR_REGISTERS, ANNUAL_COMPLIANCE, SAHYOG_SUPPORT };
