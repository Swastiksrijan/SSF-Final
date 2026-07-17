import mongoose from 'mongoose';

const applicationCounterSchema = new mongoose.Schema(
  {
    applicationType: {
      type: String,
      enum: ['VOLUNTEER', 'MEMBERSHIP', 'DONOR', 'INTERNSHIP', 'LEADERSHIP', 'PARTNER', 'EVENT'],
      required: true,
      unique: true,
      index: true
    },
    year: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear()
    },
    counter: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    },
    prefix: {
      type: String,
      enum: ['VOL', 'MEM', 'DON', 'INT', 'LDR', 'PAR', 'EVT'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Composite index for year and type
applicationCounterSchema.index({ applicationType: 1, year: 1 }, { unique: true });

/**
 * Get next application ID
 */
applicationCounterSchema.statics.getNextId = async function(applicationType) {
  const currentYear = new Date().getFullYear();
  
  const typeMap = {
    'VOLUNTEER': 'VOL',
    'MEMBERSHIP': 'MEM',
    'DONOR': 'DON',
    'INTERNSHIP': 'INT',
    'LEADERSHIP': 'LDR',
    'PARTNER': 'PAR',
    'EVENT': 'EVT'
  };
  
  const prefix = typeMap[applicationType];
  
  try {
    // Find or create counter for this year
    let counterDoc = await this.findOne({
      applicationType,
      year: currentYear
    });
    
    if (!counterDoc) {
      counterDoc = await this.create({
        applicationType,
        year: currentYear,
        prefix,
        counter: 0,
        lastReset: new Date()
      });
    }
    
    // Increment counter atomically
    const updatedCounter = await this.findByIdAndUpdate(
      counterDoc._id,
      { $inc: { counter: 1 } },
      { new: true }
    );
    
    // Generate application ID: SSF-VOL-2026-000001
    const paddedCounter = String(updatedCounter.counter).padStart(6, '0');
    const applicationId = `SSF-${prefix}-${currentYear}-${paddedCounter}`;
    
    return {
      success: true,
      applicationId,
      counter: updatedCounter.counter
    };
  } catch (error) {
    console.error('Error generating application ID:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Reset counter (for testing/admin purposes)
 */
applicationCounterSchema.statics.resetCounter = async function(applicationType) {
  try {
    const currentYear = new Date().getFullYear();
    const result = await this.updateOne(
      { applicationType, year: currentYear },
      { counter: 0, lastReset: new Date() }
    );
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default mongoose.model('ApplicationCounter', applicationCounterSchema);
