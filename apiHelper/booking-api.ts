import { generateBooking } from "../data/booking-generator"
import { Booking } from "../data/booking-types"
import { bookingFactory } from "../data/booking-factory"
import { bookingSchema }                          from '../schema/booking.schema'


export const createBooking = async (
  apiClient: any,
  overrides: Partial<Booking> = {}
) => {

  const data = Object.keys(overrides).length
    ? bookingFactory.standard(overrides)
    : generateBooking()

  const resp = await apiClient({
    method: 'POST',
    path: '/booking',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    uiMode: true,
    testStep: true,
    body: data
  }).validateSchema(bookingSchema)

  return resp
}

export const getBooking = async (apiClient: any, id: number) => {
  const resp = await apiClient({
    method: 'GET',
    path: `/booking/${id}`,
    uiMode:true,
    testStep:true,
  })
  

  return resp.body
}


export const deleteBooking = async (apiClient: any, id: number) => {
  const resp = await apiClient({
    method: 'DELETE',
    path: `/booking/${id}`,
    authType: 'cookie',
    //authType: 'basic',

    uiMode:true,
    testStep:true,
  })

  return resp
}

export const updateBooking = async (
  apiClient: any,
  id: number,
  updateData: Partial<Booking>
) => {

  const existing = await getBooking(apiClient, id)

  const updatedBody = {
    ...existing,
    ...updateData,
    bookingdates: {
      ...existing.bookingdates,
      ...(updateData.bookingdates || {})
    }
  }

  const resp = await apiClient({
    method: 'PUT',
    path: `/booking/${id}`,
    authType: 'basic',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    uiMode: true,
    testStep: true,
    body: updatedBody,
  })

  return resp
}
