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
