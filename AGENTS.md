# AGENTS.md - SOAS Feedback Collector (MERN)

## Quick-start commands

```bash
# Install dependencies (three separate npm installs required)
npm install                               # root (concurrently, husky, lint-staged)
cd server && npm install                  # Express, Mongoose, JWT, pino, pm2, swagger
cd client && npm install                  # React, Vite, Axios, react-router-dom

# Seed DB (A/B/C section + admin)
npm run seed       # A sec - 51 students, pw: MCAA@123
npm run seed-b     # B sec - 50 students, pw: MCAB@123
npm run seed-c     # C sec - 49 students, pw: MCAC@123
npm run seed-admin # admin@gmail.com / iamadmin

# Run both servers concurrently
npm run dev        # Backend :5000 + Frontend :5173

# Individual
npm run server     # Node on :5000 (from root)
cd client && npm run dev   # Vite on :5173
```

## Verification commands

```bash
npm test                     # server tests (Jest+Supertest, smoke only)
cd client && npm run build   # Vite build (must pass before deploy)
cd client && npm run lint    # ESLint (react-hooks + react-refresh)
cd server && npm run prod    # PM2 cluster mode
```

## Architecture essentials

- **CommonJS on server** (`require`), **ES Modules on client** (`import`). `type: "module"` only in `client/package.json`.
- **`server/app.js`** exports Express app; **`server/server.js`** starts it. Tests import `app.js` exclusively.
- **Vite proxy** in `vite.config.js` forwards `/api` → `localhost:5000` in dev. No CORS config needed for dev.
- **CSS custom properties** defined in `client/src/index.css`: `--primary`, `--gray-50`–`--gray-800`, `--success`, `--danger`, `--accent`. Use these instead of hardcoded hex. 16 per-component CSS files in `client/src/styles/`.
- **No TypeScript, no PropTypes.** Backend validates at route level (subject whitelist, rating range 1-5, comment length).
- **Two feedback channels**: authenticated (JWT + allotment-gated, upsert on {student + subject} compound index) vs public anonymous (rate-limited 10/15min, no `student` field, 100-300 chars always).
- **Login requires all three**: `email` (lowercased), `usn` (uppercased), `password` - bcrypt compared.
- **JWT**: 30d in `sessionStorage`, refresh token 7d in `localStorage` via `tryRefresh()`.
- **Three class groups** (hardcoded string match): `"MCA, 1st Year, 2nd Sem, A sec"` / B sec / C sec. Exact spelling everywhere.
- **Triple admin guard**: client-side `AdminRoute` redirect → server-side `protect` middleware → explicit `role !== 'admin'` check.
- **Rate limits**: login 5/15min, public POST 10/15min. Request body capped at 10kb.
- **Pagination**: `?page=1&limit=50` on admin list endpoints. Returns `{data, total, page, pages}`.

## Code conventions

- **GPLv3 header** required in every source file. Template: project name, copyright year, author name, license disclaimer.
- **BEM naming** in ~6 CSS files (CookieConsent, Footer, Landing, NotFound, PublicFeedback, Login). Others use flat classes.
- **`<main role="main">`** on public pages (Landing, Login, PublicFeedback, NotFound). Authenticated pages get `<main className="container" id="main-content">`.
- **FAQ accordion** in Landing.jsx uses CSS-only collapse (max-height/opacity). `hidden` attribute never used - content must stay in DOM for crawlers.
- **`.lean()`** on all read-only Mongoose queries.
- **`next(error)`** for async error delegation; **`errorHandler.js`** middleware logs via pino.
- **6 admin components** lazy-loaded via `React.lazy` + `Suspense`.

## Context & entry points

- `context.md` - absolute source of truth for architectural continuity across sessions
- `server/app.js` - route mounts, middleware chain (Helmet, compression, pino-http, CORS, 10kb limit)
- `client/src/App.jsx` - route tree (public / protected / admin / 404), layout composition
- `client/src/context/AuthContext.jsx` - login/logout/refresh/tryRefresh
- `client/src/config/api.js` - `VITE_API_URL` env var with `localhost:5000/api` fallback

## Environment (`server/.env`)

Key vars: `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `ADMIN_EMAIL`/`ADMIN_PASSWORD` (for seed). See `server/.env.example`.

## CI / pre-commit

- GitHub Actions: test (server jest), lint (client eslint), build (client vite) on push/PR to `main`.
- Husky + lint-staged runs ESLint + Prettier pre-commit. Bypass with `git commit --no-verify`.
