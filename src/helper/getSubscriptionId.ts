/** get the unique id of a subscriptions */
export const getSubscriptionId = (serviceName: string, serviceVersion: string, subscriptionName: string) =>
  `subscription_${serviceName}_${serviceVersion}_${subscriptionName}`
