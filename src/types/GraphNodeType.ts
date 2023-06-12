import type { Prettify } from '@purista/core'

import type { Command } from './Command'
import type { Endpoint } from './Endpoint'
import { NodeType } from './NodeType.enum'
import type { Subscription } from './Subscription'

type ext = {
  graphNodeType: NodeType
  serviceName: string
  serviceVersion: string
}

export type GraphNodeType = Prettify<ext & (Command | Subscription | Endpoint)>

export const isCommand = (node: Record<string, unknown>): node is Prettify<ext & Command> =>
  node.graphNodeType === NodeType.Command
export const isSubscription = (node: Record<string, unknown>): node is Prettify<ext & Subscription> =>
  node.graphNodeType === NodeType.Subscription

export const isEndpoint = (node: Record<string, unknown>): node is Prettify<ext & Endpoint> =>
  node.graphNodeType === NodeType.Endpoint
