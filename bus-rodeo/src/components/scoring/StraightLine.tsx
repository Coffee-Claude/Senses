import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CounterInput, CheckItem, SectionTitle } from '../ui'

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  // Jerky: 2 each, max 20
  d += Math.min(20, Number(data.jerky ?? 0) * 2)
  // Stops: 4 each, max 20
  d += Math.min(20, Number(data.stops ?? 0) * 4)
  // Tennis ball touch: 5 each, max 50
  d += Math.min(50, Number(data.ballTouch ?? 0) * 5)
  // Wrong side of pair: 10 each, max 50
  d += Math.min(50, Number(data.wrongSide ?? 0) * 10)
  if (data.noComplete) d += 50
  if (data.noSeatbelt) d += 50
  if (data.doorOpen) d += 50
  if (data.backed) d += 50
  if (data.noHeadlights) d += 50
  return d
}

export default function StraightLine({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="straight_line" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Counted Violations</SectionTitle>
            <p className="text-xs text-gray-500 px-0 pb-2">4 pairs of tennis balls · 25 ft apart · right wheel path</p>
            <CounterInput
              label="Jerky/uneven movements"
              value={Number(data.jerky ?? 0)}
              onChange={v => setData({ jerky: v })}
              min={0}
              demeritsEach={2}
              totalDemerits={Math.min(20, Number(data.jerky ?? 0) * 2)}
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
              label="Tennis ball touched / knocked off"
              value={Number(data.ballTouch ?? 0)}
              onChange={v => setData({ ballTouch: v })}
              min={0}
              demeritsEach={5}
              totalDemerits={Math.min(50, Number(data.ballTouch ?? 0) * 5)}
            />
            <CounterInput
              label="Drove to either side of pair (wrong side)"
              value={Number(data.wrongSide ?? 0)}
              onChange={v => setData({ wrongSide: v })}
              min={0}
              demeritsEach={10}
              totalDemerits={Math.min(50, Number(data.wrongSide ?? 0) * 10)}
            />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Failures</SectionTitle>
            <CheckItem label="Did not complete event" checked={!!data.noComplete} onChange={v => setData({ noComplete: v })} demerits={50} penalty />
            <CheckItem label="Did not wear seat belt" checked={!!data.noSeatbelt} onChange={v => setData({ noSeatbelt: v })} demerits={50} penalty />
            <CheckItem label="Door opened during event" checked={!!data.doorOpen} onChange={v => setData({ doorOpen: v })} demerits={50} penalty />
            <CheckItem label="Backed bus during event" checked={!!data.backed} onChange={v => setData({ backed: v })} demerits={50} penalty />
            <CheckItem label="No headlights on" checked={!!data.noHeadlights} onChange={v => setData({ noHeadlights: v })} demerits={50} penalty />
          </Card>
        </>
      )}
    </ScoreWrapper>
  )
}
