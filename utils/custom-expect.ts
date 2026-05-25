import { expect } from '@playwright/test'

expect.extend({
  toBeValidDateFormat(received: string) {

    const regex = /^\d{4}-\d{2}-\d{2}$/
    const pass = regex.test(received)

    if (pass) {
      return {
        pass: true,
        message: () => `Expected ${received} NOT to be a valid YYYY-MM-DD date`
      }
    }

    return {
      pass: false,
      message: () => `Expected ${received} to be a valid YYYY-MM-DD date`
    }
  }
})