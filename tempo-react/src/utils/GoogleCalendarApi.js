const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const API_BASE = 'https://www.googleapis.com/calendar/v3'

// Public holiday calendar
const HOLIDAY_CALENDAR_ID = 'en.usa#holiday@group.v.calendar.google.com'

/**
 * Check if API is properly configured
 */
function isApiConfigured() {
  return API_KEY && API_KEY !== 'your_actual_api_key_here'
}

/**
 * Get current year date range for holidays
 */
function getCurrentYearRange() {
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // Get from current date to end of next year to catch upcoming holidays
  const timeMin = now.toISOString()
  const timeMax = new Date(currentYear + 1, 11, 31).toISOString() // End of next year
  
  return { timeMin, timeMax }
}

/**
 * Fetch current year holidays from Google Calendar
 */
async function fetchCurrentHolidays() {
  if (!isApiConfigured()) {
      // Removed console.log for production
    return getDemoEvents()
  }

    // Removed console.log for production
  
  const { timeMin, timeMax } = getCurrentYearRange()
  
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '25'
    })

    const url = `${API_BASE}/calendars/${encodeURIComponent(HOLIDAY_CALENDAR_ID)}/events?${params}`
    
      // Removed console.log for production
    
    const response = await fetch(url)

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`)
      return getDemoEvents()
    }

    const data = await response.json()
    
    if (!data.items || data.items.length === 0) {
        // Removed console.log for production
      return getDemoEvents()
    }

    const holidays = transformGoogleEvents(data.items, 'holiday')
      // Removed console.log for production
    
    // Sort events by date to show in chronological order
    const sortedHolidays = holidays.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    // Mix holidays with some demo music events for a complete calendar
    const musicEvents = getDemoMusicEvents()
    const sortedMusicEvents = musicEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    // Combine and sort all events
    const allEvents = [...sortedHolidays, ...sortedMusicEvents]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
    
    return allEvents
    
  } catch (error) {
    console.error('❌ Error fetching holidays:', error.message)
    return getDemoEvents()
  }
}

/**
 * Check if a holiday is a school closure day
 * Only include federally recognized holidays and major school closure days
 */
function isSchoolClosureHoliday(event) {
  const title = event.summary?.toLowerCase() || ''
  const description = event.description?.toLowerCase() || ''
  
  // Federal holidays and major school closure days
  const schoolClosureHolidays = [
    'new year',
    'martin luther king',
    'mlk',
    'presidents day',
    'president\'s day',
    'memorial day',
    'independence day',
    'july 4',
    'labor day',
    'columbus day',
    'veterans day',
    'thanksgiving',
    'christmas',
    'christmas day',
    'christmas eve',
    'new year\'s eve'
  ]
  
  // Check if the event title matches any school closure holiday
  const isSchoolHoliday = schoolClosureHolidays.some(holiday => 
    title.includes(holiday)
  )
  
  // Exclude observances that don't typically close schools
  const excludedObservances = [
    'daylight saving',
    'election day',
    'valentine',
    'st. patrick',
    'april fool',
    'earth day',
    'mother\'s day',
    'father\'s day',
    'halloween',
    'flag day',
    'patriots day',
    'groundhog day',
    'tax day',
    'summer solstice',
    'winter solstice',
    'spring equinox',
    'fall equinox',
    'boss day',
    'sweetest day'
  ]
  
  const isExcluded = excludedObservances.some(excluded => 
    title.includes(excluded)
  )
  
  // Also check if description indicates it's just an "observance"
  const isObservanceOnly = description.includes('observance') && 
    !description.includes('federal') && 
    !description.includes('public holiday')
  
  return isSchoolHoliday && !isExcluded && !isObservanceOnly
}
function transformGoogleEvents(events, type = 'event') {
  return events
    .filter(event => {
      // For holidays, only include school closure days
      if (type === 'holiday') {
        return isSchoolClosureHoliday(event)
      }
      return true
    })
    .map(event => {
      const formattedDate = formatEventDate(event)
      
  // Debug logging removed for production
      
      return {
        id: event.id,
        title: event.summary || 'Untitled Event',
        date: formattedDate,
        description: event.description ? `${event.description.replace(/\s*-\s*School closed$/i, '')} - School closed` : 'School closed',
        location: event.location || '',
        source: 'google-calendar',
        type: type,
        isHoliday: type === 'holiday'
      }
    })
}

/**
 * Format event date for display
 */
function formatEventDate(event) {
  const start = event.start?.date || event.start?.dateTime
  if (!start) return 'No date'
  
  let date
  if (event.start?.date) {
    // For all-day events, parse date carefully to avoid timezone issues
    const [year, month, day] = event.start.date.split('-').map(Number)
    date = new Date(year, month - 1, day) // month is 0-indexed
  } else {
    // For datetime events
    date = new Date(start)
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(event.start?.dateTime && {
      hour: 'numeric',
      minute: '2-digit'
    })
  })
}

/**
 * Get demo music events to mix with real holidays
 */
function getDemoMusicEvents() {
  return [
    {
      id: 'demo-event-1',
      title: 'Spring Piano Recital',
      date: 'Saturday, March 16, 2025',
      description: 'Annual spring recital featuring all piano students',
      location: 'Tempo Music Hall',
      source: 'internal',
      type: 'event',
      isHoliday: false
    },
    {
      id: 'demo-event-2',
      title: 'Guitar Workshop Series',
      date: 'Saturday, September 14, 2025',
      description: 'Advanced fingerpicking techniques workshop',
      location: 'Studio 2',
      source: 'internal',
      type: 'event',
      isHoliday: false
    },
    {
      id: 'demo-event-3',
      title: 'Fall Music Festival',
      date: 'Saturday, November 15, 2025',
      description: 'Community music festival with student performances',
      location: 'City Park Amphitheater',
      source: 'internal',
      type: 'event',
      isHoliday: false
    },
    {
      id: 'demo-event-4',
      title: 'Teacher Workshop',
      date: 'Saturday, January 18, 2026',
      description: 'Professional development session for music instructors',
      location: 'Tempo Music Academy',
      source: 'internal',
      type: 'event',
      isHoliday: false
    }
  ]
}

/**
 * Get demo events for complete fallback (only major school closure holidays)
 */
function getDemoEvents() {
  return [
    // Major school closure holidays only
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
      title: 'Martin Luther King Jr. Day',
      date: 'Monday, January 20, 2025',
      description: 'Federal Holiday - Schools closed',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-3',
      title: 'Presidents Day',
      date: 'Monday, February 17, 2025',
      description: 'Federal Holiday - Schools closed',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-4',
      title: 'Memorial Day',
      date: 'Monday, May 26, 2025',
      description: 'Federal Holiday - Schools closed',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-5',
      title: 'Independence Day',
      date: 'Friday, July 4, 2025',
      description: 'Federal Holiday - All lessons canceled',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-6',
      title: 'Labor Day',
      date: 'Monday, September 1, 2025',
      description: 'Federal Holiday - Schools closed',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-7',
      title: 'Thanksgiving Day',
      date: 'Thursday, November 27, 2025',
      description: 'Federal Holiday - Happy Thanksgiving!',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    {
      id: 'demo-holiday-8',
      title: 'Christmas Day',
      date: 'Thursday, December 25, 2025',
      description: 'Federal Holiday - Merry Christmas!',
      location: '',
      source: 'internal',
      type: 'holiday',
      isHoliday: true
    },
    // Music events mixed in
    ...getDemoMusicEvents()
  ]
}

/**
 * Main function to get calendar events (holidays + music events)
 */
export async function getCalendarEvents() {
  return await fetchCurrentHolidays()
}

/**
 * Search calendar events
 */
export async function searchCalendarEvents(query) {
  const events = await getCalendarEvents()
  return events.filter(event =>
    event.title.toLowerCase().includes(query.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(query.toLowerCase()))
  )
}
