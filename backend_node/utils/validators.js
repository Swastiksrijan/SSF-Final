/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate mobile number (Indian format)
 */
export const validateMobileNumber = (mobileNumber) => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobileNumber);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password) => {
  if (password.length < 6) return { valid: false, error: 'Password must be at least 6 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain at least one uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Password must contain at least one lowercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Password must contain at least one number' };
  return { valid: true };
};

/**
 * Validate OTP (6 digits)
 */
export const validateOTP = (otp) => {
  return /^[0-9]{6}$/.test(otp);
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Sanitize string (remove HTML tags)
 */
export const sanitizeString = (str) => {
  return str.replace(/[<>]/g, '').trim();
};

/**
 * Check if string is empty
 */
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

/**
 * Validate string length
 */
export const validateLength = (str, min, max) => {
  const length = str?.length || 0;
  return length >= min && length <= max;
};

export default {
  validateEmail,
  validateMobileNumber,
  validatePasswordStrength,
  validateOTP,
  validateURL,
  sanitizeString,
  isEmpty,
  validateLength
};
