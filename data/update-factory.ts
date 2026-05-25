import { Booking } from './booking-types'
import { bookingFactory } from './booking-factory'

export const updateFactory = {

  // ✅ Fully dynamic partial update
  randomPartial: (): Partial<Booking> => {

    const data = bookingFactory.standard()

    const update: Partial<Booking> = {
      ...(Math.random() > 0.5 && { firstname: data.firstname }),
      ...(Math.random() > 0.5 && { lastname: data.lastname }),
      ...(Math.random() > 0.5 && { totalprice: data.totalprice }),
      ...(Math.random() > 0.5 && { bookingdates: data.bookingdates }),
      depositpaid: Math.random() > 0.5
    }

    // ✅ ensure at least one field
    if (Object.keys(update).length === 0) {
      update.firstname = data.firstname
    }

    return update
  }
}