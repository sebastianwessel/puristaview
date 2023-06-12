import { type EBMessageAddress, EBMessageType, getUniqueId } from '@purista/core'
import { type Edge, MarkerType, type Node as FlowNode } from '@vue-flow/core'

import { isSubscriptionMatching } from '@/helper/isSubscriptionMatching'
import { useStore } from '@/stores'

export const useCommandNode = () => {
  const store = useStore()

  const addInputCommands = () => {}

  const addInvokingCommands = (params: {
    address: EBMessageAddress
    parentNode: FlowNode
    depth?: number
    maxDepth?: number
    nodes?: FlowNode[]
    edges?: Edge[]
  }) => {
    const nodes: FlowNode[] = params.nodes || [params.parentNode]
    const edges: Edge[] = params.edges || []
    const depth = params.depth || 0
    const parentNode = params.parentNode
    const maxDepth = params.maxDepth || 1

    store.getInvokedCommands

    store.getInvokingCommands(params.address).forEach((invoke) => {
      const node: FlowNode = {
        type: 'command',
        id: `command_${invoke.serviceName}_${invoke.serviceVersion}_${invoke.serviceTarget}`,
        label: invoke.serviceTarget,
        position: { x: 0, y: 0 },
        data: {
          width: invoke.serviceTarget.length,
          serviceName: invoke.serviceName,
          serviceVersion: invoke.serviceVersion,
        },
      }

      nodes.push(node)

      edges.push({
        id: getUniqueId(),
        target: parentNode.id,
        source: node.id,
        markerEnd: MarkerType.ArrowClosed,
        markerStart: MarkerType.ArrowClosed,
        sourceHandle: 'right',
        targetHandle: 'left',
        label: 'invokes',
      })
    })

    return { edges, nodes, parentNode, depth, maxDepth }
  }

  const addInvokingSubscriptions = (params: {
    address: EBMessageAddress
    parentNode: FlowNode
    depth?: number
    maxDepth?: number
    nodes?: FlowNode[]
    edges?: Edge[]
  }) => {
    const nodes: FlowNode[] = params.nodes || [params.parentNode]
    const edges: Edge[] = params.edges || []
    const depth = params.depth || 0
    const parentNode = params.parentNode
    const maxDepth = params.maxDepth || 1

    store.getInvokingSubscriptions(params.address).forEach((invoke) => {
      const node: FlowNode = {
        type: 'subscription',
        id: `subscription_${invoke.serviceName}_${invoke.serviceVersion}_${invoke.serviceTarget}`,
        label: invoke.serviceTarget,
        position: { x: 0, y: 0 },
        data: {
          width: invoke.serviceTarget.length,
          serviceName: invoke.serviceName,
          serviceVersion: invoke.serviceVersion,
        },
      }

      nodes.push(node)

      edges.push({
        id: getUniqueId(),
        target: parentNode.id,
        source: node.id,
        markerEnd: MarkerType.ArrowClosed,
        markerStart: MarkerType.ArrowClosed,
        sourceHandle: 'right',
        targetHandle: 'left',
        label: 'invokes',
      })
    })
    return { edges, nodes, parentNode, depth, maxDepth }
  }

  const addInvokes = (params: {
    invokes: EBMessageAddress[]
    parentNode: FlowNode
    depth?: number
    maxDepth?: number
    nodes?: FlowNode[]
    edges?: Edge[]
  }) => {
    const nodes: FlowNode[] = params.nodes || [params.parentNode]
    const edges: Edge[] = params.edges || []
    const depth = params.depth || 0
    const parentNode = params.parentNode
    const maxDepth = params.maxDepth || 1
    const invokes = params.invokes

    if (!invokes.length || depth >= maxDepth) {
      return { edges, nodes, parentNode, depth, maxDepth }
    }

    store.services.forEach((service) => {
      service.commands.forEach((command) => {
        const cmd = invokes.find(
          (inv) =>
            inv.serviceName === service.name &&
            inv.serviceVersion === service.version &&
            inv.serviceTarget === command.name,
        )
        if (!cmd) {
          return
        }
        const node: FlowNode = {
          type: 'command',
          id: `command_${service.name}_${service.version}_${command.name}`,
          label: command.name,
          position: { x: 0, y: 0 },
          data: {
            width: command.name.length,
            serviceName: service.name,
            serviceVersion: service.version,
          },
        }

        parentNode.data.hasInvokes = true

        nodes.push(node)

        edges.push({
          id: getUniqueId(),
          source: parentNode.id,
          sourceHandle: 'right',
          target: node.id,
          targetHandle: 'left',
          markerStart: MarkerType.ArrowClosed,
          markerEnd: MarkerType.ArrowClosed,
          label: 'invokes',
        })

        /**
        addInvokingCommands({
          address: {
            serviceName: service.name,
            serviceVersion: service.version,
            serviceTarget: command.name,
          },
          nodes,
          edges,
          parentNode: node,
          maxDepth,
          depth: depth + 1,
        })

        addInvokingSubscriptions({
          address: {
            serviceName: service.name,
            serviceVersion: service.version,
            serviceTarget: command.name,
          },
          nodes,
          edges,
          parentNode: node,
          maxDepth,
          depth: depth + 1,
        })

         */

        const subMsg = {
          messageType: EBMessageType.CommandSuccessResponse,
          sender: {
            serviceName: service.name,
            serviceVersion: service.version,
            serviceTarget: command.name,
          },
          eventName: command.eventName,
        }

        addSubscriptionNodes({
          msg: subMsg,
          parentNode: node,
          depth: depth + 1,
          maxDepth,
          nodes,
          edges,
        })
      })
    })

    return { edges, nodes, parentNode, depth: depth + 1, maxDepth }
  }

  const addSubscriptionNodes = (params: {
    msg: any
    parentNode: FlowNode
    depth?: number
    maxDepth?: number
    nodes?: FlowNode[]
    edges?: Edge[]
  }) => {
    const nodes: FlowNode[] = params.nodes || [params.parentNode]
    const edges: Edge[] = params.edges || []
    const depth = params.depth || 0
    const parentNode = params.parentNode
    const maxDepth = params.maxDepth || 1

    if (depth >= maxDepth) {
      return { edges, nodes, parentNode, depth, maxDepth }
    }

    store.services.forEach((service) => {
      service.subscriptions.forEach((subscription) => {
        if (isSubscriptionMatching(subscription, params.msg)) {
          const sub = {
            type: 'subscription',
            id: `subscription_${service.name}_${service.version}_${subscription.name}`,
            label: subscription.name,
            position: { x: 0, y: 0 },
            data: {
              width: subscription.name.length,
              serviceName: service.name,
              serviceVersion: service.version,
              eventName: subscription.eventName,
            },
          }

          nodes.push(sub)

          edges.push({
            id: getUniqueId(),
            source: parentNode.id,
            target: sub.id,
            animated: true,
            markerEnd: MarkerType.ArrowClosed,
            label: 'consumes',
          })

          const subMsg = {
            messageType: EBMessageType.CustomMessage,
            sender: {
              serviceName: service.name,
              serviceVersion: service.version,
              serviceTarget: subscription.name,
            },
            eventName: subscription.eventName,
          }

          addSubscriptionNodes({
            msg: subMsg,
            parentNode: sub,
            depth: depth + 1,
            maxDepth,
            nodes,
            edges,
          })

          addInvokes({
            invokes: subscription.invokes,
            parentNode: sub,
            depth: depth + 1,
            maxDepth,
            nodes,
            edges,
          })
        }
      })
    })

    return { edges, nodes, parentNode, depth: depth + 1, maxDepth }
  }

  return {
    addSubscriptionNodes,
    addInvokes,
    addInputCommands,
    addInvokingCommands,
    addInvokingSubscriptions,
  }
}
