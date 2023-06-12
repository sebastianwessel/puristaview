import type { SupportedHttpMethod } from '@purista/core'

export type Endpoint = {
  name: string
  method: SupportedHttpMethod
  path: string
}
