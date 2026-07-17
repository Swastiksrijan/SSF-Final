import ApplicationCounter from '../../../models/shared/ApplicationCounter.js';

class IDGeneratorService {
  /**
   * Generate unique application ID
   */
  async generateApplicationId(applicationType) {
    try {
      const result = await ApplicationCounter.getNextId(applicationType);
      return result;
    } catch (error) {
      console.error('Error generating application ID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Parse application ID to get details
   */
  parseApplicationId(applicationId) {
    try {
      // Format: SSF-VOL-2026-000001
      const parts = applicationId.split('-');
      
      if (parts.length !== 4 || parts[0] !== 'SSF') {
        return {
          success: false,
          error: 'Invalid application ID format'
        };
      }

      const typeMap = {
        'VOL': 'VOLUNTEER',
        'MEM': 'MEMBERSHIP',
        'DON': 'DONOR',
        'INT': 'INTERNSHIP',
        'LDR': 'LEADERSHIP',
        'PAR': 'PARTNER',
        'EVT': 'EVENT'
      };

      const prefix = parts[1];
      const year = parseInt(parts[2]);
      const counter = parseInt(parts[3]);

      return {
        success: true,
        data: {
          prefix,
          applicationType: typeMap[prefix],
          year,
          counter,
          fullId: applicationId
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
   * Validate application ID format
   */
  isValidApplicationId(applicationId) {
    const result = this.parseApplicationId(applicationId);
    return result.success;
  }

  /**
   * Extract year from application ID
   */
  extractYear(applicationId) {
    const result = this.parseApplicationId(applicationId);
    if (result.success) {
      return result.data.year;
    }
    return null;
  }

  /**
   * Extract type from application ID
   */
  extractType(applicationId) {
    const result = this.parseApplicationId(applicationId);
    if (result.success) {
      return result.data.applicationType;
    }
    return null;
  }
}

export default new IDGeneratorService();
