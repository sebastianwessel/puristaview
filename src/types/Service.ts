import type { Prettify } from '@purista/core'

import type { Command } from './Command'
import type { Subscription } from './Subscription'

export type Service = Prettify<{
  /** name of the service */
  name: string
  /** service version */
  version: string
  /** mark service as deprecated */
  deprecated?: boolean
  /** description of the service */
  description: string
  /** markdown content extracted from readme.md file */
  markdown?: string
  /** commands of the service */
  commands: Command[]
  /** subscriptions of the service */
  subscriptions: Subscription[]
}>
