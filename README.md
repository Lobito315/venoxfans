# VenoxFans

VenoxFans is a modern, premium creator monetization platform. It features a full-stack architecture with a Next.js 14 App Router frontend and a Node.js Express + Prisma backend.

## Project Structure

- `client/` - Next.js 14 frontend application (React, TailwindCSS, TypeScript)
- `server/` - Express API backend (Node.js, Prisma, TypeScript, PostgreSQL)
- `brain/` - AI generated implementation plans and task checklists

## Features

- **Premium UI**: Glassmorphism, smooth animations, dynamic dark theme using TailwindCSS.
- **Creator Profiles**: Secure paywalls, exclusive content grid.
- **Social Discovery**: Global feed, trending creators, likes, comments.
- **Monetization**: Subscriptions, PPV (pay-per-view) messages, and tipping.
- **Dashboards**: Dedicated panels for Creators (analytics, upload) and Users (purchases, subscriptions).
- **Messaging**: Direct private messaging with locking features for premium messages.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud like Supabase/Neon)

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment
# Ensure you have a valid DATABASE_URL in server/.env
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/venoxfans?schema=public"

# Initialize Prisma DB
npx prisma db push
npx prisma generate

# Run the development server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Run the Next.js development server (runs on http://localhost:3000)
npm run dev
```

---

## 🌍 Deployment Suggestions

### Frontend (Client)
- **Vercel**: The easiest and most optimized platform for Next.js applications. Connect your GitHub repository and it will automatically deploy and configure CI/CD.

### Backend (Server & Database)
- **Database**: Use Supabase, Neon.tech, or Railway for managed PostgreSQL. Update your `DATABASE_URL` in the production environment.
- **API Server**: Render, Railway, or Heroku. Deploy the `server/` directory, set build command to `npm run build` and start command to `npm start`. Ensure environment variables (like `JWT_SECRET` and `DATABASE_URL`) are configured.
