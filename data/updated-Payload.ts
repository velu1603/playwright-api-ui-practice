import { generateBooking, Booking } from "./booking-generator";

export const getDynamicUpdatePayload = (): Partial<Booking> => {
  const data = generateBooking();

  const update: Partial<Booking> = {
    firstname: data.firstname,

    // ✅ random inclusion of fields
    ...(Math.random() > 0.5 && { lastname: data.lastname }),

    ...(Math.random() > 0.5 && { totalprice: data.totalprice }),

    ...(Math.random() > 0.5 && {
      bookingdates: {
        checkin: data.bookingdates.checkin,
        checkout: data.bookingdates.checkout,
      },
    }),

    depositpaid: Math.random() > 0.5,
  };

  // ✅ ensure at least one field exists
  if (Object.keys(update).length === 0) {
    update.firstname = data.firstname;
  }

  return update;
};
