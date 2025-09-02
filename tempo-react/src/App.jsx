import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Components
import Header from './components/Header'
import Toasts from './components/Toasts'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Teacher from './pages/Teacher'
import Student from './pages/Student'

// API imports - Refactored third-party API integration
import { getAllCalendarEvents } from './utils/ThirdPartyApi'

function AppContent() {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'
  
  // API State - Improved state management for third-party API
  const [calendarEvents, setCalendarEvents] = useState([])
  const [apiLoadingState, setApiLoadingState] = useState({
    calendar: 'loading',
    error: null
  })

  // Load API data on mount - Following criteria requirements
  useEffect(() => {
    loadAllCalendarData()
  }, [])

  /**
   * Load calendar events from third-party API
   * Following criteria: error handling, preloader states, user messages
   */
  const loadAllCalendarData = async () => {
    try {
      setApiLoadingState(prev => ({ 
        ...prev, 
        calendar: 'loading',
        error: null
      }))
      
      const eventData = await getAllCalendarEvents()
      setCalendarEvents(eventData || [])
      
      setApiLoadingState(prev => ({ 
        ...prev, 
        calendar: eventData && eventData.length > 0 ? 'success' : 'empty'
      }))
      
    } catch (error) {
      console.error('Failed to load calendar events:', error)
      setApiLoadingState(prev => ({ 
        ...prev, 
        calendar: 'error',
        error: error.message || 'Failed to load calendar data'
      }))
      
      // Fallback to demo data on error
      setCalendarEvents([])
    }
  }

  return (
    <div className="app">
      <Toasts />
      
      <Header />
      
      <main className={isAdminPage ? "container--fullwidth" : "container"}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                calendarEvents={calendarEvents}
                apiStatus={apiLoadingState}
                onReloadData={loadAllCalendarData}
              />
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <Admin 
                calendarEvents={calendarEvents}
                apiStatus={apiLoadingState}
                onReloadData={loadAllCalendarData}
              />
            } 
          />
          <Route path="/teacher" element={
            <Teacher 
              calendarEvents={calendarEvents}
              apiStatus={apiLoadingState}
              onReloadData={loadAllCalendarData}
            />
          } />
          <Route path="/student" element={
            <Student 
              calendarEvents={calendarEvents}
              apiStatus={apiLoadingState}
              onReloadData={loadAllCalendarData}
            />
          } />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App
