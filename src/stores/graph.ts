import type { SupportedHttpMethod } from '@purista/core'
import { sort } from 'fast-sort'
import { MultiDirectedGraph } from 'graphology'
import { defineStore } from 'pinia'

import { getEndpointId, getSubscriptionId } from '@/helper'
import { getCommandId } from '@/helper/getCommandId'
import { logger } from '@/logger'
import {
  type Command,
  type Endpoint,
  type Event,
  type GraphEdgeType,
  type GraphNodeType,
  NodeType,
  type Service,
  type Subscription,
} from '@/types'

import { exampleData } from './exampleData'
import { generateGraph } from './generateGraph'

export type RootState = {
  services: Service[]
  graph: MultiDirectedGraph<GraphNodeType, GraphEdgeType>
  events: Event[]
}

export const useStore = defineStore('services', {
  state: () =>
    ({
      graph: new MultiDirectedGraph<GraphNodeType, GraphEdgeType>(),
      services: [],
      events: [],
    } as RootState),
  getters: {
    /**
     * Get a service by name and version
     */
    getServiceByNameAndVersion: (state) => {
      return (name: string, version: string) =>
        state.services.find((service) => service.name === name && service.version === version)
    },
    /**
     * Group services by name
     */
    servicesGroupedByName: (state) => {
      const groupedServices = new Map<string, Service[]>()

      state.services.forEach((service) => {
        let entry = groupedServices.get(service.name)
        if (!entry) {
          entry = []
        }
        entry.push(service)
        const sortedVersions = sort(entry).by({
          desc: (u) => u.version,
          comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
        })
        groupedServices.set(service.name, sortedVersions)
      })

      const ret = Array.from(groupedServices.values())

      return sort(ret).by({
        asc: (u) => u[0].name,
        comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
      })
    },
    /**
     * Get a command by service name, service version and command name
     */
    getCommandByServiceAndName: (state) => {
      return (name: string, version: string, commandName: string): Command | undefined => {
        try {
          const id = getCommandId(name, version, commandName)
          return state.graph.getNodeAttributes(id) as Command
        } catch (err) {
          logger.error({ err, name, version, commandName }, 'getCommandByServiceAndName')
          return undefined
        }
      }
    },
    /**
     * Get a command by service name, service version and command name
     */
    getSubscriptionByServiceAndName: (state) => {
      return (name: string, version: string, subscriptionName: string): Subscription | undefined => {
        try {
          const id = getSubscriptionId(name, version, subscriptionName)
          return state.graph.getNodeAttributes(id) as Subscription
        } catch (err) {
          logger.error({ err, name, version, subscriptionName }, 'getSubscriptionByServiceAndName')
          return undefined
        }
      }
    },
    /**
     * Get a endpoint by version, method and path
     */
    getEndpointByServiceAndName: (state) => {
      return (version: string, method: SupportedHttpMethod, path: string): Endpoint | undefined => {
        try {
          const id = getEndpointId(version, method, path)
          return state.graph.getNodeAttributes(id) as Endpoint
        } catch (err) {
          logger.error({ err, version, method, path }, 'getEndpointByServiceAndName')
          return undefined
        }
      }
    },
    /**
     * Get all known events
     */
    allEvents: (state) => {
      return state.events
    },
    /** Get all known endpoints */
    allEndpoints: (state): Endpoint[] => {
      return state.graph.reduceNodes<GraphNodeType[]>((ac, _node, attr) => {
        if (attr.graphNodeType !== NodeType.Endpoint) {
          return ac
        }
        return [...ac, attr]
      }, []) as Endpoint[]
    },
    /**
     * Returns list of commands that are invoked by given node
     */
    getCommandsInvokedBy: (state) => {
      return (id: string): Command[] => {
        try {
          return Array.from(state.graph.outboundNeighborEntries(id), (node) => node.attributes).filter(
            (node) => node.graphNodeType === NodeType.Command,
          ) as Command[]
        } catch (err) {
          logger.error({ err, id }, 'getInvokedCommands')
          return []
        }
      }
    },
    /**
     * Returns list of subscriptions that are consuming the output of given node
     */
    getConsumingSubscriptions: (state) => {
      return (id: string): Subscription[] => {
        try {
          return Array.from(state.graph.outboundNeighborEntries(id), (node) => node.attributes).filter(
            (node) => node.graphNodeType === NodeType.Subscription,
          ) as Subscription[]
        } catch (err) {
          logger.error({ err, id }, 'getSubscribedSubscription')
          return []
        }
      }
    },
    /**
     * Returns a node from the graph
     */
    getGraphNode: (state) => {
      return (id: string) => {
        try {
          return state.graph.getNodeAttributes(id)
        } catch (err) {
          logger.error({ err, id }, 'getGraphNode')
        }
      }
    },
    /**
     * Returns a list of nodes which are working as input for given node
     */
    getInputNodes: (state) => {
      return (id: string): GraphNodeType[] => {
        try {
          return Array.from(state.graph.inboundNeighborEntries(id), (node) => node.attributes)
        } catch (err) {
          logger.error({ err, id }, 'getSubscribedSubscription')
          return []
        }
      }
    },
  },
  actions: {
    init(services: Service[] = exampleData) {
      this.services = services
      this.graph = new MultiDirectedGraph<GraphNodeType, GraphEdgeType>()
      const { events } = generateGraph(this.graph, services)
      this.events = events
    },
  },
})
