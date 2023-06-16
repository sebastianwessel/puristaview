import type { OpenAPIV3 } from 'openapi-types'

export const getError400Schema = () => {
  const inputValidationFailed: OpenAPIV3.SchemaObject = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        validation: {
          type: 'string',
          example: 'invalid_string',
        },
        code: {
          type: 'string',
          example: 'invalid_string',
        },
        message: {
          type: 'string',
          example: 'String must contain at least 3 character(s)',
        },
        expected: {
          type: 'string',
          example: 'string',
        },
        received: {
          type: 'string',
          example: 'object',
        },
        keys: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        minimum: {
          type: 'number',
          example: 3,
        },
        maximum: {
          type: 'number',
          example: 32,
        },
        path: {
          type: 'array',
          items: {
            type: 'string',
            example: 'username',
          },
        },
      },
      required: ['message', 'code'],
    },
  }

  return inputValidationFailed
}
