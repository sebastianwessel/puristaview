import { OpenAPIV3 } from 'openapi-types'
import { v4 as uuidv4 } from 'uuid'

import { randomFloat, randomInt } from './faker'

export const getExample = (schema: OpenAPIV3.SchemaObject, key?: string, _required = false): unknown => {
  if (schema.example) {
    return schema.example
  }

  if (schema.default) {
    return schema.default
  }

  if (schema.enum?.length) {
    return schema.enum[0]
  }

  if (schema.type === 'string') {
    if (schema.oneOf?.length) {
      return schema.oneOf[0]
    }
    return transformStringBasedOnFormat(schema.format, key)
  }

  if (schema.type === 'number') {
    return randomFloat({ min: schema.minimum, max: schema.maximum })
  }

  if (schema.type === 'integer') {
    return randomInt({ min: schema.minimum, max: schema.maximum })
  }

  if (schema.type === 'boolean') {
    return true
  }

  if (schema.type === 'object') {
    const obj: Record<string, unknown> = {}
    for (const [k, prop] of Object.entries(schema.properties || {})) {
      const isRequired = schema.required?.includes(k) || false
      obj[k] = getExample(prop as OpenAPIV3.SchemaObject, k, isRequired)
    }

    return obj
  }

  if (schema.type === 'array') {
    return []
  }

  return null
}

export const transformStringBasedOnFormat = (format?: string, key?: string) => {
  if (format === 'date-time') {
    return '2018-03-20T09:12:28Z'
  }
  if (format === 'date') {
    return '2018-03-20'
  }
  if (format === 'time') {
    return '09:12:28'
  }

  if (format === 'uuid') {
    return uuidv4()
  }

  if (['idn-email', 'email'].includes(format ?? '') || key?.toLowerCase().endsWith('email')) {
    return 'mail@example.com'
  }

  if (['hostname', 'idn-hostname'].includes(format ?? '')) {
    return 'example.com'
  }

  if (format === 'ipv4') {
    return '192.168.1.1'
  }

  if (format === 'ipv6') {
    return '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
  }

  if (
    ['uri', 'uri-reference', 'iri', 'iri-reference', 'uri-template'].includes(format ?? '') ||
    key?.toLowerCase().endsWith('url')
  ) {
    return 'https://example.com'
  }

  if (key?.toLowerCase().endsWith('name')) {
    return 'John Doe'
  } else {
    return 'some string'
  }
}
