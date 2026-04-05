# Social Feed - Social Media Application

This repository contains Full Stack project. It includes the complete source code for both the frontend application and the backend API.

## Project Links

- GitHub Repository: [https://github.com/nadim-chowdhury/social-feed](https://github.com/nadim-chowdhury/social-feed)
- Video Walkthrough: [Insert YouTube Link]
- Live Application: [https://social-feed-zeta.vercel.app/feed](https://social-feed-zeta.vercel.app/feed)

## What I Built

I developed a full-stack social feed platform that allows users to create accounts, publish content, and interact with other people's posts. The application meets all the primary requirements including authentication, creating posts with images, and managing nested comments and likes.

### Key Technical Decisions

**Frontend:**
I went with Next.js for the frontend. For handling the complex data requirements of a social feed, I used Redux Toolkit and RTK Query. This was crucial for implementing optimistic UI updates. When a user likes a post or adds a comment, RTK Query patches the local cache instantly so the UI updates without waiting for the server response. This makes the app feel incredibly responsive.

I also built a custom node-isolated architecture for the threaded comments. Instead of generic flat lists, the comment components are modular and lazy-load their replies. This approach keeps the initial page load light and only fetches nested replies when the user actually starts reading through a thread.

**Backend:**
The backend is built with NestJS. Since a feed application requires bringing together a lot of relational data (users, posts, comments, likes, and nested replies), I spent a good amount of time optimizing the database queries. instead of making separate network calls to figure out who liked what or creating N+1 issues, I implemented SQL window functions. These aggregate liker data and user details directly into the main feed payload. This means the feed will stay fast even with a large volume of data.

**Styling:**
For the user interface, I set up a design token system using native CSS variables in the global stylesheet. This helps keep the styling consistent across all components and made it much easier to handle the dynamic layout changes, like showing the public/private visibility status on the feed cards.

### Features Completed

- User Registration and Login flow capturing first name, last name, email, and password.
- Protected feed route that blocks unauthenticated visitors.
- Feed displaying the most recent posts at the top.
- Post creation supporting both text and image uploads.
- Ability to toggle post visibility between public (visible to everyone) and private (visible only to the author).
- A threaded commenting system that supports deep nested replies.
- Like and unlike functionality that works across all entity types (posts, comments, and replies).
- Visual indicators showing exactly who liked specific content.
