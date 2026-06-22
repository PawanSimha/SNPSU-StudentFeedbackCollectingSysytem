# SOAS Feedback Collector: Frontend

React 19 + Vite 8 SPA. See the [root README](../README.md) for full project setup.

## Commands

```bash
npm run dev       # Start Vite dev server (port 5173)
npm run build     # Production build -> client/dist/
npm run lint      # ESLint
```

## Routing (React Router 7)

- `/`: Landing page
- `/login`: Student/admin login
- `/feedback/public`: Anonymous feedback
- `/dashboard`: Student dashboard
- `/feedback`: Feedback submission form
- `/my-feedback`: Feedback history
- `/admin`: Admin class selection
- `/admin/allotments`: Open/close feedback windows
- `/admin/database`: Collection overview
- `/admin/anonymous`: Anonymous feedbacks view
- `/admin/:classGroup`: Student list per class
- `/admin/:classGroup/student/:studentId`: Individual feedback
- `*`: Branded 404 page

## Asset Notes

- All raster images stored as **WebP** (quality 85) in `public/images/`
- Favicon: `favicon.ico` | Navbar logo: `navbar-logo.webp` | Footer: `footer-logo.webp`
- Root `vercel.json` for deployment security headers

## Tech

React 19, React Router 7, Vite 8, Axios, CSS custom properties (no framework).
