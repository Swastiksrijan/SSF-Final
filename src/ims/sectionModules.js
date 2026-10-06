// SSF-IMS navigation catalogue — FINAL structure.
//
// The sidebar shows only the 9 primary sections. Each section dashboard then
// lists its modules as cards, grouped into labelled blocks. Items map to a
// generic IMS resource, a custom page, an old Digital Office register, or are
// flagged `planned` (structure reserved, screen not built yet).
//
// Nothing is deleted: every existing register/page stays reachable. Where two
// screens did the same job, one canonical card is kept and the old route still
// works if opened directly.
const legacy = (m) => '/ims/legacy/' + m;

const P = (key, icon) => ({ key, icon, planned: true });

export const SECTIONS = {
  organisation: {
    titleKey: 'organisation', icon: 'Building2', tone: 'blue', module: 'organisation',
    subgroups: [
      { labelKey: 'grp_identity', items: [
        { key: 'org_profile', icon: 'Building2', path: '/ims/org-profile' },
        { key: 'constitution', icon: 'ScrollText', path: '/ims/constitution' },
        { key: 'governanceRules', icon: 'Scale', resource: 'governanceRules' },
        { key: 'policies', icon: 'FileText', resource: 'policies' },
        { key: 'signatory_authority', icon: 'PenLine', path: legacy('signatoryAuthority') },
      ] },
      { labelKey: 'grp_members', items: [
        { key: 'membership_contributions', icon: 'Coins', path: '/ims/membership-contributions' },
        { key: 'appointment_letters', icon: 'Mail', path: '/ims/appointment-letters' },
        { key: 'separations', icon: 'UserMinus', path: '/ims/separations' },
      ] },
      { labelKey: 'grp_documents', items: [
        { key: 'official_documents', icon: 'FileCheck2', path: '/ims/official-documents' },
        { key: 'donor_slips', icon: 'Receipt', path: '/ims/donor-slips' },
        { key: 'registers_required', icon: 'BookMarked', path: '/ims/registers' },
        { key: 'office_history', icon: 'History', resource: 'officeHistory' },
      ] },
    ],
  },

  governance: {
    titleKey: 'governance', icon: 'Scale', tone: 'purple', module: 'governance',
    subgroups: [
      { labelKey: 'grp_governance', items: [
        { key: 'persons', icon: 'UserRound', resource: 'persons' },
        { key: 'members', icon: 'IdCard', path: '/ims/members', resource: 'members' },
        { key: 'managing_committee', icon: 'UserTie', path: '/ims/managing-committee' },
        { key: 'committees', icon: 'Landmark', resource: 'committees' },
      ] },
      { labelKey: 'grp_meetings', items: [
        { key: 'meetings', icon: 'CalendarClock', path: '/ims/meetings', resource: 'meetings' },
        { key: 'online_meetings', icon: 'Video', path: '/ims/meetings', resource: 'meetings' },
        { key: 'agenda', icon: 'ListOrdered', resource: 'meetings' },
        { key: 'invitations', icon: 'Mail', planned: true },
        { key: 'reminders', icon: 'BellRing', planned: true },
        { key: 'attendance', icon: 'CalendarCheck', resource: 'attendees' },
        { key: 'minutes', icon: 'FileText', resource: 'meetings' },
        { key: 'resolutions', icon: 'Gavel', resource: 'resolutions' },
        { key: 'actions', icon: 'ListChecks', resource: 'actions' },
        { key: 'responsible_person', icon: 'UserCheck', planned: true },
        { key: 'follow_up', icon: 'Repeat', planned: true },
        { key: 'completion_status', icon: 'CircleCheck', planned: true },
      ] },
      { labelKey: 'grp_other', items: [
        { key: 'notices_cases', icon: 'AlertTriangle', path: '/ims/cases', resource: 'cases' },
        { key: 'notices', icon: 'Bell', resource: 'notices' },
      ] },
    ],
  },

  programmes: {
    titleKey: 'programmes', icon: 'Layers', tone: 'teal', module: 'programmes',
    subgroups: [
      { labelKey: 'grp_programmes', items: [
        { key: 'programmes', icon: 'Layers', resource: 'programmes' },
        { key: 'projects', icon: 'FolderKanban', resource: 'projects' },
        { key: 'activities', icon: 'Activity', path: '/ims/activities', resource: 'activities' },
        { key: 'events_camps', icon: 'CalendarDays', path: legacy('events') },
        { key: 'volunteer_activities', icon: 'HandHeart', resource: 'activities' },
      ] },
      { labelKey: 'grp_impact', items: [
        { key: 'beneficiaries', icon: 'HeartHandshake', resource: 'beneficiaries' },
        { key: 'impact', icon: 'TrendingUp', path: '/ims/impact' },
      ] },
    ],
  },

  finance: {
    titleKey: 'finance', icon: 'PieChart', tone: 'green', module: 'finance',
    dashboardPath: '/ims/finance',
    subgroups: [
      { labelKey: 'grp_finance_core', items: [
        { key: 'transactions', icon: 'ArrowLeftRight', resource: 'transactions' },
        { key: 'receipts', icon: 'ReceiptText', path: '/ims/finance/receipts-payments' },
        { key: 'payments', icon: 'Banknote', path: '/ims/finance/receipts-payments' },
        { key: 'vouchers', icon: 'ReceiptText', resource: 'vouchers' },
        { key: 'payment_voucher', icon: 'FileText', path: legacy('paymentVoucher') },
        { key: 'contributions_donations', icon: 'Gift', path: legacy('contribution') },
      ] },
      { labelKey: 'grp_cash_bank', items: [
        { key: 'cash_book', icon: 'BookText', path: '/ims/cash-book' },
        { key: 'bank_book', icon: 'BookText', path: '/ims/bank-book' },
        { key: 'brs_legacy', icon: 'Scale', path: legacy('brs') },
        { key: 'bank_accounts', icon: 'Landmark', resource: 'bankAccounts' },
        { key: 'cash_accounts', icon: 'Banknote', resource: 'cashAccounts' },
        { key: 'bank_account_master', icon: 'Landmark', path: legacy('bankAccountMaster') },
        { key: 'cheque_issue', icon: 'FileText', path: legacy('chequeIssue') },
        { key: 'cheque_book', icon: 'BookText', path: legacy('chequeBook') },
        { key: 'petty_cash', icon: 'Coins', path: legacy('pettyCash') },
      ] },
      { labelKey: 'grp_accounting', items: [
        { key: 'ledger_journal', icon: 'BookOpen', path: '/ims/finance/ledger' },
        { key: 'financialYears', icon: 'CalendarRange', resource: 'financialYears' },
        { key: 'funds', icon: 'Wallet', resource: 'funds' },
        { key: 'chart_of_accounts', icon: 'BookOpen', resource: 'accounts' },
        { key: 'cost_centres', icon: 'Target', path: '/ims/finance/cost-centres' },
        { key: 'parties', icon: 'Handshake', resource: 'parties' },
        { key: 'party_master', icon: 'Handshake', path: legacy('partyMaster') },
        { key: 'transfer', icon: 'ArrowLeftRight', path: legacy('transfer') },
        { key: 'adjustment', icon: 'GitCompare', path: legacy('adjustment') },
        { key: 'corpus_fund', icon: 'Vault', path: legacy('corpusFund') },
        { key: 'fund_classification', icon: 'Wallet', path: legacy('fundClassification') },
        { key: 'fund_utilisation', icon: 'PieChart', path: legacy('fundUtilisation') },
        { key: 'investments_legacy', icon: 'TrendingUp', path: legacy('investments') },
        { key: 'fd_receipt', icon: 'Landmark', path: legacy('fdReceipt') },
      ] },
      { labelKey: 'grp_income', items: [
        { key: 'contribution_legacy', icon: 'Coins', path: legacy('contribution') },
        { key: 'donations', icon: 'Gift', resource: 'donations' },
        { key: 'membership_contributions', icon: 'IdCard', path: '/ims/membership-contributions' },
        { key: 'grants', icon: 'BadgeDollarSign', resource: 'grants' },
        { key: 'sahyog', icon: 'HandCoins', path: legacy('sahyog') },
        { key: 'pledge', icon: 'FileSignature', path: legacy('pledge') },
        { key: 'csr_fund', icon: 'Briefcase', path: legacy('csrFund') },
        { key: 'event_income', icon: 'CalendarDays', path: legacy('eventIncome') },
        { key: 'interest_income', icon: 'Percent', path: legacy('interestIncome') },
        { key: 'anonymous_donation', icon: 'EyeOff', path: legacy('anonymousDonation') },
        { key: 'corpus_donation', icon: 'Vault', path: legacy('corpusDonation') },
        { key: 'in_kind', icon: 'Package', path: legacy('inKind') },
      ] },
      { labelKey: 'grp_expense', items: [
        { key: 'expenses', icon: 'TrendingDown', path: legacy('expenses') },
        { key: 'programme_expense', icon: 'Layers', path: legacy('programmeExpense') },
        { key: 'travel', icon: 'Plane', path: legacy('travel') },
        { key: 'payroll', icon: 'Users', path: legacy('payroll') },
        { key: 'honorarium', icon: 'HandCoins', path: legacy('honorarium') },
        { key: 'rent', icon: 'Home', path: legacy('rent') },
        { key: 'procurement', icon: 'ShoppingCart', path: '/ims/procurement' },
        { key: 'bank_charges', icon: 'CreditCard', path: legacy('bankCharges') },
        { key: 'capital_expenditure', icon: 'Building', path: legacy('capitalExpenditure') },
        { key: 'advance', icon: 'Forward', path: legacy('advance') },
      ] },
      { labelKey: 'grp_budget', items: [
        { key: 'budgets', icon: 'Target', resource: 'budgets' },
        { key: 'budget_revision', icon: 'FilePen', path: legacy('budgetRevision') },
        { key: 'budget_vs_actual', icon: 'GitCompare', path: legacy('budget') },
        { key: 'variance', icon: 'Activity', path: legacy('variance') },
      ] },
      { labelKey: 'grp_assets_liab', items: [
        { key: 'assets', icon: 'Package', resource: 'assets' },
        { key: 'fixedAssets_legacy', icon: 'Building2', path: legacy('fixedAssets') },
        { key: 'depreciation', icon: 'TrendingDown', path: legacy('depreciation') },
        { key: 'loans', icon: 'Landmark', path: legacy('loans') },
        { key: 'creditors', icon: 'ArrowUpRight', path: legacy('creditors') },
        { key: 'debtors', icon: 'ArrowDownRight', path: legacy('debtors') },
        { key: 'security_deposit', icon: 'ShieldCheck', path: legacy('securityDeposit') },
        { key: 'reserve_fund', icon: 'Vault', path: legacy('reserveFund') },
        { key: 'contingent_liability', icon: 'AlertTriangle', path: legacy('contingentLiability') },
        { key: 'physical_verification', icon: 'ClipboardCheck', path: legacy('physicalVerification') },
        { key: 'insurance', icon: 'ShieldCheck', path: legacy('insurance') },
      ] },
      { labelKey: 'grp_reports', items: [
        { key: 'trial_balance', icon: 'Scale', path: legacy('trialBalance') },
        { key: 'income_expenditure', icon: 'FileText', path: legacy('incomeExpenditure') },
        { key: 'balance_sheet', icon: 'FileSpreadsheet', path: legacy('balanceSheet') },
        { key: 'cash_flow', icon: 'Waves', path: legacy('cashFlow') },
        { key: 'fund_wise_income', icon: 'Wallet', path: legacy('fundWiseIncome') },
        { key: 'budget_legacy', icon: 'Target', path: legacy('budget') },
        { key: 'audited_statements', icon: 'FileCheck2', path: legacy('auditedStatements') },
        { key: 'audit_observations', icon: 'SearchCheck', path: legacy('auditObservations') },
      ] },
    ],
  },

  resources: {
    titleKey: 'resources', icon: 'Boxes', tone: 'teal', module: 'resources',
    subgroups: [
      { labelKey: 'grp_resources', items: [
        { key: 'donors', icon: 'Heart', resource: 'donors' },
        { key: 'grants', icon: 'BadgeDollarSign', resource: 'grants' },
        { key: 'procurement', icon: 'ShoppingCart', path: '/ims/procurement' },
        { key: 'assets', icon: 'Package', resource: 'assets' },
        { key: 'employees', icon: 'BriefcaseBusiness', resource: 'employees' },
        { key: 'volunteers', icon: 'HandHeart', resource: 'volunteers' },
        { key: 'attendance', icon: 'CalendarCheck', resource: 'attendance' },
        { key: 'internships_legacy', icon: 'GraduationCap', path: legacy('internships') },
        { key: 'reimbursement_advance', icon: 'HandCoins', path: legacy('reimbursementAdvance') },
      ] },
      { labelKey: 'grp_resource_registers', items: [
        { key: 'donors_legacy', icon: 'Heart', path: legacy('donors') },
        { key: 'employee_master', icon: 'IdCard', path: legacy('employeeMaster') },
        { key: 'volunteers_legacy', icon: 'HandHeart', path: legacy('volunteers') },
        { key: 'inventory', icon: 'Boxes', resource: 'inventory' },
        { key: 'fixedAssets_legacy', icon: 'Building2', path: legacy('fixedAssets') },
      ] },
    ],
  },

  compliance: {
    titleKey: 'compliance', icon: 'ShieldCheck', tone: 'amber', module: 'compliance',
    subgroups: [
      { labelKey: 'grp_statutory', items: [
        { key: 'compliance', icon: 'ShieldCheck', resource: 'compliance' },
        { key: 'statutory_registrations', icon: 'FileBadge', path: legacy('statutoryRegistrations') },
        { key: 'statutoryDues_legacy', icon: 'Coins', path: legacy('statutoryDues') },
        { key: 'tds_legacy', icon: 'Receipt', path: legacy('tds') },
        { key: 'tax_returns', icon: 'FileSpreadsheet', path: legacy('taxReturns') },
        { key: 'fcra', icon: 'Globe', path: legacy('fcra') },
        { key: 'compliance_calendar', icon: 'CalendarClock', path: legacy('complianceCalendar') },
      ] },
      { labelKey: 'grp_risk', items: [
        { key: 'audit_risk', icon: 'SearchCheck', resource: 'audits' },
        { key: 'internal_audit', icon: 'ClipboardCheck', path: legacy('internalAudit') },
        { key: 'audits_legacy', icon: 'FileText', path: legacy('audits') },
        { key: 'audit_observations', icon: 'AlertCircle', path: legacy('auditObservations') },
        { key: 'management_response', icon: 'MessageSquare', path: legacy('managementResponse') },
        { key: 'risks', icon: 'TriangleAlert', resource: 'risks' },
      ] },
      { labelKey: 'grp_legal', items: [
        { key: 'legal', icon: 'Scale', resource: 'agreements' },
        { key: 'legal_case', icon: 'Gavel', path: legacy('legalCase') },
        { key: 'mou_legacy', icon: 'FileSignature', path: legacy('mou') },
        { key: 'licence', icon: 'FileBadge', path: legacy('licence') },
        { key: 'property_lease', icon: 'Home', path: legacy('propertyLease') },
        { key: 'related_party', icon: 'Users', path: legacy('relatedParty') },
      ] },
      { labelKey: 'grp_gov_compliance', items: [
        { key: 'agm_minutes', icon: 'FileText', path: legacy('agmMinutes') },
        { key: 'ec_minutes', icon: 'FileText', path: legacy('ecMinutes') },
        { key: 'resolutions', icon: 'Gavel', resource: 'resolutions' },
        { key: 'delegation', icon: 'GitBranch', path: legacy('delegation') },
        { key: 'policies', icon: 'FileText', resource: 'policies' },
        { key: 'member_register', icon: 'IdCard', path: legacy('memberRegister') },
        { key: 'office_bearer', icon: 'UserTie', path: legacy('officeBearer') },
      ] },
      { labelKey: 'grp_donor_compliance', items: [
        { key: 'donor_master', icon: 'Heart', path: legacy('donorMaster') },
        { key: 'grant_agreement', icon: 'FileSignature', path: legacy('grantAgreement') },
        { key: 'utilisation_certificate', icon: 'FileCheck2', path: legacy('utilisationCertificate') },
        { key: 'donor_reporting', icon: 'BarChart3', path: legacy('donorReporting') },
        { key: 'foreign_donor', icon: 'Globe', path: legacy('foreignDonor') },
      ] },
      { labelKey: 'grp_controls', items: [
        { key: 'segregation_of_duties', icon: 'Split', path: legacy('segregationOfDuties') },
        { key: 'maker_checker', icon: 'UserCheck', path: legacy('makerChecker') },
        { key: 'access_log', icon: 'ClipboardList', path: legacy('accessLog') },
        { key: 'integrity', icon: 'Fingerprint', path: '/ims/integrity' },
        { key: 'whistleblower', icon: 'Megaphone', path: legacy('whistleblower') },
      ] },
    ],
  },

  records: {
    titleKey: 'records', icon: 'Files', tone: 'blue', module: 'records',
    subgroups: [
      { labelKey: 'grp_records', items: [
        { key: 'inward_legacy', icon: 'Inbox', path: legacy('inward') },
        { key: 'outward_legacy', icon: 'Send', path: legacy('outward') },
        { key: 'documents', icon: 'Files', resource: 'documents' },
        { key: 'communications', icon: 'MessageSquare', resource: 'communications' },
        { key: 'reports', icon: 'BarChart3', path: '/ims/reports' },
        { key: 'document_index', icon: 'ListTree', path: legacy('documentIndex') },
        { key: 'knowledge', icon: 'BookMarked', path: '/ims/knowledge' },
      ] },
      { labelKey: 'grp_certificates', items: [
        P('certificates_letters', 'Award'),
        P('member_certificates', 'IdCard'),
        P('donor_certificates', 'Heart'),
        P('volunteer_certificates', 'HandHeart'),
        P('participation_certificates', 'Users'),
        P('internship_certificates', 'GraduationCap'),
        P('training_certificates', 'BookOpen'),
        P('programme_certificates', 'Layers'),
        P('recognition_certificates', 'Star'),
        P('service_certificates', 'BadgeCheck'),
      ] },
    ],
  },

  admin: {
    titleKey: 'admin', icon: 'Settings', tone: 'slate', module: 'admin',
    subgroups: [
      { labelKey: 'grp_setup', items: [
        { key: 'users', icon: 'UserCog', path: '/ims/users', resource: 'users' },
        { key: 'users_perms', icon: 'KeyRound', path: '/ims/permissions' },
        { key: 'audit_trail', icon: 'ClipboardList', path: '/ims/audit-trail' },
        { key: 'access_log', icon: 'ScrollText', path: legacy('accessLog') },
        { key: 'import_export', icon: 'Database', path: '/ims/data' },
        { key: 'legacy_office', icon: 'Archive', path: '/ims/office' },
      ] },
      { labelKey: 'grp_learning_admin', items: [
        { key: 'learning_certificates', icon: 'Award', path: '/ims/learning-certificates' },
        P('learning_admin', 'GraduationCap'),
        P('subjects', 'BookOpen'),
        P('courses', 'Layers'),
        P('lessons', 'FileText'),
        P('certificate_templates', 'FileBadge'),
        P('content_management', 'Database'),
      ] },
    ],
  },
};

// Every group of a section, curated blocks first.
export function sectionGroups(section) {
  const s = SECTIONS[section];
  if (!s) return [];
  return s.subgroups.map((g) => ({ ...g, items: [...g.items] }));
}

export function sectionModuleCount(section) {
  return sectionGroups(section).reduce((n, g) => n + g.items.length, 0);
}

// The sidebar shows only the top-level entries: a few global actions plus one
// row per section. Clicking a section opens its dashboard, which lists every
// module of that section as a card. This keeps the menu short while every
// register stays reachable (nothing is removed from the app).
export const SIDEBAR = [
  { key: 'main_dashboard', icon: 'LayoutDashboard', path: '/ims' },
  { key: 'global_search', icon: 'Search', path: '/ims/search' },
  { key: 'notifications', icon: 'Bell', path: '/ims/notifications' },
  { key: 'organisation', icon: 'Building2', path: '/ims/sections/organisation', activeKey: 'organisation_dashboard' },
  { key: 'governance', icon: 'Scale', path: '/ims/sections/governance', activeKey: 'governance_dashboard' },
  { key: 'programmes', icon: 'Layers', path: '/ims/sections/programmes', activeKey: 'programmes_dashboard' },
  { key: 'finance', icon: 'PieChart', path: '/ims/finance', activeKey: 'finance_dashboard' },
  { key: 'resources', icon: 'Boxes', path: '/ims/sections/resources', activeKey: 'resources_dashboard' },
  { key: 'compliance', icon: 'ShieldCheck', path: '/ims/sections/compliance', activeKey: 'compliance_dashboard' },
  { key: 'records', icon: 'Files', path: '/ims/sections/records', activeKey: 'records_dashboard' },
  { key: 'admin', icon: 'Settings', path: '/ims/sections/admin', activeKey: 'admin_dashboard' },
];
