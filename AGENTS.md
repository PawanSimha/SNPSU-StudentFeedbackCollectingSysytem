# AGENTS.md - SOAS Feedback Collector (MERN)

## Quick-start commands

```bash
# Install dependencies (three separate npm installs required)
npm install                               # root (concurrently, husky, lint-staged, prettier, eslint)
cd server && npm install                  # Express, Mongoose, JWT, pino, pm2, swagger
cd client && npm install                  # React, Vite, Axios, react-router-dom, framer-motion

# Seed DB (A/B/C section + admin)
npm run seed       # A sec - 50 students, pw: MCAA@123
npm run seed-b     # B sec - 50 students, pw: MCAB@123
npm run seed-c     # C sec - 49 students, pw: MCAC@123
npm run seed-admin # admin@gmail.com / iamadmin

# Run both servers concurrently
npm run dev        # Backend :5000 + Frontend :5173

# Individual
npm run server     # Node on :5000 (from root, no nodemon)
cd client && npm run dev   # Vite on :5173
```

## Verification commands

```bash
npm test                     # server tests (Jest+Supertest, smoke only)
cd client && npm run build   # Vite build (must pass before deploy)
cd client && npm run lint    # ESLint (react-hooks + react-refresh)
cd server && npm run lint    # ESLint (Node.js CommonJS, flat config)
cd server && npm run prod    # PM2 cluster mode
```

## Architecture essentials

- **CommonJS on server** (`require`), **ES Modules on client** (`import`). `type: "module"` only in `client/package.json`.
- **`server/app.js`** exports Express app; **`server/server.js`** starts it. Tests import `app.js` exclusively.
- **Vite proxy** in `vite.config.js` forwards `/api` → `localhost:5000` in dev. No CORS config needed for dev.
- **`client/src/config/api.js`** exports `API` (URL string) and `apiClient` (axios instance with 10s timeout, JSON Content-Type). `AuthContext` uses `apiClient` for all calls; `setAuthHeader()` / `clearAuthHeader()` sync auth token on both `apiClient.defaults` and global `axios.defaults` so components that import bare `axios` (Dashboard) work too.
- **CSS custom properties** defined in `client/src/index.css`: `--primary`, `--gray-50`–`--gray-800`, `--success`, `--danger`, `--accent`, `--color-white/black`, `--font-heading/font-body`, `--radius-*`, `--shadow-*`, `--space-*` (8-step 4px grid), `--fs-*` (type scale), `--z-*` (z-index layers), `--transition`. Use these instead of hardcoded values. 17 per-component CSS files in `client/src/styles/`.
- **No TypeScript, no PropTypes.** Backend validates at route level (subject whitelist, comment length).
- **Two feedback channels**: authenticated (JWT + allotment-gated, upsert on {student + subject} compound index) vs public anonymous (rate-limited 10/15min, no `student` field, 100-300 chars always).
- **Login requires all three**: `email` (lowercased), `usn` (uppercased), `password` - bcrypt compared. Login form uses React Hook Form + Zod for client-side validation (`onBlur` mode).
- **JWT**: 30d access token in `sessionStorage`, 7d refresh token in `localStorage` via `tryRefresh()`. Refresh token signed/verified with separate `REFRESH_TOKEN_SECRET` (falls back to `JWT_SECRET`). No axios 401 interceptor; tokens must be refreshed at app init.
- **Three class groups** (hardcoded string match): `"MCA, 1st Year, 2nd Sem, A sec"` / B sec / C sec. Exact spelling everywhere. No schedule tabs in AdminAllotments (no backend support).
- **Triple admin guard**: client-side `AdminRoute` redirect → server-side `protect` middleware → explicit `role !== 'admin'` check.
- **Rate limits**: login 5/15min, public POST 10/15min, refresh 10/1min. Request body capped at 10kb.
- **Pagination**: `?page=1&limit=50` on admin list endpoints. Returns `{data, total, page, pages}`.
- **Allotment model**: compound index `{ classGroup: 1, isOpen: 1 }` for O(1) status lookups.
- **Seed hashing**: per-user bcrypt hash via `Promise.all(map(async...))` (unique hashes per student, not shared).
- **snpsu.bat**: auto-cleans orphaned port 5000 via `netstat`+`taskkill`, verifies MongoDB via Node.js mongoose ping, opens browser after server starts.

## Code conventions

- **GPLv3 header** required in every source file. Template: project name, copyright year, author name, license disclaimer.
- **BEM naming** in ~11 CSS files (CookieConsent, Footer, Landing, NotFound, PublicFeedback, Login, AdminAllotments, AdminClassSelect, AdminDbOverview, AdminTable, Navbar). Older files (AdminDashboard, AdminStudentFeedback, AdminStudents, FeedbackForm, MyFeedback) use flat classes.
- **Enterprise design system**: 8px spacing grid, 10–16px border-radii, Lucide React icons, Framer Motion animations (entrance/exit variants), Sonner toast notifications, Recharts (PieChart, BarChart), CountUp counters for stat cards.
- **`<main role="main">`** on public pages (Landing, Login, PublicFeedback, NotFound). Authenticated pages get `<main className="container" id="main-content">`.
- **FAQ accordion** in Landing.jsx uses React state toggle with CSS max-height/opacity animation. `hidden` attribute never used - content stays in DOM for crawlers.
- **`.lean()`** on all read-only Mongoose queries.
- **`next(error)`** for async error delegation; **`errorHandler.js`** middleware logs via pino.
- **7 admin components** lazy-loaded via `React.lazy` + `Suspense`: AdminClassSelect, AdminDashboard, AdminStudents, AdminStudentFeedback, AdminAllotments, AdminDbOverview, AdminAnonymous.
- **React 19 lint rule**: `react-hooks/set-state-in-effect` forbids `setState` calls in `useEffect` body. All data fetching uses `.then()` callbacks outside the effect function.
- **Focus styling**: Single border-color change on focus (`1.5px → var(--primary)`). No `box-shadow: 0 0 0 3px` rings. Inputs override global `input:focus-visible` with `outline: none` since parent container handles focus.

## Context & entry points

- `context.md` - absolute source of truth for architectural continuity across sessions
- `server/app.js` - route mounts, middleware chain (Helmet, compression, pino-http, CORS, 10kb limit)
- `client/src/App.jsx` - route tree (public / protected / admin / 404), layout composition
- `client/src/context/AuthContext.jsx` - login/logout/refresh/tryRefresh
- `client/src/config/api.js` - `VITE_API_URL` env var with `localhost:5000/api` fallback, exports `API` string + `apiClient` axios instance
- `client/vite.config.js` - `@/` path alias configured via `resolve.alias` → `./src`

## Environment (`server/.env`)

Key vars: `MONGO_URI`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `CORS_ORIGIN`, `ADMIN_EMAIL`/`ADMIN_PASSWORD` (for seed). See `server/.env.example` (15 vars total).

## CI / pre-commit

- GitHub Actions: test (server jest), lint (client eslint + server eslint), build (client vite) on push/PR to `main`.
- Husky + lint-staged runs ESLint + Prettier pre-commit. Bypass with `git commit --no-verify`. Client uses flat config (`client/eslint.config.js`), server uses flat config (`server/eslint.config.mjs`).
