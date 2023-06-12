import type { MultiDirectedGraph } from 'graphology'

import { getCommandId, getEndpointId, getSubscriptionId } from '@/helper'
import { logger } from '@/logger'
import {
  EdgeLabel,
  type Event,
  type GraphEdgeType,
  type GraphNodeType,
  NodeType,
  Relation,
  type Service,
} from '@/types'

export const generateGraph = (graph: MultiDirectedGraph<GraphNodeType, GraphEdgeType>, services: Service[]) => {
  logger.debug('generating graph')

  const events: Event[] = []

  // add nodes
  services.forEach((service) => {
    service.commands.forEach((command) => {
      graph.addNode(getCommandId(service.name, service.version, command.name), {
        serviceName: service.name,
        serviceVersion: service.version,
        graphNodeType: NodeType.Command,
        ...command,
      })

      if (command.restApi) {
        graph.addNode(getEndpointId(service.version, command.restApi.method, command.restApi.path), {
          name: `${command.restApi.method}: v${service.version}/${command.restApi.path}`,
          serviceName: service.name,
          serviceVersion: service.version,
          graphNodeType: NodeType.Endpoint,
          ...command.restApi,
        })
      }
    })
    service.subscriptions.forEach((subscription) => {
      graph.addNode(getSubscriptionId(service.name, service.version, subscription.name), {
        serviceName: service.name,
        serviceVersion: service.version,
        graphNodeType: NodeType.Subscription,
        ...subscription,
      })
    })
  })

  // add edges
  services.forEach((service) => {
    service.commands.forEach((command) => {
      const cmdId = getCommandId(service.name, service.version, command.name)

      command.invokes.forEach((invoke) => {
        const id = getCommandId(invoke.serviceName, invoke.serviceVersion, invoke.serviceTarget)
        graph.addDirectedEdge(cmdId, id, { label: EdgeLabel.Invoke, relation: Relation.Invokes })
      })

      if (command.restApi) {
        const id = getEndpointId(service.version, command.restApi.method, command.restApi.path)
        graph.addDirectedEdge(id, cmdId, { label: EdgeLabel.Invoke, relation: Relation.Invokes })
      }
    })
  })

  return { events }
}
