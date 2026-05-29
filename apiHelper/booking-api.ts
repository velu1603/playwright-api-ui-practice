import { generateBooking } from "../data/booking-generator";
import { Booking } from "../data/booking-types";
import { bookingFactory } from "../data/booking-factory";
import {
  bookingDetailsSchema,
  createBookingSchema,
  getAllBookingsSchema,
} from "../schema/booking.schema";
import { apiContracts } from "./apiContracts";
import {jsonHeaders} from '../api/config/headers'
import {DEFAULT_RETRY_CONFIG} from '../constants/default_retry_config'



/* Overrides allow partial customization of generated test data, enabling 
   flexible and reusable test scenarios without duplicating full payload definitions.

   Summary 
    | concept            | Meaning |
    | Partial<Booking>   | optional fields ✅
    |overrides           | test-specific changes ✅
    |factory + overrides | merged data ✅
    |benefit             | flexible + clean tests ✅
*/

export const createBooking = async (
  apiClient: any,
  overrides: Partial<Booking> = {},
) => {
  const data = Object.keys(overrides).length
    ? bookingFactory.standard(overrides)
    : generateBooking();

  const resp = await apiClient({
    method: "POST",
    path: "/booking",
    headers: jsonHeaders,
    uiMode: true,
    testStep: true,
    body: data,
    retryConfig: DEFAULT_RETRY_CONFIG
  }).validateSchema(apiContracts.createBooking);

  return resp;
};

export const getAllBookings = async (apiClient: any) => {
  const resp = await apiClient({
    method: "GET",
    path: `/booking`,
    uiMode: true,
    testStep: true,
    retryConfig: DEFAULT_RETRY_CONFIG
  }).validateSchema(apiContracts.getAllBooking);

  return resp;
};

export const getBooking = async (apiClient: any, id: number) => {
  const resp = await apiClient({
    method: "GET",
    path: `/booking/${id}`,
    uiMode: true,
    testStep: true,
    retryConfig: DEFAULT_RETRY_CONFIG
  }).validateSchema(apiContracts.getBooking); //bookingDetailsSchema

  return resp;
};

export const deleteBooking = async (apiClient: any, id: number) => {
  const resp = await apiClient({
    method: "DELETE",
    path: `/booking/${id}`,
    //authType: "cookie",
    authType: 'basic',

    uiMode: true,
    testStep: true,
    retryConfig: DEFAULT_RETRY_CONFIG
  });

  return resp;
};

export const updateBooking = async (
  apiClient: any,
  id: number,
  updateData: Partial<Booking>,
) => {
  const existingResp = await getBooking(apiClient, id);
  const existing = existingResp.body;

  const updatedBody = {
    ...existing,
    ...updateData,
    bookingdates: {
      ...existing.bookingdates,
      ...(updateData.bookingdates || {}),
    },
  };

  const resp = await apiClient({
    method: "PUT",
    path: `/booking/${id}`,
    authType: "basic",
    headers: jsonHeaders,
    uiMode: true,
    testStep: true,
    body: updatedBody,
    retryConfig: DEFAULT_RETRY_CONFIG
  }).validateSchema(apiContracts.updateBooking); // bookingDetailsSchema

  return resp;
};

export const validateAuth = async(apiClient: any,authType?: 'basic' | 'cookie') =>{
  const response = await apiClient({
    method: 'POST',
    path:'/auth',
    headers: jsonHeaders,
    body: {
      username: process.env.API_USERNAME?.trim(),
      password: process.env.API_PASSWORD?.trim()},
    uiMode: true,
    testStep: true,
    retryConfig: DEFAULT_RETRY_CONFIG
  })
  return response
}


export { bookingDetailsSchema };

// Future enhancements: also see apiContracts.ts for documentations

// export const apiClientWithContracts = (apiClient: any) => ({

//   async getAllBookings() {
//     return apiClient({
//       method: 'GET',
//       path: '/booking'
//     }).validateSchema(apiContracts.getAllBookings)
//   },

//   async createBooking(data: Booking) {
//     return apiClient({
//       method: 'POST',
//       path: '/booking',
//       body: data,
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     }).validateSchema(apiContracts.createBooking)
//   },

//   async getBooking(id: number) {
//     return apiClient({
//       method: 'GET',
//       path: `/booking/${id}`
//     }).validateSchema(apiContracts.getBooking)
//   }

// })

// test('Create and Get booking (clean)', async ({ apiClient }) => {

//   Example: full flow test

//   const api = apiClientWithContracts(apiClient)

//   const created = await api.createBooking({
//     firstname: 'John',
//     lastname: 'Doe',
//     totalprice: 100,
//     depositpaid: true,
//     bookingdates: {
//       checkin: '2026-06-01',
//       checkout: '2026-06-05'
//     }
//   })

//   const fetched = await api.getBooking(created.body.bookingid)

//   expect(fetched.body).toMatchObject(created.body.booking)
// })

//  Move into fixture
//You can inject this automatically 👇

//  Update your Playwright fixture
//  export const test = base.extend<{
//   api: ReturnType<typeof apiClientWithContracts>
// }>({
//   api: async ({ apiClient }, use) => {
//     const api = apiClientWithContracts(apiClient)
//     await use(api)
//   }
// })
