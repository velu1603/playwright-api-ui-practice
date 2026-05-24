import { test as base, expect } from '@playwright/test'
import { apiRequest, type ApiRequestParams } from '../src/api-request/api-request'
import type { EnhancedApiPromise } from '../src/api-request/schema-validation/internal/promise-extension'


// ✅ Store interface
type ApiStore = {
  get: <T = unknown>(key: string) => T | undefined
  set: (key: string, value: unknown) => void
}

/**
 * API Client input type (reusable)
 */
type ApiClientOptions = Omit<
  ApiRequestParams,
  'request' | 'configBaseUrl' | 'page'
> & {
  key?: string
}

// ✅ API client type
type ApiClient = <T = unknown>(
  options: ApiClientOptions
) => EnhancedApiPromise<T>   


type Fixtures = {
  apiClient: ApiClient
  authToken: string
}


type TestFixtures  = {
  apiClient: ApiClient
 // apiStore: ApiStore
  authToken: string
}

type WorkerFixtures = {
  apiStore: ApiStore
}

export const test = base.extend<Fixtures>({
// authtoken fixture
authToken: async({apiClient}, use) =>{
  const res = await apiClient<{token: string}>({
    method: 'POST',
    path: '/auth',
    body:{"username":"admin", "password":"password123"}

  })
  const token = res.body?.token
  if (!token){
    throw new Error('Auth token not generated')
  }
  await use(token)
},
 // ✅ In-memory store (per test)


// API client
 apiClient: async ({ request, page }, use) => {

  const client: ApiClient = <T = unknown>(options: ApiClientOptions) => {
    //const { key, ...rest } = options

    return apiRequest<T>({
      request,
      configBaseUrl: process.env.API_BASE_URL,
      page,
      ...options
    })

    // // ✅ Attach safe handler WITHOUT breaking EnhancedApiPromise
    // if (key) {
    //   promise.then((res) => {
    //     apiStore.set(key, res.body)
    //   })
    // }

   
  }

  await use(client)
}
})
export { expect }

 // ...options(spread operator)) is powerful : It spreads (unpacks) all properties into the object
            // apiRequest({
            //   request,
            //   configBaseUrl: process.env.API_BASE_URL,
            //   page,
            //   ...options
            // })        Becomes:
                //  apiRequest({
                //   request,
                //   configBaseUrl: process.env.API_BASE_URL,
                //   page,
                //   method: 'GET',
                //   path: '/users',
                //   headers: { Authorization: 'token' }
                // })     
