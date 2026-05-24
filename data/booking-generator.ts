import { faker } from '@faker-js/faker'


const baseBooking = {
  additionalneeds: 'Breakfast',
  depositpaid: true
}


export const generateBooking = (overrides = {}) => {
    
 const checkinDate = faker.date.future()
  const checkoutDate = new Date(checkinDate)
  checkoutDate.setDate(
    checkinDate.getDate() + faker.number.int({ min: 1, max: 5 })
  )

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
    
    bookingdates: {
      checkin: faker.date.future().toISOString().split('T')[0],
      checkout: faker.date.future().toISOString().split('T')[0],
    },
    ...baseBooking,
    ...overrides
  }
}