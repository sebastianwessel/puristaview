import type { Subscription } from '../../../types'

export const createEmailValidateToken: Subscription = {
  name: 'createEmailValidateToken',
  description: 'Creates a token used for email validation',
  markdown: ``,
  eventName: 'validation-token-created',
  subscribesTo: {
    eventname: 'new-user-registered',
    sender: {
      name: 'User',
    },
  },
  invokes: [
    {
      serviceName: 'User',
      serviceVersion: '1',
      serviceTarget: 'getUserById',
    },
  ],
  publishesCustomEvents: [],
  inputSchema: {
    type: 'object',
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
    title: 'root test object',
  },
  outputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        title: 'the unique user id of user',
        format: 'uuid',
      },
      token: {
        type: 'string',
        title: 'the unique user id of user',
        format: 'uuid',
      },
    },
  },
}
