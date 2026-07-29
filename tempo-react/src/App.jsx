import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, Suspense, lazy } from 'react'

// Components - always loaded (small and essential)
import Header from './components/Header'
import Toasts from './components/Toasts'
import ProtectedRoute, { AdminRoute, TeacherRoute, StudentRoute } from './routes/ProtectedRoute'

// Auth utilities
import { clearAuth } from './lib/auth'

// Lazy-loaded pages - Phase 3 Performance Optimization
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Admin = lazy(() => import('./pages/Admin'))
const Teacher = lazy(() => import('./pages/Teacher'))
const Student = lazy(() => import('./pages/Student'))
const Parent = lazy(() => import('./pages/Parent'))

// API imports - Refactored third-party API integration
import { getAllCalendarEvents } from './utils/ThirdPartyApi'

/**
 * Loading component for lazy-loaded routes
 */
function PageLoadingFallback() {
  return (
    <div className="page-loading" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      fontSize: '1.1rem',
      color: '#666'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div className="loading-spinner" style={{
          width: '20px',
          height: '20px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #00bb55',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        Loading...
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation()
  const isAdminPage = location.pathname === '/admin'
  
  // API State - Improved state management for third-party API
  const [calendarEvents, setCalendarEvents] = useState([])
  const [apiLoadingState, setApiLoadingState] = useState({
    calendar: 'loading',
    error: null
  })

  // Development mode: Clear auth when dev server starts (not on every page load)
  // This allows developers to test the homepage with customer service button after server restarts
  useEffect(() => {
    if (import.meta.env.DEV) {
      const DEV_SESSION_KEY = 'tempo-dev-session-cleared'
      const hasBeenClearedThisSession = sessionStorage.getItem(DEV_SESSION_KEY)
      
      // Only clear auth once per browser session when on homepage
      const isOnHomepage = location.pathname === '/' || location.pathname === '/tempo/'
      
      if (!hasBeenClearedThisSession && isOnHomepage) {
        clearAuth()
        sessionStorage.setItem(DEV_SESSION_KEY, 'true')
        console.log('🔓 Development: Auth cleared for fresh demo experience')
      }
    }
  }, [location.pathname]) // Include location.pathname as dependency

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
        <Suspense fallback={<PageLoadingFallback />}>
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
            
            {/* Protected Admin Route - Only admins can access */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <Admin 
                    calendarEvents={calendarEvents}
                    apiStatus={apiLoadingState}
                    onReloadData={loadAllCalendarData}
                  />
                </AdminRoute>
              } 
            />
            
            {/* Protected Teacher Route - Only admins and teachers can access */}
            <Route 
              path="/teacher" 
              element={
                <TeacherRoute>
                  <Teacher 
                    calendarEvents={calendarEvents}
                    apiStatus={apiLoadingState}
                    onReloadData={loadAllCalendarData}
                  />
                </TeacherRoute>
              } 
            />
            
            {/* Protected Student Route - Admins, students can access */}
            <Route 
              path="/student" 
              element={
                <StudentRoute>
                  <Student 
                    calendarEvents={calendarEvents}
                    apiStatus={apiLoadingState}
                    onReloadData={loadAllCalendarData}
                  />
                </StudentRoute>
              } 
            />
            
            {/* Protected Parent Route - Parents can access */}
            <Route 
              path="/parent" 
              element={
                <StudentRoute>
                  <Parent 
                    calendarEvents={calendarEvents}
                    apiStatus={apiLoadingState}
                    onReloadData={loadAllCalendarData}
                  />
                </StudentRoute>
              } 
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App
