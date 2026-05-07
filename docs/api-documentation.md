# API Documentation

## Public Endpoints

- `GET /health`
- `GET /api/blogs`
- `GET /api/blogs/:slug`
- `POST /api/ai/viva`
- `POST /api/ai/roadmap`
- `POST /api/auth/session`

## Protected Endpoints

- `GET /api/dashboard`
- `GET /api/admin/analytics/overview`

## Auth Flow

1. Authenticate with Firebase on the client.
2. Send Firebase ID token to `/api/auth/session`.
3. Store returned JWT and send it as `Authorization: Bearer <token>`.
