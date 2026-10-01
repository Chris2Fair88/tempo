import { useMemo, useState } from 'react';
import { store } from '../lib/store';
import { toast } from '../lib/notify';
import UpcomingEvents from '../components/UpcomingEvents';

export default function Admin({ calendarEvents = [] }) {
  const s = store.getState();
  const [teacherId, setTeacherId] = useState(s.teachers[0]?.id ?? '');
  const [day, setDay] = useState('Mon');
  const paymentsThisMonth = useMemo(() => store.listPayments(), []);
  const totalRevenue = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
  const availability = useMemo(() => store.getAvailabilitySummary(), []);

  function timeOff() {
    store.markTeacherTimeOff(teacherId, day);
    toast('Time off applied');
  }

  function markAbsent(e) {
    store.markStudentAbsent(e.target.value);
    toast('Student marked absent');
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Admin Dashboard</h1>
        <p className="dashboard__subtitle">
          Manage teachers, students, and school operations
        </p>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__grid">
          {/* Overview Card */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">📊 Overview</h2>
            </div>
            <div className="card__content">
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
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">🛠️ Quick Actions</h2>
            </div>
            <div className="card__content">
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
            </div>
          </div>

          {/* Teachers Card */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">👨‍🏫 Teachers</h2>
            </div>
            <div className="card__content">
              <ul className="list">
                {s.teachers.map(t => (
                  <li key={t.id} className="list__item">
                    <strong>{t.name}</strong> — {t.instrument}
                    <div className="contact-info">
                      {t.email || 'no email on file'} • {t.phone || 'no phone on file'}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Teacher Availability Card - checked-in snapshot of Tempo MCP Showcase responses */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">🔌 Teacher Availability (MCP snapshot)</h2>
            </div>
            <div className="card__content">
              <p className="help">
                Snapshot of the Tempo MCP Showcase server's get_teacher_availability
                results, {availability.range.start} to {availability.range.end}.
              </p>
              <ul className="list">
                {availability.teachers.map(t => (
                  <li key={t.teacherId} className="list__item">
                    <strong>{t.name}</strong>
                    <div className="contact-info">
                      {t.lessons} lessons ({Math.round(t.lessonMinutes / 60)}h)
                      {t.openSlots > 0 ? ` • ${t.openSlots} open slot(s)` : ''}
                      {t.timeOffBlocks > 0 ? ` • ${t.timeOffBlocks} time-off block(s)` : ''}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Payments Card */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">� Recent Payments</h2>
            </div>
            <div className="card__content">
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
            </div>
          </div>

          {/* Students Directory Card - Full Width */}
          <div className="card card--full-width">
            <div className="card__header">
              <h2 className="card__title">👥 Students Directory</h2>
            </div>
            <div className="card__content">
              <div className="students-grid">
                {s.students.map(st => {
                  const teacher = s.teachers.find(t => t.id === st.teacherId);
                  return (
                    <div key={st.id} className="student-card">
                      <h3>{st.name}</h3>
                      <p><strong>Teacher:</strong> {teacher?.name}</p>
                      <div className="contact-info">
                        <span>{st.email} • {st.phone}</span>
                      </div>
                      <div className="student-progress">
                        <div className="progress-item">
                          <span>Material: {st.material || 'Piano Adventures 2A'}</span>
                        </div>
                        <div className="progress-item">
                          <span>Progress: Good</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Calendar Events Card - Using Reusable Component */}
          <UpcomingEvents 
            calendarEvents={calendarEvents}
            maxEvents={7}
            variant="admin"
            showBadges={true}
          />
        </div>
      </div>
    </div>
  );
}