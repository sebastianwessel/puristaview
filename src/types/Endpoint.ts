import type { ContentType, SupportedHttpMethod } from '@purista/core'
import type { OpenAPIV3 } from 'openapi-types'

export type Endpoint = {
  name: string
  serviceTarget: string
  title: string
  summary?: string
  description: string
  method: SupportedHttpMethod
  path: string
  tags: string[]
  parameter: { name: string; required: boolean }[]
  isProtected: boolean
  isDeprecated: boolean
  errorCodes: []
  operationId?: string
  /** indicate content type for input */
  contentTypeInput?: ContentType
  /** indicate encoding for input */
  contentEncodingInput?: string
  /** OpenAPI output schema */
  outputSchema?: OpenAPIV3.SchemaObject
  /** indicate content type for output */
  contentTypeOutput?: ContentType
  /** indicate encoding for output */
  contentEncodingOutput?: string
}
