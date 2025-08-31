// Test file to check environment variables
console.log('=== GOOGLE CALENDAR API CONFIGURATION TEST ===')
console.log('VITE_GOOGLE_API_KEY:', import.meta.env.VITE_GOOGLE_API_KEY)
console.log('VITE_GOOGLE_CALENDAR_ID:', import.meta.env.VITE_GOOGLE_CALENDAR_ID)
console.log('VITE_GOOGLE_CALENDAR_API_BASE:', import.meta.env.VITE_GOOGLE_CALENDAR_API_BASE)
console.log('VITE_ENABLE_CALENDAR:', import.meta.env.VITE_ENABLE_CALENDAR)

// Test API key format
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
if (apiKey) {
  console.log('API Key length:', apiKey.length)
  console.log('API Key starts with:', apiKey.substring(0, 10) + '...')
  console.log('API Key format valid:', /^AIza[0-9A-Za-z_-]{35}$/.test(apiKey))
} else {
  console.log('❌ API Key not found!')
}

// Test direct API call
async function testGoogleCalendarAPI() {
  const testUrl = `https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${apiKey}`
  
  console.log('Testing direct API call...')
  console.log('URL:', testUrl)
  
  try {
    const response = await fetch(testUrl)
    console.log('Response status:', response.status)
    console.log('Response headers:', [...response.headers.entries()])
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API call successful!')
      console.log('Calendar count:', data.items?.length || 0)
    } else {
      const errorText = await response.text()
      console.log('❌ API call failed:', errorText)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }
}

// Run the test
if (apiKey && apiKey !== 'YOUR_GOOGLE_API_KEY_HERE') {
  testGoogleCalendarAPI()
} else {
  console.log('❌ Cannot test API - key not configured properly')
}

export default function ApiTest() {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'black',
      color: 'lime',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <div>API Test Running - Check Console</div>
    </div>
  )
}
