import { test, expect } from '../../fixtures/api-fixture'


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
      path: '/users',
      uiMode:true,
      retryConfig:{

      },
      
    })

    expect(response.status).toBe(200)
    // expect(response.body).toMatchObject({
    //   status: 'UP'
    // })
  })
})


//npx playwright test --project=api