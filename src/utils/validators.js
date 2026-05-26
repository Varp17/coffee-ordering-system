/**
 * Validate email address format
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate Indian phone number (10 digits)
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  // Strip country code before testing
  const stripped = phone.replace(/^\+91\s?|^0/, '').replace(/\D/g, '');
  return re.test(stripped);
};

/**
 * Validate OTP code (4 or 6 digits)
 * @param {string} otp
 * @returns {boolean}
 */
export const validateOtp = (otp) => {
  return /^\d{4,6}$/.test(otp);
};
