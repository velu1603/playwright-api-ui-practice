import { test, expect } from "../../fixtures/api-fixture";
import { generateBooking } from "../../data/booking-generator";
import {
  createBooking,
  getBooking,
  deleteBooking,
  updateBooking,
  getAllBookings,
  validateAuth,
} from "../../apiHelper/booking-api";
import {
  bookingDetailsSchema,
  createBookingSchema,
  getAllBookingsSchema,
} from "@schema/booking.schema";
import { getDynamicUpdatePayload } from "../../data/updated-Payload";
import { updateFactory } from "../../data/update-factory";
import { bookingFactory } from "../../data/booking-factory";
import { getLogger } from '../../utils/logger'

test.describe("🧪 Restful-booker API testing for practice", () => {
  test("✅ Ping HealthCheck check to confirm API is up and running. ", async ({
    apiClient,
  }) => {
     await getLogger().info("Starting test")
    const resp = await apiClient({
      method: "GET",
      path: "/ping",
      uiMode: true,
      testStep: true,
      retryConfig:{
        maxRetries: 4,
        initialDelayMs: 500,
        maxDelayMs: 10000,
        enableJitter: true
    }
    });
     await getLogger().success(`Status is ${resp.status}`)
    expect(resp.status, `Response should be ${resp.status}`).toBe(201);
  });
  test("✅ GET all bookings", async ({ apiClient }) => {
    const created = await getAllBookings(apiClient);
    // const response = await apiClient ({
    //   method: 'GET',
    //   path: '/booking',
    //   uiMode:true,
    //   retryConfig:{
    //     maxRetries: 3,
    //     enableJitter: true,

    //   },
    //   testStep:true

    // }).validateSchema(getAllBookingsSchema)

    expect(created.status, `Response should be ${created.status}`).toBe(200);
  });
  test("✅ Create a booking with no deposit", async ({
    apiClient,
    authToken,
  }) => {
    const body = generateBooking({ depositpaid: false });
    const resp = await apiClient({
      method: "POST",
      path: "/booking",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      uiMode: true,
      body: body,
      retryConfig:{
        maxRetries: 3,
        initialDelayMs: 500,
        maxDelayMs: 10000,
        enableJitter: true
    }
    }).validateSchema(createBookingSchema);

    expect(resp.status, `Response should be ${resp.status}`).toBe(200);
    expect(resp.validationResult.success).toBeTruthy();
    expect(resp.body?.bookingid).toBeDefined();
  });

  test("✅ Create booking (basic)", async ({ apiClient }) => {
    const created = await createBooking(apiClient);

    expect(created.status).toBe(200);
    expect(created.body.bookingid).toBeDefined();
    expect(created.validationResult.success).toBeTruthy();
    expect(created.body?.bookingid).toBeDefined();
  });

  test("✅ Create long stay booking", async ({ apiClient }) => {
    const booking = bookingFactory.longStay();

    const resp = await apiClient({
      method: "POST",
      path: "/booking",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      uiMode: true,
      body: booking,
      retryConfig:{
      maxRetries: 3,
      initialDelayMs: 500,
      maxDelayMs: 10000,
      enableJitter: true
    }
    }).validateSchema(createBookingSchema);

    expect(resp.status, `Response should be ${resp.status}`).toBe(200);
    expect(resp.validationResult.success).toBeTruthy();
    expect(resp.body?.bookingid).toBeDefined();
  });

  test("✅ Create and Get booking (independent)", async ({
    apiClient,
    authToken,
  }) => {
    const created = await createBooking(apiClient);

    const fetched = await getBooking(apiClient, created.body.bookingid);

    expect(fetched.body).toMatchObject(created.body.booking);
  });

  test("✅ Create, Get and Delete booking", async ({ apiClient }) => {
    const created = await createBooking(apiClient);

    const fetched = await getBooking(apiClient, created.body.bookingid);

    expect(fetched.body).toMatchObject(created.body.booking);

    // ✅ cleanup
    const deleted = await deleteBooking(apiClient, created.body.bookingid);

    expect(deleted.status, `Delete successful `).toBe(201);
  });

  test("✅ Update booking dynamically", async ({ apiClient }) => {
    const created = await createBooking(apiClient);
    const id = created.body.bookingid;

    const updateData = updateFactory.randomPartial();

    const updated = await updateBooking(apiClient, id, updateData);

    expect(updated.status, `Update status is ${updated.status}`).toBe(200);

    expect(updated.body).toMatchObject(updateData);
  });

  test("✅ User update travel details", async ({ apiClient }) => {
    const created = await createBooking(apiClient);
    const id = created.body.bookingid;

    const updateData = {
      bookingdates: {
        checkin: "2026-07-01",
        checkout: "2026-07-10",
      },
      totalprice: 400,
    };

    const updated = await updateBooking(apiClient, id, updateData);

    expect(updated.status, `Update status is ${updated.status}`).toBe(200);

    expect(
      updated.body.bookingdates,
      `Updated booking dates match`,
    ).toMatchObject(updateData.bookingdates);
    expect(updated.body.bookingdates.checkin,`Check in date format is YYYY-MM-DD and date is ${updated.body.bookingdates.checkin}`).toBeValidDateFormat()
    expect(updated.body.bookingdates.checkout,`Check out date format is YYYY-MM-DD and date is ${updated.body.bookingdates.checkout}`).toBeValidDateFormat()
  });

  test("✅ Mixed dynamic update", async ({ apiClient }) => {
    const created = await createBooking(apiClient);
    const id = created.body.bookingid;

    const base = bookingFactory.standard();

    const updateData = {
      lastname: base.lastname,
      bookingdates: base.bookingdates,
    };

    const updated = await updateBooking(apiClient, id, updateData);

    expect(updated.body).toMatchObject(updateData);
  });

  test("✅ Upgrade booking to premium", async ({ apiClient }) => {
    const created = await createBooking(apiClient);
    const id = created.body.bookingid;

    const premiumUpdate = bookingFactory.premium();

    const updated = await updateBooking(apiClient, id, premiumUpdate);

    // ✅ 1. Schema-level validation (structure guaranteed)
    //const validated = bookingSchema.parse(updated.body)

    expect(updated.status, `✅ Status is ${updated.status}`).toBe(200);
    expect(updated.body).toMatchObject(premiumUpdate);
  });

  test("✅ Validate auth", async ({ apiClient }) => {
    const res = await validateAuth(apiClient);
    expect(res.body, `Token present in body`).toHaveProperty("token");
    expect(res.status, `✅ Status is ${res.status}`).toBe(200);
  });
});

//npx playwright test --project=API-testing
// schema auto typing
