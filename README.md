# Blogify

Blogify is a full-stack blogging platform with a React frontend and an Express/MongoDB backend. Users can create, edit, publish, and manage blogs, while administrators can manage users and review blog activity.

## Features

- User registration and login with JWT-based authentication
- OTP email verification
- Public blog listing and blog details pages
- Create, edit, publish, unpublish, and delete blogs
- Tiptap rich-text blog content
- Blog cover images and inline image uploads
- Cloudinary image storage
- Comments and replies
- Likes and bookmarks
- User dashboard with blog and asset statistics
- Admin dashboard with user and blog management
- Redis and BullMQ background jobs for welcome emails and asset cleanup
- Unit and API integration tests with Vitest and Supertest

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- TanStack React Query
- Tailwind CSS
- Tiptap

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT and cookie-based authentication
- Redis and BullMQ
- Cloudinary
- Nodemailer and Resend
- Multer for multipart uploads
- Vitest and Supertest

## Project Structure

```text
blogify-test/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── service/
│   ├── src/
│   │   ├── config/
│   │   ├── queues/
│   │   └── workers/
│   ├── test/
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── features/
│       ├── pages/
│       └── routes/
└── README.md
```

## Requirements

- Node.js 20 or later
- npm
- MongoDB
- Redis
- Cloudinary account for image uploads
- SMTP, Gmail, or Resend credentials for email features

## Installation

Install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

Create `backend/.env` with the values required by your local services:

```env
PORT=8004
MONGODB_URL=mongodb://127.0.0.1:27017/blogify
JWT_SECRET=replace-with-a-long-random-secret
CRYPTO_SECRET=replace-with-a-long-random-secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_URL=your-cloudinary-url

GOOGLE_EMAIL_USER=your-email@example.com
GOOGLE_EMAIL_REFRESH_TOKEN=your-refresh-token
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

RESEND_SECRET_KEY=your-resend-key
ASSET_CLEANUP_AGE_MS=86400000
```

Do not commit `.env` files or real credentials. The backend `.gitignore` excludes them.

## Running Locally

Start the backend API:

```bash
cd backend
npm run dev
```

The API runs on `http://localhost:8004` by default.

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`.

Run the background worker in another terminal when email or scheduled asset cleanup jobs are needed:

```bash
cd backend
npm run worker
```

To create or update an administrator account:

```bash
cd backend
npm run seed:admin
```

## API Overview

The backend mounts these route groups under `/api`:

| Route            | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `/api/auth`    | Registration, login, OTP verification, sessions, and user dashboard |
| `/api/blogs`   | Blog CRUD, publishing, reactions, bookmarks, and comments           |
| `/api/uploads` | Inline image uploads                                                |
| `/api/admin`   | Administrator dashboard, user management, and blog overview         |

## Testing

Run the backend test suite:

```bash
cd backend
npm test
```

Run tests in watch mode or collect coverage:

```bash
npm run test:watch
npm run test:coverage
```

Check and build the frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Background Jobs

BullMQ uses Redis to process asynchronous jobs. The worker currently handles welcome emails and scheduled cleanup of unused assets. Start the worker separately from the HTTP server so queued jobs can be processed continuously.
