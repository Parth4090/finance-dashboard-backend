# Finance Dashboard Backend API 🚀

A highly robust, production-ready backend system for the Finance Data Processing and Access Control Dashboard. Uniquely engineered using **Clean Architecture** principles and advanced RBAC validation mechanisms, designed for high performance, maintainability, and scalability.

## 🧰 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Jest + Supertest

## 🌟 Key Features

*   **Clean Architecture**: Separation of concerns using a strictly enforced Controller ➔ Service ➔ Repository pattern. This ensures business logic is entirely decoupled from the HTTP transport layer and database implementation.
*   **Policy-Based RBAC**: Advanced Role-Based Access Control that evaluates user permissions dynamically based on predefined policies, rather than hardcoded roles, allowing granular access controls (e.g., `viewer`, `analyst`, `admin`).
*   **Advanced MongoDB Analytics & Indexing**: High-performance aggregation pipelines and optimized native indexing to rapidly calculate income/expense ratios, monthly trends, and top spending categories.
*   **Structured Logging**: Integration with **Winston** for robust, structured, and persistent logging of application events, errors, and system metrics.
*   **Centralized Error Handling**: A unified mechanism to intercept, log (via Winston), and transform all application errors into consistent, professional API responses without crashing the server.
*   **Intelligent TTL-Based Caching**: In-memory Time-To-Live (TTL) cache implemented for intensive dashboard analytics to significantly reduce database operational load.

## 🏗 System Architecture Diagram

```text
         [ Client / Postman / Frontend ]
                       │
                       ▼ 
┌──────────────────────────────────────────────┐
│                  Express App                 │ 
│                                              │
│  [ Middlewares ]                             │
│   - RateLimiter, XSS Clean, MongoSanitize    │
│   - AuthMiddleware (JWT Token Validation)    │
│   - Route RBAC Policy (viewer, analyst...)   │
│   - ErrorHandler, Logger (Winston/Morgan)    │
│                      │                       │
│  [ Routes ]          ▼                       │
│  (/records, /users, /dashboard)              │
│                      │                       │
│  [ Controllers ]     ▼                       │
│  (Extract req, pass to services, format res) │
│                      │                       │
│  [ Services ]        ▼  ⭐⭐⭐                 │
│  (Pure Business Logic, Alerts, Aggregations) │
│                      │                       │
│  [ Repositories ]    ▼                       │
│  (Database abstraction, generic DB calls)    │
│                      │                       │
└──────────────────────┼───────────────────────┘
                       │
                       ▼
              [ MongoDB Database ]
```

## 🔐 Advanced Role-Based Policy (RBAC)

This backend implements a policy-driven authorization strategy to ensure tight access control across the application:

| Role    | Permissions Assigned                                   |
|---------|--------------------------------------------------------|
| viewer  | `'read'`                                               |
| analyst | `'read'`, `'summary'`                                  |
| admin   | `'read'`, `'summary'`, `'create'`, `'update'`, `'delete'`, `'manage_users'`|

## 📊 Analytics & Unique Features Added

- **Budget Limit Alerts (Unique):** Triggered intelligently inside the `<RecordService>`. When an expense is created, if the cumulative backend aggregate flags expenses above $5000 in the *current month*, the backend natively appends a `"warning"` Meta data parameter alerting the user.
- **Export Data to CSV (Unique):** Native support for querying `GET /api/records?format=csv` directly streaming CSV formatted history of transactions for Excel parsing.
- **Smart Queries & Pagination:** Support for advanced filtering, sorting, and pagination out-of-the-box (e.g., `GET /api/records?type=expense&sort=-amount&limit=5&page=1`).
- **Dashboard Service Performance Booster:** Advanced native-MongoDB pipelines fetching income/expense ratios securely cached via intelligent **In-Memory Cache (TTL)** limits.

## 🚀 API Professional Responses

We built a custom JSON wrapper guaranteeing every internal endpoint aligns correctly on a predictable format:

```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": [...],
  "meta": { "total": 120, "page": 1, "limit": 20, "pages": 6 }
}
```

## 📌 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Records
- GET /api/records
- POST /api/records
- GET /api/records?format=csv

### Dashboard
- GET /api/dashboard/summary

## 🛡️ Security Measurements

- **Helmet**: Secures Express apps by setting various HTTP headers.
- **Mongo-Sanitize**: Prevents NoSQL Injection attacks.
- **XSS-Clean**: Sanitizes user input to prevent Cross-Site Scripting.
- **Express-Rate-Limit**: Basic rate limiting to prevent brute-force attacks.

## 🛠 Testing Code

We use **Jest** and **Supertest** to execute validation testing on edge routes and protected configurations natively:

```bash
npm run test
```

## 🌟 Future Improvements

- **Redis Cache Layer:** Migrating simple-memory dictionary caches mapped in `dashboardController` explicitly targeting scaled Redis Clusters.
- **Queue Workers:** Shifting CSV Exports (`format=csv`) to an asynchronous job queue (e.g., BullMQ) generating files in the background, firing Email attachments natively.

## 📦 Setup & Start

1. Define `.env`:
   ```bash
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/finance_dashboard
   JWT_SECRET=supersecret123
   ```
2. Dependency install:
   ```bash
   npm install
   ```
3. Boot Engine:
   ```bash
   npm run dev
   ```
