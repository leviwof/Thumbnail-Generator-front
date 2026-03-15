# Frontend Deployment

This folder is ready to be pushed as its own repo.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Required environment variables

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_API_BASE_URL=https://your-api-domain.com
```

For the Railway backend use:
```bash
VITE_API_BASE_URL=https://thumbnail-generator-backend-production.up.railway.app
```

## Checking the backend (Railway)

To verify the backend is up:

1. **Browser:** Open [https://thumbnail-generator-backend-production.up.railway.app/api/health](https://thumbnail-generator-backend-production.up.railway.app/api/health). You should see `{"status":"ok"}`.
2. **PowerShell:** `Invoke-RestMethod -Uri "https://thumbnail-generator-backend-production.up.railway.app/api/health"`

If the first request is slow, Railway may be waking the service (cold start).

**CORS:** The backend only allows requests from origins in `CLIENT_URLS`. In the Railway dashboard, set `CLIENT_URLS` to your frontend URL(s), e.g. `https://your-app.vercel.app` or `http://localhost:5173` for local dev. Multiple origins: `https://app.com,http://localhost:5173`.

## Notes

- `VITE_API_BASE_URL` must point to the deployed backend, not `/api`.
- `vercel.json` is included so direct refreshes on routes like `/upload` or `/videos/:id` resolve to `index.html`.
- If you deploy somewhere other than Vercel, configure the same SPA fallback in that platform.
