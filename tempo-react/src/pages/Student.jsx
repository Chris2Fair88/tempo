import { useMemo, useState } from 'react';
import { getUserId } from '../lib/auth';
import { store } from '../lib/store';
import { toast } from '../lib/notify';

export default function Student({ calendarEvents = [], apiStatus = {} }) {
  const studentId = getUserId() || 1; // fallback to demo student
  const s = store.getState();
  const student = s.students.find(st => st.id === studentId) || s.students[0];
  const teacher = s.teachers.find(t => t.id === student.teacherId);
  const week = s.lessons.filter(l => l.studentId === student.id);
  const [minutes, setMinutes] = useState(20);
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState(100);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookedLessons, setBookedLessons] = useState({});

  const logs = useMemo(() => student.practiceLogs.slice().reverse(), [student.practiceLogs]);

  function handleLogout() {
    clearRole();
    toast('Successfully logged out', 'success');
    navigate('/');
  }

  // Generate next 14 days for lesson booking
  const generateBookingDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) { // Start from tomorrow
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Check if it's a holiday (teacher unavailable)
      const isHoliday = calendarEvents.some(event => 
        event.type === 'holiday' && event.date === dateString
      );
      
      // Check teacher availability (simulate checking localStorage)
      const teacherAvailability = JSON.parse(localStorage.getItem(`teacher-${student.teacherId}-availability`) || '{}');
      const isTeacherAvailable = teacherAvailability[dateString] === true;
      
      days.push({
        date: dateString,
        displayDate: date.toLocaleDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        isHoliday,
        isTeacherAvailable,
        isBooked: bookedLessons[dateString],
        isAvailableForBooking: !isHoliday && isTeacherAvailable && !bookedLessons[dateString]
      });
    }
    
    return days;
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', 
    '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const bookLesson = (date, timeSlot) => {
    const newBooking = {
      ...bookedLessons,
      [date]: timeSlot
    };
    setBookedLessons(newBooking);
    localStorage.setItem(`student-${studentId}-bookings`, JSON.stringify(newBooking));
    toast(`Lesson booked for ${date} at ${timeSlot}`);
  };

  const cancelLesson = (date) => {
    const newBooking = { ...bookedLessons };
    delete newBooking[date];
    setBookedLessons(newBooking);
    localStorage.setItem(`student-${studentId}-bookings`, JSON.stringify(newBooking));
    toast(`Lesson cancelled for ${date}`);
  };

  function addLog(e) {
    e.preventDefault();
    store.addPracticeLog(student.id, Number(minutes || 0), note);
    setNote('');
    toast('Practice log added');
  }

  function cancelWeek() {
    store.cancelThisWeek(student.id);
    toast('This week marked as absent');
  }

  function payNow() {
    store.addPayment(student.id, amount);
    toast('Payment received');
  }

  const renderHolidayItem = (holiday) => (
    <div className="api-data-card">
      <h3>{holiday.title}</h3>
      <p><strong>Date:</strong> {holiday.date}</p>
      {holiday.description && <p>{holiday.description}</p>}
      <div className="api-source">
        <span className={`source-badge ${holiday.source}`}>
          {holiday.source === 'google-api' ? '🌐 Live API' : '🎭 Demo'}
        </span>
      </div>
    </div>
  );

  const renderCalendarItem = (event) => (
    <div className="api-data-card">
      <h3>{event.title}</h3>
      <p><strong>Date:</strong> {event.date}</p>
      {event.description && <p>{event.description}</p>}
      {event.location && <p><strong>Location:</strong> {event.location}</p>}
      <div className="api-source">
        <span className={`source-badge ${event.source}`}>
          {event.source === 'google-api' ? '� Live API' : '� Demo'}
        </span>
      </div>
    </div>
  );

  return (
    <section className="dash">
      <h1 className="section-title">Student Dashboard</h1>
      <div className="grid">
        <section className="card compact">
          <h2>👨‍🏫 My Teacher</h2>
          <p>{teacher?.name} — {teacher?.instrument}</p>
          <p className="help">Contact: {teacher?.email} · {teacher?.phone}</p>
        </section>

        <section className="card compact">
          <h2>📚 Weekly Lesson</h2>
          <ul className="list">
            {week.map(l => (
              <li key={l.id} className="list__item">
                {l.day} {l.time} {l.status === 'absent' && <em>(absent)</em>}
              </li>
            ))}
          </ul>
          <button className="button mt-8" onClick={cancelWeek}>Cancel this week</button>
        </section>

        {/* Simplified Lesson Booking */}
        <section className="card">
          <h2>📅 Quick Book a Lesson</h2>
          <p className="help">Select an available time slot with {teacher?.name}.</p>
          
          <div className="form">
            <label className="form__field">
              <span className="form__label">Select Date & Time</span>
              <select 
                value={selectedTimeSlot} 
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="form__input"
              >
                <option value="">Choose available slot</option>
                <option value="Mon 3:00 PM">Monday 3:00 PM</option>
                <option value="Wed 4:00 PM">Wednesday 4:00 PM</option>
                <option value="Fri 2:00 PM">Friday 2:00 PM</option>
                <option value="Sat 10:00 AM">Saturday 10:00 AM</option>
              </select>
            </label>
            <button 
              className="button"
              onClick={() => {
                if (selectedTimeSlot) {
                  toast(`Lesson booked for ${selectedTimeSlot}`);
                  setSelectedTimeSlot('');
                }
              }}
              disabled={!selectedTimeSlot}
            >
              Book Lesson
            </button>
          </div>
        </section>

        <section className="card">
          <h2>🎵 Practice Log</h2>
          <form className="form" onSubmit={addLog}>
            <label className="form__field">
              <span className="form__label">Minutes</span>
              <input className="form__input" type="number" min="0" value={minutes} onChange={e=>setMinutes(e.target.value)} />
            </label>
            <label className="form__field">
              <span className="form__label">Note</span>
              <input className="form__input" value={note} onChange={e=>setNote(e.target.value)} placeholder="What did you practice?" />
            </label>
            <button className="button" type="submit">Add</button>
          </form>
          <ul className="list mt-8">
            {logs.slice(0, 3).map(log => (
              <li key={log.id} className="list__item">{new Date(log.at).toLocaleString()} — {log.minutes}m — {log.note}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Payments - Full Width Section */}
      <section className="card full-width">
        <h2>💳 Payments</h2>
        <div className="payment-form-centered">
          <div className="form">
            <label className="form__field">
              <span className="form__label">Amount</span>
              <input className="form__input" type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)} />
            </label>
            <button className="button" onClick={payNow}>Pay Now</button>
          </div>
          <ul className="list mt-8">
            {store.listPaymentsByStudent(student.id).slice(0, 3).map(p => (
              <li key={p.id} className="list__item">{p.month}: ${p.amount}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Upcoming Events - Full Width Section */}
      <section className="card full-width">
        <h2>📅 Upcoming Events</h2>
        <p>Important dates and school closures</p>
        
        {calendarEvents.length > 0 ? (
          <div>
            <ul className="list">
              {calendarEvents.slice(0, 6).map(event => (
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
