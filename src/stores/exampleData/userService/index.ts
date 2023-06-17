import type { Service } from '../../../types'
import { getUserById } from './getUserById'
import { userSignUp } from './userSignUp'

export const userService: Service = {
  name: 'User',
  version: '1',
  description: 'Manages users and user information',
  commands: [userSignUp, getUserById],
  subscriptions: [],
  deprecated: true,
  markdown: `
# About the User service

Example readme text
If a readme file exists in the root of a service version, the content can be included here.

As we are developers, we want to have code snippets as well:

\`\`\`typescript
const x = 1

const y = (some: string):string => some
\`\`\`

Maybe we also want to include some mermaid diagram to explain something more visual:

\`\`\`mermaid
graph TD
    A[User] -->|Sign up| B(Onboarding)
    B --> C{Provide products}
    C -->|Hold| D[Account]
    C -->|Use| E[Card]
    C -->|Invest| F[Shares]
\`\`\`
`,
}

export const userService2: Service = {
  name: 'User',
  version: '2',
  description: 'Manages users and user information',
  commands: [userSignUp, getUserById],
  subscriptions: [],
  markdown: `
# About the User service

Example readme text
If a readme file exists in the root of a service version, the content can be included here.

As we are developers, we want to have code snippets as well:

\`\`\`typescript
const x = 1

const y = (some: string):string => some
\`\`\`

Maybe we also want to include some mermaid diagram to explain something more visual:

\`\`\`mermaid
graph TD
    A[User] -->|Sign up| B(Onboarding)
    B --> C{Provide products}
    C -->|Hold| D[Account]
    C -->|Use| E[Card]
    C -->|Invest| F[Shares]
\`\`\`
`,
}
