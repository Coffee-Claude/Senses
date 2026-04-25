import { useState, useEffect } from 'react'
import { db } from '../store/db'
import type { Competition, Driver, BusClass, Sector, EventKey } from '../types'
import { Btn, Card, PageHeader, ScoreBadge } from './ui'
import { EVENT_DEFS } from '../data/events'

interface Props {
  competition: Competition
  onBack: () => void
  onScore: (driver: Driver, eventKey: EventKey) => void
  onLeaderboard: () => void
}

const BUS_CLASSES: BusClass[] = ['A', 'C', 'D']
const CLASS_LABELS: Record<BusClass, string> = { A: 'Type A – Small Bus', C: 'Type C – Conventional', D: 'Type D – Transit' }

export default function DriverList({ competition, onBack, onScore, onLeaderboard }: Props) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [scores, setScores] = useState<Record<string, number>>({})
  const [showAdd, setShowAdd] = useState(false)
  const [filterClass, setFilterClass] = useState<BusClass | 'all'>('all')
  const [form, setForm] = useState({ name: '', contestantNumber: '', busClass: 'C' as BusClass, sector: 'Public' as Sector, state: '' })
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [drvs, evts] = await Promise.all([
      db.drivers.where('competitionId').equals(competition.id!).toArray(),
      db.scores.where('competitionId').equals(competition.id!).toArray(),
    ])
    setDrivers(drvs)
    const scoreMap: Record<string, number> = {}
    for (const s of evts) {
      const key = `${s.driverId}-${s.eventKey}`
      scoreMap[key] = Math.max(0, s.maxPoints - s.demerits)
    }
    setScores(scoreMap)
  }

  function totalScore(driverId: number) {
    return EVENT_DEFS
      .filter(e => !e.optional || competition.includesSurprise)
      .reduce((sum, e) => sum + (scores[`${driverId}-${e.key}`] ?? 0), 0)
  }

  function eventsDone(driverId: number) {
    return EVENT_DEFS
      .filter(e => !e.optional || competition.includesSurprise)
      .filter(e => `${driverId}-${e.key}` in scores).length
  }

  function maxTotal() {
    return EVENT_DEFS.filter(e => !e.optional || competition.includesSurprise).reduce((s, e) => s + e.maxPoints, 0)
  }

  async function addDriver(e: React.FormEvent) {
    e.preventDefault()
    const driver: Driver = { ...form, competitionId: competition.id! }
    const id = await db.drivers.add(driver)
    setDrivers(prev => [...prev, { ...driver, id: id as number }])
    setForm({ name: '', contestantNumber: '', busClass: 'C', sector: 'Public', state: '' })
    setShowAdd(false)
  }

  async function removeDriver(id: number) {
    if (!confirm('Remove this driver?')) return
    await db.drivers.delete(id)
    await db.scores.where('driverId').equals(id).delete()
    setDrivers(prev => prev.filter(d => d.id !== id))
    await loadData()
  }

  const visible = drivers.filter(d => filterClass === 'all' || d.busClass === filterClass)
  const eventsToScore = EVENT_DEFS.filter(e => !e.optional || competition.includesSurprise)

  return (
    <div className="min-h-screen bg-slate-100">
      <PageHeader
        title={competition.name}
        subtitle={`${competition.location} · ${competition.date}`}
        onBack={onBack}
      />

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        <div className="flex gap-2">
          <Btn onClick={onLeaderboard} variant="secondary" className="flex-1">🏆 Leaderboard</Btn>
          <Btn onClick={() => setShowAdd(!showAdd)} className="flex-1">+ Add Driver</Btn>
        </div>

        {/* Class filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', ...BUS_CLASSES] as const).map(c => (
            <button
              key={c}
              onClick={() => setFilterClass(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filterClass === c ? 'bg-yellow-400 text-yellow-900' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {c === 'all' ? 'All Classes' : CLASS_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Add driver form */}
        {showAdd && (
          <Card className="p-4">
            <p className="font-semibold text-gray-900 mb-3">Add Driver</p>
            <form onSubmit={addDriver} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Contestant #</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={form.contestantNumber}
                    onChange={e => setForm(f => ({ ...f, contestantNumber: e.target.value }))}
                    required placeholder="101"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State/Province</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                    placeholder="TX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Driver Name</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required placeholder="First Last"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Bus Class</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={form.busClass}
                    onChange={e => setForm(f => ({ ...f, busClass: e.target.value as BusClass }))}
                  >
                    {BUS_CLASSES.map(c => <option key={c} value={c}>{CLASS_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Sector</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={form.sector}
                    onChange={e => setForm(f => ({ ...f, sector: e.target.value as Sector }))}
                  >
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Btn type="submit" className="flex-1">Add Driver</Btn>
                <Btn variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Btn>
              </div>
            </form>
          </Card>
        )}

        {/* Driver list */}
        {visible.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <div className="text-3xl mb-2">🚌</div>
            <p className="text-sm">No drivers yet. Add one above.</p>
          </div>
        )}

        {visible.map(driver => {
          const total = totalScore(driver.id!)
          const done = eventsDone(driver.id!)
          const evtCount = eventsToScore.length
          const isExpanded = expandedDriver === driver.id

          return (
            <Card key={driver.id}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedDriver(isExpanded ? null : driver.id!)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded">
                      #{driver.contestantNumber}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                      {driver.busClass}
                    </span>
                    {driver.state && (
                      <span className="text-xs text-gray-400">{driver.state}</span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 mt-1">{driver.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{done}/{evtCount} events scored</p>
                </div>
                <div className="flex items-center gap-2">
                  <ScoreBadge score={total} max={maxTotal()} />
                  <span className="text-gray-300 text-xl">{isExpanded ? '∧' : '∨'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 px-4 pb-4">
                  <div className="mt-3 space-y-1">
                    {eventsToScore.map(evt => {
                      const scored = `${driver.id}-${evt.key}` in scores
                      const s = scores[`${driver.id!}-${evt.key}`] ?? null
                      return (
                        <button
                          key={evt.key}
                          onClick={() => onScore(driver, evt.key)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                        >
                          <span className={`text-sm ${scored ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                            {evt.label}
                          </span>
                          <div className="flex items-center gap-2">
                            {scored ? (
                              <ScoreBadge score={s!} max={evt.maxPoints} />
                            ) : (
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Not scored</span>
                            )}
                            <span className="text-yellow-500 text-sm">›</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => removeDriver(driver.id!)}
                    className="mt-3 text-xs text-red-400 hover:text-red-600"
                  >
                    Remove driver
                  </button>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
