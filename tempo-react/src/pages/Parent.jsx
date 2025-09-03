import React, { useMemo } from 'react';
import { store } from '../lib/store';

/**
 * Parent Dashboard
 * 
 * Provides access to parent-specific features including child's lesson tracking,
 * payment management, and communication with teachers.
 */

export default function Parent() {
  const s = store.getState();
  // const currentUser = JSON.parse(localStorage.getItem('user') || '{}'); // Unused for now
  
  // Get children (for demo, we'll use the current user's associated students)
  const myChildren = useMemo(() => {
    // In a real app, this would be based on parent-child relationships
    // For demo, we'll show the first student as the child
    return [s.students[0]].filter(Boolean);
  }, [s.students]);

  const childData = myChildren[0]; // Primary child for demo

  // Get child's teacher
  const childTeacher = useMemo(() => 
    s.teachers.find(teacher => teacher.id === childData?.teacherId),
    [s.teachers, childData?.teacherId]
  );

  // Get child's lessons
  const childLessons = useMemo(() => 
    s.lessons.filter(lesson => lesson.studentId === childData?.id),
    [s.lessons, childData?.id]
  );

  // Get payment history
  const paymentHistory = useMemo(() => 
    store.listPayments().filter(payment => payment.studentId === childData?.id),
    [childData?.id]
  );

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Parent Dashboard</h1>
        <p className="dashboard__subtitle">
          Monitor your child's music education progress and manage account
        </p>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__grid">
          {/* Child Overview */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">👶 My Child</h2>
            </div>
            <div className="card__content">
              {childData ? (
                <div className="child-overview">
                  <h3>{childData.name}</h3>
                  <div className="child-details">
                    <p><strong>Instrument:</strong> {childData.material?.split(' ')[0] || 'Piano'}</p>
                    <p><strong>Level:</strong> Intermediate</p>
                    <p><strong>Method Book:</strong> {childData.material || 'Piano Adventures 2A'}</p>
                    <p><strong>Teacher:</strong> {childTeacher?.name || 'Not assigned'}</p>
                  </div>
                  <div className="quick-stats">
                    <div className="stat-item">
                      <span className="stat-number">95%</span>
                      <span className="stat-label">Attendance</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">4.2</span>
                      <span className="stat-label">Avg Practice/Day</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="help">No child information available</p>
              )}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">📅 This Week's Lessons</h2>
            </div>
            <div className="card__content">
              <div className="lesson-schedule">
                {childLessons.length > 0 ? (
                  childLessons.map(lesson => (
                    <div key={lesson.id} className="lesson-item">
                      <span className="lesson-day">{lesson.day}</span>
                      <span className="lesson-time">{lesson.time}</span>
                      <span className="lesson-teacher">{childTeacher?.name}</span>
                      <span className={`lesson-status ${lesson.status}`}>
                        {lesson.status === 'scheduled' ? '✅ Confirmed' : 
                         lesson.status === 'absent' ? '❌ Missed' : '⏰ Pending'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="help">No lessons scheduled this week</p>
                )}
                
                <div className="next-lesson-info">
                  <h4>Next Lesson:</h4>
                  <p><strong>Monday 2:00 PM</strong></p>
                  <p>Practice Room A • 30 minutes</p>
                  <button className="button button--secondary">Request Reschedule</button>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Progress */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">🎵 Practice Progress</h2>
            </div>
            <div className="card__content">
              <div className="practice-summary">
                <h4>This Week's Practice</h4>
                <div className="practice-days">
                  <div className="practice-day completed">
                    <span>Mon</span>
                    <span>30 min</span>
                  </div>
                  <div className="practice-day completed">
                    <span>Tue</span>
                    <span>25 min</span>
                  </div>
                  <div className="practice-day completed">
                    <span>Wed</span>
                    <span>35 min</span>
                  </div>
                  <div className="practice-day missed">
                    <span>Thu</span>
                    <span>0 min</span>
                  </div>
                  <div className="practice-day completed">
                    <span>Fri</span>
                    <span>40 min</span>
                  </div>
                  <div className="practice-day upcoming">
                    <span>Sat</span>
                    <span>--</span>
                  </div>
                  <div className="practice-day upcoming">
                    <span>Sun</span>
                    <span>--</span>
                  </div>
                </div>
                
                <div className="practice-goals">
                  <h4>Current Practice Goals</h4>
                  <ul>
                    <li>✅ Master C Major scale</li>
                    <li>🎯 Learn Bach Minuet in G (in progress)</li>
                    <li>📚 Complete sight reading exercises</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Communication */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">💬 Teacher Notes</h2>
            </div>
            <div className="card__content">
              {childTeacher ? (
                <div className="teacher-communication">
                  <div className="teacher-info">
                    <h4>{childTeacher.name}</h4>
                    <p>{childTeacher.instrument} Instructor</p>
                    <div className="contact-buttons">
                      <button className="button button--secondary">Send Message</button>
                      <button className="button button--secondary">Schedule Conference</button>
                    </div>
                  </div>
                  
                  <div className="recent-notes">
                    <h4>Recent Lesson Notes:</h4>
                    <div className="note-item">
                      <span className="note-date">Sept 25, 2025</span>
                      <p>"Great improvement in finger technique! {childData?.name} is ready to start working on more complex pieces."</p>
                    </div>
                    <div className="note-item">
                      <span className="note-date">Sept 18, 2025</span>
                      <p>"Excellent practice consistency this week. Focus on dynamics in the Bach piece for next lesson."</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="help">Teacher information not available</p>
              )}
            </div>
          </div>

          {/* Payment Management */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">💳 Payment & Billing</h2>
            </div>
            <div className="card__content">
              <div className="payment-overview">
                <div className="current-status">
                  <h4>Current Month Status</h4>
                  <div className="payment-status paid">
                    <span className="status-icon">✅</span>
                    <span>September 2025 - PAID</span>
                    <span className="amount">${paymentHistory[paymentHistory.length - 1]?.amount || 120}</span>
                  </div>
                  <p><strong>Next payment due:</strong> October 1, 2025</p>
                </div>
                
                <div className="payment-actions">
                  <button className="button button--primary">Make Payment</button>
                  <button className="button button--secondary">Update Card</button>
                  <button className="button button--secondary">View Receipts</button>
                </div>
                
                <div className="payment-history">
                  <h4>Recent Payments</h4>
                  {paymentHistory.slice(-3).map(payment => (
                    <div key={payment.id} className="payment-record">
                      <span className="payment-month">{payment.month}</span>
                      <span className="payment-amount">${payment.amount}</span>
                      <span className="payment-status">✅ Paid</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">🎭 Upcoming Events</h2>
            </div>
            <div className="card__content">
              <div className="parent-events">
                <div className="event-item">
                  <div className="event-date">
                    <span className="event-month">Oct</span>
                    <span className="event-day">15</span>
                  </div>
                  <div className="event-details">
                    <h4>Spring Music Recital</h4>
                    <p>Your child will perform "Bach Minuet in G"</p>
                    <p className="event-location">Main Performance Hall, 7:00 PM</p>
                    <button className="button button--secondary">RSVP</button>
                  </div>
                </div>
                
                <div className="event-item">
                  <div className="event-date">
                    <span className="event-month">Oct</span>
                    <span className="event-day">22</span>
                  </div>
                  <div className="event-details">
                    <h4>Parent-Teacher Conference</h4>
                    <p>Quarterly progress review with {childTeacher?.name}</p>
                    <p className="event-location">Studio A, 6:30 PM</p>
                    <button className="button button--secondary">Confirm</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">⚙️ Account Management</h2>
            </div>
            <div className="card__content">
              <div className="account-options">
                <div className="option-group">
                  <h4>Lesson Management</h4>
                  <button className="button button--secondary">Request Makeup Lesson</button>
                  <button className="button button--secondary">Change Lesson Time</button>
                  <button className="button button--secondary">Vacation Hold</button>
                </div>
                
                <div className="option-group">
                  <h4>Communication Preferences</h4>
                  <label className="checkbox-option">
                    <input type="checkbox" defaultChecked />
                    Email lesson reminders
                  </label>
                  <label className="checkbox-option">
                    <input type="checkbox" defaultChecked />
                    Practice progress updates
                  </label>
                  <label className="checkbox-option">
                    <input type="checkbox" defaultChecked />
                    Event notifications
                  </label>
                </div>
                
                <div className="option-group">
                  <h4>Account Information</h4>
                  <button className="button button--secondary">Update Contact Info</button>
                  <button className="button button--secondary">Emergency Contacts</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
