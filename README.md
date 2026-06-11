# Expense Tracker API

Production-ready NestJS backend for an expense tracking application with modular architecture, JWT authentication, PostgreSQL database, and full DevOps tooling.

## Tech Stack & Package Responsibilities

| Package | Role |
|---------|------|
| **@nestjs/core** | NestJS application framework — DI container, module system, lifecycle |
| **@nestjs/common** | Decorators (`@Controller`, `@Injectable`, `@Get`, `@UseGuards`, etc.), pipes, filters, interceptors |
| **@nestjs/platform-express** | HTTP server adapter (Express under the hood) |
| **@nestjs/config** | Environment configuration — loads `.env`, validates via Joi schema |
| **@nestjs/typeorm** + **typeorm** | ORM — entity mapping, repositories, migrations, DB connection pooling |
| **pg** | PostgreSQL driver |
| **@nestjs/jwt** | JWT token signing and verification |
| **@nestjs/passport** + **passport** + **passport-jwt** | Authentication strategy — validates JWT from cookies/headers, attaches user to request |
| **bcrypt** | Password hashing (10 salt rounds) |
| **class-validator** + **class-transformer** | DTO validation decorators (`@IsEmail`, `@MinLength`) + serialization (`@Exclude`) |
| **@nestjs/swagger** + **swagger-ui-express** | OpenAPI documentation — auto-generates API docs from decorators, serves Swagger UI |
| **cookie-parser** | Parses `access_token` and `refresh_token` cookies from incoming requests |
| **helmet** | HTTP security headers — CSP, XSS, clickjacking protection |
| **@nestjs/throttler** | Rate limiting — 20 requests per 60s window per IP |
| **@nestjs/terminus** | Health checks — database connectivity, memory, disk space |
| **nest-winston** + **winston** | Structured logging — colorized console in dev, JSON files (error.log, combined.log) in production |
| **joi** | Runtime environment variable validation — ensures required vars exist on startup |
| **jest** + **ts-jest** + **supertest** | Unit testing (`*.spec.ts`) and E2E testing (`test/*.e2e-spec.ts`) |
| **eslint** + **prettier** | Code linting and formatting |
| **Docker** | Multi-stage build (~100MB), production-optimized image |
| **GitHub Actions** | CI pipeline — lint, build, test with PostgreSQL service container |

## Architecture

```
src/
├── main.ts                    # Bootstrap — CORS, helmet, cookie-parser, Swagger, global pipes/filters/interceptors
├── app.module.ts              # Root module — imports all feature modules + global config
├── app.controller.ts          # GET /api (health check placeholder)
├── app.service.ts
├── auth/                      # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts     # POST /auth/register, POST /auth/login
│   ├── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts    # Passport strategy — extracts JWT from cookies or Bearer header
│   ├── guards/
│   │   ├── jwt-auth.guard.ts  # Protects routes: @UseGuards(JwtAuthGuard)
│   │   └── roles.guard.ts     # Role-based access: @UseGuards(RolesGuard) + @Roles('admin')
│   └── decorators/
│       ├── roles.decorator.ts     # @Roles(UserRole.ADMIN)
│       └── current-user.decorator.ts  # @CurrentUser() user, @CurrentUser('id') userId
├── user/                      # User module
│   ├── user.module.ts
│   ├── user.controller.ts     # GET /user/profile, PATCH /user/profile
│   ├── user.service.ts        # register, findById, updateProfile, validateUser
│   ├── entity/user.entity.ts  # users table — name, phone, email, role, address relations
│   └── dto/
│       ├── register.dto.ts
│       └── login.dto.ts
├── address/                   # Address module (divisions/districts/upazilas)
│   ├── address.module.ts
│   ├── address.controller.ts  # GET /address/divisions, /divisions/:id/districts, /districts/:id/upazilas
│   ├── address.service.ts
│   └── entity/
│       ├── division.entity.ts
│       ├── district.entity.ts
│       └── upazilla.entity.ts
├── health/                    # Health check module
│   ├── health.module.ts
│   └── health.controller.ts   # GET /health — DB, memory, disk checks
├── common/                    # Shared infrastructure
│   ├── env.validation.ts      # Joi schema for .env validation
│   ├── winston.logger.ts      # Winston logger factory (console + file transports)
│   ├── filters/
│   │   └── all-exceptions.filter.ts   # Global error handler — consistent JSON error envelope
│   ├── interceptors/
│   │   └── response.interceptor.ts    # Wraps all responses in { success, data, timestamp }
│   └── middleware/
│       └── request-logger.middleware.ts # Logs METHOD /path STATUS DURATION
├── database/
│   ├── data-source.ts         # TypeORM CLI data source for migrations
│   └── migrations/            # Generated migration files
└── utils/
    └── hash.ts                # bcrypt hash/compare helpers
```

## Request/Response Flow

```
Client → cookie-parser → helmet → CORS → Rate Limiter → Request Logger →
  Global ValidationPipe → Global Exception Filter →
    Controller → @UseGuards(JwtAuthGuard → JwtStrategy) → Service → Repository → DB
  ← Global Response Interceptor ←
```

## Authentication Flow

1. **Register**: `POST /api/v1/auth/register` → hashes password, saves user
2. **Login**: `POST /api/v1/auth/login` → validates credentials, signs JWT (1h access + 7d refresh), sets httpOnly cookies
3. **Protected routes**: `JwtStrategy` extracts token from `access_token` cookie → validates signature via `JWT_SECRET` → attaches user to `req.user`
4. **Role-based access**: `RolesGuard` checks `req.user.role` against required roles

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=expense_tracker

# JWT
JWT_SECRET=your-256-bit-secret-min-16-chars
JWT_REFRESH_SECRET=another-secret-min-16-chars

# App
NODE_ENV=development          # development | production | test
PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## Setup & Run

```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env   # then edit .env with your values

# Development (watch mode)
npm run start:dev

# Production build
npm run build && npm run start:prod
```

## API Documentation

Swagger UI is available at `/api-docs` when `NODE_ENV !== 'production'` or `SWAGGER_ENABLED=true`.

All endpoints are prefixed with `/api/v1/`.

## Docker Deployment

```bash
# Start all services (app + postgres)
docker compose up -d

# Rebuild app image
docker compose up -d --build app

# View logs
docker compose logs -f app
```

The Dockerfile uses multi-stage build — the production image is ~100MB and runs as a non-root user.

## Database Migrations

```bash
# Generate migration after entity changes
npx typeorm-ts-node-commonjs migration:generate src/database/migrations/MigrationName -d src/database/data-source.ts

# Run migrations
npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts

# Revert last migration
npx typeorm-ts-node-commonjs migration:revert -d src/database/data-source.ts
```

## Testing

```bash
# Unit tests
npm run test

# With coverage
npm run test:cov

# E2E tests (requires running database)
npm run test:e2e
```

## CI/CD

GitHub Actions (`./github/workflows/ci.yml`) runs on push/PR to `main`:
- `npm ci` → `npm run lint` → `npm run build` → `npm run test:cov`
- PostgreSQL 16 service container provides the test database
- Environment variables injected for test context
