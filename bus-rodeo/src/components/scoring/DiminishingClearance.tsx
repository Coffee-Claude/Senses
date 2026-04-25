import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CounterInput, CheckItem, SectionTitle } from '../ui'

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  d += Math.min(10, Number(data.jerky ?? 0) * 2)
  d += Math.min(20, Number(data.stops ?? 0) * 4)
  d += Math.min(50, Number(data.flagTips ?? 0) * 10)
  if (data.strikesStandard) d += 50
  if (data.backed) d += 50
  if (data.noComplete) d += 50
  if (data.noSeatbelt) d += 50
  if (data.doorOpen) d += 50
  if (data.noHeadlights) d += 50
  return d
}

export default function DiminishingClearance({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="diminishing_clearance" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Setup Reference</SectionTitle>
            <div className="text-xs text-gray-500 space-y-0.5 pb-3">
              <p>5 pairs of standards · 25 ft apart</p>
              <p>Widths: bus+10" · +8" · +6" · +4" · +2"</p>
            </div>
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Counted Violations</SectionTitle>
            <CounterInput
              label="Jerky/uneven movements"
              value={Number(data.jerky ?? 0)}
              onChange={v => setData({ jerky: v })}
              min={0}
              demeritsEach={2}
              totalDemerits={Math.min(10, Number(data.jerky ?? 0) * 2)}
            />
            <CounterInput
              label="Stops of forward motion"
              value={Number(data.stops ?? 0)}
              onChange={v => setData({ stops: v })}
              min={0}
              demeritsEach={4}
              totalDemerits={Math.min(20, Number(data.stops ?? 0) * 4)}
            />
            <CounterInput
              label="Flag tips touched"
              value={Number(data.flagTips ?? 0)}
              onChange={v => setData({ flagTips: v })}
              min={0}
              demeritsEach={10}
              totalDemerits={Math.min(50, Number(data.flagTips ?? 0) * 10)}
            />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Failures</SectionTitle>
            <CheckItem label="Bus strikes flag standard" checked={!!data.strikesStandard} onChange={v => setData({ strikesStandard: v })} demerits={50} penalty />
            <CheckItem label="Backed bus during event" checked={!!data.backed} onChange={v => setData({ backed: v })} demerits={50} penalty />
            <CheckItem label="Did not complete event" checked={!!data.noComplete} onChange={v => setData({ noComplete: v })} demerits={50} penalty />
            <CheckItem label="Did not wear seat belt" checked={!!data.noSeatbelt} onChange={v => setData({ noSeatbelt: v })} demerits={50} penalty />
            <CheckItem label="Door opened during event" checked={!!data.doorOpen} onChange={v => setData({ doorOpen: v })} demerits={50} penalty />
            <CheckItem label="No headlights on" checked={!!data.noHeadlights} onChange={v => setData({ noHeadlights: v })} demerits={50} penalty />
          </Card>
        </>
      )}
    </ScoreWrapper>
  )
}
