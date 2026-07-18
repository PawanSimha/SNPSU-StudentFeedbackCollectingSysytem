
  <div align="center">
    <img src="./client/public/images/footer-logo.webp" alt="SOAS Logo" width="280" />
    <br/>
    <h1>SOAS Feedback Collector</h1>
    <p><em>Anonymous course feedback platform for Sapthagiri NPS University</em></p>
    <p>
      <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
      <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
      <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white" alt="Express 4.21" />
      <img src="https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white" alt="MongoDB 8" />
      <img src="https://img.shields.io/badge/MERN-Stack-00d8ff" alt="MERN Stack" />
      <img src="https://img.shields.io/badge/Status-Production_Ready-success" alt="Status" />
      <img src="https://img.shields.io/badge/License-GPLv3-blue" alt="License GPLv3" />
    </p>
  </div>

---

<p align="center">
  <img src="./client/public/images/readme.webp" alt="SOAS Feedback Collector Dashboard" width="100%" style="border-radius: 12px; max-width: 900px;"/>
</p>

## 🎯 Product Strategy

### Problem Statement

MCA program coordinators at Sapthagiri NPS University lacked a structured, auditable mechanism to collect course feedback. The existing paper-based and ad-hoc Google Forms approach suffered from five critical pain points:

| Pain Point | Impact |
|---|---|
| **No session gating** | Students submitted feedback at any time, decoupled from actual class delivery |
| **Zero identity verification** | Inflated or spam submissions with no way to track per-student participation |
| **No public anonymity** | Students uncomfortable providing negative feedback through tracked channels had no outlet |
| **Manual aggregation** | Faculty spent 2–3 hours per review cycle compiling reports |
| **No participation tracking** | Instructors could not identify which students had/had not submitted feedback |

### What This Project Does

The **SOAS Feedback Collector** is a full-stack MERN single-page application that replaces this broken workflow with a **dual-channel feedback model**:

- 🔐 **Authenticated channel** - JWT-gated, session-allotment-gated per class group, identity-tracked for coverage reporting
- 🕵️ **Anonymous channel** - No authentication, no identity collected, rate-limited to prevent spam (10 req / 15 min)

Administrators open/close feedback windows per class, track participation coverage per subject with gave/not-given student lists, drill into individual student feedback, review the full database in a 5-tab enterprise dashboard, and export aggregated reports in CSV or Word format, all in real time.

---

## ✨ Key Features

### 👤 User Features
- **Sequential Feedback Form** - Step-by-step multi-subject flow with lock/unlock, auto-saved drafts, and batch submission
- **Student Dashboard** - View active feedback allotments, session status, progress stats, and guided stepper
- **Feedback History** - Browse all previously submitted feedback across subjects
- **Public Anonymous Feedback** - Submit feedback without logging in (subject + optional faculty name + 100–300 char comments)
- **Inline Validation** - Real-time validation on comments with clear error messages

### 🔧 Admin Features
- **Class Management** - Enterprise dashboard: 8 stat cards, search + 6 filter chips, Recharts pie/bar charts, activity panel, system health widget
- **Session Management** - Open/close feedback windows per class with custom messages, bulk actions, progress tracking, Recharts analytics
- **Database Overview** - 5-tab unified dashboard (Dashboard, Students, Feedbacks, Allotments, Anonymous) with global search, stat cards, class cards with expandable student lists, subject analytics with progress bars, allotment timeline cards, activity feed, and system health indicators
- **Coverage Tracking** - Per-subject view of which students gave/did not give feedback (gave/not-given lists with percentages)
- **Anonymous Feedbacks** - Review, search, and export all public submissions (standalone page + DB Overview tab)
- **Report Exports** - Download CSV (Excel, BOM-prefixed) or Word `.doc` files with styled HTML tables
- **Server-side Pagination** - Paginated tables on feedback, student, and anonymous list endpoints
- **AdminRoute Guard** - Non-admin users automatically redirected from `/admin/*`

### ♿ Accessibility & UX
- Skip-to-content link for keyboard navigation
- `role="alert"` regions for screen reader announcements
- Framer Motion entrance animations with `prefers-reduced-motion` support
- Descriptive empty states on all list views (no bare tables)
- All images use `loading="lazy"` for deferred loading
- 7 admin components lazy-loaded via `React.lazy` + `Suspense` (faster initial bundle)
- Feedback drafts saved to localStorage (survives page refreshes)
- Sonner toast notifications for admin actions (open, close, error, success)
- Social media icons (YouTube, Instagram, Facebook, LinkedIn, WhatsApp) in footer

### 🛡️ DevOps & Security
- **Helmet** security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- **gzip compression** on all API responses (~70% smaller payloads)
- **Rate limiting**: login (5/15min), public feedback (10/15min)
- **CORS** restricted via `CORS_ORIGIN` env var
- **Origin header validation** on public POST (CSRF defense)
- **10kb request body limit** (memory exhaustion prevention)
- **PM2 cluster mode** - N workers = N CPU cores, auto-restart on crash
- **Pino structured logging** - JSON stdout, level configurable via `LOG_LEVEL`
- **Centralized error handler** with request-scoped logging
- **Swagger API docs** at `/api/docs`
- **JWT refresh token flow** for extended sessions without re-login

---

## 🏗️ Visual Architecture

```
Browser                          Express API                      MongoDB
┌─────────┐     HTTP/JSON        ┌──────────────┐    Mongoose     ┌──────────┐
│   React   │ ──────────────────> │    app.js     │ ─────────────> │ feedback- │
│  19 +    │ <────────────────── │  (Port 5000)  │ <───────────── │ collector │
│  Vite 8  │     JWT tokens      └──────────────┘                 └──────────┘
└─────────┘                           │
  │                                   │
  ├─ Landing (/)                      ├─ /api/auth        (JWT login + refresh)
  ├─ Login (/login)                   ├─ /api/feedback    (authenticated CRUD)
  ├─ Dashboard (/dashboard)           ├─ /api/admin       (admin analytics)
  ├─ Admin Panel (/admin/*)           ├─ /api/allotments  (open/close)
  ├─ PublicFeedback (/feedback/public)  ├─ /api/public     (anonymous)
  ├─ API Docs (/api/docs)             ├─ /api/docs        (Swagger UI)
  └─ 404 (*)                          (no backend)
```

---

## 🧰 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React | ^19.2.6 |
| | React Router | ^7.17.0 |
| | Vite (build tool + dev proxy) | ^8.0.16 |
| | Axios (HTTP client) | ^1.18.0 |
| | Framer Motion (animations) | ^12.42.2 |
| | React Hook Form + Zod (form validation) | ^7.81.0 / ^4.4.3 |
| | Recharts (charts) | ^3.9.2 |
| | Sonner (toast notifications) | ^2.0.7 |
| | react-countup (animated counters) | ^6.5.3 |
| | react-helmet-async (SEO meta) | ^3.0.0 |
| | react-intersection-observer (scroll detection) | ^10.1.0 |
| | react-loading-skeleton (skeleton UI) | ^3.5.0 |
| | @tanstack/react-query (data fetching) | ^5.101.2 |
| | Lucide React (icons) | ^1.25.0 |
| **Backend** | Node.js / Express | ^4.21.0 |
| | Mongoose (ODM) | ^8.6.0 |
| | jsonwebtoken (auth + refresh tokens) | ^9.0.2 |
| | bcryptjs (password hashing) | ^2.4.3 |
| | express-rate-limit (spam prevention) | ^8.5.2 |
| | Helmet (security headers) | ^8.2.0 |
| | compression (gzip) | ^1.8.1 |
| | swagger-jsdoc + swagger-ui-express | latest |
| | pino (structured JSON logging) | ^9.14.0 |
| **Process** | PM2 (cluster mode, multi-core) | ^7.0.1 |
| **Database** | MongoDB (via Mongoose) | ^8.6.0 |
| **Testing** | Jest + Supertest | ^30.4.2 / ^7.2.2 |
| **Tooling** | ESLint (root + client + server), concurrently, Husky, lint-staged, Prettier | - |
| **CI/CD** | GitHub Actions (3 jobs: test, lint, build) | - |

---

## 📁 Project Structure

```
mern-feedback-collector/
├── .gitattributes                 # LF normalization for all text files
├── .github/workflows/ci.yml      # CI: test, lint, build on push/PR
├── .husky/pre-commit              # Pre-commit hook (lint-staged)
├── context.md                     # System context & architectural continuity
├── Dockerfile                     # Multi-stage Docker build (Node 20 Alpine)
├── LICENSE.md                     # GNU GPLv3
├── package.json                   # Root orchestration (concurrently, eslint, husky, lint-staged)
├── PRD.md                         # Product Requirements Document
├── PRIVACY.md                     # GDPR/CCPA privacy policy
├── vercel.json                    # Vercel deploy config (SPA rewrites + CSP)
│
├── client/                        # React 19 + Vite 8 SPA
│   ├── index.html                 # SEO/GEO meta, JSON-LD, preloads
│   ├── vite.config.js             # React plugin + /api proxy → :5000
│   ├── public/
│   │   ├── images/              # WebP + ICO assets (9 files)
│   │   ├── robots.txt             # AI-aware crawler directives
│   │   └── sitemap.xml            # 4-URL sitemap
│   └── src/
│       ├── App.jsx                # Route definitions + layouts
│       ├── index.css              # CSS custom properties, reset, forms
│       ├── main.jsx               # Entry point → mounts React app
│       ├── config/api.js          # Centralized API base URL
│       ├── context/AuthContext.jsx # JWT + refresh token auth state
│       ├── styles/                # 17 per-component CSS files
│       ├── utils/                 # download.js, analytics.js
│       └── components/            # 19 React components + ui/ subfolder
│
├── server/                        # Express 4.21 REST API
│   ├── .env.example               # Documented env vars (14 vars)
│   ├── eslint.config.mjs          # ESLint flat config (Node.js CommonJS)
│   ├── ecosystem.config.js        # PM2 cluster config
│   ├── app.js                     # Express app factory
│   ├── server.js                  # Entry point
│   ├── config/                    # db.js, logger.js, subjects.js, swagger.js
│   ├── middleware/                # auth.js, errorHandler.js
│   ├── models/                    # Student, Feedback, PublicFeedback, Allotment
│   ├── routes/                    # auth, feedback, admin, allotment, public
│   ├── tests/                     # Smoke tests (Jest+Supertest)
│   └── scripts/                   # 6 seed/utility scripts
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18 • **npm** >= 9 • **MongoDB** >= 6 • **Docker** (optional)

### 1. Clone & Install

```bash
npm install                     # Root (concurrently)
cd server && npm install && ..  # Backend dependencies
cd client && npm install && ..  # Frontend dependencies
```

### 2. Configure Environment

Create `server/.env` (use `server/.env.example`):

```env
MONGO_URI=mongodb://localhost:27017/feedback-collector
JWT_SECRET=your_secret_here
PORT=5000
```

### 3. Seed the Database

```bash
npm run seed       # A section - 50 students (pw: MCAA@123)
npm run seed-b     # B section - 50 students (pw: MCAB@123)
npm run seed-c     # C section - 49 students (pw: MCAC@123)
npm run seed-admin # Admin account: admin@gmail.com / iamadmin
```

### 4. Run

```bash
npm run dev    # Backend (:5000) + Frontend (:5173) concurrently
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API Health | http://localhost:5000/api/health |
| Swagger Docs | http://localhost:5000/api/docs |

### 5. Docker

```bash
docker build -t snpsu-feedback-collector .
docker run -p 5000:5000 --env-file server/.env snpsu-feedback-collector
```

### 6. Production (PM2)

```bash
cd server && npm run prod    # Cluster mode (all CPU cores)
cd client && npm run build   # Static output → client/dist/
```

---

## 📡 API Overview (20 endpoints)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | - | Health check |
| POST | `/api/auth/login` | Public (rate-limited) | Login: email + USN + password |
| POST | `/api/auth/refresh` | Public | Refresh expiring JWT |
| GET | `/api/auth/me` | JWT | Current user profile |
| GET | `/api/feedback/subjects` | JWT | Available subjects |
| GET | `/api/feedback/my` | JWT | Student's feedback history |
| POST | `/api/feedback/submit` | JWT | Submit feedback (upsert, allotment-gated) |
| GET | `/api/allotments/status` | JWT | Is a session open? |
| GET | `/api/allotments` | Admin | List all allotments |
| POST | `/api/allotments` | Admin | Open/close an allotment |
| GET | `/api/admin/classes` | Admin | Class groups |
| GET | `/api/admin/students` | Admin | Students (paginated, filterable) |
| GET | `/api/admin/feedback` | Admin | All feedbacks (paginated, filterable) |
| GET | `/api/admin/feedback/stats` | Admin | Aggregated stats |
| GET | `/api/admin/feedback/subject/:subject` | Admin | Feedbacks by subject |
| GET | `/api/admin/feedback/subject/:subject/coverage` | Admin | Gave / not-given students |
| GET | `/api/admin/db-overview` | Admin | Full database dashboard |
| GET | `/api/public/subjects` | - | Subjects for anonymous form |
| POST | `/api/public/feedback` | Public (rate-limited) | Submit anonymous feedback |
| GET | `/api/public/feedbacks` | JWT | List anonymous submissions |

---

## 🗺️ Product Roadmap (Backlog)

| Feature | Approach |
|---|---|
| **Analytics Dashboard** | Chart.js / Recharts + `/api/admin/analytics` endpoint |
| **Email Notifications** | Nodemailer + cron/webhook when windows open/close |
| **Faculty Role** | `role: 'faculty'` with read-only aggregated stats |
| **TypeScript Migration** | Full static typing across the stack |

---

## 💻 Developer Experience

```bash
cd client && npm run lint   # ESLint (react-hooks + react-refresh)
cd server && npm run lint   # ESLint (Node.js CommonJS)
npm test                     # Smoke tests (Jest + Supertest)
```

- **Pre-commit hooks**: Husky + lint-staged run automatically. Skip with `git commit --no-verify`.
- **API Docs**: Swagger UI at `/api/docs` when the server is running.
- **CI**: GitHub Actions runs test, lint, and build on every push/PR to `main`.

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (pre-commit hooks run automatically)
4. Push and open a Pull Request

---

## 🔗 Links

| Platform | URL |
|----------|-----|
| **GitHub** | [github.com/PawanSimha](https://github.com/PawanSimha) |
| **LinkedIn** | [linkedin.com/in/pawansimha](https://www.linkedin.com/in/pawansimha) |
| **X / Twitter** | [x.com/pawansimha](https://x.com/pawansimha) |
| **Google Developer** | [g.dev/pawansimha](https://g.dev/pawansimha) |
| **Google Skills Profile** | [skills.google.com/public_profiles/...](https://www.skills.google.com/public_profiles/9108dded-855b-466a-b261-0a7519d472cf) |
| **Credly Badges** | [credly.com/users/pawansimha/badges](https://www.credly.com/users/pawansimha/badges) |

---

<p align="center">
  <b>Pawan Simha R</b>
  <br />
  <sub>Built with React 19 · Vite 8 · Express 4.21 · MongoDB 8 · Mongoose 8 · Node.js · JWT · bcryptjs · Framer Motion · Recharts · Sonner · Lucide React · React Hook Form · Zod · Helmet · compression · express-rate-limit · pino · PM2 · Docker · GitHub Actions · ESLint · Husky · lint-staged · Prettier</sub>
</p>
