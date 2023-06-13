import type { Prettify } from '@purista/core'

import type { Command } from './Command'
import type { Endpoint } from './Endpoint'
import { NodeType } from './NodeType.enum'
import type { Subscription } from './Subscription'

export type Ext = {
  graphNodeType: NodeType
  serviceName: string
  serviceVersion: string
}

export type GraphNodeType = Prettify<Ext & (Command | Subscription | Endpoint)>

export const isCommand = (node: Record<string, unknown>): node is Prettify<Ext & Command> =>
  node.graphNodeType === NodeType.Command
export const isSubscription = (node: Record<string, unknown>): node is Prettify<Ext & Subscription> =>
  node.graphNodeType === NodeType.Subscription

export const isEndpoint = (node: Record<string, unknown>): node is Prettify<Ext & Endpoint> =>
  node.graphNodeType === NodeType.Endpoint
