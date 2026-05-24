import { test, expect } from '../../fixtures/api-fixture'
import {generateBooking} from '../../data/booking-generator'

type Geo = {
  lat: string
  lng: string
}

type Address = {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}

type Company = {
  name: string
  catchPhrase: string
  bs: string
}

type User = {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}



test.describe('Customer Screening API', () => {
  test('should return health check response', async ({ apiClient  }) => {
    const response = await apiClient<User> ({
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
    // expect(response.body).toMatchObject({
    //   status: 'UP'
    // })
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

  test('Create booking', async({apiClient,apiStore,authToken }) =>{
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

      
    })
     

  })
})


//npx playwright test --project=api