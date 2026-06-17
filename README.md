
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

> **v1.1 updates:** Added star rating selector (1–5), rate limiting on public endpoint, Vite API proxy, class list dynamic fetch from API, improved loading/error states across all components, social media icons in footer, and various bug fixes.

The system supports authenticated student feedback with per-session allotments, a public anonymous feedback channel (no login required), and comprehensive admin tools including CSV/Word report exports.

---

## Key Features

### User Features
- **Star Rating**: Visual 1–5 star selector for per-subject ratings in the feedback form
- **Student Dashboard**: View active feedback allotments and submit ratings/comments per subject
- **Feedback History**: Browse all previously submitted feedback across subjects
- **Public Anonymous Feedback**: Submit feedback without logging in; select subject, optionally name faculty, and write comments (100-300 chars) — rate-limited to 10 submissions per 15 minutes

### Admin Features
- **Class Management** -- View all class groups (fetched dynamically from API) and drill into student-level details
- **Allotment System** -- Open/close feedback windows for specific class groups with custom messages
- **Database Overview** -- Unified view of all students, feedbacks (per-subject stats), allotments, and anonymous submissions
- **Anonymous Feedbacks** -- Review, search, and filter all public submissions
- **Report Exports** -- Download feedback data as CSV (Excel) or Word `.doc` files
- **Subject Management** -- Pre-configured subject list shared across the system

---

## Visual Architecture

```
Browser                          Express API                      MongoDB
┌─────────┐     HTTP/JSON        ┌──────────────┐    Mongoose     ┌──────────┐
│  React   │ ──────────────────> │   server.js   │ ─────────────> │ feedback- │
│  19 +    │ <────────────────── │  (Port 5000)  │ <───────────── │ collector │
│  Vite 8  │     JWT tokens      └──────────────┘                 └──────────┘
└─────────┘                           │
  │                                   │
  ├─ Landing (/)                      ├─ /api/auth (JWT login)
  ├─ Login (/login)                   ├─ /api/feedback (CRUD)
  ├─ Dashboard (/dashboard)           ├─ /api/admin (admin ops)
  ├─ Admin Panel (/admin/*)           ├─ /api/allotments (open/close)
  ├─ PublicFeedback (/feedback/pub)   ├─ /api/public (anonymous)
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
|              | JSON Web Token (auth)                   | ^9.0.2    |
|              | bcryptjs (password hashing)             | ^2.4.3    |
|              | express-rate-limit (spam prevention)     | (latest)  |
| **Database** | MongoDB                                 | (via Mongoose) |
| **Tooling**  | Vite ESLint plugin, concurrently        |           |

---

## Project Structure

```
mern-feedback-collector/
├── .gitignore                       # Ignores node_modules, .env, dist, etc.
├── context.md                       # System context cross-session continuity
├── LICENSE.md                       # GNU General Public License v3.0
├── package.json                     # Root orchestration (concurrently)
├── PRD.md                           # Product Requirements Document
├── PRIVACY.md                       # GDPR/CCPA privacy policy
├── README.md                        # Project overview (this file)
├── vercel.json                      # Vercel deploy config: rewrites + CSP
│
├── client/                          # React + Vite frontend
│   ├── .gitignore
│   ├── eslint.config.js             # ESLint flat config
│   ├── index.html                   # SPA shell with SEO/GEO meta
│   ├── package.json
│   ├── vite.config.js             # Vite config + API proxy (/api → :5000)
│   ├── public/                      # Static assets
│   │   ├── images/                  # WebP image assets (6 files)
│   │   ├── robots.txt               # AI-aware crawler directives
│   │   ├── sitemap.xml              # 10-URL sitemap
│   │   └── icons.svg                # SVG icon sprite
│   └── src/
│       ├── main.jsx                 # Entry point (BrowserRouter)
│       ├── App.jsx                  # Route definitions + layouts
│       ├── index.css                # Global styles (~3680 lines)
│       ├── config/
│       │   └── api.js               # Centralized API base URL
│       ├── context/
│       │   └── AuthContext.jsx       # Global auth state (JWT)
│       ├── utils/
│       │   └── download.js          # CSV & Word export helpers
│       └── components/              # 17 React components
│           ├── admin/               # Admin sub-components (7)
│           │   ├── AdminAllotments.jsx
│           │   ├── AdminAnonymous.jsx
│           │   ├── AdminClassSelect.jsx
│           │   ├── AdminDashboard.jsx
│           │   ├── AdminDbOverview.jsx
│           │   ├── AdminStudentFeedback.jsx
│           │   └── AdminStudents.jsx
│           ├── CookieConsent.jsx    # GDPR banner with Accept/Decline
│           ├── Dashboard.jsx        # Student dashboard
│           ├── FeedbackForm.jsx     # Feedback submission form
│           ├── Footer.jsx           # Shared site footer
│           ├── Landing.jsx          # Public landing page
│           ├── Login.jsx            # Auth login form
│           ├── MyFeedback.jsx       # Feedback history
│           ├── Navbar.jsx           # Auth-aware navigation
│           ├── NotFound.jsx         # Branded 404 (compass, CTAs)
│           └── PublicFeedback.jsx   # Anonymous (no login) feedback
│
├── server/                          # Express backend
│   ├── .env                         # Environment config (gitignored)
│   ├── package.json
│   ├── server.js                    # Express app entry (port 5000, body limit 10kb, 404 handler)
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── subjects.js              # 6-subject constant
│   ├── middleware/
│   │   └── auth.js                  # JWT protect middleware
│   ├── models/
│   │   ├── Student.js               # User model (student/admin)
│   │   ├── Feedback.js              # Authenticated feedback
│   │   ├── PublicFeedback.js        # Anonymous feedback
│   │   └── Allotment.js             # Session allotments
│   ├── routes/
│   │   ├── auth.js                  # POST /login, GET /me
│   │   ├── feedback.js              # Authenticated feedback CRUD
│   │   ├── admin.js                 # Admin analytics & overview
│   │   ├── allotment.js             # Open/close feedback windows
│   │   └── public.js                # Anonymous feedback endpoints
│   └── scripts/
│       ├── seed.js                  # DB seeder (51 students)
│       ├── seed-admin.js            # Admin user seeder
│       ├── seed-b.js                # Additional student seeder
│       ├── update-classes.js        # Bulk class reassignment
│       └── update-roles.js          # Bulk role update
```

---

## Quick Start

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9
- **MongoDB** >= 6 (local or Atlas URI)

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

Edit `server/.env` (provided; modify as needed):

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

### 4. Run the Application

Starts both backend (port 5000) and frontend (port 5173) concurrently:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

---

## API Overview

| Method | Endpoint                       | Auth     | Description                            |
| ------ | ------------------------------ | -------- | -------------------------------------- |
| POST   | `/api/auth/login`              | Public   | Student/admin login (email + USN + pw) |
| GET    | `/api/auth/me`                 | JWT      | Return current user profile            |
| POST   | `/api/public/feedback`         | Public   | Submit anonymous feedback (rate-limited: 10/15min) |
| GET    | `/api/public/subjects`         | Public   | List available subjects                |
| GET    | `/api/public/feedbacks`        | JWT      | List all anonymous feedbacks (admin)   |
| POST   | `/api/feedback/submit`         | JWT      | Submit authenticated feedback          |
| GET    | `/api/admin/db-overview`       | Admin    | Full database statistics & collections |
| GET    | `/api/admin/feedback/stats`    | Admin    | Aggregated feedback statistics         |
| GET    | `/api/allotments`              | JWT      | List current allotments by class       |

---

## Product Roadmap

- **Analytics Dashboard**: Visual charts (submission rates, sentiment trends) using Chart.js or Recharts
- **Email Notifications**: Automated reminders when a feedback window opens/closes
- **Multi-Role Expansion**: Faculty view with per-subject aggregated reports (no individual identity)

---

## Developer Experience

### Linting

```bash
cd client && npm run lint
```

### Building for Production

```bash
cd client && npm run build
# Output: client/dist/
```

### Testing

No test framework is currently configured. Contributions to add unit/integration tests (Vitest or Jest) are welcome.

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE.md](./LICENSE.md) file for details.

&copy; 2026 Pawan Simha R. All rights to the source code are granted under the terms of the GPLv3.
