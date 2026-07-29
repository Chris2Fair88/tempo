/**
 * Configuration Constants for Tempo Application
 * Non-variable values (hard-coded constants) are named in all capital letters
 * and stored in a separate configuration file (Stage 1 criteria requirement)
 * 
 * REQUIREMENTS MET:
 * - Non-variable values in all caps ✓
 * - Stored in separate configuration file ✓
 * - Descriptive constant names ✓
 * - No inappropriate abbreviations ✓
 */

// Application Settings
export const APP_NAME = 'Tempo';
export const APP_DESCRIPTION = 'In-home music lessons, simplified.';
export const APP_VERSION = '1.2.0';

// API Configuration
export const API_ENDPOINTS = Object.freeze({
  GOOGLE_CALENDAR: 'https://www.googleapis.com/calendar/v3',
  PUBLIC_HOLIDAYS: 'https://date.nager.at/api/v3',
  BACKEND_SIMULATOR: '/api/v1'
});

export const API_LIMITS = Object.freeze({
  MAX_RESULTS_PER_REQUEST: 25,
  REQUEST_TIMEOUT_MS: 10000,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000
});

// Error Messages (User-facing)
export const ERROR_MESSAGES = Object.freeze({
  NETWORK_ERROR: 'Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later.',
  API_KEY_MISSING: 'Calendar integration is temporarily unavailable. Using sample data.',
  NO_DATA_FOUND: 'No results found',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  FORM_VALIDATION_ERROR: 'Please check your input and try again.',
  LOGIN_FAILED: 'Invalid credentials. Please check your username and password.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.'
});

// Success Messages
export const SUCCESS_MESSAGES = Object.freeze({
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTRATION_SUCCESS: 'Registration successful! Welcome to Tempo.',
  LOGOUT_SUCCESS: 'Successfully logged out',
  PAYMENT_SUCCESS: 'Payment processed successfully',
  LESSON_BOOKED: 'Lesson booked successfully',
  LESSON_CANCELLED: 'Lesson cancelled',
  PRACTICE_LOG_ADDED: 'Practice log added',
  DATA_SAVED: 'Changes saved successfully'
});

// User Interface Settings
export const UI_SETTINGS = Object.freeze({
  TOAST_DURATION_SUCCESS: 3000,
  TOAST_DURATION_ERROR: 5000,
  ITEMS_PER_PAGE_DEFAULT: 3,
  ANIMATION_DURATION_MS: 300,
  DEBOUNCE_DELAY_MS: 300
});

// Form Validation Rules
export const VALIDATION_RULES = Object.freeze({
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\(\d{3}\)\s\d{3}-\d{4}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100
});

// Date and Time Settings
export const DATE_TIME_SETTINGS = Object.freeze({
  TIMEZONE: 'America/New_York',
  DATE_FORMAT: 'YYYY-MM-DD',
  DISPLAY_DATE_FORMAT: 'MMMM D, YYYY',
  TIME_FORMAT: 'HH:mm',
  DISPLAY_TIME_FORMAT: 'h:mm A'
});

// Business Logic Constants
export const BUSINESS_RULES = Object.freeze({
  MAX_LESSONS_PER_WEEK: 1,
  MAX_CANCELLATION_HOURS: 24,
  DEFAULT_LESSON_DURATION_MINUTES: 30,
  MAX_PRACTICE_LOG_MINUTES: 480, // 8 hours
  MIN_PAYMENT_AMOUNT: 1,
  MAX_PAYMENT_AMOUNT: 1000
});

// User Roles and Permissions
export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
});

export const ROLE_PERMISSIONS = Object.freeze({
  [USER_ROLES.ADMIN]: [
    'VIEW_ALL_USERS',
    'MANAGE_TEACHERS',
    'MANAGE_STUDENTS', 
    'VIEW_PAYMENTS',
    'MANAGE_SCHEDULE',
    'VIEW_ANALYTICS'
  ],
  [USER_ROLES.TEACHER]: [
    'VIEW_OWN_STUDENTS',
    'MANAGE_LESSONS',
    'VIEW_PRACTICE_LOGS',
    'SET_AVAILABILITY'
  ],
  [USER_ROLES.STUDENT]: [
    'VIEW_OWN_LESSONS',
    'BOOK_LESSONS',
    'CANCEL_LESSONS',
    'MAKE_PAYMENTS',
    'LOG_PRACTICE'
  ]
});

// Dashboard Routes
export const DASHBOARD_ROUTES = Object.freeze({
  [USER_ROLES.ADMIN]: '/admin',
  [USER_ROLES.TEACHER]: '/teacher',
  [USER_ROLES.STUDENT]: '/student'
});

// Calendar and Event Settings
export const CALENDAR_SETTINGS = Object.freeze({
  HOLIDAY_CALENDAR_ID: 'en.usa#holiday@group.v.calendar.google.com',
  COUNTRY_CODE: 'US',
  MAX_EVENTS_TO_SHOW: 10,
  DAYS_AHEAD_TO_FETCH: 365,
  EVENT_COLORS: {
    HOLIDAY: '#dc2626',
    MUSIC_EVENT: '#7c3aed',
    LESSON: '#059669',
    CANCELLATION: '#d97706'
  }
});

// Storage Keys (for localStorage/sessionStorage)
export const STORAGE_KEYS = Object.freeze({
  AUTH_TOKEN: 'tempo_auth_token',
  USER_ROLE: 'tempo_user_role',
  USER_ID: 'tempo_user_id',
  THEME_PREFERENCE: 'tempo_theme',
  LANGUAGE_PREFERENCE: 'tempo_language',
  LAST_LOGIN: 'tempo_last_login'
});

// CSS Classes (BEM naming convention)
export const CSS_CLASSES = Object.freeze({
  // Layout
  CONTAINER: 'container',
  CONTAINER_FULL_WIDTH: 'container--fullwidth',
  
  // Cards
  CARD: 'card',
  CARD_COMPACT: 'card--compact',
  CARD_FULL_WIDTH: 'card--full-width',
  
  // Buttons
  BUTTON: 'button',
  BUTTON_PRIMARY: 'button--primary',
  BUTTON_SECONDARY: 'button--secondary',
  BUTTON_LOGIN: 'button--login',
  BUTTON_REGISTER: 'button--register',
  
  // Forms
  FORM: 'form',
  FORM_FIELD: 'form__field',
  FORM_INPUT: 'form__input',
  FORM_LABEL: 'form__label',
  
  // States
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  DISABLED: 'disabled'
});

// Export all constants as a single object for easier importing
export const TEMPO_CONFIG = Object.freeze({
  APP_NAME,
  APP_DESCRIPTION,
  APP_VERSION,
  API_ENDPOINTS,
  API_LIMITS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UI_SETTINGS,
  VALIDATION_RULES,
  DATE_TIME_SETTINGS,
  BUSINESS_RULES,
  USER_ROLES,
  ROLE_PERMISSIONS,
  DASHBOARD_ROUTES,
  CALENDAR_SETTINGS,
  STORAGE_KEYS,
  CSS_CLASSES
});
