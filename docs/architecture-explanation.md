# Architecture Explanation

## Product Shape

StudyForge AI is built as a small monorepo with two deployable applications:

- `frontend`: Vite + React application deployed to Vercel
- `backend`: Express API deployed to Render

The frontend is responsible for product UI, route-level SEO metadata, analytics tags, theme handling, and Firebase client authentication. The backend is responsible for session token issuance, protected dashboard endpoints, seeded or database-backed content APIs, analytics reporting, and operational middleware.

## Frontend Design System

The UI uses a token-driven theme system:

- Tailwind `dark` class strategy
- CSS variables for semantic colors
- reusable surface, panel, and field classes
- persistent theme preference stored in `localStorage`

This keeps dark mode consistent across cards, forms, charts, navigation, footers, and article content.

## SEO Architecture

SEO is integrated directly into the product routes rather than separated into a dedicated library page.

- Dynamic article routes are served through `/:slug`
- Each article includes title tags, descriptions, canonical URLs, breadcrumb markup, FAQ schema, and article schema
- Ranking pages are connected through footer navigation, related-reading blocks, and homepage content cards
- `robots.txt` and `sitemap.xml` are included in `frontend/public`

## Content and Data Flow

- Seed content lives in `backend/src/utils/seedData.js`
- Public routes fetch article summaries and article detail content from `/api/blogs`
- Tool pages call `/api/ai/viva` and `/api/ai/roadmap`
- Protected dashboard pages call `/api/dashboard` and `/api/admin/analytics/overview`

## Auth Flow

1. User signs in with Firebase on the frontend.
2. Frontend sends the Firebase ID token to `/api/auth/session`.
3. Backend returns an app JWT for protected API requests.
4. Protected dashboard and analytics routes validate the bearer token.
