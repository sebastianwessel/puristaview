import type { Service } from './Service'

export type Project = {
  id: string
  name: string
  description: string
  markdown?: string
  services: Service[]
}
