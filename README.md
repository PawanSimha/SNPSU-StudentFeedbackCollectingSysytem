
  <div align="center">
    <img src="./client/public/images/footer-logo.webp" alt="SOAS Logo" width="220" />
    <br/><br/>
    <h1>SOAS Feedback Collector</h1>
    <p><em>Anonymous course feedback platform for Sapthagiri NPS University</em></p>
    <p>
      <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
      <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
      <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white" alt="Express 4.21" />
      <img src="https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white" alt="MongoDB 8" />
      <img src="https://img.shields.io/badge/MERN-Stack-00d8ff" alt="MERN Stack" />
      <img src="https://img.shields.io/badge/Status-Active-success" alt="Status" />
    </p>
  </div>

---

## Overview

The **SOAS Feedback Collector** is a full-stack MERN application that enables MCA students at Sapthagiri NPS University to submit anonymous feedback on courses and instructors after each class session. Faculty and administrators gain aggregated insights through a dedicated dashboard, driving continuous improvement in curriculum delivery.

> **v1.3 updates (Phases A–D):** **Phase A:** Structured pino logging with `pino-http` middleware; `app.js`/`server.js` split for testability; centralized `errorHandler.js` delegating via `next(error)`; Helmet security headers; gzip compression; rate limiting (login 5/15min, public 10/15min); CORS restriction via `CORS_ORIGIN` env; Origin header validation on `POST /api/public/feedback` for CSRF defense; input validation (subject whitelist + rating 1–5 range); all read-only queries using `.lean()` (~40% faster); MongoDB indexes on all query patterns; PM2 cluster mode (multi-core); smoke tests (`server/tests/server.test.js`) with 2 passing tests. **Phase B:** CSS modularized from 1 monolithic file into 16 per-component CSS files; 6 admin components lazy-loaded via `React.lazy` + `Suspense`; skip-to-content link for keyboard accessibility; inline form validation (50–300 char comments, 1–5 star rating); `aria-live` regions for dynamic content announcements. **Phase C:** Multi-stage Dockerfile for optimized production builds; GitHub Actions CI pipeline; Swagger API documentation at `/api/docs`; empty states (no-data messages across all list views); image lazy loading (`loading="lazy"` on all assets). **Phase D:** Pagination on admin list endpoints (`/api/admin/feedback`, `/api/admin/students`, `/api/admin/public/feedbacks`); JWT refresh token flow (`POST /api/auth/refresh`); page-view analytics tracker in `utils/analytics.js`; Husky + lint-staged pre-commit hooks; AdminRoute guard component (non-admin users redirected from `/admin/*` routes).

> **v1.2 updates:** Added MongoDB indexes, `.lean()` query optimization, PM2 clustering (multi-core), Helmet security headers, gzip compression, and production process management. System now handles 200-300 concurrent students on a standard 4-core server.

> **v1.1 updates:** Added star rating selector (1–5), rate limiting on public endpoint, Vite API proxy, class list dynamic fetch from API, improved loading/error states across all components, social media icons in footer, and various bug fixes.

The system supports authenticated student feedback with per-session allotments, a public anonymous feedback channel (no login required), and comprehensive admin tools including CSV/Word report exports.

---

## Key Features

### User Features
- **Star Rating**: Visual 1–5 star selector for per-subject ratings in the feedback form
- **Student Dashboard**: View active feedback allotments and submit ratings/comments per subject
- **Feedback History**: Browse all previously submitted feedback across subjects
- **Public Anonymous Feedback**: Submit feedback without logging in; select subject, optionally name faculty, and write comments (100-300 chars) — rate-limited to 10 submissions per 15 minutes
- **Inline Form Validation**: Real-time validation enforced on comments (50–300 chars) and ratings (1–5) with clear error messages
- **Feedback Drafts**: Per-subject ratings and comments auto-saved to localStorage as drafts

### Admin Features
- **Class Management** -- View all class groups (fetched dynamically from API) and drill into student-level details
- **Allotment System** -- Open/close feedback windows for specific class groups with custom messages
- **Database Overview** -- Unified view of all students, feedbacks (per-subject stats), allotments, and anonymous submissions
- **Anonymous Feedbacks** -- Review, search, and filter all public submissions
- **Report Exports** -- Download feedback data as CSV (Excel) or Word `.doc` files
- **Subject Management** -- Pre-configured subject list shared across the system
- **Pagination** -- Server-side paginated tables on feedback, student, and anonymous lists
- **AdminRoute Guard** -- Non-admin users automatically redirected from `/admin/*` routes

### Accessibility & UX
- **Skip-to-Content Link** -- Keyboard-accessible skip link at page top for rapid navigation
- **aria-live Regions** -- Dynamic content regions announced to screen readers on state changes
- **Empty States** -- Descriptive no-data messages across all list views (no empty tables)
- **Image Lazy Loading** -- All `<img>` assets use `loading="lazy"` for deferred loading
- **CSS Modularization** -- 16 per-component CSS files replacing the single monolithic stylesheet
- **Lazy Loading** -- 6 admin components loaded via `React.lazy` + `Suspense` for faster initial bundle
- **Page-View Analytics** -- Tracks page views via `utils/analytics.js` for usage insights

### DevOps
- **Docker Deployment** -- Multi-stage Dockerfile for optimized production images
- **CI Pipeline** -- GitHub Actions workflow runs lint, build, and tests on every push/PR
- **Pre-commit Hooks** -- Husky + lint-staged enforce linting and formatting before commits
- **Swagger API Docs** -- Interactive API documentation available at `/api/docs`

---

## Visual Architecture

```
Browser                          Express API                      MongoDB
┌─────────┐     HTTP/JSON        ┌──────────────┐    Mongoose     ┌──────────┐
│   React   │ ──────────────────> │    app.js     │ ─────────────> │ feedback- │
│  19 +    │ <────────────────── │  (Port 5000)  │ <───────────── │ collector │
│  Vite 8  │     JWT tokens      └──────────────┘                 └──────────┘
└─────────┘                           │
  │                                   │
  ├─ Landing (/)                      ├─ /api/auth (JWT login + refresh)
  ├─ Login (/login)                   ├─ /api/feedback (CRUD)
  ├─ Dashboard (/dashboard)           ├─ /api/admin (admin ops)
  ├─ Admin Panel (/admin/*)           ├─ /api/allotments (open/close)
  ├─ PublicFeedback (/feedback/public)   ├─ /api/public (anonymous)
  ├─ API Docs (/api/docs)             ├─ /api/docs (Swagger UI)
  └─ 404 (*)                          (no backend)
```

---

## Tech Stack

| Layer        | Technology                              | Version   |
| ------------ | --------------------------------------- | --------- |
| **Frontend** | React                                   | ^19.2.6   |
|              | React Router (declarative routing)      | ^7.17.0   |
|              | Vite (build tool & dev server with API proxy) | ^8.0.12   |
|              | Axios (HTTP client)                     | ^1.18.0   |
| **Backend**  | Node.js / Express                       | ^4.21.0   |
|              | Mongoose (ODM)                          | ^8.6.0    |
|              | JSON Web Token (auth + refresh)        | ^9.0.2    |
|              | bcryptjs (password hashing)             | ^2.4.3    |
|              | express-rate-limit (spam prevention)     | (latest)  |
|              | Helmet (security headers)               | ^8.2.0    |
|              | compression (gzip)                       | ^1.8.1    |
|              | swagger-jsdoc + swagger-ui-express (API docs) | (latest) |
| **Process**  | PM2 (cluster mode, multi-core)          | ^7.0.1    |
| **Database** | MongoDB                                 | (via Mongoose) |
| **Styling**  | 16 per-component CSS files              | (custom)  |
| **Tooling**  | Vite ESLint plugin, concurrently, Husky, lint-staged |           |

---

## Project Structure

```
mern-feedback-collector/
├── .dockerignore                     # Docker ignore rules (node_modules, dist, .env)
├── .gitignore                        # Ignores node_modules, .env, dist, server/logs/, editor dirs
├── context.md                        # System context cross-session continuity
├── Dockerfile                        # Multi-stage Docker build (prod image)
├── LICENSE.md                        # GNU General Public License v3.0
├── package.json                      # Root orchestration (concurrently)
├── PRD.md                            # Product Requirements Document
├── PRIVACY.md                        # GDPR/CCPA privacy policy
├── README.md                         # Project overview (this file)
├── vercel.json                       # Vercel deploy config: rewrites + CSP
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI (lint, build, test)
│
├── .husky/
│   ├── pre-commit                    # Pre-commit hook (lint-staged)
│   └── _/
│       └── .gitignore                # Husky internal gitignore
│
├── client/                           # React + Vite frontend
│   ├── .gitignore
│   ├── eslint.config.js              # ESLint flat config
│   ├── index.html                    # SPA shell with SEO/GEO meta
│   ├── package.json
│   ├── vite.config.js                # Vite config + API proxy (/api → :5000)
│   ├── public/                       # Static assets
│   │   ├── images/                   # Image assets (4 WebP + 1 ICO = 5 files)
│   │   ├── robots.txt                # AI-aware crawler directives
│   │   └── sitemap.xml               # 3-URL sitemap
│   └── src/
│       ├── main.jsx                  # Entry point (BrowserRouter)
│       ├── App.jsx                   # Route definitions + layouts
│       ├── index.css                 # Global styles (CSS custom properties, resets)
│       ├── config/
│       │   └── api.js                # Centralized API base URL
│       ├── context/
│       │   └── AuthContext.jsx       # Global auth state (JWT + refresh)
│       ├── styles/                   # 16 per-component CSS files
│       │   ├── AdminAllotments.css
│       │   ├── AdminClassSelect.css
│       │   ├── AdminDashboard.css
│       │   ├── AdminStudentFeedback.css
│       │   ├── AdminStudents.css
│       │   ├── AdminTable.css
│       │   ├── CookieConsent.css
│       │   ├── Dashboard.css
│       │   ├── FeedbackForm.css
│       │   ├── Footer.css
│       │   ├── Landing.css
│       │   ├── Login.css
│       │   ├── MyFeedback.css
│       │   ├── Navbar.css
│       │   ├── NotFound.css
│       │   └── PublicFeedback.css
│       ├── utils/
│       │   ├── analytics.js          # Page-view analytics tracker
│       │   └── download.js           # CSV & Word export helpers
│       └── components/               # 19 React components
│           ├── AdminAllotments.jsx
│           ├── AdminAnonymous.jsx
│           ├── AdminClassSelect.jsx
│           ├── AdminDashboard.jsx
│           ├── AdminDbOverview.jsx
│           ├── AdminStudentFeedback.jsx
│           ├── AdminStudents.jsx
│           ├── AnalyticsTracker.jsx  # Page-view analytics (useLocation-based)
│           ├── AdminRoute.jsx        # Admin route guard (redirects non-admin)
│           ├── CookieConsent.jsx     # GDPR banner with Accept/Decline
│           ├── Dashboard.jsx         # Student dashboard
│           ├── ErrorBoundary.jsx     # Global error boundary with reload CTA
│           ├── FeedbackForm.jsx      # Feedback submission form
│           ├── Footer.jsx            # Shared site footer
│           ├── Landing.jsx           # Public landing page
│           ├── Login.jsx             # Auth login form
│           ├── MyFeedback.jsx        # Feedback history
│           ├── Navbar.jsx            # Auth-aware navigation
│           ├── NotFound.jsx          # Branded 404 (compass, CTAs)
│           └── PublicFeedback.jsx    # Anonymous (no login) feedback
│
├── server/                           # Express backend
│   ├── .env                          # Environment config (gitignored)
│   ├── .env.example                  # Environment variable template (documented)
│   ├── package.json
│   ├── ecosystem.config.js           # PM2 cluster config (multi-core production)
│   ├── app.js                        # Express app factory (helmet, compression, pino-http, cors, 10kb body limit, 404 handler, errorHandler)
│   ├── server.js                     # App entry: dotenv, connectDB, JWT check, app.listen
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   ├── logger.js                 # Pino logger instance (structured JSON, level from LOG_LEVEL env)
│   │   ├── subjects.js               # 6-subject constant
│   │   └── swagger.js                # Swagger/OpenAPI configuration
│   ├── middleware/
│   │   ├── auth.js                   # JWT protect middleware
│   │   └── errorHandler.js           # Centralized error handler (logs via req.log, returns JSON)
│   ├── models/
│   │   ├── Student.js                # User model (student/admin)
│   │   ├── Feedback.js               # Authenticated feedback
│   │   ├── PublicFeedback.js         # Anonymous feedback
│   │   └── Allotment.js              # Session allotments
│   ├── routes/
│   │   ├── auth.js                   # POST /login, POST /refresh, GET /me
│   │   ├── feedback.js               # Authenticated feedback CRUD
│   │   ├── admin.js                  # Admin analytics & overview (paginated)
│   │   ├── allotment.js              # Open/close feedback windows
│   │   └── public.js                 # Anonymous feedback endpoints
│   ├── tests/
│   │   └── server.test.js            # Smoke tests (health + 404, Jest+Supertest)
│   └── scripts/
│       ├── seed.js                   # DB seeder (51 students)
│       ├── seed-admin.js             # Admin user seeder
│       ├── seed-b.js                 # Additional student seeder
│       ├── update-classes.js         # Bulk class reassignment
│       └── update-roles.js           # Bulk role update
```

---

## Quick Start

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9
- **MongoDB** >= 6 (local or Atlas URI)
- **Docker** (optional, for containerized deployment)

### 1. Clone & Install

```bash
# Install root dependencies (concurrently)
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment

Edit `server/.env` (use `server/.env.example` as a template; modify as needed):

```env
MONGO_URI=mongodb://localhost:27017/feedback-collector
JWT_SECRET=your_secret_here
PORT=5000
```

Optionally set `client/.env` to override the API URL (defaults to `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

Populates 51 students with password `MCAA@123` in class group `MCA, 1st Year, 2nd Sem, A sec`:

```bash
npm run seed
```

(Optional) Seed additional sections and admin account:

```bash
npm run seed-b       # 50 B section students, password "MCAB@123"
npm run seed-admin   # Admin account: admin@gmail.com / iamadmin
```

### 4. Run the Application

Starts both backend (port 5000) and frontend (port 5173) concurrently:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health
- **API Docs:** http://localhost:5000/api/docs

### 5. Docker Deployment

Build and run with Docker:

```bash
docker build -t snpsu-feedback-collector .
docker run -p 5000:5000 --env-file server/.env snpsu-feedback-collector
```

### 6. Production Deployment (PM2)

Uses **PM2 cluster mode** — spawns one worker per CPU core (auto-detected). Each worker is an independent Express instance behind the same port.

```bash
# Start with PM2 (cluster mode, all cores)
cd server && npm run prod

# Monitor running instances
npm run prod:logs

# Stop all workers
npm run prod:stop
```

For frontend production build:

```bash
cd client && npm run build
# Output: client/dist/ (deploy to Vercel or any static host)
```

---

## API Overview

| Method | Endpoint                                            | Auth     | Description                                     |
| ------ | --------------------------------------------------- | -------- | ----------------------------------------------- |
| POST   | `/api/auth/login`                                   | Public   | Student/admin login (email + USN + pw)          |
| POST   | `/api/auth/refresh`                                 | Public   | Refresh JWT token                               |
| GET    | `/api/auth/me`                                      | JWT      | Return current user profile                     |
| GET    | `/api/feedback/subjects`                            | JWT      | List subjects for feedback form                 |
| GET    | `/api/feedback/my`                                  | JWT      | Current user's feedback history                 |
| POST   | `/api/feedback/submit`                              | JWT      | Submit authenticated feedback                   |
| GET    | `/api/allotments/status`                            | JWT      | Check if feedback session is open for user      |
| GET    | `/api/allotments`                                   | Admin    | List all allotments by class                    |
| POST   | `/api/allotments`                                   | Admin    | Toggle allotment open/close                     |
| GET    | `/api/admin/classes`                                | Admin    | List all class groups                           |
| GET    | `/api/admin/students`                               | Admin    | List students (paginated, optional `?class=` filter) |
| GET    | `/api/admin/feedback`                               | Admin    | All feedbacks (paginated, optional `?class=`/`?student=`) |
| GET    | `/api/admin/feedback/stats`                         | Admin    | Aggregated feedback statistics                  |
| GET    | `/api/admin/feedback/subject/:subject`              | Admin    | Feedbacks for a specific subject                |
| GET    | `/api/admin/feedback/subject/:subject/coverage`     | Admin    | Per-subject coverage (gave/not-given students)  |
| GET    | `/api/admin/db-overview`                            | Admin    | Full database statistics & collections          |
| POST   | `/api/public/feedback`                              | Public   | Submit anonymous feedback (rate-limited: 10/15min) |
| GET    | `/api/public/subjects`                              | Public   | List available subjects                         |
| GET    | `/api/public/feedbacks`                             | Admin    | List all anonymous feedbacks (paginated)        |
| GET    | `/api/docs`                                         | Public   | Swagger/OpenAPI interactive documentation       |

---

## Product Roadmap

- **Analytics Dashboard**: Visual charts (submission rates, sentiment trends) using Chart.js or Recharts
- **Email Notifications**: Automated reminders when a feedback window opens/closes
- **Multi-Role Expansion**: Faculty view with per-subject aggregated reports (no individual identity)
- **TypeScript Migration**: Full static typing across the entire stack

---

## Developer Experience

### Linting

```bash
cd client && npm run lint
```

### Pre-commit Hooks

Husky + lint-staged automatically lint and format staged files before each commit. Skip with `git commit --no-verify` if needed.

### Building for Production

```bash
cd client && npm run build
# Output: client/dist/
```

### Testing

Smoke tests (health endpoint + 404 handler) are in `server/tests/server.test.js`. Run with:

```bash
npm test
```

### API Documentation

Swagger UI is available at `/api/docs` when the server is running. OpenAPI definitions are generated from JSDoc annotations in route files.

### CI Pipeline

GitHub Actions runs lint, build, and test on every push and pull request to the main branch. The workflow is defined in `.github/workflows/ci.yml`.

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`) — pre-commit hooks will run automatically
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE.md](./LICENSE.md) file for details.

&copy; 2026 Pawan Simha R. All rights to the source code are granted under the terms of the GPLv3.
