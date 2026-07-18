# 🚀 Playwright API Automation Framework

A scalable and enterprise-grade API testing framework built with **Playwright** and **TypeScript**, featuring intelligent authentication handling, token lifecycle management, schema validation with Zod, and data factory patterns for realistic test scenarios.

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
  - [Basic Examples](#basic-examples)
  - [Advanced: Data Factory Pattern](#advanced-data-factory-pattern)
- [Architecture](#-architecture)
- [Design Principles](#-design-principles)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

## ✨ Features

- ✅ **Smart Authentication Handling** — Auto-detects auth strategy by HTTP method
- ✅ **Multi-Auth Support** — Cookie, Bearer, Basic, None
- ✅ **Automatic Fallback** — Cookie → Basic auth retry on 401/403
- ✅ **Token Lifecycle Management** — Caching, expiry tracking, auto-refresh
- ✅ **Schema Validation** — Zod-based request/response validation
- ✅ **Data Factory Pattern** — Realistic, reusable test data generation
- ✅ **Enhanced Promises** — Chainable `.validateSchema()` for fluent API
- ✅ **Fixture-Based** — Clean separation of concerns using Playwright fixtures
- ✅ **Type-Safe** — Full TypeScript with strict mode
- ✅ **Enterprise-Ready** — Production-grade error handling and logging

---

## ✅ Prerequisites

Before you begin, ensure you have:

- **Node.js** ≥18.0.0
- **npm** ≥9.0.0
- **Git** (for cloning the repository)
- **Restful Booker API** running locally or accessible via network
  - Default: `http://localhost:3000`
  - Or set via `API_BASE_URL` environment variable
  - [Restful Booker Documentation](https://restful-booker.herokuapp.com/apidoc/index.html)

**Verify Node.js installation:**
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
```

---

## 🚀 Quick Start

Get up and running in 4 steps:

### 1. Clone the Repository
```bash
git clone https://github.com/velu1603/playwright-api-ui-practice.git
cd playwright-api-ui-practice
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Then edit `.env` with your API credentials:

```env
API_BASE_URL=http://localhost:3000
UI_BASE_URL=http://localhost:4200
API_USERNAME=admin
API_PASSWORD=password123
```

**For Restful Booker (default test API):**
- Username: `admin`
- Password: `password123`

### 4. Run Tests
```bash
# All API tests
npx playwright test --project=API-testing

# With live debugging
npx playwright test --debug

# View HTML report
npx playwright show-report
```

✅ **Done!** Your first test run is complete.

---

## 🔧 Configuration

### Environment Variables (.env)

Create a `.env` file in the root directory. Use `.env.example` as a template:

```bash
cp .env.example .env
```

**Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `API_BASE_URL` | Base URL for API testing | `http://localhost:3000` |
| `UI_BASE_URL` | Base URL for UI testing | `http://localhost:4200` |
| `API_USERNAME` | API authentication username | `admin` |
| `API_PASSWORD` | API authentication password | `password123` |

### Playwright Configuration

Edit `playwright.config.ts` to customize:

```typescript
// Retries on CI only
retries: process.env.CI ? 2 : 0

// Project-specific settings
projects: [
  {
    name: "API-testing",
    use: { baseURL: API_BASE_URL },
    testMatch: /.*\.api\.spec\.ts/,
  },
  {
    name: "ui-chromium",
    use: { ...devices["Desktop Chrome"], baseURL: UI_BASE_URL },
    testMatch: /.*\.ui\.spec\.ts/,
  },
]
```

### TypeScript Configuration

Path aliases (in `tsconfig.json`):

```json
"paths": {
  "@data/*": ["./data/*"],
  "@api/*": ["./apiHelper/*"],
  "@fixtures/*": ["./fixtures/*"],
  "@utils/*": ["./utils/*"],
  "@schema/*": ["./schema/*"]
}
```

Use in imports:
```typescript
import { bookingFactory } from '@data/booking-factory'
import { createBooking } from '@api/booking-api'
```

---

## 📦 Project Structure

```
playwright-api-ui-practice/
│
├── fixtures/                      # Playwright fixtures & test utilities
│   ├── api-fixture.ts             # Main API client fixture with auth handling
│   ├── mongo.fixture.ts           # MongoDB connection fixture
│   └── get-Mongo-data.fixture.ts # MongoDB data retrieval fixture
│
├── apiHelper/                     # High-level API operation helpers
│   ├── booking-api.ts             # Booking CRUD operations (create, read, update, delete)
│   └── apiContracts.ts            # API contract definitions
│
├── data/                          # Test data generators & factories
│   ├── booking-factory.ts         # Factory for scenario-based booking data (standard, longStay, premium)
│   ├── booking-generator.ts       # Random realistic booking data generator
│   ├── booking-types.ts           # TypeScript type definitions
│   ├── update-factory.ts          # Factory for dynamic partial updates
│   └── updated-Payload.ts         # Update payload utilities
│
├── schema/                        # Zod schemas (single source of truth)
│   └── booking.schema.ts          # Request/response schemas with auto-type inference
│
├── src/                           # Core framework code
│   ├── api-request/               # HTTP request engine with retries & logging
│   └── internal/                  # Internal utilities
│
├── utils/                         # Utility functions
│   ├── logger.ts                  # Structured logging utility
│   ├── custom-expect.ts           # Custom Playwright matchers
│   └── config/                    # Configuration files
│
├── tests/                         # Test suites
│   ├── API/                       # API tests
│   │   ├── restfulbooker.api.spec.ts    # Main test suite (~200 test cases)
│   │   ├── jsonholder.api.spec.ts       # External API tests (JSONPlaceholder)
│   │   └── test_from_mongo.spec.ts      # Data-driven MongoDB tests
│   ├── UI/                        # UI tests (browser automation)
│   └── e2e/                       # End-to-end tests
│
├── docs/                          # Documentation
├── schema/                        # API schemas
├── types/                         # TypeScript type definitions
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
├── package-lock.json              # Locked dependency versions
└── README.md                      # This file
```

**Key Directories:**

- **`fixtures/`** — Reusable test setup (API clients, database connections)
- **`apiHelper/`** — Business-logic layer (what to test)
- **`data/`** — Test data generation (realistic, scenario-based)
- **`schema/`** — Single source of truth for API contracts
- **`tests/`** — Test files (kept clean, focused on assertions)

---

## 🧪 Usage

### Basic Examples

#### ✅ Simple GET Request

```typescript
import { test, expect } from '../../fixtures/api-fixture'

test('Get all bookings', async ({ apiClient }) => {
  const response = await apiClient({
    method: 'GET',
    path: '/booking'
  })

  expect(response.status).toBe(200)
  expect(response.body).toBeInstanceOf(Array)
})
```

#### ✅ POST with Schema Validation

```typescript
import { test, expect } from '../../fixtures/api-fixture'
import { createBookingSchema } from '@schema/booking.schema'

test('Create booking with validation', async ({ apiClient }) => {
  const response = await apiClient({
    method: 'POST',
    path: '/booking',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-07-01',
        checkout: '2026-07-05'
      }
    }
  }).validateSchema(createBookingSchema)

  expect(response.validationResult.success).toBeTruthy()
  expect(response.body.bookingid).toBeDefined()
})
```

#### ✅ PUT/UPDATE (Auto-Auth Applied)

```typescript
test('Update booking with auto auth', async ({ apiClient }) => {
  const bookingId = 1

  const response = await apiClient({
    method: 'PUT',
    path: `/booking/${bookingId}`,
    body: {
      firstname: 'Jane',
      lastname: 'Smith',
      totalprice: 150,
      depositpaid: false,
      bookingdates: {
        checkin: '2026-08-01',
        checkout: '2026-08-05'
      }
    }
  })

  expect(response.status).toBe(200)
})
```

**Note:** PUT/PATCH/DELETE automatically apply authentication (cookie → basic fallback)

#### ✅ DELETE with Cleanup

```typescript
test('Create and cleanup', async ({ apiClient }) => {
  const created = await apiClient({
    method: 'POST',
    path: '/booking',
    body: { /* booking data */ }
  })

  const bookingId = created.body.bookingid

  // Cleanup
  const deleted = await apiClient({
    method: 'DELETE',
    path: `/booking/${bookingId}`,
    authType: 'basic'  // Optional: override auth type
  })

  expect(deleted.status).toBe(201)
})
```

#### ✅ Using Auth Token Fixture

```typescript
test('Force token initialization', async ({ apiClient, authToken }) => {
  // authToken is automatically generated and cached
  expect(authToken).toBeDefined()

  const response = await apiClient({
    method: 'GET',
    path: '/booking'
  })

  expect(response.status).toBe(200)
})
```

---

### Advanced: Data Factory Pattern

The framework uses a factory-based test data system to eliminate hardcoded payloads and generate realistic, scenario-based test data.

#### ✅ Creating Bookings with Default Data

```typescript
import { test, expect } from '../../fixtures/api-fixture'
import { createBooking } from '@api/booking-api'

test('Create standard booking', async ({ apiClient }) => {
  const created = await createBooking(apiClient)

  expect(created.status).toBe(200)
  expect(created.body.bookingid).toBeDefined()
})
```

#### ✅ Creating with Partial Overrides

```typescript
test('Create booking without deposit', async ({ apiClient }) => {
  const created = await createBooking(apiClient, {
    depositpaid: false
  })

  expect(created.body.booking.depositpaid).toBe(false)
})
```

#### ✅ Scenario-Based Bookings

```typescript
import { bookingFactory } from '@data/booking-factory'

test('Create long-stay booking', async ({ apiClient }) => {
  // Factory generates realistic long-stay scenario
  const booking = bookingFactory.longStay()

  const response = await apiClient({
    method: 'POST',
    path: '/booking',
    body: booking
  })

  expect(response.status).toBe(200)
  expect(response.body.bookingid).toBeDefined()
})

test('Create premium booking', async ({ apiClient }) => {
  const booking = bookingFactory.premium()

  const response = await apiClient({
    method: 'POST',
    path: '/booking',
    body: booking
  })

  expect(response.status).toBe(200)
})
```

**Available Scenarios:**

| Factory | Description | Use Case |
|---------|-------------|----------|
| `bookingFactory.standard()` | Standard booking with random guest name & dates | General testing |
| `bookingFactory.longStay()` | 15-day stay with higher price | Extended booking scenarios |
| `bookingFactory.premium()` | Premium amenities (spa, breakfast) | High-value customer scenarios |

#### ✅ Dynamic Partial Updates

```typescript
import { updateFactory } from '@data/update-factory'
import { updateBooking } from '@api/booking-api'

test('Update booking with random partial changes', async ({ apiClient }) => {
  // Create a booking
  const created = await createBooking(apiClient)
  const id = created.body.bookingid

  // Generate random partial update (different each run)
  const updateData = updateFactory.randomPartial()

  const updated = await updateBooking(apiClient, id, updateData)

  expect(updated.status).toBe(200)
  expect(updated.body).toMatchObject(updateData)
})
```

**Benefits:**
- ✅ Randomized updates improve test coverage
- ✅ Each run tests different field combinations
- ✅ No hardcoding required
- ✅ Simulates real user behavior

#### ✅ Real-World Update Scenario

```typescript
test('User reschedules booking', async ({ apiClient }) => {
  const created = await createBooking(apiClient)
  const id = created.body.bookingid

  // Simulate user rescheduling their trip
  const updateData = {
    bookingdates: {
      checkin: '2026-08-15',
      checkout: '2026-08-20'
    },
    totalprice: 350
  }

  const updated = await updateBooking(apiClient, id, updateData)

  expect(updated.status).toBe(200)
  expect(updated.body.bookingdates).toMatchObject(updateData.bookingdates)
  expect(updated.body.totalprice).toBe(350)
})
```

#### ✅ Complete CRUD Flow

```typescript
import { 
  createBooking, 
  getBooking, 
  updateBooking, 
  deleteBooking 
} from '@api/booking-api'
import { bookingFactory } from '@data/booking-factory'

test('Complete booking lifecycle', async ({ apiClient }) => {
  // CREATE
  const created = await createBooking(apiClient)
  const id = created.body.bookingid
  expect(created.status).toBe(200)

  // READ
  const fetched = await getBooking(apiClient, id)
  expect(fetched.body).toMatchObject(created.body.booking)

  // UPDATE
  const premium = bookingFactory.premium()
  const updated = await updateBooking(apiClient, id, premium)
  expect(updated.status).toBe(200)

  // DELETE (cleanup)
  const deleted = await deleteBooking(apiClient, id)
  expect(deleted.status).toBe(201)
})
```

---

## 🏗️ Architecture

### Data Flow

```
Test
  ↓
Data Factory (bookingFactory / updateFactory)
  ↓
API Helper (create / update / delete / getBooking)
  ↓
apiClient Fixture
  ├─ Auto-detect auth strategy
  ├─ Apply authentication headers
  ├─ Manage token lifecycle
  └─ Handle retries & fallbacks
  ↓
apiRequest Engine
  ├─ Execute HTTP request
  ├─ Log request/response
  ├─ Retry on network errors
  └─ Parse response
  ↓
Enhanced Promise
  ├─ Chainable .validateSchema()
  ├─ Schema validation against Zod
  └─ Type-safe response
  ↓
Test Assertions
  └─ Verify status, body, schema validity
```

### Request Lifecycle

```
1. Test calls apiClient({ method, path, body, ... })
   ↓
2. apiClient Fixture determines auth strategy:
   - GET/POST → No auth (authType: 'none')
   - PUT/PATCH/DELETE → Cookie auth (authType: 'cookie')
   - Or explicit override (authType: 'basic')
   ↓
3. Auth Headers Applied:
   - None: No extra headers
   - Cookie: { Cookie: 'token=...' }
   - Bearer: { Authorization: 'Bearer ...' }
   - Basic: { Authorization: 'Basic <base64>' }
   ↓
4. apiRequest sends HTTP request
   ↓
5. Response received (200, 401, 403, 5xx, etc.)
   ↓
6. Status check:
   - 200-299 → Success ✅
   - 401/403 + Cookie auth → Retry with Basic auth
   - 5xx → Retry (configurable)
   - Other → Return response
   ↓
7. Enhanced Promise wraps response
   ↓
8. Chainable .validateSchema(schema) validates response
   ↓
9. Return to test for assertions
```

### Token Lifecycle

```
generate → cache → reuse → refresh
   ↓
1. Request needs auth
   ↓
2. Check if token cached:
   - Found & valid → Use it ✅
   - Not found or expired → Request new token
   ↓
3. getAuthToken() calls POST /auth
   ↓
4. Token received, cache it:
   - Store in memory: cachedToken
   - Set expiry: current + 10 minutes
   ↓
5. Apply token to current request
   ↓
6. Async refresh token in background
   (doesn't block current request)
   ↓
7. Next request reuses same token
   ↓
8. Token expires → Repeat from step 2
```

---

## 🧠 Design Principles

### ✅ Fixture Design

Playwright fixtures inject reusable utilities into tests:

- **`apiClient`** — Handles all API requests with automatic auth, retries, logging
- **`authToken`** — Generates and caches authentication tokens
- **`request`** — Native Playwright request context (low-level HTTP)

**Why fixtures?**
- ✅ Clean test code (no setup boilerplate)
- ✅ Reusable across all tests
- ✅ Centralized configuration
- ✅ Easy to mock/stub for unit testing

### ✅ Separation of Concerns

| Layer | Responsibility |
|-------|-----------------|
| **Tests** | Assertions only (what to verify) |
| **API Helpers** | Business logic (how to interact with API) |
| **apiClient** | Authentication & request handling |
| **Token Manager** | Token generation, caching, refresh |
| **Schema** | Contract validation (single source of truth) |
| **Data Factory** | Test data generation (realistic scenarios) |

### ✅ Enhanced Promises

Responses are chainable native JavaScript Promises extended with validation:

```typescript
// Chain validation seamlessly
const response = await apiClient({ ... })
  .validateSchema(bookingSchema)  // ← Custom method

// Access validation result
expect(response.validationResult.success).toBe(true)
expect(response.validationResult.errors).toEqual([])
```

### ✅ Smart Authentication

Auto-detects auth strategy by HTTP method:

| HTTP Method | Default Auth | Rationale |
|-------------|--------------|-----------|
| GET | None | Read-only, no user context |
| POST | None | Create public resources |
| PUT | Cookie (→ Basic) | Modify owned resources, needs identity |
| PATCH | Cookie (→ Basic) | Partial modify, needs identity |
| DELETE | Cookie (→ Basic) | Destructive, needs identity |

Override with `authType` parameter:
```typescript
await apiClient({
  method: 'DELETE',
  path: '/booking/1',
  authType: 'basic'  // Force Basic instead of Cookie
})
```

### ✅ Fallback Mechanism

If authentication fails (401/403), auto-retry with alternate strategy:

```
Initial Request (Cookie)
  ↓
Response: 401 Unauthorized
  ↓
Automatic Fallback: Retry with Basic Auth
  ↓
Response: 200 OK ✅
```

**Benefits:**
- ✅ Handles inconsistent APIs gracefully
- ✅ No manual retry logic in tests
- ✅ Improves test reliability

---

## 🔐 Authentication

### Supported Strategies

| Type | Implementation | Use Case |
|------|-----------------|----------|
| **None** | No auth headers | Public endpoints |
| **Cookie** | `Cookie: token=<value>` | Session-based APIs |
| **Bearer** | `Authorization: Bearer <token>` | OAuth2, JWT tokens |
| **Basic** | `Authorization: Basic <base64>` | Username:password |

### Authentication Flow

```typescript
// Automatic (recommended)
await apiClient({
  method: 'PUT',  // Auto-detects: needs auth
  path: '/booking/1'
  // authType is auto-set to 'cookie'
})

// Manual override
await apiClient({
  method: 'DELETE',
  path: '/booking/1',
  authType: 'basic'  // Force Basic auth
})

// Explicit no auth
await apiClient({
  method: 'GET',
  path: '/public/data',
  authType: 'none'
})
```

### Token Management

Tokens are automatically managed:

```typescript
// First request → Generate token
await apiClient({ method: 'PUT', path: '/booking/1' })

// Subsequent requests (within 10 min) → Reuse token ✅
await apiClient({ method: 'PUT', path: '/booking/2' })

// After 10 min → Refresh automatically
await apiClient({ method: 'PUT', path: '/booking/3' })
```

### Manual Token Control

```typescript
import { test, expect } from '../../fixtures/api-fixture'

test('Pre-generate token', async ({ apiClient, authToken }) => {
  // authToken is pre-generated and available
  expect(authToken).toBeDefined()
  expect(typeof authToken).toBe('string')
  
  // Make authenticated requests
  const response = await apiClient({
    method: 'DELETE',
    path: '/booking/1'
  })
  
  expect(response.status).toBe(201)
})
```

---

## 📊 Schema Validation

### Defining Schemas

Zod provides runtime validation + automatic TypeScript types:

```typescript
// schema/booking.schema.ts
import { z } from 'zod'

export const bookingDetailsSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number().int(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string(),
    checkout: z.string()
  }),
  additionalneeds: z.string().optional()
}).strict()

// Auto-infer TypeScript type
export type Booking = z.infer<typeof bookingDetailsSchema>
```

### Validating Responses

```typescript
import { createBookingSchema } from '@schema/booking.schema'

test('Validate response structure', async ({ apiClient }) => {
  const response = await apiClient({
    method: 'POST',
    path: '/booking',
    body: { /* ... */ }
  }).validateSchema(createBookingSchema)

  // Check validation success
  expect(response.validationResult.success).toBe(true)
  
  // Access validated data
  expect(response.body.bookingid).toBeDefined()
})
```

### Validation Errors

```typescript
test('Catch validation errors', async ({ apiClient }) => {
  const response = await apiClient({
    method: 'GET',
    path: '/booking'
  }).validateSchema(createBookingSchema)

  if (!response.validationResult.success) {
    console.error('Validation failed:', response.validationResult.errors)
    expect(response.validationResult.errors).toEqual([])
  }
})
```

---

## 🎯 Running Tests

### Run All Tests

```bash
# All tests
npx playwright test

# Only API tests
npx playwright test --project=API-testing

# Only UI tests
npx playwright test --project=ui-chromium
```

### Run Specific Tests

```bash
# Specific test file
npx playwright test tests/API/restfulbooker.api.spec.ts

# Specific test by name
npx playwright test -g "Create booking"

# Multiple tests matching pattern
npx playwright test -g "Create|Update|Delete"
```

### Debug Mode

```bash
# Interactive debugging with step-through
npx playwright test --debug

# Show browser (for UI tests)
npx playwright test --headed

# Verbose output
npx playwright test --verbose

# Show each step
npx playwright test --workers=1 --reporter=list
```

### View Reports

```bash
# HTML report
npx playwright show-report

# Generate Allure report
npx playwright test --reporter=allure-playwright

# View Allure report
allure serve

# Monocart report
# (Generated in ./monocart-report/index.html)
```

### CI/CD

```bash
# In GitHub Actions (auto-retry, parallel disabled)
CI=true npx playwright test

# Custom config
npx playwright test \
  --project=API-testing \
  --retries=2 \
  --workers=1 \
  --reporter=github
```

---

## 🆘 Troubleshooting

### ❌ Tests Fail with "401 Unauthorized"

**Cause:** Invalid credentials or token expired

**Solutions:**
1. Verify credentials in `.env`:
   ```bash
   grep API_USERNAME .env
   grep API_PASSWORD .env
   ```
2. Reset credentials to defaults:
   ```env
   API_USERNAME=admin
   API_PASSWORD=password123
   ```
3. Check API server is running:
   ```bash
   curl http://localhost:3000/ping
   # Expected: 201 Created
   ```

---

### ❌ "Cannot find module '@fixtures/api-fixture'"

**Cause:** TypeScript path aliases not configured or dependencies not installed

**Solutions:**
1. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Verify `tsconfig.json` has path aliases:
   ```json
   "paths": {
     "@fixtures/*": ["./fixtures/*"],
     "@api/*": ["./apiHelper/*"],
     "@data/*": ["./data/*"],
     "@schema/*": ["./schema/*"],
     "@utils/*": ["./utils/*"]
   }
   ```
3. Restart TypeScript server:
   ```bash
   # In VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
   ```

---

### ❌ Playwright Browser Not Found

**Cause:** Playwright browsers not installed

**Solution:**
```bash
npx playwright install

# Or reinstall all dependencies
npm install
npx playwright install
```

---

### ❌ Tests Timeout on PUT/PATCH/DELETE

**Cause:** API server slow or unreachable

**Solutions:**
1. Check API health:
   ```bash
   curl http://localhost:3000/ping
   ```
2. Check network connectivity:
   ```bash
   ping localhost:3000
   ```
3. Increase timeout in `playwright.config.ts`:
   ```typescript
   use: {
     navigationTimeout: 30000,  // 30 seconds
     actionTimeout: 15000
   }
   ```

---

### ❌ ".env" File Not Working

**Cause:** Environment variables not loaded

**Solutions:**
1. Verify `.env` exists in project root:
   ```bash
   ls -la .env
   ```
2. Check syntax (no spaces around `=`):
   ```env
   API_BASE_URL=http://localhost:3000  # ✅ Correct
   API_BASE_URL = http://localhost:3000  # ❌ Wrong
   ```
3. Source the file manually:
   ```bash
   source .env
   npm test
   ```

---

### ❌ MongoDB Tests Fail

**Cause:** MongoDB server not running or connection string wrong

**Solutions:**
1. Start MongoDB:
   ```bash
   # Local MongoDB
   mongod

   # Or Docker
   docker run -d -p 27017:27017 mongo
   ```
2. Check MongoDB connection string in `.env`
3. Skip MongoDB tests:
   ```bash
   npx playwright test --project=API-testing -g "mongo" --invert
   ```

---

### ❌ Port 3000 Already in Use

**Cause:** Another process using port 3000

**Solutions:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
export API_BASE_URL=http://localhost:3001
npm test
```

---

### ❌ Schema Validation Fails Silently

**Cause:** Custom matcher not defined or response doesn't match schema

**Solutions:**
1. Verify custom matchers are imported:
   ```typescript
   import '../../utils/custom-expect'
   ```
2. Check matcher exists:
   ```typescript
   expect.extend({
     toBeValidDateFormat() { /* ... */ }
   })
   ```
3. Log validation errors:
   ```typescript
   if (!response.validationResult.success) {
     console.error('Errors:', response.validationResult.errors)
   }
   ```

---

### ❌ Token Already Expired

**Cause:** Test runs longer than token TTL (10 minutes)

**Solutions:**
1. Check token expiry in fixture (line 111):
   ```typescript
   tokenExpiry = Date.now() + 10 * 60 * 1000  // 10 minutes
   ```
2. Reduce test duration or break into smaller suites
3. Manually refresh token:
   ```typescript
   const { authToken } = use  // Re-generate in next test
   ```

---

### ✅ Get Help

If issues persist:
1. Check [Restful Booker API docs](https://restful-booker.herokuapp.com/apidoc/index.html)
2. Review test examples: [`tests/API/restfulbooker.api.spec.ts`](./tests/API/restfulbooker.api.spec.ts)
3. Check logs: Look for error stack traces in test output
4. Enable debug mode: `npx playwright test --debug`

---

## 🤝 Contributing

### Code Standards

- **Language:** TypeScript (strict mode)
- **Testing:** Playwright Test framework
- **Formatting:** Prettier (auto-format on save)
- **Linting:** ESLint recommended

### Adding New Tests

1. Create test file with `.api.spec.ts` suffix:
   ```bash
   touch tests/API/new-feature.api.spec.ts
   ```

2. Use the fixture template:
   ```typescript
   import { test, expect } from '../../fixtures/api-fixture'
   
   test.describe('🧪 My Feature', () => {
     test('✅ Should do something', async ({ apiClient }) => {
       const response = await apiClient({
         method: 'GET',
         path: '/endpoint'
       })
       expect(response.status).toBe(200)
     })
   })
   ```

3. Run tests:
   ```bash
   npx playwright test new-feature.api.spec.ts
   ```

### Adding New Test Data

1. Create factory in `data/` directory:
   ```typescript
   // data/my-factory.ts
   export const myFactory = {
     standard: () => ({ /* data */ }),
     scenario: () => ({ /* data */ })
   }
   ```

2. Use in tests:
   ```typescript
   import { myFactory } from '@data/my-factory'
   
   test('Use factory', async ({ apiClient }) => {
     const data = myFactory.standard()
     // ...
   })
   ```

### Adding New Schemas

1. Define schema in `schema/` directory:
   ```typescript
   // schema/my-endpoint.schema.ts
   import { z } from 'zod'
   
   export const mySchema = z.object({
     id: z.number(),
     name: z.string()
   })
   ```

2. Use for validation:
   ```typescript
   const response = await apiClient({ ... })
     .validateSchema(mySchema)
   ```

### Commit Guidelines

```bash
# Feature: new test or helper
git commit -m "feat: add booking update tests"

# Bug: fix in test or framework
git commit -m "fix: resolve token refresh race condition"

# Documentation: update README or comments
git commit -m "docs: add troubleshooting section"

# Refactor: improve code quality
git commit -m "refactor: extract auth logic to separate method"
```

---

## 🔮 Future Enhancements

| Feature | Priority | Status | Notes |
|---------|----------|--------|-------|
| **Retry on network errors / 5xx responses** | 🔴 High | Planned | Exponential backoff, configurable |
| **Request/response logging** | 🔴 High | Planned | Structured logs for debugging |
| **Automatic test data cleanup** | 🔴 High | Planned | `afterEach` hooks for isolation |
| **Role-based authentication** | 🟡 Medium | Planned | Multi-user test scenarios |
| **API interceptors (middleware)** | 🟡 Medium | Research | Pre/post-request hooks |
| **OpenAPI-based client generation** | 🟡 Medium | Research | Auto-generate API client from spec |
| **Performance benchmarking** | 🟢 Low | Research | Track API response times |
| **Contract testing** | 🟢 Low | Research | Consumer-driven contracts |

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Testing Guide](https://playwright.dev/docs/api-testing)
- [Zod Documentation](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Restful Booker API](https://restful-booker.herokuapp.com/apidoc/index.html)
- [JSONPlaceholder (Fake API)](https://jsonplaceholder.typicode.com)

---

## 📄 License

This project is licensed under the **ISC License** — see `package.json` for details.

---

## 👨‍💻 Author

**Velan Chinnaiah**

- GitHub: [@velu1603](https://github.com/velu1603)
- Repository: [playwright-api-ui-practice](https://github.com/velu1603/playwright-api-ui-practice)

This framework was developed as a reference implementation for **enterprise-grade API testing** with Playwright, demonstrating best practices in test automation, authentication handling, and data-driven testing.

---

## 🙏 Acknowledgments

- Built with **Playwright Test** framework
- Schema validation powered by **Zod**
- Test data generation by **Faker.js**
- Reporting with **Allure** and **Monocart**
- Inspired by enterprise testing patterns and best practices

---

**Last Updated:** July 2026  
**Version:** 1.0.0  
**Status:** Production-Ready ✅
