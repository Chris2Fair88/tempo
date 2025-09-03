import { useMemo } from 'react';
import { store } from '../lib/store';

/**
 * Teacher Dashboard
 * 
 * Provides access to teacher-specific features including student management,
 * lesson planning, and schedule oversight.
 */

export default function Teacher() {
  const s = store.getState();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Get students assigned to this teacher
  const myStudents = useMemo(() => 
    s.students.filter(student => student.teacherId === currentUser.id),
    [s.students, currentUser.id]
  );

  // Get recent payments for my students
  const myStudentPayments = useMemo(() => {
    const myStudentIds = myStudents.map(s => s.id);
    return store.listPayments().filter(payment => 
      myStudentIds.includes(payment.studentId)
    );
  }, [myStudents]);

  const totalRevenue = myStudentPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Teacher Dashboard</h1>
        <p className="dashboard__subtitle">
          Manage your students and track their progress
        </p>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__grid">
          {/* Overview Stats */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">📊 My Overview</h2>
            </div>
            <div className="card__content">
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{myStudents.length}</span>
                  <span className="stat-label">My Students</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{currentUser.instrument || 'Music'}</span>
                  <span className="stat-label">Instrument</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">${totalRevenue}</span>
                  <span className="stat-label">Student Revenue</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{myStudentPayments.length}</span>
                  <span className="stat-label">Recent Payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">🎵 Quick Actions</h2>
            </div>
            <div className="card__content">
              <div className="action-buttons">
                <button className="button button--primary">
                  📝 Create Lesson Plan
                </button>
                <button className="button button--secondary">
                  📋 Grade Assignment
                </button>
                <button className="button button--secondary">
                  📊 Progress Report
                </button>
                <button className="button button--secondary">
                  📅 Schedule Lesson
                </button>
              </div>
            </div>
          </div>

          {/* My Students */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">👥 My Students</h2>
            </div>
            <div className="card__content">
              {myStudents.length > 0 ? (
                <ul className="list">
                  {myStudents.map(student => (
                    <li key={student.id} className="list__item">
                      <strong>{student.name}</strong>
                      <div className="student-details">
                        <span className="student-level">Level: {student.level || 'Beginner'}</span>
                        <span className="student-progress">Progress: {student.progress || 'Good'}</span>
                      </div>
                      <div className="contact-info">
                        {student.email} • {student.phone}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="help">No students assigned to you yet</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">💳 Student Payments</h2>
            </div>
            <div className="card__content">
              {myStudentPayments.length > 0 ? (
                <ul className="list">
                  {myStudentPayments.slice(0, 5).map(payment => {
                    const student = myStudents.find(s => s.id === payment.studentId);
                    return (
                      <li key={payment.id} className="list__item">
                        <strong>{student?.name || `Student #${payment.studentId}`}</strong>
                        <span className="payment-amount">${payment.amount}</span>
                        <span className="payment-date">{payment.date}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="help">No recent payments from your students</p>
              )}
            </div>
          </div>

          {/* Schedule Overview */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">📅 This Week's Schedule</h2>
            </div>
            <div className="card__content">
              <div className="schedule-grid">
                <div className="schedule-day">
                  <h4>Monday</h4>
                  <div className="lesson-slot">
                    <span className="lesson-time">2:00 PM</span>
                    <span className="lesson-student">Harmony Mitchell</span>
                  </div>
                  <div className="lesson-slot">
                    <span className="lesson-time">4:00 PM</span>
                    <span className="lesson-student">Open Slot</span>
                  </div>
                </div>
                <div className="schedule-day">
                  <h4>Wednesday</h4>
                  <div className="lesson-slot">
                    <span className="lesson-time">3:00 PM</span>
                    <span className="lesson-student">Available</span>
                  </div>
                </div>
                <div className="schedule-day">
                  <h4>Friday</h4>
                  <div className="lesson-slot">
                    <span className="lesson-time">1:00 PM</span>
                    <span className="lesson-student">Group Practice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Progress Tracking */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">📈 Progress Tracking</h2>
            </div>
            <div className="card__content">
              {myStudents.length > 0 ? (
                <div className="progress-list">
                  {myStudents.map(student => (
                    <div key={student.id} className="progress-item">
                      <div className="progress-header">
                        <strong>{student.name}</strong>
                        <span className="progress-level">{student.level || 'Beginner'}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '75%'}}></div>
                      </div>
                      <div className="progress-notes">
                        <span>Last lesson: Scales and arpeggios</span>
                        <span>Next goal: Bach Invention No. 1</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="help">No student progress to track yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
