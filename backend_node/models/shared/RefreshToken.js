import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 } // Auto-delete expired tokens
    },
    revokedAt: Date,
    revokedBy: String,
    ipAddress: String,
    userAgent: String,
    deviceInfo: String,
    isValid: {
      type: Boolean,
      default: true,
      index: true
    },
    replacedByToken: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RefreshToken'
    },
    family: {
      type: String,
      index: true
    } // For detecting token reuse attacks
  },
  {
    timestamps: true
  }
);

// Indexes
refreshTokenSchema.index({ user: 1, isValid: 1 });
refreshTokenSchema.index({ createdAt: -1 });

// Method to revoke token
refreshTokenSchema.methods.revoke = function() {
  this.isValid = false;
  this.revokedAt = new Date();
  return this.save();
};

// Method to check if token is expired
refreshTokenSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

// Method to check if token is valid and not revoked
refreshTokenSchema.methods.isValidToken = function() {
  return this.isValid && !this.isExpired() && !this.revokedAt;
};

export default mongoose.model('RefreshToken', refreshTokenSchema);
