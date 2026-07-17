import Application from '../../../models/shared/Application.js';
import ApplicationCounter from '../../../models/shared/ApplicationCounter.js';
import IDGeneratorService from '../../../utils/idGenerator.js';
import AuditLog from '../../../models/shared/AuditLog.js';
import { validateEmail } from '../../../utils/validators.js';

class ApplicationService {
  /**
   * Create new application
   */
  async createApplication(applicationType, applicationData, userId, ipAddress) {
    try {
      const { fullName, email, mobileNumber } = applicationData;

      // Validate required fields
      if (!fullName || !email || !mobileNumber) {
        return {
          success: false,
          error: 'Full name, email, and mobile number are required'
        };
      }

      if (!validateEmail(email)) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      // Check for duplicate application
      const existingApp = await Application.findOne({
        email,
        mobileNumber,
        applicationType,
        isDeleted: false
      });

      if (existingApp && existingApp.status !== 'REJECTED') {
        return {
          success: false,
          error: `You already have a ${applicationType.toLowerCase()} application pending`
        };
      }

      // Generate application ID
      const idResult = await IDGeneratorService.generateApplicationId(applicationType);
      if (!idResult.success) {
        return {
          success: false,
          error: 'Failed to generate application ID'
        };
      }

      // Create application
      const applicationPayload = {
        ...applicationData,
        applicationType,
        applicationId: idResult.applicationId,
        user: userId,
        email: email.toLowerCase(),
        ipAddress,
        status: 'PENDING',
        submittedAt: new Date()
      };

      const application = new Application(applicationPayload);
      await application.save();

      // Log creation
      await AuditLog.log({
        action: 'APPLICATION_CREATED',
        actor: userId,
        targetEntity: 'Application',
        targetId: application._id,
        actorEmail: email,
        description: `${applicationType} application created: ${idResult.applicationId}`,
        details: { applicationId: idResult.applicationId, applicationType },
        status: 'SUCCESS',
        ipAddress,
        severity: 'MEDIUM'
      });

      return {
        success: true,
        message: 'Application created successfully',
        data: application,
        applicationId: idResult.applicationId
      };
    } catch (error) {
      console.error('Error creating application:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get application by ID
   */
  async getApplicationById(applicationId) {
    try {
      const application = await Application.findById(applicationId)
        .populate('user', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
        .populate('approvedBy', 'firstName lastName email');

      if (!application) {
        return {
          success: false,
          error: 'Application not found'
        };
      }

      return {
        success: true,
        data: application
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get application by application ID (SSF-VOL-2026-000001)
   */
  async getApplicationByApplicationId(applicationId) {
    try {
      const application = await Application.findOne({ applicationId })
        .populate('user', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
        .populate('approvedBy', 'firstName lastName email');

      if (!application) {
        return {
          success: false,
          error: 'Application not found'
        };
      }

      return {
        success: true,
        data: application
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all applications (with filters)
   */
  async getApplications(filters = {}, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const query = { isDeleted: false, ...filters };

      const applications = await Application.find(query)
        .populate('user', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
        .populate('approvedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Application.countDocuments(query);

      return {
        success: true,
        data: applications,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get applications by status
   */
  async getApplicationsByStatus(status, applicationType = null) {
    try {
      const query = { status, isDeleted: false };
      if (applicationType) {
        query.applicationType = applicationType;
      }

      const applications = await Application.find(query)
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: applications
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user applications
   */
  async getUserApplications(userId) {
    try {
      const applications = await Application.find({ user: userId, isDeleted: false })
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: applications
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update application
   */
  async updateApplication(applicationId, updateData) {
    try {
      const application = await Application.findByIdAndUpdate(
        applicationId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!application) {
        return {
          success: false,
          error: 'Application not found'
        };
      }

      // Log update
      await AuditLog.log({
        action: 'APPLICATION_UPDATED',
        targetEntity: 'Application',
        targetId: applicationId,
        description: 'Application updated',
        changes: { after: updateData },
        status: 'SUCCESS',
        severity: 'LOW'
      });

      return {
        success: true,
        message: 'Application updated successfully',
        data: application
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(applicationId, newStatus, changedBy, changedByEmail, notes = '') {
    try {
      const application = await Application.findById(applicationId);

      if (!application) {
        return {
          success: false,
          error: 'Application not found'
        };
      }

      const result = await application.updateStatus(newStatus, changedBy, changedByEmail, notes);

      if (result.success) {
        // Log status change
        await AuditLog.log({
          action: 'APPLICATION_STATUS_CHANGED',
          actor: changedBy,
          targetEntity: 'Application',
          targetId: applicationId,
          actorEmail: changedByEmail,
          description: `Status changed from ${application.statusHistory[application.statusHistory.length - 2]?.status || 'NEW'} to ${newStatus}`,
          details: { newStatus, notes },
          status: 'SUCCESS',
          severity: 'MEDIUM'
        });
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Assign application to moderator
   */
  async assignApplication(applicationId, assignedTo) {
    try {
      const application = await Application.findByIdAndUpdate(
        applicationId,
        { assignedTo },
        { new: true }
      ).populate('assignedTo', 'firstName lastName email');

      if (!application) {
        return {
          success: false,
          error: 'Application not found'
        };
      }

      return {
        success: true,
        message: 'Application assigned successfully',
        data: application
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get statistics
   */
  async getStatistics(applicationType = null) {
    try {
      const match = { isDeleted: false };
      if (applicationType) {
        match.applicationType = applicationType;
      }

      const stats = await Application.aggregate([
        { $match: match },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const byType = await Application.aggregate([
        { $match: match },
        {
          $group: {
            _id: '$applicationType',
            count: { $sum: 1 }
          }
        }
      ]);

      const total = await Application.countDocuments(match);

      return {
        success: true,
        data: {
          total,
          byStatus: stats.reduce((acc, s) => {
            acc[s._id] = s.count;
            return acc;
          }, {}),
          byType: byType.reduce((acc, t) => {
            acc[t._id] = t.count;
            return acc;
          }, {})
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete application (soft delete)
   */
  async deleteApplication(applicationId, deletedBy, reason) {
    try {
      const application = await Application.findById(applicationId);

      if (!application) {
        return {
          success: false,
          error: 'Application not found'
        };
      }

      await application.softDelete(deletedBy, reason);

      return {
        success: true,
        message: 'Application deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new ApplicationService();
