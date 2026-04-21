
/**
 * Password validation and strength utilities
 */

export const validatePassword = (password) => {
  if (!password) return { isValid: false, errors: ['Password is required'] };
  
  const errors = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters long');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must contain at least one special character');

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculatePasswordStrength = (password) => {
  if (!password) return 0;
  
  let score = 0;
  
  // Base score for length
  if (password.length > 8) score += 20;
  if (password.length > 12) score += 20;
  
  // Character variety scores
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  
  return Math.min(100, score);
};

export const getPasswordStrengthLabel = (strength) => {
  if (strength < 30) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 80) return 'Good';
  return 'Strong';
};

export const getPasswordStrengthColor = (strength) => {
  if (strength < 30) return 'bg-red-500';
  if (strength < 60) return 'bg-orange-500';
  if (strength < 80) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const checkPasswordRequirements = (password) => {
  return [
    { id: 'length', label: 'At least 8 characters', met: password?.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', met: /[A-Z]/.test(password || '') },
    { id: 'lowercase', label: 'One lowercase letter', met: /[a-z]/.test(password || '') },
    { id: 'number', label: 'One number', met: /[0-9]/.test(password || '') },
    { id: 'special', label: 'One special character', met: /[^A-Za-z0-9]/.test(password || '') },
  ];
};
