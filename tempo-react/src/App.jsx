import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

import './styles/index.css'

// Components
import Header from './components/Header'
import Toasts from './components/Toasts'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Teacher from './pages/Teacher'
import Student from './pages/Student'

// API imports - Single Google Calendar API (includes holidays)
import { getCalendarEvents } from './utils/GoogleCalendarApi'

function AppContent() {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'
  
  // API State - Single API for all calendar data
  const [calendarEvents, setCalendarEvents] = useState([])
  const [apiStatus, setApiStatus] = useState({
    calendar: 'loading'
  })

  // Load API data on mount
  useEffect(() => {
    loadCalendarEvents()
  }, [])

  const loadCalendarEvents = async () => {
    try {
      setApiStatus(prev => ({ ...prev, calendar: 'loading' }))
      const eventData = await getCalendarEvents()
      setCalendarEvents(eventData)
      setApiStatus(prev => ({ ...prev, calendar: 'success' }))
    } catch (error) {
      console.error('Failed to load calendar events:', error)
      setApiStatus(prev => ({ ...prev, calendar: 'demo' }))
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
                apiStatus={apiStatus}
              />
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <Admin 
                calendarEvents={calendarEvents}
                apiStatus={apiStatus}
              />
            } 
          />
          <Route path="/teacher" element={
            <Teacher 
              calendarEvents={calendarEvents}
              apiStatus={apiStatus}
            />
          } />
          <Route path="/student" element={
            <Student 
              calendarEvents={calendarEvents}
              apiStatus={apiStatus}
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
