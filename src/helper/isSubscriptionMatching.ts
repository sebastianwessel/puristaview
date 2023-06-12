import { logger } from '@/logger'
import type { Subscription } from '@/types'

export const isSubscriptionMatching = (subscription: Subscription, msg: any) => {
  const sub = subscription.subscribesTo

  logger.debug({ subscription, msg })

  if (sub.eventname && sub.eventname !== msg.eventName) {
    return false
  }

  if (sub.messageType && sub.messageType !== msg.messageType) {
    return false
  }

  if (sub.sender?.name && sub.sender.name !== msg.sender?.serviceName) {
    return false
  }

  if (sub.sender?.version && sub.sender.version !== msg.sender?.serviceVersion) {
    return false
  }

  if (sub.sender?.target && sub.sender.target !== msg.sender?.serviceTarget) {
    return false
  }

  return true
}
