import { generateBooking } from "../data/booking-generator"



export const createBooking = async (apiClient: any) => {
  const resp = await apiClient({
    method: 'POST',
    path: '/booking',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json'
    },
    uiMode:true,
    testStep:true,
    body: generateBooking({ depositpaid: true })
  })

  return resp.body
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