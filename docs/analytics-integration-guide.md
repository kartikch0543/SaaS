# Analytics Integration Guide

## GA4

Set `VITE_GA_MEASUREMENT_ID` on the frontend and `GOOGLE_ANALYTICS_ID` on the backend. Frontend page views are tracked through the `trackPageView` helper.

## Microsoft Clarity

Set `VITE_CLARITY_PROJECT_ID` and `CLARITY_PROJECT_ID`. The frontend injects the Clarity tag and the backend reflects integration state in the admin report.

## Search Console

Set `VITE_SEARCH_CONSOLE_VERIFICATION` for site verification meta usage when you add it to the head layer, and set `SEARCH_CONSOLE_SITE_URL` on the backend for admin reporting state.

## Admin Reporting

The backend endpoint `/api/admin/analytics/overview` returns a combined overview designed for dashboard cards and keyword/top-page tables.
