# Setup Guide

## Local Development

1. Install Node.js 20+ and npm 10+.
2. Run `npm install` from the repository root.
3. Configure Firebase client credentials in `frontend/.env`.
4. Configure MongoDB, Firebase Admin, JWT, and optional analytics keys in `backend/.env`.
5. Start the API with `npm run dev:backend`.
6. Start the frontend with `npm run dev:frontend`.

## Required Secrets

- MongoDB URI
- Firebase client config
- Firebase Admin private key values for backend token verification
- JWT secret

## Optional Secrets

- Google Analytics measurement ID
- Microsoft Clarity project ID
- Search Console site URL verification token
- Cloudinary credentials
