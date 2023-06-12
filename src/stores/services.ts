import type { EBMessageAddress } from '@purista/core'
import { sort } from 'fast-sort'
import { defineStore } from 'pinia'

import type { Service } from '@/types'

import { exampleData } from './exampleData'

export type RootState = {
  services: Service[]
}

export const useServicesStore = defineStore('services', {
  state: () => ({ services: exampleData } as RootState),
  getters: {
    getServiceByNameAndVersion: (state) => {
      return (name: string, version: string) =>
        state.services.find((service) => service.name === name && service.version === version)
    },
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

    eventNames: (state) =>
      Array.from(
        state.services.reduce((list, service) => {
          service.commands.forEach((command) => {
            if (command.eventName) {
              list.add(command.eventName)
            }
          })

          service.subscriptions.forEach((subscription) => {
            if (subscription.eventName) {
              list.add(subscription.eventName)
            }
          })

          return list
        }, new Set()),
      ),

    restEndpointCount: (state) =>
      state.services.reduce((count, service) => {
        const endpointCount = service.commands.reduce((c, command) => {
          if (command.restApi) {
            return c
          }
          return c + 1
        }, 0)

        return count + endpointCount
      }, 0),

    getCommandByServiceAndName: (state) => {
      return (name: string, version: string, commandName: string) => {
        const service = state.services.find((s) => s.name === name && s.version === version)

        if (!service) {
          return
        }

        return service.commands.find((c) => c.name === commandName)
      }
    },

    getSubscriptionByServiceAndName: (state) => {
      return (name: string, version: string, subscriptionName: string) => {
        const service = state.services.find((s) => s.name === name && s.version === version)

        if (!service) {
          return
        }

        return service.subscriptions.find((s) => s.name === subscriptionName)
      }
    },

    getInvokingCommands: (state) => {
      return (address: EBMessageAddress) => {
        const invocations: EBMessageAddress[] = []

        state.services.forEach((service) => {
          service.commands.forEach((command) => {
            command.invokes.forEach((invoke) => {
              if (
                invoke.serviceName === address.serviceName &&
                invoke.serviceVersion === address.serviceVersion &&
                invoke.serviceTarget === address.serviceTarget
              ) {
                invocations.push({
                  serviceName: service.name,
                  serviceVersion: service.version,
                  serviceTarget: command.name,
                })
              }
            })
          })
        })

        return invocations
      }
    },

    getInvokingSubscriptions: (state) => {
      return (address: EBMessageAddress) => {
        const invocations: EBMessageAddress[] = []

        state.services.forEach((service) => {
          service.subscriptions.forEach((subscription) => {
            subscription.invokes.forEach((invoke) => {
              if (
                invoke.serviceName === address.serviceName &&
                invoke.serviceVersion === address.serviceVersion &&
                invoke.serviceTarget === address.serviceTarget
              ) {
                invocations.push({
                  serviceName: service.name,
                  serviceVersion: service.version,
                  serviceTarget: subscription.name,
                })
              }
            })
          })
        })

        return invocations
      }
    },
  },
})
