// localStorage-backed mock store. Teachers/students/lessons are seeded from
// a real snapshot pulled from the live "Tempo MCP Showcase" MCP server (see
// src/data/mcpSnapshot.js and README.md) — everything else (payments, time
// off, practice logs, notes) has no equivalent on that server and stays
// synthetic, generated against the real roster so it isn't obviously fake.

import { rawTeachers, rawStudents, rawEvents, rawAvailability } from '../data/mcpSnapshot';

const STORAGE_KEY = 'tempo-store-v1';

const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? 'p' : 'a';
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, '0')}${suffix}`;
}

// Real teachers, sourced from the MCP snapshot's list_teachers result.
const mcpTeachers = rawTeachers.map(t => ({
  id: t.id,
  name: t.name,
  instrument: t.subjects.join(' / '),
  zone: t.zone,
  // list_teachers has no contact fields — left unset rather than faked.
  email: undefined,
  phone: undefined,
  studentNotes: {},
}));

// Real students, sourced from the MCP snapshot's search_students result.
// teacherId is inferred (not an MCP field): the first teacher whose
// subjects include the student's instrument.
const mcpStudents = rawStudents.map(s => {
  const teacher = mcpTeachers.find(t => t.instrument.split(' / ').includes(s.subject));
  return {
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    teacherId: teacher ? teacher.id : mcpTeachers[0].id,
    level: s.level,
    material: '',
    practiceLogs: [],
  };
});

// Real lessons, sourced from the MCP snapshot's get_calendar_events results.
// Only "Lesson" category events are kept, mapped onto the app's generic
// Mon-Fri week grid by day-of-week (Saturday/Sunday events are dropped since
// the UI only has weekday columns).
const mcpLessons = rawEvents
  .filter(([, , category]) => category === 'Lesson')
  .map(([startISO, , , teacherId, studentId], i) => {
    const start = new Date(startISO);
    const day = WEEKDAY_ABBR[start.getDay()];
    return { id: 1000 + i, studentId, teacherId, day, time: formatTime(start), status: 'scheduled' };
  })
  .filter(l => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(l.day));

// Payments/time off/contacts have no equivalent on the MCP server (it's
// read-only and has no billing concept) — kept synthetic, against real ids.
const demo = {
  teachers: mcpTeachers,
  students: mcpStudents,
  lessons: mcpLessons,
  // Dated to "this month" at load time so the demo never shows stale $0 revenue.
  payments: mcpStudents.slice(0, 6).map((s, i) => ({
    id: 201 + i,
    studentId: s.id,
    amount: 90 + (i % 3) * 20,
    month: new Date().toISOString().slice(0, 7),
  })),
  timeOff: [ /* { teacherId, day } */ ],
  contacts: [ /* { name, email, phone, message } */ ],
  nextId: 1000 + mcpLessons.length + 300,
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
  // Real, live-sourced (via snapshot) per-teacher weekly load — see
  // src/data/mcpSnapshot.js. Not derived from the mock store's own state.
  getAvailabilitySummary() { return rawAvailability; },
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
