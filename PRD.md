# SOAS Feedback Collector: Product Requirements Document

| Field | Detail |
|---|---|
| **Project Name** | SOAS Feedback Collector |
| **Target Release** | Q2 2026 (Active) |
| **Status** | v1.0: Production Ready |
| **Author** | Pawan Simha R (MCA, SOAS, Sapthagiri NPS University) |
| **Stack** | React 19 + Vite 8 / Express 4.21 / MongoDB 8 / Mongoose 8 |

---

## Executive Summary

The SOAS Feedback Collector is a full-stack MERN application that replaces paper-based or ad-hoc course feedback at Sapthagiri NPS University's School of Sciences (SOAS). It enables MCA students to submit per-subject ratings and comments after each class session, provides a public anonymous channel for unfiltered input, and delivers aggregated analytics to administrators via a unified dashboard: all without exposing individual student identity.

---

## Problem Statement

MCA program coordinators at Sapthagiri NPS University lacked a structured, auditable mechanism to collect course feedback. Existing approaches, scattered Google Forms or verbal collection, suffered from:

- **No session gating**: Students could submit feedback at any time, decoupled from actual class delivery.
- **Zero identity verification**: Inflated or spam submissions with no way to attribute per-student participation.
- **No public anonymity**: Students uncomfortable providing negative feedback through tracked channels had no outlet.
- **Manual aggregation**: Faculty manually compiled CSV reports consuming 2-3 hours per review cycle.
- **No participation tracking**: Instructors could not identify which students had/had not submitted feedback for a given subject.

This system solves all five pain points through JWT-authenticated feedback with session allotment gating, a dual-channel model (authenticated + fully anonymous), and real-time aggregated reporting with CSV/Word export.

---

## Target Personas

| Persona | Role | Auth Level | Primary Goal | Friction |
|---|---|---|---|---|
| **MCA Student** | Course attendee | JWT (student) | Submit per-subject feedback when a session is open; view personal history | Needs to wait for admin to open the feedback window; limited to 50-300 character comments |
| **Anonymous User** | External or wary student | None | Submit feedback without revealing identity | Cannot view history or track submissions; 100-300 character minimum |
| **Administrator** | Program coordinator / faculty | JWT (admin) | Open/close feedback windows per class; view per-subject stats; export reports; monitor anonymous submissions | Must manually toggle allotments; no auto-scheduling or email notifications |

---

## Success Metrics (OKRs / KPIs)

| KPI | Target | Measurement |
|---|---|---|
| **Feedback Completion Rate** | ≥ 80% per class per session | `gaveStudents / totalStudents` from `/api/admin/feedback/subject/:subject/coverage` |
| **Submission Latency** | < 2 seconds p95 | API response time for `POST /api/feedback/submit` |
| **Admin Report Generation** | < 3 seconds | Time from click to download for CSV/Word export of a full class |
| **Anonymous Submission Rate** | ≥ 10% of authenticated rate | Ratio of `publicFeedbacks.count` to `feedbacks.count` in db-overview |
| **Zero-Error Build** | 100% | `npm run build` in client passes without warnings or errors |

---

## Core Features & Requirements (MoSCoW)

### P0: Must Have (Shipped)

| Feature | Implementation | Evidence |
|---|---|---|
| **Branded 404 Page** | Custom NotFound.jsx with CSS compass illustration, brand logo, two recovery CTAs (Go Homepage + Go Back), and responsive/motion-reduced support; renders outside the main layout with no Navbar/Footer | `client/src/components/NotFound.jsx` |
| **JWT Authentication** | Email + USN + password login; bcrypt hashing; 30-day token stored in sessionStorage | `server/routes/auth.js:9` |
| **Allotment Gating** | Admin opens/closes feedback windows per class; students blocked when closed | `server/routes/allotment.js:35`, `Feedback.js:44-48` |
| **Per-Subject Feedback** | Student submits rating (1-5) + comments (50-300 chars) per subject; upsert prevents duplicates | `server/routes/feedback.js:25` |
| **Public Anonymous Feedback** | No auth required; subject + optional faculty name + comments (100-300 chars) | `server/routes/public.js:12` |
| **Admin DB Overview** | Unified view of all collections: students, feedbacks, allotments, and public feedbacks, with per-subject stats | `server/routes/admin.js:189` |
| **Admin Coverage Tracking** | Per-subject view of which students gave/did not give feedback within a class | `server/routes/admin.js:148` |
| **Report Exports** | CSV (.csv) and Word (.doc) download utilities with auto-generated HTML tables | `client/src/utils/download.js` |

### P1: Should Have (Shipped)

| Feature | Implementation | Evidence |
|---|---|---|
| **Student Dashboard** | Welcome view with active session status and start-feedback button | `client/src/components/Dashboard.jsx` |
| **Feedback History** | Feedback table with star rating column, loading/error states for authenticated student | `client/src/components/MyFeedback.jsx` |
| **Star Rating Selector** | Visual 1–5 star UI in feedback form, stored per-subject in localStorage | `client/src/components/FeedbackForm.jsx` |
| **Class Selection & Drill-Down** | Admin selects class (fetched dynamically from API) → views student list → drills into individual student feedback | `AdminClassSelect.jsx`, `AdminStudents.jsx`, `AdminStudentFeedback.jsx` |
| **Admin Anonymous View** | Search + filter + export for all public anonymous submissions | `AdminAnonymous.jsx` |
| **Session Allocation Message** | Admin sets a custom message (15-50 chars) when opening a feedback window; opening-only validation | `server/routes/allotment.js:52-70` |
| **Rate Limiting** | 10 requests per 15 minutes on public anonymous endpoint | `server/routes/public.js:25-30` |
| **API Proxy** | Vite dev server proxies `/api` calls to backend on port 5000 | `client/vite.config.js` |
| **Social Icons in Footer** | SVG icon buttons for YouTube, Instagram, Facebook, LinkedIn, WhatsApp | `client/src/components/Footer.jsx` |

### P2: Could Have (Future)

| Feature | Rationale | Suggested Approach |
|---|---|---|
| **Analytics Dashboard** | Visualize submission trends, average ratings, sentiment over time | Chart.js or Recharts + new `/api/admin/analytics` endpoint |
| **Email Notifications** | Alert students when a feedback window opens / closes | Nodemailer + cron-based or webhook-driven trigger |
| **Faculty Role** | Separate read-only view for faculty to see aggregated class stats without exposing student identity | New `role: 'faculty'` in Student model; filtered query layer |
| **Auto-Scheduled Allotments** | Admins pre-configure feedback windows on a calendar | Extend Allotment model with `startDate`, `endDate`; background scheduler |
| **Unit / Integration Tests** | Currently zero test coverage | Vitest (client) + Jest / Supertest (server) |

---

## AI & Technical Constraints

| Constraint | Value | Location |
|---|---|---|
| **Password Security** | bcryptjs (salt rounds: default 10) | `server/middleware/auth.js`, `server/routes/auth.js:23` |
| **Token Lifespan** | 30 days | `server/routes/auth.js:29` |
| **Token Storage** | `sessionStorage` (cleared on tab close) | `client/src/context/AuthContext.jsx:14` |
| **Authenticated Comment Length** | 50-300 characters (trimmed, inclusive) | `server/routes/feedback.js:22-23` |
| **Anonymous Comment Length** | 100-300 characters | `server/routes/public.js:21-26` |
| **Allotment Message Length** | 15-50 characters | `server/routes/allotment.js:43-48` |
| **Rating Scale** | 1-5 (integer) with visual star selector | `client/src/components/FeedbackForm.jsx` |
| **Rate Limiting** | 10 requests per 15 min window on public feedback | `server/routes/public.js:25-30` |
| **Request Body Limit** | 10kb (JSON payload) | `server/server.js:35` |
| **Database** | MongoDB via Mongoose 8; schema-free migrations | `server/models/*` |
| **API Base** | `http://localhost:5000/api` (proxied in dev via Vite) | `client/src/config/api.js`, `client/vite.config.js` |
| **Frontend Port** | 5173 (Vite dev with API proxy to :5000) | `client/vite.config.js` |
| **Backend Port** | 5000 (Express) | `server/server.js:28` |
| **NoSQL Schema** | 4 collections: `students`, `feedbacks`, `publicfeedbacks`, `allotments` | `server/models/*` |
| **Asset Format** | All raster images converted to **WebP** (quality 85) for production | `client/public/images/*.webp` |
| **Favicon** | Original `logo.webp` renamed to `favicon.webp`: used exclusively as browser favicon | `client/public/images/favicon.webp` |
| **Navbar Logo** | Separate `navbar-logo.webp` asset for Navbar, Landing, and Login components | `client/public/images/navbar-logo.webp` |
| **Auth Guard** | `ProtectedRoute` redirects unauthenticated users to `/` | `client/src/App.jsx:18-22` |
| **CORS** | Wide-open (`cors()` with no origin restriction) | `server/server.js:34` |
| **404 Page** | Standalone NotFound component with CSS compass illustration, brand logo, animated needle wobble, radial spotlight, two recovery CTAs, and responsive/motion-reduced support; renders outside the main layout with no Navbar/Footer | `client/src/components/NotFound.jsx` |
| **License** | GNU General Public License v3.0: headers injected into all 44 source files | `LICENSE.md` |
| **SEO / GEO** | JSON-LD (WebApplication schema), Open Graph, Twitter Card, meta author/description/keywords | `client/index.html` |

---

## User Journey / Flow

### Primary Flow: Authenticated Student Feedback

```
1. Admin opens feedback window for "MCA, 1st Year, 2nd Sem, A sec"
   → POST /api/allotments  { classGroup, message }
   → Allotment.isOpen = true

2. Student visits http://localhost:5173
   → Landing page → clicks "Get Started"

3. Student logs in
   → POST /api/auth/login  { email, usn, password }
   → Receives JWT token (30-day expiry)

4. Dashboard loads
   → GET /api/allotments/status  → { open: true, message: "..." }
   → Student clicks "Start Feedback"

5. Feedback form displays subject list
   → GET /api/feedback/subjects  → ["DevOps", "MERN", ...]
   → Student selects subject, enters rating + comments

6. Student submits feedback
   → POST /api/feedback/submit  { subject, rating, comments }
   → Server verifies: class alloment is open,
     comment length (50-300), upserts existing
   → 201 Created

7. Admin reviews participation
   → GET /api/admin/feedback/subject/:subject/coverage?class=...
   → Sees gave/not-given counts and student lists

8. Admin exports report
   → Clicks "Download CSV" or "Download Word Doc"
   → File generated client-side via Blob + download.js
```

### Secondary Flow: Public Anonymous Feedback

```
1. User visits http://localhost:5173/feedback/public
   → No authentication required

2. User selects subject from dropdown
   → GET /api/public/subjects

3. User optionally enters faculty name, writes comments (100-300 chars)

4. User clicks "Submit Anonymously"
   → POST /api/public/feedback  { subject, facultyName, comments }
   → 201 Created

5. Admin reviews in Admin Anonymous panel
   → GET /api/public/feedbacks  (requires admin JWT)
```

---

## Licensing

This project is distributed under the **GNU General Public License v3.0**. Every source file (`.jsx`, `.js`, `.css`, `.html`) carries the GPLv3 copyright header attributing Pawan Simha R as the copyright holder. See [LICENSE.md](./LICENSE.md) for the full legal text.

---

## Out of Scope (Non-Goals)

- **Real-time messaging / chat**: The system does not support direct messaging between students and faculty.
- **Multi-language support**: All UI text and data entries are in English only.
- **Mobile native app**: The frontend is a responsive web application only; no React Native or Flutter wrapper.
- **LTI / LMS Integration**: No integration with Moodle, Canvas, or any Learning Management System.
- **Auto-grade feedback**: No sentiment analysis or NLP on comment text.
- **SSO / OAuth**: Authentication is email+USN+password only; no Google/Microsoft login.
- **Photo / file uploads**: Feedback is text + rating only; no attachment support.
- **Email verification**: Accounts are pre-seeded; no self-registration or email confirmation flow.
- **Database migrations**: Schema evolves via Mongoose model changes; no formal migration tooling.
