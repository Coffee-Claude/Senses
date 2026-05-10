import type { EventKey } from '../types'

export interface EventDef {
  key: EventKey
  label: string
  maxPoints: number
  timed?: boolean
  timeLimitSec?: number
  optional?: boolean
}

export const EVENT_DEFS: EventDef[] = [
  { key: 'written_general', label: 'General Knowledge Written Test', maxPoints: 100 },
  { key: 'written_inspection', label: 'Vehicle Inspection Written Test', maxPoints: 100 },
  { key: 'offset_alley', label: 'Offset Alley', maxPoints: 75, timed: true, timeLimitSec: 120 },
  { key: 'rxr_crossing', label: 'RXR Grade Crossing', maxPoints: 75 },
  { key: 'right_turn', label: 'Right Turn', maxPoints: 50, timed: true, timeLimitSec: 15 },
  { key: 'straight_line', label: 'Straight Line', maxPoints: 50 },
  { key: 'diminishing_clearance', label: 'Diminishing Clearance', maxPoints: 50 },
  { key: 'backup_stall', label: 'Back Up Stall', maxPoints: 50, timed: true, timeLimitSec: 180 },
  { key: 'left_turn', label: 'Left Turn', maxPoints: 50, timed: true, timeLimitSec: 15 },
  { key: 'parallel_parking', label: 'Parallel Parking', maxPoints: 50, timed: true, timeLimitSec: 180 },
  { key: 'curb_line_loading', label: 'Curb Line Student Loading Zone', maxPoints: 75 },
  { key: 'stop_line', label: 'Stop Line', maxPoints: 25 },
  { key: 'surprise', label: 'Surprise Event', maxPoints: 50, optional: true },
]

export const MAX_TOTAL_WITHOUT_SURPRISE = 750
export const MAX_TOTAL_WITH_SURPRISE = 800

export function getEventDef(key: EventKey): EventDef {
  return EVENT_DEFS.find(e => e.key === key)!
}
