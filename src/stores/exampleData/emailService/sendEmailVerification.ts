import type { Subscription } from '@/types'

export const sendEmailVerification: Subscription = {
  name: 'sendEmailVerification',
  description: 'Sends an email with some verification link',
  markdown: ``,
  subscribesTo: {
    eventname: 'validation-token-created',
    sender: {
      name: 'Identity',
    },
  },
  invokes: [],
  publishesCustomEvents: [],
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
