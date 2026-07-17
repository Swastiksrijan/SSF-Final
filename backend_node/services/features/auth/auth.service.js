import User from '../../../models/shared/User.js';
import AuditLog from '../../../models/shared/AuditLog.js';
import JWTService from './jwt.service.js';
import OTPService from './otp.service.js';
import { getClientIP, getUserAgent } from '../../../utils/security.js';
import { validateEmail, validatePasswordStrength } from '../../../utils/validators.js';

class AuthService {
  /**
   * Register a new user
   */
  async registerUser(userData, ipAddress) {
    try {
      const { firstName, lastName, email, password, mobileNumber } = userData;
      
      // Validate email
      if (!validateEmail(email)) {
        return { success: false, error: 'Invalid email format' };
      }
      
      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { mobileNumber }] 
      });
      
      if (existingUser) {
        return { success: false, error: 'Email or mobile number already registered' };
      }
      
      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        mobileNumber,
        accountStatus: 'ACTIVE',
        ipAddress
      });
      
      await newUser.save();
      
      // Log signup
      await AuditLog.log({
        action: 'USER_SIGNUP',
        targetEntity: 'User',
        targetId: newUser._id,
        actorEmail: email,
        description: `User registered: ${firstName} ${lastName}`,
        status: 'SUCCESS',
        ipAddress,
        severity: 'MEDIUM'
      });
      
      // Generate email verification OTP
      const otpResult = await OTPService.generateAndSendOTP(email);
      
      return {
        success: true,
        message: 'User registered successfully. Please verify your email.',
        user: newUser.toJSON(),
        requiresEmailVerification: true,
        otp: otpResult.otp // Remove in production
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Login user
   */
  async loginUser(email, password, ipAddress, userAgent) {
    try {
      // Validate email
      if (!validateEmail(email)) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Find user
      const user = await User.findOne({ email }).select('+password +lockUntil +loginAttempts');
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Check if account is suspended
      if (user.accountStatus === 'SUSPENDED') {
        return { success: false, error: 'Account is suspended' };
      }
      
      // Check if account is locked
      if (user.isAccountLocked()) {
        return { success: false, error: 'Account is locked. Please try again later.' };
      }
      
      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        // Increment login attempts
        await user.incLoginAttempts();
        
        // Log failed login
        await AuditLog.log({
          action: 'FAILED_LOGIN_ATTEMPT',
          targetEntity: 'User',
          targetId: user._id,
          actorEmail: email,
          status: 'FAILED',
          ipAddress,
          severity: 'HIGH'
        });
        
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Check if email is verified
      if (!user.emailVerified) {
        return { 
          success: false, 
          error: 'Email not verified. Please verify your email first.',
          requiresEmailVerification: true,
          userId: user._id
        };
      }
      
      // Reset login attempts
      await user.resetLoginAttempts();
      
      // Update last login
      user.lastLogin = new Date();
      user.lastLoginIP = ipAddress;
      user.loginHistory = user.loginHistory || [];
      user.loginHistory.push({
        timestamp: new Date(),
        ipAddress,
        userAgent
      });
      await user.save();
      
      // Generate tokens
      const accessToken = JWTService.generateAccessToken(
        user._id,
        user.email,
        user.role,
        user.roles
      );
      
      const refreshTokenResult = await JWTService.generateRefreshToken(
        user._id,
        ipAddress,
        userAgent
      );
      
      // Log successful login
      await AuditLog.log({
        action: 'USER_LOGIN',
        actor: user._id,
        targetEntity: 'User',
        targetId: user._id,
        actorEmail: email,
        actorRole: user.role,
        status: 'SUCCESS',
        ipAddress,
        severity: 'LOW'
      });
      
      return {
        success: true,
        message: 'Login successful',
        user: user.toJSON(),
        accessToken,
        refreshToken: refreshTokenResult.token,
        expiresIn: process.env.JWT_EXPIRE || '15m'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Logout user
   */
  async logoutUser(userId, refreshToken) {
    try {
      // Revoke refresh token
      if (refreshToken) {
        await JWTService.revokeRefreshToken(refreshToken);
      }
      
      // Log logout
      await AuditLog.log({
        action: 'USER_LOGOUT',
        actor: userId,
        targetEntity: 'User',
        targetId: userId,
        status: 'SUCCESS',
        severity: 'LOW'
      });
      
      return { success: true, message: 'Logout successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(email, otp) {
    try {
      const result = await OTPService.verifyOTP(email, otp);
      
      if (result.success) {
        const user = await User.findOne({ email });
        
        // Log email verification
        await AuditLog.log({
          action: 'EMAIL_VERIFIED',
          actor: user._id,
          targetEntity: 'User',
          targetId: user._id,
          actorEmail: email,
          status: 'SUCCESS',
          severity: 'MEDIUM'
        });
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        // Don't reveal if email exists or not (security)
        return { success: true, message: 'If email exists, password reset OTP has been sent.' };
      }
      
      const result = await OTPService.createPasswordResetOTP(email);
      
      if (result.success) {
        await AuditLog.log({
          action: 'PASSWORD_RESET_REQUESTED',
          actor: user._id,
          targetEntity: 'User',
          targetId: user._id,
          actorEmail: email,
          status: 'SUCCESS',
          severity: 'MEDIUM'
        });
      }
      
      return {
        success: true,
        message: 'If email exists, password reset OTP has been sent.',
        otp: result.otp // Remove in production
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email, otp, newPassword) {
    try {
      // Validate password strength
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }
      
      // Verify OTP
      const otpResult = await OTPService.verifyPasswordResetOTP(email, otp);
      if (!otpResult.success) {
        return otpResult;
      }
      
      // Update password
      const user = await User.findOne({ email });
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      // Revoke all refresh tokens
      await JWTService.revokeAllRefreshTokens(user._id);
      
      // Log password reset
      await AuditLog.log({
        action: 'PASSWORD_RESET_COMPLETED',
        actor: user._id,
        targetEntity: 'User',
        targetId: user._id,
        actorEmail: email,
        status: 'SUCCESS',
        severity: 'HIGH'
      });
      
      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken, ipAddress) {
    try {
      // Verify refresh token JWT
      const tokenVerification = JWTService.verifyRefreshToken(refreshToken);
      if (!tokenVerification.valid) {
        return { success: false, error: 'Invalid refresh token' };
      }
      
      // Check if token exists in database and is valid
      const dbValidation = await JWTService.validateRefreshTokenDB(refreshToken, ipAddress);
      if (!dbValidation.valid) {
        return { success: false, error: dbValidation.error };
      }
      
      const user = dbValidation.refreshTokenDoc.user;
      
      // Generate new access token
      const newAccessToken = JWTService.generateAccessToken(
        user._id,
        user.email,
        user.role,
        user.roles
      );
      
      return {
        success: true,
        accessToken: newAccessToken,
        expiresIn: process.env.JWT_EXPIRE || '15m'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();
