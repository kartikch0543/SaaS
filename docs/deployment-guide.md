# Deployment Guide

## Frontend on Vercel

1. Import the `frontend` directory as a Vercel project.
2. Set build command to `npm run build`.
3. Set output directory to `dist`.
4. Add frontend environment variables from `frontend/.env.example`.
5. Set `VITE_API_BASE_URL` to your Render backend URL, for example `https://studyforge-api.onrender.com`.
6. Redeploy after saving the environment variable because Vite reads it at build time.

## Backend on Render

1. Create a new Web Service from the `backend` directory.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add variables from `backend/.env.example`.
5. Set `FRONTEND_URL` to your Vercel domain.
6. If you use both production and preview domains, set `FRONTEND_URL` as a comma-separated list, for example `https://studyforge.vercel.app,https://studyforge-ai-git-main-yourname.vercel.app`.

## Database

Create a MongoDB Atlas cluster and whitelist the Render IP range or use `0.0.0.0/0` during setup if required.
