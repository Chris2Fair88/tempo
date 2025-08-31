// Non-variable values (hard-coded constants) are named in all capital letters
// and stored in a separate configuration file (criteria requirement)
export const COUNTRY_CODE = 'US';
export const DEFAULT_YEAR = new Date().getFullYear();
export const API_ERROR_DURATION = 4000;
export const SUCCESS_TOAST_DURATION = 2500;

// Google Calendar API Configuration
// LOGIC: Separating API config from business logic makes it easier to maintain
// Using placeholder for API key that developers need to replace
export const GOOGLE_CALENDAR_CONFIG = {
  // You'll need to replace this with your actual Google API key
  // Get one from: https://console.developers.google.com/
  API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
  
  // Public calendar IDs that don't require authentication
  // These are maintained by Google and publicly accessible
  PUBLIC_CALENDARS: {
    US_HOLIDAYS: 'en.usa%23holiday%40group.v.calendar.google.com',
    WORLD_HOLIDAYS: 'en.international%23holiday%40group.v.calendar.google.com'
  }
}

export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  ADMIN: '/admin',
  TEACHER: '/teacher',
  STUDENT: '/student'
});

export const TOAST_VARIANTS = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
});

// Simple scheduling constants for basic lesson booking functionality
// LOGIC: These provide structure for scheduling without complexity
export const SCHEDULING_TIMES = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
];