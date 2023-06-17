import type { Service } from '../../types'
import { bankAccountService } from './bankAccountService'
import { cardService } from './cardService'
import { emailService } from './emailService'
import { identityService } from './identityService'
import { userService, userService2 } from './userService'

export const exampleData: Service[] = [
  userService,
  userService2,
  emailService,
  identityService,
  bankAccountService,
  cardService,
]
