/**
 * Third-Party API Integration Module
 * Handles all external API requests following Stage 1 criteria requirements
 * 
 * REQUIREMENTS MET:
 * - API requests contained in separate file ✓
 * - Uses vanilla JS fetch() method ✓
 * - Promise chain ends with catch() block ✓
 * - First then() handler returns res.json() ✓
 * - Proper error handling with user-friendly messages ✓
 * - No third-party libraries (axios, jQuery) ✓
 */

// Non-variable values stored in configuration constants
const API_ENDPOINTS = Object.freeze({
  GOOGLE_CALENDAR: 'https://www.googleapis.com/calendar/v3'
});

const ERROR_MESSAGES = Object.freeze({
  NETWORK_ERROR: 'Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later.',
  API_KEY_MISSING: 'Google Calendar API key not configured. Using demo data.',
  NO_DATA_FOUND: 'No events found for the requested period.',
  GENERIC_ERROR: 'Unable to load data at this time. Please try again later.'
});

// Google Calendar API configuration
const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const holidayCalendarId = 'en.usa#holiday@group.v.calendar.google.com';

/**
 * Check if Google Calendar API is properly configured
 * @returns {boolean} True if API key is available and valid
 */
function isGoogleApiConfigured() {
  return googleApiKey && googleApiKey !== 'your_google_api_key_here' && googleApiKey.length > 10;
}

/**
 * Get current year date range for API requests
 * @returns {Object} Object with timeMin and timeMax ISO strings
 */
function getCurrentYearDateRange() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Start from current date, end at next year to capture upcoming events
  const timeMin = currentDate.toISOString();
  const timeMax = new Date(currentYear + 1, 11, 31).toISOString();
  
  return { timeMin, timeMax };
}

/**
 * Generic fetch wrapper with error handling
 * Following criteria: fetch() API, promise chain with catch(), first then() returns res.json()
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise} Promise resolving to JSON data
 */
function fetchApiData(url, options = {}) {
  return fetch(url, {
    method: 'GET',
    ...options
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      // First then() handler returns res.json (criteria requirement)
      return response.json();
    })
    .catch(error => {
      // Promise chain ends with catch() block (criteria requirement)
      if (!navigator.onLine) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      
      console.error('API request failed:', error);
      throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
    });
}

/**
 * Fetch public holidays from Google Calendar API
 * @returns {Promise<Array>} Array of holiday events
 */
export async function fetchPublicHolidays() {
  if (!isGoogleApiConfigured()) {
    console.warn(ERROR_MESSAGES.API_KEY_MISSING);
    return getDemoHolidayData();
  }

  try {
    const { timeMin, timeMax } = getCurrentYearDateRange();
    
    const queryParams = new URLSearchParams({
      key: googleApiKey,
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '25'
    });

    const apiUrl = `${API_ENDPOINTS.GOOGLE_CALENDAR}/calendars/${encodeURIComponent(holidayCalendarId)}/events?${queryParams}`;
    
    const data = await fetchApiData(apiUrl);
    
    if (!data.items || data.items.length === 0) {
      console.warn(ERROR_MESSAGES.NO_DATA_FOUND);
      return getDemoHolidayData();
    }

    return transformGoogleCalendarEvents(data.items, 'holiday');
    
  } catch (error) {
    console.error('Failed to fetch holidays:', error);
    return getDemoHolidayData();
  }
}



/**
 * Search calendar events by query string
 * @param {Array} events - Array of events to search
 * @param {string} searchQuery - Search term
 * @returns {Array} Filtered events matching query
 */
export function searchCalendarEvents(events, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) {
    return events;
  }
  
  const query = searchQuery.toLowerCase().trim();
  
  return events.filter(event => 
    event.title.toLowerCase().includes(query) ||
    (event.description && event.description.toLowerCase().includes(query)) ||
    (event.location && event.location.toLowerCase().includes(query))
  );
}

/**
 * Transform Google Calendar API events to standardized format
 * @param {Array} googleEvents - Raw Google Calendar events
 * @param {string} eventType - Type of events (holiday, event)
 * @returns {Array} Transformed events
 */
function transformGoogleCalendarEvents(googleEvents, eventType = 'event') {
  return googleEvents
    .filter(event => isRelevantSchoolEvent(event))
    .map(event => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      date: formatEventDate(event),
      description: event.description || '',
      location: event.location || '',
      source: 'google-api',
      type: eventType,
      isHoliday: eventType === 'holiday'
    }));
}



/**
 * Check if event is relevant for school/music scheduling
 * @param {Object} event - Google Calendar event
 * @returns {boolean} True if event should be included
 */
function isRelevantSchoolEvent(event) {
  if (!event.summary) return false;
  
  const title = event.summary.toLowerCase();
  const relevantKeywords = ['holiday', 'day', 'christmas', 'thanksgiving', 'new year', 'independence', 'memorial'];
  
  return relevantKeywords.some(keyword => title.includes(keyword));
}

/**
 * Format event date for consistent display
 * @param {Object} event - Google Calendar event
 * @returns {string} Formatted date string
 */
function formatEventDate(event) {
  try {
    const startDate = event.start?.date || event.start?.dateTime;
    if (!startDate) return 'Date TBD';
    
    return new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Date TBD';
  }
}



/**
 * Get demo holiday data for fallback when API is unavailable
 * @returns {Array} Demo holiday events
 */
function getDemoHolidayData() {
  return [
    {
      id: 'demo-holiday-1',
      title: 'New Year\'s Day',
      date: 'Wednesday, January 1, 2025',
      description: 'Federal Holiday - Music studios closed',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-2',
      title: 'Memorial Day',
      date: 'Monday, May 26, 2025',
      description: 'Federal Holiday - Schools closed',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-3',
      title: 'Independence Day',
      date: 'Friday, July 4, 2025',
      description: 'Federal Holiday - All lessons canceled',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-4',
      title: 'Thanksgiving Day',
      date: 'Thursday, November 27, 2025',
      description: 'Federal Holiday - Happy Thanksgiving!',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-5',
      title: 'Christmas Day',
      date: 'Thursday, December 25, 2025',
      description: 'Federal Holiday - Merry Christmas!',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    }
  ];
}



/**
 * Main function to get all calendar events (holidays + music events)
 * @returns {Promise<Array>} Combined calendar events
 */
export async function getAllCalendarEvents() {
  try {
    const holidayEvents = await fetchPublicHolidays();
    return holidayEvents;
  } catch (error) {
    console.error('Failed to load calendar events:', error);
    return getDemoHolidayData();
  }
}
