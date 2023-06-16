import { type Edge, MarkerType, type Node as FlowNode } from '@vue-flow/core'
import { type ElkNode } from 'elkjs'

import { getCommandId, getEndpointId, getSubscriptionId } from '@/helper'
import { logger } from '@/logger'
import { useStore } from '@/stores'
import { type Command, EdgeLabel, isCommand, isEndpoint, isSubscription, NodeType } from '@/types'

function getUniqueId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0]
  return uint32.toString(16)
}

export const useDependencyGraph = () => {
  const store = useStore()

  const getDependencies = (params: {
    elk?: ElkNode
    depth?: number
    maxDepth?: number
    nodes: FlowNode[]
    edges: Edge[]
    id: string
    theNodeId?: string
    parentId?: string
    existingNodes?: Set<string>
  }) => {
    const { nodes, edges, id } = params
    const depth = params.depth === undefined ? 0 : params.depth
    const maxDepth = params.maxDepth === undefined ? 1 : params.maxDepth

    const theNode = store.getGraphNode(id)
    const theNodeId = params.theNodeId || getUniqueId()
    const existingNodes = params.existingNodes || new Set<string>()

    const root = params.elk || {
      id: getUniqueId(),
      layoutOptions: {
        algorithm: 'layered',
        'elk.direction': 'RIGHT',
        'elk.nodeLabels.placement': 'INSIDE V_CENTER H_CENTER',
        'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',

        nodeLayering: 'INTERACTIVE',
        'org.eclipse.elk.edgeRouting': 'ORTHOGONAL',
        'elk.layered.unnecessaryBendpoints': 'true',
        'elk.layered.spacing.edgeNodeBetweenLayers': '50',
        'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
        'org.eclipse.elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
        'org.eclipse.elk.insideSelfLoops.activate': 'true',
        'spacing.componentComponent': '20',
        'spacing.nodeNodeBetweenLayers': '20',
      },
      labels: [
        {
          text: 'root',
        },
      ],
      children: [],
      edges: [],
    }

    if (!theNode || depth > maxDepth || existingNodes.has(id)) {
      return {
        nodes,
        edges,
        id,
        depth,
        maxDepth,
        elk: root,
        end: true,
      }
    }

    // flowLane for flow
    const flowLane: ElkNode = {
      id: getUniqueId(),
      layoutOptions: {
        'elk.direction': 'DOWN',
      },
      labels: [
        {
          text: 'flowLane',
        },
      ],
      children: [],
      edges: [],
    }

    //
    //
    //
    //
    //
    //
    //
    // ============ add input layer
    const inputLayer: ElkNode = {
      id: getUniqueId(),
      layoutOptions: {
        'elk.direction': 'RIGHT',
      },
      children: [],
      edges: [],
      labels: [
        {
          text: 'inputLayer',
        },
      ],
    }

    //
    //
    //
    //
    //
    //
    // ============ add function layer with function
    const functionLayer: ElkNode = {
      id: getUniqueId(),
      layoutOptions: {
        'elk.direction': 'RIGHT',
      },
      children: [],
      edges: [],
      labels: [
        {
          text: 'functionLayer',
        },
      ],
    }

    functionLayer.children?.push({
      id: theNodeId,
      width: (theNode.name.length * 10 || 300) + 100,
      height: (theNode as any).eventName ? 150 : 100,
      labels: [
        {
          text: theNode.name.replaceAll('/', '').replaceAll(':', ''),
        },
      ],
    })

    nodes.push({
      type: theNode.graphNodeType,
      id: theNodeId,
      label: theNode.name,
      position: { x: 0, y: 0 },
      data: {
        ...theNode,
      },
    })

    existingNodes.add(id)

    //
    //
    //
    //
    //
    // ============ add output layer
    const outputLayer: ElkNode = {
      id: getUniqueId(),
      layoutOptions: {
        'elk.direction': 'RIGHT',
      },
      labels: [
        {
          text: 'outputLayer',
        },
      ],
      children: [],
      edges: [],
    }

    //
    //
    //
    //
    //
    // ============ add invoke layer
    let invokeLane: ElkNode = {
      id: getUniqueId(),
      layoutOptions: {
        'elk.direction': 'DOWN',
      },
      labels: [
        {
          text: 'invokeLayer',
        },
      ],
      children: [],
      edges: [],
    }

    //
    //
    //
    //
    //
    //
    //
    // ============ add inputs
    store
      .getInputNodes(id)
      .reduce((ac: { edge: Edge; node: FlowNode; nextRootId: string }[], current) => {
        const newId = getUniqueId()
        let nextRootId = ''

        if (isSubscription(theNode)) {
          nextRootId = getSubscriptionId(current.serviceName, current.serviceVersion, current.name)
        }

        if (isCommand(current)) {
          nextRootId = getCommandId(current.serviceName, current.serviceVersion, current.name)
        }

        if (isEndpoint(current)) {
          nextRootId = getEndpointId(current.serviceVersion, current.method, current.path)
        }

        if (!nextRootId.length || existingNodes.has(nextRootId)) {
          return ac
        }

        return [
          ...ac,
          {
            nextRootId,
            node: {
              id: newId,
              type: current.graphNodeType,
              position: { x: 0, y: 0 },
              label: current.name,
              data: current,
            },
            edge: {
              id: getUniqueId(),
              source: newId,
              target: theNodeId,
              label: EdgeLabel.Invoke,
              markerEnd: MarkerType.ArrowClosed,
              sourceHandle: 'bottom',
              targetHandle: 'top',
              animated: true,
            },
          },
        ]
      }, [])
      .forEach((input) => {
        const { end } = getDependencies({
          nodes,
          edges,
          id: input.nextRootId,
          depth: depth + 1,
          maxDepth,
          theNodeId: input.edge.source,
          elk: inputLayer,
          parentId: id,
          existingNodes,
        })
        if (!end) {
          edges.push(input.edge)
        }
      })

    //
    //
    //
    //
    //
    //
    //
    // ============ add outputs
    store
      .getConsumingSubscriptions(id)
      .reduce((ac: { edge: Edge; node: FlowNode; nextRootId: string }[], current) => {
        const newId = getUniqueId()
        let nextRootId = ''

        if (isCommand(current)) {
          nextRootId = getCommandId(current.serviceName, current.serviceVersion, current.name)
        }

        if (isSubscription(current)) {
          nextRootId = getSubscriptionId(current.serviceName, current.serviceVersion, current.name)
        }

        if (isEndpoint(current)) {
          nextRootId = getEndpointId(current.serviceVersion, current.method, current.path)
        }

        if (!nextRootId.length || existingNodes.has(nextRootId)) {
          return ac
        }

        if (params.parentId === nextRootId) {
          return ac
        }

        return [
          ...ac,
          {
            nextRootId,
            node: {
              id: newId,
              type: current.graphNodeType,
              position: { x: 0, y: 0 },
              label: current.name,
              data: current,
            },
            edge: {
              id: getUniqueId(),
              source: theNodeId,
              target: newId,
              label: EdgeLabel.Subscribes,
              markerEnd: MarkerType.ArrowClosed,
              sourceHandle: 'bottom',
              targetHandle: 'top',
              animated: true,
            },
          },
        ]
      }, [])
      .forEach((output) => {
        const { end } = getDependencies({
          nodes,
          edges,
          id: output.nextRootId,
          depth: depth + 1,
          maxDepth,
          theNodeId: output.edge.target,
          elk: outputLayer,
          parentId: id,
          existingNodes,
        })
        if (!end) {
          edges.push(output.edge)
        }
      })

    //
    //
    //
    //
    //
    //
    // ======== Add invocations
    if ([NodeType.Command, NodeType.Subscription].includes(theNode.graphNodeType)) {
      ;(theNode as Command).invokes
        .reduce((ac: { edge: Edge; node: FlowNode; nextRootId: string }[], address) => {
          const newId = getUniqueId()
          const nextRootId = getCommandId(address.serviceName, address.serviceVersion, address.serviceTarget)

          const cmd = store.getGraphNode(nextRootId)
          if (!cmd) {
            logger.error({ address }, 'Dependency node not found')
            return ac
          }

          if (!nextRootId.length || existingNodes.has(nextRootId)) {
            return ac
          }

          return [
            ...ac,
            {
              nextRootId,
              node: {
                id: newId,
                type: NodeType.Command,
                position: { x: 0, y: 0 },
                label: cmd.name,
                data: cmd,
              },
              edge: {
                id: getUniqueId(),
                source: theNodeId,
                target: newId,
                label: EdgeLabel.Invoke,
                markerEnd: MarkerType.ArrowClosed,
                sourceHandle: 'right',
                targetHandle: 'left',
                animated: false,
              },
            },
          ]
        }, [])
        .forEach((invoke) => {
          const { end, elk: resultElk } = getDependencies({
            nodes,
            edges,
            id: invoke.nextRootId,
            depth: depth + 1,
            maxDepth,
            elk: invokeLane,
            theNodeId: invoke.edge.target,
            parentId: id,
            existingNodes,
          })
          invokeLane = resultElk
          if (!end) {
            edges.push(invoke.edge)
          }
        })
    }

    //
    //
    //
    //
    //
    //
    //
    // ============= Add layers
    flowLane.children?.push(inputLayer)
    flowLane.edges?.push({ id: getUniqueId(), sources: [inputLayer.id], targets: [functionLayer.id] })

    flowLane.children?.push(functionLayer)

    flowLane.children?.push(outputLayer)
    flowLane.edges?.push({ id: getUniqueId(), sources: [functionLayer.id], targets: [outputLayer.id] })

    root.children?.push(flowLane)
    root.children?.push(invokeLane)
    root.edges?.push({ id: getUniqueId(), sources: [flowLane.id], targets: [invokeLane.id] })

    return {
      nodes,
      edges,
      id,
      depth,
      maxDepth,
      elk: root,
      end: false,
    }
  }
  /*
  const _getDependencies2 = (params: {
    nodes: FlowNode[]
    edges: Edge[]
    rootId: string
    depth?: number
    maxDepth?: number
    existingNodes?: Set<string>
    elk?: ElkNode
  }) => {
    const end = false
    const { nodes, edges, rootId } = params
    const depth = params.depth === undefined ? 0 : params.depth
    const maxDepth = params.maxDepth === undefined ? 1 : params.maxDepth
    const existingNodes = params.existingNodes || new Set<string>()

    let elk = params.elk || {
      id: 'root',
      layoutOptions: {
        algorithm: 'layered',
        'elk.direction': 'RIGHT',
        'elk.nodeLabels.placement': 'INSIDE V_CENTER H_CENTER',
        'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',

        nodeLayering: 'INTERACTIVE',
        'org.eclipse.elk.edgeRouting': 'ORTHOGONAL',
        'elk.layered.unnecessaryBendpoints': 'true',
        'elk.layered.spacing.edgeNodeBetweenLayers': '50',
        'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
        'org.eclipse.elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
        'org.eclipse.elk.insideSelfLoops.activate': 'true',
        'spacing.componentComponent': '20',
        'spacing.nodeNodeBetweenLayers': '20',
      },
      children: [],
      edges: [],
    }

    if (params.elk) {
      const newRoot = {
        id: `root_${getUniqueId}`,
        layoutOptions: {
          'elk.direction': 'RIGHT',
        },
        children: [],
        edges: [],
      }
      elk.children?.push(newRoot)
      elk = newRoot
    }

    const rootNode = store.getGraphNode(rootId)

    if (!rootNode || depth > maxDepth || existingNodes.has(rootId)) {
      return {
        nodes,
        edges,
        rootId,
        depth,
        maxDepth,
        existingNodes,
        elk,
        end: true,
      }
    }

    // ================ ADD ROOT LAYER
    const rootLane: ElkNode = {
      id: `root_${rootId}`,
      layoutOptions: {
        'elk.direction': 'DOWN',
      },
      children: [],
      edges: [],
    }
    elk.children?.push(rootLane)

    const parentNode = {
      type: rootNode.graphNodeType,
      id: rootId,
      label: rootNode.name,
      position: { x: 0, y: 0 },
      data: {
        ...rootNode,
      },
    }

    nodes.push(parentNode)
    existingNodes.add(rootId)

    rootLane.children?.push({
      id: rootId,
      width: (rootNode.name.length * 10 || 300) + 100,
      height: (rootNode as any).eventName ? 150 : 100,
    })

    // ================ ADD Input LAYER

    const inputs = store.getInputNodes(rootId).reduce((ac: { edge: Edge; node: FlowNode }[], node) => {
      const n: FlowNode = {
        id: '',
        type: node.graphNodeType,
        position: { x: 0, y: 0 },
        label: node.name,
        data: node,
      }

      if (isCommand(node)) {
        n.id = getCommandId(node.serviceName, node.serviceVersion, node.name)
      }

      if (isSubscription(node)) {
        return ac
        // n.id = getSubscriptionId(node.serviceName, node.serviceVersion, node.name)
      }

      if (isEndpoint(node)) {
        n.id = getEndpointId(node.serviceVersion, node.method, node.path)
      }

      return [
        ...ac,
        {
          node: n,
          edge: {
            id: getUniqueId(),
            target: rootId,
            source: n.id,
            label: EdgeLabel.Invoke,
            markerEnd: MarkerType.ArrowClosed,
            sourceHandle: 'bottom',
            targetHandle: 'top',
            animated: true,
          },
        },
      ]
    }, [])

    if (inputs.length) {
      inputs.forEach(({ node, edge }) => {
        edges.push(edge)
        const res = getDependencies({
          nodes,
          edges,
          rootId: node.id,
          depth: depth + 1,
          maxDepth,
          existingNodes,
          elk: rootLane,
        })

        if (res.end) {
          return {
            nodes,
            edges,
            rootId,
            depth: depth + 1,
            maxDepth,
            existingNodes,
            elk,
            end,
          }
        }

        rootLane.edges?.push({
          id: getUniqueId(),
          targets: [rootId],
          sources: [`root_${node.id}`],
        })
      })
    }

    // ================ ADD OUTPUT LAYER
    const outputs = store.getConsumingSubscriptions(rootId).reduce((ac: { edge: Edge; node: FlowNode }[], node) => {
      const n: FlowNode = {
        id: '',
        type: node.graphNodeType,
        position: { x: 0, y: 0 },
        label: node.name,
        data: node,
      }

      if (isCommand(node)) {
        n.id = getCommandId(node.serviceName, node.serviceVersion, node.name)
      }

      if (isSubscription(node)) {
        n.id = getSubscriptionId(node.serviceName, node.serviceVersion, node.name)
      }

      if (isEndpoint(node)) {
        n.id = getEndpointId(node.serviceVersion, node.method, node.path)
      }

      return [
        ...ac,
        {
          node: n,
          edge: {
            id: getUniqueId(),
            source: rootId,
            target: n.id,
            label: EdgeLabel.Subscribes,
            markerEnd: MarkerType.ArrowClosed,
            sourceHandle: 'bottom',
            targetHandle: 'top',
            animated: true,
          },
        },
      ]
    }, [])

    if (outputs.length) {
      outputs.forEach(({ node, edge }) => {
        edges.push(edge)

        const res = getDependencies({
          nodes,
          edges,
          rootId: node.id,
          depth: depth + 1,
          maxDepth,
          existingNodes,
          elk: rootLane,
        })
        if (res.end) {
          return {
            nodes,
            edges,
            rootId,
            depth: depth + 1,
            maxDepth,
            existingNodes,
            elk,
            end,
          }
        }

        elk.edges?.push({
          id: getUniqueId(),
          sources: [rootId],
          targets: [`root_${node.id}`],
        })
      })
    }

    // ================ ADD INVOCATIONS

    if (![NodeType.Command, NodeType.Subscription].includes(rootNode.graphNodeType)) {
      return {
        nodes,
        edges,
        rootId,
        depth: depth + 1,
        maxDepth,
        existingNodes,
        elk,
        end,
      }
    }

    const invokes = (rootNode as Command).invokes.reduce((ac: { edge: Edge; node: FlowNode }[], address) => {
      const id = getCommandId(address.serviceName, address.serviceVersion, address.serviceTarget)

      const cmd = store.getGraphNode(id)
      if (!cmd) {
        logger.error({ address }, 'Dependency node not found')
        return ac
      }

      const n: FlowNode = {
        id,
        type: NodeType.Command,
        position: { x: 0, y: 0 },
        label: cmd.name,
        data: cmd,
      }

      return [
        ...ac,
        {
          node: n,
          edge: {
            id: getUniqueId(),
            source: rootId,
            target: n.id,
            label: EdgeLabel.Invoke,
            markerEnd: MarkerType.ArrowClosed,
            sourceHandle: 'right',
            targetHandle: 'left',
            animated: false,
          },
        },
      ]
    }, [])

    if (invokes.length) {
      invokes.forEach(({ node, edge }) => {
        edges.push(edge)

        const id = `root_${getUniqueId()}`
        const invokeLane: ElkNode = {
          id,
          layoutOptions: {
            'elk.direction': 'RIGHT',
          },
          children: [],
          edges: [],
        }
        elk.children?.push(invokeLane)
        elk.edges?.push({
          id: getUniqueId(),
          sources: [rootLane.id],
          targets: [invokeLane.id],
        })

        const res = getDependencies({
          nodes,
          edges,
          rootId: node.id,
          depth: depth + 1,
          maxDepth,
          existingNodes,
          elk: invokeLane,
        })
        if (res.end) {
          return {
            nodes,
            edges,
            rootId,
            depth: depth + 1,
            maxDepth,
            existingNodes,
            elk,
            end,
          }
        }
      })
    }

    // ================ RETURN
    return {
      nodes,
      edges,
      rootId,
      depth: depth + 1,
      maxDepth,
      existingNodes,
      elk,
      end,
    }
  }
*/
  return {
    getDependencies,
  }
}
