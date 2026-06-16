
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

The system supports authenticated student feedback with per-session allotments, a public anonymous feedback channel (no login required), and comprehensive admin tools including CSV/Word report exports.

---

## Key Features

### User Features
- **Student Dashboard** -- View active feedback allotments and submit ratings/comments per subject
- **Feedback History** -- Browse all previously submitted feedback across subjects
- **Public Anonymous Feedback** -- Submit feedback without logging in; select subject, optionally name faculty, and write comments (100--300 chars)

### Admin Features
- **Class Management** -- View all class groups and drill into student-level details
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
  └─ PublicFeedback (/feedback/pub)   └─ /api/public (anonymous)
```

---

## Tech Stack

| Layer        | Technology                              | Version   |
| ------------ | --------------------------------------- | --------- |
| **Frontend** | React                                   | ^19.2.6   |
|              | React Router (declarative routing)      | ^7.17.0   |
|              | Vite (build tool & dev server)          | ^8.0.12   |
|              | Axios (HTTP client)                     | ^1.18.0   |
| **Backend**  | Node.js / Express                       | ^4.21.0   |
|              | Mongoose (ODM)                          | ^8.6.0    |
|              | JSON Web Token (auth)                   | ^9.0.2    |
|              | bcryptjs (password hashing)             | ^2.4.3    |
| **Database** | MongoDB                                 | (via Mongoose) |
| **Tooling**  | Vite ESLint plugin, concurrently        |           |

---

## Project Structure

```
mern-feedback-collector/
├── client/                          # React + Vite frontend
│   ├── public/                      # Static assets
│   │   ├── images/                  # WebP image assets (converted from PNG/JPG)
│   ├── src/
│   │   ├── components/              # 15 React components
│   │   │   ├── Landing.jsx          # Public landing page
│   │   │   ├── Login.jsx            # Auth login form
│   │   │   ├── Dashboard.jsx        # Student dashboard
│   │   │   ├── FeedbackForm.jsx     # Student feedback submission
│   │   │   ├── MyFeedback.jsx       # Feedback history
│   │   │   ├── PublicFeedback.jsx   # Anonymous (no login) feedback
│   │   │   ├── Footer.jsx           # Shared site footer
│   │   │   ├── Navbar.jsx           # Auth-aware navigation
│   │   │   └── admin/               # Admin components
│   │   │       ├── AdminClassSelect.jsx
│   │   │       ├── AdminStudents.jsx
│   │   │       ├── AdminStudentFeedback.jsx
│   │   │       ├── AdminAllotments.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminDbOverview.jsx
│   │   │       └── AdminAnonymous.jsx
│   │   ├── context/AuthContext.jsx   # Global auth state (JWT)
│   │   ├── utils/download.js        # CSV & Word export helpers
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # Entry point (BrowserRouter)
│   │   └── index.css                # Global styles (~3300 lines)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                          # Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── subjects.js              # Subject list constant
│   ├── middleware/auth.js            # JWT protect middleware
│   ├── models/
│   │   ├── Student.js               # User model (student/admin)
│   │   ├── Feedback.js              # Authenticated feedback
│   │   ├── PublicFeedback.js        # Anonymous feedback
│   │   └── Allotment.js             # Session allotments
│   ├── routes/
│   │   ├── auth.js                  # POST /login, GET /me
│   │   ├── feedback.js              # CRUD for authenticated feedback
│   │   ├── admin.js                 # Admin analytics & overview
│   │   ├── allotment.js             # Open/close feedback windows
│   │   └── public.js                # Anonymous feedback endpoints
│   ├── scripts/seed.js              # DB seeder (50+ students)
│   ├── server.js                    # Express app entry
│   ├── .env                         # Environment config
│   └── package.json
├── package.json                     # Root orchestration (concurrently)
├── LICENSE.md                       # GNU General Public License v3.0
├── PRD.md                           # Product Requirements Document
└── README.md
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
| POST   | `/api/public/feedback`         | Public   | Submit anonymous feedback              |
| GET    | `/api/public/subjects`         | Public   | List available subjects                |
| GET    | `/api/public/feedbacks`        | JWT      | List all anonymous feedbacks (admin)   |
| POST   | `/api/feedback`                | JWT      | Submit authenticated feedback          |
| GET    | `/api/admin/db-overview`       | Admin    | Full database statistics & collections |
| GET    | `/api/admin/feedback/stats`    | Admin    | Aggregated feedback statistics         |
| GET    | `/api/allotments`              | JWT      | List current allotments by class       |

---

## Product Roadmap

- **Analytics Dashboard** -- Visual charts (submission rates, sentiment trends) using Chart.js or Recharts
- **Email Notifications** -- Automated reminders when a feedback window opens/closes
- **Multi-Role Expansion** -- Faculty view with per-subject aggregated reports (no individual identity)

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
