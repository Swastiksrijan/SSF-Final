import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'USER_SIGNUP',
        'USER_LOGIN',
        'USER_LOGOUT',
        'EMAIL_VERIFIED',
        'PASSWORD_RESET_REQUESTED',
        'PASSWORD_RESET_COMPLETED',
        'PASSWORD_CHANGED',
        'ACCOUNT_SUSPENDED',
        'ACCOUNT_ACTIVATED',
        'ACCOUNT_DELETED',
        'APPLICATION_CREATED',
        'APPLICATION_UPDATED',
        'APPLICATION_STATUS_CHANGED',
        'ADMIN_LOGIN',
        'ADMIN_ACTION',
        'FAILED_LOGIN_ATTEMPT',
        'ACCOUNT_LOCKED',
        'TOKEN_REVOKED',
        'EMAIL_SENT',
        'FILE_UPLOADED'
      ],
      index: true
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    actorRole: String,
    actorEmail: String,
    targetEntity: {
      type: String,
      enum: ['User', 'Application', 'Admin', 'Volunteer', 'System']
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    description: String,
    details: mongoose.Schema.Types.Mixed,
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING'],
      default: 'SUCCESS'
    },
    errorMessage: String,
    ipAddress: {
      type: String,
      index: true
    },
    userAgent: String,
    httpMethod: String,
    endpoint: String,
    statusCode: Number,
    responseTime: Number, // in milliseconds
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for common queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ severity: 1, createdAt: -1 });
auditLogSchema.index({ targetEntity: 1, targetId: 1 });
auditLogSchema.index({ ipAddress: 1, createdAt: -1 });

// TTL Index - Keep logs for 90 days (7776000 seconds)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Statics for creating audit logs
auditLogSchema.statics.log = async function({
  action,
  actor,
  actorRole,
  actorEmail,
  targetEntity,
  targetId,
  description,
  details,
  changes,
  status,
  errorMessage,
  ipAddress,
  userAgent,
  httpMethod,
  endpoint,
  statusCode,
  responseTime,
  severity
}) {
  try {
    return await this.create({
      action,
      actor,
      actorRole,
      actorEmail,
      targetEntity,
      targetId,
      description,
      details,
      changes,
      status,
      errorMessage,
      ipAddress,
      userAgent,
      httpMethod,
      endpoint,
      statusCode,
      responseTime,
      severity
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

export default mongoose.model('AuditLog', auditLogSchema);
