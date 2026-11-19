# RESTful CRUD API Server — Car Management

A minimal Node.js/Express REST API for managing car records in PostgreSQL, with API-key authentication, request validation, rate limiting, and centralized error handling.

## Tech stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Runtime | Node.js (CommonJS) | Application runtime |
| Framework | Express | HTTP server and routing |
| Database | PostgreSQL + `pg` | Car records storage |
| Validation | `@sinclair/typebox` | Request body/param schema validation |
| Security | `helmet`, `cors`, `express-rate-limit` | Security headers, CORS, rate limiting |
| Config | `dotenv` | Environment variables |

## How it works

### Entry point
`src/server.js` loads environment variables, creates the Express app, and starts listening on `PORT` (default `3000`).

### App setup (`src/app.js`)
In order:
1. `helmet()` — security headers
2. `cors()` — CORS (open in dev; restrict in production)
3. `express-rate-limit` — 100 requests per 15 minutes per IP
4. `express.json()` — body parser
5. `GET /health` — public health check, no auth required
6. `app.use('/api/cars', carRoutes)` — all car routes
7. `notFound` — 404 for unmatched routes
8. `errorHandler` — centralized error handling (must be last)

### Data layer (`src/config/db.js`)
A single `pg.Pool` connects to `DATABASE_URL`. All model functions query through this pool using parameterized queries.

### Routes (`src/routes/car.routes.js`)
All routes under `/api/cars` require a valid `x-api-key` header (checked by `apiKeyAuth` middleware).

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/cars` | Create a car | ✅ |
| GET | `/api/cars` | List all cars | ✅ |
| GET | `/api/cars/:id` | Get a car by ID | ✅ |
| PUT | `/api/cars/:id` | Update a car | ✅ |
| DELETE | `/api/cars/:id` | Delete a car | ✅ |

Validation middleware runs before controllers: `createCarSchema` on POST body, `updateCarSchema` on PUT body, `idParamSchema` on URL params. Invalid input returns `400` with error details.

### Controllers (`src/controllers/car.controller.js`)
Thin handlers that call the model and send responses. Return `404` when a car isn't found; `204 No Content` on successful delete.

### Model (`src/models/car.model.js`)
Raw parameterized SQL against the `cars` table. The schema enforces business logic at the database level (e.g., VIN length, positive price, valid status).

### Middleware
- `auth.js` — API key auth: `x-api-key` header must equal `API_KEY` from env, otherwise `401 Unauthorized`.
- `validate.js` — TypeBox validation; coerces string params to numbers; returns `400` with path/message details on failure.
- `errorHandler.js` — maps Postgres error codes (`23505` duplicate → `409`, `23514`/`23502` constraint → `400`) and falls back to `err.status` or `500`.

## Environment variables

Create a `.env` in the project root. **Do not commit this file.**

```env
PORT=3000
DATABASE_URL=postgres://postgres:YOUR_PASSWORD_HERE@localhost:5432/dealershipdb
API_KEY=your-super-secret-api-key