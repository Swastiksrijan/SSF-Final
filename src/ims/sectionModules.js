// SSF-IMS navigation catalogue — FINAL structure.
//
// The sidebar shows only the 9 primary sections. Each section dashboard then
// lists its modules as cards, grouped into labelled blocks. Items map to a
// generic IMS resource, a custom page, an old office register, or are
// flagged `planned` (structure reserved, screen not built yet).
//
// Nothing is deleted: every existing register/page stays reachable. Where two
// screens did the same job, one canonical card is kept and the old route still
// works if opened directly.
const P = (key, icon) => ({ key, icon, planned: true });

export const SECTIONS = {
  organisation: {
    titleKey: 'organisation', icon: 'Building2', tone: 'blue', module: 'organisation',
    subgroups: [
      { labelKey: 'grp_identity', items: [
        { key: 'departments_register', icon: 'Layers3', resource: 'costCentres' },
        { key: 'field_units_register', icon: 'Network', resource: 'chapters' },
        { key: 'unit_assignments_register', icon: 'UserRoundCheck', resource: 'chapterMembers' },
        { key: 'org_structure', icon: 'Network', path: '/ims/org-structure' },
        { key: 'org_profile', icon: 'Building2', path: '/ims/org-profile' },
        { key: 'institutional_history', shortKey: 'institution_short', icon: 'Landmark', path: '/ims/org-profile?tab=history' },
        { key: 'org_profile_pdf', icon: 'FileText', path: '/ims/org-profile-pdf' },
        { key: 'constitution', icon: 'ScrollText', path: '/ims/constitution' },
        { key: 'governanceRules', icon: 'Scale', resource: 'governanceRules' },
        { key: 'policies', icon: 'FileText', resource: 'policies' },
      ] },
      { labelKey: 'grp_members', items: [
        { key: 'membership_contributions', icon: 'Coins', path: '/ims/membership-contributions' },
        { key: 'appointment_letters', icon: 'Mail', path: '/ims/appointment-letters' },
        { key: 'separations', icon: 'UserMinus', path: '/ims/separations' },
      ] },
      { labelKey: 'grp_documents', items: [
        { key: 'official_documents', icon: 'FileCheck2', path: '/ims/official-documents' },
        { key: 'letterhead', icon: 'FileSignature', path: '/ims/letterhead' },
        { key: 'donor_slips', icon: 'Receipt', path: '/ims/donor-slips' },
        { key: 'registers_required', icon: 'BookMarked', path: '/ims/registers' },
        { key: 'annual_reports', icon: 'CalendarRange', path: '/ims/annual-reports' },
        { key: 'office_history', icon: 'History', path: '/ims/history' },
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
        { key: 'committee_members', shortKey: 'committee_members_short', icon: 'Users', resource: 'committeeMembers' },
      ] },
      { labelKey: 'grp_meetings', items: [
        { key: 'meetings', shortKey: 'meetings_nav', icon: 'CalendarClock', path: '/ims/meetings', resource: 'meetings' },
        { key: 'online_meetings', icon: 'Video', path: '/ims/meetings', resource: 'meetings' },
        { key: 'agenda', shortKey: 'agenda', icon: 'ListOrdered', resource: 'meetings' },
        // Invitations/Reminders belong to the meeting itself; they are surfaced
        // through the Notifications Centre rather than owning that global route
        // (pointing here used to make the Governance strip appear on the centre).
        { key: 'invitations', icon: 'Mail', planned: true },
        { key: 'reminders', icon: 'BellRing', planned: true },
        { key: 'attendance', icon: 'CalendarCheck', resource: 'attendees' },
        { key: 'minutes', shortKey: 'minutes', icon: 'FileText', resource: 'meetings' },
        { key: 'resolutions', icon: 'Gavel', resource: 'resolutions' },
        { key: 'actions', icon: 'ListChecks', resource: 'actions' },
        { key: 'responsible_person', shortKey: 'responsible_short', icon: 'UserCheck', planned: true },
        { key: 'follow_up', icon: 'Repeat', planned: true },
        { key: 'completion_status', shortKey: 'completion_short', icon: 'CircleCheck', planned: true },
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
      ] },
      { labelKey: 'grp_cash_bank', items: [
        { key: 'cash_book', icon: 'BookText', path: '/ims/cash-book' },
        { key: 'bank_book', icon: 'BookText', path: '/ims/bank-book' },
        { key: 'statement_import', icon: 'Upload', path: '/ims/finance/statement-import' },
        { key: 'bank_accounts', icon: 'Landmark', resource: 'bankAccounts' },
        { key: 'cash_accounts', icon: 'Banknote', resource: 'cashAccounts' },
      ] },
      { labelKey: 'grp_accounting', items: [
        { key: 'ledger_journal', icon: 'BookOpen', path: '/ims/finance/ledger' },
        { key: 'financialYears', icon: 'CalendarRange', resource: 'financialYears' },
        { key: 'funds', icon: 'Wallet', resource: 'funds' },
        { key: 'chart_of_accounts', icon: 'BookOpen', resource: 'accounts' },
        { key: 'cost_centres', icon: 'Target', path: '/ims/finance/cost-centres' },
        { key: 'parties', icon: 'Handshake', resource: 'parties' },
      ] },
      { labelKey: 'grp_income', items: [
        { key: 'donations', icon: 'Gift', resource: 'donations' },
      ] },
      { labelKey: 'grp_expense', items: [
        { key: 'procurement', icon: 'ShoppingCart', path: '/ims/procurement' },
      ] },
      { labelKey: 'grp_budget', items: [
        { key: 'budgets', icon: 'Target', resource: 'budgets' },
      ] },
      { labelKey: 'grp_assets_liab', items: [
      ] },
      { labelKey: 'grp_reports', items: [
      ] },
    ],
  },

  resources: {
    titleKey: 'resources', icon: 'Boxes', tone: 'teal', module: 'resources',
    subgroups: [
      { labelKey: 'grp_resources', items: [
        { key: 'donors', icon: 'Heart', resource: 'donors' },
        { key: 'grants', icon: 'BadgeDollarSign', resource: 'grants' },
        { key: 'assets', icon: 'Package', resource: 'assets' },
        { key: 'employees', icon: 'BriefcaseBusiness', resource: 'employees' },
        { key: 'attendance_register', icon: 'CalendarCheck', resource: 'attendance' },
      ] },
      { labelKey: 'grp_resource_registers', items: [
        { key: 'inventory', icon: 'Boxes', resource: 'inventory' },
      ] },
    ],
  },

  // Volunteer Network is its own section so its rich overview page keeps the
  // persistent strip (title + Overview + its registers) instead of borrowing
  // the Resources strip and mislabelling the whole page as "Resources".
  volunteer: {
    titleKey: 'volunteer_network', icon: 'Network', tone: 'teal', module: 'volunteers',
    subgroups: [
      { labelKey: 'grp_volunteer_network', items: [
        { key: 'volunteers', icon: 'HandHeart', resource: 'volunteers' },
        { key: 'chapters', icon: 'Flag', resource: 'chapters' },
        { key: 'volunteer_tasks', icon: 'ListChecks', resource: 'volunteerTasks' },
        { key: 'volunteer_funds', icon: 'HandCoins', resource: 'volunteerFunds' },
      ] },
    ],
  },

  compliance: {
    titleKey: 'compliance', icon: 'ShieldCheck', tone: 'amber', module: 'compliance',
    subgroups: [
      { labelKey: 'grp_statutory', items: [
        { key: 'compliance', icon: 'ShieldCheck', resource: 'compliance' },
      ] },
      { labelKey: 'grp_risk', items: [
        { key: 'audit_risk', icon: 'SearchCheck', resource: 'audits' },
        { key: 'risks', icon: 'TriangleAlert', resource: 'risks' },
      ] },
      { labelKey: 'grp_legal', items: [
        { key: 'legal', icon: 'Scale', resource: 'agreements' },
      ] },
      { labelKey: 'grp_gov_compliance', items: [
      ] },
      { labelKey: 'grp_donor_compliance', items: [
      ] },
      { labelKey: 'grp_controls', items: [
        { key: 'integrity', icon: 'Fingerprint', path: '/ims/integrity' },
      ] },
    ],
  },

  notifications: {
    titleKey: 'centre_kicker', icon: 'Bell', tone: 'navy', module: 'notifications',
    subgroups: [
      { labelKey: 'grp_notifications', items: [
        { key: 'notification_centre', icon: 'Bell', path: '/ims/notifications' },
        { key: 'contacts', icon: 'Contact', path: '/ims/contacts' },
        { key: 'complaint_grievance', icon: 'ShieldAlert', path: '/ims/complaints' },
      ] },
    ],
  },

  records: {
    titleKey: 'records', icon: 'Files', tone: 'blue', module: 'records',
    subgroups: [
      { labelKey: 'grp_records', items: [
        { key: 'documents', icon: 'Files', resource: 'documents' },
        { key: 'communications', icon: 'MessageSquare', resource: 'communications' },
        { key: 'reports', icon: 'BarChart3', path: '/ims/reports' },
        { key: 'download_center', icon: 'Download', path: '/ims/download-center' },
        { key: 'knowledge', icon: 'BookMarked', path: '/ims/knowledge' },
      ] },
      { labelKey: 'grp_certificates', items: [
        { key: 'certificates_letters', shortKey: 'certificates_letters', icon: 'Award', path: '/ims/learning-certificates' },
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
        { key: 'import_export', icon: 'Database', path: '/ims/data' },
      ] },
      { labelKey: 'grp_communications', items: [
        { key: 'social_publisher', icon: 'Megaphone', path: '/ims/social' },
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
//
// Which entry lights up is derived from the route (see sidebarKeyForPath), not
// from a per-page label, so no `activeKey` bookkeeping is needed here.
export const SIDEBAR = [
  { key: 'main_dashboard', icon: 'LayoutDashboard', path: '/ims' },
  { key: 'global_search', icon: 'Search', path: '/ims/search' },
  { key: 'notifications', icon: 'Bell', path: '/ims/sections/notifications' },
  { key: 'complaint_grievance', icon: 'ShieldAlert', path: '/ims/complaints' },
  { key: 'social_publisher', icon: 'Megaphone', path: '/ims/social' },
  { key: 'volunteer_network', icon: 'Network', path: '/ims/volunteer-network' },
  { key: 'organisation', icon: 'Building2', path: '/ims/sections/organisation' },
  { key: 'governance', icon: 'Scale', path: '/ims/sections/governance' },
  { key: 'programmes', icon: 'Layers', path: '/ims/sections/programmes' },
  { key: 'finance', icon: 'PieChart', path: '/ims/finance' },
  { key: 'resources', icon: 'Boxes', path: '/ims/sections/resources' },
  { key: 'compliance', icon: 'ShieldCheck', path: '/ims/sections/compliance' },
  { key: 'records', icon: 'Files', path: '/ims/sections/records' },
  { key: 'admin', icon: 'Settings', path: '/ims/sections/admin' },
];

// --- Active-location resolution -------------------------------------------
//
// One module = one canonical route, but a module is often reachable through
// several paths (its own route, the legacy register route, the generic
// resource route). Pages also label themselves with many different `active`
// strings — "members", "letterhead", "office_history", "users_perms", a raw
// `resource`… — which is why the sidebar highlight used to vanish on 33 of 47
// routes and the section strip stayed blank: the label was compared against
// the sidebar keys with `===`.
//
// Both bars now resolve through these helpers, which collapse every alias onto
// the single sidebar entry that owns it. Add a new module route and it lights
// up its section automatically.

// Section -> the sidebar entry that owns it. SECTIONS has no `volunteer`
// module, but its modules live under the volunteer section dashboard.
const SECTION_SIDEBAR_KEY = { volunteer: 'volunteer_network' };

const itemPath = (it) => it.path || (it.resource ? `/ims/r/${it.resource}` : null);

// Maps the many historical page labels onto a real sidebar key.
const ACTIVE_ALIASES = {
  main_dashboard: 'main_dashboard',
  dashboard: 'main_dashboard',
  notification_centre: 'notifications',
  contacts: 'notifications',
  complaint_grievance: 'complaint_grievance',
  social_publisher: 'social_publisher',
  volunteer_dashboard: 'volunteer_network',
  finance_dashboard: 'finance',
  cost_centres: 'finance',
  ledger_journal: 'finance',
  receipts_payments: 'finance',
  cash_accounts: 'finance',
  bank_accounts: 'finance',
  statement_import: 'finance',
  users_perms: 'admin',
  users: 'admin',
  audit_trail: 'admin',
  data: 'admin',
  import_export: 'admin',
  office_history: 'organisation',
  history: 'organisation',
  org_profile: 'organisation',
  org_profile_pdf: 'organisation',
  documents: 'organisation',
  download_center: 'records',
};

export function sidebarKeyFor(active) {
  if (!active) return null;
  const key = String(active);
  if (key.endsWith('_dashboard')) return SECTION_SIDEBAR_KEY[key.slice(0, -'_dashboard'.length)] || key.slice(0, -'_dashboard'.length);
  if (ACTIVE_ALIASES[key]) return ACTIVE_ALIASES[key];
  // Section-dashboard modules and bare module keys that ARE sidebar entries.
  for (const id of Object.keys(SECTIONS)) {
    if (sectionGroups(id).some((g) => g.items.some((it) => it.key === key))) {
      return SECTION_SIDEBAR_KEY[id] || id;
    }
  }
  if (SIDEBAR.some((s) => s.key === key)) return key;
  // A bare `resource` label (e.g. "policies", "members") that names a module.
  for (const id of Object.keys(SECTIONS)) {
    if (sectionGroups(id).some((g) => g.items.some((it) => it.resource === key))) {
      return SECTION_SIDEBAR_KEY[id] || id;
    }
  }
  return null;
}

export function sidebarKeyForPath(pathname) {
  if (!pathname || !pathname.startsWith('/ims')) return null;
  const direct = SIDEBAR.find((s) => s.path === pathname);
  if (direct) return direct.key;
  // /ims/sections/<id> is a section dashboard even when the sidebar entry uses
  // a friendlier path (volunteer -> /ims/volunteer-network).
  const dash = pathname.match(/^\/ims\/sections\/([^/]+)\/?$/);
  if (dash && SECTIONS[dash[1]]) return SECTION_SIDEBAR_KEY[dash[1]] || dash[1];
  if (pathname.startsWith('/ims/r/')) {
    for (const id of Object.keys(SECTIONS)) {
      if (sectionGroups(id).some((g) => g.items.some((it) => itemPath(it) === pathname))) {
        return SECTION_SIDEBAR_KEY[id] || id;
      }
    }
  }
  for (const id of Object.keys(SECTIONS)) {
    if (sectionGroups(id).some((g) => g.items.some((it) => it.path === pathname))) {
      return SECTION_SIDEBAR_KEY[id] || id;
    }
  }
  return null;
}
