import { OpenAPIV3 } from 'openapi-types'

import type { Endpoint } from '@/types'

import { generatePaths } from './generatePaths'

export type GenerateOpenApiParams = {
  info?: {
    name?: string
    description?: string
    version?: string
  }
  endpoints: Endpoint[]
}

export const generate = (params: GenerateOpenApiParams) => {
  const paths = generatePaths(params.endpoints)

  const document: OpenAPIV3.Document = {
    openapi: '3.1.0',
    info: {
      title: 'PURISTA Voyage',
      version: '1',
      ...params.info,
    },
    components: {},
    paths,
  }

  return document
}
