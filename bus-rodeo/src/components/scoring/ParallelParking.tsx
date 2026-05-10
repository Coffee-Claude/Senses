import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CheckItem, CounterInput, SectionTitle } from '../ui'

// Zone demerits: 0-3"=0, 3-6"=3, 6-9"=6, 9-12"=9, 12-15"=12, 15-18"=15, >18"=50
const ZONES = [
  { label: '0" – 3" from curb', demerits: 0 },
  { label: '3" – 6" from curb', demerits: 3 },
  { label: '6" – 9" from curb', demerits: 6 },
  { label: '9" – 12" from curb', demerits: 9 },
  { label: '12" – 15" from curb', demerits: 12 },
  { label: '15" – 18" from curb', demerits: 15 },
  { label: 'Over 18" from curb', demerits: 50 },
]

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  // Zone scoring
  d += Number(data.zoneDemerits ?? 0)
  // Extra backs entering (>2, 5 each, max 25)
  d += Math.min(25, Number(data.extraBacksEntering ?? 0) * 5)
  // Extra backs exiting (>2, 5 each, max 25)
  d += Math.min(25, Number(data.extraBacksExiting ?? 0) * 5)
  // Failures
  if (data.barrierEnter) d += 50
  if (data.curbEnter) d += 50
  if (data.barrierExit) d += 50
  if (data.curbExit) d += 50
  if (data.noTimeLimit) d += 50
  if (data.noHeadlights) d += 50
  if (data.noSeatbelt) d += 50
  if (data.doorOpen) d += 50
  if (data.noSignal) d += 50
  if (data.noCancelSignal) d += 10
  return d
}

export default function ParallelParking({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="parallel_parking" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Curb Distance – Final Position</SectionTitle>
            <div className="py-3 space-y-2">
              {ZONES.map(zone => (
                <button
                  key={zone.demerits + zone.label}
                  onClick={() => setData({ zoneDemerits: zone.demerits })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 font-medium transition-colors text-sm ${
                    Number(data.zoneDemerits ?? -1) === zone.demerits && zone.demerits !== 50
                      ? zone.demerits === 0
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : zone.demerits <= 9
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
                        : 'border-orange-400 bg-orange-50 text-orange-700'
                      : Number(data.zoneDemerits) === zone.demerits && zone.demerits === 50
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  <span>{zone.label}</span>
                  <span>{zone.demerits === 0 ? '0 pts' : `−${zone.demerits} pts`}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Extra Backs (first 2 are free)</SectionTitle>
            <CounterInput
              label="Extra backs while entering (after 2nd)"
              value={Number(data.extraBacksEntering ?? 0)}
              onChange={v => setData({ extraBacksEntering: v })}
              min={0}
              demeritsEach={5}
              totalDemerits={Math.min(25, Number(data.extraBacksEntering ?? 0) * 5)}
            />
            <CounterInput
              label="Extra backs while exiting (after 2nd)"
              value={Number(data.extraBacksExiting ?? 0)}
              onChange={v => setData({ extraBacksExiting: v })}
              min={0}
              demeritsEach={5}
              totalDemerits={Math.min(25, Number(data.extraBacksExiting ?? 0) * 5)}
            />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Failures</SectionTitle>
            <CheckItem label="Bus touched front/rear barrier (entering)" checked={!!data.barrierEnter} onChange={v => setData({ barrierEnter: v })} demerits={50} penalty />
            <CheckItem label="Tire tread touched curb (entering)" checked={!!data.curbEnter} onChange={v => setData({ curbEnter: v })} demerits={50} penalty />
            <CheckItem label="Bus touched front/rear barrier (exiting)" checked={!!data.barrierExit} onChange={v => setData({ barrierExit: v })} demerits={50} penalty />
            <CheckItem label="Tire tread touched curb (exiting)" checked={!!data.curbExit} onChange={v => setData({ curbExit: v })} demerits={50} penalty />
            <CheckItem label="Did not park, set brake & sound horn in 3 min" checked={!!data.noTimeLimit} onChange={v => setData({ noTimeLimit: v })} demerits={50} penalty />
            <CheckItem label="No headlights on" checked={!!data.noHeadlights} onChange={v => setData({ noHeadlights: v })} demerits={50} penalty />
            <CheckItem label="Did not wear seat belt" checked={!!data.noSeatbelt} onChange={v => setData({ noSeatbelt: v })} demerits={50} penalty />
            <CheckItem label="Door opened during event" checked={!!data.doorOpen} onChange={v => setData({ doorOpen: v })} demerits={50} penalty />
            <CheckItem label="Did not activate directional signal (entering/exiting)" checked={!!data.noSignal} onChange={v => setData({ noSignal: v })} demerits={50} penalty />
            <CheckItem label="Did not cancel directional signal" checked={!!data.noCancelSignal} onChange={v => setData({ noCancelSignal: v })} demerits={10} penalty />
          </Card>
        </>
      )}
    </ScoreWrapper>
  )
}
