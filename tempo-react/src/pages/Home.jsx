import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from '../lib/notify';
import { setAuth, DASHBOARD_ROUTE_BY_ROLE } from '../lib/auth';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import { simulateRegister } from '../utils/BackendSimulator';

export default function Home({ calendarEvents = [], apiStatus = {} }) {
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

    // Simple calendar view for upcoming events and holidays
    const renderSimpleCalendar = () => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        // Filter holidays from calendar events and convert to event format
        const holidayEvents = calendarEvents
            .filter(event => event.type === 'holiday')
            .map(holiday => ({
                id: holiday.id,
                name: holiday.title,
                description: 'School will be closed',
                date: holiday.date,
                type: 'holiday'
            }));

        // Filter music events from calendar events
        const musicEvents = calendarEvents
            .filter(event => event.type === 'event')
            .map(musicEvent => ({
                id: musicEvent.id,
                name: musicEvent.title,
                description: musicEvent.description || 'Music event',
                date: musicEvent.date,
                type: 'music-event'
            }));

        // Combine with existing mock events
        const allEvents = [...mockEvents, ...holidayEvents, ...musicEvents];
        const upcomingEvents = allEvents
            .filter(event => {
                // Handle different date formats
                let eventDate;
                if (typeof event.date === 'string' && event.date.includes(',')) {
                    // Handle formatted dates like "Sunday, August 31, 2025"
                    eventDate = new Date(event.date);
                } else {
                    eventDate = new Date(event.date);
                }
                return eventDate >= currentDate;
            })
            .slice(0, 6) // Show more events since we have more data now
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
            });

        if (upcomingEvents.length === 0) {
            return (
                <div className="simple-calendar-empty">
                    <p>No upcoming events at this time.</p>
                    {apiStatus.calendar === 'loading' && <p>Loading calendar data...</p>}
                </div>
            );
        }

        return (
            <div className="simple-calendar">
                <h3>Upcoming Important Dates!</h3>
                <div className="upcoming-events">
                    {upcomingEvents.map(event => (
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
                            <div className={`event-type-badge ${event.type}`}>
                                {event.type === 'music-event' ? 'music' : event.type}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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

            {/* Simple Calendar for Teacher Unavailability */}
            <section className="calendar-section">
                <div className="container">
                    {renderSimpleCalendar()}
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