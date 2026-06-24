# SOAS Feedback Collector: System Context

> **Generated:** June 2026  
> **Author:** Pawan Simha R (MCA, SOAS, Sapthagiri NPS University)  
> **Purpose:** Absolute source of truth for cross-session architectural continuity.  
> **License:** GNU General Public License v3.0

---

## 1. System Overview & Strategic Intent

**What it does:**  
A full-stack MERN single-page application that enables MCA students at Sapthagiri NPS University to submit per-subject course feedback (ratings + comments) after each class session. Administrators open/close feedback windows via allotments, track participation coverage, drill into individual student feedback, and export aggregated reports in CSV or Word format.

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
| **Rate Limiting** | express-rate-limit | (latest) | 10 req / 15 min on public endpoint |
| **Security Headers** | Helmet | ^8.2.0 | X-Frame-Options, X-Content-Type-Options, CSP enforcement |
| **Response Compression** | compression | ^1.8.1 | gzip on all API responses (~70% smaller payloads) |
| **Process Manager** | PM2 | ^7.0.1 | Cluster mode: N workers = N CPU cores; auto-restart on crash |
| **ODM / Database** | Mongoose / MongoDB | ^8.6.0 | 4 collections (students, feedbacks, publicfeedbacks, allotments) |
| **Authentication** | jsonwebtoken | ^9.0.2 | 30-day expiry, sessionStorage on client |
| **Password Hashing** | bcryptjs | ^2.4.3 | Salt rounds: 10 |
| **Dev Orchestration** | concurrently | ^8.2.2 | Runs server + client in parallel |
| **Dev Server (server)** | nodemon | ^3.1.4 | Auto-restart on file change |
| **Linting** | ESLint | ^10.3.0 | react-hooks + react-refresh plugins |
| **CSS** | Custom properties (no framework) | - | In `index.css` (~3850 lines) |
| **Structured Logging** | pino | ^9.14.0 | `pino-http` for HTTP request logging, level from `LOG_LEVEL` env |
| **Image Format** | WebP | quality 85 | All raster assets in `client/public/images/` |
| **Deployment** | Vercel | - | `vercel.json` with SPA rewrites + security headers |
| **License** | GPLv3 | - | `LICENSE.md` + headers in all 50 source files |

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
- **Auth state:** React Context (`AuthContext`): single provider wrapping the entire app tree. Stores `student` object, `loading` flag, `login()` and `logout()` functions.
- **Token persistence:** `sessionStorage` (cleared on tab close). Axios default header `Authorization: Bearer <token>` set on login, cleared on logout.
- **Component-local state:** `useState` / `useEffect` per component for feedback lists, allotments, form data, etc. No global state library (Redux, Zustand, etc.).
- **localStorage:** Used for feedback lock state (`fb_locked`), feedback drafts (`fb_drafts`), per-subject ratings (`fb_ratings`), and cookie consent preference (`cookie_consent`). Never for sensitive data.

### 3.4 Authentication & Authorization

```
Login flow:
  Client → POST /api/auth/login { email, usn, password }
  Server → bcrypt.compare() → jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' })
  Client → sessionStorage.setItem('token', data.token)
          → axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

Guard layers:
  [1] ProtectedRoute: redirects to / if !student (client-side)
  [2] protect middleware: verifies JWT, attaches req.student (server-side)
  [3] Admin role check: req.student.role !== 'admin' → 403 (in route handler)
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
      <Route path="/admin/*" … />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
  <CookieConsent />
</AuthProvider>
```

- **ProtectedLayout** renders `<Navbar /> + <main><Outlet /></main> + <Footer />`.
- **Public routes** (`/`, `/login`, `/feedback/public`) have no navbar/footer.
- **404** renders standalone: no navbar, no footer.

### 3.6 API Design
- RESTful JSON over HTTP.
- Base URL: `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'` (configurable via env var).
- All admin routes cascade: `protect` middleware → admin role check → handler.
- Pagination: not implemented (all endpoints return full result sets: acceptable for current scale).

---

## 4. Folder Architecture & Mapping

```
mern-feedback-collector/
│
├── package.json                 Root orchestration: runs server + client via concurrently
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
│   ├── package.json              Dependencies: react, react-router-dom, axios, vite
│   ├── vite.config.js            Vite + React plugin + API proxy (/api → :5000)
│   ├── index.html                SPA shell with SEO/GEO meta, JSON-LD, preloads, canonical URL
│   ├── public/
│   │   ├── images/               WebP + ICO assets (navbar-logo, footer-logo, hero-bg, footer-bg, favicon.ico)
│   │   ├── robots.txt            AI-aware crawler directives (search allowed, training scrapers blocked)
│   │   └── sitemap.xml           3-URL sitemap anchored to production domain
│   └── src/
│       ├── main.jsx              Entry point: BrowserRouter wraps App
│       ├── App.jsx               Route definitions, layout composition, cookie consent
│       ├── config/
│       │   └── api.js            Centralized API base URL (env-var-aware)
│       ├── context/
│       │   └── AuthContext.jsx    Auth state provider: student, login, logout, loading
│   ├── components/           18 React components
│       │   ├── Landing.jsx       Public landing page with FAQ accordion
│       │   ├── Login.jsx         Email + USN + password form
│       │   ├── Dashboard.jsx     Student home: session status, start-feedback button
│   │   ├── FeedbackForm.jsx  Per-subject star rating (1-5) + comments (50-300 chars), lock/unlock, draft storage
│   │   ├── MyFeedback.jsx    Feedback history table with star ratings, loading & error states
│       │   ├── PublicFeedback.jsx Anonymous form: no auth required
│       │   ├── NotFound.jsx      Branded 404: CSS compass, two CTAs, no nav/footer
│       │   ├── CookieConsent.jsx GDPR banner with Accept/Decline, localStorage persistence
│       │   ├── Navbar.jsx        Auth-aware navigation with conditional links
│   │   ├── Footer.jsx        Shared footer with social media icon buttons (SVG), quick links, and copyright
│       │   ├── ErrorBoundary.jsx  Global error boundary with reload CTA
│       │   └── admin/            7 admin sub-components
│       │       ├── AdminClassSelect.jsx
│       │       ├── AdminStudents.jsx
│       │       ├── AdminStudentFeedback.jsx
│       │       ├── AdminAllotments.jsx
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminDbOverview.jsx
│       │       └── AdminAnonymous.jsx
│       ├── utils/
│       │   └── download.js       Client-side CSV and Word doc export (Blob + download link)
│   └── index.css             Global styles: ~3850 lines, CSS custom properties, BEM naming
│
├── server/                      Express 4.21 REST API (backend)
│   ├── package.json              Dependencies: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, helmet, compression, pm2, pino
│   ├── ecosystem.config.js       PM2 cluster config: N workers = N CPU cores, auto-restart, log rotation
│   ├── server.js                 App entry: dotenv, connectDB, JWT check, app.listen
│   ├── app.js                    Express app factory: helmet, compression, pino-http, cors, 5 route mounts, health, 404 catch-all, errorHandler
│   ├── .env                      MONGO_URI, JWT_SECRET, PORT (not committed to git)
│   ├── config/
│   │   ├── db.js                 Mongoose connection with MONGO_URI env fallback
│   │   ├── logger.js             Pino logger instance (JSON stdout, level from LOG_LEVEL env)
│   │   └── subjects.js           6-subject constant (DevOps, MERN, Java, Agile, Research, DataScience)
│   ├── middleware/
│   │   ├── auth.js               JWT verify middleware: attaches req.student or 401
│   │   └── errorHandler.js       Centralized error handler: logs via req.log, returns JSON
│   ├── models/
│   │   ├── Student.js            name, email, usn (unique), password, role, classGroup
│   │   ├── Feedback.js           student ref, subject, rating (1-5), comments
│   │   ├── PublicFeedback.js     subject, facultyName, comments
│   │   └── Allotment.js          classGroup (unique), isOpen, message (15-50 chars), allottedBy ref
│   ├── routes/
│   │   ├── auth.js               POST /login, GET /me
│   │   ├── feedback.js           GET /subjects, GET /my, POST /submit (with upsert)
│   │   ├── admin.js              GET /classes, /students, /feedback, /feedback/stats,
│   │   │                         /feedback/subject/:subject, /feedback/subject/:subject/coverage,
│   │   │                         /db-overview
│   │   ├── allotment.js          GET /status, GET /, POST / (toggle open/close)
│   │   └── public.js             GET /subjects, POST /feedback (Origin-validated, rate-limited), GET /feedbacks (admin-protected)
│   ├── tests/
│   │   └── server.test.js        Smoke tests: health endpoint, 404 handler (Jest+Supertest)
│   └── scripts/
│       ├── seed.js               51 students for "MCA, 1st Year, 2nd Sem, A sec", pw: "MCAA@123"
│       ├── seed-admin.js         Admin user seeder
│       ├── seed-b.js             Additional student seeder
│       ├── update-roles.js       Bulk role update utility
│       └── update-classes.js     Bulk class reassignment utility
```

**Why each server subdirectory exists:**
- `config/`: Centralizes DB connection logic, logger, and static subject data so routes don't hardcode any of them.
- `middleware/`: Auth guard (JWT verify) and centralized error handler extracted so all routes share consistent behavior.
- `models/`: Mongoose schemas define the 4-collection shape; no migrations needed (schema-free MongoDB).
- `routes/`: Controllers organized by domain (auth, feedback, admin, allotment, public) mirroring the `/api/*` mount points in `app.js`.
- `tests/`: Jest+Supertest smoke tests that import the app (without starting a server) for CI-ready validation.
- `scripts/`: Standalone Node.js scripts for seeding and maintenance; not part of the running app.

---

## 5. Engineering Guardrails & Anti-Patterns

### 5.1 Style Conventions

**CSS:**
- Custom properties defined in `:root` (`--primary: #1a237e`, `--gray-500: #6b7280`, `--radius-md: 10px`, etc.): always prefer these over raw hex values.
- BEM-like naming: `.block__element--modifier` (e.g., `.not-found__btn--primary`).
- Relative units only (`rem`, `%`, `vh`): never `px` for font sizes or spacing.
- All animations must respect `@media (prefers-reduced-motion: reduce)`.
- Breakpoints: `≤480px` (mobile), `481-768px` (tablet), `≥1200px` (large desktop).

**JavaScript/JSX:**
- `camelCase` for variables, functions, and file names (except component files which are `PascalCase.jsx`).
- All components are function components with hooks: no class components.
- PropTypes not used (no TypeScript); rely on API contracts and runtime validation.
- Arrow functions preferred over `function` keyword for component definitions.

**Backend (Node/Express):**
- `require()` syntax (CommonJS): server is not using ES modules.
- Route handlers use `async/await` with try/catch.
- Environment variables via `dotenv`: never commit secrets.

### 5.2 Strict Anti-Patterns

| Anti-Pattern | Why It's Banned | Correct Approach |
|---|---|---|
| **Hardcoding API URLs** | `'http://localhost:5000/api'` scattered across 13 files made migration impossible | Import from `config/api.js`; use `VITE_API_URL` env var for production |
| **Bypassing auth middleware** | Any route that should be protected must use the `protect` middleware | Apply `protect` at the router level or on individual routes |
| ~~Hardcoded class groups in UI~~ | ~~Admin routes define `CLASSES` array: frontend must fetch from `/api/admin/classes`~~ | **FIXED:** `AdminClassSelect.jsx` and `AdminAllotments.jsx` now fetch from `/api/admin/classes` |
| **Client-side secrets** | JWT secrets, DB passwords, or API keys in client code | All secrets stay in `server/.env`; client only gets public-facing config via Vite env vars |
| **Raw CSS fallbacks** | New components should use CSS custom properties from `:root`, not ad-hoc hex values | `color: var(--primary)` not `color: #1a237e` (except in the variable definition itself) |
| **Pixels for typography** | `px` values break when users change browser default font size | `rem` for fonts, `rem` or `%` for spacing |
| **Typos in classGroup** | `classGroup` is stored inconsistently across seed data: must match exactly for allotment queries | Centralized constant: `'MCA, 1st Year, 2nd Sem, A sec'` (and B, C variants) |
| **Synchronous file writes** | Client-side export uses Blob URLs: no server-side file generation | Download utils in `client/src/utils/download.js` with `URL.createObjectURL` |
| **Mixing auth flows** | Login requires email AND usn AND password: model must remain consistent | Auth route validates all three fields with 400 on missing |
| **`console.log/error` in routes** | No structured logging = unsearchable, unleveled output in production | Use `config/logger.js` (pino) with structured levels and JSON output |
| **Bare `res.status(500).json` in catch** | Inconsistent error format, no logging context, unmaintainable | Throw or `next(error)` — caught by `errorHandler.js` middleware |
| **Server entry + app in same file** | Tests can't import app without starting a server (port conflicts) | Split: `app.js` exports app, `server.js` only calls `.listen()` |

### 5.3 Security Constraints

- CSP restricts `connect-src` to `'self'` and the production API origin: no arbitrary external fetch.
- JWT tokens have 30-day expiry; stored in `sessionStorage` (not `localStorage`) so tokens die on tab close.
- Public anonymous feedback cannot be linked to any authenticated user: no `student` field on the model.
- Admin routes use a two-layer guard: `protect` middleware + explicit `role !== 'admin'` check.

---

## 6. Active Session State & Milestone Checklist

### `[x]` Completed Features (Milestones Reached)

| Milestone | Evidence | Commit |
|---|---|---|
| **Initial MERN scaffold** | Working auth, feedback CRUD, admin routes, MongoDB models | `0c385ea` |
| **WebP image migration** | All images converted to WebP (q85), moved to `public/images/`, originals deleted | `6b209d0` |
| **SEO/GEO meta tags** | Canonical URL, OG/Twitter cards, JSON-LD (WebApplication schema), author meta | `0e4bea9` |
| **GPLv3 licensing** | Full GPLv3 text in `LICENSE.md`, copyright headers in all 50 source files | `0e4bea9` |
| **Product documentation** | `PRD.md` (MoSCoW, KPIs, user journeys) and `README.md` with project structure | `0e4bea9`, `805fdf1` |
| **Branded 404 page** | CSS compass illustration, brand logo, "Go to Homepage" + "Go Back" CTAs, no navbar/footer | Current (uncommitted) |
| **Cookie consent banner** | Accessible dialog with Accept/Decline, localStorage persistence, links to PRIVACY.md | Current (uncommitted) |
| **AI-aware robots.txt** | Search crawlers (Googlebot, Bingbot, Perplexity, etc.) allowed; training scrapers (GPTBot, ClaudeBot, CCBot) blocked | Current (uncommitted) |
| **Sitemap.xml** | 3 URLs anchored to production domain `https://snpsu-feedback-collector.vercel.app` | Current (uncommitted) |
| **Privacy policy** | `PRIVACY.md` covering GDPR/CCPA, data collection, retention, contact | Current (uncommitted) |
| **API URL centralization** | `config/api.js` with `VITE_API_URL` env var; all 13 files updated to import | Current (uncommitted) |
| **Vercel deployment config** | `vercel.json` with SPA rewrites and strict security headers | Current (uncommitted) |
| **CSP update** | `connect-src` points to production domain instead of `localhost:5000` | Current (uncommitted) |
| **Star rating UI fix** | Added 1–5 star selector to FeedbackForm, removed hardcoded `rating: 3` | Current (uncommitted) |
| **Rate limiting implemented** | `express-rate-limit` (10 req/15min) on `POST /api/public/feedback` | Current (uncommitted) |
| **Class list API fetch** | `AdminClassSelect.jsx` and `AdminAllotments.jsx` now fetch from `/api/admin/classes` | Current (uncommitted) |
| **Allotment close bug fix** | Server no longer validates message length when closing an allotment | Current (uncommitted) |
| **Vite API proxy** | Dev server proxies `/api` → `localhost:5000` | Current (uncommitted) |
| **Request body limit** | `express.json({ limit: '10kb' })` prevents memory exhaustion | Current (uncommitted) |
| **API 404 handler** | Catch-all returns JSON for unknown API routes | Current (uncommitted) |
| **Scripts env fix** | `update-classes.js` & `update-roles.js` use `process.env.MONGO_URI` with fallback | Current (uncommitted) |
| **Typo fix** | "Research Methadology" → "Research Methodology" | Current (uncommitted) |
| **UX improvements** | Loading states, error handling, rating column in MyFeedback, social icons in Footer, accessibility (`aria-label`) across components | Current (uncommitted) |
| **MongoDB indexes** | Feedback + PublicFeedback models indexed for IXSCAN on all query patterns | Current (uncommitted) |
| **`.lean()` optimization** | All read-only queries use `.lean()` — skips Mongoose hydration (~40% faster reads) | Current (uncommitted) |
| **PM2 cluster mode** | `ecosystem.config.js` with `instances: 'max'`, `exec_mode: 'cluster'` — uses all CPU cores | Current (uncommitted) |
| **Helmet security headers** | `helmet()` middleware adds X-Frame-Options, X-Content-Type-Options, CSP enforcement | Current (uncommitted) |
| **gzip compression** | `compression()` middleware shrinks JSON API responses by ~70% | Current (uncommitted) |
| **Login rate limiting** | `express-rate-limit` (5 req/15min) on `POST /api/auth/login` | Current (uncommitted) |
| **Input validation hardening** | Subject whitelist `SUBJECTS.includes()` + rating 1-5 range check on authenticated submit | Current (uncommitted) |
| **CORS restriction** | `CORS_ORIGIN` env var restricts allowed origins (defaults to `http://localhost:5173`) | Current (uncommitted) |
| **ErrorBoundary + crash resilience** | ErrorBoundary component wrapping `<Routes>`; JSON.parse try/catch in FeedbackForm + Dashboard | Current (uncommitted) |
| **Security hardening** | Bearer token space fix, `console.error` sanitized to `.message`, seed passwords removed from logs, admin creds env-var-ized | Current (uncommitted) |
| **Logout state cleanup** | `fb_locked`/`fb_drafts`/`fb_ratings` cleared from localStorage on logout | Current (uncommitted) |
| **Admin UI enhancements** | AdminDashboard wired at `/admin/:classGroup/dashboard`; loading states on AdminStudents/AdminStudentFeedback/AdminAllotments | Current (uncommitted) |
| **`.env.example` template** | All env vars documented (`JWT_EXPIRES_IN`, `CORS_ORIGIN`, `LOGIN_RATE_LIMIT_MAX`, `PUBLIC_RATE_LIMIT_MAX`, admin seed creds) | Current (uncommitted) |
| **Centralized error handler** | `errorHandler.js` middleware replacing repetitive try/catch `res.status(500).json` | Current (uncommitted) |
| **Structured logging (pino)** | `config/logger.js` + `pino-http` replacing `console.log`/`console.error` everywhere | Current (uncommitted) |
| **App/Server split (testability)** | `app.js` exports Express app, `server.js` only starts it — enables Supertest import | Current (uncommitted) |
| **Origin validation on public POST** | CSRF defense: `validateOrigin` middleware checks `Origin` header against `CORS_ORIGIN` | Current (uncommitted) |
| **Smoke tests (Jest+Supertest)** | `server/tests/server.test.js` — 2 passing tests (health + 404) | Current (uncommitted) |
| **Stale build PNGs removed** | `dist/images/Gemini_*` stale build artifacts deleted | Current (uncommitted) |

### `[/]` In-Progress Workloads

*All Phase A fixes from the Multi-Agent Audit are complete. See milestones above.*

### `[ ]` Upcoming Implementations (Next Steps)

| Feature | Rationale | Suggested Approach |
|---|---|---|
| **Phase B audit fixes** | Modularize CSS, code splitting, accessibility, CSP in dev, inline validation | Per audit report |
| **Phase C audit fixes** | Dockerfile, GitHub Actions CI, API docs, empty states, image lazy loading | Per audit report |
| **Phase D audit fixes** | TypeScript migration, pagination, refresh token flow, analytics, husky | Per audit report |

### Environment References

| Variable | Dev Value | Production (Vercel) |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Set via Vercel Environment Variables |
| `MONGO_URI` | `mongodb://localhost:27017/feedback-collector` | Set via hosting platform |
| `JWT_SECRET` | (from `server/.env`) | Set via hosting platform |
| `CORS_ORIGIN` | `http://localhost:5173` | Set via hosting platform |
| `JWT_EXPIRES_IN` | `30d` | Set via hosting platform |
| `LOGIN_RATE_LIMIT_MAX` | `5` | Set via hosting platform |
| `PUBLIC_RATE_LIMIT_MAX` | `10` | Set via hosting platform |
| `ADMIN_EMAIL` | `admin@gmail.com` | Set via hosting platform |
| `ADMIN_PASSWORD` | (from `server/.env`) | Set via hosting platform |
| Vite dev server | `http://localhost:5173` | - |
| Express server | `http://localhost:5000` | - |
