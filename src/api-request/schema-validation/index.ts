/** Schema validation exports */

export { validateSchema, detectSchemaFormat } from './core'
export type {
  SupportedSchema,
  ValidationMode,
  ShapeValidator,
  ShapeAssertion,
  ValidateSchemaOptions,
  ValidationErrorDetail,
  ValidationResult,
  ValidatedApiResponse
} from '../schema-validation/types'
export { ValidationError } from '../schema-validation/types'

// Export the validateSchema fixture
export { test } from './fixture'