import type { EdgeLabel } from './EdgeLabel.enum'
import type { Relation } from './Relation.enum'

export type GraphEdgeType = {
  label: EdgeLabel
  eventName?: string
  relation: Relation
}
