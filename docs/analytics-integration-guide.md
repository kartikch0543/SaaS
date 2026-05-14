# Analytics Integration Guide

## GA4

Set `VITE_GA_MEASUREMENT_ID` on the frontend. The React app initializes GA4 through `react-ga4` in [frontend/src/lib/analytics.js](/c:/Users/VICTUS/Desktop/SaaS/frontend/src/lib/analytics.js) before render in [frontend/src/main.jsx](/c:/Users/VICTUS/Desktop/SaaS/frontend/src/main.jsx).

Tracked automatically:

- SPA page views for route changes through [frontend/src/hooks/usePageTracking.js](/c:/Users/VICTUS/Desktop/SaaS/frontend/src/hooks/usePageTracking.js)
- dynamic article pages
- roadmap generator visits
- viva generator visits

Tracked as custom events:

- `generate_roadmap_requested`
- `generate_roadmap_succeeded`
- `generate_roadmap_failed`
- `generate_viva_requested`
- `generate_viva_succeeded`
- `generate_viva_failed`
- `retry_generation_clicked`

The analytics utility guards against duplicate initialization and duplicate page-view hits in React Strict Mode.

## Microsoft Clarity

Set `VITE_CLARITY_PROJECT_ID` and `CLARITY_PROJECT_ID`. The frontend injects the Clarity tag and the backend reflects integration state in the admin report.

## Search Console

Set `VITE_SEARCH_CONSOLE_VERIFICATION` for site verification meta usage when you add it to the head layer, and set `SEARCH_CONSOLE_SITE_URL` on the backend for admin reporting state.

## Admin Reporting

The backend endpoint `/api/admin/analytics/overview` returns a combined overview designed for dashboard cards and keyword/top-page tables.

## Current Tracking Surface

- Client-side page view tracking via route change hook
- AI interaction tracking for roadmap and viva flows
- Clarity tag injection when configured
- backend dashboard overview cards for sessions, page views, CTR, and keyword impressions

## Verification Checklist

1. Add `VITE_GA_MEASUREMENT_ID=G-T3S22L16MS` in Vercel for the frontend project.
2. Deploy the frontend.
3. Open GA4 Realtime and load the site.
4. Visit `/`, `/roadmap-generator`, `/viva-prep`, and one blog slug page.
5. Generate one roadmap and one viva pack.
6. Confirm the events appear in Realtime and DebugView.

Useful checks:

- page views should appear once per route change
- roadmap and viva events should include the selected topic
- retry clicks should appear only when the retry button is used
- no events should fire when `VITE_GA_MEASUREMENT_ID` is missing

## Analytics + SEO Strategy

GA4 supports content and SEO analysis by helping the team answer:

- which study pages attract the most visits
- which SEO-focused blog pages hold attention best
- whether roadmap and viva tools drive deeper engagement
- which AI interactions lead users toward return visits and dashboard usage

Search Console remains the source of truth for impressions and query performance, while GA4 explains engagement after a user lands on the site.
