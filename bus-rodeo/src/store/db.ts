import Dexie, { type Table } from 'dexie'
import type { Competition, Driver, EventScore } from '../types'

class BusRodeoDb extends Dexie {
  competitions!: Table<Competition>
  drivers!: Table<Driver>
  scores!: Table<EventScore>

  constructor() {
    super('BusRodeoDb')
    this.version(1).stores({
      competitions: '++id, name, date',
      drivers: '++id, competitionId, contestantNumber, busClass',
      scores: '++id, competitionId, driverId, eventKey',
    })
  }
}

export const db = new BusRodeoDb()
