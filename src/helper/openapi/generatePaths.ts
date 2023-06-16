import type { StatusCode } from '@purista/core'
import { OpenAPIV3 } from 'openapi-types'

import type { Endpoint } from '@/types'

import { getErrorName } from './getErrorName'
import { getErrorResponseSchema } from './getErrorResponseSchema'

const findPathParamsRegex = /:[^:/]+/gm
export const generatePaths = (endpoints: Endpoint[]): OpenAPIV3.PathsObject => {
  let paths: OpenAPIV3.PathsObject = {}

  endpoints.forEach((endpoint) => {
    paths = {
      ...paths,
      [endpoint.path]: { ...paths[endpoint.path], ...generatePath(endpoint) },
    }
  })

  return paths
}

export const generatePath = (endpoint: Endpoint): OpenAPIV3.PathsObject => {
  const contentTypeInput = `${endpoint.contentTypeInput || 'application/json'};${
    endpoint.contentEncodingInput || 'utf-8'
  }`
  const contentTypeOutput = `${endpoint.contentTypeOutput || 'application/json'};${
    endpoint.contentEncodingOutput || 'utf-8'
  }`

  const parameters: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[] = []

  const requestBody: OpenAPIV3.RequestBodyObject | undefined = undefined

  const path: OpenAPIV3.OperationObject = {
    summary: endpoint.summary || '',
    description: endpoint.description,
    tags: endpoint.tags,
    deprecated: endpoint.isDeprecated,
    operationId: endpoint.operationId,
    requestBody,
    parameters,
    responses: {
      '200': {
        description: getErrorName(StatusCode.OK),
        content: {
          [contentTypeOutput]: {
            schema: endpoint.outputSchema,
          },
        },
      },
      '500': {
        description: getErrorName(StatusCode.InternalServerError),
        content: {
          'application/json;utf-8': {
            schema: getErrorResponseSchema(StatusCode.InternalServerError, 'Something failed'),
          },
        },
      },
    },
  }

  return { [endpoint.method.toLowerCase()]: path }
}
