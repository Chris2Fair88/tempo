import React from 'react';

/**
 * Reusable Upcoming Events Component
 * Used across Admin, Teacher, Student, and Parent dashboards
 */
export default function UpcomingEvents({ 
  calendarEvents = [], 
  maxEvents = 7, 
  showBadges = true,
  variant = 'default' // 'default', 'compact', 'admin'
}) {
  const eventsToShow = calendarEvents.slice(0, maxEvents);

  if (calendarEvents.length === 0) {
    return (
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">📅 Upcoming Events</h2>
        </div>
        <div className="card__content">
          <p className="help">No upcoming events scheduled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <h2 className="card__title">📅 Upcoming Events</h2>
      </div>
      <div className="card__content">
        {variant === 'admin' && (
          <p>Important dates affecting school operations</p>
        )}
        
        <div>
          <ul className="list">
            {eventsToShow.map(event => (
              <li key={event.id} className="list__item">
                <strong>{event.date}:</strong> {event.title}
                {showBadges && event.type === 'holiday' && (
                  <span className="badge holiday">School Closed</span>
                )}
                {event.location && (
                  <span className="event-location"> • {event.location}</span>
                )}
              </li>
            ))}
          </ul>
          
          {calendarEvents.length > maxEvents && (
            <p className="help">
              And {calendarEvents.length - maxEvents} more events...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
