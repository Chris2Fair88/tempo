import { useMemo, useState } from 'react';
import { store } from '../lib/store';
import { toast } from '../lib/notify';

export default function Admin({ calendarEvents = [], apiStatus = {} }) {
  const s = store.getState();
  const [teacherId, setTeacherId] = useState(1);
  const [day, setDay] = useState('Mon');
  const paymentsThisMonth = useMemo(() => store.listPayments(), []);
  const totalRevenue = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);

  function timeOff() {
    store.markTeacherTimeOff(Number(teacherId), day);
    toast('Time off applied');
  }
  
  function markAbsent(e) {
    store.markStudentAbsent(Number(e.target.value));
    toast('Student marked absent');
  }

  return (
    <section className="dash">
      <h1 className="section-title">Admin Dashboard</h1>

      <div className="grid">
        <section className="card">
          <h2>📊 Overview</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{s.teachers.length}</span>
              <span className="stat-label">Teachers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{s.students.length}</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">${totalRevenue}</span>
              <span className="stat-label">Monthly Revenue</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{paymentsThisMonth.length}</span>
              <span className="stat-label">Payments</span>
            </div>
          </div>
        </section>

        <section className="card">
          <h2>🛠️ Quick Actions</h2>
          <div className="form">
            <label className="form__field">
              <span className="form__label">Teacher Time Off</span>
              <div className="flex gap-8">
                <select className="form__input" value={teacherId} onChange={e=>setTeacherId(e.target.value)}>
                  {s.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select className="form__input" value={day} onChange={e=>setDay(e.target.value)}>
                  {['Mon','Tue','Wed','Thu','Fri'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button className="button" onClick={timeOff}>Apply</button>
              </div>
            </label>
            <label className="form__field">
              <span className="form__label">Mark Student Absent</span>
              <select className="form__input" onChange={markAbsent} defaultValue="">
                <option value="" disabled>Choose a student</option>
                {s.students.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="card">
          <h2>👨‍🏫 Teachers</h2>
          <ul className="list">
            {s.teachers.map(t => (
              <li key={t.id} className="list__item">
                <strong>{t.name}</strong> — {t.instrument}
                <div className="contact-info">
                  {t.email} • {t.phone}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>👨‍🎓 Recent Payments</h2>
          <ul className="list">
            {paymentsThisMonth.slice(0, 6).map(p => {
              const student = s.students.find(st => st.id === p.studentId);
              return (
                <li key={p.id} className="list__item">
                  <strong>{student?.name || `Student #${p.studentId}`}</strong>
                  <span className="payment-amount">${p.amount}</span>
                </li>
              );
            })}
          </ul>
          {paymentsThisMonth.length === 0 && (
            <p className="help">No payments received this month</p>
          )}
        </section>
      </div>

      {/* Students Directory - Full Width */}
      <section className="card full-width">
        <h2>👥 Students Directory</h2>
        <div className="students-grid">
          {s.students.map(st => {
            const teacher = s.teachers.find(t => t.id === st.teacherId);
            return (
              <div key={st.id} className="student-card">
                <h3>{st.name}</h3>
                <p><strong>Teacher:</strong> {teacher?.name}</p>
                <div className="contact-info">
                  <span>{st.email}</span>
                  <span>{st.phone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upcoming Events - Full Width */}
      <section className="card full-width">
        <h2>📅 Upcoming Events</h2>
        <p>Important dates affecting school operations</p>
        
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