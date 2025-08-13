# Tempo — Mock Scheduling App

A minimal, front-end–only scheduling demo for an in‑home music teaching business. Built as a bootcamp final project to showcase an MVP with clean structure, mock data, and role‑based dashboards.

## Highlights
- Three dashboards: Admin, Teacher, Student
- Mock API (mockData.js) returning Promises (no backend)
- Simple role guard via localStorage (`tempo-role`)
- Responsive layout with plain HTML/CSS
- Zero build tools or deps (static files)

## Tech
- HTML, CSS, JavaScript (no framework)
- VS Code + Live Server (recommended)

## Project Structure
- index.html — landing
- login.html — sets a demo role
- admin.html — admin dashboard
- teacher.html — teacher dashboard
- student.html — student dashboard
- styles.css — site styles
- mockData.js — in‑memory “API” (stats, teachers, students, lessons)

## Quick Start
1) Open this folder in VS Code.
2) Right‑click index.html → “Open with Live Server” (or open index.html in a browser).
3) Use login.html to choose a role and navigate.

If you need to set a role manually:
- In DevTools console: `localStorage.setItem('tempo-role','admin')` (or `teacher`, `student`).

## Mock API
Example:
```js
MockAPI.getAdminStats().then(console.log);
MockAPI.getRecentBookings().then(items => console.log(items));
```
All data is static mock data for demonstration.

## Roadmap (small, showcase‑friendly)
- Persist mock data to localStorage with basic CRUD
- Booking form and validation
- Export lessons to .ics (and optional Google Calendar add)
- Basic auth mock and loading states

## Notes
This is a demo MVP for portfolio purposes; not intended for production use.