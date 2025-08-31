# Tempo — Scheduling App (React + Vite)

[🚀 Live Demo on GitHub Pages](https://Chris2Fair88.github.io/tempo/)

## Overview

Tempo is a single-page React application for managing in-home music lesson scheduling. It features role-based dashboards (Admin, Teacher, Student), Google Calendar API integration for holidays/events, and a clean, responsive UI.

---

## Features

- **Role-Based Dashboards:** Separate interfaces for Admin, Teacher, and Student, each with tailored functionality.
- **Google Calendar API Integration:** Fetches and displays public US school holidays and events.
- **Mock Data & State Management:** Simulated authentication, payments, and lesson booking using in-memory and localStorage data.
- **Responsive Design:** Mobile-first, grid-based layouts with uniform card components and consistent theming.
- **Error Handling:** User-friendly error messages and loading states for all API interactions.
- **Production-Ready Build:** Optimized for deployment to GitHub Pages.

---

## Technical Details

### Tech Stack

- **Frontend:** React 18, Vite, React Router
- **API:** Google Calendar API (public holidays/events)
- **State:** React hooks, localStorage for persistence
- **Styling:** Custom CSS (no frameworks), BEM-style class naming

### Key Files & Structure

- `src/pages/` — Dashboard pages for each user role
- `src/components/` — Shared UI components (Header, Toasts, Modals, etc.)
- `src/utils/GoogleCalendarApi.js` — Google Calendar API logic and filtering
- `src/lib/` — Auth, notifications, and store logic
- `src/styles/index.css` — Main CSS, grid system, and card styling
- `vite.config.js` — Vite config with base path for GitHub Pages

### Main Functionalities

- **Authentication:** Simulated login/register with role-based routing
- **Admin:** View stats, manage users, review payments, see all events
- **Teacher:** Set availability, view schedule, see upcoming school holidays
- **Student:** Book lessons, log practice, make payments, see upcoming events
- **API Integration:** Fetches and filters only school-closure holidays from Google Calendar

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```
