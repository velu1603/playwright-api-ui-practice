import { z } from 'zod'

export const bookingSchema = z.object({
  bookingid: z.number(),
  booking: z.object({
    firstname: z.string(),
    lastname: z.string(),
    totalprice: z.number(),
    depositpaid: z.boolean(),
    bookingdates: z.object({
      checkin: z.string(),
      checkout: z.string()
    }),
    additionalneeds: z.string().optional()
  })
})

// ✅ auto-generate TypeScript type
export type CreateBookingResponse = z.infer<typeof bookingSchema>
