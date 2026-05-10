import { useState, useEffect } from 'react'
import { db } from '../store/db'
import type { Competition, Driver, BusClass } from '../types'
import { PageHeader, Card } from './ui'
import { EVENT_DEFS } from '../data/events'

interface Props {
  competition: Competition
  onBack: () => void
}

interface DriverResult {
  driver: Driver
  total: number
  eventScores: Record<string, number>
  eventsDone: number
}

const CLASS_LABELS: Record<BusClass, string> = { A: 'Type A', C: 'Type C', D: 'Type D' }

export default function Leaderboard({ competition, onBack }: Props) {
  const [results, setResults] = useState<DriverResult[]>([])
  const [filterClass, setFilterClass] = useState<BusClass | 'all'>('all')

  const eventsToScore = EVENT_DEFS.filter(e => !e.optional || competition.includesSurprise)
  const maxTotal = eventsToScore.reduce((s, e) => s + e.maxPoints, 0)

  useEffect(() => { load() }, [])

  async function load() {
    const [drivers, scores] = await Promise.all([
      db.drivers.where('competitionId').equals(competition.id!).toArray(),
      db.scores.where('competitionId').equals(competition.id!).toArray(),
    ])
    const scoreMap: Record<string, number> = {}
    for (const s of scores) {
      scoreMap[`${s.driverId}-${s.eventKey}`] = Math.max(0, s.maxPoints - s.demerits)
    }
    const res: DriverResult[] = drivers.map(d => {
      const eventScores: Record<string, number> = {}
      let total = 0
      let done = 0
      for (const e of eventsToScore) {
        const k = `${d.id}-${e.key}`
        if (k in scoreMap) {
          eventScores[e.key] = scoreMap[k]
          total += scoreMap[k]
          done++
        }
      }
      return { driver: d, total, eventScores, eventsDone: done }
    })
    res.sort((a, b) => b.total - a.total)
    setResults(res)
  }

  const visible = results.filter(r => filterClass === 'all' || r.driver.busClass === filterClass)

  const medalColors = ['🥇', '🥈', '🥉']

  return (
    <div className="min-h-screen bg-slate-100">
      <PageHeader title="Leaderboard" subtitle={competition.name} onBack={onBack} />

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'A', 'C', 'D'] as const).map(c => (
            <button
              key={c}
              onClick={() => setFilterClass(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                filterClass === c ? 'bg-yellow-400 text-yellow-900' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {c === 'all' ? 'All Classes' : CLASS_LABELS[c as BusClass]}
            </button>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm">No results yet.</p>
          </div>
        )}

        {visible.map((r, i) => (
          <Card key={r.driver.id} className="overflow-hidden">
            <div className="flex items-center p-4 gap-3">
              <div className="text-2xl w-8 text-center">{i < 3 ? medalColors[i] : `${i + 1}`}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{r.driver.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    #{r.driver.contestantNumber}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                    {r.driver.busClass}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {r.driver.state} · {r.driver.sector} · {r.eventsDone}/{eventsToScore.length} events
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">{r.total}</p>
                <p className="text-xs text-gray-400">/ {maxTotal}</p>
              </div>
            </div>

            {/* Per-event breakdown */}
            <div className="border-t border-gray-100 px-4 py-2">
              <div className="flex flex-wrap gap-1">
                {eventsToScore.map(e => {
                  const s = r.eventScores[e.key]
                  const pct = s != null ? s / e.maxPoints : null
                  return (
                    <div
                      key={e.key}
                      className={`text-xs px-2 py-1 rounded ${
                        pct == null ? 'bg-gray-100 text-gray-400' :
                        pct >= 0.9 ? 'bg-green-100 text-green-700' :
                        pct >= 0.7 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                      title={e.label}
                    >
                      {e.label.split(' ').slice(0, 2).join(' ')}: {s != null ? s : '—'}
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
