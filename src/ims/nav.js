// SSF-IMS grouped navigation (sidebar). English + Hindi labels via i18n keys.
// `resource` present => opens the generic resource browser; `path` => custom page.

export const NAV = [
  {
    group: 'main', items: [
      { key: 'main_dashboard', icon: 'LayoutDashboard', path: '/ims' },
      { key: 'global_search', icon: 'Search', path: '/ims/search' },
      { key: 'notifications', icon: 'Bell', path: '/ims/notifications' },
    ],
  },
  {
    group: 'organisation', items: [
      { key: 'organisations', icon: 'Building2', resource: 'organisations' },
      { key: 'constitution', icon: 'ScrollText', path: '/ims/constitution' },
      { key: 'governanceRules', icon: 'Scale', resource: 'governanceRules' },
      { key: 'registers_required', icon: 'BookMarked', path: '/ims/registers' },
      { key: 'policies', icon: 'FileText', resource: 'policies' },
      { key: 'history', icon: 'History', path: '/ims/history' },
    ],
  },
  {
    group: 'governance', items: [
      { key: 'persons', icon: 'UserRound', resource: 'persons' },
      { key: 'members', icon: 'IdCard', resource: 'members' },
      { key: 'committee', icon: 'Users', resource: 'committeeMembers' },
      { key: 'committees', icon: 'Landmark', resource: 'committees' },
      { key: 'meetings', icon: 'CalendarClock', resource: 'meetings' },
      { key: 'resolutions', icon: 'Gavel', resource: 'resolutions' },
      { key: 'actions', icon: 'ListChecks', resource: 'actions' },
      { key: 'notices_cases', icon: 'AlertTriangle', resource: 'cases' },
    ],
  },
  {
    group: 'programmes', items: [
      { key: 'programmes', icon: 'Layers', resource: 'programmes' },
      { key: 'projects', icon: 'FolderKanban', resource: 'projects' },
      { key: 'activities', icon: 'Activity', resource: 'activities' },
      { key: 'beneficiaries', icon: 'HeartHandshake', resource: 'beneficiaries' },
      { key: 'impact', icon: 'TrendingUp', path: '/ims/impact' },
    ],
  },
  {
    group: 'finance', items: [
      { key: 'finance_dashboard', icon: 'PieChart', path: '/ims/finance' },
      { key: 'financialYears', icon: 'CalendarRange', resource: 'financialYears' },
      { key: 'funds', icon: 'Wallet', resource: 'funds' },
      { key: 'accounts', icon: 'BookOpen', resource: 'accounts' },
      { key: 'costCentres', icon: 'Target', resource: 'costCentres' },
      { key: 'transactions', icon: 'ArrowLeftRight', resource: 'transactions' },
      { key: 'vouchers', icon: 'ReceiptText', resource: 'vouchers' },
      { key: 'bankAccounts', icon: 'Landmark', resource: 'bankAccounts' },
      { key: 'cashAccounts', icon: 'Banknote', resource: 'cashAccounts' },
      { key: 'parties', icon: 'Handshake', resource: 'parties' },
    ],
  },
  {
    group: 'resources', items: [
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
      { key: 'compliance', icon: 'ShieldCheck', resource: 'compliance' },
      { key: 'legal', icon: 'Scale', resource: 'agreements' },
      { key: 'audit_risk', icon: 'SearchCheck', resource: 'audits' },
      { key: 'risks', icon: 'TriangleAlert', resource: 'risks' },
      { key: 'integrity', icon: 'Fingerprint', path: '/ims/integrity' },
    ],
  },
  {
    group: 'records', items: [
      { key: 'documents', icon: 'Files', resource: 'documents' },
      { key: 'communications', icon: 'MessageSquare', resource: 'communications' },
      { key: 'reports', icon: 'BarChart3', path: '/ims/reports' },
      { key: 'knowledge', icon: 'BookMarked', path: '/ims/knowledge' },
    ],
  },
  {
    group: 'admin', items: [
      { key: 'users', icon: 'UserCog', resource: 'users' },
      { key: 'users_perms', icon: 'KeyRound', path: '/ims/permissions' },
      { key: 'audit_trail', icon: 'ClipboardList', path: '/ims/audit-trail' },
      { key: 'import_export', icon: 'Database', path: '/ims/data' },
    ],
  },
];
