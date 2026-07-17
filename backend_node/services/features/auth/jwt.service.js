import jwt from 'jsonwebtoken';
import RefreshToken from '../../../models/shared/RefreshToken.js';
import { hashToken, generateRandomString } from '../../../utils/security.js';

class JWTService {
  /**
   * Generate Access Token
   */
  generateAccessToken(userId, email, role, roles) {
    const payload = {
      userId,
      email,
      role,
      roles,
      type: 'access'
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '15m'
    });
  }

  /**
   * Generate Refresh Token and save to database
   */
  async generateRefreshToken(userId, ipAddress, userAgent) {
    const payload = {
      userId,
      tokenFamily: generateRandomString(16),
      type: 'refresh'
    };
    
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
    });
    
    const decoded = jwt.decode(token);
    const tokenHash = hashToken(token);
    
    // Save refresh token to database
    const refreshTokenDoc = new RefreshToken({
      user: userId,
      token: tokenHash,
      tokenHash,
      expiresAt: new Date(decoded.exp * 1000),
      ipAddress,
      userAgent,
      family: payload.tokenFamily,
      isValid: true
    });
    
    await refreshTokenDoc.save();
    
    return {
      token,
      expiresAt: decoded.exp,
      refreshTokenId: refreshTokenDoc._id
    };
  }

  /**
   * Verify Access Token
   */
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Verify Refresh Token
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Check if refresh token exists in database and is valid
   */
  async validateRefreshTokenDB(token, ipAddress) {
    try {
      const tokenHash = hashToken(token);
      
      const refreshTokenDoc = await RefreshToken.findOne({
        tokenHash,
        isValid: true
      }).populate('user');
      
      if (!refreshTokenDoc) {
        return { valid: false, error: 'Refresh token not found or revoked' };
      }
      
      if (refreshTokenDoc.isExpired()) {
        await refreshTokenDoc.revoke();
        return { valid: false, error: 'Refresh token expired' };
      }
      
      // Optional: Check if IP matches
      if (refreshTokenDoc.ipAddress !== ipAddress) {
        // Log potential token reuse attack
        console.warn(`Potential token reuse attack detected for user ${refreshTokenDoc.user._id}`);
      }
      
      return { valid: true, refreshTokenDoc };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Revoke Refresh Token
   */
  async revokeRefreshToken(token) {
    try {
      const tokenHash = hashToken(token);
      const refreshTokenDoc = await RefreshToken.findOne({ tokenHash });
      
      if (refreshTokenDoc) {
        await refreshTokenDoc.revoke();
        return { success: true };
      }
      
      return { success: false, error: 'Token not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllRefreshTokens(userId) {
    try {
      await RefreshToken.updateMany(
        { user: userId, isValid: true },
        { isValid: false, revokedAt: new Date() }
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get token expiration
   */
  getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token);
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get time until token expiry (in seconds)
   */
  getTimeUntilExpiry(token) {
    try {
      const decoded = jwt.decode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp - now;
    } catch (error) {
      return null;
    }
  }
}

export default new JWTService();
