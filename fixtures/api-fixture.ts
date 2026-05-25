import { test as base, expect } from '@playwright/test'
import { apiRequest, type ApiRequestParams } from '../src/api-request/api-request'
import type { EnhancedApiPromise } from '../src/api-request/schema-validation/internal/promise-extension'

/* ===========================================================================================
   ✅ FRAMEWORK OVERVIEW

   Provides:
   - apiClient → reusable API client
   - authToken → token generator
   - Token lifecycle management
   - Multi-auth support (cookie, bearer, basic, none)
   - Smart auth + fallback strategy

=========================================================================================== */

/* ============================================================
   ✅ CONSTANTS
============================================================ */

const BASIC_AUTH_HEADER = `Basic ${Buffer
  .from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`)
  .toString('base64')}`

const AUTH_REQUIRED_METHODS = ['PUT', 'PATCH', 'DELETE']

/* ============================================================
   ✅ TYPES
============================================================ */

type ApiClientOptions = Omit<
  ApiRequestParams,
  'request' | 'configBaseUrl' | 'page'
> & {
  key?: string
  authType?: 'cookie' | 'bearer' | 'basic' | 'none'
}

type ApiClient = <T = unknown>(
  options: ApiClientOptions
) => EnhancedApiPromise<T>

type Fixtures = {
  apiClient: ApiClient
  authToken: string
}

/* ============================================================
   ✅ TOKEN MANAGER
============================================================ */

let cachedToken: string | null = null
let tokenExpiry = 0

const getAuthToken = async (request: any): Promise<string> => {
  const now = Date.now()

  if (cachedToken && now < tokenExpiry) {
    return cachedToken
  }

  const res = await apiRequest<{ token: string }>({
    request,
    configBaseUrl: process.env.API_BASE_URL,
    method: 'POST',
    path: '/auth',
    body: {
      username: process.env.API_USERNAME,
      password: process.env.API_PASSWORD
    }
  })

  const token = res.body?.token

  if (!token) {
    throw new Error('Auth token not generated')
  }

  cachedToken = token
  tokenExpiry = Date.now() + 10 * 60 * 1000

  return token
}

/* ============================================================
   ✅ FIXTURE
============================================================ */

export const test = base.extend<Fixtures>({

  apiClient: async ({ request, page }, use) => {

    const client: ApiClient = <T = unknown>(options: ApiClientOptions) => {

      let authType = options.authType

      // ✅ AUTO AUTH DETECTION
      if (!authType) {
        if (AUTH_REQUIRED_METHODS.includes(options.method.toUpperCase())) {
          authType = 'cookie' // try cookie first ✅
        } else {
          authType = 'none'
        }
      }

      let headers: Record<string, string> = {
        ...(options.headers || {})
      }

      /* ----------------------------------------------------
         ✅ AUTH: NONE
      ----------------------------------------------------- */
      if (authType === 'none') {
        return apiRequest<T>({
          request,
          configBaseUrl: process.env.API_BASE_URL,
          page,
          ...options,
          headers
        })
      }

      /* ----------------------------------------------------
         ✅ AUTH: BASIC
      ----------------------------------------------------- */
      if (authType === 'basic') {
        if (!headers['Authorization']) {
          headers['Authorization'] = BASIC_AUTH_HEADER
        }

        return apiRequest<T>({
          request,
          configBaseUrl: process.env.API_BASE_URL,
          page,
          ...options,
          headers
        })
      }

      /* ----------------------------------------------------
         ✅ AUTH: COOKIE / BEARER + FALLBACK
      ----------------------------------------------------- */

      let effectiveHeaders = { ...headers }

      if (cachedToken) {
        if (authType === 'cookie' && !headers['Cookie']) {
          effectiveHeaders['Cookie'] = `token=${cachedToken}`
        }

        if (authType === 'bearer' && !headers['Authorization']) {
          effectiveHeaders['Authorization'] = `Bearer ${cachedToken}`
        }
      }

      const initialRequest = apiRequest<T>({
        request,
        configBaseUrl: process.env.API_BASE_URL,
        page,
        ...options,
        headers: effectiveHeaders
      })

      // ✅ refresh token if needed
      if (!cachedToken || Date.now() >= tokenExpiry) {
        getAuthToken(request).catch(() => {})
      }

      // ✅ FALLBACK: cookie → basic
      return initialRequest.then((response: any) => {

        if (
          authType === 'cookie' &&
          (response.status === 401 || response.status === 403)
        ) {
          const fallbackHeaders = {
            ...(options.headers || {}),
            Authorization: BASIC_AUTH_HEADER
          }

          return apiRequest<T>({
            request,
            configBaseUrl: process.env.API_BASE_URL,
            page,
            ...options,
            headers: fallbackHeaders
          })
        }

        return response

      }) as EnhancedApiPromise<T>
    }

    await use(client)
  },

  /* --------------------------------------------------------
     ✅ TOKEN FIXTURE
  --------------------------------------------------------- */
  authToken: async ({ request }, use) => {
    const token = await getAuthToken(request)
    cachedToken = token
    await use(token)
  }

})

export { expect }