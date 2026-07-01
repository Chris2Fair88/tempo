import { useMemo } from 'react';
import { store } from '../lib/store';
import { getUserData } from '../lib/auth';

/**
 * Teacher Dashboard
 *
 * Provides access to teacher-specific features including student management,
 * lesson planning, and schedule oversight.
 */

const WEEKDAYS = [
  { key: 'Mon', label: 'Monday' },
  { key: 'Tue', label: 'Tuesday' },
  { key: 'Wed', label: 'Wednesday' },
  { key: 'Thu', label: 'Thursday' },
  { key: 'Fri', label: 'Friday' },
];

export default function Teacher() {
  const s = store.getState();
  const currentUser = getUserData() || {};

  // The logged-in identity (mockAuth) and the roster (store.js) are separate mock datasets
  // with unrelated ID spaces, so resolve the matching teacher record by name.
  const myTeacherRecord = useMemo(() =>
    s.teachers.find(t => t.name === currentUser.name) || s.teachers[0],
    [s.teachers, currentUser.name]
  );

  // Get students assigned to this teacher
  const myStudents = useMemo(() =>
    s.students.filter(student => student.teacherId === myTeacherRecord?.id),
    [s.students, myTeacherRecord]
  );

  // Get recent payments for my students
  const myStudentPayments = useMemo(() => {
    const myStudentIds = myStudents.map(s => s.id);
    return store.listPayments().filter(payment => 
      myStudentIds.includes(payment.studentId)
    );
  }, [myStudents]);

  const totalRevenue = myStudentPayments.reduce((sum, p) => sum + p.amount, 0);

  // This week's lessons for the logged-in teacher, grouped by day
  const myWeek = useMemo(() =>
    store.getTeacherWeek(myTeacherRecord?.id),
    [myTeacherRecord, s.lessons]
  );
  const weekByDay = WEEKDAYS.map(({ key, label }) => ({
    key, label,
    lessons: myWeek.filter(l => l.day === key),
  }));

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
                        <span className="student-level">Level: {student.level || 'Beginner'}</span>{' • '}
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
                {weekByDay.map(({ key, label, lessons }) => (
                  <div className="schedule-day" key={key}>
                    <h4>{label}</h4>
                    {lessons.length > 0 ? (
                      lessons.map(lesson => (
                        <div className="lesson-slot" key={lesson.id}>
                          <span className="lesson-time">{lesson.time}</span>{' '}
                          <span className="lesson-student">
                            {lesson.studentName}
                            {lesson.status === 'absent' ? ' (absent)' : ''}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="lesson-slot">
                        <span className="lesson-student">No lessons scheduled</span>
                      </div>
                    )}
                  </div>
                ))}
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
                        <strong>{student.name}</strong>{' '}
                        <span className="progress-level">({student.level || 'Beginner'})</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '75%'}}></div>
                      </div>
                      <div className="progress-notes">
                        <span>Last lesson: Scales and arpeggios</span>
                        <br />
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
