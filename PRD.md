# SOAS Feedback Collector: Product Requirements Document

| Field | Detail |
|---|---|
| **Project Name** | SOAS Feedback Collector |
| **Target Release** | Q2 2026 (Active) |
| **Status** | v1.3: Production Ready |
| **Author** | Pawan Simha R (MCA, SOAS, Sapthagiri NPS University) |
| **Stack** | React 19 + Vite 8 / Express 4.21 / MongoDB 8 / Mongoose 8 |

---

## Executive Summary

The SOAS Feedback Collector is a full-stack MERN application that replaces paper-based or ad-hoc course feedback at Sapthagiri NPS University's School of Sciences (SOAS). It enables MCA students to submit per-subject comments after each class session, provides a public anonymous channel for unfiltered input, and delivers aggregated analytics to administrators via a unified dashboard , all without exposing individual student identity.

---

## Problem Statement

MCA program coordinators at Sapthagiri NPS University lacked a structured, auditable mechanism to collect course feedback. Existing approaches suffered from:

- **No session gating**: Students could submit feedback at any time, decoupled from actual class delivery.
- **Zero identity verification**: Inflated or spam submissions with no way to attribute per-student participation.
- **No public anonymity**: Students uncomfortable providing negative feedback through tracked channels had no outlet.
- **Manual aggregation**: Faculty manually compiled CSV reports consuming 2-3 hours per review cycle.
- **No participation tracking**: Instructors could not identify which students had/had not submitted for a given subject.

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
| **Feedback Completion Rate** | >= 80% per class per session | `gaveStudents / totalStudents` from coverage endpoint |
| **Submission Latency** | < 2 seconds p95 | API response time for `POST /api/feedback/submit` |
| **Admin Report Generation** | < 3 seconds | Time from click to download for CSV/Word export |
| **Anonymous Submission Rate** | >= 10% of authenticated rate | Ratio of public to authenticated feedback counts |
| **Zero-Error Build** | 100% | `npm run build` passes without warnings or errors |

---

## Core Features & Requirements (MoSCoW)

### P0: Must Have (Shipped)

| Feature | Implementation | Evidence |
|---|---|---|
| **Branded 404 Page** | Custom NotFound.jsx with CSS compass illustration, brand logo, two recovery CTAs, responsive/motion-reduced; renders outside main layout | `client/src/components/NotFound.jsx` |
| **JWT Authentication** | Email + USN + password login; bcrypt hashing; 30-day token in sessionStorage; 7-day refresh token in localStorage; refresh endpoint at `POST /api/auth/refresh` | `server/routes/auth.js` |
| **Allotment Gating** | Admin opens/closes feedback windows per class; students blocked when closed; opening-only message validation (15-50 chars) | `server/routes/allotment.js` |
| **Per-Subject Feedback** | Comments (50-300 chars); upsert prevents duplicate submissions; compound unique index `{ student, subject }` | `server/routes/feedback.js`, `server/models/Feedback.js` |
| **Public Anonymous Feedback** | No auth required; subject + optional faculty name + comments (100-300 chars); rate-limited (10/15min); Origin header validation for CSRF defense | `server/routes/public.js` |
| **Admin DB Overview** | Enterprise-grade database dashboard: sticky tabs (Dashboard/Students/Feedbacks/Allotments/Anonymous), 6 stat cards with CountUp, global search with `/` kbd shortcut, Recharts bar+pie charts, class cards with expandable student lists, subject analytics with progress bars, allotment timeline cards, activity feed, system health widget, sortable tables per tab, skeleton loading, CSV/Word export | `server/routes/admin.js`, `client/src/components/AdminDbOverview.jsx` |
| **Admin Coverage Tracking** | Per-subject view of which students gave/did not give feedback within a class; gave/not-given student lists with percentages | `server/routes/admin.js` |
| **Report Exports** | CSV (.csv, BOM-prefixed for Excel) and Word (.doc, styled HTML table) download utilities via Blob URLs | `client/src/utils/download.js` |
| **Cookie Consent Banner** | Accessible dialog with Accept/Decline, localStorage persistence, links to PRIVACY.md | `client/src/components/CookieConsent.jsx` |
| **AI-Aware robots.txt** | Search crawlers allowed; AI training scrapers (GPTBot, ClaudeBot, CCBot) blocked | `client/public/robots.txt` |
| **Sitemap.xml** | 4 URLs anchored to production domain | `client/public/sitemap.xml` |
| **Privacy Policy** | GDPR/CCPA coverage, data collection, retention, contact info | `PRIVACY.md` |
| **Swagger API Documentation** | Interactive OpenAPI 3.0 docs at `/api/docs`; documents 16 of 20 endpoints with request/response schemas; JWT bearer auth scheme | `server/config/swagger.js` |
| **CSS Variable Refactor** | All hardcoded hex colors across all 17 per-component CSS files replaced with `--gray-*`, `--primary`, `--accent`, `--success`, `--danger` CSS custom properties | All 17 CSS files; `index.css` focus-visible outlines, autofill overrides, scrollbar styling; build passes 0 errors |

### P1: Should Have (Shipped)

| Feature | Implementation | Evidence |
|---|---|---|
| **Student Dashboard** | Welcome view with active session status card, stats grid (subjects/completed/locked), quick actions, guided stepper, guidelines section, activity feed, skeleton loading, framer-motion entrance | `client/src/components/Dashboard.jsx` |
| **Feedback History** | Feedback table with subject, comments, and date columns | `client/src/components/MyFeedback.jsx` |
| **Comment-Only Feedback** | Per-subject comments (50-300 chars) with draft auto-save to `localStorage` via `fb_drafts`, lock/unlock per subject, prev/next navigation, confirmation popup before final submit | `client/src/components/FeedbackForm.jsx` |
| **Class Selection & Drill-Down** | Admin class list (AdminClassSelect — 8 stat cards, 6 filter chips, PieChart + BarChart, activity panel, system health widget) → student grid (AdminStudents — search, coverage tabs, CSV/Word export) → individual student feedback (AdminStudentFeedback — subject filter, stats cards, feedback list) | `AdminClassSelect.jsx`, `AdminStudents.jsx`, `AdminStudentFeedback.jsx` |
| **Admin Session Management** | AdminAllotments page: 6 summary cards, search + 6 filter chips, session cards with message textarea + template dropdown + character counter (25/50), progress bar, confirmation dialog (replaces `confirm()`), open/close/reopen with Sonner toasts, bulk Open All/Close All, Recharts pie + bar charts, activity panel, skeleton loading | `client/src/components/AdminAllotments.jsx` |
| **Admin Anonymous View** | Standalone page showing all public submissions with search by subject/faculty/comments | `AdminAnonymous.jsx` (standalone); `AdminDbOverview.jsx` AnonymousView tab (with CSV + Word export) |
| **Session Allocation Message** | Admin sets custom message (15-50 chars) when opening; opening-only validation | `server/routes/allotment.js` |
| **Rate Limiting** | Public: 10 req/15min (env-configurable via `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MINUTES`); Login: 5 req/15min (`LOGIN_RATE_LIMIT_MAX`) | `server/routes/public.js`, `server/routes/auth.js` |
| **Vite API Proxy** | Dev server proxies `/api` to backend on port 5000 | `client/vite.config.js` |
| **Sequential Feedback Form** | Multi-step subject flow with lock/unlock per subject, prev/next navigation, draft auto-save (`fb_drafts`), lock state (`fb_locked`); confirmation popup before final submit | `client/src/components/FeedbackForm.jsx` |
| **Social Icons in Footer** | SVG icons for YouTube, Instagram, Facebook, LinkedIn, WhatsApp | `client/src/components/Footer.jsx` |
| **Analytics Tracker** | Client-side page-view tracking via `AnalyticsTracker` component; stores up to 500 events in `localStorage` under `analytics_events` key | `client/src/components/AnalyticsTracker.jsx`, `client/src/utils/analytics.js` |

### P2: Could Have (Future)

| Feature | Rationale | Suggested Approach |
|---|---|---|
| **Analytics Dashboard** | Visualize submission trends and sentiment over time | Chart.js or Recharts + new `/api/admin/analytics` endpoint |
| **Email Notifications** | Alert students when a feedback window opens/closes | Nodemailer + cron-based or webhook-driven trigger |
| **Faculty Role** | Read-only aggregated stats view without exposing student identity | New `role: 'faculty'` in Student model; filtered query layer |
| **Auto-Scheduled Allotments** | Pre-configure feedback windows on a calendar | Extend Allotment model with `startDate`, `endDate`; background scheduler |

---

## AI & Technical Constraints

| Constraint | Value | Location |
|---|---|---|
| **Password Security** | bcryptjs (salt rounds: default 10) | `server/middleware/auth.js` |
| **Token Lifespan** | 30 days (access) + 7 days (refresh) | `server/routes/auth.js` |
| **Token Storage** | `sessionStorage` (access + student profile) + `localStorage` (refresh token) | `client/src/context/AuthContext.jsx` |
| **Refresh Token Flow** | `tryRefresh()` called on init if no session token; `POST /api/auth/refresh` validates token type (`type: 'refresh'`) | `client/src/context/AuthContext.jsx`, `server/routes/auth.js` |
| **Authenticated Comment Length** | 50-300 characters (both server and client validate) | `server/routes/feedback.js`, `client/src/components/FeedbackForm.jsx` |
| **Anonymous Comment Length** | 100-300 characters | `server/routes/public.js` |
| **Allotment Message Length** | 15-50 characters (opening only; no validation on close) | `server/routes/allotment.js` |
| **Subject Whitelist** | Validated against `SUBJECTS` constant: DevOps, Research Methodology & IPR, Java and Java Frameworks, Agile, MERN, DataScience | `server/config/subjects.js` |
| **Rate Limiting** | Public: 10 req/15min; Login: 5 req/15min; both env-configurable | `server/routes/public.js`, `server/routes/auth.js` |
| **Origin Validation** | CSRF defense on public POST; compares `req.headers.origin` against `CORS_ORIGIN` env | `server/routes/public.js` |
| **Request Body Limit** | 10kb (JSON payload) | `server/app.js` |
| **Security Headers** | Helmet 8: CSP, X-Frame-Options, X-Content-Type-Options; `connect-src` includes `CORS_ORIGIN` | `server/app.js` |
| **Response Compression** | compression 1.8 gzip (~70% smaller payloads) | `server/app.js` |
| **Process Manager** | PM2 cluster mode: N workers = N CPU cores; `max_memory_restart: 500M`; logs to `./logs/err.log` and `./logs/out.log` | `server/ecosystem.config.js` |
| **Database Indexes** | Compound unique index `{ student, subject }` + `{ subject: 1 }` + `{ createdAt: -1 }` on Feedback; `{ createdAt: -1 }` on PublicFeedback | `server/models/Feedback.js`, `server/models/PublicFeedback.js` |
| **Query Optimization** | `.lean()` on all read-only queries | All route files |
| **CORS** | Restricted via `CORS_ORIGIN` env var (default: `http://localhost:5173`) | `server/app.js` |
| **Auth Guard** | `ProtectedRoute` + `AdminRoute` (client); `protect` middleware (verify JWT, attach `req.student`) + explicit role check (server) | `client/src/App.jsx`, `server/middleware/auth.js` |
| **Feedback Model Design** | Feedback does NOT store `classGroup`; coverage lookups join via Student._id; class filter resolves Student IDs first then queries Feedback | `server/routes/admin.js` |
| **Logout Cleanup** | Clears `sessionStorage` (token/student), `localStorage` (refreshToken, fb_locked, fb_drafts), and Axios default header | `client/src/context/AuthContext.jsx` |
| **404 Page** | Standalone NotFound with CSS compass illustration, animated needle, radial spotlight, recovery CTAs | `client/src/components/NotFound.jsx` |
| **License** | GNU General Public License v3.0 | `LICENSE.md` |
| **SEO / GEO** | JSON-LD (WebApplication schema), Open Graph, Twitter Card, canonical URL, author meta | `client/index.html` |
| **ErrorBoundary** | Global React error boundary wrapping `<Routes>`; class component (required for `getDerivedStateFromError`) | `client/src/components/ErrorBoundary.jsx` |
| **LocalStorage Keys** | `fb_locked` (lock state), `fb_drafts` (comment drafts), `cookie_consent`, `analytics_events`, `refreshToken` | `client/src/components/FeedbackForm.jsx`, `client/src/components/CookieConsent.jsx`, `client/src/utils/analytics.js`, `client/src/context/AuthContext.jsx` |
| **Environment Variables** | 14 configurable vars: `NODE_ENV`, `MONGO_URI`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`, `JWT_EXPIRES_IN`, `RATE_LIMIT_WINDOW_MINUTES`, `RATE_LIMIT_MAX`, `LOGIN_RATE_LIMIT_MAX`, `LOG_LEVEL`, `ADMIN_USN`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | `server/.env.example` |
| **Animation Libraries** | Framer Motion (entrance/exit animations, `AnimatePresence`), CountUp (animated stat numbers), Sonner (toast notifications), Recharts (PieChart, BarChart for admin analytics) | `client/package.json` |
| **Form Validation (Client)** | React Hook Form + Zod (`@hookform/resolvers`); `onBlur` mode with per-field dirty/error/valid visual states | `client/src/components/Login.jsx` |

---

## User Journey / Flow

### Primary Flow: Authenticated Student Feedback

```
1. Admin opens feedback window for "MCA, 1st Year, 2nd Sem, A sec"
   -> POST /api/allotments { classGroup, message (15-50 chars) }
   -> Allotment.isOpen = true

2. Student visits http://localhost:5173 -> Landing -> "Get Started"

3. Student logs in -> POST /api/auth/login { email, usn, password }
   -> Receives JWT token (30-day, sessionStorage) + refresh token (7-day, localStorage)
   -> Axios default header set: Authorization: Bearer <token>

4. Dashboard loads -> GET /api/allotments/status -> { open: true, message: "..." }
   -> Student clicks "Give Feedback"

5. Feedback form loads subjects -> GET /api/feedback/subjects
    -> Sequential step-based UI: shows one subject at a time
    -> Student writes comments (50-300 chars, auto-saved to fb_drafts)

6. Per-subject lock:
   - Student clicks "Lock" -> POST /api/feedback/submit { subject, comments }
     -> Server validates: subject whitelist, comment length, allotment open
     -> Upserts via findOne + update or create (compound unique index on {student, subject})
   - Lock state persisted to fb_locked in localStorage
   - Student can unlock and edit before final submission

7. After locking all subjects:
   - Student clicks "Submit All" on last subject
   - Confirmation popup shows summary
   - Confirm -> submits any remaining unlocked subjects, clears localStorage keys
   - Redirects to /my-feedback

8. Admin reviews participation:
   -> GET /api/admin/feedback/subject/DevOps/coverage?class=MCA, 1st Year, 2nd Sem, A sec
   -> Returns: totalStudents, gaveCount, notGivenCount, gavePercent, notGivenPercent,
      gaveStudents[], notGivenStudents[]
   -> Coverage logic: find all students in class -> find feedbacks by subject ->
      match student IDs -> separate into gave/not-given lists

9. Admin exports report:
   -> CSV (BOM-prefixed for Excel) or Word (styled HTML table -> .doc)
   -> Client-side Blob URL generation, no server involved
```

### Secondary Flow: Public Anonymous Feedback

```
1. User visits http://localhost:5173/feedback/public (no auth required)
2. Selects subject from dropdown -> GET /api/public/subjects
3. Optionally enters faculty name (max 100 chars), writes comments (100-300 chars min)
4. Submits -> POST /api/public/feedback { subject, facultyName, comments }
   -> Validated: origin header checked against CORS_ORIGIN, rate-limited (10/15min)
   -> 201 Created
5. Admin reviews in:
   - Admin Anonymous panel (JWT required) -> GET /api/public/feedbacks
   - Or Admin DB Overview -> Anonymous tab (with CSV/Word export)
```

---

## Licensing

This project is distributed under the **GNU General Public License v3.0**. Every source file carries the GPLv3 copyright header attributing Pawan Simha R as the copyright holder. See [LICENSE.md](./LICENSE.md) for the full legal text.

---

## Out of Scope (Non-Goals)

- **Real-time messaging / chat**: No direct messaging between students and faculty.
- **Multi-language support**: All UI text and data in English only.
- **Mobile native app**: Responsive web application only; no React Native or Flutter wrapper.
- **LTI / LMS Integration**: No integration with Moodle, Canvas, or any LMS.
- **Auto-grade feedback**: No sentiment analysis or NLP on comment text.
- **SSO / OAuth**: Email+USN+password only; no Google/Microsoft login.
- **Photo / file uploads**: Text only; no attachment support.
- **Star ratings**: Removed (Unreleased); feedback is comment-only.
- **Email verification**: Accounts are pre-seeded; no self-registration.
- **Database migrations**: Schema evolves via Mongoose model changes; no formal migration tooling.
- **WebSocket / real-time updates**: Polling-based; no Socket.IO or SSE support.
