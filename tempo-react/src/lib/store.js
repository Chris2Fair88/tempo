// Simple localStorage-backed mock store with demo data and operations

const STORAGE_KEY = 'tempo-store-v1';

const demo = {
  teachers: [
    { id: 1, name: 'Daniel Okafor', instrument: 'Guitar', email: 'daniel.okafor@example.com', phone: '555-0101', studentNotes: {} },
    { id: 2, name: 'Maya Reyes', instrument: 'Piano', email: 'maya.reyes@example.com', phone: '555-0102', studentNotes: {} },
  ],
  students: [
    { id: 1, name: 'Ethan Carter', email: 'ethan.carter@example.com', phone: '555-0201', teacherId: 2, material: 'Piano Adventures 2A', practiceLogs: [] },
    { id: 2, name: 'Noah Sullivan',  email: 'noah.sullivan@example.com',  phone: '555-0202', teacherId: 1, material: 'Hal Leonard Guitar 1', practiceLogs: [] },
    { id: 3, name: 'Olivia Bennett', email: 'olivia.bennett@example.com', phone: '555-0203', teacherId: 2, material: 'Voice Foundations 1', practiceLogs: [] },
  ],
  // Week plan: one lesson per student; status: scheduled|absent|cancelled
  lessons: [
    { id: 101, studentId: 1, teacherId: 2, day: 'Mon', time: '5:30p', status: 'scheduled' },
    { id: 102, studentId: 2, teacherId: 1, day: 'Tue', time: '4:00p', status: 'scheduled' },
    { id: 103, studentId: 3, teacherId: 2, day: 'Thu', time: '6:00p', status: 'absent' },
  ],
  // Dated to "this month" at load time so the demo never shows stale $0 revenue.
  payments: [
    { id: 201, studentId: 1, amount: 120, month: new Date().toISOString().slice(0, 7) },
    { id: 202, studentId: 2, amount: 100, month: new Date().toISOString().slice(0, 7) },
  ],
  timeOff: [ /* { teacherId, day } */ ],
  contacts: [ /* { name, email, phone, message } */ ],
  nextId: 300,
};

function migrate(state) {
  // Migrate teacher subject->instrument and notes->studentNotes
  if (state && Array.isArray(state.teachers)) {
    state.teachers.forEach(t => {
      if (t.subject && !t.instrument) t.instrument = t.subject;
      if (t.notes && !t.studentNotes) t.studentNotes = t.notes;
      delete t.subject; delete t.notes;
    });
  }
  return state;
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : structuredClone(demo);
    return migrate(parsed);
  } catch {
    return structuredClone(demo);
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const store = {
  getState() { return load(); },
  reset() { save(structuredClone(demo)); },

  registerUser(role, name, email, phone, opts = {}) {
    const s = load();
    if (role === 'teacher') {
      const id = ++s.nextId;
      const instrument = opts.instrument || opts.subject || 'Piano';
      s.teachers.push({ id, name, instrument, email, phone, studentNotes: {} });
      save(s); return { id };
    }
    // student/parent combined
    const id = ++s.nextId;
    const teacherId = opts.teacherId || 1;
    s.students.push({ id, name, email, phone, teacherId, material: '', practiceLogs: [] });
    // create lesson placeholder
    s.lessons.push({ id: ++s.nextId, studentId: id, teacherId, day: 'Fri', time: '5:00p', status: 'scheduled' });
    save(s); return { id };
  },

  // Teacher features
  getTeacherWeek(teacherId) {
    const s = load();
    const week = s.lessons.filter(l => l.teacherId === teacherId);
    const students = Object.fromEntries(s.students.map(st => [st.id, st]));
    return week.map(l => ({ ...l, studentName: students[l.studentId]?.name || 'Unknown' }));
  },
  setTeacherNote(teacherId, studentId, text) {
    const s = load();
    const t = s.teachers.find(t => t.id === teacherId);
    if (!t) return;
    if (!t.studentNotes) t.studentNotes = {};
    t.studentNotes[studentId] = text;
    save(s);
  },
  getTeacherStats(teacherId) {
    const s = load();
    const week = s.lessons.filter(l => l.teacherId === teacherId);
    const studentsThisWeek = new Set(week.map(l => l.studentId)).size;
    const month = new Date().toISOString().slice(0,7);
    const paid = s.payments
      .filter(p => p.month === month && s.students.find(st => st.id === p.studentId)?.teacherId === teacherId)
      .reduce((sum, p) => sum + p.amount, 0);
    return { studentsThisWeek, paidThisMonth: paid };
  },

  // Student/Parent features
  addPracticeLog(studentId, minutes, note) {
    const s = load();
    const st = s.students.find(st => st.id === studentId);
    if (!st) return;
    st.practiceLogs.push({ id: ++s.nextId, at: new Date().toISOString(), minutes, note });
    save(s);
  },
  cancelThisWeek(studentId) {
    const s = load();
    s.lessons.forEach(l => { if (l.studentId === studentId) l.status = 'absent'; });
    save(s);
  },

  // Admin features
  listTeachers() { return load().teachers; },
  listStudents() { return load().students; },
  listPayments(month = new Date().toISOString().slice(0,7)) {
    const s = load();
    return s.payments.filter(p => p.month === month);
  },
  listPaymentsByStudent(studentId, month) {
    const s = load();
    return s.payments.filter(p => p.studentId === studentId && (!month || p.month === month));
  },
  addPayment(studentId, amount, month = new Date().toISOString().slice(0,7)) {
    const s = load();
    s.payments.push({ id: ++s.nextId, studentId, amount: Number(amount || 0), month });
    save(s);
  },
  markTeacherTimeOff(teacherId, day) {
    const s = load();
    s.timeOff.push({ teacherId, day });
    s.lessons.forEach(l => { if (l.teacherId === teacherId && l.day === day) l.status = 'absent'; });
    save(s);
  },
  markStudentAbsent(studentId) {
    const s = load();
    s.lessons.forEach(l => { if (l.studentId === studentId) l.status = 'absent'; });
    save(s);
  },
  addContact(name, email, phone, message) {
    const s = load();
    s.contacts.push({ id: ++s.nextId, name, email, phone, message, at: new Date().toISOString() });
    save(s);
  }
}
