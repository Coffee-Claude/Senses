import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CheckItem, SectionTitle } from '../ui'

// Distance bands in inches: [max_inches, demerits]
const DISTANCE_BANDS = [
  { label: '0" – 2" (perfect)', max: 2, demerits: 0 },
  { label: 'Over 2" – 4"', max: 4, demerits: 3 },
  { label: 'Over 4" – 6"', max: 6, demerits: 6 },
  { label: 'Over 6" – 8"', max: 8, demerits: 9 },
  { label: 'Over 8" – 10"', max: 10, demerits: 12 },
  { label: 'Over 10" – 12"', max: 12, demerits: 15 },
  { label: 'Over 12" – 14"', max: 14, demerits: 18 },
  { label: 'Over 14" – 16"', max: 16, demerits: 21 },
  { label: 'Over 16"', max: 999, demerits: 25 },
]

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  d += Number(data.distanceDemerits ?? 0)
  if (data.beyondLine) d += 25
  if (data.noComplete) d += 25
  if (data.backed) d += 25
  if (data.noSeatbelt) d += 25
  if (data.doorOpen) d += 25
  if (data.noHeadlights) d += 25
  if (data.stopsMoreThanOnce) d += 25
  return d
}

export default function StopLine({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="stop_line" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Distance from Stop Line (bumper to line)</SectionTitle>
            <p className="text-xs text-gray-500 px-0 pb-3">Measured from front surface of bumper to nearest edge of line</p>
            <div className="space-y-2 py-2">
              {DISTANCE_BANDS.map(band => (
                <button
                  key={band.demerits + band.label}
                  onClick={() => setData({ distanceDemerits: band.demerits, distanceBand: band.label })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                    String(data.distanceBand) === band.label
                      ? band.demerits === 0 ? 'border-green-500 bg-green-50 text-green-700'
                      : band.demerits <= 9 ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                      : band.demerits <= 18 ? 'border-orange-400 bg-orange-50 text-orange-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  <span>{band.label}</span>
                  <span>{band.demerits === 0 ? '0 pts' : `−${band.demerits} pts`}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Failures</SectionTitle>
            <CheckItem label="Stops with bumper beyond the stop line" checked={!!data.beyondLine} onChange={v => setData({ beyondLine: v })} demerits={25} penalty />
            <CheckItem label="Did not complete event" checked={!!data.noComplete} onChange={v => setData({ noComplete: v })} demerits={25} penalty />
            <CheckItem label="Backed bus during event" checked={!!data.backed} onChange={v => setData({ backed: v })} demerits={25} penalty />
            <CheckItem label="Did not wear seat belt" checked={!!data.noSeatbelt} onChange={v => setData({ noSeatbelt: v })} demerits={25} penalty />
            <CheckItem label="Door opened during event" checked={!!data.doorOpen} onChange={v => setData({ doorOpen: v })} demerits={25} penalty />
            <CheckItem label="No headlights on" checked={!!data.noHeadlights} onChange={v => setData({ noHeadlights: v })} demerits={25} penalty />
            <CheckItem label="Stopped more than once" checked={!!data.stopsMoreThanOnce} onChange={v => setData({ stopsMoreThanOnce: v })} demerits={25} penalty />
          </Card>
        </>
      )}
    </ScoreWrapper>
  )
}
