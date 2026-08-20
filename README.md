# Blogger

A full-stack blogging platform providing user authentication, content creation, and article management with a decoupled frontend and backend architecture.

---

## Current Status: V1 Implementation

This repository contains the core foundation for the Blogger platform. Below is a breakdown of what is currently implemented, the architecture, and planned future enhancements.

### What is Built & Functional

- **Authentication & Authorization**
  - User registration and login.
  - Password hashing with `bcrypt`.
  - Session / JWT-based authentication for protecting write and edit actions.
  - Author-only permission guards (users can only edit or delete their own posts).

- **Blog Content Management (CRUD)**
  - Create, read, update, and delete blog posts.
  - Post attributes: title, content/body, cover image URL, author reference, timestamps.
  - Public blog feed with latest posts.
  - Single article view with full content and author metadata.

- **Frontend Interface (`/frontend`)**
  - Responsive user interface for reading and publishing articles.
  - Authentication views (Sign Up / Sign In).
  - Post creation editor and post management controls.
  - Client-side routing and API integration.

- **Backend API (`/backend`)**
  - RESTful routing structured with controllers and middleware.
  - Centralized error handling and request parsing.
  - CORS-enabled endpoints allowing decoupled frontend communication.

---

## Future Scope

- [ ] **Rich Text / Markdown Editor**: Integration with a markdown parser or WYSIWYG editor (e.g. TipTap, Quill).
- [ ] **Comments & Discussions**: Nested discussion threads underneath articles.
- [ ] **Tags & Category Filtering**: Ability to tag posts and filter feeds by category.
- [ ] **Image Upload Pipeline**: Direct cloud image uploads (Cloudinary or AWS S3) instead of external URL links.
- [ ] **Likes & Bookmarks**: Post engagement tracking and user reading lists.
- [ ] **Pagination & Search**: Full-text search and infinite scrolling on the blog feed.
- [ ] **User Profiles**: Public author profiles listing their published articles and bio.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React / JavaScript, CSS | Client UI, routing, and state management |
| Backend | Node.js, Express.js | REST API, authentication middleware, CRUD routes |
| Database | MongoDB / PostgreSQL | User and post document/relational storage |
| Security | bcrypt, jsonwebtoken, cors | Password hashing, token signing, and cross-origin handling |

---

## Architecture & Directory Layout

```
blogger/
├── backend/
│   ├── controllers/       # Request handlers for auth and posts
│   ├── models/            # Database schemas (User, Post)
│   ├── routes/            # API route definitions (/auth, /posts)
│   ├── middleware/        # Authentication & error handling
│   ├── config/            # DB connection and env loader
│   ├── .env.example       # Backend environment template
│   ├── package.json       # Backend dependencies and scripts
│   └── server.js          # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components (Navbar, PostCard)
│   │   ├── pages/         # Route views (Home, Login, PostDetail, Editor)
│   │   ├── services/      # Axios / Fetch API client helpers
│   │   └── App.js         # Root component & routing configuration
│   ├── package.json       # Frontend dependencies
│   └── public/            # Static assets
│
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js (>= 18.x)
- npm or yarn
- Database instance running locally or via cloud (MongoDB / PostgreSQL)

---

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create your environment configuration:
```bash
cp .env.example .env
```

Configure `.env` with your settings:
```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

4. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will be live at `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the environment (if required):
```env
REACT_APP_API_URL=http://localhost:5000/api
# or for Vite:
# VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
# or: npm run dev
```

The application will be accessible at `http://localhost:3000` (or `http://localhost:5173`).

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Create a new user account | No |
| POST | `/api/auth/login` | Authenticate user & return token | No |
| GET | `/api/auth/me` | Fetch current user session profile | Bearer Token |

### Posts

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/posts` | List all published blog posts | No |
| GET | `/api/posts/:id` | Retrieve a single post with author details | No |
| POST | `/api/posts` | Create a new blog post | Bearer Token |
| PUT / PATCH | `/api/posts/:id` | Update an existing post | Post Author |
| DELETE | `/api/posts/:id` | Delete a post | Post Author |

---

## Data Model Overview

```
  User
  ├── id (PK / _id)
  ├── username / name
  ├── email (unique)
  ├── password (hashed)
  └── createdAt

  Post
  ├── id (PK / _id)
  ├── title
  ├── content
  ├── coverImage
  ├── author (FK / Ref -> User.id)
  └── createdAt / updatedAt
```

---

## License

MIT © [Gaurav Pandey](https://github.com/hellogoravpandey)
