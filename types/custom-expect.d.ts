import '@playwright/test'

export {}

declare module '@playwright/test' {
  interface Matchers<R> {
    toBeValidDateFormat(): R
  }
}