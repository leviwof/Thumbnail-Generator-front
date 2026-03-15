# 🎨 Thumbnail Generator & Video Gallery — Client

A modern, responsive React single-page application for uploading videos, generating
and selecting thumbnails, and browsing a curated video gallery with search, tag-based
filtering, and Clerk-powered authentication.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Client](#running-the-client)
- [Pages & Routing](#pages--routing)
- [Components](#components)
  - [Layout & Navigation](#layout--navigation)
  - [Video Components](#video-components)
  - [Authentication Components](#authentication-components)
  - [Utility Components](#utility-components)
- [API Layer](#api-layer)
  - [HTTP Client Configuration](#http-client-configuration)
  - [API Functions](#api-functions)
- [React Query Hooks](#react-query-hooks)
- [Authentication (Clerk)](#authentication-clerk)
  - [Setup](#setup)
  - [Auth Flow](#auth-flow)
  - [Protected Routes](#protected-routes)
- [Styling & Design System](#styling--design-system)
  - [TailwindCSS Configuration](#tailwindcss-configuration)
  - [Typography](#typography)
  - [Brand Colors](#brand-colors)
- [Utility Functions](#utility-functions)
- [Vite Configuration](#vite-configuration)
  - [Dev Server Proxy](#dev-server-proxy)
- [Build & Deployment](#build--deployment)
  - [Building for Production](#building-for-production)
  - [Deploying to Vercel](#deploying-to-vercel)
  - [Deploying to Other Platforms](#deploying-to-other-platforms)
- [Known Trade-offs & Limitations](#known-trade-offs--limitations)
- [Scripts](#scripts)
- [License](#license)

---

## Tech Stack

| Component           | Technology                    | Version |
|---------------------|-------------------------------|---------|
| UI Library          | React                         | 19      |
| Build Tool          | Vite                          | 6       |
| Styling             | TailwindCSS                   | 3.4     |
| Routing             | React Router DOM              | 7       |
| Server State        | TanStack React Query          | 5       |
| HTTP Client         | Axios                         | 1.7     |
| Authentication      | Clerk React SDK               | 6       |
| CSS Processing      | PostCSS + Autoprefixer        | —       |

---

## Architecture Overview

The client follows a modular, feature-organized architecture:

```
User Interaction
    │
    ▼
  Pages               → Full route-level views (Gallery, Upload, VideoDetail, Auth)
    │
    ▼
  Components           → Reusable UI building blocks
    │
    ▼
  Hooks (React Query)  → Data fetching, mutations, cache invalidation
    │
    ▼
  API Layer            → Axios HTTP calls to the backend
    │
    ▼
  Backend Server       → Express API (separate process)
```

**Key patterns:**
- **React Query** manages all server state — no manual `useEffect` + `useState` for data fetching.
- **Automatic cache invalidation** — after mutations (upload, delete, generate thumbnails), related queries are automatically refetched.
- **Clerk** handles authentication — sign-in, sign-up, and user session management are fully delegated to Clerk's hosted components.
- **Toast notifications** — a custom `ToastProvider` provides app-wide success/error/info notifications.

---

## Project Structure

```
client/
├── .env                          # Environment variables (git-ignored)
├── .gitignore
├── index.html                    # HTML entry point with meta tags & Google Fonts
├── package.json
├── postcss.config.cjs            # PostCSS plugins (TailwindCSS + Autoprefixer)
├── tailwind.config.js            # TailwindCSS theme customization
├── vercel.json                   # Vercel SPA routing configuration
├── vite.config.js                # Vite dev server + proxy configuration
├── dist/                         # Production build output (git-ignored)
└── src/
    ├── main.jsx                  # App entry — provider tree (Clerk, React Query, Router, Toast)
    ├── App.jsx                   # Route definitions
    ├── index.css                 # Global styles + Tailwind directives
    ├── api/
    │   ├── http.js               # Axios instance with base URL + default timeout
    │   └── videos.js             # All video/thumbnail API call functions
    ├── components/
    │   ├── Layout.jsx            # App shell — header, navigation, footer
    │   ├── SearchBar.jsx         # Search input with query state
    │   ├── VideoCard.jsx         # Gallery card with thumbnail + metadata
    │   ├── VideoUploadForm.jsx   # Multi-field upload form with drag & drop
    │   ├── ThumbnailGrid.jsx     # Grid display of thumbnails with selection
    │   ├── AuthControls.jsx      # Sign-in/sign-out buttons and user avatar
    │   ├── AuthPageShell.jsx     # Wrapper layout for auth pages
    │   ├── AuthToastSync.jsx     # Syncs Clerk auth events to toast notifications
    │   └── ToastProvider.jsx     # Context-based toast notification system
    ├── hooks/
    │   ├── useVideos.js           # Query: fetch all videos
    │   ├── useVideoDetail.js      # Query: fetch single video with thumbnails
    │   ├── useUploadVideo.js      # Mutation: upload a new video
    │   ├── useDeleteVideo.js      # Mutation: delete a video
    │   ├── useGenerateThumbnails.js # Mutation: trigger thumbnail generation
    │   └── useSelectThumbnail.js  # Mutation: set primary thumbnail
    ├── pages/
    │   ├── GalleryPage.jsx        # Main gallery view with search & tag filtering
    │   ├── UploadVideoPage.jsx    # Video upload page with form
    │   ├── VideoDetailPage.jsx    # Single video view with player & thumbnail management
    │   ├── SignInPage.jsx         # Clerk sign-in page
    │   └── SignUpPage.jsx         # Clerk sign-up page
    └── utils/
        ├── assetUrl.js            # Resolves asset URLs (handles relative/absolute paths)
        ├── authToastState.js      # Auth event tracking for toast messages
        ├── classNames.js          # Utility for conditional CSS class merging
        ├── downloadAsset.js       # Programmatic file download helper
        └── formatters.js          # Data formatting utilities (sizes, dates, etc.)
```

---

## Getting Started

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | v18+    | Required for Vite and modern JS |
| **npm**     | v9+     | Comes with Node.js |
| **Clerk Account** | —  | Required for authentication ([clerk.com](https://clerk.com)) |
| **Backend Server** | — | The server must be running (see `server/README.md`) |

### Installation

```bash
cd client
npm install
```

### Environment Variables

Create a `.env` file in the `client/` directory:

| Variable                        | Required | Default                     | Description |
|---------------------------------|----------|-----------------------------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY`    | **Yes**  | —                           | Clerk publishable key (starts with `pk_test_` or `pk_live_`) |
| `VITE_API_BASE_URL`             | No       | `http://localhost:5000`     | Backend API base URL |

**Example `.env`:**

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_API_BASE_URL=http://localhost:5000
```

> **Note:** All Vite environment variables must be prefixed with `VITE_` to be exposed to the client bundle. The app will throw an error at startup if `VITE_CLERK_PUBLISHABLE_KEY` is missing.

### Running the Client

```bash
# Development (with hot module replacement)
npm run dev

# Production preview (build + serve locally)
npm run build
npm run preview
```

The dev server starts at `http://localhost:5173` with:
- Hot Module Replacement (HMR) for instant updates
- API proxy to `http://localhost:5000` (no CORS issues in development)

---

## Pages & Routing

| Path              | Page Component       | Description | Auth Required |
|-------------------|---------------------|-------------|---------------|
| `/`               | `GalleryPage`       | Video gallery with search and tag filtering | No |
| `/upload`         | `UploadVideoPage`   | Upload a new video with metadata | Yes (Clerk) |
| `/videos/:id`     | `VideoDetailPage`   | Video player, thumbnail grid, management | No |
| `/sign-in/*`      | `SignInPage`        | Clerk hosted sign-in flow | No |
| `/sign-up/*`      | `SignUpPage`        | Clerk hosted sign-up flow | No |
| `*`               | —                   | Redirects to `/` | — |

---

## Components

### Layout & Navigation

| Component       | File                    | Description |
|-----------------|------------------------|-------------|
| `Layout`        | `Layout.jsx`           | App shell — header with logo, navigation links, auth controls, and responsive footer |
| `SearchBar`     | `SearchBar.jsx`        | Controlled search input that syncs with gallery query params |

### Video Components

| Component          | File                    | Description |
|--------------------|------------------------|-------------|
| `VideoCard`        | `VideoCard.jsx`        | Gallery card displaying primary thumbnail, title, tags, and metadata |
| `VideoUploadForm`  | `VideoUploadForm.jsx`  | Full upload form with title, description, tags, and drag-and-drop video input |
| `ThumbnailGrid`    | `ThumbnailGrid.jsx`    | Grid of generated thumbnails with primary selection, download, and visual indicators |

### Authentication Components

| Component         | File                    | Description |
|-------------------|------------------------|-------------|
| `AuthControls`    | `AuthControls.jsx`     | Sign-in/sign-out buttons + user avatar (adapts to auth state) |
| `AuthPageShell`   | `AuthPageShell.jsx`    | Centered layout wrapper for Clerk auth pages |
| `AuthToastSync`   | `AuthToastSync.jsx`    | Listens to Clerk auth events and shows toast notifications |

### Utility Components

| Component       | File                    | Description |
|-----------------|------------------------|-------------|
| `ToastProvider` | `ToastProvider.jsx`    | Context-based toast notification system with auto-dismiss, stacking, and severity levels |

---

## API Layer

### HTTP Client Configuration

The Axios instance (`src/api/http.js`) is configured with:

| Setting         | Value |
|-----------------|-------|
| Base URL        | `VITE_API_BASE_URL` or `http://localhost:5000` |
| Default timeout | 30 seconds |
| Trailing slash  | Automatically stripped from base URL |

### API Functions

All API calls are defined in `src/api/videos.js`:

| Function                | Method | Endpoint | Timeout | Description |
|------------------------|--------|----------|---------|-------------|
| `fetchVideos(params)`  | GET    | `/api/videos` | 30s | List videos with optional `search` and `tag` params |
| `fetchVideoById(id)`   | GET    | `/api/videos/:id` | 30s | Get video detail with all thumbnails |
| `uploadVideo(payload)` | POST   | `/api/videos/upload` | **5 min** | Upload video (multipart/form-data) |
| `generateThumbnails(videoId)` | POST | `/api/videos/:id/thumbnails/generate` | **2 min** | Synchronous thumbnail generation |
| `selectThumbnail(videoId, thumbnailId)` | POST | `/api/videos/:id/thumbnails/select` | 30s | Set primary thumbnail |
| `deleteVideo(videoId)` | DELETE | `/api/videos/:id` | 30s | Delete video and all thumbnails |

> **Note:** Upload and thumbnail generation have extended timeouts because they involve large file transfers and FFmpeg processing.

---

## React Query Hooks

All data fetching and mutations use TanStack React Query for automatic caching, refetching, and cache invalidation:

| Hook                      | Type     | Query Key           | Description |
|--------------------------|----------|---------------------|-------------|
| `useVideos(params)`       | Query    | `["videos", params]` | Fetches the video list; re-runs when search/tag params change |
| `useVideoDetail(id)`      | Query    | `["video", id]`      | Fetches a single video with all its thumbnails |
| `useUploadVideo()`        | Mutation | —                    | Uploads a video; invalidates `"videos"` query on success |
| `useDeleteVideo()`        | Mutation | —                    | Deletes a video; invalidates `"videos"` query on success |
| `useGenerateThumbnails()` | Mutation | —                    | Generates thumbnails; invalidates `"video"` detail query on success |
| `useSelectThumbnail()`    | Mutation | —                    | Selects a primary thumbnail; invalidates `"video"` detail query |

**React Query defaults:**
```js
{
  refetchOnWindowFocus: false,  // Don't refetch when tab gains focus
  retry: 1                      // Retry failed requests once
}
```

---

## Authentication (Clerk)

### Setup

1. Create a free account at [clerk.com](https://clerk.com)
2. Create an application in the Clerk dashboard
3. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
4. Add it to `client/.env` as `VITE_CLERK_PUBLISHABLE_KEY`

### Auth Flow

```
User clicks "Sign In"
    │
    ▼
  /sign-in → Clerk hosted UI (SignInPage)
    │
    ▼
  Clerk handles OAuth / email+password / magic link
    │
    ▼
  Redirect to "/" (Gallery) on success
  Redirect to "/upload" on sign-up completion
```

### Protected Routes

Authentication is enforced **on the frontend only** via Clerk's React components:
- The `Upload` page requires authentication
- The backend **does not** validate Clerk JWT tokens — this is a frontend-only guard

### Clerk Provider Configuration

| Setting                         | Value |
|---------------------------------|-------|
| `afterSignOutUrl`               | `/` |
| `signInUrl`                     | `/sign-in` |
| `signUpUrl`                     | `/sign-up` |
| `signInFallbackRedirectUrl`     | `/` |
| `signUpFallbackRedirectUrl`     | `/upload` |

---

## Styling & Design System

### TailwindCSS Configuration

TailwindCSS 3.4 is configured with:

- **Content sources**: `index.html` and all `src/**/*.{js,jsx}` files
- **PostCSS plugins**: `tailwindcss` + `autoprefixer`

### Typography

The app uses custom Google Fonts loaded via `<link>` in `index.html`:

| Font              | Weights       | Usage |
|-------------------|---------------|-------|
| **Instrument Sans** | 400, 500, 600, 700 | Body text, UI elements |
| **Space Grotesk**   | 500, 700 | Headings, emphasis |

### Brand Colors

Custom brand palette defined in `tailwind.config.js`:

| Token        | Hex       | Usage |
|-------------|-----------|-------|
| `brand-50`  | `#eef6ff` | Light backgrounds, hover states |
| `brand-100` | `#d7eaff` | Subtle accents, borders |
| `brand-500` | `#1d4ed8` | Primary actions, buttons, links |
| `brand-700` | `#1e3a8a` | Dark accents, active states |

Usage in components:
```jsx
<button className="bg-brand-500 hover:bg-brand-700 text-white">
  Upload Video
</button>
```

---

## Utility Functions

| File               | Function/Export     | Description |
|--------------------|---------------------|-------------|
| `assetUrl.js`      | `assetUrl(path)`    | Resolves relative asset URLs to absolute URLs using the API base URL |
| `authToastState.js`| Auth state tracker  | Tracks Clerk session changes to trigger appropriate toast messages |
| `classNames.js`    | `classNames(...)`   | Merges CSS class names conditionally (similar to `clsx`) |
| `downloadAsset.js` | `downloadAsset(url, filename)` | Triggers a programmatic file download via blob URL |
| `formatters.js`    | Various formatters  | Format file sizes, dates, and other display values |

---

## Vite Configuration

### Dev Server Proxy

In development, Vite proxies API requests to the backend to avoid CORS issues:

| Path Pattern | Proxy Target |
|-------------|-------------|
| `/api/*`      | `http://localhost:5000` |
| `/uploads/*`  | `http://localhost:5000` |

This means in development, you can simply fetch `/api/videos` without specifying the full backend URL.

**Vite dev server port**: `5173`

---

## Build & Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized production bundle in the `dist/` directory.

### Deploying to Vercel

The project includes a `vercel.json` configuration for SPA routing:

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**Steps:**
1. Import your repository in the Vercel dashboard
2. Set the **Root Directory** to `client/`
3. Set the **Framework Preset** to `Vite`
4. Add environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY` — your Clerk publishable key
   - `VITE_API_BASE_URL` — your deployed backend URL (e.g., `https://your-api.onrender.com`)
5. Deploy

### Deploying to Other Platforms

For any static hosting platform (Netlify, Cloudflare Pages, Firebase Hosting):

1. Build the project: `npm run build`
2. Serve the `dist/` directory
3. Configure SPA fallback: redirect all routes to `index.html`
4. Set the environment variables at build time

> **Important:** `VITE_API_BASE_URL` must point to your deployed backend, not `localhost`.

---

## Known Trade-offs & Limitations

| Decision | Rationale |
|----------|-----------|
| **Clerk auth is frontend-only** | The backend doesn't validate JWT tokens. This is a UI guard, not a security boundary. |
| **No pagination** | The gallery loads all videos at once. For large datasets, implement infinite scroll with cursor-based pagination. |
| **TailwindCSS** | Chosen for rapid iteration. The app uses custom brand tokens and a refined design system. |
| **No offline support** | No service worker or offline caching. All data requires network access. |
| **No image optimization** | Thumbnails are served as raw PNGs. Consider WebP conversion or a CDN with image optimization. |
| **No unit tests** | Components and hooks don't have test coverage yet. |

---

## Scripts

| Command           | Description |
|-------------------|-------------|
| `npm run dev`     | Start Vite dev server with HMR on port 5173 |
| `npm run build`   | Create optimized production bundle in `dist/` |
| `npm run preview` | Preview the production build locally |

---

## License

This project is private and not published under a public license.
