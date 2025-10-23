# Testing Guide - NCLEX Preparation Portal

Complete guide for running all tests against Docker containers and local development.

**Last Updated**: October 23, 2025

---

## Overview

The project includes three types of tests:
- **Backend Unit Tests** (22 tests) - API, authentication, database operations
- **Frontend E2E Tests** (25 Cypress tests) - User flows, UI interactions
- **Full Test Suite** (47+ tests total)

---

## Quick Start

### Run All Tests Against Docker

```bash
# 1. Start Docker containers
npm start

# 2. Run all tests
npm run test:docker:all
```

---

## Testing Against Docker Containers

### Prerequisites

Ensure Docker containers are running:

```bash
# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up -d

# Verify all containers are healthy
docker-compose ps

# Expected output:
# nclex-backend    ... Up (healthy)
# nclex-frontend   ... Up (healthy)
# nclex-postgres   ... Up (healthy)
```

### Backend Unit Tests (Inside Docker)

**Run backend tests inside the Docker container:**

```bash
# Run all backend tests
npm run test:docker

# Or manually
docker-compose exec backend npm test
```

**What's tested:**
- ✅ JWT token generation and validation
- ✅ User registration and authentication
- ✅ Password hashing with bcrypt
- ✅ Database CRUD operations
- ✅ Question fetching and randomization
- ✅ Answer submission and validation
- ✅ Points calculation
- ✅ Progress tracking
- ✅ Error handling and validation

**Test files location:** `backend/src/__tests__/`

### Frontend E2E Tests (Against Docker)

**Run Cypress E2E tests against Docker containers:**

```bash
# Headless mode
npm run test:e2e

# Interactive mode (opens Cypress UI)
npm run test:e2e:open
```

**What's tested:**
- ✅ User registration flow
- ✅ User login flow
- ✅ Dashboard statistics display
- ✅ Quiz question navigation
- ✅ Answer selection and submission
- ✅ Navbar points update (real-time)
- ✅ Profile page access
- ✅ Logout functionality
- ✅ Complete user journey
- ✅ Error states and validation
- ✅ Responsive design

**Test files location:** `frontend/cypress/e2e/`

### Run All Tests Together

```bash
# Run backend + E2E tests
npm run test:docker:all

# This executes:
# 1. Backend unit tests (inside Docker)
# 2. Frontend E2E tests (against Docker containers)
```

---

## Testing Local Development

### Backend Tests (Local)

```bash
# Start local backend (ensure database is running)
npm run dev:backend

# In another terminal, run tests
npm run test:backend

# Or directly
cd backend && npm test
```

### Frontend Tests (Local)

```bash
# Start local dev servers
npm run dev

# Run E2E tests
npm run test:e2e
```

---

## Database Switching for Tests

### Test with PostgreSQL (Default)

```bash
# PostgreSQL is the default for Docker
docker-compose up -d
npm run test:docker:all
```

### Test with SQLite (Local Development)

```bash
# 1. Switch to SQLite
npm run db:switch:sqlite

# 2. Initialize database
cd backend
npx prisma generate
npx prisma db push

# 3. Seed data
npm run seed

# 4. Run tests
npm test
```

### Test with PostgreSQL (Local Development)

```bash
# 1. Start PostgreSQL (Docker)
docker-compose up -d postgres

# 2. Switch to PostgreSQL
npm run db:switch:postgres

# 3. Initialize database
cd backend
npx prisma generate
npx prisma db push

# 4. Seed data
npm run seed

# 5. Run local dev servers
npm run dev

# 6. Run tests
npm test
```

---

## Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run backend + E2E tests (local) |
| `npm run test:backend` | Backend unit tests (local) |
| `npm run test:frontend` | Frontend component tests |
| `npm run test:e2e` | E2E Cypress tests (headless) |
| `npm run test:e2e:open` | E2E Cypress tests (interactive) |
| `npm run test:all` | All tests including centralized |
| `npm run test:docker` | Backend tests (Docker) |
| `npm run test:docker:all` | Backend + E2E (Docker) |

---

## Continuous Integration Testing

### Complete CI Workflow

```bash
# 1. Install all dependencies
npm run install:all

# 2. Start Docker containers
docker-compose up -d

# 3. Wait for services to be healthy
sleep 30

# 4. Seed database
docker-compose exec backend npm run seed

# 5. Run all tests
npm run test:docker:all

# 6. Cleanup
docker-compose down
```

### Package.json CI Script

```bash
# Run full CI pipeline
npm run ci
```

This executes:
1. Install dependencies
2. Run backend tests
3. Start Docker
4. Seed database
5. Run E2E tests
6. Stop Docker

---

## Testing Specific Features

### Test User Authentication

```bash
# Backend auth tests
docker-compose exec backend npm test -- auth

# E2E auth flow
npm run test:e2e:open
# Then select: auth.cy.js
```

### Test Quiz Functionality

```bash
# Backend quiz tests
docker-compose exec backend npm test -- questions

# E2E quiz flow
npm run test:e2e:open
# Then select: quiz.cy.js
```

### Test Dashboard

```bash
# E2E dashboard tests
npm run test:e2e:open
# Then select: dashboard.cy.js
```

---

## Debugging Test Failures

### Check Container Logs

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# PostgreSQL logs
docker-compose logs -f postgres

# All logs
docker-compose logs -f
```

### Check Container Health

```bash
# Status of all containers
docker-compose ps

# Health check
curl http://localhost:3000/health

# Database connection
docker-compose exec postgres psql -U nclex_user -d nclex_db -c "SELECT 1;"
```

### Reset Test Environment

```bash
# Stop and remove everything
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache

# Start fresh
docker-compose up -d

# Seed data
docker-compose exec backend npm run seed

# Run tests
npm run test:docker:all
```

---

## Test Coverage

### Current Coverage

- **Backend Unit Tests**: 22 tests
  - Authentication: 8 tests
  - Database operations: 6 tests
  - API endpoints: 8 tests

- **E2E Cypress Tests**: 25 tests
  - User flows: 15 tests
  - UI interactions: 10 tests

- **Total**: 47+ comprehensive tests

### Run Coverage Reports

```bash
# Backend coverage
cd backend
npm test -- --coverage

# View coverage report
open coverage/lcov-report/index.html
```

---

## Common Issues

### Issue: "Cannot connect to database"

**Solution:**
```bash
# Ensure PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Issue: "Port already in use"

**Solution:**
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Stop conflicting services
docker-compose down

# Or kill the process
taskkill /PID <PID> /F
```

### Issue: "Cypress tests timeout"

**Solution:**
```bash
# Ensure containers are healthy
docker-compose ps

# Wait longer for startup
sleep 30

# Check if backend is responding
curl http://localhost:3000/health

# Run tests with increased timeout
cd frontend
npx cypress run --config defaultCommandTimeout=10000
```

### Issue: "Database not seeded"

**Solution:**
```bash
# Seed database manually
docker-compose exec backend npm run seed

# Or reset and seed
docker-compose down -v
docker-compose up -d
sleep 20
docker-compose exec backend npm run seed
```

---

## Best Practices

1. **Always start fresh** - Run `docker-compose down -v` before important test runs
2. **Wait for health checks** - Give containers time to be healthy before running tests
3. **Check logs first** - When tests fail, check Docker logs for errors
4. **Isolate issues** - Run backend tests and E2E tests separately to identify issues
5. **Use interactive mode** - Use `npm run test:e2e:open` to debug E2E test failures
6. **Keep containers running** - During development, keep Docker running to speed up test iterations

---

## Test Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://nclex_user:nclex_password@localhost:5432/nclex_db?schema=public"
JWT_SECRET="test-secret-key"
PORT=3000
NODE_ENV=test
```

### Frontend (for E2E)

Cypress automatically uses `http://localhost` for E2E tests when Docker is running.

---

## Summary

**Quick Commands:**

```bash
# Start everything
npm start

# Run all tests against Docker
npm run test:docker:all

# Debug failing tests
docker-compose logs -f backend
npm run test:e2e:open

# Clean slate
docker-compose down -v && docker-compose up -d
```

For more details, see:
- [README.md](./README.md) - Project overview
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Complete technical documentation
