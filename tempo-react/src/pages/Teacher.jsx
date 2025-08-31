import { useEffect, useMemo, useState } from 'react';
import { getUserId } from '../lib/auth';
import { store } from '../lib/store';

export default function Teacher({ calendarEvents = [], apiStatus = {} }) {
  const teacherId = getUserId() || 1; // fallback to demo teacher
  const [week, setWeek] = useState([]);
  const [availability, setAvailability] = useState({});
  const stats = useMemo(() => store.getTeacherStats(teacherId), [teacherId]);
  const notes = useMemo(() => {
    const t = store.getState().teachers.find(t => t.id === teacherId);
    return (t && t.studentNotes) ? t.studentNotes : {};
  }, [teacherId]);

  useEffect(() => {
    setWeek(store.getTeacherWeek(teacherId));
    // Load existing availability settings
    const savedAvailability = localStorage.getItem(`teacher-${teacherId}-availability`);
    if (savedAvailability) {
      setAvailability(JSON.parse(savedAvailability));
    }
  }, [teacherId]);

  useEffect(() => {
    setWeek(store.getTeacherWeek(teacherId));
    // Load existing availability settings
    const savedAvailability = localStorage.getItem(`teacher-${teacherId}-availability`);
    if (savedAvailability) {
      setAvailability(JSON.parse(savedAvailability));
    }
  }, [teacherId]);

  function saveNote(studentId, e) {
    store.setTeacherNote(teacherId, studentId, e.target.value);
  }

  // Generate next 14 days for availability calendar
  const generateAvailabilityDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Check if it's a holiday (teacher unavailable)
      const isHoliday = calendarEvents.some(event => 
        event.type === 'holiday' && event.date === dateString
      );
      
      days.push({
        date: dateString,
        displayDate: date.toLocaleDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isHoliday,
        isAvailable: availability[dateString] === true,
        isUnavailable: availability[dateString] === false
      });
    }
    
    return days;
  };

  const toggleAvailability = (dateString, isAvailable) => {
    const newAvailability = {
      ...availability,
      [dateString]: isAvailable
    };
    setAvailability(newAvailability);
    localStorage.setItem(`teacher-${teacherId}-availability`, JSON.stringify(newAvailability));
  };

  const renderCalendarItem = (event) => (
    <div className="api-data-card">
      <h3>{event.title}</h3>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Type:</strong> {event.type === 'holiday' ? '�️ Holiday' : '📅 Event'}</p>
      {event.description && <p>{event.description}</p>}
      {event.location && <p><strong>Location:</strong> {event.location}</p>}
      <div className="api-source">
        <span className={`source-badge ${event.source}`}>
          {event.source === 'demo-data' ? '🎭 Demo' : '🌐 Live API'}
        </span>
      </div>
    </div>
  );

  return (
    <section className="dash">
      <h1 className="section-title">Teacher Dashboard</h1>

      <div className="grid">
        <section className="card">
          <h2>📋 Week Agenda</h2>
          <ul className="list">
            {week.map(item => (
              <li key={item.id} className="list__item">
                {item.day} {item.time} — {item.studentName} {item.status === 'absent' && <em>(absent)</em>}
                <div className="mt-6">
                  <label className="form__field">
                    <span className="form__label">Notes</span>
                    <textarea
                      className="form__input"
                      rows={2}
                      defaultValue={notes[item.studentId] || ''}
                      onBlur={(e)=>saveNote(item.studentId, e)}
                      placeholder="Lesson plan / practice notes"
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>📊 Stats</h2>
          <p><strong>Students this week:</strong> {stats.studentsThisWeek}</p>
          <p><strong>Paid this month:</strong> ${stats.paidThisMonth}</p>
        </section>
      </div>

      {/* Teacher Availability Calendar - Full Width */}
      <section className="card full-width">
        <h2>📅 Set Your Availability</h2>
        <p className="help">Mark your availability for the next 14 days. Students will see these when booking lessons.</p>
        
        <div className="availability-calendar-extended">
          {generateAvailabilityDays().map(day => (
            <div 
              key={day.date} 
              className={`availability-day ${day.isHoliday ? 'holiday' : ''} ${day.isAvailable ? 'available' : ''} ${day.isUnavailable ? 'unavailable' : ''}`}
            >
              <div className="day-header">
                <span className="day-name">{day.dayName}</span>
                <span className="day-date">{day.displayDate}</span>
              </div>
              
              {day.isHoliday ? (
                <div className="holiday-notice">🎉 Public Holiday</div>
              ) : (
                <div className="availability-controls">
                  <button 
                    className={`btn-availability available ${day.isAvailable ? 'active' : ''}`}
                    onClick={() => toggleAvailability(day.date, true)}
                  >
                    ✅ Available
                  </button>
                  <button 
                    className={`btn-availability unavailable ${day.isUnavailable ? 'active' : ''}`}
                    onClick={() => toggleAvailability(day.date, false)}
                  >
                    ❌ Unavailable
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events - Full Width */}
      <section className="card full-width">
        <h2>📅 Upcoming Events</h2>
        <p>Important dates affecting lesson scheduling</p>
        
        {calendarEvents.length > 0 ? (
          <div>
            <ul className="list">
              {calendarEvents.slice(0, 8).map(event => (
                <li key={event.id} className="list__item">
                  <strong>{event.date}:</strong> {event.title}
                  {event.type === 'holiday' && <span className="badge holiday">School Closed</span>}
                  {event.location && <span className="event-location"> • {event.location}</span>}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="help">No upcoming events scheduled</p>
        )}
      </section>
    </section>
  );
}