// SSF-IMS RBAC. Roles + module/action permissions. Sensitive data gated.
const { models } = require('../../models/ims');

const ROLES = {
  super_admin: { en: 'Super Admin', hi: 'सुपर एडमिन', all: true },
  org_admin: { en: 'Organisation Admin', hi: 'संस्था एडमिन', all: true },
  president: { en: 'President', hi: 'अध्यक्ष' },
  secretary: { en: 'Secretary', hi: 'सचिव' },
  treasurer: { en: 'Treasurer', hi: 'कोषाध्यक्ष' },
  finance_officer: { en: 'Finance Officer', hi: 'वित्त अधिकारी' },
  programme_manager: { en: 'Programme Manager', hi: 'कार्यक्रम प्रबंधक' },
  hr_admin: { en: 'HR / Admin', hi: 'मानव संसाधन / प्रशासन' },
  compliance_officer: { en: 'Compliance Officer', hi: 'अनुपालन अधिकारी' },
  auditor: { en: 'Auditor', hi: 'लेखा परीक्षक' },
  reviewer: { en: 'Reviewer', hi: 'समीक्षक' },
  data_entry: { en: 'Data Entry Operator', hi: 'डेटा एंट्री ऑपरेटर' },
  volunteer_coordinator: { en: 'Volunteer Coordinator', hi: 'स्वयंसेवक समन्वयक' },
  read_only: { en: 'Read Only', hi: 'केवल पढ़ें' },
  case_officer: { en: 'Restricted Case Officer', hi: 'गोपनीय प्रकरण अधिकारी', restricted: true },
};

// Default module grants per role. '*' = every module.
const DEFAULT_GRANTS = {
  super_admin: { modules: ['*'], actions: ['*'] },
  org_admin: { modules: ['*'], actions: ['*'] },
  president: { modules: ['*'], actions: ['view', 'approve', 'export', 'create', 'edit'] },
  secretary: { modules: ['*'], actions: ['view', 'create', 'edit', 'export', 'approve'] },
  treasurer: { modules: ['finance', 'donors', 'grants', 'assets', 'procurement', 'reports', 'organisation', 'governance', 'audit'], actions: ['view', 'create', 'edit', 'approve', 'export'] },
  finance_officer: { modules: ['finance', 'donors', 'grants', 'assets', 'procurement', 'reports'], actions: ['view', 'create', 'edit', 'export'] },
  programme_manager: { modules: ['programmes', 'projects', 'activities', 'beneficiaries', 'volunteers', 'documents', 'reports'], actions: ['view', 'create', 'edit', 'export'] },
  hr_admin: { modules: ['people', 'hr', 'volunteers', 'attendance', 'documents'], actions: ['view', 'create', 'edit', 'export'] },
  compliance_officer: { modules: ['compliance', 'legal', 'audit', 'risk', 'documents', 'reports'], actions: ['view', 'create', 'edit', 'export'] },
  auditor: { modules: ['audit', 'finance', 'compliance', 'reports', 'documents'], actions: ['view', 'export'] },
  reviewer: { modules: ['*'], actions: ['view', 'approve'] },
  data_entry: { modules: ['people', 'members', 'donors', 'programmes', 'projects', 'activities', 'documents', 'finance'], actions: ['view', 'create', 'edit'] },
  volunteer_coordinator: { modules: ['volunteers', 'activities', 'projects', 'beneficiaries', 'documents'], actions: ['view', 'create', 'edit'] },
  read_only: { modules: ['*'], actions: ['view'] },
  case_officer: { modules: ['cases', 'notices', 'people', 'documents'], actions: ['view', 'create', 'edit'] },
};

function can(roleCode, module, action) {
  const g = DEFAULT_GRANTS[roleCode];
  if (!g) return false;
  const modOk = g.modules.includes('*') || g.modules.includes(module);
  const actOk = g.actions.includes('*') || g.actions.includes(action);
  return modOk && actOk;
}

/** Express guard: require a module+action permission via header X-IMS-Role. */
function requirePerm(module, action) {
  return (req, res, next) => {
    const role = (req.headers['x-ims-role'] || 'super_admin').toString();
    if (!can(role, module, action)) {
      return res.status(403).json({ message: 'Permission denied', role, module, action });
    }
    req.imsRole = role;
    next();
  };
}

module.exports = { ROLES, DEFAULT_GRANTS, can, requirePerm };
