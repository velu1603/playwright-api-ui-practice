Install the following:

npm init -y
npm install @playwright/test playwright
npm install @modelcontextprotocol/sdk
npm install zod

# 🚀 Playwright API Automation Framework

A scalable and reusable API testing framework built using **Playwright**, featuring:

- ✅ Smart authentication handling
- ✅ Token lifecycle management
- ✅ Schema validation support
- ✅ Multi-auth strategy (Cookie, Basic, Bearer, None)
- ✅ Automatic fallback mechanism (Cookie → Basic)

---

## 📌 Overview

This framework abstracts API handling into a reusable client (`apiClient`) using Playwright fixtures.  

It allows test cases to remain clean and focused while the framework handles:

- Authentication logic
- Request execution
- Token reuse and refresh
- Error handling and fallback strategies

---

## 🧠 Design Principles

### ✅ Fixture Design
Playwright fixtures are used to inject reusable utilities into tests:
- `apiClient` → Handles all API requests
- `authToken` → Generates and manages authentication tokens

---

### ✅ Enhanced Promise
Responses extend native promises with additional functionality:
.validateSchema()


✅ Token Lifecycle
generate → cache → reuse → refresh
-> Tokens are cached in memory
-> Automatically refreshed when expired
-> Reduces redundant authentication calls


✅ Separation of Concerns
|Layer          | Responsibility            |
|Test           | Assertions only           |
|apiClient      | Request + auth handling   |
|TokenManager   | Token lifecycle management|

🔐 Authentication Strategy
The framework supports multiple authentication types:
| Type      |  Description                                  |
| Cookie    |  Token sent via Cookie header (session-based) |
| Bearer    | Token via Authorization header                |
| Basic     | Base64 encoded credentials                    |
| None      | No authentication                             |


⚡ Smart Authentication Logic
Authentication is automatically applied based on HTTP method:
|   HTTP Method |   Default Authentication                  |
|   GET         |   None ✅                                 |
|   POST        |   None ✅                                 |
|   PUT         |   Cookie (fallback to Basic) ✅           |
|   PATCH       |   Cookie (fallback to Basic) ✅           |
|   DELETE      |   Cookie (fallback to Basic) ✅           |



🔁 Fallback Mechanism
If Cookie authentication fails (401/403):

Cookie → ❌ Unauthorized / Forbidden
   ↓
Automatic retry with Basic Auth ✅





✅ Benefits

No manual retry logic in tests
Handles inconsistent APIs gracefully
Ensures reliable execution

🧪 Usage

✅ Import the Custom Fixture

import { test, expect } from '../fixtures/api-fixture'
✅ Basic API Call
test('Get bookings', async ({ apiClient }) => {
  const response = await apiClient({
    method: 'GET',
    path: '/booking'
  })

  expect(response.status).toBe(200)
})
✅ Create Booking with Schema Validation
test('Create booking', async ({ apiClient }) => {
  const response = await apiClient({
    method: 'POST',
    path: '/booking',
    body: {
      firstname: 'John',
      lastname: 'Doe'
    }
  }).validateSchema(bookingSchema)

  expect(response.validationResult.success).toBeTruthy()
  expect(response.body.bookingid).toBeDefined()
})

✅ Update Booking (Auto Auth Applied)
await apiClient({
  method: 'PUT',
  path: `/booking/${id}`,
  body: {
    firstname: 'Updated'
  }
})

✅ Delete Booking (Auto Auth + Fallback)
await apiClient({
  method: 'DELETE',
  path: `/booking/${id}`
})

✅ Override Authentication (Optional)
await apiClient({
  method: 'DELETE',
  path: `/booking/${id}`,
  authType: 'basic'
})

✅ Force Token Initialization

test('Authenticated call', async ({ apiClient, authToken }) => {
  const response = await apiClient({
    method: 'GET',
    path: '/booking'
  })

  expect(response.status).toBe(200)
})

⚠️ Notes on Demo API (Restful Booker)
The framework is tested using Restful Booker API, which:

✅ Supports Cookie authentication
❌ Has inconsistent session handling in API contexts

✅ Recommendation

Use Basic Auth for PUT/PATCH/DELETE
Cookie auth works best in browser/session-based flows


🏗️ Architecture Flow

Test
 ↓
apiClient (auth resolution)
 ↓
Token Manager (cache/refresh)
 ↓
apiRequest (HTTP execution)
 ↓
Response (Enhanced Promise)


✅ Key Benefits

✅ Clean and readable test code
✅ Centralized authentication handling
✅ Supports multiple auth strategies
✅ Automatic fallback and retry
✅ Scalable and maintainable architecture
✅ Enterprise-ready design patterns

📦 Project Structure (Example)

project-root/
│
├── fixtures/
│   └── api-fixture.ts
│
├── apiHelper/
│   └── booking-api.ts
│
├── schema/
│   └── booking.schema.ts
│
├── tests/
│   └── API/
│       └── first.api.spec.ts
│
└── src/
    └── api-request/

🚀 Run Tests

npx playwright test --project=api

Enhancement 1

🧪 Usage – Advanced Data-Driven Testing
Now this framework supports dynamic, scenario-based, and partial updates using a Data Factory pattern.
✅ Creating Bookings
✅ Simple Create (default behavior)
test('Create booking', async ({ apiClient }) => {
  const created = await createBooking(apiClient)

  expect(created.bookingid).toBeDefined()
})


✅ Create with Overrides
test('Create booking without deposit', async ({ apiClient }) => {
  const created = await createBooking(apiClient, {
    depositpaid: false
  })

  expect(created.booking.depositpaid).toBe(false)
})

✅ Create Using Data Factory (Scenario-Based)
import { bookingFactory } from '../data/booking-factory'

test('Create long-stay booking', async ({ apiClient }) => {
  const booking = bookingFactory.longStay()

  const response = await apiClient({
    method: 'POST',
    path: '/booking',
    body: booking
  })

  expect(response.status).toBe(200)
})
🔁 Updating Bookings (Dynamic & Partial Updates)

✅ Dynamic Partial Updates (Recommended)
import { updateFactory } from '../data/update-factory'

test('Update booking dynamically', async ({ apiClient }) => {

  const created = await createBooking(apiClient)
  const id = created.bookingid

  const updateData = updateFactory.randomPartial()

  const updated = await updateBooking(apiClient, id, updateData)

  expect(updated.status).toBe(200)
  expect(updated.body).toMatchObject(updateData)
})

✅ Randomized updates on every run
✅ Supports partial field updates
✅ No hardcoding

✅ Real-World Update Scenario

test('User updates booking details', async ({ apiClient }) => {

  const created = await createBooking(apiClient)
  const id = created.bookingid

  const updateData = {
    bookingdates: {
      checkin: '2026-07-01',
      checkout: '2026-07-10'
    },
    totalprice: 400
  }

  const updated = await updateBooking(apiClient, id, updateData)

  expect(updated.body.bookingdates).toMatchObject(updateData.bookingdates)
  expect(updated.body.totalprice).toBe(400)
})

✅ Simulates real user behavior (rescheduling)
✅ Validates business scenarios

🧠 Data Factory Pattern
The framework uses a factory-based test data system:
✅ Booking Factory
  bookingFactory.standard()
  bookingFactory.longStay()
  bookingFactory.premium()
👉 Generates realistic, reusable data for different scenarios

✅ Update Factory
  updateFactory.randomPartial()
👉 Produces dynamic, partial updates on each run

✅ Benefits

✅ Eliminates hardcoded test data
✅ Enables realistic API scenarios
✅ Supports both full and partial updates
✅ Improves test coverage through randomness
✅ Keeps tests clean and maintainable

🧠 Key Testing Philosophy

Tests should define intent, not data.
The data factory handles generation, while tests focus on validation
🏗️ Updated Data Flow
Test
  ↓
Data Factory (bookingFactory / updateFactory)
  ↓
API Helper (create / update / delete)
  ↓
apiClient (auth + request handling)
  ↓
API Response











🔮 Future Enhancements

🔄 Retry on network errors / 5xx responses
🔐 Role-based authentication (multi-user support)
📊 Request/response logging
🔧 API interceptors (middleware pattern)
🧹 Automatic test data cleanup
🌐 OpenAPI-based client generation

👨‍💻 Author
Developed as part of an advanced API testing framework using Playwright.

