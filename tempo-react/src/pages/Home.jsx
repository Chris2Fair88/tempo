import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from '../lib/notify';
import { setAuth, DASHBOARD_ROUTE_BY_ROLE } from '../lib/auth';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import { simulateRegister } from '../utils/BackendSimulator';
import { ApiDataList, useApiData } from '../components/ApiDataManager';
import { getAllCalendarEvents, searchCalendarEvents } from '../utils/ThirdPartyApi';

export default function Home({ calendarEvents = [], apiStatus = {}, onReloadData }) {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const showRegister = (search.get('register') === '1');

    // Modal states
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(showRegister);

    // Mock company events data
    const mockEvents = [
        {
            id: 'recital-1',
            name: 'Spring Music Recital',
            description: 'Featuring performances by our talented students',
            date: '2024-04-15',
            type: 'recital'
        },
        {
            id: 'open-mic-1',
            name: 'Open Mic Night',
            description: 'Open to all students and community members',
            date: '2024-03-28',
            type: 'open-mic'
        },
        {
            id: 'recital-2',
            name: 'Piano Showcase',
            description: 'Piano students present their latest pieces',
            date: '2024-05-10',
            type: 'recital'
        },
        {
            id: 'special-1',
            name: 'Music Theory Workshop',
            description: 'Advanced workshop for intermediate students',
            date: '2024-04-05',
            type: 'special'
        }
    ];

    const openLoginModal = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const openRegisterModal = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
    };

    const closeModals = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(false);
    };

    const handleRegister = async (userData) => {
        try {
            const result = await simulateRegister(userData);
            toast(result.message, 'success');
            closeModals();
            
            // Set auth and navigate to appropriate dashboard
            const userRole = userData.role;
            const userId = result.user.id;
            setAuth(userRole, userId);
            
            // Navigate to the corresponding profile page
            const dashboardRoute = DASHBOARD_ROUTE_BY_ROLE[userRole];
            if (dashboardRoute) {
                navigate(dashboardRoute);
            } else {
                // Fallback to login if role not found
                setTimeout(() => openLoginModal(), 1000);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            toast(error.message, 'error');
        }
    };

    /**
     * Render consolidated upcoming events section
     * Combines API data with local events in a single, logical interface
     */
    const renderUpcomingEvents = () => {
        const currentDate = new Date();
        
        // Combine all event sources
        const allEvents = [
            ...mockEvents,
            ...calendarEvents.map(event => {
                // Clean up API descriptions - remove all technical text for holidays
                let cleanDescription = event.description;
                
                // For holidays, always use user-friendly description
                if (event.isHoliday) {
                    cleanDescription = 'School may be closed';
                } else if (cleanDescription && (
                    cleanDescription.includes('Observance') ||
                    cleanDescription.includes('Google Calendar Settings') ||
                    cleanDescription.includes('hide observances') ||
                    cleanDescription === 'Public holiday'
                )) {
                    cleanDescription = 'Music event';
                }
                
                return {
                    id: event.id,
                    name: event.title,
                    description: cleanDescription || (event.isHoliday ? 'School may be closed' : 'Music event'),
                    date: event.date,
                    type: event.isHoliday ? 'holiday' : 'music-event',
                    source: event.source
                };
            })
        ];

        // Filter and sort upcoming events
        const upcomingEvents = allEvents
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= currentDate;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 6);

        const renderEventItem = (event) => (
            <div key={event.id} className={`upcoming-event ${event.type}`}>
                <div className="event-date-info">
                    <div className="date">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </div>
                    <div className="day">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'short' 
                        })}
                    </div>
                </div>
                <div className="event-details">
                    <div className="event-name">{event.name}</div>
                    {event.description && (
                        <div className="event-description">{event.description}</div>
                    )}
                </div>
                <div className="event-badges">
                    <div className={`event-type-badge ${event.type}`}>
                        {event.type === 'music-event' ? 'music' : 
                         event.type === 'holiday' ? 'holiday' : event.type}
                    </div>
                </div>
            </div>
        );

        return (
            <section className="upcoming-events-section">
                <div className="container">
                    <h2 className="section-title">Upcoming Important Dates</h2>
                    <p className="section-description">
                        Events and holidays that may affect lesson scheduling
                    </p>

                    {apiStatus.calendar === 'loading' && (
                        <div className="events-loading">
                            <div className="preloader">
                                <div className="preloader__spinner"></div>
                                <p>Loading upcoming events...</p>
                            </div>
                        </div>
                    )}

                    {apiStatus.calendar === 'error' && (
                        <div className="events-error">
                            <div className="error-message">
                                <p>Unable to load some events. Showing available information.</p>
                                {onReloadData && (
                                    <button 
                                        className="button button--secondary"
                                        onClick={onReloadData}
                                    >
                                        Try Again
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {upcomingEvents.length === 0 && apiStatus.calendar !== 'loading' ? (
                        <div className="events-empty">
                            <p>No upcoming events at this time.</p>
                        </div>
                    ) : (
                        <div className="upcoming-events">
                            {upcomingEvents.map(renderEventItem)}
                        </div>
                    )}
                </div>
            </section>
        );
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1 className="section-title">Tempo</h1>
                    <p>In-home music lessons, simplified.</p>
                    
                    <div className="hero__actions">
                        <button className="button-login" onClick={openLoginModal}>
                            Login
                        </button>
                        <button className="button-register" onClick={openRegisterModal}>
                            Register
                        </button>
                    </div>
                </div>
            </section>

            {/* Service Cards */}
            <div className="home__card-section">
                <section className="card">
                    <h2 className="section-subtitle">How it works</h2>
                    <p>Sign up, pick a teacher, and get weekly in-home lessons. Manage schedules and cancellations online.</p>
                </section>
                
                <section className="card">
                    <h2 className="section-subtitle">Payment options</h2>
                    <p>Pay monthly by card or ACH. Receipts are emailed automatically.</p>
                </section>
                
                <section className="card">
                    <h2 className="section-subtitle">Customer service</h2>
                    <p>Questions? Our team is available 7 days a week by email and phone.</p>
                </section>
            </div>

            {/* Upcoming Events Section */}
            <section className="calendar-section">
                <div className="container">
                    {renderUpcomingEvents()}
                </div>
            </section>

            {/* Modals */}
            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={closeModals}
                onSwitchToRegister={openRegisterModal}
            />
            
            <RegisterModal 
                isOpen={isRegisterModalOpen}
                onClose={closeModals}
                onSwitchToLogin={openLoginModal}
                onRegister={handleRegister}
            />
        </div>
    );
}