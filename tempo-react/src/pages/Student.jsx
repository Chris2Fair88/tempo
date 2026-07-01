import React, { useMemo } from 'react';
import { store } from '../lib/store';

/**
 * Student Dashboard
 * 
 * Provides access to student-specific features for music lessons including
 * practice tracking, lesson schedule, and progress monitoring.
 */

export default function Student() {
  const s = store.getState();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Get current student data
  const currentStudent = useMemo(() => 
    s.students.find(student => student.name === currentUser.name) || 
    s.students[0], // Fallback to first student for demo
    [s.students, currentUser.name]
  );

  // Get teacher information
  const myTeacher = useMemo(() => 
    s.teachers.find(teacher => teacher.id === currentStudent?.teacherId),
    [s.teachers, currentStudent?.teacherId]
  );

  // Get my lessons
  const myLessons = useMemo(() => 
    s.lessons.filter(lesson => lesson.studentId === currentStudent?.id),
    [s.lessons, currentStudent?.id]
  );

  // Get my payments
  const myPayments = useMemo(() => 
    store.listPayments().filter(payment => payment.studentId === currentStudent?.id),
    [currentStudent?.id]
  );

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Student Dashboard</h1>
        <p className="dashboard__subtitle">
          Track your music lessons, practice, and progress
        </p>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__grid">
          {/* Current Progress */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">🎵 My Progress</h2>
            </div>
            <div className="card__content">
              <div className="music-progress">
                <div className="progress-item">
                  <span className="progress-label">Instrument:</span>{' '}
                  <span className="progress-value">{currentStudent?.material?.split(' ')[0] || 'Piano'}</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Current Method Book:</span>{' '}
                  <span className="progress-value">{currentStudent?.material || 'Piano Adventures 2A'}</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Lesson Level:</span>{' '}
                  <span className="progress-value">Intermediate</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Practice Goal:</span>{' '}
                  <span className="progress-value">30 min/day</span>
                </div>
              </div>
            </div>
          </div>

          {/* This Week's Practice */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">📚 Practice Assignments</h2>
            </div>
            <div className="card__content">
              <div className="assignment-list">
                <div className="practice-assignment">
                  <div className="assignment-info">
                    <h3 className="assignment-title">Scales & Arpeggios</h3>
                    <p className="assignment-details">C Major scale, both hands</p>
                  </div>
                  <div className="assignment-status completed">
                    ✅ Practiced
                  </div>
                </div>
                <div className="practice-assignment">
                  <div className="assignment-info">
                    <h3 className="assignment-title">Bach Minuet in G</h3>
                    <p className="assignment-details">Focus on left hand articulation</p>
                  </div>
                  <div className="assignment-status pending">
                    🎯 In Progress
                  </div>
                </div>
                <div className="practice-assignment">
                  <div className="assignment-info">
                    <h3 className="assignment-title">Sight Reading</h3>
                    <p className="assignment-details">Book 2, pages 15-18</p>
                  </div>
                  <div className="assignment-status upcoming">
                    📅 This Week
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Schedule */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">📅 Lesson Schedule</h2>
            </div>
            <div className="card__content">
              <div className="lesson-schedule">
                {myLessons.length > 0 ? (
                  myLessons.map(lesson => (
                    <div key={lesson.id} className="lesson-item">
                      <span className="lesson-day">{lesson.day}</span>{' '}
                      <span className="lesson-time">{lesson.time}</span>{' '}
                      <span className="lesson-teacher">with {myTeacher?.name}</span>{' '}
                      <span className={`lesson-status ${lesson.status}`}>
                        {lesson.status === 'scheduled' ? '✅ Confirmed' :
                         lesson.status === 'absent' ? '❌ Missed' : '⏰ Pending'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="help">No lessons scheduled this week</p>
                )}
                
                {/* Next lesson info */}
                <div className="next-lesson">
                  <h4>Next Lesson:</h4>
                  <p><strong>Monday 2:00 PM</strong> with {myTeacher?.name || 'Your Teacher'}</p>
                  <p>Practice Room A • 30 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Information */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">👨‍🏫 My Teacher</h2>
            </div>
            <div className="card__content">
              {myTeacher ? (
                <div className="teacher-info">
                  <h3>{myTeacher.name}</h3>
                  <p><strong>Instrument:</strong> {myTeacher.instrument}</p>
                  <div className="contact-info">
                    <p>{myTeacher.email}</p>
                    <p>{myTeacher.phone}</p>
                  </div>
                  <div className="teacher-notes">
                    <h4>Recent Lesson Notes:</h4>
                    <p>"Great progress on scales! Focus on smooth finger transitions for next week."</p>
                  </div>
                </div>
              ) : (
                <p className="help">Teacher information not available</p>
              )}
            </div>
          </div>

          {/* Practice Log */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">⏱️ Practice Log</h2>
            </div>
            <div className="card__content">
              <div className="practice-stats">
                <div className="stat-item">
                  <span className="stat-number">4.5</span>
                  <span className="stat-label">Hours This Week</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">25</span>
                  <span className="stat-label">Min/Day Average</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">6</span>
                  <span className="stat-label">Days Practiced</span>
                </div>
              </div>
              
              <div className="practice-entries">
                <h4>Recent Practice Sessions:</h4>
                <div className="practice-entry">
                  <span className="practice-date">Today</span>{' • '}
                  <span className="practice-duration">30 min</span>{' • '}
                  <span className="practice-focus">Scales, Bach Minuet</span>
                </div>
                <div className="practice-entry">
                  <span className="practice-date">Yesterday</span>{' • '}
                  <span className="practice-duration">45 min</span>{' • '}
                  <span className="practice-focus">Technique, Sight reading</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">💳 Payment Status</h2>
            </div>
            <div className="card__content">
              {myPayments.length > 0 ? (
                <div className="payment-info">
                  <div className="payment-current">
                    <h4>Current Month: Paid ✅</h4>
                    <p>Amount: ${myPayments[myPayments.length - 1]?.amount || 120}</p>
                    <p>Next payment due: October 1st</p>
                  </div>
                  
                  <div className="payment-history">
                    <h4>Payment History:</h4>
                    {myPayments.slice(-3).map(payment => (
                      <div key={payment.id} className="payment-record">
                        <span>${payment.amount}</span>{' '}
                        <span>{payment.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="help">No payment information available</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">🎭 Upcoming Events</h2>
            </div>
            <div className="card__content">
              <div className="events-list">
                <div className="event-item">
                  <div className="event-date">
                    <span className="event-month">Oct</span>{' '}
                    <span className="event-day">15</span>
                  </div>
                  <div className="event-details">
                    <h4>Spring Music Recital</h4>
                    <p>Perform your pieces for family and friends</p>
                    <p className="event-location">Main Performance Hall</p>
                  </div>
                </div>
                
                <div className="event-item">
                  <div className="event-date">
                    <span className="event-month">Oct</span>{' '}
                    <span className="event-day">28</span>
                  </div>
                  <div className="event-details">
                    <h4>Piano Masterclass</h4>
                    <p>Special workshop with guest artist</p>
                    <p className="event-location">Studio B</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
