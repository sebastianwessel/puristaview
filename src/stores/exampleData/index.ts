import type { Service } from '../../types'
import { bankAccountService } from './bankAccountService'
import { cardService } from './cardService'
import { emailService } from './emailService'
import { identityService } from './identityService'
import { userService } from './userService'

export const exampleData: Service[] = [userService, emailService, identityService, bankAccountService, cardService]
