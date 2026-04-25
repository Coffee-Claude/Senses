export type BusClass = 'A' | 'C' | 'D'
export type Sector = 'Public' | 'Private'

export interface Driver {
  id?: number
  competitionId: number
  contestantNumber: string
  name: string
  busClass: BusClass
  sector: Sector
  state: string
}

export interface Competition {
  id?: number
  name: string
  location: string
  date: string
  includesSurprise: boolean
  createdAt: string
}

export type EventKey =
  | 'written_general'
  | 'written_inspection'
  | 'offset_alley'
  | 'rxr_crossing'
  | 'right_turn'
  | 'straight_line'
  | 'diminishing_clearance'
  | 'backup_stall'
  | 'left_turn'
  | 'parallel_parking'
  | 'curb_line_loading'
  | 'stop_line'
  | 'surprise'

export interface EventScore {
  id?: number
  competitionId: number
  driverId: number
  eventKey: EventKey
  demerits: number
  maxPoints: number
  notes: string
  timeMin?: number
  timeSec?: number
  data: Record<string, number | boolean | string>
  scoredAt: string
}
