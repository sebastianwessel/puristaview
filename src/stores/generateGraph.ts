import type { EBMessageType } from '@purista/core'
import type { MultiDirectedGraph } from 'graphology'

import { getCommandId, getEndpointId, getSubscriptionId, isSubscriptionMatching } from '@/helper'
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
        deprecated: service.deprecated || command.deprecated,
      })

      if (command.restApi) {
        graph.addNode(getEndpointId(service.version, command.restApi.method, command.restApi.path), {
          ...command.restApi,
          name: `${command.restApi.method}: v${service.version}/${command.restApi.path}`,
          title: command.name,
          description: command.description,
          summary: command.restApi.summary,
          serviceName: service.name,
          serviceVersion: service.version,
          serviceTarget: command.name,
          graphNodeType: NodeType.Endpoint,
          outputSchema: command.outputSchema,
          inputSchema: command.inputSchema,
        })
      }
    })
    service.subscriptions.forEach((subscription) => {
      graph.addNode(getSubscriptionId(service.name, service.version, subscription.name), {
        serviceName: service.name,
        serviceVersion: service.version,
        graphNodeType: NodeType.Subscription,
        ...subscription,
        deprecated: service.deprecated || subscription.deprecated,
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

    service.subscriptions.forEach((subscription) => {
      const subId = getSubscriptionId(service.name, service.version, subscription.name)

      subscription.invokes.forEach((invoke) => {
        const id = getCommandId(invoke.serviceName, invoke.serviceVersion, invoke.serviceTarget)
        graph.addDirectedEdge(subId, id, { label: EdgeLabel.Invoke, relation: Relation.Invokes })
      })

      services.forEach((s) =>
        s.commands.forEach((command) => {
          const cmdId = getCommandId(s.name, s.version, command.name)

          const msg = {
            messageType: EBMessageType.CommandSuccessResponse,
            sender: {
              serviceName: s.name,
              serviceVersion: s.version,
              serviceTarget: command.name,
            },
            eventName: command.eventName,
          }

          if (isSubscriptionMatching(subscription, msg)) {
            graph.addDirectedEdge(cmdId, subId, { label: EdgeLabel.Subscribes, relation: Relation.Subscribes })
          }
        }),
      )

      services.forEach((s) =>
        s.subscriptions.forEach((sub) => {
          const subId2 = getSubscriptionId(s.name, s.version, sub.name)

          const msg = {
            messageType: EBMessageType.CommandSuccessResponse,
            sender: {
              serviceName: s.name,
              serviceVersion: s.version,
              serviceTarget: sub.name,
            },
            eventName: sub.eventName,
          }

          if (isSubscriptionMatching(subscription, msg)) {
            graph.addDirectedEdge(subId2, subId, { label: EdgeLabel.Subscribes, relation: Relation.Subscribes })
          }
        }),
      )
    })
  })

  return { events }
}
