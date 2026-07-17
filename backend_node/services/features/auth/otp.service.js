import { generateOTP, hashToken } from '../../../utils/security.js';
import User from '../../../models/shared/User.js';

class OTPService {
  /**
   * Generate and save OTP
   */
  async generateAndSendOTP(email) {
    try {
      const otp = generateOTP();
      const otpHash = hashToken(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      const user = await User.findByIdAndUpdate(
        { email },
        {
          emailVerificationToken: otpHash,
          emailVerificationExpires: expiresAt,
          emailVerificationAttempts: 0
        },
        { new: true }
      );
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      return {
        success: true,
        otp, // Return OTP for testing/development
        message: 'OTP generated successfully',
        expiresAt
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(email, otp) {
    try {
      const otpHash = hashToken(otp);
      
      const user = await User.findOne({ email }).select('+emailVerificationToken +emailVerificationExpires +emailVerificationAttempts');
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      // Check if OTP is expired
      if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
        return { success: false, error: 'OTP has expired' };
      }
      
      // Check if max attempts exceeded
      if (user.emailVerificationAttempts >= 3) {
        return { success: false, error: 'Maximum OTP attempts exceeded' };
      }
      
      // Check if OTP matches
      if (user.emailVerificationToken !== otpHash) {
        user.emailVerificationAttempts += 1;
        await user.save();
        return { 
          success: false, 
          error: 'Invalid OTP',
          attemptsLeft: 3 - user.emailVerificationAttempts
        };
      }
      
      // OTP is valid - mark email as verified
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      user.emailVerificationAttempts = 0;
      await user.save();
      
      return {
        success: true,
        message: 'Email verified successfully'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(email) {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      if (user.emailVerified) {
        return { success: false, error: 'Email is already verified' };
      }
      
      // Reset attempts and generate new OTP
      return await this.generateAndSendOTP(email);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create password reset OTP
   */
  async createPasswordResetOTP(email) {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      const otp = generateOTP();
      const otpHash = hashToken(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      user.passwordResetToken = otpHash;
      user.passwordResetExpires = expiresAt;
      await user.save();
      
      return {
        success: true,
        otp,
        message: 'Password reset OTP generated',
        expiresAt
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify password reset OTP
   */
  async verifyPasswordResetOTP(email, otp) {
    try {
      const otpHash = hashToken(otp);
      
      const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      
      // Check if OTP is expired
      if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        return { success: false, error: 'OTP has expired' };
      }
      
      // Check if OTP matches
      if (user.passwordResetToken !== otpHash) {
        return { success: false, error: 'Invalid OTP' };
      }
      
      return { success: true, message: 'OTP verified' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new OTPService();
