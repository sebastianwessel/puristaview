import type { EBMessageAddress, Prettify } from '@purista/core'
import { OpenAPIV3 } from 'openapi-types'

import type { Endpoint } from './Endpoint'

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
  /** OpenAPI output schema */
  outputSchema?: OpenAPIV3.SchemaObject
  /** event name for output published as custom message */
  eventName?: string
  /** list if commands which are invked during subscription execution */
  invokes: EBMessageAddress[]
  /** List of possible custom events the subscription publishes during execution */
  publishesCustomEvents: CustomEvent[]
  /** command is exposed as REST-API endpoint */
  restApi?: Omit<Endpoint, 'name' | 'description' | 'title' | 'serviceTarget'>
}>
