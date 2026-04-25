import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CounterInput, CheckItem, SectionTitle } from '../ui'

// Off-center: 2 demerits per inch, max 14 (7 inches)
// Forward of free zone: 5 per 6" or fraction, max 50 (10 increments)
// Behind free zone: 10 per 6" or fraction, max 50 (5 increments)

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  // Forward motions after 1st backup: 6 each, max 42
  d += Math.min(42, Number(data.extraForward ?? 0) * 6)
  // Off center: 2 per inch, max 14
  d += Math.min(14, Number(data.offCenterInches ?? 0) * 2)
  // Forward of free zone: 5 per 6" increment
  d += Math.min(50, Number(data.fwdOf6Increments ?? 0) * 5)
  // Behind free zone: 10 per 6" increment
  d += Math.min(50, Number(data.behindOf6Increments ?? 0) * 10)
  // Absolute failures
  if (data.wheelLimitLine) d += 50
  if (data.frontStandard) d += 50
  if (data.sidelineTouched) d += 50
  if (data.rearBarrier) d += 50
  if (data.noPullBetweenStandards) d += 50
  if (data.noTimeLimit) d += 50
  if (data.noComplete) d += 50
  if (data.noSeatbelt) d += 50
  if (data.doorOpen) d += 50
  if (data.noHeadlights) d += 50
  return d
}

export default function BackupStall({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="backup_stall" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Setup Reference</SectionTitle>
            <div className="text-xs text-gray-500 space-y-0.5 pb-3">
              <p>Stall width: bus + 2 feet · Approach from right only</p>
              <p>1 free backup before demerits · 3-min time limit</p>
              <p>1-ft free zone: 4–5 ft from rear barrier (center of stall)</p>
              <p>Measure from center of front and rear bumper</p>
            </div>
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Movement Counts</SectionTitle>
            <CounterInput
              label="Extra forward motions after 1st backup"
              value={Number(data.extraForward ?? 0)}
              onChange={v => setData({ extraForward: v })}
              min={0} max={7}
              demeritsEach={6}
              totalDemerits={Math.min(42, Number(data.extraForward ?? 0) * 6)}
            />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Final Position Measurement</SectionTitle>
            <CounterInput
              label="Off center (inches, greatest of front/rear)"
              value={Number(data.offCenterInches ?? 0)}
              onChange={v => setData({ offCenterInches: v })}
              min={0} max={7}
              demeritsEach={2}
              totalDemerits={Math.min(14, Number(data.offCenterInches ?? 0) * 2)}
            />
            <p className="text-xs text-gray-400 pb-2">First inch is free (over 1 inch charged)</p>
            <CounterInput
              label={'Forward of free zone (# of 6" increments)'}
              value={Number(data.fwdOf6Increments ?? 0)}
              onChange={v => setData({ fwdOf6Increments: v })}
              min={0} max={10}
              demeritsEach={5}
              totalDemerits={Math.min(50, Number(data.fwdOf6Increments ?? 0) * 5)}
            />
            <CounterInput
              label={'Behind free zone (# of 6" increments)'}
              value={Number(data.behindOf6Increments ?? 0)}
              onChange={v => setData({ behindOf6Increments: v })}
              min={0} max={5}
              demeritsEach={10}
              totalDemerits={Math.min(50, Number(data.behindOf6Increments ?? 0) * 10)}
            />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Absolute Failures (50 demerits each)</SectionTitle>
            <CheckItem label="Tire tread touches wheel limitation line" checked={!!data.wheelLimitLine} onChange={v => setData({ wheelLimitLine: v })} demerits={50} penalty />
            <CheckItem label="Bus touches front upright standards" checked={!!data.frontStandard} onChange={v => setData({ frontStandard: v })} demerits={50} penalty />
            <CheckItem label="Tire tread touches stall sideline" checked={!!data.sidelineTouched} onChange={v => setData({ sidelineTouched: v })} demerits={50} penalty />
            <CheckItem label="Bus extends into/over rear barrier" checked={!!data.rearBarrier} onChange={v => setData({ rearBarrier: v })} demerits={50} penalty />
            <CheckItem label="Did not pull out between front upright standards" checked={!!data.noPullBetweenStandards} onChange={v => setData({ noPullBetweenStandards: v })} demerits={50} penalty />
            <CheckItem label="Did not park, set brake & sound horn in 3 min" checked={!!data.noTimeLimit} onChange={v => setData({ noTimeLimit: v })} demerits={50} penalty />
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
