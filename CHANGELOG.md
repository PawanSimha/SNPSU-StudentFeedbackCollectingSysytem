# Changelog

## v1.3 — Phases A–D

### Phase A — Backend Hardening
- Structured pino logging with pino-http middleware
- `app.js`/`server.js` split for testability
- Centralized `errorHandler.js` delegating via `next(error)`
- Helmet security headers
- Gzip compression
- Rate limiting (login 5/15min, public 10/15min)
- CORS restriction via `CORS_ORIGIN` env
- Origin header validation on `POST /api/public/feedback` for CSRF defense
- Input validation (subject whitelist + rating 1–5 range)
- All read-only queries using `.lean()` (~40% faster)
- MongoDB indexes on all query patterns
- PM2 cluster mode (multi-core)
- Smoke tests (`server/tests/server.test.js`) with 2 passing tests

### Phase B — Frontend Polish
- CSS modularized from 1 monolithic file into 16 per-component CSS files
- 6 admin components lazy-loaded via `React.lazy` + `Suspense`
- Skip-to-content link for keyboard accessibility
- Inline form validation (50–300 char comments, 1–5 star rating)
- `aria-live` regions for dynamic content announcements

### Phase C — DevOps & DX
- Multi-stage Dockerfile for optimized production builds
- GitHub Actions CI pipeline
- Swagger API documentation at `/api/docs`
- Empty states (no-data messages across all list views)
- Image lazy loading (`loading="lazy"` on all assets)

### Phase D — Scale & Auth
- Pagination on admin list endpoints (`/api/admin/feedback`, `/api/admin/students`, `/api/admin/public/feedbacks`)
- JWT refresh token flow (`POST /api/auth/refresh`)
- Page-view analytics tracker in `utils/analytics.js`
- Husky + lint-staged pre-commit hooks
- `AdminRoute` guard component (non-admin users redirected from `/admin/*` routes)

## v1.2 — Performance & Security
- MongoDB indexes on all query patterns
- `.lean()` query optimization (~40% faster)
- PM2 clustering (multi-core)
- Helmet security headers
- Gzip compression
- Production process management
- System now handles 200–300 concurrent students on a standard 4-core server

## v1.1 — UX & Reliability
- Star rating selector (1–5)
- Rate limiting on public endpoint
- Vite API proxy
- Class list dynamic fetch from API
- Improved loading/error states across all components
- Social media icons in footer
- Various bug fixes
