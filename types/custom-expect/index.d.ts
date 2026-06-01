import "@playwright/test";

export {};

declare module "@playwright/test" {
  interface Matchers<R, T = unknown> {
    toBeValidDateFormat(this: Matchers<unknown, string>): R;

    toBeNotNull(this: Matchers<unknown, unknown>): R;
  }
}
