/**
 * Status workflow validation and transitions
 */

const VALID_STATUS_TRANSITIONS = {
  'PENDING': ['UNDER_REVIEW', 'REJECTED', 'NEED_MORE_INFO'],
  'UNDER_REVIEW': ['BACKGROUND_CHECK', 'APPROVED', 'REJECTED', 'NEED_MORE_INFO'],
  'BACKGROUND_CHECK': ['APPROVED', 'REJECTED', 'NEED_MORE_INFO'],
  'APPROVED': ['NEED_MORE_INFO'],
  'REJECTED': ['NEED_MORE_INFO'],
  'NEED_MORE_INFO': ['UNDER_REVIEW', 'REJECTED']
};

const STATUS_DESCRIPTIONS = {
  'PENDING': 'Application submitted and awaiting review',
  'UNDER_REVIEW': 'Application is being reviewed by admin',
  'BACKGROUND_CHECK': 'Background verification in progress',
  'APPROVED': 'Application approved successfully',
  'REJECTED': 'Application has been rejected',
  'NEED_MORE_INFO': 'More information required from applicant'
};

const STATUS_COLORS = {
  'PENDING': 'yellow',
  'UNDER_REVIEW': 'blue',
  'BACKGROUND_CHECK': 'purple',
  'APPROVED': 'green',
  'REJECTED': 'red',
  'NEED_MORE_INFO': 'orange'
};

/**
 * Validate status transition
 */
export const isValidTransition = (currentStatus, newStatus) => {
  if (!VALID_STATUS_TRANSITIONS[currentStatus]) {
    return { valid: false, error: `Unknown current status: ${currentStatus}` };
  }

  if (VALID_STATUS_TRANSITIONS[currentStatus].includes(newStatus)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: `Cannot transition from ${currentStatus} to ${newStatus}`
  };
};

/**
 * Get available transitions for a status
 */
export const getAvailableTransitions = (currentStatus) => {
  return VALID_STATUS_TRANSITIONS[currentStatus] || [];
};

/**
 * Get status description
 */
export const getStatusDescription = (status) => {
  return STATUS_DESCRIPTIONS[status] || 'Unknown status';
};

/**
 * Get status color (for UI)
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'gray';
};

/**
 * Check if application is in terminal state
 */
export const isTerminalStatus = (status) => {
  return ['APPROVED', 'REJECTED'].includes(status);
};

/**
 * Check if application needs action
 */
export const needsAction = (status) => {
  return ['PENDING', 'UNDER_REVIEW', 'NEED_MORE_INFO'].includes(status);
};

/**
 * Get SLA days based on application type and status
 */
export const getSLADays = (applicationType, status) => {
  const slas = {
    'PENDING': 2,
    'UNDER_REVIEW': 3,
    'BACKGROUND_CHECK': 5,
    'NEED_MORE_INFO': 2
  };

  return slas[status] || null;
};

/**
 * Check if application is overdue
 */
export const isOverdue = (submittedAt, status) => {
  const slaDays = getSLADays('VOLUNTEER', status);
  if (!slaDays) return false;

  const now = new Date();
  const submitted = new Date(submittedAt);
  const daysElapsed = Math.ceil((now - submitted) / (1000 * 60 * 60 * 24));

  return daysElapsed > slaDays;
};

/**
 * Get status badge information
 */
export const getStatusBadge = (status) => {
  return {
    status,
    description: getStatusDescription(status),
    color: getStatusColor(status),
    isTerminal: isTerminalStatus(status),
    needsAction: needsAction(status)
  };
};

export default {
  VALID_STATUS_TRANSITIONS,
  STATUS_DESCRIPTIONS,
  STATUS_COLORS,
  isValidTransition,
  getAvailableTransitions,
  getStatusDescription,
  getStatusColor,
  isTerminalStatus,
  needsAction,
  getSLADays,
  isOverdue,
  getStatusBadge
};
