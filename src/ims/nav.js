// SSF-IMS grouped navigation (sidebar). English + Hindi labels via i18n keys.
// `resource` present => opens the generic resource browser; `path` => custom page.

export const NAV = [
  {
    group: 'main', items: [
      { key: 'main_dashboard', icon: 'LayoutDashboard', path: '/ims' },
      { key: 'global_search', icon: 'Search', path: '/ims/search' },
      { key: 'notifications', icon: 'Bell', path: '/ims/notifications' },
      { key: 'learning_certificates', icon: 'Award', path: '/ims/learning-certificates' },
    ],
  },
  {
    group: 'organisation', items: [
      { key: 'organisation_dashboard', icon: 'LayoutDashboard', path: '/ims/sections/organisation' },
      { key: 'org_profile', icon: 'Building2', path: '/ims/org-profile' },
      { key: 'membership_contributions', icon: 'Coins', path: '/ims/membership-contributions', resource: 'membershipContributions' },
      { key: 'appointment_letters', icon: 'Mail', path: '/ims/appointment-letters', resource: 'appointmentLetters' },
      { key: 'official_documents', icon: 'FileCheck2', path: '/ims/official-documents', resource: 'officialDocuments' },
      { key: 'donor_slips', icon: 'Receipt', path: '/ims/donor-slips', resource: 'donorSlips' },
      { key: 'separations', icon: 'UserMinus', path: '/ims/separations', resource: 'separations' },
      { key: 'constitution', icon: 'ScrollText', path: '/ims/constitution' },
      { key: 'governanceRules', icon: 'Scale', resource: 'governanceRules' },
      { key: 'registers_required', icon: 'BookMarked', path: '/ims/registers' },
      { key: 'policies', icon: 'FileText', path: '/ims/policies', resource: 'policies' },
      { key: 'office_history', icon: 'History', path: '/ims/history', resource: 'officeHistory' },
    ],
  },
  {
    group: 'governance', items: [
      { key: 'governance_dashboard', icon: 'LayoutDashboard', path: '/ims/sections/governance' },
      { key: 'persons', icon: 'UserRound', resource: 'persons' },
      { key: 'members', icon: 'IdCard', path: '/ims/members', resource: 'members' },
      { key: 'managing_committee', icon: 'UserTie', path: '/ims/managing-committee', resource: 'managingCommittee' },
      { key: 'committee', icon: 'Users', resource: 'committeeMembers' },
      { key: 'committees', icon: 'Landmark', resource: 'committees' },
      { key: 'meetings', icon: 'CalendarClock', path: '/ims/meetings', resource: 'meetings' },
      { key: 'resolutions', icon: 'Gavel', resource: 'resolutions' },
      { key: 'actions', icon: 'ListChecks', resource: 'actions' },
      { key: 'notices_cases', icon: 'AlertTriangle', path: '/ims/cases', resource: 'cases' },
    ],
  },
  {
    group: 'programmes', items: [
      { key: 'programmes_dashboard', icon: 'LayoutDashboard', path: '/ims/sections/programmes' },
      { key: 'programmes', icon: 'Layers', resource: 'programmes' },
      { key: 'projects', icon: 'FolderKanban', resource: 'projects' },
      { key: 'activities', icon: 'Activity', path: '/ims/activities', resource: 'activities' },
      { key: 'beneficiaries', icon: 'HeartHandshake', resource: 'beneficiaries' },
      { key: 'impact', icon: 'TrendingUp', path: '/ims/impact' },
    ],
  },
  {
    group: 'finance', items: [
      { key: 'finance_dashboard', icon: 'PieChart', path: '/ims/finance' },
      { key: 'receipts_payments', icon: 'ReceiptText', path: '/ims/finance/receipts-payments' },
      { key: 'ledger_journal', icon: 'BookOpen', path: '/ims/finance/ledger' },
      { key: 'financialYears', icon: 'CalendarRange', resource: 'financialYears' },
      { key: 'funds', icon: 'Wallet', resource: 'funds' },
      { key: 'chart_of_accounts', icon: 'BookOpen', resource: 'accounts' },
      { key: 'cost_centres', icon: 'Target', path: '/ims/finance/cost-centres' },
      { key: 'bank_accounts', icon: 'Landmark', resource: 'bankAccounts' },
      { key: 'cash_accounts', icon: 'Banknote', resource: 'cashAccounts' },
      { key: 'bank_book', icon: 'BookText', path: '/ims/bank-book', resource: 'bank' },
      { key: 'cash_book', icon: 'BookText', path: '/ims/cash-book', resource: 'cash' },
      { key: 'parties', icon: 'Handshake', resource: 'parties' },
      { key: 'vouchers', icon: 'ReceiptText', resource: 'vouchers' },
      { key: 'budgets', icon: 'Target', resource: 'budgets' },
      { key: 'transactions', icon: 'ArrowLeftRight', resource: 'transactions' },
    ],
  },
  {
    group: 'resources', items: [
      { key: 'resources_dashboard', icon: 'LayoutDashboard', path: '/ims/sections/resources' },
      { key: 'donors', icon: 'Heart', resource: 'donors' },
      { key: 'donations', icon: 'Gift', resource: 'donations' },
      { key: 'grants', icon: 'BadgeDollarSign', resource: 'grants' },
      { key: 'procurement', icon: 'ShoppingCart', path: '/ims/procurement' },
      { key: 'assets', icon: 'Package', resource: 'assets' },
      { key: 'inventory', icon: 'Boxes', resource: 'inventory' },
      { key: 'employees', icon: 'BriefcaseBusiness', resource: 'employees' },
      { key: 'volunteers', icon: 'HandHeart', resource: 'volunteers' },
      { key: 'attendance', icon: 'CalendarCheck', resource: 'attendance' },
    ],
  },
  {
    group: 'compliance', items: [
      { key: 'compliance_dashboard', icon: 'LayoutDashboard', path: '/ims/sections/compliance' },
      { key: 'compliance', icon: 'ShieldCheck', resource: 'compliance' },
      { key: 'legal', icon: 'Scale', resource: 'agreements' },
      { key: 'audit_risk', icon: 'SearchCheck', resource: 'audits' },
      { key: 'risks', icon: 'TriangleAlert', resource: 'risks' },
      { key: 'integrity', icon: 'Fingerprint', path: '/ims/integrity' },
    ],
  },
  {
    group: 'records', items: [
      { key: 'records_dashboard', icon: 'LayoutDashboard', path: '/ims/sections/records' },
      { key: 'documents', icon: 'Files', resource: 'documents' },
      { key: 'communications', icon: 'MessageSquare', resource: 'communications' },
      { key: 'reports', icon: 'BarChart3', path: '/ims/reports' },
      { key: 'knowledge', icon: 'BookMarked', path: '/ims/knowledge' },
    ],
  },
  {
    group: 'admin', items: [
      { key: 'users', icon: 'UserCog', path: '/ims/users', resource: 'users' },
      { key: 'users_perms', icon: 'KeyRound', path: '/ims/permissions' },
      { key: 'audit_trail', icon: 'ClipboardList', path: '/ims/audit-trail' },
      { key: 'import_export', icon: 'Database', path: '/ims/data' },
    ],
  },
];
