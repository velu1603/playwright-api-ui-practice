import { faker } from '@faker-js/faker'

/* ============================================================
   ✅ TYPES
============================================================ */

export type BookingDates = {
  checkin: string
  checkout: string
}

export type Booking = {
  firstname: string
  lastname: string
  totalprice: number
  depositpaid: boolean
  bookingdates: BookingDates
  additionalneeds: string
}

/* ============================================================
   ✅ BASE VALUES
============================================================ */

const baseBooking: Pick<Booking, 'additionalneeds' | 'depositpaid'> = {
  additionalneeds: 'Breakfast',
  depositpaid: true
}

/* ============================================================
   ✅ GENERATOR
   - Fully dynamic
   - Supports partial overrides
   - Ensures valid date ranges
============================================================ */

export const generateBooking = (
  overrides: Partial<Booking> = {}
): Booking => {

  // ✅ realistic future check-in (next 30 days)
  const checkinDate = faker.date.soon({ days: 30 })

  // ✅ checkout always AFTER checkin
  const checkoutDate = new Date(checkinDate)
  checkoutDate.setDate(
    checkinDate.getDate() + faker.number.int({ min: 1, max: 10 })
  )

  // ✅ format to yyyy-mm-dd
  const formatDate = (date: Date) =>
    date.toISOString().split('T')[0]

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),

    // ✅ FIX: integer only (API compatibility)
    totalprice: faker.number.int({ min: 50, max: 500 }),

    // ✅ FIX: safe nested merge
    bookingdates: {
      checkin: formatDate(checkinDate),
      checkout: formatDate(checkoutDate),
      ...(overrides.bookingdates || {})
    },

    ...baseBooking,

    // ✅ overrides applied LAST (highest priority)
    ...overrides
  }
}