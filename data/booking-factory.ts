import { faker } from "@faker-js/faker";
import { Booking } from "./booking-types";

const format = (d: Date) => d.toISOString().split("T")[0];

const baseBooking = {
  additionalneeds: "Breakfast",
  depositpaid: true,
};

// ✅ Base builder (used internally)
const buildBooking = (overrides: Partial<Booking> = {}): Booking => {
  const checkinDate = faker.date.soon({ days: 30 });
  const checkoutDate = new Date(checkinDate);
  checkoutDate.setDate(
    checkinDate.getDate() + faker.number.int({ min: 1, max: 10 }),
  );

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 500 }),

    bookingdates: {
      checkin: format(checkinDate),
      checkout: format(checkoutDate),
      ...(overrides.bookingdates || {}),
    },

    ...baseBooking,
    ...overrides,
  };
};

// ✅ Factory scenarios
export const bookingFactory = {
  standard: (overrides: Partial<Booking> = {}) => buildBooking(overrides),

  longStay: () => {
    const checkin = faker.date.soon({ days: 10 });
    const checkout = new Date(checkin);
    checkout.setDate(checkin.getDate() + 15);

    return buildBooking({
      totalprice: faker.number.int({ min: 500, max: 1500 }),
      bookingdates: {
        checkin: format(checkin),
        checkout: format(checkout),
      },
    });
  },

  premium: () =>
    buildBooking({
      additionalneeds: "Breakfast + Spa",
      totalprice: faker.number.int({ min: 800, max: 2000 }),
    }),
};
