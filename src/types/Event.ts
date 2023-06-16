export type Event = {
  name: string
  producer: {
    serviceTarget: string
    serviceName: string
    serviceVersion: string
  }
}
