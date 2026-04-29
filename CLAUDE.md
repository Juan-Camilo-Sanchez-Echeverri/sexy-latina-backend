# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev         # Start with hot reload
npm run build             # Compile TypeScript to dist/

# Code quality
npm run lint              # ESLint with auto-fix
npm run format            # Prettier formatting

# Testing
npm run test              # Run all unit tests
npm run test:watch        # Watch mode (verbose)
npm run test:cov          # With coverage report
npm run test:e2e          # End-to-end tests
npm run test:debug        # With Node inspector

# Docker (full stack: backend + MongoDB + Redis)
npm run start:docker:dev
npm run start:docker:prod

# Standalone services
npm run docker:db          # MongoDB Replica Set
npm run docker:redis:local
```

## Architecture

NestJS 11 + MongoDB (Mongoose) + Redis cache. All routes are prefixed `api/` with URI versioning (`/api/v1.0/...`). Swagger docs at `/docs`.

### Module structure

Each feature module under `src/modules/` follows this layer pattern:
- **controller** → **service** → **repository** (data access)
- **schema** — Mongoose model
- **dto** — request/response validation (class-validator)
- **guards** — module-specific authorization
- **errors** — centralized error message strings
- **responses** — standardized response shapes
- **swagger/examples** — Swagger decorators (auto-generated via NestJS Swagger plugin)

### Global infrastructure (`src/common/`)

- `AuthGuard` (JWT), `RolesGuard`, `ThrottlerGuard` (50 req/60s) — applied globally in `AppModule`
- `ParseMongoIdPipe` — validates MongoDB ObjectIds globally
- `HttpExceptionFilter` — global exception handler
- `nestjs-cls` — request-scoped storage (used for URL-based Redis cache key hashing)

### Global modules (`src/modules/common/`)

`CommonModule` is marked `@Global()` and exports: `LogModule`, `EventEmitterModule`, `CacheModule` (Redis via Keyv), `StorageModule`. All feature modules get these for free.

### Config (`src/configs/`)

Configs for: env validation, MongoDB connection, Redis, CORS origins, Swagger setup. MongoDB requires a Replica Set (transactions). Environment files: `.env.local`, `.env.development`, `.env` (production).

### Path aliases

TypeScript path aliases configured: `@common/*`, `@modules/*`, `@configs/*`.

### Key env variables

`DB_URL`, `JWT_SECRET`, `JWT_EXPIRATION`, `REDIS_HOST/PORT/PASSWORD`, `APP_URL`, `ALLOWED_ORIGINS`, `PORT` (default 3000).
