import { getUniqueId } from '@purista/core'
import { type Edge, type GraphNode, MarkerType, type Node as FlowNode } from '@vue-flow/core'
import { type ElkNode } from 'elkjs'

import { getCommandId, getEndpointId, getSubscriptionId } from '@/helper'
import { useStore } from '@/stores'
import { EdgeLabel, isCommand, isEndpoint, isSubscription } from '@/types'

export const useDependencyGraph = () => {
  const store = useStore()

  const getDependencies = (params: {
    nodes: FlowNode[]
    edges: Edge[]
    rootId: string
    depth?: number
    maxDepth?: number
    existingNodes?: Set<string>
    elk?: ElkNode
  }) => {
    const { nodes, edges, rootId } = params
    const depth = params.depth === undefined ? 1 : params.depth
    const maxDepth = params.maxDepth === undefined ? 1 : params.maxDepth
    const existingNodes = params.existingNodes || new Set<string>()
    const elk = params.elk || {
      id: 'root',
      layoutOptions: {
        'elk.nodeLabels.placement': 'INSIDE V_CENTER H_CENTER',
        'elk.direction': 'RIGHT',
        nodeLayering: 'INTERACTIVE',
        'org.eclipse.elk.edgeRouting': 'ORTHOGONAL',
        'elk.layered.unnecessaryBendpoints': 'true',
        'elk.layered.spacing.edgeNodeBetweenLayers': '50',
        'org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
        'org.eclipse.elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
        'org.eclipse.elk.insideSelfLoops.activate': 'true',
        'spacing.componentComponent': '20',
        'spacing.nodeNodeBetweenLayers': '20',

        /*
        algorithm: 'layered',
        // 'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
        'elk.layered.nodePlacement.strategy': 'SIMPLE',
        'spacing.nodeNodeBetweenLayers': '40',
        'elk.direction': 'DOWN',
        */
      },
      children: [],
      edges: [],
    }

    const rootNode = store.getGraphNode(rootId)

    if (!rootNode || depth > maxDepth) {
      return
    }

    // ================ ADD ROOT LAYER
    const rootLane: ElkNode = {
      id: `root_${rootId}`,
      layoutOptions: {
        'elk.direction': 'RIGHT',
      },
      children: [],
      edges: [],
    }
    elk.children?.push(rootLane)

    if (!existingNodes.has(rootId)) {
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
    }

    rootLane.children?.push({
      id: rootId,
      width: (rootNode.name.length * 10 || 300) + 100,
      height: (rootNode as any).eventName ? 150 : 100,
    })

    // ================ ADD Input LAYER
    const inputs = store.getInputNodes(rootId).reduce((ac: { edge: Edge; node: GraphNode }[], node) => {
      const n: GraphNode = {
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
            target: rootId,
            source: n.id,
            label: EdgeLabel.Invoke,
            markerEnd: MarkerType.ArrowClosed,
            sourceHandle: 'bottom',
            targetHandle: 'top',
          },
        },
      ]
    }, [])

    if (inputs.length) {
      inputs.forEach(({ node, edge }) => {
        edges.push(edge)
        getDependencies({ nodes, edges, rootId: node.id, depth: depth + 1, maxDepth, existingNodes, elk })
        elk.edges?.push({
          id: getUniqueId(),
          targets: [`root_${rootId}`],
          sources: [`root_${node.id}`],
        })
      })
    }

    // ================ ADD OUTPUT LAYER
    const outputs = store.getInputNodes(rootId).reduce((ac: { edge: Edge; node: GraphNode }[], node) => {
      const n: GraphNode = {
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
            target: rootId,
            source: n.id,
            label: EdgeLabel.Invoke,
            markerEnd: MarkerType.ArrowClosed,
            sourceHandle: 'bottom',
            targetHandle: 'top',
          },
        },
      ]
    }, [])

    if (outputs.length) {
      outputs.forEach(({ node, edge }) => {
        edges.push(edge)
        getDependencies({ nodes, edges, rootId: node.id, depth: depth + 1, maxDepth, existingNodes, elk })
        elk.edges?.push({
          id: getUniqueId(),
          sources: [`root_${rootId}`],
          targets: [`root_${node.id}`],
        })
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
    }
  }

  return {
    getDependencies,
  }
}
