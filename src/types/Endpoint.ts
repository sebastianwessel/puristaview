import type { SupportedHttpMethod } from '@purista/core'

export type Endpoint = {
  serviceTarget: string
  name: string
  method: SupportedHttpMethod
  path: string
}
