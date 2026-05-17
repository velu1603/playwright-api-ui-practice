import { test as base, expect } from '@playwright/test'
import { apiRequest, type ApiRequestParams } from '../src/api-request/api-request'
import type { EnhancedApiPromise } from '../src/api-request/schema-validation/internal/promise-extension'

type ApiClient = <T = unknown>(
  options: Omit<ApiRequestParams, 'request' | 'configBaseUrl' | 'page'>
) => EnhancedApiPromise<T>

type Fixtures = {
  apiClient: ApiClient
}

export const test = base.extend<Fixtures>({
  apiClient: async ({ request, page }, use) => {
    const client: ApiClient = <T = unknown>(
      options: Omit<ApiRequestParams, 'request' | 'configBaseUrl' | 'page'>
    ) => {
      return apiRequest<T>({
        request,
        configBaseUrl: process.env.API_BASE_URL,
        page,
        ...options
      }) as EnhancedApiPromise<T>
    }

    await use(client)
  }
})
export { expect }

