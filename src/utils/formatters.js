/**
 * Format raw numbers as Indian Rupees (₹)
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format ISO timestamps to reader-friendly relative or exact strings
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Clean phone numbers to display neatly
 * @param {string} phone
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})?(\d{5})(\d{5})$/);
  if (match) {
    const intlCode = match[1] ? `+${match[1]} ` : '+91 ';
    return `${intlCode}${match[2]}-${match[3]}`;
  }
  return phone;
};
