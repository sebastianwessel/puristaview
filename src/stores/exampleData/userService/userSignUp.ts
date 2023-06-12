import type { Command } from '../../../types'

export const userSignUp: Command = {
  name: 'userSignUp',
  eventName: 'new-user-registered',
  description: 'A new user has been registered',
  markdown: `Even single commands can have some markdown content rendered, if they provide a _readme.md_.  
Also here, we can have some code example:

\`\`\`typescript
const example = () => 'my command documentation code example'
\`\`\`

We also can have some nice mermaid:

\`\`\`mermaid
graph LR
    A[User] -->|Opens the app| B[Onboarding]
    B -->|collecting information| C(Calling REST-API /new)
\`\`\`
`,
  restApi: { method: 'POST', path: 'signUp' },
  invokes: [],
  publishesCustomEvents: [],
  inputSchema: {
    type: 'object',
    title: 'Signup user information',
    description: 'The payload sent via HTTP-POST request',
    properties: {
      firstName: {
        type: 'string',
        title: 'first name of user',
        example: 'Sherlock',
      },
      lastName: {
        type: 'string',
        title: 'last name of user',
        example: 'Holmes',
      },
      gender: {
        type: 'string',
        example: 'male',
        enum: ['male', 'female', 'other'],
      },
      mobile: {
        type: 'string',
        title: 'mobile phone number',
        example: '+497700900000',
      },
      email: {
        type: 'string',
        title: 'email of user',
        example: 'catch-moriarty@holmes.com',
        format: 'email',
      },
      birthday: {
        type: 'string',
        title: 'date of birth',
        example: '1854-06-02',
        format: 'date',
      },
      address: {
        type: 'object',
        title: 'address of user',
        properties: {
          line1: {
            type: 'string',
            title: 'address line one',
            example: 'Baker Street 221B',
          },
          line2: {
            type: 'string',
            title: 'address line two',
            example: '1st floor',
          },
          city: {
            type: 'string',
            title: 'city name',
            example: 'London',
          },
          zip: {
            type: 'string',
            title: 'the zip code',
            example: 'NW1 6XE',
          },
          country: {
            type: 'string',
            title: 'the country code',
            example: 'UK',
          },
        },
        required: ['line1', 'line2', 'city', 'zip', 'country'],
      },
      nationality: {
        type: 'string',
        title: 'the nationality of the user',
        example: 'UK',
      },
      password: {
        type: 'string',
        title: 'the encrypted password',
        example: '==678dfdjklklsdfkdssddkf89wwoladldsfsf',
      },
      cv: {
        type: 'string',
        title: 'The cv to for encryption',
        example: '==9089jkljkll',
      },
      hints: {
        type: 'string',
        title: 'some optional free text for the user',
        example: 'please contact me only via mail',
      },
    },
    required: ['firstName', 'lastName', 'gender', 'email', 'birthday', 'address', 'nationality', 'password', 'cv'],
  },
  parameterSchema: {
    type: 'object',
    title: 'Parameter example',
    description: 'The parameters provided during command invocation',
    properties: {
      sessionId: {
        type: 'string',
        title: 'the current session id of the user',
        format: 'uuid',
      },
    },
  },
  outputSchema: {
    type: 'object',
    title: 'The output schema',
    description: 'contains the unique user id',
    properties: {
      id: {
        type: 'string',
        title: 'the unique user id of user',
        format: 'uuid',
      },
      firstName: {
        type: 'string',
        title: 'first name of user',
        example: 'Sherlock',
      },
      lastName: {
        type: 'string',
        title: 'last name of user',
        example: 'Holmes',
      },
      gender: {
        type: 'string',
        example: 'male',
        enum: ['male', 'female', 'other'],
      },
      email: {
        type: 'string',
        title: 'email of user',
        example: 'catch-moriarty@holmes.com',
        format: 'email',
      },
    },
    required: ['id', 'firstName', 'lastName', 'gender', 'email'],
  },
}
