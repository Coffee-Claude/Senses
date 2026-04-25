import { type ReactNode, useState, useEffect } from 'react'
import { db } from '../../store/db'
import type { Driver, EventKey, EventScore } from '../../types'
import { getEventDef } from '../../data/events'
import { Btn, PageHeader, Card } from '../ui'

interface Props {
  driver: Driver
  eventKey: EventKey
  onBack: () => void
  children: (
    data: Record<string, number | boolean | string>,
    setData: (patch: Record<string, number | boolean | string>) => void,
    existing: EventScore | null
  ) => ReactNode
  computeDemerits: (data: Record<string, number | boolean | string>) => number
  extraInfo?: ReactNode
}

export default function ScoreWrapper({ driver, eventKey, onBack, children, computeDemerits, extraInfo }: Props) {
  const def = getEventDef(eventKey)
  const [data, setDataState] = useState<Record<string, number | boolean | string>>({})
  const [existing, setExisting] = useState<EventScore | null>(null)
  const [saved, setSaved] = useState(false)
  const [timeMin, setTimeMin] = useState(0)
  const [timeSec, setTimeSec] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    db.scores
      .where('driverId').equals(driver.id!)
      .and(s => s.eventKey === eventKey)
      .first()
      .then(s => {
        if (s) {
          setExisting(s)
          setDataState(s.data)
          setTimeMin(s.timeMin ?? 0)
          setTimeSec(s.timeSec ?? 0)
          setNotes(s.notes ?? '')
        }
      })
  }, [driver.id, eventKey])

  function setData(patch: Record<string, number | boolean | string>) {
    setDataState(prev => ({ ...prev, ...patch }))
    setSaved(false)
  }

  const demerits = computeDemerits(data)
  const score = Math.max(0, def.maxPoints - demerits)

  async function saveScore() {
    const scoreRecord: EventScore = {
      competitionId: driver.competitionId,
      driverId: driver.id!,
      eventKey,
      demerits,
      maxPoints: def.maxPoints,
      notes,
      timeMin,
      timeSec,
      data,
      scoredAt: new Date().toISOString(),
    }
    if (existing?.id) {
      await db.scores.update(existing.id, scoreRecord as Parameters<typeof db.scores.update>[1])
    } else {
      const id = await db.scores.add(scoreRecord)
      setExisting({ ...scoreRecord, id: id as number })
    }
    setSaved(true)
  }

  const pct = def.maxPoints > 0 ? score / def.maxPoints : 0
  const scoreColor = pct >= 0.9 ? 'text-green-600' : pct >= 0.7 ? 'text-yellow-600' : 'text-red-600'
  const scoreBg = pct >= 0.9 ? 'bg-green-50 border-green-200' : pct >= 0.7 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'

  return (
    <div className="min-h-screen bg-slate-100 pb-32">
      <PageHeader
        title={def.label}
        subtitle={`#${driver.contestantNumber} – ${driver.name}`}
        onBack={onBack}
      />

      {/* Live score bar */}
      <div className={`border-b px-4 py-3 ${scoreBg}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">Demerits</span>
            <p className="font-bold text-gray-800">{demerits}</p>
          </div>
          <div className="text-center">
            <span className="text-xs text-gray-500">Score</span>
            <p className={`text-3xl font-bold ${scoreColor}`}>{score}<span className="text-base text-gray-400 font-normal">/{def.maxPoints}</span></p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Max Points</span>
            <p className="font-bold text-gray-800">{def.maxPoints}</p>
          </div>
        </div>
        {def.timed && (
          <div className="max-w-2xl mx-auto mt-2 flex items-center gap-4">
            <span className="text-xs text-gray-500">Time:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={99}
                value={timeMin}
                onChange={e => setTimeMin(Number(e.target.value))}
                className="w-14 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                placeholder="min"
              />
              <span className="text-gray-500">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={timeSec}
                onChange={e => setTimeSec(Number(e.target.value))}
                className="w-14 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                placeholder="sec"
              />
            </div>
            {def.timeLimitSec && (
              <span className="text-xs text-gray-400">Limit: {Math.floor(def.timeLimitSec / 60)}:{String(def.timeLimitSec % 60).padStart(2, '0')}</span>
            )}
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {extraInfo}
        {children(data, setData, existing)}

        <Card className="p-4">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Judge Notes (optional)</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any notes..."
          />
        </Card>
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3 items-center">
          <div className={`flex-1 text-center py-3 rounded-xl border font-bold text-lg ${scoreBg} ${scoreColor}`}>
            {score} / {def.maxPoints} pts
          </div>
          <Btn onClick={saveScore} className="flex-1 py-3 text-base">
            {saved ? '✓ Saved' : 'Save Score'}
          </Btn>
        </div>
      </div>
    </div>
  )
}
