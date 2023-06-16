import { OpenAPIV3 } from 'openapi-types'

import { StatusCode } from '@/types'

export const getErrorResponseSchema = (
  code: StatusCode,
  message: string,
  schema?: OpenAPIV3.SchemaObject,
): OpenAPIV3.SchemaObject => {
  const errorSchema: Record<string, any> = {
    type: 'object',
    properties: {
      status: {
        type: 'number',
        minimum: 100,
        title: 'the error status code',
        example: code,
      },
      message: {
        type: 'string',
        title: 'the error message',
        example: message,
      },
      traceparent: {
        type: 'string',
        title: 'W3C compliant unique traceparent for this request',
        example: 'd5dbb17eec16e3c9fce9cf8adc766999',
        externalDocs: {
          description: 'W3C Trace Context',
          url: 'https://www.w3.org/TR/trace-context/#traceparent-header-field-values',
        },
      },
    },
    required: ['status', 'message'],
  }

  if (schema) {
    errorSchema.properties.data = schema
  }

  return errorSchema as OpenAPIV3.SchemaObject
}
