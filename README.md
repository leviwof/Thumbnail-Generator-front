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

## Notes

- `VITE_API_BASE_URL` must point to the deployed backend, not `/api`.
- `vercel.json` is included so direct refreshes on routes like `/upload` or `/videos/:id` resolve to `index.html`.
- If you deploy somewhere other than Vercel, configure the same SPA fallback in that platform.
