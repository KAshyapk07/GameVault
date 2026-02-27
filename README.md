# GameVault

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<p align="center">
  A full-stack MERN e-commerce platform for browsing and purchasing video games — featuring a customer storefront, a REST API backend, and a role-based admin dashboard, all deployed on Vercel.
</p>

---
Link: [Live Demo](https://gamevault-psi-orpin.vercel.app/)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Architecture & Key Implementation Details](#architecture--key-implementation-details)
- [Deployment on Vercel](#deployment-on-vercel)
- [Getting Started Locally](#getting-started-locally)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Create React App), React Router v6, Context API |
| Backend | Node.js, Express 4 |
| Database | MongoDB Atlas, Mongoose 8 |
| Auth | JSON Web Tokens (JWT), Role-Based Access Control (RBAC) |
| File Upload | Multer (local) / `/tmp` filesystem (Vercel) |
| Deployment | Vercel (monorepo — frontend + backend + admin in one repo) |

---

## Project Structure

```
Webtech-project/
├── backend/               # Express REST API  (port 4000 locally)
│   ├── index.js           # Server entry point — all routes, models, middleware
│   └── upload/images/     # Product images committed to git & served statically
├── frontend/              # Customer storefront (React CRA)  (port 3000 locally)
│   └── src/
│       ├── Context/
│       │   └── ShopContext.jsx     # Global state: cart, auth, admin flag
│       ├── Components/
│       │   ├── Navbar/             # Dynamic nav with admin link (RBAC-aware)
│       │   ├── Hero/               # Landing banner with background video
│       │   ├── Newcollection/      # Latest 8 products from DB
│       │   ├── Popular/            # Top 10 by view count, polls every 5s
│       │   ├── Liked/              # Top 10 by like count, live-refetch on like
│       │   ├── ProductDisplay/     # Product detail — likes, add-to-cart, 
│       │   └── CartItems/          # Cart with order summary & promo code input
│       └── Pages/
│           ├── AdminPanel.jsx      # Full admin dashboard (tab-based, inline)
│           └── Loginsignup.jsx     # Unified login/signup with user/admin toggle
├── admin/                 # Standalone Vite admin app (legacy, replaced by AdminPanel)
├── vercel.json            # Monorepo routing: /api/* → backend, /* → frontend
└── package.json           # Root scripts to run all services concurrently
```

---

## Features

### Storefront
- Hero section with a fullscreen background video (hosted on Cloudinary)
- **New Collections** — fetches the latest 8 products from MongoDB on load
- **Most Popular** — top 10 products ranked by view count, polled every 5 seconds for live updates
- **Most Liked** — top 10 products ranked by user like count, refetches after each like
- **Product Detail Page** — view count incremented on every visit, live like button with instant feedback, discount % calculated dynamically, add-to-cart with visual confirmation
- **Shopping Cart** — per-item quantity, order subtotal, free shipping, promo code UI
- **User Auth** — sign up / login with JWT stored in `localStorage`; logout clears token and redirects

### Admin Dashboard (`/admin` — JWT + `isAdmin` protected)
- Accessible via a navbar link that only appears for admin users
- **Dashboard tab** — real-time analytics cards: total products, total inventory value (sum of `new_price`), total views, total likes
- **Add Product tab** — image upload (Multer), product name, original price, offer price
- **All Products tab** — full product list with remove confirmation dialog and success toast notifications
- Access denied screen with redirect-to-login for non-admin users

### Authentication Flow
- Login page has a **User / Admin toggle** — admin path hits `/adminlogin` which verifies `isAdmin: true` in MongoDB before issuing a JWT
- `ShopContext` checks `/isadmin` on mount for already-authenticated users to restore admin state across refreshes
- `fetchUser` middleware on protected routes verifies the JWT on every request

---

## Architecture & Key Implementation Details

### Serverless-safe MongoDB Connection
Vercel runs Express as a serverless function — each cold start would create a new connection and exhaust the Atlas connection pool. The backend caches the connection with an `isConnected` flag and a per-request middleware that calls `connectDB()` before every route:

```javascript
// Reuses existing connection on warm invocations, reconnects on cold starts
app.use(async (req, res, next) => {
  await connectDB();
  next();
});
```

### Image URL Rewriting
Product images are stored in MongoDB with whatever host they were uploaded from. A `withFixedImages()` helper rewrites the `/images/...` path on-the-fly before every API response using a relative `/api` base on Vercel, so URLs always resolve against the user's current domain regardless of deployment alias or preview URL:

```javascript
const getBackendUrl = () => {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
  if (process.env.VERCEL) return `/api`;           // relative — works on any domain
  return `http://localhost:${port}`;
};
```

### Vercel Monorepo Routing (`vercel.json`)
All three apps (backend, frontend, admin) are deployed from a single repository. Vercel routes requests based on path prefix — the backend strips the `/api` prefix internally so all Express routes remain clean (e.g. `/allproducts`, not `/api/allproducts`):

```json
{ "src": "/api/(.*)", "dest": "backend/index.js" }
```

### View Tracking
`ProductDisplay` calls `POST /incrementviews` on every mount. The `Popular` component polls `GET /popular` every 5 seconds, so the leaderboard updates live across all sessions without a page reload.

### Cart Persistence
Cart state is seeded from the server on login (`POST /getcart`) and synced on every add/remove. Logged-out users get a local default cart. `getTotalCartAmount()` in `ShopContext` iterates `cartItems` against `all_product` to compute the total.

---

## Deployment on Vercel

The project is configured as a Vercel monorepo via `vercel.json`. Three builds are defined:

| Build | Source | Output |
|---|---|---|
| Backend | `backend/index.js` | `@vercel/node` serverless function |
| Frontend | `frontend/package.json` | Static build from `build/` |
| Admin | `admin/package.json` | Static build from `dist/` |

Required settings in the Vercel dashboard:

| Setting | Value |
|---|---|
| `MONGODB_URI` env var | Your MongoDB Atlas connection string |
| Atlas Network Access | Add `0.0.0.0/0` to allow Vercel's dynamic IPs |

---

## Getting Started Locally

### Prerequisites
- Node.js v16+
- A MongoDB Atlas cluster (or local MongoDB)

### Install & Run

```bash
# Install all dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Run backend + frontend concurrently from project root
npm start
```

| Service | URL |
|---|---|
| Storefront | http://localhost:3000 |
| Backend API | http://localhost:4000 |

---

## Environment Variables

Create a `.env` file in `backend/`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/e-commerce
PORT=4000
```

> The JWT secret is hardcoded as `"secret_ecom"` in `index.js`. Move it to a `JWT_SECRET` env variable before going to production.

---

## API Reference

All routes are prefixed with `/api` on Vercel. Locally they are accessed directly on port 4000.

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | — | DB connection status + product count |
| `GET` | `/allproducts` | — | All products (image URLs rewritten) |
| `GET` | `/newcollections` | — | Latest 8 products |
| `GET` | `/popular` | — | Top 10 by view count |
| `GET` | `/mostliked` | — | Top 10 by like count |
| `POST` | `/addproduct` | — | Add a product |
| `POST` | `/removeproduct` | — | Remove product by `id` |
| `POST` | `/upload` | — | Upload product image (Multer) |
| `POST` | `/incrementviews` | — | Increment view count for a product |
| `POST` | `/like` | — | Increment like count, returns new total |
| `POST` | `/signup` | — | Register, returns JWT |
| `POST` | `/login` | — | Login, returns JWT + `isAdmin` flag |
| `POST` | `/adminlogin` | — | Admin login — verifies `isAdmin: true` |
| `GET` | `/isadmin` | JWT | Returns `{ isAdmin: bool }` for current user |
| `POST` | `/addtocart` | JWT | Add item to user's cart |
| `POST` | `/removefromcart` | JWT | Remove item from user's cart |
| `POST` | `/getcart` | JWT | Fetch user's full cart object |

