import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-character-encryption-key';
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || 'default-16-char-iv';

/**
 * Encrypt sensitive data
 */
export const encrypt = (text) => {
  try {
    const iv = Buffer.from(ENCRYPTION_IV, 'hex');
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

/**
 * Decrypt sensitive data
 */
export const decrypt = (encrypted) => {
  try {
    const iv = Buffer.from(ENCRYPTION_IV, 'hex');
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Generate OTP (6-digit)
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP or token
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate JWT Token
 */
export const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRE 
  });
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

/**
 * Generate random string
 */
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash string with SHA256
 */
export const hashString = (string) => {
  return crypto.createHash('sha256').update(string).digest('hex');
};

/**
 * Compare two strings (constant time to prevent timing attacks)
 */
export const compareStrings = (str1, str2) => {
  const buf1 = Buffer.from(str1);
  const buf2 = Buffer.from(str2);
  
  if (buf1.length !== buf2.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(buf1, buf2);
};

/**
 * Extract IP address from request
 */
export const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.connection.socket?.remoteAddress ||
         'unknown';
};

/**
 * Get user agent from request
 */
export const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};

export default {
  encrypt,
  decrypt,
  generateOTP,
  hashToken,
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateRandomString,
  hashString,
  compareStrings,
  getClientIP,
  getUserAgent
};
