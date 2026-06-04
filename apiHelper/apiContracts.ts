/**********************************
 * Schema Registry Pattern
 * Create a contract registry
 * Use it in my tests/helpers
 * 
 *  All contracts live in one place:
 * ✅ Easy refactoring
 * ✅ Cleaner tests
 * 
 * Future enhancements: ==> I will think about it 🤔
 * export const apiContracts = {
                '/booking:POST': createBookingSchema,
                '/booking/:id:GET': bookingDetailsSchema,
                '/booking/:id:PUT': bookingDetailsSchema,
                '/booking:GET': getAllBookingsSchema
        }

        Use like this: validateSchema(apiContracts['/booking:GET'])
*
* ********************** OR *****************
* Create a wrapper like below: 
* export const apiClientWithContracts = (apiClient: any) => ({
                async getAllBookings() {
                    return apiClient({
                    method: 'GET',
                    path: '/booking'
                    }).validateSchema(apiContracts.getAllBookings)
                }
        })
* 
*     It creates a new API client with built-in contracts so instead of 
*           apiClient(...).validateSchema(schema) just call api.getAllBookings()
*  
*   ✅Cleaner
*   ✅ Safer (no forgetting schemas)
*   ✅ More expressive       
*
*       Usage in test : 
*           
            import { apiClientWithContracts } from '../api/apiClientWithContracts'

            test('GET all bookings', async ({ apiClient }) => {

            const api = apiClientWithContracts(apiClient) ✅

            const response = await api.getAllBookings()

            expect(response.status).toBe(200)
            })

*/

import {
  bookingDetailsSchema,
  createBookingSchema,
  getAllBookingsSchema,
} from "@schema/booking.schema";

export const apiContracts = {
  createBooking: createBookingSchema,
  getBooking: bookingDetailsSchema,
  getAllBooking: getAllBookingsSchema,
  updateBooking: bookingDetailsSchema,
};
