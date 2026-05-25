import { test, expect }                           from '../../fixtures/api-fixture'
import {generateBooking}                          from '../../data/booking-generator'
import { createBooking,getBooking,deleteBooking } from '../../apiHelper/booking-api'
import { bookingSchema }                          from '../../schema/booking.schema'



test.describe('Customer Screening API', () => {
  test('Ping HealthCheck check to confirm API is up and running. ',async({apiClient})=>{
    const resp = await apiClient({
      method:'GET',
      path:'/ping',
      uiMode:true,
      testStep:true
     
    })
        expect(resp.status,`Response should be ${resp.status}`).toBe(201)


  })
  test('GET all bookings', async ({ apiClient  }) => {
    const response = await apiClient ({
      method: 'GET',
      path: '/booking',
      uiMode:true,
      retryConfig:{
        maxRetries: 3,
        enableJitter: true,


      },
      testStep:true
      
    })

    expect(response.status,`Response should be ${response.status}`).toBe(200)
  
  })
  // test('Test auth', async({apiClient,apiStore }) =>{
  //   const resp = await apiClient({
  //     method: 'POST',
  //     path:'/auth',
  //     headers:{
  //       'Content-type':'application/json',
  //     },
  //     uiMode:true,
  //     body:{"username":"admin", "password":"password123"},
  //     key: 'auth'
  //   })
  //    const auth = apiStore.get<{token: string}>('auth')
    
  //   const token = auth?.token

  //   expect(token).toBeDefined()

  // })


  test('Create a booking', async({apiClient,authToken }) =>{
    const body = generateBooking({depositpaid: false})
    const resp = await apiClient({
      method: 'POST',
      path:'/booking',
      headers:{
        'Content-type':'application/json',
        'Accept': 'application/json'
      },
      uiMode:true,
      body:body,
      
    }).validateSchema(bookingSchema)
   

    expect(resp.status,`Response should be ${resp.status}`).toBe(200)
    expect(resp.validationResult.success).toBeTruthy()
    expect(resp.body?.bookingid).toBeDefined()
    

  })

   test('Create and Get booking (independent)', async({apiClient,authToken }) =>{

    const created = await createBooking(apiClient)
    const fetched = await getBooking(apiClient,created.bookingid)

    expect(fetched).toMatchObject(created.booking)
    

  })

  test('Create, Get and Delete booking', async ({ apiClient }) => {
    const created = await createBooking(apiClient)


  const fetched = await getBooking(apiClient, created.bookingid)

  expect(fetched).toMatchObject(created.booking)


// ✅ cleanup
  const deleted = await deleteBooking(apiClient, created.bookingid)

  expect(deleted.status,`Delete successful `).toBe(201)


  })

  



})


//npx playwright test --project=api