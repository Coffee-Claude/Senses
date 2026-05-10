import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CheckItem, CounterInput, SectionTitle } from '../ui'

const FLAG_TIP_DEMERITS = [0, 7, 21, 42, 50, 62, 75]

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  // Flag tips touched (1=7, 2=21, 3=42, 4=50, 5=62, 6=75)
  const tips = Math.min(6, Number(data.flagTips ?? 0))
  d += FLAG_TIP_DEMERITS[tips]
  // Stops (8 each, max 16)
  const stops = Math.min(2, Number(data.stops ?? 0))
  d += stops * 8
  // Failures
  if (data.backed) d += 75
  if (data.barrier) d += 50
  if (data.noSeatbelt) d += 50
  if (data.doorOpen) d += 50
  if (data.noHeadlights) d += 50
  if (data.timeout) d += 50
  return d
}

export default function OffsetAlley({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="offset_alley" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Counted Violations</SectionTitle>
            <CounterInput
              label="Flag tips touched"
              value={Number(data.flagTips ?? 0)}
              onChange={v => setData({ flagTips: v })}
              min={0} max={6}
              totalDemerits={FLAG_TIP_DEMERITS[Math.min(6, Number(data.flagTips ?? 0))]}
            />
            <p className="text-xs text-gray-400 px-0 pb-2">1=7 · 2=21 · 3=42 · 4=50 · 5=62 · 6=75 demerits</p>
            <CounterInput
              label="Stops of forward motion"
              value={Number(data.stops ?? 0)}
              onChange={v => setData({ stops: v })}
              min={0} max={2}
              demeritsEach={8}
              totalDemerits={Math.min(2, Number(data.stops ?? 0)) * 8}
            />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Disqualifying Violations (check if occurred)</SectionTitle>
            <CheckItem label="Backed bus during event" checked={!!data.backed} onChange={v => setData({ backed: v })} demerits={75} penalty />
            <CheckItem label="Vehicle touched a barrier" checked={!!data.barrier} onChange={v => setData({ barrier: v })} demerits={50} penalty />
            <CheckItem label="Did not wear seat belt" checked={!!data.noSeatbelt} onChange={v => setData({ noSeatbelt: v })} demerits={50} penalty />
            <CheckItem label="Door opened during event" checked={!!data.doorOpen} onChange={v => setData({ doorOpen: v })} demerits={50} penalty />
            <CheckItem label="No headlights on" checked={!!data.noHeadlights} onChange={v => setData({ noHeadlights: v })} demerits={50} penalty />
            <CheckItem label="Did not complete within 2-minute limit" checked={!!data.timeout} onChange={v => setData({ timeout: v })} demerits={50} penalty />
          </Card>
        </>
      )}
    </ScoreWrapper>
  )
}
