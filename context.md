# SOAS Feedback Collector: System Context

> **Generated:** July 2026  
> **Author:** Pawan Simha R (MCA, SOAS, Sapthagiri NPS University)  
> **Purpose:** Absolute source of truth for cross-session architectural continuity.  
> **License:** GNU General Public License v3.0

---

## 1. System Overview & Strategic Intent

**What it does:**  
A full-stack MERN single-page application that enables MCA students at Sapthagiri NPS University to submit per-subject course feedback (comments only) after each class session. Administrators open/close feedback windows via allotments, track participation coverage, drill into individual student feedback, and export aggregated reports in CSV or Word format.

**Dual-channel feedback model:**
1. **Authenticated channel**: JWT-gated, session-allotment-gated per class group, identity-tracked for coverage reporting but aggregated for display.
2. **Public anonymous channel**: No authentication, no identity collected, subject + optional faculty name + comments (100-300 chars).

**Core operational goals:**
- Replace paper-based / ad-hoc Google Forms feedback with a structured, auditable system.
- Eliminate spam through JWT identity verification on the primary channel.
- Give uncomfortable students a genuinely anonymous outlet.
- Reduce admin report-compilation time from 2-3 hours to near-instant.
- Provide visibility into which students have/have not submitted per subject.

**Who it serves:**
| Persona | Auth Level | Primary Action |
|---|---|---|
| MCA Student | JWT (student) | Submit feedback when a session is open; view history |
| Anonymous user | None | Submit feedback without revealing identity |
| Administrator | JWT (admin) | Open/close allotments; view stats; export reports; audit anonymous submissions |

---

## 2. Production Tech Stack

| Layer | Technology | Version | Key Packages |
|---|---|---|---|
| **Frontend Framework** | React | ^19.2.6 | react-dom ^19.2.6 |
| **Routing** | React Router | ^7.17.0 | Layout routes with `<Outlet />` |
| **Build Tool** | Vite | ^8.0.12 | @vitejs/plugin-react ^6.0.1 |
| **HTTP Client** | Axios | ^1.18.0 | Base instance configured per-component |
| **Backend Runtime** | Node.js / Express | ^4.21.0 | cors ^2.8.5, dotenv ^16.4.5 |
| **Rate Limiting** | express-rate-limit | ^8.5.2 | 10 req / 15 min on public endpoint; 5 req / 15 min on login |
| **Security Headers** | Helmet | ^8.2.0 | X-Frame-Options, X-Content-Type-Options, CSP enforcement |
| **Response Compression** | compression | ^1.8.1 | gzip on all API responses (~70% smaller payloads) |
| **Process Manager** | PM2 | ^7.0.1 | Cluster mode: N workers = N CPU cores; auto-restart on crash |
| **ODM / Database** | Mongoose / MongoDB | ^8.6.0 | 4 collections (students, feedbacks, publicfeedbacks, allotments) |
| **Authentication** | jsonwebtoken | ^9.0.2 | 30-day expiry, sessionStorage on client; refresh token (7d) in localStorage |
| **Password Hashing** | bcryptjs | ^2.4.3 | Salt rounds: 10 |
| **Dev Orchestration** | concurrently | ^8.2.2 | Runs server + client in parallel |
| **Dev Server (server)** | nodemon | ^3.1.4 | Auto-restart on file change |
| **Linting** | ESLint | ^10.3.0 | react-hooks + react-refresh plugins |
| **CSS** | Custom properties (no framework) | - | 16 per-component files in `styles/`; BEM naming in 6 files |
| **Structured Logging** | pino | ^9.14.0 | `pino-http` for HTTP request logging, level from `LOG_LEVEL` env |
| **Image Format** | WebP | quality 85 | All raster assets in `client/public/images/` |
| **API Documentation** | Swagger (swagger-jsdoc + swagger-ui-express) | latest | Interactive docs at `/api/docs` |
| **Testing** | Jest + Supertest | ^30.4.2 / ^7.2.2 | Smoke tests for health + 404 handler |
| **Deployment** | Vercel | - | `vercel.json` with SPA rewrites + security headers |
| **Containerization** | Docker | multi-stage | Node 20 Alpine; separate client build stage |
| **CI** | GitHub Actions | - | 3 jobs: test, lint, build on push/PR to main |
| **License** | GPLv3 | - | `LICENSE.md` + headers in all 56+ source files |

---

## 3. Core Architectural Design Patterns

### 3.1 Data Flow

```
Browser (React SPA)          Express REST API            MongoDB
    │                              │                        │
    │  POST /api/auth/login ──────►│  findOne + bcrypt ────►│
    │◄──── JWT token ─────────────│◄──── user doc ─────────│
    │                              │                        │
    │  GET /api/feedback/my ──────►│  protect middleware ──►│  JWT verify + attach student
    │◄──── feedbacks array ───────│  Feedback.find() ─────►│
    │                              │                        │
    │  POST /api/feedback/submit ─►│  check allotment ─────►│
    │◄──── 201 Created ───────────│  upsert ──────────────►│
```

### 3.2 Rendering Paradigm
**Client-side SPA**: Vite dev server proxies API calls; production build outputs static files to `client/dist/`. No SSR, no static generation. All routing happens client-side via React Router 7.

### 3.3 State Management
- **Auth state:** React Context (`AuthContext`): single provider wrapping the entire app tree. Stores `student` object, `loading` flag, `login()` and `logout()` functions. Includes `tryRefresh()` flow for expired tokens.
- **Token persistence:** `sessionStorage` (cleared on tab close). Axios default header `Authorization: Bearer <token>` set on login, cleared on logout. Refresh token in `localStorage`.
- **Component-local state:** `useState` / `useEffect` per component for feedback lists, allotments, form data, etc. No global state library (Redux, Zustand, etc.).
- **localStorage:** Used for feedback lock state (`fb_locked`), feedback drafts (`fb_drafts`), and cookie consent preference (`cookie_consent`). Never for sensitive data.

### 3.4 Authentication & Authorization

```
Login flow:
  Client → POST /api/auth/login { email, usn, password }
  Server → bcrypt.compare() → jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' })
                               jwt.sign({ id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' })
  Client → sessionStorage.setItem('token', data.token)
          → localStorage.setItem('refreshToken', data.refreshToken)
          → axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

Guard layers:
  [1] ProtectedRoute: redirects to / if !student (client-side)
  [2] AdminRoute: redirects non-admin users from /admin/* (client-side)
  [3] protect middleware: verifies JWT, attaches req.student (server-side)
  [4] Admin role check: req.student.role !== 'admin' → 403 (in route handler)
```

### 3.5 Layout Architecture (Client Routing)

```
<AuthProvider>
  <Routes>
    <Route path="/"              element={<PublicRoute><Landing /></PublicRoute>} />
    <Route path="/login"         element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/feedback/public" element={<PublicFeedback />} />
    <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
      <Route path="/dashboard" … />
      <Route path="/feedback" … />
      <Route path="/my-feedback" … />
      <Route element={<AdminRoute />}>
        <Route path="/admin" … />
        <Route path="/admin/:classGroup/dashboard" … />
        <Route path="/admin/allotments" … />
        <Route path="/admin/database" … />
        <Route path="/admin/anonymous" … />
        <Route path="/admin/:classGroup" … />
        <Route path="/admin/:classGroup/student/:studentId" … />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
  <CookieConsent />
</AuthProvider>
```

- **ProtectedLayout** renders `<Navbar /> + <main><Outlet /></main> + <Footer />`.
- **Public routes** (`/`, `/login`, `/feedback/public`) have no navbar/footer.
- **Admin routes** are wrapped in `<AdminRoute />` which redirects non-admin users to `/dashboard`.
- **404** renders standalone: no navbar, no footer.

### 3.6 API Design
- RESTful JSON over HTTP.
- Base URL: `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'` (configurable via env var).
- All admin routes cascade: `protect` middleware → admin role check → handler.
- Pagination: `page`/`limit`/`skip` params on admin list endpoints , returns `{ data, total, page, pages }`.

### 3.7 API Route Inventory (20 endpoints)

| # | Method | Full Path | Auth | Rate Limited | Admin Only |
|---|---|---|---|---|---|
| 1 | GET | `/api/health` | No | No | No |
| 2 | POST | `/api/auth/login` | No | Yes (5/15m) | No |
| 3 | POST | `/api/auth/refresh` | No | No | No |
| 4 | GET | `/api/auth/me` | JWT | No | No |
| 5 | GET | `/api/feedback/subjects` | JWT | No | No |
| 6 | GET | `/api/feedback/my` | JWT | No | No |
| 7 | POST | `/api/feedback/submit` | JWT | No | No |
| 8 | GET | `/api/allotments/status` | JWT | No | No |
| 9 | GET | `/api/allotments` | JWT | No | Yes |
| 10 | POST | `/api/allotments` | JWT | No | Yes |
| 11 | GET | `/api/admin/classes` | JWT | No | Yes |
| 12 | GET | `/api/admin/students` | JWT | No | Yes |
| 13 | GET | `/api/admin/feedback` | JWT | No | Yes |
| 14 | GET | `/api/admin/feedback/stats` | JWT | No | Yes |
| 15 | GET | `/api/admin/feedback/subject/:subject` | JWT | No | Yes |
| 16 | GET | `/api/admin/feedback/subject/:subject/coverage` | JWT | No | Yes |
| 17 | GET | `/api/admin/db-overview` | JWT | No | Yes |
| 18 | GET | `/api/public/subjects` | No | No | No |
| 19 | POST | `/api/public/feedback` | No | Yes (10/15m) | No |
| 20 | GET | `/api/public/feedbacks` | JWT | No | No |

---

## 4. Folder Architecture & Mapping

```
mern-feedback-collector/
│
├── package.json                 Root orchestration: runs server + client via concurrently
│
├── Dockerfile                   Multi-stage Docker build for production deployment
│
├── .dockerignore                Docker build context exclusions
│
├── .github/workflows/ci.yml     GitHub Actions CI: 3 jobs (test, lint, build) on push/PR
│
├── .husky/pre-commit             Husky pre-commit hook: lint-staged
│
├── .husky/_/.gitignore           Husky internal gitignore
│
├── vercel.json                  Vercel deployment config: SPA rewrites, CSP, security headers
│
├── LICENSE.md                   Full GPLv3 legal text: author Pawan Simha R, 2026
│
├── PRD.md                       Product Requirements Document: MoSCoW features, KPIs, user journeys
│
├── PRIVACY.md                   GDPR/CCPA privacy policy: data controller, retention, rights
│
├── README.md                    Project overview, setup instructions, API reference
│
├── context.md                   ← THIS FILE: system context and session continuity
│
├── .gitignore                   Ignores: node_modules, .env, dist, Thumbs.db, editor dirs
│
├── client/                      React 19 + Vite 8 SPA (frontend)
│   ├── package.json              Dependencies: react, react-router-dom, axios, vite, vitest
│   ├── eslint.config.js          ESLint flat config: react-hooks + react-refresh plugins
│   ├── vite.config.js            Vite + React plugin + API proxy (/api → :5000)
│   ├── index.html                SPA shell with SEO/GEO meta, JSON-LD, preloads, canonical URL
│   ├── public/
│   │   ├── images/               WebP + ICO assets (navbar-logo, footer-logo, hero-bg, footer-bg, favicon.ico)
│   │   ├── robots.txt            AI-aware crawler directives (search allowed, training scrapers blocked)
│   │   └── sitemap.xml           3-URL sitemap anchored to production domain
│   └── src/
│       ├── main.jsx              Entry point: BrowserRouter wraps App + AnalyticsTracker
│       ├── App.jsx               Route definitions, layout composition, ProtectedRoute, AdminRoute
│       ├── index.css             Global styles: CSS custom properties, reset, base typography, forms, buttons
│       ├── config/
│       │   └── api.js            Centralized API base URL (env-var-aware)
│       ├── context/
│       │   └── AuthContext.jsx    Auth state provider: student, login, logout, loading, refreshToken flow
│       ├── utils/
│       │   ├── download.js       CSV and Word doc export (Blob + download link)
│       │   └── analytics.js      Page-view analytics tracker (localStorage-based)
│       ├── styles/               16 per-component CSS files (modularized from index.css)
│       │   ├── AdminAllotments.css
│       │   ├── AdminClassSelect.css
│       │   ├── AdminDashboard.css
│       │   ├── AdminStudentFeedback.css
│       │   ├── AdminStudents.css
│       │   ├── AdminTable.css       (admin DB overview, admin anonymous tables)
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
│       └── components/           19 React components (flat, no admin subdirectory)
│           ├── AdminAllotments.jsx
│           ├── AdminAnonymous.jsx
│           ├── AdminClassSelect.jsx
│           ├── AdminDashboard.jsx
│           ├── AdminDbOverview.jsx
│           ├── AdminStudentFeedback.jsx
│           ├── AdminStudents.jsx
│           ├── AnalyticsTracker.jsx
│           ├── CookieConsent.jsx
│           ├── Dashboard.jsx
│           ├── ErrorBoundary.jsx
│           ├── FeedbackForm.jsx
│           ├── Footer.jsx
│           ├── Landing.jsx
│           ├── Login.jsx
│           ├── MyFeedback.jsx
│           ├── Navbar.jsx
│           ├── NotFound.jsx
│           └── PublicFeedback.jsx
│
├── server/                      Express 4.21 REST API (backend)
│   ├── package.json              Dependencies: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, helmet, compression, pino, pm2, swagger
│   ├── ecosystem.config.js       PM2 cluster config: N workers = N CPU cores, auto-restart, log rotation
│   ├── server.js                 App entry: dotenv, connectDB, JWT check, app.listen
│   ├── app.js                    Express app factory: helmet, compression, pino-http, cors, 10kb body limit, 5 route mounts, health, 404 catch-all, errorHandler
│   ├── .env                      MONGO_URI, JWT_SECRET, PORT (not committed to git)
│   ├── .env.example              Documented all env vars with defaults
│   ├── config/
│   │   ├── db.js                 Mongoose connection with MONGO_URI env fallback
│   │   ├── logger.js             Pino logger instance (JSON stdout, level from LOG_LEVEL env)
│   │   ├── subjects.js           6-subject constant (DevOps, MERN, Java, Agile, Research, DataScience)
│   │   └── swagger.js            Swagger/OpenAPI configuration for /api/docs
│   ├── middleware/
│   │   ├── auth.js               JWT verify middleware: attaches req.student or 401
│   │   └── errorHandler.js       Centralized error handler: logs via req.log, returns JSON
│   ├── models/
│   │   ├── Student.js            name, email (unique), usn (unique), password, role, classGroup
│   │   ├── Feedback.js           student ref, subject, comments; compound index { student, subject }
│   │   ├── PublicFeedback.js     subject, facultyName, comments; index { createdAt: -1 }
│   │   └── Allotment.js          classGroup (unique), isOpen, message (15-50 chars), allottedBy ref
│   ├── routes/
│   │   ├── auth.js               POST /login (rate-limited), GET /me, POST /refresh
│   │   ├── feedback.js           GET /subjects, GET /my, POST /submit (with upsert, allotment check)
│   │   ├── admin.js              GET /classes, /students, /feedback, /feedback/stats,
│   │   │                         /feedback/subject/:subject, /feedback/subject/:subject/coverage,
│   │   │                         /db-overview (all paginated)
│   │   ├── allotment.js          GET /status, GET /, POST / (toggle open/close)
│   │   └── public.js             GET /subjects, POST /feedback (Origin-validated, rate-limited), GET /feedbacks (admin-protected)
│   ├── tests/
│   │   └── server.test.js        Smoke tests: health endpoint, 404 handler (Jest+Supertest)
│   └── scripts/
│       ├── seed.js               51 students for "MCA, 1st Year, 2nd Sem, A sec", pw: "MCAA@123"
│       ├── seed-b.js             50 students for "B sec", pw: "MCAB@123"
│       ├── seed-admin.js         Admin user seeder (env-var-ized credentials)
│       ├── seed-c.js             49 students for "C sec", pw: "MCAC@123"
│       ├── update-roles.js       Bulk role update utility
│       └── update-classes.js     Bulk class reassignment utility
```

**Why each server subdirectory exists:**
- `config/`: Centralizes DB connection logic, logger, and static subject data so routes don't hardcode any of them.
- `middleware/`: Auth guard (JWT verify) and centralized error handler extracted so all routes share consistent behavior.
- `models/`: Mongoose schemas define the 4-collection shape; no migrations needed (schema-free MongoDB). Compound indexes on Feedback for upsert performance.
- `routes/`: Controllers organized by domain (auth, feedback, admin, allotment, public) mirroring the `/api/*` mount points in `app.js`.
- `tests/`: Jest+Supertest smoke tests that import the app (without starting a server) for CI-ready validation.
- `scripts/`: Standalone Node.js scripts for seeding and maintenance; not part of the running app.

---

## 5. Engineering Guardrails & Anti-Patterns

### 5.1 Style Conventions

**CSS:**
- Custom properties defined in `:root` (`--primary: #1a237e`, `--gray-500: #6b7280`, `--radius-md: 10px`, etc.): always prefer these over raw hex values.
- BEM-like naming: `.block__element--modifier` (e.g., `.not-found__btn--primary`). Used in ~6 files (CookieConsent, Footer, Landing, NotFound, PublicFeedback, Login).
- Relative units only (`rem`, `%`, `vh`): never `px` for font sizes or spacing.
- All animations must respect `@media (prefers-reduced-motion: reduce)`.
- Breakpoints: `≤480px` (mobile), `481-768px` (tablet), `≥1200px` (large desktop).

**JavaScript/JSX:**
- `camelCase` for variables, functions, and file names (except component files which are `PascalCase.jsx`).
- All components are function components with hooks: ErrorBoundary is the only class component (required for `getDerivedStateFromError`).
- PropTypes not used (no TypeScript); rely on API contracts and runtime validation.
- Arrow functions preferred over `function` keyword for component definitions.

**Backend (Node/Express):**
- `require()` syntax (CommonJS): server is not using ES modules.
- Route handlers use `async/await` with try/catch, delegating errors via `next(error)`.
- Environment variables via `dotenv`: never commit secrets.

### 5.2 Strict Anti-Patterns

| Anti-Pattern | Why It's Banned | Correct Approach |
|---|---|---|
| **Hardcoding API URLs** | `'http://localhost:5000/api'` scattered across 13 files made migration impossible | Import from `config/api.js`; use `VITE_API_URL` env var for production |
| **Bypassing auth middleware** | Any route that should be protected must use the `protect` middleware | Apply `protect` at the router level or on individual routes |
| **Hardcoded class groups in UI** | Admin routes define `CLASSES` array: frontend must fetch from `/api/admin/classes` | **FIXED:** `AdminClassSelect.jsx` and `AdminAllotments.jsx` fetch from API |
| **Client-side secrets** | JWT secrets, DB passwords, or API keys in client code | All secrets stay in `server/.env`; client only gets public-facing config |
| **Raw CSS fallbacks** | New components should use CSS custom properties from `:root`, not ad-hoc hex values | `color: var(--primary)` not `color: #1a237e` |
| **Pixels for typography** | `px` values break when users change browser default font size | `rem` for fonts, `rem` or `%` for spacing |
| **Typos in classGroup** | `classGroup` must match exactly for allotment queries | Centralized constant: `'MCA, 1st Year, 2nd Sem, A sec'` (and B, C variants) |
| **Synchronous file writes** | Client-side export uses Blob URLs: no server-side file generation | Download utils in `client/src/utils/download.js` with `URL.createObjectURL` |
| **Mixing auth flows** | Login requires email AND usn AND password: model must remain consistent | Auth route validates all three fields with 400 on missing |
| **`console.log/error` in routes** | No structured logging = unsearchable, unleveled output | Use `config/logger.js` (pino) with structured levels and JSON output |
| **Bare `res.status(500).json` in catch** | Inconsistent error format, no logging context | Throw or `next(error)` , caught by `errorHandler.js` middleware |
| **Server entry + app in same file** | Tests can't import app without starting a server (port conflicts) | Split: `app.js` exports app, `server.js` only calls `.listen()` |

### 5.3 Security Constraints

- CSP restricts `connect-src` to `'self'` and the production API origin: no arbitrary external fetch.
- JWT tokens have 30-day expiry; stored in `sessionStorage` (not `localStorage`) so tokens die on tab close.
- Refresh tokens (7d) stored in `localStorage` for automatic session extension via `tryRefresh()`.
- Public anonymous feedback cannot be linked to any authenticated user: no `student` field on the model.
- Admin routes use a three-layer guard: `AdminRoute` (client-side) + `protect` middleware (server-side) + explicit `role !== 'admin'` check.
- Login endpoint rate-limited (5 req/15min) to prevent brute force.
- Public POST endpoint rate-limited (10 req/15min) and Origin-validated for CSRF defense.
- Request body limited to 10kb to prevent memory exhaustion.

---

## 6. Active Session State & Milestone Checklist

### `[x]` Completed Features (All Milestones)

| Milestone | Commit |
|---|---|
| **Initial MERN scaffold**, auth, feedback CRUD, admin routes, MongoDB models | `0c385ea` |
| **WebP image migration**, all images to WebP (q85), originals deleted | `6b209d0` |
| **SEO/GEO meta tags**, canonical URL, OG/Twitter cards, JSON-LD schema, author meta | `0e4bea9` |
| **GPLv3 licensing**, full text in `LICENSE.md`, headers in all 56+ source files | `0e4bea9` |
| **Product documentation**, `PRD.md`, `README.md`, `context.md` | `0e4bea9`, `805fdf1` |
| **Branded 404 page**, CSS compass illustration, brand logo, recovery CTAs, no navbar/footer | Current |
| **Cookie consent banner**, accessible dialog with Accept/Decline, localStorage persistence | Current |
| **AI-aware robots.txt**, search crawlers allowed, training scrapers blocked | Current |
| **Sitemap.xml**, 3 URLs anchored to production domain | Current |
| **Privacy policy**, `PRIVACY.md` covering GDPR/CCPA, data collection, retention, rights | Current |
| **API URL centralization**, `config/api.js` with `VITE_API_URL` env var; all 13 files updated | Current |
| **Vercel deployment config**, `vercel.json` with SPA rewrites + strict security headers | Current |
| **CSP update**, `connect-src` points to production domain | Current |
| **Comment-only feedback**, per-subject comments with draft auto-save and lock/unlock flow | Current |
| **Rate limiting**, `express-rate-limit` (10 req/15min public, 5 req/15min login) | Current |
| **Class list API fetch**, `AdminClassSelect` + `AdminAllotments` fetch from `/api/admin/classes` | Current |
| **Allotment close bug fix**, no message validation when closing an allotment | Current |
| **Vite API proxy**, dev server proxies `/api` → `localhost:5000` | Current |
| **Request body limit**, `express.json({ limit: '10kb' })` | Current |
| **API 404 handler**, catch-all returns JSON for unknown API routes | Current |
| **Scripts env fix**, `update-classes.js` & `update-roles.js` use `process.env.MONGO_URI` | Current |
| **Typo fix**, "Research Methadology" → "Research Methodology" | Current |
| **UX improvements**, loading states, error handling, rating column, social icons, `aria-label` across components | Current |
| **MongoDB indexes**, compound + single-field indexes on Feedback & PublicFeedback | Current |
| **`.lean()` optimization**, all read-only queries use `.lean()` (~40% faster reads) | Current |
| **PM2 cluster mode**, `ecosystem.config.js` with `instances: 'max'`, `exec_mode: 'cluster'` | Current |
| **Helmet security headers**, X-Frame-Options, X-Content-Type-Options, CSP enforcement | Current |
| **gzip compression**, `compression()` middleware shrinks API responses by ~70% | Current |
| **Input validation hardening**, subject whitelist `SUBJECTS.includes()` + comment length range check | Current |
| **CORS restriction**, `CORS_ORIGIN` env var restricts allowed origins | Current |
| **ErrorBoundary + crash resilience**, ErrorBoundary wrapping `<Routes>`; JSON.parse try/catch | Current |
| **Security hardening**, Bearer token space fix, `console.error` to `.message`, admin creds env-var-ized | Current |
| **Logout state cleanup**, clears `fb_locked`/`fb_drafts` from localStorage | Current |
| **Admin UI enhancements**, AdminDashboard at `/admin/:classGroup/dashboard`; loading states | Current |
| **`.env.example` template**, all env vars documented with defaults | Current |
| **Centralized error handler**, `errorHandler.js` replacing repetitive try/catch `res.status(500).json` | Current |
| **Structured logging (pino)**, `config/logger.js` + `pino-http` replacing `console.log`/`console.error` | Current |
| **App/Server split (testability)**, `app.js` exports Express app, `server.js` starts it | Current |
| **Origin validation on public POST**, CSRF defense via `validateOrigin` middleware | Current |
| **Smoke tests (Jest+Supertest)**, `server/tests/server.test.js` , 2 tests (health + 404) | Current |
| **Stale build PNGs removed**, `dist/images/Gemini_*` deleted | Current |
| **CSS modularization**, `index.css` split into 16 per-component CSS files in `styles/` | Current |
| **JS lazy loading**, 6 admin components lazy-loaded with `React.lazy` + `Suspense` | Current |
| **Skip-to-content**, skip-link for keyboard users | Current |
| **Inline validation**, comment length range on feedback form | Current |
| **aria-live regions**, `role="alert"` on form submission errors | Current |
| **CSP dev metatag**, for Vite HMR compatibility | Current |
| **Empty states**, no-data messages across all admin and user pages | Current |
| **Image lazy loading**, `loading="lazy"` attribute on all images | Current |
| **Dockerfile**, multi-stage Docker build (Node 20 Alpine) | Current |
| **GitHub Actions CI**, 3 jobs (test, lint, build) on push/PR to main | Current |
| **Swagger API docs**, `/api/docs` endpoint with interactive UI | Current |
| **Pagination**, `page`/`limit`/`skip` on admin list endpoints | Current |
| **Refresh token flow**, `POST /api/auth/refresh`, `tryRefresh()` in AuthContext | Current |
| **Analytics tracker**, page-view tracking via dedicated `AnalyticsTracker` component | `f831e99` |
| **Husky + lint-staged**, pre-commit hooks | Current |
| **AdminRoute guard**, role-based redirect for non-admin users | Current |
| **C section seed data**, `seed-c.js` with 49 students, password `MCAC@123` | Current |
| **AdminTable.css full rewrite**, full-width layout, CSS vars throughout, summary cards with accent bars, progress bars on subjects, structured class card headers | Current |
| **AdminStudents.css complete**, all `.chip`, `.cov-tab`, `.coverage-*`, `.badge`, `.student-list-*` classes added | Current |
| **AdminDbOverview dashboard redesign**, summary cards with top accent bars, subject progress bars, class split header/body, allotment status pills | Current |
| **CSS variable refactor (all 16 files)**, all hardcoded hex colors across Landing.css, PublicFeedback.css, NotFound.css, CookieConsent.css, FeedbackForm.css, Login.css, AdminStudentFeedback.css, AdminAllotments.css, AdminStudents.css, AdminDashboard.css, MyFeedback.css, Navbar.css replaced with CSS custom properties; `index.css` focus-visible outlines fixed; `AGENTS.md` created | Current |

### `[x]` All Phases Complete

All four audit phases (A, B, C, D) are fully implemented. The project is production-ready.

### `[ ]` Future Work (Backlog)

| Feature | Rationale |
|---|---|
| TypeScript migration | Full static typing across the stack |
| Cursor-based pagination | Better performance for large datasets |
| OAuth2/SAML single sign-on | Enterprise integration path |
| Real-time feedback dashboard | WebSocket-based live coverage updates |
| Mobile companion app | React Native wrapper for push notifications |
| Analytics dashboard | Visual charts (submission rates, sentiment trends) |
| Email notifications | Automated reminders when feedback window opens/closes |
| Faculty role | Read-only view for faculty to see aggregated class stats |

### Environment References

| Variable | Dev Value | Production (Vercel) |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Set via Vercel Environment Variables |
| `MONGO_URI` | `mongodb://localhost:27017/feedback-collector` | Set via hosting platform |
| `JWT_SECRET` | (from `server/.env`) | Set via hosting platform |
| `CORS_ORIGIN` | `http://localhost:5173` | Set via hosting platform |
| `JWT_EXPIRES_IN` | `30d` | Set via hosting platform |
| `LOGIN_RATE_LIMIT_MAX` | `5` | Set via hosting platform |
| `RATE_LIMIT_WINDOW_MS` | `15` minutes | Set via hosting platform |
| `RATE_LIMIT_MAX` | `10` | Set via hosting platform |
| `LOG_LEVEL` | `info` | `info` |
| `ADMIN_EMAIL` | `admin@gmail.com` | Set via hosting platform |
| `ADMIN_PASSWORD` | (from `server/.env`) | Set via hosting platform |
| Vite dev server | `http://localhost:5173` | - |
| Express server | `http://localhost:5000` | - |
