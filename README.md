# Social Feed

A full-stack social media feed application. Users can sign up, publish posts with images, and interact through nested comments and likes.

- Live: https://social-feed-zeta.vercel.app/feed
- Repo: https://github.com/nadim-chowdhury/social-feed
- Video Walkthrough: https://youtu.be/Z_v9qpCi2hs

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- A Cloudinary account (for image uploads)

## Getting Started

Clone the repo:

```
git clone https://github.com/nadim-chowdhury/social-feed.git
cd social-feed
```

### Database Setup

Create a PostgreSQL database. The backend uses TypeORM with `synchronize: true` in development, so tables will be created automatically on first run.

```
psql -U postgres -c "CREATE DATABASE social_feed;"
```

### Backend

```
cd backend
npm install
```

Copy the example env file and fill in your values:

```
cp .env.example .env
```

The `.env` file expects:

| Variable                | Description                                 |
| ----------------------- | ------------------------------------------- |
| `DB_HOST`               | Postgres host, usually `localhost`          |
| `DB_PORT`               | Postgres port, usually `5432`               |
| `DB_USERNAME`           | Database user                               |
| `DB_PASSWORD`           | Database password                           |
| `DB_DATABASE`           | Database name (`social_feed`)               |
| `JWT_SECRET`            | Any random string, used to sign auth tokens |
| `JWT_EXPIRATION`        | Token lifetime, e.g. `7d`                   |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard              |
| `CLOUDINARY_API_KEY`    | From your Cloudinary dashboard              |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard              |
| `FRONTEND_URL`          | `http://localhost:3000` for local dev       |

Start the dev server:

```
npm run start:dev
```

The API will be available at `http://localhost:5000`. Swagger docs are at `/api/docs`.

### Frontend

Open a new terminal:

```
cd frontend
npm install
```

Copy and configure the env:

```
cp .env.example .env
```

| Variable              | Description                              |
| --------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend URL, `http://localhost:5000/api` |
| `JWT_SECRET`          | Must match the backend's `JWT_SECRET`    |

Start the dev server:

```
npm run dev
```

The app runs at `http://localhost:3000`.

## Project Structure

```
social-feed/
  backend/        NestJS API (TypeORM, PostgreSQL, Passport JWT)
  frontend/       Next.js app (RTK Query, Tailwind CSS)
```

## How It Works

### Authentication

Standard email/password registration and login. Passwords are hashed with bcrypt. The backend issues a JWT on login, and the frontend stores it in a cookie. Protected routes check the token via middleware before rendering.

### Feed

Posts are fetched with cursor-based pagination. The feed query uses SQL window functions to batch-load related data (like counts, recent likers, comment counts) in a single query instead of doing N+1 lookups.

### Comments

Comments support threading. Top-level comments load with the post, and nested replies are lazy-loaded per thread. The frontend uses optimistic updates -- when you post a comment, it shows up instantly and gets reconciled with the server response in the background. If the request fails, the optimistic entry is rolled back.

### Likes

Like toggles are optimistic on both posts and comments. The cache is patched before the network request fires, and undone if it fails.

### Image Uploads

Images go through Cloudinary. The flow is: frontend requests a signed upload token from the backend, uploads directly to Cloudinary using that token, then sends the resulting URL with the post creation request. This keeps large file uploads off the API server.

## Features

- Registration and login (first name, last name, email, password)
- Protected feed route
- Post creation with text and image support
- Public/private post visibility toggle
- Threaded comment system with nested replies
- Like/unlike on posts, comments, and replies
- Cursor-based infinite scroll pagination
- Optimistic UI updates across all interactions
- Light/dark theme support

## Tech Stack

**Frontend:** Next.js, React, Redux Toolkit, RTK Query, Tailwind CSS, next-themes

**Backend:** NestJS, TypeORM, PostgreSQL, Passport JWT, Cloudinary, Swagger
