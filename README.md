# ShopFlow API — E-Commerce REST API

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_v9-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-F7B731?style=flat&logo=jsonwebtokens&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-6_Languages-3B82F6?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A production-ready e-commerce REST API built with Node.js and Express. Implements secure JWT authentication, role-based access control, multi-language support (i18n), and a clean, modular architecture — designed with real-world scalability in mind.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Security Design](#security-design)
- [Internationalization](#internationalization)
- [Roadmap](#roadmap)

---

## Features

- **JWT Authentication** — Stateless auth with 7-day token expiry; passwords hashed with bcrypt (10 salt rounds)
- **Role-Based Access Control** — `admin` and `user` roles enforced at the middleware layer
- **Request Validation** — All inputs validated via `express-validator` with structured error responses
- **Multi-Language API** — Full i18n support across 6 languages using `i18next`
- **Modular Codebase** — Clean separation of routes, models, middleware, helpers, and validators
- **ES Modules** — Written entirely in modern ESM (`import`/`export`) syntax
- **CORS Configured** — Domain-level CORS control with credential support
- **HTTP Logging** — Morgan middleware for request lifecycle visibility

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express v5 |
| Database | MongoDB Atlas (via Mongoose v9) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password Security | `bcrypt` |
| Validation | `express-validator` |
| Internationalization | `i18next`, `i18next-fs-backend`, `i18next-http-middleware` |
| File Uploads | `multer` (configured, in progress) |
| Environment | `dotenv` |
| Dev Tooling | `nodemon` |

---

## Project Architecture

```
Ecommerceapp/
├── index.js                  # App entry — middleware stack, route registration, DB connection
├── routes/
│   ├── auth.routes.js        # Auth endpoints (register, login)
│   └── category.routes.js    # Category CRUD endpoints
├── models/
│   ├── user.model.js         # User schema with bcrypt pre-save hook
│   └── category.model.js     # Category schema
├── middleware/
│   └── auth.middleware.js    # JWT verification — attaches user to req.auth
├── helpers/
│   ├── jwt.js                # Token generation utility
│   ├── mongoose-plugin.js    # Shared virtual fields plugin (_id → id)
│   └── error-handling.js     # Centralized error handler
├── validators/
│   └── auth.validator.js     # Register & login validation chains
└── locales/                  # Translation files (en, es, de, ar, hi, it)
    ├── en.json
    ├── es.json
    ├── de.json
    ├── ar.json
    ├── hi.json
    └── it.json
```

**Key architectural decisions:**
- Mongoose schema virtuals unify `_id` → `id` across all models via a shared plugin
- `toJSON()` override strips the `password` field before any response is serialized — no accidental leaks
- i18next injects a `t()` translator into every request via middleware, making all API messages locale-aware

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB instance)

### Installation

```bash
# Clone the repository
git clone https://github.com/smeet4545/ecommerce-api.git
cd ecommerce-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Fill in your values (see Environment Variables section)

# Start the development server
npm start
```

The server starts at `http://localhost:3000`.

Health check:
```
GET http://localhost:3000/api/v1/health
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
CONNECTION_STRING=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/eCommerce
API=/api/v1
PORT=3000
SECRET=your-strong-jwt-secret-key
```

| Variable | Description |
|---|---|
| `CONNECTION_STRING` | MongoDB connection URI |
| `API` | API base path prefix |
| `PORT` | Server port |
| `SECRET` | JWT signing secret (keep this strong and private) |

---

## API Reference

Base URL: `http://localhost:3000/api/v1`

All responses follow a consistent envelope:
```json
{
  "success": true,
  "message": "Human-readable status",
  "data": { }
}
```

---

### Auth

#### Register User
```
POST /auth/register
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "userName": "Jane Doe",
  "role": "user",
  "city": "New York",
  "postalCode": "10001",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "phoneNumber": "+12125550100"
}
```
**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "id": "...", "email": "...", "role": "user", "userName": "..." },
  "token": "eyJhbGci..."
}
```

---

#### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```
**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "email": "...", "role": "user" },
    "token": "eyJhbGci..."
  }
}
```

---

### Categories

All category endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/categories` | Create a new category |
| `GET` | `/categories` | List all categories |
| `PUT` | `/categories/:id` | Update a category by ID |
| `DELETE` | `/categories/:id` | Delete a category by ID |

**Create category body:**
```json
{ "name": "Electronics" }
```

---

### Health Check

```
GET /health
```
No auth required. Returns `200 OK` to confirm the server is running.

---

## Security Design

| Concern | Implementation |
|---|---|
| Password storage | bcrypt with 10 salt rounds via Mongoose `pre('save')` hook |
| Token auth | JWT signed with `HS256`, 7-day expiry |
| Sensitive field exposure | `toJSON()` strips `password` from all User documents |
| Input sanitization | `express-validator` on all user-supplied fields |
| CORS | Allowlist of trusted origins with credential support |
| Role enforcement | `role` field on User model, validated at registration |

---

## Internationalization

The API is fully internationalized using `i18next`. Pass the `Accept-Language` header to receive messages in the requested language.

**Supported languages:**

| Code | Language |
|---|---|
| `en` | English |
| `es` | Spanish |
| `de` | German |
| `ar` | Arabic |
| `hi` | Hindi |
| `it` | Italian |

**Example:**
```
GET /api/v1/categories
Accept-Language: hi
```
Response messages will be returned in Hindi.

---

## Roadmap

This project is actively developed. Planned additions:

- [ ] Product model and CRUD routes
- [ ] Order management with status tracking
- [ ] Image upload for products (Multer — already configured)
- [ ] Pagination and filtering on list endpoints
- [ ] Admin-only route guards
- [ ] Refresh token flow
- [ ] Rate limiting and helmet security headers
- [ ] Swagger / OpenAPI documentation
- [ ] Unit and integration tests (Jest)

---

## Author

**Sumit Singh**
GitHub: [@smeet4545](https://github.com/smeet4545)

---

> Built as a hands-on project to practice backend engineering patterns — authentication flows, schema design, middleware architecture, and API internalization.
