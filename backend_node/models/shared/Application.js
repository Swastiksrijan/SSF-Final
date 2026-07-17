import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    // Application Identification
    applicationId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    applicationType: {
      type: String,
      enum: ['VOLUNTEER', 'MEMBERSHIP', 'DONOR', 'INTERNSHIP', 'LEADERSHIP', 'PARTNER', 'EVENT'],
      required: [true, 'Application type is required'],
      index: true
    },

    // Applicant Information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      index: true
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^[0-9]{10}$/, 'Mobile number must be 10 digits'],
      index: true
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },

    // Address Information
    address: String,
    city: String,
    district: String,
    state: String,
    pinCode: {
      type: String,
      match: [/^[0-9]{6}$/, 'PIN code must be 6 digits']
    },

    // Professional Information
    highestQualification: String,
    occupation: String,
    organization: String,

    // File Uploads (Generic)
    profilePhoto: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    resume: {
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    idProof: {
      type: {
        type: String,
        enum: ['AADHAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE']
      },
      number: String,
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    },
    otherDocuments: [{
      name: String,
      fileName: String,
      fileUrl: String,
      uploadedAt: Date
    }],

    // Application Status
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'BACKGROUND_CHECK', 'APPROVED', 'REJECTED', 'NEED_MORE_INFO'],
      default: 'PENDING',
      index: true
    },
    statusHistory: [{
      status: String,
      changedAt: { type: Date, default: Date.now },
      changedBy: mongoose.Schema.Types.ObjectId,
      changedByEmail: String,
      notes: String,
      reason: String
    }],

    // Admin Review
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String,
    rejectedAt: Date,
    adminNotes: String,

    // Communication Tracking
    confirmationEmailSent: {
      type: Boolean,
      default: false
    },
    adminNotificationEmailSent: {
      type: Boolean,
      default: false
    },
    statusUpdateEmailSent: {
      type: Boolean,
      default: false
    },

    // Verification Details
    backgroundCheckStatus: {
      type: String,
      enum: ['NOT_INITIATED', 'PENDING', 'CLEARED', 'FAILED'],
      default: 'NOT_INITIATED'
    },
    backgroundCheckNotes: String,
    backgroundCheckDate: Date,
    backgroundCheckCertificate: String,

    // Declaration & Consent
    declarationAccepted: {
      type: Boolean,
      default: false
    },
    termsAccepted: {
      type: Boolean,
      default: false
    },
    privacyPolicyAccepted: {
      type: Boolean,
      default: false
    },

    // Application Metadata
    formVersion: {
      type: String,
      default: '1.0'
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    ipAddress: String,
    userAgent: String,
    deviceInfo: String,

    // Custom Fields (For extensibility)
    customFields: mongoose.Schema.Types.Mixed,

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: Date,
    deletedBy: mongoose.Schema.Types.ObjectId,
    deletionReason: String,

    // Tags and Categorization
    tags: [String],
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM'
    },

    // Notes
    internalNotes: String,
    applicantNotes: String
  },
  {
    timestamps: true,
    discriminatorKey: 'applicationType',
    collection: 'applications'
  }
);

// Indexes for performance
applicationSchema.index({ applicationId: 1 });
applicationSchema.index({ email: 1, applicationType: 1 });
applicationSchema.index({ mobileNumber: 1, applicationType: 1 });
applicationSchema.index({ status: 1, submittedAt: -1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ assignedTo: 1, status: 1 });
applicationSchema.index({ user: 1, applicationType: 1 });

// Virtual for application age in days
applicationSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const submitted = new Date(this.submittedAt);
  const diffTime = Math.abs(now - submitted);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to update status
applicationSchema.methods.updateStatus = async function(newStatus, changedBy, changedByEmail, notes = '') {
  try {
    // Validate status transition
    const validTransitions = {
      'PENDING': ['UNDER_REVIEW', 'REJECTED', 'NEED_MORE_INFO'],
      'UNDER_REVIEW': ['BACKGROUND_CHECK', 'APPROVED', 'REJECTED', 'NEED_MORE_INFO'],
      'BACKGROUND_CHECK': ['APPROVED', 'REJECTED', 'NEED_MORE_INFO'],
      'APPROVED': ['NEED_MORE_INFO'],
      'REJECTED': ['NEED_MORE_INFO'],
      'NEED_MORE_INFO': ['UNDER_REVIEW', 'REJECTED']
    };

    if (!validTransitions[this.status]?.includes(newStatus)) {
      return {
        success: false,
        error: `Cannot transition from ${this.status} to ${newStatus}`
      };
    }

    // Add to status history
    this.statusHistory.push({
      status: newStatus,
      changedAt: new Date(),
      changedBy,
      changedByEmail,
      notes,
      reason: ''
    });

    // Update current status
    this.status = newStatus;

    // Set approval/rejection dates
    if (newStatus === 'APPROVED') {
      this.approvedAt = new Date();
      this.approvedBy = changedBy;
    } else if (newStatus === 'REJECTED') {
      this.rejectedAt = new Date();
      this.rejectionReason = notes;
    }

    await this.save();

    return {
      success: true,
      message: `Status updated to ${newStatus}`,
      application: this
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Method to get age
applicationSchema.methods.getAge = function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  let age = today.getFullYear() - this.dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
    age--;
  }
  return age;
};

// Method to check if application is pending approval
applicationSchema.methods.isPendingApproval = function() {
  return ['PENDING', 'UNDER_REVIEW', 'BACKGROUND_CHECK'].includes(this.status);
};

// Method to check if application is approved
applicationSchema.methods.isApproved = function() {
  return this.status === 'APPROVED';
};

// Method to check if application is rejected
applicationSchema.methods.isRejected = function() {
  return this.status === 'REJECTED';
};

// Method to soft delete
applicationSchema.methods.softDelete = async function(deletedBy, reason) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  this.deletionReason = reason;
  return this.save();
};

// Query helper to exclude soft-deleted records
applicationSchema.query.notDeleted = function() {
  return this.where({ isDeleted: false });
};

// Default query middleware
applicationSchema.pre(/^find/, function() {
  if (!this.options._recursed) {
    this.notDeleted();
  }
});

export default mongoose.model('Application', applicationSchema);
