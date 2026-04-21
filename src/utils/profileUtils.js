
/**
 * Formats a date string into a readable format (e.g., "Oct 24, 2023")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculates the duration of membership from a start date
 */
export const getMembershipDuration = (joinDate) => {
  if (!joinDate) return 'New Member';
  const start = new Date(joinDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays} days`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} months`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} years`;
};

/**
 * Generates initials from a name (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0)?.toUpperCase() || '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0)?.toUpperCase() : '';
  return (first + last) || 'U';
};

/**
 * Masks an email address for privacy (e.g., "johndoe@example.com" -> "jo*****@example.com")
 */
export const maskEmail = (email) => {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local}*****@${domain}`;
  return `${local.substring(0, 2)}*****@${domain}`;
};

/**
 * Detects basic browser and OS information
 */
export const getDeviceInfo = () => {
  if (typeof navigator === 'undefined') return { browser: 'Unknown', os: 'Unknown' };
  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";
  else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("MSIE") > -1) browser = "Internet Explorer";

  if (ua.indexOf("Win") > -1) os = "Windows";
  else if (ua.indexOf("Mac") > -1) os = "MacOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("iOS") > -1) os = "iOS";

  return { browser, os };
};
