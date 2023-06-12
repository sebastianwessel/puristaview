/* eslint-disable no-use-before-define */
export interface Extensable {
  [key: `x-${string}`]: any
}

/**
 * [4.8.11] External Documentation Object
 * Allows referencing an external resource for extended documentation.
 */
export interface ExternalDocumentationObject extends Extensable {
  /** A description of the target documentation. CommonMark syntax MAY be used for rich text representation. */
  description?: string
  /** REQUIRED. The URL for the target documentation. This MUST be in the form of a URL. */
  url: string
}

/**
 * [4.8.25] Discriminator Object
 * When request bodies or response payloads may be one of a number of different schemas, a discriminator object can be used to aid in serialization, deserialization, and validation. The discriminator is a specific object in a schema which is used to inform the consumer of the document of an alternative schema based on the value associated with it.
 */
export interface DiscriminatorObject {
  /** REQUIRED. The name of the property in the payload that will hold the discriminator value. */
  propertyName: string
  /** An object to hold mappings between payload values and schema names or references. */
  mapping?: Record<string, string>
}

/**
 * [4.8.23] Reference Object
 * A simple object to allow referencing other components in the OpenAPI document, internally and externally. The $ref string value contains a URI [RFC3986], which identifies the location of the value being referenced. See the rules for resolving Relative References.
 */
export interface ReferenceObject extends Extensable {
  /** REQUIRED. The reference identifier. This MUST be in the form of a URI. */
  $ref: string
  /** A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a summary field, then this field has no effect. */
  summary?: string
  /** A description which by default SHOULD override that of the referenced component. CommonMark syntax MAY be used for rich text representation. If the referenced object-type does not allow a description field, then this field has no effect. */
  description?: string
}

/**
 * [4.8.26] XML Object
 * A metadata object that allows for more fine-tuned XML model definitions. When using arrays, XML element names are not inferred (for singular/plural forms) and the `name` property SHOULD be used to add that information. See examples for expected behavior.
 */
export interface XMLObject extends Extensable {
  /** Replaces the name of the element/attribute used for the described schema property. When defined within `items`, it will affect the name of the individual XML elements within the list. When defined alongside `type` being `array` (outside the `items`), it will affect the wrapping element and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored. */
  name?: string
  /** The URI of the namespace definition. This MUST be in the form of an absolute URI. */
  namespace?: string
  /** The prefix to be used for the name. */
  prefix?: string
  /** Declares whether the property definition translates to an attribute instead of an element. Default value is `false`. */
  attribute?: boolean
  /** MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `array` (outside the `items`). */
  wrapped?: boolean
}

/**
 * [4.8.24] Schema Object
 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is a superset of the JSON Schema Specification Draft 2020-12.
 */
export type SchemaObject = {
  /** The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is a superset of the JSON Schema Specification Draft 2020-12. */
  discriminator?: DiscriminatorObject
  /** MAY be used only on properties schemas. It has no effect on root schemas. Adds additional metadata to describe the XML representation of this property. */
  xml?: XMLObject
  /** Additional external documentation for this schema. */
  externalDocs?: ExternalDocumentationObject
  /** @deprecated */
  example?: any
  title?: string
  description?: string
  $comment?: string
  deprecated?: boolean
  readOnly?: boolean
  writeOnly?: boolean
  enum?: unknown[]
  /** Use of this keyword is functionally equivalent to an "enum" (Section 6.1.2) with a single value. */
  const?: unknown
  default?: unknown
  format?: string
  /** @deprecated in 3.1 (still valid for 3.0) */
  nullable?: boolean
  [key: `x-${string}`]: any
} & (
  | { oneOf: (SchemaObject | ReferenceObject)[] }
  | { type: ('string' | 'number' | 'integer' | 'array' | 'boolean' | 'null' | 'object')[] }
  | { type: 'string' }
  | { type: 'number'; minimum?: number; maximum?: number }
  | { type: 'integer'; minimum?: number; maximum?: number }
  | {
      type: 'array'
      prefixItems?: SchemaObject | ReferenceObject
      items?: SchemaObject | ReferenceObject | (SchemaObject | ReferenceObject)[]
      minItems?: number
      maxItems?: number
    }
  | { type: 'boolean' }
  | { type: 'null' }
  | {
      type: 'object'
      properties?: { [name: string]: SchemaObject | ReferenceObject }
      additionalProperties?: boolean | Record<string, never> | SchemaObject | ReferenceObject
      required?: string[]
      allOf?: (SchemaObject | ReferenceObject)[]
      anyOf?: (SchemaObject | ReferenceObject)[]
    }
  | { allOf: (SchemaObject | ReferenceObject)[]; anyOf?: (SchemaObject | ReferenceObject)[]; required?: string[] }
  | { allOf?: (SchemaObject | ReferenceObject)[]; anyOf: (SchemaObject | ReferenceObject)[]; required?: string[] }
  | {}
)

/**
 * [4.8.19[ Example Object
 */
export interface ExampleObject extends Extensable {
  /** Short description for the example. */
  summary?: string
  /** Long description for the example. CommonMark syntax MAY be used for rich text representation. */
  description?: string
  /** Embedded literal example. The value field and externalValue field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary. */
  value?: any
  /** A URI that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The value field and externalValue field are mutually exclusive. See the rules for resolving Relative References. */
  externalValue?: string
}

/**
 * [4.8.21] Header Object
 * The Header Object follows the structure of the Parameter Object with the following changes:
 *
 * 1. `name` MUST NOT be specified, it is given in the corresponding `headers` map.
 * 2. `in` MUST NOT be specified, it is implicitly in `header`.
 * 3. All traits that are affected by the location MUST be applicable to a location of `heade`r (for example, `style`).
 */
export type HeaderObject = Omit<ParameterObject, 'name' | 'in'>

/**
 * [4.8.14] Media Type Object
 */
export interface MediaTypeObject extends Extensable {
  /** The schema defining the content of the request, response, or parameter. */
  schema?: SchemaObject | ReferenceObject
  /** Example of the media type. The example object SHOULD be in the correct format as specified by the media type. The example field is mutually exclusive of the examples field. Furthermore, if referencing a schema which contains an example, the example value SHALL override the example provided by the schema. */
  example?: any
  /** Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The examples field is mutually exclusive of the example field. Furthermore, if referencing a schema which contains an example, the examples value SHALL override the example provided by the schema. */
  examples?: { [name: string]: ExampleObject | ReferenceObject }
  /** A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The encoding object SHALL only apply to requestBody objects when the media type is multipart or application/x-www-form-urlencoded. */
  encoding?: { [contentType: string]: EncodingObject }
}

/**
 * [4.8.15] Encoding Object
 * A single encoding definition applied to a single schema property.
 */
export interface EncodingObject extends Extensable {
  /** The Content-Type for encoding a specific property. Default value depends on the property type: for object - application/json; for array – the default is defined based on the inner type; for all other cases the default is application/octet-stream. The value can be a specific media type (e.g. application/json), a wildcard media type (e.g. image/*), or a comma-separated list of the two types. */
  contentType?: string
  /** A map allowing additional information to be provided as headers, for example Content-Disposition. Content-Type is described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body media type is not a multipart. */
  headers?: { [name: string]: HeaderObject | ReferenceObject }
  /** Describes how a specific property value will be serialized depending on its type. See Parameter Object for details on the style property. The behavior follows the same values as query parameters, including default values. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded or multipart/form-data. If a value is explicitly defined, then the value of contentType (implicit or explicit) SHALL be ignored. */
  style?: string
  /** When this is true, property values of type array or object generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When style is form, the default value is true. For all other styles, the default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded or multipart/form-data. If a value is explicitly defined, then the value of contentType (implicit or explicit) SHALL be ignored. */
  explode?: string
  /** Determines whether the parameter value SHOULD allow reserved characters, as defined by [RFC3986] :/?#[]@!$&'()*+,;= to be included without percent-encoding. The default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded or multipart/form-data. If a value is explicitly defined, then the value of contentType (implicit or explicit) SHALL be ignored. */
  allowReserved?: string
}

/**
 * [4.8.12] Parameter Object
 * Describes a single operation parameter.
 * A unique parameter is defined by a combination of a name and location.
 */
export interface ParameterObject extends Extensable {
  /**
   * REQUIRED. The name of the parameter. Parameter names are case sensitive.
   *
   * - If `in` is `"path"`, the `name` field MUST correspond to a template expression occurring within the path field in the Paths Object. See Path Templating for further information.
   * - If `in` is `"header"` and the `name` field is `"Accept"`, `"Content-Type"` or `"Authorization"`, the parameter definition SHALL be ignored.
   * - For all other cases, the `name` corresponds to the parameter name used by the `in` property.
   */
  name: string
  /** REQUIRED. The location of the parameter. Possible values are "query", "header", "path" or "cookie". */
  in: 'query' | 'header' | 'path' | 'cookie'
  /** A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich text representation. */
  description?: string
  /** Determines whether this parameter is mandatory. If the parameter location is "path", this property is REQUIRED and its value MUST be true. Otherwise, the property MAY be included and its default value is false. */
  required?: boolean
  /** Specifies that a parameter is deprecated and SHOULD be transitioned out of usage. Default value is false. */
  deprecated?: boolean
  /** Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a parameter with an empty value. Default value is false. If style is used, and if behavior is n/a (cannot be serialized), the value of allowEmptyValue SHALL be ignored. Use of this property is NOT RECOMMENDED, as it is likely to be removed in a later revision. */
  allowEmptyValue?: boolean
  /** Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form. */
  style?: string
  /** When this is true, parameter values of type `array` or `object` generate separate parameters for each value of the array or key-value pair of the map. For other types of parameters this property has no effect. When `style` is `form`, the default value is `true`. For all other styles, the default value is `false`. */
  explode?: boolean
  /** Determines whether the parameter value SHOULD allow reserved characters, as defined by [RFC3986] `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. This property only applies to parameters with an `in` value of `query`. The default value is `false`. */
  allowReserved?: boolean
  /** The schema defining the type used for the parameter. */
  schema?: SchemaObject
  /** Example of the parameter’s potential value. */
  example?: any
  /** Examples of the parameter’s potential value. */
  examples?: { [name: string]: ExampleObject | ReferenceObject }
  /** A map containing the representations for the parameter. */
  content?: { [contentType: string]: MediaTypeObject | ReferenceObject }
}

/** Context passed to all submodules */
export interface GlobalContext {
  additionalProperties: boolean
  alphabetize: boolean
  emptyObjectsUnknown: boolean
  defaultNonNullable: boolean
  discriminators: { [$ref: string]: DiscriminatorObject }
  immutableTypes: boolean
  indentLv: number
  operations: Record<
    string,
    {
      comment?: string
      operationType: string
    }
  >
  parameters: Record<string, ParameterObject>
  pathParamsAsTypes: boolean
  silent: boolean
  supportArrayLength: boolean
  excludeDeprecated: boolean
}
