export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// Kenyan phone number validation
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, '');
  // Accept +254, 0, or 254 prefix for Kenyan numbers
  const phoneRegex = /^(\+254|0|254)([0-9]{9})$/;
  return phoneRegex.test(cleaned);
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Form validation schema
export interface FormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  businessType: string;
  demoDate: string;
  demoTime: string;
  currentSoftware: string;
  message: string;
}

export const validateForm = (data: FormData): FormValidation => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name.trim()) {
    errors.push({ field: 'name', message: 'Full name is required' });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  // Company validation — now required
  if (!data.company.trim()) {
    errors.push({ field: 'company', message: 'Company name is required' });
  } else if (data.company.trim().length < 2) {
    errors.push({ field: 'company', message: 'Company name must be at least 2 characters' });
  }

  // Email validation
  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Phone validation
  if (!data.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid Kenyan phone number (e.g., +254 7XX XXX XXX)' });
  }

  // Business type — now required
  if (!data.businessType.trim()) {
    errors.push({ field: 'businessType', message: 'Please select your business type' });
  }

  // Current software — now required
  if (!data.currentSoftware.trim()) {
    errors.push({ field: 'currentSoftware', message: 'Please select your current software' });
  }

  // Preferred date — now required
  if (!data.demoDate.trim()) {
    errors.push({ field: 'demoDate', message: 'Please select a preferred demo date' });
  }

  // Preferred time — now required
  if (!data.demoTime?.trim()) {
    errors.push({ field: 'demoTime', message: 'Please select a preferred time slot' });
  }

  // Message is optional but if provided, must be at least 10 chars
  if (data.message.trim() && data.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters (or leave empty)' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
  return errors.find((e) => e.field === field)?.message;
};
