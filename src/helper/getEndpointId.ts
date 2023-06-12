import type { SupportedHttpMethod } from '@purista/core'

/** get the unique id of an endpoint */
export const getEndpointId = (version: string, method: SupportedHttpMethod, path: string) =>
  `endpoint_${version}_${method}_${path}`
