// SSF-IMS core data model.
// Design rule: ENTER ONCE -> LINK EVERYWHERE. One master per real entity;
// every other record references a master. Records are archived, never hard-deleted.
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const S = { timestamps: true };
const JSONB = DataTypes.JSONB;

// ---- shared column helpers -------------------------------------------------
const idCols = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  recordId: { type: DataTypes.STRING, unique: true }, // e.g. PERSON-000001
  status: { type: DataTypes.STRING, defaultValue: 'active' }, // draft/active/approved/closed/cancelled/archived/superseded
  createdBy: DataTypes.STRING,
  createdByName: DataTypes.STRING,
  updatedBy: DataTypes.STRING,
  data: { type: JSONB, defaultValue: {} }, // extensible fields without schema churn
};

// ---- 0. ID sequence (atomic, permanent, never reused) ----------------------
const ImsIdSequence = sequelize.define('ImsIdSequence', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  prefix: { type: DataTypes.STRING, unique: true, allowNull: false },
  year: { type: DataTypes.INTEGER, defaultValue: 0 }, // 0 = global (e.g. PERSON)
  lastValue: { type: DataTypes.INTEGER, defaultValue: 0 },
}, S);

// ---- 1. Person (single source of identity) ---------------------------------
const ImsPerson = sequelize.define('ImsPerson', {
  ...idCols,
  fullName: DataTypes.STRING,
  fullNameHi: DataTypes.STRING,
  gender: DataTypes.STRING,
  dob: DataTypes.DATEONLY,
  mobile: DataTypes.STRING,
  altMobile: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  pinCode: DataTypes.STRING,
  occupation: DataTypes.STRING,
  idType: DataTypes.STRING,
  idNumber: DataTypes.STRING,
  pan: DataTypes.STRING,
  photoUrl: DataTypes.TEXT,
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  notes: DataTypes.TEXT,
}, S);

// ---- 2. Role & PersonRole (a person can hold many roles) -------------------
const ImsRole = sequelize.define('ImsRole', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, unique: true }, // member/donor/volunteer/employee/beneficiary/committee/officeBearer
  labelEn: DataTypes.STRING,
  labelHi: DataTypes.STRING,
  description: DataTypes.TEXT,
}, S);

const ImsPersonRole = sequelize.define('ImsPersonRole', {
  ...idCols,
  personId: DataTypes.INTEGER,
  roleCode: DataTypes.STRING,
  refType: DataTypes.STRING, // e.g. 'member'
  refId: DataTypes.INTEGER,  // id of the role-specific record
  fromDate: DataTypes.DATEONLY,
  toDate: DataTypes.DATEONLY,
}, S);

// ---- 3. Organisation / Constitution / Governance ---------------------------
const ImsOrganisation = sequelize.define('ImsOrganisation', {
  ...idCols,
  name: DataTypes.STRING,
  legalName: DataTypes.STRING,
  regNumber: DataTypes.STRING,
  regAuthority: DataTypes.STRING,
  regDate: DataTypes.DATEONLY,
  pan: DataTypes.STRING,
  tan: DataTypes.STRING,
  address: DataTypes.TEXT,
  areaOfOperation: DataTypes.TEXT,
  contactEmail: DataTypes.STRING,
  contactPhone: DataTypes.STRING,
  website: DataTypes.STRING,
}, S);

const ImsGovernanceRule = sequelize.define('ImsGovernanceRule', {
  ...idCols,
  key: { type: DataTypes.STRING, unique: true },
  value: DataTypes.STRING,
  valueType: { type: DataTypes.STRING, defaultValue: 'text' },
  source: DataTypes.STRING,
  ruleText: DataTypes.TEXT,
  ruleTextHi: DataTypes.TEXT,
  effectiveDate: DataTypes.DATEONLY,
  version: { type: DataTypes.INTEGER, defaultValue: 1 },
  approvedBy: DataTypes.STRING,
  supersededDate: DataTypes.DATEONLY,
}, S);

const ImsPolicy = sequelize.define('ImsPolicy', {
  ...idCols,
  title: DataTypes.STRING,
  category: DataTypes.STRING,
  effectiveDate: DataTypes.DATEONLY,
  version: { type: DataTypes.INTEGER, defaultValue: 1 },
  approvedBy: DataTypes.STRING,
  body: DataTypes.TEXT,
}, S);

// ---- 3b. Organisation profile (single master identity of the Foundation) ----
// One record per section (profile/objectives/legal/tax/darpan/governance/
// finance/government); the structured columns are filled from `data` on save.
const ImsOrgProfile = sequelize.define('ImsOrgProfile', {
  ...idCols,
  section: DataTypes.STRING, // profile/objectives/legal/tax/darpan/governance/finance/government
  organizationName: DataTypes.STRING,
  shortName: DataTypes.STRING,
  registrationNumber: DataTypes.STRING,
  registrationDate: DataTypes.STRING,
  registrationAct: DataTypes.STRING,
  organizationType: DataTypes.STRING,
  operationalScope: DataTypes.STRING,
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  pinCode: DataTypes.STRING,
  mobile: DataTypes.STRING,
  email: DataTypes.STRING,
  website: DataTypes.STRING,
}, S);

// ---- 4. Membership ---------------------------------------------------------
const ImsMembership = sequelize.define('ImsMembership', {
  ...idCols,
  memberNo: DataTypes.STRING,
  personId: DataTypes.INTEGER,
  category: DataTypes.STRING, // Guardian/Patron, Lifetime, Ordinary, Honorary
  admissionDate: DataTypes.DATEONLY,
  receiptNumber: DataTypes.STRING,
  feeAmount: DataTypes.DECIMAL(12, 2),
  feeFrequency: DataTypes.STRING,
  applicationStatus: { type: DataTypes.STRING, defaultValue: 'submitted' }, // submitted/review/approved/rejected
  approvedBy: DataTypes.STRING,
  approvalDate: DataTypes.DATEONLY,
  terminationDate: DataTypes.DATEONLY,
  terminationReason: DataTypes.TEXT,
  signatureNote: DataTypes.STRING,
}, S);

// ---- 5. Committee ----------------------------------------------------------
const ImsCommittee = sequelize.define('ImsCommittee', {
  ...idCols,
  name: DataTypes.STRING,
  termStart: DataTypes.DATEONLY,
  termEnd: DataTypes.DATEONLY,
  isCurrent: { type: DataTypes.BOOLEAN, defaultValue: false },
  formedOn: DataTypes.DATEONLY,
  remarks: DataTypes.TEXT,
}, S);

const ImsCommitteeMember = sequelize.define('ImsCommitteeMember', {
  ...idCols,
  committeeId: DataTypes.INTEGER,
  personId: DataTypes.INTEGER,
  position: DataTypes.STRING, // President / Vice President / Secretary / Treasurer / Joint Secretary / Member
  responsibility: DataTypes.STRING,
  fromDate: DataTypes.DATEONLY,
  toDate: DataTypes.DATEONLY,
}, S);

// ---- 6. Meetings / Resolutions / Actions -----------------------------------
const ImsMeeting = sequelize.define('ImsMeeting', {
  ...idCols,
  meetingType: DataTypes.STRING, // General Body / AGM / Special GB / Managing Committee / Project / Committee / Other
  title: DataTypes.STRING,
  meetingDate: DataTypes.DATEONLY,
  startTime: DataTypes.STRING,
  endTime: DataTypes.STRING,
  mode: DataTypes.STRING, // online / offline / hybrid
  venue: DataTypes.STRING,
  meetingLink: DataTypes.STRING,
  platform: DataTypes.STRING,
  noticeDate: DataTypes.DATEONLY,
  noticeDeadline: DataTypes.DATEONLY,
  agenda: DataTypes.TEXT,
  quorumRequired: DataTypes.STRING,
  quorumAchieved: { type: DataTypes.BOOLEAN, defaultValue: false },
  chairman: DataTypes.STRING,
  minutesStatus: { type: DataTypes.STRING, defaultValue: 'draft' }, // draft/review/approved/final
  minutes: DataTypes.TEXT,
  projectId: DataTypes.INTEGER,
  nextMeetingDate: DataTypes.DATEONLY,
}, S);

const ImsMeetingAttendee = sequelize.define('ImsMeetingAttendee', {
  ...idCols,
  meetingId: DataTypes.INTEGER,
  personId: DataTypes.INTEGER,
  invited: { type: DataTypes.BOOLEAN, defaultValue: true },
  acknowledged: { type: DataTypes.BOOLEAN, defaultValue: false },
  attendance: DataTypes.STRING, // present/absent/late/leftEarly/online/offline/apology
  joinedMode: DataTypes.STRING,
  evidence: DataTypes.TEXT,
}, S);

const ImsResolution = sequelize.define('ImsResolution', {
  ...idCols,
  meetingId: DataTypes.INTEGER,
  resolutionNo: DataTypes.STRING,
  title: DataTypes.STRING,
  body: DataTypes.TEXT,
  votingResult: DataTypes.STRING,
  dissent: DataTypes.TEXT,
  isSpecial: { type: DataTypes.BOOLEAN, defaultValue: false },
}, S);

const ImsAction = sequelize.define('ImsAction', {
  ...idCols,
  sourceMeetingId: DataTypes.INTEGER,
  sourceResolutionId: DataTypes.INTEGER,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  responsiblePersonId: DataTypes.INTEGER,
  department: DataTypes.STRING,
  dueDate: DataTypes.DATEONLY,
  priority: DataTypes.STRING,
  actionStatus: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending/inProgress/completed/overdue/cancelled/deferred
  evidence: DataTypes.TEXT,
  completionDate: DataTypes.DATEONLY,
  reviewerId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  remarks: DataTypes.TEXT,
}, S);

// ---- 7. Notices / Cases ----------------------------------------------------
const ImsNotice = sequelize.define('ImsNotice', {
  ...idCols,
  noticeType: DataTypes.STRING,
  subject: DataTypes.STRING,
  body: DataTypes.TEXT,
  meetingId: DataTypes.INTEGER,
  recipientIds: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] },
  deliveryStatus: DataTypes.STRING,
  acknowledgement: DataTypes.TEXT,
  reminderCount: { type: DataTypes.INTEGER, defaultValue: 0 },
}, S);

const ImsCase = sequelize.define('ImsCase', {
  ...idCols,
  caseType: DataTypes.STRING, // feeUnpaid/absence/violation/complaint/grievance/compliance/audit/project/donorReporting/document
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  personId: DataTypes.INTEGER,
  responsiblePersonId: DataTypes.INTEGER,
  stage: { type: DataTypes.STRING, defaultValue: 'detected' }, // detected/assigned/notified/response/review/decision/action/followUp/closed
  deadline: DataTypes.DATEONLY,
  response: DataTypes.TEXT,
  evidence: DataTypes.TEXT,
  decision: DataTypes.TEXT,
  confidential: { type: DataTypes.BOOLEAN, defaultValue: false },
  closedOn: DataTypes.DATEONLY,
}, S);

// ---- 8. Programmes / Projects / Activities / Beneficiaries -----------------
const ImsProgramme = sequelize.define('ImsProgramme', {
  ...idCols,
  name: DataTypes.STRING,
  objective: DataTypes.TEXT,
  theme: DataTypes.STRING,
}, S);

const ImsProject = sequelize.define('ImsProject', {
  ...idCols,
  programmeId: DataTypes.INTEGER,
  name: DataTypes.STRING,
  objective: DataTypes.TEXT,
  locationId: DataTypes.INTEGER,
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  responsiblePersonId: DataTypes.INTEGER,
  budget: DataTypes.DECIMAL(14, 2),
  fundId: DataTypes.INTEGER,
  donorId: DataTypes.INTEGER,
  grantId: DataTypes.INTEGER,
  milestones: JSONB,
  risks: DataTypes.TEXT,
  results: DataTypes.TEXT,
  projectStatus: { type: DataTypes.STRING, defaultValue: 'active' },
}, S);

const ImsActivity = sequelize.define('ImsActivity', {
  ...idCols,
  projectId: DataTypes.INTEGER,
  activityType: DataTypes.STRING, // awarenessCamp/counselling/volunteerService/fieldVisit/communityMeeting/training/educationSupport/plantation/health/social
  title: DataTypes.STRING,
  activityDate: DataTypes.DATEONLY,
  locationId: DataTypes.INTEGER,
  isFree: { type: DataTypes.BOOLEAN, defaultValue: true }, // a Rs0 activity is valid
  participants: DataTypes.INTEGER,
  outcome: DataTypes.TEXT,
}, S);

const ImsBeneficiary = sequelize.define('ImsBeneficiary', {
  ...idCols,
  personId: DataTypes.INTEGER, // references Person; never a duplicate person
  household: DataTypes.STRING,
  projectId: DataTypes.INTEGER,
  demographics: JSONB,
  services: DataTypes.TEXT,
  consent: { type: DataTypes.BOOLEAN, defaultValue: false },
  caseNotes: DataTypes.TEXT,
}, S);

// ---- 9. Finance masters & transactions -------------------------------------
const ImsFinancialYear = sequelize.define('ImsFinancialYear', {
  ...idCols,
  label: DataTypes.STRING, // 2026-27
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  isCurrent: { type: DataTypes.BOOLEAN, defaultValue: false },
  isClosed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, S);

const ImsFund = sequelize.define('ImsFund', {
  ...idCols,
  name: DataTypes.STRING,
  fundType: DataTypes.STRING, // restricted/unrestricted/corpus
  donorId: DataTypes.INTEGER,
  purpose: DataTypes.TEXT,
}, S);

const ImsCostCentre = sequelize.define('ImsCostCentre', {
  ...idCols,
  name: DataTypes.STRING,
  nameHi: DataTypes.STRING,
  shortCode: DataTypes.STRING,
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  centreType: DataTypes.STRING, // programme/project/department/location/activity/institutional
  purpose: DataTypes.TEXT,
  // Organisation mapping
  programmeId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  department: DataTypes.STRING,
  location: DataTypes.STRING,
  district: DataTypes.STRING,
  state: DataTypes.STRING,
  responsiblePersonId: DataTypes.INTEGER,
  // Financial control
  financialYearId: DataTypes.INTEGER,
  fundId: DataTypes.INTEGER,
  budgetHead: DataTypes.STRING,
  approvedBudget: DataTypes.DECIMAL(14, 2),
  currentBudget: DataTypes.DECIMAL(14, 2),
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  // Control / approval
  approvalAuthority: DataTypes.STRING,
  approvalDate: DataTypes.DATEONLY,
  resolutionReference: DataTypes.STRING,
  notes: DataTypes.TEXT,
  isClosed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, S);

const ImsAccount = sequelize.define('ImsAccount', {
  ...idCols,
  code: DataTypes.STRING,
  name: DataTypes.STRING,
  accountType: DataTypes.STRING, // asset/liability/income/expense/equity
  parentId: DataTypes.INTEGER,
}, S);

const ImsParty = sequelize.define('ImsParty', {
  ...idCols,
  name: DataTypes.STRING,
  partyType: DataTypes.STRING, // vendor/creditor/debtor/other
  personId: DataTypes.INTEGER,
  gstin: DataTypes.STRING,
  contact: DataTypes.STRING,
}, S);

const ImsBankAccount = sequelize.define('ImsBankAccount', {
  ...idCols,
  bankName: DataTypes.STRING,
  accountNo: DataTypes.STRING,
  ifsc: DataTypes.STRING,
  branch: DataTypes.STRING,
  openingBalance: DataTypes.DECIMAL(14, 2),
}, S);

const ImsCashAccount = sequelize.define('ImsCashAccount', {
  ...idCols,
  name: DataTypes.STRING,
  custodianPersonId: DataTypes.INTEGER,
  openingBalance: DataTypes.DECIMAL(14, 2),
}, S);

const ImsTransaction = sequelize.define('ImsTransaction', {
  ...idCols,
  transactionNo: DataTypes.STRING,
  txnDate: DataTypes.DATEONLY,
  financialYearId: DataTypes.INTEGER,
  transactionType: DataTypes.STRING,
  amount: DataTypes.DECIMAL(14, 2),
  direction: DataTypes.STRING, // in/out
  paymentMode: DataTypes.STRING,
  fundId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  costCentreId: DataTypes.INTEGER,
  accountId: DataTypes.INTEGER,
  partyId: DataTypes.INTEGER,
  personId: DataTypes.INTEGER,
  donorId: DataTypes.INTEGER,
  bankAccountId: DataTypes.INTEGER,
  cashAccountId: DataTypes.INTEGER,
  voucherId: DataTypes.INTEGER,
  sourceModule: DataTypes.STRING,
  sourceRecordId: DataTypes.STRING,
  needsReview: { type: DataTypes.BOOLEAN, defaultValue: false },
  maker: DataTypes.STRING,
  checker: DataTypes.STRING,
}, S);

const ImsVoucher = sequelize.define('ImsVoucher', {
  ...idCols,
  voucherNo: DataTypes.STRING,
  voucherType: DataTypes.STRING, // payment/receipt/journal/contra/adjustment
  voucherDate: DataTypes.DATEONLY,
  amount: DataTypes.DECIMAL(14, 2),
  narration: DataTypes.TEXT,
  approvedBy: DataTypes.STRING,
}, S);

// Double-entry ledger. A voucher's postings live here (>=2 lines per voucher);
// the trial balance / ledger / cash-book / bank-book are all derived from this.
const ImsLedgerEntry = sequelize.define('ImsLedgerEntry', {
  ...idCols,
  entryNo: DataTypes.STRING, // LED-2026-0001
  entryDate: DataTypes.DATEONLY,
  financialYearId: DataTypes.INTEGER,
  voucherId: DataTypes.INTEGER,
  voucherNo: DataTypes.STRING,
  voucherType: DataTypes.STRING, // receipt/payment/journal/contra
  accountId: DataTypes.INTEGER,
  accountCode: DataTypes.STRING,
  accountName: DataTypes.STRING,
  debit: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  credit: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  narration: DataTypes.TEXT,
  fundId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  costCentreId: DataTypes.INTEGER,
  partyId: DataTypes.INTEGER,
  bankAccountId: DataTypes.INTEGER,
  cashAccountId: DataTypes.INTEGER,
  transactionId: DataTypes.INTEGER,
  transactionNo: DataTypes.STRING,
  sourceModule: DataTypes.STRING,
  sourceRecordId: DataTypes.STRING,
}, S);

// Budget lines, compared against actual ledger spend for variance reporting.
const ImsBudget = sequelize.define('ImsBudget', {
  ...idCols,
  financialYearId: DataTypes.INTEGER,
  accountId: DataTypes.INTEGER,
  fundId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  costCentreId: DataTypes.INTEGER,
  amount: DataTypes.DECIMAL(14, 2),
  period: DataTypes.STRING, // annual/quarterly/monthly
  notes: DataTypes.TEXT,
}, S);

// ---- 10. Donors / Donations / Grants --------------------------------------
const ImsDonor = sequelize.define('ImsDonor', {
  ...idCols,
  personId: DataTypes.INTEGER,
  donorType: DataTypes.STRING, // individual/corporate/trust/foreign
  pan: DataTypes.STRING,
  is80G: { type: DataTypes.BOOLEAN, defaultValue: false },
  fcra: { type: DataTypes.BOOLEAN, defaultValue: false },
}, S);

const ImsDonation = sequelize.define('ImsDonation', {
  ...idCols,
  donorId: DataTypes.INTEGER,
  donationDate: DataTypes.DATEONLY,
  amount: DataTypes.DECIMAL(14, 2),
  mode: DataTypes.STRING,
  fundId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  restricted: { type: DataTypes.BOOLEAN, defaultValue: false },
  receiptNo: DataTypes.STRING,
  is80G: { type: DataTypes.BOOLEAN, defaultValue: false },
  anonymous: { type: DataTypes.BOOLEAN, defaultValue: false },
}, S);

const ImsGrant = sequelize.define('ImsGrant', {
  ...idCols,
  donorId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  fundId: DataTypes.INTEGER,
  amount: DataTypes.DECIMAL(14, 2),
  conditions: DataTypes.TEXT,
  agreementDate: DataTypes.DATEONLY,
  utilisationDue: DataTypes.DATEONLY,
  reportDue: DataTypes.DATEONLY,
  utilisationCertNo: DataTypes.STRING,
  grantStatus: { type: DataTypes.STRING, defaultValue: 'active' },
}, S);

// ---- 11. Assets / Inventory ------------------------------------------------
const ImsAsset = sequelize.define('ImsAsset', {
  ...idCols,
  name: DataTypes.STRING,
  category: DataTypes.STRING,
  purchaseDate: DataTypes.DATEONLY,
  cost: DataTypes.DECIMAL(14, 2),
  locationId: DataTypes.INTEGER,
  custodianPersonId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  fundId: DataTypes.INTEGER,
  depreciationRate: DataTypes.DECIMAL(5, 2),
  insuranceDue: DataTypes.DATEONLY,
  verificationDue: DataTypes.DATEONLY,
  assetStatus: { type: DataTypes.STRING, defaultValue: 'active' },
}, S);

const ImsInventoryItem = sequelize.define('ImsInventoryItem', {
  ...idCols,
  name: DataTypes.STRING,
  unit: DataTypes.STRING,
  openingQty: DataTypes.DECIMAL(14, 2),
  minQty: DataTypes.DECIMAL(14, 2),
}, S);

// ---- 12. HR ----------------------------------------------------------------
const ImsEmployee = sequelize.define('ImsEmployee', {
  ...idCols,
  personId: DataTypes.INTEGER,
  designation: DataTypes.STRING,
  department: DataTypes.STRING,
  joinDate: DataTypes.DATEONLY,
  salary: DataTypes.DECIMAL(14, 2),
  separationDate: DataTypes.DATEONLY,
}, S);

const ImsVolunteer = sequelize.define('ImsVolunteer', {
  ...idCols,
  personId: DataTypes.INTEGER,
  fullName: DataTypes.STRING,
  fullNameHi: DataTypes.STRING,
  email: DataTypes.STRING,
  mobile: DataTypes.STRING,
  gender: DataTypes.STRING,
  dob: DataTypes.DATEONLY,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  volunteerType: DataTypes.STRING, // field / leadership
  roleApplied: DataTypes.STRING,
  preferredArea: DataTypes.TEXT,
  timeCommitment: DataTypes.STRING,
  financiallyIndependent: DataTypes.STRING,
  experienceCapacity: DataTypes.TEXT,
  contribution: DataTypes.TEXT,
  motivation: DataTypes.TEXT,
  fundraisingSupport: DataTypes.TEXT,
  declaration: DataTypes.TEXT,
  skills: DataTypes.TEXT,
  availability: DataTypes.STRING,
  source: DataTypes.STRING,
  sourceTimestamp: DataTypes.STRING,
  joinDate: DataTypes.DATEONLY,
}, S);

const ImsAttendance = sequelize.define('ImsAttendance', {
  ...idCols,
  personId: DataTypes.INTEGER,
  refType: DataTypes.STRING, // employee/volunteer/meeting
  refId: DataTypes.INTEGER,
  attDate: DataTypes.DATEONLY,
  attStatus: DataTypes.STRING,
  remarks: DataTypes.TEXT,
}, S);

// ---- 13. Compliance / Legal / Audit / Risk --------------------------------
const ImsCompliance = sequelize.define('ImsCompliance', {
  ...idCols,
  obligation: DataTypes.STRING,
  legalSource: DataTypes.STRING,
  dueDate: DataTypes.DATEONLY,
  responsiblePersonId: DataTypes.INTEGER,
  reviewerId: DataTypes.INTEGER,
  complianceStatus: { type: DataTypes.STRING, defaultValue: 'pending' },
  evidence: DataTypes.TEXT,
  submittedOn: DataTypes.DATEONLY,
  acknowledgement: DataTypes.TEXT,
  nextDueDate: DataTypes.DATEONLY,
}, S);

const ImsAgreement = sequelize.define('ImsAgreement', {
  ...idCols,
  title: DataTypes.STRING,
  agreementType: DataTypes.STRING, // mou/lease/grant/other
  partyId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  fromDate: DataTypes.DATEONLY,
  toDate: DataTypes.DATEONLY,
  terms: DataTypes.TEXT,
}, S);

const ImsAudit = sequelize.define('ImsAudit', {
  ...idCols,
  auditType: DataTypes.STRING, // internal/external
  financialYearId: DataTypes.INTEGER,
  auditor: DataTypes.STRING,
  periodStart: DataTypes.DATEONLY,
  periodEnd: DataTypes.DATEONLY,
  scope: DataTypes.TEXT,
  observation: DataTypes.TEXT,
  riskLevel: DataTypes.STRING,
  managementResponse: DataTypes.TEXT,
  correctiveAction: DataTypes.TEXT,
  dueDate: DataTypes.DATEONLY,
  closureDate: DataTypes.DATEONLY,
}, S);

const ImsRisk = sequelize.define('ImsRisk', {
  ...idCols,
  title: DataTypes.STRING,
  category: DataTypes.STRING,
  likelihood: DataTypes.STRING,
  impact: DataTypes.STRING,
  rating: DataTypes.STRING,
  ownerPersonId: DataTypes.INTEGER,
  mitigation: DataTypes.TEXT,
  dueDate: DataTypes.DATEONLY,
}, S);

// ---- 14. Documents / Communication / Relations / Audit trail --------------
const ImsDocument = sequelize.define('ImsDocument', {
  ...idCols,
  title: DataTypes.STRING,
  category: DataTypes.STRING,
  docType: DataTypes.STRING,
  version: { type: DataTypes.INTEGER, defaultValue: 1 },
  issueDate: DataTypes.DATEONLY,
  effectiveDate: DataTypes.DATEONLY,
  expiryDate: DataTypes.DATEONLY,
  owner: DataTypes.STRING,
  confidentiality: DataTypes.STRING,
  source: DataTypes.STRING,
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  fileUrl: DataTypes.TEXT,
  approvedBy: DataTypes.STRING,
}, S);

const ImsCommunication = sequelize.define('ImsCommunication', {
  ...idCols,
  channel: DataTypes.STRING, // system/email/sms/whatsapp/manual/phone
  direction: DataTypes.STRING,
  personId: DataTypes.INTEGER,
  recipient: DataTypes.STRING,
  sender: DataTypes.STRING,
  subject: DataTypes.STRING,
  message: DataTypes.TEXT,
  relatedType: DataTypes.STRING,
  relatedId: DataTypes.INTEGER,
  deliveryStatus: DataTypes.STRING,
  response: DataTypes.TEXT,
  retryCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  sentAt: DataTypes.DATE,
}, S);

// Managing Committee History — permanent record of committee appointments,
// role changes, re-appointments, resignations, removals and relieving over time.
// Ported from the SSF Digital Office "officeHistory" register.
const ImsOfficeHistory = sequelize.define('ImsOfficeHistory', {
  ...idCols,
  recordDate: DataTypes.DATEONLY,
  recordType: DataTypes.STRING, // Appointment / Role Change / Re-appointment / ...
  memberId: DataTypes.STRING,
  fullName: DataTypes.STRING,
  eventDate: DataTypes.DATEONLY,
  changeType: DataTypes.STRING,
  previousRole: DataTypes.STRING,
  newRole: DataTypes.STRING,
  referenceNo: DataTypes.STRING,
  resolutionNo: DataTypes.STRING,
  meetingDate: DataTypes.DATEONLY,
  details: DataTypes.TEXT,
  remarks: DataTypes.TEXT,
}, S);

const ImsRelation = sequelize.define('ImsRelation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fromType: DataTypes.STRING,
  fromId: DataTypes.STRING,
  toType: DataTypes.STRING,
  toId: DataTypes.STRING,
  relation: DataTypes.STRING,
  meta: JSONB,
}, S);

const ImsAuditTrail = sequelize.define('ImsAuditTrail', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  entityType: DataTypes.STRING,
  entityId: DataTypes.STRING,
  action: DataTypes.STRING,
  actor: DataTypes.STRING,
  oldValue: JSONB,
  newValue: JSONB,
  reason: DataTypes.TEXT,
  ip: DataTypes.STRING,
  userAgent: DataTypes.STRING,
}, S);

// ---- 15. RBAC / Users ------------------------------------------------------
const ImsUser = sequelize.define('ImsUser', {
  ...idCols,
  username: { type: DataTypes.STRING, unique: true },
  displayName: DataTypes.STRING,
  email: DataTypes.STRING,
  passwordHash: DataTypes.STRING,
  personId: DataTypes.INTEGER,
  roleCode: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastLoginAt: DataTypes.DATE,
}, S);

const ImsRolePermission = sequelize.define('ImsRolePermission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleCode: DataTypes.STRING,
  module: DataTypes.STRING,
  action: DataTypes.STRING, // view/create/edit/delete/approve/export
  scope: DataTypes.STRING, // all/own/department/confidential
}, S);

const models = {
  ImsIdSequence, ImsPerson, ImsRole, ImsPersonRole, ImsOrganisation, ImsGovernanceRule,
  ImsPolicy, ImsOrgProfile, ImsMembership, ImsCommittee, ImsCommitteeMember, ImsMeeting, ImsMeetingAttendee,
  ImsResolution, ImsAction, ImsNotice, ImsCase, ImsProgramme, ImsProject, ImsActivity,
  ImsBeneficiary, ImsFinancialYear, ImsFund, ImsCostCentre, ImsAccount, ImsParty,
  ImsBankAccount, ImsCashAccount, ImsTransaction, ImsVoucher, ImsLedgerEntry, ImsBudget,
  ImsDonor, ImsDonation,
  ImsGrant, ImsAsset, ImsInventoryItem, ImsEmployee, ImsVolunteer, ImsAttendance,
  ImsCompliance, ImsAgreement, ImsAudit, ImsRisk, ImsDocument, ImsCommunication,
  ImsOfficeHistory,
  ImsRelation, ImsAuditTrail, ImsUser, ImsRolePermission,
};

module.exports = { sequelize, models };
