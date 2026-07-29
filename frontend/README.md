# Blogify Frontend

A modern React + Tailwind CSS frontend for the Blogify blog platform.

## Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at **http://localhost:5173** and proxy API calls to the backend at **http://localhost:3000**.

## Make sure the backend is running first:
```bash
cd backend
npm run dev
```

## Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** — Custom dark theme with brand colors
- **React Router 6** — Client-side routing
- **Axios** — HTTP client with interceptors for JWT + auto-refresh
- **react-hot-toast** — Toast notifications
- **react-icons** — Icon library (Remix Icons)
- **date-fns** — Date formatting

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Blog feed with search |
| `/login` | Guest | Login form |
| `/register` | Guest | Registration with password strength |
| `/verify-otp` | Guest | Email OTP verification (6 boxes) |
| `/blog/:id` | Public | Full blog post with like/bookmark/comment |
| `/dashboard` | Auth | My blogs with stats + publish/edit/delete |
| `/create` | Auth | Create blog with drag & drop image upload |
| `/edit/:id` | Auth | Edit existing blog |

## Features

- 🌑 **Dark mode** design system
- 🔄 **Auto token refresh** — Axios interceptor transparently refreshes expired access tokens using the refresh token cookie
- 📝 **OTP flow** — 6-digit boxes with auto-focus, paste support, and resend cooldown
- 🖼️ **Drag & drop upload** — Cover image with preview
- 💡 **Password strength checklist** — Live rules validation matching backend regex
- 🔍 **Search** — Client-side filter by title/author
- ⚡ **Skeleton loading** — Shimmer cards while fetching
- 📊 **Dashboard stats** — Total posts, published, drafts, likes
- 🎯 **Optimistic UI** — Like/bookmark update instantly

## Notes on Backend Quirks (NOT changed in backend)

- `login` returns `acessToken` (typo, missing 'c') — handled in `AuthContext`
- `unlikeBlog` route is mapped to `/unpublish` in backend (bug) — frontend calls `/unlike` (correct)
- `addNewComment` uses GET instead of POST (bug) — frontend calls GET as defined
- `publishBlog` uses `req.body.id` instead of `req.params.id` — frontend sends both
