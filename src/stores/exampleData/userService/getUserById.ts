import type { Command } from '../../../types'

export const getUserById: Command = {
  name: 'getUserById',
  description: 'Returns user information for given id',
  markdown: ``,
  invokes: [],
  publishesCustomEvents: [],
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        title: 'the unique user id of user',
        format: 'uuid',
      },
    },
    required: ['id'],
    title: 'root test object',
  },
  restApi: {
    method: 'GET',
    path: 'users/:userId',
    parameter: [],
    tags: [],
    errorCodes: [],
    isProtected: true,
  },
  outputSchema: {
    type: 'object',
    title: 'Signup user information',
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
      hints: {
        type: 'string',
        title: 'some optional free text for the user',
        example: 'please contact me only via mail',
      },
    },
    required: ['id', 'firstName', 'lastName', 'gender', 'email', 'birthday', 'address', 'nationality'],
  },
}
