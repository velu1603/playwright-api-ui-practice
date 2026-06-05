import { z } from "zod";

/* ============================================================
   ✅ BASE SCHEMA (Single Source of Truth)
============================================================ */

export const bookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
}).strict();

export const bookingDetailsSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    totalprice: z.number().int(),
    depositpaid: z.boolean(),
    bookingdates: bookingDatesSchema,
    additionalneeds: z.string().optional().nullable(),
  })
  .strict();

/* ============================================================
   ✅ CREATE BOOKING RESPONSE SCHEMA (POST)
============================================================ */

export const createBookingSchema = z.object({
  bookingid: z.number(),
  booking: bookingDetailsSchema,
});

/* ============================================================
   ✅ GET ALL BOOKINGS SCHEMA (LIST ENDPOINT)
============================================================ */

export const bookingIdSchema = z.object({
  bookingid: z.number().positive(),
});

export const getAllBookingsSchema = z.array(bookingIdSchema).min(1);

/* ============================================================
   ✅ TYPE GENERATION (Auto ✅)
============================================================ */

// type ... = → creates a TypeScript type
// typeof schema → gets the schema’s type 
// z.infer<...> → converts schema → TypeScript type
// z.infer turns your Zod schema into a TypeScript type so we don’t have to write it twice.

export type Booking = z.infer<typeof bookingDetailsSchema>;

export type CreateBookingResponse = z.infer<typeof createBookingSchema>;

export type GetAllBookingsResponse = z.infer<typeof getAllBookingsSchema>;
