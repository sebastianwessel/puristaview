import type {
  ContentType,
  DefinitionEventBridgeConfig,
  EBMessageAddress,
  EBMessageType,
  InstanceId,
  Prettify,
  PrincipalId,
} from '@purista/core'
import { OpenAPIV3 } from 'openapi-types'

export type CustomEvent = {
  eventName: string
  description: string
  isHappyPath: boolean
}

/**
 * A subscription
 */
export type Subscription = Prettify<{
  /** name of the subscription */
  name: string
  /** mark subscription as deprecated */
  deprecated?: boolean
  /** description of the subscription */
  description: string
  /** markdown content extracted from readme.md file */
  markdown?: string
  /** name of the subscription */
  subscribesTo: {
    /** the event name to subscribe to */
    eventname?: string
    /** subscribe to specific message type */
    messageType?: EBMessageType
    /** subscribe to specific principalId */
    principalId?: PrincipalId
    /** subscribe message published by sender which matches given criteria */
    sender?: {
      /** subscribe to a message published by service with name */
      name?: string
      /** subscribe to a message published by service with version */
      version?: string
      /** subscribe to a message published by given name of command/subscription */
      target?: string
      /** subscribe to a message published by specific instanceId */
      instanceId?: InstanceId
    }
    /** subscribe message received by sender which matches given criteria */
    receiver?: {
      /** subscribe to a message received by service with name */
      name?: string
      /** subscribe to a message received by service with version */
      version?: string
      /** subscribe to a message received by given name of command/subscription */
      target?: string
      /** subscribe to a message received by specific instanceId */
      instanceId?: InstanceId
    }
  }
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
  /** further information about message delivery and handling on broker level */
  eventBridgeConfig?: DefinitionEventBridgeConfig
}>
