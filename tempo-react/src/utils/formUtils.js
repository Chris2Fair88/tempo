/**
 * Form validation utilities
 */
export const formValidators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return '';
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return '';
  },

  password: (value) => {
    if (!value || value.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  },

  confirmPassword: (originalPassword) => (value) => {
    if (value !== originalPassword) {
      return 'Passwords do not match';
    }
    return '';
  }
};

/**
 * Form field configuration for consistent form generation
 */
export const formFieldConfigs = {
  login: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      validators: [formValidators.required, formValidators.email],
      autoComplete: 'email'
    },
    {
      name: 'password',
      type: 'password', 
      label: 'Password',
      placeholder: 'Enter your password',
      validators: [formValidators.required],
      autoComplete: 'current-password'
    }
  ],

  register: [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter your first name',
      validators: [formValidators.required, formValidators.minLength(2)],
      autoComplete: 'given-name'
    },
    {
      name: 'lastName', 
      type: 'text',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      validators: [formValidators.required, formValidators.minLength(2)],
      autoComplete: 'family-name'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email address',
      validators: [formValidators.required, formValidators.email],
      autoComplete: 'email'
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password', 
      placeholder: 'Create a strong password',
      validators: [formValidators.required, formValidators.password],
      autoComplete: 'new-password'
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      validators: [], // Will be set dynamically based on password field
      autoComplete: 'new-password'
    }
  ]
};
