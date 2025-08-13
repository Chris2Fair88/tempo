(() => {
  // Demo ISO dates
  const LESSON_DATE_1 = '2025-08-14T18:00:00Z';
  const LESSON_DATE_2 = '2025-08-16T16:00:00Z';

  const MockAPI = {
    // Shared reference data
    getTeachers() {
      return Promise.resolve([
        { id: 1, name: 'Priya', subject: 'Piano' },
        { id: 2, name: 'Sam', subject: 'Guitar' },
      ]);
    },
    getStudents() {
      return Promise.resolve([
        { id: 1, name: 'Jamie' },
        { id: 2, name: 'Alex' },
      ]);
    },
    getLessons() {
      return Promise.resolve([
        { id: 1, teacherId: 1, studentId: 1, date: LESSON_DATE_1 },
        { id: 2, teacherId: 2, studentId: 2, date: LESSON_DATE_2 },
      ]);
    },

    // Optional extras for dashboards
    getAdminStats() {
      return Promise.resolve({ teachers: 2, students: 2, lessonsThisWeek: 2 });
    },
    getRecentBookings(limit = 5) {
      const items = [
        'Jamie booked Piano with Priya — Thu 6:00p',
        'Alex booked Guitar with Sam — Sat 4:00p',
      ];
      return Promise.resolve(items.slice(0, limit));
    },
    getTeacherTodayLessons(teacherId = 1) {
      return Promise.resolve([
        '4:00p — Guitar with Alex (Home)',
        '6:00p — Piano with Jamie (Home)',
      ]);
    },
    getStudentUpcomingLessons(studentId = 1) {
      return Promise.resolve([
        'Thu 6:00p — Piano with Priya',
        'Sat 4:00p — Guitar with Sam',
      ]);
    },
  };

  // Expose globally for <script> usage
  window.MockAPI = Object.freeze(MockAPI);
})();