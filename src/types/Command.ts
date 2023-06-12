import type { ContentType, EBMessageAddress, Prettify, SupportedHttpMethod } from '@purista/core'
import { OpenAPIV3 } from 'openapi-types'

export type Command = Prettify<{
  /** name of the command */
  name: string
  /** mark command as deprecated */
  deprecated?: boolean
  /** description of the command */
  description: string
  /** markdown content extracted from readme.md file */
  markdown?: string
  /** OpenAPI parameter schema */
  parameterSchema?: OpenAPIV3.SchemaObject
  /** OpenAPI input schema */
  inputSchema?: OpenAPIV3.SchemaObject
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
  /** event name for output published as custom message */
  eventName?: string
  /** list if commands which are invked during subscription execution */
  invokes: EBMessageAddress[]
  /** List of possible custom events the subscription publishes during execution */
  publishesCustomEvents: CustomEvent[]
  /** command is exposed as REST-API endpoint */
  restApi?: {
    method: SupportedHttpMethod
    path: string
  }
}>
