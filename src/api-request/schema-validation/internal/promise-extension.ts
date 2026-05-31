/** Promise extension to add validateSchema method to promises */

import type {
  SupportedSchema,
  ValidateSchemaOptions,
  ValidatedApiResponse
} from '../types'
import type { EnhancedApiResponse } from '../internal/response-extension'
import { infer as zInfer } from 'zod'
import type { ZodType } from 'zod'

type AnyZodSchema = ZodType<any, any, any>

/** Enhanced Promise with validateSchema method */
export interface EnhancedApiPromise<T = unknown> extends Promise<
  EnhancedApiResponse<T>
> {
validateSchema<
  TSchema extends SupportedSchema
>(
  schema: TSchema,
  options?: ValidateSchemaOptions
): Promise<
  ValidatedApiResponse<
    TSchema extends AnyZodSchema ? zInfer<TSchema> : T
  >
>

}

/** Create enhanced promise with validateSchema method */
export function createEnhancedPromise<T>(
  promise: Promise<EnhancedApiResponse<T>>
): EnhancedApiPromise<T> {
  const enhanced = promise as EnhancedApiPromise<T>

  enhanced.validateSchema = async <TValidated = T>(
    schema: SupportedSchema,
    options: ValidateSchemaOptions = {}
  ): Promise<ValidatedApiResponse<TValidated>> => {
    const response = await promise
    return response.validateSchema<TValidated>(schema, options)
  }

  return enhanced
}