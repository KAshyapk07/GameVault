# GameVault

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white&labelColor=20232A)
![Node.js](https://img.shields.io/badge/Node.js-v16%2B-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel&logoColor=white)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat)

A full-stack e-commerce web application for browsing and purchasing video games. The project features a customer storefront, a REST API backend, and an integrated, role-based admin dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App), React Router v6, Context API |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens), Role-Based Access Control (RBAC) |
| File Upload | Multer |

## Project Structure

```
Webtech-project/
 frontend/       # Customer storefront & Admin Panel (React CRA)  port 3000
 backend/        # REST API server (Express + MongoDB)  port 4000
 resources/      # Sample product images
```

## Features

**Storefront**
- Home page with hero banner and new collections
- **Most Popular** products ranked dynamically by view count
- **Most Liked** products ranked dynamically by user likes
- Product detail page with like functionality and add-to-cart
- Shopping cart with quantity management and dynamic order totals
- User authentication (sign up / login) with JWT
- View count incremented each time a product page is opened

**Admin Dashboard (Role-Based Access)**
- Integrated directly into the main frontend via a secure `/admin` route
- **Dashboard Analytics:** Real-time stats on total products, inventory value, total views, and total likes
- **Product Management:** Add new products with drag-and-drop image upload (Multer)
- **Inventory Control:** List, view stats, and remove existing products
- **Secure Login:** Dedicated admin login toggle that verifies `isAdmin` flags in MongoDB

---

## Key Accomplishments

* **Full-Stack Development:** Architected and developed a full-stack e-commerce platform using the MERN stack (MongoDB, Express.js, React, Node.js), handling both customer-facing storefronts and administrative dashboards.
* **Role-Based Authentication:** Implemented secure JWT-based authentication with Role-Based Access Control (RBAC), allowing seamless toggling between standard user and admin sessions within a single React application.
* **State Management & Routing:** Utilized React Context API for global state management (cart data, user sessions, admin privileges) and React Router v6 for secure, protected route navigation.
* **RESTful API Design:** Built a robust Express.js backend with 15+ RESTful endpoints, integrating Mongoose for complex MongoDB queries (e.g., sorting products dynamically by views and likes).
* **File Handling & Storage:** Engineered a custom image upload pipeline using Multer, allowing admins to seamlessly upload and serve product thumbnails directly from the Node.js server.
* **UI/UX & Analytics:** Designed a modern, responsive Admin Dashboard featuring real-time analytics (inventory value, engagement metrics) using clean CSS and SVG iconography.

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- A MongoDB Atlas cluster (update the connection string in `backend/index.js`)

### Install Dependencies

```bash
cd backend && npm install && cd ../frontend && npm install && cd ..
npm install
```

### Running the App

**All services at once (from project root):**

```bash
npm start
```

| Service | URL |
|---|---|
| Storefront & Admin | http://localhost:3000 |
| Backend API | http://localhost:4000 |

**Run each service individually:**

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm start
```

## Configuration

The MongoDB URI is hardcoded in `backend/index.js`. For production, move credentials to environment variables and update the connection call:

```javascript
mongoose.connect(process.env.MONGO_URI)
```

The JWT secret is currently `"secret_ecom"`  replace this with a strong secret stored in an environment variable before deploying.

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/allproducts` | No | Get all products |
| GET | `/newcollections` | No | Latest 8 products |
| GET | `/popular` | No | Top 10 by view count |
| GET | `/mostliked` | No | Top 10 by likes |
| POST | `/addproduct` | No | Add a product |
| POST | `/removeproduct` | No | Remove a product |
| POST | `/upload` | No | Upload product image |
| POST | `/incrementviews` | No | Increment product view count |
| POST | `/like` | No | Like a product |
| POST | `/signup` | No | Register a new user |
| POST | `/login` | No | Login, returns JWT |
| POST | `/adminlogin` | No | Admin Login, returns JWT & admin flag |
| GET  | `/isadmin` | JWT | Check if current user is admin |
| POST | `/getcart` | JWT | Get user cart |
| POST | `/addtocart` | JWT | Add item to cart |
| POST | `/removefromcart` | JWT | Remove item from cart |
